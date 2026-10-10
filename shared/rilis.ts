/**
 * Jadwal rilis fitur kampanye, dipakai bersama oleh situs dan server.
 * Hampir semua fitur dibuka Rabu pukul 15.00 WIB di minggunya (lihat Rencana
 * Kampanye HMI Evidence v4). Series 4 dan Bangun HMI Bersama dibuka pada Hari
 * Pahlawan, 10 November, pukul 10.00 WIB. Sebelum jadwalnya halaman menampilkan
 * "Segera hadir" dan server menolak memberikan isinya, kecuali kepada admin.
 */
const wib = (tanggal: string, jam = "15:00") => Date.parse(`${tanggal}T${jam}:00+07:00`);

export const RILIS = {
  "series-1": wib("2026-10-14"),
  "series-2": wib("2026-10-21"),
  "series-3": wib("2026-10-28"),
  "peta-suara": wib("2026-10-28"),
  "kursi-ketua": wib("2026-11-04"),
  "series-4": wib("2026-11-10", "10:00"),
  "bangun-hmi": wib("2026-11-10", "10:00"),
  "maturity-cabang": wib("2026-11-18"),
  // Hasil Bangun HMI Bersama dan laporan keseluruhan dibuka di minggu keempat November.
  "hasil-bangun-hmi": wib("2026-11-25"),
  "hasil-keseluruhan": wib("2026-11-25"),
} as const;

export type FiturRilis = keyof typeof RILIS;

export function sudahRilis(fitur: FiturRilis, sekarang = Date.now()): boolean {
  return sekarang >= RILIS[fitur];
}

/** Seri sudah boleh diperkenalkan (judul dan caption) dua hari sebelum terbit. */
export const JEDA_PRATINJAU = 2 * 24 * 60 * 60 * 1000;
export function segeraTampil(fitur: FiturRilis, sekarang = Date.now()): boolean {
  return sekarang >= RILIS[fitur] - JEDA_PRATINJAU;
}

/** "Rabu, 4 November 2026 · 15.00 WIB" untuk waktu apa pun. */
export function labelWaktu(waktu: number): string {
  const tanggal = new Date(waktu).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
  const jam = new Date(waktu).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }).replace(":", ".");
  return `${tanggal} · ${jam} WIB`;
}

export function labelRilis(fitur: FiturRilis): string {
  return labelWaktu(RILIS[fitur]);
}

export const SEMUA_FITUR_RILIS = Object.keys(RILIS) as FiturRilis[];
