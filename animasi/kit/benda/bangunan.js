// Bangunan: gerbang dan bingkai, gedung, panggung dan podium, pajangan dan struktur tetap.
// Mengikuti KONTRAK bagian 5: fungsi(opsi) → THREE.Group, titik asal di tengah alas (y = 0), ukuran bawaan dari kamus
// prompt (bisa ditimpa lewat opsi), warna dari W (warna kamus yang tidak ada di palet diturunkan dari campuran token),
// setiap benda punya bahannya sendiri, teks lewat label3D, tanpa ketergantungan pada waktu.
// Rincian dan daftar opsi: kit/docs/benda-figur-bangunan.md.
//
// Arah: sisi benda yang terlihat kamera adalah +x (kanan bawah layar) dan +z (kiri bawah layar).
// Benda "berwajah" (gerbang, bingkai pintu, podium, stan) dibangun menghadap kamera: rotasi y 0 = mukanya sejajar
// layar dan menghadap penonton. Rotasi y +45° menghadapkannya ke +x, −45° ke +z, ±90° membuatnya tampak dari samping.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { W } from "../inti/tema.js";
import { bahanPadat, bahanKaca, bahanGaris, kotakBulat, garisTepi, garisDari, catatDasar, keadaanBawaan, PUDAR } from "../inti/bahan.js";
import { label3D } from "../halaman/label.js";
import { pion, rumah } from "./dasar.js";

const MUKA = Math.PI / 4; // rotasi y: sumbu x lokal sejajar layar (KANAN), +z lokal menghadap penonton (BAWAH)
const SUMBU_Y = new THREE.Vector3(0, 1, 0);

// ---------------------------------------------------------------- bantuan
const campur = (a, b, k) => a.clone().lerp(b, k);
// Warna turunan dari token tema, dihitung saat benda dibuat (jadi ikut buatTema).
const WARNA = {
  kelas: () => campur(W.zamrudRedup, W.abuGelap, 0.5).lerp(W.pelat, 0.45), // ≈ hsl(153, 20%, 22%) di kamus
  dinding: () => campur(W.zamrudRedup, W.pelat, 0.25),                       // gedung jenjang, ruang karya
  tutup: () => campur(W.zamrudRedup, W.pelat, 0.6),                          // atap datar, kanopi
  lantai: () => campur(W.pelat, W.zamrudRedup, 0.4),                         // lantai ruang
  warga: () => campur(W.abuGelap, W.emas, 0.2),                              // ≈ hsl(42, 10%, 45%) di kamus
  atapWarga: () => campur(W.abuGelap, W.pelat, 0.5),
  pintu: () => campur(W.pelat, W.abuGelap, 0.25),
};
const titikMuka = (x, y, z) => new THREE.Vector3(x, y, z).applyAxisAngle(SUMBU_Y, MUKA);

// Garis tepi tampak (struktur) sebagai anak mesh kotakBulat.
function bergaris(mesh, bahan) { mesh.add(garisTepi(mesh, { bahan })); return mesh; }
// Garis tepi denyut cermin: zamrudPijar 3 px, tersembunyi sampai keadaan "denyut" > 0 (lihat rumah di dasar.js).
// sumber: mesh kotakBulat, atau { w, h, d, alas, induk, posisi, rotasiY } untuk kotak bebas.
function tepiDenyut(sumber) {
  const mat = bahanGaris(W.zamrudPijar, 3, 0);
  mat.userData.tepiDenyut = true;
  return sumber.map((s) => {
    const l = garisTepi(s.isMesh ? s : { w: s.w, h: s.h, d: s.d, alas: s.alas ?? true }, { bahan: mat });
    l.visible = false;
    if (s.isMesh) s.add(l);
    else { if (s.posisi) l.position.copy(s.posisi); if (s.rotasiY) l.rotation.y = s.rotasiY; s.induk.add(l); }
    return l;
  });
}
// Label HTML yang menempel pada titik lokal benda (ikut gerak dan opasitas benda).
function pasangLabel(induk, teks, posisi, opsiLabel = {}) {
  const jangkar = new THREE.Object3D();
  jangkar.position.copy(posisi);
  induk.add(jangkar);
  return label3D(teks, { pada: jangkar, gaya: "kotak", ...opsiLabel });
}
// Kisi jendela pada muka +z (sumbu "z") atau +x (sumbu "x") sebuah balok; kotak-kotaknya dimasukkan ke `geos`.
// muka: jarak muka dari pusat; lebarMuka: jarak pusat kolom pertama ke terakhir; y0, y1: pusat baris pertama dan terakhir.
function kisiJendela(geos, { sumbu, muka, lebarMuka, pusat = 0, kolom, baris, y0, y1, w, h, tebal = 0.03, lewati = () => false }) {
  for (let i = 0; i < kolom; i++) for (let j = 0; j < baris; j++) {
    if (lewati(i, j)) continue;
    const a = pusat + (kolom === 1 ? 0 : (i / (kolom - 1) - 0.5) * lebarMuka);
    const y = baris === 1 ? y0 : y0 + (j / (baris - 1)) * (y1 - y0);
    geos.push(sumbu === "z" ? new THREE.BoxGeometry(w, h, tebal).translate(a, y, muka) : new THREE.BoxGeometry(tebal, h, w).translate(muka, y, -a));
  }
}

// Jendela menyala (gedung jenjang, ruang karya, rumah kecil). Bahannya kebal keadaan bawaan (abaikanKeadaan) supaya
// keadaan "lampu" tidak tertimpa; abu dan pudar diterapkan di sini. Emissive zamrudPijar KUAT_JENDELA tetap di bawah
// ambang bloom (diuji: bloom tidak mengubah piksel jendela).
export const KUAT_JENDELA = 0.42;
function bahanJendela() {
  const m = bahanPadat(W.zamrud, { emissive: W.zamrudPijar.clone(), emissiveIntensity: KUAT_JENDELA });
  m.userData.abaikanKeadaan = true;
  return m;
}
// Mengembalikan fungsi setelKeadaan yang menangani "lampu" 0..1 (padam → menyala) untuk bahan jendela.
function keadaanLampu(bahan, lampuAwal = 1) {
  const k = { lampu: lampuAwal, abu: 0, pudar: 0 };
  const nyala = W.zamrud.clone(), mati = campur(W.pelat, W.zamrudRedup, 0.35);
  function terapkan() {
    for (const m of bahan) {
      m.color.copy(mati).lerp(nyala, k.lampu);
      if (k.abu) m.color.lerp(W.abuGelap, k.abu);
      if (k.pudar) m.color.lerp(W.abuGelap, k.pudar);
      m.emissiveIntensity = KUAT_JENDELA * k.lampu * (1 - k.abu) * (1 - k.pudar);
      m.userData.faktorOpasitas = 1 + (PUDAR.opasitas - 1) * k.pudar;
    }
  }
  terapkan();
  return (n, nilai) => {
    if (n === "lampu") { k.lampu = nilai; terapkan(); return true; }
    if (n === "abu" || n === "pudar") { k[n] = nilai; terapkan(); }
    return false; // sisanya (dan abu/pudar untuk dinding) ditangani bawaan kit
  };
}
function meshJendela(geos, bahan) {
  const m = new THREE.Mesh(mergeGeometries(geos), bahan);
  m.receiveShadow = true;
  return m;
}

// ---------------------------------------------------------------- gerbang dan bingkai
// Gerbang: dua tiang dan balok atas, menghadap kamera (lihat catatan arah di atas).
function gerbang({ jarak, tinggi, tiang, balok, warna, warnaTepi, label, opsiLabel, nama, penting }) {
  const [bw, bh, bd] = balok;
  const g = new THREE.Group();
  const muka = new THREE.Group();
  muka.rotation.y = MUKA;
  g.add(muka);
  const mat = bahanPadat(warna);
  const garis = bahanGaris(warnaTepi, 2);
  const daftarTiang = [-1, 1].map((s) => {
    const m = kotakBulat(tiang, tinggi, tiang, mat, { alas: true, radius: Math.min(0.06, tiang * 0.15) });
    m.position.x = (s * jarak) / 2;
    muka.add(bergaris(m, garis));
    return m;
  });
  const mBalok = kotakBulat(bw, bh, bd, mat, { alas: true, radius: Math.min(0.06, bh * 0.2) });
  mBalok.position.y = tinggi;
  muka.add(bergaris(mBalok, garis));
  const semua = [...daftarTiang, mBalok];
  g.userData = {
    nama, penting,
    // Titik lewat di depan (arah penonton) dan di belakang gerbang, koordinat lokal benda.
    depan: titikMuka(0, 0, 1.0), belakang: titikMuka(0, 0, -1.0),
    label: label ? pasangLabel(muka, label, new THREE.Vector3(0, tinggi + bh + 0.22, 0), opsiLabel) : null,
    bagian: { tiang: daftarTiang, balok: mBalok, tepi: tepiDenyut(semua), denyut: semua, emas: semua },
  };
  return g;
}

