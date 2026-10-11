// animasi/proyek/__NAMA__: "__JUDUL__"
// Video format indikator, 21 detik, 1080×1920. Dibuat dari templat kit/alat/templat/indikator.
// Isi brief menggantikan semua nilai contoh di bawah (teks, dunia, waktu). Dokumentasi: kit/docs/.
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, halus, rentang,
  pion, rumah, label3D, setelKeadaan,
  muncul, hilang, jalan, klikEmas, denyutCermin,
} from "../../kit/index.js";

// ---------------------------------------------------------------- teks (bagian E brief)
// Jadwal kamera diisi sesudah dunia dibangun, karena fokusnya bergantung pada letak benda.
let jadwal = null;
const v = buatVideo({
  format: formatIndikator({
    nomor: "00", total: 44, kategori: "KATEGORI",
    judul: "__JUDUL__",
    cermin: "Pertanyaan cermin, **kata penting** berwarna.",
    langkah: "Langkah kecil yang bisa dikerjakan, **kata penting** berwarna.",
    ajakan: "ahmadzulfikar.com/kuis",
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- dunia (bagian F brief)
const komisariat = v.tambah(rumah());
komisariat.position.copy(titik(1.6, 0));
komisariat.updateMatrixWorld();
const PINTU = komisariat.localToWorld(komisariat.userData.depanPintu.clone());

// Kamera bagian C.6: fokus awal, fokus benda cermin (tinggi 12), fokus langkah, lalu menjauh di kartu akhir.
jadwal = jadwalIndikator({
  fokus: titik(0, 0),
  cermin: { fokus: PINTU.clone().setY(0.6), H: 12 },
  langkah: { fokus: titik(0, 0) },
});

const figur = v.tambah(pion());

// ---------------------------------------------------------------- Bagian 1, Gejala (0.6–6.0)
muncul(komisariat, { t: 0.4 });
muncul(figur, { t: 0.8, naik: 0 });
const j = jalan(figur, { t: 0.8, jalur: [titik(-3, -2), titik(-1, -0.2), PINTU], lengkung: true });
if (j.selesai) hilang(figur, { t: j.selesai });
label3D("KOMISARIAT", { pada: komisariat, geser: [0, 2.15, 0], masuk: 0.8, keluar: [6.0, 6.3] });

// ---------------------------------------------------------------- Bagian 2, Cermin (6.0–12.0)
denyutCermin(komisariat, { mulai: 7.0, selesai: 11.8 });

// ---------------------------------------------------------------- Bagian 3, Langkah (12.0–18.0)
// Hanya benda hasil yang menjadi emas (B.6). Ganti dengan benda hasil dari brief.
const hasil = v.tambah(pion());
hasil.position.copy(titik(-0.6, 1.4));
muncul(hasil, { t: 12.4 });
klikEmas(hasil, { t: 15.6 }); // pion: cincin di kaki yang menjadi emas, badan tidak

// Keadaan yang berubah halus: disetel setiap frame tanpa syarat.
v.setiapFrame((t) => {
  setelKeadaan(komisariat, "abu", 1 - halus(rentang(t, 15.6, 16.4))); // abu selama gejala
});
