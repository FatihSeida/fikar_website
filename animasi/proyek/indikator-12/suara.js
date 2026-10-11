// Empat stan mengklik serentak pada 14.4 s. Kurangi aksen setiap klik
// agar gabungannya tidak membebani limiter; waktu/pan/peristiwa lain tetap.
export function sesuaikan(peristiwa) {
  return peristiwa.map(e => e.jenis === 'klik-emas'
    ? { ...e, kuat: (e.kuat ?? 0.7) * 0.6 }
    : { ...e });
}
