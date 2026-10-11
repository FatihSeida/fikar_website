// Mix lokal: onset dunia tidak tertutup grid; rapat tidak menggandakan letup balon.
// Waktu peristiwa tetap sama dengan gambar, tanpa menggeser audio untuk mengejar pemeriksaan.
export function sesuaikan(peristiwa) {
  return peristiwa
    .filter(p => !(p.jenis === 'muncul' && (p.sumber.startsWith('balon rapat') || p.sumber === 'catatan sepakat')))
    .map(p => {
      const q = { ...p };
      if (q.jenis === 'grid-nyala') q.kuat = .4;
      if (q.jenis === 'muncul' && q.t < 1.2) q.kuat = q.sumber === 'komisariat1' ? .95 : .4;
      if (q.jenis === 'muncul' && q.sumber.startsWith('pengurus cabang')) q.kuat = .5;
      if (q.jenis === 'hilang' && q.sumber.startsWith('balon rapat')) q.kuat = .35;
      return q;
    });
}
