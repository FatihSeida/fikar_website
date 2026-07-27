/**
 * Riwayat pendidikan, pelatihan, dan organisasi Nur Ghina Muslimah.
 *
 * Sumbernya CV pribadi. Dua data dari CV sengaja TIDAK dimuat di sini:
 * alamat rumah lengkap dan nomor telepon. Keduanya lazim ada di CV yang
 * dikirim ke pihak tertentu, tetapi situs ini publik dan dapat diindeks
 * mesin pencari — menerbitkannya berarti menyebarkannya ke siapa saja.
 */

export interface BarisRiwayat {
  periode: string;
  lembaga: string;
  peran?: string;
}

/** Pendidikan formal, dari yang terbaru. */
export const pendidikan: BarisRiwayat[] = [
  { periode: "2023 — sekarang", lembaga: "PERBANAS Institute, Jakarta", peran: "S-2 Magister Akuntansi" },
  { periode: "2017 — 2021", lembaga: "IAIN Palangka Raya", peran: "S-1 Ekonomi" },
  { periode: "2014 — 2017", lembaga: "MAN Model Palangka Raya" },
  { periode: "2011 — 2014", lembaga: "MTsN 1 Model Palangka Raya" },
  { periode: "2005 — 2011", lembaga: "SDN 2 Pahandut Palangka Raya" },
];

/** Jenjang pelatihan kader HMI. */
export const pelatihan: BarisRiwayat[] = [
  { periode: "2024", lembaga: "HMI Cabang Jambi", peran: "Latihan Kader III" },
  { periode: "2019", lembaga: "HMI Cabang Pangkalanbun", peran: "Latihan Kader II" },
  { periode: "2018", lembaga: "HMI Cabang Barabai", peran: "Latihan Khusus KOHATI (LKK)" },
  { periode: "2017", lembaga: "HMI Cabang Palangka Raya", peran: "Latihan Kader I" },
];

/**
 * Penanda warna latar tiap baris riwayat organisasi. Dipakai untuk
 * membedakan lembaga sekilas tanpa menambah label.
 */
export type WarnaLembaga = "oic" | "hmi" | "lain";

export interface BarisOrganisasi extends BarisRiwayat {
  /** Tahun mulai — dipakai untuk mengurutkan, bukan untuk ditampilkan. */
  mulai: number;
  /** Amanah yang masih berjalan naik ke urutan teratas. */
  berjalan?: boolean;
  warna: WarnaLembaga;
}

/**
 * Riwayat organisasi — kepengurusan HMI/KOHATI dan lembaga lain digabung
 * dalam satu daftar kronologis, terbaru di atas.
 */
const organisasiMentah: BarisOrganisasi[] = [
  { mulai: 2024, berjalan: true, periode: "2024 — sekarang", lembaga: "PB HMI", peran: "Ketua Bidang Pariwisata dan Ekonomi Kreatif", warna: "hmi" },
  { mulai: 2024, berjalan: true, periode: "2024 — sekarang", lembaga: "OIC Youth Indonesia", peran: "Ketua Bidang Pariwisata dan Ekonomi Kreatif", warna: "oic" },
  { mulai: 2023, berjalan: true, periode: "2023 — sekarang", lembaga: "Kalimantan Muda Indonesia", peran: "Anggota", warna: "lain" },
  { mulai: 2024, periode: "2024", lembaga: "KOHATI PB HMI", peran: "Wakil Sekretaris Umum Bidang PAO", warna: "hmi" },
  { mulai: 2023, periode: "2023", lembaga: "KOHATI PB HMI", peran: "Departemen Hubungan Antar Lembaga", warna: "hmi" },
  { mulai: 2022, periode: "2022", lembaga: "KH-LAW.ID", peran: "Partner of Brand Marketing Skill", warna: "lain" },
  { mulai: 2020, periode: "2020 — 2021", lembaga: "KOHATI Cabang Palangka Raya", peran: "Ketua Umum", warna: "hmi" },
  { mulai: 2019, periode: "2019 — 2020", lembaga: "KOHATI Cabang Palangka Raya", peran: "Sekretaris Umum", warna: "hmi" },
  { mulai: 2019, periode: "2019 — 2020", lembaga: "DEMA IAIN Palangka Raya", peran: "Koordinator Bidang Organisasi dan Kesekretariatan", warna: "lain" },
  { mulai: 2019, periode: "2019 — 2020", lembaga: "KPUM IAIN Palangka Raya", peran: "Sekretaris", warna: "lain" },
  { mulai: 2018, periode: "2018 — 2019", lembaga: "HMI Komisariat Syariah IAIN Palangka Raya", peran: "Sekretaris Umum", warna: "hmi" },
  { mulai: 2018, periode: "2018 — 2019", lembaga: "DEMA FEBI IAIN Palangka Raya", peran: "Koordinator Bidang Advokasi", warna: "lain" },
  { mulai: 2018, periode: "2018 — 2019", lembaga: "KSEI FEBI IAIN Palangka Raya", peran: "Ketua", warna: "lain" },
  { mulai: 2018, periode: "2018 — 2019", lembaga: "KPUM FEBI IAIN Palangka Raya", peran: "Ketua", warna: "lain" },
  { mulai: 2017, periode: "2017 — 2018", lembaga: "Lembaga Seni dan Budaya Mahasiswa IAIN Palangka Raya", peran: "Sekretaris Umum", warna: "lain" },
];

/** Yang masih diemban lebih dulu, sisanya menurut tahun mulai. */
export const organisasi: BarisOrganisasi[] = [...organisasiMentah].sort((a, b) => {
  if (Boolean(a.berjalan) !== Boolean(b.berjalan)) return a.berjalan ? -1 : 1;
  return b.mulai - a.mulai;
});

export const kelompok = [
  { judul: "Riwayat Organisasi", baris: organisasi },
  { judul: "Pelatihan Kader", baris: pelatihan },
  { judul: "Pendidikan", baris: pendidikan },
] as const;
