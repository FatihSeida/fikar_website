/**
 * Efek suara untuk "Ikhtiar HMI Evidence" (58 detik), disintesis di kode. Tanpa sampel, tanpa musik.
 *
 *   node ikhtiar-hmi-evidence/suara.mjs      (dari folder animasi/)
 *
 * → hasil/ikhtiar-hmi-evidence.wav        48 kHz, stereo, 16-bit, tepat 58,000 detik
 * → hasil/ikhtiar-hmi-evidence-suara.mp4  video disalin apa adanya + AAC 192k
 *
 * Waktu setiap isyarat dibaca dari isyarat.js, sumber yang sama dengan adegan, jadi suara tidak bisa
 * bergeser dari gambar. Semua derau memakai acak berbenih, jadi hasilnya selalu sama.
 * Palet: hangat, organik, sedikit khidmat — kertas, denting kaca lembut, ketukan kayu, langkah,
 * dentum cap, benturan batu, nada cek yang naik, dan akor penutup yang selesai.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DURASI, daftarIsyarat, peristiwaPeriksa, acak } from "./isyarat.js";

const folder = dirname(fileURLToPath(import.meta.url));
const hasil = resolve(folder, "..", "..", "hasil");
const NAMA = "ikhtiar-hmi-evidence";
const SR = 48000;
const N = Math.round(DURASI * SR);
const TARGET_LUFS = -18;
const PLAFON_DB = -2.0; // batas puncak sampel; puncak sejati diperiksa ffmpeg (harus ≤ −1 dBTP)

const KIRI = new Float64Array(N);
const KANAN = new Float64Array(N);
const DUA_PI = 2 * Math.PI;
const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
const sin2 = (x) => Math.pow(Math.sin((Math.PI / 2) * klem(x)), 2);
const pudarAkhir = (τ, dur, lama) => Math.pow(Math.cos((Math.PI / 2) * klem((τ - (dur - lama)) / lama)), 2);

function panGain(pan) {
  const a = ((klem(pan, -1, 1) + 1) * Math.PI) / 4;
  return [Math.cos(a), Math.sin(a)];
}
// Pentatonik D mayor: indeks 0 = D4, 5 = D5, 10 = D6.
const nadaPenta = (n) => 293.66 * Math.pow(2, Math.floor(n / 5) + [0, 2, 4, 7, 9][((n % 5) + 5) % 5] / 12);

// ---------------------------------------------------------------- suara dasar
// Nada aditif. parsial: [rasio, amplitudo, peluruhan (detik)]. f boleh fungsi waktu (meluncur).
function nada(t0, { f, dur, serang = 0.004, lepas = 0.03, parsial = [[1, 1, 0.3]], gain = 0.1, pan = 0, bentuk = null }) {
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
    const fz = Math.min(typeof fc === "function" ? fc(tau) : fc, 7000);
    const g = Math.tan((Math.PI * fz) / SR);
    const kk = 1 / q;
    const a1 = 1 / (1 + g * (g + kk)), a2 = g * a1, a3 = g * a2;
    const v3 = x - ic2;
    const v1 = a1 * ic1 + a2 * v3;
    const v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1;
    ic2 = 2 * v2 - ic2;
    const y = jenis === "lp" ? v2 : v1;
    const v = y * gain * bentuk(tau) * klem((n - k) / (0.008 * SR));
    if (i < 0) continue;
    const [gl, gr] = panGain(typeof pan === "function" ? pan(tau) : pan);
    KIRI[i] += v * gl;
    KANAN[i] += v * gr;
  }
}
// Timbre bersama.
const LONCENG = [[1, 1, 1.6], [2, 0.38, 0.9], [2.76, 0.22, 0.5], [4.07, 0.09, 0.28], [5.4, 0.04, 0.16]];
const KACA = [[1, 1, 0.42], [2.76, 0.16, 0.16], [5.4, 0.04, 0.07]];
const MARIMBA = [[1, 1, 0.42], [3.98, 0.1, 0.07], [9.9, 0.02, 0.025]];
function dentum(t, { f0 = 110, f1 = 55, turun = 0.06, dur = 0.7, gain = 0.3, lp = 300, gainDerau = 0.18, pan = 0 }) {
  nada(t, { f: (τ) => f1 + (f0 - f1) * Math.exp(-τ / turun), dur, serang: 0.003, lepas: 0.08, parsial: [[1, 1, dur * 0.35], [2, 0.22, dur * 0.18]], gain, pan });
  derau(t, { dur: 0.3, fc: lp, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.004) * Math.exp(-τ / 0.06), gain: gainDerau, pan });
}
function langkahLembut(t, gain, pan) {
  derau(t, { dur: 0.14, fc: 520, q: 0.8, jenis: "lp", bentuk: (τ) => sin2(τ / 0.006) * Math.exp(-τ / 0.035), gain, pan });
  nada(t, { f: (τ) => 85 + 40 * Math.exp(-τ / 0.02), dur: 0.12, serang: 0.003, parsial: [[1, 1, 0.04]], gain: gain * 0.9, pan });
}

// ---------------------------------------------------------------- palet suara
const SUARA = {
  // Kitab naik dari grid: desir hangat yang rendah dan nada dasar yang membengkak pelan.
  "naik-kitab": (c) => {
    derau(c.t, { dur: c.dur, fc: (τ) => 260 * Math.pow(3, klem(τ / c.dur)), q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.6) * pudarAkhir(τ, c.dur, 0.8), gain: 0.5 });
    nada(c.t, { f: 98, dur: c.dur, serang: 0.7, lepas: 0.6, parsial: [[1, 1, 9], [2, 0.3, 9], [3, 0.08, 9]], gain: 0.07 });
  },
  // Halaman dibalik: desau kertas yang berkibas, lalu jatuh lembut.
  halaman: (c) => {
    derau(c.t, {
      dur: c.dur, fc: (τ) => 1500 + 1700 * Math.sin(Math.PI * klem(τ / c.dur)), q: 0.9,
      bentuk: (τ) => sin2(τ / 0.08) * pudarAkhir(τ, c.dur, 0.3) * (0.55 + 0.45 * Math.abs(Math.sin(DUA_PI * 9 * τ))), gain: 0.16, pan: (τ) => 0.3 - 0.6 * klem(τ / c.dur),
    });
    derau(c.t + c.dur - 0.06, { dur: 0.2, fc: 900, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.01) * Math.exp(-τ / 0.05), gain: 0.18, pan: -0.3 });
  },
  // Denting kaca lembut saat rantai cahaya bersambung.
  "denting-rantai": (c) => nada(c.t, { f: nadaPenta(c.nada), dur: 0.9, serang: 0.003, parsial: KACA, gain: 0.06 * c.vel, pan: c.pan }),
  // Titik asal menyala emas: lonceng hangat.
  "lonceng-asal": (c) => {
    nada(c.t, { f: nadaPenta(5), dur: 3.2, serang: 0.003, lepas: 0.4, parsial: LONCENG, gain: 0.08, pan: c.pan });
    nada(c.t, { f: nadaPenta(0), dur: 3.0, serang: 0.003, lepas: 0.4, parsial: [[1, 1, 1.4], [2, 0.3, 0.8]], gain: 0.055, pan: c.pan });
    nada(c.t, { f: 73.4, dur: 1.4, serang: 0.004, lepas: 0.3, parsial: [[1, 1, 0.5]], gain: 0.11 });
  },
  // Figur berbalik: ketukan langkah kecil.
  ketuk: (c) => langkahLembut(c.t, 0.1 * c.vel, c.pan),
  // Satu nada: nada tunggal yang membengkak saat semua garis berdenyut bersama.
  "satu-nada": (c) => {
    const bentuk = (τ) => sin2(τ / 0.45) * pudarAkhir(τ, c.dur, 1.1);
    nada(c.t, { f: 293.66, dur: c.dur, serang: 0, parsial: [[1, 1, 1e9], [2, 0.18, 1e9], [3, 0.05, 1e9]], gain: 0.06, bentuk });
    nada(c.t, { f: 146.83, dur: c.dur, serang: 0, parsial: [[1, 1, 1e9], [2, 0.2, 1e9]], gain: 0.05, bentuk });
  },
  // Ruang kuliah tersusun: ketukan kayu.
  kayu: (c) => {
    nada(c.t, { f: [196, 165, 220][c.nada], dur: 0.35, serang: 0.002, parsial: [[1, 1, 0.09], [2.9, 0.25, 0.03]], gain: 0.16 * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.06, fc: 900, q: 1.2, bentuk: (τ) => sin2(τ / 0.002) * Math.exp(-τ / 0.012), gain: 0.12 * c.vel, pan: c.pan });
  },
  // Pendiri muncul: kilau hangat yang singkat.
  "kilau-pendiri": (c) => [5, 7, 9].forEach((n, k) => nada(c.t + 0.06 * k, { f: nadaPenta(n), dur: 0.7, serang: 0.02, parsial: [[1, 1, 0.22], [2, 0.12, 0.1]], gain: 0.045, pan: c.pan })),
  // Empat belas pendiri menyala: nada marimba yang hangat.
  nyala: (c) => nada(c.t, { f: nadaPenta(c.nada), dur: 0.9, serang: 0.002, parsial: MARIMBA, gain: 0.085 * c.vel, pan: c.pan }),
  // Ubin kalender berdiri.
  ubin: (c) => {
    nada(c.t, { f: 330, dur: 0.25, serang: 0.002, parsial: [[1, 1, 0.06], [2.4, 0.2, 0.025]], gain: 0.13 * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.05, fc: 1300, q: 1, bentuk: (τ) => sin2(τ / 0.002) * Math.exp(-τ / 0.01), gain: 0.07, pan: c.pan });
  },
  // Ubin berbalik: desir putar lalu jatuh dengan dentum kayu rendah tepat saat selesai berbalik.
  balik: (c) => {
    derau(c.t, { dur: c.dur, fc: (τ) => 600 + 1200 * Math.sin(Math.PI * klem(τ / c.dur)), q: 1.1, bentuk: (τ) => Math.sin(Math.PI * klem(τ / c.dur)) ** 1.5, gain: 0.13, pan: c.pan });
    dentum(c.t + c.dur, { f0: 170, f1: 105, turun: 0.03, dur: 0.4, gain: 0.2, lp: 400, gainDerau: 0.1, pan: c.pan });
  },
  // Langkah lembut.
  langkah: (c) => langkahLembut(c.t, 0.17 * c.vel, c.pan),
  // Titik emas naik dari sorotan.
  "kilau-kecil": (c) => [10, 12].forEach((n, k) => nada(c.t + 0.07 * k, { f: nadaPenta(n), dur: 0.4, serang: 0.003, parsial: [[1, 1, 0.12]], gain: 0.04, pan: c.pan })),
  // Titik emas berpindah tangan: denting emas kecil.
  serah: (c) => nada(c.t, { f: nadaPenta(c.nada + 3), dur: 0.9, serang: 0.002, parsial: [[1, 1, 0.38], [2.76, 0.2, 0.13], [5.4, 0.05, 0.05]], gain: 0.065 * c.vel, pan: c.pan }),
  // Rumah komisariat tumbuh: letup kayu lembut.
  rumah: (c) => {
    nada(c.t, { f: (τ) => 240 + 80 * Math.exp(-τ / 0.03), dur: 0.2, serang: 0.002, parsial: [[1, 1, 0.06], [2, 0.15, 0.03]], gain: 0.09 * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.04, fc: 1100, q: 1, bentuk: (τ) => sin2(τ / 0.002) * Math.exp(-τ / 0.01), gain: 0.05 * c.vel, pan: c.pan });
  },
  // Pintu LK berubah menjadi gerbang cap: dua dentam mekanis yang teredam.
  "gerbang-ubah": (c) => {
    dentum(c.t, { f0: 150, f1: 80, turun: 0.05, dur: 0.5, gain: 0.16, lp: 260, gainDerau: 0.12 });
    derau(c.t + 0.05, { dur: c.dur - 0.1, fc: (τ) => 400 + 300 * τ, q: 2.5, bentuk: (τ) => sin2(τ / 0.2) * pudarAkhir(τ, c.dur - 0.1, 0.3), gain: 0.05 });
    dentum(c.t + c.dur - 0.02, { f0: 120, f1: 70, turun: 0.04, dur: 0.45, gain: 0.15, lp: 240, gainDerau: 0.1 });
  },
  // Rumah berubah kusam: nada turun yang redup.
  kusam: (c) => nada(c.t, { f: (τ) => 392 * Math.pow(0.75, keluar3(τ / 0.7)), dur: 0.9, serang: 0.05, lepas: 0.2, parsial: [[1, 1, 0.5], [2, 0.12, 0.3]], gain: 0.05 * c.vel, pan: c.pan }),
  // Cap stempel mengecap figur.
  cap: (c) => {
    dentum(c.t, { f0: 140, f1: 62, turun: 0.035, dur: 0.45, gain: 0.27 * c.vel, lp: 420, gainDerau: 0.17 });
    derau(c.t, { dur: 0.03, fc: 1000, q: 1.4, bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.007), gain: 0.08 });
  },
  // Figur di puncak menekan: erangan rendah yang tertahan (puncaknya tepat saat menekan).
  tekan: (c) => nada(c.t - 0.22, { f: (τ) => 70 + 8 * Math.sin(DUA_PI * 3 * τ), dur: 0.75, serang: 0.2, lepas: 0.35, parsial: [[1, 1, 0.5], [2, 0.35, 0.3], [3, 0.12, 0.2]], gain: 0.07 * c.vel, pan: c.pan }),
  // Kursi digeser.
  "geser-kursi": (c) => {
    const r = acak(Math.round(c.t * 100));
    const jitter = Array.from({ length: 64 }, () => 0.5 + 0.5 * r());
    derau(c.t, { dur: c.dur, fc: 850, q: 1.6, bentuk: (τ) => Math.sin(Math.PI * klem(τ / c.dur)) * jitter[Math.floor(τ * 40) % 64], gain: 0.07, pan: c.pan });
  },
  // Pendiri larut menjadi cetak biru: butir-butir cahaya yang turun.
  larut: (c) => {
    const r = acak(41);
    for (let k = 0; k < 16; k++) {
      const t = c.t + c.dur * Math.pow(k / 16, 0.8);
      nada(t, { f: nadaPenta(14 - (k % 9)), dur: 0.35, serang: 0.003, parsial: [[1, 1, 0.09]], gain: 0.028 * (1 - 0.5 * k / 16), pan: (r() - 0.5) * 0.8 });
    }
    nada(c.t, { f: (τ) => 587 * Math.pow(0.5, klem(τ / c.dur)), dur: c.dur + 0.3, serang: 0.2, lepas: 0.3, parsial: [[1, 1, 1e9], [2, 0.15, 1e9]], gain: 0.03 });
  },
  // Rangka bangunan ditarik: nada naik yang lembut.
  rangka: (c) => nada(c.t, { f: (τ) => 294 * Math.pow(2, keluar3(τ / c.dur)), dur: c.dur + 0.2, serang: 0.15, lepas: 0.25, parsial: [[1, 1, 1e9], [2, 0.2, 1e9], [3, 0.05, 1e9]], gain: 0.04, pan: 0.1 }),
  // Lempeng fondasi mendarat: benturan batu yang rendah.
  lempeng: (c) => {
    dentum(c.t, { f0: 120 + 6 * c.k, f1: 52 + 3 * c.k, turun: 0.05, dur: 0.8, gain: 0.27 * c.vel, lp: 340, gainDerau: 0.17, pan: c.pan });
    derau(c.t, { dur: 0.25, fc: 700, q: 0.9, bentuk: (τ) => sin2(τ / 0.002) * Math.exp(-τ / 0.04), gain: 0.06, pan: c.pan });
  },
  // Kartu meluncur.
  "geser-kartu": (c) => derau(c.t, { dur: c.dur, fc: (τ) => 2200 * Math.pow(0.45, klem(τ / c.dur)), q: 1.0, bentuk: (τ) => Math.sin(Math.PI * klem(τ / c.dur)) ** 2, gain: 0.08, pan: c.pan }),
  // Cek per lapis: nada naik, satu langkah lebih tinggi tiap lempeng.
  cek: (c) => {
    const f0 = nadaPenta(5 + c.k);
    nada(c.t, { f: (τ) => f0 * (1 + 0.06 * keluar3(τ / 0.05)), dur: 0.5, serang: 0.002, lepas: 0.05, parsial: [[1, 1, 0.12], [2, 0.18, 0.06]], gain: 0.13, pan: c.pan });
  },
  // Kartu lolos berubah emas: arpegio lonceng.
  lolos: (c) => [10, 12, 13, 15].forEach((n, k) => nada(c.t + 0.06 * k, { f: nadaPenta(n), dur: 1.6, serang: 0.003, lepas: 0.2, parsial: [[1, 1, 0.8], [2, 0.2, 0.4], [2.76, 0.08, 0.2]], gain: 0.05, pan: c.pan })),
  // Kartu ramai memudar.
  pudar: (c) => nada(c.t, { f: (τ) => 440 * Math.pow(0.7, klem(τ / c.dur)), dur: c.dur, serang: 0.05, lepas: 0.3, parsial: [[1, 1, 0.6]], gain: 0.035, pan: c.pan }),
  // Cabang dan menara PB berdiri.
  menara: (c) => {
    derau(c.t, { dur: c.dur + 0.3, fc: 220, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.4) * pudarAkhir(τ, c.dur + 0.3, 0.4), gain: 0.35 });
    nada(c.t, { f: 65.4, dur: c.dur + 0.3, serang: 0.4, lepas: 0.3, parsial: [[1, 1, 9], [2, 0.3, 9]], gain: 0.07 });
  },
  // Titik keputusan di puncak menara menyala.
  "lonceng-keputusan": (c) => nada(c.t, { f: nadaPenta(7), dur: 2.2, serang: 0.003, lepas: 0.3, parsial: LONCENG, gain: 0.09, pan: c.pan }),
  // Garis emas ditarik mundur: nada naik yang lembut, memudar sebelum akor penutup.
  "sapu-garis": (c) => {
    const lama = c.dur - 0.35;
    const bentuk = (τ) => sin2(τ / 0.6) * pudarAkhir(τ, lama, 0.6) * (0.85 + 0.15 * Math.sin(DUA_PI * 2.5 * τ));
    nada(c.t, { f: (τ) => 220 * Math.pow(1.5, klem(τ / lama)), dur: lama, serang: 0, parsial: [[1, 1, 1e9], [2, 0.2, 1e9], [3, 0.05, 1e9]], gain: 0.035, bentuk });
    derau(c.t, { dur: lama, fc: (τ) => 900 * Math.pow(1.6, klem(τ / lama)), q: 1.4, bentuk, gain: 0.025 });
  },
  // Titik singgah: denting.
  "titik-jalan": (c) => nada(c.t, { f: nadaPenta(c.nada), dur: 1.0, serang: 0.003, parsial: KACA, gain: 0.055, pan: c.pan }),
  // Penutup: dentum lembut dan akor D mayor yang selesai (sus4 → mayor).
  "akor-penutup": (c) => {
    dentum(c.t, { f0: 98, f1: 49, turun: 0.06, dur: 0.9, gain: 0.28, lp: 220, gainDerau: 0.16 });
    const sisa = DURASI - c.t - 0.05;
    const hangat = [[1, 1, 1.8], [1.0035, 0.5, 1.8], [2, 0.18, 1.0], [3, 0.06, 0.6]];
    for (const f of [146.83, 220.0, 293.66, 440.0]) nada(c.t + 0.01, { f, dur: sisa, serang: 0.06, lepas: 0.5, parsial: hangat, gain: 0.045 });
    nada(c.t + 0.01, { f: 392.0, dur: 0.5, serang: 0.06, lepas: 0.08, parsial: hangat, gain: 0.045 });
    nada(c.t + 0.45, { f: 369.99, dur: sisa - 0.44, serang: 0.08, lepas: 0.5, parsial: hangat, gain: 0.045 });
  },
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
  for (let i = N - 1, antre = []; i >= 0; i--) { // minimum jendela ke depan
    antre.push(perlu[i]);
    if (antre.length > la + 1) antre.shift();
    tahan[i] = Math.min(...antre);
  }
  const out = new Float64Array(N);
  for (let i = 0; i < N; i++) { g = tahan[i] < g ? tahan[i] : g + (1 - g) * lepas; out[i] = g; }
  const hal = new Float64Array(N); // rata-rata bergerak supaya serangannya halus
  let jum = 0;
  for (let i = 0; i < N; i++) { jum += out[i]; if (i > la) jum -= out[i - la - 1]; hal[i] = Math.min(out[i], jum / Math.min(i + 1, la + 1)); }
  for (let i = 0; i < N; i++) { l[i] *= hal[i]; r[i] *= hal[i]; }
}

// Butterworth orde 4 di 8 kHz (dua biquad, Q 0,541 dan 1,307): tidak ada yang tajam di atas ~8 kHz.
const lp8 = (x) => lowpass(lowpass(x, 8000, 0.5412), 8000, 1.3066);
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
  data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767))), i * 4);
  data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767))), i * 4 + 2);
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
{
  let maks = 0, tertekan = 0;
  for (let i = 0; i < N; i++) {
    const p = Math.max(Math.abs(L0[i]), Math.abs(R0[i])) * gainTotal;
    maks = Math.max(maks, p);
    if (p > plafon) tertekan++;
  }
  console.log(`  penguatan total ${(20 * Math.log10(gainTotal)).toFixed(1)} dB; pembatas menekan paling banyak ${(20 * Math.log10(Math.max(maks, plafon) / plafon)).toFixed(1)} dB, pada ${((100 * tertekan) / N).toFixed(2)}% sampel`);
}

// ---------------------------------------------------------------- periksa sinkron: awal bunyi di sekitar peristiwa gambar
{
  const mono = new Float64Array(N);
  for (let i = 0; i < N; i++) mono[i] = (L[i] + R[i]) / 2;
  const pita = { lebar: mono, tinggi: highpass(mono, 900), rendah: lowpass(mono, 250) };
  const BINGKAI = 0.001 * SR; // 1 ms
  console.log("\n  peristiwa                gambar (t, frame)    bunyi mulai   selisih");
  for (const p of peristiwaPeriksa()) {
    const x = pita[p.pita];
    const energi = (t) => { const i = Math.round(t * SR); let s = 0; for (let k = 0; k < BINGKAI; k++) s += x[i + k] ** 2; return s / BINGKAI; };
    let latar = 0;
    for (let t = p.t - 0.32; t < p.t - 0.22; t += 0.001) latar += energi(t) / 100;
    const ambang = Math.max(latar * 10, 1e-8); // +10 dB di atas latar
    let mulai = null;
    for (let t = p.t - 0.2; t < p.t + 0.2; t += 0.001) if (energi(t) > ambang && energi(t + 0.001) > ambang) { mulai = t; break; }
    const sel = mulai === null ? "tidak ketemu" : `${((mulai - p.t) * 1000).toFixed(0).padStart(4)} ms`;
    console.log(`  ${p.nama.padEnd(23)} ${p.t.toFixed(3).padStart(7)} s (#${(p.t * 30).toFixed(1).padStart(6)})   ${mulai === null ? "     -   " : (mulai.toFixed(3) + " s")}   ${sel}   [pita ${p.pita}]`);
  }
}

// ---------------------------------------------------------------- gabungkan dengan video
const video = resolve(hasil, `${NAMA}.mp4`);
const keluaran = resolve(hasil, `${NAMA}-suara.mp4`);
if (!existsSync(video)) { console.log(`\nVideo belum ada (${video}); WAV saja yang ditulis.`); process.exit(0); }
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", video, "-i", berkasWav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", keluaran], { stdio: "inherit" });
if (ff.status !== 0) throw new Error(`ffmpeg keluar dengan kode ${ff.status}`);
console.log(`\n${keluaran}`);
