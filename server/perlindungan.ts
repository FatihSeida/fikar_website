import type { NextFunction, Request, Response } from "express";

/**
 * Perlindungan beban untuk VPS 2 GB yang dipakai empat situs.
 *
 * 1. Batas permintaan aktif: bila server sedang menangani terlalu banyak
 *    permintaan sekaligus, permintaan baru ditolak cepat dengan 503 alih-alih
 *    menumpuk di memori sampai proses jatuh. Beacon analytics dikorbankan
 *    lebih dulu.
 * 2. Batas per IP: menahan satu alamat yang terus-menerus mengakses situs.
 *    Batasnya longgar karena banyak kader berbagi satu IP (CGNAT operator
 *    seluler, WiFi kampus atau lokasi Kongres). Satu kunjungan pertama memicu
 *    sekitar 20 permintaan, jadi 3000 per menit masih memuat sekitar 150
 *    pengunjung baru per menit dari satu IP.
 *
 * Semua angka bisa diatur lewat variabel lingkungan tanpa mengubah kode.
 */
const angkaEnv = (nama: string, bawaan: number) => {
  const nilai = Number(process.env[nama]);
  return Number.isFinite(nilai) && nilai > 0 ? nilai : bawaan;
};

export const batas = {
  permintaanAktif: angkaEnv("BATAS_PERMINTAAN_AKTIF", 200),
  perIpPerMenit: angkaEnv("BATAS_PER_IP_PER_MENIT", 3000),
  apiPerIpPerMenit: angkaEnv("BATAS_API_PER_IP_PER_MENIT", 600),
  // Batas total seluruh situs, bukan per IP: serangan dari banyak alamat
  // sekalipun tidak bisa memenuhi database dengan kunjungan palsu.
  kunjunganPerMenit: angkaEnv("BATAS_KUNJUNGAN_PER_MENIT", 3000),
  masalahPerJam: angkaEnv("BATAS_MASALAH_PER_JAM", 300),
  kuisPerJam: angkaEnv("BATAS_KUIS_PER_JAM", 1000),
};

/** Penghitung jendela tetap per kunci; memorinya tetap kecil walau diserang dari banyak IP. */
export function buatPenghitung(jumlahMaks: number, jendelaMs: number) {
  const catatan = new Map<string, { mulai: number; jumlah: number }>();
  const bersihkan = setInterval(() => {
    const sekarang = Date.now();
    catatan.forEach((nilai, kunci) => {
      if (sekarang - nilai.mulai >= jendelaMs) catatan.delete(kunci);
    });
  }, jendelaMs);
  bersihkan.unref();
  return (kunci: string): { boleh: boolean; sisaMs: number } => {
    const sekarang = Date.now();
    let nilai = catatan.get(kunci);
    if (!nilai || sekarang - nilai.mulai >= jendelaMs) {
      nilai = { mulai: sekarang, jumlah: 0 };
      catatan.set(kunci, nilai);
    }
    nilai.jumlah += 1;
    return { boleh: nilai.jumlah <= jumlahMaks, sisaMs: jendelaMs - (sekarang - nilai.mulai) };
  };
}

/** IPv6 dikelompokkan per /64 (satu pelanggan), supaya penyerang tidak bisa berganti alamat dalam blok miliknya. */
export function kunciIp(ip: string) {
  if (ip.startsWith("::ffff:")) return ip.slice(7);
  if (!ip.includes(":")) return ip;
  const [kiri, kanan = ""] = ip.split("::");
  const depan = kiri ? kiri.split(":") : [];
  const belakang = kanan ? kanan.split(":") : [];
  const penuh = ip.includes("::") ? [...depan, ...Array(Math.max(0, 8 - depan.length - belakang.length)).fill("0"), ...belakang] : depan;
  return `${penuh.slice(0, 4).join(":")}::/64`;
}

const halamanRamai = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="12"><title>Sedang ramai</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#071610;color:#f6f4e9;font-family:Georgia,serif;text-align:center;padding:24px}p{color:#dcc38a;font-family:system-ui,sans-serif;font-size:14px}</style></head><body><div><h1>Situs sedang ramai dikunjungi.</h1><p>Halaman akan dimuat ulang otomatis dalam beberapa detik.</p></div></body></html>`;

function tolak(req: Request, res: Response, status: 429 | 503, detik: number) {
  res.setHeader("Retry-After", String(Math.max(1, Math.ceil(detik))));
  res.setHeader("Cache-Control", "no-store");
  if (req.path.startsWith("/api")) {
    return res.status(status).json({ message: status === 429 ? "Terlalu banyak permintaan. Coba lagi sebentar lagi" : "Server sedang ramai. Coba lagi sebentar lagi" });
  }
  return res.status(status).type("html").send(halamanRamai);
}

export function perlindunganBeban() {
  const perIp = buatPenghitung(batas.perIpPerMenit, 60_000);
  const apiPerIp = buatPenghitung(batas.apiPerIpPerMenit, 60_000);
  let aktif = 0;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = kunciIp(req.ip || req.socket.remoteAddress || "unknown");
    const beacon = req.path === "/api/kunjungan";

    // Saat server mulai penuh, beacon analytics dilepas lebih dulu tanpa galat.
    if (beacon && aktif >= batas.permintaanAktif * 0.6) return res.status(204).end();
    if (aktif >= batas.permintaanAktif) return tolak(req, res, 503, 10);

    const umum = perIp(ip);
    if (!umum.boleh) return tolak(req, res, 429, umum.sisaMs / 1000);
    if (req.path.startsWith("/api") && !beacon) {
      const api = apiPerIp(ip);
      if (!api.boleh) return tolak(req, res, 429, api.sisaMs / 1000);
    }

    aktif += 1;
    let selesai = false;
    const lepas = () => {
      if (selesai) return;
      selesai = true;
      aktif -= 1;
    };
    res.on("finish", lepas);
    res.on("close", lepas);
    next();
  };
}

/** Cache singkat di memori untuk respons API publik yang jarang berubah. */
export function buatCacheSingkat(umurMs: number) {
  const isi = new Map<string, { data: unknown; kedaluwarsa: number }>();
  return {
    async ambil<T>(kunci: string, muat: () => Promise<T>): Promise<T> {
      const ada = isi.get(kunci);
      if (ada && ada.kedaluwarsa > Date.now()) return ada.data as T;
      const data = await muat();
      if (isi.size > 500) isi.clear();
      isi.set(kunci, { data, kedaluwarsa: Date.now() + umurMs });
      return data;
    },
    kosongkan() {
      isi.clear();
    },
  };
}
