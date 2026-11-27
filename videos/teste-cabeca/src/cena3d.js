// SHORT "E se o seu QI dobrasse? — ep. 10: Qual é o verdadeiro?" — série E se? (3D, vertical). Base: ep. 9
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, hemi, sun, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, place, cam, ampAt, thumbLights
} from '../../_lib/mundo3d.js';
import { makeFX } from '../../_lib/fx3d.js';

const jo = makeChar();
const J = jo.root;
const glasses = grp(jo.head);
{ const gl = M('#1b1b1b', { roughness: 0.3 }); for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), gl, glasses, [s * 0.15, 0.06, 0.42]); mesh(cap(0.012, 0.08), gl, glasses, [0, 0.07, 0.44], [0, 0, Math.PI / 2]); }
// porta (parede esquerda)
const DOOR = [-6.0, 0, 1.3];
mesh(rbox(0.12, 2.3, 1.2, 0.02), M('#f6f1e7'), scene, [DOOR[0] + 0.02, 1.15, DOOR[2]]);
mesh(new THREE.PlaneGeometry(1.0, 2.1), new THREE.MeshBasicMaterial({ color: '#2b2d42' }), scene, [DOOR[0] + 0.09, 1.05, DOOR[2]], [0, Math.PI / 2, 0]);
const doorP = grp(scene, [DOOR[0] + 0.1, 0, DOOR[2] - 0.5]); doorP.rotation.y = -1.3;
mesh(rbox(0.06, 2.1, 1.0, 0.02), M('#b5835a'), doorP, [0, 1.05, 0.5]);
// robô
const robot = grp(scene, [1.0, 0, -1.6]);
const steel = M('#9aa5b1', { metalness: 0.5, roughness: 0.35 }), steelD = M('#5c6b7a', { metalness: 0.5, roughness: 0.4 });
const eyeMat = new THREE.MeshStandardMaterial({ color: '#222', emissive: '#ff2d55', emissiveIntensity: 0 });
for (const x of [-0.22, 0.22]) mesh(rbox(0.28, 0.7, 0.3, 0.05), steelD, robot, [x, 0.35, 0]);
const rbody = mesh(rbox(0.85, 0.9, 0.6, 0.1), steel, robot, [0, 1.15, 0]);
const rarms = [-1, 1].map(s => { const g = grp(robot, [s * 0.52, 1.45, 0]); mesh(cap(0.09, 0.5), steelD, g, [s * 0.04, -0.3, 0]); mesh(sph(0.12, 12, 10), steel, g, [s * 0.04, -0.62, 0]); return g; });
const rhead = grp(robot, [0, 1.88, 0]);
mesh(rbox(0.62, 0.48, 0.5, 0.1), steel, rhead);
[-1, 1].forEach(s => mesh(sph(0.07, 16, 12), eyeMat, rhead, [s * 0.14, 0.06, 0.26]));
mesh(cap(0.02, 0.2), steelD, rhead, [0, 0.36, 0]);
const antMat = new THREE.MeshStandardMaterial({ color: '#ff4d6d', emissive: '#ff4d6d', emissiveIntensity: 0 });
mesh(sph(0.05, 12, 10), antMat, rhead, [0, 0.5, 0]);
mesh(rbox(0.3, 0.07, 0.02, 0.02), M('#111'), rhead, [0, -0.11, 0.255]);
const mouthMat = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#ff2d55', emissiveIntensity: 0 });
const rmouth = mesh(new THREE.BoxGeometry(0.26, 0.04, 0.01), mouthMat, rhead, [0, -0.11, 0.268]);
mesh(rbox(0.4, 0.25, 0.04, 0.03), M('#1d3557'), rbody, [0, 0.1, 0.31]);
const leds = [0, 1, 2].map(i => mesh(sph(0.035, 10, 8), new THREE.MeshStandardMaterial({ color: '#111', emissive: ['#52d273', '#ffd60a', '#ff4d6d'][i], emissiveIntensity: 0 }), rbody, [-0.1 + i * 0.1, 0.1, 0.34]));
const eyeLight = new THREE.PointLight('#ff2d55', 0, 4, 2); scene.add(eyeLight);
// botão de pausa (montado na mesa)
const btn = grp(quarto.desk, [0.15, 1.05, 0.15]);
const bParts = [
  { m: mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.14, 32), M('#2b2d42', { metalness: 0.3 }), btn), p: [0, 0.07, 0] },
  { m: mesh(new THREE.SphereGeometry(0.17, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#e63946', emissive: '#e63946', emissiveIntensity: 0.25, roughness: 0.3 }), btn), p: [0, 0.14, 0] },
];
const lc = document.createElement('canvas'); lc.width = 256; lc.height = 96; { const x = lc.getContext('2d'); x.fillStyle = '#ffd60a'; x.fillRect(0, 0, 256, 96); x.fillStyle = '#111'; x.font = '700 64px Anton, Kalam'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PAUSA', 128, 52); }
const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace;
bParts.push({ m: mesh(new THREE.PlaneGeometry(0.34, 0.13), new THREE.MeshBasicMaterial({ map: lt, toneMapped: false }), btn), p: [0, 0.07, 0.265] });
const BSTART = [[-2.5, 1.0, 1.5], [1.5, 2.0, -1.5], [-0.8, 0.2, 2.5]];
// celular na cama
const phone = grp(scene, [-3.2, 1.03, -2.2]); phone.rotation.set(-Math.PI / 2, 0, 0.3);
mesh(rbox(0.22, 0.42, 0.04, 0.03), M('#20232b'), phone);
const pc = document.createElement('canvas'); pc.width = 192; pc.height = 384; const px = pc.getContext('2d');
const ptex = new THREE.CanvasTexture(pc); ptex.colorSpace = THREE.SRGBColorSpace;
const screenMat = new THREE.MeshBasicMaterial({ map: ptex, toneMapped: false });
mesh(new THREE.PlaneGeometry(0.19, 0.37), screenMat, phone, [0, 0, 0.022]);
const phoneLight = new THREE.PointLight('#7fdcff', 0, 3, 2); scene.add(phoneLight);
function drawPhone(on, k) {
  px.fillStyle = on ? '#0b1a2a' : '#050505'; px.fillRect(0, 0, 192, 384);
  if (on) {
    px.fillStyle = '#7fdcff'; px.textAlign = 'center'; px.font = '700 96px Anton, Kalam'; px.fillText('4G', 96, 170);
    for (let i = 0; i < 4; i++) { px.fillStyle = i < Math.floor(k * 5) ? '#52d273' : '#333'; px.fillRect(46 + i * 26, 250 - i * 16, 18, 26 + i * 16); }
    px.fillStyle = '#fff'; px.font = '700 30px Kalam'; px.fillText('conectando' + '.'.repeat(1 + Math.floor(k * 9) % 3), 96, 330);
  }
  ptex.needsUpdate = true;
}
const dizzy = []; for (let i = 0; i < 5; i++) dizzy.push(mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshBasicMaterial({ color: '#ffd54a' }), scene));
const sparks = []; for (let i = 0; i < 14; i++) sparks.push(mesh(sph(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffd54a' : '#ff4d6d' }), scene));

// ---------- legendas ----------
let TL = null, caps = null;
function buildCaps() {
  caps = [];
  for (const l of TL.lines) {
    const ps = l.text.match(/[^.?!:]+[.?!:]+|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean);
    const merged = [];
    for (const p of ps) { if (merged.length && (merged[merged.length - 1].length + p.length < 30)) merged[merged.length - 1] += ' ' + p; else merged.push(p); }
    const tot = merged.reduce((a, s) => a + s.length, 0);
    let t0 = l.start;
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: l.who === "R" }); t0 += d; }
  }
}
const $ = id => document.getElementById(id);
const v = new THREE.Vector3();
const facing = (a, b) => Math.atan2(b[0] - a[0], b[2] - a[2]);
const WORDS = ['HELLO', 'BONJOUR', 'HOLA', 'CIAO', 'HALLO', 'OLÁ', 'ПРИВЕТ', 'E = mc²', '42', 'π', 'NAMASTE', 'SALVE'];
const wl = $('words'); const wEls = WORDS.map(w => { const d = document.createElement('div'); d.className = 'w'; d.textContent = w; wl.appendChild(d); return d; });

// ===== ep. 6: janela (bairro), rua com casas, cruzamento, semáforo =====
const wc = document.createElement('canvas'); wc.width = 1024; wc.height = 716; const wx = wc.getContext('2d');
const wtex = new THREE.CanvasTexture(wc); wtex.colorSpace = THREE.SRGBColorSpace;
const HOUSES2D = [[40, 300, 150, '#5e548e'], [210, 260, 140, '#355070'], [370, 320, 170, '#6d597a'], [560, 280, 150, '#2d6a4f'], [730, 250, 130, '#3d405b'], [880, 310, 130, '#6b4226']];
function drawStreet(t, robotX) {
  const g = wx.createLinearGradient(0, 0, 0, 716); g.addColorStop(0, '#1b1440'); g.addColorStop(0.6, '#ff8c61'); g.addColorStop(1, '#2b2140');
  wx.fillStyle = g; wx.fillRect(0, 0, 1024, 716);
  HOUSES2D.forEach(([x, h, w, c], i) => {
    wx.fillStyle = c; wx.fillRect(x, 620 - h, w, h); wx.beginPath(); wx.moveTo(x - 10, 620 - h); wx.lineTo(x + w / 2, 560 - h); wx.lineTo(x + w + 10, 620 - h); wx.fill();
    for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { wx.fillStyle = Math.sin(t * 9 + i * 1.7 + r * 2.1 + k) > 0 ? ['#7fdcff', '#ff4d6d', '#52d273', '#ffd60a'][(r + k + i) % 4] : '#1d1d2b'; wx.fillRect(x + 18 + k * (w / 2 - 6), 640 - h + r * (h / 3.4), w / 2 - 36, h / 6); }
  });
  wx.fillStyle = '#2b2b33'; wx.fillRect(0, 620, 1024, 96);
  wx.fillStyle = '#111'; wx.fillRect(robotX - 26, 545, 52, 75); wx.fillRect(robotX - 20, 510, 40, 34); wx.fillStyle = '#ff2d55'; wx.beginPath(); wx.arc(robotX - 8, 526, 5, 0, 7); wx.arc(robotX + 8, 526, 5, 0, 7); wx.fill();
  wtex.needsUpdate = true;
}
// rua 3D
const street = grp(scene);
const roomObjs = scene.children.filter(o => (o.isMesh || o.isGroup) && o !== J && o !== robot && o !== street && !sparks.includes(o) && !dizzy.includes(o));
mesh(new THREE.PlaneGeometry(40, 40), M('#2b2b33', { roughness: 0.9 }), street, [0, 0.005, 0], [-Math.PI / 2, 0, 0]);
for (const z of [-4.6, 4.6]) mesh(rbox(40, 0.18, 1.6, 0.04), M('#8d99ae'), street, [0, 0.09, z]);
for (let i = -4; i <= 4; i++) mesh(new THREE.BoxGeometry(0.5, 0.01, 2.6), M('#f1f1f1'), street, [i * 0.8, 0.02, 1.6]);
for (let x = -18; x < 18; x += 2.4) mesh(new THREE.BoxGeometry(1.2, 0.01, 0.14), M('#ffd60a'), street, [x, 0.02, -1.2]);
const winMats = [];
[[-7.6, 3.2, '#5e548e'], [-5.0, 2.6, '#355070'], [-2.4, 3.6, '#6d597a'], [0.2, 2.8, '#2d6a4f'], [2.8, 3.4, '#3d405b'], [5.4, 2.6, '#6b4226'], [8.0, 3.0, '#9d4edd']].forEach(([x, h, c], i) => {
  const hz = grp(street, [x, 0, -7.2]);
  mesh(rbox(2.3, h, 2.2, 0.06), M(c, { roughness: 0.8 }), hz, [0, h / 2, 0]);
  mesh(new THREE.ConeGeometry(1.75, 1.1, 4), M('#3a2e39'), hz, [0, h + 0.55, 0], [0, Math.PI / 4, 0]);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) { const m = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#ffd27a', emissiveIntensity: 1 }); winMats.push({ m, i, r, k }); mesh(new THREE.PlaneGeometry(0.55, 0.55), m, hz, [-0.5 + k * 1.0, 0.9 + r * (h - 1.4) / 1.4, 1.11]); }
  mesh(new THREE.PlaneGeometry(0.6, 1.0), M('#2b2d42'), hz, [0, 0.5, 1.11]);
});
const tl = grp(street, [2.6, 0, -2.9]);
mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 12), M('#1b1b1b'), tl, [0, 1.6, 0]);
mesh(rbox(0.45, 1.2, 0.35, 0.05), M('#1b1b1b'), tl, [0, 3.1, 0.1]);
const tlMats = ['#ff2d55', '#ffd60a', '#52d273'].map((c, i) => { const m = new THREE.MeshStandardMaterial({ color: '#222', emissive: c, emissiveIntensity: 0 }); mesh(sph(0.13, 16, 12), m, tl, [0, 3.5 - i * 0.38, 0.29]); return m; });
for (const x of [-4.6, 5.6]) { const lp = grp(street, [x, 0, -4.4]); mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 10), M('#30343f'), lp, [0, 1.8, 0]); mesh(sph(0.2, 14, 10), new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffd27a', emissiveIntensity: 2 }), lp, [0, 3.65, 0]); const pl = new THREE.PointLight('#ffd27a', 5, 8, 1.4); pl.position.set(0, 3.5, 0); lp.add(pl); }
const cable = mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 8), new THREE.MeshStandardMaterial({ color: '#111', emissive: '#7fdcff', emissiveIntensity: 1.2 }), street);
const streetLight = new THREE.PointLight('#7fdcff', 0, 10, 1.4); street.add(streetLight);
const UPV = new THREE.Vector3(0, 1, 0), va = new THREE.Vector3(), vb = new THREE.Vector3();
function setStreet(on, t) {
  street.visible = on; roomObjs.forEach(o => o.visible = !on);
  if (!on) return;
  setDay(0.3); scene.background.set('#2b2140');
  winMats.forEach(({ m, i, r, k }) => { const lit = Math.sin(t * 7 + i * 1.7 + r * 2.1 + k) > -0.1; m.emissive.set(['#7fdcff', '#ff4d6d', '#52d273', '#ffd60a', '#ffd27a'][(Math.floor(t * 4) + i + r + k) % 5]); m.emissiveIntensity = lit ? 1.6 : 0.05; });
  tlMats.forEach((m, i) => m.emissiveIntensity = Math.floor(t * 8 + i) % 3 === 0 ? 3 : 0.1);
  streetLight.position.set(1.3, 2.5, -2.0); streetLight.color.set(['#7fdcff', '#ff4d6d', '#52d273'][Math.floor(t * 5) % 3]); streetLight.intensity = 6;
}
// ===== ep. 9: Poder Mental — telecinese, voo, luta no ar, apagão, choque de raios, o falso Joseph =====
const drops = [];
const ADD = (c, o = 0) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false });
const ns = m => { m.castShadow = false; m.receiveShadow = false; return m; };
const UP2 = new THREE.Vector3(0, 1, 0), e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), tgt = new THREE.Vector3(), q1 = new THREE.Vector3();
const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const V3 = a => new THREE.Vector3(a[0], a[1], a[2]);
const A3 = p => [p.x, p.y, p.z];

