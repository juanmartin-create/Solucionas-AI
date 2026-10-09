"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { CaseFilm } from "@/lib/site";
import { EASE_ARRAY } from "@/lib/gsap";

/** Video del caso completo, con sonido. Va en portal al body: el main crea un stacking context y la nav quedaría encima. */
export function CaseLightbox({ film, onClose }: { film: CaseFilm | null; onClose: () => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence>{film && <Box film={film} onClose={onClose} />}</AnimatePresence>, document.body);
}

function Box({ film, onClose }: { film: CaseFilm; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Caso ${film.client}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 md:p-10"
      data-lenis-prevent
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 10 }}
        transition={{ duration: 0.5, ease: EASE_ARRAY }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[1280px]"
      >
        <video src={film.video} poster={film.poster} controls autoPlay playsInline className="photo aspect-video w-full bg-black" />
        <button ref={closeRef} type="button" onClick={onClose} className="btn-ghost absolute -top-14 right-0">
          Cerrar ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

/** Badge "Ver el caso" que va sobre cada video. */
export function PlayBadge({ duration }: { duration: string }) {
  return (
    <span className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-pitch shadow-[0_10px_30px_-10px_rgba(201,164,92,0.8)] transition-transform duration-300 group-hover:scale-110">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
        </svg>
      </span>
      <span className="smallcaps text-ink">Ver el caso · {duration}</span>
    </span>
  );
}
