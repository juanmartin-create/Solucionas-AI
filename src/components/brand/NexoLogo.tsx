import { useId } from "react";

/**
 * Marca NEXO. Wordmark: la X se abre y en el cruce queda el nodo dorado (el nexo).
 * Ícono: la N trazada con un solo hilo dorado que une dos puntos.
 * Ambos comparten el punto: así se reconocen como la misma marca.
 */

// Letras geométricas, alto 100. Ancho total 380.
const N = "M0 100V0H24L60 58V0H84V100H60L24 42V100Z";
const E = "M0 0H70V22H24V39H62V61H24V78H70V100H0Z";
const X = "M0 0H28L90 100H62Z M62 0H90L28 100H0Z";
const O = "M50 0A50 50 0 1 1 49.99 0Z M50 24A26 26 0 1 0 50.01 24Z";
const NODE = { cx: 223, cy: 50 };
export const GOLD = "#c9a45c";

type Fill = "ink" | "gradient" | "dark";

/**
 * Wordmark en unidades `em`: hereda el tamaño de la fuente del contenedor,
 * así funciona con los ajustes de tamaño existentes (hero y footer).
 */
export function NexoWordmark({
  fill = "ink",
  glow = true,
  className = "",
  title = "NEXO",
}: {
  fill?: Fill;
  glow?: boolean;
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const color = fill === "dark" ? "#0a0a0b" : fill === "gradient" ? `url(#g${id})` : "var(--ink)";
  return (
    <svg
      viewBox="0 0 380 100"
      role="img"
      aria-label={title}
      className={className}
      style={{ height: "0.74em", width: "auto", display: "inline-block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="var(--ink)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
        <mask id={`m${id}`}>
          <rect x="-10" y="-10" width="400" height="120" fill="#fff" />
          <circle cx={NODE.cx} cy={NODE.cy} r="21" fill="#000" />
        </mask>
        <filter id={`f${id}`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill={color} fillRule="evenodd">
        <path d={N} />
        <path d={E} transform="translate(96 0)" />
        <path d={X} transform="translate(178 0)" mask={`url(#m${id})`} fillRule="nonzero" />
        <path d={O} transform="translate(280 0)" />
      </g>
      <circle cx={NODE.cx} cy={NODE.cy} r="13" fill={GOLD} filter={glow ? `url(#f${id})` : undefined} />
    </svg>
  );
}

/** Ícono: N de un solo hilo dorado entre dos puntos. `size` en px o em. */
export function NexoIcon({ size = "1em", dot = "var(--ink)", className = "" }: { size?: string | number; dot?: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <path d="M18 86V16L82 84V14" fill="none" stroke={GOLD} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="86" r="11" fill={dot} />
      <circle cx="82" cy="14" r="11" fill={dot} />
    </svg>
  );
}
