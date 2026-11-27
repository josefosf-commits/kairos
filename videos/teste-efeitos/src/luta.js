
// ===== TESTE DE EFEITOS: luta curta com bloom, onda de choque, borrão, destroços com física, hit-stop =====
const fx = makeFX(renderer, scene, camera, W, H);
const HS = 2.0, PI2 = Math.PI / 2;
function sparkBurst(c, k, R = 1.6, col) { sparks.forEach((s, i) => { s.visible = k > 0 && k < 1; if (!s.visible) return; const a = hash(i * 2.2) * 6.28, b = hash(i * 3.7) * 3.14 - 1.57; const r = R * Math.sqrt(k) * (0.5 + 0.5 * hash(i)); s.position.set(c[0] + Math.cos(a) * Math.cos(b) * r, c[1] + Math.sin(b) * r, c[2] + Math.sin(a) * Math.cos(b) * r); s.scale.setScalar(1.6 * (1 - k)); if (col) s.material.color.set(i % 2 ? col : '#ffffff'); }); }
// ---- tempo da história: hit-stop (congela) e câmera lenta ----
const FREEZE = [[1.45, 0.13], [1.62, 0.05], [1.87, 0.05], [2.12, 0.05], [3.05, 0.06], [3.25, 0.06], [3.55, 0.14], [6.2, 0.18]];
const SLOW = [[2.45, 2.95, 0.28]];
// congelamentos: implementados como pausas no tempo real
const timeline = []; { let real = 0, te = 0; const step = 1 / 300; while (real < 10.5) { let sp = 1; for (const [a, b, k] of SLOW) if (te >= a && te < b) sp = k; const fz = FREEZE.find(([a, d]) => te >= a && te < a + 0.02 && !timeline.done?.has(a)); if (fz) { timeline.done = timeline.done || new Set(); timeline.done.add(fz[0]); const n = Math.round(fz[1] / step); for (let i = 0; i < n; i++) { timeline.push(te); real += step; } te = fz[0] + 0.02; } timeline.push(te); te += step * sp; real += step; } }
const storyT = t => timeline[Math.max(0, Math.min(timeline.length - 1, Math.round(t * 300)))];
const frozen = t => { const i = Math.round(t * 300); return i > 0 && timeline[i] === timeline[i - 1]; };

// ---- destroços com física ----
const BURSTS = [];
const burst = (t0, p, n, sp, up = 1) => BURSTS.push({ t0, p, n, sp, up });
burst(1.45, [0, 1.9, 0.8], 10, 6, 0.8); burst(3.55, [1.0, 0.1, 0.6], 8, 5, 1.6); burst(6.2, [2.6, 6.6, 0.4], 14, 9, 0.6); burst(7.55, [3.0, 0.1, -0.2], 12, 6, 1.4);
function debris(te) {
  rocks.forEach(r => r.visible = false);
  let k = 0;
  for (const b of BURSTS) {
    for (let j = 0; j < b.n; j++, k++) {
      const r = rocks[k % rocks.length], dt = te - b.t0; if (dt < 0 || dt > 2.2) continue;
      const a = hash(k * 3.1) * 6.283, el = 0.2 + hash(k * 5.3) * 1.1, s = b.sp * (0.4 + 0.6 * hash(k * 7.7));
      const vx = Math.cos(a) * Math.cos(el) * s, vz = Math.sin(a) * Math.cos(el) * s * 0.6, vy = Math.sin(el) * s * b.up;
      let y = b.p[1] + vy * dt - 4.9 * dt * dt; if (y < 0.06) y = 0.06;
      r.visible = true; r.position.set(b.p[0] + vx * dt, y, b.p[2] + vz * dt); r.rotation.set(dt * 9 + k, dt * 6, k); r.scale.setScalar(1.3);
    }
  }
}
const JP = [-2.2, 0.86, 1.0], RP = [2.2, 0, 0.6];
const sp = (p, i) => new THREE.Vector3(...p);

