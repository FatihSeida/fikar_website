// Fikstur uji untuk kit/alat/buat.mjs. Jangan dihapus: dipakai sebagai uji regresi alat.
//
// Halaman ini memenuhi kontrak halaman (kit/KONTRAK.md §2–4) dengan isi three.js sederhana:
// - DURASI 4 detik, 30 fps. Setiap frame menulis t dan nomor frame sebagai teks, dan nomor frame
//   sebagai kode biner 12 bit di kiri atas. periksa-urutan.mjs membaca kode itu dari MP4 untuk
//   memastikan jumlah dan urutan frame tepat.
// - KIT.peristiwa, KIT.periksaZona, dan KIT.titikPeriksa. Benda "pelari" sengaja keluar zona
//   (kanan) sekitar detik 2,6–3,7, jadi laporan zona harus menunjukkan pelanggaran.
// - Bercak merah 120×120 px di x 860–980, y 760–880 pada detik 1,0–2,6, yang harus tertangkap
//   laporan warna. Emas dan zamrud dengan bloom (seperti video seri) tidak boleh tertangkap.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const UKURAN = { lebar: 1080, tinggi: 1920 }; // ubah ke { lebar: 1080, tinggi: 1350 } untuk menguji ukuran lain
const FPS = 30;
const DURASI = 4;
const { lebar: L, tinggi: T } = UKURAN;
// Zona format indikator (y 600–1440 pada tinggi 1920), diskalakan bila tinggi berbeda.
const ZONA = { x0: 0, y0: Math.round(T * 0.3125), x1: L, y1: Math.round(T * 0.75) };

const $ = (id) => document.getElementById(id);
const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
const warna = (css) => new THREE.Color(css);

document.documentElement.style.width = document.body.style.width = `${L}px`;
document.documentElement.style.height = document.body.style.height = `${T}px`;

const W = {
  latar: warna("hsl(153, 50%, 7%)"),
  grid: warna("hsl(153, 36%, 11.5%)"),
  gridMayor: warna("hsl(153, 40%, 15%)"),
  pelat: warna("hsl(153, 36%, 10%)"),
  zamrud: warna("hsl(153, 62%, 36%)"),
  zamrudPijar: warna("hsl(153, 72%, 42%)"),
  emas: warna("hsl(42, 52%, 58%)"),
  emasPijar: warna("hsl(42, 80%, 52%)"),
};

// ---------------------------------------------------------------- renderer (sama seperti video seri)
const renderer = new THREE.WebGLRenderer({ canvas: $("kanvas"), antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(L, T);
renderer.setClearColor(W.latar, 1);
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = W.latar.clone();
const tinggiFrustum = 14;
const kamera = new THREE.OrthographicCamera(
  (-tinggiFrustum / 2) * (L / T), (tinggiFrustum / 2) * (L / T), tinggiFrustum / 2, -tinggiFrustum / 2, 0.1, 200,
);
kamera.position.set(20, 24, 20);
kamera.lookAt(0, 0.8, 0);
kamera.updateMatrixWorld();

const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(L, T, { type: THREE.HalfFloatType, samples: 4 }));
composer.setPixelRatio(1);
composer.setSize(L, T);
composer.addPass(new RenderPass(scene, kamera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(L, T), 0.5, 0.5, 0.74));
composer.addPass(new OutputPass());

scene.add(new THREE.HemisphereLight(warna("hsl(150, 30%, 70%)"), warna("hsl(153, 50%, 6%)"), 1.6));
const matahari = new THREE.DirectionalLight(warna("hsl(45, 40%, 96%)"), 2.6);
matahari.position.set(-6, 18, 14);
matahari.castShadow = true;
matahari.shadow.mapSize.set(2048, 2048);
Object.assign(matahari.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 60 });
scene.add(matahari);

// ---------------------------------------------------------------- dunia dan benda
const tanah = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: W.pelat, roughness: 1 }));
tanah.rotation.x = -Math.PI / 2;
tanah.receiveShadow = true;
scene.add(tanah);
const grid = new THREE.GridHelper(60, 60, W.gridMayor, W.grid);
grid.position.y = 0.005;
scene.add(grid);

function benda(nama, geometri, bahan) {
  const m = new THREE.Mesh(geometri, bahan);
  m.castShadow = true;
  m.userData = { nama, penting: true };
  scene.add(m);
  return m;
}
const kotak = benda("kotak", new THREE.BoxGeometry(1.6, 1.6, 1.6), new THREE.MeshStandardMaterial({ color: W.emas, roughness: 0.55 }));
const bahanBola = new THREE.MeshStandardMaterial({ color: W.emasPijar, emissive: W.emasPijar, emissiveIntensity: 0.6, roughness: 0.4 });
const bola = benda("bola", new THREE.SphereGeometry(0.8, 48, 24), bahanBola);
const bahanTabung = new THREE.MeshStandardMaterial({ color: W.zamrud, emissive: W.zamrudPijar, emissiveIntensity: 0, roughness: 0.5 });
const tabung = benda("tabung", new THREE.CylinderGeometry(0.6, 0.6, 2, 40), bahanTabung);
const pelari = benda("pelari", new THREE.ConeGeometry(0.55, 1.4, 32), new THREE.MeshStandardMaterial({ color: W.emas, roughness: 0.5 }));
const penting = [kotak, bola, tabung, pelari];

