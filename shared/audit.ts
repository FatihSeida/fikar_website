/**
 * Jadwal dan ukuran kuis audit komisariat, dipakai bersama oleh situs dan server.
 * Kuis dan halaman Audit Komisariat dibuka 7 Oktober 2026 pukul 00.00 WIB;
 * sebelum itu pengunjung melihat dialog "Segera hadir".
 */
export const PELUNCURAN_AUDIT = Date.parse("2026-10-07T00:00:00+07:00");

export function auditSudahDibuka(sekarang = Date.now()): boolean {
  return sekarang >= PELUNCURAN_AUDIT;
}

export const JUMLAH_SOAL_INTI = 20;
export const JUMLAH_SOAL_LANJUTAN = 10;
