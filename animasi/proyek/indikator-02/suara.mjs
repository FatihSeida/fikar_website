/**
 * Efek suara untuk Reels indikator 02 (21 detik), disintesis di kode. Tanpa sampel, tanpa musik.
 * Pola dari ekosistem-berbasis-bukti/suara.mjs, disalin dan disesuaikan.
 *
 *   node indikator-02/suara.mjs      (dari folder animasi/)
 *
 * → hasil/indikator-02.wav            48 kHz, stereo, 16-bit, tepat 21,000 detik
 * → hasil/indikator-02-suara.mp4      video disalin apa adanya + AAC 192k
 * → hasil/indikator-02-gelombang.png  gambar gelombang
 *
 * Waktu setiap isyarat dibaca dari isyarat.js (sumber yang sama dengan adegan.js), dan posisi kiri-kanan
 * dihitung dari tata.js (tata letak yang sama dengan gambar), jadi suara tidak bisa bergeser dari gambar.
 * Semua derau memakai acak berbenih, jadi hasilnya selalu sama.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DURASI, T, acak, daftarDebu, waktuLangkah } from "./isyarat.js";
import {
  kameraPada, keLayarMurni, xBlokKiri, xBlokKanan, xPapan, yPapan, G, ATAS, Z_KIRI, Z_KANAN, Z_JEMBATAN, KOM, GERBANG, KELAS,
  FIGUR_KOM, jalurSeberang, titikPolyline, posisiKeliling, pelempar,
} from "./tata.js";

const folder = dirname(fileURLToPath(import.meta.url));
const hasil = resolve(folder, "..", "..", "hasil");
const NAMA = "indikator-02";
const SR = 48000;
const N = Math.round(DURASI * SR);
const TARGET_LUFS = -18;
const PLAFON_DB = -2.0; // batas puncak sampel; puncak sejati diperiksa ffmpeg (harus ≤ −1 dBTP)

const KIRI = new Float64Array(N);
const KANAN = new Float64Array(N);
const DUA_PI = 2 * Math.PI;
const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
const sin2 = (x) => Math.pow(Math.sin((Math.PI / 2) * klem(x)), 2);
const turun = (τ, a, b) => (τ < a ? 1 : 1 - halus((τ - a) / (b - a))); // pelepasan halus

function panGain(pan) {
  const a = ((klem(pan, -1, 1) + 1) * Math.PI) / 4;
  return [Math.cos(a), Math.sin(a)];
}
// Posisi kiri-kanan dari titik dunia pada detik t (kira-kira mengikuti posisi x di layar).
const panDari = (p, t) => klem(((keLayarMurni(p, kameraPada(t)).x - 540) / 540) * 0.7, -0.8, 0.8);
// Pentatonik D mayor: indeks 0 = D4, 5 = D5, 10 = D6.
const nadaPenta = (n) => 293.66 * Math.pow(2, Math.floor(n / 5) + [0, 2, 4, 7, 9][((n % 5) + 5) % 5] / 12);

// ---------------------------------------------------------------- suara dasar
// Nada aditif. parsial: [rasio, amplitudo, peluruhan (detik)]. f boleh fungsi waktu (meluncur).
function nada(t0, { f, dur, serang = 0.004, lepas = 0.02, parsial = [[1, 1, 0.3]], gain = 0.1, pan = 0, bentuk = null }) {
  const i0 = Math.round(t0 * SR);
  const n = Math.round(dur * SR);
  const fasa = new Float64Array(parsial.length);
  for (let k = 0; k < n; k++) {
    const i = i0 + k;
    if (i >= N) break;
    const tau = k / SR;
    const fd = typeof f === "function" ? f(tau) : f;
    let s = 0;
    for (let p = 0; p < parsial.length; p++) {
      const [r, a, d] = parsial[p];
      fasa[p] += (DUA_PI * fd * r) / SR;
      if (fd * r > 7500) continue; // tidak ada yang tajam di atas ~8 kHz
      s += Math.sin(fasa[p]) * a * Math.exp(-tau / d);
    }
    let v = s * gain * (serang > 0 ? sin2(tau / serang) : 1) * klem((n - k) / (lepas * SR));
    if (bentuk) v *= bentuk(tau);
    if (i < 0) continue;
    const [gl, gr] = panGain(typeof pan === "function" ? pan(tau) : pan);
    KIRI[i] += v * gl;
    KANAN[i] += v * gr;
  }
}
// Derau putih berbenih lewat filter state-variable (TPT) dengan frekuensi yang boleh berubah.
let benihDerau = 2000;
function derau(t0, { dur, fc, q = 0.7, jenis = "bp", bentuk, gain = 0.1, pan = 0 }) {
  const rng = acak(benihDerau++);
  const i0 = Math.round(t0 * SR);
  const n = Math.round(dur * SR);
  let ic1 = 0, ic2 = 0;
  for (let k = 0; k < n; k++) {
    const i = i0 + k;
    if (i >= N) break;
    const tau = k / SR;
    const x = rng() * 2 - 1;
    const fz = Math.min(typeof fc === "function" ? fc(tau) : fc, 7500);
    const g = Math.tan((Math.PI * fz) / SR);
    const kk = 1 / q;
    const a1 = 1 / (1 + g * (g + kk)), a2 = g * a1, a3 = g * a2;
    const v3 = x - ic2;
    const v1 = a1 * ic1 + a2 * v3;
    const v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1;
    ic2 = 2 * v2 - ic2;
    const y = jenis === "lp" ? v2 : v1;
    const v = y * gain * bentuk(tau) * klem((n - k) / (0.006 * SR));
    if (i < 0) continue;
    const [gl, gr] = panGain(typeof pan === "function" ? pan(tau) : pan);
    KIRI[i] += v * gl;
    KANAN[i] += v * gr;
  }
}
// Hentakan rendah (dentum) dengan nada turun.
function dentum(t0, { f0 = 110, f1 = 55, lama = 0.3, gain = 0.3, pan = 0 }) {
  nada(t0, { f: (τ) => f1 + (f0 - f1) * Math.exp(-τ / 0.05), dur: lama + 0.1, serang: 0.002, lepas: 0.06, parsial: [[1, 1, lama * 0.45], [2, 0.25, lama * 0.25]], gain, pan });
}

// ---------------------------------------------------------------- daftar isyarat (semua waktu dari isyarat.js)
const akhir = 99; // keadaan sesudah semua gerak selesai
const posKelas = (t) => ({ x: xBlokKiri(t) + (KELAS.x0 + KELAS.x1) / 2, y: 1, z: Z_KIRI + (KELAS.z0 + KELAS.z1) / 2 });
function daftarIsyarat() {
  const r = acak(31);
  const vel = () => 0.88 + 0.24 * r();
  const L = [];
  L.push({ t: 0.0, jenis: "udara-buka", dur: 1.6 });
  L.push({ t: T.blokMuncul, jenis: "blok-muncul" });
  const posBenda = [
    { x: xBlokKiri(0.7) + GERBANG.x, y: 1, z: Z_KIRI + GERBANG.z },
    posKelas(0.8),
    { x: xBlokKanan(0.9) + KOM.x, y: 1, z: Z_KANAN + KOM.z },
    posKelas(1.0),
    { x: xBlokKanan(1.1) + FIGUR_KOM[0][0], y: 0.5, z: Z_KANAN + FIGUR_KOM[0][1] },
  ];
  T.bendaMuncul.forEach((t, k) => L.push({ t, jenis: "benda-muncul", k, pan: panDari(posBenda[k], t), vel: vel() }));
  L.push({ t: T.geser[0], jenis: "gesek-blok", dur: T.geser[1] - T.geser[0] });
  for (const d of daftarDebu()) {
    const x = d.sisi < 0 ? xBlokKiri(d.t0) + 2.5 : xBlokKanan(d.t0) - 2.5;
    L.push({ t: d.t0 + 0.05, jenis: "debu-tik", pan: panDari({ x, y: ATAS, z: (d.sisi < 0 ? Z_KIRI : Z_KANAN) + d.dz }, d.t0), vel: vel() });
  }
  L.push({ t: T.denyut[0], jenis: "denyut-cermin", dur: T.denyut[1] - T.denyut[0] });
  T.lempar.forEach((tL, i) => {
    const p = posisiKeliling(0, pelempar(i), akhir);
    const asal = { x: xBlokKiri(tL) + p.x, y: ATAS + 0.6, z: Z_KIRI + p.z };
    const tuju = { x: xPapan(i), y: yPapan, z: Z_JEMBATAN };
    L.push({ t: tL, jenis: "kertas-terbang", dur: T.terbang, i, pan0: panDari(asal, tL), pan1: panDari(tuju, tL + T.terbang), vel: vel() });
    L.push({ t: tL + T.terbang + T.ubah, jenis: "papan-pasang", i, pan: panDari(tuju, tL + 0.6), vel: vel() });
  });
  T.klik.forEach((t, i) => L.push({ t, jenis: "klik-emas", k: 4 - i, pan: panDari({ x: xPapan(i), y: yPapan, z: Z_JEMBATAN }, t) }));
  L.push({ t: Math.min(...T.klik), jenis: "lonceng-emas" });
  L.push({ t: T.pulih[0], jenis: "pulih", dur: 1.8, pan: panDari({ x: xBlokKanan(akhir) + KOM.x, y: 1, z: Z_KANAN + KOM.z }, T.pulih[0]) });
  for (const s of waktuLangkah()) {
    const [a, b] = T.seberang;
    const q = titikPolyline(jalurSeberang(s.anggota), klem((s.t - a) / (b - a)));
    const diJembatan = q.x > G.x - 1.5 && q.x < G.x + 1.5;
    L.push({ t: s.t, jenis: "langkah", laju: s.laju, kayu: diJembatan, anggota: s.anggota, pan: panDari({ x: q.x, y: ATAS, z: q.z }, s.t), vel: vel() });
  }
  L.push({ t: T.penutup[0], jenis: "akor-penutup" });
  return L.sort((p, q) => p.t - q.t);
}
// Peristiwa gambar untuk memeriksa sinkron (t, pita frekuensi tempat bunyinya paling jelas).
const PERIKSA = [
  { nama: "blok muncul", t: T.blokMuncul, pita: "rendah" },
  { nama: "kertas 1 dilempar", t: T.lempar[0], pita: "tinggi" },
  { nama: "papan 1 terpasang", t: T.lempar[0] + T.terbang + T.ubah, pita: "rendah" },
  { nama: "klik emas pertama", t: Math.min(...T.klik), pita: "tinggi" },
  { nama: "langkah (laju penuh)", t: waktuLangkah().find((s) => s.laju >= 0.8).t, pita: "rendah" },
  { nama: "akor penutup", t: T.penutup[0], pita: "rendah" },
];

// ---------------------------------------------------------------- palet suara: lembut, hangat, digital
const SUARA = {
  // Grid menyala: udara lembut yang mengembang.
  "udara-buka": (c) => derau(c.t, {
    dur: c.dur, fc: (τ) => 260 * Math.pow(800 / 260, klem(τ / c.dur)), q: 0.8,
    bentuk: (τ) => sin2(τ / 0.5) * turun(τ, 0.8, c.dur), gain: 0.12, pan: (τ) => -0.15 + (0.3 * τ) / c.dur,
  }),
  // Dua blok tanah muncul: dentum lembut.
  "blok-muncul": (c) => {
    dentum(c.t, { f0: 120, f1: 62, lama: 0.4, gain: 0.2 });
    derau(c.t, { dur: 0.3, fc: 320, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.004) * Math.exp(-τ / 0.07), gain: 0.14 });
  },
  // Gerbang, kelas, komisariat, figur: letup kecil bernada.
  "benda-muncul": (c) => nada(c.t, {
    f: (τ) => nadaPenta(2 + c.k) * (1 + 0.12 * Math.exp(-τ / 0.012)), dur: 0.45, serang: 0.003, lepas: 0.15,
    parsial: [[1, 1, 0.09], [2, 0.14, 0.05]], gain: 0.045 * c.vel, pan: c.pan,
  }),
  // Blok bergeser menjauh: gemuruh gesek rendah, kuatnya mengikuti laju geser (halus: puncak di tengah).
  "gesek-blok": (c) => {
    const lama = c.dur + 0.15;
    const laju = (τ) => { const u = klem(τ / c.dur); return 4 * u * (1 - u); };
    const amplop = (τ) => sin2(τ / 0.35) * (0.25 + 0.75 * laju(τ)) * turun(τ, c.dur - 0.45, lama);
    const gerinda = (τ) => 0.7 + 0.3 * (0.5 * Math.sin(DUA_PI * 6.3 * τ) + 0.3 * Math.sin(DUA_PI * 9.7 * τ + 1.3) + 0.2 * Math.sin(DUA_PI * 14.1 * τ + 2.1));
    derau(c.t, { dur: lama, fc: 170, q: 0.7, jenis: "lp", bentuk: (τ) => amplop(τ) * gerinda(τ), gain: 0.55 });
    derau(c.t, { dur: lama, fc: 420, q: 1.8, bentuk: (τ) => amplop(τ) * Math.pow(0.5 + 0.5 * Math.sin(DUA_PI * 21 * τ + 3 * Math.sin(τ * 5)), 3), gain: 0.05 });
    nada(c.t, { f: (τ) => 62 + 3 * Math.sin(DUA_PI * 0.7 * τ), dur: lama, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.5, 99], [3, 0.2, 99]], gain: 0.06, bentuk: amplop });
  },
  // Debu jatuh dari tepi celah: tik halus.
  "debu-tik": (c) => {
    const r = acak(Math.round(c.t * 1000));
    derau(c.t, { dur: 0.02, fc: 1800 + 1600 * r(), q: 1.3, bentuk: (τ) => sin2(τ / 0.0006) * Math.exp(-τ / 0.003), gain: 0.05 * c.vel, pan: c.pan });
    nada(c.t, { f: 1300 + 700 * r(), dur: 0.05, serang: 0.0008, parsial: [[1, 1, 0.01]], gain: 0.008 * c.vel, pan: c.pan });
  },
  // Denyut cermin: nada lembut yang membesar dan mengecil bersama denyut tepi celah (periode 1,2 detik).
  "denyut-cermin": (c) => {
    const e = (τ) => Math.pow(0.5 - 0.5 * Math.cos((DUA_PI * τ) / T.periodeDenyut), 1.4);
    const lembut = [[1, 1, 99], [2, 0.3, 99], [3, 0.08, 99]];
    nada(c.t, { f: 146.83, dur: c.dur, serang: 0, lepas: 0.05, parsial: lembut, gain: 0.08, bentuk: e, pan: -0.15 });
    nada(c.t, { f: 147.4, dur: c.dur, serang: 0, lepas: 0.05, parsial: lembut, gain: 0.05, bentuk: e, pan: 0.15 });
    nada(c.t, { f: 220, dur: c.dur, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.15, 99]], gain: 0.03, bentuk: e });
    derau(c.t, { dur: c.dur, fc: 650, q: 1.6, bentuk: (τ) => 0.8 * e(τ), gain: 0.022 });
  },
  // Kertas survei terbang melengkung: desir kertas dengan getar halus, bergerak kiri → kanan.
  "kertas-terbang": (c) => {
    const lama = c.dur + 0.06;
    const pan = (τ) => c.pan0 + (c.pan1 - c.pan0) * klem(τ / c.dur);
    derau(c.t, { dur: 0.02, fc: 2200, q: 1.4, bentuk: (τ) => sin2(τ / 0.0005) * Math.exp(-τ / 0.003), gain: 0.07 * c.vel, pan: c.pan0 });
    derau(c.t, {
      dur: lama, fc: (τ) => 800 + 2000 * Math.sin(Math.PI * klem(τ / c.dur)), q: 1.1,
      bentuk: (τ) => Math.pow(Math.sin(Math.PI * klem(τ / c.dur)), 1.3) * (0.75 + 0.25 * Math.sin(DUA_PI * 28 * τ)), gain: 0.13 * c.vel, pan,
    });
  },
  // Kertas menjadi papan: ketuk kayu yang hangat.
  "papan-pasang": (c) => {
    nada(c.t, { f: 205 + 12 * c.i, dur: 0.4, serang: 0.0015, lepas: 0.1, parsial: [[1, 1, 0.075], [2.62, 0.4, 0.035], [4.9, 0.12, 0.016]], gain: 0.17 * c.vel, pan: c.pan });
    dentum(c.t, { f0: 140, f1: 84, lama: 0.2, gain: 0.17 * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.08, fc: 850, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.012), gain: 0.16 * c.vel, pan: c.pan });
  },
  // Jembatan berubah emas: klik renyah per papan, nada naik mengikuti riak kiri → kanan.
  "klik-emas": (c) => {
    derau(c.t, { dur: 0.018, fc: 3000, q: 1.4, bentuk: (τ) => sin2(τ / 0.0004) * Math.exp(-τ / 0.0025), gain: 0.2, pan: c.pan });
    nada(c.t, { f: 1900, dur: 0.1, serang: 0.0005, parsial: [[1, 1, 0.018], [1.62, 0.4, 0.012]], gain: 0.045, pan: c.pan });
    nada(c.t + 0.004, { f: nadaPenta(10 + c.k), dur: 0.7, serang: 0.003, lepas: 0.2, parsial: [[1, 1, 0.25], [2, 0.12, 0.12]], gain: 0.035, pan: c.pan });
  },
  // Lonceng hangat saat jembatan menjadi emas.
  "lonceng-emas": (c) => {
    const lonceng = [[1, 1, 1.3], [2, 0.32, 0.8], [2.76, 0.16, 0.5], [4.07, 0.06, 0.25]];
    [5, 7, 8].forEach((n, k) => nada(c.t + 0.03 * k, { f: nadaPenta(n), dur: 2.6, serang: 0.004, lepas: 0.5, parsial: lonceng, gain: 0.06 - 0.01 * k, pan: -0.2 + 0.2 * k }));
    nada(c.t, { f: nadaPenta(0), dur: 2.4, serang: 0.03, lepas: 0.6, parsial: [[1, 1, 1.2], [2, 0.2, 0.6]], gain: 0.045 });
  },
  // Komisariat kembali berwarna: alas hangat yang pelan.
  "pulih": (c) => {
    const bentuk = (τ) => sin2(τ / 0.4) * turun(τ, 0.6, c.dur);
    for (const f of [146.83, 220]) nada(c.t, { f, dur: c.dur, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.18, 99]], gain: 0.028, pan: c.pan, bentuk });
  },
  // Langkah dua figur yang menyeberang: ketuk lembut, sedikit berbunyi kayu di atas jembatan.
  langkah: (c) => {
    const g = (0.4 + 0.6 * c.laju) * c.vel * (c.anggota ? 0.85 : 1);
    nada(c.t, { f: (τ) => 92 + 70 * Math.exp(-τ / 0.012), dur: 0.16, serang: 0.0015, lepas: 0.05, parsial: [[1, 1, 0.045]], gain: 0.13 * g, pan: c.pan });
    derau(c.t, { dur: 0.05, fc: 650, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.009), gain: 0.09 * g, pan: c.pan });
    if (c.kayu) nada(c.t, { f: 330, dur: 0.12, serang: 0.0012, lepas: 0.04, parsial: [[1, 1, 0.03], [2.7, 0.3, 0.014]], gain: 0.035 * g, pan: c.pan });
  },
  // Kartu akhir: akor yang menyelesaikan (sus4 → mayor), bertahan lalu memudar sebelum akhir.
  "akor-penutup": (c) => {
    const sisa = DURASI - c.t - 0.04;
    const hangat = [[1, 1, 3], [1.0035, 0.5, 3], [2, 0.16, 1.5], [3, 0.05, 0.8]];
    const tutup = (τ) => turun(τ, sisa - 1.4, sisa);
    for (const f of [146.83, 220.0, 293.66, 440.0]) nada(c.t, { f, dur: sisa, serang: 0.09, lepas: 0.3, parsial: hangat, gain: 0.034, bentuk: tutup });
    nada(c.t, { f: 392.0, dur: 0.55, serang: 0.09, lepas: 0.12, parsial: hangat, gain: 0.034 });
    nada(c.t + 0.45, { f: 369.99, dur: sisa - 0.45, serang: 0.08, lepas: 0.3, parsial: hangat, gain: 0.034, bentuk: (τ) => tutup(τ + 0.45) });
  },
};

// ---------------------------------------------------------------- susun
const isyarat = daftarIsyarat();
for (const c of isyarat) {
  if (!SUARA[c.jenis]) throw new Error(`Tidak ada suara untuk isyarat "${c.jenis}"`);
  SUARA[c.jenis](c);
}
if (process.env.DIAG) { // puncak tiap jenis isyarat sebelum mastering (untuk menyeimbangkan gain)
  const per = {};
  for (const c of isyarat) {
    let p = 0;
    for (let i = Math.round(c.t * SR); i < Math.min(N, Math.round((c.t + Math.max(0.25, c.dur || 0)) * SR)); i++) p = Math.max(p, Math.abs(KIRI[i]), Math.abs(KANAN[i]));
    per[c.jenis] = Math.max(per[c.jenis] || 0, p);
  }
  for (const [j, p] of Object.entries(per)) console.log(`  ${j.padEnd(16)} ${(20 * Math.log10(p + 1e-9)).toFixed(1)} dB`);
}

// ---------------------------------------------------------------- mastering
function biquad(x, b0, b1, b2, a1, a2) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const y = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}
function lowpass(x, fc, q = Math.SQRT1_2) {
  const w = (DUA_PI * fc) / SR, al = Math.sin(w) / (2 * q), c = Math.cos(w), a0 = 1 + al;
  return biquad(x, (1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0, (-2 * c) / a0, (1 - al) / a0);
}
function highpass(x, fc, q = Math.SQRT1_2) {
  const w = (DUA_PI * fc) / SR, al = Math.sin(w) / (2 * q), c = Math.cos(w), a0 = 1 + al;
  return biquad(x, (1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, (-2 * c) / a0, (1 - al) / a0);
}
// Kenyaringan terintegrasi ITU-R BS.1770 (bobot K, blok 400 ms, gerbang −70 dan −10 LU).
function lufs(l, r) {
  const n = l.length;
  const kw = (x) => biquad(biquad(x, 1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585), 1, -2, 1, -1.99004745483398, 0.99007225036621);
  const yl = kw(l), yr = kw(r);
  const pre = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + yl[i] * yl[i] + yr[i] * yr[i];
  const blok = Math.round(0.4 * SR), langkah = Math.round(0.1 * SR);
  const z = [];
  for (let s = 0; s + blok <= n; s += langkah) z.push((pre[s + blok] - pre[s]) / blok);
  const keL = (v) => -0.691 + 10 * Math.log10(v);
  const lolos1 = z.filter((v) => keL(v) > -70);
  const gerbang2 = keL(lolos1.reduce((a, b) => a + b, 0) / lolos1.length) - 10;
  const lolos2 = lolos1.filter((v) => keL(v) > gerbang2);
  return keL(lolos2.reduce((a, b) => a + b, 0) / lolos2.length);
}
// Pembatas puncak dengan pandang-depan 1,5 ms dan pelepasan 80 ms (kiri-kanan terkait).
function batasi(l, r, plafon) {
  const la = Math.round(0.0015 * SR);
  const perlu = new Float64Array(N);
  for (let i = 0; i < N; i++) { const p = Math.max(Math.abs(l[i]), Math.abs(r[i])); perlu[i] = p > plafon ? plafon / p : 1; }
  const tahan = new Float64Array(N);
  const dq = new Int32Array(N);
  let kepala = 0, ekor = 0;
  for (let i = N - 1; i >= 0; i--) {
    while (ekor > kepala && perlu[dq[ekor - 1]] >= perlu[i]) ekor--;
    dq[ekor++] = i;
    while (dq[kepala] > i + la) kepala++;
    tahan[i] = perlu[dq[kepala]];
  }
  const lepas = 1 - Math.exp(-1 / (0.08 * SR));
  const out = new Float64Array(N);
  let g = 1;
  for (let i = 0; i < N; i++) { g = tahan[i] < g ? tahan[i] : g + (1 - g) * lepas; out[i] = g; }
  let jum = 0;
  for (let i = 0; i < N; i++) {
    jum += out[i]; if (i > la) jum -= out[i - la - 1];
    const h = Math.min(out[i], jum / Math.min(i + 1, la + 1));
    l[i] *= h; r[i] *= h;
  }
}
// Butterworth orde 4 di 7,5 kHz (dua biquad): tidak ada yang tajam di atas ~8 kHz.
const lp8 = (x) => lowpass(lowpass(x, 7500, 0.5412), 7500, 1.3066);
const L = highpass(lp8(KIRI), 30);
const R = highpass(lp8(KANAN), 30);
const plafon = Math.pow(10, PLAFON_DB / 20);
const awal = lufs(L, R);
let gainTotal = 1;
for (let ulang = 0; ulang < 6; ulang++) {
  const gain = Math.pow(10, (TARGET_LUFS - lufs(L, R)) / 20);
  gainTotal *= gain;
  for (let i = 0; i < N; i++) { L[i] *= gain; R[i] *= gain; }
  batasi(L, R, plafon);
  if (Math.abs(lufs(L, R) - TARGET_LUFS) < 0.05) break;
}
for (let i = 0; i < N; i++) { // ujung berkas tanpa klik
  const f = Math.min(1, i / (0.002 * SR), (N - 1 - i) / (0.03 * SR));
  L[i] *= f; R[i] *= f;
}

// ---------------------------------------------------------------- WAV 16-bit
const data = Buffer.alloc(N * 4);
let puncak = 0;
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767))), i * 4);
  data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767))), i * 4 + 2);
  puncak = Math.max(puncak, Math.abs(L[i]), Math.abs(R[i]));
}
const kepalaWav = Buffer.alloc(44);
kepalaWav.write("RIFF", 0); kepalaWav.writeUInt32LE(36 + data.length, 4); kepalaWav.write("WAVE", 8);
kepalaWav.write("fmt ", 12); kepalaWav.writeUInt32LE(16, 16); kepalaWav.writeUInt16LE(1, 20); kepalaWav.writeUInt16LE(2, 22);
kepalaWav.writeUInt32LE(SR, 24); kepalaWav.writeUInt32LE(SR * 4, 28); kepalaWav.writeUInt16LE(4, 32); kepalaWav.writeUInt16LE(16, 34);
kepalaWav.write("data", 36); kepalaWav.writeUInt32LE(data.length, 40);
const berkasWav = resolve(hasil, `${NAMA}.wav`);
writeFileSync(berkasWav, Buffer.concat([kepalaWav, data]));
console.log(`${berkasWav}\n  ${isyarat.length} isyarat, ${(N / SR).toFixed(3)} s, kenyaringan sebelum/sesudah: ${awal.toFixed(1)} → ${lufs(L, R).toFixed(2)} LUFS, puncak sampel ${(20 * Math.log10(puncak)).toFixed(2)} dBFS, penguatan ${(20 * Math.log10(gainTotal)).toFixed(1)} dB`);

// ---------------------------------------------------------------- gabungkan dengan video, gambar gelombang
const video = resolve(hasil, `${NAMA}.mp4`);
const keluaran = resolve(hasil, `${NAMA}-suara.mp4`);
if (!existsSync(video)) throw new Error(`Video belum ada: ${video}`);
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", video, "-i", berkasWav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", keluaran], { stdio: "inherit" });
if (ff.status !== 0) throw new Error(`ffmpeg keluar dengan kode ${ff.status}`);
console.log(keluaran);
const gambar = resolve(hasil, `${NAMA}-gelombang.png`);
const gw = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", berkasWav, "-filter_complex", "showwavespic=s=2100x500:split_channels=1:colors=0xC9A85C|0x2FB37A:scale=sqrt", "-frames:v", "1", gambar], { stdio: "inherit" });
if (gw.status !== 0) throw new Error("gagal membuat gambar gelombang");
console.log(gambar);

// ---------------------------------------------------------------- periksa sinkron dari audio MP4 yang sudah jadi (didekode ulang)
// Awal bunyi = saat energi (jendela 1 ms) naik 10 dB di atas latar 30–80 ms sebelum waktu gambar.
{
  const dek = spawnSync("ffmpeg", ["-loglevel", "error", "-i", keluaran, "-map", "0:a:0", "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 64 * 1024 * 1024 });
  if (dek.status !== 0) throw new Error("gagal mendekode audio MP4");
  const buf = dek.stdout;
  const mono = new Float64Array(buf.length / 4);
  for (let i = 0; i < mono.length; i++) mono[i] = buf.readFloatLE(i * 4);
  const pita = { tinggi: highpass(highpass(mono, 1200), 1200), rendah: lowpass(lowpass(mono, 250), 250) };
  const BINGKAI = 0.001 * SR;
  console.log("\n  peristiwa                gambar (t, frame)      bunyi mulai (MP4)   selisih");
  for (const p of PERIKSA) {
    const x = pita[p.pita];
    const energi = (t) => { const i = Math.round(t * SR); let s = 0; for (let k = 0; k < BINGKAI; k++) s += (x[i + k] || 0) ** 2; return s / BINGKAI; };
    let latar = 0;
    for (let t = p.t - 0.08; t < p.t - 0.03; t += 0.001) latar += energi(t) / 50;
    const ambang = Math.max(latar * 10, 1e-9);
    let mulai = null;
    for (let t = p.t - 0.03; t < p.t + 0.1; t += 0.0005) if (energi(t) > ambang && energi(t + 0.001) > ambang) { mulai = t; break; }
    const sel = mulai === null ? "tidak ketemu" : `${((mulai - p.t) * 1000).toFixed(0).padStart(4)} ms`;
    console.log(`  ${p.nama.padEnd(22)} ${p.t.toFixed(3).padStart(7)} s (#${(p.t * 30).toFixed(1).padStart(5)})   ${mulai === null ? "      -     " : mulai.toFixed(4) + " s"}        ${sel}   [pita ${p.pita}]`);
  }
}
