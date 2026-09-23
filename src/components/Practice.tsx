"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView } from "motion/react";
import { PRACTICE } from "@/lib/site";
import { EASE_ARRAY } from "@/lib/gsap";
import { useStaticPath } from "@/hooks/useMedia";

/** Posiciones en escalera: (col, fila) 1-indexed. */
const CELLS = [
  [1, 1],
  [2, 2],
  [3, 1],
  [4, 2],
];

export function Practice() {
  const isStatic = useStaticPath();
  const [open, setOpen] = useState(1); // 02 abierta por defecto
  const [hover, setHover] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.25 });

  const toggle = (i: number) => setOpen((o) => (o === i ? -1 : i));
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(i);
    }
  };

  return (
    <section
      id="practica"
      className="relative min-h-svh bg-ground-2"
      style={{ paddingTop: "clamp(3.5rem, 8vh, 6rem)", paddingBottom: "var(--section-pad)" }}
    >
      <div className="page-shell">
        <Heading text="Lo que" italic="hacemos" />

        <div className="smallcaps mt-10 grid grid-cols-12 gap-x-[var(--gutter)] text-muted">
          <span className="col-span-12 md:col-span-2">Es</span>
          <span className="col-span-12 md:col-span-3">un estudio, cuatro frentes,</span>
          <span className="col-span-12 md:col-span-4 md:col-start-9 md:text-right">
            y una sola forma de trabajar. Nada se entrega sin probarlo con clientes reales.
          </span>
        </div>

        {/* --------- cards --------- */}
        <div
          ref={gridRef}
          className={
            isStatic
              ? "mt-16 flex flex-col gap-4"
              : "relative mt-20 grid grid-cols-4"
          }
          style={
            isStatic
              ? undefined
              : { gridTemplateRows: "repeat(2, clamp(19rem, 44vh, 24rem))" }
          }
        >
          {!isStatic && <GridLines inView={inView} hover={hover} />}

          {PRACTICE.map((card, i) => {
            const isOpen = open === i;
            const [col, row] = CELLS[i];
            return (
              <motion.div
                key={card.index}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => toggle(i)}
                onKeyDown={(e) => onKey(e, i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                initial={{ y: 24, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : undefined}
                transition={{ duration: 1, ease: EASE_ARRAY, delay: 0.45 + i * 0.18 }}
                className={[
                  "group relative z-10 flex cursor-pointer flex-col justify-between p-6 outline-none transition-colors duration-500 focus-visible:ring-1 focus-visible:ring-accent",
                  isStatic ? "min-h-[15rem] bg-ground/60" : "",
                  !isStatic && isOpen ? "bg-ground" : "",
                  !isStatic && !isOpen ? "hover:bg-ground/60" : "",
                ].join(" ")}
                style={isStatic ? undefined : { gridColumn: col, gridRow: row }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="smallcaps">{card.title}</span>
                  <span
                    className={`font-display text-[1.75rem] leading-none transition-colors duration-500 ${
                      isOpen ? "text-accent-deep" : "group-hover:text-accent-deep"
                    }`}
                  >
                    {card.index}
                  </span>
                </div>

                <div className="relative min-h-[6.5rem]">
                  <motion.p
                    key={isOpen ? "open" : "closed"}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: EASE_ARRAY }}
                    className="text-body max-w-[38ch] text-ink/85"
                  >
                    {isOpen || isStatic ? card.copy : shorten(card.copy)}
                  </motion.p>
                </div>

                <span
                  aria-hidden
                  className={`font-display text-2xl leading-none transition-transform duration-500 ${
                    isOpen ? "rotate-45" : "group-hover:rotate-90"
                  }`}
                >
                  +
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function shorten(s: string) {
  const i = s.indexOf(".");
  return i > 0 ? s.slice(0, i + 1) : s;
}

/** Bordes de la grilla dibujados con SVG, no borders. */
function GridLines({ inView, hover }: { inView: boolean; hover: number | null }) {
  const H = [0, 50, 100];
  const V = [0, 25, 50, 75, 100];
  const line = { vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g stroke="var(--muted)" strokeOpacity={0.4} strokeWidth={1} fill="none">
        {/* Se anima el extremo (x2 / y2), no pathLength: con preserveAspectRatio="none"
            el truco de dasharray se deforma y la línea sale a guiones. */}
        {H.map((y, i) => (
          <motion.line
            key={`h${y}`}
            x1={0}
            y1={y}
            y2={y}
            style={line}
            initial={{ x2: 0 }}
            animate={inView ? { x2: 100 } : undefined}
            transition={{ duration: 1.8, ease: EASE_ARRAY, delay: i * 0.15 }}
          />
        ))}
        {V.map((x, i) => (
          <motion.line
            key={`v${x}`}
            x1={x}
            x2={x}
            y1={0}
            style={line}
            initial={{ y2: 0 }}
            animate={inView ? { y2: 100 } : undefined}
            transition={{ duration: 1.1, ease: EASE_ARRAY, delay: 0.35 + i * 0.2 }}
          />
        ))}
      </g>

      {/* borde vivo de la card en hover */}
      {CELLS.map(([col, row], i) => {
        const x = (col - 1) * 25;
        const y = (row - 1) * 50;
        const active = hover === i;
        return (
          <motion.g
            key={`hover${i}`}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            fill="none"
          >
            <rect
              x={x}
              y={y}
              width={25}
              height={50}
              stroke="var(--ground-2)"
              strokeWidth={3}
              style={line}
            />
            <motion.rect
              x={x}
              y={y}
              width={25}
              height={50}
              stroke="var(--accent-deep)"
              strokeOpacity={0.8}
              strokeWidth={1}
              pathLength={100}
              strokeDasharray="20 30"
              strokeDashoffset={0}
              style={line}
              animate={active ? { strokeDashoffset: [0, -100] } : { strokeDashoffset: 0 }}
              transition={
                active ? { duration: 3.2, ease: "linear", repeat: Infinity } : { duration: 0 }
              }
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

export function Heading({
  text,
  italic,
  light = false,
}: {
  text: string;
  italic?: string;
  light?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.h2
        initial={{ y: "60%" }}
        animate={inView ? { y: 0 } : undefined}
        transition={{ duration: 1.3, ease: EASE_ARRAY }}
        className={`font-display leading-[0.95] tracking-[-0.02em] ${light ? "text-ground" : "text-ink"}`}
        style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
      >
        {text} {italic && <em className="italic">{italic}</em>}
      </motion.h2>
    </div>
  );
}
