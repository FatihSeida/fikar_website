import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.articles.list.path, async (req, res) => {
    const articles = await storage.getArticles();
    res.json(articles);
  });

  app.get(api.articles.get.path, async (req, res) => {
    const article = await storage.getArticle(req.params.slug);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  });

  app.get(api.news.list.path, async (req, res) => {
    const news = await storage.getNews();
    res.json(news);
  });

  app.get(api.gallery.list.path, async (req, res) => {
    const gallery = await storage.getGalleryItems();
    res.json(gallery);
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingArticles = await storage.getArticles();
  if (existingArticles.length === 0) {
    await storage.createArticle({
      title: "Seni Kesederhanaan",
      slug: "seni-kesederhanaan",
      excerpt: "Mengapa lebih sedikit berarti lebih banyak dalam desain dan pengembangan modern.",
      content: "Konten lengkap di sini...",
      tag: "DESAIN",
      date: "OKT 2023",
      isFeatured: true,
    });
    await storage.createArticle({
      title: "Membangun untuk Masa Depan",
      slug: "membangun-masa-depan",
      excerpt: "Teknologi yang akan membentuk dekade berikutnya.",
      content: "Konten lengkap di sini...",
      tag: "TEKNOLOGI",
      date: "SEP 2023",
      isFeatured: false,
    });
    await storage.createArticle({
      title: "Arsitektur Berkelanjutan",
      slug: "arsitektur-berkelanjutan",
      excerpt: "Bagaimana kita bisa membangun rumah yang lebih baik untuk semua orang.",
      content: "Konten lengkap di sini...",
      tag: "ARSITEKTUR",
      date: "AGU 2023",
      isFeatured: false,
    });
  }

  const existingNews = await storage.getNews();
  if (existingNews.length === 0) {
    await storage.createNews({
      source: "TechCrunch",
      headline: "Ahmad Zulfikar meluncurkan studio desain baru",
      date: "2 HARI LALU",
      url: "#",
      order: 1,
    });
    await storage.createNews({
      source: "Architectural Digest",
      headline: "10 minimalis teratas yang patut diperhatikan di tahun 2024",
      date: "1 MINGGU LALU",
      url: "#",
      order: 2,
    });
    await storage.createNews({
      source: "The Verge",
      headline: "Wawancara: Masa depan antarmuka digital",
      date: "2 MINGGU LALU",
      url: "#",
      order: 3,
    });
  }

  const existingGallery = await storage.getGalleryItems();
  if (existingGallery.length === 0) {
    // Generate placeholder gallery items based on grid layout
    for (let i = 1; i <= 8; i++) {
      await storage.createGalleryItem({
        image: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=80`, // Placeholder
        caption: `Proyek ${i} - 2023`,
        colSpan: i === 1 ? "col-span-5 row-span-2" : "col-span-3", // Simplified logic, frontend handles classes better
      });
    }
  }
}
