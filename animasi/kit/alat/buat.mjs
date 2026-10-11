/**
 * Alur periksa, render, dan suara untuk video kit (kit/KONTRAK.md §6). Jalankan dari animasi/.
 *
 *   node kit/alat/buat.mjs <nama> --periksa     lembar periksa, laporan zona dan warna, peristiwa.json
 *   node kit/alat/buat.mjs <nama>               periksa, render penuh, suara, laporan akhir
 *   node kit/alat/buat.mjs <nama> --pratinjau   server pratinjau
 *
 * Opsi:
 *   --titik 1,2.5,8   detik untuk lembar periksa (bawaan: KIT.titikPeriksa, atau 8 titik merata)
 *   --jepret 3,5.5    tangkapan resolusi penuh hasil/gambar/<nama>/t3.png, t5.5.png (tanpa --periksa: hanya itu, cepat)
 *   --paralel N       jumlah halaman yang merender bersamaan (bawaan 3)
 *
 * Keluaran (tata letak di kit/alat/jalur.mjs): hasil/video/<nama>.mp4 (final, bersuara), hasil/gambar/<nama>/ (lembar, jepret,
 * gelombang), hasil/kerja/<nama>/ (bisu.mp4, audio.wav, peristiwa.json).
 * Rincian: kit/docs/alat.md.
 */
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { mkdir, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { cariHalaman, jalurHasil } from "./jalur.mjs";
import { bukaPeramban, pastikanFfmpeg } from "./peramban.mjs";
import { createServer } from "vite";
import sharp from "sharp";

const ANIMASI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const BATAS_MUAT = 90_000; // ms untuk goto dan window.siap; 30 detik pernah gagal saat mesin sibuk.
const PARALEL_BAWAAN = 3; // diukur di mesin ini: 3 lebih cepat daripada 2 (lihat docs/alat.md).
const JUMLAH_TITIK_BAWAAN = 8;
const SKALA_LEMBAR = 0.5;
const UKURAN_BAWAAN = { lebar: 1080, tinggi: 1920 };
// Pengaturan enkode sama dengan rekam.mjs.
const ENKODE = ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];

// Warna di luar palet seri. Disetel pada 121 tangkapan layar video seri: emas hsl(42,52%,58%) dan
// hsl(42,80%,52%) dengan bloom turun sampai hue ±34°, hijau tidak pernah di atas ±190°. Hanya piksel "inti"
// (8 tetangganya berkategori sama) yang dihitung, supaya tepi antialias teks di atas emas tidak ikut.
// Halaman bisa menggantinya lewat window.KIT.paletTerlarang (bentuk sama; medan yang kosong memakai bawaan).
const PALET_BAWAAN = [
  { nama: "merah", hue: [345, 12], sMin: 0.45, lMin: 0.18, lMax: 0.88, cMin: 0.2 },
  { nama: "oranye", hue: [12, 33], sMin: 0.5, lMin: 0.2, lMax: 0.85, cMin: 0.2 },
  { nama: "biru", hue: [190, 255], sMin: 0.35, lMin: 0.18, lMax: 0.88, cMin: 0.15 },
];
const SYARAT_PALET_BAWAAN = { sMin: 0.45, lMin: 0.18, lMax: 0.88, cMin: 0.2 };
const AMBANG_WARNA = 0.01; // persen piksel inti per kategori; di atas ini titik dinyatakan melanggar.
const AMBANG_CATAT = 0.001; // persen; di bawah ini tidak dicetak sama sekali.

const PAKAI = "Pakai: node kit/alat/buat.mjs <nama> [--periksa] [--pratinjau] [--titik 1,2,3] [--jepret 3,5.5] [--paralel N] [--gpu]";

// ---------------------------------------------------------------- argumen
function keluarGagal(pesan) {
  console.error(PAKAI);
  console.error(pesan);
  process.exit(1);
}

function bacaArgumen(argv) {
  const o = { nama: null, periksa: false, pratinjau: false, titik: null, jepret: null, paralel: PARALEL_BAWAAN, gpu: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--periksa") o.periksa = true;
    else if (a === "--pratinjau") o.pratinjau = true;
    else if (a === "--gpu") o.gpu = true;
    else if (a === "--titik" || a === "--jepret" || a === "--paralel") {
      const nilai = argv[++i];
      if (nilai === undefined) keluarGagal(`${a} butuh nilai.`);
      if (a === "--titik" || a === "--jepret") {
        const daftar = nilai.split(",").filter((s) => s.trim() !== "").map(Number);
        if (!daftar.length || daftar.some((t) => !Number.isFinite(t))) keluarGagal(`${a} tidak valid: ${nilai}`);
        o[a.slice(2)] = daftar;
      } else {
        o.paralel = Number(nilai);
        if (!Number.isInteger(o.paralel) || o.paralel < 1 || o.paralel > 16) keluarGagal(`--paralel harus bilangan bulat 1–16: ${nilai}`);
      }
    } else if (a.startsWith("--")) keluarGagal(`Opsi tidak dikenal: ${a}`);
    else if (!o.nama) o.nama = a.replace(/[\\/]+$/, "").replaceAll("\\", "/");
    else keluarGagal(`Argumen berlebih: ${a}`);
  }
  if (!o.nama) keluarGagal("Nama video belum diisi.");
  if (!cariHalaman(o.nama)) keluarGagal(`Tidak ada proyek/${o.nama}/index.html di ${ANIMASI}`);
  return o;
}

