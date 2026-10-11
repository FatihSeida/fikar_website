// Satu sumber waktu dan tata letak untuk gambar (adegan.js) dan suara (suara.mjs).
// Tanpa dependensi: berjalan di browser (Vite) maupun di Node.
//
// Video 1 seri tulisan: "Ikhtiar HMI Evidence", 58 detik, sembilan adegan (lihat
// docs/superpowers/specs/2026-10-10-animasi-seri-tulisan-design.md).

export const DURASI = 58;
export const ADEGAN = [[0, 6], [6, 12], [12, 20], [20, 27], [27, 33], [33, 39], [39, 45], [45, 51], [51, 58]];

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
export const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const rentang = (t, a, b) => klem((t - a) / (b - a));
export const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };

// ---------------------------------------------------------------- tata letak (koordinat layar-tanah)
// Kamera isometrik melihat dari (+x, +y, +z). u = ke kanan di layar, v = turun di layar.
export const R2 = Math.SQRT1_2;
export const dariUV = (u, v) => ({ x: (u + v) * R2, z: (v - u) * R2 });
export const keUV = (x, z) => ({ u: (x - z) * R2, v: (x + z) * R2 });

export const TATA = {
  ASAL: { u: 0, v: 0 },          // titik asal = ruang kuliah 1947
  KITAB: { u: -0.6, v: 15.5 },   // kitab pembuka
  FONDASI: { u: 5.9, v: 3.4 },   // cetak biru dan lima lempeng
  JALAN: [3.3, 24.8],            // jalan garis waktu (u = 0), dari depan ruang kuliah
  GERBANG_LK: 14.4,              // v pintu LK di jalan
  PIRAMIDA: { u: -2.2, v: 16.75 },
  FORUM: { u: 2.3, v: 16.5 },
  CABANG: { u: 2.4, v: 21.5 },
  MENARA: { u: -3.3, v: 23.1 },
};

// ---------------------------------------------------------------- adegan 1: kitab dan rantai cahaya
export const T_KITAB = [0.1, 1.55];   // kitab naik dari grid
export const T_HALAMAN = [1.5, 2.25]; // satu halaman dibalik
export const T_RANTAI = [2.35, 5.0];  // untaian titik cahaya berjalan mundur ke titik asal
export const N_TITIK = 25;            // titik cahaya sepanjang rantai
export const T_ASAL = 5.0;            // titik asal menyala emas
export const waktuTitik = (i) => T_RANTAI[0] + (i / (N_TITIK - 1)) * (T_RANTAI[1] - T_RANTAI[0]);

// ---------------------------------------------------------------- adegan 2: satu nada
export const JAKET = [
  "hsl(205, 30%, 40%)", "hsl(352, 30%, 38%)", "hsl(24, 36%, 40%)", "hsl(165, 30%, 33%)", "hsl(222, 26%, 32%)",
  "hsl(78, 22%, 36%)", "hsl(285, 14%, 38%)", "hsl(188, 30%, 40%)", "hsl(12, 38%, 44%)", "hsl(210, 16%, 54%)",
  "hsl(140, 18%, 28%)", "hsl(30, 18%, 30%)",
];
export const FIGUR_NADA = [];
{
  const r = acak(1947);
  let coba = 0;
  while (FIGUR_NADA.length < 38 && coba++ < 5000) {
    const u = (r() * 2 - 1) * 5.5;
    const v = -8.6 + r() * 18.4;
    const d = Math.hypot(u, v * 0.62);
    if (d < 3.7) continue;
    if (FIGUR_NADA.some((f) => Math.hypot(f.u - u, f.v - v) < 1.45)) continue;
    FIGUR_NADA.push({ u, v, arah: r() * Math.PI * 2, jaket: Math.floor(r() * JAKET.length), skala: 0.92 + 0.16 * r(), urut: r() });
  }
  FIGUR_NADA.sort((a, b) => a.urut - b.urut);
  FIGUR_NADA.forEach((f, i) => {
    f.tMuncul = 5.55 + 0.9 * (i / FIGUR_NADA.length);
    f.tPutar = 6.75 + 2.75 * (i / (FIGUR_NADA.length - 1));
  });
}
export const LAMA_PUTAR = 0.42;
export const T_SATU_NADA = 10.05; // semua garis berdenyut bersama

