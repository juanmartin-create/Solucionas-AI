"use client";

import { useEffect, useState } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const NARROW = "(max-width: 860px)";

function useMatch(query: string) {
  // Arranca en `true` (camino estático) para que el primer render nunca
  // dispare descargas ni pins; el efecto corrige en el cliente.
  const [matches, setMatches] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMatch(REDUCED);
export const useNarrow = () => useMatch(NARROW);

/** true cuando corresponde el camino estático (mobile o reduced motion). */
export function useStaticPath() {
  const reduced = useReducedMotion();
  const narrow = useNarrow();
  return reduced || narrow;
}

/** Lectura sincrónica para guards fuera de React (precargadores). */
export function isStaticPath() {
  if (typeof window === "undefined") return true;
  return window.matchMedia(REDUCED).matches || window.matchMedia(NARROW).matches;
}
