/**
 * Escena del inicio (referencia: Flowdrive en Prompt Motion): el nodo de NEXO
 * hecho de miles de puntos dorados que se transforma, con el scroll, en la
 * forma de cada servicio: esfera → navegador → tarjeta de cobro → teléfono →
 * chat → esfera con órbita (cierre). Cada punto viaja con su propio pequeño
 * retraso, así el cambio se ve como un fluido y no como un salto.
 */
import * as THREE from "three";

const N = 9000;
type V3 = [number, number, number];

/* ---------------- formas (cada una devuelve N puntos) ---------------- */
const rnd = (() => {
  let s = 7;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
})();

/** Puntos repartidos a lo largo de una lista de segmentos (contornos). */
function alongSegments(segs: [number, number, number, number][], count: number, z = 0): V3[] {
  const lens = segs.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1));
  const total = lens.reduce((a, b) => a + b, 0);
  const out: V3[] = [];
  for (let i = 0; i < count; i++) {
    let d = (i / count) * total;
    let k = 0;
    while (k < segs.length - 1 && d > lens[k]) d -= lens[k++];
    const [x1, y1, x2, y2] = segs[k];
    const u = lens[k] ? d / lens[k] : 0;
    out.push([x1 + (x2 - x1) * u, y1 + (y2 - y1) * u, z]);
  }
  return out;
}
/** Rectángulo redondeado como segmentos. */
function roundRect(cx: number, cy: number, w: number, h: number, r: number) {
  const segs: [number, number, number, number][] = [];
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
  segs.push([x0 + r, y1, x1 - r, y1], [x1, y1 - r, x1, y0 + r], [x1 - r, y0, x0 + r, y0], [x0, y0 + r, x0, y1 - r]);
  const arc = (ox: number, oy: number, a0: number) => {
    for (let i = 0; i < 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2), b = a0 + ((i + 1) / 6) * (Math.PI / 2);
      segs.push([ox + r * Math.cos(a), oy + r * Math.sin(a), ox + r * Math.cos(b), oy + r * Math.sin(b)]);
    }
  };
  arc(x1 - r, y1 - r, 0); arc(x0 + r, y1 - r, Math.PI / 2); arc(x0 + r, y0 + r, Math.PI); arc(x1 - r, y0 + r, Math.PI * 1.5);
  return segs;
}
/** Relleno de puntos dentro de un rectángulo (bloques de contenido). */
function fillRect(cx: number, cy: number, w: number, h: number, count: number, z = 0): V3[] {
  // grilla ordenada (tramado tipo dot matrix): se lee nítida, no como ruido
  const step = Math.sqrt((w * h) / Math.max(1, count));
  const out: V3[] = [];
  for (let y = cy - h / 2 + step / 2; y < cy + h / 2; y += step)
    for (let x = cx - w / 2 + step / 2; x < cx + w / 2; x += step) out.push([x, y, z]);
  return out;
}
function circle(cx: number, cy: number, r: number, count: number, z = 0): V3[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3;
  });
}
function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** Completa / recorta a N y mezcla, para que cada punto viaje a un lugar distinto. */
function fit(pts: V3[]): V3[] {
  // si sobran puntos, se toman parejos de toda la forma (no se corta el final);
  // si faltan, se repiten posiciones (quedan superpuestos, no se notan)
  const out: V3[] = [];
  if (pts.length >= N) for (let i = 0; i < N; i++) out.push(pts[Math.floor((i * pts.length) / N)]);
  else {
    out.push(...pts);
    while (out.length < N) out.push(pts[out.length % pts.length]);
  }
  return shuffle(out);
}

