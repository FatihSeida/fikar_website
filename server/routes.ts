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
      title: "The Art of Simplicity",
      slug: "art-of-simplicity",
      excerpt: "Why less is more in modern design and development.",
      content: "Full content here...",
      tag: "DESIGN",
      date: "OCT 2023",
      isFeatured: true,
    });
    await storage.createArticle({
      title: "Building for the Future",
      slug: "building-future",
      excerpt: "Technologies that will shape the next decade.",
      content: "Full content here...",
      tag: "TECH",
      date: "SEP 2023",
      isFeatured: false,
    });
    await storage.createArticle({
      title: "Sustainable Architecture",
      slug: "sustainable-architecture",
      excerpt: "How we can build better homes for everyone.",
      content: "Full content here...",
      tag: "ARCH",
      date: "AUG 2023",
      isFeatured: false,
    });
  }

  const existingNews = await storage.getNews();
  if (existingNews.length === 0) {
    await storage.createNews({
      source: "TechCrunch",
      headline: "Ahmad Zulfikar launches new design studio",
      date: "2 DAYS AGO",
      url: "#",
      order: 1,
    });
    await storage.createNews({
      source: "Architectural Digest",
      headline: "Top 10 minimalists to watch in 2024",
      date: "1 WEEK AGO",
      url: "#",
      order: 2,
    });
    await storage.createNews({
      source: "The Verge",
      headline: "Interview: The future of digital interfaces",
      date: "2 WEEKS AGO",
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
        caption: `Project ${i} - 2023`,
        colSpan: i === 1 ? "col-span-5 row-span-2" : "col-span-3", // Simplified logic, frontend handles classes better
      });
    }
  }
}
