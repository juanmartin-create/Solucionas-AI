import { SITE } from "@/lib/site";

const LINKS = [
  ["#practica", "Práctica"],
  ["#metodo", "Método"],
  ["#casos", "Casos"],
  ["#empezar", "Empezar"],
];

export function Nav() {
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-30 mix-blend-difference"
      aria-label="Principal"
    >
      <div className="flex items-center justify-between px-[var(--page-margin)] py-6 text-white">
        <a href="#" className="smallcaps pointer-events-auto flex items-baseline gap-2">
          <span className="font-medium">{SITE.name}</span>
          <span className="opacity-60">{SITE.sub}</span>
        </a>
        <div className="pointer-events-auto hidden items-center gap-8 md:flex">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="smallcaps opacity-70 transition-opacity hover:opacity-100">
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
