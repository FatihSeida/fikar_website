import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const SUMBER = path.resolve("photo");
const TUJUAN_HERO = path.resolve("client/src/assets");
const TUJUAN_GALERI = path.resolve("client/public/galeri");

// DSC00042 dipilih sebagai potret utama (hero). Sisanya masuk galeri.
const HERO = { dari: "DSC00042.jpg", ke: "potret-utama.webp", lebar: 1600 };

const GALERI = [
  { dari: "DSC00098.jpg", ke: "galeri-01.webp" },
  { dari: "DSC00190.jpg", ke: "galeri-02.webp" },
  { dari: "DSC00265.jpg", ke: "galeri-03.webp" },
  { dari: "DSC00385.jpg", ke: "galeri-04.webp" },
];

const LEBAR_GALERI = 1200;

async function optimalkan(dari: string, ke: string, lebar: number) {
  const info = await sharp(dari)
    .resize({ width: lebar, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(ke);
  const kb = Math.round(info.size / 1024);
  console.log(`${path.basename(ke)}  ${info.width}x${info.height}  ${kb} KB`);
}

async function jalankan() {
  await mkdir(TUJUAN_HERO, { recursive: true });
  await mkdir(TUJUAN_GALERI, { recursive: true });

  await optimalkan(
    path.join(SUMBER, HERO.dari),
    path.join(TUJUAN_HERO, HERO.ke),
    HERO.lebar,
  );

  for (const item of GALERI) {
    await optimalkan(
      path.join(SUMBER, item.dari),
      path.join(TUJUAN_GALERI, item.ke),
      LEBAR_GALERI,
    );
  }
}

jalankan().catch((err) => {
  console.error(err);
  process.exit(1);
});
