
// ================= ARENA 3: personagens no corpo do Mixamo =================
import { makeFighter, clipOf } from '../../_lib/mixamo.js';
import { makeJoseph, refineHead } from '../../_lib/joseph2.js';
import aIdle from '../../_lib/mixamo/Bouncing_Fight_Idle.fbx';
import aStand from '../../_lib/mixamo/Standing_idle.fbx';
import aSit from '../../_lib/mixamo/Dodge_While_Sitting.fbx';
import aGetUp from '../../_lib/mixamo/Getting_Up_1.fbx';
import aKO from '../../_lib/mixamo/Knocked_Out_1.fbx';
import aStun from '../../_lib/mixamo/Stunned.fbx';
import aCombo from '../../_lib/mixamo/Combo_Punch.fbx';
import aJab from '../../_lib/mixamo/Jab_Cross.fbx';
import aBox from '../../_lib/mixamo/Boxing_1.fbx';
import aDodge from '../../_lib/mixamo/Dodging.fbx';
import aDodgeB from '../../_lib/mixamo/Dodging_Back.fbx';
import aUpper from '../../_lib/mixamo/Surprise_Uppercut.fbx';
import aFlip from '../../_lib/mixamo/Back_Flip_To_Uppercut.fbx';
import aKick from '../../_lib/mixamo/Roundhouse_Kick.fbx';
import aHurr from '../../_lib/mixamo/Hurricane_Kick.fbx';
import aMma from '../../_lib/mixamo/Mma_Kick.fbx';
import aFlyBack from '../../_lib/mixamo/Flying_Back_Death.fbx';
import aFly from '../../_lib/mixamo/Flying.fbx';
import aLand from '../../_lib/mixamo/Hard_Landing.fbx';
import aFire from '../../_lib/mixamo/Fireball.fbx';
import aMag from '../../_lib/mixamo/Standing_2H_Magic_Attack_01.fbx';
import aArea from '../../_lib/mixamo/Standing_2H_Magic_Area_Attack_01.fbx';
import aCast from '../../_lib/mixamo/Standing_2H_Cast_Spell_01.fbx';
import aReach from '../../_lib/mixamo/Standing_1H_Magic_Attack_01.fbx';
import aHit from '../../_lib/mixamo/Hit_Reaction.fbx';
import aHeal from '../../_lib/mixamo/Magic_Heal.fbx';

const fx = makeFX(renderer, scene, camera, W, H);
const C = {}; Object.entries({ idle: aIdle, stand: aStand, sit: aSit, getup: aGetUp, ko: aKO, stun: aStun, combo: aCombo, jab: aJab, box: aBox, dodge: aDodge, dodgeB: aDodgeB, upper: aUpper, flip: aFlip, kick: aKick, hurr: aHurr, mma: aMma, flyback: aFlyBack, fly: aFly, land: aLand, fire: aFire, mag: aMag, area: aArea, cast: aCast, reach: aReach, hit: aHit, heal: aHeal }).forEach(([k, u]) => C[k] = clipOf(u));
const lp = (c, x) => (x % c.duration + c.duration) % c.duration;
const at = (c, x) => Math.max(0, Math.min(c.duration - 0.01, x));

// ---- Joseph novo + bracelete ----
const JO = makeJoseph(aIdle); const FJ = JO.F, jc = JO.c;
const braceN = mesh(new THREE.TorusGeometry(0.07, 0.025, 10, 24), braceMat, scene);
const qb = new THREE.Quaternion(), qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), PI2);
function syncBrace() { braceN.visible = FJ.root.visible; if (!braceN.visible) return; const p = FJ.world('LeftHand', [0, -3, 0]); braceN.position.copy(p); FJ.bones.LeftHand.getWorldQuaternion(qb); braceN.quaternion.copy(qb).multiply(qx); }

// ---- Vorg (aliado) ----
const ROUPA_VORG = n => /Hand|Thumb|Index|Middle|Ring|Pinky/.test(n) ? '#1b1d2e' : /Foot|Toe|UpLeg|Leg|Hips/.test(n) ? '#141414' : '#3d405b';
const FV = makeFighter(scene, aIdle, { scale: 0.0172, paint: ROUPA_VORG });
const VH = new THREE.Group(); { const sk = M('#3d405b', { roughness: 0.6 }), gold = M('#d4a017', { metalness: 0.8, roughness: 0.25 });
  mesh(rbox(0.46, 0.5, 0.44, 0.12), sk, VH, [0, 0, 0]); mesh(rbox(0.4, 0.16, 0.36, 0.06), M('#1b1d2e'), VH, [0, -0.25, 0.05]);
  for (const s of [-1, 1]) { mesh(new THREE.ConeGeometry(0.07, 0.4, 12), gold, VH, [s * 0.2, 0.32, -0.02], [0, 0, -s * 0.5]); }
  VH.eyeM = new THREE.MeshStandardMaterial({ color: '#300', emissive: '#ff1f3d', emissiveIntensity: 3 }); for (const s of [-1, 1]) mesh(rbox(0.12, 0.05, 0.03, 0.01), VH.eyeM, VH, [s * 0.1, 0.05, 0.225]);
  mesh(rbox(0.32, 0.05, 0.02, 0.01), M('#1b1d2e'), VH, [0, -0.13, 0.225]); }
FV.attachHead(VH, [0, 10, 2]);
for (const s of [-1, 1]) { const pad = new THREE.Group(); mesh(sph(0.2, 16, 12), M('#121212', { metalness: 0.85, roughness: 0.28 }), pad, [0, 0, 0], [0, 0, 0], [1.2, 0.6, 1.1]); mesh(new THREE.ConeGeometry(0.05, 0.22, 10), M('#d4a017', { metalness: 0.8, roughness: 0.25 }), pad, [0, 0.14, 0]); FV.attach(s < 0 ? 'LeftShoulder' : 'RightShoulder', pad, [s * -2, 12, 0]); }
{ const em = new THREE.Group(); mesh(new THREE.OctahedronGeometry(0.09), new THREE.MeshStandardMaterial({ color: '#300', emissive: '#ff1f3d', emissiveIntensity: 3 }), em, [0, 0, 0], [0, 0, 0], [1, 1.3, 0.4]); FV.attach('Spine2', em, [0, 6, 14]); }

// ---- Zentrix (o mais rápido) + 2 cópias ----
const ROUPA_ZEN = n => /Hand|Thumb|Index|Middle|Ring|Pinky/.test(n) ? '#caf0f8' : /Foot|Toe/.test(n) ? '#ffd60a' : /UpLeg|Leg|Hips/.test(n) ? '#0077b6' : '#00b4d8';
const zenHead = (mat, vis) => { const g = new THREE.Group(); mesh(sph(0.2, 20, 14), mat, g, [0, 0, 0], [0, 0, 0], [0.85, 1.15, 1.05]); mesh(new THREE.ConeGeometry(0.05, 0.28, 10), mat, g, [0, 0.2, -0.1], [-0.9, 0, 0]); mesh(rbox(0.3, 0.07, 0.1, 0.03), vis, g, [0, 0.03, 0.17]); return g; };
const FZ = makeFighter(scene, aIdle, { scale: 0.0135, paint: ROUPA_ZEN });
const visM = new THREE.MeshStandardMaterial({ color: '#332200', emissive: '#ffd60a', emissiveIntensity: 2.5 });
FZ.attachHead(zenHead(M('#00b4d8', { roughness: 0.3, metalness: 0.3 }), visM), [0, 9, 2]);
const ghostM = ADD('#48cae4', 0.32);
const FZg = [0, 1].map(() => { const F = makeFighter(scene, aIdle, { scale: 0.0135 }); F.model.traverse(n => { if (n.isMesh) { n.material = ghostM; n.castShadow = false; } }); F.attachHead(zenHead(ghostM, ghostM), [0, 9, 2]); return F; });

