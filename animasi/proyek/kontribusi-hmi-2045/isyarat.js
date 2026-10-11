// Satu sumber waktu untuk gambar (adegan.js) dan suara (suara.mjs).
// Tanpa dependensi: berjalan di browser (Vite) maupun di Node.
//
// Video 2: "Kontribusi HMI Menyongsong Indonesia Emas 2045: HMI, Indonesia dan Dunia" (60 detik).
// Perjalanan berlangsung "ke atas layar": sumbu b dunia (lihat adegan.js) menunjuk menjauh dari kamera.

export const DURASI = 60;
export const FPS = 30;

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
const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };

// ---------------------------------------------------------------- linimasa adegan (detik)
export const ADEGAN = [[0, 8], [8, 15], [15, 20], [20, 27], [27, 36], [36, 42], [42, 48], [48, 53], [53, 60]];

// 1. Pembuka: Yogyakarta
export const T_KULIAH = [0.45, 1.45];       // ruang kuliah tumbuh dari grid
export const T_KULIAH_NYALA = 1.55;         // jendelanya menyala emas
export const T_SIDANG = [2.35, 3.35];
export const T_SIDANG_NYALA = 3.45;
export const T_GARIS = [4.4, 5.7];          // garis tipis menghubungkan keduanya
export const T_TENGGELAM = [7.5, 8.15];     // kedua bangunan turun ke air saat air tiba
export const T_AIR = [7.35, 9.3];           // grid berubah menjadi air (sapuan dari tengah)
// 2. Dua karang
export const T_KARANG = [8.3, 8.7];         // tiap karang mulai naik
export const LAMA_KARANG = 1.15;
export const T_PERAHU_MASUK = [8.55, 10.7];
export const T_MULAI_DAYUNG = 8.8;
// 3. Retak di dalam
export const T_DERIT = 15.2;
export const T_RETAK = 15.75;
// 4. Karang hari ini
export const T_BELAH = 20.25;
export const T_MENARA = [20.65, 24.4];      // jendela menara cip naik dari air
// 5. Jalan HMI
export const T_NAIK = [27.0, 28.45];        // kamera naik ke jalan setapak
export const T_BARIS = [28.2, 30.0];        // figur berbaris (revolusi)
export const T_ANGIN = [29.9, 31.55];       // angin kencang (1960-an)
export const T_BUKU = 31.85;                // buku NDP menyala
export const T_CABANG = [33.0, 34.3];       // jalan bercabang dua (1980-an)
export const T_ALUMNI = [34.45, 35.65];     // bangunan alumni muncul
// 6. Modal yang bocor
export const T_LUAS = [35.9, 37.5];         // kamera melebar
export const T_TITIK = [36.35, 37.75];      // ratusan titik cabang menyala
export const T_TALI = 37.95;                // kelompok tarik tambang muncul
export const T_SENTAK = [38.75, 39.6, 40.45, 41.25];
export const T_BOCOR = [38.45, 41.9];
// 7. Dua gapura
export const T_GAPURA = [42.55, 43.05];     // gapura 2045 lalu 2047 berdiri
export const T_MUDA = [43.35, 47.2];        // figur muda berjalan dan tumbuh
// 8. Serempak
export const T_KEMBALI = [47.75, 48.75];    // kamera kembali ke perahu
export const T_EMAS_PERAHU = 48.35;         // perahu menyala emas saat serempak
// 9. Penutup
export const T_DUNIA = 55.0;                // bola dunia menyala (setelah horizon melebar)

// ---------------------------------------------------------------- tata letak bersama (koordinat a, b)
export const GAPURA_B = [40, 46];
export const B_AWAL_LARI = 17;

