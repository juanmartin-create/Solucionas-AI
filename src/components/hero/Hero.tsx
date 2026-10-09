"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { EASE_ARRAY, lerp, win } from "@/lib/gsap";
import { useReducedMotion, useStaticPath } from "@/hooks/useMedia";
import { useTrackProgress } from "@/hooks/useTrackProgress";
import { SATS, createNodeScene, type NodeScene } from "./nodeScene";

const ENTER = { duration: 0.9, ease: EASE_ARRAY };

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
        el.style.transform = `translate3d(${l.x}px, ${l.y}px, 0)`;
        el.style.opacity = String(l.visible);
      });
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
      if (copyRef.current) {
        const t = win(p, 0.02, 0.18);
        copyRef.current.style.transform = `translate3d(0, ${lerp(0, -12, t)}vh, 0)`;
        setHidden(copyRef.current, 1 - t);
      }
      if (cueRef.current) setHidden(cueRef.current, 1 - win(p, 0, 0.08));
    },
    { enabled: !isStatic, rebindKey: isStatic },
  );

  const copy = (
    <>
      <div className="smallcaps text-accent">Estudio de soluciones con IA · Buenos Aires</div>
      <h1
        className="mt-6 font-display leading-[1.02] tracking-[-0.03em] text-ink"
        style={{ fontSize: isStatic ? "clamp(2.2rem, 9vw, 3rem)" : "clamp(2.4rem, 4.6vw, 5rem)" }}
      >
        Webs, sistemas y agentes <em>que venden solos.</em>
      </h1>
      <p className="smallcaps mt-8 max-w-[44ch] leading-[1.9] text-ink/60">
        Para constructoras, barberías, gimnasios y e-commerce.
      </p>
      <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3">
        <a href="#empezar" className="btn btn-hover">
          Agendá un diagnóstico
        </a>
        <a href="#casos" className="btn-ghost">
          Ver los casos
        </a>
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
          <span
            className="smallcaps -translate-x-1/2 translate-y-5 inline-block whitespace-nowrap"
            style={{ color: s.color, textShadow: `0 0 12px ${s.color}88` }}
          >
            {s.label}
          </span>
        </div>
      ))}
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
          <motion.div
            ref={copyRef}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...ENTER, delay: 0.2 }}
            className="ml-[var(--page-margin)] w-[min(46rem,52vw)] will-change-transform"
          >
            {copy}
          </motion.div>
        </div>

        <div ref={cueRef} className="smallcaps pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-ink/50">
          Scroll
          <span className="block h-10 w-px bg-gradient-to-b from-accent to-transparent" />
        </div>
      </div>
    </section>
  );
}
