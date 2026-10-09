"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, C, Check, Cursor, DISPLAY, Label, MONO, NEON, Pill, Ripple, neonBox, neonText, rgba, useFlicker, useIn, useLoopFade, useRange } from "./shared";

/* ------------------------------------------------------------------ */
/* 01 · Webs que venden (cian): el navegador se dibuja, la página      */
/* scrollea sola y el botón de consulta recibe el click.               */
/* ------------------------------------------------------------------ */
export function FilmWeb() {
  const A = NEON.cyan;
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const draw = useRange(0, 26);
  const s = interpolate(frame, [30, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scroll = 372 * (0.5 - 0.5 * Math.cos(Math.PI * s));
  const content = useIn(18);
  const head = useFlicker(20);
  const btn = useFlicker(124);
  const P = 2 * (520 + 560);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Backdrop color={A} />
      <Label color={A}>Web · en vivo</Label>
      <svg width={600} height={760} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 6px ${A}) drop-shadow(0 0 16px ${rgba(A, 0.5)})` }}>
        <rect x={40} y={90} width={520} height={560} rx={16} fill="none" stroke={A} strokeWidth={2} strokeDasharray={`${P * draw} ${P}`} />
      </svg>
      <svg width={600} height={760} style={{ position: "absolute", inset: 0 }}>
        <line x1={40} y1={130} x2={40 + 520 * draw} y2={130} stroke={rgba(A, 0.35)} />
      </svg>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 60 + i * 18, top: 106, width: 9, height: 9, borderRadius: 9, background: rgba(A, 0.45), opacity: draw }} />
      ))}
      <div style={{ position: "absolute", left: 42, top: 132, width: 516, height: 516, overflow: "hidden", opacity: content }}>
        <div style={{ transform: `translateY(${-scroll}px)`, padding: "34px 32px" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink }}>
            Del lote vacío
            <br />
            <span style={{ color: A, opacity: head, textShadow: neonText(A, head) }}>al cierre de obra.</span>
          </div>
          <div style={{ marginTop: 22, height: 10, width: "78%", background: C.line, borderRadius: 4 }} />
          <div style={{ marginTop: 10, height: 10, width: "62%", background: C.line, borderRadius: 4 }} />
          <div style={{ marginTop: 28, height: 190, borderRadius: 12, background: `linear-gradient(135deg, ${rgba(A, 0.3)}, ${rgba("#7a5cff", 0.18)} 60%, transparent)`, border: `1px solid ${rgba(A, 0.3)}` }} />
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 90, borderRadius: 10, background: C.panel, border: `1px solid ${C.line}` }} />
            ))}
          </div>
          <div style={{ marginTop: 34, fontFamily: DISPLAY, fontWeight: 600, fontSize: 27, letterSpacing: "-0.02em", color: C.ink }}>
            Visitanos <span style={{ color: A }}>esta semana.</span>
          </div>
          <div
            style={{
              marginTop: 22,
              display: "inline-block",
              padding: "16px 28px",
              borderRadius: 999,
              fontFamily: MONO,
              fontSize: 20,
              fontWeight: 600,
              color: C.pitch,
              background: A,
              boxShadow: frame >= 124 ? `0 0 ${24 * btn}px ${6 * btn}px ${rgba(A, 0.6 * btn)}, 0 0 ${60 * btn}px ${rgba(A, 0.35 * btn)}` : "none",
            }}
          >
            Agendar visita →
          </div>
        </div>
      </div>
      <Cursor path={[[100, 520, 700], [126, 196, 356]]} press={[132]} />
      <Ripple at={132} x={200} y={360} color={A} />
      <Pill start={140} color={A} style={{ right: 52, top: 470 }}>
        <Check color={A} /> +1 consulta
      </Pill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Sistemas de cobro (menta): el WhatsApp y la planilla se vuelven */
/* un flujo: gift card → pago aprobado → email con código → canjeado.  */
/* ------------------------------------------------------------------ */
export function FilmCobro() {
  const A = NEON.mint;
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const chaos = 1 - useRange(30, 46);
  const steps = [
    { at: 48, title: "Gift card", sub: "Corte + barba · $18.000" },
    { at: 74, title: "Mercado Pago", sub: "Pago aprobado" },
    { at: 100, title: "Email", sub: "Código 00001" },
    { at: 126, title: "Panel", sub: "Canjeado" },
  ];
  const lineK = interpolate(frame, [52, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Backdrop color={A} />
      <Label color={A}>De WhatsApp a sistema</Label>
      <div style={{ position: "absolute", left: 40, top: 100, width: 520, opacity: chaos, filter: `blur(${(1 - chaos) * 8}px)` }}>
        {["¿Tenés gift cards?", "¿Te transfiero?", "¿Me pasás el código?"].map((t, i) => (
          <div
            key={t}
            style={{
              marginLeft: i % 2 ? 150 : 0,
              marginBottom: 14,
              width: 330,
              padding: "14px 18px",
              borderRadius: 16,
              background: i % 2 ? rgba(A, 0.12) : C.panel,
              border: `1px solid ${C.line}`,
              fontFamily: MONO,
              fontSize: 19,
              color: C.ink,
              transform: `rotate(${(i - 1) * 2.5}deg)`,
            }}
          >
            {t}
          </div>
        ))}
        <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{ height: 30, background: C.panel, border: `1px solid ${C.line}` }} />
          ))}
        </div>
      </div>
      <svg width={600} height={760} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 6px ${A})` }}>
        <line x1={76} y1={150} x2={76} y2={150 + 450 * lineK} stroke={A} strokeWidth={2} />
      </svg>
      {steps.map((s, i) => (
        <Step key={s.title} color={A} at={s.at} top={120 + i * 150} title={s.title} sub={s.sub} done={frame >= s.at + 14} last={i === 3} />
      ))}
    </AbsoluteFill>
  );
}