// ---------------------------------------------------------------- dayung
// Pendayung 0–3 di kiri (dari haluan ke buritan), 4–7 di kanan.
// Fasa dalam putaran: bilah masuk air tepat saat fasa melewati bilangan bulat (tangkapan),
// mendorong sampai 0,42 putaran, lalu diangkat dan dikembalikan.
export const N_DAYUNG = 8;
export const DORONG = 0.42;
const F_A = 1 / 1.5;
const T_SERENTAK = 47.5; // sejak ini (perahu tak tampak sebelumnya) semua fasa sama
const rd = acak(31);
const DAYUNG = Array.from({ length: N_DAYUNG }, () => ({ o: 0.035 * (rd() - 0.5), fB: F_A * (0.72 + 0.56 * rd()), geser: 0.25 + 0.5 * rd() }));
// Frekuensi bersama saat serempak: [t, Hz], linear di antaranya.
const KF_SERENTAK = [[T_SERENTAK, 1.0], [48.5, 1.0], [50.4, 1.6], [52.6, 1.6], [55.5, 0.85], [60.5, 0.85]];
function integralLinear(kf, t) {
  let s = 0;
  for (let i = 1; i < kf.length; i++) {
    const [t0, f0] = kf[i - 1], [t1, f1] = kf[i];
    if (t <= t0) break;
    const u = Math.min(t, t1) - t0;
    s += f0 * u + ((f1 - f0) * u * u) / (2 * (t1 - t0));
  }
  return s;
}
export function fasaDayung(t, i) {
  if (t >= T_SERENTAK) return integralLinear(KF_SERENTAK, t) + 0.25;
  const d = DAYUNG[i];
  if (t < T_RETAK) return d.o + F_A * t;
  return d.o + F_A * T_RETAK + d.fB * (t - T_RETAK) + d.geser * halus((t - T_RETAK) / 0.5);
}
// Arah dayungan: kanan berbalik arah setelah retak (perahu berputar), serempak lagi saat adegan 8.
export function arahDayung(t, i) {
  if (i < 4 || t >= T_SERENTAK) return 1;
  return 1 - 2 * halus((t - (T_RETAK + 0.05)) / 0.4);
}
// Kekuatan dayungan (0 = dayung diam di atas air).
export function kuatDayung(t) {
  if (t >= T_SERENTAK) return 1;
  return halus((t - T_MULAI_DAYUNG) / 0.6) * (1 - 0.3 * halus((t - 21) / 2));
}
export function bilahDiAir(p) { // p = bagian pecahan fasa; 1 = bilah di air
  p -= Math.floor(p);
  if (p < DORONG) return 1;
  if (p < DORONG + 0.1) return 1 - halus((p - DORONG) / 0.1);
  if (p < 0.9) return 0;
  return halus((p - 0.9) / 0.1);
}

