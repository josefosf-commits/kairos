// SHORT "E se o seu QI dobrasse? — ep. 3: o botão de pausa" — série E se? (3D, vertical)
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, hemi, sun, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, place, cam, ampAt, thumbLights
} from '../../_lib/mundo3d.js';

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
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: [8, 13].includes(l.id) }); t0 += d; }
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

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t);
  camera.fov = 58; camera.aspect = W / H; setStreet(true, t); cable.visible = false;
  drawPhone(false, 0); phoneLight.intensity = 0;
  // apagão (casas apagam uma a uma)
  const bo = t > 67 ? 1 : seg(t, 47.6, 50.4);
  winMats.forEach(({ m, i }) => { if (t > 47.6 + i * 0.4) m.emissiveIntensity = 0.02; });
  const lampOff = t > 50.2 ? 1 : 0;
  lampMats.forEach(m => m.emissiveIntensity = 2 * (1 - lampOff)); lampLights.forEach(l => l.intensity = 5 * (1 - lampOff));
  if (bo > 0.7) tlMats.forEach(m => m.emissiveIntensity = 0.05);
  streetLight.intensity *= (1 - bo); hemi.intensity *= (1 - 0.5 * bo); sun.intensity *= (1 - 0.55 * bo);
  skyMat.color.setScalar(1 - 0.55 * bo);
  // padrões
  J.visible = true; jo.legs.forEach(l => l.visible = true); J.scale.set(1, 1, 1); J.rotation.set(0, 0, 0);
  jo.head.scale.setScalar(2.55); glasses.visible = true; jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.3 + 0.08 * Math.sin(t * 6);
  eyeGlow.forEach(g => { g.visible = false; g.material.opacity = 0; });
  robot.visible = true; robot.scale.setScalar(1.35); robot.rotation.set(0, 0, 0); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 5; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 4)); mouthMat.emissiveIntensity = 0.4; rmouth.scale.set(1, 1, 1);
  leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 5 + i)) * 2); eyeLight.intensity = 0;
  thr.forEach(g => g.visible = false);
  [...dizzy, ...sparks, ...rocks, ...smoke, ...motes, ...rmotes, ...streamP].forEach(o => o.visible = false);
  [aura, auraIn, raura, rauraIn, ghost, trail, ...ball, ...jOrb, ...rOrb].forEach(o => o.visible = false);
  auraLight.intensity = rLight.intensity = fireLight.intensity = clashLight.intensity = lanternLight.intensity = homeFill.intensity = 0;
  rings.forEach(r => r.visible = false); fireballs.forEach(f => { f.o.visible = f.c.visible = false; }); hideArcs(); hideBig(gBeam); hideBig(rBeam); eyeBeams.forEach(b => { b.core.visible = b.glow.visible = false; });
  car.visible = t < 23.0; car.position.set(-1.4, 0, 2.2); car.rotation.set(0, 0.2, 0); carHalves.forEach(h => h.position.set(0, 0, 0)); cutGlow.forEach(g => g.material.opacity = 0);
  pole.visible = t < 21.5; pole.position.set(-5.2, 0, 4.0); pole.rotation.set(0, 0, 0);
  zebra.forEach((m, i) => { if (t > 20.6 && t < 67) { m.position.set(RP0[0] + 1.4 + i * 0.5, 0.55, RP0[2] - 1.4 + i * 0.7); m.rotation.set(1.1, 0.6, 0.3); } else { m.position.copy(zebra0[i]); m.rotation.set(0, 0, 0); } });
  crater.visible = t > crash && t < 67.0; crack.material.opacity = 0;
  J2b.visible = false; glint.material.opacity = 0; mom.root.visible = false; doorL.rotation.y = 0;
  let ov = {}, camPos, camLook, shake = 0, flash = 0, roll = 0, impact = false, split = null, jBar = 1, rBar = 1;
  const jb = breath(t);
  const fightFace = (o = {}) => jo.face({ open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.5, look: [0.4, 0.1], ...o });
  const rTalk = (t > 28.54 && t < 30.3) || (t > 53.6 && t < 55.28) ? amp : 0;
  if (t < crash) rBar = 1; else rBar = 0.35; if (t > 38.9) jBar = 0.8;

  if (t < 0) { // ---------------- capa: choque de raios ----------------
    J.position.set(...JH); J.rotation.set(0, facing(JH, RC), 0); robot.scale.setScalar(3.2); robot.position.set(...RC); robot.rotation.y = facing(RC, JH);
    jo.pose({ armL: [1.5, 0.05, 0.1], armR: [1.5, 0.05, 0.1], lean: 0.15, leg: [0.3, -0.2] }); fightFace({ mouth: 'o', open: 1.1 });
    rarms[0].rotation.set(-1.45, 0, 0.35); rarms[1].rotation.set(-1.45, 0, -0.35); eyeMat.emissiveIntensity = 10;
    const a = handsJ(), b = handsR(), cp = a.clone().lerp(b, 0.48);
    setBig(gBeam, a, cp, 1, 1.2, 1.3); setBig(rBeam, b, cp, 1, 1.4, 1.3); ball.forEach((m, i) => { m.visible = true; m.position.copy(cp); m.scale.setScalar([0.9, 1.4, 1.2][i]); m.material.opacity = [1, 0.5, 0.35][i]; });
    for (let i = 0; i < 10; i++) { const d = new THREE.Vector3(hash(i) - 0.5, hash(i + 4) - 0.3, hash(i + 8) - 0.5).normalize().multiplyScalar(1.8 + 1.5 * hash(i + 2)); setArc(i, cp, cp.clone().add(d), i * 11.3, 0.9, i % 2 ? '#ffe066' : '#ff8fa3'); }
    clashLight.position.copy(cp); clashLight.intensity = 30; auraJ(1, 1.3, 1.2); auraR(1, 1.3); crater.visible = true;
    rocksAround([cp.x, 0.2, cp.z], 4, 1.3, 1, 3.5);
    camera.fov = 60; camera.updateProjectionMatrix(); cam([cp.x + PA.x * 4 + 2.6, cp.y - 0.6, cp.z + 9.5], [cp.x, cp.y + 0.4, cp.z], 0, 0);
    sky.position.copy(camera.position); renderer.render(scene, camera); return;
  }

  if (t < 3.3) { // ======== GANCHO: o carro sai do chão ========
    J.position.set(JP0[0], JP0[1] + 0.06 * Math.sin(t * 2.5), JP0[2]); J.rotation.set(0, facing(JP0, CH), 0);
    jo.pose({ breathe: jb, armR: [1.5, 0.1, 0.15], armL: [0.4, 0.5, 0.6] }); fightFace({ look: [0.3, 0.3] });
    auraJ(1, t);
    const lift = seg(t, 0.5, 2.9);
    car.position.set(CH[0], lerp(0, CH[1], lift) + 0.08 * Math.sin(t * 9) * lift, CH[2]); car.rotation.set(0.12 * lift * Math.sin(t * 2), 0.2 + 0.3 * lift, 0.18 * lift);
    rocksAround([CH[0], 0.1, CH[2]], 2.0, t, lift, 2.4);
    shake = 0.02 * lift;
    camPos = mix3([CH[0] + 1.6, 0.35, CH[2] + 4.2], [CH[0] + 1.0, 0.6, CH[2] + 3.4], sm(t / 3.3)); camLook = [CH[0] - 0.6, 1.2 + 1.3 * lift, CH[2] - 0.5]; camera.fov = 66;
    ov.hook = seg(t, 1.0, 1.25);
  } else if (t < 7.9) { // ======== resumo (preto e branco) ========
    ov.recap = true;
    if (t < 5.6) { // a trapaça: soco pelas costas
      J.position.set(-1.6, 1.3, 0.2); J.rotation.set(1.2, facing([-1.6, 0, 0.2], [1, 0, -1]) + Math.PI, 0); jo.pose({ armL: [2.4, 0.6, 0.2], armR: [2.4, 0.6, 0.2] }); jo.face({ open: 1.35, mouth: 'o', brow: 1.2 });
      robot.position.set(-0.4, 0, -0.9); robot.rotation.y = facing([-0.4, 0, -0.9], [-1.6, 0, 0.2]); rarms[1].rotation.set(-1.55, 0, -0.2);
      camPos = [1.6, 2.2, 5.2]; camLook = [-1.0, 1.4, -0.4]; ov.fx = ['POW!', 1, '#ff2d55', 50, 40, 220];
    } else { // a aura dourada
      J.position.set(...JP0); J.rotation.set(0, facing(JP0, RP0), 0); jo.pose({ breathe: jb, armL: [0.4, 0.7, 0.6], armR: [0.4, 0.7, 0.6] }); fightFace();
      auraJ(1, t); robot.position.set(...RP0); robot.rotation.y = facing(RP0, JP0);
      const sv = mix3([-0.6, 1.6, 6.8], [-0.4, 1.8, 6.2], sm((t - 5.6) / 2.3)); camPos = sv; camLook = [-0.8, 1.9, -0.2];
    }
    car.visible = false;
  } else if (t < 14.3) { // ======== dia 17, olhos brilham, a mente move as coisas ========
    J.position.set(JP0[0], JP0[1] + 0.06 * Math.sin(t * 2.5), JP0[2]); J.rotation.set(0, facing(JP0, CH) + 0.3, 0);
    robot.position.set(...RP0); robot.rotation.y = facing(RP0, JP0);
    const glow = seg(t, 8.3, 9.2);
    eyeGlow.forEach(g => { g.visible = true; g.material.opacity = 0.7 * glow; });
    const raise = seg(t, 11.2, 11.9);
    jo.pose({ breathe: jb, armR: [lerp(0.4, 1.5, raise), 0.1, lerp(0.6, 0.15, raise)], armL: [0.4, 0.5, 0.6] }); fightFace({ look: [0.2, 0.2] });
    auraJ(1, t);
    const lift = seg(t, 11.5, 13.6);
    car.position.set(CH[0], lerp(0, CH[1], lift) + 0.08 * Math.sin(t * 9) * lift, CH[2]); car.rotation.set(0.12 * lift * Math.sin(t * 2), 0.2 + 0.3 * lift, 0.18 * lift);
    rocksAround([CH[0], 0.1, CH[2]], 2.0, t, lift, 2.4);
    if (t < 11.2) { // close extremo nos olhos
      const h = headJ(), d = new THREE.Vector3(Math.sin(J.rotation.y), 0, Math.cos(J.rotation.y));
      const z = lerp(3.6, 2.8, sm((t - 7.9) / 3.3)); camPos = [h.x + d.x * z, h.y + 0.15, h.z + d.z * z]; camLook = [h.x, h.y + 0.1, h.z]; camera.fov = 40;
    } else { camPos = mix3([CH[0] + 3.0, 1.2, CH[2] + 5.8], [CH[0] + 2.4, 0.8, CH[2] + 5.0], sm((t - 11.2) / 3.1)); camLook = [CH[0] - 0.9, 1.6 + 0.9 * lift, CH[2] - 0.8]; camera.fov = 64; shake = 0.025 * lift; }
    ov.day = t < 10.0 ? seg(t, 8.1, 8.35) : 0; ov.qi = t > 9.9 && t < 11.25 ? seg(t, 9.95, 10.2) : 0;
  } else if (t < 18.9) { // ======== o carro, o poste, a faixa (órbita ao redor dele) ========
    J.position.set(JP0[0], JP0[1] + 0.06 * Math.sin(t * 2.5), JP0[2]); J.rotation.set(0, facing(JP0, RP0), 0);
    robot.position.set(...RP0); robot.rotation.y = facing(RP0, JP0);
    jo.pose({ breathe: jb, armR: [2.6, 0.4, 0.3], armL: [2.6, 0.4, 0.3] }); fightFace({ look: [0, 0.4] });
    eyeGlow.forEach(g => { g.visible = true; g.material.opacity = 0.9; }); auraJ(1.1, t);
    const ang = t * 1.1;
    car.position.set(JP0[0] + Math.cos(ang) * 2.6, 3.1 + 0.15 * Math.sin(t * 3), JP0[2] + Math.sin(ang) * 2.6); car.rotation.set(0.3 * Math.sin(t), ang, 0.2);
    const pk = seg(t, 15.4, 16.2);
    pole.position.set(lerp(-5.2, JP0[0] + Math.cos(ang + 2.1) * 2.9, pk), lerp(0, 2.2, pk), lerp(4.0, JP0[2] + Math.sin(ang + 2.1) * 2.9, pk)); pole.rotation.set(0, ang, lerp(0, Math.PI / 2, pk));
    const zk = seg(t, 16.6, 17.4);
    zebra.forEach((m, i) => { const a = ang + 3.6 + i * 0.45; m.position.set(lerp(zebra0[i].x, JP0[0] + Math.cos(a) * 3.0, zk), lerp(0.02, 1.0 + i * 0.35, zk), lerp(zebra0[i].z, JP0[2] + Math.sin(a) * 3.0, zk)); m.rotation.set(zk * 1.2, a, zk * 0.4); });
    rocksAround([JP0[0], 0.1, JP0[2]], 3.0, t, 1, 3.0);
    const oa = lerp(-0.4, 1.0, sm((t - 14.3) / 4.6));
    camPos = [JP0[0] + Math.sin(oa) * 7.4, 0.5, JP0[2] + Math.cos(oa) * 7.4]; camLook = [JP0[0], 2.4, JP0[2]]; camera.fov = 66; roll = 0.06;
    shake = (t > 15.4 && t < 15.8) || (t > 16.6 && t < 17.0) ? 0.03 : 0.008;
    ov.tk = seg(t, 14.5, 14.75);
  } else if (t < 23.8) { // ======== arremesso; o robô corta o carro com um raio (câmera lenta) ========
    J.position.set(...JP0); J.rotation.set(0, facing(JP0, RP0), 0);
    const th = seg(t, 18.95, 19.2);
    jo.pose({ breathe: jb, armR: [lerp(2.6, 1.55, th), 0.05, 0.1], armL: [lerp(2.6, 1.55, th), 0.05, 0.1], lean: 0.25 * th }); fightFace({ mouth: th > 0.5 && t < 20 ? 'o' : 'flat' });
    eyeGlow.forEach(g => { g.visible = true; g.material.opacity = 0.9; }); auraJ(1.1, t);
    robot.position.set(...RP0); robot.rotation.y = facing(RP0, JP0);
    // carro: progresso com câmera lenta entre 21,1 e 22,6
    const p = t < 19.3 ? 0 : t < 21.1 ? lerp(0, 0.55, (t - 19.3) / 1.8) : t < 22.6 ? lerp(0.55, 0.72, (t - 21.1) / 1.5) : lerp(0.72, 1.0, Math.min(1, (t - 22.6) / 0.4));
    const startC = [JP0[0] + 2.0, 3.0, JP0[2] + 1.5];
    const cpos = p < 0.62 ? mix3(startC, HIT, p / 0.62) : mix3(HIT, END, (p - 0.62) / 0.38);
    const sep = Math.max(0, p - 0.55) * 7;
    car.visible = t < 23.0; car.position.set(...cpos); car.rotation.set(0, Math.atan2(-PDIR.z, PDIR.x), 0.3 * Math.sin(p * 6));
    carHalves.forEach((h, i) => h.position.set(0, sep * 0.15 * (i ? 1 : -1), sep * (i ? 1 : -1)));
    cutGlow.forEach(g => g.material.opacity = p > 0.55 ? 0.9 * (1 - (p - 0.55) * 2) : 0);
    // poste: o robô rebate
    const pf = lin(t, 19.4, 20.1); const swat = seg(t, 19.95, 20.15) * (1 - seg(t, 20.5, 20.9));
    rarms[0].rotation.set(-1.2 * swat, 0, 0.9 * swat);
    if (t < 20.1) { pole.position.set(...mix3([JP0[0] + 1.0, 2.6, JP0[2] - 1.5], [RP0[0] - 0.6, 1.6, RP0[2] + 0.3], pf)); pole.rotation.set(0, 0.4, Math.PI / 2); }
    else { const k = (t - 20.1); pole.position.set(RP0[0] - 0.6 + k * 3, 1.6 + k * 6 - k * k * 4, RP0[2] + 0.3 + k * 4); pole.rotation.set(k * 6, 0.4, Math.PI / 2 + k * 9); }
    // faixas: cravam no chão atrás do robô
    zebra.forEach((m, i) => { const ti = 19.6 + i * 0.08, k = lin(t, ti, ti + 0.75); const dst = [RP0[0] + 1.4 + i * 0.5, 0.55, RP0[2] - 1.4 + i * 0.7]; const src = [JP0[0] - 0.5 + i * 0.3, 2.0 + i * 0.35, JP0[2] - 1.5]; m.position.set(...mix3(src, dst, k)); m.position.y += Math.sin(k * Math.PI) * 1.2; m.rotation.set(k < 1 ? k * 8 : 1.1, 0.6, 0.3); });
    // raio dos olhos corta
    const fire = t > 20.95 && t < 21.45 ? 1 : 0; eyeMat.emissiveIntensity = 5 + 8 * seg(t, 20.4, 20.95);
    if (fire) { scene.updateMatrixWorld(true); rhead.localToWorld(e1.set(-0.14, 0.06, 0.3)); rhead.localToWorld(e2.set(0.14, 0.06, 0.3)); const c = V3(cpos).add(new THREE.Vector3(0, 0.55 + 0.4 * Math.sin(t * 40), 0)); setEyeBeam(eyeBeams[0], e1.clone(), c, 1); setEyeBeam(eyeBeams[1], e2.clone(), c, 1); flash = 0.15; }
    // explosões
    const ek = lin(t, 22.95, 24.6);
    fireAt(0, [END[0] + PPERP.x * 2.2, 0.8, END[2] + PPERP.z * 2.2], ek, 2.4); fireAt(1, [END[0] - PPERP.x * 2.2, 0.8, END[2] - PPERP.z * 2.2], lin(t, 23.05, 24.7), 2.2);
    if (t > 22.95) { fireLight.position.set(END[0], 1.6, END[2]); fireLight.intensity = 30 * (1 - ek * 0.6); }
    for (let i = 0; i < 14; i++) puff(i, [END[0] + (hash(i) - 0.5) * 4, 0.5 + hash(i + 3) * 2.5 * lin(t, 23, 24.6), END[2] + (hash(i + 7) - 0.5) * 3], lin(t, 23.0 + hash(i) * 0.3, 25.5), 1.6, '#3b3540');
    if (t < 20.95) { camPos = [-0.4, 2.0, 7.8]; camLook = [-0.4, 1.9, -0.3]; camera.fov = 64; shake = t > 20.1 && t < 20.4 ? 0.04 : 0; }
    else if (t < 22.6) { camPos = [RP0[0] + 2.8, 3.4, RP0[2] + 3.0]; camLook = [cpos[0], cpos[1] + 0.2, cpos[2]]; camera.fov = 60; ov.slow = true; roll = -0.12; }
    else { camPos = [-0.8, 2.3, 8.4]; camLook = [1.4, 1.6, -1.2]; camera.fov = 64; shake = 0.12 * Math.max(0, 1 - (t - 22.95) * 2); if (t > 22.95 && t < 23.25) flash = 0.7; }
    if (t > 20.1 && t < 20.6) ov.fx = ['CLANG!', seg(t, 20.1, 20.25), '#7fdcff', 62, 36, 170];
    if (t > 20.95 && t < 21.6) ov.fx = ['ZAAAP!', seg(t, 20.95, 21.1), '#ff2d55', 50, 30, 200];
    if (t > 22.95 && t < 23.8) ov.fx = ['BOOM!', seg(t, 22.95, 23.15), '#ffb703', 50, 40, 280];
    if (t > 22.95 && t < 23.02) impact = true;
  } else if (t < 28.0) { // ======== o robô sai do fogo ========
    J.position.set(...JP0); J.rotation.set(0, facing(JP0, RP0), 0); jo.pose({ breathe: jb, armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8] }); fightFace(); auraJ(1, t);
    car.visible = false; pole.visible = false;
    zebra.forEach((m, i) => { m.position.set(RP0[0] + 1.4 + i * 0.5, 0.55, RP0[2] - 1.4 + i * 0.7); m.rotation.set(1.1, 0.6, 0.3); });
    const wk = lin(t, 24.6, 27.4), w = walkPose(wk * 4, wk > 0 && wk < 1 ? 1 : 0);
    const rp = mix3(RP0, RW, sm(wk)); robot.position.set(rp[0], Math.abs(w.bob) * 0.6, rp[2]); robot.rotation.y = facing(rp, JP0);
    rarms.forEach((a, i) => a.rotation.set((i ? 1 : -1) * Math.sin(wk * 4 * Math.PI) * 0.4, 0, 0)); eyeMat.emissiveIntensity = 8;
    for (let i = 0; i < 4; i++) fireAt(i, [END[0] + (i - 1.5) * 1.3, 0.7 + 0.3 * Math.sin(t * 7 + i), END[2] + (i % 2) * 1.2], 0.35 + 0.08 * Math.sin(t * 11 + i * 2), 1.5);
    fireLight.position.set(END[0], 1.5, END[2]); fireLight.intensity = 22 + 6 * Math.sin(t * 13);
    for (let i = 0; i < 12; i++) puff(i, [END[0] + (hash(i) - 0.5) * 4, 1.5 + ((t * 0.4 + hash(i)) % 1) * 3, END[2] + (hash(i + 7) - 0.5) * 3], 0.3 + 0.5 * (((t * 0.4 + hash(i)) % 1)), 1.8, '#2b2730');
    camPos = mix3([RW[0] - 0.4, 0.45, RW[2] + 4.2], [RW[0] - 0.3, 0.5, RW[2] + 3.5], sm((t - 23.8) / 4.2)); camLook = [rp[0], 1.9, rp[2]]; camera.fov = 62;
  } else if (t < 31.3) { // ======== Joseph descobre que pode voar ========
    car.visible = pole.visible = false; zebra.forEach((m, i) => { m.position.set(RP0[0] + 1.4 + i * 0.5, 0.55, RP0[2] - 1.4 + i * 0.7); m.rotation.set(1.1, 0.6, 0.3); });
    robot.position.set(...RW); robot.rotation.y = facing(RW, JP0);
    const crouch = seg(t, 28.1, 28.9) * (1 - seg(t, 29.35, 29.5)), go = t > 29.4 ? Math.pow(lin(t, 29.4, 30.05), 2) : 0;
    const flare = seg(t, 28.6, 29.35);
    J.position.set(JP0[0], lerp(JP0[1], 1.0, crouch) + go * 11, JP0[2]); J.rotation.set(0, facing(JP0, RW), 0);
    jo.pose({ breathe: jb, leg: [0.9 * crouch, 0.9 * crouch], armL: [lerp(0.3, 3.0, go), 0.5, lerp(1.4, 0.2, go)], armR: [lerp(0.3, 0.2, go), 0.5, 1.4 * (1 - go)], lean: 0.25 * crouch }); fightFace({ mouth: flare > 0.5 ? 'o' : 'flat' });
    auraJ(1 + 0.5 * flare, t, 1 + 0.3 * flare);
    ringAt(0, [JP0[0], 0.06, JP0[2]], t - 29.4, 5, [Math.PI / 2, 0, 0], 0.7, '#ffe066');
    rocksAround([JP0[0], 0.1, JP0[2]], 1.4 + 3 * lin(t, 29.4, 30), t, flare, 1.6 + 2 * go);
    for (let i = 14; i < 24; i++) { const a = i * 0.63; puff(i, [JP0[0] + Math.cos(a) * (0.6 + 3 * lin(t, 29.4, 30.4)), 0.3, JP0[2] + Math.sin(a) * (0.6 + 3 * lin(t, 29.4, 30.4))], lin(t, 29.4, 30.6), 1.0, '#8a8290'); }
    shake = 0.02 * flare + (t > 29.4 && t < 29.8 ? 0.1 : 0);
    if (t > 29.4 && t < 29.6) flash = 0.5;
    if (t < 30.05) { camPos = [JP0[0] + 2.4, 0.3, JP0[2] + 3.6]; camLook = [JP0[0], Math.min(J.position.y + 0.8, 7), JP0[2]]; camera.fov = 70; }
    else { const jp = jAt(2.4); J.position.set(jp[0], jp[1] + 0.25 * (1 - seg(t, 30.05, 30.6)), jp[2]); J.rotation.set(0, facing(jp, rAt(2.4)), 0); jo.pose({ breathe: jb, leg: [-0.15, 0.35], armL: [0.4, 0.6, 0.6], armR: [0.4, 0.6, 0.6] });
      camPos = [jp[0] + PA.x * 6.2 - AX.x * 2.2, jp[1] - 1.0, jp[2] + PA.z * 6.2 - AX.z * 2.2]; camLook = [jp[0], jp[1] + 1.4, jp[2]]; camera.fov = 60; }
    if (t > 29.4 && t < 30.0) ov.fx = ['VUUSH!', seg(t, 29.4, 29.55), '#ffe066', 50, 26, 200];
    ov.speed = t > 29.4 && t < 30.05 ? 0.9 : 0;
  } else if (t < 34.3) { // ======== o robô liga os propulsores: "você não é o único que voa" ========
    car.visible = pole.visible = false;
    const up = Math.pow(lin(t, 31.8, 32.6), 1.6);
    const rp = [lerp(RW[0], rAt(2.4)[0], sm(up)), lerp(0, rAt(2.4)[1], up), lerp(RW[2], rAt(2.4)[2], sm(up))];
    robot.position.set(...rp); robot.rotation.y = facing(rp, jAt(2.4)); thr.forEach(g => { g.visible = t > 31.4; g.scale.setScalar(0.7 + 0.3 * Math.sin(t * 40) + 0.4 * up); });
    rarms.forEach((a, i) => a.rotation.set(0.3 * up, 0, (i ? -1 : 1) * 0.35 * up)); eyeMat.emissiveIntensity = 8;
    if (rTalk) { mouthMat.emissiveIntensity = 0.5 + 3 * rTalk; rmouth.scale.set(0.3 + 0.9 * rTalk, 1 + 1.5 * rTalk, 1); }
    const jp = jAt(2.4); J.position.set(jp[0], jp[1] + 0.06 * Math.sin(t * 2.5), jp[2]); J.rotation.set(0, facing(jp, rAt(2.4)), 0); jo.pose({ breathe: jb, leg: [-0.15, 0.35], armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8] }); fightFace(); auraJ(1, t);
    for (let i = 0; i < 8; i++) puff(i, [RW[0] + (hash(i) - 0.5) * 2, 0.3, RW[2] + (hash(i + 3) - 0.5) * 2], lin(t, 31.5 + i * 0.05, 33.0), 1.2, '#7a7480');
    if (t < 32.2) { camPos = [RW[0] + 2.0, 0.35, RW[2] + 2.8]; camLook = [rp[0], rp[1] + 1.0, rp[2]]; camera.fov = 66; shake = 0.03; }
    else { scene.updateMatrixWorld(true); const h = headR(); const d = new THREE.Vector3(Math.sin(robot.rotation.y), 0, Math.cos(robot.rotation.y)); camPos = [h.x + d.x * 2.6 + PA.x * 0.8, h.y - 0.4, h.z + d.z * 2.6 + PA.z * 0.8]; camLook = [h.x, h.y - 0.2, h.z]; camera.fov = 52; eyeMat.emissiveIntensity = 4; }
  } else if (t < 44.0) { // ======== LUTA NO AR ========
    car.visible = pole.visible = false;
    thr.forEach(g => { g.visible = true; g.scale.setScalar(0.8 + 0.25 * Math.sin(t * 40)); });
    let dJ = 2.4, dR = 2.4, jy = 0, ry = 0, jvis = true;
    let armR = [0.9, 0.2, 1.8], armL = [0.9, 0.2, 1.8], lean = 0.1, rp0 = 0, rp1 = 0, mouth = 'flat';
    let rFallK = 0;
    if (t < 34.85) { // investida
      const k = Math.pow(lin(t, 34.3, 34.85), 2); dJ = lerp(2.4, 0.78, k); dR = lerp(2.4, 0.78, k); armR = [lerp(0.9, 1.55, k), 0, lerp(1.8, 0.1, k)]; rp1 = k; lean = 0.35 * k; ov.speed = 0.8;
      camPos = sideA(9.6, 0.4); camLook = [MA[0], MA[1] + 0.6, MA[2]]; camera.fov = 58;
    } else if (t < 35.0) { // CHOQUE dos punhos (hit-stop)
      dJ = dR = 0.78; armR = [1.55, 0, 0.1]; rp1 = 1; lean = 0.35; mouth = 'o';
      camPos = sideA(7.6, 0.4); camLook = [MA[0], MA[1] + 0.6, MA[2]]; camera.fov = 58; flash = 0.8; shake = 0.15; impact = t < 34.92;
      ov.fx = ['BOOM!', seg(t, 34.85, 34.95), '#ffd60a', 50, 30, 280];
    } else if (t < 37.0) { // sequência de socos (câmera em órbita)
      const k = Math.floor((t - 35) / 0.16), ph = ((t - 35) / 0.16) % 1, who = k % 2, arm = (k >> 1) % 2, ext = ph < 0.55 ? Math.sin(ph / 0.55 * Math.PI) : 0;
      dJ = 0.9 + 0.08 * Math.sin(t * 23); dR = 0.9 + 0.08 * Math.sin(t * 19 + 1);
      if (who === 0) { if (arm) armR = [lerp(0.9, 1.6, ext), lerp(0.2, -0.1, ext), lerp(1.8, 0.05, ext)]; else armL = [lerp(0.9, 1.6, ext), lerp(0.2, -0.1, ext), lerp(1.8, 0.05, ext)]; }
      else { if (arm) rp1 = ext; else rp0 = ext; }
      lean = 0.2; mouth = ph < 0.3 ? 'o' : 'flat';
      const a = lerp(0.2, 2.7, (t - 35) / 2), R = 4.6; camPos = [MA[0] + Math.cos(a) * R, MA[1] + 0.9 + 0.3 * Math.sin(t * 2), MA[2] + Math.sin(a) * R]; camLook = [MA[0], MA[1] + 0.7, MA[2]]; camera.fov = 60; roll = 0.14 * Math.sin(t * 1.7);
      if (ph < 0.3) { const c = [MA[0] + (hash(k) - 0.5) * 0.5, MA[1] + 0.6 + (hash(k + 1) - 0.5) * 0.5, MA[2] + (hash(k + 2) - 0.5) * 0.5]; sparks.forEach((s, i) => { const r = ph * 4 * (0.5 + hash(i + k)); s.visible = true; s.position.set(c[0] + Math.cos(i * 0.45) * r, c[1] + Math.sin(i * 0.9) * r * 0.7, c[2] + Math.sin(i * 0.45) * r); s.scale.setScalar(1.3 * (1 - ph * 3)); }); ringAt(1, c, ph * 0.16, 1.4, [0, Math.PI / 2 - Math.atan2(AX.z, AX.x), 0], 0.16, who ? '#ff8fa3' : '#ffe066'); shake = 0.04; }
      if (ph < 0.5) ov.fx = [who ? 'BAM!' : 'POW!', 1, who ? '#ff2d55' : '#ffd60a', 30 + hash(k) * 40, 22 + hash(k + 5) * 30, 150];
    } else if (t < 38.0) { // os dois se afastam
      const k = seg(t, 37.0, 37.5); dJ = lerp(0.9, 2.0, k); dR = lerp(0.9, 2.0, k); armR = [1.0, 0.2, 1.6]; lean = 0.15;
      if (t < 37.12) { flash = 0.6; impact = t < 37.07; ringAt(1, [MA[0], MA[1] + 0.6, MA[2]], t - 37.0, 3.5, [0, Math.PI / 2 - Math.atan2(AX.z, AX.x), 0], 0.6); }
      ringAt(1, [MA[0], MA[1] + 0.6, MA[2]], t - 37.0, 3.5, [0, Math.PI / 2 - Math.atan2(AX.z, AX.x), 0], 0.6);
      camPos = sideA(6.6, -0.3); camLook = [MA[0], MA[1] + 0.8, MA[2]]; camera.fov = 60; shake = 0.06 * Math.max(0, 1 - (t - 37) * 3);
    } else if (t < 38.67) { // SOCO no rosto
      const dash = seg(t, 38.0, 38.2); dJ = lerp(2.0, 0.55, dash); dR = 2.0;
      const hit = t > 38.22;
      armR = [lerp(1.0, 1.6, dash), lerp(0.2, -0.1, dash), lerp(1.6, 0.05, dash)]; lean = 0.4 * dash; mouth = 'o';
      if (t > 38.36) { const kb = lin(t, 38.36, 38.67); dR = 2.0 + 0.9 * sm(kb); rhead.rotation.set(-0.5 * (1 - kb * 0.5), 0.3, 0.2); ov.slow = true; }
      if (t > 38.22 && t < 38.36) { flash = 0.9; shake = 0.12; impact = t < 38.29; }
      const jp = V3(jAt(dJ)); camPos = [jp.x - AX.x * 1.7 + PA.x * 1.1, jp.y + 1.7, jp.z - AX.z * 1.7 + PA.z * 1.1]; camLook = A3(V3(rAt(dR)).add(new THREE.Vector3(0, 2.4, 0))); camera.fov = hit ? 46 : 54;
      if (hit) ov.fx = ['POW!', seg(t, 38.22, 38.32), '#ffd60a', 60, 30, 240];
    } else if (t < 39.55) { // BLOQUEIO
      const dash = seg(t, 38.7, 38.85); dR = lerp(2.9, 1.0, dash); dJ = 0.55 + 0.8 * seg(t, 38.95, 39.3);
      const pr = seg(t, 38.82, 38.95) * (1 - seg(t, 39.2, 39.5)); rp1 = pr;
      armR = armL = [1.75, 1.0, 2.4]; lean = -0.1; mouth = 'flat';
      if (t > 38.95 && t < 39.08) { flash = 0.6; shake = 0.1; impact = t < 39.0; }
      ringAt(2, A3(V3(jAt(dJ)).add(new THREE.Vector3(0, 1.0, 0)).addScaledVector(AX, -0.6)), t - 38.95, 2.2, [0, Math.PI / 2 - Math.atan2(AX.z, AX.x), 0], 0.5, '#7fdcff');
      if (t > 38.95 && t < 39.25) { const c = V3(jAt(dJ)).add(new THREE.Vector3(0, 1.0, 0)).addScaledVector(AX, 0.4); sparks.forEach((s, i) => { const r = (t - 38.95) * 8 * (0.5 + hash(i)); s.visible = true; s.position.set(c.x + Math.cos(i * 0.45) * r * 0.3, c.y + Math.sin(i * 0.9) * r * 0.5, c.z + Math.sin(i * 0.45) * r); s.scale.setScalar(1.2); }); }
      const rp = V3(rAt(dR)); camPos = [rp.x + AX.x * 1.9 - PA.x * 1.1, rp.y + 2.9, rp.z + AX.z * 1.9 - PA.z * 1.1]; camLook = A3(V3(jAt(dJ)).add(new THREE.Vector3(0, 1.2, 0))); camera.fov = 54;
      if (t > 38.95) ov.fx = ['CLANG!', seg(t, 38.95, 39.05), '#7fdcff', 40, 30, 200];
    } else if (t < 40.36) { // TELEPORTE + martelada
      dR = 1.0; dJ = 1.35;
      const sw = seg(t, 39.55, 39.68) * (1 - seg(t, 39.85, 40.1)); rp0 = sw;
      jvis = !(t > 39.62 && t < 39.86);
      const gk = lin(t, 39.62, 39.95); ghost.visible = gk > 0 && gk < 1; { const gp = V3(jAt(1.35)).add(new THREE.Vector3(0, 0.9, 0)); ghost.position.copy(gp); ghost.scale.set(1.1 + gk, 2.0 + gk, 1.1 + gk); ghost.material.opacity = 0.5 * (1 - gk); }
      if (t >= 39.86) { const rp = V3(rAt(1.0)); J.position.set(rp.x, rp.y + 4.2, rp.z); }
      const ham = seg(t, 40.1, 40.25);
      armR = armL = t >= 39.86 ? [lerp(3.0, 0.8, ham), 0.05, 0.25] : [0.9, 0.2, 1.8]; lean = t >= 39.86 ? 0.5 * ham : 0.1; mouth = t >= 39.86 ? 'o' : 'flat';
      if (t > 39.86 && t < 39.95) flash = 0.5;
      if (t > 40.25) { flash = 0.9; shake = 0.15; impact = t < 40.32; }
      if (t < 39.86) { camPos = sideA(5.6, 0.2, 0.5); camLook = [MA[0] + AX.x * 0.3, MA[1] + 0.7, MA[2] + AX.z * 0.3]; camera.fov = 58; }
      else { const rp = V3(rAt(1.0)); camPos = [rp.x + PA.x * 2.8 + AX.x * 0.6, rp.y - 0.6, rp.z + PA.z * 2.8 + AX.z * 0.6]; camLook = [rp.x, rp.y + 4.0, rp.z]; camera.fov = 66; roll = 0.15; }
      if (t > 39.6 && t < 39.95) ov.fx = ['VUUSH!', seg(t, 39.6, 39.7), '#ffe066', 30, 34, 180];
      if (t > 40.25) ov.fx = ['KRAK!', seg(t, 40.25, 40.33), '#ffd60a', 55, 26, 240];
    } else { // o robô despenca e abre a cratera
      dR = 1.0; dJ = 1.35;
      rFallK = Math.pow(lin(t, 40.36, crash), 2);
      armR = armL = [0.8, 0.05, 0.25]; lean = 0.3;
      if (t < crash) { const rp = V3(rAt(1.0)); camPos = [RC[0] + 3.2, 0.5, RC[2] + 5.2]; camLook = [lerp(rp.x, RC[0], rFallK), lerp(rp.y, 0, rFallK) + 1.2, lerp(rp.z, RC[2], rFallK)]; camera.fov = 70; ov.vlines = 1; }
      else if (t < 42.5) { camPos = mix3([RC[0] - 0.8, 2.6, RC[2] + 9.2], [RC[0] - 0.6, 2.3, RC[2] + 8.4], sm((t - crash) / 1.5)); camLook = [RC[0], 0.8, RC[2]]; camera.fov = 64; }
      else { camPos = [JH[0] - 1.6, JH[1] + 2.0, JH[2] + 3.0]; camLook = [RC[0], 0.6, RC[2]]; camera.fov = 56; }
      if (t > crash && t < crash + 0.12) { flash = 1; impact = t < crash + 0.07; }
      shake = t > crash ? 0.22 * Math.max(0, 1 - (t - crash) * 1.5) : 0.02;
      if (t > crash && t < crash + 1.0) ov.fx = ['BOOM!', seg(t, crash, crash + 0.12), '#ffb703', 50, 32, 300];
    }
    // aplica posições
    const jp = jAt(dJ, jy), rpp = rAt(dR, ry);
    if (!(t >= 39.86 && t < 40.36) && !(t >= 40.36)) { J.position.set(...jp); }
    if (t >= 40.36) { const rp = V3(rAt(1.0)); const desc = seg(t, 41.6, 43.6); J.position.set(...mix3([rp.x, rp.y + 4.2, rp.z], JH, desc)); }
    J.visible = jvis; J.rotation.set(0, facing(J.position.toArray(), rpp), 0);
    if (t >= 39.86 && t < 40.36) J.rotation.set(0.6, facing(jp, rpp), 0);
    jo.pose({ breathe: jb, leg: [-0.15, 0.35], armL, armR, lean }); fightFace({ mouth });
    auraJ(1, t);
    if (t < 40.36) { robot.position.set(...rpp); robot.rotation.y = facing(rpp, jp); }
    else { const rp = V3(rAt(1.0)); robot.position.set(lerp(rp.x, RC[0], rFallK), lerp(rp.y, 0, rFallK), lerp(rp.z, RC[2], rFallK)); robot.rotation.set(t > crash ? -Math.PI / 2 : -0.4 * rFallK, facing(RC, JH), 0); if (t > crash) robot.position.y = 0.32; thr.forEach(g => g.visible = false); }
    rarms[0].rotation.set(-1.55 * rp0, 0, 0.2 * rp0); rarms[1].rotation.set(-1.55 * rp1, 0, -0.2 * rp1); eyeMat.emissiveIntensity = 8;
    if (t > crash) { // poeira e pedras da cratera
      ringAt(0, [RC[0], 0.08, RC[2]], t - crash, 7, [Math.PI / 2, 0, 0], 0.9, '#ffe9c4');
      for (let i = 0; i < 26; i++) { const a = i * 0.24 + hash(i); const k = lin(t, crash, crash + 2.6 + hash(i)); puff(i, [RC[0] + Math.cos(a) * (0.5 + 5 * Math.sqrt(k)), 0.4 + 1.2 * hash(i + 2) * k, RC[2] + Math.sin(a) * (0.5 + 5 * Math.sqrt(k))], k, 1.6, '#8a7f75'); }
      rocks.forEach((r, i) => { const k = t - crash; const a = hash(i) * 6.28, sp = 2 + 4 * hash(i + 3); const y = 0.2 + (5 * hash(i + 5)) * k - 6 * k * k; r.visible = y > 0; r.position.set(RC[0] + Math.cos(a) * sp * k, y, RC[2] + Math.sin(a) * sp * k); r.rotation.set(k * 9, k * 5, i); });
      crack.material.opacity = 0.4 * (1 - lin(t, crash, 43));
    }
    ov.bars = true;
  } else if (t < 47.0) { // ======== o robô levanta: "mas ele tem um plano" ========
    J.position.set(JH[0], JH[1] + 0.06 * Math.sin(t * 2.5), JH[2]); J.rotation.set(0, facing(JH, RC), 0); jo.pose({ breathe: jb, leg: [-0.15, 0.35], armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8] }); fightFace(); auraJ(1, t);
    const up = seg(t, 44.6, 45.8);
    robot.position.set(RC[0], lerp(0.32, 0, up), RC[2]); robot.rotation.set(-Math.PI / 2 * (1 - up), facing(RC, JH), 0);
    eyeMat.emissiveIntensity = t > 45.4 ? 10 + 3 * Math.sin(t * 20) : 0.5; antMat.emissiveIntensity = t > 45.6 ? 6 : 1;
    for (let i = 0; i < 12; i++) puff(i, [RC[0] + (hash(i) - 0.5) * 5, 0.4 + ((t * 0.2 + hash(i)) % 1) * 1.5, RC[2] + (hash(i + 7) - 0.5) * 4], 0.4 + 0.4 * ((t * 0.2 + hash(i)) % 1), 1.6, '#6f665e');
    if (t < 45.6) { camPos = mix3([RC[0] + 0.6, 1.0, RC[2] + 4.6], [RC[0] + 0.4, 1.1, RC[2] + 4.0], sm((t - 44) / 1.6)); camLook = [RC[0], 0.9, RC[2]]; camera.fov = 60; }
    else { const h = headR(); const d = new THREE.Vector3(Math.sin(robot.rotation.y), 0, Math.cos(robot.rotation.y)); const z = lerp(2.0, 1.4, sm((t - 45.6) / 1.4)); camPos = [h.x + d.x * z, h.y, h.z + d.z * z]; camLook = [h.x, h.y, h.z]; camera.fov = 44; eyeMat.emissiveIntensity = 4 + Math.sin(t * 20); }
    ov.bars = true;
  } else if (t < 53.5) { // ======== APAGÃO: o robô suga o bairro e cresce ========
    J.position.set(JH[0], JH[1] + 0.06 * Math.sin(t * 2.5), JH[2]); J.rotation.set(0, facing(JH, RC), 0); jo.pose({ breathe: jb, leg: [-0.15, 0.35], armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8] }); fightFace({ brow: 0.6, browTilt: 0 }); auraJ(1, t);
    const pulses = [50.9, 51.6, 52.3]; let g = 0; pulses.forEach(p => g += seg(t, p, p + 0.25) / 3);
    const s = 1.35 + (3.2 - 1.35) * g; robot.position.set(...RC); robot.rotation.y = facing(RC, JH); robot.scale.setScalar(s);
    const armsUp = seg(t, 47.1, 47.6); rarms[0].rotation.set(0, 0, 2.6 * armsUp); rarms[1].rotation.set(0, 0, -2.6 * armsUp);
    eyeMat.emissiveIntensity = 10; antMat.emissiveIntensity = 6; leds.forEach(l => l.material.emissiveIntensity = 4);
    auraR(seg(t, 47.6, 49.0), t);
    const chest = new THREE.Vector3(RC[0], 1.5 * s, RC[2]);
    HOUSEX.forEach((x, i) => { const td = 47.6 + i * 0.4; for (let j = 0; j < 7; j++) { const p = streamP[i * 7 + j]; const a = td - 0.7, b = td + 1.3; if (t < a || t > b) continue; const ph = ((t - a) * 1.4 + j / 7) % 1; const w = new THREE.Vector3(x, 1.6, -6.0), c = new THREE.Vector3((x + RC[0]) / 2, 4.2, -3.6); const P = w.clone().multiplyScalar((1 - ph) * (1 - ph)).add(c.clone().multiplyScalar(2 * ph * (1 - ph))).add(chest.clone().multiplyScalar(ph * ph)); p.visible = true; p.position.copy(P); p.scale.setScalar(1.4 * (0.6 + 0.4 * Math.sin(ph * Math.PI))); } if (t > td - 0.5 && t < td + 0.9 && i < 10) setArc(i, new THREE.Vector3(x, 1.8, -6.0), chest, Math.floor(t * 20) + i * 7, 0.8, '#ff8fa3'); });
    if (t > 50.2 && t < 51.0) setArc(8, new THREE.Vector3(-4.6, 3.6, -4.4), chest, Math.floor(t * 20) + 3, 0.8, '#ffd27a');
    if (t > 50.2 && t < 51.0) setArc(9, new THREE.Vector3(5.6, 3.6, -4.4), chest, Math.floor(t * 20) + 5, 0.8, '#ffd27a');
    const pp = pulses.find(p => t > p && t < p + 0.35); shake = pp ? 0.07 : 0.012;
    crack.material.opacity = 0.6 * seg(t, 48, 50);
    if (t < 50.6) { camPos = mix3([RC[0] + 0.4, 2.4, RC[2] + 9.6], [RC[0] + 0.3, 2.2, RC[2] + 8.6], sm((t - 47) / 3.6)); camLook = [RC[0] - 0.4, 2.6, RC[2] - 3.0]; camera.fov = 62; }
    else { camPos = [RC[0] + 1.6, 0.3, RC[2] + 5.4 + g * 3.6]; camLook = [RC[0], 1.2 + 3.2 * g, RC[2]]; camera.fov = 68; roll = -0.08; }
    ov.apagao = t > 50.6 && t < 52.4 ? seg(t, 50.6, 50.85) : 0; ov.bars = true; rBar = 0.35 + 0.65 * seg(t, 48, 52.6);
  } else if (t < 55.9) { // ======== "agora acabou, Joseph." ========
    robot.position.set(...RC); robot.rotation.y = facing(RC, JH); robot.scale.setScalar(3.2); eyeMat.emissiveIntensity = 10; antMat.emissiveIntensity = 6; auraR(1, t);
    if (rTalk) { mouthMat.emissiveIntensity = 0.5 + 3 * rTalk; rmouth.scale.set(0.3 + 0.9 * rTalk, 1 + 1.5 * rTalk, 1); }
    J.position.set(JH[0], JH[1] + 0.06 * Math.sin(t * 2.5), JH[2]); J.rotation.set(0, facing(JH, RC), 0); jo.pose({ breathe: jb, leg: [-0.15, 0.35], armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8] }); fightFace(); auraJ(1, t);
    if (t < 55.1) { const fr = new THREE.Vector3(JH[0] - RC[0], 0, JH[2] - RC[2]).normalize(); camPos = [RC[0] + fr.x * 6.5 + 1.4, 0.4, RC[2] + fr.z * 6.5 + 2.4]; camLook = [RC[0], 4.6, RC[2]]; camera.fov = 70; }
    else { camPos = [RC[0] + 1.0, 6.2, RC[2] + 3.4]; camLook = [JH[0], JH[1] + 1.2, JH[2]]; camera.fov = 44; }
    ov.bars = true; rBar = 1;
  } else if (t < 61.0) { // ======== carga: tela dividida ========
    robot.position.set(...RC); robot.rotation.y = facing(RC, JH); robot.scale.setScalar(3.2); eyeMat.emissiveIntensity = 12; antMat.emissiveIntensity = 7;
    const fwd = seg(t, 59.6, 60.3);
    rarms[0].rotation.set(-1.45, 0, 0.35 + 0.2 * (1 - fwd)); rarms[1].rotation.set(-1.45, 0, -0.35 - 0.2 * (1 - fwd));
    J.position.set(JH[0], JH[1] + 0.05 * Math.sin(t * 9), JH[2]); J.rotation.set(0, facing(JH, RC), 0);
    jo.pose({ breathe: jb, leg: [0.25, -0.2], armL: [lerp(2.85, 1.5, fwd), lerp(0.2, 0.05, fwd), lerp(0.4, 0.1, fwd)], armR: [lerp(2.85, 1.5, fwd), lerp(0.2, 0.05, fwd), lerp(0.4, 0.1, fwd)], lean: 0.15 * fwd }); fightFace({ mouth: t > 57.5 ? 'o' : 'flat', open: 1.1 });
    eyeGlow.forEach(g => { g.visible = true; g.material.opacity = 0.9; });
    const ck = seg(t, 55.9, 59.4);
    auraJ(1 + 0.6 * ck, t, 1 + 0.35 * ck); auraR(1 + 0.3 * ck, t);
    const hj = handsJ(), hr = handsR();
    orbAt(jOrb, fwd > 0 ? hj.clone().addScaledVector(new THREE.Vector3(RC[0] - JH[0], 0, RC[2] - JH[2]).normalize(), 0.4) : hj.clone().add(new THREE.Vector3(0, 0.45, 0)), 0.25 + 0.55 * ck, 1);
    orbAt(rOrb, hr.clone().add(new THREE.Vector3(JH[0] - RC[0], 0, JH[2] - RC[2]).normalize().multiplyScalar(0.6)), 0.4 + 1.0 * ck, 1);
    rocksAround([RC[0] - 2.5, 0.1, RC[2] + 1.0], 5, t, ck, 4.0);
    crack.material.opacity = 0.8; crater.visible = true;
    shake = 0.01 + 0.03 * ck;
    if (t < 59.6) {
      const fr = new THREE.Vector3(JH[0] - RC[0], 0, JH[2] - RC[2]).normalize(), pr = new THREE.Vector3(-fr.z, 0, fr.x);
      const rTop = [RC[0] + fr.x * 9 + pr.x * 2.5, 4.6, RC[2] + fr.z * 9 + pr.z * 2.5], rLook = [RC[0] + fr.x * 1.5, 4.6, RC[2] + fr.z * 1.5];
      const jB = [JH[0] - fr.x * 3.4 + pr.x * 0.9, JH[1] + 1.3, JH[2] - fr.z * 3.4 + pr.z * 0.9], jLook = [JH[0], JH[1] + 1.9, JH[2]];
      const z = sm((t - 55.9) / 3.7); split = { top: [mix3(rTop, mix3(rTop, rLook, 0.25), z), rLook, 56], bot: [mix3(jB, mix3(jB, jLook, 0.2), z), jLook, 52] };
      camPos = jB; camLook = jLook;
    } else { const m = [(JH[0] + RC[0]) / 2, 4.4, (JH[2] + RC[2]) / 2]; const fr = new THREE.Vector3(RC[0] - JH[0], 0, RC[2] - JH[2]).normalize(); camPos = [m[0] - fr.z * 12.5, 3.2, m[2] + fr.x * 12.5]; camLook = m; camera.fov = 60; }
    ov.bars = true; jBar = 0.55 + 0.45 * ck; rBar = 1; ov.power = t > 56.2 && t < 59.6;
  } else if (t < 67.0) { // ======== CHOQUE DE RAIOS ========
    robot.position.set(...RC); robot.rotation.y = facing(RC, JH); robot.scale.setScalar(3.2); eyeMat.emissiveIntensity = 12; antMat.emissiveIntensity = 7;
    rarms[0].rotation.set(-1.45, 0, 0.35); rarms[1].rotation.set(-1.45, 0, -0.35);
    J.position.set(JH[0], JH[1] + 0.04 * Math.sin(t * 13), JH[2]); J.rotation.set(0, facing(JH, RC), 0);
    jo.pose({ breathe: jb, leg: [0.35, -0.25], armL: [1.5, 0.05, 0.1], armR: [1.5, 0.05, 0.1], lean: 0.2 }); fightFace({ mouth: 'o', open: 1.15, brow: -0.6 });
    eyeGlow.forEach(g => { g.visible = true; g.material.opacity = 0.9; });
    const surge = seg(t, 64.3, 64.7);
    auraJ(1.4 + 0.5 * surge, t, 1.3 + 0.3 * surge); auraR(1.3, t);
    const a = handsJ(), b = handsR();
    let c = 0.5 + 0.015 * Math.sin(t * 17);
    if (t > 62.5) c = lerp(0.5, 0.3, seg(t, 62.5, 63.8)) + 0.015 * Math.sin(t * 17);
    if (t > 64.3) c = lerp(0.3, 0.62, seg(t, 64.3, 65.8)) + 0.015 * Math.sin(t * 17);
    if (t > 65.8) c = 0.55 + 0.07 * Math.sin(t * 23) + 0.04 * Math.sin(t * 37);
    const ext = seg(t, 61.0, 61.3);
    const cp = a.clone().lerp(b, c);
    setBig(gBeam, a, a.clone().lerp(cp, ext), 1, 1.0 + 0.4 * surge, t); setBig(rBeam, b, b.clone().lerp(cp, ext), 1, 1.3, t);
    const unst = seg(t, 65.8, 67.0);
    if (ext >= 1) { ball.forEach((m, i) => { m.visible = true; m.position.copy(cp); m.scale.setScalar([0.8, 1.3, 1.1][i] * (1 + 0.8 * unst) * (1 + 0.12 * Math.sin(t * 50 + i))); m.material.opacity = [1, 0.5, 0.35][i]; });
      for (let i = 0; i < 10; i++) { const s = Math.floor(t * 18) + i * 13; const d = new THREE.Vector3(hash(s) - 0.5, hash(s + 4) - 0.35, hash(s + 8) - 0.5).normalize().multiplyScalar((1.6 + 1.6 * hash(s + 2)) * (1 + unst)); setArc(i, cp, cp.clone().add(d), s, 0.9, i % 2 ? '#ffe066' : '#ff8fa3'); } }
    clashLight.position.copy(cp); clashLight.intensity = 25 + 25 * unst;
    rocksAround([cp.x, 0.1, cp.z], 5, t, 1, 4.5); crater.visible = true; crack.material.opacity = 0.9;
    for (let i = 0; i < 10; i++) { const ph = (t * 0.6 + hash(i)) % 1; puff(i, [cp.x + (hash(i) - 0.5) * 6, ph * 1.5, cp.z + (hash(i + 3) - 0.5) * 6], ph, 1.6, '#4a4048'); }
    shake = 0.03 + 0.05 * unst + (t > 61.25 && t < 61.5 ? 0.08 : 0);
    if (t > 61.25 && t < 61.4) { flash = 0.7; impact = t < 61.32; }
    const fr = new THREE.Vector3(RC[0] - JH[0], 0, RC[2] - JH[2]).normalize(), pr = new THREE.Vector3(-fr.z, 0, fr.x);
    if (t < 62.0) { camPos = [cp.x + pr.x * 13, cp.y - 0.4, cp.z + pr.z * 13]; camLook = [cp.x, cp.y + 0.3, cp.z]; camera.fov = 62; }
    else if (t < 62.98) { camPos = [JH[0] - fr.x * 3.6 + pr.x * 2.6, JH[1] + 3.4, JH[2] - fr.z * 3.6 + pr.z * 2.6]; camLook = [cp.x, cp.y, cp.z]; camera.fov = 58; roll = 0.1; }
    else if (t < 64.2) { const h = headR(); camPos = [h.x + fr.x * 2.8 - pr.x * 2.2, h.y + 1.4, h.z + fr.z * 2.8 - pr.z * 2.2]; camLook = [cp.x, cp.y, cp.z]; camera.fov = 58; roll = -0.1; }
    else if (t < 65.2) { const h = headJ(); const z = lerp(4.4, 3.6, sm((t - 64.2))); camPos = [h.x + fr.x * z * 0.9 + pr.x * z * 0.45, h.y + 0.1, h.z + fr.z * z * 0.9 + pr.z * z * 0.45]; camLook = [h.x, h.y - 0.4, h.z]; camera.fov = 52; }
    else if (t < 66.0) { const h = headR(); camPos = [h.x - fr.x * 4.2 + pr.x * 1.2, h.y - 0.2, h.z - fr.z * 4.2 + pr.z * 1.2]; camLook = [h.x, h.y - 0.3, h.z]; camera.fov = 50; eyeMat.emissiveIntensity = 14 + 6 * Math.sin(t * 30); }
    else { const z = lerp(7.5, 3.2, sm(t - 66.0)); camPos = [cp.x + pr.x * z, cp.y + 0.3, cp.z + pr.z * z]; camLook = [cp.x, cp.y, cp.z]; camera.fov = 58; ov.slow = true; roll = 0.06 * Math.sin(t * 9); }
    ov.bars = true; jBar = c; rBar = 1 - c; ov.lb = true;
    if (t > 64.3 && t < 64.9) ov.fx = ['HAAA!', seg(t, 64.3, 64.45), '#ffd60a', 50, 17, 200];
  } else if (t < 69.3) { // ======== EXPLOSÃO ========
    J.visible = false; robot.visible = false; car.visible = false;
    const cp = [-2.6, 4.4, 0.7];
    const k = lin(t, 67.0, 68.6);
    fireAt(0, cp, k, 16); fireAt(1, cp, lin(t, 67.1, 68.9), 11); fireAt(2, [cp[0] + 3, cp[1] - 2, cp[2] + 1], lin(t, 67.2, 68.8), 8); fireAt(3, [cp[0] - 3, cp[1] - 1, cp[2] - 1], lin(t, 67.3, 69.0), 8);
    fireLight.position.set(...cp); fireLight.intensity = 60 * (1 - k);
    for (let i = 0; i < 34; i++) { const a = hash(i) * 6.28, b = (hash(i + 3) - 0.3) * 1.4; const r = 4 + 12 * Math.sqrt(lin(t, 67.7, 69.3)); puff(i, [cp[0] + Math.cos(a) * Math.cos(b) * r, Math.max(0.5, cp[1] + Math.sin(b) * r), cp[2] + Math.sin(a) * Math.cos(b) * r], t < 67.7 ? 0 : 0.3 + 0.5 * lin(t, 67.7, 69.3), 4.5, '#575058'); }
    ringAt(0, [cp[0], 0.1, cp[2]], t - 67.0, 22, [Math.PI / 2, 0, 0], 1.4, '#fff1c4');
    camPos = [cp[0] + 18, 6.0, cp[2] + 5]; camLook = cp; camera.fov = 62;
    flash = t < 67.3 ? 1 : Math.max(0, 1 - (t - 67.3) * 2.5) * 0.6; shake = 0.25 * Math.max(0, 1 - (t - 67) * 0.8);
    ov.fx = t > 67.25 && t < 68.4 ? ['KA-BOOM!', seg(t, 67.25, 67.45), '#ffb703', 50, 28, 180] : null;
  } else if (t < 71.8) { // ======== a fumaça baixa ========
    robot.visible = false;
    J.position.set(...JK); J.rotation.set(0, facing(JK, RS), 0);
    jo.pose({ breathe: 0.03 * Math.sin(t * 6), leg: [1.2, 1.2], armL: [1.4, 0.4, 1.6], armR: [0.2, 0.5, 0.4], lean: 0.35 }); jo.face({ open: 0.7, mouth: 'o', brow: 0.3, look: [0.3, 0] });
    jo.mats.skin.emissiveIntensity = 0.15; auraJ(0.9 * Math.max(0, Math.sin(t * 9)) * (1 - seg(t, 69.6, 70.6)), t);
    for (let i = 0; i < 34; i++) { const ph = (t * 0.08 + hash(i)) % 1; puff(i, [JK[0] + (hash(i) - 0.3) * 10 + t * 0.2, 0.4 + hash(i + 2) * 2.5, JK[2] + (hash(i + 5) - 0.6) * 9], 0.2 + 0.3 * ph, 3.0, '#6e6872'); }
    { const fr = new THREE.Vector3(RS[0] - JK[0], 0, RS[2] - JK[2]).normalize(); const z = lerp(4.6, 3.8, sm((t - 69.3) / 2.5)); camPos = [JK[0] + fr.x * z + fr.z * 1.2, 1.0, JK[2] + fr.z * z - fr.x * 1.2]; camLook = [JK[0], 1.5, JK[2]]; camera.fov = 58; }
  } else if (t < 75.7) { // ======== o robô copia o rosto e foge ========
    J.position.set(...JK); J.rotation.set(0, facing(JK, RS), 0);
    jo.pose({ breathe: 0.02 * Math.sin(t * 5), leg: [1.2, 1.2], armL: [1.4, 0.4, 1.6], armR: [0.2, 0.5, 0.4], lean: 0.25 }); jo.mats.skin.emissiveIntensity = 0.15;
    jo.face({ open: 1.1, mouth: 'o', brow: 1.0, look: [0.4, t > 74.3 ? 0.8 : 0] });
    robot.position.set(...RS); robot.rotation.y = facing(RS, JK); eyeMat.emissiveIntensity = 9;
    for (let i = 0; i < 26; i++) { const ph = (t * 0.08 + hash(i)) % 1; puff(i, [JK[0] + (hash(i) - 0.3) * 10, 0.4 + hash(i + 2) * 2.2, JK[2] + (hash(i + 5) - 0.6) * 9 - 2], 0.3 + 0.3 * ph, 3.0, '#6e6872'); }
    const scan = lin(t, 71.9, 72.8);
    if (t > 71.9 && t < 72.9) { scene.updateMatrixWorld(true); rhead.localToWorld(e1.set(0, 0.06, 0.3)); const h = headJ(); const tp = new THREE.Vector3(h.x, lerp(h.y + 1.1, 0.1, scan), h.z); setEyeBeam(eyeBeams[0], e1.clone(), tp, 0.8); ringAt(3, [JK[0], lerp(h.y + 1.1, 0.1, scan), JK[2]], 0.1, 1.2, [Math.PI / 2, 0, 0], 1.0, '#ff2d55'); rings[3].material.opacity = 0.9; }
    const swap = t > 73.15;
    robot.visible = !swap;
    if (t > 73.0 && t < 73.3) flash = 0.5;
    if (swap) {
      J2b.visible = true; jo2.head.scale.setScalar(2.55); jo2.mats.skin.emissive.set('#ffb703'); jo2.mats.skin.emissiveIntensity = 0.3;
      const fly = Math.pow(lin(t, 74.3, 75.4), 1.7);
      const fp = mix3([RS[0], 0.86, RS[2]], [RS[0] - 4, 11, RS[2] + 12], fly);
      J2b.position.set(...fp); J2b.rotation.set(-0.8 * fly, facing(RS, JK) + 3.0 * fly, 0);
      jo2.pose({ leg: [-0.2 * fly, 0.3 * fly], armL: [lerp(0.1, 3.0, fly), 0.2, 0.2], armR: [0.1, 0.2, 0.3] });
      jo2.face({ open: 0.75, mouth: 'smile', brow: -0.6, browTilt: -0.5, look: [0.2, 0] });
      glint.material.opacity = t > 73.6 && t < 74.25 ? 0.9 * Math.abs(Math.sin((t - 73.6) * 9)) : 0;
      if (fly > 0) { trail.visible = true; trail.position.set(...mix3([RS[0], 1.5, RS[2]], fp, 0.6)); trail.scale.set(0.3, 0.3, 0.4 + 2.5 * fly); trail.lookAt(J2b.position); trail.material.opacity = 0.4; }
    }
    if (t < 73.25) { const m = [(JK[0] + RS[0]) / 2, 1.3, (JK[2] + RS[2]) / 2]; camPos = [m[0] + 0.6, 3.2, m[2] + 10.5]; camLook = m; camera.fov = 58; }
    else if (t < 74.3) { scene.updateMatrixWorld(true); jo2.head.getWorldPosition(q1); const d = new THREE.Vector3(Math.sin(J2b.rotation.y), 0, Math.cos(J2b.rotation.y)); const z = lerp(3.4, 2.7, sm(t - 73.25)); camPos = [q1.x + d.x * z, q1.y + 0.05, q1.z + d.z * z]; camLook = [q1.x, q1.y - 0.05, q1.z]; camera.fov = 46; }
    else { camPos = [JK[0] + 4.0, 0.8, JK[2] + 1.0]; camLook = [RS[0] - 2.0, 4.0, RS[2] + 4]; camera.fov = 68; }
    ov.copia = t > 71.9 && t < 73.2 ? 1 : 0; ov.copiaTxt = t < 72.8 ? 'COPIANDO ROSTO... ' + Math.floor(scan * 100) + '%' : 'ROSTO COPIADO 100%';
  } else if (t < 78.0) { // ======== perseguição no céu escuro ========
    robot.visible = false; crater.visible = false;
    const k = lin(t, 75.7, 78.0);
    const jp = mix3([-4, 6.5, -1], [0.5, 5.0, 9.0], k);
    J.position.set(...jp); J.rotation.set(1.15, Math.atan2(4.5, 10), 0);
    jo.pose({ leg: [-0.1, 0.25], armR: [3.0, 0.05, 0.0], armL: [0.3, 0.4, 0.3] }); fightFace({ look: [0, 0.6] }); auraJ(0.9, t);
    camPos = [jp[0] + 7.5, jp[1] + 2.5, jp[2] - 4.0]; camLook = [jp[0], jp[1] + 0.5, jp[2] + 1.0]; camera.fov = 55; roll = 0.1;
    ov.speed = 0.8;
    J2b.visible = true; jo2.head.scale.setScalar(2.55); jo2.mats.skin.emissiveIntensity = 0.3; J2b.position.set(jp[0] + 1.5, jp[1] - 0.6, jp[2] + 9); J2b.rotation.set(1.15, 0.3, 0); jo2.pose({ armR: [3.0, 0, 0] });
  } else { // ======== a casa: a mãe abre a porta e vê dois Josephs ========
    robot.visible = false; crater.visible = false; car.visible = false; pole.visible = false;
    mom.root.visible = true; mom.root.position.set(...MOM); mom.root.rotation.set(0, Math.PI, 0); mom.head.scale.setScalar(1);
    const op = seg(t, 78.4, 79.4); doorL.rotation.y = 1.5 * op;
    mom.pose({ breathe: breath(t, 1), armR: [1.1, 0.1, 1.2], armL: [t > 81.2 ? 1.6 : 0.2, 0.3, t > 81.2 ? 2.2 : 0.3] });
    scene.updateMatrixWorld(true); lantern.getWorldPosition(q1); lanternLight.position.copy(q1); lanternLight.intensity = 8 * op;
    homeFill.position.set(0, 6, 6); homeFill.intensity = 4;
    const shock = t > 81.1;
    mom.face({ open: shock ? 1.4 : blink(t), mouth: shock ? 'o' : 'flat', brow: shock ? 1.2 : 0.2, look: [shock ? (Math.floor(t * 2.5) % 2 ? 0.8 : -0.8) : 0, -0.2] });
    J2b.visible = true; jo2.head.scale.setScalar(2.55); jo2.mats.skin.emissive.set('#ffb703'); jo2.mats.skin.emissiveIntensity = 0.3;
    J2b.position.set(...FJp); J2b.rotation.set(0, 0, 0); jo2.pose({ breathe: breath(t, 2), armL: [0.1, 0.15, 0.3], armR: [0.1, 0.15, 0.3] }); jo2.face({ open: blink(t, 1.3), mouth: 'flat', brow: 0, look: [0, 0.1] });
    const land = lin(t, 80.8, 81.05);
    J.visible = t > 80.6; J.position.set(RJp[0], lerp(7, 0.86, land), RJp[2]); J.rotation.set(0, 0, 0);
    jo.pose({ breathe: jb, leg: t < 81.05 ? [0.3, -0.2] : [0, 0], armL: [0.1, 0.15, 0.3], armR: [0.1, 0.15, 0.3] }); jo.face({ open: blink(t), mouth: 'flat', brow: 0, look: [0, 0.1] }); jo.mats.skin.emissiveIntensity = 0.3;
    auraJ(t < 81.4 ? 0.8 * (1 - lin(t, 81.05, 81.4)) : 0, t);
    ringAt(0, [RJp[0], 0.06, RJp[2]], t - 81.05, 3, [Math.PI / 2, 0, 0], 0.6, '#ffe9c4');
    for (let i = 0; i < 8; i++) { const a = i * 0.8; puff(i, [RJp[0] + Math.cos(a) * (0.5 + 1.6 * lin(t, 81.05, 82)), 0.3, RJp[2] + Math.sin(a) * (0.5 + 1.6 * lin(t, 81.05, 82))], lin(t, 81.05, 82.2), 0.9, '#7a7480'); }
    if (t > 81.05 && t < 81.25) shake = 0.06;
    glint.material.opacity = t > 83.7 && t < 84.0 ? 0.9 : 0;
    if (t < 82.0) { camPos = t < 80.8 ? mix3([2.7, 2.0, 2.0], [2.4, 1.9, 2.8], sm((t - 78) / 2.8)) : [7.5, 6.0, -1.0]; camLook = [0, 1.0, 9.5]; camera.fov = t < 80.8 ? 40 : 46; }
    else if (t < 82.9) { camPos = [0.35, 2.1, 11.3]; camLook = [0, 2.1, 13.35]; camera.fov = 48; }
    else { const z = lerp(12.9, 12.3, sm((t - 82.9) / 10)); camPos = [0, 2.5, z]; camLook = [0, 2.0, 5.9]; camera.fov = 62; lanternLight.position.set(0.4, 2.2, 12.6); }
    ov.qual = t > 82.9 && t < 84.4 ? seg(t, 82.9, 83.15) : 0;
    ov.cta = seg(t, 84.5, 84.8) * (1 - seg(t, 88.3, 88.5)); ov.end = seg(t, 88.4, 88.7);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll);
  sky.position.copy(camera.position);
  if (split) {
    renderer.setScissorTest(true);
    const draw = (c, y) => { camera.fov = c[2]; camera.aspect = W / (H / 2); camera.updateProjectionMatrix(); cam(c[0], c[1], shake, t); sky.position.copy(camera.position); renderer.setViewport(0, y, W, H / 2); renderer.setScissor(0, y, W, H / 2); renderer.render(scene, camera); };
    draw(split.top, H / 2); draw(split.bot, 0);
    renderer.setScissorTest(false); renderer.setViewport(0, 0, W, H); camera.aspect = W / H;
  } else renderer.render(scene, camera);

  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : ov.recap ? 'grayscale(0.85) contrast(1.05)' : ov.slow ? 'saturate(0.65) contrast(1.15)' : '';
  $('burst').style.opacity = impact ? 1 : 0;
  $('flash').style.opacity = flash;
  $('lb').style.opacity = (ov.slow || ov.lb) ? 1 : 0;
  $('speed').style.opacity = ov.speed || 0; $('speed').style.transform = `rotate(${(Math.floor(t * 30) % 7) * 3}deg) scale(1.6)`;
  $('vlines').style.opacity = ov.vlines || 0; $('vlines').style.backgroundPosition = `0 ${Math.floor(t * 30) * 140}px`;
  $('split').style.opacity = split ? 1 : 0;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); if (!e) return; e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('recap', ov.recap ? 1 : 0); pop('hook', ov.hook && t < 3.3 ? ov.hook : 0); pop('day', ov.day || 0); pop('tk', ov.tk && t < 18.9 ? ov.tk : 0); pop('apagao', ov.apagao || 0);
  pop('qual', ov.qual || 0); pop('cta', ov.cta || 0); pop('end', ov.end || 0);
  const qi = $('qib'); qi.style.opacity = ov.qi ? 1 : 0; qi.style.transform = `translateX(-50%) scale(${0.5 + 0.5 * back(ov.qi || 0)})`;
  const cp2 = $('copia'); cp2.style.opacity = ov.copia ? 1 : 0; cp2.textContent = ov.copiaTxt || ''; cp2.style.color = (ov.copiaTxt || '').includes('100%') ? '#ff2d55' : '#ff8fa3';
  const pw = $('power'); pw.style.opacity = ov.power ? 1 : 0;
  const fx = $('fx'); if (ov.fx) { const [txt, k, col, x, y, size] = ov.fx; fx.style.opacity = 1; fx.textContent = txt; fx.style.left = x + '%'; fx.style.top = y + '%'; fx.style.fontSize = size + 'px'; fx.style.color = col; fx.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fx.style.opacity = 0;
  const bars = $('bars'); bars.style.opacity = ov.bars ? 1 : 0; $('bj').style.width = (clamp(jBar) * 100) + '%'; $('br').style.width = (clamp(rBar) * 100) + '%';
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cpx = $('cap'); cpx.textContent = c ? c.s : ''; cpx.style.opacity = c ? 1 : 0; cpx.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
