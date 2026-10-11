
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, W, rentang, halus, waktuBeku,
  panggung, pita, kue, pion, label3D, keterangan, setelKeadaan, muncul,
  klikEmas, denyutCermin, lintas, jalan, catat,
} from '../../kit/index.js';
import { petakKosong, stanKarya } from './benda-lokal.js';

let jadwal;
const v = buatVideo({
  format: formatIndikator({
    nomor: '12', kategori: 'KADERISASI',
    judul: 'Dies Natalis tidak lagi semarak dengan kegiatan ilmiah, sosial, seni, dan karya.',
    cermin: 'Pada Dies Natalis terakhir, karya apa yang dihasilkan kader kita?',
    langkah: 'Rayakan dengan karya: tulisan, riset kecil, aksi sosial, dan seni.',
    ajakan: 'ahmadzulfikar.com/kuis',
  }),
  kamera: t => jadwal(t),
  akhirAdegan: 18,
});
keterangan({ label: 'ISI KUIS', warna: 'emas', top: 1450, masuk: [18.6, 19.2], naik: 0 });
document.querySelector('.kit-kepala').classList.add('kepala-utama');

// Lebar diperluas agar empat karya terbaca pada satu baris, seluruhnya di zona 3D.
const pentas = v.tambah(panggung({ lebar: 6.2, dalam: 3.2, warna: W.abuGelap, tangga: false }));
pentas.position.copy(titik(0, -0.5));
pentas.rotation.y = Math.PI / 4;
const yPentas = pentas.userData.atas;
const dekor = v.tambah(pita({ jarak: 4.8, tinggi: 1.25, warna: W.abu, warnaTiang: W.abuGelap }));
dekor.position.copy(titik(0, -1.4, yPentas));
dekor.rotation.y = Math.PI / 4;
const cake = v.tambah(kue({ warna: W.abu, warnaHias: W.abuGelap, lilin: false }));
cake.position.copy(titik(0, 0.35, yPentas));

const rStan = [-2.1, -0.7, 0.7, 2.1];
const namaStan = ['TULISAN', 'RISET', 'SOSIAL', 'SENI'];
const stans = namaStan.map((nama, i) => {
  const s = v.tambah(stanKarya(i));
  s.position.copy(titik(rStan[i], -0.9, yPentas));
  label3D(nama, { pada: s, geser: [0, 1.78, 0], dy: -18, gaya: 'mikro', kelas: 'label-stan',
    masuk: [12.4 + i * 0.4, 12.9 + i * 0.4], skala: () => 16 / v.rig.keadaan.H });
  return s;
});
const petaks = rStan.map((r, i) => {
  const p = v.tambah(petakKosong(`petak kosong ${i + 1}`));
  p.position.copy(titik(r, -0.9, yPentas));
  muncul(p, { t: 7, durasi: 0.4, naik: 0, skala: 1, bunyi: { kuat: 0.35 } });
  denyutCermin(p, { mulai: 7, selesai: 11.8 });
  return p;
});

const awalPenonton = Array.from({ length: 8 }, (_, i) => titik(-2.1 + (i % 4) * 1.4 + (i >= 4 ? 0.15 : 0), 2.2 + Math.floor(i / 4) * 1.1));
const penonton = awalPenonton.map((awal, i) => {
  const p = v.tambah(pion({ nama: `penonton ${i + 1}`, tangan: true, warna: W.pion, skala: 0.85 }));
  p.position.copy(awal);
  p.rotation.y = Math.PI * 1.25;
  return p;
});
jadwal = jadwalIndikator({
  fokus: titik(0, 0.4, 0.4),
  cermin: { fokus: titik(0, -0.1, 0.7), H: 12 },
  langkah: { fokus: titik(0, 0.4, 0.4), H: 16 },
});

muncul([pentas, dekor, cake, ...penonton], { t: 0.6, selesai: 2.0 });
lintas(cake, { t: 12.4, durasi: 1.4, jalur: [cake.position.clone(), titik(-2.65, 0.45, yPentas)], bunyi: { kuat: 0.45 } });
lintas(dekor, { t: 12.4, durasi: 1.4, jalur: [dekor.position.clone(), titik(2.55, 0.55, yPentas)], bunyi: { kuat: 0.45 } });
muncul(stans, { t: 12.4, jeda: 0.4, durasi: 0.5 });
klikEmas(stans, { t: 14.4, durasi: 0.8, lonjak: 0.12 });
penonton.forEach((p, i) => {
  const col = Math.floor(i / 2), row = i % 2;
  const ke = titik(rStan[col] + (row ? 0.27 : -0.27), 0.85 + row * 0.55, 0);
  jalan(p, { t: 15.2 + row * 0.08, durasi: 2.3 - row * 0.08,
    jalur: [awalPenonton[i], ke], hadap: true, bunyi: { kuat: 0.35 } });
});
[2.05, 2.28, 2.51, 2.74].forEach(t => catat({ t, jenis: 'kayu', kuat: 0.22, sumber: 'tepuk penonton', x: 0.5 }));
const jamPita = waktuBeku(6, 6.6);
v.setiapFrame(t => {
  const u = Math.min(t, 18);
  setelKeadaan(pentas, 'abu', 1 - halus(rentang(u, 12.4, 14.4)));
  const geser = halus(rentang(u, 12.4, 13.8));
  dekor.scale.setScalar(1 - 0.78 * geser);
  const ayun = u >= 2 && u < 12.4 ? 0.025 * Math.sin(jamPita(u) * 2.4) : 0;
  dekor.userData.bagian.pita.rotation.x = ayun;
  dekor.userData.bagian.simpul.rotation.x = ayun;
  cake.scale.setScalar(1 - 0.25 * geser);
  petaks.forEach(p => { p.visible = u >= 7 && u < 11.8; });
  penonton.forEach((p, i) => {
    const tepuk = u > 2 && u < 3 ? Math.sin((u - 2) * Math.PI * 8 + i * 0.15) : 0;
    p.position.y += Math.abs(tepuk) * 0.035;
    p.userData.bagian.tangan.forEach((a, j) => {
      a.rotation.x = u > 2 && u < 3 ? -1.1 : 0;
      a.rotation.z = (j ? 1 : -1) * (u > 2 && u < 3 ? 0.8 + tepuk * 0.15 : 0.14);
    });
  });
});