// ---------------------------------------------------------------- lintasan perahu
// Mengembalikan posisi (a, b) dan psi: sudut haluan terhadap arah perjalanan (+b), positif = condong ke kiri layar.
export const PSI0 = 0.62;
const DT_TABEL = 0.002;
const putar = (() => { // sudut putar perahu saat awaknya berebut dayung
  const n = Math.ceil((27.5 - T_RETAK) / DT_TABEL) + 2;
  const a = new Float64Array(n);
  const OMEGA = 1.45; // rad/s
  for (let k = 1; k < n; k++) {
    const t = T_RETAK + k * DT_TABEL;
    const w = OMEGA * halus((t - 15.95) / 1.3) * (1 - 0.7 * halus((t - 20.3) / 1.6));
    a[k] = a[k - 1] + w * DT_TABEL;
  }
  return a;
})();
const lari = (() => { // jarak tempuh adegan 8–9, termasuk hentakan kecil tiap dayungan
  const n = Math.ceil((DURASI + 0.5 - T_SERENTAK) / DT_TABEL) + 2;
  const b = new Float64Array(n);
  b[0] = B_AWAL_LARI;
  for (let k = 1; k < n; k++) {
    const t = T_SERENTAK + k * DT_TABEL;
    let v;
    if (t < 48.5) v = 2.4;
    else if (t < 50.3) v = 2.4 + 5.6 * halus((t - 48.5) / 1.8);
    else if (t < 52.6) v = 8;
    else if (t < 56.6) v = 8 - 7.3 * halus((t - 52.6) / 4.0);
    else v = 0.7;
    const p = fasaDayung(t, 0);
    const hentak = 1 + 0.22 * bilahDiAir(p) * Math.sin(Math.PI * Math.min(1, (p - Math.floor(p)) / DORONG)) - 0.08;
    b[k] = b[k - 1] + v * hentak * DT_TABEL;
  }
  return b;
})();
function tabel(arr, t0, t) {
  const x = (t - t0) / DT_TABEL;
  const i = Math.max(0, Math.min(arr.length - 2, Math.floor(x)));
  const k = klem(x - i);
  return arr[i] + (arr[i + 1] - arr[i]) * k;
}
export function lintasPerahu(t) {
  if (t >= T_SERENTAK) return { a: 0, b: tabel(lari, T_SERENTAK, t), psi: 0, tampak: true };
  const [m0, m1] = T_PERAHU_MASUK;
  if (t < m1) { // meluncur masuk di antara karang, melambat
    const u = klem((t - m0) / (m1 - m0));
    const s = -9 * Math.pow(1 - u, 3);
    return { a: -Math.sin(PSI0) * s, b: Math.cos(PSI0) * s, psi: PSI0, tampak: t >= m0 - 0.05 };
  }
  if (t < T_RETAK) return { a: 0, b: 0.06 * Math.sin((t - m1) * 1.3), psi: PSI0 + 0.025 * Math.sin((t - m1) * 0.9), tampak: true };
  return { a: 0, b: 0.06 * Math.sin((T_RETAK - m1) * 1.3), psi: PSI0 + 0.025 * Math.sin((T_RETAK - m1) * 0.9) + tabel(putar, T_RETAK, t), tampak: t < 28.6 };
}
function cariWaktu(b) { // kapan perahu melewati jarak b
  for (let k = 1; k < lari.length; k++) if (lari[k] >= b) return T_SERENTAK + (k - 1 + (b - lari[k - 1]) / (lari[k] - lari[k - 1])) * DT_TABEL;
  return null;
}
export const T_LEWAT_GAPURA = GAPURA_B.map(cariWaktu);
export const B_AKHIR = tabel(lari, T_SERENTAK, DURASI);

// ---------------------------------------------------------------- tangkapan dayung (untuk suara)
// Saat bilah masuk air. Pada adegan 8–9 kedelapan bilah masuk bersamaan.
export function tangkapan() {
  const L = [];
  const jendela = [[9.0, 27.2], [48.2, DURASI - 0.4]];
  for (const [a, b] of jendela) {
    if (a >= T_SERENTAK) {
      for (let n = Math.ceil(fasaDayung(a, 0)); ; n++) {
        const t = cariFasa(0, n, a, b);
        if (t === null) break;
        L.push({ t, serempak: true, i: -1 });
      }
      continue;
    }
    for (let i = 0; i < N_DAYUNG; i++) {
      for (let n = Math.ceil(fasaDayung(a, i)); ; n++) {
        const t = cariFasa(i, n, a, b);
        if (t === null) break;
        if (kuatDayung(t) > 0.35) L.push({ t, serempak: t < T_RETAK, i });
      }
    }
  }
  return L.sort((x, y) => x.t - y.t);
}
function cariFasa(i, n, a, b) { // waktu pertama dalam [a, b] saat fasa rower i mencapai n
  if (fasaDayung(a, i) >= n) return null;
  let lo = a, hi = a;
  while (fasaDayung(hi, i) < n) { hi += 0.05; if (hi > b) return null; }
  for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (fasaDayung(m, i) < n) lo = m; else hi = m; }
  return hi;
}