function sphere(r: number, ring = false): V3[] {
  const pts: V3[] = [];
  const M = ring ? Math.floor(N * 0.78) : N;
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < M; i++) {
    const y = 1 - (i / (M - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    pts.push([Math.cos(g * i) * rr * r, y * r, Math.sin(g * i) * rr * r]);
  }
  if (ring) {
    // la órbita del logo, inclinada
    const R = r * 1.75;
    for (let i = 0; i < N - M; i++) {
      const a = (i / (N - M)) * Math.PI * 2;
      const x = R * Math.cos(a), z = R * Math.sin(a) * 0.32;
      pts.push([x, z * 0.6 - 0.05, z]);
    }
  }
  return fit(pts);
}
function browser(): V3[] {
  const W = 3.8, H = 2.6;
  const pts = [
    ...alongSegments(roundRect(0, 0, W, H, 0.14), 3000),
    ...alongSegments([[-W / 2, H / 2 - 0.38, W / 2, H / 2 - 0.38]], 520),
    ...circle(-W / 2 + 0.25, H / 2 - 0.19, 0.05, 30), ...circle(-W / 2 + 0.42, H / 2 - 0.19, 0.05, 30), ...circle(-W / 2 + 0.59, H / 2 - 0.19, 0.05, 30),
    ...fillRect(-0.7, 0.35, 1.9, 0.18, 380), // titular
    ...fillRect(-0.95, -0.02, 1.4, 0.08, 140),
    ...alongSegments(roundRect(-1.2, -0.62, 0.95, 0.32, 0.15), 520), // botón
    ...fillRect(0.95, -0.15, 1.3, 1.3, 1500), // imagen
  ];
  return fit(pts);
}
function card(): V3[] {
  const W = 3.3, H = 2.05;
  const pts = [
    ...alongSegments(roundRect(0, 0, W, H, 0.2), 3000),
    ...alongSegments(roundRect(-1.05, 0.25, 0.5, 0.38, 0.06), 520), // chip
    ...fillRect(-0.35, -0.38, 2.1, 0.09, 260), // número
    ...fillRect(-0.9, -0.7, 1.0, 0.06, 110), // titular
    ...circle(1.0, -0.62, 0.22, 320), ...circle(1.25, -0.62, 0.22, 320), // marca
    ...fillRect(0.55, 0.45, 1.6, 0.5, 900),
  ];
  return fit(pts);
}
function phone(): V3[] {
  const W = 1.75, H = 3.4;
  const pts = [
    ...alongSegments(roundRect(0, 0, W, H, 0.28), 3400),
    ...alongSegments(roundRect(0, H / 2 - 0.22, 0.55, 0.14, 0.07), 320), // isla
    ...alongSegments(roundRect(0, 0.75, 1.35, 0.42, 0.08), 760),
    ...alongSegments(roundRect(0, 0.17, 1.35, 0.42, 0.08), 760),
    ...alongSegments(roundRect(0, -0.41, 1.35, 0.42, 0.08), 760),
    ...fillRect(0, -1.15, 1.2, 0.35, 700), // timer
    ...circle(0, -1.45, 0.07, 80),
  ];
  return fit(pts);
}
function chat(): V3[] {
  const bubble = (cx: number, cy: number, w: number, h: number, tail: number) => [
    ...alongSegments(roundRect(cx, cy, w, h, h / 2.4), Math.floor((w + h) * 900)),
    ...alongSegments([[cx + tail * (w / 2 - 0.3), cy - h / 2, cx + tail * (w / 2 - 0.05), cy - h / 2 - 0.22]], 120),
  ];
  const pts = [
    ...bubble(0.55, 1.05, 2.2, 0.7, 1),
    ...fillRect(0.45, 1.05, 1.6, 0.08, 160),
    ...bubble(-0.4, 0.0, 2.8, 0.95, -1),
    ...fillRect(-0.55, 0.1, 2.1, 0.07, 170),
    ...fillRect(-0.75, -0.12, 1.6, 0.07, 130),
    ...alongSegments(roundRect(-0.95, -1.05, 1.15, 0.85, 0.12), 1000), // producto 1
    ...alongSegments(roundRect(0.35, -1.05, 1.15, 0.85, 0.12), 1000), // producto 2
    ...fillRect(-0.95, -0.9, 0.9, 0.3, 380),
    ...fillRect(0.35, -0.9, 0.9, 0.3, 380),
  ];
  return fit(pts);
}

const SHAPES = () => [sphere(1.55), browser(), card(), phone(), chat(), sphere(1.3, true)];

/* ---------------- shader de puntos ---------------- */
const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uSize;
  uniform float uPixel;
  varying float vSeed;
  varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(1.5, uSize * uPixel * (0.85 + aSeed * 0.3) / -mv.z);
    vSeed = aSeed;
    vDepth = clamp((-mv.z - 6.0) / 6.0, 0.0, 1.0);
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uTint;
  uniform float uTintMix;
  varying float vSeed;
  varying float vDepth;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = 1.0 - smoothstep(0.38, 0.5, d); // disco nítido, borde apenas suavizado
    vec3 col = mix(uColor, uTint, uTintMix);
    col *= 0.9 + 0.2 * vSeed;
    gl_FragColor = vec4(col, a * (1.0 - vDepth * 0.5));
  }
