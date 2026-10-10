import { useCallback, useEffect, useRef, useState } from "react";
import type { DaftarAdegan } from "./kontrak";

/**
 * Alat kecil mesin cerita: kemajuan pembaca di localStorage, pemuat daftar
 * adegan per seri, dan pembantu teks. Semua akses penyimpanan dibungkus
 * try/catch supaya halaman tetap jalan di jendela privat atau saat diblokir.
 */

const kunciSimpan = (slug: string) => `cerita-seri:${slug}`;

function bacaSimpanan(slug: string): number {
  try {
    const mentah = window.localStorage.getItem(kunciSimpan(slug));
    if (!mentah) return 0;
    const data = JSON.parse(mentah) as { sampai?: unknown };
    return typeof data.sampai === "number" && Number.isFinite(data.sampai) ? Math.max(0, Math.floor(data.sampai)) : 0;
  } catch {
    return 0;
  }
}

function tulisSimpanan(slug: string, sampai: number) {
  try {
    window.localStorage.setItem(kunciSimpan(slug), JSON.stringify({ sampai, waktu: Date.now() }));
  } catch {
    // Penyimpanan tidak tersedia: kemajuan hanya berlaku selama halaman terbuka.
  }
}

/**
 * `sampai` = jumlah bagian yang sudah ditandai paham. Bagian ke-i (mulai 0)
 * terbuka bila i <= sampai; penutup terbuka bila sampai >= jumlah.
 */
export function useKemajuan(slug: string, jumlah: number) {
  const [sampai, setSampai] = useState(() => Math.min(bacaSimpanan(slug), jumlah));
  const [kembali] = useState(() => bacaSimpanan(slug) > 0);
  const awal = useRef(true);

  useEffect(() => {
    if (awal.current) {
      awal.current = false;
      return;
    }
    tulisSimpanan(slug, sampai);
  }, [slug, sampai]);

  const paham = useCallback((indeks: number) => setSampai((s) => Math.max(s, indeks + 1)), []);
  const ulangi = useCallback(() => setSampai(0), []);
  return { sampai: Math.min(sampai, jumlah), paham, ulangi, kembali };
}

// Adegan setiap seri dimuat terpisah supaya pembaca satu seri tidak ikut mengunduh adegan seri lain.
const pemuatAdegan: Record<string, () => Promise<DaftarAdegan>> = {
  "kaderisasi-go-international": () => import("./adegan/dunia").then((m) => m.adeganDunia),
  "kebijakan-kaderisasi-berbasis-bukti": () => import("./adegan/evidence").then((m) => m.adeganEvidence),
};

/** `null` selama memuat; daftar kosong bila seri tidak punya adegan atau gagal dimuat. */
export function useDaftarAdegan(slug: string): DaftarAdegan | null {
  const [daftar, setDaftar] = useState<DaftarAdegan | null>(null);
  useEffect(() => {
    let hidup = true;
    const muat = pemuatAdegan[slug];
    if (!muat) {
      setDaftar({});
      return;
    }
    setDaftar(null);
    muat()
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
