
// ===== T2 ep. 1: "A Cabeça de Meteoro" — a cabeça encolhe; primeiro robô do exército; luta com golpes do Mixamo =====
import { clipOf, makeFighter } from '../../_lib/mixamo.js';
import { makeJoseph, makeMom } from '../../_lib/joseph2.js';
import aIdle from '../../_lib/mixamo/Bouncing_Fight_Idle.fbx';
import aStand from '../../_lib/mixamo/Standing_idle.fbx';
import aGetUp from '../../_lib/mixamo/Getting_Up_1.fbx';
import aJab from '../../_lib/mixamo/Jab_Cross.fbx';
import aDodge from '../../_lib/mixamo/Dodging.fbx';
import aCombo from '../../_lib/mixamo/Combo_Punch.fbx';
import aKick from '../../_lib/mixamo/Roundhouse_Kick.fbx';
import aUpper from '../../_lib/mixamo/Surprise_Uppercut.fbx';
import aFlyBack from '../../_lib/mixamo/Flying_Back_Death.fbx';
import aFire from '../../_lib/mixamo/Fireball.fbx';
import aHit from '../../_lib/mixamo/Hit_Reaction.fbx';
import aLand from '../../_lib/mixamo/Hard_Landing.fbx';
import aHeal from '../../_lib/mixamo/Magic_Heal.fbx';