// ---- céu (cúpula com degradê) e lua ----
const skyC = document.createElement('canvas'); skyC.width = 8; skyC.height = 512; { const x = skyC.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#05041a'); g.addColorStop(0.3, '#1d1445'); g.addColorStop(0.44, '#6b2f63'); g.addColorStop(0.5, '#ff8c61'); g.addColorStop(0.55, '#3a2540'); g.addColorStop(1, '#141020'); x.fillStyle = g; x.fillRect(0, 0, 8, 512); }
const skyT = new THREE.CanvasTexture(skyC); skyT.colorSpace = THREE.SRGBColorSpace;
const skyMat = new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, depthWrite: false, toneMapped: false });
const sky = ns(mesh(sph(45, 32, 16), skyMat, scene)); sky.renderOrder = -1;
const moonM = ns(mesh(sph(2.2, 24, 16), new THREE.MeshBasicMaterial({ color: '#fff3d6', toneMapped: false }), sky, [-14, 20, -36]));
const stars = []; for (let i = 0; i < 60; i++) { const a = hash(i) * Math.PI * 2, b = 0.25 + hash(i + 50) * 1.1; stars.push(ns(mesh(sph(0.09, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), sky, [Math.cos(a) * Math.cos(b) * 43, Math.sin(b) * 43, Math.sin(a) * Math.cos(b) * 43]))); }

