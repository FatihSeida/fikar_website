import { indikator, type KelompokId } from "./indikator";

/** Setiap pilihan membawa temuan audit dan satu langkah konkret untuk naik satu tingkat. */
export interface PilihanKuis { label: string; skor: 0 | 1 | 2 | 3; temuan: string; langkah: string; }
/** Kelompok audit lanjutan: kader setelah LK 2 (nalar) dan setelah LK 3 (profesionalisme). */
export type KelompokLanjutanId = "pasca-lk2" | "pasca-lk3";
export type KelompokKuis = KelompokId | KelompokLanjutanId;
export interface PertanyaanKuis {
  id: string;
  teks: string;
  kelompok: KelompokKuis;
  indikatorTerkait: number[];
  pilihan: readonly PilihanKuis[];
  /** Program kampanye terkait; bila kosong diturunkan dari indikator terkait. */
  program?: string[];
}
export interface TingkatHasil { min: number; max: number; judul: string; uraian: string; }
export interface SaranKelompok { saran: string; program: string[]; }

/** Kuis "Seberapa Evidence Komisariatmu?": 20 pertanyaan inti, skor 0–3 per pertanyaan, total 0–60. */
export const pertanyaanKuis: readonly PertanyaanKuis[] = [
  // Kaderisasi (5)
  {
    id: "q01",
    teks: "Tiga bulan setelah LK 1, berapa banyak peserta dari komisariatmu yang masih aktif?",
    kelompok: "kaderisasi",
    indikatorTerkait: [17, 6],
    pilihan: [
      {
        label: "Kami tidak tahu",
        skor: 0,
        temuan: "Komisariat kehilangan jejak kader baru setelah LK 1. Tanpa angka, penurunan baru terasa ketika sudah terlambat untuk dicegah.",
        langkah: "Mulai dari satu daftar: nama dan kontak peserta LK 1 terakhir. Bulan depan, tandai siapa yang masih hadir di forum komisariat.",
      },
      {
        label: "Kira-kira tahu, tapi tidak tercatat",
        skor: 1,
        temuan: "Komisariat merasakan kader berkurang, tetapi tanpa angka tidak ada yang bisa memastikan seberapa parah atau sejak kapan.",
        langkah: "Buat daftar peserta LK 1 terakhir, lalu tandai siapa yang hadir di dua forum terakhir. Ulangi setiap bulan.",
      },
      {
        label: "Tercatat untuk sebagian angkatan",
        skor: 2,
        temuan: "Pencatatan sudah dimulai, tetapi belum menjadi kebiasaan, sehingga satu angkatan belum bisa dibandingkan dengan angkatan lain.",
        langkah: "Pakai satu format yang sama untuk semua angkatan dan tetapkan satu pengurus yang memperbaruinya setiap bulan.",
      },
      {
        label: "Tercatat rutin dan dibahas di rapat",
        skor: 3,
        temuan: "Retensi kader sudah diukur dan dibicarakan. Ini fondasi kaderisasi berbasis bukti.",
        langkah: "Pertahankan dengan membandingkan angka antarangkatan, lalu bagikan cara pencatatannya kepada komisariat lain di cabangmu.",
      },
    ],
  },
  {
    id: "q02",
    teks: "Setelah LK 1, apakah setiap kader baru di komisariatmu punya pendamping yang jelas?",
    kelompok: "kaderisasi",
    indikatorTerkait: [17, 31, 6],
    pilihan: [
      {
        label: "Tidak ada pendamping khusus",
        skor: 0,
        temuan: "Kader baru dibiarkan mencari jalannya sendiri setelah LK 1, padahal masa inilah yang paling rawan membuat kader berhenti.",
        langkah: "Pasangkan setiap kader baru dengan satu pengurus atau senior sebagai pendamping, cukup untuk tiga bulan pertama.",
      },
      {
        label: "Ada, tapi tergantung siapa yang sempat",
        skor: 1,
        temuan: "Pendampingan bergantung pada siapa yang sempat, sehingga sebagian kader terdampingi dan sebagian lain terlewat.",
        langkah: "Tetapkan nama pendamping untuk setiap kader baru dan umumkan di rapat, supaya tidak ada kader yang terlewat.",
      },
      {
        label: "Ada pendamping tetap, tapi pertemuannya tidak dicatat",
        skor: 2,
        temuan: "Pendamping sudah ada, tetapi tanpa catatan pertemuan tidak ada yang tahu apakah pendampingan benar-benar berjalan.",
        langkah: "Minta pendamping mencatat tanggal dan inti setiap pertemuan di satu lembar bersama, lalu tinjau sebulan sekali.",
      },
      {
        label: "Setiap kader punya pendamping dengan jadwal dan catatan pertemuan",
        skor: 3,
        temuan: "Pendampingan sudah terstruktur dan terpantau. Kader baru punya tempat bertanya yang jelas.",
        langkah: "Pertahankan dengan membekali pendamping secara berkala dan menilai pendampingan dari berapa kader yang tetap aktif.",
      },
    ],
  },
  {
    id: "q03",
    teks: "Bagaimana komisariatmu mengetahui Student Needs dan Student Interest mahasiswa di kampus?",
    kelompok: "kaderisasi",
    indikatorTerkait: [2, 1, 19],
    pilihan: [
      {
        label: "Tidak pernah secara khusus mencari tahu",
        skor: 0,
        temuan: "Program disusun tanpa mengetahui kebutuhan mahasiswa, sehingga HMI mudah terasa jauh dari keseharian kampus.",
        langkah: "Ajukan tiga pertanyaan sederhana kepada 20 mahasiswa baru: apa yang mereka butuhkan, minati, dan harapkan dari organisasi.",
      },
      {
        label: "Dari obrolan dan kesan pengurus",
        skor: 1,
        temuan: "Gambaran kebutuhan mahasiswa hanya berasal dari kesan pengurus, yang belum tentu mewakili mahasiswa di luar lingkaran HMI.",
        langkah: "Uji kesan itu dengan survei singkat lewat formulir daring, lalu bandingkan hasilnya dengan dugaan pengurus.",
      },
      {
        label: "Pernah survei atau diskusi, tapi tidak rutin",
        skor: 2,
        temuan: "Komisariat pernah mendengar mahasiswa, tetapi hasilnya cepat usang karena tidak diulang.",
        langkah: "Jadwalkan survei yang sama setiap awal semester dan simpan hasilnya supaya perubahan kebutuhan mahasiswa terlihat.",
      },
      {
        label: "Ada survei atau pemetaan berkala yang dipakai menyusun program",
        skor: 3,
        temuan: "Program komisariat berangkat dari kebutuhan mahasiswa yang dipetakan secara berkala.",
        langkah: "Pertahankan dengan menuliskan kebutuhan yang dijawab oleh setiap program, lalu bagikan hasil pemetaannya ke cabang.",
      },
    ],
  },
  {
    id: "q04",
    teks: "Setelah LK 1, adakah agenda belajar lanjutan untuk kader baru di komisariatmu?",
    kelompok: "kaderisasi",
    indikatorTerkait: [10, 17, 3],
    pilihan: [
      {
        label: "Tidak ada, kader menunggu kegiatan berikutnya",
        skor: 0,
        temuan: "LK 1 berhenti sebagai acara, bukan awal proses belajar. Kader baru kehilangan semangat ketika tidak ada agenda sesudahnya.",
        langkah: "Susun satu agenda belajar bulanan untuk kader baru, misalnya diskusi buku atau materi ke-HMI-an yang belum tuntas di LK 1.",
      },
      {
        label: "Ada kegiatan, tapi tidak dirancang sebagai kelanjutan latihan",
        skor: 1,
        temuan: "Kegiatan ada, tetapi tidak menyambung dengan materi latihan, sehingga belajar kader berjalan tanpa arah.",
        langkah: "Petakan materi LK 1, lalu pilih kegiatan berikutnya yang memperdalam salah satu materi itu.",
      },
      {
        label: "Ada agenda lanjutan, tapi belum berjalan rutin",
        skor: 2,
        temuan: "Agenda lanjutan sudah dirancang, tetapi belum rutin, sehingga kader sulit membangun kebiasaan belajar.",
        langkah: "Kunci jadwal agenda lanjutan untuk satu semester penuh dan tunjuk penanggung jawab tetapnya.",
      },
      {
        label: "Ada agenda lanjutan yang terjadwal dan dievaluasi",
        skor: 3,
        temuan: "Kader baru punya jalur belajar yang jelas dan dievaluasi setelah LK 1.",
        langkah: "Pertahankan dengan mengukur apa yang berubah pada kader setelah agenda lanjutan, bukan hanya berapa yang hadir.",
      },
    ],
  },
  {
    id: "q05",
    teks: "Ketika ada kader yang berhenti aktif, apakah komisariatmu menanyakan alasannya?",
    kelompok: "kaderisasi",
    indikatorTerkait: [17, 13, 1],
    pilihan: [
      {
        label: "Tidak pernah ditanyakan",
        skor: 0,
        temuan: "Kader yang berhenti tidak pernah ditanya, sehingga penyebab yang sama bisa terus berulang tanpa disadari.",
        langkah: "Hubungi tiga kader yang terakhir berhenti aktif dan tanyakan alasannya dengan terbuka, tanpa menyalahkan.",
      },
      {
        label: "Kadang, lewat obrolan santai",
        skor: 1,
        temuan: "Alasan kader berhenti hanya terdengar sepintas dan cepat terlupakan, sehingga tidak pernah menjadi bahan keputusan.",
        langkah: "Catat setiap alasan yang terdengar di satu daftar sederhana, lengkap dengan tanggalnya.",
      },
      {
        label: "Ditanyakan dan dicatat untuk sebagian kader",
        skor: 2,
        temuan: "Alasan sudah dicatat untuk sebagian kader, tetapi belum cukup untuk melihat polanya.",
        langkah: "Tanyakan kepada semua kader yang berhenti, lalu kelompokkan alasannya setiap semester untuk dibahas di rapat.",
      },
      {
        label: "Ditanyakan, dicatat, dan dijadikan bahan perbaikan",
        skor: 3,
        temuan: "Komisariat belajar dari kader yang pergi. Ini jarang dilakukan dan sangat berharga.",
        langkah: "Pertahankan dengan melaporkan perubahan yang lahir dari temuan itu, supaya kader melihat suaranya didengar.",
      },
    ],
  },

  // Tata Kelola (4)
  {
    id: "q06",
    teks: "Apakah pembagian tugas dan kewenangan setiap pengurus di komisariatmu tertulis jelas?",
    kelompok: "tata-kelola",
    indikatorTerkait: [8, 41],
    pilihan: [
      {
        label: "Tidak tertulis, berjalan sesuai kebiasaan",
        skor: 0,
        temuan: "Tugas berjalan menurut kebiasaan, sehingga pekerjaan menumpuk pada orang yang sama dan tanggung jawab sulit ditagih.",
        langkah: "Tuliskan satu halaman berisi tugas dan kewenangan setiap jabatan, lalu sepakati bersama di rapat pengurus.",
      },
      {
        label: "Tertulis di SK, tapi tidak dirinci",
        skor: 1,
        temuan: "Jabatan tercantum di SK, tetapi isi tugasnya tidak jelas, sehingga batas tanggung jawab mudah kabur.",
        langkah: "Rinci setiap jabatan di SK menjadi tiga sampai lima tugas utama beserta hasil yang diharapkan.",
      },
      {
        label: "Tertulis rinci, tapi jarang dirujuk",
        skor: 2,
        temuan: "Uraian tugas sudah ada, tetapi tidak dipakai, sehingga hanya menjadi dokumen formal.",
        langkah: "Buka uraian tugas di setiap rapat evaluasi dan periksa bersama tugas mana yang berjalan dan mana yang terbengkalai.",
      },
      {
        label: "Tertulis rinci dan diperiksa bersama secara berkala",
        skor: 3,
        temuan: "Pembagian tugas jelas dan diperiksa bersama. Tanggung jawab bisa ditagih secara adil.",
        langkah: "Pertahankan dengan menyerahkan uraian tugas beserta catatan pelaksanaannya kepada pengurus berikutnya.",
      },
    ],
  },
  {
    id: "q07",
    teks: "Bagaimana laporan keuangan komisariatmu disampaikan?",
    kelompok: "tata-kelola",
    indikatorTerkait: [8, 29],
    pilihan: [
      {
        label: "Tidak ada laporan keuangan",
        skor: 0,
        temuan: "Tanpa laporan keuangan, kepercayaan kader bergantung pada niat baik pengurus dan mudah runtuh oleh satu kecurigaan.",
        langkah: "Mulai catat setiap pemasukan dan pengeluaran di satu tabel sederhana, lengkap dengan bukti transaksinya.",
      },
      {
        label: "Hanya disampaikan di akhir periode",
        skor: 1,
        temuan: "Laporan baru muncul di akhir periode, ketika kesalahan sudah terlambat untuk diperbaiki.",
        langkah: "Sampaikan ringkasan keuangan setiap bulan di rapat pengurus, cukup berupa saldo, pemasukan, dan pengeluaran.",
      },
      {
        label: "Dilaporkan berkala, tapi hanya kepada sebagian pengurus",
        skor: 2,
        temuan: "Laporan sudah rutin, tetapi hanya sebagian pengurus yang bisa memeriksanya, sehingga akuntabilitasnya belum utuh.",
        langkah: "Simpan laporan dan bukti transaksi di folder yang bisa dibuka seluruh pengurus.",
      },
      {
        label: "Dilaporkan berkala dan dapat diperiksa seluruh pengurus",
        skor: 3,
        temuan: "Keuangan komisariat terbuka dan bisa diperiksa. Ini modal kepercayaan yang kuat.",
        langkah: "Pertahankan dengan menyerahkan laporan dan bukti lengkap saat serah terima, lalu tawarkan formatnya kepada komisariat lain.",
      },
    ],
  },
  {
    id: "q08",
    teks: "Ketika ada kader yang menyampaikan kritik di rapat komisariatmu, apa yang biasanya terjadi?",
    kelompok: "tata-kelola",
    indikatorTerkait: [32],
    pilihan: [
      {
        label: "Kritik jarang muncul atau cenderung dihindari",
        skor: 0,
        temuan: "Rapat yang sepi kritik bukan tanda semuanya baik. Masalah tetap ada, hanya tidak dibicarakan.",
        langkah: "Sediakan satu sesi tetap di setiap rapat untuk masukan dan kritik, dimulai dari pengurus inti yang meminta dikritik.",
      },
      {
        label: "Kritik muncul, tapi sering dianggap serangan pribadi",
        skor: 1,
        temuan: "Kritik muncul, tetapi diterima sebagai serangan pribadi, sehingga kader belajar untuk diam.",
        langkah: "Sepakati aturan rapat: kritik ditujukan pada kerja, bukan orang, dan setiap kritik disertai alasan atau data.",
      },
      {
        label: "Kritik didengar, tapi tindak lanjutnya tidak jelas",
        skor: 2,
        temuan: "Kritik didengar, tetapi tanpa tindak lanjut kader bisa merasa suaranya sia-sia.",
        langkah: "Catat setiap kritik di notulensi beserta penanggung jawab tindak lanjutnya, lalu laporkan kemajuannya di rapat berikutnya.",
      },
      {
        label: "Kritik yang beralasan dicatat dan ditindaklanjuti",
        skor: 3,
        temuan: "Kritik yang beralasan menjadi bahan perbaikan. Ini ciri organisasi yang mau belajar.",
        langkah: "Pertahankan dengan menunjukkan perubahan yang lahir dari kritik kader, supaya budaya ini bertahan saat kepengurusan berganti.",
      },
    ],
  },
  {
    id: "q09",
    teks: "Jika terjadi pelanggaran etika atau aturan organisasi, bagaimana komisariatmu menanganinya?",
    kelompok: "tata-kelola",
    indikatorTerkait: [39, 41],
    pilihan: [
      {
        label: "Belum ada cara yang jelas",
        skor: 0,
        temuan: "Tanpa cara yang jelas, pelanggaran ditangani menurut suasana, sehingga keputusannya mudah dianggap tidak adil.",
        langkah: "Pelajari ketentuan konstitusi tentang pelanggaran, lalu tuliskan alurnya dalam satu halaman yang bisa dibaca kader.",
      },
      {
        label: "Diselesaikan secara kekeluargaan tanpa catatan",
        skor: 1,
        temuan: "Penyelesaian kekeluargaan menjaga suasana, tetapi tanpa catatan kasus serupa bisa diperlakukan berbeda.",
        langkah: "Tetap utamakan musyawarah, tetapi catat setiap kasus, keputusan, dan alasannya secara tertutup.",
      },
      {
        label: "Merujuk konstitusi, tapi prosesnya tidak selalu tercatat",
        skor: 2,
        temuan: "Konstitusi sudah menjadi rujukan, tetapi proses yang tidak tercatat sulit dipertanggungjawabkan.",
        langkah: "Catat setiap tahapan penanganan, dari laporan sampai keputusan, dan simpan di arsip dengan akses terbatas.",
      },
      {
        label: "Ada alur yang adil sesuai konstitusi, tercatat, dan diketahui kader",
        skor: 3,
        temuan: "Penegakan aturan berjalan adil, tercatat, dan diketahui kader.",
        langkah: "Pertahankan dengan memperkenalkan alur ini kepada setiap angkatan kader baru.",
      },
    ],
  },

  // Pengetahuan (3)
  {
    id: "q10",
    teks: "Dalam tiga bulan terakhir, berapa tulisan atau kajian yang dihasilkan kader komisariatmu?",
    kelompok: "pengetahuan",
    indikatorTerkait: [14, 15],
    pilihan: [
      {
        label: "Tidak ada",
        skor: 0,
        temuan: "Tanpa tulisan, gagasan kader hilang begitu diskusi selesai, dan komisariat sulit dikenal karena pemikirannya.",
        langkah: "Minta setiap diskusi menghasilkan satu tulisan pendek, lalu terbitkan di media sosial atau blog komisariat.",
      },
      {
        label: "Satu atau dua, atas inisiatif pribadi",
        skor: 1,
        temuan: "Tulisan lahir dari inisiatif pribadi, sehingga tradisi menulis bergantung pada satu atau dua orang.",
        langkah: "Bentuk lingkar menulis kecil yang bertemu dua pekan sekali untuk saling membaca dan menyunting tulisan.",
      },
      {
        label: "Beberapa, tapi belum diterbitkan atau diarsipkan",
        skor: 2,
        temuan: "Kader sudah menulis, tetapi karya yang tidak diterbitkan atau diarsipkan mudah hilang dan tidak berdampak.",
        langkah: "Siapkan satu tempat terbit dan satu folder arsip untuk semua tulisan kader, sekecil apa pun.",
      },
      {
        label: "Rutin dihasilkan, diterbitkan, dan diarsipkan",
        skor: 3,
        temuan: "Tradisi menulis hidup dan karyanya terjaga.",
        langkah: "Pertahankan dengan menyusun kumpulan tulisan setiap periode dan membagikannya ke cabang serta kampus.",
      },
    ],
  },
  {
    id: "q11",
    teks: "Saat berdiskusi tentang suatu isu, apakah kader komisariatmu membawa data atau bacaan?",
    kelompok: "pengetahuan",
    indikatorTerkait: [42, 14],
    pilihan: [
      {
        label: "Jarang, lebih banyak opini",
        skor: 0,
        temuan: "Diskusi yang didominasi opini sulit menghasilkan kesimpulan yang bisa diuji atau dipakai.",
        langkah: "Sepakati satu aturan sederhana: setiap pemantik diskusi membawa minimal satu bacaan atau data.",
      },
      {
        label: "Hanya sebagian kecil kader yang membawa sumber",
        skor: 1,
        temuan: "Hanya segelintir kader yang membawa sumber, sehingga mutu diskusi bergantung pada mereka.",
        langkah: "Bagikan bahan bacaan sebelum diskusi, supaya semua kader datang dengan bekal yang sama.",
      },
      {
        label: "Cukup sering, tapi belum menjadi kebiasaan bersama",
        skor: 2,
        temuan: "Kebiasaan membawa sumber mulai tumbuh, tetapi belum menjadi standar bersama.",
        langkah: "Minta moderator menanyakan sumber setiap klaim penting, dan catat daftar bacaannya di notulensi.",
      },
      {
        label: "Sudah menjadi kebiasaan, setiap pendapat disertai sumber",
        skor: 3,
        temuan: "Diskusi komisariat berpijak pada data dan bacaan. Ini inti tradisi intelektual HMI.",
        langkah: "Pertahankan dengan menyusun daftar bacaan bersama yang terus diperbarui untuk kader baru.",
      },
    ],
  },
  {
    id: "q12",
    teks: "Pernahkah komisariatmu mengkaji persoalan nyata di sekitar kampus, lalu menuliskan usulan solusinya?",
    kelompok: "pengetahuan",
    indikatorTerkait: [15, 38, 30],
    pilihan: [
      {
        label: "Belum pernah",
        skor: 0,
        temuan: "Persoalan di sekitar kampus belum menjadi bahan kajian, sehingga manfaat kehadiran HMI kurang terasa.",
        langkah: "Pilih satu persoalan nyata di kampus, kumpulkan faktanya, lalu diskusikan kemungkinan solusinya.",
      },
      {
        label: "Pernah dibahas, tapi tidak dituliskan",
        skor: 1,
        temuan: "Persoalan sudah dibahas, tetapi tanpa tulisan hasil pembahasan tidak bisa disampaikan kepada siapa pun.",
        langkah: "Tuliskan hasil pembahasan menjadi satu atau dua halaman usulan: masalah, bukti, dan solusi yang ditawarkan.",
      },
      {
        label: "Pernah dikaji dan dituliskan, sesekali",
        skor: 2,
        temuan: "Kajian sudah pernah dituliskan, tetapi masih sesekali dan belum sampai ke pihak yang bisa bertindak.",
        langkah: "Jadwalkan satu kajian setiap semester dan sampaikan hasilnya kepada pihak kampus atau instansi terkait.",
      },
      {
        label: "Rutin dikaji, dituliskan, dan disampaikan kepada pihak terkait",
        skor: 3,
        temuan: "Komisariat menjawab persoalan nyata dengan kajian yang sampai ke pengambil keputusan.",
        langkah: "Pertahankan dengan mencatat tanggapan dan perubahan yang terjadi setelah setiap usulan disampaikan.",
      },
    ],
  },

  // Target Program (3)
  {
    id: "q13",
    teks: "Saat menyusun program kerja, apakah setiap program komisariatmu punya target yang bisa diukur?",
    kelompok: "target-program",
    indikatorTerkait: [25],
    pilihan: [
      {
        label: "Tidak, program ditulis sebagai daftar kegiatan",
        skor: 0,
        temuan: "Program yang hanya berupa daftar kegiatan membuat keberhasilan diukur dari terlaksana atau tidak, bukan dari manfaatnya.",
        langkah: "Untuk setiap program, tuliskan satu kalimat: masalah apa yang ingin dijawab dan apa tanda keberhasilannya.",
      },
      {
        label: "Ada target, tapi umum dan sulit diukur",
        skor: 1,
        temuan: "Target sudah ada, tetapi terlalu umum, sehingga di akhir periode tidak bisa dinilai tercapai atau belum.",
        langkah: "Ubah setiap target menjadi angka atau keadaan yang bisa diperiksa, misalnya jumlah kader yang tetap aktif.",
      },
      {
        label: "Sebagian program punya target terukur",
        skor: 2,
        temuan: "Sebagian program sudah terukur, sebagian lain masih berjalan tanpa ukuran.",
        langkah: "Lengkapi program yang belum terukur dengan keadaan awal dan satu ukuran hasil sebelum dijalankan.",
      },
      {
        label: "Setiap program punya keadaan awal dan ukuran hasil yang jelas",
        skor: 3,
        temuan: "Setiap program punya titik awal dan ukuran hasil. Keberhasilan bisa dibuktikan.",
        langkah: "Pertahankan dengan melaporkan hasil setiap program terhadap ukurannya, termasuk yang belum tercapai.",
      },
    ],
  },
  {
    id: "q14",
    teks: "Dari program yang direncanakan di awal periode, berapa yang benar-benar terlaksana?",
    kelompok: "target-program",
    indikatorTerkait: [24, 27],
    pilihan: [
      {
        label: "Tidak tahu, tidak pernah dihitung",
        skor: 0,
        temuan: "Tanpa hitungan, rencana dan kenyataan tidak pernah dibandingkan, sehingga program mudah ditulis tetapi tidak dijalankan.",
        langkah: "Buat daftar semua program periode ini dan tandai statusnya: belum, berjalan, atau selesai.",
      },
      {
        label: "Kira-kira sebagian, tapi tidak tercatat",
        skor: 1,
        temuan: "Pengurus merasa sebagian program berjalan, tetapi tanpa catatan tidak ada yang tahu mana yang tertinggal.",
        langkah: "Catat status setiap program di satu tabel bersama dan perbarui setiap bulan.",
      },
      {
        label: "Dihitung, tapi hanya di akhir periode",
        skor: 2,
        temuan: "Keterlaksanaan baru dihitung di akhir periode, ketika program yang tertinggal sudah tidak bisa dikejar.",
        langkah: "Tinjau status program setiap tiga bulan, supaya program yang macet bisa dibantu atau dirancang ulang.",
      },
      {
        label: "Dipantau berkala sepanjang periode dan dibahas di rapat",
        skor: 3,
        temuan: "Program dipantau sepanjang periode. Rencana dan tindakan berjalan beriringan.",
        langkah: "Pertahankan dengan mewariskan tabel pemantauan beserta pelajarannya kepada pengurus berikutnya.",
      },
    ],
  },
  {
    id: "q15",
    teks: "Saat menilai komisariatmu berkembang atau mundur, apa yang dipakai sebagai dasar?",
    kelompok: "target-program",
    indikatorTerkait: [35],
    pilihan: [
      {
        label: "Perasaan dan kesan pengurus",
        skor: 0,
        temuan: "Menilai komisariat dari perasaan membuat penurunan mudah diabaikan dan keberhasilan mudah dilebihkan.",
        langkah: "Pilih tiga angka dasar, misalnya jumlah kader aktif, kegiatan, dan tulisan, lalu catat setiap bulan.",
      },
      {
        label: "Ramai atau sepinya kegiatan terakhir",
        skor: 1,
        temuan: "Ramai atau sepinya kegiatan terakhir mudah menipu, karena satu acara besar bisa menutupi penurunan jangka panjang.",
        langkah: "Catat angka yang sama setiap bulan supaya penilaian tidak bergantung pada kegiatan terakhir.",
      },
      {
        label: "Beberapa angka, tapi tidak dibandingkan dari waktu ke waktu",
        skor: 2,
        temuan: "Angka sudah ada, tetapi tanpa pembanding belum bisa menunjukkan komisariat maju atau mundur.",
        langkah: "Susun tabel sederhana yang membandingkan angka yang sama dari bulan ke bulan dan dari periode ke periode.",
      },
      {
        label: "Angka dasar yang dicatat rutin dan dibandingkan antarperiode",
        skor: 3,
        temuan: "Perkembangan komisariat dinilai dengan angka yang dibandingkan antarperiode.",
        langkah: "Pertahankan dengan menyerahkan data dasar kepada pengurus berikutnya, supaya perbandingannya tidak terputus.",
      },
    ],
  },

  // Evaluasi dan Arsip (3)
  {
    id: "q16",
    teks: "Setelah sebuah kegiatan selesai, apakah komisariatmu membuat evaluasi tertulis?",
    kelompok: "evaluasi-arsip",
    indikatorTerkait: [18],
    pilihan: [
      {
        label: "Tidak ada evaluasi",
        skor: 0,
        temuan: "Tanpa evaluasi, kesalahan yang sama berulang di kegiatan berikutnya dan keberhasilan tidak bisa ditiru.",
        langkah: "Setelah setiap kegiatan, luangkan 15 menit untuk tiga pertanyaan: apa yang berhasil, apa yang gagal, dan apa yang perlu diubah.",
      },
      {
        label: "Evaluasi lisan, tidak dicatat",
        skor: 1,
        temuan: "Evaluasi lisan cepat terlupakan dan tidak sampai kepada panitia kegiatan berikutnya.",
        langkah: "Tuliskan hasil evaluasi lisan itu dalam satu halaman dan simpan di arsip bersama.",
      },
      {
        label: "Evaluasi tertulis untuk sebagian kegiatan",
        skor: 2,
        temuan: "Evaluasi tertulis sudah ada untuk sebagian kegiatan, tetapi belum menjadi standar.",
        langkah: "Jadikan evaluasi tertulis syarat penutupan setiap kegiatan, dengan format yang sama.",
      },
      {
        label: "Evaluasi tertulis rutin dan dibaca saat merancang kegiatan berikutnya",
        skor: 3,
        temuan: "Evaluasi tertulis dipakai untuk merancang kegiatan berikutnya. Komisariat belajar dari pengalamannya sendiri.",
        langkah: "Pertahankan dengan merangkum pelajaran utama setiap semester untuk dibaca pengurus baru.",
      },
    ],
  },
  {
    id: "q17",
    teks: "Di mana notulensi, keputusan, dan dokumen komisariatmu disimpan?",
    kelompok: "evaluasi-arsip",
    indikatorTerkait: [33],
    pilihan: [
      {
        label: "Tersebar di ponsel dan laptop masing-masing pengurus",
        skor: 0,
        temuan: "Dokumen yang tersebar di perangkat pribadi mudah hilang saat pengurus berganti atau ponselnya rusak.",
        langkah: "Buat satu folder daring bersama milik komisariat, bukan milik pribadi, lalu pindahkan dokumen penting ke sana.",
      },
      {
        label: "Sebagian tersimpan di grup percakapan",
        skor: 1,
        temuan: "Grup percakapan bukan arsip. Keputusan penting tenggelam di antara pesan lain dan sulit ditemukan kembali.",
        langkah: "Pindahkan notulensi dan keputusan dari grup ke folder bersama setiap kali rapat selesai.",
      },
      {
        label: "Di folder bersama, tapi belum tertata",
        skor: 2,
        temuan: "Folder bersama sudah ada, tetapi tanpa penataan dokumen tetap sulit dicari.",
        langkah: "Susun folder menurut tahun dan jenis dokumen, lalu sepakati cara penamaan berkas.",
      },
      {
        label: "Di arsip bersama yang tertata dan mudah dicari",
        skor: 3,
        temuan: "Arsip komisariat tertata dan mudah dicari. Ingatan organisasi terjaga.",
        langkah: "Pertahankan dengan menunjuk satu penanggung jawab arsip dan memastikan akses folder berpindah saat serah terima.",
      },
    ],
  },
  {
    id: "q18",
    teks: "Saat serah terima kepengurusan, apa yang dipindahkan kepada pengurus baru?",
    kelompok: "evaluasi-arsip",
    indikatorTerkait: [43, 33, 18],
    pilihan: [
      {
        label: "Hanya jabatan dan inventaris",
        skor: 0,
        temuan: "Serah terima yang hanya memindahkan jabatan membuat pengurus baru memulai dari nol.",
        langkah: "Siapkan satu dokumen serah terima berisi keputusan penting, kontak, dan pekerjaan yang belum selesai.",
      },
      {
        label: "Laporan pertanggungjawaban saja",
        skor: 1,
        temuan: "Laporan pertanggungjawaban menjelaskan apa yang sudah dilakukan, tetapi tidak menjelaskan apa yang perlu dilanjutkan.",
        langkah: "Lengkapi LPJ dengan daftar pekerjaan yang belum selesai dan pelajaran yang perlu diketahui pengurus baru.",
      },
      {
        label: "Laporan ditambah beberapa catatan dan kontak penting",
        skor: 2,
        temuan: "Serah terima sudah membawa sebagian pengetahuan, tetapi pelajaran dan pekerjaan yang tertunda belum terwariskan.",
        langkah: "Tambahkan pelajaran utama dan status setiap program ke dokumen serah terima, lalu bahas bersama pengurus baru.",
      },
      {
        label: "Laporan, catatan keputusan, pelajaran, dan pekerjaan yang belum selesai",
        skor: 3,
        temuan: "Serah terima memindahkan pekerjaan dan pelajaran, bukan hanya jabatan.",
        langkah: "Pertahankan dengan menjadikan format serah terima ini standar tetap komisariat.",
      },
    ],
  },

  // Data dan Jaringan (2)
  {
    id: "q19",
    teks: "Bagaimana data anggota komisariatmu dikelola?",
    kelompok: "data-jaringan",
    indikatorTerkait: [37, 6],
    pilihan: [
      {
        label: "Tidak ada data anggota yang utuh",
        skor: 0,
        temuan: "Tanpa data anggota yang utuh, komisariat tidak tahu siapa yang perlu dibina, didampingi, atau dihubungi.",
        langkah: "Susun data anggota minimum: nama, angkatan, jenjang latihan, dan kontak, lalu simpan di folder bersama.",
      },
      {
        label: "Ada daftar nama, tapi jarang diperbarui",
        skor: 1,
        temuan: "Daftar nama yang jarang diperbarui cepat usang dan tidak bisa dipakai untuk pembinaan.",
        langkah: "Perbarui data anggota setiap awal semester dan tunjuk satu pengurus sebagai penanggung jawabnya.",
      },
      {
        label: "Data diperbarui, tapi siapa yang boleh mengaksesnya belum diatur",
        skor: 2,
        temuan: "Data sudah diperbarui, tetapi akses yang belum diatur berisiko membocorkan data pribadi kader.",
        langkah: "Batasi akses data hanya untuk pengurus yang membutuhkannya, dan sepakati apa saja yang boleh dibagikan.",
      },
      {
        label: "Data diperbarui, aksesnya dibatasi, dan dipakai untuk pembinaan",
        skor: 3,
        temuan: "Data anggota terjaga, aman, dan dipakai untuk pembinaan.",
        langkah: "Pertahankan dengan memeriksa kelengkapan data setiap semester dan menyerahkannya dengan aman saat serah terima.",
      },
    ],
  },
  {
    id: "q20",
    teks: "Jika kader membutuhkan mentor atau mitra di bidang tertentu, bisakah komisariatmu menghubungkannya?",
    kelompok: "data-jaringan",
    indikatorTerkait: [37],
    pilihan: [
      {
        label: "Tidak tahu harus menghubungi siapa",
        skor: 0,
        temuan: "Kader yang butuh mentor atau mitra tidak punya jalan, sehingga potensi jaringan HMI tidak termanfaatkan.",
        langkah: "Mulai daftar jejaring berisi alumni dan mitra yang dikenal pengurus, lengkap dengan bidang dan kontaknya.",
      },
      {
        label: "Bisa, lewat kenalan pribadi pengurus",
        skor: 1,
        temuan: "Jejaring bergantung pada kenalan pribadi pengurus dan ikut hilang saat pengurus itu selesai menjabat.",
        langkah: "Pindahkan kenalan pribadi pengurus ke daftar jejaring milik komisariat.",
      },
      {
        label: "Ada daftar kontak alumni, tapi bidangnya belum dipetakan",
        skor: 2,
        temuan: "Kontak alumni sudah ada, tetapi tanpa pemetaan bidang sulit menghubungkan kader dengan orang yang tepat.",
        langkah: "Tambahkan bidang keahlian dan kesediaan membantu pada setiap kontak, dimulai dari alumni yang paling aktif.",
      },
      {
        label: "Ada daftar jejaring berisi bidang keahlian dan kesediaan membantu",
        skor: 3,
        temuan: "Komisariat bisa menghubungkan kader dengan mentor sesuai bidangnya. Ini kekuatan jaringan HMI.",
        langkah: "Pertahankan dengan memperbarui daftar setiap tahun dan mencatat hubungan yang sudah terbangun.",
      },
    ],
  },
];

