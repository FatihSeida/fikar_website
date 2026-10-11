// animasi/proyek/__NAMA__: "__JUDUL__"
// Video format evidence, 31 detik, 1080×1920. Dibuat dari templat kit/alat/templat/evidence.
// Panduan singkat (satu-satunya dokumen kit yang perlu dibaca): kit/PANDUAN-EVIDENCE.md.
// Isi brief menggantikan semua nilai contoh di bawah. Baris yang ditandai "GANTI" memang untuk diganti
// (teks, kategori, dunia, adegan Bagian 1–3, benda yang harus muat di kamera).
//
// URUTAN PANGGILAN (jangan dibalik):
//   1. buatVideo({ format: formatEvidence({...}) })       tanpa opsi kamera
//   2. dunia                                              duniaKader(v) atau dunia lain
//   3. adegan Bagian 1–3                                  gerak standar, label3D, v.tambah
//   4. v.setiapFrame                                      keadaan halus yang disetel tiap frame
//   5. akhiriEvidence(v, {...})                           PALING AKHIR. Bagian 4–5 (kuis, kartu akhir) dan seluruh kamera
//                                                         dikerjakan kit; video tidak menulis apa pun lagi untuk keduanya
import {
  buatVideo, formatEvidence, akhiriEvidence, duniaKader, halus, rentang,
  pion, label3D, setelKeadaan,
  muncul, hilang, jalan, klikEmas, denyutCermin,
} from "../../kit/index.js";

// ---------------------------------------------------------------- 1. teks (GANTI semua dengan isi brief)
const v = buatVideo({
  format: formatEvidence({
    nomor: "00", total: 44, kategori: "KADERISASI",                // GANTI: baris "INDIKATOR 00 / 44 · KADERISASI". Kategori ini juga memilih lengkung kuis
                                                                   // yang berdenyut (KADERISASI, TATA KELOLA, PENGETAHUAN, TARGET PROGRAM, EVALUASI DAN ARSIP, DATA DAN JARINGAN)
    judul: "__JUDUL__",
    mode: "ikhtiar",                                               // GANTI bila perlu: "ikhtiar" atau "pandangan" (label Bagian 3)
    gejala: "",                                                    // "" = label GEJALA saja
    sebab: "Satu kalimat sebab, **kata penting** berwarna.",       // GANTI
    ikhtiar: [                                                     // GANTI: 1–3 kalimat, berurutan tanpa tumpang tindih
      { teks: "Kalimat ikhtiar pertama, **kata penting** berwarna.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] },
      { teks: "Kalimat ikhtiar kedua, **kata penting** berwarna.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] },
    ],
    program: "Program 00 · Program 00",                            // GANTI; "" menghapus baris program
    kuis: { pertanyaan: "Pertanyaan yang muncul di kuis?", kalimat: "Ukur komisariatmu, dapatkan laporannya." }, // GANTI
    // ajakan, baca, sumber, label, dan waktu memakai bawaan format. Bila `waktu` diganti, geser juga waktu adegan di bawah;
    // akhiriEvidence mengikuti waktu format sendiri.
  }),
});

// ---------------------------------------------------------------- 2. dunia (GANTI bila brief memakai dunia lain)
// duniaKader disusun untuk H 16, sedangkan kamera evidence memakai H 8–14: gedung kelas dan tangga tidak muat di zona
// pada H itu, jadi contoh ini membuangnya (tanpa). Gerbang dan jalan hanya perlu tampak di Bagian 1.
const d = duniaKader(v, { tanpa: ["kelas", "tangga"] });
const komisariat = d.benda.komisariat;
// Benda latar boleh terpotong saat kamera mendekat: tidak dihitung sebagai benda penting lagi sesudah Bagian 1.
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
// Hanya benda hasil yang menjadi emas. Ganti dengan benda hasil dari brief. Emas ini memudar bersama benda lain
// saat Bagian 4 mulai: di Bagian 4 satu-satunya benda emas adalah lembar laporan dari akhiriEvidence.
const hasil = v.tambah(pion());
hasil.position.copy(d.titik.depanKomisariat);
muncul(hasil, { t: 13.6, naik: 0 });
klikEmas(hasil, { t: 19.0 }); // pion: cincin di kaki yang menjadi emas, badan tidak

// ---------------------------------------------------------------- 4. keadaan yang berubah halus (disetel tiap frame tanpa syarat)
// Komisariat abu sejak awal, melepas abu 20.0–21.0 (saat hasil tercapai). akhiriEvidence menyusutkannya lagi di Bagian 4.
v.setiapFrame((t) => {
  setelKeadaan(komisariat, "abu", 1 - halus(rentang(t, 20.0, 21.0)));
});

// ---------------------------------------------------------------- 5. Bagian 4–5 dan kamera: SATU panggilan, PALING AKHIR
// Sesudah baris ini jangan membuat benda, label, atau setiapFrame baru: benda yang dibuat sesudahnya tidak ikut
// dipudarkan. Gerak berkelanjutan (aliran, debu, figur berjalan) harus sudah selesai sebelum Bagian 4 (23.0).
// kamera: tiap kunci { muat: [benda...], H } memilih fokus yang menaruh benda itu di tengah zona adegan, dan menaikkan H
// bila perlu sampai semuanya muat (H bawaan: gejala 11, sebab 8, ikhtiar 11). Sertakan semua benda dan titik penting kunci itu,
// termasuk puncak lintasan busur (Vector3). tambahan: geseran kamera di tengah bagian, mis. { t: [17.5, 18.5], muat: [...] }.
akhiriEvidence(v, {
  komisariat,
  // kelompok: "kaderisasi",  // hanya bila kategori di atas bukan salah satu dari enam kategori seri, atau ingin lengkung lain
  kamera: {
    fokus: d.fokus,                                     // GANTI bila perlu: fokus untuk kunci yang tidak memakai `muat`
    gejala: { muat: [d.benda.gerbang, komisariat] },    // GANTI: benda yang harus utuh di Bagian 1
    sebab: { muat: [komisariat] },                      // GANTI: benda yang harus utuh di Bagian 2
    ikhtiar: { muat: [hasil, komisariat] },             // GANTI: benda yang harus utuh di Bagian 3
    // tambahan: [{ t: [17.5, 18.5], muat: [hasil, komisariat] }],
  },
});
