// VÍDEO LONGO "Arena Galáctica" (16:9): abdução, Torneio dos Mil Mundos, 3 lutas (paciência, foco, calma), volta pra casa
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, hemi, sun, winLight, lampLight, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, cam, ampAt
} from '../../_lib/mundo3d.js';

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

// KROM, o gigante de pedra
const rockM = new THREE.MeshStandardMaterial({ color: '#6d6875', roughness: 0.95, flatShading: true });
const lava = new THREE.MeshStandardMaterial({ color: '#331100', emissive: '#ff6d00', emissiveIntensity: 2.2 });
const krom = grp(scene); const kTorso = grp(krom, [0, 2.2, 0]);
mesh(new THREE.DodecahedronGeometry(1.3), rockM, kTorso, [0, 0.9, 0], [0, 0, 0], [1.25, 1.35, 1.0]);
for (let i = 0; i < 5; i++) mesh(new THREE.BoxGeometry(0.1, 0.9, 0.06), lava, kTorso, [-0.6 + i * 0.3, 0.9 + (i % 2) * 0.3, 1.22], [0, 0, 0.4 * (i % 2 ? 1 : -1)]);
const kHead = grp(kTorso, [0, 2.6, 0.1]);
mesh(new THREE.DodecahedronGeometry(0.7), rockM, kHead, [0, 0, 0], [0, 0, 0], [1.15, 0.9, 1]);
const kEyes = [-1, 1].map(s => mesh(sph(0.13, 12, 10), lava, kHead, [s * 0.28, 0.05, 0.62]));
mesh(new THREE.BoxGeometry(0.5, 0.07, 0.05), lava, kHead, [0, -0.3, 0.66]);
const kArms = [-1, 1].map(s => { const g = grp(kTorso, [s * 1.75, 1.75, 0]); mesh(new THREE.DodecahedronGeometry(0.58), rockM, g, [0, -0.55, 0]); const f = grp(g, [0, -1.2, 0]); mesh(new THREE.DodecahedronGeometry(0.5), rockM, f, [0, -0.25, 0]); mesh(new THREE.DodecahedronGeometry(0.68), rockM, f, [0, -0.85, 0]); return { g, f, s }; });
for (const s of [-1, 1]) { mesh(new THREE.DodecahedronGeometry(0.62), rockM, krom, [s * 0.72, 1.45, 0], [0, 0, 0], [1, 1.5, 1]); mesh(new THREE.DodecahedronGeometry(0.58), rockM, krom, [s * 0.78, 0.45, 0.15]); }
const kPose = (o = {}) => { o = { armL: 0, armR: 0, spreadL: 0, spreadR: 0, foreL: 0, foreR: 0, lean: 0, twist: 0, breathe: 0, ...o }; kArms[0].g.rotation.set(-o.armR, 0, -0.15 - o.spreadR); kArms[1].g.rotation.set(-o.armL, 0, 0.15 + o.spreadL); kArms[0].f.rotation.set(-o.foreR, 0, 0); kArms[1].f.rotation.set(-o.foreL, 0, 0); kTorso.rotation.set(o.lean, o.twist, 0); kTorso.scale.set(1 + o.breathe * 0.5, 1 + o.breathe, 1 + o.breathe * 0.5); };

// VEXA, a mais rápida
const vx = makeChar({ skin: '#4cc9f0', hood: '#1b263b', hood2: '#4361ee', pants: '#0d1b2a', hair: '#4361ee', shoe: '#4361ee', sole: '#4cc9f0' }); const VX = vx.root;
mesh(new THREE.ConeGeometry(0.16, 0.7, 8), M('#4361ee'), vx.head, [0, 0.5, -0.12], [-0.5, 0, 0]);
for (const s of [-1, 1]) mesh(sph(0.12, 16, 12), M('#05070d', { roughness: 0.1 }), vx.head, [s * 0.16, 0.05, 0.36], [0, 0, s * 0.5], [1.35, 0.8, 0.6]);
const vGhosts = []; for (let i = 0; i < 6; i++) { const g = grp(scene); ns(mesh(cap(0.4, 0.5), ADD('#4cc9f0'), g, [0, 0.45, 0])); ns(mesh(sph(0.42, 16, 12), ADD('#4cc9f0'), g, [0, 1.3, 0])); vGhosts.push(g); }

// MULTIX e os clones
const mx = []; for (let i = 0; i < 8; i++) {
  const c = makeChar({ skin: '#9d4edd', hood: '#3c096c', hood2: '#240046', pants: '#10002b', hair: '#5a189a', shoe: '#240046', sole: '#c77dff' });
  mesh(sph(0.075, 12, 10), M('#ffffff'), c.head, [0, 0.24, 0.37]); mesh(sph(0.04, 10, 8), new THREE.MeshStandardMaterial({ color: '#111', emissive: '#c77dff', emissiveIntensity: 1 }), c.head, [0, 0.24, 0.43]);
  for (const s of [-1, 1]) mesh(new THREE.ConeGeometry(0.07, 0.32, 10), M('#e0aaff'), c.head, [s * 0.22, 0.4, 0], [0, 0, -s * 0.5]);
  mx.push(c);
}
const mPuffs = mx.map(() => ns(mesh(sph(1, 14, 10), new THREE.MeshStandardMaterial({ color: '#9d4edd', transparent: true, opacity: 0, roughness: 1, depthWrite: false }), scene)));
const hiRing = ns(mesh(new THREE.TorusGeometry(0.8, 0.05, 8, 40), ADD('#ff2d55'), scene, [0, 0.05, 0], [Math.PI / 2, 0, 0]));

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

