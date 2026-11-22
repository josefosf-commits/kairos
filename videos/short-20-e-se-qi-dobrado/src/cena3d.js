// SHORT "E se o seu QI dobrasse todo dia?" — série E se? (3D, vertical)
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, place, cam, ampAt
} from '../../_lib/mundo3d.js';

const jo = makeChar();
const J = jo.root;
// óculos (aparecem no dia 2)
const glasses = grp(jo.head);
{ const gl = M('#1b1b1b', { roughness: 0.3 }); for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), gl, glasses, [s * 0.15, 0.06, 0.42]); mesh(cap(0.012, 0.08), gl, glasses, [0, 0.07, 0.44], [0, 0, Math.PI / 2]); }
// lápis
const pencil = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8), M('#ffd166'), jo.handR, [0, -0.05, 0.08], [1.2, 0, 0]);
// amigo
const ami = makeChar({ skin: '#e0ac69', hood: '#2a6f97', hood2: '#235d7e', hair: '#5a3825', sole: '#2a6f97' });
mesh(new THREE.SphereGeometry(0.46, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45), M('#e63946'), ami.head, [0, 0.04, 0], [-0.15, 0, 0]);
mesh(rbox(0.5, 0.04, 0.35, 0.02), M('#e63946'), ami.head, [0, 0.2, 0.5], [0.1, 0, 0]);

// caderno + folhas voando
const notebook = mesh(rbox(0.5, 0.03, 0.36, 0.01), M('#f8f9fa'), quarto.desk, [0.0, 1.07, 0.1]);
const pages = []; for (let i = 0; i < 9; i++) pages.push(mesh(new THREE.BoxGeometry(0.34, 0.005, 0.46), M('#ffffff'), scene));

// cubo mágico (texturas: embaralhado / resolvido)
const FACE = ['#e63946', '#ff9f1c', '#ffffff', '#ffd60a', '#2a9d8f', '#3a86ff'];
function faceTex(colorFn) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#111'; x.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 9; i++) { x.fillStyle = colorFn(i); x.beginPath(); x.roundRect(6 + (i % 3) * 40, 6 + Math.floor(i / 3) * 40, 36, 36, 6); x.fill(); }
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx;
}
let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const mixed = FACE.map(() => new THREE.MeshStandardMaterial({ map: faceTex(() => FACE[Math.floor(rnd() * 6)]), roughness: 0.4 }));
const solved = FACE.map(f => new THREE.MeshStandardMaterial({ map: faceTex(() => f), roughness: 0.4 }));
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), mixed); cube.castShadow = true; scene.add(cube);

