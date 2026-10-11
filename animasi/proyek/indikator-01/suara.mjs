/**
 * Efek suara untuk Reels Indikator 01 / 44 (21 detik), disintesis di kode. Tanpa sampel, tanpa musik.
 * Pola disalin dari ekosistem-berbasis-bukti/suara.mjs dan disesuaikan.
 *
 *   node indikator-01/suara.mjs      (dari folder animasi/, setelah hasil/indikator-01.mp4 ada)
 *
 * → hasil/indikator-01.wav             48 kHz, stereo, 16-bit, tepat 21,000 detik
 * → hasil/indikator-01-suara.mp4       video disalin apa adanya + AAC 192k
 * → hasil/indikator-01-gelombang.png   bentuk gelombang untuk diperiksa
 *
 * Waktu setiap isyarat dibaca dari isyarat.js, sumber yang sama dengan adegan.js, jadi suara tidak bisa
 * bergeser dari gambar. Semua derau memakai acak berbenih, jadi hasilnya selalu sama.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DURASI, daftarIsyarat, peristiwaPeriksa, acak } from "./isyarat.js";

const folder = dirname(fileURLToPath(import.meta.url));
const hasil = resolve(folder, "..", "..", "hasil");
const NAMA = "indikator-01";
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
  // Langkah lembut tiap figur yang keluar dari gerbang: ketuk kayu kecil, sedikit berbeda tiap figur.
  langkah: (c) => {
    const r = acak(500 + Math.round(c.t * 1000));
    const f = 820 + 140 * r();
    nada(c.t, { f, dur: 0.07, serang: 0.0015, lepas: 0.02, parsial: [[1, 1, 0.018], [2.3, 0.25, 0.008]], gain: 0.05 * (0.85 + 0.3 * r()), pan: c.pan });
    derau(c.t, { dur: 0.03, fc: 2000 + 500 * r(), q: 1.4, bentuk: (τ) => sin2(τ / 0.0012) * Math.exp(-τ / 0.005), gain: 0.05, pan: c.pan });
  },
  // Figur yang berbelok menjauh lalu hilang di tepi: "thunk" rendah yang lembut.
  thunk: (c) => {
    dentum(c.t, { f0: 150, f1: 72, lama: 0.22, gain: 0.13, pan: c.pan });
    derau(c.t, { dur: 0.18, fc: 260, q: 0.7, jenis: "lp", bentuk: (τ) => sin2(τ / 0.004) * Math.exp(-τ / 0.04), gain: 0.08, pan: c.pan });
  },
  // Nada berongga tiap gelombang; makin tipis dari 2024 ke 2026.
  rongga: (c) => {
    const f = [293.66, 246.94, 220.0][c.k];
    const parsial = [
      [[1, 1, 1.0], [2, 0.35, 0.6], [3, 0.2, 0.45]],
      [[1, 1, 0.8], [3, 0.16, 0.35]],
      [[1, 1, 0.6], [3, 0.06, 0.25]],
    ][c.k];
    nada(c.t, { f, dur: 1.6, serang: 0.03, lepas: 0.4, parsial, gain: [0.075, 0.06, 0.048][c.k], pan: c.pan });
  },
  // Gerak melambat lalu berhenti: desah rendah yang turun.
  melambat: (c) => derau(c.t, {
    dur: c.dur, fc: (τ) => 900 * Math.pow(220 / 900, klem(τ / c.dur)), q: 0.8, jenis: "lp",
    bentuk: (τ) => sin2(τ / 0.25) * turun(τ, 0.45, c.dur), gain: 0.12,
  }),
  // Denyut cermin: dengung lembut yang membesar-mengecil persis seperti denyut tepi (sin², periode 1.2 s).
  denyut: (c) => {
    const bentuk = (τ) => Math.pow(Math.sin(Math.PI * klem(τ / c.dur)), 2);
    nada(c.t, { f: 146.83, dur: c.dur, serang: 0, lepas: 0.01, parsial: [[1, 1, 99], [2, 0.3, 99], [3, 0.08, 99]], gain: 0.065, bentuk, pan: c.pan });
    nada(c.t, { f: 220.0, dur: c.dur, serang: 0, lepas: 0.01, parsial: [[1, 1, 99]], gain: 0.03, bentuk, pan: c.pan + 0.15 });
  },
  // Tabel muncul: desir kertas berbutir.
  kertas: (c) => {
    derau(c.t, { dur: 0.42, fc: (τ) => 1600 + 1400 * klem(τ / 0.3), q: 0.9, bentuk: (τ) => sin2(τ / 0.03) * turun(τ, 0.18, 0.42), gain: 0.1, pan: c.pan });
    const r = acak(812);
    for (let k = 0; k < 9; k++) {
      const tt = c.t + 0.02 + 0.32 * r();
      derau(tt, { dur: 0.02, fc: 2600 + 1400 * r(), q: 1.5, bentuk: (τ) => sin2(τ / 0.001) * Math.exp(-τ / 0.004), gain: 0.05 * (0.5 + r()), pan: c.pan + (r() - 0.5) * 0.3 });
    }
  },
  // Tiap batang tumbuh: bip lembut yang naik; makin pendek batangnya, makin pendek luncurannya.
  blip: (c) => {
    const panjang = [1.6, 1.1, 0.7][c.k];
    const f0 = 392.0;
    nada(c.t, { f: (τ) => f0 * (1 + 0.5 * (panjang / 1.6) * halus(τ / 0.3)), dur: 0.36, serang: 0.006, lepas: 0.08, parsial: [[1, 1, 0.2], [2, 0.12, 0.1]], gain: 0.06, pan: c.pan });
  },
  // Balon alasan: letupan lembut.
  pop: (c) => {
    const f = nadaPenta(5 + [0, 2, 1, 3, 4][c.k]);
    nada(c.t, { f: (τ) => f * (0.8 + 0.2 * klem(τ / 0.05)), dur: 0.22, serang: 0.003, lepas: 0.06, parsial: [[1, 1, 0.07], [2, 0.15, 0.04]], gain: 0.075, pan: c.pan });
    derau(c.t, { dur: 0.05, fc: 1400, q: 1.0, bentuk: (τ) => sin2(τ / 0.002) * Math.exp(-τ / 0.01), gain: 0.05, pan: c.pan });
  },
  // Tabel berubah emas: "klik" bersih lalu denting hangat.
  "klik-emas": (c) => {
    derau(c.t, { dur: 0.03, fc: 3200, q: 2.2, bentuk: (τ) => sin2(τ / 0.0008) * Math.exp(-τ / 0.004), gain: 0.18, pan: c.pan });
    nada(c.t, { f: 1760, dur: 0.06, serang: 0.001, lepas: 0.02, parsial: [[1, 1, 0.012]], gain: 0.08, pan: c.pan });
    const hangat = [[1, 1, 1.1], [2, 0.3, 0.6], [2.76, 0.12, 0.35], [4.07, 0.05, 0.2]];
    nada(c.t + 0.02, { f: nadaPenta(5), dur: 2.2, serang: 0.004, lepas: 0.4, parsial: hangat, gain: 0.07, pan: c.pan });
    nada(c.t + 0.09, { f: nadaPenta(8), dur: 2.0, serang: 0.004, lepas: 0.4, parsial: hangat, gain: 0.05, pan: c.pan + 0.15 });
    nada(c.t + 0.16, { f: nadaPenta(10), dur: 1.8, serang: 0.004, lepas: 0.4, parsial: [[1, 1, 0.9], [2, 0.15, 0.4]], gain: 0.035, pan: c.pan + 0.3 });
  },
  // Kartu akhir: akor lembut yang menyelesaikan (sus4 → mayor), bertahan lalu memudar sebelum 21 s.
  akor: (c) => {
    const sisa = DURASI - c.t - 0.05;
    const hangat = [[1, 1, 3], [1.0035, 0.5, 3], [2, 0.18, 1.5], [3, 0.06, 0.8]];
    const tutup = (τ) => turun(τ, sisa - 1.2, sisa);
    for (const f of [146.83, 220.0, 293.66, 440.0]) nada(c.t, { f, dur: sisa, serang: 0.12, lepas: 0.3, parsial: hangat, gain: 0.04, bentuk: tutup });
    nada(c.t, { f: 392.0, dur: 0.55, serang: 0.12, lepas: 0.15, parsial: hangat, gain: 0.04 });
    nada(c.t + 0.45, { f: 369.99, dur: sisa - 0.45, serang: 0.1, lepas: 0.3, parsial: hangat, gain: 0.04, bentuk: (τ) => tutup(τ + 0.45) });
    dentum(c.t, { f0: 100, f1: 50, lama: 0.7, gain: 0.12 });
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
  const hal = new Float64Array(N);
  let jum = 0;
  for (let i = 0; i < N; i++) { jum += out[i]; if (i > la) jum -= out[i - la - 1]; hal[i] = Math.min(out[i], jum / Math.min(i + 1, la + 1)); }
  let minG = 1, n = 0;
  for (let i = 0; i < N; i++) { l[i] *= hal[i]; r[i] *= hal[i]; minG = Math.min(minG, hal[i]); if (hal[i] < 0.999) n++; }
  return { tekananDb: -20 * Math.log10(minG), persen: (100 * n) / N };
}

// Butterworth orde 4 di 7,5 kHz (dua biquad): tidak ada yang tajam di atas ~8 kHz.
const lp8 = (x) => lowpass(lowpass(x, 7500, 0.5412), 7500, 1.3066);
const L = highpass(lp8(KIRI), 30);
const R = highpass(lp8(KANAN), 30);
const plafon = Math.pow(10, PLAFON_DB / 20);
const awal = lufs(L, R);
let puncakAwal = 0;
for (let i = 0; i < N; i++) puncakAwal = Math.max(puncakAwal, Math.abs(L[i]), Math.abs(R[i]));
let gainTotal = 1, stat = null;
for (let ulang = 0; ulang < 6; ulang++) {
  const gain = Math.pow(10, (TARGET_LUFS - lufs(L, R)) / 20);
  gainTotal *= gain;
  for (let i = 0; i < N; i++) { L[i] *= gain; R[i] *= gain; }
  stat = batasi(L, R, plafon);
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
console.log(`${berkasWav}\n  ${isyarat.length} isyarat, ${(N / SR).toFixed(3)} s, kenyaringan sebelum/sesudah: ${awal.toFixed(1)} → ${lufs(L, R).toFixed(2)} LUFS, puncak sampel ${(20 * Math.log10(puncak)).toFixed(2)} dBFS, penguatan ${(20 * Math.log10(gainTotal)).toFixed(1)} dB\n  pembatas menekan puncak terkeras ${Math.max(0, 20 * Math.log10((puncakAwal * gainTotal) / plafon)).toFixed(1)} dB (putaran terakhir: ${stat.tekananDb.toFixed(1)} dB pada ${stat.persen.toFixed(2)}% sampel)`);

// ---------------------------------------------------------------- gabungkan dengan video (video bisu tetap disimpan)
const video = resolve(hasil, `${NAMA}.mp4`);
const keluaran = resolve(hasil, `${NAMA}-suara.mp4`);
if (!existsSync(video)) throw new Error(`Video belum ada: ${video}`);
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", video, "-i", berkasWav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", keluaran], { stdio: "inherit" });
if (ff.status !== 0) throw new Error(`ffmpeg keluar dengan kode ${ff.status}`);
console.log(`${keluaran}`);

// ---------------------------------------------------------------- bentuk gelombang
const png = resolve(hasil, `${NAMA}-gelombang.png`);
const fg = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", berkasWav, "-filter_complex", "showwavespic=s=1680x420:split_channels=1:colors=0x3fbf86|0xd3ad62:scale=sqrt", "-frames:v", "1", png], { stdio: "inherit" });
if (fg.status !== 0) throw new Error("gagal membuat bentuk gelombang");
console.log(png);

// ---------------------------------------------------------------- periksa sinkron dari audio MP4 yang sudah jadi (didekode ulang)
{
  const dek = spawnSync("ffmpeg", ["-loglevel", "error", "-i", keluaran, "-map", "0:a:0", "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 64 * 1024 * 1024 });
  if (dek.status !== 0) throw new Error("gagal mendekode audio MP4");
  const buf = dek.stdout;
  const mono = new Float64Array(buf.length / 4);
  for (let i = 0; i < mono.length; i++) mono[i] = buf.readFloatLE(i * 4);
  const pita = { lebar: mono, tinggi: highpass(highpass(mono, 1200), 1200), rendah: lowpass(lowpass(mono, 200), 200) };
  const BINGKAI = 0.001 * SR; // 1 ms
  console.log("\n  peristiwa               gambar (t, frame)      bunyi mulai (MP4)   selisih");
  for (const p of peristiwaPeriksa()) {
    const x = pita[p.pita];
    const energi = (t) => { const i = Math.round(t * SR); let s = 0; for (let k = 0; k < BINGKAI; k++) s += (x[i + k] || 0) ** 2; return s / BINGKAI; };
    let latar = 0;
    for (let t = p.t - 0.1; t < p.t - 0.07; t += 0.001) latar += energi(t) / 30;
    const ambang = Math.max(latar * 10, 1e-8); // +10 dB di atas latar
    let mulai = null;
    for (let t = p.t - 0.06; t < p.t + 0.06; t += 0.001) if (energi(t) > ambang && energi(t + 0.001) > ambang) { mulai = t; break; }
    const sel = mulai === null ? "tidak ketemu" : `${((mulai - p.t) * 1000).toFixed(0).padStart(4)} ms`;
    console.log(`  ${p.nama.padEnd(22)} ${p.t.toFixed(3).padStart(7)} s (#${(p.t * 30).toFixed(1).padStart(6)})   ${mulai === null ? "      -     " : (mulai.toFixed(3) + " s")}        ${sel}   [pita ${p.pita}]`);
  }
}