export const tingkatHasil: readonly TingkatHasil[] = [
  {
    min: 0,
    max: 15,
    judul: "Titik Berangkat",
    uraian: "Komisariatmu baru mulai menata bukti, dan itu titik berangkat yang wajar. Banyak kebiasaan baik lahir dari satu catatan kecil. Pilih kelompok dengan skor terendah dan coba satu praktik sederhana bulan ini.",
  },
  {
    min: 16,
    max: 30,
    judul: "Mulai Mencatat",
    uraian: "Beberapa kebiasaan baik sudah ada, tetapi masih bergantung pada orang tertentu. Langkah berikutnya adalah menjadikan catatan itu rutin dan menyimpannya di tempat yang bisa dibuka seluruh pengurus.",
  },
  {
    min: 31,
    max: 45,
    judul: "Mulai Membaca Bukti",
    uraian: "Komisariatmu sudah mencatat banyak hal. Tantangan berikutnya adalah memastikan catatan itu benar-benar dibaca dan dipakai ketika rapat mengambil keputusan.",
  },
  {
    min: 46,
    max: 60,
    judul: "Bukti Menjadi Kebiasaan",
    uraian: "Bukti sudah menjadi bagian dari kerja sehari-hari komisariatmu. Rawat kebiasaan ini lewat serah terima yang baik, lalu bagikan caramu kepada komisariat lain di cabangmu.",
  },
];

