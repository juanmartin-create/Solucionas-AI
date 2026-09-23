"use client";

import { useRef, useState, type FocusEvent, type FormEvent } from "react";
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
      className="gold-haze relative min-h-svh bg-ground-2"
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
              className={`group -mx-4 grid min-h-[8.75rem] grid-cols-2 items-center gap-x-[var(--gutter)] gap-y-4 px-4 py-6 transition-colors duration-500 hover:bg-accent/10 md:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.4fr_0.9fr] md:py-0 ${
                i % 2 === 1 ? "bg-white/[0.03]" : ""
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
                  href="#contacto"
                  onClick={() => {
                    const sel = document.querySelector<HTMLSelectElement>("#need");
                    if (sel) sel.value = s.name;
                  }}
                  className="btn-ghost"
                  aria-label={`Pedir propuesta de ${s.name}`}
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
        <span className="text-numeral transition-colors duration-500 group-hover:text-accent">
          {value}
        </span>
        <span className="text-small text-muted">{unit}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Status = "idle" | "sending" | "sent" | "fallback" | "error";
type Errors = Partial<Record<"name" | "email" | "need" | "message", string>>;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validateField(name: string, value: string): string | undefined {
  const v = value.trim();
  switch (name) {
    case "name":
      return v ? undefined : "Decinos cómo te llamás.";
    case "email":
      if (!v) return "Necesitamos un email para responderte.";
      return EMAIL_RE.test(v) ? undefined : "Ese email no parece válido. Revisá el @ y el dominio.";
    case "need":
      return v ? undefined : "Elegí un formato, o 'Otra cosa'.";
    case "message":
      return v.length >= 10 ? undefined : "Contanos un poco más: qué vendés y qué te falta.";
    default:
      return undefined;
  }
}

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [mailto, setMailto] = useState("");

  // Validación al salir del campo, no en cada tecla.
  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    const err = validateField(name, value);
    setErrors((prev) => (prev[name as keyof Errors] === err ? prev : { ...prev, [name]: err }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.website) return; // honeypot

    const next: Errors = {};
    for (const k of ["name", "email", "need", "message"] as const) {
      const err = validateField(k, data[k] ?? "");
      if (err) next[k] = err;
    }
    setErrors(next);
    const firstBad = Object.keys(next)[0];
    if (firstBad) {
      form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

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

  const control =
    "text-body min-h-11 w-full border-b bg-transparent py-2 outline-none transition-colors focus:border-accent";
  const border = (k: keyof Errors) => (errors[k] ? "border-red-400/80" : "border-ink/30");

  return (
    <div id="contacto" className="mt-32 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10">
      <div className="col-span-12 md:col-span-5">
        <h3 className="text-h1">Contanos qué necesitás.</h3>
        <p className="text-body mt-6 max-w-[34ch] text-muted">
          Respondemos en menos de dos días hábiles con preguntas concretas o con una
          propuesta. Si preferís, escribí directo a{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="inline-block border-b border-ink/30 py-2 text-ink"
          >
            {SITE.email}
          </a>
          .
        </p>
        <p className="text-small mt-6 text-muted">
          <span className="text-accent">*</span> Campos obligatorios
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="col-span-12 flex flex-col gap-7 md:col-span-6 md:col-start-7"
      >
        <Field
          label="Nombre"
          name="name"
          type="text"
          required
          autoComplete="name"
          error={errors.name}
          onBlur={onBlur}
          className={`${control} ${border("name")}`}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          onBlur={onBlur}
          className={`${control} ${border("email")}`}
        />
        <Field
          label="Negocio o proyecto"
          name="company"
          type="text"
          autoComplete="organization"
          hint="Opcional. Nombre o rubro alcanza."
          className={`${control} border-ink/30`}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="need" className="smallcaps text-muted">
            Necesito <span className="text-accent">*</span>
          </label>
          <select
            id="need"
            name="need"
            required
            defaultValue=""
            onBlur={onBlur}
            aria-invalid={!!errors.need}
            aria-describedby={errors.need ? "need-error" : undefined}
            className={`${control} ${border("need")}`}
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
          {errors.need && <FieldError id="need-error">{errors.need}</FieldError>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="smallcaps text-muted">
            Mensaje <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            onBlur={onBlur}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : "message-hint"}
            className={`${control} resize-none ${border("message")}`}
            placeholder="Qué vendés, qué te falta, y para cuándo."
          />
          {errors.message ? (
            <FieldError id="message-error">{errors.message}</FieldError>
          ) : (
            <p id="message-hint" className="text-small text-muted">
              Dos o tres líneas alcanzan para arrancar.
            </p>
          )}
        </div>

        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div className="flex flex-wrap items-center gap-6">
          <button
            type="submit"
            disabled={status === "sending"}
            aria-busy={status === "sending"}
            className="btn btn-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "Enviando…" : "Enviar"}
          </button>

          {/* región viva: los lectores de pantalla anuncian el resultado */}
          <div aria-live="polite" role="status" className="text-small">
            {status === "sent" && (
              <span className="inline-flex items-center gap-2 text-accent-light">
                <CheckIcon /> Recibido. Te escribimos pronto.
              </span>
            )}
            {status === "fallback" && (
              <a href={mailto} className="inline-flex min-h-11 items-center border-b border-ink/30">
                Abrir en tu correo para enviarlo
              </a>
            )}
            {status === "error" && (
              <span className="inline-flex flex-wrap items-center gap-2">
                <span className="text-red-300">No se pudo enviar.</span>
                <a href={mailto} className="inline-flex min-h-11 items-center border-b border-ink/30">
                  Abrir en tu correo
                </a>
              </span>
            )}
          </div>
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
  inputMode,
  hint,
  error,
  onBlur,
  className,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "text";
  hint?: string;
  error?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  className: string;
}) {
  const errId = `${name}-error`;
  const hintId = `${name}-hint`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="smallcaps text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? errId : hint ? hintId : undefined}
        className={className}
      />
      {error ? (
        <FieldError id={errId}>{error}</FieldError>
      ) : hint ? (
        <p id={hintId} className="text-small text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className="text-small inline-flex items-center gap-2 text-red-300">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      {children}
    </p>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
