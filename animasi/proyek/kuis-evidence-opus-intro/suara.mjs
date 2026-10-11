/**
 * Efek suara untuk Reels kuis-evidence-opus-intro (38 detik), disintesis di kode. Tanpa sampel, tanpa musik.
 *
 *   node kuis-evidence-opus-intro/suara.mjs      (dari folder animasi/)
 *
 * → hasil/kuis-evidence-opus-intro.wav        48 kHz, stereo, 16-bit, tepat 38,000 detik
 * → hasil/kuis-evidence-opus-intro-suara.mp4  video disalin apa adanya + AAC 192k
 *
 * Waktu setiap isyarat dibaca dari isyarat.js, sumber yang sama dengan adegan.js, jadi suara tidak bisa
 * bergeser dari gambar. Semua derau memakai acak berbenih, jadi hasilnya selalu sama.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DURASI_TOTAL, daftarIsyarat, peristiwaPeriksa, acak, T_PINDAI, T_MENARA } from "./isyarat.js";

const folder = dirname(fileURLToPath(import.meta.url));
const hasil = resolve(folder, "..", "..", "hasil");
const NAMA = "kuis-evidence-opus-intro";
const SR = 48000;
const N = Math.round(DURASI_TOTAL * SR);
const TARGET_LUFS = -18;
const PLAFON_DB = -2.0; // batas puncak sampel; puncak sejati diperiksa ffmpeg (harus ≤ −1 dBTP)

const KIRI = new Float64Array(N);
const KANAN = new Float64Array(N);
const DUA_PI = 2 * Math.PI;
const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
const masukKeluar3 = (x) => { x = klem(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const sin2 = (x) => Math.pow(Math.sin((Math.PI / 2) * klem(x)), 2);

function panGain(pan) {
  const a = ((klem(pan, -1, 1) + 1) * Math.PI) / 4;
  return [Math.cos(a), Math.sin(a)];
}
// Pentatonik D mayor: indeks 0 = D4, 5 = D5, 10 = D6, 15 = D7.
const nadaPenta = (n) => 293.66 * Math.pow(2, Math.floor(n / 5) + [0, 2, 4, 7, 9][((n % 5) + 5) % 5] / 12);

// ---------------------------------------------------------------- suara dasar
// Nada aditif. parsial: [rasio, amplitudo, peluruhan (detik)]. f boleh fungsi waktu (meluncur).
function nada(t0, { f, dur, serang = 0.004, lepas = 0.01, parsial = [[1, 1, 0.3]], gain = 0.1, pan = 0, bentuk = null, getar = null }) {
  const i0 = Math.round(t0 * SR);
  const n = Math.round(dur * SR);
  const [gl, gr] = typeof pan === "number" ? panGain(pan) : [0, 0];
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
      if (fd * r > 8000) continue; // tidak ada yang tajam di atas ~8 kHz
      s += Math.sin(fasa[p]) * a * Math.exp(-tau / d);
    }
    let v = s * gain * (serang > 0 ? sin2(tau / serang) : 1) * klem((n - k) / (lepas * SR));
    if (bentuk) v *= bentuk(tau);
    if (getar) v *= 1 - getar.dalam * (0.5 + 0.5 * Math.sin(DUA_PI * getar.laju * tau));
    if (i < 0) continue;
    if (typeof pan === "number") { KIRI[i] += v * gl; KANAN[i] += v * gr; }
    else { const [a, b] = panGain(pan(tau)); KIRI[i] += v * a; KANAN[i] += v * b; }
  }
}

// Derau putih berbenih lewat filter state-variable (TPT) dengan frekuensi yang boleh berubah.
let benihDerau = 1000;
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
    const fz = Math.min(typeof fc === "function" ? fc(tau) : fc, 9000);
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

// ---------------------------------------------------------------- palet suara
const SUARA = {
  // Pembuka: desir udara saat gambar terbuka.
  "desir-buka": (c) => derau(c.t, {
    dur: c.dur, fc: (τ) => 350 * Math.pow(1600 / 350, klem(τ / 1.4)), q: 0.75,
    bentuk: (τ) => (τ < 0.45 ? sin2(τ / 0.45) : Math.pow(Math.cos((Math.PI / 2) * klem((τ - 0.45) / (c.dur - 0.45))), 2)),
    gain: 0.42, pan: (τ) => -0.25 + (0.5 * τ) / c.dur,
  }),
  // Desis pindai yang mengikuti tirai cahaya (bergerak linear).
  "sapu-pindai": (c) => {
    const lama = T_PINDAI[1] - T_PINDAI[0];
    derau(c.t, {
      dur: c.dur, fc: (τ) => 520 * Math.pow(2, 1.8 * klem(τ / lama)), q: 3.2,
      bentuk: (τ) => sin2(τ / 0.3) * (1 - halus((τ - (lama - 0.15)) / 0.4)) * (1 + 0.15 * Math.sin(DUA_PI * 7 * τ)),
      gain: 0.15, pan: 0,
    });
  },
  // Denting lembut saat gedung berkondisi baik menyala.
  denting: (c) => nada(c.t, { f: nadaPenta(c.nada), dur: 1.0, serang: 0.004, parsial: [[1, 1, 0.42], [2, 0.16, 0.22], [3.01, 0.05, 0.12]], gain: 0.085 * c.vel, pan: c.pan }),
  // Plink naik saat gedung redup diperbaiki satu per satu.
  "plink-baik": (c) => nada(c.t, { f: nadaPenta(c.nada), dur: 0.6, serang: 0.003, parsial: [[1, 1, 0.17], [2.76, 0.12, 0.07], [5.4, 0.04, 0.035]], gain: 0.08 * c.vel, pan: c.pan }),
  // Kubus emas masuk ke tanah: dentum rendah yang lembut.
  "dentum-emas": (c) => {
    nada(c.t, { f: (τ) => 70 + 45 * Math.exp(-τ / 0.12), dur: 0.9, serang: 0.012, parsial: [[1, 1, 0.35], [2, 0.25, 0.2]], gain: 0.3 });
    derau(c.t, { dur: 0.35, fc: 320, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.01) * Math.exp(-τ / 0.08), gain: 0.25 });
  },
  // Kamera turun ke papan: desir yang menurun.
  "desir-turun": (c) => derau(c.t, {
    dur: c.dur - 0.02, fc: (τ) => 1500 * Math.pow(320 / 1500, klem(τ / c.dur)), q: 0.8,
    bentuk: (τ) => (τ < 0.9 ? sin2(τ / 0.9) : Math.pow(Math.cos((Math.PI / 2) * klem((τ - 0.9) / (c.dur - 0.95))), 2)),
    gain: 0.38, pan: 0,
  }),
  // Percik menyalakan jalur: desis listrik yang mengikuti kecepatan percik (kurva halus2 yang sama).
  "desis-jalur": (c) => {
    const laju = (τ) => { const x = klem(τ / c.dur); return (30 * x * x * (1 - x) * (1 - x)) / 1.875; };
    const bentuk = (τ) => (0.15 + 0.85 * laju(τ)) * sin2(τ / 0.08) * klem((c.dur - τ) / 0.1 + 0.001);
    nada(c.t, {
      f: (τ) => 240 + 900 * laju(τ), dur: c.dur, serang: 0, lepas: 0.02, gain: 0.05, bentuk,
      parsial: [[1, 1, 1e9], [2, 0.5, 1e9], [3, 0.3, 1e9], [4, 0.18, 1e9], [5, 0.1, 1e9]], pan: (τ) => -0.2 + (0.4 * τ) / c.dur,
    });
    derau(c.t, { dur: c.dur, fc: (τ) => 1800 + 2600 * laju(τ), q: 2.2, bentuk, gain: 0.1, pan: (τ) => -0.2 + (0.4 * τ) / c.dur });
  },
  // Gerbang /kuis menyala: dengung rendah yang hangat.
  "dengung-gerbang": (c) => {
    nada(c.t, { f: (τ) => 62 + 30 * (1 - Math.exp(-τ / 0.25)), dur: 1.6, serang: 0.12, lepas: 0.2, parsial: [[1, 1, 0.7], [2, 0.4, 0.5], [3, 0.12, 0.3]], gain: 0.36, pan: c.pan });
    derau(c.t, { dur: 1.0, fc: 260, q: 0.6, jenis: "lp", bentuk: (τ) => sin2(τ / 0.12) * Math.exp(-τ / 0.35), gain: 0.22, pan: c.pan });
  },
  // Ketukan tombol saat alamat diketik.
  ketik: (c) => {
    derau(c.t, { dur: 0.022, fc: 2400 + 500 * (c.vel - 0.88) / 0.24, q: 1.6, bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.0045), gain: 0.24 * c.vel, pan: c.pan });
    nada(c.t, { f: 1900, dur: 0.02, serang: 0.0008, parsial: [[1, 1, 0.007]], gain: 0.02 * c.vel, pan: c.pan });
  },
  // Klik antarmuka saat "Mulai kuis" ditekan.
  klik: (c) => {
    derau(c.t, { dur: 0.018, fc: 3000, q: 1.2, bentuk: (τ) => sin2(τ / 0.0006) * Math.exp(-τ / 0.003), gain: 0.55, pan: c.pan });
    nada(c.t, { f: 1250, dur: 0.08, serang: 0.0006, parsial: [[1, 1, 0.022]], gain: 0.12, pan: c.pan });
    nada(c.t, { f: 430, dur: 0.1, serang: 0.0008, parsial: [[1, 1, 0.035]], gain: 0.16, pan: c.pan });
  },
  // Kilau saat kubus emas muncul.
  "kilau-muncul": (c) => [10, 12, 13, 15].forEach((n, k) => nada(c.t + [0, 0.05, 0.1, 0.16][k], {
    f: nadaPenta(n), dur: 1.0, serang: 0.012, parsial: [[1, 1, 0.45], [1.004, 0.6, 0.45]], gain: 0.045, pan: c.pan, getar: { laju: 11, dalam: 0.3 },
  })),
  // Letup lembut saat kubus mendarat.
  letup: (c) => {
    nada(c.t, { f: (τ) => 150 + 320 * Math.exp(-τ / 0.013), dur: 0.16, serang: 0.0015, parsial: [[1, 1, 0.055], [2, 0.12, 0.03]], gain: 0.34 * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.012, fc: 1400, q: 1, bentuk: (τ) => sin2(τ / 0.0005) * Math.exp(-τ / 0.002), gain: 0.1 * c.vel, pan: c.pan });
  },
  // Tik "+skor": nadanya sedikit naik sesuai skor jawaban (0–3).
  "tik-skor": (c) => nada(c.t, { f: nadaPenta(10 + c.skor), dur: 0.18, serang: 0.002, parsial: [[1, 1, 0.05], [2, 0.12, 0.03]], gain: 0.06 * c.vel, pan: c.pan }),
  // Dua nada kecil saat satu kelompok selesai.
  "lonceng-kelompok": (c) => [7 + c.g, 10 + c.g].forEach((n, k) => nada(c.t + 0.09 * k, {
    f: nadaPenta(n), dur: 1.2, serang: 0.004, parsial: [[1, 1, 0.45], [2, 0.22, 0.28], [3, 0.07, 0.16]], gain: 0.075, pan: c.pan,
  })),
  // Plink kaca untuk tiap simpul soal lanjutan.
  "plink-kaca": (c) => nada(c.t, { f: nadaPenta(c.nada), dur: 0.8, serang: 0.002, parsial: [[1, 1, 0.24], [2.76, 0.22, 0.11], [5.4, 0.06, 0.05]], gain: 0.075 * c.vel, pan: c.pan }),
  // Nada naik singkat per pilar.
  "naik-pilar": (c) => {
    const f0 = nadaPenta([0, 2, 4, 5][c.i]);
    nada(c.t, { f: (τ) => f0 * (1 + 0.5 * keluar3(τ / 0.3)), dur: 0.6, serang: 0.02, parsial: [[1, 1, 0.3], [2, 0.22, 0.2], [3, 0.06, 0.12]], gain: 0.14 * c.vel, pan: c.pan });
  },
  // Menara naik: nada meluncur mengikuti tinggi menara (kurva masukKeluar3 yang sama).
  "sapu-menara": (c) => {
    const lama = T_MENARA[1] - T_MENARA[0];
    const p = (τ) => masukKeluar3(τ / lama);
    const laju = (τ) => { const x = klem(τ / lama), d = 0.0005; return (masukKeluar3(x + d) - masukKeluar3(x - d)) / (2 * d) / 1.5; };
    const bentuk = (τ) => (0.35 + 0.65 * klem(laju(τ))) * sin2(τ / 0.2) * (τ < lama ? 1 : 1 - halus((τ - lama) / 0.3));
    nada(c.t, { f: (τ) => 147 * Math.pow(2, 1.25 * p(τ)), dur: lama + 0.32, serang: 0, lepas: 0.02, parsial: [[1, 1, 1e9], [2, 0.25, 1e9], [3, 0.08, 1e9]], gain: 0.11, bentuk, pan: c.pan });
    derau(c.t, { dur: lama + 0.32, fc: (τ) => 4 * 147 * Math.pow(2, 1.25 * p(τ)), q: 1.5, bentuk, gain: 0.038, pan: c.pan });
  },
  // Lonceng jernih saat menara berhenti di "Mulai Membaca Bukti".
  "lonceng-menara": (c) => {
    nada(c.t, { f: nadaPenta(10), dur: 2.6, serang: 0.003, lepas: 0.2, parsial: [[1, 1, 1.5], [2, 0.45, 0.9], [2.76, 0.28, 0.55], [4.07, 0.14, 0.3], [5.4, 0.05, 0.18]], gain: 0.13, pan: c.pan });
    nada(c.t, { f: nadaPenta(5), dur: 2.4, serang: 0.003, lepas: 0.2, parsial: [[1, 1, 1.1], [2, 0.2, 0.6]], gain: 0.06, pan: c.pan });
  },
  // Penutup: dentum rendah lembut dan akor hangat yang menyelesaikan (sus4 → mayor).
  "dentum-penutup": (c) => {
    nada(c.t, { f: (τ) => 48 + 50 * Math.exp(-τ / 0.06), dur: 0.9, serang: 0.004, parsial: [[1, 1, 0.32], [2, 0.3, 0.15]], gain: 0.5 });
    derau(c.t, { dur: 0.25, fc: 220, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.004) * Math.exp(-τ / 0.05), gain: 0.3 });
    const sisa = DURASI_TOTAL - c.t - 0.05;
    const hangat = [[1, 1, 1.4], [1.0035, 0.5, 1.4], [2, 0.18, 0.8], [3, 0.06, 0.5]];
    for (const f of [146.83, 220.0, 293.66, 440.0]) nada(c.t + 0.01, { f, dur: sisa, serang: 0.05, lepas: 0.3, parsial: hangat, gain: 0.04 });
    nada(c.t + 0.01, { f: 392.0, dur: 0.42, serang: 0.05, lepas: 0.06, parsial: hangat, gain: 0.04 });
    nada(c.t + 0.37, { f: 369.99, dur: sisa - 0.36, serang: 0.06, lepas: 0.3, parsial: hangat, gain: 0.04 });
  },
  // Kilau kecil pada tombol alamat.
  "kilau-ajakan": (c) => [12, 13, 15].forEach((n, k) => nada(c.t + 0.045 * k, { f: nadaPenta(n), dur: 0.35, serang: 0.002, parsial: [[1, 1, 0.12], [2, 0.1, 0.06]], gain: 0.05, pan: c.pan })),
};

// ---------------------------------------------------------------- susun
const isyarat = daftarIsyarat();
for (const c of isyarat) {
  if (!SUARA[c.jenis]) throw new Error(`Tidak ada suara untuk isyarat "${c.jenis}"`);
  SUARA[c.jenis](c);
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
  const kw = (x) => biquad(biquad(x, 1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585), 1, -2, 1, -1.99004745483398, 0.99007225036621);
  const yl = kw(l), yr = kw(r);
  const pre = new Float64Array(N + 1);
  for (let i = 0; i < N; i++) pre[i + 1] = pre[i] + yl[i] * yl[i] + yr[i] * yr[i];
  const blok = Math.round(0.4 * SR), langkah = Math.round(0.1 * SR);
  const z = [];
  for (let s = 0; s + blok <= N; s += langkah) z.push((pre[s + blok] - pre[s]) / blok);
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
  const lepas = 1 - Math.exp(-1 / (0.08 * SR));
  let g = 1;
  for (let i = N - 1, minDepan = 1, antre = []; i >= 0; i--) { // minimum jendela ke depan
    antre.push(perlu[i]);
    if (antre.length > la + 1) antre.shift();
    minDepan = Math.min(...antre);
    tahan[i] = minDepan;
  }
  const out = new Float64Array(N);
  for (let i = 0; i < N; i++) { g = tahan[i] < g ? tahan[i] : g + (1 - g) * lepas; out[i] = g; }
  const hal = new Float64Array(N); // rata-rata bergerak supaya serangannya halus
  let jum = 0;
  for (let i = 0; i < N; i++) { jum += out[i]; if (i > la) jum -= out[i - la - 1]; hal[i] = Math.min(out[i], jum / Math.min(i + 1, la + 1)); }
  let minG = 1, jmlTekan = 0;
  for (let i = 0; i < N; i++) { l[i] *= hal[i]; r[i] *= hal[i]; minG = Math.min(minG, hal[i]); if (hal[i] < 0.999) jmlTekan++; }
  statPembatas = { tekananMaksDb: -20 * Math.log10(minG), persenTertekan: (100 * jmlTekan) / N };
}
let statPembatas = null;

// Butterworth orde 4 di 8 kHz (dua biquad, Q 0,541 dan 1,307): tidak ada yang tajam di atas ~8 kHz.
const lp8 = (x) => lowpass(lowpass(x, 8000, 0.5412), 8000, 1.3066);
let L = highpass(lp8(KIRI), 30);
let R = highpass(lp8(KANAN), 30);
const plafon = Math.pow(10, PLAFON_DB / 20);
const awal = lufs(L, R);
const L0 = Float64Array.from(L), R0 = Float64Array.from(R);
let gainTotal = 1;
for (let ulang = 0; ulang < 4; ulang++) {
  const kini = lufs(L, R);
  const gain = Math.pow(10, (TARGET_LUFS - kini) / 20);
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
  const a = Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767)));
  const b = Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767)));
  data.writeInt16LE(a, i * 4);
  data.writeInt16LE(b, i * 4 + 2);
  puncak = Math.max(puncak, Math.abs(L[i]), Math.abs(R[i]));
}
const kepala = Buffer.alloc(44);
kepala.write("RIFF", 0); kepala.writeUInt32LE(36 + data.length, 4); kepala.write("WAVE", 8);
kepala.write("fmt ", 12); kepala.writeUInt32LE(16, 16); kepala.writeUInt16LE(1, 20); kepala.writeUInt16LE(2, 22);
kepala.writeUInt32LE(SR, 24); kepala.writeUInt32LE(SR * 4, 28); kepala.writeUInt16LE(4, 32); kepala.writeUInt16LE(16, 34);
kepala.write("data", 36); kepala.writeUInt32LE(data.length, 40);
const berkasWav = resolve(hasil, `${NAMA}.wav`);
writeFileSync(berkasWav, Buffer.concat([kepala, data]));
console.log(`${berkasWav}\n  ${isyarat.length} isyarat, ${(N / SR).toFixed(3)} s, kenyaringan sebelum/sesudah: ${awal.toFixed(1)} → ${lufs(L, R).toFixed(2)} LUFS, puncak sampel ${(20 * Math.log10(puncak)).toFixed(2)} dBFS`);
{ // Total kerja pembatas: dibandingkan dengan sinyal yang hanya dikuatkan (tanpa pembatas).
  let maks = 0, tertekan = 0;
  for (let i = 0; i < N; i++) {
    const p = Math.max(Math.abs(L0[i]), Math.abs(R0[i])) * gainTotal;
    maks = Math.max(maks, p);
    if (p > plafon) tertekan++;
  }
  console.log(`  penguatan total ${(20 * Math.log10(gainTotal)).toFixed(1)} dB; pembatas menekan paling banyak ${(20 * Math.log10(maks / plafon)).toFixed(1)} dB, pada ${((100 * tertekan) / N).toFixed(2)}% sampel`);
}

// ---------------------------------------------------------------- periksa sinkron: awal bunyi di sekitar peristiwa gambar
{
  const mono = new Float64Array(N);
  for (let i = 0; i < N; i++) mono[i] = (L[i] + R[i]) / 2;
  const pita = {
    lebar: mono,
    tinggi: highpass(mono, 900),
    rendah: lowpass(mono, 250),
  };
  const BINGKAI = 0.001 * SR; // 1 ms
  console.log("\n  peristiwa             gambar (t, frame)    bunyi mulai   selisih");
  for (const p of peristiwaPeriksa()) {
    const x = pita[p.pita];
    const energi = (t) => { const i = Math.round(t * SR); let s = 0; for (let k = 0; k < BINGKAI; k++) s += x[i + k] ** 2; return s / BINGKAI; };
    let latar = 0;
    for (let t = p.t - 0.32; t < p.t - 0.22; t += 0.001) latar += energi(t) / 100;
    const ambang = Math.max(latar * 10, 1e-8); // +10 dB di atas latar
    let mulai = null;
    for (let t = p.t - 0.2; t < p.t + 0.2; t += 0.001) if (energi(t) > ambang && energi(t + 0.001) > ambang) { mulai = t; break; }
    const sel = mulai === null ? "tidak ketemu" : `${((mulai - p.t) * 1000).toFixed(0).padStart(4)} ms`;
    console.log(`  ${p.nama.padEnd(20)} ${p.t.toFixed(3).padStart(7)} s (#${(p.t * 30).toFixed(1).padStart(6)})   ${mulai === null ? "     -   " : (mulai.toFixed(3) + " s")}   ${sel}   [pita ${p.pita}]`);
  }
}

// ---------------------------------------------------------------- gabungkan dengan video
const video = resolve(hasil, `${NAMA}.mp4`);
const keluaran = resolve(hasil, `${NAMA}-suara.mp4`);
if (!existsSync(video)) throw new Error(`Video belum ada: ${video}`);
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", video, "-i", berkasWav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", keluaran], { stdio: "inherit" });
if (ff.status !== 0) throw new Error(`ffmpeg keluar dengan kode ${ff.status}`);
console.log(`\n${keluaran}`);
