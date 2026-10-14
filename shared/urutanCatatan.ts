/**
 * Kolom tanggal catatan adalah teks bebas ("14 Oktober 2026", "OKT 2023", "2026"),
 * jadi urutan "terbaru dulu" dibaca dari teks itu. Daftar catatan memakainya agar
 * tulisan yang baru masuk tampil paling atas.
 */

const BULAN: Record<string, number> = {
  januari: 1, jan: 1, februari: 2, pebruari: 2, feb: 2, maret: 3, mar: 3, april: 4, apr: 4, mei: 5,
  juni: 6, jun: 6, juli: 7, jul: 7, agustus: 8, agust: 8, agu: 8, agt: 8, september: 9, sept: 9, sep: 9,
  oktober: 10, okt: 10, november: 11, nov: 11, nop: 11, desember: 12, des: 12,
};

/**
 * Waktu (UTC) yang dimaksud teks tanggal, atau null bila tahunnya tidak terbaca.
 * Bulan tanpa hari dihitung tanggal 1. Tahun tanpa bulan dihitung pertengahan tahun,
 * karena hari dan bulannya memang tidak diketahui.
 */
export function waktuCatatan(teks: string): number | null {
  const iso = /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/.exec(teks);
  if (iso) return Date.UTC(+iso[1], +iso[2] - 1, +iso[3]);
  const garis = /\b(\d{1,2})[/.](\d{1,2})[/.](\d{4})\b/.exec(teks);
  if (garis) return Date.UTC(+garis[3], +garis[2] - 1, +garis[1]);

  const tahun = /\b(\d{4})\b/.exec(teks);
  if (!tahun) return null;
  const bulan = (teks.toLowerCase().match(/[a-z]+/g) ?? []).map((kata) => BULAN[kata]).find(Boolean);
  if (!bulan) return Date.UTC(+tahun[1], 6, 1);
  const hari = /\b(\d{1,2})\b/.exec(teks);
  return Date.UTC(+tahun[1], bulan - 1, hari ? Math.min(31, Math.max(1, +hari[1])) : 1);
}

/**
 * Terbaru dulu. Tanggal yang tidak terbaca ditaruh paling bawah. Catatan dengan waktu
 * yang sama tetap berurutan menurut waktu masuknya, jadi rangkaian seperti keempat
 * catatan HMI Evidence tidak tertukar.
 */
export function urutkanCatatan<T extends { id: number; date: string }>(daftar: T[]): T[] {
  const kunci = new Map(daftar.map((catatan) => [catatan.id, waktuCatatan(catatan.date) ?? -Infinity]));
  return [...daftar].sort((a, b) => {
    const ka = kunci.get(a.id)!;
    const kb = kunci.get(b.id)!;
    if (ka === kb) return a.id - b.id;
    return kb > ka ? 1 : -1;
  });
}
