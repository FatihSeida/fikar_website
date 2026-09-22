export interface BarisRiwayat {
  periode: string;
  lembaga: string;
  peran?: string;
}

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
  { periode: "2022", lembaga: "Badko HMI", peran: "Wakil Sekretaris Bidang Transportasi Publik dan Kebijakan Strategis" },
  { periode: "2017", lembaga: "HMI Cabang", peran: "Ketua Bidang Transportasi Publik dan Kebijakan Strategis" },
  { periode: "2016", lembaga: "HMI Komisariat", peran: "Departemen Perguruan Tinggi, Kemahasiswaan, dan Kepemudaan" },
];

export const organisasiLain: BarisRiwayat[] = [
  { periode: "2020–2023", lembaga: "DPP SIMPOSIUM Sulawesi Selatan", peran: "Ketua Umum" },
  { periode: "Rekam organisasi", lembaga: "FSPTI KSPSI Kota Makassar", peran: "Ketua, advokasi dan konsolidasi pekerja sektor transportasi" },
  { periode: "Rekam organisasi", lembaga: "FSPTI KSPSI DKI Jakarta", peran: "Ketua Umum, representasi kepentingan anggota dalam hubungan industrial" },
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
