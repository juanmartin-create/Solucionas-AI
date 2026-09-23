/**
 * Escena del hero dibujada en canvas: seis pantallas que arrancan como
 * bocetos dispersos (wireframes) y se ensamblan en un abanico de productos
 * reales a medida que avanza el scroll. Todo es función pura del progreso.
 */
import { clamp01, lerp, smooth, win } from "@/lib/gsap";

export type Screen = {
  img: HTMLImageElement | null;
  ratio: number; // w/h del render
  // posición final (fracciones del viewport, centro) y rotación en grados
  fx: number;
  fy: number;
  fw: number; // ancho final como fracción del min(vw*1.0, vh*1.6)
  frot: number;
  // posición inicial (boceto)
  sx: number;
  sy: number;
  srot: number;
  // ventana de ensamblado sobre el progreso del track
  t0: number;
  t1: number;
};

export const LAYOUT: Omit<Screen, "img" | "ratio">[] = [
  { fx: 0.5, fy: 0.5, fw: 0.5, frot: 0, sx: 0.5, sy: 0.42, srot: 0, t0: 0.22, t1: 0.52 },
  { fx: 0.31, fy: 0.56, fw: 0.42, frot: -7, sx: 0.12, sy: 0.7, srot: -18, t0: 0.3, t1: 0.62 },
  { fx: 0.69, fy: 0.56, fw: 0.42, frot: 7, sx: 0.88, sy: 0.7, srot: 18, t0: 0.34, t1: 0.66 },
  { fx: 0.18, fy: 0.44, fw: 0.34, frot: -13, sx: -0.02, sy: 0.3, srot: -26, t0: 0.42, t1: 0.74 },
  { fx: 0.82, fy: 0.44, fw: 0.34, frot: 13, sx: 1.02, sy: 0.3, srot: 26, t0: 0.46, t1: 0.78 },
  { fx: 0.5, fy: 0.36, fw: 0.3, frot: 0, sx: 0.5, sy: 0.05, srot: 0, t0: 0.5, t1: 0.84 },
];

const GROUND = "#ece8df";
const INK = "#15140f";
const ACCENT = "#1f4e5a";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Boceto: un browser esquemático, sin texto. */
function drawWireframe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number,
  dash: number,
) {
  if (alpha <= 0.005) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 5]);
  ctx.lineDashOffset = -dash * 40;
  roundRect(ctx, -w / 2, -h / 2, w, h, 6);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = alpha * 0.55;
  // barra de navegación
  const pad = w * 0.06;
  ctx.beginPath();
  ctx.moveTo(-w / 2 + pad, -h / 2 + h * 0.12);
  ctx.lineTo(w / 2 - pad, -h / 2 + h * 0.12);
  ctx.stroke();
  // titular
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w / 2 + pad, -h / 2 + h * 0.36);
  ctx.lineTo(-w / 2 + w * 0.46, -h / 2 + h * 0.36);
  ctx.moveTo(-w / 2 + pad, -h / 2 + h * 0.46);
  ctx.lineTo(-w / 2 + w * 0.34, -h / 2 + h * 0.46);
  ctx.stroke();
  // bloque imagen
  ctx.lineWidth = 1;
  ctx.strokeRect(w * 0.08, -h / 2 + h * 0.28, w * 0.36, h * 0.44);
  // botón
  roundRect(ctx, -w / 2 + pad, -h / 2 + h * 0.6, w * 0.16, h * 0.08, 3);
  ctx.stroke();
  ctx.restore();
}

export function renderHero(
  ctx: CanvasRenderingContext2D,
  screens: Screen[],
  progress: number,
  vw: number,
  vh: number,
  dpr = 1,
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = GROUND;
  ctx.fillRect(0, 0, vw, vh);

  // Push-in de cámara: ≤3% sobre todo el track.
  const push = 1 + 0.03 * smooth(progress);
  const base = Math.min(vw, vh * 1.6);

  ctx.save();
  ctx.translate(vw / 2, vh / 2);
  ctx.scale(push, push);
  ctx.translate(-vw / 2, -vh / 2);

  // Sombra global de las pantallas ensambladas: crece con el progreso.
  const settle = win(progress, 0.2, 0.9);

  for (const s of screens) {
    const t = smooth(win(progress, s.t0, s.t1));
    const cx = lerp(s.sx, s.fx, t) * vw;
    const cy = lerp(s.sy, s.fy, t) * vh;
    const rot = (lerp(s.srot, s.frot, t) * Math.PI) / 180;
    const w = s.fw * base * lerp(0.86, 1, t);
    const h = w / s.ratio;

    // el boceto persiste hasta que la imagen se asienta; sin imagen (mobile,
    // o todavía cargando) el boceto se queda como pieza terminada
    const wireAlpha = s.img ? 1 - win(t, 0.55, 0.95) : 1;
    const imgAlpha = win(t, 0.4, 0.9);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    if (s.img && imgAlpha > 0.005) {
      ctx.save();
      ctx.globalAlpha = imgAlpha;
      ctx.shadowColor = `rgba(21, 20, 15, ${0.22 * settle * imgAlpha})`;
      ctx.shadowBlur = 40 * settle;
      ctx.shadowOffsetY = 18 * settle;
      roundRect(ctx, -w / 2, -h / 2, w, h, 8);
      ctx.fillStyle = GROUND;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.clip();
      ctx.drawImage(s.img, -w / 2, -h / 2, w, h);
      ctx.restore();
      // borde fino
      ctx.save();
      ctx.globalAlpha = imgAlpha * 0.35;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1;
      roundRect(ctx, -w / 2, -h / 2, w, h, 8);
      ctx.stroke();
      ctx.restore();
    }

    // Los bocetos quedan tenues para no pisar el texto del overlay.
    drawWireframe(ctx, w, h, wireAlpha * clamp01(0.55 - progress * 0.1), t);
    ctx.restore();
  }

  ctx.restore();
}
