/**
 * Uji bloom katalog: pada keadaan selain emas dan nyala, bloom tidak boleh mengubah satu piksel pun (hanya emas yang boleh
 * berpendar). Jalankan dari animasi/ lewat PowerShell:
 *
 *   node kit/katalog/uji-bloom.mjs [biasa,denyut,abu,pudar] [--izinkan lentera] [--lembar]
 *
 * 1. Setiap halaman katalog ditangkap dengan bloom dan dengan ?bloom=0; piksel yang berbeda dipetakan ke sel benda
 *    (window.KATALOG) atau ke halaman dunia.
 * 2. Benda yang selnya berubah diuji sendirian di sel dan ukurannya sendiri (?hanya=<nama>), karena pendar satu benda bisa
 *    meluber ke sel tetangganya. Bukan ?benda=: perbesaran besar membuat kilau tepi bulat kertas ikut melewati ambang.
 * 3. Benda yang tetap berpendar sendirian (pada dua uji berturut-turut) dan tidak ada di --izinkan dinyatakan LANGGAR
 *    (kode keluar 1). Bawaan --izinkan: lentera (contohnya menyala emas). Beda di halaman dunia juga LANGGAR.
 * --lembar menulis hasil/gambar/kit-katalog/<keadaan>-lembar.png (semua halaman, skala 0.4) untuk dilihat.
 * Rincian: kit/docs/katalog.md.
 */
import { mkdir } from "node:fs/promises";
import { relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import sharp from "sharp";
import { jalurHasil } from "../alat/jalur.mjs";
import { bukaPeramban } from "../alat/peramban.mjs";

const ANIMASI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const arg = process.argv.slice(2);
const keadaan = (arg[0] && !arg[0].startsWith("--") ? arg[0] : "biasa,denyut,abu,pudar").split(",");
const iI = arg.indexOf("--izinkan");
const izin = new Set(iI >= 0 ? arg[iI + 1].split(",") : ["lentera"]);
const lembar = arg.includes("--lembar");

const server = await createServer({
  root: ANIMASI, cacheDir: resolve(ANIMASI, "node_modules", ".vite", "kit-katalog-uji"),
  optimizeDeps: { entries: ["kit/katalog/index.html"] }, configFile: false, css: { postcss: {} }, logLevel: "warn",
  server: { port: 5180, hmr: false }, // tanpa HMR: suntingan kit oleh proses lain tidak memuat ulang halaman di tengah uji
});
await server.listen();
const galat = [];
let browser = null;

async function buka(query) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => galat.push(`${query}: ${e.message}`));
  page.on("console", (p) => { if (p.type() === "error" && !p.text().startsWith("Failed to load resource")) galat.push(`${query}: ${p.text()}`); });
  await page.goto(`${server.resolvedUrls.local[0]}kit/katalog/?rekam=1&${query}`, { timeout: 90000 });
  await page.waitForFunction(() => window.siap !== undefined, null, { timeout: 90000 });
  await page.evaluate(() => window.siap);
  return page;
}
async function tangkap(page, t) {
  await page.evaluate((d) => window.tampilkan(d), t);
  const png = await page.screenshot();
  return { png, raw: await sharp(png).removeAlpha().raw().toBuffer() };
}
// Bandingkan halaman query dengan dan tanpa bloom (semua halaman, atau hanya `pilih`). Setiap perbandingan memakai browser
// baru: browser yang sudah membuka puluhan halaman WebGL menggambar sedikit berbeda dan memberi beda palsu.
// Mengembalikan { kat, beda: Map(sumber → piksel), png[] }.
async function banding(query, pilih = null) {
  browser = await bukaPeramban();
  try {
    return await bandingDi(query, pilih);
  } finally {
    await browser.close();
    browser = null;
  }
}
async function bandingDi(query, pilih) {
  const [a, b] = [await buka(query), await buka(`${query}&bloom=0`)];
  const kat = await a.evaluate(() => window.KATALOG);
  const beda = new Map(), png = [];
  for (let i = 0; i < kat.halaman.length; i++) {
    if (pilih && !pilih.includes(i)) continue;
    const h = kat.halaman[i];
    const [x, y] = [await tangkap(a, i + 0.5), await tangkap(b, i + 0.5)];
    png.push(x.png);
    for (let p = 0, j = 0; p < x.raw.length; p += 3, j++) {
      if (x.raw[p] === y.raw[p] && x.raw[p + 1] === y.raw[p + 1] && x.raw[p + 2] === y.raw[p + 2]) continue;
      const px = j % 1080, py = (j / 1080) | 0;
      const s = h.isi.find((e) => px >= e.sel.x0 && px < e.sel.x1 && py >= e.sel.y0 && py < e.sel.y1);
      const sumber = s ? s.nama : `#${i}`; // #i: di luar sel benda pada halaman i (atau halaman dunia)
      beda.set(sumber, (beda.get(sumber) ?? 0) + 1);
    }
  }
  await a.close();
  await b.close();
  return { kat, beda, png };
}