// ---- Grolm (gigante de pedra) ----
const ROUPA_GROLM = n => /Hand|Thumb|Index|Middle|Ring|Pinky|Foot|Toe/.test(n) ? '#4a4652' : /UpLeg|Leg|Hips/.test(n) ? '#57535e' : '#6d6875';
const FG = makeFighter(scene, aIdle, { scale: 0.05, paint: ROUPA_GROLM });
FG.model.traverse(n => { if (n.isMesh) n.material.flatShading = true; });
const GH = new THREE.Group(); { mesh(new THREE.DodecahedronGeometry(0.75), rockM, GH, [0, 0, 0], [0, 0, 0], [1, 0.9, 0.95]); GH.eyeM = new THREE.MeshStandardMaterial({ color: '#331', emissive: '#ffb703', emissiveIntensity: 3 }); for (const s of [-1, 1]) mesh(sph(0.1, 10, 8), GH.eyeM, GH, [s * 0.25, 0.08, 0.62]); }
FG.attachHead(GH, [0, 9, 2]);
for (const s of [-1, 1]) { const r = new THREE.Group(); mesh(new THREE.DodecahedronGeometry(1.0), rockM, r, [0, 0, 0]); mesh(new THREE.DodecahedronGeometry(0.6), rockM, r, [s * 0.5, 0.6, -0.3]); FG.attach(s < 0 ? 'LeftShoulder' : 'RightShoulder', r, [s * -3, 12, -2]); }
const crystalM = new THREE.MeshStandardMaterial({ color: '#2b0040', emissive: '#e0aaff', emissiveIntensity: 3 });
const crystal = new THREE.Group(); mesh(new THREE.OctahedronGeometry(0.35), crystalM, crystal, [0, 0, 0], [0, 0, 0], [1, 1.5, 1]); FG.attach('Neck', crystal, [0, 4, -11]);
const crystalLight = new THREE.PointLight('#e0aaff', 0, 10, 1.4); scene.add(crystalLight);

// ---- Nyx (a Sombra) ----
const nyxM = new THREE.MeshStandardMaterial({ color: '#120822', emissive: '#3c096c', emissiveIntensity: 0.7, roughness: 0.4, transparent: true, opacity: 0.93 });
const FN = makeFighter(scene, aIdle, { scale: 0.0135 }); FN.model.traverse(n => { if (n.isMesh) n.material = nyxM; });
const nc0 = makeChar(); nc0.root.visible = false; refineHead(nc0);
nc0.mats.skin.color.set('#1a0b2e'); nc0.mats.skin.emissive.set('#5a189a'); nc0.mats.skin.emissiveIntensity = 0.5;
nc0.head.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHexString() === 'ffffff') { o.material = new THREE.MeshBasicMaterial({ color: '#f3e8ff', toneMapped: false }); } });
nc0.pupils.forEach(p => p.visible = false); nc0.brows.forEach(b => b.material = new THREE.MeshBasicMaterial({ color: '#000' }));
const nyxBlob = new THREE.Group(); mesh(sph(0.32, 20, 14), nyxM, nyxBlob, [0, 0, 0], [0, 0, 0], [0.9, 1.1, 0.95]); for (const s of [-1, 1]) mesh(sph(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: '#f3e8ff', toneMapped: false }), nyxBlob, [s * 0.11, 0.04, 0.28]);
FN.attachHead(nc0.head, [0, 9, 3]); FN.attachHead(nyxBlob, [0, 9, 2]);
const nyxLight = new THREE.PointLight('#9d4edd', 0, 12, 1.3); scene.add(nyxLight);

const FIGHTERS = [FJ, FV, FZ, ...FZg, FG, FN];
// câmera de close na frente do personagem (usa a rotação do corpo)
function faceCam(Fi, dist = 2.6, side = 0.6, up = 0, bone = 'Head') { const h = Fi.world(bone); const ry = Fi.root.rotation.y; const fx_ = Math.sin(ry), fz = Math.cos(ry); return [[h.x + fx_ * dist + fz * side, h.y + up, h.z + fz * dist - fx_ * side], [h.x, h.y - 0.1, h.z]]; }
function put(F, p, ry, rz = 0, rx = 0) { F.root.visible = true; F.root.position.set(...p); F.root.rotation.set(rx, ry, rz); }
const sparkB = (p, k, R = 1.6, seed = 0) => burstSparks(AR(p), k, R, seed);
const V3 = a => new THREE.Vector3(a[0], a[1], a[2]);
const AR = v => Array.isArray(v) ? v : v.toArray();
const sRay = (r, a, b, R, op, t) => setRay(r, AR(a), AR(b), R, op, t);
const sBolt = (i, a, b, seed, op, col, w) => bolt(i, AR(a), AR(b), seed, op, col, w);

// ---- tempo visual: congelamentos curtos nos impactos (a narração segue) ----
const FREEZE = [[77.0, 0.12], [77.9, 0.15], [111.0, 0.1], [121.3, 0.12], [122.6, 0.18], [153.2, 0.08], [155.0, 0.08], [186.6, 0.15], [187.4, 0.18], [196.0, 0.2]];
const vtime = t => { let o = 0; for (const [a, d] of FREEZE) if (t > a) o += Math.min(d, t - a); return t - o; };
const frozen = t => FREEZE.some(([a, d]) => t > a && t < a + d);

