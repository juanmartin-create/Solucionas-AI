/**
 * Datos del sitio. Cambiar el nombre del estudio acá y se propaga a
 * wordmark, metadata, footer y emails.
 */
export const SITE = {
  /** Wordmark grande (hero y footer). */
  name: "NEXO",
  /** Subtítulo que acompaña al wordmark. */
  sub: "Soluciones AI",
  /** Nombre completo para metadata, nav y emails. */
  fullName: "Nexo — Soluciones AI",
  tagline: "Webs, sistemas y agentes que venden solos.",
  description:
    "Estudio digital en Buenos Aires. Diseñamos y construimos webs cinematográficas, sistemas de cobro y gestión, productos PWA y agentes con IA para negocios reales.",
  url: "https://nexo-solucionesai.netlify.app",
  email: "juanmartin@simplex.la",
  city: "Buenos Aires, Argentina",
  locale: "es_AR",
} as const;

export type CaseStudy = {
  id: string;
  index: string;
  name: string;
  kind: string;
  line: string; // dato que va en el riel izquierdo del descenso
  stack: string;
  image: string; // /public
  href?: string;
  glow: string; // rgba del glow detrás de la pantalla
};

export const CASES: CaseStudy[] = [
  {
    id: "barbershop",
    index: "01",
    name: "Buenos Aires Barbershop",
    kind: "Web + gift cards con cobro online",
    line: "Gift cards vendidas y cobradas por Mercado Pago, con panel de administración y emails automáticos.",
    stack: "GSAP · Netlify Functions · Supabase · Mercado Pago",
    image: "/cases/barbershop-gift.webp",
    href: "https://buenosairesbarbershop.com",
    glow: "rgba(232, 177, 112, 0.42)",
  },
  {
    id: "selene",
    index: "02",
    name: "Selene Experiences",
    kind: "Web editorial de viajes a medida",
    line: "Sitio bilingüe para una curadora de viajes con treinta años en Argentina. Publicado en producción.",
    stack: "HTML · CSS editorial · formulario de contacto",
    image: "/cases/selene.webp",
    href: "https://selene-experiences.netlify.app",
    glow: "rgba(190, 150, 190, 0.40)",
  },
  {
    id: "constructora",
    index: "03",
    name: "Constructora Norte",
    kind: "Carta de presentación interactiva",
    line: "Antes/después, plano interactivo, tour 360° y calculadora de obra en una sola página.",
    stack: "React · Tour 360° · WebP",
    image: "/cases/constructora.webp",
    href: "https://constructora-norte.netlify.app",
    glow: "rgba(120, 150, 180, 0.40)",
  },
  {
    id: "cadence",
    index: "04",
    name: "CADENCE",
    kind: "Plataforma B2B para coaches",
    line: "Portal privado por cliente, rutinas generadas con IA y planes de alimentación con intercambios.",
    stack: "PWA · localStorage-first · Supabase-ready",
    image: "/cases/cadence.webp",
    glow: "rgba(200, 255, 60, 0.30)",
  },
  {
    id: "nomade",
    index: "05",
    name: "Nomade",
    kind: "Prototipo de alta fidelidad",
    line: "Plataforma para intercambios universitarios: landing, onboarding y dashboard navegables.",
    stack: "React · diseño con IA · prototipo clickeable",
    image: "/cases/nomade.webp",
    glow: "rgba(235, 140, 60, 0.38)",
  },
  {
    id: "ecomodico",
    index: "06",
    name: "Modi para Ecomodico",
    kind: "Vendedor con IA para e-commerce",
    line: "Widget de chat que busca productos, arma el pedido y vende con método. Embudo y costo medidos.",
    stack: "FastAPI · Claude · widget embebible",
    image: "/cases/ecomodico.webp",
    glow: "rgba(70, 150, 230, 0.40)",
  },
];

export const PRACTICE = [
  {
    index: "01",
    title: "Webs que venden",
    copy: "Sitios editoriales y cinematográficos, controlados por scroll, pensados para convertir. Sin plantillas: cada uno arranca de la marca y del cliente que tiene que llamar.",
  },
  {
    index: "02",
    title: "Sistemas de cobro y gestión",
    copy: "Gift cards, reservas, catálogos, paneles de administración. Cobros con Mercado Pago, emails automáticos y roles. Lo que hoy hacés por WhatsApp y planilla, en un sistema.",
  },
  {
    index: "03",
    title: "Productos y PWA",
    copy: "Apps instalables sin app store, con datos propios y sincronización. Prototipos en alta fidelidad para validar antes de invertir.",
  },
  {
    index: "04",
    title: "Agentes con IA",
    copy: "Vendedores, asistentes y bots que responden por chat, WhatsApp o Telegram. Con conocimiento del negocio, método de venta y métricas de lo que hacen.",
  },
];

export const METHOD = [
  {
    index: "01",
    title: "Diagnóstico",
    detail: "Qué vendés, a quién y qué tiene que pasar cuando alguien llega.",
    time: "1 semana",
  },
  {
    index: "02",
    title: "Diseño y build",
    detail: "Sistema de diseño, secciones una por una, verificadas en el navegador.",
    time: "2 a 4 semanas",
  },
  {
    index: "03",
    title: "Lanzamiento",
    detail: "Dominio, deploy, cobros, emails. Se prueba con dinero real antes de anunciarlo.",
    time: "1 semana",
  },
  {
    index: "04",
    title: "Acompañamiento",
    detail: "Cambios, métricas y mejoras mientras el negocio lo use.",
    time: "continuo",
  },
];

export const SERVICES = [
  {
    name: "Web editorial",
    weeks: 3,
    deliverables: 5,
    scope: "Sitio one-page o multi-sección, dominio y deploy",
    ideal: "Marcas, estudios, servicios premium",
  },
  {
    name: "Web cinematográfica",
    weeks: 5,
    deliverables: 8,
    scope: "Scroll-driven, assets generados con IA, motion",
    ideal: "Producto o marca que tiene que impresionar",
  },
  {
    name: "Sistema de venta",
    weeks: 6,
    deliverables: 10,
    scope: "Cobros, panel admin, emails, roles",
    ideal: "Comercios con reservas, gift cards o catálogo",
  },
  {
    name: "Agente con IA",
    weeks: 4,
    deliverables: 6,
    scope: "Bot entrenado, canal, métricas de conversación",
    ideal: "E-commerce y atención con volumen",
  },
];
