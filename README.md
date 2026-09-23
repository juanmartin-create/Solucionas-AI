# CAUCE — sitio del estudio

Landing cinematográfica controlada por scroll para vender webs, sistemas de cobro/gestión, productos PWA y agentes con IA. Construida con el método de Web Motion Academy.

**Stack:** Next.js 16 (App Router, TS) · Tailwind v4 (tokens CSS-first) · GSAP ScrollTrigger · Lenis · motion/react.

## Correr

```bash
npm install
npm run dev -- -p 3001   # http://localhost:3001
npm run build            # build de producción
```

## Estructura

| Archivo | Qué es |
|---|---|
| `src/lib/site.ts` | **Todo el contenido**: nombre del estudio, email, casos, servicios, método. Cambiar el nombre acá lo propaga a todo. |
| `src/app/globals.css` | Design tokens (`--ground`, `--ink`, `--accent`…), escala tipográfica, utilities `page-shell`, `text-display`, etc. |
| `src/components/hero/` | Hero scrubbeado: canvas procedural (bocetos → capturas reales) + overlay que sale por sus bordes + cover handoff. |
| `src/components/Practice.tsx` | "Lo que hacemos": 4 cards en escalera con grilla SVG dibujada. |
| `src/components/Method.tsx` | "Cómo trabajamos": polyline SVG dibujada por scroll con numeral viajando por `offset-path`. |
| `src/components/Descent.tsx` | "Casos": stage pinneado de 650vh con 6 casos en crossfade, handoff por negro neutro y "El estudio" adentro del mismo stage. |
| `src/components/Start.tsx` | "Empezar": tabla de especímenes + formulario de contacto. |
| `src/components/Footer.tsx` | Footer fijo que la página destapa, wordmark medido edge-to-edge. |
| `src/app/api/contact/route.ts` | Envío del formulario vía Resend. Sin `RESEND_API_KEY` el formulario abre el `mailto:`. |
| `public/cases/*.webp` | Capturas de los proyectos reales (1400px, ~70 KB c/u). |

## Leyes del sitio

1. Todo valor de scroll es función pura del progreso del track. Scrollear hacia atrás reconstruye la escena.
2. Escrituras directas por `ref` desde el callback de scroll, nunca React state (salvo el índice activo).
3. Reduced motion y viewport ≤ 860px son caminos de primera clase: sin pin, sin scrub, sin descargar el set completo de imágenes.

## Formulario

Copiar `.env.example` a `.env.local` y cargar `RESEND_API_KEY` (y `CONTACT_FROM` con un dominio verificado). En Vercel o Netlify, las mismas variables van en el panel del proyecto.

## Deploy

Vercel: importar el repo y listo. Netlify: usar el runtime de Next.js (se detecta solo).

## Reemplazar el hero por video IA (opcional)

El canvas actual es procedural. Para usar un clip Kling/Runway siguiendo el método del curso: extraer frames con la skill `web-motion-frames` a `public/hero/frames/scrub/frame_%03d.jpg` y reemplazar `renderHero` por el dibujado de la secuencia con lógica `object-fit: cover`. El resto del hero (overlay, ventanas, handoff) no cambia.
