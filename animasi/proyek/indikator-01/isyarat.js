// Satu sumber waktu untuk gambar (adegan.js) dan suara (suara.mjs).
// Tanpa dependensi: berjalan di browser (Vite) maupun di Node. Waktu t dalam detik.
//
// Indikator 01 / 44: "Jumlah mahasiswa baru yang masuk HMI menurun."

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
  gridNyala: [0, 0.6],
  kepalaMasuk: [0.6, 1.2],
  gelombang: [0.6, 2.4, 4.2],        // 2024, 2025, 2026
  beku: [6.0, 6.6],                  // semua gerak figur melambat lalu berhenti
  denyut: [7.0, 11.8],               // denyut cermin, periode 1.2 s
  periodeDenyut: 1.2,
  tigaMasuk: 12.0,                   // tiga figur terakhir masuk ke komisariat
  tabelMuncul: 12.4,
  batang: [12.7, 13.0, 13.3],        // tiap batang tumbuh 0.3 s
  limaMuncul: 13.8,                  // lima figur baru, jeda 0.12 s
  balon: [13.9, 14.15, 14.4, 14.65, 14.9], // balon alasan, jeda 0.25 s, selesai 15.4
  emas: [15.6, 16.4],                // tabel berubah emas, komisariat kembali zamrudRedup
  kepalaAkhir: [18.2, 18.8],
  ajakan: [18.6, 19.2],
  sumber: [19.0, 19.6],
};

// ---------------------------------------------------------------- arus figur (Bagian 1)
// B = berbelok ke komisariat, L = lurus menjauh. Urutan dipilih supaya perbandingan tiap tahun terbaca.
export const URUT = ["BBBLBBBBLBBB", "LLBLBBBBBLLL", "BLBLBLLLLLLL"];
export const TAHUN = ["2024", "2025", "2026"];
export const JEDA = 0.15;   // jarak antar figur (12 figur dalam 1.8 s)
export const LAJU = 3.6;    // unit per detik
export const HILANG = 0.4;  // durasi gerak Hilang

// Waktu efektif figur: melambat pada 6.0–6.6 lalu berhenti (τ berhenti di 6.3).
export function tau(t) {
  if (t <= T.beku[0]) return t;
  const s = Math.min(t - T.beku[0], 0.6);
  return T.beku[0] + s - (s * s) / 1.2;
}
export function tauBalik(x) { // detik nyata ketika τ mencapai x (Infinity bila tidak pernah)
  if (x <= T.beku[0]) return x;
  if (x >= T.beku[0] + 0.3) return Infinity;
  return T.beku[0] + 0.6 * (1 - Math.sqrt(1 - (x - T.beku[0]) / 0.3));
}

// ---------------------------------------------------------------- jalur dalam koordinat layar (r, d)
export const GERBANG = [-3.4, -3.6];
export const RUMAH_P = [2.6, 2.2];
// Pintu di sisi +z lokal rumah (menghadap kiri-bawah layar), x lokal −0.4.
export const PINTU = [RUMAH_P[0] + Math.SQRT1_2 * (-0.4 - 0.8), RUMAH_P[1] + Math.SQRT1_2 * (-0.4 + 0.8)];
export const NORMAL_PINTU = [-Math.SQRT1_2, Math.SQRT1_2];
const geser = (p, n, k) => [p[0] + n[0] * k, p[1] + n[1] * k];
export const DEPAN_PINTU = geser(PINTU, NORMAL_PINTU, 0.5);
// Tiga tempat berdiri di kiri depan pintu (pintu tetap terlihat). Yang tiba pertama mengambil tempat terjauh.
export const TEMPAT_TIGA = [[-0.45, 0.95], [-0.9, 0.4], [-1.35, -0.15]].map(([r, d]) => [PINTU[0] + r, PINTU[1] + d]);
export const TUJUAN_LURUS = [-6, 0];

// Jalan ubin: lengkung kuadrat dari (−2.6, −2.6) lewat (−0.4, −0.2) ke (1.8, 1.6).
const J0 = [-2.6, -2.6], J1 = [-0.4, -0.2], J2 = [1.8, 1.6];
const JK = [2 * J1[0] - (J0[0] + J2[0]) / 2, 2 * J1[1] - (J0[1] + J2[1]) / 2];
export function titikJalan(u) {
  const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
  return [a * J0[0] + b * JK[0] + c * J2[0], a * J0[1] + b * JK[1] + c * J2[1]];
}
export const SAMPEL_JALAN = Array.from({ length: 41 }, (_, i) => titikJalan(i / 40));

function chaikin(p, n = 2) {
  for (let k = 0; k < n; k++) {
    const q = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    q.push(p[p.length - 1]);
    p = q;
  }
  return p;
}
export function buatJalur(titikArr) {
  const kum = [0];
  for (let i = 1; i < titikArr.length; i++) kum.push(kum[i - 1] + Math.hypot(titikArr[i][0] - titikArr[i - 1][0], titikArr[i][1] - titikArr[i - 1][1]));
  return { p: titikArr, kum, L: kum[kum.length - 1] };
}
// Posisi pada jarak s sepanjang jalur → [r, d, arahR, arahD].
export function padaJalur(j, s) {
  s = Math.max(0, Math.min(j.L, s));
  let i = 1;
  while (i < j.kum.length - 1 && j.kum[i] < s) i++;
  const a = j.p[i - 1], b = j.p[i], l = j.kum[i] - j.kum[i - 1] || 1e-6;
  const k = (s - j.kum[i - 1]) / l;
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, (b[0] - a[0]) / l, (b[1] - a[1]) / l];
}