export const saranKelompok: Record<KelompokKuis, SaranKelompok> = {
  kaderisasi: {
    saran: "Mulailah dengan mencatat siapa yang masih aktif tiga bulan setelah LK 1 dan siapa pendampingnya. Dari catatan sederhana itu, tindak lanjut dan pendampingan bisa dirancang lebih tepat.",
    program: ["01", "02", "06"],
  },
  "tata-kelola": {
    saran: "Tuliskan pembagian tugas, alur keputusan, dan laporan keuangan di tempat yang bisa diperiksa seluruh pengurus. Sediakan juga ruang bagi kritik yang beralasan di setiap rapat.",
    program: ["11", "10"],
  },
  pengetahuan: {
    saran: "Hidupkan lingkar baca dan beri tempat terbit bagi tulisan kader, sekecil apa pun. Biasakan setiap diskusi membawa sumber atau data.",
    program: ["09", "08", "05"],
  },
  "target-program": {
    saran: "Sebelum memilih kegiatan, tuliskan masalah yang dijawab, keadaan awal, dan satu ukuran hasil untuk setiap program. Pantau kemajuannya secara berkala, jangan hanya di akhir periode.",
    program: ["03", "05"],
  },
  "evaluasi-arsip": {
    saran: "Biasakan evaluasi singkat setelah setiap kegiatan dan simpan hasilnya di arsip bersama yang tertata. Siapkan serah terima yang memindahkan pekerjaan dan pelajaran, bukan hanya jabatan.",
    program: ["10"],
  },
  "data-jaringan": {
    saran: "Sepakati data anggota minimum yang benar-benar dipakai untuk pembinaan, simpan dengan akses terbatas, dan perbarui setiap semester. Mulai juga daftar jejaring alumni dan mitra berdasarkan bidang keahlian.",
    program: ["04", "02"],
  },
  "pasca-lk2": {
    saran: "Perlakukan LK 2 sebagai awal kerja intelektual, bukan akhir pelatihan. Lanjutkan makalah menjadi tulisan dan kajian, libatkan alumni LK 2 memandu diskusi kader baru, dan rencanakan jenjang mereka menuju Senior Course atau pelatihan keahlian.",
    program: ["01", "02", "09"],
  },
  "pasca-lk3": {
    saran: "Petakan kader dan alumni LK 3 beserta bidang kiprahnya, lanjutkan gagasan dan penelitian mereka menjadi program yang terukur, lalu jadikan mereka mentor serta jembatan menuju jaringan profesional.",
    program: ["14", "16", "20"],
  },
};

