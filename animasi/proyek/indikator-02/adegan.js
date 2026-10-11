// Reels 21 detik, indikator 02 / 44: "Jarak HMI dengan kehidupan mahasiswa semakin lebar." Semua keadaan dihitung dari t.
// Kontrak halaman: lihat animasi/README.md. Waktu peristiwa dibaca dari isyarat.js (sama dengan suara.mjs).
import * as THREE from "three";
import { W, $, composer, matahari, ARAH_CAHAYA, aturKamera, pudar } from "./alat.js";
import { DURASI, T, KETERANGAN, LANGKAH_HZ } from "./isyarat.js";
import {
  klem, campur, rentang, halus, keluar3, pegas, G, ATAS, Z_KIRI, Z_JEMBATAN, xBlokKiri, xBlokKanan, posisiKeliling, lajuJalan,
  pelempar, jalurSeberang, titikPolyline, kameraPada, xPapan, yPapan, PAPAN,
} from "./tata.js";
import {
  bahanTanah, blokKiri, blokKanan, lantaiKiri, lantaiKanan, gerbang, POS_GERBANG, kelas, POS_KELAS, kom, POS_KOM,
  figKom, figKelas, kertas, papan, debu,
} from "./dunia.js";
import { KARTU_KECIL } from "./benda.js";

