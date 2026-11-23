// SHORT solto "E se o tempo de celular aparecesse na sua testa?" — série E se? (3D, vertical)
import {
  THREE, W, H, scene, camera, renderer, quarto, setDay, makeChar, M, mesh, sph, rbox, grp, cap,
  clamp, sm, seg, lin, lerp, mix3, back, bounce, blink, breath, walkPose, cam, ampAt, thumbLights
} from '../../_lib/mundo3d.js';

const jo = makeChar();
const J = jo.root;
const mae = makeChar({ skin: '#9c6644', hood: '#c2577a', hood2: '#a94a69', pants: '#3d405b', hair: '#2b1d14', sole: '#c2577a' });
mesh(sph(0.42, 24, 16), mae.mats.hair, mae.head, [0, -0.1, -0.14], [0, 0, 0], [1.12, 1.25, 0.85]);
mesh(sph(0.16, 16, 12), mae.mats.hair, mae.head, [0, 0.32, -0.3]);
const ami = makeChar({ skin: '#e0ac69', hood: '#2a6f97', hood2: '#235d7e', hair: '#5a3825', sole: '#2a6f97' });
mesh(new THREE.SphereGeometry(0.46, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.4), M('#e63946'), ami.head, [0, 0.1, -0.02], [-0.3, 0, 0]);
// boné do Joseph (aparece quando ele esconde a testa)
const jcap = grp(jo.head);
mesh(new THREE.SphereGeometry(0.47, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), M('#1d3557'), jcap, [0, 0.0, 0], [0.12, 0, 0]);
mesh(rbox(0.56, 0.05, 0.42, 0.02), M('#1d3557'), jcap, [0, 0.04, 0.5], [0.25, 0, 0]);
// celular
const phone = grp(scene);
mesh(rbox(0.12, 0.22, 0.02, 0.02), M('#20232b'), phone);
const pscr = mesh(new THREE.PlaneGeometry(0.1, 0.19), new THREE.MeshBasicMaterial({ color: '#7fdcff' }), phone, [0, 0, 0.012]);
const phoneLight = new THREE.PointLight('#7fdcff', 0, 2.5, 2); scene.add(phoneLight);
// gaveta do criado-mudo
const drawer = grp(scene, [-1.75, 0.42, -3.15]);
mesh(rbox(0.6, 0.2, 0.5, 0.03), M('#efe8da'), drawer, [0, 0, -0.22]);
mesh(sph(0.03, 8, 6), M('#b08968'), drawer, [0, 0, 0.04]);
const sparks = []; for (let i = 0; i < 14; i++) sparks.push(mesh(sph(0.04, 8, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#52d273' : '#ffffff' }), scene));

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
    for (const s of merged) { const d = (l.end - l.start) * s.length / tot; caps.push({ a: t0, b: t0 + d, s }); t0 += d; }
  }
}
const $ = id => document.getElementById(id);
const v = new THREE.Vector3(), v2 = new THREE.Vector3();
const facing = (a, b) => Math.atan2(b[0] - a[0], b[2] - a[2]);
const hm = m => { m = Math.max(0, Math.round(m)); return Math.floor(m / 60) + 'h' + String(m % 60).padStart(2, '0'); };
// contador preso na testa
function forehead(el, c, minutes, on, opt = {}) {
  if (!on) { el.style.opacity = 0; return; }
  c.head.updateMatrixWorld(true);
  v.set(0, opt.y ?? 0.24, 0.43); c.head.localToWorld(v);
  const d = v.distanceTo(camera.position);
  v.project(camera);
  el.style.opacity = 1; el.textContent = typeof minutes === 'string' ? minutes : hm(minutes);
  el.style.left = ((v.x + 1) / 2 * W) + 'px'; el.style.top = ((1 - v.y) / 2 * H) + 'px';
  el.style.transform = `translate(-50%,-50%) scale(${(opt.k ?? 1) * 3.1 / d})`;
  el.style.color = opt.color || '#ff3b3b'; el.style.borderColor = opt.color || '#ff3b3b'; el.style.boxShadow = `0 0 30px ${opt.color || '#ff3b3b'}`;
}

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  setDay(1); camera.fov = 52;
  J.position.set(0.3, 0.86, -0.4); J.rotation.set(0, 0, 0); jo.legs.forEach(l => l.visible = true);
  mae.root.visible = false; ami.root.visible = false; jcap.visible = false; jcap.scale.setScalar(1);
  phone.visible = false; phoneLight.intensity = 0; pscr.material.color.set('#7fdcff');
  drawer.position.z = -3.15; sparks.forEach(s => s.visible = false);
  const jb = breath(t);
  let ov = {}, camPos, camLook, shake = 0, jm = null, am = null, jopt = {}, holdPhone = false;

  if (t < 5.2) { // ---- gancho ----
    jo.pose({ breathe: jb, armR: [1.1, -0.35, 1.1], armL: [0.3, 0.2, 0.4], head: [0.25, 0, 0] });
    jo.face({ open: blink(t), mouth: 'flat', brow: 0.2, look: [0, -0.8] });
    holdPhone = true;
    jm = (Math.floor(t * 14) * 37) % 600; jopt.k = 1.25;
    camPos = mix3([0.3, 2.25, 2.4], [0.3, 2.2, 1.7], sm(t / 5.2)); camLook = [0.3, 2.05, -0.4];
    ov.title = t > 0.2;
    if (t < 0) { thumbLights([0.3, 2.4, 1.6]); scene.background.set('#0b0820'); jm = 450; jopt.k = 1.7; jo.face({ open: 1.35, mouth: 'o', brow: 1.2, look: [0, 0.2] }); jo.pose({ breathe: 0, armR: [1.25, -0.45, 1.2], armL: [1.7, 1.0, 2.4], head: [0.05, 0, 0.05] }); camPos = [0.3, 2.05, 2.35]; camLook = [0.3, 2.3, -0.4]; }
  } else if (t < 11.9) { // ---- 7h da manhã ----
    jo.legs.forEach(l => l.visible = false);
    const up = seg(t, 6.9, 7.6);
    J.position.set(-3.2, 1.0, lerp(-2.55, -2.95, up)); J.rotation.set(lerp(-Math.PI / 2 + 0.15, -0.05, up), 0, 0);
    holdPhone = t > 7.9;
    jo.pose({ breathe: jb, armR: holdPhone ? [1.1, -0.35, 1.1] : [0.2, 0.1, 0.3], armL: [0.3, 0.2, 0.4], head: [holdPhone ? 0.25 : 0, 0, 0] });
    jo.face({ open: t < 6.9 ? 0.08 : (t < 8 ? 0.6 : blink(t)), mouth: 'flat', look: [0, -0.8] });
    jm = lerp(0, 10, seg(t, 8.0, 10.4));
    ov.clock = seg(t, 5.5, 5.8) * (t < 9.0 ? 1 : 0);
    camPos = t < 9.2 ? mix3([-1.4, 2.5, 0.6], [-1.7, 2.4, 0.1], sm((t - 5.2) / 4)) : mix3([-2.6, 2.1, -1.4], [-2.7, 2.05, -1.65], sm((t - 9.2) / 2.7));
    camLook = t < 9.2 ? [-3.2, 1.6, -2.8] : [-3.2, 2.05, -2.95];
  } else if (t < 17.9) { // ---- café: a mãe olha ----
    mae.root.visible = true; const MP = [-1.1, 0.86, 0.5]; mae.root.position.set(...MP); mae.root.rotation.y = facing(MP, [0.4, 0, -0.5]);
    J.position.set(0.4, 0.86, -0.5); J.rotation.y = -0.6;
    holdPhone = true;
    jo.pose({ breathe: jb, armR: [1.1, -0.35, 1.1], armL: [0.3, 0.2, 0.4], head: [0.25, 0, 0] });
    jo.face({ open: blink(t), mouth: 'flat', look: [0, -0.8] });
    const look = seg(t, 14.4, 14.9);
    mae.pose({ breathe: breath(t, 1), armL: [0.7, -0.2, 1.6], armR: [0.7, -0.2, 1.6], head: [-0.05 * look, 0, 0.1 * look] });
    mae.face({ open: blink(t, 0.4), mouth: look > 0.5 ? 'sad' : 'smile', brow: 0.4 * look, browTilt: -0.4 * look, look: [0.4, 0.4 * look] });
    jm = lerp(10, 60, seg(t, 12.4, 14.1)); jopt.k = 1.8;
    camPos = mix3([-0.1, 2.2, 3.4], [-0.2, 2.15, 2.9], sm((t - 11.9) / 6)); camLook = [-0.3, 1.9, -0.0];
  } else if (t < 25.7) { // ---- o amigo chega ----
    ami.root.visible = true; const AP = [-0.75, 0.86, 0.25]; ami.root.position.set(...AP); ami.root.rotation.y = facing(AP, [0.55, 0, -0.4]);
    const k = lin(t, 18.3, 19.8), A0 = [-3.5, 0.86, 1.4]; const w = walkPose(k * 6, k > 0 && k < 1 ? 1 : 0);
    if (k < 1) { ami.root.position.set(lerp(A0[0], AP[0], sm(k)), 0.86 + w.bob, lerp(A0[2], AP[2], sm(k))); ami.root.rotation.y = facing(A0, AP); }
    ami.pose({ breathe: breath(t, 2), leg: w.leg, armL: k < 1 ? w.armL : [0.2, 0.2, 0.3], armR: k < 1 ? w.armR : [0.2, 0.2, 0.3] });
    ami.face({ open: blink(t, 1), mouth: 'smile', brow: 0.3, look: [0.4, 0.3] });
    J.position.set(0.55, 0.86, -0.4); J.rotation.y = facing([0.55, 0, -0.4], AP);
    holdPhone = t < 20.4;
    jo.pose({ breathe: jb, armR: holdPhone ? [1.1, -0.35, 1.1] : [0.2, 0.15, 0.3], armL: [0.3, 0.2, 0.4] });
    jo.face({ open: blink(t), mouth: t > 24.3 ? 'flat' : 'smile', brow: t > 24.3 ? 0.8 : 0.3, browTilt: t > 24.3 ? -0.3 : 0, look: [-0.4, 0.2] });
    am = t > 20.6 ? lerp(0, 40, seg(t, 21.0, 22.6)) : null;
    jm = t < 23.2 ? 60 : lerp(60, 300, seg(t, 23.3, 24.5));
    jopt.k = 1.8 * (t > 24.2 ? 1 + 0.25 * bounce(lin(t, 24.5, 25.2)) : 1);
    camPos = mix3([-0.1, 2.15, 3.6], [-0.1, 2.1, 3.1], sm((t - 17.9) / 7.8)); camLook = [-0.1, 1.95, -0.1];
  } else if (t < 30.2) { // ---- o amigo ri, o boné ----
    ami.root.visible = true; const AP = [-0.75, 0.86, 0.25]; ami.root.position.set(...AP); ami.root.rotation.y = facing(AP, [0.55, 0, -0.4]);
    const laugh = t < 28.2 ? Math.abs(Math.sin(t * 14)) : 0;
    ami.root.position.y = 0.86 + laugh * 0.05;
    ami.pose({ breathe: breath(t, 2), lean: 0.15 * laugh, armL: [0.9, 0.3, 1.6], armR: [0.6 + 0.3 * laugh, 0.4, 1.5], head: [-0.15 * laugh, 0, 0] });
    ami.face({ open: 0.3, mouth: t < 28.2 ? 'o' : 'smile', brow: 0.6, look: [0.3, 0.4] });
    am = 40;
    J.position.set(0.55, 0.86, -0.4); J.rotation.y = facing([0.55, 0, -0.4], AP);
    const put = seg(t, 27.6, 28.3);
    jcap.visible = t > 27.9; jcap.scale.setScalar(t > 27.9 ? back(lin(t, 27.9, 28.3)) : 1);
    jo.pose({ breathe: jb, armL: [lerp(0.3, 2.3, put) * (t > 28.8 ? 0 : 1) + (t > 28.8 ? 0.3 : 0), 0.4, 1.6 * put * (t > 28.8 ? 0 : 1)], armR: [lerp(0.2, 2.3, put) * (t > 28.8 ? 0 : 1) + (t > 28.8 ? 0.2 : 0), 0.4, 1.6 * put * (t > 28.8 ? 0 : 1)], head: [0.15, 0, 0] });
    jo.face({ open: blink(t), mouth: 'flat', brow: -0.3, browTilt: 0.4, look: [0, -0.6] });
    jm = t < 28.0 ? 300 : null; jopt.k = 1.8;
    camPos = mix3([-0.1, 2.2, 3.2], [-0.1, 2.15, 2.8], sm((t - 25.7) / 4.5)); camLook = [-0.1, 1.95, -0.1];
  } else if (t < 35.0) { // ---- noite: 7h30 ----
    setDay(0);
    jo.legs.forEach(l => l.visible = false);
    J.position.set(-3.2, 1.0, -2.95); J.rotation.set(-0.05, 0, 0);
    holdPhone = true;
    jo.pose({ breathe: jb, armR: [1.1, -0.35, 1.1], armL: [0.3, 0.2, 0.4], head: [0.25, 0, 0] });
    jo.face({ open: 0.75, mouth: 'flat', brow: -0.1, look: [0, -0.8] });
    jm = lerp(300, 450, seg(t, 31.5, 32.6)); jopt.k = 1.3 + 0.1 * bounce(lin(t, 32.6, 33.3));
    camPos = mix3([-2.75, 2.3, -1.1], [-2.85, 2.25, -1.45], sm((t - 30.2) / 4.8)); camLook = [-3.2, 2.35, -2.95];
    ov.sleep = seg(t, 33.3, 33.6);
  } else if (t < 40.8) { // ---- a gaveta ----
    setDay(0);
    jo.legs.forEach(l => l.visible = false);
    J.position.set(-3.2, 1.0, -2.95); J.rotation.set(-0.05, 0.9 * seg(t, 36.6, 37.0), 0);
    const open = seg(t, 37.0, 37.4) * (1 - seg(t, 38.3, 38.7));
    drawer.position.z = -3.15 + 0.32 * open;
    const reach = seg(t, 37.0, 37.5) * (1 - seg(t, 38.2, 38.6));
    jo.pose({ breathe: jb, armL: [lerp(0.3, 1.2, reach), lerp(0.2, 0.1, reach), lerp(0.4, 0.3, reach)], armR: [0.3, 0.15, 0.4], lean: 0.2 * reach });
    const stop = t > 38.75;
    jo.face({ open: blink(t), mouth: stop ? 'smile' : 'flat', brow: stop ? 0.5 : 0.1, look: [0.6, -0.5] });
    phone.visible = t < 38.2;
    if (t < 37.2) { holdPhone = true; }
    else if (t < 38.2) { scene.updateMatrixWorld(true); jo.handL.getWorldPosition(v); v2.set(-1.75, 0.5, drawer.position.z - 0.2); phone.position.lerpVectors(v, v2, sm(lin(t, 37.5, 38.1))); phone.rotation.set(-Math.PI / 2, 0, 0); phoneLight.position.copy(phone.position); phoneLight.intensity = 2; }
    jm = stop ? 450 : 450; jopt.color = stop ? '#52d273' : '#ff3b3b'; jopt.k = 1 + (stop ? 0.25 * bounce(lin(t, 38.8, 39.5)) : 0);
    if (stop) { scene.updateMatrixWorld(true); v.set(0, 0.6, 0.4); jo.head.localToWorld(v); const k = lin(t, 38.8, 39.6); if (k < 1) sparks.forEach((s, i) => { const a = i / 14 * Math.PI * 2; s.visible = true; s.position.set(v.x + Math.cos(a) * 0.6 * k, v.y + Math.sin(a) * 0.4 * k, v.z + 0.1); s.scale.setScalar(1.5 * (1 - k)); }); }
    camPos = mix3([-1.1, 2.2, -0.6], [-1.3, 2.15, -0.9], sm((t - 35) / 5.8));
    camLook = [-2.55, 1.7, -3.0];
    ov.stop = seg(t, 38.9, 39.2);
  } else { // ---- e você? ----
    J.position.set(0.3, 0.86, -0.4);
    const pt = seg(t, 44.4, 44.8);
    jo.pose({ breathe: jb, armR: [lerp(0.2, 1.4, pt), 0.05, 0.1], armL: [0.2, 0.1, 0.3] });
    jo.face({ open: blink(t), mouth: 'smile', brow: 0.6, browTilt: -0.15, look: [0, 0] });
    jm = '?h??'; jopt.k = 1.2 + 0.12 * Math.abs(Math.sin(t * 4)); jopt.color = '#ffd60a';
    camPos = mix3([0.3, 2.25, 3.2], [0.3, 2.2, 2.4], sm((t - 40.8) / 5)); camLook = [0.3, 2.05, -0.4];
    ov.cta = seg(t, 41.8, 42.2); ov.cta2 = seg(t, 44.9, 45.3);
  }

  if (holdPhone) {
    phone.visible = true; scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); phone.position.copy(v); phone.position.y += 0.1;
    jo.head.getWorldPosition(v2); phone.lookAt(v2); phoneLight.position.copy(phone.position).lerp(v2, 0.4); phoneLight.intensity = 1.6;
  }
  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t);
  renderer.render(scene, camera);

  forehead($('fj'), jo, jm, jm !== null && jm !== undefined, jopt);
  forehead($('fa'), ami, am, am !== null && am !== undefined && ami.root.visible, { y: 0.1, color: '#52d273', k: 1.8 });
  const pop = (id, k) => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `translateX(-50%) scale(${0.5 + 0.5 * back(k || 0)})`; };
  $('title').style.opacity = ov.title ? 1 : 0;
  pop('clock', ov.clock || 0); pop('sleep', ov.sleep || 0); pop('stop', ov.stop || 0); pop('cta', ov.cta || 0); pop('cta2', ov.cta2 || 0);
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c ? 1 : 0;
};
