import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertGallerySchema, insertNoteSchema, insertPageSchema } from "@shared/schema";
import { z } from "zod";
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
    ALLOWED_ATTR: ["src", "alt", "class", "style", "width", "height"],
  });
}

const uploadDir = path.join(process.cwd(), "client", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: multerStorage, limits: { fileSize: 10 * 1024 * 1024 } });

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function requireAdmin(req: any, res: any, next: any) {
  if (req.session?.isAdmin) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Admin Auth ---
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Password salah" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
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
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const item = await storage.createGalleryItem(parsed.data);
    res.json(item);
  });

  app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
    await storage.deleteGalleryItem(Number(req.params.id));
    res.json({ success: true });
  });

  // --- Notes (Catatan & Aktivitas) ---
  app.get("/api/notes", async (_req, res) => {
    const items = await storage.getNotes();
    res.json(items);
  });

  app.get("/api/notes/:slug", async (req, res) => {
    const note = await storage.getNote(req.params.slug);
    if (!note) return res.status(404).json({ message: "Catatan tidak ditemukan" });
    res.json(note);
  });

  app.post("/api/notes", requireAdmin, async (req, res) => {
    const parsed = insertNoteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const data = { ...parsed.data, content: sanitizeHtml(parsed.data.content) };
    const note = await storage.createNote(data);
    res.json(note);
  });

  app.put("/api/notes/:id", requireAdmin, async (req, res) => {
    const parsed = insertNoteSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const data = parsed.data.content ? { ...parsed.data, content: sanitizeHtml(parsed.data.content) } : parsed.data;
    const note = await storage.updateNote(Number(req.params.id), data);
    res.json(note);
  });

  app.delete("/api/notes/:id", requireAdmin, async (req, res) => {
    await storage.deleteNote(Number(req.params.id));
    res.json({ success: true });
  });

  // --- Pages (static pages like Pemikiran & Ide) ---
  app.get("/api/pages/:slug", async (req, res) => {
    const page = await storage.getPage(req.params.slug);
    if (!page) return res.status(404).json({ message: "Halaman tidak ditemukan" });
    res.json(page);
  });

  app.put("/api/pages/:slug", requireAdmin, async (req, res) => {
    const pageSchema = z.object({ title: z.string().min(1), content: z.string().min(1) });
    const parsed = pageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const data = { ...parsed.data, content: sanitizeHtml(parsed.data.content) };
    const page = await storage.upsertPage(req.params.slug, data);
    res.json(page);
  });

  // --- File Upload ---
  app.post("/api/upload", requireAdmin, upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingNotes = await storage.getNotes();
  if (existingNotes.length === 0) {
    await storage.createNote({
      title: "Seni Kesederhanaan",
      slug: "seni-kesederhanaan",
      excerpt: "Mengapa lebih sedikit berarti lebih banyak dalam desain dan pengembangan modern.",
      content: "Dalam dunia yang semakin kompleks, kesederhanaan menjadi seni tersendiri. Setiap elemen yang kita hapus memberi ruang bagi yang tersisa untuk bersinar lebih terang.\n\nDesain minimalis bukan berarti kosong atau hampa, melainkan sebuah pilihan sadar untuk menyaring esensi dari setiap karya. Ketika kita menghilangkan yang tidak perlu, kita memberi penekanan pada apa yang benar-benar penting.",
      tag: "DESAIN",
      date: "OKT 2023",
      coverImage: null,
    });
    await storage.createNote({
      title: "Membangun untuk Masa Depan",
      slug: "membangun-masa-depan",
      excerpt: "Teknologi yang akan membentuk dekade berikutnya.",
      content: "Teknologi berkembang dengan kecepatan yang belum pernah terjadi sebelumnya. Sebagai pengembang dan desainer, kita harus selalu siap beradaptasi.\n\nDari kecerdasan buatan hingga web3, setiap inovasi membawa peluang dan tantangan baru. Yang penting adalah bagaimana kita memanfaatkan teknologi ini untuk menciptakan pengalaman yang lebih baik bagi pengguna.",
      tag: "TEKNOLOGI",
      date: "SEP 2023",
      coverImage: null,
    });
    await storage.createNote({
      title: "Arsitektur Berkelanjutan",
      slug: "arsitektur-berkelanjutan",
      excerpt: "Bagaimana kita bisa membangun rumah yang lebih baik untuk semua orang.",
      content: "Arsitektur berkelanjutan bukan hanya tren, melainkan kebutuhan mendesak. Bangunan yang kita ciptakan hari ini akan menentukan kualitas hidup generasi mendatang.\n\nDengan menggunakan material ramah lingkungan dan desain yang efisien energi, kita bisa menciptakan ruang yang indah sekaligus bertanggung jawab terhadap lingkungan.",
      tag: "ARSITEKTUR",
      date: "AGU 2023",
      coverImage: null,
    });
  }

  const existingGallery = await storage.getGalleryItems();
  if (existingGallery.length === 0) {
    const gallerySeeds = [
      { image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80", caption: "Proyek Digital 1" },
      { image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", caption: "Proyek Digital 2" },
      { image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80", caption: "Proyek Koding" },
      { image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", caption: "Ruang Kerja" },
      { image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", caption: "Proyek Frontend" },
      { image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", caption: "Desain UI" },
    ];
    for (const seed of gallerySeeds) {
      await storage.createGalleryItem({ image: seed.image, caption: seed.caption, colSpan: "col-span-1" });
    }
  }

  const pemikiranPage = await storage.getPage("pemikiran-ide");
  if (!pemikiranPage) {
    await storage.upsertPage("pemikiran-ide", {
      title: "Pemikiran & Ide",
      content: "Halaman ini berisi pemikiran dan ide saya tentang desain, teknologi, dan kehidupan. Konten ini bersifat statis dan akan diperbarui secara berkala.\n\nSaya percaya bahwa desain yang baik adalah desain yang tidak terlihat — yang secara alami membimbing pengguna menuju tujuan mereka tanpa hambatan.\n\nTeknologi seharusnya melayani manusia, bukan sebaliknya. Setiap baris kode yang kita tulis, setiap piksel yang kita tempatkan, harus memiliki tujuan yang jelas."
    });
  }
}
