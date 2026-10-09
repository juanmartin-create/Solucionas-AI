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

/**
 * Casos en video (sección "Casos"). El título es el tipo de solución, no el
 * cliente: el que mira tiene que reconocer lo que necesita su negocio.
 * `status` es honesto: "Demo" cuando no hay cliente real detrás.
 */
export type CaseFilm = {
  id: string;
  index: string;
  solution: string;
  solutionItalic: string;
  client: string;
  points: [string, string, string];
  status: string;
  live: boolean;
  video: string;
  poster: string;
  duration: string;
  href?: string;
  glow: string; // rgba del glow detrás de la pantalla en el stage de casos
  /** Segundo desde el que corre el preview mudo (después de la placa y el gancho). */
  previewFrom: number;
};

export const CASE_FILMS: CaseFilm[] = [
  {
    id: "barbershop",
    index: "01",
    solution: "Landing + cobro online",
    solutionItalic: "y panel de gestión.",
    client: "Buenos Aires Barbershop",
    points: ["Gift cards pagadas con Mercado Pago", "Código por email al instante", "Panel para validar cada canje"],
    status: "Cliente real",
    live: true,
    video: "/cases/films/01-barbershop.mp4",
    poster: "/cases/films/01-barbershop.jpg",
    previewFrom: 3,
    glow: "rgba(232, 177, 112, 0.42)",
    duration: "0:25",
    href: "https://buenosairesbarbershop.com",
  },
  {
    id: "selene",
    index: "02",
    solution: "Web de lujo",
    solutionItalic: "que lleva a la consulta.",
    client: "Selene Experiences",
    points: ["Recorrido editorial a medida", "Consulta en español e inglés", "Marca premium, cero plantillas"],
    status: "En producción",
    live: true,
    video: "/cases/films/02-selene.mp4",
    poster: "/cases/films/02-selene.jpg",
    previewFrom: 3,
    glow: "rgba(190, 150, 190, 0.40)",
    duration: "0:30",
    href: "https://selene-experiences.netlify.app",
  },
  {
    id: "constructora",
    index: "03",
    solution: "Web que vende el proyecto",
    solutionItalic: "antes de la visita.",
    client: "Constructora Norte",
    points: ["Antes/después y plano interactivo", "Cuota calculada al instante", "Visita agendada desde la web"],
    status: "Demo",
    live: false,
    video: "/cases/films/03-constructora.mp4",
    poster: "/cases/films/03-constructora.jpg",
    previewFrom: 5.6,
    glow: "rgba(120, 150, 180, 0.40)",
    duration: "0:31",
    href: "https://constructora-norte.netlify.app",
  },
  {
    id: "cadence",
    index: "04",
    solution: "Plataforma B2B2C",
    solutionItalic: "para gimnasios y coaches.",
    client: "Cadence",
    points: ["Panel del coach con su marca", "App propia para cada alumno", "Reporte semanal por WhatsApp"],
    status: "Demo · datos de ejemplo",
    live: false,
    video: "/cases/films/04-cadence.mp4",
    poster: "/cases/films/04-cadence.jpg",
    previewFrom: 5.6,
    glow: "rgba(201, 164, 92, 0.36)",
    duration: "0:30",
  },
  {
    id: "modi",
    index: "05",
    solution: "Agente con IA",
    solutionItalic: "que vende.",
    client: "Modi para Ecomodico",
    points: ["Recomienda con precios reales", "Cross-selling y agrega al carrito", "Te acompaña hasta el pago"],
    status: "Prototipo funcional",
    live: false,
    video: "/cases/films/05-modi.mp4",
    poster: "/cases/films/05-modi.jpg",
    previewFrom: 3,
    glow: "rgba(70, 150, 230, 0.40)",
    duration: "0:34",
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