// ---- carro (duas metades, cortado ao longo do comprimento) ----
const car = grp(scene); const carHalves = [];
const carPaint = M('#d62828', { metalness: 0.35, roughness: 0.35 }), glassM = M('#9ad1ff', { metalness: 0.2, roughness: 0.1 }), tireM = M('#151515');
for (const s of [-1, 1]) {
  const h = grp(car); carHalves.push(h);
  mesh(rbox(2.2, 0.5, 0.52, 0.08), carPaint, h, [0, 0.47, s * 0.26]);
  mesh(rbox(1.2, 0.42, 0.48, 0.08), glassM, h, [-0.1, 0.88, s * 0.24]);
  for (const x of [-0.7, 0.7]) mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 18), tireM, h, [x, 0.22, s * 0.47], [Math.PI / 2, 0, 0]);
  mesh(sph(0.07, 10, 8), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#fff6c4', emissiveIntensity: 2 }), h, [1.1, 0.52, s * 0.33]);
  ns(mesh(new THREE.PlaneGeometry(2.15, 0.85), ADD('#ff7a3d', 0), h, [0, 0.62, s * 0.005], [0, 0, 0]));
}
const cutGlow = carHalves.map(h => h.children[h.children.length - 1]);
// ---- poste extra (o que ele arranca) ----
const pole = grp(scene);
mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.6, 12), M('#30343f'), pole, [0, 1.8, 0]);
mesh(rbox(0.7, 0.12, 0.25, 0.04), M('#30343f'), pole, [0.3, 3.55, 0]);
mesh(sph(0.16, 14, 10), new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffd27a', emissiveIntensity: 2 }), pole, [0.55, 3.45, 0]);
// faixas de pedestre (as da rua, lado esquerdo)
const zebra = street.children.filter(m => m.isMesh && m.geometry.parameters && m.geometry.parameters.width === 0.5 && m.geometry.parameters.depth === 2.6 && m.position.x < -0.1);
const zebra0 = zebra.map(m => m.position.clone());
// luzes da rua (para o apagão)
const lampMats = [], lampLights = [];
street.traverse(o => { if (o.isMesh && o.material.emissive && o.material.emissiveIntensity === 2) lampMats.push(o.material); if (o.isPointLight && o !== streetLight) lampLights.push(o); });

// ---- pedras, anéis de impacto, fumaça, bolas de fogo, raios elétricos ----
const rockM = M('#6b6570', { roughness: 0.95 });
const rocks = []; for (let i = 0; i < 28; i++) rocks.push(mesh(new THREE.DodecahedronGeometry(0.07 + 0.11 * hash(i * 7)), rockM, scene));
const rings = []; for (let i = 0; i < 6; i++) rings.push(ns(mesh(new THREE.TorusGeometry(1, 0.05, 8, 56), ADD('#ffffff'), scene)));
function ringAt(i, p, age, R = 3, rot = [Math.PI / 2, 0, 0], dur = 0.6, col = '#ffffff') {
  const r = rings[i], k = age / dur; if (age < 0 || k > 1) { r.visible = false; return; }
  r.visible = true; r.position.set(...p); r.rotation.set(...rot); const s = 0.15 + R * Math.sqrt(k); r.scale.set(s, s, s); r.material.opacity = Math.pow(1 - k, 1.4); r.material.color.set(col);
}
const smokeM = () => new THREE.MeshStandardMaterial({ color: '#5d5a63', transparent: true, opacity: 0, roughness: 1, depthWrite: false });
const smoke = []; for (let i = 0; i < 34; i++) smoke.push(ns(mesh(sph(0.5, 12, 10), smokeM(), scene)));
const fireballs = []; for (let i = 0; i < 4; i++) fireballs.push({ o: ns(mesh(sph(1, 24, 16), ADD('#ff7a1a'), scene)), c: ns(mesh(sph(1, 20, 14), ADD('#fff1b0'), scene)) });
function fireAt(i, p, k, R = 1.6) { const f = fireballs[i]; const on = k > 0 && k < 1; f.o.visible = f.c.visible = on; if (!on) return; f.o.position.set(...p); f.c.position.set(...p); const s = R * (0.3 + 0.7 * Math.sqrt(k)); f.o.scale.setScalar(s); f.c.scale.setScalar(s * 0.6); f.o.material.opacity = 0.85 * (1 - k); f.c.material.opacity = 0.9 * Math.pow(1 - k, 2); }
const fireLight = new THREE.PointLight('#ff7a1a', 0, 14, 1.3); scene.add(fireLight);
const arcSegs = []; for (let i = 0; i < 10; i++) { const s = []; for (let j = 0; j < 6; j++) s.push(ns(mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 5), ADD('#ffffff'), scene))); arcSegs.push(s); }
function setArc(i, a, b, seed, op, col) {
  const segs = arcSegs[i]; let prev = a.clone(); const amp = a.distanceTo(b) * 0.14;
  for (let j = 0; j < 6; j++) {
    const p = a.clone().lerp(b, (j + 1) / 6);
    if (j < 5) { p.x += (hash(seed + j * 3.1) - 0.5) * amp * 2; p.y += (hash(seed + j * 5.7) - 0.5) * amp * 2; p.z += (hash(seed + j * 9.3) - 0.5) * amp * 2; }
    const s = segs[j], d = p.clone().sub(prev), L = d.length();
    s.visible = op > 0.01; s.position.copy(prev).addScaledVector(d, 0.5); s.quaternion.setFromUnitVectors(UP2, d.normalize()); s.scale.set(1, L, 1); s.material.opacity = op; s.material.color.set(col); prev = p;
  }
}
const hideArcs = () => arcSegs.forEach(s => s.forEach(m => m.visible = false));
// ---- raios pequenos (olhos) e raios grandes (choque) ----
const eyeBeams = [0, 1].map(() => ({ core: ns(mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 10), ADD('#ffe0e6', 1), scene)), glow: ns(mesh(new THREE.CylinderGeometry(0.13, 0.13, 1, 12), ADD('#ff2d55', 0.4), scene)) }));
function setEyeBeam(b, a, c, op) { const d = c.clone().sub(a), L = d.length(); [b.core, b.glow].forEach((m, i) => { m.visible = op > 0.01; m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP2, d.clone().normalize()); m.scale.set(1, L, 1); m.material.opacity = op * (i ? 0.45 : 1); }); }
const bigBeam = (c1, c2) => ({ core: ns(mesh(new THREE.CylinderGeometry(0.16, 0.16, 1, 16), ADD(c1, 1), scene)), glow: ns(mesh(new THREE.CylinderGeometry(0.42, 0.42, 1, 20), ADD(c2, 0.5), scene)), outer: ns(mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 20), ADD(c2, 0.2), scene)) });
const gBeam = bigBeam('#fffbe0', '#ffc300'), rBeam = bigBeam('#fff0f3', '#ff2d55');
function setBig(b, a, c, op, w, t) { const d = c.clone().sub(a), L = d.length(); [b.core, b.glow, b.outer].forEach((m, i) => { m.visible = op > 0.01 && L > 0.02; m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP2, d.clone().normalize()); const f = w * (1 + 0.1 * Math.sin(t * 60 + i * 2)); m.scale.set(f, L, f); m.material.opacity = op * [1, 0.5, 0.2][i]; }); }
const hideBig = b => [b.core, b.glow, b.outer].forEach(m => m.visible = false);
const ball = [ns(mesh(sph(1, 28, 18), ADD('#ffffff'), scene)), ns(mesh(sph(1, 28, 18), ADD('#ffc300'), scene)), ns(mesh(sph(1, 28, 18), ADD('#ff2d55'), scene))];
const thumbKey2 = new THREE.PointLight('#fff1e0', 0, 8, 1.2); scene.add(thumbKey2);
const clashLight = new THREE.PointLight('#fff1d0', 0, 20, 1.2); scene.add(clashLight);
// orbes de carga
const jOrb = [ns(mesh(sph(1, 24, 16), ADD('#fffbe0'), scene)), ns(mesh(sph(1, 24, 16), ADD('#ffc300'), scene))];
const rOrb = [ns(mesh(sph(1, 24, 16), ADD('#fff0f3'), scene)), ns(mesh(sph(1, 24, 16), ADD('#ff2d55'), scene))];
function orbAt(o, p, r, op) { o.forEach((m, i) => { m.visible = op > 0.01; m.position.copy(p); m.scale.setScalar(r * (i ? 1.0 : 0.55)); m.material.opacity = op * (i ? 0.5 : 0.95); }); }
// ---- auras ----
const auraMat = ADD('#ffd60a'); auraMat.side = THREE.DoubleSide;
const aura = ns(mesh(sph(1, 32, 20), auraMat, scene)), auraIn = ns(mesh(sph(1, 32, 20), ADD('#fff3b0'), scene));
const motes = []; for (let i = 0; i < 20; i++) motes.push(ns(mesh(sph(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe066', toneMapped: false }), scene)));
const auraLight = new THREE.PointLight('#ffd60a', 0, 9, 1.4); scene.add(auraLight);
const rauraMat = ADD('#ff2d55'); rauraMat.side = THREE.DoubleSide;
const raura = ns(mesh(sph(1, 32, 20), rauraMat, scene)), rauraIn = ns(mesh(sph(1, 32, 20), ADD('#ff8fa3'), scene));
const rmotes = []; for (let i = 0; i < 20; i++) rmotes.push(ns(mesh(sph(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: '#ff4d6d', toneMapped: false }), scene)));
const rLight = new THREE.PointLight('#ff2d55', 0, 14, 1.3); scene.add(rLight);
const ghost = ns(mesh(sph(1, 24, 16), ADD('#ffd60a'), scene));
const eyeGlow = [-1, 1].map(s => ns(mesh(sph(0.11, 12, 10), ADD('#ffe066'), jo.head, [s * 0.15, 0.06, 0.42])));
// propulsores do robô
const thr = [-1, 1].map(s => { const g = grp(robot, [s * 0.22, -0.05, 0]); const a = ns(mesh(new THREE.ConeGeometry(0.16, 0.9, 14), ADD('#ff6b3d', 0.9), g, [0, -0.45, 0], [Math.PI, 0, 0])); const b = ns(mesh(new THREE.ConeGeometry(0.08, 0.5, 10), ADD('#fff1b0', 1), g, [0, -0.25, 0], [Math.PI, 0, 0])); return g; });
// partículas de energia do apagão
const streamP = []; for (let i = 0; i < 49; i++) streamP.push(ns(mesh(sph(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: i % 3 ? '#ff4d6d' : '#ffd27a', toneMapped: false }), scene)));
const HOUSEX = [-7.6, -5.0, -2.4, 0.2, 2.8, 5.4, 8.0];
// ---- cratera ----
const RC = [1.2, 0, -0.8];
const crater = grp(scene, RC);
mesh(new THREE.CircleGeometry(2.3, 40), new THREE.MeshStandardMaterial({ color: '#141318', roughness: 1 }), crater, [0, 0.015, 0], [-Math.PI / 2, 0, 0]);
for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; mesh(new THREE.DodecahedronGeometry(0.2 + 0.12 * (i % 3)), rockM, crater, [Math.cos(a) * 2.3, 0.08, Math.sin(a) * 2.3]); }
const crack = ns(mesh(new THREE.RingGeometry(0.6, 2.1, 40), ADD('#ff2d55', 0), crater, [0, 0.03, 0], [-Math.PI / 2, 0, 0]));
// ---- o falso Joseph ----
const jo2 = makeChar(); const J2b = jo2.root;
{ const gl = M('#1b1b1b', { roughness: 0.3 }); const g2 = grp(jo2.head); for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), gl, g2, [s * 0.15, 0.06, 0.42]); mesh(cap(0.012, 0.08), gl, g2, [0, 0.07, 0.44], [0, 0, Math.PI / 2]); }
const glint = ns(mesh(sph(0.045, 10, 8), ADD('#ff2d55'), jo2.head, [0.15, 0.06, 0.45]));
const trail = ns(mesh(sph(1, 16, 12), ADD('#ff2d55'), scene));
// ---- a casa do Joseph e a mãe ----
const home = grp(scene, [0, 0, 14]);
mesh(rbox(12, 5, 0.4, 0.05), M('#b98b6a', { roughness: 0.9 }), home, [0, 2.5, 0.2]);
mesh(rbox(12.8, 0.4, 1.6, 0.05), M('#5a3d34'), home, [0, 5.0, -0.4]);
mesh(new THREE.PlaneGeometry(1.3, 2.5), new THREE.MeshBasicMaterial({ color: '#160f0c' }), home, [0, 1.25, -0.01], [0, Math.PI, 0]);
mesh(rbox(1.6, 0.15, 0.15, 0.03), M('#4a3226'), home, [0, 2.55, -0.05]);
const doorL = grp(home, [-0.65, 0, -0.04]); mesh(rbox(1.3, 2.5, 0.08, 0.03), M('#7a4b2e'), doorL, [0.65, 1.25, 0]); mesh(sph(0.05, 10, 8), M('#e9c46a', { metalness: 0.6 }), doorL, [1.15, 1.2, -0.07]);
for (const x of [-3.4, 3.4]) { mesh(rbox(1.6, 1.3, 0.1, 0.03), M('#4a3226'), home, [x, 2.4, -0.02]); mesh(new THREE.PlaneGeometry(1.4, 1.1), new THREE.MeshStandardMaterial({ color: '#0e1420', roughness: 0.2, metalness: 0.3 }), home, [x, 2.4, -0.08], [0, Math.PI, 0]); }
mesh(rbox(3.2, 0.22, 1.4, 0.04), M('#8d99ae'), home, [0, 0.11, -0.7]);
for (const x of [-1.9, 1.9]) mesh(sph(0.55, 16, 12), M('#2d6a4f', { roughness: 1 }), home, [x, 0.45, -0.6], [0, 0, 0], [1.2, 0.9, 1]);
mesh(new THREE.PlaneGeometry(16, 8.4), M('#253b22', { roughness: 1 }), scene, [0, 0.01, 9.8], [-Math.PI / 2, 0, 0]);
mesh(new THREE.PlaneGeometry(1.4, 8.0), M('#7d7f8c', { roughness: 1 }), scene, [0, 0.015, 9.9], [-Math.PI / 2, 0, 0]);
const mom = makeChar({ hood: '#b5446e', hood2: '#9c3a5e', pants: '#3d3d5c', sole: '#b5446e' });
mesh(sph(0.22, 16, 12), mom.mats.hair, mom.head, [0, 0.32, -0.33]);
mesh(sph(0.44, 24, 16), mom.mats.hair, mom.head, [0, -0.06, -0.12], [0, 0, 0], [1.06, 1.12, 0.9]);
for (const s of [-1, 1]) mesh(cap(0.12, 0.5), mom.mats.hair, mom.head, [s * 0.36, -0.35, -0.1]);
const lantern = ns(mesh(sph(0.13, 14, 10), new THREE.MeshBasicMaterial({ color: '#ffd27a', toneMapped: false }), mom.handR, [0, -0.2, 0.05]));
const lanternLight = new THREE.PointLight('#ffb35c', 0, 14, 1.2); scene.add(lanternLight);
const homeFill = new THREE.PointLight('#8fa3ff', 0, 20, 1.0); scene.add(homeFill);

