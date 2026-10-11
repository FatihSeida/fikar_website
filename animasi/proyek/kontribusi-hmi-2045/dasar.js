// Dasar bersama: renderer, kamera, cahaya, warna, bantuan bentuk dan gerak.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

export const LEBAR = 1080;
export const TINGGI = 1920;
export const DEG = Math.PI / 180;

// ---------------------------------------------------------------- gerak
export const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const campur = (a, b, k) => a + (b - a) * k;
export const rentang = (t, a, b) => klem((t - a) / (b - a));
export const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
export const halus2 = (x) => { x = klem(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
export const masukKeluar3 = (x) => { x = klem(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const lenting = (x, s = 1.7) => { x = klem(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
export const jendela = (t, a, b, masuk, keluar) => Math.min(halus((t - a) / masuk), halus((b - t) / keluar));
export const warna = (css) => new THREE.Color(css);
export const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------- koordinat perjalanan
// Kamera isometrik melihat dari (+x, +y, +z). Sumbu a = kanan layar, sumbu b = naik di layar (menjauh).
const R2 = Math.SQRT1_2;
export function dunia(a, b, y = 0, out = new THREE.Vector3()) {
  return out.set(R2 * (a - b), y, -R2 * (a + b));
}
export const YAW_MAJU = (3 * Math.PI) / 4; // rotation.y yang membuat sumbu lokal +x menunjuk ke +b
export function yawDari(psi) { return YAW_MAJU + psi; } // psi > 0: haluan condong ke kiri layar

// ---------------------------------------------------------------- palet
export const W = {
  latar: warna("hsl(153, 50%, 7%)"),
  grid: warna("hsl(153, 36%, 11.5%)"),
  gridMayor: warna("hsl(153, 40%, 15%)"),
  pelat: warna("hsl(153, 36%, 10%)"),
  petak: warna("hsl(153, 28%, 17%)"),
  dinding: warna("hsl(153, 20%, 21%)"),
  dindingTerang: warna("hsl(150, 16%, 30%)"),
  atap: warna("hsl(153, 30%, 12.5%)"),
  zamrud: warna("hsl(153, 62%, 36%)"),
  zamrudPijar: warna("hsl(153, 72%, 42%)"),
  zamrudRedup: warna("hsl(153, 55%, 24%)"),
  emas: warna("hsl(42, 52%, 58%)"),
  emasPijar: warna("hsl(42, 80%, 52%)"),
  krem: warna("hsl(42, 33%, 96%)"),
  pion: warna("hsl(45, 20%, 74%)"),
  pionB: warna("hsl(168, 22%, 60%)"),
  abu: warna("hsl(150, 5%, 46%)"),
  abuGelap: warna("hsl(150, 5%, 26%)"),
  kayu: warna("hsl(28, 30%, 30%)"),
  kayuTerang: warna("hsl(32, 32%, 42%)"),
  batu: warna("hsl(166, 13%, 21%)"),
  batuTerang: warna("hsl(162, 12%, 33%)"),
};

// ---------------------------------------------------------------- renderer
export const kanvas = $("kanvas");
export const renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(LEBAR, TINGGI, false);
renderer.setClearColor(W.latar, 1);
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

export const scene = new THREE.Scene();
scene.background = W.latar.clone();
export const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);

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
export const matahari = new THREE.DirectionalLight(warna("hsl(45, 40%, 96%)"), 3.4);
matahari.castShadow = true;
matahari.shadow.mapSize.set(2048, 2048);
Object.assign(matahari.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 120 });
matahari.shadow.bias = -0.0006;
matahari.shadow.normalBias = 0.02;
scene.add(matahari, matahari.target);

// ---------------------------------------------------------------- kamera isometrik
// Keadaan kamera: fokus (fx, fy, fz), tinggi pandang H (satuan dunia), elevasi, azimut, dan titik layar (ax, ay) tempat fokus berada.
export const ISO = Math.atan(1 / Math.SQRT2) / DEG;
export const keadaan = (f, H, ax, ay, el = ISO, az = 45) => ({ fx: f.x, fy: f.y, fz: f.z, H, el, az, ax, ay });
const _arah = new THREE.Vector3();
export function aturKamera(s) {
  const el = s.el * DEG, az = s.az * DEG;
  _arah.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
  kamera.position.set(s.fx, s.fy, s.fz).addScaledVector(_arah, 150);
  kamera.up.set(0, 1, 0);
  kamera.lookAt(s.fx, s.fy, s.fz);
  const lebarDunia = (s.H * LEBAR) / TINGGI;
  kamera.top = (s.H * s.ay) / TINGGI;
  kamera.bottom = -s.H * (1 - s.ay / TINGGI);
  kamera.left = (-lebarDunia * s.ax) / LEBAR;
  kamera.right = lebarDunia * (1 - s.ax / LEBAR);
  kamera.updateProjectionMatrix();
  kamera.updateMatrixWorld();
}

// ---------------------------------------------------------------- bahan dan bentuk
export function bahan(c, opsi = {}) {
  return new THREE.MeshStandardMaterial({ color: c.clone(), roughness: 0.62, metalness: 0.05, emissive: new THREE.Color(0, 0, 0), ...opsi });
}
export function jala(geo, mat, bayang = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = bayang;
  m.receiveShadow = true;
  return m;
}
export function balok(w, h, d, r, mat) {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
  return jala(g, mat);
}
export function bahanGaris(c, lebar, opasitas = 1, opsi = {}) {
  const m = new LineMaterial({ color: c.clone(), linewidth: lebar, transparent: true, opacity: opasitas, depthWrite: false, ...opsi });
  m.resolution.set(LEBAR, TINGGI);
  return m;
}
export function garisRuas(titik, mat) { // titik: [x,y,z, x,y,z, ...] berpasangan
  return new LineSegments2(new LineSegmentsGeometry().setPositions(titik), mat);
}
export function garisSambung(titik, mat) { // polyline
  const g = new LineGeometry();
  g.setPositions(titik);
  const l = new Line2(g, mat);
  l.computeLineDistances();
  return l;
}
function teksturCahaya() {
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
export function sprite(c, ukuran, opasitas = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEKSTUR_CAHAYA, color: c.clone(), transparent: true, opacity: opasitas, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(ukuran);
  return s;
}
export function bahanAditif(c, opasitas = 1) {
  return new THREE.MeshBasicMaterial({ color: c.clone(), transparent: true, opacity: opasitas, blending: THREE.AdditiveBlending, depthWrite: false });
}

// Figur pion tanpa wajah (bentuk bubut). Tinggi 1 satuan, alas di y = 0.
export const GEO_PION = (() => {
  const p = [
    [0.0, 0.0], [0.3, 0.0], [0.315, 0.025], [0.31, 0.06], [0.27, 0.085], [0.2, 0.105], [0.17, 0.14],
    [0.14, 0.3], [0.125, 0.5], [0.205, 0.53], [0.21, 0.565], [0.135, 0.6], [0.105, 0.63],
  ];
  const cy = 0.79, r = 0.175;
  for (let k = 0; k <= 12; k++) { // kepala bulat
    const a = -Math.PI / 2 + Math.PI * (k / 12) * 1.0;
    const x = Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (y > 0.63 || k === 12) p.push([Math.max(x, 0.0001), y]);
  }
  p.push([0, cy + r]);
  const g = new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x, y)), 28);
  g.computeVertexNormals();
  return g;
})();
export function pion(c = W.pion, opsi = {}) {
  return jala(GEO_PION, bahan(c, { roughness: 0.5, ...opsi }));
}

// ---------------------------------------------------------------- teks pada kanvas (untuk permukaan benda)
export function teksturTeks(lebar, tinggi, gambar) {
  const c = document.createElement("canvas");
  c.width = lebar;
  c.height = tinggi;
  gambar(c.getContext("2d"), lebar, tinggi);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.anisotropy = 8;
  return tx;
}

// ---------------------------------------------------------------- label HTML yang menempel pada benda
const lapisan = $("label3d");
export function buatLabel(kelas, html) {
  const el = document.createElement("div");
  el.className = "lbl " + kelas;
  el.innerHTML = html;
  lapisan.appendChild(el);
  return el;
}
const _p = new THREE.Vector3();
export const ZONA = { atas: 600, bawah: 1460 };
// Letakkan label pada titik dunia. ax/ay: titik jangkar label (0..1). Label memudar di luar zona aman.
export function taruh(el, pos, opasitas, { dx = 0, dy = 0, ax = 0.5, ay = 1, skala = 1, jepit = false } = {}) {
  if (opasitas <= 0.001) { el.style.opacity = "0"; return; }
  _p.copy(pos).project(kamera);
  const w = el.offsetWidth, h = el.offsetHeight;
  let x = ((_p.x + 1) / 2) * LEBAR + dx - w * ax;
  const y = ((1 - _p.y) / 2) * TINGGI + dy - h * ay;
  if (jepit) x = klem(x, 72, 928 - w);
  let f = halus((y - ZONA.atas) / 24) * halus((ZONA.bawah - (y + h)) / 24);
  f *= halus((x - 62) / 14) * halus((938 - (x + w)) / 14);
  el.style.opacity = String(opasitas * f);
  el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${skala.toFixed(3)})`;
}