window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  const te = storyT(t), fz = frozen(t);
  camera.fov = 58; camera.aspect = W / H; setStreet(true, te); cable.visible = false;
  drawPhone(false, 0); phoneLight.intensity = 0;
  winMats.forEach(({ m }) => m.emissiveIntensity = 0.02); lampMats.forEach(m => m.emissiveIntensity = 0); lampLights.forEach(l => l.intensity = 0);
  tlMats.forEach(m => m.emissiveIntensity = 0.05); streetLight.intensity = 0; hemi.intensity *= 0.45; sun.intensity *= 0.4; skyMat.color.setScalar(0.45);
  J.visible = true; J.scale.set(1, 1, 1); J.rotation.set(0, 0, 0); jo.head.scale.setScalar(HS); glasses.visible = true; jo.mats.skin.emissive.set('#ffb703'); jo.mats.skin.emissiveIntensity = 0.3;
  eyeGlow.forEach(g => { g.visible = false; });
  robot.visible = true; robot.scale.setScalar(1.35); robot.rotation.set(0, 0, 0); rhead.rotation.set(0, 0, 0); rarms.forEach(a => a.rotation.set(0, 0, 0)); eyeMat.emissiveIntensity = 6; thr.forEach(g => g.visible = false);
  [...dizzy, ...sparks, ...rocks, ...smoke, ...motes, ...rmotes, ...streamP].forEach(o => o.visible = false);
  [aura, auraIn, raura, rauraIn, ghost, trail, ...ball, ...jOrb, ...rOrb].forEach(o => o.visible = false);
  auraLight.intensity = rLight.intensity = fireLight.intensity = clashLight.intensity = lanternLight.intensity = homeFill.intensity = thumbKey2.intensity = 0;
  rings.forEach(r => r.visible = false); fireballs.forEach(f => { f.o.visible = f.c.visible = false; }); hideArcs(); hideBig(gBeam); hideBig(rBeam); eyeBeams.forEach(b => { b.core.visible = b.glow.visible = false; });
  car.visible = false; pole.visible = false; crater.visible = false; J2b.visible = false; mom.root.visible = false;
  let camPos, camLook, shake = 0, flash = 0, roll = 0, impact = false, ov = {};
  const F = { bloom: 0.9, ca: 0.06, zoom: 0, grain: 0.05, vig: 0.45, time: t };
  const face = (o = {}) => jo.face({ open: 1, mouth: 'flat', brow: -0.6, browTilt: -0.7, look: [0, 0.1], ...o });
  const wave = (p, t0, dur = 0.55, amp = 1) => { const k = (te - t0) / dur; if (k < 0 || k > 1) return; scene.updateMatrixWorld(true); const s = fx.toScreen(V3(p)); F.wave = [s[0], s[1], 0.05 + 0.9 * Math.sqrt(k), amp * (1 - k)]; F.center = s; F.ca = Math.max(F.ca, 1.6 * (1 - k)); };
  const hitFX = (p, t0, txt, col, big = 1) => { const k = te - t0; if (k < 0 || k > 0.5) return; sparkBurst(p, k / 0.5, 1.5 * big); ringAt(0, p, k, 2.2 * big, [0, Math.PI / 2, 0], 0.45, '#ffffff'); wave(p, t0, 0.45, 0.8 * big); if (k < 0.2) shake = 0.12 * big; if (k < 0.05) flash = 0.35 * big; if (k < 0.35) ov.fx = [txt, Math.min(1, k / 0.12), col]; };
  // padrões de pose
  let jp = JP.slice(), rp = RP.slice(), jry = PI2, rry = -PI2;
  let jpose = { armR: [0.9, 0.2, 1.8], armL: [0.9, 0.2, 1.8], lean: 0.15, leg: [0.4, -0.3] };
  const rArm = (a, b) => { rarms[0].rotation.set(-a, 0, 0.1); rarms[1].rotation.set(-b, 0, -0.1); };
  rArm(0.9, 0.9);

  if (te < 1.1) { // encarada: aura acende, pedras sobem
    const fl = seg(te, 0.4, 0.8);
    auraJ(0.5 + 0.6 * fl, te, 1.1); auraR(0.9, te); face({ mouth: fl > 0.5 ? 'o' : 'flat' });
    rocksAround([JP[0], 0.1, JP[2]], 2.2, te, fl, 1.6, 2, 14);
    if (te < 0.55) { camPos = [JP[0] + 2.2, 0.55, JP[2] + 3.0]; camLook = [JP[0], 2.4, JP[2]]; camera.fov = 52; roll = -0.08; }
    else { camPos = [RP[0] - 1.9, 0.6, RP[2] + 3.2]; camLook = [RP[0], 2.3, RP[2]]; camera.fov = 52; roll = 0.08; }
    F.bloom = 0.9 + 0.9 * fl * (te < 0.55 ? 1 : 0.5); if (te > 0.4 && te < 0.6) shake = 0.05;
  } else if (te < 3.3) { // investida, choque de punhos e sequência de socos
    const d = seg(te, 1.1, 1.45);
    const push = lin(te, 1.6, 3.3);
    jp = mix3(JP, [-0.75, 0.86, 0.8], d); rp = mix3(RP, [0.75, 0, 0.8], d);
    if (te > 1.5) { jp = [lerp(-0.75, 0.2, push), 0.86, 0.8]; rp = [lerp(0.75, 1.6, push), 0, 0.8]; }
    auraJ(0.9, te, 1.0); auraR(0.8, te);
    const hits = [1.62, 1.87, 2.12, 3.05, 3.25];
    const hi = hits.findIndex(h => te >= h - 0.12 && te < h + 0.12);
    const side = hi % 2 === 0;
    jpose = { armR: [hi >= 0 && side ? 1.6 : 0.9, -0.1, hi >= 0 && side ? 0.05 : 1.8], armL: [hi >= 0 && !side ? 1.6 : 0.9, -0.1, hi >= 0 && !side ? 0.05 : 1.8], lean: 0.25, leg: [0.5, -0.3], twist: hi >= 0 ? (side ? -0.35 : 0.35) : 0 };
    if (te < 1.5) { jpose = { armR: [1.6 * d, -0.1, 0.05 + 1.6 * (1 - d)], armL: [0.9, 0.2, 1.8], lean: 0.4 * d, leg: [0.8, -0.6] }; rArm(0.9 + 0.7 * d, 0.9); }
    // a esquiva em câmera lenta: o robô ataca, o Joseph se inclina para trás
    const dodge = seg(te, 2.45, 2.65) * (1 - seg(te, 2.85, 2.95));
    if (te > 2.4 && te < 2.95) { rArm(0.9 + 0.8 * seg(te, 2.4, 2.6), 0.9); jpose = { ...jpose, lean: -0.45 * dodge, armR: [0.6, 0.4, 0.8], armL: [0.6, 0.4, 0.8], twist: 0 }; ov.lb = 1; F.ca = 0.5; F.zoom = 0.2; }
    face({ mouth: hi >= 0 ? 'o' : 'flat' });
    if (te > 2.95 && te < 3.0) { ov.fx = ['ESQUIVOU!', 1, '#7fdcff']; }
    // impactos
    const fist = sp([lerp(-0.75, 0.75, 0.5), 1.95, 0.8]);
    hitFX([0, 1.95, 0.8], 1.45, 'BAM!', '#ffd60a', 1.5);
    hits.forEach((h, i) => hitFX([rp[0] - 0.55, 2.1 + 0.2 * (i % 2), 0.8], h, i % 2 ? 'POW!' : 'PÁ!', i % 2 ? '#fff' : '#ffd60a', 0.8));
    if (te > 1.45 && te < 1.5) impact = true;
    if (te < 1.45) { camPos = [0, 1.4, 7.6]; camLook = [0, 1.9, 0.8]; camera.fov = 56; F.zoom = 0.7 * d; F.center = [0.5, 0.55]; ov.speed = d; }
    else { const a = -0.5 + 1.1 * lin(te, 1.45, 3.3); camPos = [Math.sin(a) * 5.6 + 0.4, 1.7 + 0.3 * Math.sin(te * 2), 0.8 + Math.cos(a) * 5.6]; camLook = [0.4, 2.0, 0.8]; camera.fov = 54; roll = 0.06 * Math.sin(te * 3); }
    F.bloom = 1.1;
  } else if (te < 3.8) { // gancho para cima: o robô voa
    const cr = seg(te, 3.3, 3.5), up = seg(te, 3.5, 3.6);
    jp = [0.2, 0.86 - 0.35 * cr * (1 - up), 0.8]; jpose = { armR: [lerp(0.6, 3.0, up), -0.1, lerp(1.8, 0.1, up)], armL: [0.9, 0.2, 1.8], lean: lerp(0.4, -0.2, up), leg: [0.9 * (1 - up), -0.5 * (1 - up)] };
    const fl = lin(te, 3.55, 4.6); rp = [lerp(1.6, 2.6, fl), 0 + 6.0 * Math.sin(Math.min(1, fl) * Math.PI / 2), lerp(0.8, 0.4, fl)];
    robot.rotation.x = -fl * 5; auraJ(1, te, 1.1); auraR(0.6, te); face({ mouth: 'o', brow: -0.8 });
    hitFX([1.0, 2.2, 0.8], 3.55, 'CRACK!', '#ff9f1c', 1.4); if (te > 3.55 && te < 3.6) impact = true;
    camPos = [-0.6, 0.35, 4.6]; camLook = [1.0, 3.2, 0.8]; camera.fov = 62; roll = 0.12;
    F.zoom = te > 3.55 ? 0.9 * (1 - lin(te, 3.55, 3.8)) : 0; F.center = [0.62, 0.62]; F.bloom = 1.2;
  } else if (te < 5.4) { // carga de energia
    const k = lin(te, 3.8, 5.4);
    jp = [0.2, 0.86, 0.8]; jry = PI2 - 0.4; jpose = { armR: [0.45, 0.2, 1.7], armL: [1.05, -0.55, 1.5], twist: -0.5, lean: 0.1, leg: [0.4, -0.3] };
    rp = [2.6, 6.0 + 0.3 * Math.sin(te * 3), 0.4]; robot.rotation.x = -5 - te; auraR(0.5, te);
    auraJ(1 + 0.6 * k, te, 1.0 + 0.4 * k); face({ mouth: 'o', brow: -0.9, open: 1.1 });
    scene.updateMatrixWorld(true); const h = handsJ(); orbAt(jOrb, h, 0.2 + 0.7 * k, 1);
    rocksAround([jp[0], 0.1, jp[2]], 3.0, te, 0.5 + k, 2.4, 5, 28);
    motes.forEach((m, i) => { const ph = 1 - ((te * 1.4 + i / 20) % 1); m.visible = true; const a = i * 2.4; m.position.set(h.x + Math.cos(a) * 3 * ph, h.y + Math.sin(a * 1.3) * 2 * ph, h.z + Math.sin(a) * 3 * ph); m.scale.setScalar(2 * (1 - ph) + 0.4); });
    for (let i = 0; i < 6; i++) { const d = new THREE.Vector3(hash(i + Math.floor(te * 12)) - 0.5, hash(i + 3 + Math.floor(te * 12)) - 0.5, hash(i + 9 + Math.floor(te * 12)) - 0.5).normalize().multiplyScalar(0.6 + 0.8 * k); setArc(i, h, h.clone().add(d), i * 5 + Math.floor(te * 20), 0.9, '#ffe066'); }
    auraLight.intensity = 10 + 20 * k;
    const a = 0.3 + 0.5 * k; camPos = [jp[0] + Math.sin(a) * lerp(7.2, 5.4, k), 1.6, jp[2] + Math.cos(a) * lerp(7.2, 5.4, k)]; camLook = [jp[0], 2.0, jp[2]]; camera.fov = 52;
    shake = 0.02 + 0.06 * k; F.bloom = 1.0 + 1.6 * k; F.ca = 0.3 + 0.6 * k; 
  } else if (te < 6.4) { // a rajada sobe até o robô; explosão no céu
    jp = [0.2, 0.86, 0.8]; jpose = { armR: [2.4, -0.1, 0.1], armL: [2.4, -0.1, 0.1], lean: -0.25, leg: [0.5, -0.4] }; jry = PI2 - 0.2;
    rp = [2.6, 6.2, 0.4]; robot.rotation.x = -6; auraJ(1.4, te, 1.3); face({ mouth: 'o', brow: -1, open: 1.2 });
    scene.updateMatrixWorld(true); const h = handsJ(); const tgt = new THREE.Vector3(2.6, 7.0, 0.4);
    const on = seg(te, 5.4, 5.5) * (1 - seg(te, 6.2, 6.25)); const tip = h.clone().lerp(tgt, seg(te, 5.4, 5.75));
    setBig(gBeam, h, tip, on, 1.0 + 0.3 * Math.sin(te * 40), te); orbAt(jOrb, h, 0.8, on);
    const ex = lin(te, 6.2, 7.6);
    if (te > 6.2) { robot.visible = false; fireAt(0, [2.6, 7.0, 0.4], ex, 5.0); fireAt(1, [3.0, 7.5, 0.2], lin(te, 6.25, 7.6), 3.6); fireLight.position.set(2.6, 7, 0.4); fireLight.intensity = 40 * (1 - ex); }
    hitFX([2.6, 7.0, 0.4], 6.2, 'BOOOM!', '#ff9f1c', 2.2); if (te > 6.2 && te < 6.26) impact = true; if (te > 6.2 && te < 6.45) flash = 0.9 * (1 - lin(te, 6.2, 6.45));
    camPos = [-2.6, 0.5, 8.4]; camLook = [1.2, 4.0, 0.6]; camera.fov = 64; roll = -0.06;
    F.bloom = 2.0 + (te > 6.2 ? 2.0 * (1 - ex) : 0); F.zoom = te > 6.2 ? 0.6 : 0.25; F.center = fx.toScreen(V3([2.6, 7.0, 0.4]));
  } else { // fumaça, o robô cai na cratera, herói em contra-plongée
    const ex = lin(te, 6.2, 7.6), fall = lin(te, 6.9, 7.55);
    fireAt(0, [2.6, 7.0, 0.4], ex, 5.0); fireAt(1, [3.0, 7.5, 0.2], lin(te, 6.25, 7.6), 3.6);
    for (let i = 0; i < 16; i++) { const a = i * 2.4; puff(i, [2.6 + Math.cos(a) * 2.5 * hash(i), 6.5 + 2 * hash(i + 2) - 3 * lin(te, 6.4, 9.5), 0.4 + Math.sin(a) * 1.5], 0.2 + 0.7 * lin(te, 6.3, 9.5), 2.2, '#4a4650'); }
    rp = [3.0, lerp(7.0, 0, fall * fall), -0.2]; robot.rotation.set(-2 - fall * 3, 0.5, 0.8); robot.visible = te > 6.9; eyeMat.emissiveIntensity = te > 7.55 ? 2 + 2 * Math.sin(te * 20) : 6;
    if (te > 7.55) { crater.visible = true; crater.position.set(3.0, 0, -0.2); robot.position.y = -0.4; sparkBurst([3.0, 0.8, -0.2], (te * 2.5) % 1, 1.2, '#ff2d55'); }
    hitFX([3.0, 0.3, -0.2], 7.55, 'TUM!', '#fff', 1.3);
    jp = [0.2, 0.86, 0.8]; jry = 0.6; jpose = { armR: [0.2, 0.3, 0.3], armL: [0.2, 0.3, 0.3], leg: [0, 0] }; auraJ(1 - 0.6 * lin(te, 7.8, 9.5), te, 1.0); face({ brow: -0.5, mouth: 'smile' });
    if (te < 7.9) { camPos = [5.6, 1.2, 4.6]; camLook = [3.0, 1.6, -0.2]; camera.fov = 58; }
    else { const k = sm((te - 7.9) / 2); camPos = [jp[0] + 0.8, lerp(0.35, 0.6, k), jp[2] + lerp(5.6, 4.8, k)]; camLook = [jp[0], 2.6, jp[2]]; camera.fov = 54; ov.tag = seg(te, 8.0, 8.3); }
    F.bloom = 1.3;
  }
  debris(te);
  J.position.set(...jp); J.rotation.y = jry; jo.pose({ breathe: breath(te), ...jpose });
  robot.position.set(...rp); if (robot.rotation.y === 0) robot.rotation.y = rry;
  if (fz) { F.ca = Math.max(F.ca, 0.8); }

  camera.updateProjectionMatrix();
  cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll);
  sky.position.copy(camera.position);
  F.bloom *= 0.45; F.threshold = 0.9; auraMat.opacity *= 0.22; auraIn.material.opacity *= 0.2; rauraMat.opacity *= 0.45; rauraIn.material.opacity *= 0.4; auraLight.intensity *= 0.5;
  fx.set(F); fx.render();

  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : '';
  $('burst').style.opacity = impact ? 1 : 0;
  $('flash').style.opacity = flash;
  $('lb').style.opacity = ov.lb ? 1 : 0;
  $('speed').style.opacity = ov.speed || 0; $('speed').style.transform = `rotate(${(Math.floor(t * 30) % 7) * 3}deg) scale(1.6)`;
  const fxe = $('fx'); if (ov.fx) { const [txt, k, col] = ov.fx; fxe.style.opacity = 1; fxe.textContent = txt; fxe.style.left = '50%'; fxe.style.top = '30%'; fxe.style.fontSize = '230px'; fxe.style.color = col; fxe.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fxe.style.opacity = 0;
  const tg = $('tag'); tg.style.opacity = ov.tag ? 1 : 0; tg.style.transform = `translateX(-50%) scale(${0.5 + 0.5 * back(ov.tag || 0)})`;
  $('cap').style.opacity = 0;
};
