/**
 * Merapikan berkas lepas di hasil/ ke tata letak kit (kit/alat/jalur.mjs). Dipakai untuk pemindahan satu kali, dan sesudah
 * video lama (tanpa kit) dirender ulang dengan skripnya sendiri (rekam.mjs, proyek/<nama>/rekam.mjs, proyek/<nama>/suara.mjs),
 * yang masih menulis berkas lepas ke hasil/.
 *
 *   node rapikan.mjs --coba     cetak pemetaan lengkap tanpa memindahkan apa pun
 *   node rapikan.mjs            pindahkan
 *
 * Aturan nama dan video: kit/docs/alat.md ("Video lama"). Berkas tidak pernah dihapus. Target yang sudah ada hanya ditimpa
 * bila berkas sumber lebih baru. Berkas yang tidak dikenali dicetak dan dibiarkan di tempatnya.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { mkdir, readdir, rename, stat } from "node:fs/promises";
import { basename, dirname, extname, relative, resolve } from "node:path";
import { ANIMASI, HASIL, jalurHasil, PROYEK } from "./kit/alat/jalur.mjs";

// Nama animasi yang tidak punya folder berhalaman sendiri.
const EKSTRA = ["kit-katalog", "indikator-09-14"];
// Akhiran nama yang dikenal, dipakai bila tidak ada folder atau nama ekstra yang cocok.
const AKHIRAN = [/-suara$/, /-lembar$/, /-gelombang$/, /-peristiwa$/, /-determinisme$/, /-t\d+(\.\d+)?$/];
const FOLDER_HASIL = new Set(["video", "gambar", "kerja"]);
const BUKAN_ANIMASI = new Set(["kit", "hasil", "node_modules", "proyek", "dokumen"]);

const coba = process.argv.includes("--coba");
for (const a of process.argv.slice(2)) {
  if (a === "--coba") continue;
  console.error("Pakai: node rapikan.mjs [--coba]");
  console.error(`Opsi tidak dikenal: ${a}`);
  process.exit(1);
}

const rel = (p) => relative(ANIMASI, p).replaceAll("\\", "/");
const folderBerhalaman = (akar, lewati = new Set()) =>
  existsSync(akar)
    ? readdirSync(akar, { withFileTypes: true }).filter((d) => d.isDirectory() && !lewati.has(d.name) && existsSync(resolve(akar, d.name, "index.html"))).map((d) => d.name)
    : [];
// Folder animasi ada di proyek/<nama>/; folder yang masih langsung di animasi/ ikut dibaca. Yang terpanjang didahulukan.
const NAMA = [...new Set([...folderBerhalaman(PROYEK), ...folderBerhalaman(ANIMASI, BUKAN_ANIMASI), ...EKSTRA])].sort((a, b) => b.length - a.length);

/** Nama animasi dan sisa nama berkas: "indikator-01-v2-t3" → { nama: "indikator-01-v2", sisa: "t3" }. */
function kenali(stem) {
  const cocok = NAMA.find((n) => stem === n || stem.startsWith(`${n}-`));
  if (cocok) return { nama: cocok, sisa: stem.slice(cocok.length + 1) };
  for (const a of AKHIRAN) {
    const m = stem.match(a);
    if (m) return { nama: stem.slice(0, m.index), sisa: m[0].slice(1) };
  }
  return { nama: stem, sisa: "" };
}

// Video berisi audio? Tanpa ffprobe dianggap berisi.
function adaAudio(berkas) {
  const p = spawnSync("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type", "-of", "csv=p=0", berkas], { encoding: "utf8" });
  return p.error || p.status !== 0 ? true : p.stdout.trim() !== "";
}

const entri = await readdir(HASIL, { withFileTypes: true }).catch(() => []);
const lepas = entri.filter((d) => d.isFile()).map((d) => d.name).sort();
const folderLain = entri.filter((d) => d.isDirectory() && !FOLDER_HASIL.has(d.name)).map((d) => d.name);

// ---------------------------------------------------------------- pemetaan
const info = lepas.map((berkas) => {
  const ext = extname(berkas).toLowerCase();
  return { berkas, asal: resolve(HASIL, berkas), ext, ...kenali(basename(berkas, extname(berkas))) };
});
// Nama yang sudah punya versi bersuara: berkas -suara.mp4 yang masih lepas, atau hasil/video/<nama>.mp4 yang berisi audio.
const bersuara = new Set(info.filter((f) => f.ext === ".mp4" && f.sisa === "suara").map((f) => f.nama));
const punyaSuara = (nama) => bersuara.has(nama) || (existsSync(jalurHasil(nama).video) && adaAudio(jalurHasil(nama).video));

