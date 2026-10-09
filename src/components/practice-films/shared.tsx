"use client";

import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Lienzo común de las cuatro piezas (se escala al tamaño de la celda). */
export const FILM = { width: 600, height: 760, fps: 30, durationInFrames: 180 } as const;

export const C = {
  gold: "#c9a45c",
  ink: "#f4efe6",
  muted: "rgba(244,239,230,0.5)",
  line: "rgba(244,239,230,0.14)",
  panel: "rgba(255,255,255,0.035)",
  pitch: "#07070a",
} as const;

/** Un neón por servicio. */
export const NEON = {
  cyan: "#3fe6ff",
  mint: "#3dffaf",
  magenta: "#ff4fd8",
  amber: "#ffb340",
} as const;

export const DISPLAY = "var(--font-unbounded), 'Unbounded', sans-serif";
export const MONO = "var(--font-jetbrains), 'JetBrains Mono', monospace";

/** rgba desde hex. */
export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Brillo de tubo de neón para texto. */
export function neonText(color: string, a = 1) {
  return `0 0 2px ${rgba("#ffffff", 0.7 * a)}, 0 0 8px ${rgba(color, 0.9 * a)}, 0 0 22px ${rgba(color, 0.65 * a)}, 0 0 48px ${rgba(color, 0.4 * a)}`;
}

/** Brillo de neón para bordes y cajas. */
export function neonBox(color: string, a = 1) {
  return `0 0 0 1px ${rgba(color, 0.9 * a)}, 0 0 14px ${rgba(color, 0.55 * a)}, 0 0 36px ${rgba(color, 0.28 * a)}, inset 0 0 18px ${rgba(color, 0.12 * a)}`;
}

/** Parpadeo de encendido de un tubo, arrancando en `start` (0 → 1). */
export function useFlicker(start: number) {
  const u = useCurrentFrame() - start;
  if (u < 0) return 0;
  if (u < 2) return 0.3;
  if (u < 4) return 1;
  if (u < 6) return 0.25;
  if (u < 9) return 1;
  if (u < 11) return 0.6;
  return 1;
}

/** Resorte amortiguado, arrancando en `start`. */
export function useIn(start: number, damping = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, mass: 0.8 } });
}

/** 0→1 lineal con clamp entre dos cuadros. */
export function useRange(a: number, b: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Fundido de entrada y salida para que el loop no corte en seco. */
export function useLoopFade() {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 8, 168, 180], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Fondo de cada pieza: grilla tenue + halo del color del servicio. */
export function Backdrop({ color }: { color: string }) {
  const frame = useCurrentFrame();
  const pulse = 0.8 + 0.2 * Math.sin(frame / 14);
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${rgba(color, 0.07)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(color, 0.07)} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(70% 60% at 50% 50%, black, transparent)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(55% 45% at 50% 55%, ${rgba(color, 0.16 * pulse)}, transparent 70%)` }} />
    </>
  );
}

/** Etiqueta de la pieza: mono, en mayúsculas, con punto de neón que late. */
export function Label({ children, color }: { children: ReactNode; color: string }) {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 34,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: MONO,
        fontSize: 18,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.muted,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 10, background: color, boxShadow: `0 0 10px ${color}`, opacity: 0.55 + 0.45 * Math.abs(Math.sin(frame / 9)) }} />
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
      style={{ position: "absolute", left: x - 5, top: y - 2, transform: `scale(${pressed ? 0.88 : 1})`, transformOrigin: "5px 2px", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}
    >
      <path d="M5 2 L5 22.2 L10.1 17.6 L13.6 25.2 L17 23.7 L13.5 16.3 L20.3 16.3 Z" fill={C.pitch} stroke="#fff" strokeWidth={1.7} strokeLinejoin="round" />
    </svg>
  );
}

/** Onda de neón del click. */
export function Ripple({ at, x, y, color }: { at: number; x: number; y: number; color: string }) {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < at || k >= 1) return null;
  const r = 8 + 36 * (1 - Math.pow(1 - k, 3));
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        boxShadow: `0 0 14px ${color}`,
        opacity: 1 - k,
      }}
    />
  );
}

/** Píldora de neón que se enciende con parpadeo. */
export function Pill({ start, color, children, style }: { start: number; color: string; children: ReactNode; style?: CSSProperties }) {
  const k = useIn(start);
  const f = useFlicker(start);
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        borderRadius: 999,
        background: rgba(color, 0.12),
        color,
        fontFamily: MONO,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: "0.04em",
        opacity: k * f,
        textShadow: neonText(color, f),
        boxShadow: neonBox(color, f),
        transform: `translateY(${(1 - k) * 18}px) scale(${0.9 + 0.1 * k})`,
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
