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

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t);
  setDay(1); camera.fov = 52;
  J.position.set(-2.0, 0.86, -0.6); J.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  jo.head.scale.setScalar(2.0); glasses.visible = true;
  jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.08;
  robot.position.set(0.4, 0, -1.3); robot.rotation.set(0, 0.2, 0); robot.scale.setScalar(1); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 3.2; antMat.emissiveIntensity = 1.2 + Math.abs(Math.sin(t * 4)); mouthMat.emissiveIntensity = 0.4; rmouth.scale.set(1, 1, 1);
  leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 5 + i)) * 1.5);
  bParts.forEach(b => { b.m.visible = true; b.m.position.set(...b.p); b.m.rotation.set(0, 0, 0); b.m.scale.set(1, 1, 1); });
  drawPhone(true, 1); phoneLight.position.set(-3.2, 1.35, -2.2); phoneLight.intensity = 2.5;
  dizzy.forEach(d => d.visible = false); sparks.forEach(s => s.visible = false);
  scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.7); eyeLight.intensity = 3;
  if (t < 0) { // ---- capa: robô gigante x Joseph congelado ----
    thumbLights([0.4, 2.8, 2.6]); scene.background.set('#0b0820');
    J.position.set(-0.5, 0.86, 0.1); J.rotation.y = 0.5; jo.head.scale.setScalar(1.7);
    jo.pose({ breathe: 0, armL: [1.7, 1.0, 2.4], armR: [1.7, 1.0, 2.4] }); jo.face({ open: 1.4, mouth: 'o', brow: 1.3, look: [0.8, 0.3] });
    jo.mats.skin.emissive.set('#7fdcff'); jo.mats.skin.emissiveIntensity = 0.14;
    robot.position.set(1.0, 0, -1.0); robot.rotation.set(0, -0.45, 0); robot.scale.setScalar(1.3); rhead.rotation.set(0.08, 0, -0.06);
    eyeMat.emissiveIntensity = 6; antMat.emissiveIntensity = 4; mouthMat.emissiveIntensity = 2.5; leds.forEach(l => l.material.emissiveIntensity = 3);
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x - 0.3, v.y, v.z + 0.9); eyeLight.intensity = 10;
    bParts.forEach(b => b.m.visible = false); phoneLight.intensity = 0;
    camera.fov = 52; camera.updateProjectionMatrix(); cam([0.3, 2.0, 4.8], [0.3, 2.45, -0.5], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0;
  const RA = [0.4, 0, -1.3], RB = [3.75, 0, -1.1], JA = [-2.0, 0.86, -0.6], JB = [2.45, 0.86, -1.0];
  const pressK = seg(t, 16.9, 17.35);
  let jn = 409600, rn = 409600, frozen = t > 17.35;
  if (t > 25.43) rn = 819200; if (t > 26.99) rn = 1638400; if (t > 28.19) rn = 3276800;

  // posições comuns: robô anda até o botão, Joseph corre
  const rk = lin(t, 7.55, 12.6), rw = walkPose(rk * 6, rk > 0 && rk < 1 ? 1 : 0);
  if (t > 5.9) {
    robot.position.set(lerp(RA[0], RB[0], sm(rk)), Math.abs(rw.bob) * 0.6, lerp(RA[2], RB[2], sm(rk)));
    robot.rotation.y = rk > 0 ? facing(RA, RB) * (1 - seg(t, 12.6, 13.0)) + facing(RB, [3.15, 0, -1.85]) * seg(t, 12.6, 13.0) : lerp(0.2, facing(RA, [3.15, 0, -1.85]), seg(t, 5.9, 6.6));
    if (rk > 0 && rk < 1) rarms.forEach((a, i) => a.rotation.set((i ? 1 : -1) * Math.sin(rk * 6 * Math.PI) * 0.5, 0, 0));
  }
  const reachR = seg(t, 11.4, 13.4), press = pressK * (1 - seg(t, 17.8, 18.3));
  if (t > 11.4) { rarms[1].rotation.set(-lerp(0.2, 1.25, reachR) + 0.35 * press, 0, -0.15); }
  const jk = lin(t, 10.0, 12.2), jw = walkPose(jk * 9, jk > 0 && jk < 1 ? 1.4 : 0);
  if (t > 9.8) { J.position.set(lerp(JA[0], JB[0], sm(jk)), 0.86 + jw.bob * 1.5, lerp(JA[2], JB[2], sm(jk))); J.rotation.y = jk < 1 ? facing(JA, JB) : facing(JB, [3.15, 0, -1.85]); }
  const reachJ = seg(t, 11.6, 13.5);

  if (t < 5.4) { // ---- o robô voltou ----
    jo.pose({ breathe: jb, armL: [1.7, 1.0, 2.4], armR: [1.7, 1.0, 2.4] });
    jo.face({ open: 1.35, mouth: 'o', brow: 1.2, look: [0.7, 0.2] });
    J.rotation.y = facing(JA, RA);
    camPos = mix3([-0.6, 2.6, 5.0], [-0.6, 2.5, 4.4], sm(t / 5.4)); camLook = [-0.6, 1.8, -1.0];
    ov.day = seg(t, 0.4, 0.7) * (t < 3.0 ? 1 : 0); ov.duo = seg(t, 2.9, 3.3);
  } else if (t < 9.6) { // ---- ele vai até o botão ----
    jo.pose({ breathe: jb, armL: [0.6, 0.4, 1.0], armR: [0.6, 0.4, 1.0] }); J.rotation.y = facing(JA, robot.position.toArray());
    jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, 0] });
    camPos = mix3([0.3, 2.5, 5.2], [0.7, 2.45, 4.8], sm((t - 5.4) / 4.2)); camLook = [0.9, 1.6, -1.3];
    ov.duo = 1;
  } else if (t < 14.0) { // ---- corrida até o botão ----
    jo.pose({ breathe: jb, lean: jk < 1 ? 0.35 : 0.15, leg: jw.leg, armL: jk < 1 ? jw.armL : [0.3, 0.3, 0.4], armR: jk < 1 ? jw.armR : [lerp(0.4, 1.35, reachJ), -0.15, lerp(0.4, 0.15, reachJ)] });
    jo.face({ open: 1.3, mouth: 'o', brow: -0.2, browTilt: 0.4, look: [0.6, -0.3] });
    if (t < 11.35) { camPos = [0.0, 2.6, 5.4]; camLook = [0.2, 1.5, -0.9]; }
    else { const s = sm((t - 11.35) / 2.6); camPos = [3.1, lerp(2.1, 1.95, s), lerp(-3.75, -3.55, s)]; camLook = [3.1, 1.7, -1.1]; }
  } else if (t < 18.6) { // ---- o robô aperta ----
    jo.pose({ breathe: jb, lean: 0.15, armR: [lerp(1.35, 1.25, pressK), -0.15, 0.15], armL: [0.3, 0.3, 0.4] });
    jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, -0.3] });
    bParts[1].m.scale.set(1, 1 - 0.45 * press, 1);
    if (t > 17.3) { scene.updateMatrixWorld(true); bParts[1].m.getWorldPosition(v); const k = lin(t, 17.3, 18.0); if (k < 1) sparks.forEach((s, i) => { const a = i / 14 * Math.PI * 2; s.visible = true; s.position.set(v.x + Math.cos(a) * k * 0.8, v.y + 0.2 + k * 0.6, v.z + Math.sin(a) * k * 0.8); s.scale.setScalar(1.8 * (1 - k)); }); }
    shake = 0.05 * Math.max(0, 1 - Math.abs(t - 17.35) * 4);
    camPos = mix3([3.1, 2.2, -3.8], [3.1, 2.1, -3.6], sm((t - 14) / 4.6)); camLook = [3.1, 1.75, -1.1];
    ov.click = seg(t, 17.35, 17.6);
  } else if (t < 23.0) { // ---- Joseph congela ----
    jo.pose({ breathe: 0, lean: 0.15, armR: [1.25, -0.15, 0.15], armL: [0.3, 0.3, 0.4] });
    jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, -0.3] });
    jo.mats.skin.emissive.set('#7fdcff'); jo.mats.skin.emissiveIntensity = 0.35 * seg(t, 18.9, 19.6);
    camPos = mix3([2.5, 2.4, -3.75], [2.5, 2.35, -3.55], sm((t - 18.6) / 4.4)); camLook = [2.45, 2.25, -1.0]; camera.fov = 70;
    ov.frozenTxt = seg(t, 19.2, 19.5); ov.duo = 1;
  } else if (t < 29.6) { // ---- o QI do robô continua dobrando ----
    jo.pose({ breathe: 0, lean: 0.15, armR: [1.25, -0.15, 0.15], armL: [0.3, 0.3, 0.4] });
    jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [0.6, -0.3] }); jo.mats.skin.emissive.set('#7fdcff'); jo.mats.skin.emissiveIntensity = 0.35;
    robot.rotation.y = facing(RB, [3.8, 0, -3.6]);
    const n = [25.43, 26.99, 28.19].filter(x => t >= x).length;
    const pulse = n ? bounce(lin(t, [25.43, 26.99, 28.19][n - 1], [25.43, 26.99, 28.19][n - 1] + 0.6)) : 0;
    robot.scale.setScalar(1 + 0.06 * n + 0.05 * pulse);
    eyeMat.emissiveIntensity = 3.5 + n; antMat.emissiveIntensity = 2 + 2 * n * Math.abs(Math.sin(t * 8));
    leds.forEach((l, i) => l.material.emissiveIntensity = 3 * Math.max(0, Math.sin(t * 12 + i)));
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.7); eyeLight.intensity = 4 + 2 * n;
    shake = 0.02 * pulse;
    camPos = mix3([3.9, 0.95, -3.7], [3.85, 0.9, -3.55], sm((t - 23) / 6.6)); camLook = [3.75, 2.1, -1.1];
    ov.duo = 1;
  } else if (t < 33.4) { // ---- "Agora eu sou o mais inteligente do planeta." ----
    robot.scale.setScalar(1.18); robot.rotation.y = facing(RB, [1.0, 0, 1.5]);
    const a = t > 29.96 && t < 32.92 ? amp : 0;
    mouthMat.emissiveIntensity = 0.5 + 3 * a; rmouth.scale.set(0.3 + 0.9 * a, 1 + 1.5 * a, 1); eyeMat.emissiveIntensity = 5;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.7); eyeLight.intensity = 6;
    J.position.set(9, 0, 9);
    const dir = new THREE.Vector3(Math.sin(robot.rotation.y), 0, Math.cos(robot.rotation.y));
    camPos = [v.x + dir.x * 1.5, v.y + 0.05, v.z + dir.z * 1.5]; camLook = [v.x, v.y - 0.05, v.z];
    shake = 0.006;
  } else { // ---- ele olha pela janela ----
    robot.scale.setScalar(1.18);
    const wk = lin(t, 34.2, 36.0), W0 = RB, W1 = [0.6, 0, -2.9];
    const ww = walkPose(wk * 5, wk > 0 && wk < 1 ? 1 : 0);
    robot.position.set(lerp(W0[0], W1[0], sm(wk)), Math.abs(ww.bob) * 0.6, lerp(W0[2], W1[2], sm(wk)));
    robot.rotation.y = wk < 1 ? facing(W0, W1) : Math.PI;
    if (wk > 0 && wk < 1) rarms.forEach((a, i) => a.rotation.set((i ? 1 : -1) * Math.sin(wk * 5 * Math.PI) * 0.5, 0, 0));
    if (t > 38.6) rhead.rotation.y = lerp(0, Math.PI * 0.75, seg(t, 38.6, 39.4));
    eyeMat.emissiveIntensity = 5; scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.5); eyeLight.intensity = 5;
    J.position.set(...JB); J.rotation.y = facing(JB, [3.15, 0, -1.85]);
    jo.pose({ breathe: 0, lean: 0.15, armR: [1.25, -0.15, 0.15], armL: [0.3, 0.3, 0.4] }); jo.face({ open: 1.3, mouth: 'o', brow: 1.0, look: [-0.6, -0.3] });
    jo.mats.skin.emissive.set('#7fdcff'); jo.mats.skin.emissiveIntensity = 0.35;
    camPos = mix3([0.6, 2.2, 1.6], [0.6, 2.3, 0.6], sm((t - 33.4) / 9)); camLook = [0.55, 2.2, -3.9];
    ov.end = seg(t, 36.6, 37.0);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('day', ov.day || 0); pop('end', ov.end || 0); pop('click', ov.click && t < 18.6 ? ov.click : 0); pop('frz', ov.frozenTxt || 0);
  const duo = $('duo'); duo.style.opacity = ov.duo || 0;
  $('dj').textContent = jn.toLocaleString('pt-BR'); $('dr').textContent = rn.toLocaleString('pt-BR');
  $('djb').style.background = frozen ? '#4ea8de' : '#e9a400'; $('djl').textContent = frozen ? 'JOSEPH (CONGELADO)' : 'JOSEPH';
  $('drb').style.transform = `scale(${1 + 0.12 * (t > 25.4 && t < 29.6 ? bounce(lin(t, [25.43, 26.99, 28.19].filter(x => t >= x).pop() || 0, ([25.43, 26.99, 28.19].filter(x => t >= x).pop() || 0) + 0.6)) : 0)})`;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0; cp.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
