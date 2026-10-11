import * as THREE from 'three';
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, W, rentang, halus,
  keterangan, pion, ruangAcara, kursiKotak, kartuKecil, balonKata,
  muncul, jalan, lintas, klikEmas, putar, catat,
  bahanPadat, kotakBulat, setelKeadaan,
} from '../../kit/index.js';

const fokusLuas = titik(1.1, 1.1, 0.25);
const jadwal = jadwalIndikator({
  fokus: fokusLuas,
  cermin: { fokus: titik(4.6, 2.6, 0.2), H: 12 },
  langkah: { fokus: titik(1.1, 1.2, 0.25), H: 17.5 },
  buka: { H: 17.5 }, awal: { H: 20.5 }, akhir: { H: 21 },
});
const v = buatVideo({
  akhirAdegan: 18,
  format: formatIndikator({
    nomor: '13', kategori: 'KADERISASI',
    judul: 'Kegiatan HMI sepi dari pengunjung.',
    cermin: 'Siapa yang **tidak datang**, dan pernahkah kita menanyakan alasannya?',
    langkah: '**Tanya yang datang dan yang tidak**, lalu perbaiki kegiatannya.',
  }),
  kamera: jadwal,
});
keterangan({ label: 'ISI KUIS', warna: 'emas', top: 1450, masuk: [18.6, 19.2], naik: 0 });

// Ruang 6 × 5 diputar agar baris dan kolom sejajar sumbu layar r/d.
// Saat Cermin, ruang adalah konteks latar; hanya kelompok absen menjadi fokus.
const konteks = (t) => !(t > 6 && t < 13);
const ruang = v.tambah(ruangAcara({ warna: W.pelat, nama: 'ruang acara', penting: konteks }));
ruang.position.copy(titik(0, 0.4));
ruang.rotation.y = Math.PI / 4;
muncul(ruang, { t: 0.6 });
const kursi = [], kursiP = [];
for (let b = 0; b < 4; b++) {
  for (let c = 0; c < 5; c++) {
    const i = b * 5 + c;
    const p = titik((c - 2) * 1.0, -1.25 + b * 1.1, 0.1);
    const k = v.tambah(kursiKotak({ nama: `kursi ${i + 1}`, penting: konteks }));
    k.position.copy(p); k.rotation.y = Math.PI / 4;
    kursi.push(k); kursiP.push(p);
    muncul(k, { t: 0.85 + b * 0.35, durasi: 0.5 });
  }
}
// Panel belakang tanpa simbol memberi arah hadap pada pion tanpa wajah.
function figur(nama, duduk, warna, penting = true) {
  const g = pion({ nama, duduk, warna, penting });
  const p = kotakBulat(0.22, 0.26, 0.025, bahanPadat(W.abuGelap), { radius: 0.018 });
  p.position.set(0, duduk ? 0.27 : 0.52, -0.183);
  g.add(p);
  return g;
}
const awalIsi = [0, 7, 13, 15];
const tambahanIsi = [1, 2, 4, 6, 9, 11, 18, 16];
const hadir = awalIsi.map((indeks, i) => {
  const g = v.tambah(figur(`hadir ${i + 1}`, true, W.pion, konteks));
  // Pion duduk sudah 0.25 lebih rendah, diangkat ke dudukan kursi.
  g.position.copy(kursiP[indeks]).add(new THREE.Vector3(0, 0.16, 0));
  g.rotation.y = Math.PI / 4;
  muncul(g, { t: 2.4 + i * 0.16, durasi: 0.5 });
  return g;
});
const absenP = [titik(4.15, 1.25), titik(5.0, 1.9), titik(4.15, 3.35), titik(5.0, 4.0)];
const absen = absenP.map((p, i) => {
  const g = v.tambah(figur(`absen ${i + 1}`, false, W.abu));
  g.position.copy(p);
  g.rotation.y = Math.PI * 0.75; // membelakangi ruang di kiri
  muncul(g, { t: 2.4 + i * 0.16, durasi: 0.5 });
  putar(g, { t: 13.6, durasi: 1.2, sudut: -Math.PI });
  return g;
});
// Cermin hanya pada cincin kaki, tanpa mengubah badan atau ruang.
absen.forEach((g, i) => catat({ t: 7, jenis: 'denyut', durasi: 4.8, periode: 1.2, posisi: g, sumber: `cincin absen ${i + 1}`, kuat: 0.3 }));

