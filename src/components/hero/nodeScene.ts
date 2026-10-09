/**
 * Escena 3D del inicio: el nodo dorado de la marca NEXO.
 * Una esfera de oro con dos anillos en órbita y cuatro hilos de neón que la
 * conectan con los servicios (web, cobro, app, agente). Por los hilos viajan
 * pulsos hacia el nodo: lo que entra al negocio.
 *
 * Todo depende de dos entradas: `scroll` (0→1 del track) y el puntero.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const SATS = [
  { key: "web", label: "Web que vende", sub: "Consultas las 24 h", color: "#3fe6ff", pos: [-2.2, 1.2, 0.4] },
  { key: "cobro", label: "Cobros online", sub: "Mercado Pago + panel", color: "#3dffaf", pos: [2.1, 1.35, -0.6] },
  { key: "app", label: "App propia", sub: "Para tus clientes", color: "#ff4fd8", pos: [2.0, -1.3, 0.7] },
  { key: "agente", label: "Agente con IA", sub: "Vende por chat", color: "#ffb340", pos: [-1.9, -1.45, -0.5] },
] as const;

const GOLD = new THREE.Color("#c9a45c");

function glowTexture(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, color);
  grd.addColorStop(0.25, color + "aa");
  grd.addColorStop(1, color + "00");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const win = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

export type NodeScene = {
  setScroll: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  /** Posiciones en pantalla (px) de los satélites, para las etiquetas HTML. */
  labels: () => { x: number; y: number; visible: number }[];
  /** Posición en pantalla del nodo (centro) y su visibilidad. */
  center: () => { x: number; y: number; visible: number };
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

