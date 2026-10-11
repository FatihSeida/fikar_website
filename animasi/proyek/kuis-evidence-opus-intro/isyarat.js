// Satu sumber waktu untuk gambar (adegan.js) dan suara (suara.mjs).
// Tanpa dependensi: berjalan di browser (Vite) maupun di Node.
//
// t = waktu video (0–38 detik). Linimasa "cara mengisi" yang lama memakai u = t − INTRO.

export const INTRO = 8;
export const DURASI_LAMA = 30;
export const DURASI_TOTAL = INTRO + DURASI_LAMA;

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
const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

// ---------------------------------------------------------------- data kuis (contoh)
export const KELOMPOK = [
  { nama: "Kaderisasi", skor: [2, 2, 2, 2, 1] },
  { nama: "Tata Kelola", skor: [2, 2, 2, 2] },
  { nama: "Pengetahuan", skor: [2, 1, 2] },
  { nama: "Target Program", skor: [3, 2, 2] },
  { nama: "Evaluasi dan Arsip", skor: [2, 2, 2] },
  { nama: "Data dan Jaringan", skor: [2, 1] },
];

// ---------------------------------------------------------------- tata letak dasar (dipakai juga untuk posisi komisariatmu)
export const TATA = { S: 1.3, SUDUT: 1.45, AWAL_PETAK: 2.2 };

// ---------------------------------------------------------------- linimasa lama (dalam u)
export const KETERANGAN = [[0, 3], [3, 7], [7, 17], [17, 21], [21, 24], [24, 28], [28, 31]];
export const T_JALUR = [0.35, 2.55];   // percik menyalakan jalur
export const T_GERBANG = [3.2, 3.8];   // gerbang /kuis menyala
export const T_KETIK = [3.7, 4.45];    // alamat diketik di kartu browser
export const URL_KUIS = "ahmadzulfikar.com/kuis";
export const T_KLIK = 4.95;            // "Mulai kuis" ditekan
export const T_MUNCUL = 5.2;           // kubus emas muncul di gerbang
export const T_JAWAB = 7.0;            // lompatan pertama ke petak 1
export const JEDA_JAWAB = 0.5;         // satu pertanyaan tiap 0,5 detik
export const LAMA_LOMPAT = 0.34;
export const T_LK = [[17.45, 17.7], [19.05, 19.3]]; // [lepas dari J, tiba di simpul pertama] tiap cabang
export const JEDA_LK = 0.3;
export const T_PILAR = [21.85, 22.1, 22.35, 22.6];
export const LAMA_PILAR = 0.55;
export const T_MENARA = [24.55, 27.0]; // menara naik, lalu berhenti di "Mulai Membaca Bukti"
export const T_PUNCAK = 27.25;         // lompatan kecil di puncak menara
export const T_AJAKAN = [28.3, 28.8];  // tombol alamat muncul

// Jadwal lompatan kubus. Tujuan dinamai; posisinya ditentukan adegan.js.
export const LOMPATAN = [];
{
  let i = 0;
  KELOMPOK.forEach((k, g) => k.skor.forEach((skor) => {
    LOMPATAN.push({ t0: T_JAWAB + JEDA_JAWAB * i, dur: LAMA_LOMPAT, dari: i === 0 ? "gerbang" : `p${i - 1}`, ke: `p${i}`, soal: i, g, skor });
    i++;
  }));
  LOMPATAN.push(
    { t0: 17.0, dur: 0.38, dari: "p19", ke: "J" },
    { t0: 20.66, dur: 0.27, dari: "J", ke: "B1" },
    { t0: 20.94, dur: 0.27, dari: "B1", ke: "B2" },
    { t0: 21.22, dur: 0.27, dari: "B2", ke: "B4" },
    { t0: 21.5, dur: 0.3, dari: "B4", ke: "Q" },
    { t0: 23.6, dur: 0.3, dari: "Q", ke: "B3" },
    { t0: 23.92, dur: 0.34, dari: "B3", ke: "T" },
    { t0: T_PUNCAK, dur: 0.36, dari: "T", ke: "T", tinggi: 0.55 },
  );
}

