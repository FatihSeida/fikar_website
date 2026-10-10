/**
 * Isi "Bangun HMI Bersama": HMI digambarkan sebagai bangunan. Fondasi tidak
 * dinilai; sebelas bagian bangunan masing-masing terhubung dengan indikator
 * kemunduran HMI dari Agussalim Sitompul (2006). Seluruh 44 indikator terpakai,
 * masing-masing satu kali. Disimpan di server dan baru dikirim setelah rilis.
 */

const fondasi = [
  { nama: "Nilai Dasar Perjuangan", uraian: "Landasan nilai yang menjadi arah gerak setiap kader." },
  { nama: "Tujuan HMI", uraian: "Pasal 4 Anggaran Dasar: terbinanya insan akademis, pencipta, pengabdi yang bernafaskan Islam." },
  { nama: "Independensi", uraian: "Sikap organisasi yang tidak bergantung pada kekuatan mana pun." },
];

const bagian = [
  { id: "atap", nama: "Atap", tema: "Arah perjuangan dan independensi", sasaran: "arah perjuangan dan independensi HMI", indikator: [4, 26, 29, 44],
    pilihan: ["sikap publik berbasis kajian", "aturan rangkap jabatan dan konflik kepentingan", "advokasi isu mahasiswa"] },
  { id: "jendela", nama: "Jendela", tema: "Peran di gerakan mahasiswa dan masyarakat", sasaran: "peran HMI di gerakan mahasiswa dan masyarakat", indikator: [20, 35],
    pilihan: ["jejaring alumni untuk mentoring", "kemitraan dengan kampus dan lembaga", "jejaring internasional"] },
  { id: "ruang-kerja", nama: "Ruang kerja", tema: "Karya, profesi, dan Kohati", sasaran: "wadah karya, profesi, dan kepemimpinan Kohati", indikator: [12, 28],
    pilihan: ["ruang publikasi dan apresiasi karya kader", "jalur karier dan magang kader", "kepemimpinan HMI-Wati dan Kohati"] },
  { id: "instalasi", nama: "Instalasi listrik dan air", tema: "Data dan komunikasi antarjenjang", sasaran: "data dan komunikasi antarjenjang", indikator: [36, 37],
    pilihan: ["data minimum kader yang sama di semua cabang", "data yang dikembalikan ke komisariat", "kanal komunikasi resmi antarjenjang"] },
  { id: "dinding", nama: "Dinding", tema: "Budaya organisasi", sasaran: "budaya organisasi", indikator: [23, 27, 32, 34, 39, 40],
    pilihan: ["forum dengan giliran bicara dan notulen keputusan", "kritik yang dijawab dengan alasan dan tindak lanjut", "apresiasi karya dan teladan"] },
  { id: "tiang", nama: "Tiang", tema: "Konstitusi dan tata kelola", sasaran: "konstitusi dan tata kelola organisasi", indikator: [8, 24, 25, 41],
    pilihan: ["program yang wajib punya target dan ukuran", "SK dan surat yang terverifikasi digital", "laporan keuangan terbuka berkala"] },
  { id: "rangka", nama: "Rangka", tema: "Arsitektur organisasi: jenjang, Badko, badan khusus, dan lembaga kekaryaan", sasaran: "arsitektur organisasi HMI", indikator: [5, 11, 22],
    pilihan: ["Badko yang berperan sebagai pendamping cabang", "badan khusus dan lembaga kekaryaan dengan program terukur", "alur koordinasi antarjenjang yang tertulis"] },
  { id: "perpustakaan", nama: "Perpustakaan", tema: "Tradisi intelektual dan riset", sasaran: "tradisi intelektual dan riset kader", indikator: [14, 15, 16, 30, 38, 42],
    pilihan: ["kelompok studi rutin", "Balitbang sebagai jaringan riset kader", "penerbitan karya kader"] },
  { id: "lemari-arsip", nama: "Lemari arsip", tema: "Memori organisasi", sasaran: "memori organisasi", indikator: [18, 33, 43],
    pilihan: ["paket serah terima wajib", "arsip digital komisariat", "evaluasi setelah setiap kegiatan"] },
  { id: "pintu", nama: "Pintu dan teras", tema: "Rekrutmen dan kedekatan dengan mahasiswa", sasaran: "rekrutmen dan kedekatan HMI dengan mahasiswa", indikator: [1, 2, 7, 13, 19, 21],
    pilihan: ["kegiatan berbasis minat mahasiswa", "komisariat di kampus yang belum ada", "rekrutmen sepanjang tahun"] },
  { id: "lantai", nama: "Lantai", tema: "Perkaderan dan pedomannya", sasaran: "perkaderan dan pedomannya", indikator: [3, 6, 9, 10, 17, 31],
    pilihan: ["pendampingan 90 hari setelah LK 1", "standar minimum LK secara nasional", "regenerasi dan sertifikasi instruktur"] },
];

export function kontenBangunHmi() {
  return {
    judul: "Bangun HMI Bersama",
    pengantar: "Mari ikut berkontribusi dalam menyamakan persepsi tentang mau dibawa ke arah mana HMI dan apa yang paling pertama kali harus diperbaiki. Mari persiapkan HMI untuk Indonesia Emas 2045.",
    waktu: "sekitar tiga menit",
    skala: ["Rapuh", "Retak", "Cukup", "Kuat", "Kokoh"],
    fondasi,
    bagian,
  };
}

export type KontenBangunHmi = ReturnType<typeof kontenBangunHmi>;
export const ID_BAGIAN = bagian.map((item) => item.id);
