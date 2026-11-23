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
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: l.id === 8 }); t0 += d; }
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
  J.position.set(0.3, 0.86, -0.4); J.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  jo.head.scale.setScalar(2.0); glasses.visible = true;
  jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.06;
  robot.position.set(1.0, 0, -1.6); robot.rotation.set(0, -0.3, 0); rhead.rotation.set(0.25, -0.7, 0.3); rarms[0].rotation.set(-0.6, 0, 0); rarms[1].rotation.set(0, 0, 0);
  eyeMat.emissiveIntensity = 0; antMat.emissiveIntensity = 0; mouthMat.emissiveIntensity = 0; rmouth.scale.set(1, 1, 1); leds.forEach(l => l.material.emissiveIntensity = 0); eyeLight.intensity = 0;
  bParts.forEach(b => { b.m.visible = t > 18.6; b.m.position.set(...b.p); b.m.rotation.set(0, 0, 0); });
  phoneLight.intensity = 0; dizzy.forEach(d => d.visible = false); sparks.forEach(s => s.visible = false);
  drawPhone(t > 29.1, lin(t, 29.1, 32.5));
  if (t < 0) { // ---- capa: cabeção assustado + robô de olhos vermelhos ----
    thumbLights([0.2, 2.8, 2.6]); scene.background.set('#0b0820');
    J.position.set(-0.35, 0.86, -0.2); J.rotation.y = 0.45; jo.head.scale.setScalar(1.9);
    jo.pose({ armL: [1.7, 1.0, 2.4], armR: [1.7, 1.0, 2.4] });
    jo.face({ open: 1.45, mouth: 'o', brow: 1.4, look: [0.8, 0] });
    robot.position.set(1.15, 0, -1.0); robot.rotation.set(0, -0.5, 0); rhead.rotation.set(0.05, 0, -0.06);
    eyeMat.emissiveIntensity = 4; antMat.emissiveIntensity = 3; mouthMat.emissiveIntensity = 2;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x - 0.3, v.y, v.z + 0.8); eyeLight.intensity = 9;
    bParts.forEach(b => b.m.visible = false);
    camera.fov = 50; camera.updateProjectionMatrix(); cam([0.35, 2.3, 4.6], [0.35, 2.45, -0.5], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0;

  if (t < 6.6) { // ---- a cabeça não passa pela porta ----
    const A0 = [-1.6, 0.86, 1.1], A1 = [-4.85, 0.86, 1.25];
    const k = lin(t, 2.6, 5.25), w = walkPose(k * 7, k > 0 && k < 1 ? 1 : 0);
    const hit = t > 5.25 ? bounce(lin(t, 5.25, 6.2)) : 0;
    J.position.set(lerp(A0[0], A1[0], sm(k)) + hit * 0.35, 0.86 + w.bob, lerp(A0[2], A1[2], sm(k)));
    J.rotation.y = -Math.PI / 2 + 0.55;
    jo.head.scale.set(2.0 + 0.3 * hit, 2.0 - 0.35 * hit, 2.0 + 0.3 * hit);
    jo.pose({ breathe: jb, leg: w.leg, armL: t > 5.25 ? [1.6, 0.9, 2.3] : w.armL, armR: t > 5.25 ? [1.6, 0.9, 2.3] : w.armR, head: [0, 0, t > 5.3 ? 0.12 * Math.sin(t * 7) : 0] });
    jo.face({ open: t > 5.25 ? 0.5 : blink(t), mouth: t > 5.25 ? 'o' : 'smile', brow: t > 5.25 ? -0.3 : 0.4, browTilt: t > 5.25 ? 0.3 : 0 });
    if (t > 5.35) { scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); dizzy.forEach((d, i) => { const a = t * 5 + i / 5 * Math.PI * 2; d.visible = true; d.position.set(v.x + Math.cos(a) * 0.9, v.y + 0.95, v.z + Math.sin(a) * 0.9); d.rotation.y = t * 4; }); }
    shake = 0.07 * Math.max(0, 1 - (t - 5.25) * 2.5) * (t > 5.25 ? 1 : 0);
    camPos = mix3([-4.0, 2.6, 8.8], [-4.4, 2.5, 8.0], sm(t / 6.6)); camLook = [-5.0, 1.85, 1.2];
    ov.day = seg(t, 0.4, 0.7);
  } else if (t < 12.6) { // ---- sabe tudo... e isso dá medo ----
    const fear = seg(t, 10.6, 11.1);
    jo.pose({ breathe: jb, armL: [lerp(0.3, 1.0, fear), lerp(0.2, -0.4, fear), lerp(0.4, 1.9, fear)], armR: [lerp(0.3, 1.0, fear), lerp(0.2, -0.4, fear), lerp(0.4, 1.9, fear)], head: [0, 0.1 * Math.sin(t * 2), 0] });
    jo.face({ open: blink(t) * (fear > 0.5 ? 1.25 : 1), mouth: fear > 0.5 ? 'sad' : 'smile', brow: fear > 0.5 ? 0.6 : 0.4, browTilt: -0.45 * fear, look: [Math.sin(t * 4) * (1 - fear), Math.cos(t * 3) * 0.4] });
    camPos = mix3([0.3, 2.9, 4.6], [0.3, 2.85, 3.9], sm((t - 6.6) / 6)); camLook = [0.3, 2.55, -0.4];
    ov.words = seg(t, 6.9, 8.6) * (1 - seg(t, 11.6, 12.4));
  } else if (t < 18.2) { // ---- dobra de novo, sem parar ----
    const steps = [13.1, 15.3, 16.8];
    const n = steps.filter(s => t >= s).length;
    const pulse = n ? bounce(lin(t, steps[n - 1], steps[n - 1] + 0.7)) : 0;
    jo.head.scale.setScalar(2.0 + 0.16 * n + 0.18 * pulse);
    jo.mats.skin.emissiveIntensity = 0.06 + 0.08 * n;
    jo.pose({ breathe: jb, armL: [1.7, 1.0, 2.4], armR: [1.7, 1.0, 2.4], head: [0, 0, 0.06 * Math.sin(t * 9) * n] });
    jo.face({ open: 1.35, mouth: 'o', brow: 1.0, browTilt: -0.3, look: [0, 0.5] });
    shake = 0.01 * n + 0.04 * pulse;
    camPos = mix3([0.3, 3.0, 5.2], [0.3, 3.1, 5.6], sm((t - 12.6) / 5.6)); camLook = [0.3, 2.6, -0.4];
    ov.qi = [204800, 409600, 819200, 1638400][n]; ov.warn = n >= 2 ? 1 : 0;
  } else if (t < 23.9) { // ---- constrói o botão de pausa ----
    J.position.set(1.95, 0.86, -0.85); J.rotation.y = facing([1.95, 0, -0.85], [3.15, 0, -1.85]);
    const cond = t > 18.9 && t < 21.6 ? Math.sin(t * 8) : 0;
    jo.pose({ breathe: jb, armR: [1.3 + 0.3 * cond, 0.4, 0.3], armL: [1.3 - 0.3 * cond, 0.4, 0.3] });
    jo.face({ open: blink(t), mouth: t > 22.2 ? 'smile' : 'flat', brow: 0.4, look: [0, -0.3] });
    bParts.forEach((b, i) => { const k = sm(lin(t, 19.0 + i * 0.6, 19.8 + i * 0.6)); const s = BSTART[i]; b.m.position.set(lerp(s[0], b.p[0], k), lerp(s[1], b.p[1], k) + Math.sin(k * Math.PI) * 0.6, lerp(s[2], b.p[2], k)); b.m.rotation.set((1 - k) * 6, (1 - k) * 5, 0); });
    if (t > 22.2) { scene.updateMatrixWorld(true); bParts[1].m.getWorldPosition(v); sparks.forEach((s, i) => { const k = lin(t, 22.2, 23.0); if (k <= 0 || k >= 1) return; const a = i / 14 * Math.PI * 2; s.visible = true; s.position.set(v.x + Math.cos(a) * k * 0.7, v.y + 0.2 + k * 0.5, v.z + Math.sin(a) * k * 0.7); s.scale.setScalar(1.6 * (1 - k)); }); }
    camPos = mix3([3.6, 2.5, -3.8], [3.5, 2.45, -3.6], sm((t - 18.2) / 5.7)); camLook = [2.2, 1.75, -0.9];
    ov.pause = seg(t, 22.3, 22.6);
  } else if (t < 26.9) { // ---- 3, 2, 1 ----
    J.position.set(1.95, 0.86, -0.85); J.rotation.y = facing([1.95, 0, -0.85], [3.15, 0, -1.85]);
    jo.pose({ breathe: jb, armR: [1.25, -0.1, 0.5 + 0.03 * Math.sin(t * 30)], armL: [0.3, 0.2, 0.4], lean: 0.15 });
    jo.face({ open: 1.1, mouth: 'flat', brow: -0.2, browTilt: 0.35, look: [0, -0.6] });
    const which = t < 25.15 ? 0 : t < 26.15 ? 1 : 2;
    if (which === 1) { camPos = [3.7, 2.3, -2.3]; camLook = [1.95, 2.2, -0.85]; }
    else { camPos = [3.55, 1.75, -0.95]; camLook = [3.05, 1.2, -1.75]; }
    ov.count = ['3', '2', '1'][which]; ov.countK = bounce(lin(t, [24.18, 25.15, 26.15][which], [24.18, 25.15, 26.15][which] + 0.5));
  } else if (t < 32.7) { // ---- o celular acende sozinho ----
    const on = t > 29.1;
    phoneLight.position.set(-3.2, 1.35, -2.2); phoneLight.intensity = on ? 3 : 0;
    J.position.set(1.95, 0.86, -0.85);
    const turn = seg(t, 29.4, 30.1);
    J.rotation.y = lerp(facing([1.95, 0, -0.85], [3.15, 0, -1.85]), facing([1.95, 0, -0.85], [-3.2, 0, -2.2]), turn);
    jo.pose({ breathe: jb, armR: [lerp(1.25, 0.3, turn), lerp(-0.1, 0.2, turn), lerp(0.5, 0.3, turn)], armL: [0.3, 0.2, 0.4] });
    jo.face({ open: on ? 1.3 : 1.0, mouth: on ? 'o' : 'flat', brow: on ? 1.0 : -0.2, look: [0, 0] });
    if (t < 30.7) { camPos = mix3([-2.75, 1.6, -1.5], [-2.85, 1.5, -1.7], sm((t - 26.9) / 3.8)); camLook = [-3.2, 1.03, -2.2]; }
    else { camPos = mix3([4.2, 3.0, 2.6], [4.0, 2.9, 2.2], sm((t - 30.7) / 2)); camLook = [-0.5, 1.7, -1.6]; }
  } else if (t < 37.5) { // ---- os olhos do robô abrem ----
    setDay(0.55);
    phoneLight.position.set(-3.2, 1.35, -2.2); phoneLight.intensity = 3;
    J.position.set(9, 0.86, 9);
    const open = seg(t, 36.3, 36.6), up = seg(t, 36.6, 37.3);
    eyeMat.emissiveIntensity = 3.5 * open; antMat.emissiveIntensity = 2 * open + Math.abs(Math.sin(t * 5)) * 0.8;
    rhead.rotation.set(lerp(0.25, 0, up), lerp(-0.7, 0, up), lerp(0.3, 0, up)); rarms[0].rotation.set(lerp(-0.6, 0, up), 0, 0);
    leds.forEach((l, i) => l.material.emissiveIntensity = open * Math.max(0, Math.sin(t * 8 + i)) * 2);
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.7); eyeLight.intensity = 5 * open;
    camPos = mix3([1.0, 2.0, 2.4], [1.0, 2.05, 0.9], sm((t - 32.7) / 4.8)); camLook = [1.0, 1.95, -1.6];
  } else { // ---- "Eu não preciso mais de wi-fi." + fim ----
    setDay(0.4);
    robot.rotation.set(0, 0, 0); rhead.rotation.set(0, 0, 0.06 * Math.sin(t * 2)); rarms[0].rotation.set(0, 0, 0);
    const a = t > 37.62 && t < 39.46 ? amp : 0;
    eyeMat.emissiveIntensity = 3.5; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 6)) * 1.5;
    mouthMat.emissiveIntensity = 0.5 + 3 * a; rmouth.scale.set(0.3 + 0.9 * a, 1 + 1.5 * a, 1);
    leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 8 + i)) * 2);
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.7); eyeLight.intensity = 5;
    J.position.set(9, 0, 9);
    camPos = mix3([1.0, 2.05, 1.05], [1.0, 2.0, 0.85], sm((t - 37.5) / 7)); camLook = [1.0, 1.95, -1.6];
    shake = 0.006;
    ov.end = seg(t, 40.4, 40.8);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  // ---------- overlays ----------
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('day', ov.day && t < 6.4 ? ov.day : 0);
  const qi = $('qi'); qi.style.opacity = ov.qi ? 1 : 0; if (ov.qi) qi.textContent = 'QI ' + ov.qi.toLocaleString('pt-BR');
  pop('warn', ov.warn || 0); pop('pause', ov.pause || 0); pop('end', ov.end || 0);
  const ce = $('count'); ce.style.opacity = ov.count ? 1 : 0; if (ov.count) { ce.textContent = ov.count; ce.style.transform = `translateX(-50%) scale(${1 + 0.3 * (ov.countK || 0)})`; }
  wEls.forEach((e, i) => { const k = (ov.words || 0) * clamp(((ov.words || 0) * 14 - i) / 1.5); e.style.opacity = k; const a2 = i * 0.523 + t * 0.3; e.style.left = (540 + Math.cos(a2) * 400) + 'px'; e.style.top = (720 + Math.sin(a2 * 1.2) * 330) + 'px'; });
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0; cp.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
