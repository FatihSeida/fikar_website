export interface BarisRiwayat {
  periode: string;
  lembaga: string;
  peran?: string;
}

export interface PengalamanAdvokasi {
  judul: string;
  uraian: string;
}

export const ringkasanProfil = [
  "Akar gerak Ahmad Zulfikar tumbuh dari kaderisasi HMI Cabang Gowa Raya dan berlanjut hingga tanggung jawab di Pengurus Besar HMI. Pendidikan hukum yang ia tempuh hingga Magister Ilmu Hukum di Universitas Trisakti menjadi bekal dalam kerja advokasi publik.",
  "Pada Musyawarah Daerah 17 Mei 2025, ia ditetapkan sebagai Ketua Pimpinan Daerah F.SPTI–KSPSI DKI Jakarta periode 2025–2030. Amanah ini melanjutkan pengalamannya mendampingi pekerja dan mengelola organisasi buruh di Makassar, dengan perhatian pada perlindungan hak pekerja serta hubungan industrial yang sehat antara pekerja, pengusaha, dan pemerintah.",
] as const;

export const ruangPengabdian = [
  {
    label: "Kader HMI",
    uraian: "Berproses sejak Basic Training 2014 di Cabang Gowa Raya hingga mengemban tanggung jawab di PB HMI.",
  },
  {
    label: "Pemimpin Serikat Pekerja",
    uraian: "Ketua Pimpinan Daerah F.SPTI–KSPSI DKI Jakarta untuk masa bakti 2025–2030.",
  },
  {
    label: "Advokasi Publik",
    uraian: "Membawa bekal hukum ke pendampingan pekerja dan persoalan publik, termasuk sebagai advokat dan anggota PERADI sejak disumpah pada 2023.",
  },
] as const;

export const pengalamanAdvokasi: readonly PengalamanAdvokasi[] = [
  {
    judul: "Hak 83 buruh PT Eastern Pearl Flour Mills",
    uraian: "Memimpin pendampingan mogok kerja dan aksi sekitar satu bulan untuk menuntut hak normatif serta pesangon 83 pekerja. Aksi di depan pabrik terigu di Jalan Nusantara Baru juga diwarnai tindakan represif aparat yang menyebabkan Ahmad Zulfikar dan peserta lain mengalami luka.",
  },
  {
    judul: "Upah di bawah minimum di PT Catur Putra Harmoni",
    uraian: "Mendampingi sekitar 50 pekerja yang dilaporkan menerima upah di bawah ketentuan minimum. Advokasi dilakukan melalui aksi dan pendudukan lima gudang secara serentak agar perusahaan menanggapi tuntutan pekerja.",
  },
  {
    judul: "PHK sepihak di PT Kepuh Kencana",
    uraian: "Mengadvokasi puluhan pekerja pabrik produksi spandek di Gudang 88 Makassar yang mengalami pemutusan hubungan kerja sepihak, termasuk melalui aksi pendudukan yang berlangsung selama dua minggu.",
  },
  {
    judul: "PHK pekerja PT Mallo di Kabupaten Maros",
    uraian: "Memberikan pendampingan kepada puluhan pekerja PT Mallo yang kehilangan pekerjaan dan memperjuangkan pemenuhan hak mereka setelah pemutusan hubungan kerja.",
  },
  {
    judul: "Perselisihan industrial di Pelindo dan Pelni Makassar",
    uraian: "Terlibat dalam aksi dan pendudukan pelabuhan untuk menyuarakan penyelesaian perselisihan hubungan industrial yang melibatkan pekerja, PT Pelindo, dan PT Pelni di Makassar.",
  },
  {
    judul: "PHK sepihak di Mitsubishi Jalan Sultan Alauddin",
    uraian: "Mendampingi pekerja yang terkena PHK sepihak dan membawa tuntutan mereka melalui aksi pendudukan di lokasi perusahaan Mitsubishi di Jalan Sultan Alauddin, Makassar.",
  },
  {
    judul: "PHK pekerja PT Indo Marco di Kawasan Industri Makassar",
    uraian: "Mengadvokasi karyawan PT Indo Marco di Kawasan Industri Makassar yang mengalami pemutusan hubungan kerja agar hak-hak ketenagakerjaannya diperiksa dan diperjuangkan.",
  },
  {
    judul: "Penahanan ijazah karyawan",
    uraian: "Mendampingi pekerja pada sebuah perusahaan kendaraan roda dua di Jalan Bawakaraeng yang ijazahnya ditahan perusahaan, termasuk melalui aksi langsung di lokasi perusahaan.",
  },
  {
    judul: "Syarat BPJS Kesehatan dalam pengurusan SIM dan SKCK",
    uraian: "Menyuarakan penolakan terhadap persyaratan kepesertaan BPJS Kesehatan untuk pengurusan SIM dan SKCK yang dinilai tidak relevan, terutama bagi calon pekerja. Isu tersebut dibawa melalui Rapat Dengar Pendapat hingga DPR RI di Senayan.",
  },
] as const;

