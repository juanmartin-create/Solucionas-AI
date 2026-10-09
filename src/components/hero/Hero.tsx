"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_ARRAY, win } from "@/lib/gsap";
import { useReducedMotion, useStaticPath } from "@/hooks/useMedia";
import { useTrackProgress } from "@/hooks/useTrackProgress";
import { createParticleScene, type ParticleScene } from "./particleScene";

/** Color de cada servicio (el mismo de Práctica y "Para quién"). */
const SERVICE = [
  { label: "Web que vende", color: "#3fe6ff" },
  { label: "Cobros online", color: "#3dffaf" },
  { label: "App propia", color: "#ff4fd8" },
  { label: "Agente con IA", color: "#ffb340" },
];

/**
 * Inicio contado con el scroll (método de los reels: una línea de tiempo, un
 * concepto por vez). Titular → Webs → Sistemas → Apps → Agentes → cierre.
 * Cada capítulo enciende su hilo en el nodo dorado; el resto queda tenue.
 */

const HEAD: [string, boolean][] = [
  ["Webs,", false],
  ["sistemas", false],
  ["y", false],
  ["agentes", false],
  ["que", true],
  ["venden", true],
  ["solos.", true],
];

/** Capítulos: palabra grande, remate en itálica dorada y qué hilo enciende. */
const CHAPTERS = [
  { word: "Webs", line: "que reciben consultas las 24 h.", sat: 0 },
  { word: "Sistemas", line: "que cobran con Mercado Pago.", sat: 1 },
  { word: "Apps", line: "que tus clientes usan todos los días.", sat: 2 },
  { word: "Agentes", line: "que venden por chat.", sat: 3 },
];

// Ventanas del relato sobre el progreso p (0→1) del track.
const HEAD_OUT: [number, number] = [0.06, 0.13];
const CH0 = 0.14;
const CH_LEN = 0.16;
const CLOSE_IN = CH0 + CH_LEN * 4; // 0.78

const ENTER = { duration: 0.9, ease: EASE_ARRAY };
const o5 = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 5);

/** Máscara: la pieza sube desde abajo (135 %) y se va por arriba. */
function maskY(p: number, inA: number, inB: number, outA: number, outB: number) {
  return (1 - o5(win(p, inA, inB))) * 135 - o5(win(p, outA, outB)) * 135;
}

function setVis(el: HTMLElement | null, on: boolean) {
  if (el) el.style.visibility = on ? "visible" : "hidden";
}

const titleCls = "font-accent font-normal leading-[0.98] tracking-[-0.025em] text-ink";
const gold = (s: string) => <em className="[text-shadow:none]">{s}</em>;

