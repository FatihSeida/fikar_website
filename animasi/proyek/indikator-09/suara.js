// Peristiwa tetap pada waktu visualnya. Kurangi lapisan berulang agar foley utama terbaca.
export function sesuaikan(peristiwa) {
  return peristiwa.map(p => {
    if (p.jenis === 'grid-nyala') return { ...p, kuat: p.kuat * 0.35 };
    if (p.jenis === 'klik-emas') return { ...p, kuat: p.kuat * 0.6 };
    // Dunia muncul dalam 0.6 s: satu letup per kelompok lebih jelas daripada 21 letup.
    if (p.jenis === 'muncul' && p.t < 1.6) {
      const utama = ['lantai','meja','kursi 1','lentera 1','kotak pertanyaan'];
      return { ...p, kuat: utama.includes(p.sumber) ? 0.55 : 0 };
    }
    // Kartu sudah punya desir lempar dan ketukan mendarat; letup/hilang hanya menduplikasi gerak.
    if (/^kertas tanya /.test(p.sumber)) {
      if (p.jenis === 'muncul' || p.jenis === 'hilang') return { ...p, kuat: 0 };
      if (p.jenis === 'lempar') return { ...p, kuat: 0.4 };
      if (p.jenis === 'mendarat') return { ...p, kuat: 0.48 };
    }
    // Tiga tema tetap mendapat desir dan lipat, dengan ekor tenang sebelum denting emas.
    if (/^tema dari pertanyaan /.test(p.sumber)) {
      if (p.jenis === 'muncul') return { ...p, kuat: 0 };
      if (p.jenis === 'whoosh') return { ...p, kuat: 0.3 };
      if (p.jenis === 'kertas') return { ...p, kuat: 0.3 };
    }
    return p;
  });
}