// ---------------------------------------------------------------- pembuka "kenapa" (dalam t)
export const F_EMAS = { x: TATA.AWAL_PETAK + TATA.S * 3, z: 0 }; // = posisi petak ke-4 (pusat bidikan pembuka lama)
export const ARAH_PINDAI = (() => { const p = Math.hypot(0.2, 0.98); return { x: 0.2 / p, z: 0.98 / p }; })();
export const PINDAI = [-25, 23];       // posisi tirai pindai dari jauh ke dekat
export const T_PINDAI = [0, 3.4];
export const T_EMAS_MASUK = 6.95;      // kubus emas masuk ke tanah, gelombang cincin
export const T_TURUN = [6.2, 8.0];     // kamera turun ke bidikan pembuka lama
export const T_TUMBUH = [7.3, 7.95];   // papan kuis tumbuh dari tanah
export const T_TENGGELAM = (d) => 6.95 + 0.3 * klem(d / 14);
export const waktuPindai = (q) => T_PINDAI[0] + ((q - PINDAI[0]) / (PINDAI[1] - PINDAI[0])) * (T_PINDAI[1] - T_PINDAI[0]);

// Ladang komisariat: kondisi 2 baik, 1 sedang, 0 lemah. tBaik = saat diperbaiki.
export const gedung = [];
{
  const r = acak(42);
  const JARAK = 2.35, JARI = 21;
  for (let i = -10; i <= 10; i++) for (let j = -10; j <= 10; j++) {
    const x = F_EMAS.x + i * JARAK + (r() - 0.5) * 0.95;
    const z = F_EMAS.z + j * JARAK + (r() - 0.5) * 0.95;
    const kon = r(), tinggi = 0.55 + r() * 0.8, urut = r(), lebar = 0.82 + r() * 0.3;
    const d = Math.hypot(x - F_EMAS.x, z - F_EMAS.z);
    if (d > JARI || d < 1.9) continue;
    const kondisi = kon < 0.36 ? 2 : kon < 0.64 ? 1 : 0;
    const q = (x - F_EMAS.x) * ARAH_PINDAI.x + (z - F_EMAS.z) * ARAH_PINDAI.z;      // arah pindai (turun di layar)
    const lintang = (x - F_EMAS.x) * ARAH_PINDAI.z - (z - F_EMAS.z) * ARAH_PINDAI.x; // kira-kira posisi x di layar
    gedung.push({ x, z, d, q, lintang, kondisi, tinggi, lebar, tBaik: 4.3 + 1.95 * (0.65 * urut + 0.35 * d / JARI), tTenggelam: T_TENGGELAM(d) });
  }
}

