import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  tag: text("tag").notNull(),
  date: text("date").notNull(), // Display string for flexibility
  isFeatured: boolean("is_featured").default(false),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  headline: text("headline").notNull(),
  date: text("date").notNull(),
  url: text("url").notNull(),
  order: serial("order").notNull(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  caption: text("caption").notNull(),
  colSpan: text("col_span").default("col-span-1"), // For grid layout control
});

// Schemas
export const insertArticleSchema = createInsertSchema(articles);
export const insertNewsSchema = createInsertSchema(news);
export const insertGallerySchema = createInsertSchema(gallery);

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type News = typeof news.$inferSelect;
export type GalleryItem = typeof gallery.$inferSelect;
