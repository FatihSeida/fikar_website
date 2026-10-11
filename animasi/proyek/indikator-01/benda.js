// Pembuat benda untuk "Dunia Kader" (kamus bentuk di bagian F). Hanya membangun; gerak ada di adegan.js.
import * as THREE from "three";
import { W, DEG, warna, bahan, balok, bayang, bahanGaris, tepiKotak } from "./alat.js";

// ---------------------------------------------------------------- figur pion (D.4): kapsul + kepala bola, tanpa wajah
const GEO_BADAN = new THREE.CapsuleGeometry(0.18, 0.46, 6, 20).translate(0, 0.41, 0);
const GEO_KEPALA = new THREE.SphereGeometry(0.16, 24, 16).translate(0, 0.88, 0);
export function pion(c = W.pion) {
  const mat = bahan(c);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(GEO_BADAN, mat), new THREE.Mesh(GEO_KEPALA, mat));
  bayang(g, true, false);
  return { grup: g, mat };
}

// ---------------------------------------------------------------- gerbangKampus
// Dibangun memanjang di sumbu z lokal; dengan rotasi y −45° balok atasnya sejajar layar dan menghadap kamera.
export function gerbangKampus() {
  const g = new THREE.Group();
  const mat = bahan(W.pelat);
  const garis = bahanGaris(W.zamrudRedup, 2);
  for (const z of [-1.3, 1.3]) {
    const tiang = balok(0.4, 2.2, 0.4, mat); tiang.position.set(0, 1.1, z); g.add(tiang);
    const tp = tepiKotak(0.4, 2.2, 0.4, garis); tp.position.set(0, 0, z); g.add(tp);
  }
  const atas = balok(0.45, 0.35, 3.2, mat); atas.position.set(0, 2.2 + 0.175, 0); g.add(atas);
  const ta = tepiKotak(0.45, 0.35, 3.2, garis); ta.position.set(0, 2.2, 0); g.add(ta);
  return g;
}

// ---------------------------------------------------------------- gedungKelas: kotak 3.0 × 2.2 × 2.0, jendela 4 × 2 di sisi depan (+z lokal)
export function gedungKelas() {
  const g = new THREE.Group();
  const badan = balok(3.0, 2.2, 2.0, bahan(warna("hsl(153, 20%, 22%)"))); badan.position.y = 1.1; g.add(badan);
  const matJendela = bahan(W.kertas, { transparent: true, opacity: 0.5 });
  for (let i = 0; i < 4; i++) for (const y of [0.75, 1.55]) {
    const j = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.03), matJendela);
    j.position.set(-1.05 + i * 0.7, y, 1.0 + 0.015);
    g.add(j);
  }
  return g;
}

// ---------------------------------------------------------------- ubinJalan
const MAT_UBIN = bahan(warna("hsl(153, 30%, 16%)"));
export function ubinJalan() {
  const u = balok(0.9, 0.06, 0.9, MAT_UBIN, 0.03);
  u.castShadow = false;
  return u;
}

// ---------------------------------------------------------------- tanggaJenjang: tiga anak tangga, naik ke belakang (−z lokal)
export function tanggaJenjang() {
  const g = new THREE.Group();
  const mat = bahan(W.zamrudRedup);
  const puncak = [];
  [0.4, 0.8, 1.2].forEach((h, i) => {
    const z = 0.9 - i * 0.9;
    const a = balok(1.2, h, 0.9, mat); a.position.set(0, h / 2, z); g.add(a);
    puncak.push(new THREE.Vector3(0, h, z));
  });
  return { grup: g, puncak };
}

// ---------------------------------------------------------------- komisariat: dinding 1.8 × 1.2 × 1.6, atap prisma 0.7, pintu di sisi +z lokal
export const RUMAH = { w: 1.8, h: 1.2, d: 1.6, atap: 0.7, pintuX: -0.4 };
export function komisariat() {
  const { w, h, d, atap, pintuX } = RUMAH;
  const g = new THREE.Group();
  const matDinding = bahan(W.abu);
  const matAtap = bahan(W.abuGelap);
  const matPintu = bahan(W.abuGelap);
  const dinding = balok(w, h, d, matDinding); dinding.position.y = h / 2; g.add(dinding);
  const s = new THREE.Shape();
  s.moveTo(-d / 2 - 0.08, 0); s.lineTo(d / 2 + 0.08, 0); s.lineTo(0, atap); s.closePath();
  const geoAtap = new THREE.ExtrudeGeometry(s, { depth: w + 0.12, bevelEnabled: false }).rotateY(Math.PI / 2).translate(-(w + 0.12) / 2, h, 0);
  const atapM = bayang(new THREE.Mesh(geoAtap, matAtap)); g.add(atapM);
  const pintu = balok(0.4, 0.7, 0.05, matPintu, 0.02); pintu.position.set(pintuX, 0.35, d / 2 + 0.02); g.add(pintu);
  // Garis tepi untuk denyut cermin: dinding dan kusen pintu.
  const matDenyut = bahanGaris(W.zamrudPijar, 3, 0);
  const tepiDinding = tepiKotak(w, h, d, matDenyut); g.add(tepiDinding);
  const tepiPintu = tepiKotak(0.4, 0.7, 0.05, matDenyut); tepiPintu.position.set(pintuX, 0, d / 2 + 0.02); g.add(tepiPintu);
  tepiDinding.visible = tepiPintu.visible = false;
  return { grup: g, matDinding, matAtap, matPintu, matDenyut, tepi: [tepiDinding, tepiPintu] };
}

