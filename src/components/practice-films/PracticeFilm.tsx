"use client";

import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { FILMS } from "./films";
import { FILM } from "./shared";
import { useReducedMotion } from "@/hooks/useMedia";

/** Cuadro que se muestra quieto: la pieza ya resuelta (pago aprobado, agregado al carrito…). */
const POSTER_FRAME = 160;

/**
 * Animación de un servicio de Práctica, generada en vivo con Remotion.
 * Corre en loop solo cuando su card está abierta y la grilla está en pantalla;
 * si no, queda quieta en el cuadro final. Con reduced motion nunca se mueve.
 */
export function PracticeFilm({ index, playing }: { index: number; playing: boolean }) {
  const ref = useRef<PlayerRef>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (playing && !reduced) {
      p.seekTo(0);
      p.play();
    } else {
      p.pause();
      p.seekTo(POSTER_FRAME);
    }
  }, [playing, reduced]);

  return (
    <Player
      ref={ref}
      component={FILMS[index]}
      durationInFrames={FILM.durationInFrames}
      fps={FILM.fps}
      compositionWidth={FILM.width}
      compositionHeight={FILM.height}
      initialFrame={POSTER_FRAME}
      loop
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      acknowledgeRemotionLicense
      style={{ width: "100%", height: "100%" }}
    />
  );
}
