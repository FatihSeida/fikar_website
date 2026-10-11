// Satu sumber waktu untuk gambar (adegan.js) dan suara (suara.mjs). Tanpa dependensi.
// Indikator 02 / 44: "Jarak HMI dengan kehidupan mahasiswa semakin lebar." t dalam detik.

export const DURASI = 21;

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

// ---------------------------------------------------------------- peristiwa gambar
export const T = {
  grid: [0, 0.6],                 // radius pudar grid 0 → 20
  blokMuncul: 0.6,                // kedua blok muncul bersamaan (0,5 detik)
  bendaMuncul: [0.66, 0.78, 0.9, 1.02, 1.1], // gerbang, kelas, komisariat, figur kelas, figur komisariat
  jalanMulai: 1.6,                // figur di blok kiri mulai berkeliling
  geser: [1.6, 5.6],              // celah melebar 0,4 → 3,0
  debu: [1.7, 5.5],               // debu jatuh dari tepi celah
  jalanBerhenti: [6.0, 6.6],      // gerak melambat dan berhenti
  denyut: [7.0, 11.8],            // denyut cermin, periode 1,2 detik
  periodeDenyut: 1.2,
  lempar: [12.4, 12.8, 13.2, 13.6, 14.0], // lima kertas survei dilempar
  terbang: 0.45,                  // lama terbang tiap kertas
  ubah: 0.15,                     // kertas berubah menjadi papan
  klik: [14.94, 14.905, 14.87, 14.835, 14.8], // klik emas papan 0 (tepi kanan) … 4 (tepi kiri): riak cepat kiri → kanan
  pulih: [15.2, 15.6],            // komisariat kembali zamrudRedup
  seberang: [15.8, 17.6],         // dua figur menyeberang
  seberangNaik: 0.25,             // mulai melangkah (detik)
  seberangTurun: 0.3,             // berhenti melangkah (detik)
  kepala: [0.6, 1.2, 17.6, 18.0], // masuk, keluar
  penutup: [18.2, 18.8],
  ajakan: [18.6, 19.2],
  sumber: [19.0, 19.6],
};

// Ayunan langkah figur berjalan: badan naik turun pada 4 Hz; kaki menapak saat badan di titik terendah.
export const LANGKAH_HZ = 4;
// Laju relatif dua figur yang menyeberang (profil trapesium, sama dengan gerak di adegan.js).
export function lajuSeberang(t) {
  const [a, b] = T.seberang, s = t - a, D = b - a;
  if (s <= 0 || s >= D) return 0;
  if (s < T.seberangNaik) return s / T.seberangNaik;
  if (s < D - T.seberangTurun) return 1;
  return (D - s) / T.seberangTurun;
}
// Saat kaki menapak: figur ke-a punya fasa a·π, titik terendah di 2π·4t + aπ = 2πk.
export function waktuLangkah() {
  const L = [];
  for (const a of [0, 1]) {
    for (let k = Math.ceil(T.seberang[0] * LANGKAH_HZ); k / LANGKAH_HZ - a / (2 * LANGKAH_HZ) <= T.seberang[1]; k++) {
      const t = k / LANGKAH_HZ - a / (2 * LANGKAH_HZ);
      const laju = lajuSeberang(t);
      if (laju >= 0.25) L.push({ t, anggota: a, laju });
    }
  }
  return L.sort((p, q) => p.t - q.t);
}
// Butir debu yang jatuh dari tepi celah (acak berbenih). sisi -1: tepi blok kiri, +1: tepi blok kanan.
export function daftarDebu() {
  const r = acak(202);
  const [a, b] = T.debu;
  const L = [];
  for (let i = 0; i < 72; i++) {
    L.push({ sisi: i % 2 === 0 ? -1 : 1, dz: (r() - 0.5) * 5.6, t0: a + r() * (b - a), umur: 0.8 + r() * 0.3, geserZ: (r() - 0.5) * 0.3, jauh: 0.25 + r() * 0.25 });
  }
  return L;
}

// Keterangan bawah: [masuk, keluar-mulai, keluar-selesai].
export const KETERANGAN = [
  [1.2, 5.4, 5.8],   // GEJALA
  [6.6, 11.6, 12.0], // CERMIN
  [13.6, 17.6, 18.0], // LANGKAH
];

// Kamera: [mulai, selesai, tinggi frustum tujuan, fokus tujuan ("asal" | "celah" | "akhir")].
export const KAMERA = [
  [0.0, 1.2, 16, "asal"],
  [6.0, 7.0, 12, "celah"],
  [12.0, 13.0, 16, "asal"],
  [18.0, 19.5, 21, "akhir"],
];
export const TINGGI_AWAL = 19;
