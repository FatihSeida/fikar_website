import { useEffect, useState } from "react";
import type { DaftarAdegan } from "./kontrak";

/**
 * Alat kecil mesin cerita: pemuat daftar adegan per seri dan pembantu teks.
 * Semua bagian cerita terbuka sejak awal; pembaca bebas menggulir atau melompat.
 */

// Adegan setiap seri dimuat terpisah supaya pembaca satu seri tidak ikut mengunduh adegan seri lain.
const pemuatAdegan: Record<string, () => Promise<DaftarAdegan>> = {
  "kaderisasi-go-international": () => import("./adegan/dunia").then((m) => m.adeganDunia),
  "kebijakan-kaderisasi-berbasis-bukti": () => import("./adegan/evidence").then((m) => m.adeganEvidence),
};

/** Seri yang tampil sebagai cerita interaktif. */
export const punyaCerita = (slug: string) => slug in pemuatAdegan;

const adeganDimuat = new Map<string, Promise<DaftarAdegan>>();

/** Memuat daftar adegan satu seri. Dipanggil lebih awal pun tidak mengunduh dua kali. */
export function muatAdegan(slug: string): Promise<DaftarAdegan> {
  const muat = pemuatAdegan[slug];
  if (!muat) return Promise.resolve({});
  let janji = adeganDimuat.get(slug);
  if (!janji) {
    janji = muat();
    adeganDimuat.set(slug, janji);
    janji.catch(() => adeganDimuat.delete(slug));
  }
  return janji;
}

/** `null` selama memuat; daftar kosong bila seri tidak punya adegan atau gagal dimuat. */
export function useDaftarAdegan(slug: string): DaftarAdegan | null {
  const [daftar, setDaftar] = useState<DaftarAdegan | null>(null);
  useEffect(() => {
    let hidup = true;
    setDaftar(null);
    muatAdegan(slug)
      .then((hasil) => { if (hidup) setDaftar(hasil); })
      .catch((galat) => {
        console.warn("Adegan seri gagal dimuat", galat);
        if (hidup) setDaftar({});
      });
    return () => { hidup = false; };
  }, [slug]);
  return daftar;
}

/** Paragraf dipisah baris kosong. */
export const paragraf = (isi: string) => isi.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export const duaAngka = (n: number) => String(n).padStart(2, "0");

/** Gulir ke satu bagian lalu pindahkan fokus ke judulnya untuk pengguna papan ketik dan pembaca layar. */
export function gulirKe(id: string, tenang: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: tenang ? "auto" : "smooth", block: "start" });
  const fokus = el.querySelector<HTMLElement>("[data-fokus]") ?? el;
  fokus.focus({ preventScroll: true });
}
