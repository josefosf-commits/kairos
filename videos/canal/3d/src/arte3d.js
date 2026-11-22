// Arte do canal em 3D: logo (800x800) e banner (2560x1440). window.draw('logo'|'banner')
import { THREE, W, H, scene, camera, renderer, makeChar, M, mesh, sph, rbox, grp, cap, cam, thumbLights, setDay } from '../../../_lib/mundo3d.js';

const jo = makeChar();
const J = jo.root;
// robô (igual ao da série do QI)
const robot = grp(scene, [1.5, 0, -1.4]);
const steel = M('#9aa5b1', { metalness: 0.5, roughness: 0.35 }), steelD = M('#5c6b7a', { metalness: 0.5, roughness: 0.4 });
const eyeMat = new THREE.MeshStandardMaterial({ color: '#222', emissive: '#00e5ff', emissiveIntensity: 3 });
for (const x of [-0.22, 0.22]) mesh(rbox(0.28, 0.7, 0.3, 0.05), steelD, robot, [x, 0.35, 0]);
mesh(rbox(0.85, 0.9, 0.6, 0.1), steel, robot, [0, 1.15, 0]);
for (const s of [-1, 1]) mesh(cap(0.09, 0.5), steelD, robot, [s * 0.56, 1.15, 0], [0, 0, s * 0.15]);
const rhead = grp(robot, [0, 1.88, 0]);
mesh(rbox(0.62, 0.48, 0.5, 0.1), steel, rhead);
[-1, 1].forEach(s => mesh(sph(0.07, 16, 12), eyeMat, rhead, [s * 0.14, 0.06, 0.26]));
mesh(cap(0.02, 0.2), steelD, rhead, [0, 0.36, 0]);
mesh(sph(0.05, 12, 10), new THREE.MeshStandardMaterial({ color: '#ff4d6d', emissive: '#ff4d6d', emissiveIntensity: 2 }), rhead, [0, 0.5, 0]);
mesh(rbox(0.22, 0.05, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: '#111', emissive: '#00e5ff', emissiveIntensity: 1.5 }), rhead, [0, -0.11, 0.26]);
const eyeLight = new THREE.PointLight('#00e5ff', 0, 4, 2); scene.add(eyeLight);
// raios atrás
function raysTex(c1, c2, bg) {
  const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d');
  for (let k = 0; k < 28; k++) { x.beginPath(); x.moveTo(512, 512); const a0 = k / 28 * Math.PI * 2; x.arc(512, 512, 720, a0, a0 + Math.PI / 28); x.closePath(); x.fillStyle = k % 2 ? c2 : c1; x.fill(); }
  const g = x.createRadialGradient(512, 512, 40, 512, 512, 512); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,240,190,.45)'); g.addColorStop(1, bg);
  x.globalAlpha = 0.8; x.fillStyle = g; x.fillRect(0, 0, 1024, 1024);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const rays = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: raysTex('#ffd60a', '#ff7b00', 'rgba(20,8,40,1)'), toneMapped: false }));
scene.add(rays);
const v = new THREE.Vector3();

window.draw = function (mode) {
  thumbLights([0.3, 2.6, 2.2]); scene.background.set('#120a2a');
  J.position.set(0.3, 0.86, -0.4); J.rotation.set(0, 0, 0);
  if (mode === 'logo') {
    robot.visible = false;
    jo.head.scale.setScalar(1.15);
    jo.pose({ armL: [0.2, 0.1, 0.3], armR: [0.2, 0.1, 0.3], head: [-0.06, 0.18, 0.1] });
    jo.face({ open: 1.12, mouth: 'smile', brow: 0.6, browTilt: -0.15, look: [-0.15, 0.1] });
    scene.updateMatrixWorld(true); jo.head.getWorldPosition(v);
    rays.position.set(v.x, v.y - 0.2, v.z - 1.8);
    const CP = [0.3, v.y + 0.02, 1.55];
    rays.lookAt(...CP);
    camera.fov = 40; camera.updateProjectionMatrix(); cam(CP, [0.3, v.y - 0.12, -0.4], 0, 0);
  } else {
    robot.visible = true; robot.position.set(1.55, 0, -1.3); robot.rotation.set(0, -0.45, 0); rhead.rotation.set(0.05, -0.25, 0.06);
    jo.head.scale.setScalar(1.12);
    J.position.set(0.55, 0.86, -0.2); J.rotation.y = -0.3;
    jo.pose({ armR: [1.45, -0.95, 2.25], armL: [0.25, 0.55, 1.2], head: [-0.08, 0.1, 0.1] });
    jo.face({ open: 1.15, mouth: 'smile', brow: 0.55, browTilt: 0.3, look: [-0.5, 0.35] });
    scene.updateMatrixWorld(true); rhead.getWorldPosition(v); eyeLight.position.set(v.x, v.y, v.z + 0.7); eyeLight.intensity = 4;
    jo.head.getWorldPosition(v);
    rays.position.set(v.x + 0.3, v.y - 0.3, v.z - 2.6);
    const CP = [-0.55, 1.55, 6.8];
    rays.lookAt(...CP); rays.scale.setScalar(1.4);
    camera.fov = 34; camera.updateProjectionMatrix(); cam(CP, [-0.55, 1.98, -0.4], 0, 0);
  }
  renderer.render(scene, camera);
};