// ---------------------------------------------------------------- daftar isyarat suara (dalam t)
// pan: −1 kiri … 1 kanan, kira-kira mengikuti posisi x di layar. vel: variasi kecil supaya pengulangan tidak kaku.
export function daftarIsyarat() {
  const r = acak(9);
  const vel = () => 0.88 + 0.24 * r();
  const L = [];
  const tampak = (g) => Math.abs(g.lintang) < 10 && g.q > -11 && g.q < 12;
  const jarangkan = (daftar, jeda, maks) => {
    const hasil = [];
    for (const x of daftar) if (!hasil.length || x.t - hasil[hasil.length - 1].t >= jeda) hasil.push(x);
    return hasil.slice(0, maks);
  };

  // Pembuka.
  L.push({ t: 0, jenis: "desir-buka", dur: 1.6 });
  L.push({ t: T_PINDAI[0], jenis: "sapu-pindai", dur: T_PINDAI[1] - T_PINDAI[0] + 0.25 });
  const terang = gedung.filter((g) => g.kondisi === 2 && tampak(g)).map((g) => ({ t: waktuPindai(g.q) + 0.04, g })).sort((a, b) => a.t - b.t);
  jarangkan(terang, 0.2, 12).forEach((x, k) => L.push({ t: x.t, jenis: "denting", nada: [7, 9, 8, 10, 7, 9, 11, 8, 10, 9, 12, 10][k % 12], pan: klem(x.g.lintang / 11, -0.7, 0.7), vel: vel() * 0.9 }));
  const baik = gedung.filter((g) => g.kondisi < 2 && tampak(g)).map((g) => ({ t: g.tBaik, g })).sort((a, b) => a.t - b.t);
  const plink = jarangkan(baik, 0.085, 24);
  plink.forEach((x, k) => L.push({ t: x.t, jenis: "plink-baik", nada: 7 + Math.floor((k / plink.length) * 8), pan: klem(x.g.lintang / 11, -0.7, 0.7), vel: vel() }));
  L.push({ t: T_EMAS_MASUK, jenis: "dentum-emas" });
  L.push({ t: T_TURUN[0], jenis: "desir-turun", dur: T_TURUN[1] - T_TURUN[0] });

  // Linimasa lama, digeser INTRO.
  const U = (u) => INTRO + u;
  L.push({ t: U(T_JALUR[0]), jenis: "desis-jalur", dur: T_JALUR[1] - T_JALUR[0] });
  L.push({ t: U(T_GERBANG[0]), jenis: "dengung-gerbang", pan: 0.28 });
  for (let k = 1; k <= URL_KUIS.length; k++) {
    L.push({ t: U(T_KETIK[0] + ((T_KETIK[1] - T_KETIK[0]) * (k - 0.5)) / URL_KUIS.length), jenis: "ketik", pan: -0.45, vel: vel() });
  }
  L.push({ t: U(T_KLIK), jenis: "klik", pan: -0.4 });
  L.push({ t: U(T_MUNCUL), jenis: "kilau-muncul", pan: 0.28 });
  LOMPATAN.forEach((l) => {
    const tiba = U(l.t0 + l.dur);
    if (l.soal !== undefined) {
      const arahKanan = l.g % 2 === 0; // kelompok genap bergerak ke kanan di layar
      L.push({ t: tiba, jenis: "letup", pan: arahKanan ? 0.1 : -0.1, vel: vel() });
      L.push({ t: tiba + 0.03, jenis: "tik-skor", skor: l.skor, pan: arahKanan ? 0.12 : -0.12, vel: vel() });
      const k = KELOMPOK[l.g];
      const akhirKelompok = KELOMPOK.slice(0, l.g + 1).reduce((s, x) => s + x.skor.length, 0) - 1;
      if (l.soal === akhirKelompok && k) L.push({ t: tiba + 0.14, jenis: "lonceng-kelompok", g: l.g, pan: 0 });
    } else {
      L.push({ t: tiba, jenis: "letup", pan: 0, vel: vel() * 0.6 });
    }
  });
  T_LK.forEach(([, tTiba], c) => {
    for (let k = 0; k < 5; k++) L.push({ t: U(tTiba + JEDA_LK * k), jenis: "plink-kaca", nada: 10 + c + k, pan: (c === 0 ? -1 : 1) * (0.15 + 0.08 * k), vel: vel() });
  });
  T_PILAR.forEach((tp, i) => L.push({ t: U(tp), jenis: "naik-pilar", i, pan: [-0.45, -0.17, 0.17, 0.45][i], vel: vel() }));
  L.push({ t: U(T_MENARA[0]), jenis: "sapu-menara", dur: T_MENARA[1] - T_MENARA[0], pan: -0.3 });
  L.push({ t: U(T_MENARA[1]), jenis: "lonceng-menara", pan: -0.3 });
  L.push({ t: U(KETERANGAN[6][0]), jenis: "dentum-penutup" });
  L.push({ t: U(T_AJAKAN[0] + 0.15), jenis: "kilau-ajakan", pan: 0.05 });
  return L.sort((a, b) => a.t - b.t);
}

// Peristiwa gambar yang dipakai untuk memeriksa sinkron suara (dalam t).
export function peristiwaPeriksa() {
  const tiba = (i) => INTRO + LOMPATAN[i].t0 + LOMPATAN[i].dur;
  return [
    { nama: "klik Mulai kuis", t: INTRO + T_KLIK, pita: "tinggi" },
    { nama: "mendarat soal 1", t: tiba(0), pita: "lebar" },
    { nama: "mendarat soal 10", t: tiba(9), pita: "lebar" },
    { nama: "mendarat soal 20", t: tiba(19), pita: "lebar" },
    { nama: "menara berhenti", t: INTRO + T_MENARA[1], pita: "tinggi" },
    { nama: "dentum penutup", t: INTRO + KETERANGAN[6][0], pita: "rendah" },
  ];
}
