/**
 * Riwayat pendidikan, pelatihan, dan organisasi Ghina.
 *
 * Sumbernya CV pribadi. Dua data dari CV sengaja TIDAK dimuat di sini:
 * alamat rumah lengkap dan nomor telepon. Keduanya lazim ada di CV yang
 * dikirim ke pihak tertentu, tetapi situs ini publik dan dapat diindeks
 * mesin pencari — menerbitkannya berarti menyebarkannya ke siapa saja.
 * Lihat catatan di README bila nanti diputuskan lain.
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

/** Amanah struktural di HMI dan KOHATI. */
export const kepengurusan: BarisRiwayat[] = [
  { periode: "2025", lembaga: "PB HMI", peran: "Kepala Bidang Pariwisata dan Ekonomi Kreatif" },
  { periode: "2024", lembaga: "KOHATI PB HMI", peran: "Wakil Sekretaris Umum Bidang PAO" },
  { periode: "2023", lembaga: "KOHATI PB HMI", peran: "Departemen Hubungan Antar Lembaga" },
  { periode: "2020 — 2021", lembaga: "KOHATI Cabang Palangka Raya", peran: "Ketua Umum" },
  { periode: "2019 — 2020", lembaga: "KOHATI Cabang Palangka Raya", peran: "Sekretaris Umum" },
  { periode: "2018 — 2019", lembaga: "HMI Komisariat Syariah IAIN Palangka Raya", peran: "Sekretaris Umum" },
];

/** Organisasi kampus dan lembaga lain. */
export const organisasi: BarisRiwayat[] = [
  { periode: "2024 — 2029", lembaga: "OIC Youth Indonesia", peran: "Ketua Bidang Pariwisata dan Ekonomi Kreatif" },
  { periode: "2022", lembaga: "KH-LAW.ID", peran: "Partner of Brand Marketing Skill" },
  { periode: "2019 — 2020", lembaga: "DEMA IAIN Palangka Raya", peran: "Koordinator Bidang Organisasi dan Kesekretariatan" },
  { periode: "2019 — 2020", lembaga: "KPUM IAIN Palangka Raya", peran: "Sekretaris" },
  { periode: "2018 — 2019", lembaga: "DEMA FEBI IAIN Palangka Raya", peran: "Koordinator Bidang Advokasi" },
  { periode: "2018 — 2019", lembaga: "KSEI FEBI IAIN Palangka Raya", peran: "Ketua" },
  { periode: "2018 — 2019", lembaga: "KPUM FEBI IAIN Palangka Raya", peran: "Ketua" },
  { periode: "2017 — 2018", lembaga: "Lembaga Seni dan Budaya Mahasiswa IAIN Palangka Raya", peran: "Sekretaris Umum" },
  { periode: "2014 — 2029", lembaga: "Kalimantan Muda Indonesia", peran: "Anggota" },
];

export const kelompok = [
  { judul: "Pendidikan", baris: pendidikan },
  { judul: "Pelatihan Kader", baris: pelatihan },
  { judul: "Kepengurusan", baris: kepengurusan },
  { judul: "Organisasi", baris: organisasi },
] as const;