// ---- posições ----
const JP0 = [-3.0, 1.25, 0.6], RP0 = [1.8, 0, -0.8], RW = [0.9, 0, -0.5];
const CH = [-1.4, 2.7, 2.2], HIT = [1.6, 2.1, -0.6], END = [5.4, 0.3, -3.0];
const PDIR = V3(END).sub(V3(CH)).setY(0).normalize(), PPERP = new THREE.Vector3(-PDIR.z, 0, PDIR.x);
const MA = [0, 9, 0], AX = new THREE.Vector3(1, 0, -0.25).normalize(), PA = new THREE.Vector3(-AX.z, 0, AX.x);
const jAt = (d, dy = 0) => [MA[0] - AX.x * d, 8.7 + dy, MA[2] - AX.z * d];
const rAt = (d, dy = 0) => [MA[0] + AX.x * d, 7.25 + dy, MA[2] + AX.z * d];
const sideA = (dist, h = 0, along = 0) => [MA[0] + PA.x * dist + AX.x * along, MA[1] + h, MA[2] + PA.z * dist + AX.z * along];
const JH = [-6.4, 4.3, 2.2], JK = [-3.6, 0.45, 1.4], RS = [0.4, 0, -0.4];
const FJp = [-1.3, 0.86, 5.9], RJp = [1.3, 0.86, 5.9], MOM = [0, 0.86, 13.35];
const crash = 41.0;