const opsi = bacaArgumen(process.argv.slice(2));
const { nama } = opsi;
if (!opsi.periksa && !opsi.jepret && !opsi.pratinjau) pastikanFfmpeg(); // hanya render penuh yang memakai ffmpeg dan ffprobe
// Nama di hasil/: halaman di folder bertingkat (kit/katalog) menjadi kit-katalog, tanpa garis miring.
const J = jalurHasil(nama);
const { rel: relHalaman } = cariHalaman(nama); // "proyek/<nama>", atau "kit/katalog" untuk halaman milik kit
const namaBerkas = J.nama;
const rel = (p) => relative(ANIMASI, p).replaceAll("\\", "/");
const detik = (ms) => (ms / 1000).toFixed(1);

// ---------------------------------------------------------------- sumber daya yang dibersihkan di akhir
const sumber = { server: null, browser: [], anak: new Set(), sementara: null };
let sudahBersih = false;
async function bersihkan() {
  if (sudahBersih) return;
  sudahBersih = true;
  // Tunggu proses anak benar-benar keluar: di Windows, ffmpeg yang masih memegang segmen membuat folder sementara gagal dihapus.
  const hidup = [...sumber.anak].filter((p) => p.exitCode === null && p.signalCode === null);
  for (const p of hidup) p.kill();
  await Promise.all(hidup.map((p) => Promise.race([once(p, "exit"), new Promise((ok) => setTimeout(ok, 5000))])));
  await Promise.all(sumber.browser.map((b) => b.close().catch(() => {})));
  await sumber.server?.close().catch(() => {});
  if (sumber.sementara) {
    await rm(sumber.sementara, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }).catch((e) => console.error(`Folder sementara tidak bisa dihapus: ${rel(sumber.sementara)} (${e.code ?? e.message})`));
  }
}
// Bila keluaran dipotong (misalnya `| head` atau `Select-Object -First`), tulisan ke pipa yang tertutup
// menimbulkan EPIPE yang mematikan proses sebelum pembersihan. Abaikan saja; pekerjaan tetap selesai dan bersih.
for (const aliran of [process.stdout, process.stderr]) aliran.on("error", (e) => { if (e.code !== "EPIPE") throw e; });
process.once("SIGINT", async () => {
  console.error("\nDibatalkan.");
  await bersihkan();
  process.exit(130);
});

let alamat = null; // diisi setelah server Vite berjalan (bagian paling bawah)

// ---------------------------------------------------------------- alur utama
async function jalankan(mulai) {
  const galat = [];

  console.log(`\n${nama}: memuat ${alamat}`);
  const halaman = await bukaHalaman(await bukaBrowser(), UKURAN_BAWAAN, galat);
  let info = await bacaInfo(halaman);
  if (info.ukuran.lebar !== UKURAN_BAWAAN.lebar || info.ukuran.tinggi !== UKURAN_BAWAAN.tinggi) {
    await halaman.setViewportSize({ width: info.ukuran.lebar, height: info.ukuran.tinggi });
    await halaman.reload({ timeout: BATAS_MUAT });
    await tungguSiap(halaman);
    info = await bacaInfo(halaman);
  }
  kunci(halaman);
  cekGalat(galat);
  const { lebar, tinggi } = info.ukuran;
  console.log(`  ${info.durasi} s · ${info.fps} fps · ${lebar}×${tinggi} · ${info.adaKit ? `kit ${info.versi ?? "?"}` : "tanpa window.KIT"}`);

  // --jepret tanpa --periksa: hanya tangkapan penuh, tanpa lembar dan render.
  if (opsi.periksa || !opsi.jepret) {
    const periksa = await tahapPeriksa(halaman, info);
    cekGalat(galat);
    cetakRingkasan(periksa);
  }
  if (opsi.jepret) {
    await tahapJepret(halaman, info);
    cekGalat(galat);
    if (!opsi.periksa) laporPeringatan();
    return;
  }
  if (opsi.periksa) return;

  const render = await tahapRender(halaman, info, galat);
  const suara = await tahapSuara(info);
  await laporanAkhir(info, render, suara, mulai);
  if (suara.gagal) throw new Error(`langkah suara gagal (${suara.gagal})`);
}

// ---------------------------------------------------------------- halaman
const dikunci = new WeakSet();
const peringatanKit = new Set(); // teks console.warn berawalan "[kit]" dari halaman (tanpa duplikat antar halaman)

// Setiap halaman render punya browser sendiri: halaman-halaman dalam satu browser berbagi proses GPU dan
// proses browser, sehingga tangkapan layarnya antre (diukur: 1→3 halaman hanya 17→22 frame/s, sedangkan
// 1→3 browser 17→32 frame/s).
// --gpu memakai kartu grafis diskrit: render hampir 2x lebih cepat, piksel berbeda sangat sedikit dari bawaan.
// Peramban dipilih di peramban.mjs: Edge, lalu Chromium Playwright, lalu Chromium sistem (KIT_PERAMBAN memaksa satu).
async function bukaBrowser() {
  const browser = await bukaPeramban({ gpu: opsi.gpu });
  sumber.browser.push(browser);
  return browser;
}

