// Personagens com animações do Mixamo (golpes de luta captados de pessoas reais).
// Os .fbx ficam em videos/_lib/mixamo/ e entram no pacote do episódio (esbuild --loader:.fbx=binary):
//   import ybot from '../../_lib/mixamo/Bouncing_Fight_Idle.fbx';   // traz o corpo (With Skin)
//   import punch from '../../_lib/mixamo/Combo_Punch.fbx';
//   const F = makeFighter(scene, ybot, { body: '#4f5d40', joints: '#2b3140', scale: 0.013 });
//   const C = { punch: clipOf(punch) };
//   F.pose(C.punch, tempo)            // ou F.pose(clipA, tA, clipB, tB, peso) para misturar dois golpes
//   F.attachHead(grupoDaCabeça, [0, 12, 3])   // a cabeça do Joseph ou do robô segue o osso da cabeça
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const loader = new FBXLoader();
const ab = u8 => u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
export const parseFBX = u8 => loader.parse(ab(u8), '');

// clipe da animação; inPlace tira o andar para os lados (a posição fica por conta da cena)
export function clipOf(u8, inPlace = true) {
  const o = parseFBX(u8);
  const c = o.animations.reduce((a, b) => (b.tracks.length > a.tracks.length ? b : a));
  if (inPlace) c.tracks.forEach(t => {
    if (/Hips\.position$/.test(t.name)) { const v = t.values, x0 = v[0], z0 = v[2]; for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; } }
  });
  return c;
}

// pinta o corpo por região (osso dominante de cada vértice): paint = nome do osso -> cor
export const ROUPA_JOSEPH = n => /Hand|Thumb|Index|Middle|Ring|Pinky/.test(n) ? '#a86f4a' : /Neck|Head/.test(n) ? '#a86f4a' : /Foot|Toe/.test(n) ? '#f1f1f1' : /UpLeg|Leg|Hips/.test(n) ? '#2b3a55' : '#4f5d40';
function paintBy(mesh, fn) {
  const g = mesh.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight; if (!si) return;
  const names = mesh.skeleton.bones.map(b => b.name.replace(/^mixamorig:?/, '')); const col = new Float32Array(si.count * 3); const c = new THREE.Color(); const cache = {};
  for (let i = 0; i < si.count; i++) { let best = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; best = si.getComponent(i, k); } } const n = names[best]; const hex = cache[n] || (cache[n] = fn(n)); c.set(hex); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
}
export function makeFighter(scene, u8, { body = '#4f5d40', joints = '#2b3140', metal = false, scale = 0.013, paint = null } = {}) {
  const model = parseFBX(u8);
  model.scale.setScalar(scale);
  const mats = {
    body: new THREE.MeshStandardMaterial({ color: body, roughness: metal ? 0.32 : 0.75, metalness: metal ? 0.65 : 0 }),
    joints: new THREE.MeshStandardMaterial({ color: joints, roughness: metal ? 0.4 : 0.8, metalness: metal ? 0.5 : 0 }),
  };
  if (paint) { mats.body = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78 }); mats.joints = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, color: '#cfcfcf' }); }
  model.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; n.frustumCulled = false; if (paint) paintBy(n, paint); n.material = /Joint/i.test(n.name) ? mats.joints : mats.body; } });
  const root = new THREE.Group(); root.add(model); scene.add(root);
  const mixer = new THREE.AnimationMixer(model);
  const bones = {}; model.traverse(n => { if (n.isBone) bones[n.name.replace(/^mixamorig:?/, '')] = n; });
  const heads = [];
  const v = new THREE.Vector3(), q = new THREE.Quaternion();
  const F = {
    root, model, mixer, bones, mats,
    pose(a, ta, b, tb, w = 0) {
      mixer.stopAllAction();
      const set = (clip, t, weight) => { const act = mixer.clipAction(clip); act.reset(); act.play(); act.setEffectiveWeight(weight); act.time = Math.max(0, Math.min(clip.duration - 1e-4, t)); };
      set(a, ta, b ? 1 - w : 1); if (b) set(b, tb, w);
      mixer.update(0);
      F.syncHeads();
    },
    attachHead(g, off = [0, 12, 3], bone = 'Head') { scene.attach(g); root.updateMatrixWorld(true); const qb = new THREE.Quaternion(); bones[bone].getWorldQuaternion(qb); root.getWorldQuaternion(q); heads.push({ g, bone, off: new THREE.Vector3(...off), corr: qb.invert().multiply(q) }); },
    attach(bone, g, off = [0, 0, 0]) { F.attachHead(g, off, bone); },
    syncHeads() {
      root.updateMatrixWorld(true);
      for (const h of heads) { const hb = bones[h.bone]; v.copy(h.off); hb.localToWorld(v); hb.getWorldQuaternion(q); h.g.position.copy(v); h.g.quaternion.copy(q).multiply(h.corr); h.g.visible = root.visible; }
    },
    world(name, off = [0, 0, 0]) { root.updateMatrixWorld(true); v.set(...off); bones[name].localToWorld(v); return v.clone(); },
  };
  return F;
}
