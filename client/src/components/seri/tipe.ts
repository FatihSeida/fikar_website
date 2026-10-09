import type { ReactNode } from "react";

/** Data seri yang diterima setiap tampilan halaman seri (cerita, kerangka, atau naskah). */
export type InfoSeri = {
  slug: string;
  nomor: number;
  judul: string;
  /** Caption seri (subjudul admin atau caption bawaan server). */
  subjudul: string | null;
  rilis: number;
  penulis: string;
  tautanMedia?: string | null;
  namaMedia?: string | null;
};

/**
 * Setiap tampilan seri menggambar seluruh halamannya sendiri (Navbar sampai SiteFooter).
 * `naskah` adalah HTML yang ditulis admin di panel Series (boleh kosong);
 * `tanggapan` adalah kolom tanggapan kader yang ditaruh di akhir halaman.
 */
export type PropsHalamanSeri = { seri: InfoSeri; naskah: string; tanggapan: ReactNode };
