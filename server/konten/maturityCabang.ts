/**
 * Isi "Maturity Level Cabang": enam dimensi kerja cabang dengan empat tingkat
 * yang sama dengan kuis komisariat, cerita tradisi baik yang hilang, dan daftar
 * panduan serta templat yang bisa diunduh. Disimpan di server dan baru dikirim
 * setelah rilis.
 */

const tingkat = ["Titik Berangkat", "Mulai Mencatat", "Mulai Membaca Bukti", "Bukti Menjadi Kebiasaan"];

const dimensi = [
  {
    id: "mutu-perkaderan", nama: "Mutu perkaderan lintas komisariat",
    tingkat: [
      "Cabang hanya menerima jumlah peserta LK.",
      "Peserta LK dan instruktur tercatat per komisariat, dan ada standar minimum LK.",
      "Keaktifan kader tiga dan enam bulan setelah LK dipantau dan dibahas di rapat.",
      "Hasil pantauan dipakai untuk memperbaiki LK berikutnya.",
    ],
  },
  {
    id: "pendampingan", nama: "Pendampingan komisariat",
    tingkat: [
      "Kondisi komisariat hanya diketahui dari laporan saat forum.",
      "Daftar komisariat, pengurus, dan kontaknya tercatat, dan ada pendamping per komisariat.",
      "Kondisi tiap komisariat diperbarui berkala, dan minimal separuh komisariat sudah mengaudit diri.",
      "Pendampingan disusun dari data kondisi komisariat dan dievaluasi tiap semester.",
    ],
  },
  {
    id: "data", nama: "Data dan pengembalian informasi",
    tingkat: [
      "Tidak ada data anggota se-cabang yang utuh.",
      "Database kader se-cabang diperbarui tiap periode.",
      "Data diolah menjadi ringkasan dan dikembalikan ke komisariat.",
      "Data dipakai dalam keputusan cabang dan dilaporkan ke Badko dan PB.",
    ],
  },
  {
    id: "tata-kelola", nama: "Tata kelola dan konstitusi",
    tingkat: [
      "Dokumen tersebar dan bergantung pada orang tertentu.",
      "SK, notulen, LPJ, dan laporan keuangan tersimpan di satu tempat.",
      "Program punya target, ukuran, dan penanggung jawab, dan keuangan dilaporkan berkala.",
      "Kepatuhan konstitusi diperiksa rutin dan temuannya ditindaklanjuti.",
    ],
  },
  {
    id: "keputusan", nama: "Keputusan dan memori organisasi",
    tingkat: [
      "Keputusan diambil secara lisan, dan serah terima hanya memindahkan jabatan.",
      "Notulen keputusan ditulis.",
      "Keputusan penting mencatat alasan, penanggung jawab, dan waktu evaluasi.",
      "Pengurus baru melanjutkan atau mengubah program berdasarkan catatan pengurus sebelumnya.",
    ],
  },
  {
    id: "pengetahuan", nama: "Pengetahuan dan jejaring",
    tingkat: [
      "Kajian bersifat insidental, dan jejaring bergantung pada senior.",
      "Kajian terjadwal, dan daftar mitra tersedia.",
      "Kajian menghasilkan tulisan atau sikap yang terdokumentasi.",
      "Kajian dipakai untuk program cabang, dan kader dihubungkan dengan mentor sesuai keahliannya.",
    ],
  },
];

/** Buku mengingatkan agar kritik tidak menjadi vonis untuk seluruh HMI, jadi setiap tradisi ditanyakan kembali. */
const tradisi = [
  { id: "dies-natalis", judul: "Dies Natalis yang semarak", cerita: "Dies Natalis dirayakan dengan kegiatan ilmiah, sosial, seni, dan pameran karya kader, bukan sekadar seremoni.", rujukan: "Indikator 12" },
  { id: "debat-tulisan", judul: "Debat terbuka lewat tulisan", cerita: "Pada 1970, gagasan “Islam Yes, Partai Islam No” ditanggapi lebih dari 100 artikel. Perbedaan pendapat dijawab dengan tulisan.", rujukan: "Buku Bab 2" },
  { id: "kelompok-studi", judul: "Kelompok studi dan kajian rutin", cerita: "Kader bertemu rutin untuk membaca, mendiskusikan, dan menuliskan gagasan, dengan jadwal yang tetap.", rujukan: "Indikator 14" },
  { id: "serah-terima", judul: "Serah terima yang memindahkan pelajaran", cerita: "Serah terima memindahkan pekerjaan, catatan, dan pelajaran, bukan hanya jabatan dan stempel.", rujukan: "Indikator 33 dan 43" },
];

const jawabanTradisi = [
  { id: "hidup", label: "Masih hidup di cabangku" },
  { id: "hilang", label: "Sudah hilang" },
  { id: "tidak-tahu", label: "Tidak tahu" },
];

const unduhan = [
  { berkas: "panduan-cabang-berbasis-data.docx", judul: "Panduan membangun organisasi berbasis data", uraian: "Cara menaikkan tingkat setiap dimensi, rencana 90 hari, dan cara memakai templat.", format: "Word" },
  { berkas: "templat-database-kader-cabang.xlsx", judul: "Templat database kader se-cabang", uraian: "Data minimum kader per komisariat, lengkap dengan rekap keaktifan tiga dan enam bulan setelah LK 1.", format: "Excel" },
  { berkas: "templat-rekap-audit-komisariat.xlsx", judul: "Templat rekap audit komisariat", uraian: "Rekap hasil kuis Seberapa Evidence Komisariatmu dari setiap komisariat, dengan retensi dan keterlaksanaan program.", format: "Excel" },
  { berkas: "templat-notulen-keputusan.docx", judul: "Templat notulen keputusan", uraian: "Mencatat keputusan beserta alasan, dasar bukti, penanggung jawab, tenggat, dan waktu evaluasi.", format: "Word" },
  { berkas: "paket-serah-terima.docx", judul: "Paket serah terima", uraian: "Daftar dokumen, data, program berjalan, keputusan penting, dan pelajaran yang diwariskan ke pengurus berikutnya.", format: "Word" },
];

export function kontenMaturityCabang() {
  return {
    judul: "Maturity Level Cabang",
    pembuka: "Komisariat sudah mengaudit dirinya. Sekarang giliran cabang.",
    pengantar: "Nilai enam dimensi kerja cabangmu dengan empat tingkat yang sama seperti kuis komisariat. Pilih bagian yang ingin dinaikkan, unduh panduan dan templatnya, lalu nyatakan komitmen untuk menjalankannya.",
    tingkat,
    dimensi,
    tradisi,
    jawabanTradisi,
    unduhan,
  };
}

export type KontenMaturityCabang = ReturnType<typeof kontenMaturityCabang>;
export const ID_DIMENSI_CABANG = dimensi.map((d) => d.id);
export const ID_TRADISI = tradisi.map((t) => t.id);
export const ID_JAWABAN_TRADISI = jawabanTradisi.map((j) => j.id);
export const BERKAS_UNDUHAN = unduhan.map((u) => u.berkas);