`;

export type ParticleScene = {
  /** Escena continua: 0 esfera, 1 web, 2 cobro, 3 app, 4 agente, 5 cierre. */
  setStage: (s: number) => void;
  setTint: (hex: string, mix: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

export function createParticleScene(canvas: HTMLCanvasElement, opts: { still?: boolean; compact?: boolean } = {}): ParticleScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  // se renderiza a 2x aunque la pantalla sea 1x: los puntos quedan nítidos
  const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5);
  renderer.setPixelRatio(dpr);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, opts.compact ? 10.5 : 9.5);

  const shapes = SHAPES();
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  const seeds = new Float32Array(N);
  const delays = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    seeds[i] = rnd();
    delays[i] = rnd();
    pos.set(shapes[0][i], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uSize: { value: 0.052 },
      uPixel: { value: 0 },
      uColor: { value: new THREE.Color("#d6b16a") },
      uTint: { value: new THREE.Color("#c9a45c") },
      uTintMix: { value: 0 },
    },
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);
  group.position.x = opts.compact ? 0 : 2.3; // a la derecha: el texto va a la izquierda

  let stageTarget = 0, stage = 0, px = 0, py = 0, sx = 0, sy = 0, tintTarget = 0, tint = 0;
  let raf = 0, running = false;
  const t0 = performance.now();
  const tintColor = new THREE.Color("#c9a45c");

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mat.uniforms.uPixel.value = h * dpr * 0.9;
  }

  const smooth = (x: number) => x * x * (3 - 2 * x);

  function frame(now: number) {
    const t = opts.still ? 0 : (now - t0) / 1000;
    const k = opts.still ? 1 : 0.06;
    stage += (stageTarget - stage) * k;
    tint += (tintTarget - tint) * k;
    sx += (px - sx) * 0.05;
    sy += (py - sy) * 0.05;

    const i0 = Math.min(Math.floor(stage), shapes.length - 2);
    const f = stage - i0;
    const A = shapes[i0], B = shapes[i0 + 1];
    for (let i = 0; i < N; i++) {
      // cada punto arranca con su propio retraso: el cambio fluye
      const d = delays[i] * 0.45;
      const u = smooth(Math.min(1, Math.max(0, (f - d) / 0.55)));
      const a = A[i], b = B[i];
      // un poco de vuelo en profundidad a mitad de camino
      const lift = Math.sin(Math.PI * u) * (seeds[i] - 0.5) * 0.9;
      pos[i * 3] = a[0] + (b[0] - a[0]) * u;
      pos[i * 3 + 1] = a[1] + (b[1] - a[1]) * u + Math.sin(t * 0.8 + seeds[i] * 6.28) * 0.012;
      pos[i * 3 + 2] = a[2] + (b[2] - a[2]) * u + lift;
    }
    geo.attributes.position.needsUpdate = true;

    // las esferas giran; las formas planas quedan de frente, con un leve vaivén
    const round = stage < 0.5 ? 1 - stage * 2 : stage > 4.5 ? (stage - 4.5) * 2 : 0;
    group.rotation.y = round * t * 0.18 + (1 - round) * Math.sin(t * 0.4) * 0.12 + sx * 0.35;
    group.rotation.x = sy * 0.2 + (1 - round) * -0.06;
    mat.uniforms.uTint.value.copy(tintColor);
    mat.uniforms.uTintMix.value = tint;

    renderer.render(scene, camera);
    if (running && !opts.still) raf = requestAnimationFrame(frame);
  }

  resize();
  return {
    setStage(s) {
      stageTarget = s;
      if (opts.still) { stage = s; frame(performance.now()); }
    },
    setTint(hex, m) {
      tintColor.set(hex);
      tintTarget = m;
    },
    setPointer(x, y) { px = x; py = y; },
    resize() { resize(); if (opts.still) frame(performance.now()); },
    start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() { running = false; cancelAnimationFrame(raf); },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
