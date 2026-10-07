// DRAF: seluruh pesan di berkas ini masih menunggu tinjauan tim sebelum dipakai.

export interface MasalahJawaban { masalah: string; jawaban: string; }
export type AudiensId = "ketum-cabang" | "kader-komisariat" | "senior-kahmi" | "hmi-wati";
export interface TautanLangkah { label: string; href: string; }
export interface PesanAudiens { id: AudiensId; label: string; judul: string; pesan: string; langkah: readonly TautanLangkah[]; }
export interface CaraIkut { judul: string; uraian: string; href: string; utama?: boolean; }

export const tigaMasalah: readonly MasalahJawaban[] = [
  {
    masalah: "Kader hilang setelah LK 1.",
    jawaban: "HMI Evidence menyambungkan Latihan Kader dengan tindak lanjut, agenda belajar lanjutan, dan ruang karya dalam satu alur perkaderan yang jelas. Setiap kader didampingi jaringan pendamping dari instruktur, pengurus, dan alumni. Keaktifan setelah latihan dibaca lewat Indeks Kaderisasi, sehingga komisariat tahu siapa yang perlu disapa sebelum terlambat.",
  },
  {
    masalah: "Data dan pengalaman hilang setiap ganti pengurus.",
    jawaban: "Keputusan penting, alasannya, dan hasil evaluasi dicatat dengan format yang sama, lalu disimpan di arsip yang mudah ditemukan. Serah terima memindahkan pekerjaan dan pelajaran, bukan hanya jabatan. Data kader dicatat bertahap lewat platform kaderisasi digital yang berpegang pada pedoman data minimum dan perlindungan data.",
  },
  {
    masalah: "Keputusan diambil berdasarkan feeling.",
    jawaban: "Balitbang PB HMI ditata ulang menjadi penghubung antara pertanyaan organisasi, data, kajian, dan keputusan. Forum organisasi menerima ringkasan bukti yang mudah dibaca, dan Indeks Kaderisasi menunjukkan bagian yang perlu diperbaiki tanpa saling memeringkat. Musyawarah tetap yang memutuskan, tetapi dengan dasar yang bisa diperiksa bersama.",
  },
];

export const pesanAudiens: readonly PesanAudiens[] = [
  {
    id: "ketum-cabang",
    label: "Ketum Cabang",
    judul: "Membaca pola antarkomisariat, bukan menebak.",
    pesan: "Cabang perlu tahu komisariat mana yang kehilangan kader setelah latihan dan mana yang membutuhkan penguatan pembinaan. HMI Evidence menyiapkan Indeks Kaderisasi, jaringan pendamping per cabang, dan pemetaan Student Needs serta Student Interest lintas kampus. Tujuannya bukan memeringkat komisariat, melainkan menemukan titik yang perlu didukung.",
    langkah: [
      { label: "Pembuatan Indeks Kaderisasi", href: "/hmi-evidence#program-03" },
      { label: "Jaringan Pendamping dan Instruktur", href: "/hmi-evidence#program-02" },
      { label: "Bahas 44 indikator di rapat cabang", href: "/indikator" },
    ],
  },
  {
    id: "kader-komisariat",
    label: "Kader Komisariat",
    judul: "Perjalananmu setelah LK 1 layak diperhatikan.",
    pesan: "Setelah LK 1, kamu perlu tahu apa langkah berikutnya, siapa yang mendampingimu, dan di mana karyamu bisa tumbuh. HMI Evidence menyambungkan latihan dengan tindak lanjut, kelas soft skills dan hard skills, serta ruang karya kader. Mulailah dari komisariatmu sendiri: ukur keadaannya, lalu ceritakan masalahnya.",
    langkah: [
      { label: "Ikuti kuis komisariat", href: "/kuis" },
      { label: "Kirim masalah komisariatmu", href: "/ikut#kirim-masalah" },
      { label: "Ekosistem Perkaderan Berkelanjutan", href: "/hmi-evidence#pilar-01" },
    ],
  },
  {
    id: "senior-kahmi",
    label: "Senior / KAHMI",
    judul: "Pengalaman para pendahulu perlu menjadi memori organisasi.",
    pesan: "Banyak pelajaran berharga HMI tersimpan dalam ingatan para senior dan alumni, lalu hilang ketika tidak pernah dicatat. HMI Evidence membangun arsip dan memori organisasi, memeriksa kepatuhan konstitusi secara rutin, menata ulang Balitbang sebagai penghubung kajian dan keputusan, serta menghubungkan alumni lewat jaringan kader global. Dengan begitu, apa yang telah dibangun tidak berhenti di satu periode.",
    langkah: [
      { label: "Tata Kelola dan Memori Organisasi", href: "/hmi-evidence#pilar-05" },
      { label: "Penataan Ulang Fungsi Balitbang PB HMI", href: "/hmi-evidence#program-05" },
      { label: "Pembuatan Jaringan Kader Global", href: "/hmi-evidence#program-12" },
    ],
  },
  {
    id: "hmi-wati",
    label: "HMI-Wati",
    judul: "Jalur yang jelas, terbuka bagi setiap kader.",
    pesan: "Perkaderan yang tercatat dengan baik membuat akses pada pendampingan, jalur pengembangan, dan ruang karya dapat diperiksa, bukan bergantung pada kedekatan. HMI Evidence menyiapkan alur kaderisasi berkelanjutan, jaringan pendamping, kelas kepemimpinan dan keterampilan, serta ruang karya yang terbuka bagi setiap kader. Catatan perkaderan itu juga membantu organisasi memeriksa apakah HMI-Wati mendapat kesempatan yang setara untuk tumbuh dan memimpin.",
    langkah: [
      { label: "Pembuatan Sistem Kaderisasi Berkelanjutan", href: "/hmi-evidence#program-01" },
      { label: "Pembuatan Kurikulum Keterampilan Kader", href: "/hmi-evidence#program-08" },
      { label: "Pembuatan Ruang Karya Kader", href: "/hmi-evidence#program-09" },
    ],
  },
];

export const caraIkut: readonly CaraIkut[] = [
  {
    judul: "Ukur komisariatmu lewat kuis",
    uraian: "Jawab 20 pertanyaan singkat tentang kebiasaan komisariatmu, perdalam dengan 10 soal tentang kader pasca-LK 2 dan LK 3, lalu lihat apa yang paling perlu diperkuat dan praktik apa yang bisa dicoba.",
    href: "/kuis",
    utama: true,
  },
  {
    judul: "Kirim masalah komisariatmu",
    uraian: "Ceritakan satu masalah nyata yang sedang dihadapi komisariat atau cabangmu. Ceritamu membantu kami memahami keadaan HMI dari bawah.",
    href: "/ikut#kirim-masalah",
  },
  {
    judul: "Jelajahi dan bagikan 44 indikator",
    uraian: "Baca 44 indikator kemunduran HMI yang dihimpun Agussalim Sitompul, lengkap dengan pertanyaan refleksi dan praktik kecil. Bagikan kepada pengurus sebagai bahan rapat.",
    href: "/indikator",
  },
];