// Satu figur per entri: waktu keluar gerbang, jenis, jalur, dan peristiwa turunannya.
export const FIGUR = (() => {
  const r = acak(101);
  const hasil = [];
  URUT.forEach((urut, w) => {
    let nTiga = 0;
    [...urut].forEach((jenis, i) => {
      const te = T.gelombang[w] + i * JEDA;
      const geserLajur = (r() - 0.5) * 0.24;
      const tiga = w === 2 && jenis === "B" ? nTiga++ : -1; // tiga figur terakhir (gelombang 2026)
      let titikArr;
      if (jenis === "B") {
        const lr = GERBANG[0] + 0.55 + geserLajur;
        const akhir = tiga >= 0 ? TEMPAT_TIGA[tiga] : DEPAN_PINTU;
        titikArr = chaikin([[lr, -4.0], [lr, -3.2], ...SAMPEL_JALAN, [0.85, 2.13], akhir]);
      } else {
        const lr = GERBANG[0] - 0.55 + geserLajur;
        titikArr = chaikin([[lr, -4.0], [lr, -3.2], TUJUAN_LURUS]);
      }
      const jalur = buatJalur(titikArr);
      const f = { w, i, jenis, te, jalur, tiga };
      const tTiba = te + jalur.L / LAJU; // dalam τ
      if (jenis === "L") {
        f.tauHilang = tTiba - HILANG;            // mulai memudar di tepi
        f.tHilang = tauBalik(f.tauHilang);       // detik nyata (Infinity bila keburu berhenti)
      } else if (tiga < 0) {
        f.tMasuk = tauBalik(tTiba);              // tiba di depan pintu lalu masuk (detik nyata)
      }
      hasil.push(f);
    });
  });
  return hasil;
})();

// Lima figur baru di depan komisariat (Bagian 3).
export const PUSAT_LIMA = [3.1, 4.6];
export const JARI_LIMA = 0.8;

// ---------------------------------------------------------------- daftar isyarat suara (dalam t nyata)
// pan: −1 kiri … 1 kanan, kira-kira mengikuti posisi x di layar.
export const LEWAT_GERBANG = 0.4 / LAJU; // detik dari keluar sampai melewati garis gerbang
export function daftarIsyarat() {
  const L = [];
  const tauAkhir = tau(Infinity);
  for (const f of FIGUR) {
    L.push({ t: f.te + LEWAT_GERBANG, jenis: "langkah", pan: f.jenis === "B" ? -0.3 : -0.45 });
    // Bunyi hanya untuk figur yang menjauh dan benar-benar hilang di tepi sebelum gerak berhenti.
    if (f.jenis === "L" && f.tauHilang + HILANG <= tauAkhir) L.push({ t: f.tHilang, jenis: "thunk", pan: -0.65 });
  }
  T.gelombang.forEach((t, k) => L.push({ t, jenis: "rongga", k, pan: -0.25 }));
  L.push({ t: T.beku[0], jenis: "melambat", dur: 0.9, pan: 0 });
  const nDenyut = Math.round((T.denyut[1] - T.denyut[0]) / T.periodeDenyut);
  for (let k = 0; k < nDenyut; k++) L.push({ t: T.denyut[0] + k * T.periodeDenyut, jenis: "denyut", dur: T.periodeDenyut, pan: -0.15 });
  L.push({ t: T.tabelMuncul, jenis: "kertas", pan: -0.05 });
  T.batang.forEach((t, k) => L.push({ t, jenis: "blip", k, pan: -0.05 }));
  T.balon.forEach((t, k) => {
    const r = PUSAT_LIMA[0] + JARI_LIMA * Math.cos(((90 + 72 * k) * Math.PI) / 180);
    L.push({ t, jenis: "pop", k, pan: Math.max(-1, Math.min(1, ((r - 1.0) * 120) / 540)) });
  });
  L.push({ t: T.emas[0], jenis: "klik-emas", pan: -0.05 });
  L.push({ t: T.kepalaAkhir[0], jenis: "akor", pan: 0 });
  return L.sort((a, b) => a.t - b.t);
}

// Peristiwa gambar untuk memeriksa sinkron suara (dalam t).
export function peristiwaPeriksa() {
  const lurus = FIGUR.find((f) => f.jenis === "L");
  return [
    { nama: "langkah figur ke-3", t: FIGUR[2].te + LEWAT_GERBANG, pita: "tinggi" },
    { nama: "thunk lurus pertama", t: lurus.tHilang, pita: "rendah" },
    { nama: "tabel muncul", t: T.tabelMuncul, pita: "lebar" },
    { nama: "balon pertama", t: T.balon[0], pita: "lebar" },
    { nama: "klik emas", t: T.emas[0], pita: "tinggi" },
  ];
}
