// Tata letak dan gerak murni (tanpa three.js): dipakai dunia.js, adegan.js, dan pemeriksa tata letak di Node.
// Sumbu dunia: x ke kanan-bawah layar, z ke kiri-bawah layar, y ke atas. titik(r, d) dari alat.js = (S(r+d), y, S(d-r)).
import { T, KAMERA, TINGGI_AWAL } from "./isyarat.js";

// ---------------------------------------------------------------- bantuan matematika
export const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const campur = (a, b, k) => a + (b - a) * k;
export const rentang = (t, a, b) => klem((t - a) / (b - a));
export const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
export const halus2 = (x) => { x = klem(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
export const masukKeluar3 = (x) => { x = klem(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const lenting = (x, s = 1.7) => { x = klem(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
export const jendela = (t, a, b, masuk = 0.3, keluar = 0.3) => Math.min(halus((t - a) / masuk), halus((b - t) / keluar));
export const pegas = (dt, laju = 12, frek = 22) => (dt < 0 ? 0 : Math.exp(-dt * laju) * Math.cos(dt * frek));
export const S = Math.SQRT1_2;
export const titikXZ = (r, d, y = 0) => ({ x: S * (r + d), y, z: S * (d - r) });

// ---------------------------------------------------------------- dunia
export const ATAS = 0.3;                      // permukaan atas blok
export const BLOK = { w: 5, h: 0.3, d: 6 };   // x, y, z
export const G = { x: 1.9, z: 1.0 };          // titik pada garis tengah celah (dunia), dekat jembatan: fokus kamera Bagian 2
// Kedua blok bergeser sedikit di sepanjang celah supaya isi blok kiri tidak masuk kabut atas
// dan sudut bawah blok kanan tidak turun ke bawah keterangan.
export const Z_KIRI = 0.6, Z_KANAN = -0.6;
export const Z_JEMBATAN = 1.8;                // jembatan dan gerbang segaris di z ini
export const lebarCelah = (t) => campur(0.4, 3.0, halus(rentang(t, T.geser[0], T.geser[1])));
export const xBlokKiri = (t) => G.x - lebarCelah(t) / 2 - BLOK.w / 2;
export const xBlokKanan = (t) => G.x + lebarCelah(t) / 2 + BLOK.w / 2;

// Isi blok kiri (koordinat lokal: pusat blok, alas y = 0). Tepi celah di x = +2,5.
export const KELAS = { x0: -0.75, x1: 1.25, z0: -0.6, z1: 2.4, h: 2.2 }; // muka depan berjendela menghadap +x
export const GERBANG = { x: 2.25, z: Z_JEMBATAN - Z_KIRI };              // balok atas sejajar sumbu z
// Isi blok kanan (lokal). Tepi celah di x = -2,5.
export const KOM = { x: -1.35, z: 0.35 - Z_KANAN, w: 1.8, h: 1.2, d: 1.6, atap: 0.7 }; // pintu di muka +z
export const FIGUR_KOM = [[-0.45, 2.05], [0.4, 2.1], [-1.75, 2.55]]; // mengapit pintu, pintu tetap terlihat

// ---------------------------------------------------------------- jalur keliling gedung kelas (searah jarum jam dilihat dari atas)
const C = 0.4; // jarak jalur dari dinding kelas
const { x0, x1, z0, z1 } = KELAS;
const SEG = [
  { jenis: "garis", a: [x1 + C, z0], b: [x1 + C, z1] },   // lorong depan (antara kelas dan gerbang)
  { jenis: "busur", c: [x1, z1], th: [0, Math.PI / 2] },
  { jenis: "garis", a: [x1, z1 + C], b: [x0, z1 + C] },   // sisi +z
  { jenis: "busur", c: [x0, z1], th: [Math.PI / 2, Math.PI] },
  { jenis: "garis", a: [x0 - C, z1], b: [x0 - C, z0] },   // belakang
  { jenis: "busur", c: [x0, z0], th: [Math.PI, 1.5 * Math.PI] },
  { jenis: "garis", a: [x0, z0 - C], b: [x1, z0 - C] },   // sisi -z
  { jenis: "busur", c: [x1, z0], th: [1.5 * Math.PI, 2 * Math.PI] },
];
for (const s of SEG) s.L = s.jenis === "garis" ? Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) : C * (s.th[1] - s.th[0]);
export const KELILING = SEG.reduce((j, s) => j + s.L, 0);
// Titik pada jalur (lokal blok kiri) dengan geser ke samping: lajur > 0 menjauhi kelas.
export function titikKeliling(s, lajur = 0) {
  s = ((s % KELILING) + KELILING) % KELILING;
  for (const g of SEG) {
    if (s > g.L) { s -= g.L; continue; }
    let x, z, nx, nz;
    if (g.jenis === "garis") {
      const u = s / g.L;
      x = campur(g.a[0], g.b[0], u); z = campur(g.a[1], g.b[1], u);
      const tx = (g.b[0] - g.a[0]) / g.L, tz = (g.b[1] - g.a[1]) / g.L;
      nx = tz; nz = -tx;
    } else {
      const th = g.th[0] + s / C;
      nx = Math.cos(th); nz = Math.sin(th);
      x = g.c[0] + C * nx; z = g.c[1] + C * nz;
    }
    return { x: x + nx * lajur, z: z + nz * lajur };
  }
  return { x: x1 + C, z: z0 };
}

// Jarak tempuh figur keliling: mulai pelan di 1,6; 1,2 unit/detik; melambat dan berhenti di 6,6.
const LAJU = 1.2, NAIK = 0.3;
export function jarakJalan(t) {
  const a = T.jalanMulai, [b, c] = T.jalanBerhenti;
  if (t <= a) return 0;
  let d = 0;
  const u1 = klem((t - a) / NAIK);
  d += LAJU * NAIK * (u1 * u1 * u1 - Math.pow(u1, 4) / 2);
  if (t > a + NAIK) d += LAJU * (Math.min(t, b) - (a + NAIK));
  if (t > b) { const u = klem((t - b) / (c - b)); d += LAJU * (c - b) * (u - u * u * u + Math.pow(u, 4) / 2); }
  return d;
}
export function lajuJalan(t) { // 0..1, untuk ayunan langkah
  const a = T.jalanMulai, [b, c] = T.jalanBerhenti;
  return halus((t - a) / NAIK) * (1 - halus((t - b) / (c - b)));
}
export const JARAK_TOTAL = jarakJalan(99);
// Tiga pasang figur berjalan berlawanan arah jarum jam (s berkurang). s = posisi saat berhenti (t 6,6).
export const PASANG = [
  { berhenti: 1.2 },    // A: mulai di belakang kelas, berhenti di lorong depan di bukaan gerbang (pelempar, lalu menyeberang)
  { berhenti: 12.4 },   // B: mulai di sisi +z, berhenti di sudut lorong
  { berhenti: 11.85 },  // C: mulai di sisi +z, berhenti di sisi -z dekat lorong
];
export const LAJUR = [-0.15, 0.15]; // anggota 0 dekat dinding, anggota 1 dekat gerbang
export function posisiKeliling(p, anggota, t) { // lokal blok kiri
  const s = PASANG[p].berhenti + (JARAK_TOTAL - jarakJalan(t));
  return titikKeliling(s, LAJUR[anggota]);
}

// ---------------------------------------------------------------- jembatan dan kertas
// Papan 0 di tepi kanan … papan 4 di tepi kiri (dunia, setelah celah selebar 3,0).
export const PAPAN = { w: 0.5, h: 0.08, d: 0.9 };
export const xPapan = (i) => G.x + 1.5 - 0.3 - 0.6 * i;
export const yPapan = ATAS - PAPAN.h / 2;
// Pelempar kertas i: anggota pasangan A (bergantian, mulai dari yang dekat gerbang).
export const pelempar = (i) => (i % 2 === 0 ? 1 : 0);

// Dua figur menyeberang (pasangan A), dunia. Titik jalur: dari lorong lewat gerbang, jembatan, ke halaman komisariat.
export function jalurSeberang(anggota) {
  const awal = posisiKeliling(0, anggota, 99);
  const xL = G.x - 1.5 - BLOK.w / 2;
  const lajurZ = anggota === 1 ? Z_JEMBATAN - 0.2 : Z_JEMBATAN + 0.2;
  const akhir = anggota === 1 ? { x: G.x + 2.05, z: Z_JEMBATAN - 0.3 } : { x: G.x + 1.8, z: Z_JEMBATAN + 0.15 };
  return [
    { x: xL + awal.x, z: Z_KIRI + awal.z },
    { x: G.x - 1.55, z: lajurZ },
    { x: G.x + 1.55, z: lajurZ },
    akhir,
  ];
}
export function titikPolyline(p, k) { // k 0..1 sepanjang polyline
  const L = [];
  let total = 0;
  for (let i = 0; i < p.length - 1; i++) { const l = Math.hypot(p[i + 1].x - p[i].x, p[i + 1].z - p[i].z); L.push(l); total += l; }
  let s = klem(k) * total;
  for (let i = 0; i < L.length; i++) {
    if (s <= L[i] || i === L.length - 1) { const u = L[i] > 0 ? klem(s / L[i]) : 0; return { x: campur(p[i].x, p[i + 1].x, u), z: campur(p[i].z, p[i + 1].z, u), total }; }
    s -= L[i];
  }
  return { ...p[p.length - 1], total };
}

// ---------------------------------------------------------------- kamera
export const FOKUS = { asal: { x: 0, y: 0, z: 0 }, celah: { x: G.x, y: ATAS, z: G.z }, akhir: { x: 0, y: 0.8, z: 0 } };
export function kameraPada(t) {
  let H = TINGGI_AWAL;
  let f = { ...FOKUS.asal };
  for (const [a, b, Ht, kunci] of KAMERA) {
    const w = masukKeluar3(rentang(t, a, b));
    const g = FOKUS[kunci];
    H = campur(H, Ht, w);
    f = { x: campur(f.x, g.x, w), y: campur(f.y, g.y, w), z: campur(f.z, g.z, w) };
  }
  return { H, fx: f.x, fy: f.y, fz: f.z };
}
// Proyeksi ke piksel layar (untuk pemeriksaan): kamera isometrik azimut 45°, elevasi 35,26°, fokus di (540, 1010).
export function keLayarMurni(p, k) {
  const s = 1920 / k.H;
  const dx = p.x - k.fx, dy = p.y - k.fy, dz = p.z - k.fz;
  const r = S * (dx - dz);
  const v = -0.4082483 * (dx + dz) + 0.8164966 * dy;
  return { x: 540 + r * s, y: 1010 - v * s };
}
