// Mundo 3D da série "E se?": renderer, quarto do Joseph, personagens (Joseph e variações) e animações.
// Uso num episódio:  import { W, H, THREE, scene, camera, renderer, quarto, makeChar, ... } from '../../_lib/mundo3d.js'
// Empacotar:  NODE_PATH=<pasta com three e esbuild>/node_modules esbuild src/cena3d.js --bundle --minify --format=iife --outfile=build/cena3d.js
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
export { THREE };

export const W = 1920, H = 1080;
export const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
export const scene = new THREE.Scene();
scene.background = new THREE.Color('#1d2230');
export const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 60);

// ---------- matemática ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const sm = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const seg = (t, a, b) => sm((t - a) / (b - a));
export const lin = (t, a, b) => clamp((t - a) / (b - a));
export const lerp = (a, b, k) => a + (b - a) * k;
export const mix3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
export const back = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const bounce = x => { x = clamp(x); return Math.abs(Math.sin(x * Math.PI * 2.5)) * (1 - x); };
export const noise = (t, s = 1) => Math.sin(t * 13.1 * s) * 0.5 + Math.sin(t * 27.7 * s + 1.3) * 0.3 + Math.sin(t * 41.3 * s + 2.1) * 0.2;

// ---------- construção ----------
export const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...o });
export function mesh(geo, mat, parent, pos = [0, 0, 0], rot = [0, 0, 0], scl) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot);
  if (scl) m.scale.set(...scl);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m); return m;
}
export const rbox = (w, h, d, r = 0.06) => new RoundedBoxGeometry(w, h, d, 4, r);
export const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 20);
export const sph = (r, a = 32, b = 20) => new THREE.SphereGeometry(r, a, b);
export const grp = (parent, pos = [0, 0, 0]) => { const g = new THREE.Group(); g.position.set(...pos); parent.add(g); return g; };

// ---------- luzes ----------
export const hemi = new THREE.HemisphereLight('#dbe8ff', '#6b4f3a', 0.9); scene.add(hemi);
export const sun = new THREE.DirectionalLight('#fff1dc', 2.2);
sun.position.set(3, 7, 5); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 25 });
sun.shadow.radius = 4; sun.shadow.bias = -0.0005;
scene.add(sun);
export const winLight = new THREE.PointLight('#bfe3ff', 6, 9, 1.6); winLight.position.set(0.5, 2.2, -3.2); scene.add(winLight);
export const lampLight = new THREE.PointLight('#ffc98a', 0, 6, 1.4); lampLight.position.set(-1.55, 1.25, -3.3); scene.add(lampLight);

