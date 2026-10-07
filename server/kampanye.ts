import type { Express, NextFunction, Request, Response } from "express";
import { createHash, randomBytes } from "crypto";
import { z } from "zod/v4";
import { storage } from "./storage";
import { isProduction } from "./env";
import { lookupGeo } from "./geo";
import { namaKota, namaProvinsi } from "./wilayah";
import { buatPenghitung, kunciIp } from "./perlindungan";
import { RILIS, sudahRilis, type FiturRilis } from "@shared/rilis";
import { insertTanggapanSchema, lengkapiKirimanSchema, statusTanggapanIds, ubahSeriSchema } from "@shared/schema";

/**
 * Rute fitur kampanye Oktober–November: tab Series beserta tanggapan kader, dan
 * kiriman dari fitur interaktif. Setiap fitur terkunci sampai jadwal rilisnya di
 * shared/rilis.ts; admin yang sedang masuk tetap bisa meninjau lebih dulu.
 */

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type Pembantu = { requireAdmin: Middleware; sanitizeHtml: (html: string) => string };

/** Empat seri di tab Series. Judul disimpan di server supaya tidak terbaca sebelum terbit. */
const daftarSeri: { slug: string; nomor: number; judul: string; fitur: FiturRilis }[] = [
  { slug: "kaderisasi-go-international", nomor: 1, judul: "Kaderisasi Go International", fitur: "series-1" },
  { slug: "kebijakan-kaderisasi-berbasis-bukti", nomor: 2, judul: "Kebijakan Kaderisasi Berbasis Bukti", fitur: "series-2" },
  { slug: "hmi-dan-para-pemuda-untuk-2045", nomor: 3, judul: "HMI dan Para Pemuda untuk 2045", fitur: "series-3" },
  { slug: "menjadi-pahlawan-bersama-membangun-hmi", nomor: 4, judul: "Menjadi Pahlawan, Bersama Membangun HMI", fitur: "series-4" },
];

const fiturSeri = (slug: string) => daftarSeri.find((item) => item.slug === slug)?.fitur;

/** Terbuka bila jadwalnya lewat, di lingkungan pengembangan, atau untuk admin. */
export function bolehAkses(req: Request, fitur: FiturRilis) {
  return !isProduction || sudahRilis(fitur) || req.session?.isAdmin === true;
}

function tolakSebelumRilis(res: Response, fitur: FiturRilis) {
  res.status(403).json({ message: "Fitur ini belum dibuka", rilis: RILIS[fitur] });
}

const hashKunci = (kunci: string) => createHash("sha256").update(kunci).digest("hex");

function lokasiPengirim(req: Request) {
  const lokasi = lookupGeo(req.ip || req.socket.remoteAddress || "");
  return { kota: namaKota(lokasi?.city), provinsi: namaProvinsi(lokasi?.region) };
}

