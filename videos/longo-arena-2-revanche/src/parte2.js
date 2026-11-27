
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
