// "E se o seu eu do futuro aparecesse no seu quarto?" — episódio 1 da série E se? (3D)
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, place, cam, ampAt, noise
} from '../../_lib/mundo3d.js';

const jo = makeChar();
const fu = makeChar({ old: true, hood: '#5f6852', hood2: '#535b48', hair: '#e9e6df', shoe: '#8a8f99', sole: '#3d405b' });

// celular
const phone = grp(scene);
mesh(rbox(0.22, 0.42, 0.04, 0.03), M('#20232b', { roughness: 0.3 }), phone);
const screenMat = new THREE.MeshStandardMaterial({ color: '#0b1a2a', emissive: '#4fc3ff', emissiveIntensity: 1.4 });
mesh(new THREE.PlaneGeometry(0.19, 0.37), screenMat, phone, [0, 0, 0.022]);
const phoneLight = new THREE.PointLight('#4fc3ff', 0, 3, 2); scene.add(phoneLight);
// redemoinho / portal
const swirl = [];
for (let i = 0; i < 28; i++) swirl.push(mesh(sph(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: ['#7fdcff', '#c77dff', '#ffffff'][i % 3] }), scene));
const flashBall = mesh(sph(1, 32, 20), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0 }), scene);
const portalLight = new THREE.PointLight('#b388ff', 0, 7, 1.5); scene.add(portalLight);
// estrelinhas da queda
const dizzy = [];
for (let i = 0; i < 5; i++) dizzy.push(mesh(new THREE.OctahedronGeometry(0.07), new THREE.MeshBasicMaterial({ color: '#ffd54a' }), scene));
// painel holográfico
const hc = document.createElement('canvas'); hc.width = 1024; hc.height = 640;
const hx = hc.getContext('2d');
const holoTex = new THREE.CanvasTexture(hc); holoTex.colorSpace = THREE.SRGBColorSpace;
const holo = mesh(new THREE.PlaneGeometry(2.4, 1.5), new THREE.MeshBasicMaterial({ map: holoTex, transparent: true, side: THREE.DoubleSide, toneMapped: false }), scene, [1.2, 1.95, -0.2]);
holo.castShadow = false;
const holoLight = new THREE.PointLight('#7fdcff', 0, 5, 2); scene.add(holoLight);

function rr(x, y, w, h, r) { hx.beginPath(); hx.roundRect(x, y, w, h, r); }
function drawHolo(mode, k, t) {
  hx.clearRect(0, 0, 1024, 640);
  hx.fillStyle = 'rgba(20,60,110,0.72)'; rr(8, 8, 1008, 624, 46); hx.fill();
  hx.lineWidth = 10; hx.strokeStyle = '#7fdcff'; rr(8, 8, 1008, 624, 46); hx.stroke();
  for (let y = 20; y < 630; y += 14) { hx.fillStyle = `rgba(127,220,255,${0.05 + 0.03 * Math.sin(y + t * 20)})`; hx.fillRect(14, y, 996, 3); }
  hx.textAlign = 'center'; hx.textBaseline = 'middle';
  const txt = (s, x, y, size, col) => { hx.font = `700 ${size}px Kalam`; hx.lineWidth = size * 0.12; hx.strokeStyle = '#0a1630'; hx.strokeText(s, x, y); hx.fillStyle = col; hx.fillText(s, x, y); };
  if (mode === 'noite') {
    if (k < 0.5) {
      hx.fillStyle = '#fff6cf'; hx.beginPath(); hx.arc(210, 260, 90, 0, Math.PI * 2); hx.fill();
      hx.fillStyle = 'rgba(20,60,110,1)'; hx.beginPath(); hx.arc(250, 225, 80, 0, Math.PI * 2); hx.fill();
      hx.fillStyle = '#20232b'; rr(400, 140, 130, 240, 22); hx.fill(); hx.fillStyle = '#4fc3ff'; rr(412, 155, 106, 210, 12); hx.fill();
      txt('02:47', 770, 260, 190, '#ffffff');
      txt('"só mais um vídeo"', 512, 500, 92, '#7fdcff');
    } else {
      const sh = Math.sin(t * 60) * 10;
      hx.fillStyle = '#ff5a5a'; hx.beginPath(); hx.arc(230 + sh, 270, 120, 0, Math.PI * 2); hx.fill();
      hx.fillStyle = '#ffffff'; hx.beginPath(); hx.arc(230 + sh, 270, 95, 0, Math.PI * 2); hx.fill();
      hx.strokeStyle = '#222'; hx.lineWidth = 14; hx.beginPath(); hx.moveTo(230 + sh, 270); hx.lineTo(230 + sh, 200); hx.moveTo(230 + sh, 270); hx.lineTo(285 + sh, 290); hx.stroke();
      txt('08:47', 690, 250, 200, '#ff6b6b');
      txt('ATRASADO DE NOVO!', 512, 500, 100, '#ffd54a');
    }
  } else if (mode === 'anos') {
    const yr = 2026 + Math.floor(k * 10);
    txt(String(yr), 512, 210, 250, '#ffffff');
    const n = Math.floor(k * 3650);
    txt('"EU COMEÇO AMANHÃ"', 512, 410, 86, '#ffd54a');
    txt('x ' + n.toLocaleString('pt-BR'), 512, 525, 96, '#ff6b6b');
  }
  holoTex.needsUpdate = true;
}

