// Reels 30 detik: cara mengisi kuis "Seberapa Evidence Komisariatmu?".
// Semua keadaan dihitung dari t (detik). Lihat animasi/README.md untuk kontraknya.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

const LEBAR = 1080;
const TINGGI = 1920;
const DURASI = 30;
const DEG = Math.PI / 180;

// ---------------------------------------------------------------- bantuan
const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const campur = (a, b, k) => a + (b - a) * k;
const rentang = (t, a, b) => klem((t - a) / (b - a));
const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
const halus2 = (x) => { x = klem(x); return x * x * x * (x * (x * 6 - 15) + 10); };
const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
const masukKeluar3 = (x) => { x = klem(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lenting = (x, s = 1.7) => { x = klem(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const warna = (css) => new THREE.Color(css);
const $ = (id) => document.getElementById(id);

function acak(benih) { // mulberry32: acak berbenih, hasilnya selalu sama
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = {
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
  hitam: new THREE.Color(0, 0, 0),
};

// ---------------------------------------------------------------- data kuis (contoh)
const KELOMPOK = [
  { nama: "Kaderisasi", skor: [2, 2, 2, 2, 1] },
  { nama: "Tata Kelola", skor: [2, 2, 2, 2] },
  { nama: "Pengetahuan", skor: [2, 1, 2] },
  { nama: "Target Program", skor: [3, 2, 2] },
  { nama: "Evaluasi dan Arsip", skor: [2, 2, 2] },
  { nama: "Data dan Jaringan", skor: [2, 1] },
];
const TINGKAT = [
  { nama: "Titik Berangkat", rentang: "0–15", min: 0 },
  { nama: "Mulai Mencatat", rentang: "16–30", min: 16 },
  { nama: "Mulai Membaca Bukti", rentang: "31–45", min: 31 },
  { nama: "Bukti Menjadi Kebiasaan", rentang: "46–60", min: 46 },
];
const SKOR_AKHIR = 38;
const ANGKA = [
  { nilai: 40, teks: "peserta LK 1", nyata: false },
  { nilai: 26, teks: "masih aktif", nyata: true },
  { nilai: 12, teks: "direncanakan", nyata: false },
  { nilai: 9, teks: "terlaksana", nyata: true },
];

// ---------------------------------------------------------------- linimasa
const LANGKAH = [[3, 7], [7, 17], [17, 21], [21, 24], [24, 28]];
const KETERANGAN = [[0, 3], [3, 7], [7, 17], [17, 21], [21, 24], [24, 28], [28, 31]];
const HALAMAN = [[-1, 17.05], [17.05, 21.0], [21.0, 24.15], [24.15, 31]];
const T_JAWAB = 7.0;      // lompatan pertama ke petak 1
const JEDA_JAWAB = 0.5;   // satu pertanyaan tiap 0,5 detik
const LAMA_LOMPAT = 0.34;
const T_KLIK = 4.95;      // "Mulai kuis" ditekan
const T_MUNCUL = 5.2;     // kubus emas muncul
const T_MENARA = [24.55, 27.0];
const T_LK = [[17.45, 17.7], [19.05, 19.3]]; // [lepas dari J, tiba di simpul pertama] tiap cabang
const JEDA_LK = 0.3;
const T_PILAR = [21.85, 22.1, 22.35, 22.6];
const LAMA_PILAR = 0.55;

// ---------------------------------------------------------------- renderer
const kanvas = $("kanvas");
const renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(LEBAR, TINGGI, false);
renderer.setClearColor(W.latar, 1);
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = W.latar.clone();
const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);

const rt = new THREE.WebGLRenderTarget(LEBAR, TINGGI, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(1);
composer.setSize(LEBAR, TINGGI);
composer.addPass(new RenderPass(scene, kamera));
const bloom = new UnrealBloomPass(new THREE.Vector2(LEBAR, TINGGI), 0.55, 0.5, 0.72);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- cahaya
const ARAH_CAHAYA = new THREE.Vector3(-0.32, 1, 0.78).normalize();
const hemi = new THREE.HemisphereLight(warna("hsl(150, 30%, 70%)"), warna("hsl(153, 50%, 6%)"), 1.9);
scene.add(hemi);
const matahari = new THREE.DirectionalLight(warna("hsl(45, 40%, 96%)"), 3.4);
matahari.castShadow = true;
matahari.shadow.mapSize.set(2048, 2048);
matahari.shadow.camera.left = -16;
matahari.shadow.camera.right = 16;
matahari.shadow.camera.top = 16;
matahari.shadow.camera.bottom = -16;
matahari.shadow.camera.near = 1;
matahari.shadow.camera.far = 90;
matahari.shadow.bias = -0.0006;
matahari.shadow.normalBias = 0.02;
scene.add(matahari, matahari.target);

// ---------------------------------------------------------------- bahan dan bentuk umum
function bahan(c, opsi = {}) {
  return new THREE.MeshStandardMaterial({ color: c.clone(), roughness: 0.62, metalness: 0.05, emissive: new THREE.Color(0, 0, 0), ...opsi });
}
function balok(w, h, d, r, mat) {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(g, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
function bahanGaris(c, lebar, opasitas = 1) {
  const m = new LineMaterial({ color: c.clone(), linewidth: lebar, transparent: true, opacity: opasitas, depthWrite: false });
  m.resolution.set(LEBAR, TINGGI);
  return m;
}
function garisPersegi(w, d, y, mat) {
  const a = w / 2, b = d / 2;
  const g = new LineSegmentsGeometry().setPositions([
    -a, y, -b, a, y, -b, a, y, -b, a, y, b, a, y, b, -a, y, b, -a, y, b, -a, y, -b,
  ]);
  return new LineSegments2(g, mat);
}
function garisBalok(w, h, d, mat) { // 12 rusuk balok, alas di y = 0
  const a = w / 2, b = d / 2;
  const p = [];
  const sudut = [[-a, -b], [a, -b], [a, b], [-a, b]];
  for (let i = 0; i < 4; i++) {
    const [x1, z1] = sudut[i];
    const [x2, z2] = sudut[(i + 1) % 4];
    p.push(x1, 0, z1, x2, 0, z2, x1, h, z1, x2, h, z2, x1, 0, z1, x1, h, z1);
  }
  return new LineSegments2(new LineSegmentsGeometry().setPositions(p), mat);
}
function teksturCahaya() { // titik cahaya bulat lembut untuk sprite
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
const TEKSTUR_CAHAYA = teksturCahaya();
function sprite(c, ukuran) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEKSTUR_CAHAYA, color: c.clone(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.setScalar(ukuran);
  return s;
}

// ---------------------------------------------------------------- tata letak dunia
// Kamera isometrik melihat dari (+x, +y, +z): sumbu +x tampak ke kanan-bawah, +z ke kiri-bawah.
// Jalur zig-zag x/z sehingga perjalanan kubus turun lurus di layar yang tegak.
const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);
const XZ = new THREE.Vector3(1, 0, 1);   // turun di layar
const XmZ = new THREE.Vector3(1, 0, -1); // ke kanan di layar
const S = 1.3;       // jarak antarpetak
const SUDUT = 1.45;  // belokan antarkelompok
const ATAS = 0.32;   // permukaan petak dan landasan
const KUBUS = 0.72;
const ARAH = [X, Z, X, Z, X, Z];

const GERBANG = new THREE.Vector3(0, 0, 0);
const jejak = [GERBANG.clone()];
const petak = [];
{
  let pertama = GERBANG.clone().addScaledVector(X, 2.2);
  let akhir = null;
  KELOMPOK.forEach((k, g) => {
    const d = ARAH[g];
    if (g > 0) {
      const belok = akhir.clone().addScaledVector(ARAH[g - 1], SUDUT);
      jejak.push(belok);
      pertama = belok.clone().addScaledVector(d, SUDUT);
    }
    k.skor.forEach((skor, i) => {
      const pos = pertama.clone().addScaledVector(d, S * i);
      petak.push({ pos, g, i, skor, ij: jejak.length });
      jejak.push(pos);
      akhir = pos;
    });
  });
}
const BELOK_J = petak[19].pos.clone().addScaledVector(Z, SUDUT);
jejak.push(BELOK_J);
const J = BELOK_J.clone().addScaledVector(X, SUDUT);
const B1 = J.clone().addScaledVector(XZ, 1.6);
const B2 = J.clone().addScaledVector(XZ, 3.2);
const B4 = J.clone().addScaledVector(XZ, 4.8);
const Q = J.clone().addScaledVector(XZ, 6.4);
const B3 = Q.clone().addScaledVector(XmZ, 1.8);
const T = Q.clone().addScaledVector(XmZ, 3.6);
const IJ = {};
for (const [n, p] of [["J", J], ["B1", B1], ["B2", B2], ["B4", B4], ["Q", Q], ["B3", B3], ["T", T]]) { IJ[n] = jejak.length; jejak.push(p); }
const jarakJejak = [0];
for (let i = 1; i < jejak.length; i++) jarakJejak.push(jarakJejak[i - 1] + jejak[i].distanceTo(jejak[i - 1]));
const PANJANG_JEJAK = jarakJejak[jarakJejak.length - 1];
function titikPadaJejak(d, out) {
  d = klem(d, 0, PANJANG_JEJAK);
  let i = 1;
  while (i < jejak.length - 1 && jarakJejak[i] < d) i++;
  const k = (d - jarakJejak[i - 1]) / (jarakJejak[i] - jarakJejak[i - 1] || 1);
  return out.copy(jejak[i - 1]).lerp(jejak[i], k);
}

// Cabang LK 2 (kiri, +z) dan LK 3 (kanan, +x) dari simpang J.
const LK_AWAL = 1.0, LK_JARAK = 0.62;
const CABANG = [Z, X].map((d) => Array.from({ length: 5 }, (_, k) => J.clone().addScaledVector(d, LK_AWAL + LK_JARAK * k)));
const PILAR_POS = [-1.75, -0.65, 0.65, 1.75].map((a) => Q.clone().addScaledVector(XZ, -0.95).addScaledVector(XmZ, a));
const PILAR_H = [2.2, 2.2 * 26 / 40, 2.2, 2.2 * 9 / 12];
const MENARA_H = 6.0; // setara skor 60
const tinggiSkor = (s) => (s / 60) * MENARA_H;

// ---------------------------------------------------------------- jadwal lompatan kubus
const lompatan = [];
function lompat(t0, dur, a, b, tinggi, ija, ijb) {
  lompatan.push({ t0, t1: t0 + dur, a, b, tinggi: tinggi ?? 0.45 + 0.2 * a.distanceTo(b), ija, ijb });
}
petak.forEach((p, i) => {
  const a = i === 0 ? GERBANG : petak[i - 1].pos;
  lompat(T_JAWAB + JEDA_JAWAB * i, LAMA_LOMPAT, a, p.pos, null, i === 0 ? 0 : petak[i - 1].ij, p.ij);
  p.tiba = T_JAWAB + JEDA_JAWAB * i + LAMA_LOMPAT;
});
lompat(17.0, 0.38, petak[19].pos, J, null, petak[19].ij, IJ.J);
petak.forEach((p, i) => { p.pergi = i < 19 ? petak[i + 1].tiba - LAMA_LOMPAT : 17.0; });
lompat(20.66, 0.27, J, B1, null, IJ.J, IJ.B1);
lompat(20.94, 0.27, B1, B2, null, IJ.B1, IJ.B2);
lompat(21.22, 0.27, B2, B4, null, IJ.B2, IJ.B4);
lompat(21.5, 0.3, B4, Q, null, IJ.B4, IJ.Q);
lompat(23.6, 0.3, Q, B3, null, IJ.Q, IJ.B3);
lompat(23.92, 0.34, B3, T, null, IJ.B3, IJ.T);
const T_PUNCAK = 27.25; // lompatan kecil di puncak menara
lompat(T_PUNCAK, 0.36, T, T, 0.55, IJ.T, IJ.T);

const tinggiMenara = (t) => tinggiSkor(SKOR_AKHIR) * masukKeluar3(rentang(t, T_MENARA[0], T_MENARA[1]));

function lompatanAktif(t) {
  let h = null;
  for (const l of lompatan) { if (l.t0 <= t) h = l; else break; }
  return h;
}
const _v = new THREE.Vector3();
// Posisi alas kubus (tanpa tinggi lompatan) untuk kamera.
function posisiDasar(t, out) {
  const l = lompatanAktif(t);
  if (!l) return out.copy(GERBANG);
  const u = klem((t - l.t0) / (l.t1 - l.t0));
  return out.copy(l.a).lerp(l.b, u);
}
function progresJejak(t) {
  const l = lompatanAktif(t);
  if (!l) return 0;
  const u = klem((t - l.t0) / (l.t1 - l.t0));
  return campur(jarakJejak[l.ija], jarakJejak[l.ijb], u);
}

// ---------------------------------------------------------------- tanah: papan gelap bergaris halus
const bahanTanah = new THREE.ShaderMaterial({
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
      vec2 p = vW.xz + vec2(0.35, 0.35);
      float kecil = garis(p, 1.1);
      float besar = garis(p / 5.0, 1.5);
      float d = length(vW.xz - uFokus.xz);
      float pudar = 1.0 - smoothstep(uJari * 0.3, uJari, d);
      vec3 c = mix(uLatar, uGaris, kecil * pudar);
      c = mix(c, uMayor, besar * pudar);
      gl_FragColor = vec4(c, 1.0);
    }`,
});
const tanah = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), bahanTanah);
tanah.rotation.x = -Math.PI / 2;
tanah.position.set(12, 0, 10);
scene.add(tanah);
const bayangan = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.ShadowMaterial({ color: warna("hsl(153, 60%, 2%)"), opacity: 0.55 }));
bayangan.rotation.x = -Math.PI / 2;
bayangan.position.set(12, 0.004, 10);
bayangan.receiveShadow = true;
scene.add(bayangan);

// ---------------------------------------------------------------- jejak (garis jalur yang menyala)
const bahanJejak = new THREE.MeshBasicMaterial({ color: W.zamrudRedup.clone().multiplyScalar(1.15) });
const bahanJejakTerang = new THREE.MeshBasicMaterial({ color: W.zamrudPijar.clone().multiplyScalar(1.6) });
const geoJejak = new THREE.BoxGeometry(1, 0.03, 0.085).translate(0.5, 0, 0);
const geoJejakTerang = new THREE.BoxGeometry(1, 0.04, 0.11).translate(0.5, 0, 0);
const ruasJejak = [];
for (let i = 0; i < jejak.length - 1; i++) {
  const a = jejak[i], b = jejak[i + 1];
  const pj = a.distanceTo(b);
  if (pj < 1e-6) continue;
  const sudut = -Math.atan2(b.z - a.z, b.x - a.x);
  const dasar = new THREE.Mesh(geoJejak, bahanJejak);
  const terang = new THREE.Mesh(geoJejakTerang, bahanJejakTerang);
  for (const m of [dasar, terang]) { m.position.set(a.x, 0.135, a.z); m.rotation.y = sudut; scene.add(m); }
  terang.position.y = 0.14;
  ruasJejak.push({ dasar, terang, d0: jarakJejak[i], pj });
}
const percik = new THREE.Group();
const percikInti = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshBasicMaterial({ color: W.emasPijar.clone().multiplyScalar(3) }));
const percikPijar = sprite(W.emas, 2.2);
percik.add(percikInti, percikPijar);
scene.add(percik);

// ---------------------------------------------------------------- gerbang /kuis
const WARNA_GERBANG = warna("hsl(153, 30%, 15%)");
const bahanGerbang = bahan(WARNA_GERBANG, { roughness: 0.45, metalness: 0.15 });
const gerbang = new THREE.Group();
{
  const tiangA = balok(0.32, 2.6, 0.32, 0.05, bahanGerbang);
  const tiangB = balok(0.32, 2.6, 0.32, 0.05, bahanGerbang);
  tiangA.position.set(0, 1.3, 1.02);
  tiangB.position.set(0, 1.3, -1.02);
  const ambang = balok(0.36, 0.36, 2.5, 0.05, bahanGerbang);
  ambang.position.set(0, 2.72, 0);
  gerbang.add(tiangA, tiangB, ambang);
}
scene.add(gerbang);
const landasanGerbang = balok(1.2, ATAS, 1.2, 0.05, bahan(W.petak));
landasanGerbang.position.set(0, ATAS / 2, 0);
scene.add(landasanGerbang);
const bahanPortal = new THREE.ShaderMaterial({
  uniforms: { uWarna: { value: W.emasPijar.clone() }, uKuat: { value: 0 } },
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform vec3 uWarna; uniform float uKuat; varying vec2 vUv;
    void main(){
      vec2 uv = clamp(vUv, 0.0, 1.0);
      float a = pow(1.0 - uv.y, 1.7) * 0.85 + 0.12;
      float tepi = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x);
      gl_FragColor = vec4(uWarna, a * tepi * uKuat);
    }`,
});
const portal = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 2.36), bahanPortal);
portal.rotation.y = Math.PI / 2;
portal.position.set(0, ATAS + 1.18, 0);
scene.add(portal);
const bahanSorot = new THREE.ShaderMaterial({
  uniforms: { uWarna: { value: W.emasPijar.clone() }, uKuat: { value: 0 } },
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform vec3 uWarna; uniform float uKuat; varying vec2 vUv;
    void main(){ float a = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 1.4); gl_FragColor = vec4(uWarna, a * uKuat); }`,
});
const sorot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 7, 40, 1, true), bahanSorot);
sorot.position.set(0, ATAS + 3.5, 0);
scene.add(sorot);

// ---------------------------------------------------------------- pelat kelompok dan petak
const pelat = [];
KELOMPOK.forEach((k, g) => {
  const ps = petak.filter((p) => p.g === g);
  const a = ps[0].pos, b = ps[ps.length - 1].pos;
  const panjang = a.distanceTo(b) + 1.36;
  const sepanjangX = ARAH[g] === X;
  const w = sepanjangX ? panjang : 1.46, d = sepanjangX ? 1.46 : panjang;
  const m = balok(w, 0.12, d, 0.04, bahan(W.pelat, { roughness: 0.8 }));
  const tengah = a.clone().add(b).multiplyScalar(0.5);
  m.position.set(tengah.x, 0.06, tengah.z);
  scene.add(m);
  const garis = garisPersegi(w + 0.06, d + 0.06, 0.125, bahanGaris(W.zamrud, 2.2, 0));
  garis.position.set(tengah.x, 0, tengah.z);
  scene.add(garis);
  pelat.push({ m, garis, tengah, g, ps });
});
const geoPetak = new RoundedBoxGeometry(0.95, 0.2, 0.95, 3, 0.05);
for (const p of petak) {
  const m = new THREE.Mesh(geoPetak, bahan(W.petak, { roughness: 0.55 }));
  m.castShadow = true;
  m.receiveShadow = true;
  m.position.set(p.pos.x, 0.12 + 0.1, p.pos.z);
  scene.add(m);
  p.m = m;
}

// ---------------------------------------------------------------- simpang, batu, pelataran, cabang
function landasanBulat(pos, r) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, ATAS, 48), bahan(W.petak, { roughness: 0.55 }));
  m.castShadow = true;
  m.receiveShadow = true;
  m.position.set(pos.x, ATAS / 2, pos.z);
  scene.add(m);
  return m;
}
const landasanJ = landasanBulat(J, 0.72);
const landasanQ = landasanBulat(Q, 0.66);
const batu = [B1, B2, B3, B4].map((p) => {
  const m = balok(0.8, ATAS, 0.8, 0.05, bahan(W.petak, { roughness: 0.55 }));
  m.position.set(p.x, ATAS / 2, p.z);
  scene.add(m);
  return m;
});

const cabang = CABANG.map((simpul, c) => {
  const arah = c === 0 ? Z : X;
  const garisPutus = [];
  const ujung = LK_AWAL + LK_JARAK * 4;
  const geo = new THREE.BoxGeometry(0.2, 0.03, 0.08);
  if (arah === Z) geo.rotateY(Math.PI / 2);
  for (let s = 0.74; s < ujung - 0.1; s += 0.31) {
    const m = new THREE.Mesh(geo, bahanJejak);
    m.position.copy(J).addScaledVector(arah, s + 0.1);
    m.position.y = 0.06;
    scene.add(m);
    garisPutus.push({ m, s: s + 0.1 });
  }
  const node = simpul.map((p) => {
    const m = balok(0.44, 0.18, 0.44, 0.05, bahan(W.petak, { roughness: 0.5 }));
    m.position.set(p.x, 0.09, p.z);
    m.scale.setScalar(0.001);
    scene.add(m);
    return m;
  });
  const titik = new THREE.Group();
  titik.add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), new THREE.MeshBasicMaterial({ color: W.emasPijar.clone().multiplyScalar(3) })), sprite(W.emas, 1.5));
  titik.visible = false;
  scene.add(titik);
  return { arah, garisPutus, node, titik, simpul, ujung };
});

// ---------------------------------------------------------------- pilar angka
const pilar = PILAR_POS.map((p, i) => {
  const soket = balok(0.92, 0.06, 0.92, 0.02, bahan(W.pelat, { roughness: 0.8 }));
  soket.position.set(p.x, 0.03, p.z);
  scene.add(soket);
  const nyata = ANGKA[i].nyata;
  const mat = nyata
    ? bahan(W.zamrud, { emissive: W.zamrudPijar.clone(), emissiveIntensity: 0.55, roughness: 0.45 })
    : bahan(warna("hsl(153, 40%, 22%)"), { emissive: W.zamrudRedup.clone(), emissiveIntensity: 0.25, roughness: 0.6 });
  const m = balok(0.7, 1, 0.7, 0, mat);
  m.geometry.translate(0, 0.5, 0);
  m.position.set(p.x, 0.06, p.z);
  m.scale.set(1, 0.001, 1);
  scene.add(m);
  const tepi = garisBalok(0.72, 1, 0.72, bahanGaris(nyata ? W.zamrudPijar.clone().multiplyScalar(1.4) : W.zamrud, 2, 0));
  tepi.position.set(p.x, 0.06, p.z);
  tepi.scale.set(1, 0.001, 1);
  scene.add(tepi);
  return { m, tepi, p, h: PILAR_H[i] };
});

// ---------------------------------------------------------------- menara hasil dan 4 pita tingkat
const landasanT = balok(1.5, ATAS, 1.5, 0.05, bahan(W.petak, { roughness: 0.55 }));
landasanT.position.set(T.x, ATAS / 2, T.z);
scene.add(landasanT);
const bahanMenara = bahan(W.zamrud, { emissive: W.zamrudPijar.clone(), emissiveIntensity: 0.5, roughness: 0.4 });
const menara = balok(1.0, 1, 1.0, 0, bahanMenara);
menara.geometry.translate(0, 0.5, 0);
menara.position.set(T.x, ATAS, T.z);
menara.scale.set(1, 0.001, 1);
scene.add(menara);
const TINGGI_PITA = MENARA_H / 4;
const pita = TINGKAT.map((_, k) => {
  const h = TINGGI_PITA - 0.1;
  const y0 = ATAS + k * TINGGI_PITA + 0.05;
  const isiMat = new THREE.MeshBasicMaterial({ color: W.zamrud.clone(), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const isi = new THREE.Mesh(new THREE.BoxGeometry(1.7, h, 1.7).translate(0, h / 2, 0), isiMat);
  isi.position.set(T.x, y0, T.z);
  scene.add(isi);
  const tepi = garisBalok(1.72, h, 1.72, bahanGaris(W.zamrud, 2.2, 0));
  tepi.position.set(T.x, y0, T.z);
  scene.add(tepi);
  return { isi, tepi, y0, h };
});

// ---------------------------------------------------------------- kubus komisariat
const kubus = new THREE.Group();
const bahanKubus = bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0.08, roughness: 0.36, metalness: 0.2 });
const badanKubus = balok(KUBUS, KUBUS, KUBUS, 0.08, bahanKubus);
kubus.add(badanKubus);
const lampuKubus = new THREE.PointLight(W.emasPijar.clone(), 0, 5, 2);
lampuKubus.position.set(0, 0.34, 0); // di dalam kubus: menerangi petak sekitar, bukan muka kubus sendiri
kubus.add(lampuKubus);
scene.add(kubus);

// Riak cincin saat mendarat atau saat simpul menyala.
const geoRiak = new THREE.RingGeometry(0.52, 0.6, 56).rotateX(-Math.PI / 2);
const kolamRiak = Array.from({ length: 4 }, () => {
  const m = new THREE.Mesh(geoRiak, new THREE.MeshBasicMaterial({ color: W.emasPijar.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.visible = false;
  scene.add(m);
  return m;
});
const riak = []; // {t, pos, y, skala, warna}
riak.push({ t: T_MUNCUL + 0.2, pos: GERBANG, y: ATAS + 0.01, skala: 1.3, warna: W.emasPijar });
petak.forEach((p) => riak.push({ t: p.tiba, pos: p.pos, y: ATAS + 0.01, skala: 1.0, warna: W.emasPijar }));
for (const l of lompatan.slice(20)) if (l.a !== l.b) riak.push({ t: l.t1, pos: l.b, y: ATAS + 0.01, skala: 1.1, warna: W.emasPijar });
CABANG.forEach((simpul, c) => simpul.forEach((p, k) => riak.push({ t: T_LK[c][1] + JEDA_LK * k, pos: p, y: 0.19, skala: 0.62, warna: W.zamrudPijar })));
riak.push({ t: T_MENARA[1], pos: T, y: -1, skala: 1.6, warna: W.emasPijar });
riak.sort((a, b) => a.t - b.t);

// ---------------------------------------------------------------- debu cahaya
let bahanDebu;
{
  const n = 170;
  const r = acak(7);
  const pos = new Float32Array(n * 3), aAcak = new Float32Array(n), aUkuran = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = -6 + r() * 36;
    pos[i * 3 + 1] = r() * 5;
    pos[i * 3 + 2] = -6 + r() * 32;
    aAcak[i] = r();
    aUkuran[i] = 3 + r() * 5;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aAcak", new THREE.BufferAttribute(aAcak, 1));
  g.setAttribute("aUkuran", new THREE.BufferAttribute(aUkuran, 1));
  bahanDebu = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uSkala: { value: 1 }, uEmas: { value: W.emas.clone() }, uHijau: { value: W.zamrudPijar.clone() } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uT; uniform float uSkala; attribute float aAcak; attribute float aUkuran;
      varying float vA; varying float vC;
      void main(){
        vec3 p = position;
        float naik = mod(p.y + uT * (0.16 + 0.14 * aAcak), 5.0);
        p.y = 0.2 + naik;
        p.x += sin(uT * 0.45 + aAcak * 6.2832) * 0.4;
        p.z += cos(uT * 0.38 + aAcak * 9.0) * 0.4;
        vA = smoothstep(0.0, 0.9, naik) * (1.0 - smoothstep(3.6, 5.0, naik));
        vC = aAcak;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aUkuran * uSkala;
      }`,
    fragmentShader: `
      uniform vec3 uEmas; uniform vec3 uHijau; varying float vA; varying float vC;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = 1.0 - smoothstep(0.0, 0.5, d);
        gl_FragColor = vec4(mix(uHijau, uEmas, step(0.55, vC)), a * vA * 0.55);
      }`,
  });
  scene.add(new THREE.Points(g, bahanDebu));
}

// ---------------------------------------------------------------- kamera
const ISO = Math.atan(1 / Math.SQRT2) / DEG; // 35,26°
function fokusIkut(t) {
  // Rata-rata berbobot posisi kubus di sekitar t: geser datar lebih tenang daripada geser turun.
  let su = 0, wu = 0, sv = 0, wv = 0;
  for (let k = -10; k <= 10; k++) {
    const dt = k * 0.12;
    posisiDasar(t + dt, _v);
    const u = _v.x - _v.z, v = _v.x + _v.z;
    const gu = Math.exp(-(dt * dt) / (2 * 0.6 * 0.6));
    const gv = Math.exp(-(dt * dt) / (2 * 0.3 * 0.3));
    su += u * gu; wu += gu; sv += v * gv; wv += gv;
  }
  const u = su / wu, v = sv / wv;
  return { x: (u + v) / 2, y: 0, z: (v - u) / 2 };
}
const keadaan = (f, H, el, az, ax, ay) => ({ fx: f.x, fy: f.y, fz: f.z, H, el, az, ax, ay });
const AWAL = petak[6].pos;
const FASE_KAMERA = [
  { t: 0, d: 1, f: (t) => keadaan({ x: AWAL.x - 3.0, y: 0, z: AWAL.z - 2.8 }, campur(29, 25, rentang(t, 0, 2)), campur(64, 54, rentang(t, 0, 2)), campur(24, 33, rentang(t, 0, 2)), 520, 900) },
  { t: 1.35, d: 1.85, f: () => keadaan(GERBANG, 14, ISO, 45, 690, 1078) },
  { t: 6.3, d: 1.05, f: (t) => keadaan(fokusIkut(t), 15.5, ISO, 45, 510, 965) },
  { t: 16.85, d: 1.0, f: () => keadaan(J.clone().addScaledVector(XZ, 0.95), 17, ISO, 45, 500, 880) },
  { t: 20.7, d: 0.95, f: () => keadaan(Q, 16, ISO, 45, 500, 1110) },
  { t: 23.5, d: 1.05, f: () => keadaan(T, 22.5, ISO, 45, 372, 1088) },
  { t: 27.85, d: 2.0, f: (t) => keadaan({ x: Q.x - 3.2, y: 0.6, z: Q.z - 5.6 }, campur(33, 36, rentang(t, 28, 30)), 41, 47, 520, 905) },
];
function keadaanKamera(t) {
  let s = FASE_KAMERA[0].f(t);
  for (let i = 1; i < FASE_KAMERA.length; i++) {
    const fz = FASE_KAMERA[i];
    if (t <= fz.t) break;
    const w = halus2((t - fz.t) / fz.d);
    const b = fz.f(t);
    for (const k in s) s[k] = campur(s[k], b[k], w);
  }
  return s;
}
const _arah = new THREE.Vector3();
function aturKamera(s) {
  const el = s.el * DEG, az = s.az * DEG;
  _arah.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
  kamera.position.set(s.fx, s.fy, s.fz).addScaledVector(_arah, 120);
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

// ---------------------------------------------------------------- dunia pada detik t
const _c = new THREE.Color();
const _c2 = new THREE.Color();
const _sumbu = new THREE.Vector3();
const _q = new THREE.Quaternion();
const NAIK = new THREE.Vector3(0, 1, 0);

function tampakkanDunia(t, kam) {
  // Cahaya dan bayangan mengikuti fokus kamera.
  matahari.target.position.set(kam.fx, 0, kam.fz);
  matahari.position.set(kam.fx, 0, kam.fz).addScaledVector(ARAH_CAHAYA, 40);
  matahari.target.updateMatrixWorld();
  bahanTanah.uniforms.uFokus.value.set(kam.fx, 0, kam.fz);
  bahanTanah.uniforms.uJari.value = kam.H * 1.05;
  bahanDebu.uniforms.uT.value = t;
  bahanDebu.uniforms.uSkala.value = klem(15 / kam.H, 0.45, 1.3);

  // Jalur menyala saat pembukaan, lalu bagian yang sudah dilewati kubus menjadi terang.
  const R = PANJANG_JEJAK * halus2(rentang(t, 0.35, 2.55));
  const prog = progresJejak(t);
  for (const r of ruasJejak) {
    const a = klem((R - r.d0) / r.pj);
    r.dasar.visible = a > 0;
    r.dasar.scale.x = Math.max(a, 0.001) * r.pj;
    const b = klem((prog - r.d0) / r.pj);
    r.terang.visible = b > 0;
    r.terang.scale.x = Math.max(b, 0.001) * r.pj;
  }
  const kuatPercik = rentang(t, 0.3, 0.5) * (1 - rentang(t, 2.4, 2.7));
  percik.visible = kuatPercik > 0;
  if (percik.visible) {
    titikPadaJejak(R, percik.position);
    percik.position.y = 0.2;
    percikPijar.material.opacity = kuatPercik;
    percikInti.scale.setScalar(kuatPercik);
  }
  const pudarBuka = 1 - halus(rentang(t, 2.7, 3.5));

  // Gerbang /kuis menyala, kilat saat "Mulai kuis" ditekan.
  const nyalaGerbang = halus(rentang(t, 3.2, 3.8));
  const kilat = t > T_KLIK ? Math.exp(-(t - T_KLIK) * 3.2) : 0;
  bahanGerbang.emissive.copy(W.emasPijar);
  bahanGerbang.emissiveIntensity = 0.02 + nyalaGerbang * 0.16 + kilat * 0.3;
  bahanGerbang.color.copy(WARNA_GERBANG).lerp(W.emas, nyalaGerbang * 0.45);
  bahanPortal.uniforms.uKuat.value = nyalaGerbang * (0.22 + 0.5 * kilat) * (1 - 0.5 * rentang(t, 7, 8));
  const sorotan = rentang(t, T_MUNCUL - 0.1, T_MUNCUL + 0.1) * (1 - rentang(t, T_MUNCUL + 0.35, T_MUNCUL + 0.95));
  sorot.visible = sorotan > 0;
  bahanSorot.uniforms.uKuat.value = sorotan * 0.55;
  sorot.scale.set(0.6 + 0.4 * sorotan, 1, 0.6 + 0.4 * sorotan);
  landasanGerbang.material.emissive.copy(W.emasPijar);
  landasanGerbang.material.emissiveIntensity = nyalaGerbang * 0.12 + kilat * 0.45;

  // Petak: gelap → emas (sedang dijawab) → zamrud (sudah dijawab).
  for (const p of petak) {
    const m = p.m.material;
    const aktif = halus(rentang(t, p.tiba - 0.02, p.tiba + 0.06));
    const selesai = halus(rentang(t, p.pergi, p.pergi + 0.3));
    m.color.copy(W.petak).lerp(W.emas, aktif).lerp(W.zamrud, selesai);
    const sapu = Math.max(0, R - jarakJejak[p.ij]);
    const sapuan = R >= jarakJejak[p.ij] ? (0.32 + 0.68 * Math.exp(-sapu / 2.5)) * pudarBuka : 0;
    const kejut = t >= p.tiba ? Math.exp(-(t - p.tiba) * 7) : 0;
    _c.copy(W.zamrudPijar).multiplyScalar(sapuan * 0.9);
    _c2.copy(W.emasPijar).multiplyScalar(aktif * (1 - selesai) * (0.28 + 0.55 * kejut));
    _c.add(_c2);
    _c2.copy(W.zamrudPijar).multiplyScalar(selesai * (0.42 + 0.12 * p.skor));
    m.emissive.copy(_c.add(_c2));
    m.emissiveIntensity = 1;
    p.m.position.y = 0.22 - 0.035 * kejut;
  }
  // Garis tepi pelat: redup setelah jalur menyala, emas saat kelompok aktif, zamrud saat selesai.
  for (const pl of pelat) {
    const awal = pl.ps[0], akhir = pl.ps[pl.ps.length - 1];
    const terungkap = R >= jarakJejak[awal.ij] ? 1 : 0;
    const aktif = jendelaLangkah(t, awal.tiba - 0.35, akhir.pergi + 0.05, 0.25, 0.3);
    const selesai = halus(rentang(t, akhir.pergi, akhir.pergi + 0.4));
    const mat = pl.garis.material;
    mat.color.copy(W.zamrud).lerp(W.emasPijar, aktif).lerp(W.zamrudPijar, selesai * (1 - aktif));
    mat.opacity = terungkap * 0.4 + aktif * 0.6 + selesai * 0.35;
  }

  // Simpang J, batu, pelataran: menyala setelah dilewati.
  const nyalaTempat = (m, tTiba) => {
    const k = halus(rentang(t, tTiba, tTiba + 0.25));
    const kejut = t >= tTiba ? Math.exp(-(t - tTiba) * 6) : 0;
    m.material.color.copy(W.petak).lerp(W.zamrud, k * 0.8);
    m.material.emissive.copy(W.zamrudPijar).multiplyScalar(k * 0.4 + kejut * 0.9);
  };
  nyalaTempat(landasanJ, 17.38);
  nyalaTempat(batu[0], 20.93);
  nyalaTempat(batu[1], 21.21);
  nyalaTempat(batu[3], 21.49);
  nyalaTempat(landasanQ, 21.8);
  nyalaTempat(batu[2], 23.9);
  nyalaTempat(landasanT, 24.26);

  // Cabang LK 2 / LK 3: garis putus-putus tumbuh, titik cahaya menyalakan 5 simpul tiap cabang.
  const tumbuh = halus(rentang(t, 17.1, 17.75));
  cabang.forEach((cb, c) => {
    const [tLepas, tTiba] = T_LK[c];
    const tAkhir = tTiba + JEDA_LK * 4;
    // Jarak titik cahaya di sepanjang cabang.
    let jarak = -1;
    if (t >= tLepas && t < tAkhir + 0.35) {
      if (t < tTiba) jarak = campur(0.4, LK_AWAL, halus(rentang(t, tLepas, tTiba)));
      else {
        const k = Math.min(4, Math.floor((t - tTiba) / JEDA_LK));
        const u = halus(rentang(t - tTiba - k * JEDA_LK, 0, JEDA_LK * 0.7));
        jarak = LK_AWAL + LK_JARAK * (k + (k < 4 ? u : 0));
      }
    }
    for (const gp of cb.garisPutus) {
      gp.m.visible = gp.s / cb.ujung <= tumbuh * 1.02 && tumbuh > 0;
      gp.m.material = t >= tLepas && jarak >= gp.s ? bahanJejakTerang : (t >= tAkhir ? bahanJejakTerang : bahanJejak);
    }
    cb.node.forEach((m, k) => {
      const muncul = lenting(rentang(t, 17.2 + k * 0.07 + c * 0.05, 17.55 + k * 0.07 + c * 0.05));
      m.scale.setScalar(Math.max(0.001, muncul));
      const tNyala = tTiba + JEDA_LK * k;
      const nyala = halus(rentang(t, tNyala, tNyala + 0.12));
      const kejut = t >= tNyala ? Math.exp(-(t - tNyala) * 6) : 0;
      m.material.color.copy(W.petak).lerp(W.zamrud, nyala);
      m.material.emissive.copy(W.zamrudPijar).multiplyScalar(nyala * 0.6 + kejut * 1.4);
      m.position.y = 0.09 + 0.12 * kejut;
    });
    cb.titik.visible = jarak >= 0;
    if (cb.titik.visible) {
      cb.titik.position.copy(J).addScaledVector(cb.arah, jarak);
      cb.titik.position.y = 0.32 + 0.1 * Math.sin(t * 20);
      cb.titik.children[1].material.opacity = 1 - rentang(t, tAkhir + 0.1, tAkhir + 0.35);
    }
  });

  // Pilar angka naik bergantian.
  pilar.forEach((pl, i) => {
    const k = lenting(rentang(t, T_PILAR[i], T_PILAR[i] + LAMA_PILAR), 1.4);
    const h = Math.max(0.001, pl.h * k);
    pl.m.scale.y = h;
    pl.tepi.scale.y = h;
    pl.m.visible = k > 0.002;
    pl.tepi.visible = pl.m.visible;
    pl.tepi.material.opacity = halus(rentang(t, T_PILAR[i], T_PILAR[i] + 0.3)) * 0.9;
  });

  // Menara naik melewati 4 pita tingkat.
  const hMenara = tinggiMenara(t);
  menara.scale.y = Math.max(0.001, hMenara);
  menara.visible = hMenara > 0.002;
  const tampakPita = halus(rentang(t, 23.75, 24.45));
  const akhirMenara = t >= T_MENARA[1] ? Math.exp(-(t - T_MENARA[1]) * 2.2) : 0;
  pita.forEach((p, k) => {
    const dilewati = halus(klem((ATAS + hMenara - p.y0) / 0.35));
    const sasaran = k === 2;
    const di = sasaran ? halus(rentang(t, T_MENARA[1] - 0.6, T_MENARA[1])) : 0;
    const warnaTepi = _c.copy(W.zamrud).lerp(W.zamrudPijar, dilewati).lerp(W.emasPijar, di);
    p.tepi.material.color.copy(warnaTepi);
    p.tepi.material.opacity = tampakPita * (0.35 + 0.5 * dilewati + 0.3 * di);
    p.isi.material.color.copy(sasaran && di > 0 ? W.emas : W.zamrud);
    p.isi.material.opacity = tampakPita * (0.025 + 0.06 * dilewati + 0.1 * di + 0.12 * akhirMenara * (sasaran ? 1 : 0));
    p.isi.visible = tampakPita > 0;
    p.tepi.visible = tampakPita > 0;
  });
  bahanMenara.emissiveIntensity = 0.45 + 0.5 * akhirMenara;

  // Kubus komisariat: muncul di gerbang, melompat, memantul.
  const muncul = lenting(rentang(t, T_MUNCUL, T_MUNCUL + 0.45), 2.0);
  kubus.visible = muncul > 0.001;
  lampuKubus.intensity = 4 * muncul;
  const l = lompatanAktif(t);
  let sy = 1, sxz = 1, putar = 0;
  _sumbu.set(1, 0, 0);
  let miring = 0;
  if (!l) {
    kubus.position.set(GERBANG.x, ATAS, GERBANG.z);
    putar = (1 - halus(rentang(t, T_MUNCUL, T_MUNCUL + 0.6))) * Math.PI * 0.75;
    const hidup = Math.sin(t * 5.2) * 0.02 * rentang(t, 5.9, 6.3);
    sy = 1 + hidup;
  } else {
    const u = klem((t - l.t0) / (l.t1 - l.t0));
    const dasarY = ATAS + (l.b === T ? hMenara : 0);
    if (t < l.t1) {
      kubus.position.copy(l.a).lerp(l.b, u);
      kubus.position.y = (l.a === T ? ATAS + hMenara : ATAS) + 4 * l.tinggi * u * (1 - u);
      const regang = Math.sin(Math.PI * u);
      sy = 1 + 0.13 * regang;
      sxz = 1 - 0.06 * regang;
      _v.copy(l.b).sub(l.a).setY(0);
      if (_v.lengthSq() > 1e-6) { _sumbu.crossVectors(NAIK, _v.normalize()); miring = 0.2 * regang; }
    } else {
      kubus.position.set(l.b.x, dasarY, l.b.z);
      const dt = t - l.t1;
      const pegas = Math.exp(-dt * 13) * Math.cos(dt * 26);
      sy = 1 - 0.24 * pegas;
      sxz = 1 + 0.12 * pegas;
    }
  }
  // Ancang-ancang sebelum lompatan berikutnya, dan denyut saat melepas titik cahaya LK.
  const berikut = lompatan.find((x) => x.t0 > t);
  if (berikut && berikut.t0 - t < 0.1) { const k = 1 - (berikut.t0 - t) / 0.1; sy *= 1 - 0.12 * k; sxz *= 1 + 0.06 * k; }
  for (const [tl] of T_LK) if (t >= tl - 0.1 && t < tl + 0.35) {
    const dt = t - tl;
    const k = dt < 0 ? -dt / 0.1 : Math.exp(-dt * 10) * Math.cos(dt * 22);
    sy *= 1 - 0.12 * k;
  }
  badanKubus.scale.set(sxz * muncul, sy * muncul, sxz * muncul);
  badanKubus.position.y = (KUBUS / 2) * sy * muncul;
  badanKubus.rotation.y = putar;
  _q.setFromAxisAngle(_sumbu, miring);
  kubus.quaternion.copy(_q);
  bahanKubus.emissiveIntensity = 0.08 + 0.35 * (t >= T_MENARA[1] ? Math.exp(-(t - T_MENARA[1]) * 2) : 0) + 0.25 * Math.exp(-Math.abs(t - T_MUNCUL - 0.3) * 4);

  // Riak cincin.
  let slot = 0;
  for (const m of kolamRiak) m.visible = false;
  for (const r of riak) {
    const dt = t - r.t;
    if (dt < 0 || dt > 0.7 || slot >= kolamRiak.length) continue;
    const m = kolamRiak[slot++];
    m.visible = true;
    const k = keluar3(dt / 0.7);
    m.scale.setScalar(r.skala * (1 + 0.9 * k));
    m.position.set(r.pos.x, r.y < 0 ? ATAS + hMenara + 0.01 : r.y, r.pos.z);
    m.material.color.copy(r.warna).multiplyScalar(1.6);
    m.material.opacity = 0.95 * (1 - k);
  }
}

function jendelaLangkah(t, a, b, masuk, keluar) {
  return Math.min(halus((t - a) / masuk), halus((b - t) / keluar));
}

// ---------------------------------------------------------------- teks: label 3D
const lapisan = $("label3d");
function buatLabel(kelas, html) {
  const el = document.createElement("div");
  el.className = "lbl " + kelas;
  el.innerHTML = html;
  lapisan.appendChild(el);
  return el;
}
const _p = new THREE.Vector3();
let batasBawahLabel = 1150;
// Letakkan label pada titik dunia. ax/ay: titik jangkar label (0..1). Label memudar di luar zona aman.
function taruh(el, pos, opasitas, { dx = 0, dy = 0, ax = 0.5, ay = 1, skala = 1, jepit = false } = {}) {
  if (opasitas <= 0.001) { el.style.opacity = "0"; return; }
  _p.copy(pos).project(kamera);
  const w = el.offsetWidth, h = el.offsetHeight;
  let x = (_p.x + 1) / 2 * LEBAR + dx - w * ax;
  const y = (1 - _p.y) / 2 * TINGGI + dy - h * ay;
  if (jepit) x = klem(x, 80, 920 - w);
  let f = halus((y - 640) / 26) * halus((batasBawahLabel - (y + h)) / 26);
  f *= halus((x - 62) / 16) * halus((938 - (x + w)) / 16);
  el.style.opacity = String(opasitas * f);
  el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${skala.toFixed(3)})`;
}

const lblGerbang = buatLabel("lbl-gerbang", "/kuis");
const lblKubus = buatLabel("lbl-tag", "<span>komisariatmu</span>");
const lblKelompok = KELOMPOK.map((k, g) => buatLabel("lbl-kelompok", `<span class="no">${g + 1}/6</span>${k.nama}<span class="jml">${k.skor.length} soal</span>`));
const lblPoin = petak.map((p) => buatLabel("lbl-poin", `+${p.skor}`));
const lblCabang = ["LK 2", "LK 3"].map((n) => buatLabel("lbl-cabang", `${n}<small>5 soal</small>`));
const lblPilar = ANGKA.map((a) => buatLabel("lbl-pilar" + (a.nyata ? " nyata" : ""), `<b>0</b><span>${a.teks}</span>`));
const lblTingkat = TINGKAT.map((k) => buatLabel("lbl-tingkat", `<span>${k.nama}</span><i>${k.rentang}</i>`));

function tampakkanLabel(t) {
  batasBawahLabel = t < 27.9 ? 1146 : campur(1146, 1220, rentang(t, 27.9, 28.4));
  // Gerbang /kuis.
  const aGerbang = halus(rentang(t, 3.35, 3.65)) * (1 - halus(rentang(t, 6.9, 7.4)));
  _v.set(0, 2.72, 0);
  taruh(lblGerbang, _v, aGerbang, { ay: 0.5, skala: 0.8 + 0.2 * lenting(rentang(t, 3.35, 3.75)) });
  // Penanda "komisariatmu" di kiri kubus.
  const aKubus = halus(rentang(t, 5.75, 6.05)) * (1 - halus(rentang(t, 6.75, 7.0)));
  _v.set(0, ATAS + 0.4, 0);
  taruh(lblKubus, _v, aKubus, { ax: 1, ay: 0.5, dx: -64 });

  // Nama kelompok: muncul saat kubus masuk kelompok itu.
  KELOMPOK.forEach((k, g) => {
    const pl = pelat[g];
    const awal = pl.ps[0], akhir = pl.ps[pl.ps.length - 1];
    const a = jendelaLangkah(t, awal.tiba - 0.3, akhir.pergi + 0.25, 0.25, 0.3);
    // Di sisi pelat yang menghadap kelompok berikutnya: celah kosong yang tidak dilewati kubus.
    const tegak = ARAH[g] === Z ? X : Z;
    _v.copy(awal.pos).addScaledVector(tegak, 2.0).addScaledVector(ARAH[g], 1.2);
    _v.y = ATAS;
    taruh(lblKelompok[g], _v, a, { ax: 0.5, ay: 0.5, jepit: true, skala: 0.9 + 0.1 * lenting(rentang(t, awal.tiba - 0.3, awal.tiba + 0.05)) });
  });
  // +skor di atas petak.
  petak.forEach((p, i) => {
    const dt = t - p.tiba;
    const a = dt >= 0 && dt < 0.75 ? halus(dt / 0.08) * (1 - halus((dt - 0.45) / 0.3)) : 0;
    _v.set(p.pos.x, ATAS + KUBUS + 0.25, p.pos.z);
    taruh(lblPoin[i], _v, a, { ay: 1, dy: -60 * keluar3(dt / 0.75), skala: 0.8 + 0.2 * lenting(dt / 0.2) });
  });
  // Label cabang.
  lblCabang.forEach((el, c) => {
    const a = halus(rentang(t, 17.45 + c * 0.1, 17.8 + c * 0.1)) * (1 - halus(rentang(t, 20.75, 21.1)));
    _v.copy(CABANG[c][4]);
    _v.y = 0.2;
    taruh(el, _v, a, { ay: 0, dy: 34 });
  });
  // Angka di atas pilar.
  lblPilar.forEach((el, i) => {
    const k = rentang(t, T_PILAR[i], T_PILAR[i] + LAMA_PILAR);
    const a = halus(rentang(t, T_PILAR[i] + 0.05, T_PILAR[i] + 0.3)) * (1 - halus(rentang(t, 23.75, 24.15)));
    el.firstChild.textContent = String(Math.round(ANGKA[i].nilai * keluar3(k)));
    const pl = pilar[i];
    _v.set(pl.p.x, 0.06 + pl.h * lenting(k, 1.4) + 0.25, pl.p.z);
    taruh(el, _v, a, { ay: 1, dy: -6 });
  });
  // Nama tingkat di sisi kanan pita.
  const hMenara = tinggiMenara(t);
  lblTingkat.forEach((el, k) => {
    const p = pita[k];
    const a = halus(rentang(t, 24.0 + k * 0.08, 24.4 + k * 0.08)) * (1 - halus(rentang(t, 27.9, 28.3)));
    const dilewati = halus(klem((ATAS + hMenara - p.y0) / 0.35));
    const di = k === 2 ? halus(rentang(t, T_MENARA[1] - 0.6, T_MENARA[1])) : 0;
    el.style.color = di > 0.5 ? "var(--emas-terang)" : dilewati > 0.5 ? "var(--zamrud-terang)" : "var(--krem-samar)";
    el.style.fontWeight = di > 0.5 ? "700" : "600";
    _v.set(T.x + 0.86, p.y0 + p.h / 2, T.z - 0.86);
    taruh(el, _v, a, { ax: 0, ay: 0.5, dx: 26, skala: 1 + 0.06 * di });
  });
}

// ---------------------------------------------------------------- teks: kepala, kartu, panel
const elLangkah = [...document.querySelectorAll(".langkah")];
const elKet = [...document.querySelectorAll(".ket")];
const elPJ = [...document.querySelectorAll(".pj")];
const elHal = [...document.querySelectorAll(".hal")];
const elPanel = $("panel");
const elAjakan = $("ajakan");
const elKartu = $("kartu");
const elKetik = $("ketik");
const elKursor = $("kursor");
const elTombol = $("tombol");
const elRiak = $("riak");
const elPenunjuk = $("penunjuk");
const URL_KUIS = "ahmadzulfikar.com/kuis";

const batang = $("batang");
KELOMPOK.forEach((k) => {
  batang.insertAdjacentHTML("beforeend", `<div class="bt"><span class="nm">${k.nama}</span><span class="jalur"><i></i></span><span class="pct">0%</span></div>`);
});
const elBatang = [...batang.children].map((b) => ({ b, isi: b.querySelector(".jalur i"), pct: b.querySelector(".pct") }));
const pipLK = [$("pipLK2"), $("pipLK3")].map((e) => [...e.children]);
const elDapat = [...$("dapat").children];

const RGB_REDUP = [222, 216, 202, 0.34];
const RGB_EMAS = [214, 178, 104, 1];
const RGB_HIJAU = [74, 196, 140, 1];
const campurRGB = (a, b, k) => a.map((v, i) => campur(v, b[i], k));
const rgba = (c) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(3)})`;

function tampakkanTeks(t) {
  // Alur langkah.
  elLangkah.forEach((el, i) => {
    const [a, b] = LANGKAH[i];
    const aktif = jendelaLangkah(t, a, b, 0.25, 0.25);
    const selesai = halus((t - b) / 0.3);
    el.style.color = rgba(campurRGB(campurRGB(RGB_REDUP, RGB_HIJAU, selesai), RGB_EMAS, aktif));
    el.style.textShadow = aktif > 0.01 ? `0 0 ${Math.round(18 * aktif)}px rgba(214,178,104,${(0.55 * aktif).toFixed(2)})` : "none";
    el.style.fontWeight = aktif > 0.5 ? "700" : "500";
    const isi = el.firstElementChild;
    isi.style.width = `${(rentang(t, a, b) * 100).toFixed(2)}%`;
    isi.style.opacity = String(aktif);
  });

  // Keterangan.
  elKet.forEach((el, i) => {
    const [a, b] = KETERANGAN[i];
    const masuk = i === 0 ? 1 : halus(rentang(t, a, a + 0.3));
    const keluar = halus(rentang(t, b - 0.22, b));
    el.style.opacity = String(masuk * (1 - keluar));
    el.style.transform = `translateY(${((1 - masuk) * 18 - keluar * 14).toFixed(1)}px)`;
  });

  // Kartu browser: alamat diketik, tombol "Mulai kuis" ditekan.
  const aKartu = halus(rentang(t, 3.25, 3.65)) * (1 - halus(rentang(t, 6.15, 6.55)));
  elKartu.style.opacity = String(aKartu);
  elKartu.style.transform = `translate(86px, ${(676 + (1 - halus(rentang(t, 3.25, 3.7))) * 30 - halus(rentang(t, 6.15, 6.55)) * 16).toFixed(1)}px)`;
  const nHuruf = Math.round(URL_KUIS.length * rentang(t, 3.7, 4.45));
  elKetik.textContent = URL_KUIS.slice(0, nHuruf);
  elKursor.style.opacity = t < 4.45 ? "1" : (Math.floor((t - 4.45) / 0.4) % 2 === 0 ? "0" : "1");
  const tekan = t >= T_KLIK ? Math.exp(-(t - T_KLIK) * 9) : 0;
  const siapTekan = halus(rentang(t, 4.7, T_KLIK));
  elTombol.style.transform = `scale(${(1 - 0.07 * tekan + 0.03 * siapTekan * (1 - rentang(t, T_KLIK, T_KLIK + 0.2))).toFixed(3)})`;
  elTombol.style.boxShadow = `0 0 ${Math.round(10 + 40 * Math.max(tekan, siapTekan * 0.4))}px rgba(214,178,104,${(0.25 + 0.6 * Math.max(tekan, siapTekan * 0.5)).toFixed(2)})`;
  const r = rentang(t, T_KLIK, T_KLIK + 0.5);
  elRiak.style.opacity = String(t >= T_KLIK ? (1 - r) * 0.9 : 0);
  elRiak.style.transform = `translate(${(elTombol.offsetWidth * 0.62).toFixed(1)}px, ${(elTombol.offsetHeight * 0.55).toFixed(1)}px) scale(${(0.6 + 4 * keluar3(r)).toFixed(3)})`;
  // Penunjuk tetikus bergerak ke tombol.
  const tujuanX = 86 + elTombol.offsetLeft + elTombol.offsetWidth * 0.62;
  const tujuanY = elKartu.getBoundingClientRect().top + elTombol.offsetTop + elTombol.offsetHeight * 0.55;
  const jalan = masukKeluar3(rentang(t, 4.25, 4.85));
  const px = campur(470, tujuanX, jalan) - 4, py = campur(1150, tujuanY, jalan) - 2;
  const aPenunjuk = halus(rentang(t, 4.2, 4.4)) * (1 - halus(rentang(t, 5.6, 5.9)));
  elPenunjuk.style.opacity = String(aPenunjuk);
  elPenunjuk.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) scale(${(1 - 0.12 * tekan).toFixed(3)})`;

  // Panel.
  const aPanel = halus(rentang(t, 0.7, 1.8)) * (1 - halus(rentang(t, 27.85, 28.3)));
  elPanel.style.opacity = String(aPanel);
  elPanel.style.transform = `translateY(${((1 - halus(rentang(t, 0.7, 1.8))) * 30).toFixed(1)}px)`;
  HALAMAN.forEach(([a, b], i) => {
    const k = jendelaLangkah(t, a, b, 0.3, 0.25);
    elHal[i].style.opacity = String(k);
    elHal[i].style.transform = `translateY(${((1 - halus((t - a) / 0.3)) * 12).toFixed(1)}px)`;
    elPJ[i].style.opacity = String(k);
  });
  elPanel.style.setProperty("--denyut", (0.45 + 0.55 * (0.5 + 0.5 * Math.cos(t * Math.PI * 2 / 1.2))).toFixed(3));

  // Halaman 1: jawaban inti.
  let terjawab = 0, skor = 0;
  const jumlahKel = KELOMPOK.map(() => 0);
  petak.forEach((p) => {
    if (t >= p.tiba) terjawab++;
    const k = keluar3(rentang(t, p.tiba, p.tiba + 0.3));
    skor += p.skor * k;
    jumlahKel[p.g] += p.skor * k;
  });
  $("nTanya").textContent = String(terjawab);
  $("nSkor").textContent = String(Math.round(skor));
  elBatang.forEach((e, g) => {
    const n = KELOMPOK[g].skor.length;
    const pct = (jumlahKel[g] / (n * 3)) * 100;
    e.isi.style.width = `${pct.toFixed(2)}%`;
    e.pct.textContent = `${Math.round(pct)}%`;
    const ps = pelat[g].ps;
    const aktif = t >= ps[0].tiba - 0.3 && t < ps[ps.length - 1].pergi + 0.2;
    const selesai = t >= ps[ps.length - 1].pergi + 0.2;
    e.b.classList.toggle("aktif", aktif);
    e.b.classList.toggle("selesai", selesai);
  });

  // Halaman 2: soal lanjutan.
  let lanjut = 0;
  T_LK.forEach(([, tTiba], c) => {
    let n = 0;
    pipLK[c].forEach((u, k) => { const on = t >= tTiba + JEDA_LK * k; u.classList.toggle("on", on); if (on) n++; });
    lanjut += n;
    $(c === 0 ? "nLK2" : "nLK3").textContent = `${n}/5`;
  });
  $("nLanjut").textContent = String(lanjut);

  // Halaman 3: angka.
  const naik = T_PILAR.map((tp) => keluar3(rentang(t, tp, tp + LAMA_PILAR)));
  $("nLK1").textContent = String(Math.round(40 * naik[0]));
  $("nAktif").textContent = String(Math.round(26 * naik[1]));
  $("nRenc").textContent = String(Math.round(12 * naik[2]));
  $("nTerl").textContent = String(Math.round(9 * naik[3]));
  const kRet = keluar3(rentang(t, T_PILAR[1] + 0.25, T_PILAR[1] + 0.75));
  const kProg = keluar3(rentang(t, T_PILAR[3] + 0.25, T_PILAR[3] + 0.75));
  $("pRet").textContent = String(Math.round(65 * kRet));
  $("pProg").textContent = String(Math.round(75 * kProg));
  $("mRet").style.width = `${(65 * kRet).toFixed(2)}%`;
  $("mProg").style.width = `${(75 * kProg).toFixed(2)}%`;

  // Halaman 4: hasil.
  const skorAkhir = Math.round(SKOR_AKHIR * masukKeluar3(rentang(t, T_MENARA[0], T_MENARA[1])));
  $("nAkhir").textContent = String(skorAkhir);
  let tingkat = 0;
  TINGKAT.forEach((k, i) => { if (skorAkhir >= k.min) tingkat = i; });
  $("nmTingkat").textContent = TINGKAT[tingkat].nama;
  elDapat.forEach((e, i) => {
    const k = halus(rentang(t, 25.2 + i * 0.45, 25.55 + i * 0.45));
    e.style.opacity = String(k);
    e.style.transform = `translateX(${((1 - k) * 18).toFixed(1)}px)`;
  });

  // Ajakan penutup.
  const aAjak = halus(rentang(t, 28.3, 28.8));
  elAjakan.style.opacity = String(aAjak);
  elAjakan.style.transform = `translateY(${((1 - aAjak) * 24).toFixed(1)}px) scale(${(0.94 + 0.06 * lenting(rentang(t, 28.3, 28.9))).toFixed(3)})`;
}

// ---------------------------------------------------------------- kontrak halaman
function tampilkan(t) {
  t = klem(t, 0, DURASI);
  const kam = keadaanKamera(t);
  aturKamera(kam);
  tampakkanDunia(t, kam);
  composer.render();
  tampakkanTeks(t);
  tampakkanLabel(t);
}

window.DURASI = DURASI;
window.tampilkan = tampilkan;
window.siap = (async () => {
  await Promise.all([
    '700 76px "Noto Serif"', 'italic 700 46px "Noto Serif"',
    '400 22px "DM Sans"', '500 22px "DM Sans"', '600 37px "DM Sans"', '700 26px "DM Sans"',
    '400 20px "JetBrains Mono"', '500 28px "JetBrains Mono"', '600 22px "JetBrains Mono"', '700 40px "JetBrains Mono"',
  ].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  tampilkan(0);
})();

const prm = new URLSearchParams(location.search);
if (!prm.has("rekam")) {
  window.siap.then(() => {
    if (prm.has("t")) { tampilkan(parseFloat(prm.get("t")) || 0); return; }
    const mulai = performance.now();
    const putar = () => { tampilkan(((performance.now() - mulai) / 1000) % DURASI); requestAnimationFrame(putar); };
    putar();
  });
}