// Kode biner nomor frame.
const BIT = 12;
const kode = $("kode");
const kotakBit = Array.from({ length: BIT }, () => kode.appendChild(document.createElement("div")));

// ---------------------------------------------------------------- waktu
function tampilkan(t) {
  const f = Math.round(t * FPS);
  kotakBit.forEach((el, i) => el.classList.toggle("satu", ((f >> (BIT - 1 - i)) & 1) === 1));
  $("waktu").textContent = `t ${t.toFixed(3)} s · f ${f}`;
  $("merah").style.display = t >= 1.0 && t < 2.6 ? "block" : "none";

  const muncul = halus(t / 0.6);
  kotak.position.set(-2.2, 0.8, 0.6);
  kotak.rotation.y = t * 0.9;
  kotak.scale.setScalar(Math.max(0.001, muncul));
  bola.position.set(2.0, 0.8 + Math.abs(Math.sin(t * 2.2)) * 1.4, -0.8);
  bahanBola.emissiveIntensity = 0.4 + 0.5 * halus((t - 0.8) / 0.8);
  tabung.position.set(0.2, 1, 2.6);
  bahanTabung.emissiveIntensity = 0.9 * halus((t - 1.5) / 0.6);
  // Pelari keluar ke kanan (2,3–3,0), diam di luar, lalu kembali (3,5–3,9).
  const x = 11 * (halus((t - 2.3) / 0.7) - halus((t - 3.5) / 0.4));
  pelari.position.set(x, 0.7, -x);
  pelari.rotation.y = t * 2;

  composer.render();
}

function periksaZona(t) {
  tampilkan(t);
  const kotak3 = new THREE.Box3();
  const v = new THREE.Vector3();
  const hasil = [];
  for (const o of penting) {
    kotak3.setFromObject(o);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < 8; i++) {
      v.set(i & 1 ? kotak3.max.x : kotak3.min.x, i & 2 ? kotak3.max.y : kotak3.min.y, i & 4 ? kotak3.max.z : kotak3.min.z).project(kamera);
      const px = ((v.x + 1) / 2) * L;
      const py = ((1 - v.y) / 2) * T;
      x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
    }
    const keluar = [];
    if (x0 < ZONA.x0) keluar.push("kiri");
    if (x1 > ZONA.x1) keluar.push("kanan");
    if (y0 < ZONA.y0) keluar.push("atas");
    if (y1 > ZONA.y1) keluar.push("bawah");
    if (keluar.length) {
      const r = Math.round;
      hasil.push({ sumber: o.userData.nama, kotak: { x0: r(x0), y0: r(y0), x1: r(x1), y1: r(y1) }, zona: { ...ZONA }, keluar });
    }
  }
  return hasil;
}

const peristiwa = () => [
  { t: 0.0, jenis: "muncul", x: 0.36, kuat: 0.8, durasi: 0, nada: 0, sumber: "kotak" },
  { t: 0.8, jenis: "menyala", x: 0.62, kuat: 0.6, durasi: 0, nada: 0, sumber: "bola" },
  { t: 1.5, jenis: "menyala", x: 0.5, kuat: 0.6, durasi: 0, nada: 1, sumber: "tabung" },
  { t: 2.3, jenis: "whoosh", x: 0.7, kuat: 0.7, durasi: 0, nada: 0, sumber: "pelari" },
  { t: 3.5, jenis: "whoosh", x: 0.7, kuat: 0.5, durasi: 0, nada: 0, sumber: "pelari" },
  { t: 3.9, jenis: "denting", x: 0.5, kuat: 0.8, durasi: 0, nada: 0, sumber: "pelari" },
];

// ---------------------------------------------------------------- kontrak halaman
window.DURASI = DURASI;
window.FPS = FPS;
window.UKURAN = UKURAN;
window.tampilkan = tampilkan;
window.KIT = { versi: "uji", peristiwa, periksaZona, titikPeriksa: [0.2, 0.7, 1.2, 1.7, 2.2, 2.7, 3.2, 3.7] };
window.siap = document.fonts.ready.then(() => tampilkan(0));

const prm = new URLSearchParams(location.search);
if (!prm.has("rekam")) {
  window.siap.then(() => {
    if (prm.has("t")) return tampilkan(Number(prm.get("t")));
    const mulai = performance.now();
    const putar = () => { tampilkan(((performance.now() - mulai) / 1000) % DURASI); requestAnimationFrame(putar); };
    requestAnimationFrame(putar);
  });
}
