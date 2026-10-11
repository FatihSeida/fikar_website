/**
 * Efek suara untuk Reels "Ekosistem Berbasis Bukti" (62 detik), disintesis di kode. Tanpa sampel, tanpa musik.
 *
 *   node ekosistem-berbasis-bukti/suara.mjs      (dari folder animasi/)
 *
 * → hasil/ekosistem-berbasis-bukti.wav         48 kHz, stereo, 16-bit, tepat 62,000 detik
 * → hasil/ekosistem-berbasis-bukti-suara.mp4   video disalin apa adanya + AAC 192k
 *
 * Waktu setiap isyarat dibaca dari isyarat.js, sumber yang sama dengan adegan.js, jadi suara tidak bisa
 * bergeser dari gambar. Semua derau memakai acak berbenih, jadi hasilnya selalu sama.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DURASI, T, daftarIsyarat, peristiwaPeriksa, acak } from "./isyarat.js";

const folder = dirname(fileURLToPath(import.meta.url));
const hasil = resolve(folder, "..", "..", "hasil");
const NAMA = "ekosistem-berbasis-bukti";
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

// ---------------------------------------------------------------- palet suara
const SUARA = {
  // Pembuka: udara lembut saat gambar terbuka.
  "udara-buka": (c) => derau(c.t, {
    dur: c.dur, fc: (τ) => 300 * Math.pow(900 / 300, klem(τ / c.dur)), q: 0.8,
    bentuk: (τ) => sin2(τ / 0.6) * turun(τ, 0.7, c.dur), gain: 0.22, pan: (τ) => -0.2 + (0.4 * τ) / c.dur,
  }),
  // Pintu lemari berderit: butir gesek tak beraturan, nada naik pelan, lalu ketuk kecil saat pintu berhenti.
  "derit-pintu": (c) => {
    const r = acak(404);
    let τ = 0;
    const lama = c.dur - 0.3;
    while (τ < lama) {
      const u = τ / lama;
      const f = 310 + 230 * u + 25 * Math.sin(u * 17);
      const kuat = Math.sin(Math.PI * Math.min(1, u * 1.15)) * (0.6 + 0.4 * r());
      nada(c.t + τ, { f, dur: 0.05, serang: 0.002, lepas: 0.02, parsial: [[1, 1, 0.012], [2, 0.5, 0.009], [3, 0.3, 0.007], [4.1, 0.12, 0.005]], gain: 0.07 * kuat, pan: c.pan });
      τ += 0.011 + 0.016 * r() * (1 - 0.5 * u);
    }
    derau(c.t, { dur: lama, fc: (τ) => 900 + 500 * τ / lama, q: 2.5, bentuk: (τ) => sin2(τ / 0.08) * turun(τ, lama - 0.2, lama), gain: 0.04, pan: c.pan });
    nada(c.t + lama + 0.02, { f: 180, dur: 0.25, serang: 0.002, parsial: [[1, 1, 0.05], [2.4, 0.3, 0.03]], gain: 0.09, pan: c.pan });
  },
  // Kepulan debu: desah rendah berbutir.
  "kepul-debu": (c) => {
    derau(c.t, { dur: 1.3, fc: (τ) => 1100 * Math.exp(-τ / 0.5) + 250, q: 0.6, jenis: "lp", bentuk: (τ) => sin2(τ / 0.04) * Math.exp(-τ / 0.4), gain: 0.32, pan: c.pan });
    const r = acak(77);
    for (let k = 0; k < 14; k++) {
      const tt = c.t + 0.05 + 0.6 * r() * r();
      derau(tt, { dur: 0.012, fc: 2200 + 1200 * r(), q: 1.2, bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.003), gain: 0.05 * (0.5 + r()), pan: c.pan + (r() - 0.5) * 0.6 });
    }
  },
  // Balon pesan terkirim: "bloop" naik.
  "kirim-balon": (c) => {
    nada(c.t, { f: (τ) => 430 + 380 * klem(τ / 0.16), dur: 0.32, serang: 0.008, lepas: 0.08, parsial: [[1, 1, 0.12], [2, 0.18, 0.06]], gain: 0.13, pan: c.pan });
    derau(c.t, { dur: 0.35, fc: (τ) => 900 + 1800 * klem(τ / 0.3), q: 1.2, bentuk: (τ) => sin2(τ / 0.05) * turun(τ, 0.15, 0.35), gain: 0.05, pan: c.pan });
  },
  // Tidak ada balasan: dua nada berongga yang turun.
  "tanpa-balasan": (c) => {
    const rongga = [[1, 1, 0.9], [3, 0.22, 0.5], [5, 0.07, 0.3]];
    nada(c.t, { f: 440, dur: 0.75, serang: 0.03, lepas: 0.2, parsial: rongga, gain: 0.075, pan: c.pan });
    nada(c.t + 0.32, { f: 369.99, dur: 1.4, serang: 0.03, lepas: 0.5, parsial: rongga, gain: 0.075, pan: c.pan });
    nada(c.t + 0.32, { f: 370.9, dur: 1.4, serang: 0.03, lepas: 0.5, parsial: [[1, 0.5, 0.9]], gain: 0.05, pan: -c.pan });
  },
  // Kartu program kerja diambil: gesekan kertas.
  "kertas-geser": (c) => {
    const r = acak(808);
    derau(c.t, {
      dur: 0.75, fc: (τ) => 2600 + 900 * Math.sin(τ * 23), q: 0.9,
      bentuk: (τ) => sin2(τ / 0.04) * turun(τ, 0.4, 0.75) * (0.55 + 0.45 * Math.abs(Math.sin(τ * 41 + 3 * r()))), gain: 0.09, pan: c.pan,
    });
  },
  // Angka tahun berganti: tik mekanis kecil.
  "tik-angka": (c) => {
    derau(c.t, { dur: 0.02, fc: 2600, q: 1.5, bentuk: (τ) => sin2(τ / 0.0006) * Math.exp(-τ / 0.003), gain: 0.25, pan: c.pan });
    nada(c.t, { f: 1760, dur: 0.12, serang: 0.0008, parsial: [[1, 1, 0.03], [2.1, 0.2, 0.015]], gain: 0.05, pan: c.pan });
  },
  // Salinan: "ka-chunk" mesin fotokopi.
  salin: (c) => {
    derau(c.t, { dur: 0.04, fc: 2000, q: 1.1, bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.009), gain: 0.25 * c.vel, pan: c.pan });
    nada(c.t, { f: 900, dur: 0.06, serang: 0.0008, parsial: [[1, 1, 0.015]], gain: 0.07, pan: c.pan });
    nada(c.t + 0.085, { f: (τ) => 95 + 70 * Math.exp(-τ / 0.03), dur: 0.3, serang: 0.002, parsial: [[1, 1, 0.08], [2, 0.3, 0.05]], gain: 0.3 * c.vel, pan: c.pan });
    derau(c.t + 0.085, { dur: 0.22, fc: 650, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.002) * Math.exp(-τ / 0.05), gain: 0.28 * c.vel, pan: c.pan });
  },
  // Buku aturan mendarat di tumpukan: dentum berat dan tepukan kertas.
  "dentum-buku": (c) => {
    dentum(c.t, { f0: 140, f1: 58, lama: 0.32, gain: 0.25 * c.berat * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.12, fc: 1300, q: 0.9, bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.018), gain: 0.16 * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.2, fc: 380, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.04), gain: 0.22 * c.berat * c.vel, pan: c.pan });
  },
  // Garis patah: retakan pendek, pegas yang lepas, dentum kecil.
  patah: (c) => {
    derau(c.t, { dur: 0.03, fc: 3600, q: 1.3, bentuk: (τ) => sin2(τ / 0.0004) * Math.exp(-τ / 0.004), gain: 0.42, pan: c.pan });
    derau(c.t + 0.004, { dur: 0.05, fc: 1800, q: 2, bentuk: (τ) => sin2(τ / 0.0006) * Math.exp(-τ / 0.008), gain: 0.2, pan: c.pan });
    nada(c.t, { f: (τ) => 300 + 650 * Math.exp(-τ / 0.04), dur: 0.3, serang: 0.0008, lepas: 0.08, parsial: [[1, 1, 0.08], [1.5, 0.3, 0.05]], gain: 0.08, pan: c.pan });
    dentum(c.t + 0.01, { f0: 120, f1: 70, lama: 0.18, gain: 0.12, pan: c.pan });
  },
  // Lembar bukti melayang naik.
  "lembar-muncul": (c) => {
    derau(c.t, { dur: 0.9, fc: (τ) => 600 * Math.pow(1700 / 600, klem(τ / 0.8)), q: 1.1, bentuk: (τ) => sin2(τ / 0.25) * turun(τ, 0.5, 0.9), gain: 0.1, pan: c.pan });
    nada(c.t + 0.25, { f: nadaPenta(7), dur: 1.1, serang: 0.05, lepas: 0.3, parsial: [[1, 1, 0.6], [2, 0.12, 0.3]], gain: 0.035, pan: c.pan });
  },
  // Empat label mengorbit: tik kayu yang lembut dan bernada.
  "tik-orbit": (c) => {
    const f = nadaPenta(8 + c.k);
    nada(c.t, { f, dur: 0.35, serang: 0.0015, parsial: [[1, 1, 0.07], [2.76, 0.25, 0.03], [5.4, 0.06, 0.015]], gain: 0.09 * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.015, fc: f * 2, q: 2, bentuk: (τ) => sin2(τ / 0.0005) * Math.exp(-τ / 0.003), gain: 0.05, pan: c.pan });
  },
  // Dokumen keluar dari grid: desir kertas pendek dan letup lembut.
  "dokumen-keluar": (c) => {
    derau(c.t, { dur: 0.32, fc: (τ) => 1200 + 1400 * klem(τ / 0.25), q: 1.0, bentuk: (τ) => sin2(τ / 0.03) * turun(τ, 0.12, 0.32), gain: 0.08 * c.vel, pan: c.pan });
    nada(c.t + 0.05, { f: (τ) => 200 + 140 * Math.exp(-τ / 0.02), dur: 0.16, serang: 0.002, parsial: [[1, 1, 0.05]], gain: 0.12 * c.vel, pan: c.pan });
  },
  // Stempel: dentum kayu dan tepukan karet di kertas.
  stempel: (c) => {
    dentum(c.t, { f0: 160, f1: 72, lama: 0.26, gain: 0.3, pan: c.pan });
    nada(c.t, { f: 620, dur: 0.1, serang: 0.0008, parsial: [[1, 1, 0.025], [2.3, 0.3, 0.012]], gain: 0.1, pan: c.pan });
    derau(c.t, { dur: 0.09, fc: 900, q: 0.8, bentuk: (τ) => sin2(τ / 0.0006) * Math.exp(-τ / 0.015), gain: 0.22, pan: c.pan });
  },
  // Label emas menempel: "klik" yang renyah dan denting emas kecil.
  "klik-emas": (c) => {
    derau(c.t, { dur: 0.018, fc: 3200, q: 1.4, bentuk: (τ) => sin2(τ / 0.0004) * Math.exp(-τ / 0.0025), gain: 0.36, pan: c.pan });
    nada(c.t, { f: 2100, dur: 0.12, serang: 0.0005, parsial: [[1, 1, 0.02], [1.62, 0.5, 0.015]], gain: 0.09, pan: c.pan });
    nada(c.t, { f: 380, dur: 0.08, serang: 0.0006, parsial: [[1, 1, 0.02]], gain: 0.12, pan: c.pan });
    [10, 12].forEach((n, k) => nada(c.t + 0.04 + 0.06 * k, { f: nadaPenta(n + c.k), dur: 0.8, serang: 0.003, lepas: 0.2, parsial: [[1, 1, 0.3], [2, 0.15, 0.15]], gain: 0.045, pan: c.pan }));
  },
  // Garis zamrud menyambung tiga dokumen: tiga luncuran lembut.
  sambung: (c) => [0, 0.36, 0.72].forEach((d, k) => nada(c.t + d, {
    f: (τ) => nadaPenta(5 + 2 * k) * (1 + 0.5 * klem(τ / 0.35)), dur: 0.7, serang: 0.04, lepas: 0.25,
    parsial: [[1, 1, 0.5], [2, 0.15, 0.25]], gain: 0.05, pan: [-0.25, 0.3, -0.1][k],
  })),
  // Dokumen berlipat menjadi ribuan titik emas: hujan denting kecil.
  "lipat-titik": (c) => {
    const r = acak(311);
    for (let k = 0; k < 34; k++) {
      const tt = c.t + 0.85 * Math.pow(r(), 0.8);
      nada(tt, { f: nadaPenta(9 + Math.floor(r() * 6)), dur: 0.35, serang: 0.002, parsial: [[1, 1, 0.08], [2, 0.12, 0.04]], gain: 0.02 + 0.02 * r(), pan: (r() - 0.5) * 1.2 });
    }
    derau(c.t, { dur: 1.0, fc: (τ) => 1500 + 1500 * klem(τ / 0.8), q: 1.2, bentuk: (τ) => sin2(τ / 0.1) * turun(τ, 0.5, 1.0), gain: 0.05 });
  },
  // Aliran naik ke menara: kilau yang terus naik, berhenti sebelum puncak PB menyala.
  "kilau-naik": (c) => {
    derau(c.t, { dur: c.dur, fc: (τ) => 500 * Math.pow(3200 / 500, klem(τ / c.dur)), q: 1.6, bentuk: (τ) => sin2(τ / 0.4) * turun(τ, c.dur - 0.5, c.dur), gain: 0.07 });
    const n = Math.floor(c.dur / 0.13);
    for (let k = 0; k < n; k++) {
      const u = k / n;
      nada(c.t + 0.13 * k, { f: nadaPenta(3 + Math.floor(u * 10) + (k % 2)), dur: 0.45, serang: 0.004, lepas: 0.15, parsial: [[1, 1, 0.15], [2, 0.1, 0.07]], gain: 0.028 + 0.02 * u, pan: Math.sin(k * 1.7) * 0.4 });
    }
  },
  // Gelombang tiba di cabang dan Badko.
  "tiba-tingkat": (c) => [5 + 2 * c.k, 7 + 2 * c.k].forEach((n, k) => nada(c.t + 0.07 * k, { f: nadaPenta(n), dur: 0.9, serang: 0.004, lepas: 0.2, parsial: [[1, 1, 0.35], [2, 0.2, 0.18]], gain: 0.05, pan: c.k ? -0.3 : 0.3 })),
  // Puncak PB menyala: dentum hangat dan lonceng.
  "puncak-pb": (c) => {
    dentum(c.t, { f0: 120, f1: 62, lama: 0.6, gain: 0.21 });
    nada(c.t, { f: nadaPenta(10), dur: 2.6, serang: 0.004, lepas: 0.4, parsial: [[1, 1, 1.3], [2, 0.4, 0.8], [2.76, 0.22, 0.5], [4.07, 0.1, 0.25]], gain: 0.085 });
    nada(c.t, { f: nadaPenta(5), dur: 2.4, serang: 0.004, lepas: 0.4, parsial: [[1, 1, 1.0], [2, 0.2, 0.6]], gain: 0.06 });
    nada(c.t + 0.08, { f: nadaPenta(12), dur: 2.0, serang: 0.004, lepas: 0.4, parsial: [[1, 1, 0.8]], gain: 0.035 });
  },
  // Sebagian cahaya mengalir kembali ke bawah.
  "kilau-turun": (c) => {
    derau(c.t, { dur: c.dur, fc: (τ) => 2600 * Math.pow(500 / 2600, klem(τ / c.dur)), q: 1.6, bentuk: (τ) => sin2(τ / 0.3) * turun(τ, c.dur - 0.6, c.dur), gain: 0.045 });
    const n = Math.floor(c.dur / 0.17);
    for (let k = 0; k < n; k++) nada(c.t + 0.17 * k, { f: nadaPenta(12 - Math.floor((k / n) * 9)), dur: 0.4, serang: 0.004, lepas: 0.15, parsial: [[1, 1, 0.14]], gain: 0.022, pan: -Math.sin(k * 1.3) * 0.4 });
  },
  // Stasiun berdiri: ketuk lembut dan nada.
  stasiun: (c) => {
    nada(c.t, { f: (τ) => 160 + 90 * Math.exp(-τ / 0.03), dur: 0.25, serang: 0.002, parsial: [[1, 1, 0.06]], gain: 0.16, pan: c.pan });
    nada(c.t + 0.03, { f: nadaPenta([5, 7, 9][c.k]), dur: 1.2, serang: 0.004, lepas: 0.3, parsial: [[1, 1, 0.45], [2, 0.25, 0.2], [3, 0.08, 0.12]], gain: 0.06, pan: c.pan });
  },
  // Satu ekosistem: motif berputar, berpindah kiri-kanan-kiri.
  "putar-ekosistem": (c) => {
    const urut = [5, 7, 9, 10, 9, 7, 5, 7, 9, 10, 12];
    urut.forEach((n, k) => {
      const a = (k / urut.length) * Math.PI * 2;
      nada(c.t + k * (c.dur / urut.length), { f: nadaPenta(n), dur: 0.7, serang: 0.006, lepas: 0.25, parsial: [[1, 1, 0.3], [2, 0.12, 0.15]], gain: 0.04 + 0.01 * Math.sin(Math.PI * k / urut.length), pan: -0.55 * Math.cos(a) });
    });
    nada(c.t, { f: 146.83, dur: c.dur + 0.8, serang: 0.3, lepas: 0.6, parsial: [[1, 1, 9], [2, 0.3, 9]], gain: 0.05 });
  },
  // Perisai tipis: dengung lembut dengan denyut pelan.
  "dengung-perisai": (c) => {
    const bentuk = (τ) => sin2(τ / 0.6) * turun(τ, c.dur - 0.9, c.dur) * (0.85 + 0.15 * Math.sin(DUA_PI * 2.2 * τ));
    nada(c.t, { f: 110, dur: c.dur, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.35, 99], [3, 0.12, 99]], gain: 0.09, bentuk });
    nada(c.t, { f: 165.6, dur: c.dur, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.2, 99]], gain: 0.045, bentuk, pan: 0.2 });
    derau(c.t, { dur: c.dur, fc: 900, q: 3, bentuk: (τ) => 0.6 * bentuk(τ), gain: 0.025 });
  },
  // Angka ringkasan naik: bip lembut yang naik.
  "angka-naik": (c) => nada(c.t, { f: (τ) => nadaPenta(7 + c.k) * (1 + 0.25 * klem(τ / 0.2)), dur: 0.4, serang: 0.01, lepas: 0.15, parsial: [[1, 1, 0.15], [2, 0.1, 0.08]], gain: 0.04, pan: c.pan }),
  // Setahun kemudian: desir balik yang lembut.
  "desir-pindah": (c) => derau(c.t, {
    dur: c.dur, fc: (τ) => 400 * Math.pow(2.5, klem(τ / c.dur)), q: 0.9,
    bentuk: (τ) => Math.pow(sin2(τ / (c.dur * 0.75)), 1.5) * turun(τ, c.dur * 0.78, c.dur), gain: 0.12,
  }),
  // Lemari dibuka figur baru: denting tertata, arpeggio mayor yang rapi.
  "cahaya-tertata": (c) => {
    [0, 2, 4, 5, 7, 9, 10].forEach((n, k) => nada(c.t + 0.085 * k, {
      f: nadaPenta(n), dur: 2.2 - 0.1 * k, serang: 0.004, lepas: 0.5, parsial: [[1, 1, 0.9], [2, 0.3, 0.45], [3, 0.08, 0.25]], gain: 0.05, pan: -0.4 + 0.12 * k,
    }));
    for (const f of [146.83, 220]) nada(c.t, { f, dur: 3.2, serang: 0.15, lepas: 1.2, parsial: [[1, 1, 9], [2, 0.2, 9]], gain: 0.04 });
  },
  // Kamera menjauh: desir lebar yang naik lalu reda.
  "desir-mundur": (c) => derau(c.t, {
    dur: c.dur, fc: (τ) => 280 + 500 * Math.sin(Math.PI * klem(τ / c.dur)), q: 0.7, jenis: "lp",
    bentuk: (τ) => Math.sin(Math.PI * klem(τ / c.dur)), gain: 0.16,
  }),
  // Penutup: dentum lembut dan akor yang menyelesaikan (sus4 → mayor), bertahan sampai akhir.
  "akor-penutup": (c) => {
    dentum(c.t, { f0: 100, f1: 48, lama: 0.8, gain: 0.21 });
    derau(c.t, { dur: 0.25, fc: 220, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.003) * Math.exp(-τ / 0.05), gain: 0.18 });
    const sisa = DURASI - c.t - 0.05;
    const hangat = [[1, 1, 3], [1.0035, 0.5, 3], [2, 0.18, 1.5], [3, 0.06, 0.8]];
    const tutup = (τ) => turun(τ, sisa - 1.8, sisa);
    for (const f of [146.83, 220.0, 293.66, 440.0]) nada(c.t + 0.01, { f, dur: sisa, serang: 0.05, lepas: 0.3, parsial: hangat, gain: 0.04, bentuk: tutup });
    nada(c.t + 0.01, { f: 392.0, dur: 0.5, serang: 0.05, lepas: 0.1, parsial: hangat, gain: 0.04 });
    nada(c.t + 0.45, { f: 369.99, dur: sisa - 0.44, serang: 0.06, lepas: 0.3, parsial: hangat, gain: 0.04, bentuk: (τ) => tutup(τ + 0.44) });
  },
  // Kilau kecil pada tombol alamat.
  "kilau-ajakan": (c) => [12, 13, 15].forEach((n, k) => nada(c.t + 0.045 * k, { f: nadaPenta(n), dur: 0.4, serang: 0.002, parsial: [[1, 1, 0.12], [2, 0.1, 0.06]], gain: 0.045, pan: c.pan })),
};

// ---------------------------------------------------------------- susun
const isyarat = daftarIsyarat();
for (const c of isyarat) {
  if (!SUARA[c.jenis]) throw new Error(`Tidak ada suara untuk isyarat "${c.jenis}"`);
  SUARA[c.jenis](c);
}

if (process.env.DIAG) { // puncak tiap isyarat sebelum mastering (untuk menyeimbangkan gain)
  const daftar = isyarat.map((c) => {
    let p = 0;
    for (let i = Math.round(c.t * SR); i < Math.min(N, Math.round((c.t + 0.25) * SR)); i++) p = Math.max(p, Math.abs(KIRI[i]), Math.abs(KANAN[i]));
    return { j: c.jenis, t: c.t, db: 20 * Math.log10(p + 1e-9) };
  }).sort((a, b) => b.db - a.db);
  for (const d of daftar.slice(0, 14)) console.log(`  ${d.j.padEnd(18)} ${d.t.toFixed(2).padStart(6)}  ${d.db.toFixed(1)} dB`);
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
let statPembatas = null;
function batasi(l, r, plafon) {
  const la = Math.round(0.0015 * SR);
  const perlu = new Float64Array(N);
  for (let i = 0; i < N; i++) { const p = Math.max(Math.abs(l[i]), Math.abs(r[i])); perlu[i] = p > plafon ? plafon / p : 1; }
  // Minimum jendela ke depan (deque monoton).
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
  const hal = new Float64Array(N); // rata-rata bergerak supaya serangannya halus
  let jum = 0;
  for (let i = 0; i < N; i++) { jum += out[i]; if (i > la) jum -= out[i - la - 1]; hal[i] = Math.min(out[i], jum / Math.min(i + 1, la + 1)); }
  let minG = 1, jmlTekan = 0;
  for (let i = 0; i < N; i++) { l[i] *= hal[i]; r[i] *= hal[i]; minG = Math.min(minG, hal[i]); if (hal[i] < 0.999) jmlTekan++; }
  statPembatas = { tekananMaksDb: -20 * Math.log10(minG), persenTertekan: (100 * jmlTekan) / N };
}

// Butterworth orde 4 di 7,5 kHz (dua biquad): tidak ada yang tajam di atas ~8 kHz.
const lp8 = (x) => lowpass(lowpass(x, 7500, 0.5412), 7500, 1.3066);
let L = highpass(lp8(KIRI), 30);
let R = highpass(lp8(KANAN), 30);
const plafon = Math.pow(10, PLAFON_DB / 20);
const awal = lufs(L, R);
const L0 = Float64Array.from(L), R0 = Float64Array.from(R);
let gainTotal = 1;
for (let ulang = 0; ulang < 5; ulang++) {
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
const kepalaWav = Buffer.alloc(44);
kepalaWav.write("RIFF", 0); kepalaWav.writeUInt32LE(36 + data.length, 4); kepalaWav.write("WAVE", 8);
kepalaWav.write("fmt ", 12); kepalaWav.writeUInt32LE(16, 16); kepalaWav.writeUInt16LE(1, 20); kepalaWav.writeUInt16LE(2, 22);
kepalaWav.writeUInt32LE(SR, 24); kepalaWav.writeUInt32LE(SR * 4, 28); kepalaWav.writeUInt16LE(4, 32); kepalaWav.writeUInt16LE(16, 34);
kepalaWav.write("data", 36); kepalaWav.writeUInt32LE(data.length, 40);
const berkasWav = resolve(hasil, `${NAMA}.wav`);
writeFileSync(berkasWav, Buffer.concat([kepalaWav, data]));
console.log(`${berkasWav}\n  ${isyarat.length} isyarat, ${(N / SR).toFixed(3)} s, kenyaringan sebelum/sesudah: ${awal.toFixed(1)} → ${lufs(L, R).toFixed(2)} LUFS, puncak sampel ${(20 * Math.log10(puncak)).toFixed(2)} dBFS`);
{
  let maks = 0, tertekan = 0;
  for (let i = 0; i < N; i++) {
    const p = Math.max(Math.abs(L0[i]), Math.abs(R0[i])) * gainTotal;
    maks = Math.max(maks, p);
    if (p > plafon) tertekan++;
  }
  console.log(`  penguatan total ${(20 * Math.log10(gainTotal)).toFixed(1)} dB; pembatas menekan paling banyak ${(20 * Math.log10(Math.max(maks, plafon) / plafon)).toFixed(1)} dB, pada ${((100 * tertekan) / N).toFixed(2)}% sampel`);
}

// ---------------------------------------------------------------- gabungkan dengan video
const video = resolve(hasil, `${NAMA}.mp4`);
const keluaran = resolve(hasil, `${NAMA}-suara.mp4`);
if (!existsSync(video)) throw new Error(`Video belum ada: ${video}`);
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", video, "-i", berkasWav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", keluaran], { stdio: "inherit" });
if (ff.status !== 0) throw new Error(`ffmpeg keluar dengan kode ${ff.status}`);
console.log(`\n${keluaran}`);

// ---------------------------------------------------------------- periksa sinkron dari audio MP4 yang sudah jadi (didekode ulang)
{
  const dek = spawnSync("ffmpeg", ["-loglevel", "error", "-i", keluaran, "-map", "0:a:0", "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 64 * 1024 * 1024 });
  if (dek.status !== 0) throw new Error("gagal mendekode audio MP4");
  const buf = dek.stdout;
  const mono = new Float64Array(buf.length / 4);
  for (let i = 0; i < mono.length; i++) mono[i] = buf.readFloatLE(i * 4);
  const pita = { lebar: mono, tinggi: highpass(mono, 900), rendah: lowpass(mono, 250) };
  const BINGKAI = 0.001 * SR; // 1 ms
  console.log("\n  peristiwa             gambar (t, frame)     bunyi mulai (MP4)   selisih");
  for (const p of peristiwaPeriksa()) {
    const x = pita[p.pita];
    const energi = (t) => { const i = Math.round(t * SR); let s = 0; for (let k = 0; k < BINGKAI; k++) s += (x[i + k] || 0) ** 2; return s / BINGKAI; };
    let latar = 0;
    for (let t = p.t - 0.32; t < p.t - 0.22; t += 0.001) latar += energi(t) / 100;
    const ambang = Math.max(latar * 10, 1e-8); // +10 dB di atas latar
    let mulai = null;
    for (let t = p.t - 0.2; t < p.t + 0.2; t += 0.001) if (energi(t) > ambang && energi(t + 0.001) > ambang) { mulai = t; break; }
    const sel = mulai === null ? "tidak ketemu" : `${((mulai - p.t) * 1000).toFixed(0).padStart(4)} ms`;
    console.log(`  ${p.nama.padEnd(20)} ${p.t.toFixed(3).padStart(7)} s (#${(p.t * 30).toFixed(1).padStart(6)})   ${mulai === null ? "      -     " : (mulai.toFixed(3) + " s")}        ${sel}   [pita ${p.pita}]`);
  }
}
