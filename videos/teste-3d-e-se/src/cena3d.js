// Teste 3D "E se?" — Joseph em estilo de brinquedo (three.js). Determinístico: window.render(t).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const W = 1920, H = 1080;
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#1d2230');
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 60);

// ---------- helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const seg = (t, a, b) => sm((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const mix3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const back = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...o });
function mesh(geo, mat, parent, pos = [0, 0, 0], rot = [0, 0, 0], scl) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot);
  if (scl) m.scale.set(...scl);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m); return m;
}
const rbox = (w, h, d, r = 0.06) => new RoundedBoxGeometry(w, h, d, 4, r);
const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 20);
const sph = (r, a = 32, b = 20) => new THREE.SphereGeometry(r, a, b);
const grp = (parent, pos = [0, 0, 0]) => { const g = new THREE.Group(); g.position.set(...pos); parent.add(g); return g; };

// ---------- luzes ----------
const hemi = new THREE.HemisphereLight('#dbe8ff', '#6b4f3a', 0.9); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1dc', 2.2);
sun.position.set(3, 7, 5); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 25 });
sun.shadow.radius = 4; sun.shadow.bias = -0.0005;
scene.add(sun);
const winLight = new THREE.PointLight('#bfe3ff', 6, 9, 1.6); winLight.position.set(0.5, 2.2, -3.2); scene.add(winLight);
const phoneLight = new THREE.PointLight('#4fc3ff', 0, 4, 2); scene.add(phoneLight);
const bulbLight = new THREE.PointLight('#ffd54a', 0, 5, 2); scene.add(bulbLight);

// ---------- quarto ----------
mesh(new THREE.PlaneGeometry(16, 12), M('#c99a6b', { roughness: 0.8 }), scene, [0, 0, 0], [-Math.PI / 2, 0, 0]);
for (let i = -7; i <= 7; i++) mesh(new THREE.BoxGeometry(0.02, 0.005, 12), M('#b4855a'), scene, [i * 0.9, 0.003, 0]);
const wallMat = M('#8fb6cc', { roughness: 0.9 });
mesh(new THREE.BoxGeometry(16, 6, 0.2), wallMat, scene, [0, 3, -4.1]);
mesh(new THREE.BoxGeometry(0.2, 6, 12), M('#a7c6d8', { roughness: 0.9 }), scene, [-6.1, 3, 0]);
mesh(new THREE.BoxGeometry(16, 0.18, 0.06), M('#f3efe6'), scene, [0, 0.09, -3.98]);
// janela
const winGlass = new THREE.MeshBasicMaterial({ color: '#bfe3ff' });
mesh(new THREE.PlaneGeometry(2, 1.4), winGlass, scene, [0.5, 2.3, -3.99]);
const fr = M('#f6f1e7');
mesh(rbox(2.2, 0.12, 0.12, 0.03), fr, scene, [0.5, 3.04, -3.95]);
mesh(rbox(2.2, 0.12, 0.12, 0.03), fr, scene, [0.5, 1.56, -3.95]);
mesh(rbox(0.12, 1.6, 0.12, 0.03), fr, scene, [-0.56, 2.3, -3.95]);
mesh(rbox(0.12, 1.6, 0.12, 0.03), fr, scene, [1.56, 2.3, -3.95]);
mesh(rbox(0.06, 1.4, 0.06, 0.02), fr, scene, [0.5, 2.3, -3.95]);
const moon = mesh(sph(0.16), new THREE.MeshBasicMaterial({ color: '#fff6cf' }), scene, [1.05, 2.7, -3.98]);
const sunDisk = mesh(sph(0.2), new THREE.MeshBasicMaterial({ color: '#fff3b0' }), scene, [0.0, 2.65, -3.98]);
// quadro e prateleira
mesh(rbox(1.0, 1.3, 0.05, 0.02), M('#2f3e46'), scene, [3.4, 2.6, -3.98]);
mesh(rbox(0.8, 1.1, 0.06, 0.02), M('#e76f51'), scene, [3.4, 2.6, -3.95]);
mesh(rbox(1.8, 0.08, 0.35, 0.02), M('#f6f1e7'), scene, [-3.0, 2.9, -3.82]);
['#e63946', '#457b9d', '#f4a261', '#2a9d8f', '#8d5fd3'].forEach((c, i) =>
  mesh(rbox(0.12, 0.42 - (i % 2) * 0.08, 0.28, 0.02), M(c), scene, [-3.7 + i * 0.16, 3.15 - (i % 2) * 0.04, -3.82]));
