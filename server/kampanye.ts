import type { Express, NextFunction, Request, Response } from "express";
import { createHash, randomBytes } from "crypto";
import { z } from "zod/v4";
import { storage } from "./storage";
import { isProduction } from "./env";
import { lookupGeo } from "./geo";
import { namaKota, namaProvinsi } from "./wilayah";
import { buatCacheSingkat, buatPenghitung, kunciIp } from "./perlindungan";
import { RILIS, sudahRilis, type FiturRilis } from "@shared/rilis";
import { insertTanggapanSchema, lengkapiKirimanSchema, statusTanggapanIds, ubahSeriSchema } from "@shared/schema";
import { kontenKursiKetua, NAMA_POTRET } from "./konten/kursiKetua";
import { ID_BAGIAN, kontenBangunHmi } from "./konten/bangunHmi";
import { BERKAS_UNDUHAN, ID_DIMENSI_CABANG, ID_JAWABAN_TRADISI, ID_TRADISI, kontenMaturityCabang } from "./konten/maturityCabang";
import fs from "fs";
import path from "path";

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

const nilaiDimensi = z.number().int().min(0).max(100);

/** Sehari di Kursi Ketum: hanya ringkasan hasil yang disimpan, bukan jawaban per situasi. */
kontenFitur.set("kursi-ketua", kontenKursiKetua);
fiturKiriman.set("kursi-ketua", {
  fitur: "kursi-ketua",
  skema: z.object({
    kursi: z.enum(["komisariat", "cabang"]),
    potret: z.enum(NAMA_POTRET as [string, ...string[]]),
    nilai: z.object({ A: nilaiDimensi, P: nilaiDimensi, K: nilaiDimensi, D: nilaiDimensi, J: nilaiDimensi }),
  }),
});

/** Bangun HMI Bersama: nilai sebelas bagian, tiga bagian paling mendesak, dan cara perbaikannya. */
const idBagian = z.enum(ID_BAGIAN as [string, ...string[]]);
kontenFitur.set("bangun-hmi", kontenBangunHmi);
fiturKiriman.set("bangun-hmi", {
  fitur: "bangun-hmi",
  skema: z.object({
    komisariat: z.string().trim().min(2).max(120),
    cabang: z.string().trim().min(2).max(80),
    // Kunci enum membuat semua bagian wajib dinilai.
    nilai: z.record(idBagian, z.number().int().min(1).max(5)),
    prioritas: z.array(z.object({
      bagian: idBagian,
      cara: z.number().int().min(0).max(2).nullable(),
      usulan: z.string().trim().max(500).nullable(),
    }).refine((p) => p.cara !== null || (p.usulan?.length ?? 0) >= 5, "Pilih cara perbaikan atau tulis usulanmu"))
      .length(3, "Pilih tepat tiga bagian")
      .refine((daftar) => new Set(daftar.map((p) => p.bagian)).size === 3, "Tiga bagian harus berbeda"),
  }),
  identitas: (data) => ({ komisariat: data.komisariat, cabang: data.cabang }),
  simpan: (data) => ({ nilai: data.nilai, prioritas: data.prioritas }),
});

/** Maturity Level Cabang: penilaian diri enam dimensi, prioritas, dan jawaban tentang tradisi. */
kontenFitur.set("maturity-cabang", kontenMaturityCabang);
fiturKiriman.set("maturity-cabang", {
  fitur: "maturity-cabang",
  skema: z.object({
    cabang: z.string().trim().min(2).max(80),
    tingkat: z.record(z.enum(ID_DIMENSI_CABANG as [string, ...string[]]), z.number().int().min(1).max(4)),
    prioritas: z.array(z.object({ dimensi: z.enum(ID_DIMENSI_CABANG as [string, ...string[]]), target: z.number().int().min(2).max(4) }))
      .min(1, "Pilih minimal satu dimensi prioritas").max(2, "Pilih paling banyak dua dimensi prioritas"),
    tradisi: z.record(z.enum(ID_TRADISI as [string, ...string[]]), z.enum(ID_JAWABAN_TRADISI as [string, ...string[]])),
  }),
  identitas: (data) => ({ cabang: data.cabang }),
  simpan: (data) => ({ tingkat: data.tingkat, prioritas: data.prioritas, tradisi: data.tradisi }),
});
/** Tombol "Saya akan implementasikan di cabang". Kontak hanya untuk tindak lanjut tim. */
fiturKiriman.set("maturity-komitmen", {
  fitur: "maturity-cabang",
  skema: z.object({
    cabang: z.string().trim().min(2).max(80),
    nama: z.string().trim().min(2).max(80),
    jabatan: z.string().trim().min(2).max(80),
    kontak: z.string().trim().min(5).max(120),
  }),
  identitas: (data) => ({ cabang: data.cabang, nama: data.nama, kontak: data.kontak }),
  simpan: (data) => ({ jabatan: data.jabatan }),
});