const rencana = [];
const tidakDikenal = [];
for (const f of info) {
  const J = jalurHasil(f.nama);
  const { ext, sisa } = f;
  let ke = null;
  if (ext === ".mp4") {
    if (sisa === "suara") ke = J.video;
    else if (sisa === "") ke = punyaSuara(f.nama) ? J.bisu : J.video; // tanpa versi bersuara: satu-satunya versi
    else ke = resolve(J.kerja, `${sisa}.mp4`);
  } else if (ext === ".wav") ke = resolve(J.kerja, sisa ? `${sisa}.wav` : "audio.wav");
  else if (ext === ".png") ke = resolve(J.gambar, sisa ? `${sisa}.png` : f.berkas);
  else if (ext === ".json" || ext === ".txt") ke = resolve(J.kerja, sisa ? `${sisa}${ext}` : f.berkas);
  if (ke) rencana.push({ ...f, ke });
  else tidakDikenal.push(f.berkas);
}

// ---------------------------------------------------------------- keputusan per berkas
const mtime = async (p) => (await stat(p)).mtimeMs;
const tujuan = new Map(); // dua sumber ke satu target: hanya yang lebih baru yang jalan
for (const r of rencana) {
  const sudah = tujuan.get(r.ke);
  if (!sudah) tujuan.set(r.ke, r);
  else if ((await mtime(r.asal)) > (await mtime(sudah.asal))) {
    sudah.aksi = "bentrok";
    tujuan.set(r.ke, r);
  } else r.aksi = "bentrok";
}
for (const r of rencana) {
  if (r.aksi) continue;
  if (!existsSync(r.ke)) r.aksi = "pindah";
  else r.aksi = (await mtime(r.asal)) > (await mtime(r.ke)) ? "timpa" : "lewat";
}

const KET = {
  pindah: "",
  timpa: "  (menimpa target yang lebih lama)",
  lewat: "  (DILEWATI: target sudah ada dan sumber tidak lebih baru)",
  bentrok: "  (DILEWATI: ada sumber lain yang lebih baru ke target yang sama)",
};
console.log(`${coba ? "Percobaan, tidak ada yang dipindah" : "Memindahkan"}: ${lepas.length} berkas lepas di hasil/\n`);
for (const r of rencana) console.log(`  ${r.berkas.padEnd(44)} → ${rel(r.ke)}${KET[r.aksi]}`);

// ---------------------------------------------------------------- pindah
const gagal = [];
if (!coba) {
  for (const r of rencana) {
    if (r.aksi !== "pindah" && r.aksi !== "timpa") continue;
    try {
      await mkdir(dirname(r.ke), { recursive: true });
      await rename(r.asal, r.ke);
    } catch (e) {
      gagal.push(`${r.berkas}: ${e.code ?? e.message}`);
    }
  }
}

// ---------------------------------------------------------------- ringkasan
const hitung = (aksi) => rencana.filter((r) => r.aksi === aksi).length;
const tertinggal = rencana.filter((r) => r.aksi === "lewat" || r.aksi === "bentrok").map((r) => r.berkas);
console.log(`\nRingkasan: ${hitung("pindah")} ${coba ? "akan dipindah" : "dipindah"}, ${hitung("timpa")} ${coba ? "akan menimpa" : "menimpa"} target yang lebih lama, ${tertinggal.length} dilewati, ${tidakDikenal.length} tidak dikenali, ${gagal.length} gagal.`);
const targetVideo = new Set(rencana.filter((r) => r.ke === jalurHasil(r.nama).video).map((r) => r.ke));
console.log(`Video final: ${targetVideo.size} target di hasil/video/ (satu per animasi).`);
if (tertinggal.length) console.log(`\nDibiarkan di hasil/ (target sudah ada):\n  ${tertinggal.join("\n  ")}`);
if (tidakDikenal.length) console.log(`\nTidak dikenali, dibiarkan di tempatnya:\n  ${tidakDikenal.join("\n  ")}`);
if (folderLain.length) console.log(`\nFolder lain di hasil/, dibiarkan:\n  ${folderLain.join("\n  ")}`);
if (gagal.length) {
  console.error(`\nGagal dipindah:\n  ${gagal.join("\n  ")}`);
  process.exitCode = 1;
}
