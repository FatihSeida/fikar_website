// animasi/proyek/indikator-03-v2: "Pola perkaderan tertinggal dari tuntutan abad ke-21."
// Video format evidence, 31 detik, 1080×1920 (Prompt Animasi Indikator 03, bagian A sampai K). Kit 1.3.2.
// Urutan panggilan: buatVideo → dunia (ruangLatihan langsung, tanpa duniaKader) → Bagian 1–3 → setiapFrame → akhiriEvidence (PALING AKHIR).
// Benda lokal: kotakCepat (benda-lokal.js). Semua gerak dihitung dari t (gerak standar kit); tidak ada Math.random, jam, atau CSS animasi.
import {
  buatVideo, formatEvidence, akhiriEvidence, titik, W, halus, rentang,
  ruangLatihan, papanTulis, jamDinding, kursiRendah, pion, rumah, garisWaktu, mejaKecil, buku, lapisanDebu, tanggaJenjang,
  kartuProker, garisPutus, pionPendamping, kartuKecil, lembarKertas,
  label3D, setelKeadaan,
  muncul, hilang, lintas, busur, gantiBenda, klikEmas, denyutCermin, debu, catat,
} from "../../kit/index.js";
import { kotakCepat } from "./benda-lokal.js";

// ---------------------------------------------------------------- 1. teks (bagian E, dipasang persis)
const v = buatVideo({
  format: formatEvidence({
    nomor: "03", kategori: "KADERISASI",
    judul: "Pola perkaderan tertinggal dari tuntutan abad ke-21.",
    mode: "ikhtiar",
    gejala: "",
    sebab: "Materi diwariskan apa adanya dari angkatan ke angkatan, **tanpa pernah ditinjau** dari hasil kadernya.",
    ikhtiar: [
      { teks: "**Sistem Kaderisasi Berkelanjutan** menyambungkan latihan dengan tindak lanjut, pendampingan, dan jenjang berikutnya.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] },
      { teks: "**Kurikulum Keterampilan Kader** menambah literasi data, teknologi, dan riset, lalu ditinjau dari penilaian peserta.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] },
    ],
    program: "Program 01 · Program 08",
    kuis: {
      pertanyaan: "Setelah LK 1, adakah agenda belajar lanjutan untuk kader baru di komisariatmu?",
      kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu.",
    },
    // ajakan, baca, dan sumber: bawaan format.
  }),
});

// Pembantu: Vector3 dari (x, y, z) dunia tanpa mengimpor three (titik() mengembalikan Vector3).
const V3 = (x, y, z) => titik(0, 0, 0).set(x, y, z);

// ---------------------------------------------------------------- 2. dunia (bagian F): ruangLatihan langsung, tanpa duniaKader
// Ruang digeser dari titik(0, 0.6) (prompt lama) ke titik(-0.4, 0.2) supaya komisariat muat di kanan bawah tanpa menyentuh lantai.
const ruang = v.tambah(ruangLatihan({ jendela: [{ dinding: "kanan", lebar: 1.6, tinggi: 1.0, geser: 1.2, bawah: 0.5 }] }));
ruang.position.copy(titik(-0.4, 0.2));
ruang.updateMatrixWorld(true);
const DINDING = ruang.userData.dinding;
const PL = ruang.position.clone().setY(ruang.position.y + ruang.userData.atas); // pusat permukaan lantai
const keDunia = (x, y, z) => ruang.localToWorld(V3(x, y, z));                   // titik lokal ruang → dunia

// Komisariat: titik(3.0, 3.0), di luar lantai ruang, skala 0.8, rotasi 0.
const komisariat = v.tambah(rumah());
komisariat.position.copy(titik(3.0, 3.0));
komisariat.scale.setScalar(0.8);

// Warna bintik debu: campuran dua token (kertas + abu), lebih terang daripada abu supaya bintik terbaca di atas papan dan sampul yang sudah abu.
// Dengan abu polos, bintik sama terang dengan permukaan dan tidak tampak sama sekali.
const WARNA_DEBU = W.kertas.clone().lerp(W.abu, 0.25);

// Papan tulis: menempel di dinding kiri, 0.08 ke dalam ruang, tepi bawah 0.45 di atas lantai.
const papan = v.tambah(papanTulis({ lebar: 2.8, tinggi: 1.2, kaki: 0, debu: true }));
papan.position.copy(ruang.localToWorld(DINDING.kiri.pusat.clone().add(V3(0.08, 0, 0))));
papan.position.y = PL.y + 0.45;
papan.rotation.y = DINDING.kiri.rotasiY;
papan.userData.bagian.debu.position.z += 0.03; // majukan bintik debu supaya tidak terbenam
papan.userData.bagian.debu.material.color.copy(WARNA_DEBU);
papan.userData.bagian.debu.renderOrder = 1; // digambar sesudah permukaan papan

// Jam dinding: di dinding kanan, 1.4 ke arah sudut belakang, 0.06 ke dalam ruang, titik asal 0.9 di atas lantai (pusat 1.25).
const jam = v.tambah(jamDinding({ radius: 0.35 }));
jam.position.copy(ruang.localToWorld(DINDING.kanan.pusat.clone().add(V3(-1.4, 0, 0.06))));
jam.position.y = PL.y + 0.9;
jam.rotation.y = DINDING.kanan.rotasiY;

// Enam kursi dan peserta: baris depan (dekat papan) lalu baris belakang. Pion duduk di titikDuduk kursi, menghadap papan (−x).
const TITIK_KURSI = [titik(0, -1.7), titik(-0.85, -0.85), titik(-1.7, 0), titik(0.99, -0.71), titik(0.14, 0.14), titik(-0.71, 0.99)];
const kursi = TITIK_KURSI.map((p, i) => {
  const k = v.tambah(kursiRendah({ nama: `kursi ${i + 1}` }));
  k.position.copy(PL).add(p);
  k.updateMatrixWorld(true);
  return k;
});
const peserta = kursi.map((k, i) => {
  const p = v.tambah(pion({ duduk: true, nama: `peserta ${i + 1}` }));
  p.position.copy(k.localToWorld(k.userData.titikDuduk.clone()));
  p.rotation.y = -Math.PI / 2;
  return p;
});

// Kotak cepat: delapan kotak berjalan di balik dinding kanan (z lokal −2.7), x lokal −2.6 → 2.6. k genap beralas 0.5, k ganjil 0.7
// di atas lantai, sehingga lewat di dalam bukaan jendela (0.5 sampai 1.5 di atas lantai).
const kotak = Array.from({ length: 8 }, (_, k) => v.tambah(kotakCepat({ nama: `kotak cepat ${k + 1}` })));

// ---------------------------------------------------------------- Bagian 2: benda
// Meja materi di antara papan dan baris depan peserta.
const meja = v.tambah(mejaKecil({ lebar: 1.0, tinggi: 0.6, dalam: 0.6 }));
meja.position.copy(PL).add(titik(-1.56, -1.56));
meja.rotation.y = Math.PI / 2;
meja.updateMatrixWorld(true);
const atasMeja = meja.position.clone().setY(meja.position.y + meja.userData.tinggiAtas);

// Garis waktu di lantai, sejajar layar; digeser (mendatar) sampai titikPeriode(1) jatuh di PL + titik(0.3, 1.0).
const garis = v.tambah(garisWaktu({ panjang: 5.4, jarak: 1.8, label: ["PERIODE 1", "PERIODE 2", "PERIODE 3"] }));
garis.position.copy(PL);
garis.updateMatrixWorld(true);
{
  const periode1 = garis.localToWorld(garis.userData.titikPeriode(1));
  const sasaran = PL.clone().add(titik(0.3, 1.0));
  garis.position.x += sasaran.x - periode1.x;
  garis.position.z += sasaran.z - periode1.z;
  garis.updateMatrixWorld(true);
}
const titikPeriode = (i) => garis.localToWorld(garis.userData.titikPeriode(i));

// Tiga pengajar menghadap kamera; titik pegang buku di depan masing-masing.
const pengajar = [0, 1, 2].map((i) => {
  const p = v.tambah(pion({ nama: `pengajar ${i + 1}` }));
  p.position.copy(titikPeriode(i)).add(titik(0, -0.4));
  p.position.y = PL.y;
  p.rotation.y = Math.PI / 4;
  return p;
});
const titikPegang = pengajar.map((p) => p.position.clone().add(titik(0, 0.3, 0.45)));

// Buku materi tertutup, berbaring, abu dan berdebu.
const bukuTutup = v.tambah(buku({ tinggi: 0.5, lebar: 0.4, tebal: 0.12, nama: "buku materi" }));
lapisanDebu(bukuTutup, { jumlah: 80, benih: 3, warna: WARNA_DEBU }).renderOrder = 1; // bintik transparan digambar sesudah sampul, kalau tidak tertimpa sampul
bukuTutup.position.copy(titikPegang[0]);

// ---------------------------------------------------------------- Bagian 3: benda
const tangga = v.tambah(tanggaJenjang());
tangga.position.copy(PL).add(titik(0.9, 1.3));
tangga.updateMatrixWorld(true);
const puncak = tangga.userData.puncak.map((p) => tangga.localToWorld(p.clone()));

const kartuLanjut = v.tambah(kartuProker({ garis: 3, kaki: true, skala: 0.5, warna: W.zamrud, nama: "kartu tindak lanjut" }));
kartuLanjut.position.copy(puncak[2]).add(titik(0.9, 0.3));
kartuLanjut.position.y = PL.y;

const garisSambung = v.tambah(garisPutus({
  titik: [...puncak.map((p) => p.clone().add(V3(0, 0.03, 0))), kartuLanjut.position.clone().add(V3(0, 0.55, 0))],
  lengkung: false, warna: W.zamrudPijar, lebar: 3, nama: "garis sambung",
}));

// Garis tepat di puncak tiap anak tangga + 0.03 menembus badan anak tangga berikutnya, sehingga dengan uji kedalaman hanya serpihan yang tampak.
// Tanpa uji kedalaman (titik tetap sesuai prompt) garis terbaca utuh dari LK 1 lewat LK 2 dan LK 3 ke kartu tindak lanjut.
garisSambung.traverse((o) => { if (o.material) { o.material.depthTest = false; o.renderOrder = 2; } });

const pendamping = v.tambah(pionPendamping({ nama: "pendamping" }));
pendamping.position.copy(kartuLanjut.position).add(titik(-0.55, 0.6));
pendamping.rotation.y = Math.PI / 4;

const bukuBuka = v.tambah(buku({ terbuka: true, tinggi: 0.5, lebar: 0.4, nama: "buku terbuka" }));
bukuBuka.position.copy(atasMeja); // tepat di posisi buku tertutup di atas meja
bukuBuka.updateMatrixWorld(true);
const halamanKanan = bukuBuka.userData.bagian.halaman[1].getWorldPosition(V3(0, 0, 0));

// Halaman baru 1–3: berbaring di atas halaman kanan buku terbuka, y + 0.012 × (k + 1) (ditambah tebal blok halaman 0.04
// supaya tidak terbenam di dalam blok halaman). Zamrud sebagai proses; menjadi emas bersama buku di 21.6.
const TEBAL_HALAMAN = 0.04;
const lembarBaru = [0, 1, 2].map((k) => {
  const l = v.tambah(lembarKertas({ lebar: 0.34, panjang: 0.44, garis: 3, warna: W.zamrud, warnaGaris: W.pelat, nama: `halaman baru ${k + 1}` }));
  l.position.copy(halamanKanan).add(V3(0, TEBAL_HALAMAN + 0.012 * (k + 1), 0));
  return l;
});

// Kartu penilaian 4, 5, 6 muncul di atas kepala peserta 4, 5, 6 (peserta + y 1.2).
const kartuNilai = [3, 4, 5].map((ip, k) => {
  const kartu = v.tambah(kartuKecil({ simbol: "centang", rebah: false, miring: 0, skala: 0.4, warna: W.zamrud, warnaSimbol: W.pelat, nama: `kartu penilaian ${k + 1}` }));
  kartu.position.copy(peserta[ip].position).add(V3(0, 1.2, 0));
  return kartu;
});

// Urutan gambar: bahan yang sedang memudar (peserta pudar 0.3, benda muncul/hilang) tidak menulis kedalaman, dan lantai ruang yang pernah
// muncul menjadi transparan serta diurutkan menurut titik asalnya. Peserta di sisi belakang lantai terurut sebelum lantai, jadi tertimpa
// lantai dan tidak tampak. Lantai dan dinding ruang digambar lebih dulu (renderOrder −1) supaya semua benda di atasnya tampak.
ruang.traverse((o) => { o.renderOrder = -1; });

// ---------------------------------------------------------------- pengecualian pemeriksaan zona (dilaporkan)
ruang.userData.penting = (t) => t < 6.0;
komisariat.userData.penting = (t) => t < 6.0;
for (const b of [...kursi, ...peserta]) b.userData.penting = (t) => t < 6.0 || t >= 17.5;
// Papan dan jam baru diperiksa dari 18.5: pada 17.5–18.5 kamera masih bergeser dari kunci ikhtiar (tangga, kartu, meja) ke kunci tambahan,
// dan di tengah geseran (18.0) tepi atas papan dan jam sempat melewati zona.
for (const b of [papan, jam]) b.userData.penting = (t) => t < 6.0 || t >= 18.5;

// ---------------------------------------------------------------- 3. Bagian 1, Gejala (0.6 sampai 6.0)
// 0.6–1.8: ruang, papan, jam, kursi, peserta, dan komisariat muncul berurutan.
muncul([ruang, papan, jam, ...kursi, ...peserta, komisariat], { t: 0.6, selesai: 1.8 });

// 1.8–6.0 (dan seterusnya): kotak cepat melintas di luar jendela. Kotak k muncul di 1.8 + 0.22k; lintasan ke-n mulai di 1.8 + 0.22k + 1.8n
// selama awalnya ≤ 20.8 (lintasan terakhir selesai sebelum 22.6). 3 unit per detik (5.2 unit dalam 1.73 detik), tidak ikut beku.
const jendela = keDunia(0.075 + 1.2, ruang.userData.atas + 1.1, -2.425); // pusat bukaan jendela (untuk posisi bunyi)
kotak.forEach((b, k) => {
  const y = ruang.userData.atas + (k % 2 === 0 ? 0.5 : 0.7);
  const awal = keDunia(-2.6, y, -2.7);
  const akhir = keDunia(2.6, y, -2.7);
  b.position.copy(awal);
  const t0 = 1.8 + 0.22 * k;
  muncul(b, { t: t0, durasi: 0.1, naik: 0, bunyi: false });
  for (let n = 0; t0 + 1.8 * n <= 20.8 + 1e-9; n++) {
    const t = t0 + 1.8 * n;
    lintas(b, { t, durasi: 1.73, jalur: [awal, akhir], kurva: (u) => u, beku: false, bunyi: false });
    // Bunyi: whoosh pelan hanya untuk kotak 0 sampai 12.6; kotak lain tanpa bunyi.
    if (k === 0 && t <= 12.6 + 1e-9) catat({ t, jenis: "whoosh", kuat: 0.2, durasi: 1.73, posisi: jendela, sumber: "dunia luar" });
  }
});

// 1.8–6.0: debu melayang naik di depan papan (0.5 ke dalam ruang dari pusat papan, 1.0 di atas lantai). Beku bawaan 6.0–6.6.
const pusatDebu = papan.position.clone().add(V3(0.5, 0, 0));
pusatDebu.y = PL.y + 1.0;
const debuPapan = debu({ pusat: pusatDebu, mulai: 1.8, selesai: 6.0, jumlah: 30, sebar: 0.9, naik: 0.8, benih: 3 });

// ---------------------------------------------------------------- 3. Bagian 2, sebab (6.0 sampai 13.0)
// 6.6–7.0: peserta dan kursi hilang bersamaan (turun 0), lantai lapang untuk garis waktu.
hilang([...kursi, ...peserta], { t: 6.6, durasi: 0.4, turun: 0 });
// 6.6–7.2: garis waktu dan meja muncul; tiga pengajar muncul berurutan (jeda 0.15).
muncul([garis, meja], { t: 6.6, durasi: 0.5, jeda: 0.1 });
muncul(pengajar, { t: 6.6, durasi: 0.3, jeda: 0.15 });
// 7.2–7.6: buku materi muncul di titikPegang1 (naik 0).
muncul(bukuTutup, { t: 7.2, durasi: 0.4, naik: 0 });
// 8.2–9.0, 9.8–10.6, 11.2–12.0: buku dioper ke pengajar 2, pengajar 3, lalu diletakkan di atas meja.
busur(bukuTutup, { t: 8.2, dari: titikPegang[0], ke: titikPegang[1], tinggi: 0.6, durasi: 0.8 });
busur(bukuTutup, { t: 9.8, dari: titikPegang[1], ke: titikPegang[2], tinggi: 0.6, durasi: 0.8 });
busur(bukuTutup, { t: 11.2, dari: titikPegang[2], ke: atasMeja, tinggi: 0.5, durasi: 0.8 });
// Pengajar yang periodenya selesai hilang: 1 di 9.2, 2 di 10.8, 3 di 12.2.
hilang(pengajar[0], { t: 9.2 });
hilang(pengajar[1], { t: 10.8 });
hilang(pengajar[2], { t: 12.2 });
// 11.6–12.9: buku berdenyut zamrud (satu-satunya titik masalah). Tidak ada emas di Bagian 2.
denyutCermin(bukuTutup, { mulai: 11.6, selesai: 12.9 });
catat({ t: 12.0, jenis: "debu", kuat: 0.5, posisi: bukuTutup, sumber: "debu buku" }); // buku mendarat di meja dengan debu tebal

// ---------------------------------------------------------------- 3. Bagian 3, Ikhtiar (13.0 sampai 23.0)
hilang(garis, { t: 13.0, durasi: 0.4 });                          // 13.0–13.4, labelnya ikut
muncul(tangga, { t: 13.4, durasi: 0.5 });                         // 13.4–13.9, label LK 1–3 ikut
muncul(kartuLanjut, { t: 14.0, durasi: 0.4 });                    // 14.0–14.4
catat({ t: 14.4, jenis: "garis-sambung", durasi: 1.0, posisi: tangga, posisiAkhir: kartuLanjut, sumber: "garis sambung" });
muncul(pendamping, { t: 15.4, durasi: 0.5 });                     // 15.4–15.9

// 17.6–18.1: kursi dan peserta yang sama muncul kembali di tempat semula (jeda 0.04, pasangan kursi + peserta).
kursi.forEach((k, i) => muncul([k, peserta[i]], { t: 17.6 + 0.04 * i, durasi: 0.3, jeda: 0 }));
// 18.2–18.6: buku tertutup berubah menjadi buku terbuka (debu ikut hilang bersama buku tertutup).
gantiBenda(bukuTutup, bukuBuka, { t: 18.2, durasi: 0.4, tempat: false });
// 18.6–19.2: tiga kartu penilaian muncul di atas kepala peserta 4, 5, 6.
// 19.0–20.2: kartu k terbang ke buku (busur 0.6 s, tinggi 0.8), tiba 19.6, 19.9, 20.2, lalu berubah menjadi halaman baru k.
const NAMA_LABEL = ["DATA", "TEKNOLOGI", "RISET"];
kartuNilai.forEach((kartu, k) => {
  muncul(kartu, { t: 18.6 + 0.3 * k, durasi: 0.3, naik: 0.2 });
  busur(kartu, { t: 19.0 + 0.3 * k, ke: lembarBaru[k].position.clone(), tinggi: 0.8, durasi: 0.6 });
  const tTiba = 19.6 + 0.3 * k;
  gantiBenda(kartu, lembarBaru[k], { t: tTiba, durasi: 0.3, tempat: false });
  // Label mikro zamrud di atas halaman baru k: masuk 0.1–0.4 detik sesudah halamannya muncul, keluar 22.6–23.0.
  const tMuncul = tTiba + 0.4 * 0.3;
  label3D(NAMA_LABEL[k], {
    pada: lembarBaru[k], geser: [0, 0.35 + 0.22 * k, 0], gaya: "mikro", kelas: "zamrud",
    masuk: [tMuncul + 0.1, tMuncul + 0.4], keluar: [22.6, 23.0],
  });
});
// 21.6: buku terbuka dan ketiga halaman baru klikEmas bersamaan. Satu-satunya rantai emas.
klikEmas([bukuBuka, ...lembarBaru], { t: 21.6 });
catat({ t: 20.6, jenis: "denting", kuat: 0.4, posisi: jam, sumber: "jam" }); // jam mulai berjalan

// ---------------------------------------------------------------- 4. keadaan yang berubah halus (disetel tiap frame tanpa syarat)
v.setiapFrame((t) => {
  // Komisariat abu penuh sampai 23.0; dilepas oleh akhiriEvidence.
  setelKeadaan(komisariat, "abu", 1);
  // Peserta sedikit pudar (0.6–6.6); pudar 0 saat muncul kembali (17.6).
  const pudar = 0.3 * (1 - halus(rentang(t, 17.0, 17.6)));
  for (const p of peserta) setelKeadaan(p, "pudar", pudar);
  // Papan dan jam abu penuh; papan berdebu penuh. 20.4–21.2 papan melepas abu dan debunya, 20.4–21.0 jam melepas abu.
  const papanBersih = halus(rentang(t, 20.4, 21.2));
  setelKeadaan(papan, "abu", 1 - papanBersih);
  papan.userData.aturDebu(1 - papanBersih);
  setelKeadaan(jam, "abu", 1 - halus(rentang(t, 20.4, 21.0)));
  // Jarum jam diam di 10.10; 20.6–22.4 jarum menit berputar satu putaran.
  jam.userData.aturJarum(10, 10 + 60 * halus(rentang(t, 20.6, 22.4)));
  // Butir debu yang membeku di udara (6.6) ikut hilang bersama debu papan.
  for (const m of debuPapan.children) m.material.opacity *= 1 - papanBersih;
  // Buku tertutup abu penuh dan makin berdebu: 0.15 → 0.45 (9.0–9.4) → 0.7 (10.6–11.0) → 0.95 (12.0–12.4).
  setelKeadaan(bukuTutup, "abu", 1);
  bukuTutup.userData.aturDebu(0.15 + 0.30 * halus(rentang(t, 9.0, 9.4)) + 0.25 * halus(rentang(t, 10.6, 11.0)) + 0.25 * halus(rentang(t, 12.0, 12.4)));
  // 14.4–15.4: garis sambung tergambar dari LK 1 ke kartu tindak lanjut.
  garisSambung.userData.aturTampak(halus(rentang(t, 14.4, 15.4)));
});

// ---------------------------------------------------------------- 5. Bagian 4–5 dan kamera: SATU panggilan, PALING AKHIR
akhiriEvidence(v, {
  komisariat,
  kamera: {
    fokus: titik(0.4, 0.8, 0.8),
    gejala: { muat: [ruang, komisariat], margin: 20 },
    sebab: { muat: [meja, garis, pengajar[0], pengajar[2], titikPegang[0], titikPegang[2]], H: 9 },
    ikhtiar: { muat: [tangga, kartuLanjut, pendamping, meja], H: 11 },
    // Tangga, kartu tindak lanjut, dan pendamping tetap tampak sesudah 17.5, jadi ikut dimuat (di luar daftar prompt) supaya tidak terpotong tepi kanan.
    tambahan: [{ t: [17.5, 18.5], muat: [meja, papan, jam, peserta[0], peserta[5], tangga, kartuLanjut, pendamping], H: 11 }],
  },
});
