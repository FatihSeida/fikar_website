// Alat bersama: renderer, palet, bahan, garis, kamera. Disalin dan disesuaikan dari ekosistem-berbasis-bukti/alat.js.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

export const LEBAR = 1080;
export const TINGGI = 1920;
export const DEG = Math.PI / 180;
export const ISO = Math.atan(1 / Math.SQRT2) / DEG; // 35,26°
export const warna = (css) => new THREE.Color(css);
export const $ = (id) => document.getElementById(id);

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
  kelas: warna("hsl(153, 20%, 22%)"), // dari kamus benda gedungKelas
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
export const hemi = new THREE.HemisphereLight(warna("hsl(150, 30%, 70%)"), warna("hsl(153, 50%, 6%)"), 1.9);
scene.add(hemi);
export const matahari = new THREE.DirectionalLight(warna("hsl(45, 40%, 96%)"), 2.5);
matahari.castShadow = true;
matahari.shadow.mapSize.set(2048, 2048);
Object.assign(matahari.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 100 });
matahari.shadow.bias = -0.0006;
matahari.shadow.normalBias = 0.02;
scene.add(matahari, matahari.target);

// ---------------------------------------------------------------- arah layar (kamera isometrik dari +x, +y, +z)
export const KANAN = new THREE.Vector3(Math.SQRT1_2, 0, -Math.SQRT1_2);
export const BAWAH = new THREE.Vector3(Math.SQRT1_2, 0, Math.SQRT1_2);
export const titik = (r, d, y = 0) => new THREE.Vector3().addScaledVector(KANAN, r).addScaledVector(BAWAH, d).setY(y);

// ---------------------------------------------------------------- bahan dan bentuk
// Benda padat: MeshStandardMaterial, roughness 0,8, metalness 0.
export function bahan(c, opsi = {}) {
  return new THREE.MeshStandardMaterial({ color: c.clone(), roughness: 0.8, metalness: 0, emissive: new THREE.Color(0, 0, 0), ...opsi });
}
export function bayang(m, kirim = true, terima = true) {
  m.traverse((o) => { if (o.isMesh) { o.castShadow = kirim; o.receiveShadow = terima; } });
  return m;
}
export function balok(w, h, d, mat, r = 0.06) {
  const rr = Math.min(r, Math.min(w, h, d) / 2 - 0.001);
  const g = rr > 0.004 ? new RoundedBoxGeometry(w, h, d, 3, rr) : new THREE.BoxGeometry(w, h, d);
  return bayang(new THREE.Mesh(g, mat));
}
export function bahanGaris(c, lebar, opasitas = 1) {
  const m = new LineMaterial({ color: c.clone(), linewidth: lebar, transparent: true, opacity: opasitas, depthWrite: false });
  m.resolution.set(LEBAR, TINGGI);
  return m;
}
export function garisDari(posisi, mat) { // posisi: [x1,y1,z1,x2,y2,z2, ...] berpasangan
  const l = new LineSegments2(new LineSegmentsGeometry().setPositions(posisi), mat);
  l.frustumCulled = false;
  return l;
}
// Garis tepi kotak (12 rusuk) dengan pusat (0, h/2, 0) bila dariAlas.
export function tepiKotak(w, h, d, mat, dariAlas = true) {
  const x = w / 2, z = d / 2, y0 = dariAlas ? 0 : -h / 2, y1 = y0 + h;
  const p = [];
  const sudut = [[-x, -z], [x, -z], [x, z], [-x, z]];
  for (let i = 0; i < 4; i++) {
    const [ax, az] = sudut[i], [bx, bz] = sudut[(i + 1) % 4];
    p.push(ax, y0, az, bx, y0, bz, ax, y1, az, bx, y1, bz, ax, y0, az, ax, y1, az);
  }
  return garisDari(p, mat);
}

// ---------------------------------------------------------------- pudar: opasitas seluruh bahan dalam satu kelompok
// Opasitas dasar tiap bahan disimpan sekali; bayangan hanya dikirim saat benda cukup tampak.
export function pudar(grup, a) {
  grup.visible = a > 0.002;
  grup.traverse((o) => {
    const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of ms) {
      if (m.userData.opasitasDasar === undefined) { m.userData.opasitasDasar = m.opacity; m.userData.transparanDasar = m.transparent; }
      m.opacity = m.userData.opasitasDasar * a;
      m.transparent = m.userData.transparanDasar || a < 0.999;
      m.depthWrite = m.userData.transparanDasar ? m.depthWrite : a >= 0.999;
    }
    if (o.isMesh) {
      if (o.userData.kirimDasar === undefined) o.userData.kirimDasar = o.castShadow;
      o.castShadow = o.userData.kirimDasar && a > 0.5;
    }
  });
}

// ---------------------------------------------------------------- kamera ortografis isometrik
// k: { fx, fy, fz, H }. Fokus diproyeksikan ke piksel (540, 1010).
export const FOKUS_PX = { x: 540, y: 1010 };
const _arah = new THREE.Vector3();
export function aturKamera(k, el = ISO, az = 45) {
  _arah.set(Math.cos(el * DEG) * Math.sin(az * DEG), Math.sin(el * DEG), Math.cos(el * DEG) * Math.cos(az * DEG));
  kamera.position.set(k.fx, k.fy, k.fz).addScaledVector(_arah, 150);
  kamera.up.set(0, 1, 0);
  kamera.lookAt(k.fx, k.fy, k.fz);
  const lebarDunia = k.H * LEBAR / TINGGI;
  kamera.top = k.H * FOKUS_PX.y / TINGGI;
  kamera.bottom = -k.H * (1 - FOKUS_PX.y / TINGGI);
  kamera.left = -lebarDunia * FOKUS_PX.x / LEBAR;
  kamera.right = lebarDunia * (1 - FOKUS_PX.x / LEBAR);
  kamera.updateProjectionMatrix();
  kamera.updateMatrixWorld();
}