function Masked({ children, refFn }: { children: ReactNode; refFn: (el: HTMLSpanElement | null) => void }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] align-top">
      <span ref={refFn} className="inline-block will-change-transform" style={{ transform: "translate3d(0,135%,0)" }}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const isStatic = useStaticPath();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ParticleScene | null>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headWords = useRef<(HTMLSpanElement | null)[]>([]);
  const restRef = useRef<HTMLDivElement>(null);
  const chRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chParts = useRef<(HTMLSpanElement | null)[][]>(CHAPTERS.map(() => []));
  const closeRef = useRef<HTMLDivElement>(null);
  const closeParts = useRef<(HTMLSpanElement | null)[]>([]);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cueRef = useRef<HTMLDivElement>(null);

  /* ---------------- escena 3D ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = createParticleScene(canvas, { still: reduced, compact: isStatic });
    sceneRef.current = scene;

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) scene.start();
      else scene.stop();
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
      scene.dispose();
      sceneRef.current = null;
    };
  }, [isStatic, reduced]);

  /* ---------------- relato con el scroll: todo es función pura de p ---------------- */
  useTrackProgress(
    trackRef,
    (p) => {
      if (isStatic) return;
      const scene = sceneRef.current;

      // portada: el titular sale palabra por palabra
      headWords.current.forEach((w, i) => {
        if (!w) return;
        const d = i * 0.006;
        w.style.transform = `translate3d(0, ${maskY(p, -1, -0.5, HEAD_OUT[0] + d, HEAD_OUT[1] + d)}%, 0)`;
      });
      if (restRef.current) restRef.current.style.opacity = String(1 - win(p, HEAD_OUT[0] - 0.02, HEAD_OUT[0] + 0.03));
      setVis(headRef.current, p < HEAD_OUT[1] + 0.05);

      // capítulos
      const focus = [0, 0, 0, 0];
      CHAPTERS.forEach((c, k) => {
        const a = CH0 + k * CH_LEN;
        const b = a + CH_LEN;
        chParts.current[k].forEach((el, j) => {
          if (!el) return;
          const d = j * 0.012;
          el.style.transform = `translate3d(0, ${maskY(p, a + d, a + 0.04 + d, b - 0.035 + d * 0.3, b - 0.004 + d * 0.3)}%, 0)`;
        });
        setVis(chRefs.current[k], p > a - 0.01 && p < b + 0.02);
        focus[c.sat] = Math.max(focus[c.sat], win(p, a, a + 0.04) * (1 - win(p, b - 0.03, b)));
        const dot = dotsRef.current[k];
        if (dot) dot.style.opacity = p >= a && p < b ? "1" : "0.25";
      });

      // la forma: esfera → web → cobro → app → agente → esfera con órbita.
      // Cada cambio arranca justo antes de que entre el texto del capítulo.
      const starts = [...CHAPTERS.map((_, k) => CH0 + k * CH_LEN), CLOSE_IN];
      const stage = starts.reduce((acc, a) => acc + win(p, a - 0.05, a + 0.03), 0);
      scene?.setStage(stage);
      const k = focus.findIndex((f) => f > 0.5);
      if (k >= 0) scene?.setTint(SERVICE[k].color, 0.9);
      else scene?.setTint("#c9a45c", 0);

      closeParts.current.forEach((el, j) => {
        if (!el) return;
        const d = j * 0.012;
        el.style.transform = `translate3d(0, ${maskY(p, CLOSE_IN + d, CLOSE_IN + 0.06 + d, 2, 3)}%, 0)`;
      });
      setVis(closeRef.current, p > CLOSE_IN - 0.01);
      if (cueRef.current) cueRef.current.style.opacity = String(1 - win(p, 0, 0.05));
    },
    { enabled: !isStatic, rebindKey: isStatic },
  );

  const ctas = (
    <>
      <a href="#empezar" className="btn btn-hover">
        Agendá un diagnóstico
      </a>
      <a href="#casos" className="btn-ghost">
        Ver los casos
      </a>
    </>
  );

  /* ---------------- mobile / reduced motion: sin pin ---------------- */
  if (isStatic) {
    return (
      <section ref={trackRef} className="relative bg-ground" aria-label="Inicio">
        <div className="flex flex-col px-[var(--page-margin)] pb-20 pt-24">
          <div className="relative -mx-[var(--page-margin)] aspect-square w-[calc(100%+2*var(--page-margin))]">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="smallcaps -mt-4 text-accent">Estudio de soluciones con IA · Buenos Aires</div>
          <h1 className={`${titleCls} mt-5`} style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)" }}>
            Webs, sistemas y agentes {gold("que venden solos.")}
          </h1>
          <p className="smallcaps mt-6 leading-[1.9] text-ink/60">Para constructoras, barberías, gimnasios y e-commerce.</p>
          <div className="mt-8 flex flex-wrap gap-3">{ctas}</div>
          <ul className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8">
            {CHAPTERS.map((c) => (
              <li key={c.word} className={titleCls} style={{ fontSize: "1.9rem" }}>
                <span
                  aria-hidden
                  className="mr-3 inline-block h-2 w-2 -translate-y-1.5 rounded-full"
                  style={{ background: SERVICE[c.sat].color, boxShadow: `0 0 10px ${SERVICE[c.sat].color}` }}
                />
                {c.word} {gold(c.line)}
              </li>
            ))}
          </ul>
        </div>
        <div className="h-svh bg-ground" aria-hidden />
      </section>
    );
  }

  /* ---------------- escritorio: pinneado, contado con el scroll ---------------- */
  return (
    <section ref={trackRef} className="relative bg-ground" style={{ height: "calc(420vh + 100svh)" }} aria-label="Inicio">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(45% 55% at 70% 50%, rgba(201,164,92,0.11), transparent 70%)" }} />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute inset-y-0 left-[var(--page-margin)] flex w-[min(48rem,50vw)] items-center">
          {/* portada */}
          <div ref={headRef} className="absolute inset-x-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...ENTER, delay: 0.1 }} className="smallcaps text-accent">
              Estudio de soluciones con IA · Buenos Aires
            </motion.div>
            <h1 className={`${titleCls} mt-6`} style={{ fontSize: "clamp(3rem, 5.6vw, 6.2rem)" }} aria-label="Webs, sistemas y agentes que venden solos.">
              {HEAD.map(([w, isGold], i) => (
                <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.14em] align-top" style={{ marginRight: "0.22em" }}>
                  <motion.span
                    className="inline-block"
                    initial={{ y: "135%" }}
                    animate={{ y: "0%" }}
                    transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1, delay: 0.25 + i * 0.06 }}
                  >
                    <span
                      ref={(el) => {
                        headWords.current[i] = el;
                      }}
                      className="inline-block will-change-transform"
                    >
                      {isGold ? gold(w) : w}
                    </span>
                  </motion.span>
                </span>
              ))}
            </h1>
            <div ref={restRef}>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTER, delay: 0.9 }} className="smallcaps mt-8 leading-[1.9] text-ink/60">
                Para constructoras, barberías, gimnasios y e-commerce.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ENTER, delay: 1.05 }}
                className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3"
              >
                {ctas}
              </motion.div>
            </div>
          </div>

          {/* capítulos: una idea por vez */}
          {CHAPTERS.map((c, k) => (
            <div
              key={c.word}
              ref={(el) => {
                chRefs.current[k] = el;
              }}
              className="absolute inset-x-0"
              style={{ visibility: "hidden" }}
              aria-hidden
            >
              <div className="smallcaps" style={{ color: SERVICE[c.sat].color }}>
                <Masked refFn={(el) => void (chParts.current[k][0] = el)}>
                  0{k + 1} · {SERVICE[c.sat].label}
                </Masked>
              </div>
              <div className={`${titleCls} mt-4`} style={{ fontSize: "clamp(4.5rem, 9vw, 9.5rem)" }}>
                <Masked refFn={(el) => void (chParts.current[k][1] = el)}>{c.word}</Masked>
              </div>
              <div className={`${titleCls} mt-1`} style={{ fontSize: "clamp(1.8rem, 2.8vw, 3rem)" }}>
                <Masked refFn={(el) => void (chParts.current[k][2] = el)}>{gold(c.line)}</Masked>
              </div>
            </div>
          ))}

          {/* cierre */}
          <div ref={closeRef} className="absolute inset-x-0" style={{ visibility: "hidden" }} aria-hidden>
            <div className={titleCls} style={{ fontSize: "clamp(3rem, 5.6vw, 6.2rem)" }}>
              <div>
                <Masked refFn={(el) => void (closeParts.current[0] = el)}>Todo conectado</Masked>
              </div>
              <div>
                <Masked refFn={(el) => void (closeParts.current[1] = el)}>{gold("a tu negocio.")}</Masked>
              </div>
            </div>
          </div>
        </div>

        {/* índice de capítulos */}
        <div className="pointer-events-none absolute bottom-10 left-[var(--page-margin)] flex gap-2" aria-hidden>
          {CHAPTERS.map((c, k) => (
            <span
              key={c.word}
              ref={(el) => {
                dotsRef.current[k] = el;
              }}
              className="h-[3px] w-8 rounded-full transition-opacity duration-300"
              style={{ background: SERVICE[c.sat].color, opacity: 0.25 }}
            />
          ))}
        </div>

        <div ref={cueRef} className="smallcaps pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-ink/50">
          Scroll
          <span className="block h-10 w-px bg-gradient-to-b from-accent to-transparent" />
        </div>
      </div>
    </section>
  );
}