// tapete
mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.02, 48), M('#e9c46a', { roughness: 1 }), scene, [0.3, 0.01, -0.4]);
// cama (comprimento em z, cabeceira na parede)
const bed = grp(scene, [-3.2, 0, -2.6]);
mesh(rbox(1.7, 0.45, 2.6, 0.08), M('#7a5a43'), bed, [0, 0.25, 0]);
mesh(rbox(1.8, 1.3, 0.16, 0.06), M('#6b4d39'), bed, [0, 0.75, -1.28]);
mesh(rbox(1.6, 0.25, 2.45, 0.1), M('#f4f1ea'), bed, [0, 0.58, 0]);
mesh(rbox(1.0, 0.18, 0.45, 0.08), M('#ffffff'), bed, [0, 0.8, -0.95]);
const blanket = mesh(rbox(1.66, 0.34, 1.55, 0.14), M('#e07a5f'), bed, [0, 0.84, 0.5]);
// criado-mudo + abajur
const ns = grp(scene, [-1.75, 0, -3.45]);
mesh(rbox(0.7, 0.7, 0.6, 0.05), M('#f6f1e7'), ns, [0, 0.35, 0]);
mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.35, 16), M('#3d405b'), ns, [0.2, 0.88, -0.1]);
mesh(new THREE.ConeGeometry(0.2, 0.25, 24, 1, true), M('#f2cc8f', { side: THREE.DoubleSide, emissive: '#f2cc8f', emissiveIntensity: 0.3 }), ns, [0.2, 1.12, -0.1]);
// mesa (de frente para a câmera) + cadeira
const desk = grp(scene, [3.0, 0, -2.0]);
mesh(rbox(2.0, 0.1, 0.9, 0.04), M('#f6f1e7'), desk, [0, 1.0, 0]);
for (const x of [-0.9, 0.9]) mesh(rbox(0.1, 1.0, 0.8, 0.03), M('#d9d3c7'), desk, [x, 0.5, 0]);
mesh(rbox(0.5, 0.06, 0.35, 0.02), M('#264653'), desk, [-0.55, 1.08, 0.05]);
mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.25, 16), M('#e76f51'), desk, [0.7, 1.17, -0.15]);
const chair = grp(scene, [3.0, 0, -2.85]);
mesh(rbox(0.7, 0.1, 0.65, 0.04), M('#3d5a80'), chair, [0, 0.62, 0]);
mesh(rbox(0.7, 0.8, 0.1, 0.04), M('#3d5a80'), chair, [0, 1.05, -0.32]);
for (const [x, z] of [[-0.28, -0.25], [0.28, -0.25], [-0.28, 0.25], [0.28, 0.25]])
  mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 10), M('#22333b'), chair, [x, 0.3, z]);
// planta
const plant = grp(scene, [-5.2, 0, -3.3]);
mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 24), M('#e76f51'), plant, [0, 0.25, 0]);
for (let i = 0; i < 6; i++) mesh(sph(0.22, 16, 12), M('#52b788'), plant, [Math.cos(i) * 0.2, 0.7 + (i % 3) * 0.15, Math.sin(i) * 0.2], [0, 0, 0], [0.7, 1.4, 0.7]);

