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
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: l.id === 3 || l.id === 7 }); t0 += d; }
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
const drops = []; for (let i = 0; i < 6; i++) drops.push(mesh(sph(0.05, 8, 6), new THREE.MeshStandardMaterial({ color: '#7fdcff', emissive: '#7fdcff', emissiveIntensity: 0.6, transparent: true, opacity: 0.85 }), scene));
const RP = [0.2, 0, -2.4], JH = [-0.9, 0.86, -1.2], JD = [-1.6, 0.86, -0.4];
const sideCam = (k) => { const M0 = [(-0.9 + 0.2) / 2, (-1.2 - 2.4) / 2]; return [M0[0] + 0.74 * k, 1.75, M0[1] + 0.68 * k]; };

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
  drawPhone(false, 0); phoneLight.intensity = 0;
  dizzy.forEach(d => d.visible = false); sparks.forEach(s => s.visible = false); drops.forEach(d => d.visible = false); cable.visible = false;
  scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.8); eyeLight.intensity = 5;
  if (t < 0) { // ---- capa: cara a cara no duelo, 0 x 2 ----
    scene.background.set('#1b1430'); J.position.set(...JD); J.rotation.y = facing(JD, RP) - 0.35;
    jo.pose({ armL: [0.6, 0.3, 1.9], armR: [0.6, 0.3, 1.9], lean: 0.1 }); jo.face({ open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.5, look: [0.5, 0.2] });
    robot.rotation.y = facing(RP, JD) + 0.3; eyeMat.emissiveIntensity = 7; antMat.emissiveIntensity = 4;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.8); eyeLight.intensity = 10;
    camera.fov = 52; camera.updateProjectionMatrix(); cam([1.6, 2.2, 3.6], [-0.6, 2.3, -1.4], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0;
  const jTalk = t > 28.68 && t < 30.6 ? amp : -1;
  const rTalk = (t > 9.54 && t < 12.18) || (t > 31.4 && t < 32.36) ? amp : 0;
  mouthMat.emissiveIntensity = 0.4 + 3 * rTalk; rmouth.scale.set(0.3 + 0.9 * rTalk + (rTalk ? 0 : 0.7), 1 + 1.5 * rTalk, 1);
  let score = [0, 0]; if (t > 46.12) score = [0, 1]; if (t > 60.88) score = [0, 2];
  const robotFace = () => { scene.updateMatrixWorld(true); rhead.getWorldPosition(v); const d = new THREE.Vector3(Math.sin(robot.rotation.y), 0, Math.cos(robot.rotation.y)); return [[v.x + d.x * 2.0, v.y - 0.05, v.z + d.z * 2.0], [v.x, v.y - 0.05, v.z]]; };
  const josephFace = (dist = 2.6, side = 0.4) => { scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); const d = new THREE.Vector3(Math.sin(J.rotation.y), 0, Math.cos(J.rotation.y)); return [[v.x + d.x * dist + side, v.y, v.z + d.z * dist], [v.x, v.y - 0.1, v.z]]; };
  const wide = (k = 0) => [mix3([2.3, 2.9, 6.4], [2.1, 2.8, 5.6], k), [-0.6, 1.9, -1.4]];

  if (t < 9.2) { // ======== gancho: o robô não solta + resumo ========
    J.position.set(...JH); J.rotation.y = facing(JH, RP); robot.rotation.y = facing(RP, JH);
    const sq = t > 1.9 ? 1 : 0;
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [1.45, -0.1, 0.1 + 0.05 * Math.sin(t * 30) * sq], lean: -0.1 * sq });
    jo.face({ open: sq ? 0.6 : blink(t), mouth: sq ? 'o' : 'smile', brow: sq ? 0.8 : 0.4, browTilt: sq ? -0.4 : 0, look: [0.5, 0] });
    rarms[0].rotation.set(-1.4, 0, 0.15);
    eyeMat.emissiveIntensity = 4 + 4 * seg(t, 1.9, 2.4);
    if (sq && t < 3.6) { scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); sparks.forEach((s, i) => { const a = i / 14 * Math.PI * 2 + t * 4; s.visible = true; s.position.set(v.x + Math.cos(a) * 0.25, v.y + Math.sin(a) * 0.25, v.z); s.scale.setScalar(0.5 + 0.4 * Math.abs(Math.sin(t * 20 + i))); }); }
    shake = sq && t < 3.6 ? 0.015 : 0;
    if (t < 3.9) { const c = sideCam(3.6); camPos = [c[0], 1.9, c[2]]; camLook = [-0.35, 1.6, -1.8]; }
    else { ov.recap = t < 8.0; const c = sideCam(4.6); camPos = [c[0], 2.0, c[2]]; camLook = [-0.35, 1.7, -1.8]; }
  } else if (t < 12.8) { // ======== "Prove que você é o Joseph de verdade." ========
    J.position.set(...JH); J.rotation.y = facing(JH, RP); robot.rotation.y = facing(RP, JH);
    jo.pose({ breathe: jb, armR: [1.45, -0.1, 0.1] }); rarms[0].rotation.set(-1.4, 0, 0.15);
    const f = robotFace(); camPos = f[0]; camLook = f[1]; eyeMat.emissiveIntensity = 6;
  } else if (t < 21.2) { // ======== o duelo ========
    const back_ = seg(t, 13.0, 13.8);
    J.position.set(lerp(JH[0], JD[0], back_), 0.86, lerp(JH[2], JD[2], back_));
    jo.pose({ breathe: jb, armR: [lerp(1.45, 0.3, back_), 0.2, 0.4], armL: [0.3, 0.3, 0.4] });
    jo.face({ open: blink(t), mouth: t > 19.0 ? 'o' : 'flat', brow: t > 19.0 ? 1.0 : 0.2, browTilt: 0.3, look: [0.5, 0.3] });
    const w = wide(sm((t - 12.8) / 8.4)); camPos = w[0]; camLook = w[1];
    ov.day = seg(t, 13.48, 13.8) * (t < 14.5 ? 1 : 0); ov.duelo = t > 14.58 ? seg(t, 14.58, 14.9) : 0; ov.score = t > 14.58;
    ov.rodadas = t > 16.25 ? seg(t, 16.25, 16.55) : 0; ov.some = t > 19.01 ? seg(t, 19.01, 19.3) : 0;
    shake = t > 20.0 && t < 20.5 ? 0.03 : 0;
  } else if (t < 28.2) { // ======== a aposta ========
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [0.3, 0.3, 0.4] });
    jo.face({ open: blink(t) * 1.1, mouth: t > 26.78 ? 'sad' : 'flat', brow: 0.6, browTilt: -0.45, look: [0, 0] });
    J.rotation.y = lerp(facing(JD, RP), 0.4, seg(t, 21.3, 21.9));
    const f = josephFace(lerp(3.2, 2.2, sm((t - 21.2) / 7)), 0); camPos = f[0]; camLook = f[1];
    ov.score = true; ov.stakes = [24.68, 25.61, 26.78].map(x => seg(t, x, x + 0.3));
  } else if (t < 31.0) { // ======== "Inteligência não é só número!" ========
    const step = seg(t, 28.3, 28.7);
    J.position.set(JD[0] + 0.35 * step, 0.86, JD[2] - 0.35 * step);
    jo.pose({ breathe: jb, lean: 0.12, armL: [0.6, 0.3, 1.9], armR: [0.6, 0.3, 1.9], head: [0, 0, 0.06 * Math.sin(t * 8) * (jTalk > 0 ? 1 : 0)] });
    jo.face({ open: 1.0, mouth: 'flat', talk: jTalk, brow: -0.5, browTilt: 0.5, look: [0, 0] });
    const f = josephFace(2.3, 0.3); camPos = f[0]; camLook = f[1]; shake = 0.01;
  } else if (t < 32.9) { // ======== "Então prove." ========
    robot.position.set(RP[0] - 0.2, 0, RP[2] + 0.2); rhead.rotation.set(-0.1, 0, 0.05);
    const f = robotFace(); camPos = f[0]; camLook = f[1]; eyeMat.emissiveIntensity = 7;
  } else if (t < 47.5) { // ======== rodada 1: cálculo ========
    ov.score = true; ov.r1 = t > 33.53 && t < 39.0 ? seg(t, 33.53, 33.8) : 0; ov.eq = t > 35.33 ? 1 : 0; ov.eqAns = t > 44.25;
    const think = t > 39.0 && t < 44.25;
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: think ? [1.45, -0.95, 2.25] : [0.3, 0.3, 0.4] });
    jo.face({ open: think ? 1.1 : blink(t), mouth: t > 44.3 ? 'o' : 'flat', brow: think ? 0.5 : 0.2, browTilt: think ? 0.35 : 0, look: think ? [Math.sin(t * 5), 0.6] : [0.5, 0.3] });
    if (think) { scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); drops.forEach((d, i) => { const ph = ((t * 0.9 + i / 6) % 1); d.visible = true; d.position.set(v.x + Math.cos(i * 2.1) * 0.95, v.y + 0.7 - ph * 1.2, v.z + Math.sin(i * 2.1) * 0.6 + 0.4); }); }
    if (t > 44.25) { eyeMat.emissiveIntensity = 7; antMat.emissiveIntensity = 5; }
    if (t < 39.0) { const w = wide(0.5); camPos = w[0]; camLook = w[1]; }
    else if (t < 44.2) { const f = josephFace(2.4, 0.3); camPos = f[0]; camLook = f[1]; }
    else { const f = robotFace(); camPos = [f[0][0], f[0][1] - 0.3, f[0][2]]; camLook = [f[1][0], f[1][1] - 0.2, f[1][2]]; }
    ov.pop1 = t > 46.12 ? seg(t, 46.12, 46.4) : 0;
  } else if (t < 63.5) { // ======== rodada 2: memória ========
    ov.score = true; ov.r2 = t > 48.28 && t < 53.0 ? seg(t, 48.28, 48.55) : 0;
    ov.cards = [55.89, 56.93, 57.96].map(x => t > x && t < 60.8 ? seg(t, x, x + 0.3) : 0);
    const shame = seg(t, 58.0, 58.5);
    jo.pose({ breathe: jb, armL: [lerp(0.3, 1.7, shame), lerp(0.3, 0.9, shame), lerp(0.4, 2.4, shame)], armR: [lerp(0.3, 1.7, shame), lerp(0.3, 0.9, shame), lerp(0.4, 2.4, shame)], head: [0.15 * shame, 0, 0] });
    jo.face({ open: shame > 0.5 ? 0.3 : blink(t), mouth: shame > 0.5 ? 'flat' : 'o', brow: 0.6, browTilt: -0.3, look: [0.5, 0.3] });
    eyeMat.emissiveIntensity = t > 53.0 ? 6 : 4;
    if (t < 53.0) { const w = wide(0.8); camPos = w[0]; camLook = w[1]; }
    else if (t < 60.8) { camPos = [1.9, 2.2, 1.0]; camLook = [-0.5, 2.0, -1.6]; }
    else { const w = wide(1); camPos = w[0]; camLook = w[1]; }
    ov.pop2 = t > 60.88 ? seg(t, 60.88, 61.2) : 0; ov.big2 = t > 60.88 ? seg(t, 60.88, 61.2) : 0;
  } else if (t < 72.3) { // ======== última rodada ========
    ov.score = true; ov.r3 = t > 63.92 ? seg(t, 63.92, 64.2) : 0;
    const knows = seg(t, 69.0, 69.6);
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [0.3, 0.3, 0.4] });
    jo.face({ open: lerp(blink(t), 0.75, knows), mouth: knows > 0.5 ? 'smile' : 'flat', brow: lerp(0.2, -0.45, knows), browTilt: 0.45 * knows, look: [0, 0] });
    J.rotation.y = lerp(facing(JD, RP), 0.25, seg(t, 66.5, 67.4));
    if (t > 70.4) eyeMat.emissiveIntensity = Math.sin(t * 40) > 0 ? 5 : 1.5;
    if (t < 68.6) { const w = wide(sm((t - 63.5) / 5)); camPos = [w[0][0] - 0.6 * sm((t - 63.5) / 5), w[0][1], w[0][2] - 1.5 * sm((t - 63.5) / 5)]; camLook = w[1]; }
    else { const f = josephFace(lerp(2.8, 2.0, sm((t - 68.6) / 3.7)), 0); camPos = f[0]; camLook = f[1]; }
  } else { // ======== CTA ========
    ov.score = false; ov.cta = seg(t, 72.6, 72.9); ov.end = seg(t, 76.5, 76.8);
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [0.3, 0.3, 0.4] }); jo.face({ open: 0.8, mouth: 'smile', brow: -0.4, browTilt: 0.45, look: [0.5, 0.3] });
    eyeMat.emissiveIntensity = 6;
    const w = wide(1); camPos = [w[0][0] + 0.2, w[0][1] + 0.3, w[0][2] + 0.8]; camLook = w[1];
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  $('root').style.filter = ov.recap ? 'grayscale(0.75) contrast(1.05)' : '';
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  ['click', 'frz', 'genio', 'despausa', 'igual', 'door', 'amigo', 'qi3'].forEach(id => { const e = $(id); if (e) e.style.opacity = 0; });
  ['ap0', 'ap1', 'ap2', 'rbig', 'duo'].forEach(id => { const e = $(id); if (e) e.style.opacity = 0; });
  pop('recap', ov.recap ? 1 : 0); pop('day', ov.day || 0); pop('end', ov.end || 0);
  pop('duelo', ov.duelo && t < 21.2 ? ov.duelo : 0); pop('rodadas', ov.rodadas && t < 19.0 ? ov.rodadas : 0); pop('some', ov.some || 0);
  pop('r1', ov.r1 || 0); pop('r2', ov.r2 || 0); pop('r3', ov.r3 || 0); pop('cta', ov.cta || 0);
  const sc = $('score'); sc.style.opacity = ov.score ? 1 : 0; $('sj').textContent = score[0]; $('sr').textContent = score[1];
  sc.style.transform = `translateX(-50%) scale(${1 + 0.25 * ((ov.pop1 || 0) > 0 && (ov.pop1 || 0) < 1 ? 1 : 0) + 0.25 * ((ov.pop2 || 0) > 0 && (ov.pop2 || 0) < 1 ? 1 : 0)})`;
  const eq = $('eq'); eq.style.opacity = ov.eq && t < 47.5 ? 1 : 0; eq.innerHTML = '437 × 892 = ' + (ov.eqAns ? '<span style="color:#ff2d55">389.804</span>' : '?');
  const st = ov.stakes || [0, 0, 0]; ['k0', 'k1', 'k2'].forEach((id, i) => { const e = $(id); e.style.opacity = st[i] ? 1 : 0; e.style.transform = `scale(${0.5 + 0.5 * back(st[i])})`; });
  const cd = ov.cards || [0, 0, 0]; ['c0', 'c1', 'c2'].forEach((id, i) => { const e = $(id); e.style.opacity = cd[i] ? 1 : 0; e.style.transform = `rotate(${(i - 1) * 4}deg) scale(${0.5 + 0.5 * back(cd[i])})`; });
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0; cp.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
