// animasi/contoh-evidence: "Kader baru datang, lalu jarang kembali ke komisariat."
// Video uji format evidence, 31 detik, 1080×1920: dunia Kader, teks contoh, dan modul kuis (segmenKuis).
// Dibuat dari templat kit/alat/templat/evidence (npm run baru -- contoh-evidence --format evidence). Dipakai untuk menguji kit
// (Prompt 00 bagian F dan G); teksnya contoh, bukan isi seri 44 indikator. Dokumentasi: kit/docs/halaman.md (formatEvidence),
// inti.md (jadwalEvidence), gerak.md (segmenKuis).
//
// URUTAN PANGGILAN (jangan dibalik):
//   1. buatVideo({ format: formatEvidence({...}), kamera: (t) => jadwal(t) })   jadwal diisi di langkah 6
//   2. dunia                                                                  duniaKader(v) atau dunia lain
//   3. adegan Bagian 1–3                                                      gerak standar, label3D, v.tambah
//   4. v.setiapFrame                                                          keadaan halus yang disetel tiap frame
//   5. segmenKuis(v, {...})                                                   PALING AKHIR: sesudah semua benda, gerak, dan
//                                                                             setiapFrame dibuat; komisariat sudah di tempat akhir
//   6. jadwal = jadwalEvidence({ ..., kuis: { fokus: seg.fokus } })           fokus kuis WAJIB dari segmenKuis
import {
  buatVideo, formatEvidence, jadwalEvidence, segmenKuis, duniaKader, halus, rentang, fokusUntuk,
  pion, label3D, setelKeadaan,
  muncul, hilang, jalan, klikEmas, denyutCermin,
} from "../../kit/index.js";

