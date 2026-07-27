import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

/**
 * Mengecilkan gambar pendamping liputan menjadi WebP siap web.
 *
 * Sumbernya diletakkan di photo/liputan/. Jalankan ulang bila ada liputan
 * baru: npm run optimize-liputan
 *
 * Hanya gambar milik Ghina yang dimasukkan ke sini. Grafis editorial buatan
 * redaksi tidak disalin — lihat catatan di docs/superpowers/specs.
 */

const SUMBER = path.resolve("photo/liputan");
const TUJUAN = path.resolve("client/public/liputan");

const LEBAR = 1200;

const berkas = [
  // Ghina berbicara di forum HMI, Palangka Raya.
  { dari: "lewotobi.jpg", ke: "mitigasi-wisata.webp", pangkas: false },
  // Ghina di antara bendera negara anggota OKI, Konya.
  { dari: "oic.jpg", ke: "oic-youth-capital.webp", pangkas: false },
  // Spanduk ucapan HUT RI ke-80 milik Ghina — banyak ruang putih di
  // sekelilingnya, jadi dipangkas dulu.
  { dari: "delapandekade.png", ke: "dirgahayu-80.webp", pangkas: true },
  // Dokumentasi pertemuan Ghina.
  { dari: "amaspersada.jpg", ke: "umkm-fondasi.webp", pangkas: false },
];

async function optimalkan(dari: string, ke: string, pangkas: boolean) {
  let alur = sharp(dari);
  if (pangkas) {
    alur = alur.trim();
  }
  const info = await alur
    .resize({ width: LEBAR, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(ke);
  console.log(
    `${path.basename(ke)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
  );
}

async function jalankan() {
  await mkdir(TUJUAN, { recursive: true });
  for (const item of berkas) {
    await optimalkan(
      path.join(SUMBER, item.dari),
      path.join(TUJUAN, item.ke),
      item.pangkas,
    );
  }
}

jalankan().catch((err) => {
  console.error(err);
  process.exit(1);
});
