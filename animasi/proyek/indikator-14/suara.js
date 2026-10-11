// Seimbangkan denting hasil dan beri ruang pada letup pertama di atas alas pembuka.
export function sesuaikan(peristiwa) {
  return peristiwa.map(p => {
    if (p.jenis === 'klik-emas') return { ...p, kuat: p.kuat * 0.6 };
    if (p.jenis === 'grid-nyala') return { ...p, kuat: p.kuat * 0.35 };
    return p;
  });
}