window.render = function (t) {
  TT = t; TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t); const cur = TL.lines.find(l => t >= l.start && t < l.end); const who = cur ? cur.who : '';
  const jTalk = who === 'J' ? amp : -1, zTalk = who === 'Z' ? amp : -1, aTalk = who === 'A' ? amp : 0, vTalk = who === 'V' ? amp : 0, sTalk = who === 'S' ? amp : 0;
  const T = vtime(t);
  hideAll(); J.visible = false; brace.visible = false;
  FIGHTERS.forEach(F => { F.root.visible = false; F.root.scale.set(1, 1, 1); });
  nc0.head.visible = true; nyxBlob.visible = true; crystalLight.intensity = 0; nyxLight.intensity = 0; nyxM.opacity = 0.93;
  jc.mats.skin.emissive.set('#ffb703'); jc.mats.skin.emissiveIntensity = 0; VH.eyeM.emissiveIntensity = 3 + 2 * vTalk;
  braceMat.emissiveIntensity = 2.5 + 0.6 * Math.sin(t * 4);
  let ov = {}, camPos = [0, 2, 10], camLook = [0, 1.5, 0], shake = 0, flash = 0, roll = 0, impact = false;
  const F = { bloom: 0.45, threshold: 0.88, ca: 0.05, grain: 0.04, vig: 0.4, time: t };
  let showNyxHead = 'blob';
  const jFace = (o = {}) => jc.face({ open: blink(t), mouth: 'flat', brow: -0.5, browTilt: -0.6, look: [0, 0], talk: jTalk, ...o });
  const wave = (p, t0, dur = 0.5, a = 1) => { const k = (t - t0) / dur; if (k < 0 || k > 1) return; scene.updateMatrixWorld(true); const s = fx.toScreen(V3(p)); F.wave = [s[0], s[1], 0.05 + 0.9 * Math.sqrt(k), a * (1 - k)]; F.center = s; F.ca = Math.max(F.ca, 1.0 * (1 - k)); };
  const hitFX = (p, t0, txt, col, big = 1) => { const k = t - t0; if (k < 0 || k > 0.55) return; sparkB(p, k / 0.55, 1.6 * big, Math.floor(t0 * 7)); ringAt(0, p, k, 2.2 * big, [0, PI2, 0], 0.45, '#ffffff'); wave(p, t0, 0.45, 0.8 * big); if (k < 0.2) shake = 0.1 * big; if (k < 0.05) flash = 0.3 * big; if (k < 0.4) ov.fx = [txt, Math.min(1, k / 0.12), col, 50, 30, 180 * Math.min(1.3, big)]; if (k < 0.06) impact = true; };
  const auraOn = (Fi, k, col = 'J', big = 1) => { if (k <= 0.01) return; const p = Fi.world('Spine1'); const A = col === 'J' ? auJ : auV; aura(A, [p.x, p.y - 0.3 * big, p.z], 2.6 * big, k * 0.35, t, col === 'J' ? '#ffd60a' : col === 'N' ? '#9d4edd' : '#ff1f3d'); };

  if (t < 0) { // ---------- capa ----------
    arenaOn(1, 0.9); put(FJ, [-0.9, 0, 1.0], 0.35); FJ.pose(C.idle, 0.7); put(FV, [1.5, 0, -0.4], -0.35); FV.pose(C.idle, 1.5); put(FN, [0.3, 0, -5], 0); FN.pose(C.idle, 0.3);
    showNyxHead = 'joseph'; nyxLight.position.set(0.3, 3, -3.5); nyxLight.intensity = 30;
    jFace({ mouth: 'smile', brow: -0.4 }); auraOn(FJ, 1); auraOn(FV, 0.8, 'V');
    camera.fov = 44; camPos = [0.1, 2.0, 6.4]; camLook = [0.2, 2.1, 0];
  } else if (t < 6.0) { // ======== GANCHO: os dois de costas, rivais lado a lado ========
    arenaOn(t, 0.9); put(FJ, [-0.75, 0, 0], -0.5); FJ.pose(C.idle, lp(C.idle, t)); put(FV, [0.85, 0, 0], 0.55); FV.pose(C.idle, lp(C.idle, t + 0.6));
    jFace({ brow: -0.6 }); auraOn(FJ, 0.8); auraOn(FV, 0.8, 'V');
    const a = -0.6 + 0.9 * sm(t / 6); camPos = [Math.sin(a) * 6.5, lerp(1.0, 2.4, sm(t / 6)), Math.cos(a) * 6.5]; camLook = [0, 2.0, 0]; camera.fov = 50;
    ov.title = seg(t, 4.3, 4.6); F.bloom = 0.6;
  } else if (t < 21.6) { // ======== o quarto: o bracelete acende; o Zib e o visual novo ========
    setRoom(true); setDay(0); scene.background.set('#0d1020'); hemi.intensity = 0.6; sun.intensity = 0.4;
    const st = t > 12.0; put(FJ, st ? [-1.2, 0, -1.0] : [-2.4, 0.15, -1.6], st ? 0.3 : PI2 * 0.4);
    if (!st) FJ.pose(C.sit, 0.15); else FJ.pose(C.stand, lp(C.stand, t));
    braceMat.emissiveIntensity = 5 + 3 * Math.sin(t * 9);
    const hp = FJ.world('LeftHand'); cyanLight.position.set(hp.x, hp.y + 0.4, hp.z + 0.6); cyanLight.intensity = 1.8 + 0.8 * Math.sin(t * 9);
    const holo = seg(t, 9.6, 10.1);
    if (holo > 0) { zH.root.visible = true; const zp = st ? [-0.2, 1.3, -0.4] : [-1.5, 1.2, -1.0]; zH.root.position.set(zp[0], zp[1] + 0.05 * Math.sin(t * 2), zp[2]); zH.root.rotation.y = facing(zp, FJ.root.position.toArray()); zH.pose({ scl: [0.38 * holo, 0.38, 0.38 * holo], armL: [zTalk > 0 ? 1.0 + 0.4 * Math.sin(t * 6) : 0.3, 0.3, 0.5], armR: [0.6 + 0.6 * Math.max(0, zTalk), 0.2, 0.6] }); zH.face({ open: 1, mouth: 'o', talk: zTalk, brow: 0.8 }); zH.holoMat.opacity = (0.35 + 0.1 * Math.sin(t * 31)) * holo; holoCone.visible = true; holoCone.position.set(zp[0], zp[1] - 0.35, zp[2]); holoCone.material.opacity = 0.2 * holo; blueLight.position.set(zp[0], zp[1] + 0.3, zp[2] + 0.5); blueLight.intensity = 6 * holo; }
    jFace({ mouth: t > 12.2 && t < 15 ? 'smile' : 'o', brow: t < 12 ? 0.8 : 0.3, browTilt: 0, open: t < 7.0 ? 0.1 : 1.1 });
    if (t < 9.6) { camPos = [0.4, 1.6, 2.2]; camLook = [-2.2, 1.0, -1.6]; camera.fov = 46; }
    else if (t < 12.0) { camPos = [-0.1, 1.7, 1.6]; camLook = [-1.4, 1.3, -1.2]; camera.fov = 44; }
    else if (t < 15.2) { camPos = [-0.6, 2.2, 2.4]; camLook = [-1.2, 2.05, -1.0]; camera.fov = 40; }
    else { camPos = [1.2, 1.9, 1.8]; camLook = [-0.4, 1.4, -0.6]; camera.fov = 44; }
  } else if (t < 27.4) { // ======== a Nyx: fumaça que vira sombra ========
    arenaOn(t, 0); crowdBody.visible = crowdHead.visible = false; setSpots(t, 0.25); hemi.intensity = 0.25; sun.intensity = 0.4; arenaLights.forEach(l => { l.color.set('#7b2cbf'); l.intensity = 12; });
    const k = seg(t, 22.4, 25.0); put(FN, [0, 0, -1], 0); FN.pose(k < 1 ? C.getup : C.idle, k < 1 ? at(C.getup, 0.6 + k * 1.6) : lp(C.idle, t)); FN.root.scale.setScalar(0.4 + 0.6 * k); nyxM.opacity = 0.3 + 0.63 * k;
    for (let i = 0; i < 20; i++) { const a = i * 2.4 + t * 0.6; puff(i, [Math.cos(a) * (0.6 + 1.6 * hash(i)), 0.4 + 2.5 * hash(i + 3) * k, -1 + Math.sin(a) * (0.6 + 1.6 * hash(i))], ((t * 0.35 + i / 20) % 1), 1.4, '#2a0f45'); }
    nyxLight.position.set(0, 2.5, 0.5); nyxLight.intensity = 20 * k; F.bloom = 0.7;
    camPos = [0, 1.4, 6.2]; camLook = [0, 1.9, -1]; camera.fov = 46;
  } else if (t < 40.0) { // ======== o Vorg derrotado pede ajuda ========
    arenaOn(t, 0); crowdBody.visible = crowdHead.visible = false; setSpots(t, 0.35); hemi.intensity = 0.4; arenaLights.forEach(l => { l.color.set('#5a189a'); l.intensity = 14; });
    const gu = t - 29.2; put(FV, [0, 0, 0], 0.3); FV.pose(gu < 0 ? C.ko : C.getup, gu < 0 ? C.ko.duration - 0.05 : at(C.getup, gu * 0.8));
    for (let i = 0; i < 8; i++) puff(i, [Math.cos(i) * 2, 0.3, Math.sin(i) * 2], ((t * 0.2 + i / 8) % 1), 1.2, '#3c1d5c');
    if (t > 33.0) { const bk = seg(t, 33.0, 33.6); setBeam(new THREE.Vector3(-1.8, 26, 1.2), new THREE.Vector3(-1.8, 0, 1.2), 1.4, 0.45 * bk * (1 - seg(t, 35.0, 35.8))); blueLight.position.set(-1.8, 2.5, 2); blueLight.intensity = 14 * bk; }
    if (t > 34.2) { const dn = sm(lin(t, 34.2, 35.2)); put(FJ, [-1.8, lerp(6, 0, dn), 1.2], 2.4); FJ.pose(dn < 1 ? C.land : C.idle, dn < 1 ? 0.05 : lp(C.idle, t)); jFace({ brow: 0.4, browTilt: 0 }); }
    if (t > 36.3) { FV.pose(C.reach, at(C.reach, 0.55 + 0 * t)); FV.root.rotation.y = -2.2 + Math.PI; }
    if (t < 30.6) { camPos = [2.6, 1.0, 3.8]; camLook = [0, 0.6, 0]; camera.fov = 44; }
    else if (t < 36.3) { [camPos, camLook] = faceCam(FV, 3.0, 0.8, -0.2); camera.fov = 40; }
    else { camPos = [1.4, 2.2, 6.0]; camLook = [-0.6, 1.8, 0.4]; camera.fov = 46; }
  } else if (t < 52.0) { // ======== o Torneio das Duplas: anúncio e Zentrix ========
    arenaOn(t, 0.9); hostAnim(t, aTalk);
    put(FJ, [-0.9, 0, 2], Math.PI); FJ.pose(C.idle, lp(C.idle, t)); put(FV, [0.9, 0, 2], Math.PI); FV.pose(C.idle, lp(C.idle, t + 0.5)); jFace({ mouth: 'smile', look: [0, 0.6] });
    if (t > 47.4) { const tp = seg(t, 48.0, 48.2); put(FZ, [0, 0, -3], 0); FZ.pose(C.idle, lp(C.idle, t * 1.6)); FZ.root.visible = tp > 0.5 || Math.floor(t * 30) % 3 === 0; FZg.forEach((g, i) => { put(g, [(i ? 1.6 : -1.6) * (1 - tp * 0.3), 0, -3.4], 0); g.pose(C.idle, lp(C.idle, t * 1.6 + i)); }); ov.nc = t > 48.6 && t < 51.4 ? ['ZENTRIX', 'O MAIS RÁPIDO DA GALÁXIA', '#00b4d8', seg(t, 48.6, 48.8)] : null; }
    if (t < 44.0) { fireworks(t, 40.4); camPos = [3, 1.4, 10]; camLook = [0, 8.0, -2]; camera.fov = 54; }
    else if (t < 47.4) { camPos = [0, 2.2, 7.6]; camLook = [0, 2.0, 2]; camera.fov = 46; }
    else { camPos = [0, 1.6, 2.4]; camLook = [0, 1.9, -3]; camera.fov = 48; }
  } else if (t < 85.0) { // ================= LUTA 1: ZENTRIX =================
    arenaOn(t, 0.75); ov.score = 0;
    const JP = [-1.0, 0, 0]; let zp = [1.1, 0, 0];
    put(FJ, JP, PI2); put(FV, [-4.2, 0, -3.2], 1.2); FV.pose(C.idle, lp(C.idle, t)); auraOn(FJ, 0.5);
    const out = T > 77.9;
    if (t < 67.4) { // as cópias rodeiam; o Joseph erra
      const a = t * 2.2; zp = [JP[0] + Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1];
      put(FZ, zp, facing(zp, JP)); FZ.pose(C.box, lp(C.box, t * 1.3));
      FZg.forEach((g, i) => { const b = a + (i + 1) * 2.094; const gp = [JP[0] + Math.cos(b) * 2.1, 0, Math.sin(b) * 2.1]; put(g, gp, facing(gp, JP)); g.pose(C.box, lp(C.box, t * 1.3 + i * 0.5)); });
      FJ.root.rotation.y = facing(JP, zp) + Math.sin(t * 4) * 0.6; FJ.pose(t > 56.3 ? C.combo : C.idle, t > 56.3 ? lp(C.combo, t - 56.3) : lp(C.idle, t)); jFace({ brow: 0.4, browTilt: 0.3, mouth: t > 59.8 ? 'o' : 'flat' });
      if (t > 56.3 && Math.floor(t * 3) % 2 === 0) { const gi = Math.floor(t * 3) % 3; const G = gi < 2 ? FZg[gi] : null; if (G) G.root.visible = Math.floor(t * 12) % 2 === 0; }
      ov.speed = 0.35; F.zoom = 0.1;
      const ca = t * 0.4; camPos = [JP[0] + Math.sin(ca) * 6.8, 2.2, Math.cos(ca) * 6.8]; camLook = [JP[0], 1.5, 0]; camera.fov = 50;
      if (t > 63.6 && t < 66.8) { balc.visible = true; zH.root.visible = true; zH.root.position.set(0, BY + 0.6 + 0.05 * Math.sin(t * 2), -21); zH.root.rotation.y = 0; zH.pose({ scl: [1.2, 1.2, 1.2], armL: [zTalk > 0 ? 1.2 + 0.4 * Math.sin(t * 6) : 0.3, 0.3, 0.5], armR: [1.4, 0.3, 0.6] }); zH.face({ open: 1, mouth: 'o', talk: zTalk, brow: 0.9 }); zH.holoMat.opacity = 0.45; camPos = [0, BY + 1.6, -15.5]; camLook = [0, BY + 1.3, -21]; camera.fov = 40; }
    } else if (t < 75.3) { // olhos fechados: só um faz barulho
      const a = 67.4 * 2.2 + (t - 67.4) * 0.9; zp = [JP[0] + Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1];
      put(FZ, zp, facing(zp, JP)); FZ.pose(C.box, lp(C.box, t * 1.3)); FZg.forEach((g, i) => { const b = a + (i + 1) * 2.094; const gp = [JP[0] + Math.cos(b) * 2.1, 0, Math.sin(b) * 2.1]; put(g, gp, facing(gp, JP)); g.pose(C.box, lp(C.box, t * 1.3 + i * 0.5)); });
      FJ.root.rotation.y = lerp(facing(JP, zp) - 0.4, facing(JP, zp), seg(t, 72.5, 74.5)); FJ.pose(C.idle, lp(C.idle, t * 0.5)); jFace({ open: 0.05, mouth: 'flat', brow: -0.2, browTilt: 0 });
      ov.blue = 1; const ft = (t * 1.6) % 1; ringAt(0, [zp[0], 0.05, zp[2]], ft * 0.6, 1.2, [PI2, 0, 0], 0.6, '#7df9ff'); ringAt(1, [zp[0], 0.05, zp[2]], ((t * 1.6 + 0.5) % 1) * 0.6, 1.2, [PI2, 0, 0], 0.6, '#7df9ff');
      if (t < 71.0) { [camPos, camLook] = faceCam(FJ, 3.0, 0.8, 0.1); camera.fov = 40; } else { camPos = [JP[0] - 0.4, 3.6, 5.8]; camLook = [JP[0] + 0.6, 0.6, 0]; camera.fov = 48; }
    } else { // esquiva, gancho, Zentrix voa pra fora
      zp = [0.6, 0, 0]; FZg.forEach(g => g.root.visible = false);
      FJ.root.rotation.y = PI2;
      if (T < 76.6) FJ.pose(C.dodgeB, at(C.dodgeB, 0.6 + (T - 75.4) * 0.8)); else FJ.pose(C.upper, at(C.upper, 0.45 + (T - 76.6)));
      jFace({ brow: -0.8, browTilt: -0.8, mouth: T > 77.0 && T < 78.3 ? 'o' : 'flat' });
      if (T < 76.9) { put(FZ, zp, -PI2); FZ.pose(C.jab, at(C.jab, 0.3 + (T - 75.4) * 0.9)); }
      else { const k = lin(T, 77.9, 81.0); put(FZ, [lerp(0.6, 14, k), 5.5 * Math.sin(Math.min(1, k * 1.3) * Math.PI) + 8 * Math.max(0, k - 0.7), 0], -PI2, -k * 6); FZ.pose(C.flyback, at(C.flyback, (T - 77.9) * 0.8)); }
      if (T > 75.8 && T < 76.6) { ov.slow = 1; F.ca = 0.35; ov.fx = ['ESQUIVA!', seg(T, 75.8, 75.95), '#7df9ff', 50, 28, 170]; }
      hitFX([0.5, 2.1, 0], 77.9, 'GANCHO!', '#ffd60a', 1.5);
      if (t > 81.4) { ov.score = 1; ov.ex = 1; }
      if (T < 77.9) { const a = 0.9 + 0.4 * lin(t, 75.3, 77.9); camPos = [Math.sin(a) * 5.2 - 0.2, 1.6, Math.cos(a) * 5.2]; camLook = [-0.2, 1.6, 0]; camera.fov = 48; }
      else if (t < 81.4) { camPos = [-2.6, 0.8, 5.6]; camLook = [3, 3.5, 0]; camera.fov = 58; F.zoom = 0.4 * (1 - lin(t, 77.9, 79)); }
      else { camPos = [-1.0, 2.0, 5.2]; camLook = [-1.0, 1.8, 0]; camera.fov = 46; crowdLights(t, 0.6); }
    }
  } else if (t < 96.0) { // ======== lição 1 / anúncio do Grolm ========
    arenaOn(t, 0.75); ov.score = 1;
    put(FJ, [-1.0, 0, 0], 0.3); FJ.pose(C.stand, lp(C.stand, t)); put(FV, [1.2, 0, -0.4], -0.3); FV.pose(C.stand, lp(C.stand, t + 0.4)); jFace({ mouth: 'smile', brow: 0 });
    if (t < 91.7) { const a = lerp(0.6, -0.2, sm((t - 85) / 6.5)); camPos = [Math.sin(a) * 6.4, 2.3, Math.cos(a) * 6.4]; camLook = [0, 1.9, 0]; camera.fov = 46; ov.lesson = ['LIÇÃO 1', 'QUEM TENTA FAZER TUDO<br>NÃO FAZ NADA.<br><span style="color:#ffd60a">ESCOLHA UMA COISA E FOQUE.</span>', seg(t, 85.13, 85.4)]; }
    else { hostAnim(t, aTalk); const up = seg(t, 92.4, 95.0); put(FG, [0, -9 * (1 - up), -8], 0); FG.pose(C.idle, lp(C.idle, t * 0.5)); shake = 0.05 * (up > 0 && up < 1 ? 1 : 0); chunkBurst([0, 0, -8], lin(t, 92.4, 94.2), 7, 6, 3); GH.eyeM.emissiveIntensity = 3 + 2 * Math.sin(t * 3);
      camPos = [0, 0.8, 9.5]; camLook = [0, 5.5, -8]; camera.fov = 60; ov.nc = t > 93.4 && t < 95.9 ? ['GROLM', 'O GIGANTE DE PEDRA', '#9a8c98', seg(t, 93.4, 93.6)] : null; }
  } else if (t < 130.0) { // ================= LUTA 2: GROLM =================
    arenaOn(t, 0.75); ov.score = 1;
    const GP = [0, 0, -6]; put(FG, GP, 0); GH.eyeM.emissiveIntensity = 3;
    let jp = [-0.8, 0, 0], vp = [1.6, 0, 0.6];
    if (t < 102.5) { // socos não atravessam; o gigante bate no chão
      FG.pose(t > 99.2 ? C.area : C.idle, t > 99.2 ? at(C.area, (t - 99.2) * 0.8) : lp(C.idle, t * 0.5));
      put(FJ, [-0.4, 0, -3.6], Math.PI); FJ.pose(C.combo, lp(C.combo, t - 96.3)); put(FV, vp, Math.PI - 0.3); FV.pose(C.idle, lp(C.idle, t));
      if (t > 97.2 && t < 99.0 && Math.floor(t * 5) % 2 === 0) { sparkB([-0.4, 1.8, -4.4], ((t * 5) % 1), 0.8, Math.floor(t * 5)); }
      if (t > 97.6 && t < 98.4) ov.fx = ['CLANG!', seg(t, 97.6, 97.75), '#adb5bd', 50, 30, 170];
      hitFX([0, 0.2, -4.2], 101.0, 'BOOM!', '#ff9f1c', 1.6); if (t > 101.0) { FJ.pose(C.hit, at(C.hit, (t - 101.0) * 0.9)); FJ.root.position.z += 1.2 * seg(t, 101.0, 101.5); }
      camPos = [4.8, 1.0, 7.5]; camLook = [0, 6, -5]; camera.fov = 62;
    } else if (t < 108.0) { // "eu seguro ele"
      FG.pose(C.idle, lp(C.idle, t * 0.5)); put(FJ, jp, PI2 + 0.4); FJ.pose(C.idle, lp(C.idle, t)); put(FV, [0.4, 0, 0.9], -2.2); FV.pose(C.idle, lp(C.idle, t)); auraOn(FV, 0.6, 'V'); jFace({ look: [0.4, 0] });
      [camPos, camLook] = faceCam(FV, 2.8, 0.7, -0.1); camera.fov = 42;
    } else if (t < 119.2) { // o Vorg segura o pé; o Joseph sobe pelas costas e vê o cristal
      FG.pose(C.stun, at(C.stun, 0.25 + 0.05 * Math.sin(t * 3))); const foot = FG.world('LeftFoot');
      put(FV, [foot.x - 0.9, 0, foot.z + 0.9], facing([foot.x - 0.9, 0, foot.z + 0.9], [foot.x, 0, foot.z])); FV.pose(C.cast, lp(C.cast, t)); auraOn(FV, 1, 'V');
      for (let i = 0; i < 5; i++) { const a = foot.clone().add(new THREE.Vector3(-0.5, 1.2, 0.5)); sBolt(i, a, foot.clone().add(new THREE.Vector3(Math.cos(i * 1.3) * 0.6, 0.4 + 0.3 * i, Math.sin(i * 1.3) * 0.6)), i * 7 + Math.floor(t * 20), 0.9, '#ff4d6d', 0.05); }
      redLight.position.copy(foot).add(new THREE.Vector3(0, 1.5, 1)); redLight.intensity = 10;
      const cl = lin(t, 110.4, 114.2); const back = FG.world('Spine1', [0, 0, -30]), nk = FG.world('Neck', [0, 0, -22]);
      const jpp = cl < 1 ? V3([lerp(back.x - 1.5, nk.x, cl), lerp(0.5, nk.y - 0.6, cl), lerp(back.z - 1, nk.z, cl)]) : nk.clone().add(new THREE.Vector3(0.4, -0.7, -0.3));
      put(FJ, jpp.toArray(), cl < 1 ? 0 : Math.PI * 0.85, 0, cl < 1 ? -0.9 : 0); FJ.pose(cl < 1 ? C.fly : C.idle, cl < 1 ? lp(C.fly, t) : lp(C.idle, t)); auraOn(FJ, 0.7);
      crystalM.emissiveIntensity = 3 + 2 * Math.sin(t * 6); const cw = new THREE.Vector3(); crystal.getWorldPosition(cw); crystalLight.position.copy(cw); crystalLight.intensity = t > 113.5 ? 14 : 4;
      if (t < 110.4) { camPos = [foot.x + 2.5, 1.2, foot.z + 4.5]; camLook = [foot.x, 1.6, foot.z]; camera.fov = 50; }
      else if (t < 113.6) { camPos = [GP[0] - 6, 6, GP[2] - 9]; camLook = [GP[0], 6, GP[2] - 1]; camera.fov = 52; }
      else { camPos = [cw.x + 1.5, cw.y + 0.6, cw.z - 3.2]; camLook = [cw.x, cw.y, cw.z]; camera.fov = 44; ov.fx = t < 115.0 ? ['PONTO FRACO!', seg(t, 113.7, 113.9), '#e0aaff', 50, 26, 150] : null; }
    } else { // chute do Vorg + rajada do Joseph; o gigante desaba
      const fall = T > 122.6; const cw = new THREE.Vector3(); crystal.getWorldPosition(cw);
      FG.pose(fall ? C.ko : C.stun, fall ? at(C.ko, 0.5 + (T - 122.6) * 0.9) : at(C.stun, 0.3));
      put(FV, [-1.6, 0, -4.2], 0.6); FV.pose(C.mma, at(C.mma, 0.2 + (T - 119.6))); auraOn(FV, 0.9, 'V');
      const nk = FG.world('Neck', [0, 0, -40]); put(FJ, fall ? [-2.5, 0, -1] : [nk.x + 0.5, nk.y + 1.0, nk.z - 1.2], fall ? 0.5 : Math.PI * 0.85); FJ.pose(fall ? C.land : C.mag, fall ? at(C.land, (T - 122.6) * 0.8) : at(C.mag, 0.6 + (T - 120.3))); auraOn(FJ, 1.3);
      hitFX(FG.world('LeftLeg').toArray(), 121.3, 'CHUTE!', '#ff4d6d', 1.4);
      if (T > 121.7 && T < 122.6) { const h = FJ.world('RightHand').add(FJ.world('LeftHand')).multiplyScalar(0.5); sRay(rayJ, h, h.clone().lerp(cw, seg(T, 121.7, 122.1)), 0.35, 1, t); goldLight.position.copy(h); goldLight.intensity = 8; }
      if (T > 122.6) { crystal.visible = false; sparkB(cw, lin(T, 122.6, 123.6), 3, 5); } else crystal.visible = true;
      hitFX(cw.toArray(), 122.6, 'CRACK!', '#e0aaff', 1.8); hitFX([0, 0.5, -1], 124.3, 'BOOOM!', '#ff9f1c', 2.2); if (t > 124.3) { chunkBurst([0, 0.2, -1], lin(t, 124.3, 126.5), 9, 5, 7); for (let i = 0; i < 16; i++) puff(i, [Math.cos(i * 2.4) * (2 + 4 * hash(i)), 0.6 + hash(i + 2), -1 + Math.sin(i * 2.4) * (2 + 3 * hash(i))], 0.3 + 0.6 * lin(t, 124.3, 129), 2.4, '#8a8290'); }
      if (t > 126.5) { ov.score = 2; ov.ex = 1; crowdLights(t, 0.7); }
      if (T < 121.7) { camPos = [-4.5, 1.0, 1.2]; camLook = [0, 2.5, -5]; camera.fov = 58; }
      else if (T < 123.8) { camPos = [cw.x + 3.5, cw.y + 1.2, cw.z + 2.5]; camLook = [cw.x, cw.y - 0.5, cw.z]; camera.fov = 50; }
      else { camPos = [6, 3.2, 10]; camLook = [0, 2, -3]; camera.fov = 58; }
    }
  } else if (t < 151.6) { // ======== lição 2 / a Sombra chega ========
    arenaOn(t, t < 135.7 ? 0.75 : 0.2); ov.score = 2;
    put(FJ, [-1.0, 0, 1.0], t < 135.7 ? 0.3 : Math.PI + 0.3); FJ.pose(t < 135.7 ? C.stand : C.idle, lp(C.idle, t)); put(FV, [1.4, 0, 0.6], t < 135.7 ? -0.3 : Math.PI - 0.3); FV.pose(t < 135.7 ? C.stand : C.idle, lp(C.idle, t + 0.3));
    if (t < 135.7) { const a = lerp(0.6, -0.2, sm((t - 130) / 5.6)); camPos = [Math.sin(a) * 6.4, 2.3, Math.cos(a) * 6.4]; camLook = [0, 1.9, 0]; camera.fov = 46; jFace({ mouth: 'smile' }); ov.lesson = ['LIÇÃO 2', 'NINGUÉM VENCE SOZINHO.<br><span style="color:#ff8a8a">PEDIR AJUDA NÃO É FRAQUEZA.</span>', seg(t, 130.12, 130.4)]; }
    else {
      hostAnim(t, aTalk); arenaLights.forEach(l => { l.color.set('#5a189a'); l.intensity = 14; }); hemi.intensity = 0.3;
      const k = seg(t, 140.0, 143.8); put(FN, [0, 0, -3.2], 0); FN.pose(k < 1 ? C.getup : C.idle, k < 1 ? at(C.getup, 0.4 + k * 2) : lp(C.idle, t)); FN.root.scale.setScalar(0.3 + 0.7 * k); nyxM.opacity = 0.3 + 0.63 * k; showNyxHead = k > 0.6 ? 'joseph' : 'blob';
      for (let i = 0; i < 20; i++) { const a = i * 2.4 + t * 0.6; puff(i, [Math.cos(a) * (0.5 + 1.5 * hash(i)), 0.4 + 2.4 * hash(i + 3) * k, -3.2 + Math.sin(a) * (0.5 + 1.5 * hash(i))], ((t * 0.35 + i / 20) % 1), 1.3, '#2a0f45'); }
      nyxLight.position.set(0, 2.5, -2); nyxLight.intensity = 22 * k; nc0.face({ open: 1, mouth: sTalk > 0.1 ? 'o' : 'smile', brow: -0.8, browTilt: -0.8, talk: who === 'S' ? amp : -1 });
      jFace({ brow: 0.6, browTilt: 0, mouth: 'o' }); F.bloom = 0.6;
      if (t < 139.8) { camPos = [3, 1.6, 9]; camLook = [0, 7.5, -2]; camera.fov = 52; }
      else if (t < 145.8) { camPos = [3.8, 1.5, 1.4]; camLook = [-0.2, 1.8, -2.4]; camera.fov = 50; ov.nc = t > 141.5 && t < 145.5 ? ['NYX', 'A SOMBRA', '#9d4edd', seg(t, 141.5, 141.7)] : null; }
      else { [camPos, camLook] = faceCam(FN, 2.6, 0.5, 0); camera.fov = 40; }
    }
  } else if (t < 201.0) { // ================= LUTA FINAL: NYX (o espelho) =================
    arenaOn(t, 0.6); ov.score = 2; arenaLights.forEach(l => { l.color.set('#7b2cbf'); l.intensity = 16; });
    showNyxHead = 'joseph'; nyxLight.position.set(1, 2.5, 1); nyxLight.intensity = 10;
    const JP = [-1.05, 0, 0], NP = [1.05, 0, 0];
    put(FJ, JP, PI2); put(FN, NP, -PI2); put(FV, [-4.5, 0, -2.5], 1.0); FV.pose(C.idle, lp(C.idle, t)); auraOn(FJ, 0.6); auraOn(FN, 0.6, 'N');
    const mirror = (c, x) => { FJ.pose(c, x); FN.pose(c, x); };
    nc0.face({ open: 1, mouth: 'flat', brow: -0.8, browTilt: -0.8, talk: who === 'S' ? amp : -1 });
    if (t < 162.0) { // empate em tudo
      if (T < 154.1) mirror(C.combo, at(C.combo, 0.5 + (T - 151.7)));
      else if (T < 156.4) mirror(C.kick, at(C.kick, 0.3 + (T - 154.1)));
      else mirror(C.fire, at(C.fire, 0.8 + (T - 156.4)));
      hitFX([0, 2.0, 0], 153.2, 'PÁ!', '#ffd60a', 1.0); hitFX([0, 1.6, 0], 155.0, 'TUM!', '#c77dff', 1.2);
      if (T > 157.6 && T < 160.4) { const hj = FJ.world('RightHand').add(FJ.world('LeftHand')).multiplyScalar(0.5), hn = FN.world('RightHand').add(FN.world('LeftHand')).multiplyScalar(0.5); const mid = hj.clone().lerp(hn, 0.5); sRay(rayJ, hj, mid, 0.32, 1, t); sRay(rayV, hn, mid, 0.32, 1, t); [rayV.outer, rayV.head, rayV.root].forEach(m => m.material.color.set('#9d4edd')); setBall(clashB, mid.toArray(), 0.7 + 0.1 * Math.sin(t * 30), 1, t); goldLight.position.copy(hj); goldLight.intensity = 7; shake = 0.04; for (let i = 0; i < 6; i++) sBolt(i, mid, mid.clone().add(new THREE.Vector3(hash(i + Math.floor(t * 15)) - 0.5, hash(i + 4 + Math.floor(t * 15)) - 0.5, hash(i + 8 + Math.floor(t * 15)) - 0.5).normalize().multiplyScalar(1.3)), i * 5 + Math.floor(t * 20), 0.9, i % 2 ? '#ffd60a' : '#c77dff'); }
      if (t > 159.4 && t < 161.6) ov.fx = ['EMPATE!', seg(t, 159.4, 159.6), '#fff', 50, 26, 200];
      jFace({ brow: -0.8, browTilt: -0.8, mouth: 'flat' });
      if (T < 154.1) { const a = 0.2 + 1.0 * lin(t, 151.7, 154.1); camPos = [Math.sin(a) * 5.6, 1.7, Math.cos(a) * 5.6]; camLook = [0, 1.7, 0]; camera.fov = 48; }
      else if (T < 156.4) { camPos = [0, 0.6, 5.6]; camLook = [0, 1.6, 0]; camera.fov = 54; }
      else { camPos = [0.2, 1.3, 7.2]; camLook = [0, 1.9, 0]; camera.fov = 54; }
    } else if (t < 171.7) { // os dois caem; o Vorg grita
      mirror(C.ko, at(C.ko, 0.3 + (t - 162.0) * 0.9)); jFace({ open: 0.4, mouth: 'sad', brow: 0.6, browTilt: 0 }); nc0.face({ open: 0.4, mouth: 'flat' });
      if (t < 167.4) { camPos = [0, 4.5, 5.5]; camLook = [0, 0.4, 0]; camera.fov = 50; }
      else { FV.pose(C.reach, at(C.reach, 0.6)); FV.root.rotation.y = 0.6; [camPos, camLook] = faceCam(FV, 3.0, 0.8, 0); camera.fov = 40; }
    } else if (t < 185.4) { // 1% por dia; ele levanta e junta tudo
      const gu = t - 172.4; FJ.pose(gu < 0 ? C.ko : C.getup, gu < 0 ? C.ko.duration - 0.05 : at(C.getup, gu * 0.7)); FN.pose(C.ko, C.ko.duration - 0.05);
      if (t > 176.0) { FJ.pose(C.heal, at(C.heal, (t - 176.0) * 0.6)); FN.pose(C.getup, at(C.getup, (t - 176.0) * 0.7)); }
      jFace({ open: t > 173.5 ? 1.1 : 0.3, mouth: t > 175 ? 'smile' : 'flat', brow: -0.3, browTilt: -0.3 }); auraOn(FJ, 0.6 + 0.8 * seg(t, 177.6, 183));
      if (t < 177.6) { ov.pct = lin(t, 172.0, 177.0); [camPos, camLook] = faceCam(FJ, 3.2, 1.0, 0.4); camera.fov = 44; jc.mats.skin.emissiveIntensity = 0.15; }
      else { // flashes: Zentrix (cópias), Grolm (força), Vorg (chute)
        const ph = Math.floor((t - 177.6) / 1.75);
        if (ph === 0) { FZg.forEach((g, i) => { put(g, [JP[0] - 0.6 * (i + 1), 0, 0.3 * (i ? 1 : -1)], PI2); g.pose(C.heal, at(C.heal, (t - 177.6) * 0.6)); }); ov.flashTxt = ['A ESQUIVA DO ZENTRIX', '#48cae4']; }
        else if (ph === 1) { crk[0].g.visible = true; cracks(crk[0], [JP[0], 0.04, 0], seg(t, 179.35, 179.9), 4, '#ffd60a'); ov.flashTxt = ['A FORÇA DO GROLM', '#adb5bd']; shake = 0.05; }
        else { ov.flashTxt = ['O CHUTE DO VORG', '#ff4d6d']; }
        const a = -0.6 + 0.5 * lin(t, 177.6, 185.4); camPos = [JP[0] + Math.sin(a) * 4.5, 1.2, Math.cos(a) * 4.5]; camLook = [JP[0], 1.7, 0]; camera.fov = 48; F.bloom = 0.8;
      }
    } else { // o golpe novo; a Sombra trava e explode em luz
      const hurr = T < 187.2; const ex = T > 196.0;
      if (hurr) FJ.pose(C.hurr, at(C.hurr, 0.2 + (T - 185.5) * 1.1)); else FJ.pose(C.flip, at(C.flip, Math.min(C.flip.duration - 0.05, 2.6 + (T - 187.2) * 1.2)));
      auraOn(FJ, 1.5, 'J', 1.2); FZg.forEach((g, i) => { if (T > 185.5 && T < 187.4) { put(g, [JP[0] - 0.5 * (i + 1), 0, 0], PI2); g.pose(C.hurr, at(C.hurr, 0.2 + (T - 185.5) * 1.1 - 0.08 * (i + 1))); } });
      const glitch = T > 188.0 && !ex; FN.pose(glitch ? C.stun : C.hurr, glitch ? at(C.stun, 0.2 + (T - 188) * 0.3) : at(C.hurr, 0.2 + (T - 185.5) * 1.1));
      if (glitch) { FN.root.position.x += 0.06 * Math.sin(t * 97); FN.root.visible = Math.sin(t * 41) > -0.7; ov.err = seg(t, 189.4, 189.7) * (1 - seg(t, 192.3, 192.5)); nyxM.emissive.set(Math.floor(t * 12) % 2 ? '#ff1f3d' : '#3c096c'); } else nyxM.emissive.set('#3c096c');
      hitFX([0.4, 2.0, 0], 186.6, 'VUUSH!', '#ffd60a', 1.3); hitFX([0.6, 2.2, 0], 187.4, 'POW!', '#fff', 1.6);
      if (ex) { FN.root.visible = false; nc0.head.visible = false; const k = lin(t, 196.0, 199.5); setDome([1.05, 1.6, 0], k, 9); boomLight.position.set(1, 3, 2); boomLight.intensity = 40 * (1 - k); for (let i = 0; i < 18; i++) puff(i, [1 + Math.cos(i * 2.4) * 3 * k, 1 + 2 * hash(i) * k, Math.sin(i * 2.4) * 2 * k], 0.2 + 0.7 * k, 2.0, '#c8b6ff'); F.bloom = 0.5 + 2.5 * (1 - k); }
      if (t > 196.0 && t < 196.35) flash = 1 - (t - 196.0) / 0.35; if (t > 196.0 && t < 196.06) impact = true;
      jFace({ brow: -0.9, browTilt: -0.9, mouth: T > 186.4 && T < 188.5 ? 'o' : 'flat' });
      if (T < 187.4) { const a = -0.3 + 1.2 * lin(T, 185.5, 187.4); camPos = [Math.sin(a) * 5.4, 1.4, Math.cos(a) * 5.4]; camLook = [0, 1.7, 0]; camera.fov = 50; F.zoom = 0.2; }
      else if (t < 195.4) { camPos = [1.0, 2.1, 3.8]; camLook = [1.05, 2.0, 0]; camera.fov = 44; roll = glitch ? 0.06 * Math.sin(t * 7) : 0; }
      else { camPos = [-3.5, 1.5, 7.5]; camLook = [0.8, 2.2, 0]; camera.fov = 58; }
    }
  } else { // ======== vitória, lição 3, aperto de mão, CTA ========
    arenaOn(t, 0.95); ov.score = 3;
    const JP = [-0.75, 0, 0.3], VP = [0.95, 0, 0.3];
    if (t < 205.2) { put(FJ, JP, 0.2); FJ.pose(C.heal, at(C.heal, 0.8 + (t - 201) * 0.5)); put(FV, VP, -0.2); FV.pose(C.idle, lp(C.idle, t)); jFace({ mouth: 'smile', brow: 0.3, browTilt: 0 }); hostAnim(t, aTalk); fireworks(t, 201.4); crowdLights(t, 1); ov.champ = seg(t, 201.4, 201.7); camPos = [0, 1.8, 7.8]; camLook = [0, 2.6, 0]; camera.fov = 50; confetti.forEach((m, i) => { const k = ((t - 201.3) * 0.25 + hash(i)) % 1; m.visible = t > 201.3; m.position.set(-9 + 18 * hash(i + 7), 12 - 13 * k, -3 + 7 * hash(i + 3)); m.rotation.set(t * 3 + i, t * 2, i); }); }
    else if (t < 212.7) { put(FJ, JP, 0.3); FJ.pose(C.stand, lp(C.stand, t)); put(FV, VP, -0.3); FV.pose(C.stand, lp(C.stand, t + 0.4)); jFace({ mouth: 'smile', brow: 0, browTilt: 0 }); const a = lerp(0.6, -0.2, sm((t - 205.2) / 7)); camPos = [Math.sin(a) * 6.4, 2.3, Math.cos(a) * 6.4]; camLook = [0, 1.9, 0]; camera.fov = 46; ov.lesson = ['LIÇÃO 3', 'QUEM REPETE O MESMO, EMPATA.<br><span style="color:#ffd60a">QUEM MELHORA UM POUCO<br>TODO DIA, VENCE.</span>', seg(t, 205.27, 205.55)]; }
    else {
      const hs = seg(t, 213.0, 214.0); put(FJ, [-0.62, 0, 0], PI2); put(FV, [0.68, 0, 0], -PI2);
      FJ.pose(C.reach, at(C.reach, lerp(0.2, 0.62, hs))); FV.pose(C.reach, at(C.reach, lerp(0.2, 0.62, hs)));
      jFace({ mouth: 'smile', brow: 0.2, browTilt: 0, look: [0.5, 0] });
      if (t < 218.4) { camPos = [0, 1.9, 4.6]; camLook = [0, 1.9, 0]; camera.fov = 44; }
      else if (t < 222.9) { [camPos, camLook] = faceCam(FV, 2.8, -0.9, 0.1); camera.fov = 40; }
      else if (t < 224.4) { [camPos, camLook] = faceCam(FJ, 2.4, 1.7, 0.1); camera.fov = 40; }
      else { const a = lerp(-0.4, 0.4, sm((t - 224.4) / 16)); camPos = [Math.sin(a) * 9, 2.4, Math.cos(a) * 9]; camLook = [0, 2.4, 0]; camera.fov = 52; ov.cta = seg(t, 224.6, 224.9); ov.follow = seg(t, 230.5, 230.8); fireworks(t, 224.6 + Math.floor((t - 224.6) / 3) * 3); crowdLights(t, 1); }
    }
  }

  // ---- cabeças da Nyx e bracelete ----
  FIGHTERS.forEach(Fi => Fi.syncHeads()); syncBrace();
  if (FN.root.visible) { nc0.head.visible = showNyxHead === 'joseph'; nyxBlob.visible = showNyxHead !== 'joseph'; } else { nc0.head.visible = false; nyxBlob.visible = false; }
  if (frozen(t)) F.ca = Math.max(F.ca, 0.7);

  // ---------- câmera e desenho ----------
  camera.aspect = W / H; camera.updateProjectionMatrix(); cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll); sky.position.copy(camera.position);
  fx.set(F); fx.render();

  // ---------- overlays ----------
  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : ov.blue ? 'saturate(0.45) brightness(0.92) contrast(1.2)' : ov.slow ? 'saturate(0.65) contrast(1.15)' : '';
  $('burst').style.opacity = impact ? 1 : 0; $('flash').style.opacity = clamp(flash);
  $('lb').style.opacity = (ov.slow || ov.blue) ? 1 : 0; $('rage').style.opacity = 0; $('split').style.opacity = 0;
  $('speed').style.opacity = ov.speed || 0; $('speed').style.transform = `rotate(${(Math.floor(t * 30) % 7) * 3}deg) scale(1.4)`;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); if (!e) return; e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('title', ov.title || 0); pop('cta', ov.cta || 0); pop('follow', ov.follow || 0); pop('champ', ov.champ || 0); pop('err', ov.err || 0);
  const pc = $('pct'); pc.style.opacity = ov.pct ? 1 : 0; if (ov.pct) { const d = Math.round(ov.pct * 365); pc.innerHTML = `1% MELHOR POR DIA<br><span style="font-size:110px;color:#fff">DIA ${d}: ${Math.pow(1.01, d).toFixed(d > 200 ? 0 : 1)}x</span>`; }
  const ft = $('flashTxt'); if (ov.flashTxt) { ft.style.opacity = 1; ft.textContent = ov.flashTxt[0]; ft.style.color = ov.flashTxt[1]; } else ft.style.opacity = 0;
  const nc = $('nc'); if (ov.nc) { nc.style.opacity = 1; $('ncn').textContent = ov.nc[0]; $('ncs').textContent = ov.nc[1]; nc.style.borderColor = ov.nc[2]; $('ncn').style.color = ov.nc[2]; nc.style.transform = `translateX(${(1 - back(ov.nc[3])) * -300}px)`; } else nc.style.opacity = 0;
  const ls = $('lesson'); if (ov.lesson) { ls.style.opacity = 1; $('lsn').textContent = ov.lesson[0]; $('lst').innerHTML = ov.lesson[1]; ls.style.transform = `translate(-50%,-50%) scale(${0.6 + 0.4 * back(ov.lesson[2])})`; } else ls.style.opacity = 0;
  const scb = $('score'); scb.style.opacity = ov.score !== undefined && !ov.lesson && !ov.cta && !ov.champ ? 1 : 0; $('sc').textContent = '★'.repeat(ov.score || 0) + '☆'.repeat(3 - (ov.score || 0));
  $('bars').style.opacity = 0;
  const fxe = $('fx'); if (ov.fx) { const [txt, k, col, x, y, size] = ov.fx; fxe.style.opacity = 1; fxe.textContent = txt; fxe.style.left = x + '%'; fxe.style.top = y + '%'; fxe.style.fontSize = size + 'px'; fxe.style.color = col; fxe.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fxe.style.opacity = 0;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c && !ov.lesson ? 1 : 0; cp.style.color = c ? (WHOCOL[c.who] || '#fff') : '#fff';
};
