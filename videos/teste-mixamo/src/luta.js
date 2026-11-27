
// ===== TESTE: golpes do Mixamo (Joseph x robô) + efeitos de cinema =====
import { makeFighter, clipOf } from '../../_lib/mixamo.js';
import aIdle from '../../_lib/mixamo/Bouncing_Fight_Idle.fbx';
import aCombo from '../../_lib/mixamo/Combo_Punch.fbx';
import aJab from '../../_lib/mixamo/Jab_Cross.fbx';
import aDodge from '../../_lib/mixamo/Dodging_Back.fbx';
import aKick from '../../_lib/mixamo/Roundhouse_Kick.fbx';
import aUpper from '../../_lib/mixamo/Surprise_Uppercut.fbx';
import aFlyBack from '../../_lib/mixamo/Flying_Back_Death.fbx';
import aMagic from '../../_lib/mixamo/Standing_2H_Magic_Attack_01.fbx';
import aHit from '../../_lib/mixamo/Hit_Reaction.fbx';

const fx = makeFX(renderer, scene, camera, W, H);
const PI2 = Math.PI / 2;
const C = { idle: clipOf(aIdle), combo: clipOf(aCombo), jab: clipOf(aJab), dodge: clipOf(aDodge), kick: clipOf(aKick), upper: clipOf(aUpper), flyback: clipOf(aFlyBack), magic: clipOf(aMagic), hit: clipOf(aHit) };
const S = 0.0135;
const FJ = makeFighter(scene, aIdle, { body: '#4f5d40', joints: '#2b3140', scale: S });
const FR = makeFighter(scene, aIdle, { body: '#9aa5b1', joints: '#3d4652', metal: true, scale: S });
// cabeças: a do Joseph (com óculos) e a do robô seguem o osso da cabeça
FJ.attachHead(jo.head, [0, 9, 3]);
FR.attachHead(rhead, [0, 9, 0]);
const HJ = 1.25, HR = 0.95;