// gerbangKampus: tiang 0.4 × 2.2 × 0.4 berjarak 2.6, balok 3.2 × 0.35 × 0.45, pelat bertepi zamrudRedup.
// Rotasi y 0 sudah menghadap kamera. Brief lama yang menulis "rotasi y −45°" dibuat untuk gerbang yang memanjang di z;
// untuk gerbang ini biarkan rotasi 0 (−45° membuatnya miring tiga perempat, ±90° tampak dari samping).
export function gerbangKampus(opsi = {}) {
  const {
    jarak = 2.6, tinggi = 2.2, tiang = 0.4, balok = [3.2, 0.35, 0.45], warna = W.pelat, warnaTepi = W.zamrudRedup,
    label = null, opsiLabel = {}, nama = "gerbang kampus", penting = true,
  } = opsi;
  return gerbang({ jarak, tinggi, tiang, balok, warna, warnaTepi, label, opsiLabel, nama, penting });
}

// gerbangKecil: tiang 0.2 × 1.6 × 0.2, balok 1.6 × 0.2 × 0.2, zamrud bertepi zamrudPijar, label opsional di atasnya.
export function gerbangKecil(opsi = {}) {
  const {
    lebar = 1.6, tinggi = 1.6, tiang = 0.2, warna = W.zamrud, warnaTepi = W.zamrudPijar,
    label = null, opsiLabel = {}, nama = "gerbang", penting = true,
  } = opsi;
  return gerbang({ jarak: lebar - tiang, tinggi, tiang, balok: [lebar, tiang, tiang], warna, warnaTepi, label, opsiLabel, nama, penting });
}

