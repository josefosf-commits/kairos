// SHORT "E se o seu QI dobrasse? — ep. 2: o robô" — série E se? (3D, vertical, ~1:26)
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, place, cam, ampAt, thumbLights
} from '../../_lib/mundo3d.js';

const jo = makeChar();
const J = jo.root;
const glasses = grp(jo.head);
{ const gl = M('#1b1b1b', { roughness: 0.3 }); for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), gl, glasses, [s * 0.15, 0.06, 0.42]); mesh(cap(0.012, 0.08), gl, glasses, [0, 0.07, 0.44], [0, 0, Math.PI / 2]); }

// ---------- robô ----------
const robot = grp(scene, [1.4, 0, -1.3]);
const steel = M('#9aa5b1', { metalness: 0.5, roughness: 0.35 }), steelD = M('#5c6b7a', { metalness: 0.5, roughness: 0.4 });
const eyeMat = new THREE.MeshStandardMaterial({ color: '#222', emissive: '#00e5ff', emissiveIntensity: 0 });
for (const x of [-0.22, 0.22]) mesh(rbox(0.28, 0.7, 0.3, 0.05), steelD, robot, [x, 0.35, 0]);
const rbody = mesh(rbox(0.85, 0.9, 0.6, 0.1), steel, robot, [0, 1.15, 0]);
const rarms = [-1, 1].map(s => { const g = grp(robot, [s * 0.52, 1.45, 0]); mesh(cap(0.09, 0.5), steelD, g, [s * 0.04, -0.3, 0]); mesh(sph(0.12, 12, 10), steel, g, [s * 0.04, -0.62, 0]); return g; });
const rhead = grp(robot, [0, 1.88, 0]);
mesh(rbox(0.62, 0.48, 0.5, 0.1), steel, rhead);
[-1, 1].forEach(s => mesh(sph(0.07, 16, 12), eyeMat, rhead, [s * 0.14, 0.06, 0.26]));
mesh(cap(0.02, 0.2), steelD, rhead, [0, 0.36, 0]);
const antMat = new THREE.MeshStandardMaterial({ color: '#ff4d6d', emissive: '#ff4d6d', emissiveIntensity: 0.3 });
mesh(sph(0.05, 12, 10), antMat, rhead, [0, 0.5, 0]);
mesh(rbox(0.3, 0.07, 0.02, 0.02), M('#111'), rhead, [0, -0.11, 0.255]);
const mouthMat = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#00e5ff', emissiveIntensity: 0 });
const rmouth = mesh(new THREE.BoxGeometry(0.26, 0.04, 0.01), mouthMat, rhead, [0, -0.11, 0.268]);
mesh(rbox(0.4, 0.25, 0.04, 0.03), M('#1d3557'), rbody, [0, 0.1, 0.31]);
const leds = [0, 1, 2].map(i => mesh(sph(0.035, 10, 8), new THREE.MeshStandardMaterial({ color: '#111', emissive: ['#52d273', '#ffd60a', '#ff4d6d'][i], emissiveIntensity: 0 }), rbody, [-0.1 + i * 0.1, 0.1, 0.34]));
const eyeLight = new THREE.PointLight('#00e5ff', 0, 4, 2); scene.add(eyeLight);
const antLight = new THREE.PointLight('#ff2d55', 0, 5, 2); scene.add(antLight);
// prato, celular, cesto, roupas, roteador
const plate = grp(scene);
mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.04, 24), M('#ffffff'), plate);
mesh(rbox(0.22, 0.05, 0.16, 0.03), M('#e9a65b'), plate, [-0.04, 0.05, 0]);
mesh(sph(0.06, 12, 10), M('#ffd60a'), plate, [-0.04, 0.09, 0], [0, 0, 0], [1, 0.4, 1]);
mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.16, 16), M('#ff9f1c', { transparent: true, opacity: 0.9 }), plate, [0.12, 0.1, 0.02]);
const rphone = grp(scene); mesh(rbox(0.12, 0.22, 0.02, 0.02), M('#20232b'), rphone);
const rscreen = mesh(new THREE.PlaneGeometry(0.1, 0.19), new THREE.MeshBasicMaterial({ color: '#7fdcff' }), rphone, [0, 0, 0.012]);
const basket = grp(scene, [-1.3, 0, 0.7]);
mesh(new THREE.CylinderGeometry(0.4, 0.32, 0.6, 24, 1, true), M('#c68b59', { side: THREE.DoubleSide }), basket, [0, 0.3, 0]);
const CL = [[0.9, 0.9, '#e63946'], [-0.6, 0.9, '#457b9d'], [1.8, -0.6, '#f4a261'], [-1.9, -0.2, '#2a9d8f'], [0.2, 1.6, '#8d5fd3'], [2.2, 0.9, '#ffffff']];
const clothes = CL.map(([x, z, c], i) => ({ m: mesh(rbox(0.6, 0.05, 0.45, 0.02), M(c, { roughness: 0.95 }), scene, [x, 0.03, z], [0, i * 0.9, 0]), x, z, i }));
const router = grp(quarto.desk, [-0.55, 1.05, -0.2]);
mesh(rbox(0.42, 0.09, 0.28, 0.03), M('#f1f1f1'), router, [0, 0.05, 0]);
for (const x of [-0.15, 0.15]) mesh(cap(0.015, 0.22), M('#f1f1f1'), router, [x, 0.22, -0.1]);
const rled = [0, 1, 2].map(i => mesh(sph(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: '#52d273' }), router, [-0.08 + i * 0.08, 0.06, 0.141]));
const beam = mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 10), new THREE.MeshBasicMaterial({ color: '#00e5ff', transparent: true, opacity: 0.8 }), scene); beam.castShadow = false;
const beamGlow = mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 10), new THREE.MeshBasicMaterial({ color: '#00e5ff', transparent: true, opacity: 0.25 }), scene); beamGlow.castShadow = false;
const sparks = []; for (let i = 0; i < 20; i++) sparks.push(mesh(sph(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: ['#ffd54a', '#ffffff', '#ff4d6d'][i % 3] }), scene));

