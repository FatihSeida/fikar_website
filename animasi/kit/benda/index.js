// Pustaka benda kit. Setiap berkas mengekspor pembuat benda dan satu daftar katalog.
import { pion, rumah } from "./dasar.js";
import { DAFTAR_FIGUR } from "./figur.js";
import { DAFTAR_BANGUNAN } from "./bangunan.js";
import { DAFTAR_MEDAN } from "./medan.js";
import { DAFTAR_PERABOT } from "./perabot.js";
import { DAFTAR_DOKUMEN } from "./dokumen.js";
import { DAFTAR_IKON } from "./ikon.js";

export * from "./dasar.js";
export * from "./figur.js";
export * from "./bangunan.js";
export * from "./medan.js";
export * from "./perabot.js";
export * from "./dokumen.js";
export * from "./ikon.js";

// Semua benda untuk halaman katalog, dikelompokkan menurut kategori.
export const DAFTAR_BENDA = [
  { nama: "pion", kategori: "figur", buat: pion, contoh: {} },
  { nama: "rumah", kategori: "bangunan", buat: rumah, contoh: {} },
  ...DAFTAR_FIGUR, ...DAFTAR_BANGUNAN, ...DAFTAR_MEDAN, ...DAFTAR_PERABOT, ...DAFTAR_DOKUMEN, ...DAFTAR_IKON,
];
