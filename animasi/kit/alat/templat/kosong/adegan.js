// animasi/proyek/__NAMA__: "__JUDUL__"
// Video tanpa format bawaan: tata letak teks dirakit sendiri dari komponen halaman. Dokumentasi: kit/docs/.
import {
  buatVideo, jadwalKamera, titik,
  kepala, keterangan, kartuAkhir,
  pion, muncul,
} from "../../kit/index.js";

const DURASI = 10;
const v = buatVideo({
  durasi: DURASI,
  // Zona adegan untuk periksaZona dan kabut atas/bawah (piksel). Hapus kabut bila tidak perlu.
  zona: { x0: 0, y0: 600, x1: 1080, y1: 1440 },
  kabut: { atas: [420, 600], bawah: [1440, 1630] },
  kamera: jadwalKamera({
    awal: { H: 18, fokus: titik(0, 0) },
    kunci: [{ t: [0, 1.2], H: 14 }],
  }),
  titikPeriksa: [1, 3, 5, 7, 9.5],
});

// ---------------------------------------------------------------- teks
kepala({ judul: "__JUDUL__", masuk: [0.4, 1.0], keluar: [7.0, 7.4] });
keterangan({ label: "LABEL", warna: "zamrudTerang", teks: "Keterangan dengan **kata** berwarna.", masuk: [1.5, 2.0], keluar: [7.0, 7.4] });
kartuAkhir({ ajakan: "ahmadzulfikar.com", waktu: { kepala: [7.6, 8.2], pil: [8.0, 8.6], sumber: [8.4, 9.0] } });

// ---------------------------------------------------------------- dunia dan gerak
const figur = v.tambah(pion());
muncul(figur, { t: 1.0 });
