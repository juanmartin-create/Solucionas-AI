"use client";

import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Lienzo común de las cuatro piezas (se escala al tamaño de la celda). */
export const FILM = { width: 600, height: 760, fps: 30, durationInFrames: 180 } as const;

export const C = {
  gold: "#c9a45c",
  goldLight: "#e3c88f",
  ink: "#efe9dd",
  muted: "rgba(239,233,221,0.45)",
  line: "rgba(239,233,221,0.16)",
  panel: "rgba(255,255,255,0.035)",
  pitch: "#0a0a0b",
} as const;

export const SERIF = "var(--font-display), Newsreader, serif";
export const SANS = "var(--font-body), 'Instrument Sans', sans-serif";

/** Resorte sin rebote exagerado (amortiguado), arrancando en `start`. */
export function useIn(start: number, damping = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, mass: 0.8 } });
}

/** 0→1 lineal y con clamp entre dos cuadros. */
export function useRange(a: number, b: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Fundido de salida común para que el loop no corte en seco. */
export function useLoopFade() {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 8, 168, 180], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 20,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: C.muted,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Cursor tipo macOS que viaja entre puntos con curva suave. */
export function Cursor({ path, press }: { path: [number, number, number][]; press?: number[] }) {
  const frame = useCurrentFrame();
  let x = path[0][1];
  let y = path[0][2];
  for (let i = 1; i < path.length; i++) {
    const [f0, x0, y0] = path[i - 1];
    const [f1, x1, y1] = path[i];
    if (frame >= f0) {
      const k = interpolate(frame, [f0, f1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      x = x0 + (x1 - x0) * e;
      y = y0 + (y1 - y0) * e;
    }
  }
  const pressed = (press ?? []).some((p) => frame >= p - 3 && frame <= p + 4);
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 28 28"
      style={{ position: "absolute", left: x - 5, top: y - 2, transform: `scale(${pressed ? 0.88 : 1})`, transformOrigin: "5px 2px" }}
    >
      <path d="M5 2 L5 22.2 L10.1 17.6 L13.6 25.2 L17 23.7 L13.5 16.3 L20.3 16.3 Z" fill={C.pitch} stroke="#fff" strokeWidth={1.7} strokeLinejoin="round" />
    </svg>
  );
}

/** Onda dorada del click. */
export function Ripple({ at, x, y }: { at: number; x: number; y: number }) {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < at || k >= 1) return null;
  const r = 8 + 34 * (1 - Math.pow(1 - k, 3));
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: "50%",
        border: `2px solid ${C.gold}`,
        opacity: 1 - k,
      }}
    />
  );
}

/** Píldora de estado que entra con resorte. */
export function Pill({ start, children, style }: { start: number; children: ReactNode; style?: CSSProperties }) {
  const k = useIn(start);
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        borderRadius: 999,
        background: C.gold,
        color: C.pitch,
        fontFamily: SANS,
        fontSize: 25,
        fontWeight: 600,
        opacity: k,
        transform: `translateY(${(1 - k) * 18}px) scale(${0.9 + 0.1 * k})`,
        boxShadow: "0 12px 30px -12px rgba(201,164,92,0.8)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const Check = ({ size = 18, color = C.pitch }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5 L10 17.5 L19 7" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
