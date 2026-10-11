// Alat bersama (disesuaikan dari ekosistem-berbasis-bukti/alat.js): renderer, palet W, bantuan matematika,
// bahan, garis tebal, kamera isometrik, label HTML yang menempel pada benda 3D.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
export { acak } from "./isyarat.js";

export const LEBAR = 1080;
export const TINGGI = 1920;
export const DEG = Math.PI / 180;
export const ISO = Math.atan(1 / Math.SQRT2) / DEG; // 35,26Â°

// ---------------------------------------------------------------- bantuan
export const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const campur = (a, b, k) => a + (b - a) * k;
export const rentang = (t, a, b) => klem((t - a) / (b - a));
export const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
export const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
export const masukKeluar3 = (x) => { x = klem(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const lenting = (x, s = 1.7) => { x = klem(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
export const jendela = (t, a, b, masuk = 0.3, keluar = 0.3) => Math.min(halus((t - a) / masuk), halus((b - t) / keluar));
export const pegas = (dt, laju = 12, frek = 22) => (dt < 0 ? 0 : Math.exp(-dt * laju) * Math.cos(dt * frek));
export const warna = (css) => new THREE.Color(css);
export const $ = (id) => document.getElementById(id);

// Palet (bagian B.5). Hanya warna ini yang dipakai untuk benda.
export const W = {
  latar: warna("hsl(153, 50%, 7%)"),
  grid: warna("hsl(153, 36%, 11.5%)"),
  gridMayor: warna("hsl(153, 40%, 15%)"),
  pelat: warna("hsl(153, 36%, 10%)"),
  zamrud: warna("hsl(153, 62%, 36%)"),
  zamrudPijar: warna("hsl(153, 72%, 42%)"),
  zamrudRedup: warna("hsl(153, 55%, 24%)"),
  emas: warna("hsl(42, 52%, 58%)"),
  emasPijar: warna("hsl(42, 80%, 52%)"),
  krem: warna("hsl(42, 33%, 96%)"),
  kertas: warna("hsl(42, 28%, 86%)"),
  abu: warna("hsl(150, 5%, 52%)"),
  abuGelap: warna("hsl(150, 6%, 34%)"),
  pion: warna("hsl(150, 10%, 80%)"),
};

// ---------------------------------------------------------------- renderer dan komposisi
export const renderer = new THREE.WebGLRenderer({ canvas: $("kanvas"), antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
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
export const bloom = new UnrealBloomPass(new THREE.Vector2(LEBAR, TINGGI), 0.5, 0.5, 0.74);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- cahaya
export const ARAH_CAHAYA = new THREE.Vector3(-0.32, 1, 0.78).normalize();
export const hemi = new THREE.HemisphereLight(warna("hsl(150, 30%, 70%)"), warna("hsl(153, 50%, 6%)"), 1.6);
scene.add(hemi);
export const matahari = new THREE.DirectionalLight(warna("hsl(45, 40%, 96%)"), 2.6);
matahari.castShadow = true;
matahari.shadow.mapSize.set(2048, 2048);
Object.assign(matahari.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 100 });
matahari.shadow.bias = -0.0006;
matahari.shadow.normalBias = 0.02;
scene.add(matahari, matahari.target);

// ---------------------------------------------------------------- arah layar (kamera isometrik dari +x, +z)
export const KANAN = new THREE.Vector3(Math.SQRT1_2, 0, -Math.SQRT1_2); // ke kanan di layar
export const BAWAH = new THREE.Vector3(Math.SQRT1_2, 0, Math.SQRT1_2);  // ke bawah di layar (mendekati penonton)
export const NAIK = new THREE.Vector3(0, 1, 0);
export const titik = (r, d, y = 0) => new THREE.Vector3().addScaledVector(KANAN, r).addScaledVector(BAWAH, d).setY(y);

// ---------------------------------------------------------------- bahan dan bentuk umum (bagian D.1)
export function bahan(c, opsi = {}) {
  return new THREE.MeshStandardMaterial({ color: c.clone(), roughness: 0.8, metalness: 0, emissive: new THREE.Color(0, 0, 0), ...opsi });
}
export function bayang(m, kirim = true, terima = true) {
  m.traverse((o) => { if (o.isMesh) { o.castShadow = kirim; o.receiveShadow = terima; } });
  return m;
}
export function balok(w, h, d, mat, r = 0.06) {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)) : new THREE.BoxGeometry(w, h, d);
  return bayang(new THREE.Mesh(g, mat));
}
export function bahanGaris(c, lebar, opasitas = 1) {
  const m = new LineMaterial({ color: c.clone(), linewidth: lebar, transparent: true, opacity: opasitas, depthWrite: false });
  m.resolution.set(LEBAR, TINGGI);
  return m;
}
export function garisDari(posisi, mat) { // posisi: [x1,y1,z1,x2,y2,z2, ...] berpasangan
  return new LineSegments2(new LineSegmentsGeometry().setPositions(posisi), mat);
}
// Garis tepi sebuah kotak (w Ã— h Ã— d, alas di y = 0) sebagai LineSegments2.
export function tepiKotak(w, h, d, mat) {
  const e = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0));
  return garisDari(Array.from(e.attributes.position.array), mat);
}

// ---------------------------------------------------------------- kamera ortografis isometrik
// f: titik fokus dunia; H: tinggi frustum (satuan dunia); ax/ay: posisi fokus di layar (px).
export const keadaan = (f, H, ax = 540, ay = 1010) => ({ fx: f.x, fy: f.y, fz: f.z, H, ax, ay });
const _arah = new THREE.Vector3();
export function aturKamera(s, el = ISO, az = 45) {
  _arah.set(Math.cos(el * DEG) * Math.sin(az * DEG), Math.sin(el * DEG), Math.cos(el * DEG) * Math.cos(az * DEG));
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
}

// ---------------------------------------------------------------- label HTML yang menempel pada benda 3D
const lapisan = $("label3d");
export function buatLabel(kelas, html) {
  const el = document.createElement("div");
  el.className = "lbl " + kelas;
  el.innerHTML = html;
  lapisan.appendChild(el);
  return el;
}
const _p = new THREE.Vector3();
export const BATAS = { atas: 520, bawah: 1450 };
// Letakkan label pada titik dunia. ax/ay: jangkar label (0..1). Label memudar di luar zona aman.
export function taruh(el, pos, opasitas, { dx = 0, dy = 0, ax = 0.5, ay = 1, skala = 1 } = {}) {
  if (opasitas <= 0.001) { el.style.opacity = "0"; return; }
  _p.copy(pos).project(kamera);
  const w = el.offsetWidth, h = el.offsetHeight;
  const x = (_p.x + 1) / 2 * LEBAR + dx - w * ax;
  const y = (1 - _p.y) / 2 * TINGGI + dy - h * ay;
  let f = halus((y - BATAS.atas) / 24) * halus((BATAS.bawah - (y + h)) / 24);
  f *= halus((x - 40) / 14) * halus((1040 - (x + w)) / 14);
  el.style.opacity = String(opasitas * f);
  el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${skala.toFixed(3)})`;
}
