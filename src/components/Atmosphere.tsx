"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useMedia";

/**
 * Capas de atmósfera del fondo. Son decorativas (aria-hidden, sin eventos) y
 * solo animan transform/opacity.
 */

/** Grano de película fijo sobre toda la página: le saca lo "digital plano". */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[25] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: "220px 220px",
      }}
    />
  );
}

/** Grilla técnica tenue, la misma de las animaciones de Práctica. */
export function TechGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(201,164,92,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,92,0.06) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(75% 65% at 50% 45%, black 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(75% 65% at 50% 45%, black 20%, transparent 80%)",
      }}
    />
  );
}

/**
 * Halo de luz que acompaña el scroll de la sección: se desplaza en diagonal
 * mientras la sección pasa por la pantalla. Con reduced motion queda quieto.
 */
export function ScrollHalo({
  color = "rgba(201,164,92,0.16)",
  from = ["70%", "10%"],
  to = ["30%", "70%"],
}: {
  color?: string;
  from?: [string, string];
  to?: [string, string];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const left = useTransform(scrollYProgress, [0, 1], reduced ? [from[0], from[0]] : [from[0], to[0]]);
  const top = useTransform(scrollYProgress, [0, 1], reduced ? [from[1], from[1]] : [from[1], to[1]]);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left, top, background: `radial-gradient(closest-side, ${color}, transparent)` }}
      />
    </div>
  );
}
