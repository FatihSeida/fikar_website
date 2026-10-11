// Dasar bersama: renderer, pasca-proses, cahaya, tanah, kamera, bantuan bentuk dan teks.
// Bahasa visualnya mengikuti animasi/kuis-evidence-opus-intro.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { dariUV } from "./isyarat.js";

export const LEBAR = 1080;
export const TINGGI = 1920;
export const DEG = Math.PI / 180;

// ---------------------------------------------------------------- bantuan angka
export const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const campur = (a, b, k) => a + (b - a) * k;
export const rentang = (t, a, b) => klem((t - a) / (b - a));
export const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
export const halus2 = (x) => { x = klem(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
export const masukKeluar3 = (x) => { x = klem(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const lenting = (x, s = 1.7) => { x = klem(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
export const jendela = (t, a, b, masuk = 0.3, keluar = 0.3) => Math.min(halus((t - a) / masuk), halus((b - t) / keluar));
export const warna = (css) => new THREE.Color(css);
export const $ = (id) => document.getElementById(id);
export const titikUV = (u, v, y = 0) => { const p = dariUV(u, v); return new THREE.Vector3(p.x, y, p.z); };

export const W = {
  latar: warna("hsl(153, 50%, 7%)"),
  grid: warna("hsl(153, 36%, 11.5%)"),
  gridMayor: warna("hsl(153, 40%, 15%)"),
  pelat: warna("hsl(153, 36%, 10%)"),
  petak: warna("hsl(153, 28%, 17%)"),
  zamrud: warna("hsl(153, 62%, 36%)"),
  zamrudPijar: warna("hsl(153, 72%, 42%)"),
  zamrudRedup: warna("hsl(153, 55%, 24%)"),
  emas: warna("hsl(42, 52%, 58%)"),
  emasPijar: warna("hsl(42, 80%, 52%)"),
  krem: warna("hsl(42, 33%, 96%)"),
  kertas: warna("hsl(42, 30%, 86%)"),
  abu: warna("hsl(150, 5%, 42%)"),
  abuGelap: warna("hsl(150, 4%, 26%)"),
  kepala: warna("hsl(36, 26%, 78%)"),
  hitam: new THREE.Color(0, 0, 0),
};

// ---------------------------------------------------------------- renderer dan pasca-proses
export const renderer = new THREE.WebGLRenderer({ canvas: $("kanvas"), antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(LEBAR, TINGGI, false);
renderer.setClearColor(W.latar, 1);
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

export const scene = new THREE.Scene();
scene.background = W.latar.clone();
export const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);

const rt = new THREE.WebGLRenderTarget(LEBAR, TINGGI, { type: THREE.HalfFloatType, samples: 4 });
export const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(1);
composer.setSize(LEBAR, TINGGI);
composer.addPass(new RenderPass(scene, kamera));
export const bloom = new UnrealBloomPass(new THREE.Vector2(LEBAR, TINGGI), 0.55, 0.5, 0.72);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- cahaya
export const ARAH_CAHAYA = new THREE.Vector3(-0.32, 1, 0.78).normalize();
export const hemi = new THREE.HemisphereLight(warna("hsl(150, 30%, 70%)"), warna("hsl(153, 50%, 6%)"), 1.9);
scene.add(hemi);
export const matahari = new THREE.DirectionalLight(warna("hsl(45, 40%, 96%)"), 3.2);
matahari.castShadow = true;
matahari.shadow.mapSize.set(4096, 4096);
matahari.shadow.camera.near = 1;
matahari.shadow.camera.far = 120;
matahari.shadow.bias = -0.0006;
matahari.shadow.normalBias = 0.02;
scene.add(matahari, matahari.target);

// ---------------------------------------------------------------- bahan dan bentuk
export function bahan(c, opsi = {}) {
  return new THREE.MeshStandardMaterial({ color: c.clone(), roughness: 0.62, metalness: 0.05, emissive: new THREE.Color(0, 0, 0), ...opsi });
}
export function bayang(m) { m.castShadow = true; m.receiveShadow = true; return m; }
export function balok(w, h, d, r, mat) {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
  return bayang(new THREE.Mesh(g, mat));
}
// Balok beralas y = 0 (mudah ditumbuhkan dengan skala y).
export function balokAlas(w, h, d, r, mat) {
  const m = balok(w, h, d, r, mat);
  m.geometry.translate(0, h / 2, 0);
  return m;
}
export function teksturCahaya() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.25, "rgba(255,255,255,0.55)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  return tx;
}
export const TEKSTUR_CAHAYA = teksturCahaya();
export function sprite(c, ukuran) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEKSTUR_CAHAYA, color: c.clone(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(ukuran);
  return s;
}
export function bahanAditif(c, opasitas = 1) {
  return new THREE.MeshBasicMaterial({ color: c.clone(), transparent: true, opacity: opasitas, blending: THREE.AdditiveBlending, depthWrite: false });
}
// Bahan shader aditif dengan uWarna dan uKuat; fragmen menulis gl_FragColor dari uv.
export function bahanSinar(fragmen, c) {
  return new THREE.ShaderMaterial({
    uniforms: { uWarna: { value: c.clone() }, uKuat: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uWarna; uniform float uKuat; varying vec2 vUv; void main(){ vec2 uv = clamp(vUv, 0.0, 1.0); ${fragmen} }`,
  });
}
// Ruas garis tipis berbentuk balok dari a ke b (diskalakan sepanjang x lokal).
const GEO_RUAS = new THREE.BoxGeometry(1, 1, 1).translate(0.5, 0, 0);
export function ruas(mat, tebal = 0.03) {
  const m = new THREE.Mesh(GEO_RUAS, mat);
  m.userData.tebal = tebal;
  m.scale.set(0.001, tebal, tebal);
  return m;
}
const _a = new THREE.Vector3(), _q = new THREE.Quaternion(), _x = new THREE.Vector3(1, 0, 0);
export function aturRuas(m, a, b, k = 1) {
  _a.copy(b).sub(a);
  const pj = _a.length();
  m.position.copy(a);
  if (pj > 1e-6) m.quaternion.setFromUnitVectors(_x, _a.normalize());
  m.scale.set(Math.max(pj * k, 0.0001), m.userData.tebal, m.userData.tebal);
  m.visible = pj * k > 0.002;
}

// ---------------------------------------------------------------- teks pada permukaan
export function kanvasTeks(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.anisotropy = 8;
  return { c, g, tx };
}
export function kotakBulat(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
export const FONT = { serif: '"Noto Serif", Georgia, serif', sans: '"DM Sans", system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace' };

// ---------------------------------------------------------------- tanah: papan gelap bergaris halus
export const bahanTanah = new THREE.ShaderMaterial({
  uniforms: {
    uLatar: { value: W.latar }, uGaris: { value: W.grid }, uMayor: { value: W.gridMayor },
    uFokus: { value: new THREE.Vector3() }, uJari: { value: 20 },
  },
  vertexShader: `
    varying vec3 vW;
    void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `
    uniform vec3 uLatar; uniform vec3 uGaris; uniform vec3 uMayor; uniform vec3 uFokus; uniform float uJari;
    varying vec3 vW;
    float garis(vec2 p, float tebal) {
      vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
      return 1.0 - min(min(g.x, g.y) / tebal, 1.0);
    }
    void main() {
      vec2 p = vW.xz;
      float kecil = garis(p, 1.1);
      float besar = garis(p / 5.0, 1.5);
      float d = length(vW.xz - uFokus.xz);
      float pudar = 1.0 - smoothstep(uJari * 0.3, uJari, d);
      vec3 c = mix(uLatar, uGaris, kecil * pudar);
      c = mix(c, uMayor, besar * pudar);
      gl_FragColor = vec4(c, 1.0);
    }`,
});
export const tanah = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), bahanTanah);
tanah.rotation.x = -Math.PI / 2;
tanah.position.set(8, 0, 8);
scene.add(tanah);
export const bayangan = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ color: warna("hsl(153, 60%, 2%)"), opacity: 0.55 }));
bayangan.rotation.x = -Math.PI / 2;
bayangan.position.set(8, 0.004, 8);
bayangan.receiveShadow = true;
scene.add(bayangan);

// ---------------------------------------------------------------- kamera ortografis isometrik
export const ISO = Math.atan(1 / Math.SQRT2) / DEG; // 35,26°
// f: titik fokus dunia, H: tinggi bingkai (satuan dunia), ax/ay: posisi piksel titik fokus di layar.
export const keadaan = (f, H, ax = 540, ay = 820, el = ISO, az = 45) => ({ fx: f.x, fy: f.y ?? 0, fz: f.z, H, el, az, ax, ay });
const _arah = new THREE.Vector3();
export function aturKamera(s) {
  const el = s.el * DEG, az = s.az * DEG;
  _arah.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
  kamera.position.set(s.fx, s.fy, s.fz).addScaledVector(_arah, 150);
  kamera.up.set(0, 1, 0);
  kamera.lookAt(s.fx, s.fy, s.fz);
  const lebarDunia = s.H * LEBAR / TINGGI;
  kamera.top = s.H * s.ay / TINGGI;
  kamera.bottom = -s.H * (1 - s.ay / TINGGI);
  kamera.left = -lebarDunia * s.ax / LEBAR;
  kamera.right = lebarDunia * (1 - s.ax / LEBAR);
  kamera.updateProjectionMatrix();
  kamera.updateMatrixWorld();

  // Cahaya, bayangan, dan pudar grid mengikuti fokus kamera.
  const pusat = _arah.set(s.fx, 0, s.fz);
  matahari.target.position.copy(pusat);
  matahari.position.copy(pusat).addScaledVector(ARAH_CAHAYA, 50);
  matahari.target.updateMatrixWorld();
  const r = s.H * 0.62;
  const sc = matahari.shadow.camera;
  if (Math.abs(sc.right - r) > 0.5) {
    sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r;
    sc.updateProjectionMatrix();
  }
  bahanTanah.uniforms.uFokus.value.set(s.fx, 0, s.fz);
  bahanTanah.uniforms.uJari.value = s.H * 0.95;
}

// ---------------------------------------------------------------- label HTML yang menempel pada titik dunia
const lapisan = $("label3d");
export function buatLabel(kelas, html) {
  const el = document.createElement("div");
  el.className = "lbl " + kelas;
  el.innerHTML = html;
  lapisan.appendChild(el);
  return el;
}
const _p = new THREE.Vector3();
// ax/ay: titik jangkar label (0..1). Label memudar di luar zona aman (x 62–938, y 340–1250).
export function taruh(el, pos, opasitas, { dx = 0, dy = 0, ax = 0.5, ay = 1, skala = 1, atas = 340, bawah = 1250 } = {}) {
  if (opasitas <= 0.001) { el.style.opacity = "0"; return; }
  _p.copy(pos).project(kamera);
  const w = el.offsetWidth, h = el.offsetHeight;
  const x = (_p.x + 1) / 2 * LEBAR + dx - w * ax;
  const y = (1 - _p.y) / 2 * TINGGI + dy - h * ay;
  let f = halus((y - atas) / 24) * halus((bawah - (y + h)) / 24);
  f *= halus((x - 62) / 16) * halus((938 - (x + w)) / 16);
  el.style.opacity = String(opasitas * f);
  el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${skala.toFixed(3)})`;
}