// robô
const robot = grp(scene, [1.45, 0, -1.2]);
const steel = M('#9aa5b1', { metalness: 0.5, roughness: 0.35 }), steelD = M('#5c6b7a', { metalness: 0.5, roughness: 0.4 });
const eyeMat = new THREE.MeshStandardMaterial({ color: '#222', emissive: '#00e5ff', emissiveIntensity: 0 });
const parts = [
  { m: mesh(rbox(0.28, 0.7, 0.3, 0.05), steelD, robot), p: [-0.22, 0.35, 0] },
  { m: mesh(rbox(0.28, 0.7, 0.3, 0.05), steelD, robot), p: [0.22, 0.35, 0] },
  { m: mesh(rbox(0.85, 0.9, 0.6, 0.1), steel, robot), p: [0, 1.15, 0] },
  { m: mesh(cap(0.09, 0.55), steelD, robot), p: [-0.56, 1.1, 0] },
  { m: mesh(cap(0.09, 0.55), steelD, robot), p: [0.56, 1.1, 0] },
  { m: grp(robot), p: [0, 1.88, 0], head: true },
];
const rhead = parts[5].m;
mesh(rbox(0.62, 0.48, 0.5, 0.1), steel, rhead);
const reyes = [-1, 1].map(s => mesh(sph(0.07, 16, 12), eyeMat, rhead, [s * 0.14, 0.03, 0.26]));
mesh(cap(0.02, 0.2), steelD, rhead, [0, 0.36, 0]); const ant = mesh(sph(0.05, 12, 10), new THREE.MeshStandardMaterial({ color: '#ff4d6d', emissive: '#ff4d6d', emissiveIntensity: 0.4 }), rhead, [0, 0.5, 0]);
mesh(rbox(0.4, 0.25, 0.04, 0.03), M('#1d3557'), parts[2].m, [0, 0.1, 0.31]);
const leds = [0, 1, 2].map(i => mesh(sph(0.035, 10, 8), new THREE.MeshStandardMaterial({ color: '#111', emissive: ['#52d273', '#ffd60a', '#ff4d6d'][i], emissiveIntensity: 0 }), parts[2].m, [-0.1 + i * 0.1, 0.1, 0.34]));
const START = [[-3.2, 1.2, -2.6], [3.0, 1.2, -2.0], [-1.75, 1.0, -3.45], [-5.2, 1.0, -3.3], [3.4, 2.6, -3.8], [0.5, 2.3, -3.8]];
const eyeLight = new THREE.PointLight('#00e5ff', 0, 4, 2); scene.add(eyeLight);
const headLight = new THREE.PointLight('#ffcf5a', 0, 6, 1.5); scene.add(headLight);
const sparks = []; for (let i = 0; i < 16; i++) sparks.push(mesh(sph(0.04, 8, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffd54a' : '#7fdcff' }), scene));

// ---------- tempos / legendas ----------
let TL = null, caps = null;
function buildCaps() {
  caps = [];
  for (const l of TL.lines) {
    const parts_ = l.text.match(/[^.?!:]+[.?!:]+|[^.?!:]+$/g).map(s => s.trim()).filter(Boolean);
    const merged = [];
    for (const p of parts_) { if (merged.length && (merged[merged.length - 1].length + p.length < 30)) merged[merged.length - 1] += ' ' + p; else merged.push(p); }
    const tot = merged.reduce((a, s) => a + s.length, 0);
    let t0 = l.start;
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s }); t0 += d; }
  }
}
const $ = id => document.getElementById(id);
const v = new THREE.Vector3();
const DAYS = [[3.3, 1, 200], [10.1, 2, 400], [15.6, 3, 800], [20.9, 4, 1600], [27.4, 5, 3200], [34.2, 6, null]];
const FORM = ['E = mc²', '∫ x dx', 'π ≈ 3,14159', '√2', 'Σ n²', 'f(x) = ?', 'Δt → 0', 'a² + b² = c²', '∞', 'log₂ 1024 = 10', 'λ = h/p', '∂y/∂x'];
const formEls = [];
const fl = document.getElementById('forms');
for (let i = 0; i < FORM.length; i++) { const d = document.createElement('div'); d.className = 'form'; d.textContent = FORM[i]; fl.appendChild(d); formEls.push(d); }

