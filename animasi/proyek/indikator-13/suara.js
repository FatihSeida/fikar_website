// Delapan klik pada satu hasil dibunyikan bersama; beri ruang pada gerak lainnya.
export function sesuaikan(peristiwa) {
  return peristiwa.map((p) => ({
    ...p,
    kuat: p.kuat * (p.jenis === 'klik-emas' ? 0.5 : p.jenis === 'grid-nyala' ? 0.35 : 1),
  }));
}
