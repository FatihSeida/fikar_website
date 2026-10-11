// animasi/indikator-02-v2: "Jarak HMI dengan kehidupan mahasiswa semakin lebar."
// Video format evidence, 31 detik, 1080×1920 (Prompt 02 versi kit, bagian A sampai K). Dibuat dari templat kit/alat/templat/evidence.
// Dunia ini tidak memakai dunia dasar kit: tata letaknya dipindah dari animasi/indikator-02/tata.js (dibaca, tidak diimpor).
//
// URUTAN PANGGILAN (jangan dibalik):
//   1. buatVideo({ format: formatEvidence({...}), kamera: (t) => jadwal(t) })
//   2. dunia dan adegan Bagian 1–3
//   3. v.setiapFrame
//   4. segmenKuis(v, {...})                        PALING AKHIR
//   5. jadwal = jadwalEvidence({ ..., kuis: { fokus: seg.fokus } })
//
// Koordinat dunia (x, z) dipakai langsung di bawah ini; titik(r, d, y) hanya untuk G: r = 0.707(x − z), d = 0.707(x + z).
import * as THREE from "three";
import {
  buatVideo, formatEvidence, jadwalEvidence, segmenKuis, fokusUntuk, titik, W, halus, rentang, campur, waktuBeku, setelKeadaan,
  blokTanah, gerbangKampus, gedungKelas, rumah, pion, kartuProker, panahGaris, balonKata, kartuKecil, papanTulis, papanJembatan,
  label3D, muncul, hilang, jalan, lintas, gantiBenda, busur, klikEmas, debu, catat,
} from "../../kit/index.js";

