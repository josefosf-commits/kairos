// SHORT "E se o seu QI dobrasse? — ep. 3: o botão de pausa" — série E se? (3D, vertical)
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, makeChar, M, mesh, sph, rbox, grp, cap,
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
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: l.id === 9 }); t0 += d; }
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
// ===== ep. 8: fumaça, raio, aura, fantasma do golpe =====
const drops = [];
const smoke = []; for (let i = 0; i < 12; i++) smoke.push(mesh(sph(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: '#6c6f7a', transparent: true, opacity: 0.55, roughness: 1 }), scene));
const beamMat = new THREE.MeshBasicMaterial({ color: '#ff2d55', transparent: true, opacity: 0.95, toneMapped: false });
const beamGlowMat = new THREE.MeshBasicMaterial({ color: '#ff6b81', transparent: true, opacity: 0.35, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false });
const beams = [0, 1].map(() => ({ core: mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 10), beamMat, scene), glow: mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 12), beamGlowMat, scene) }));
beams.forEach(b => { b.core.castShadow = b.glow.castShadow = false; });
const auraMat = new THREE.MeshBasicMaterial({ color: '#ffd60a', transparent: true, opacity: 0.0, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
const aura = mesh(sph(1, 32, 20), auraMat, scene); aura.castShadow = false;
const auraIn = mesh(sph(1, 32, 20), new THREE.MeshBasicMaterial({ color: '#fff3b0', transparent: true, opacity: 0, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false }), scene); auraIn.castShadow = false;
const motes = []; for (let i = 0; i < 18; i++) { const m = mesh(sph(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe066', toneMapped: false }), scene); m.castShadow = false; motes.push(m); }
const auraLight = new THREE.PointLight('#ffd60a', 0, 8, 1.4); scene.add(auraLight);
const ghost = mesh(cap(0.12, 0.9), new THREE.MeshBasicMaterial({ color: '#7fdcff', transparent: true, opacity: 0, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false }), scene); ghost.castShadow = false;
const UP2 = new THREE.Vector3(0, 1, 0), e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), tgt = new THREE.Vector3();
function setBeamAB(b, a, c, op) { const d = c.clone().sub(a), L = d.length(); [b.core, b.glow].forEach(m => { m.visible = op > 0.01; m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP2, d.clone().normalize()); m.scale.set(1, L, 1); }); b.core.material.opacity = op; b.glow.material.opacity = 0.35 * op; }
const RP = [0.2, 0, -2.4], JD = [-1.6, 0.86, -0.4];
const FJ = [-0.7, 0.86, -1.0], FR = [0.35, 0, -1.9];
const DIR = new THREE.Vector2(FJ[0] - FR[0], FJ[2] - FR[2]).normalize();
const J2 = [FJ[0] + DIR.x * 1.9, 0.86, FJ[2] + DIR.y * 1.9], R2 = [J2[0] - DIR.x * 1.35, 0, J2[2] - DIR.y * 1.35];
const PERP = new THREE.Vector2(-DIR.y, DIR.x); if (PERP.y < 0) PERP.multiplyScalar(-1);
const sideView = (dist = 4.5, h = 2.0, k = 0.3) => { const M0 = [lerp(J2[0] + DIR.x * 0.6, R2[0], 0.5), lerp(J2[2] + DIR.y * 0.6, R2[2], 0.5)]; return [[M0[0] + PERP.x * dist + DIR.x * k, h, M0[1] + PERP.y * dist + DIR.y * k], [M0[0], 1.55, M0[1]]]; };

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t);
  camera.fov = 52; setStreet(true, t);
  J.position.set(...JD); J.rotation.set(0, facing(JD, RP), 0); J.visible = true; jo.legs.forEach(l => l.visible = true);
  jo.head.scale.setScalar(2.24); glasses.visible = true;
  jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.12;
  robot.visible = true; robot.scale.setScalar(1.35); robot.position.set(...RP); robot.rotation.set(0, facing(RP, JD), 0); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 4; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 4)); mouthMat.emissiveIntensity = 0.4; rmouth.scale.set(1, 1, 1);
  leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 5 + i)) * 2);
  drawPhone(false, 0); phoneLight.intensity = 0; cable.visible = false;
  [...dizzy, ...sparks, ...drops, ...smoke, ...motes].forEach(o => o.visible = false); beams.forEach(b => { b.core.visible = b.glow.visible = false; });
  aura.visible = auraIn.visible = false; auraLight.intensity = 0; ghost.visible = false;
  if (t < 0) { // ---- capa: aura dourada x robô de olhos vermelhos ----
    scene.background.set('#1b1430');
    const JB2 = [J2[0] + DIR.x * 1.1, 0.86, J2[2] + DIR.y * 1.1];
    J.position.set(JB2[0], 1.15, JB2[2]); J.rotation.set(0, facing(JB2, R2) - 0.5, 0); jo.head.scale.setScalar(2.3);
    jo.mats.skin.emissiveIntensity = 0.35; jo.pose({ armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8], lean: 0.1 }); jo.face({ open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.5, look: [0.6, 0.2] });
    scene.updateMatrixWorld(true); J.getWorldPosition(v);
    aura.visible = auraIn.visible = true; aura.position.set(v.x, v.y + 0.9, v.z); auraIn.position.copy(aura.position); aura.scale.set(1.35, 2.25, 1.35); auraIn.scale.set(1.05, 1.9, 1.05); auraMat.opacity = 0.3; auraIn.material.opacity = 0.12;
    motes.forEach((m, i) => { m.visible = true; m.position.set(v.x + Math.cos(i * 2.3) * 1.1, v.y - 0.4 + (i / 18) * 3, v.z + Math.sin(i * 2.3) * 1.1); });
    auraLight.position.set(v.x, v.y + 1.2, v.z + 0.6); auraLight.intensity = 9;
    robot.position.set(R2[0] - DIR.x * 0.6, 0, R2[2] - DIR.y * 0.6); robot.rotation.y = facing(R2, JB2) + 0.4; eyeMat.emissiveIntensity = 9; antMat.emissiveIntensity = 4;
    rhead.getWorldPosition(e1); eyeLight.position.set(e1.x, e1.y, e1.z + 0.8); eyeLight.intensity = 10;
    const sv = sideView(6.0, 1.6, 0.3); camera.fov = 56; camera.updateProjectionMatrix(); cam(sv[0], [sv[1][0], 2.3, sv[1][2]], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0, flash = 0;
  const jTalk = t > 12.72 && t < 15.76 ? amp : -1;
  const rTalk = t > 34.94 && t < 36.22 ? amp : 0;
  if (rTalk) { mouthMat.emissiveIntensity = 0.5 + 3 * rTalk; rmouth.scale.set(0.3 + 0.9 * rTalk, 1 + 1.5 * rTalk, 1); }
  const robotFace = (dist = 2.0) => { scene.updateMatrixWorld(true); rhead.getWorldPosition(v); const d = new THREE.Vector3(Math.sin(robot.rotation.y), 0, Math.cos(robot.rotation.y)); return [[v.x + d.x * dist, v.y - 0.05, v.z + d.z * dist], [v.x, v.y - 0.05, v.z]]; };
  const josephFace = (dist = 2.6, side = 0.4) => { scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); const d = new THREE.Vector3(Math.sin(J.rotation.y), 0, Math.cos(J.rotation.y)); return [[v.x + d.x * dist + side, v.y, v.z + d.z * dist], [v.x, v.y - 0.1, v.z]]; };
  const robotDown = (k) => { robot.rotation.x = -Math.PI / 2 * k; robot.position.y = 0.3 * k; };
  let jBar = 1, rBar = 1;
  if (t > 36.62) jBar = 0.62; if (t > 52.6) rBar = 0.72; if (t > 57.0) jBar = 0.22;

  if (t < 3.3) { // ======== gancho: o robô "travado"... e é mentira ========
    robot.rotation.y = facing(RP, JD); robotDown(1);
    eyeMat.emissiveIntensity = t > 2.2 ? 6 * (0.8 + 0.2 * Math.sin(t * 30)) : 0.2;
    smoke.forEach((s, i) => { const ph = ((t * 0.5 + i / 12) % 1); s.visible = true; s.position.set(RP[0] + Math.sin(i * 2) * 0.3, 0.8 + ph * 2.0, RP[2] - 0.9 + Math.cos(i * 3) * 0.3); s.scale.setScalar(0.6 + ph * 1.2); s.material.opacity = 0.5 * (1 - ph); });
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v);
    camPos = mix3([RP[0] + 2.6, 1.9, RP[2] + 2.8], [RP[0] + 2.2, 1.7, RP[2] + 2.3], sm(t / 3.3)); camLook = [RP[0], 0.4, RP[2] - 0.6];
    ov.mentira = t > 2.2 ? seg(t, 2.2, 2.45) : 0;
  } else if (t < 8.8) { // ======== resumo ========
    ov.recap = true;
    const w = [[2.2, 2.8, 6.0], [-0.6, 1.9, -1.4]]; camPos = w[0]; camLook = w[1];
  } else if (t < 16.3) { // ======== Joseph escolhe a rodada 3 ========
    ov.score = true; ov.r3 = t < 12.6 ? seg(t, 9.02, 9.3) : 0;
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: t > 12.6 ? [1.2, -0.2, 0.6] : [0.3, 0.3, 0.4], head: [0, 0, jTalk > 0 ? 0.06 * Math.sin(t * 6) : 0] });
    jo.face({ open: blink(t), mouth: 'smile', talk: jTalk, brow: -0.3, browTilt: 0.4, look: [0.5, 0.2] });
    if (t < 12.5) { camPos = [2.2, 2.8, 6.0]; camLook = [-0.6, 1.9, -1.4]; } else { const f = josephFace(2.5, 0.35); camPos = f[0]; camLook = f[1]; }
    ov.regra = t > 13.0 ? seg(t, 13.0, 13.3) : 0;
  } else if (t < 22.5) { // ======== o robô calcula: paradoxo ========
    eyeMat.emissiveIntensity = Math.sin(t * 25) > 0 ? 6 : 1; leds.forEach((l, i) => l.material.emissiveIntensity = Math.sin(t * 30 + i * 2) > 0 ? 4 : 0);
    rhead.rotation.set(0.05 * Math.sin(t * 13), 0.1 * Math.sin(t * 9), 0.08 * Math.sin(t * 11));
    const f = robotFace(2.2); camPos = f[0]; camLook = f[1]; shake = 0.004 + 0.012 * seg(t, 19.0, 22.0);
    ov.calc = t > 16.66; ov.calcTxt = t < 18.33 ? 'CALCULANDO...' : t < 20.19 ? 'PERDER = GANHAR' : t < 21.0 ? 'GANHAR = PERDER' : 'ERRO ERRO ERRO';
  } else if (t < 27.6) { // ======== fumaça, faíscas, cai travado ========
    const fall = seg(t, 25.0, 25.7);
    robotDown(fall);
    eyeMat.emissiveIntensity = lerp(4, 0.2, seg(t, 25.0, 25.6)); leds.forEach(l => l.material.emissiveIntensity = Math.sin(t * 40) > 0 ? 3 * (1 - fall) : 0);
    if (t > 23.0) smoke.forEach((s, i) => { const ph = ((t * 0.6 + i / 12) % 1); s.visible = true; scene.updateMatrixWorld(true); rhead.getWorldPosition(v); s.position.set(v.x + Math.sin(i * 2) * 0.3, v.y + 0.3 + ph * 1.6, v.z + Math.cos(i * 3) * 0.3); s.scale.setScalar(0.6 + ph * 1.2); s.material.opacity = 0.55 * (1 - ph); });
    if (t > 23.9 && t < 25.6) { scene.updateMatrixWorld(true); rhead.getWorldPosition(v); sparks.forEach((s, i) => { const a = i / 14 * Math.PI * 2 + t * 9; s.visible = true; s.position.set(v.x + Math.cos(a) * 0.5, v.y + Math.sin(a * 1.7) * 0.4, v.z + Math.sin(a) * 0.4); s.scale.setScalar(0.6 + 0.6 * Math.abs(Math.sin(t * 25 + i))); }); }
    shake = fall > 0 && fall < 1 ? 0.03 : 0; if (t > 25.65 && t < 25.9) shake = 0.06;
    jo.face({ open: 1.25, mouth: 'o', brow: 1.0, look: [0.5, 0] });
    camPos = [2.2, 2.6, 4.6]; camLook = [-0.2, 1.3, -1.8];
    ov.travado = t > 26.06 ? seg(t, 26.06, 26.3) : 0;
  } else if (t < 36.4) { // ======== comemora de costas... o robô levanta ========
    robotDown(1 - seg(t, 31.46, 32.4));
    eyeMat.emissiveIntensity = t > 31.46 ? 7 : 0.2;
    const cele = Math.max(0, Math.sin((t - 28.2) * 7)) * (t > 28.2 && t < 33.2 ? 1 : 0);
    J.rotation.y = lerp(facing(JD, RP), facing(JD, RP) + Math.PI, seg(t, 28.06, 28.7));
    J.position.y = 0.86 + cele * 0.25;
    jo.pose({ breathe: jb, armL: [2.7, 0.4 + 0.2 * cele, 0.1], armR: [2.7, 0.4 + 0.2 * cele, 0.1] });
    jo.face({ open: 0.3, mouth: 'smile', brow: 0.8 });
    if (t < 34.8) { const fw = new THREE.Vector2(JD[0] - RP[0], JD[2] - RP[2]).normalize(); camPos = [JD[0] + fw.x * 5.5 - fw.y * 3.2, 2.6, JD[2] + fw.y * 5.5 + fw.x * 3.2]; camera.fov = 60; camLook = [lerp(JD[0], RP[0], 0.45), 1.7, lerp(JD[2], RP[2], 0.45)]; }
    else { const f = robotFace(1.9); camPos = f[0]; camLook = f[1]; eyeMat.emissiveIntensity = 8; }
    ov.eramentira = t > 33.23 && t < 34.9 ? seg(t, 33.23, 33.5) : 0;
  } else if (t < 39.8) { // ======== POW: soco pelas costas ========
    const step = seg(t, 36.0, 36.55);
    robot.position.set(lerp(RP[0], FR[0], step), 0, lerp(RP[2], FR[2], step)); robot.rotation.y = facing(FR, FJ);
    const punch = seg(t, 36.45, 36.62) * (1 - seg(t, 37.0, 37.5));
    rarms[1].rotation.set(-1.55 * punch, 0, -0.2 * punch);
    const fly = lin(t, 36.62, 38.0);
    J.position.set(lerp(JD[0], FJ[0], 0) + DIR.x * 0.0, 0.86, JD[2]);
    J.position.set(FJ[0] + DIR.x * 1.9 * sm(fly), 0.86 + Math.sin(fly * Math.PI) * 0.7, FJ[2] + DIR.y * 1.9 * sm(fly));
    if (t < 36.62) J.position.set(...FJ);
    J.rotation.set(fly * Math.PI * 2.0, facing(FJ, FR) + Math.PI, 0);
    jo.pose({ breathe: jb, armL: [2.4, 0.6, 0.2], armR: [2.4, 0.6, 0.2] });
    jo.face({ open: 1.35, mouth: 'o', brow: 1.2 });
    if (t > 36.62 && t < 36.9) flash = 1 - (t - 36.62) / 0.28;
    shake = 0.12 * Math.max(0, 1 - (t - 36.62) * 3) * (t > 36.62 ? 1 : 0);
    camPos = [3.2, 3.0, 5.6]; camLook = [-1.2, 1.4, -0.4]; camera.fov = 62;
    ov.fx = t > 36.62 && t < 37.8 ? ['POW!', seg(t, 36.62, 36.8)] : null; ov.bars = true;
  } else if (t < 44.0) { // ======== rola no asfalto, o robô vem pra cima ========
    const roll = lin(t, 39.9, 41.2);
    J.position.set(J2[0] + DIR.x * 0.6 * sm(roll), 0.45 + 0.1 * Math.abs(Math.sin(roll * 9)), J2[2] + DIR.y * 0.6 * sm(roll));
    J.rotation.set(0, facing(J2, R2), roll < 1 ? roll * Math.PI * 4 : 0);
    jo.pose({ breathe: jb, leg: [1.2, 1.2], armL: [1.4, 0.4, 1.6], armR: [1.4, 0.4, 1.6] }); jo.face({ open: 0.4, mouth: 'flat', brow: -0.4, browTilt: 0.4 });
    const wk = lin(t, 41.9, 43.4), w = walkPose(wk * 5, wk > 0 && wk < 1 ? 1 : 0);
    robot.position.set(lerp(FR[0], R2[0], sm(wk)), Math.abs(w.bob) * 0.6, lerp(FR[2], R2[2], sm(wk))); robot.rotation.y = facing(FR, J2);
    rarms.forEach((a, i) => a.rotation.set((i ? 1 : -1) * Math.sin(wk * 5 * Math.PI) * 0.5, 0, 0));
    eyeMat.emissiveIntensity = 7;
    camPos = mix3([-3.4, 1.0, 2.6], [-3.6, 1.1, 2.2], sm((t - 39.8) / 4.2)); camLook = [-1.2, 1.4, -0.6];
    ov.bars = true;
  } else if (t < 49.9) { // ======== modo previsão ========
    const up = seg(t, 44.2, 45.0);
    J.position.set(J2[0] + DIR.x * 0.6, lerp(0.45, 0.86, up), J2[2] + DIR.y * 0.6); J.rotation.set(0, facing(J2, R2), 0);
    robot.position.set(...R2); robot.rotation.y = facing(R2, J2);
    jo.pose({ breathe: jb, leg: [lerp(1.2, 0.2, up), lerp(1.2, 0.2, up)], armL: [0.9, 0.2, 1.8], armR: [0.9, 0.2, 1.8], lean: 0.1 });
    jo.face({ open: 1.1, mouth: 'flat', brow: -0.4, browTilt: 0.45, look: [0.5, 0.2] });
    glasses.children.forEach(m => { m.material.emissive && m.material.emissive.set('#00e5ff'); if (m.material.emissiveIntensity !== undefined) m.material.emissiveIntensity = 1.5 * seg(t, 45.2, 45.8); });
    scene.updateMatrixWorld(true); rarms[1].children[1].getWorldPosition(e1); jo.head.getWorldPosition(e2);
    ghost.visible = t > 45.8; ghost.material.opacity = 0.5 * (0.6 + 0.4 * Math.sin(t * 8)); const gd = e2.clone().sub(e1); ghost.position.copy(e1).addScaledVector(gd, 0.5); ghost.quaternion.setFromUnitVectors(UP2, gd.normalize());
    const sv = sideView(6.2, 2.3, 0.8); camPos = sv[0]; camLook = sv[1]; camera.fov = 60;
    ov.prev = t > 45.4 ? seg(t, 45.4, 45.7) : 0; ov.bars = true;
  } else if (t < 54.4) { // ======== esquiva, esquiva, contra-ataque ========
    const JB2 = [J2[0] + DIR.x * 0.6, 0.86, J2[2] + DIR.y * 0.6];
    robot.position.set(...R2); robot.rotation.y = facing(R2, JB2);
    const p1 = seg(t, 50.0, 50.27) * (1 - seg(t, 50.6, 50.9)), p2 = seg(t, 51.25, 51.51) * (1 - seg(t, 51.8, 52.1));
    rarms[1].rotation.set(-1.55 * p1, 0, -0.2 * p1); rarms[0].rotation.set(-1.55 * p2, 0, 0.2 * p2);
    const side = Math.sin(J.rotation.y + Math.PI / 2);
    const d1 = seg(t, 50.05, 50.3) * (1 - seg(t, 50.7, 51.0)), d2 = seg(t, 51.3, 51.55) * (1 - seg(t, 51.9, 52.2));
    J.position.set(JB2[0] + 0.45 * (d1 - d2) * Math.cos(J.rotation.y), 0.86 - 0.12 * (d1 + d2), JB2[2] - 0.45 * (d1 - d2) * Math.sin(J.rotation.y));
    J.rotation.set(0, facing(JB2, R2), 0.35 * (d1 - d2));
    const ct = seg(t, 52.35, 52.6) * (1 - seg(t, 53.2, 53.6));
    jo.pose({ breathe: jb, lean: 0.3 * ct, armL: [0.9, 0.2, 1.8], armR: [lerp(0.9, 1.55, ct), lerp(0.2, -0.1, ct), lerp(1.8, 0.05, ct)] });
    jo.face({ open: 1.0, mouth: ct > 0.5 ? 'o' : 'flat', brow: -0.5, browTilt: 0.5, look: [0.5, 0.2] });
    const hit = seg(t, 52.6, 52.9);
    robot.position.set(R2[0] - DIR.x * 0.35 * hit, 0, R2[2] - DIR.y * 0.35 * hit); robot.rotation.x = -0.18 * hit * (1 - seg(t, 53.4, 54.0));
    if (t > 52.6 && t < 52.85) flash = 0.8;
    shake = 0.06 * Math.max(0, 1 - Math.abs(t - 52.65) * 4);
    const sv = sideView(6.6, 2.0, 0.2); camPos = sv[0]; camLook = sv[1]; camera.fov = 62;
    if (t > 50.05 && t < 51.0) ov.fx = ['VUUSH!', seg(t, 50.05, 50.25)];
    if (t > 51.3 && t < 52.2) ov.fx = ['VUUSH!', seg(t, 51.3, 51.5)];
    if (t > 52.6 && t < 53.9) ov.fx = ['BAM!', seg(t, 52.6, 52.8)];
    ov.bars = true; ov.slow = (t > 50.0 && t < 52.2);
  } else if (t < 58.6) { // ======== o raio dos olhos ========
    const JB2 = [J2[0] + DIR.x * 0.6, 0.86, J2[2] + DIR.y * 0.6];
    J.position.set(...JB2); J.rotation.set(0, facing(JB2, R2), 0);
    robot.position.set(R2[0] - DIR.x * 0.35, 0, R2[2] - DIR.y * 0.35); robot.rotation.y = facing(R2, JB2);
    const charge = seg(t, 54.8, 56.3), fire = t > 56.5 && t < 57.7 ? 1 : 0;
    eyeMat.emissiveIntensity = 4 + 8 * charge; antMat.emissiveIntensity = 2 + 4 * charge;
    jo.pose({ breathe: jb, armL: [1.7, 1.0, 2.4], armR: [1.7, 1.0, 2.4], lean: -0.15 * fire });
    jo.face({ open: 1.35, mouth: 'o', brow: 1.2 });
    scene.updateMatrixWorld(true); rhead.localToWorld(e1.set(-0.14, 0.06, 0.3)); rhead.localToWorld(e2.set(0.14, 0.06, 0.3)); jo.body.localToWorld(tgt.set(0, 0.6, 0.3));
    setBeamAB(beams[0], e1.clone(), tgt.clone(), fire); setBeamAB(beams[1], e2.clone(), tgt.clone(), fire);
    if (fire) { flash = 0.25 + 0.15 * Math.sin(t * 50); shake = 0.05; }
    if (t < 56.4) { const f = robotFace(1.7); camPos = f[0]; camLook = f[1]; } else { const sv = sideView(6.8, 2.1, 0); camPos = sv[0]; camLook = sv[1]; camera.fov = 62; }
    if (t > 56.5 && t < 57.8) ov.fx = ['ZAAAP!', seg(t, 56.5, 56.7)];
    ov.bars = true;
  } else if (t < 65.4) { // ======== o Joseph cai... o QI dispara ========
    const JB2 = [J2[0] + DIR.x * 0.6, 0.86, J2[2] + DIR.y * 0.6];
    const fall = seg(t, 58.7, 59.4);
    J.position.set(JB2[0] + DIR.x * 0.5 * fall, lerp(0.86, 0.45, fall), JB2[2] + DIR.y * 0.5 * fall);
    J.rotation.set(-Math.PI / 2 * 0.92 * fall, facing(JB2, R2) + Math.PI, 0);
    jo.pose({ breathe: jb, armL: [2.4, 0.5, 0.2], armR: [2.4, 0.5, 0.2] }); jo.face({ open: t > 60.3 ? 1.2 : 0.1, mouth: 'flat', brow: 0.2 });
    robot.position.set(R2[0] - DIR.x * 0.35, 0, R2[2] - DIR.y * 0.35); robot.rotation.y = facing(R2, JB2);
    const n = [62.0, 63.3].filter(x => t >= x).length, pulse = n ? bounce(lin(t, [62.0, 63.3][n - 1], [62.0, 63.3][n - 1] + 0.6)) : 0;
    jo.head.scale.setScalar(2.24 + 0.15 * n + 0.15 * pulse); jo.mats.skin.emissiveIntensity = 0.12 + 0.12 * n + 0.2 * pulse;
    shake = 0.04 * pulse;
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v);
    const sv = sideView(6.5, 1.8, 1.2); camPos = mix3(sv[0], [sv[0][0], 1.5, sv[0][2]], sm((t - 58.6) / 6.8)); camLook = [v.x, 1.0, v.z]; camera.fov = 60;
    ov.qib = t > 60.27; ov.qiv = t < 62.0 ? 3276800 : t < 63.3 ? 6553600 : 13107200; ov.qik = pulse; ov.bars = true;
  } else { // ======== a aura dourada ========
    const JB2 = [J2[0] + DIR.x * 1.1, 0.86, J2[2] + DIR.y * 1.1];
    const rise = seg(t, 65.76, 66.8), fl = 0.35 * seg(t, 66.8, 67.6) + 0.06 * Math.sin(t * 3);
    J.position.set(JB2[0], lerp(0.45, 0.86, rise) + fl, JB2[2]);
    J.rotation.set(-Math.PI / 2 * 0.92 * (1 - rise), facing(JB2, R2), 0);
    jo.head.scale.setScalar(2.55); jo.mats.skin.emissiveIntensity = 0.35 + 0.1 * Math.sin(t * 6);
    jo.pose({ breathe: jb, armL: [0.4, 0.7, 0.6], armR: [0.4, 0.7, 0.6], head: [-0.05, 0, 0] });
    jo.face({ open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.5, look: [0.5, 0.2] });
    const ak = seg(t, 66.2, 67.3);
    scene.updateMatrixWorld(true); J.getWorldPosition(v);
    aura.visible = auraIn.visible = ak > 0; aura.position.set(v.x, v.y + 0.9, v.z); auraIn.position.copy(aura.position);
    aura.scale.set(1.35 * ak + 0.04 * Math.sin(t * 14), 2.25 * ak + 0.06 * Math.sin(t * 11), 1.35 * ak); auraIn.scale.set(1.05 * ak, 1.9 * ak, 1.05 * ak);
    auraMat.opacity = 0.32 * ak; auraIn.material.opacity = 0.14 * ak;
    motes.forEach((m, i) => { const ph = ((t * 0.8 + i / 18) % 1); m.visible = ak > 0.2; m.position.set(v.x + Math.cos(i * 2.3 + t) * 1.1, v.y - 0.6 + ph * 3.2, v.z + Math.sin(i * 2.3 + t) * 1.1); m.scale.setScalar(1.5 * (1 - ph)); });
    auraLight.position.set(v.x, v.y + 1.2, v.z + 0.6); auraLight.intensity = 9 * ak;
    robot.position.set(R2[0] - DIR.x * (0.35 + 0.5 * seg(t, 67.0, 68.0)), 0, R2[2] - DIR.y * (0.35 + 0.5 * seg(t, 67.0, 68.0))); robot.rotation.y = facing(R2, JB2);
    eyeMat.emissiveIntensity = 3 + 3 * Math.sin(t * 9);
    if (t > 66.2 && t < 66.5) flash = 0.6;
    shake = 0.03 * ak * (t < 68 ? 1 : 0.3);
    if (t < 70.2) { const sv = sideView(8.0, 1.0, 1.6); camPos = mix3(sv[0], [sv[0][0], 1.1, sv[0][2]], sm((t - 65.4) / 4.8)); camLook = [v.x, v.y + 1.2, v.z]; camera.fov = 58; }
    else { camPos = mix3([1.8, 2.6, 4.2], [2.2, 2.9, 5.2], sm((t - 70.2) / 8)); camLook = [-1.2, 1.7, -0.6]; }
    ov.bars = t < 70.2; ov.cta = seg(t, 70.6, 70.9); ov.end = seg(t, 72.9, 73.2);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  $('root').style.filter = ov.recap ? 'grayscale(0.75) contrast(1.05)' : (ov.slow ? 'saturate(0.6) hue-rotate(-10deg) contrast(1.1)' : '');
  $('flash').style.opacity = flash;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); if (!e) return; e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  ['click', 'frz', 'genio', 'despausa', 'igual', 'door', 'amigo', 'qi3', 'ap0', 'ap1', 'ap2', 'rbig', 'duo', 'day', 'duelo', 'rodadas', 'some', 'r1', 'r2', 'eq', 'stakes', 'cards'].forEach(id => { const e = $(id); if (e) e.style.opacity = 0; });
  pop('recap', ov.recap ? 1 : 0); pop('end', ov.end || 0); pop('cta', ov.cta || 0); pop('r3', ov.r3 || 0);
  pop('mentira', ov.mentira || 0); pop('regra', ov.regra && t < 16.3 ? ov.regra : 0); pop('travado', ov.travado || 0); pop('eramentira', ov.eramentira || 0); pop('prev', ov.prev && t < 49.9 ? ov.prev : 0);
  const sc = $('score'); sc.style.opacity = ov.score ? 1 : 0; $('sj').textContent = 0; $('sr').textContent = 2;
  const ca = $('calc'); ca.style.opacity = ov.calc ? 1 : 0; ca.textContent = ov.calcTxt || ''; ca.style.color = (ov.calcTxt || '').startsWith('ERRO') ? '#ff2d55' : '#7fdcff';
  const fx = $('fx'); if (ov.fx) { fx.style.opacity = 1; fx.textContent = ov.fx[0]; fx.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(ov.fx[1])})`; fx.style.color = ov.fx[0] === 'BAM!' ? '#ffd60a' : ov.fx[0] === 'VUUSH!' ? '#7fdcff' : '#ff2d55'; } else fx.style.opacity = 0;
  const bars = $('bars'); bars.style.opacity = ov.bars ? 1 : 0; $('bj').style.width = (jBar * 100) + '%'; $('br').style.width = (rBar * 100) + '%';
  const q = $('qib'); q.style.opacity = ov.qib ? 1 : 0; if (ov.qib) { q.textContent = 'QI ' + ov.qiv.toLocaleString('pt-BR'); q.style.transform = `translateX(-50%) scale(${1 + 0.25 * (ov.qik || 0)})`; }
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0; cp.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
