"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useInView } from "motion/react";
import { SERVICES, SITE } from "@/lib/site";
import { EASE_ARRAY } from "@/lib/gsap";
import { Heading } from "./Practice";

const GRID = "minmax(0,2.2fr) 1fr 1fr 1.4fr 0.9fr";

export function Start() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      id="empezar"
      className="relative min-h-svh bg-ground-2"
      style={{ paddingBlock: "var(--section-pad)" }}
    >
      <div className="page-shell">
        <Heading text="Empezar" />
        <p className="text-body mt-8 max-w-[38ch] text-muted">
          Cuatro formatos de trabajo. Los plazos son reales, medidos en proyectos ya
          publicados. El precio depende del alcance y se cotiza después del diagnóstico.
        </p>

        {/* ---------- tabla de especímenes ---------- */}
        <div ref={ref} className="mt-20">
          <div
            className="smallcaps hidden gap-x-[var(--gutter)] px-4 pb-6 text-muted md:grid"
            style={{ gridTemplateColumns: GRID }}
          >
            <span>Formato</span>
            <span>Semanas</span>
            <span>Entregables</span>
            <span>Ideal para</span>
            <span className="text-right">Propuesta</span>
          </div>

          {SERVICES.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ y: 16, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 1.1, ease: EASE_ARRAY, delay: 0.25 + i * 0.12 }}
              className={`group -mx-4 grid min-h-[8.75rem] grid-cols-2 items-center gap-x-[var(--gutter)] gap-y-4 px-4 py-6 transition-colors duration-500 hover:bg-accent/12 md:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.4fr_0.9fr] md:py-0 ${
                i % 2 === 1 ? "bg-ground/50" : ""
              }`}
            >
              <div className="col-span-2 md:col-span-1">
                <div className="text-h2">{s.name}</div>
                <div className="text-small mt-1 text-muted">{s.scope}</div>
              </div>

              <Specimen value={s.weeks} unit="sem" label="Semanas" />
              <Specimen value={s.deliverables} unit="entr." label="Entregables" />

              <div className="col-span-2 md:col-span-1">
                <div className="smallcaps text-muted md:hidden">Ideal para</div>
                <div className="text-body">{s.ideal}</div>
              </div>

              <div className="col-span-2 md:col-span-1 md:text-right">
                <a
                  href={`#contacto`}
                  onClick={() => {
                    const sel = document.querySelector<HTMLSelectElement>("#need");
                    if (sel) sel.value = s.name;
                  }}
                  className="text-small inline-block border-b border-ink/30 pb-0.5 transition-colors duration-500 group-hover:border-accent-deep group-hover:text-accent-deep"
                >
                  Pedir propuesta
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

function Specimen({ value, unit, label }: { value: number; unit: string; label: string }) {
  return (
    <div>
      <div className="smallcaps text-muted md:hidden">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-numeral transition-colors duration-500 group-hover:text-accent-deep">
          {value}
        </span>
        <span className="text-small text-muted">{unit}</span>
      </div>
    </div>
  );
}

type Status = "idle" | "sending" | "sent" | "fallback" | "error";

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.website) return; // honeypot
    setStatus("sending");

    const body = `Nombre: ${data.name}\nEmail: ${data.email}\nNegocio: ${data.company}\nNecesito: ${data.need}\n\n${data.message}`;
    setMailto(
      `mailto:${SITE.email}?subject=${encodeURIComponent(`Propuesta — ${data.need} — ${data.name}`)}&body=${encodeURIComponent(body)}`,
    );

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; reason?: string };
      if (json.ok) {
        setStatus("sent");
        form.reset();
      } else if (json.reason === "unconfigured") {
        setStatus("fallback");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div id="contacto" className="mt-32 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10">
      <div className="col-span-12 md:col-span-5">
        <h3 className="text-h1">Contanos qué necesitás.</h3>
        <p className="text-body mt-6 max-w-[34ch] text-muted">
          Respondemos en menos de dos días hábiles con preguntas concretas o con una
          propuesta. Si preferís, escribí directo a{" "}
          <a href={`mailto:${SITE.email}`} className="border-b border-ink/30 text-ink">
            {SITE.email}
          </a>
          .
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="col-span-12 flex flex-col gap-7 md:col-span-6 md:col-start-7"
        noValidate={false}
      >
        <Field label="Nombre" name="name" type="text" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Negocio o proyecto" name="company" type="text" autoComplete="organization" />

        <label className="flex flex-col gap-2">
          <span className="smallcaps text-muted">Necesito</span>
          <select
            id="need"
            name="need"
            required
            defaultValue=""
            className="text-body border-b border-ink/30 bg-transparent py-2 outline-none transition-colors focus:border-accent"
          >
            <option value="" disabled>
              Elegí un formato
            </option>
            {SERVICES.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Otra cosa">Otra cosa</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="smallcaps text-muted">Mensaje</span>
          <textarea
            name="message"
            rows={4}
            required
            className="text-body resize-none border-b border-ink/30 bg-transparent py-2 outline-none transition-colors focus:border-accent"
            placeholder="Qué vendés, qué te falta, y para cuándo."
          />
        </label>

        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div className="flex flex-wrap items-center gap-6">
          <button
            type="submit"
            disabled={status === "sending"}
            className="text-small bg-ink px-7 py-3.5 text-ground transition-colors duration-500 hover:bg-accent-deep disabled:opacity-60"
          >
            {status === "sending" ? "Enviando…" : "Enviar"}
          </button>

          {status === "sent" && (
            <span className="text-small text-accent-deep">Recibido. Te escribimos pronto.</span>
          )}
          {status === "fallback" && (
            <a href={mailto} className="text-small border-b border-ink/30">
              Abrir en tu correo para enviarlo
            </a>
          )}
          {status === "error" && (
            <a href={mailto} className="text-small border-b border-ink/30">
              No se pudo enviar. Abrir en tu correo
            </a>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="smallcaps text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="text-body border-b border-ink/30 bg-transparent py-2 outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}
