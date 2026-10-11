// Dunia Pustaka: ruang baca berlantai dengan dua rak buku, meja bundar, lima figur duduk, dan lima lentera padam.
// KONTRAK.md §7. Kunci benda, titik, opsi, dan penyimpangan dari prompt: docs/dunia-pustaka-rencana-arsip.md.
//
//   const d = duniaPustaka(v, { opsi: { rakKiri: { debu: true, bukuBesar: 6 } } });
//   d.benda.kursi1 … kursi5      figur pion duduk mengelilingi meja (di atas bangku1 … bangku5)
//   d.titik.meja                 pusat permukaan meja; d.titik.duduk[i], d.titik.depanKursi[i], d.titik.lentera[i], ...
//
// Lantai setebal 0.1: benda tambahan yang berdiri di lantai diletakkan di y 0.1 (d.titik.lantai.y).
// Nama kelompok "kursi", "bangku", dan "lentera" di `tanpa` dan `opsi` berlaku untuk semua anggotanya.
import * as THREE from "three";
import { titik, DEG } from "../inti/ruang.js";
import { pion } from "../benda/dasar.js";
import { ruangAcara } from "../benda/bangunan.js";
import { rakBuku, mejaBundar, kursiRendah, lentera } from "../benda/perabot.js";
import { susunDunia, luaskan } from "./_susun.js";

const N = 5;                 // kursi dan lentera
const Y_LANTAI = 0.1;        // permukaan lantai
const JARI_KURSI = 1.8;      // prompt: figur duduk pada radius 1.8 dari pusat meja
const JARI_LENTERA = 1.0;    // prompt: lentera melingkar radius 1.0
const Y_LENTERA = 3.0;       // prompt: lentera pada ketinggian y 3.0 (pusat bola)
const T_BANGKU = 0.3;        // kursiRendah bawaan
const MEJA = titik(0, 1.0, Y_LANTAI);

// Sudut ke-i di bidang (r, d) dari arah bawah layar, searah jarum jam di layar: kursi1 paling dekat ke penonton,
// lalu kiri depan, kiri belakang, kanan belakang, kanan depan. Tidak ada kursi tepat di belakang meja,
// sehingga figur yang berdiri di titik(0, -0.6) (pemateri, indikator 09) tidak bertabrakan.
const sudut = (i, n) => 90 * DEG + (i * 2 * Math.PI) / n;
const diLingkar = (pusat, jari, a, y) => pusat.clone().add(titik(jari * Math.cos(a), jari * Math.sin(a), 0)).setY(y);
const hadapKe = (dari, ke) => Math.atan2(ke.x - dari.x, ke.z - dari.z);

// opsi (selain tanpa, posisi, opsi, ganti):
//   bangku   true (bawaan): bangku rendah di bawah setiap figur duduk, jadi kursi tetap tampak saat figurnya
//            belum datang (indikator 14, 30). false: figur duduk langsung di lantai.
export function duniaPustaka(v, opsi = {}) {
  const { bangku = true } = opsi;
  const o = luaskan(opsi, { kursi: N, bangku: N, lentera: N });
  const pusat = (o.posisi?.meja ?? MEJA).clone();
  const yDuduk = Y_LANTAI + (bangku ? T_BANGKU : 0);
  const kursi = [], duduk = [], lampu = [];
  for (let i = 0; i < N; i++) {
    const a = sudut(i, N);
    kursi.push(diLingkar(pusat, JARI_KURSI, a, Y_LANTAI));
    duduk.push(diLingkar(pusat, JARI_KURSI, a, yDuduk));
    lampu.push(diLingkar(pusat, JARI_LENTERA, a, Y_LENTERA));
  }

  const resep = [
    // Lantai 8 × 0.1 × 8 sejajar layar (diputar 45°): lebarnya 8 unit di layar, muat di frustum 16 (lebar 9).
    { nama: "lantai", buat: (op) => ruangAcara({ lebar: 8, dalam: 8, nama: "lantai", ...op }), posisi: titik(0, 0), rotasi: 45 * DEG },
    // Rak menghadap kamera (sisi +z ke bawah layar), sejajar tepi belakang lantai. 64 buku (kamus: 40, hanya mengisi
    // separuh rak). rakKanan prompt titik(2.4, -3.0): puncaknya keluar zona atas 5 px.
    { nama: "rakKiri", buat: (op) => rakBuku({ benih: 11, buku: 64, nama: "rak kiri", ...op }), posisi: titik(-2.6, -2.8, Y_LANTAI), rotasi: 45 * DEG },
    { nama: "rakKanan", buat: (op) => rakBuku({ benih: 23, buku: 64, nama: "rak kanan", ...op }), posisi: titik(2.4, -2.9, Y_LANTAI), rotasi: 45 * DEG },
    { nama: "meja", buat: (op) => mejaBundar({ nama: "meja", ...op }), posisi: pusat },
  ];
  if (bangku) for (let i = 0; i < N; i++) {
    resep.push({ nama: `bangku${i + 1}`, buat: (op) => kursiRendah({ nama: `bangku ${i + 1}`, ...op }), posisi: kursi[i] });
  }
  for (let i = 0; i < N; i++) {
    resep.push({
      nama: `kursi${i + 1}`, buat: (op) => pion({ duduk: true, nama: `kursi ${i + 1}`, ...op }),
      posisi: duduk[i], rotasi: hadapKe(duduk[i], pusat),
    });
  }
  for (let i = 0; i < N; i++) {
    // Titik asal lentera di bawah bola; pusat bola tepat di y 3.0.
    const jari = o.opsi[`lentera${i + 1}`]?.radius ?? 0.25;
    resep.push({
      nama: `lentera${i + 1}`, buat: (op) => lentera({ nama: `lentera ${i + 1}`, ...op }),
      posisi: lampu[i].clone().setY(Y_LENTERA - jari),
    });
  }

  const { benda, urutan } = susunDunia(v, resep, o);

  const tinggiMeja = benda.meja?.userData.tinggiAtas ?? 0.75;
  const pMeja = (benda.meja?.position ?? pusat).clone();
  const depanRak = (rak) => rak && rak.localToWorld(new THREE.Vector3(0, 1.3, 0.3));
  return {
    benda, urutan,
    fokus: titik(0, 0, 0.8),
    H: 16,
    titik: {
      lantai: titik(0, 0, Y_LANTAI),                              // pusat permukaan lantai
      meja: pMeja.clone().setY(pMeja.y + tinggiMeja),             // pusat permukaan meja
      rakKiri: depanRak(benda.rakKiri),                           // muka rak, setengah tinggi (fokus cermin)
      rakKanan: depanRak(benda.rakKanan),
      kursi: kursi,                                               // titik lantai tiap kursi (tujuan figur yang datang)
      duduk: duduk,                                               // titik asal figur duduk (di atas bangku)
      atasKepala: duduk.map((p) => p.clone().setY(p.y + 0.95)),   // ujung ekor balonKata di atas figur duduk
      depanKursi: duduk.map((_, i) => diLingkar(pMeja, 0.95, sudut(i, N), pMeja.y + tinggiMeja)), // di meja, depan kursi i
      lentera: lampu,                                             // pusat bola tiap lentera
      pusatLentera: pMeja.clone().setY(Y_LENTERA),                // pusat lingkar lentera (lampu gagasan, indikator 30)
    },
  };
}
