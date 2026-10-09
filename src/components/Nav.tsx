"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const LINKS = [
  ["practica", "Práctica"],
  ["casos", "Casos"],
  ["metodo", "Método"],
  ["empezar", "Empezar"],
] as const;

export function Nav() {
  const [active, setActive] = useState<string | null>(null);

  // Estado activo: la sección que ocupa el centro del viewport. Se busca por id en cada
  // scroll (no con IntersectionObserver fijo) porque Casos se vuelve a montar al pasar
  // del camino estático al pinneado y el observer quedaba mirando un nodo viejo.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let found: string | null = null;
      for (const [id] of LINKS) {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (r && r.top <= mid && r.bottom >= mid) found = id;
      }
      setActive((a) => (a === found ? a : found));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
    {/* Velo arriba: lo que scrollea por debajo no se mezcla con los links (la nav usa mix-blend-difference). */}
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-ground via-ground/80 to-transparent"
    />
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-30 mix-blend-difference"
      aria-label="Principal"
    >
      <div className="flex items-center justify-between px-[var(--page-margin)] py-3 text-white">
        {/* área táctil de 44px: padding vertical + margen negativo para no mover el layout */}
        <a
          href="#contenido"
          className="smallcaps pointer-events-auto -my-1 flex min-h-11 items-center gap-2 py-3"
          aria-label={SITE.fullName}
        >
          <span className="font-medium">{SITE.name}</span>
          <span className="hidden opacity-60 sm:inline">{SITE.sub}</span>
        </a>

        <div className="pointer-events-auto flex items-center gap-2 md:gap-6">
          {LINKS.map(([id, label], i) => {
            const isActive = active === id;
            const last = i === LINKS.length - 1;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "smallcaps relative flex min-h-11 items-center px-2 py-3 transition-opacity",
                  isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                  // en mobile solo queda el CTA
                  last ? "" : "hidden md:flex",
                ].join(" ")}
              >
                {label}
                <span
                  aria-hidden
                  className={`absolute bottom-1.5 left-2 right-2 h-px bg-current transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
    </>
  );
}