// ---------------------------------------------------------------- menara cip
// Dua susunan: (A) adegan 4, tumbuh dari bekas dua karang ke segala arah; (B) adegan 8, membentuk celah.
// Kerangka perahu awal (haluan condong PSI0): ar = ke kanan perahu, bf = ke depan perahu → koordinat dunia (a, b).
export const kerangkaPerahu = (ar, bf) => ({ a: ar * Math.cos(PSI0) - bf * Math.sin(PSI0), b: ar * Math.sin(PSI0) + bf * Math.cos(PSI0) });
export const KARANG_POS = [kerangkaPerahu(4.9, 0.6), kerangkaPerahu(-4.9, -0.6)];
export const menara = [];
{
  const r = acak(77);
  const cand = [];
  for (let i = -5; i <= 5; i++) for (let j = -4; j <= 8; j++) {
    const a = i * 2.55 + (r() - 0.5) * 1.1, b = j * 2.45 + (r() - 0.5) * 1.1;
    const tinggi = 1.7 + r() * 2.9, lebar = 0.95 + r() * 0.45, nyala = r() < 0.52, putar = Math.floor(r() * 4);
    cand.push({ a, b, tinggi, lebar, nyala, putar, u: r() });
  }
  // A: di sekitar perahu (jari-jari 3,6–13), tidak terlalu jauh ke bawah layar.
  const A = cand.filter((c) => { const d = Math.hypot(c.a, c.b); return d > 4.7 && d < 12.5 && c.b > -7 && c.b < 13 && Math.abs(c.a) < 9 && !(c.b < 2.8 && Math.abs(c.a) < 6.2); });
  A.forEach((c) => {
    const dKarang = Math.min(...KARANG_POS.map((k) => Math.hypot(c.a - k.a, c.b - k.b)));
    c.tNaik = T_MENARA[0] + (T_MENARA[1] - T_MENARA[0] - 0.7) * Math.min(1, dKarang / 11) + 0.15 * c.u;
    menara.push({ ...c, susunan: "A" });
  });
  // B: celah lurus untuk perahu di b 21–37, |a| 3,3–7,5.
  const rb = acak(78);
  for (let k = 0; k < 12; k++) {
    const sisi = k % 2 === 0 ? -1 : 1;
    const b = 21 + Math.floor(k / 2) * 2.85 + (rb() - 0.5) * 0.8;
    const a = sisi * (3.35 + rb() * 0.6);
    menara.push({ a, b, tinggi: 2.0 + rb() * 2.6, lebar: 1.0 + rb() * 0.35, nyala: rb() < 0.55, putar: Math.floor(rb() * 4), u: rb(), tNaik: 47.95 + 0.06 * k, susunan: "B" });
  }
  for (let k = 0; k < 6; k++) { // baris luar
    const sisi = k % 2 === 0 ? -1 : 1;
    const b = 22.4 + Math.floor(k / 2) * 4.3 + (rb() - 0.5) * 0.8;
    menara.push({ a: sisi * (6.3 + rb() * 0.8), b, tinggi: 2.6 + rb() * 2.2, lebar: 1.1 + rb() * 0.35, nyala: rb() < 0.5, putar: Math.floor(rb() * 4), u: rb(), tNaik: 48.05 + 0.06 * k, susunan: "B" });
  }
}

// ---------------------------------------------------------------- bola dunia: titik yang menyala
// [bujur, lintang, jenis]; tNyala diisi berurutan sesudah T_DUNIA.
export const TITIK_DUNIA = [
  { nama: "Yogyakarta", lon: 110.4, lat: -7.8, jenis: "asal" },
  { nama: "Singapura", lon: 103.8, lat: 1.35, jenis: "riset" },
  { nama: "Tokyo", lon: 139.7, lat: 35.7, jenis: "riset" },
  { nama: "Kairo", lon: 31.2, lat: 30.0, jenis: "kampus" },
  { nama: "Melbourne", lon: 145.0, lat: -37.8, jenis: "kampus" },
  { nama: "Jenewa", lon: 6.1, lat: 46.2, jenis: "forum" },
  { nama: "Leiden", lon: 4.5, lat: 52.2, jenis: "kampus" },
  { nama: "Delhi", lon: 77.2, lat: 28.6, jenis: "riset" },
  { nama: "Cambridge", lon: 0.1, lat: 52.2, jenis: "kampus" },
];
TITIK_DUNIA.forEach((p, k) => { p.tNyala = T_DUNIA + 0.1 + (k === 0 ? 0 : 0.35 + 0.33 * (k - 1)); });