// ---------- quarto do Joseph ----------
export const quarto = (() => {
  const q = {};
  mesh(new THREE.PlaneGeometry(16, 12), M('#c99a6b', { roughness: 0.8 }), scene, [0, 0, 0], [-Math.PI / 2, 0, 0]);
  for (let i = -7; i <= 7; i++) mesh(new THREE.BoxGeometry(0.02, 0.005, 12), M('#b4855a'), scene, [i * 0.9, 0.003, 0]);
  mesh(new THREE.BoxGeometry(16, 6, 0.2), M('#8fb6cc', { roughness: 0.9 }), scene, [0, 3, -4.1]);
  mesh(new THREE.BoxGeometry(0.2, 6, 12), M('#a7c6d8', { roughness: 0.9 }), scene, [-6.1, 3, 0]);
  mesh(new THREE.BoxGeometry(16, 0.18, 0.06), M('#f3efe6'), scene, [0, 0.09, -3.98]);
  q.glass = new THREE.MeshBasicMaterial({ color: '#bfe3ff' });
  mesh(new THREE.PlaneGeometry(2, 1.4), q.glass, scene, [0.5, 2.3, -3.99]);
  const fr = M('#f6f1e7');
  mesh(rbox(2.2, 0.12, 0.12, 0.03), fr, scene, [0.5, 3.04, -3.95]);
  mesh(rbox(2.2, 0.12, 0.12, 0.03), fr, scene, [0.5, 1.56, -3.95]);
  mesh(rbox(0.12, 1.6, 0.12, 0.03), fr, scene, [-0.56, 2.3, -3.95]);
  mesh(rbox(0.12, 1.6, 0.12, 0.03), fr, scene, [1.56, 2.3, -3.95]);
  mesh(rbox(0.06, 1.4, 0.06, 0.02), fr, scene, [0.5, 2.3, -3.95]);
  q.moon = mesh(sph(0.16), new THREE.MeshBasicMaterial({ color: '#fff6cf' }), scene, [1.05, 2.7, -3.98]);
  q.sunDisk = mesh(sph(0.2), new THREE.MeshBasicMaterial({ color: '#fff3b0' }), scene, [0.0, 2.65, -3.98]);
  for (let i = 0; i < 7; i++) mesh(sph(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), scene, [-0.3 + (i * 0.37) % 1.6, 1.8 + (i * 0.53) % 1.0, -3.985]).userData.star = true;
  mesh(rbox(1.0, 1.3, 0.05, 0.02), M('#2f3e46'), scene, [3.4, 2.6, -3.98]);
  mesh(rbox(0.8, 1.1, 0.06, 0.02), M('#e76f51'), scene, [3.4, 2.6, -3.95]);
  mesh(rbox(1.8, 0.08, 0.35, 0.02), M('#f6f1e7'), scene, [-3.0, 2.9, -3.82]);
  ['#e63946', '#457b9d', '#f4a261', '#2a9d8f', '#8d5fd3'].forEach((c, i) =>
    mesh(rbox(0.12, 0.42 - (i % 2) * 0.08, 0.28, 0.02), M(c), scene, [-3.7 + i * 0.16, 3.15 - (i % 2) * 0.04, -3.82]));
  mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.02, 48), M('#e9c46a', { roughness: 1 }), scene, [0.3, 0.01, -0.4]);
  const bed = q.bed = grp(scene, [-3.2, 0, -2.6]);
  mesh(rbox(1.7, 0.45, 2.6, 0.08), M('#7a5a43'), bed, [0, 0.25, 0]);
  mesh(rbox(1.8, 1.3, 0.16, 0.06), M('#6b4d39'), bed, [0, 0.75, -1.28]);
  mesh(rbox(1.6, 0.25, 2.45, 0.1), M('#f4f1ea'), bed, [0, 0.58, 0]);
  mesh(rbox(1.0, 0.18, 0.45, 0.08), M('#ffffff'), bed, [0, 0.8, -0.95]);
  q.blanket = mesh(rbox(1.66, 0.34, 1.55, 0.14), M('#e07a5f'), bed, [0, 0.84, 0.5]);
  const ns = grp(scene, [-1.75, 0, -3.45]);
  mesh(rbox(0.7, 0.7, 0.6, 0.05), M('#f6f1e7'), ns, [0, 0.35, 0]);
  mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.35, 16), M('#3d405b'), ns, [0.2, 0.88, -0.1]);
  q.lampMat = M('#f2cc8f', { side: THREE.DoubleSide, emissive: '#f2cc8f', emissiveIntensity: 0.3 });
  mesh(new THREE.ConeGeometry(0.2, 0.25, 24, 1, true), q.lampMat, ns, [0.2, 1.12, -0.1]);
  const desk = q.desk = grp(scene, [3.0, 0, -2.0]);
  mesh(rbox(2.0, 0.1, 0.9, 0.04), M('#f6f1e7'), desk, [0, 1.0, 0]);
  for (const x of [-0.9, 0.9]) mesh(rbox(0.1, 1.0, 0.8, 0.03), M('#d9d3c7'), desk, [x, 0.5, 0]);
  mesh(rbox(0.5, 0.06, 0.35, 0.02), M('#264653'), desk, [-0.55, 1.08, 0.05]);
  mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.25, 16), M('#e76f51'), desk, [0.7, 1.17, -0.15]);
  const chair = grp(scene, [3.0, 0, -2.85]);
  mesh(rbox(0.7, 0.1, 0.65, 0.04), M('#3d5a80'), chair, [0, 0.62, 0]);
  mesh(rbox(0.7, 0.8, 0.1, 0.04), M('#3d5a80'), chair, [0, 1.05, -0.32]);
  for (const [x, z] of [[-0.28, -0.25], [0.28, -0.25], [-0.28, 0.25], [0.28, 0.25]])
    mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 10), M('#22333b'), chair, [x, 0.3, z]);
  const plant = grp(scene, [-5.2, 0, -3.3]);
  mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 24), M('#e76f51'), plant, [0, 0.25, 0]);
  for (let i = 0; i < 6; i++) mesh(sph(0.22, 16, 12), M('#52b788'), plant, [Math.cos(i) * 0.2, 0.7 + (i % 3) * 0.15, Math.sin(i) * 0.2], [0, 0, 0], [0.7, 1.4, 0.7]);
  return q;
})();

