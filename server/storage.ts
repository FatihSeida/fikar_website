import { db } from "./db";
import { gallery, notes, pages, type GalleryItem, type InsertGalleryItem, type Note, type InsertNote, type Page, type InsertPage } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;

  getNotes(): Promise<Note[]>;
  getNote(slug: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number): Promise<void>;

  getPage(slug: string): Promise<Page | undefined>;
  upsertPage(slug: string, data: { title: string; content: string }): Promise<Page>;
}

export class DatabaseStorage implements IStorage {
  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(gallery);
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const [item] = await db.insert(gallery).values(insertItem).returning();
    return item;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(gallery).where(eq(gallery.id, id));
  }

  async getNotes(): Promise<Note[]> {
    return await db.select().from(notes);
  }

  async getNote(slug: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.slug, slug));
    return note;
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db.insert(notes).values(insertNote).returning();
    return note;
  }

  async updateNote(id: number, data: Partial<InsertNote>): Promise<Note> {
    const [note] = await db.update(notes).set(data).where(eq(notes.id, id)).returning();
    return note;
  }

  async deleteNote(id: number): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  async getPage(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async upsertPage(slug: string, data: { title: string; content: string }): Promise<Page> {
    const existing = await this.getPage(slug);
    if (existing) {
      const [page] = await db.update(pages).set(data).where(eq(pages.slug, slug)).returning();
      return page;
    }
    const [page] = await db.insert(pages).values({ slug, ...data }).returning();
    return page;
  }
}

export const storage = new DatabaseStorage();
