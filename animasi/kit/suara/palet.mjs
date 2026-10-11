/**
 * Palet bunyi kit: satu bunyi untuk setiap jenis di KONTRAK §3. Lembut, hangat, digital, tanpa musik.
 * Dihimpun dari empat video sebelumnya (kuis-evidence-opus-intro, ekosistem-berbasis-bukti, indikator-01, -02).
 *
 * Setiap entri:
 *   buat(s)        menggambar bunyi lewat s.ton(), s.derau(), s.dentum() (waktu lokal, detik sejak peristiwa).
 *   tingkat        target kenyaringan 100 ms terbesar (LUFS relatif) pada kuat 0,7. Penguatan dihitung otomatis.
 *   durasi         durasi bawaan bila peristiwa tidak memberi `durasi` (angka, atau fungsi dari sisa video).
 *   berdurasi      bunyi memakai `durasi` peristiwa.
 *   lama           panjang penyangga bunyi (detik, atau fungsi dari durasi efektif).
 *   dasar          derajat pentatonik untuk nada 0 (0 = D4, 5 = D5, 10 = D6).
 *   jarakMin       peristiwa sejenis dari sumber yang sama yang lebih rapat dari ini digabung.
 *   ekor           lama bunyi dianggap "aktif" untuk batas suara serentak.
 *   maksSerentak   batas suara serentak untuk jenis ini.
 *   latar          bunyi suasana; tidak dihitung dalam batas suara serentak.
 *   wajib          tidak pernah dipangkas.
 *   impulsif, pita awal bunyinya tajam, jadi bisa dipakai untuk periksa sinkron; pita = lebar|tinggi|rendah.
 *   variasiNada, variasiGainDb   variasi berbenih per peristiwa supaya pengulangan tidak kaku.
 */
import { DUA_PI, klem, halus, sin2, turun } from "./dsp.mjs";

const klik = (s, t, { fc = 2600, q = 1.4, lama = 0.003, gain = 0.1, pan = 0 } = {}) =>
  s.derau(t, { dur: Math.max(0.012, lama * 7), fc, q, bentuk: (τ) => sin2(τ / 0.0005) * Math.exp(-τ / lama), gain, pan });
const hangat = [[1, 1, 1.8], [1.0035, 0.5, 1.8], [2, 0.16, 0.9], [3, 0.05, 0.5]];
const lonceng = (d = 0.5) => [[1, 1, d], [2, 0.2, d * 0.5], [2.76, 0.08, d * 0.3]];