// ---------- tempos / legendas ----------
let TL = null, caps = null;
function buildCaps() {
  caps = [];
  for (const l of TL.lines) {
    const ps = l.text.match(/[^.?!:]+[.?!:]+|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean);
    const merged = [];
    for (const p of ps) { if (merged.length && (merged[merged.length - 1].length + p.length < 30)) merged[merged.length - 1] += ' ' + p; else merged.push(p); }
    const tot = merged.reduce((a, s) => a + s.length, 0);
    let t0 = l.start;
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s, robot: l.id === 6 }); t0 += d; }
  }
}
const $ = id => document.getElementById(id);
const v = new THREE.Vector3(), v2 = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
const facing = (a, b) => Math.atan2(b[0] - a[0], b[2] - a[2]);
function burst(t, t0, p, n = 20) {
  const k = lin(t, t0, t0 + 0.8); if (k <= 0 || k >= 1) return;
  sparks.forEach((s, i) => { if (i >= n) return; const a = i / n * Math.PI * 2; s.visible = true; s.position.set(p[0] + Math.cos(a) * 1.0 * k, p[1] + Math.sin(a * 2) * 0.6 * k + 0.4 * k, p[2] + Math.sin(a) * 1.0 * k); s.scale.setScalar(2 * (1 - k)); });
}
function setBeam(a, b, op) {
  const dir = v2.copy(b).sub(a), len = dir.length();
  [beam, beamGlow].forEach((m, i) => { m.visible = op > 0.01; m.position.copy(a).addScaledVector(dir, 0.5); m.quaternion.setFromUnitVectors(UP, dir.clone().normalize()); m.scale.set(1, len, 1); m.material.opacity = op * (i ? 0.3 : 0.85); });
}
const fmt = n => Math.round(n).toLocaleString('pt-BR');

