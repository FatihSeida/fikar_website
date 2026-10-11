// animasi/indikator-01-v2: "Jumlah mahasiswa baru yang masuk HMI menurun."
// Video format evidence, 31 detik, 1080×1920, kit 1.2.0. Brief: Prompt Animasi Indikator 01 (v2), bagian A–K.
// Urutan panggilan (jangan dibalik): buatVideo → dunia → adegan Bagian 1–3 → setiapFrame → segmenKuis (paling akhir) → jadwal kamera.
// Benda lokal: tidak ada. Semua gerak dihitung dari t (gerak standar kit); tidak ada Math.random, jam, atau CSS animasi.
import {
  buatVideo, formatEvidence, jadwalEvidence, segmenKuis, duniaKader, fokusUntuk,
  titik, W, halus, rentang,
  pion, kartuKecil, tandaTanya, garisPutus, ikonGrafik, papanTulis, kartuProker,
  label3D, gantiLabel, setelKeadaan, aturOpasitas,
  muncul, hilang, jalan, lintas, gantiBenda, busur, klikEmas, tumbuh, catat, panjangJalur,
} from "../../kit/index.js";

// ---------------------------------------------------------------- 1. teks (bagian E, dipasang persis)
let jadwal = null; // diisi sesudah segmenKuis, karena fokus kuis bergantung pada letak komisariat
const v = buatVideo({
  format: formatEvidence({
    nomor: "01", kategori: "KADERISASI",
    judul: "Jumlah mahasiswa baru yang masuk HMI menurun.",
    mode: "ikhtiar",
    gejala: "",
    sebab: "Yang tidak ikut **tidak pernah ditanya**. Penurunan baru terasa ketika sudah jauh.",
    ikhtiar: [
      { teks: "Peserta LK 1 dicatat setiap tahun dalam **Indeks Kaderisasi**, jadi penurunan terbaca sejak awal.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] },
      { teks: "**Pemetaan Kebutuhan Mahasiswa** menanyakan alasan yang tidak ikut, lalu kegiatan disusun dari situ.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] },
    ],
    program: "Program 03 · Program 06",
    kuis: { pertanyaan: "Jumlah peserta LK 1 terakhir dari komisariatmu?", kalimat: "Ukur komisariatmu, dapatkan laporannya." },
    // ajakan, baca, dan sumber: bawaan format.
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- 2. dunia (bagian F): duniaKader tanpa penyesuaian
const d = duniaKader(v);
const { gerbang, komisariat } = d.benda;

// Pengecualian pemeriksaan zona (semuanya dilaporkan): benda latar yang sengaja terpotong kamera pada jendela waktu tertentu
// tidak dihitung "penting" di jendela itu. Di luar jendela, benda tetap diperiksa.
const latar = (benda, ...jendela) => { benda.userData.penting = (t) => !jendela.some(([a, b]) => t >= a && t <= b); };
latar(d.benda.kelas, [0, 31]);   // gedung kelas: selalu terpotong kiri dan atas, sebagian besar di bawah kepala
latar(komisariat, [6.0, 18.5]);  // Bagian 2 dan awal Bagian 3: kamera di gerbang dan papan, komisariat di luar kanan bawah
latar(d.benda.jalan, [6.0, 18.5]);
latar(d.benda.tangga, [6.0, 18.5]);

// Kartu berdiri tegak menghadap kamera (rebah: false, miring 0). Titik asalnya di tepi bawah; posisi brief adalah PUSAT kartu,
// jadi benda diletakkan setengah tinggi kartu (0.4 × skala) di bawah titik itu.
const TENGAH = 0.4;

// ---------------------------------------------------------------- 3. Bagian 1, Gejala (0.6–6.0)
muncul(d.urutan, { t: 0.6, selesai: 1.6 });

// Label kotak tahun di atas gerbang: 2024 muncul 0.6, 2025 pada 2.4, 2026 pada 4.2, keluar 6.0–6.3.
const labelTahun = label3D("2024", { pada: d.titik.atasGerbang, gaya: "kotak", masuk: 0.6, keluar: [6.0, 6.3] });
gantiLabel(labelTahun, { t: 2.4, teks: "2025" });
gantiLabel(labelTahun, { t: 4.2, teks: "2026" });

// Arus figur: tiga gelombang berisi 12, jeda 0.15 s. B = berbelok ke komisariat, L = lurus lewat lapangan lalu keluar layar.
const ujungL = d.titik.lapangan.clone().add(titik(-3.0, 1.6));
const jalurB = d.titik.jalur;
const jalurL = [d.titik.belakangGerbang, d.titik.depanGerbang, d.titik.lapangan, ujungL].map((p) => p.clone().setY(0));
const GELOMBANG = [
  [0.6, "BBBLBBBBLBBB"], // 2024: 10 B, 2 L
  [2.4, "LLBLBBBBBLLL"], // 2025: 6 B, 6 L
  [4.2, "BLBLBLLLLLLL"], // 2026: 3 B, 9 L
];
let hilangBeku = false;
for (const [mulai, urutan] of GELOMBANG) {
  [...urutan].forEach((jenis, i) => {
    const t = mulai + i * 0.15;
    const f = v.tambah(pion());
    muncul(f, { t, durasi: 0.4, naik: 0 });
    const j = jalan(f, { t, jalur: jenis === "B" ? jalurB : jalurL, lengkung: true, laju: 3.6, bunyi: { kuat: 0.25 } });
    if (j.selesai) hilang(f, { t: j.selesai }); // B yang tiba di depan pintu langsung hilang; L hilang di ujung jalurnya
    else {
      // Figur yang masih berjalan saat dibekukan format (berhenti 6.6) memudar 6.6–7.0 dengan hilang standar. Penyimpangan dari
      // prompt G yang disetujui pengguna: figur beku menutupi teks keterangan Bagian 2 dan jejak abu. Hanya satu peristiwa bunyi
      // lembut untuk semuanya (kuat 0.3), supaya tidak jadi letupan.
      hilang(f, { t: 6.6, durasi: 0.4, bunyi: hilangBeku ? false : { kuat: 0.3 } });
      hilangBeku = true;
    }
    // Pengecualian zona (dilaporkan): figur L sengaja berjalan keluar layar di kiri sesudah melewati lapangan; figur beku
    // yang sedang memudar tidak dihitung dari 6.4, saat kamera mulai masuk ke gerbang (6.0–7.0) dan mendorongnya ke luar zona.
    const tLapangan = t + panjangJalur(jalurL.slice(0, 3), { lengkung: true }) / 3.6;
    const beku = !j.selesai;
    f.userData.penting = (tt) => !(jenis === "L" && tt > tLapangan) && !(beku && tt >= 6.4);
  });
}

// ---------------------------------------------------------------- 3. Bagian 2, sebab (6.0–13.0)
// Jejak abu 1–3: jalur figur L, digeser titik(0, -0.25), titik(0, 0), titik(0, 0.25), y 0.02. Garisnya sengaja menjalar keluar
// layar (kiri bawah), jadi tidak dihitung dalam pemeriksaan zona (dilaporkan).
const jejakAbu = [-0.25, 0, 0.25].map((geser, i) => {
  const j = v.tambah(garisPutus({ titik: jalurL.map((p) => p.clone().add(titik(0, geser)).setY(0.02)), lengkung: true, warna: W.abu, lebar: 3, nama: `jejak abu ${i + 1}` }));
  j.userData.penting = false;
  return j;
});

// Kartu tahun 1–3 di d.titik.atasGerbang + titik(-0.9 | 0 | 0.9, 0, 0.6), abu, masing-masing dengan tanda tanya di tengah mukanya,
// 0.02 di depan muka (muka menghadap kamera, normalnya arah BAWAH layar; tebal kartu 0.02, jadi pusat tanda tanya 0.03 dari pusat kartu).
const kartuTahun = [-0.9, 0, 0.9].map((r, i) => {
  const pusat = d.titik.atasGerbang.clone().add(titik(r, 0, 0.6));
  const kartu = v.tambah(kartuKecil({ rebah: false, miring: 0, simbol: null, nama: `kartu tahun ${i + 1}` }));
  kartu.position.copy(pusat).sub(titik(0, 0, TENGAH));
  const tanya = tandaTanya({ ukuran: 0.25, hadapKamera: false, tengah: true, nama: `tanda tanya ${i + 1}` });
  tanya.position.copy(titik(0, 0, TENGAH)).addScaledVector(titik(0, 1), 0.03);
  tanya.userData.bagian.badan.material.userData.abaikanKeadaan = true; // keadaan abu hanya untuk kartu, bukan tanda tanyanya
  kartu.add(tanya);
  return { kartu, pusat };
});
muncul(kartuTahun.map((k) => k.kartu), { t: 7.0, durasi: 0.4, jeda: 0.2 }); // 7.0–7.8 berurutan, jeda 0.2
// Label mikro di atas tiap kartu, masuk bersama kartunya, keluar 17.2–17.6. Jangkarnya titik pusat kartu (tetap), bukan kartunya,
// supaya label bertahan di tempatnya sesudah kartu menjadi grafik (13.4) sampai waktu keluarnya.
["2024", "2025", "2026"].forEach((tahun, i) => {
  label3D(tahun, { pada: kartuTahun[i].pusat, geser: [0, 0.55, 0], gaya: "mikro", masuk: [7.0 + i * 0.2, 7.4 + i * 0.2], keluar: [17.2, 17.6] });
});
catat({ t: 8.4, jenis: "gemuruh", kuat: 0.3, durasi: 2.0, posisi: gerbang }); // gemuruh pelan saat jejak memudar

// ---------------------------------------------------------------- 3. Bagian 3, Ikhtiar (13.0–23.0)
// 13.4–13.8: kartu tengah berubah menjadi grafik, kartu kiri dan kanan hilang bersamaan (tanda tanya ikut hilang bersama kartunya).
// gantiBenda sudah mencatat bunyi "kertas" di 13.4, jadi tidak ada catat kedua (akan berbunyi ganda).
const grafik = v.tambah(ikonGrafik({ tinggi: [1.0, 0.65, 0.35], skala: 1.3 }));
grafik.position.copy(d.titik.atasGerbang).add(titik(0, 0, 0.3));
gantiBenda(kartuTahun[1].kartu, grafik, { t: 13.4, durasi: 0.4, tempat: false });
hilang([kartuTahun[0].kartu, kartuTahun[2].kartu], { t: 13.4, durasi: 0.4 });
tumbuh(grafik.userData.bagian.batang, { t: 13.8, durasi: 0.3, sumbu: "y" }); // 13.8–14.7, 0.3 s per batang

// 17.6–18.4: papan peta muncul di lapangan (menghadap kamera: rotasi y 45° bawaan papanTulis) dan jejak zamrud tergambar ulang.
const papan = v.tambah(papanTulis({ lebar: 2.6, tinggi: 1.8, kaki: 1.0, kolom: ["BUTUH", "MINAT", "TANTANGAN"], baris: ["", "", ""] }));
papan.position.copy(d.titik.lapangan);
papan.updateMatrixWorld(true);
muncul(papan, { t: 17.6, durasi: 0.8 });
papan.userData.penting = (t) => t < 23.0; // dari 23.0 memudar bersama benda lain (segmenKuis) sementara kamera pindah ke terowongan

const jejakZamrud = [-0.25, 0, 0.25].map((geser, i) => {
  const j = v.tambah(garisPutus({ titik: jalurL.map((p) => p.clone().add(titik(0, geser)).setY(0.02)), lengkung: true, warna: W.zamrudPijar, lebar: 3, nama: `jejak zamrud ${i + 1}` }));
  j.userData.penting = false; // sama dengan jejak abu: menjalar keluar layar
  return j;
});

// 18.4–20.8: enam kartu alasan (zamrud) muncul di ujung jejak lalu meluncur ke sel papan (lintas 0.6 s), jeda 0.36 s.
// Tujuan [kolom, baris]: BUTUH, TANTANGAN, BUTUH, MINAT, TANTANGAN, BUTUH; menumpuk di sel dari bawah (baris 2) ke atas (baris 0).
const SKALA_ALASAN = 0.37; // kartu 0.6 × 0.8 terlalu besar untuk sel papan (0.67 × 0.33), jadi diskalakan agar muat di sel
const TUJUAN = [[0, 2], [2, 2], [0, 1], [1, 2], [2, 1], [0, 0]];
const turun = titik(0, 0, TENGAH * SKALA_ALASAN);
const awalAlasan = ujungL.clone().setY(0.35).sub(turun);
const kartuButuh = [];
TUJUAN.forEach(([kolom, baris], i) => {
  const t = 18.4 + i * 0.36;
  const kartu = v.tambah(kartuKecil({ rebah: false, miring: 0, simbol: "garis", warna: W.zamrud, skala: SKALA_ALASAN, nama: `kartu alasan ${i + 1}` }));
  kartu.position.copy(awalAlasan);
  const sel = papan.localToWorld(papan.userData.titikSel(kolom, baris)).sub(turun);
  kartu.userData.penting = (tt) => tt >= t + 0.6; // terbang masuk dari luar layar kiri; diperiksa sesudah mendarat
  muncul(kartu, { t, durasi: 0.4, naik: 0 });
  lintas(kartu, { t, durasi: 0.6, jalur: [awalAlasan, sel] });
  if (kolom === 0) kartuButuh.push(kartu);
});
klikEmas(kartuButuh, { t: 20.8 }); // ketiga kartu kolom BUTUH emas bersamaan

// 21.0–22.8: kartu kegiatan emas muncul di depan kolom BUTUH, melayang (busur 1.2) ke depan pintu komisariat, hilang di pintu 22.4.
const kartuKegiatan = v.tambah(kartuProker({ garis: 3, kaki: false, skala: 0.6 }));
kartuKegiatan.position.copy(papan.localToWorld(papan.userData.titikSel(0, 2))).add(titik(0, 0.9)).setY(0.55);
muncul(kartuKegiatan, { t: 21.0, durasi: 0.4, naik: 0 });
klikEmas(kartuKegiatan, { t: 21.0, durasi: 0.4 });
busur(kartuKegiatan, { t: 21.4, ke: d.titik.pintu.clone().setY(0.7), tinggi: 1.2, durasi: 1.0 });
hilang(kartuKegiatan, { t: 22.4 });

// ---------------------------------------------------------------- 4. keadaan yang berubah halus (disetel tiap frame tanpa syarat)
v.setiapFrame((t) => {
  // Komisariat abu penuh sejak awal; abu dilepas 22.0–22.8 (kartu kegiatan masuk), kembali zamrudRedup.
  setelKeadaan(komisariat, "abu", 1 - halus(rentang(t, 22.0, 22.8)));
  // Kartu tahun abu (tanda tanyanya tidak ikut abu).
  for (const { kartu } of kartuTahun) setelKeadaan(kartu, "abu", 1);
  // Jejak abu tergambar 6.6–7.6 lalu memudar ke opacity 0 pada 8.4–10.4; jejak zamrud tergambar ulang 17.6–18.4.
  for (const j of jejakAbu) {
    j.userData.aturTampak(halus(rentang(t, 6.6, 7.6)));
    aturOpasitas(j, 1 - halus(rentang(t, 8.4, 10.4)));
  }
  for (const j of jejakZamrud) j.userData.aturTampak(halus(rentang(t, 17.6, 18.4)));
});

// ---------------------------------------------------------------- 5. Bagian 4, Kuis (23.0–28.0): PALING AKHIR
const seg = segmenKuis(v, { komisariat, kelompok: "kaderisasi", mulai: 23.0 });

// ---------------------------------------------------------------- 6. kamera (bagian C; Bagian 5 naik sendiri ke H 15)
// Dua kunci tidak muat pada H brief (11), jadi memakai H terkecil yang lolos pemeriksaan zona (dilaporkan):
//   gejala   [gerbang, komisariat]: H 11 → 1327×799 px, H 12.5 (brief + 1.5) → 1168×704 px, zona 1080×840; lolos mulai H 13.52 (1079×651).
//   tambahan [papan, komisariat]:   H 11 → 1362×587 px, H 12.5 → 1198×516 px; H 13.86 masih 1080+ px (komisariat keluar kanan 1 px); lolos di H 13.9.
// sebab (H 8) dan ikhtiar (H 11) memakai nilai brief tanpa peringatan.
const H_GEJALA = 13.52, H_TAMBAHAN = 13.9;
jadwal = jadwalEvidence({
  fokus: d.fokus,
  gejala: { H: H_GEJALA, fokus: fokusUntuk([gerbang, komisariat], { H: H_GEJALA }) },
  sebab: { fokus: fokusUntuk([gerbang, kartuTahun[0].kartu, kartuTahun[2].kartu], { H: 8 }) },
  ikhtiar: { fokus: fokusUntuk([gerbang, grafik, papan], { H: 11 }) },
  tambahan: [{ t: [17.5, 18.5], H: H_TAMBAHAN, fokus: fokusUntuk([papan, komisariat], { H: H_TAMBAHAN }) }],
  kuis: { fokus: seg.fokus }, // kuis dan akhir: bawaan (H 14, lalu H 15)
});
