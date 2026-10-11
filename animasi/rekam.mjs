/**
 * Pratinjau dan perekam animasi three.js untuk Instagram.
 *
 *   node rekam.mjs <nama>                     → hasil/<nama>.mp4 (1080×1920, 30 fps)
 *   node rekam.mjs <nama> --cuplik 2,12,26    → hasil/<nama>-t2.png, dst.
 *   node rekam.mjs --pratinjau <nama>         → server Vite untuk dibuka di browser
 *
 * Halaman animasi (proyek/<nama>/index.html) wajib menyediakan window.DURASI, window.siap, dan window.tampilkan(t).
 * Lihat README.md. Perekam ini masih menulis berkas lepas di hasil/; jalankan "npm run rapikan" sesudahnya.
 */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { cariHalaman } from "./kit/alat/jalur.mjs";
import { bukaPeramban, pastikanFfmpeg } from "./kit/alat/peramban.mjs";

const FPS = 30;
const LEBAR = 1080;
const TINGGI = 1920;

const folder = dirname(fileURLToPath(import.meta.url));
const argumen = process.argv.slice(2);
const pratinjau = argumen.includes("--pratinjau");
const iCuplik = argumen.indexOf("--cuplik");
const cuplik = iCuplik >= 0 ? argumen[iCuplik + 1].split(",").map(Number) : null;
const nama = argumen.find((a, i) => !a.startsWith("--") && (iCuplik < 0 || i !== iCuplik + 1));

const halaman = nama ? cariHalaman(nama) : null;
if (!halaman) {
  console.error("Pakai: node rekam.mjs [--pratinjau] <nama> [--cuplik 2,12,26]");
  console.error(nama ? `Tidak ada proyek/${nama}/index.html` : "Nama animasi belum diisi.");
  process.exit(1);
}
if (!pratinjau && !cuplik) pastikanFfmpeg(); // hanya perekaman video yang memakai ffmpeg

// configFile dan postcss dimatikan supaya konfigurasi situs di root proyek tidak ikut terbaca.
// Cache Vite dipisah per animasi supaya beberapa render bisa berjalan bersamaan.
// Akar server adalah folder animasi/ supaya halaman bisa mengimpor ../../kit/; yang dipindai hanya animasi ini.
const server = await createServer({
  root: folder,
  cacheDir: resolve(folder, "node_modules", ".vite", nama),
  optimizeDeps: { entries: [`${halaman.rel}/index.html`] },
  configFile: false,
  css: { postcss: {} },
  logLevel: pratinjau ? "info" : "warn",
  server: { port: 5180 },
});
await server.listen();
const alamat = `${server.resolvedUrls.local[0]}${halaman.rel}/`;

if (pratinjau) {
  console.log(`\nPratinjau ${nama}: ${alamat}`);
  console.log(`Bekukan di detik tertentu: ${alamat}?t=12\n`);
} else {
  await rekam();
}

async function rekam() {
  const keluaran = resolve(folder, "hasil");
  await mkdir(keluaran, { recursive: true });

  const browser = await bukaPeramban();
  const page = await browser.newPage({ viewport: { width: LEBAR, height: TINGGI }, deviceScaleFactor: 1 });
  const galat = [];
  page.on("pageerror", (e) => galat.push(e.message));
  // Sumber yang gagal dimuat dilaporkan lewat alamatnya; permintaan favicon bawaan browser diabaikan.
  page.on("console", (pesan) => {
    if (pesan.type() === "error" && !pesan.text().startsWith("Failed to load resource")) galat.push(pesan.text());
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().endsWith("/favicon.ico")) galat.push(`${res.status()} ${res.url()}`);
  });

  try {
    await page.goto(`${alamat}?rekam=1`);
    await page.waitForFunction(() => window.siap !== undefined, null, { timeout: 30000 });
    await page.evaluate(() => window.siap);
    const durasi = await page.evaluate(() => window.DURASI);
    if (galat.length) throw new Error(galat.join("\n"));

    if (cuplik) {
      for (const t of cuplik) {
        await page.evaluate((detik) => window.tampilkan(detik), t);
        const berkas = resolve(keluaran, `${nama}-t${t}.png`);
        await page.screenshot({ path: berkas });
        console.log(berkas);
      }
    } else {
      const jumlah = Math.round(durasi * FPS);
      const berkas = resolve(keluaran, `${nama}.mp4`);
      const ffmpeg = spawn("ffmpeg", [
        "-y", "-loglevel", "error",
        "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
        "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        berkas,
      ], { stdio: ["pipe", "inherit", "inherit"] });
      const selesai = new Promise((ok, gagal) => ffmpeg.on("close", (kode) => (kode === 0 ? ok() : gagal(new Error(`ffmpeg keluar dengan kode ${kode}`)))));

      for (let i = 0; i < jumlah; i++) {
        await page.evaluate((detik) => window.tampilkan(detik), i / FPS);
        const gambar = await page.screenshot({ type: "png" });
        if (!ffmpeg.stdin.write(gambar)) await new Promise((ok) => ffmpeg.stdin.once("drain", ok));
        if ((i + 1) % FPS === 0) console.log(`frame ${i + 1}/${jumlah}`);
      }
      ffmpeg.stdin.end();
      await selesai;
      console.log(berkas);
    }
    if (galat.length) throw new Error(galat.join("\n"));
  } finally {
    await browser.close();
    await server.close();
  }
}
