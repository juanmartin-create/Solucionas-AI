"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CASES } from "@/lib/site";
import { EASE_ARRAY, lerp, win, clamp01 } from "@/lib/gsap";
import { useStaticPath } from "@/hooks/useMedia";
import { useTrackProgress } from "@/hooks/useTrackProgress";
import { Cascade } from "./Cascade";

const N = CASES.length;
const XF = 0.04; // semiventana del crossfade

/** Opacidad del caso i como función pura del progreso del descenso (0→1). */
function caseOpacity(i: number, d: number) {
  const a = i / N;
  const b = (i + 1) / N;
  const fadeIn = i === 0 ? 1 : win(d, a - XF, a + XF);
  const fadeOut = i === N - 1 ? 0 : win(d, b - XF, b + XF);
  return clamp01(fadeIn - fadeOut);
}

function activeIndex(d: number) {
  return Math.min(N - 1, Math.max(0, Math.floor(d * N)));
}

function hide(el: HTMLElement | null, t: number) {
  if (!el) return;
  el.style.opacity = String(1 - t);
  el.style.visibility = t > 0.98 ? "hidden" : "visible";
}

export function Descent() {
  const isStatic = useStaticPath();
  const trackRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const screenRef = useRef<HTMLDivElement>(null);
  const glowWrapRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [houseIn, setHouseIn] = useState(false);

  useTrackProgress(
    trackRef,
    (p) => {
      // Los seis pasos ocurren en el primer 60% del track.
      const d = win(p, 0, 0.6);

      // renders + glows
      imgRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = String(caseOpacity(i, d));
      });
      glowRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = String(caseOpacity(i, d));
      });
      const idx = activeIndex(d);
      setActive((a) => (a === idx ? a : idx));

      // escala suave del render
      const sink = win(p, 0.6, 0.7);
      if (screenRef.current) {
        screenRef.current.style.transform = `translate3d(0, ${lerp(0, 30, sink)}vh, 0) scale(${lerp(1, 1.06, d)})`;
        hide(screenRef.current, win(p, 0.6, 0.68));
      }

      // ---- handoff ----
      const dark = win(p, 0.58, 0.66);
      if (glowWrapRef.current) glowWrapRef.current.style.opacity = String(1 - dark);
      if (pitchRef.current) pitchRef.current.style.opacity = String(dark);

      const exit = win(p, 0.6, 0.68);
      const railFade = win(p, 0.6, 0.66);
      if (leftRef.current) {
        leftRef.current.style.transform = `translate3d(${lerp(0, -45, exit)}vw, 0, 0)`;
        hide(leftRef.current, railFade);
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translate3d(${lerp(0, 30, exit)}vw, 0, 0)`;
        hide(rightRef.current, railFade);
      }
      if (nameRef.current) {
        nameRef.current.style.transform = `translate3d(0, ${lerp(0, 40, exit)}vh, 0)`;
        hide(nameRef.current, exit);
      }

      const dawn = win(p, 0.66, 0.8);
      if (dawnRef.current) {
        dawnRef.current.style.transform = `translate3d(0, ${lerp(100, 0, dawn)}%, 0)`;
      }

      const enter = p >= 0.8;
      setHouseIn((h) => (h === enter ? h : enter));

      if (parallaxRef.current) {
        const t = win(p, 0.8, 1);
        parallaxRef.current.style.transform = `translate3d(0, ${lerp(40, 0, t)}px, 0)`;
      }
    },
    { enabled: !isStatic, rebindKey: isStatic },
  );

  const current = CASES[active];

  if (isStatic) return <DescentStatic />;

  return (
    <section
      id="casos"
      ref={trackRef}
      className="relative"
      style={{ height: "650vh" }}
      aria-label="Casos"
    >
      <div
        className="sticky top-0 h-svh w-full overflow-hidden text-ground"
        style={{
          background: "linear-gradient(160deg, var(--accent-deep) 0%, var(--pitch) 85%)",
        }}
      >
        {/* glow radial: la sala iluminada por la pantalla */}
        <div ref={glowWrapRef} className="absolute inset-0" aria-hidden>
          {CASES.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                glowRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(46% 42% at 50% 48%, ${c.glow}, transparent 70%)`,
                opacity: i === 0 ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* capa negra neutra del handoff */}
        <div ref={pitchRef} className="absolute inset-0 bg-pitch" style={{ opacity: 0 }} aria-hidden />

        {/* nombre del caso, escala display, detrás de la pantalla */}
        <div
          ref={nameRef}
          className="absolute inset-x-0 flex justify-center will-change-transform"
          style={{ bottom: "5vh" }}
        >
          <div
            className="font-display leading-none tracking-[-0.02em] text-ground"
            style={{ fontSize: "clamp(2.75rem, 7.5vw, 8.5rem)" }}
          >
            <Cascade text={current.name} as="h2" />
          </div>
        </div>

        {/* pantalla central */}
        <div
          ref={screenRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{ width: "min(50vw, calc(58vh * 1.4))", aspectRatio: "1.4" }}
        >
          {CASES.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              className="absolute inset-0 overflow-hidden rounded-[10px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <img
                src={c.image}
                alt={`${c.name}: ${c.kind}`}
                className="h-full w-full object-cover object-top"
                loading={i < 2 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* riel izquierdo: la línea del caso activo */}
        <div
          ref={leftRef}
          className="absolute left-[var(--page-margin)] top-1/2 w-[min(24ch,20vw)] -translate-y-1/2 will-change-transform"
        >
          <div className="smallcaps mb-3 text-ground/50">{current.kind}</div>
          <div className="relative h-[7.5rem] overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.p
                key={current.id}
                initial={{ y: "1.2em", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-1.2em", opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_ARRAY }}
                className="text-small absolute inset-x-0 top-0 text-ground/70"
              >
                {current.line}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="text-small text-ground/40">{current.stack}</div>
        </div>

        {/* riel derecho: índices */}
        <div
          ref={rightRef}
          className="absolute right-[var(--page-margin)] top-1/2 flex -translate-y-1/2 flex-col items-end gap-2 will-change-transform"
        >
          {CASES.map((c, i) => (
            <span
              key={c.id}
              className={`font-display text-[1.25rem] leading-none transition-colors duration-500 ${
                i === active ? "text-ground" : "text-ground/30"
              }`}
            >
              {c.index}
            </span>
          ))}
        </div>

        {/* amanecer */}
        <div
          ref={dawnRef}
          className="absolute inset-0 bg-ground-2 will-change-transform"
          style={{ transform: "translate3d(0,100%,0)" }}
          aria-hidden
        />

        {/* ---- El estudio: vive dentro del mismo stage ---- */}
        <div
          className={`absolute inset-0 flex items-center text-ink ${houseIn ? "" : "pointer-events-none"}`}
          aria-hidden={!houseIn}
        >
          <div className="page-shell w-full">
            <div className="font-display leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              {houseIn ? <Cascade text="El estudio" stagger={0.04} delayChildren={0.1} as="h2" /> : <div className="h-[1em]" />}
            </div>

            <div className="mt-[6vh] grid grid-cols-12 gap-x-[var(--gutter)] gap-y-8">
              <div className="col-span-12 flex flex-col gap-6 md:col-span-5">
                <motion.p
                  initial={false}
                  animate={houseIn ? { y: 0, opacity: 1 } : { y: 48, opacity: 0 }}
                  transition={{ duration: 1, ease: EASE_ARRAY, delay: houseIn ? 0.55 : 0 }}
                  className="text-body max-w-[38ch] text-ink/80"
                >
                  CAUCE lo lleva Juan Martín Gómez Delgado desde Buenos Aires. Un estudio
                  chico a propósito: la misma persona que entiende el negocio diseña, construye y
                  publica. Sin intermediarios ni handoffs que diluyan la idea.
                </motion.p>
                <motion.p
                  initial={false}
                  animate={houseIn ? { y: 0, opacity: 1 } : { y: 48, opacity: 0 }}
                  transition={{ duration: 1, ease: EASE_ARRAY, delay: houseIn ? 0.7 : 0 }}
                  className="text-body max-w-[38ch] text-ink/80"
                >
                  Trabajamos con inteligencia artificial en cada etapa, desde los assets hasta el
                  código, pero cada entrega se prueba con clientes y dinero real antes de darse
                  por terminada. Lo que ves en los casos está publicado y en uso.
                </motion.p>
              </div>
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                <div ref={parallaxRef} className="will-change-transform">
                  <motion.div
                    initial={false}
                    animate={houseIn ? { y: 0, opacity: 1 } : { y: 48, opacity: 0 }}
                    transition={{ duration: 1, ease: EASE_ARRAY, delay: houseIn ? 0.4 : 0 }}
                    className="overflow-hidden rounded-[8px] shadow-[0_30px_80px_rgba(21,20,15,0.18)]"
                  >
                    <img
                      src="/cases/barbershop.webp"
                      alt="Buenos Aires Barbershop, sitio publicado"
                      className="h-auto w-full"
                      loading="lazy"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Mobile y reduced motion: lista apilada sobre el mismo gradiente. */
function DescentStatic() {
  return (
    <section
      id="casos"
      className="relative text-ground"
      style={{
        background: "linear-gradient(160deg, var(--accent-deep) 0%, var(--pitch) 85%)",
        paddingBlock: "var(--section-pad)",
      }}
    >
      <div className="page-shell flex flex-col gap-20">
        <h2 className="font-display leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
          Casos
        </h2>
        {CASES.map((c) => (
          <article key={c.id} className="flex flex-col items-center gap-5 text-center">
            <div className="w-full overflow-hidden rounded-[8px]" style={{ maxHeight: "36vh" }}>
              <img src={c.image} alt={`${c.name}: ${c.kind}`} className="h-full w-full object-cover object-top" loading="lazy" />
            </div>
            <div className="text-h2">{c.name}</div>
            <div className="smallcaps text-ground/50">{c.kind}</div>
            <p className="text-small max-w-[36ch] text-ground/70">{c.line}</p>
          </article>
        ))}
      </div>

      <div className="mt-32 bg-ground-2 py-24 text-ink">
        <div className="page-shell">
          <h2 className="font-display leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
            El estudio
          </h2>
          <p className="text-body mt-8 max-w-[38ch] text-ink/80">
            CAUCE lo lleva Juan Martín Gómez Delgado desde Buenos Aires. Un estudio chico a
            propósito: la misma persona que entiende el negocio diseña, construye y publica.
          </p>
          <p className="text-body mt-4 max-w-[38ch] text-ink/80">
            Trabajamos con inteligencia artificial en cada etapa, pero cada entrega se prueba
            con clientes y dinero real antes de darse por terminada.
          </p>
        </div>
      </div>
    </section>
  );
}
