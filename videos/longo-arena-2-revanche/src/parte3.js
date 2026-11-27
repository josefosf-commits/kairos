
// ================= RENDER =================
function renderSplit(A, B, fov) {
  renderer.setScissorTest(true);
  [[0, A], [W / 2, B]].forEach(([x, [p, l]]) => { renderer.setViewport(x, 0, W / 2, H); renderer.setScissor(x, 0, W / 2, H); camera.aspect = (W / 2) / H; camera.fov = fov; camera.updateProjectionMatrix(); cam(p, l, 0.02, TT); sky.position.copy(camera.position); renderer.render(scene, camera); });
  renderer.setScissorTest(false); renderer.setViewport(0, 0, W, H); camera.aspect = W / H;
}
const ARM4 = [0.2, 0.25, 0.5];
window.render = function (t) {
  TT = t; TL = TL || window.TL; if (!caps) buildCaps();
  const amp = ampAt(TL, t); const cur = TL.lines.find(l => t >= l.start && t < l.end); const who = cur ? cur.who : '';
  const jTalk = who === 'J' ? amp : -1, zTalk = who === 'Z' ? amp : -1, aTalk = who === 'A' ? amp : 0, vTalk = who === 'V' ? amp : 0, mTalk = who === 'M' ? amp : 0;
  hideAll(); camera.fov = 45;
  J.visible = true; J.scale.set(1, 1, 1); J.rotation.set(0, 0, 0); brace.visible = true; braceMat.emissiveIntensity = 2.5 + 0.6 * Math.sin(t * 4);
  magMat.emissiveIntensity = 0.6 + 0.2 * Math.sin(t * 3); magMat.color.set('#6b4a3c'); veinM.emissiveIntensity = 3; crackM.opacity = 0; MG.eyeM.emissiveIntensity = 1.6; VG.eyeM.emissiveIntensity = 2; GK.eyeM.emissiveIntensity = 1.6;
  const jb = breath(t);
  MG.arms.forEach(A => { A.fm.emissive.set('#ff4d00'); });
  let ov = {}, camPos = [0, 2, 10], camLook = [0, 1.5, 0], shake = 0, flash = 0, roll = 0, impact = false, split = null;
  const GUARDF = { open: blink(t), mouth: 'flat', brow: -0.4, browTilt: 0.4 };

  if (t < 0) { // ---------- capa ----------
    arenaOn(1, 0.8);
    jS([-3.3, 0.86, 1.0], 0.9, JBEAM, { open: 1.1, mouth: 'o', brow: -0.8, browTilt: 0.7 });
    bS(VG, [4.2, 0, -1.2], facing([4.2, 0, -1.2], [-3.3, 0, 1.0]), 1.05, { ...VBEAM });
    beamsClash(1, 0.5, 1, 1); auraGold(0.9, 1); auraB(VG, 0.9, 1);
    camera.fov = 50; camera.updateProjectionMatrix(); cam([-6.2, 1.6, 6.4], [0.6, 2.6, -0.4], 0, 0); sky.position.copy(camera.position); renderer.render(scene, camera); return;
  }

  if (t < 8.7) { // ======== GANCHO: choque de rajadas ========
    arenaOn(t, 0.9);
    jS([-5.5, 0.86, 0], PI2, JBEAM, { open: 1, mouth: 'o', brow: -0.8, browTilt: 0.7 });
    bS(VG, [6.5, 0, 0], -PI2, 1.05, { ...VBEAM, jaw: 0.4 });
    beamsClash(t, 0.5 + 0.07 * Math.sin(t * 1.7), 1, 1); auraGold(t > 4.6 && t < 6.2 ? 0.45 : 1, t); auraB(VG, 1, t); shake = 0.03;
    if (t < 2.4) { camPos = mix3([0, 0.8, 13], [0, 1.2, 10], t / 2.4); camLook = [0, 2.4, 0]; camera.fov = 55; }
    else if (t < 4.6) { camPos = [3.4, 0.6, 3.4]; camLook = [6.5, 3.7, 0]; camera.fov = 50; roll = 0.08; }
    else if (t < 6.2) { camPos = [-3.1, 1.6, 2.5]; camLook = [-5.5, 1.85, 0]; camera.fov = 42; roll = -0.06; }
    else { camPos = mix3([-11, 3.5, 6], [-12.5, 5, 9], sm((t - 6.2) / 2.5)); camLook = [0, 2.5, 0]; camera.fov = 55; ov.title = seg(t, 6.2, 6.45); }
  } else if (t < 18.9) { // ======== quarto: o bracelete acende ========
    setRoom(true); setDay(0); scene.background.set('#0d1020');
    const wake = seg(t, 11.8, 12.8), look = seg(t, 12.3, 12.9);
    J.position.set(3.0, 0.8, -2.8); J.rotation.y = 0;
    jo.pose({ breathe: jb, leg: [1.5, 1.5], lean: lerp(0.75, 0, wake), head: [lerp(0.5, 0, wake), 0, 0], armL: [1.25, 0.15, 1.3], armR: [lerp(1.25, 1.5, look), lerp(0.15, -0.3, look), lerp(1.3, 2.0, look)] });
    const holo = seg(t, 13.6, 14.0);
    jo.face({ open: t < 11.9 ? 0.06 : (holo > 0.5 ? 1.35 : blink(t)), mouth: holo > 0.5 ? 'o' : 'flat', brow: holo > 0.5 ? 1 : 0.4, look: [0, look > 0.5 && holo < 0.5 ? -0.6 : 0] });
    braceMat.emissiveIntensity = 5 + 3 * Math.sin(t * 9);
    scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); cyanLight.position.set(v.x, v.y + 0.3, v.z + 0.6); cyanLight.intensity = 5 + 3 * Math.sin(t * 9);
    if (holo > 0) {
      zH.root.visible = true; zH.root.position.set(3.0, 1.05 + 0.86 * 0.35 + 0.05 * Math.sin(t * 2), -1.85); zH.root.rotation.y = Math.PI;
      zH.pose({ scl: [0.35 * holo, 0.35, 0.35 * holo], armL: [zTalk > 0 ? 1.0 + 0.4 * Math.sin(t * 6) : 0.3, 0.3, 0.5], armR: [0.6 + 0.6 * Math.max(0, zTalk), 0.2, 0.6] }); zH.face({ open: 1, mouth: 'o', talk: zTalk, brow: 0.8 });
      zH.holoMat.opacity = (0.35 + 0.1 * Math.sin(t * 31)) * holo; holoCone.visible = true; holoCone.position.set(3.0, 1.35, -1.85); holoCone.material.opacity = 0.2 * holo;
      blueLight.position.set(3.0, 1.6, -1.6); blueLight.intensity = 6 * holo;
    }
    if (t < 10.6) { camPos = [5.8, 2.4, 1.6]; camLook = [3, 1.2, -2.4]; camera.fov = 45; }
    else if (t < 13.6) { camPos = [v.x + 0.7, v.y + 0.45, v.z + 1.2]; camLook = [v.x, v.y, v.z]; camera.fov = 34; }
    else { camPos = mix3([5.2, 1.85, -0.5], [4.7, 1.8, -0.9], sm((t - 13.6) / 5)); camLook = [3.0, 1.55, -2.3]; camera.fov = 44; }
  } else if (t < 31.84) { // ======== VORG: o campeão de verdade ========
    arenaOn(t, 0); crowdBody.visible = crowdHead.visible = false; setSpots(t, 0.3); J.visible = false;
    hemi.intensity = 0.22; sun.intensity = 0.5; arenaLights.forEach(l => { l.color.set('#ff1f3d'); l.intensity = 9; });
    const raise = seg(t, 22.3, 24.0), smash = seg(t, 24.45, 24.65);
    bS(VG, [0, 0, -4], t < 25.8 ? 0.55 : 0, 1.05, { a: [[lerp(0.15, lerp(2.7, 1.0, smash), raise), 0.05, lerp(0.3, 0.2, raise)], [0.15, 0.2, 0.4]], head: [t < 25.8 ? 0.25 : -0.15, 0, 0], jaw: vTalk * 1.4, breathe: 0.02 * Math.sin(t * 2) });
    const flare = seg(t, 28.4, 29.0); auraB(VG, 0.35 + 0.65 * flare, t);
    if (t < 24.6) { jH.root.visible = true; jH.root.position.set(1.7, 1.6, -2.4); jH.root.rotation.y = facing([1.7, 0, -2.4], [0, 0, -4]); jH.pose({ armR: [3.0, -0.1, 0.1], armL: [0.2, 0.4, 0.4] }); jH.face({ open: 1, mouth: 'smile', brow: 0.6 }); jH.holoMat.opacity = 0.35 + 0.1 * Math.sin(t * 29); goldLight.position.set(0, 2.4, -1.2); goldLight.intensity = 6; }
    else { burstSparks([1.7, 2.2, -2.4], lin(t, 24.6, 25.6), 3.5, 11); }
    if (t > 24.6 && t < 24.67) { impact = true; } if (t > 24.6 && t < 24.9) { flash = 0.6; shake = 0.12; }
    if (t > 28.4 && t < 29.2) shake = 0.06;
    if (t < 22.0) { const k = sm((t - 18.9) / 3.1); camPos = mix3([0, 0.5, 2.4], [0, 1.0, 3.6], k); camLook = mix3([0, 0.9, -4], [0, 4.2, -4], k); camera.fov = 50; }
    else if (t < 25.86) { camPos = [-1.6, 4.9, -6.6]; camLook = [1.7, 2.0, -2.4]; camera.fov = 45; }
    else { const k = sm((t - 25.86) / 6); camPos = mix3([0.5, 1.5, 1.6], [0.4, 1.8, 0.6], k); camLook = [0, 3.7, -4]; camera.fov = 44; }
    ov.fx = t > 24.6 && t < 25.4 ? ['KRASH!', seg(t, 24.6, 24.72), '#ff1f3d', 50, 40, 200] : null;
  } else if (t < 37.88) { // ======== a luz azul de novo / arena em silêncio ========
    if (t < 34.3) {
      setRoom(true); setDay(0); scene.background.set('#0d1020');
      const up = seg(t, 33.0, 34.3) * 3;
      jS([1.6, 0.86 + up, -0.6], 0.2, { armL: [0.3, 0.6, 0.3], armR: [0.3, 0.6, 0.3], leg: [0.2 * up, 0] }, { open: 1.2, mouth: 'o', brow: 0.9, look: [0, 0.8] });
      const bk = seg(t, 31.9, 32.5); setBeam(new THREE.Vector3(1.6, 6.5, -0.6), new THREE.Vector3(1.6, -0.2, -0.6), 1.7, 0.4 * bk); blueLight.position.set(1.6, 2.4, 0.4); blueLight.intensity = 16 * bk;
      camPos = [1.9, 1.5, 4.0]; camLook = [1.6, 2.0 + up * 0.6, -0.6]; camera.fov = 50; if (t > 33.9) flash = (t - 33.9) / 0.4;
    } else {
      arenaOn(t, 0); setSpots(t, 0.35); hemi.intensity = 0.4;
      const dn = sm(lin(t, 34.3, 35.6)); jS([0, lerp(7, 0.86, dn), 0], Math.PI + 0.3 * Math.sin(t * 0.8) * seg(t, 36, 36.5), { armL: [0.15, 0.3, 0.3], armR: [0.15, 0.3, 0.3] }, { open: blink(t), mouth: 'flat', brow: 0.7, look: [0.5 * Math.sin(t * 1.2), 0.3] });
      setBeam(new THREE.Vector3(0, 26, 0), new THREE.Vector3(0, 0, 0), 2.0, 0.35 * (1 - seg(t, 35.6, 36.4)));
      camPos = mix3([0, 9, 17], [0, 5.5, 12], sm((t - 34.3) / 3.6)); camLook = [0, 1.6, 0]; camera.fov = 50; if (t < 34.7) flash = 1 - (t - 34.3) / 0.4;
    }
  } else if (t < 55.1) { // ======== revanche anunciada / os guardas ========
    arenaOn(t, t < 46.8 ? 0.9 : 0.4); balc.visible = true;
    bS(VG, [0, BY, -21], 0, 1.05, CROSS); auraB(VG, t > 39.6 && t < 41.7 ? 0.6 : 0.3, t);
    const gIn = seg(t, 43.7, 44.1);
    if (t > 43.7) { bS(GK, [-5.4, BY, -21], 0.25, 1.15 * gIn, { a: t > 44.4 ? FLEX(4) : allA(4, ARM4), jaw: 0.3 }); bS(MG, [5.4, BY, -21], -0.25, 1.2 * gIn, { a: [[0.3, 0.6, 0.9], [0.3, 0.6, 0.9]], jaw: 0.2 }); lavaLight.position.set(5.4, BY + 3, -18); lavaLight.intensity = 8 * gIn; }
    if (t > 43.7 && t < 44.0) flash = 0.4;
    jS([0, 0.86, 2], Math.PI, { armL: [0.15, 0.3, 0.3], armR: [0.15, 0.3, 0.3], head: [-0.35, 0, 0] }, { open: 1.2, mouth: 'o', brow: 0.9, look: [0, 0.8] });
    if (t < 39.6) { hostAnim(t, aTalk); host.position.y = lerp(17, 9.5, seg(t, 37.9, 38.8)) + 0.25 * Math.sin(t * 1.3); fireworks(t, 38.0); camPos = [3, 1.2, 9]; camLook = [0, 8.5, -2]; camera.fov = 52; }
    else if (t < 41.6) { camPos = [0.6, 9.6, -12.4]; camLook = [0, 13.2, -21]; camera.fov = 38; }
    else if (t < 46.8) { hostAnim(t, aTalk); camPos = mix3([0, 10.2, -8.5], [0, 10.6, -9.6], sm((t - 41.6) / 5)); camLook = [0, 13.0, -21]; camera.fov = 52; }
    else if (t < 50.0) {
      jo.pose({ breathe: jb, armL: [0.6, 0.5, 1.0], armR: [0.6, 0.5, 1.0], head: [0, 0, jTalk > 0 ? 0.05 * Math.sin(t * 6) : 0] }); jo.face({ open: 1.2, mouth: 'o', talk: jTalk, brow: 1.0 });
      camPos = [0.35, 2.05, -0.3]; camLook = [0, 1.95, 2]; camera.fov = 38;
    } else {
      const zw = lin(t, 50.0, 50.9); Z.visible = true; const zp = [lerp(3.2, 1.2, sm(zw)), 0.53, 2.3]; Z.position.set(...zp); Z.rotation.y = facing(zp, [0, 0, 2]);
      zb.pose({ scl: [0.62, 0.62, 0.62], leg: walkPose(zw * 3, zw < 1 ? 1 : 0).leg, armL: [zTalk > 0 ? 0.9 + 0.3 * Math.sin(t * 5) : 0.2, 0.3, 0.5] }); zb.face({ open: blink(t, 1), mouth: 'smile', talk: zTalk, brow: 0.3, look: [0, 0.8] });
      const calm = seg(t, 52.6, 53.4); J.rotation.y = lerp(Math.PI, facing([0, 0, 2], zp), 0.5);
      jo.face({ open: calm > 0.5 ? 0.06 : blink(t), mouth: calm > 0.5 ? 'smile' : 'flat', brow: calm > 0.5 ? 0 : 0.6 }); auraJ(0.55 * calm, t);
      camPos = [2.7, 1.7, -1.3]; camLook = [0.6, 1.45, 2.1]; camera.fov = 44;
    }
  } else if (t < 120.28) { // ================= LUTA 1: GORRAK =================
    arenaOn(t, 0.75); ov.score = 0;
    let jp = [-1.2, 0.86, 0], jr = PI2, jpose = { ...GUARD }, jface = { ...GUARDF };
    let gp = [2.4, 0, 0], gr = -PI2, gpose = { a: allA(4, [0.5, 0.35, 1.4]), breathe: 0.02 * Math.sin(t * 2), knee: [0.15, 0.15] };
    let jRot = null, gA = 0;
    if (t < 59.84) { // salto do camarote
      const k = lin(t, 55.3, 56.6); jp = [-4, 0.86, 0];
      gp = [lerp(-5.4, 4, k), lerp(BY, 0, k) + 9 * Math.sin(k * Math.PI), lerp(-21, 0, k)];
      gr = k < 1 ? facing([-5.4, 0, -21], [4, 0, 0]) : -PI2;
      const land = seg(t, 56.6, 57.4); gpose = k < 1 ? { a: allA(4, [2.6, 0.4, 0.5]), knee: [1.2, 1.2], leg: [0.8, 0.8] } : { a: allA(4, [lerp(0.2, 0.5, land), lerp(1.2, 0.35, land), 1.2]), knee: [lerp(1.0, 0.15, land), lerp(1.0, 0.15, land)], leg: [lerp(0.6, 0, land), lerp(0.6, 0, land)], lean: lerp(0.4, 0, land), jaw: 0.6 };
      if (k >= 1) { gp[1] = -0.6 * (1 - land); cracks(crk[0], [4, 0, 0], lin(t, 56.6, 56.9), 5); ringAt(0, [4, 0.1, 0], t - 56.6, 9, [PI2, 0, 0], 0.8, '#ffd1a8'); rockBurst([4, 0, 0], lin(t, 56.6, 58.0), 5, 5, 2); for (let i = 0; i < 14; i++) puff(i, [4 + Math.cos(i) * (1 + 3 * lin(t, 56.6, 58.4)), 0.5, Math.sin(i) * (1 + 3 * lin(t, 56.6, 58.4))], lin(t, 56.6, 58.6), 2, '#8a8290'); }
      if (t > 56.6 && t < 56.67) impact = true; if (t > 56.6 && t < 57.0) { flash = 0.5; shake = 0.15; }
      jface = { open: 1.3, mouth: 'o', brow: 1.0 };
      if (t < 56.6) { camPos = [-9, 2.5, 10]; camLook = [gp[0] * 0.6, Math.max(2, gp[1]), gp[2] * 0.6]; camera.fov = 55; }
      else { camPos = [-1, 0.6, 5.6]; camLook = [4, 3.2, 0]; camera.fov = 52; }
      ov.fx = t > 56.6 && t < 57.5 ? ['BOOM!', seg(t, 56.6, 56.75), '#ff9f1c', 60, 30, 230] : null;
      ov.nc = t > 57.0 && t < 59.8 ? ['GORRAK', 'O MONSTRO DE QUATRO BRAÇOS', '#ff4d4d', seg(t, 57.0, 57.2)] : null;
      if (t > 56.6) gp = [4, gp[1], 0];
    } else if (t < 66.1) { // músculos / quatro braços / quatro socos
      jp = [-4, 0.86, 0]; gp = [4, 0, 0];
      if (t < 62.5) { gpose = { a: [...FLEX(2), ...allA(2, [0.1, 0.9, 1.8, PI2])], breathe: 0.03 + 0.02 * Math.sin(t * 5), jaw: 0.5, head: [-0.1, 0, 0] }; camPos = [1.3, 0.45, 1.5]; camLook = [4, 4.3, 0]; camera.fov = 52; roll = 0.06; }
      else if (t < 64.0) { gpose = { a: [...allA(2, [0.2, 1.4, 0.3]), ...allA(2, [0.2, 1.0, 0.3])], jaw: 0.3 }; camPos = [-0.6, 2.3, 6.2]; camLook = [4, 3.2, 0]; camera.fov = 48; }
      else { const P = [64.3, 64.55, 64.8, 65.05]; gpose = { a: allA(4, [0.5, 0.35, 1.4]), lean: 0.15, jaw: 0.4 }; P.forEach((t0, i) => { const k = hitK(t, t0, 0.1, 0.06, 0.12); if (k > 0) gpose.a[i] = [lerp(0.5, 1.55, k), lerp(0.35, -0.2, k), lerp(1.4, 0.05, k)]; }); camPos = [-0.8, 2.7, 0.9]; camLook = [4, 3.3, 0]; camera.fov = 50; ov.speed = 0.35; shake = 0.02; ov.fx = t > 64.3 && t < 65.6 ? ['POW! POW!', seg(t, 64.3, 64.4), '#ff4d4d', 50, 26, 170] : null; }
    } else if (t < 70.5) { // desviou de dois, bloqueou o terceiro...
      const P = [[66.7, 0], [67.35, 1], [68.6, 2]]; let dz = 0, dx = 0;
      P.forEach(([t0, i]) => { const k = hitK(t, t0); if (k > 0) gpose.a[i] = [lerp(0.5, 1.55, k), lerp(0.35, -0.25, k), lerp(1.4, 0.05, k)]; });
      dz += 0.9 * hitK(t, 66.7, 0.12, 0.2, 0.3) - 0.9 * hitK(t, 67.35, 0.12, 0.2, 0.3);
      if (t > 68.3 && t < 69.5) { jpose = JBLOCK; dx = -0.45 * seg(t, 68.6, 68.8); }
      if (t > 68.6 && t < 68.7) { flash = 0.4; shake = 0.1; }
      burstSparks([0.2, 2.0, 0], lin(t, 68.6, 69.3), 2, 4);
      const wind = seg(t, 69.6, 70.3), up = seg(t, 70.32, 70.45); if (wind > 0) gpose.a[3] = [lerp(lerp(0.5, -0.7, wind), 2.3, up), lerp(0.35, 0.1, up), lerp(1.4, 0.3, up)]; gpose.lean = 0.25 * up; gpose.twist = 0.3 * wind - 0.5 * up;
      jp = [-1.2 + dx, 0.86, dz]; jRot = [dz * 0.25, PI2, 0];
      jface = t > 69.6 ? { open: 1.3, mouth: 'o', brow: 1.1 } : jface;
      if (t < 69.6) { const a = lerp(-0.15, 0.2, (t - 66.1) / 3.5); camPos = [0.6 + Math.sin(a) * 7.5, 2.4, Math.cos(a) * 7.5]; camLook = [0.6, 2.2, 0]; camera.fov = 50; }
      else { camPos = [-0.2, 0.7, 3.4]; camLook = [1.0, 2.3, 0]; camera.fov = 55; ov.slow = true; }
      ov.fx = t > 66.7 && t < 67.2 ? ['VUUSH!', 1, '#ffffff', 40, 28, 140] : t > 67.35 && t < 67.85 ? ['VUUSH!', 1, '#ffffff', 60, 28, 140] : t > 68.6 && t < 69.4 ? ['CLANG!', seg(t, 68.6, 68.7), '#7df9ff', 46, 30, 190] : null;
    } else if (t < 75.94) { // o quarto pegou em cheio: voa e bate na parede
      gpose.a[3] = [2.3, 0.1, 0.3]; gpose.lean = 0.25 * (1 - seg(t, 71, 72));
      const fl = lin(t, 70.5, 72.1);
      if (t < 72.1) { jp = [lerp(-1.2, -14.2, 1 - Math.pow(1 - fl, 1.6)), 0.86 + 3.2 * Math.sin(fl * Math.PI) + 0.5 * fl, 0]; jRot = [-fl * 6, PI2, 0]; jpose = { armL: [2.2, 0.8, 0.3], armR: [2.2, 0.8, 0.3], leg: [0.4, -0.2] }; jface = { open: 1.35, mouth: 'o', brow: 1.2 }; }
      else { const sl = seg(t, 72.1, 72.7); jp = [-14.0, lerp(1.4, 0.45, sl), 0]; jRot = [-0.35 * sl, PI2, 0]; jpose = { leg: [1.5 * sl, 1.4 * sl], armL: [0.2, 0.6, 0.3], armR: [0.2, 0.6, 0.3], head: [0.3, 0.3 * Math.sin(t * 2), 0] }; jface = { open: 0.5, mouth: 'o', brow: 0.6, look: [Math.sin(t * 5) * 0.6, Math.cos(t * 5) * 0.4] }; }
      if (t > 70.45 && t < 70.52) impact = true; if (t > 70.45 && t < 70.7) { flash = 0.9; shake = 0.18; }
      if (t > 72.1) { cracks(crk[1], [-14.95, 1.6, 0], lin(t, 72.1, 72.4), 2.6, '#1a1420', [0, 0, -PI2]); rockBurst([-14.5, 1.5, 0], lin(t, 72.1, 73.4), 3, 4, 6); for (let i = 0; i < 6; i++) puff(i, [-14.0 + hash(i) * 1.2, 0.4 + 2.4 * hash(i + 1), (hash(i + 3) - 0.5) * 3.4], lin(t, 72.1, 73.6), 1.1, '#8a8290'); }
      if (t > 72.1 && t < 72.16) impact = true; if (t > 72.1 && t < 72.4) { flash = 0.5; shake = 0.2; }
      if (t < 72.1) { camPos = [jp[0] + 2.2, jp[1] + 0.6, 8.5]; camLook = [jp[0], jp[1], 0]; camera.fov = 52; ov.speed = 0.6; }
      else if (t < 73.4) { camPos = [-6, 1.6, 2.6]; camLook = [-14.5, 1.3, 0]; camera.fov = 48; }
      else { camPos = [-12.0, 1.2, 1.3]; camLook = [-14, 0.9, 0]; camera.fov = 44; }
      ov.fx = t > 70.45 && t < 71.3 ? ['BAM!', seg(t, 70.45, 70.6), '#ff4d4d', 52, 36, 240] : t > 72.1 && t < 73.0 ? ['CRASH!', seg(t, 72.1, 72.22), '#ffd60a', 30, 40, 210] : null;
      ov.ooh = true;
    } else if (t < 81.31) { // o Zib: "olha pra onde ele olha!"
      const sl = 1 - seg(t, 80.0, 81.2); jp = [-14.0 + 0.6 * (1 - sl), lerp(0.86, 0.45, sl), 0]; jRot = [-0.35 * sl, PI2, 0]; jpose = { leg: [1.5 * sl, 1.4 * sl], armL: [0.2, 0.6, 0.3], armR: [0.2, 0.6, 0.3] }; jface = { open: blink(t), mouth: 'flat', brow: -0.2, look: [0.6, 0] };
      Z.visible = true; Z.position.set(-12.0, 0.53, 3.0); Z.rotation.y = facing([-12, 0, 3], [-14, 0, 0]); zb.pose({ scl: [0.62, 0.62, 0.62], armL: [2.5 + 0.3 * Math.sin(t * 7), 0.4, 0.3], armR: [zTalk > 0 ? 1.4 : 0.6, 0.2, 0.4] }); zb.face({ open: 1.2, mouth: 'o', talk: zTalk, brow: 1.0 });
      gp = [2.4, 0, 0];
      camPos = [-9.4, 1.5, 4.4]; camLook = [-13, 1.0, 1.2]; camera.fov = 46;
    } else if (t < 87.91) { // o olho entrega o golpe
      const glance = (t0, arm, side) => { const g = seg(t, t0 - 1.0, t0 - 0.75) * (1 - seg(t, t0 - 0.1, t0 + 0.1)); gpose.head = [0.3 * g, side * 0.55 * g, 0]; GK.glow(arm, g); return g; };
      let g1 = 0, g2 = 0;
      if (t < 85.3) g1 = glance(84.6, 0, -1); else g2 = glance(86.6, 1, 1);
      bS(GK, gp, gr, 1.15, gpose);
      if (t < 85.3) { GK.glow(0, seg(t, 83.6, 83.85) * (1 - seg(t, 84.5, 84.7))); } else GK.glow(1, seg(t, 85.6, 85.85) * (1 - seg(t, 86.5, 86.7)));
      const P = [[84.6, 0], [86.6, 1]]; let dz = 0; P.forEach(([t0, i], j) => { const k = hitK(t, t0); if (k > 0) gpose.a[i] = [lerp(0.5, 1.55, k), lerp(0.35, -0.25, k), lerp(1.4, 0.05, k)]; dz += (j ? -1 : 1) * 0.9 * hitK(t, t0 - 0.05, 0.12, 0.25, 0.3); });
      jp = [-1.2, 0.86, dz]; jface = { open: 1.1, mouth: 'flat', brow: -0.5, browTilt: 0.5, look: [0, 0.6] };
      if (t < 82.6) { camPos = [0.6, 2.4, 8]; camLook = [0.6, 2.4, 0]; camera.fov = 50; }
      else if (t < 83.6) { scene.updateMatrixWorld(true); GK.head.getWorldPosition(v); camPos = [v.x - 1.9, v.y - 0.45, v.z + 0.9]; camLook = [v.x, v.y, v.z]; camera.fov = 36; ov.slow = true; }
      else if (t < 84.5) { scene.updateMatrixWorld(true); GK.arms[0].fist.getWorldPosition(v); camPos = [v.x - 1.6, v.y + 0.4, v.z - 1.8]; camLook = [v.x, v.y, v.z]; camera.fov = 40; ov.slow = true; }
      else { const a = lerp(0.1, -0.3, (t - 84.5) / 3.4); camPos = [0.6 + Math.sin(a) * 7, 2.3, Math.cos(a) * 7]; camLook = [0.6, 2.2, 0]; camera.fov = 50; }
      ov.fx = t > 84.6 && t < 85.1 ? ['VUUSH!', 1, '#ffffff', 40, 28, 140] : t > 86.6 && t < 87.1 ? ['VUUSH!', 1, '#ffffff', 60, 28, 140] : null;
      ov.eye = t > 82.6 && t < 84.5;
    } else if (t < 93.23) { // esquerda de cima, direita de baixo, e todos
      let dz = 0, dy = 0;
      const sl = hitK(t, 88.7, 0.25, 0.25, 0.35); gpose.a[1] = [lerp(0.5, 2.7, seg(t, 88.15, 88.45)) * (1 - seg(t, 88.45, 88.7)) + lerp(0, 1.2, seg(t, 88.45, 88.7)) * (1 - seg(t, 89.0, 89.3)), 0.1, 0.3]; gpose.lean = 0.4 * seg(t, 88.45, 88.7) * (1 - seg(t, 89.0, 89.4));
      if (t < 88.7) { GK.glow(1, seg(t, 87.95, 88.15)); }
      dz += 1.1 * seg(t, 88.4, 88.65) * (1 - seg(t, 89.3, 89.7));
      if (t > 88.7 && t < 88.8) shake = 0.12; cracks(crk[2], [-1.0, 0, 0], lin(t, 88.7, 88.95) * (1 - lin(t, 92.8, 93.2)), 2.2, '#2a2230');
      const lo = hitK(t, 89.9, 0.2, 0.15, 0.3); gpose.a[2] = [lerp(0.5, 1.3, lo), lerp(0.35, 0.1, lo), lerp(1.4, 0.3, lo)]; if (t > 89.3 && t < 89.9) GK.glow(2, seg(t, 89.3, 89.5));
      dy = 1.3 * Math.sin(Math.PI * lin(t, 89.75, 90.3));
      if (t > 90.7) { const r = (t - 90.7) * 2.4, i = Math.floor(r) % 4, ph = r % 1; gpose.a[i] = [lerp(0.5, 1.55, Math.sin(ph * Math.PI)), -0.2, lerp(1.4, 0.05, Math.sin(ph * Math.PI))]; dz = Math.sin(r * Math.PI) * 0.9; jGhosts.forEach((g, k) => setGhost(g, [-1.2, 0.2, Math.sin((r - (k + 1) * 0.12) * Math.PI) * 0.9], 0.22 * (1 - k / 6), '#7df9ff')); }
      jp = [-1.2, 0.86 + dy, dz]; jface = { open: 1.0, mouth: 'flat', brow: -0.5, browTilt: 0.5 };
      if (t < 90.7) { camPos = [0.3, 2.5, 7.8]; camLook = [0.4, 2.3, 0]; camera.fov = 50; }
      else { const a = lerp(-0.5, 1.4, (t - 90.7) / 2.5); camPos = [-1.2 + Math.sin(a) * 6, 2.2, Math.cos(a) * 6]; camLook = [0, 2.2, 0]; camera.fov = 52; roll = 0.07; }
      ov.fx = t > 88.7 && t < 89.4 ? ['WHAM!', seg(t, 88.7, 88.8), '#ff4d4d', 38, 55, 190] : t > 89.9 && t < 90.5 ? ['VUUSH!', 1, '#ffffff', 50, 26, 150] : null;
    } else if (t < 96.6) { // os quatro braços juntos... ele subiu
      const wind = seg(t, 93.4, 94.9), sl = seg(t, 95.3, 95.45);
      gpose = { a: allA(4, [lerp(lerp(0.5, 2.9, wind), 1.0, sl), lerp(0.35, 0.15, wind), lerp(1.4, lerp(0.4, 0.15, sl), wind)]), lean: lerp(-0.25 * wind, 0.55, sl), jaw: 0.8 * wind, knee: [0.3 * sl, 0.3 * sl] };
      const up = seg(t, 95.25, 96.5); jp = [-1.2, 0.86 + 6.5 * up, 0]; jpose = up > 0 ? JFLY : GUARD; jface = { open: 1.1, mouth: 'flat', brow: -0.6, browTilt: 0.6, look: [0, 0.6] };
      if (t > 95.45) { cracks(crk[0], [-0.6, 0, 0], lin(t, 95.45, 95.8), 6, '#ff6a00'); ringAt(0, [-0.6, 0.1, 0], t - 95.45, 10, [PI2, 0, 0], 0.9, '#ffd1a8'); rockBurst([-0.6, 0, 0], lin(t, 95.45, 96.8), 6, 6, 3); for (let i = 0; i < 16; i++) puff(i, [-0.6 + Math.cos(i * 0.4) * (1 + 4 * lin(t, 95.45, 97)), 0.5, Math.sin(i * 0.4) * (1 + 4 * lin(t, 95.45, 97))], lin(t, 95.45, 97.2), 2, '#8a8290'); }
      if (t > 95.45 && t < 95.52) impact = true; if (t > 95.45 && t < 95.85) { flash = 0.6; shake = 0.2; }
      if (t < 95.3) { camPos = [-3.4, 0.55, 1.5]; camLook = [2.4, 5.0, 0]; camera.fov = 56; roll = -0.07; } else { camPos = [0.4, 3.2, 11]; camLook = [0.2, 3.4, 0]; camera.fov = 56; }
      ov.fx = t > 95.45 && t < 96.4 ? ['KRAAASH!', seg(t, 95.45, 95.6), '#ff9f1c', 55, 60, 230] : null;
    } else if (t < 103.19) { // pela primeira vez, ele voou
      jp = [-1.2, 7.4 + 0.15 * Math.sin(t * 2), 0]; jpose = { ...JFLY, armL: [0.5, 0.4, 1.6], armR: [0.5, 0.4, 1.6] }; jface = { open: 1.0, mouth: 'flat', brow: -0.6, browTilt: 0.6, look: [0, -0.5] };
      gpose = { a: allA(4, [0.3, 0.4, 0.6]), head: [-0.55, 0, 0], jaw: 0.6 };
      const ign = seg(t, 96.8, 97.3); gA = ign; if (t > 96.8 && t < 97.2) flash = 0.5; ringAt(1, [-1.2, 7.8, 0], t - 96.8, 4, [PI2, 0, 0], 0.7, '#ffd60a');
      if (t < 100.6) { camPos = mix3([-2.6, 4.6, 2.6], [-2.4, 5.2, 2.2], sm((t - 96.6) / 4)); camLook = [-1.2, 7.6, 0]; camera.fov = 50; roll = 0.06; }
      else { camPos = [-0.9, 6.0, 11.5]; camLook = [0.6, 5.2, 0]; camera.fov = 54; }
      ov.ex = 1;
    } else if (t < 109.19) { // energia nas duas mãos... RAJADA DOURADA!
      jp = [-1.2, 7.4, 0]; gpose = { a: allA(4, [0.3, 0.4, 0.6]), head: [-0.55, 0, 0], jaw: 0.4 };
      const ch = seg(t, 103.3, 106.4), fire = t > 106.75;
      jpose = fire ? { ...JBEAM, lean: 0.55, leg: [0.1, -0.3] } : { ...JCHG }; jface = { open: t > 106.0 ? 1.1 : 0.4, mouth: t > 106.0 ? 'o' : 'flat', brow: -0.8, browTilt: 0.7 };
      J.position.set(...jp); J.rotation.set(0, PI2, 0); jo.pose({ breathe: jb, ...jpose });
      gA = 0.6 + 0.4 * ch; braceMat.emissiveIntensity = 3 + 5 * ch;
      const hm = midW(jo.handR, jo.handL);
      if (!fire) { setBall(ballJ, hm, 0.12 + 0.42 * ch, 1, t); motes.forEach((m, i) => { const ph = 1 - ((t * 0.9 + i / 24) % 1); m.visible = ch > 0.05; const a = i * 2.4 + t * 3; m.position.set(hm[0] + Math.cos(a) * 1.6 * ph, hm[1] + Math.sin(a * 0.7) * 1.2 * ph, hm[2] + Math.sin(a) * 1.6 * ph); m.scale.setScalar(0.8); m.material.color.set('#ffd60a'); }); goldLight.position.set(...hm); goldLight.intensity = 12 * ch; }
      const P = [2.4, 3.0, 0];
      if (fire) { const gr2 = lin(t, 106.75, 107.0), op = 1 - seg(t, 108.4, 109.0); setRay(rayJ, hm, mix3(hm, P, gr2), 0.42, op, t); goldLight.position.set(...hm); goldLight.intensity = 25 * op; }
      if (t > 107.0) { setDome(P, lin(t, 107.0, 108.8), 7); boomLight.position.set(...P); boomLight.intensity = 60 * (1 - lin(t, 107, 108.8)); const kb = seg(t, 107.0, 107.8); gp = [lerp(2.4, 4.6, kb), 0, 0]; gpose = { a: allA(4, [2.4, 0.8, 0.2]), lean: -1.2 * kb, jaw: 1 }; GK.body.rotation.x = -1.1 * kb; cracks(crk[0], [3.2, 0, 0], lin(t, 107.0, 107.3), 7, '#ff9f1c'); rockBurst([3, 0, 0], lin(t, 107.0, 108.5), 6, 7, 9); }
      if (t > 107.0 && t < 107.07) impact = true; if (t > 107.0 && t < 107.5) { flash = 1; shake = 0.25; }
      if (t < 104.9) { const a = lerp(0.5, 1.2, (t - 103.19) / 1.7); camPos = [-1.2 + Math.sin(a) * 4.4, 7.9, Math.cos(a) * 4.4]; camLook = [-1.2, 7.8, 0]; camera.fov = 46; }
      else if (t < 106.75) { camPos = [-4.8, 10.4, 2.8]; camLook = [2.4, 2.8, 0]; camera.fov = 52; }
      else if (t < 107.0) { camPos = [-1.0, 5.0, 11]; camLook = [0.6, 4.4, 0]; camera.fov = 55; ov.speed = 0.7; }
      else { camPos = [-2, 3.6, 13.5]; camLook = [2.5, 2.6, 0]; camera.fov = 56; }
      ov.fx = t > 106.5 && t < 107.0 ? ['RAJADA DOURADA!', seg(t, 106.5, 106.62), '#ffd60a', 50, 20, 150] : t > 107.0 && t < 108.2 ? ['BOOOM!', seg(t, 107.0, 107.15), '#ffd60a', 58, 40, 250] : null;
      jRot = [0, PI2, 0];
    } else { // Gorrak fora + lição 1
      gp = [4.6, 0, 0]; gpose = { a: allA(4, [2.4, 0.8, 0.2]), jaw: 0.6 }; GK.eyeM.emissiveIntensity = 0.3;
      cracks(crk[0], [3.2, 0, 0], 1, 7, '#2a2230');
      const dn = sm(lin(t, 109.2, 110.1)); jp = [-1, lerp(7.4, 0.86, dn), 1.5]; jr = 0.5; jpose = t < 110.1 ? JFLY : { breathe: jb, armR: [0.1, 0.3, 0.3], armL: [0.1, 0.3, 0.3] }; jface = { open: t > 114 ? 0.06 : blink(t), mouth: 'smile', brow: 0.2 };
      gA = lerp(0.8, 0.35, seg(t, 110, 112)); ov.score = t > 109.6 ? 1 : 0; ov.ex = 1;
      if (t < 114.04) { camPos = [-5.5, 1.6, 7.0]; camLook = [1.6, 1.4, 0.5]; camera.fov = 50; }
      else { const a = lerp(0.6, -0.2, sm((t - 114) / 6.3)); camPos = [-1 + Math.sin(a) * 6.5, 2.4, 1.5 + Math.cos(a) * 6.5]; camLook = [0, 1.9, 1.0]; camera.fov = 46; ov.lesson = ['LIÇÃO 1', 'TODO GOLPE DÁ UM AVISO ANTES.<br><span style="color:#ffd60a">QUEM PRESTA ATENÇÃO, VÊ.</span>', seg(t, 114.04, 114.3)]; }
    }
    if (!(t >= 81.31 && t < 87.91)) bS(GK, gp, gr, 1.15, gpose); else { GK.root.position.set(...gp); GK.pose(gpose); }
    if (t > 107.0 && t < 120.28) GK.body.rotation.x = -1.35 * seg(t, 107.0, 107.8); if (t > 107.0 && t < 120.28) GK.body.position.y = 0.5 * seg(t, 107.4, 107.9);
    J.position.set(...jp); if (jRot) J.rotation.set(...jRot); else J.rotation.set(0, jr, 0); jo.pose({ breathe: jb, ...jpose }); jo.face(jface);
    auraGold(gA, t);
    ov.ex = ov.ex || 0.75;
  } else if (t < 186.69) { // ================= LUTA 2: MAGMOR =================
    arenaOn(t, 0.75); ov.score = 1;
    let jp = [-3, 0.86, 0], jr = PI2, jpose = { ...GUARD }, jface = { ...GUARDF }, jRot = null, rk = 0, cA = 0;
    let mp = [3.5, 0, 0], ms = 1.2, mpose = { a: [[0.3, 0.45, 0.8], [0.3, 0.45, 0.8]], breathe: 0.02 * Math.sin(t * 2), jaw: 0 }, mVis = true;
    lavaLight.position.set(3.5, 3, 2); lavaLight.intensity = 14;
    if (t < 124.29) { // sobe da lava
      const pool = seg(t, 120.3, 121.0) * (1 - seg(t, 123.2, 124.2)); lavaPool.visible = pool > 0.01; lavaPool.scale.setScalar(3.2 * pool); lavaPool.material.opacity = pool;
      const rise = seg(t, 121.0, 123.0); mp = [3.5, lerp(-6.5, 0, rise), 0]; mpose.a = allA(2, [lerp(2.8, 0.3, rise), 0.4, 0.4]); mpose.jaw = 0.8 * rise;
      burstSparks([3.5, 0.5, 0], (t * 1.5) % 1, 3, Math.floor(t * 1.5) * 5); lavaLight.intensity = 30 * pool + 10;
      jface = { open: 1.3, mouth: 'o', brow: 1.0 };
      camPos = [-2.5, 1.0, 6.5]; camLook = [3.5, 3.3, 0]; camera.fov = 52;
      ov.nc = t > 121.8 && t < 124.2 ? ['MAGMOR', 'O TITÃ DE LAVA', '#ff8c00', seg(t, 121.8, 122.0)] : null;
    } else if (t < 133.11) { // rocha derretida / raiva = tamanho
      const grow = seg(t, 130.0, 131.0); ms = 1.2 + 0.15 * grow; magMat.emissiveIntensity = 1.0 + 1.2 * seg(t, 129.0, 130.5) * (1 - seg(t, 131.5, 132.6));
      mpose = { a: t > 128.6 ? allA(2, [0.5, 0.7, 1.9, PI2]) : [[0.3, 0.45, 0.8], [0.3, 0.45, 0.8]], jaw: t > 129 && t < 131.5 ? 1 : 0.1, breathe: 0.04 * Math.sin(t * 4), head: [-0.1, 0, 0] };
      if (t > 130.0 && t < 131.0) shake = 0.06; if (t > 130.0) ringAt(0, [3.5, 0.1, 0], t - 130.0, 6, [PI2, 0, 0], 0.8, '#ff9f1c');
      for (let i = 0; i < 8; i++) { const ph = (t * 0.5 + i / 8) % 1; puff(i, [3.5 + (hash(i) - 0.5) * 2, 4 * ms * 0.9 + ph * 3, (hash(i + 2) - 0.5) * 2], ph, 1.0, '#c9c2bd'); }
      if (t < 127.2) { const a = lerp(-1.0, -2.1, (t - 124.29) / 2.9); camPos = [3.5 + Math.sin(a) * 4.8, 3.6, Math.cos(a) * 4.8]; camLook = [3.5, 3.4, 0]; camera.fov = 46; }
      else { camPos = [-0.6, 0.8, 2.6]; camLook = [3.5, 4.4, 0]; camera.fov = 54; roll = 0.06; }
    } else if (t < 144.22) { // provoca
      ms = 1.35; mpose = { a: [[1.4, -0.2, 0.1], [0.3, 0.45, 0.8]], lean: 0.45, jaw: t > 136.89 ? mTalk * 1.4 : 0.2, head: [0.2, 0, 0] };
      const rage = seg(t, 141.2, 142.5); jface = { open: 1.0, mouth: rage > 0.5 ? 'flat' : 'o', brow: lerp(0.4, -1.0, rage), browTilt: lerp(0, 0.8, rage) };
      rk = rage * (0.6 + 0.3 * Math.sin(t * 20)); ov.rage = rage * 0.7;
      if (t < 136.89) { camPos = [-5.6, 1.9, 1.5]; camLook = [2.8, 4.2, 0]; camera.fov = 46; }
      else if (t < 140.0) { mp = [3.5, 0, 0]; bS(MG, mp, -PI2, ms, mpose); scene.updateMatrixWorld(true); MG.head.getWorldPosition(v); camPos = [v.x - 2.7, v.y - 0.9, v.z + 1.0]; camLook = [v.x, v.y, v.z]; camera.fov = 40; }
      else { camPos = [-1.1, 1.9, 1.2]; camLook = [-3, 1.85, 0]; camera.fov = 40; shake = 0.01 * rage; }
    } else if (t < 152.1) { // ataca com raiva: e ele cresce
      const H = [145.0, 145.6, 146.2, 146.8, 147.4, 148.0, 148.6, 149.2]; let n = 0; H.forEach(h => { if (t > h) n++; });
      ms = 1.35 + 0.07 * n; magMat.emissiveIntensity = 1.1 + 0.15 * n; mpose = { a: [[0.3, 0.45, 0.8], [0.3, 0.45, 0.8]], jaw: 0.5 + 0.4 * Math.abs(Math.sin(t * 9)), lean: -0.1, breathe: 0.02 };
      const dash = seg(t, 144.4, 144.9); const back2 = seg(t, 150.0, 150.8);
      jp = [lerp(lerp(-3, 1.2, dash), -6, back2), lerp(0.86, 2.4, dash) + Math.sin(back2 * Math.PI) * 1.5 - lerp(0, 1.54, back2), 0];
      const ph = H.findIndex(h => t > h - 0.18 && t < h + 0.2); jpose = ph >= 0 ? (ph % 2 ? { armL: [1.6, -0.1, 0.05], armR: [0.9, 0.2, 1.8], lean: 0.3 } : JPUNCH) : (back2 > 0 ? { armL: [2.2, 0.8, 0.3], armR: [2.2, 0.8, 0.3] } : GUARD); jface = { open: 1.0, mouth: 'o', brow: -1.0, browTilt: 0.8 };
      if (back2 > 0) jRot = [-back2 * 4, PI2, 0];
      if (t > 149.9 && t < 150.2) mpose.a[0] = [1.3, -0.6, 0.2];
      rk = 0.8; ov.rage = 0.7;
      H.forEach((h, i) => { if (t > h && t < h + 0.06) { flash = 0.35; shake = 0.08; } }); const hi = H.findIndex(h => t > h && t < h + 0.45); if (hi >= 0) ov.fx = [['POW!', 'BAM!', 'TUM!', 'POW!'][hi % 4], seg(t, H[hi], H[hi] + 0.1), '#ff3b30', 40 + (hi % 3) * 10, 30 + (hi % 2) * 12, 170];
      if (t < 149.6) { const a = lerp(-0.4, 0.9, (t - 144.22) / 5.4); camPos = [2.0 + Math.sin(a) * 9.5, 3.0, Math.cos(a) * 9.5]; camLook = [2.0, 3.5, 0]; camera.fov = 52; }
      else { camPos = [-9, 2.6, 8.5]; camLook = [0, 3.8, 0]; camera.fov = 56; }
    } else if (t < 156.54) { // a raiva era o combustível
      ms = 1.91; magMat.emissiveIntensity = 2.4; mpose = { a: allA(2, [0.4, 0.8, 2.2, PI2 * 0.4]), jaw: 0.5 + 0.5 * Math.abs(Math.sin(t * 7)), lean: -0.2 + 0.05 * Math.sin(t * 7), breathe: 0.03 * Math.sin(t * 7) };
      jp = [-6, 0.86, 0]; jpose = { lean: 0.35, armL: [0.4, 0.3, 0.6], armR: [0.4, 0.3, 0.6], breathe: 0.04 * Math.sin(t * 7) }; jface = { open: 0.9, mouth: 'o', brow: -0.8, browTilt: 0.6, look: [0, 0.8] };
      rk = 0.6; ov.rage = 0.6;
      camPos = [-7.4, 0.6, 1.2]; camLook = [3.5, 6.6, 0]; camera.fov = 60; roll = -0.08;
    } else if (t < 161.1) { // ele parou e respirou
      ms = 1.91; magMat.emissiveIntensity = 2.2; mpose = { a: allA(2, [0.4, 0.8, 2.2, PI2 * 0.4]), jaw: 0.2 };
      jp = [-6, 0.86, 0]; const calm = seg(t, 157.6, 159.0); jpose = { breathe: 0.03 * Math.sin(t * 2), armL: [lerp(0.4, 0.1, calm), 0.3, 0.3], armR: [lerp(0.4, 0.1, calm), 0.3, 0.3], lean: lerp(0.35, 0, calm) }; jface = { open: calm > 0.5 ? 0.05 : 1, mouth: 'flat', brow: lerp(-0.8, 0, calm) };
      rk = 0.6 * (1 - calm); cA = 0.5 * calm; ov.rage = 0.6 * (1 - calm); ov.blue = calm > 0.3;
      camPos = mix3([-4.1, 1.9, 1.4], [-4.6, 1.88, 0.9], sm((t - 156.54) / 4.6)); camLook = [-6, 1.85, 0]; camera.fov = 40;
    } else if (t < 164.6) { // fala alguma coisa! reage!
      ms = 1.91; magMat.emissiveIntensity = 2.0; mpose = { a: allA(2, [2.4 + 0.3 * Math.sin(t * 8), 0.5, 0.6]), jaw: mTalk * 1.5, lean: 0.2 };
      jp = [-6, 0.86, 0]; jpose = { breathe: 0.02 * Math.sin(t * 2), armL: [0.1, 0.3, 0.3], armR: [0.1, 0.3, 0.3] }; jface = { open: 0.05, mouth: 'flat', brow: 0 }; cA = 0.5;
      const st = [161.4, 162.6]; st.forEach(s => { if (t > s && t < s + 0.3) shake = 0.12; }); mp = [3.5, 0.3 * Math.abs(Math.sin((t - 161.1) * 2.6)), 0];
      if (t < 162.9) { mp = [3.5, 0, 0]; bS(MG, mp, -PI2, ms, mpose); scene.updateMatrixWorld(true); MG.head.getWorldPosition(v); camPos = [v.x - 3.3, v.y - 1.8, v.z + 1.2]; camLook = [v.x, v.y, v.z]; camera.fov = 44; roll = 0.07; }
      else { camPos = [-8.6, 1.6, 4.6]; camLook = [-2, 3.4, 0]; camera.fov = 52; }
    } else if (t < 170.52) { // esfria, vira pedra, racha
      const cool = seg(t, 165.0, 170.0); ms = lerp(1.91, 1.45, cool); magMat.emissiveIntensity = lerp(2.0, 0.04, cool); magMat.color.set(new THREE.Color('#6b4a3c').lerp(new THREE.Color('#6e6a68'), cool)); veinM.emissiveIntensity = lerp(3, 0.05, cool); MG.eyeM.emissiveIntensity = lerp(3, 0.4, cool);
      crackM.opacity = seg(t, 168.2, 168.8); mpose = { a: allA(2, [lerp(1.0, 0.3, cool), 0.5, 0.6]), jaw: 0.6 * (1 - cool) };
      for (let i = 0; i < 12; i++) { const ph = (t * 0.6 + i / 12) % 1; puff(i, [3.5 + (hash(i) - 0.5) * 2.5, 1 + 6 * ph * ms / 1.5, (hash(i + 2) - 0.5) * 2.5], ph, 1.2, '#e9e4df'); }
      jp = [-6, 0.86, 0]; jpose = { breathe: 0.02 * Math.sin(t * 2), armL: [0.1, 0.3, 0.3], armR: [0.1, 0.3, 0.3] }; jface = { open: t > 168.5 ? 1 : 0.05, mouth: 'flat', brow: -0.3 }; cA = 0.5;
      lavaLight.intensity = 14 * (1 - cool);
      if (t < 167.6) { camPos = [-9, 3.0, 9]; camLook = [1.5, 3.8, 0]; camera.fov = 52; }
      else { bS(MG, mp, -PI2, ms, mpose); scene.updateMatrixWorld(true); MG.chest.getWorldPosition(v); camPos = [v.x - 3.6, v.y + 0.3, v.z + 1.6]; camLook = [v.x, v.y, v.z]; camera.fov = 44; }
    } else if (t < 176.36) { // um soco calmo. só um.
      ms = 1.45; magMat.emissiveIntensity = 0.04; magMat.color.set('#6e6a68'); veinM.emissiveIntensity = 0.05; MG.eyeM.emissiveIntensity = 0.4; crackM.opacity = 1; lavaLight.intensity = 0; mpose = { a: allA(2, [0.3, 0.5, 0.6]) };
      const ch = seg(t, 170.6, 171.9), dash = seg(t, 171.9, 172.35);
      jp = [lerp(-6, 1.3, dash), 0.86 + 1.6 * Math.sin(dash * PI2), 0]; jpose = dash > 0 ? { ...JPUNCH, armR: [lerp(0.9, 1.6, dash), -0.1, lerp(1.8, 0.05, dash)] } : { armR: [0.7, 0.2, 1.9], armL: [0.9, 0.2, 1.8], lean: 0.1, leg: [0.4, -0.3] };
      jface = { open: 1.0, mouth: 'flat', brow: -0.4, browTilt: 0.4 }; cA = 0.5 + 0.5 * ch;
      if (t < 172.6) { scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); fist.visible = fistIn.visible = ch > 0.05; fist.position.copy(v); fistIn.position.copy(v); fist.scale.setScalar(0.2 + 0.4 * ch); fistIn.scale.setScalar(0.12 + 0.2 * ch); fist.material.opacity = 0.6; fistIn.material.opacity = 0.9; }
      if (t > 172.35) { mVis = false; chunkBurst([3.5, 2.9, 0], lin(t, 172.4, 174.6), 7, 5, 3); for (let i = 0; i < 18; i++) puff(i, [3.5 + Math.cos(i * 0.35) * (1 + 4 * lin(t, 172.4, 175)), 0.8 + 3 * hash(i), Math.sin(i * 0.35) * (1 + 4 * lin(t, 172.4, 175))], lin(t, 172.4, 175.4), 2.2, '#9a948f'); ringAt(0, [2.4, 2.7, 0], t - 172.35, 7, [0, PI2, 0], 0.8, '#7df9ff'); }
      if (t > 172.35 && t < 172.42) impact = true; if (t > 172.42 && t < 172.75) { flash = 0.5 * (1 - lin(t, 172.42, 172.75)); shake = 0.2; }
      if (t < 171.9) { scene.updateMatrixWorld(true); jo.handR.getWorldPosition(v); camPos = [v.x + 1.6, v.y + 0.6, v.z + 2.2]; camLook = [v.x, v.y, v.z]; camera.fov = 40; }
      else if (t < 172.35) { camPos = [-1.5, 2.0, 6]; camLook = [1.5, 2.5, 0]; camera.fov = 56; ov.speed = 0.7; }
      else { camPos = [-3, 2.3, 10.5]; camLook = [3, 2.4, 0]; camera.fov = 56; ov.slow = t < 174.2; }
      ov.fx = t > 172.35 && t < 173.6 ? ['KRAK!', seg(t, 172.35, 172.5), '#7df9ff', 56, 34, 250] : null;
    } else { // 2 x 0 + lição 2
      mVis = false; chunkBurst([3.5, 2.9, 0], 1, 7, 5, 3); jp = [1.3, 0.86, 0]; jr = 0.4; jpose = { breathe: jb, armR: t < 180.33 ? [3.0, -0.1, 0.1] : [0.1, 0.3, 0.3], armL: [0.1, 0.3, 0.3] }; jface = { open: t > 180.3 ? 0.06 : 1, mouth: 'smile', brow: 0.4 }; cA = 0.45;
      ov.score = t > 176.6 ? 2 : 1; ov.ex = 1;
      if (t < 180.33) { const a = lerp(-0.4, 0.3, sm((t - 176.36) / 4)); camPos = [1.3 + Math.sin(a) * 7, 1.3, Math.cos(a) * 7]; camLook = [1.8, 2.0, 0]; camera.fov = 50; }
      else { const a = lerp(0.6, -0.2, sm((t - 180.3) / 6.3)); camPos = [1.3 + Math.sin(a) * 6.2, 2.3, Math.cos(a) * 6.2]; camLook = [1.3, 1.9, 0]; camera.fov = 46; ov.lesson = ['LIÇÃO 2', 'QUEM TE PROVOCA QUER A SUA ENERGIA.<br><span style="color:#7df9ff">NÃO ENTREGUE.</span>', seg(t, 180.33, 180.6)]; }
    }
    if (mVis) bS(MG, mp, -PI2, ms, mpose);
    J.position.set(...jp); if (jRot) J.rotation.set(...jRot); else J.rotation.set(0, jr, 0); jo.pose({ breathe: jb, ...jpose }); jo.face(jface);
    if (rk > 0.01) aura(auJ, [J.position.x, J.position.y + 0.5, J.position.z], 2.3, rk, t, '#ff3b30'); auraJ(cA, t);
    ov.ex = ov.ex || 0.75;
  } else { // ================= LUTA 3: VORG =================
    arenaOn(t, 0.85); ov.score = 2;
    let jp = [-5, 0.86, 0], jr = PI2, jpose = { ...GUARD }, jface = { ...GUARDF }, jRot = null;
    let vp = [5, 0, 0], vr = -PI2, vpose = { a: [[0.4, 0.3, 1.3], [0.4, 0.3, 1.3]], breathe: 0.02 * Math.sin(t * 2) }, vRotX = 0, vLift = 0;
    let auraJk = 0.5, auraVk = 0.6;
    if (t < 192.78) { // anúncio e o camarote
      balc.visible = true; vp = [0, BY, -21]; vr = 0; const un = seg(t, 190.2, 190.8); vpose = un < 1 ? CROSS : { a: [[0.3, 0.5, 0.8], [0.3, 0.5, 0.8]] }; if (un >= 1) vpose = { a: allA(2, [0.2, lerp(0.5, 0.9, seg(t, 191, 191.4)), 0.6]), jaw: 0.4 };
      auraVk = 0.4 + 0.6 * seg(t, 191.0, 191.4); jp = [-3, 0.86, 2]; jr = Math.PI - 0.15; jface = { open: blink(t), mouth: 'flat', brow: -0.3, look: [0, 0.8] }; jpose = { ...GUARD, head: [-0.35, 0, 0] };
      if (t < 189.4) { hostAnim(t, aTalk); host.position.y = lerp(17, 9.5, seg(t, 186.7, 187.6)) + 0.25 * Math.sin(t * 1.3); fireworks(t, 187.0); camPos = [3, 1.2, 9]; camLook = [0, 8.5, -2]; camera.fov = 52; }
      else { camPos = [0.6, 9.4, -12.2]; camLook = [0, 13.0, -21]; camera.fov = 40; if (t > 191.0 && t < 191.5) shake = 0.05; }
      ov.ex = 1;
    } else if (t < 197.46) { // desce do céu
      const k = sm(lin(t, 192.9, 195.2)); vp = [lerp(0, 5, k), lerp(BY, 0, k) + 1.5 * Math.sin(k * Math.PI), lerp(-21, 0, k)]; vr = k < 1 ? facing([0, 0, -21], [5, 0, 0]) + lerp(0, -PI2 - facing([0, 0, -21], [5, 0, 0]), k) : -PI2;
      vpose = { a: allA(2, [0.2, 0.55, 0.5]), knee: [0.2, 0.2], leg: [0.1, -0.1] }; auraVk = 1;
      if (t > 195.2) { const l2 = seg(t, 195.2, 195.8); vpose = { a: allA(2, [0.3, 0.6, 0.8]), knee: [lerp(0.7, 0.15, l2), lerp(0.7, 0.15, l2)], leg: [lerp(0.5, 0, l2), lerp(0.5, 0, l2)], lean: lerp(0.3, 0, l2), jaw: 0.3 }; cracks(crk[0], [5, 0, 0], lin(t, 195.2, 195.5), 7, '#ff1f3d'); ringAt(0, [5, 0.1, 0], t - 195.2, 11, [PI2, 0, 0], 0.9, '#ff8a8a'); rockBurst([5, 0, 0], lin(t, 195.2, 196.6), 6, 5, 4); for (let i = 0; i < 16; i++) puff(i, [5 + Math.cos(i * 0.4) * (1 + 4 * lin(t, 195.2, 197)), 0.5, Math.sin(i * 0.4) * (1 + 4 * lin(t, 195.2, 197))], lin(t, 195.2, 197.4), 2, '#8a8290'); }
      if (t > 195.2 && t < 195.27) impact = true; if (t > 195.2 && t < 195.6) { flash = 0.5; shake = 0.16; }
      jface = { open: 1.1, mouth: 'flat', brow: -0.5, browTilt: 0.5, look: [0, 0.5] }; auraJk = 0.4;
      if (t < 195.2) { camPos = [-6.5, 1.2, 4.5]; camLook = [vp[0] * 0.8, Math.max(2.6, vp[1] + 2.2), vp[2] * 0.8]; camera.fov = 54; } else { camPos = [-1.0, 0.7, 4.6]; camLook = [5, 3.1, 0]; camera.fov = 52; roll = 0.06; }
      ov.fx = t > 195.2 && t < 196.2 ? ['DOOM!', seg(t, 195.2, 195.35), '#ff1f3d', 62, 30, 230] : null;
      ov.nc = t > 195.6 && t < 197.4 ? ['VORG', 'O CAMPEÃO', '#ff1f3d', seg(t, 195.6, 195.8)] : null;
    } else if (t < 200.95) { // "os meus guardas eram fracos. eu não sou."
      vpose = { a: allA(2, [0.4, 0.5, 1.2]), jaw: vTalk * 1.4, head: [0.15, 0, 0] }; auraVk = 0.9; cracks(crk[0], [5, 0, 0], 1, 7, '#ff1f3d');
      bS(VG, vp, vr, 1.05, vpose); scene.updateMatrixWorld(true); VG.head.getWorldPosition(v); camPos = [v.x - 2.5, v.y - 1.3, v.z + 0.9]; camLook = [v.x, v.y, v.z]; camera.fov = 40; roll = 0.06;
    } else if (t < 210.35) { // no chão, no ar e acima da arena
      auraJk = 0.8; auraVk = 0.9; cracks(crk[0], [5, 0, 0], 1, 7, '#ff1f3d');
      if (t < 202.6) { // investida: punhos se encontram
        const d = seg(t, 200.95, 201.6); jp = [lerp(-5, -0.95, d), 0.86 + 0.6 * Math.sin(d * Math.PI), 0]; vp = [lerp(5, 1.75, d), 0, 0]; jpose = { ...JPUNCH }; vpose = { a: [[1.5, -0.2, 0.05], [0.5, 0.3, 1.3]], lean: 0.35, leg: [0.6, -0.4] };
        if (t > 201.6) { const C = [0.25, 2.3, 0]; for (let i = 0; i < 4; i++) bolt(i, C, [C[0] + Math.cos(i * 1.7 + t * 9) * 2.4, C[1] + Math.sin(i * 2.3 + t * 7) * 1.6, Math.sin(i * 1.1 + t * 5) * 2.4], Math.floor(t * 15) + i, 0.9); ringAt(0, C, t - 201.6, 6, [0, PI2, 0], 0.7, '#fff3b0'); cracks(crk[1], [0.3, 0, 0], lin(t, 201.6, 201.9), 5, '#ffd60a'); }
        if (t > 201.6 && t < 201.67) impact = true; if (t > 201.67 && t < 201.95) { flash = 0.45 * (1 - lin(t, 201.67, 201.95)); shake = 0.2; }
        camPos = [0.2, 1.0, 9]; camLook = [0.2, 2.4, 0]; camera.fov = 55; ov.speed = d < 1 ? 0.6 : 0;
        ov.fx = t > 201.6 && t < 202.5 ? ['BOOM!', seg(t, 201.6, 201.72), '#fff3b0', 50, 30, 240] : null;
      } else if (t < 204.5) { // troca no chão com teleporte
        const tp = t > 202.85; vp = [1.75, 0, 0]; vr = -PI2;
        jp = tp ? [3.7, 0.86, 0.2] : [-0.95, 0.86, 0]; jr = tp ? -PI2 : PI2;
        if (t > 202.6 && t < 202.85) vpose = { a: [[lerp(0.5, 1.55, seg(t, 202.6, 202.8)), -0.2, 0.05], [0.5, 0.3, 1.3]], lean: 0.3 };
        if (tp) setGhost(jGhosts[0], [-0.95, 0.2, 0], 0.4 * (1 - lin(t, 202.85, 203.4)), '#ffd60a');
        const kick = hitK(t, 203.25, 0.12, 0.15, 0.25); if (tp && t < 203.8) { jpose = { armR: [0.9, 0.2, 1.8], armL: [0.9, 0.2, 1.8], leg: [1.6 * kick, -0.2], lean: -0.2 * kick }; vp = [1.75 - 0.7 * seg(t, 203.25, 203.5), 0, 0]; vpose = { a: [[0.4, 0.6, 0.6], [0.4, 0.6, 0.6]], lean: 0.4 * seg(t, 203.25, 203.4) }; }
        if (t > 203.8) { vr = facing(vp, jp); vpose = { a: [[lerp(0.5, 1.5, hitK(t, 203.85)), -0.2, 0.1], [0.5, 0.3, 1.3]], lean: 0.2 }; jpose = t < 204.1 ? JBLOCK : { armR: [lerp(0.9, 2.6, seg(t, 204.05, 204.2)), -0.1, 0.2], armL: [0.9, 0.2, 1.8], lean: -0.1 }; vLift = 1.2 * Math.sin(Math.PI * lin(t, 204.2, 204.5)); }
        [203.25, 203.85, 204.2].forEach(h => { if (t > h && t < h + 0.06) { impact = t < h + 0.04; flash = 0.3; shake = 0.12; } });
        const tH = t - 0.25 * (t > 203.25) - 0.2 * (t > 203.85); const a = (tH - 202.6) * 1.6; camPos = [1.4 + Math.sin(a) * 6.5, 2.4, Math.cos(a) * 6.5]; camLook = [1.4, 2.4, 0]; camera.fov = 52; roll = 0.06 * Math.sin(t * 2);
        ov.fx = t > 203.25 && t < 203.7 ? ['BAM!', seg(t, 203.25, 203.35), '#ffd60a', 35, 30, 200] : t > 203.85 && t < 204.15 ? ['CLANG!', 1, '#ff8a8a', 62, 28, 170] : t > 204.2 && t < 204.6 ? ['POW!', seg(t, 204.2, 204.3), '#ffd60a', 50, 25, 220] : null;
      } else if (t < 206.6) { // no ar
        const up = seg(t, 204.5, 205.0); jp = [-0.9, 0.86 + 7.2 * up, 0]; vp = [1.9, 6.3 * up, 0]; jpose = JFLY; vpose = { a: allA(2, [0.5, 0.3, 1.2]), leg: [0.3, -0.2] };
        const h1 = hitK(t, 205.3), h2 = hitK(t, 205.9), h3 = hitK(t, 206.3); if (h1) jpose = JPUNCH; if (h2) vpose = { a: [[1.5, -0.2, 0.05], [0.5, 0.3, 1.2]], lean: 0.3 }; if (h3) { jpose = JPUNCH; vpose = { a: [[1.5, -0.2, 0.05], [0.5, 0.3, 1.2]], lean: 0.3 }; }
        if (t > 205.3) vp[0] += 0.4 * seg(t, 205.3, 205.5) * (1 - seg(t, 205.6, 205.9)); if (t > 205.9) jp[0] -= 0.4 * seg(t, 205.9, 206.1) * (1 - seg(t, 206.1, 206.3));
        if (t > 206.3) { const C = [0.45, 8.6, 0]; bolt(0, [C[0] + 2, 30, -6], C, Math.floor(t * 12), 1, '#ffffff', 0.12); for (let i = 1; i < 4; i++) bolt(i, C, [C[0] + Math.cos(i * 2.1) * 3, C[1] + Math.sin(i * 1.3) * 2, Math.sin(i) * 3], Math.floor(t * 15) + i, 0.8); }
        [205.3, 205.9, 206.3].forEach(h => { if (t > h && t < h + 0.06) { impact = t < h + 0.04; flash = 0.6; shake = 0.12; } });
        camPos = [0.4, 8.6, 8.2]; camLook = [0.4, 8.0, 0]; camera.fov = 52; if (t < 205.0) { camPos = [0.4, 2.6, 9]; camLook = [0.4, 4 + 4 * up, 0]; }
        ov.fx = t > 205.3 && t < 205.7 ? ['POW!', seg(t, 205.3, 205.4), '#ffd60a', 58, 28, 210] : t > 205.9 && t < 206.3 ? ['BAM!', seg(t, 205.9, 206.0), '#ff8a8a', 40, 30, 210] : t > 206.3 && t < 206.6 ? ['KRA-KOOM!', seg(t, 206.3, 206.4), '#fff3b0', 50, 22, 220] : null;
      } else { // acima da arena
        const up = seg(t, 206.6, 207.0); jp = [-1.1, lerp(8.06, 20, up), 0]; vp = [1.9, lerp(6.3, 18.2, up), 0]; jpose = JFLY; vpose = { a: allA(2, [0.5, 0.3, 1.2]), leg: [0.3, -0.2] };
        const H2 = [207.3, 208.3, 209.3]; H2.forEach((h, i) => { const k = hitK(t, h); if (k) { if (i !== 1) vpose = { a: [[1.5, -0.2, 0.05], [1.5, -0.2, 0.05]], lean: 0.3 }; if (i !== 2) jpose = JPUNCH; } });
        if (t > 209.3) { vpose = { a: allA(2, [2.6, 0.2, 0.6]), lean: 0.5 }; const fl = lin(t, 209.4, 210.3); jp = [lerp(-1.1, -6, fl), lerp(20, 0.86, fl * fl), 0]; jRot = [fl * 5, PI2, 0]; vp = [lerp(1.9, 6, fl), lerp(18.2, 0, sm(fl)), 0]; trail.g.visible = false; }
        H2.forEach((h, i) => { if (t > h && t < h + 0.06) { impact = t < h + 0.04; flash = 0.7; shake = 0.14; } if (t > h && t < h + 0.35) { const C = [0.4, 20.3, 0]; bolt(0, [C[0] - 6 + 4 * i, 40, -10], C, Math.floor(t * 12) + i, 1, '#ffffff', 0.15); bolt(1, C, [C[0] + 5, C[1] - 3, 3], Math.floor(t * 15) + 3, 0.8); bolt(2, C, [C[0] - 4, C[1] + 2, -3], Math.floor(t * 15) + 5, 0.8); } });
        if (t > 210.3) { cracks(crk[1], [-6, 0, 0], 1, 4, '#ffd60a'); }
        if (t < 209.4) { camPos = [5.5, 24, 8.5]; camLook = [0.4, 19.6, 0]; camera.fov = 50; } else { camPos = [0, 6, 18]; camLook = [0, 6, 0]; camera.fov = 58; ov.speed = 0.5; }
        ov.fx = t > 207.3 && t < 207.8 ? ['KRA-KOOM!', seg(t, 207.3, 207.4), '#fff3b0', 50, 25, 220] : t > 208.3 && t < 208.7 ? ['POW!', seg(t, 208.3, 208.4), '#ffd60a', 45, 30, 210] : t > 209.3 && t < 209.8 ? ['BAM!', seg(t, 209.3, 209.4), '#ff8a8a', 55, 30, 230] : null;
      }
    } else if (t < 214.4) { // divisão: os dois carregam
      jp = [-6, 0.86, 0]; vp = [6, 0, 0]; jpose = JCHG; vpose = VCHG; auraJk = 0.9; auraVk = 1; cracks(crk[0], [6, 0, 0], 1, 7, '#ff1f3d'); cracks(crk[1], [-6, 0, 0], 1, 4, '#ffd60a');
      jface = { open: 0.5, mouth: 'flat', brow: -0.8, browTilt: 0.7 }; vpose.jaw = 0.3;
      J.position.set(...jp); J.rotation.set(0, PI2, 0); jo.pose({ breathe: jb, ...jpose }); bS(VG, vp, vr, 1.05, vpose);
      const ch = seg(t, 210.4, 214.0); setBall(ballJ, midW(jo.handR, jo.handL), 0.15 + 0.45 * ch, 1, t); setBall(ballV, midW(VG.arms[0].fist, VG.arms[1].fist), 0.2 + 0.6 * ch, 1, t);
      split = [[[-3.5, 1.6, 2.8], [-6, 1.6, 0]], [[3.4, 2.7, 3.2], [6, 3.1, 0]]]; ov.split = 1; ov.bars = [0.5, 0.5]; auraJk = 0.45;
    } else if (t < 243.0) { // choque de rajadas
      jp = [-6, 0.86, 0]; vp = [6, 0, 0]; cracks(crk[0], [6, 0, 0], 1, 7, '#ff1f3d'); cracks(crk[1], [-6, 0, 0], 1, 4, '#ffd60a');
      const push = seg(t, 219.4, 226.0), back3 = seg(t, 239.4, 242.4), cross = seg(t, 242.4, 243.0);
      let k = 0.5 - 0.37 * push + 0.42 * back3 + 0.05 * cross;
      const kneel = push * (1 - seg(t, 238.6, 239.6)); jpose = { ...JBEAM, leg: [0.5 + 0.5 * kneel, -0.4], lean: 0.12 + 0.3 * kneel }; jp[1] = 0.86 - 0.3 * kneel;
      jface = t < 237.2 ? { open: lerp(1, 0.45, push), mouth: 'o', brow: lerp(-0.8, 1.0, push), browTilt: 0.4 } : t < 238.6 ? { open: 0.05, mouth: 'flat', brow: 0 } : { open: 1.1, mouth: 'o', brow: -0.9, browTilt: 0.8 };
      vpose = { ...VBEAM, jaw: push > 0.3 && back3 < 0.2 ? 0.5 + 0.4 * Math.abs(Math.sin(t * 6)) : 0.3 };
      J.position.set(...jp); J.rotation.set(0, PI2, 0); jo.pose({ breathe: jb, ...jpose }); jo.face(jface); bS(VG, vp, vr, 1.05, vpose);
      const flick = t > 223 && t < 238.6 ? (Math.sin(t * 25) > 0.2 ? 1 : 0.25) : 1; braceMat.emissiveIntensity = 2.5 * flick + 4 * back3;
      const wJ = lerp(lerp(0.32, 0.17, push), 0.55, back3), grow = lin(t, 214.4, 215.0);
      const C = beamsClash(t, k, flick > 0.5 ? 1 : 0.7, 1, wJ, 0.38, grow);
      auraJk = t < 238.6 ? lerp(0.9, 0.25, push) * flick : 0.6 + 0.6 * seg(t, 239.2, 239.6); auraVk = 1;
      if (t > 215.0 && t < 215.07) impact = true; if (t > 215.0 && t < 215.4) { flash = 0.7; shake = 0.15; } else shake = 0.03;
      if (t > 239.3 && t < 239.37) impact = true; if (t > 239.3 && t < 239.7) { flash = 0.7; shake = 0.15; } ringAt(4, [J.position.x, 1.4, 0], t - 239.3, 6, [PI2, 0, 0], 0.8, '#ffd60a');
      ov.bars = [lerp(lerp(0.5, 0.15, push), 0.95, back3), lerp(lerp(0.5, 0.85, push), 0.35, back3)];
      if (t > 229.68 && t < 243) { crowdLights(t, lin(t, 229.8, 233.5)); }
      if (t > 226.91 && t < 229.68) { Z.visible = true; Z.position.set(-9, 0.53, 9); Z.rotation.y = facing([-9, 0, 9], [-6, 0, 0]); zb.pose({ scl: [0.62, 0.62, 0.62], armL: [2.6 + 0.3 * Math.sin(t * 8), 0.3, 0.2], armR: [1.2, -0.6, 1.8] }); zb.face({ open: 1.2, mouth: 'o', talk: zTalk, brow: 1 }); }
      if (t < 215.6) { camPos = [0, 1.0, 12.5]; camLook = [0, 2.4, 0]; camera.fov = 55; }
      else if (t < 219.19) { const a = lerp(-0.3, 0.35, (t - 215.6) / 3.6); camPos = [Math.sin(a) * 10, 2.0, Math.cos(a) * 10]; camLook = [C[0], 2.4, 0]; camera.fov = 52; }
      else if (t < 222.5) { camPos = [9.6, 6.6, 4.6]; camLook = [-4, 1.4, 0]; camera.fov = 50; }
      else if (t < 226.91) { camPos = [-3.9, 1.5, 1.7]; camLook = [-6, 1.6, 0]; camera.fov = 42; roll = -0.08; }
      else if (t < 229.68) { camPos = [-7.0, 1.3, 11.2]; camLook = [-9, 1.0, 9]; camera.fov = 40; }
      else if (t < 233.5) { const a = lerp(2.3, 0.8, sm((t - 229.68) / 3.8)); camPos = [0, 6.5, 0]; camLook = [Math.cos(a) * 20, 7.5, -Math.sin(a) * 20]; camera.fov = 56; }
      else if (t < 237.16) { camPos = [-3.7, 1.55, 1.9]; camLook = [-6, 1.7, 0]; camera.fov = 44; }
      else if (t < 239.3) { camPos = [-3.5, 1.6, 2.3]; camLook = [-6, 1.55, 0]; camera.fov = 42; }
      else { camPos = [0, 1.2, 12.5]; camLook = [C[0], 2.4, 0]; camera.fov = 55; }
      ov.fx = t > 239.3 && t < 240.0 ? ['VRUUUM!', seg(t, 239.3, 239.45), '#ffd60a', 30, 25, 190] : null;
    } else if (t < 246.24) { // as rajadas explodem / ele sobe
      cracks(crk[0], [6, 0, 0], 1, 7, '#ff1f3d'); cracks(crk[1], [-6, 0, 0], 1, 4, '#ffd60a');
      vpose = { a: allA(2, [0.6, 0.6, 0.6]), lean: -0.3 * seg(t, 243.0, 243.4), head: [-0.4 * seg(t, 244.0, 245.0), 0, 0] }; vp = [6.6, 0, 0]; auraVk = 0.8;
      const C = [0.8, 2.4, 0]; setDome(C, lin(t, 243.0, 244.6), 9); boomLight.position.set(...C); boomLight.intensity = 50 * (1 - lin(t, 243, 244.6));
      if (t > 243.0 && t < 243.07) impact = true; if (t > 243.07 && t < 243.6) { flash = 0.7 * (1 - lin(t, 243.07, 243.6)); shake = 0.22; }
      const up = Math.pow(lin(t, 244.0, 247.6), 1.6); jp = [-6, 0.86 + 40 * up, 0]; jpose = up > 0 ? { armR: [3.0, -0.1, 0.1], armL: [3.0, -0.1, 0.1], leg: [0.1, -0.1] } : GUARD; jRot = [0, PI2, 0]; auraJk = 1;
      if (up > 0) setRay(trail, [-6, 0.9, 0], [-6, jp[1], 0], 0.25, 0.7, t);
      jface = { open: 1.1, mouth: 'flat', brow: -0.8, browTilt: 0.7, look: [0, 0.8] };
      if (t < 244.0) { camPos = [0, 1.6, 13]; camLook = [0, 2.4, 0]; camera.fov = 56; } else { camPos = [-4.2, 0.5, 3.6]; camLook = [-6, 2 + jp[1] * 0.8, 0]; camera.fov = 58; ov.speed = 0.5; }
    } else if (t < 250.96) { // sobe até as estrelas... desce como um cometa
      cracks(crk[0], [6, 0, 0], 1, 7, '#ff1f3d'); vp = [6, 0, 0]; auraVk = 1;
      if (t < 248.0) { const up = Math.pow(lin(t, 244.0, 247.6), 1.6); jp = [-6 + 1.5 * seg(t, 246.5, 247.8), 0.86 + 40 * up, 0]; jpose = { armR: [3.0, -0.1, 0.1], armL: [3.0, -0.1, 0.1] }; auraJk = 1; vpose = { a: allA(2, [0.6, 0.6, 0.6]), head: [-0.6, 0, 0] };
        setBall(comet, [jp[0], jp[1] + 0.6, 0], 1.2 + 0.2 * Math.sin(t * 30), 0.6, t);
        camPos = [3.5, 30.0, 11]; camLook = [jp[0], jp[1], 0]; camera.fov = 52; skyMat.color.setScalar(0.7);
      } else if (t < 249.65) {
        const k = Math.pow(lin(t, 248.0, 249.65), 1.8); const top = [-4.5, 41, 0], tgt = [6, 3.0, 0]; const p = mix3(top, tgt, k);
        jp = [p[0], p[1] - 0.6, p[2]]; jpose = { armR: [3.0, -0.1, 0.1], armL: [3.0, -0.1, 0.1] }; jRot = [Math.PI, PI2, 0]; auraJk = 1;
        setBall(comet, p, 1.5 + 0.2 * Math.sin(t * 30), 1, t); setRay(trail, mix3(top, tgt, Math.max(0, k - 0.35)), p, 1.0, 1, t);
        vpose = { a: allA(2, [2.9, -0.2, 0.1]), head: [-0.7, 0, 0], jaw: 0.7 }; bS(VG, vp, vr, 1.05, vpose);
        if (t > 248.55) { const vh = midW(VG.arms[0].fist, VG.arms[1].fist); setRay(rayV, vh, [p[0] * 0.3 + vh[0] * 0.7, Math.max(vh[1], p[1] - 1.5), 0], 0.35, 1 - seg(t, 249.3, 249.6), t); }
        goldLight.position.set(...p); goldLight.intensity = 40;
        if (t < 249.0) { camPos = [9.5, 0.9, 4.2]; camLook = [p[0], p[1], 0]; camera.fov = 58; roll = 0.1; } else { camPos = [0.5, 8.5, 13.5]; camLook = [(p[0] + 6) / 2, (p[1] + 3) / 2, 0]; camera.fov = 60; ov.speed = 0.8; }
      } else { // impacto + silêncio
        jp = [5.2, 0.86, 1.4]; jpose = { armR: [0.3, 0.3, 0.5], armL: [0.3, 0.3, 0.5], leg: [0.6, -0.3], lean: 0.3 }; auraJk = 0.6; auraVk = 0;
        vpose = { a: allA(2, [2.4, 0.9, 0.2]), jaw: 0.6 }; vRotX = -Math.PI / 2; vLift = 0.5; VG.eyeM.emissiveIntensity = 0.3;
        cracks(crk[2], [6, 0, 0], lin(t, 249.65, 249.95), 12, '#ffd60a');
        setDome([6, 1, 0], lin(t, 249.65, 251.2), 16); boomLight.position.set(6, 4, 2); boomLight.intensity = 80 * (1 - lin(t, 249.65, 251.2));
        ringAt(0, [6, 0.2, 0], t - 249.65, 18, [PI2, 0, 0], 1.2, '#fff3b0'); ringAt(1, [6, 3, 0], t - 249.7, 14, [0, 0, 0], 1.2, '#ffd60a'); rockBurst([6, 0, 0], lin(t, 249.65, 251.2), 9, 9, 13);
        for (let i = 0; i < 20; i++) puff(i, [6 + Math.cos(i * 0.31) * (1 + 7 * lin(t, 249.7, 251.4)), 0.6 + 2 * hash(i), Math.sin(i * 0.31) * (1 + 7 * lin(t, 249.7, 251.4))], lin(t, 249.7, 251.4), 3, '#b9b3ae');
        if (t < 249.72) impact = true; flash = t < 250.2 ? 1 - lin(t, 249.72, 250.2) * 0.6 : 0.4 * (1 - lin(t, 250.2, 250.9)); shake = 0.3 * (1 - lin(t, 249.65, 250.4));
        camPos = [-4, 2.6, 13]; camLook = [5, 2.2, 0]; camera.fov = 56; ov.slow = true;
        ov.fx = t > 249.65 && t < 250.6 ? ['KA-BOOOM!', seg(t, 249.65, 249.8), '#ffd60a', 55, 38, 260] : null;
      }
    } else if (t < 265.01) { // a Terra vence + lição 3
      cracks(crk[2], [6, 0, 0], 1, 12, '#3a2a30'); vpose = { a: allA(2, [2.4, 0.9, 0.2]), jaw: 0.5 }; vRotX = -Math.PI / 2; vLift = 0.5; VG.eyeM.emissiveIntensity = 0.4; auraVk = 0;
      jp = [2.6, 0.86, 1.6]; jr = facing(jp, [6, 0, 0]) - 0.5; jpose = t < 257.25 ? { breathe: jb, armR: [3.0, -0.1, 0.1], armL: [0.2, 0.4, 0.4] } : { breathe: jb, armR: [0.1, 0.3, 0.3], armL: [0.1, 0.3, 0.3] }; jface = { open: t > 257.2 ? 0.06 : 1, mouth: 'smile', brow: 0.5 }; auraJk = 0.5;
      ov.score = 3; ov.ex = 1; fireworks(t, 251.3); confetti.forEach((m, i) => { const ph = ((t - 251.0) * 0.25 + hash(i)) % 1; m.visible = true; m.position.set((hash(i + 1) - 0.5) * 16, 14 - ph * 14, (hash(i + 2) - 0.5) * 12); m.rotation.set(t * 3 + i, t * 2 + i, 0); });
      crowdLights(t, 1);
      if (t < 257.25) { const a = lerp(-0.6, 0.2, sm((t - 250.96) / 6.3)); camPos = [3.5 + Math.sin(a) * 9, 1.4, Math.cos(a) * 9]; camLook = [4.2, 1.8, 0.6]; camera.fov = 50; ov.champ = seg(t, 251.3, 251.6); for (let i = 0; i < 10; i++) puff(i, [6 + Math.cos(i) * 5, 0.8, Math.sin(i) * 5], 0.4 + 0.6 * lin(t, 250.96, 254), 4, '#b9b3ae'); }
      else { const a = lerp(0.6, -0.2, sm((t - 257.25) / 7.8)); camPos = [2.6 + Math.sin(a) * 6.2, 2.3, 1.6 + Math.cos(a) * 6.2]; camLook = [2.6, 1.9, 1.6]; camera.fov = 46; ov.lesson = ['LIÇÃO 3', 'QUEM DESISTE PERDE.<br><span style="color:#ffd60a">QUEM CONTINUA FICA MAIS FORTE.</span>', seg(t, 257.25, 257.5)]; }
    } else { // a mão estendida / rival / CTA
      cracks(crk[2], [6, 0, 0], 1, 12, '#3a2a30'); auraVk = t > 271.4 && t < 276.6 ? 0.35 : 0; auraJk = t > 276.6 && t < 278.8 ? 0.3 : 0.25;
      const sit = seg(t, 265.3, 266.6), stand = seg(t, 268.6, 270.6), grab = seg(t, 267.3, 267.9);
      vRotX = lerp(-Math.PI / 2, 0, stand); vLift = 0.5 * (1 - stand);
      vpose = { a: [[lerp(lerp(2.4, 1.0, sit), 1.3, stand), -0.1, 0.2], [lerp(2.4, 0.3, sit), 0.5, 0.6]], jaw: vTalk * 1.2, head: [lerp(-0.5 * sit, 0.1, stand), 0, 0] };
      jp = [3.3, 0.86, 0.2]; jr = PI2; jpose = { breathe: jb, armR: [lerp(0.1, 0.9 + 0.5 * stand, grab), -0.1, 0.2], armL: [0.1, 0.3, 0.3], lean: 0.25 * grab * (1 - stand) }; jface = { open: blink(t), mouth: t > 276.6 && t < 277.8 ? 'smile' : (jTalk > 0 ? 'flat' : 'smile'), talk: jTalk, brow: t > 276.6 ? -0.4 : 0.3, browTilt: t > 276.6 ? 0.4 : 0 };
      vp = [6.3, 0, 0];
      if (t < 271.45) { camPos = [4.8, 2.0, 7.0]; camLook = [4.8, 1.9, 0.2]; camera.fov = 46; }
      else if (t < 276.61) { bS(VG, vp, vr, 1.05, vpose); VG.body.rotation.x = vRotX; VG.body.position.y = vLift; scene.updateMatrixWorld(true); VG.head.getWorldPosition(v); camPos = [v.x - 2.6, v.y - 0.5, v.z + 1.6]; camLook = [v.x, v.y, v.z]; camera.fov = 40; }
      else if (t < 278.77) { camPos = [4.9, 1.95, 1.4]; camLook = [3.3, 1.95, 0.2]; camera.fov = 38; }
      else { const a = lerp(-0.4, 0.4, sm((t - 278.77) / 16)); camPos = [4.8 + Math.sin(a) * 11, 2.2, Math.cos(a) * 11]; camLook = [4.8, 2.4, 0]; camera.fov = 52; ov.cta = seg(t, 278.9, 279.2); ov.follow = seg(t, 284.5, 284.8); fireworks(t, 279.0 + Math.floor((t - 279) / 3) * 3); crowdLights(t, 1); ov.ex = 1; }
      ov.score = 3;
    }
    if (!split) {
      J.position.set(...jp); if (jRot) J.rotation.set(...jRot); else J.rotation.set(0, jr, 0); jo.pose({ breathe: jb, ...jpose }); jo.face(jface);
      if (!(t >= 214.4 && t < 243.0)) { bS(VG, [vp[0], vp[1] + 0, vp[2]], vr, 1.05, vpose); VG.body.rotation.x = vRotX; VG.body.position.y = vLift; }
    }
    auraGold(auraJk, t); auraB(VG, auraVk, t);
    ov.ex = ov.ex || 0.85;
  }

  magMat.emissiveIntensity *= 0.3; MG.arms.forEach(A => { A.fm.emissiveIntensity = magMat.emissiveIntensity; A.fm.color.copy(magMat.color); }); lavaLight.intensity *= 0.12; motes.forEach(m => m.material.color.set('#7df9ff'));
  // ---------- câmera e desenho ----------
  if (split) { renderSplit(split[0], split[1], 44); }
  else { camera.updateProjectionMatrix(); cam(camPos, camLook, shake, t); if (roll) camera.rotateZ(roll); sky.position.copy(camera.position); renderer.render(scene, camera); }
  if (!(t >= 246.24 && t < 248.0)) skyMat.color.setScalar(1);

  // ---------- overlays ----------
  $('root').style.filter = impact ? 'invert(1) grayscale(1) contrast(6)' : ov.blue ? 'saturate(0.45) brightness(0.92) contrast(1.2)' : ov.slow ? 'saturate(0.65) contrast(1.15)' : '';
  $('burst').style.opacity = impact ? 1 : 0; $('flash').style.opacity = clamp(flash);
  $('lb').style.opacity = (ov.slow || ov.blue) ? 1 : 0; $('rage').style.opacity = ov.rage || 0; $('split').style.opacity = ov.split ? 1 : 0;
  $('speed').style.opacity = ov.speed || 0; $('speed').style.transform = `rotate(${(Math.floor(t * 30) % 7) * 3}deg) scale(1.4)`;
  const pop = (id, k, base = 'translateX(-50%)') => { const e = $(id); e.style.opacity = k ? 1 : 0; e.style.transform = `${base} scale(${0.5 + 0.5 * back(k || 0)})`; };
  pop('title', ov.title || 0); pop('cta', ov.cta || 0); pop('follow', ov.follow || 0); pop('champ', ov.champ || 0);
  const nc = $('nc'); if (ov.nc) { nc.style.opacity = 1; $('ncn').textContent = ov.nc[0]; $('ncs').textContent = ov.nc[1]; nc.style.borderColor = ov.nc[2]; $('ncn').style.color = ov.nc[2]; nc.style.transform = `translateX(${(1 - back(ov.nc[3])) * -300}px)`; } else nc.style.opacity = 0;
  const ls = $('lesson'); if (ov.lesson) { ls.style.opacity = 1; $('lsn').textContent = ov.lesson[0]; $('lst').innerHTML = ov.lesson[1]; ls.style.transform = `translate(-50%,-50%) scale(${0.6 + 0.4 * back(ov.lesson[2])})`; } else ls.style.opacity = 0;
  const scb = $('score'); scb.style.opacity = ov.score !== undefined && !ov.lesson && !ov.cta && !ov.bars && !ov.champ ? 1 : 0; $('sc').textContent = '★'.repeat(ov.score || 0) + '☆'.repeat(3 - (ov.score || 0));
  const bars = $('bars'); bars.style.opacity = ov.bars ? 1 : 0; if (ov.bars) { $('bj').style.width = (ov.bars[0] * 100) + '%'; $('bv').style.width = (ov.bars[1] * 100) + '%'; }
  const fx = $('fx'); if (ov.fx) { const [txt, k, col, x, y, size] = ov.fx; fx.style.opacity = 1; fx.textContent = txt; fx.style.left = x + '%'; fx.style.top = y + '%'; fx.style.fontSize = size + 'px'; fx.style.color = col; fx.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${0.4 + 0.8 * back(k)})`; } else fx.style.opacity = 0;
  const c = caps.find(c => t >= c.a - 0.05 && t < c.b + 0.25);
  const cp = $('cap'); cp.textContent = c ? c.s : ''; cp.style.opacity = c && !ov.lesson ? 1 : 0; cp.style.color = c ? WHOCOL[c.who] : '#fff';
};
