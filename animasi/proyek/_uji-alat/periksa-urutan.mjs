// Uji regresi render buat.mjs: membaca kode biner 12 bit (nomor frame) yang digambar _uji-alat di kiri atas
// setiap frame, lalu memastikan MP4 berisi frame 0, 1, 2, … N-1 tepat berurutan tanpa ada yang hilang atau ganda.
//
//   node proyek/_uji-alat/periksa-urutan.mjs [berkas.mp4] [jumlah-frame-yang-diharapkan]
//
// Bawaan: hasil/kerja/_uji-alat/bisu.mp4, 120 frame (DURASI 4 s × 30 fps).
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ANIMASI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const berkas = process.argv[2] ?? resolve(ANIMASI, "hasil", "kerja", "_uji-alat", "bisu.mp4");
const harap = Number(process.argv[3] ?? 120);
const BIT = 12, SISI = 60, X0 = 180, Y0 = 40; // sama dengan #kode di index.html
const LEBAR = BIT * SISI;

const ffmpeg = spawn("ffmpeg", ["-v", "error", "-i", berkas, "-vf", `crop=${LEBAR}:${SISI}:${X0}:${Y0}`, "-f", "rawvideo", "-pix_fmt", "gray", "-"], { stdio: ["ignore", "pipe", "inherit"] });
const potongan = [];
ffmpeg.stdout.on("data", (d) => potongan.push(d));
const kode = await new Promise((ok) => ffmpeg.on("close", ok));
if (kode !== 0) {
  console.error(`ffmpeg keluar dengan kode ${kode}`);
  process.exit(1);
}
const data = Buffer.concat(potongan);
const ukuranFrame = LEBAR * SISI;
const nomor = [];
for (let f = 0; f * ukuranFrame < data.length; f++) {
  let n = 0;
  for (let i = 0; i < BIT; i++) n = (n << 1) | (data[f * ukuranFrame + (SISI / 2) * LEBAR + i * SISI + SISI / 2] > 128 ? 1 : 0);
  nomor.push(n);
}
const salah = nomor.map((n, i) => [i, n]).filter(([i, n]) => i !== n);
console.log(`${berkas}: ${nomor.length} frame (diharapkan ${harap})`);
if (salah.length) console.log(`urutan salah di ${salah.length} frame, contoh: ${salah.slice(0, 10).map(([i, n]) => `#${i}=${n}`).join(" ")}`);
const lulus = !salah.length && nomor.length === harap;
console.log(lulus ? "LULUS: jumlah dan urutan frame tepat" : "GAGAL");
process.exit(lulus ? 0 : 1);