// bingkaiPintu: kusen pintu berdiri sendiri (mis. pintu keluar), menghadap kamera, dengan lorong gelap dan daun pintu
// yang terbuka ke arah penonton. bagian.daun = poros engsel (rotation.y = −buka × 90°).
export function bingkaiPintu(opsi = {}) {
  const {
    lebar = 1.0, tinggi = 1.9, tebal = 0.14, dalam = 0.26, daun = true, buka = 0.45, celah = true,
    warna = W.pelat, warnaTepi = W.zamrudRedup, warnaDaun = W.zamrudRedup, nama = "pintu", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const muka = new THREE.Group();
  muka.rotation.y = MUKA;
  g.add(muka);
  const mat = bahanPadat(warna);
  const garis = bahanGaris(warnaTepi, 2);
  const kusen = [-1, 1].map((s) => {
    const m = kotakBulat(tebal, tinggi, dalam, mat, { alas: true, radius: 0.03 });
    m.position.x = (s * (lebar + tebal)) / 2;
    return bergaris(m, garis);
  });
  const atas = kotakBulat(lebar + 2 * tebal, tebal, dalam, mat, { alas: true, radius: 0.03 });
  atas.position.y = tinggi;
  kusen.push(bergaris(atas, garis));
  const ambang = bergaris(kotakBulat(lebar + 2 * tebal + 0.24, 0.05, dalam + 0.3, mat, { alas: true, radius: 0.02 }), garis);
  muka.add(...kusen, ambang);
  let mCelah = null;
  if (celah) {
    mCelah = kotakBulat(lebar, tinggi, 0.02, bahanPadat(W.latar), { alas: true, radius: 0 });
    mCelah.position.z = -dalam / 4;
    mCelah.castShadow = false;
    muka.add(mCelah);
  }
  let poros = null;
  if (daun) {
    poros = new THREE.Group();
    poros.position.set(-lebar / 2, 0.05, dalam / 2);
    const matDaun = bahanPadat(warnaDaun);
    const mDaun = kotakBulat(lebar - 0.03, tinggi - 0.08, 0.05, matDaun, { alas: true, radius: 0.02 });
    mDaun.position.set((lebar - 0.03) / 2, 0.02, 0.025);
    const gagang = kotakBulat(0.05, 0.05, 0.05, bahanPadat(W.kertas), { radius: 0.02 });
    gagang.position.set(lebar * 0.86, tinggi * 0.48, 0.07);
    poros.add(mDaun, gagang);
    poros.rotation.y = -buka * Math.PI / 2;
    muka.add(poros);
  }
  g.userData = {
    nama, penting, depan: titikMuka(0, 0, 0.8), belakang: titikMuka(0, 0, -0.8),
    bagian: { kusen, ambang, celah: mCelah, daun: poros, tepi: tepiDenyut(kusen), denyut: kusen, emas: poros ? [...kusen, poros] : kusen },
  };
  return g;
}

// ---------------------------------------------------------------- gedung
// gedungKelas: kotak 3.0 × 2.2 × 2.0 warna kelas, jendela 0.4 × 0.4 kertas opacity 0.5: 4 × 2 di muka +z dan
// kolomSamping × 2 di muka +x (0 = tanpa jendela samping), atap datar tipis.
export function gedungKelas(opsi = {}) {
  const {
    lebar = 3.0, tinggi = 2.2, dalam = 2.0, kolom = 4, baris = 2, kolomSamping = 3,
    warna = WARNA.kelas(), warnaJendela = W.kertas, opasitasJendela = 0.5, nama = "gedung kelas", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const badan = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { alas: true, radius: 0.05 });
  const matTutup = bahanPadat(WARNA.tutup());
  matTutup.userData.warnaAbu = W.abuGelap;
  const tutup = kotakBulat(lebar + 0.1, 0.1, dalam + 0.1, matTutup, { alas: true, radius: 0.03 });
  tutup.position.y = tinggi;
  const geos = [];
  const y0 = tinggi * 0.34, y1 = tinggi * 0.7;
  kisiJendela(geos, { sumbu: "z", muka: dalam / 2 + 0.012, lebarMuka: lebar * 0.7, kolom, baris, y0, y1, w: 0.4, h: 0.4 });
  if (kolomSamping > 0) kisiJendela(geos, { sumbu: "x", muka: lebar / 2 + 0.012, lebarMuka: dalam * 0.6, kolom: kolomSamping, baris, y0, y1, w: 0.4, h: 0.4 });
  const jendela = meshJendela(geos, bahanPadat(warnaJendela, { transparent: true, opacity: opasitasJendela, depthWrite: false }));
  g.add(badan, tutup, jendela);
  g.userData = { nama, penting, atas: tinggi + 0.1, bagian: { badan, tutup, jendela, tepi: tepiDenyut([badan]), denyut: [badan], emas: [badan] } };
  return g;
}

// menaraKampus: kotak 2.0 × 5.0 × 2.0 warna kelas, jendela kecil 0.24 × 0.32 di kedua muka yang terlihat, pintu
// di muka +z, pagar atap rendah. userData.atap: tinggi lantai atap (untuk figur di atap).
export function menaraKampus(opsi = {}) {
  const {
    lebar = 2.0, tinggi = 5.0, dalam = 2.0, kolom = 3, baris = 8, warna = WARNA.kelas(), warnaJendela = W.kertas,
    opasitasJendela = 0.5, nama = "menara kampus", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const badan = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { alas: true, radius: 0.05 });
  const matTutup = bahanPadat(WARNA.tutup());
  matTutup.userData.warnaAbu = W.abuGelap;
  const pagar = [];
  for (const [w, d, x, z] of [[lebar + 0.06, 0.08, 0, dalam / 2], [lebar + 0.06, 0.08, 0, -dalam / 2], [0.08, dalam, lebar / 2, 0], [0.08, dalam, -lebar / 2, 0]]) {
    const m = kotakBulat(w, 0.2, d, matTutup, { alas: true, radius: 0.02 });
    m.position.set(x, tinggi, z);
    pagar.push(m);
  }
  const matPintu = bahanPadat(WARNA.pintu());
  matPintu.userData.warnaAbu = W.abuGelap;
  const pintu = kotakBulat(0.5, 0.8, 0.05, matPintu, { alas: true, radius: 0.02 });
  pintu.position.z = dalam / 2 + 0.02;
  const geos = [];
  const y0 = 1.3, y1 = tinggi - 0.55;
  kisiJendela(geos, { sumbu: "z", muka: dalam / 2 + 0.012, lebarMuka: lebar * 0.56, kolom, baris, y0, y1, w: 0.24, h: 0.32 });
  kisiJendela(geos, { sumbu: "x", muka: lebar / 2 + 0.012, lebarMuka: dalam * 0.56, kolom, baris, y0, y1, w: 0.24, h: 0.32 });
  const jendela = meshJendela(geos, bahanPadat(warnaJendela, { transparent: true, opacity: opasitasJendela, depthWrite: false }));
  g.add(badan, ...pagar, pintu, jendela);
  g.userData = {
    nama, penting, atap: tinggi, depanPintu: new THREE.Vector3(0, 0, dalam / 2 + 0.45),
    bagian: { badan, pagar, pintu, jendela, tepi: tepiDenyut([badan]), denyut: [badan], emas: [badan, pintu] },
  };
  return g;
}

// rumahWarga: rumah 0.9 × 0.7 × 0.9 berdinding abu hangat, atap prisma, pintu kecil, satu jendela di muka +x.
// Opsi lain diteruskan ke rumah() (pintu, geserPintu, lebarPintu, tinggiPintu, warnaPintu).
export function rumahWarga(opsi = {}) {
  const { lebar = 0.9, tinggi = 0.7, dalam = 0.9, atap = 0.45, warna = WARNA.warga(), warnaAtap = WARNA.atapWarga(), jendela = true, nama = "rumah warga", penting = true, ...sisa } = opsi;
  const g = rumah({ lebar, tinggi, dalam, atap, warnaDinding: warna, warnaAtap, warnaPintu: W.pelat, lebarPintu: 0.22, tinggiPintu: 0.4, geserPintu: -0.18, nama, penting, ...sisa });
  if (jendela) {
    const m = kotakBulat(0.02, 0.18, 0.2, bahanPadat(W.kertas, { transparent: true, opacity: 0.6, depthWrite: false }), { radius: 0.005 });
    m.position.set(lebar / 2 + 0.012, tinggi * 0.58, 0);
    g.add(m);
    g.userData.bagian.jendela = m;
  }
  return g;
}

// rumahKecil: komisariat kecil Dunia Jenjang 1.2 × 0.9 × 1.1 dengan jendela menyala (keadaan "lampu").
// Opsi lain diteruskan ke rumah().
export function rumahKecil(opsi = {}) {
  const { lebar = 1.2, tinggi = 0.9, dalam = 1.1, atap = 0.5, jendela = true, lampu = 1, nama = "komisariat", penting = true, ...sisa } = opsi;
  const g = rumah({ lebar, tinggi, dalam, atap, lebarPintu: 0.3, tinggiPintu: 0.52, geserPintu: -0.25, nama, penting, ...sisa });
  if (jendela) {
    const geos = [];
    kisiJendela(geos, { sumbu: "x", muka: lebar / 2 + 0.012, lebarMuka: dalam * 0.46, kolom: 2, baris: 1, y0: tinggi * 0.55, w: 0.22, h: 0.24 });
    if ((sisa.pintu ?? "depan") === "depan") kisiJendela(geos, { sumbu: "z", muka: dalam / 2 + 0.012, lebarMuka: 0, pusat: 0.25, kolom: 1, baris: 1, y0: tinggi * 0.55, w: 0.22, h: 0.24 });
    const mat = bahanJendela();
    const m = meshJendela(geos, mat);
    g.add(m);
    g.userData.bagian.jendela = m;
    g.userData.setelKeadaan = keadaanLampu([mat], lampu);
  }
  return g;
}

// Dinding lurus sepanjang sumbu x lokal (titik asal di tengah alas) dengan lubang [{ x, lebar, tinggi, bawah = 0 }]
// (x = pusat lubang dari tengah dinding). Mengembalikan Group berisi kotak-kotak dinding.
function dindingBerlubang(panjang, tinggi, tebal, lubang, mat) {
  const g = new THREE.Group();
  const tambah = (w, h, x, y) => {
    if (w < 0.005 || h < 0.005) return;
    const m = kotakBulat(w, h, tebal, mat, { alas: true, radius: 0.015 });
    m.position.set(x, y, 0);
    g.add(m);
  };
  let x0 = -panjang / 2;
  for (const l of [...lubang].sort((a, b) => a.x - b.x)) {
    const a = l.x - l.lebar / 2, bawah = l.bawah ?? 0, atas = Math.min(tinggi, bawah + l.tinggi);
    tambah(a - x0, tinggi, (x0 + a) / 2, 0);
    tambah(l.lebar, bawah, l.x, 0);
    tambah(l.lebar, tinggi - atas, l.x, atas);
    x0 = l.x + l.lebar / 2;
  }
  tambah(panjang / 2 - x0, tinggi, (x0 + panjang / 2) / 2, 0);
  return g;
}

// rumahPotong: komisariat terpotong (potongan isometrik). Dinding belakang (−x, −z) setinggi penuh, dinding depan
// (+x, +z) dipotong setinggi potong × tinggi, celah pintu depan di muka +z, pintu belakang opsional di dinding −z,
// atap hanya berupa garis. Untuk diperbesar 1.4 kali: atur skala benda (rp.scale.setScalar(1.4)).
// userData: depanPintu (luar pintu depan), dalam (tengah ruang), luarBelakang (luar pintu belakang), lokal.
export function rumahPotong(opsi = {}) {
  const {
    lebar = 1.8, tinggi = 1.2, dalam = 1.6, atap = 0.7, tebal = 0.1, potong = 0.45, geserPintu = -0.4, lebarPintu = 0.4,
    pintuBelakang = true, geserPintuBelakang = 0.4, tinggiPintu = 0.7, garisAtap = true,
    warnaDinding = W.zamrudRedup, warnaLantai = WARNA.lantai(), nama = "komisariat", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const matDinding = bahanPadat(warnaDinding);
  const matLantai = bahanPadat(warnaLantai);
  matLantai.userData.warnaAbu = W.abuGelap;
  const lantai = kotakBulat(lebar, 0.04, dalam, matLantai, { alas: true, radius: 0.015 });
  const hDepan = tinggi * potong;
  // Belakang −z (penuh, pintu belakang opsional) dan depan +z (rendah, celah pintu depan) memanjang di x.
  const belakang = dindingBerlubang(lebar, tinggi, tebal, pintuBelakang ? [{ x: geserPintuBelakang, lebar: lebarPintu, tinggi: tinggiPintu }] : [], matDinding);
  belakang.position.z = -dalam / 2 + tebal / 2;
  const depan = dindingBerlubang(lebar, hDepan, tebal, [{ x: geserPintu, lebar: lebarPintu, tinggi: hDepan }], matDinding);
  depan.position.z = dalam / 2 - tebal / 2;
  // Kiri −x (penuh) dan kanan +x (rendah) memanjang di z, di antara dinding depan dan belakang.
  const kiri = dindingBerlubang(dalam - 2 * tebal, tinggi, tebal, [], matDinding);
  kiri.rotation.y = Math.PI / 2;
  kiri.position.x = -lebar / 2 + tebal / 2;
  const kanan = dindingBerlubang(dalam - 2 * tebal, hDepan, tebal, [], matDinding);
  kanan.rotation.y = Math.PI / 2;
  kanan.position.x = lebar / 2 - tebal / 2;
  g.add(lantai, belakang, depan, kiri, kanan);
  let mAtap = null;
  if (garisAtap) {
    const L = lebar / 2 + 0.06, z = dalam / 2 + 0.08, y0 = tinggi, y1 = tinggi + atap;
    const p = [];
    const ruas = (a, b) => p.push(...a, ...b);
    ruas([-L, y0, -z], [L, y0, -z]); ruas([-L, y0, z], [L, y0, z]); ruas([-L, y1, 0], [L, y1, 0]);
    for (const x of [-L, L]) { ruas([x, y0, -z], [x, y1, 0]); ruas([x, y1, 0], [x, y0, z]); ruas([x, y0, -z], [x, y0, z]); }
    mAtap = garisDari(p, bahanGaris(W.zamrud, 1.5, 0.55));
    g.add(mAtap);
  }
  const dinding = [belakang, kiri, depan, kanan];
  const tepi = tepiDenyut([
    { w: lebar, h: tinggi, d: tebal, induk: g, posisi: belakang.position },
    { w: tebal, h: tinggi, d: dalam, induk: g, posisi: new THREE.Vector3(-lebar / 2 + tebal / 2, 0, 0) },
    { w: lebar, h: 0.04, d: dalam, induk: g },
  ]);
  g.userData = {
    nama, penting,
    depanPintu: new THREE.Vector3(geserPintu, 0, dalam / 2 + 0.45),
    dalam: new THREE.Vector3(0, 0.04, 0),
    luarBelakang: new THREE.Vector3(geserPintuBelakang, 0, -dalam / 2 - 0.45),
    bagian: { lantai, dinding, dindingBelakang: [belakang, kiri], dindingDepan: [depan, kanan], atap: mAtap, tepi, denyut: dinding, emas: dinding },
  };
  return g;
}

// Balok gedung beratap datar (badan + tutup sedikit lebih lebar), titik asal di tengah alas.
function balokGedung(g, w, h, d, matBadan, matTutup, y = 0) {
  const badan = kotakBulat(w, h, d, matBadan, { alas: true, radius: 0.04 });
  badan.position.y = y;
  const tutup = kotakBulat(w + 0.08, 0.08, d + 0.08, matTutup, { alas: true, radius: 0.02 });
  tutup.position.y = y + h;
  g.add(badan, tutup);
  return { badan, tutup, atas: y + h + 0.08 };
}
// Bahan bersama satu gedung jenjang: dinding, tutup, pintu, jendela.
function bahanJenjang(warna) {
  const tutup = bahanPadat(WARNA.tutup());
  const pintu = bahanPadat(WARNA.pintu());
  tutup.userData.warnaAbu = pintu.userData.warnaAbu = W.abuGelap;
  return { dinding: bahanPadat(warna), tutup, pintu, jendela: bahanJendela() };
}
function pintuGedung(g, mat, matKanopi, { w, h, d, kanopi = true }) {
  const pintu = kotakBulat(w, h, 0.05, mat, { alas: true, radius: 0.02 });
  pintu.position.z = d / 2 + 0.02;
  g.add(pintu);
  if (kanopi) {
    const k = kotakBulat(w + 0.34, 0.05, 0.3, matKanopi, { alas: true, radius: 0.015 });
    k.position.set(0, h + 0.06, d / 2 + 0.15);
    g.add(k);
  }
  return pintu;
}
function selesaiJenjang(g, { nama, penting, bahan, lampu, badan, pintu, jendela, tambahan = {} }) {
  const tepi = tepiDenyut(badan);
  g.userData = {
    nama, penting, depanPintu: new THREE.Vector3(0, 0, pintu.position.z + 0.45),
    bagian: { badan, pintu, jendela, tepi, denyut: badan, emas: [...badan, pintu], ...tambahan },
    setelKeadaan: keadaanLampu([bahan.jendela], lampu),
  };
  return g;
}

// gedungCabang: tiga lantai 2.0 × 2.4 × 2.0, jendela menyala di kedua muka, pintu berkanopi di muka +z, unit atap.
export function gedungCabang(opsi = {}) {
  const { lebar = 2.0, tinggi = 2.4, dalam = 2.0, lantai = 3, kolom = 4, lampu = 1, warna = WARNA.dinding(), nama = "cabang", penting = true } = opsi;
  const g = new THREE.Group();
  const b = bahanJenjang(warna);
  const hBadan = tinggi - 0.16;
  const { badan, tutup, atas } = balokGedung(g, lebar, hBadan, dalam, b.dinding, b.tutup);
  const unit = kotakBulat(0.55, 0.24, 0.45, b.tutup, { alas: true, radius: 0.03 });
  unit.position.set(-lebar * 0.22, atas, -dalam * 0.18);
  g.add(unit);
  const pintu = pintuGedung(g, b.pintu, b.tutup, { w: 0.46, h: 0.62, d: dalam });
  const fh = hBadan / lantai;
  const geos = [];
  const baris = { y0: fh * 0.58, y1: fh * (lantai - 0.42), baris: lantai, w: 0.24, h: Math.min(0.34, fh * 0.45) };
  kisiJendela(geos, { sumbu: "z", muka: dalam / 2 + 0.012, lebarMuka: lebar * 0.66, kolom, ...baris, lewati: (i, j) => j === 0 && Math.abs(i - (kolom - 1) / 2) < 1 });
  kisiJendela(geos, { sumbu: "x", muka: lebar / 2 + 0.012, lebarMuka: dalam * 0.66, kolom, ...baris });
  const jendela = meshJendela(geos, b.jendela);
  g.add(jendela);
  return selesaiJenjang(g, { nama, penting, bahan: b, lampu, badan: [badan], pintu, jendela, tambahan: { tutup, unit } });
}

// menaraBadko: menara 1.6 × 4.0 × 1.6 dengan lantai mundur di puncak, jendela menyala, pintu di muka +z.
export function menaraBadko(opsi = {}) {
  const { lebar = 1.6, tinggi = 4.0, dalam = 1.6, baris = 6, kolom = 3, lampu = 1, warna = WARNA.dinding(), nama = "badko", penting = true } = opsi;
  const g = new THREE.Group();
  const b = bahanJenjang(warna);
  const hAtas = 0.6, hBadan = tinggi - hAtas - 0.16;
  const bawah = balokGedung(g, lebar, hBadan, dalam, b.dinding, b.tutup);
  const lAtas = lebar * 0.72, dAtas = dalam * 0.72;
  const puncak = balokGedung(g, lAtas, hAtas, dAtas, b.dinding, b.tutup, bawah.atas);
  const pintu = pintuGedung(g, b.pintu, b.tutup, { w: 0.4, h: 0.56, d: dalam });
  const geos = [];
  const kisi = { y0: 0.5, y1: hBadan - 0.35, baris, w: 0.22, h: 0.26 };
  kisiJendela(geos, { sumbu: "z", muka: dalam / 2 + 0.012, lebarMuka: lebar * 0.56, kolom, ...kisi, lewati: (i, j) => j === 0 && Math.abs(i - (kolom - 1) / 2) < 1 });
  kisiJendela(geos, { sumbu: "x", muka: lebar / 2 + 0.012, lebarMuka: dalam * 0.56, kolom, ...kisi });
  const yA = bawah.atas + hAtas * 0.5;
  kisiJendela(geos, { sumbu: "z", muka: dAtas / 2 + 0.012, lebarMuka: lAtas * 0.5, kolom: 2, baris: 1, y0: yA, w: 0.2, h: 0.24 });
  kisiJendela(geos, { sumbu: "x", muka: lAtas / 2 + 0.012, lebarMuka: dAtas * 0.5, kolom: 2, baris: 1, y0: yA, w: 0.2, h: 0.24 });
  const jendela = meshJendela(geos, b.jendela);
  g.add(jendela);
  return selesaiJenjang(g, { nama, penting, bahan: b, lampu, badan: [bawah.badan, puncak.badan], pintu, jendela, tambahan: { tutup: [bawah.tutup, puncak.tutup] } });
}

// menaraPB: menara 2.0 × 6.0 × 2.0 dengan lantai mundur dan kubus puncak 0.9 zamrudRedup. klikEmas(pb) hanya
// mengemaskan kubus puncak (bagian.emas = [kubus]); jendela menyala lewat keadaan "lampu".
export function menaraPB(opsi = {}) {
  const { lebar = 2.0, tinggi = 6.0, dalam = 2.0, kubus = 0.9, baris = 8, kolom = 4, lampu = 1, warna = WARNA.dinding(), warnaKubus = W.zamrudRedup, nama = "pb", penting = true } = opsi;
  const g = new THREE.Group();
  const b = bahanJenjang(warna);
  const hAtas = 0.7, hBadan = tinggi - kubus - hAtas - 0.16;
  const bawah = balokGedung(g, lebar, hBadan, dalam, b.dinding, b.tutup);
  const lAtas = lebar * 0.75, dAtas = dalam * 0.75;
  const puncak = balokGedung(g, lAtas, hAtas, dAtas, b.dinding, b.tutup, bawah.atas);
  const mKubus = kotakBulat(kubus, kubus, kubus, bahanPadat(warnaKubus), { alas: true, radius: 0.05 });
  mKubus.position.y = puncak.atas;
  g.add(mKubus);
  const pintu = pintuGedung(g, b.pintu, b.tutup, { w: 0.48, h: 0.66, d: dalam });
  const geos = [];
  const kisi = { y0: 0.5, y1: hBadan - 0.35, baris, w: 0.22, h: 0.26 };
  kisiJendela(geos, { sumbu: "z", muka: dalam / 2 + 0.012, lebarMuka: lebar * 0.66, kolom, ...kisi, lewati: (i, j) => j === 0 && Math.abs(i - (kolom - 1) / 2) < 1 });
  kisiJendela(geos, { sumbu: "x", muka: lebar / 2 + 0.012, lebarMuka: dalam * 0.66, kolom, ...kisi });
  const yA = bawah.atas + hAtas * 0.5;
  kisiJendela(geos, { sumbu: "z", muka: dAtas / 2 + 0.012, lebarMuka: lAtas * 0.56, kolom: 3, baris: 1, y0: yA, w: 0.2, h: 0.26 });
  kisiJendela(geos, { sumbu: "x", muka: lAtas / 2 + 0.012, lebarMuka: dAtas * 0.56, kolom: 3, baris: 1, y0: yA, w: 0.2, h: 0.26 });
  const jendela = meshJendela(geos, b.jendela);
  g.add(jendela);
  selesaiJenjang(g, { nama, penting, bahan: b, lampu, badan: [bawah.badan, puncak.badan], pintu, jendela, tambahan: { tutup: [bawah.tutup, puncak.tutup], kubus: mKubus } });
  g.userData.bagian.emas = [mKubus];
  g.userData.puncak = new THREE.Vector3(0, puncak.atas + kubus, 0);
  return g;
}

// ruangKarya: bangunan 1.8 × 1.4 × 1.6 dengan pintu rolling bergaris (tertutup) dan papan nama kosong di muka +z,
// jendela menyala di muka +x. userData.bukaPintu(k): k 0 tertutup → 1 terangkat penuh (pintu tergulung ke atas).
export function ruangKarya(opsi = {}) {
  const { lebar = 1.8, tinggi = 1.4, dalam = 1.6, lampu = 1, warna = WARNA.dinding(), geserPintu = -0.25, nama = "ruang karya", penting = true } = opsi;
  const g = new THREE.Group();
  const b = bahanJenjang(warna);
  const { badan, tutup } = balokGedung(g, lebar, tinggi - 0.08, dalam, b.dinding, b.tutup);
  const lp = 0.86, tp = 0.88, z = dalam / 2;
  const lorong = kotakBulat(lp, tp, 0.02, bahanPadat(W.latar), { alas: true, radius: 0 });
  lorong.position.set(geserPintu, 0, z + 0.005);
  lorong.castShadow = false;
  const matRol = bahanPadat(campur(W.abuGelap, W.zamrudRedup, 0.35));
  const pintu = new THREE.Group(); // poros di atas bukaan: scale.y mengecil = tergulung ke atas
  pintu.position.set(geserPintu, tp, z + 0.03);
  const bilah = [];
  const n = 6, hb = tp / n;
  for (let i = 0; i < n; i++) {
    const m = kotakBulat(lp, hb - 0.018, 0.03, matRol, { radius: 0.008 });
    m.position.y = -(i + 0.5) * hb;
    pintu.add(m);
    bilah.push(m);
  }
  const gulungan = kotakBulat(lp + 0.1, 0.14, 0.12, b.tutup, { radius: 0.03 });
  gulungan.position.set(geserPintu, tp + 0.07, z + 0.05);
  const papanNama = kotakBulat(1.0, 0.24, 0.04, bahanPadat(W.kertas), { radius: 0.015 });
  papanNama.position.set(geserPintu, tp + 0.3, z + 0.025);
  g.add(lorong, pintu, gulungan, papanNama);
  const geos = [];
  kisiJendela(geos, { sumbu: "x", muka: lebar / 2 + 0.012, lebarMuka: dalam * 0.5, kolom: 2, baris: 1, y0: tinggi * 0.52, w: 0.36, h: 0.34 });
  const jendela = meshJendela(geos, b.jendela);
  g.add(jendela);
  const tepi = tepiDenyut([papanNama, { w: lp, h: tp, d: 0.03, induk: g, posisi: new THREE.Vector3(geserPintu, 0, z + 0.03) }]);
  g.userData = {
    nama, penting, depanPintu: new THREE.Vector3(geserPintu, 0, z + 0.5),
    bukaPintu(k) { pintu.scale.y = Math.max(1e-4, 1 - k); pintu.visible = k < 0.999; },
    bagian: { badan, tutup, pintu, bilah, papanNama, jendela, lorong, tepi, denyut: [papanNama, ...bilah], emas: [badan, papanNama, ...bilah] },
    setelKeadaan: keadaanLampu([b.jendela], lampu),
  };
  return g;
}

// ruangLatihan: lantai 6 × 0.1 × 5 dengan dua dinding rendah setinggi 1.8 di sisi belakang (bentuk L):
// "kiri" di tepi −x (kiri atas layar) dan "kanan" di tepi −z (kanan atas layar).
// jendela: [{ dinding: "kiri" | "kanan", lebar = 1.6, tinggi = 1.0, geser = 0, bawah = 0.5 }], geser dari tengah dinding
// menjauhi sudut belakang (kiri: ke +z, kanan: ke +x).
// userData.dinding.kiri/kanan = { pusat, rotasiY, panjang, tinggi }: pusat muka dalam dinding; benda yang mukanya +z
// diberi rotation.y = rotasiY supaya menempel menghadap ke dalam ruang (mis. papan tulis, jam). userData.atas: tinggi lantai.
export function ruangLatihan(opsi = {}) {
  const {
    lebar = 6, dalam = 5, tebalLantai = 0.1, tinggiDinding = 1.8, tebal = 0.15, jendela = [],
    warnaLantai = WARNA.lantai(), warnaDinding = W.zamrudRedup, nama = "ruang latihan", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const matLantai = bahanPadat(warnaLantai);
  matLantai.userData.warnaAbu = W.abuGelap;
  const lantai = bergaris(kotakBulat(lebar, tebalLantai, dalam, matLantai, { alas: true, radius: 0.03 }), bahanGaris(W.zamrudRedup, 2));
  const matDinding = bahanPadat(warnaDinding);
  const lubang = (sisi) => jendela.filter((j) => (j.dinding ?? "kanan") === sisi)
    .map((j) => ({ x: j.geser ?? 0, lebar: j.lebar ?? 1.6, tinggi: j.tinggi ?? 1.0, bawah: j.bawah ?? 0.5 }));
  const kiri = dindingBerlubang(dalam, tinggiDinding, tebal, lubang("kiri"), matDinding);
  kiri.rotation.y = -Math.PI / 2; // sumbu x dinding = +z dunia
  kiri.position.set(-lebar / 2 + tebal / 2, tebalLantai, 0);
  const pKanan = lebar - tebal;
  const kanan = dindingBerlubang(pKanan, tinggiDinding, tebal, lubang("kanan"), matDinding);
  kanan.position.set(tebal / 2, tebalLantai, -dalam / 2 + tebal / 2);
  g.add(lantai, kiri, kanan);
  const tepi = tepiDenyut([
    lantai,
    { w: tebal, h: tinggiDinding, d: dalam, induk: g, posisi: new THREE.Vector3(kiri.position.x, tebalLantai, 0) },
    { w: pKanan, h: tinggiDinding, d: tebal, induk: g, posisi: kanan.position },
  ]);
  const yTengah = tebalLantai + tinggiDinding / 2;
  g.userData = {
    nama, penting, atas: tebalLantai,
    dinding: {
      kiri: { pusat: new THREE.Vector3(-lebar / 2 + tebal, yTengah, 0), rotasiY: Math.PI / 2, panjang: dalam, tinggi: tinggiDinding },
      kanan: { pusat: new THREE.Vector3(tebal / 2, yTengah, -dalam / 2 + tebal), rotasiY: 0, panjang: pKanan, tinggi: tinggiDinding },
    },
    bagian: { lantai, dindingKiri: kiri, dindingKanan: kanan, tepi, denyut: [lantai, kiri, kanan], emas: [kiri, kanan] },
  };
  return g;
}

// ---------------------------------------------------------------- panggung dan podium
// ruangAcara: lantai ruang 6 × 0.1 × 5 bertepi zamrudRedup dengan garis batas dalam. userData.atas: tinggi lantai.
export function ruangAcara(opsi = {}) {
  const { lebar = 6, tebal = 0.1, dalam = 5, warna = WARNA.lantai(), garisDalam = true, nama = "ruang acara", penting = true } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  mat.userData.warnaAbu = W.abuGelap;
  const lantai = bergaris(kotakBulat(lebar, tebal, dalam, mat, { alas: true, radius: 0.03 }), bahanGaris(W.zamrudRedup, 2));
  g.add(lantai);
  if (garisDalam) {
    const x = lebar / 2 - 0.28, z = dalam / 2 - 0.28, y = tebal + 0.004;
    g.add(garisDari([-x, y, -z, x, y, -z, x, y, -z, x, y, z, x, y, z, -x, y, z, -x, y, z, -x, y, -z], bahanGaris(W.zamrudRedup, 1.5, 0.6)));
  }
  g.userData = { nama, penting, atas: tebal, bagian: { lantai, tepi: tepiDenyut([lantai]), denyut: [lantai], emas: [lantai] } };
  return g;
}

// panggung: pelat 5 × 0.4 × 3 zamrudRedup dengan lantai atas yang sedikit lebih terang dan tangga dua anak di muka +z.
// userData.atas: tinggi permukaan panggung (tempat figur berdiri); userData.kakiTangga: titik di depan tangga.
export function panggung(opsi = {}) {
  const { lebar = 5, tinggi = 0.4, dalam = 3, tangga = true, geserTangga = 0.3, warna = W.zamrudRedup, nama = "panggung", penting = true } = opsi;
  const g = new THREE.Group();
  const badan = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { alas: true, radius: 0.04 });
  const lantai = kotakBulat(lebar - 0.12, 0.03, dalam - 0.12, bahanPadat(campur(warna, W.zamrud, 0.22)), { alas: true, radius: 0.01 });
  lantai.position.y = tinggi;
  g.add(badan, lantai);
  const anak = [];
  const xT = geserTangga * lebar;
  if (tangga) {
    const matTangga = bahanPadat(campur(warna, W.zamrud, 0.12));
    matTangga.userData.warnaAbu = W.abuGelap;
    for (let i = 0; i < 2; i++) {
      const h = (tinggi * (2 - i)) / 3;
      const m = kotakBulat(0.9, h, 0.26, matTangga, { alas: true, radius: 0.02 });
      m.position.set(xT, 0, dalam / 2 + 0.13 + (1 - i) * 0.26);
      g.add(m);
      anak.push(m);
    }
  }
  g.userData = {
    nama, penting, atas: tinggi + 0.03, kakiTangga: new THREE.Vector3(xT, 0, dalam / 2 + 0.85),
    bagian: { badan, lantai, tangga: anak, tepi: tepiDenyut([badan]), denyut: [badan, lantai], emas: [badan, lantai] },
  };
  return g;
}

// podium: kotak 1.0 × 1.2 × 0.8 zamrudRedup menghadap kamera, tutup tipis dan panel muka.
// pion: true atau opsi pion → figur berdiri di atasnya (bagian.pion, penting: false). userData.atas: tinggi permukaan atas.
export function podium(opsi = {}) {
  const { lebar = 1.0, tinggi = 1.2, dalam = 0.8, warna = W.zamrudRedup, pion: opsiPion = false, nama = "podium", penting = true } = opsi;
  const g = new THREE.Group();
  const muka = new THREE.Group();
  muka.rotation.y = MUKA;
  g.add(muka);
  const badan = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { alas: true, radius: 0.04 });
  const matTutup = bahanPadat(campur(warna, W.pelat, 0.5));
  matTutup.userData.warnaAbu = W.abuGelap;
  const tutup = kotakBulat(lebar + 0.1, 0.06, dalam + 0.1, matTutup, { alas: true, radius: 0.02 });
  tutup.position.y = tinggi;
  const panel = kotakBulat(lebar * 0.62, tinggi * 0.42, 0.02, bahanPadat(campur(warna, W.zamrud, 0.4)), { alas: true, radius: 0.01 });
  panel.position.set(0, tinggi * 0.4, dalam / 2 + 0.008);
  muka.add(badan, tutup, panel);
  const atas = tinggi + 0.06;
  let figur = null;
  if (opsiPion) {
    figur = pion({ ...(opsiPion === true ? {} : opsiPion), penting: false });
    figur.position.y = atas;
    figur.rotation.y = MUKA;
    g.add(figur);
  }
  g.userData = { nama, penting, atas, bagian: { badan, tutup, panel, pion: figur, tepi: tepiDenyut([badan]), denyut: [badan], emas: [badan, tutup, panel] } };
  return g;
}

// alasPatung: alas bertingkat tanpa patung (1.6 × 0.4 × 1.6 di bawah, 1.0 × 1.2 × 1.0 di atas, tutup tipis),
// pelat bertepi zamrudRedup. bagian.tepi (denyut) = tepi tingkat atas. userData.atas: tinggi puncak.
export function alasPatung(opsi = {}) {
  const { bawah = [1.6, 0.4, 1.6], atas = [1.0, 1.2, 1.0], warna = W.pelat, warnaTepi = W.zamrudRedup, nama = "alas patung", penting = true } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  const garis = bahanGaris(warnaTepi, 2);
  const t1 = bergaris(kotakBulat(bawah[0], bawah[1], bawah[2], mat, { alas: true, radius: 0.03 }), garis);
  const t2 = bergaris(kotakBulat(atas[0], atas[1], atas[2], mat, { alas: true, radius: 0.03 }), garis);
  t2.position.y = bawah[1];
  const tutup = bergaris(kotakBulat(atas[0] + 0.12, 0.08, atas[2] + 0.12, mat, { alas: true, radius: 0.02 }), garis);
  tutup.position.y = bawah[1] + atas[1];
  g.add(t1, t2, tutup);
  g.userData = {
    nama, penting, atas: bawah[1] + atas[1] + 0.08,
    bagian: { tingkat: [t1, t2], tutup, tepi: tepiDenyut([t2, tutup]), denyut: [t2, tutup], emas: [t1, t2, tutup] },
  };
  return g;
}

// ---------------------------------------------------------------- pajangan dan struktur tetap
// stanPajangan: stan berdiri 1.0 × 1.4 × 0.6 menghadap kamera: meja pajang, panel belakang, papan kepala, dan isi:
//   "kertas"  tumpukan kertas di meja dan satu lembar di panel (tulisan)
//   "grafik"  tiga batang grafik di panel (riset)
//   "figur"   dua figur kecil bergandengan di meja (sosial)
//   "bingkai" bingkai dengan bentuk abstrak di panel (seni)
// bagian.isi: Group isi. klikEmas mengemaskan seluruh stan.
export function stanPajangan(opsi = {}) {
  const { isi = "kertas", lebar = 1.0, tinggi = 1.4, dalam = 0.6, warna = W.zamrudRedup, nama = "stan", penting = true } = opsi;
  const g = new THREE.Group();
  const muka = new THREE.Group();
  muka.rotation.y = MUKA;
  g.add(muka);
  const hMeja = 0.62;
  const meja = kotakBulat(lebar, hMeja, dalam, bahanPadat(warna), { alas: true, radius: 0.03 });
  const matPanel = bahanPadat(campur(warna, W.pelat, 0.55));
  matPanel.userData.warnaAbu = W.abuGelap;
  const hPanel = tinggi - hMeja - 0.12;
  const panel = kotakBulat(lebar, hPanel, 0.06, matPanel, { alas: true, radius: 0.02 });
  panel.position.set(0, hMeja, -dalam / 2 + 0.03);
  const kepalaStan = kotakBulat(lebar + 0.06, 0.12, 0.12, bahanPadat(W.zamrud), { alas: true, radius: 0.03 });
  kepalaStan.position.set(0, tinggi - 0.12, -dalam / 2 + 0.06);
  muka.add(meja, panel, kepalaStan);
  const grupIsi = new THREE.Group();
  const zPanel = -dalam / 2 + 0.07, yPanel = hMeja + hPanel / 2;
  const kertas = (w, h, d) => kotakBulat(w, h, d, bahanPadat(W.kertas), { radius: 0.004 });
  if (isi === "grafik") {
    const matBatang = bahanPadat(W.zamrud);
    [0.18, 0.3, 0.42].forEach((h, i) => {
      const m = kotakBulat(0.14, h, 0.05, matBatang, { alas: true, radius: 0.01 });
      m.position.set(-0.24 + i * 0.24, yPanel - 0.24, zPanel);
      grupIsi.add(m);
    });
    const dasar = kertas(0.72, 0.02, 0.05);
    dasar.position.set(0, yPanel - 0.25, zPanel);
    grupIsi.add(dasar);
  } else if (isi === "figur") {
    const matTaut = bahanPadat(W.pion);
    for (const s of [-1, 1]) {
      const f = pion({ skala: 0.42, penting: false });
      f.position.set(s * 0.13, hMeja, 0.02);
      f.rotation.y = 0;
      grupIsi.add(f);
    }
    const taut = kotakBulat(0.16, 0.03, 0.03, matTaut, { radius: 0.012 });
    taut.position.set(0, hMeja + 0.22, 0.02);
    grupIsi.add(taut);
  } else if (isi === "bingkai") {
    const matBingkai = bahanPadat(W.kertas);
    for (const [w, h, x, y] of [[0.56, 0.04, 0, 0.2], [0.56, 0.04, 0, -0.2], [0.04, 0.44, -0.26, 0], [0.04, 0.44, 0.26, 0]]) {
      const m = kotakBulat(w, h, 0.04, matBingkai, { radius: 0.008 });
      m.position.set(x, yPanel + y, zPanel);
      grupIsi.add(m);
    }
    const lingkar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 28).rotateX(Math.PI / 2), bahanPadat(W.zamrud));
    lingkar.position.set(-0.07, yPanel + 0.04, zPanel);
    const s = new THREE.Shape();
    s.moveTo(-0.11, -0.13); s.lineTo(0.17, -0.13); s.lineTo(0.05, 0.1); s.closePath();
    const segitiga = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false }), bahanPadat(W.krem));
    segitiga.position.set(0.02, yPanel, zPanel - 0.005);
    grupIsi.add(lingkar, segitiga);
  } else {
    if (isi !== "kertas") console.warn(`[kit] stanPajangan: isi "${isi}" tidak dikenal; dipakai "kertas".`);
    for (let i = 0; i < 4; i++) {
      const m = kertas(0.34, 0.022, 0.42);
      m.position.set(-0.12 + (i % 2) * 0.012, hMeja + 0.011 + i * 0.024, 0.04);
      m.rotation.y = (i % 2 ? 1 : -1) * 0.08 * (i + 1);
      grupIsi.add(m);
    }
    const lembar = kertas(0.3, 0.38, 0.02);
    lembar.position.set(0.16, yPanel, zPanel);
    lembar.rotation.z = -0.06;
    grupIsi.add(lembar);
  }
  grupIsi.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  muka.add(grupIsi);
  g.userData = { nama, penting, bagian: { meja, panel, kepala: kepalaStan, isi: grupIsi, tepi: tepiDenyut([meja, panel]), denyut: [meja, panel, kepalaStan] } };
  return g;
}

