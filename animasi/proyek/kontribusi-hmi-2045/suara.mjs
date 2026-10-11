/**
 * Efek suara untuk Reels kontribusi-hmi-2045 (60 detik), disintesis di kode. Tanpa sampel, tanpa musik.
 *
 *   node kontribusi-hmi-2045/suara.mjs      (dari folder animasi/)
 *
 * → hasil/kontribusi-hmi-2045.wav        48 kHz, stereo, 16-bit, tepat 60,000 detik
 * → hasil/kontribusi-hmi-2045-suara.mp4  video disalin apa adanya + AAC 192k
 *
 * Waktu setiap isyarat dibaca dari isyarat.js, sumber yang sama dengan adegan.js, jadi suara tidak bisa
 * bergeser dari gambar. Semua derau memakai acak berbenih, jadi hasilnya selalu sama.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DURASI, daftarIsyarat, peristiwaPeriksa, acak, T_LEWAT_GAPURA } from "./isyarat.js";

const folder = dirname(fileURLToPath(import.meta.url));
const hasil = resolve(folder, "..", "..", "hasil");
const NAMA = "kontribusi-hmi-2045";
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
// Selubung umum: naik sin² selama a detik, turun cos² selama r detik terakhir dari dur.
const selubung = (a, dur, r) => (τ) => sin2(τ / a) * (τ > dur - r ? Math.pow(Math.cos((Math.PI / 2) * klem((τ - (dur - r)) / r)), 2) : 1);

function panGain(pan) {
  const a = ((klem(pan, -1, 1) + 1) * Math.PI) / 4;
  return [Math.cos(a), Math.sin(a)];
}
// Pentatonik D mayor: indeks 0 = D4, 5 = D5, 10 = D6.
const nadaPenta = (n) => 293.66 * Math.pow(2, Math.floor(n / 5) + [0, 2, 4, 7, 9][((n % 5) + 5) % 5] / 12);

// ---------------------------------------------------------------- suara dasar
// Nada aditif. parsial: [rasio, amplitudo, peluruhan (detik)]. f boleh fungsi waktu (meluncur).
function nada(t0, { f, dur, serang = 0.004, lepas = 0.02, parsial = [[1, 1, 0.3]], gain = 0.1, pan = 0, bentuk = null, getar = null }) {
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
      if (fd * r > 7800) continue; // tidak ada yang tajam di atas ~8 kHz
      s += Math.sin(fasa[p]) * a * Math.exp(-tau / d);
    }
    let v = s * gain * (serang > 0 ? sin2(tau / serang) : 1) * klem((n - k) / (lepas * SR));
    if (bentuk) v *= bentuk(tau);
    if (getar) v *= 1 - getar.dalam * (0.5 + 0.5 * Math.sin(DUA_PI * getar.laju * tau));
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
    const v = y * gain * bentuk(tau) * klem((n - k) / (0.008 * SR));
    if (i < 0) continue;
    const [gl, gr] = panGain(typeof pan === "function" ? pan(tau) : pan);
    KIRI[i] += v * gl;
    KANAN[i] += v * gr;
  }
}
// Gelombang lambat berbenih (untuk ombak dan angin): jumlah beberapa sinus dengan fasa acak.
function lambat(benih, laju) {
  const r = acak(benih);
  const k = Array.from({ length: 4 }, () => [laju * (0.6 + 0.9 * r()), r() * DUA_PI]);
  return (τ) => 0.5 + 0.5 * k.reduce((s, [f, p]) => s + Math.sin(DUA_PI * f * τ + p), 0) / k.length;
}

// ---------------------------------------------------------------- palet suara
const SUARA = {
  // 1. Gedung menyala emas: lonceng hangat dan dentum lembut.
  "nyala-gedung": (c) => {
    const f0 = c.nada === 0 ? 293.66 : 369.99;
    nada(c.t, { f: f0, dur: 2.4, serang: 0.004, lepas: 0.3, parsial: [[1, 1, 1.1], [2, 0.38, 0.6], [3.01, 0.14, 0.35], [4.2, 0.05, 0.2]], gain: 0.12, pan: c.pan });
    nada(c.t, { f: f0 / 2, dur: 1.8, serang: 0.01, lepas: 0.3, parsial: [[1, 1, 0.8], [2, 0.2, 0.4]], gain: 0.07, pan: c.pan });
    nada(c.t, { f: (τ) => 62 + 30 * Math.exp(-τ / 0.08), dur: 0.5, serang: 0.003, parsial: [[1, 1, 0.18]], gain: 0.22, pan: c.pan * 0.5 });
  },
  // Garis tipis menghubungkan dua gedung: desis halus yang bergerak kiri ke kanan.
  "kilau-garis": (c) => {
    derau(c.t, { dur: c.dur + 0.3, fc: (τ) => 2200 + 1600 * klem(τ / c.dur), q: 3, bentuk: selubung(0.25, c.dur + 0.3, 0.45), gain: 0.07, pan: (τ) => -0.4 + 0.8 * klem(τ / c.dur) });
    [0, 2, 4].forEach((n, k) => nada(c.t + 0.15 + k * 0.38, { f: nadaPenta(10 + n), dur: 0.7, serang: 0.003, lepas: 0.1, parsial: [[1, 1, 0.25], [2, 0.1, 0.12]], gain: 0.035, pan: -0.4 + 0.4 * k }));
  },
  // Grid berubah menjadi air: desir ombak yang menyebar.
  "air-datang": (c) => {
    derau(c.t, { dur: c.dur, fc: (τ) => 300 + 1100 * klem(τ / 1.2), q: 0.6, jenis: "lp", bentuk: selubung(0.6, c.dur, 1.2), gain: 0.42 });
    derau(c.t + 0.3, { dur: c.dur - 0.3, fc: 900, q: 1.2, bentuk: (τ) => selubung(0.5, c.dur - 0.3, 1.0)(τ) * (0.6 + 0.4 * Math.sin(DUA_PI * 2.2 * τ)), gain: 0.12, pan: (τ) => Math.sin(τ * 2) * 0.4 });
  },
  // Riak air yang terus terdengar pelan selama adegan perahu.
  ombak: (c) => {
    const a = lambat(31 + Math.round(c.t), 0.35), b = lambat(57 + Math.round(c.t), 0.5);
    derau(c.t, { dur: c.dur, fc: (τ) => 420 + 260 * a(τ), q: 0.9, bentuk: (τ) => selubung(1.0, c.dur, 0.9)(τ) * (0.35 + 0.65 * a(τ)), gain: 0.085, pan: -0.45 });
    derau(c.t, { dur: c.dur, fc: (τ) => 520 + 300 * b(τ), q: 0.9, bentuk: (τ) => selubung(1.0, c.dur, 0.9)(τ) * (0.35 + 0.65 * b(τ)), gain: 0.085, pan: 0.45 });
    derau(c.t, { dur: c.dur, fc: 160, q: 0.7, jenis: "lp", bentuk: (τ) => selubung(1.2, c.dur, 1.0)(τ) * (0.5 + 0.5 * b(τ)), gain: 0.07 });
  },
  // Karang naik: gemuruh batu yang dalam.
  "dentum-karang": (c) => {
    nada(c.t, { f: (τ) => 48 + 22 * Math.exp(-τ / 0.25), dur: 1.6, serang: 0.006, lepas: 0.4, parsial: [[1, 1, 0.7], [2, 0.35, 0.4], [3, 0.12, 0.25]], gain: 0.42 * c.vel, pan: c.pan * 0.6 });
    derau(c.t, { dur: 1.5, fc: 170, q: 0.8, jenis: "lp", bentuk: (τ) => sin2(τ / 0.01) * Math.exp(-τ / 0.45) * (0.7 + 0.3 * Math.sin(DUA_PI * 13 * τ)), gain: 0.55 * c.vel, pan: c.pan * 0.6 });
    const r = acak(Math.round(c.t * 100));
    for (let k = 0; k < 9; k++) { // kerikil
      const tk = c.t + 0.05 + r() * 0.9;
      derau(tk, { dur: 0.04, fc: 1300 + r() * 900, q: 2, bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.008), gain: 0.06 * r(), pan: c.pan });
    }
  },
  // Perahu meluncur masuk.
  "desir-perahu": (c) => derau(c.t, { dur: c.dur, fc: (τ) => 700 - 350 * klem(τ / c.dur), q: 0.9, bentuk: selubung(0.3, c.dur, 1.2), gain: 0.16, pan: (τ) => 0.5 - 0.5 * klem(τ / c.dur) }),
  // Dayung masuk air: cipratan, "plop", dan desir tarikan. Serempak = delapan bilah sekaligus.
  kayuh: (c) => {
    const k = c.lemah * c.vel;
    const banyak = c.jumlah > 1;
    const lapis = banyak ? [[-0.006, -0.5], [0, 0.5], [0.005, 0]] : [[0, c.pan]];
    for (const [dt, p] of lapis) {
      derau(c.t + Math.max(0, dt), { dur: 0.22, fc: (τ) => 2000 - 900 * klem(τ / 0.15), q: 1.1, bentuk: (τ) => sin2(τ / 0.002) * Math.exp(-τ / 0.05), gain: (banyak ? 0.16 : 0.11) * k, pan: p });
    }
    nada(c.t, { f: (τ) => 210 - 80 * klem(τ / 0.06), dur: 0.12, serang: 0.002, lepas: 0.03, parsial: [[1, 1, 0.04]], gain: (banyak ? 0.2 : 0.09) * k, pan: c.pan });
    derau(c.t + 0.03, { dur: 0.45, fc: 480, q: 0.8, jenis: "lp", bentuk: (τ) => sin2(τ / 0.08) * Math.exp(-τ / 0.16), gain: (banyak ? 0.2 : 0.08) * k, pan: c.pan });
  },
  // Derit papan kayu sebelum retak: rangkaian hentakan lekat-lepas yang beresonansi.
  derit: (c) => {
    const r = acak(77);
    let t = 0;
    while (t < c.dur) {
      const laju = 26 + 22 * (t / c.dur) + 6 * r();
      const kuat = sin2(t / 0.08) * (1 - 0.5 * (t / c.dur));
      nada(c.t + t, { f: 640 + 90 * r(), dur: 0.04, serang: 0.0008, lepas: 0.01, parsial: [[1, 1, 0.012], [2.1, 0.5, 0.008], [3.3, 0.2, 0.005]], gain: 0.07 * kuat, pan: 0.1 });
      t += 1 / laju;
    }
    nada(c.t, { f: (τ) => 190 + 60 * Math.sin(DUA_PI * 3 * τ), dur: c.dur, serang: 0.05, lepas: 0.1, parsial: [[1, 1, 1], [2, 0.5, 1], [3, 0.25, 1]], gain: 0.025, pan: 0.1 });
  },
  // Lantai retak: patahan tajam, dentum pendek, serpihan.
  retak: (c) => {
    derau(c.t, { dur: 0.09, fc: 2600, q: 0.5, bentuk: (τ) => sin2(τ / 0.0007) * Math.exp(-τ / 0.018), gain: 0.85 });
    derau(c.t, { dur: 0.25, fc: 900, q: 0.7, bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.05), gain: 0.35 });
    nada(c.t, { f: (τ) => 85 + 50 * Math.exp(-τ / 0.03), dur: 0.5, serang: 0.002, lepas: 0.1, parsial: [[1, 1, 0.14], [2, 0.3, 0.07]], gain: 0.4 });
    const r = acak(15);
    for (let k = 0; k < 7; k++) {
      const tk = c.t + 0.03 + r() * 0.22;
      derau(tk, { dur: 0.03, fc: 1800 + 1500 * r(), q: 2.5, bentuk: (τ) => sin2(τ / 0.0006) * Math.exp(-τ / 0.006), gain: 0.12 * r(), pan: (r() - 0.5) * 0.8 });
    }
  },
  // Perahu berputar di tempat: pusaran air yang berpindah kiri-kanan.
  pusaran: (c) => derau(c.t, { dur: c.dur, fc: (τ) => 380 + 120 * Math.sin(DUA_PI * 0.4 * τ), q: 1.1, bentuk: selubung(0.8, c.dur, 1.2), gain: 0.07, pan: (τ) => 0.6 * Math.sin(DUA_PI * 0.23 * τ) }),
  // Karang membelah dan tenggelam.
  "belah-karang": (c) => {
    derau(c.t, { dur: 0.12, fc: 1500, q: 0.6, bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.03), gain: 0.5 });
    nada(c.t, { f: (τ) => 42 + 20 * Math.exp(-τ / 0.3), dur: 2.0, serang: 0.01, lepas: 0.5, parsial: [[1, 1, 0.9], [2, 0.3, 0.5]], gain: 0.4 });
    derau(c.t + 0.05, { dur: 1.9, fc: (τ) => 260 - 140 * klem(τ / 1.8), q: 0.8, jenis: "lp", bentuk: selubung(0.05, 1.9, 0.8), gain: 0.45 });
    derau(c.t + 0.4, { dur: 1.3, fc: (τ) => 700 - 400 * klem(τ / 1.3), q: 3, bentuk: (τ) => selubung(0.2, 1.3, 0.5)(τ) * (0.5 + 0.5 * Math.sin(DUA_PI * 9 * τ)), gain: 0.06 }); // gelegak
  },
  // Menara cip: dengung digital pelan yang bertahan, dan kedip naik tiap menara menyala.
  "dengung-cip": (c) => {
    for (const [f, p, g] of [[110, -0.4, 1], [110.6, 0.4, 1], [164.8, 0, 0.6]]) {
      nada(c.t, { f, dur: c.dur, serang: 1.6, lepas: 0.8, parsial: [[1, 1, 1e9], [3, 0.22, 1e9], [5, 0.08, 1e9], [7, 0.03, 1e9]], gain: 0.03 * g, pan: p, getar: { laju: 5.5, dalam: 0.25 } });
    }
    derau(c.t, { dur: c.dur, fc: 2400, q: 6, bentuk: selubung(1.8, c.dur, 0.8), gain: 0.012 });
  },
  "blip-cip": (c) => {
    const f = nadaPenta(5 + c.nada);
    nada(c.t, { f: (τ) => (τ < 0.045 ? f : f * 1.5), dur: 0.16, serang: 0.002, lepas: 0.04, parsial: [[1, 1, 0.08], [3, 0.12, 0.04]], gain: 0.05 * c.vel, pan: c.pan });
  },
  // 5. Kamera naik ke jalan HMI.
  "desir-naik": (c) => derau(c.t, { dur: c.dur + 0.2, fc: (τ) => 320 * Math.pow(5, klem(τ / c.dur)), q: 0.9, bentuk: selubung(0.6, c.dur + 0.2, 0.6), gain: 0.2 }),
  // Langkah berbaris.
  langkah: (c) => {
    const b = c.berat;
    nada(c.t, { f: (τ) => 70 + 50 * Math.exp(-τ / 0.015), dur: 0.12, serang: 0.002, lepas: 0.03, parsial: [[1, 1, 0.045]], gain: 0.26 * b * c.vel, pan: c.pan });
    derau(c.t, { dur: 0.06, fc: 700, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.014), gain: 0.18 * b * c.vel, pan: c.pan });
  },
  // Angin kencang 1960-an: hembusan yang bergerak ke kanan, seperti garis angin di layar.
  angin: (c) => {
    const a = lambat(91, 2.2);
    derau(c.t, { dur: c.dur + 0.3, fc: (τ) => 500 + 700 * a(τ), q: 1.3, bentuk: (τ) => selubung(0.4, c.dur + 0.3, 0.6)(τ) * (0.45 + 0.55 * a(τ)), gain: 0.3, pan: (τ) => -0.7 + 1.4 * klem(τ / (c.dur + 0.3)) });
    derau(c.t, { dur: c.dur + 0.3, fc: 260, q: 0.7, jenis: "lp", bentuk: selubung(0.5, c.dur + 0.3, 0.6), gain: 0.12 });
  },
  // Buku NDP menyala: nada cahaya yang lembut.
  "cahaya-buku": (c) => {
    nada(c.t, { f: 1174.66, dur: 1.6, serang: 0.003, lepas: 0.3, parsial: [[1, 1, 0.5], [2, 0.2, 0.25], [3.01, 0.06, 0.12]], gain: 0.05, pan: 0 }); // kilau saat menyala
    nada(c.t, { f: 587.33, dur: c.dur, serang: 0.035, lepas: 0.6, parsial: [[1, 1, 1.4], [2, 0.18, 0.8]], gain: 0.07, pan: -0.15, getar: { laju: 6, dalam: 0.15 } });
    nada(c.t + 0.06, { f: 880, dur: c.dur - 0.06, serang: 0.05, lepas: 0.6, parsial: [[1, 1, 1.2], [2, 0.12, 0.6]], gain: 0.05, pan: 0.15, getar: { laju: 5, dalam: 0.15 } });
    nada(c.t + 0.12, { f: 739.99, dur: c.dur - 0.12, serang: 0.08, lepas: 0.6, parsial: [[1, 1, 1.0]], gain: 0.035, pan: 0 });
    derau(c.t, { dur: c.dur, fc: 3200, q: 4, bentuk: selubung(0.15, c.dur, 1.0), gain: 0.015 });
  },
  // Jalan bercabang: dua nada yang memisah dan tidak bertemu lagi.
  cabang: (c) => {
    nada(c.t, { f: (τ) => 392 * Math.pow(2, (3 / 12) * halus(τ / 0.6)), dur: c.dur, serang: 0.03, lepas: 0.4, parsial: [[1, 1, 0.8], [2, 0.15, 0.4]], gain: 0.05, pan: (τ) => -0.5 * halus(τ / 0.6) });
    nada(c.t, { f: (τ) => 392 * Math.pow(2, (-4 / 12) * halus(τ / 0.6)), dur: c.dur, serang: 0.03, lepas: 0.4, parsial: [[1, 1, 0.8], [2, 0.15, 0.4]], gain: 0.05, pan: (τ) => 0.5 * halus(τ / 0.6) });
  },
  "pop-alumni": (c) => {
    nada(c.t, { f: (τ) => nadaPenta(5 + c.nada) * (1 + 0.4 * Math.exp(-τ / 0.015)), dur: 0.3, serang: 0.002, lepas: 0.05, parsial: [[1, 1, 0.1], [2, 0.15, 0.05]], gain: 0.05 * c.vel, pan: c.pan });
    nada(c.t, { f: 110, dur: 0.12, serang: 0.002, lepas: 0.03, parsial: [[1, 1, 0.04]], gain: 0.08 * c.vel, pan: c.pan });
  },
  // 6. Kamera melebar ke ratusan titik cabang.
  "desir-luas": (c) => derau(c.t, { dur: c.dur, fc: (τ) => 1400 * Math.pow(0.35, klem(τ / c.dur)), q: 0.8, bentuk: selubung(0.4, c.dur, 0.8), gain: 0.12 }),
  "kilau-titik": (c) => nada(c.t, { f: nadaPenta(c.nada + 5), dur: 0.5, serang: 0.002, lepas: 0.08, parsial: [[1, 1, 0.16], [2.76, 0.1, 0.06]], gain: 0.035 * c.vel, pan: c.pan }),
  // Tali tegang ditarik dua kelompok: serat berderit.
  "tegang-tali": (c) => {
    derau(c.t, { dur: 0.55, fc: (τ) => 650 + 150 * Math.sin(DUA_PI * 3 * τ), q: 5, bentuk: (τ) => selubung(0.02, 0.55, 0.25)(τ) * (0.5 + 0.5 * Math.sign(Math.sin(DUA_PI * 38 * τ))), gain: 0.16 * c.vel, pan: c.pan });
    nada(c.t, { f: (τ) => 120 + 15 * τ, dur: 0.5, serang: 0.01, lepas: 0.2, parsial: [[1, 1, 0.3], [2, 0.4, 0.2]], gain: 0.08 * c.vel, pan: c.pan });
  },
  // Energi bocor: nada yang turun dan meredup (abu-abu).
  bocor: (c) => {
    nada(c.t, { f: (τ) => 520 * Math.pow(0.3, klem(τ / c.dur)), dur: c.dur, serang: 0.4, lepas: 0.8, parsial: [[1, 1, 1e9], [2, 0.2, 1e9]], gain: 0.04, pan: 0, getar: { laju: 3.2, dalam: 0.35 } });
    derau(c.t, { dur: c.dur, fc: (τ) => 1500 * Math.pow(0.25, klem(τ / c.dur)), q: 1.5, bentuk: selubung(0.6, c.dur, 1.0), gain: 0.05 });
  },
  // 7. Gapura berdiri: dentum hangat dan kilau emas.
  "gapura-berdiri": (c) => {
    nada(c.t, { f: (τ) => 52 + 24 * Math.exp(-τ / 0.1), dur: 1.2, serang: 0.004, lepas: 0.3, parsial: [[1, 1, 0.45], [2, 0.3, 0.25]], gain: 0.45 });
    derau(c.t, { dur: 0.6, fc: 220, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.005) * Math.exp(-τ / 0.15), gain: 0.35 });
    const f = c.nada === 0 ? [293.66, 440, 587.33] : [329.63, 493.88, 659.26];
    f.forEach((x, k) => nada(c.t + 0.55 + k * 0.05, { f: x, dur: 1.6, serang: 0.01, lepas: 0.4, parsial: [[1, 1, 0.8], [2, 0.2, 0.4]], gain: 0.035, pan: [-0.3, 0.3, 0][k] }));
  },
  // Figur muda tumbuh: nada naik yang sangat lembut.
  tumbuh: (c) => nada(c.t, { f: (τ) => 220 * Math.pow(1.5, klem(τ / c.dur)), dur: c.dur, serang: 0.6, lepas: 0.8, parsial: [[1, 1, 1e9], [2, 0.3, 1e9], [3, 0.08, 1e9]], gain: 0.03, pan: 0 }),
  // 8. Kembali ke perahu.
  "desir-kembali": (c) => derau(c.t, { dur: c.dur + 0.2, fc: (τ) => 900 * Math.pow(0.35, klem(τ / c.dur)), q: 0.9, bentuk: selubung(0.35, c.dur + 0.2, 0.5), gain: 0.14 }),
  // Gelora yang naik saat perahu melesat menuju kedua gapura.
  gelora: (c) => {
    const lama = T_LEWAT_GAPURA[1] - c.t;
    const naik = (τ) => klem(τ / lama);
    derau(c.t, { dur: c.dur, fc: (τ) => 300 + 2000 * naik(τ) * naik(τ), q: 0.8, jenis: "lp", bentuk: (τ) => (τ < lama ? 0.25 + 0.75 * naik(τ) * naik(τ) : Math.pow(Math.cos((Math.PI / 2) * klem((τ - lama) / (c.dur - lama))), 2)) * sin2(τ / 0.5), gain: 0.22 });
    nada(c.t, { f: (τ) => 98 * Math.pow(2, naik(τ)), dur: c.dur, serang: 0.6, lepas: 0.45, parsial: [[1, 1, 1e9], [2, 0.3, 1e9], [3, 0.1, 1e9]], gain: 0.05, bentuk: (τ) => 0.4 + 0.6 * naik(τ) });
  },
  // Melewati gapura: desir pendek yang memuncak tepat saat perahu lewat, dentum rendah, dan kilau emas.
  "lewat-gapura": (c) => {
    derau(c.t - 0.15, { dur: 0.6, fc: (τ) => 600 + 1800 * Math.exp(-Math.pow((τ - 0.15) / 0.12, 2)), q: 0.9, bentuk: (τ) => (τ < 0.15 ? sin2(τ / 0.15) : Math.exp(-(τ - 0.15) / 0.12)), gain: 0.2 });
    nada(c.t, { f: (τ) => 66 + 30 * Math.exp(-τ / 0.05), dur: 0.8, serang: 0.003, lepas: 0.2, parsial: [[1, 1, 0.3], [2, 0.25, 0.15]], gain: 0.32 });
    const f0 = c.nada === 0 ? 587.33 : 659.26;
    nada(c.t + 0.02, { f: f0, dur: 1.4, serang: 0.004, lepas: 0.3, parsial: [[1, 1, 0.7], [2, 0.3, 0.35], [3.01, 0.1, 0.2]], gain: 0.06 });
  },
  // 9. Bola dunia menyala: akor terbuka yang lebar, bertahan sampai akhir.
  "akor-dunia": (c) => {
    const sisa = DURASI - c.t - 0.05;
    nada(c.t, { f: (τ) => 55 + 35 * Math.exp(-τ / 0.12), dur: 1.6, serang: 0.004, lepas: 0.4, parsial: [[1, 1, 0.6], [2, 0.3, 0.3]], gain: 0.42 });
    derau(c.t, { dur: 0.4, fc: 200, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.004) * Math.exp(-τ / 0.08), gain: 0.25 });
    const hangat = [[1, 1, 4], [1.003, 0.5, 4], [2, 0.16, 1.5], [3, 0.05, 0.8]];
    // D mayor add9 dengan susunan terbuka: D2 A2 E3 F#3 A3 D4 E4.
    [[73.42, 0], [110.0, -0.5], [164.81, 0.5], [185.0, -0.25], [220.0, 0.25], [293.66, -0.6], [329.63, 0.6]]
      .forEach(([f, p], k) => nada(c.t + 0.01 + 0.035 * k, { f, dur: sisa - 0.035 * k, serang: 0.18, lepas: 1.4, parsial: hangat, gain: k === 0 ? 0.05 : 0.03, pan: p }));
  },
  "kilau-dunia": (c) => nada(c.t, { f: nadaPenta(c.nada + 5), dur: 1.2, serang: 0.003, lepas: 0.3, parsial: [[1, 1, 0.5], [2, 0.18, 0.25], [3.01, 0.05, 0.12]], gain: 0.04 * c.vel, pan: c.pan }),
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
  for (let i = N - 1; i >= 0; i--) { // minimum jendela ke depan
    let m = 1;
    for (let k = 0; k <= la && i + k < N; k++) m = Math.min(m, perlu[i + k]);
    tahan[i] = m;
  }
  const lepas = 1 - Math.exp(-1 / (0.08 * SR));
  const out = new Float64Array(N);
  let g = 1;
  for (let i = 0; i < N; i++) { g = tahan[i] < g ? tahan[i] : g + (1 - g) * lepas; out[i] = g; }
  let jum = 0;
  for (let i = 0; i < N; i++) { // rata-rata bergerak supaya serangannya halus
    jum += out[i];
    if (i > la) jum -= out[i - la - 1];
    const h = Math.min(out[i], jum / Math.min(i + 1, la + 1));
    l[i] *= h; r[i] *= h;
  }
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
for (let i = 0; i < N; i++) { // ujung berkas tanpa klik, akhir memudar 1,2 detik
  const f = Math.min(1, i / (0.002 * SR), Math.pow(Math.sin((Math.PI / 2) * klem((N - 1 - i) / (1.2 * SR))), 2));
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
  console.log(`  penguatan total ${(20 * Math.log10(gainTotal)).toFixed(1)} dB; pembatas menekan paling banyak ${(20 * Math.log10(Math.max(maks, plafon) / plafon)).toFixed(1)} dB, pada ${((100 * tertekan) / N).toFixed(2)}% sampel`);
}

// ---------------------------------------------------------------- periksa sinkron: awal bunyi di sekitar peristiwa gambar
{
  const mono = new Float64Array(N);
  for (let i = 0; i < N; i++) mono[i] = (L[i] + R[i]) / 2;
  const pita = { lebar: mono, tinggi: highpass(mono, 900), rendah: lowpass(mono, 250) };
  const BINGKAI = 0.001 * SR; // 1 ms
  console.log("\n  peristiwa               gambar (t, frame)    bunyi mulai   selisih");
  for (const p of peristiwaPeriksa()) {
    const x = pita[p.pita];
    const energi = (t) => { const i = Math.round(t * SR); let s = 0; for (let k = 0; k < BINGKAI; k++) s += x[i + k] ** 2; return s / BINGKAI; };
    let latar = 0;
    for (let t = p.t - 0.32; t < p.t - 0.22; t += 0.001) latar += energi(t) / 100;
    const ambang = Math.max(latar * 10, 1e-8); // +10 dB di atas latar
    let mulai = null;
    for (let t = p.t - 0.2; t < p.t + 0.2; t += 0.001) if (energi(t) > ambang && energi(t + 0.001) > ambang) { mulai = t; break; }
    const sel = mulai === null ? "tidak ketemu" : `${((mulai - p.t) * 1000).toFixed(0).padStart(4)} ms`;
    console.log(`  ${p.nama.padEnd(22)} ${p.t.toFixed(3).padStart(7)} s (#${(p.t * 30).toFixed(1).padStart(6)})   ${mulai === null ? "     -   " : (mulai.toFixed(3) + " s")}   ${sel}   [pita ${p.pita}]`);
  }
}

// ---------------------------------------------------------------- gabungkan dengan video
const video = resolve(hasil, `${NAMA}.mp4`);
const keluaran = resolve(hasil, `${NAMA}-suara.mp4`);
if (!existsSync(video)) { console.log(`\nVideo belum ada (${video}); hanya WAV yang ditulis.`); process.exit(0); }
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", video, "-i", berkasWav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", keluaran], { stdio: "inherit" });
if (ff.status !== 0) throw new Error(`ffmpeg keluar dengan kode ${ff.status}`);
console.log(`\n${keluaran}`);
