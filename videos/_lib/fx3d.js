// Efeitos de "cinema" para as cenas 3D (grátis, roda no próprio three.js):
// brilho real (bloom), onda de choque que distorce a tela, aberração cromática, borrão radial (zoom blur),
// vinheta e granulação. Uso:
//   import { makeFX } from '../../_lib/fx3d.js';
//   const fx = makeFX(renderer, scene, camera, W, H);
//   fx.set({ bloom: 1.2, wave: [x, y, raio, força], ca: 0.6, zoom: 0.5, center: [x, y] });  (x, y em 0..1 da tela)
//   fx.render();   // no lugar de renderer.render(scene, camera)
//   fx.toScreen(vec3) -> [x, y] em 0..1 (para centralizar a onda num ponto 3D)
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const FXShader = {
  uniforms: {
    tDiffuse: { value: null }, aspect: { value: 1 }, time: { value: 0 },
    center: { value: new THREE.Vector2(0.5, 0.5) }, zoom: { value: 0 }, ca: { value: 0 },
    wave: { value: new THREE.Vector4(0.5, 0.5, -1, 0) }, vig: { value: 0.35 }, grain: { value: 0.04 },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float aspect, time, zoom, ca, vig, grain; uniform vec2 center; uniform vec4 wave; varying vec2 vUv;
    float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + time * 7.13) * 43758.5453); }
    void main(){
      vec2 uv = vUv;
      if (wave.z > 0.0) {                       // onda de choque: anel que entorta a imagem
        vec2 d = uv - wave.xy; d.x *= aspect; float r = length(d);
        float x = (r - wave.z) / 0.045; float k = exp(-x * x) * wave.w;
        vec2 n = r > 0.0001 ? d / r : vec2(0.0); n.x /= aspect; uv -= n * k * 0.035;
      }
      vec3 col = vec3(0.0); vec2 c = center;
      for (int i = 0; i < 14; i++) {            // borrão radial + aberração cromática
        float s = 1.0 - zoom * 0.11 * float(i) / 13.0;
        vec2 u = c + (uv - c) * s; vec2 off = (u - c) * ca * 0.025;
        col.r += texture2D(tDiffuse, u + off).r; col.g += texture2D(tDiffuse, u).g; col.b += texture2D(tDiffuse, u - off).b;
      }
      col /= 14.0;
      if (wave.z > 0.0) { vec2 d = vUv - wave.xy; d.x *= aspect; float x = (length(d) - wave.z) / 0.02; col += vec3(1.0, 0.9, 0.7) * exp(-x * x) * wave.w * 0.25; }
      vec2 q = vUv - 0.5; q.x *= aspect; col *= 1.0 - vig * smoothstep(0.35, 0.95, length(q) * 1.25);
      col += (rnd(vUv * 800.0) - 0.5) * grain;
      gl_FragColor = vec4(col, 1.0);
    }`,
};

export function makeFX(renderer, scene, camera, W, H) {
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.8, 0.55, 0.82);
  composer.addPass(bloom);
  const fxp = new ShaderPass(FXShader); fxp.uniforms.aspect.value = W / H; composer.addPass(fxp);
  composer.addPass(new OutputPass());
  const v = new THREE.Vector3();
  const api = {
    composer, bloom, pass: fxp,
    set(o = {}) {
      bloom.strength = o.bloom ?? 0.8; bloom.radius = o.bloomRadius ?? 0.55; bloom.threshold = o.threshold ?? 0.82;
      const u = fxp.uniforms; u.zoom.value = o.zoom || 0; u.ca.value = o.ca || 0; u.vig.value = o.vig ?? 0.35; u.grain.value = o.grain ?? 0.04; u.time.value = o.time || 0;
      if (o.center) u.center.value.set(o.center[0], o.center[1]); else u.center.value.set(0.5, 0.5);
      if (o.wave) u.wave.value.set(...o.wave); else u.wave.value.set(0.5, 0.5, -1, 0);
    },
    toScreen(p) { v.copy(p).project(camera); return [(v.x + 1) / 2, (v.y + 1) / 2]; },
    render() { composer.render(); },
  };
  return api;
}
