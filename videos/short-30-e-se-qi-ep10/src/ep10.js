
// ===== ep. 10: Qual é o verdadeiro? — a sala de casa, a luta, o abraço =====
const RY = -50, RM = [0, RY, 30];
const rp = p => [p[0] + RM[0], p[1] + RY, p[2] + RM[2]];
const room = grp(scene, RM);
mesh(new THREE.PlaneGeometry(12, 11), M('#7a5238', { roughness: 0.8 }), room, [0, 0, 0.5], [-Math.PI / 2, 0, 0]);
for (let i = -5; i <= 5; i++) mesh(new THREE.BoxGeometry(0.02, 0.005, 11), M('#5e3d29'), room, [i * 1.1, 0.004, 0.5]);
const wallM = M('#d8c3a5', { roughness: 0.95 }), wallS = M('#cbb393', { roughness: 0.95 });
mesh(rbox(12.4, 3.8, 0.2, 0.02), wallM, room, [0, 1.9, -4.1]);
mesh(rbox(0.2, 3.8, 11, 0.02), wallS, room, [-6.1, 1.9, 0.5]);
mesh(rbox(0.2, 3.8, 11, 0.02), wallS, room, [6.1, 1.9, 0.5]);
mesh(new THREE.PlaneGeometry(12.4, 11), M('#a8957a'), room, [0, 3.8, 0.5], [Math.PI / 2, 0, 0]);
mesh(rbox(12.2, 0.14, 0.06, 0.02), M('#8b6b4e'), room, [0, 0.07, -3.98]);
mesh(new THREE.CircleGeometry(2.6, 48), M('#8e3b46', { roughness: 1 }), room, [0, 0.012, 0.4], [-Math.PI / 2, 0, 0]);
mesh(new THREE.RingGeometry(2.2, 2.4, 48), M('#e9c46a', { roughness: 1 }), room, [0, 0.014, 0.4], [-Math.PI / 2, 0, 0]);
// sofá (de costas para a parede do fundo)
const sofa = grp(room, [0, 0, -2.45]);
{ const sM = M('#3d5a80', { roughness: 0.9 }), cM = M('#4a6fa5', { roughness: 0.9 });
  mesh(rbox(3.6, 0.5, 1.15, 0.14), sM, sofa, [0, 0.42, 0]); mesh(rbox(3.6, 0.95, 0.32, 0.14), sM, sofa, [0, 0.95, -0.45]);
  for (const s of [-1, 1]) { mesh(rbox(0.32, 0.8, 1.15, 0.12), sM, sofa, [s * 1.8, 0.55, 0]); mesh(rbox(1.6, 0.2, 0.95, 0.09), cM, sofa, [s * 0.82, 0.76, 0.06]); }
  mesh(rbox(0.6, 0.5, 0.18, 0.08), M('#e9c46a', { roughness: 1 }), sofa, [-1.15, 1.1, -0.22], [0.2, 0.3, 0.1]); }
// mesa de centro (a que voa)
const mesa = grp(scene);
{ const wM = M('#9c6644', { roughness: 0.6 }); mesh(rbox(1.9, 0.1, 0.95, 0.03), wM, mesa, [0, 0.52, 0]); for (const x of [-0.8, 0.8]) for (const z of [-0.36, 0.36]) mesh(cap(0.04, 0.42), wM, mesa, [x, 0.25, z]);
  mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.22, 14), M('#e07a5f'), mesa, [-0.5, 0.68, 0]); mesh(sph(0.16, 14, 10), M('#52b788', { roughness: 1 }), mesa, [-0.5, 0.88, 0]);
  mesh(rbox(0.5, 0.06, 0.35, 0.02), M('#3d405b'), mesa, [0.45, 0.6, 0.05]); }
const MESA0 = rp([0, 0, -0.75]);
// TV, janela, quadros, abajur, planta, porta
mesh(rbox(0.12, 1.15, 2.0, 0.04), M('#111'), room, [-5.92, 1.8, 0.3]); mesh(rbox(0.6, 0.6, 1.6, 0.05), M('#6b4f3a'), room, [-5.7, 0.3, 0.3]);
const winG = grp(room, [3.3, 2.0, -3.98]);
mesh(rbox(1.9, 1.6, 0.1, 0.03), M('#f6f1e7'), winG, [0, 0, 0]);
const winGlass = mesh(new THREE.PlaneGeometry(1.6, 1.3), new THREE.MeshBasicMaterial({ color: '#16213e', toneMapped: false }), winG, [0, 0, 0.06]);
mesh(sph(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: '#fff3d6', toneMapped: false }), winG, [0.45, 0.3, 0.07], [0, 0, 0], [1, 1, 0.1]);
mesh(new THREE.BoxGeometry(0.05, 1.3, 0.05), M('#f6f1e7'), winG, [0, 0, 0.08]); mesh(new THREE.BoxGeometry(1.6, 0.05, 0.05), M('#f6f1e7'), winG, [0, 0, 0.08]);
const frameC = document.createElement('canvas'); frameC.width = 256; frameC.height = 200;
{ const x = frameC.getContext('2d'); x.fillStyle = '#ffd6a5'; x.fillRect(0, 0, 256, 200); x.fillStyle = '#b5446e'; x.beginPath(); x.arc(85, 105, 46, 0, 7); x.fill(); x.fillStyle = '#4f5d40'; x.beginPath(); x.arc(172, 112, 40, 0, 7); x.fill();
  x.fillStyle = '#a86f4a'; x.beginPath(); x.arc(85, 72, 34, 0, 7); x.fill(); x.beginPath(); x.arc(172, 80, 30, 0, 7); x.fill(); x.fillStyle = '#1c140f'; x.beginPath(); x.arc(172, 66, 30, Math.PI, 0); x.fill(); x.beginPath(); x.arc(85, 60, 36, Math.PI, 0); x.fill();
  x.fillStyle = '#e63946'; x.font = 'bold 40px sans-serif'; x.fillText('♥', 114, 60); }