const KN = [[55.2, 43.9], [62.86, 51.7], [72.62, 61.62], [76.36, 65.36], [80.69, 69.69], [86.0, 74.2], [91.52, 79.72], [97.96, 86.24]];
function mapOld(T) { for (let i = 0; i < KN.length - 1; i++) if (T < KN[i + 1][0]) return lerp(KN[i][1], KN[i + 1][1], (T - KN[i][0]) / (KN[i + 1][0] - KN[i][0])); return KN[KN.length - 1][1] + (T - KN[KN.length - 1][0]); }
window.render = function (T) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const t = T >= 55.2 ? mapOld(T) : T;
  const amp = ampAt(TL, T);
  setDay(1); camera.fov = 52;
  J.position.set(0.3, 0.86, -0.4); J.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  jo.head.scale.setScalar(T > 55 ? 1.62 : 1.42); glasses.visible = true;
  jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0;
  robot.position.set(1.4, 0, -1.3); robot.rotation.set(0, -0.4, 0); robot.scale.setScalar(T > 46 ? 1.15 : 1); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#00e5ff'); eyeMat.emissiveIntensity = 2.2; mouthMat.emissiveIntensity = 0; rmouth.scale.set(1, 1, 1);
  antMat.emissiveIntensity = 0.3; leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 5 + i)) * 1.5);
  eyeLight.intensity = 0; antLight.intensity = 0;
  plate.visible = false; rphone.visible = false; beam.visible = beamGlow.visible = false; sparks.forEach(s => s.visible = false);
  rled.forEach(l => l.material.color.set('#52d273'));
  clothes.forEach(c => { c.m.visible = t < 12.0 || (t < 17.0); c.m.position.set(c.x, 0.03, c.z); c.m.rotation.set(0, c.i * 0.9, 0); });
  if (t < 0) { // ---- capa: Joseph x robô, cara a cara ----
    thumbLights([0.3, 2.6, 2.2]); scene.background.set('#0b0820');
    clothes.forEach(c => c.m.visible = false);
    J.position.set(-0.45, 0.86, -0.4); J.rotation.y = 0.55;
    jo.pose({ armL: [1.0, 0.5, 1.6], armR: [1.0, 0.5, 1.6], lean: -0.05 });
    jo.face({ open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.45, look: [0.8, 0.1] });
    jo.mats.skin.emissiveIntensity = 0.12;
    robot.position.set(1.05, 0, -0.6); robot.rotation.set(0, -0.6, 0); rhead.rotation.set(0.05, 0, -0.08);
    eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 4; antMat.emissiveIntensity = 3;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.color.set('#ff2d55'); eyeLight.position.set(v.x - 0.4, v.y, v.z + 0.8); eyeLight.intensity = 8;
    camera.fov = 50; camera.updateProjectionMatrix(); cam([0.3, 2.1, 3.9], [0.3, 2.3, -0.5], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0, cleaned = t > 16.0 ? 1 : 0;

  // ===== 0: recap =====
  if (t < 7.9) {
    setDay(0.15);
    const wake = seg(t, 5.7, 6.2);
    eyeMat.emissiveIntensity = 3 * wake * (0.85 + 0.15 * Math.sin(t * 7)); antMat.emissiveIntensity = 0.3 + 1.5 * wake;
    jo.pose({ breathe: jb, armR: [1.45, -0.95, 2.25], armL: [0.25, 0.55, 1.2], head: [-0.1, 0.25 * wake, 0.1] });
    jo.face({ open: lerp(blink(t), 1.35, wake), mouth: wake > 0.5 ? 'o' : 'flat', brow: 0.4 + 0.8 * wake, look: [lerp(0.5, 0.9, wake), 0.4] });
    jo.mats.skin.emissiveIntensity = 0.12;
    rhead.rotation.y = -0.6 * seg(t, 6.2, 6.8);
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.6); eyeLight.intensity = 5 * wake;
    camPos = mix3([0.8, 2.2, 4.4], [0.8, 2.1, 3.6], sm(t / 7.9)); camLook = [0.85, 1.75, -0.8];
    ov.title = t < 4.2 ? 1 : 0;
  }
  // ===== 1: dia 6, robô arruma o quarto =====
  else if (t < 17.0) {
    const sleep = t < 14.6;
    if (sleep) { jo.legs.forEach(l => l.visible = false); J.position.set(-3.2, 1.0, -2.55); J.rotation.set(-Math.PI / 2 + 0.15, 0, 0); jo.pose({ breathe: jb * 2 }); jo.face({ open: 0.08, mouth: 'smile' }); }
    else { const up = seg(t, 14.6, 15.2); jo.legs.forEach(l => l.visible = false); J.position.set(-3.2, 1.0, lerp(-2.55, -2.95, up)); J.rotation.set(lerp(-Math.PI / 2 + 0.15, -0.05, up), 0, 0); jo.pose({ breathe: jb, armL: [0.3, 0.6, 0.6], armR: [0.3, 0.6, 0.6] }); jo.face({ open: 1.35, mouth: 'o', brow: 1.2, look: [0.6, -0.2] }); }
    const k = lin(t, 12.0, 15.6);
    const path = a => [Math.sin(a * 2.1) * 1.6 - 0.2, 0, -0.4 + Math.cos(a * 1.4) * 1.0];
    if (k > 0 && k < 1) { const p = path(k * 9); robot.position.set(p[0], Math.abs(Math.sin(t * 20)) * 0.06, p[2]); const p2 = path(k * 9 + 0.05); robot.rotation.set(0.25, facing(p, p2), 0); rarms.forEach((a, i) => a.rotation.set(Math.sin(t * 25 + i * 3) * 1.2, 0, 0)); }
    else if (k >= 1) { robot.position.set(-0.8, 0, 0.0); robot.rotation.set(0, 0.3, 0); rarms[1].rotation.set(0, 0, 2.4 + 0.2 * Math.sin(t * 8)); }
    else { robot.position.set(0.6, 0, -1.4); robot.rotation.set(0, -0.2, 0); }
    clothes.forEach(c => { const kk = lin(t, 12.3 + c.i * 0.5, 13.0 + c.i * 0.5); if (kk >= 1) { c.m.visible = false; return; } if (kk > 0) { c.m.position.set(lerp(c.x, -1.3, kk), 0.03 + Math.sin(kk * Math.PI) * 1.4 + kk * 0.5, lerp(c.z, 0.7, kk)); c.m.rotation.set(kk * 6, kk * 9, 0); } });
    if (t > 12.0) burst(t, 15.6, [-0.8, 2.0, 0.0], 10);
    camPos = t < 12.0 ? mix3([-1.6, 2.6, 0.8], [-1.8, 2.5, 0.4], sm((t - 7.9) / 4.1)) : [-0.3, 5.0, 5.2];
    camLook = t < 12.0 ? [-3.2, 1.3, -2.6] : [-0.7, 0.9, -0.7];
    ov.check = seg(t, 15.7, 16.0);
  }
  // ===== 2: café da manhã =====
  else if (t < 23.4) {
    const RP = [1.15, 0, -0.1];
    robot.position.set(...RP); robot.rotation.set(0, facing(RP, [0.3, 0, -0.4]) + 0.3, 0);
    const give = seg(t, 18.6, 19.6);
    rarms[0].rotation.set(-1.4 * give - 0.2, 0, 0); rarms[1].rotation.set(-1.4 * give - 0.2, 0, 0);
    plate.visible = true;
    scene.updateMatrixWorld(true);
    const ra = new THREE.Vector3(), rb = new THREE.Vector3(); rarms[0].children[1].getWorldPosition(ra); rarms[1].children[1].getWorldPosition(rb);
    if (t < 20.2) { plate.position.copy(ra).add(rb).multiplyScalar(0.5); plate.position.y += 0.1; }
    const take = seg(t, 20.0, 20.4);
    jo.pose({ breathe: jb, armL: [lerp(0.2, 1.1, take), lerp(0.1, -0.3, take), lerp(0.3, 0.7, take)], armR: [lerp(0.2, 1.1, take), lerp(0.1, -0.3, take), lerp(0.3, 0.7, take)], head: [0.15, 0, 0] });
    if (t >= 20.2) { scene.updateMatrixWorld(true); jo.handL.getWorldPosition(ra); jo.handR.getWorldPosition(rb); plate.position.copy(ra).add(rb).multiplyScalar(0.5); plate.position.y += 0.1; }
    const think = seg(t, 21.2, 21.5);
    jo.face({ open: think > 0.5 ? 1.35 : blink(t), mouth: think > 0.5 ? 'o' : 'smile', brow: 0.3 + 0.9 * think, look: think > 0.5 ? [0.5, 0.7] : [0.4, -0.5] });
    ov.bub = think; scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); ov.bubp = [v.x - 0.2, v.y + 0.95, v.z];
    camPos = mix3([0.7, 2.1, 3.3], [0.7, 2.05, 2.8], sm((t - 17) / 6.4)); camLook = [0.7, 1.75, -0.3];
  }
  // ===== 3: o QI do robô dobra junto =====
  else if (t < 29.6) {
    const RP = [1.4, 0, -0.6]; robot.position.set(...RP); robot.rotation.set(0, facing(RP, [-0.3, 0, -0.4]), 0);
    J.position.set(-0.4, 0.86, -0.4); J.rotation.y = facing([-0.4, 0, -0.4], RP);
    const real = seg(t, 25.3, 25.8);
    jo.pose({ breathe: jb, armL: [lerp(0.2, 1.7, real), lerp(0.1, 1.0, real), lerp(0.3, 2.4, real)], armR: [lerp(0.2, 1.7, real), lerp(0.1, 1.0, real), lerp(0.3, 2.4, real)] });
    jo.face({ open: lerp(blink(t), 1.4, real), mouth: real > 0.5 ? 'o' : 'flat', brow: 0.3 + real, look: [0.5, 0.2] });
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); v.y += 0.75; rhead.getWorldPosition(v2); const tip = v2.clone(); tip.y += 0.5;
    const bk = seg(t, 25.5, 26.0) * (0.75 + 0.25 * Math.sin(t * 14));
    setBeam(v.clone(), tip, bk);
    eyeMat.emissiveIntensity = 2.2 + 2 * bk; antMat.emissiveIntensity = 0.3 + 3 * bk;
    camPos = mix3([0.5, 2.4, 6.0], [0.5, 2.3, 5.4], sm((t - 23.4) / 6.2)); camLook = [0.5, 1.7, -0.5];
    ov.duo = seg(t, 25.6, 26.0); ov.dj = 6400 * (t > 27.6 ? 2 * 0 + 1 : 1); ov.dr = ov.dj;
    ov.x2 = seg(t, 27.6, 27.9);
  }
  // ===== 4: à tarde, o robô vira o Joseph =====
  else if (t < 36.6) {
    const RP = [2.4, 0, -1.1]; robot.position.set(...RP);
    J.position.set(-0.15, 0.86, 0.1); J.rotation.y = 0.9;
    const shock = seg(t, 34.9, 35.3);
    jo.pose({ breathe: jb, armL: [lerp(0.2, 1.7, shock), lerp(0.1, 1.0, shock), lerp(0.3, 2.4, shock)], armR: [lerp(0.2, 1.7, shock), lerp(0.1, 1.0, shock), lerp(0.3, 2.4, shock)] });
    jo.face({ open: blink(t) * (shock > 0.5 ? 1.4 : 1), mouth: shock > 0.5 ? 'o' : 'flat', brow: 0.4 + 0.8 * shock, look: [0.7, 0] });
    if (t < 32.6) { robot.rotation.set(0.15, Math.PI - 0.1, 0); rarms.forEach((a, i) => a.rotation.set(-1.0 + Math.sin(t * 40 + i) * 0.25, 0, 0)); rhead.rotation.x = 0.3; ov.home = seg(t, 30.2, 30.5); }
    else {
      robot.rotation.set(0, -0.7, 0); rphone.visible = true;
      const call = seg(t, 34.9, 35.4);
      rarms[1].rotation.set(lerp(-1.3, 0, call), 0, lerp(0, 2.7, call));
      scene.updateMatrixWorld(true); rarms[1].children[1].getWorldPosition(v); rphone.position.copy(v); rphone.position.y += 0.12; rphone.lookAt(camera.position);
      ov.msgs = t < 35.0 ? seg(t, 32.9, 33.2) : 0;
    }
    camPos = mix3([1.2, 2.5, 6.0], [1.2, 2.4, 5.5], sm((t - 29.6) / 7)); camLook = [1.2, 1.5, -0.6];
  }
  // ===== 5: "Oi, mãe. Aqui é o Joseph." =====
  else if (t < 40.2) {
    const RP = [0.6, 0, -0.6]; robot.position.set(...RP); robot.rotation.set(0, 0, 0);
    rphone.visible = true; rarms[1].rotation.set(0, 0, 2.7);
    scene.updateMatrixWorld(true); rarms[1].children[1].getWorldPosition(v); rphone.position.copy(v); rphone.position.y += 0.12; rphone.rotation.set(0, -1.2, 0);
    const a = t > 36.76 && t < 39.32 ? amp : 0;
    mouthMat.emissive.set('#ff2d55'); mouthMat.emissiveIntensity = 0.5 + 3 * a; rmouth.scale.set(0.3 + 0.9 * a, 1 + 1.5 * a, 1);
    eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 3.2; rhead.rotation.set(0, 0, 0.08 * Math.sin(t * 2));
    rhead.getWorldPosition(v); eyeLight.color.set('#ff2d55'); eyeLight.position.set(v.x, v.y, v.z + 0.7); eyeLight.intensity = 4;
    J.position.set(-2.6, 0.86, -2.6);
    camPos = mix3([0.6, 2.05, 1.9], [0.6, 2.0, 1.45], sm((t - 36.6) / 3.6)); camLook = [0.6, 1.9, -0.6];
    shake = 0.006;
  }
  // ===== 6: Joseph entende o plano =====
  else if (t < 43.9) {
    J.position.set(0.3, 0.86, -0.4);
    const det = seg(t, 41.6, 42.3);
    jo.pose({ breathe: jb, armL: [0.2, 0.1, 0.3], armR: [lerp(0.2, 1.3, det), lerp(0.1, -0.6, det), lerp(0.3, 2.2, det)], head: [-0.05, 0, 0] });
    jo.face({ open: lerp(1.3, 0.8, det) * blink(t), mouth: det > 0.5 ? 'flat' : 'o', brow: lerp(1.1, -0.4, det), browTilt: 0.45 * det, look: [0, 0] });
    eyeLight.color.set('#ff2d55'); eyeLight.position.set(1.2, 2.2, 0.6); eyeLight.intensity = 6;
    robot.position.set(9, 0, 9);
    camPos = mix3([0.3, 2.25, 2.4], [0.3, 2.2, 1.7], sm((t - 40.2) / 3.7)); camLook = [0.3, 2.1, -0.4];
  }
  // ===== montagem: dias 7, 8 e 9 =====
  else if (T < 55.2) {
    const D = [[43.96, 7, 12800], [47.66, 8, 25600], [49.96, 9, 51200]];
    const d = D.filter(x => T >= x[0]).pop() || D[0];
    const di = D.indexOf(d);
    setDay(0.5 + 0.5 * Math.cos((T - 43.9) * 2.6));
    const RP = [1.15, 0, -0.7]; robot.position.set(...RP); robot.rotation.set(0, -0.55, 0);
    robot.scale.setScalar(1 + 0.05 * (di + 1) + 0.04 * bounce(lin(T, d[0] + 0.8, d[0] + 1.4)));
    J.position.set(-0.45, 0.86, -0.4); J.rotation.y = 0.55;
    jo.head.scale.setScalar(1.45 + 0.06 * (di + 1) + 0.05 * bounce(lin(T, d[0] + 0.8, d[0] + 1.4)));
    jo.mats.skin.emissiveIntensity = 0.05 + 0.05 * di;
    jo.pose({ breathe: jb, armL: [0.3, 0.2, 0.4], armR: [0.3, 0.2, 0.4], head: [0, 0, 0] });
    jo.face({ open: blink(T), mouth: 'flat', brow: 0.3, browTilt: 0.2, look: [0.7, 0.3] });
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); v.y += 0.85; rhead.getWorldPosition(v2); const tip = v2.clone(); tip.y += 0.55;
    const bk = 0.5 + 0.5 * Math.abs(Math.sin(T * 5)) + (T > 52.5 ? 0.6 : 0);
    setBeam(v.clone(), tip, Math.min(1, bk)); antMat.emissiveIntensity = 1 + 2 * bk; eyeMat.emissiveIntensity = 2.5;
    camPos = mix3([0.35, 2.6, 5.6], [0.35, 2.45, 4.6], sm((T - 43.9) / 11.3)); camLook = [0.35, 1.85, -0.5];
    ov.mont = d; ov.duo = 1; ov.duoN = d[2] * (T > d[0] + 0.7 ? 1 : 0.5);
  }
  // ===== 7/8: meia-noite, a corrida =====
  else if (t < 61.4) {
    setDay(0);
    const RP = [1.0, 0, -1.6]; robot.position.set(...RP); robot.rotation.set(0, -0.3, 0);
    eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 3.2; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 6)) * 2;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.color.set('#ff2d55'); eyeLight.position.set(v.x, v.y, v.z + 0.6); eyeLight.intensity = 4;
    rhead.rotation.y = lerp(0, -0.7, seg(t, 48.9, 49.6));
    jo.mats.skin.emissiveIntensity = 0.1;
    const sneak = lin(t, 57.0, 60.6), A0 = [-0.6, 0.86, 0.3], A1 = [2.45, 0.86, -1.3];
    const wp = walkPose(sneak * 7, sneak > 0 && sneak < 1 ? 1 : 0);
    J.position.set(lerp(A0[0], A1[0], sm(sneak)), 0.78 + wp.bob, lerp(A0[2], A1[2], sm(sneak)));
    J.rotation.y = sneak > 0 ? facing(A0, A1) : 0.5;
    jo.pose({ breathe: jb, lean: sneak > 0 ? 0.3 : 0, leg: [0.25 + wp.leg[0], 0.25 + wp.leg[1]], armL: sneak > 0 ? [0.6 + wp.armL[0] * 0.5, 0.3, 1.2] : [0.2, 0.1, 0.3], armR: sneak > 0 ? [0.6 + wp.armR[0] * 0.5, 0.3, 1.2] : [0.2, 0.1, 0.3] });
    jo.face({ open: blink(t), mouth: 'flat', brow: -0.3, browTilt: 0.4, look: sneak > 0 ? [0.7, 0] : [0.6, 0.2] });
    ov.clock = t < 47.0 ? seg(t, 44.3, 44.6) : 0;
    ov.race = seg(t, 45.0, 45.5);
    const rr = t < 53.8 ? lerp(51200, 90000, sm(lin(t, 45.5, 53.8))) : t < 55.0 ? lerp(90000, 95000, sm(lin(t, 53.8, 55.0))) : lerp(95000, 99000, sm(lin(t, 55.0, 60.5)));
    const jj = lerp(51200, 81000, sm(lin(t, 45.5, 60.5)));
    ov.rr = rr; ov.jj = jj;
    if (t < 56.9) { camPos = mix3([-0.2, 2.4, 4.6], [-0.2, 2.3, 4.0], sm((t - 43.9) / 13)); camLook = [0.2, 1.6, -0.6]; }
    else { camPos = mix3([3.9, 2.7, 4.2], [3.6, 2.6, 3.7], sm((t - 56.9) / 4.5)); camLook = [1.1, 1.1, -0.7]; }
    ov.forever = seg(t, 48.9, 49.3) * (t < 51.6 ? 1 : 0);
  }
  // ===== 9/10: desliga o wi-fi, robô congela, Joseph passa de 10 mil =====
  else if (t < 73.6) {
    setDay(0);
    const RP = [1.0, 0, -1.6]; robot.position.set(...RP); robot.rotation.set(0, -0.3, 0);
    const off = t > 62.75;
    rled.forEach(l => l.material.color.set(off ? '#222' : '#52d273'));
    const fl = off ? (t < 63.6 ? (Math.sin(t * 60) > 0 ? 1 : 0) : 0) : 1;
    eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 3.2 * fl; antMat.emissiveIntensity = off ? 0 : 2;
    leds.forEach(l => l.material.emissiveIntensity = off ? 0 : l.material.emissiveIntensity);
    rhead.rotation.set(off ? 0.25 : 0, -0.7, off ? 0.3 : 0);
    rarms[0].rotation.set(off ? -0.6 : 0, 0, 0);
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.color.set('#ff2d55'); eyeLight.position.set(v.x, v.y, v.z + 0.6); eyeLight.intensity = 4 * fl;
    const A1 = [2.45, 0.86, -1.3];
    const win = seg(t, 69.65, 70.2);
    if (t < 65.2) {
      J.position.set(...A1); J.rotation.y = facing(A1, [3.0, 0, -2.0]);
      const press = seg(t, 62.3, 62.7) * (1 - seg(t, 63.4, 63.8));
      jo.pose({ breathe: jb, lean: 0.3 * press, armR: [lerp(0.3, 1.3, press), 0, lerp(0.3, 0.6, press)], armL: [0.3, 0.1, 0.3] });
      jo.face({ open: blink(t), mouth: off ? 'smile' : 'flat', brow: -0.2, look: [0, -0.5] });
      camPos = t < 62.9 ? [4.7, 2.1, -0.2] : mix3([0.2, 2.2, 3.2], [0.2, 2.15, 2.8], sm((t - 62.9) / 2.3));
      camLook = t < 62.9 ? [2.55, 1.2, -1.75] : [0.8, 1.7, -1.2];
    } else {
      const JP = [-0.3, 0.86, -0.1];
      const jump = Math.max(0, Math.sin(lin(t, 69.4, 70.2) * Math.PI)) * 0.6;
      J.position.set(JP[0], JP[1] + jump, JP[2]); J.rotation.y = 0.2;
      jo.pose({ breathe: jb, armL: [lerp(0.2, 2.8, win), lerp(0.1, 0.5, win), 0.1], armR: [lerp(0.2, 2.8, win), lerp(0.1, 0.5, win), 0.1] });
      jo.face({ open: blink(t), mouth: win > 0.5 ? 'o' : 'smile', brow: 0.6 + 0.6 * win, look: [0, 0.3] });
      jo.mats.skin.emissiveIntensity = 0.1 + 0.3 * win;
      burst(t, 69.75, [JP[0], 2.8, JP[2]]);
      camPos = mix3([0.3, 2.3, 4.2], [0.3, 2.2, 3.6], sm((t - 65.2) / 8.4)); camLook = [0.3, 1.8, -0.6];
      shake = 0.03 * Math.max(0, 1 - Math.abs(t - 69.6) * 3);
    }
    ov.race = 1; ov.rr = t < 62.8 ? 99000 + 999 * seg(t, 61.4, 62.7) : 99999; ov.frozen = off;
    ov.jj = lerp(81000, 102400, sm(lin(t, 66.5, 69.6)));
    ov.big = seg(t, 69.6, 70.0) * (1 - seg(t, 73.2, 73.6));
  }
  // ===== 11/12: escuro, a antena pisca =====
  else {
    setDay(0); scene.background.set('#05060c');
    const RP = [1.0, 0, -1.6]; robot.position.set(...RP); robot.rotation.set(0, -0.3, 0);
    rhead.rotation.set(0.25, -0.7, 0.3); rarms[0].rotation.set(-0.6, 0, 0);
    eyeMat.emissiveIntensity = 0; leds.forEach(l => l.material.emissiveIntensity = 0); rled.forEach(l => l.material.color.set('#222'));
    J.position.set(-3.2, 1.0, -2.55); J.rotation.set(-Math.PI / 2 + 0.15, 0, 0); jo.legs.forEach(l => l.visible = false); jo.pose({ breathe: jb * 2 }); jo.face({ open: 0.08, mouth: 'smile' });
    const blinkK = Math.max(0, 1 - Math.abs(t - 77.95) * 5);
    const later = t > 81.5 ? 0.35 + 0.35 * Math.sin(t * 3) : 0;
    antMat.emissiveIntensity = 6 * blinkK + later;
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); antLight.position.set(v.x, v.y + 0.6, v.z + 0.3); antLight.intensity = 10 * blinkK + later * 2;
    if (t > 78.2) { eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = t > 80.0 ? 0.6 + 0.4 * Math.sin(t * 2) : 0; }
    camPos = mix3([1.2, 2.3, 1.8], [1.05, 2.25, 0.4], sm((t - 73.6) / 5)); camLook = [0.85, 2.2, -1.6];
    if (t > 79.3) { camPos = mix3([1.05, 2.25, 0.4], [1.0, 2.2, 0.1], sm((t - 79.3) / 7)); }
    ov.end = seg(t, 79.8, 80.2);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  // ---------- overlays ----------
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  $('title').style.opacity = ov.title ? 1 : 0;
  const dayK = t >= 8.4 && t < 11.4 ? lin(t, 8.4, 8.75) : 0; pop('day', dayK);
  pop('check', ov.check || 0); pop('home', ov.home || 0);
  pop('clock', ov.clock || 0); pop('forever', ov.forever || 0); pop('big', ov.big || 0); pop('end', ov.end || 0);
  const bub = $('bub'); bub.style.opacity = ov.bub ? 1 : 0; bub.style.transform = `translateX(-50%) scale(${0.5 + 0.5 * back(ov.bub || 0)})`;
  // duelo de QI
  const duo = $('duo'); duo.style.opacity = ov.duo || 0;
  if (ov.duo) { $('dj').textContent = ov.duoN ? fmt(ov.duoN) : fmt(t > 27.7 ? 6400 * (1 + seg(t, 27.6, 28.1)) : 6400); $('dr').textContent = $('dj').textContent; }
  const de = $('day'); if (ov.mont) { de.innerHTML = 'DIA ' + ov.mont[1]; de.style.top = '560px'; } else { de.innerHTML = 'DIA 6<br><span style="color:#ffd54a;font-size:170px">QI 6.400</span>'; de.style.top = '160px'; }
  if (ov.mont) pop('day', lin(T, ov.mont[0], ov.mont[0] + 0.3));
  const race = $('race'); race.style.opacity = ov.race || 0;
  if (ov.race) {
    $('rjn').textContent = fmt(ov.jj); $('rrn').textContent = fmt(ov.rr);
    $('rjb').style.width = clamp(ov.jj / 130000) * 100 + '%'; $('rrb').style.width = clamp(ov.rr / 130000) * 100 + '%';
    $('rrb').style.background = ov.frozen ? '#7fb8ff' : '#ff2d55'; $('rrl').textContent = ov.frozen ? 'ROBÔ (CONGELOU)' : 'ROBÔ';
  }
  const msgs = $('msgs'); msgs.style.opacity = ov.msgs || 0;
  [...msgs.children].forEach((c, i) => { const k = clamp(((t - 32.9) * 4 - i)); c.style.opacity = k; c.style.transform = `translateY(${(1 - k) * 40}px)`; });
  const c = caps.find(c => T >= c.a - 0.05 && T < c.b + 0.25);
  const ce = $('cap'); ce.textContent = c ? c.s : ''; ce.style.opacity = c ? 1 : 0; ce.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
