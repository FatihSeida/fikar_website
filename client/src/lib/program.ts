export interface ProgramStrategis {
  nomor: string;
  judul: string;
  deskripsi: string;
  tujuan: string;
  hasil: readonly string[];
  urgensi?: string;
  fokus?: readonly string[];
  implementasi?: string;
}

export interface PilarStrategis {
  nomor: string;
  judul: string;
  uraian: string;
  menjawab: readonly string[];
  program: readonly ProgramStrategis[];
}

/** Cari program berdasarkan nomornya ("01"–"20"). */
export function programDenganNomor(nomor: string): ProgramStrategis | undefined {
  for (const pilar of pilarStrategis) {
    const program = pilar.program.find((item) => item.nomor === nomor);
    if (program) return program;
  }
  return undefined;
}

/** Enam pilar; tiga belas program awal dan tujuh pengembangan dari proposal terlampir. */
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
      {
        nomor: "14",
        judul: "Lembaga Riset & Inovasi Strategis (LRIS PB HMI)",
        urgensi: "Sikap organisasi akan lebih kuat bila lahir dari penelitian, bukan semata reaksi terhadap isu. Data dari cabang dan Badko perlu menemukan jalan menuju analisis nasional yang dapat dipertanggungjawabkan.",
        deskripsi: "LRIS dirancang sebagai penguatan kerja riset dalam refocusing Balitbang, bukan lembaga paralel yang mengulang mandatnya. Temuan lapangan diolah menjadi kajian, naskah kebijakan, dan pilihan advokasi berbasis bukti.",
        tujuan: "HMI dapat hadir sebagai mitra pemikiran publik yang kritis sekaligus menawarkan jalan keluar yang teruji.",
        fokus: ["Kebijakan dan tata kelola: membaca regulasi, demokrasi, serta pelayanan publik.", "Sosial, ekonomi, dan digital: menelaah kemiskinan, UMKM, ekonomi syariah, teknologi, dan AI.", "Keislaman dan isu sosial: merawat percakapan tentang pemikiran Islam, kebebasan beragama, dan kesetaraan."],
        implementasi: "Jaringan kader di daerah membawa pertanyaan dan data. LRIS mengolahnya bersama periset menjadi policy brief yang menyebut sumber, metode, batas temuan, dan perlindungan data; forum yang berwenang tetap mengambil keputusan. Penggunaannya dievaluasi agar riset tidak berhenti sebagai publikasi.",
        hasil: ["Policy brief dan naskah kebijakan", "Jaringan periset muda HMI", "Temuan riset yang digunakan dalam advokasi"],
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
      {
        nomor: "15",
        judul: "HMI Peduli Kesehatan (HMI-Care)",
        urgensi: "Bagi keluarga rentan, hambatan berobat sering bukan hanya penyakitnya. Informasi jaminan kesehatan, status kepesertaan, ongkos perjalanan, dan tempat singgah dapat menentukan apakah pengobatan berlanjut atau terhenti.",
        deskripsi: "HMI-Care membawa pengabdian kader lebih dekat ke warga melalui pendataan, pendampingan akses layanan, dan solidaritas biaya nonmedis. Semangatnya: satu kader, satu advokasi kesehatan yang nyata.",
        tujuan: "Membantu warga yang membutuhkan menemukan jalur layanan kesehatan yang tepat, tanpa menjanjikan hasil administrasi atau pembiayaan yang belum pasti.",
        fokus: ["Akses jaminan: mendampingi warga yang belum memahami pendaftaran dan kelayakan BPJS PBI.", "Kepesertaan bermasalah: membantu menelusuri pilihan penyelesaian tunggakan atau perubahan status sesuai ketentuan.", "Biaya nonmedis: menghubungkan kebutuhan transportasi dan akomodasi dengan jejaring bantuan yang dapat diverifikasi."],
        implementasi: "Komisariat dan cabang mengenali kasus di sekitar mereka; LKMI membantu memeriksa kebutuhan dan urgensinya. Tim pendamping lalu menghubungkan warga dengan dinas sosial, dinas kesehatan, BPJS Kesehatan, atau mitra filantropi yang relevan. Setiap bantuan dicatat agar penerima memperoleh tindak lanjut, bukan sekadar kunjungan sesaat.",
        hasil: ["Kasus warga yang terdata dan ditindaklanjuti", "Jejaring pendampingan kesehatan", "Dukungan biaya nonmedis yang transparan"],
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
      {
        nomor: "16",
        judul: "HMI Pro-Scholar: Beasiswa Sertifikasi Profesi",
        urgensi: "Banyak kader mempunyai kemampuan, tetapi biaya pendidikan profesi dan sertifikasi membatasi langkah mereka memasuki dunia kerja. Kesempatan belajar perlu dibuka lebih lebar, terutama bagi kader yang belum memiliki akses jejaring profesi.",
        deskripsi: "HMI Pro-Scholar menghubungkan kader dengan pelatihan, dukungan biaya, mentor, dan pengalaman praktik agar kompetensi mereka diakui serta berguna bagi masyarakat.",
        tujuan: "Memperluas jalan dari perkaderan menuju profesi yang bermartabat tanpa memisahkan keahlian dari tanggung jawab sosial.",
        fokus: ["Hukum: kesempatan belajar pendidikan profesi dan persiapan ujian advokat.", "Keuangan dan perpajakan: akses kelas brevet, akuntansi, pasar modal, dan keuangan syariah.", "Teknologi: penguatan keterampilan data, keamanan siber, komputasi awan, dan manajemen proyek."],
        implementasi: "Kader dipertemukan dengan jalur profesi sesuai minat dan kebutuhannya. HMI menjajaki beasiswa atau keringanan biaya bersama penyelenggara yang berwenang, menyiapkan pendampingan belajar, lalu menghubungkan peserta dengan alumni untuk praktik dan peluang magang.",
        hasil: ["Akses pendidikan dan sertifikasi profesi", "Pendampingan alumni lintas bidang", "Jejaring magang dan pengalaman praktik"],
      },
      {
        nomor: "17",
        judul: "Sekolah Konstitusi & Hukum Nasional HMI",
        urgensi: "Tantangan demokrasi dan supremasi hukum menuntut kader yang mampu membaca konstitusi secara cermat, bukan hanya menyuarakan keberatan. Gagasan perubahan akan lebih berpengaruh bila hadir bersama argumentasi hukum yang kuat.",
        deskripsi: "Sekolah Konstitusi menjadi ruang belajar bagi kader untuk menautkan literasi UUD 1945, analisis kebijakan, dan pembelaan hak warga dengan praktik hukum yang bertanggung jawab.",
        tujuan: "Melahirkan kader yang dapat menyumbang naskah akademik, amicus curiae, usulan regulasi, dan advokasi hak konstitusional yang berbasis kajian.",
        fokus: ["Konstitusi dan Pancasila: memahami dasar serta perubahan ketatanegaraan.", "Pengujian norma dan litigasi: belajar menyusun argumentasi perkara dan amicus curiae.", "Perancangan regulasi: mengubah temuan lapangan menjadi usulan aturan yang inklusif.", "HAM dan demokrasi: membela hak warga dengan data dan kepekaan sosial."],
        implementasi: "Kelas pakar, diskusi kasus, dan peradilan semu memberi tempat untuk menguji gagasan. Kader dapat mengembangkan constitutional paper bersama akademisi dan praktisi, lalu memperdalam pengalaman melalui kolaborasi dengan lembaga bantuan hukum dan mitra yang bersedia.",
        hasil: ["Karya tulis dan argumentasi konstitusional", "Kader dengan literasi hukum lebih kuat", "Jejaring advokasi dan bantuan hukum"],
      },
      {
        nomor: "18",
        judul: "HMI Podcast & Media Channel",
        urgensi: "Kajian dan pengalaman kader sering berhenti di forum terbatas, sementara mahasiswa mencari pengetahuan lewat audio dan video singkat. HMI memerlukan ruang publik yang mampu membawa ide serius ke bahasa yang dekat dengan generasi sekarang.",
        deskripsi: "Kanal podcast dan media HMI dapat menghidupkan percakapan tentang kebangsaan, kaderisasi, karya, karier, dan riset tanpa kehilangan kedalaman gagasan.",
        tujuan: "Menjadikan pemikiran kader dan temuan riset lebih mudah ditemukan, didiskusikan, dan dipakai masyarakat.",
        fokus: ["HMI National Talk: isu organisasi, publik, dan kebangsaan.", "Global Cadre Insight: pengalaman kader serta alumni di panggung dunia.", "Ruang Insan Cita: nilai, keislaman, dan pengabdian.", "Kader Pencipta: kewirausahaan, profesi, dan perjalanan karier."],
        implementasi: "LAPMI dan kontributor cabang dapat membangun kalender editorial, menghadirkan narasumber kredibel, serta mengolah satu percakapan menjadi episode penuh dan cuplikan yang mudah dibagikan. Kemitraan media atau pendidikan dijajaki dengan menjaga independensi isi.",
        hasil: ["Episode audio dan video berkala", "Panggung publikasi riset serta karya kader", "Arsip pengetahuan yang mudah diakses"],
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
      {
        nomor: "19",
        judul: "Museum dan Perpustakaan Digital HMI",
        urgensi: "Jejak pendiri, dokumen kongres, pemikiran, dan karya kader tersebar di banyak tangan. Bila tidak dihimpun dan diberi konteks, generasi berikutnya kehilangan kesempatan belajar dari keputusan serta perdebatan yang membentuk HMI.",
        deskripsi: "Museum dan perpustakaan digital dirancang sebagai rumah memori organisasi: sejarah dapat dilihat, sumbernya dapat ditelusuri, dan gagasannya dapat dibaca ulang lintas generasi.",
        tujuan: "Menjaga warisan intelektual HMI sebagai bahan belajar yang hidup, bukan arsip yang hanya disimpan.",
        fokus: ["Galeri pendiri dan tokoh: menempatkan perjalanan Lafran Pane serta tokoh lain dalam konteks zamannya.", "Ruang pemikiran dan NDP: memperlihatkan perkembangan gagasan serta perdebatan intelektual.", "Perpustakaan kader: membuka akses ke karya yang izin publikasinya jelas.", "Arsip kongres dan kebijakan: membuat keputusan organisasi lebih mudah ditemukan kembali."],
        implementasi: "Pengumpulan dimulai dari inventaris dokumen di PB HMI, cabang, dan alumni, lalu berlanjut ke digitalisasi, pemeriksaan metadata, izin, serta kurasi. Koleksi daring dapat tumbuh berdampingan dengan ruang baca fisik dan kerja sama kearsipan yang relevan.",
        hasil: ["Koleksi sejarah dan karya yang terkurasi", "Arsip digital dengan sumber yang jelas", "Ruang belajar sejarah organisasi"],
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
      {
        nomor: "20",
        judul: "HMI Global Scholarship & Mentorship",
        urgensi: "Potensi akademik kader tidak selalu diikuti akses informasi beasiswa, kesiapan bahasa, atau pendamping yang pernah menempuh kampus tujuan. Hambatan itu dapat diperkecil melalui ekosistem persiapan yang saling menguatkan.",
        deskripsi: "Program ini menjadikan perjalanan studi luar negeri lebih mungkin diraih: kader dibantu mematangkan tujuan akademik, berkas, wawancara, dan jejaring pendamping di negara tujuan.",
        tujuan: "Memperluas peluang kader melanjutkan studi S2 atau S3 dan membawa pulang pengetahuan bagi masyarakat Indonesia.",
        fokus: ["Scholarship Boot Camp: menguatkan esai, proposal riset, dan kesiapan bahasa.", "Mentorship dan simulasi wawancara: belajar bersama alumni penerima beasiswa.", "Kemitraan institusional: membuka akses informasi dari penyedia beasiswa dan jejaring luar negeri."],
        implementasi: "Cabang dapat mengidentifikasi kader yang berminat; pendamping membantu menyusun target studi yang realistis. Setelah berkas dan wawancara dipersiapkan, mentor yang relevan mendampingi proses pendaftaran hingga penyesuaian awal bila kader diterima.",
        hasil: ["Kader dengan aplikasi beasiswa yang lebih siap", "Jaringan mentor alumni lintas negara", "Pendampingan transisi menuju studi luar negeri"],
      },
    ],
  },
];
