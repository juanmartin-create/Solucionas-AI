"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Options = {
  start?: string;
  end?: string;
  enabled?: boolean;
  /** Cambiarlo re-vincula el trigger (p. ej. cuando el track pasa de árbol estático a scrubbeado). */
  rebindKey?: unknown;
};

/**
 * Llama a `onProgress(p)` con el progreso 0→1 del track en cada update del
 * scroll y, además, una vez tras cada refresh (cubre cargar la página a mitad
 * del track). El callback escribe estilos directo por ref; nunca React state.
 */
export function useTrackProgress(
  trackRef: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  { start = "top top", end = "bottom bottom", enabled = true, rebindKey }: Options = {},
) {
  const cbRef = useRef(onProgress);
  useEffect(() => {
    cbRef.current = onProgress;
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !enabled) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      onUpdate: (self) => cbRef.current(self.progress),
      onRefresh: (self) => cbRef.current(self.progress),
    });
    // Primer valor sin esperar al scroll.
    cbRef.current(st.progress);

    return () => st.kill();
  }, [trackRef, start, end, enabled, rebindKey]);

  // Re-afirmar después de cada render: los re-renders dentro de un stage
  // pinneado pueden resetear bindings; las escrituras directas se repiten.
  useEffect(() => {
    if (!enabled) return;
    const el = trackRef.current;
    if (!el) return;
    const st = ScrollTrigger.getAll().find((t) => t.trigger === el);
    if (st) cbRef.current(st.progress);
  });
}

export { gsap };
