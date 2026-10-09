"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { EASE_ARRAY, lerp, win } from "@/lib/gsap";
import { useReducedMotion, useStaticPath } from "@/hooks/useMedia";
import { useTrackProgress } from "@/hooks/useTrackProgress";
import { SATS, createNodeScene, type NodeScene } from "./nodeScene";

const ENTER = { duration: 0.9, ease: EASE_ARRAY };

/** Titular palabra por palabra: [palabra, va en itálica dorada]. */
const HEADLINE: [string, boolean][] = [
  ["Webs,", false],
  ["sistemas", false],
  ["y", false],
  ["agentes", false],
  ["que", true],
  ["venden", true],
  ["solos.", true],
];

function setHidden(el: HTMLElement, opacity: number) {
  el.style.opacity = String(opacity);
  el.style.visibility = opacity < 0.02 ? "hidden" : "visible";
}

/**
 * Inicio: titular + el nodo dorado 3D de la marca. El nodo conecta con hilos de
 * neón los cuatro servicios y reacciona al scroll (se acerca y gira) y al mouse.
 */
export function Hero() {
  const isStatic = useStaticPath();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sceneRef = useRef<NodeScene | null>(null);

  /* ---------------- escena 3D ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = createNodeScene(canvas, { still: reduced, compact: isStatic });
    sceneRef.current = scene;

    // etiquetas HTML que siguen a los satélites
    let raf = 0;
    const place = () => {
      scene.labels().forEach((l, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        // que la etiqueta nunca se corte contra el borde
        const x = Math.min(window.innerWidth - 110, Math.max(110, l.x));
        el.style.transform = `translate3d(${x}px, ${l.y}px, 0)`;
        el.style.opacity = String(l.visible);
      });
      const c = scene.center();
      if (centerRef.current) {
        centerRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
        centerRef.current.style.opacity = String(c.visible);
      }
      raf = requestAnimationFrame(place);
    };

    // solo se dibuja mientras el inicio está en pantalla
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        scene.start();
        if (!raf) raf = requestAnimationFrame(place);
      } else {
        scene.stop();
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => scene.resize());
    ro.observe(canvas);
    const onMove = (e: PointerEvent) => scene.setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    window.addEventListener("pointermove", onMove);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      scene.dispose();
      sceneRef.current = null;
    };
  }, [isStatic, reduced]);

  /* ---------------- scroll ---------------- */
  useTrackProgress(
    trackRef,
    (p) => {
      if (isStatic) return;
      sceneRef.current?.setScroll(p);
      // salida cinética: cada palabra sube y se apaga con un pequeño desfase
      wordRefs.current.forEach((w, i) => {
        if (!w) return;
        const t = win(p, 0.015 + i * 0.008, 0.11 + i * 0.008);
        w.style.transform = `translate3d(0, ${lerp(0, -110, t * t)}%, 0)`;
        w.style.opacity = String(1 - t);
      });
      if (copyRef.current) {
        const t = win(p, 0.06, 0.2);
        copyRef.current.style.setProperty("--rest", String(1 - t));
        setHidden(copyRef.current, p > 0.21 ? 0 : 1);
      }
      if (cueRef.current) setHidden(cueRef.current, 1 - win(p, 0, 0.08));
    },
    { enabled: !isStatic, rebindKey: isStatic },
  );

  const copy = (
    <>
      <div className="smallcaps text-accent">Estudio de soluciones con IA · Buenos Aires</div>
      <h1
        className="mt-6 font-display leading-[1.06] tracking-[-0.03em] text-ink"
        style={{ fontSize: isStatic ? "clamp(2.2rem, 9vw, 3rem)" : "clamp(2.4rem, 4.6vw, 5rem)" }}
        aria-label="Webs, sistemas y agentes que venden solos."
      >
        {HEADLINE.map(([w, gold], i) => (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-top" style={{ marginRight: "0.24em" }}>
            {/* entrada: la palabra sube desde abajo de su máscara */}
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 4 }}
              animate={{ y: "0%", rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9, delay: 0.25 + i * 0.07 }}
            >
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="inline-block will-change-transform"
              >
                {gold ? <em>{w}</em> : w}
              </span>
            </motion.span>
          </span>
        ))}
      </h1>
      <div style={{ opacity: "var(--rest, 1)" }}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTER, delay: 0.95 }}
        className="smallcaps mt-8 max-w-[44ch] leading-[1.9] text-ink/60"
      >
        Para constructoras, barberías, gimnasios y e-commerce.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTER, delay: 1.1 }}
        className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3"
      >
        <a href="#empezar" className="btn btn-hover">
          Agendá un diagnóstico
        </a>
        <a href="#casos" className="btn-ghost">
          Ver los casos
        </a>
      </motion.div>
      </div>
    </>
  );

  const labels = (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {SATS.map((s, i) => (
        <div
          key={s.key}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="-translate-x-1/2 translate-y-6 whitespace-nowrap rounded-lg border border-white/10 bg-black/55 px-3 py-1.5 text-center backdrop-blur-sm">
            <div className="smallcaps" style={{ color: s.color, textShadow: `0 0 12px ${s.color}88` }}>
              {s.label}
            </div>
            <div className="mt-1 font-mono text-[0.68rem] tracking-[0.06em] text-ink/55">{s.sub}</div>
          </div>
        </div>
      ))}
      <div ref={centerRef} className="absolute left-0 top-0 will-change-transform" style={{ opacity: 0 }}>
        <div className="smallcaps -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/50 bg-black/40 px-3 py-1 text-accent backdrop-blur-sm">
          Tu negocio
        </div>
      </div>
    </div>
  );

  /* ---------------- mobile / reduced motion: sin pin ---------------- */
  if (isStatic) {
    return (
      <section ref={trackRef} className="relative bg-ground" aria-label="Inicio">
        <div className="flex min-h-svh flex-col px-[var(--page-margin)] pb-16 pt-24">
          <div className="relative -mx-[var(--page-margin)] aspect-square w-[calc(100%+2*var(--page-margin))]">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            {labels}
          </div>
          <div className="-mt-6">{copy}</div>
        </div>
        <div className="h-svh bg-ground" aria-hidden />
      </section>
    );
  }

  /* ---------------- escritorio: pinneado, el nodo se mueve con el scroll ---------------- */
  return (
    <section ref={trackRef} className="relative bg-ground" style={{ height: "calc(220vh + 100svh)" }} aria-label="Inicio">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(45% 55% at 68% 50%, rgba(201,164,92,0.12), transparent 70%)" }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {labels}

        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div ref={copyRef} className="ml-[var(--page-margin)] w-[min(46rem,52vw)]">
            {copy}
          </div>
        </div>

        <div ref={cueRef} className="smallcaps pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-ink/50">
          Scroll
          <span className="block h-10 w-px bg-gradient-to-b from-accent to-transparent" />
        </div>
      </div>
    </section>
  );
}