const frameT = new THREE.CanvasTexture(frameC); frameT.colorSpace = THREE.SRGBColorSpace;
mesh(rbox(1.3, 1.05, 0.06, 0.02), M('#6b4226'), room, [-1.6, 2.35, -3.98]); mesh(new THREE.PlaneGeometry(1.15, 0.9), new THREE.MeshStandardMaterial({ map: frameT, roughness: 0.6 }), room, [-1.6, 2.35, -3.94]);
mesh(rbox(0.8, 0.8, 0.06, 0.02), M('#3d405b'), room, [0.6, 2.5, -3.98]);
{ const lp = grp(room, [-4.8, 0, -3.2]); mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8), M('#222'), lp, [0, 0.8, 0]); mesh(new THREE.ConeGeometry(0.32, 0.4, 16, 1, true), M('#f1e3c8', { side: THREE.DoubleSide }), lp, [0, 1.75, 0]); }
{ const pl = grp(room, [5.2, 0, -3.3]); mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 14), M('#e07a5f'), pl, [0, 0.25, 0]); for (let i = 0; i < 6; i++) mesh(sph(0.3, 12, 10), M('#2d6a4f', { roughness: 1 }), pl, [Math.cos(i) * 0.2, 0.75 + i * 0.12, Math.sin(i) * 0.2]); }
mesh(rbox(0.06, 2.6, 1.4, 0.02), M('#4a3226'), room, [6.0, 1.3, 2.2]);
const rDoor = grp(room, [5.98, 0, 1.55]); mesh(rbox(0.08, 2.45, 1.25, 0.03), M('#7a4b2e'), rDoor, [0, 1.22, 0.62]); mesh(sph(0.05, 10, 8), M('#e9c46a', { metalness: 0.6 }), rDoor, [-0.07, 1.15, 1.1]);
mesh(new THREE.PlaneGeometry(1.25, 2.45), new THREE.MeshBasicMaterial({ color: '#0b0d18' }), room, [6.0, 1.22, 2.2], [0, -Math.PI / 2, 0]);
const roomLamp = new THREE.PointLight('#ffb35c', 0, 16, 1.1); scene.add(roomLamp);
const moonL = new THREE.PointLight('#7f9cff', 0, 14, 1.2); scene.add(moonL);
const roomFill = new THREE.PointLight('#c9d4ff', 0, 22, 1.0); scene.add(roomFill);
// escudo dourado
const shield = [ns(mesh(new THREE.CircleGeometry(1, 48), ADD('#ffe066'), scene)), ns(mesh(new THREE.TorusGeometry(1, 0.06, 10, 64), ADD('#fff3b0'), scene)), ns(mesh(new THREE.RingGeometry(0.55, 0.62, 6), ADD('#fff3b0'), scene))];
shield.forEach(m => m.material.side = THREE.DoubleSide);
function setShield(p, face, r, op, t) { shield.forEach((m, i) => { m.visible = op > 0.01; m.position.copy(p); m.lookAt(face); m.rotateZ(t * (i === 2 ? 2 : 0.5)); m.scale.setScalar(r * (1 + 0.04 * Math.sin(t * 40 + i))); m.material.opacity = op * [0.35, 0.95, 0.8][i]; }); }
// olhos vermelhos no céu (o exército)
const army = []; for (let i = 0; i < 26; i++) { const g = grp(scene); const x = -16 + hash(i * 3.3) * 32, y = 9 + hash(i * 5.1) * 16, z = 24 + hash(i * 7.7) * 12; g.position.set(x, y, z); for (const s of [-1, 1]) ns(mesh(sph(0.32, 10, 8), ADD('#ff2d55', 1), g, [s * 0.6, 0, 0])); ns(mesh(sph(1.1, 10, 8), ADD('#ff2d55', 0.22), g, [0, 0, -0.1], [0, 0, 0], [1.6, 0.7, 0.5])); army.push(g); }
function setArmy(k, t) { army.forEach((g, i) => { const on = k > hash(i * 9.1) * 0.8; g.visible = on; g.lookAt(camera.position); g.scale.setScalar((on ? 1 : 0) * (1 + 0.1 * Math.sin(t * 3 + i)) * (((t * 0.7 + hash(i)) % 3) > 2.9 ? 0.15 : 1)); }); }
// cacos (vidro e madeira)
const shards = []; for (let i = 0; i < 18; i++) shards.push(ns(mesh(new THREE.TetrahedronGeometry(0.09 + 0.08 * hash(i * 4.4)), i % 2 ? new THREE.MeshBasicMaterial({ color: '#bfe3ff', transparent: true, opacity: 0.8 }) : M('#9c6644'), scene)));
function shardsAt(c, k, spread = 2.5, dirv = [0, 0, 1]) { shards.forEach((s, i) => { s.visible = k > 0 && k < 1; if (!s.visible) return; const a = hash(i) * 6.28, u = hash(i + 3); s.position.set(c[0] + (Math.cos(a) * spread * u + dirv[0] * 2) * k, c[1] + (1.5 * hash(i + 5) - 0.3) * k * 2 - 4.9 * k * k * 0.6, c[2] + (Math.sin(a) * spread * u + dirv[2] * 2) * k); s.rotation.set(k * 9 + i, k * 7, i); }); }
function sparkBurst(c, k, R = 1.6, col) { sparks.forEach((s, i) => { s.visible = k > 0 && k < 1; if (!s.visible) return; const a = hash(i * 2.2) * 6.28, b = hash(i * 3.7) * 3.14 - 1.57; const r = R * Math.sqrt(k) * (0.5 + 0.5 * hash(i)); s.position.set(c[0] + Math.cos(a) * Math.cos(b) * r, c[1] + Math.sin(b) * r, c[2] + Math.sin(a) * Math.cos(b) * r); s.scale.setScalar(1.6 * (1 - k)); if (col) s.material.color.set(i % 2 ? col : '#ffffff'); }); }
const lanternTbl = ns(mesh(sph(0.13, 14, 10), new THREE.MeshBasicMaterial({ color: '#ffd27a', toneMapped: false }), scene));
const qMarks = [], HS = 2.0;

