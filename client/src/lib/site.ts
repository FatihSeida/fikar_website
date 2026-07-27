/**
 * Identitas situs. Diubah di sini, bukan di tiap komponen.
 *
 * Catatan: alamat surel belum diketahui, jadi kontak diarahkan ke
 * Instagram. Bila nanti ada surel, tambahkan field `email` di sini dan
 * tampilkan di Contact.tsx serta SiteFooter.tsx.
 */
export const site = {
  nama: "Ghina Nur Muslimah",
  namaDepan: "Ghina",
  namaBelakang: "Nur Muslimah",
  instagram: {
    label: "Instagram",
    pengguna: "@nurghinaa",
    url: "https://www.instagram.com/nurghinaa/",
  },
} as const;
