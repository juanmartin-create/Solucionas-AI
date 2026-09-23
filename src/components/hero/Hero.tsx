"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { CASES, SITE } from "@/lib/site";
import { EASE_ARRAY, lerp, win } from "@/lib/gsap";
import { useStaticPath } from "@/hooks/useMedia";
import { useTrackProgress } from "@/hooks/useTrackProgress";
import { LAYOUT, renderHero, type Screen } from "./heroScene";

const NOTES = [
  { name: "Webs", line: "Editoriales y cinematográficas", time: "3 a 5 semanas" },
  { name: "Sistemas", line: "Cobros, panel, emails automáticos", time: "6 semanas" },
  { name: "Agentes", line: "Chat, WhatsApp, Telegram", time: "4 semanas" },
];

const CARD_WINDOWS: [number, number][] = [
  [0.02, 0.1],
  [0.06, 0.14],
  [0.1, 0.18],
];

const ENTER = { duration: 0.6, ease: EASE_ARRAY };

function setHidden(el: HTMLElement, opacity: number) {
  el.style.opacity = String(opacity);
  el.style.visibility = opacity < 0.02 ? "hidden" : "visible";
}

export function Hero() {
  const isStatic = useStaticPath();
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLHeadingElement>(null);

  const screensRef = useRef<Screen[]>(
    LAYOUT.map((l) => ({ ...l, img: null, ratio: 1.6 })),
  );
  const progressRef = useRef(0);
  const frameReq = useRef(0);

  /* ---------------- canvas: carga y dibujo ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Las seis capturas pesan ~420 KB en total, así que se cargan también en
    // mobile: un stack completo se ve mejor que bocetos encimados.
    const limit = CASES.length;

    const draw = () => {
      frameReq.current = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = canvas.clientWidth;
      const vh = canvas.clientHeight;
      if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
        canvas.width = vw * dpr;
        canvas.height = vh * dpr;
      }
      renderHero(ctx, screensRef.current, progressRef.current, vw, vh, dpr);
    };
    const schedule = () => {
      if (!frameReq.current) frameReq.current = requestAnimationFrame(draw);
    };
    (canvas as HTMLCanvasElement & { __schedule?: () => void }).__schedule = schedule;

    CASES.slice(0, limit).forEach((c, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        screensRef.current[i].img = img;
        screensRef.current[i].ratio = img.naturalWidth / img.naturalHeight;
        schedule();
      };
      img.src = c.image;
    });

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      if (frameReq.current) cancelAnimationFrame(frameReq.current);
      frameReq.current = 0; // si no, el próximo árbol nunca vuelve a pedir un frame
    };
    // El árbol cambia entre el camino estático y el scrubbeado: el canvas es otro.
  }, [isStatic]);

  /* ---------------- scroll: función pura del progreso ---------------- */
  useTrackProgress(
    trackRef,
    (p) => {
      progressRef.current = isStatic ? 1 : p;
      const c = canvasRef.current as
        | (HTMLCanvasElement & { __schedule?: () => void })
        | null;
      c?.__schedule?.();
      if (isStatic) return;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = win(p, CARD_WINDOWS[i][0], CARD_WINDOWS[i][1]);
        el.style.transform = `translate3d(${lerp(0, -45, t)}vw, 0, 0)`;
        setHidden(el, 1 - t);
      });
      if (rightRef.current) {
        const t = win(p, 0.04, 0.16);
        rightRef.current.style.transform = `translate3d(${lerp(0, 45, t)}vw, 0, 0)`;
        setHidden(rightRef.current, 1 - t);
      }
      if (markRef.current) {
        const t = win(p, 0.04, 0.2);
        markRef.current.style.transform = `translate3d(0, ${lerp(0, 115, t)}%, 0) scale(${lerp(1, 0.96, t)})`;
        setHidden(markRef.current, 1 - t);
      }
    },
    { enabled: true, rebindKey: isStatic },
  );

  /* ---------------- camino estático ---------------- */
  if (isStatic) {
    return (
      <section className="relative bg-ground" aria-label="Inicio">
        <div
          ref={trackRef}
          className="relative flex min-h-svh flex-col gap-10 px-[var(--page-margin)] pb-10 pt-24"
        >
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
            {NOTES.map((n) => (
              <Note key={n.name} {...n} />
            ))}
          </div>
          {/* el ensamblado, ya terminado, en su propio bloque */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 11" }}>
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-body max-w-[30ch] text-muted">
              Un estudio chico que diseña y construye lo que tu negocio necesita para vender:
              la web, el sistema que cobra y el agente que responde.
            </p>
            <div>
              <Cta />
            </div>
            <h1 className="text-display mt-6 leading-[0.82] tracking-[-0.02em]">{SITE.name}</h1>
          </div>
        </div>
        <div className="h-svh bg-ground" aria-hidden />
      </section>
    );
  }

  /* ---------------- camino scrubbeado ---------------- */
  return (
    <section
      ref={trackRef}
      className="relative bg-ground"
      style={{ height: "calc(350vh + 100svh)" }}
      aria-label="Inicio"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* overlay */}
        <div className="pointer-events-none absolute inset-0">
          {/* arriba izquierda: tres notas */}
          <div
            className="absolute left-[var(--page-margin)] flex flex-col gap-4"
            style={{ top: "clamp(4.5rem, 10vh, 6.5rem)" }}
          >
            {NOTES.map((n, i) => (
              <motion.div
                key={n.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...ENTER, delay: 0.15 + i * 0.12 }}
                className="will-change-transform"
              >
                <Note {...n} />
              </motion.div>
            ))}
          </div>

          {/* arriba derecha: párrafo + botón */}
          <motion.div
            ref={rightRef}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...ENTER, delay: 0.3 }}
            className="absolute right-[var(--page-margin)] flex max-w-[30ch] flex-col items-end gap-6 text-right will-change-transform"
            style={{ top: "clamp(4.5rem, 10vh, 6.5rem)" }}
          >
            <p className="text-body text-muted">
              Un estudio chico que diseña y construye lo que tu negocio necesita para
              vender: la web, el sistema que cobra y el agente que responde. Todo
              publicado, medido y en producción.
            </p>
            <div className="pointer-events-auto">
              <Cta />
            </div>
          </motion.div>

          {/* abajo centro: wordmark */}
          <motion.h1
            ref={markRef}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...ENTER, delay: 0.05 }}
            className="absolute bottom-[0.04em] left-1/2 -translate-x-1/2 whitespace-nowrap font-display leading-none tracking-[-0.02em] will-change-transform"
            style={{
              fontSize: "clamp(3.25rem, min(17.5vw, 34svh), 19rem)",
              backgroundImage: "linear-gradient(to bottom, var(--ink) 55%, rgba(21,20,15,0.35))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {SITE.name}
          </motion.h1>
        </div>
      </div>
    </section>
  );
}

function Note({ name, line, time }: { name: string; line: string; time: string }) {
  return (
    <div className="w-[15.5rem] bg-ground-2/85 p-5 backdrop-blur-[2px]">
      <div className="text-h2 leading-none">{name}</div>
      <div className="text-body mt-2">{line}</div>
      <div className="text-small mt-1 text-muted">{time}</div>
    </div>
  );
}

function Cta() {
  return (
    <a
      href="#empezar"
      className="text-small inline-block bg-ink px-7 py-3.5 text-ground transition-colors duration-500 hover:bg-accent-deep"
    >
      Pedir una propuesta
    </a>
  );
}