function sparkBurst(c, k, R = 1.6, col) { sparks.forEach((s, i) => { s.visible = k > 0 && k < 1; if (!s.visible) return; const a = hash(i * 2.2) * 6.28, b = hash(i * 3.7) * 3.14 - 1.57; const r = R * Math.sqrt(k) * (0.5 + 0.5 * hash(i)); s.position.set(c[0] + Math.cos(a) * Math.cos(b) * r, c[1] + Math.sin(b) * r, c[2] + Math.sin(a) * Math.cos(b) * r); s.scale.setScalar(1.6 * (1 - k)); if (col) s.material.color.set(i % 2 ? col : '#ffffff'); }); }
// ---- tempo: hit-stop e câmera lenta ----
const HITS = [2.29, 2.65, 3.36, 7.45, 9.45];
const FREEZE = [[2.29, 0.06], [2.65, 0.06], [3.36, 0.1], [7.45, 0.13], [9.45, 0.15], [11.9, 0.16]];
const SLOW = [[4.75, 5.35, 0.3]];
const timeline = []; { let real = 0, te = 0; const step = 1 / 300; const done = new Set(); while (real < 16) { let sp = 1; for (const [a, b, k] of SLOW) if (te >= a && te < b) sp = k; const fz = FREEZE.find(([a]) => te >= a && te < a + 0.02 && !done.has(a)); if (fz) { done.add(fz[0]); const n = Math.round(fz[1] / step); for (let i = 0; i < n; i++) { timeline.push(te); real += step; } te = fz[0] + 0.02; } timeline.push(te); te += step * sp; real += step; } }
const storyT = t => timeline[Math.max(0, Math.min(timeline.length - 1, Math.round(t * 300)))];
const frozen = t => { const i = Math.round(t * 300); return i > 0 && timeline[i] === timeline[i - 1]; };
// ---- destroços ----
const BURSTS = [[3.36, [0.4, 2.2, 0], 8, 4, 0.8], [7.45, [0.3, 2.0, 0], 8, 5, 0.9], [9.45, [0.4, 2.0, 0], 10, 6, 1.2], [10.55, [4.6, 0.1, 0], 12, 5, 1.5], [11.9, [4.6, 0.6, 0], 16, 8, 1.4]];
function debris(te) { rocks.forEach(r => r.visible = false); let k = 0; for (const [t0, p, n, sp, up] of BURSTS) for (let j = 0; j < n; j++, k++) { const r = rocks[k % rocks.length], dt = te - t0; if (dt < 0 || dt > 2.2) continue; const a = hash(k * 3.1) * 6.283, el = 0.2 + hash(k * 5.3) * 1.1, s = sp * (0.4 + 0.6 * hash(k * 7.7)); let y = p[1] + Math.sin(el) * s * up * dt - 4.9 * dt * dt; if (y < 0.06) y = 0.06; r.visible = true; r.position.set(p[0] + Math.cos(a) * Math.cos(el) * s * dt, y, p[2] + Math.sin(a) * Math.cos(el) * s * dt * 0.6); r.rotation.set(dt * 9 + k, dt * 6, k); r.scale.setScalar(1.2); } }
// aura que segue o corpo do Mixamo
function auraOn(F, A, k, te, col) { if (k <= 0.01) return; const p = F.world('Spine1'); const s = A === 'J' ? 1 : 1; const [m, mi, L] = A === 'J' ? [aura, auraIn, auraLight] : [raura, rauraIn, rLight]; m.visible = mi.visible = true; m.position.copy(p); mi.position.copy(p); const fl = 1 + 0.05 * Math.sin(te * 17); m.scale.set(1.25 * fl, 1.9 * fl, 1.25 * fl); mi.scale.set(1.0, 1.6, 1.0); m.material.opacity = 0.03 * k; mi.material.opacity = 0.015 * k; L.position.set(p.x, p.y + 0.8, p.z + 1); L.intensity = 5 * k; }

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const te = storyT(t), fz = frozen(t);
  camera.fov = 58; camera.aspect = W / H; setStreet(true, te); cable.visible = false; drawPhone(false, 0); phoneLight.intensity = 0;
  winMats.forEach(({ m }) => m.emissiveIntensity = 0.02); lampMats.forEach(m => m.emissiveIntensity = 0); lampLights.forEach(l => l.intensity = 0);
  tlMats.forEach(m => m.emissiveIntensity = 0.05); streetLight.intensity = 0; hemi.intensity *= 0.6; sun.intensity *= 0.55; skyMat.color.setScalar(0.45);
  J.visible = false; robot.visible = false; J2b.visible = false; mom.root.visible = false; car.visible = false; pole.visible = false; crater.visible = false;
  jo.head.scale.setScalar(HJ); rhead.scale.setScalar(HR); glasses.visible = true; jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.25; eyeMat.emissiveIntensity = 6; antMat.emissiveIntensity = 2;
  [...dizzy, ...sparks, ...rocks, ...smoke, ...motes, ...rmotes, ...streamP].forEach(o => o.visible = false);
  [aura, auraIn, raura, rauraIn, ghost, trail, ...ball, ...jOrb, ...rOrb].forEach(o => o.visible = false);
  auraLight.intensity = rLight.intensity = fireLight.intensity = clashLight.intensity = lanternLight.intensity = homeFill.intensity = thumbKey2.intensity = 0;
  rings.forEach(r => r.visible = false); fireballs.forEach(f => { f.o.visible = f.c.visible = false; }); hideArcs(); hideBig(gBeam); hideBig(rBeam); eyeBeams.forEach(b => { b.core.visible = b.glow.visible = false; });
  let camPos, camLook, shake = 0, flash = 0, roll = 0, impact = false, ov = {};
  const F = { bloom: 0.45, threshold: 0.9, ca: 0.05, grain: 0.05, vig: 0.45, time: t };
  const wave = (p, t0, dur = 0.5, amp = 1) => { const k = (te - t0) / dur; if (k < 0 || k > 1) return; scene.updateMatrixWorld(true); const s = fx.toScreen(V3(p)); F.wave = [s[0], s[1], 0.05 + 0.9 * Math.sqrt(k), amp * (1 - k)]; F.center = s; F.ca = Math.max(F.ca, 1.2 * (1 - k)); };
  const hitFX = (p, t0, txt, col, big = 1) => { const k = te - t0; if (k < 0 || k > 0.5) return; sparkBurst(p, k / 0.5, 1.3 * big, col); ringAt(0, p, k, 1.8 * big, [0, PI2, 0], 0.45, '#ffffff'); wave(p, t0, 0.45, 0.8 * big); if (k < 0.2) shake = 0.1 * big; if (k < 0.05) flash = 0.3 * big; if (k < 0.35) ov.fx = [txt, Math.min(1, k / 0.12), col]; };
  const face = o => jo.face({ open: 1, mouth: 'flat', brow: -0.6, browTilt: -0.7, look: [0, 0], ...o });

  // ---- posições e golpes (tempo da história) ----
  let jx = -0.8, rx = 0.8, ry = 0, rrot = -PI2, rtilt = 0;
  FJ.root.visible = FR.root.visible = true;
  const loop = (c, x) => (x % c.duration + c.duration) % c.duration;
  // Joseph
  if (te < 1.4) FJ.pose(C.idle, loop(C.idle, te));
  else if (te < 4.25) FJ.pose(C.combo, te - 1.4, te > 4.0 ? C.dodge : null, te - 4.2, seg(te, 4.0, 4.25));
  else if (te < 6.4) FJ.pose(C.dodge, te - 4.2, te > 6.0 ? C.kick : null, te - 6.4, seg(te, 6.0, 6.4));
  else if (te < 8.4) FJ.pose(C.kick, te - 6.4, te > 8.1 ? C.upper : null, te - 8.4, seg(te, 8.1, 8.4));
  else if (te < 10.6) FJ.pose(C.upper, te - 8.4, te > 10.3 ? C.magic : null, te - 10.7, seg(te, 10.3, 10.6));
  else if (te < 12.9) FJ.pose(C.magic, te - 10.7, te > 12.6 ? C.idle : null, loop(C.idle, te), seg(te, 12.6, 12.9));
  else FJ.pose(C.idle, loop(C.idle, te));
  // robô
  const lastHit = HITS.filter(h => te >= h - 0.3).pop();
  if (te < 1.4) FR.pose(C.idle, loop(C.idle, te + 0.7));
  else if (te < 4.4) { const h = [2.29, 2.65, 3.36].filter(h => te >= h - 0.32).pop(); FR.pose(h ? C.hit : C.idle, h ? te - (h - 0.32) * 1 : loop(C.idle, te)); rx = 0.8 + 0.22 * [2.29, 2.65, 3.36].filter(h => te >= h).length; }
  else if (te < 6.7) { FR.pose(C.jab, te - 4.4); rx = lerp(1.46, 1.2, seg(te, 4.4, 4.8)); }
  else if (te < 8.9) { const hk = te >= 7.15; FR.pose(hk ? C.hit : C.idle, hk ? te - 7.15 : loop(C.idle, te)); rx = lerp(1.2, 1.15, 0) + (te > 7.45 ? 0.5 * seg(te, 7.45, 7.9) : 0); rtilt = te > 7.45 && te < 8.2 ? 0.2 * Math.sin((te - 7.45) / 0.75 * Math.PI) : 0; }
  else { const fb = te - 9.35; FR.pose(fb > 0 ? C.flyback : C.idle, fb > 0 ? fb : loop(C.idle, te)); rx = 1.65; if (te > 9.45) { const k = lin(te, 9.45, 10.55); rx = lerp(1.65, 4.6, k); ry = 2.6 * Math.sin(k * Math.PI) * (1 - 0.2 * k); } }
  FJ.root.position.set(jx, 0.0, 0); FJ.root.rotation.set(0, PI2, 0);
  FR.root.position.set(rx, ry, 0); FR.root.rotation.set(0, rrot, rtilt);
  FJ.syncHeads(); FR.syncHeads();
  // rostos
  face({ mouth: (te > 2.2 && te < 3.5) || (te > 9.3 && te < 9.7) || (te > 11.5 && te < 12.2) ? 'o' : 'flat', open: te > 4.8 && te < 5.3 ? 1.25 : 1 });
  eyeMat.emissiveIntensity = te > 9.45 ? 3 + 3 * Math.sin(te * 25) : 7;
  // auras
  auraOn(FJ, 'J', te < 1.4 ? seg(te, 0.4, 0.9) : (te > 10.5 && te < 12.6 ? 1.6 : 0.7), te);
  auraOn(FR, 'R', te < 9.45 ? 0.6 : 0, te);
  // efeitos de impacto
  const jF = () => [FR.world('Spine2').x - 0.35, FR.world('Head').y - 0.2, 0];
  if (te > 2.2 && te < 3.9) { hitFX(jF(), 2.29, 'PÁ!', '#ffd60a', 0.8); hitFX(jF(), 2.65, 'POW!', '#fff', 0.9); hitFX(jF(), 3.36, 'BAM!', '#ffd60a', 1.2); }
  if (te > 3.36 && te < 3.42) impact = true;
  if (te > 4.75 && te < 5.35) { ov.lb = 1; F.ca = 0.4; F.zoom = 0.15; }
  if (te > 5.3 && te < 5.6) ov.fx = ['ESQUIVOU!', Math.min(1, (te - 5.3) / 0.1), '#7fdcff'];
  hitFX([FR.world('Spine2').x - 0.2, FR.world('Spine2').y + 0.3, 0], 7.45, 'CHUTE!', '#ff9f1c', 1.3); if (te > 7.45 && te < 7.5) impact = true;
  hitFX([FR.world('Head').x - 0.2, FR.world('Head').y, 0], 9.45, 'CRACK!', '#ffd60a', 1.6); if (te > 9.45 && te < 9.51) impact = true;
  if (te > 10.55) hitFX([4.6, 0.3, 0], 10.55, 'TUM!', '#fff', 0.9);
  // rajada final
  if (te > 11.45 && te < 12.0) { const h = FJ.world('RightHand').add(FJ.world('LeftHand')).multiplyScalar(0.5); const tg = V3([4.6, 0.5, 0]); setBig(gBeam, h, h.clone().lerp(tg, seg(te, 11.45, 11.75)), 1, 0.9, te); orbAt(jOrb, h, 0.55, 1); F.bloom = 1.2; }
  if (te > 10.7 && te < 11.45) { const h = FJ.world('RightHand').add(FJ.world('LeftHand')).multiplyScalar(0.5); orbAt(jOrb, h, 0.15 + 0.4 * lin(te, 10.7, 11.45), 1); F.bloom = 0.7 + 0.6 * lin(te, 10.7, 11.45); shake = 0.03; }
  const ex = lin(te, 11.9, 13.3); if (te > 11.9) { fireAt(0, [4.6, 0.8, 0], ex, 3.2); fireAt(1, [4.9, 1.2, -0.3], lin(te, 11.95, 13.3), 2.4); fireLight.position.set(4.6, 1.5, 0.5); fireLight.intensity = 30 * (1 - ex); for (let i = 0; i < 12; i++) puff(i, [4.6 + Math.cos(i * 2.4) * 2.2 * hash(i), 0.6 + 1.5 * hash(i + 2), Math.sin(i * 2.4) * 1.2], 0.25 + 0.65 * lin(te, 12.0, 15), 2.0, '#4a4650'); }
  hitFX([4.6, 0.8, 0], 11.9, 'BOOOM!', '#ff9f1c', 2.0); if (te > 11.9 && te < 11.96) impact = true; if (te > 11.9 && te < 12.15) flash = 0.8 * (1 - lin(te, 11.9, 12.15)); if (te > 11.9) F.bloom = Math.max(F.bloom, 0.5 + 1.2 * (1 - ex));
  if (te > 12.2) FR.root.visible = te > 12.6, crater.visible = true, crater.position.set(4.6, 0, 0);
  debris(te);
  // câmeras
  const mid = (FJ.root.position.x + FR.root.position.x) / 2;
  if (te < 0.7) { camPos = [jx - 0.6, 0.5, 2.6]; camLook = [jx, 2.2, 0]; camera.fov = 50; roll = -0.08; }
  else if (te < 1.4) { camPos = [rx + 0.6, 0.5, 2.6]; camLook = [rx, 2.1, 0]; camera.fov = 50; roll = 0.08; }
  else if (te < 4.4) { const a = -0.35 + 0.9 * lin(te, 1.4, 4.4); camPos = [mid + Math.sin(a) * 5.2, 1.6, Math.cos(a) * 5.2]; camLook = [mid, 1.6, 0]; camera.fov = 52; }
  else if (te < 6.4) { const a = 0.9 + 0.5 * lin(te, 4.4, 6.4); camPos = [mid + Math.sin(a) * 4.6, 1.5, Math.cos(a) * 4.6]; camLook = [mid, 1.6, 0]; camera.fov = 50; }
  else if (te < 8.4) { camPos = [mid - 0.2, 0.6, 4.8]; camLook = [mid, 1.7, 0]; camera.fov = 56; roll = 0.05; }
  else if (te < 10.6) { camPos = [jx - 1.6, 0.35, 3.6]; camLook = [rx * 0.5 + jx * 0.5 + 0.6, 2.2, 0]; camera.fov = 62; roll = -0.1; F.zoom = te > 9.45 ? 0.6 * (1 - lin(te, 9.45, 10.0)) : 0; }
  else if (te < 12.9) { camPos = [jx - 2.4, 1.2, 5.6]; camLook = [1.6, 1.4, 0]; camera.fov = 60; }
  else { const k = sm((te - 12.9) / 2); camPos = [jx + 0.6, lerp(0.4, 0.6, k), lerp(4.2, 3.8, k)]; camLook = [jx, 1.9, 0]; camera.fov = 52; ov.tag = seg(te, 13.1, 13.4); }
  if (fz) F.ca = Math.max(F.ca, 0.7);
  auraMat.opacity *= 1; F.bloom *= 1;

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll);
  sky.position.copy(camera.position);
  fx.set(F); fx.render();

  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : '';
  $('burst').style.opacity = impact ? 1 : 0; $('flash').style.opacity = flash; $('lb').style.opacity = ov.lb ? 1 : 0; $('speed').style.opacity = 0;
  const fxe = $('fx'); if (ov.fx) { const [txt, k, col] = ov.fx; fxe.style.opacity = 1; fxe.textContent = txt; fxe.style.left = '50%'; fxe.style.top = '28%'; fxe.style.fontSize = '220px'; fxe.style.color = col; fxe.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fxe.style.opacity = 0;
  const tg = $('tag'); tg.style.opacity = ov.tag ? 1 : 0; tg.style.transform = `translateX(-50%) scale(${0.5 + 0.5 * back(ov.tag || 0)})`;
  $('cap').style.opacity = 0;
};
