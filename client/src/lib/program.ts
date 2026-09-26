export interface ProgramStrategis {
  nomor: string;
  judul: string;
  deskripsi: string;
  tujuan: string;
  hasil: readonly string[];
}

export interface PilarStrategis {
  nomor: string;
  judul: string;
  uraian: string;
  menjawab: readonly string[];
  program: readonly ProgramStrategis[];
}

/** Enam pilar dan tiga belas program strategis, sama dengan proposal kandidat. */
export const pilarStrategis: readonly PilarStrategis[] = [
  {
    nomor: "01",
    judul: "Ekosistem Perkaderan Berkelanjutan",
    uraian: "Menyambungkan latihan formal dengan tindak lanjut, pendampingan, ruang karya, dan jalur pengembangan kader.",
    menjawab: ["Kaderisasi"],
    program: [
      {
        nomor: "01",
        judul: "Pembuatan Sistem Kaderisasi Berkelanjutan",
        deskripsi: "Menyusun alur perkaderan yang menyambungkan Latihan Kader, tindak lanjut, pendampingan, ruang karya, dan jenjang berikutnya.",
        tujuan: "Setiap kader memiliki jalur yang jelas setelah latihan dan tidak berhenti karena tidak ada tindak lanjut.",
        hasil: ["Pedoman alur perkaderan", "Penanggung jawab tindak lanjut setiap latihan", "Agenda belajar lanjutan"],
      },
      {
        nomor: "02",
        judul: "Pembentukan Jaringan Pendamping dan Instruktur",
        deskripsi: "Menyiapkan pendamping kader dari instruktur, pengurus, dan alumni, disertai pelatihan pendamping.",
        tujuan: "Pendampingan kader setelah latihan berjalan terjaga dan merata.",
        hasil: ["Daftar pendamping per cabang", "Pelatihan pendamping dan instruktur", "Catatan pendampingan kader"],
      },
    ],
  },
  {
    nomor: "02",
    judul: "Perkaderan Berbasis Bukti",
    uraian: "Membaca Student Needs dan Student Interest, memantau perkembangan, dan menilai hasil perkaderan dengan data yang dapat diperiksa.",
    menjawab: ["Target Program", "Data dan Jaringan"],
    program: [
      {
        nomor: "03",
        judul: "Pembuatan Indeks Kaderisasi",
        deskripsi: "Menyusun ukuran sederhana untuk membaca mutu perkaderan: keaktifan setelah latihan, pendampingan, karya, dan keterlibatan kader.",
        tujuan: "Komisariat dan cabang mengetahui bagian yang perlu diperbaiki, bukan untuk saling memeringkat.",
        hasil: ["Indeks kaderisasi", "Laporan keadaan perkaderan setiap tahun"],
      },
      {
        nomor: "04",
        judul: "Pembuatan Platform Kaderisasi Digital",
        deskripsi: "Menyepakati data minimum kader lebih dulu, lalu membangun platform pencatatan perjalanan kader secara bertahap.",
        tujuan: "Data kader tercatat dengan cara yang sama, aman, dan kembali bermanfaat bagi komisariat serta cabang.",
        hasil: ["Pedoman data minimum dan perlindungan data", "Uji coba di beberapa cabang", "Perluasan bertahap"],
      },
      {
        nomor: "05",
        judul: "Penataan Ulang Fungsi Balitbang PB HMI",
        deskripsi: "Menjadikan Balitbang penghubung antara pertanyaan organisasi, data, kajian, keputusan, dan evaluasi.",
        tujuan: "Keputusan organisasi memiliki dasar yang jelas dan dapat diperiksa.",
        hasil: ["Laporan keadaan organisasi", "Ringkasan bukti untuk forum organisasi", "Jaringan riset kader"],
      },
    ],
  },
  {
    nomor: "03",
    judul: "Peran HMI dalam Pembangunan SDM",
    uraian: "Menempatkan HMI sebagai mitra penting dalam menyiapkan generasi produktif menuju Indonesia Emas 2045.",
    menjawab: ["Kaderisasi", "Pengetahuan"],
    program: [
      {
        nomor: "06",
        judul: "Pemetaan Kebutuhan Mahasiswa dan Kampus",
        deskripsi: "Mendata Student Needs dan Student Interest, termasuk tantangan mahasiswa di kampus tempat HMI tumbuh.",
        tujuan: "Perkaderan kembali dekat dengan kehidupan mahasiswa dan menarik bagi mahasiswa baru.",
        hasil: ["Peta Student Needs dan Student Interest", "Rekomendasi materi dan kegiatan perkaderan"],
      },
      {
        nomor: "07",
        judul: "Pembuatan Kajian SDM Menuju Indonesia Emas 2045",
        deskripsi: "Menyusun kajian dan rekomendasi tentang pengembangan generasi muda bersama kampus, pemerintah, dan mitra.",
        tujuan: "HMI hadir sebagai mitra strategis dalam menyiapkan bonus demografi yang produktif.",
        hasil: ["Kajian dan rekomendasi kebijakan", "Forum bersama mitra"],
      },
    ],
  },
  {
    nomor: "04",
    judul: "Penguatan Kemampuan Kader",
    uraian: "Membekali kader dengan soft skills dan hard skills yang relevan dengan Student Needs dan Student Interest, dunia profesi, dan masyarakat.",
    menjawab: ["Pengetahuan", "Kaderisasi"],
    program: [
      {
        nomor: "08",
        judul: "Pembuatan Kurikulum Keterampilan Kader",
        deskripsi: "Kelas soft skills (kepemimpinan, komunikasi, kolaborasi, daya kritis, integritas) dan hard skills (literasi data, teknologi, riset, kewirausahaan).",
        tujuan: "Kader siap menghadapi kebutuhan kampus, profesi, dan masyarakat.",
        hasil: ["Modul keterampilan kader", "Kelas berkala di cabang"],
      },
      {
        nomor: "09",
        judul: "Pembuatan Ruang Karya Kader",
        deskripsi: "Wadah bagi tulisan, riset, pengabdian, dan usaha kader, lengkap dengan publikasi dan apresiasi.",
        tujuan: "Menghidupkan kembali tradisi intelektual dan budaya berkarya di HMI.",
        hasil: ["Publikasi karya kader", "Apresiasi karya terbaik", "Arsip karya kader"],
      },
    ],
  },
  {
    nomor: "05",
    judul: "Tata Kelola dan Memori Organisasi",
    uraian: "Menjalankan konstitusi secara konsisten, membiasakan evaluasi, dan menyimpan pengalaman organisasi lintas periode.",
    menjawab: ["Tata Kelola", "Evaluasi dan Arsip"],
    program: [
      {
        nomor: "10",
        judul: "Pembuatan Arsip dan Memori Organisasi",
        deskripsi: "Mencatat keputusan penting, alasan, dan hasil evaluasi, serta menyusun serah terima yang memindahkan pekerjaan, bukan hanya jabatan.",
        tujuan: "Kepengurusan baru tidak memulai dari nol.",
        hasil: ["Format catatan keputusan", "Pedoman serah terima", "Arsip organisasi yang mudah ditemukan"],
      },
      {
        nomor: "11",
        judul: "Pemeriksaan Kepatuhan Konstitusi",
        deskripsi: "Pemeriksaan rutin atas kewenangan, administrasi, keuangan, dan pelaksanaan keputusan forum organisasi.",
        tujuan: "Konstitusi berjalan konsisten dan pelanggaran ditangani secara adil.",
        hasil: ["Laporan kepatuhan berkala", "Tindak lanjut koreksi"],
      },
    ],
  },
  {
    nomor: "06",
    judul: "Kader Pelopor di Panggung Dunia",
    uraian: "Menyiapkan kader yang mampu membaca perubahan global dan membawa kepentingan Indonesia ke forum dunia.",
    menjawab: ["Pengetahuan", "Data dan Jaringan"],
    program: [
      {
        nomor: "12",
        judul: "Pembuatan Jaringan Kader Global",
        deskripsi: "Menghubungkan cabang luar negeri, kader yang belajar atau bekerja di luar negeri, dan alumni di berbagai negara.",
        tujuan: "Memperluas wawasan dan akses kader ke ruang kerja sama internasional.",
        hasil: ["Peta jaringan kader global", "Forum kader global berkala"],
      },
      {
        nomor: "13",
        judul: "Pendampingan Kader ke Forum Internasional",
        deskripsi: "Mendorong dan mendampingi kader mengikuti beasiswa, pertukaran, kompetisi, dan konferensi internasional.",
        tujuan: "Lahir kader yang mampu membawa kepentingan Indonesia di forum dunia.",
        hasil: ["Pendampingan beasiswa dan kompetisi", "Delegasi kader ke forum internasional"],
      },
    ],
  },
];
