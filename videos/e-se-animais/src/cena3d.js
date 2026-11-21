// "E se você ganhasse as habilidades de um animal diferente a cada dia?" — série E se? (3D)
import {
  THREE, scene, camera, renderer, quarto, setDay, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, place, cam, ampAt, thumbLights
} from '../../_lib/mundo3d.js';

const jo = makeChar();
const J = jo.root;

// ---------- cenário extra: armário, biscoito, letrinha no quadro ----------
const ward = grp(scene, [-5.3, 0, -1.0]);
mesh(rbox(1.1, 2.4, 0.8, 0.05), M('#d4a373'), ward, [0, 1.2, 0]);
mesh(rbox(0.02, 2.2, 0.02, 0.01), M('#a47148'), ward, [0.551, 1.2, 0], [0, Math.PI / 2, 0]);
for (const z of [-0.08, 0.08]) mesh(sph(0.04, 10, 8), M('#6c584c'), ward, [0.56, 1.2, z]);
const cookie = grp(quarto.desk, [0.35, 1.08, 0.2]);
mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24), M('#c68b59'), cookie, [0, 0.02, 0]);
for (let i = 0; i < 5; i++) mesh(sph(0.022, 8, 6), M('#4a2c1d'), cookie, [Math.cos(i * 1.3) * 0.08, 0.04, Math.sin(i * 1.3) * 0.08]);
const tc = document.createElement('canvas'); tc.width = 512; tc.height = 256;
const tx = tc.getContext('2d');
tx.fillStyle = '#fff8e7'; tx.fillRect(0, 0, 512, 256);
tx.fillStyle = '#222'; tx.textAlign = 'center'; tx.font = '700 64px Kalam'; tx.fillText('PARABÉNS!', 256, 100); tx.font = '700 48px Kalam'; tx.fillText('visão de águia :)', 256, 180);
const tinyTex = new THREE.CanvasTexture(tc); tinyTex.colorSpace = THREE.SRGBColorSpace;
let tinyReady = false;
mesh(new THREE.PlaneGeometry(0.3, 0.15), new THREE.MeshBasicMaterial({ map: tinyTex, toneMapped: false }), scene, [3.4, 2.35, -3.915]);