// dia (1) / noite (0)
export function setDay(k) {
  quarto.glass.color.set(new THREE.Color('#14203f').lerp(new THREE.Color('#bfe3ff'), k));
  quarto.moon.visible = k < 0.5; quarto.sunDisk.visible = k >= 0.5;
  scene.traverse(o => { if (o.userData.star) o.visible = k < 0.5; });
  hemi.intensity = lerp(0.6, 0.9, k); sun.intensity = lerp(0.9, 2.2, k); lampLight.intensity = lerp(4, 0, k);
  sun.color.set(new THREE.Color('#7f8fd6').lerp(new THREE.Color('#fff1dc'), k));
  winLight.color.set(k < 0.5 ? '#6d83c9' : '#bfe3ff'); winLight.intensity = lerp(4, 6, k);
  quarto.lampMat.emissiveIntensity = lerp(1.2, 0.3, k);
  scene.background.set(new THREE.Color('#0d1020').lerp(new THREE.Color('#1d2230'), k));
}

// ---------- personagem (origem no quadril, de frente para +z) ----------
export function makeChar(o = {}) {
  o = { skin: '#a86f4a', hood: '#4f5d40', hood2: '#44513a', pants: '#2b3140', hair: '#1c140f', shoe: '#f1f1f1', sole: '#e63946', old: false, ...o };
  const c = { root: grp(scene) };
  const J = c.root;
  const skin = M(o.skin, { roughness: 0.45 }), hood = M(o.hood, { roughness: 0.75 }), hood2 = M(o.hood2, { roughness: 0.8 });
  const hairM = M(o.hair, { roughness: 0.9 });
  const pantsM = M(o.pants, { roughness: 0.8 }), shoeM = M(o.shoe);
  c.mats = { skin, hood, hood2, hair: hairM, pants: pantsM, shoe: shoeM };
  c.legs = [];
  for (const s of [-1, 1]) {
    const hip = grp(J, [s * 0.2, 0, 0]);
    mesh(cap(0.16, 0.45), pantsM, hip, [0, -0.34, 0]);
    mesh(rbox(0.3, 0.16, 0.42, 0.07), shoeM, hip, [0, -0.72, 0.07]);
    mesh(rbox(0.32, 0.05, 0.44, 0.02), M(o.sole), hip, [0, -0.79, 0.07]);
    c.legs.push(hip);
  }
  const torso = c.torso = grp(J);
  const body = c.body = grp(torso);
  mesh(cap(0.42, 0.42), hood, body, [0, 0.5, 0], [0, 0, 0], [1.08, 1, 0.82]);
  mesh(rbox(0.5, 0.22, 0.08, 0.05), hood2, body, [0, 0.32, 0.33]);
  mesh(new THREE.TorusGeometry(0.24, 0.08, 12, 28), hood2, body, [0, 0.93, -0.02], [Math.PI / 2 - 0.25, 0, 0]);
  for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), M('#ecebe4'), body, [s * 0.09, 0.78, 0.34]);
  const head = c.head = grp(torso, [0, 1.25, 0]);
  mesh(sph(0.42), skin, head, [0, 0, 0], [0, 0, 0], [1, 0.96, 0.95]);
  if (o.old) {
    // careca em cima, cabelo branco dos lados, barba
    for (const s of [-1, 1]) mesh(sph(0.2, 16, 12), hairM, head, [s * 0.33, 0.02, -0.12], [0, 0, 0], [0.6, 1, 1.2]);
    mesh(sph(0.3, 20, 14), hairM, head, [0, -0.05, -0.25], [0, 0, 0], [1.2, 0.9, 0.6]);
    const beardM = M('#f2f0ea', { roughness: 0.95 });
    mesh(sph(0.27, 24, 16), beardM, head, [0, -0.31, 0.2], [0, 0, 0], [1.25, 0.85, 0.75]);
    mesh(cap(0.04, 0.16), beardM, head, [0, -0.115, 0.405], [0, 0, Math.PI / 2]);
    const gl = M('#2b2b2b', { roughness: 0.3 });
    for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.015, 8, 24), gl, head, [s * 0.15, 0.06, 0.42]);
    mesh(cap(0.012, 0.08), gl, head, [0, 0.07, 0.44], [0, 0, Math.PI / 2]);
  } else {
    mesh(new THREE.SphereGeometry(0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), hairM, head, [0, 0.03, -0.03], [-0.35, 0, 0]);
  }
  for (const s of [-1, 1]) mesh(sph(0.09, 16, 12), skin, head, [s * 0.41, -0.02, 0], [0, 0, 0], [0.6, 1, 1]);
  mesh(sph(0.06, 16, 12), M('#9a6040', { roughness: 0.45 }), head, [0, -0.06, 0.41]);
  c.eyes = []; c.pupils = []; c.brows = [];
  const browM = M(o.old ? '#f2f0ea' : o.hair);
  for (const s of [-1, 1]) {
    const e = grp(head, [s * 0.15, 0.06, 0.37]);
    mesh(sph(0.085, 24, 16), M('#ffffff', { roughness: 0.3 }), e, [0, 0, 0], [0, 0, 0], [1, 1.15, 0.6]);
    const p = mesh(sph(0.05, 20, 14), M('#151515', { roughness: 0.15 }), e, [0, 0, 0.035], [0, 0, 0], [1, 1.15, 0.7]);
    mesh(sph(0.015, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), p, [0.018, 0.02, 0.04]);
    c.eyes.push(e); c.pupils.push(p);
    c.brows.push(mesh(rbox(o.old ? 0.16 : 0.13, o.old ? 0.05 : 0.035, 0.03, 0.015), browM, head, [s * 0.15, 0.2, 0.39]));
  }
  const mouthMat = M('#5a2a22', { roughness: 0.6 });
  const my = o.old ? -0.2 : -0.17, mz = o.old ? 0.415 : 0.38;
  c.mSmile = mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 24, Math.PI), mouthMat, head, [0, my, mz], [0, 0, Math.PI]);
  c.mO = mesh(sph(0.055, 16, 12), mouthMat, head, [0, my - 0.02, mz], [0, 0, 0], [0.9, 1.1, 0.5]);
  c.mFlat = mesh(cap(0.018, 0.1), mouthMat, head, [0, my - 0.01, mz + 0.01], [0, 0, Math.PI / 2]);
  c.mSad = mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 24, Math.PI), mouthMat, head, [0, my - 0.07, mz], [0, 0, 0]);
  c.arms = [];
  for (const s of [-1, 1]) {
    const sh = grp(body, [s * 0.47, 0.78, 0]);
    mesh(cap(0.12, 0.26), hood, sh, [0, -0.2, 0]);
    const el = grp(sh, [0, -0.38, 0]);
    mesh(cap(0.11, 0.22), hood, el, [0, -0.15, 0]);
    mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 16), hood2, el, [0, -0.3, 0], [Math.PI / 2, 0, 0]);
    const hand = mesh(sph(0.11, 20, 14), skin, el, [0, -0.38, 0]);
    c.arms.push({ sh, el, hand, s });
  }
  c.handR = c.arms[0].hand; c.handL = c.arms[1].hand;
  // pose: braço [frente, abrir, cotovelo]; perna [frente]; lean = inclinar tronco; scl = amassar/esticar
  c.pose = p => {
    p = { armL: [0, 0, 0], armR: [0, 0, 0], leg: [0, 0], head: [0, 0, 0], lean: 0, twist: 0, scl: [1, 1, 1], breathe: 0, ...p };
    c.arms.forEach(a => {
      const v = a.s < 0 ? p.armR : p.armL;
      a.sh.rotation.set(-v[0], 0, a.s * (0.12 + v[1]));
      a.el.rotation.set(-v[2], 0, 0);
    });
    c.legs.forEach((l, i) => l.rotation.set(-p.leg[i], 0, 0));
    torso.rotation.set(p.lean, p.twist, 0);
    head.rotation.set(...p.head);
    body.scale.set(1 + p.breathe * 0.4, 1 + p.breathe, 1 + p.breathe * 0.4);
    J.scale.set(...p.scl);
  };
  c.face = f => {
    f = { brow: 0, browTilt: 0, mouth: 'smile', open: 1, look: [0, 0], talk: -1, ...f };
    c.brows.forEach((b, i) => { const s = i ? 1 : -1; b.position.y = 0.2 + f.brow * 0.06; b.rotation.z = -s * f.browTilt; });
    c.eyes.forEach(e => e.scale.set(1, Math.max(0.08, f.open), 1));
    c.pupils.forEach(p => { p.position.x = f.look[0] * 0.03; p.position.y = f.look[1] * 0.03; });
    let m = f.mouth;
    if (f.talk >= 0) m = f.talk > 0.12 ? 'o' : (f.mouth === 'o' ? 'flat' : f.mouth);
    c.mSmile.visible = m === 'smile'; c.mO.visible = m === 'o'; c.mFlat.visible = m === 'flat'; c.mSad.visible = m === 'sad';
    c.mO.scale.set(0.9, f.talk >= 0 ? 0.4 + f.talk * 1.2 : 1.1, 0.5);
  };
  return c;
}

