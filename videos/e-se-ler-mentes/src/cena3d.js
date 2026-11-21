// "E se você pudesse ler a mente das pessoas?" — série E se? (3D)
import {
  THREE, scene, camera, renderer, quarto, setDay, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, place, cam, ampAt, noise, W, H
} from '../../_lib/mundo3d.js';

const jo = makeChar();
const mae = makeChar({ skin: '#9c6644', hood: '#c2577a', hood2: '#a94a69', pants: '#3d405b', hair: '#2b1d14', sole: '#c2577a' });
mesh(sph(0.42, 24, 16), mae.mats.hair, mae.head, [0, -0.1, -0.14], [0, 0, 0], [1.12, 1.25, 0.85]);
mesh(sph(0.16, 16, 12), mae.mats.hair, mae.head, [0, 0.32, -0.3]);
for (const s of [-1, 1]) mesh(sph(0.04, 10, 8), M('#ffd54a', { metalness: 0.5 }), mae.head, [s * 0.43, -0.14, 0.02]);
const ami = makeChar({ skin: '#e0ac69', hood: '#2a6f97', hood2: '#235d7e', hair: '#5a3825', sole: '#2a6f97' });
mesh(new THREE.SphereGeometry(0.46, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45), M('#e63946'), ami.head, [0, 0.04, 0], [-0.15, 0, 0]);
mesh(rbox(0.5, 0.04, 0.35, 0.02), M('#e63946'), ami.head, [0, 0.2, 0.5], [0.1, 0, 0]);
const book = grp(ami.torso, [0, 0.5, 0.45]);
mesh(rbox(0.32, 0.42, 0.08, 0.02), M('#8d5fd3'), book);

// porta na parede esquerda + bagunça
const DOOR = [-6.0, 0, 1.3];
mesh(rbox(0.12, 2.3, 1.2, 0.02), M('#f6f1e7'), scene, [DOOR[0] + 0.02, 1.15, DOOR[2]]);
mesh(new THREE.PlaneGeometry(1.0, 2.1), new THREE.MeshBasicMaterial({ color: '#2b2d42' }), scene, [DOOR[0] + 0.09, 1.05, DOOR[2]], [0, Math.PI / 2, 0]);
const doorP = grp(scene, [DOOR[0] + 0.1, 0, DOOR[2] - 0.5]);
mesh(rbox(0.06, 2.1, 1.0, 0.02), M('#b5835a'), doorP, [0, 1.05, 0.5]);
mesh(sph(0.05, 10, 8), M('#ffd54a', { metalness: 0.6 }), doorP, [0.06, 1.0, 0.9]);
[[-0.6, 0.9, '#e63946'], [1.4, 0.7, '#457b9d'], [-1.4, -0.3, '#f4a261'], [2.0, -0.9, '#2a9d8f'], [0.9, 1.5, '#ffffff']].forEach(([x, z, c], i) =>
  mesh(rbox(0.6, 0.05, 0.45, 0.02), M(c, { roughness: 0.95 }), scene, [x, 0.03, z], [0, i * 0.9, 0]));
mesh(rbox(0.55, 0.07, 0.55, 0.01), M('#d9a066'), scene, [1.9, 0.04, 0.6], [0, 0.4, 0]);

// anéis do poder
const rings = []; for (let i = 0; i < 3; i++) rings.push(mesh(new THREE.TorusGeometry(0.5, 0.025, 8, 40), new THREE.MeshBasicMaterial({ color: '#c77dff', transparent: true, opacity: 0 }), scene));
rings.forEach(r => { r.castShadow = false; r.receiveShadow = false; });
const warm = new THREE.PointLight('#ffb26b', 0, 6, 1.5); scene.add(warm);