// kotakSuara: kotak 1.0 kertas dengan celah di atas dan sabuk zamrud.
//   alas: true → pelat 2.0 × 0.2 × 2.0 bertepi zamrudRedup di bawah kotak
//   pagarKaca: true → empat dinding kaca setinggi 1.6 di tepi alas, tiap dinding benda sendiri (bagian.pagar):
//              klikEmas(bagian.pagar) mengemaskan tepinya saja, bidang kaca tetap bening.
// bagian.tepi (denyut) = tepi alas bila ada. userData.celah: titik di mulut celah (tujuan amplop).
export function kotakSuara(opsi = {}) {
  const { ukuran = 1.0, alas = true, lebarAlas = 2.0, tebalAlas = 0.2, pagarKaca = false, tinggiPagar = 1.6, warna = W.kertas, nama = "kotak suara", penting = true } = opsi;
  const g = new THREE.Group();
  const y0 = alas ? tebalAlas : 0;
  let mAlas = null;
  if (alas) {
    mAlas = bergaris(kotakBulat(lebarAlas, tebalAlas, lebarAlas, bahanPadat(W.pelat), { alas: true, radius: 0.03 }), bahanGaris(W.zamrudRedup, 2));
    g.add(mAlas);
  }
  const kotak = kotakBulat(ukuran, ukuran * 0.94, ukuran, bahanPadat(warna), { alas: true, radius: 0.04 });
  kotak.position.y = y0;
  const matTutup = bahanPadat(campur(warna, W.abu, 0.3));
  const tutup = kotakBulat(ukuran + 0.05, ukuran * 0.06, ukuran + 0.05, matTutup, { alas: true, radius: 0.02 });
  tutup.position.y = y0 + ukuran * 0.94;
  const celah = kotakBulat(ukuran * 0.5, 0.012, ukuran * 0.08, bahanPadat(W.pelat), { alas: true, radius: 0 });
  celah.position.y = y0 + ukuran + 0.001;
  const sabuk = kotakBulat(ukuran + 0.02, ukuran * 0.12, ukuran + 0.02, bahanPadat(W.zamrud), { alas: true, radius: 0.01 });
  sabuk.position.y = y0 + ukuran * 0.62;
  g.add(kotak, tutup, celah, sabuk);
  const pagar = [];
  if (pagarKaca) {
    const s = lebarAlas / 2 - 0.03;
    for (const [x, z, ry] of [[0, s, 0], [s, 0, Math.PI / 2], [0, -s, 0], [-s, 0, Math.PI / 2]]) {
      const dinding = new THREE.Group();
      dinding.position.set(x, y0, z);
      dinding.rotation.y = ry;
      const kaca = kotakBulat(lebarAlas - 0.06, tinggiPagar, 0.04, bahanKaca(W.zamrud), { alas: true, radius: 0.01 });
      kaca.castShadow = false;
      const matGaris = bahanGaris(W.zamrudPijar, 2);
      const garis = garisTepi(kaca, { bahan: matGaris });
      kaca.add(garis);
      dinding.add(kaca);
      const k = { emas: 0, nyala: 0 };
      const warnaGaris = W.zamrudPijar.clone();
      dinding.userData = {
        nama: "pagar kaca", penting: false, bagian: { kaca, garis, tepi: [], denyut: [kaca] },
        setelKeadaan(n, nilai) {
          if (n !== "emas" && n !== "nyala") return false;
          k[n] = nilai;
          matGaris.color.copy(warnaGaris).lerp(W.emas, k.emas);
          return true;
        },
      };
      g.add(dinding);
      pagar.push(dinding);
    }
  }
  g.userData = {
    nama, penting, celah: new THREE.Vector3(0, y0 + ukuran + 0.01, 0),
    bagian: {
      kotak, tutup, celah, sabuk, alas: mAlas, pagar,
      tepi: tepiDenyut([mAlas ?? kotak]), denyut: [mAlas ?? kotak], emas: [kotak, tutup],
    },
  };
  return g;
}