export const PALET = {
  // ================================================================ Struktur video
  "grid-nyala": {
    kelompok: "Struktur video",
    keterangan: "Desir udara yang mengembang pelan di atas alas kuint rendah D–A; dunia menyala.",
    tingkat: -25, durasi: 1.8, berdurasi: true, lama: (d) => d + 0.1, latar: true,
    buat(s) {
      const d = Math.max(0.4, s.durasi);
      const r = Math.sqrt(s.rasio);
      s.derau(0, {
        dur: d, fc: (τ) => 260 * r * Math.pow(900 / 260, klem(τ / d)), q: 0.8,
        bentuk: (τ) => sin2(τ / (0.35 * d)) * turun(τ, 0.5 * d, d), gain: 0.14, pan: (τ) => -0.15 + (0.3 * τ) / d,
      });
      const alas = (τ) => sin2(τ / (0.4 * d)) * turun(τ, 0.45 * d, d);
      s.ton(0, { f: s.f(-5), dur: d, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.25, 99]], gain: 0.03, bentuk: alas });
      s.ton(0, { f: s.f(-2), dur: d, serang: 0, lepas: 0.05, parsial: [[1, 1, 99]], gain: 0.018, bentuk: alas, pan: 0.15 });
    },
  },
  melambat: {
    kelompok: "Struktur video",
    keterangan: "Desah rendah yang turun lalu reda; gerak melambat dan berhenti.",
    tingkat: -24, durasi: 1.0, berdurasi: true, lama: (d) => d + 0.1, latar: true,
    buat(s) {
      const d = Math.max(0.3, s.durasi);
      s.derau(0, {
        dur: d, fc: (τ) => 900 * Math.sqrt(s.rasio) * Math.pow(220 / 900, klem(τ / d)), q: 0.8, jenis: "lp",
        bentuk: (τ) => sin2(τ / Math.min(0.25, d * 0.3)) * turun(τ, 0.45 * d, d), gain: 0.16,
      });
      s.ton(0, { f: (τ) => 98 * s.rasio * Math.pow(0.7, klem(τ / d)), dur: d, serang: 0.08, lepas: 0.1, parsial: [[1, 1, 99], [2, 0.3, 99]], gain: 0.035, bentuk: (τ) => turun(τ, 0.3 * d, d) });
    },
  },
  "kartu-akhir": {
    kelompok: "Struktur video",
    keterangan: "Dentum lembut dan akor hangat sus4 → mayor yang meluruh pelan sampai video selesai.",
    tingkat: -18, durasi: (sisa) => klem(sisa - 0.05, 1.2, 8), berdurasi: true, lama: (d) => d + 0.05,
    dasar: -5, wajib: true, impulsif: true, pita: "rendah", variasiNada: 0,
    buat(s) {
      const d = Math.max(0.6, s.durasi);
      s.dentum(0, { f0: 100, f1: 50, lama: 0.7, gain: 0.09 });
      s.derau(0, { dur: 0.25, fc: 220, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.003) * Math.exp(-τ / 0.05), gain: 0.08 });
      const tutup = (τ) => turun(τ, Math.max(0.3, d - 1.4), d);
      // D3 A3 D4 A4 + G4 yang turun ke F#4 (sus4 → mayor). Dengan nada, seluruh akor digeser.
      for (const k of [0, 3, 5, 8]) s.ton(0, { f: s.f(k), dur: d, serang: 0.09, lepas: 0.05, parsial: hangat, gain: 0.034, bentuk: tutup });
      const g4 = s.f(5) * Math.pow(2, 5 / 12), fis4 = s.f(5) * Math.pow(2, 4 / 12);
      s.ton(0, { f: g4, dur: Math.min(0.55, d), serang: 0.09, lepas: 0.12, parsial: hangat, gain: 0.034 });
      if (d > 0.6) s.ton(0.45, { f: fis4, dur: d - 0.45, serang: 0.08, lepas: 0.05, parsial: hangat, gain: 0.034, bentuk: (τ) => tutup(τ + 0.45) });
    },
  },
  pil: {
    kelompok: "Struktur video",
    keterangan: "Tik-pop kecil bernada; label pil seperti \"Indikator 17 dari 44\" muncul.",
    tingkat: -22, lama: 0.25, dasar: 7, impulsif: true, pita: "tinggi",
    buat(s) {
      const f = s.f(0);
      s.ton(0, { f: (τ) => f * (1 + 0.1 * Math.exp(-τ / 0.01)), dur: 0.22, serang: 0.002, lepas: 0.06, parsial: [[1, 1, 0.06], [2, 0.12, 0.03]], gain: 0.07 });
      klik(s, 0, { fc: 2400, lama: 0.003, gain: 0.05 });
    },
  },

  // ================================================================ Benda
  muncul: {
    kelompok: "Benda",
    keterangan: "Letup lembut bernada dengan sedikit badan rendah; benda muncul. Nada naik untuk urutan.",
    tingkat: -20, lama: 0.45, dasar: 5, impulsif: true, pita: "lebar", maksSerentak: 5,
    buat(s) {
      const f = s.f(0);
      s.ton(0, { f: (τ) => f * (1 + 0.12 * Math.exp(-τ / 0.012)), dur: 0.45, serang: 0.003, lepas: 0.15, parsial: [[1, 1, 0.09], [2, 0.14, 0.05], [3, 0.03, 0.03]], gain: 0.1 });
      s.ton(0, { f: (τ) => 140 + 60 * Math.exp(-τ / 0.015), dur: 0.15, serang: 0.002, lepas: 0.04, parsial: [[1, 1, 0.04]], gain: 0.06 });
      s.derau(0, { dur: 0.04, fc: 1300, q: 0.9, bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.008), gain: 0.03 });
    },
  },
  hilang: {
    kelompok: "Benda",
    keterangan: "Nada kecil yang meluncur turun dengan hembus udara; benda menghilang.",
    tingkat: -22, lama: 0.32, dasar: 5, impulsif: true, pita: "lebar",
    buat(s) {
      const f = s.f(2);
      s.ton(0, { f: (τ) => f * (1 - 0.3 * halus(τ / 0.14)), dur: 0.3, serang: 0.008, lepas: 0.1, parsial: [[1, 1, 0.08], [2, 0.1, 0.04]], gain: 0.08 });
      s.derau(0, { dur: 0.22, fc: (τ) => 1500 * Math.pow(500 / 1500, klem(τ / 0.2)), q: 1.0, bentuk: (τ) => sin2(τ / 0.02) * turun(τ, 0.06, 0.22), gain: 0.04 });
    },
  },
  tumbuh: {
    kelompok: "Benda",
    keterangan: "Bip lembut yang meluncur naik sekuint selama benda tumbuh (mengikuti durasi).",
    tingkat: -21, durasi: 0.35, berdurasi: true, lama: (d) => klem(d, 0.15, 2.5) + 0.15, dasar: 2, maksSerentak: 5,
    buat(s) {
      const d = klem(s.durasi, 0.15, 2.5);
      const f = s.f(0);
      s.ton(0, { f: (τ) => f * (1 + 0.5 * halus(τ / d)), dur: d + 0.12, serang: 0.006, lepas: 0.08, parsial: [[1, 1, 0.2 + d * 0.5], [2, 0.12, 0.1 + d * 0.25]], gain: 0.07 });
      s.derau(0, { dur: d + 0.05, fc: (τ) => 700 * Math.pow(2.2, klem(τ / d)), q: 1.4, bentuk: (τ) => sin2(τ / 0.03) * turun(τ, d * 0.6, d + 0.05), gain: 0.025 });
    },
  },
  menyala: {
    kelompok: "Benda",
    keterangan: "Kilau kaca dua nada dengan getar halus dan dengung hangat; benda menyala.",
    tingkat: -21, lama: 0.95, dasar: 7,
    buat(s) {
      [0, 3].forEach((k, i) => s.ton(0.05 * i, { f: s.f(k), dur: 0.9, serang: 0.012, lepas: 0.2, parsial: [[1, 1, 0.4], [1.004, 0.6, 0.4], [2, 0.08, 0.2]], gain: 0.04, getar: { laju: 9, dalam: 0.25 } }));
      s.derau(0, { dur: 0.25, fc: (τ) => 1000 * Math.pow(3, klem(τ / 0.2)), q: 1.2, bentuk: (τ) => sin2(τ / 0.04) * turun(τ, 0.08, 0.25), gain: 0.025 });
      s.ton(0, { f: s.f(-12), dur: 0.6, serang: 0.05, lepas: 0.2, parsial: [[1, 1, 0.3], [2, 0.3, 0.2]], gain: 0.04 });
    },
  },
  padam: {
    kelompok: "Benda",
    keterangan: "Nada yang turun dan meredup dengan desah rendah; benda padam.",
    tingkat: -22, lama: 0.45, dasar: 5,
    buat(s) {
      const f = s.f(0);
      s.ton(0, { f: (τ) => f * Math.pow(0.6, halus(τ / 0.3)), dur: 0.42, serang: 0.004, lepas: 0.12, parsial: [[1, 1, 0.15], [2, 0.12, 0.07]], gain: 0.06 });
      s.derau(0, { dur: 0.3, fc: (τ) => 1200 * Math.pow(0.3, klem(τ / 0.3)), q: 0.8, jenis: "lp", bentuk: (τ) => sin2(τ / 0.01) * Math.exp(-τ / 0.1), gain: 0.05 });
    },
  },
  retak: {
    kelompok: "Benda",
    keterangan: "Retakan pendek berbutir di atas dentum kecil; tidak tajam.",
    tingkat: -20, lama: 0.3, impulsif: true, pita: "tinggi", variasiNada: 0.03,
    buat(s) {
      const r = Math.sqrt(s.rasio);
      klik(s, 0, { fc: 2600 * r, q: 1.3, lama: 0.005, gain: 0.12 });
      for (let k = 0; k < 6; k++) {
        const tt = 0.008 + 0.09 * s.acak() * s.acak();
        klik(s, tt, { fc: (1800 + 1500 * s.acak()) * r, q: 1.5, lama: 0.003, gain: 0.06 + 0.06 * s.acak(), pan: (s.acak() - 0.5) * 0.3 });
      }
      s.dentum(0.005, { f0: 130, f1: 70, lama: 0.18, gain: 0.13 });
    },
  },
  putar: {
    kelompok: "Benda",
    keterangan: "Desir putar yang membesar lalu mengecil dengan dengung tipis (mengikuti durasi).",
    tingkat: -23, durasi: 0.6, berdurasi: true, lama: (d) => klem(d, 0.2, 4) + 0.05,
    buat(s) {
      const d = klem(s.durasi, 0.2, 4);
      const amplop = (τ) => Math.pow(Math.sin(Math.PI * klem(τ / d)), 1.2);
      s.derau(0, { dur: d, fc: (τ) => (700 + 700 * Math.sin(Math.PI * klem(τ / d))) * Math.sqrt(s.rasio), q: 1.5, bentuk: (τ) => amplop(τ) * (0.75 + 0.25 * Math.sin(DUA_PI * 12 * τ)), gain: 0.07, pan: (τ) => 0.25 * Math.sin((DUA_PI * τ) / d) });
      s.ton(0, { f: (τ) => (220 + 60 * Math.sin(Math.PI * klem(τ / d))) * s.rasio, dur: d, serang: 0.05, lepas: 0.08, parsial: [[1, 1, 99], [2, 0.3, 99]], gain: 0.02, bentuk: amplop });
    },
  },

  // ================================================================ Hasil
  "klik-emas": {
    kelompok: "Hasil",
    keterangan: "Klik renyah lalu denting emas dua nada yang hangat; hasil yang benar.",
    tingkat: -17, lama: 1.25, dasar: 10, wajib: true, impulsif: true, pita: "tinggi",
    buat(s) {
      klik(s, 0, { fc: 3000, lama: 0.0028, gain: 0.13 });
      s.ton(0, { f: 1900, dur: 0.1, serang: 0.0006, parsial: [[1, 1, 0.018], [1.62, 0.4, 0.012]], gain: 0.05 });
      s.ton(0, { f: 380, dur: 0.08, serang: 0.0008, parsial: [[1, 1, 0.02]], gain: 0.08 });
      s.ton(0.035, { f: s.f(0), dur: 1.1, serang: 0.003, lepas: 0.25, parsial: lonceng(0.5), gain: 0.05 });
      s.ton(0.095, { f: s.f(2), dur: 1.0, serang: 0.003, lepas: 0.25, parsial: lonceng(0.45), gain: 0.035, pan: 0.12 });
    },
  },
  centang: {
    kelompok: "Hasil",
    keterangan: "Dua nada naik yang cepat, A lalu D; tanda centang.",
    tingkat: -19, lama: 0.65, dasar: 7, wajib: true, impulsif: true, pita: "tinggi",
    buat(s) {
      const p = [[1, 1, 0.16], [2, 0.14, 0.07], [3.01, 0.04, 0.04]];
      klik(s, 0, { fc: 2200, q: 1.3, lama: 0.003, gain: 0.07 });
      s.ton(0, { f: s.f(0), dur: 0.35, serang: 0.002, lepas: 0.08, parsial: p, gain: 0.07 });
      s.ton(0.075, { f: s.f(3), dur: 0.55, serang: 0.002, lepas: 0.12, parsial: p.map(([r, a, d]) => [r, a, d * 1.6]), gain: 0.07 });
    },
  },
  denting: {
    kelompok: "Hasil",
    keterangan: "Denting lonceng kecil yang lembut; nada naik untuk urutan.",
    tingkat: -20, lama: 1.1, dasar: 7, impulsif: true, pita: "lebar", maksSerentak: 5,
    buat(s) {
      s.ton(0, { f: s.f(0), dur: 1.1, serang: 0.003, lepas: 0.2, parsial: [[1, 1, 0.42], [2, 0.16, 0.22], [2.76, 0.07, 0.14], [3.01, 0.04, 0.1]], gain: 0.07 });
    },
  },

  // ================================================================ Cermin
  denyut: {
    kelompok: "Cermin",
    keterangan: "Dengung rendah D–A yang membesar dan mengecil seirama denyut (periode bawaan 1,2 s).",
    tingkat: -25, durasi: 2.4, berdurasi: true, lama: (d) => Math.max(0.3, d) + 0.05, dasar: -5, latar: true, variasiNada: 0,
    buat(s) {
      const d = Math.max(0.3, s.durasi);
      const per = s.ev.periode > 0 ? s.ev.periode : 1.2;
      const e = (τ) => Math.pow(0.5 - 0.5 * Math.cos((DUA_PI * τ) / per), 1.4) * turun(τ, d - 0.15, d);
      const lembut = [[1, 1, 99], [2, 0.3, 99], [3, 0.08, 99]];
      const f = s.f(0);
      s.ton(0, { f, dur: d, serang: 0, lepas: 0.05, parsial: lembut, gain: 0.08, bentuk: e, pan: -0.15 });
      s.ton(0, { f: f * 1.0039, dur: d, serang: 0, lepas: 0.05, parsial: lembut, gain: 0.05, bentuk: e, pan: 0.15 });
      s.ton(0, { f: s.f(3), dur: d, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.15, 99]], gain: 0.03, bentuk: e });
      s.derau(0, { dur: d, fc: 650 * Math.sqrt(s.rasio), q: 1.6, bentuk: (τ) => 0.8 * e(τ), gain: 0.022 });
    },
  },

  // ================================================================ Gerak figur
  langkah: {
    kelompok: "Gerak figur",
    keterangan: "Ketuk langkah lembut: badan rendah dan tumit kayu kecil, kaki kiri-kanan bergantian.",
    tingkat: -25, lama: 0.17, jarakMin: 0.06, ekor: 0.12, maksSerentak: 4, impulsif: true, pita: "rendah",
    variasiNada: 0.05, variasiGainDb: 2,
    buat(s) {
      const r = s.rasio * (s.indeksSumber % 2 ? 0.94 : 1);
      s.ton(0, { f: (τ) => (92 + 70 * Math.exp(-τ / 0.012)) * r, dur: 0.16, serang: 0.0015, lepas: 0.05, parsial: [[1, 1, 0.045]], gain: 0.13 });
      s.derau(0, { dur: 0.05, fc: 650 * r, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.009), gain: 0.09 });
      s.ton(0.004, { f: 820 * r, dur: 0.07, serang: 0.0015, lepas: 0.02, parsial: [[1, 1, 0.014], [2.3, 0.25, 0.007]], gain: 0.03 });
      s.derau(0.002, { dur: 0.03, fc: 2000 * r, q: 1.4, bentuk: (τ) => sin2(τ / 0.0012) * Math.exp(-τ / 0.004), gain: 0.025 });
    },
  },

  // ================================================================ Lempar
  lempar: {
    kelompok: "Lempar",
    keterangan: "Jentik kecil lalu desir terbang yang memuncak di tengah lintasan (mengikuti durasi, x → x1).",
    tingkat: -21, durasi: 0.45, berdurasi: true, lama: (d) => klem(d, 0.15, 3) + 0.08, impulsif: true, pita: "tinggi",
    buat(s) {
      const d = klem(s.durasi, 0.15, 3);
      klik(s, 0, { fc: 2200, lama: 0.003, gain: 0.05 });
      s.derau(0, {
        dur: d + 0.06, fc: (τ) => (800 + 2000 * Math.sin(Math.PI * klem(τ / d))) * Math.sqrt(s.rasio), q: 1.1,
        bentuk: (τ) => Math.pow(Math.sin(Math.PI * klem(τ / d)), 1.3) * (0.8 + 0.2 * Math.sin(DUA_PI * 26 * τ)), gain: 0.12,
      });
    },
  },
  mendarat: {
    kelompok: "Lempar",
    keterangan: "Letup-dentum lembut; benda mendarat.",
    tingkat: -19, lama: 0.32, impulsif: true, pita: "rendah", variasiNada: 0.02,
    buat(s) {
      s.ton(0, { f: (τ) => (150 + 320 * Math.exp(-τ / 0.013)) * s.rasio, dur: 0.18, serang: 0.0015, lepas: 0.05, parsial: [[1, 1, 0.055], [2, 0.12, 0.03]], gain: 0.2 });
      s.dentum(0, { f0: 130, f1: 70, lama: 0.2, gain: 0.1 });
      s.derau(0, { dur: 0.06, fc: 900, q: 0.8, jenis: "lp", bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.012), gain: 0.1 });
    },
  },

  // ================================================================ Kertas
  kertas: {
    kelompok: "Kertas",
    keterangan: "Desir kertas berbutir; lembar, tabel, atau dokumen muncul.",
    tingkat: -21, lama: 0.45, impulsif: true, pita: "tinggi", variasiNada: 0.04,
    buat(s) {
      s.derau(0, { dur: 0.42, fc: (τ) => (1600 + 1400 * klem(τ / 0.3)) * s.rasio, q: 0.9, bentuk: (τ) => sin2(τ / 0.03) * turun(τ, 0.18, 0.42), gain: 0.1 });
      for (let k = 0; k < 9; k++) {
        const tt = 0.02 + 0.32 * s.acak();
        klik(s, tt, { fc: 2400 + 1400 * s.acak(), q: 1.5, lama: 0.004, gain: 0.04 * (0.5 + s.acak()), pan: (s.acak() - 0.5) * 0.3 });
      }
    },
  },
  balon: {
    kelompok: "Kertas",
    keterangan: "\"Blup\" naik sekuint yang singkat; balon ucapan atau pesan muncul.",
    tingkat: -20, lama: 0.35, dasar: 3, impulsif: true, pita: "lebar",
    buat(s) {
      const f = s.f(0);
      s.ton(0, { f: (τ) => f * (1 + 0.5 * halus(τ / 0.12)), dur: 0.32, serang: 0.008, lepas: 0.08, parsial: [[1, 1, 0.12], [2, 0.18, 0.06]], gain: 0.11 });
      s.derau(0, { dur: 0.3, fc: (τ) => 900 + 1800 * klem(τ / 0.25), q: 1.2, bentuk: (τ) => sin2(τ / 0.05) * turun(τ, 0.12, 0.3), gain: 0.035 });
    },
  },
  "label-ganti": {
    kelompok: "Kertas",
    keterangan: "Tik mekanis kecil bernada; label atau angka berganti.",
    tingkat: -23, lama: 0.14, dasar: 10, impulsif: true, pita: "tinggi",
    buat(s) {
      klik(s, 0, { fc: 2600, q: 1.5, lama: 0.003, gain: 0.06 });
      s.ton(0, { f: s.f(0), dur: 0.14, serang: 0.001, parsial: [[1, 1, 0.04], [2.1, 0.2, 0.018]], gain: 0.06 });
    },
  },
  cap: {
    kelompok: "Kertas",
    keterangan: "Dentum kayu dan tepukan karet di kertas; stempel atau cap.",
    tingkat: -16, lama: 0.4, wajib: true, impulsif: true, pita: "rendah", variasiNada: 0.02,
    buat(s) {
      s.dentum(0, { f0: 160 * s.rasio, f1: 72 * s.rasio, lama: 0.26, gain: 0.3 });
      s.ton(0, { f: 620 * s.rasio, dur: 0.1, serang: 0.0008, parsial: [[1, 1, 0.025], [2.3, 0.3, 0.012]], gain: 0.1 });
      s.derau(0, { dur: 0.09, fc: 900, q: 0.8, bentuk: (τ) => sin2(τ / 0.0006) * Math.exp(-τ / 0.015), gain: 0.22 });
    },
  },
  kayu: {
    kelompok: "Kertas",
    keterangan: "Ketuk kayu yang hangat; papan, balok, atau rak terpasang.",
    tingkat: -19, lama: 0.4, impulsif: true, pita: "lebar", variasiNada: 0.015,
    buat(s) {
      s.ton(0, { f: 205 * s.rasio, dur: 0.4, serang: 0.0015, lepas: 0.1, parsial: [[1, 1, 0.075], [2.62, 0.4, 0.035], [4.9, 0.12, 0.016]], gain: 0.17 });
      s.dentum(0, { f0: 140, f1: 84, lama: 0.2, gain: 0.12 });
      s.derau(0, { dur: 0.08, fc: 850, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.012), gain: 0.14 });
    },
  },
  "laci-buka": {
    kelompok: "Kertas",
    keterangan: "Gesek kayu yang meluncur lalu ketuk kecil saat laci berhenti (mengikuti durasi).",
    tingkat: -21, durasi: 0.5, berdurasi: true, lama: (d) => klem(d, 0.2, 2) + 0.3,
    buat(s) {
      const d = klem(s.durasi, 0.2, 2);
      const laju = (τ) => { const u = klem(τ / d); return 4 * u * (1 - u); };
      const amplop = (τ) => sin2(τ / 0.05) * (0.3 + 0.7 * laju(τ)) * turun(τ, d - 0.06, d + 0.02);
      const gerinda = (τ) => 0.7 + 0.3 * Math.sin(DUA_PI * 31 * τ + 2 * Math.sin(DUA_PI * 7 * τ));
      s.derau(0, { dur: d + 0.03, fc: 420 * s.rasio, q: 1.2, bentuk: (τ) => amplop(τ) * gerinda(τ), gain: 0.16 });
      s.derau(0, { dur: d + 0.03, fc: 1400 * s.rasio, q: 2.0, bentuk: (τ) => 0.5 * amplop(τ), gain: 0.03 });
      s.ton(d, { f: 240 * s.rasio, dur: 0.25, serang: 0.0015, lepas: 0.08, parsial: [[1, 1, 0.05], [2.62, 0.3, 0.02]], gain: 0.1 });
      s.derau(d, { dur: 0.06, fc: 700, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.01), gain: 0.1 });
    },
  },
  pintu: {
    kelompok: "Kertas",
    keterangan: "Ayunan udara dengan derit tipis, ditutup ketuk gerendel lembut (mengikuti durasi).",
    tingkat: -21, durasi: 0.9, berdurasi: true, lama: (d) => klem(d, 0.3, 3) + 0.3,
    buat(s) {
      const d = klem(s.durasi, 0.3, 3);
      s.derau(0, { dur: d + 0.05, fc: (τ) => 300 + 500 * Math.sin(Math.PI * klem(τ / d)), q: 0.7, jenis: "lp", bentuk: (τ) => Math.sin(Math.PI * klem(τ / d)), gain: 0.12 });
      const lama = d * 0.6;
      for (let τ = 0.02; τ < lama; τ += 0.014 + 0.02 * s.acak()) {
        const u = τ / lama;
        s.ton(τ, { f: (300 + 200 * u) * s.rasio, dur: 0.04, serang: 0.002, lepas: 0.015, parsial: [[1, 1, 0.01], [2, 0.4, 0.008], [3, 0.2, 0.006]], gain: 0.025 * Math.sin(Math.PI * u) * (0.6 + 0.4 * s.acak()) });
      }
      s.ton(d, { f: 180 * s.rasio, dur: 0.25, serang: 0.002, lepas: 0.08, parsial: [[1, 1, 0.05], [2.4, 0.3, 0.03]], gain: 0.1 });
      s.dentum(d, { f0: 120, f1: 65, lama: 0.2, gain: 0.08 });
    },
  },

  // ================================================================ Garis
  "garis-sambung": {
    kelompok: "Garis",
    keterangan: "Luncuran nada lembut selama garis ditarik, lalu ping kecil saat tersambung (di t + durasi).",
    tingkat: -22, durasi: 0.4, berdurasi: true, lama: (d) => klem(d, 0.2, 3) + 0.5, dasar: 5,
    buat(s) {
      const d = klem(s.durasi, 0.2, 3);
      const f = s.f(0);
      s.ton(0, { f: (τ) => f * (1 + 0.5 * halus(τ / d)), dur: d + 0.25, serang: 0.03, lepas: 0.2, parsial: [[1, 1, 0.5 + d], [2, 0.15, 0.25 + d / 2]], gain: 0.045, bentuk: (τ) => turun(τ, d, d + 0.25) });
      s.derau(0, { dur: d, fc: (τ) => 1500 * Math.pow(2.5, klem(τ / d)), q: 1.6, bentuk: (τ) => sin2(τ / 0.05) * turun(τ, d * 0.7, d), gain: 0.015 });
      s.ton(d, { f: s.f(5), dur: 0.45, serang: 0.002, lepas: 0.15, parsial: [[1, 1, 0.18], [2, 0.12, 0.08]], gain: 0.04 });
    },
  },
  "garis-putus": {
    kelompok: "Garis",
    keterangan: "Patahan pendek: jepret lembut, nada jatuh, dentum kecil.",
    tingkat: -20, lama: 0.32, impulsif: true, pita: "tinggi", variasiNada: 0.02,
    buat(s) {
      klik(s, 0, { fc: 3400, q: 1.3, lama: 0.004, gain: 0.25 });
      klik(s, 0.004, { fc: 1800, q: 2, lama: 0.008, gain: 0.12 });
      s.ton(0, { f: (τ) => (300 + 450 * Math.exp(-τ / 0.04)) * s.rasio, dur: 0.3, serang: 0.0008, lepas: 0.08, parsial: [[1, 1, 0.07], [1.5, 0.25, 0.05]], gain: 0.06 });
      s.dentum(0.01, { f0: 120, f1: 70, lama: 0.18, gain: 0.1 });
    },
  },

  // ================================================================ Suasana
  aliran: {
    kelompok: "Suasana",
    keterangan: "Aliran berkilau: desis lembut yang bergelombang dengan kilau pentatonik jarang (mengikuti durasi, x → x1).",
    tingkat: -26, durasi: 2.0, berdurasi: true, lama: (d) => Math.max(0.4, d) + 0.45, dasar: 3, latar: true,
    buat(s) {
      const d = Math.max(0.4, s.durasi);
      const rel = Math.min(0.5, d * 0.3), naik = Math.min(0.35, d * 0.3);
      const amplop = (τ) => sin2(τ / naik) * turun(τ, d - rel, d);
      s.derau(0, { dur: d, fc: (τ) => 1100 * Math.sqrt(s.rasio) * (1 + 0.25 * Math.sin(DUA_PI * 0.7 * τ)), q: 1.4, bentuk: (τ) => amplop(τ) * (0.85 + 0.15 * Math.sin(DUA_PI * 3.1 * τ)), gain: 0.07 });
      const jarak = 0.16, n = Math.floor((d - 0.1) / jarak);
      for (let k = 0; k < n; k++) {
        const τ = jarak * k + 0.03 * s.acak();
        s.ton(τ, { f: s.f(Math.floor(s.acak() * 8)), dur: 0.4, serang: 0.004, lepas: 0.15, parsial: [[1, 1, 0.13], [2, 0.1, 0.06]], gain: 0.018 * amplop(τ), pan: Math.sin(k * 1.7) * 0.35 });
      }
    },
  },
  debu: {
    kelompok: "Suasana",
    keterangan: "Kepulan debu: desah rendah dengan butir-butir halus yang menyebar.",
    tingkat: -22, lama: 1.25, maksSerentak: 3, variasiNada: 0.04,
    buat(s) {
      s.derau(0, { dur: 1.2, fc: (τ) => (1100 * Math.exp(-τ / 0.5) + 250) * s.rasio, q: 0.6, jenis: "lp", bentuk: (τ) => sin2(τ / 0.04) * Math.exp(-τ / 0.4), gain: 0.25 });
      for (let k = 0; k < 12; k++) {
        const tt = 0.04 + 0.6 * s.acak() * s.acak();
        klik(s, tt, { fc: 2000 + 1200 * s.acak(), q: 1.2, lama: 0.003, gain: 0.035 * (0.5 + s.acak()), pan: (s.acak() - 0.5) * 0.6 });
      }
    },
  },
  gemuruh: {
    kelompok: "Suasana",
    keterangan: "Gemuruh gesek rendah yang bergerinda halus; balok bergeser atau tanah bergerak (mengikuti durasi).",
    tingkat: -22, durasi: 1.5, berdurasi: true, lama: (d) => Math.max(0.3, d) + 0.15, latar: true,
    buat(s) {
      const d = Math.max(0.3, s.durasi), lama = d + 0.15;
      const amplop = (τ) => sin2(τ / Math.min(0.35, d * 0.3)) * turun(τ, d - Math.min(0.45, d * 0.3), lama);
      const gerinda = (τ) => 0.7 + 0.3 * (0.5 * Math.sin(DUA_PI * 6.3 * τ) + 0.3 * Math.sin(DUA_PI * 9.7 * τ + 1.3) + 0.2 * Math.sin(DUA_PI * 14.1 * τ + 2.1));
      s.derau(0, { dur: lama, fc: 170 * s.rasio, q: 0.7, jenis: "lp", bentuk: (τ) => amplop(τ) * gerinda(τ), gain: 0.5 });
      s.derau(0, { dur: lama, fc: 420 * s.rasio, q: 1.8, bentuk: (τ) => amplop(τ) * Math.pow(0.5 + 0.5 * Math.sin(DUA_PI * 21 * τ + 3 * Math.sin(τ * 5)), 3), gain: 0.05 });
      s.ton(0, { f: (τ) => (62 + 3 * Math.sin(DUA_PI * 0.7 * τ)) * s.rasio, dur: lama, serang: 0, lepas: 0.05, parsial: [[1, 1, 99], [2, 0.5, 99], [3, 0.2, 99]], gain: 0.06, bentuk: amplop });
    },
  },
  whoosh: {
    kelompok: "Suasana",
    keterangan: "Desir udara yang menebal lalu menghilang; perpindahan cepat atau kamera berayun (mengikuti durasi, x → x1).",
    tingkat: -21, durasi: 0.6, berdurasi: true, lama: (d) => klem(d, 0.2, 3) + 0.02,
    buat(s) {
      const d = klem(s.durasi, 0.2, 3);
      const amplop = (τ) => { const x = klem(τ / d); return x < 0.6 ? sin2(x / 0.6) : Math.pow(Math.cos((Math.PI / 2) * ((x - 0.6) / 0.4)), 2); };
      const fc = (τ) => (400 + 1500 * Math.pow(Math.sin(Math.PI * klem(τ / d)), 1.5)) * Math.sqrt(s.rasio);
      const geser = s.ev.x1 == null ? (τ) => -0.2 + (0.4 * τ) / d : 0;
      s.derau(0, { dur: d, fc, q: 0.9, bentuk: amplop, gain: 0.2, pan: geser });
      s.derau(0, { dur: d, fc: 300, q: 0.7, jenis: "lp", bentuk: amplop, gain: 0.1, pan: geser });
    },
  },
};