// ---------------------------------------------------------------- daftar isyarat suara (dalam t)
// pan: −1 kiri … 1 kanan. vel: variasi kecil supaya pengulangan tidak kaku.
export function daftarIsyarat() {
  const r = acak(9);
  const vel = () => 0.88 + 0.24 * r();
  const L = [];
  // 1. Pembuka
  L.push({ t: T_KULIAH_NYALA, jenis: "nyala-gedung", nada: 0, pan: -0.3 });
  L.push({ t: T_SIDANG_NYALA, jenis: "nyala-gedung", nada: 1, pan: 0.3 });
  L.push({ t: T_GARIS[0], jenis: "kilau-garis", dur: T_GARIS[1] - T_GARIS[0], pan: 0 });
  L.push({ t: T_AIR[0], jenis: "air-datang", dur: T_AIR[1] - T_AIR[0] + 0.6 });
  // 2–4. Air, karang, perahu
  L.push({ t: 8.0, jenis: "ombak", dur: 27.6 - 8.0 });
  T_KARANG.forEach((tk, k) => L.push({ t: tk, jenis: "dentum-karang", pan: k === 0 ? 0.45 : -0.45, vel: k === 0 ? 1 : 0.9 }));
  L.push({ t: T_PERAHU_MASUK[0], jenis: "desir-perahu", dur: T_PERAHU_MASUK[1] - T_PERAHU_MASUK[0] });
  for (const c of tangkapan()) {
    if (c.serempak) L.push({ t: c.t, jenis: "kayuh", jumlah: c.i < 0 ? 8 : 1, pan: c.i < 0 ? 0 : (c.i < 4 ? -0.35 : 0.35), vel: vel(), lemah: 1 });
    else L.push({ t: c.t, jenis: "kayuh", jumlah: 1, pan: c.i < 4 ? -0.4 : 0.4, vel: vel() * 0.9, lemah: c.t > 20.5 ? 0.55 : 1 });
  }
  L.push({ t: T_DERIT, jenis: "derit", dur: 0.5 });
  L.push({ t: T_RETAK, jenis: "retak" });
  L.push({ t: 16.0, jenis: "pusaran", dur: 4.3 });
  L.push({ t: T_BELAH, jenis: "belah-karang" });
  L.push({ t: T_MENARA[0], jenis: "dengung-cip", dur: 27.3 - T_MENARA[0] });
  menara.filter((m) => m.susunan === "A" && m.nyala).sort((x, y) => x.tNaik - y.tNaik)
    .filter((m, k, arr) => k === 0 || m.tNaik - arr[k - 1].tNaik > 0.18).slice(0, 10)
    .forEach((m, k) => L.push({ t: m.tNaik + 0.05, jenis: "blip-cip", nada: [0, 2, 4, 1, 3, 5, 2, 6, 4, 7][k], pan: klem(m.a / 9, -0.7, 0.7), vel: vel() }));
  // 5. Jalan HMI
  L.push({ t: T_NAIK[0], jenis: "desir-naik", dur: T_NAIK[1] - T_NAIK[0] });
  for (let k = 0; k < 8; k++) L.push({ t: T_BARIS[0] + 0.15 + k * 0.24, jenis: "langkah", pan: k % 2 ? 0.12 : -0.12, vel: vel(), berat: 1 });
  L.push({ t: T_ANGIN[0], jenis: "angin", dur: T_ANGIN[1] - T_ANGIN[0] });
  L.push({ t: T_BUKU, jenis: "cahaya-buku", dur: 2.1 });
  L.push({ t: T_CABANG[0], jenis: "cabang", dur: 1.3 });
  for (let k = 0; k < 5; k++) L.push({ t: T_ALUMNI[0] + k * 0.24, jenis: "pop-alumni", nada: [0, 2, 4, 3, 5][k], pan: [-0.4, 0.3, -0.15, 0.45, 0.05][k], vel: vel() });
  // 6. Modal yang bocor
  L.push({ t: T_LUAS[0], jenis: "desir-luas", dur: T_LUAS[1] - T_LUAS[0] });
  for (let k = 0; k < 9; k++) L.push({ t: T_TITIK[0] + 0.1 + k * 0.15, jenis: "kilau-titik", nada: [3, 5, 4, 6, 5, 7, 6, 8, 7][k], pan: (r() - 0.5) * 1.2, vel: vel() });
  T_SENTAK.forEach((ts, k) => L.push({ t: ts, jenis: "tegang-tali", pan: [-0.35, 0.3, -0.1, 0.4][k], vel: vel() }));
  L.push({ t: T_BOCOR[0], jenis: "bocor", dur: T_BOCOR[1] - T_BOCOR[0] });
  // 7. Dua gapura
  T_GAPURA.forEach((tg, k) => L.push({ t: tg, jenis: "gapura-berdiri", nada: k, pan: 0 }));
  for (let k = 0; k < 9; k++) L.push({ t: T_MUDA[0] + 0.2 + k * 0.42, jenis: "langkah", pan: 0.05, vel: vel() * 0.8, berat: 0.6 + 0.05 * k });
  L.push({ t: T_MUDA[0], jenis: "tumbuh", dur: T_MUDA[1] - T_MUDA[0] });
  // 8. Serempak
  L.push({ t: T_KEMBALI[0], jenis: "desir-kembali", dur: T_KEMBALI[1] - T_KEMBALI[0] });
  L.push({ t: 47.9, jenis: "ombak", dur: DURASI - 47.9 });
  L.push({ t: 49.2, jenis: "gelora", dur: T_LEWAT_GAPURA[1] - 49.2 + 0.5 });
  T_LEWAT_GAPURA.forEach((tg, k) => L.push({ t: tg, jenis: "lewat-gapura", nada: k }));
  // 9. Penutup
  L.push({ t: T_DUNIA, jenis: "akor-dunia" });
  TITIK_DUNIA.slice(1).forEach((p, k) => L.push({ t: p.tNyala, jenis: "kilau-dunia", nada: [5, 7, 6, 8, 9, 7, 10, 8][k], pan: [-0.1, 0.4, -0.35, 0.45, -0.5, -0.45, 0.15, -0.55][k], vel: vel() }));
  return L.sort((a, b) => a.t - b.t);
}

// Peristiwa gambar untuk memeriksa sinkron suara (dalam t).
export function peristiwaPeriksa() {
  const pertamaSerempak = tangkapan().find((c) => c.t > 48.2);
  return [
    { nama: "ruang kuliah menyala", t: T_KULIAH_NYALA, pita: "tinggi" },
    { nama: "karang pertama naik", t: T_KARANG[0], pita: "rendah" },
    { nama: "lantai perahu retak", t: T_RETAK, pita: "tinggi" },
    { nama: "buku NDP menyala", t: T_BUKU, pita: "tinggi" },
    { nama: "gapura 2045 berdiri", t: T_GAPURA[0], pita: "rendah" },
    { nama: "kayuhan serempak", t: pertamaSerempak.t, pita: "tinggi" },
    { nama: "bola dunia menyala", t: T_DUNIA, pita: "rendah" },
  ];
}