// fondasiLempeng: jumlah lempeng bertumpuk (bawaan 5, masing-masing 3.2 × 0.18 × 3.2), gradasi zamrudRedup (bawah)
// → pelat (atas). Setiap lempeng benda sendiri (bagian.lempeng[i], urut dari BAWAH ke atas) dengan keadaannya sendiri:
// denyut, nyala, emas (mis. klikEmas(f.userData.bagian.lempeng, { jeda: 0.15 })), abu, pudar.
// label: teks per lempeng, urut dari BAWAH ke atas (brief yang menulis "dari atas ke bawah" dibalik dulu), dipasang di
// sisi kanan layar dengan garis penunjuk yang dikipas jarakLabel unit supaya tidak bertumpuk. opsiLabel diteruskan ke
// label3D (masuk, keluar, skala, ...). userData.jangkar[i]: titik ujung garis penunjuk (untuk label atau centang lain).
// userData.atas: tinggi permukaan lempeng teratas (tempat rumah). Label mengandaikan benda tidak diputar.
export function fondasiLempeng(opsi = {}) {
  const {
    jumlah = 5, lebar = 3.2, tebal = 0.18, label = [], opsiLabel = {}, jarakLabel = 0.32, panjangGaris = 0.45,
    warnaBawah = W.zamrudRedup, warnaAtas = W.pelat, nama = "fondasi", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const lempeng = [], jangkar = [], labelDibuat = [];
  const garisTampak = bahanGaris(W.zamrud, 1.5, 0.45);
  // Pusat kipas label: tengah tumpukan, dinaikkan bila perlu supaya label terbawah tidak turun di bawah tanah.
  const pusatY = Math.max((jumlah * tebal) / 2, ((jumlah - 1) / 2) * jarakLabel + 0.06);
  const kanan = new THREE.Vector3(Math.SQRT1_2, 0, -Math.SQRT1_2); // arah kanan layar
  for (let i = 0; i < jumlah; i++) {
    const p = new THREE.Group();
    p.position.y = i * tebal;
    const mat = bahanPadat(campur(warnaBawah, warnaAtas, jumlah > 1 ? i / (jumlah - 1) : 0));
    const m = bergaris(kotakBulat(lebar, tebal, lebar, mat, { alas: true, radius: 0.03 }), garisTampak);
    p.add(m);
    // Garis penunjuk dari sudut kanan layar lempeng ke titik label yang dikipas.
    const sudut = new THREE.Vector3(lebar / 2, tebal / 2, -lebar / 2);
    const ujung = sudut.clone().addScaledVector(kanan, panjangGaris);
    ujung.y = pusatY + (i - (jumlah - 1) / 2) * jarakLabel - i * tebal;
    const j = new THREE.Object3D();
    j.position.copy(ujung);
    p.add(j);
    jangkar.push(j);
    let garisLabel = null;
    if (label[i]) {
      garisLabel = garisDari([sudut.x, sudut.y, sudut.z, ujung.x, ujung.y, ujung.z], bahanGaris(W.zamrudRedup, 1.5, 0.8));
      p.add(garisLabel);
      labelDibuat.push(label3D(label[i], { pada: j, gaya: "benda", ax: 0, ay: 0.5, dx: 2, ...opsiLabel }));
    }
    p.userData = { nama: `lempeng ${i + 1}`, penting: false, bagian: { lempeng: m, garisLabel, tepi: tepiDenyut([m]), denyut: [m], emas: [m] } };
    g.add(p);
    lempeng.push(p);
  }
  g.userData = {
    nama, penting, atas: jumlah * tebal, jangkar, label: labelDibuat,
    bagian: { lempeng, tepi: lempeng.flatMap((p) => p.userData.bagian.tepi), denyut: lempeng, emas: lempeng },
  };
  return g;
}

// ---------------------------------------------------------------- lengkung audit
// lengkungAudit: lengkung terowongan audit (segmenKuis). Dua kaki silinder r 0.05 setinggi 0.8 di z lokal −1 dan +1, busur
// setengah torus r 1.0 (tabung 0.05) berpusat di y 0.8 pada bidang y-z lokal, dan alas silinder r 0.12 × 0.04 di bawah tiap
// kaki. Puncak busur di y 1.8. Bidang busur tegak lurus sumbu x lokal, jadi benda yang melaju di sumbu x lewat di bawahnya.
// Warna bawaan zamrudRedup. Keadaan "nyala" 0..1 menggeser warna ke zamrudPijar dengan emissive zamrudPijar KUAT_LENGKUNG
// (di bawah ambang bloom); "emas" dan keadaan lain seperti benda lain. Saat "emas" > 0, "nyala" berarti kurva klikEmas
// (emissive emas) seperti benda lain, bukan lampu. label: label3D gaya mikro di atas puncak (geser [0, 2.05, 0]).
// bagian: kaki[2] (z −1 lalu +1), busur, alas[2], tepi[1] (garis denyut sepanjang lengkung). userData.puncak: titik lokal puncak.
export const KUAT_LENGKUNG = 0.45;
export function lengkungAudit(opsi = {}) {
  const { warna = W.zamrudRedup, label = null, opsiLabel = {}, nama = "lengkung audit", penting = true } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  const pasang = (geo, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    return m;
  };
  const kaki = [-1, 1].map((z) => pasang(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16).translate(0, 0.4, 0), 0, 0, z));
  const alas = [-1, 1].map((z) => pasang(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24).translate(0, 0.02, 0), 0, 0, z));
  // Torus dibuat di bidang xy (busur dari +x lewat +y ke −x); diputar −90° pada y supaya x → z, jadi busur ada di bidang y-z.
  const busur = pasang(new THREE.TorusGeometry(1.0, 0.05, 12, 48, Math.PI).rotateY(-Math.PI / 2), 0, 0.8, 0);
  // Garis denyut: menyusuri lengkung di sisi +x (sisi yang terlihat kamera), tersembunyi sampai keadaan "denyut" > 0.
  const jalur = [[0.055, 0.04, -1], [0.055, 0.8, -1]];
  for (let i = 1; i < 32; i++) { const u = Math.PI * (1 - i / 32); jalur.push([0.055, 0.8 + Math.sin(u), Math.cos(u)]); }
  jalur.push([0.055, 0.8, 1], [0.055, 0.04, 1]);
  const ruas = [];
  for (let i = 0; i < jalur.length - 1; i++) ruas.push(...jalur[i], ...jalur[i + 1]);
  const matTepi = bahanGaris(W.zamrudPijar, 3, 0);
  matTepi.userData.tepiDenyut = true;
  const tepi = garisDari(ruas, matTepi);
  tepi.visible = false;
  g.add(tepi);

  // Lampu: "nyala" mengubah dasar bahan (warna dan emissive) supaya abu, pudar, emas, dan denyut tetap tersusun di atasnya.
  const dasar = catatDasar(mat);
  const mati = dasar.warna.clone(), pijar = W.zamrudPijar.clone();
  const semua = [...kaki, busur, ...alas];
  g.userData = {
    nama, penting, puncak: new THREE.Vector3(0, 1.8, 0),
    label: label ? label3D(label, { pada: g, gaya: "mikro", geser: [0, 2.05, 0], ...opsiLabel }) : null,
    bagian: { kaki, busur, alas, tepi: [tepi], denyut: semua, emas: semua },
    setelKeadaan(n, nilai) {
      if (n !== "nyala" || g.userData.keadaan?.emas > 0) return false; // selain lampu: penanganan bawaan kit
      const lampu = Math.min(1, Math.max(0, nilai));
      dasar.warna.copy(mati).lerp(pijar, lampu);
      dasar.emisif.copy(pijar);
      dasar.kuatEmisif = KUAT_LENGKUNG * lampu;
      keadaanBawaan(g, "emas", g.userData.keadaan?.emas ?? 0); // hitung ulang bahan dari dasar yang baru
      return true;
    },
  };
  return g;
}

