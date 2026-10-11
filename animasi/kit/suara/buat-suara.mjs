/**
 * Suara untuk satu video kit (KONTRAK §6).
 *
 *   node kit/suara/buat-suara.mjs <nama>          (dari folder animasi/)
 *
 * Membaca  hasil/kerja/<nama>/peristiwa.json  { durasi, fps, peristiwa: [...] }
 *          <nama>/suara.js                     opsional: export sesuaikan(peristiwa, info), export bunyi = {...}
 * Menulis  hasil/kerja/<nama>/audio.wav        48 kHz stereo 16-bit, tepat durasi × 48000 sampel
 *          hasil/video/<nama>.mp4              bila hasil/kerja/<nama>/bisu.mp4 ada: video disalin + AAC 192k
 *          hasil/gambar/<nama>/gelombang.png
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { cariHalaman, jalurHasil } from "../alat/jalur.mjs";
import { buatSuara, cetakLaporan } from "./index.mjs";

const ANIMASI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

async function utama(argv) {
  const nama = argv.find((a) => !a.startsWith("-"));
  if (!nama) throw new Error("pakai: node kit/suara/buat-suara.mjs <nama>");
  const J = jalurHasil(nama);
  const berkasPeristiwa = J.peristiwa;
  if (!existsSync(berkasPeristiwa)) throw new Error(`belum ada ${relative(ANIMASI, berkasPeristiwa)}; jalankan dulu: npm run buat -- ${nama} --periksa`);
  const data = JSON.parse(readFileSync(berkasPeristiwa, "utf8"));
  const peristiwa = Array.isArray(data) ? data : data.peristiwa;
  const durasi = Number(data.durasi);
  if (!Array.isArray(peristiwa)) throw new Error(`${relative(ANIMASI, berkasPeristiwa)} tidak berisi array "peristiwa"`);
  if (!(durasi > 0)) throw new Error(`${relative(ANIMASI, berkasPeristiwa)} tidak berisi "durasi" yang sah`);

  let sesuaikan = null, bunyi = null;
  const berkasSuara = resolve(cariHalaman(nama)?.folder ?? resolve(ANIMASI, nama), "suara.js");
  if (existsSync(berkasSuara)) {
    const mod = await import(pathToFileURL(berkasSuara).href);
    sesuaikan = typeof mod.sesuaikan === "function" ? mod.sesuaikan : null;
    bunyi = mod.bunyi && typeof mod.bunyi === "object" ? mod.bunyi : null;
  }
  const video = J.bisu;
  const adaVideo = existsSync(video);
  await Promise.all([J.kerja, J.gambar, ...(adaVideo ? [dirname(J.video)] : [])].map((d) => mkdir(d, { recursive: true })));

  const laporan = await buatSuara({
    peristiwa, durasi, fps: Number(data.fps) || 30,
    keluaranWav: J.wav,
    video: adaVideo ? video : null,
    keluaranVideo: adaVideo ? J.video : null,
    gelombang: J.gelombang,
    sesuaikan, bunyi,
  });
  if (!adaVideo) laporan.peringatan.unshift(`video bisu ${relative(ANIMASI, video)} belum ada; hanya WAV yang dibuat`);
  console.log(`Suara ${nama}`);
  if (sesuaikan || bunyi) console.log(`  suara.js    ${relative(ANIMASI, berkasSuara)}${sesuaikan ? " · sesuaikan()" : ""}${bunyi ? ` · bunyi lokal: ${Object.keys(bunyi).join(", ")}` : ""}`);
  cetakLaporan(laporan);
  return laporan;
}

utama(process.argv.slice(2)).catch((e) => {
  console.error(`buat-suara: ${e.message}`);
  process.exit(1);
});