async function bukaHalaman(browser, ukuran, galat) {
  const page = await browser.newPage({ viewport: { width: ukuran.lebar, height: ukuran.tinggi }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => galat.push(`pageerror: ${e.message}`));
  // Sumber yang gagal dimuat dilaporkan lewat alamatnya; permintaan favicon bawaan browser diabaikan.
  page.on("console", (pesan) => {
    if (pesan.type() === "error" && !pesan.text().startsWith("Failed to load resource")) galat.push(`console: ${pesan.text()}`);
    // Peringatan kit (console.warn "[kit] …", mis. teks lebih dari 3 baris) tidak menggagalkan proses; dicetak di ringkasan.
    else if (pesan.type() === "warning" && pesan.text().startsWith("[kit]")) peringatanKit.add(pesan.text());
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().endsWith("/favicon.ico")) galat.push(`${res.status()} ${res.url()}`);
  });
  page.on("crash", () => galat.push("halaman crash"));
  page.on("framenavigated", (f) => {
    if (dikunci.has(page) && f === page.mainFrame()) galat.push("halaman dimuat ulang di tengah proses (biasanya Vite menemukan dependensi baru); jalankan ulang");
  });
  await page.goto(`${alamat}?rekam=1`, { timeout: BATAS_MUAT });
  await tungguSiap(page);
  return page;
}

async function tungguSiap(page) {
  await page.waitForFunction(() => window.siap !== undefined, null, { timeout: BATAS_MUAT });
  let pewaktu;
  const habis = new Promise((_, gagal) => {
    pewaktu = setTimeout(() => gagal(new Error(`window.siap belum selesai setelah ${BATAS_MUAT / 1000} detik`)), BATAS_MUAT);
  });
  try {
    await Promise.race([page.evaluate(() => Promise.resolve(window.siap).then(() => true)), habis]);
  } finally {
    clearTimeout(pewaktu);
  }
}

const kunci = (page) => dikunci.add(page);

function cekGalat(galat) {
  if (galat.length) throw new Error(`galat di halaman:\n  ${[...new Set(galat)].join("\n  ")}`);
}

async function bacaInfo(page) {
  const info = await page.evaluate(() => {
    const K = window.KIT && typeof window.KIT === "object" ? window.KIT : null;
    return {
      durasi: window.DURASI,
      fps: window.FPS ?? 30,
      ukuran: window.UKURAN ?? { lebar: 1080, tinggi: 1920 },
      adaKit: !!K,
      versi: K?.versi ?? null,
      titik: Array.isArray(K?.titikPeriksa) ? K.titikPeriksa : null,
      adaZona: typeof K?.periksaZona === "function",
      adaPeristiwa: typeof K?.peristiwa === "function",
      palet: Array.isArray(K?.paletTerlarang) ? K.paletTerlarang : null,
      adaTampilkan: typeof window.tampilkan === "function",
    };
  });
  if (!(info.durasi > 0)) throw new Error(`window.DURASI tidak valid: ${info.durasi}`);
  if (!(info.fps > 0)) throw new Error(`window.FPS tidak valid: ${info.fps}`);
  if (!info.adaTampilkan) throw new Error("window.tampilkan bukan fungsi");
  const { lebar, tinggi } = info.ukuran;
  if (!Number.isInteger(lebar) || !Number.isInteger(tinggi) || lebar <= 0 || tinggi <= 0) throw new Error(`window.UKURAN tidak valid: ${JSON.stringify(info.ukuran)}`);
  if (lebar % 2 || tinggi % 2) throw new Error(`window.UKURAN harus genap untuk yuv420p: ${lebar}×${tinggi}`);
  return info;
}

// Page.captureScreenshot dengan optimizeForSpeed: pikselnya identik dengan page.screenshot(), tetapi
// sekitar dua kali lebih cepat (PNG dikompres lebih ringan).
async function pemotret(page) {
  const cdp = await page.context().newCDPSession(page);
  return async () => Buffer.from((await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true })).data, "base64");
}

// ---------------------------------------------------------------- tahap periksa
function tentukanTitik(info) {
  let asal, daftar;
  if (opsi.titik) [asal, daftar] = ["--titik", opsi.titik];
  else if (info.titik?.length) [asal, daftar] = ["KIT.titikPeriksa", info.titik.map(Number)];
  else {
    asal = `${JUMLAH_TITIK_BAWAAN} titik merata`;
    const akhir = (Math.round(info.durasi * info.fps) - 1) / info.fps;
    daftar = Array.from({ length: JUMLAH_TITIK_BAWAAN }, (_, i) => Math.min(akhir, Math.round(((i + 0.5) * info.durasi * info.fps) / JUMLAH_TITIK_BAWAAN) / info.fps));
  }
  const sah = daftar.filter((t) => Number.isFinite(t) && t >= 0 && t <= info.durasi);
  if (sah.length < daftar.length) console.warn(`  PERINGATAN: titik di luar 0–${info.durasi} s diabaikan: ${daftar.filter((t) => !sah.includes(t)).join(", ")}`);
  if (!sah.length) throw new Error("tidak ada titik periksa yang sah");
  return { asal, daftar: sah };
}

async function tahapPeriksa(page, info) {
  const potret = await pemotret(page);
  const titik = tentukanTitik(info);
  const palet = aturPalet(info.palet);
  const hasil = [];
  for (const t of titik.daftar) {
    await page.evaluate((d) => window.tampilkan(d), t);
    const png = await potret();
    let zona = null;
    if (info.adaZona) {
      zona = await page.evaluate((d) => window.KIT.periksaZona(d), t);
      if (!Array.isArray(zona)) throw new Error(`KIT.periksaZona(${t}) tidak mengembalikan array`);
    }
    hasil.push({ t, frame: Math.round(t * info.fps), png, zona, warna: await analisisWarna(png, palet) });
  }

  const peristiwa = info.adaPeristiwa ? await tulisPeristiwa(page, info) : null;
  const lembar = J.lembar;
  await mkdir(J.gambar, { recursive: true });
  await buatLembar(lembar, hasil, info, titik.asal, peristiwa);
  laporZona(hasil, info);
  laporWarna(hasil, palet);
  return { hasil, lembar, titik, palet, peristiwa, info };
}

