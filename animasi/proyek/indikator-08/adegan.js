// animasi/indikator-08: "Manajemen organisasi lemah dan tertinggal dari kebutuhan kontemporer."
// Video format indikator, 21 detik, 1080×1920. Dunia Rencana mode rapat (kit) + ponsel, kertas tugas, dan centang.
// Penyimpangan dari brief ditandai "Brief:".
import * as THREE from "three";
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, W, KANAN, BAWAH, halus, rentang, pegas, waktuBeku, acak,
  duniaRencana, ponselKecil, centang, label3D, setelKeadaan, catat, muncul, klikEmas, denyutCermin,
} from "../../kit/index.js";
import { kertasTugas, nasibKertas } from "./benda-lokal.js";

// ---------------------------------------------------------------- teks (bagian E brief)
let jadwal = null;
const v = buatVideo({
  format: formatIndikator({
    nomor: "08", total: 44, kategori: "TATA KELOLA",
    judul: "Manajemen organisasi lemah dan tertinggal dari kebutuhan kontemporer.",
    cermin: "Tugas, jadwal, dan keuangan kita tercatat di satu tempat?",
    langkah: "Satu dokumen bersama, ditinjau di setiap rapat harian.",
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- dunia (bagian F brief)
// Dunia Rencana tanpa lintasan dan bendera = mode rapat: meja bundar di titik(0, 0.6) dengan 5 pengurus berdiri.
// papanBersama = papan kit dengan kolom TUGAS / TENGGAT / PJ dan 4 baris garis (12 sel untuk 12 kertas), berdebu.
// Brief: papan di titik(-1.6, -3.2) kaki 1.0; kit memakai titik(-1.6, -2.6) kaki 0.4 supaya puncaknya masuk zona atas.
// Label kolom ikut skala kamera (16 / H): pada H 21 (kartu akhir) kolom hanya ±108 px, jadi label 22 px tetap akan saling menempel.
const ikutKamera = () => 16 / v.rig.keadaan.H;
const d = duniaRencana(v, { rapat: true, opsi: { papan: { kolom: ["TUGAS", "TENGGAT", "PJ"], baris: 4, debu: true, opsiLabel: { skala: ikutKamera } } } });
const { papan, meja } = d.benda;
const pengurus = [1, 2, 3, 4, 5].map((i) => d.benda[`pengurus${i}`]);
const PUSAT = meja.position.clone();
const radial = (a) => titik(Math.cos(a), Math.sin(a)); // arah dunia dari sudut (r, d)
const sudutPengurus = (i) => Math.PI / 2 + (i * 2 * Math.PI) / 5;

// ponsel1..5: ponselKecil berdiri di meja, di depan tiap pengurus (radius 0.95 dari pusat meja).
const R_PONSEL = 0.95;
const ponsel = pengurus.map((_, i) => {
  const p = v.tambah(ponselKecil({ nama: `ponsel ${i + 1}` }));
  p.position.copy(PUSAT).addScaledVector(radial(sudutPengurus(i)), R_PONSEL).setY(meja.userData.tinggiAtas);
  return p;
});

// ---------------------------------------------------------------- kamera (bagian C)
// Brief: awal titik(0, 0); kit titik(0, 0, 0.8). Di sini titik(-0.4, -0.7, 0.8): papan, meja, dan kertas terpusat di zona
// (dengan titik kit papan menempel di tepi atas zona dan 190 px kosong di bawah meja).
// Cermin: fokus papan (H 12) digeser ke bawah dan 0.4 unit ke kanan, supaya meja dan pengurus tidak menimpa keterangan bawah
// dan pengurus kanan tidak terpotong tepi layar; papan tetap utuh di zona.
jadwal = jadwalIndikator({
  fokus: titik(-0.4, -0.7, 0.8),
  cermin: { fokus: d.titik.papan.clone().add(titik(0.4, 0)).setY(0.15), H: 12 },
  langkah: { fokus: titik(-0.8, -1.2, 0.8) },
});

// Selama zoom Cermin (H 12) meja, pengurus, ponsel, dan kertas memang terpotong tepi bawah.
const bukanCermin = (t) => !(t > 6.0 && t < 13.0);
for (const b of [meja, ...pengurus, ...ponsel]) b.userData.penting = bukanCermin;

// ---------------------------------------------------------------- kertas tugas (12 buah di 5 ponsel: 3, 3, 2, 2, 2)
const S_APUNG = 0.75, S_PAPAN = 0.46;
const JUMLAH = [3, 3, 2, 2, 2];
const daftar = []; // urutan muncul: putaran 1 = kertas pertama tiap ponsel, putaran 2 = kedua, putaran 3 = ketiga
for (let k = 0; k < 3; k++) JUMLAH.forEach((n, i) => { if (k < n) daftar.push({ i, k }); });
const T_MUNCUL = [1.6, 4.0], D_MUNCUL = 0.5;
const jedaMuncul = (T_MUNCUL[1] - D_MUNCUL - T_MUNCUL[0]) / (daftar.length - 1); // yang terakhir selesai tepat 4.0

// Empat kertas jatuh melewati tepi meja di celah antarpengurus (sudut 36° dari ponselnya), supaya tidak menembus figur.
const JATUH = [
  { i: 0, k: 0, celah: 126, t: 4.0, putar: 1.3 },
  { i: 4, k: 0, celah: 54, t: 4.4, putar: -1.1 },
  { i: 1, k: 0, celah: 198, t: 4.8, putar: 1.5 },
  { i: 3, k: 0, celah: 342, t: 5.2, putar: -1.4 },
];
const D_JATUH = 0.8; // yang terakhir tiba di bawah tanah tepat 6.0, sebelum gerak melambat
const R_JATUH = 1.62;
const jatuhDari = (e) => JATUH.find((j) => j.i === e.i && j.k === e.k) ?? null;

// Penerbangan ke papan (12.4–14.2, jeda 0.1 s): yang tetap di udara berangkat dulu, empat yang jatuh menyusul dan muncul
// kembali 0.55 s sebelum berangkat. Sel diisi baris demi baris dari kiri atas.
const tetap = daftar.map((e, idx) => ({ ...e, idx })).filter((e) => !jatuhDari(e));
const hilang = daftar.map((e, idx) => ({ ...e, idx })).filter((e) => jatuhDari(e));
const urutanTerbang = [...tetap, ...hilang];
const T_TERBANG = 12.4, JEDA_TERBANG = 0.1, D_TERBANG = 0.7;

const T_EMAS = 14.2;
const EMISIF_PAPAN = 0.3;
const LONJAK = 0.25; // klikEmas papan: skala 1.25 → 1 dengan pegas; kertas di papan ikut berdenyut bersamanya
const denyutPapan = (t) => (t >= T_EMAS && t < T_EMAS + 0.7 ? 1 + LONJAK * pegas(t - T_EMAS) : 1);

const jam = waktuBeku(...v.beku); // gerak acak kertas melambat 6.0 dan berhenti 6.6
papan.updateMatrixWorld(true);
const kertas = [];
const rAcak = acak(808);
daftar.forEach((e, idx) => {
  const g = v.tambah(kertasTugas({ nama: `kertas tugas ${idx + 1}`, skala: S_APUNG }));
  const telepon = ponsel[e.i].position;
  const rumah = telepon.clone().setY(1.6 + 0.5 * e.k)
    .addScaledVector(KANAN, (rAcak() - 0.5) * 0.5).addScaledVector(BAWAH, (rAcak() - 0.5) * 0.5);
  const asal = telepon.clone().setY(meja.userData.tinggiAtas + 0.55);
  const j = jatuhDari(e);
  const n = urutanTerbang.findIndex((x) => x.idx === idx);
  const tTerbang = T_TERBANG + JEDA_TERBANG * n;
  const sel = papan.userData.titikSel(n % 3, Math.floor(n / 3)).clone();
  sel.z += 0.012; // di depan garis papan
  const ke = papan.localToWorld(sel);
  const tMuncul = T_MUNCUL[0] + idx * jedaMuncul;
  const nasib = nasibKertas(g, {
    jam, asal, rumah, benih: 100 + idx, tMuncul, dMuncul: D_MUNCUL,
    jatuh: j && { t: j.t, durasi: D_JATUH, lewat: PUSAT.clone().addScaledVector(radial((j.celah * Math.PI) / 180), R_JATUH), putar: j.putar },
    kembali: j ? { t: tTerbang - 0.55 } : null,
    terbang: { t: tTerbang, durasi: D_TERBANG }, ke,
    skalaApung: S_APUNG, skalaPapan: S_PAPAN, pusatPapan: papan.position, skalaPapanFn: denyutPapan,
  });
  g.userData.penting = bukanCermin;
  kertas.push({ g, j, tTerbang, tMuncul, n, tTiba: nasib.tTiba });

  // Bunyi: desir saat muncul dari ponsel; nada turun saat jatuh; muncul saat kembali; whoosh tiap baris; desir saat menempel.
  catat({ t: tMuncul, jenis: "kertas", kuat: 0.4, posisi: g, sumber: g.userData.nama });
  if (j) {
    catat({ t: j.t + 0.05, jenis: "hilang", kuat: 0.5, posisi: g, sumber: g.userData.nama });
    catat({ t: tTerbang - 0.55, jenis: "muncul", kuat: 0.45, posisi: g, sumber: g.userData.nama });
  }
  if (n % 3 === 0) catat({ t: tTerbang, jenis: "whoosh", durasi: D_TERBANG, kuat: 0.3, posisi: g, posisiAkhir: g, sumber: g.userData.nama });
  catat({ t: nasib.tTiba - 0.05, jenis: "kertas", kuat: 0.3, nada: n, posisi: g, sumber: `${g.userData.nama} menempel` });
});

// ---------------------------------------------------------------- Bagian 1, Gejala (0.6–6.0)
// 0.6–1.6: papan, meja, pengurus, dan ponsel muncul berurutan; yang terakhir selesai tepat 1.6.
muncul([...d.urutan, ...ponsel], { t: 0.6, selesai: 1.6 });
// 4.0–6.0: papan menjadi kosong dan kusam (abu, berdebu) saat kertas hilang; empat kertas jatuh (lihat nasibKertas).
catat({ t: 4.0, jenis: "padam", kuat: 0.4, posisi: papan, sumber: "papan" });

// ---------------------------------------------------------------- Bagian 2, Cermin (6.0–12.0)
denyutCermin(papan, { mulai: 7.0, selesai: 11.8 });

// ---------------------------------------------------------------- Bagian 3, Langkah (12.0–18.0)
// 12.4–14.2: kertas terbang ke papan (lihat nasibKertas). 14.2–15.0: papan berubah emas, klik emas.
klikEmas(papan, { t: T_EMAS, lonjak: LONJAK });

// 15.0–17.6: tanda waktu "RAPAT HARIAN" muncul empat kali di atas meja; tiap kali satu centang bertambah di papan.
const T_RAPAT = [15.0, 15.6, 16.2, 16.8];
const AKHIR_RAPAT = 17.6;
const aktifRapat = (t) => T_RAPAT.reduce((a, t0, i) => (t >= t0 ? i : a), -1);
const akhirPuls = (i) => (i === T_RAPAT.length - 1 ? AKHIR_RAPAT : T_RAPAT[i] + 0.5);
// Brief: di atas meja. Tepat di atas pusat meja label menimpa kaki papan dan kepala pengurus belakang, jadi diletakkan di atas
// sisi kanan meja (di kanan papan, di atas pengurus kanan belakang).
const TITIK_RAPAT = PUSAT.clone().add(titik(1.7, 0)).setY(2.5);
label3D("RAPAT HARIAN", {
  pada: TITIK_RAPAT, gaya: "kotak", kelas: "zamrud",
  opasitas(t) {
    const i = aktifRapat(t);
    if (i < 0) return 0;
    return halus(rentang(t, T_RAPAT[i], T_RAPAT[i] + 0.1)) * (1 - halus(rentang(t, akhirPuls(i) - 0.15, akhirPuls(i))));
  },
  skala(t) {
    const i = aktifRapat(t);
    return i < 0 ? 1 : 0.88 + 0.12 * halus(rentang(t, T_RAPAT[i], T_RAPAT[i] + 0.2));
  },
});
// Centang di ujung kanan tiap baris papan (baris 1 sampai 4, dari atas).
const centangPapan = T_RAPAT.map((t0, rr) => {
  const c = v.tambah(centang({ ukuran: 0.34, hadapKamera: false, tengah: true, nama: `centang ${rr + 1}` }));
  const lokal = papan.userData.titikSel(2, rr).clone();
  lokal.x = 1.56; lokal.z = 0.075;
  c.position.copy(papan.localToWorld(lokal));
  muncul(c, { t: t0 + 0.12, durasi: 0.28, naik: 0, skala: 0.4, bunyi: false });
  catat({ t: t0, jenis: "denting", kuat: 0.4, nada: rr, posisi: TITIK_RAPAT, sumber: "rapat harian" });
  catat({ t: t0 + 0.12, jenis: "centang", kuat: 0.55, nada: rr, posisi: c, sumber: c.userData.nama });
  return c;
});

// ---------------------------------------------------------------- keadaan per frame (tanpa syarat)
papan.userData.bagian.permukaan.material.userData.warnaAbu = W.abuGelap; // permukaan kusam gelap, bingkai abu
// Bintik debu bawaan papan terbenam di permukaan (offset 0.004 hilang oleh presisi depth): majukan ke depan garis papan.
papan.userData.bagian.debu.position.z += 0.03;
v.setiapFrame((t) => {
  // Papan: kusam dan berdebu 4.0–5.2, pulih sambil terisi 12.4–14.2 (lalu emas lewat klikEmas).
  const kusam = halus(rentang(t, 4.0, 5.2)) * (1 - halus(rentang(t, T_TERBANG, T_EMAS)));
  setelKeadaan(papan, "abu", kusam);
  papan.userData.aturDebu(kusam);
  // Kertas yang tetap di udara menjadi abu 4.0–5.0 dan pulih ke warna kertas saat berangkat; yang jatuh tidak.
  for (const { g, j, tTerbang, tTiba } of kertas) {
    setelKeadaan(g, "abu", j ? 0 : halus(rentang(t, 4.0, 5.0)) * (1 - halus(rentang(t, tTerbang, tTerbang + 0.35))));
    // Kertas tegak di papan menghadap cahaya miring dan tampak kelabu: emissive kertas lemah (luminans total ±0.5, di bawah
    // ambang bloom 0.74) menaikkan terangnya, hanya setelah mendarat (sudutnya sudah tegak).
    const bahan = g.userData.bagian.kartu.userData.bagian.badan.material;
    bahan.emissive.copy(W.kertas);
    bahan.emissiveIntensity = EMISIF_PAPAN * halus(rentang(t, tTiba - 0.2, tTiba));
  }
});

