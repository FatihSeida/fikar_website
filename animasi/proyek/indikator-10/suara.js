// Tiga ubin berkilau serentak pada 14.2; kurangi kuatnya agar denting hasil seimbang.
// Waktu, posisi pan, nada, dan semua peristiwa visual tetap sama.
export function sesuaikan(peristiwa) {
  return peristiwa.map(p => p.jenis === 'klik-emas'
    ? { ...p, kuat: (p.kuat ?? 0.7) * 0.6 }
    : p);
}
