"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Ease canónico del sistema, versión GSAP. */
export const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_ARRAY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Remapea `p` desde la ventana [a, b] a 0→1, clampeado. */
export const win = (p: number, a: number, b: number) =>
  clamp01((p - a) / (b - a));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
