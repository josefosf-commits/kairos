// ===== TESTE DE CABEÇA: 3 versões do Joseph no corpo do Mixamo =====
import { makeFighter, clipOf, ROUPA_JOSEPH } from '../../_lib/mixamo.js';
import aIdle from '../../_lib/mixamo/Bouncing_Fight_Idle.fbx';
const fx = makeFX(renderer, scene, camera, W, H);
const CI = clipOf(aIdle);
// deixa a cabeça do makeChar mais bonita: queixo, olhos menores, cabelo com volume, sobrancelha mais grossa
function refine(c, o = {}) {
  const h = c.head, skin = c.mats.skin, hair = c.mats.hair;
  const skull = h.children[0]; skull.scale.set(0.93, 1.03, 0.97);
  const jaw = mesh(sph(0.3, 28, 18), skin, h, [0, -0.2, 0.07], [0, 0, 0], [1.08, 0.78, 0.95]);
  c.eyes.forEach((e, i) => { e.scale.multiplyScalar(o.eye ?? 0.82); e.position.y = 0.05; e.position.x = (i ? 1 : -1) * 0.145; });
  c.pupils.forEach(p => p.material = M('#3b2314', { roughness: 0.2 }));
  c.brows.forEach(b => { b.scale.set(1.25, 1.5, 1); });
  h.children.forEach(m => { if (m.isMesh && m.geometry.parameters && m.geometry.parameters.radius === 0.06) { m.scale.set(0.95, 1.25, 1.2); m.position.set(0, -0.05, 0.4); } });
  // cabelo cacheado: muitos cachinhos sobre a calota, lados mais baixos (degradê)
  const curlM = M('#1c140f', { roughness: 0.95 }), curlM2 = M('#2a1d15', { roughness: 0.9 });
  for (let i = 0; i < 190; i++) {
    const u = hash(i * 1.7), w = hash(i * 3.3 + 1); const th = u * Math.PI * 2, ph = Math.acos(1 - w * 1.05);
    let x = Math.sin(ph) * Math.cos(th), y = Math.cos(ph), z = Math.sin(ph) * Math.sin(th);
    if (z > 0.55 && y < 0.62) continue; if (y < 0.12) continue; if (Math.abs(x) > 0.82) continue;               // não cobre a testa
    const side = Math.abs(x) > 0.75 && y < 0.45; const R = side ? 0.42 : 0.44 + 0.04 * hash(i * 9.1);
    mesh(sph(side ? 0.045 : 0.065 + 0.018 * hash(i * 5.5), 8, 6), i % 3 ? curlM : curlM2, h, [x * R, y * R + 0.04, z * R - 0.02]);
  }
  [c.mSmile, c.mO, c.mFlat, c.mSad].forEach(m => { m.position.y += 0.06; m.position.z += 0.02; m.scale.multiplyScalar(0.85); });
}
const fighters = [];
const mk = (variant, x) => {
  const c = makeChar(); c.root.visible = false;
  const gl = M('#1b1b1b', { roughness: 0.3 }); const g = grp(c.head); for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), gl, g, [s * 0.15, 0.06, 0.42]); mesh(cap(0.012, 0.08), gl, g, [0, 0.07, 0.44], [0, 0, Math.PI / 2]);
  if (variant > 0) { refine(c); g.position.set(0, 0.0, -0.01); g.scale.set(0.95, 0.95, 1); }
  const F = makeFighter(scene, aIdle, { scale: 0.0135, paint: variant > 0 ? ROUPA_JOSEPH : null, body: '#4f5d40', joints: '#2b3140' });
  if (variant > 0) {
    const hood = new THREE.Group(); const hm = M('#45523a', { roughness: 0.85 });
    mesh(new THREE.TorusGeometry(0.17, 0.075, 12, 24, Math.PI * 1.3), hm, hood, [0, 0, 0], [Math.PI / 2 - 0.3, 0, Math.PI * 0.85]);
    mesh(sph(0.16, 16, 12), hm, hood, [0, 0.02, -0.12], [0, 0, 0], [1.1, 0.8, 0.7]);
    F.attach('Spine2', hood, [0, 18, -7]);
    const front = new THREE.Group(); mesh(rbox(0.34, 0.13, 0.03, 0.02), M('#45523a', { roughness: 0.85 }), front, [0, 0, 0]);
    F.attach('Spine', front, [0, 4, 12]);
    const cords = new THREE.Group(); for (const x of [-0.05, 0.05]) { mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6), M('#ecebe4'), cords, [x, -0.08, 0]); mesh(sph(0.015, 8, 6), M('#ecebe4'), cords, [x, -0.16, 0]); }
    F.attach('Spine2', cords, [0, 14, 12]);
  }
  F.attachHead(c.head, [0, 9, 3]); F.root.position.set(x, 0, 0);
  fighters.push({ F, c, s: [1.25, 0.72, 0.85][variant], ry: fighters.length ? -0.7 : 0.15 });
};
mk(2, -0.9); mk(2, 0.9);
window.render = function (t) {
  TL = TL || window.TL; if (!caps) buildCaps();
  setStreet(true, 0); cable.visible = false; winMats.forEach(({ m }) => m.emissiveIntensity = 0.02); lampMats.forEach(m => m.emissiveIntensity = 0); lampLights.forEach(l => l.intensity = 0);
  J.visible = false; robot.visible = false; jo.head.visible = false; rhead.visible = false; J2b.visible = false; mom.root.visible = false; car.visible = false; pole.visible = false; crater.visible = false;
  [...sparks, ...rocks, ...smoke, ...motes, ...rmotes, ...streamP, ...ball, ...jOrb, ...rOrb, ghost, trail, aura, auraIn, raura, rauraIn, ...dizzy].forEach(o => o.visible = false); hideBig(gBeam); hideBig(rBeam); hideArcs(); fireballs.forEach(f => { f.o.visible = f.c.visible = false; }); rings.forEach(r => r.visible = false); eyeBeams.forEach(b => { b.core.visible = b.glow.visible = false; });
  thumbKey2.position.set(0, 3, 4); thumbKey2.intensity = 8;
  fighters.forEach(({ F, c, s, ry }) => { c.head.scale.setScalar(s); c.mats.skin.emissiveIntensity = 0; F.root.rotation.y = ry; F.pose(CI, 0.6); F.syncHeads(); c.face({ open: 1, mouth: 'smile', brow: 0.2, look: [0, 0] }); });
  camera.fov = 40; camera.aspect = W / H; camera.updateProjectionMatrix(); cam([0, 1.7, 6.0], [0, 1.55, 0], 0, 0); sky.position.copy(camera.position);
  fx.set({ bloom: 0.3, threshold: 0.9, vig: 0.3, grain: 0.02 }); fx.render();
  ['fx', 'tag', 'cap', 'flash', 'burst', 'lb', 'speed'].forEach(id => { const e = $(id); if (e) e.style.opacity = 0; });
};
