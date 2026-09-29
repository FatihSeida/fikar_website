import { db, type Db } from "./db";
import {
  gallery, notes, pages, kunjungan,
  type GalleryItem, type InsertGalleryItem, type Note, type InsertNote, type Page, type InsertPage,
  type InsertKunjungan, type Kunjungan, type StatistikKunjungan, type JumlahBerlabel,
} from "@shared/schema";
import { asc, eq, gte, sql } from "drizzle-orm";

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

  recordKunjungan(data: InsertKunjungan): Promise<void>;
  getStatistikKunjungan(hari: number): Promise<StatistikKunjungan>;
}

const BATAS_DAFTAR = 15;
// Ditulis sebagai literal SQL, bukan parameter: ekspresi tanggal di SELECT dan
// GROUP BY harus identik, dan setiap parameter terikat dianggap berbeda oleh Postgres.
const zonaWaktu = sql.raw("'Asia/Jakarta'");
const SATU_HARI = 24 * 60 * 60 * 1000;

function awalRentang(hari: number): Date {
  return new Date(Date.now() - hari * SATU_HARI);
}

/** Tanggal WIB (UTC+7) dalam format YYYY-MM-DD. */
function tanggalWib(waktu: Date): string {
  return new Date(waktu.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Daftar tanggal lengkap supaya hari tanpa kunjungan tetap tampil sebagai nol. */
function deretTanggal(hari: number): string[] {
  const hasil: string[] = [];
  for (let i = hari - 1; i >= 0; i--) hasil.push(tanggalWib(new Date(Date.now() - i * SATU_HARI)));
  return hasil;
}

/** Ringkasan kunjungan dari baris mentah; dipakai penyimpanan memori. */
function ringkasKunjungan(baris: Kunjungan[], hari: number): StatistikKunjungan {
  const unik = (daftar: Kunjungan[]) => new Set(daftar.map((item) => `${tanggalWib(item.createdAt)}|${item.pengunjung}`)).size;
  const kelompokkan = (kunci: (item: Kunjungan) => string | null, pakaiUnik: boolean): JumlahBerlabel[] => {
    const peta = new Map<string, Kunjungan[]>();
    for (const item of baris) {
      const nama = kunci(item);
      if (nama) peta.set(nama, [...(peta.get(nama) ?? []), item]);
    }
    return Array.from(peta, ([nama, daftar]) => ({ nama, jumlah: pakaiUnik ? unik(daftar) : daftar.length }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, BATAS_DAFTAR);
  };
  const perTanggal = new Map<string, Kunjungan[]>();
  for (const item of baris) {
    const tanggal = tanggalWib(item.createdAt);
    perTanggal.set(tanggal, [...(perTanggal.get(tanggal) ?? []), item]);
  }
  const provinsiKota = new Map(baris.filter((item) => item.kota).map((item) => [item.kota as string, item.provinsi ?? ""]));
  return {
    hari,
    total: { kunjungan: baris.length, pengunjung: unik(baris) },
    perHari: deretTanggal(hari).map((tanggal) => {
      const daftar = perTanggal.get(tanggal) ?? [];
      return { tanggal, kunjungan: daftar.length, pengunjung: unik(daftar) };
    }),
    kota: kelompokkan((item) => item.kota, true).map((item) => ({ ...item, provinsi: provinsiKota.get(item.nama) ?? "" })),
    provinsi: kelompokkan((item) => item.provinsi, true),
    halaman: kelompokkan((item) => item.path, false),
    sumber: kelompokkan((item) => item.sumber, true),
    perangkat: kelompokkan((item) => item.perangkat, true),
  };
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
    return await this.db.select().from(notes).orderBy(asc(notes.id));
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

  async recordKunjungan(data: InsertKunjungan): Promise<void> {
    await this.db.insert(kunjungan).values(data);
  }

  async getStatistikKunjungan(hari: number): Promise<StatistikKunjungan> {
    const sejak = gte(kunjungan.createdAt, awalRentang(hari));
    const tanggal = sql<string>`to_char(${kunjungan.createdAt} at time zone ${zonaWaktu}, 'YYYY-MM-DD')`;
    const pengunjung = sql<number>`count(distinct ${tanggal} || ${kunjungan.pengunjung})::int`;
    const kelompokkan = (kolom: typeof kunjungan.provinsi | typeof kunjungan.sumber | typeof kunjungan.perangkat) =>
      this.db.select({ nama: sql<string>`${kolom}`, jumlah: pengunjung }).from(kunjungan)
        .where(sql`${sejak} and ${kolom} is not null`).groupBy(kolom).orderBy(sql`2 desc`).limit(BATAS_DAFTAR);

    const [total, perHari, kota, provinsi, halaman, sumber, perangkat] = await Promise.all([
      this.db.select({ kunjungan: sql<number>`count(*)::int`, pengunjung }).from(kunjungan).where(sejak),
      this.db.select({ tanggal, kunjungan: sql<number>`count(*)::int`, pengunjung }).from(kunjungan).where(sejak).groupBy(tanggal),
      this.db.select({ nama: sql<string>`${kunjungan.kota}`, provinsi: sql<string>`max(${kunjungan.provinsi})`, jumlah: pengunjung })
        .from(kunjungan).where(sql`${sejak} and ${kunjungan.kota} is not null`).groupBy(kunjungan.kota).orderBy(sql`3 desc`).limit(BATAS_DAFTAR),
      kelompokkan(kunjungan.provinsi),
      this.db.select({ nama: kunjungan.path, jumlah: sql<number>`count(*)::int` }).from(kunjungan).where(sejak)
        .groupBy(kunjungan.path).orderBy(sql`2 desc`).limit(BATAS_DAFTAR),
      kelompokkan(kunjungan.sumber),
      kelompokkan(kunjungan.perangkat),
    ]);

    const peta = new Map(perHari.map((item) => [item.tanggal, item]));
    return {
      hari,
      total: total[0] ?? { kunjungan: 0, pengunjung: 0 },
      perHari: deretTanggal(hari).map((item) => peta.get(item) ?? { tanggal: item, kunjungan: 0, pengunjung: 0 }),
      kota: kota.map((item) => ({ ...item, provinsi: item.provinsi ?? "" })),
      provinsi,
      halaman,
      sumber,
      perangkat,
    };
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
  private kunjunganItems: Kunjungan[] = [];
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
      sourceUrl: insertNote.sourceUrl ?? null,
      sourceName: insertNote.sourceName ?? null,
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

  async recordKunjungan(data: InsertKunjungan): Promise<void> {
    this.kunjunganItems.push({
      id: this.id(),
      createdAt: new Date(),
      path: data.path,
      referrer: data.referrer ?? null,
      sumber: data.sumber ?? null,
      kota: data.kota ?? null,
      provinsi: data.provinsi ?? null,
      perangkat: data.perangkat,
      pengunjung: data.pengunjung,
    });
  }

  async getStatistikKunjungan(hari: number): Promise<StatistikKunjungan> {
    const sejak = awalRentang(hari).getTime();
    return ringkasKunjungan(this.kunjunganItems.filter((item) => item.createdAt.getTime() >= sejak), hari);
  }
}

export const storage: IStorage = db ? new DatabaseStorage(db) : new MemStorage();