// ---------- Joseph (origem no quadril) ----------
const SKIN = '#a86f4a', HOOD = '#4f5d40', HOOD2 = '#44513a', PANTS = '#2b3140', HAIR = '#1c140f';
const J = grp(scene);
const skin = M(SKIN, { roughness: 0.45 }), hood = M(HOOD, { roughness: 0.75 }), hood2 = M(HOOD2, { roughness: 0.8 });
const legs = [];
for (const s of [-1, 1]) {
  const hip = grp(J, [s * 0.2, 0, 0]);
  mesh(cap(0.16, 0.45), M(PANTS, { roughness: 0.8 }), hip, [0, -0.34, 0]);
  mesh(rbox(0.3, 0.16, 0.42, 0.07), M('#f1f1f1'), hip, [0, -0.72, 0.07]);
  mesh(rbox(0.32, 0.05, 0.44, 0.02), M('#e63946'), hip, [0, -0.79, 0.07]);
  legs.push(hip);
}
const torso = grp(J, [0, 0, 0]);
mesh(cap(0.42, 0.42), hood, torso, [0, 0.5, 0], [0, 0, 0], [1.08, 1, 0.82]);
mesh(rbox(0.5, 0.22, 0.08, 0.05), hood2, torso, [0, 0.32, 0.33]);
mesh(new THREE.TorusGeometry(0.24, 0.08, 12, 28), hood2, torso, [0, 0.93, -0.02], [Math.PI / 2 - 0.25, 0, 0]);
for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), M('#ecebe4'), torso, [s * 0.09, 0.78, 0.34]);
const head = grp(torso, [0, 1.25, 0]);
mesh(sph(0.42), skin, head, [0, 0, 0], [0, 0, 0], [1, 0.96, 0.95]);
const hair = mesh(new THREE.SphereGeometry(0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), M(HAIR, { roughness: 0.9 }), head, [0, 0.03, -0.03], [-0.35, 0, 0]);
for (const s of [-1, 1]) mesh(sph(0.09, 16, 12), skin, head, [s * 0.41, -0.02, 0], [0, 0, 0], [0.6, 1, 1]);
mesh(sph(0.06, 16, 12), M('#9a6040', { roughness: 0.45 }), head, [0, -0.06, 0.41]);
const eyes = [], pupils = [], brows = [];
for (const s of [-1, 1]) {
  const e = grp(head, [s * 0.15, 0.06, 0.37]);
  mesh(sph(0.085, 24, 16), M('#ffffff', { roughness: 0.3 }), e, [0, 0, 0], [0, 0, 0], [1, 1.15, 0.6]);
  const p = mesh(sph(0.05, 20, 14), M('#151515', { roughness: 0.15 }), e, [0, 0, 0.035], [0, 0, 0], [1, 1.15, 0.7]);
  mesh(sph(0.015, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), p, [0.018, 0.02, 0.04]);
  eyes.push(e); pupils.push(p);
  brows.push(mesh(rbox(0.13, 0.035, 0.03, 0.015), M(HAIR), head, [s * 0.15, 0.2, 0.39]));
}
const mouthMat = M('#5a2a22', { roughness: 0.6 });
const mSmile = mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 24, Math.PI), mouthMat, head, [0, -0.17, 0.38], [0, 0, Math.PI]);
const mO = mesh(sph(0.055, 16, 12), mouthMat, head, [0, -0.19, 0.38], [0, 0, 0], [0.9, 1.1, 0.5]);
const mFlat = mesh(cap(0.018, 0.1), mouthMat, head, [0, -0.18, 0.39], [0, 0, Math.PI / 2]);
const mSmirk = mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 24, Math.PI * 0.7), mouthMat, head, [0.02, -0.17, 0.385], [0, 0, Math.PI + 0.3]);
const arms = [];
for (const s of [-1, 1]) {
  const sh = grp(torso, [s * 0.47, 0.78, 0]);
  mesh(cap(0.12, 0.26), hood, sh, [0, -0.2, 0]);
  const el = grp(sh, [0, -0.38, 0]);
  mesh(cap(0.11, 0.22), hood, el, [0, -0.15, 0]);
  mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 16), hood2, el, [0, -0.3, 0], [Math.PI / 2, 0, 0]);
  const hand = mesh(sph(0.11, 20, 14), skin, el, [0, -0.38, 0]);
  arms.push({ sh, el, hand, s });
}
// props presos ao Joseph
const book = grp(torso, [0, 0.55, 0.55]);
const pageMat = M('#fbf8ef'), coverMat = M('#2a9d8f');
const bL = grp(book), bR = grp(book);
mesh(rbox(0.36, 0.48, 0.03, 0.01), coverMat, bL, [-0.18, 0, 0]); mesh(rbox(0.33, 0.45, 0.04, 0.01), pageMat, bL, [-0.17, 0, 0.03]);
mesh(rbox(0.36, 0.48, 0.03, 0.01), coverMat, bR, [0.18, 0, 0]); mesh(rbox(0.33, 0.45, 0.04, 0.01), pageMat, bR, [0.17, 0, 0.03]);
const flip = grp(book); mesh(new THREE.BoxGeometry(0.32, 0.44, 0.005), pageMat, flip, [0.16, 0, 0.06]);

