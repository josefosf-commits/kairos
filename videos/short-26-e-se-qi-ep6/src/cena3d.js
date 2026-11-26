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
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: l.id === 7 }); t0 += d; }
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
const RP = [0.2, 0, -2.4], JP = [-0.9, 0.86, -1.2];

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t);
  setDay(1); camera.fov = 52; setStreet(false, t);
  J.position.set(0.5, 0.86, -2.85); J.rotation.set(0, Math.PI, 0); J.visible = true; jo.legs.forEach(l => l.visible = true);
  jo.head.scale.setScalar(2.24); glasses.visible = true;
  jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.12;
  robot.visible = false; robot.scale.setScalar(1.35); robot.position.set(...RP); robot.rotation.set(0, 0, 0); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 4; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 4)); mouthMat.emissiveIntensity = 0.4; rmouth.scale.set(1, 1, 1);
  leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 5 + i)) * 2);
  drawPhone(false, 0); phoneLight.intensity = 0; eyeLight.intensity = 0;
  dizzy.forEach(d => d.visible = false); sparks.forEach(s => s.visible = false); cable.visible = false;
  quarto.glass.map = null; quarto.glass.color.set('#bfe3ff'); quarto.glass.needsUpdate = true;
  if (t < 0) { // ---- capa: aperto de mão na rua, olhos vermelhos ----
    setStreet(true, 3.3); robot.visible = true; scene.background.set('#1b1430');
    J.position.set(...JP); J.rotation.y = facing(JP, RP);
    jo.pose({ armL: [0.3, 0.3, 0.4], armR: [1.45, -0.1, 0.1] }); jo.face({ open: 1.0, mouth: 'flat', brow: 0.6, browTilt: -0.3, look: [0.6, 0.3] });
    robot.rotation.y = facing(RP, JP); rarms[0].rotation.set(-1.4, 0, 0.15); eyeMat.emissiveIntensity = 7; antMat.emissiveIntensity = 4;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.8); eyeLight.intensity = 10;
    camera.fov = 52; camera.updateProjectionMatrix(); cam([4.0, 2.3, 2.9], [-0.35, 2.15, -1.8], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0;
  const jTalk = t > 30.98 && t < 32.26 ? amp : -1;

  if (t < 5.6) { // ======== resumo: ele descongelou e viu o bairro ========
    ov.recap = 1; setDay(0.45);
    drawStreet(t, lerp(80, 900, t / 5.6)); quarto.glass.map = wtex; quarto.glass.color.set('#ffffff'); quarto.glass.needsUpdate = true;
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [0.3, 0.3, 0.4] }); jo.face({ open: 1.3, mouth: 'o', brow: 1.0 });
    camPos = mix3([1.6, 2.6, 2.6], [1.0, 2.6, 1.6], sm(t / 5.6)); camLook = [0.5, 2.3, -3.6];
  } else if (t < 14.3) { // ======== dia 14: QI 3 milhões, sai pela janela ========
    setDay(0.45); drawStreet(t, 500); quarto.glass.map = wtex; quarto.glass.color.set('#ffffff'); quarto.glass.needsUpdate = true;
    const pulse = bounce(lin(t, 8.25, 8.9));
    jo.head.scale.setScalar(2.24 + 0.2 * pulse); jo.mats.skin.emissiveIntensity = 0.12 + 0.2 * pulse;
    if (t < 9.4) {
      J.rotation.y = lerp(Math.PI, 0.3, seg(t, 6.0, 6.6));
      jo.pose({ breathe: jb, armL: [lerp(0.3, 2.6, pulse), 0.5, 0.1], armR: [lerp(0.3, 2.6, pulse), 0.5, 0.1] }); jo.face({ open: blink(t), mouth: 'smile', brow: 0.8 });
      camPos = [0.5, 2.6, 0.6]; camLook = [0.5, 2.4, -2.85];
    } else if (t < 11.3) {
      J.position.set(-4.2, 0.86, 0.2); J.rotation.y = facing([-4.2, 0, 0.2], [-6.0, 0, 1.3]);
      jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [0.6, -0.2, 1.0] });
      jo.face({ open: 1.0, mouth: 'flat', brow: -0.3, browTilt: 0.4, look: [-0.7, 0] });
      ov.door = seg(t, 9.6, 9.9);
      camPos = [-2.0, 2.5, 4.4]; camLook = [-5.0, 1.8, 0.8];
    } else {
      const k = lin(t, 11.3, 12.3), out = lin(t, 12.3, 13.1), W1 = [0.5, 0.86, -2.85];
      J.position.set(lerp(-4.2, W1[0], sm(k)), 0.86 + out * 1.0, lerp(0.2, W1[2], sm(k)) - out * 1.8); J.rotation.y = Math.PI;
      jo.pose({ breathe: jb, armL: [out > 0 ? 2.6 : 0.3, 0.2, 0.1], armR: [out > 0 ? 2.6 : 0.3, 0.2, 0.1] }); jo.face({ open: 1.1, mouth: 'flat', brow: 0.3 });
      camPos = [0.6, 2.3, 2.6]; camLook = [0.6, 1.9, -3.0];
      ov.igual = seg(t, 13.0, 13.3);
    }
    ov.day = seg(t, 6.0, 6.3) * (t < 9.3 ? 1 : 0); ov.qi = t > 7.5 && t < 9.3 ? 1 : 0;
  } else { // ======== a rua ========
    setStreet(true, t);
    robot.visible = true;
    scene.updateMatrixWorld(true); robot.getWorldPosition(va); va.y = 1.5; va.z -= 0.35; tl.localToWorld(vb.set(0, 3.0, 0));
    const cd = vb.clone().sub(va); cable.visible = t < 36; cable.position.copy(va).addScaledVector(cd, 0.5); cable.quaternion.setFromUnitVectors(UPV, cd.clone().normalize()); cable.scale.set(1, cd.length(), 1);
    rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.8); eyeLight.intensity = 5;
    const JI = [-3.6, 0.86, 1.6];
    const wk = lin(t, 14.6, 17.2), w = walkPose(wk * 7, wk > 0 && wk < 1 ? 1 : 0);
    J.position.set(lerp(JI[0], JP[0], sm(wk)), 0.86 + w.bob, lerp(JI[2], JP[2], sm(wk)));
    J.rotation.y = wk < 1 ? facing(JI, JP) : facing(JP, RP);
    robot.rotation.y = t > 26.6 ? facing(RP, JP) * seg(t, 26.6, 27.4) : 0;
    jo.pose({ breathe: jb, leg: w.leg, armL: wk < 1 ? w.armL : [0.3, 0.3, 0.4], armR: wk < 1 ? w.armR : [0.3, 0.3, 0.4] });
    jo.face({ open: blink(t), mouth: 'flat', brow: 0.2, browTilt: 0.2, look: [0.5, 0.3] });
    if (t < 21.5) { camPos = mix3([2.3, 3.2, 7.0], [2.1, 3.0, 6.2], sm((t - 14.3) / 7.2)); camLook = [-0.4, 2.0, -1.8]; ov.duo = 0; }
    else if (t < 26.6) {
      jo.face({ open: blink(t), mouth: 'flat', brow: t > 23.6 ? -0.4 : 0.2, browTilt: t > 23.6 ? 0.45 : 0.2, look: [0.5, 0.3] });
      camPos = mix3([0.9, 1.0, 1.9], [0.9, 1.0, 1.5], sm((t - 21.5) / 5)); camLook = [0.2, 2.6, -2.4];
      ov.duo = 1;
    } else if (t < 32.6) { // a pergunta
      jo.face({ open: blink(t), mouth: 'flat', talk: jTalk, brow: 0.6, browTilt: -0.2, look: [0.5, 0.4] });
      jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: t > 30.9 && t < 32.4 ? [0.8, 0.3, 1.0] : [0.3, 0.3, 0.4], head: [0, 0, 0.08 * Math.sin(t * 5) * (jTalk > 0 ? 1 : 0)] });
      if (t < 30.7) { camPos = [2.1, 2.6, 4.8]; camLook = [-0.35, 2.0, -1.8]; } else { const d = new THREE.Vector3(Math.sin(J.rotation.y), 0, Math.cos(J.rotation.y)); scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); camPos = [v.x + d.x * 2.6 + 0.4, v.y, v.z + d.z * 2.6]; camLook = [v.x, v.y - 0.1, v.z]; }
    } else if (t < 35.6) { // a resposta
      const a = t > 33.26 && t < 35.1 ? amp : 0;
      mouthMat.emissiveIntensity = 0.5 + 3 * a; rmouth.scale.set(0.3 + 0.9 * a, 1 + 1.5 * a, 1);
      eyeMat.emissiveIntensity = 2.5; rhead.rotation.set(0.2, 0, 0.08);
      scene.updateMatrixWorld(true); rhead.getWorldPosition(v); const d = new THREE.Vector3(Math.sin(robot.rotation.y), 0, Math.cos(robot.rotation.y));
      camPos = [v.x + d.x * 2.0, v.y - 0.1, v.z + d.z * 2.0]; camLook = [v.x, v.y - 0.1, v.z];
    } else if (t < 40.4) { // as mãos
      const jr = seg(t, 36.1, 37.2), rr = seg(t, 38.0, 39.6);
      jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [lerp(0.3, 1.45, jr), -0.1, 0.1] });
      jo.face({ open: blink(t), mouth: 'smile', brow: 0.4, look: [0.5, 0] });
      rarms[0].rotation.set(-1.4 * rr, 0, 0.15 * rr);
      rhead.rotation.set(0.1, 0, 0);
      camPos = mix3([3.0, 1.95, 1.35], [2.7, 1.9, 1.05], sm((t - 35.6) / 4.8)); camLook = [-0.35, 1.6, -1.8];
    } else if (t < 44.2) { // os olhos continuam vermelhos
      jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [1.45, -0.1, 0.1] }); rarms[0].rotation.set(-1.4, 0, 0.15);
      eyeMat.emissiveIntensity = 4 + 4 * seg(t, 41.0, 42.5); antMat.emissiveIntensity = 3;
      scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.intensity = 9;
      const d = new THREE.Vector3(Math.sin(robot.rotation.y), 0, Math.cos(robot.rotation.y));
      camPos = mix3([v.x + d.x * 1.8, v.y, v.z + d.z * 1.8], [v.x + d.x * 1.2, v.y, v.z + d.z * 1.2], sm((t - 40.4) / 3.8)); camLook = [v.x, v.y, v.z];
    } else { // amigo ou inimigo?
      jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [1.45, -0.1, 0.1] }); jo.face({ open: blink(t), mouth: 'flat', brow: 0.6, browTilt: -0.3, look: [0.5, 0.2] });
      rarms[0].rotation.set(-1.4, 0, 0.15); eyeMat.emissiveIntensity = 6;
      camPos = mix3([2.2, 2.8, 5.8], [2.4, 3.1, 6.8], sm((t - 44.2) / 7.5)); camLook = [-0.35, 1.9, -1.8];
      ov.amigo = seg(t, 44.7, 45.0); ov.end = seg(t, 46.0, 46.4);
    }
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  $('root').style.filter = ov.recap ? 'grayscale(0.75) contrast(1.05)' : '';
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('recap', ov.recap ? 1 : 0); pop('day', ov.day || 0); pop('end', ov.end || 0); pop('click', 0); pop('frz', 0); pop('genio', 0); pop('despausa', 0);
  pop('igual', ov.igual && t < 14.3 ? ov.igual : 0); pop('door', ov.door && t < 11.3 ? ov.door : 0); pop('amigo', ov.amigo && t < 46.0 ? ov.amigo : 0);
  const q = $('qi3'); q.style.opacity = ov.qi ? 1 : 0;
  const duo = $('duo'); duo.style.opacity = ov.duo || 0;
  $('dj').textContent = '3.276.800'; $('dr').textContent = '13.107.200'; $('djb').style.background = '#e9a400'; $('djl').textContent = 'JOSEPH';
  ['ap0', 'ap1', 'ap2', 'rbig'].forEach(id => $(id).style.opacity = 0);
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0; cp.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