const NOL = new THREE.Vector3(0, 0, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

// Gerak standar "muncul": naik dari y -0,6, skala 0,85 → 1, opasitas 0 → 1, 0,5 detik, keluar3.
function muncul(obj, dasar, t, t0) {
  const k = keluar3(rentang(t, t0, t0 + 0.5));
  obj.position.set(dasar.x, dasar.y - 0.6 * (1 - k), dasar.z);
  obj.scale.setScalar(0.85 + 0.15 * k);
  pudar(obj, k);
  return k;
}
// Ayunan langkah: badan naik turun 0,04 unit pada 4 Hz (LANGKAH_HZ, juga dipakai suara.mjs untuk bunyi langkah).
const ayun = (t, fasa, kuat) => 0.04 * (0.5 - 0.5 * Math.cos(2 * Math.PI * LANGKAH_HZ * t + fasa)) * kuat;

// Profil jalan trapesium (mulai dan berhenti halus), hasil 0..1 dan laju relatif 0..1.
function trapesium(t, a, b, naik, turun) {
  const D = b - a, L = D - naik / 2 - turun / 2, s = klem(t - a, 0, D);
  if (s < naik) return { k: (s * s) / (2 * naik) / L, laju: s / naik };
  if (s < D - turun) return { k: (naik / 2 + s - naik) / L, laju: 1 };
  const r = D - s;
  return { k: (L - (r * r) / (2 * turun)) / L, laju: r / turun };
}
// Denyut cermin: emissive 0 → 0,5 → 0, periode 1,2 detik.
function denyutCermin(t) {
  const [a, b] = T.denyut;
  if (t < a || t > b) return 0;
  return 0.5 * (0.5 - 0.5 * Math.cos((2 * Math.PI * (t - a)) / T.periodeDenyut));
}

// ---------------------------------------------------------------- figur
const POS_BERHENTI_A = [0, 1].map((a) => posisiKeliling(0, a, 99));
function aturFigurKelas(t) {
  const xL = xBlokKiri(t);
  const lj = lajuJalan(t);
  figKelas.forEach((pasang, p) => pasang.forEach((f, a) => {
    let x, z, y = ATAS, sy = 1;
    if (p === 0 && t >= T.seberang[0]) {
      const j = trapesium(t, T.seberang[0], T.seberang[1], T.seberangNaik, T.seberangTurun);
      const q = titikPolyline(jalurSeberang(a), j.k);
      x = q.x; z = q.z; y += ayun(t, a * Math.PI, j.laju);
    } else {
      const q = posisiKeliling(p, a, t);
      x = xL + q.x; z = Z_KIRI + q.z; y += ayun(t, a * Math.PI + p, lj);
      if (p === 0) { // gerak melempar: jongkok sedikit lalu meregang
        T.lempar.forEach((L, i) => {
          if (pelempar(i) !== a) return;
          const u = rentang(t, L - 0.15, L + 0.25);
          if (u > 0 && u < 1) sy *= 1 - 0.08 * Math.sin(2 * Math.PI * u) * (1 - u);
        });
      }
    }
    muncul(f.grup, _a.set(x, y, z), t, T.bendaMuncul[3]);
    f.grup.scale.y *= sy;
  }));
  figKom.forEach((f) => muncul(f.grup, f.dasar, t, T.bendaMuncul[4]));
}

// ---------------------------------------------------------------- kertas survei → papan jembatan → emas
function aturJembatan(t) {
  T.lempar.forEach((L, i) => {
    const k = kertas[i], pp = papan[i];
    const A = L + T.terbang, E = A + T.ubah;
    // Kertas: muncul di tangan pelempar, terbang di busur setinggi 1,5, lalu menebal menjadi papan.
    if (t < L - 0.08 || t >= E) k.m.visible = false;
    else {
      k.m.visible = true;
      const p = POS_BERHENTI_A[pelempar(i)];
      _a.set(xBlokKiri(t) + p.x + 0.16, ATAS + 0.6, Z_KIRI + p.z);
      _b.set(xPapan(i), yPapan + 0.05, Z_JEMBATAN);
      if (t < A) {
        const u = rentang(t, L, A);
        k.m.position.lerpVectors(_a, _b, u);
        k.m.position.y += 4 * 1.5 * u * (1 - u);
        const s = keluar3(rentang(t, L - 0.08, L + 0.06));
        k.m.scale.set(KARTU_KECIL.w * s, KARTU_KECIL.h * s, KARTU_KECIL.d * s);
        k.m.rotation.set(0, Math.PI * (1 - Math.cos(Math.PI * u)), 0.35 * Math.sin(Math.PI * u) * (i % 2 ? -1 : 1));
      } else {
        const m = halus(rentang(t, A, E));
        k.m.position.copy(_b);
        k.m.position.y -= 0.05 * m;
        k.m.rotation.set(0, 0, 0);
        k.m.scale.set(campur(KARTU_KECIL.w, PAPAN.w, m), campur(KARTU_KECIL.h, PAPAN.h, m), campur(KARTU_KECIL.d, PAPAN.d, m));
      }
    }
    // Papan: terpasang setelah kertas berubah; klik emas berurutan dari tepi kiri ke tepi kanan.
    pp.m.visible = t >= E;
    const dt = t - T.klik[i];
    if (dt < 0) {
      pp.mat.color.copy(W.kertas);
      pp.mat.emissiveIntensity = 0;
      pp.m.scale.setScalar(1);
    } else {
      pp.mat.color.copy(W.kertas).lerp(W.emas, halus(dt / 0.05));
      pp.mat.emissiveIntensity = dt < 0.35 ? campur(1.4, 0.9, keluar3(dt / 0.35)) : 0.9;
      pp.m.scale.setScalar(dt < 0.35 ? 1 + 0.25 * pegas(dt) : 1);
    }
  });
}

// ---------------------------------------------------------------- debu jatuh dari tepi celah
function aturDebu(t) {
  for (const d of debu) {
    const u = (t - d.t0) / d.umur;
    if (u <= 0 || u >= 1) { d.m.visible = false; continue; }
    d.m.visible = true;
    const tepi = d.sisi < 0 ? xBlokKiri(d.t0) + 2.5 : xBlokKanan(d.t0) - 2.5;
    d.m.position.set(tepi - d.sisi * d.jauh * u, ATAS + 0.01 - (ATAS - 0.02) * u * u, d.z + d.geserZ * u);
    d.m.material.opacity = 0.4 * halus(u / 0.12) * (1 - halus((u - 0.65) / 0.35));
  }
}

// ---------------------------------------------------------------- dunia 3D
function aturDunia(t) {
  blokKiri.position.x = xBlokKiri(t);
  blokKanan.position.x = xBlokKanan(t);
  muncul(lantaiKiri.grup, NOL, t, T.blokMuncul);
  muncul(lantaiKanan.grup, NOL, t, T.blokMuncul);
  muncul(gerbang, POS_GERBANG, t, T.bendaMuncul[0]);
  muncul(kelas, POS_KELAS, t, T.bendaMuncul[1]);
  muncul(kom.grup, POS_KOM, t, T.bendaMuncul[2]);
  // Komisariat abu-abu (gejala), kembali zamrudRedup saat jembatan selesai menjadi emas.
  const pulih = halus(rentang(t, T.pulih[0], T.pulih[1]));
  kom.matDinding.color.copy(W.abu).lerp(W.zamrudRedup, pulih);
  kom.matPintu.color.copy(W.abuGelap).lerp(W.pelat, pulih);
  // Denyut cermin pada kedua tepi celah yang saling berhadapan.
  const dn = denyutCermin(t);
  for (const l of [lantaiKiri, lantaiKanan]) {
    l.matCermin.emissiveIntensity = dn;
    l.matGarisCermin.opacity = klem(dn * 2);
    l.garisCermin.visible = dn > 0.001;
  }
  aturFigurKelas(t);
  aturJembatan(t);
  aturDebu(t);
}

// ---------------------------------------------------------------- teks HTML
const elKepala = $("kepala");
const elPenutup = $("kepala-akhir");
const elKet = [...document.querySelectorAll(".ket")];
const elAjakan = $("ajakan");
const elSumber = $("sumber");
function aturTeks(t) {
  const [km, kmS, kk, kkS] = T.kepala;
  const kIn = keluar3(rentang(t, km, kmS));
  elKepala.style.opacity = String(kIn * (1 - halus(rentang(t, kk, kkS))));
  elKepala.style.transform = `translateY(${((1 - kIn) * 12).toFixed(2)}px)`;
  KETERANGAN.forEach(([a, b0, b1], i) => {
    const k = keluar3(rentang(t, a, a + 0.5));
    elKet[i].style.opacity = String(k * (1 - halus(rentang(t, b0, b1))));
    elKet[i].style.transform = `translateY(${((1 - k) * 16).toFixed(2)}px)`;
  });
  const kp = keluar3(rentang(t, T.penutup[0], T.penutup[1]));
  elPenutup.style.opacity = String(kp);
  elPenutup.style.transform = `translateY(${((1 - kp) * 12).toFixed(2)}px)`;
  const ka = keluar3(rentang(t, T.ajakan[0], T.ajakan[1]));
  elAjakan.style.opacity = String(ka);
  elAjakan.style.transform = `scale(${(0.92 + 0.08 * ka).toFixed(4)})`;
  elSumber.style.opacity = String(0.45 * keluar3(rentang(t, T.sumber[0], T.sumber[1])));
}

// ---------------------------------------------------------------- kontrak halaman
function tampilkan(t) {
  t = klem(t, 0, DURASI);
  const k = kameraPada(t);
  aturKamera(k);
  matahari.target.position.set(k.fx, 0, k.fz);
  matahari.position.set(k.fx, 0, k.fz).addScaledVector(ARAH_CAHAYA, 50);
  matahari.target.updateMatrixWorld();
  bahanTanah.uniforms.uFokus.value.set(k.fx, 0, k.fz);
  bahanTanah.uniforms.uJari.value = 20 * keluar3(rentang(t, T.grid[0], T.grid[1]));
  aturDunia(t);
  composer.render();
  aturTeks(t);
}

window.DURASI = DURASI;
window.tampilkan = tampilkan;
window.siap = (async () => {
  await Promise.all([
    '700 50px "Noto Serif"', 'italic 700 52px "Noto Serif"', '600 40px "DM Sans"',
    '500 19px "JetBrains Mono"', '600 22px "JetBrains Mono"', '700 22px "JetBrains Mono"', '700 38px "JetBrains Mono"',
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