// ================= ESPAÇO (abdução) =================
const space = grp(scene);
const earthTex = canvasTex(1024, 512, (x, w, h) => { x.fillStyle = '#1d5fa8'; x.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { x.fillStyle = i % 5 ? '#3f8f4a' : '#c2a46b'; x.beginPath(); x.ellipse(hash(i) * w, h * (0.2 + 0.6 * hash(i + 4)), 30 + 90 * hash(i + 2), 20 + 50 * hash(i + 3), hash(i + 6) * 3, 0, 7); x.fill(); } x.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 60; i++) { x.beginPath(); x.ellipse(hash(i + 90) * w, hash(i + 91) * h, 40 + 80 * hash(i + 92), 8 + 12 * hash(i + 93), 0.2, 0, 7); x.fill(); } });
const earth = mesh(sph(8, 64, 40), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.8 }), space, [0, -10, -2]);
ns(mesh(sph(8.35, 48, 32), ADD('#7fc8ff', 0.18), earth));
const ufo = grp(space, [0, 7, 0]);
mesh(new THREE.CylinderGeometry(2.4, 2.8, 0.45, 48), M('#b0bec5', { metalness: 0.8, roughness: 0.25 }), ufo);
mesh(new THREE.CylinderGeometry(1.2, 2.4, 0.4, 48), M('#90a4ae', { metalness: 0.8, roughness: 0.3 }), ufo, [0, -0.4, 0]);
mesh(new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#7df9ff', transparent: true, opacity: 0.55, roughness: 0.1 }), ufo, [0, 0.2, 0]);
const ufoLights = []; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; ufoLights.push(mesh(sph(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffd60a', toneMapped: false }), ufo, [Math.cos(a) * 2.6, 0, Math.sin(a) * 2.6])); }
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
const WHOCOL = { N: '#ffffff', J: '#ffe8a3', A: '#e0aaff', Z: '#9ef01a' };
function buildCaps() {
  caps = [];
  for (const l of TL.lines) {
    const ps2 = l.text.match(/[^.?!:]+[.?!:]+|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean);
    const merged = []; for (const p of ps2) { if (merged.length && merged[merged.length - 1].length + p.length < 46) merged[merged.length - 1] += ' ' + p; else merged.push(p); }
    const tot = merged.reduce((a, s) => a + s.length, 0); let t0 = l.start;
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, who: l.who }); t0 += d; }
  }
}

// ================= POSE HELPERS =================
const GUARD = { armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8] };
const PI2 = Math.PI / 2;
function hideAll() {
  setRoom(false); arena.visible = false; space.visible = false; sky.visible = false;
  [J, Z, host, krom, VX, ...mx.map(c => c.root)].forEach(o => o.visible = false);
  [fist, fistIn, shield, shieldRim, auraC, beam, hiRing, ...motes, ...sparks, ...rocks, ...smoke, ...confetti, ...fw, ...mPuffs].forEach(o => o.visible = false);
  [...jGhosts, ...vGhosts].forEach(g => g.visible = false); rings.forEach(r => r.visible = false);
  cyanLight.intensity = 0; blueLight.intensity = 0;
}
function arenaOn(t, ex = 0.5) {
  arena.visible = true; sky.visible = true; crowd(t, ex); setSpots(t);
  hemi.intensity = 0.55; hemi.color.set('#b8b0ff'); hemi.groundColor.set('#2b1d3a'); sun.intensity = 1.4; sun.color.set('#e6dcff'); winLight.intensity = 0; lampLight.intensity = 0;
  scene.background.set('#0a0418');
}
function hostAnim(t, talk) { host.visible = true; host.position.y = 9.5 + 0.25 * Math.sin(t * 1.3); host.rotation.y = 0.2 * Math.sin(t * 0.5); hostIris.material.emissiveIntensity = 1.2 + 3 * talk; hostIris.scale.set(1 + 0.25 * talk, 1 + 0.25 * talk, 0.5); hostHalo.rotation.z = t; tents.forEach((g, i) => g.rotation.set(0.25 * Math.sin(t * 2 + i), 0, 0.25 * Math.cos(t * 2.3 + i))); }

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t); const cur = TL.lines.find(l => t >= l.start && t < l.end); const who = cur ? cur.who : '';
  const jTalk = who === 'J' ? amp : -1, zTalk = who === 'Z' ? amp : -1, aTalk = who === 'A' ? amp : 0;
  hideAll(); camera.fov = 45;
  J.visible = true; J.scale.set(1, 1, 1); J.rotation.set(0, 0, 0); jo.head.scale.setScalar(1); brace.visible = t > 67.2; braceMat.emissiveIntensity = 2 + 0.6 * Math.sin(t * 4);
  krom.scale.setScalar(1.5); krom.rotation.set(0, -PI2, 0); krom.position.set(5, 0, 0); kPose({ breathe: 0.01 * Math.sin(t * 2) });
  kEyes.forEach(e => e.material.emissiveIntensity = 2.2);
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0, flash = 0, roll = 0, impact = false;

  if (t < 0) { // ---------- capa ----------
    arenaOn(1, 0.8); J.position.set(-2.2, 0.86, 1.2); J.rotation.y = 0.05; jo.pose({ armR: [0.5, 1.1, 1.9], armL: [0.9, 0.2, 1.8], lean: 0.05 }); jo.face({ open: 1.1, mouth: 'flat', brow: -0.6, browTilt: 0.6, look: [0.3, 0.1] });
    krom.visible = true; krom.position.set(3.2, 0, -1.6); krom.rotation.y = facing([3.2, 0, -1.6], [-2.2, 0, 1.2]); kPose({ armR: 1.3, foreR: 0.4, lean: 0.25 });
    scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); fist.visible = fistIn.visible = true; fist.position.copy(v); fistIn.position.copy(v); fist.scale.setScalar(0.55); fistIn.scale.setScalar(0.3); fist.material.opacity = 0.6; fistIn.material.opacity = 0.9; auraJ(0.55, 1);
    setSpots(1, 1.5); camera.fov = 50; camera.updateProjectionMatrix(); cam([-4.3, 1.7, 5.0], [0.9, 3.3, -0.8], 0, 0); sky.position.copy(camera.position); renderer.render(scene, camera); return;
  }

  if (t < 8.6) { // ======== GANCHO: a arena ========
    arenaOn(t, 0.6);
    J.position.set(-3, 0.86, 1.5); J.rotation.y = facing([-3, 0, 1.5], [6, 0, -1]); jo.pose({ breathe: jb, armL: [0.1, 0.25, 0.3], armR: [0.1, 0.25, 0.3] }); jo.face({ open: blink(t), mouth: 'flat', brow: 0.8, look: [0.4, 0.5] });
    krom.visible = true; krom.position.set(6, 0, -1); krom.rotation.y = facing([6, 0, -1], [-3, 0, 1.5]); kPose({ breathe: 0.02 * Math.sin(t * 2), armL: 0.2, armR: 0.2 });
    host.visible = false;
    const k = sm(t / 8.6); camPos = mix3([0, 11, 24], [-7.2, 1.3, 5.6], k); camLook = mix3([0, 3, 0], [1.5, 3.4, -0.5], k); camera.fov = 48;
    ov.title = t > 2.6 && t < 8.2 ? seg(t, 2.62, 2.9) : 0;
  } else if (t < 16.1) { // ======== quarto: luz azul ========
    setRoom(true); setDay(0); scene.background.set('#0d1020');
    J.position.set(3.0, 0.8, -2.8); const look = seg(t, 13.0, 13.6);
    J.rotation.y = lerp(0, -0.9, look);
    jo.pose({ breathe: jb, leg: [1.5, 1.5], armL: [1.25, 0.15, 1.3], armR: [lerp(1.25, 0.6, look), 0.15, 1.3], head: [lerp(0.3, -0.1, look), 0, 0] });
    jo.face({ open: look > 0.5 ? 1.35 : blink(t), mouth: look > 0.5 ? 'o' : 'flat', brow: look > 0.5 ? 1.0 : 0, look: [0, -0.4 + 0.6 * look] });
    const bk = seg(t, 12.9, 13.8);
    setBeam(new THREE.Vector3(0.5, 2.4, -4.2), new THREE.Vector3(3.0, 1.2, -2.6), 1.3, 0.45 * bk);
    blueLight.position.set(1.5, 2.4, -2.8); blueLight.intensity = 14 * bk; lampLight.intensity = 3;
    if (t < 12.9) { camPos = [3.3, 1.85, 1.3]; camLook = [3.0, 1.5, -2.6]; camera.fov = 40; }
    else { camPos = mix3([-1.2, 2.0, 2.8], [-0.8, 1.9, 2.2], sm((t - 12.9) / 3.2)); camLook = [2.0, 1.8, -2.8]; camera.fov = 46; shake = 0.01 * bk; }
  } else if (t < 19.9) { // ======== flutua ========
    setRoom(true); setDay(0); scene.background.set('#0d1020');
    const up = t < 17.87 ? seg(t, 16.1, 17.87) * 1.4 : 1.4 + 4.6 * sm((t - 17.87) / 2.0);
    J.position.set(3.0, 0.8 + up, -2.8); J.rotation.set(0, -0.6 + 0.4 * Math.sin(t * 0.8), 0.1 * Math.sin(t));
    jo.pose({ breathe: jb, leg: [0.3, 0.1], armL: [0.3, 0.9, 0.2], armR: [0.3, 0.9, 0.2] }); jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0, 0.6] });
    setBeam(new THREE.Vector3(0.5, 2.6, -4.2), new THREE.Vector3(3.0, 0.2, -2.6), 1.6, 0.45);
    blueLight.position.set(2.6, 2.5, -2.4); blueLight.intensity = 16;
    if (t < 17.87) { camPos = [3.1, 1.4, 1.0]; camLook = [3.0, 1.6 + up * 0.8, -2.7]; camera.fov = 48; }
    else { camPos = [2.3, 10.5, -1.3]; camLook = [3.0, 0, -2.8]; camera.fov = 50; }
  } else if (t < 24.3) { // ======== espaço: a Terra vira um pontinho ========
    space.visible = true; sky.visible = true; skyMat.color.setScalar(0.45); scene.background.set('#020108');
    hemi.intensity = 0.4; sun.intensity = 2.2; sun.color.set('#ffffff');
    const k2 = seg(t, 21.62, 24.0);
    earth.scale.setScalar(lerp(1, 0.02, k2)); earth.position.set(0, lerp(-10, -6, k2), lerp(-2, -14, k2)); earth.rotation.y = t * 0.05;
    ufo.position.set(0, 7 + 3 * k2, 0); ufo.rotation.y = t * 1.5; ufoLights.forEach((l, i) => l.material.color.set(Math.floor(t * 8 + i) % 3 ? '#ffd60a' : '#ff2d95'));
    const rise = lin(t, 19.9, 21.62);
    J.position.set(0, lerp(-1.2, 5.6, rise) + 3 * k2, 0); J.rotation.set(0, t * 0.8, 0); jo.pose({ leg: [0.2, 0.1], armL: [0.3, 1.0, 0.2], armR: [0.3, 1.0, 0.2] }); jo.face({ open: 1.3, mouth: 'o', brow: 1.0 });
    setBeam(new THREE.Vector3(0, ufo.position.y - 0.5, 0), new THREE.Vector3(0, -2 - 4 * (1 - k2), 0), 1.8, 0.35 * (1 - k2 * 0.7));
    if (t < 21.62) { camPos = [7.5, 1.2, 11]; camLook = [0, 2.2, 0]; camera.fov = 50; }
    else { camPos = [1.6, ufo.position.y + 2.2, 4.0]; camLook = [0, -6, -10]; camera.fov = 55; ov.speed = k2 * 0.7; }
    if (t > 23.9) flash = (t - 23.9) / 0.4;
  } else if (t < 30.0) { // ======== acorda na arena ========
    arenaOn(t, 0.35);
    const sit = seg(t, 25.8, 26.8), stand = seg(t, 27.8, 28.9);
    J.position.set(0, lerp(0.3, 0.86, stand), lerp(0, 0, 0)); J.rotation.set(-PI2 * (1 - sit) * 0.95, 0.4, 0);
    jo.pose({ breathe: jb, leg: [lerp(1.4, 0, stand) * sit, lerp(1.4, 0, stand) * sit], armL: [0.3, 0.4, 0.3], armR: [0.3, 0.4, 0.3], head: [0, 0.4 * Math.sin(t * 1.5) * sit, 0] });
    jo.face({ open: t < 25.0 ? 0.1 : 1.2, mouth: 'o', brow: 0.8, look: [0.6 * Math.sin(t * 1.4), 0.4] });
    const k = seg(t, 25.0, 30.0); camPos = mix3([0.6, 2.4, 1.4], [3, 13, 23], k); camLook = mix3([0, 0.6, 0], [0, 3, 0], k); camera.fov = 50;
    if (t < 24.7) flash = 1 - (t - 24.3) / 0.4;
  } else if (t < 42.5) { // ======== apresentador: Torneio dos Mil Mundos ========
    arenaOn(t, t < 33.5 ? 0.9 : 0.5); hostAnim(t, aTalk);
    host.position.y = lerp(17, 9.5, seg(t, 30.0, 31.0)) + 0.25 * Math.sin(t * 1.3);
    J.position.set(0, 0.86, 3); J.rotation.y = Math.PI; jo.pose({ breathe: jb, armL: [0.1, 0.25, 0.3], armR: [0.1, 0.25, 0.3], head: [-0.4, 0, 0] }); jo.face({ open: 1.2, mouth: 'o', brow: 0.8, look: [0, 0.8] });
    if (t > 30.2) fireworks(t, 30.2);
    if (t < 33.5) { camPos = [3, 1.2, 9]; camLook = [0, 8.5, -2]; camera.fov = 52; }
    else { const a = lerp(0.3, -0.5, sm((t - 33.5) / 9)); camPos = [Math.sin(a) * 10, 6.5, -2 + Math.cos(a) * 10]; camLook = [0, 8.6, -2]; camera.fov = 42; }
    ov.rules = t > 35.0 ? [seg(t, 35.0, 35.3), t > 36.9 ? seg(t, 36.9, 37.2) : 0, t > 38.84 ? seg(t, 38.84, 39.1) : 0] : null;
  } else if (t < 49.3) { // ======== os lutadores de cada planeta ========
    arenaOn(t, 0.5);
    krom.visible = true; krom.scale.setScalar(1.2); krom.position.set(-7, 0, -6); krom.rotation.set(0, 0, 0); kPose({ breathe: 0.02 * Math.sin(t * 2) });
    VX.visible = true; VX.position.set(-3.2, 0.86, -6); VX.rotation.set(0, 0, 0); vx.pose({ breathe: jb, armL: [0.2, 0.6, 1.6], armR: [0.2, 0.6, 1.6], lean: -0.05 }); vx.face({ open: 0.8, mouth: 'smile', brow: -0.4, browTilt: 0.4 });
    mx[0].root.visible = true; mx[0].root.position.set(0, 0.86, -6); mx[0].root.rotation.set(0, 0, 0); mx[0].pose({ breathe: jb, armL: [1.2, -0.6, 2.2], armR: [1.2, -0.6, 2.2] }); mx[0].face({ open: 0.7, mouth: 'smile', brow: -0.5, browTilt: 0.5 });
    J.position.set(4, 0.86, -6); J.rotation.y = 0; jo.pose({ breathe: jb, armL: [0.1, 0.25, 0.3], armR: [0.1, 0.25, 0.3] }); jo.face({ open: blink(t), mouth: t > 47.2 ? 'o' : 'flat', brow: 0.9, look: [-0.5, 0] });
    const k = sm((t - 42.5) / 6.8); const x = lerp(-8, 4, k); camPos = [x + 0.5, 2.2, 0.5]; camLook = [x, 2.4, -6]; camera.fov = 44;
  } else if (t < 52.5) { // ======== "deve ter algum engano" ========
    arenaOn(t, 0.3);
    J.position.set(4, 0.86, -6); J.rotation.y = 0.2; jo.pose({ breathe: jb, armL: [0.6, 0.5, 1.0], armR: [0.6, 0.5, 1.0], head: [0, 0, jTalk > 0 ? 0.05 * Math.sin(t * 6) : 0] }); jo.face({ open: 1.2, mouth: 'o', talk: jTalk, brow: 1.0 });
    camPos = [4.4, 2.2, -3.4]; camLook = [4, 2.1, -6]; camera.fov = 38;
  } else if (t < 76.6) { // ======== o Zib e o bracelete ========
    arenaOn(t, 0.25);
    J.position.set(4, 0.86, -6); J.rotation.y = facing([4, 0, -6], [5.3, 0, -5.4]);
    const zw = lin(t, 52.0, 53.0), zp = [lerp(7, 5.3, sm(zw)), 0.53, -5.4]; Z.visible = true; Z.position.set(...zp); Z.rotation.y = facing(zp, [4, 0, -6]);
    const zwalk = walkPose(zw * 3, zw > 0 && zw < 1 ? 1 : 0);
    const mopK = t > 54.9 && t < 59.4 ? Math.sin(t * 5) : 0;
    const give = seg(t, 66.2, 67.0) * (1 - seg(t, 67.6, 68.2));
    zb.pose({ scl: [0.62, 0.62, 0.62], leg: zwalk.leg, armR: [0.7 + 0.4 * mopK + 1.0 * give, 0.2, 0.6], armL: [zTalk > 0 ? 0.9 + 0.3 * Math.sin(t * 5) : 0.2, 0.3, 0.5] });
    zb.face({ open: blink(t, 1), mouth: 'smile', talk: zTalk, brow: 0.3, look: [0, 0.8] });
    const wrist = seg(t, 67.4, 68.2);
    const calm = seg(t, 74.4, 75.4);
    jo.pose({ breathe: jb, armR: [lerp(0.2, 1.4, wrist), 0.1, lerp(0.3, 1.6, wrist)], armL: [0.1, 0.25, 0.3], head: [0.35, 0, 0] });
    jo.face({ open: calm > 0.5 ? 0.06 : blink(t), mouth: calm > 0.5 ? 'smile' : (t > 67.3 && t < 69 ? 'o' : 'flat'), brow: calm > 0.5 ? 0 : 0.6, look: [0.3, -0.6] });
    if (t > 67.2 && t < 67.5) { flash = 0.5; }
    if (t > 69.6) { braceMat.emissiveIntensity = 2.5 + 2 * calm + 0.6 * Math.sin(t * 4); auraJ(0.6 * calm, t); }
    if (t < 54.9) { camPos = [5.6, 1.7, -2.6]; camLook = [4.6, 1.4, -5.8]; camera.fov = 42; }
    else if (t < 59.4) { camPos = [3.6, 1.0, -3.4]; camLook = [5.3, 1.0, -5.4]; camera.fov = 44; }
    else if (t < 65.6) { camPos = [3.1, 2.6, -4.6]; camLook = [5.2, 1.0, -5.4]; camera.fov = 44; }
    else if (t < 69.6) { scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); camPos = [v.x + 0.8, v.y + 0.5, v.z + 1.6]; camLook = [v.x, v.y, v.z]; camera.fov = 36; }
    else { const k = sm((t - 69.6) / 7); camPos = mix3([6.0, 1.8, -2.4], [4.5, 2.1, -4.0], k); camLook = [4.3, 1.9, -6]; camera.fov = 40; }
  } else if (t < 131.5) { // ================= LUTA 1: KROM =================
    arenaOn(t, 0.7); krom.visible = true;
    let jp = [-3, 0.86, 0], jr = PI2, kp = [5, 0, 0], kr = -PI2, jpose = { ...GUARD }, jface = { open: blink(t), mouth: 'flat', brow: -0.3, browTilt: 0.3 }, kpose = { breathe: 0.015 * Math.sin(t * 2) };
    ov.score = 0;
    if (t < 83.5) { // entrada
      const rise = seg(t, 76.8, 78.6); kp = [5, lerp(-12, 0, rise), 0];
      kpose = { armL: 0.5 * seg(t, 79.0, 79.6), armR: 0.5 * seg(t, 79.0, 79.6), spreadL: 0.8 * seg(t, 79.0, 79.6), spreadR: 0.8 * seg(t, 79.0, 79.6), lean: -0.2 * seg(t, 79.0, 79.6) };
      for (let i = 0; i < 14; i++) puff(i, [5 + (hash(i) - 0.5) * 6, 0.4 + 2 * lin(t, 76.8, 79) * hash(i + 2), (hash(i + 3) - 0.5) * 6], lin(t, 76.8 + hash(i) * 0.4, 80.5), 2.2, '#5e5866');
      shake = rise > 0 && rise < 1 ? 0.04 : (t > 79.0 && t < 80.2 ? 0.05 : 0);
      if (t < 79.62) { camPos = [-7, 1.1, 3.2]; camLook = [4, 5, 0]; camera.fov = 50; } else { camPos = [2.6, 1.6, 4.0]; camLook = [5, 6.8, 0]; camera.fov = 50; }
      ov.nc = t > 77.82 && t < 79.62 ? ['JOSEPH', 'PLANETA TERRA', '#ffd60a', seg(t, 77.82, 78.0)] : t > 80.54 && t < 83.4 ? ['KROM', 'O GIGANTE DE PEDRA', '#ff6d00', seg(t, 80.54, 80.75)] : null;
    } else if (t < 87.8) { // passos que tremem a arena
      const s1 = seg(t, 84.0, 84.6), s2 = seg(t, 85.5, 86.1); kp = [lerp(5, 3.8, (s1 + s2) / 2), 0.25 * (Math.sin(s1 * Math.PI) + Math.sin(s2 * Math.PI)), 0];
      shake = (t > 84.55 && t < 84.9) || (t > 86.05 && t < 86.4) ? 0.08 : 0;
      rockBurst([3.8, 0, 0], lin(t, 86.05, 87.3), 3, 2.5, 1);
      jface = { open: 1.3, mouth: 'o', brow: 1.0 };
      camPos = [-1.5, 0.3, 2.6]; camLook = [4, 4.6, 0]; camera.fov = 58;
    } else if (t < 95.2) { // o primeiro soco: voa longe
      kp = [3.8, 0, 0];
      const wind = seg(t, 88.6, 89.8), hit = seg(t, 90.4, 90.55);
      kpose = { armR: lerp(lerp(0, -0.6, wind), 1.6, hit) * (1 - seg(t, 91.5, 92.5)), twist: 0.3 * wind - 0.6 * hit, lean: 0.3 * hit };
      const fly = lin(t, 90.68, 92.0);
      jp = [lerp(-3, -11, sm(fly)), 0.86 + Math.sin(fly * Math.PI) * 2.0, 0]; if (t > 92.0) jp = [-11 - 0.5 * seg(t, 92, 92.8), lerp(0.86, 0.35, seg(t, 92.0, 92.3)), 0];
      J.rotation.set(fly * 5, PI2, 0); jface = { open: 1.35, mouth: "o", brow: 1.2 };
      if (t > 90.55 && t < 90.68) { impact = t < 90.62; flash = 0.9; shake = 0.15; }
      if (t < 90.55) { camPos = [-0.5, 3.0, 12.5]; camLook = [0, 3.2, 0]; camera.fov = 52; }
      else if (t < 92.1) { camPos = [jp[0] + 1.5, 2.2, 9]; camLook = [jp[0], 1.6, 0]; camera.fov = 50; ov.speed = 0.6; }
      else { camPos = [-6.5, 1.0, 5.5]; camLook = [-11, 0.7, 0]; camera.fov = 46; }
      jpose = fly > 0 ? { armL: [2.2, 0.8, 0.3], armR: [2.2, 0.8, 0.3], leg: [0.4, -0.2] } : GUARD;
      if (t > 92.0) jpose = { armL: [2.8, 0.4, 0.2], armR: [2.8, 0.4, 0.2] };
      ov.fx = t > 90.55 && t < 91.6 ? ['BAM!', seg(t, 90.55, 90.7), '#ff6d00', 45, 38, 220] : null;
      ov.laugh = t > 92.6 && t < 95.2;
      jr = t > 92.0 ? PI2 : PI2; if (t > 92.0) { J.rotation.set(-PI2 * 0.95, PI2, 0); }
    } else if (t < 101.8) { // caído: "era lento"
      jp = [-11.5, 0.35, 0]; kp = [lerp(3.8, -3.5, sm((t - 95.2) / 6)), 0, 0];
      const wk = (t - 95.2) / 6 * 3; kp[1] = 0.2 * Math.abs(Math.sin(wk * Math.PI));
      kpose = { armR: 0.8 * seg(t, 98.2, 101.0), foreR: 0.4 * seg(t, 98.2, 101.0), breathe: 0.015 * Math.sin(t * 2) };
      jpose = { armL: [2.8, 0.4, 0.2], armR: [0.6, 0.6, 0.6], leg: [0.3, 0] }; jface = { open: 1.0, mouth: 'flat', brow: -0.3, browTilt: 0.3, look: [0, 0.6] };
      shake = Math.abs(Math.sin(wk * Math.PI)) < 0.1 ? 0.03 : 0;
      camPos = [-10.4, 0.7, 1.6]; camLook = [lerp(-4, -3.5, 0), 5.0, 0]; camera.fov = 56; ov.slow = t > 98.2;
      ov.lento = t > 99.83 ? seg(t, 99.83, 100.05) : 0;
      J.rotation.set(-PI2 * 0.9, PI2, 0);
    } else if (t < 107.9) { // levanta e desvia
      kp = [-3.5, 0, 0];
      const up = seg(t, 102.0, 103.0); jp = [-10.0, lerp(0.35, 0.86, up), 0]; if (up < 1) J.rotation.set(-PI2 * 0.9 * (1 - up), PI2, 0);
      const slam = seg(t, 104.2, 104.6) * (1 - seg(t, 105.4, 105.9)); kpose = { armR: 1.9 * slam, foreR: 0.3 * slam, lean: 0.4 * slam };
      const roll = seg(t, 104.2, 104.55); jp[2] = 1.8 * roll; jp[0] = -10 + 0.2 * roll;
      const sweep = seg(t, 106.2, 106.6) * (1 - seg(t, 107.0, 107.5)); kpose.armL = 1.4 * sweep; kpose.spreadL = 0.6 * sweep; kpose.twist = -0.5 * sweep;
      if (sweep > 0.2 && sweep < 0.95) jp[1] = 0.55;
      if (t > 104.6 && t < 104.9) { shake = 0.1; } rockBurst([-9.6, 0, 0], lin(t, 104.6, 105.8), 3, 3, 4);
      jface = { open: 1.1, mouth: 'flat', brow: -0.4, browTilt: 0.4 };
      camPos = [-7.0, 2.4, 9.5]; camLook = [-7, 2.3, 0.6]; camera.fov = 52;
    } else if (t < 115.4) { // um soco, dois, dez... o gigante cansou
      kp = [-5.0, 0, 0]; jp = [-9.6, 0.86, 0];
      const P = [[108.0, 1], [108.95, -1]]; let dz = 0;
      P.forEach(([t0, s]) => { const k = seg(t, t0, t0 + 0.22) * (1 - seg(t, t0 + 0.5, t0 + 0.8)); dz += s * 1.1 * k; if (k > 0) { if (s > 0) kpose.armR = 1.5 * k; else kpose.armL = 1.5 * k; } });
      if (t > 109.77 && t < 110.68) { const r = (t - 109.77) / 0.91 * 6, ph = r % 1; dz = Math.sin(r * Math.PI) * 1.0; kpose.armR = Math.max(0, Math.sin(r * 2 * Math.PI)) * 1.5; kpose.armL = Math.max(0, -Math.sin(r * 2 * Math.PI)) * 1.5; jGhosts.forEach((g, i) => setGhost(g, [jp[0], 0.2, dz - Math.sin((r - (i + 1) * 0.12) * Math.PI) * 0.8], 0.25 * (1 - i / 6))); ov.slow = true; }
      jp[2] = dz;
      const tired = seg(t, 110.68, 111.4); kpose.lean = 0.45 * tired; kpose.breathe = tired * 0.04 * Math.sin(t * 6); kpose.armL = kpose.armL || 0.2 * tired; kpose.armR = kpose.armR || 0.2 * tired;
      if (tired > 0) for (let i = 0; i < 8; i++) { const ph = (t * 0.6 + i / 8) % 1; puff(i, [kp[0] - 0.3 + (hash(i) - 0.5), 7.8 + ph * 2, (hash(i + 2) - 0.5)], ph, 0.8, '#d8e2dc'); }
      jface = { open: 1.0, mouth: 'flat', brow: -0.4, browTilt: 0.4 };
      if (t < 110.68) { const a = lerp(-0.2, 1.4, (t - 107.9) / 2.8); camPos = [jp[0] + Math.sin(a) * 6, 2.0, Math.cos(a) * 6]; camLook = [jp[0] + 1, 2.0, 0]; camera.fov = 52; roll = 0.08; }
      else { camPos = [-1.5, 3.2, 12.0]; camLook = [-6, 4.0, 0]; camera.fov = 50; }
      ov.fx = t > 108.0 && t < 108.5 ? ['VUUSH!', 1, '#7df9ff', 35, 30, 150] : t > 108.95 && t < 109.45 ? ['VUUSH!', 1, '#7df9ff', 62, 30, 150] : null;
    } else if (t < 126.3) { // o soco de energia
      kp = [-5.0, 0, 0]; kpose = { lean: 0.45, armL: 0.2, armR: 0.2, breathe: 0.04 * Math.sin(t * 6) };
      const ch = seg(t, 115.6, 120.4); jp = [-9.2, 0.86, 0];
      jpose = { armR: [lerp(0.9, 0.4, ch), 0.2, lerp(1.8, 2.2, ch)], armL: [0.9, 0.2, 1.8], lean: 0.1 };
      jface = { open: t < 119.0 ? 0.06 : 1.1, mouth: t > 120.6 ? 'o' : 'flat', brow: t < 119 ? 0 : -0.6, browTilt: 0.5 };
      braceMat.emissiveIntensity = 3 + 5 * ch; auraJ(ch, t);
      const dash = seg(t, 120.6, 121.25); const hit = t > 121.25;
      if (t > 120.6) { jp = [lerp(-9.2, -6.3, dash), 0.86 + 5.2 * Math.sin(dash * PI2), 0]; jpose = { armR: [lerp(0.4, 2.9, dash), -0.1, 0.05], armL: [0.6, 0.4, 1.2], lean: -0.2, leg: [0.6, -0.4] }; }
      if (t > 121.25) { const kb = lin(t, 121.42, 124.0); jp = [-6.3 - 1.5 * sm(kb), lerp(6.1, 0.86, sm(lin(t, 121.6, 122.4))), 0]; kpose = { lean: lerp(0.45, -1.45, sm(kb)), armL: 1.2 * sm(kb), armR: 1.2 * sm(kb), spreadL: 1, spreadR: 1 }; kp = [-5.0 + 2.2 * sm(kb), 0, 0]; ov.slow = t < 123.4; }
      scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v);
      fist.visible = fistIn.visible = ch > 0.05 && t < 121.5; fist.position.copy(v); fistIn.position.copy(v); fist.scale.setScalar(0.15 + 0.45 * ch); fistIn.scale.setScalar(0.1 + 0.25 * ch); fist.material.opacity = 0.6; fistIn.material.opacity = 0.9;
      motes.forEach((m, i) => { if (ch <= 0 || t > 121.2) return; const ph = 1 - ((t * 0.9 + i / 24) % 1); m.visible = true; const a = i * 2.4 + t * 3; m.position.set(v.x + Math.cos(a) * 1.6 * ph, v.y + Math.sin(a * 0.7) * 1.2 * ph, v.z + Math.sin(a) * 1.6 * ph); m.scale.setScalar(1.3); });
      if (t > 121.25 && t < 121.42) { impact = t < 121.32; flash = 1; shake = 0.2; }
      ringAt(0, [-6.0, 6.2, 0], t - 121.25, 6, [0, PI2, 0], 0.7, '#7df9ff'); burstSparks([-6.0, 6.2, 0], lin(t, 121.25, 122.2), 4, 5);
      if (t > 124.0) { ringAt(1, [-1.5, 0.08, 0], t - 124.0, 9, [PI2, 0, 0], 0.9, '#e0d5c0'); rockBurst([-1.5, 0, 0], lin(t, 124.0, 125.6), 6, 5, 8); for (let i = 0; i < 20; i++) { const a = i * 0.31; puff(i, [-1.5 + Math.cos(a) * (1 + 5 * lin(t, 124, 126)), 0.5, Math.sin(a) * (1 + 5 * lin(t, 124, 126))], lin(t, 124.0, 126.3), 2.0, '#8a8290'); } if (t < 124.4) shake = 0.15; }
      if (t < 118.4) { const k = sm((t - 115.4) / 3); camPos = mix3([-6.5, 1.0, 5.5], [-7.6, 1.6, 3.2], k); camLook = [-9.2, 1.7, 0]; camera.fov = 44; }
      else if (t < 120.6) { scene.updateMatrixWorld(true); camPos = [v.x + 2.2, v.y + 0.7, v.z + 2.6]; camLook = [v.x, v.y, v.z]; camera.fov = 40; }
      else if (t < 121.25) { camPos = [-12.5, 2.0, 3.5]; camLook = [-5, 5, 0]; camera.fov = 56; ov.speed = 0.7; }
      else if (t < 124.0) { camPos = [-6.5, 2.0, 11.5]; camLook = [-4.0, 4.0, 0]; camera.fov = 56; }
      else { camPos = [-8.0, 3.0, 12.5]; camLook = [-3.0, 1.6, 0]; camera.fov = 52; }
      ov.fx = t > 121.25 && t < 122.6 ? ['BOOM!', seg(t, 121.25, 121.4), '#7df9ff', 55, 32, 260] : t > 124.0 && t < 125.2 ? ['KRASH!', seg(t, 124.0, 124.15), '#ff9f1c', 50, 55, 200] : null;
      ov.score = t > 122.2 ? 1 : 0;
      if (t > 121.42) { jpose = { ...jpose }; }
    } else { // lição 1
      kp = [-2.8, 0.1, 0]; kpose = { lean: -1.45, armL: 1.2, armR: 1.2, spreadL: 1, spreadR: 1 }; kEyes.forEach(e => e.material.emissiveIntensity = 0.3);
      jp = [-7.8, 0.86, 0.6]; jpose = { breathe: jb, armR: [0.1, 0.3, 0.3], armL: [0.1, 0.3, 0.3] }; jface = { open: 0.06, mouth: 'smile', brow: 0 }; auraJ(0.5, t);
      const a = lerp(0.6, -0.2, sm((t - 126.3) / 5.2)); camPos = [-7.8 + Math.sin(a) * 6.5, 2.4, 0.6 + Math.cos(a) * 6.5]; camLook = [-6.5, 2.0, 0.3]; camera.fov = 46;
      ov.lesson = ['LIÇÃO 1', 'A FORÇA CANSA.<br><span style="color:#7df9ff">A PACIÊNCIA NÃO.</span>', seg(t, 126.36, 126.6)]; ov.score = 1;
    }
    if (!(t > 92.0 && t < 103.0) && !(t > 90.68 && t < 92.0)) J.rotation.set(0, jr, 0);
    J.position.set(...jp); jo.pose({ breathe: jb, ...jpose }); jo.face(jface);
    krom.position.set(...kp); krom.rotation.y = kr; kPose(kpose);
    ov.ex = 0.7;
  } else if (t < 183.2) { // ================= LUTA 2: VEXA =================
    arenaOn(t, 0.7); VX.visible = true;
    let jp = [-2.5, 0.86, 0], jr = PI2, vp = [3, 0.86, 0], vr = -PI2, jpose = { ...GUARD }, jface = { open: blink(t), mouth: 'flat', brow: -0.3, browTilt: 0.3 }, vpose = { breathe: jb, armL: [0.2, 0.6, 1.6], armR: [0.2, 0.6, 1.6] };
    vx.face({ open: 0.8, mouth: 'smile', brow: -0.4, browTilt: 0.4 });
    ov.score = 1;
    if (t < 136.0) { // entrada relâmpago
      const k = lin(t, 131.6, 132.1); vp = [lerp(14, 3, k), 0.86, 0]; if (k < 1) vGhosts.forEach((g, i) => setGhost(g, [vp[0] + (i + 1) * 1.6, 0, 0], 0.4 * (1 - i / 6)));
      if (t > 132.1 && t < 132.3) flash = 0.6;
      ov.nc = t > 133.0 && t < 135.9 ? ['VEXA', 'A MAIS RÁPIDA DA GALÁXIA', '#4cc9f0', seg(t, 133.0, 133.2)] : null;
      camPos = [5.2, 1.0, 4.5]; camLook = [3, 1.8, 0]; camera.fov = 46;
    } else if (t < 145.2) { // corre em círculos
      const a = t * 8.5; vp = [jp[0] + Math.cos(a) * 2.8, 0.86, Math.sin(a) * 2.8]; vr = a + Math.PI;
      vGhosts.forEach((g, i) => { const b = a - (i + 1) * 0.35; setGhost(g, [jp[0] + Math.cos(b) * 2.8, 0, Math.sin(b) * 2.8], 0.35 * (1 - i / 6)); });
      vpose = { lean: 0.5, armL: [-0.8, 0.1, 0.3], armR: [-0.8, 0.1, 0.3], leg: [Math.sin(t * 40) * 0.8, -Math.sin(t * 40) * 0.8] };
      jr = PI2 + 0.6 * Math.sin(t * 3); jface = { open: 1.2, mouth: 'o', brow: 1.0, look: [Math.sin(t * 9), 0.2 * Math.cos(t * 7)] };
      if (t < 139.8) { camPos = [jp[0] + 4.5, 4.5, 6.5]; camLook = [jp[0], 1.0, 0]; camera.fov = 50; }
      else { camPos = [jp[0] + 2.4, 2.25, 0.4]; camLook = [jp[0], 2.1, 0]; camera.fov = 38; }
      ov.speed = 0.4;
    } else if (t < 151.4) { // golpes de todos os lados
      const H = [[146.18, [jp[0], 0.86, -1.3], 'POW!'], [147.63, [jp[0], 0.86, 1.3], 'BAM!'], [148.76, [jp[0] - 1.3, 0.86, 0], 'WHAM!']];
      let push = [0, 0, 0]; vp = [20, 0.86, 0];
      H.forEach(([t0, p, w], i) => { if (t > t0 - 0.25 && t < t0 + 0.45) { vp = p; vr = facing(p, jp); vpose = { lean: 0.2, armR: [1.6, 0, 0.05], leg: [1.2, 0] }; if (t > t0 && t < t0 + 0.12) { flash = 0.5; shake = 0.08; impact = t < t0 + 0.05; } if (t > t0) ov.fx = [w, seg(t, t0, t0 + 0.1), '#4cc9f0', [30, 70, 50][i], 35, 190]; } if (t > t0) { const k = seg(t, t0, t0 + 0.3); push = [i === 2 ? 0.6 * k : push[0], 0, i === 0 ? 0.5 * k : i === 1 ? -0.5 * k : push[2]]; } });
      const fall = seg(t, 149.0, 149.6);
      jp = [jp[0] + push[0], lerp(0.86, 0.35, fall), push[2]]; jface = { open: 1.3, mouth: 'o', brow: 1.2 };
      if (fall > 0) { J.rotation.set(PI2 * 0.9 * fall, jr, 0); }
      camPos = [jp[0] + 0.3, 1.9, 5.6]; camLook = [jp[0], 1.4, 0]; camera.fov = 48;
    } else if (t < 157.2) { // fecha os olhos
      const up = seg(t, 151.6, 152.8); jp = [-1.9, lerp(0.35, 0.86, up), 0]; if (up < 1) J.rotation.set(PI2 * 0.9 * (1 - up), jr, 0);
      vp = [3.5, 0.86, -1.5]; vr = facing(vp, jp); vpose = { breathe: jb, armL: [1.2, -0.6, 2.2], armR: [1.2, -0.6, 2.2] };
      const close = seg(t, 155.0, 155.4); jface = { open: lerp(1, 0.05, close), mouth: 'flat', brow: lerp(-0.3, 0, close) };
      jpose = { breathe: jb, armL: [lerp(0.9, 0.1, close), 0.25, lerp(1.8, 0.3, close)], armR: [lerp(0.9, 0.1, close), 0.25, lerp(1.8, 0.3, close)] };
      const k = sm((t - 151.4) / 5.8); camPos = mix3([1.5, 2.0, 5.5], [-0.2, 2.15, 2.2], k); camLook = [-1.9, 2.0, 0]; camera.fov = 40;
      ov.ex = 0.1;
    } else if (t < 160.3) { // o Zib na beira da arena
      Z.visible = true; Z.position.set(-9, 0.53, 9); Z.rotation.y = facing([-9, 0, 9], [-2, 0, 0]); zb.pose({ scl: [0.62, 0.62, 0.62], armL: [1.5, -0.4, 1.8], armR: [1.5, -0.4, 1.8] }); zb.face({ open: blink(t), mouth: 'smile', talk: zTalk, brow: 0.4 });
      jp = [-1.9, 0.86, 0]; jface = { open: 0.05, mouth: 'flat', brow: 0 }; jpose = { breathe: jb, armL: [0.1, 0.25, 0.3], armR: [0.1, 0.25, 0.3] };
      vp = [3.5, 0.86, -1.5]; vr = facing(vp, jp);
      camPos = [-8.0, 1.2, 10.8]; camLook = [-9, 0.9, 9]; camera.fov = 40;
    } else if (t < 168.7) { // câmera lenta: sente o vento
      jp = [-1.9, 0.86, 0]; jface = { open: 0.05, mouth: 'flat', brow: 0 }; jpose = { breathe: 0.5 * jb, armL: [0.1, 0.25, 0.3], armR: [0.1, 0.25, 0.3] };
      const k = sm((t - 160.3) / 8.4);
      vp = [lerp(-9, -3.2, k), 0.86 + 1.2 * k, lerp(4, 0.3, k)]; vr = facing(vp, jp); vpose = { lean: 0.4, armL: [-0.6, 0.2, 0.3], armR: [-0.6, 0.2, 0.3], leg: [1.4 * k, -0.2] };
      vGhosts.forEach((g, i) => setGhost(g, [lerp(-9, -3.2, k - (i + 1) * 0.04), 0 + 1.2 * k, lerp(4, 0.3, k - (i + 1) * 0.04)], 0.2 * (1 - i / 6)));
      for (let i = 0; i < 4; i++) ringAt(i, [jp[0], 0.05, 0], ((t - 160.3 + i * 0.7) % 2.8), 3.5, [PI2, 0, 0], 2.8, '#7df9ff');
      auraJ(0.5, t);
      const a = lerp(2.2, 3.4, k); camPos = [jp[0] + Math.sin(a) * 5.5, 1.4, Math.cos(a) * 5.5]; camLook = [jp[0] - 0.5, 1.6, 0.2]; camera.fov = 48; roll = -0.06;
      ov.slow = true; ov.blue = true;
    } else if (t < 176.7) { // ESCUDO! e contra-ataque
      jp = [-1.9, 0.86, 0];
      const turn = seg(t, 168.72, 168.85); jr = lerp(PI2, -PI2 + 0.3, turn);
      const kick = lin(t, 168.6, 169.0); vp = [lerp(-3.2, -3.0, kick), 1.9, lerp(0.3, 0.1, kick)];
      vpose = { lean: 0.3, leg: [1.5, -0.2], armL: [0.5, 0.6, 0.4], armR: [0.5, 0.6, 0.4] }; vr = facing(vp, jp);
      const sh = seg(t, 168.8, 168.95) * (1 - seg(t, 169.5, 169.8));
      jpose = { armL: [1.7, 0.2, 0.3], armR: [0.9, 0.2, 1.8] }; jface = { open: t > 169.57 ? 1.1 : 0.05, mouth: 'flat', brow: -0.5, browTilt: 0.5 };
      if (sh > 0) { scene.updateMatrixWorld(true); J.getWorldPosition(v); shield.visible = shieldRim.visible = true; shield.position.set(v.x - 0.6, v.y + 0.8, v.z + 0.1); shield.scale.setScalar(1.5 * sh); shield.material.opacity = 0.3 * sh; shieldRim.position.copy(shield.position); shieldRim.scale.setScalar(1.5 * sh); shieldRim.rotation.set(0, PI2, 0); shieldRim.material.opacity = 0.9 * sh; }
      if (t > 169.0 && t < 169.15) { impact = t < 169.05; flash = 0.7; shake = 0.12; }
      ringAt(0, [-2.6, 1.7, 0.1], t - 169.0, 3, [0, PI2, 0], 0.5, '#7df9ff'); burstSparks([-2.6, 1.7, 0.1], lin(t, 169.0, 169.8), 2.5, 2);
      const cp = seg(t, 169.6, 170.0);
      if (t > 169.6) { jr = lerp(-PI2 + 0.3, -PI2, cp); jpose = { armR: [lerp(0.9, 1.6, cp), -0.1, lerp(1.8, 0.05, cp)], armL: [0.9, 0.2, 1.8], lean: 0.3 * cp }; scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); fist.visible = fistIn.visible = t < 170.3; fist.position.copy(v); fistIn.position.copy(v); fist.scale.setScalar(0.4); fistIn.scale.setScalar(0.22); fist.material.opacity = 0.6; fistIn.material.opacity = 0.9; }
      if (t > 170.0) { const fl = lin(t, 170.0, 171.0); vp = [lerp(-3.0, -14, sm(fl)), 1.9 + Math.sin(fl * Math.PI) * 1.5 - 1.4 * fl, lerp(0.1, 1.5, fl)]; vpose = { armL: [2.5, 0.8, 0.2], armR: [2.5, 0.8, 0.2], leg: [0.5, -0.3] }; if (t < 170.15) { impact = t < 170.05; flash = 0.9; shake = 0.15; } }
      if (t > 171.0) { vp = [-14.2, 0.4, 1.5]; for (let i = 0; i < 12; i++) puff(i, [-14 + (hash(i) - 0.2) * 2, 0.5 + 2 * hash(i + 1), 1.5 + (hash(i + 3) - 0.5) * 3], lin(t, 171.0, 173.0), 1.6, '#8a8290'); }
      if (t < 169.6) { camPos = [-1.0, 2.4, 6.2]; camLook = [-2.4, 1.6, 0]; camera.fov = 46; ov.slow = true; }
      else if (t < 171.9) { camPos = [-6, 2.6, 11.5]; camLook = [-6.5, 1.8, 0]; camera.fov = 58; }
      else { hostAnim(t, aTalk); camPos = [3, 5.5, 8.5]; camLook = [0, 8.0, -2]; camera.fov = 50; ov.ex = 1; }
      ov.fx = t > 168.72 && t < 169.55 ? ['ESCUDO!', seg(t, 168.72, 168.9), '#7df9ff', 50, 22, 170] : t > 170.0 && t < 171.0 ? ['POW!', seg(t, 170.0, 170.1), '#ffd60a', 40, 35, 240] : t > 171.0 && t < 171.8 ? ['CRASH!', seg(t, 171.0, 171.12), '#4cc9f0', 22, 50, 180] : null;
      ov.score = t > 171.9 ? 2 : 1;
    } else { // lição 2
      VX.visible = false; jp = [-1.9, 0.86, 0]; jr = 0.3; jpose = { breathe: jb, armR: [0.1, 0.3, 0.3], armL: [0.1, 0.3, 0.3] }; jface = { open: 0.06, mouth: 'smile', brow: 0 }; auraJ(0.5, t);
      const a = lerp(0.7, -0.3, sm((t - 176.7) / 6.5)); camPos = [-1.9 + Math.sin(a) * 6, 2.2, Math.cos(a) * 6]; camLook = [-1.9, 1.9, 0]; camera.fov = 44;
      ov.lesson = ['LIÇÃO 2', 'QUANDO TUDO FICA RÁPIDO DEMAIS,<br><span style="color:#7df9ff">O FOCO DEIXA TUDO LENTO.</span>', seg(t, 176.77, 177.0)]; ov.score = 2;
    }
    if (!(t > 149.0 && t < 152.8)) J.rotation.set(0, jr, 0);
    J.position.set(...jp); jo.pose({ breathe: jb, ...jpose }); jo.face(jface);
    VX.position.set(...vp); VX.rotation.set(0, vr, 0); vx.pose(vpose);
    ov.ex = ov.ex === undefined ? 0.7 : ov.ex;
  } else if (t < 238.4) { // ================= LUTA 3: MULTIX =================
    arenaOn(t, 0.6); ov.score = 2;
    const C = [0, 0.86, 0]; let jr = PI2, jpose = { ...GUARD }, jface = { open: blink(t), mouth: 'flat', brow: -0.3, browTilt: 0.3 }, jp = [...C];
    const circ = i => { const a = i / 8 * Math.PI * 2; return [Math.cos(a) * 3.2, 0.86, Math.sin(a) * 3.2]; };
    let nShow = 1, mpos = [[4, 0.86, 0]], mirror = 0, frozen = false, real = 5;
    if (t < 188.0) { // entrada
      mx[0].root.visible = true; const k = seg(t, 183.4, 184.2);
      mpos = [[4, 0.86, 0]]; mPuffs[0].visible = k < 1; mPuffs[0].position.set(4, 1.4, 0); mPuffs[0].scale.setScalar(1.5 + k); mPuffs[0].material.opacity = 0.7 * (1 - k);
      ov.nc = t > 184.5 && t < 187.9 ? ['MULTIX', 'O LUTADOR QUE SE MULTIPLICA', '#c77dff', seg(t, 184.5, 184.7)] : null;
      camPos = [6.2, 1.3, 4.2]; camLook = [4, 1.9, 0]; camera.fov = 44;
    } else if (t < 194.9) { // multiplica: 2, 4, 8
      const s1 = seg(t, 189.16, 189.6), s2 = seg(t, 190.71, 191.15), s3 = seg(t, 191.95, 192.6);
      nShow = t < 189.16 ? 1 : t < 190.71 ? 2 : t < 191.95 ? 4 : 8;
      mpos = mx.map((c, i) => { const target = circ(i); const start = [4, 0.86, 0]; const k = i === 0 ? s3 : i === 1 ? Math.max(s1 * 0.5, s3) : i < 4 ? s3 : s3; let p = mix3(start, target, k); if (nShow === 2 && i === 1) p = [4, 0.86, 1.4 * s1]; if (nShow === 4 && i < 4) p = [4 - 0.6 * (i % 2), 0.86, -1.6 + i * 1.05 * s2 + (1 - s2) * (i === 1 ? 1.4 : 0)]; return p; });
      [189.16, 190.71, 191.95].forEach((t0, j) => { if (t > t0 && t < t0 + 0.2) flash = 0.35; });
      camPos = [0.5, 9.5, 8.5]; camLook = [0.5, 0.5, 0]; camera.fov = 50;
      jface = { open: 1.3, mouth: 'o', brow: 1.0, look: [Math.sin(t * 3), 0] };
    } else if (t < 201.0) { // soca um: fumaça; os clones copiam
      nShow = 8; mpos = mx.map((c, i) => circ(i));
      const pn = seg(t, 195.7, 195.98) * (1 - seg(t, 196.4, 196.8)); jr = facing(C, circ(0)); jpose = { armR: [lerp(0.9, 1.6, pn), -0.1, lerp(1.8, 0.05, pn)], armL: [0.9, 0.2, 1.8] };
      if (t > 195.98) { mx[0].root.visible = false; mPuffs[0].visible = t < 197.4; mPuffs[0].position.set(...circ(0)); mPuffs[0].position.y = 1.4; const k = lin(t, 195.98, 197.4); mPuffs[0].scale.setScalar(0.8 + 1.4 * k); mPuffs[0].material.opacity = 0.7 * (1 - k); }
      if (t > 197.43) { const up = seg(t, 197.6, 198.2) * (1 - seg(t, 199.4, 199.9)); jpose = { armR: [lerp(0.9, 2.9, up), 0.1, 0.2], armL: [0.9, 0.2, 1.8] }; mirror = up; jr = PI2 + 0.6 * seg(t, 198.6, 199.3); }
      camPos = t < 197.43 ? [-3.5, 2.6, 6.5] : [0.4, 5.5, 9.0]; camLook = [0.8, 1.4, 0]; camera.fov = 50;
      ov.fx = t > 195.98 && t < 196.8 ? ['PUF!', seg(t, 195.98, 196.1), '#c77dff', 60, 35, 180] : null;
    } else if (t < 205.7) { // energia acabando
      nShow = 8; mpos = mx.map((c, i) => circ(i)); jpose = { breathe: 0.03 * Math.sin(t * 5), armL: [0.6, 0.3, 1.0], armR: [1.2, 0.1, 1.6], lean: 0.2 };
      braceMat.emissiveIntensity = Math.sin(t * 25) > 0.3 ? 2.5 : 0.1; jface = { open: 1.1, mouth: 'o', brow: 0.9, look: [0, -0.8] };
      scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v);
      if (t < 203.0) { camPos = [v.x + 0.9, v.y + 0.5, v.z + 1.3]; camLook = [v.x, v.y, v.z]; camera.fov = 36; } else { camPos = [1.4, 2.3, 2.8]; camLook = [0, 2.0, 0]; camera.fov = 40; }
      ov.energy = t > 202.0 ? 1 : 0;
    } else if (t < 217.6) { // ideia: ficar parado. Todos param... menos um
      nShow = 8; mpos = mx.map((c, i) => circ(i));
      jpose = { armL: [0.1, 0.25, 0.3], armR: [0.1, 0.25, 0.3] }; jr = PI2;
      jface = t < 207.3 ? { open: 1.1, mouth: 'flat', brow: 0.4, look: [0.4, 0.4] } : t < 209.33 ? { open: 1.3, mouth: 'smile', brow: 0.8 } : { open: 0.05, mouth: 'flat', brow: 0 };
      frozen = t > 212.34; mirror = 0;
      if (t < 212.3) { const k = sm((t - 205.7) / 6.6); camPos = mix3([2.2, 2.1, 3.5], [1.2, 2.15, 2.4], k); camLook = [0, 2.0, 0]; camera.fov = 40; }
      else { const a = lerp(0, 2.2, sm((t - 212.3) / 5.3)); camPos = [Math.sin(a) * 7.5, 2.6, Math.cos(a) * 7.5]; camLook = [0, 1.4, 0]; camera.fov = 50; }
      ov.ex = frozen ? 0 : 0.3; ov.bw = frozen && t < 215.99;
      if (t > 215.99) { const c = circ(real); hiRing.visible = true; hiRing.position.set(c[0], 0.06, c[2]); hiRing.scale.setScalar(1 + 0.2 * Math.sin(t * 8)); hiRing.material.opacity = 0.9; }
    } else if (t < 223.4) { // o verdadeiro se mexeu: zoom
      nShow = 8; mpos = mx.map((c, i) => circ(i)); frozen = true;
      jpose = { armL: [0.1, 0.25, 0.3], armR: [0.1, 0.25, 0.3] }; jr = facing(C, circ(real));
      jface = t > 222.3 ? { open: 1.0, mouth: 'flat', brow: -0.6, browTilt: 0.6, look: [0.3, 0] } : { open: 0.05, mouth: 'flat', brow: 0 };
      if (t > 222.46) eyesGlow(t);
      const c = circ(real); hiRing.visible = true; hiRing.position.set(c[0], 0.06, c[2]); hiRing.material.opacity = 0.9;
      if (t < 222.4) { const k = sm((t - 217.6) / 4.8); const d = lerp(9, 2.6, k); const dir = new THREE.Vector3(c[0], 0, c[2]).normalize(); camPos = [c[0] - dir.x * d - dir.z * 1.0, 1.7 + 0.45 * d, c[2] - dir.z * d + dir.x * 1.0]; camLook = [c[0], 1.7, c[2]]; camera.fov = lerp(22, 60, k); }
      else { scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); const d = new THREE.Vector3(Math.sin(jr), 0, Math.cos(jr)); camPos = [v.x + d.x * 1.6, v.y, v.z + d.z * 1.6]; camLook = [v.x, v.y - 0.05, v.z]; camera.fov = 40; }
      ov.ex = 0; ov.bw = t < 222.4;
    } else if (t < 233.0) { // golpe final + vitória
      const c = circ(real); const dash = seg(t, 223.5, 224.2);
      jp = mix3(C, [c[0] * 0.72, 0.86, c[2] * 0.72], dash); jr = facing(C, c);
      jpose = dash > 0 ? { armR: [lerp(0.9, 1.6, dash), -0.1, lerp(1.8, 0.05, dash)], armL: [0.9, 0.2, 1.8], lean: 0.35 * dash } : GUARD;
      jface = { open: 1.1, mouth: dash > 0.3 ? 'o' : 'flat', brow: -0.6, browTilt: 0.6 };
      nShow = t < 224.4 ? 8 : 1; mpos = mx.map((cc, i) => circ(i));
      if (t > 224.4) { // clones viram fumaça; o verdadeiro voa
        mx.forEach((cc, i) => { if (i === real) return; const k = lin(t, 224.4, 225.8); mPuffs[i].visible = k < 1; mPuffs[i].position.set(...circ(i)); mPuffs[i].position.y = 1.4; mPuffs[i].scale.setScalar(0.8 + 1.5 * k); mPuffs[i].material.opacity = 0.7 * (1 - k); });
        const fl = lin(t, 224.42, 226.6); mpos[real] = [c[0] * (1 + 3 * fl), 0.86 + 22 * fl * fl + 4 * fl, c[2] * (1 + 3 * fl)];
      }
      if (t > 224.2 && t < 224.42) { impact = t < 224.28; flash = 1; shake = 0.2; }
      ringAt(0, [c[0] * 0.85, 1.6, c[2] * 0.85], t - 224.2, 7, [0, PI2 - Math.atan2(c[2], c[0]), 0], 0.8, '#7df9ff'); ringAt(1, [0, 0.06, 0], t - 224.3, 12, [PI2, 0, 0], 1.0, '#c77dff'); burstSparks([c[0] * 0.85, 1.6, c[2] * 0.85], lin(t, 224.2, 225.2), 4, 9);
      scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); fist.visible = fistIn.visible = dash > 0.1 && t < 224.6; fist.position.copy(v); fistIn.position.copy(v); fist.scale.setScalar(0.7); fistIn.scale.setScalar(0.35); fist.material.opacity = 0.7; fistIn.material.opacity = 0.95; auraJ(dash, t);
      if (t < 224.42) { camPos = [-4.5, 1.6, 4.5]; camLook = [c[0] * 0.8, 1.6, c[2] * 0.8]; camera.fov = 50; ov.speed = dash * 0.8; }
      else if (t < 227.6) { camPos = [c[0] * 0.5 - 3, 0.6, c[2] * 0.5 + 5]; camLook = [mpos[real][0], Math.min(mpos[real][1], 14), mpos[real][2]]; camera.fov = 60; ov.slow = t < 225.6; }
      else { // vitória
        nShow = 0; jp = [0, 0.86, 0]; jr = 0.2; jpose = { breathe: jb, armR: [3.0, -0.1, 0.1], armL: [0.2, 0.4, 0.4] }; jface = { open: 1.0, mouth: 'smile', brow: 0.6 };
        Z.visible = true; const zj = Math.abs(Math.sin(t * 6)) * 0.4; Z.position.set(1.4, 0.53 + zj, 0.8); Z.rotation.y = -0.2; zb.pose({ scl: [0.62, 0.62, 0.62], armL: [2.9, 0.4, 0.2], armR: [2.9, 0.4, 0.2] }); zb.face({ open: 1.2, mouth: 'smile', brow: 0.8 });
        fireworks(t, 227.6); confetti.forEach((m, i) => { const ph = ((t - 227.6) * 0.25 + hash(i)) % 1; m.visible = true; m.position.set((hash(i + 1) - 0.5) * 16, 14 - ph * 14, (hash(i + 2) - 0.5) * 12); m.rotation.set(t * 3 + i, t * 2 + i, 0); });
        hostAnim(t, aTalk); auraJ(0.6, t);
        const a = lerp(-0.5, 0.5, sm((t - 227.6) / 5.4)); camPos = [Math.sin(a) * 6.5, 0.8, Math.cos(a) * 6.5]; camLook = [0.3, 2.4, 0]; camera.fov = 52; ov.ex = 1;
        ov.champ = seg(t, 228.0, 228.3);
      }
      ov.fx = t > 224.2 && t < 225.6 ? ['KA-POW!', seg(t, 224.2, 224.35), '#7df9ff', 50, 30, 250] : null; ov.score = t > 227.6 ? 3 : 2;
    } else { // lição 3
      jp = [0, 0.86, 0]; jr = 0.2; jpose = { breathe: jb, armR: [0.1, 0.3, 0.3], armL: [0.1, 0.3, 0.3] }; jface = { open: 0.06, mouth: 'smile', brow: 0 }; auraJ(0.6, t);
      confetti.forEach((m, i) => { const ph = ((t - 227.6) * 0.25 + hash(i)) % 1; m.visible = true; m.position.set((hash(i + 1) - 0.5) * 16, 14 - ph * 14, (hash(i + 2) - 0.5) * 12); m.rotation.set(t * 3 + i, t * 2 + i, 0); });
      nShow = 0; const a = lerp(0.6, -0.4, sm((t - 233) / 5.4)); camPos = [Math.sin(a) * 6, 2.3, Math.cos(a) * 6]; camLook = [0, 1.9, 0]; camera.fov = 44;
      ov.lesson = ['LIÇÃO 3', 'QUEM DOMINA A CALMA,<br><span style="color:#7df9ff">DOMINA A LUTA.</span>', seg(t, 233.04, 233.3)]; ov.score = 3; ov.ex = 0.8;
    }
    J.position.set(...jp); J.rotation.set(0, jr, 0); jo.pose({ breathe: frozen ? 0 : jb, ...jpose }); jo.face(jface);
    mx.forEach((c, i) => {
      if (i >= nShow || (t > 195.98 && t < 201 && i === 0) || (t > 224.4 && i !== real)) { c.root.visible = false; return; }
      c.root.visible = true; const p = mpos[i] || mpos[0]; c.root.position.set(...p); c.root.rotation.set(t > 224.42 && i === real ? t * 6 : 0, facing(p, C), 0);
      const move = frozen && i === real && t > 215.99; const tap = move ? Math.max(0, Math.sin(t * 9)) : 0;
      c.pose({ breathe: frozen && !move ? 0 : breath(t, i), armR: mirror ? [lerp(0.9, 2.9, mirror), 0.1, 0.2] : [0.9, 0.2, 1.8], armL: [0.9, 0.2, 1.8], leg: [0, -0.3 * tap], head: move ? [0, 0, 0.15 * Math.sin(t * 5)] : [0, 0, 0] });
      c.face({ open: frozen && !move ? 1 : blink(t, i * 0.7), mouth: 'smile', brow: -0.5, browTilt: 0.5 });
    });
  } else if (t < 244.7) { // ======== JO-SEPH! e a luz azul ========
    arenaOn(t, 1); hostAnim(t, 0);
    J.position.set(0, 0.86 + 8 * Math.pow(lin(t, 241.3, 244.7), 1.5), 0); J.rotation.y = 0.2 + 0.5 * lin(t, 241.3, 244.7);
    jo.pose({ breathe: jb, armR: [2.6 + 0.3 * Math.sin(t * 8), 0.5, 0.3], armL: [0.2, 0.4, 0.4] }); jo.face({ open: 1.0, mouth: 'smile', brow: 0.6 });
    Z.visible = true; Z.position.set(1.4, 0.53, 0.8); Z.rotation.y = -0.4; zb.pose({ scl: [0.62, 0.62, 0.62], armR: [2.8 + 0.3 * Math.sin(t * 9), 0.6, 0.2] }); zb.face({ open: 1.1, mouth: 'smile', brow: 0.5, look: [0, 0.8] });
    const bk = seg(t, 240.8, 241.4); setBeam(new THREE.Vector3(0, 26, 0), new THREE.Vector3(0, 0, 0), 2.2, 0.35 * bk); blueLight.position.set(0, 4, 2); blueLight.intensity = 20 * bk;
    confetti.forEach((m, i) => { const ph = ((t - 227.6) * 0.25 + hash(i)) % 1; m.visible = true; m.position.set((hash(i + 1) - 0.5) * 16, 14 - ph * 14, (hash(i + 2) - 0.5) * 12); m.rotation.set(t * 3 + i, t * 2 + i, 0); });
    camPos = mix3([2.5, 1.0, 9], [2.0, 2.0, 12], sm((t - 238.4) / 6.3)); camLook = [0, 2.5 + 3 * lin(t, 241.3, 244.7), 0]; camera.fov = 50;
    ov.chant = t < 241.0 ? 1 : 0; ov.score = 3;
    if (t > 244.3) flash = (t - 244.3) / 0.4;
  } else { // ======== de volta ao quarto ========
    setRoom(true); setDay(1); scene.background.set('#1d2230');
    J.position.set(3.0, 0.8, -2.8); J.rotation.y = 0;
    const wake = seg(t, 246.5, 247.6), look = seg(t, 251.8, 252.4);
    jo.pose({ breathe: jb, leg: [1.5, 1.5], lean: lerp(0.75, 0, wake), head: [lerp(0.5, 0.25 * look, wake), 0, 0], armL: [1.25, 0.15, 1.3], armR: [lerp(1.25, 1.5, look), lerp(0.15, -0.3, look), lerp(1.3, 2.0, look)] });
    jo.face({ open: t < 246.5 ? 0.06 : (t > 253.6 ? 1.35 : blink(t)), mouth: t > 253.6 ? 'o' : 'flat', brow: t > 253.6 ? 1.0 : 0.2, look: [0, look > 0.5 ? -0.6 : 0] });
    braceMat.emissiveIntensity = t > 253.83 ? 4 + 2 * Math.sin(t * 6) : 2.5;
    if (t < 250.4) { const k = sm((t - 244.7) / 5.7); camPos = mix3([4.6, 2.2, 0.6], [3.9, 2.0, -0.2], k); camLook = [3.0, 1.4, -2.6]; camera.fov = 42; if (t < 245.1) flash = 1 - (t - 244.7) / 0.4; }
    else if (t < 256.0) { scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); if (t < 253.83) { camPos = [v.x + 0.7, v.y + 0.45, v.z + 1.2]; camLook = [v.x, v.y, v.z]; camera.fov = 34; } else { camPos = [3.15, 1.95, -1.2]; camLook = [3.0, 1.9, -2.8]; camera.fov = 40; } cyanLight.position.set(v.x, v.y + 0.3, v.z + 0.6); cyanLight.intensity = 3 + 2 * Math.sin(t * 6); }
    else { const k = sm((t - 256) / 12); camPos = mix3([3.3, 2.0, -0.6], [3.8, 2.5, 1.8], k); camLook = [3.0, 1.6, -2.6]; camera.fov = 42; ov.cta = seg(t, 256.1, 256.4); ov.follow = seg(t, 261.0, 261.3); }
  }

  camera.updateProjectionMatrix(); cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll); sky.position.copy(camera.position);
  if (!(t >= 19.9 && t < 24.3)) skyMat.color.setScalar(1);
  renderer.render(scene, camera);

  // ---------- overlays ----------
  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : ov.bw ? 'grayscale(1) contrast(1.2)' : ov.blue ? 'saturate(0.45) brightness(0.92) contrast(1.2)' : ov.slow ? 'saturate(0.65) contrast(1.15)' : '';
  $('burst').style.opacity = impact ? 1 : 0; $('flash').style.opacity = clamp(flash);
  $('lb').style.opacity = (ov.slow || ov.blue || ov.bw) ? 1 : 0;
  $('speed').style.opacity = ov.speed || 0; $('speed').style.transform = `rotate(${(Math.floor(t * 30) % 7) * 3}deg) scale(1.4)`;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('title', ov.title || 0); pop('lento', ov.lento || 0); pop('chant', ov.chant ? 0.6 + 0.4 * Math.abs(Math.sin(t * 5)) : 0); pop('cta', ov.cta || 0); pop('follow', ov.follow || 0); pop('champ', ov.champ || 0);
  const rl = $('rules'); rl.style.opacity = ov.rules ? 1 : 0; if (ov.rules) [0, 1, 2].forEach(i => { const e = $('r' + i); e.style.opacity = ov.rules[i] ? 1 : 0; e.style.transform = `scale(${0.5 + 0.5 * back(ov.rules[i])})`; });
  const nc = $('nc'); if (ov.nc) { nc.style.opacity = 1; $('ncn').textContent = ov.nc[0]; $('ncs').textContent = ov.nc[1]; nc.style.borderColor = ov.nc[2]; $('ncn').style.color = ov.nc[2]; nc.style.transform = `translateX(${(1 - back(ov.nc[3])) * -300}px)`; } else nc.style.opacity = 0;
  const ls = $('lesson'); if (ov.lesson) { ls.style.opacity = 1; $('lsn').textContent = ov.lesson[0]; $('lst').innerHTML = ov.lesson[1]; ls.style.transform = `translate(-50%,-50%) scale(${0.6 + 0.4 * back(ov.lesson[2])})`; } else ls.style.opacity = 0;
  const scb = $('score'); scb.style.opacity = ov.score && !ov.lesson && !ov.cta ? 1 : 0; $('sc').textContent = '★'.repeat(ov.score || 0) + '☆'.repeat(3 - (ov.score || 0));
  const en = $('energy'); en.style.opacity = ov.energy ? 1 : 0; $('enb').style.width = lerp(60, 10, clamp((t - 202) / 3)) + '%';
  const fx = $('fx'); if (ov.fx) { const [txt, k, col, x, y, size] = ov.fx; fx.style.opacity = 1; fx.textContent = txt; fx.style.left = x + '%'; fx.style.top = y + '%'; fx.style.fontSize = size + 'px'; fx.style.color = col; fx.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fx.style.opacity = 0;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c && !ov.lesson ? 1 : 0; cp.style.color = c ? WHOCOL[c.who] : '#fff';
};
function eyesGlow() {}