// ---------------------------------------------------------------- 1. teks (contoh)
// Jadwal kamera diisi sesudah segmenKuis, karena fokus kuis bergantung pada letak komisariat.
let jadwal = null;
const v = buatVideo({
  format: formatEvidence({
    nomor: "00", total: 44, kategori: "CONTOH KIT",                 // baris "INDIKATOR 00 / 44 · CONTOH KIT"
    judul: "Kader baru datang, lalu jarang kembali ke komisariat.",
    mode: "ikhtiar",                                               // "ikhtiar" atau "pandangan" (label Bagian 3)
    gejala: "",                                                    // "" = label GEJALA saja
    sebab: "Yang jarang hadir **tidak pernah disapa**, jadi tidak ada yang tahu alasannya.",
    ikhtiar: [                                                     // 1–3 kalimat, berurutan tanpa tumpang tindih
      { teks: "Kehadiran dicatat tiap pekan dalam **daftar hadir**, jadi yang menghilang terlihat sejak awal.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] },
      { teks: "Tiap kader yang absen **disapa pengurus**, lalu alasannya dicatat.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] },
    ],
    program: "Program 00 · Program 00",                            // "" menghapus baris program
    kuis: { pertanyaan: "Berapa kader baru yang masih hadir tiga bulan kemudian?", kalimat: "Ukur komisariatmu, dapatkan laporannya." },
    // ajakan, baca, sumber, label, dan waktu memakai bawaan format. Bila `waktu` diganti, geser juga waktu adegan di bawah
    // dan ambil mulai kuis serta kunci kamera dari v.format.waktu, bukan dari angka tetap.
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- 2. dunia
// duniaKader disusun untuk H 16, sedangkan kamera evidence memakai H 8–14: gedung kelas dan tangga tidak muat di zona
// pada H itu, jadi contoh ini membuangnya (tanpa). Gerbang dan jalan hanya perlu tampak di Bagian 1.
const d = duniaKader(v, { tanpa: ["kelas", "tangga"] });
const komisariat = d.benda.komisariat;
// Benda latar boleh terpotong saat kamera mendekat: tidak dihitung sebagai benda penting lagi sesudah Bagian 1 (docs/gerak.md, zona).
for (const b of [d.benda.gerbang, d.benda.jalan]) b.userData.penting = (t) => t < 6.0;

// ---------------------------------------------------------------- 3. Bagian 1, Gejala (0.6–6.0)
// Contoh: semua benda dunia muncul, komisariat abu, tiga figur berjalan dari gerbang ke pintu lalu masuk.
muncul(d.urutan, { t: 0.6, selesai: 1.6 });
const arus = [0, 1, 2].map(() => v.tambah(pion()));
arus.forEach((f, i) => {
  const t0 = 1.6 + i * 0.6;
  muncul(f, { t: t0, durasi: 0.4, naik: 0 });
  const j = jalan(f, { t: t0, jalur: d.titik.jalur, lengkung: true, laju: 3.6 });
  if (j.selesai) hilang(f, { t: j.selesai });
});
label3D("KOMISARIAT", { pada: komisariat, geser: [0, 2.15, 0], masuk: 0.8, keluar: [6.0, 6.3] });

// ---------------------------------------------------------------- 3. Bagian 2, sebab (6.0–13.0)
denyutCermin(komisariat, { mulai: 7.0, selesai: 12.8 });

// ---------------------------------------------------------------- 3. Bagian 3, Ikhtiar (13.0–23.0)
// Hanya benda hasil yang menjadi emas. Emas ini memudar bersama benda lain
// saat Bagian 4 mulai: di Bagian 4 satu-satunya benda emas adalah lembar laporan dari segmenKuis.
const hasil = v.tambah(pion());
hasil.position.copy(d.titik.depanKomisariat);
muncul(hasil, { t: 13.6, naik: 0 });
klikEmas(hasil, { t: 19.0 }); // pion: cincin di kaki yang menjadi emas, badan tidak

// ---------------------------------------------------------------- 4. keadaan yang berubah halus (disetel tiap frame tanpa syarat)
// Komisariat abu sejak awal, melepas abu 20.0–21.0 (saat hasil tercapai). segmenKuis menyusutkannya lagi di Bagian 4.
v.setiapFrame((t) => {
  setelKeadaan(komisariat, "abu", 1 - halus(rentang(t, 20.0, 21.0)));
});

// ---------------------------------------------------------------- 5. Bagian 4, Kuis (23.0–28.0): PALING AKHIR
// Sesudah baris ini jangan membuat benda, label, atau setiapFrame baru: benda yang dibuat sesudahnya tidak ikut
// dipudarkan. Gerak berkelanjutan (aliran, debu, figur berjalan) harus sudah selesai sebelum mulai (23.0).
const seg = segmenKuis(v, {
  komisariat,
  kelompok: "kaderisasi", // "kaderisasi" | "tata-kelola" | "pengetahuan" | "target-program" | "evaluasi-arsip" | "data-jaringan"
  mulai: 23.0,
});

// ---------------------------------------------------------------- 6. kamera (Bagian 5 naik sendiri ke H 15)
// Bawaan jadwalEvidence: awal H 13, gejala H 11, sebab H 8, ikhtiar H 11, kuis H 14, akhir H 15. Fokus yang kosong = `fokus`.
// fokusUntuk(benda, { H }) menaruh benda tepat di zona adegan dan memberi peringatan bila bendanya tidak muat pada H itu.
jadwal = jadwalEvidence({
  fokus: d.fokus,
  // Gerbang dan komisariat sekaligus lebar 1327 px pada H 11 (zona 1080), jadi Bagian 1 contoh ini memakai H 14.
  gejala: { H: 14, fokus: fokusUntuk([d.benda.gerbang, komisariat], { H: 14 }) },
  sebab: { fokus: fokusUntuk(komisariat, { H: 8 }) },
  ikhtiar: { fokus: fokusUntuk([hasil, komisariat], { H: 11 }) },
  kuis: { fokus: seg.fokus }, // WAJIB: fokus terowongan audit
  // tambahan: [{ t: [17.5, 18.5], H: 11, fokus: ... }],  geseran kamera di tengah bagian, bila perlu
});
