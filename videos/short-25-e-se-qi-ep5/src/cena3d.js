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
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: false }); t0 += d; }
  }
}
const $ = id => document.getElementById(id);
const v = new THREE.Vector3();
const facing = (a, b) => Math.atan2(b[0] - a[0], b[2] - a[2]);
const WORDS = ['HELLO', 'BONJOUR', 'HOLA', 'CIAO', 'HALLO', 'OLÁ', 'ПРИВЕТ', 'E = mc²', '42', 'π', 'NAMASTE', 'SALVE'];
const wl = $('words'); const wEls = WORDS.map(w => { const d = document.createElement('div'); d.className = 'w'; d.textContent = w; wl.appendChild(d); return d; });

// extras do ep. 5: gelo, lâmpada, janela com o bairro
const bulb = grp(scene);
mesh(sph(0.2, 24, 16), new THREE.MeshStandardMaterial({ color: '#fff3a0', emissive: '#ffd54a', emissiveIntensity: 2.2 }), bulb, [0, 0.12, 0]);
mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.14, 16), M('#9aa5b1', { metalness: 0.4 }), bulb, [0, -0.1, 0]);
const bulbLight = new THREE.PointLight('#ffd54a', 0, 5, 2); scene.add(bulbLight);
const iceMat = new THREE.MeshStandardMaterial({ color: '#bde8ff', transparent: true, opacity: 0.38, roughness: 0.1, metalness: 0.1, emissive: '#7fdcff', emissiveIntensity: 0.15 });
const ice = grp(scene); const shards = [];
for (let i = 0; i < 14; i++) {
  const a = i / 14 * Math.PI * 2, y = 0.3 + (i % 3) * 1.0;
  const m = mesh(rbox(0.95, 1.05, 0.12, 0.05), iceMat, ice, [Math.sin(a) * 0.85, y, Math.cos(a) * 0.85], [0, a, 0]); m.castShadow = false;
  shards.push({ m, p: m.position.clone(), r: m.rotation.clone(), a });
}
const icetop = mesh(rbox(1.7, 0.12, 1.7, 0.05), iceMat, ice, [0, 3.15, 0]); icetop.castShadow = false;
// janela: bairro (textura)
const wc = document.createElement('canvas'); wc.width = 1024; wc.height = 716; const wx = wc.getContext('2d');
const wtex = new THREE.CanvasTexture(wc); wtex.colorSpace = THREE.SRGBColorSpace;
const HOUSES = [[40, 300, 150, '#5e548e'], [210, 260, 140, '#355070'], [370, 320, 170, '#6d597a'], [560, 280, 150, '#2d6a4f'], [730, 250, 130, '#3d405b'], [880, 310, 130, '#6b4226']];
function drawStreet(t, robotX, eyesBig) {
  const g = wx.createLinearGradient(0, 0, 0, 716); g.addColorStop(0, '#1b1440'); g.addColorStop(0.6, '#ff8c61'); g.addColorStop(1, '#2b2140');
  wx.fillStyle = g; wx.fillRect(0, 0, 1024, 716);
  HOUSES.forEach(([x, h, w, c], i) => {
    const near = Math.abs(robotX - (x + w / 2)) < 120;
    wx.fillStyle = c; wx.fillRect(x, 620 - h, w, h);
    wx.beginPath(); wx.moveTo(x - 10, 620 - h); wx.lineTo(x + w / 2, 560 - h); wx.lineTo(x + w + 10, 620 - h); wx.fill();
    for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) {
      const on = near ? Math.sin(t * 20 + r + k + i) > -0.3 : Math.sin(t * 3 + i * 1.7 + r * 2.1 + k) > 0.2;
      wx.fillStyle = on ? (near ? ['#7fdcff', '#ff4d6d', '#52d273', '#ffd60a'][(Math.floor(t * 8) + r + k) % 4] : '#ffd27a') : '#1d1d2b';
      wx.fillRect(x + 18 + k * (w / 2 - 6), 640 - h + r * (h / 3.4), w / 2 - 36, h / 6);
    }
  });
  wx.fillStyle = '#2b2b33'; wx.fillRect(0, 620, 1024, 96); wx.fillStyle = '#ffd60a'; for (let x = 20; x < 1024; x += 90) wx.fillRect(x, 662, 50, 8);
  // semáforo
  wx.fillStyle = '#111'; wx.fillRect(980, 380, 12, 240); wx.fillRect(962, 330, 48, 120);
  ['#ff2d55', '#ffd60a', '#52d273'].forEach((c, i) => { wx.fillStyle = Math.floor(t * 9 + i) % 3 === 0 ? c : '#333'; wx.beginPath(); wx.arc(986, 352 + i * 38, 14, 0, 7); wx.fill(); });
  // robô na rua
  if (robotX > -100) { wx.fillStyle = '#111'; wx.fillRect(robotX - 26, 545, 52, 75); wx.fillRect(robotX - 20, 510, 40, 34); wx.fillStyle = '#ff2d55'; wx.beginPath(); wx.arc(robotX - 8, 526, 5, 0, 7); wx.arc(robotX + 8, 526, 5, 0, 7); wx.fill(); }
  if (eyesBig > 0) { wx.fillStyle = `rgba(5,5,12,${0.85 * eyesBig})`; wx.fillRect(0, 0, 1024, 716); wx.fillStyle = '#ff2d55'; wx.shadowColor = '#ff2d55'; wx.shadowBlur = 60; wx.beginPath(); wx.arc(420, 340, 46 * eyesBig, 0, 7); wx.arc(604, 340, 46 * eyesBig, 0, 7); wx.fill(); wx.shadowBlur = 0; }
  wtex.needsUpdate = true;
}
const RB = [3.75, 0, -1.1], JB = [2.45, 0.86, -1.0], WIN = [0.5, 0, -3.2];

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  setDay(1); camera.fov = 52;
  J.position.set(...JB); J.rotation.set(0, facing(JB, [3.15, 0, -1.85]), 0); jo.legs.forEach(l => l.visible = true);
  jo.head.scale.setScalar(2.0); glasses.visible = true;
  const thaw = seg(t, 24.0, 24.8);
  const frozen = t > 4.0 && t < 24.0;
  jo.mats.skin.emissive.set(t > 24.0 ? '#ffb703' : '#7fdcff'); jo.mats.skin.emissiveIntensity = t > 24.0 ? 0.08 + 0.25 * Math.max(0, 1 - (t - 24.0) * 1.2) : (frozen ? 0.1 : 0);
  robot.visible = false; robot.scale.setScalar(1.18); robot.position.set(...RB); robot.rotation.set(0, facing(RB, [3.15, 0, -1.85]), 0); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 4; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 4)); mouthMat.emissiveIntensity = 0.4;
  bParts.forEach(b => { b.m.visible = true; b.m.position.set(...b.p); b.m.rotation.set(0, 0, 0); b.m.scale.set(1, 1, 1); });
  drawPhone(false, 0); phoneLight.intensity = 0; eyeLight.intensity = 0;
  dizzy.forEach(d => d.visible = false); sparks.forEach(s => s.visible = false);
  bulb.visible = false; bulbLight.intensity = 0;
  ice.visible = false; ice.position.set(JB[0], 0, JB[2]); iceMat.opacity = 0.38;
  shards.forEach(s => { s.m.position.copy(s.p); s.m.rotation.copy(s.r); s.m.visible = true; }); icetop.visible = true;
  quarto.glass.map = null; quarto.glass.color.set('#bfe3ff'); quarto.glass.needsUpdate = true;
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0;
  let jn = 409600, rn = 409600;
  if (t > 8.2) rn = 3276800; if (t > 27.18) jn = 819200; if (t > 28.75) jn = 1638400; if (t > 40.88) rn = 13107200;
  const reachPose = (k = 1) => jo.pose({ breathe: frozen ? 0 : jb, lean: 0.15, armR: [lerp(0.3, 1.25, k), -0.15, 0.15], armL: [0.3, 0.3, 0.4] });

  if (t < 8.2) { // ======== resumo do ep. 4 ========
    ov.recap = 1;
    if (t < 3.6) {
      robot.visible = true;
      const press = seg(t, 2.6, 3.0) * (1 - seg(t, 3.3, 3.6));
      rarms[1].rotation.set(-1.25 + 0.35 * press, 0, -0.15);
      bParts[1].m.scale.set(1, 1 - 0.45 * press, 1);
      reachPose(seg(t, 0.6, 2.6)); jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, -0.3] });
      camPos = [3.1, 2.1, -3.7]; camLook = [3.1, 1.75, -1.1];
      ov.click = seg(t, 3.0, 3.25);
    } else if (t < 5.7) {
      reachPose(); jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, -0.3] });
      ice.visible = t > 4.1; ice.scale.set(1, seg(t, 4.1, 4.6), 1);
      camPos = [2.5, 2.4, -3.75]; camLook = [2.45, 2.0, -1.0]; camera.fov = 70;
    } else {
      reachPose(); jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, -0.3] }); ice.visible = true;
      robot.visible = true;
      const k = lin(t, 5.7, 6.7), out = lin(t, 6.8, 7.7);
      const p0 = RB, p1 = [WIN[0], 0, -2.8];
      robot.position.set(lerp(p0[0], p1[0], sm(k)), out * 1.0, lerp(p0[2], p1[2], sm(k)) - out * 1.8);
      robot.rotation.y = Math.PI;
      const w = walkPose(k * 6, k > 0 && k < 1 ? 1 : 0); if (k < 1) rarms.forEach((a, i) => a.rotation.set((i ? 1 : -1) * Math.sin(k * 6 * Math.PI) * 0.5, 0, 0));
      if (out > 0) rarms.forEach(a => a.rotation.set(-2.6, 0, 0));
      camPos = [0.6, 2.3, 2.6]; camLook = [0.6, 1.9, -3.0];
    }
  } else if (t < 13.3) { // ======== dia 13: ainda congelado ========
    reachPose(); jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, -0.3] }); ice.visible = true;
    const a = lerp(-0.5, 0.4, sm((t - 8.2) / 5.1));
    camPos = [JB[0] + Math.sin(a) * 3.4, 2.6, JB[2] + Math.cos(a) * 3.4]; camLook = [JB[0], 2.1, JB[2]];
    ov.day = seg(t, 8.5, 8.8) * (t < 11.5 ? 1 : 0); ov.duo = t > 9.7 ? 1 : 0;
  } else if (t < 22.2) { // ======== um gênio lembra ========
    reachPose(); ice.visible = true;
    const idea = seg(t, 17.8, 18.2);
    jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: t < 17.8 ? [Math.sin(t * 1.5) * 0.8, 0.2] : [0, 0.8] });
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v);
    bulb.visible = idea > 0; bulb.scale.setScalar(back(idea) * 1.5); bulb.position.set(v.x, v.y + 1.45, v.z); bulbLight.position.copy(bulb.position); bulbLight.intensity = 6 * idea;
    if (t < 19.0) { camPos = [2.5, 2.5, -3.75]; camLook = [2.45, 2.4, -1.0]; camera.fov = 70; }
    else { camPos = mix3([3.5, 1.75, -1.0], [3.4, 1.6, -1.25], sm((t - 19) / 3.2)); camLook = [3.15, 1.2, -1.85]; bParts[1].m.material.emissiveIntensity = 0.25 + 0.5 * Math.abs(Math.sin(t * 5)); }
    ov.genio = t > 15.9 && t < 17.6 ? seg(t, 15.9, 16.2) : 0; ov.despausa = seg(t, 19.1, 19.4);
  } else if (t < 30.3) { // ======== aperta, o gelo racha, o QI volta a dobrar ========
    bParts[1].m.material.emissiveIntensity = 0.25;
    const press = seg(t, 22.6, 23.0) * (1 - seg(t, 23.4, 23.8));
    bParts[1].m.scale.set(1, 1 - 0.45 * press, 1);
    ice.visible = t < 25.2;
    const cr = lin(t, 24.05, 25.1);
    shards.forEach((s, i) => { if (cr > 0) { s.m.position.set(s.p.x + Math.sin(s.a) * cr * 2.2, s.p.y + cr * 1.2 - cr * cr * 2.5, s.p.z + Math.cos(s.a) * cr * 2.2); s.m.rotation.set(s.r.x + cr * 5, s.r.y + cr * 3, cr * 4); } });
    iceMat.opacity = 0.38 * (1 - cr * 0.8); icetop.position.y = 3.15 + cr * 1.5;
    if (t > 23.5 && t < 24.05) shake = 0.02 * Math.sin(t * 90);
    shake += 0.06 * Math.max(0, 1 - Math.abs(t - 24.1) * 3);
    const n = [27.18, 28.75].filter(x => t >= x).length;
    const pulse = n ? bounce(lin(t, [27.18, 28.75][n - 1], [27.18, 28.75][n - 1] + 0.6)) : 0;
    jo.head.scale.setScalar(2.0 + 0.12 * n + 0.15 * pulse);
    if (t > 25.0) jo.mats.skin.emissiveIntensity = 0.1 + 0.08 * n;
    if (t < 25.0) { reachPose(); jo.face({ open: 1.3, mouth: t > 24.1 ? 'smile' : 'o', brow: 1.0, look: [0.6, -0.3] }); camPos = [3.1, 2.15, -3.75]; camLook = [2.8, 1.9, -1.05]; camera.fov = 62; }
    else {
      J.rotation.y = facing(JB, [2.4, 0, 3.0]);
      jo.pose({ breathe: jb, armL: [lerp(0.3, 2.7, seg(t, 25.2, 25.7)), 0.5, 0.1], armR: [lerp(0.3, 2.7, seg(t, 25.2, 25.7)), 0.5, 0.1] });
      jo.face({ open: blink(t), mouth: 'smile', brow: 0.9, look: [0, 0.3] });
      camPos = mix3([2.45, 2.6, 3.0], [2.45, 2.65, 3.6], sm((t - 25) / 5.3)); camLook = [2.45, 2.45, -1.0];
    }
    ov.click = t < 24.0 ? seg(t, 23.0, 23.25) : 0; ov.duo = t > 25.0 ? 1 : 0; ov.crack = seg(t, 24.05, 24.3) * (t < 25.6 ? 1 : 0);
  } else { // ======== a janela: o bairro piscando ========
    jo.mats.skin.emissiveIntensity = 0.18; jo.head.scale.setScalar(2.24);
    setDay(0.45);
    const k = lin(t, 30.6, 31.9), W0 = JB, W1 = [0.5, 0.86, -2.85];
    const w = walkPose(k * 8, k > 0 && k < 1 ? 1.3 : 0);
    J.position.set(lerp(W0[0], W1[0], sm(k)), 0.86 + w.bob * 1.4, lerp(W0[2], W1[2], sm(k)));
    J.rotation.y = k < 1 ? facing(W0, W1) : Math.PI;
    const turn = seg(t, 43.6, 44.3);
    if (t > 43.6) { J.rotation.y = lerp(Math.PI, 0.2, turn); J.position.x = lerp(0.5, -0.75, turn); J.position.z = lerp(-2.85, -2.2, turn); }
    jo.pose({ breathe: jb, leg: w.leg, armL: k < 1 ? w.armL : [0.3, 0.3, 0.4], armR: k < 1 ? w.armR : [0.3, 0.3, 0.4] });
    jo.face({ open: t > 43.6 ? 0.9 : 1.3, mouth: t > 43.6 ? 'flat' : 'o', brow: t > 43.6 ? -0.4 : 1.0, browTilt: t > 43.6 ? 0.45 : 0, look: [0, 0] });
    const rx = t < 34.88 ? -200 : lerp(60, 960, lin(t, 35.0, 42.0));
    drawStreet(t, rx, seg(t, 44.3, 45.2));
    quarto.glass.map = wtex; quarto.glass.color.set('#ffffff'); quarto.glass.needsUpdate = true;
    if (t < 34.6) { camPos = mix3([1.6, 2.6, 2.6], [1.0, 2.6, 1.6], sm((t - 30.3) / 4.3)); camLook = [0.5, 2.3, -3.6]; }
    else if (t < 43.4) { camPos = [0.5, 2.35, -1.55]; camLook = [0.5, 2.3, -4.0]; camera.fov = 48; J.visible = false; }
    else { camPos = mix3([0.1, 2.45, 2.2], [0.1, 2.45, 1.4], sm((t - 43.4) / 10)); camLook = [0.1, 2.3, -3.2]; }
    J.visible = !(t >= 34.6 && t < 43.4);
    ov.apps = t > 34.6 && t < 43.4; ov.rbig = t > 40.88 && t < 43.4 ? 1 : 0; ov.rbigK = bounce(lin(t, 40.88, 41.5));
    ov.duo = t > 45.0 && t < 48.2 ? 1 : 0; ov.end = seg(t, 48.4, 48.8);
  }
  if (t < 30.3) J.visible = true;

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  $('root').style.filter = ov.recap ? 'grayscale(0.75) contrast(1.05)' : '';
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('recap', ov.recap ? 1 : 0); pop('day', ov.day || 0); pop('end', ov.end || 0); pop('click', ov.click || 0); pop('frz', ov.crack || 0);
  pop('genio', ov.genio || 0); pop('despausa', ov.despausa && t < 22.2 ? ov.despausa : 0);
  $('frz').textContent = 'CRACK!';
  const duo = $('duo'); duo.style.opacity = ov.duo || 0;
  $('dj').textContent = jn.toLocaleString('pt-BR'); $('dr').textContent = rn.toLocaleString('pt-BR');
  const fz = t < 24.0; $('djb').style.background = fz ? '#4ea8de' : '#e9a400'; $('djl').textContent = fz ? 'JOSEPH (CONGELADO)' : 'JOSEPH';
  [[37.78, 'TV', '#3a86ff'], [38.65, 'GELADEIRA', '#52d273'], [39.68, 'SEMÁFORO', '#ffd60a']].forEach((a, i) => { const e = $('ap' + i); const on = ov.apps && t > a[0]; e.textContent = a[1]; e.style.color = a[2]; e.style.opacity = on ? 1 : 0; e.style.left = '540px'; e.style.top = (400 + i * 130) + 'px'; e.style.transform = `translateX(-50%) scale(${0.6 + 0.4 * back(lin(t, a[0], a[0] + 0.3))})`; });
  const rb = $('rbig'); rb.style.opacity = ov.rbig ? 1 : 0; rb.textContent = 'ROBÔ: QI 13.107.200'; rb.style.transform = `translateX(-50%) scale(${1 + 0.2 * (ov.rbigK || 0)})`;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0; cp.style.color = '#fff';
};
