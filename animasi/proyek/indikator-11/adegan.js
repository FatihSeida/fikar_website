// Indikator 11: semua keadaan berasal dari t; final 3D beku pada 18 detik.
import { buatVideo, formatIndikator, jadwalIndikator, titik, fokusUntuk, W,
  duniaJenjang, ruangKarya, stasiunMeja, pion, kartuKecil, balonKata,
  muncul, hilang, jalan, klikEmas, denyutCermin, label3D, keterangan,
  setelKeadaan, aturOpasitas, catat, halus, rentang } from '../../kit/index.js';
import { kabelKarya } from './benda-lokal.js';
let jadwal;
const v = buatVideo({ akhirAdegan: 18,
  format: formatIndikator({ nomor: '11', kategori: 'TATA KELOLA',
    judul: 'Lembaga kekaryaan HMI kurang berfungsi.',
    cermin: 'Lembaga kekaryaan kita punya program, penanggung jawab, dan laporan?',
    langkah: 'Undang, dengar, sepakati dukungannya di rapat cabang.',
    ajakan: 'ahmadzulfikar.com/kuis', penutup: 'Jangan bicara HMI tanpa bukti.' }),
  kamera: t => jadwal(t) });
keterangan({ label: 'ISI KUIS', warna: 'emas', teks: '', top: 1450, masuk: [18.6,19.2], keluar: null });

// Dunia Jenjang dipadatkan; cabang dan ruang karya menjadi pusat narasi.
const d = duniaJenjang(v, {
  posisi: { komisariat1: titik(-3.2,-3), komisariat2: titik(-1.7,-3.3), komisariat3: titik(-3.6,-1.65),
    cabang: titik(.45,-1.05), badko: titik(2.45,-1.9), pb: titik(3.6,.15) },
  opsi: { komisariat: { lebar: .8, tinggi: .6, dalam: .7, atap: .35, lampu: 0 },
    cabang: { lebar: 1.7, tinggi: 2.1, dalam: 1.7, lampu: 0 },
    badko: { lebar: .95, tinggi: 2.7, dalam: .95, baris: 4, kolom: 2, lampu: 0 },
    pb: { lebar: 1.1, tinggi: 3.3, dalam: 1.1, kubus: .5, baris: 5, kolom: 2, lampu: 0 } } });
const latar = d.urutan.filter(b => b !== d.benda.cabang);
latar.forEach(b => { b.userData.penting = t => !(t > 6 && t < 13); });
const karya = v.tambah(ruangKarya({ warna: W.abuGelap, lampu: 0, nama: 'ruang karya' }));
karya.position.copy(titik(-2.3,.15));
karya.traverse(o => { if (o.material && o.isMesh) o.material.userData.warnaAbu = W.abuGelap; });
// Cabang dan meja adalah latar selama Cermin; pusat masalah tetap utuh.
d.benda.cabang.userData.penting = t => !(t>6 && t<13);
const meja = v.tambah(stasiunMeja({ radius: .7, alas: 1.1, kertas: false, nama: 'meja cabang' }));
meja.position.copy(titik(.4,2.15));
meja.userData.penting = t => !(t>6 && t<13);
const kabel = v.tambah(kabelKarya());
muncul(d.urutan, { t: .6, selesai: 1.5, durasi: .4 });
muncul(karya, { t: 1.5, selesai: 2, durasi: .5 });
muncul(kabel, { t: 1.65, durasi: .35, naik: 0 });
muncul(meja, { t: 1.4, durasi: .5 });
denyutCermin(karya, { mulai: 7, selesai: 11.8 });
label3D('CABANG', { pada: d.benda.cabang, geser: [0,2.3,0], gaya: 'mikro', kelas: 'abu', masuk: 1,
  skala: () => 16/v.rig.keadaan.H });