const hasil = [];
const tumpukan = titik(0.2, 3.65, 0.14);
hadir.forEach((g, i) => {
  const kartu = v.tambah(kartuKecil({ nama: `kartu umpan ${i + 1}`, simbol: 'garis', rebah: false, miring: 0, skala: 0.8 }));
  const start = g.position.clone().add(new THREE.Vector3(0, 1.0, 0)).add(titik(i === 0 ? 0.18 : 0, 0));
  kartu.position.copy(start);
  muncul(kartu, { t: 12.4 + i * 0.18, durasi: 0.66, naik: 0.55 });
  hasil.push({ benda: kartu, dari: start, jenis: 'kartu', i });
});
absen.forEach((g, i) => {
  const balon = v.tambah(balonKata({ nama: `balon alasan ${i + 1}`, isi: 'garis', skala: 0.5, cermin: i % 2 === 1 }));
  const start = g.position.clone().add(new THREE.Vector3(0, 1.13, 0));
  balon.position.copy(start);
  muncul(balon, { t: 13.6 + i * 0.18, durasi: 0.66, naik: 0.3 });
  catat({ t: 13.6 + i * 0.18, jenis: 'balon', posisi: start, sumber: `alasan ${i + 1}`, kuat: 0.4 });
  hasil.push({ benda: balon, dari: start, jenis: 'balon', i: i + 4 });
});
hasil.forEach(({ benda, dari, i }) => {
  klikEmas(benda, { t: 14.8, durasi: 0.8, lonjak: 0.16 });
  const ke = tumpukan.clone().add(new THREE.Vector3(0, i * 0.06, 0));
  const tengah = dari.clone().lerp(ke, 0.5).add(new THREE.Vector3(0, 0.8, 0));
  lintas(benda, { t: 15.03 + i * 0.015, durasi: 0.465, jalur: [dari, tengah, ke], lengkung: true });
  catat({ t: 15.495 + i * 0.015, jenis: 'mendarat', posisi: ke, sumber: `hasil ${i + 1}`, kuat: 0.35 });
});

// Enam orang baru dan dua absen = delapan kursi tambahan, total 12/20.
const pendatang = [];
tambahanIsi.forEach((indeks, i) => {
  const dariAbsen = i >= 6;
  const g = dariAbsen ? absen[i - 6] : v.tambah(figur(`peserta baru ${i + 1}`, false, W.pion));
  // Pendatang masuk dari sisi terdekat ke kursi pada barisnya sendiri.
  const kolom = indeks % 5;
  const sisi = kolom < 3 ? -1 : 1;
  const barisD = -1.25 + Math.floor(indeks / 5) * 1.1;
  const start = dariAbsen ? absenP[i - 6].clone()
    : i < 3 ? titik((kolom - 2) * 1.0, -2.8, 0.1)
    : titik(sisi * 3.45, barisD, 0.1);
  const ke = kursiP[indeks].clone().add(new THREE.Vector3(0, 0.16, 0));
  const t0 = 15.6 + i * 0.08, durasi = 1.44;
  if (!dariAbsen) { g.position.copy(start); muncul(g, { t: t0, durasi: 0.25, naik: 0 }); }
  const jalur = dariAbsen
    ? [start, titik(2.8, i === 6 ? 2.65 : 3.2, 0.1), titik((kolom - 2) * 1.0, i === 6 ? 2.65 : 3.2, 0.1), ke]
    : [start, ke];
  jalan(g, { t: t0, durasi, jalur, lengkung: true, hadap: true });
  pendatang.push({ g, indeks, t0, tiba: t0 + durasi });
});

v.setiapFrame((waktu) => {
  const t = Math.min(waktu, 18);
  const redup = 1 - halus(rentang(t, 15.6, 17.6));
  setelKeadaan(ruang, 'abu', 0.7 * redup);
  kursi.forEach((k, i) => {
    const p = pendatang.find((p) => p.indeks === i);
    const terisi = awalIsi.includes(i) || (p && t >= p.tiba);
    setelKeadaan(k, 'abu', terisi ? 0 : halus(rentang(t, 3.4, 4.4)));
  });
  absen.forEach((g) => {
    const cincin = g.userData.bagian.cincin;
    const aktif = t >= 7 && t <= 11.8;
    const denyut = aktif ? 0.5 - 0.5 * Math.cos((t - 7) * Math.PI * 2 / 1.2) : 0;
    cincin.visible = aktif;
    cincin.scale.setScalar(1 + 0.12 * denyut);
    cincin.material.opacity = 0.6 + 0.4 * denyut;
    cincin.material.emissiveIntensity = 0.5 * denyut;
  });
  pendatang.forEach(({ g, tiba }) => {
    const q = halus(rentang(t, tiba - 0.18, tiba));
    g.scale.y = 1 - 0.24 * q;
    if (q === 1) g.rotation.y = Math.PI / 4;
  });
  hasil.forEach(({ benda, jenis, i }) => {
    const q = halus(rentang(t, 15.03, 15.6));
    benda.rotation.set(0, (i - 3.5) * 0.07 * q, 0);
    const putarMuka = benda.children[0];
    if (jenis === 'kartu') {
      const condong = putarMuka.children[0];
      condong.rotation.x = -Math.PI / 2 * q;
      condong.children[0].position.y = 0.4 * (1 - q) + 0.01 * q;
    } else {
      // Billboard balon punya elevasi awal ISO; putar bidang internal hingga rebah.
      putarMuka.rotation.x = -Math.atan(1 / Math.SQRT2) * (1 - q) - Math.PI / 2 * q;
    }
  });
});
window.INDIKATOR13 = {
  jumlahKursi: kursi.length, jumlahHadirAwal: hadir.length, jumlahAbsen: absen.length,
  jumlahHasil: hasil.length, jumlahPesertaBaru: 6,
  terisiPada: (t) => 4 + pendatang.filter((p) => t >= p.tiba).length,
};