export const sumberProfil = {
  nama: "Potret Nusantara",
  tanggal: "19 Mei 2025",
  url: "https://potretnusantara.co.id/2025/05/19/ahmad-zulfikar-jadi-nahkoda-baru-f-spti-dki-jakarta-siap-perjuangkan-hak-pekerja/",
} as const;

export const jenjangTraining: BarisRiwayat[] = [
  { periode: "2014", lembaga: "Basic Training", peran: "HMI Komisariat Ushuluddin, Filsafat dan Politik, Cabang Gowa Raya" },
  { periode: "2016", lembaga: "Intermediate Training", peran: "HMI Cabang Kuningan" },
  { periode: "2024", lembaga: "Advance Training", peran: "HMI Badko Jawa Barat" },
];

export const pendidikan: BarisRiwayat[] = [
  { periode: "Magister", lembaga: "Universitas Trisakti", peran: "Magister Ilmu Hukum" },
  { periode: "Sarjana", lembaga: "UIN Alauddin Makassar", peran: "Sarjana Ilmu Hukum" },
  { periode: "2021–2023", lembaga: "Pendidikan profesi advokat", peran: "PKPA, magang, lulus UPA 2022, dan disumpah sebagai advokat pada 2023" },
];

export const organisasiHmi: BarisRiwayat[] = [
  { periode: "2025–sekarang", lembaga: "PB HMI", peran: "Wakil Sekretaris Bidang Pariwisata dan Ekonomi Kreatif" },
  { periode: "2022", lembaga: "Badko HMI Sulselbar", peran: "Wakil Sekretaris Bidang Transportasi Publik dan Kebijakan Strategis" },
  { periode: "2017", lembaga: "HMI Cabang Gowa Raya", peran: "Departemen Hukum dan HAM" },
  { periode: "2016", lembaga: "HMI Komisariat", peran: "Departemen Perguruan Tinggi, Kemahasiswaan, dan Kepemudaan" },
];

export const organisasiLain: BarisRiwayat[] = [
  { periode: "2020–2023", lembaga: "DPP SIMPOSIUM Sulawesi Selatan", peran: "Ketua Umum" },
  { periode: "2023–2024", lembaga: "FSPTI KSPSI Kota Makassar", peran: "Ketua, advokasi dan konsolidasi pekerja sektor transportasi" },
  { periode: "2025–2030", lembaga: "PD F.SPTI–KSPSI DKI Jakarta", peran: "Ketua Pimpinan Daerah, perlindungan pekerja dan penguatan hubungan industrial" },
];

export const kelompok = [
  {
    judul: "Jenjang Training di HMI",
    baris: jenjangTraining,
  },
  {
    judul: "Perjalanan di HMI",
    baris: organisasiHmi,
  },
  {
    judul: "Pendidikan",
    baris: pendidikan,
  },
  {
    judul: "Organisasi Non-HMI",
    baris: organisasiLain,
  },
] as const;