/** Empat angka opsional sesudah pertanyaan terakhir, dipasangkan menjadi retensi kader dan keterlaksanaan program. */
export const angkaKuis = [
  { id: "pesertaLk1", label: "Jumlah peserta LK 1 terakhir dari komisariatmu" },
  { id: "aktifLk1", label: "Dari mereka, berapa yang masih aktif tiga bulan kemudian?" },
  { id: "programRencana", label: "Jumlah program kerja yang direncanakan periode ini" },
  { id: "programTerlaksana", label: "Dari program itu, berapa yang sudah terlaksana?" },
] as const;

export type AngkaId = (typeof angkaKuis)[number]["id"];
export type AngkaKuis = Record<AngkaId, number | null>;
export const angkaKosong: AngkaKuis = { pesertaLk1: null, aktifLk1: null, programRencana: null, programTerlaksana: null };

/** Rasio dari sepasang angka, atau null bila belum lengkap. */
export function rasio(bagian: number | null, total: number | null): number | null {
  return bagian === null || total === null || total === 0 ? null : Math.round((bagian / total) * 100);
}

/** Pesan galat bila pasangan angka tidak masuk akal; sama dengan aturan di server. */
export function periksaAngka(angka: AngkaKuis): string | null {
  if ((angka.pesertaLk1 === null) !== (angka.aktifLk1 === null)) return "Isi jumlah peserta LK 1 dan yang masih aktif bersamaan, atau kosongkan keduanya.";
  if (angka.pesertaLk1 !== null && angka.aktifLk1 !== null && angka.aktifLk1 > angka.pesertaLk1) return "Kader yang masih aktif tidak bisa lebih banyak dari peserta LK 1.";
  if ((angka.programRencana === null) !== (angka.programTerlaksana === null)) return "Isi jumlah program yang direncanakan dan yang terlaksana bersamaan, atau kosongkan keduanya.";
  if (angka.programRencana !== null && angka.programTerlaksana !== null && angka.programTerlaksana > angka.programRencana) return "Program yang terlaksana tidak bisa lebih banyak dari yang direncanakan.";
  return null;
}

