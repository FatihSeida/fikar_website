import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { insertGallerySchema, insertNoteSchema, insertKunjunganSchema } from "@shared/schema";
import { lookupGeo } from "./geo";
import { namaKota, namaProvinsi } from "./wilayah";
import { z } from "zod/v4";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

function sanitizeHtml(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3",
      "ul", "ol", "li", "blockquote", "img", "hr", "span", "div",
    ],
    ALLOWED_ATTR: ["src", "alt", "class", "width", "height"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["style"],
  });
}

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const extensions: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };
    cb(null, `${randomBytes(24).toString("hex")}${extensions[file.mimetype] ?? ""}`);
  },
});
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 4, fieldNameSize: 100 },
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    cb(null, true);
  },
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; startedAt: number; blockedUntil?: number }>();

function passwordMatches(candidate: string): boolean {
  const expected = createHash("sha256").update(ADMIN_PASSWORD).digest();
  const received = createHash("sha256").update(candidate).digest();
  return timingSafeEqual(expected, received);
}

function parsePositiveId(raw: string | string[]): number | null {
  if (Array.isArray(raw)) return null;
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function parseSlug(raw: string | string[]): string | null {
  if (Array.isArray(raw) || raw.length > 120) return null;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw) ? raw : null;
}

function validationMessage(error: z.ZodError): string {
  return error.issues[0]?.message || "Data yang dikirim tidak valid";
}

async function hasValidImageSignature(filePath: string, mimetype: string): Promise<boolean> {
  const handle = await fs.promises.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, buffer.length, 0);
    if (mimetype === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (mimetype === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (mimetype === "image/webp") return buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
    return false;
  } finally {
    await handle.close();
  }
}

/** Pembatas sederhana per kunci (biasanya IP) dengan jendela waktu bergeser. */
function buatPembatas(batas: number, jendelaMs: number) {
  const catatan = new Map<string, number[]>();
  return (kunci: string): boolean => {
    const sekarang = Date.now();
    const daftar = (catatan.get(kunci) ?? []).filter((waktu) => sekarang - waktu < jendelaMs);
    const boleh = daftar.length < batas;
    if (boleh) daftar.push(sekarang);
    catatan.set(kunci, daftar);
    if (catatan.size > 10_000) {
      catatan.forEach((waktu, key) => {
        if (!waktu.length || sekarang - waktu[waktu.length - 1] >= jendelaMs) catatan.delete(key);
      });
    }
    return boleh;
  };
}

// Batasnya longgar karena banyak pengguna seluler berbagi satu IP publik (CGNAT operator).
const bolehCatatKunjungan = buatPembatas(300, 60 * 1000);

const pelacakOtomatis = /bot|crawl|spider|slurp|facebookexternalhit|headless|lighthouse|curl|wget|python|preview/i;

/** Garam acak yang berganti setiap hari WIB, hanya hidup di memori. */
let garamHarian = { tanggal: "", nilai: "" };
function garamHariIni(): string {
  const tanggal = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (garamHarian.tanggal !== tanggal) garamHarian = { tanggal, nilai: randomBytes(16).toString("hex") };
  return garamHarian.nilai;
}

function jenisPerangkat(userAgent: string): string {
  if (/iPad|Tablet/i.test(userAgent)) return "Tablet";
  if (/Mobi|Android|iPhone/i.test(userAgent)) return "HP";
  return "Desktop";
}

const sumberDikenal: [RegExp, string][] = [
  [/whatsapp|wa\.me/, "WhatsApp"],
  [/instagram/, "Instagram"],
  [/facebook|fb\.com|fb\.me/, "Facebook"],
  [/(^|\.)t\.co$|twitter|(^|\.)x\.com$/, "X"],
  [/tiktok/, "TikTok"],
  [/youtube|youtu\.be/, "YouTube"],
  [/telegram|(^|\.)t\.me$/, "Telegram"],
  [/linkedin/, "LinkedIn"],
  [/google/, "Google"],
  [/bing|yahoo|duckduckgo/, "Mesin pencari lain"],
];

