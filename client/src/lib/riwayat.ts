export interface BarisRiwayat {
  periode: string;
  lembaga: string;
  peran?: string;
}

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
  { judul: "Perjalanan di HMI", baris: organisasiHmi },
  { judul: "Kepemimpinan dan Profesi", baris: organisasiLain },
  { judul: "Pendidikan", baris: pendidikan },
] as const;