/** Program kampanye yang terkait dengan satu pertanyaan, diturunkan dari indikator terkaitnya; paling banyak tiga. */
export function programPertanyaan(pertanyaan: PertanyaanKuis): string[] {
  if (pertanyaan.program?.length) return pertanyaan.program;
  const hitung = new Map<string, number>();
  for (const nomor of pertanyaan.indikatorTerkait) {
    for (const kode of indikator.find((item) => item.nomor === nomor)?.program ?? []) hitung.set(kode, (hitung.get(kode) ?? 0) + 1);
  }
  const hasil = Array.from(hitung).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([kode]) => kode).slice(0, 3);
  return hasil.length ? hasil : saranKelompok[pertanyaan.kelompok].program;
}

/**
 * Audit lanjutan (opsional, 10 soal). Audit inti memotret kader setelah LK 1,
 * tahap pembinaan sikap (afektif). Perkaderan HMI berlanjut: LK 2 mengasah
 * nalar (kognitif) dan LK 3 membentuk profesionalisme (psikomotor). Soal-soal
 * ini menilai apa yang dilakukan komisariat terhadap kader setelah kedua jenjang itu.
 */
export const kelompokLanjutan: readonly { id: KelompokLanjutanId; judul: string; sorotan: string; jenjang: string }[] = [
  { id: "pasca-lk2", judul: "Kader pasca-LK 2", sorotan: "Penguatan nalar", jenjang: "Intermediate Training" },
  { id: "pasca-lk3", judul: "Kader pasca-LK 3", sorotan: "Profesionalisme dan karya", jenjang: "Advance Training" },
];

