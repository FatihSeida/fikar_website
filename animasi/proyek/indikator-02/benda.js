// Pembuat benda untuk indikator 02: pion, gerbang kampus, gedung kelas, rumah komisariat, blok tanah,
// kartu kecil (kertas survei), papan jembatan, debu. Pola dari ekosistem-berbasis-bukti/benda-a.js dan benda-b.js.
import * as THREE from "three";
import { W, bahan, balok, bayang, bahanGaris, garisDari, tepiKotak } from "./alat.js";
import { BLOK, KELAS, KOM, PAPAN } from "./tata.js";

// ---------------------------------------------------------------- figur pion: badan kapsul + kepala bola, tanpa wajah
const GEO_BADAN = new THREE.CapsuleGeometry(0.18, 0.46, 8, 24).translate(0, 0.18 + 0.23, 0);
const GEO_KEPALA = new THREE.SphereGeometry(0.16, 24, 16).translate(0, 0.9, 0);
export function pion() {
  const mat = bahan(W.pion);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(GEO_BADAN, mat), new THREE.Mesh(GEO_KEPALA, mat));
  bayang(g);
  return { grup: g, mat };
}

// ---------------------------------------------------------------- gerbang kampus: dua tiang dan balok atas, garis tepi zamrudRedup
// Balok atas sejajar sumbu x lokal; tiang di x = ±1,3.
export function gerbangKampus() {
  const g = new THREE.Group();
  const mat = bahan(W.pelat);
  const garis = bahanGaris(W.zamrudRedup, 2);
  for (const x of [-1.3, 1.3]) {
    const t = balok(0.4, 2.2, 0.4, mat); t.position.set(x, 1.1, 0); g.add(t);
    const e = tepiKotak(0.4, 2.2, 0.4, garis); e.position.set(x, 0, 0); g.add(e);
  }
  const atas = balok(3.2, 0.35, 0.45, mat); atas.position.set(0, 2.2 + 0.175, 0); g.add(atas);
  const e = tepiKotak(3.2, 0.35, 0.45, garis); e.position.set(0, 2.2, 0); g.add(e);
  return g;
}

// ---------------------------------------------------------------- gedung kelas: kotak 3,0 × 2,2 × 2,0, jendela 4 × 2 di muka depan (+x)
export function gedungKelas() {
  const g = new THREE.Group();
  const w = KELAS.x1 - KELAS.x0, d = KELAS.z1 - KELAS.z0, h = KELAS.h;
  const badan = balok(w, h, d, bahan(W.kelas)); badan.position.y = h / 2; g.add(badan);
  const matJendela = bahan(W.kertas, { transparent: true, opacity: 0.5, depthWrite: false });
  for (const y of [0.75, 1.55]) for (const z of [-1.05, -0.35, 0.35, 1.05]) {
    const j = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.4, 0.4), matJendela);
    j.position.set(w / 2 + 0.012, y, z);
    j.receiveShadow = true;
    g.add(j);
  }
  return g;
}

// ---------------------------------------------------------------- rumah komisariat: dinding 1,8 × 1,2 × 1,6, atap prisma 0,7, pintu di muka +z
export function rumahKomisariat() {
  const g = new THREE.Group();
  const matDinding = bahan(W.abu);
  const dinding = balok(KOM.w, KOM.h, KOM.d, matDinding); dinding.position.y = KOM.h / 2; g.add(dinding);
  const lebarAtap = KOM.w + 0.16, dalamAtap = KOM.d + 0.16;
  const segitiga = new THREE.Shape();
  segitiga.moveTo(-lebarAtap / 2, 0); segitiga.lineTo(lebarAtap / 2, 0); segitiga.lineTo(0, KOM.atap); segitiga.closePath();
  const geoAtap = new THREE.ExtrudeGeometry(segitiga, { depth: dalamAtap, bevelEnabled: false }).translate(0, 0, -dalamAtap / 2);
  const atap = bayang(new THREE.Mesh(geoAtap, bahan(W.pelat)));
  atap.position.y = KOM.h;
  g.add(atap);
  const matPintu = bahan(W.abuGelap);
  const pintu = balok(0.4, 0.7, 0.04, matPintu, 0.015); pintu.position.set(0, 0.35, KOM.d / 2 + 0.012); g.add(pintu);
  return { grup: g, matDinding, matPintu };
}

// ---------------------------------------------------------------- blok tanah 5 × 0,3 × 6 dengan garis tepi atas dan tepi cermin
// sisiCelah: +1 bila tepi celah di x = +2,5 (blok kiri), -1 bila di x = -2,5 (blok kanan).
export function blokTanah(sisiCelah) {
  const g = new THREE.Group();
  const lantai = balok(BLOK.w, BLOK.h, BLOK.d, bahan(W.pelat)); lantai.position.y = BLOK.h / 2; g.add(lantai);
  const x = BLOK.w / 2, z = BLOK.d / 2, y = BLOK.h + 0.003;
  const tepi = garisDari([-x, y, -z, x, y, -z, x, y, -z, x, y, z, x, y, z, -x, y, z, -x, y, z, -x, y, -z], bahanGaris(W.zamrudRedup, 1.5, 0.6));
  g.add(tepi);
  // Tepi cermin: jalur tipis di atas dan muka samping yang menghadap celah, emissive zamrudPijar saat berdenyut.
  const matCermin = bahan(W.pelat, { emissive: W.zamrudPijar.clone(), emissiveIntensity: 0 });
  const jalur = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, BLOK.d - 0.12), matCermin);
  jalur.position.set(sisiCelah * (x - 0.06), BLOK.h + 0.006, 0);
  jalur.receiveShadow = true;
  const muka = new THREE.Mesh(new THREE.PlaneGeometry(BLOK.d - 0.12, BLOK.h - 0.12), matCermin);
  muka.rotation.y = sisiCelah * Math.PI / 2;
  muka.position.set(sisiCelah * (x + 0.002), BLOK.h / 2, 0);
  muka.receiveShadow = true;
  g.add(jalur, muka);
  const matGarisCermin = bahanGaris(W.zamrudPijar, 3, 0);
  const xc = sisiCelah * x;
  const garisCermin = garisDari([xc, y + 0.002, -z + 0.06, xc, y + 0.002, z - 0.06], matGarisCermin);
  g.add(garisCermin);
  return { grup: g, matCermin, matGarisCermin, garisCermin };
}

// ---------------------------------------------------------------- kertas survei (kartu kecil 0,6 × 0,02 × 0,8) dan papan jembatan
export function kertasSurvei() {
  const mat = bahan(W.kertas);
  const m = bayang(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat), true, false); // diskalakan ke ukuran kartu atau papan
  m.scale.set(0.6, 0.02, 0.8);
  return { m, mat };
}
export const KARTU_KECIL = { w: 0.6, h: 0.02, d: 0.8 };
export function papanJembatan() {
  const mat = bahan(W.kertas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0 });
  const m = balok(PAPAN.w, PAPAN.h, PAPAN.d, mat, 0.035);
  return { m, mat };
}

// ---------------------------------------------------------------- debu: bola kecil abu-abu
const GEO_DEBU = new THREE.SphereGeometry(0.03, 10, 8);
export function butirDebu() {
  const mat = new THREE.MeshBasicMaterial({ color: W.abu.clone(), transparent: true, opacity: 0, depthWrite: false });
  return new THREE.Mesh(GEO_DEBU, mat);
}