// ---------- celular, faíscas, lâmpada ----------
const phone = grp(scene);
mesh(rbox(0.22, 0.42, 0.04, 0.03), M('#20232b', { roughness: 0.3 }), phone);
const screenMat = new THREE.MeshStandardMaterial({ color: '#0b1a2a', emissive: '#4fc3ff', emissiveIntensity: 1.2 });
mesh(new THREE.PlaneGeometry(0.19, 0.37), screenMat, phone, [0, 0, 0.022]);
const halo = mesh(new THREE.TorusGeometry(0.42, 0.025, 10, 48), new THREE.MeshBasicMaterial({ color: '#7fdcff', transparent: true, opacity: 0.8 }), phone);
const sparks = [];
for (let i = 0; i < 14; i++) sparks.push(mesh(sph(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? '#7fdcff' : '#ffffff' }), scene));
const bulb = grp(scene);
mesh(sph(0.2, 24, 16), new THREE.MeshStandardMaterial({ color: '#fff3a0', emissive: '#ffd54a', emissiveIntensity: 2.2 }), bulb, [0, 0.12, 0]);
mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.14, 16), M('#9aa0a6', { metalness: 0.4 }), bulb, [0, -0.1, 0]);
const rays = grp(bulb, [0, 0.12, 0]);
for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; mesh(cap(0.018, 0.12), new THREE.MeshBasicMaterial({ color: '#ffd54a' }), rays, [Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0], [0, 0, a + Math.PI / 2]); }

// ---------- poses ----------
const P0 = { lx: 0, ly: 0, lz: 0, rx: 0, ry: 0, rz: 0, armL: [0, 0, 0], armR: [0, 0, 0], leg: [0, 0], head: [0, 0, 0], lean: 0 };
function pose(p) {
  p = { ...P0, ...p };
  // braço: [frente (+ = para frente), abrir (+ = para fora), cotovelo (+ = dobra para frente)]
  arms.forEach(a => {
    const v = a.s < 0 ? p.armR : p.armL;
    a.sh.rotation.set(-v[0], 0, a.s * (0.12 + v[1]));
    a.el.rotation.set(-v[2], 0, 0);
  });
  legs.forEach((l, i) => l.rotation.set(-p.leg[i], 0, 0));
  torso.rotation.set(p.lean, 0, 0);
  head.rotation.set(...p.head);
}
function face(f) {
  f = { brow: 0, browTilt: 0, mouth: 'smile', open: 1, look: [0, 0], ...f };
  brows.forEach((b, i) => { const s = i ? 1 : -1; b.position.y = 0.2 + f.brow * 0.06; b.rotation.z = -s * f.browTilt; });
  eyes.forEach(e => e.scale.set(1, Math.max(0.08, f.open), 1));
  pupils.forEach(p => { p.position.x = f.look[0] * 0.03; p.position.y = f.look[1] * 0.03; });
  mSmile.visible = f.mouth === 'smile'; mO.visible = f.mouth === 'o'; mFlat.visible = f.mouth === 'flat'; mSmirk.visible = f.mouth === 'smirk';
}
const blink = t => { const k = (t % 3.7) / 3.7; return k > 0.96 ? 0.1 : 1; };

// ---------- câmera ----------
function cam(pos, look) { camera.position.set(...pos); camera.lookAt(...look); }

// ---------- overlay ----------
const $ = id => document.getElementById(id);
const v3 = new THREE.Vector3();
function place(el, p, on, scale = 1) {
  if (!on) { el.style.opacity = 0; return; }
  v3.set(...p).project(camera);
  el.style.opacity = 1;
  el.style.left = ((v3.x + 1) / 2 * W) + 'px'; el.style.top = ((1 - v3.y) / 2 * H) + 'px';
  el.style.transform = `translate(-50%,-50%) scale(${scale})`;
}

// ---------- tempos ----------
let TL = null;
const S = i => TL.lines.find(l => l.id === i).start, E = i => TL.lines.find(l => l.id === i).end;