// ---------------------------------------------------------------- jepret
// Tangkapan resolusi penuh di detik --jepret, untuk melihat detail kecil yang hilang di lembar (skala 0.5).
// Nama berkas memakai angka seperti ditulis sesudah diurai: 3 → t3.png, 5.5 → t5.5.png (sama dengan rekam.mjs --cuplik).
async function tahapJepret(page, info) {
  const potret = await pemotret(page);
  const sah = opsi.jepret.filter((t) => t >= 0 && t <= info.durasi);
  if (sah.length < opsi.jepret.length) console.warn(`  PERINGATAN: --jepret di luar 0–${info.durasi} s diabaikan: ${opsi.jepret.filter((t) => !sah.includes(t)).join(", ")}`);
  console.log(`
Jepret ${sah.length} tangkapan ${info.ukuran.lebar}×${info.ukuran.tinggi}`);
  await mkdir(J.gambar, { recursive: true });
  for (const t of sah) {
    await page.evaluate((d) => window.tampilkan(d), t);
    const berkas = J.jepret(t);
    await writeFile(berkas, await potret());
    console.log(`  ${rel(berkas)}`);
  }
}

// ---------------------------------------------------------------- analisis warna
function aturPalet(dariHalaman) {
  if (!dariHalaman) return PALET_BAWAAN;
  return dariHalaman.map((a, i) => {
    const hue = a?.hue;
    if (!Array.isArray(hue) || hue.length !== 2 || !hue.every(Number.isFinite)) throw new Error(`KIT.paletTerlarang[${i}].hue harus [dari, sampai] dalam derajat`);
    return { ...SYARAT_PALET_BAWAAN, ...a, nama: a.nama ?? `warna-${i + 1}`, hue: [((hue[0] % 360) + 360) % 360, ((hue[1] % 360) + 360) % 360] };
  });
}

async function analisisWarna(png, palet) {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: k } = info;
  const kat = new Uint8Array(W * H);
  const cMin = Math.min(...palet.map((a) => a.cMin));
  for (let p = 0, i = 0; p < W * H; p++, i += k) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = r > g ? (r > b ? r : b) : g > b ? g : b;
    const mn = r < g ? (r < b ? r : b) : g < b ? g : b;
    const d = mx - mn;
    const c = d / 255;
    if (c < cMin) continue;
    const l = (mx + mn) / 510;
    const s = c / (1 - Math.abs(2 * l - 1));
    let h = mx === r ? ((g - b) / d) * 60 : mx === g ? ((b - r) / d + 2) * 60 : ((r - g) / d + 4) * 60;
    if (h < 0) h += 360;
    for (let j = 0; j < palet.length; j++) {
      const a = palet[j];
      const [dari, sampai] = a.hue;
      const dalam = dari <= sampai ? h >= dari && h < sampai : h >= dari || h < sampai;
      if (dalam && c >= a.cMin && s >= a.sMin && l >= a.lMin && l <= a.lMax) {
        kat[p] = j + 1;
        break;
      }
    }
  }
  // Piksel inti: dia dan 8 tetangganya berkategori sama.
  const n = new Array(palet.length).fill(0);
  const kolom = palet.map(() => new Uint32Array(W));
  const baris = palet.map(() => new Uint32Array(H));
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      const q = kat[p];
      if (!q) continue;
      if (kat[p - W - 1] !== q || kat[p - W] !== q || kat[p - W + 1] !== q || kat[p - 1] !== q || kat[p + 1] !== q || kat[p + W - 1] !== q || kat[p + W] !== q || kat[p + W + 1] !== q) continue;
      n[q - 1]++;
      kolom[q - 1][x]++;
      baris[q - 1][y]++;
    }
  }
  const kuantil = (hist, total, q) => {
    let jumlah = 0;
    for (let i = 0; i < hist.length; i++) if ((jumlah += hist[i]) >= q * total) return i;
    return hist.length - 1;
  };
  return palet
    .map((a, j) => {
      const persen = (100 * n[j]) / (W * H);
      if (!n[j]) return { nama: a.nama, n: 0, persen };
      const kotak = { x0: kuantil(kolom[j], n[j], 0.01), x1: kuantil(kolom[j], n[j], 0.99), y0: kuantil(baris[j], n[j], 0.01), y1: kuantil(baris[j], n[j], 0.99) };
      const sepertiga = (v, ukuran, kata) => kata[Math.min(2, Math.floor((3 * v) / ukuran))];
      const v = sepertiga((kotak.y0 + kotak.y1) / 2, H, ["atas", "tengah", "bawah"]);
      const h = sepertiga((kotak.x0 + kotak.x1) / 2, W, ["kiri", "tengah", "kanan"]);
      return { nama: a.nama, n: n[j], persen, kotak, letak: v === h ? "tengah" : `${v} ${h}` };
    })
    .filter((w) => w.persen >= AMBANG_CATAT);
}

const melanggarWarna = (titik) => titik.warna.filter((w) => w.persen >= AMBANG_WARNA);