// piscar e respirar
export const blink = (t, off = 0) => (((t + off) % 3.7) / 3.7 > 0.965 ? 0.1 : 1);
export const breath = (t, off = 0) => 0.015 * Math.sin((t + off) * 2.4);
// ciclo de caminhada: soma às poses (fase em passos)
export function walkPose(ph, amt = 1) {
  const s = Math.sin(ph * Math.PI);
  return { leg: [0.55 * s * amt, -0.55 * s * amt], armL: [0.45 * s * amt, 0.05, 0.3], armR: [-0.45 * s * amt, 0.05, 0.3], bob: Math.abs(Math.cos(ph * Math.PI)) * 0.06 * amt };
}

// ---------- overlay HTML preso a um ponto 3D ----------
const v3 = new THREE.Vector3();
export function place(el, p, on, scale = 1) {
  if (!on) { el.style.opacity = 0; return; }
  v3.set(...p).project(camera);
  el.style.opacity = 1;
  el.style.left = ((v3.x + 1) / 2 * W) + 'px'; el.style.top = ((1 - v3.y) / 2 * H) + 'px';
  el.style.transform = `translate(-50%,-50%) scale(${scale})`;
}
export function cam(pos, look, shake = 0, t = 0) {
  camera.position.set(pos[0] + noise(t, 1) * shake, pos[1] + noise(t + 3, 1.1) * shake, pos[2]);
  camera.lookAt(...look);
}
// amplitude da narração (para a boca) num instante t
export function ampAt(TL, t) {
  for (const l of TL.lines) if (t >= l.start && t < l.end && l.amp) return l.amp[Math.floor((t - l.start) * 30)] || 0;
  return 0;
}
