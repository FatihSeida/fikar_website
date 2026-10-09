/**
 * Bentuk isi Series yang ditampilkan sebagai cerita interaktif (scrollytelling).
 * Isinya disimpan di server (server/konten/series) dan baru dikirim setelah
 * seri terbit; situs hanya memuat cara menampilkannya.
 *
 * Setiap bab punya tiga lapis penjelasan. Pembaca selalu melihat `inti`; makin
 * banyak yang dibuka, makin dalam penjelasannya (`lanjut`, lalu `dalam`).
 * Bab berikutnya terbuka setelah pembaca menandai sudah paham bab ini.
 */

export type LapisPenjelasan = {
  /** Teks tombol pembuka, misalnya "Kenapa begitu?" atau "Contohnya seperti apa?". */
  judul: string;
  /** Paragraf dipisah baris kosong (\n\n). Bahasa sederhana. */
  isi: string;
};

export type BabCerita = {
  /** "bab-1", "bab-2", dan seterusnya. */
  id: string;
  /** Kunci adegan visual (lihat docs/series-interaktif/kontrak.md). */
  adegan: string;
  /** Label kecil di atas judul, misalnya "Bagian 1 · Yogyakarta, 1947". */
  label: string;
  /** Judul pendek, paling banyak sekitar 8 kata. */
  judul: string;
  /** Satu sampai tiga kalimat yang selalu terlihat. */
  inti: string;
  /** Dua sampai empat butir singkat (opsional). */
  poin?: string[];
  /** Lapis kedua: penjelasan lebih lanjut. */
  lanjut?: LapisPenjelasan;
  /** Lapis ketiga: lebih dalam lagi, boleh memuat kutipan naskah asli. */
  dalam?: LapisPenjelasan & { kutipan?: string };
  /** Satu kalimat yang dipahami pembaca sebelum lanjut ke bab berikutnya. */
  pahami: string;
};

export type CeritaSeri = {
  slug: string;
  pembuka: { label: string; judul: string; pengantar: string };
  bab: BabCerita[];
  penutup: { judul: string; isi: string; ajakan?: string };
  rujukan?: string[];
};
