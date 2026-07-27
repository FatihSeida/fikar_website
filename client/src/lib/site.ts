/**
 * Identitas situs. Diubah di sini, bukan di tiap komponen.
 *
 * Nomor telepon dan alamat rumah dari CV sengaja tidak dicantumkan: situs
 * ini publik dan terindeks mesin pencari, sedangkan CV dikirim ke pihak
 * tertentu saja. Surel dicantumkan karena memang berfungsi sebagai titik
 * kontak yang diniatkan terbuka.
 */
export const site = {
  nama: "Nur Ghina Muslimah",
  namaDepan: "Nur Ghina",
  namaBelakang: "Muslimah",
  gelar: "S.E.",
  lahir: "Palangka Raya, 14 Agustus 1999",
  asal: "Palangka Raya, Kalimantan Tengah",
  domisili: "Jakarta Selatan, DKI Jakarta",
  email: "nurghinamuslimah@gmail.com",
  instagram: {
    label: "Instagram",
    pengguna: "@nurghinaa",
    url: "https://www.instagram.com/nurghinaa/",
  },
} as const;
