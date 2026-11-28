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