// ---------- overlays ----------
const $ = id => document.getElementById(id);
let TL = null;
const S = i => TL.lines.find(l => l.id === i).start, E = i => TL.lines.find(l => l.id === i).end;
// legendas em pedaços (frases), com tempo proporcional ao texto
let caps = null;
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

const BED = [-3.2, 1.0, -3.0];
const v = new THREE.Vector3(), v2 = new THREE.Vector3();
const facing = (from, to) => Math.atan2(to[0] - from[0], to[2] - from[2]);

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t);
  // ---- estado padrão ----
  setDay(0);
  quarto.blanket.visible = true;
  jo.legs.forEach(l => l.visible = true); fu.legs.forEach(l => l.visible = true);
  jo.root.position.set(...BED); jo.root.rotation.set(0, 0, 0);
  fu.root.visible = false; fu.root.rotation.set(0, 0, 0); fu.root.scale.set(1, 1, 1);
  swirl.forEach(s => s.visible = false); flashBall.visible = false; portalLight.intensity = 0;
  dizzy.forEach(d => d.visible = false); holo.visible = false; holoLight.intensity = 0;
  phone.visible = true; phoneLight.intensity = 0; screenMat.emissiveIntensity = 1.4;
  let ov = {}, shake = 0, phoneMode = 'hands', camPos, camLook;
  const jb = breath(t), fb = breath(t, 1.3);
  const joTalk = (t > 37.17 && t < 37.95) ? amp : -1;
  const fuTalk = ((t > 19.41 && t < 22.64) || (t > 39.9 && t < 43.96)) ? amp : -1;

  // ---------- A: quarto à noite, Joseph no celular ----------
  if (t < 12.1) {
    jo.legs.forEach(l => l.visible = false);
    const scroll = Math.sin(t * 9) * 0.06 * (t < 9.6 ? 1 : 0);
    const look = seg(t, 9.6, 10.3);
    jo.root.rotation.y = 0.5 * look;
    jo.pose({ armL: [0.95, -0.28, 1.05 + scroll], armR: [0.95, -0.28, 1.05 - scroll], head: [lerp(0.35, -0.05, look), lerp(0.08 * Math.sin(t * 0.7), 0.4, look), 0], breathe: jb });
    const laugh = t > 7.2 && t < 8.2 ? Math.abs(Math.sin(t * 18)) * 0.05 : 0;
    jo.root.position.y = BED[1] + laugh;
    jo.face({ open: lerp(blink(t), 1.25, look), mouth: look > 0.5 ? 'o' : (laugh ? 'smile' : 'flat'), brow: look * 1, look: [lerp(0, 0.9, look), lerp(-0.8, 0.1, look)] });
    phoneLight.intensity = 2.5;
    // redemoinho
    const sw = seg(t, 9.4, 11.9);
    if (sw > 0) swirl.forEach((s, i) => {
      const a = i / 28 * Math.PI * 2 + t * (3 + sw * 4), r = 0.2 + 0.7 * sw * (0.6 + 0.4 * Math.sin(i * 1.7));
      s.visible = true; s.position.set(-0.4 + Math.cos(a) * r, 1.4 + Math.sin(i * 2.3 + t * 2) * 0.6 * sw, -0.8 + Math.sin(a) * r * 0.5); s.scale.setScalar(0.6 + sw);
    });
    portalLight.position.set(-0.4, 1.5, -0.8); portalLight.intensity = 8 * sw;
    if (t < 5.6) { camPos = mix3([1.8, 2.6, 3.6], [0.2, 2.1, 1.2], sm(t / 5.6)); camLook = [-2.9, 1.6, -2.9]; ov.title = t > 0.3 && t < 4.6; }
    else if (t < 9.4) { camPos = mix3([-2.55, 2.05, -1.6], [-2.65, 2.1, -1.85], sm((t - 5.6) / 3.8)); camLook = [-3.2, 2.0, -3.0]; ov.clock = true; }
    else { camPos = mix3([1.4, 2.2, 2.6], [1.0, 2.0, 2.0], sm((t - 9.4) / 2.7)); camLook = [-1.6, 1.5, -1.8]; }
  }
  // ---------- D: PUM! chega o eu do futuro ----------
  else if (t < 18.3) {
    jo.legs.forEach(l => l.visible = false);
    const FP = [-0.4, 0.86, -0.8];
    fu.root.visible = true;
    const land = lin(t, 12.15, 12.9);
    const sq = t < 12.9 ? [lerp(1.35, 0.9, back(land)), lerp(0.55, 1.08, back(land)), lerp(1.35, 0.9, back(land))] : [1, 1 + 0.03 * Math.sin((t - 12.9) * 12) * Math.exp(-(t - 12.9) * 3), 1];
    fu.root.position.set(FP[0], FP[1] * sq[1], FP[2]); fu.root.rotation.y = lerp(0.3, -0.25, seg(t, 13, 14));
    const tired = seg(t, 16.6, 17.2), backRub = seg(t, 14.3, 14.8) * (1 - seg(t, 15.4, 15.9)), beard = seg(t, 15.5, 15.9) * (1 - seg(t, 16.4, 16.8));
    fu.pose({ scl: sq, lean: 0.12 + 0.12 * tired, breathe: fb + 0.03 * tired * Math.sin(t * 2),
      armR: [lerp(0.1, -0.5, backRub), lerp(0.1, 0.2, backRub), lerp(0.2, 1.6, backRub)],
      armL: [lerp(0.15, 1.1, beard), lerp(0.1, -0.35, beard), lerp(0.2, 2.1, beard)], head: [0.05 + 0.15 * tired, -0.15 * Math.sin(t * 0.8), 0.06 * Math.sin(t * 1.3)] });
    fu.face({ open: (t < 13.2 ? 1.2 : lerp(0.75, 0.45, tired)) * blink(t, 1), mouth: tired > 0.5 ? 'flat' : (t < 13.2 ? 'o' : 'smile'), brow: lerp(0.3, -0.3, tired), browTilt: -0.25 * tired, look: [-0.6, 0] });
    // flash
    const fl = lin(t, 12.1, 12.6);
    flashBall.visible = fl > 0 && fl < 1; flashBall.position.set(FP[0], 1.5, FP[2]); flashBall.scale.setScalar(0.3 + 3 * fl); flashBall.material.opacity = 0.9 * (1 - fl);
    portalLight.position.set(FP[0], 1.6, FP[2]); portalLight.intensity = 14 * (1 - lin(t, 12.1, 13.2));
    ov.flash = 1 - lin(t, 12.1, 12.45);
    shake = 0.12 * (1 - lin(t, 12.1, 12.9));
    // Joseph pula na cama
    const jump = Math.max(0, Math.sin(lin(t, 12.15, 12.75) * Math.PI)) * 0.55;
    jo.root.position.y = BED[1] + jump; jo.root.rotation.y = 0.45;
    jo.pose({ armL: [lerp(0.95, 2.4, jump * 1.8), 0.6 * jump * 1.8, 0.3], armR: [lerp(0.95, 2.4, jump * 1.8), 0.6 * jump * 1.8, 0.3], head: [-0.1, 0.35, 0], breathe: jb });
    jo.face({ open: 1.3, mouth: 'o', brow: 1.2, look: [0.8, 0] });
    if (t < 14.2) { camPos = [1.8, 2.0, 3.4]; camLook = [-1.4, 1.5, -1.6]; }
    else { const k = sm((t - 14.2) / 4.1); const a = lerp(-0.5, 0.35, k); camPos = [FP[0] + Math.sin(a) * 2.6, 2.05, FP[2] + Math.cos(a) * 2.6]; camLook = [FP[0], 1.95, FP[2]]; }
    ov.label = t > 15.5 && t < 18.2 ? (t < 16.6 ? 'BARBA BRANCA' : 'CANSADO...') : '';
  }
  // ---------- F: ele anda até a cama e fala ----------
  else if (t < 22.85) {
    jo.legs.forEach(l => l.visible = false);
    fu.root.visible = true;
    const k = lin(t, 18.3, 19.6), P0 = [-0.4, 0.86, -0.8], P1 = [-0.9, 0.86, -2.3];
    const w = walkPose(k * 4, k < 1 ? 1 : 0);
    fu.root.position.set(lerp(P0[0], P1[0], sm(k)), 0.86 + w.bob, lerp(P0[2], P1[2], sm(k)));
    fu.root.rotation.y = facing(P1, BED) + 0.15;
    const meP = seg(t, 19.4, 19.7) * (1 - seg(t, 20.5, 20.8)), youP = seg(t, 20.8, 21.1);
    fu.pose({ leg: w.leg, lean: 0.12, breathe: fb,
      armL: k < 1 ? w.armL : [lerp(0.2, 1.0, meP), lerp(0.1, -0.6, meP), lerp(0.2, 2.0, meP)],
      armR: k < 1 ? w.armR : [lerp(0.2, 1.5, youP), 0.05, lerp(0.2, 0.1, youP)],
      head: [0.08 + 0.06 * Math.sin(t * 5) * (fuTalk > 0 ? 1 : 0), 0, 0] });
    fu.face({ open: 0.75 * blink(t, 1), mouth: 'smile', talk: fuTalk, brow: 0.2, look: [0, 0.2] });
    jo.root.rotation.y = 0.75;
    const shock = seg(t, 21.4, 21.8);
    jo.pose({ armL: [0.9, -0.2, 1.1], armR: [0.9, -0.2, 1.1], lean: -0.15 * shock, head: [-0.1 - 0.15 * shock, 0, 0], breathe: jb });
    jo.face({ open: lerp(1.1, 1.4, shock) * blink(t), mouth: 'o', brow: lerp(0.6, 1.3, shock), look: [0.5, 0.2] });
    camPos = mix3([-4.5, 1.95, 1.2], [-4.2, 1.9, 0.7], sm((t - 18.3) / 4.5)); camLook = [-2.0, 1.65, -2.4];
    ov.plus = seg(t, 21.4, 21.7);
  }
  // ---------- G: o Joseph cai da cama ----------
  else if (t < 25.4) {
    fu.root.visible = true; fu.root.position.set(-0.9, 0.86, -2.3); fu.root.rotation.y = facing([-0.9, 0, -2.3], [-2.3, 0, -1.9]);
    fu.pose({ lean: 0.12, breathe: fb, armL: [0.6, 0.1, 0.4], armR: [0.6, 0.1, 0.4] });
    fu.face({ open: 1.1 * blink(t, 1), mouth: 'o', brow: 0.9, look: [0, -0.5] });
    const f = lin(t, 23.25, 24.0), landed = t > 24.0;
    const ST = [-2.35, 0.34, -1.95];
    if (!landed) {
      jo.legs.forEach(l => l.visible = f > 0.3);
      jo.root.position.set(lerp(BED[0], ST[0], f), lerp(BED[1], ST[1], f) + Math.sin(f * Math.PI) * 0.6, lerp(BED[2], ST[2], f));
      jo.root.rotation.set(0, 0.75, -f * 2.2 + (f > 0.8 ? (f - 0.8) * 11 : 0));
      jo.pose({ armL: [2.2, 0.8, 0.2], armR: [2.2, 0.8, 0.2], leg: [1.2 * f, 0.6 * f], breathe: 0 });
      jo.face({ open: 1.3, mouth: 'o', brow: 1.3 });
    } else {
      const sq = bounce(lin(t, 24.0, 24.7));
      jo.root.position.set(...ST); jo.root.rotation.set(0, 0.75, 0);
      jo.pose({ scl: [1 + sq * 0.25, 1 - sq * 0.3, 1 + sq * 0.25], leg: [1.5, 1.4], armL: [-0.3, 0.5, 0.2], armR: [-0.3, 0.5, 0.2], head: [0, 0, 0.15 * Math.sin(t * 6)], breathe: jb });
      jo.face({ open: 0.6, mouth: 'flat', brow: -0.3, browTilt: 0.3, look: [Math.sin(t * 8), Math.cos(t * 8)] });
      dizzy.forEach((d, i) => { const a = t * 5 + i / 5 * Math.PI * 2; d.visible = true; d.position.set(ST[0] + Math.cos(a) * 0.45, ST[1] + 1.75 + Math.sin(a * 2) * 0.05, ST[2] + Math.sin(a) * 0.45); d.rotation.y = t * 4; });
    }
    shake = 0.08 * (t > 24.0 ? 1 - lin(t, 24.0, 24.4) : 0);
    // celular voa e cai na cama
    phoneMode = 'free';
    const pf = lin(t, 23.3, 24.2);
    phone.position.set(lerp(-2.95, -3.2, pf), lerp(1.7, 1.03, pf) + Math.sin(pf * Math.PI) * 0.9, lerp(-2.5, -2.2, pf));
    phone.rotation.set(lerp(0, -Math.PI / 2 - Math.PI * 4, pf), pf * 3, 0);
    camPos = mix3([0.6, 1.3, 1.9], [0.4, 1.2, 1.5], sm((t - 22.85) / 2.5)); camLook = [-2.2, 1.0, -2.1];
  }
  // ---------- H/I: o painel do futuro ----------
  else if (t < 35.2) {
    fu.root.visible = true;
    const FP = [-0.9, 0.86, -2.3];
    fu.root.position.set(...FP);
    const turn = seg(t, 25.5, 26.2);
    fu.root.rotation.y = lerp(facing([-0.9, 0, -2.3], [-2.3, 0, -1.9]), 0.75, turn);
    const raise = seg(t, 26.3, 26.9);
    const shakeNo = t > 33.0 && t < 34.6 ? Math.sin(t * 9) * 0.35 : 0;
    fu.pose({ lean: 0.12, breathe: fb, armR: [lerp(0.1, 1.6, raise), lerp(0.1, 0.5, raise), 0.3 + 0.1 * Math.sin(t * 3)], armL: [0.2, 0.1, 0.3], head: [0.05, -0.4 * raise + shakeNo, 0] });
    fu.face({ open: 0.6 * blink(t, 1), mouth: t > 31.4 ? 'sad' : 'flat', brow: -0.1, browTilt: t > 31.4 ? -0.3 : 0, look: [0.8, 0.2] });
    const ST = [-2.35, 0.34, -1.95];
    const up = seg(t, 33.0, 33.8);
    jo.root.position.set(ST[0] + up * 0.3, lerp(ST[1], 0.86, up) + Math.sin(up * Math.PI) * 0.15, ST[2] + up * 0.3);
    jo.root.rotation.y = lerp(1.2, 0.9, up);
    jo.pose({ leg: [lerp(1.5, 0, up), lerp(1.4, 0, up)], armL: [lerp(-0.3, 0.2, up), 0.4, 0.2], armR: [lerp(-0.3, 0.2, up), 0.4, 0.2], head: [-0.15, 0, 0], breathe: jb });
    jo.face({ open: 1.1 * blink(t), mouth: t > 29.6 ? 'sad' : 'o', brow: 0.6, browTilt: t > 31.4 ? -0.35 : 0, look: [0.4, 0.5] });
    phoneMode = 'bed';
    holo.visible = t > 26.6;
    const hs = back(lin(t, 26.6, 27.2));
    holo.scale.set(hs, hs, 1); holo.position.y = 1.95 + 0.04 * Math.sin(t * 2);
    holo.lookAt(t < 31.3 ? new THREE.Vector3(-3.4, 1.6, 1.4) : new THREE.Vector3(0.0, 1.9, 4.2));
    holoLight.position.set(1.0, 1.9, 0.3); holoLight.intensity = 4 * hs;
    if (t < 31.3) drawHolo('noite', lin(t, 29.5, 29.6), t); else drawHolo('anos', lin(t, 31.7, 34.5), t);
    if (t < 31.3) { camPos = mix3([-3.7, 1.6, 1.7], [-3.3, 1.55, 1.2], sm((t - 25.4) / 5.9)); camLook = [0.5, 1.75, -0.7]; }
    else { camPos = mix3([0.0, 1.9, 4.4], [0.0, 1.9, 3.8], sm((t - 31.3) / 3.9)); camLook = [0.0, 1.6, -0.9]; }
  }
  // ---------- J/K/L: a conversa ----------
  else if (t < 44.4) {
    fu.root.visible = true;
    const JP = [-0.75, 0.86, -0.4], FP = [0.8, 0.86, -0.4];
    jo.root.position.set(...JP); jo.root.rotation.y = 1.35;
    fu.root.position.set(...FP); fu.root.rotation.y = -1.25;
    const ask = seg(t, 37.0, 37.3) * (1 - seg(t, 38.3, 38.7));
    jo.pose({ breathe: jb, armL: [lerp(0.2, 0.8, ask), lerp(0.1, 0.6, ask), lerp(0.2, 1.2, ask)], armR: [lerp(0.2, 0.8, ask), lerp(0.1, 0.6, ask), lerp(0.2, 1.2, ask)], head: [-0.08, 0, 0.1 * ask] });
    jo.face({ open: 1.05 * blink(t), mouth: t > 42.2 ? 'smile' : 'flat', talk: joTalk, brow: lerp(0.4, 0.9, ask), browTilt: -0.2 * ask, look: [0.3, 0.3] });
    const smile = seg(t, 38.6, 39.0), hand = seg(t, 40.6, 41.1), ten = seg(t, 42.1, 42.4);
    fu.pose({ lean: 0.1, breathe: fb, armR: [lerp(0.15, 1.35, hand), lerp(0.1, -0.15, hand), lerp(0.2, 0.25, hand)], armL: [lerp(0.15, 1.9, ten), lerp(0.1, 0.4, ten), lerp(0.2, 1.4, ten)], head: [0.06 + (fuTalk > 0 ? 0.05 * Math.sin(t * 6) : 0), 0, 0.08 * smile] });
    fu.face({ open: lerp(0.65, 0.95, smile) * blink(t, 1), mouth: smile > 0.5 ? 'smile' : 'flat', talk: fuTalk, brow: 0.3 * smile, look: [-0.3, 0.2] });
    phoneMode = 'bed';
    if (t < 38.6) { camPos = mix3([0.0, 1.8, 3.6], [0.0, 1.8, 3.2], sm((t - 35.2) / 3.4)); camLook = [0.0, 1.6, -0.4]; }
    else if (t < 42.0) { camPos = mix3([-0.55, 2.05, 1.25], [-0.45, 2.05, 1.05], sm((t - 38.6) / 3.4)); camLook = [0.8, 2.0, -0.4]; }
    else { camPos = mix3([0.0, 1.85, 3.3], [0.0, 1.85, 3.0], sm((t - 42) / 2.4)); camLook = [0.0, 1.7, -0.4]; ov.ten = seg(t, 42.15, 42.5); }
  }
  // ---------- M/N: ele some; o celular aceso; desliga ----------
  else if (t < 49.9) {
    const JP = [-0.75, 0.86, -0.4], FP = [0.8, 0.86, -0.4];
    const gone = lin(t, 44.6, 45.4);
    fu.root.visible = gone < 1;
    fu.root.position.set(FP[0], 0.86 + gone * 0.6, FP[2]); fu.root.rotation.y = -1.25 + gone * 12; fu.root.scale.setScalar(1 - sm(gone));
    fu.pose({ scl: [1 - sm(gone), 1 - sm(gone), 1 - sm(gone)], lean: 0.1, armL: [0.3, 1.6 + Math.sin(t * 14) * 0.3, 0.6], armR: [0.2, 0.1, 0.2] });
    fu.face({ mouth: 'smile', open: 0.9 });
    if (gone > 0 && gone < 1) swirl.forEach((s, i) => { const a = i / 28 * Math.PI * 2 + t * 6; s.visible = true; s.position.set(FP[0] + Math.cos(a) * 0.6 * gone, 1.2 + i / 28 * 1.4 + gone, FP[2] + Math.sin(a) * 0.6 * gone); s.scale.setScalar(1.4 * (1 - gone)); });
    portalLight.position.set(FP[0], 1.6, FP[2]); portalLight.intensity = 8 * Math.sin(gone * Math.PI);
    const k = lin(t, 47.5, 48.4), P1 = [-2.25, 0.86, -1.75];
    const w = walkPose(k * 4, k > 0 && k < 1 ? 1 : 0);
    const off = seg(t, 48.6, 48.8);
    jo.root.position.set(lerp(JP[0], P1[0], sm(k)), 0.86 + w.bob, lerp(JP[2], P1[2], sm(k)));
    jo.root.rotation.y = t < 47.4 ? lerp(1.35, 0.5, seg(t, 44.6, 45.2)) : facing(P1, [-3.2, 0, -2.2]);
    const reach = seg(t, 48.3, 48.6) * (1 - seg(t, 49.0, 49.4));
    jo.pose({ breathe: jb, leg: w.leg, armL: w.armL, armR: k < 1 ? w.armR : [lerp(0.2, 1.3, reach), 0, 0.2], lean: 0.3 * reach, head: [0.3 * reach + 0.1 * (t > 45.4 && t < 47.4 ? 1 : 0), 0, 0] });
    jo.face({ open: blink(t), mouth: off > 0.5 ? 'smile' : 'flat', brow: 0.3, look: [0, -0.5] });
    phoneMode = 'bed'; screenMat.emissiveIntensity = 1.4 * (1 - off);
    phoneLight.position.set(-3.2, 1.3, -2.2); phoneLight.intensity = 2.5 * (1 - off) * (1 + 0.3 * Math.sin(t * 20) * (t > 46 && t < 47.4 ? 1 : 0));
    if (t < 45.5) { camPos = [0.0, 1.85, 3.0]; camLook = [0.0, 1.7, -0.4]; }
    else if (t < 47.5) { camPos = mix3([-2.75, 1.55, -1.45], [-2.85, 1.45, -1.65], sm((t - 45.5) / 2)); camLook = [-3.2, 1.03, -2.2]; }
    else { camPos = mix3([-4.7, 2.0, 0.6], [-4.4, 1.9, 0.1], sm((t - 47.5) / 2.4)); camLook = [-2.6, 1.3, -2.0]; }
    ov.flash = t > 44.6 && t < 45.4 ? 0.25 * Math.sin(gone * Math.PI) : 0;
  }
  // ---------- O: dorme... e o futuro volta? ----------
  else {
    jo.legs.forEach(l => l.visible = false);
    jo.root.position.set(-3.2, 1.0, -2.55); jo.root.rotation.set(-Math.PI / 2 + 0.15, 0, 0);
    jo.pose({ breathe: breath(t) * 2.5, armL: [0.1, 0.05, 0.1], armR: [0.1, 0.05, 0.1] });
    jo.face({ open: 0.08, mouth: 'smile' });
    phoneMode = 'bed'; screenMat.emissiveIntensity = 0;
    const sw = seg(t, 50.8, 52.8) * (1 - seg(t, 56.2, 57));
    swirl.forEach((s, i) => { const a = i / 28 * Math.PI * 2 + t * 5; s.visible = sw > 0; s.position.set(0.5 + Math.cos(a) * 0.4 * sw, 2.3 + Math.sin(a) * 0.4 * sw, -3.7); s.scale.setScalar(0.5 + 0.6 * sw); });
    portalLight.position.set(0.5, 2.3, -3.3); portalLight.intensity = 6 * sw * (0.8 + 0.2 * Math.sin(t * 20));
    camPos = mix3([-1.3, 2.4, 0.6], [0.6, 2.6, 2.8], sm((t - 49.9) / 6)); camLook = [-1.4, 1.5, -2.8];
    ov.zzz = t < 53.4; ov.q = sw > 0.3 && t < 53.3; ov.ep = seg(t, 53.4, 53.8); ov.follow = seg(t, 53.7, 54.1);
  }

  // celular
  if (phoneMode === 'hands') {
    scene.updateMatrixWorld(true);
    jo.handL.getWorldPosition(v); jo.handR.getWorldPosition(v2); v.add(v2).multiplyScalar(0.5); v.y += 0.12;
    phone.position.copy(v); jo.head.getWorldPosition(v2); phone.lookAt(v2);
    phoneLight.position.copy(v).lerp(v2, 0.5);
  } else if (phoneMode === 'bed') {
    phone.position.set(-3.2, 1.03, -2.2); phone.rotation.set(-Math.PI / 2, 0, 0.3);
  }
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  // ---------- overlays ----------
  const show = (id, on, sc) => { const e = $(id); e.style.opacity = on ? Math.min(1, on) : 0; if (sc !== undefined) e.style.transform = `translateX(-50%) scale(${sc})`; };
  show('title', ov.title);
  show('clock', ov.clock);
  $('flash').style.opacity = ov.flash || 0;
  const lab = $('label'); lab.textContent = ov.label || ''; lab.style.opacity = ov.label ? 1 : 0;
  show('plus', ov.plus, 0.5 + 0.5 * back(ov.plus || 0));
  show('ten', ov.ten, 0.5 + 0.5 * back(ov.ten || 0));
  show('ep', ov.ep, 0.6 + 0.4 * back(ov.ep || 0));
  show('follow', ov.follow, 0.6 + 0.4 * back(ov.follow || 0));
  place($('zzz'), [-3.0, 2.0, -2.9], ov.zzz, 1 + 0.08 * Math.sin(t * 4));
  place($('q'), [0.5, 3.0, -3.6], ov.q, 1 + 0.06 * Math.sin(t * 5));
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  $('cap').textContent = c ? c.s : ''; $('cap').style.opacity = c ? 1 : 0;
};