/** Panduan dan templat Maturity Level Cabang: di dist/ saat produksi, server/data/ saat pengembangan. */
function jalurUnduhan(berkas: string) {
  const folder = [typeof __dirname !== "undefined" ? __dirname : null, path.join(process.cwd(), "server", "data"), path.join(process.cwd(), "dist")]
    .filter((d): d is string => d !== null)
    .map((d) => path.join(d, "unduhan", berkas));
  return folder.find((jalur) => fs.existsSync(jalur));
}

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

  // Unduhan panduan dan templat dihitung per berkas, lalu berkasnya dikirim.
  app.get("/api/unduhan/maturity/:berkas", async (req, res) => {
    if (!bolehAkses(req, "maturity-cabang")) return tolakSebelumRilis(res, "maturity-cabang");
    const berkas = String(req.params.berkas);
    const jalur = BERKAS_UNDUHAN.includes(berkas) ? jalurUnduhan(berkas) : undefined;
    if (!jalur) return res.status(404).json({ message: "Berkas tidak ditemukan" });
    const cabang = typeof req.query.cabang === "string" ? req.query.cabang.trim().slice(0, 80) || null : null;
    if (!kirimanDibatasi(req, kirimanPerIp)) {
      await storage.createKiriman({ fitur: "maturity-unduhan", cabang, ...lokasiPengirim(req), data: { berkas } });
    }
    res.download(jalur, berkas);
  });

  // Peta Suara Kader: jumlah partisipasi per provinsi dan cabang, tanpa skor atau isi kiriman.
  const cachePeta = buatCacheSingkat(60_000);
  app.get("/api/peta-suara", async (req, res) => {
    if (!bolehAkses(req, "peta-suara")) return tolakSebelumRilis(res, "peta-suara");
    res.json(await cachePeta.ambil("peta", async () => {
      const fiturDihitung = ["kursi-ketua", "bangun-hmi", "maturity-cabang"];
      const [kuis, tanggapanSemua, masalah, ...fitur] = await Promise.all([
        storage.getHasilKuis(100_000),
        storage.getSemuaTanggapan(100_000),
        storage.getMasalah(),
        ...fiturDihitung.map((f) => storage.getKiriman(f, 100_000)),
      ]);
      const semua: { provinsi?: string | null; cabang?: string | null }[] = [...kuis, ...tanggapanSemua, ...masalah, ...fitur.flat()];
      const hitung = (ambil: (item: (typeof semua)[number]) => string | null | undefined) => {
        const peta = new Map<string, { nama: string; jumlah: number }>();
        for (const item of semua) {
          const nama = ambil(item)?.trim();
          if (!nama) continue;
          const kunci = nama.toLowerCase();
          const isi = peta.get(kunci) ?? { nama, jumlah: 0 };
          isi.jumlah += 1;
          peta.set(kunci, isi);
        }
        return Array.from(peta.values()).sort((a, b) => b.jumlah - a.jumlah);
      };
      return {
        ditarik: new Date().toISOString(),
        total: semua.length,
        provinsi: hitung((item) => item.provinsi),
        cabang: hitung((item) => item.cabang).slice(0, 15),
      };
    }));
  });

  // Hasil gabungan Bangun HMI Bersama, dibuka di minggu keempat November.
  app.get("/api/fitur/bangun-hmi/hasil", async (req, res) => {
    if (!bolehAkses(req, "hasil-bangun-hmi")) return tolakSebelumRilis(res, "hasil-bangun-hmi");
    const semua = await storage.getKiriman("bangun-hmi", 100_000);
    type Isi = { nilai: Record<string, number>; prioritas: { bagian: string; cara: number | null; usulan: string | null }[] };
    const bagian = ID_BAGIAN.map((id) => {
      const nilai = semua.map((k) => (k.data as Isi).nilai[id]).filter((n) => typeof n === "number");
      const pilihan = semua.flatMap((k) => (k.data as Isi).prioritas.filter((p) => p.bagian === id));
      return {
        id,
        rataRata: nilai.length ? Math.round((nilai.reduce((a, b) => a + b, 0) / nilai.length) * 10) / 10 : null,
        dipilihMendesak: pilihan.length,
        cara: [0, 1, 2].map((i) => pilihan.filter((p) => p.cara === i).length),
        usulan: pilihan.filter((p) => p.cara === null).length,
      };
    });
    res.json({
      jumlah: semua.length,
      komisariat: new Set(semua.map((k) => `${k.komisariat}|${k.cabang}`.toLowerCase())).size,
      cabang: new Set(semua.map((k) => (k.cabang ?? "").toLowerCase())).size,
      ditarik: new Date().toISOString(),
      bagian,
    });
  });

  app.get("/api/admin/fitur/:fitur", requireAdmin, async (req, res) => {
    const fitur = String(req.params.fitur);
    if (!fiturKiriman.has(fitur) && fitur !== "maturity-unduhan") return res.status(404).json({ message: "Fitur tidak ditemukan" });
    res.json((await storage.getKiriman(fitur, 5000)).map(({ kunciUbah: _kunci, ...item }) => item));
  });
}
