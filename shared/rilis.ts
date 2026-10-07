/**
 * Jadwal rilis fitur kampanye, dipakai bersama oleh situs dan server.
 * Setiap fitur dibuka otomatis pada Rabu pukul 15.00 WIB di minggunya
 * (lihat Rencana Kampanye HMI Evidence v4). Sebelum itu halamannya
 * menampilkan "Segera hadir" dan server menolak memberikan isinya,
 * kecuali kepada admin yang sedang masuk.
 */
const rabu15 = (tanggal: string) => Date.parse(`${tanggal}T15:00:00+07:00`);

export const RILIS = {
  "series-1": rabu15("2026-10-14"),
  "series-2": rabu15("2026-10-21"),
  "series-3": rabu15("2026-10-28"),
  "peta-suara": rabu15("2026-10-28"),
  "kursi-ketua": rabu15("2026-11-04"),
  "series-4": rabu15("2026-11-11"),
  "bangun-hmi": rabu15("2026-11-11"),
  "maturity-cabang": rabu15("2026-11-18"),
  // Hasil Bangun HMI Bersama dan laporan keseluruhan dibuka di minggu keempat November.
  "hasil-bangun-hmi": rabu15("2026-11-25"),
  "hasil-keseluruhan": rabu15("2026-11-25"),
} as const;

export type FiturRilis = keyof typeof RILIS;

export function sudahRilis(fitur: FiturRilis, sekarang = Date.now()): boolean {
  return sekarang >= RILIS[fitur];
}

/** "Rabu, 4 November 2026 · 15.00 WIB" */
export function labelRilis(fitur: FiturRilis): string {
  const waktu = new Date(RILIS[fitur]);
  const tanggal = waktu.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
  return `${tanggal} · 15.00 WIB`;
}

export const SEMUA_FITUR_RILIS = Object.keys(RILIS) as FiturRilis[];
