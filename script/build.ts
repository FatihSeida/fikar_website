import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, copyFile, cp, readdir, writeFile } from "fs/promises";
import path from "path";
import { brotliCompressSync, gzipSync, constants as zlibConstants } from "zlib";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  // data geolokasi IP (server/geo.ts), dibaca dari dist/ saat produksi
  await copyFile("server/data/geo-id.bin.gz", "dist/geo-id.bin.gz");

  // connect-pg-simple ikut dibundel, tetapi membaca table.sql dari __dirname
  // (dist/) untuk membuat tabel session. Tanpa berkas ini login admin gagal.
  await copyFile("node_modules/connect-pg-simple/table.sql", "dist/table.sql");

  // Panduan dan templat Maturity Level Cabang, dikirim server hanya setelah rilis.
  await cp("server/data/unduhan", "dist/unduhan", { recursive: true });

  await kompresAset("dist/public/assets");
}

/**
 * nginx di VPS hanya mengompres HTML, sehingga JS dan CSS terkirim utuh.
 * Versi .br dan .gz dibuat sekali saat build lalu dikirim apa adanya oleh
 * server/static.ts, tanpa membebani CPU server di setiap permintaan.
 */
async function kompresAset(folder: string) {
  let hemat = 0;
  for (const nama of await readdir(folder)) {
    if (!/\.(js|css|svg|json)$/.test(nama)) continue;
    const berkas = path.join(folder, nama);
    const isi = await readFile(berkas);
    if (isi.length < 1024) continue;
    const br = brotliCompressSync(isi, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11, [zlibConstants.BROTLI_PARAM_SIZE_HINT]: isi.length } });
    await writeFile(`${berkas}.br`, br);
    await writeFile(`${berkas}.gz`, gzipSync(isi, { level: 9 }));
    hemat += isi.length - br.length;
  }
  console.log(`aset dikompres: hemat ${Math.round(hemat / 1024)} KB dengan brotli`);
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
