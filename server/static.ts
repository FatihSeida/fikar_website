import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Versi .br/.gz dibuat saat build (script/build.ts). nginx di VPS hanya
  // mengompres HTML, jadi JS dan CSS dikirim terkompresi dari sini.
  const folderAset = path.join(distPath, "assets");
  const tersedia = new Set(fs.existsSync(folderAset) ? fs.readdirSync(folderAset) : []);
  const jenisAset: Record<string, string> = {
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".json": "application/json; charset=utf-8",
  };
  app.use("/assets", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const nama = req.path.slice(1);
    const jenis = jenisAset[path.extname(nama)];
    if (!jenis || nama.includes("/") || nama.includes("\\")) return next();
    const terima = req.get("accept-encoding") || "";
    const [pengodean, akhiran] = /\bbr\b/.test(terima) && tersedia.has(`${nama}.br`)
      ? ["br", ".br"]
      : /\bgzip\b/.test(terima) && tersedia.has(`${nama}.gz`) ? ["gzip", ".gz"] : [null, null];
    if (!pengodean) return next();
    res.setHeader("Content-Encoding", pengodean);
    res.setHeader("Content-Type", jenis);
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.sendFile(path.join(folderAset, `${nama}${akhiran}`), { dotfiles: "deny" });
  });

  app.use(express.static(distPath, {
    dotfiles: "deny",
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-store");
      } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Vary", "Accept-Encoding");
      } else {
        res.setHeader("Cache-Control", "public, max-age=3600");
      }
    },
  }));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
