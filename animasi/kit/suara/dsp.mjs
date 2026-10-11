/**
 * Dasar pengolahan sinyal untuk modul Suara: acak berbenih, tangga nada, filter, kenyaringan BS.1770,
 * puncak sejati, pembatas, dan penulis WAV. Node murni, tanpa dependensi.
 */
import { writeFileSync } from "node:fs";

export const SR = 48000;
export const DUA_PI = 2 * Math.PI;
/** Tidak ada komponen yang disintesis di atas batas ini (palet lembut, tidak tajam). */
export const BATAS_ATAS = 7500;

export const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
export const sin2 = (x) => Math.pow(Math.sin((Math.PI / 2) * klem(x)), 2);
/** 1 sampai detik a, lalu turun halus ke 0 di detik b. */
export const turun = (τ, a, b) => (τ < a ? 1 : 1 - halus((τ - a) / Math.max(1e-6, b - a)));
export const keDb = (x) => 20 * Math.log10(x);
export const dariDb = (d) => Math.pow(10, d / 20);

/** mulberry32: acak berbenih, hasilnya selalu sama. */
export function acak(benih) {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a 32 bit, untuk benih dari teks. */
export function hash(teks) {
  let h = 0x811c9dc5;
  for (let i = 0; i < teks.length; i++) { h ^= teks.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

// Pentatonik D mayor: derajat 0 = D4 (293,66 Hz), 5 = D5, 10 = D6. Derajat negatif turun oktaf.
const TANGGA = [0, 2, 4, 7, 9];
export const penta = (n) => 293.66 * Math.pow(2, Math.floor(n / 5) + TANGGA[((n % 5) + 5) % 5] / 12);

/** Panning daya-sama: pan −1 (kiri) … 1 (kanan) → [gain kiri, gain kanan]. */
export function panGain(pan) {
  const a = ((klem(pan, -1, 1) + 1) * Math.PI) / 4;
  return [Math.cos(a), Math.sin(a)];
}

// ---------------------------------------------------------------- filter (semuanya di tempat)
export function biquad(x, b0, b1, b2, a1, a2) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const xi = x[i];
    const y = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = xi; y2 = y1; y1 = y;
    x[i] = y;
  }
  return x;
}
export function lowpass(x, fc, q = Math.SQRT1_2) {
  const w = (DUA_PI * fc) / SR, al = Math.sin(w) / (2 * q), c = Math.cos(w), a0 = 1 + al;
  return biquad(x, (1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0, (-2 * c) / a0, (1 - al) / a0);
}
export function highpass(x, fc, q = Math.SQRT1_2) {
  const w = (DUA_PI * fc) / SR, al = Math.sin(w) / (2 * q), c = Math.cos(w), a0 = 1 + al;
  return biquad(x, (1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, (-2 * c) / a0, (1 - al) / a0);
}
/** Butterworth orde 4 (dua biquad, Q 0,541 dan 1,307). */
export const lowpass4 = (x, fc) => lowpass(lowpass(x, fc, 0.5412), fc, 1.3066);

// ---------------------------------------------------------------- kenyaringan ITU-R BS.1770-4
// Bobot K untuk 48 kHz: rak tinggi lalu tapis-lolos-atas RLB.
function bobotK(x) {
  const y = Float64Array.from(x);
  biquad(y, 1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585);
  biquad(y, 1, -2, 1, -1.99004745483398, 0.99007225036621);
  return y;
}
function jumlahKuadrat(l, r) {
  const yl = bobotK(l), yr = bobotK(r);
  const pre = new Float64Array(l.length + 1);
  for (let i = 0; i < l.length; i++) pre[i + 1] = pre[i] + yl[i] * yl[i] + yr[i] * yr[i];
  return pre;
}
const keLufs = (ms) => -0.691 + 10 * Math.log10(ms);

/** Kenyaringan terintegrasi (blok 400 ms, langkah 100 ms, gerbang −70 LUFS dan −10 LU). −Infinity bila senyap. */
export function kenyaringan(l, r) {
  const n = l.length;
  const pre = jumlahKuadrat(l, r);
  const blok = Math.min(n, Math.round(0.4 * SR)), langkah = Math.round(0.1 * SR);
  if (blok === 0) return -Infinity;
  const z = [];
  for (let s = 0; s + blok <= n; s += langkah) z.push((pre[s + blok] - pre[s]) / blok);
  const lolos1 = z.filter((v) => v > 0 && keLufs(v) > -70);
  if (!lolos1.length) return -Infinity;
  const gerbang2 = keLufs(lolos1.reduce((a, b) => a + b, 0) / lolos1.length) - 10;
  const lolos2 = lolos1.filter((v) => keLufs(v) > gerbang2);
  return keLufs(lolos2.reduce((a, b) => a + b, 0) / lolos2.length);
}

/** Kenyaringan jendela pendek terbesar (bobot K, jendela `jendela` detik, langkah 10 ms). Untuk kalibrasi bunyi. */
export function kenyaringanMaks(l, r, jendela = 0.1) {
  const n = l.length;
  const pre = jumlahKuadrat(l, r);
  const w = Math.max(1, Math.min(n, Math.round(jendela * SR))), langkah = Math.round(0.01 * SR);
  let maks = 0;
  for (let s = 0; s + w <= n; s += langkah) maks = Math.max(maks, (pre[s + w] - pre[s]) / w);
  return maks > 0 ? keLufs(maks) : -Infinity;
}

// ---------------------------------------------------------------- puncak sejati (oversampling 4×)
// Interpolasi sinc berjendela Hann, 16 ketukan per fase, untuk titik n+1/4, n+1/2, n+3/4.
const KETUK = 16, SETENGAH = 8;
const KERNEL = [1, 2, 3].map((p) => {
  const d = p / 4, h = new Float64Array(KETUK);
  let s = 0;
  for (let j = 0; j < KETUK; j++) {
    const u = j - SETENGAH + 1 - d;
    const sinc = u === 0 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u);
    h[j] = sinc * (0.5 + 0.5 * Math.cos((Math.PI * u) / SETENGAH));
    s += h[j];
  }
  for (let j = 0; j < KETUK; j++) h[j] /= s;
  return h;
});

/** Puncak sejati per sampel, kiri-kanan terkait: max |x| di sampel dan tiga titik antarsampel sesudahnya. */
export function puncakSejatiPerSampel(l, r) {
  const n = l.length, tp = new Float32Array(n);
  const [h1, h2, h3] = KERNEL;
  for (const x of [l, r]) {
    for (let i = 0; i < n; i++) {
      let m = Math.abs(x[i]);
      const j0 = i - SETENGAH + 1;
      let s1 = 0, s2 = 0, s3 = 0;
      if (j0 >= 0 && j0 + KETUK <= n) {
        for (let j = 0; j < KETUK; j++) { const v = x[j0 + j]; s1 += v * h1[j]; s2 += v * h2[j]; s3 += v * h3[j]; }
      } else {
        for (let j = 0; j < KETUK; j++) { const k = j0 + j; if (k < 0 || k >= n) continue; const v = x[k]; s1 += v * h1[j]; s2 += v * h2[j]; s3 += v * h3[j]; }
      }
      m = Math.max(m, Math.abs(s1), Math.abs(s2), Math.abs(s3));
      if (m > tp[i]) tp[i] = m;
    }
  }
  return tp;
}

// ---------------------------------------------------------------- pembatas puncak sejati
/**
 * Selubung gain pembatas untuk sinyal yang dikali `gain`, supaya puncak sejatinya ≤ `plafon`.
 * Pandang-depan 1,5 ms, pelepasan 80 ms, kiri-kanan terkait. Selubung dihaluskan dengan rata-rata
 * bergerak sepanjang pandang-depan, jadi gain sudah turun penuh tepat di puncak tanpa lompatan.
 */
export function selubungPembatas(tp, gain, plafon, { pandang = 0.0015, lepas = 0.08 } = {}) {
  const n = tp.length, la = Math.max(1, Math.round(pandang * SR));
  const perlu = new Float32Array(n);
  for (let i = 0; i < n; i++) { const p = tp[i] * gain; perlu[i] = p > plafon ? plafon / p : 1; }
  // Minimum jendela ke depan [i, i+la] (deque monoton).
  const a = new Float32Array(n), dq = new Int32Array(n);
  let kepala = 0, ekor = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (ekor > kepala && perlu[dq[ekor - 1]] >= perlu[i]) ekor--;
    dq[ekor++] = i;
    while (dq[kepala] > i + la) kepala++;
    a[i] = perlu[dq[kepala]];
  }
  // Turun seketika, naik kembali dengan pelepasan eksponensial.
  const rel = 1 - Math.exp(-1 / (lepas * SR));
  let g = 1;
  for (let i = 0; i < n; i++) { const t = a[i]; g = t < g ? t : g + (t - g) * rel; a[i] = g; }
  // Rata-rata ke belakang sepanjang la+1: di puncak p, semua nilai di [p−la, p] sudah ≤ kebutuhan p.
  const sel = new Float32Array(n);
  let jum = a[0] * (la + 1);
  for (let i = 0; i < n; i++) {
    jum += a[i] - (i - la - 1 >= 0 ? a[i - la - 1] : a[0]);
    sel[i] = jum / (la + 1);
  }
  return sel;
}

// ---------------------------------------------------------------- WAV 16-bit stereo
export function tulisWav(berkas, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  const q = (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
  for (let i = 0; i < n; i++) { buf.writeInt16LE(q(L[i]), 44 + i * 4); buf.writeInt16LE(q(R[i]), 46 + i * 4); }
  writeFileSync(berkas, buf);
}
