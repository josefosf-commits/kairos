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

// extras do ep. 5: lâmpada da ideia, luz da porta, etiquetas dos aparelhos
const bulb = grp(scene);
mesh(sph(0.2, 24, 16), new THREE.MeshStandardMaterial({ color: '#fff3a0', emissive: '#ffd54a', emissiveIntensity: 2.2 }), bulb, [0, 0.12, 0]);
mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.14, 16), M('#9aa5b1', { metalness: 0.4 }), bulb, [0, -0.1, 0]);
const bulbLight = new THREE.PointLight('#ffd54a', 0, 5, 2); scene.add(bulbLight);
const doorLight = new THREE.PointLight('#7fdcff', 0, 7, 1.5); doorLight.position.set(-5.6, 1.4, 1.3); scene.add(doorLight);
const doorHole = scene.children.find(o => o.isMesh && o.material && o.material.isMeshBasicMaterial && o.position.x > -5.95 && o.position.x < -5.85 && Math.abs(o.position.z - 1.3) < 0.01);
const APPS = [[11.58, 'TV', '#3a86ff'], [12.55, 'MICRO-ONDAS', '#ff9f1c'], [13.78, 'GELADEIRA', '#52d273']];
const pv = new THREE.Vector3();
function at(el, p, on, sc = 1) { if (!on) { el.style.opacity = 0; return; } pv.set(...p).project(camera); el.style.opacity = 1; el.style.left = ((pv.x + 1) / 2 * W) + 'px'; el.style.top = ((1 - pv.y) / 2 * H) + 'px'; el.style.transform = `translate(-50%,-50%) scale(${sc})`; }

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  setDay(1); camera.fov = 52;
  J.position.set(-2.0, 0.86, -0.3); J.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  jo.head.scale.setScalar(2.0); glasses.visible = true;
  const unfrozen = t > 28.3;
  jo.mats.skin.emissive.set(unfrozen ? '#ffb703' : '#7fdcff'); jo.mats.skin.emissiveIntensity = unfrozen ? 0.08 + 0.25 * Math.max(0, 1 - (t - 28.3) * 1.5) : 0.06;
  robot.visible = t < 4.4 || (t > 34.8 && t < 45); robot.scale.setScalar(1.18); robot.rotation.set(0, 0, 0); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 4; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 4)); mouthMat.emissiveIntensity = 0.4;
  leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 5 + i)) * 2);
  bParts.forEach(b => { b.m.visible = true; b.m.position.set(...b.p); b.m.rotation.set(0, 0, 0); b.m.scale.set(1, 1, 1); });
  drawPhone(false, 0); phoneLight.intensity = 0; eyeLight.intensity = 0;
  dizzy.forEach(d => d.visible = false); sparks.forEach(s => s.visible = false);
  bulb.visible = false; bulbLight.intensity = 0; doorLight.intensity = 0; if (doorHole) doorHole.material.color.set('#2b2d42');
  if (t < 0) { // ---- capa: Joseph dourado x robô na porta ----
    thumbLights([0.4, 2.8, 2.6]); scene.background.set('#0b0820');
    J.position.set(0.3, 0.86, -0.1); J.rotation.y = -0.35; jo.head.scale.setScalar(1.8);
    jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.16;
    jo.pose({ breathe: 0, armL: [0.9, 0.5, 1.6], armR: [0.9, 0.5, 1.6], lean: -0.05 }); jo.face({ open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.45, look: [-0.8, 0.1] });
    robot.visible = true; robot.position.set(-1.7, 0, -1.5); robot.rotation.set(0, 0.6, 0); robot.scale.setScalar(1.25);
    eyeMat.emissiveIntensity = 6; antMat.emissiveIntensity = 4; mouthMat.emissiveIntensity = 2.5; leds.forEach(l => l.material.emissiveIntensity = 3);
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x + 0.4, v.y, v.z + 0.9); eyeLight.intensity = 10;
    bParts.forEach(b => b.m.visible = false);
    camera.fov = 52; camera.updateProjectionMatrix(); cam([-0.4, 2.0, 4.9], [-0.4, 2.45, -0.5], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0;
  let jn = 409600, rn = 3276800;
  if (t > 15.0) rn = 3276800; if (t > 18.37) rn = 6553600; if (t > 19.81) rn = 13107200;
  if (t > 31.72) jn = 819200; if (t > 33.22) jn = 1638400;
  const outside = t > 10.0 && t < 34.8;
  if (outside) { const cols = ['#3a86ff', '#ff9f1c', '#52d273', '#ff2d55', '#c77dff']; const c = cols[Math.floor(t * (t > 18 ? 9 : 4)) % cols.length]; if (doorHole) doorHole.material.color.set(c); doorLight.color.set(c); doorLight.intensity = t > 18 ? 9 : 5; }
  const DP = [-5.85, 0, 1.3];
  // Joseph sentado tonto perto da porta (depois da batida)
  const sitDoor = () => { J.position.set(-3.6, 0.34, -0.4); J.rotation.y = -1.0; jo.pose({ breathe: jb, leg: [1.5, 1.4], armL: [-0.3, 0.5, 0.2], armR: [-0.3, 0.5, 0.2] }); };

  if (t < 4.4) { // ---- o robô sai do quarto ----
    const k = lin(t, 0.8, 3.9), A = [-2.9, 0, 0.9], B = [-6.9, 0, 1.3];
    const w = walkPose(k * 7, k > 0 && k < 1 ? 1 : 0);
    robot.position.set(lerp(A[0], B[0], k), Math.abs(w.bob) * 0.6, lerp(A[2], B[2], k)); robot.rotation.y = -Math.PI / 2;
    rarms.forEach((a, i) => a.rotation.set((i ? 1 : -1) * Math.sin(k * 7 * Math.PI) * 0.5, 0, 0));
    jo.pose({ breathe: jb, armL: [0.6, 0.4, 1.0], armR: [0.6, 0.4, 1.0] }); J.rotation.y = -1.3;
    jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [-0.7, 0] });
    camPos = mix3([-3.6, 2.6, 8.6], [-4.0, 2.5, 8.0], sm(t / 4.4)); camLook = [-4.7, 1.8, 1.0];
    ov.day = seg(t, 0.4, 0.7);
  } else if (t < 8.9) { // ---- a cabeça não passa ----
    const A0 = [-2.0, 0.86, -0.3], A1 = [-4.85, 0.86, 1.25];
    const k = lin(t, 4.8, 7.55), w = walkPose(k * 7, k > 0 && k < 1 ? 1 : 0);
    const hit = t > 7.55 ? bounce(lin(t, 7.55, 8.5)) : 0;
    J.position.set(lerp(A0[0], A1[0], sm(k)) + hit * 0.35, 0.86 + w.bob, lerp(A0[2], A1[2], sm(k)));
    J.rotation.y = -Math.PI / 2 + 0.55;
    jo.head.scale.set(2.0 + 0.3 * hit, 2.0 - 0.35 * hit, 2.0 + 0.3 * hit);
    jo.pose({ breathe: jb, leg: w.leg, armL: t > 7.55 ? [1.6, 0.9, 2.3] : w.armL, armR: t > 7.55 ? [1.6, 0.9, 2.3] : w.armR });
    jo.face({ open: t > 7.55 ? 0.5 : 1.2, mouth: t > 7.55 ? 'o' : 'flat', brow: t > 7.55 ? -0.3 : 0.6, browTilt: t > 7.55 ? 0.3 : 0 });
    if (t > 7.65) { scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); dizzy.forEach((d, i) => { const a = t * 5 + i / 5 * Math.PI * 2; d.visible = true; d.position.set(v.x + Math.cos(a) * 0.9, v.y + 0.95, v.z + Math.sin(a) * 0.9); d.rotation.y = t * 4; }); }
    shake = t > 7.55 ? 0.07 * Math.max(0, 1 - (t - 7.55) * 2.5) : 0;
    camPos = mix3([-4.0, 2.6, 8.8], [-4.4, 2.5, 8.0], sm((t - 4.4) / 4.5)); camLook = [-5.0, 1.85, 1.2];
  } else if (t < 15.0) { // ---- lá fora, ele liga tudo ----
    sitDoor(); jo.face({ open: 1.2, mouth: 'o', brow: 0.8, look: [-0.8, 0.3] });
    camPos = mix3([-2.6, 2.0, 5.6], [-3.0, 1.95, 5.0], sm((t - 8.9) / 6.1)); camLook = [-5.2, 1.4, 0.8];
    ov.apps = true;
  } else if (t < 21.6) { // ---- mais forte ----
    sitDoor(); jo.face({ open: 1.35, mouth: 'o', brow: 1.2, look: [-0.8, 0.3] });
    if (t > 18.3) sparks.forEach((s, i) => { const a = i / 14 * Math.PI * 2 + t * 6; s.visible = true; s.position.set(DP[0] + 0.25, 1.1 + Math.sin(a * 2) * 0.9, DP[2] + Math.cos(a) * 0.5); s.scale.setScalar(0.8 + 0.6 * Math.abs(Math.sin(t * 9 + i))); });
    shake = t > 18.3 ? 0.03 : 0.01;
    camPos = mix3([-3.2, 1.6, 4.8], [-3.6, 1.55, 4.2], sm((t - 15) / 6.6)); camLook = [-5.4, 1.5, 0.9];
    ov.rbig = t > 18.3 ? 1 : 0; ov.rbigK = bounce(lin(t, t > 19.81 ? 19.81 : 18.37, (t > 19.81 ? 19.81 : 18.37) + 0.6));
  } else if (t < 24.6) { // ---- a ideia ----
    const up = seg(t, 21.6, 22.3);
    J.position.set(-3.6, lerp(0.34, 0.86, up), -0.4); J.rotation.y = lerp(-1.2, 0.6, seg(t, 22.0, 22.6));
    jo.pose({ breathe: jb, leg: [lerp(1.5, 0, up), lerp(1.4, 0, up)], armL: [0.3, 0.3, 0.4], armR: [lerp(0.3, 2.6, seg(t, 23.0, 23.3)), 0.1, 0.1] });
    const idea = seg(t, 22.9, 23.3);
    jo.face({ open: blink(t) * (idea > 0.5 ? 1.25 : 1), mouth: idea > 0.5 ? 'smile' : 'flat', brow: 0.3 + 0.8 * idea, look: [0, 0.6 * idea] });
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v);
    bulb.visible = idea > 0; bulb.scale.setScalar(back(idea) * 1.6); bulb.position.set(v.x, v.y + 1.35 + 0.05 * Math.sin(t * 4), v.z);
    bulbLight.position.copy(bulb.position); bulbLight.intensity = 7 * idea;
    camPos = mix3([-1.4, 2.5, 2.6], [-1.6, 2.5, 2.2], sm((t - 21.6) / 3)); camLook = [-3.6, 2.6, -0.4];
  } else if (t < 29.3) { // ---- aperta de novo: pra soltar ----
    const A = [-3.6, 0.86, -0.4], B = [2.45, 0.86, -1.0];
    const k = lin(t, 24.7, 27.2), w = walkPose(k * 9, k > 0 && k < 1 ? 1.3 : 0);
    J.position.set(lerp(A[0], B[0], sm(k)), 0.86 + w.bob * 1.4, lerp(A[2], B[2], sm(k))); J.rotation.y = k < 1 ? facing(A, B) : facing(B, [3.15, 0, -1.85]);
    const press = seg(t, 27.9, 28.3) * (1 - seg(t, 28.7, 29.1));
    jo.pose({ breathe: jb, lean: k < 1 ? 0.3 : 0.15, leg: w.leg, armL: k < 1 ? w.armL : [0.3, 0.3, 0.4], armR: k < 1 ? w.armR : [lerp(0.4, 1.3, seg(t, 27.3, 27.9)) - 0.2 * press, -0.15, 0.15] });
    jo.face({ open: 1.1, mouth: unfrozen ? 'smile' : 'flat', brow: -0.2, browTilt: 0.35, look: [0.5, -0.4] });
    bParts[1].m.scale.set(1, 1 - 0.45 * press, 1);
    if (t > 28.3) { scene.updateMatrixWorld(true); bParts[1].m.getWorldPosition(v); const kk = lin(t, 28.3, 29.0); if (kk < 1) sparks.forEach((s, i) => { const a = i / 14 * Math.PI * 2; s.visible = true; s.position.set(v.x + Math.cos(a) * kk * 0.8, v.y + 0.2 + kk * 0.6, v.z + Math.sin(a) * kk * 0.8); s.scale.setScalar(1.8 * (1 - kk)); }); }
    shake = 0.05 * Math.max(0, 1 - Math.abs(t - 28.3) * 4);
    if (t < 27.2) { camPos = [0.0, 2.8, 5.4]; camLook = [-0.5, 1.6, -0.2]; } else { camPos = [3.1, 2.15, -3.75]; camLook = [3.0, 1.75, -1.1]; }
    ov.click = seg(t, 28.3, 28.55); ov.duo = t > 27.2 ? 1 : 0;
  } else if (t < 34.8) { // ---- o QI dele volta a dobrar ----
    J.position.set(2.45, 0.86, -1.0); J.rotation.y = facing([2.45, 0, -1.0], [2.4, 0, 3.0]);
    const n = [31.72, 33.22].filter(x => t >= x).length;
    const pulse = n ? bounce(lin(t, [31.72, 33.22][n - 1], [31.72, 33.22][n - 1] + 0.6)) : 0;
    jo.head.scale.setScalar(2.0 + 0.12 * n + 0.15 * pulse);
    jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.1 + 0.08 * n;
    jo.pose({ breathe: jb, armL: [lerp(0.3, 2.7, seg(t, 29.7, 30.2)), 0.5, 0.1], armR: [lerp(0.3, 2.7, seg(t, 29.7, 30.2)), 0.5, 0.1] });
    jo.face({ open: blink(t), mouth: 'smile', brow: 0.9, look: [0, 0.3] });
    shake = 0.03 * pulse;
    camPos = mix3([2.45, 2.6, 3.0], [2.45, 2.65, 3.6], sm((t - 29.3) / 5.5)); camLook = [2.45, 2.45, -1.0];
    ov.duo = 1;
  } else { // ---- dois gênios na mesma casa ----
    J.position.set(0.2, 0.86, 0.2); J.rotation.y = facing([0.2, 0, 0.2], [-5.8, 0, 1.3]);
    jo.head.scale.setScalar(2.24); jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.18;
    jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.4], armR: [0.3, 0.3, 0.4] });
    jo.face({ open: 0.9, mouth: 'flat', brow: -0.4, browTilt: 0.45, look: [0, 0] });
    setDay(0.4);
    const peek = seg(t, 35.6, 36.4);
    robot.position.set(lerp(-7.0, -6.25, peek), -0.5, 1.3); robot.rotation.y = Math.PI / 2;
    eyeMat.emissiveIntensity = 6;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x + 0.8, v.y, v.z); eyeLight.intensity = 6 * peek;
    if (doorHole) doorHole.material.color.set('#0b0b12');
    camPos = mix3([1.6, 2.7, 2.2], [1.4, 2.6, 1.6], sm((t - 34.8) / 10)); camLook = [-5.6, 1.9, 1.3];
    ov.duo = t < 39.4 ? 1 : 0; ov.end = seg(t, 39.8, 40.2);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('day', ov.day && t < 3.0 ? ov.day : 0); pop('end', ov.end || 0); pop('click', ov.click && t < 29.3 ? ov.click : 0); pop('frz', 0);
  const duo = $('duo'); duo.style.opacity = ov.duo || 0;
  $('dj').textContent = jn.toLocaleString('pt-BR'); $('dr').textContent = rn.toLocaleString('pt-BR');
  $('djb').style.background = unfrozen ? '#e9a400' : '#4ea8de'; $('djl').textContent = unfrozen ? 'JOSEPH' : 'JOSEPH (CONGELADO)';
  APPS.forEach((a, i) => { const e = $('ap' + i); const on = ov.apps && t > a[0]; e.style.opacity = on ? 1 : 0; e.style.left = '540px'; e.style.top = (300 + i * 150) + 'px'; e.style.transform = `translateX(-50%) scale(${0.6 + 0.4 * back(lin(t, a[0], a[0] + 0.3))})`; });
  const rb = $('rbig'); rb.style.opacity = ov.rbig ? 1 : 0; rb.textContent = 'ROBÔ: QI ' + rn.toLocaleString('pt-BR'); rb.style.transform = `translateX(-50%) scale(${1 + 0.2 * (ov.rbigK || 0)})`;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0; cp.style.color = '#fff';
};
