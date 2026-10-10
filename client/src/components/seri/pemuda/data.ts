import { useQuery } from "@tanstack/react-query";

/** Bentuk jawaban GET /api/statistik/pemuda (lihat server/kampanye.ts). */
export type StatistikPemuda = {
  ditarik: string;
  kuis: {
    total: number;
    komisariat: number;
    cabang: number;
    rataSkor: number | null;
    tingkat: { min: number; max: number; jumlah: number }[];
    /** Persen kader yang masih aktif setelah LK 1; null bila belum ada yang mengisi. */
    retensiLk1: number | null;
    /** Persen program komisariat yang terlaksana; null bila belum ada yang mengisi. */
    programTerlaksana: number | null;
    provinsi: { nama: string; jumlah: number }[];
    cabangTerbanyak: { nama: string; jumlah: number }[];
    perHari: { tanggal: string; jumlah: number }[];
  };
  kunjungan: {
    hari: number;
    total: { kunjungan: number; pengunjung: number };
    perHari: { tanggal: string; kunjungan: number; pengunjung: number }[];
    provinsi: { nama: string; jumlah: number }[];
  };
  masalah: number;
  tanggapan: number;
};

export function useStatistikPemuda() {
  // Admin memantau angka yang tumbuh, jadi data dianggap basi setelah semenit (server juga menyimpan semenit).
  return useQuery<StatistikPemuda>({ queryKey: ["/api/statistik/pemuda"], staleTime: 60_000 });
}

/** "403: {"rilis":...}" dari pengambil data bawaan menjadi waktu rilis; null bila galatnya bukan 403. */
export function rilisDariGalat(galat: unknown): number | null | undefined {
  const pesan = galat instanceof Error ? galat.message : "";
  if (!pesan.startsWith("403:")) return undefined;
  try {
    const rilis = JSON.parse(pesan.slice(4)).rilis;
    return typeof rilis === "number" ? rilis : null;
  } catch {
    return null;
  }
}

export const angka = (n: number) => n.toLocaleString("id-ID");
export const desimal = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

/** Tanggal "YYYY-MM-DD" (sudah dalam WIB dari server) tanpa bergeser zona waktu. */
const dariIso = (iso: string) => new Date(`${iso}T00:00:00Z`);
export const tanggalSingkat = (iso: string) => dariIso(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
export const tanggalLengkap = (iso: string) => dariIso(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "10 Oktober 2026, 04.05 WIB" */
export function waktuTarik(iso: string) {
  const waktu = new Date(iso);
  const tanggal = waktu.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
  const jam = waktu.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }).replace(":", ".");
  return `${tanggal}, ${jam} WIB`;
}

/**
 * Deret harian kuis yang dikenai sumbu tanggal kunjungan (sampai hari ini), supaya hari tanpa kiriman
 * tetap tampil sebagai nol. Minimal 30 hari terakhir; lebih panjang bila kuis sudah dimulai lebih awal.
 */
export function deretKuisHarian(data: StatistikPemuda): { tanggal: string[]; nilai: number[] } {
  const sumbu = data.kunjungan.perHari.map((h) => h.tanggal);
  const jumlah = new Map(data.kuis.perHari.map((h) => [h.tanggal, h.jumlah]));
  if (sumbu.length === 0) {
    const tanggal = data.kuis.perHari.map((h) => h.tanggal);
    return { tanggal, nilai: tanggal.map((t) => jumlah.get(t) ?? 0) };
  }
  let mulai = Math.max(0, sumbu.length - 30);
  const pertama = data.kuis.perHari[0]?.tanggal;
  const indeksPertama = pertama ? sumbu.indexOf(pertama) : -1;
  if (indeksPertama >= 0 && indeksPertama < mulai) mulai = indeksPertama;
  const tanggal = sumbu.slice(mulai);
  return { tanggal, nilai: tanggal.map((t) => jumlah.get(t) ?? 0) };
}

export const NAMA_TINGKAT = ["Titik Berangkat", "Mulai Mencatat", "Mulai Membaca Bukti", "Bukti Menjadi Kebiasaan"];
