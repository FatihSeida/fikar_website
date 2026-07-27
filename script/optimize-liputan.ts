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

/**
 * Sebagian entri tidak punya gambar pendamping, jadi dipakaikan potret studio
 * di photo/.
 *
 * Foto sumbernya potret 2:3, sedangkan thumbnail di daftar catatan berbentuk
 * lanskap. Memakai berkas galeri apa adanya akan memotong bagian atas — yang
 * isinya justru latar putih di atas kepala.
 *
 * fokusY menyatakan posisi wajah secara vertikal (0 = paling atas, 1 = paling
 * bawah), dan potongan diambil mengelilingi titik itu. Nilainya ditetapkan
 * manual, bukan memakai strategi "attention" milik sharp: strategi itu sempat
 * memilih area batik dan tangan yang ramai pada DSC00190 sehingga kepalanya
 * terpotong habis.
 */
const POTRET_SUMBER = path.resolve("photo");
const POTRET_LEBAR = 800;
const POTRET_TINGGI = 520;

const potret = [
  { dari: "DSC00098.jpg", ke: "potret-01.webp", fokusY: 0.35 },
  { dari: "DSC00190.jpg", ke: "potret-02.webp", fokusY: 0.31 },
  { dari: "DSC00265.jpg", ke: "potret-03.webp", fokusY: 0.29 },
  { dari: "DSC00385.jpg", ke: "potret-04.webp", fokusY: 0.3 },
];

async function potongLanskap(dari: string, ke: string, fokusY: number) {
  const asal = sharp(dari);
  const { width, height } = await asal.metadata();
  if (!width || !height) {
    throw new Error(`Tidak bisa membaca dimensi ${dari}`);
  }

  // Ambil selebar mungkin, lalu tentukan tingginya dari rasio thumbnail.
  const tinggiPotongan = Math.round((width * POTRET_TINGGI) / POTRET_LEBAR);
  const atasIdeal = Math.round(fokusY * height - tinggiPotongan / 2);
  const atas = Math.max(0, Math.min(atasIdeal, height - tinggiPotongan));

  const info = await asal
    .extract({ left: 0, top: atas, width, height: tinggiPotongan })
    .resize({ width: POTRET_LEBAR, height: POTRET_TINGGI, fit: "cover" })
    .webp({ quality: 82 })
    .toFile(ke);
  console.log(
    `${path.basename(ke)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB  (fokusY ${fokusY})`,
  );
}

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

  for (const item of potret) {
    await potongLanskap(
      path.join(POTRET_SUMBER, item.dari),
      path.join(TUJUAN, item.ke),
      item.fokusY,
    );
  }
}

jalankan().catch((err) => {
  console.error(err);
  process.exit(1);
});