function auraJ(k, t, big = 1) {
  if (k <= 0.01) return; scene.updateMatrixWorld(true); J.getWorldPosition(v);
  aura.visible = auraIn.visible = true; aura.position.set(v.x, v.y + 0.95, v.z); auraIn.position.copy(aura.position);
  const fl = 1 + 0.05 * Math.sin(t * 17) + 0.04 * Math.sin(t * 29);
  aura.scale.set(1.4 * k * big * fl, 2.35 * k * big * fl, 1.4 * k * big * fl); auraIn.scale.set(1.08 * k * big, 1.95 * k * big, 1.08 * k * big);
  auraMat.opacity = 0.3 * Math.min(1, k); auraIn.material.opacity = 0.14 * Math.min(1, k);
  motes.forEach((m, i) => { const ph = ((t * 0.9 + i / 20) % 1); m.visible = true; m.position.set(v.x + Math.cos(i * 2.3 + t * 1.5) * 1.2 * big, v.y - 0.7 + ph * 3.6 * big, v.z + Math.sin(i * 2.3 + t * 1.5) * 1.2 * big); m.scale.setScalar(1.6 * (1 - ph)); });
  auraLight.position.set(v.x, v.y + 1.2, v.z + 0.8); auraLight.intensity = 9 * Math.min(1, k);
}
function auraR(k, t) {
  if (k <= 0.01) return; const s = robot.scale.x; robot.getWorldPosition(v);
  raura.visible = rauraIn.visible = true; raura.position.set(v.x, v.y + 1.3 * s, v.z); rauraIn.position.copy(raura.position);
  const fl = 1 + 0.05 * Math.sin(t * 19) + 0.04 * Math.sin(t * 31);
  raura.scale.set(0.95 * s * k * fl, 1.7 * s * k * fl, 0.95 * s * k * fl); rauraIn.scale.set(0.75 * s * k, 1.45 * s * k, 0.75 * s * k);
  rauraMat.opacity = 0.28 * Math.min(1, k); rauraIn.material.opacity = 0.12 * Math.min(1, k);
  rmotes.forEach((m, i) => { const ph = ((t * 0.8 + i / 20) % 1); m.visible = true; m.position.set(v.x + Math.cos(i * 2.1 + t) * 0.85 * s, v.y + ph * 2.8 * s, v.z + Math.sin(i * 2.1 + t) * 0.85 * s); m.scale.setScalar(s * 0.9 * (1 - ph)); });
  rLight.position.set(v.x, v.y + 1.5 * s, v.z + 1.2); rLight.intensity = 10 * Math.min(1, k);
}
const handsJ = () => { scene.updateMatrixWorld(true); jo.handR.getWorldPosition(e1); jo.handL.getWorldPosition(e2); return e1.clone().add(e2).multiplyScalar(0.5); };
const handsR = () => { scene.updateMatrixWorld(true); rarms[0].children[1].getWorldPosition(e1); rarms[1].children[1].getWorldPosition(e2); return e1.clone().add(e2).multiplyScalar(0.5); };
const headJ = () => { scene.updateMatrixWorld(true); jo.head.getWorldPosition(q1); return q1.clone(); };
const headR = () => { scene.updateMatrixWorld(true); rhead.getWorldPosition(q1); return q1.clone(); };
function rocksAround(c, R, t, k, h = 2.2, seed = 0, n = 28) { rocks.forEach((r, i) => { if (i >= n || k <= 0) { return; } const a = hash(i + seed) * 6.283 + t * (0.3 + 0.4 * hash(i + 9)); const rr = R * (0.4 + 0.6 * hash(i + 3)); r.visible = true; r.position.set(c[0] + Math.cos(a) * rr, c[1] + k * h * hash(i + 5) + 0.1 * Math.sin(t * 2 + i), c[2] + Math.sin(a) * rr); r.rotation.set(t * (1 + hash(i)), t * 0.7, i); }); }
function puff(i, p, k, R = 1.2, col) { const s = smoke[i]; if (k <= 0 || k >= 1) { s.visible = false; return; } s.visible = true; s.position.set(...p); s.scale.setScalar(R * (0.4 + 0.8 * Math.sqrt(k))); s.material.opacity = 0.6 * (1 - k); if (col) s.material.color.set(col); }

