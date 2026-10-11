// Perakit bersama untuk semua dunia (KONTRAK.md §7): membuat benda dari resep sambil menerapkan
// opsi video `tanpa`, `posisi`, `opsi`, dan `ganti`. Tidak diekspor ulang lewat kit/index.js.
//
// resep: [{ nama, buat(opsi, benda), opsi, posisi, rotasi }]
//   buat     menerima opsi gabungan dan benda yang sudah dibuat lebih dulu (untuk penghubung seperti jembatan)
//   posisi   Vector3; tanpa posisi benda tetap di titik asal (benda antartitik)
//   rotasi   sudut y dalam radian
export function susunDunia(v, resep, opsiVideo = {}) {
  const { tanpa = [], posisi = {}, opsi = {}, ganti = {} } = opsiVideo;
  const benda = {};
  const urutan = [];
  for (const r of resep) {
    if (tanpa.includes(r.nama)) continue;
    const o = { ...r.opsi, ...opsi[r.nama] };
    const b = ganti[r.nama] ? ganti[r.nama](o, benda) : r.buat(o, benda);
    const p = posisi[r.nama] ?? r.posisi;
    if (p) b.position.copy(p);
    if (r.rotasi) b.rotation.y = r.rotasi;
    v.tambah(b);
    b.updateMatrixWorld(true);
    benda[r.nama] = b;
    urutan.push(b);
  }
  return { benda, urutan };
}

// Nama kelompok di `tanpa` dan `opsi` (mis. "kursi") diluaskan ke anggotanya (kursi1 … kursiN).
// Opsi anggota (opsi.kursi2) menimpa opsi kelompok (opsi.kursi). kelompok: { kursi: 5, lentera: 5 }.
export function luaskan(opsiVideo, kelompok) {
  const { tanpa = [], opsi = {} } = opsiVideo;
  const anggota = (n) => Array.from({ length: kelompok[n] }, (_, i) => `${n}${i + 1}`);
  const o = { ...opsi };
  for (const n of Object.keys(kelompok)) if (opsi[n]) for (const a of anggota(n)) o[a] = { ...opsi[n], ...opsi[a] };
  return { ...opsiVideo, tanpa: tanpa.flatMap((n) => (kelompok[n] ? anggota(n) : [n])), opsi: o };
}
