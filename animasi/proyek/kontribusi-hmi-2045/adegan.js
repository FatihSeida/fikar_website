// Reels 60 detik: "Kontribusi HMI Menyongsong Indonesia Emas 2045: HMI, Indonesia dan Dunia".
// Semua keadaan dihitung dari t. Lihat animasi/README.md. Waktu peristiwa dibaca dari isyarat.js (sama dengan suara.mjs).
import * as THREE from "three";
import {
  composer, matahari, ARAH_CAHAYA, aturKamera, keadaan, ISO, klem, campur, rentang, halus, halus2, keluar3, dunia, $,
} from "./dasar.js";
import { DURASI, T_KULIAH_NYALA, T_SIDANG_NYALA, T_AIR, T_NAIK, T_KEMBALI, B_AWAL_LARI, B_AKHIR, lintasPerahu } from "./isyarat.js";

let D1 = null, D2 = null; // modul dunia dimuat setelah font siap (tekstur kanvas memakai font yang sama)
const _f = new THREE.Vector3();
const F = (a, b, y = 0) => { const v = dunia(a, b, y); return { x: v.x, y: v.y, z: v.z }; };

// ---------------------------------------------------------------- kamera
function fokusPerahu(t, maju = 2.6) { const b = lintasPerahu(t).b; return F(0, b + maju); }
const FASE_KAMERA = [
  { t: 0, d: 1, f: (t) => keadaan(F(0, 0.1, 0.7), campur(16.4, 14.4, halus2(rentang(t, 0, 7.4))), 540, 1050) },
  { t: 7.25, d: 1.6, f: (t) => keadaan(F(0, 0), campur(19.2, 18.4, rentang(t, 8.8, 15)), 540, 1040) },
  { t: 14.85, d: 1.1, f: () => keadaan(F(0, 0), 15.2, 540, 1050) },
  { t: 20.3, d: 3.3, f: () => keadaan(F(0, 1.2), 25.5, 540, 1040) },
  { t: T_NAIK[0] - 0.05, d: T_NAIK[1] - T_NAIK[0] + 0.1, f: (t) => { D2.pusatBarisan(t, _f); return keadaan({ x: _f.x, y: 0, z: _f.z }, 12.8, 540, 1080); } },
  { t: 35.75, d: 1.7, f: () => keadaan(F(D2.PUSAT_LADANG.a, D2.PUSAT_LADANG.b), 25, 540, 1040) },
  { t: 41.85, d: 1.15, f: () => keadaan(F(0, 39.4), 23.5, 540, 1150) },
  { t: T_KEMBALI[0], d: T_KEMBALI[1] - T_KEMBALI[0], f: (t) => keadaan(fokusPerahu(t), 15.6, 540, 1120) },
  { t: 49.6, d: 2.0, f: (t) => keadaan(fokusPerahu(t, 3.2), 18.2, 540, 1110) },
  { t: 52.7, d: 3.7, f: (t) => keadaan(fokusPerahu(t, 0), 34, 540, 1380) },
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
  // "Kamera naik": sedikit mendongak saat berpindah ke jalan HMI.
  const naik = rentang(t, T_NAIK[0], T_NAIK[1]);
  s.el = ISO + 9 * Math.sin(Math.PI * naik) * (naik > 0 && naik < 1 ? 1 : 0);
  return s;
}

// ---------------------------------------------------------------- air: lingkaran yang meluas dan menyusut
const O = F(0, 0);
const AWAL_LARI = F(0, B_AWAL_LARI);
function keadaanAir(t) {
  if (t < T_AIR[0]) return { x: O.x, z: O.z, r: 0 };
  if (t < 27.0) return { x: O.x, z: O.z, r: 80 * Math.pow(rentang(t, T_AIR[0], T_AIR[1] + 0.6), 1.6) };
  if (t < T_KEMBALI[0]) return { x: O.x, z: O.z, r: 80 * Math.pow(1 - rentang(t, 27.0, 28.3), 1.4) };
  return { x: AWAL_LARI.x, z: AWAL_LARI.z, r: 110 * Math.pow(rentang(t, T_KEMBALI[0], T_KEMBALI[0] + 1.8), 1.3) };
}

// ---------------------------------------------------------------- teks keterangan (kata per kata dari skenario)
const KET = [
  { el: $("k-pembuka"), a: T_KULIAH_NYALA - 0.1, b: 7.55 },
  { el: $("k-karang"), a: 9.35, b: 14.8 },
  { el: $("k-retak"), a: 15.45, b: 19.95 },
  { el: $("k-hariini"), a: 20.95, b: 26.85 },
  { el: $("k-umur"), a: 43.4, b: 47.8 },
  { el: $("k-penutup"), a: 54.0, b: DURASI + 1 },
];
const baris1948 = $("k-1948");
const kabutPenutup = $("kabut-penutup");
function tampakkanTeks(t) {
  for (const k of KET) {
    const masuk = halus(rentang(t, k.a, k.a + 0.35));
    const keluar = halus(rentang(t, k.b - 0.25, k.b));
    k.el.style.opacity = String(masuk * (1 - keluar));
    k.el.style.transform = `translateY(${((1 - masuk) * 18 - keluar * 12).toFixed(1)}px)`;
  }
  const a48 = halus(rentang(t, T_SIDANG_NYALA - 0.05, T_SIDANG_NYALA + 0.3));
  baris1948.style.opacity = String(a48);
  baris1948.style.transform = `translateY(${((1 - a48) * 14).toFixed(1)}px)`;
  kabutPenutup.style.opacity = String(halus(rentang(t, 53.2, 54.1)));
}

// ---------------------------------------------------------------- kontrak halaman
function tampilkan(t) {
  t = klem(t, 0, DURASI);
  const kam = keadaanKamera(t);
  aturKamera(kam);
  matahari.target.position.set(kam.fx, 0, kam.fz);
  matahari.position.set(kam.fx, 0, kam.fz).addScaledVector(ARAH_CAHAYA, 50);
  matahari.target.updateMatrixWorld();
  const s = Math.max(16, kam.H * 0.95);
  Object.assign(matahari.shadow.camera, { left: -s, right: s, top: s, bottom: -s });
  matahari.shadow.camera.updateProjectionMatrix();
  D1.perbaruiDunia1(t, kam, keadaanAir(t));
  D2.perbaruiDunia2(t, kam);
  D1.tutupAir();
  composer.render();
  tampakkanTeks(t);
}

window.DURASI = DURASI;
window.tampilkan = tampilkan;
window.siap = (async () => {
  await Promise.all([
    '700 34px "Noto Serif"', 'italic 700 45px "Noto Serif"',
    '500 22px "DM Sans"', '600 42px "DM Sans"', '700 26px "DM Sans"',
    '500 17px "JetBrains Mono"', '600 27px "JetBrains Mono"', '700 30px "JetBrains Mono"', '700 132px "JetBrains Mono"',
  ].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  D1 = await import("./dunia.js");
  D2 = await import("./dunia2.js");
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
void keluar3; void B_AKHIR;
