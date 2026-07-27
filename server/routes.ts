import express, { type Express } from "express";
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

const uploadDir = path.join(process.cwd(), "uploads");
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

  app.use("/uploads", express.static(uploadDir));

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingNotes = await storage.getNotes();
  if (existingNotes.length === 0) {
    await storage.createNote({
      title: "Dari Kalteng ke Panggung Dunia: Wakili Indonesia di OIC Youth Capital 2026",
      slug: "oic-youth-capital-2026-konya",
      excerpt: "Hadir di pembukaan resmi Konya OIC Youth Capital 2026, Turki, mewakili Indonesia dan Kalimantan Tengah.",
      content:
        "<p>Indonesia turut hadir dalam pembukaan resmi Konya OIC Youth Capital 2026 di Turki, 9–12 Mei 2026. Forum ini mempertemukan perwakilan pemuda dari negara-negara anggota Organisasi Kerja Sama Islam.</p><p>Dalam kegiatan tersebut saya mewakili Kementerian Pemuda dan Olahraga sekaligus membawa nama Kalimantan Tengah, memperkenalkan identitas budaya Indonesia kepada delegasi negara lain.</p>",
      tag: "Aktivitas",
      date: "Mei 2026",
      coverImage: "/liputan/oic-youth-capital.webp",
      sourceUrl: "https://intimnews.com/dari-kalteng-ke-panggung-dunia-ghina-muslimah-wakili-indonesia-di-oic-youth-capital-2026-turki/",
      sourceName: "Intim News",
    });

    await storage.createNote({
      title: "UMKM sebagai Fondasi Masa Depan",
      slug: "umkm-sebagai-fondasi-masa-depan",
      excerpt: "Catatan tentang pandangan Teguh Anantawikrama yang menempatkan UMKM sebagai fondasi ekonomi Indonesia.",
      content:
        "<p>Catatan tentang pandangan Teguh Anantawikrama yang menempatkan UMKM sebagai fondasi ekonomi Indonesia ke depan.</p><p>Yang menarik dari pendekatannya adalah upaya menyeimbangkan kepentingan bisnis dengan pemerataan sosial, serta kesediaannya melibatkan generasi muda dalam prosesnya.</p>",
      tag: "Liputan",
      date: "Desember 2025",
      coverImage: "/liputan/umkm-fondasi.webp",
      sourceUrl: "https://www.amaspersadanews.com/2025/12/ketua-bidang-di-pb-hmi-nur-ghina.html",
      sourceName: "Amas Persada News",
    });

    await storage.createNote({
      title: "Evaluasi Pelayanan Kepemudaan di Kemenpora",
      slug: "evaluasi-pelayanan-kepemudaan",
      excerpt: "PB HMI menilai pelayanan kepemudaan berjalan lambat dan menuntut evaluasi terhadap Deputi I.",
      content:
        "<p>PB HMI menilai pelayanan kepemudaan di Kementerian Pemuda dan Olahraga berjalan lambat dan menuntut evaluasi terhadap Deputi I.</p><p>Persoalannya bukan sekadar satu program yang tersendat, melainkan kelemahan pelayanan yang sudah berlangsung terlalu lama.</p>",
      tag: "Liputan",
      date: "Desember 2025",
      coverImage: null,
      sourceUrl: "https://kumparan.com/berita-sampit/kinerja-dinilai-buruk-pb-hmi-tuntut-deputi-i-kemenpora-dicopot-26NijjExF32",
      sourceName: "Kumparan",
    });

    await storage.createNote({
      title: "Apresiasi Kepemimpinan Menteri Pariwisata",
      slug: "apresiasi-kepemimpinan-menteri-pariwisata",
      excerpt: "Catatan atas arah kepemimpinan Menteri Widiyanti Putri Wardhana, khususnya pada pemberdayaan pemuda.",
      content:
        "<p>Bidang Pariwisata dan Ekonomi Kreatif PB HMI menyampaikan apresiasi atas arah kepemimpinan Menteri Pariwisata Widiyanti Putri Wardhana, khususnya pada perhatian terhadap pemberdayaan pemuda di sektor pariwisata.</p>",
      tag: "Liputan",
      date: "Oktober 2025",
      coverImage: null,
      sourceUrl: "https://mediumnews.id/bidang-pariwisata-pb-hmi-apresiasi-kepemimpinan-menteri-widiyanti-dorong-kemajuan-pariwisata-dan-pemberdayaan-pemuda/",
      sourceName: "Mediumnews.id",
    });

    await storage.createNote({
      title: "Delapan Dekade Indonesia: Pariwisata sebagai Pilar Kesejahteraan",
      slug: "pariwisata-pilar-kesejahteraan",
      excerpt: "Sektor pariwisata dan ekonomi kreatif layak diperlakukan sebagai pilar kesejahteraan, bukan pelengkap.",
      content:
        "<p>Memasuki delapan dekade kemerdekaan, sektor pariwisata dan ekonomi kreatif layak diperlakukan sebagai pilar kesejahteraan rakyat — bukan pelengkap.</p><p>Bidang Pariwisata dan Ekonomi Kreatif PB HMI mendorong inovasi anak muda dan penguatan potensi lokal sebagai jalan menuju daya saing yang lebih baik.</p>",
      tag: "Liputan",
      date: "Agustus 2025",
      coverImage: "/liputan/dirgahayu-80.webp",
      sourceUrl: "https://www.indonesiafolks.com/kabar-indonesia/86915744818/berusia-delapan-dekade-indonesia-pb-hmi-menjadikan-sektor-pariwisata-dan-ekonomi-kreatif-sebagai-pilar-penting-dalam-mewujudkan-kesejahteraan-rakyat",
      sourceName: "Indonesia Folks",
    });

    await storage.createNote({
      title: "Mitigasi Bencana di Destinasi Wisata Alam",
      slug: "mitigasi-destinasi-wisata-alam",
      excerpt: "Letusan Gunung Lewotobi sebagai momentum evaluasi keselamatan destinasi wisata alam.",
      content:
        "<p>Letusan Gunung Lewotobi di Flores Timur menjadi pengingat bahwa banyak destinasi wisata alam Indonesia berdiri di kawasan rawan bencana.</p><p>Sistem tanggap bencana perlu benar-benar terintegrasi di destinasi-destinasi itu. Mahasiswa dan komunitas pemuda punya ruang untuk terlibat dalam advokasi keselamatan wisata dan mendorong gerakan wisata tangguh bencana.</p>",
      tag: "Liputan",
      date: "Juni 2025",
      coverImage: "/liputan/mitigasi-wisata.webp",
      sourceUrl: "https://www.indonesiafolks.com/kabar-indonesia/86915374502/ketua-bidang-pariwisata-pb-hmi-letusan-gunung-lewotobi-momentum-evaluasi-dan-penguatan-mitigasi-di-destinasi-wisata-alam",
      sourceName: "Indonesia Folks",
    });

    await storage.createNote({
      title: "Pengaruh Tarif Pajak Efektif dan Profitabilitas terhadap Manajemen Perpajakan",
      slug: "tarif-pajak-efektif-manajemen-perpajakan",
      excerpt: "Kajian pustaka yang dimuat di Jurnal Manajemen, Akuntansi dan Logistik (JUMATI).",
      content:
        "<p>Kajian pustaka mengenai pengaruh tarif pajak efektif dan profitabilitas terhadap manajemen perpajakan.</p><p>Tulisan ini merangkum temuan penelitian terdahulu untuk menyusun hipotesis yang dapat diuji secara empiris, dan menyimpulkan bahwa keduanya berpengaruh terhadap strategi manajemen perpajakan perusahaan.</p><p>Dimuat di Jurnal Manajemen, Akuntansi dan Logistik (JUMATI) Vol. 1 No. 4.</p>",
      tag: "Publikasi",
      date: "2023",
      coverImage: null,
      sourceUrl: "https://ciptakind-publisher.com/jumati/index.php/ojs/article/view/97",
      sourceName: "JUMATI",
    });

    await storage.createNote({
      title: "Peranan Perempuan terhadap Penerapan Civil Society menurut Perspektif Islam",
      slug: "peranan-perempuan-civil-society",
      excerpt: "Tulisan tentang hak dan tanggung jawab sosial perempuan dalam membangun masyarakat madani.",
      content:
        "<p>Tulisan tentang peranan perempuan dalam penerapan civil society menurut perspektif Islam.</p><p>Perempuan memiliki hak sekaligus tanggung jawab sosial sebagai anggota masyarakat, dan terbuka ruang untuk berperan di ranah publik sepanjang memiliki kompetensi yang relevan.</p>",
      tag: "Publikasi",
      date: "HMI Cabang Palangka Raya",
      coverImage: null,
      sourceUrl: "https://www.scribd.com/document/618359209/ARTIKEL-PERANAN-PEREMPUAN-TERHADAP-PENERAPAN-CIVIL-SOCIETY-MENURUT-PRESFEKTIF-ISLAM-NUR-GHINA-MUSLIMAH-CABANG-PALANGKA-RAYA",
      sourceName: "Scribd",
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
