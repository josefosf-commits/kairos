// Joseph versão 2 (temporada 2): corpo do Mixamo pintado (moletom verde-oliva, jeans, tênis, mãos de pele),
// cabeça de desenho refinada (queixo, olhos castanhos, sobrancelhas grossas, cabelo cacheado, óculos),
// capuz, bolso e cordinhas. Também: a mãe no corpo do Mixamo (blusa rosa) e o robô de metal.
//   const JO = makeJoseph(ybot);  JO.F.pose(clip, t);  JO.c.face({...});  JO.setHead(0.85)
import * as THREE from 'three';
import { scene, makeChar, M, mesh, sph, rbox, grp, cap } from './mundo3d.js';
import { makeFighter, ROUPA_JOSEPH } from './mixamo.js';

const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

export function refineHead(c) {
  const h = c.head, skin = c.mats.skin, hair = c.mats.hair;
  h.children[0].scale.set(0.93, 1.03, 0.97);
  mesh(sph(0.3, 28, 18), skin, h, [0, -0.2, 0.07], [0, 0, 0], [1.08, 0.78, 0.95]);
  c.eyes.forEach((e, i) => { e.scale.multiplyScalar(0.82); e.position.y = 0.05; e.position.x = (i ? 1 : -1) * 0.145; });
  c.pupils.forEach(p => p.material = M('#3b2314', { roughness: 0.2 }));
  c.brows.forEach(b => b.scale.set(1.25, 1.5, 1));
  h.children.forEach(m => { if (m.isMesh && m.geometry.parameters && m.geometry.parameters.radius === 0.06) { m.scale.set(0.95, 1.25, 1.2); m.position.set(0, -0.05, 0.4); } });
  const curlM = M('#1c140f', { roughness: 0.95 }), curlM2 = M('#2a1d15', { roughness: 0.9 });
  for (let i = 0; i < 190; i++) {
    const u = hash(i * 1.7), w = hash(i * 3.3 + 1); const th = u * Math.PI * 2, ph = Math.acos(1 - w * 1.05);
    const x = Math.sin(ph) * Math.cos(th), y = Math.cos(ph), z = Math.sin(ph) * Math.sin(th);
    if (z > 0.55 && y < 0.62) continue; if (y < 0.12) continue; if (Math.abs(x) > 0.82) continue;
    const side = Math.abs(x) > 0.75 && y < 0.45; const R = side ? 0.42 : 0.44 + 0.04 * hash(i * 9.1);
    mesh(sph(side ? 0.045 : 0.065 + 0.018 * hash(i * 5.5), 8, 6), i % 3 ? curlM : curlM2, h, [x * R, y * R + 0.04, z * R - 0.02]);
  }
  [c.mSmile, c.mO, c.mFlat, c.mSad].forEach(m => { m.position.y += 0.06; m.position.z += 0.02; m.scale.multiplyScalar(0.85); });
  const gl = M('#1b1b1b', { roughness: 0.3 }); const g = grp(h); for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), gl, g, [s * 0.15, 0.06, 0.42]); mesh(cap(0.012, 0.08), gl, g, [0, 0.07, 0.44], [0, 0, Math.PI / 2]);
  g.position.set(0, 0, -0.01); g.scale.set(0.95, 0.95, 1); c.glasses = g;
}

export function makeJoseph(ybot, scale = 0.0135) {
  const c = makeChar(); c.root.visible = false; refineHead(c);
  const F = makeFighter(scene, ybot, { scale, paint: ROUPA_JOSEPH });
  F.attachHead(c.head, [0, 9, 3]);
  const hm = M('#45523a', { roughness: 0.85 });
  const hood = new THREE.Group(); mesh(new THREE.TorusGeometry(0.17, 0.075, 12, 24, Math.PI * 1.3), hm, hood, [0, 0, 0], [Math.PI / 2 - 0.3, 0, Math.PI * 0.85]); mesh(sph(0.16, 16, 12), hm, hood, [0, 0.02, -0.12], [0, 0, 0], [1.1, 0.8, 0.7]); F.attach('Spine2', hood, [0, 18, -7]);
  const front = new THREE.Group(); mesh(rbox(0.34, 0.13, 0.03, 0.02), hm, front, [0, 0, 0]); F.attach('Spine', front, [0, 4, 12]);
  const cords = new THREE.Group(); for (const x of [-0.05, 0.05]) { mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6), M('#ecebe4'), cords, [x, -0.08, 0]); mesh(sph(0.015, 8, 6), M('#ecebe4'), cords, [x, -0.16, 0]); } F.attach('Spine2', cords, [0, 14, 12]);
  const JO = { F, c, head: c.head, setHead(s) { c.head.scale.setScalar(s); } };
  JO.setHead(0.85);
  return JO;
}

export const ROUPA_MAE = n => /Hand|Thumb|Index|Middle|Ring|Pinky|Neck|Head/.test(n) ? '#a86f4a' : /Foot|Toe/.test(n) ? '#b5446e' : /UpLeg|Leg|Hips/.test(n) ? '#3d3d5c' : '#b5446e';
// a mãe: corpo do Mixamo com blusa rosa e a cabeça (com cabelo) de um makeChar já pronto
export function makeMom(ybot, momChar, scale = 0.0128) {
  const F = makeFighter(scene, ybot, { scale, paint: ROUPA_MAE });
  F.attachHead(momChar.head, [0, 9, 2]);
  momChar.head.scale.setScalar(0.85);
  return { F, c: momChar };
}