function burst(t, t0, p) {
  const k = lin(t, t0, t0 + 0.7); if (k <= 0 || k >= 1) return;
  sparks.forEach((s, i) => { const a = i / 16 * Math.PI * 2; s.visible = true; s.position.set(p[0] + Math.cos(a) * 0.8 * k, p[1] + Math.sin(a * 2) * 0.5 * k + 0.3 * k, p[2] + Math.sin(a) * 0.8 * k); s.scale.setScalar(1.8 * (1 - k)); });
}

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  setDay(1); camera.fov = 50;
  J.position.set(0.3, 0.86, -0.4); J.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  ami.root.visible = false; cube.visible = false; pencil.visible = false; pages.forEach(p => p.visible = false);
  sparks.forEach(s => s.visible = false); headLight.intensity = 0; eyeLight.intensity = 0;
  jo.mats.skin.emissive.set('#000000'); jo.mats.skin.emissiveIntensity = 0;
  if (t < 0) { // ---- capa: cabeça gigante brilhando + raios de explosão atrás ----
    setDay(0.2); scene.background.set('#0b0820');
    J.position.set(0.3, 0.86, -0.2); J.rotation.y = 0; jo.head.scale.setScalar(1.55); glasses.visible = true;
    jo.pose({ armL: [1.75, 1.05, 2.35], armR: [1.75, 1.05, 2.35], head: [-0.12, 0, 0.06] });
    jo.face({ open: 1.45, mouth: 'o', brow: 1.4, look: [0, 0.15] });
    jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.12;
    parts.forEach(pt => pt.m.visible = false);
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v);
    headLight.position.set(v.x, v.y + 0.3, v.z + 1.4); headLight.color.set('#fff1d0'); headLight.intensity = 10;
    if (!window._rays) {
      const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d');
      for (let k = 0; k < 28; k++) { x.beginPath(); x.moveTo(512, 512); const a0 = k / 28 * Math.PI * 2, a1 = a0 + Math.PI / 28; x.arc(512, 512, 720, a0, a1); x.closePath(); x.fillStyle = k % 2 ? '#ff7b00' : '#ffd60a'; x.fill(); }
      const g = x.createRadialGradient(512, 512, 60, 512, 512, 512); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,240,180,.6)'); g.addColorStop(1, 'rgba(11,8,32,1)');
      x.globalCompositeOperation = 'source-over'; x.fillStyle = g; x.globalAlpha = 0.75; x.fillRect(0, 0, 1024, 1024);
      const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
      window._rays = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false }));
      scene.add(window._rays);
    }
    const CP = [0.3, 2.05, 3.5];
    window._rays.position.set(v.x, v.y - 0.1, v.z - 1.6); window._rays.lookAt(...CP);
    camera.fov = 50; camera.updateProjectionMatrix(); cam(CP, [0.3, 2.0, -0.2], 0, 0);
    renderer.render(scene, camera); return;
  }
  const day = DAYS.filter(d => t >= d[0]).pop();
  const dn = day ? day[1] : 0;
  jo.head.scale.setScalar(1 + [0, 0.06, 0.13, 0.2, 0.28, 0.38, 0.38][dn] + (day ? 0.06 * bounce(lin(t, day[0] + 0.4, day[0] + 1.1)) : 0));
  glasses.visible = dn >= 2;
  // robô: montado a partir do dia 3
  const build = dn < 3 ? 0 : (dn === 3 ? 1 : 2);
  parts.forEach((pt, i) => {
    let k = build === 2 ? 1 : (build === 1 ? sm(lin(t, 18.0 + i * 0.25, 18.7 + i * 0.25)) : 0);
    pt.m.visible = build > 0 || false;
    const s = START[i];
    pt.m.position.set(lerp(s[0] - 1.45, pt.p[0], k), lerp(s[1], pt.p[1], k) + Math.sin(k * Math.PI) * 0.8, lerp(s[2] + 1.2, pt.p[2], k));
    pt.m.rotation.set((1 - k) * 6 + i, (1 - k) * 4, 0);
  });
  rhead.rotation.y = 0; eyeMat.emissiveIntensity = 0; leds.forEach(l => l.material.emissiveIntensity = 0);
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0;

  if (t < 3.3) { // ---- abertura ----
    const pump = Math.abs(Math.sin(t * 3)) * 0.04;
    jo.head.scale.setScalar(1 + pump);
    jo.pose({ breathe: jb, armR: [1.45, -0.95, 2.25], armL: [0.25, 0.55, 1.2], head: [-0.1, 0.12, 0.1] });
    jo.face({ open: blink(t), mouth: 'flat', brow: 0.4, browTilt: 0.35, look: [0.5, 0.6] });
    camPos = mix3([0.3, 2.3, 3.4], [0.3, 2.15, 2.4], sm(t / 3.3)); camLook = [0.3, 1.95, -0.4];
    ov.title = t > 0.2;
  } else if (t < 10.1) { // ---- dia 1: lição de casa ----
    J.position.set(3.0, 1.15, -2.75); jo.legs.forEach(l => l.visible = false);
    const fast = t > 6.5 && t < 9.4;
    const wr = fast ? Math.sin(t * 60) * 0.12 : 0;
    pencil.visible = true;
    jo.pose({ breathe: jb, lean: 0.25, armR: [1.2, -0.2, 1.1 + wr], armL: [1.0, -0.2, 1.3], head: [0.35, fast ? Math.sin(t * 30) * 0.08 : 0, 0] });
    jo.face({ open: fast ? 1.2 : blink(t), mouth: fast ? 'flat' : 'smile', brow: fast ? -0.2 : 0.3, look: [0, -0.8] });
    if (fast || t > 9.4) pages.forEach((p, i) => { const k = lin(t, 6.6 + i * 0.3, 7.4 + i * 0.3); if (k <= 0) return; p.visible = true; p.position.set(lerp(3.0, 1.6 + (i % 3) * 0.1, k), lerp(1.12, 0.05 + i * 0.012, k) + Math.sin(k * Math.PI) * 0.9, lerp(-2.0, -1.0, k)); p.rotation.set(0, (1 - k) * 8 + i * 0.3, 0); });
    shake = fast ? 0.01 : 0;
    camPos = mix3([3.0, 2.15, 1.5], [3.0, 2.1, 1.0], sm((t - 3.3) / 6.8)); camLook = [3.0, 1.85, -2.4];
    ov.timer = seg(t, 9.0, 9.3); ov.timerTxt = '10 SEG';
  } else if (t < 15.6) { // ---- dia 2: cubo ----
    burst(t, 10.6, [0.3, 2.4, -0.4]);
    const done = t > 14.0;
    cube.visible = true; cube.material = done ? solved : mixed;
    scene.updateMatrixWorld(true);
    jo.pose({ breathe: jb, armL: [done ? 2.2 : 1.15, done ? 0.25 : -0.3, done ? 0.35 : 0.9], armR: [done ? 0.3 : 1.15, done ? 0.4 : -0.3, done ? 0.3 : 0.9], head: [0.1, 0, 0] });
    scene.updateMatrixWorld(true);
    if (done) { jo.handL.getWorldPosition(v); v.y += 0.24; } else { jo.handL.getWorldPosition(v); const w2 = new THREE.Vector3(); jo.handR.getWorldPosition(w2); v.add(w2).multiplyScalar(0.5); v.y += 0.12; v.z += 0.05; }
    cube.position.copy(v);
    cube.rotation.set(done ? 0.5 : t * 9, done ? 0.6 + t * 0.6 : t * 7, done ? 0 : t * 5);
    jo.face({ open: done ? blink(t) : 0.08, mouth: 'smile', brow: done ? 0.9 : 0.2, look: [0, 0.4] });
    shake = done ? 0 : 0.008;
    camPos = mix3([0.3, 2.05, 3.1], [0.3, 2.05, 2.7], sm((t - 10.1) / 5.5)); camLook = [0.3, 1.85, -0.4];
    ov.timer = seg(t, 14.0, 14.3); ov.timerTxt = 'RESOLVIDO!';
  } else if (t < 20.9) { // ---- dia 3: robô ----
    burst(t, 16.1, [0.3, 2.5, -0.4]);
    J.position.set(0.25, 0.86, -0.1); J.rotation.y = 0.75;
    const cond = t > 17.9 && t < 20.2 ? Math.sin(t * 8) : 0;
    jo.pose({ breathe: jb, armR: [1.3 + 0.3 * cond, 0.4, 0.3], armL: [1.3 - 0.3 * cond, 0.4, 0.3], head: [0, 0, 0.1 * cond] });
    jo.face({ open: blink(t), mouth: t > 20.0 ? 'smile' : 'flat', brow: 0.5, look: [0.6, 0.2] });
    if (t > 20.0) { leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 6 + i)) * 2); }
    shake = 0.04 * Math.max(0, 1 - Math.abs(t - 20.1) * 5);
    camPos = mix3([0.85, 2.1, 5.4], [0.85, 2.05, 4.9], sm((t - 15.6) / 5.3)); camLook = [0.85, 1.55, -0.6];
  } else if (t < 27.4) { // ---- dia 4: ninguém entende ----
    burst(t, 21.5, [0.3, 2.5, -0.4]);
    ami.root.visible = true; ami.root.position.set(-0.55, 0.86, 0.3); ami.root.rotation.y = 1.1;
    J.position.set(0.65, 0.86, -0.1); J.rotation.y = -1.0;
    const talk = t > 22.4 && t < 25.0;
    jo.pose({ breathe: jb, armR: [talk ? 1.2 + 0.4 * Math.sin(t * 7) : 0.3, 0.5, 0.6], armL: [talk ? 1.0 + 0.3 * Math.sin(t * 5 + 1) : 0.3, 0.6, 0.8], head: [0, 0, talk ? 0.08 * Math.sin(t * 6) : 0] });
    jo.face({ open: blink(t), mouth: talk && Math.sin(t * 14) > 0 ? 'o' : 'smile', brow: 0.6, look: [-0.4, 0.2] });
    const lost = seg(t, 25.4, 25.8);
    ami.pose({ breathe: breath(t, 1), armL: [0.2, 0.1, 0.3], armR: [0.2, 0.1, 0.3], head: [0, 0, 0.2 * lost] });
    ami.face({ open: lost > 0.5 ? 1.3 : blink(t, 1), mouth: lost > 0.5 ? 'o' : 'flat', brow: lost > 0.5 ? 1.1 : 0.2, look: lost > 0.5 ? [Math.cos(t * 9), Math.sin(t * 9)] : [0.3, 0] });
    ov.forms = talk || t > 25.0 ? seg(t, 22.4, 23.6) : 0;
    ov.qq = lost; scene.updateMatrixWorld(true); ami.head.getWorldPosition(v); ov.qqp = [v.x - 0.35, v.y + 0.55, v.z];
    camPos = mix3([0.05, 2.05, 5.0], [0.05, 2.0, 4.5], sm((t - 20.9) / 6.5)); camLook = [0.05, 1.75, 0.1];
  } else if (t < 34.2) { // ---- dia 5: cabeça brilhando, sem sono ----
    setDay(0);
    burst(t, 28.1, [-3.2, 2.2, -2.6]);
    jo.legs.forEach(l => l.visible = false);
    J.position.set(-3.2, 1.0, -2.55); J.rotation.set(-Math.PI / 2 + 0.15, 0, 0);
    jo.pose({ breathe: jb, armL: [0.1, 0.05, 0.1], armR: [0.1, 0.05, 0.1] });
    const glow = seg(t, 29.2, 30.6);
    jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.55 * glow * (0.85 + 0.15 * Math.sin(t * 5));
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v); headLight.position.copy(v); headLight.position.y += 0.4; headLight.intensity = 14 * glow;
    jo.face({ open: 1.3, mouth: 'flat', brow: 0.2, look: [Math.sin(t * 0.8) * 0.6, 0.3] });
    camPos = mix3([-1.6, 3.0, 0.4], [-1.9, 2.8, -0.2], sm((t - 27.4) / 6.8)); camLook = [-3.2, 1.4, -2.6];
    ov.nosleep = seg(t, 31.2, 31.5);
  } else { // ---- dia 6: o robô acorda ----
    setDay(0);
    jo.legs.forEach(l => l.visible = false);
    J.position.set(-3.2, 1.0, -2.55); J.rotation.set(-Math.PI / 2 + 0.15, 0, 0);
    jo.pose({ breathe: breath(t) * 2.5, armL: [0.1, 0.05, 0.1], armR: [0.1, 0.05, 0.1] });
    jo.face({ open: 0.08, mouth: 'smile' });
    const eyes = seg(t, 35.8, 36.2) * (0.85 + 0.15 * Math.sin(t * 7));
    eyeMat.emissiveIntensity = 3 * eyes; eyeMat.emissive.set(t > 37.2 ? '#ff2d55' : '#00e5ff');
    eyeLight.color.set(t > 37.2 ? '#ff2d55' : '#00e5ff');
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.6); eyeLight.intensity = 5 * eyes;
    const look = seg(t, 37.3, 38.0);
    rhead.rotation.set(0.1 * look, lerp(0, -0.9, look), 0.15 * look);
    if (t > 39.4) rhead.rotation.set(0, 0, 0.08 * Math.sin(t * 2));
    ant.material.emissiveIntensity = 0.4 + 2 * eyes * Math.abs(Math.sin(t * 6));
    leds.forEach((l, i) => l.material.emissiveIntensity = eyes * Math.max(0, Math.sin(t * 8 + i)) * 2);
    if (t < 39.4) { camPos = mix3([1.45, 1.9, 2.6], [1.45, 2.0, 1.4], sm((t - 34.2) / 5.2)); camLook = [1.45, 1.75, -1.2]; }
    else { camPos = mix3([1.45, 2.0, 1.25], [1.45, 2.0, 1.05], sm((t - 39.4) / 3.9)); camLook = [1.45, 1.9, -1.2]; }
    ov.think = seg(t, 38.2, 38.6) * (t < 39.4 ? 1 : 0); rhead.getWorldPosition(v); ov.thinkp = [v.x, v.y + 0.7, v.z];
    ov.follow = seg(t, 39.5, 39.9);
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  // ---------- overlays ----------
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  $('title').style.opacity = ov.title ? 1 : 0;
  const cardK = day && t < day[0] + 2.8 ? lin(t, day[0], day[0] + 0.35) : 0;
  $('day').textContent = day ? 'DIA ' + day[1] : ''; pop('day', cardK);
  const qi = $('qi');
  if (day && day[2]) { const roll = lin(t, day[0] + 0.3, day[0] + 1.0); qi.textContent = 'QI ' + Math.round(lerp(day[2] / 2, day[2], roll)).toLocaleString('pt-BR'); qi.style.opacity = 1; qi.style.transform = `translateX(-50%) scale(${1 + 0.15 * bounce(lin(t, day[0] + 1.0, day[0] + 1.6))})`; }
  else if (day && !day[2]) { qi.textContent = 'QI ???'; qi.style.opacity = t < 39.4 ? 1 : 0; qi.style.transform = 'translateX(-50%)'; }
  else qi.style.opacity = 0;
  $('timer').textContent = ov.timerTxt || ''; pop('timer', ov.timer || 0);
  pop('nosleep', ov.nosleep || 0); pop('follow', ov.follow || 0);
  const fk = ov.forms || 0;
  formEls.forEach((e, i) => { const k = fk * clamp((fk * 12 - i) / 1.5); e.style.opacity = k; const a = i * 0.52 + t * 0.25; e.style.left = (540 + Math.cos(a) * 380) + 'px'; e.style.top = (760 + Math.sin(a * 1.3) * 300) + 'px'; });
  place($('qq'), ov.qqp || [0, 0, 0], ov.qq, 0.6 + 0.4 * back(ov.qq || 0));
  place($('think'), ov.thinkp || [0, 0, 0], ov.think, 0.6 + 0.4 * back(ov.think || 0));
  $('think').textContent = '.'.repeat(1 + Math.floor((t * 3) % 3));
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  $('cap').textContent = c ? c.s : ''; $('cap').style.opacity = c ? 1 : 0;
};