// ---------- balões de pensamento (HTML) ----------
const NOISE = ['tô com fome', 'que sono', 'esqueci o boleto', 'prova amanhã!', 'kkkkk', 'ele é estranho', 'e se chover?', 'tô atrasado', 'quero férias', 'cadê meu fone', 'será que ela gosta de mim?', 'aff', 'pizza!', 'segunda de novo', 'like', 'que calor'];
const layer = document.getElementById('bubbles');
const pool = []; for (let i = 0; i < 26; i++) { const d = document.createElement('div'); d.className = 'bub'; layer.appendChild(d); pool.push(d); }
const v = new THREE.Vector3();
let used = 0;
function bubble(text, p, k, big = false, tint = '#ffffff') {
  if (k <= 0.01) return;
  const d = pool[used++]; if (!d) return;
  v.set(...p).project(camera);
  d.textContent = text; d.style.opacity = Math.min(1, k * 1.5);
  d.style.left = clamp((v.x + 1) / 2 * W, big ? 720 : 200, big ? 1200 : 1720) + 'px'; d.style.top = Math.max((1 - v.y) / 2 * H, big ? 175 : 110) + 'px';
  d.style.fontSize = big ? (text.length > 30 ? '50px' : '62px') : '40px'; d.style.background = tint;
  d.style.transform = `translate(-50%,-100%) scale(${0.4 + 0.6 * back(k)})`;
}
const headTop = (c, dy = 0.85) => { c.head.getWorldPosition(v); return [v.x, v.y + dy, v.z]; };

