import { db, type Db } from "./db";
import {
  gallery, notes, pages, masalahKomisariat, kunjungan, hasilKuis,
  type GalleryItem, type InsertGalleryItem, type Note, type InsertNote, type Page, type InsertPage,
  type MasalahKomisariat, type InsertMasalah, type InsertKunjungan, type Kunjungan, type HasilKuis, type InsertHasilKuis,
  type StatistikKunjungan, type JumlahBerlabel,
} from "@shared/schema";
import { and, asc, desc, eq, gte, sql } from "drizzle-orm";

export interface IStorage {
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryUrutan(id: number, urutan: number): Promise<void>;
  deleteGalleryItem(id: number): Promise<void>;

  getNotes(): Promise<Note[]>;
  getNote(slug: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number): Promise<void>;

  getPage(slug: string): Promise<Page | undefined>;
  upsertPage(slug: string, data: { title: string; content: string }): Promise<Page>;

  createMasalah(data: InsertMasalah): Promise<MasalahKomisariat>;
  getMasalah(): Promise<MasalahKomisariat[]>;
  updateMasalahStatus(id: number, status: string): Promise<MasalahKomisariat | undefined>;
  deleteMasalah(id: number): Promise<void>;

  recordKunjungan(data: InsertKunjungan): Promise<void>;
  getStatistikKunjungan(hari: number): Promise<StatistikKunjungan>;

  createHasilKuis(data: InsertHasilKuis): Promise<HasilKuis>;
  /** Mengisi komisariat dan cabang; undefined bila hasilnya tidak ada atau kuncinya salah. */
  lengkapiHasilKuis(id: number, kunciUbah: string, data: IdentitasKuis): Promise<HasilKuis | undefined>;
  getHasilKuis(batas: number): Promise<HasilKuis[]>;
}

export type IdentitasKuis = { komisariat?: string | null; cabang?: string | null };

// Kolom yang tidak dikirim tidak menimpa nilai yang sudah ada.
const identitasTerisi = (data: IdentitasKuis) => ({
  ...(data.komisariat ? { komisariat: data.komisariat } : {}),
  ...(data.cabang ? { cabang: data.cabang } : {}),
});

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
    return await this.db.select().from(gallery).orderBy(asc(gallery.urutan), asc(gallery.id));
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const [item] = await this.db.insert(gallery).values(insertItem).returning();
    return item;
  }

  async updateGalleryUrutan(id: number, urutan: number): Promise<void> {
    await this.db.update(gallery).set({ urutan }).where(eq(gallery.id, id));
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

  async createMasalah(data: InsertMasalah): Promise<MasalahKomisariat> {
    const [item] = await this.db.insert(masalahKomisariat).values(data).returning();
    return item;
  }

  async getMasalah(): Promise<MasalahKomisariat[]> {
    return await this.db.select().from(masalahKomisariat).orderBy(desc(masalahKomisariat.createdAt));
  }

  async updateMasalahStatus(id: number, status: string): Promise<MasalahKomisariat | undefined> {
    const [item] = await this.db.update(masalahKomisariat).set({ status }).where(eq(masalahKomisariat.id, id)).returning();
    return item;
  }

  async deleteMasalah(id: number): Promise<void> {
    await this.db.delete(masalahKomisariat).where(eq(masalahKomisariat.id, id));
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

  async createHasilKuis(data: InsertHasilKuis): Promise<HasilKuis> {
    const [item] = await this.db.insert(hasilKuis).values(data).returning();
    return item;
  }

  async lengkapiHasilKuis(id: number, kunciUbah: string, data: IdentitasKuis): Promise<HasilKuis | undefined> {
    const kondisi = and(eq(hasilKuis.id, id), eq(hasilKuis.kunciUbah, kunciUbah));
    const isi = identitasTerisi(data);
    if (Object.keys(isi).length === 0) {
      const [item] = await this.db.select().from(hasilKuis).where(kondisi);
      return item;
    }
    const [item] = await this.db.update(hasilKuis).set(isi).where(kondisi).returning();
    return item;
  }

  async getHasilKuis(batas: number): Promise<HasilKuis[]> {
    return await this.db.select().from(hasilKuis).orderBy(desc(hasilKuis.createdAt)).limit(batas);
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
  private masalahItems: MasalahKomisariat[] = [];
  private kunjunganItems: Kunjungan[] = [];
  private hasilKuisItems: HasilKuis[] = [];
  private idBerikutnya = 1;

  private id(): number {
    return this.idBerikutnya++;
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    return [...this.galleryItems].sort((a, b) => a.urutan - b.urutan || a.id - b.id);
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const item: GalleryItem = {
      id: this.id(),
      image: insertItem.image,
      caption: insertItem.caption,
      colSpan: insertItem.colSpan ?? "col-span-1",
      tata: insertItem.tata ?? "lebar",
      posisi: insertItem.posisi ?? null,
      gambarPenuh: insertItem.gambarPenuh ?? null,
      urutan: insertItem.urutan ?? 0,
    };
    this.galleryItems.push(item);
    return item;
  }

  async updateGalleryUrutan(id: number, urutan: number): Promise<void> {
    const item = this.galleryItems.find((foto) => foto.id === id);
    if (item) item.urutan = urutan;
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

  async createMasalah(data: InsertMasalah): Promise<MasalahKomisariat> {
    const item: MasalahKomisariat = {
      id: this.id(),
      cabang: data.cabang,
      komisariat: data.komisariat,
      kelompok: data.kelompok ?? null,
      masalah: data.masalah,
      nama: data.nama ?? null,
      kontak: data.kontak ?? null,
      bolehDikutip: data.bolehDikutip ?? false,
      status: "baru",
      createdAt: new Date(),
      hasilKuisId: data.hasilKuisId ?? null,
    };
    this.masalahItems.push(item);
    return item;
  }

  async getMasalah(): Promise<MasalahKomisariat[]> {
    return [...this.masalahItems].reverse();
  }

  async updateMasalahStatus(id: number, status: string): Promise<MasalahKomisariat | undefined> {
    const item = this.masalahItems.find((masalah) => masalah.id === id);
    if (item) item.status = status;
    return item;
  }

  async deleteMasalah(id: number): Promise<void> {
    this.masalahItems = this.masalahItems.filter((item) => item.id !== id);
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

  async createHasilKuis(data: InsertHasilKuis): Promise<HasilKuis> {
    const item: HasilKuis = {
      id: this.id(),
      createdAt: new Date(),
      skor: data.skor,
      jawaban: data.jawaban,
      komisariat: data.komisariat ?? null,
      cabang: data.cabang ?? null,
      pesertaLk1: data.pesertaLk1 ?? null,
      aktifLk1: data.aktifLk1 ?? null,
      programRencana: data.programRencana ?? null,
      programTerlaksana: data.programTerlaksana ?? null,
      kota: data.kota ?? null,
      provinsi: data.provinsi ?? null,
      kunciUbah: data.kunciUbah ?? null,
    };
    this.hasilKuisItems.push(item);
    return item;
  }

  async lengkapiHasilKuis(id: number, kunciUbah: string, data: IdentitasKuis): Promise<HasilKuis | undefined> {
    const item = this.hasilKuisItems.find((hasil) => hasil.id === id && hasil.kunciUbah === kunciUbah);
    if (item) Object.assign(item, identitasTerisi(data));
    return item;
  }

  async getHasilKuis(batas: number): Promise<HasilKuis[]> {
    return [...this.hasilKuisItems].reverse().slice(0, batas);
  }
}

export const storage: IStorage = db ? new DatabaseStorage(db) : new MemStorage();
