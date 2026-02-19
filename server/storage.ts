import { db } from "./db";
import { articles, news, gallery, type Article, type InsertArticle, type News, type InsertNews, type GalleryItem, type InsertGalleryItem } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | undefined>;
  getNews(): Promise<News[]>;
  getGalleryItems(): Promise<GalleryItem[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  createNews(newsItem: InsertNews): Promise<News>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
}

export class DatabaseStorage implements IStorage {
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(gallery);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const [item] = await db.insert(gallery).values(insertItem).returning();
    return item;
  }
}

export const storage = new DatabaseStorage();
