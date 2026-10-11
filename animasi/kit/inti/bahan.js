// Bahan, bentuk dasar, garis tebal, dan keadaan benda (emas, nyala, denyut, abu, pudar) beserta opasitas.
// Aturan bloom: cahaya kit menjaga benda biasa di bawah ambang 0.74. Yang berpendar hanya emissive emas (keadaan "emas"/"nyala")
// dan bahanPijar() dengan kuat > 1.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { W } from "./tema.js";
import { keluar3, halus } from "./waktu.js";

// Nilai keadaan standar (bagian B.6 dan D prompt indikator).
export const EMAS = { naik: 0.8, puncak: 1.4, akhir: 0.9 }; // emissive emasPijar 0 → 1.4 sesaat → 0.9
export const DENYUT = { periode: 1.2, puncak: 0.5 };          // emissive tepi zamrudPijar 0 → 0.5 → 0
export const PUDAR = { opasitas: 0.15 };                       // figur pudar: abuGelap, opacity 0.15

const warnaDari = (w) => (w && w.isColor ? w.clone() : new THREE.Color(w));

// ---------------------------------------------------------------- bahan
// Benda padat: MeshStandardMaterial roughness 0.8, metalness 0. Warna: THREE.Color (W.x) atau string CSS.
export function bahanPadat(warna = W.zamrudRedup, opsi = {}) {
  return new THREE.MeshStandardMaterial({ color: warnaDari(warna), roughness: 0.8, metalness: 0, ...opsi });
}
// Benda kaca: zamrud transparan opacity 0.28. Pasangkan dengan garisTepi() untuk tepi zamrudPijar.
export function bahanKaca(warna = W.zamrud, opsi = {}) {
  return new THREE.MeshStandardMaterial({ color: warnaDari(warna), roughness: 0.8, metalness: 0, transparent: true, opacity: 0.28, depthWrite: false, ...opsi });
}
// Bahan tanpa cahaya untuk titik cahaya (aliran, partikel). kuat > 1 membuat warna HDR sehingga berpendar.
export function bahanPijar(warna = W.zamrudPijar, kuat = 1, opsi = {}) {
  return new THREE.MeshBasicMaterial({ color: warnaDari(warna).multiplyScalar(kuat), transparent: true, depthWrite: false, ...opsi });
}
// Bahan garis tebal (LineSegments2). Lebar dalam piksel layar.
export function bahanGaris(warna = W.zamrudPijar, lebar = 2, opasitas = 1) {
  return new LineMaterial({ color: warnaDari(warna), linewidth: lebar, transparent: true, opacity: opasitas, depthWrite: false });
}

// ---------------------------------------------------------------- bentuk
// Kotak bersudut bulat (RoundedBoxGeometry, radius 0.06). alas: true → titik asal di tengah alas (y = 0).
export function kotakBulat(w, h, d, bahan = bahanPadat(), { radius = 0.06, alas = false, bayangan = true } = {}) {
  const r = Math.min(radius, Math.min(w, h, d) / 2 - 0.001);
  const geo = r > 0.004 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
  if (alas) geo.translate(0, h / 2, 0);
  const m = new THREE.Mesh(geo, bahan);
  m.castShadow = m.receiveShadow = bayangan;
  m.userData.kotak = { w, h, d, alas };
  return m;
}