function idPositif(raw: string | string[]): number | null {
  if (Array.isArray(raw) || !/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

const pesanValidasi = (error: z.ZodError) => error.issues[0]?.message || "Data yang dikirim tidak valid";

/**
 * Fitur interaktif yang menyimpan kiriman. Setiap fitur mendaftarkan skemanya
 * di sini; isinya disimpan di kolom `data` tabel kiriman_fitur.
 */
export interface FiturKiriman {
  fitur: FiturRilis;
  skema: z.ZodType;
  /** Kolom identitas yang diambil dari kiriman. */
  identitas?: (data: any) => { komisariat?: string | null; cabang?: string | null; nama?: string | null; kontak?: string | null };
  /** Isi yang disimpan di kolom data; bawaan seluruh kiriman tanpa kolom identitas. */
  simpan?: (data: any) => unknown;
}

export const fiturKiriman = new Map<string, FiturKiriman>();
/** Isi fitur (situasi, bagian bangunan, kerangka) yang baru dikirim setelah rilis. */
export const kontenFitur = new Map<FiturRilis, () => unknown>();

export async function registerKampanyeRoutes(app: Express, { requireAdmin, sanitizeHtml }: Pembantu) {
  await storage.pastikanSeri(daftarSeri.map(({ slug, nomor, judul }) => ({ slug, nomor, judul })));

  const tanggapanPerIp = buatPenghitung(30, 60 * 60 * 1000);
  const kirimanPerIp = buatPenghitung(300, 60 * 60 * 1000);
  const kuotaKampanye = buatPenghitung(5000, 60 * 60 * 1000);
  const kirimanDibatasi = (req: Request, perIp: ReturnType<typeof buatPenghitung>) =>
    !perIp(kunciIp(req.ip || "unknown")).boleh || !kuotaKampanye("semua").boleh;

  // --- Series ---
  app.get("/api/seri", async (req, res) => {
    const semua = await storage.getSemuaSeri();
    res.json(daftarSeri.map((awal) => {
      const isi = semua.find((item) => item.slug === awal.slug);
      const terbit = sudahRilis(awal.fitur) && !!isi?.isi.trim();
      const tampil = terbit || req.session?.isAdmin === true || !isProduction;
      return {
        slug: awal.slug,
        nomor: awal.nomor,
        rilis: RILIS[awal.fitur],
        terbit,
        ...(tampil && isi ? { judul: isi.judul, subjudul: isi.subjudul, ringkasan: isi.ringkasan, gambar: isi.gambar, penulis: isi.penulis } : {}),
      };
    }));
  });

  app.get("/api/seri/:slug", async (req, res) => {
    const fitur = fiturSeri(req.params.slug);
    if (!fitur) return res.status(404).json({ message: "Seri tidak ditemukan" });
    if (!bolehAkses(req, fitur)) return tolakSebelumRilis(res, fitur);
    const isi = await storage.getSeri(req.params.slug);
    // Sudah waktunya terbit tetapi naskah belum diisi: pengunjung tidak melihat halaman kosong.
    if (!isi || (!isi.isi.trim() && isProduction && !req.session?.isAdmin)) return res.status(404).json({ message: "Naskah seri ini sedang disiapkan" });
    res.json({ ...isi, rilis: RILIS[fitur] });
  });

  app.get("/api/seri/:slug/tanggapan", async (req, res) => {
    const fitur = fiturSeri(req.params.slug);
    if (!fitur) return res.status(404).json({ message: "Seri tidak ditemukan" });
    if (!bolehAkses(req, fitur)) return tolakSebelumRilis(res, fitur);
    const daftar = await storage.getTanggapanTampil(req.params.slug, 200);
    res.json(daftar.map(({ id, createdAt, komisariat, cabang, nama, isi }) => ({ id, createdAt, komisariat, cabang, nama, isi })));
  });

  app.post("/api/seri/:slug/tanggapan", async (req, res) => {
    const fitur = fiturSeri(req.params.slug);
    if (!fitur) return res.status(404).json({ message: "Seri tidak ditemukan" });
    if (!bolehAkses(req, fitur)) return tolakSebelumRilis(res, fitur);
    const parsed = insertTanggapanSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: pesanValidasi(parsed.error) });
    if (kirimanDibatasi(req, tanggapanPerIp)) return res.status(429).json({ message: "Terlalu banyak tanggapan. Coba lagi nanti" });
    await storage.createTanggapan({ ...parsed.data, seriSlug: req.params.slug, ...lokasiPengirim(req) });
    res.status(201).json({ success: true });
  });

  app.get("/api/admin/seri", requireAdmin, async (_req, res) => {
    const semua = await storage.getSemuaSeri();
    res.json(semua.map((item) => ({ ...item, rilis: RILIS[fiturSeri(item.slug) ?? "series-1"] })));
  });

  app.put("/api/admin/seri/:slug", requireAdmin, async (req, res) => {
    const slug = String(req.params.slug);
    if (!fiturSeri(slug)) return res.status(404).json({ message: "Seri tidak ditemukan" });
    const parsed = ubahSeriSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: pesanValidasi(parsed.error) });
    const hasil = await storage.updateSeri(slug, { ...parsed.data, isi: sanitizeHtml(parsed.data.isi) });
    res.json(hasil);
  });

  app.get("/api/admin/tanggapan", requireAdmin, async (_req, res) => {
    res.json(await storage.getSemuaTanggapan(2000));
  });

  app.patch("/api/admin/tanggapan/:id", requireAdmin, async (req, res) => {
    const id = idPositif(req.params.id);
    const status = z.object({ status: z.enum(statusTanggapanIds) }).safeParse(req.body);
    if (!id || !status.success) return res.status(400).json({ message: "Permintaan tidak valid" });
    const hasil = await storage.updateStatusTanggapan(id, status.data.status);
    if (!hasil) return res.status(404).json({ message: "Tanggapan tidak ditemukan" });
    res.json(hasil);
  });

  app.delete("/api/admin/tanggapan/:id", requireAdmin, async (req, res) => {
    const id = idPositif(req.params.id);
    if (!id) return res.status(400).json({ message: "ID tanggapan tidak valid" });
    await storage.deleteTanggapan(id);
    res.json({ success: true });
  });

  // --- Isi fitur interaktif: baru dikirim setelah rilis ---
  app.get("/api/konten/:fitur", (req, res) => {
    const fitur = req.params.fitur as FiturRilis;
    const muat = kontenFitur.get(fitur);
    if (!muat) return res.status(404).json({ message: "Fitur tidak ditemukan" });
    if (!bolehAkses(req, fitur)) return tolakSebelumRilis(res, fitur);
    res.json(muat());
  });

  // --- Kiriman fitur interaktif ---
  app.post("/api/fitur/:fitur", async (req, res) => {
    const daftar = fiturKiriman.get(req.params.fitur);
    if (!daftar) return res.status(404).json({ message: "Fitur tidak ditemukan" });
    if (!bolehAkses(req, daftar.fitur)) return tolakSebelumRilis(res, daftar.fitur);
    const parsed = daftar.skema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: pesanValidasi(parsed.error) });
    if (kirimanDibatasi(req, kirimanPerIp)) return res.status(429).json({ message: "Terlalu banyak kiriman. Coba lagi nanti" });
    // Kunci dikirim sekali ke peramban pengisi untuk melengkapi komisariat dan cabang belakangan.
    const kunci = randomBytes(16).toString("hex");
    const data = parsed.data as Record<string, unknown>;
    const identitas = daftar.identitas?.(data) ?? {};
    const hasil = await storage.createKiriman({
      fitur: req.params.fitur,
      ...identitas,
      ...lokasiPengirim(req),
      data: daftar.simpan ? daftar.simpan(data) : data,
      kunciUbah: hashKunci(kunci),
    });
    res.status(201).json({ success: true, id: hasil.id, kunci });
  });

  app.patch("/api/fitur/:fitur/:id", async (req, res) => {
    const daftar = fiturKiriman.get(req.params.fitur);
    const id = idPositif(req.params.id);
    if (!daftar || !id) return res.status(404).json({ message: "Kiriman tidak ditemukan" });
    if (!bolehAkses(req, daftar.fitur)) return tolakSebelumRilis(res, daftar.fitur);
    const parsed = lengkapiKirimanSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: pesanValidasi(parsed.error) });
    const hasil = await storage.lengkapiKiriman(id, req.params.fitur, hashKunci(parsed.data.kunci), parsed.data);
    if (!hasil) return res.status(404).json({ message: "Kiriman tidak ditemukan" });
    res.json({ success: true });
  });

  // Publik hanya melihat jumlah peserta, tidak pernah isi kiriman.
  app.get("/api/fitur/:fitur/jumlah", async (req, res) => {
    const daftar = fiturKiriman.get(req.params.fitur);
    if (!daftar) return res.status(404).json({ message: "Fitur tidak ditemukan" });
    if (!bolehAkses(req, daftar.fitur)) return tolakSebelumRilis(res, daftar.fitur);
    res.json({ jumlah: await storage.hitungKiriman(req.params.fitur) });
  });

  app.get("/api/admin/fitur/:fitur", requireAdmin, async (req, res) => {
    const fitur = String(req.params.fitur);
    if (!fiturKiriman.has(fitur)) return res.status(404).json({ message: "Fitur tidak ditemukan" });
    res.json((await storage.getKiriman(fitur, 5000)).map(({ kunciUbah: _kunci, ...item }) => item));
  });
}
