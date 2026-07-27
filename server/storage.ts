import { db, type Db } from "./db";
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
  constructor(private readonly db: Db) {}

  async getGalleryItems(): Promise<GalleryItem[]> {
    return await this.db.select().from(gallery);
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const [item] = await this.db.insert(gallery).values(insertItem).returning();
    return item;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await this.db.delete(gallery).where(eq(gallery.id, id));
  }

  async getNotes(): Promise<Note[]> {
    return await this.db.select().from(notes);
  }

  async getNote(slug: string): Promise<Note | undefined> {
    const [note] = await this.db.select().from(notes).where(eq(notes.slug, slug));
    return note;
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await this.db.insert(notes).values(insertNote).returning();
    return note;
  }

  async updateNote(id: number, data: Partial<InsertNote>): Promise<Note> {
    const [note] = await this.db.update(notes).set(data).where(eq(notes.id, id)).returning();
    return note;
  }

  async deleteNote(id: number): Promise<void> {
    await this.db.delete(notes).where(eq(notes.id, id));
  }

  async getPage(slug: string): Promise<Page | undefined> {
    const [page] = await this.db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async upsertPage(slug: string, data: { title: string; content: string }): Promise<Page> {
    const existing = await this.getPage(slug);
    if (existing) {
      const [page] = await this.db.update(pages).set(data).where(eq(pages.slug, slug)).returning();
      return page;
    }
    const [page] = await this.db.insert(pages).values({ slug, ...data }).returning();
    return page;
  }
}

/**
 * Penyimpanan dalam memori untuk pengembangan tanpa PostgreSQL. Isinya hilang
 * setiap server dimatikan; seed di ./routes mengisinya kembali saat boot.
 *
 * Tidak pernah dipakai di produksi — ./env menggagalkan boot produksi bila
 * DATABASE_URL tidak diatur.
 */
export class MemStorage implements IStorage {
  private galleryItems: GalleryItem[] = [];
  private noteItems: Note[] = [];
  private pageItems: Page[] = [];
  private idBerikutnya = 1;

  private id(): number {
    return this.idBerikutnya++;
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    return [...this.galleryItems];
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const item: GalleryItem = {
      id: this.id(),
      image: insertItem.image,
      caption: insertItem.caption,
      colSpan: insertItem.colSpan ?? "col-span-1",
    };
    this.galleryItems.push(item);
    return item;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    this.galleryItems = this.galleryItems.filter((item) => item.id !== id);
  }

  async getNotes(): Promise<Note[]> {
    return [...this.noteItems];
  }

  async getNote(slug: string): Promise<Note | undefined> {
    return this.noteItems.find((note) => note.slug === slug);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const note: Note = {
      id: this.id(),
      title: insertNote.title,
      slug: insertNote.slug,
      excerpt: insertNote.excerpt,
      content: insertNote.content,
      tag: insertNote.tag,
      date: insertNote.date,
      coverImage: insertNote.coverImage ?? null,
    };
    this.noteItems.push(note);
    return note;
  }

  async updateNote(id: number, data: Partial<InsertNote>): Promise<Note> {
    const indeks = this.noteItems.findIndex((note) => note.id === id);
    if (indeks === -1) {
      throw new Error(`Catatan dengan id ${id} tidak ditemukan`);
    }
    this.noteItems[indeks] = { ...this.noteItems[indeks], ...data };
    return this.noteItems[indeks];
  }

  async deleteNote(id: number): Promise<void> {
    this.noteItems = this.noteItems.filter((note) => note.id !== id);
  }

  async getPage(slug: string): Promise<Page | undefined> {
    return this.pageItems.find((page) => page.slug === slug);
  }

  async upsertPage(slug: string, data: { title: string; content: string }): Promise<Page> {
    const indeks = this.pageItems.findIndex((page) => page.slug === slug);
    if (indeks !== -1) {
      this.pageItems[indeks] = { ...this.pageItems[indeks], ...data };
      return this.pageItems[indeks];
    }
    const page: Page = { id: this.id(), slug, ...data };
    this.pageItems.push(page);
    return page;
  }
}

export const storage: IStorage = db ? new DatabaseStorage(db) : new MemStorage();