let langgar = 0;
try {
  for (const k of keadaan) {
    const q = k === "biasa" ? "" : `keadaan=${k}`;
    const { kat, beda, png } = await banding(q);
    const hasil = [], berpendar = new Set(); // indeks halaman yang punya benda berpendar sendirian
    // Benda: uji sendirian dua kali dan ambil yang terkecil. Pendar sungguhan selalu muncul; beda palsu dari GPU yang sedang
    // dipakai proses lain (render paralel agen lain) tidak muncul dua kali.
    for (const [sumber, n] of beda) {
      if (sumber.startsWith("#")) continue;
      const iHal = kat.halaman.findIndex((h) => h.isi.some((e) => e.nama === sumber));
      const q2 = `${q}${q ? "&" : ""}hanya=${encodeURIComponent(sumber)}`;
      let m = Infinity;
      for (let u = 0; u < 2 && m > 0; u++) m = Math.min(m, [...(await banding(q2, [iHal])).beda.values()].reduce((x, y) => x + y, 0));
      if (m) berpendar.add(iHal);
      if (!m) hasil.push(`luber    ${sumber}: ${n} px dari pendar tetangga, sendirian 0 px`);
      else if (izin.has(sumber)) hasil.push(`emas     ${sumber}: ${m} px (diizinkan)`);
      else { hasil.push(`LANGGAR  ${sumber}: ${m} px`); langgar++; }
    }
    // Di luar sel: luberan bila halaman itu punya benda yang berpendar sendirian; selain itu (mis. halaman dunia) pelanggaran.
    for (const [sumber, n] of beda) {
      if (!sumber.startsWith("#")) continue;
      const i = Number(sumber.slice(1)), nama = `halaman ${i + 1} (${kat.halaman[i].judul}), di luar sel`;
      if (berpendar.has(i)) hasil.push(`luber    ${nama}: ${n} px`);
      else { hasil.push(`LANGGAR  ${nama}: ${n} px`); langgar++; }
    }
    console.log(`${k}: ${kat.halaman.length} halaman, ${beda.size ? `${beda.size} sumber berubah` : "bloom tidak mengubah satu piksel pun"}`);
    for (const s of hasil) console.log(`  ${s}`);
    if (kat.gagal.length) console.log(`  gagal dibuat: ${kat.gagal.map((g) => `${g.nama} (${g.pesan})`).join(", ")}`);
    if (lembar) {
      const kecil = await Promise.all(png.map((p) => sharp(p).resize(432, 768).png().toBuffer()));
      const kol = Math.min(6, kecil.length), bar = Math.ceil(kecil.length / kol);
      const J = jalurHasil("kit/katalog");
      const berkas = resolve(J.gambar, `${k}-lembar.png`);
      await mkdir(J.gambar, { recursive: true });
      await sharp({ create: { width: kol * 440, height: bar * 776, channels: 3, background: "#202020" } })
        .composite(kecil.map((input, i) => ({ input, left: (i % kol) * 440 + 4, top: Math.floor(i / kol) * 776 + 4 })))
        .png().toFile(berkas);
      console.log(`  lembar: ${relative(ANIMASI, berkas).replaceAll("\\", "/")}`);
    }
  }
  if (galat.length) console.log(`GALAT KONSOL:\n  ${[...new Set(galat)].join("\n  ")}`);
  console.log(langgar || galat.length ? `\nGAGAL: ${langgar} pelanggaran bloom, ${galat.length} galat konsol` : "\nLULUS");
  process.exitCode = langgar || galat.length ? 1 : 0;
} finally {
  await browser?.close();
  await server.close();
}
