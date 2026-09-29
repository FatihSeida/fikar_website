import { pgTable, text, serial, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tataGaleri } from "./galeri";
import { JUMLAH_SOAL_INTI, JUMLAH_SOAL_LANJUTAN } from "./audit";

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  caption: text("caption").notNull(),
  colSpan: text("col_span").default("col-span-1"),
  tata: text("tata").notNull().default("lebar"),
  posisi: text("posisi"),
  gambarPenuh: text("gambar_penuh"),
  urutan: integer("urutan").notNull().default(0),
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

/** Masalah yang dikirim kader lewat formulir "Kirim Masalah Komisariatmu". */
export const masalahKomisariat = pgTable("masalah_komisariat", {
  id: serial("id").primaryKey(),
  cabang: text("cabang").notNull(),
  komisariat: text("komisariat").notNull(),
  kelompok: text("kelompok"),
  masalah: text("masalah").notNull(),
  nama: text("nama"),
  kontak: text("kontak"),
  bolehDikutip: boolean("boleh_dikutip").notNull().default(false),
  status: text("status").notNull().default("baru"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  /** Terisi bila masalah diceritakan sesudah mengerjakan kuis. */
  hasilKuisId: integer("hasil_kuis_id"),
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

/** Hasil kuis yang dikirim secara anonim. */
export const hasilKuis = pgTable("hasil_kuis", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  skor: integer("skor").notNull(),
  jawaban: text("jawaban").notNull(),
  komisariat: text("komisariat"),
  cabang: text("cabang"),
  pesertaLk1: integer("peserta_lk1"),
  aktifLk1: integer("aktif_lk1"),
  programRencana: integer("program_rencana"),
  programTerlaksana: integer("program_terlaksana"),
});

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

export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true, urutan: true }).extend({
  image: internalOrHttpsImage,
  caption: z.string().trim().min(2).max(180),
  colSpan: z.enum(["col-span-1", "col-span-2"]).nullable().optional(),
  tata: z.enum(tataGaleri).optional().default("lebar"),
  posisi: z.string().trim().max(40).regex(/^[a-z0-9% .]*$/).nullable().optional(),
  gambarPenuh: internalOrHttpsImage.nullable().optional(),
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

const teksPendek = (min: number, max: number) => z.string().trim().min(min).max(max);
const teksOpsional = (max: number) => z.string().trim().max(max).transform((value) => value || null).nullable().optional();

export const kelompokMasalahIds = ["kaderisasi", "tata-kelola", "pengetahuan", "target-program", "evaluasi-arsip", "data-jaringan"] as const;
export const statusMasalahIds = ["baru", "dibaca", "ditindaklanjuti"] as const;

export const insertMasalahSchema = z.object({
  cabang: teksPendek(2, 80),
  komisariat: teksPendek(2, 120),
  kelompok: z.enum(kelompokMasalahIds).nullable().optional(),
  masalah: teksPendek(20, 3000),
  nama: teksOpsional(80),
  kontak: teksOpsional(120),
  bolehDikutip: z.boolean().optional().default(false),
  persetujuan: z.literal(true, { error: "Persetujuan penyimpanan data diperlukan" }),
});

export const insertKunjunganSchema = z.object({
  path: z.string().trim().min(1).max(200).regex(/^\/[^\s?#]*$/),
  referrer: z.string().trim().max(500).nullable().optional(),
  sumber: z.string().trim().max(60).regex(/^[a-zA-Z0-9._-]*$/).nullable().optional(),
});

const angkaOpsional = z.number().int().min(0).max(9999).nullable().optional();

/**
 * Hasil kuis beserta angka opsional dan cerita kondisi komisariat. Cerita
 * disimpan sebagai masalah komisariat, jadi aturannya sama: komisariat dan
 * cabang wajib, begitu pula persetujuan bila ada cerita atau kontak.
 */
export const insertHasilKuisSchema = z.object({
  // 20 jawaban inti, atau 30 bila audit lanjutan (pasca-LK 2 dan LK 3) diikuti.
  jawaban: z.array(z.number().int().min(0).max(3)).refine((daftar) => daftar.length === JUMLAH_SOAL_INTI || daftar.length === JUMLAH_SOAL_INTI + JUMLAH_SOAL_LANJUTAN, "Jumlah jawaban kuis tidak sesuai"),
  komisariat: teksOpsional(120),
  cabang: teksOpsional(80),
  pesertaLk1: angkaOpsional,
  aktifLk1: angkaOpsional,
  programRencana: angkaOpsional,
  programTerlaksana: angkaOpsional,
  cerita: teksOpsional(3000),
  nama: teksOpsional(80),
  kontak: teksOpsional(120),
  bolehDikutip: z.boolean().optional().default(false),
  persetujuan: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const galat = (message: string) => ctx.addIssue({ code: "custom", message });
  const ada = (nilai: number | null | undefined) => nilai !== null && nilai !== undefined;
  if (ada(data.pesertaLk1) !== ada(data.aktifLk1)) galat("Isi jumlah peserta LK 1 dan yang masih aktif bersamaan");
  if (ada(data.pesertaLk1) && ada(data.aktifLk1) && data.aktifLk1! > data.pesertaLk1!) galat("Kader yang masih aktif tidak bisa lebih banyak dari peserta LK 1");
  if (ada(data.programRencana) !== ada(data.programTerlaksana)) galat("Isi jumlah program yang direncanakan dan yang terlaksana bersamaan");
  if (ada(data.programRencana) && ada(data.programTerlaksana) && data.programTerlaksana! > data.programRencana!) galat("Program yang terlaksana tidak bisa lebih banyak dari yang direncanakan");
  if (data.cerita) {
    if (data.cerita.length < 20) galat("Ceritakan kondisi komisariatmu minimal 20 karakter");
    if (!data.komisariat || !data.cabang) galat("Isi nama komisariat dan cabang supaya ceritamu bisa ditindaklanjuti");
  }
  if ((data.cerita || data.nama || data.kontak) && data.persetujuan !== true) galat("Persetujuan penyimpanan data diperlukan");
});

export type MasalahKomisariat = typeof masalahKomisariat.$inferSelect;
export type InsertMasalah = Omit<z.infer<typeof insertMasalahSchema>, "persetujuan"> & { hasilKuisId?: number | null };
export type Kunjungan = typeof kunjungan.$inferSelect;
export type InsertKunjungan = typeof kunjungan.$inferInsert;
export type HasilKuis = typeof hasilKuis.$inferSelect;
export type InsertHasilKuis = Omit<typeof hasilKuis.$inferInsert, "id" | "createdAt">;

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
export type InsertGalleryItem = z.input<typeof insertGallerySchema> & { urutan?: number };
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