// Daftar katalog: { nama, kategori, buat, contoh }.
export const DAFTAR_BANGUNAN = [
  { nama: "gerbangKampus", kategori: "bangunan", buat: gerbangKampus, contoh: {} },
  { nama: "gerbangKecil", kategori: "bangunan", buat: gerbangKecil, contoh: { label: "BAGAIMANA INI MEMBINA INSAN CITA?" } },
  { nama: "bingkaiPintu", kategori: "bangunan", buat: bingkaiPintu, contoh: {} },
  { nama: "gedungKelas", kategori: "bangunan", buat: gedungKelas, contoh: {} },
  { nama: "menaraKampus", kategori: "bangunan", buat: menaraKampus, contoh: {} },
  { nama: "rumahWarga", kategori: "bangunan", buat: rumahWarga, contoh: {} },
  { nama: "rumahKecil", kategori: "bangunan", buat: rumahKecil, contoh: {} },
  { nama: "rumahPotong", kategori: "bangunan", buat: rumahPotong, contoh: {} },
  { nama: "gedungCabang", kategori: "bangunan", buat: gedungCabang, contoh: {} },
  { nama: "menaraBadko", kategori: "bangunan", buat: menaraBadko, contoh: {} },
  { nama: "menaraPB", kategori: "bangunan", buat: menaraPB, contoh: {} },
  { nama: "ruangKarya", kategori: "bangunan", buat: ruangKarya, contoh: {} },
  { nama: "ruangLatihan", kategori: "bangunan", buat: ruangLatihan, contoh: { jendela: [{ dinding: "kanan", lebar: 1.6, tinggi: 1.0, geser: 1.2 }] } },
  { nama: "ruangAcara", kategori: "bangunan", buat: ruangAcara, contoh: {} },
  { nama: "panggung", kategori: "bangunan", buat: panggung, contoh: {} },
  { nama: "podium", kategori: "bangunan", buat: podium, contoh: { pion: true } },
  { nama: "alasPatung", kategori: "bangunan", buat: alasPatung, contoh: {} },
  { nama: "stanPajangan", kategori: "bangunan", buat: stanPajangan, contoh: { isi: "grafik" } },
  { nama: "kotakSuara", kategori: "bangunan", buat: kotakSuara, contoh: { alas: true, pagarKaca: true } },
  { nama: "fondasiLempeng", kategori: "bangunan", buat: fondasiLempeng, contoh: { label: ["KONSTITUSI", "PRAKTIK", "SEJARAH", "MISSION", "NDP"] } },
  { nama: "lengkungAudit", kategori: "bangunan", buat: lengkungAudit, contoh: { label: "KADERISASI" } },
];