// ---------------------------------------------------------------- adegan 3 dan 4: ruang kuliah 1947, tanggal lahir
export const T_RUANG = [12.35, 13.9];
export const T_PENDIRI = 13.65;
export const T_NYALA = Array.from({ length: 14 }, (_, k) => 14.45 + 0.29 * k);
export const T_UBIN = [20.35, 21.05];
export const T_BALIK = [22.6, 23.4];
export const T_MUNDUR = [24.0, 25.5];
export const LANGKAH_MUNDUR = [24.25, 24.75, 25.25];

// ---------------------------------------------------------------- adegan 5: estafet
export const N_ESTAFET = 7;
export const STASIUN = Array.from({ length: N_ESTAFET }, (_, k) => 4.1 + 1.38 * k); // v tiap pembawa
export const T_SERAH = Array.from({ length: N_ESTAFET }, (_, k) => 27.6 + 0.72 * k); // titik emas diterima
export const T_LEPAS_KOLAM = 27.15; // titik emas naik dari sorotan ruang kuliah
export const LAMA_JALAN = 0.5, MAJU = 0.86;
export const LAMA_JALAN_AKHIR = 0.85, MAJU_AKHIR = 1.3; // pembawa terakhir berjalan sedikit lebih jauh
// v titik emas pada detik t (dipegang pembawa, lalu melompat ke pembawa berikutnya).
export function vTitik(t) {
  if (t < T_SERAH[0]) return 2.2 + (STASIUN[0] - 2.2) * klem((t - T_LEPAS_KOLAM) / (T_SERAH[0] - T_LEPAS_KOLAM));
  for (let k = 0; k < N_ESTAFET; k++) {
    const t0 = T_SERAH[k];
    const t1 = k + 1 < N_ESTAFET ? T_SERAH[k + 1] : Infinity;
    if (t < t1) {
      if (k + 1 >= N_ESTAFET) return STASIUN[k] + MAJU_AKHIR * klem((t - t0) / LAMA_JALAN_AKHIR);
      if (t < t0 + LAMA_JALAN) return STASIUN[k] + MAJU * klem((t - t0) / LAMA_JALAN);
      return STASIUN[k] + MAJU + (STASIUN[k + 1] - STASIUN[k] - MAJU) * klem((t - t0 - LAMA_JALAN) / (t1 - t0 - LAMA_JALAN));
    }
  }
  return STASIUN[N_ESTAFET - 1];
}
// Rumah komisariat di kiri-kanan jalan. kusam: berubah kusam pada adegan 6.
export const RUMAH = [];
{
  const r = acak(23);
  const baris = [[-2.15, 0], [2.15, 0.62], [-3.95, 0.4], [3.95, 1.0]];
  for (let v = 4.7; v <= 19.6; v += 1.55) {
    for (const [u, geser] of baris) {
      const vv = v + geser + (r() - 0.5) * 0.3;
      if (vv > 19.6) continue;
      if (vv > 15.2 && vv < 18.3) continue;                    // ruang untuk piramida dan meja forum
      if (Math.abs(u) < 3 && vv > 13.3 && vv < 15.2) continue;  // ruang di sekitar pintu LK
      RUMAH.push({ u: u + (r() - 0.5) * 0.3, v: vv, lebar: 0.95 + r() * 0.2, tinggi: 0.7 + r() * 0.24, acak: r() });
    }
  }
  RUMAH.forEach((h) => {
    h.tTumbuh = h.v < 12.9 ? waktuLewat(h.v - 0.5) : 32.15 + 0.12 * (h.v - 12.9) + 0.12 * h.acak;
  });
  // Beberapa rumah berubah kusam di adegan 6.
  const kandidat = RUMAH.map((h, i) => ({ i, h })).filter(({ h }) => h.v > 6.5);
  kandidat.forEach(({ h }, k) => { if (h.acak < 0.5 || k % 4 === 1) h.tKusam = 33.45 + 1.9 * h.acak; });
}
function waktuLewat(v) { // detik pertama titik emas mencapai v
  for (let t = T_LEPAS_KOLAM; t < 33; t += 0.01) if (vTitik(t) >= v) return t;
  return 32.5;
}

// ---------------------------------------------------------------- adegan 6: distorsi
export const T_MASUK_PINTU = 33.15; // titik emas masuk ke pintu LK
export const T_GERBANG_UBAH = [33.35, 34.15];
export const T_CAP = Array.from({ length: 5 }, (_, j) => 34.6 + 0.92 * j);
export const T_TEKAN = [35.1, 36.5, 37.9];
export const T_KURSI = [[35.3, 36.05], [37.05, 37.8]];
export const T_KUSAM_SUARA = [33.55, 34.95];