function setDay(k) { // 0 noite, 1 dia
  winGlass.color.set(new THREE.Color('#14203f').lerp(new THREE.Color('#bfe3ff'), k));
  moon.visible = k < 0.5; sunDisk.visible = k >= 0.5;
  hemi.intensity = lerp(0.25, 0.9, k); sun.intensity = lerp(0.25, 2.2, k);
  sun.color.set(new THREE.Color('#7f8fd6').lerp(new THREE.Color('#fff1dc'), k));
  winLight.color.set(k < 0.5 ? '#6d83c9' : '#bfe3ff'); winLight.intensity = lerp(2, 6, k);
  scene.background.set(new THREE.Color('#0d1020').lerp(new THREE.Color('#1d2230'), k));
}

window.render = function (t) {
  TL = TL || window.TL;
  const tA = S(2) - 0.25, tB = S(3) - 0.25, tC = S(4) - 0.25, tD = S(5) - 0.25, tE = S(6) - 0.35;
  // reset
  J.position.set(0, 0.86, 0); J.rotation.set(0, 0, 0);
  phone.visible = false; halo.visible = false; phoneLight.intensity = 0; bulb.visible = false; bulbLight.intensity = 0;
  book.visible = false; sparks.forEach(s => s.visible = false); blanket.visible = true; legs.forEach(l => l.visible = true);
  setDay(1);
  let badge = '', fx = {};
  const fBase = { open: blink(t) };

  if (t < tA) { // ---- A: acorda, celular some
    setDay(seg(t, 0.2, 1.6));
    const up = seg(t, 1.4, 2.6);
    J.position.set(-3.2, 0.95 + up * 0.05, lerp(-2.45, -2.75, up));
    J.rotation.set(lerp(-Math.PI / 2, -0.05, up), 0, 0); legs.forEach(l => l.visible = false);
    const reach = seg(t, 2.6, 3.4) * (1 - seg(t, 4.6, 5.4));
    pose({ leg: [Math.PI / 2, Math.PI / 2], armR: [lerp(0.2, 1.2, reach), lerp(0, 0.5, reach), 0.2], armL: [0.15, 0, 0.3], head: [0, -0.5 * reach, 0] });
    J.rotation.y = 0;
    const gone = seg(t, 3.5, 3.9);
    face({ ...fBase, open: t < 1.6 ? 0.08 : fBase.open, mouth: t > 3.7 ? 'o' : (t < 1.6 ? 'flat' : 'smile'), brow: t > 3.7 ? 1 : 0, look: [-0.8 * reach, -0.3 * reach] });
    phone.visible = gone < 1; phone.position.set(-1.6, 0.73 + 0.15 * gone, -3.35); phone.rotation.set(-Math.PI / 2, 0, 0.4 + gone * 6);
    phone.scale.setScalar(1 - gone); phoneLight.position.set(-1.6, 1.0, -3.2); phoneLight.intensity = 3 * (1 - gone);
    screenMat.emissiveIntensity = 1.2;
    const sp = seg(t, 3.6, 4.6);
    if (sp > 0 && sp < 1) sparks.forEach((s, i) => { const a = i / 14 * Math.PI * 2; s.visible = true; s.position.set(-1.6 + Math.cos(a) * sp * 0.8, 0.85 + Math.sin(a) * sp * 0.6 + sp * 0.3, -3.35 + Math.sin(a * 3) * 0.2); s.scale.setScalar(1.6 * (1 - sp)); });
    cam(mix3([0.6, 2.6, 3.2], [-0.6, 2.1, 1.4], sm(t / tA)), [-2.5, 1.55, -2.7]);
    fx.q = t > 3.9; fx.qp = [-2.55, 2.2, -2.75]; fx.qs = back(seg(t, 3.9, 4.3));
    fx.title = t > 0.3 && t < 3.6 ? 1 : 0;
  } else if (t < tB) { // ---- B: dia 1, procura no bolso
    badge = 'DIA 1';
    const u = t - tA;
    J.position.set(0.3, 0.86, -0.5);
    const pat = Math.abs(Math.sin(u * 7.5));
    pose({ armR: [0.3 + 0.15 * pat, -0.3, 1.3 + 0.3 * pat], armL: [0.3 + 0.15 * Math.abs(Math.sin(u * 7.5 + 1.2)), -0.3, 1.3], head: [0.35, 0.1 * Math.sin(u * 2), 0] });
    face({ ...fBase, mouth: 'flat', brow: -0.3, browTilt: 0.2, look: [0, -0.9] });
    cam(mix3([0.3, 2.0, 4.4], [0.3, 1.9, 3.5], sm(u / (tB - tA))), [0.3, 1.55, -0.5]);
    fx.count = Math.min(30, 1 + Math.floor(seg(t, S(2) + 0.5, E(2) - 0.3) * 29)); fx.countOn = t > S(2) + 0.4;
  } else if (t < tC) { // ---- C: dia 3, tédio -> ideia
    badge = 'DIA 3';
    const idea = seg(t, S(3) + 2.8, S(3) + 3.3);
    J.position.set(3.0, 1.15, -2.75); legs.forEach(l => l.visible = false);
    pose({ leg: [Math.PI / 2, Math.PI / 2], lean: lerp(0.35, 0, idea), armR: [lerp(1.0, 1.3, idea), -0.1, lerp(2.3, 0.6, idea)], armL: [lerp(0.9, 1.4, idea), lerp(0.1, 0.9, idea), lerp(1.2, 1.4, idea)], head: [lerp(0.15, -0.15, idea), 0, lerp(0.35, 0, idea)] });
    face({ ...fBase, open: lerp(0.45, 1.1, idea) * (blink(t) < 1 ? 0.1 : 1), mouth: idea > 0.5 ? 'smile' : 'flat', brow: lerp(-0.4, 1, idea), look: [0, lerp(-0.2, 0.6, idea)] });
    bulb.visible = idea > 0; bulb.scale.setScalar(back(seg(t, S(3) + 2.8, S(3) + 3.4)));
    bulb.position.set(3.0, 2.95 + 0.05 * Math.sin(t * 4), -2.6); rays.rotation.z = t * 0.8;
    bulbLight.position.copy(bulb.position); bulbLight.intensity = 6 * idea;
    cam(mix3([1.0, 2.1, 2.0], [1.6, 2.2, 1.0], sm((t - tB) / (tC - tB))), [3.0, 2.15, -2.6]);
    fx.dots = idea < 0.5 && t > S(3) + 1.0; fx.dp = [3.5, 2.9, -2.6];
  } else if (t < tD) { // ---- D: dia 5, dorme cedo, acorda, lê
    badge = 'DIA 5';
    const wake = seg(t, S(4) + 1.6, S(4) + 2.4);
    setDay(seg(t, S(4) + 1.3, S(4) + 2.0));
    J.position.set(-3.2, 0.95 + wake * 0.05, lerp(-2.45, -2.75, wake));
    J.rotation.set(lerp(-Math.PI / 2, -0.05, wake), 0, 0); legs.forEach(l => l.visible = false);
    const read = seg(t, S(4) + 2.6, S(4) + 3.1);
    book.visible = read > 0; book.scale.setScalar(read);
    const done = seg(t, E(4) - 0.9, E(4) - 0.4);
    bL.rotation.y = lerp(0.35, 1.45, done); bR.rotation.y = lerp(-0.35, -1.45, done);
    bL.position.x = 0; flip.rotation.y = -((t * 2.2) % 1) * Math.PI * 0.9 * (1 - done); flip.visible = done < 0.6;
    pose({ leg: [Math.PI / 2, Math.PI / 2], armR: [lerp(0.15, 1.15, read), lerp(0, -0.35, read), lerp(0.2, 0.9, read)], armL: [lerp(0.15, 1.15, read), lerp(0, -0.35, read), lerp(0.2, 0.9, read)], head: [0.25 * read, 0, 0] });
    face({ ...fBase, open: wake < 0.5 ? 0.08 : fBase.open, mouth: wake < 0.5 ? 'flat' : (done > 0.5 ? 'smile' : 'smile'), brow: 0.4 * wake, look: [0, -0.7 * read * (1 - done)] });
    cam(mix3([-0.9, 2.3, 0.9], [-1.4, 2.0, 0.2], sm((t - tC) / (tD - tC))), [-3.2, 1.3, -2.7]);
    fx.z = wake < 0.3; fx.zp = [-2.9, 1.9, -3.3]; fx.zt = t;
    fx.star = done > 0.3 && done < 1 ? 1 : 0;
  } else if (t < tE) { // ---- E: dia 7, o celular volta
    badge = 'DIA 7';
    const u = t - tD;
    J.position.set(-0.2, 0.86, -0.5); J.rotation.y = 0.35;
    const arrive = seg(t, S(5) + 0.2, S(5) + 1.4);
    phone.visible = true; halo.visible = true; phone.scale.setScalar(lerp(0.3, 2.2, back(arrive)));
    phone.position.set(1.5, lerp(4.2, 1.9, arrive) + 0.06 * Math.sin(t * 3), -0.1); phone.rotation.set(0, -0.6 + 0.15 * Math.sin(t * 1.7), 0.12 * Math.sin(t * 2.3));
    halo.scale.setScalar(1 + 0.08 * Math.sin(t * 6)); halo.material.opacity = 0.7 * arrive;
    screenMat.emissiveIntensity = 1.6;
    phoneLight.position.set(1.2, 1.9, 0.3); phoneLight.intensity = 5 * arrive;
    const boss = seg(t, S(5) + 2.4, S(5) + 3.0);
    pose({ armR: [lerp(0.1, 1.0, boss), lerp(0, -0.9, boss), lerp(0.1, 1.9, boss)], armL: [lerp(0.1, 1.0, boss), lerp(0, -0.9, boss), lerp(0.1, 1.9, boss)], head: [lerp(-0.05, -0.15, boss), 0, 0] });
    face({ ...fBase, mouth: boss > 0.5 ? 'smirk' : 'o', brow: boss > 0.5 ? -0.2 : 0.8, browTilt: boss > 0.5 ? -0.25 : 0, look: [0.7, 0.5] });
    setDay(0.75);
    cam(mix3([-0.6, 1.1, 3.6], [-0.2, 1.0, 3.0], sm(u / (tE - tD))), [0.6, 1.85, -0.4]);
  } else { // ---- F: pergunta para quem assiste
    const u = t - tE;
    J.position.set(0.3, 0.86, -0.5);
    const wave = Math.sin(u * 9) * seg(t, tE + 0.2, tE + 0.6) * (1 - seg(t, S(6) + 2.2, S(6) + 2.6));
    const point = seg(t, S(6) + 2.4, S(6) + 2.9);
    pose({ armR: [lerp(0.2, 1.4, point), lerp(0.1, 0.05, point), lerp(0.3, 0.1, point)], armL: [lerp(0.4, 0.4, point), 2.2 - 1.9 * point + 0.25 * wave, 0.6 + 0.3 * wave], head: [0.05, 0, 0.08 * Math.sin(u * 1.5)] });
    face({ ...fBase, mouth: 'smile', brow: 0.5, look: [0, 0] });
    cam(mix3([0.3, 2.2, 3.0], [0.3, 2.15, 2.2], sm(u / 2.5)), [0.3, 2.3, -0.5]);
    fx.sim = seg(t, S(6) + 2.0, S(6) + 2.5);
  }
  renderer.render(scene, camera);

  // ---- overlay ----
  $('badge').style.opacity = badge ? 1 : 0; $('badge').textContent = badge;
  $('title').style.opacity = fx.title || 0;
  place($('q'), fx.qp || [0, 0, 0], fx.q, fx.qs);
  $('count').style.opacity = fx.countOn ? 1 : 0; $('count').textContent = 'x' + (fx.count || 1);
  place($('dots'), fx.dp || [0, 0, 0], fx.dots);
  $('dots').textContent = '.'.repeat(1 + Math.floor((t * 2.5) % 3));
  place($('zzz'), fx.zp || [0, 0, 0], fx.z, 1 + 0.1 * Math.sin((fx.zt || 0) * 4));
  $('sim').style.opacity = fx.sim || 0; $('sim').style.transform = `translateX(-50%) scale(${0.6 + 0.4 * back(fx.sim || 0)})`;
  const line = TL.lines.find(l => t >= l.start - 0.1 && t <= l.end + 0.35);
  $('cap').textContent = line ? line.text : '';
  $('cap').style.opacity = line ? 1 : 0;
};