// ---------------------------------------------------------------- 1. teks (bagian E, persis)
let jadwal = null;
const v = buatVideo({
  format: formatEvidence({
    nomor: "02", total: 44, kategori: "KADERISASI",
    judul: "Jarak HMI dengan kehidupan mahasiswa semakin lebar.",
    mode: "ikhtiar",
    gejala: "",
    sebab: "Kegiatan disusun dari **dugaan pengurus**. Keluhan mahasiswa jatuh di tengah jalan.",
    ikhtiar: [
      { teks: "**Pemetaan Kebutuhan Mahasiswa** mencatat apa yang dibutuhkan, diminati, dan dihadapi mahasiswa setiap semester.", masuk: [13.6, 14.1], keluar: [19.0, 19.4] },
      { teks: "Kegiatan disusun dari **peta itu**, bukan dari dugaan pengurus.", masuk: [19.6, 20.1], keluar: [22.6, 23.0] },
    ],
    program: "Program 06",
    kuis: {
      pertanyaan: "Bagaimana komisariatmu mengetahui Student Needs dan Student Interest mahasiswa di kampus?",
      kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu.",
    },
    // ajakan, baca, dan sumber: bawaan format.
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- 2. dunia (bagian F)
const ATAS = 0.3;                       // permukaan atas blok
const TEPI = 2.5;                       // tepi celah di lokal blok (setengah lebar blok)
const GX = 1.9, GZ = 1.0;               // G: titik tengah celah (dunia)
const G = titik(0.64, 2.05);            // = dunia (1.9, 0, 1.0), fokus kamera
const LEBAR_AWAL = 0.4, LEBAR_AKHIR = 3.0, GESER = [1.6, 5.6];
const Z_KAMPUS = 0.6, Z_KOM = -0.6;     // tata.js: Z_KIRI, Z_KANAN (mutlak)
const Z_JEMBATAN = 1.8;                 // dunia; = Z_KAMPUS + z gerbang (1.2)
const X_KAMPUS = GX - LEBAR_AKHIR / 2 - TEPI;   // posisi AKHIR (celah 3.0): blok dibuat di sini
const X_KOM = GX + LEBAR_AKHIR / 2 + TEPI;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const duniaDari = (induk, lokal) => { induk.updateWorldMatrix(true, false); return induk.localToWorld(lokal.clone()); };
// Kertas redup: campuran dua token (kertas + abu), dipakai benda Bagian 2 yang belum berproses.
const KERTAS_REDUP = W.kertas.clone().lerp(W.abu, 0.4);

// Blok dibuat di posisi akhir; celah yang lebih sempit di awal adalah selisih yang dihapus gerak (lintas), supaya
// segmenKuis (yang membaca posisi komisariat saat dipanggil) mendapat tempat akhir.
const blokKampus = v.tambah(blokTanah({ lebar: 5, tinggi: 0.3, dalam: 6, sisiCelah: "kanan", patah: "kanan", benih: 3 }));
const blokKom = v.tambah(blokTanah({ lebar: 5, tinggi: 0.3, dalam: 6, sisiCelah: "kiri", patah: "kiri", benih: 7 }));
blokKampus.position.set(X_KAMPUS, 0, Z_KAMPUS);
blokKom.position.set(X_KOM, 0, Z_KOM);
// Lempeng blok adalah latar: tepi luar boleh terpotong tepi layar (keputusan pengguna). Benda di atasnya tetap diperiksa.
blokKampus.userData.penting = false;
blokKom.userData.penting = false;

// -- blok kampus (lokal: pusat blok, alas y 0.3, tepi celah di x +2.5)
const gerbang = gerbangKampus();
gerbang.position.set(2.25, ATAS, 1.2);
gerbang.rotation.y = Math.PI / 4;       // balok atas sejajar sumbu z, bukaan menghadap +x
blokKampus.add(gerbang);
const kelas = gedungKelas();
kelas.position.set(0.25, ATAS, 0.9);    // pusat x −0.75..1.25, z −0.6..2.4
kelas.rotation.y = Math.PI / 2;         // muka berjendela 4 × 2 menghadap +x
blokKampus.add(kelas);

// Jalur keliling gedung kelas, 0.4 dari dinding (tata.js). s bertambah = searah jarum jam dilihat dari atas layar.
const C = 0.4, KL = { x0: -0.75, x1: 1.25, z0: -0.6, z1: 2.4 };
const SEG = [
  { jenis: "garis", a: [KL.x1 + C, KL.z0], b: [KL.x1 + C, KL.z1] },
  { jenis: "busur", c: [KL.x1, KL.z1], th: [0, Math.PI / 2] },
  { jenis: "garis", a: [KL.x1, KL.z1 + C], b: [KL.x0, KL.z1 + C] },
  { jenis: "busur", c: [KL.x0, KL.z1], th: [Math.PI / 2, Math.PI] },
  { jenis: "garis", a: [KL.x0 - C, KL.z1], b: [KL.x0 - C, KL.z0] },
  { jenis: "busur", c: [KL.x0, KL.z0], th: [Math.PI, 1.5 * Math.PI] },
  { jenis: "garis", a: [KL.x0, KL.z0 - C], b: [KL.x1, KL.z0 - C] },
  { jenis: "busur", c: [KL.x1, KL.z0], th: [1.5 * Math.PI, 2 * Math.PI] },
];
for (const s of SEG) s.L = s.jenis === "garis" ? Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) : C * (s.th[1] - s.th[0]);
const KELILING = SEG.reduce((j, s) => j + s.L, 0);
function titikKeliling(s) {
  s = ((s % KELILING) + KELILING) % KELILING;
  for (const g of SEG) {
    if (s > g.L) { s -= g.L; continue; }
    if (g.jenis === "garis") { const u = s / g.L; return { x: campur(g.a[0], g.b[0], u), z: campur(g.a[1], g.b[1], u) }; }
    const th = g.th[0] + s / C;
    return { x: g.c[0] + C * Math.cos(th), z: g.c[1] + C * Math.sin(th) };
  }
  return { x: KL.x1 + C, z: KL.z0 };
}
class JalurKeliling extends THREE.Curve {          // kurva berparameter jarak: u 0..1 → s0 .. s0 + panjang di jalur keliling
  constructor(s0, panjang) { super(); this.s0 = s0; this.panjang = panjang; }
  getPoint(u, out = new THREE.Vector3()) { const q = titikKeliling(this.s0 + u * this.panjang); return out.set(q.x, ATAS, q.z); }
}

// Enam figur kampus berjarak rata di sepanjang jalur. Mereka berjalan 1.2 unit/detik dari 1.6, melambat 6.0, berhenti 6.6 (beku
// bawaan format): jarak tempuh D dihitung dari jam beku yang sama, supaya posisi berhenti figur 0 tepat di depan gerbang
// (lorong, z 1.2 lokal), tempat figur penyeberang Bagian 3 berangkat.
const LAJU = 1.2, MULAI_JALAN = 1.6;
const jamBeku = waktuBeku(v.beku[0], v.beku[1]);
const D_TEMPUH = LAJU * (jamBeku(v.beku[1]) - MULAI_JALAN);
const S_GERBANG = 1.2 - KL.z0;                       // s di lorong depan (x 1.65) pada z lokal 1.2, sejajar gerbang
const figKampus = Array.from({ length: 6 }, (_, i) => {
  const f = pion();
  blokKampus.add(f);
  const sBerhenti = S_GERBANG + (i * KELILING) / 6;
  const jalur = new JalurKeliling(sBerhenti - D_TEMPUH, D_TEMPUH + 3);
  f.position.copy(jalur.getPointAt(0));
  const q = titikKeliling(sBerhenti);
  f.userData.berhenti = V3(q.x, ATAS, q.z);        // lokal blok
  f.userData.jalur = jalur;
  return f;
});

// -- blok komisariat (lokal: tepi celah di x −2.5)
const komisariat = rumah();
komisariat.position.set(-1.35, ATAS, 0.95);
blokKom.add(komisariat);
const figKom = [[-0.45, 2.05], [0.4, 2.1], [-1.75, 2.55]].map(([x, z]) => {
  const f = pion();
  f.position.set(x, ATAS, z);
  blokKom.add(f);
  return f;
});
const papanPeta = papanTulis({ lebar: 2.6, tinggi: 1.8, kaki: 1.0, kolom: ["BUTUH", "MINAT", "TANTANGAN"], baris: ["", "", ""] });
papanPeta.position.set(-1.6, ATAS, -1.9);
blokKom.add(papanPeta);

// Benda latar boleh terpotong saat kamera mendekat ke komisariat (Bagian 2 dan 3): dikecualikan dari zona sesudah 6.0.
for (const b of [gerbang, kelas, ...figKampus]) b.userData.penting = (t) => t < 6.0;

// ---------------------------------------------------------------- 3. Bagian 1, Gejala (0.6–6.0)
// 0.6–1.1: kedua blok muncul bersamaan; 0.66–1.1: gerbang, gedung kelas, komisariat, figur kampus, figur komisariat berurutan.
muncul([blokKampus, blokKom], { t: 0.6, jeda: 0 });
muncul(gerbang, { t: 0.66 });
muncul(kelas, { t: 0.78 });
muncul(komisariat, { t: 0.90 });
muncul(figKampus, { t: 1.02, jeda: 0 });
muncul(figKom, { t: 1.10, jeda: 0 });
label3D("KAMPUS", { pada: gerbang, geser: [0, 2.85, 0], gaya: "benda", masuk: 1.1, keluar: [6.0, 6.3] });
label3D("KOMISARIAT", { pada: komisariat, geser: [0, 2.15, 0], gaya: "benda", masuk: 1.1, keluar: [6.0, 6.3] });

// 1.6–5.6: kedua blok menjauh (hanya di sumbu x dunia), celah 0.4 → 3.0 halus. Posisi awal = posisi akhir ± (3.0 − 0.4) / 2.
const SELISIH = (LEBAR_AKHIR - LEBAR_AWAL) / 2;
lintas(blokKampus, { t: GESER[0], durasi: GESER[1] - GESER[0], jalur: [V3(X_KAMPUS + SELISIH, 0, Z_KAMPUS), V3(X_KAMPUS, 0, Z_KAMPUS)], kurva: halus, beku: false, bunyi: false });
lintas(blokKom, { t: GESER[0], durasi: GESER[1] - GESER[0], jalur: [V3(X_KOM - SELISIH, 0, Z_KOM), V3(X_KOM, 0, Z_KOM)], kurva: halus, beku: false, bunyi: false });
catat({ t: 1.6, jenis: "gemuruh", kuat: 0.35, durasi: 4.0, posisi: G.clone(), sumber: "celah" });

// 1.6–6.0: enam figur berkeliling; tiga figur komisariat diam.
figKampus.forEach((f) => jalan(f, { t: MULAI_JALAN, jalur: f.userData.jalur, laju: LAJU, bunyi: { kuat: 0.25 } }));

// 1.7–5.5: debu jatuh dari kedua tepi celah (butir lahir 1.7–5.5; ikut bergeser bersama blok lewat `induk`).
// Posisi dan bunyi: pusat di lokal blok, jadi bunyi dicatat sendiri dengan posisi dunia.
for (const [blok, x, z, benih] of [[blokKampus, TEPI, GZ - Z_KAMPUS, 11], [blokKom, -TEPI, GZ - Z_KOM, 12]]) {
  debu({ pusat: V3(x, ATAS + 0.02, z), mulai: 1.7, selesai: 5.5, jumlah: 70, sebar: 0.8, naik: -0.4, benih, induk: blok, beku: false, bunyi: false });
  catat({ t: 1.7, jenis: "debu", posisi: duniaDari(blok, V3(x, ATAS, z)), sumber: "debu" });
}

// ---------------------------------------------------------------- 3. Bagian 2, sebab (6.0–13.0)
const atap = duniaDari(komisariat, V3(0, 1.2 + 0.7, 0));            // puncak atap komisariat (dunia)
const kartuPutar = v.tambah(kartuProker({ garis: 3, kaki: false, skala: 0.6, warna: KERTAS_REDUP }));
kartuPutar.position.copy(atap);
const panah = v.tambah(panahGaris({
  titik: [atap.clone(), atap.clone().add(V3(0, 0.8, 0.35)), atap.clone().add(V3(0, 1.2, 0)), atap.clone().add(V3(0, 0.8, -0.35)), atap.clone()],
  lengkung: true, warna: W.abu,
}));
v.setiapFrame((t) => panah.userData.aturTampak(halus(rentang(t, 6.6, 7.2))));      // 6.6–7.2: panah lingkaran tergambar
catat({ t: 6.6, jenis: "garis-sambung", durasi: 0.6, posisi: atap, sumber: "panah" });

// 6.8–12.0: kartu kegiatan naik dari atap dan jatuh kembali ke atap yang sama, tiga putaran (busur tinggi 1.2).
muncul(kartuPutar, { t: 6.8, durasi: 0.3, naik: 0 });
for (const t0 of [6.8, 8.6, 10.4]) busur(kartuPutar, { t: t0, dari: atap, ke: atap, tinggi: 1.2, durasi: 1.6 });

// Posisi berhenti figur kampus (dunia) dan urutan menurut jarak ke G: yang terdekat lebih dulu.
const kepalaFigur = figKampus.map((f) => duniaDari(blokKampus, f.userData.berhenti).add(V3(0, 1.15, 0)));   // titik asal ekor: y 1.15 dari kaki
const urutan = figKampus.map((_, i) => i).sort((a, b) => Math.hypot(kepalaFigur[a].x - GX, kepalaFigur[a].z - GZ) - Math.hypot(kepalaFigur[b].x - GX, kepalaFigur[b].z - GZ));
const jatuhAtas = V3(GX, 0.9, GZ);
const jatuhDasar = V3(GX, -1.0, GZ);                                  // tengah celah G, y −1.0
const balonSebab = [0, 1, 2, 3].map((i) => {
  const b = v.tambah(balonKata({ isi: "titik", skala: 0.5, warna: KERTAS_REDUP }));
  const awal = kepalaFigur[urutan[i]];
  b.position.copy(awal);
  const t0 = 7.2 + i;                                                 // 7.2, 8.2, 9.2, 10.2
  muncul(b, { t: t0 });
  busur(b, { t: t0, dari: awal, ke: jatuhAtas, tinggi: 0.6, durasi: 0.9 });
  busur(b, { t: t0 + 0.9, dari: jatuhAtas, ke: jatuhDasar, tinggi: 0, durasi: 0.8, bunyi: false });   // terus jatuh sampai y −1.0
  hilang(b, { t: t0 + 1.7, bunyi: { kuat: 0.4 } });
  b.userData.penting = (t) => t > t0 + 0.5;       // muncul di atas figur yang boleh di luar frame kamera; diperiksa sesudah masuk frame
  return b;
});

// ---------------------------------------------------------------- 3. Bagian 3, Ikhtiar (13.0–23.0)
muncul(papanPeta, { t: 13.0 });                                       // 13.0–13.5
const warnaKartu = { warna: W.zamrud, warnaSimbol: W.pelat };
const SKALA_KARTU = 0.55;
const MAJU = V3(1, 1, 1).multiplyScalar(1.5);       // sejajar arah pandang kamera: posisi layar tetap, tetapi balon lewat di depan papan
const kolomUrut = [0, 2, 0, 1, 0, 2];                                 // BUTUH, TANTANGAN, BUTUH, MINAT, BUTUH, TANTANGAN
const tumpuk = [0, 0, 0];
const kartuKeluhan = [];
const balonIkhtiar = kolomUrut.map((c, i) => {
  const r = 2 - tumpuk[c]++;                                          // menumpuk dari bawah ke atas (baris 2 = paling bawah)
  const sel = papanPeta.userData.titikSel(c, r);
  const kartu = kartuKecil({ simbol: "garis", skala: SKALA_KARTU, rebah: false, miring: 0, hadap: 0, ...warnaKartu });
  kartu.position.set(sel.x, sel.y - (0.8 * SKALA_KARTU) / 2, sel.z + 0.02);
  papanPeta.add(kartu);
  kartuKeluhan.push(kartu);
  const b = v.tambah(balonKata({ isi: "titik", skala: 0.5, warna: KERTAS_REDUP }));
  const awal = kepalaFigur[urutan[i]];
  b.position.copy(awal);
  const tujuan = duniaDari(papanPeta, sel.clone()).add(MAJU);   // digeser ke arah kamera sepanjang arah pandang (posisi layar sama dengan sel, balon tidak tertutup papan)
  const t0 = 13.4 + 0.5 * i;                                          // 13.4 … 15.9, jeda 0.5; muncul selesai 16.4
  muncul(b, { t: t0 });
  b.userData.penting = (t) => t > t0 + 0.5;       // muncul di atas figur yang boleh di luar frame kamera; diperiksa sesudah masuk frame
  busur(b, { t: t0, dari: awal, ke: tujuan, tinggi: 1.0, durasi: 0.8 });
  gantiBenda(b, kartu, { t: t0 + 0.8, durasi: 0.3, tempat: false });
  return b;
});
// Papan dan kartunya boleh keluar frame sesudah kamera pindah ke G (19.4–20.2, bagian C): tidak diperiksa sebelum 14.0 (kamera masih bergeser ke papan) dan sesudah 19.6.
for (const b of [papanPeta, ...kartuKeluhan]) b.userData.penting = (t) => t >= 14.0 && t < 19.6;
// 16.6: tiga kartu di kolom BUTUH klik emas bersamaan.
klikEmas(kartuKeluhan.filter((_, i) => kolomUrut[i] === 0), { t: 16.6, jeda: 0 });

// 16.8–17.2: kartu kegiatan (kartu yang sama, emas) muncul di depan kolom BUTUH; 17.2–18.4: bergerak ke puncak atap.
const depanButuh = duniaDari(papanPeta, papanPeta.userData.titikSel(0, 1).clone().add(V3(0, -0.2, 0.9)));
hilang(kartuPutar, { t: 16.4, bunyi: false });                        // kartu lama (kertas redup) lenyap sebelum kartu baru muncul
muncul(kartuPutar, { t: 16.8, durasi: 0.4, naik: 0 });
klikEmas(kartuPutar, { t: 16.8, durasi: 0.4 });
busur(kartuPutar, { t: 16.8, dari: depanButuh, ke: depanButuh, tinggi: 0, durasi: 0.4, bunyi: false });   // tahan di depan kolom
const tengahTerbang = depanButuh.clone().lerp(atap, 0.5).add(V3(0, 1.0, 0));
lintas(kartuPutar, { t: 17.2, durasi: 1.2, jalur: [depanButuh, tengahTerbang, atap], lengkung: true });
// Saat tiba (18.4): panah lingkaran abu terputus dan hilang, dengan bunyi garis-putus.
hilang(panah, { t: 18.4, bunyi: false });
catat({ t: 18.4, jenis: "garis-putus", posisi: atap, sumber: "panah" });

// 19.6–20.8: kartu kegiatan ke tepi celah di blok komisariat, lalu berganti menjadi lima papan jembatan emas.
const xPapan = (i) => GX + LEBAR_AKHIR / 2 - 0.3 - 0.6 * i;          // 3.1 … 0.7 (jarak rata, dari tepi komisariat ke tepi kampus)
const papanJembatanList = [0, 1, 2, 3, 4].map((i) => {
  const p = v.tambah(papanJembatan());
  p.position.set(xPapan(i), ATAS - 0.06, Z_JEMBATAN);                 // permukaan atas y 0.32: 0.02 di atas blok supaya tidak bertabrakan dengan tepi blok
  p.rotation.y = Math.PI / 2;                                         // sisi 0.9 melintang (z), sisi 0.5 searah jembatan (x)
  return p;
});
const tepiKomisariat = V3(xPapan(0), ATAS, Z_JEMBATAN);
lintas(kartuPutar, { t: 19.6, durasi: 0.8, jalur: [atap, atap.clone().lerp(tepiKomisariat, 0.5).add(V3(0, 0.6, 0)), tepiKomisariat], lengkung: true });
gantiBenda(kartuPutar, papanJembatanList[0], { t: 20.4, durasi: 0.4, tempat: false });
muncul(papanJembatanList.slice(1), { t: 20.4 + 0.4 * 0.4 + 0.25, jeda: 0.25, naik: 0 });
klikEmas(papanJembatanList, { t: 20.4 + 0.4 * 0.4, jeda: 0.25, durasi: 0.5 });

// 21.4–23.0: satu figur kampus berjalan dari depan gerbang ke tengah jembatan dan berhenti di sana.
const penyeberang = figKampus[0];
const tengahJembatan = V3(xPapan(2) - X_KAMPUS, ATAS + 0.02, Z_JEMBATAN - Z_KAMPUS);   // lokal blok kampus
jalan(penyeberang, { t: 21.4, durasi: 1.6, jalur: [penyeberang.userData.berhenti.clone(), tengahJembatan], bunyi: { kuat: 0.25 } });

// ---------------------------------------------------------------- 4. keadaan yang berubah halus (disetel tiap frame tanpa syarat)
// Komisariat abu penuh sampai kartu kegiatan masuk; abu dilepas 18.2–19.0 (1 → 0).
v.setiapFrame((t) => {
  setelKeadaan(komisariat, "abu", 1 - halus(rentang(t, 18.2, 19.0)));
});

// ---------------------------------------------------------------- 5. Bagian 4, Kuis (23.0–28.0): PALING AKHIR
const seg = segmenKuis(v, { komisariat, kelompok: "kaderisasi", mulai: v.format.waktu.kuis[0] });

// ---------------------------------------------------------------- 6. kamera (bagian C)
const tepiKiriCelah = V3(GX - LEBAR_AKHIR / 2, ATAS, GZ);             // tepi blok kampus yang menghadap celah
// Fokus dan jendela waktu persis bagian C. Tinggi frustum H dinaikkan dari angka prompt hanya sebesar yang dibutuhkan
// supaya laporan zona kosong (diukur dengan periksaZona tiap 0.1 detik; lihat laporan):
//   gejala  14 → 21.2 keputusan pengguna: H terkecil (0.1) yang memuat semua isi blok (gedung kelas, gerbang, 6 figur kampus, komisariat,
//                      3 figur komisariat, debu) di zona selama 0.6–6.0 (sapuan 0.02 s); H 21.1 gagal (gedung kelas 0 sampai 2 px di atas zona).
//                      Dua lempeng blok (14.3 unit = 1960 px pada H 14) tidak diperiksa; blok utuh butuh H 27.9, sehingga tepi luar terpotong
//   sebab   10 → 11.2  fokusUntuk memberi peringatan pada H 10; kartu di puncak putaran dan figur komisariat baru muat mulai 11.2
//   ikhtiar 12 → 12.9  figur komisariat ke-3 keluar zona bawah (24 px) pada H 12; balon di puncak busur muat mulai 12.9
//   tambahan 12 → 13   atap komisariat keluar zona kanan pada fokus G; muat mulai 13 (12.9 tepat di batas)
jadwal = jadwalEvidence({
  fokus: G,
  awal: { H: 15 },
  gejala: { H: 21.2 },
  sebab: { H: 11.2, fokus: fokusUntuk([komisariat, kartuPutar, balonSebab[0], tepiKiriCelah], { H: 11.2 }) },
  ikhtiar: { H: 12.9, fokus: fokusUntuk([papanPeta, komisariat, tepiKiriCelah], { H: 12.9 }) },
  tambahan: [{ t: [19.4, 20.2], H: 13, fokus: G }],
  kuis: { fokus: seg.fokus },
});