const fx = makeFX(renderer, scene, camera, W, H);
const PI2 = Math.PI / 2;
const C = { idle: clipOf(aIdle), stand: clipOf(aStand), getup: clipOf(aGetUp), jab: clipOf(aJab), dodge: clipOf(aDodge), combo: clipOf(aCombo), kick: clipOf(aKick), upper: clipOf(aUpper), flyback: clipOf(aFlyBack), fire: clipOf(aFire), hit: clipOf(aHit), land: clipOf(aLand), heal: clipOf(aHeal) };
const JO = makeJoseph(aIdle); const FJ = JO.F, jc = JO.c;
const MO = makeMom(aIdle, mom); const FM = MO.F;
const FR = makeFighter(scene, aIdle, { body: '#9aa5b1', joints: '#3d4652', metal: true, scale: 0.0135 });
FR.attachHead(rhead, [0, 9, 0]);
const loop = (c, x) => (x % c.duration + c.duration) % c.duration;
function sparkBurst(c, k, R = 1.6, col) { sparks.forEach((s, i) => { s.visible = k > 0 && k < 1; if (!s.visible) return; const a = hash(i * 2.2) * 6.28, b = hash(i * 3.7) * 3.14 - 1.57; const r = R * Math.sqrt(k) * (0.5 + 0.5 * hash(i)); s.position.set(c[0] + Math.cos(a) * Math.cos(b) * r, c[1] + Math.sin(b) * r, c[2] + Math.sin(a) * Math.cos(b) * r); s.scale.setScalar(1.6 * (1 - k)); if (col) s.material.color.set(i % 2 ? col : '#ffffff'); }); }
// o exército: pares de olhos vermelhos numa cúpula no céu
const army = []; for (let i = 0; i < 60; i++) { const g = grp(scene); const a = hash(i * 3.3) * 6.283, el = 0.35 + hash(i * 5.1) * 0.75, R = 30 + 6 * hash(i * 7.7); g.position.set(Math.cos(a) * Math.cos(el) * R, 4 + Math.sin(el) * R, Math.sin(a) * Math.cos(el) * R); for (const s of [-1, 1]) ns(mesh(sph(0.3, 10, 8), ADD('#ff2d55', 1), g, [s * 0.55, 0, 0])); ns(mesh(sph(0.9, 10, 8), ADD('#ff2d55', 0.2), g, [0, 0, -0.1], [0, 0, 0], [1.6, 0.7, 0.5])); army.push(g); }
function setArmy(k, t) { army.forEach((g, i) => { const on = k > hash(i * 9.1) * 0.85; g.visible = on; g.lookAt(camera.position); g.scale.setScalar((on ? 1 : 0) * (1 + 0.1 * Math.sin(t * 3 + i)) * (((t * 0.7 + hash(i)) % 3) > 2.9 ? 0.15 : 1)); }); }
// destroços simples
const BURSTS = [];
function debris(t) { rocks.forEach(r => r.visible = false); let k = 0; for (const [t0, p, n, sp, up] of BURSTS) for (let j = 0; j < n; j++, k++) { const r = rocks[k % rocks.length], dt = t - t0; if (dt < 0 || dt > 2.0) continue; const a = hash(k * 3.1) * 6.283, el = 0.2 + hash(k * 5.3) * 1.1, s = sp * (0.4 + 0.6 * hash(k * 7.7)); let y = p[1] + Math.sin(el) * s * up * dt - 4.9 * dt * dt; if (y < 0.06) y = 0.06; r.visible = true; r.position.set(p[0] + Math.cos(a) * Math.cos(el) * s * dt, y, p[2] + Math.sin(a) * Math.cos(el) * s * dt * 0.6); r.rotation.set(dt * 9 + k, dt * 6, k); r.scale.setScalar(1.1); } }
BURSTS.push([32.1, [0, 0.1, 0], 14, 5, 1.4], [40.3, [0.9, 2.0, 0], 6, 4, 0.8], [43.65, [1.0, 1.8, 0], 8, 5, 1], [45.75, [1.0, 2.0, 0], 10, 6, 1.2], [51.9, [4, 9, -2], 16, 9, 0.6]);
// tempo visual dos golpes: pequenos congelamentos (a narração segue normal)
const FREEZE = [[40.3, 0.08], [41.0, 0.08], [43.65, 0.12], [45.75, 0.15], [51.9, 0.15]];
const vt = t => { let o = 0; for (const [a, d] of FREEZE) { if (t > a) o += Math.min(d, t - a); } return t - o; };
const isFrozen = t => FREEZE.some(([a, d]) => t > a && t < a + d);
const auraOn = (F, k, t, col = 'J') => { if (k <= 0.01) return; const p = F.world('Spine1'); const [m, mi, L] = col === 'J' ? [aura, auraIn, auraLight] : [raura, rauraIn, rLight]; m.visible = mi.visible = true; m.position.copy(p); mi.position.copy(p); const fl = 1 + 0.05 * Math.sin(t * 17); m.scale.set(1.25 * fl, 1.9 * fl, 1.25 * fl); mi.scale.set(1.0, 1.6, 1.0); m.material.opacity = 0.03 * k; mi.material.opacity = 0.015 * k; L.position.set(p.x, p.y + 0.8, p.z + 1); L.intensity = 5 * k; };
const JW2 = [-0.85, 0, 0], RW2 = [0.85, 0, 0];

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t); const who = (TL.lines.find(l => t >= l.start && t < l.end) || {}).who;
  const T = vt(t), fz = isFrozen(t);
  camera.fov = 58; camera.aspect = W / H; cable.visible = false; drawPhone(false, 0); phoneLight.intensity = 0;
  J.visible = false; robot.visible = false; J2b.visible = false; mom.root.visible = false; car.visible = false; pole.visible = false; crater.visible = false;
  [...dizzy, ...sparks, ...rocks, ...smoke, ...motes, ...rmotes, ...streamP].forEach(o => o.visible = false);
  [aura, auraIn, raura, rauraIn, ghost, trail, ...ball, ...jOrb, ...rOrb].forEach(o => o.visible = false);
  auraLight.intensity = rLight.intensity = fireLight.intensity = clashLight.intensity = lanternLight.intensity = homeFill.intensity = thumbKey2.intensity = 0;
  rings.forEach(r => r.visible = false); fireballs.forEach(f => { f.o.visible = f.c.visible = false; }); hideArcs(); hideBig(gBeam); hideBig(rBeam); eyeBeams.forEach(b => { b.core.visible = b.glow.visible = false; });
  army.forEach(g => g.visible = false);
  FJ.root.visible = true; FM.root.visible = false; FR.root.visible = false; FJ.root.rotation.set(0, 0, 0); FR.root.rotation.set(0, 0, 0);
  jc.mats.skin.emissive.set('#ffb703'); jc.mats.skin.emissiveIntensity = 0; rhead.scale.setScalar(0.95); eyeMat.emissiveIntensity = 6; antMat.emissiveIntensity = 2;
  let camPos, camLook, shake = 0, flash = 0, roll = 0, impact = false, ov = {}, head = 0.85;
  const F = { bloom: 0.45, threshold: 0.9, ca: 0.05, grain: 0.05, vig: 0.4, time: t };
  const jFace = (o = {}) => jc.face({ open: blink(t), mouth: 'smile', brow: 0.2, look: [0, 0], talk: who === 'J' ? amp : -1, ...o });
  const wave = (p, t0, dur = 0.5, a = 1) => { const k = (t - t0) / dur; if (k < 0 || k > 1) return; scene.updateMatrixWorld(true); const s = fx.toScreen(V3(p)); F.wave = [s[0], s[1], 0.05 + 0.9 * Math.sqrt(k), a * (1 - k)]; F.center = s; F.ca = Math.max(F.ca, 1.1 * (1 - k)); };
  const hitFX = (p, t0, txt, col, big = 1) => { const k = t - t0; if (k < 0 || k > 0.5) return; sparkBurst(p, k / 0.5, 1.3 * big, col); ringAt(0, p, k, 1.8 * big, [0, PI2, 0], 0.45, '#ffffff'); wave(p, t0, 0.45, 0.8 * big); if (k < 0.2) shake = 0.1 * big; if (k < 0.05) flash = 0.3 * big; if (k < 0.35) ov.fx = [txt, Math.min(1, k / 0.12), col]; if (k < 0.06) impact = true; };
  const glow = k => { jc.mats.skin.emissiveIntensity = 0.3 * k; motes.forEach((m, i) => { if (k <= 0.01) return; const ph = 1 - ((t * 0.8 + i / 20) % 1); const hp = FJ.world('Head', [0, 10, 0]); const a = i * 2.4 + t; m.visible = true; m.position.set(hp.x + Math.cos(a) * 1.6 * ph, hp.y + Math.sin(a * 1.3) * 1.0 * ph, hp.z + Math.sin(a) * 1.6 * ph); m.scale.setScalar(1.4 * (1 - ph) * k + 0.2); }); const hp = FJ.world('Head', [0, 10, 20]); auraLight.position.copy(hp); auraLight.intensity = 8 * k; };
  const room = (day) => { setStreet(false, t); setDay(day); scene.background.set(day > 0.5 ? '#bfe3ff' : '#0d1020'); hemi.intensity = 0.7; sun.intensity = 1.6; };
  const street = () => { setStreet(true, t); winMats.forEach(({ m }) => m.emissiveIntensity = 0.02); lampMats.forEach(m => m.emissiveIntensity = 0); lampLights.forEach(l => l.intensity = 0); tlMats.forEach(m => m.emissiveIntensity = 0.05); streetLight.intensity = 0; hemi.intensity *= 0.75; sun.intensity *= 0.7; skyMat.color.setScalar(0.62); };

  if (t < 0) { // ---------- capa ----------
    street(); FR.root.visible = true; FJ.root.position.set(-0.45, 0, 0.9); FJ.root.rotation.y = 0.35; FJ.pose(C.idle, 0.7); FR.root.position.set(1.5, 0, -1.6); FR.root.rotation.y = -0.6; FR.pose(C.idle, 1.4); FM.syncHeads();
    JO.setHead(0.85); FJ.syncHeads(); FR.syncHeads(); jc.face({ open: 1.05, mouth: 'smile', brow: -0.3, browTilt: -0.5, look: [0.2, 0] }); auraOn(FJ, 0.5, 1); auraOn(FR, 0.8, 1, 'R'); setArmy(1, 1);
    thumbKey2.position.set(-0.5, 2.6, 3.5); thumbKey2.intensity = 9;
    camera.fov = 46; camera.updateProjectionMatrix(); cam([0.25, 2.0, 4.6], [0.25, 1.95, 0], 0, 0); sky.position.copy(camera.position); fx.set({ bloom: 0.5, threshold: 0.9, vig: 0.35, grain: 0.02 }); fx.render(); return;
  }

  if (t < 4.45) { // ======== GANCHO: a cabeça de meteoro encolhe ========
    room(1); FJ.root.position.set(0.3, 0, -0.4); FJ.pose(C.stand, loop(C.stand, t));
    const k = seg(t, 1.7, 3.0); head = lerp(1.9, 0.85, k) * (1 + 0.08 * Math.sin(k * Math.PI * 3) * (1 - k));
    glow(1 - k * 0.7); jFace({ open: k > 0.95 ? 1.2 : 1, mouth: k > 0.95 ? 'o' : 'smile', brow: k > 0.95 ? 1 : 0.2 });
    if (t > 1.7 && t < 3.0) { const hp = FJ.world('Head', [0, 10, 0]); ringAt(0, A3(hp), (t - 1.7) % 0.45, 1.6, [0, 0, 0], 0.45, '#ffe066'); shake = 0.03; }
    if (t > 3.0 && t < 3.12) flash = 0.4;
    camPos = [0.3, 2.5, 3.7]; camLook = [0.3, 2.35, -0.4]; camera.fov = 50;
    ov.hook = seg(t, 0.2, 0.45); ov.plop = t > 3.0 && t < 3.8 ? seg(t, 3.0, 3.12) : 0;
  } else if (t < 8.6) { // ======== resumo (P&B): o céu cheio de olhos vermelhos ========
    ov.recap = 1; street(); setStreet(true, t); street();
    FJ.root.position.set(0.6, 0, 9.4); FJ.pose(C.stand, loop(C.stand, t)); head = 1.9; jFace();
    FM.root.visible = true; FM.root.position.set(-0.6, 0, 9.4); FM.pose(C.stand, loop(C.stand, t + 0.5));
    setArmy(seg(t, 4.5, 6.0), t); homeFill.position.set(0, 4, 5); homeFill.intensity = 3;
    camPos = [0.0, 1.0, 4.6]; camLook = [0, 15, 30]; camera.fov = 70; hemi.intensity = 1.0; sun.intensity = 1.2; skyMat.color.setScalar(0.9); homeFill.intensity = 7;
  } else if (t < 17.9) { // ======== dia 19: acorda no chão com a cabeça brilhando; o cérebro compacta o QI ========
    room(1); FJ.root.position.set(0.3, 0, -0.4); FJ.root.rotation.y = 0.3;
    const gu = t - 9.0; FJ.pose(gu < C.getup.duration ? C.getup : C.stand, gu < 0 ? 0 : gu < C.getup.duration ? gu : loop(C.stand, gu));
    const k = seg(t, 13.4, 17.2); head = lerp(1.9, 1.2, k); glow(1); jFace({ open: t < 9.6 ? 0.1 : 1, mouth: 'o', brow: 0.6 });
    if (t < 12.9) { camPos = [2.6, 1.4, 3.4]; camLook = [0.3, 1.2, -0.4]; camera.fov = 54; ov.day = seg(t, 8.8, 9.05) * (1 - seg(t, 11.9, 12.1)); }
    else { camPos = [0.6, 2.3, 3.2]; camLook = [0.3, 2.1, -0.4]; camera.fov = 52; ov.zip = Math.min(1, lin(t, 13.2, 17.2)); }
  } else if (t < 22.3) { // ======== o QI continua dobrado ========
    room(1); FJ.root.position.set(0.3, 0, -0.4); FJ.root.rotation.y = 0.3; FJ.pose(C.heal, Math.min(C.heal.duration - 0.01, (t - 17.9) * 0.9));
    head = lerp(1.2, 0.85, seg(t, 17.9, 18.8)); glow(1 - seg(t, 19.5, 21.5)); jFace({ mouth: 'smile', open: 1.1 });
    camPos = [0.3, 1.8, 4.4]; camLook = [0.3, 1.7, -0.4]; camera.fov = 52; ov.qi = seg(t, 18.4, 18.7);
  } else if (t < 29.4) { // ======== a mãe entra e congela; "mãe, eu tô bonito?" ========
    room(1); FJ.root.position.set(0.3, 0, -0.4); FJ.root.rotation.y = -0.9; FJ.pose(C.stand, loop(C.stand, t)); head = 0.85;
    FM.root.visible = true; const w = lin(t, 22.5, 24.0); const mp = mix3([-5.5, 0, 1.3], [-2.6, 0, 0.6], w); FM.root.position.set(...mp); FM.root.rotation.y = PI2 - 0.15;
    doorP.rotation.y = -1.3 + 1.0 * seg(t, 22.3, 22.8);
    FM.pose(t > 24.3 && t < 26.9 ? C.hit : C.stand, t > 24.3 && t < 26.9 ? Math.min(0.9, (t - 24.3) * 0.8) : loop(C.stand, t));
    mom.face({ open: t > 24.3 ? 1.45 : blink(t, 0.6), mouth: t > 24.3 ? 'o' : 'flat', brow: t > 24.3 ? 1.2 : 0.2, look: [0.4, 0], talk: t > 24.8 && t < 26.8 ? amp : -1 });
    jFace({ look: [-0.5, 0], mouth: t > 27.1 ? 'smile' : 'flat', brow: t > 27.1 ? 0.6 : 0.2 });
    if (t < 27.1) { const mw = FM.world('Head'); camPos = [mw.x + 1.4, 2.1, mw.z + 3.6]; camLook = [mw.x, 1.7, mw.z]; camera.fov = 54; }
    else { camPos = [-1.3, 2.3, 2.5]; camLook = [0.3, 2.2, -0.4]; camera.fov = 44; ov.brilho = seg(t, 27.3, 27.6); }
  } else { // ======== LÁ FORA: o robô desce, ataca, a luta, a explosão ========
    street(); FR.root.visible = true;
    const jp = JW2.slice(), rp = RW2.slice();
    // o robô desce do céu
    const land = 32.1;
    if (t < land) { const k = lin(t, 29.5, land); rp[1] = 22 * Math.pow(1 - k, 1.6); rp[0] = lerp(6, RW2[0], k); FR.pose(C.land, 0.05); trail.visible = true; trail.position.set(rp[0], rp[1] + 1.4, rp[2]); trail.scale.set(0.5, 2.2, 0.5); trail.material.opacity = 0.5; }
    else if (t < 36.8) FR.pose(t < land + C.land.duration ? C.land : C.idle, t < land + C.land.duration ? t - land : loop(C.idle, t));
    else if (t < 39.4) FR.pose(C.jab, T - 36.9);
    else if (t < 44.7) { const hs = [40.3, 41.0, 43.65].filter(h => T >= h - 0.32).pop(); FR.pose(hs ? C.hit : C.idle, hs ? T - (hs - 0.32) : loop(C.idle, T)); rp[0] = RW2[0] + 0.25 * [40.3, 41.0, 43.65].filter(h => T >= h).length; }
    else { const fb = T - 45.6; FR.pose(fb > 0 ? C.flyback : C.idle, fb > 0 ? fb : loop(C.idle, T)); rp[0] = 1.6; if (T > 45.75) { const k = lin(T, 45.75, 51.9); rp[0] = lerp(1.6, 4, k); rp[1] = 9 * Math.sqrt(k); rp[2] = lerp(0, -2, k); FR.root.rotation.z = -T * 2; } }
    // o Joseph
    if (t < 33.0) { FJ.pose(C.stand, loop(C.stand, t)); }
    else if (t < 37.6) FJ.pose(C.idle, loop(C.idle, T));
    else if (t < 39.3) FJ.pose(C.dodge, (T - 37.6) * (T > 38.0 && T < 38.9 ? 0.6 : 1));
    else if (t < 42.4) FJ.pose(C.combo, T - 39.4);
    else if (t < 44.7) FJ.pose(C.kick, T - 42.6);
    else if (t < 49.6) FJ.pose(C.upper, T - 44.7);
    else if (t < 53.2) FJ.pose(C.fire, T - 49.8);
    else FJ.pose(C.idle, loop(C.idle, T));
    FJ.root.position.set(...jp); FJ.root.rotation.y = PI2;
    FR.root.position.set(...rp); FR.root.rotation.y = -PI2;
    FJ.syncHeads(); FR.syncHeads(); head = 0.85;
    jFace({ mouth: t > 39.3 && t < 47 ? 'flat' : 'smile', brow: t > 33 && t < 53 ? -0.6 : 0.2, browTilt: t > 33 && t < 53 ? -0.7 : 0, look: [0, 0] });
    auraOn(FJ, t > 33 ? 0.8 : 0, t); auraOn(FR, t > land && t < 45.75 ? 0.6 : 0, t, 'R');
    if (t > 33.1 && t < 36.4) { mouthMat.emissiveIntensity = 0.4 + 6 * amp; } if (t > 47.6 && t < 49.7) mouthMat.emissiveIntensity = 0.4 + 6 * amp;
    // pouso do robô
    if (t > land) { crater.visible = true; crater.position.set(RW2[0], 0, 0); }
    hitFX([RW2[0], 0.4, 0], land, 'TUM!', '#fff', 1.4);
    // golpes
    const rh = () => [FR.world('Head').x - 0.25, FR.world('Head').y - 0.2, 0];
    if (t > 37.9 && t < 38.9) { ov.lb = 1; F.ca = 0.4; F.zoom = 0.15; }
    if (t > 38.9 && t < 39.3) ov.fx = ['ESQUIVOU!', Math.min(1, (t - 38.9) / 0.1), '#7fdcff'];
    hitFX(rh(), 40.3, 'PÁ!', '#ffd60a', 0.8); hitFX(rh(), 41.0, 'POW!', '#fff', 1);
    hitFX([FR.world('Spine2').x - 0.2, FR.world('Spine2').y + 0.3, 0], 43.65, 'CHUTE!', '#ff9f1c', 1.3);
    hitFX(rh(), 45.75, 'CRACK!', '#ffd60a', 1.6);
    // rajada e explosão no céu
    const EX = 51.9;
    if (t > 50.6 && t < EX) { const h = FJ.world('RightHand').add(FJ.world('LeftHand')).multiplyScalar(0.5); orbAt(jOrb, h, 0.2 + 0.4 * lin(t, 50.6, 51.5), 1); if (t > 51.5) { const tg = FR.world('Spine2'); setBig(gBeam, h, h.clone().lerp(tg, seg(t, 51.5, 51.85)), 1, 0.8, t); } F.bloom = 0.9; }
    const ex = lin(t, EX, 53.6); if (t > EX) { FR.root.visible = false; const p = [4, 9, -2]; fireAt(0, p, ex, 4.5); fireAt(1, [4.4, 9.6, -2.3], lin(t, EX + 0.05, 53.6), 3.2); fireLight.position.set(...p); fireLight.intensity = 40 * (1 - ex); }
    hitFX([4, 9, -2], EX, 'BOOOM!', '#ff9f1c', 2.2); if (t > EX && t < EX + 0.25) flash = 0.8 * (1 - lin(t, EX, EX + 0.25)); if (t > EX) F.bloom = Math.max(F.bloom, 0.5 + 1.2 * (1 - ex));
    // câmeras
    const mid = (jp[0] + rp[0]) / 2;
    if (t < land) { camPos = [-2.5, 0.6, 5.5]; camLook = [rp[0] * 0.5, Math.max(2, rp[1] * 0.7), 0]; camera.fov = 62; setArmy(1, t); }
    else if (t < 33.0) { camPos = [0, 1.4, 6.2]; camLook = [0, 1.4, 0]; camera.fov = 58; }
    else if (t < 36.8) { camPos = [RW2[0] - 1.0, 1.0, 2.8]; camLook = [RW2[0], 2.35, 0]; camera.fov = 48; roll = 0.06; ov.alvo = seg(t, 34.0, 34.3); }
    else if (t < 39.4) { const a = -0.3 + 0.6 * lin(t, 36.8, 39.4); camPos = [mid + Math.sin(a) * 5.0, 1.6, Math.cos(a) * 5.0]; camLook = [mid, 1.6, 0]; camera.fov = 52; }
    else if (t < 42.4) { const a = 0.3 + 0.9 * lin(t, 39.4, 42.4); camPos = [mid + Math.sin(a) * 5.2, 1.6, Math.cos(a) * 5.2]; camLook = [mid, 1.6, 0]; camera.fov = 52; }
    else if (t < 44.7) { camPos = [mid - 0.2, 0.6, 4.8]; camLook = [mid, 1.7, 0]; camera.fov = 56; roll = 0.05; }
    else if (t < 47.5) { camPos = [JW2[0] - 1.6, 0.35, 3.6]; camLook = [0.6, 2.6, 0]; camera.fov = 62; roll = -0.1; F.zoom = T > 45.75 ? 0.6 * (1 - lin(T, 45.75, 46.4)) : 0; }
    else if (t < 49.75) { const rpw = FR.world('Head'); camPos = [rpw.x - 1.4, rpw.y - 0.6, rpw.z + 3.2]; camLook = [rpw.x, rpw.y, rpw.z]; camera.fov = 50; roll = 0.1 * Math.sin(t * 2); }
    else if (t < 53.6) { camPos = [JW2[0] - 2.2, 0.6, 5.4]; camLook = [1.2, 4.5, -1]; camera.fov = 66; }
    else { const k = sm((t - 53.6) / 3); camPos = [JW2[0] + 0.3, lerp(1.2, 0.5, k), lerp(3.6, 4.4, k)]; camLook = [JW2[0] + 0.5, lerp(3, 9, k), lerp(0, 10, k)]; camera.fov = 66; setArmy(seg(t, 53.8, 55.5), t); }
    if (t > 56.4) { ov.cta = seg(t, 56.5, 56.8) * (1 - seg(t, 62.4, 62.6)); ov.end = seg(t, 62.5, 62.8); setArmy(1, t); }
  }
  if (t < 29.4) JO.setHead(head); else JO.setHead(0.85);
  FJ.syncHeads(); FM.syncHeads(); FR.syncHeads();
  if (fz) F.ca = Math.max(F.ca, 0.7);
  debris(t);

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll);
  sky.position.copy(camera.position);
  fx.set(F); fx.render();

  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : ov.recap ? 'grayscale(0.85) contrast(1.05)' : '';
  $('burst').style.opacity = impact ? 1 : 0; $('flash').style.opacity = flash; $('lb').style.opacity = ov.lb ? 1 : 0; $('speed').style.opacity = 0;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); if (!e) return; e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('hook', ov.hook || 0); pop('plop', ov.plop || 0); pop('recap', ov.recap ? 1 : 0); pop('day', ov.day || 0); pop('qi', ov.qi || 0); pop('brilho', ov.brilho || 0); pop('alvo', ov.alvo || 0); pop('cta', ov.cta || 0); pop('end', ov.end || 0);
  const z = $('zip'); z.style.opacity = ov.zip ? 1 : 0; if (ov.zip) { const p = Math.floor(ov.zip * 100); z.innerHTML = `COMPACTANDO QI... ${p}%<div style="margin:18px auto 0;width:760px;height:46px;border:6px solid #fff;border-radius:24px;background:rgba(0,0,0,.55);overflow:hidden"><div style="height:100%;width:${p}%;background:linear-gradient(90deg,#ffd60a,#ff9f1c)"></div></div>`; }
  const fxe = $('fx'); if (ov.fx) { const [txt, k, col] = ov.fx; fxe.style.opacity = 1; fxe.textContent = txt; fxe.style.left = '50%'; fxe.style.top = '27%'; fxe.style.fontSize = '220px'; fxe.style.color = col; fxe.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fxe.style.opacity = 0;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cpx = $('cap'); cpx.textContent = c ? c.s : ''; cpx.style.opacity = c ? 1 : 0; cpx.style.color = c && c.robot ? '#ff4d6d' : '#fff';
};