// ---------------------------------------------------------------- peristiwa
async function tulisPeristiwa(page, info) {
  let daftar = await page.evaluate(() => window.KIT.peristiwa());
  if (!Array.isArray(daftar)) throw new Error("KIT.peristiwa() tidak mengembalikan array");
  if (daftar.some((p, i) => i > 0 && p.t < daftar[i - 1].t)) {
    console.warn("  PERINGATAN: KIT.peristiwa() tidak urut menurut t; diurutkan sebelum ditulis.");
    daftar = [...daftar].sort((a, b) => a.t - b.t);
  }
  const luar = daftar.filter((p) => !(p.t >= 0 && p.t < info.durasi));
  if (luar.length) console.warn(`  PERINGATAN: ${luar.length} peristiwa di luar 0 ≤ t < ${info.durasi} s; modul Suara akan mengabaikannya.`);
  // Satu peristiwa per baris supaya berkas mudah dibaca dan dibandingkan.
  const isi = daftar.length ? `[\n${daftar.map((p) => `    ${JSON.stringify(p)}`).join(",\n")}\n  ]` : "[]";
  const berkas = J.peristiwa;
  await mkdir(J.kerja, { recursive: true });
  await writeFile(berkas, `{\n  "durasi": ${JSON.stringify(info.durasi)},\n  "fps": ${JSON.stringify(info.fps)},\n  "peristiwa": ${isi}\n}\n`);
  return { berkas, jumlah: daftar.length };
}