export function createNodeScene(canvas: HTMLCanvasElement, opts: { still?: boolean; compact?: boolean } = {}): NodeScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, opts.compact ? 9.5 : 9.2);

  const world = new THREE.Group();
  scene.add(world);

  // ---- el nodo ----
  const nodeMat = new THREE.MeshPhysicalMaterial({
    color: GOLD,
    metalness: 1,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    emissive: new THREE.Color("#3a2a0c"),
    emissiveIntensity: 0.6,
  });
  const node = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), nodeMat);
  world.add(node);

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture("#c9a45c"), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55 }));
  halo.scale.setScalar(5.2);
  world.add(halo);

  const key = new THREE.PointLight("#ffd9a0", 30, 20);
  key.position.set(3, 3, 4);
  scene.add(key);
  const rim = new THREE.PointLight("#c9a45c", 20, 20);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  // ---- anillos en órbita ----
  const ringMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.3, emissive: GOLD, emissiveIntensity: 0.25 });
  const rings = [1.55, 1.95].map((r, i) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 12, 220), ringMat);
    m.rotation.set(Math.PI / 2 + (i ? 0.5 : -0.35), i ? 0.4 : -0.2, 0);
    world.add(m);
    return m;
  });

  // ---- hilos, satélites y pulsos ----
  const threads = SATS.map((s, i) => {
    const color = new THREE.Color(s.color);
    const end = new THREE.Vector3(...s.pos);
    const mid = end.clone().multiplyScalar(0.5).add(new THREE.Vector3(0, i % 2 ? -0.5 : 0.5, 0.9));
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), mid, end]);
    const geo = new THREE.TubeGeometry(curve, 120, 0.018, 8, false);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, toneMapped: false });
    const tube = new THREE.Mesh(geo, mat);
    world.add(tube);
    const total = geo.index!.count;

    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.11, 32, 32), new THREE.MeshBasicMaterial({ color, toneMapped: false }));
    sat.position.copy(end);
    world.add(sat);
    const satGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(s.color), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    satGlow.scale.setScalar(0.9);
    satGlow.position.copy(end);
    world.add(satGlow);

    const pulses = [0, 1, 2].map(() => {
      const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(s.color), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      p.scale.setScalar(0.28);
      world.add(p);
      return p;
    });
    return { curve, tube, total, sat, satGlow, pulses, end };
  });

  // ---- polvo dorado de fondo ----
  const dustGeo = new THREE.BufferGeometry();
  const N = 260;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.random() * 6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.6, r * Math.sin(ph) * Math.sin(th) - 2], i * 3);
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: GOLD, size: 0.025, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(dust);

  // ---- estado ----
  let scroll = 0; // valor suavizado que usa la escena
  let target = 0; // valor real del scroll
  let px = 0,
    py = 0,
    sx = 0,
    sy = 0;
  let raf = 0;
  let running = false;
  const t0 = performance.now();
  const v = new THREE.Vector3();

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame(now: number) {
    const t = opts.still ? 2.5 : (now - t0) / 1000;
    const intro = ease(t / 1.8); // los hilos se trazan al cargar
    sx += (px - sx) * 0.05;
    sy += (py - sy) * 0.05;
    scroll += (target - scroll) * (opts.still ? 1 : 0.075);
    if (Math.abs(target - scroll) < 1e-4) scroll = target;

    // scroll: la cámara se acerca y el mundo gira; al final el nodo llena la pantalla
    const s1 = ease(win(scroll, 0, 0.55));
    const s2 = ease(win(scroll, 0.55, 1));
    world.rotation.y = t * 0.12 + s1 * 1.4 + sx * 0.35;
    world.rotation.x = -0.12 + s1 * 0.25 + sy * 0.2;
    const baseZ = opts.compact ? 9.5 : 9.2;
    camera.position.z = baseZ - s1 * 2.2 - s2 * 3.4;
    world.position.x = opts.compact ? 0 : 2.35 * (1 - s1);

    const breathe = 1 + Math.sin(t * 1.6) * 0.025;
    node.scale.setScalar(breathe * (1 + s2 * 0.6));
    halo.material.opacity = 0.45 + 0.15 * Math.sin(t * 1.6) + s2 * 0.4;
    rings[0].rotation.z = t * 0.35;
    rings[1].rotation.z = -t * 0.25;
    rings.forEach((r) => ((r.material as THREE.MeshStandardMaterial).opacity = 1));

    threads.forEach((th, i) => {
      const grow = clamp01(intro * 1.15 - i * 0.05);
      th.tube.geometry.setDrawRange(0, Math.floor(th.total * grow) - (Math.floor(th.total * grow) % 3));
      const out = 1 - s2;
      (th.tube.material as THREE.MeshBasicMaterial).opacity = 0.9 * out;
      const on = grow >= 0.98 ? out : 0;
      th.sat.visible = on > 0.01;
      th.satGlow.material.opacity = on * (0.7 + 0.3 * Math.sin(t * 2 + i));
      th.pulses.forEach((p, k) => {
        const u = 1 - (((t * 0.35 + k / 3 + i * 0.13) % 1) + 1) % 1; // del satélite al nodo
        th.curve.getPointAt(u, v);
        p.position.copy(v);
        p.material.opacity = on * Math.sin(Math.PI * u);
      });
    });

    dust.rotation.y = t * 0.02;
    renderer.render(scene, camera);
    if (running && !opts.still) raf = requestAnimationFrame(frame);
  }

  function labels() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const out = 1 - ease(win(scroll, 0.55, 0.8));
    return threads.map((th) => {
      th.sat.getWorldPosition(v);
      v.project(camera);
      return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, visible: th.sat.visible ? out : 0 };
    });
  }

  resize();
  return {
    setScroll(p) {
      target = p;
      if (opts.still) scroll = p;
      if (opts.still) frame(performance.now());
    },
    setPointer(x, y) {
      px = x;
      py = y;
    },
    resize() {
      resize();
      if (opts.still) frame(performance.now());
    },
    labels,
    center() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      node.getWorldPosition(v);
      v.y -= 1.45;
      v.project(camera);
      return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, visible: 1 - ease(win(scroll, 0.3, 0.5)) };
    },
    start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      renderer.dispose();
    },
  };
}
