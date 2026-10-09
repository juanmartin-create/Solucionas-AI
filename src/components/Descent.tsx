"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CASE_FILMS as FILMS, type CaseFilm } from "@/lib/site";
import { EASE_ARRAY, lerp, win, clamp01 } from "@/lib/gsap";
import { useStaticPath } from "@/hooks/useMedia";
import { useTrackProgress } from "@/hooks/useTrackProgress";
import { Cascade } from "./Cascade";
import { CaseLightbox, PlayBadge } from "./CaseLightbox";

const N = FILMS.length;
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
  const [open, setOpen] = useState<CaseFilm | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Solo corre el preview mudo del caso activo, y arranca después de la placa.
  useEffect(() => {
    if (isStatic) return;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && !houseIn) {
        const from = FILMS[i].previewFrom;
        if (v.currentTime < from) v.currentTime = from;
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [active, houseIn, isStatic]);

  useTrackProgress(
    trackRef,
    (p) => {
      // Los pasos de los casos ocurren en el primer 60% del track.
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

  const current = FILMS[active];

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
        className="sticky top-0 h-svh w-full overflow-hidden text-ink"
      >
        <h2 className="sr-only">Casos</h2>
        <div className="contents"
        style={{
          background: "linear-gradient(160deg, #1c1608 0%, var(--pitch) 85%)",
        }}
      >
        {/* glow radial: la sala iluminada por la pantalla */}
        <div ref={glowWrapRef} className="absolute inset-0" aria-hidden>
          {FILMS.map((c, i) => (
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
            className="font-display leading-none tracking-[-0.02em] text-ink"
            style={{ fontSize: "clamp(2.75rem, 7.5vw, 8.5rem)" }}
          >
            <Cascade text={current.client} as="h2" />
          </div>
        </div>

        {/* pantalla central: el video del caso activo; click = caso completo con sonido */}
        <div
          ref={screenRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{ width: "min(50vw, calc(56vh * 16 / 9))", aspectRatio: "16 / 9" }}
        >
          {FILMS.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              className="photo absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
            >
              <button
                type="button"
                onClick={() => setOpen(c)}
                aria-label={`Ver el caso ${c.client} con sonido`}
                tabIndex={i === active ? 0 : -1}
                className="group relative block h-full w-full cursor-pointer bg-black outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={c.video}
                  poster={c.poster}
                  muted
                  loop
                  playsInline
                  preload={i < 2 ? "auto" : "metadata"}
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <PlayBadge duration={c.duration} />
              </button>
            </div>
          ))}
        </div>

        {/* riel izquierdo: qué tipo de solución es el caso activo */}
        <div
          ref={leftRef}
          className="absolute left-[var(--page-margin)] top-1/2 w-[min(30ch,18vw)] -translate-y-1/2 will-change-transform"
        >
          <div className="relative h-[22rem] overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={current.id}
                initial={{ y: "1.5em", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-1.5em", opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_ARRAY }}
                className="absolute inset-x-0 top-0"
              >
                <div className="smallcaps text-accent">Casos</div>
                <h3
                  className="mt-4 font-display leading-[1.04] tracking-[-0.015em] text-ink"
                  style={{ fontSize: "clamp(1.5rem, 2.1vw, 2.35rem)" }}
                >
                  {current.solution} <em className="italic text-accent">{current.solutionItalic}</em>
                </h3>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {current.points.map((pt) => (
                    <li key={pt} className="text-small flex items-center gap-2.5 text-ink/80">
                      <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <span
                  className={`smallcaps mt-6 inline-block whitespace-nowrap rounded-full border px-3 py-1.5 ${
                    current.live ? "border-accent/60 text-accent" : "border-white/15 text-ink/55"
                  }`}
                >
                  {current.status}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* riel derecho: índices */}
        <div
          ref={rightRef}
          className="absolute right-[var(--page-margin)] top-1/2 flex -translate-y-1/2 flex-col items-end gap-2 will-change-transform"
        >
          {FILMS.map((c, i) => (
            <span
              key={c.id}
              className={`font-display text-[1.25rem] leading-none transition-colors duration-500 ${
                i === active ? "text-ink" : "text-ink/30"
              }`}
            >
              {c.index}
            </span>
          ))}
        </div>

        {/* amanecer */}
        <div
          ref={dawnRef}
          className="gold-haze absolute inset-0 bg-ground-2 will-change-transform"
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
                  Nexo lo lleva Juan Martín Gómez Delgado desde Buenos Aires. Un estudio
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
                  por terminada. Lo que ves en los casos es producto funcionando, no maquetas.
                </motion.p>
              </div>
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                <div ref={parallaxRef} className="will-change-transform">
                  <motion.div
                    initial={false}
                    animate={houseIn ? { y: 0, opacity: 1 } : { y: 48, opacity: 0 }}
                    transition={{ duration: 1, ease: EASE_ARRAY, delay: houseIn ? 0.4 : 0 }}
                    className="photo"
                  >
                    <img
                      src="/cases/barbershop.webp"
                      alt="Buenos Aires Barbershop, sitio publicado"
                      className="h-auto w-full"
                      width={1400}
                      height={875}
                      loading="lazy"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <CaseLightbox film={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/** Mobile y reduced motion: lista apilada sobre el mismo gradiente. */
function DescentStatic() {
  const [open, setOpen] = useState<CaseFilm | null>(null);
  return (
    <section
      id="casos"
      className="relative text-ink"
      style={{
        background: "linear-gradient(160deg, #1c1608 0%, var(--pitch) 85%)",
        paddingBlock: "var(--section-pad)",
      }}
    >
      <div className="page-shell flex flex-col gap-20">
        <h2 className="font-display leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
          Casos
        </h2>
        {FILMS.map((c) => (
          <article key={c.id} className="flex flex-col gap-5">
            <button
              type="button"
              onClick={() => setOpen(c)}
              aria-label={`Ver el caso ${c.client} con sonido`}
              className="photo group relative block aspect-video w-full bg-black"
            >
              <img src={c.poster} alt="" className="h-full w-full object-cover" loading="lazy" />
              <PlayBadge duration={c.duration} />
            </button>
            <div className="smallcaps text-ink/55">
              {c.index} · {c.client}
            </div>
            <h3 className="text-h2">
              {c.solution} <em className="italic text-accent">{c.solutionItalic}</em>
            </h3>
            <ul className="flex flex-col gap-2">
              {c.points.map((pt) => (
                <li key={pt} className="text-small flex items-center gap-2.5 text-ink/80">
                  <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {pt}
                </li>
              ))}
            </ul>
            <span
              className={`smallcaps self-start rounded-full border px-3 py-1.5 ${
                c.live ? "border-accent/60 text-accent" : "border-white/15 text-ink/55"
              }`}
            >
              {c.status}
            </span>
          </article>
        ))}
      </div>
      <CaseLightbox film={open} onClose={() => setOpen(null)} />

      <div className="mt-32 bg-ground-2 py-24 text-ink">
        <div className="page-shell">
          <h2 className="font-display leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
            El estudio
          </h2>
          <p className="text-body mt-8 max-w-[38ch] text-ink/80">
            Nexo lo lleva Juan Martín Gómez Delgado desde Buenos Aires. Un estudio chico a
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
