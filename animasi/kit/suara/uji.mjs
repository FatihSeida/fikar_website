/**
 * Uji modul Suara, dijalankan sesudah mengubah kit/suara/:
 *
 *   node kit/suara/uji.mjs            (dari folder animasi/)
 *
 * Membuat katalog: setiap jenis berbunyi bergiliran (yang berdurasi dengan durasi, beberapa urutan nada naik),
 * ditambah langkah rapat dari beberapa figur. Hasil ditulis ke folder sementara sistem, bukan ke hasil/:
 * katalog-suara.wav untuk didengar, dan katalog-suara.mp4 (video hitam) untuk menguji penggabungan.
 * Gagal (kode keluar 1) bila kenyaringan, puncak sejati, sinkron, panjang, atau determinisme tidak memenuhi.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buatSuara, cetakLaporan, PALET, JENIS } from "./index.mjs";

const folder = mkdtempSync(join(tmpdir(), "kit-suara-"));
const peristiwa = [];
let t = 0.3;
for (const jenis of JENIS) {
  const m = PALET[jenis];
  const lama = m.berdurasi ? (jenis === "kartu-akhir" ? 0 : jenis === "denyut" ? 2.4 : 1.0) : 0;
  const ulang = m.dasar && !m.berdurasi ? 3 : 1;               // jenis bernada: urutan nada 0, 1, 2
  for (let k = 0; k < ulang; k++) peristiwa.push({ t: +(t + 0.18 * k).toFixed(3), jenis, x: 0.3 + 0.2 * k, kuat: 0.8, durasi: lama, nada: k, sumber: jenis });
  t += Math.max(1.1, lama + 0.8) + 0.18 * (ulang - 1);
  if (jenis === "langkah") {                                   // dua figur, satu langkah ganda (digabung), kerumunan (dipangkas)
    for (let k = 0; k < 6; k++) peristiwa.push({ t: +(t + 0.28 * k).toFixed(3), jenis, x: 0.35, kuat: 0.6, sumber: "a" }, { t: +(t + 0.14 + 0.28 * k).toFixed(3), jenis, x: 0.65, kuat: 0.6, sumber: "b" });
    peristiwa.push({ t: +(t + 0.04).toFixed(3), jenis, x: 0.35, sumber: "a" });
    for (let k = 0; k < 6; k++) peristiwa.push({ t: +(t + 1.8 + 0.004 * k).toFixed(3), jenis, x: 0.2 + 0.12 * k, kuat: 0.5, sumber: `kerumun-${k}` });
    t += 2.6;
  }
}
const kartu = peristiwa.find((p) => p.jenis === "kartu-akhir");
kartu.t = +t.toFixed(3);                                       // kartu akhir paling akhir, sampai video selesai
peristiwa.sort((a, b) => a.t - b.t);
const durasi = Math.ceil(t + 3);

const video = join(folder, "hitam.mp4");
const v = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", `color=c=black:s=108x192:r=30:d=${durasi}`, "-c:v", "libx264", "-pix_fmt", "yuv420p", video]);
if (v.status !== 0) throw new Error("gagal membuat video uji: " + v.stderr);

const wav = join(folder, "katalog-suara.wav");
const laporan = await buatSuara({ peristiwa, durasi, keluaranWav: wav, video, keluaranVideo: join(folder, "katalog-suara.mp4"), gelombang: join(folder, "katalog-suara-gelombang.png") });
console.log(`Uji suara: ${JENIS.length} jenis, ${peristiwa.length} peristiwa, ${durasi} s`);
cetakLaporan(laporan);

const ulang = join(folder, "ulang.wav");
await buatSuara({ peristiwa, durasi, keluaranWav: ulang, periksaSinkron: false });
const gagal = [];
if (Math.abs(laporan.ffmpeg.lufs - -18) > 0.2) gagal.push(`LUFS ${laporan.ffmpeg.lufs}`);
if (!(laporan.ffmpeg.puncakSejatiDb <= -1)) gagal.push(`puncak sejati ${laporan.ffmpeg.puncakSejatiDb} dBTP`);
if (statSync(wav).size !== 44 + durasi * 48000 * 4) gagal.push("panjang WAV");
if (laporan.sinkron.length < 6 || laporan.sinkron.some((s) => !s.lulus)) gagal.push("sinkron");
if (Object.keys(laporan.perJenis).length !== JENIS.length) gagal.push(`hanya ${Object.keys(laporan.perJenis).length} jenis berbunyi`);
if (!readFileSync(wav).equals(readFileSync(ulang))) gagal.push("tidak deterministik");
rmSync(ulang);
console.log(gagal.length ? `GAGAL: ${gagal.join(", ")}` : `LULUS. Dengarkan: ${wav}`);
process.exit(gagal.length ? 1 : 0);