// ---------- acessórios dos animais ----------
const acc = {};
const brown = M('#8a5a36'), brownD = M('#6b4226'), blackM = M('#1c140f'), pinkM = M('#f4a6b7');
// cachorro: orelhas caídas + rabo
acc.dog = { head: grp(jo.head), tail: grp(J, [0, 0.15, -0.33]) };
acc.dog.ears = [-1, 1].map(s => { const g = grp(acc.dog.head, [s * 0.32, 0.22, -0.02]); mesh(sph(0.16, 20, 14), brown, g, [s * 0.06, -0.2, 0], [0, 0, 0], [0.55, 1.35, 0.9]); return g; });
mesh(cap(0.07, 0.35), brownD, acc.dog.tail, [0, 0.18, -0.05], [-0.5, 0, 0]);
mesh(sph(0.08, 12, 10), M('#f1e3d3'), acc.dog.tail, [0, 0.38, -0.16]);
// gato: orelhas pontudas, bigodes, rabo comprido
acc.cat = { head: grp(jo.head), tail: grp(J, [0, 0.12, -0.33]) };
for (const s of [-1, 1]) {
  mesh(new THREE.ConeGeometry(0.13, 0.26, 4), blackM, acc.cat.head, [s * 0.23, 0.42, 0], [0, Math.PI / 4, s * -0.3]);
  mesh(new THREE.ConeGeometry(0.07, 0.15, 4), pinkM, acc.cat.head, [s * 0.225, 0.4, 0.05], [0, Math.PI / 4, s * -0.3]);
  for (let k = -1; k <= 1; k++) mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.3, 6), blackM, acc.cat.head, [s * 0.3, -0.1 + k * 0.04, 0.33], [0, 0, Math.PI / 2 + s * k * 0.15]);
}
acc.cat.segs = [];
{ let p = acc.cat.tail; for (let i = 0; i < 5; i++) { const g = grp(p, i ? [0, 0.2, 0] : [0, 0, 0]); mesh(cap(0.05, 0.15), blackM, g, [0, 0.1, 0]); acc.cat.segs.push(g); p = g; } }
// formiga: antenas
acc.ant = { head: grp(jo.head) };
acc.ant.ants = [-1, 1].map(s => { const g = grp(acc.ant.head, [s * 0.12, 0.36, 0.12]); mesh(cap(0.018, 0.4), blackM, g, [0, 0.22, 0]); mesh(sph(0.05, 12, 10), M('#e63946'), g, [0, 0.45, 0]); return g; });
// camaleão: crista
acc.cham = { head: grp(jo.head) };
for (let i = 0; i < 4; i++) mesh(new THREE.ConeGeometry(0.06, 0.16, 8), M('#52b788'), acc.cham.head, [0, 0.42 - i * 0.02, 0.15 - i * 0.14], [-0.3 - i * 0.3, 0, 0]);
// águia: bico + asas
acc.eagle = { head: grp(jo.head), wings: [] };
mesh(new THREE.ConeGeometry(0.08, 0.22, 16), M('#f4b400'), acc.eagle.head, [0, -0.05, 0.47], [Math.PI / 2 + 0.3, 0, 0]);
for (const s of [-1, 1]) {
  const w = grp(jo.body, [s * 0.22, 0.85, -0.3]);
  for (let i = 0; i < 6; i++) mesh(sph(0.2, 16, 10), i < 4 ? M('#6b4226') : M('#f1e3d3'), w, [s * (0.18 + i * 0.17), -0.05 - i * 0.05, 0], [0, 0, s * (0.2 + i * 0.12)], [1.0, 0.35, 0.18]);
  acc.eagle.wings.push({ g: w, s });
}
const allAcc = ['dog', 'cat', 'ant', 'cham', 'eagle'];
function showAcc(name, k = 1) {
  for (const n of allAcc) {
    const a = acc[n], on = n === name && k > 0.001;
    for (const key of ['head', 'tail']) if (a[key]) { a[key].visible = on; a[key].scale.setScalar(on ? back(k) : 1); }
    if (a.wings) a.wings.forEach(w => { w.g.visible = on; w.g.scale.setScalar(on ? back(k) : 1); });
  }
}
// cores originais (camaleão)
const orig = {}; for (const [k, m] of Object.entries(jo.mats)) orig[k] = m.color.clone();
const wallC = new THREE.Color('#a7c6d8');
function camo(k) { for (const [n, m] of Object.entries(jo.mats)) m.color.copy(orig[n]).lerp(wallC, k * (n === 'hair' ? 0.85 : 0.97)); }
// língua
const tongueG = new THREE.CylinderGeometry(0.06, 0.06, 1, 12); tongueG.translate(0, 0.5, 0);
const tongue = mesh(tongueG, M('#ff6f91'), scene); const tongueTip = mesh(sph(0.07, 12, 10), M('#ff6f91'), scene);
// fone
const phones = grp(scene);
mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 24, Math.PI), M('#222'), phones, [0, 0.05, 0]);
for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16), M('#e63946'), phones, [s * 0.16, 0.02, 0], [0, 0, Math.PI / 2]);
// faíscas e trilha de cheiro
const sparks = []; for (let i = 0; i < 18; i++) sparks.push(mesh(sph(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: ['#ffd54a', '#ffffff', '#7fdcff'][i % 3] }), scene));
const smell = []; for (let i = 0; i < 22; i++) smell.push(mesh(sph(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: '#8be28b', transparent: true, opacity: 0.75 }), scene));

// ---------- tempos ----------
let TL = null, caps = null;
function buildCaps() {
  caps = [];
  for (const l of TL.lines) {
    const parts = l.text.match(/[^.?!:]+[.?!:]+["”]?|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean);
    const merged = [];
    for (const p of parts) { if (merged.length && (merged[merged.length - 1].length + p.length < 44)) merged[merged.length - 1] += ' ' + p; else merged.push(p); }
    const tot = merged.reduce((a, s) => a + s.length, 0);
    let t0 = l.start;
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s }); t0 += d; }
  }
}
const $ = id => document.getElementById(id);
const v = new THREE.Vector3(), v2 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
const facing = (a, b) => Math.atan2(b[0] - a[0], b[2] - a[2]);
const BED0 = quarto.bed.position.clone(), DESK0 = quarto.desk.position.clone();
const CARDS = [[5.6, 'DIA 1: CACHORRO', '#ffb703'], [15.9, 'DIA 2: GATO', '#ffd6e0'], [25.0, 'DIA 3: FORMIGA', '#ff6b6b'], [34.0, 'DIA 4: CAMALEÃO', '#80ed99'], [44.0, 'DIA 5: ÁGUIA', '#ffd54a'], [53.6, 'DIA 6: ???', '#c77dff']];