// ===== TESTE DE CABEÇA: 3 versões do Joseph no corpo do Mixamo =====
import { makeFighter, clipOf, ROUPA_JOSEPH } from '../../_lib/mixamo.js';
import aIdle from '../../_lib/mixamo/Bouncing_Fight_Idle.fbx';
const fx = makeFX(renderer, scene, camera, W, H);
const CI = clipOf(aIdle);
// deixa a cabeça do makeChar mais bonita: queixo, olhos menores, cabelo com volume, sobrancelha mais grossa
function refine(c, o = {}) {
  const h = c.head, skin = c.mats.skin, hair = c.mats.hair;
  const skull = h.children[0]; skull.scale.set(0.93, 1.03, 0.97);
  const jaw = mesh(sph(0.3, 28, 18), skin, h, [0, -0.2, 0.07], [0, 0, 0], [1.08, 0.78, 0.95]);
  c.eyes.forEach((e, i) => { e.scale.multiplyScalar(o.eye ?? 0.82); e.position.y = 0.05; e.position.x = (i ? 1 : -1) * 0.145; });
  c.pupils.forEach(p => p.material = M('#3b2314', { roughness: 0.2 }));
  c.brows.forEach(b => { b.scale.set(1.25, 1.5, 1); });
  h.children.forEach(m => { if (m.isMesh && m.geometry.parameters && m.geometry.parameters.radius === 0.06) { m.scale.set(0.95, 1.25, 1.2); m.position.set(0, -0.05, 0.4); } });
  // cabelo cacheado: muitos cachinhos sobre a calota, lados mais baixos (degradê)
  const curlM = M('#1c140f', { roughness: 0.95 }), curlM2 = M('#2a1d15', { roughness: 0.9 });
  for (let i = 0; i < 190; i++) {
    const u = hash(i * 1.7), w = hash(i * 3.3 + 1); const th = u * Math.PI * 2, ph = Math.acos(1 - w * 1.05);
    let x = Math.sin(ph) * Math.cos(th), y = Math.cos(ph), z = Math.sin(ph) * Math.sin(th);
    if (z > 0.55 && y < 0.62) continue; if (y < 0.12) continue; if (Math.abs(x) > 0.82) continue;               // não cobre a testa
    const side = Math.abs(x) > 0.75 && y < 0.45; const R = side ? 0.42 : 0.44 + 0.04 * hash(i * 9.1);
    mesh(sph(side ? 0.045 : 0.065 + 0.018 * hash(i * 5.5), 8, 6), i % 3 ? curlM : curlM2, h, [x * R, y * R + 0.04, z * R - 0.02]);
  }
  [c.mSmile, c.mO, c.mFlat, c.mSad].forEach(m => { m.position.y += 0.06; m.position.z += 0.02; m.scale.multiplyScalar(0.85); });
}
const fighters = [];
const mk = (variant, x) => {
  const c = makeChar(); c.root.visible = false;
  const gl = M('#1b1b1b', { roughness: 0.3 }); const g = grp(c.head); for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), gl, g, [s * 0.15, 0.06, 0.42]); mesh(cap(0.012, 0.08), gl, g, [0, 0.07, 0.44], [0, 0, Math.PI / 2]);
  if (variant > 0) { refine(c); g.position.set(0, 0.0, -0.01); g.scale.set(0.95, 0.95, 1); }
  const F = makeFighter(scene, aIdle, { scale: 0.0135, paint: variant > 0 ? ROUPA_JOSEPH : null, body: '#4f5d40', joints: '#2b3140' });
  if (variant > 0) {
    const hood = new THREE.Group(); const hm = M('#45523a', { roughness: 0.85 });
    mesh(new THREE.TorusGeometry(0.17, 0.075, 12, 24, Math.PI * 1.3), hm, hood, [0, 0, 0], [Math.PI / 2 - 0.3, 0, Math.PI * 0.85]);
    mesh(sph(0.16, 16, 12), hm, hood, [0, 0.02, -0.12], [0, 0, 0], [1.1, 0.8, 0.7]);
    F.attach('Spine2', hood, [0, 18, -7]);
    const front = new THREE.Group(); mesh(rbox(0.34, 0.13, 0.03, 0.02), M('#45523a', { roughness: 0.85 }), front, [0, 0, 0]);
    F.attach('Spine', front, [0, 4, 12]);
    const cords = new THREE.Group(); for (const x of [-0.05, 0.05]) { mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6), M('#ecebe4'), cords, [x, -0.08, 0]); mesh(sph(0.015, 8, 6), M('#ecebe4'), cords, [x, -0.16, 0]); }
    F.attach('Spine2', cords, [0, 14, 12]);
  }
  F.attachHead(c.head, [0, 9, 3]); F.root.position.set(x, 0, 0);
  fighters.push({ F, c, s: [1.25, 0.72, 0.85][variant], ry: fighters.length ? -0.7 : 0.15 });
};
mk(2, -0.9); mk(2, 0.9);
window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  setStreet(true, 0); cable.visible = false; winMats.forEach(({ m }) => m.emissiveIntensity = 0.02); lampMats.forEach(m => m.emissiveIntensity = 0); lampLights.forEach(l => l.intensity = 0);
  J.visible = false; robot.visible = false; jo.head.visible = false; rhead.visible = false; J2b.visible = false; mom.root.visible = false; car.visible = false; pole.visible = false; crater.visible = false;
  [...sparks, ...rocks, ...smoke, ...motes, ...rmotes, ...streamP, ...ball, ...jOrb, ...rOrb, ghost, trail, aura, auraIn, raura, rauraIn, ...dizzy].forEach(o => o.visible = false); hideBig(gBeam); hideBig(rBeam); hideArcs(); fireballs.forEach(f => { f.o.visible = f.c.visible = false; }); rings.forEach(r => r.visible = false); eyeBeams.forEach(b => { b.core.visible = b.glow.visible = false; });
  thumbKey2.position.set(0, 3, 4); thumbKey2.intensity = 8;
  fighters.forEach(({ F, c, s, ry }) => { c.head.scale.setScalar(s); c.mats.skin.emissiveIntensity = 0; F.root.rotation.y = ry; F.pose(CI, 0.6); F.syncHeads(); c.face({ open: 1, mouth: 'smile', brow: 0.2, look: [0, 0] }); });
  camera.fov = 40; camera.aspect = W / H; camera.updateProjectionMatrix(); cam([0, 1.7, 6.0], [0, 1.55, 0], 0, 0); sky.position.copy(camera.position);
  fx.set({ bloom: 0.3, threshold: 0.9, vig: 0.3, grain: 0.02 }); fx.render();
  ['fx', 'tag', 'cap', 'flash', 'burst', 'lb', 'speed'].forEach(id => { const e = $(id); if (e) e.style.opacity = 0; });
};
