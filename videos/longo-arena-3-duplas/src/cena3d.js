// VÍDEO LONGO "Arena Galáctica 3: O Torneio das Duplas" (16:9). Base: Arena 2 + Mixamo.
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, hemi, sun, winLight, lampLight, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, cam, ampAt
} from '../../_lib/mundo3d.js';
import { makeFX } from '../../_lib/fx3d.js';

const roomObjs = scene.children.filter(o => o.isMesh || o.isGroup);
const setRoom = on => roomObjs.forEach(o => o.visible = on);
const ADD = (c, o = 0) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false });
const ns = m => { m.castShadow = false; m.receiveShadow = false; return m; };
const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const UP = new THREE.Vector3(0, 1, 0), v = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
const facing = (a, b) => Math.atan2(b[0] - a[0], b[2] - a[2]);
const $ = id => document.getElementById(id);
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };

// ================= PERSONAGENS =================
const jo = makeChar(); const J = jo.root;
const braceMat = new THREE.MeshStandardMaterial({ color: '#0b2a3a', emissive: '#00e5ff', emissiveIntensity: 2 });
const brace = mesh(new THREE.TorusGeometry(0.125, 0.045, 10, 28), braceMat, jo.arms[0].el, [0, -0.24, 0], [Math.PI / 2, 0, 0]);
const fist = ns(mesh(sph(1, 20, 14), ADD('#7df9ff'), scene)), fistIn = ns(mesh(sph(1, 16, 12), ADD('#ffffff'), scene));
const shield = ns(mesh(sph(1, 32, 20), ADD('#00e5ff'), scene)), shieldRim = ns(mesh(new THREE.TorusGeometry(1, 0.04, 8, 48), ADD('#ffffff'), scene));
const jGhosts = []; for (let i = 0; i < 6; i++) { const g = grp(scene); ns(mesh(cap(0.42, 0.5), ADD('#7df9ff'), g, [0, 0.45, 0])); ns(mesh(sph(0.45, 16, 12), ADD('#7df9ff'), g, [0, 1.3, 0])); jGhosts.push(g); }
const setGhost = (g, p, op, col) => { g.visible = op > 0.01; g.position.set(...p); g.children.forEach(m => { m.material.opacity = op; if (col) m.material.color.set(col); }); };
const cyanLight = new THREE.PointLight('#00e5ff', 0, 8, 1.4); scene.add(cyanLight);
// Zib (alienígena pequeno)
const zb = makeChar({ skin: '#7bd389', hood: '#ff9f1c', hood2: '#e07b00', pants: '#264653', hair: '#6cc47d', sole: '#ff9f1c' }); const Z = zb.root;
zb.head.scale.setScalar(1.45);
zb.eyes.forEach(e => e.children.forEach(c => c.scale.multiplyScalar(1.4)));
for (const s of [-1, 1]) { mesh(cap(0.022, 0.34), M('#5fb878'), zb.head, [s * 0.17, 0.55, 0], [0, 0, -s * 0.35]); mesh(sph(0.075, 12, 10), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffd60a', emissiveIntensity: 1.5 }), zb.head, [s * 0.27, 0.76, 0]); }
const mop = grp(zb.handR); mesh(cap(0.03, 1.5), M('#8d6e63'), mop, [0, -0.2, 0.25], [1.2, 0, 0]); mesh(rbox(0.5, 0.12, 0.22, 0.04), M('#cfd8dc'), mop, [0, -0.5, 1.0], [1.2, 0, 0]);

// apresentador (olho flutuante)
const host = grp(scene, [0, 9.5, -2]);
const hostBody = mesh(sph(1.1, 28, 20), M('#7b2cbf', { roughness: 0.35, metalness: 0.2 }), host);
mesh(sph(0.62, 24, 16), M('#ffffff', { roughness: 0.2 }), host, [0, 0.1, 0.72]);
const hostIris = mesh(sph(0.32, 20, 14), new THREE.MeshStandardMaterial({ color: '#ffd60a', emissive: '#ffb703', emissiveIntensity: 1.2 }), host, [0, 0.1, 1.12], [0, 0, 0], [1, 1, 0.5]);
mesh(sph(0.15, 14, 10), M('#111'), host, [0, 0.1, 1.27], [0, 0, 0], [1, 1, 0.5]);
const hostHalo = ns(mesh(new THREE.TorusGeometry(1.6, 0.05, 8, 48), ADD('#c77dff', 0.8), host, [0, 0, 0], [Math.PI / 2, 0, 0]));
const tents = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const g = grp(host, [Math.cos(a) * 0.7, -0.8, Math.sin(a) * 0.7]); mesh(cap(0.12, 0.8), M('#5a189a'), g, [0, -0.5, 0]); mesh(cap(0.08, 0.6), M('#5a189a'), g, [0, -1.25, 0]); tents.push(g); }
const rockM = new THREE.MeshStandardMaterial({ color: '#6d6875', roughness: 0.95, flatShading: true });
const lava = new THREE.MeshStandardMaterial({ color: '#331100', emissive: '#ff6d00', emissiveIntensity: 2.2 });
// ================= ARENA =================
const arena = grp(scene);
const skyTex = canvasTex(1024, 512, (x, w, h) => {
  const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#05021a'); g.addColorStop(0.45, '#2a0f5c'); g.addColorStop(0.55, '#5b1a7a'); g.addColorStop(1, '#0a0418'); x.fillStyle = g; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const cx = hash(i) * w, cy = h * (0.15 + 0.5 * hash(i + 9)), r = 60 + 160 * hash(i + 3); const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r); const col = ['rgba(255,80,180,', 'rgba(80,160,255,', 'rgba(160,90,255,', 'rgba(255,170,80,'][i % 4]; rg.addColorStop(0, col + '0.35)'); rg.addColorStop(1, col + '0)'); x.fillStyle = rg; x.fillRect(0, 0, w, h); }
  for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * hash(i + 77)})`; const s = hash(i + 5) < 0.95 ? 1.5 : 3; x.fillRect(hash(i + 1) * w, hash(i + 2) * h * 0.75, s, s); }
});
const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, toneMapped: false });
const sky = ns(mesh(sph(48, 48, 24), skyMat, scene)); sky.renderOrder = -1;
const planetTex = canvasTex(256, 128, (x, w, h) => { for (let y = 0; y < h; y++) { const k = y / h; x.fillStyle = `hsl(${20 + 25 * Math.sin(k * 18)}, 70%, ${40 + 18 * Math.sin(k * 9 + 1)}%)`; x.fillRect(0, y, w, 1); } });
const planet = ns(mesh(sph(7, 40, 24), new THREE.MeshBasicMaterial({ map: planetTex, toneMapped: false }), sky, [-22, 14, -34]));
ns(mesh(new THREE.TorusGeometry(11, 0.9, 2, 64), new THREE.MeshBasicMaterial({ color: '#e9c46a', transparent: true, opacity: 0.55, toneMapped: false }), planet, [0, 0, 0], [1.2, 0.3, 0]));
ns(mesh(sph(3, 30, 20), new THREE.MeshBasicMaterial({ color: '#7df9ff', toneMapped: false }), sky, [26, 20, -30]));
mesh(new THREE.CircleGeometry(15, 72), M('#1b1f2e', { metalness: 0.5, roughness: 0.35 }), arena, [0, 0.01, 0], [-Math.PI / 2, 0, 0]);
const floorRings = [4, 8, 12].map(r => ns(mesh(new THREE.TorusGeometry(r, 0.05, 6, 96), ADD('#00e5ff', 0.7), arena, [0, 0.03, 0], [Math.PI / 2, 0, 0])));
ns(mesh(new THREE.RingGeometry(1.4, 1.6, 6), ADD('#c77dff', 0.8), arena, [0, 0.03, 0], [-Math.PI / 2, 0, 0]));
mesh(new THREE.CylinderGeometry(15, 15, 2.4, 96, 1, true), M('#2b2d42', { side: THREE.DoubleSide, metalness: 0.4, roughness: 0.5 }), arena, [0, 1.2, 0]);
ns(mesh(new THREE.TorusGeometry(15, 0.08, 6, 120), ADD('#ff2d95', 0.9), arena, [0, 2.4, 0], [Math.PI / 2, 0, 0]));
const TIERS = 6, NC = 900, seats = [];
for (let k = 0; k < TIERS; k++) {
  const r = 16.4 + k * 1.6, y = 1.6 + k * 1.35;
  mesh(new THREE.RingGeometry(r - 0.8, r + 0.8, 96), M('#22223b', { side: THREE.DoubleSide }), arena, [0, y, 0], [-Math.PI / 2, 0, 0]);
  mesh(new THREE.CylinderGeometry(r - 0.8, r - 0.8, 1.35, 96, 1, true), M('#2b2d42', { side: THREE.DoubleSide }), arena, [0, y - 0.67, 0]);
  const n = Math.floor(NC / TIERS); for (let i = 0; i < n; i++) seats.push([r, y, (i + (k % 2) * 0.5) / n * Math.PI * 2, hash(k * 1000 + i) * 6.28]);
}
const crowdBody = new THREE.InstancedMesh(cap(0.24, 0.35), new THREE.MeshStandardMaterial({ roughness: 0.7 }), seats.length);
const crowdHead = new THREE.InstancedMesh(sph(0.24, 10, 8), new THREE.MeshStandardMaterial({ roughness: 0.6 }), seats.length);
const PAL = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c', '#c77dff', '#4cc9f0', '#f72585', '#80ed99'];
seats.forEach((s, i) => { const c = new THREE.Color(PAL[i % PAL.length]); crowdBody.setColorAt(i, c); crowdHead.setColorAt(i, c.clone().offsetHSL(0.05, 0, 0.1)); });
arena.add(crowdBody, crowdHead); crowdBody.castShadow = crowdHead.castShadow = false;
const mtx = new THREE.Matrix4(), qq = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), ps = new THREE.Vector3();
function crowd(t, ex) {
  seats.forEach(([r, y, a, ph], i) => {
    const b = ex * Math.abs(Math.sin(t * 7 + ph)) * 0.35 + 0.03 * Math.sin(t * 2 + ph);
    ps.set(Math.cos(a) * r, y + 0.45 + b, Math.sin(a) * r); mtx.compose(ps, qq, sc); crowdBody.setMatrixAt(i, mtx);
    ps.y += 0.55; mtx.compose(ps, qq, sc); crowdHead.setMatrixAt(i, mtx);
  });
  crowdBody.instanceMatrix.needsUpdate = crowdHead.instanceMatrix.needsUpdate = true;
}
const spots = []; for (let i = 0; i < 6; i++) { const c = ns(mesh(new THREE.ConeGeometry(2.6, 24, 24, 1, true), ADD(['#ff2d95', '#00e5ff', '#ffd60a'][i % 3], 0.12), arena)); spots.push(c); }
function setSpots(t, k = 1, target = null) {
  spots.forEach((s, i) => { const a = i / 6 * Math.PI * 2 + 0.3; const top = new THREE.Vector3(Math.cos(a) * 24, 14, Math.sin(a) * 24); const tg = target ? target.clone() : new THREE.Vector3(Math.cos(t * 0.7 + i * 1.7) * 6, 0, Math.sin(t * 0.9 + i) * 6); const d = tg.sub(top); const L = d.length(); s.position.copy(top).addScaledVector(d, 0.5); s.quaternion.setFromUnitVectors(UP, d.clone().normalize().negate()); s.scale.set(1, L / 24, 1); s.material.opacity = 0.11 * k; });
}
const arenaLights = [new THREE.PointLight('#c77dff', 30, 40, 1.2), new THREE.PointLight('#00e5ff', 20, 40, 1.2), new THREE.PointLight('#ff9f6b', 18, 40, 1.2)];
arenaLights[0].position.set(0, 12, 6); arenaLights[1].position.set(-10, 8, -6); arenaLights[2].position.set(10, 8, -4); arenaLights.forEach(l => arena.add(l));
const beam = ns(mesh(new THREE.ConeGeometry(1, 1, 32, 1, true), ADD('#4cc9f0', 0.35), scene)); beam.material.side = THREE.DoubleSide;
const blueLight = new THREE.PointLight('#4cc9f0', 0, 12, 1.2); scene.add(blueLight);
function setBeam(top, bot, rBot, op) { const d = bot.clone().sub(top), L = d.length(); beam.visible = op > 0.01; beam.position.copy(top).addScaledVector(d, 0.5); beam.quaternion.setFromUnitVectors(UP, d.clone().normalize().negate()); beam.scale.set(rBot, L, rBot); beam.material.opacity = op; }
// ================= EFEITOS =================
const rings = []; for (let i = 0; i < 6; i++) rings.push(ns(mesh(new THREE.TorusGeometry(1, 0.06, 8, 64), ADD('#ffffff'), scene)));
function ringAt(i, p, age, R = 3, rot = [Math.PI / 2, 0, 0], dur = 0.6, col = '#ffffff') { const r = rings[i], k = age / dur; if (age < 0 || k > 1) { r.visible = false; return; } r.visible = true; r.position.set(...p); r.rotation.set(...rot); const s = 0.15 + R * Math.sqrt(k); r.scale.set(s, s, s); r.material.opacity = Math.pow(1 - k, 1.4); r.material.color.set(col); }
const smoke = []; for (let i = 0; i < 30; i++) smoke.push(ns(mesh(sph(0.5, 12, 10), new THREE.MeshStandardMaterial({ color: '#8a8290', transparent: true, opacity: 0, roughness: 1, depthWrite: false }), scene)));
function puff(i, p, k, R = 1.2, col) { const s = smoke[i]; if (k <= 0 || k >= 1) { s.visible = false; return; } s.visible = true; s.position.set(...p); s.scale.setScalar(R * (0.4 + 0.8 * Math.sqrt(k))); s.material.opacity = 0.6 * (1 - k); if (col) s.material.color.set(col); }
const sparks = []; for (let i = 0; i < 18; i++) sparks.push(ns(mesh(sph(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffd60a' : '#7df9ff', toneMapped: false }), scene)));
function burstSparks(c, k, R = 2, seed = 0) { sparks.forEach((s, i) => { const a = hash(i + seed) * 6.28, b = (hash(i + seed + 3) - 0.3) * 2; s.visible = k > 0 && k < 1; s.position.set(c[0] + Math.cos(a) * R * k, c[1] + b * R * k * 0.6, c[2] + Math.sin(a) * R * k); s.scale.setScalar(1.6 * (1 - k)); }); }
const rocks = []; for (let i = 0; i < 24; i++) rocks.push(mesh(new THREE.DodecahedronGeometry(0.08 + 0.14 * hash(i * 7)), rockM, scene));
function rockBurst(c, k, sp = 4, up = 5, seed = 0) { rocks.forEach((r, i) => { const a = hash(i + seed) * 6.28, s = sp * (0.4 + hash(i + seed + 3)); const y = 0.1 + up * hash(i + 5) * k - 6 * k * k; r.visible = k > 0 && y > 0; r.position.set(c[0] + Math.cos(a) * s * k, y, c[2] + Math.sin(a) * s * k); r.rotation.set(k * 9, k * 5, i); }); }
const motes = []; for (let i = 0; i < 24; i++) motes.push(ns(mesh(sph(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: '#7df9ff', toneMapped: false }), scene)));
const auraC = ns(mesh(sph(1, 28, 18), ADD('#00e5ff'), scene));
function auraJ(k, t) { if (k <= 0.01) return; scene.updateMatrixWorld(true); J.getWorldPosition(v); auraC.visible = true; auraC.position.set(v.x, v.y + 0.8, v.z); const f = 1 + 0.05 * Math.sin(t * 17); auraC.scale.set(1.25 * f, 2.0 * f, 1.25 * f); auraC.material.opacity = 0.18 * k; motes.forEach((m, i) => { const ph = (t * 0.8 + i / 24) % 1; m.visible = true; m.position.set(v.x + Math.cos(i * 2.4 + t) * 1.0, v.y - 0.8 + ph * 3.2, v.z + Math.sin(i * 2.4 + t) * 1.0); m.scale.setScalar(1.4 * (1 - ph) * k); }); cyanLight.position.set(v.x, v.y + 1, v.z + 1); cyanLight.intensity = 6 * k; }
const confetti = []; for (let i = 0; i < 140; i++) { const m = ns(mesh(new THREE.PlaneGeometry(0.16, 0.26), new THREE.MeshBasicMaterial({ color: PAL[i % PAL.length], side: THREE.DoubleSide, toneMapped: false }), scene)); confetti.push(m); }
const fw = []; for (let i = 0; i < 5 * 22; i++) fw.push(ns(mesh(sph(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: PAL[(i / 22 | 0) * 2 % PAL.length], toneMapped: false }), scene)));
function fireworks(t, t0) { for (let b = 0; b < 5; b++) { const tb = t0 + b * 0.55, k = (t - tb) / 1.6; const c = [(-8 + b * 4) * 1.4, 18 + 3 * hash(b), -12 - 6 * hash(b + 3)]; for (let j = 0; j < 22; j++) { const m = fw[b * 22 + j]; const a = j / 22 * 6.28, e = (hash(j + b) - 0.5) * 2; m.visible = k > 0 && k < 1; m.position.set(c[0] + Math.cos(a) * 5 * Math.sqrt(k), c[1] + e * 4 * Math.sqrt(k) - 3 * k * k, c[2] + Math.sin(a) * 5 * Math.sqrt(k)); m.scale.setScalar(2 * (1 - k)); } } }

// ================= LEGENDAS =================
let TL = null, caps = null;
const WHOCOL = { N: '#ffffff', J: '#ffe8a3', A: '#e0aaff', Z: '#9ef01a', V: '#ff8a8a', M: '#ffb347', S: '#c77dff' };
function buildCaps() {
  caps = [];
  for (const l of TL.lines) {
    const ps2 = l.text.match(/[^.?!:]+[.?!:]+|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean);
    const merged = []; for (const p of ps2) { if (merged.length && merged[merged.length - 1].length + p.length < 46) merged[merged.length - 1] += ' ' + p; else merged.push(p); }
    const tot = merged.reduce((a, s) => a + s.length, 0); let t0 = l.start;
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, who: l.who }); t0 += d; }
  }
}
const GUARD = { armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8] };
const PI2 = Math.PI / 2;
function arenaOn(t, ex = 0.5) {
  arena.visible = true; sky.visible = true; crowd(t, ex); setSpots(t);
  hemi.intensity = 0.55; hemi.color.set('#b8b0ff'); hemi.groundColor.set('#2b1d3a'); sun.intensity = 1.4; sun.color.set('#e6dcff'); winLight.intensity = 0; lampLight.intensity = 0;
  scene.background.set('#0a0418');
}
function hostAnim(t, talk) { host.visible = true; host.position.y = 9.5 + 0.25 * Math.sin(t * 1.3); host.rotation.y = 0.2 * Math.sin(t * 0.5); hostIris.material.emissiveIntensity = 1.2 + 3 * talk; hostIris.scale.set(1 + 0.25 * talk, 1 + 0.25 * talk, 0.5); hostHalo.rotation.z = t; tents.forEach((g, i) => g.rotation.set(0.25 * Math.sin(t * 2 + i), 0, 0.25 * Math.cos(t * 2.3 + i))); }

// ================= NOVOS PERSONAGENS =================
const wp = o => { scene.updateMatrixWorld(true); return o.getWorldPosition(new THREE.Vector3()).toArray(); };
const midW = (a, b) => { const p = wp(a), q = wp(b); return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2]; };
function holoOf(c, col) { const m = ADD(col, 0.4); c.root.traverse(o => { if (o.isMesh) { o.material = m; o.castShadow = false; o.receiveShadow = false; } }); c.holoMat = m; return c; }
const zH = holoOf(makeChar({}), '#4cc9f0'); zH.head.scale.setScalar(1.45);
const jH = holoOf(makeChar({}), '#ffd60a');
const holoCone = ns(mesh(new THREE.ConeGeometry(0.45, 0.6, 24, 1, true), ADD('#4cc9f0', 0.25), scene)); holoCone.material.side = THREE.DoubleSide;

// brutamontes musculoso (pés em y=0, de frente para +z, ~4,1 de altura)
function brute(o) {
  o = { skin: '#b23a48', skin2: '#5c1a24', eye: '#ffd60a', pairs: 1, ...o };
  const S = o.mat || M(o.skin, { roughness: 0.45 }), D = o.mat2 || M(o.skin2, { roughness: 0.6 });
  const b = { root: grp(scene), arms: [], S, D }; const B = b.body = grp(b.root);
  b.legs = [-1, 1].map(s => { const hip = grp(B, [s * 0.42, 1.6, 0]); mesh(cap(0.33, 0.6), D, hip, [0, -0.45, 0]); const knee = grp(hip, [0, -0.95, 0]); mesh(cap(0.27, 0.4), D, knee, [0, -0.3, 0]); mesh(sph(0.3, 16, 12), S, knee, [0, -0.05, 0.08]); mesh(rbox(0.55, 0.26, 0.8, 0.1), M('#1b1b1f'), knee, [0, -0.52, 0.12]); return { hip, knee }; });
  mesh(rbox(1.15, 0.42, 0.72, 0.16), D, B, [0, 1.62, 0]);
  const torso = b.torso = grp(B, [0, 1.75, 0]);
  mesh(cap(0.5, 0.5), S, torso, [0, 0.45, 0], [0, 0, 0], [1.15, 1, 0.8]);
  for (let i = 0; i < 6; i++) mesh(rbox(0.24, 0.2, 0.1, 0.06), S, torso, [(i % 2 ? 1 : -1) * 0.14, 0.2 + Math.floor(i / 2) * 0.24, 0.39]);
  const chest = b.chest = grp(torso, [0, 1.2, 0]);
  mesh(sph(0.75), S, chest, [0, 0, 0], [0, 0, 0], [1.45, 0.95, 0.9]);
  for (const s of [-1, 1]) { mesh(sph(0.45), S, chest, [s * 0.42, 0.02, 0.38], [0, 0, 0], [1.1, 0.8, 0.6]); mesh(sph(0.42), S, chest, [s * 0.5, 0.55, -0.1], [0, 0, 0], [1.2, 0.6, 1]); }
  const head = b.head = grp(chest, [0, 0.95, 0.12]);
  mesh(rbox(0.62, 0.62, 0.62, 0.22), S, head);
  b.jaw = mesh(rbox(0.6, 0.22, 0.52, 0.1), S, head, [0, -0.3, 0.06]);
  b.eyeM = new THREE.MeshStandardMaterial({ color: '#111', emissive: o.eye, emissiveIntensity: 1.6 });
  b.eyes = [-1, 1].map(s => mesh(sph(0.075, 12, 10), b.eyeM, head, [s * 0.15, 0.06, 0.31], [0, 0, 0], [1.5, 0.6, 0.5]));
  for (const s of [-1, 1]) mesh(rbox(0.24, 0.07, 0.08, 0.03), D, head, [s * 0.15, 0.17, 0.31], [0, 0, s * 0.35]);
  for (let p = 0; p < o.pairs; p++) for (const s of [-1, 1]) {
    const sh = grp(chest, [s * 1.05, 0.35 - p * 0.8, 0]); sh.rotation.order = 'XZY';
    mesh(sph(0.42), S, sh, [0, 0, 0]); mesh(cap(0.27, 0.55), S, sh, [0, -0.45, 0]); mesh(sph(0.29), S, sh, [0, -0.42, 0.12]);
    const el = grp(sh, [0, -0.9, 0]); mesh(cap(0.25, 0.5), S, el, [0, -0.35, 0]);
    const fm = D.clone(); const fistB = mesh(rbox(0.46, 0.46, 0.46, 0.14), fm, el, [0, -0.82, 0]);
    b.arms.push({ sh, el, fist: fistB, fm, s });
  }
  b.pose = (p = {}) => {
    p = { a: [], leg: [0, 0], knee: [0, 0], lean: 0, twist: 0, head: [0, 0, 0], jaw: 0, breathe: 0, ...p };
    b.arms.forEach((A, i) => { const q = p.a[i] || [0.15, 0.15, 0.35]; A.sh.rotation.set(-q[0], -A.s * (q[3] || 0), A.s * (0.22 + q[1])); A.el.rotation.set(-q[2], 0, 0); });
    b.legs.forEach((L, i) => { L.hip.rotation.set(-p.leg[i], 0, (i ? 1 : -1) * 0.07); L.knee.rotation.set(p.knee[i], 0, 0); });
    b.torso.rotation.set(p.lean, p.twist, 0); b.head.rotation.set(...p.head);
    b.jaw.position.y = -0.3 - 0.1 * p.jaw; b.jaw.rotation.x = 0.3 * p.jaw; b.chest.scale.setScalar(1 + p.breathe);
  };
  b.glow = (i, k) => { const A = b.arms[i]; A.fm.emissive.set('#ff0000'); A.fm.emissiveIntensity = 1.3 * k; };
  return b;
}
const allA = (n, q) => Array.from({ length: n }, () => q);

// GORRAK: quatro braços
const GK = brute({ skin: '#c0392b', skin2: '#5c1a24', eye: '#ffd60a', pairs: 2 });
for (const s of [-1, 1]) mesh(new THREE.ConeGeometry(0.06, 0.3, 10), M('#fff8e7'), GK.jaw, [s * 0.2, 0.2, 0.22]);
for (let i = 0; i < 5; i++) mesh(new THREE.ConeGeometry(0.08, 0.36, 8), M('#1b1b1f'), GK.head, [0, 0.38, 0.22 - i * 0.11], [-0.25 - i * 0.12, 0, 0]);
mesh(rbox(1.22, 0.2, 0.78, 0.06), M('#d4a017', { metalness: 0.7, roughness: 0.3 }), GK.body, [0, 1.48, 0]);

// MAGMOR: titã de lava
const magMat = new THREE.MeshStandardMaterial({ color: '#6b4a3c', emissive: '#c43a00', emissiveIntensity: 0.9, roughness: 0.9, flatShading: true });
const MG = brute({ mat: magMat, mat2: magMat, eye: '#fff3b0' });
const veinM = new THREE.MeshStandardMaterial({ color: '#ffb000', emissive: '#ffb000', emissiveIntensity: 3 });
for (let i = 0; i < 10; i++) mesh(new THREE.BoxGeometry(0.045, 0.28 + 0.2 * hash(i), 0.03), veinM, i < 6 ? MG.chest : MG.torso, [(hash(i + 4) - 0.5) * 1.0, (hash(i + 7) - 0.5) * 0.5 + (i < 6 ? 0 : 0.5), i < 6 ? 0.64 : 0.4], [0, 0, (hash(i + 2) - 0.5) * 1.6]);
for (let i = 0; i < 6; i++) mesh(new THREE.ConeGeometry(0.1, 0.4, 6), magMat, MG.head, [(i - 2.5) * 0.11, 0.38, -0.05], [0, 0, (i - 2.5) * 0.18]);
const crackM = new THREE.MeshBasicMaterial({ color: '#111', transparent: true, opacity: 0 });
const mCracks = []; for (let i = 0; i < 9; i++) mCracks.push(mesh(new THREE.BoxGeometry(0.035, 0.6 + 0.4 * hash(i + 30), 0.03), crackM, i < 5 ? MG.chest : MG.head, i < 5 ? [(hash(i + 11) - 0.5) * 1.2, (hash(i + 12) - 0.5) * 0.6, 0.72] : [(hash(i) - 0.5) * 0.4, 0, 0.33], [0, 0, (hash(i + 13) - 0.5) * 2]));

// VORG: o campeão
const VG = brute({ skin: '#3d405b', skin2: '#1b1d2e', eye: '#ff1f3d' });
for (const s of [-1, 1]) mesh(new THREE.ConeGeometry(0.09, 0.62, 12), M('#e9e3d5'), VG.head, [s * 0.3, 0.42, -0.05], [-0.3, 0, -s * 0.55]);
const armorM = M('#121212', { metalness: 0.85, roughness: 0.28 }), goldM = M('#d4a017', { metalness: 0.8, roughness: 0.25 });
VG.arms.forEach(A => { mesh(new THREE.SphereGeometry(0.52, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), armorM, A.sh, [0, 0.05, 0], [0, 0, -A.s * 0.25], [1.15, 0.85, 1.15]); mesh(new THREE.TorusGeometry(0.52, 0.04, 8, 40), goldM, A.sh, [0, 0.05, 0], [Math.PI / 2, 0, -A.s * 0.25], [1.15, 1.15, 1]); });
const emblemM = new THREE.MeshStandardMaterial({ color: '#300', emissive: '#ff1f3d', emissiveIntensity: 3 });
mesh(new THREE.OctahedronGeometry(0.2), emblemM, VG.chest, [0, 0.2, 0.74]);
mesh(rbox(1.22, 0.2, 0.78, 0.06), goldM, VG.body, [0, 1.48, 0]);

// ================= NOVOS EFEITOS =================
function mkRay(col) { const g = grp(scene); const outer = ns(mesh(new THREE.CylinderGeometry(1, 1, 1, 24, 1, true), ADD(col), g)); const core = ns(mesh(new THREE.CylinderGeometry(0.45, 0.45, 1, 16, 1, true), ADD('#ffffff'), g)); const head = ns(mesh(sph(1, 20, 14), ADD(col), g)); const headC = ns(mesh(sph(0.55, 16, 12), ADD('#ffffff'), g)); const root = ns(mesh(sph(1, 20, 14), ADD(col), g)); return { g, outer, core, head, headC, root }; }
const qq2 = new THREE.Quaternion();
function setRay(r, a, b, R, op, t) {
  r.g.visible = op > 0.01; if (!r.g.visible) return;
  e1.set(...a); e2.set(...b); const d = e2.clone().sub(e1); const L = Math.max(0.01, d.length()); const mid = e1.clone().addScaledVector(d, 0.5);
  qq2.setFromUnitVectors(UP, d.clone().normalize()); const w = R * (1 + 0.12 * Math.sin(t * 61) + 0.06 * Math.sin(t * 23));
  [r.outer, r.core].forEach(m => { m.position.copy(mid); m.quaternion.copy(qq2); m.scale.set(w, L, w); });
  r.outer.material.opacity = 0.55 * op; r.core.material.opacity = 0.95 * op;
  r.head.position.copy(e2); r.head.scale.setScalar(w * 1.9); r.head.material.opacity = 0.6 * op; r.headC.position.copy(e2); r.headC.scale.setScalar(w * 1.9); r.headC.material.opacity = 0.9 * op;
  r.root.position.copy(e1); r.root.scale.setScalar(w * 1.6); r.root.material.opacity = 0.6 * op;
}
const rayJ = mkRay('#ffd60a'), rayV = mkRay('#ff1f3d'), trail = mkRay('#ffd60a');
function mkBall(col) { return { o: ns(mesh(sph(1, 24, 16), ADD(col), scene)), i: ns(mesh(sph(0.55, 16, 12), ADD('#ffffff'), scene)) }; }
function setBall(B, p, r, op, t) { const on = op > 0.01 && r > 0.01; B.o.visible = B.i.visible = on; if (!on) return; const f = 1 + 0.1 * Math.sin(t * 47); B.o.position.set(...p); B.i.position.set(...p); B.o.scale.setScalar(r * f); B.i.scale.setScalar(r * f); B.o.material.opacity = 0.6 * op; B.i.material.opacity = 0.95 * op; }
const ballJ = mkBall('#ffd60a'), ballV = mkBall('#ff1f3d'), clashB = mkBall('#ffb703'), comet = mkBall('#ffd60a');
const dome = ns(mesh(sph(1, 40, 24), ADD('#fff3b0'), scene)), domeO = ns(mesh(sph(1, 40, 24), ADD('#ff9f1c'), scene));
function setDome(p, k, R, op = 1) { const on = k > 0 && k < 1; dome.visible = domeO.visible = on; if (!on) return; dome.position.set(...p); domeO.position.set(...p); const s = R * Math.sqrt(k); dome.scale.setScalar(s * 0.7); domeO.scale.setScalar(s); dome.material.opacity = op * Math.pow(1 - k, 1.5); domeO.material.opacity = 0.6 * op * Math.pow(1 - k, 1.2); }
function mkAura(col) { const s = ns(mesh(sph(1, 28, 18), ADD(col), scene)); const f = ns(mesh(new THREE.ConeGeometry(1, 1, 24, 1, true), ADD(col), scene)); f.material.side = THREE.DoubleSide; const ms = []; for (let i = 0; i < 22; i++) ms.push(ns(mesh(sph(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: col, toneMapped: false }), scene))); const L = new THREE.PointLight(col, 0, 14, 1.3); scene.add(L); return { s, f, ms, L }; }
function aura(A, c, h, k, t, col) {
  if (k <= 0.01) return;
  if (col) { A.s.material.color.set(col); A.f.material.color.set(col); A.L.color.set(col); A.ms.forEach(m => m.material.color.set(col)); }
  const fl = 1 + 0.07 * Math.sin(t * 23) + 0.04 * Math.sin(t * 37); A.s.visible = A.f.visible = true;
  A.s.position.set(c[0], c[1], c[2]); A.s.scale.set(h * 0.38 * fl, h * 0.6 * fl, h * 0.38 * fl); A.s.material.opacity = 0.13 * k;
  A.f.position.set(c[0], c[1] + h * 0.35, c[2]); A.f.scale.set(h * 0.45 * fl, h * 1.6 * fl, h * 0.45 * fl); A.f.rotation.y = t * 2; A.f.material.opacity = 0.1 * k;
  A.ms.forEach((m, i) => { const ph = (t * 1.1 + i / 22) % 1; m.visible = true; const a = i * 2.4 + t * 0.7; m.position.set(c[0] + Math.cos(a) * h * 0.42, c[1] - h * 0.45 + ph * h * 1.4, c[2] + Math.sin(a) * h * 0.42); m.scale.setScalar(h * 0.9 * (1 - ph) * k); });
  A.L.position.set(c[0], c[1] + h * 0.2, c[2] + h * 0.6); A.L.intensity = 6 * k;
}
const auJ = mkAura('#ffd60a'), auV = mkAura('#ff1f3d');
const auraGold = (k, t, col = '#ffd60a') => aura(auJ, [J.position.x, J.position.y + 0.5, J.position.z], 2.3, k, t, col);
const auraB = (b, k, t, col = '#ff1f3d') => { const s = b.root.scale.x; aura(auV, [b.root.position.x, b.root.position.y + 2.1 * s, b.root.position.z], 4.6 * s, k, t, col); };
const bolts = []; for (let i = 0; i < 8; i++) { const g = grp(scene); const m = ADD('#fff6a8', 1); const segs = []; for (let j = 0; j < 8; j++) segs.push(ns(mesh(new THREE.CylinderGeometry(1, 1, 1, 5), m, g))); bolts.push({ g, m, segs }); }
function bolt(i, a, b, seed, op, col = '#fff6a8', w = 0.045) {
  const B = bolts[i]; B.g.visible = op > 0.01; if (!B.g.visible) return; B.m.color.set(col); B.m.opacity = op;
  const n = B.segs.length, L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), pts = [];
  for (let j = 0; j <= n; j++) { const p = mix3(a, b, j / n); if (j > 0 && j < n) { p[0] += (hash(seed * 13 + j) - 0.5) * L * 0.22; p[1] += (hash(seed * 7 + j + 3) - 0.5) * L * 0.22; p[2] += (hash(seed * 5 + j + 9) - 0.5) * L * 0.22; } pts.push(p); }
  B.segs.forEach((s, j) => { e1.set(...pts[j]); e2.set(...pts[j + 1]); const d = e2.clone().sub(e1); const len = d.length(); s.position.copy(e1).addScaledVector(d, 0.5); s.quaternion.setFromUnitVectors(UP, d.normalize()); s.scale.set(w, len, w); });
}
function mkCracks() { const g = grp(scene); const m = new THREE.MeshBasicMaterial({ color: '#ff6a00', transparent: true, opacity: 1, toneMapped: false }); const dm = new THREE.MeshBasicMaterial({ color: '#08060c', transparent: true, opacity: 0.6, depthWrite: false }); const disc = ns(mesh(new THREE.CircleGeometry(1, 40), dm, g, [0, 0.015, 0], [-PI2, 0, 0])); const segs = []; for (let i = 0; i < 18; i++) { const b = ns(mesh(new THREE.BoxGeometry(1, 0.02, 0.07), m, g)); b.userData = { a: i / 18 * 6.28 + hash(i) * 0.3, L: 0.45 + 0.55 * hash(i + 5) }; segs.push(b); } return { g, m, dm, disc, segs }; }
function cracks(c, p, k, R, col = '#ff6a00', rot = [0, 0, 0]) {
  c.g.visible = k > 0.01; if (!c.g.visible) return; c.g.position.set(...p); c.g.rotation.set(...rot); c.m.color.set(col); c.m.opacity = Math.min(1, k * 2);
  c.disc.scale.setScalar(R * 0.35 * Math.min(1, k * 2)); c.dm.opacity = 0.6 * Math.min(1, k * 2);
  c.segs.forEach(b => { const { a, L } = b.userData; const len = R * L * Math.min(1, k * 1.5); b.scale.set(len, 1, 1); b.position.set(Math.cos(a) * len / 2, 0.025, Math.sin(a) * len / 2); b.rotation.set(0, -a, 0); });
}
const crk = [mkCracks(), mkCracks(), mkCracks()];
const lavaPool = ns(mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ color: '#ff6a00', toneMapped: false, transparent: true }), scene, [3.5, 0.035, 0], [-PI2, 0, 0]));
const chunkM = new THREE.MeshStandardMaterial({ color: '#5b5552', roughness: 0.95, flatShading: true, emissive: '#ff4d00', emissiveIntensity: 0.15 });
const chunks = []; for (let i = 0; i < 26; i++) { const r = 0.3 + 0.5 * hash(i * 3 + 1); const c = mesh(new THREE.DodecahedronGeometry(r), chunkM, scene); c.userData.r = r; chunks.push(c); }
function chunkBurst(c, k, sp, up, seed = 0) { chunks.forEach((m, i) => { const a = hash(i + seed) * 6.28, s = sp * (0.35 + hash(i + seed + 3)), kk = Math.min(k, 1); const tl = Math.min(kk * 1.6, 1); m.visible = k > 0; const y = c[1] + (0.5 + up * hash(i + 5)) * tl * 2.2 - 9 * tl * tl * (c[1] + 1) / 6; m.position.set(c[0] + Math.cos(a) * s * Math.sqrt(tl), Math.max(m.userData.r * 0.7, y), c[2] + Math.sin(a) * s * Math.sqrt(tl)); m.rotation.set(tl * 7 + i, tl * 4, i); }); }
const goldLight = new THREE.PointLight('#ffd60a', 0, 16, 1.3), redLight = new THREE.PointLight('#ff1f3d', 0, 16, 1.3), boomLight = new THREE.PointLight('#fff3b0', 0, 40, 1.1), lavaLight = new THREE.PointLight('#ff6a00', 0, 18, 1.2); scene.add(goldLight, redLight, boomLight, lavaLight);
// plateia: luzes erguidas
const lightsI = new THREE.InstancedMesh(sph(0.3, 10, 8), new THREE.MeshBasicMaterial({ toneMapped: false }), seats.length);
seats.forEach((s, i) => lightsI.setColorAt(i, new THREE.Color(['#fff3b0', '#ffd60a', '#7df9ff', '#ffffff'][i % 4]))); arena.add(lightsI);
function crowdLights(t, k) { lightsI.visible = k > 0.01; if (!lightsI.visible) return; seats.forEach(([r, y, a, ph], i) => { const w = clamp(k * 1.8 - ((a / 6.283 + hash(i) * 0.2) % 1) * 0.8); ps.set(Math.cos(a) * r + 0.15 * Math.sin(t * 2 + ph), y + 1.75 + 0.1 * Math.sin(t * 3 + ph), Math.sin(a) * r); sc.setScalar(w); mtx.compose(ps, qq, sc); lightsI.setMatrixAt(i, mtx); }); sc.set(1, 1, 1); lightsI.instanceMatrix.needsUpdate = true; }
// camarote do campeão
const balc = grp(scene, [0, 11, -21]);
[[0, 2.7], [-5.4, 2.2], [5.4, 2.2]].forEach(([x, r]) => { mesh(new THREE.CylinderGeometry(r, r * 0.75, 0.5, 40), M('#1b1d2e', { metalness: 0.6, roughness: 0.35 }), balc, [x, 0, 0]); ns(mesh(new THREE.TorusGeometry(r, 0.07, 8, 64), ADD('#ff1f3d', 0.9), balc, [x, 0.26, 0], [PI2, 0, 0])); ns(mesh(new THREE.ConeGeometry(r * 0.7, 6, 32, 1, true), ADD('#ff1f3d', 0.08), balc, [x, -3.2, 0], [Math.PI, 0, 0])); });
const BY = 11.25;

// ================= POSES =================
const JBEAM = { armR: [1.5, -0.3, 0.1], armL: [1.5, -0.3, 0.1], lean: 0.12, leg: [0.5, -0.4] };
const JCHG = { armR: [0.45, 0.2, 1.7], armL: [1.05, -0.55, 1.5], twist: -0.5, lean: 0.1, leg: [0.4, -0.3] };
const JFLY = { armL: [0.35, 0.45, 0.4], armR: [0.35, 0.45, 0.4], leg: [0.2, -0.35] };
const JPUNCH = { armR: [1.6, -0.1, 0.05], armL: [0.9, 0.2, 1.8], lean: 0.3, leg: [0.5, -0.3] };
const JBLOCK = { armR: [1.4, -0.6, 1.6], armL: [1.4, -0.6, 1.6], lean: -0.1 };
const VBEAM = { a: [[1.45, -0.32, 0.1], [1.45, -0.32, 0.1]], lean: 0.1, leg: [0.4, -0.3], knee: [0.3, 0.3] };
const VCHG = { a: [[0.35, 0.25, 1.9], [1.05, -0.5, 1.6]], twist: 0.5, lean: 0.1, leg: [0.4, -0.3] };
const FLEX = n => allA(n, [0.1, 1.25, 1.9, PI2]);
const CROSS = { a: [[1.25, -0.5, 2.0], [1.15, -0.45, 2.1]] };
const hitK = (t, t0, a = 0.14, h = 0.18, r = 0.3) => seg(t, t0 - a, t0) * (1 - seg(t, t0 + h, t0 + h + r));
function bS(b, p, ry, sc, pose) { b.root.visible = true; b.root.position.set(...p); b.root.rotation.set(0, ry, 0); b.root.scale.setScalar(sc); b.body.rotation.set(0, 0, 0); b.body.position.set(0, 0, 0); b.pose(pose); }
function jS(p, ry, pose, face) { J.position.set(...p); J.rotation.set(0, ry, 0); jo.pose({ breathe: breath(TT), ...pose }); jo.face(face); }
let TT = 0;
function beamsClash(t, k, opJ, opV, wJ = 0.32, wV = 0.38, grow = 1) {
  const jh = midW(jo.handR, jo.handL), vh = midW(VG.arms[0].fist, VG.arms[1].fist);
  const C = mix3(jh, vh, k); const gJ = mix3(jh, C, grow), gV = mix3(vh, C, grow);
  setRay(rayJ, jh, gJ, wJ, opJ, t); setRay(rayV, vh, gV, wV, opV, t);
  goldLight.position.set(...mix3(jh, C, 0.25)); goldLight.intensity = 7 * opJ; redLight.position.set(...mix3(vh, C, 0.25)); redLight.intensity = 9 * opV;
  if (grow >= 1 && opJ > 0.1 && opV > 0.1) {
    setBall(clashB, C, 1.1 + 0.25 * Math.sin(t * 40), 1, t); boomLight.position.set(...C); boomLight.intensity = 30;
    const sd = Math.floor(t * 14); for (let i = 0; i < 5; i++) { const a = hash(sd + i) * 6.28, b2 = (hash(sd + i + 50) - 0.5) * 2.4; bolt(i, C, [C[0] + Math.cos(a) * 2.6, C[1] + b2 * 1.4, C[2] + Math.sin(a) * 2.6], sd + i, 0.9, i % 2 ? '#fff6a8' : '#ffd1dc'); }
    burstSparks(C, (t * 2.2) % 1, 2.6, Math.floor(t * 2.2) * 7); ringAt(5, C, (t * 1.6) % 0.6, 2.6, [0, PI2, 0], 0.6, '#fff3b0');
  }
  return C;
}

function hideAll() {
  setRoom(false); arena.visible = false; crowdBody.visible = crowdHead.visible = true; [GK, VG].forEach(b => b.arms.forEach(A => A.fm.emissiveIntensity = 0)); sky.visible = false; balc.visible = false;
  [J, Z, host, GK.root, MG.root, VG.root, zH.root, jH.root].forEach(o => o.visible = false);
  [fist, fistIn, shield, shieldRim, auraC, beam, holoCone, lavaPool, dome, domeO, auJ.s, auJ.f, auV.s, auV.f, ...auJ.ms, ...auV.ms, ...motes, ...sparks, ...rocks, ...smoke, ...confetti, ...fw, ...chunks].forEach(o => o.visible = false);
  [ballJ, ballV, clashB, comet].forEach(B => { B.o.visible = B.i.visible = false; });
  [rayJ, rayV, trail].forEach(r => r.g.visible = false); bolts.forEach(b => b.g.visible = false); crk.forEach(c => c.g.visible = false);
  jGhosts.forEach(g => g.visible = false); rings.forEach(r => r.visible = false); lightsI.visible = false;
  cyanLight.intensity = 0; blueLight.intensity = 0; goldLight.intensity = 0; redLight.intensity = 0; boomLight.intensity = 0; lavaLight.intensity = 0; auJ.L.intensity = 0; auV.L.intensity = 0;
  arenaLights.forEach((l, i) => { l.color.set(['#c77dff', '#00e5ff', '#ff9f6b'][i]); l.intensity = [30, 20, 18][i]; });
}

// ================= ARENA 3: personagens no corpo do Mixamo =================
import { makeFighter, clipOf } from '../../_lib/mixamo.js';
import { makeJoseph, refineHead } from '../../_lib/joseph2.js';
import aIdle from '../../_lib/mixamo/Bouncing_Fight_Idle.fbx';
import aStand from '../../_lib/mixamo/Standing_idle.fbx';
import aSit from '../../_lib/mixamo/Dodge_While_Sitting.fbx';
import aGetUp from '../../_lib/mixamo/Getting_Up_1.fbx';
import aKO from '../../_lib/mixamo/Knocked_Out_1.fbx';
import aStun from '../../_lib/mixamo/Stunned.fbx';
import aCombo from '../../_lib/mixamo/Combo_Punch.fbx';
import aJab from '../../_lib/mixamo/Jab_Cross.fbx';
import aBox from '../../_lib/mixamo/Boxing_1.fbx';
import aDodge from '../../_lib/mixamo/Dodging.fbx';
import aDodgeB from '../../_lib/mixamo/Dodging_Back.fbx';
import aUpper from '../../_lib/mixamo/Surprise_Uppercut.fbx';
import aFlip from '../../_lib/mixamo/Back_Flip_To_Uppercut.fbx';
import aKick from '../../_lib/mixamo/Roundhouse_Kick.fbx';
import aHurr from '../../_lib/mixamo/Hurricane_Kick.fbx';
import aMma from '../../_lib/mixamo/Mma_Kick.fbx';
import aFlyBack from '../../_lib/mixamo/Flying_Back_Death.fbx';
import aFly from '../../_lib/mixamo/Flying.fbx';
import aLand from '../../_lib/mixamo/Hard_Landing.fbx';
import aFire from '../../_lib/mixamo/Fireball.fbx';
import aMag from '../../_lib/mixamo/Standing_2H_Magic_Attack_01.fbx';
import aArea from '../../_lib/mixamo/Standing_2H_Magic_Area_Attack_01.fbx';
import aCast from '../../_lib/mixamo/Standing_2H_Cast_Spell_01.fbx';
import aReach from '../../_lib/mixamo/Standing_1H_Magic_Attack_01.fbx';
import aHit from '../../_lib/mixamo/Hit_Reaction.fbx';
import aHeal from '../../_lib/mixamo/Magic_Heal.fbx';

const fx = makeFX(renderer, scene, camera, W, H);
const C = {}; Object.entries({ idle: aIdle, stand: aStand, sit: aSit, getup: aGetUp, ko: aKO, stun: aStun, combo: aCombo, jab: aJab, box: aBox, dodge: aDodge, dodgeB: aDodgeB, upper: aUpper, flip: aFlip, kick: aKick, hurr: aHurr, mma: aMma, flyback: aFlyBack, fly: aFly, land: aLand, fire: aFire, mag: aMag, area: aArea, cast: aCast, reach: aReach, hit: aHit, heal: aHeal }).forEach(([k, u]) => C[k] = clipOf(u));
const lp = (c, x) => (x % c.duration + c.duration) % c.duration;
const at = (c, x) => Math.max(0, Math.min(c.duration - 0.01, x));

// ---- Joseph novo + bracelete ----
const JO = makeJoseph(aIdle); const FJ = JO.F, jc = JO.c;
const braceN = mesh(new THREE.TorusGeometry(0.07, 0.025, 10, 24), braceMat, scene);
const qb = new THREE.Quaternion(), qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), PI2);
function syncBrace() { braceN.visible = FJ.root.visible; if (!braceN.visible) return; const p = FJ.world('LeftHand', [0, -3, 0]); braceN.position.copy(p); FJ.bones.LeftHand.getWorldQuaternion(qb); braceN.quaternion.copy(qb).multiply(qx); }

// ---- Vorg (aliado) ----
const ROUPA_VORG = n => /Hand|Thumb|Index|Middle|Ring|Pinky/.test(n) ? '#1b1d2e' : /Foot|Toe|UpLeg|Leg|Hips/.test(n) ? '#141414' : '#3d405b';
const FV = makeFighter(scene, aIdle, { scale: 0.0172, paint: ROUPA_VORG });
const VH = new THREE.Group(); { const sk = M('#3d405b', { roughness: 0.6 }), gold = M('#d4a017', { metalness: 0.8, roughness: 0.25 });
  mesh(rbox(0.46, 0.5, 0.44, 0.12), sk, VH, [0, 0, 0]); mesh(rbox(0.4, 0.16, 0.36, 0.06), M('#1b1d2e'), VH, [0, -0.25, 0.05]);
  for (const s of [-1, 1]) { mesh(new THREE.ConeGeometry(0.07, 0.4, 12), gold, VH, [s * 0.2, 0.32, -0.02], [0, 0, -s * 0.5]); }
  VH.eyeM = new THREE.MeshStandardMaterial({ color: '#300', emissive: '#ff1f3d', emissiveIntensity: 3 }); for (const s of [-1, 1]) mesh(rbox(0.12, 0.05, 0.03, 0.01), VH.eyeM, VH, [s * 0.1, 0.05, 0.225]);
  mesh(rbox(0.32, 0.05, 0.02, 0.01), M('#1b1d2e'), VH, [0, -0.13, 0.225]); }
FV.attachHead(VH, [0, 10, 2]);
for (const s of [-1, 1]) { const pad = new THREE.Group(); mesh(sph(0.2, 16, 12), M('#121212', { metalness: 0.85, roughness: 0.28 }), pad, [0, 0, 0], [0, 0, 0], [1.2, 0.6, 1.1]); mesh(new THREE.ConeGeometry(0.05, 0.22, 10), M('#d4a017', { metalness: 0.8, roughness: 0.25 }), pad, [0, 0.14, 0]); FV.attach(s < 0 ? 'LeftShoulder' : 'RightShoulder', pad, [s * -2, 12, 0]); }
{ const em = new THREE.Group(); mesh(new THREE.OctahedronGeometry(0.09), new THREE.MeshStandardMaterial({ color: '#300', emissive: '#ff1f3d', emissiveIntensity: 3 }), em, [0, 0, 0], [0, 0, 0], [1, 1.3, 0.4]); FV.attach('Spine2', em, [0, 6, 14]); }

// ---- Zentrix (o mais rápido) + 2 cópias ----
const ROUPA_ZEN = n => /Hand|Thumb|Index|Middle|Ring|Pinky/.test(n) ? '#caf0f8' : /Foot|Toe/.test(n) ? '#ffd60a' : /UpLeg|Leg|Hips/.test(n) ? '#0077b6' : '#00b4d8';
const zenHead = (mat, vis) => { const g = new THREE.Group(); mesh(sph(0.2, 20, 14), mat, g, [0, 0, 0], [0, 0, 0], [0.85, 1.15, 1.05]); mesh(new THREE.ConeGeometry(0.05, 0.28, 10), mat, g, [0, 0.2, -0.1], [-0.9, 0, 0]); mesh(rbox(0.3, 0.07, 0.1, 0.03), vis, g, [0, 0.03, 0.17]); return g; };
const FZ = makeFighter(scene, aIdle, { scale: 0.0135, paint: ROUPA_ZEN });
const visM = new THREE.MeshStandardMaterial({ color: '#332200', emissive: '#ffd60a', emissiveIntensity: 2.5 });
FZ.attachHead(zenHead(M('#00b4d8', { roughness: 0.3, metalness: 0.3 }), visM), [0, 9, 2]);
const ghostM = ADD('#48cae4', 0.32);
const FZg = [0, 1].map(() => { const F = makeFighter(scene, aIdle, { scale: 0.0135 }); F.model.traverse(n => { if (n.isMesh) { n.material = ghostM; n.castShadow = false; } }); F.attachHead(zenHead(ghostM, ghostM), [0, 9, 2]); return F; });

// ---- Grolm (gigante de pedra) ----
const ROUPA_GROLM = n => /Hand|Thumb|Index|Middle|Ring|Pinky|Foot|Toe/.test(n) ? '#4a4652' : /UpLeg|Leg|Hips/.test(n) ? '#57535e' : '#6d6875';
const FG = makeFighter(scene, aIdle, { scale: 0.05, paint: ROUPA_GROLM });
FG.model.traverse(n => { if (n.isMesh) n.material.flatShading = true; });
const GH = new THREE.Group(); { mesh(new THREE.DodecahedronGeometry(0.75), rockM, GH, [0, 0, 0], [0, 0, 0], [1, 0.9, 0.95]); GH.eyeM = new THREE.MeshStandardMaterial({ color: '#331', emissive: '#ffb703', emissiveIntensity: 3 }); for (const s of [-1, 1]) mesh(sph(0.1, 10, 8), GH.eyeM, GH, [s * 0.25, 0.08, 0.62]); }
FG.attachHead(GH, [0, 9, 2]);
for (const s of [-1, 1]) { const r = new THREE.Group(); mesh(new THREE.DodecahedronGeometry(1.0), rockM, r, [0, 0, 0]); mesh(new THREE.DodecahedronGeometry(0.6), rockM, r, [s * 0.5, 0.6, -0.3]); FG.attach(s < 0 ? 'LeftShoulder' : 'RightShoulder', r, [s * -3, 12, -2]); }
const crystalM = new THREE.MeshStandardMaterial({ color: '#2b0040', emissive: '#e0aaff', emissiveIntensity: 3 });
const crystal = new THREE.Group(); mesh(new THREE.OctahedronGeometry(0.35), crystalM, crystal, [0, 0, 0], [0, 0, 0], [1, 1.5, 1]); FG.attach('Neck', crystal, [0, 4, -11]);
const crystalLight = new THREE.PointLight('#e0aaff', 0, 10, 1.4); scene.add(crystalLight);

// ---- Nyx (a Sombra) ----
const nyxM = new THREE.MeshStandardMaterial({ color: '#120822', emissive: '#3c096c', emissiveIntensity: 0.7, roughness: 0.4, transparent: true, opacity: 0.93 });
const FN = makeFighter(scene, aIdle, { scale: 0.0135 }); FN.model.traverse(n => { if (n.isMesh) n.material = nyxM; });
const nc0 = makeChar(); nc0.root.visible = false; refineHead(nc0);
nc0.mats.skin.color.set('#1a0b2e'); nc0.mats.skin.emissive.set('#5a189a'); nc0.mats.skin.emissiveIntensity = 0.5;
nc0.head.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHexString() === 'ffffff') { o.material = new THREE.MeshBasicMaterial({ color: '#f3e8ff', toneMapped: false }); } });
nc0.pupils.forEach(p => p.visible = false); nc0.brows.forEach(b => b.material = new THREE.MeshBasicMaterial({ color: '#000' }));
const nyxBlob = new THREE.Group(); mesh(sph(0.32, 20, 14), nyxM, nyxBlob, [0, 0, 0], [0, 0, 0], [0.9, 1.1, 0.95]); for (const s of [-1, 1]) mesh(sph(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: '#f3e8ff', toneMapped: false }), nyxBlob, [s * 0.11, 0.04, 0.28]);
FN.attachHead(nc0.head, [0, 9, 3]); FN.attachHead(nyxBlob, [0, 9, 2]);
const nyxLight = new THREE.PointLight('#9d4edd', 0, 12, 1.3); scene.add(nyxLight);

const FIGHTERS = [FJ, FV, FZ, ...FZg, FG, FN];
// câmera de close na frente do personagem (usa a rotação do corpo)
function faceCam(Fi, dist = 2.6, side = 0.6, up = 0, bone = 'Head') { const h = Fi.world(bone); const ry = Fi.root.rotation.y; const fx_ = Math.sin(ry), fz = Math.cos(ry); return [[h.x + fx_ * dist + fz * side, h.y + up, h.z + fz * dist - fx_ * side], [h.x, h.y - 0.1, h.z]]; }
function put(F, p, ry, rz = 0, rx = 0) { F.root.visible = true; F.root.position.set(...p); F.root.rotation.set(rx, ry, rz); }
const sparkB = (p, k, R = 1.6, seed = 0) => burstSparks(AR(p), k, R, seed);
const V3 = a => new THREE.Vector3(a[0], a[1], a[2]);
const AR = v => Array.isArray(v) ? v : v.toArray();
const sRay = (r, a, b, R, op, t) => setRay(r, AR(a), AR(b), R, op, t);
const sBolt = (i, a, b, seed, op, col, w) => bolt(i, AR(a), AR(b), seed, op, col, w);

// ---- tempo visual: congelamentos curtos nos impactos (a narração segue) ----
const FREEZE = [[77.0, 0.12], [77.9, 0.15], [111.0, 0.1], [121.3, 0.12], [122.6, 0.18], [153.2, 0.08], [155.0, 0.08], [186.6, 0.15], [187.4, 0.18], [196.0, 0.2]];
const vtime = t => { let o = 0; for (const [a, d] of FREEZE) if (t > a) o += Math.min(d, t - a); return t - o; };
const frozen = t => FREEZE.some(([a, d]) => t > a && t < a + d);

window.render = function (t) {
  TT = t; TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t); const cur = TL.lines.find(l => t >= l.start && t < l.end); const who = cur ? cur.who : '';
  const jTalk = who === 'J' ? amp : -1, zTalk = who === 'Z' ? amp : -1, aTalk = who === 'A' ? amp : 0, vTalk = who === 'V' ? amp : 0, sTalk = who === 'S' ? amp : 0;
  const T = vtime(t);
  hideAll(); J.visible = false; brace.visible = false;
  FIGHTERS.forEach(F => { F.root.visible = false; F.root.scale.set(1, 1, 1); });
  nc0.head.visible = true; nyxBlob.visible = true; crystalLight.intensity = 0; nyxLight.intensity = 0; nyxM.opacity = 0.93;
  jc.mats.skin.emissive.set('#ffb703'); jc.mats.skin.emissiveIntensity = 0; VH.eyeM.emissiveIntensity = 3 + 2 * vTalk;
  braceMat.emissiveIntensity = 2.5 + 0.6 * Math.sin(t * 4);
  let ov = {}, camPos = [0, 2, 10], camLook = [0, 1.5, 0], shake = 0, flash = 0, roll = 0, impact = false;
  const F = { bloom: 0.45, threshold: 0.88, ca: 0.05, grain: 0.04, vig: 0.4, time: t };
  let showNyxHead = 'blob';
  const jFace = (o = {}) => jc.face({ open: blink(t), mouth: 'flat', brow: -0.5, browTilt: -0.6, look: [0, 0], talk: jTalk, ...o });
  const wave = (p, t0, dur = 0.5, a = 1) => { const k = (t - t0) / dur; if (k < 0 || k > 1) return; scene.updateMatrixWorld(true); const s = fx.toScreen(V3(p)); F.wave = [s[0], s[1], 0.05 + 0.9 * Math.sqrt(k), a * (1 - k)]; F.center = s; F.ca = Math.max(F.ca, 1.0 * (1 - k)); };
  const hitFX = (p, t0, txt, col, big = 1) => { const k = t - t0; if (k < 0 || k > 0.55) return; sparkB(p, k / 0.55, 1.6 * big, Math.floor(t0 * 7)); ringAt(0, p, k, 2.2 * big, [0, PI2, 0], 0.45, '#ffffff'); wave(p, t0, 0.45, 0.8 * big); if (k < 0.2) shake = 0.1 * big; if (k < 0.05) flash = 0.3 * big; if (k < 0.4) ov.fx = [txt, Math.min(1, k / 0.12), col, 50, 30, 180 * Math.min(1.3, big)]; if (k < 0.06) impact = true; };
  const auraOn = (Fi, k, col = 'J', big = 1) => { if (k <= 0.01) return; const p = Fi.world('Spine1'); const A = col === 'J' ? auJ : auV; aura(A, [p.x, p.y - 0.3 * big, p.z], 2.6 * big, k * 0.35, t, col === 'J' ? '#ffd60a' : col === 'N' ? '#9d4edd' : '#ff1f3d'); };

  if (t < 0) { // ---------- capa ----------
    arenaOn(1, 0.9); put(FJ, [-0.9, 0, 1.0], 0.35); FJ.pose(C.idle, 0.7); put(FV, [1.5, 0, -0.4], -0.35); FV.pose(C.idle, 1.5); put(FN, [0.3, 0, -5], 0); FN.pose(C.idle, 0.3);
    showNyxHead = 'joseph'; nyxLight.position.set(0.3, 3, -3.5); nyxLight.intensity = 30;
    jFace({ mouth: 'smile', brow: -0.4 }); auraOn(FJ, 1); auraOn(FV, 0.8, 'V');
    camera.fov = 44; camPos = [0.1, 2.0, 6.4]; camLook = [0.2, 2.1, 0];
  } else if (t < 6.0) { // ======== GANCHO: os dois de costas, rivais lado a lado ========
    arenaOn(t, 0.9); put(FJ, [-0.75, 0, 0], -0.5); FJ.pose(C.idle, lp(C.idle, t)); put(FV, [0.85, 0, 0], 0.55); FV.pose(C.idle, lp(C.idle, t + 0.6));
    jFace({ brow: -0.6 }); auraOn(FJ, 0.8); auraOn(FV, 0.8, 'V');
    const a = -0.6 + 0.9 * sm(t / 6); camPos = [Math.sin(a) * 6.5, lerp(1.0, 2.4, sm(t / 6)), Math.cos(a) * 6.5]; camLook = [0, 2.0, 0]; camera.fov = 50;
    ov.title = seg(t, 4.3, 4.6); F.bloom = 0.6;
  } else if (t < 21.6) { // ======== o quarto: o bracelete acende; o Zib e o visual novo ========
    setRoom(true); setDay(0); scene.background.set('#0d1020'); hemi.intensity = 0.6; sun.intensity = 0.4;
    const st = t > 12.0; put(FJ, st ? [-1.2, 0, -1.0] : [-2.4, 0.15, -1.6], st ? 0.3 : PI2 * 0.4);
    if (!st) FJ.pose(C.sit, 0.15); else FJ.pose(C.stand, lp(C.stand, t));
    braceMat.emissiveIntensity = 5 + 3 * Math.sin(t * 9);
    const hp = FJ.world('LeftHand'); cyanLight.position.set(hp.x, hp.y + 0.4, hp.z + 0.6); cyanLight.intensity = 1.8 + 0.8 * Math.sin(t * 9);
    const holo = seg(t, 9.6, 10.1);
    if (holo > 0) { zH.root.visible = true; const zp = st ? [-0.2, 1.3, -0.4] : [-1.5, 1.2, -1.0]; zH.root.position.set(zp[0], zp[1] + 0.05 * Math.sin(t * 2), zp[2]); zH.root.rotation.y = facing(zp, FJ.root.position.toArray()); zH.pose({ scl: [0.38 * holo, 0.38, 0.38 * holo], armL: [zTalk > 0 ? 1.0 + 0.4 * Math.sin(t * 6) : 0.3, 0.3, 0.5], armR: [0.6 + 0.6 * Math.max(0, zTalk), 0.2, 0.6] }); zH.face({ open: 1, mouth: 'o', talk: zTalk, brow: 0.8 }); zH.holoMat.opacity = (0.35 + 0.1 * Math.sin(t * 31)) * holo; holoCone.visible = true; holoCone.position.set(zp[0], zp[1] - 0.35, zp[2]); holoCone.material.opacity = 0.2 * holo; blueLight.position.set(zp[0], zp[1] + 0.3, zp[2] + 0.5); blueLight.intensity = 6 * holo; }
    jFace({ mouth: t > 12.2 && t < 15 ? 'smile' : 'o', brow: t < 12 ? 0.8 : 0.3, browTilt: 0, open: t < 7.0 ? 0.1 : 1.1 });
    if (t < 9.6) { camPos = [0.4, 1.6, 2.2]; camLook = [-2.2, 1.0, -1.6]; camera.fov = 46; }
    else if (t < 12.0) { camPos = [-0.1, 1.7, 1.6]; camLook = [-1.4, 1.3, -1.2]; camera.fov = 44; }
    else if (t < 15.2) { camPos = [-0.6, 2.2, 2.4]; camLook = [-1.2, 2.05, -1.0]; camera.fov = 40; }
    else { camPos = [1.2, 1.9, 1.8]; camLook = [-0.4, 1.4, -0.6]; camera.fov = 44; }
  } else if (t < 27.4) { // ======== a Nyx: fumaça que vira sombra ========
    arenaOn(t, 0); crowdBody.visible = crowdHead.visible = false; setSpots(t, 0.25); hemi.intensity = 0.25; sun.intensity = 0.4; arenaLights.forEach(l => { l.color.set('#7b2cbf'); l.intensity = 12; });
    const k = seg(t, 22.4, 25.0); put(FN, [0, 0, -1], 0); FN.pose(k < 1 ? C.getup : C.idle, k < 1 ? at(C.getup, 0.6 + k * 1.6) : lp(C.idle, t)); FN.root.scale.setScalar(0.4 + 0.6 * k); nyxM.opacity = 0.3 + 0.63 * k;
    for (let i = 0; i < 20; i++) { const a = i * 2.4 + t * 0.6; puff(i, [Math.cos(a) * (0.6 + 1.6 * hash(i)), 0.4 + 2.5 * hash(i + 3) * k, -1 + Math.sin(a) * (0.6 + 1.6 * hash(i))], ((t * 0.35 + i / 20) % 1), 1.4, '#2a0f45'); }
    nyxLight.position.set(0, 2.5, 0.5); nyxLight.intensity = 20 * k; F.bloom = 0.7;
    camPos = [0, 1.4, 6.2]; camLook = [0, 1.9, -1]; camera.fov = 46;
  } else if (t < 40.0) { // ======== o Vorg derrotado pede ajuda ========
    arenaOn(t, 0); crowdBody.visible = crowdHead.visible = false; setSpots(t, 0.35); hemi.intensity = 0.4; arenaLights.forEach(l => { l.color.set('#5a189a'); l.intensity = 14; });
    const gu = t - 29.2; put(FV, [0, 0, 0], 0.3); FV.pose(gu < 0 ? C.ko : C.getup, gu < 0 ? C.ko.duration - 0.05 : at(C.getup, gu * 0.8));
    for (let i = 0; i < 8; i++) puff(i, [Math.cos(i) * 2, 0.3, Math.sin(i) * 2], ((t * 0.2 + i / 8) % 1), 1.2, '#3c1d5c');
    if (t > 33.0) { const bk = seg(t, 33.0, 33.6); setBeam(new THREE.Vector3(-1.8, 26, 1.2), new THREE.Vector3(-1.8, 0, 1.2), 1.4, 0.45 * bk * (1 - seg(t, 35.0, 35.8))); blueLight.position.set(-1.8, 2.5, 2); blueLight.intensity = 14 * bk; }
    if (t > 34.2) { const dn = sm(lin(t, 34.2, 35.2)); put(FJ, [-1.8, lerp(6, 0, dn), 1.2], 2.4); FJ.pose(dn < 1 ? C.land : C.idle, dn < 1 ? 0.05 : lp(C.idle, t)); jFace({ brow: 0.4, browTilt: 0 }); }
    if (t > 36.3) { FV.pose(C.reach, at(C.reach, 0.55 + 0 * t)); FV.root.rotation.y = -2.2 + Math.PI; }
    if (t < 30.6) { camPos = [2.6, 1.0, 3.8]; camLook = [0, 0.6, 0]; camera.fov = 44; }
    else if (t < 36.3) { [camPos, camLook] = faceCam(FV, 3.0, 0.8, -0.2); camera.fov = 40; }
    else { camPos = [1.4, 2.2, 6.0]; camLook = [-0.6, 1.8, 0.4]; camera.fov = 46; }
  } else if (t < 52.0) { // ======== o Torneio das Duplas: anúncio e Zentrix ========
    arenaOn(t, 0.9); hostAnim(t, aTalk);
    put(FJ, [-0.9, 0, 2], Math.PI); FJ.pose(C.idle, lp(C.idle, t)); put(FV, [0.9, 0, 2], Math.PI); FV.pose(C.idle, lp(C.idle, t + 0.5)); jFace({ mouth: 'smile', look: [0, 0.6] });
    if (t > 47.4) { const tp = seg(t, 48.0, 48.2); put(FZ, [0, 0, -3], 0); FZ.pose(C.idle, lp(C.idle, t * 1.6)); FZ.root.visible = tp > 0.5 || Math.floor(t * 30) % 3 === 0; FZg.forEach((g, i) => { put(g, [(i ? 1.6 : -1.6) * (1 - tp * 0.3), 0, -3.4], 0); g.pose(C.idle, lp(C.idle, t * 1.6 + i)); }); ov.nc = t > 48.6 && t < 51.4 ? ['ZENTRIX', 'O MAIS RÁPIDO DA GALÁXIA', '#00b4d8', seg(t, 48.6, 48.8)] : null; }
    if (t < 44.0) { fireworks(t, 40.4); camPos = [3, 1.4, 10]; camLook = [0, 8.0, -2]; camera.fov = 54; }
    else if (t < 47.4) { camPos = [0, 2.2, 7.6]; camLook = [0, 2.0, 2]; camera.fov = 46; }
    else { camPos = [0, 1.6, 2.4]; camLook = [0, 1.9, -3]; camera.fov = 48; }
  } else if (t < 85.0) { // ================= LUTA 1: ZENTRIX =================
    arenaOn(t, 0.75); ov.score = 0;
    const JP = [-1.0, 0, 0]; let zp = [1.1, 0, 0];
    put(FJ, JP, PI2); put(FV, [-4.2, 0, -3.2], 1.2); FV.pose(C.idle, lp(C.idle, t)); auraOn(FJ, 0.5);
    const out = T > 77.9;
    if (t < 67.4) { // as cópias rodeiam; o Joseph erra
      const a = t * 2.2; zp = [JP[0] + Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1];
      put(FZ, zp, facing(zp, JP)); FZ.pose(C.box, lp(C.box, t * 1.3));
      FZg.forEach((g, i) => { const b = a + (i + 1) * 2.094; const gp = [JP[0] + Math.cos(b) * 2.1, 0, Math.sin(b) * 2.1]; put(g, gp, facing(gp, JP)); g.pose(C.box, lp(C.box, t * 1.3 + i * 0.5)); });
      FJ.root.rotation.y = facing(JP, zp) + Math.sin(t * 4) * 0.6; FJ.pose(t > 56.3 ? C.combo : C.idle, t > 56.3 ? lp(C.combo, t - 56.3) : lp(C.idle, t)); jFace({ brow: 0.4, browTilt: 0.3, mouth: t > 59.8 ? 'o' : 'flat' });
      if (t > 56.3 && Math.floor(t * 3) % 2 === 0) { const gi = Math.floor(t * 3) % 3; const G = gi < 2 ? FZg[gi] : null; if (G) G.root.visible = Math.floor(t * 12) % 2 === 0; }
      ov.speed = 0.35; F.zoom = 0.1;
      const ca = t * 0.4; camPos = [JP[0] + Math.sin(ca) * 6.8, 2.2, Math.cos(ca) * 6.8]; camLook = [JP[0], 1.5, 0]; camera.fov = 50;
      if (t > 63.6 && t < 66.8) { balc.visible = true; zH.root.visible = true; zH.root.position.set(0, BY + 0.6 + 0.05 * Math.sin(t * 2), -21); zH.root.rotation.y = 0; zH.pose({ scl: [1.2, 1.2, 1.2], armL: [zTalk > 0 ? 1.2 + 0.4 * Math.sin(t * 6) : 0.3, 0.3, 0.5], armR: [1.4, 0.3, 0.6] }); zH.face({ open: 1, mouth: 'o', talk: zTalk, brow: 0.9 }); zH.holoMat.opacity = 0.45; camPos = [0, BY + 1.6, -15.5]; camLook = [0, BY + 1.3, -21]; camera.fov = 40; }
    } else if (t < 75.3) { // olhos fechados: só um faz barulho
      const a = 67.4 * 2.2 + (t - 67.4) * 0.9; zp = [JP[0] + Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1];
      put(FZ, zp, facing(zp, JP)); FZ.pose(C.box, lp(C.box, t * 1.3)); FZg.forEach((g, i) => { const b = a + (i + 1) * 2.094; const gp = [JP[0] + Math.cos(b) * 2.1, 0, Math.sin(b) * 2.1]; put(g, gp, facing(gp, JP)); g.pose(C.box, lp(C.box, t * 1.3 + i * 0.5)); });
      FJ.root.rotation.y = lerp(facing(JP, zp) - 0.4, facing(JP, zp), seg(t, 72.5, 74.5)); FJ.pose(C.idle, lp(C.idle, t * 0.5)); jFace({ open: 0.05, mouth: 'flat', brow: -0.2, browTilt: 0 });
      ov.blue = 1; const ft = (t * 1.6) % 1; ringAt(0, [zp[0], 0.05, zp[2]], ft * 0.6, 1.2, [PI2, 0, 0], 0.6, '#7df9ff'); ringAt(1, [zp[0], 0.05, zp[2]], ((t * 1.6 + 0.5) % 1) * 0.6, 1.2, [PI2, 0, 0], 0.6, '#7df9ff');
      if (t < 71.0) { [camPos, camLook] = faceCam(FJ, 3.0, 0.8, 0.1); camera.fov = 40; } else { camPos = [JP[0] - 0.4, 3.6, 5.8]; camLook = [JP[0] + 0.6, 0.6, 0]; camera.fov = 48; }
    } else { // esquiva, gancho, Zentrix voa pra fora
      zp = [0.6, 0, 0]; FZg.forEach(g => g.root.visible = false);
      FJ.root.rotation.y = PI2;
      if (T < 76.6) FJ.pose(C.dodgeB, at(C.dodgeB, 0.6 + (T - 75.4) * 0.8)); else FJ.pose(C.upper, at(C.upper, 0.45 + (T - 76.6)));
      jFace({ brow: -0.8, browTilt: -0.8, mouth: T > 77.0 && T < 78.3 ? 'o' : 'flat' });
      if (T < 76.9) { put(FZ, zp, -PI2); FZ.pose(C.jab, at(C.jab, 0.3 + (T - 75.4) * 0.9)); }
      else { const k = lin(T, 77.9, 81.0); put(FZ, [lerp(0.6, 14, k), 5.5 * Math.sin(Math.min(1, k * 1.3) * Math.PI) + 8 * Math.max(0, k - 0.7), 0], -PI2, -k * 6); FZ.pose(C.flyback, at(C.flyback, (T - 77.9) * 0.8)); }
      if (T > 75.8 && T < 76.6) { ov.slow = 1; F.ca = 0.35; ov.fx = ['ESQUIVA!', seg(T, 75.8, 75.95), '#7df9ff', 50, 28, 170]; }
      hitFX([0.5, 2.1, 0], 77.9, 'GANCHO!', '#ffd60a', 1.5);
      if (t > 81.4) { ov.score = 1; ov.ex = 1; }
      if (T < 77.9) { const a = 0.9 + 0.4 * lin(t, 75.3, 77.9); camPos = [Math.sin(a) * 5.2 - 0.2, 1.6, Math.cos(a) * 5.2]; camLook = [-0.2, 1.6, 0]; camera.fov = 48; }
      else if (t < 81.4) { camPos = [-2.6, 0.8, 5.6]; camLook = [3, 3.5, 0]; camera.fov = 58; F.zoom = 0.4 * (1 - lin(t, 77.9, 79)); }
      else { camPos = [-1.0, 2.0, 5.2]; camLook = [-1.0, 1.8, 0]; camera.fov = 46; crowdLights(t, 0.6); }
    }
  } else if (t < 96.0) { // ======== lição 1 / anúncio do Grolm ========
    arenaOn(t, 0.75); ov.score = 1;
    put(FJ, [-1.0, 0, 0], 0.3); FJ.pose(C.stand, lp(C.stand, t)); put(FV, [1.2, 0, -0.4], -0.3); FV.pose(C.stand, lp(C.stand, t + 0.4)); jFace({ mouth: 'smile', brow: 0 });
    if (t < 91.7) { const a = lerp(0.6, -0.2, sm((t - 85) / 6.5)); camPos = [Math.sin(a) * 6.4, 2.3, Math.cos(a) * 6.4]; camLook = [0, 1.9, 0]; camera.fov = 46; ov.lesson = ['LIÇÃO 1', 'QUEM TENTA FAZER TUDO<br>NÃO FAZ NADA.<br><span style="color:#ffd60a">ESCOLHA UMA COISA E FOQUE.</span>', seg(t, 85.13, 85.4)]; }
    else { hostAnim(t, aTalk); const up = seg(t, 92.4, 95.0); put(FG, [0, -9 * (1 - up), -8], 0); FG.pose(C.idle, lp(C.idle, t * 0.5)); shake = 0.05 * (up > 0 && up < 1 ? 1 : 0); chunkBurst([0, 0, -8], lin(t, 92.4, 94.2), 7, 6, 3); GH.eyeM.emissiveIntensity = 3 + 2 * Math.sin(t * 3);
      camPos = [0, 0.8, 9.5]; camLook = [0, 5.5, -8]; camera.fov = 60; ov.nc = t > 93.4 && t < 95.9 ? ['GROLM', 'O GIGANTE DE PEDRA', '#9a8c98', seg(t, 93.4, 93.6)] : null; }
  } else if (t < 130.0) { // ================= LUTA 2: GROLM =================
    arenaOn(t, 0.75); ov.score = 1;
    const GP = [0, 0, -6]; put(FG, GP, 0); GH.eyeM.emissiveIntensity = 3;
    let jp = [-0.8, 0, 0], vp = [1.6, 0, 0.6];
    if (t < 102.5) { // socos não atravessam; o gigante bate no chão
      FG.pose(t > 99.2 ? C.area : C.idle, t > 99.2 ? at(C.area, (t - 99.2) * 0.8) : lp(C.idle, t * 0.5));
      put(FJ, [-0.4, 0, -3.6], Math.PI); FJ.pose(C.combo, lp(C.combo, t - 96.3)); put(FV, vp, Math.PI - 0.3); FV.pose(C.idle, lp(C.idle, t));
      if (t > 97.2 && t < 99.0 && Math.floor(t * 5) % 2 === 0) { sparkB([-0.4, 1.8, -4.4], ((t * 5) % 1), 0.8, Math.floor(t * 5)); }
      if (t > 97.6 && t < 98.4) ov.fx = ['CLANG!', seg(t, 97.6, 97.75), '#adb5bd', 50, 30, 170];
      hitFX([0, 0.2, -4.2], 101.0, 'BOOM!', '#ff9f1c', 1.6); if (t > 101.0) { FJ.pose(C.hit, at(C.hit, (t - 101.0) * 0.9)); FJ.root.position.z += 1.2 * seg(t, 101.0, 101.5); }
      camPos = [4.8, 1.0, 7.5]; camLook = [0, 6, -5]; camera.fov = 62;
    } else if (t < 108.0) { // "eu seguro ele"
      FG.pose(C.idle, lp(C.idle, t * 0.5)); put(FJ, jp, PI2 + 0.4); FJ.pose(C.idle, lp(C.idle, t)); put(FV, [0.4, 0, 0.9], -2.2); FV.pose(C.idle, lp(C.idle, t)); auraOn(FV, 0.6, 'V'); jFace({ look: [0.4, 0] });
      [camPos, camLook] = faceCam(FV, 2.8, 0.7, -0.1); camera.fov = 42;
    } else if (t < 119.2) { // o Vorg segura o pé; o Joseph sobe pelas costas e vê o cristal
      FG.pose(C.stun, at(C.stun, 0.25 + 0.05 * Math.sin(t * 3))); const foot = FG.world('LeftFoot');
      put(FV, [foot.x - 0.9, 0, foot.z + 0.9], facing([foot.x - 0.9, 0, foot.z + 0.9], [foot.x, 0, foot.z])); FV.pose(C.cast, lp(C.cast, t)); auraOn(FV, 1, 'V');
      for (let i = 0; i < 5; i++) { const a = foot.clone().add(new THREE.Vector3(-0.5, 1.2, 0.5)); sBolt(i, a, foot.clone().add(new THREE.Vector3(Math.cos(i * 1.3) * 0.6, 0.4 + 0.3 * i, Math.sin(i * 1.3) * 0.6)), i * 7 + Math.floor(t * 20), 0.9, '#ff4d6d', 0.05); }
      redLight.position.copy(foot).add(new THREE.Vector3(0, 1.5, 1)); redLight.intensity = 10;
      const cl = lin(t, 110.4, 114.2); const back = FG.world('Spine1', [0, 0, -30]), nk = FG.world('Neck', [0, 0, -22]);
      const jpp = cl < 1 ? V3([lerp(back.x - 1.5, nk.x, cl), lerp(0.5, nk.y - 0.6, cl), lerp(back.z - 1, nk.z, cl)]) : nk.clone().add(new THREE.Vector3(0.4, -0.7, -0.3));
      put(FJ, jpp.toArray(), cl < 1 ? 0 : Math.PI * 0.85, 0, cl < 1 ? -0.9 : 0); FJ.pose(cl < 1 ? C.fly : C.idle, cl < 1 ? lp(C.fly, t) : lp(C.idle, t)); auraOn(FJ, 0.7);
      crystalM.emissiveIntensity = 3 + 2 * Math.sin(t * 6); const cw = new THREE.Vector3(); crystal.getWorldPosition(cw); crystalLight.position.copy(cw); crystalLight.intensity = t > 113.5 ? 14 : 4;
      if (t < 110.4) { camPos = [foot.x + 2.5, 1.2, foot.z + 4.5]; camLook = [foot.x, 1.6, foot.z]; camera.fov = 50; }
      else if (t < 113.6) { camPos = [GP[0] - 6, 6, GP[2] - 9]; camLook = [GP[0], 6, GP[2] - 1]; camera.fov = 52; }
      else { camPos = [cw.x + 1.5, cw.y + 0.6, cw.z - 3.2]; camLook = [cw.x, cw.y, cw.z]; camera.fov = 44; ov.fx = t < 115.0 ? ['PONTO FRACO!', seg(t, 113.7, 113.9), '#e0aaff', 50, 26, 150] : null; }
    } else { // chute do Vorg + rajada do Joseph; o gigante desaba
      const fall = T > 122.6; const cw = new THREE.Vector3(); crystal.getWorldPosition(cw);
      FG.pose(fall ? C.ko : C.stun, fall ? at(C.ko, 0.5 + (T - 122.6) * 0.9) : at(C.stun, 0.3));
      put(FV, [-1.6, 0, -4.2], 0.6); FV.pose(C.mma, at(C.mma, 0.2 + (T - 119.6))); auraOn(FV, 0.9, 'V');
      const nk = FG.world('Neck', [0, 0, -40]); put(FJ, fall ? [-2.5, 0, -1] : [nk.x + 0.5, nk.y + 1.0, nk.z - 1.2], fall ? 0.5 : Math.PI * 0.85); FJ.pose(fall ? C.land : C.mag, fall ? at(C.land, (T - 122.6) * 0.8) : at(C.mag, 0.6 + (T - 120.3))); auraOn(FJ, 1.3);
      hitFX(FG.world('LeftLeg').toArray(), 121.3, 'CHUTE!', '#ff4d6d', 1.4);
      if (T > 121.7 && T < 122.6) { const h = FJ.world('RightHand').add(FJ.world('LeftHand')).multiplyScalar(0.5); sRay(rayJ, h, h.clone().lerp(cw, seg(T, 121.7, 122.1)), 0.35, 1, t); goldLight.position.copy(h); goldLight.intensity = 8; }
      if (T > 122.6) { crystal.visible = false; sparkB(cw, lin(T, 122.6, 123.6), 3, 5); } else crystal.visible = true;
      hitFX(cw.toArray(), 122.6, 'CRACK!', '#e0aaff', 1.8); hitFX([0, 0.5, -1], 124.3, 'BOOOM!', '#ff9f1c', 2.2); if (t > 124.3) { chunkBurst([0, 0.2, -1], lin(t, 124.3, 126.5), 9, 5, 7); for (let i = 0; i < 16; i++) puff(i, [Math.cos(i * 2.4) * (2 + 4 * hash(i)), 0.6 + hash(i + 2), -1 + Math.sin(i * 2.4) * (2 + 3 * hash(i))], 0.3 + 0.6 * lin(t, 124.3, 129), 2.4, '#8a8290'); }
      if (t > 126.5) { ov.score = 2; ov.ex = 1; crowdLights(t, 0.7); }
      if (T < 121.7) { camPos = [-4.5, 1.0, 1.2]; camLook = [0, 2.5, -5]; camera.fov = 58; }
      else if (T < 123.8) { camPos = [cw.x + 3.5, cw.y + 1.2, cw.z + 2.5]; camLook = [cw.x, cw.y - 0.5, cw.z]; camera.fov = 50; }
      else { camPos = [6, 3.2, 10]; camLook = [0, 2, -3]; camera.fov = 58; }
    }
  } else if (t < 151.6) { // ======== lição 2 / a Sombra chega ========
    arenaOn(t, t < 135.7 ? 0.75 : 0.2); ov.score = 2;
    put(FJ, [-1.0, 0, 1.0], t < 135.7 ? 0.3 : Math.PI + 0.3); FJ.pose(t < 135.7 ? C.stand : C.idle, lp(C.idle, t)); put(FV, [1.4, 0, 0.6], t < 135.7 ? -0.3 : Math.PI - 0.3); FV.pose(t < 135.7 ? C.stand : C.idle, lp(C.idle, t + 0.3));
    if (t < 135.7) { const a = lerp(0.6, -0.2, sm((t - 130) / 5.6)); camPos = [Math.sin(a) * 6.4, 2.3, Math.cos(a) * 6.4]; camLook = [0, 1.9, 0]; camera.fov = 46; jFace({ mouth: 'smile' }); ov.lesson = ['LIÇÃO 2', 'NINGUÉM VENCE SOZINHO.<br><span style="color:#ff8a8a">PEDIR AJUDA NÃO É FRAQUEZA.</span>', seg(t, 130.12, 130.4)]; }
    else {
      hostAnim(t, aTalk); arenaLights.forEach(l => { l.color.set('#5a189a'); l.intensity = 14; }); hemi.intensity = 0.3;
      const k = seg(t, 140.0, 143.8); put(FN, [0, 0, -3.2], 0); FN.pose(k < 1 ? C.getup : C.idle, k < 1 ? at(C.getup, 0.4 + k * 2) : lp(C.idle, t)); FN.root.scale.setScalar(0.3 + 0.7 * k); nyxM.opacity = 0.3 + 0.63 * k; showNyxHead = k > 0.6 ? 'joseph' : 'blob';
      for (let i = 0; i < 20; i++) { const a = i * 2.4 + t * 0.6; puff(i, [Math.cos(a) * (0.5 + 1.5 * hash(i)), 0.4 + 2.4 * hash(i + 3) * k, -3.2 + Math.sin(a) * (0.5 + 1.5 * hash(i))], ((t * 0.35 + i / 20) % 1), 1.3, '#2a0f45'); }
      nyxLight.position.set(0, 2.5, -2); nyxLight.intensity = 22 * k; nc0.face({ open: 1, mouth: sTalk > 0.1 ? 'o' : 'smile', brow: -0.8, browTilt: -0.8, talk: who === 'S' ? amp : -1 });
      jFace({ brow: 0.6, browTilt: 0, mouth: 'o' }); F.bloom = 0.6;
      if (t < 139.8) { camPos = [3, 1.6, 9]; camLook = [0, 7.5, -2]; camera.fov = 52; }
      else if (t < 145.8) { camPos = [3.8, 1.5, 1.4]; camLook = [-0.2, 1.8, -2.4]; camera.fov = 50; ov.nc = t > 141.5 && t < 145.5 ? ['NYX', 'A SOMBRA', '#9d4edd', seg(t, 141.5, 141.7)] : null; }
      else { [camPos, camLook] = faceCam(FN, 2.6, 0.5, 0); camera.fov = 40; }
    }
  } else if (t < 201.0) { // ================= LUTA FINAL: NYX (o espelho) =================
    arenaOn(t, 0.6); ov.score = 2; arenaLights.forEach(l => { l.color.set('#7b2cbf'); l.intensity = 16; });
    showNyxHead = 'joseph'; nyxLight.position.set(1, 2.5, 1); nyxLight.intensity = 10;
    const JP = [-1.05, 0, 0], NP = [1.05, 0, 0];
    put(FJ, JP, PI2); put(FN, NP, -PI2); put(FV, [-4.5, 0, -2.5], 1.0); FV.pose(C.idle, lp(C.idle, t)); auraOn(FJ, 0.6); auraOn(FN, 0.6, 'N');
    const mirror = (c, x) => { FJ.pose(c, x); FN.pose(c, x); };
    nc0.face({ open: 1, mouth: 'flat', brow: -0.8, browTilt: -0.8, talk: who === 'S' ? amp : -1 });
    if (t < 162.0) { // empate em tudo
      if (T < 154.1) mirror(C.combo, at(C.combo, 0.5 + (T - 151.7)));
      else if (T < 156.4) mirror(C.kick, at(C.kick, 0.3 + (T - 154.1)));
      else mirror(C.fire, at(C.fire, 0.8 + (T - 156.4)));
      hitFX([0, 2.0, 0], 153.2, 'PÁ!', '#ffd60a', 1.0); hitFX([0, 1.6, 0], 155.0, 'TUM!', '#c77dff', 1.2);
      if (T > 157.6 && T < 160.4) { const hj = FJ.world('RightHand').add(FJ.world('LeftHand')).multiplyScalar(0.5), hn = FN.world('RightHand').add(FN.world('LeftHand')).multiplyScalar(0.5); const mid = hj.clone().lerp(hn, 0.5); sRay(rayJ, hj, mid, 0.32, 1, t); sRay(rayV, hn, mid, 0.32, 1, t); [rayV.outer, rayV.head, rayV.root].forEach(m => m.material.color.set('#9d4edd')); setBall(clashB, mid.toArray(), 0.7 + 0.1 * Math.sin(t * 30), 1, t); goldLight.position.copy(hj); goldLight.intensity = 7; shake = 0.04; for (let i = 0; i < 6; i++) sBolt(i, mid, mid.clone().add(new THREE.Vector3(hash(i + Math.floor(t * 15)) - 0.5, hash(i + 4 + Math.floor(t * 15)) - 0.5, hash(i + 8 + Math.floor(t * 15)) - 0.5).normalize().multiplyScalar(1.3)), i * 5 + Math.floor(t * 20), 0.9, i % 2 ? '#ffd60a' : '#c77dff'); }
      if (t > 159.4 && t < 161.6) ov.fx = ['EMPATE!', seg(t, 159.4, 159.6), '#fff', 50, 26, 200];
      jFace({ brow: -0.8, browTilt: -0.8, mouth: 'flat' });
      if (T < 154.1) { const a = 0.2 + 1.0 * lin(t, 151.7, 154.1); camPos = [Math.sin(a) * 5.6, 1.7, Math.cos(a) * 5.6]; camLook = [0, 1.7, 0]; camera.fov = 48; }
      else if (T < 156.4) { camPos = [0, 0.6, 5.6]; camLook = [0, 1.6, 0]; camera.fov = 54; }
      else { camPos = [0.2, 1.3, 7.2]; camLook = [0, 1.9, 0]; camera.fov = 54; }
    } else if (t < 171.7) { // os dois caem; o Vorg grita
      mirror(C.ko, at(C.ko, 0.3 + (t - 162.0) * 0.9)); jFace({ open: 0.4, mouth: 'sad', brow: 0.6, browTilt: 0 }); nc0.face({ open: 0.4, mouth: 'flat' });
      if (t < 167.4) { camPos = [0, 4.5, 5.5]; camLook = [0, 0.4, 0]; camera.fov = 50; }
      else { FV.pose(C.reach, at(C.reach, 0.6)); FV.root.rotation.y = 0.6; [camPos, camLook] = faceCam(FV, 3.0, 0.8, 0); camera.fov = 40; }
    } else if (t < 185.4) { // 1% por dia; ele levanta e junta tudo
      const gu = t - 172.4; FJ.pose(gu < 0 ? C.ko : C.getup, gu < 0 ? C.ko.duration - 0.05 : at(C.getup, gu * 0.7)); FN.pose(C.ko, C.ko.duration - 0.05);
      if (t > 176.0) { FJ.pose(C.heal, at(C.heal, (t - 176.0) * 0.6)); FN.pose(C.getup, at(C.getup, (t - 176.0) * 0.7)); }
      jFace({ open: t > 173.5 ? 1.1 : 0.3, mouth: t > 175 ? 'smile' : 'flat', brow: -0.3, browTilt: -0.3 }); auraOn(FJ, 0.6 + 0.8 * seg(t, 177.6, 183));
      if (t < 177.6) { ov.pct = lin(t, 172.0, 177.0); [camPos, camLook] = faceCam(FJ, 3.2, 1.0, 0.4); camera.fov = 44; jc.mats.skin.emissiveIntensity = 0.15; }
      else { // flashes: Zentrix (cópias), Grolm (força), Vorg (chute)
        const ph = Math.floor((t - 177.6) / 1.75);
        if (ph === 0) { FZg.forEach((g, i) => { put(g, [JP[0] - 0.6 * (i + 1), 0, 0.3 * (i ? 1 : -1)], PI2); g.pose(C.heal, at(C.heal, (t - 177.6) * 0.6)); }); ov.flashTxt = ['A ESQUIVA DO ZENTRIX', '#48cae4']; }
        else if (ph === 1) { crk[0].g.visible = true; cracks(crk[0], [JP[0], 0.04, 0], seg(t, 179.35, 179.9), 4, '#ffd60a'); ov.flashTxt = ['A FORÇA DO GROLM', '#adb5bd']; shake = 0.05; }
        else { ov.flashTxt = ['O CHUTE DO VORG', '#ff4d6d']; }
        const a = -0.6 + 0.5 * lin(t, 177.6, 185.4); camPos = [JP[0] + Math.sin(a) * 4.5, 1.2, Math.cos(a) * 4.5]; camLook = [JP[0], 1.7, 0]; camera.fov = 48; F.bloom = 0.8;
      }
    } else { // o golpe novo; a Sombra trava e explode em luz
      const hurr = T < 187.2; const ex = T > 196.0;
      if (hurr) FJ.pose(C.hurr, at(C.hurr, 0.2 + (T - 185.5) * 1.1)); else FJ.pose(C.flip, at(C.flip, Math.min(C.flip.duration - 0.05, 2.6 + (T - 187.2) * 1.2)));
      auraOn(FJ, 1.5, 'J', 1.2); FZg.forEach((g, i) => { if (T > 185.5 && T < 187.4) { put(g, [JP[0] - 0.5 * (i + 1), 0, 0], PI2); g.pose(C.hurr, at(C.hurr, 0.2 + (T - 185.5) * 1.1 - 0.08 * (i + 1))); } });
      const glitch = T > 188.0 && !ex; FN.pose(glitch ? C.stun : C.hurr, glitch ? at(C.stun, 0.2 + (T - 188) * 0.3) : at(C.hurr, 0.2 + (T - 185.5) * 1.1));
      if (glitch) { FN.root.position.x += 0.06 * Math.sin(t * 97); FN.root.visible = Math.sin(t * 41) > -0.7; ov.err = seg(t, 189.4, 189.7) * (1 - seg(t, 192.3, 192.5)); nyxM.emissive.set(Math.floor(t * 12) % 2 ? '#ff1f3d' : '#3c096c'); } else nyxM.emissive.set('#3c096c');
      hitFX([0.4, 2.0, 0], 186.6, 'VUUSH!', '#ffd60a', 1.3); hitFX([0.6, 2.2, 0], 187.4, 'POW!', '#fff', 1.6);
      if (ex) { FN.root.visible = false; nc0.head.visible = false; const k = lin(t, 196.0, 199.5); setDome([1.05, 1.6, 0], k, 9); boomLight.position.set(1, 3, 2); boomLight.intensity = 40 * (1 - k); for (let i = 0; i < 18; i++) puff(i, [1 + Math.cos(i * 2.4) * 3 * k, 1 + 2 * hash(i) * k, Math.sin(i * 2.4) * 2 * k], 0.2 + 0.7 * k, 2.0, '#c8b6ff'); F.bloom = 0.5 + 2.5 * (1 - k); }
      if (t > 196.0 && t < 196.35) flash = 1 - (t - 196.0) / 0.35; if (t > 196.0 && t < 196.06) impact = true;
      jFace({ brow: -0.9, browTilt: -0.9, mouth: T > 186.4 && T < 188.5 ? 'o' : 'flat' });
      if (T < 187.4) { const a = -0.3 + 1.2 * lin(T, 185.5, 187.4); camPos = [Math.sin(a) * 5.4, 1.4, Math.cos(a) * 5.4]; camLook = [0, 1.7, 0]; camera.fov = 50; F.zoom = 0.2; }
      else if (t < 195.4) { camPos = [1.0, 2.1, 3.8]; camLook = [1.05, 2.0, 0]; camera.fov = 44; roll = glitch ? 0.06 * Math.sin(t * 7) : 0; }
      else { camPos = [-3.5, 1.5, 7.5]; camLook = [0.8, 2.2, 0]; camera.fov = 58; }
    }
  } else { // ======== vitória, lição 3, aperto de mão, CTA ========
    arenaOn(t, 0.95); ov.score = 3;
    const JP = [-0.75, 0, 0.3], VP = [0.95, 0, 0.3];
    if (t < 205.2) { put(FJ, JP, 0.2); FJ.pose(C.heal, at(C.heal, 0.8 + (t - 201) * 0.5)); put(FV, VP, -0.2); FV.pose(C.idle, lp(C.idle, t)); jFace({ mouth: 'smile', brow: 0.3, browTilt: 0 }); hostAnim(t, aTalk); fireworks(t, 201.4); crowdLights(t, 1); ov.champ = seg(t, 201.4, 201.7); camPos = [0, 1.8, 7.8]; camLook = [0, 2.6, 0]; camera.fov = 50; confetti.forEach((m, i) => { const k = ((t - 201.3) * 0.25 + hash(i)) % 1; m.visible = t > 201.3; m.position.set(-9 + 18 * hash(i + 7), 12 - 13 * k, -3 + 7 * hash(i + 3)); m.rotation.set(t * 3 + i, t * 2, i); }); }
    else if (t < 212.7) { put(FJ, JP, 0.3); FJ.pose(C.stand, lp(C.stand, t)); put(FV, VP, -0.3); FV.pose(C.stand, lp(C.stand, t + 0.4)); jFace({ mouth: 'smile', brow: 0, browTilt: 0 }); const a = lerp(0.6, -0.2, sm((t - 205.2) / 7)); camPos = [Math.sin(a) * 6.4, 2.3, Math.cos(a) * 6.4]; camLook = [0, 1.9, 0]; camera.fov = 46; ov.lesson = ['LIÇÃO 3', 'QUEM REPETE O MESMO, EMPATA.<br><span style="color:#ffd60a">QUEM MELHORA UM POUCO<br>TODO DIA, VENCE.</span>', seg(t, 205.27, 205.55)]; }
    else {
      const hs = seg(t, 213.0, 214.0); put(FJ, [-0.62, 0, 0], PI2); put(FV, [0.68, 0, 0], -PI2);
      FJ.pose(C.reach, at(C.reach, lerp(0.2, 0.62, hs))); FV.pose(C.reach, at(C.reach, lerp(0.2, 0.62, hs)));
      jFace({ mouth: 'smile', brow: 0.2, browTilt: 0, look: [0.5, 0] });
      if (t < 218.4) { camPos = [0, 1.9, 4.6]; camLook = [0, 1.9, 0]; camera.fov = 44; }
      else if (t < 222.9) { [camPos, camLook] = faceCam(FV, 2.8, -0.9, 0.1); camera.fov = 40; }
      else if (t < 224.4) { [camPos, camLook] = faceCam(FJ, 2.4, 1.7, 0.1); camera.fov = 40; }
      else { const a = lerp(-0.4, 0.4, sm((t - 224.4) / 16)); camPos = [Math.sin(a) * 9, 2.4, Math.cos(a) * 9]; camLook = [0, 2.4, 0]; camera.fov = 52; ov.cta = seg(t, 224.6, 224.9); ov.follow = seg(t, 230.5, 230.8); fireworks(t, 224.6 + Math.floor((t - 224.6) / 3) * 3); crowdLights(t, 1); }
    }
  }

  // ---- cabeças da Nyx e bracelete ----
  FIGHTERS.forEach(Fi => Fi.syncHeads()); syncBrace();
  if (FN.root.visible) { nc0.head.visible = showNyxHead === 'joseph'; nyxBlob.visible = showNyxHead !== 'joseph'; } else { nc0.head.visible = false; nyxBlob.visible = false; }
  if (frozen(t)) F.ca = Math.max(F.ca, 0.7);

  // ---------- câmera e desenho ----------
  camera.aspect = W / H; camera.updateProjectionMatrix(); cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll); sky.position.copy(camera.position);
  fx.set(F); fx.render();

  // ---------- overlays ----------
  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : ov.blue ? 'saturate(0.45) brightness(0.92) contrast(1.2)' : ov.slow ? 'saturate(0.65) contrast(1.15)' : '';
  $('burst').style.opacity = impact ? 1 : 0; $('flash').style.opacity = clamp(flash);
  $('lb').style.opacity = (ov.slow || ov.blue) ? 1 : 0; $('rage').style.opacity = 0; $('split').style.opacity = 0;
  $('speed').style.opacity = ov.speed || 0; $('speed').style.transform = `rotate(${(Math.floor(t * 30) % 7) * 3}deg) scale(1.4)`;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); if (!e) return; e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('title', ov.title || 0); pop('cta', ov.cta || 0); pop('follow', ov.follow || 0); pop('champ', ov.champ || 0); pop('err', ov.err || 0);
  const pc = $('pct'); pc.style.opacity = ov.pct ? 1 : 0; if (ov.pct) { const d = Math.round(ov.pct * 365); pc.innerHTML = `1% MELHOR POR DIA<br><span style="font-size:110px;color:#fff">DIA ${d}: ${Math.pow(1.01, d).toFixed(d > 200 ? 0 : 1)}x</span>`; }
  const ft = $('flashTxt'); if (ov.flashTxt) { ft.style.opacity = 1; ft.textContent = ov.flashTxt[0]; ft.style.color = ov.flashTxt[1]; } else ft.style.opacity = 0;
  const nc = $('nc'); if (ov.nc) { nc.style.opacity = 1; $('ncn').textContent = ov.nc[0]; $('ncs').textContent = ov.nc[1]; nc.style.borderColor = ov.nc[2]; $('ncn').style.color = ov.nc[2]; nc.style.transform = `translateX(${(1 - back(ov.nc[3])) * -300}px)`; } else nc.style.opacity = 0;
  const ls = $('lesson'); if (ov.lesson) { ls.style.opacity = 1; $('lsn').textContent = ov.lesson[0]; $('lst').innerHTML = ov.lesson[1]; ls.style.transform = `translate(-50%,-50%) scale(${0.6 + 0.4 * back(ov.lesson[2])})`; } else ls.style.opacity = 0;
  const scb = $('score'); scb.style.opacity = ov.score !== undefined && !ov.lesson && !ov.cta && !ov.champ ? 1 : 0; $('sc').textContent = '★'.repeat(ov.score || 0) + '☆'.repeat(3 - (ov.score || 0));
  $('bars').style.opacity = 0;
  const fxe = $('fx'); if (ov.fx) { const [txt, k, col, x, y, size] = ov.fx; fxe.style.opacity = 1; fxe.textContent = txt; fxe.style.left = x + '%'; fxe.style.top = y + '%'; fxe.style.fontSize = size + 'px'; fxe.style.color = col; fxe.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fxe.style.opacity = 0;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c && !ov.lesson ? 1 : 0; cp.style.color = c ? (WHOCOL[c.who] || '#fff') : '#fff';
};
