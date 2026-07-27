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
      title: "Menulis sebagai Cara Mendengar",
      slug: "menulis-sebagai-cara-mendengar",
      excerpt:
        "Kenapa saya menuliskan kembali apa yang saya dengar, bukan langsung menanggapinya.",
      content:
        "<p>Menulis bukan cara saya bicara, melainkan cara saya mendengar dengan lebih pelan. Ada jarak yang muncul antara mendengar dan menuliskan, dan di jarak itulah biasanya saya menemukan apa yang sebenarnya sedang dikatakan orang lain.</p><p>Karena itu catatan-catatan di sini jarang berupa kesimpulan. Sebagian besar hanya rekaman dari proses yang belum selesai.</p>",
      tag: "Catatan",
      date: "Juli 2026",
      coverImage: null,
    });

    await storage.createNote({
      title: "Belajar di Kota yang Tidak Terburu-buru",
      slug: "belajar-di-kota-yang-tidak-terburu-buru",
      excerpt: "Catatan singkat dari hari-hari menempuh studi di Konya.",
      content:
        "<p>Konya mengajarkan satu hal yang tidak saya dapat dari tempat lain: bahwa kecepatan bukan ukuran kesungguhan. Kota ini bergerak pelan, dan lama-lama saya ikut menyesuaikan diri.</p><p>Banyak hal yang dulu terasa mendesak ternyata bisa menunggu. Sebagian bahkan hilang sendiri ketika tidak buru-buru ditanggapi.</p>",
      tag: "Aktivitas",
      date: "Juni 2026",
      coverImage: null,
    });

    await storage.createNote({
      title: "Organisasi dan Kesabaran",
      slug: "organisasi-dan-kesabaran",
      excerpt: "Tentang bekerja bersama orang yang tidak selalu sependapat.",
      content:
        "<p>Bekerja di organisasi mengajarkan bahwa keputusan paling baik jarang datang dari orang yang paling cepat bicara. Ia biasanya muncul setelah semua orang selesai didengarkan.</p><p>Kesabaran, dalam konteks itu, bukan sifat pasif. Ia kerja yang menuntut perhatian penuh.</p>",
      tag: "Pemikiran",
      date: "Mei 2026",
      coverImage: null,
    });
  }

  const existingGallery = await storage.getGalleryItems();
  if (existingGallery.length === 0) {
    const gallerySeeds = [
      { image: "/galeri/galeri-01.webp", caption: "Hormat" },
      { image: "/galeri/galeri-02.webp", caption: "Sejenak menoleh" },
      { image: "/galeri/galeri-03.webp", caption: "Berdiri tenang" },
      { image: "/galeri/galeri-04.webp", caption: "Jeda" },
    ];
    for (const seed of gallerySeeds) {
      await storage.createGalleryItem({
        image: seed.image,
        caption: seed.caption,
        colSpan: "col-span-1",
      });
    }
  }

  const pemikiranPage = await storage.getPage("pemikiran-ide");
  if (!pemikiranPage) {
    await storage.upsertPage("pemikiran-ide", {
      title: "Pemikiran & Ide",
      content:
        "<p>Halaman ini berisi hal-hal yang sedang saya pikirkan — sebagian sudah matang, sebagian besar belum.</p><p>Saya percaya bahwa gagasan yang baik tidak perlu diucapkan dengan keras. Ia cukup diletakkan dengan jelas, lalu dibiarkan bekerja pada orang yang membacanya.</p><p>Isi halaman ini akan berubah dari waktu ke waktu.</p>",
    });
  }
}
