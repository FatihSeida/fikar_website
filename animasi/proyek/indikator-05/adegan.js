// animasi/indikator-05: "Sebagian aparat organisasi, seperti Badko, kurang berfungsi."
// Video format indikator, 21 detik, 1080×1920. Dunia Jenjang kit; jembatan cabang → badko retak.
import * as THREE from "three";
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, DEG, halus, rentang, masukKeluar3, pegas,
  duniaJenjang, lembarKertas, amplop, label3D, setelKeadaan, daftarkan, catat,
  muncul, hilang, klikEmas, denyutCermin, aliran,
} from "../../kit/index.js";
import { jamLanjut, aliranTersendat } from "./lokal.js";

// ---------------------------------------------------------------- teks (bagian E brief)
let jadwal = null;
const v = buatVideo({
  format: formatIndikator({
    nomor: "05", total: 44, kategori: "TATA KELOLA",
    judul: "Sebagian aparat organisasi, seperti Badko, kurang berfungsi.",
    cermin: "Dukungan apa yang seharusnya mengalir, dan mana yang benar-benar berjalan?",
    langkah: "Petakan kewenangan setiap jenjang, sampaikan lewat forum resmi.",
    ajakan: "ahmadzulfikar.com/kuis",
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- dunia (bagian F brief)
// Tata letak Dunia Jenjang kit (posisi prompt membuat PB dan badko keluar zona; lihat docs/dunia-kader-jenjang-simpul.md).
const d = duniaJenjang(v, {
  posisi: { cabang: titik(-2.85, -1.0) }, // cabang mundur 1.1: jembatan cabang → badko 1.6× lebih panjang di layar
  opsi: { jembatanCabang: { retak: true } },
});
const { badko, pb, jembatanCabang } = d.benda;
v.scene.updateMatrixWorld();

// Kamera C.6: fokus dunia; Cermin ke menara badko (y 1.5, tinggi 12); Langkah kembali ke fokus dunia.
jadwal = jadwalIndikator({
  fokus: d.fokus,
  cermin: { fokus: badko.position.clone().setY(1.5), H: 12 },
});

// Waktu bersama
const T = {
  muncul: 0.6, aliran: 2.0, sendat: 3.4, abu: [3.9, 4.7],
  lembar: 12.4, tanda: 13.8, lipat: 14.8, kirim: [15.1, 15.7], tempel: 15.7,
  tutup: [15.8, 16.1], emas: 16.1, pulih: [16.1, 16.9],
};

// ---------------------------------------------------------------- Bagian 1, Gejala (0.6–6.0)
// Semua bangunan dan jembatan muncul berurutan dari komisariat ke PB, selesai tepat t 2.0 (11 benda, jeda 0.09).
muncul(d.urutan, { t: T.muncul, jeda: 0.09 });
// Nama jenjang di atas puncak (tambahan, bukan dari brief): penonton perlu tahu menara mana yang Badko. Komisariat
// tidak diberi label karena di atas atapnya tidak ada latar kosong (gedung cabang di belakangnya).
const LABEL_JENJANG = { cabang: "CABANG", badko: "BADKO", pb: "PB" };
for (const [n, teks] of Object.entries(LABEL_JENJANG)) {
  const b = d.benda[n];
  const tMasuk = T.muncul + d.urutan.indexOf(b) * 0.09 + 0.3;
  label3D(teks, { pada: b, geser: [0, d.titik.atas[n].y + 0.3, 0], masuk: [tMasuk, tMasuk + 0.4], keluar: [17.6, 18.0] });
}

// Aliran komisariat → cabang (lancar). Jam sendiri: membeku 6.0–6.6 seperti format, lalu berjalan lagi saat celah
// tertutup, sehingga bola hijau yang tertahan selama Cermin masuk ke cabang dan habis.
const jamB1 = jamLanjut({ lanjut: T.tutup[0] });
["komisariat1", "komisariat2", "komisariat3"].forEach((n, i) => aliran({
  jalur: d.jalur(n, "cabang"), mulai: T.aliran + i * 0.1, selesai: 6.0, jam: jamB1, bunyi: false,
}));
// Bunyi aliran sampai gerak berhenti (6.6), bukan sampai bola terakhir tiba.
catat({ t: T.aliran, jenis: "aliran", durasi: 6.6 - T.aliran, kuat: 0.6, posisi: d.titik.jalurJembatan.jembatanKomisariat2[0], posisiAkhir: d.titik.jalurJembatan.jembatanKomisariat2[1], sumber: "aliran komisariat" });

// Aliran cabang → badko yang berhenti di celah retak: bola menumpuk lalu meredup abu. Tidak ada aliran badko → PB.
const jalurSendat = d.jalur("cabang", "badko", "pb");
const panjangCabang = d.titik.jalurJembatan.jembatanCabang[0].distanceTo(d.titik.jalurJembatan.jembatanCabang[1]);
const sendat = aliranTersendat(v, {
  jalur: jalurSendat, sTahan: panjangCabang / 2 - 0.15 - 0.08, mulai: T.sendat, jam: jamB1,
  lanjut: T.emas,
});
catat({ t: T.sendat, jenis: "aliran", durasi: sendat.tiba[0] - T.sendat + 0.2, kuat: 0.5, posisi: d.titik.jalurJembatan.jembatanCabang[0], posisiAkhir: d.titik.retak, sumber: "aliran cabang" });
sendat.tiba.forEach((t, i) => catat({ t, jenis: i === 0 ? "retak" : "kayu", kuat: i === 0 ? 0.6 : 0.3, nada: -i, posisi: d.titik.retak, sumber: "tumpukan" }));
catat({ t: T.abu[0], jenis: "padam", kuat: 0.7, posisi: badko, sumber: "badko" });

// ---------------------------------------------------------------- Bagian 2, Cermin (6.0–12.0)
denyutCermin([badko, jembatanCabang], { mulai: 7.0, selesai: 11.8 });

// ---------------------------------------------------------------- Bagian 3, Langkah (12.0–18.0)
// Halaman tugas melayang di samping komisariat1, cabang, badko, PB (titik samping Dunia Jenjang).
const PEMILIK = ["komisariat1", "cabang", "badko", "pb"];
const halaman = PEMILIK.map((n, i) => {
  const luar = new THREE.Group();
  luar.position.copy(d.titik.samping[n]).add(new THREE.Vector3(0, -0.5, 0));
  luar.userData = { nama: `halaman ${n}`, penting: true };
  const ayun = new THREE.Group();
  const lembar = lembarKertas({ rebah: false, nama: `halaman ${n}`, benih: 3 + i });
  ayun.add(lembar);
  luar.add(ayun);
  v.tambah(luar);
  return { n, luar, ayun, lembar };
});
muncul(halaman.map((h) => h.luar), { t: T.lembar, jeda: 0.3, bunyi: { jenis: "kertas" } });

// Tanda status di tiap halaman: BERJALAN (zamrud terang) atau TERSENDAT (abu).
halaman.forEach((h, i) => {
  const tersendat = h.n === "badko";
  label3D(tersendat ? "TERSENDAT" : "BERJALAN", {
    pada: h.lembar.userData.bagian.badan, geser: [0, -0.18, 0], gaya: "kotak", kelas: tersendat ? "tanda tersendat" : "tanda berjalan",
    ax: 0.5, ay: 0.5, masuk: [T.tanda + i * 0.25, T.tanda + i * 0.25 + 0.3], keluar: tersendat ? [T.lipat + 0.05, T.lipat + 0.18] : null,
  });
  catat({ t: T.tanda + i * 0.25, jenis: tersendat ? "padam" : "label-ganti", kuat: tersendat ? 0.5 : 0.6, nada: i, posisi: h.lembar, sumber: `tanda ${h.n}` });
});

// Halaman badko terlipat menjadi amplop kecil, menyusuri jembatan badko → PB, lalu menempel di dinding PB (muka +z).
const hb = halaman[2];
daftarkan(hb.luar, "efek", {
  mulai: T.lipat,
  hitung(t, acc) { acc.skala.y *= 1 - 0.53 * masukKeluar3(rentang(t, T.lipat, T.lipat + 0.25)); },
});
hilang(hb.luar, { t: T.lipat + 0.2, durasi: 0.12, turun: 0, bunyi: false });
catat({ t: T.lipat, jenis: "kertas", kuat: 0.6, posisi: hb.luar, sumber: "lipat" });

const amp = amplop({ skala: 0.5, miring: 0, nama: "amplop badko" });
const ampLuar = new THREE.Group();
ampLuar.add(amp);
ampLuar.userData = { nama: "amplop badko", penting: true };
v.tambah(ampLuar);
ampLuar.position.copy(hb.luar.position);
// Lintasan: dari halaman badko turun ke atas jembatan badko → PB, menyusurinya, memutari sudut kiri PB, lalu ke dinding.
const [jb0, jb1] = d.titik.jalurJembatan.jembatanBadko;
const kotakPB = new THREE.Box3().setFromObject(pb.userData.bagian.badan?.[0] ?? pb);
const NEMPEL = new THREE.Vector3(kotakPB.min.x + 0.55, 1.15, kotakPB.max.z + 0.03);
const lintasan = new THREE.CatmullRomCurve3([
  hb.luar.position.clone(),
  jb0.clone().lerp(jb1, 0.08).setY(0.4),
  jb0.clone().lerp(jb1, 0.7).setY(0.4),
  new THREE.Vector3(kotakPB.min.x - 0.2, 0.7, kotakPB.max.z + 0.25),
  NEMPEL,
], false, "centripetal");
daftarkan(ampLuar, "posisi", {
  mulai: T.kirim[0],
  sebelum: (acc) => { acc.posisi = acc._pos.copy(hb.luar.position); },
  hitung(t, acc) {
    const u = masukKeluar3(rentang(t, T.kirim[0], T.kirim[1]));
    acc.posisi = lintasan.getPointAt(u, acc._pos);
    acc.putar.y -= 45 * DEG * halus(rentang(u, 0.6, 1)); // menghadap +z: rata dengan dinding PB
  },
});
muncul(ampLuar, { t: T.lipat + 0.15, durasi: 0.2, naik: 0, skala: 0.9, bunyi: false });
daftarkan(ampLuar, "efek", { mulai: T.tempel, hitung(t, acc) { acc.skala.multiplyScalar(1 + 0.15 * pegas(t - T.tempel)); } });
catat({ t: T.kirim[0], jenis: "whoosh", durasi: T.kirim[1] - T.kirim[0], kuat: 0.55, posisi: ampLuar, posisiAkhir: ampLuar, sumber: "amplop" });
catat({ t: T.tempel, jenis: "cap", kuat: 0.45, posisi: ampLuar, sumber: "amplop" });

// Celah retak tertutup, jembatan cabang → badko utuh lalu emas; aliran kembali dari komisariat sampai PB.
catat({ t: T.tutup[0], jenis: "tumbuh", durasi: T.tutup[1] - T.tutup[0], kuat: 0.6, posisi: d.titik.retak, sumber: "celah" });
klikEmas(jembatanCabang, { t: T.emas });
// Semua ruas berjalan serentak (satu aliran dari komisariat1 baru tiba di PB ±5 s kemudian): komisariat → cabang, lalu
// cabang → badko → PB di belakang tumpukan yang berjalan lagi.
aliran({ jalur: d.jalur("cabang", "badko", "pb"), mulai: T.emas + 0.35, selesai: 21, emas: true, beku: false, bunyi: false });
// Bunyi aliran emas sampai kartu akhir mulai (aliran sendiri berjalan terus sampai video selesai).
catat({ t: T.emas + 0.1, jenis: "aliran", durasi: 18.2 - T.emas, kuat: 0.6, posisi: d.titik.jalurJembatan.jembatanCabang[0], posisiAkhir: d.titik.atas.pb, sumber: "aliran emas" });
["komisariat1", "komisariat2", "komisariat3"].forEach((n, i) => aliran({
  jalur: d.jalur(n, "cabang"), mulai: T.emas + 0.15 * i, selesai: 21, emas: true, beku: false, bunyi: false,
}));
catat({ t: T.pulih[0] + 0.3, jenis: "menyala", kuat: 0.5, posisi: badko, sumber: "badko" });

// Selama Cermin (kamera tinggi 12 pada badko, termasuk kedua transisinya) bangunan lain sengaja terpotong bingkai;
// yang wajib utuh di zona hanya benda cermin: badko dan jembatan retak.
const BENDA_CERMIN = new Set([badko, jembatanCabang]);
const pentingAsli = new Map(Object.values(d.benda).map((b) => [b, b.userData.penting]));

// Keadaan yang berubah halus, disetel setiap frame tanpa syarat.
v.setiapFrame((t) => {
  const zoom = t > 6.0 && t < 13.0;
  for (const [b, p] of pentingAsli) b.userData.penting = zoom ? BENDA_CERMIN.has(b) && p : p;
  // Badko abu selama gejala dan cermin, kembali berfungsi sesudah jembatan diperbaiki.
  setelKeadaan(badko, "abu", halus(rentang(t, T.abu[0], T.abu[1])) * (1 - halus(rentang(t, T.pulih[0], T.pulih[1]))));
  jembatanCabang.userData.aturRetak(1 - halus(rentang(t, T.tutup[0], T.tutup[1])));
  // Halaman melayang: ayun pelan; halaman badko berhenti berayun sebelum dilipat.
  halaman.forEach((h, i) => {
    const a = h.n === "badko" ? 1 - halus(rentang(t, T.lipat - 0.4, T.lipat)) : 1;
    h.ayun.position.y = 0.04 * a * Math.sin(2 * Math.PI * 0.45 * t + i * 1.3);
  });
  // Tutup amplop tertutup sesudah halaman terlipat.
  amp.userData.bagian.tutup.rotation.x = -Math.PI * (1 - halus(rentang(t, T.lipat + 0.22, T.lipat + 0.42)));
});
