/**
 * Pembuat folder video dari templat (kit/KONTRAK.md §6). Jalankan dari animasi/.
 *
 *   node kit/alat/baru.mjs <nama> [--format indikator|kosong] [--judul "Judul video"]
 *
 * Menyalin kit/alat/templat/<format>/ ke animasi/proyek/<nama>/ lalu mengganti __NAMA__ dan __JUDUL__.
 * Format bawaan: indikator. Judul bawaan dibentuk dari nama ("indikator-05" → "Indikator 05").
 * Opsi uji: --templat <folder> memakai akar templat lain (berisi subfolder <format>/).
 */
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cariHalaman, PROYEK } from "./jalur.mjs";

const ANIMASI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PAKAI = 'Pakai: node kit/alat/baru.mjs <nama> [--format indikator|kosong] [--judul "..."]';
const DICADANGKAN = new Set(["kit", "hasil", "node_modules"]);

function keluarGagal(pesan) {
  console.error(PAKAI);
  console.error(pesan);
  process.exit(1);
}

// ---------------------------------------------------------------- argumen
const o = { nama: null, format: "indikator", judul: null, templat: resolve(ANIMASI, "kit", "alat", "templat") };
const argumen = process.argv.slice(2);
for (let i = 0; i < argumen.length; i++) {
  const a = argumen[i];
  if (a === "--format" || a === "--judul" || a === "--templat") {
    const nilai = argumen[++i];
    if (nilai === undefined) keluarGagal(`${a} butuh nilai.`);
    if (a === "--format") o.format = nilai;
    else if (a === "--judul") o.judul = nilai;
    else o.templat = resolve(process.cwd(), nilai);
  } else if (a.startsWith("--")) keluarGagal(`Opsi tidak dikenal: ${a}`);
  else if (!o.nama) o.nama = a.replace(/[\\/]+$/, "");
  else keluarGagal(`Argumen berlebih: ${a}`);
}

const { nama, format } = o;
if (!nama) keluarGagal("Nama video belum diisi.");
if (!/^[a-z0-9_][a-z0-9_-]*$/.test(nama)) keluarGagal(`Nama harus huruf kecil, angka, -, atau _, misalnya indikator-05 atau _uji-dunia: ${nama}`);
if (DICADANGKAN.has(nama)) keluarGagal(`Nama ${nama} dipakai oleh folder lain.`);
const tujuan = resolve(PROYEK, nama);
if (existsSync(tujuan) || cariHalaman(nama)) keluarGagal(`Folder animasi/proyek/${nama}/ sudah ada. Pilih nama lain atau hapus folder itu sendiri.`);
const asal = resolve(o.templat, format);
if (!existsSync(asal)) {
  const ada = existsSync(o.templat) ? (await readdir(o.templat, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name) : [];
  keluarGagal(`Templat ${format} tidak ada di ${o.templat}.${ada.length ? ` Format yang ada: ${ada.join(", ")}.` : ""}`);
}
const judul = o.judul ?? nama.split(/[-_]+/).filter(Boolean).map((k) => k[0].toUpperCase() + k.slice(1)).join(" ");

// ---------------------------------------------------------------- penggantian placeholder
// Judul bisa berisi tanda kutip, jadi diloloskan sesuai jenis berkas: placeholder di templat bisa berada
// di dalam string JS ("__JUDUL__") atau di teks HTML (<title>__JUDUL__</title>). Nama sudah aman.
const lolosJs = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/`/g, "\\`").replace(/\$\{/g, "\\${").replace(/\r?\n/g, "\\n");
const lolosHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const PELOLOS = {
  ".js": lolosJs,
  ".mjs": lolosJs,
  ".html": lolosHtml,
  ".htm": lolosHtml,
  ".svg": lolosHtml,
  ".json": (s) => JSON.stringify(s).slice(1, -1),
  ".css": (s) => s,
  ".md": (s) => s,
  ".txt": (s) => s,
};

async function salin(dari, ke, dibuat) {
  await mkdir(ke, { recursive: true });
  for (const entri of await readdir(dari, { withFileTypes: true })) {
    const a = join(dari, entri.name);
    const b = join(ke, entri.name);
    if (entri.isDirectory()) await salin(a, b, dibuat);
    else {
      const lolos = PELOLOS[extname(entri.name).toLowerCase()];
      if (lolos) {
        const isi = (await readFile(a, "utf8")).replaceAll("__NAMA__", nama).replaceAll("__JUDUL__", lolos(judul));
        await writeFile(b, isi);
        const sisa = isi.match(/__[A-Z]+__/g);
        if (sisa) console.warn(`PERINGATAN: ${relative(ANIMASI, b)} masih berisi placeholder ${[...new Set(sisa)].join(", ")}`);
      } else await copyFile(a, b);
      dibuat.push(relative(tujuan, b).replaceAll("\\", "/"));
    }
  }
}

const dibuat = [];
try {
  await salin(asal, tujuan, dibuat);
} catch (e) {
  await rm(tujuan, { recursive: true, force: true });
  console.error(`GAGAL: ${e.message}`);
  process.exit(1);
}
console.log(`Dibuat animasi/proyek/${nama}/ dari templat ${format} (judul "${judul}"):`);
for (const f of dibuat) console.log(`  ${f}`);
console.log("\nLangkah berikutnya:");
console.log(`  npm run buat -- ${nama} --periksa    lembar periksa (hasil/gambar/${nama}/lembar.png) dan laporan`);
console.log(`  npm run buat -- ${nama}              render penuh dan suara (hasil/video/${nama}.mp4)`);
