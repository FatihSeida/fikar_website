/**
 * Perjalanan Nur Ghina dari bangku sekolah sampai kuliah, dipakai sebagai
 * naskah slider di beranda.
 *
 * Nama sekolah dan tahunnya diambil dari CV. Ceritanya sengaja ditahan pada
 * apa yang benar-benar diketahui — lomba BTQ sejak SD, lalu berorganisasi
 * (Pramuka, PMR) di jenjang menengah — tanpa menambah detail karangan.
 */
export interface SlidePerjalanan {
  jenjang: string;
  periode: string;
  sekolah: string;
  cerita: string;
}

export const perjalanan: SlidePerjalanan[] = [
  {
    jenjang: "Sekolah Dasar",
    periode: "2005 — 2011",
    sekolah: "SDN 2 Pahandut Palangka Raya",
    cerita:
      "Sejak sekolah dasar saya sudah terbiasa mengikuti lomba Baca Tulis Qur'an. Panggung-panggung kecil itu yang pertama kali mengajari saya berdiri di depan orang banyak.",
  },
  {
    jenjang: "Sekolah Menengah Pertama",
    periode: "2011 — 2014",
    sekolah: "MTsN 1 Model Palangka Raya",
    cerita:
      "Di sini saya mulai mengenal dunia keorganisasian. Pramuka dan PMR menjadi tempat belajar bekerja bersama orang lain, jauh sebelum saya tahu istilah organisasi itu sendiri.",
  },
  {
    jenjang: "Sekolah Menengah Atas",
    periode: "2014 — 2017",
    sekolah: "MAN Model Palangka Raya",
    cerita:
      "Kebiasaan berorganisasi itu terus berjalan dan makin serius. Semakin banyak kegiatan diikuti, semakin terbiasa saya mendengarkan sebelum mengambil keputusan.",
  },
  {
    jenjang: "Perguruan Tinggi",
    periode: "2017 — 2021",
    sekolah: "IAIN Palangka Raya",
    cerita:
      "Masuk bangku kuliah, jalan itu bertemu HMI. Dari komisariat, lalu cabang, sampai akhirnya pengurus besar — semuanya berangkat dari kebiasaan yang tumbuh sejak sekolah.",
  },
];