// ---------------------------------------------------------------- balonKata: panel lonjong 1.4 × 0.8 × 0.08 dengan ekor segitiga, ikon tiga titik
function bentukBalon(w, h, r, ekor) {
  const s = new THREE.Shape();
  const x0 = -w / 2, y0 = -h / 2;
  s.moveTo(x0 + r, y0);
  s.lineTo(x0 + w * 0.3, y0);
  s.lineTo(x0 + w * 0.22, y0 - ekor);
  s.lineTo(x0 + w * 0.46, y0);
  s.lineTo(x0 + w - r, y0);
  s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  s.lineTo(x0 + w, y0 + h - r);
  s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  s.lineTo(x0 + r, y0 + h);
  s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  s.lineTo(x0, y0 + r);
  s.quadraticCurveTo(x0, y0, x0 + r, y0);
  return s;
}
const GEO_BALON = new THREE.ExtrudeGeometry(bentukBalon(1.4, 0.8, 0.36, 0.22), { depth: 0.08, bevelEnabled: false, curveSegments: 14 }).translate(0, 0, -0.04);
const GEO_TITIK = new THREE.CircleGeometry(0.075, 20);
export function balonKata() {
  const g = new THREE.Group();
  const mat = bahan(W.kertas, { transparent: true, opacity: 0.85 });
  g.add(new THREE.Mesh(GEO_BALON, mat));
  const matTitik = new THREE.MeshBasicMaterial({ color: W.zamrudRedup.clone(), transparent: true });
  for (const x of [-0.3, 0, 0.3]) { const m = new THREE.Mesh(GEO_TITIK, matTitik); m.position.set(x, 0.02, 0.045); g.add(m); }
  // Selalu menghadap kamera (kamera tidak pernah berputar: azimut 45°, elevasi 35.26°).
  g.rotation.set(-Math.atan(1 / Math.SQRT2), 45 * DEG, 0, "YXZ");
  return { grup: g, mat, matTitik };
}

// ---------------------------------------------------------------- tabel: papan kertas 2.2 × 0.04 × 1.6, miring 70°, tiga batang horizontal
export const BATANG = [1.6, 1.1, 0.7];
export const BARIS_Y = [0.42, 0, -0.42];
export const BATANG_X0 = -0.56;
export function tabel() {
  const luar = new THREE.Group();           // posisi di tanah, yaw 45° (x lokal = kanan layar)
  luar.rotation.y = 45 * DEG;
  const papan = new THREE.Group();          // papan miring 70° dari tanah, condong ke belakang
  papan.position.set(0, 0.9, 0);
  papan.rotation.x = -20 * DEG;
  luar.add(papan);
  const matKertas = bahan(W.kertas);
  const badan = balok(2.2, 1.6, 0.04, matKertas, 0.02); papan.add(badan);
  const matEmas = []; // bahan yang berubah emas di Bagian 3
  const matBingkai = bahan(W.zamrud);
  matEmas.push(matBingkai);
  for (const [bw, bh, x, y] of [[2.24, 0.05, 0, 0.8], [2.24, 0.05, 0, -0.8], [0.05, 1.6, -1.1, 0], [0.05, 1.6, 1.1, 0]]) {
    const b = balok(bw, bh, 0.06, matBingkai, 0.02); b.position.set(x, y, 0.01); papan.add(b);
  }
  const batang = BATANG.map((p, i) => {
    const m = bahan(W.zamrud);
    matEmas.push(m);
    const geo = new THREE.BoxGeometry(p, 0.08, 0.04).translate(p / 2, 0, 0);
    const b = bayang(new THREE.Mesh(geo, m), false, false);
    b.position.set(BATANG_X0, BARIS_Y[i], 0.035);
    papan.add(b);
    return b;
  });
  const alas = balok(2.0, 0.16, 0.36, bahan(W.pelat), 0.04); alas.position.set(0, 0.08, 0.28); luar.add(alas);
  return { grup: luar, papan, batang, matKertas, matEmas, semuaBahan: [matKertas, matBingkai, ...batang.map((b) => b.material), alas.material] };
}