// ---------------------------------------------------------------- adegan 7 dan 8: rutinisasi karisma, ujian lima lapis
export const LAPIS = ["NDP", "Mission", "Sejarah", "Praktik", "Konstitusi"];
export const T_LARUT = [39.65, 40.8];
export const T_LEMPENG = LAPIS.map((_, k) => 41.35 + 0.62 * k); // saat lempeng ke-k mendarat
export const T_RANGKA = [44.0, 44.8]; // rangka bangunan berdiri di atas fondasi
export const LAMA_JATUH = 0.42;
export const T_KARTU = [[45.1, 45.8], [45.35, 46.05]];
export const T_CEK = LAPIS.map((_, k) => 46.35 + 0.48 * k);
export const T_LOLOS = 48.75;
export const T_PUDAR = [48.75, 49.7];

// ---------------------------------------------------------------- adegan 9: penutup
export const T_MENARA = [50.55, 51.45];
export const T_KEPUTUSAN = 51.75;
export const T_GARIS = [52.2, 52.95, 53.85, 54.85, 55.85]; // menara → cabang → komisariat → fondasi → ruang kuliah

// ---------------------------------------------------------------- daftar isyarat suara
// pan: −1 kiri … 1 kanan, kira-kira mengikuti posisi x di layar. vel: variasi kecil.
export function daftarIsyarat() {
  const r = acak(9);
  const vel = () => 0.88 + 0.24 * r();
  const pan = (u, lebar = 7) => klem(u / lebar, -0.7, 0.7);
  const L = [];
  const jarangkan = (daftar, jeda, maks = 99) => {
    const hasil = [];
    for (const x of daftar) if (!hasil.length || x.t - hasil[hasil.length - 1].t >= jeda) hasil.push(x);
    return hasil.slice(0, maks);
  };

  // 1. Kitab dan rantai.
  L.push({ t: T_KITAB[0], jenis: "naik-kitab", dur: T_KITAB[1] - T_KITAB[0] + 0.3 });
  L.push({ t: T_HALAMAN[0], jenis: "halaman", dur: T_HALAMAN[1] - T_HALAMAN[0] });
  for (let i = 0; i <= 20; i += 4) L.push({ t: waktuTitik(i), jenis: "denting-rantai", nada: 5 + i / 4, pan: 0.05, vel: vel() * (0.75 + 0.25 * (i / N_TITIK)) });
  L.push({ t: T_ASAL, jenis: "lonceng-asal", pan: 0 });

  // 2. Satu nada.
  const putar = FIGUR_NADA.map((f) => ({ t: f.tPutar, f })).sort((a, b) => a.t - b.t);
  jarangkan(putar, 0.2, 14).forEach((x) => L.push({ t: x.t + 0.05, jenis: "ketuk", pan: pan(x.f.u), vel: vel() * 0.8 }));
  L.push({ t: T_SATU_NADA, jenis: "satu-nada", dur: 12.2 - T_SATU_NADA });

  // 3. Ruang kuliah.
  [12.55, 13.0, 13.45].forEach((t, k) => L.push({ t, jenis: "kayu", nada: k, pan: [-0.25, 0.25, 0][k], vel: vel() }));
  L.push({ t: T_PENDIRI, jenis: "kilau-pendiri", pan: -0.15 });
  T_NYALA.forEach((t, k) => L.push({ t, jenis: "nyala", nada: [0, 2, 4, 5, 7, 9, 7, 5, 9, 10, 12, 11, 9, 12][k], pan: ((k % 5) - 2) * 0.12, vel: vel() }));

  // 4. Tanggal lahir.
  L.push({ t: T_UBIN[0] + 0.35, jenis: "ubin", pan: -0.2, vel: vel() });
  L.push({ t: T_UBIN[0] + 0.55, jenis: "ubin", pan: 0.2, vel: vel() });
  L.push({ t: T_BALIK[0], jenis: "balik", dur: T_BALIK[1] - T_BALIK[0], pan: -0.25 });
  LANGKAH_MUNDUR.forEach((t) => L.push({ t, jenis: "langkah", pan: -0.15, vel: vel() * 0.9 }));

  // 5. Estafet.
  L.push({ t: T_LEPAS_KOLAM, jenis: "kilau-kecil", pan: 0 });
  T_SERAH.forEach((t, k) => {
    L.push({ t, jenis: "serah", nada: 7 + (k % 4), pan: 0, vel: vel() });
    L.push({ t: t + 0.14, jenis: "langkah", pan: -0.05, vel: vel() * 0.6 });
    L.push({ t: t + 0.38, jenis: "langkah", pan: 0.05, vel: vel() * 0.6 });
  });
  L.push({ t: T_MASUK_PINTU, jenis: "serah", nada: 6, pan: 0, vel: 0.8 });
  const tumbuh = RUMAH.filter((h) => h.v < 12.9).map((h) => ({ t: h.tTumbuh, h })).sort((a, b) => a.t - b.t);
  jarangkan(tumbuh, 0.28, 12).forEach((x) => L.push({ t: x.t, jenis: "rumah", pan: pan(x.h.u, 6), vel: vel() * 0.85 }));

  // 6. Distorsi.
  L.push({ t: T_GERBANG_UBAH[0], jenis: "gerbang-ubah", dur: T_GERBANG_UBAH[1] - T_GERBANG_UBAH[0] });
  T_KUSAM_SUARA.forEach((t, k) => L.push({ t, jenis: "kusam", pan: [-0.35, 0.35, -0.1][k], vel: vel() }));
  T_CAP.forEach((t) => L.push({ t, jenis: "cap", pan: 0, vel: vel() }));
  T_TEKAN.forEach((t) => L.push({ t, jenis: "tekan", pan: -0.4, vel: vel() }));
  T_KURSI.forEach(([a, b]) => L.push({ t: a, jenis: "geser-kursi", dur: b - a, pan: 0.4 }));

  // 7. Rutinisasi karisma.
  L.push({ t: T_LARUT[0], jenis: "larut", dur: T_LARUT[1] - T_LARUT[0] });
  L.push({ t: T_RANGKA[0], jenis: "rangka", dur: T_RANGKA[1] - T_RANGKA[0] });
  T_LEMPENG.forEach((t, k) => L.push({ t, jenis: "lempeng", k, pan: 0.1, vel: vel() }));

  // 8. Ujian lima lapis.
  T_KARTU.forEach(([a, b], k) => L.push({ t: a, jenis: "geser-kartu", dur: b - a, pan: k ? 0.3 : -0.1 }));
  T_CEK.forEach((t, k) => L.push({ t, jenis: "cek", k, pan: 0.05 }));
  L.push({ t: T_LOLOS, jenis: "lolos", pan: -0.1 });
  L.push({ t: T_PUDAR[0] + 0.05, jenis: "pudar", dur: T_PUDAR[1] - T_PUDAR[0], pan: 0.3 });

  // 9. Penutup.
  L.push({ t: T_MENARA[0], jenis: "menara", dur: T_MENARA[1] - T_MENARA[0] });
  L.push({ t: T_KEPUTUSAN, jenis: "lonceng-keputusan", pan: -0.1 });
  L.push({ t: T_GARIS[0], jenis: "sapu-garis", dur: T_GARIS[4] - T_GARIS[0] });
  [1, 2, 3].forEach((k) => L.push({ t: T_GARIS[k], jenis: "titik-jalan", nada: [9, 10, 12][k - 1], pan: 0 }));
  L.push({ t: T_GARIS[4], jenis: "akor-penutup" });
  return L.sort((a, b) => a.t - b.t);
}

// Peristiwa gambar yang dipakai untuk memeriksa sinkron suara (dalam t).
export function peristiwaPeriksa() {
  return [
    { nama: "titik asal menyala", t: T_ASAL, pita: "lebar" },
    { nama: "pendiri 1 menyala", t: T_NYALA[0], pita: "lebar" },
    { nama: "ubin selesai berbalik", t: T_BALIK[1], pita: "rendah" },
    { nama: "serah titik emas 1", t: T_SERAH[0], pita: "tinggi" },
    { nama: "cap stempel 1", t: T_CAP[0], pita: "rendah" },
    { nama: "lempeng NDP mendarat", t: T_LEMPENG[0], pita: "rendah" },
    { nama: "cek lapis 3", t: T_CEK[2], pita: "lebar" },
    { nama: "garis tiba di 1947", t: T_GARIS[4], pita: "rendah" },
  ];
}
