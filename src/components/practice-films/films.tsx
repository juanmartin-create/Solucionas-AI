"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Check, Cursor, Label, Pill, Ripple, SANS, SERIF, useIn, useLoopFade, useRange } from "./shared";

/* ------------------------------------------------------------------ */
/* 01 · Webs que venden: el navegador se dibuja, la página scrollea    */
/* sola y el botón de consulta recibe el click.                        */
/* ------------------------------------------------------------------ */
export function FilmWeb() {
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const draw = useRange(0, 26);
  const scroll = interpolate(frame, [30, 105], [0, 372], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 372 * (0.5 - 0.5 * Math.cos((Math.PI * scroll) / 372));
  const content = useIn(18);
  const btnGlow = useRange(128, 140);
  const P = 2 * (520 + 560);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Label style={{ position: "absolute", left: 40, top: 34 }}>Web · en vivo</Label>
      <svg width={600} height={760} style={{ position: "absolute", inset: 0 }}>
        <rect x={40} y={90} width={520} height={560} rx={14} fill="none" stroke={C.gold} strokeWidth={1.5} strokeDasharray={`${P * draw} ${P}`} />
        <line x1={40} y1={130} x2={40 + 520 * draw} y2={130} stroke={C.line} />
      </svg>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 60 + i * 18, top: 106, width: 9, height: 9, borderRadius: 9, background: C.line, opacity: draw }} />
      ))}
      <div style={{ position: "absolute", left: 41, top: 131, width: 518, height: 518, overflow: "hidden", opacity: content }}>
        <div style={{ transform: `translateY(${-eased}px)`, padding: "34px 34px" }}>
          <div style={{ fontFamily: SERIF, fontSize: 57, lineHeight: 1.02, color: C.ink }}>
            Del lote vacío
            <br />
            <em style={{ color: C.gold }}>al cierre de obra.</em>
          </div>
          <div style={{ marginTop: 22, height: 10, width: "78%", background: C.line, borderRadius: 4 }} />
          <div style={{ marginTop: 10, height: 10, width: "62%", background: C.line, borderRadius: 4 }} />
          <div style={{ marginTop: 28, height: 190, borderRadius: 10, background: "linear-gradient(135deg, rgba(201,164,92,0.28), rgba(201,164,92,0.04))", border: `1px solid ${C.line}` }} />
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 90, borderRadius: 8, background: C.panel, border: `1px solid ${C.line}` }} />
            ))}
          </div>
          <div style={{ marginTop: 34, fontFamily: SERIF, fontSize: 44, color: C.ink }}>
            Visitanos <em style={{ color: C.gold }}>esta semana.</em>
          </div>
          <div
            style={{
              marginTop: 22,
              display: "inline-block",
              padding: "16px 28px",
              borderRadius: 999,
              fontFamily: SANS,
              fontSize: 25,
              fontWeight: 600,
              color: C.pitch,
              background: C.gold,
              boxShadow: `0 0 ${40 * btnGlow}px ${10 * btnGlow}px rgba(201,164,92,${0.45 * btnGlow})`,
            }}
          >
            Agendar visita →
          </div>
        </div>
      </div>
      <Cursor path={[[100, 520, 700], [126, 196, 428]]} press={[132]} />
      <Ripple at={132} x={200} y={432} />
      <Pill start={140} style={{ right: 52, top: 560 }}>
        <Check /> +1 consulta
      </Pill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Sistemas de cobro: el WhatsApp y la planilla se vuelven un     */
