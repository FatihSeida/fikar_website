// Tema warna. W adalah token warna aktif (THREE.Color) yang dipakai semua benda dan bahan.
// Nilai bawaan = palet bagian B.5 prompt indikator, ditambah zamrudTerang (warna label CERMIN, bagian E).
import * as THREE from "three";

export const PALET = {
  latar: "hsl(153, 50%, 7%)",        // latar scene dan body
  grid: "hsl(153, 36%, 11.5%)",      // garis grid kecil (1 unit)
  gridMayor: "hsl(153, 40%, 15%)",   // garis grid besar (5 unit)
  pelat: "hsl(153, 36%, 10%)",       // alas benda, lantai panggung, atap
  zamrud: "hsl(153, 62%, 36%)",      // benda yang sedang berproses
  zamrudPijar: "hsl(153, 72%, 42%)", // garis aktif, tepi kaca, denyut cermin
  zamrudRedup: "hsl(153, 55%, 24%)", // dinding bangunan, benda netral
  emas: "hsl(42, 52%, 58%)",         // hanya untuk hasil (Bagian 3)
  emasPijar: "hsl(42, 80%, 52%)",    // emissive emas
  krem: "hsl(42, 33%, 96%)",         // teks utama
  kertas: "hsl(42, 28%, 86%)",       // dokumen, kertas, kartu
  abu: "hsl(150, 5%, 52%)",          // gejala, kusam
  abuGelap: "hsl(150, 6%, 34%)",     // gejala, figur pudar
  pion: "hsl(150, 10%, 80%)",        // figur manusia normal
  zamrudTerang: "hsl(153, 52%, 52%)", // khusus teks: label CERMIN, titik label benda
};

// Tema baru dari palet bawaan, dengan sebagian token diganti. Contoh: buatTema({ emas: "hsl(45, 60%, 60%)" }).
// Kunci baru juga boleh ditambahkan; semuanya menjadi W.<kunci> dan variabel CSS --<kunci-kebab>.
export function buatTema(ubah = {}) {
  const hsl = { ...PALET, ...ubah };
  const warna = {};
  for (const [k, v] of Object.entries(hsl)) warna[k] = new THREE.Color(v);
  return { hsl, W: warna };
}

// Token aktif. Objek dan warnanya dipakai bersama; pakaiTema() mengubah isinya di tempat.
export const W = buatTema().W;
let hslAktif = { ...PALET };

const kebab = (s) => s.replace(/[A-Z]/g, (h) => "-" + h.toLowerCase());

// Pasang tema: isi W diganti di tempat dan variabel CSS di :root diperbarui.
// Panggil sebelum membangun benda (buatVideo() memanggilnya otomatis).
export function pakaiTema(tema = buatTema()) {
  for (const [k, c] of Object.entries(tema.W)) {
    if (W[k]) W[k].copy(c);
    else W[k] = c.clone();
  }
  hslAktif = { ...tema.hsl };
  if (typeof document !== "undefined") {
    const akar = document.documentElement.style;
    for (const [k, v] of Object.entries(hslAktif)) akar.setProperty("--" + kebab(k), v);
  }
}

// String CSS untuk token aktif, dengan alfa opsional. Contoh: cssWarna("latar", 0.9).
export function cssWarna(nama, alfa = 1) {
  const v = hslAktif[nama];
  if (!v) return nama; // bukan token: anggap sudah warna CSS
  return alfa >= 1 ? v : `color-mix(in srgb, ${v} ${(alfa * 100).toFixed(1)}%, transparent)`;
}
// Nama variabel CSS untuk token (dipakai komponen halaman). Bukan token → dikembalikan apa adanya.
export const varWarna = (nama) => (hslAktif[nama] ? `var(--${kebab(nama)})` : nama);
