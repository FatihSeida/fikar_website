import { pgTable, text, serial, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  caption: text("caption").notNull(),
  colSpan: text("col_span").default("col-span-1"),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  tag: text("tag").notNull(),
  date: text("date").notNull(),
  coverImage: text("cover_image"),
  sourceUrl: text("source_url"),
  sourceName: text("source_name"),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

/**
 * Satu baris per halaman yang dibuka. Alamat IP tidak pernah disimpan: kota
 * diturunkan saat permintaan masuk, dan `pengunjung` adalah hash yang garamnya
 * berganti setiap hari sehingga tidak bisa dipakai melacak orang lintas hari.
 */
export const kunjungan = pgTable("kunjungan", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  path: text("path").notNull(),
  referrer: text("referrer"),
  sumber: text("sumber"),
  kota: text("kota"),
  provinsi: text("provinsi"),
  perangkat: text("perangkat").notNull(),
  pengunjung: text("pengunjung").notNull(),
}, (table) => [index("kunjungan_created_at_idx").on(table.createdAt)]);

const internalOrHttpsImage = z.string().trim().min(1).max(2048).refine((value) => {
  if (/^\/(?:uploads|ahmad|galeri|scrollytelling|liputan)\/[a-zA-Z0-9._/-]+$/.test(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "Gambar harus memakai jalur internal yang valid atau URL HTTPS");

const optionalHttpsUrl = z.string().trim().max(2048).refine((value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "Tautan harus berupa URL HTTPS").nullable().optional();

export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true }).extend({
  image: internalOrHttpsImage,
  caption: z.string().trim().min(2).max(180),
  colSpan: z.enum(["col-span-1", "col-span-2"]).nullable().optional(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({ id: true }).extend({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().min(20).max(200_000),
  tag: z.string().trim().min(2).max(40),
  date: z.string().trim().min(2).max(40),
  coverImage: internalOrHttpsImage.nullable().optional(),
  sourceUrl: optionalHttpsUrl,
  sourceName: z.string().trim().max(100).nullable().optional(),
});

export const insertPageSchema = createInsertSchema(pages).omit({ id: true }).extend({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(3).max(180),
  content: z.string().min(20).max(200_000),
});

export const insertKunjunganSchema = z.object({
  path: z.string().trim().min(1).max(200).regex(/^\/[^\s?#]*$/),
  referrer: z.string().trim().max(500).nullable().optional(),
  sumber: z.string().trim().max(60).regex(/^[a-zA-Z0-9._-]*$/).nullable().optional(),
});

export type Kunjungan = typeof kunjungan.$inferSelect;
export type InsertKunjungan = typeof kunjungan.$inferInsert;

export interface JumlahBerlabel { nama: string; jumlah: number; }

export interface StatistikKunjungan {
  hari: number;
  total: { kunjungan: number; pengunjung: number };
  perHari: { tanggal: string; kunjungan: number; pengunjung: number }[];
  kota: (JumlahBerlabel & { provinsi: string })[];
  provinsi: JumlahBerlabel[];
  halaman: JumlahBerlabel[];
  sumber: JumlahBerlabel[];
  perangkat: JumlahBerlabel[];
}

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGallerySchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