function Step({ color, at, top, title, sub, done, last }: { color: string; at: number; top: number; title: string; sub: string; done: boolean; last: boolean }) {
  const k = useIn(at);
  const f = useFlicker(at + 14);
  const lit = done ? f : 0;
  return (
    <div style={{ position: "absolute", left: 56, top, display: "flex", alignItems: "center", gap: 26, opacity: k, transform: `translateX(${(1 - k) * 30}px)` }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
          border: `2px solid ${color}`,
          background: done ? color : C.pitch,
          boxShadow: done ? `0 0 16px ${rgba(color, 0.8 * lit)}` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {done && <Check size={20} />}
      </div>
      <div style={{ padding: "18px 24px", width: 400, borderRadius: 16, background: last && done ? rgba(color, 0.1) : C.panel, border: `1px solid ${C.line}`, boxShadow: last && done ? neonBox(color, lit) : "none" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: "-0.01em", color: C.ink }}>{title}</div>
        <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 17, letterSpacing: "0.06em", textTransform: "uppercase", color: done ? color : C.muted, textShadow: done ? neonText(color, 0.6 * lit) : "none" }}>{sub}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Productos y PWA (magenta): se instala sin app store, se abre y */
/* una serie marcada dispara el timer.                                 */
/* ------------------------------------------------------------------ */
export function FilmPwa() {
  const A = NEON.magenta;
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const draw = useRange(0, 22);
  const sheet = useIn(26) * (1 - useIn(58));
  const icon = useIn(60);
  const iconLit = useFlicker(62);
  const open = useIn(84);
  const done = frame >= 112;
  const timerLit = useFlicker(114);
  const restLeft = Math.max(0, 90 - Math.floor((frame - 118) / 30));
  const P = 2 * (300 + 600);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Backdrop color={A} />
      <Label color={A}>App instalable · sin store</Label>
      <svg width={600} height={760} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 6px ${A}) drop-shadow(0 0 18px ${rgba(A, 0.45)})` }}>
        <rect x={150} y={100} width={300} height={600} rx={44} fill="none" stroke={A} strokeWidth={2} strokeDasharray={`${P * draw} ${P}`} />
      </svg>
      <div style={{ position: "absolute", left: 152, top: 102, width: 296, height: 596, borderRadius: 42, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, padding: "70px 30px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, alignContent: "start", opacity: draw }}>
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 14, background: C.panel, border: `1px solid ${C.line}` }} />
          ))}
          <div
            style={{
              aspectRatio: "1",
              borderRadius: 14,
              background: A,
              transform: `scale(${icon})`,
              boxShadow: `0 0 ${18 * iconLit}px ${rgba(A, 0.9 * iconLit)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 22,
              color: C.pitch,
            }}
          >
            N
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 26px 34px", background: "#140a14", borderTop: `1px solid ${A}`, boxShadow: `0 -10px 30px ${rgba(A, 0.25)}`, transform: `translateY(${(1 - sheet) * 100}%)` }}>
          <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>Compartir</div>
          <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 12, background: rgba(A, 0.14), fontFamily: MONO, fontSize: 18, color: C.ink }}>＋ Agregar a inicio</div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "#0c070c", padding: "60px 24px", opacity: open, transform: `scale(${0.6 + 0.4 * open})`, transformOrigin: "82% 30%" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: C.ink }}>
            Push · <span style={{ color: A, textShadow: neonText(A, 0.7) }}>Pecho</span>
          </div>
          <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 14, letterSpacing: "0.14em", color: C.muted }}>PRESS BANCA · 4 SERIES</div>
          {[0, 1, 2].map((i) => {
            const on = i === 0 && done;
            return (
              <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: on ? rgba(A, 0.12) : C.panel, border: `1px solid ${on ? A : C.line}`, boxShadow: on ? `0 0 14px ${rgba(A, 0.4)}` : "none" }}>
                <div style={{ fontFamily: MONO, fontSize: 17, color: C.ink, flex: 1 }}>{i + 1} · 60 kg × 8</div>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: on ? A : "transparent", border: `1px solid ${A}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <Check size={16} />}
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              bottom: 22,
              padding: "14px 18px",
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: done ? timerLit : 0,
              boxShadow: done ? neonBox(A, timerLit) : "none",
              transform: `translateY(${done ? 0 : 20}px)`,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.18em", color: A }}>DESCANSO</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, color: A, textShadow: neonText(A, timerLit) }}>
              {String(Math.floor(restLeft / 60)).padStart(2, "0")}:{String(restLeft % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
      <Cursor path={[[24, 470, 720], [46, 300, 640], [70, 470, 640], [80, 412, 300], [100, 470, 640], [110, 402, 300]]} press={[50, 82, 112]} />
      <Ripple at={50} x={300} y={642} color={A} />
      <Ripple at={82} x={414} y={302} color={A} />
      <Ripple at={112} x={404} y={302} color={A} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Agentes con IA (ámbar): pregunta → recomienda con precio →     */
/* agrega al carrito → sugiere un extra → lleva al pago.               */
/* ------------------------------------------------------------------ */
export function FilmAgente() {
  const A = NEON.amber;
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const q = "¿Tenés proteína sin lactosa?";
  const typed = q.slice(0, Math.max(0, Math.min(q.length, frame - 8)));
  const dots = frame >= 38 && frame < 56;
  const reply = useIn(56);
  const cardA = useIn(64);
  const cardB = useIn(72);
  const added = frame >= 104;
  const addLit = useFlicker(104);
  const cross = useIn(120);
  const payIn = useIn(138);
  const payLit = useFlicker(150);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Backdrop color={A} />
      <Label color={A}>Agente · vende por chat</Label>
      <div style={{ position: "absolute", left: 40, top: 90, width: 520, height: 650, borderRadius: 20, border: `1px solid ${rgba(A, 0.35)}`, background: "rgba(255,255,255,0.02)", boxShadow: `0 0 30px ${rgba(A, 0.12)}` }} />
      <div style={{ position: "absolute", right: 60, top: 108, fontFamily: MONO, fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
        Carrito
        <span
          style={{
            minWidth: 26,
            height: 26,
            borderRadius: 26,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: added ? A : C.panel,
            color: added ? C.pitch : C.muted,
            fontWeight: 700,
            boxShadow: added ? `0 0 14px ${rgba(A, 0.9 * addLit)}` : "none",
            transform: `scale(${added && frame < 112 ? 1.25 : 1})`,
          }}
        >
          {added ? 1 : 0}
        </span>
      </div>
      <div style={{ position: "absolute", right: 64, top: 160, maxWidth: 360, padding: "14px 18px", borderRadius: "16px 16px 4px 16px", background: rgba(A, 0.16), fontFamily: MONO, fontSize: 19, color: C.ink, opacity: frame >= 6 ? 1 : 0 }}>
        {typed}
        {frame < 36 && <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: A }}>▍</span>}
      </div>
      {dots && (
        <div style={{ position: "absolute", left: 64, top: 268, display: "flex", gap: 6, padding: "16px 18px", borderRadius: 16, background: C.panel }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: 8, background: A, boxShadow: `0 0 8px ${A}`, opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 5) / 5)) }} />
          ))}
        </div>
      )}
      <div style={{ position: "absolute", left: 64, top: 268, width: 470, opacity: reply, transform: `translateY(${(1 - reply) * 14}px)` }}>
        <div style={{ padding: "14px 18px", borderRadius: "16px 16px 16px 4px", background: C.panel, fontFamily: MONO, fontSize: 19, color: C.ink, display: "inline-block" }}>Sí, estas dos son sin lactosa:</div>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          <Product color={A} k={cardA} name="Isolate 1 kg" price="$38.500" pressed={frame >= 98 && frame < 106} added={added} lit={addLit} />
          <Product color={A} k={cardB} name="Vegana 900 g" price="$31.900" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 64, top: 590, padding: "14px 18px", borderRadius: "16px 16px 16px 4px", background: C.panel, fontFamily: MONO, fontSize: 19, color: C.ink, opacity: cross, transform: `translateY(${(1 - cross) * 14}px)` }}>
        Agregado. ¿Le sumo un <span style={{ color: A, textShadow: neonText(A, 0.6) }}>shaker</span>?
      </div>
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 662,
          padding: "16px 30px",
          borderRadius: 999,
          fontFamily: MONO,
          fontSize: 20,
          fontWeight: 600,
          color: C.pitch,
          background: A,
          opacity: payIn,
          boxShadow: frame >= 150 ? `0 0 ${24 * payLit}px ${6 * payLit}px ${rgba(A, 0.6 * payLit)}, 0 0 60px ${rgba(A, 0.35 * payLit)}` : "none",
        }}
      >
        Ir a pagar →
      </div>
      <Cursor path={[[80, 520, 720], [96, 170, 488], [140, 170, 488], [150, 470, 694]]} press={[100, 156]} />
      <Ripple at={100} x={172} y={491} color={A} />
      <Ripple at={156} x={470} y={696} color={A} />
    </AbsoluteFill>
  );
}

function Product({ color, k, name, price, pressed, added, lit = 1 }: { color: string; k: number; name: string; price: string; pressed?: boolean; added?: boolean; lit?: number }) {
  return (
    <div style={{ flex: 1, padding: 12, borderRadius: 14, background: C.panel, border: `1px solid ${added ? color : C.line}`, boxShadow: added ? neonBox(color, 0.6 * lit) : "none", opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
      <div style={{ height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${rgba(color, 0.35)}, ${rgba("#ff4f6d", 0.15)} 70%, transparent)` }} />
      <div style={{ marginTop: 12, fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, letterSpacing: "-0.01em", color: C.ink }}>{name}</div>
      <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 18, fontWeight: 600, color, textShadow: neonText(color, 0.5) }}>{price}</div>
      <div
        style={{
          marginTop: 12,
          padding: "10px 0",
          textAlign: "center",
          borderRadius: 999,
          fontFamily: MONO,
          fontSize: 15,
          fontWeight: 600,
          color: added ? C.pitch : C.ink,
          background: added ? color : "transparent",
          border: `1px solid ${color}`,
          transform: `scale(${pressed ? 0.94 : 1})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {added ? (
          <>
            <Check size={15} /> Agregado
          </>
        ) : (
          "Agregar"
        )}
      </div>
    </div>
  );
}

export const FILMS = [FilmWeb, FilmCobro, FilmPwa, FilmAgente];
