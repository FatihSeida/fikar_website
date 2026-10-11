// animasi/indikator-06: "Komisariat belum optimal dalam rekrutmen dan pembinaan anggota."
// Video format indikator, 21 detik, 1080×1920. Dibuat dari templat kit/alat/templat/indikator.
// Dunia Kader dengan komisariat terpotong (potongan isometrik). Penyimpangan dari brief ditandai "Brief:".
import * as THREE from "three";
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, halus, rentang, DEG, W,
  duniaKader, pion, garisPutus, panelKertas, setelKeadaan, catat,
  muncul, hilang, jalan, klikEmas, denyutCermin,
} from "../../kit/index.js";

// ---------------------------------------------------------------- teks (bagian E brief)
let jadwal = null;
const v = buatVideo({
  format: formatIndikator({
    nomor: "06", total: 44, kategori: "KADERISASI",
    judul: "Komisariat belum optimal dalam rekrutmen dan pembinaan anggota.",
    cermin: "Siapa penanggung jawab pembinaan setiap angkatan baru?",
    langkah: "Satu angkatan, satu penanggung jawab, lengkap dengan jadwalnya.",
    ajakan: "ahmadzulfikar.com/kuis",
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- dunia (bagian F brief)
// potong: true = rumahPotong 1.4× (dinding depan dipotong rendah, pintu belakang). Kit menggeser komisariat ke
// titik(2.3, 1.9) supaya tetap di zona. Brief: garis atap dimatikan supaya bagian dalam terlihat bersih.
const d = duniaKader(v, { potong: true, opsi: { komisariat: { garisAtap: false } } });
const kom = d.benda.komisariat;
kom.updateMatrixWorld(true);
const T = d.titik;
const DALAM = T.dalam.clone().setY(0);
const lokal = (x, z) => kom.localToWorld(new THREE.Vector3(x, 0, z)).setY(0);
const dariTengah = (r, dd) => titik(r, dd).add(DALAM);
// Titik di jalan 0.5 unit sebelum depan pintu: kader datang "dari jalan".
const UJUNG = T.depanPintu.clone().add(T.ubin[T.ubin.length - 1].clone().sub(T.depanPintu).setY(0).normalize().multiplyScalar(0.5)).setY(0);

// Kamera: cermin ke bagian dalam (resep kit 06: y 1.0, H 12). Langkah: brief titik(2.6, 2.2); fokus dinaikkan
// y 2.0 supaya komisariat, kalender, dan tangga berada di tengah zona adegan, bukan di setengah atasnya.
jadwal = jadwalIndikator({
  fokus: d.fokus,
  cermin: { fokus: T.dalam.clone().setY(1.0), H: 12 },
  langkah: { fokus: titik(2.6, 2.2, 2.0), H: 16 },
});

// Lingkaran garis putus di tempat kosong tengah ruang.
const lingkaran = v.tambah(garisPutus({ lingkaran: 0.48, nama: "tempat kosong" }));
lingkaran.position.copy(T.dalam);

// Pendamping: pion bercincin kaki (tersembunyi sampai emas) dan berlencana, menghadap penonton.
const pendamping = v.tambah(pion({ lencana: true, nama: "pendamping" }));
pendamping.position.copy(T.dalam);
pendamping.rotation.y = 45 * DEG;
const lencana = pendamping.userData.bagian.lencana;

// Kalender (grid 4 pekan × 7 hari) dan daftar hadir di sisi kanan komisariat.
const PEKANAN = [2, 9, 16, 23]; // hari yang sama setiap pekan: jadwal pembinaan
const kalender = v.tambah(panelKertas({
  lebar: 1.2, tinggi: 1.0, grid: [7, 4], kepala: true, cincin: true, terisi: PEKANAN, warnaIsi: W.zamrudPijar, nama: "kalender",
}));
kalender.position.copy(titik(4.85, 2.35));
const daftarHadir = v.tambah(panelKertas({ lebar: 0.9, tinggi: 1.4, baris: 6, cek: true, tercentang: 3, nama: "daftar hadir" }));
daftarHadir.position.copy(titik(5.95, 2.35));

// ---------------------------------------------------------------- Bagian 1, Gejala (0.6–6.0)
muncul(d.urutan, { t: 0.6 });

// Enam kader baru: dari ujung jalan, masuk pintu depan, melintas di tengah ruang, keluar pintu belakang, memudar.
const jalurLewat = new THREE.CatmullRomCurve3([
  UJUNG, T.depanPintu, T.pintu, lokal(-0.4, 0.45), DALAM, lokal(0.4, -0.45), T.pintuBelakang, T.luarBelakang,
].map((p) => p.clone().setY(0)), false, "centripetal");
// Brief: jeda 0.6 s dan rentang 1.6–5.8 hanya menyisakan ±1.2 s per kader, sedangkan jalurnya ±4.4 unit.
// Tiap kader menempuhnya dalam 1.6 s (±2.8 unit/s) supaya kader pertama tepat di pintu belakang pada t 3 (J);
// kader terakhir keluar t 6.2 dan hilang t 6.5, sebelum lingkaran cermin muncul (beku: false).
const LAMA_LEWAT = 1.6;
const kaderLewat = [];
for (let i = 0; i < 6; i++) {
  const f = v.tambah(pion({ nama: `kader baru ${i + 1}` }));
  const t0 = 1.6 + 0.6 * i;
  muncul(f, { t: t0, durasi: 0.3, naik: 0 });
  const j = jalan(f, { t: t0, jalur: jalurLewat, laju: jalurLewat.getLength() / LAMA_LEWAT, frek: 5, beku: false });
  hilang(f, { t: j.selesai, durasi: 0.3 });
  kaderLewat.push({ f, t0, t1: j.selesai });
}

// ---------------------------------------------------------------- Bagian 2, Cermin (6.0–12.0)
muncul(lingkaran, { t: 6.6, durasi: 0.4, naik: 0, bunyi: false });
catat({ t: 6.6, jenis: "garis-sambung", durasi: 0.4, posisi: lingkaran, sumber: "tempat kosong" });
denyutCermin(lingkaran, { mulai: 7.0, selesai: 11.8 });
hilang(lingkaran, { t: 12.5, durasi: 0.4, turun: 0, bunyi: false });

// ---------------------------------------------------------------- Bagian 3, Langkah (12.0–18.0)
muncul(pendamping, { t: 12.4 });
klikEmas(lencana, { t: 12.75 });

// Tiga kader baru masuk pintu depan dan berhenti melingkar di sekitar pendamping, pada sudut layar 0°, 130°, 230°
// (radius 0.8): tidak ada yang tepat di depan atau di belakang pendamping, jadi lencana dan cincin kakinya terlihat.
const keliling = (sudut, R = 0.8) => dariTengah(R * Math.cos(sudut * DEG), R * Math.sin(sudut * DEG));
const TINGGAL = [
  { tujuan: keliling(0), lewat: [dariTengah(-0.1, 0.62)] }, // kanan, lewat depan pendamping
  { tujuan: keliling(230), lewat: [] },                      // kiri belakang
  { tujuan: keliling(130), lewat: [] },                      // kiri depan, dekat pintu
];
TINGGAL.forEach(({ tujuan, lewat }, i) => {
  const f = v.tambah(pion({ nama: `kader tinggal ${i + 1}` }));
  const t0 = 13.0 + 0.2 * i;
  const kurva = new THREE.CatmullRomCurve3([UJUNG, T.depanPintu, T.pintu, lokal(-0.4, 0.5), ...lewat, tujuan].map((p) => p.clone().setY(0)), false, "centripetal");
  muncul(f, { t: t0, durasi: 0.3, naik: 0 });
  jalan(f, { t: t0, jalur: kurva, laju: kurva.getLength() / 1.2 }); // tiba 14.2, 14.4, 14.6
});

// Kalender muncul, empat tanggal menyala zamrud berurutan; daftar hadir muncul di sisinya.
muncul(kalender, { t: 14.6, durasi: 0.4, bunyi: { jenis: "kertas" } });
muncul(daftarHadir, { t: 14.72, durasi: 0.4, bunyi: { jenis: "kertas" } });
muncul(PEKANAN.map((i) => kalender.userData.bagian.isiPetak[i]), { t: 14.85, jeda: 0.2, durasi: 0.25, naik: 0, skala: 0.4, bunyi: { jenis: "menyala" } });

// Daftar hadir terisi tiga centang; lencana (sudah emas sejak 12.75) dan cincin kaki pendamping emas penuh.
muncul(daftarHadir.userData.bagian.centang.slice(0, 3), { t: 15.6, jeda: 0.3, durasi: 0.25, naik: 0, skala: 0.5, bunyi: { jenis: "centang" } });
klikEmas(pendamping, { t: 15.75, lonjak: 0 }); // pion: hanya cincin kaki yang menjadi emas, emissive 0 → 0.9 dalam 0.8 s

// Keadaan yang disetel setiap frame tanpa syarat.
const LATAR = ["gerbang", "kelas", "jalan", "tangga"].map((n) => d.benda[n]);
v.setiapFrame((t) => {
  setelKeadaan(kom, "abu", 1 - halus(rentang(t, 12.4, 13.2))); // ruang kosong abu sampai pendamping datang
  // Pudar mulai sesudah tengah ruang, sekitar 0.45 di ambang pintu belakang (masih terbaca), lalu hilang di luar.
  for (const { f, t0, t1 } of kaderLewat) setelKeadaan(f, "pudar", halus(rentang(t, t0 + 0.55 * (t1 - t0), t1 + 0.35)));
  setelKeadaan(pendamping, "lencana", halus(rentang(t, 12.7, 12.8)));
  // Sejak Cermin kamera berfokus ke komisariat (brief): benda latar dunia boleh terpotong tepi layar dan kabut.
  for (const b of LATAR) b.userData.penting = t < 6;
});
