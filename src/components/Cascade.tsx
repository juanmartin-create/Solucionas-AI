"use client";

import { AnimatePresence, motion } from "motion/react";
import { EASE_ARRAY } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  /** stagger de entrada por letra */
  stagger?: number;
  delayChildren?: number;
  as?: "h2" | "h3" | "div" | "span";
};

/**
 * Cascada letra por letra, keyed por el contenido. Las letras salientes se
 * desenfocan hacia arriba; las entrantes suben desde abajo con blur que se
 * limpia. Ambas se superponen en el mismo lugar.
 */
export function Cascade({
  text,
  className = "",
  stagger = 0.03,
  delayChildren = 0.06,
  as = "div",
}: Props) {
  const Tag = motion[as];
  const letters = Array.from(text);

  return (
    <div className={`relative grid ${className}`} aria-label={text}>
      <AnimatePresence initial={false} mode="popLayout">
        <Tag
          key={text}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: {},
            center: { transition: { staggerChildren: stagger, delayChildren } },
            exit: { transition: { staggerChildren: 0.016 } },
          }}
        >
          {letters.map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              className="inline-block will-change-transform"
              variants={{
                enter: { y: "0.85em", opacity: 0, filter: "blur(10px)" },
                center: {
                  y: "0em",
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.7, ease: EASE_ARRAY },
                },
                exit: {
                  y: "-0.55em",
                  opacity: 0,
                  filter: "blur(8px)",
                  transition: { duration: 0.4, ease: "easeIn" },
                },
              }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </Tag>
      </AnimatePresence>
    </div>
  );
}