let TL = null, caps = null;
function buildCaps() {
  caps = [];
  for (const l of TL.lines) {
    const parts = l.text.match(/[^.?!:]+[.?!:]+|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean);
    const merged = [];
    for (const p of parts) { if (merged.length && (merged[merged.length - 1].length + p.length < 44)) merged[merged.length - 1] += ' ' + p; else merged.push(p); }
    const tot = merged.reduce((a, s) => a + s.length, 0);
    let t0 = l.start;
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s }); t0 += d; }
  }
}
const $ = id => document.getElementById(id);
const facing = (a, b) => Math.atan2(b[0] - a[0], b[2] - a[2]);
function walkTo(c, A, B, t0, t1, t, extra = {}) {
  const k = lin(t, t0, t1), w = walkPose(k * 2 * (t1 - t0) * 1.6, k > 0 && k < 1 ? 1 : 0);
  c.root.position.set(lerp(A[0], B[0], sm(k)), 0.86 + w.bob, lerp(A[2], B[2], sm(k)));
  if (k > 0 && k < 1) c.root.rotation.y = facing(A, B);
  return { k, w };
}

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  used = 0;
  const amp = ampAt(TL, t);
  setDay(1); warm.intensity = 0;
  jo.root.position.set(0.3, 0.86, -0.6); jo.root.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  mae.root.visible = false; ami.root.visible = false; mae.root.rotation.set(0, 0, 0); ami.root.rotation.set(0, 0, 0);
  doorP.rotation.y = 0; book.visible = false;
  rings.forEach(r => r.material.opacity = 0);
  let camPos, camLook, shake = 0, power = 1, ov = {};
  const jb = breath(t), mb = breath(t, 0.8), ab = breath(t, 1.7);
  const MAE_IN = [-1.7, 0.86, 0.5], AMI_IN = [-1.4, 0.86, 0.7];
  if (t < 0) { // ---- pose da thumbnail: Joseph ouvindo, mãe pensando ----
    jo.root.position.set(0.6, 0.86, -0.2); jo.root.rotation.y = -0.3;
    jo.pose({ armL: [1.7, 1.0, 2.4], armR: [1.7, 1.0, 2.4], head: [-0.05, 0.1, 0.08] });
    jo.face({ open: 1.4, mouth: 'o', brow: 1.3, look: [-0.7, 0.3] });
    mae.root.visible = true; mae.root.position.set(-1.0, 0.86, -1.6); mae.root.rotation.y = 0.5;
    mae.pose({ armL: [0.9, -0.3, 1.9], armR: [0.2, 0.1, 0.3], head: [0, 0.2, 0.12] });
    mae.face({ open: 0.9, mouth: 'flat', brow: -0.3, browTilt: 0.35, look: [0.6, 0] });
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v);
    rings.forEach((r, i) => { r.position.copy(v); r.position.y += 0.62; r.rotation.set(Math.PI / 2, 0, 0); r.scale.setScalar(0.9 + i * 0.45); r.material.opacity = 0.85 - i * 0.2; });
    cam([0.15, 2.15, 2.5], [-0.35, 2.05, -0.7], 0, 0);
    renderer.render(scene, camera);
    bubble('CHIQUEIRO!', headTop(mae, 0.95), 1, true); pool.forEach((d, i) => { if (i >= used) d.style.opacity = 0; });
    pool[0].style.fontSize = '84px';
    return;
  }
  const maeTalk = t > 7.83 && t < 9.33 ? amp : -1, amiTalk = t > 15.54 && t < 17.34 ? amp : -1;

  // ===== A: acorda ouvindo pensamentos =====
  if (t < 5.3) {
    jo.legs.forEach(l => l.visible = false);
    const sit = seg(t, 1.6, 2.4);
    jo.root.position.set(-3.2, 1.0, lerp(-2.5, -2.95, sit)); jo.root.rotation.set(lerp(-Math.PI / 2 + 0.15, -0.05, sit), 0, 0);
    const hold = seg(t, 2.8, 3.3);
    jo.pose({ breathe: jb, armL: [lerp(0.2, 1.9, hold), lerp(0.05, 0.6, hold), lerp(0.2, 2.2, hold)], armR: [lerp(0.2, 1.9, hold), lerp(0.05, 0.6, hold), lerp(0.2, 2.2, hold)], head: [0, 0.3 * Math.sin(t * 3) * hold, 0] });
    jo.face({ open: t < 2.0 ? 0.08 : 1.3, mouth: hold > 0.5 ? 'o' : 'flat', brow: hold, look: [Math.sin(t * 4) * hold, 0.3] });
    power = seg(t, 2.0, 2.6);
    for (let i = 0; i < 4; i++) bubble(NOISE[i * 3], [-3.2 + Math.cos(i * 1.6) * 1.2, 2.9 + (i % 2) * 0.4, -2.9 + Math.sin(i * 1.6) * 0.5], seg(t, 3.0 + i * 0.3, 3.3 + i * 0.3));
    camPos = mix3([0.6, 2.4, 3.0], [-0.8, 2.1, 0.6], sm(t / 5.3)); camLook = [-3.0, 1.8, -2.9];
    ov.title = t > 0.3 && t < 3.0;
  }
  // ===== B: a mãe =====
  else if (t < 12.6) {
    mae.root.visible = true;
    doorP.rotation.y = -1.4 * seg(t, 5.3, 5.8) * (1 - seg(t, 11.8, 12.4));
    const { k } = walkTo(mae, [-5.7, 0.86, 1.3], MAE_IN, 5.6, 7.3, t);
    if (k >= 1) mae.root.rotation.y = facing(MAE_IN, [0.3, 0, -0.6]) + (t > 10.0 && t < 12.2 ? 0.6 * Math.sin((t - 10) * 2.2) : 0);
    const wave = t > 7.6 && t < 9.4 ? Math.sin(t * 10) * 0.3 : 0;
    mae.pose({ breathe: mb, armL: k < 1 ? [0.3 * Math.sin(t * 9), 0.05, 0.3] : [t > 7.6 && t < 9.4 ? 2.3 : 0.2, 0.3 + wave, 0.4], armR: k < 1 ? [-0.3 * Math.sin(t * 9), 0.05, 0.3] : (t > 10 ? [0.9, -0.3, 1.9] : [0.2, 0.1, 0.3]) });
    mae.face({ open: blink(t, 0.5), mouth: t > 10.2 ? 'flat' : 'smile', talk: maeTalk, brow: t > 10.2 ? -0.3 : 0.4, browTilt: t > 10.2 ? 0.3 : 0, look: t > 10.2 ? [Math.sin(t * 3), -0.5] : [0.3, 0.2] });
    jo.root.rotation.y = facing([0.3, 0, -0.6], MAE_IN) * seg(t, 6.0, 6.6);
    const busted = seg(t, 11.0, 11.4);
    jo.pose({ breathe: jb, armL: [0.2, 0.1, 0.3], armR: [lerp(0.2, 1.6, busted), lerp(0.1, 0.5, busted), lerp(0.3, 2.3, busted)], head: [0, 0, 0.1 * busted] });
    jo.face({ open: blink(t), mouth: busted > 0.5 ? 'flat' : 'smile', brow: 0.3 + 0.6 * busted, browTilt: -0.3 * busted, look: [-0.5, 0.2] });
    bubble('esse quarto tá um CHIQUEIRO', headTop(mae, 1.0), seg(t, 10.5, 10.8), true);
    if (t < 9.6) { camPos = mix3([1.8, 2.0, 4.2], [1.4, 1.95, 3.6], sm((t - 5.3) / 4.3)); camLook = [-1.8, 1.4, 0.0]; }
    else { camPos = mix3([0.2, 2.0, 2.6], [0.0, 2.0, 2.2], sm((t - 9.6) / 3)); camLook = [-1.0, 1.9, 0.0]; }
  }
  // ===== C: o amigo =====
  else if (t < 21.0) {
    ami.root.visible = true; book.visible = t > 17.9;
    doorP.rotation.y = -1.4 * seg(t, 12.6, 13.0);
    const { k } = walkTo(ami, [-5.7, 0.86, 1.3], AMI_IN, 13.0, 14.8, t);
    if (k >= 1) ami.root.rotation.y = facing(AMI_IN, [0.3, 0, -0.6]);
    const swear = t > 15.4 && t < 17.5;
    ami.pose({ breathe: ab, armL: k < 1 ? [0.3 * Math.sin(t * 9), 0.05, 0.3] : (swear ? [1.0, 0.5, 1.3] : [0.2, 0.1, 0.3]), armR: k < 1 ? [-0.3 * Math.sin(t * 9), 0.05, 0.3] : (swear ? [1.0, 0.5, 1.3] : (t > 17.9 ? [0.9, -0.2, 1.4] : [0.2, 0.1, 0.3])), head: [0, 0, swear ? 0.12 * Math.sin(t * 4) : 0] });
    ami.face({ open: blink(t, 1.1), mouth: 'smile', talk: amiTalk, brow: swear ? 0.8 : 0.2, look: [0.3, 0.2] });
    jo.root.rotation.y = facing([0.3, 0, -0.6], AMI_IN) * seg(t, 13.6, 14.2);
    const sus = seg(t, 18.9, 19.3), cross = seg(t, 19.4, 19.9);
    jo.pose({ breathe: jb, armL: [lerp(0.2, 1.0, cross), lerp(0.1, -0.9, cross), lerp(0.3, 1.9, cross)], armR: [lerp(0.2, 1.0, cross), lerp(0.1, -0.9, cross), lerp(0.3, 1.9, cross)], head: [0, 0, -0.1 * sus] });
    jo.face({ open: lerp(blink(t), 0.45, sus), mouth: sus > 0.5 ? 'smile' : 'flat', brow: -0.4 * sus, browTilt: -0.3 * sus, look: [-0.4, 0.1] });
    bubble('estudei 3 HORAS ontem', headTop(ami, 1.0), seg(t, 18.8, 19.1), true);
    if (t < 17.6) { camPos = mix3([1.8, 2.0, 4.2], [1.3, 1.95, 3.7], sm((t - 12.6) / 5)); camLook = [-1.4, 1.4, 0.1]; }
    else { camPos = mix3([0.3, 2.0, 2.6], [0.1, 2.0, 2.2], sm((t - 17.6) / 3.4)); camLook = [-0.8, 1.9, 0.0]; }
  }
  // ===== D: divertido -> barulho =====
  else if (t < 28.8) {
    ami.root.visible = t < 23.4; ami.root.position.set(...AMI_IN); ami.root.rotation.y = facing(AMI_IN, [0.3, 0, -0.6]);
    ami.pose({ breathe: ab, armR: [0.9, -0.2, 1.4] }); ami.face({ open: blink(t), mouth: 'flat', brow: 0.6, look: [0.2, 0] }); book.visible = true;
    const fun = t < 23.3, noiseK = seg(t, 23.5, 27.6);
    jo.root.rotation.y = fun ? facing([0.3, 0, -0.6], AMI_IN) : lerp(0.4, 0, seg(t, 23.4, 23.8));
    const cover = seg(t, 24.0, 24.4), crouch = seg(t, 26.4, 27.6);
    jo.root.position.y = 0.86 - 0.25 * crouch;
    const laugh = fun ? Math.abs(Math.sin(t * 16)) * 0.04 : 0;
    jo.root.position.y += laugh;
    jo.pose({ breathe: jb, lean: 0.3 * crouch, leg: [0.6 * crouch, 0.6 * crouch], armR: fun ? [1.4, 0.05, 0.1] : [lerp(0.2, 1.7, cover), lerp(0.1, 1.0, cover), lerp(0.3, 2.4, cover)], armL: fun ? [0.3, 0.6, 1.6] : [lerp(0.2, 1.7, cover), lerp(0.1, 1.0, cover), lerp(0.3, 2.4, cover)], head: [0.1 * crouch, 0.15 * Math.sin(t * 13) * noiseK, 0.1 * Math.sin(t * 9) * noiseK] });
    jo.face({ open: fun ? 0.5 : lerp(1.3, 0.15, cover), mouth: fun ? 'smile' : 'flat', brow: fun ? 0.5 : -0.4, browTilt: fun ? 0 : 0.4, look: [0, 0] });
    if (!fun) {
      const n = Math.floor(3 + noiseK * 23);
      for (let i = 0; i < n; i++) { const a = i * 2.4 + t * 0.4 * (i % 2 ? 1 : -1), r = 1.0 + (i % 5) * 0.35; bubble(NOISE[i % NOISE.length], [0.3 + Math.cos(a) * r * 1.4, 1.6 + ((i * 0.37) % 1) * 1.8 + Math.sin(t * 3 + i) * 0.05, -0.6 + Math.sin(a) * r * 0.5], seg(t, 23.6 + i * 0.15, 23.9 + i * 0.15)); }
      shake = 0.06 * noiseK; power = 1 + noiseK;
      ov.count = noiseK; ov.countTxt = t < 25.6 ? '10' : t < 26.2 ? '20' : '100';
    }
    if (fun) { camPos = mix3([0.6, 1.95, 2.5], [0.5, 1.95, 2.2], sm((t - 21) / 2.3)); camLook = [-0.6, 1.7, -0.1]; }
    else { camPos = mix3([0.3, 2.0, 3.6], [0.3, 1.9, 2.6], sm((t - 23.3) / 5.5)); camLook = [0.3, 1.6, -0.6]; }
  }
  // ===== E: silêncio... a mãe =====
  else if (t < 34.6) {
    mae.root.visible = true; mae.root.position.set(-1.9, 0.86, 0.6); mae.root.rotation.y = facing([-1.9, 0, 0.6], [0.3, 0, -0.6]);
    mae.pose({ breathe: mb, armL: [0.7, -0.2, 1.6], armR: [0.7, -0.2, 1.6], head: [0.12, 0, 0.12] });
    mae.face({ open: 0.85 * blink(t, 0.4), mouth: 'sad', brow: 0.3, browTilt: -0.4, look: [0.3, -0.1] });
    const turn = seg(t, 31.5, 32.4);
    jo.root.position.y = 0.86 - 0.25 * (1 - seg(t, 29.0, 30.0));
    jo.root.rotation.y = lerp(0, facing([0.3, 0, -0.6], [-1.9, 0, 0.6]), turn);
    jo.pose({ breathe: jb, armL: [0.2, 0.1, 0.3], armR: [0.2, 0.1, 0.3], head: [0.15, 0, 0] });
    jo.face({ open: blink(t), mouth: 'flat', brow: 0.4 + 0.4 * turn, browTilt: -0.35 * turn, look: [-0.4, 0] });
    bubble('será que ele tá bem? ele anda tão cansado...', headTop(mae, 1.0), seg(t, 30.9, 31.3), true, '#dbeafe');
    if (t < 32.2) { camPos = mix3([1.0, 2.0, 2.6], [0.7, 2.0, 2.2], sm((t - 28.8) / 3.4)); camLook = [-1.9, 1.85, 0.6]; } else { camPos = mix3([0.2, 2.0, 3.6], [0.1, 1.95, 3.2], sm((t - 32.2) / 2.4)); camLook = [-0.8, 1.6, 0.0]; }
    power = 0.5;
  }
  // ===== F: desliga o poder e abraça =====
  else if (t < 44.9) {
    mae.root.visible = true; const MP = [-1.9, 0.86, 0.6];
    mae.root.position.set(...MP); mae.root.rotation.y = facing(MP, [0.3, 0, -0.6]);
    const H0 = [0.3, 0.86, -0.6], H1 = [-1.38, 0.86, 0.16];
    power = 0.5 * (1 - seg(t, 35.5, 36.4));
    const close = seg(t, 35.4, 35.8) * (1 - seg(t, 36.5, 36.8));
    const { k } = walkTo(jo, H0, H1, 36.9, 37.9, t);
    if (t < 36.9) jo.root.rotation.y = facing(H0, MP);
    if (k >= 1) jo.root.rotation.y = facing(H1, MP);
    const hug = seg(t, 37.8, 38.4);
    jo.pose({ breathe: jb, armL: k < 1 ? [0.3 * Math.sin(t * 9), 0.05, 0.3] : [lerp(0.2, 1.35, hug), lerp(0.1, -0.45, hug), lerp(0.3, 0.9, hug)], armR: k < 1 ? [-0.3 * Math.sin(t * 9), 0.05, 0.3] : [lerp(0.2, 1.35, hug), lerp(0.1, -0.45, hug), lerp(0.3, 0.9, hug)], head: [0.1 * hug, 0, -0.2 * hug] });
    jo.face({ open: close > 0.5 ? 0.08 : (hug > 0.5 ? 0.08 : blink(t)), mouth: hug > 0.5 ? 'smile' : 'flat', brow: 0.3 });
    const mh = seg(t, 38.0, 38.6);
    mae.pose({ breathe: mb, armL: [lerp(0.7, 1.35, mh), lerp(-0.2, -0.45, mh), lerp(1.6, 0.9, mh)], armR: [lerp(0.7, 1.35, mh), lerp(-0.2, -0.45, mh), lerp(1.6, 0.9, mh)], head: [0.1 * mh, 0, 0.2 * mh] });
    mae.face({ open: mh > 0.5 ? 0.08 : blink(t, 0.4), mouth: mh > 0.3 ? 'smile' : 'sad', brow: 0.3 * mh, browTilt: -0.4 * (1 - mh) });
    warm.position.set(-1.6, 2.2, 1.2); warm.intensity = 6 * seg(t, 38.0, 39.5);
    if (t < 37.0) { camPos = [-0.6, 2.05, 1.7]; camLook = [0.3, 1.95, -0.6]; }
    else { const a = lerp(0.2, -0.5, sm((t - 37) / 7.9)); camPos = [-1.65 + Math.sin(a) * 2.9, 1.95, 0.38 + Math.cos(a) * 2.9]; camLook = [-1.65, 1.75, 0.38]; }
    ov.ask = seg(t, 43.2, 43.6);
  }
  // ===== G: pergunta para quem assiste =====
  else {
    jo.root.position.set(0.3, 0.86, -0.4);
    const pt = seg(t, 47.6, 48.0);
    jo.pose({ breathe: jb, armR: [lerp(0.2, 1.4, pt), 0.05, 0.1], armL: [0.2, 0.1, 0.3], head: [0, 0, 0.08 * Math.sin(t * 1.5)] });
    jo.face({ open: blink(t), mouth: 'smile', brow: 0.5, look: [0, 0] });
    camPos = mix3([0.3, 2.2, 4.6], [0.3, 2.15, 3.3], sm((t - 44.9) / 6)); camLook = [0.3, 1.9, -0.4];
    ov.cta = seg(t, 46.6, 47.0); ov.follow = seg(t, 48.9, 49.3);
  }

  // anéis do poder
  if (power > 0.01) {
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v);
    rings.forEach((r, i) => { const ph = ((t * (0.8 + power * 0.5) + i / 3) % 1); r.position.copy(v); r.position.y += 0.62; r.rotation.set(Math.PI / 2, 0, 0); r.scale.setScalar(0.8 + ph * 1.4); r.material.opacity = 0.7 * (1 - ph) * Math.min(1, power); });
  }
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);
  pool.forEach((d, i) => { if (i >= used) d.style.opacity = 0; });

  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  $('title').style.opacity = ov.title ? 1 : 0;
  $('count').textContent = ov.countTxt || ''; pop('count', ov.count || 0, '');
  pop('ask', ov.ask || 0); pop('cta', ov.cta || 0); pop('follow', ov.follow || 0);
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  $('cap').textContent = c ? c.s : ''; $('cap').style.opacity = c ? 1 : 0;
};