// Garis dari pasangan titik [x1,y1,z1, x2,y2,z2, ...].
export function garisDari(posisi, bahan = bahanGaris()) {
  const l = new LineSegments2(new LineSegmentsGeometry().setPositions(posisi), bahan);
  l.frustumCulled = false;
  return l;
}
function rusukKotak(w, h, d, alas) {
  const x = w / 2, z = d / 2, y0 = alas ? 0 : -h / 2, y1 = y0 + h;
  const p = [];
  const s = [[-x, -z], [x, -z], [x, z], [-x, z]];
  for (let i = 0; i < 4; i++) {
    const [ax, az] = s[i], [bx, bz] = s[(i + 1) % 4];
    p.push(ax, y0, az, bx, y0, bz, ax, y1, az, bx, y1, bz, ax, y0, az, ax, y1, az);
  }
  return p;
}
// Garis tepi (LineSegments2, 2 px, zamrudPijar). sumber:
//   [w, h, d] atau { w, h, d, alas }  → 12 rusuk kotak
//   Mesh dari kotakBulat()/BoxGeometry → 12 rusuk kotaknya (koordinat lokal mesh; tambahkan sebagai anak mesh)
//   Mesh/BufferGeometry lain          → EdgesGeometry (sudut ≥ 30°)
export function garisTepi(sumber, { warna = W.zamrudPijar, lebar = 2, opasitas = 1, bahan } = {}) {
  const mat = bahan ?? bahanGaris(warna, lebar, opasitas);
  let k = null;
  if (Array.isArray(sumber)) k = { w: sumber[0], h: sumber[1], d: sumber[2], alas: false };
  else if (sumber && sumber.w !== undefined) k = sumber;
  else if (sumber?.userData?.kotak) k = sumber.userData.kotak;
  else if (sumber?.geometry?.parameters?.width !== undefined && sumber.geometry.type === "BoxGeometry") {
    const p = sumber.geometry.parameters; k = { w: p.width, h: p.height, d: p.depth, alas: false };
  }
  if (k) return garisDari(rusukKotak(k.w, k.h, k.d, k.alas), mat);
  const geo = sumber.isBufferGeometry ? sumber : sumber.geometry;
  const e = new THREE.EdgesGeometry(geo, 30);
  return garisDari(Array.from(e.attributes.position.array), mat);
}
// Garis jalur melalui titik-titik (Vector3), dipecah menjadi `bagi` ruas sama panjang supaya bisa ditampakkan bertahap
// (lihat gerak sambungGaris).
export function garisJalur(titik, { warna = W.zamrudPijar, lebar = 2, opasitas = 1, bagi = 48, bahan } = {}) {
  const L = [0];
  for (let i = 1; i < titik.length; i++) L.push(L[i - 1] + titik[i].distanceTo(titik[i - 1]));
  const total = L[L.length - 1] || 1;
  const pada = (s) => {
    let i = 1;
    while (i < titik.length - 1 && L[i] < s) i++;
    const u = (s - L[i - 1]) / Math.max(1e-9, L[i] - L[i - 1]);
    return titik[i - 1].clone().lerp(titik[i], Math.min(1, Math.max(0, u)));
  };
  const p = [];
  for (let j = 0; j < bagi; j++) {
    const a = pada((total * j) / bagi), b = pada((total * (j + 1)) / bagi);
    p.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  const l = garisDari(p, bahan ?? bahanGaris(warna, lebar, opasitas));
  l.userData.nRuas = bagi;
  l.userData.ujung = [titik[0].clone(), titik[titik.length - 1].clone()]; // lokal; dipakai peristiwa garis-sambung
  return l;
}
// Tampakkan bagian awal garis jalur: k 0..1.
export function tampakGaris(garis, k) {
  const n = garis.userData.nRuas ?? 1;
  const c = Math.max(0, Math.min(n, Math.round(n * k)));
  garis.geometry.instanceCount = c;
  garis.visible = c > 0;
}

// ---------------------------------------------------------------- opasitas dan keadaan
const daftarBahan = (o) => (o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []);
// Nilai dasar bahan (opacity, warna, emissive) dicatat sekali, saat pertama kali disentuh.
// Pembuat benda boleh memanggilnya lebih awal bila bahannya akan diubah sendiri sebelum gerak pertama.
export function catatDasar(m) { return dasar(m); }
function dasar(m) {
  if (!m.userData.dasar) {
    m.userData.dasar = {
      opasitas: m.opacity, transparan: m.transparent, depthWrite: m.depthWrite,
      warna: m.color ? m.color.clone() : null,
      emisif: m.emissive ? m.emissive.clone() : null, kuatEmisif: m.emissiveIntensity ?? 0,
    };
  }
  return m.userData.dasar;
}
// Bahan dibuat transparan sekali untuk selamanya (needsUpdate), tidak pernah dibolak-balik per frame,
// supaya program shader sama di setiap urutan render dan tiap frame bisa diulang persis.
function jadikanTransparan(m) {
  if (!m.transparent) { m.transparent = true; m.needsUpdate = true; }
}
// Opasitas efektif: userData.opasitas benda dikali milik semua induknya (nilai yang tidak diisi = 1).
// Benda di dalam kelompok yang memudar ikut memudar, apa pun urutan pemanggilan aturOpasitas pada kelompok dan anaknya.
export function opasitasEfektif(obj) {
  let a = 1;
  for (let o = obj; o; o = o.parent) a *= o.userData.opasitas ?? 1;
  return a;
}
// Terapkan opasitas efektif ke semua bahan di bawah obj. Anak yang punya userData.opasitas sendiri dikalikan lagi.
function terapkanOpasitasBahan(obj) {
  const jalani = (o, a) => {
    for (const m of daftarBahan(o)) {
      if (m.userData.tepiDenyut) { // nilainya diatur keadaan "denyut"; di sini hanya mengikuti opasitas induk
        if (m.userData.nilaiDenyut !== undefined) { m.opacity = m.userData.nilaiDenyut * a; o.visible = m.opacity > 0.002; }
        continue;
      }
      const d = dasar(m);
      const f = m.userData.faktorOpasitas ?? 1;
      jadikanTransparan(m);
      m.opacity = d.opasitas * a * f;
      m.depthWrite = d.transparan ? d.depthWrite : a * f >= 0.999;
    }
    if (o.isMesh && !o.isLineSegments2) {
      if (o.userData.kirimDasar === undefined) o.userData.kirimDasar = o.castShadow;
      o.castShadow = o.userData.kirimDasar && a * (daftarBahan(o)[0]?.userData.faktorOpasitas ?? 1) > 0.5;
    }
    for (const c of o.children) jalani(c, a * (c.userData.opasitas ?? 1));
  };
  jalani(obj, opasitasEfektif(obj));
}
// Opasitas benda (0..1), dikalikan dengan opasitas dasar tiap bahan dan opasitas efektif induknya.
// Benda tak terlihat bila a ≈ 0. Bahan yang dipakai bersama beberapa benda ikut berubah semua: beri tiap benda
// bergerak bahannya sendiri.
export function aturOpasitas(obj, a) {
  obj.userData.opasitas = a;
  obj.visible = a > 0.002;
  terapkanOpasitasBahan(obj);
}

// Setel keadaan benda. Benda boleh punya userData.setelKeadaan(nama, nilai) sendiri; bila fungsi itu
// mengembalikan false (atau tidak ada), dipakai penanganan bawaan di bawah. Keadaan yang dikenal:
//   "emas"   0..1  warna bergeser ke W.emas, emissive emasPijar 0.9 × nilai (bila "nyala" tidak disetel)
//   "nyala"  angka emissive emasPijar langsung (klikEmas: 0 → 1.4 → 0.9)
//   "denyut" 0..1  garis tepi zamrudPijar tampak dengan opacity nilai, emissive zamrudPijar 0.5 × nilai
//   "abu"    0..1  warna bergeser ke W.abu (atau m.userData.warnaAbu), untuk Bagian Gejala
//   "pudar"  0..1  warna ke W.abuGelap, opacity ke 0.15
// Setel setiap frame tanpa syarat (nilai 0 untuk mati), supaya lompatan waktu tetap persis.
export function setelKeadaan(obj, nama, nilai) {
  const f = obj.userData.setelKeadaan;
  if (typeof f === "function" && f(nama, nilai) !== false) return;
  keadaanBawaan(obj, nama, nilai);
}

const _peringatan = new Set();
// Sasaran keadaan: userData.bagian[nama] (array mesh/bahan) bila ada, selain itu semua mesh benda.
function sasaran(obj, kunci) {
  const s = obj.userData.bagian?.[kunci];
  const hasil = new Set();
  if (s) {
    for (const x of Array.isArray(s) ? s : [s]) {
      if (x.isMaterial) hasil.add(x);
      else x.traverse?.((o) => { if (o.isMesh && !o.isLineSegments2) daftarBahan(o).forEach((m) => hasil.add(m)); });
    }
  } else {
    obj.traverse((o) => { if (o.isMesh && !o.isLineSegments2) daftarBahan(o).forEach((m) => hasil.add(m)); });
  }
  for (const m of hasil) if (m.userData.abaikanKeadaan) hasil.delete(m);
  return hasil;
}
// Garis tepi untuk denyut: userData.bagian.tepi, atau dibuat sekali dari kotak tiap mesh.
function tepiDenyut(obj) {
  const b = (obj.userData.bagian ??= {});
  if (!b.tepi) {
    b.tepi = [];
    const mesh = [];
    obj.traverse((o) => { if (o.isMesh && !o.isLineSegments2 && !o.userData.tepiOtomatis) mesh.push(o); });
    for (const o of mesh) {
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const bb = o.geometry.boundingBox, uk = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3());
      const l = garisTepi([uk.x, uk.y, uk.z], { warna: W.zamrudPijar, lebar: 3, opasitas: 0 });
      l.position.copy(c);
      l.visible = false;
      l.userData.tepiOtomatis = true;
      o.add(l);
      b.tepi.push(l);
    }
  }
  const daftar = Array.isArray(b.tepi) ? b.tepi : [b.tepi];
  for (const l of daftar) l.material.userData.tepiDenyut = true;
  return daftar;
}
// Opasitas garis tepi denyut: opasitas efektif garis bila garis itu anak benda, selain itu opasitas efektif benda.
function opasitasTepi(l, obj) {
  for (let o = l; o; o = o.parent) if (o === obj) return opasitasEfektif(l);
  return opasitasEfektif(obj);
}
// Denyut tidak boleh berpendar; yang boleh melewati ambang bloom hanya emas. Emissive denyut (zamrudPijar × 0.5, luminans
// ±0.18) ditambahkan di atas cahaya permukaan. Dengan cahaya kit (CAHAYA), muka yang menghadap matahari memantulkan sampai
// ±1.0 × luminans albedo, ditambah ±0.03 spekular. Pada albedo terang (kertas, krem, pion) jumlahnya melewati ambang 0.74.
// Karena itu emissive denyut dikecilkan sebanding sisa ruang di bawah ambang: 1 untuk bahan yang luminans albedonya ≤ 0.51
// (semua token zamrud, pelat, abu, abuGelap, emas), sekitar 0.38 untuk pion, dan 0 untuk kertas dan krem. Permukaan terang
// tetap berdenyut lewat garis tepinya. Luminans dihitung dari warna linear saat ini (sesudah abu, pudar, emas).
const BATAS_DENYUT = 0.72; // ambang bloom 0.74 dikurangi cadangan 0.02
const luminans = (c) => 0.2126729 * c.r + 0.7151522 * c.g + 0.072175 * c.b; // bobot yang sama dengan UnrealBloomPass
function skalaDenyut(warna) {
  const sisa = BATAS_DENYUT - (luminans(warna) + 0.03);
  return Math.min(1, Math.max(0, sisa / (DENYUT.puncak * luminans(W.zamrudPijar))));
}
export function keadaanBawaan(obj, nama, nilai) {
  const k = (obj.userData.keadaan ??= {});
  if (!["emas", "nyala", "denyut", "abu", "pudar"].includes(nama)) {
    if (!_peringatan.has(nama)) { _peringatan.add(nama); console.warn(`[kit] keadaan "${nama}" tidak dikenal penanganan bawaan; abaikan.`); }
    return;
  }
  k[nama] = nilai;
  const emas = sasaran(obj, "emas"), denyut = sasaran(obj, "denyut"), semua = sasaran(obj, null);
  for (const m of semua) {
    const d = dasar(m);
    if (d.warna) {
      m.color.copy(d.warna);
      if (k.abu) m.color.lerp(m.userData.warnaAbu ?? W.abu, k.abu);
      if (k.pudar) m.color.lerp(W.abuGelap, k.pudar);
      if (k.emas && emas.has(m)) m.color.lerp(W.emas, k.emas);
    }
    if (d.emisif) {
      const e = emas.has(m) ? (k.nyala ?? EMAS.akhir * (k.emas ?? 0)) : 0;
      const p = denyut.has(m) && k.denyut ? DENYUT.puncak * k.denyut * skalaDenyut(m.color) : 0;
      if (e > 1e-4) { m.emissive.copy(W.emasPijar); m.emissiveIntensity = e; }
      else if (p > 1e-4) { m.emissive.copy(W.zamrudPijar); m.emissiveIntensity = p; }
      else { m.emissive.copy(d.emisif); m.emissiveIntensity = d.kuatEmisif; }
    }
  }
  if (nama === "denyut") {
    for (const l of tepiDenyut(obj)) {
      const a = nilai * opasitasTepi(l, obj);
      l.material.userData.nilaiDenyut = nilai; // dipakai terapkanOpasitasBahan bila induknya memudar sesudah ini
      l.material.opacity = a;
      l.visible = a > 0.002;
    }
  }
  if (nama === "pudar") {
    obj.traverse((o) => { for (const m of daftarBahan(o)) if (!m.userData.abaikanKeadaan && !m.userData.tepiDenyut) m.userData.faktorOpasitas = 1 + (PUDAR.opasitas - 1) * nilai; });
    terapkanOpasitasBahan(obj);
  }
}

// Kurva emissive klik emas pada detik dt sejak klik (0 → 1.4 sesaat → 0.9), selama `naik` detik.
export function kurvaNyala(dt, naik = EMAS.naik) {
  if (dt <= 0) return 0;
  const u = Math.min(1, dt / naik);
  return u < 0.5 ? EMAS.puncak * keluar3(u / 0.5) : EMAS.puncak - (EMAS.puncak - EMAS.akhir) * halus((u - 0.5) / 0.5);
}
// Nilai denyut 0..1 pada detik t untuk denyut yang berjalan dari `mulai` sampai `selesai` (sin², periode 1.2 s).
export function nilaiDenyut(t, mulai, selesai, periode = DENYUT.periode) {
  if (t <= mulai || t >= selesai) return 0;
  const p = Math.pow(Math.sin(Math.PI * (t - mulai) / periode), 2);
  const tepi = Math.min(1, (selesai - t) / 0.15);
  return p * tepi * tepi * (3 - 2 * tepi);
}
