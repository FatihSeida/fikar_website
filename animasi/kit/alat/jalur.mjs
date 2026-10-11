/**
 * Tata letak keluaran di animasi/hasil/ (kit/KONTRAK.md §6). Semua alat kit dan rapikan.mjs memakai berkas ini,
 * jadi hanya di sini yang tahu nama folder dan nama berkasnya.
 *
 *   hasil/video/<nama>.mp4           video final bersuara; satu-satunya video per animasi
 *   hasil/gambar/<nama>/             lembar.png, t<detik>.png, gelombang.png
 *   hasil/kerja/<nama>/              bisu.mp4, audio.wav, peristiwa.json, dan bahan antara lain
 *
 * <nama> dengan garis miring (kit/katalog) memakai "-" (kit-katalog).
 *
 * Halaman animasi ada di proyek/<nama>/ (halaman milik kit seperti kit/katalog ada di bawah animasi/); cariHalaman()
 * mencari di proyek/ lebih dulu. Semua alat memanggil video dengan nama polos (indikator-05), tanpa "proyek/".
 */
import { existsSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ANIMASI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const HASIL = resolve(ANIMASI, "hasil");
export const PROYEK = resolve(ANIMASI, "proyek");

/** Folder halaman untuk <nama>: { folder, rel } ("proyek/<nama>" atau "<nama>"), atau null bila tidak ada index.html. */
export function cariHalaman(nama) {
  const n = nama.replaceAll("\\", "/").replace(/\/+$/, "");
  for (const akar of [PROYEK, ANIMASI]) {
    const folder = resolve(akar, n);
    if (existsSync(resolve(folder, "index.html"))) return { folder, rel: relative(ANIMASI, folder).replaceAll("\\", "/") };
  }
  return null;
}

export function jalurHasil(nama) {
  const n = nama.replaceAll("\\", "/").replaceAll("/", "-");
  const gambar = resolve(HASIL, "gambar", n);
  const kerja = resolve(HASIL, "kerja", n);
  return {
    nama: n,
    gambar,
    kerja,
    video: resolve(HASIL, "video", `${n}.mp4`),
    lembar: resolve(gambar, "lembar.png"),
    jepret: (t) => resolve(gambar, `t${t}.png`),
    gelombang: resolve(gambar, "gelombang.png"),
    peristiwa: resolve(kerja, "peristiwa.json"),
    bisu: resolve(kerja, "bisu.mp4"),
    wav: resolve(kerja, "audio.wav"),
  };
}