// ---------------------------------------------------------------- lembar periksa
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function buatLembar(berkas, hasil, info, asalTitik, peristiwa) {
  const { lebar, tinggi } = info.ukuran;
  const lt = Math.round(lebar * SKALA_LEMBAR);
  const tt = Math.round(tinggi * SKALA_LEMBAR);
  const s = lt / lebar;
  const TEPI = 28, CELAH = 26, LABEL = 46, KEPALA = 92;
  const n = hasil.length;
  // Kolom dipilih supaya lembar sedikit melebar (rasio ±1,3), enak dibaca utuh dalam satu gambar.
  let kolom = Math.max(1, Math.min(n, Math.ceil(Math.sqrt((1.3 * n * (tt + LABEL)) / lt))));
  const baris = Math.ceil(n / kolom);
  kolom = Math.ceil(n / baris);
  const L = TEPI * 2 + kolom * lt + (kolom - 1) * CELAH;
  const T = TEPI * 2 + KEPALA + baris * (LABEL + tt) + (baris - 1) * CELAH;

  const jumlahZona = hasil.reduce((a, h) => a + (h.zona?.length ?? 0), 0);
  const titikWarna = hasil.filter((h) => melanggarWarna(h).length).length;
  const ringkas = [
    hasil[0].zona === null ? "zona: tidak diperiksa" : `zona: ${jumlahZona} pelanggaran`,
    `warna: ${titikWarna ? `LANGGAR di ${titikWarna} titik` : "bersih"}`,
    `peristiwa: ${peristiwa ? peristiwa.jumlah : "tidak ada"}`,
  ].join("   ·   ");
  const judul = `${nama}  ·  ${info.durasi} s  ·  ${info.fps} fps  ·  ${lebar}×${tinggi}  ·  ${n} titik (${asalTitik})${info.versi ? `  ·  kit ${info.versi}` : ""}`;
  // Huruf monospace ±0,56 em per karakter; kepala dikecilkan bila lembar sempit (misalnya 2 kolom).
  const muat = (teks, maks) => Math.max(16, Math.min(maks, Math.floor((L - 2 * TEPI) / (teks.length * 0.56))));
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${T}">`,
    `<style>text{font-family:Consolas,'DejaVu Sans Mono',monospace;font-weight:700}</style>`,
    `<text x="${TEPI}" y="${TEPI + 30}" font-size="${muat(judul, 32)}" fill="#f2f2f2">${esc(judul)}</text>`,
    `<text x="${TEPI}" y="${TEPI + 72}" font-size="${muat(ringkas, 26)}" fill="#a9b0b8">${esc(ringkas)}</text>`,
  ];
  const komposisi = [];
  for (let i = 0; i < n; i++) {
    const h = hasil[i];
    const x = TEPI + (i % kolom) * (lt + CELAH);
    const y = TEPI + KEPALA + Math.floor(i / kolom) * (LABEL + tt + CELAH) + LABEL;
    const { data, info: inf } = await sharp(h.png).resize(lt, tt, { kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    komposisi.push({ input: data, raw: { width: inf.width, height: inf.height, channels: inf.channels }, left: x, top: y });

    svg.push(`<text x="${x}" y="${y - 13}" font-size="30" fill="#f2f2f2">t ${h.t.toFixed(2)} s  f ${h.frame}</text>`);
    const tanda = [];
    if (h.zona?.length) tanda.push([`ZONA ${h.zona.length}`, "#ff5fd2"]);
    for (const w of melanggarWarna(h)) tanda.push([`${w.nama} ${w.persen.toFixed(2)}%`, "#5fe8ff"]);
    if (tanda.length) svg.push(`<text x="${x + lt}" y="${y - 13}" font-size="24" text-anchor="end">${tanda.map(([teks, warna]) => `<tspan fill="${warna}">${esc(teks)} </tspan>`).join("")}</text>`);
    svg.push(`<rect x="${x - 1.5}" y="${y - 1.5}" width="${lt + 3}" height="${tt + 3}" fill="none" stroke="#c9ced4" stroke-width="3"/>`);

    // Kotak bantu, dijepit ke dalam ubin supaya tidak menimpa ubin tetangga.
    const jepit = (k) => {
      const x0 = Math.max(0, Math.min(lt, k.x0 * s)), x1 = Math.max(0, Math.min(lt, k.x1 * s));
      const y0 = Math.max(0, Math.min(tt, k.y0 * s)), y1 = Math.max(0, Math.min(tt, k.y1 * s));
      return { x: x + x0, y: y + y0, w: Math.max(2, x1 - x0), h: Math.max(2, y1 - y0) };
    };
    if (h.zona?.length) {
      const z = jepit(h.zona[0].zona ?? { x0: 0, y0: 0, x1: lebar, y1: tinggi });
      svg.push(`<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="10 8"/>`);
      for (const v of h.zona) {
        const b = jepit(v.kotak);
        svg.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="#ff5fd2" stroke-width="3"/>`);
        const kanan = b.x + b.w / 2 > x + lt / 2;
        svg.push(`<text x="${kanan ? b.x + b.w - 6 : b.x + 6}" y="${Math.max(y + 24, b.y - 6)}" font-size="20" fill="#ff5fd2" text-anchor="${kanan ? "end" : "start"}">${esc(v.sumber ?? "?")}</text>`);
      }
    }
    for (const w of melanggarWarna(h)) {
      const b = jepit({ x0: w.kotak.x0 - 8, y0: w.kotak.y0 - 8, x1: w.kotak.x1 + 8, y1: w.kotak.y1 + 8 });
      svg.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="#5fe8ff" stroke-width="3" stroke-dasharray="8 6"/>`);
    }
  }
  svg.push("</svg>");
  komposisi.push({ input: Buffer.from(svg.join("\n")), left: 0, top: 0 });
  await sharp({ create: { width: L, height: T, channels: 3, background: "#1c1d20" } })
    .composite(komposisi)
    .png({ compressionLevel: 6 })
    .toFile(berkas);
}

// ---------------------------------------------------------------- laporan periksa
function laporZona(hasil, info) {
  if (!info.adaZona) {
    console.log("\nZona: dilewati (halaman tanpa window.KIT.periksaZona).");
    return;
  }
  const baris = hasil.flatMap((h) => h.zona.map((v) => ({ t: h.t, ...v })));
  const titik = hasil.filter((h) => h.zona.length).length;
  console.log(`\nZona: ${baris.length} pelanggaran di ${titik} dari ${hasil.length} titik`);
  if (!baris.length) return;
  const z = baris[0].zona;
  if (z) console.log(`  zona x ${z.x0}–${z.x1}, y ${z.y0}–${z.y1}`);
  const MAKS = 30;
  console.log(`  ${"t".padEnd(8)}${"sumber".padEnd(18)}${"keluar".padEnd(22)}kotak (px)`);
  for (const b of baris.slice(0, MAKS)) {
    const k = b.kotak ?? {};
    console.log(`  ${b.t.toFixed(2).padEnd(8)}${String(b.sumber ?? "?").slice(0, 17).padEnd(18)}${(b.keluar ?? []).join(",").padEnd(22)}x ${k.x0}–${k.x1}, y ${k.y0}–${k.y1}`);
  }
  if (baris.length > MAKS) console.log(`  … ${baris.length - MAKS} baris lagi`);
}

function laporWarna(hasil, palet) {
  const aturan = palet.map((a) => `${a.nama} ${a.hue[0]}–${a.hue[1]}°`).join(", ");
  console.log(`\nWarna terlarang (${aturan}; ambang ${AMBANG_WARNA}% piksel)`);
  let ada = false;
  for (const h of hasil) {
    for (const w of h.warna) {
      ada = true;
      const k = w.kotak;
      const status = w.persen >= AMBANG_WARNA ? "LANGGAR" : "sedikit";
      console.log(`  t ${h.t.toFixed(2).padEnd(7)} ${status.padEnd(8)} ${w.nama.padEnd(8)} ${w.persen.toFixed(3).padStart(7)}%  x ${k.x0}–${k.x1}, y ${k.y0}–${k.y1} (${w.letak})`);
    }
  }
  if (!ada) console.log("  tidak ada");
}

// Peringatan kit yang dikumpulkan dari konsol halaman (console.warn "[kit] …"): teks lebih dari 3 baris, benda tidak muat, dst.
// Tidak menggagalkan proses; hanya perlu dibaca.
function laporPeringatan() {
  if (!peringatanKit.size) return;
  console.log(`\nPeringatan kit (${peringatanKit.size}; tidak menggagalkan proses)`);
  for (const p of peringatanKit) console.log(`  ${p}`);
}

function cetakRingkasan({ hasil, lembar, titik, peristiwa, info }) {
  laporPeringatan();
  const jumlahZona = hasil.reduce((a, h) => a + (h.zona?.length ?? 0), 0);
  const langgar = hasil.filter((h) => melanggarWarna(h).length);
  const kategori = [...new Set(langgar.flatMap((h) => melanggarWarna(h).map((w) => w.nama)))];
  console.log(`\nRingkasan periksa ${nama}`);
  console.log(`  lembar     ${rel(lembar)} (${hasil.length} titik, ${titik.asal})`);
  console.log(`  zona       ${info.adaZona ? `${jumlahZona} pelanggaran` : "dilewati (tanpa KIT.periksaZona)"}`);
  console.log(`  warna      ${langgar.length ? `LANGGAR: ${kategori.join(", ")} di ${langgar.length} dari ${hasil.length} titik` : "bersih"}`);
  console.log(`  peristiwa  ${peristiwa ? `${peristiwa.jumlah} → ${rel(peristiwa.berkas)}` : "dilewati (tanpa KIT.peristiwa)"}`);
  console.log(`  peringatan ${peringatanKit.size ? `${peringatanKit.size} (lihat "Peringatan kit" di atas)` : "tidak ada"}`);
}

// ---------------------------------------------------------------- tahap render
function mulaiFfmpeg(args) {
  const proses = spawn("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: ["pipe", "ignore", "inherit"] });
  sumber.anak.add(proses);
  proses.stdin.on("error", () => {}); // EPIPE bila ffmpeg mati; kegagalannya dilaporkan lewat kode keluar.
  const selesai = new Promise((ok, gagal) => {
    proses.on("error", gagal);
    proses.on("close", (kode) => (kode === 0 ? ok() : gagal(new Error(`ffmpeg keluar dengan kode ${kode}`))));
  });
  selesai.catch(() => {});
  return { proses, selesai };
}

async function tulis(ff, data) {
  if (!ff.proses.stdin.write(data)) await Promise.race([once(ff.proses.stdin, "drain"), ff.selesai]);
}

// Rentang frame dibagi rata ke N halaman. Setiap halaman mengirim PNG ke ffmpeg-nya sendiri dan menghasilkan
// satu segmen MP4 berpengaturan sama; segmen lalu disambung tanpa enkode ulang (concat demuxer, -c copy).
async function tahapRender(halaman0, info, galat) {
  const jumlah = Math.round(info.durasi * info.fps);
  const n = Math.max(1, Math.min(opsi.paralel, jumlah));
  // Sisa folder sementara dari proses yang dimatikan paksa (prosesnya sudah tidak ada) dihapus dulu.
  await mkdir(J.kerja, { recursive: true });
  for (const d of await readdir(J.kerja, { withFileTypes: true })) {
    const pid = d.isDirectory() && d.name.startsWith("sementara-") ? Number(d.name.slice(10)) : NaN;
    if (!Number.isInteger(pid) || pid === process.pid || hidupkah(pid)) continue;
    await rm(resolve(J.kerja, d.name), { recursive: true, force: true }).catch(() => {});
  }
  const sementara = (sumber.sementara = resolve(J.kerja, `sementara-${process.pid}`));
  await mkdir(sementara, { recursive: true });
  const bagian = Array.from({ length: n }, (_, k) => ({
    a: Math.floor((k * jumlah) / n),
    b: Math.floor(((k + 1) * jumlah) / n),
    berkas: resolve(sementara, `bagian-${k}.mp4`),
  }));
  console.log(`\nRender ${jumlah} frame dengan ${n} halaman`);
  const mulai = performance.now();
  const halaman = [halaman0, ...(await Promise.all(bagian.slice(1).map(async () => bukaHalaman(await bukaBrowser(), info.ukuran, galat))))];
  halaman.forEach(kunci);
  cekGalat(galat);
  if (n > 1) console.log(`  ${n} halaman siap dalam ${detik(performance.now() - mulai)} s`);

  let selesai = 0;
  let terakhir = performance.now();
  const maju = () => {
    selesai++;
    const kini = performance.now();
    if (selesai === jumlah || kini - terakhir > 5000) {
      terakhir = kini;
      const laju = selesai / ((kini - mulai) / 1000);
      console.log(`  frame ${selesai}/${jumlah} · ${laju.toFixed(1)} frame/s · sisa ±${Math.round((jumlah - selesai) / laju)} s`);
    }
  };
  await Promise.all(bagian.map((bg, k) => renderBagian(halaman[k], bg, info, galat, maju)));
  cekGalat(galat);
  await Promise.all(sumber.browser.slice(1).map((b) => b.close().catch(() => {}))); // lepas memori sebelum langkah suara

  const keluaran = J.bisu;
  if (n === 1) {
    await rename(bagian[0].berkas, keluaran);
  } else {
    const daftar = resolve(sementara, "daftar.txt");
    await writeFile(daftar, bagian.map((bg) => `file '${bg.berkas.replaceAll("\\", "/").replaceAll("'", "'\\''")}'`).join("\n") + "\n");
    const gabung = resolve(sementara, "gabung.mp4");
    await mulaiFfmpeg(["-f", "concat", "-safe", "0", "-i", daftar, "-c", "copy", "-movflags", "+faststart", gabung]).selesai;
    await rename(gabung, keluaran);
  }
  const ms = performance.now() - mulai;
  const frame = (await ffprobe(keluaran)).video?.frame;
  if (frame !== jumlah) throw new Error(`jumlah frame ${rel(keluaran)} ${frame}, seharusnya ${jumlah}`);
  console.log(`  ${rel(keluaran)}: ${jumlah} frame dalam ${detik(ms)} s (${(jumlah / (ms / 1000)).toFixed(1)} frame/s, ${n} halaman)`);
  return { jumlah, n, ms, keluaran };
}

function hidupkah(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
}

async function renderBagian(page, bg, info, galat, maju) {
  const potret = await pemotret(page);
  const ff = mulaiFfmpeg(["-f", "image2pipe", "-framerate", String(info.fps), "-i", "-", ...ENKODE, "-f", "mp4", bg.berkas]);
  for (let i = bg.a; i < bg.b; i++) {
    await page.evaluate((d) => window.tampilkan(d), i / info.fps);
    await tulis(ff, await potret());
    maju();
    if (galat.length) break;
  }
  ff.proses.stdin.end();
  await ff.selesai;
}

// ---------------------------------------------------------------- tahap suara
async function tahapSuara(info) {
  const skrip = resolve(ANIMASI, "kit", "suara", "buat-suara.mjs");
  if (!existsSync(skrip)) {
    console.warn("\nPERINGATAN: kit/suara/buat-suara.mjs belum ada; langkah suara dilewati.");
    return { dilewati: "kit/suara/buat-suara.mjs belum ada", baris: [] };
  }
  if (!info.adaPeristiwa) {
    console.warn("\nPERINGATAN: halaman tanpa KIT.peristiwa; langkah suara dilewati.");
    return { dilewati: "halaman tanpa KIT.peristiwa", baris: [] };
  }
  // Laporan stdout dicetak sekali di laporan akhir; stderr (peringatan, galat) langsung diteruskan.
  console.log(`\nSuara: node kit/suara/buat-suara.mjs ${namaBerkas} (laporannya di laporan akhir)`);
  const baris = [];
  const proses = spawn(process.execPath, [skrip, namaBerkas],{ cwd: ANIMASI, stdio: ["ignore", "pipe", "pipe"] });
  sumber.anak.add(proses);
  createInterface({ input: proses.stdout }).on("line", (l) => baris.push(l));
  createInterface({ input: proses.stderr }).on("line", (l) => console.error(`  suara │ ${l}`));
  const [kode] = await once(proses, "close");
  return { baris, gagal: kode === 0 ? null : `buat-suara.mjs keluar dengan kode ${kode}` };
}

// ---------------------------------------------------------------- laporan akhir
async function ffprobe(berkas) {
  const keluaran = await new Promise((ok, gagal) => {
    const p = spawn("ffprobe", ["-v", "error", "-count_packets", "-show_entries",
      "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_packets,sample_rate,channels",
      "-of", "json", berkas], { stdio: ["ignore", "pipe", "inherit"] });
    let teks = "";
    p.stdout.on("data", (d) => (teks += d));
    p.on("error", gagal);
    p.on("close", (kode) => (kode === 0 ? ok(teks) : gagal(new Error(`ffprobe ${rel(berkas)} keluar dengan kode ${kode}`))));
  });
  const j = JSON.parse(keluaran);
  const v = j.streams.find((s) => s.codec_type === "video");
  const a = j.streams.find((s) => s.codec_type === "audio");
  return {
    ukuran: Number(j.format.size),
    durasi: Number(j.format.duration),
    video: v && { codec: v.codec_name, lebar: v.width, tinggi: v.height, fps: v.r_frame_rate, frame: Number(v.nb_read_packets) },
    audio: a && { codec: a.codec_name, rate: Number(a.sample_rate), kanal: a.channels },
  };
}

async function laporanAkhir(info, render, suara, mulai) {
  console.log(`\nLaporan akhir ${nama} (${detik(Date.now() - mulai)} s total)`);
  for (const berkas of [J.bisu, J.video]) {
    if (!existsSync(berkas)) {
      console.log(`  ${rel(berkas)}: tidak ada`);
      continue;
    }
    const p = await ffprobe(berkas);
    const lama = (await stat(berkas)).mtimeMs < mulai ? "  (LAMA: tidak dibuat ulang di proses ini)" : "";
    const v = p.video ? `${p.video.codec} ${p.video.lebar}×${p.video.tinggi} ${p.video.fps} fps · ${p.video.frame} frame` : "tanpa video";
    const a = p.audio ? `audio ${p.audio.codec} ${p.audio.rate} Hz ${p.audio.kanal} kanal` : "tanpa audio";
    console.log(`  ${rel(berkas)}: ${(p.ukuran / 1048576).toFixed(1)} MB · ${v} · ${p.durasi.toFixed(3)} s · ${a}${lama}`);
  }
  console.log(`  render: ${render.jumlah} frame dalam ${detik(render.ms)} s dengan ${render.n} halaman (target ${Math.round(info.durasi * info.fps)} frame)`);
  if (suara.dilewati) console.log(`  suara: dilewati (${suara.dilewati})`);
  else {
    console.log(`  suara: ${suara.gagal ?? "selesai"}`);
    for (const l of suara.baris) if (l.trim()) console.log(`    ${l}`);
  }
}

// ---------------------------------------------------------------- mulai
// Opsi server sama dengan rekam.mjs: konfigurasi situs di root proyek tidak ikut terbaca, cache Vite dipisah
// per video supaya beberapa proses bisa berjalan bersamaan, dan akar server adalah animasi/.
sumber.server = await createServer({
  root: ANIMASI,
  cacheDir: resolve(ANIMASI, "node_modules", ".vite", nama),
  optimizeDeps: { entries: [`${relHalaman}/index.html`] },
  configFile: false,
  css: { postcss: {} },
  logLevel: opsi.pratinjau ? "info" : "warn",
  server: { port: 5180 },
});
await sumber.server.listen();
alamat = `${sumber.server.resolvedUrls.local[0]}${relHalaman}/`;

if (opsi.pratinjau) {
  console.log(`\nPratinjau ${nama}: ${alamat}`);
  console.log(`Bekukan di detik tertentu: ${alamat}?t=12\n`);
} else {
  const mulai = Date.now();
  try {
    await jalankan(mulai);
  } catch (e) {
    console.error(`\nGAGAL: ${e.message}`);
    process.exitCode = 1;
  } finally {
    await bersihkan();
  }
}
