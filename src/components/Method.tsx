"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { METHOD } from "@/lib/site";
import { ScrollTrigger } from "@/lib/gsap";
import { useStaticPath } from "@/hooks/useMedia";
import { Heading } from "./Practice";

const INDENTS = [0, 6, 12, 18]; // % del ancho del contenedor
const STEP_DROP = 32; // px debajo del top de cada fila
const RAIL = "clamp(3.5rem, 7vw, 6rem)";

export function Method() {
  const isStatic = useStaticPath();
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPolylineElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);
  const pathD = useRef<string>("");
  const rowTops = useRef<number[]>([]);
  const total = useRef(0);

  /* Construir el path midiendo las filas reales. */
  const build = useCallback(() => {
    const box = boxRef.current;
    const poly = pathRef.current;
    if (!box || !poly) return;
    const W = box.clientWidth;
    const H = box.clientHeight;
    const boxTop = box.getBoundingClientRect().top;
    const tops = rowRefs.current.map((r) =>
      r ? r.getBoundingClientRect().top - boxTop : 0,
    );
    rowTops.current = tops;

    const xs = INDENTS.map((pct) => (pct / 100) * W);
    const pts: [number, number][] = [[xs[0], 0]];
    for (let i = 1; i < xs.length; i++) {
      const y = tops[i] + STEP_DROP;
      pts.push([xs[i - 1], y], [xs[i], y]);
    }
    pts.push([xs[xs.length - 1], H]);

    poly.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
    const len = poly.getTotalLength();
    total.current = len;
    poly.style.strokeDasharray = `${len}`;

    // Mismo path para offset-path del numeral (en px, coordenadas del box).
    pathD.current = "M" + pts.map((p) => `${p[0]} ${p[1]}`).join(" L");
    if (numeralRef.current) {
      numeralRef.current.style.offsetPath = `path('${pathD.current}')`;
      numeralRef.current.style.offsetRotate = "0deg";
    }
  }, []);

  const apply = useCallback(
    (p: number) => {
      const poly = pathRef.current;
      const num = numeralRef.current;
      if (!poly || !num) return;
      poly.style.strokeDashoffset = `${total.current * (1 - p)}`;
      num.style.offsetDistance = `${p * 100}%`;
      // índice alcanzado: en qué fila está el punto del numeral
      const pt = poly.getPointAtLength(total.current * p);
      let idx = 0;
      rowTops.current.forEach((t, i) => {
        if (pt.y >= t + STEP_DROP - 1) idx = i;
      });
      setReached((r) => (r === idx ? r : idx));
    },
    [],
  );

  useEffect(() => {
    if (isStatic) return;
    const section = sectionRef.current;
    if (!section) return;
    build();
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 70%",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => {
        build();
        apply(self.progress);
      },
    });
    apply(st.progress);
    const ro = new ResizeObserver(() => {
      build();
      apply(st.progress);
    });
    ro.observe(section);
    return () => {
      st.kill();
      ro.disconnect();
    };
  }, [isStatic, build, apply]);

  return (
    <section
      id="metodo"
      ref={sectionRef}
      className="relative overflow-hidden bg-ground-2"
      style={{ paddingBlock: "var(--section-pad)" }}
    >
      {/* fondo: una luz de agua a la derecha; la mitad izquierda queda limpia para el texto */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 70% at 88% 50%, var(--gold-glow), transparent 70%)",
        }}
      />

      <div className="page-shell relative">
        <Heading text="Cómo" italic="trabajamos" />
        <p className="text-body mt-8 max-w-[38ch] text-muted">
          El mismo camino para una web, un sistema o un agente. Cuatro etapas, cada una
          con un entregable que se puede mirar y usar.
        </p>

        <div ref={boxRef} className="relative mt-24" style={{ paddingLeft: RAIL }}>
          {!isStatic && (
            <>
              <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                <polyline
                  ref={pathRef}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  points=""
                />
              </svg>
              <div
                ref={numeralRef}
                className="text-numeral pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 bg-ground-2 px-2 text-ink"
                style={{ offsetDistance: "0%" }}
                aria-hidden
              >
                {METHOD[reached].index}
              </div>
            </>
          )}

          <div className="flex flex-col" style={{ gap: "16vh" }}>
            {METHOD.map((step, i) => {
              const on = isStatic || i <= reached;
              return (
                <div
                  key={step.index}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="transition-colors duration-700"
                  style={{
                    marginLeft: `${INDENTS[i]}%`,
                    color: on ? "var(--ink)" : "var(--muted)",
                  }}
                >
                  {isStatic && (
                    <div className="text-numeral mb-2 text-accent">{step.index}</div>
                  )}
                  <div className="text-h1">{step.title}</div>
                  <div className="text-h2 mt-3 max-w-[30ch]">{step.detail}</div>
                  <div className="text-small mt-3 opacity-80">{step.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
