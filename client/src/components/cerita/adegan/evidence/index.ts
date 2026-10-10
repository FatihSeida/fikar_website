import type { DaftarAdegan } from "../../kontrak";
import AdeganAturan from "./AdeganAturan";
import AdeganIdentitas from "./AdeganIdentitas";
import AdeganIngatan from "./AdeganIngatan";
import AdeganJejak from "./AdeganJejak";
import AdeganKaderisasi from "./AdeganKaderisasi";
import AdeganKebijakan from "./AdeganKebijakan";
import AdeganMemori from "./AdeganMemori";
import AdeganMenyusup from "./AdeganMenyusup";
import AdeganSiklus from "./AdeganSiklus";
import AdeganTataKelola from "./AdeganTataKelola";

/** Adegan Series 2 (Kebijakan Kaderisasi Berbasis Bukti). Kunci sama dengan `adegan` di isi cerita. */
export const adeganEvidence: DaftarAdegan = {
  "bukti-aturan": {
    jenis: "3d",
    Komponen: AdeganAturan,
    alt: "Buku aturan HMI jatuh satu per satu menjadi tumpukan tinggi, sementara map di lemari arsip di sebelahnya memudar sampai raknya kosong.",
  },
  "bukti-ingatan": {
    jenis: "2d",
    Komponen: AdeganIngatan,
    alt: "Seorang pengurus dikelilingi LPJ, serah terima, data LK, surat, SK, dan notulen. Saat ia demisioner dan pergi, dokumennya memudar, dan pengurus baru harus mulai dari awal.",
  },
  "bukti-jejak": {
    jenis: "2d",
    Komponen: AdeganJejak,
    alt: "Sebuah surat menyalakan empat label jejaknya: siapa, dari mana, kapan, dan terhubung dengan apa, lalu tersambung ke SK, sertifikat LK 1, dan notulen sehingga bisa diperiksa orang lain.",
  },
  "bukti-identitas": {
    jenis: "3d",
    Komponen: AdeganIdentitas,
    alt: "SK, sertifikat, dan surat di atas meja menerima cap identitas emas satu per satu, lalu ketiganya tersambung oleh benang cahaya.",
  },
  "bukti-memori": {
    jenis: "3d",
    Komponen: AdeganMemori,
    alt: "Piramida empat tingkat: Komisariat, Cabang, Badko, dan PB. Butiran dokumen naik dari tingkat ke tingkat, lalu gambaran emas mengalir kembali turun sampai ke komisariat.",
  },
  "bukti-kaderisasi": {
    jenis: "3d",
    Komponen: AdeganKaderisasi,
    alt: "Jalur perjalanan kader dengan stasiun Daftar LK, LK 1, Pengurus, dan LK 2. Titik-titik kader berjalan bersama; sebagian berhenti di tengah jalan, paling banyak sesudah LK 1.",
  },
  "bukti-tatakelola": {
    jenis: "2d",
    Komponen: AdeganTataKelola,
    alt: "Lini masa empat kepengurusan dengan batang SK dan titik kegiatan. Garis hari ini bergerak, dan batang satu komisariat yang lewat masa SK-nya menyala sebagai peringatan.",
  },
  "bukti-kebijakan": {
    jenis: "2d",
    Komponen: AdeganKebijakan,
    alt: "Meja musyawarah dilihat dari atas. Awalnya peserta hanya bermodal perkiraan; lalu layar di tengah meja menampilkan gambaran klaster cabang dan semua peserta melihat ke sana.",
  },
  "bukti-siklus": {
    jenis: "3d",
    Komponen: AdeganSiklus,
    alt: "Cincin tiga simpul, Kaderisasi, Tata kelola, dan Kebijakan, dijahit benang emas identitas dokumen dan terus berputar. Bila satu mata rantai putus, putarannya berhenti.",
  },
  "bukti-menyusup": {
    jenis: "2d",
    Komponen: AdeganMenyusup,
    alt: "Tiga anak tangga di atas fondasi identitas dokumen terbuka satu per satu, dijaga perisai pelindung data kader, dengan garis putus-putus yang menandai lapis berikutnya.",
  },
};
