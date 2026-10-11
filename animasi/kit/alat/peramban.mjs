/**
 * Prasyarat luar alat render: peramban dan ffmpeg. Satu-satunya tempat yang memanggil chromium.launch() untuk alat kit
 * (kit/alat/buat.mjs, rekam.mjs di akar, kit/katalog/uji-bloom.mjs); folder proyek/ lama memakai Edge langsung.
 *
 * Urutan bila KIT_PERAMBAN kosong:
 *   1. Microsoft Edge (channel "msedge"): perilaku di PC Windows ini, tidak berubah.
 *   2. Chromium kelolaan Playwright (npx playwright-core install chromium).
 *   3. Chromium atau Chrome sistem di jalur Linux yang umum.
 * Peramban nomor 2 dan 3 dijalankan dengan WebGL perangkat lunak (SwiftShader), karena mesin tanpa GPU, seperti sesi
 * cloud Claude Code, tidak punya pilihan lain. Pikselnya sedikit berbeda dari Edge dengan GPU, dan renderernya lebih lambat.
 *
 * KIT_PERAMBAN memaksa satu pilihan tanpa cadangan: msedge | chromium | <jalur ke chrome atau chromium>.
 * Baris "Peramban: …" dicetak sekali per proses supaya terlihat peramban mana yang dipakai.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const JALUR_LINUX = [
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/opt/google/chrome/chrome",
  "/snap/bin/chromium",
];

// WebGL tanpa GPU: ANGLE dengan backend SwiftShader. --enable-unsafe-swiftshader wajib di Chrome baru, yang tidak lagi
// jatuh ke SwiftShader sendiri; --ignore-gpu-blocklist mencegah daftar blokir menolak WebGL di mesin tanpa kartu grafis.
const BENDERA_PERANGKAT_LUNAK = [
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
  "--enable-webgl",
];

const kandidatEdge = () => ({ label: "Microsoft Edge", perangkatLunak: false, opsi: { channel: "msedge" }, kendala: null });

function kandidatChromium() {
  let jalur = null;
  try { jalur = chromium.executablePath(); } catch { /* platform tanpa Chromium kelolaan */ }
  return {
    label: "Chromium Playwright",
    perangkatLunak: true,
    opsi: {},
    kendala: jalur && existsSync(jalur) ? null : "belum terpasang (npx playwright-core install chromium)",
  };
}

const kandidatBerkas = (jalur) => ({
  label: jalur,
  perangkatLunak: true,
  opsi: { executablePath: jalur },
  kendala: existsSync(jalur) ? null : "berkas tidak ditemukan",
});

function kandidatDariEnv(nilai) {
  const kecil = nilai.toLowerCase();
  if (kecil === "msedge") return kandidatEdge();
  if (kecil === "chromium") return kandidatChromium();
  if (/[\\/]/.test(nilai) || kecil.endsWith(".exe")) return kandidatBerkas(nilai);
  throw new Error(`KIT_PERAMBAN="${nilai}" tidak dikenal. Isi dengan msedge, chromium, atau jalur lengkap ke chrome/chromium.`);
}

async function luncurkan(k, gpu) {
  if (k.kendala) throw new Error(k.kendala);
  const args = k.perangkatLunak ? BENDERA_PERANGKAT_LUNAK : gpu ? ["--force_high_performance_gpu"] : [];
  return chromium.launch({ ...k.opsi, args });
}

const barisPertama = (e) => String(e?.message ?? e).split("\n")[0].trim();

async function pilihDanBuka(gpu) {
  const paksa = process.env.KIT_PERAMBAN?.trim() || null;
  const daftar = paksa
    ? [kandidatDariEnv(paksa)]
    : [kandidatEdge(), kandidatChromium(), ...JALUR_LINUX.filter((j) => existsSync(j)).map(kandidatBerkas)];
  const gagal = [];
  for (const k of daftar) {
    try {
      const browser = await luncurkan(k, gpu);
      const catatan = [
        k.perangkatLunak ? "WebGL perangkat lunak (tanpa GPU)" : null,
        paksa ? "dipilih lewat KIT_PERAMBAN" : gagal.length ? `${gagal.map((g) => g.label).join(", ")} tidak tersedia` : null,
      ].filter(Boolean);
      console.log(`Peramban: ${k.label}${catatan.length ? ` · ${catatan.join(" · ")}` : ""}`);
      return { browser, kandidat: k };
    } catch (e) {
      gagal.push({ label: k.label, sebab: barisPertama(e) });
    }
  }
  throw new Error([
    "tidak ada peramban yang bisa dijalankan:",
    ...gagal.map((g) => `  - ${g.label}: ${g.sebab}`),
    "Cara memperbaiki:",
    "  - Pasang Chromium Playwright dari animasi/: npx playwright-core install --with-deps chromium (--with-deps di Linux butuh root).",
    "  - Di sesi cloud: bila unduhan diblokir, ubah akses jaringan environment ke Full di claude.ai/code → ikon awan → gerigi → Network access, lalu jalankan: bash animasi/siapkan-cloud.sh",
    "  - Atau pakai peramban yang sudah ada: KIT_PERAMBAN=<jalur ke chrome atau chromium>.",
  ].join("\n"));
}

let penentuan = null;

/**
 * Membuka satu browser Playwright sesuai urutan di atas dan mengembalikannya. Pilihan dari pemanggilan pertama diingat,
 * jadi pemanggilan berikutnya (browser kedua dan seterusnya untuk render paralel) langsung memakai peramban yang sama.
 * gpu: true meminta kartu grafis diskrit (hanya berlaku untuk Edge; peramban cadangan selalu memakai perangkat lunak).
 */
export async function bukaPeramban({ gpu = false } = {}) {
  if (!penentuan) {
    penentuan = pilihDanBuka(gpu);
    return (await penentuan).browser;
  }
  return luncurkan((await penentuan).kandidat, gpu);
}

/** Menghentikan proses dengan petunjuk pemasangan bila ffmpeg atau ffprobe tidak ada di PATH. */
export function pastikanFfmpeg() {
  const hilang = ["ffmpeg", "ffprobe"].filter((p) => {
    const r = spawnSync(p, ["-version"], { stdio: "ignore" });
    return r.error || r.status !== 0;
  });
  if (!hilang.length) return;
  console.error(`GAGAL: ${hilang.join(" dan ")} tidak ditemukan di PATH.`);
  console.error("  Linux dan sesi cloud: apt-get install -y ffmpeg   (tambah sudo bila bukan root)");
  console.error("  Windows: winget install Gyan.FFmpeg");
  process.exit(1);
}