function burst(t, t0, pos) {
  const k = lin(t, t0, t0 + 0.7);
  if (k <= 0 || k >= 1) return;
  sparks.forEach((s, i) => { const a = i / 18 * Math.PI * 2; s.visible = true; s.position.set(pos[0] + Math.cos(a) * 0.9 * k, pos[1] + Math.sin(a * 2) * 0.5 * k + k * 0.4, pos[2] + Math.sin(a) * 0.9 * k); s.scale.setScalar(1.8 * (1 - k)); });
}

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  if (!tinyReady) { tx.fillStyle = '#fff8e7'; tx.fillRect(0, 0, 512, 256); tx.fillStyle = '#222'; tx.textAlign = 'center'; tx.font = '700 64px Kalam'; tx.fillText('PARABÉNS!', 256, 100); tx.font = '700 48px Kalam'; tx.fillText('visão de águia :)', 256, 180); tinyTex.needsUpdate = true; tinyReady = true; }
  const amp = ampAt(TL, t);
  // padrão
  setDay(1); camera.fov = 38;
  J.position.set(0.3, 0.86, -0.4); J.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  quarto.bed.position.copy(BED0); quarto.bed.rotation.set(0, 0, 0); quarto.desk.position.copy(DESK0); quarto.desk.rotation.set(0, 0, 0);
  cookie.visible = true; cookie.parent !== quarto.desk && quarto.desk.add(cookie); cookie.position.set(0.35, 1.08, 0.2);
  tongue.visible = false; tongueTip.visible = false; phones.visible = false;
  sparks.forEach(s => s.visible = false); smell.forEach(s => s.visible = false);
  camo(0); showAcc(null);
  if (t < 0) { // ---- thumbnail: Joseph pensando, esferas dos animais em volta (overlay) ----
    J.position.set(0.3, 0.86, -0.4); J.rotation.y = 0.2;
    jo.pose({ armR: [1.45, -0.95, 2.25], armL: [0.25, 0.55, 1.2], head: [-0.1, 0.12, 0.1] });
    jo.face({ open: 1.1, mouth: 'flat', brow: 0.4, browTilt: 0.35, look: [0.6, 0.55] });
    thumbLights([0.6, 2.4, 1.0]);
    camera.updateProjectionMatrix(); cam([0.85, 2.15, 3.6], [0.85, 2.02, -0.4], 0, 0);
    renderer.render(scene, camera); return;
  }
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0, P;

  // ===== abertura =====
  if (t < 5.6) {
    setDay(lerp(0.35, 1, seg(t, 0.2, 1.4)));
    const sit = seg(t, 1.3, 2.0);
    jo.legs.forEach(l => l.visible = false);
    J.position.set(-3.2, 1.0, lerp(-2.5, -2.95, sit)); J.rotation.set(lerp(-Math.PI / 2 + 0.15, -0.05, sit), 0, 0);
    const str = seg(t, 2.0, 2.5) * (1 - seg(t, 3.1, 3.5));
    jo.pose({ breathe: jb, armL: [lerp(0.2, 2.9, str), lerp(0.05, 0.3, str), 0.2], armR: [lerp(0.2, 2.9, str), lerp(0.05, 0.3, str), 0.2], head: [-0.2 * str, 0, 0] });
    jo.face({ open: t < 1.5 ? 0.08 : (str > 0.5 ? 0.3 : blink(t)), mouth: str > 0.4 ? 'o' : 'smile', brow: t > 3.5 ? 0.8 : 0 });
    if (t > 3.5 && t < 5.2) showAcc(allAcc[Math.floor(t * 7) % 5], 1);
    ov.q = t > 3.5 && t < 5.3; ov.qp = [-3.2, 3.0, -2.9];
    camPos = mix3([0.6, 2.4, 3.0], [-0.9, 2.0, 0.5], sm(t / 5.6)); camLook = [-3.0, 1.75, -2.9];
    ov.title = t > 0.3 && t < 3.4;
  }
  // ===== dia 1: cachorro =====
  else if (t < 15.9) {
    const k = seg(t, 6.8, 7.4); showAcc('dog', k); burst(t, 6.8, [0.3, 2.0, -0.4]);
    const wag = Math.sin(t * (t > 13.4 ? 38 : 16)) * (t > 13.4 ? 0.9 : 0.45);
    acc.dog.tail.rotation.set(0, 0, wag);
    acc.dog.ears.forEach((e, i) => e.rotation.set(0.1 * Math.sin(t * 6 + i), 0, (i ? -1 : 1) * 0.15 * Math.sin(t * 5)));
    if (t < 7.9) {
      jo.pose({ breathe: jb, armL: [0.2, 0.15, 0.3], armR: [0.2, 0.15, 0.3], head: [0, 0, 0.1 * Math.sin(t * 3)] });
      jo.face({ open: blink(t), mouth: k > 0.5 ? 'o' : 'smile', brow: k * 0.9, look: [0, 0.5 * k] });
      camPos = mix3([0.3, 2.0, 4.0], [0.3, 1.95, 3.2], sm((t - 5.6) / 2.3)); camLook = [0.3, 1.7, -0.4];
    } else if (t < 10.2) {
      const sn = Math.max(0, Math.sin(t * 14)) * 0.12;
      J.rotation.y = -0.6;
      jo.pose({ breathe: jb, armL: [0.2, 0.15, 0.3], armR: [0.2, 0.15, 0.3], head: [-0.25 + sn, 0, 0], lean: -0.05 });
      jo.face({ open: 0.08, mouth: 'smile', brow: 0.6 });
      smell.forEach((s, i) => { const u = ((i / 22) + t * 0.35) % 1; s.visible = true; v.set(lerp(-2.6, 0.15, u), lerp(0.2, 2.05, u * u) + Math.sin(u * 9 + t * 3) * 0.12, lerp(-1.7, -0.25, u) + Math.cos(u * 7 + t * 2) * 0.15); s.position.copy(v); s.scale.setScalar(0.6 + 0.8 * Math.sin(u * Math.PI)); });
      camPos = mix3([-1.3, 2.0, 2.3], [-1.0, 2.0, 1.9], sm((t - 7.9) / 2.3)); camLook = [-0.3, 1.8, -0.6];
      ov.label = 'FARO 10.000x'; ov.labelOn = seg(t, 8.0, 8.3);
    } else if (t < 13.4) {
      const w = lin(t, 10.3, 11.6), A0 = [0.3, -0.4], A1 = [-1.95, -1.6];
      const wp = walkPose(w * 6, w > 0 && w < 1 ? 1 : 0);
      J.position.set(lerp(A0[0], A1[0], sm(w)), 0.66 + wp.bob, lerp(A0[1], A1[1], sm(w)));
      J.rotation.y = facing([A0[0], 0, A0[1]], [A1[0], 0, A1[1]]) * (1 - seg(t, 11.6, 11.9)) + facing([A1[0], 0, A1[1]], [-2.6, 0, -1.7]) * seg(t, 11.6, 11.9);
      const grab = seg(t, 11.8, 12.2), lift = seg(t, 12.3, 12.7);
      jo.pose({ breathe: jb, lean: lerp(0.55, 0.05, lift), leg: [0.5 + wp.leg[0], 0.5 + wp.leg[1]], armL: w < 1 ? wp.armL : [0.3, 0.2, 0.3], armR: w < 1 ? wp.armR : [lerp(lerp(0.3, 1.5, grab), 2.9, lift), 0.15, lerp(0, 0.1, lift)], head: [lerp(-0.2, -0.1, lift), 0, 0] });
      if (t > 12.7) { J.position.y = 0.86; jo.legs.forEach(l => l.rotation.set(0, 0, 0)); }
      jo.face({ open: blink(t), mouth: lift > 0.5 ? 'smile' : 'flat', brow: 0.5 + 0.6 * lift, look: [0, lift > 0.5 ? 0.6 : -0.6] });
      phones.visible = true;
      if (t < 12.25) { phones.position.set(-2.6, 0.07, -1.7); phones.rotation.set(0, 0.5, 0); }
      else { scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); phones.position.copy(v).add(new THREE.Vector3(0, 0.15, 0)); phones.rotation.set(0, 0.5, 0); }
      smell.forEach((s, i) => { const u = ((i / 22) + t * 0.5) % 1; s.visible = t < 12.0; s.position.set(lerp(-2.6, J.position.x, u), 0.2 + u * 1.2, lerp(-1.7, J.position.z, u)); s.scale.setScalar(0.5 + 0.6 * Math.sin(u * Math.PI)); });
      camPos = mix3([1.6, 1.9, 2.4], [1.2, 1.8, 1.8], sm((t - 10.2) / 3.2)); camLook = [-1.4, 1.1, -1.4];
      ov.timer = seg(t, 12.4, 12.6); ov.timerTxt = '0:02';
    } else {
      J.position.set(-0.9, 0.86, -0.9); J.rotation.y = Math.PI / 2 + 0.18 * Math.sin(t * 38);
      const look = seg(t, 13.5, 13.9);
      jo.pose({ breathe: jb, armL: [0.3, 0.3, 0.6], armR: [2.9, 0.15, 0.1], head: [0, -0.9 * look, 0], twist: -0.3 * look });
      jo.face({ open: 1.2 * blink(t), mouth: 'o', brow: 1.2, browTilt: -0.2, look: [-0.8, -0.3] });
      phones.visible = true; scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); phones.position.copy(v).add(new THREE.Vector3(0, 0.15, 0));
      camPos = mix3([-1.4, 1.6, 3.9], [-1.4, 1.55, 3.4], sm((t - 13.4) / 2.5)); camLook = [-1.2, 1.25, -0.9];
    }
  }
  // ===== dia 2: gato =====
  else if (t < 25.0) {
    const k = seg(t, 17.5, 18.1); showAcc('cat', k);
    acc.cat.segs.forEach((g, i) => g.rotation.set(i === 0 ? -0.9 : 0.12 * Math.sin(t * 3 - i * 0.6), 0, 0.25 * Math.sin(t * 2.5 - i * 0.7)));
    if (t < 20.8) {
      const BEDTOP = [-3.2, 1.82, -2.2], TOP = [-5.3, 3.21, -1.0];
      burst(t, 17.5, [BEDTOP[0], BEDTOP[1] + 1.2, BEDTOP[2]]);
      const crouch = seg(t, 18.5, 19.0) * (1 - seg(t, 19.0, 19.1)), j = lin(t, 19.05, 19.9);
      const land = t > 19.9 ? bounce(lin(t, 19.9, 20.5)) : 0;
      if (t < 19.05) { J.position.set(BEDTOP[0], BEDTOP[1] - 0.25 * crouch, BEDTOP[2]); }
      else { J.position.set(lerp(BEDTOP[0], TOP[0], j), lerp(BEDTOP[1], TOP[1], j) + Math.sin(j * Math.PI) * 1.3, lerp(BEDTOP[2], TOP[2], j)); }
      J.rotation.y = facing(BEDTOP, TOP) * seg(t, 18.4, 18.8) + (t > 20.0 ? lerp(0, 1.1, seg(t, 20.0, 20.4)) : 0) * 0;
      const air = t > 19.05 && t < 19.9;
      jo.pose({ breathe: jb, scl: [1 + 0.2 * (crouch + land), 1 - 0.25 * (crouch + land), 1 + 0.2 * (crouch + land)], lean: air ? 0.5 : 0.25 * crouch, leg: air ? [0.9, -0.3] : [0.6 * crouch, 0.6 * crouch], armL: air ? [2.6, 0.3, 0] : [0.6 * crouch, 0.2, 0.4], armR: air ? [2.6, 0.3, 0] : [0.6 * crouch, 0.2, 0.4] });
      jo.face({ open: blink(t), mouth: air ? 'o' : 'smile', brow: 0.6, look: [-0.5, 0.4] });
      camPos = mix3([0.2, 3.3, 5.6], [-0.3, 3.5, 5.0], sm((t - 15.9) / 4.9)); camLook = [-4.1, 2.7, -1.5];
    } else if (t < 22.6) {
      const TOP = [-5.3, 3.21, -1.0], FL = [-4.0, 0.86, 0.6];
      const j = lin(t, 21.0, 21.9);
      J.position.set(lerp(TOP[0], FL[0], j), lerp(TOP[1], FL[1], j) + Math.sin(j * Math.PI) * 0.5, lerp(TOP[2], FL[2], j));
      J.rotation.set(-j * Math.PI * 2, 0.4, 0);
      const land = bounce(lin(t, 21.9, 22.5)), tada = seg(t, 22.0, 22.3);
      jo.pose({ breathe: jb, scl: [1 + 0.25 * land, 1 - 0.3 * land, 1 + 0.25 * land], leg: j < 1 ? [1.2, 1.2] : [0, 0], armL: j < 1 ? [1.8, 0.2, 0.6] : [0.4, lerp(0.2, 1.6, tada), 0.2], armR: j < 1 ? [1.8, 0.2, 0.6] : [0.4, lerp(0.2, 1.6, tada), 0.2] });
      jo.face({ open: blink(t), mouth: 'smile', brow: 0.6 });
      camPos = [-1.2, 2.0, 4.2]; camLook = [-4.4, 1.7, -0.3];
      ov.label = 'SEMPRE DE PÉ'; ov.labelOn = tada;
    } else {
      const spin = lin(t, 22.7, 24.7);
      setDay(0.5 + 0.5 * Math.cos(spin * Math.PI * 4));
      jo.legs.forEach(l => l.visible = true);
      J.position.set(-3.2, 1.25, -2.5); J.rotation.set(0, 0, Math.PI / 2 - 0.1);
      jo.pose({ breathe: breath(t) * 2.5, leg: [1.6, 1.4], armL: [1.2, -0.1, 1.2], armR: [1.2, -0.1, 1.2], head: [0.2, 0, -0.3] });
      jo.face({ open: 0.08, mouth: 'smile' });
      acc.cat.segs[0].rotation.set(-1.4, 0, 0);
      camPos = mix3([-1.9, 2.7, 1.3], [-2.1, 2.6, 0.8], sm((t - 22.6) / 2.4)); camLook = [-3.3, 1.3, -2.5];
      ov.zzz = true; ov.zp = [-3.6, 2.4, -2.5];
      ov.timer = seg(t, 22.8, 23.1); ov.timerTxt = Math.min(16, 1 + Math.floor(spin * 16)) + ' HORAS';
    }
  }
  // ===== dia 3: formiga =====
  else if (t < 34.0) {
    const k = seg(t, 26.6, 27.2); showAcc('ant', k);
    acc.ant.ants.forEach((a, i) => a.rotation.set(0.25 + 0.15 * Math.sin(t * 7 + i), 0, (i ? -1 : 1) * (0.35 + 0.15 * Math.sin(t * 5 + i * 2))));
    P = [-0.3, 0.86, -0.9]; J.position.set(...P);
    if (t < 30.4) {
      burst(t, 26.6, [P[0], 2.0, P[2]]);
      const flex = seg(t, 27.9, 28.3), pump = Math.sin(t * 8) * 0.12 * flex;
      jo.pose({ breathe: jb, armL: [lerp(0.2, 0.2, flex), lerp(0.15, 1.45, flex), lerp(0.3, 2.1 + pump, flex)], armR: [lerp(0.2, 0.2, flex), lerp(0.15, 1.45, flex), lerp(0.3, 2.1 - pump, flex)], head: [0, 0.2 * Math.sin(t * 2), 0] });
      jo.face({ open: blink(t), mouth: 'smile', brow: lerp(0, -0.3, flex), browTilt: 0.2 * flex, look: [0, 0] });
      camPos = t < 27.8 ? mix3([-0.3, 2.0, 3.6], [-0.3, 1.95, 3.0], sm((t - 25) / 2.8)) : mix3([-0.3, 1.0, 2.8], [-0.3, 1.0, 2.4], sm((t - 27.8) / 2.6));
      camLook = t < 27.8 ? [-0.3, 1.7, -0.9] : [-0.3, 2.0, -0.9];
      ov.big = seg(t, 28.0, 28.3); ov.bigTxt = '50x';
    } else {
      const liftB = seg(t, 30.6, 31.3), liftD = seg(t, 32.3, 33.0);
      const strain = Math.sin(t * 30) * 0.02;
      jo.pose({ breathe: jb, armR: [lerp(0.2, 3.05, liftB), 0.15, 0], armL: [lerp(0.2, 3.05, liftD), 0.15, 0], head: [-0.1, 0, strain] });
      jo.face({ open: blink(t), mouth: 'smile', brow: 0.4, look: [0, 0.6] });
      scene.updateMatrixWorld(true);
      if (liftB > 0) { jo.handR.getWorldPosition(v); v2.set(v.x, v.y + 0.08, v.z); quarto.bed.position.lerpVectors(BED0, v2, liftB); quarto.bed.rotation.set(0.05 * Math.sin(t * 3), lerp(0, 1.3, liftB), 0.04 * Math.sin(t * 2.3)); }
      if (liftD > 0) { jo.handL.getWorldPosition(v); v2.set(v.x, v.y + 0.08, v.z); quarto.desk.position.lerpVectors(DESK0, v2, liftD); quarto.desk.rotation.set(0.04 * Math.sin(t * 2.7), 0, 0.05 * Math.sin(t * 3.1)); }
      camPos = mix3([-0.3, 1.6, 7.6], [-0.3, 1.7, 6.8], sm((t - 30.4) / 3.6)); camLook = [-0.3, 2.6, -1.0];
      shake = 0.03 * (Math.max(0, 1 - Math.abs(t - 31.3) * 4) + Math.max(0, 1 - Math.abs(t - 33.0) * 4));
    }
  }
  // ===== dia 4: camaleão =====
  else if (t < 44.0) {
    const k = seg(t, 35.6, 36.2); showAcc('cham', k);
    P = [-5.45, 0.86, 0.2]; J.position.set(...P); J.rotation.y = Math.PI / 2;
    const hide = seg(t, 36.9, 37.7) * (1 - seg(t, 43.0, 43.5));
    camo(hide);
    const roll = t > 38.3 && t < 40.6;
    const eatT = lin(t, 40.8, 41.7), back_ = lin(t, 42.0, 42.9);
    jo.pose({ breathe: jb, armL: [0.2, 0.15, 0.3], armR: [0.2, 0.15, 0.3], head: [0, eatT > 0 && back_ < 1 ? 0.25 : 0, 0] });
    jo.face({ open: roll ? 1.35 : blink(t) * (hide > 0.5 ? 1.25 : 1), mouth: eatT > 0 && back_ < 1 ? 'o' : (t > 43 ? 'smile' : 'smile'), brow: 0.4, look: [0, 0] });
    if (roll) { jo.pupils[0].position.set(Math.cos(t * 9) * 0.035, Math.sin(t * 9) * 0.035, 0.035); jo.pupils[1].position.set(Math.cos(-t * 7 + 1) * 0.035, Math.sin(-t * 7 + 1) * 0.035, 0.035); }
    if (t < 36.8) { burst(t, 35.6, [P[0], 2.0, P[2]]); camPos = mix3([-2.0, 1.9, 0.9], [-2.5, 1.9, 0.7], sm((t - 34) / 2.8)); camLook = [-5.45, 1.75, 0.2]; }
    else if (t < 38.3) { camPos = mix3([-2.6, 1.9, 0.6], [-2.9, 1.9, 0.5], sm((t - 36.8) / 1.5)); camLook = [-5.45, 1.75, 0.2]; ov.label = 'CADÊ?'; ov.labelOn = seg(t, 37.6, 37.9); }
    else if (t < 40.7) { camPos = [-4.25, 2.12, 0.45]; camLook = [-5.45, 2.08, 0.2]; }
    else {
      scene.updateMatrixWorld(true);
      jo.head.getWorldPosition(v); v.add(new THREE.Vector3(0.42, -0.2, 0));
      cookie.getWorldPosition(v2);
      const ext = eatT < 1 ? sm(eatT) : 1 - sm(back_);
      if (t > 40.8 && back_ < 1) {
        const target = v2.clone();
        if (back_ > 0) { const cw = v.clone().lerp(target, 1 - sm(back_)); scene.add(cookie); cookie.position.copy(cw).add(new THREE.Vector3(0, -0.02, 0)); target.copy(cw); }
        const dir = target.clone().sub(v), len = dir.length() * (back_ > 0 ? 1 : ext);
        tongue.visible = true; tongue.position.copy(v); tongue.quaternion.setFromUnitVectors(up, dir.normalize()); tongue.scale.set(1, Math.max(0.01, len), 1);
        tongueTip.visible = true; tongueTip.position.copy(v).add(dir.multiplyScalar(len));
      }
      if (back_ >= 1) cookie.visible = false;
      const chew = t > 42.9 ? Math.abs(Math.sin(t * 12)) : 0;
      if (t > 42.9) jo.face({ open: blink(t), mouth: chew > 0.5 ? 'o' : 'smile', brow: 0.6 });
      camPos = mix3([-1.0, 3.6, 8.2], [-1.0, 3.4, 7.6], sm((t - 40.7) / 3.3)); camLook = [-1.0, 1.4, -0.9];
    }
  }
  // ===== dia 5: águia =====
  else if (t < 53.6) {
    const k = seg(t, 45.4, 46.0); showAcc('eagle', k);
    P = [0.3, 0.86, -0.4];
    const spread = seg(t, 49.5, 50.1);
    const flap = t > 50.1 ? Math.sin(t * 12) * 0.5 : 0;
    acc.eagle.wings.forEach(w => w.g.rotation.set(0, w.s * lerp(0.9, 0.2, spread), w.s * (lerp(-0.6, 0.15, spread) + flap)));
    if (t < 50.15) {
      J.position.set(...P);
      burst(t, 45.4, [P[0], 2.0, P[2]]);
      J.rotation.y = t > 46.2 ? facing(P, [3.4, 0, -3.9]) * seg(t, 46.2, 46.6) : 0;
      jo.pose({ breathe: jb, armL: [0.2, lerp(0.15, 1.2, spread), 0.2], armR: [0.2, lerp(0.15, 1.2, spread), 0.2], head: [t > 46.2 && t < 49.4 ? -0.1 : 0, 0, 0] });
      jo.face({ open: t > 46.4 && t < 49.4 ? 0.5 : blink(t), mouth: 'smile', brow: t > 46.4 && t < 49.4 ? -0.4 : 0.5, look: [0, 0] });
      if (t < 46.3) { camPos = mix3([0.3, 2.0, 3.8], [0.3, 1.95, 3.2], sm((t - 44) / 2.3)); camLook = [0.3, 1.8, -0.4]; }
      else if (t < 49.4) {
        const z = seg(t, 46.8, 48.2);
        camPos = [0.8, 2.35, -0.95]; camLook = mix3([1.5, 2.3, -2.0], [3.4, 2.35, -3.9], seg(t, 46.3, 46.8)); camera.fov = lerp(38, 3.2, z);
        ov.scope = seg(t, 46.4, 46.7); ov.label = 'VISÃO DE ÁGUIA'; ov.labelOn = seg(t, 48.2, 48.5);
      } else { camPos = mix3([0.3, 1.9, 3.6], [0.3, 2.1, 4.4], sm((t - 49.4) / 0.8)); camLook = [0.3, 1.9, -0.4]; }
    } else {
      const f = t - 50.15, a = f * 1.5 - Math.PI / 2;
      const rise = seg(t, 50.15, 50.9), landK = seg(t, 52.95, 53.55);
      const C = [0.2, 2.7, -0.7];
      const fx = C[0] + Math.cos(a) * 2.3 * rise, fz = C[2] + Math.sin(a) * 1.4 * rise + (1 - rise) * 0.3, fy = lerp(0.86, C[1] + 0.2 * Math.sin(f * 3), rise);
      J.position.set(lerp(fx, 0.3, landK), lerp(fy, 0.86, landK), lerp(fz, 0.2, landK));
      J.rotation.set(0, lerp(Math.atan2(-Math.sin(a), Math.cos(a) * 1.6) + 0, 0, landK), lerp(-0.35 * rise, 0, landK));
      const talk = t > 51.9 && t < 52.95 ? amp : -1;
      jo.pose({ breathe: jb, lean: lerp(0.9 * rise, 0, landK), leg: [lerp(-0.4 * rise, 0, landK), lerp(-0.3 * rise, 0, landK)], armL: [lerp(-0.4, 0.2, landK), 0.3, 0], armR: [lerp(-0.4, 0.2, landK), 0.3, 0], head: [lerp(-0.6 * rise, 0, landK), 0, 0] });
      jo.face({ open: 1.2 * blink(t), mouth: 'smile', talk, brow: 1, look: [0, 0.4] });
      camPos = [0.2, 3.3, 6.8]; camLook = [0.2, 2.2, -0.8];
    }
  }
  // ===== fim: dia 6? =====
  else {
    P = [0.3, 0.86, 0.2]; J.position.set(...P);
    const land = bounce(lin(t, 53.55, 54.2));
    const spinR = t > 55.6 && t < 58.4;
    if (spinR) showAcc(allAcc[Math.floor(t * 8) % 5], 1);
    if (t < 54.0) { showAcc('eagle', 1 - lin(t, 53.6, 54.0)); }
    burst(t, 53.7, [P[0], 2.0, P[2]]);
    const shrug = seg(t, 56.4, 56.7) * (1 - seg(t, 57.6, 58.0)), point = seg(t, 58.5, 58.9);
    jo.pose({ breathe: jb, scl: [1 + 0.2 * land, 1 - 0.25 * land, 1 + 0.2 * land], armL: [lerp(0.3, 0.4, shrug), lerp(0.15, 0.9, shrug), lerp(0.3, 1.5, shrug)], armR: [lerp(lerp(0.3, 0.4, shrug), 1.45, point), lerp(lerp(0.15, 0.9, shrug), 0.05, point), lerp(lerp(0.3, 1.5, shrug), 0.1, point)], head: [0, 0, 0.15 * shrug] });
    jo.face({ open: blink(t), mouth: 'smile', brow: 0.8 * shrug + 0.3, look: [0, 0] });
    camPos = mix3([0.3, 2.2, 4.6], [0.3, 2.15, 3.0], sm((t - 53.6) / 6)); camLook = [0.3, 1.95, 0.2];
    ov.q = spinR || t > 58.4; ov.qp = [0.3, 3.25, 0.2];
    ov.cta = seg(t, 58.4, 58.8); ov.follow = seg(t, 60.4, 60.8);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  // ---------- overlays ----------
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  $('title').style.opacity = ov.title ? 1 : 0;
  const card = CARDS.filter(c => t >= c[0] && t < c[0] + 2.6).pop();
  const ce = $('card'); ce.style.opacity = card ? 1 : 0;
  if (card) { ce.textContent = card[1]; ce.style.color = card[2]; ce.style.transform = `translateX(-50%) scale(${0.5 + 0.5 * back(lin(t, card[0], card[0] + 0.35))})`; }
  $('label').textContent = ov.label || ''; pop('label', ov.labelOn || 0);
  $('timer').textContent = ov.timerTxt || ''; pop('timer', ov.timer || 0, '');
  $('big').textContent = ov.bigTxt || ''; pop('big', ov.big || 0, '');
  $('scope').style.opacity = ov.scope || 0;
  pop('cta', ov.cta || 0); pop('follow', ov.follow || 0);
  place($('zzz'), ov.zp || [0, 0, 0], ov.zzz, 1 + 0.08 * Math.sin(t * 4));
  place($('q'), ov.qp || [0, 0, 0], ov.q, 1 + 0.06 * Math.sin(t * 5));
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  $('cap').textContent = c ? c.s : ''; $('cap').style.opacity = c ? 1 : 0;
};
