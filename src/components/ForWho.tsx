"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE_ARRAY } from "@/lib/gsap";
import { Heading } from "./Practice";
import { TechGrid } from "./Atmosphere";

/** Rubros a los que les trabajamos. Imágenes ilustrativas (IA), con el neón de cada servicio. */
const PEOPLE = [
  { img: "/people/web.webp", who: "Desarrolladoras y constructoras", what: "Web que vende el proyecto", neon: "#3fe6ff", alt: "Desarrollador mostrando un proyecto en una tablet a una pareja, en una obra" },
  { img: "/people/cobro.webp", who: "Barberías, estéticas y spas", what: "Cobros y gift cards online", neon: "#3dffaf", alt: "Barbero revisando un pago en el celular dentro de su barbería" },
  { img: "/people/app.webp", who: "Coaches y gimnasios", what: "Plataforma y app para alumnos", neon: "#ff4fd8", alt: "Entrenadora mostrándole el celular a un alumno entre series" },
  { img: "/people/agente.webp", who: "E-commerce", what: "Agente con IA que vende", neon: "#ffb340", alt: "Dueña de un e-commerce sonriendo frente a la notebook en su depósito" },
];

export function ForWho() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="para-quien"
      className="relative overflow-hidden bg-ground"
      style={{ paddingTop: "var(--section-pad)", paddingBottom: "var(--section-pad)" }}
    >
      <TechGrid />
      <div className="page-shell relative">
        <div className="smallcaps mb-6 text-accent">Para quién</div>
        <Heading text="Hecho para" italic="tu rubro." />
        <p className="smallcaps mt-8 text-muted">Cada sistema arranca de cómo vende tu negocio.</p>

        <div ref={ref} className="mt-16 grid grid-cols-1 gap-[var(--gutter)] sm:grid-cols-2 lg:grid-cols-4">
          {PEOPLE.map((p, i) => (
            <motion.a
              key={p.img}
              href="#casos"
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 1, ease: EASE_ARRAY, delay: i * 0.12 }}
              className="group relative block outline-none"
              style={{ "--neon": p.neon } as React.CSSProperties}
            >
              <div className="photo relative aspect-[4/3] overflow-hidden sm:aspect-[4/5] transition-shadow duration-500 group-hover:[box-shadow:0_0_0_1px_var(--neon),0_0_28px_-4px_var(--neon)] group-focus-visible:[box-shadow:0_0_0_2px_var(--neon)]">
                <img
                  src={p.img}
                  alt={p.alt}
                  width={896}
                  height={1120}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="font-display leading-[1.1] text-ink" style={{ fontSize: "clamp(1.05rem, 1.25vw, 1.25rem)" }}>
                    {p.who}
                  </div>
                  <div className="smallcaps mt-2 flex items-center gap-2" style={{ color: p.neon }}>
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: p.neon, boxShadow: `0 0 8px ${p.neon}` }} />
                    {p.what}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
        <p className="text-small mt-6 text-ink/40">Imágenes ilustrativas generadas con IA.</p>
      </div>
    </section>
  );
}
