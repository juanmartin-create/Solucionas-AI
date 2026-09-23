"use client";

import { useCallback, useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

const FRONTS = [
  { n: "01", label: "Webs", o: "opacity-30" },
  { n: "02", label: "Sistemas", o: "opacity-45" },
  { n: "03", label: "Productos", o: "opacity-60" },
  { n: "04", label: "Agentes", o: "opacity-80" },
];

export function Footer() {
  const markRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);

  /* Wordmark edge-to-edge medido, no adivinado con vw. */
  const fit = useCallback(() => {
    const el = markRef.current;
    if (!el) return;
    const target = window.innerWidth;
    let size = 100;
    el.style.fontSize = `${size}px`;
    for (let i = 0; i < 8; i++) {
      const w = el.getBoundingClientRect().width;
      if (!w) break;
      const ratio = target / w;
      if (Math.abs(1 - ratio) < 0.005) break;
      size *= ratio;
      el.style.fontSize = `${size}px`;
    }
    el.style.opacity = "1";
  }, []);

  useEffect(() => {
    fit();
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", onResize);
  }, [fit]);

  /* Durante el destape, el wordmark sube contra el scroll. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const el = liftRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - window.innerHeight - window.scrollY;
      const t = Math.min(1, Math.max(0, 1 - remaining / window.innerHeight));
      el.style.transform = `translate3d(0, ${(1 - t) * 60}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer
      className="gold-haze fixed bottom-0 left-0 z-0 h-screen w-full overflow-hidden bg-pitch text-ink"
      aria-label="Pie de página"
    >
      {/* arriba izquierda */}
      <div className="absolute left-[var(--page-margin)] top-[14vh] flex flex-col gap-1">
        <a href="#empezar" className="text-body -my-1 flex min-h-11 items-center text-ink/70 transition-colors hover:text-ink">
          Empezar
        </a>
        <a href="#casos" className="text-body -my-1 flex min-h-11 items-center text-ink/70 transition-colors hover:text-ink">
          Casos
        </a>
        <a href={`mailto:${SITE.email}`} className="text-body -my-1 flex min-h-11 items-center text-ink/70 transition-colors hover:text-ink">
          Contacto
        </a>
        <p className="text-h2 mt-10 max-w-[26ch] text-ink/80">
          La web que vende, el sistema que cobra y el agente que responde. Publicado y en
          uso.
        </p>
      </div>

      {/* arriba derecha */}
      <div className="absolute right-[var(--page-margin)] top-[14vh] hidden flex-col items-end md:flex">
        <span className="smallcaps text-ink/40">Cuatro frentes</span>
        <div className="mt-4 flex flex-col items-end gap-1">
          {FRONTS.map((f) => (
            <div key={f.n} className={`flex items-baseline gap-4 ${f.o}`}>
              <span className="smallcaps">{f.label}</span>
              <span className="font-display leading-none" style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}>
                {f.n}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* wordmark */}
      <div ref={liftRef} className="absolute inset-x-0 bottom-0 will-change-transform">
        <div className="smallcaps mb-2 px-[var(--page-margin)] text-accent" style={{ letterSpacing: "0.32em" }}>
          {SITE.sub}
        </div>
        <div
          ref={markRef}
          className="inline-block whitespace-nowrap font-display leading-none tracking-[-0.02em]"
          style={{
            opacity: 0,
            marginBottom: "-0.21em",
            marginLeft: "-0.02em",
            backgroundImage: "linear-gradient(to bottom, var(--ink) 30%, var(--accent) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {SITE.name}
        </div>
      </div>
    </footer>
  );
}