karya.updateMatrixWorld(true);
const pintu = karya.localToWorld(karya.userData.depanPintu.clone());
const tujuan = [titik(-.48,1.9,.1), titik(-.05,3.02,.1), titik(1.2,1.75,.1), titik(1.28,2.8,.1)];
const pengurus = tujuan.map((p,i) => {
  const f = v.tambah(pion({ nama: i<2 ? `pengurus lembaga ${i+1}` : `pengurus cabang ${i-1}` }));
  const awal = i<2 ? pintu.clone().add(titik(i*.32,0)) : titik(1.2+i*.24,.45);
  f.position.copy(awal);
  muncul(f, { t: i<2 ? 12.4+i*.12 : 13.4+(i-2)*.12, durasi: .22, naik: 0 });
  jalan(f, { t: i<2 ? 12.55+i*.1 : 13.4+(i-2)*.12,
    jalur: [awal,p], durasi: i<2 ? 1.3 : .65 });
  return f;
});
[0,2,1].forEach((orang,i) => {
  const b = v.tambah(balonKata({ lebar: .6, tinggi: .29, ekor: .1, opasitas: 1, nama: `balon rapat ${i+1}` }));
  b.position.copy(tujuan[orang]).add(titik(-.06,0,1.08));
  muncul(b, { t: 13.4+i*.4, durasi: .12, naik: .1 });
  hilang(b, { t: 13.7+i*.4, durasi: .1, turun: .05 });
  catat({ t: 13.4+i*.4, jenis: 'balon', posisi: b, kuat: .4, sumber: `balon rapat ${i+1}` });
});
const catatan = v.tambah(kartuKecil({ lebar: .85, panjang: .55, rebah: true, simbol: 'garis', nama: 'catatan sepakat' }));
catatan.position.copy(titik(.4,2.15,.98));
muncul(catatan, { t: 14.6, durasi: .6, naik: .4 });
label3D('DUKUNGAN · TINJAU 1 BULAN', { pada: catatan, gaya: 'kotak', kelas: 'zamrud',
  geser: [0,.42,0], masuk: [14.6,15.2], skala: () => .67*16/v.rig.keadaan.H });
catat({ t: 14.6, jenis: 'kertas', posisi: meja, sumber: 'catatan sepakat' });
catat({ t: 12.4, jenis: 'pintu', durasi: 1, posisi: karya, sumber: 'rolling door' });
catat({ t: 15.2, jenis: 'garis-sambung', durasi: 1, posisi: kabel, sumber: 'kabel karya' });
catat({ t: 16, jenis: 'menyala', posisi: karya, sumber: 'lampu karya' });
catat({ t: 2.2, jenis: 'padam', posisi: karya, sumber: 'lampu karya kedip 1', kuat: .4 });
catat({ t: 3.1, jenis: 'padam', posisi: karya, sumber: 'lampu karya kedip 2', kuat: .4 });
klikEmas(karya, { t: 15.2, durasi: 1, lonjak: .1 });
const fokus = fokusUntuk([karya,d.benda.cabang,meja,...pengurus], { H: 16 });
jadwal = jadwalIndikator({ fokus, cermin: { fokus: fokusUntuk(karya, { H: 12 }), H: 12 }, langkah: { fokus } });
v.setiapFrame(t => {
  const u = Math.min(t,18);
  latar.forEach(b => { setelKeadaan(b,'abu',1); aturOpasitas(b,.27*halus(rentang(u,.6,1.5))); });
  setelKeadaan(d.benda.cabang,'abu',1);
  const pulih = halus(rentang(u,15.2,16.2));
  setelKeadaan(karya,'abu',1-pulih);
  karya.userData.bukaPintu(halus(rentang(u,12.4,13.4)));
  const kedip = (u>=2 && u<2.2) || (u>=2.85 && u<3.1) ? .7 : 0;
  setelKeadaan(karya,'lampu',u < 15.2 ? kedip : pulih);
  kabel.userData.sambung(pulih);
});