export const pertanyaanLanjutan: readonly PertanyaanKuis[] = [
  {
    id: "q21",
    teks: "Setelah kader lulus LK 2, apakah komisariatmu punya agenda tindak lanjut (follow up) untuk mereka?",
    kelompok: "pasca-lk2",
    indikatorTerkait: [17, 3, 31],
    program: ["01", "02"],
    pilihan: [
      {
        label: "Tidak ada, mereka kembali ke kegiatan biasa",
        skor: 0,
        temuan: "LK 2 selesai sebagai acara. Nalar yang baru diasah tidak punya tempat untuk dipakai, sehingga pelan-pelan tumpul kembali.",
        langkah: "Tetapkan satu agenda tindak lanjut untuk setiap angkatan LK 2, misalnya diskusi bulanan yang dipandu alumni LK 2 itu sendiri.",
      },
      {
        label: "Ada, tapi sesekali dan tidak dirancang",
        skor: 1,
        temuan: "Tindak lanjut bergantung pada kesempatan, sehingga sebagian alumni LK 2 berkembang dan sebagian lain menghilang.",
        langkah: "Rancang tindak lanjut untuk satu semester: tema, jadwal, dan penanggung jawab, lalu umumkan kepada alumni LK 2.",
      },
      {
        label: "Ada agenda tindak lanjut, tapi tidak dipantau",
        skor: 2,
        temuan: "Agendanya ada, tetapi tanpa pemantauan tidak ada yang tahu siapa yang benar-benar berkembang.",
        langkah: "Catat kehadiran dan hasil setiap agenda tindak lanjut, lalu tinjau bersama pengurus cabang yang membidangi perkaderan.",
      },
      {
        label: "Ada agenda terjadwal dan dipantau bersama cabang",
        skor: 3,
        temuan: "Alumni LK 2 punya jalur pengembangan yang jelas dan terpantau. Ini jarang terjadi dan patut dijaga.",
        langkah: "Pertahankan dengan membagikan format tindak lanjutnya kepada komisariat lain di cabangmu.",
      },
    ],
  },
  {
    id: "q22",
    teks: "Apakah makalah dan gagasan kader dari LK 2 dilanjutkan menjadi tulisan, kajian, atau program?",
    kelompok: "pasca-lk2",
    indikatorTerkait: [15, 14, 30],
    program: ["09"],
    pilihan: [
      {
        label: "Makalah berhenti setelah seleksi LK 2",
        skor: 0,
        temuan: "Makalah hanya menjadi syarat masuk pelatihan, padahal di situlah bibit gagasan kader tersimpan.",
        langkah: "Kumpulkan makalah LK 2 kader komisariatmu dan pilih satu untuk dikembangkan menjadi tulisan atau kajian bersama.",
      },
      {
        label: "Sesekali dibahas, tapi tidak dilanjutkan",
        skor: 1,
        temuan: "Gagasan kader sempat didengar, tetapi berhenti di forum dan tidak sampai menjadi karya.",
        langkah: "Pasangkan setiap gagasan yang dibahas dengan satu tenggat: kapan ditulis ulang dan di mana diterbitkan.",
      },
      {
        label: "Sebagian dikembangkan menjadi tulisan atau kajian",
        skor: 2,
        temuan: "Sebagian gagasan kader sudah menjadi karya, tetapi belum menjadi kebiasaan komisariat.",
        langkah: "Sediakan ruang terbit tetap, misalnya jurnal kecil komisariat, dan jadwalkan satu kajian dari alumni LK 2 setiap semester.",
      },
      {
        label: "Dikembangkan dan diterbitkan, atau dipakai sebagai dasar program",
        skor: 3,
        temuan: "Gagasan kader LK 2 menjadi karya dan kebijakan komisariat. Nalar kader benar-benar bekerja.",
        langkah: "Pertahankan dengan mencatat karya yang lahir dari LK 2 dan memperkenalkannya kepada kader baru sebagai teladan.",
      },
    ],
  },
  {
    id: "q23",
    teks: "Apakah alumni LK 2 dilibatkan memandu diskusi atau menjadi pemateri bagi kader LK 1?",
    kelompok: "pasca-lk2",
    indikatorTerkait: [10, 14, 42],
    program: ["02", "08"],
    pilihan: [
      {
        label: "Tidak pernah",
        skor: 0,
        temuan: "Kemampuan berpikir alumni LK 2 tidak diturunkan, sehingga kader baru kehilangan teladan terdekatnya.",
        langkah: "Mulai dengan satu sesi: minta alumni LK 2 memandu diskusi kader baru tentang tema yang mereka kuasai.",
      },
      {
        label: "Hanya jika ada yang bersedia",
        skor: 1,
        temuan: "Keterlibatan alumni LK 2 bergantung pada kemauan pribadi, sehingga tidak merata dan mudah terhenti.",
        langkah: "Buat daftar alumni LK 2 beserta tema yang mereka kuasai, lalu jadwalkan giliran memandu diskusi.",
      },
      {
        label: "Sering dilibatkan, tapi tanpa pembekalan",
        skor: 2,
        temuan: "Alumni LK 2 sudah memandu, tetapi tanpa pembekalan mutu diskusi naik turun.",
        langkah: "Adakan pembekalan singkat cara memandu diskusi, dan minta umpan balik peserta setelah setiap sesi.",
      },
      {
        label: "Dilibatkan terjadwal, dengan pembekalan dan umpan balik",
        skor: 3,
        temuan: "Alumni LK 2 menjadi pemandu yang terbina. Komisariat mencetak calon pengader dari dalam.",
        langkah: "Pertahankan dengan mendorong pemandu terbaik mengikuti Senior Course.",
      },
    ],
  },
  {
    id: "q24",
    teks: "Apakah komisariatmu merencanakan jenjang alumni LK 2 menuju Senior Course, pelatihan khusus, atau LK 3?",
    kelompok: "pasca-lk2",
    indikatorTerkait: [3, 17, 31],
    program: ["01", "08"],
    pilihan: [
      {
        label: "Tidak ada rencana",
        skor: 0,
        temuan: "Setelah LK 2, kader berjalan tanpa arah jenjang. Banyak yang berhenti di tengah jalan tanpa disadari.",
        langkah: "Bicarakan rencana lanjutan dengan setiap alumni LK 2: Senior Course, pelatihan keahlian, atau persiapan LK 3.",
      },
      {
        label: "Diserahkan pada minat kader sendiri",
        skor: 1,
        temuan: "Kader yang berinisiatif maju, sedangkan yang ragu tertinggal tanpa ada yang menanyakan.",
        langkah: "Buat daftar sederhana: nama alumni LK 2, minatnya, dan pelatihan berikutnya yang dituju.",
      },
      {
        label: "Didorong, tapi tanpa rencana siapa dan kapan",
        skor: 2,
        temuan: "Dorongan sudah ada, tetapi tanpa rencana waktu, kesempatan pelatihan sering terlewat.",
        langkah: "Cocokkan daftar minat kader dengan jadwal Senior Course dan pelatihan khusus dari cabang serta Badko.",
      },
      {
        label: "Ada rencana jenjang: siapa, pelatihan apa, dan kapan",
        skor: 3,
        temuan: "Jenjang kader dirancang dengan sadar. Komisariat menyiapkan penerus perkaderan HMI.",
        langkah: "Pertahankan dengan meninjau rencana jenjang setiap semester dan mencatat siapa yang sudah menempuhnya.",
      },
    ],
  },
  {
    id: "q25",
    teks: "Apakah perkembangan kemampuan berpikir kader setelah LK 2 dicatat, misalnya tulisan, diskusi yang dipandu, atau kajian?",
    kelompok: "pasca-lk2",
    indikatorTerkait: [17, 35, 43],
    program: ["03", "04"],
    pilihan: [
      {
        label: "Tidak dicatat",
        skor: 0,
        temuan: "Tanpa catatan, komisariat tidak bisa membuktikan apakah LK 2 benar-benar mengubah cara berpikir kadernya.",
        langkah: "Mulai catat tiga hal untuk setiap alumni LK 2: tulisan, diskusi yang dipandu, dan kajian yang diikuti.",
      },
      {
        label: "Diketahui, tapi tidak tercatat",
        skor: 1,
        temuan: "Pengurus tahu siapa yang berkembang, tetapi pengetahuan itu hilang saat kepengurusan berganti.",
        langkah: "Pindahkan pengetahuan pengurus ke satu tabel perkembangan kader yang disimpan di folder bersama.",
      },
      {
        label: "Dicatat untuk sebagian kader",
        skor: 2,
        temuan: "Catatan sudah ada, tetapi hanya untuk kader yang menonjol, sehingga yang lain luput dari pembinaan.",
        langkah: "Lengkapi catatan untuk semua alumni LK 2 dan perbarui setiap akhir semester.",
      },
      {
        label: "Dicatat untuk setiap kader dan dipakai untuk pembinaan",
        skor: 3,
        temuan: "Perkembangan nalar kader terukur dan menjadi dasar pembinaan. Ini perkaderan berbasis bukti.",
        langkah: "Pertahankan dengan membandingkan catatan antarangkatan untuk menilai mutu LK 2 dari waktu ke waktu.",
      },
    ],
  },
  {
    id: "q26",
    teks: "Apakah komisariatmu tahu siapa saja kader dan alumninya yang sudah LK 3, serta di mana mereka berkiprah sekarang?",
    kelompok: "pasca-lk3",
    indikatorTerkait: [37, 43, 35],
    program: ["12", "04"],
    pilihan: [
      {
        label: "Tidak tahu",
        skor: 0,
        temuan: "Kader hasil jenjang tertinggi HMI tidak tercatat, sehingga kekuatan terbesar komisariat tidak terlihat.",
        langkah: "Susun daftar kader dan alumni yang sudah LK 3, dimulai dari yang diingat pengurus dan senior.",
      },
      {
        label: "Tahu beberapa nama dari ingatan pengurus",
        skor: 1,
        temuan: "Pengetahuan tentang alumni LK 3 tersimpan di kepala segelintir orang dan mudah hilang.",
        langkah: "Tuliskan nama-nama itu dalam daftar bersama, lalu minta setiap alumni LK 3 melengkapi datanya sendiri.",
      },
      {
        label: "Ada daftar, tapi kiprahnya tidak diperbarui",
        skor: 2,
        temuan: "Daftar sudah ada, tetapi tanpa kiprah terbaru komisariat tidak tahu siapa yang bisa dimintai bantuan.",
        langkah: "Tambahkan bidang kiprah, lembaga, dan kontak pada daftar, lalu perbarui setahun sekali.",
      },
      {
        label: "Ada daftar yang diperbarui, lengkap dengan bidang kiprahnya",
        skor: 3,
        temuan: "Komisariat mengenal alumni LK 3-nya dan kiprah mereka. Ini modal jaringan yang kuat.",
        langkah: "Pertahankan dengan membagikan daftar itu, atas izin mereka, kepada cabang untuk membangun jaringan yang lebih luas.",
      },
    ],
  },
  {
    id: "q27",
    teks: "Apakah gagasan atau penelitian kader dari LK 3 dilanjutkan menjadi program atau aksi nyata?",
    kelompok: "pasca-lk3",
    indikatorTerkait: [15, 27, 38],
    program: ["14", "09"],
    pilihan: [
      {
        label: "Berhenti di forum pelatihan",
        skor: 0,
        temuan: "Gagasan dan penelitian LK 3 dirancang untuk menjawab persoalan umat, tetapi berhenti sebagai tugas pelatihan.",
        langkah: "Minta alumni LK 3 memaparkan gagasan atau penelitiannya di komisariat, lalu pilih satu untuk diuji dalam skala kecil.",
      },
      {
        label: "Dibicarakan, tapi tidak dilanjutkan",
        skor: 1,
        temuan: "Gagasan sempat didengar, tetapi tanpa rencana tindak lanjut ia tidak pernah diuji di lapangan.",
        langkah: "Ubah satu gagasan menjadi rencana sederhana: masalah, langkah, penanggung jawab, dan ukuran hasil.",
      },
      {
        label: "Sebagian diwujudkan secara kecil-kecilan",
        skor: 2,
        temuan: "Gagasan kader mulai diuji, tetapi hasilnya belum diukur sehingga sulit dikembangkan atau dipertanggungjawabkan.",
        langkah: "Catat hasil setiap uji coba dan putuskan bersama: dilanjutkan, diperbaiki, atau dihentikan.",
      },
      {
        label: "Dikembangkan menjadi program atau aksi yang terukur",
        skor: 3,
        temuan: "Gagasan LK 3 menjadi program nyata dengan ukuran hasil. Kader menunjukkan profesionalismenya.",
        langkah: "Pertahankan dengan menuliskan hasilnya dan menyampaikannya kepada cabang, Badko, atau pihak terkait.",
      },
    ],
  },
  {
    id: "q28",
    teks: "Apakah kader dan alumni LK 3 dilibatkan sebagai mentor atau pengader bagi kader di komisariatmu?",
    kelompok: "pasca-lk3",
    indikatorTerkait: [31, 17, 43],
    program: ["02", "20"],
    pilihan: [
      {
        label: "Tidak pernah",
        skor: 0,
        temuan: "Pengalaman kader paling matang tidak diturunkan, sehingga jarak antara kader baru dan senior melebar.",
        langkah: "Undang satu alumni LK 3 untuk mendampingi satu kelompok kader selama satu semester.",
      },
      {
        label: "Hanya saat ada acara besar",
        skor: 1,
        temuan: "Alumni LK 3 hadir sebagai tamu acara, bukan sebagai pendamping yang dikenal dekat oleh kader.",
        langkah: "Ubah kehadiran sesekali itu menjadi pertemuan rutin dalam kelompok kecil.",
      },
      {
        label: "Cukup sering, tapi tidak terjadwal",
        skor: 2,
        temuan: "Pendampingan berjalan, tetapi tanpa jadwal ia mudah terhenti saat kesibukan alumni bertambah.",
        langkah: "Sepakati jadwal dan peran setiap mentor, misalnya satu pertemuan sebulan untuk satu kelompok kader.",
      },
      {
        label: "Terjadwal sebagai mentor dengan peran yang jelas",
        skor: 3,
        temuan: "Kader LK 3 menjadi mentor yang terjadwal. Perkaderan berjalan lintas angkatan.",
        langkah: "Pertahankan dengan menilai dampak pendampingan pada kader yang didampingi setiap akhir periode.",
      },
    ],
  },
  {
    id: "q29",
    teks: "Apakah komisariatmu membantu kader pasca-LK 3 mengembangkan keahlian profesional sesuai bidangnya, misalnya hukum, ekonomi, pendidikan, atau riset?",
    kelompok: "pasca-lk3",
    indikatorTerkait: [37, 38, 42],
    program: ["16", "08"],
    pilihan: [
      {
        label: "Tidak ada dukungan",
        skor: 0,
        temuan: "Setelah jenjang tertinggi, kader dibiarkan mencari jalannya sendiri, padahal di sinilah keahlian profesional mulai dibentuk.",
        langkah: "Tanyakan bidang yang ingin didalami setiap kader pasca-LK 3, lalu carikan satu alumni atau mitra di bidang itu.",
      },
      {
        label: "Diserahkan kepada kader sendiri",
        skor: 1,
        temuan: "Kader yang punya jaringan berkembang cepat, sedangkan yang tidak punya tertinggal.",
        langkah: "Hubungkan kader dengan pelatihan keahlian, magang, atau sertifikasi yang sesuai bidangnya.",
      },
      {
        label: "Sesekali ada pelatihan keahlian atau kenalan mitra",
        skor: 2,
        temuan: "Dukungan sudah ada, tetapi masih sesekali dan belum menjadi jalur yang bisa diikuti semua kader.",
        langkah: "Susun kalender pelatihan keahlian setahun bersama alumni dan mitra, sesuai bidang kader yang ada.",
      },
      {
        label: "Ada jalur pengembangan keahlian bersama alumni dan mitra",
        skor: 3,
        temuan: "Komisariat menjadi jembatan menuju profesi. Kader tumbuh menjadi profesional yang membawa nilai HMI.",
        langkah: "Pertahankan dengan mencatat capaian profesional kader dan melibatkan mereka membimbing adik tingkatnya.",
      },
    ],
  },
  {
    id: "q30",
    teks: "Apakah pengalaman dan karya kader LK 2 dan LK 3 diarsipkan dan diwariskan kepada angkatan berikutnya?",
    kelompok: "pasca-lk3",
    indikatorTerkait: [33, 43, 18],
    program: ["10", "19"],
    pilihan: [
      {
        label: "Tidak diarsipkan",
        skor: 0,
        temuan: "Karya dan pelajaran dari jenjang pelatihan lanjut hilang bersama angkatannya. Setiap angkatan mulai dari nol.",
        langkah: "Buat satu folder arsip untuk makalah, penelitian, dan catatan pelatihan kader LK 2 dan LK 3.",
      },
      {
        label: "Tersebar di masing-masing kader",
        skor: 1,
        temuan: "Karya kader tersimpan di perangkat pribadi dan tidak bisa dipelajari angkatan berikutnya.",
        langkah: "Minta setiap kader menyerahkan salinan karyanya ke arsip komisariat setelah pelatihan.",
      },
      {
        label: "Sebagian diarsipkan, tapi jarang dibuka",
        skor: 2,
        temuan: "Arsip sudah ada, tetapi belum menjadi bahan belajar sehingga manfaatnya belum terasa.",
        langkah: "Gunakan arsip itu sebagai bahan diskusi dan persiapan kader yang akan mengikuti LK 2 dan LK 3.",
      },
      {
        label: "Diarsipkan tertata dan dipakai dalam pembinaan angkatan berikutnya",
        skor: 3,
        temuan: "Pengalaman jenjang lanjut menjadi warisan yang hidup. Setiap angkatan berdiri di atas angkatan sebelumnya.",
        langkah: "Pertahankan dengan memperbarui arsip setiap periode dan membukanya untuk komisariat lain di cabangmu.",
      },
    ],
  },
];