// posições (sala, coordenadas do mundo)
const DOORIN = rp([5.4, 0.86, 2.15]), FIN = rp([1.4, 0.86, 1.3]), MOMIN = rp([-1.6, 0.86, 0.9]), HIDE = rp([0.5, 0.2, -3.55]);
const SL = rp([-0.95, 0.86, 1.35]), SR = rp([0.95, 0.86, 1.35]), MOMHUG = rp([0.15, 0.86, -0.75]);
const flyEyes = (c, s) => { scene.updateMatrixWorld(true); c.eyes[0].getWorldPosition(e1); c.eyes[1].getWorldPosition(e2); return [e1.clone(), e2.clone()]; };

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t);
  const who = (TL.lines.find(l => t >= l.start && t < l.end) || {}).who;
  const talkF = who === 'F' ? amp : -1, talkJ = who === 'J' ? amp : -1;
  camera.fov = 58; camera.aspect = W / H; setStreet(true, t); cable.visible = false; room.visible = false; mesa.visible = false; lanternTbl.visible = false;
  drawPhone(false, 0); phoneLight.intensity = 0;
  // apagão continua (bairro sem luz)
  winMats.forEach(({ m }) => m.emissiveIntensity = 0.02); lampMats.forEach(m => m.emissiveIntensity = 0); lampLights.forEach(l => l.intensity = 0);
  tlMats.forEach(m => m.emissiveIntensity = 0.05); streetLight.intensity = 0; hemi.intensity *= 0.5; sun.intensity *= 0.45; skyMat.color.setScalar(0.45);
  // padrões
  J.visible = true; jo.legs.forEach(l => l.visible = true); J.scale.set(1, 1, 1); J.rotation.set(0, 0, 0);
  jo.head.scale.setScalar(HS); glasses.visible = true; jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.3 + 0.08 * Math.sin(t * 6);
  jo2.head.scale.setScalar(HS); jo2.mats.skin.emissive.set('#ffb703'); jo2.mats.skin.emissiveIntensity = 0.3 + 0.08 * Math.sin(t * 6 + 1);
  eyeGlow.forEach(g => { g.visible = false; g.material.opacity = 0; });
  robot.visible = false; robot.scale.setScalar(1.35); robot.rotation.set(0, 0, 0); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0));
  eyeMat.emissive.set('#ff2d55'); eyeMat.emissiveIntensity = 5; antMat.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 4)); mouthMat.emissiveIntensity = 0.4; rmouth.scale.set(1, 1, 1);
  leds.forEach((l, i) => l.material.emissiveIntensity = Math.max(0, Math.sin(t * 5 + i)) * 2); eyeLight.intensity = 0;
  thr.forEach(g => g.visible = false);
  [...dizzy, ...sparks, ...rocks, ...smoke, ...motes, ...rmotes, ...streamP, ...shards].forEach(o => o.visible = false);
  [aura, auraIn, raura, rauraIn, ghost, trail, ...ball, ...jOrb, ...rOrb, ...shield].forEach(o => o.visible = false);
  army.forEach(g => g.visible = false);
  auraLight.intensity = rLight.intensity = fireLight.intensity = clashLight.intensity = lanternLight.intensity = homeFill.intensity = roomLamp.intensity = moonL.intensity = roomFill.intensity = thumbKey2.intensity = 0;
  rings.forEach(r => r.visible = false); fireballs.forEach(f => { f.o.visible = f.c.visible = false; }); hideArcs(); hideBig(gBeam); hideBig(rBeam); eyeBeams.forEach(b => { b.core.visible = b.glow.visible = false; });
  car.visible = false; pole.visible = false; crater.visible = false; crack.material.opacity = 0;
  J2b.visible = false; J2b.scale.set(1, 1, 1); glint.material.opacity = 0; mom.root.visible = false; mom.head.scale.setScalar(1); lantern.visible = true; doorL.rotation.y = 1.5; rDoor.rotation.y = 0;
  let ov = {}, camPos, camLook, shake = 0, flash = 0, roll = 0, impact = false;
  const jb = breath(t);
  const CL = (p, sx = 0.4, d = 4.7) => { camPos = [p[0] + sx, p[1] + 1.5, p[2] + d]; camLook = [p[0], p[1] + 1.15, p[2]]; camera.fov = 50; };
  const fightFace = (o = {}) => jo.face({ open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.5, look: [0, 0.1], talk: talkJ, ...o });
  const fakeFace = (o = {}) => jo2.face({ open: blink(t, 1.3), mouth: 'flat', brow: 0, look: [0, 0.1], talk: talkF, ...o });
  const showMom = (p, ry, pose, face) => { mom.root.visible = true; mom.root.position.set(...p); mom.root.rotation.set(0, ry, 0); mom.pose({ breathe: breath(t, 1), armR: [1.1, 0.1, 1.2], ...pose }); mom.face({ open: blink(t, 0.6), mouth: 'flat', ...face }); scene.updateMatrixWorld(true); lantern.getWorldPosition(q1); lanternLight.position.copy(q1); lanternLight.intensity = 8; };
  const outside = () => { homeFill.position.set(0, 6, 6); homeFill.intensity = 4; };
  const inside = () => {
    room.visible = true; street.visible = false; scene.background.set('#0b0d18');
    hemi.intensity = 0.18; sun.intensity = 0.0;
    roomLamp.position.set(...rp([0, 2.2, 0.8])); roomLamp.intensity = 9; moonL.position.set(...rp([3.3, 2.2, -2.6])); moonL.intensity = 5; roomFill.position.set(...rp([0, 3.2, 5.5])); roomFill.intensity = 3.5;
  };
  const walk = (a, b, k, ph) => { const p = mix3(a, b, k); return [p, walkPose(ph, k > 0 && k < 1 ? 1 : 0)]; };

  if (t < 0) { // ---------------- capa ----------------
    outside(); mom.root.visible = false;
    J2b.visible = true; J2b.position.set(-1.05, 0.86, 5.9); J2b.rotation.set(0, 0.25, 0); jo2.pose({ breathe: 0, armL: [0.55, 0.85, 0.1], armR: [0.1, 0.15, 0.3] }); jo2.face({ open: 1.1, mouth: 'o', brow: -0.5, browTilt: -0.7, look: [0.3, 0.1] }); glint.material.opacity = 1;
    J.position.set(1.05, 0.86, 5.9); J.rotation.set(0, -0.25, 0); jo.pose({ armR: [0.55, 0.85, 0.1], armL: [0.1, 0.15, 0.3] }); jo.face({ open: 1.1, mouth: 'o', brow: -0.5, browTilt: -0.7, look: [-0.3, 0.1] });
    thumbKey2.position.set(0, 3.5, 10); thumbKey2.intensity = 12; homeFill.intensity = 6;
    camera.fov = 52; camera.updateProjectionMatrix(); cam([0, 2.5, 12.4], [0, 2.15, 5.9], 0, 0); sky.position.copy(camera.position); renderer.render(scene, camera); return;
  }

  if (t < 3.3) { // ======== GANCHO: dois Josephs ========
    outside(); showMom(MOM, Math.PI, { armL: [0.2, 0.3, 0.3] }, { open: 1.3, mouth: 'o', brow: 1.1 });
    J2b.visible = true; J2b.position.set(...FJp); jo2.pose({ breathe: breath(t, 2), armL: [0.1, 0.15, 0.3], armR: [0.1, 0.15, 0.3] }); fakeFace();
    J.position.set(...RJp); jo.pose({ breathe: jb, armL: [0.1, 0.15, 0.3], armR: [0.1, 0.15, 0.3] }); jo.face({ open: blink(t), mouth: 'flat', look: [0, 0.1] });
    glint.material.opacity = t > 2.2 && t < 2.45 ? 1 : 0;
    const k = sm(t / 3.3); camPos = [0, lerp(3.0, 2.6, k), lerp(13.1, 12.3, k)]; camLook = [0, 2.0, 5.9]; camera.fov = 58;
    ov.qual = seg(t, 0.15, 0.45); ov.qm = t > 1.0 ? seg(t, 1.0, 1.25) : 0;
  } else if (t < 6.75) { // ======== resumo (P&B): o robô escaneia o rosto ========
    ov.recap = 1; crater.visible = true;
    robot.visible = true; robot.position.set(1.6, 0, -0.8); robot.rotation.y = facing([1.6, 0, -0.8], [-0.6, 0, 1.4]); eyeMat.emissiveIntensity = 9;
    J.position.set(-0.6, 0.86, 1.4); J.rotation.y = facing([-0.6, 0, 1.4], [1.6, 0, -0.8]); jo.pose({ breathe: jb, lean: 0.25, armL: [0.3, 0.2, 0.4], armR: [0.3, 0.2, 0.4] }); jo.face({ open: 0.5, mouth: 'sad', brow: 0.3 });
    const scan = t < 5.3; const [a1, a2] = [(() => { scene.updateMatrixWorld(true); rhead.getWorldPosition(e1); return e1.clone(); })(), headJ()];
    if (scan) { const off = 0.6 * Math.sin(t * 9); setEyeBeam(eyeBeams[0], a1, a2.clone().add(new THREE.Vector3(0, off, 0)), 0.9); }
    for (let i = 0; i < 12; i++) puff(i, [Math.cos(i) * 3 + 0.5, 0.6 + 0.2 * (i % 3), Math.sin(i) * 3], ((t * 0.2 + i / 12) % 1), 1.8, '#6a6670');
    if (t > 5.3) { robot.visible = false; J2b.visible = true; J2b.position.set(1.6, 0.86, -0.8); J2b.rotation.y = facing([1.6, 0, -0.8], [-0.6, 0, 1.4]); jo2.pose({ breathe: 0 }); jo2.face({ open: 1, mouth: 'smile', brow: -0.4, browTilt: -0.4 }); glint.material.opacity = 1; flash = Math.max(0, 1 - (t - 5.3) * 4) * 0.7; }
    camPos = [4.9, 2.7, 4.6]; camLook = [0.5, 1.9, 0.3]; camera.fov = 52;
    ov.copia = t < 5.3 ? 1 : 0; ov.copiaTxt = 'ESCANEANDO ROSTO... ' + Math.min(100, Math.floor(lin(t, 3.6, 5.2) * 100)) + '%';
  } else if (t < 11.6) { // ======== dia 18: bairro no escuro, a mãe com o lampião ========
    outside(); showMom(MOM, Math.PI, { armL: [0.2, 0.3, 0.3] }, { open: blink(t), mouth: 'flat', brow: 0.6 });
    J2b.visible = true; J2b.position.set(...FJp); J2b.rotation.y = Math.PI; jo2.pose({ breathe: breath(t, 2) }); fakeFace();
    J.position.set(...RJp); J.rotation.y = Math.PI; jo.pose({ breathe: jb }); jo.face({ open: blink(t), mouth: 'flat' });
    if (t > 9.0) { J2b.rotation.y = 0; J.rotation.y = 0; }
    if (t < 9.0) { const k = sm((t - 6.75) / 2.25); camPos = [lerp(-6, -3, k), lerp(7.5, 4.5, k), lerp(-3, 1.0, k)]; camLook = [0, 1.6, 8]; camera.fov = 56; ov.day = seg(t, 6.85, 7.1) * (1 - seg(t, 8.7, 8.9)); }
    else { const k = sm((t - 9.0) / 2.6); camPos = [0, lerp(5.0, 4.4, k), lerp(0.6, 1.8, k)]; camLook = [0, 1.7, 13]; camera.fov = 52; }
  } else if (t < 17.4) { // ======== "mãe, sou eu!" x "mentira!" ========
    outside(); showMom(MOM, Math.PI, { armL: [0.2, 0.3, 0.3] }, { open: blink(t), mouth: 'flat', brow: 0.9, look: [t < 14.5 ? -0.6 : 0.6, -0.2] });
    J2b.visible = true; J2b.position.set(...FJp); const fp = t < 14.5;
    jo2.pose({ breathe: breath(t, 2), armL: fp ? [0.35, lerp(0.15, 1.25, seg(t, 11.8, 12.2)), 0.1] : [0.1, 0.15, 0.3], armR: fp ? [0.6, 0.1, 1.4] : [0.1, 0.15, 0.3], lean: fp ? 0.08 : 0 });
    fakeFace({ open: 1.15, brow: fp ? 0.9 : 0.3, look: [fp ? -0.2 : 0.5, 0.1] });
    J.position.set(...RJp); const jp = t > 14.6;
    jo.pose({ breathe: jb, armR: jp ? [0.35, lerp(0.15, 1.25, seg(t, 14.65, 15.0)), 0.1] : [0.1, 0.15, 0.3], lean: jp ? 0.1 : 0 });
    fightFace({ look: [jp ? -0.2 : -0.6, 0.1], brow: jp ? -0.8 : -0.3, browTilt: jp ? 0.8 : 0.3, open: jp ? 1.1 : 1 });
    if (fp) { CL(FJp, 0.5); }
    else { CL(RJp, -0.5); roll = -0.05; }
  } else if (t < 24.6) { // ======== o teste da mãe; o falso responde na hora ========
    outside(); const mtalk = t > 18.4 && t < 21.0 ? amp : -1;
    showMom(MOM, Math.PI, { armL: [t < 21.2 ? 1.4 : 0.2, 0.1, t < 21.2 ? 1.9 : 0.3] }, { open: 1, mouth: 'flat', brow: 0.4, browTilt: -0.3, talk: mtalk, look: [0, -0.25] });
    J2b.visible = true; J2b.position.set(...FJp); jo2.pose({ breathe: breath(t, 2) }); fakeFace({ mouth: t > 24.0 ? 'smile' : 'flat', look: [0, 0.3] });
    J.position.set(...RJp); jo.pose({ breathe: jb }); jo.face({ open: blink(t), mouth: 'flat', look: [-0.5, 0.2] });
    if (t < 21.2) { camPos = [0.5, 2.0, 11.3]; camLook = [0, 1.95, 13.35]; camera.fov = 46; ov.teste = seg(t, 17.7, 18.0); }
    else { CL(FJp, 0.3); ov.hud = seg(t, 21.3, 21.5); glint.material.opacity = t > 23.9 && t < 24.15 ? 1 : 0; }
  } else if (t < 30.45) { // ======== "ele baixou as memórias"; o verdadeiro trava ========
    outside(); showMom(MOM, Math.PI, { armL: [0.2, 0.3, 0.3] }, { open: blink(t), mouth: 'flat', brow: 0.5 });
    J2b.visible = true; J2b.position.set(...FJp); jo2.pose({ breathe: breath(t, 2) }); fakeFace({ mouth: 'smile', look: [0.5, 0.1] });
    J.position.set(...RJp); jo.pose({ breathe: jb, armR: t > 27.6 ? [0.9, 0.1, 2.3] : [0.1, 0.15, 0.3] }); jo.face({ open: t > 27.6 ? 1.3 : blink(t), mouth: t > 27.6 ? 'sad' : 'flat', brow: t > 27.6 ? 1.1 : 0.2, look: [0, 0.3] });
    if (t < 27.6) { CL(FJp, 0.3); ov.hud = 1; ov.hudScroll = t; }
    else {
      CL(RJp, -0.3); ov.trava = seg(t, 27.7, 27.95);
      dizzy.forEach((d, i) => { d.visible = true; const a = t * 3 + i * 1.256; d.position.set(RJp[0] + Math.cos(a) * 0.9, 3.3 + 0.08 * Math.sin(t * 5 + i), RJp[2] + Math.sin(a) * 0.9); d.rotation.set(t * 3, t * 2, 0); });
    }
  } else if (t < 33.2) { // ======== a mãe abre a porta... pro falso ========
    outside(); const k = lin(t, 30.9, 32.9), wk = walk(FJp, [-0.25, 0.86, 13.0], k, t * 2.2);
    showMom([0.85, 0.86, 13.35], Math.PI, { armL: [lerp(0.2, 1.0, seg(t, 30.6, 31.2)), 0.6, 0.3] }, { open: 1, mouth: 'smile', brow: 0.2, look: [-0.5, -0.2] });
    J2b.visible = true; J2b.position.set(...wk[0]); J2b.position.y += wk[1].bob; J2b.rotation.y = facing(FJp, [-0.25, 0, 13]); jo2.pose({ ...wk[1], breathe: 0 }); fakeFace({ mouth: 'smile' });
    J.position.set(...RJp); jo.pose({ breathe: jb, armR: [lerp(0.1, 1.4, seg(t, 31.6, 32.1)), 0.15, 0.1], lean: 0.1 }); jo.face({ open: 1.3, mouth: 'o', brow: 1.1, look: [-0.6, 0.2] });
    camPos = [4.8, 3.4, 8.6]; camLook = [-0.2, 1.6, 11.6]; camera.fov = 54;
  } else if (t < 36.45) { // ======== o brilho vermelho no olho ========
    outside(); showMom([0.85, 0.86, 13.35], Math.PI, { armL: [1.0, 0.6, 0.3] }, { open: blink(t), mouth: 'smile', brow: 0.2, look: [-0.5, -0.2] });
    J2b.visible = true; J2b.position.set(-0.25, 0.86, 13.0); J2b.rotation.y = 0.4 + Math.PI * seg(t, 33.5, 34.1) * 0.75; jo2.pose({ breathe: 0 }); jo2.face({ open: 1, mouth: 'smile', brow: -0.6, browTilt: -0.6, look: [0.3, 0] });
    glint.material.opacity = t > 34.6 ? (0.6 + 0.4 * Math.sin(t * 20)) : 0; if (t > 34.6) { scene.updateMatrixWorld(true); glint.getWorldPosition(v); eyeLight.position.copy(v); eyeLight.intensity = 3; }
    const k = sm((t - 33.2) / 3.2); scene.updateMatrixWorld(true); glint.getWorldPosition(q1);
    camPos = [lerp(q1.x - 1.6, q1.x - 0.5, k), lerp(q1.y + 0.4, q1.y + 0.1, k), lerp(q1.z - 4.5, q1.z - 1.9, k)]; camLook = [q1.x, q1.y, q1.z]; camera.fov = 46;
    if (t > 34.6 && t < 34.8) flash = 0.25;
  } else { // ======== DENTRO DE CASA ========
    inside(); mesa.visible = t < 47.35; mesa.position.set(...MESA0); mesa.rotation.set(0, 0, 0);
    J2b.visible = true; J.visible = true; mom.root.visible = true;
    let mp = MOMIN, mry = 0.8, mpose = { armL: [0.2, 0.3, 0.3] }, mface = { open: blink(t), mouth: 'flat', brow: 0.6 };
    if (t < 39.7) { // o falso entra; "mãe, se esconde!"; o verdadeiro arromba a porta
      const k = lin(t, 36.45, 37.9), wk = walk(DOORIN, FIN, k, t * 2.2);
      J2b.position.set(...wk[0]); J2b.position.y += wk[1].bob; J2b.rotation.y = k < 1 ? facing(DOORIN, FIN) : lerp(facing(DOORIN, FIN), facing(FIN, MOMIN), seg(t, 37.9, 38.2));
      const yell = t > 38.0; jo2.pose({ ...wk[1], breathe: 0, ...(yell ? { armR: [1.5, 0.1, 0.1], armL: [0.6, 0.4, 0.6], lean: 0.1 } : {}) }); fakeFace({ open: 1.2, brow: 1.0, look: [-0.3, 0] });
      mface = { open: 1.2, mouth: 'o', brow: 1.1, look: [0.5, 0] }; mry = facing(MOMIN, FIN);
      const br = seg(t, 38.75, 38.95); rDoor.rotation.y = 1.7 * br;
      J.visible = t > 38.75; J.position.set(...DOORIN); J.rotation.y = facing(DOORIN, FIN); jo.pose({ breathe: jb, lean: 0.2, armR: [1.4, 0.1, 0.3], armL: [0.6, 0.2, 1.2], leg: [0.5, -0.3] }); fightFace({ brow: -0.9, browTilt: 0.8 }); auraJ(0.5 * br, t);
      if (t > 38.75 && t < 38.95) shake = 0.08;
      if (t < 38.75) { camPos = rp([-0.5, 2.4, 7.4]); camLook = rp([0.5, 1.5, 0.6]); camera.fov = 58; }
      else { camPos = rp([1.0, 1.8, 6.4]); camLook = rp([4.6, 1.6, 1.8]); camera.fov = 56; roll = 0.06; }
      ov.fxs = t > 38.75 && t < 39.5 ? ['CRASH!', seg(t, 38.75, 38.95), '#ffd60a', 64, 30, 190] : null;
    } else if (t < 44.5) { // o falso ataca; a mãe corre pra trás do sofá
      const dash = seg(t, 40.0, 40.35), hit = t > 40.35, kb = seg(t, 40.35, 40.8);
      const fp = mix3(FIN, rp([4.0, 0.86, 1.95]), dash);
      J2b.position.set(...fp); J2b.rotation.y = facing(FIN, DOORIN); jo2.pose({ breathe: 0, lean: 0.3 * dash, armR: [dash > 0.5 ? 1.6 : 0.6, -0.1, dash > 0.5 ? 0.05 : 1.6], armL: [0.9, 0.2, 1.8], leg: [0.5, -0.3] }); jo2.face({ open: 1, mouth: 'flat', brow: -0.9, browTilt: 0.9 }); glint.material.opacity = 1;
      const jp = mix3(DOORIN, rp([5.55, 0.86, 2.7]), kb); J.position.set(...jp); J.rotation.y = facing(DOORIN, FIN); jo.pose({ breathe: jb, lean: hit ? -0.35 * (1 - seg(t, 41.2, 42.0)) : 0.1, armR: [0.4, 0.5, 0.4], armL: [0.4, 0.5, 0.4] }); fightFace({ open: hit && t < 41.2 ? 0.4 : 1, mouth: hit && t < 41.4 ? 'o' : 'flat' });
      if (t > 40.35 && t < 40.42) impact = true; if (t > 40.35 && t < 40.7) shake = 0.12;
      if (hit) { sparkBurst(A3(headJ()), lin(t, 40.35, 40.85), 1.4, '#ff2d55'); ringAt(0, A3(headJ()), t - 40.35, 2.0, [0, Math.PI / 2, 0], 0.5, '#ffffff'); }
      ov.fxs = t > 40.35 && t < 41.1 ? ['POW!', seg(t, 40.35, 40.5), '#fff', 50, 34, 260] : null;
      // a mãe corre
      const r1 = lin(t, 40.9, 42.0), r2 = lin(t, 42.0, 42.9), cr = seg(t, 42.9, 43.4);
      if (t < 40.9) { mp = MOMIN; mry = facing(MOMIN, FIN); mface = { open: 1.3, mouth: 'o', brow: 1.2 }; }
      else if (t < 42.0) { mp = mix3(MOMIN, rp([-2.5, 0.86, -2.0]), r1); mry = facing(MOMIN, rp([-2.5, 0, -2.0])); }
      else if (t < 42.9) { const w1 = rp([-2.5, 0.86, -2.0]), w2 = rp([-2.5, 0.86, -3.55]), w3 = rp([0.5, 0.86, -3.55]); mp = r2 < 0.4 ? mix3(w1, w2, r2 / 0.4) : mix3(w2, w3, (r2 - 0.4) / 0.6); mry = r2 < 0.4 ? Math.PI : Math.PI / 2; }
      else { mp = mix3(rp([0.5, 0.86, -3.55]), HIDE, cr); mry = 0; mface = { open: 1.3, mouth: 'o', brow: 1.2, look: [0.3, -0.3] }; }
      if (t > 40.9 && t < 42.9) { const w = walkPose(t * 3.2, 1.3); mpose = { ...w, armR: [w.armR[0] + 0.6, 0.1, 1.0], armL: w.armL }; mface = { open: 1.3, mouth: 'o', brow: 1.2 }; mp = [mp[0], mp[1] + w.bob, mp[2]]; }
      else if (t >= 42.9) mpose = { armR: [1.1, 0.1, 1.2], armL: [0.8, 0.3, 1.6], leg: [1.4 * cr, 1.4 * cr], lean: 0.3 * cr };
      if (t < 40.35) { camPos = rp([1.8, 1.8, 6.6]); camLook = rp([3.4, 1.6, 1.8]); camera.fov = 54; roll = -0.08; }
      else if (t < 41.0) { camPos = rp([3.0, 1.9, 6.6]); camLook = rp([5.0, 1.8, 2.3]); camera.fov = 54; roll = 0.1; }
      else { camPos = rp([0.5, 2.9, 7.6]); camLook = rp([-0.6, 1.0, -1.8]); camera.fov = 58; }
    } else if (t < 48.0) { // soco, esquiva (câmera lenta), contra-ataque, a mesa voa
      mp = HIDE; mry = 0; mpose = { armR: [1.1, 0.1, 1.2], armL: [0.8, 0.3, 1.6], leg: [1.4, 1.4], lean: 0.3 }; mface = { open: 1.3, mouth: 'o', brow: 1.2, look: [0.4, -0.3] };
      const FA = rp([0.9, 0.86, 1.6]), JA = rp([3.6, 0.86, 2.0]);
      const slow = t > 44.75 && t < 45.75, tt = slow ? 44.75 + (t - 44.75) * 0.3 : t;
      const lunge = seg(tt, 44.6, 44.95), dodge = seg(tt, 44.7, 45.0);
      J2b.position.set(...mix3(FA, rp([2.0, 0.86, 1.8]), lunge)); J2b.rotation.y = facing(FA, JA); jo2.pose({ breathe: 0, lean: 0.3 * lunge, armR: [1.6 * lunge + 0.4, -0.1, 0.05 + 1.5 * (1 - lunge)], armL: [0.9, 0.2, 1.8], leg: [0.5, -0.3] }); jo2.face({ open: 1, mouth: 'flat', brow: -0.9, browTilt: 0.9 });
      J.position.set(...JA); J.position.y -= 0.35 * dodge * (1 - seg(t, 45.75, 46.0)); J.rotation.y = facing(JA, FA); J.rotation.z = 0.35 * dodge * (1 - seg(t, 45.75, 46.0));
      const cnt = seg(t, 45.75, 45.95); jo.pose({ breathe: jb, lean: 0.2, armR: [cnt > 0 ? 1.6 * cnt : 0.6, -0.1, 0.05 + 1.5 * (1 - cnt)], armL: [0.9, 0.2, 1.8], leg: [0.5, -0.3] }); fightFace({ brow: -0.9, browTilt: 0.8, look: [0.3, 0.1] }); auraJ(0.35, t);
      ov.slow = slow ? 1 : 0;
      if (t > 45.95 && t < 46.02) impact = true; if (t > 45.95 && t < 46.3) shake = 0.1;
      if (t > 45.95) { J2b.position.x -= 0.6 * seg(t, 45.95, 46.3); sparkBurst(A3(V3(J2b.position.toArray()).add(new THREE.Vector3(0, 1.9, 0))), lin(t, 45.95, 46.4), 1.3, '#ffd60a'); }
      ov.fxs = t > 45.95 && t < 46.5 ? ['BAM!', seg(t, 45.95, 46.1), '#ffd60a', 50, 33, 240] : null;
      // telecinese: a mesa sobe e voa
      const lift = seg(t, 46.4, 46.95), fly = lin(t, 46.95, 47.35);
      if (t > 46.4) {
        jo.pose({ breathe: jb, armR: [1.4, 0.4, 0.1], armL: [0.3, 0.2, 0.4], lean: 0.05 }); eyeGlow.forEach(g => { g.visible = true; g.material.opacity = 0.9; });
        const fpos = A3(J2b.position); const m0 = [MESA0[0], MESA0[1] + 1.6 * lift, MESA0[2] + 0.6 * lift];
        const mpz = mix3(m0, [fpos[0] + 0.2, fpos[1] + 0.4, fpos[2]], fly * fly); mesa.position.set(...mpz); mesa.rotation.set(0.4 * lift + fly * 4, fly * 3, 0.3 * lift);
        rocksAround([mpz[0], mpz[1] + 0.3, mpz[2]], 1.0, t, lift * (1 - fly), 0.6, 3, 12);
        motes.forEach((m, i) => { if (i < 10) { m.visible = true; m.position.set(mpz[0] + Math.cos(t * 4 + i) * 1.0, mpz[1] + 0.5 + Math.sin(t * 5 + i) * 0.3, mpz[2] + Math.sin(t * 4 + i) * 0.6); m.scale.setScalar(1.4); } });
        auraLight.position.set(mpz[0], mpz[1] + 0.8, mpz[2] + 1); auraLight.intensity = 6;
        if (t > 47.35) { mesa.visible = false; shardsAt([fpos[0] + 0.2, fpos[1] + 0.6, fpos[2]], lin(t, 47.35, 48.0), 2.2, [-1, 0, 0]); J2b.position.x -= 0.8 * seg(t, 47.35, 47.6); J2b.rotation.z = 0.3 * seg(t, 47.35, 47.6); }
      }
      if (t > 47.35 && t < 47.42) impact = true; if (t > 47.35 && t < 47.7) shake = 0.12;
      ov.fxs = ov.fxs || (t > 47.35 && t < 48.0 ? ['CRASH!', seg(t, 47.35, 47.5), '#fff', 45, 35, 220] : null);
      if (t < 44.75) { camPos = rp([2.3, 1.9, 6.9]); camLook = rp([2.3, 1.7, 1.8]); camera.fov = 54; }
      else if (t < 45.95) { const a = -0.5 + 0.7 * lin(t, 44.75, 45.95); camPos = rp([2.3 + Math.sin(a) * 5.0, 1.8, 1.8 + Math.cos(a) * 5.0]); camLook = rp([2.3, 1.7, 1.8]); camera.fov = 52; }
      else if (t < 46.4) { camPos = rp([0.2, 1.3, 6.2]); camLook = rp([1.2, 1.8, 1.7]); camera.fov = 54; roll = 0.1; }
      else { camPos = rp([2.2, 1.5, 7.6]); camLook = rp([1.4, 1.8, 0.0]); camera.fov = 58; }
    } else if (t < 53.6) { // raio vermelho x escudo dourado; explosão
      mp = HIDE; mry = 0; mpose = { armR: [1.1, 0.1, 1.2], armL: [0.8, 0.3, 1.6], leg: [1.4, 1.4], lean: 0.3 }; mface = { open: 1.3, mouth: 'o', brow: 1.2, look: [0.4, -0.3] };
      const FB = rp([0.0, 0.86, 1.4]), JB = rp([3.4, 0.86, 2.0]);
      J2b.position.set(...FB); J2b.rotation.y = facing(FB, JB); jo2.pose({ breathe: 0, lean: -0.1, armR: [0.3, 0.4, 0.3], armL: [0.3, 0.4, 0.3] }); jo2.face({ open: 1, mouth: 'flat', brow: -0.9, browTilt: 0.9 }); glint.material.opacity = 1;
      J.position.set(...JB); J.rotation.y = facing(JB, FB); const sh = seg(t, 48.85, 49.1);
      jo.pose({ breathe: jb, armR: [1.5 * sh + 0.2, -0.3, 0.1], armL: [1.5 * sh + 0.2, -0.3, 0.1], lean: 0.12, leg: [0.5, -0.4] }); fightFace({ brow: -0.9, browTilt: 0.8, mouth: t > 50.4 ? 'o' : 'flat' }); auraJ(0.4 + 0.2 * seg(t, 50.0, 50.8), t, 1.0);
      const [ea, eb] = flyEyes(jo2); scene.updateMatrixWorld(true); jo.handR.getWorldPosition(q1); jo.handL.getWorldPosition(v); const hc = q1.clone().add(v).multiplyScalar(0.5);
      const sc = hc.clone().add(V3(A3(V3(FB).sub(V3(JB)).normalize())).multiplyScalar(0.55)); sc.y += 0.25;
      const on = seg(t, 48.25, 48.4) * (1 - seg(t, 51.0, 51.1));
      const tip = t < 48.9 ? ea.clone().lerp(sc, seg(t, 48.25, 48.9)) : sc.clone().lerp(ea, 0.45 * seg(t, 50.3, 51.0));
      setBig(rBeam, ea.clone().lerp(eb, 0.5), tip, on, 0.55, t); eyeLight.position.copy(ea); eyeLight.intensity = 6 * on;
      if (t > 48.85 && t < 51.0) { setShield(sc, ea, 0.9 + 0.25 * seg(t, 50.3, 50.9), sh, t); for (let i = 0; i < 8; i++) { const d = new THREE.Vector3(hash(i + Math.floor(t * 15)) - 0.5, hash(i + 3 + Math.floor(t * 15)) - 0.5, hash(i + 7 + Math.floor(t * 15)) - 0.5).normalize().multiplyScalar(1.1); setArc(i, tip, tip.clone().add(d), i * 7 + Math.floor(t * 20), 0.85, i % 2 ? '#ffe066' : '#ff8fa3'); } clashLight.position.copy(tip); clashLight.intensity = 14; }
      rLight.position.copy(ea); rLight.intensity = 8 * on;
      const bt = 51.0, bk = lin(t, bt, bt + 1.2);
      if (t > bt) { fireAt(0, A3(sc), bk, 3.2); fireAt(1, A3(sc.clone().add(new THREE.Vector3(0.6, 0.4, 0))), lin(t, bt + 0.1, bt + 1.2), 2.4); fireLight.position.copy(sc); fireLight.intensity = 20 * (1 - bk); for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 0.5 + 4.5 * Math.sqrt(lin(t, bt, bt + 2.4)) * (0.5 + 0.5 * hash(i)); puff(i, [sc.x + Math.cos(a) * r, RY + 0.6 + 1.8 * hash(i + 1), sc.z + Math.sin(a) * r * 0.7], 0.35 + 0.6 * lin(t, bt, 53.6), 1.8, '#77727c'); } shardsAt(A3(sc), lin(t, bt, bt + 1), 3.5); J.position.x += 0.6 * seg(t, bt, bt + 0.3); J2b.position.x -= 0.6 * seg(t, bt, bt + 0.3); }
      if (t > bt && t < bt + 0.07) impact = true; if (t > bt && t < bt + 0.35) flash = 1 - (t - bt) / 0.35; if (t > bt && t < bt + 0.8) shake = 0.15;
      ov.fxs = t > bt && t < bt + 0.9 ? ['BOOM!', seg(t, bt, bt + 0.15), '#ff9f1c', 50, 30, 270] : null;
      ov.fxs = ov.fxs || (t > 48.9 && t < 49.6 ? ['ESCUDO!', seg(t, 48.9, 49.05), '#ffd60a', 50, 25, 170] : null);
      if (t < 48.85) { camPos = rp([-1.4, 2.3, 5.8]); camLook = rp([1.6, 1.9, 1.7]); camera.fov = 54; roll = -0.08; }
      else if (t < 51.0) { const m = A3(V3(FB).lerp(V3(JB), 0.6)); camPos = [m[0] - 0.4, m[1] + 0.9, m[2] + 6.4]; camLook = [m[0], m[1] + 1.0, m[2]]; camera.fov = 56; }
      else { camPos = rp([0.8, 2.8, 8.4]); camLook = rp([1.5, 1.3, 1.0]); camera.fov = 60; }
      ov.silence = t > 51.6;
    } else { // ---- depois da fumaça ----
      const L0 = SL, R0 = SR; // o falso está à ESQUERDA (mas ninguém sabe)
      J2b.position.set(...L0); J.position.set(...R0); J2b.rotation.y = 0; J.rotation.y = 0; glint.material.opacity = 0;
      jo2.pose({ breathe: breath(t, 2), armL: [0.1, 0.15, 0.3], armR: [0.1, 0.15, 0.3] }); jo.pose({ breathe: jb, armL: [0.1, 0.15, 0.3], armR: [0.1, 0.15, 0.3] });
      fakeFace({ look: [0, 0] }); jo.face({ open: blink(t), mouth: 'flat', look: [0, 0], talk: talkJ });
      mp = HIDE; mry = 0; mpose = { armR: [1.1, 0.1, 1.2], armL: [0.8, 0.3, 1.6], leg: [1.4, 1.4], lean: 0.3 }; mface = { open: 1.3, mouth: 'o', brow: 1.1, look: [Math.sin(t * 1.7) > 0 ? 0.6 : -0.6, -0.2] };
      if (t < 57.4) {
        const k = lin(t, 53.6, 57.4); for (let i = 0; i < 20; i++) { const a = i * 2.4; puff(i, rp([Math.cos(a) * (1 + 3 * hash(i)), 0.6 + 1.5 * hash(i + 1), 1 + Math.sin(a) * 2]), 0.45 + 0.55 * k, 1.8, '#77727c'); }
        ov.qm = seg(t, 55.4, 55.7); const up = seg(t, 54.2, 55.0); mp = [HIDE[0], lerp(HIDE[1], 0.55 + RY, up) , HIDE[2]];
        camPos = rp([0, 2.1, 7.8]); camLook = rp([0, 1.7, 0]); camera.fov = 58;
      } else if (t < 61.4) { // "mãe, sou eu!" / "não, mãe! sou eu!"
        mp = [HIDE[0], 0.55 + RY, HIDE[2]];
        const left = t < 59.15;
        if (left) { jo2.pose({ breathe: 0, armL: [0.35, 1.25, 0.1], armR: [0.6, 0.1, 1.4] }); fakeFace({ open: 1.2, brow: 0.9, look: [0, 0.1] }); CL(SL, 0.5); }
        else { jo.pose({ breathe: jb, armR: [0.35, 1.25, 0.1], armL: [0.6, 0.1, 1.4] }); fightFace({ brow: 0.9, browTilt: -0.3, look: [0, 0.1] }); CL(SR, -0.5); }
      } else if (t < 64.3) { // a mãe se levanta e abre os braços
        const st = seg(t, 61.45, 62.2), ar = seg(t, 62.2, 63.0);
        mp = mix3([HIDE[0], 0.55 + RY, HIDE[2]], MOMHUG, st); mry = 0;
        mpose = { armR: [lerp(1.1, 1.3, ar), lerp(0.1, 0.9, ar), lerp(1.2, 0.3, ar)], armL: [lerp(0.2, 1.3, ar), lerp(0.3, 0.9, ar), 0.3], leg: [0, 0] }; mface = { open: blink(t), mouth: 'smile', brow: 0.4, browTilt: -0.3, look: [0, -0.1] };
        camPos = rp([-3.3, 1.9, 1.3]); camLook = [MOMHUG[0], MOMHUG[1] + 1.1, MOMHUG[2]]; camera.fov = 50;
        if (st < 1) { camPos = rp([0, 2.1, 7.4]); camLook = rp([0, 1.2, -1]); camera.fov = 56; }
      } else { // o abraço; o falso calcula; o disfarce cai; o robô foge
        mp = MOMHUG; mry = 0; mface = { open: 0.15, mouth: 'smile', brow: 0.5, browTilt: -0.4 };
        const run = lin(t, 64.5, 65.6), HUGP = [MOMHUG[0] + 0.72, MOMHUG[1] - 0.1, MOMHUG[2] + 1.02];
        const wk = walk(SR, HUGP, run, t * 3); J.position.set(...wk[0]); J.position.y += wk[1].bob; J.rotation.y = run < 1 ? facing(SR, HUGP) : facing(HUGP, MOMHUG);
        if (run < 1) { jo.pose({ ...wk[1], breathe: 0, lean: 0.2 }); jo.face({ open: 1.1, mouth: 'smile', brow: 0.4, look: [0, 0] }); mpose = { armR: [1.3, 0.9, 0.3], armL: [1.3, 0.9, 0.3] }; mface = { open: 1, mouth: 'smile', brow: 0.4 }; }
        else { jo.pose({ breathe: jb, lean: 0.12, armR: [1.45, 0.15, 0.7], armL: [1.45, 0.15, 0.7], head: [0.05, 0.3, 0.12] }); jo.face({ open: 0.15, mouth: 'smile', brow: 0.5, browTilt: -0.4 }); mry = facing(MOMHUG, HUGP); mpose = { armR: [1.45, 0.2, 0.7], armL: [1.45, 0.2, 0.7], head: [0.1, -0.2, -0.1], lean: 0.12 }; }
        const HM = mix3(MOMHUG, HUGP, 0.5);
        const warm = seg(t, 65.6, 66.4); if (t > 65.6) { motes.forEach((m, i) => { const ph = ((t * 0.4 + i / 20) % 1); m.visible = true; m.position.set(HUGP[0] + Math.cos(i * 2.3 + t) * 1.4, HUGP[1] - 0.6 + ph * 3.2, HUGP[2] - 0.5 + Math.sin(i * 2.3 + t) * 1.0); m.scale.setScalar(1.3 * (1 - ph) * warm); }); auraLight.position.set(HUGP[0], HUGP[1] + 1.6, HUGP[2] + 1.2); auraLight.intensity = 7 * warm; }
        // o falso
        const glitch = t > 71.4 ? Math.sin(t * 53) > 0.3 : false, rev = seg(t, 80.1, 81.3);
        const FP = SL; J2b.position.set(FP[0] + (glitch ? 0.06 * Math.sin(t * 97) : 0), FP[1], FP[2]); J2b.rotation.y = 0.45;
        jo2.pose({ breathe: 0 }); jo2.face({ open: 1, mouth: 'flat', brow: 0, look: [0.5, 0] }); glint.material.opacity = t > 68.4 ? 0.7 + 0.3 * Math.sin(t * 25) : 0;
        if (t > 80.0) {
          const flick = rev < 1 ? (Math.floor(t * 18) % 2 === 0) : true;
          J2b.visible = !flick; robot.visible = flick; robot.position.set(FP[0], FP[1] - 0.86, FP[2]); robot.rotation.y = 0.45 - 0.45 * seg(t, 82.3, 82.8);
          if (rev < 1) { sparkBurst([FP[0], FP[1] + 1.2, FP[2]], (t * 3) % 1, 1.4, '#ff2d55'); }
          eyeMat.emissiveIntensity = 9; auraR(0.6 * rev, t);
          if (t > 82.5 && t < 86.6) { mouthMat.emissiveIntensity = 0.4 + 6 * amp; rmouth.scale.set(1, 1 + 5 * amp, 1); }
          // foge pela janela
          const fly = lin(t, 86.6, 87.3), WIN = rp([3.3, 2.0, -4.4]);
          if (t > 86.2) { thr.forEach(g => g.visible = true); robot.position.y += 0.3 * seg(t, 86.2, 86.6); }
          if (t > 86.6) { const p = mix3([FP[0], FP[1] - 0.56, FP[2]], WIN, fly * fly); robot.position.set(...p); robot.rotation.set(-0.6 * fly, facing(FP, WIN), 0); }
          if (t > 87.1) { winGlass.visible = false; shardsAt(rp([3.3, 2.0, -3.9]), lin(t, 87.1, 87.6), 2.0); } else winGlass.visible = true;
        } else winGlass.visible = true;
        if (t > 71.4 && t < 80.0 && Math.sin(t * 31) > 0.85) { J2b.visible = false; robot.visible = true; robot.position.set(FP[0], 0, FP[2]); robot.position.y = FP[1] - 0.86; robot.rotation.y = 0.45; }
        // câmeras
        if (t < 65.6) { camPos = rp([4.2, 1.9, 5.6]); camLook = rp([0.3, 1.3, 0.2]); camera.fov = 56; }
        else if (t < 68.3) { const k = lin(t, 65.6, 68.3); camPos = [MOMHUG[0] - 0.577 * 3.0 - 1.06 - 0.3 * k, MOMHUG[1] + 1.3, MOMHUG[2] - 0.817 * 3.0 + 0.75]; camLook = [HUGP[0], HUGP[1] + 1.3, HUGP[2]]; camera.fov = 52; }
        else if (t < 74.3) { CL(FP, 0.6); ov.hud2 = t < 71.4 ? 'CALCULANDO' : 'ERRO'; roll = t > 71.4 ? 0.06 * Math.sin(t * 7) : 0; }
        else if (t < 80.0) { const k = sm((t - 74.3) / 5.7); camPos = [MOMHUG[0] - 0.577 * lerp(3.0, 2.4, k) - 1.06, MOMHUG[1] + 1.3, MOMHUG[2] - 0.817 * lerp(3.0, 2.4, k) + 0.75]; camLook = [HUGP[0], HUGP[1] + 1.3, HUGP[2]]; camera.fov = 48; ov.coracao = seg(t, 77.5, 78.0); }
        else if (t < 86.6) { camPos = [FP[0] + 1.2, FP[1] + 0.6, FP[2] + 5.2]; camLook = [FP[0], FP[1] + 1.4, FP[2]]; camera.fov = 54; if (t < 81.3) shake = 0.04; }
        else if (t < 87.6) { camPos = rp([-1.0, 1.6, 6.4]); camLook = rp([2.6, 2.0, -3.6]); camera.fov = 56; }
        if (t > 80.1 && t < 80.2) flash = 0.5;
        if (t > 65.6 && t < 80.0) { thumbKey2.color.set('#ffd9a8'); thumbKey2.position.set(HUGP[0] - 1.6, HUGP[1] + 1.6, HUGP[2] - 1.6); thumbKey2.intensity = 7; }
      }
    }
    if (t >= 87.6) { // ======== lá fora: o céu cheio de olhos vermelhos; fim da temporada ========
      room.visible = false; street.visible = true; scene.background.set('#2b2140'); hemi.intensity = 0.35; sun.intensity = 0.5; roomLamp.intensity = moonL.intensity = roomFill.intensity = 0; auraLight.intensity = 0;
      motes.forEach(m => m.visible = false); J2b.visible = false; robot.visible = true; thr.forEach(g => g.visible = true);
      const k = lin(t, 87.6, 93); robot.position.set(lerp(2.5, 7, k), lerp(5, 19, k), lerp(15, 32, k)); robot.rotation.set(0.9, 0, 0); robot.scale.setScalar(1.35);
      mp = [-0.75, 0.86, 9.6]; mry = 0; mpose = { armR: [1.1, 0.1, 1.2], armL: [0.6, 0.6, 0.5], head: [-0.4, 0, 0] }; mface = { open: 1.2, mouth: 'o', brow: 1.0, look: [0, 0.6] };
      J.position.set(0.75, 0.86, 9.6); J.rotation.set(0, 0, 0); jo.pose({ breathe: jb, armL: [0.3, 0.2, 0.2], head: [-0.4, 0, 0] }); jo.face({ open: 1.1, mouth: 'flat', brow: -0.6, browTilt: 0.6, look: [0, 0.6] });
      setArmy(seg(t, 87.9, 89.5), t); outside(); homeFill.position.set(0, 4, 4); homeFill.intensity = 2.5;
      const z = lerp(3.4, 4.4, sm((t - 87.6) / 10)); camPos = [0.2, 0.7, z]; camLook = [0, 9.5, 22]; camera.fov = 70;
      ov.fim = t > 87.6 && t < 89.7 ? seg(t, 87.65, 87.9) : 0;
      ov.cta = seg(t, 89.8, 90.1) * (1 - seg(t, 95.1, 95.3)); ov.end = seg(t, 95.3, 95.6);
    }
    mom.root.visible = true; mom.root.position.set(...mp); mom.root.rotation.set(0, mry, 0); mom.pose({ breathe: breath(t, 1), armR: [1.1, 0.1, 1.2], ...mpose }); mom.face({ open: blink(t, 0.6), mouth: 'flat', ...mface });
    scene.updateMatrixWorld(true); lantern.getWorldPosition(q1); lanternLight.position.copy(q1); lanternLight.intensity = 7;
  }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll);
  sky.position.copy(camera.position);
  renderer.render(scene, camera);

  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : ov.recap ? 'grayscale(0.85) contrast(1.05)' : ov.slow ? 'saturate(0.65) contrast(1.15)' : '';
  $('burst').style.opacity = impact ? 1 : 0;
  $('flash').style.opacity = flash;
  $('lb').style.opacity = ov.slow ? 1 : 0;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); if (!e) return; e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('recap', ov.recap ? 1 : 0); pop('qual', ov.qual || 0); pop('day', ov.day || 0); pop('teste', ov.teste || 0); pop('trava', ov.trava || 0);
  pop('fim', ov.fim || 0); pop('cta', ov.cta || 0); pop('end', ov.end || 0); pop('coracao', ov.coracao || 0);
  const cp2 = $('copia'); cp2.style.opacity = ov.copia ? 1 : 0; cp2.textContent = ov.copiaTxt || '';
  const hud = $('hud'); hud.style.opacity = ov.hud ? 1 : 0;
  if (ov.hud) { const items = ['ANIVERSÁRIO: 12/03', 'BOLO: CENOURA C/ CHOCOLATE', 'BORDA: QUEIMADA', 'APELIDO: "JÔ"', 'MEDO: ESCURO (5 ANOS)', 'COR FAVORITA: VERDE', 'MEMÓRIAS: 100%']; const n = t < 24.6 ? 3 : Math.min(items.length, 3 + Math.floor((t - 24.6) * 1.4)); hud.innerHTML = items.slice(0, n).map((s, i) => `<div style="opacity:${i === n - 1 ? 0.6 + 0.4 * Math.sin(t * 20) : 1}">▸ ${s}</div>`).join(''); }
  const h2 = $('hud2'); h2.style.opacity = ov.hud2 ? 1 : 0;
  if (ov.hud2 === 'CALCULANDO') { const p = Math.floor(lin(t, 68.4, 71.3) * 99); h2.innerHTML = `ABRAÇO.EXE<br><span style="font-size:70px">CALCULANDO... ${p}%</span>`; h2.style.color = '#ff8fa3'; }
  else if (ov.hud2 === 'ERRO') { h2.innerHTML = `ERRO!<br><span style="font-size:70px">ABRAÇO NÃO ENCONTRADO</span>`; h2.style.color = '#ff2d55'; h2.style.transform = `translateX(-50%) translateX(${Math.sin(t * 61) * 8}px)`; }
  const fx = $('fx'); if (ov.fxs) { const [txt, k, col, x, y, size] = ov.fxs; fx.style.opacity = 1; fx.textContent = txt; fx.style.left = x + '%'; fx.style.top = y + '%'; fx.style.fontSize = size + 'px'; fx.style.color = col; fx.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fx.style.opacity = 0;
  // pontos de interrogação sobre as cabeças
  const qa = $('qa'), qb = $('qb');
  if (ov.qm) { scene.updateMatrixWorld(true); jo2.head.getWorldPosition(e1); jo.head.getWorldPosition(e2); place(qa, [e1.x, e1.y + 1.45, e1.z], true, ov.qm); place(qb, [e2.x, e2.y + 1.45, e2.z], true, ov.qm); } else { qa.style.opacity = 0; qb.style.opacity = 0; }
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cpx = $('cap'); cpx.textContent = c ? c.s : ''; cpx.style.opacity = c ? 1 : 0; cpx.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