/** Tautan bertanda (?ref=...) diutamakan; selain itu sumber dibaca dari referrer. */
function tentukanSumber(referrer: string | null | undefined, ref: string | null | undefined, hostSendiri: string | undefined) {
  let hostReferrer: string | null = null;
  if (referrer) {
    try {
      hostReferrer = new URL(referrer).host.toLowerCase().replace(/^www\./, "") || null;
    } catch {
      hostReferrer = null;
    }
  }
  if (hostReferrer && hostSendiri && hostReferrer === hostSendiri.toLowerCase().replace(/^www\./, "")) hostReferrer = null;
  if (ref) return { referrer: hostReferrer, sumber: `Tautan: ${ref.toLowerCase()}` };
  if (!hostReferrer) return { referrer: null, sumber: "Langsung" };
  const dikenal = sumberDikenal.find(([pola]) => pola.test(hostReferrer as string));
  return { referrer: hostReferrer, sumber: dikenal ? dikenal[1] : hostReferrer };
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin) {
    return next();
  }
  return res.status(401).json({ message: "Autentikasi diperlukan" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use("/api", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

    const fetchSite = req.get("sec-fetch-site");
    if (fetchSite === "cross-site") {
      return res.status(403).json({ message: "Permintaan lintas situs ditolak" });
    }

    const origin = req.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== req.get("host")) {
          return res.status(403).json({ message: "Asal permintaan tidak diizinkan" });
        }
      } catch {
        return res.status(403).json({ message: "Asal permintaan tidak valid" });
      }
    }
    return next();
  });

  // --- Admin Auth ---
  app.post("/api/admin/login", (req, res) => {
    const input = z.object({ password: z.string().min(1).max(256) }).safeParse(req.body);
    if (!input.success) return res.status(400).json({ message: "Kredensial tidak valid" });

    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const existing = loginAttempts.get(key);
    if (existing?.blockedUntil && existing.blockedUntil > now) {
      const retryAfter = Math.ceil((existing.blockedUntil - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ message: "Terlalu banyak percobaan. Silakan coba kembali beberapa saat lagi" });
    }

    if (!passwordMatches(input.data.password)) {
      const current = !existing || now - existing.startedAt > LOGIN_WINDOW_MS
        ? { count: 0, startedAt: now }
        : existing;
      current.count += 1;
      if (current.count >= MAX_LOGIN_ATTEMPTS) current.blockedUntil = now + LOGIN_WINDOW_MS;
      loginAttempts.set(key, current);
      return res.status(401).json({ message: "Kredensial tidak valid" });
    }

    loginAttempts.delete(key);
    return req.session.regenerate((error) => {
      if (error) return res.status(500).json({ message: "Sesi tidak dapat dibuat" });
      req.session.isAdmin = true;
      return req.session.save((saveError) => {
        if (saveError) return res.status(500).json({ message: "Sesi tidak dapat disimpan" });
        return res.json({ success: true });
      });
    });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("ahmad.sid", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      res.json({ success: true });
    });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session?.isAdmin });
  });

  // --- Gallery ---
  app.get("/api/gallery", async (_req, res) => {
    const items = await storage.getGalleryItems();
    res.json(items);
  });

  app.post("/api/gallery", requireAdmin, async (req, res) => {
    const parsed = insertGallerySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
    const item = await storage.createGalleryItem(parsed.data);
    res.status(201).json(item);
  });

  app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ message: "ID galeri tidak valid" });
    await storage.deleteGalleryItem(id);
    res.json({ success: true });
  });

  // --- Catatan ---
  app.get("/api/notes", async (_req, res) => {
    const items = await storage.getNotes();
    res.json(items);
  });

  app.get("/api/notes/:slug", async (req, res) => {
    const slug = parseSlug(req.params.slug);
    if (!slug) {
      return res.status(400).json({ message: "Slug catatan tidak valid" });
    }
    const note = await storage.getNote(slug);
    if (!note) return res.status(404).json({ message: "Catatan tidak ditemukan" });
    res.json(note);
  });

  app.post("/api/notes", requireAdmin, async (req, res) => {
    const parsed = insertNoteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
    const data = { ...parsed.data, content: sanitizeHtml(parsed.data.content) };
    const note = await storage.createNote(data);
    res.status(201).json(note);
  });

  app.put("/api/notes/:id", requireAdmin, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ message: "ID catatan tidak valid" });
    const parsed = insertNoteSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
    const data = parsed.data.content ? { ...parsed.data, content: sanitizeHtml(parsed.data.content) } : parsed.data;
    const note = await storage.updateNote(id, data);
    res.json(note);
  });

  app.delete("/api/notes/:id", requireAdmin, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ message: "ID catatan tidak valid" });
    await storage.deleteNote(id);
    res.json({ success: true });
  });

  // --- Pages (halaman statis seperti Pemikiran) ---
  app.get("/api/pages/:slug", async (req, res) => {
    const slug = parseSlug(req.params.slug);
    if (!slug) {
      return res.status(400).json({ message: "Slug halaman tidak valid" });
    }
    const page = await storage.getPage(slug);
    if (!page) return res.status(404).json({ message: "Halaman tidak ditemukan" });
    res.json(page);
  });

  app.put("/api/pages/:slug", requireAdmin, async (req, res) => {
    const slug = parseSlug(req.params.slug);
    if (!slug) {
      return res.status(400).json({ message: "Slug halaman tidak valid" });
    }
    const pageSchema = z.object({ title: z.string().trim().min(3).max(180), content: z.string().min(20).max(200_000) });
    const parsed = pageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
    const data = { ...parsed.data, content: sanitizeHtml(parsed.data.content) };
    const page = await storage.upsertPage(slug, data);
    res.json(page);
  });

  // --- File Upload ---
  app.post("/api/upload", requireAdmin, upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });
    if (!(await hasValidImageSignature(req.file.path, req.file.mimetype))) {
      await fs.promises.unlink(req.file.path).catch(() => undefined);
      return res.status(400).json({ message: "Isi file tidak cocok dengan format gambar" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  });

  app.use("/uploads", express.static(uploadDir, {
    dotfiles: "deny",
    index: false,
    maxAge: "30d",
    immutable: true,
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox");
    },
  }));

  // --- Analytics: kunjungan tanpa cookie dan tanpa menyimpan IP ---
  app.post("/api/kunjungan", async (req, res) => {
    const userAgent = req.get("user-agent") || "";
    if (req.session?.isAdmin || !userAgent || pelacakOtomatis.test(userAgent)) return res.status(204).end();
    const ip = req.ip || req.socket.remoteAddress || "";
    if (!bolehCatatKunjungan(ip)) return res.status(204).end();
    const parsed = insertKunjunganSchema.safeParse(req.body);
    if (!parsed.success || parsed.data.path.startsWith("/admin")) return res.status(400).end();

    const lokasi = lookupGeo(ip);
    const { referrer, sumber } = tentukanSumber(parsed.data.referrer, parsed.data.sumber, req.get("host"));
    await storage.recordKunjungan({
      path: parsed.data.path,
      referrer,
      sumber,
      kota: namaKota(lokasi?.city),
      provinsi: namaProvinsi(lokasi?.region),
      perangkat: jenisPerangkat(userAgent),
      pengunjung: createHash("sha256").update(garamHariIni()).update(ip).update(userAgent).digest("hex").slice(0, 16),
    });
    res.status(204).end();
  });

  app.get("/api/admin/kunjungan", requireAdmin, async (req, res) => {
    const hari = Number(req.query.hari ?? 30);
    const rentang = Number.isInteger(hari) ? Math.min(365, Math.max(1, hari)) : 30;
    res.json(await storage.getStatistikKunjungan(rentang));
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const legacySlugs = new Set([
    "oic-youth-capital-2026-konya", "umkm-sebagai-fondasi-masa-depan",
    "evaluasi-pelayanan-kepemudaan", "apresiasi-kepemimpinan-menteri-pariwisata",
    "pariwisata-pilar-kesejahteraan", "mitigasi-destinasi-wisata-alam",
    "tarif-pajak-efektif-manajemen-perpajakan", "peranan-perempuan-civil-society",
    "hmi-evidence-gerakan-berbasis-bukti", "kaderisasi-yang-berkelanjutan",
    "membaca-perubahan-lebih-awal", "dari-pergantian-menuju-pembelajaran",
  ]);
  for (const note of await storage.getNotes()) {
    if (legacySlugs.has(note.slug)) await storage.deleteNote(note.id);
    else if ([note.content, note.title, note.excerpt].some(value => value.includes("\u2014"))) {
      const normalize = (value: string) => value.replace(/\s*\u2014\s*/g, ", ");
      await storage.updateNote(note.id, { content: normalize(note.content), title: normalize(note.title), excerpt: normalize(note.excerpt) });
    }
  }

  const noteSeeds = [
    {
      title: "Ketika Data Kader Belum Menjadi Pengetahuan Organisasi", slug: "data-kader-belum-menjadi-pengetahuan-organisasi",
      excerpt: "Komisariat, Cabang, Badko, dan Pengurus Besar dapat memiliki banyak catatan, tetapi belum tentu berbagi satu gambaran yang dapat dipercaya.",
      content: `<p>Setiap jenjang HMI menghasilkan data. Nama peserta Latihan Kader dicatat, susunan kepengurusan disimpan, kegiatan dilaporkan, dan keputusan forum dituangkan ke dalam dokumen. Dari Komisariat sampai Pengurus Besar, jejak organisasi sebenarnya terus bertambah.</p><p>Persoalannya muncul ketika catatan tersebut hidup sendiri-sendiri. Komisariat memiliki daftar kadernya, Cabang menyusun rekapitulasi, Badko menerima laporan dari sejumlah wilayah, sedangkan Pengurus Besar melihat angka dalam skala nasional. Semuanya berbicara tentang kader, tetapi belum tentu menggunakan pengertian yang sama.</p><h2>Banyak catatan, belum satu pengetahuan</h2><p>Siapa yang disebut kader aktif? Apakah kehadiran dalam satu kegiatan cukup menjadi ukuran? Bagaimana kompetensi, minat, proses pendampingan, dan ruang pengabdian dicatat? Ketika definisinya berbeda, angka yang sama dapat membawa kesimpulan yang berbeda.</p><p>Akibatnya terasa ketika Rapat Bidang menyusun program, Rapat Presidium menentukan prioritas, Rapat Harian memeriksa pelaksanaan, atau Pleno mengevaluasi satu periode. Forum dapat dipenuhi laporan, tetapi keputusan tetap bertumpu pada gambaran yang tidak utuh.</p><blockquote>Organisasi dapat memiliki banyak data dan tetap tidak mempunyai pengetahuan yang dapat dipercaya.</blockquote><h2>Data sebagai bahasa bersama</h2><p>HMI Evidence tidak berangkat dari keinginan mengumpulkan data sebanyak-banyaknya. Ikhtiarnya adalah membangun bahasa bersama agar pengalaman kader dapat dibaca secara berkelanjutan. Data harus memiliki definisi, konteks, penanggung jawab, serta hubungan yang jelas dengan keputusan organisasi.</p><p>Komisariat memberi makna pada catatan karena berada paling dekat dengan keseharian kader. Cabang membaca pola antarkomisariat dan melihat kebutuhan penguatan. Badko menghubungkan pengalaman antarcabang. Pengurus Besar mengolah pola nasional menjadi arah kebijakan, pedoman, dan dukungan perkaderan.</p><p>Data baru menjadi pengetahuan ketika organisasi dapat menjelaskan apa yang terjadi, mengapa hal itu terjadi, dan keputusan apa yang perlu diambil. Pada titik itulah catatan tidak lagi berhenti sebagai kelengkapan administrasi. Ia menjadi ingatan bersama yang membantu HMI belajar dari dirinya sendiri.</p>`,
      tag: "HMI Evidence", date: "2026", coverImage: "/scrollytelling/hmi-evidence-01-indonesia-v1.webp", sourceUrl: null, sourceName: null,
    },
    {
      title: "Sesudah Latihan Kader, Ke Mana Perjalanan Mereka Berlanjut?", slug: "sesudah-latihan-kader-ke-mana-perjalanan-berlanjut",
      excerpt: "Organisasi mengetahui siapa yang mengikuti latihan, tetapi belum selalu mengetahui siapa yang bertumbuh, berhenti, atau membutuhkan pendampingan.",
      content: `<p>Latihan Kader sering menjadi salah satu peristiwa yang paling diingat dalam perjalanan seorang anggota HMI. Di dalamnya, kader berjumpa dengan nilai, gagasan, sejarah, dan tanggung jawab organisasi. Namun, perkaderan tidak selesai ketika forum ditutup dan peserta kembali ke kampusnya.</p><p>Justru setelah latihan, pertanyaan yang lebih penting dimulai. Apakah kader memperoleh ruang untuk menguji gagasannya? Siapa yang mendampinginya ketika menghadapi persoalan akademik, ekonomi, organisasi, atau kehidupan kampus? Kompetensi apa yang berkembang, dan di bagian mana prosesnya terhenti?</p><h2>Dari daftar alumni menuju perjalanan kader</h2><p>Organisasi umumnya dapat mengetahui jumlah peserta dan alumni latihan. Akan tetapi, jumlah tersebut belum menjelaskan siapa yang tetap aktif, siapa yang menjauh, mengapa mereka berhenti, dan dukungan apa yang sebenarnya mereka perlukan.</p><p>Ketika perjalanan itu tidak terbaca, kader mudah dipandang hanya pada dua keadaan: hadir atau tidak hadir, aktif atau tidak aktif. Padahal, pertumbuhan manusia tidak berlangsung sesederhana itu. Ada kader yang membutuhkan ruang intelektual, ada yang memerlukan pendampingan profesi, ada yang sedang mencari ruang pengabdian, dan ada pula yang belum menemukan hubungan antara HMI dengan kenyataan hidupnya.</p><blockquote>Latihan Kader adalah pintu masuk. Perkaderan adalah perjalanan panjang untuk membina manusia.</blockquote><h2>Organisasi yang hadir setelah forum selesai</h2><p>Komisariat memiliki posisi terdekat untuk mengenali perjalanan tersebut. Percakapan informal, forum kajian, penugasan, ruang karya, dan pendampingan dapat menjadi sumber pengetahuan tentang perkembangan kader. Cabang kemudian membaca pola lintas Komisariat agar dukungan tidak bergantung pada kebetulan atau kedekatan personal.</p><p>Membaca perjalanan kader bukan ikhtiar untuk mengawasi atau membuat peringkat. Bukti digunakan agar organisasi mengetahui kapan harus hadir, bentuk dukungan apa yang dibutuhkan, dan pengalaman mana yang layak diperbaiki atau diteruskan.</p><p>Dengan cara itu, perkaderan bergerak dari kegiatan yang selesai pada jadwal menuju ekosistem yang menjaga pertumbuhan. Lima kualitas Insan Cita tidak hanya disebut sebagai tujuan, tetapi dibina melalui pengalaman yang dapat dirasakan, dibaca, dan dipelajari bersama.</p>`,
      tag: "HMI Evidence", date: "2026", coverImage: "/scrollytelling/hmi-evidence-02-kelahiran-hmi-v1.webp", sourceUrl: null, sourceName: null,
    },
    {
      title: "Ketika Perkaderan Tidak Lagi Membaca Student Needs dan Student Interest", slug: "perkaderan-student-needs-dan-student-interest",
      excerpt: "Perkaderan kehilangan relevansi ketika pengalaman yang ditawarkan tidak lagi berhubungan dengan kebutuhan dan ketertarikan mahasiswa hari ini.",
      content: `<p>Mahasiswa yang datang ke HMI hari ini hidup dalam kenyataan yang berbeda dari generasi sebelumnya. Teknologi mengubah cara belajar dan berkomunikasi. Tekanan akademik, ketidakpastian dunia kerja, persoalan ekonomi, kesehatan mental, serta kebutuhan mengembangkan kompetensi hadir bersamaan dalam kehidupan mereka.</p><p>Di tengah perubahan itu, organisasi tidak cukup hanya mengulang bentuk kegiatan yang pernah dianggap berhasil. Pedoman dapat tetap sama, tetapi pengalaman perkaderan harus terus diperiksa. Tanpa pembacaan yang jernih, HMI berisiko menawarkan jawaban lama kepada mahasiswa yang sedang menghadapi persoalan baru.</p><h2>Mengenali Student Needs dan Student Interest</h2><p>Student Needs membantu organisasi memahami dukungan yang dibutuhkan mahasiswa untuk bertumbuh. Student Interest membantu membaca isu, medium, pengetahuan, dan ruang pengembangan yang membuat mereka bersedia terlibat. Keduanya bukan alasan untuk mengikuti setiap tren, melainkan pintu untuk menghubungkan nilai HMI dengan kenyataan kader.</p><p>Jika Student Needs dan Student Interest tidak hadir dalam Rapat Bidang dan Rapat Kerja, program mudah disusun dari kebiasaan. Jika tidak dibawa ke Rapat Presidium dan Rapat Harian, keputusan mudah bertumpu pada asumsi. Jika tidak dibaca dalam Pleno, evaluasi hanya mengukur apakah kegiatan terlaksana, bukan apakah kader mengalami pertumbuhan.</p><blockquote>Relevansi bukan mengubah tujuan perkaderan. Relevansi memastikan tujuan itu benar-benar bekerja dalam kehidupan mahasiswa.</blockquote><h2>Nilai yang tetap, pengalaman yang terus diperbarui</h2><p>HMI Evidence menempatkan Pedoman Perkaderan dan Tafsir Tujuan sebagai arah. Bukti membantu organisasi memahami jalan yang ditempuh untuk sampai ke arah tersebut. Pengalaman kader didengarkan, perkembangan dibaca, dan hasil program diperiksa agar pembinaan tidak berhenti sebagai niat baik.</p><p>Lima kualitas Insan Cita memerlukan lebih dari penyampaian materi. Kualitas akademis tumbuh melalui tradisi intelektual. Kualitas pencipta berkembang melalui ruang untuk menguji gagasan. Kualitas pengabdi dibina melalui perjumpaan dengan persoalan masyarakat. Nafas Islam dan tanggung jawab sosial hidup ketika nilai hadir dalam pilihan nyata.</p><p>Perkaderan yang relevan bukan perkaderan yang kehilangan identitas. Ia justru menjaga tujuan HMI dengan menghadirkan pengalaman yang mampu menjawab Student Needs dan Student Interest, tanpa melepaskan tanggung jawab kepada umat dan bangsa.</p>`,
      tag: "HMI Evidence", date: "2026", coverImage: "/scrollytelling/hmi-evidence-03-perubahan-zaman-v1.webp", sourceUrl: null, sourceName: null,
    },
    {
      title: "Ketika Energi Organisasi Lebih Banyak Terserap ke Dalam", slug: "energi-organisasi-terserap-ke-dalam",
      excerpt: "Dinamika internal adalah bagian dari organisasi, tetapi ia menjadi persoalan ketika lebih dikenal daripada masalah mahasiswa dan masyarakat.",
      content: `<p>Setiap organisasi memiliki dinamika internal. Perbedaan pandangan, pergantian kepemimpinan, dan kontestasi gagasan merupakan bagian dari proses demokrasi. Persoalan muncul ketika hampir seluruh perhatian, waktu, dan sumber daya organisasi habis untuk mengelola dirinya sendiri.</p><p>Menjelang Rapat Anggota Komisariat, Konferensi Cabang, Musyawarah Daerah, atau Kongres, peta dukungan dapat dibaca dengan sangat teliti. Nama, delegasi, kekuatan cabang, dan arah konsolidasi diperbarui dari waktu ke waktu. Ketelitian serupa belum selalu digunakan untuk membaca perjalanan kader serta persoalan mahasiswa di sekitar organisasi.</p><blockquote>Kita dapat mengetahui cabang mana mendukung siapa, tetapi belum tentu mengetahui Komisariat mana yang kehilangan kader setelah latihan.</blockquote><h2>Ketika kesibukan tidak lagi sama dengan gerakan</h2><p>Rapat dapat berlangsung berkali-kali, agenda dapat memenuhi kalender, dan struktur dapat terus bergerak. Namun, kesibukan internal tidak dengan sendirinya menghadirkan dampak. Organisasi perlu bertanya apakah energi yang dikeluarkan menghasilkan pertumbuhan kader, pengetahuan baru, dan perubahan yang dirasakan masyarakat.</p><p>Ketika pertanyaan itu tidak hadir, kader menjadi lebih akrab dengan konflik kepengurusan daripada persoalan kampus. Peta dukungan lebih dikenal daripada Student Needs dan Student Interest. Ruang pengabdian menyempit karena organisasi terus-menerus memusatkan pandangan kepada dirinya sendiri.</p><h2>Mengembalikan energi kepada tujuan</h2><p>HMI Evidence tidak meniadakan dinamika politik organisasi. Ikhtiarnya adalah menghadirkan ukuran tanggung jawab yang lebih substantif. Laporan pertanggungjawaban tidak hanya memuat berapa kegiatan yang dilaksanakan, tetapi juga perubahan apa yang terjadi, siapa yang memperoleh manfaat, apa yang tidak bekerja, dan pengetahuan apa yang diwariskan.</p><p>Rapat Bidang perlu memulai program dari masalah yang jelas. Rapat Presidium menimbang pilihan dan akibatnya. Rapat Harian memeriksa kemajuan serta hambatan. Pleno membandingkan tujuan dengan hasil. Rapat Kerja mengarahkan program dan anggaran kepada kebutuhan kader, bukan sekadar mengulang susunan kegiatan.</p><p>Dengan begitu, Rapat Anggota Komisariat, Konferensi Cabang, Musyawarah Daerah, dan Kongres tidak hanya menjadi ruang pergantian kepemimpinan. Forum tersebut juga menjadi saat bagi organisasi untuk menilai seberapa jauh ia membina kader, menjawab persoalan mahasiswa, dan menghadirkan pengabdian bagi masyarakat.</p><p>Transformasi dimulai ketika energi organisasi kembali diarahkan keluar: dari kontestasi menuju kontribusi, dari kesibukan menuju dampak, dan dari mempertahankan struktur menuju membina manusia.</p>`,
      tag: "HMI Evidence", date: "2026", coverImage: "/scrollytelling/hmi-evidence-04-lingkaran-organisasi-v1.webp", sourceUrl: null, sourceName: null,
    },
    {
      title: "Pasal 154A UU Cipta Kerja: Lonceng Kematian bagi Asas Praduga Tak Bersalah dan Hak Pekerja",
      slug: "pasal-154a-uu-cipta-kerja-hak-pekerja",
      excerpt: "Ahmad Zulfikar menilai PHK terhadap pekerja yang masih berstatus terduga dan ditahan selama enam bulan mencederai asas praduga tak bersalah serta membuka ruang ketimpangan relasi kuasa.",
      content: `<p>Ketua PD F.SPTI–KSPSI DKI Jakarta Ahmad Zulfikar mengkritik ketentuan Pasal 154A ayat (1) huruf l UU Cipta Kerja. Ia menilai kehilangan pekerjaan hanya karena status dugaan atau penahanan sementara merupakan penghakiman sebelum adanya putusan pengadilan berkekuatan hukum tetap.</p><p>Artikel lengkap diterbitkan oleh FOXNESIA pada 3 Februari 2026.</p>`,
      tag: "Ketenagakerjaan", date: "3 Februari 2026", coverImage: "/ahmad/journey-court-detail.webp",
      sourceUrl: "https://www.foxnesia.com/2026/02/pasal-154a-uu-cipta-kerja-lonceng.html", sourceName: "FOXNESIA",
    },
    {
      title: "Ugal-ugalan Cabut 11 Juta Kepesertaan BPJS PBI, Serikat Buruh Angkat Suara",
      slug: "pencabutan-kepesertaan-bpjs-pbi-serikat-buruh",
      excerpt: "F.SPTI–KSPSI DKI Jakarta mengkritik penonaktifan jutaan peserta PBI tanpa pemberitahuan dini, masa transisi yang memadai, dan mekanisme verifikasi yang mudah bagi masyarakat rentan.",
      content: `<p>Ahmad Zulfikar bersama serikat pekerja menyoroti dampak penonaktifan kepesertaan BPJS PBI terhadap masyarakat miskin dan pekerja rentan. Kritik diarahkan pada minimnya transparansi, sempitnya masa transisi, serta sulitnya pembaruan data ketika layanan kesehatan sedang dibutuhkan.</p><p>Artikel lengkap diterbitkan oleh Bacaonline.id pada 9 Februari 2026.</p>`,
      tag: "Jaminan Sosial", date: "9 Februari 2026", coverImage: "/ahmad/gallery-forum-organisasi.webp",
      sourceUrl: "https://bacaonline.id/kesehatan/ugal-ugalan-cabut-11-juta-kepesertaan-bpjs-pbi-serikat-buruh-angkat-suara", sourceName: "Bacaonline.id",
    },
    {
      title: "Bela Hak 83 Buruh PT Eastern, Tiga Mahasiswa Menjadi Korban Represif Aparat",
      slug: "bela-hak-83-buruh-pt-eastern",
      excerpt: "Aksi menuntut hak normatif dan pesangon 83 pekerja PT Eastern Pearl Flour Mills berlangsung lebih dari sebulan dan diwarnai tindakan represif yang melukai sejumlah peserta aksi.",
      content: `<p>Aliansi buruh, mahasiswa, dan pemuda mendampingi 83 pekerja PT Eastern Pearl Flour Mills yang menuntut hak normatif dan pesangon setelah puluhan tahun bekerja. Ahmad Zulfikar, yang menjadi jenderal lapangan aksi, termasuk peserta yang mengalami luka dalam tindakan represif aparat.</p><p>Artikel lengkap diterbitkan oleh KNEWS pada 6 Maret 2022.</p>`,
      tag: "Advokasi Buruh", date: "6 Maret 2022", coverImage: "/ahmad/gallery-aksi-mahasiswa.webp",
      sourceUrl: "https://www.knews.co.id/2022/03/bela-hak-83-buruh-pt-eastern-3.html?m=1", sourceName: "KNEWS",
    },
    {
      title: "Profil Ahmad Zulfikar, Aktivis Makassar Pembela Kaum Buruh Pimpin FSPTI–KSPSI DKI",
      slug: "profil-ahmad-zulfikar-pembela-buruh-fspti-dki",
      excerpt: "Rekam jejak Ahmad Zulfikar mempertemukan kaderisasi HMI, profesi advokat, pengalaman organisasi buruh di Makassar, dan kepemimpinan F.SPTI–KSPSI DKI Jakarta.",
      content: `<p>Profil ini merangkum perjalanan Ahmad Zulfikar sebagai kader HMI asal Cabang Gowa Raya, advokat, serta aktivis yang mendampingi berbagai persoalan ketenagakerjaan di Makassar. Pada 2025 ia dipercaya memimpin PD F.SPTI–KSPSI DKI Jakarta.</p><p>Artikel lengkap diterbitkan oleh Bacaonline.id pada 19 Mei 2025.</p>`,
      tag: "Profil", date: "19 Mei 2025", coverImage: "/ahmad/gallery-forum-integritas.webp",
      sourceUrl: "https://bacaonline.id/daerah/profil-ahmad-zulfikar-aktivis-makassar-pembela-kaum-buruh-pimpin-fspti-kspsi-dki/", sourceName: "Bacaonline.id",
    },
    {
      title: "Menyoal Konstitusionalitas Batas Usia Penyelenggara Pemilu",
      slug: "konstitusionalitas-batas-usia-penyelenggara-pemilu",
      excerpt: "Dalam sidang Mahkamah Konstitusi, Ahmad Zulfikar membacakan petitum yang meminta agar syarat usia calon anggota KPU dan Bawaslu tidak diterapkan secara kaku ketika kompetensi dapat dinilai melalui sistem merit.",
      content: `<p>Permohonan Nomor 169/PUU-XXIV/2026 menguji syarat usia minimum calon anggota KPU dan Bawaslu. Ahmad Zulfikar membacakan petitum agar ketentuan usia dapat dikesampingkan secara bersyarat bagi calon yang memiliki kualifikasi, kompetensi, integritas, kapasitas, dan pengalaman relevan berdasarkan penilaian objektif.</p><p>Berita persidangan diterbitkan oleh Mahkamah Konstitusi Republik Indonesia pada 21 Mei 2026.</p>`,
      tag: "Hukum Konstitusi", date: "21 Mei 2026", coverImage: "/ahmad/journey-court-wide.webp",
      sourceUrl: "https://www.mkri.id/berita/menyoal-konstitusionalitas-batas-usia-penyelenggara-pemilu--25093", sourceName: "Mahkamah Konstitusi RI",
    },
    {
      title: "Aksi Tolak UU Cipta Kerja pada May Day di Makassar",
      slug: "aksi-tolak-uu-cipta-kerja-may-day-makassar",
      excerpt: "Pada peringatan May Day 2023, Ahmad Zulfikar menyuarakan pencabutan UU Cipta Kerja, penghentian union busting dan kriminalisasi buruh, penindakan pelanggaran ketenagakerjaan, serta penghentian PHK sepihak.",
      content: `<p>Dalam aksi Hari Buruh Sedunia di Makassar, Ahmad Zulfikar menyampaikan empat tuntutan utama: evaluasi dan pencabutan UU Cipta Kerja, penghentian union busting dan kriminalisasi pekerja, penindakan terhadap perusahaan pelanggar aturan ketenagakerjaan, serta penghentian PHK sepihak.</p><p>Artikel lengkap diterbitkan oleh Radar Nusantara pada 3 Mei 2023.</p>`,
      tag: "Ketenagakerjaan", date: "3 Mei 2023", coverImage: "/ahmad/gallery-aksi-advokasi.webp",
      sourceUrl: "https://www.radarnusantara.com/2023/05/aksi-tolak-uu-cipta-kerja-may-day-hari.html?m=1", sourceName: "Radar Nusantara",
    },
  ];
  for (const seed of noteSeeds) {
    if (!(await storage.getNote(seed.slug))) await storage.createNote(seed);
  }

  const legacyCaptions = new Set(["Hormat", "Sejenak menoleh", "Berdiri tenang", "Jeda"]);
  for (const item of await storage.getGalleryItems()) {
    if (legacyCaptions.has(item.caption)) await storage.deleteGalleryItem(item.id);
  }
  const gallerySeeds = [
    { image: "/ahmad/portrait-standing.webp", caption: "Ruang pengabdian" },
    { image: "/ahmad/gallery-01.webp", caption: "Menyampaikan gagasan" },
    { image: "/ahmad/gallery-02.webp", caption: "Jejak perjalanan" },
    { image: "/ahmad/portrait-hmi.webp", caption: "Bersama HMI" },
    { image: "/ahmad/gallery-03.webp", caption: "Percakapan tentang arah" },
    { image: "/ahmad/gallery-04.webp", caption: "Dokumentasi kegiatan" },
  ];
  const existingImages = new Set((await storage.getGalleryItems()).map((item) => item.image));
  for (const seed of gallerySeeds) {
    if (!existingImages.has(seed.image)) await storage.createGalleryItem({ ...seed, colSpan: "col-span-1" });
  }

  const pemikiranPage = await storage.getPage("pemikiran-ide");
  if (!pemikiranPage || pemikiranPage.content.includes("hal-hal yang sedang saya pikirkan")) {
    await storage.upsertPage("pemikiran-ide", {
      title: "Gagasan untuk Organisasi yang Terus Belajar",
      content: "<p>HMI lahir untuk menjawab kebutuhan umat dan bangsa. Tugas itu tidak berubah, tetapi medan pengabdiannya terus bergerak.</p><h2>Menjaga nilai, memperbarui cara</h2><p>Nilai memberi arah. Data membantu kita memahami kenyataan. Keduanya perlu dipertemukan agar setiap keputusan organisasi tidak berhenti sebagai asumsi, melainkan menjadi ikhtiar yang dapat diperiksa dan diperbaiki.</p><blockquote>Transformasi bukan mengganti identitas organisasi. Transformasi adalah memastikan nilai yang sama tetap mampu bekerja dalam zaman yang berubah.</blockquote><h2>Perkaderan sebagai ekosistem</h2><p>Latihan formal harus terhubung dengan pendampingan, ruang karya, pengalaman profesi, dan jalur pengabdian. Dengan ekosistem itu, lima kualitas Insan Cita tidak hanya menjadi rumusan, tetapi tumbuh dalam perjalanan nyata setiap kader.</p><h2>Dari Indonesia untuk dunia</h2><p>Kader HMI harus berakar pada kebutuhan masyarakat Indonesia sekaligus siap memasuki percakapan global. Tujuannya bukan sekadar hadir, melainkan membawa pengetahuan, solusi, dan kepentingan bangsa ke panggung dunia.</p>",
    });
  }
}
