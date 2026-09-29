/**
 * Bentuk tampilan foto di halaman Galeri. Kelas Tailwind-nya ditulis utuh di
 * client/src/pages/GalleryPage.tsx supaya tidak terbuang saat build.
 */
export const tataGaleri = ["potret", "lebar", "panjang", "penuh", "persegi"] as const;
export type TataGaleri = (typeof tataGaleri)[number];

export const labelTataGaleri: Record<TataGaleri, string> = {
  potret: "Potret (sepertiga lebar)",
  lebar: "Lebar (setengah lebar)",
  panjang: "Panjang (dua pertiga lebar)",
  penuh: "Penuh (selebar halaman)",
  persegi: "Persegi (sepertiga lebar)",
};

export interface FotoGaleri {
  image: string;
  caption: string;
  tata: TataGaleri;
  posisi?: string;
  gambarPenuh?: string;
}

/** Foto yang sebelumnya ditanam langsung di halaman Galeri, sesuai urutan tampilnya. */
export const galeriBawaan: readonly FotoGaleri[] = [
  { image: "/ahmad/standing-centered.webp", caption: "Ahmad Zulfikar berdiri mengenakan atribut HMI", tata: "potret" },
  { image: "/ahmad/gallery-02.webp?v=oriented", gambarPenuh: "/ahmad/gallery-02-cropped.webp", caption: "Potret Ahmad Zulfikar mengenakan batik", tata: "potret" },
  { image: "/ahmad/profile-centered.webp", caption: "Ahmad Zulfikar duduk mengenakan atribut HMI", tata: "potret" },
  { image: "/ahmad/gallery-01.webp", caption: "Ahmad Zulfikar berbicara dalam sesi dokumentasi", tata: "lebar" },
  { image: "/ahmad/gallery-03.webp", caption: "Ahmad Zulfikar dalam sesi wawancara", tata: "lebar" },
  { image: "/ahmad/journey-training.webp", caption: "Ahmad Zulfikar menyampaikan materi dalam forum perkaderan HMI", tata: "potret" },
  { image: "/ahmad/journey-hmi-pinrang.webp", caption: "Ahmad Zulfikar berbicara dalam kegiatan HMI Cabang Pinrang", tata: "panjang" },
  { image: "/ahmad/journey-hmi-tv.webp", caption: "Ahmad Zulfikar menyampaikan laporan dalam forum nasional HMI", tata: "lebar" },
  { image: "/ahmad/journey-court-wide.webp", caption: "Ahmad Zulfikar bersama tim dalam kegiatan advokasi", tata: "lebar" },
  { image: "/ahmad/journey-court-detail.webp", caption: "Ahmad Zulfikar dalam kegiatan profesi hukum", tata: "penuh" },
  { image: "/ahmad/gallery-forum-integritas.webp", caption: "Ahmad Zulfikar berbicara dalam forum integritas organisasi", tata: "persegi", posisi: "70% center" },
  { image: "/ahmad/gallery-diskusi-komunitas.webp", caption: "Ahmad Zulfikar berdiskusi bersama komunitas", tata: "persegi", posisi: "center center" },
  { image: "/ahmad/gallery-forum-profesi.webp", caption: "Ahmad Zulfikar menyampaikan pandangan dalam forum profesi", tata: "persegi", posisi: "60% center" },
  { image: "/ahmad/gallery-aksi-mahasiswa.webp", caption: "Ahmad Zulfikar dalam aksi mahasiswa", tata: "potret", posisi: "42% center" },
  { image: "/ahmad/gallery-aksi-advokasi.webp", caption: "Ahmad Zulfikar dalam aksi advokasi", tata: "potret", posisi: "36% center" },
  { image: "/ahmad/gallery-intermediate-training.webp", caption: "Ahmad Zulfikar dalam kegiatan Intermediate Training HMI", tata: "potret", posisi: "center 34%" },
  { image: "/ahmad/gallery-kebersamaan-komunitas.webp", caption: "Ahmad Zulfikar bersama peserta pertemuan komunitas", tata: "lebar", posisi: "center 48%" },
  { image: "/ahmad/gallery-diskusi-terbuka.webp", caption: "Ahmad Zulfikar memandu diskusi terbuka", tata: "lebar", posisi: "center 54%" },
  { image: "/ahmad/gallery-forum-warga.webp", caption: "Suasana forum dialog bersama warga", tata: "lebar", posisi: "center center" },
  { image: "/ahmad/gallery-forum-organisasi.webp", caption: "Ahmad Zulfikar bersama peserta forum organisasi", tata: "lebar", posisi: "center center" },
  { image: "/ahmad/gallery-rapat-dengar-pendapat.webp", caption: "Ahmad Zulfikar menyampaikan pandangan dalam rapat dengar pendapat", tata: "penuh", posisi: "center 42%" },
];

/** Isi galeri lama dari kode seed sebelumnya; tidak pernah tampil di situs dan diganti galeriBawaan. */
export const galeriSeedLama: readonly [string, string][] = [
  ["/ahmad/portrait-standing.webp", "Ruang pengabdian"],
  ["/ahmad/gallery-01.webp", "Menyampaikan gagasan"],
  ["/ahmad/gallery-02.webp", "Jejak perjalanan"],
  ["/ahmad/portrait-hmi.webp", "Bersama HMI"],
  ["/ahmad/gallery-03.webp", "Percakapan tentang arah"],
  ["/ahmad/gallery-04.webp", "Dokumentasi kegiatan"],
];