/* flujo: gift card → pago aprobado → email con código → canjeado.     */
/* ------------------------------------------------------------------ */
export function FilmCobro() {
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const chaos = 1 - useRange(30, 46);
  const steps = [
    { at: 48, title: "Gift card", sub: "Corte + barba · $ 18.000" },
    { at: 74, title: "Mercado Pago", sub: "Pago aprobado" },
    { at: 100, title: "Email al cliente", sub: "Código 00001" },
    { at: 126, title: "Panel", sub: "Canjeado" },
  ];
  const lineK = interpolate(frame, [52, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Label style={{ position: "absolute", left: 40, top: 34 }}>De WhatsApp a sistema</Label>
      {/* el antes: chat + planilla que se disuelven */}
      <div style={{ position: "absolute", left: 40, top: 100, width: 520, opacity: chaos, filter: `blur(${(1 - chaos) * 8}px)` }}>
        {["¿Tenés gift cards?", "¿Te transfiero?", "¿Me pasás el código?"].map((t, i) => (
          <div
            key={t}
            style={{
              marginLeft: i % 2 ? 160 : 0,
              marginBottom: 14,
              width: 300,
              padding: "14px 18px",
              borderRadius: 16,
              background: i % 2 ? "rgba(201,164,92,0.14)" : C.panel,
              border: `1px solid ${C.line}`,
              fontFamily: SANS,
              fontSize: 25,
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
      {/* el después: un flujo limpio */}
      <svg width={600} height={760} style={{ position: "absolute", inset: 0 }}>
        <line x1={76} y1={150} x2={76} y2={150 + 450 * lineK} stroke={C.gold} strokeWidth={1.5} />
      </svg>
      {steps.map((s, i) => (
        <Step key={s.title} at={s.at} top={120 + i * 150} title={s.title} sub={s.sub} done={frame >= s.at + 14} last={i === 3} />
      ))}
    </AbsoluteFill>
  );
}

function Step({ at, top, title, sub, done, last }: { at: number; top: number; title: string; sub: string; done: boolean; last: boolean }) {
  const k = useIn(at);
  return (
    <div style={{ position: "absolute", left: 56, top, display: "flex", alignItems: "center", gap: 26, opacity: k, transform: `translateX(${(1 - k) * 30}px)` }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
          border: `1.5px solid ${C.gold}`,
          background: done ? C.gold : C.pitch,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {done && <Check size={20} />}
      </div>
      <div style={{ padding: "18px 24px", width: 400, borderRadius: 14, background: last && done ? "rgba(201,164,92,0.12)" : C.panel, border: `1px solid ${last && done ? C.gold : C.line}` }}>
        <div style={{ fontFamily: SERIF, fontSize: 39, color: C.ink }}>{title}</div>
        <div style={{ marginTop: 4, fontFamily: SANS, fontSize: 22, letterSpacing: "0.04em", color: done ? C.gold : C.muted }}>{sub}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Productos y PWA: se instala sin app store, se abre y una serie */
/* marcada dispara el timer.                                           */
/* ------------------------------------------------------------------ */
export function FilmPwa() {
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const draw = useRange(0, 22);
  const sheet = useIn(26) * (1 - useIn(58));
  const icon = useIn(60);
  const open = useIn(84);
  const done = frame >= 112;
  const restLeft = Math.max(0, 90 - Math.floor((frame - 118) / 30));
  const P = 2 * (300 + 600);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Label style={{ position: "absolute", left: 40, top: 34 }}>App instalable · sin store</Label>
      <svg width={600} height={760} style={{ position: "absolute", inset: 0 }}>
        <rect x={150} y={100} width={300} height={600} rx={42} fill="none" stroke={C.gold} strokeWidth={1.5} strokeDasharray={`${P * draw} ${P}`} />
      </svg>
      <div style={{ position: "absolute", left: 152, top: 102, width: 296, height: 596, borderRadius: 40, overflow: "hidden" }}>
        {/* pantalla de inicio */}
        <div style={{ position: "absolute", inset: 0, padding: "70px 30px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, alignContent: "start", opacity: draw }}>
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 14, background: C.panel, border: `1px solid ${C.line}` }} />
          ))}
          <div style={{ aspectRatio: "1", borderRadius: 14, background: C.gold, transform: `scale(${icon})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 29, color: C.pitch }}>
            N
          </div>
        </div>
        {/* hoja "Agregar a inicio" */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 26px 34px", background: "#17150f", borderTop: `1px solid ${C.gold}`, transform: `translateY(${(1 - sheet) * 100}%)` }}>
          <div style={{ fontFamily: SANS, fontSize: 22, color: C.muted }}>Compartir</div>
          <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 12, background: "rgba(201,164,92,0.14)", fontFamily: SANS, fontSize: 25, color: C.ink }}>＋ Agregar a inicio</div>
        </div>
        {/* app abierta */}
        <div style={{ position: "absolute", inset: 0, background: "#0d0c0a", padding: "60px 26px", opacity: open, transform: `scale(${0.6 + 0.4 * open})`, transformOrigin: "82% 30%" }}>
          <div style={{ fontFamily: SERIF, fontSize: 39, color: C.ink }}>
            Push · <em style={{ color: C.gold }}>Pecho</em>
          </div>
          <div style={{ marginTop: 6, fontFamily: SANS, fontSize: 18, letterSpacing: "0.16em", color: C.muted }}>PRESS BANCA · 4 SERIES</div>
          {[0, 1, 2].map((i) => {
            const on = i === 0 && done;
            return (
              <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: on ? "rgba(201,164,92,0.12)" : C.panel, border: `1px solid ${on ? C.gold : C.line}` }}>
                <div style={{ fontFamily: SANS, fontSize: 23, color: C.ink, flex: 1 }}>{i + 1} · 60 kg × 8</div>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: on ? C.gold : "transparent", border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <Check size={16} />}
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 22, padding: "14px 18px", borderRadius: 12, border: `1px solid ${C.gold}`, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: done ? 1 : 0, transform: `translateY(${done ? 0 : 20}px)` }}>
            <span style={{ fontFamily: SANS, fontSize: 18, letterSpacing: "0.2em", color: C.gold }}>DESCANSO</span>
            <span style={{ fontFamily: SERIF, fontSize: 39, color: C.ink }}>
              {String(Math.floor(restLeft / 60)).padStart(2, "0")}:{String(restLeft % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
      <Cursor path={[[24, 470, 720], [46, 300, 640], [70, 470, 640], [80, 412, 300], [100, 470, 640], [110, 402, 300]]} press={[50, 82, 112]} />
      <Ripple at={50} x={300} y={642} />
      <Ripple at={82} x={414} y={302} />
      <Ripple at={112} x={404} y={302} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Agentes con IA: pregunta → recomienda con precio → agrega al   */
/* carrito → sugiere un extra → lleva al pago.                         */
/* ------------------------------------------------------------------ */
export function FilmAgente() {
  const frame = useCurrentFrame();
  const fade = useLoopFade();
  const q = "¿Tenés proteína sin lactosa?";
  const typed = q.slice(0, Math.max(0, Math.min(q.length, Math.floor((frame - 8) / 1))));
  const dots = frame >= 38 && frame < 56;
  const reply = useIn(56);
  const cardA = useIn(64);
  const cardB = useIn(72);
  const added = frame >= 104;
  const cross = useIn(120);
  const pay = useRange(150, 160);
  const payIn = useIn(138);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Label style={{ position: "absolute", left: 40, top: 34 }}>Agente · vende por chat</Label>
      <div style={{ position: "absolute", left: 40, top: 90, width: 520, height: 650, borderRadius: 18, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.02)" }} />
      {/* carrito */}
      <div style={{ position: "absolute", right: 60, top: 108, fontFamily: SANS, fontSize: 21, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
        Carrito
        <span style={{ minWidth: 26, height: 26, borderRadius: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", background: added ? C.gold : C.panel, color: added ? C.pitch : C.muted, fontWeight: 700, transform: `scale(${added && frame < 112 ? 1.25 : 1})` }}>
          {added ? 1 : 0}
        </span>
      </div>
      {/* pregunta */}
      <div style={{ position: "absolute", right: 64, top: 160, maxWidth: 360, padding: "14px 18px", borderRadius: "16px 16px 4px 16px", background: "rgba(201,164,92,0.16)", fontFamily: SANS, fontSize: 26, color: C.ink, opacity: frame >= 6 ? 1 : 0 }}>
        {typed}
        {frame < 36 && <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>}
      </div>
      {dots && (
        <div style={{ position: "absolute", left: 64, top: 268, display: "flex", gap: 6, padding: "16px 18px", borderRadius: 16, background: C.panel }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: 8, background: C.ink, opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 5) / 5)) }} />
          ))}
        </div>
      )}
      {/* respuesta con productos */}
      <div style={{ position: "absolute", left: 64, top: 268, width: 470, opacity: reply, transform: `translateY(${(1 - reply) * 14}px)` }}>
        <div style={{ padding: "14px 18px", borderRadius: "16px 16px 16px 4px", background: C.panel, fontFamily: SANS, fontSize: 26, color: C.ink, display: "inline-block" }}>Sí, estas dos son sin lactosa:</div>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          <Product k={cardA} name="Isolate 1 kg" price="$ 38.500" pressed={frame >= 98 && frame < 106} added={added} />
          <Product k={cardB} name="Vegana 900 g" price="$ 31.900" />
        </div>
      </div>
      {/* cross-selling */}
      <div style={{ position: "absolute", left: 64, top: 590, padding: "14px 18px", borderRadius: "16px 16px 16px 4px", background: C.panel, fontFamily: SANS, fontSize: 26, color: C.ink, opacity: cross, transform: `translateY(${(1 - cross) * 14}px)` }}>
        Agregado. ¿Le sumo un <em style={{ fontFamily: SERIF, color: C.gold, fontSize: 29 }}>shaker</em>?
      </div>
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 662,
          padding: "16px 30px",
          borderRadius: 999,
          fontFamily: SANS,
          fontSize: 26,
          fontWeight: 600,
          color: C.pitch,
          background: C.gold,
          opacity: payIn,
          boxShadow: `0 0 ${40 * pay}px ${10 * pay}px rgba(201,164,92,${0.45 * pay})`,
        }}
      >
        Ir a pagar →
      </div>
      <Cursor path={[[80, 520, 720], [96, 170, 488], [140, 170, 488], [150, 470, 694]]} press={[100, 156]} />
      <Ripple at={100} x={172} y={491} />
      <Ripple at={156} x={470} y={696} />
    </AbsoluteFill>
  );
}

function Product({ k, name, price, pressed, added }: { k: number; name: string; price: string; pressed?: boolean; added?: boolean }) {
  return (
    <div style={{ flex: 1, padding: 12, borderRadius: 14, background: C.panel, border: `1px solid ${added ? C.gold : C.line}`, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
      <div style={{ height: 44, borderRadius: 10, background: "linear-gradient(135deg, rgba(201,164,92,0.3), rgba(201,164,92,0.05))" }} />
      <div style={{ marginTop: 12, fontFamily: SERIF, fontSize: 29, color: C.ink }}>{name}</div>
      <div style={{ marginTop: 2, fontFamily: SANS, fontSize: 22, color: C.gold }}>{price}</div>
      <div
        style={{
          marginTop: 12,
          padding: "10px 0",
          textAlign: "center",
          borderRadius: 999,
          fontFamily: SANS,
          fontSize: 21,
          fontWeight: 600,
          color: added ? C.pitch : C.ink,
          background: added ? C.gold : "transparent",
          border: `1px solid ${C.gold}`,
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
