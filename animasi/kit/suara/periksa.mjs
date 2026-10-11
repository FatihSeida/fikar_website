/**
 * Pemeriksaan dan ffmpeg: ukur kenyaringan dan puncak sejati (ebur128), gabungkan ke video, gambar gelombang,
 * dekode audio akhir, dan periksa sinkron awal bunyi terhadap waktu peristiwa.
 */
import { spawnSync } from "node:child_process";
import { SR, highpass, lowpass } from "./dsp.mjs";

function ffmpeg(args, opsi = {}) {
  const r = spawnSync("ffmpeg", ["-hide_banner", ...args], { maxBuffer: 1 << 30, ...opsi });
  if (r.error) throw new Error(`ffmpeg tidak bisa dijalankan: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`ffmpeg gagal (${r.status}): ${String(r.stderr).trim().split("\n").slice(-3).join(" | ")}`);
  return r;
}

export function adaFfmpeg() {
  const r = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
}

/** Kenyaringan terintegrasi (LUFS) dan puncak sejati (dBTP) menurut filter ebur128 ffmpeg. */
export function ukurEbur128(berkas) {
  const r = ffmpeg(["-nostats", "-i", berkas, "-map", "0:a:0", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], { encoding: "utf8" });
  const ringkas = r.stderr.slice(r.stderr.lastIndexOf("Summary:"));
  const ambil = (re) => { const m = ringkas.match(re); return m ? (m[1] === "-inf" ? -Infinity : Number(m[1])) : NaN; };
  return { lufs: ambil(/I:\s+(-?[\d.]+|-inf) LUFS/), puncakSejatiDb: ambil(/Peak:\s+(-?[\d.]+|-inf) dBFS/) };
}

/** Durasi aliran video (detik) menurut ffprobe, atau NaN. */
export function durasiVideo(berkas) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "format=duration", "-of", "csv=p=0", berkas], { encoding: "utf8" });
  return r.status === 0 ? Number(r.stdout.trim()) : NaN;
}

/** Video disalin apa adanya, audio AAC 192k, faststart. */
export function gabungVideo(video, wav, keluaran) {
  ffmpeg(["-y", "-loglevel", "error", "-i", video, "-i", wav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
    "-c:a", "aac", "-b:a", "192k", "-ar", String(SR), "-ac", "2", "-movflags", "+faststart", keluaran]);
}

export function gambarGelombang(wav, png) {
  ffmpeg(["-y", "-loglevel", "error", "-i", wav, "-filter_complex",
    "showwavespic=s=1680x420:split_channels=1:colors=0xC9A85C|0x2FB37A:scale=sqrt", "-frames:v", "1", png]);
}

/** Audio berkas (WAV atau MP4) didekode ffmpeg menjadi mono 48 kHz. */
export function dekodeMono(berkas) {
  const r = ffmpeg(["-loglevel", "error", "-i", berkas, "-map", "0:a:0", "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"]);
  const buf = r.stdout, x = new Float64Array(buf.length / 4);
  for (let i = 0; i < x.length; i++) x[i] = buf.readFloatLE(i * 4);
  return x;
}

// ---------------------------------------------------------------- periksa sinkron
const BINGKAI = Math.round(0.001 * SR);
function energi(x, tt) {
  const i = Math.round(tt * SR);
  let s = 0;
  for (let k = 0; k < BINGKAI; k++) { const v = x[i + k] || 0; s += v * v; }
  return s / BINGKAI;
}
/** Latar = rata-rata energi 100–40 ms sebelum t; puncak = energi terbesar 0–30 ms sesudah t (serangan bunyi itu sendiri). */
function latarDanPuncak(x, t) {
  let latar = 0, puncak = 0;
  for (let k = 0; k < 60; k++) latar += energi(x, t - 0.1 + k * 0.001) / 60;
  for (let k = 0; k < 30; k++) puncak = Math.max(puncak, energi(x, t + k * 0.001));
  return { latar, puncak };
}
/**
 * Awal bunyi di sekitar detik t: bingkai 1 ms pertama yang energinya ≥ 10 dB di atas latar
 * dan ≥ −20 dB dari puncak serangannya sendiri. Dicari dari t − 35 ms sampai t + 80 ms, jadi pergeseran
 * sampai sekitar +80 ms masih terlihat sebagai selisih, bukan lolos diam-diam.
 */
function ukurAwal(x, t) {
  const { latar, puncak } = latarDanPuncak(x, t);
  const ambang = Math.max(latar * 10, puncak * 0.01, 1e-12);
  for (let tt = t - 0.035; tt < t + 0.08; tt += 0.00025) if (energi(x, tt) > ambang && energi(x, tt + 0.001) > ambang) return tt;
  return null;
}

/**
 * Periksa sinkron pada audio mono yang sudah didekode (WAV atau audio MP4).
 * Calon: peristiwa impulsif (kuat ≥ 0,25) tanpa peristiwa lain yang mulai 120 ms sebelum atau 30 ms sesudahnya,
 * supaya awal bunyi yang diukur pasti milik peristiwa itu, dan tidak di 0,35 s terakhir (pudar akhir).
 * Dari calon yang serangannya jelas menonjol di atas latar (kontras ≥ 15 dB di pitanya), dipilih `jumlah` sampel yang tersebar merata dengan jenis beragam.
 * Lulus bila |bunyi − peristiwa| ≤ toleransi (bawaan 33 ms, satu frame pada 30 fps).
 */
export function periksaSinkron(mono, daftar, palet, { fps = 30, toleransi = 0.033, jumlah = 6 } = {}) {
  const pita = {};
  const ambilPita = (nama) => {
    if (!pita[nama]) {
      const y = Float64Array.from(mono);
      if (nama === "tinggi") { highpass(y, 1200); highpass(y, 1200); }
      if (nama === "rendah") { lowpass(y, 250); lowpass(y, 250); }
      pita[nama] = y;
    }
    return pita[nama];
  };
  const calon = [], akhir = mono.length / SR - 0.35;
  daftar.forEach((e, i) => {
    const m = palet[e.jenis];
    if (!m.impulsif || e.kuat < 0.25 || e.t > akhir) return;
    if (i > 0 && daftar[i - 1].t > e.t - 0.12) return;
    if (i + 1 < daftar.length && daftar[i + 1].t < e.t + 0.03) return;
    const nama = m.pita || "lebar";
    const { latar, puncak } = latarDanPuncak(ambilPita(nama), e.t);
    calon.push({ e, nama, kontras: 10 * Math.log10((puncak + 1e-15) / (latar + 1e-15)) });
  });
  let pakai = calon.filter((c) => c.kontras >= 15);
  if (pakai.length < jumlah) pakai = [...calon].sort((a, b) => b.kontras - a.kontras).slice(0, Math.max(jumlah, pakai.length)).sort((a, b) => a.e.t - b.e.t);
  // Titik sasaran merata di sepanjang calon; di tiap titik ambil calon terdekat yang jenisnya belum dipakai.
  const pilih = [];
  if (pakai.length <= jumlah) pilih.push(...pakai);
  else {
    const jenisDipakai = new Set();
    for (let k = 0; k < jumlah; k++) {
      const sasaran = (k * (pakai.length - 1)) / (jumlah - 1);
      let terbaik = null;
      pakai.forEach((c, i) => {
        if (pilih.includes(c)) return;
        const skor = Math.abs(i - sasaran) + (jenisDipakai.has(c.e.jenis) ? pakai.length : 0);
        if (!terbaik || skor < terbaik.skor) terbaik = { c, skor };
      });
      pilih.push(terbaik.c);
      jenisDipakai.add(terbaik.c.e.jenis);
    }
    pilih.sort((a, b) => a.e.t - b.e.t);
  }
  return pilih.map(({ e, nama, kontras }) => {
    const awal = ukurAwal(ambilPita(nama), e.t);
    const selisihMs = awal === null ? null : (awal - e.t) * 1000;
    return { jenis: e.jenis, sumber: e.sumber, t: e.t, frame: e.t * fps, pita: nama, kontrasDb: kontras, terukur: awal, selisihMs, lulus: selisihMs !== null && Math.abs(selisihMs) <= toleransi * 1000 };
  });
}
