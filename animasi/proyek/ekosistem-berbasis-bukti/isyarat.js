// Satu sumber waktu untuk gambar (adegan.js) dan suara (suara.mjs).
// Tanpa dependensi: berjalan di browser (Vite) maupun di Node.
//
// Video 3 seri tulisan: "Mewujudkan HMI dengan Ekosistem Berbasis Bukti". t dalam detik.

export const DURASI = 62;

export function acak(benih) { // mulberry32: acak berbenih, hasilnya selalu sama
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- adegan (batas kasar, untuk kamera dan teks)
export const ADEGAN = [
  [0, 8],    // 1 pembuka: lemari, debu, balon tanpa balasan
  [8, 13],   // 2 menyalin program kerja
  [13, 19],  // 3 aturan sudah ada
  [19, 25],  // 4 arti bukti
  [25, 32],  // 5 identitas dokumen
  [32, 40],  // 6 memori berjenjang
  [40, 47],  // 7 ekosistem
  [47, 51],  // 8 rambu aturan main
  [51, 62],  // 9 penutup
];

// ---------------------------------------------------------------- peristiwa gambar
export const T = {
  // 1. Pembuka
  figurMasuk: [0.25, 1.55],
  pintuBuka: [1.8, 2.65],      // derit pintu mulai di awal rentang
  debu: 2.2,                   // kepulan debu keluar dari lemari
  halamanJatuh: [2.45, 3.6],   // selembar halaman sobek melayang jatuh
  balonKirim: 4.3,             // balon pesan lepas dari kepala figur
  balonNaik: [4.3, 5.45],
  ketik: [4.75, 6.2],          // titik-titik "sedang mengetik" di balon
  tanpaBalasan: 6.35,          // balon memudar abu-abu, slot balasan kosong
  // 2. Menyalin
  kartuAmbil: [8.15, 9.15],    // kartu program kerja lama keluar dari lemari
  angkaGanti: 9.95,            // 2025 → 2026
  salin: [10.75, 11.55],       // dua salinan menyusul (ka-chunk)
  kartuPergi: [12.45, 13.1],
  // 3. Aturan sudah ada
  buku: [13.25, 13.5, 13.76, 14.06, 14.4, 14.75], // saat tiap buku mendarat (bawah → atas)
  garisTumbuh: [15.45, 16.55],
  garisPatah: 16.8,
  // 4. Arti bukti
  lembarMuncul: [19.3, 20.15],
  labelOrbit: [20.45, 20.9, 21.35, 21.8], // siapa, dari mana, kapan, terhubung dengan apa
  // 5. Identitas dokumen
  dokKeluar: [25.15, 26.45, 28.0], // sertifikat, SK, surat
  stempel: 27.05,                  // stempel menyentuh SK
  tagKlik: [25.95, 27.55, 28.75],  // label emas menempel
  garisSambung: [29.3, 30.4],
  lipat: [31.35, 32.2],            // dokumen berlipat menjadi titik emas
  // 6. Memori berjenjang
  bangunNaik: [31.7, 33.0],        // rumah, cabang, Badko, PB tumbuh dari grid
  tingkat: [33.2, 34.4, 35.6, 36.8], // gelombang titik tiba di komisariat, cabang, Badko, PB
  aliranNaik: [33.2, 36.5],
  aliranTurun: [37.4, 39.6],
  // 7. Ekosistem
  stasiun: [40.3, 42.0, 43.7],     // tangga, rak arsip, meja musyawarah
  putar: 45.3,                     // partikel emas berputar di antara ketiganya
  // 8. Rambu aturan main
  titikRumah: 47.2,
  perisai: 47.7,
  angkaNaik: [48.55, 48.9, 49.25, 49.6, 49.95],
  // 9. Penutup
  setahun: 51.15,
  figurBaru: [51.45, 52.65],
  pintuBaru: [52.85, 53.6],
  cahayaTertata: 53.0,
  mundur: [53.9, 58.9],
  denyutGrid: [54.3, 58.6],
  penutup: 57.0,
  ajakan: [58.35, 58.85],
};

// Keterangan utama [masuk, keluar]; teksnya ada di index.html dengan urutan yang sama.
export const KETERANGAN = [
  [0.6, 7.85],
  [8.3, 12.85],
  [13.5, 18.85],
  [19.5, 24.85],
  [25.3, 31.85],
  [32.5, 39.85],
  [40.3, 41.95],
  [42.0, 43.65],
  [43.7, 45.25],
  [45.3, 46.95],
  [47.3, 50.9],
  [51.9, 56.85],
  [57.0, DURASI + 1],
];

// ---------------------------------------------------------------- daftar isyarat suara (dalam t)
// pan: −1 kiri … 1 kanan, kira-kira mengikuti posisi x di layar. vel: variasi kecil.
export function daftarIsyarat() {
  const r = acak(31);
  const vel = () => 0.9 + 0.2 * r();
  const L = [];
  // 1. Pembuka
  L.push({ t: 0.0, jenis: "udara-buka", dur: 1.8 });
  L.push({ t: T.pintuBuka[0], jenis: "derit-pintu", dur: T.pintuBuka[1] - T.pintuBuka[0] + 0.25, pan: -0.05 });
  L.push({ t: T.debu, jenis: "kepul-debu", pan: 0.05 });
  L.push({ t: T.balonKirim, jenis: "kirim-balon", pan: -0.15 });
  L.push({ t: T.tanpaBalasan, jenis: "tanpa-balasan", pan: 0.1 });
  // 2. Menyalin
  L.push({ t: T.kartuAmbil[0] + 0.05, jenis: "kertas-geser", pan: 0.0 });
  L.push({ t: T.angkaGanti, jenis: "tik-angka", pan: 0.3 });
  T.salin.forEach((t, k) => L.push({ t, jenis: "salin", pan: 0.15 + 0.15 * k, vel: vel() }));
  // 3. Aturan sudah ada
  T.buku.forEach((t, k) => L.push({ t, jenis: "dentum-buku", berat: k >= 3 ? 1 : 0.6, pan: 0.35, vel: vel() }));
  L.push({ t: T.garisPatah, jenis: "patah", pan: 0.1 });
  // 4. Arti bukti
  L.push({ t: T.lembarMuncul[0], jenis: "lembar-muncul", pan: 0 });
  T.labelOrbit.forEach((t, k) => L.push({ t, jenis: "tik-orbit", k, pan: [-0.45, 0.45, -0.3, 0.3][k], vel: vel() }));
  // 5. Identitas dokumen
  T.dokKeluar.forEach((t, k) => L.push({ t, jenis: "dokumen-keluar", pan: [-0.3, 0.3, -0.2][k], vel: vel() }));
  L.push({ t: T.stempel, jenis: "stempel", pan: 0.3 });
  T.tagKlik.forEach((t, k) => L.push({ t, jenis: "klik-emas", k, pan: [-0.2, 0.45, -0.05][k] }));
  L.push({ t: T.garisSambung[0], jenis: "sambung", dur: T.garisSambung[1] - T.garisSambung[0], pan: 0 });
  L.push({ t: T.lipat[0], jenis: "lipat-titik", pan: 0 });
  // 6. Memori berjenjang
  L.push({ t: T.aliranNaik[0], jenis: "kilau-naik", dur: T.aliranNaik[1] - T.aliranNaik[0] });
  T.tingkat.slice(1, 3).forEach((t, k) => L.push({ t, jenis: "tiba-tingkat", k, pan: 0 }));
  L.push({ t: T.tingkat[3], jenis: "puncak-pb", pan: 0 });
  L.push({ t: T.aliranTurun[0], jenis: "kilau-turun", dur: T.aliranTurun[1] - T.aliranTurun[0] });
  // 7. Ekosistem
  T.stasiun.forEach((t, k) => L.push({ t, jenis: "stasiun", k, pan: [-0.45, 0.45, 0][k] }));
  L.push({ t: T.putar, jenis: "putar-ekosistem", dur: 1.7 });
  // 8. Rambu aturan main
  L.push({ t: T.perisai, jenis: "dengung-perisai", dur: 3.0 });
  T.angkaNaik.forEach((t, k) => L.push({ t, jenis: "angka-naik", k, pan: [-0.5, -0.25, 0, 0.25, 0.5][k] }));
  // 9. Penutup
  L.push({ t: T.setahun - 0.35, jenis: "desir-pindah", dur: 1.2 });
  L.push({ t: T.cahayaTertata, jenis: "cahaya-tertata", pan: 0 });
  L.push({ t: T.denyutGrid[0], jenis: "desir-mundur", dur: T.penutup - 0.25 - T.denyutGrid[0] }); // reda sebelum akor penutup
  L.push({ t: T.penutup, jenis: "akor-penutup" });
  L.push({ t: T.ajakan[0] + 0.1, jenis: "kilau-ajakan", pan: 0 });
  return L.sort((a, b) => a.t - b.t);
}

// Peristiwa gambar yang dipakai untuk memeriksa sinkron suara (dalam t).
export function peristiwaPeriksa() {
  return [
    { nama: "salinan pertama", t: T.salin[0], pita: "lebar" },
    { nama: "buku pertama", t: T.buku[0], pita: "rendah" },
    { nama: "garis patah", t: T.garisPatah, pita: "tinggi" },
    { nama: "klik label emas 1", t: T.tagKlik[0], pita: "tinggi" },
    { nama: "stempel SK", t: T.stempel, pita: "rendah" },
    { nama: "puncak PB menyala", t: T.tingkat[3], pita: "rendah" },
    { nama: "akor penutup", t: T.penutup, pita: "rendah" },
  ];
}
