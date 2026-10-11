// Pustaka benda: perabot dan perlengkapan (meja dan kursi, penyimpanan, papan dan layar, tanda dan lampu, perlengkapan lain).
// Rincian: kit/docs/benda-medan-perabot.md.
//
// KONTRAK bagian 5: pembuat(opsi = {}) → THREE.Group, titik asal di tengah alas (y = 0), userData { nama, penting, bagian, setelKeadaan }.
// Sisi depan benda = +z lokal (menghadap kiri bawah layar). Papan, layar, jam, dan panji memakai `hadap: true` (bawaan):
// grup diputar 45° sehingga mukanya menghadap kamera. Bagian yang bergerak (pintu, laci, jarum, kain, isi layar) diatur lewat
// penyetel di userData yang dipanggil adegan dengan nilai turunan t; benda sendiri tidak bergantung pada waktu.
import * as THREE from "three";
import { W, cssWarna } from "../inti/tema.js";
import { bahanPadat, bahanKaca, bahanGaris, kotakBulat, garisTepi, garisDari, EMAS } from "../inti/bahan.js";
import { acak, klem, halus } from "../inti/waktu.js";
import { aktif } from "../inti/aktif.js";
import { pion } from "./dasar.js";
import { bantuBenda, lapisanDebu } from "./medan.js";

const {
  V, ATAS, geserHSL, redup, kertasAman, tepiDenyut, denyutAman, gantiDasar, segarkan, aturFaktor, jangkar, pasangLabel, rampung, ruas, lingkaran, teksturKanvas, namai,
} = bantuBenda;
const HADAP = Math.PI / 4;

// Silinder dengan titik asal di alasnya.
function silinder(r, h, mat, { rAtas = r, segmen = 32 } = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rAtas, r, h, segmen).translate(0, h / 2, 0), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}
// Garis tepi tipis untuk benda berwarna pelat (gelap) supaya bentuknya terbaca di atas tanah, seperti gerbang kit.
const tepiPelat = (m, warna = W.zamrudRedup) => { m.add(garisTepi(m, { warna, lebar: 1.5, opasitas: 0.9 })); return m; };
const kertasRedup = () => geserHSL(W.kertas, -0.1, -0.16);

// ================================================================ meja dan kursi
// mejaBundar: daun silinder radius 1.3 tebal 0.1 di atas kaki radius 0.2 tinggi 0.65 (zamrudRedup), alas kaki pelat.
// userData.tinggiAtas: tinggi permukaan meja (0.75).
export function mejaBundar(opsi = {}) {
  const { radius = 1.3, tebal = 0.1, kakiR = 0.2, kakiT = 0.65, warna = W.zamrudRedup, nama = "meja bundar", penting = true } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  const alas = silinder(0.55, 0.06, bahanPadat(W.pelat), { rAtas: 0.5 });
  const kaki = silinder(kakiR, kakiT, mat, { rAtas: kakiR * 0.8 });
  const daun = silinder(radius, tebal, mat, { segmen: 64 });
  daun.position.y = kakiT;
  g.add(alas, kaki, daun);
  const tepi = tepiDenyut(ruas(lingkaran(radius + 0.01, 72, kakiT + tebal), true));
  g.add(tepi);
  return rampung(g, { nama, penting, tinggiAtas: kakiT + tebal, bagian: { daun, kaki, alas, tepi: [tepi], denyut: [daun], emas: [daun] } });
}

// Meja berkaki empat (mejaKotak, mejaKecil). padat: true = satu kotak utuh (meja blok).
function mejaKaki(opsi, bawaan) {
  const {
    lebar = bawaan.lebar, tinggi = bawaan.tinggi, dalam = bawaan.dalam, tebal = 0.1, padat = false, warna = W.zamrudRedup,
    nama = bawaan.nama, penting = true,
  } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  let daun;
  const kaki = [];
  if (padat) {
    daun = kotakBulat(lebar, tinggi, dalam, mat, { alas: true });
    g.add(daun);
  } else {
    daun = kotakBulat(lebar, tebal, dalam, mat, { alas: true, radius: 0.04 });
    daun.position.y = tinggi - tebal;
    g.add(daun);
    const t = Math.min(0.1, lebar * 0.08);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const k = kotakBulat(t, tinggi - tebal, t, mat, { alas: true, radius: 0.02 });
      k.position.set(sx * (lebar / 2 - t / 2 - 0.08), 0, sz * (dalam / 2 - t / 2 - 0.08));
      g.add(k);
      kaki.push(k);
    }
  }
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(tepi);
  return rampung(g, { nama, penting, tinggiAtas: tinggi, bagian: { daun, kaki, tepi: [tepi], denyut: [daun], emas: [daun] } });
}
// mejaKotak: meja 2.4 × 0.8 × 1.2 (zamrudRedup), daun 0.1 dan empat kaki. padat: true = kotak utuh.
export const mejaKotak = (opsi = {}) => mejaKaki(opsi, { lebar: 2.4, tinggi: 0.8, dalam: 1.2, nama: "meja" });
// mejaKecil: meja 1.0 × 0.6 × 0.6.
export const mejaKecil = (opsi = {}) => mejaKaki(opsi, { lebar: 1.0, tinggi: 0.6, dalam: 0.6, nama: "meja kecil" });

// kursiKotak: dudukan 0.4 × 0.06 × 0.4 setinggi 0.42, sandaran 0.4 × 0.4 × 0.06 di sisi −z, empat kaki. Warna pelat bergaris
// tepi zamrudRedup (tepi: false untuk polos). Duduk menghadap +z. userData.titikDuduk: titik lokal di atas dudukan.
export function kursiKotak(opsi = {}) {
  const {
    lebar = 0.4, dalam = 0.4, tinggiDuduk = 0.42, tebalDuduk = 0.06, sandaran = 0.4, tebalSandaran = 0.06, warna = W.pelat,
    tepi: bertepi = true, nama = "kursi", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  const duduk = kotakBulat(lebar, tebalDuduk, dalam, mat, { alas: true, radius: 0.02 });
  duduk.position.y = tinggiDuduk - tebalDuduk;
  const sandar = kotakBulat(lebar, sandaran, tebalSandaran, mat, { alas: true, radius: 0.02 });
  sandar.position.set(0, tinggiDuduk, -dalam / 2 + tebalSandaran / 2);
  g.add(duduk, sandar);
  if (bertepi) { tepiPelat(duduk); tepiPelat(sandar); }
  const kaki = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const k = kotakBulat(0.04, tinggiDuduk - tebalDuduk, 0.04, mat, { alas: true, radius: 0.01 });
    k.position.set(sx * (lebar / 2 - 0.04), 0, sz * (dalam / 2 - 0.04));
    g.add(k);
    kaki.push(k);
  }
  const tepi = tepiDenyut({ w: lebar, h: tinggiDuduk + sandaran, d: dalam, alas: true });
  g.add(tepi);
  return rampung(g, {
    nama, penting, titikDuduk: V(0, tinggiDuduk, 0.02),
    bagian: { duduk, sandaran: sandar, kaki, tepi: [tepi], denyut: [duduk, sandar], emas: [duduk, sandar] },
  });
}

// kursiRendah: bangku silinder radius 0.25 tinggi 0.3 (zamrudRedup) bertepi atas membulat. userData.titikDuduk.
export function kursiRendah(opsi = {}) {
  const { radius = 0.25, tinggi = 0.3, warna = W.zamrudRedup, nama = "kursi rendah", penting = true } = opsi;
  const g = new THREE.Group();
  const e = Math.min(0.05, radius * 0.2);
  const profil = [[0, 0], [radius * 0.92, 0], [radius, 0.03], [radius, tinggi - e], [radius - e * 0.3, tinggi - e * 0.3], [radius - e, tinggi], [0, tinggi]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const badan = new THREE.Mesh(new THREE.LatheGeometry(profil, 40), bahanPadat(warna));
  badan.castShadow = badan.receiveShadow = true;
  g.add(badan);
  const tepi = tepiDenyut(ruas(lingkaran(radius + 0.01, 48, tinggi), true));
  g.add(tepi);
  return rampung(g, { nama, penting, titikDuduk: V(0, tinggi, 0), bagian: { badan, tepi: [tepi], denyut: [badan], emas: [badan] } });
}

// ================================================================ penyimpanan
// Rangka rak terbuka: alas, dua sisi, punggung, atap, dan papan rak. Mengembalikan bagian dan tinggi lantai tiap ruang.
function rangkaRak(g, { lebar, tinggi, dalam, rak, warnaSisi, warnaPunggung }) {
  const sisi = 0.08, alasT = 0.1, atapT = 0.08, papanT = 0.05;
  const matSisi = bahanPadat(warnaSisi), matPunggung = bahanPadat(warnaPunggung);
  const rangka = [];
  const tambah = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); rangka.push(m); return m; };
  tambah(kotakBulat(lebar, alasT, dalam, matSisi, { alas: true, radius: 0.03 }), 0, 0, 0);
  tambah(kotakBulat(lebar + 0.06, atapT, dalam + 0.04, matSisi, { alas: true, radius: 0.03 }), 0, tinggi - atapT, 0.01);
  for (const s of [-1, 1]) tambah(kotakBulat(sisi, tinggi - alasT - atapT, dalam, matSisi, { alas: true, radius: 0.02 }), s * (lebar / 2 - sisi / 2), alasT, 0);
  tambah(kotakBulat(lebar - 2 * sisi, tinggi - alasT - atapT, 0.04, matPunggung, { alas: true, radius: 0.01 }), 0, alasT, -dalam / 2 + 0.02);
  const dalamT = tinggi - alasT - atapT;
  const ruang = (dalamT - (rak - 1) * papanT) / rak;
  const lantai = [], papan = [];
  for (let i = 0; i < rak; i++) {
    const y = alasT + i * (ruang + papanT);
    lantai.push(y);
    if (i > 0) {
      const p = kotakBulat(lebar - 2 * sisi, papanT, dalam - 0.06, matSisi, { alas: true, radius: 0.015 });
      p.position.set(0, y - papanT, 0.01);
      g.add(p);
      papan.push(p);
    }
  }
  return { rangka, papan, lantai, ruang, lebarDalam: lebar - 2 * sisi, zPunggung: -dalam / 2 + 0.04 };
}
const warnaRangka = () => geserHSL(W.zamrudRedup, -0.22, -0.07);

// rakBuku: rak 3.0 × 2.6 × 0.6 (pelat dan rangka gelap), empat ruang, ±40 buku kecil berbenih (lebar 0.12–0.2, tinggi ±0.5,
// dalam 0.45) berwarna turunan token gelap.
//   bukuBesar  jumlah buku besar 0.25 × 0.6 × 0.5 hsl(42, 20%, 40%) di ruang `rakBesar` (0 = bawah; bawaan 2, rak tengah atas)
//   debu       true = lapisan debu di atas papan dan buku (aturDebu(k)); kosong = tanpa buku; benih
// bagian: rangka, rak (papan), buku[], bukuBesar[], debu. emas: buku besar bila ada, selain itu semua buku.
export function rakBuku(opsi = {}) {
  const {
    lebar = 3, tinggi = 2.6, dalam = 0.6, rak = 4, buku = 40, benih = 5, bukuBesar = 0, rakBesar = 2, debu = false, kosong = false,
    warnaSisi = warnaRangka(), warnaPunggung = W.pelat, nama = "rak buku", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const R = rangkaRak(g, { lebar, tinggi, dalam, rak, warnaSisi, warnaPunggung });
  const r = acak(benih);
  const palet = [
    W.zamrudRedup, geserHSL(W.zamrudRedup, -0.2, 0.07), W.abuGelap, geserHSL(W.abuGelap, 0.06, 0.1),
    geserHSL(W.zamrud, -0.3, -0.07), geserHSL(W.kertas, -0.12, -0.22), geserHSL(W.zamrudRedup, -0.38, -0.04),
  ];
  const matPita = bahanPadat(kertasRedup());
  const daftarBuku = [], daftarBesar = [];
  const x0 = -R.lebarDalam / 2 + 0.03, x1 = R.lebarDalam / 2 - 0.03;
  const bukuPerRak = Math.round(buku / rak);
  const pita = (b, w, h, d) => {
    for (const y of [-0.27, 0.27]) {
      const p = kotakBulat(w * 0.78, 0.022, 0.01, matPita, { radius: 0.004 });
      p.position.set(0, y * h, d / 2 + 0.004);
      p.castShadow = false;
      b.add(p);
    }
  };
  if (!kosong) for (let i = 0; i < rak; i++) {
    const yLantai = R.lantai[i];
    let x = x0;
    if (bukuBesar > 0 && i === rakBesar) {
      const h = Math.min(0.6, R.ruang - 0.03), d = Math.min(0.5, dalam - 0.1);
      const matBesar = () => bahanPadat(geserHSL(W.emas, -0.32, -0.18));
      for (let k = 0; k < bukuBesar && x + 0.25 < x1; k++) {
        const b = kotakBulat(0.25, h, d, matBesar(), { alas: true, radius: 0.02 });
        b.position.set(x + 0.125, yLantai, R.zPunggung + d / 2 + 0.01);
        pita(b, 0.25, h, d);
        b.children.forEach((c) => c.position.setY(c.position.y + h / 2));
        g.add(b);
        daftarBesar.push(b);
        x += 0.26;
      }
      x += 0.04;
    }
    const miringDi = r() < 0.6 ? 3 + Math.floor(r() * (bukuPerRak - 3)) : -1;
    for (let k = 0; k < bukuPerRak; k++) {
      const w = 0.12 + r() * 0.08, h = Math.min(R.ruang - 0.06, 0.42 + r() * 0.1), d = 0.45;
      const c = palet[Math.floor(r() * palet.length)];
      const b = kotakBulat(w, h, d, bahanPadat(geserHSL(c, 0, (r() - 0.5) * 0.05)), { alas: true, radius: 0.012 });
      const z = R.zPunggung + d / 2 + 0.01;
      if (k === miringDi) {
        // Buku condong ke kiri, bersandar pada buku sebelumnya.
        const th = 0.32;
        const xa = x + h * Math.sin(th) + 0.004;
        if (xa + w > x1) break;
        b.rotation.z = th;
        // Titik asal buku di tengah alasnya: sudut kiri bawah diletakkan di (xa, lantai), puncak kirinya menyentuh buku sebelumnya.
        b.position.set(xa + (w / 2) * Math.cos(th), yLantai + (w / 2) * Math.sin(th), z);
        x = xa + w * Math.cos(th) + 0.05;
      } else {
        if (x + w > x1) break;
        b.position.set(x + w / 2, yLantai, z);
        x += w + 0.006;
      }
      if (r() < 0.5) { pita(b, w, h, d); b.children.forEach((ch) => ch.position.setY(ch.position.y + h / 2)); }
      g.add(b);
      daftarBuku.push(b);
    }
  }
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(tepi);
  rampung(g, {
    nama, penting, lantaiRak: R.lantai,
    bagian: {
      rangka: R.rangka, rak: R.papan, buku: namai(daftarBuku, "buku"), bukuBesar: namai(daftarBesar, "buku besar"), tepi: [tepi], denyut: [...R.rangka, ...R.papan],
      emas: daftarBesar.length ? daftarBesar : daftarBuku,
    },
  });
  if (debu) lapisanDebu(g, { jumlah: 260, benih: benih + 100, bagian: [...R.papan, ...R.rangka, ...daftarBuku, ...daftarBesar] });
  return g;
}

// rakKecil: rak terbuka 1.2 × 1.2 × 0.4 dengan dua ruang, kosong. userData.titikRak(i): titik lokal di tengah lantai ruang i.
export function rakKecil(opsi = {}) {
  const { lebar = 1.2, tinggi = 1.2, dalam = 0.4, rak = 2, warnaSisi = warnaRangka(), warnaPunggung = W.pelat, nama = "rak kecil", penting = true } = opsi;
  const g = new THREE.Group();
  const R = rangkaRak(g, { lebar, tinggi, dalam, rak, warnaSisi, warnaPunggung });
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(tepi);
  return rampung(g, {
    nama, penting, lantaiRak: R.lantai, titikRak: (i, out = V()) => out.set(0, R.lantai[klem(i, 0, rak - 1)], 0.02),
    bagian: { rangka: R.rangka, rak: R.papan, tepi: [tepi], denyut: [...R.rangka, ...R.papan], emas: [...R.rangka, ...R.papan] },
  });
}

// lemari: lemari sekretariat 1.8 × 2.5 × 0.78 (zamrudRedup, dalam pelat) dengan dua pintu berengsel di tepi luar,
// dua papan rak (tiga ruang), dan pelat nama di mahkota.
//   isi     "map" (binder rapi, bawaan), "kusam" (map abu miring), "piala" (tiga piala), "kosong"
//   kaca    true = pintu kaca berbingkai (isi tetap terlihat saat tertutup); bawaan isi "piala"
//   buka    0..1 awal; aturPintu(k, kKanan = k) membuka pintu (0 tertutup, 1 terbuka 100°)
//   label   teks label HTML di pelat nama (mis. "SEKRETARIAT")
// bagian: pintu[] (grup engsel), daun[], rak[], map[], piala[], badan[]. emas: map bila ada, selain itu badan.
// Denyut: tepi tiap ruang rak (rak kosong yang berdenyut).
export function lemari(opsi = {}) {
  const {
    lebar: w = 1.8, tinggi: h = 2.5, dalam: d = 0.78, kaca = false, isi = kaca ? "piala" : "map", buka = 0, benih = 4,
    warna = W.zamrudRedup, warnaPintu = geserHSL(W.zamrudRedup, -0.12, 0.05), label = null, opsiLabel = {}, nama = "lemari", penting = true,
  } = opsi;
  const t = 0.06, y0 = 0.12;
  const g = new THREE.Group();
  const matBadan = bahanPadat(warna), matDalam = bahanPadat(W.pelat);
  const badan = [];
  const tambah = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); badan.push(m); return m; };
  tambah(kotakBulat(w - 0.08, y0, d - 0.1, matDalam, { alas: true, radius: 0.02 }), 0, 0, 0);
  for (const s of [-1, 1]) tambah(kotakBulat(t, h - y0, d, matBadan, { alas: true, radius: 0.012 }), s * (w / 2 - t / 2), y0, 0);
  tambah(kotakBulat(w, h - y0, t, matBadan, { alas: true, radius: 0.01 }), 0, y0, -d / 2 + t / 2);
  tambah(kotakBulat(w - 2 * t, t, d - t, matBadan, { alas: true, radius: 0.005 }), 0, y0, t / 2);
  tambah(kotakBulat(w + 0.12, 0.12, d + 0.1, matBadan, { alas: true, radius: 0.025 }), 0, h, 0.01);
  const dinding = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * t, h - y0 - t), matDalam);
  dinding.position.set(0, y0 + t + (h - y0 - t) / 2, -d / 2 + t + 0.003);
  dinding.receiveShadow = true;
  g.add(dinding);
  // Papan rak dan ruang.
  const rakY = [y0 + (h - y0) * 0.33, y0 + (h - y0) * 0.62];
  const rak = rakY.map((y) => {
    const p = kotakBulat(w - 2 * t, 0.045, d - t - 0.03, matBadan, { alas: true, radius: 0.01 });
    p.position.set(0, y, t / 2 - 0.015);
    g.add(p);
    return p;
  });
  const lantaiRuang = [y0 + t, rakY[0] + 0.045, rakY[1] + 0.045], atapRuang = [rakY[0], rakY[1], h];
  const zIsi = -d / 2 + t + 0.02;
  const matTepi = bahanGaris(W.zamrudPijar, 3, 0);
  matTepi.userData.tepiDenyut = true;
  const tepi = lantaiRuang.map((y, i) => {
    const l = garisTepi({ w: w - 2 * t - 0.04, h: atapRuang[i] - y - 0.02, d: d - t - 0.06, alas: true }, { bahan: matTepi });
    l.position.set(0, y + 0.01, t / 2);
    l.visible = false;
    g.add(l);
    return l;
  });
  // Pelat nama.
  const pelat = kotakBulat(0.9, 0.16, 0.02, bahanPadat(kertasRedup()), { radius: 0.01 });
  pelat.position.set(0, h + 0.06, d / 2 + 0.07);
  g.add(pelat);
  const lbl = pasangLabel(label, jangkar(g, 0, h + 0.2, d / 2 + 0.08), { gaya: "kotak", ...opsiLabel });
  // Isi.
  const r = acak(benih);
  const map = [], piala_ = [];
  if (isi === "map") {
    const warnaMap = [geserHSL(W.zamrudRedup, -0.08, 0.06), kertasRedup(), geserHSL(W.zamrud, -0.22, -0.05)];
    lantaiRuang.forEach((y, li) => {
      const hMap = Math.min(0.56, atapRuang[li] - y - 0.1);
      for (let i = 0; i < 9; i++) {
        const b = kotakBulat(0.14, hMap, d * 0.62, bahanPadat(warnaMap[(i + li) % 3]), { alas: true, radius: 0.012 });
        b.position.set(-w / 2 + t + 0.12 + i * 0.172, y, zIsi + (d * 0.62) / 2);
        const lb = kotakBulat(0.085, 0.13, 0.01, bahanPadat(kertasRedup()), { radius: 0.004 });
        lb.position.set(0, hMap * 0.62, (d * 0.62) / 2 + 0.004);
        lb.castShadow = false;
        b.add(lb);
        g.add(b);
        map.push(b);
      }
    });
  } else if (isi === "kusam") {
    const warnaKusam = [W.abu, W.abuGelap, geserHSL(W.kertas, -0.18, -0.3)];
    lantaiRuang.forEach((y, li) => {
      const hMap = Math.min(0.52, atapRuang[li] - y - 0.12);
      const n = 3 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) {
        const rebah = r() < 0.25;
        const b = rebah
          ? kotakBulat(0.56, 0.06, d * 0.58, bahanPadat(warnaKusam[i % 3]), { alas: true, radius: 0.01 })
          : kotakBulat(0.07, hMap, d * 0.58, bahanPadat(warnaKusam[i % 3]), { alas: true, radius: 0.01 });
        b.position.set(-w / 2 + t + 0.15 + i * 0.27 + r() * 0.06, y, zIsi + (d * 0.58) / 2);
        if (!rebah) b.rotation.z = -(r() * 0.35);
        g.add(b);
        map.push(b);
      }
    });
  } else if (isi === "piala") {
    for (let i = 0; i < 3; i++) {
      // Isi tidak menerima bayangan: ruang dalam lemari hampir seluruhnya terbayangi papan rak di atasnya.
      const p = piala({ skala: 0.8, penting: false, nama: `piala ${i + 1}` });
      p.position.set([-0.62, -0.2, 0.42][i] * (w / 1.8), lantaiRuang[1], zIsi + 0.26);
      p.traverse((o) => { if (o.isMesh) o.receiveShadow = false; });
      g.add(p);
      piala_.push(p);
    }
  }
  // Pintu: engsel di tepi luar, terbuka ke +z.
  const lw = w / 2 - 0.008, lh = h - y0 - 0.04;
  const daun = [];
  const pintu = [-1, 1].map((sisi) => {
    const engsel = new THREE.Group();
    engsel.position.set((sisi * w) / 2, 0, d / 2);
    const matPintu = bahanPadat(warnaPintu), matGagang = bahanPadat(kertasRedup()); // tiap daun pintu punya bahannya sendiri
    const cx = (-sisi * lw) / 2, cy = y0 + 0.02;
    if (kaca) {
      for (const [bw, bh, x, y] of [[lw, 0.1, cx, cy], [lw, 0.1, cx, cy + lh - 0.1], [0.1, lh, cx - lw / 2 + 0.05, cy], [0.1, lh, cx + lw / 2 - 0.05, cy]]) {
        const b = kotakBulat(bw, bh, 0.05, matPintu, { alas: true, radius: 0.012 });
        b.position.set(x, y, 0.025);
        engsel.add(b);
        daun.push(b);
      }
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(lw - 0.2, lh - 0.2), bahanKaca(W.zamrud, { side: THREE.DoubleSide, forceSinglePass: true }));
      panel.position.set(cx, cy + lh / 2, 0.025);
      panel.renderOrder = 1;
      engsel.add(panel);
      daun.push(panel);
      const kilau = garisDari([cx - lw * 0.3, cy + lh * 0.55, 0.03, cx - lw * 0.05, cy + lh * 0.8, 0.03, cx - lw * 0.3, cy + lh * 0.42, 0.03, cx + lw * 0.05, cy + lh * 0.78, 0.03],
        bahanGaris(redup(W.kertas, 0.8), 1.5, 0.35));
      engsel.add(kilau);
    } else {
      const lembar = kotakBulat(lw, lh, 0.045, matPintu, { alas: true, radius: 0.012 });
      lembar.position.set(cx, cy, 0.024);
      engsel.add(lembar);
      daun.push(lembar);
      const matPanel = bahanPadat(geserHSL(warnaPintu, 0, 0.03));
      for (const [py, ph] of [[cy + 0.14, lh * 0.42], [cy + 0.24 + lh * 0.42, lh * 0.36]]) {
        const p = kotakBulat(lw - 0.2, ph, 0.02, matPanel, { alas: true, radius: 0.008 });
        p.position.set(cx, py, 0.054);
        engsel.add(p);
      }
    }
    const gagang = kotakBulat(0.045, 0.3, 0.05, matGagang, { alas: true, radius: 0.018 });
    gagang.position.set(-sisi * (lw - 0.09), cy + lh * 0.42, 0.075);
    engsel.add(gagang);
    g.add(engsel);
    return engsel;
  });
  const SUDUT = (100 * Math.PI) / 180;
  function aturPintu(k, kKanan = k) {
    pintu[0].rotation.y = -klem(k) * SUDUT;
    pintu[1].rotation.y = klem(kKanan) * SUDUT;
  }
  aturPintu(buka);
  return rampung(g, {
    nama, penting, aturPintu, label: lbl, lantaiRuang,
    bagian: { pintu, daun, rak, map: namai(map, "map"), piala: piala_, badan, pelat, tepi, denyut: [...rak, ...badan], emas: map.length ? map : badan },
  });
}

// folderBersama: lemari kecil 1.4 × 1.6 × 1.0 dengan empat laci bertumpuk yang bisa ditarik, berlabel HTML.
//   label     teks per laci (bawaan NOTULENSI, KEPUTUSAN, LAPORAN, DOKUMENTASI); sisiLabel "kiri" (bawaan) | "kanan"
//   buka      array 0..1 awal per laci; aturLaci(i, k) menarik laci ke-i (0 = tertutup, 1 = terbuka 0.55 × dalam)
// bagian: laci[] (grup laci: muka, gagang, baki, kertas), muka[]; userData.titikLaci(i): titik lokal di atas baki laci i.
export function folderBersama(opsi = {}) {
  const {
    lebar = 1.4, tinggi = 1.6, dalam = 1.0, laci: nLaci = 4, label = ["NOTULENSI", "KEPUTUSAN", "LAPORAN", "DOKUMENTASI"], opsiLabel = {},
    sisiLabel = "kiri", buka = [], warna = W.zamrudRedup, warnaMuka = geserHSL(W.zamrudRedup, -0.12, 0.06), nama = "folder bersama", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const kaki = 0.08;
  const badan = kotakBulat(lebar, tinggi - kaki, dalam, bahanPadat(warna), { alas: true, radius: 0.04 });
  badan.position.y = kaki;
  const alas = kotakBulat(lebar - 0.1, kaki, dalam - 0.1, bahanPadat(W.pelat), { alas: true, radius: 0.02 });
  g.add(alas, badan);
  const hLaci = (tinggi - kaki - 0.08) / nLaci;
  const laci = [], muka = [], lbl = [];
  const tarik = dalam * 0.55;
  for (let i = 0; i < nLaci; i++) {
    const L = new THREE.Group();
    const matGagang = bahanPadat(kertasRedup()), matKertas = bahanPadat(kertasAman()), matBaki = bahanPadat(W.pelat); // per laci
    const yb = kaki + 0.04 + (nLaci - 1 - i) * hLaci; // laci 0 di atas
    L.position.set(0, yb, dalam / 2);
    const mk = kotakBulat(lebar - 0.1, hLaci - 0.05, 0.05, bahanPadat(warnaMuka), { alas: true, radius: 0.015 });
    mk.position.set(0, 0.025, 0.025);
    const gg = kotakBulat(0.3, 0.045, 0.05, matGagang, { radius: 0.018 });
    gg.position.set(0, hLaci * 0.42, 0.075);
    const plakat = kotakBulat(0.22, 0.09, 0.008, matGagang, { radius: 0.006 });
    plakat.position.set(0, hLaci * 0.72, 0.054);
    plakat.castShadow = false;
    L.add(mk, gg, plakat);
    // Baki terbuka di belakang muka laci (tersembunyi di dalam badan saat tertutup).
    const bw = lebar - 0.2, bh = hLaci - 0.12, bd = dalam - 0.12;
    for (const [w_, h_, d_, x, y, z] of [[bw, 0.02, bd, 0, 0.03, -bd / 2], [0.02, bh, bd, -bw / 2, 0.03, -bd / 2], [0.02, bh, bd, bw / 2, 0.03, -bd / 2], [bw, bh, 0.02, 0, 0.03, -bd]]) {
      const p = kotakBulat(w_, h_, d_, matBaki, { alas: true, radius: 0.005 });
      p.position.set(x, y, z);
      L.add(p);
    }
    for (let k = 0; k < 3; k++) {
      const kt = kotakBulat(bw - 0.16, bh * 0.8, 0.012, matKertas, { alas: true, radius: 0.004 });
      kt.position.set(0, 0.05, -0.12 - k * 0.09);
      kt.rotation.x = -0.12;
      L.add(kt);
    }
    g.add(L);
    laci.push(L);
    muka.push(mk);
    const xl = sisiLabel === "kanan" ? lebar / 2 + 0.02 : -lebar / 2 - 0.02;
    lbl.push(label ? pasangLabel(label[i], jangkar(g, xl, yb + hLaci / 2, dalam / 2 + 0.06), { ax: sisiLabel === "kanan" ? 0 : 1, ay: 0.5, dx: sisiLabel === "kanan" ? 10 : -10, ...opsiLabel }) : null);
  }
  function aturLaci(i, k) {
    const L = laci[i];
    if (L) L.position.z = dalam / 2 + tarik * klem(k);
  }
  buka.forEach((k, i) => aturLaci(i, k));
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(tepi);
  return rampung(g, {
    nama, penting, aturLaci, label: lbl,
    titikLaci: (i, out = V()) => out.set(0, laci[i].position.y + hLaci * 0.5, laci[i].position.z - dalam * 0.45),
    bagian: { badan, laci: namai(laci, "laci"), muka, tepi: [tepi], denyut: [badan, ...muka], emas: [badan, ...muka] },
  });
}

// kotakCelah: kotak 0.7 × 0.6 × 0.7 (kertas) dengan celah gelap di atasnya (kotak pertanyaan, kotak usulan).
//   celah [panjang, lebar], debu: true = lapisan debu di atas (aturDebu), label (label3D di atas kotak)
// userData.titikCelah: titik lokal tepat di atas celah.
export function kotakCelah(opsi = {}) {
  const {
    lebar = 0.7, tinggi = 0.6, dalam = 0.7, warna = kertasAman(), celah = [0.38, 0.06], debu = false, benih = 2, label = null, opsiLabel = {},
    nama = "kotak celah", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const kotak = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { alas: true, radius: 0.04 });
  g.add(kotak);
  const lubang = kotakBulat(celah[0], 0.014, celah[1], bahanPadat(W.pelat), { alas: true, radius: 0.006 });
  lubang.position.y = tinggi - 0.006;
  lubang.castShadow = false;
  g.add(lubang);
  const bibir = garisTepi({ w: celah[0] + 0.04, h: 0.001, d: celah[1] + 0.04, alas: true }, { warna: geserHSL(warna, -0.1, -0.35), lebar: 1.5, opasitas: 0.8 });
  bibir.position.y = tinggi + 0.004;
  g.add(bibir);
  const lbl = pasangLabel(label, jangkar(g, 0, tinggi + 0.25, 0), opsiLabel);
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(tepi);
  rampung(g, { nama, penting, label: lbl, titikCelah: V(0, tinggi + 0.02, 0), bagian: { kotak, celah: lubang, tepi: [tepi], denyut: denyutAman(warna, [kotak]), emas: [kotak] } });
  if (debu) lapisanDebu(g, { jumlah: 70, benih, bagian: [kotak] });
  return g;
}

// ================================================================ papan dan layar
// papanTulis: rangka 4.0 × 2.6 × 0.12 (zamrudRedup) berdiri di dua kaki 0.1 × 1.0 × 0.1, permukaan hsl(153, 25%, 18%).
//   kaki      tinggi kaki (0 = papan tempel dinding; titik asal di tepi bawah papan)
//   kolom     ["TUGAS", "TENGGAT", "PJ"] atau angka: garis kolom dengan label di kepala kolom
//   baris     ["HADIR TEPAT WAKTU", ...] atau angka: garis baris dengan label di kiri (kolomLabel: lebar kolom label, 0.55)
//   debu      true = permukaan berbintik debu (aturDebu(k))
//   permukaanBaru  true = permukaan pengganti (kertas bergaris) yang diusap dari kiri: aturUsap(k) 0..1
//   hadap     true (bawaan) = menghadap kamera
// userData: titikSel(c, r) (titik lokal pusat sel; r dihitung di bawah kepala), label { kolom[], baris[] }.
// bagian: rangka[], permukaan, baru (permukaan pengganti), garis[], kaki[]. emas: permukaan baru bila ada, selain itu rangka.
export function papanTulis(opsi = {}) {
  const {
    lebar = 4.0, tinggi = 2.6, tebal = 0.12, kaki = 1.0, bingkai = 0.1, warna = W.zamrudRedup, warnaPermukaan = geserHSL(W.zamrudRedup, -0.3, -0.06),
    kolom = null, baris = null, kolomLabel = 0.55, opsiLabel = {}, debu = false, benih = 3, permukaanBaru = false, warnaBaru = kertasAman(), hadap = true,
    nama = "papan tulis", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const panel = new THREE.Group();
  panel.position.y = kaki;
  g.add(panel);
  const matRangka = bahanPadat(warna);
  const rangka = [];
  for (const [w, h, x, y] of [[lebar, bingkai, 0, 0], [lebar, bingkai, 0, tinggi - bingkai], [bingkai, tinggi - 2 * bingkai, -lebar / 2 + bingkai / 2, bingkai], [bingkai, tinggi - 2 * bingkai, lebar / 2 - bingkai / 2, bingkai]]) {
    const b = kotakBulat(w, h, tebal, matRangka, { alas: true, radius: 0.03 });
    b.position.set(x, y, 0);
    panel.add(b);
    rangka.push(b);
  }
  const ws = lebar - 2 * bingkai, hs = tinggi - 2 * bingkai, zMuka = tebal * 0.15;
  const permukaan = kotakBulat(ws + 0.02, hs + 0.02, tebal * 0.6, bahanPadat(warnaPermukaan), { alas: true, radius: 0.01 });
  permukaan.position.set(0, bingkai - 0.01, zMuka - tebal * 0.3);
  panel.add(permukaan);
  const baki = kotakBulat(lebar * 0.45, 0.04, 0.14, matRangka, { alas: true, radius: 0.015 });
  baki.position.set(0, bingkai * 0.6, tebal / 2 + 0.05);
  panel.add(baki);
  rangka.push(baki);
  // Kaki dan tapak.
  const kakiList = [];
  if (kaki > 0) {
    for (const s of [-1, 1]) {
      const k = kotakBulat(0.1, kaki + 0.3, 0.1, matRangka, { alas: true, radius: 0.02 });
      k.position.set(s * (lebar / 2 - 0.35), 0, -tebal / 2 - 0.04);
      const tp = kotakBulat(0.12, 0.05, 0.55, matRangka, { alas: true, radius: 0.02 });
      tp.position.set(s * (lebar / 2 - 0.35), 0, -tebal / 2 - 0.04);
      g.add(k, tp);
      kakiList.push(k, tp);
    }
  }
  // Kolom dan baris.
  const matGaris = bahanPadat(geserHSL(W.kertas, -0.12, -0.26));
  const garis = [];
  const xKiri = -ws / 2 + 0.12, xKanan = ws / 2 - 0.12, yAtas = bingkai + hs - 0.12, yBawah = bingkai + 0.12;
  const nK = kolom ? (Array.isArray(kolom) ? kolom.length : kolom) : 0, nB = baris ? (Array.isArray(baris) ? baris.length : baris) : 0;
  // Tabel (kolom ada dan baris berlabel): label mikro yang ikut skala kamera (16 / H) dan dikecilkan supaya muat di selnya,
  // dan kolom label selebar label baris terpanjang (paling lebar kolomLabel × lebar isi; kolomLabel yang diisi dipakai persis).
  // Papan tanpa salah satunya tidak berubah.
  const tabel = nK > 0 && Array.isArray(baris);
  const HURUF = 0.08; // lebar satu huruf label mikro (15 px mono) dalam unit dunia pada H 16
  const panjangTeks = (s) => String(s).length * HURUF;
  const lebarLabel = nB && Array.isArray(baris)
    ? (tabel && opsi.kolomLabel === undefined
      ? Math.min((xKanan - xKiri) * kolomLabel, Math.max(...baris.map(panjangTeks)) + 0.16)
      : (xKanan - xKiri) * (nK ? kolomLabel : 1))
    : 0;
  const muatTabel = (lebarSel, teks) => Math.min(1, lebarSel / Math.max(HURUF, panjangTeks(teks)));
  const opsiTabel = (f) => (tabel ? { gaya: "mikro", skala: () => (16 / aktif.video.rig.keadaan.H) * f } : {});
  const tinggiKepala = nK && Array.isArray(kolom) ? 0.36 : 0;
  const xIsi = xKiri + lebarLabel, lebarKolom = nK ? (xKanan - xIsi) / nK : 0;
  const tinggiBaris = nB ? (yAtas - tinggiKepala - yBawah) / nB : 0;
  const zGaris = zMuka + 0.004;
  const garisV = (x, y0, y1) => { const m = kotakBulat(0.022, y1 - y0, 0.008, matGaris, { alas: true, radius: 0.004 }); m.position.set(x, y0, zGaris); m.castShadow = false; panel.add(m); garis.push(m); };
  const garisH = (y, x0, x1) => { const m = kotakBulat(x1 - x0, 0.022, 0.008, matGaris, { radius: 0.004 }); m.position.set((x0 + x1) / 2, y, zGaris); m.castShadow = false; panel.add(m); garis.push(m); };
  for (let c = nK && lebarLabel ? 0 : 1; c < nK; c++) garisV(xIsi + c * lebarKolom, yBawah, yAtas);
  if (tinggiKepala) garisH(yAtas - tinggiKepala, xKiri, xKanan);
  for (let rr = 1; rr < nB; rr++) garisH(yAtas - tinggiKepala - rr * tinggiBaris, xKiri, xKanan);
  const lblKolom = [], lblBaris = [];
  if (Array.isArray(kolom)) kolom.forEach((teks, c) => lblKolom.push(pasangLabel(teks, jangkar(panel, xIsi + (c + 0.5) * lebarKolom, yAtas - tinggiKepala / 2, zGaris), { ay: 0.5, ...opsiTabel(muatTabel(lebarKolom - 0.08, teks)), ...opsiLabel })));
  if (Array.isArray(baris)) baris.forEach((teks, rr) => {
    const y = yAtas - tinggiKepala - (rr + 0.5) * tinggiBaris;
    // Tabel: label diskalakan terhadap pusatnya, jadi jangkarnya di tengah teks supaya tepi kirinya tetap di xKiri + 0.06.
    const f = muatTabel(lebarLabel - 0.16, teks);
    const j = tabel ? jangkar(panel, xKiri + 0.06 + (panjangTeks(teks) * f) / 2, y, zGaris) : jangkar(panel, xKiri + 0.06, y, zGaris);
    lblBaris.push(pasangLabel(teks, j, { ax: tabel ? 0.5 : 0, ay: 0.5, ...opsiTabel(f), ...opsiLabel }));
  });
  const titikSel = (c, rr, out = V()) => {
    const x = nK ? xIsi + (c + 0.5) * lebarKolom : (xKiri + xKanan) / 2;
    const y = nB ? yAtas - tinggiKepala - (rr + 0.5) * tinggiBaris : (yAtas - tinggiKepala + yBawah) / 2;
    return out.set(x, kaki + y, zGaris + 0.01);
  };
  // Permukaan pengganti, tumbuh dari tepi kiri.
  let baru = null;
  if (permukaanBaru) {
    baru = new THREE.Group();
    baru.position.set(-ws / 2, bingkai, zMuka + 0.012);
    const isiBaru = kotakBulat(ws, hs, 0.012, bahanPadat(warnaBaru), { radius: 0.006 });
    isiBaru.position.set(ws / 2, hs / 2, 0);
    baru.add(isiBaru);
    const matTinta = bahanPadat(W.zamrudRedup);
    const judul = kotakBulat(ws * 0.4, 0.12, 0.006, matTinta, { radius: 0.004 });
    judul.position.set(ws * 0.3, hs - 0.3, 0.01);
    baru.add(judul);
    [0.82, 0.7, 0.9, 0.6].forEach((p, i) => {
      const l = kotakBulat(ws * 0.8 * p, 0.05, 0.006, matTinta, { radius: 0.004 });
      l.position.set(ws * 0.1 + (ws * 0.8 * p) / 2, hs - 0.62 - i * 0.3, 0.01);
      baru.add(l);
    });
    baru.visible = false;
    baru.scale.x = 1e-3;
    panel.add(baru);
  }
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: tebal, alas: true });
  tepi.position.y = kaki;
  g.add(tepi);
  if (hadap) g.rotation.y = HADAP;
  rampung(g, {
    nama, penting, titikSel, label: { kolom: lblKolom, baris: lblBaris },
    aturUsap(k) { if (!baru) return; k = klem(k); baru.scale.x = Math.max(1e-3, k); baru.visible = k > 0.003; },
    bagian: { panel, rangka, permukaan, baru, garis, kaki: kakiList, tepi: [tepi], denyut: rangka, emas: baru ? [...baru.children] : rangka },
  });
  if (debu) lapisanDebu(g, { jumlah: 320, benih, bagian: [permukaan], arah: V(0, 0, 1), ambang: 0.7, ukuran: [0.014, 0.034], opasitas: 0.6 });
  return g;
}

// Pola isi layar (tanpa teks terbaca; warna dari token tema). Masing-masing mengembalikan fungsi gambar (ctx, w, h).
export const POLA_LAYAR = {
  kosong: () => (c, w, h) => { c.fillStyle = cssWarna("pelat"); c.fillRect(0, 0, w, h); },
  // Pamflet generik: kotak zamrudRedup, garis putih tebal di tengah, bintang kecil di sudut. benih menggeser rinciannya.
  pamflet: (benih = 1) => (c, w, h) => {
    const r = acak(benih);
    c.fillStyle = cssWarna("pelat"); c.fillRect(0, 0, w, h);
    c.fillStyle = cssWarna("zamrudRedup"); persegiBulat(c, w * 0.06, h * 0.08, w * 0.88, h * 0.84, 14); c.fill();
    c.fillStyle = cssWarna("kertas");
    const lb = w * (0.5 + 0.12 * r());
    persegiBulat(c, (w - lb) / 2, h * 0.44, lb, h * 0.1, h * 0.05); c.fill();
    persegiBulat(c, (w - lb * 0.6) / 2, h * 0.6, lb * 0.6, h * 0.05, h * 0.025); c.fill();
    bintang(c, r() < 0.5 ? w * 0.16 : w * 0.84, h * 0.2, h * 0.07);
  },
  // Tata letak artikel: judul garis tebal, tiga baris tipis, kotak gambar kecil.
  artikel: () => (c, w, h) => {
    c.fillStyle = cssWarna("pelat"); c.fillRect(0, 0, w, h);
    c.fillStyle = cssWarna("kertas"); persegiBulat(c, w * 0.08, h * 0.12, w * 0.56, h * 0.11, h * 0.04); c.fill();
    c.fillStyle = cssWarna("abu");
    [0.86, 0.78, 0.6].forEach((p, i) => { persegiBulat(c, w * 0.08, h * (0.36 + i * 0.13), w * 0.5 * p, h * 0.05, h * 0.025); c.fill(); });
    c.fillStyle = cssWarna("zamrudRedup"); persegiBulat(c, w * 0.66, h * 0.32, w * 0.26, h * 0.42, 10); c.fill();
    c.fillStyle = cssWarna("zamrud");
    c.beginPath(); c.moveTo(w * 0.68, h * 0.7); c.lineTo(w * 0.76, h * 0.52); c.lineTo(w * 0.82, h * 0.62); c.lineTo(w * 0.86, h * 0.56); c.lineTo(w * 0.9, h * 0.7); c.closePath(); c.fill();
    c.fillStyle = cssWarna("kertas"); c.beginPath(); c.arc(w * 0.85, h * 0.42, h * 0.035, 0, Math.PI * 2); c.fill();
  },
  // Grafik batang sederhana. nilai 0..1 per batang.
  grafik: (nilai = [0.35, 0.6, 0.5, 0.85]) => (c, w, h) => {
    c.fillStyle = cssWarna("pelat"); c.fillRect(0, 0, w, h);
    c.fillStyle = cssWarna("abuGelap"); c.fillRect(w * 0.1, h * 0.84, w * 0.8, 3);
    const bw = (w * 0.7) / nilai.length;
    nilai.forEach((v, i) => { c.fillStyle = cssWarna("zamrud"); persegiBulat(c, w * 0.14 + i * bw, h * 0.84 - h * 0.66 * v, bw * 0.62, h * 0.66 * v, 6); c.fill(); });
  },
};
function persegiBulat(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function bintang(c, x, y, r) {
  c.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); }
  c.closePath(); c.fill();
}

// layarKanal: layar berdiri 2.4 × 1.6 × 0.1 (bingkai pelat) di atas tiang; permukaannya CanvasTexture 480 × 320 tanpa cahaya
// (MeshBasic, kecerahan `terang` 0.8 supaya isi kertas tetap di bawah ambang bloom).
//   isi       "kosong" | "pamflet" | "artikel" | "grafik" | fungsi (ctx, w, h); kaki (tinggi tepi bawah layar, 0.9); label
// userData.gambar(fn): gambar ulang isi sekarang (panggil dari setiapFrame dengan nilai turunan t; deterministik).
// userData.setelIsi(kunci, fn): gambar ulang hanya bila kunci berubah, mis. setelIsi(Math.floor(t / 0.6), POLA_LAYAR.pamflet(k)).
export function layarKanal(opsi = {}) {
  const {
    lebar = 2.4, tinggi = 1.6, tebal = 0.1, kaki = 0.9, resolusi = [480, 320], isi = "kosong", terang = 0.8, label = null, opsiLabel = {},
    hadap = true, warna = W.pelat, nama = "layar kanal", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const matBingkai = bahanPadat(warna);
  const bingkai = tepiPelat(kotakBulat(lebar, tinggi, tebal, matBingkai, { alas: true, radius: 0.04 }));
  bingkai.position.y = kaki;
  g.add(bingkai);
  const kanvas = document.createElement("canvas");
  [kanvas.width, kanvas.height] = resolusi;
  const ctx = kanvas.getContext("2d");
  const tekstur = new THREE.CanvasTexture(kanvas);
  tekstur.colorSpace = THREE.SRGBColorSpace;
  tekstur.anisotropy = 4;
  const matLayar = new THREE.MeshBasicMaterial({ map: tekstur, color: new THREE.Color(terang, terang, terang) });
  const layar = new THREE.Mesh(new THREE.PlaneGeometry(lebar - 0.14, tinggi - 0.14), matLayar);
  layar.position.set(0, kaki + tinggi / 2, tebal / 2 + 0.004);
  g.add(layar);
  const tiang = [];
  if (kaki > 0) {
    const t1 = kotakBulat(0.1, kaki + 0.1, 0.1, matBingkai, { alas: true, radius: 0.02 });
    t1.position.z = -tebal / 2 - 0.02;
    const tp = kotakBulat(Math.min(1.0, lebar * 0.4), 0.06, 0.5, matBingkai, { alas: true, radius: 0.02 });
    tp.position.z = -tebal / 2 - 0.02;
    g.add(tepiPelat(t1), tepiPelat(tp));
    tiang.push(t1, tp);
  }
  let kunciKini;
  function gambar(fn) {
    ctx.save();
    ctx.clearRect(0, 0, kanvas.width, kanvas.height);
    fn(ctx, kanvas.width, kanvas.height);
    ctx.restore();
    tekstur.needsUpdate = true;
  }
  function setelIsi(kunci, fn) {
    if (kunci === kunciKini) return;
    kunciKini = kunci;
    gambar(fn);
  }
  gambar(typeof isi === "function" ? isi : (POLA_LAYAR[isi] ?? POLA_LAYAR.kosong)());
  const lbl = pasangLabel(label, jangkar(g, 0, kaki + tinggi + 0.25, 0), opsiLabel);
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: tebal, alas: true });
  tepi.position.y = kaki;
  g.add(tepi);
  if (hadap) g.rotation.y = HADAP;
  return rampung(g, {
    nama, penting, gambar, setelIsi, kanvas, label: lbl, pusatLayar: V(0, kaki + tinggi / 2, tebal / 2),
    bagian: { bingkai, layar, tiang, tepi: [tepi], denyut: [bingkai], emas: [bingkai, ...tiang] },
  });
}

// layarPapar: panel papar 1.8 × 1.2 berdiri, mukanya gelap dengan tiga ikon timbul perubahan (grafik naik, ponsel, panah putar).
// bagian.ikon[0..2]: grup ikon (bisa dimunculkan atau diberi emas satu per satu).
export function layarPapar(opsi = {}) {
  const { lebar = 1.8, tinggi = 1.2, tebal = 0.08, kaki = 0.8, hadap = true, warna = W.pelat, nama = "layar papar", penting = true } = opsi;
  const g = new THREE.Group();
  const matBingkai = bahanPadat(warna);
  const bingkai = tepiPelat(kotakBulat(lebar, tinggi, tebal, matBingkai, { alas: true, radius: 0.04 }));
  bingkai.position.y = kaki;
  g.add(bingkai);
  const muka = kotakBulat(lebar - 0.14, tinggi - 0.14, 0.01, bahanPadat(geserHSL(W.pelat, 0.05, 0.05)), { radius: 0.005 });
  muka.position.set(0, kaki + tinggi / 2, tebal / 2 + 0.005);
  g.add(muka);
  const zIkon = tebal / 2 + 0.012, yIkon = kaki + tinggi / 2;
  const s = Math.min(lebar / 1.8, tinggi / 1.2);
  const ikon = [];
  // 1. Grafik naik.
  const i1 = new THREE.Group();
  [0.16, 0.26, 0.38].forEach((h, k) => {
    const b = kotakBulat(0.09, h, 0.05, bahanPadat(W.zamrud), { alas: true, radius: 0.015 });
    b.position.set((k - 1) * 0.13, -0.2, 0.025);
    i1.add(b);
  });
  // 2. Ponsel.
  const i2 = new THREE.Group();
  const badanP = kotakBulat(0.22, 0.38, 0.05, bahanPadat(geserHSL(W.zamrudRedup, -0.3, -0.06)), { radius: 0.03 });
  badanP.position.z = 0.025;
  const layarP = kotakBulat(0.16, 0.28, 0.01, bahanPadat(kertasRedup()), { radius: 0.01 });
  layarP.position.set(0, 0.01, 0.052);
  i2.add(badanP, layarP);
  // 3. Panah putar (perubahan).
  const i3 = new THREE.Group();
  const matPutar = bahanPadat(W.zamrudPijar);
  const busur = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.028, 8, 32, Math.PI * 1.5), matPutar);
  busur.position.z = 0.03;
  const kepala = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 12), matPutar);
  kepala.position.set(0.0, -0.14, 0.03);
  kepala.rotation.z = Math.PI / 2;
  i3.add(busur, kepala);
  [i1, i2, i3].forEach((ik, k) => {
    ik.position.set((k - 1) * lebar * 0.3, yIkon, zIkon);
    ik.scale.setScalar(s);
    ik.traverse((o) => { if (o.isMesh) o.castShadow = false; });
    g.add(ik);
    ikon.push(ik);
  });
  const tiang = [];
  if (kaki > 0) {
    const t1 = kotakBulat(0.1, kaki + 0.1, 0.1, matBingkai, { alas: true, radius: 0.02 });
    t1.position.z = -tebal / 2 - 0.02;
    const tp = kotakBulat(0.8, 0.06, 0.45, matBingkai, { alas: true, radius: 0.02 });
    tp.position.z = -tebal / 2 - 0.02;
    g.add(tepiPelat(t1), tepiPelat(tp));
    tiang.push(t1, tp);
  }
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: tebal, alas: true });
  tepi.position.y = kaki;
  g.add(tepi);
  if (hadap) g.rotation.y = HADAP;
  return rampung(g, { nama, penting, bagian: { bingkai, muka, ikon, tiang, tepi: [tepi], denyut: [bingkai], emas: ikon } });
}

// ================================================================ tanda dan lampu
// Kain yang bisa berkibar: bidang bersegmen yang menempel di tiang pada x = 0, menggantung dari y = 0 ke −tinggi.
// segitiga: true = ujungnya meruncing (bendera segitiga). aturKibar(fase, amp) menggeser verteks secara deterministik.
function kain(lebar, tinggi, { segitiga = false } = {}) {
  const geo = new THREE.PlaneGeometry(lebar, tinggi, 12, 6).translate(lebar / 2, -tinggi / 2, 0);
  const pos = geo.attributes.position;
  const asal = new Float32Array(pos.array.length);
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i);
    if (segitiga) { const yc = -tinggi / 2; y = yc + (y - yc) * (1 - x / lebar); }
    pos.setXYZ(i, x, y, 0);
    asal[3 * i] = x; asal[3 * i + 1] = y; asal[3 * i + 2] = 0;
  }
  geo.computeVertexNormals();
  return {
    geo,
    kibar(fase, amp) {
      for (let i = 0; i < pos.count; i++) {
        const x = asal[3 * i];
        pos.setZ(i, amp * (x / lebar) * Math.sin((2 * Math.PI * x) / (lebar * 0.9) - fase));
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    },
  };
}

// bendera: tiang silinder radius 0.04 tinggi 1.8 dengan kain segitiga 0.7 × 0.45 zamrud. aturKibar(fase, amp = 0.06).
export function bendera(opsi = {}) {
  const { tinggi = 1.8, radius = 0.04, kain: [kl, kt] = [0.7, 0.45], warna = W.zamrud, warnaTiang = kertasRedup(), hadap = true, nama = "bendera", penting = true } = opsi;
  const g = new THREE.Group();
  const matTiang = bahanPadat(warnaTiang);
  const tiang = silinder(radius, tinggi, matTiang, { segmen: 12 });
  const ujung = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.8, 12, 8), matTiang);
  ujung.position.y = tinggi + radius;
  const alas = kotakBulat(0.3, 0.08, 0.3, bahanPadat(W.pelat), { alas: true, radius: 0.02 });
  const k = kain(kl, kt, { segitiga: true });
  const mKain = new THREE.Mesh(k.geo, bahanPadat(warna, { side: THREE.DoubleSide }));
  mKain.position.set(radius, tinggi - 0.04, 0);
  mKain.castShadow = true;
  g.add(tiang, ujung, tepiPelat(alas), mKain);
  const tepi = tepiDenyut(ruas([V(0, 0, 0), V(0, tinggi, 0)]));
  g.add(tepi);
  if (hadap) g.rotation.y = HADAP;
  k.kibar(0, 0.06);
  return rampung(g, {
    nama, penting, aturKibar: (fase, amp = 0.06) => k.kibar(fase, amp), puncak: V(0, tinggi, 0),
    bagian: { tiang, kain: mKain, tepi: [tepi], denyut: [tiang], emas: [mKain] },
  });
}

// panji: kain persegi panjang 1.0 × 0.7 di tiang 2.2, zamrud dengan pola tiga garis lengkung kertas (bentuk abstrak).
//   aturKibar(fase, amp = 0.05); aturTembus(a): opasitas kain 0..1 (mis. 1 → 0.45 saat memudar).
// bagian: tiang, kain (mesh kain dan pola). Denyut pada tiang.
const _alfaPola = new Map();
function teksturPola(rasio) {
  const kunci = rasio.toFixed(2);
  if (_alfaPola.has(kunci)) return _alfaPola.get(kunci);
  const w = 256, h = Math.round(256 / rasio);
  const t = teksturKanvas(w, h, (c) => {
    c.fillStyle = "#000"; c.fillRect(0, 0, w, h);
    c.strokeStyle = "#fff"; c.lineCap = "round"; c.lineWidth = Math.min(w, h) * 0.065;
    for (let i = 0; i < 3; i++) {
      const y = h * (0.32 + i * 0.18);
      c.beginPath(); c.moveTo(w * 0.18, y + h * 0.06); c.bezierCurveTo(w * 0.38, y - h * 0.14, w * 0.6, y + h * 0.18, w * 0.82, y - h * 0.04); c.stroke();
    }
  });
  t.colorSpace = THREE.NoColorSpace;
  _alfaPola.set(kunci, t);
  return t;
}
export function panji(opsi = {}) {
  const {
    lebar = 1.0, tinggi = 0.7, tiang: tinggiTiang = 2.2, pola = true, warna = W.zamrud, warnaPola = kertasAman(), warnaTiang = kertasRedup(),
    hadap = true, nama = "panji", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const matTiang = bahanPadat(warnaTiang);
  const tiang = silinder(0.035, tinggiTiang, matTiang, { segmen: 12 });
  const ujung = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), matTiang);
  ujung.position.y = tinggiTiang + 0.04;
  const alas = kotakBulat(0.3, 0.08, 0.3, bahanPadat(W.pelat), { alas: true, radius: 0.02 });
  g.add(tiang, ujung, tepiPelat(alas));
  const k = kain(lebar, tinggi);
  const matKain = bahanPadat(warna, { side: THREE.DoubleSide, transparent: true, forceSinglePass: true });
  const mKain = new THREE.Mesh(k.geo, matKain);
  mKain.castShadow = true;
  const grupKain = new THREE.Group();
  grupKain.position.set(0.035, tinggiTiang - 0.04, 0);
  grupKain.add(mKain);
  let mPola = null, matPola = null;
  if (pola) {
    matPola = bahanPadat(warnaPola, { side: THREE.DoubleSide, forceSinglePass: true, transparent: true, alphaMap: teksturPola(lebar / tinggi), depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    mPola = new THREE.Mesh(k.geo, matPola);
    mPola.position.z = 0.003;
    mPola.renderOrder = 1;
    grupKain.add(mPola);
  }
  g.add(grupKain);
  const tepi = tepiDenyut(ruas([V(0, 0, 0), V(0, tinggiTiang, 0)]));
  g.add(tepi);
  if (hadap) g.rotation.y = HADAP;
  k.kibar(0, 0.05);
  const kainList = mPola ? [mKain, mPola] : [mKain];
  return rampung(g, {
    nama, penting, puncak: V(0, tinggiTiang, 0),
    aturKibar: (fase, amp = 0.05) => k.kibar(fase, amp),
    aturTembus(a) { aturFaktor(matKain, a, g); if (matPola) aturFaktor(matPola, a, g); },
    bagian: { tiang, kain: kainList, tepi: [tepi], denyut: [tiang], emas: kainList },
  });
}

// Keadaan lampu (lentera, lampuGagasan): "nyala" = kuat emissive (0 padam abuGelap, 0.4 redup, 0.9 menyala, 1.4 puncak klik),
// "emas" 0..1 ikut menyalakan (klikEmas). warnaNyala "emas" (bawaan) berpendar; "zamrud" menyala zamrud di bawah ambang bloom.
// Keadaan lain (abu, pudar, denyut) diserahkan ke bawaan kit.
function keadaanLampu(g, matBola, warnaNyala) {
  const zamrud = warnaNyala === "zamrud";
  const warnaPenuh = zamrud ? W.zamrud : W.emas, emisif = zamrud ? W.zamrudPijar : W.emasPijar, skala = zamrud ? 0.55 : 1;
  const k = { nyala: 0, emas: 0 };
  const _c = new THREE.Color();
  function terap() {
    const tingkat = Math.max(k.nyala, EMAS.akhir * k.emas);
    gantiDasar(matBola, { warna: _c.copy(W.abuGelap).lerp(warnaPenuh, klem(tingkat / 0.4)), emisif, kuat: tingkat * skala });
    segarkan(g);
  }
  return {
    k, terap,
    setel(n, v) { if (n === "nyala" || n === "emas") { k[n] = v; terap(); return true; } return false; },
  };
}

// lentera: bola radius 0.25 tergantung pada tali 1.2. Padam abuGelap; menyala emas dengan emissive emasPijar.
// Titik asal di bawah bola (pusat bola di y = radius); userData.atasTali: ujung atas tali (gantungkan pada titik ini).
//   nyala     kuat awal (0 padam, 0.4 redup, 0.9 menyala). setelKeadaan(l, "nyala", k) atau aturNyala(k).
export function lentera(opsi = {}) {
  const { radius = 0.25, tali = 1.2, nyala = 0, warnaNyala = "emas", nama = "lentera", penting = true } = opsi;
  const g = new THREE.Group();
  const matBola = bahanPadat(W.abuGelap, { emissive: new THREE.Color(0, 0, 0), emissiveIntensity: 0 });
  const bola = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 20), matBola);
  bola.position.y = radius;
  bola.castShadow = true;
  const matRangka = bahanPadat(W.pelat);
  const tutup = silinder(radius * 0.42, 0.07, matRangka, { rAtas: radius * 0.3, segmen: 20 });
  tutup.position.y = radius * 1.92;
  const dasar = silinder(radius * 0.3, 0.05, matRangka, { rAtas: radius * 0.4, segmen: 20 });
  dasar.position.y = -0.02;
  const cincin = [0, Math.PI / 2].map((a) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.01, 0.012, 6, 48), matRangka);
    m.position.y = radius;
    m.rotation.y = a;
    g.add(m);
    return m;
  });
  const yTali = radius * 1.92 + 0.07;
  const garisTali = garisDari([0, yTali, 0, 0, yTali + tali, 0], bahanGaris(W.abuGelap, 1.5, 1));
  g.add(bola, tutup, dasar, garisTali);
  const tepi = tepiDenyut(ruas(lingkaran(radius * 1.1, 40, radius), true));
  g.add(tepi);
  const kl = keadaanLampu(g, matBola, warnaNyala);
  rampung(g, {
    nama, penting, pusat: V(0, radius, 0), atasTali: V(0, yTali + tali, 0),
    aturNyala: (v) => kl.setel("nyala", v),
    setelKeadaan: kl.setel,
    bagian: { bola, tutup, cincin, tepi: [tepi], denyut: [tutup, ...cincin], emas: [] },
  });
  if (nyala) kl.setel("nyala", nyala);
  return g;
}

// lampuGagasan: lampu gagasan besar (bola lampu radius 0.45 dengan leher dan dudukan berulir) tergantung pada tali 0.8.
// Keadaan sama dengan lentera; warnaNyala "zamrud" untuk lampu yang menyala zamrud.
export function lampuGagasan(opsi = {}) {
  const { radius: R = 0.45, tali = 0.8, nyala = 0, warnaNyala = "emas", nama = "lampu gagasan", penting = true } = opsi;
  const g = new THREE.Group();
  const matBola = bahanPadat(W.abuGelap, { emissive: new THREE.Color(0, 0, 0), emissiveIntensity: 0 });
  // Bola dan leher lampu (bubutan), dudukan berulir di atas.
  const profil = [];
  for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + (i / 16) * (Math.PI * 0.78); profil.push(new THREE.Vector2(Math.max(1e-3, R * Math.cos(a)), R + R * Math.sin(a))); }
  const yLeher = R + R * Math.sin(-Math.PI / 2 + Math.PI * 0.78);
  profil.push(new THREE.Vector2(R * 0.46, yLeher + R * 0.32), new THREE.Vector2(R * 0.44, yLeher + R * 0.5), new THREE.Vector2(1e-3, yLeher + R * 0.5));
  const bola = new THREE.Mesh(new THREE.LatheGeometry(profil, 40), matBola);
  bola.castShadow = true;
  const matDudukan = bahanPadat(W.pelat);
  const yD = yLeher + R * 0.48;
  const dudukan = silinder(R * 0.42, R * 0.5, matDudukan, { segmen: 24 });
  dudukan.position.y = yD;
  const ulir = [0.12, 0.26, 0.4].map((f) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(R * 0.43, R * 0.035, 6, 32), matDudukan);
    m.rotation.x = Math.PI / 2;
    m.position.y = yD + R * f;
    g.add(m);
    return m;
  });
  const ujung = silinder(R * 0.2, R * 0.1, matDudukan, { rAtas: R * 0.12, segmen: 16 });
  ujung.position.y = yD + R * 0.5;
  const yTali = yD + R * 0.6;
  const garisTali = garisDari([0, yTali, 0, 0, yTali + tali, 0], bahanGaris(W.abuGelap, 1.5, 1));
  g.add(bola, dudukan, ujung, garisTali);
  const tepi = tepiDenyut(ruas(lingkaran(R * 1.08, 48, R), true));
  g.add(tepi);
  const kl = keadaanLampu(g, matBola, warnaNyala);
  rampung(g, {
    nama, penting, pusat: V(0, R, 0), atasTali: V(0, yTali + tali, 0),
    aturNyala: (v) => kl.setel("nyala", v),
    setelKeadaan: kl.setel,
    bagian: { bola, dudukan, ulir, tepi: [tepi], denyut: [dudukan, ...ulir], emas: [] },
  });
  if (nyala) kl.setel("nyala", nyala);
  return g;
}

// ================================================================ perlengkapan lain
// stasiunMeja: meja musyawarah. Alas bundar radius 1.2 (pelat, bibir zamrudRedup), meja bundar radius 0.72 di atasnya,
// selembar kertas di tengah meja. peserta > 0 = pion kecil (skala 0.62) mengelilingi meja.
// userData.titikPeserta(i, n): titik lokal di sekeliling meja (radius 0.98).
export function stasiunMeja(opsi = {}) {
  const { radius = 0.72, alas: rAlas = 1.2, peserta = 0, kertas = true, warna = W.zamrudRedup, nama = "stasiun meja", penting = true } = opsi;
  const g = new THREE.Group();
  const alas = silinder(rAlas, 0.1, bahanPadat(W.pelat), { rAtas: rAlas - 0.04, segmen: 64 });
  g.add(alas);
  g.add(garisDari(ruas(lingkaran(rAlas - 0.03, 72, 0.102), true), bahanGaris(W.zamrudRedup, 2, 0.9)));
  const mat = bahanPadat(warna);
  const tapak = silinder(0.34, 0.04, mat, { rAtas: 0.3 });
  tapak.position.y = 0.1;
  const kaki = silinder(0.1, 0.58, mat, { rAtas: 0.08, segmen: 16 });
  kaki.position.y = 0.1;
  const daun = silinder(radius, 0.07, mat, { segmen: 56 });
  daun.position.y = 0.68;
  g.add(tapak, kaki, daun);
  let lembar = null;
  if (kertas) {
    lembar = kotakBulat(0.42, 0.012, 0.56, bahanPadat(kertasAman()), { alas: true, radius: 0.004 });
    lembar.position.y = 0.75;
    lembar.rotation.y = 0.4;
    g.add(lembar);
  }
  const titikPeserta = (i, n, out = V()) => { const a = (i / n) * Math.PI * 2 + 0.3; return out.set(Math.cos(a) * 0.98, 0.1, Math.sin(a) * 0.98); };
  const pesertaList = [];
  for (let i = 0; i < peserta; i++) {
    const p = pion({ skala: 0.62, penting: false, nama: `peserta ${i + 1}` });
    titikPeserta(i, peserta, p.position);
    g.add(p);
    pesertaList.push(p);
  }
  const tepi = tepiDenyut(ruas(lingkaran(rAlas + 0.01, 72, 0.1), true));
  g.add(tepi);
  return rampung(g, {
    nama, penting, titikPeserta, tinggiAtas: 0.75,
    bagian: { alas, daun, kaki, tapak, lembar, peserta: pesertaList, tepi: [tepi], denyut: [alas, daun], emas: [daun, ...(lembar ? [lembar] : [])] },
  });
}

// jamDinding: jam silinder pipih radius 0.35 (muka kertas, bingkai zamrudRedup, 12 penanda, dua jarum) menghadap +z.
//   besar     true = jam besar radius 0.7 berdiri di tiang (pusat pada tinggiPusat 1.8); berdiri dapat diatur terpisah
//   jam, menit  posisi jarum awal (10:10); hadap: true = menghadap kamera
// Jam dinding: titik asal di tepi bawah bagian belakang jam (tempel di dinding). userData.pusat: pusat muka jam.
// aturJarum(jam, menit) atau aturSudut(sudutJam, sudutMenit) (radian, searah jarum jam dari pukul 12).
// bagian: jarumPendek, jarumPanjang (grup poros), bingkai, muka. Denyut pada bingkai.
export function jamDinding(opsi = {}) {
  const {
    besar = false, radius: R = besar ? 0.7 : 0.35, tebal = besar ? 0.12 : 0.08, berdiri = besar, tinggiPusat = 1.8, jam = 10, menit = 10,
    hadap = true, warnaBingkai = W.zamrudRedup, warnaMuka = kertasAman(), warnaJarum = W.pelat, nama = besar ? "jam besar" : "jam dinding", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const pusatY = berdiri ? tinggiPusat : R + tebal * 0.35;
  const jg = new THREE.Group();
  jg.position.y = pusatY;
  g.add(jg);
  const matBingkai = bahanPadat(warnaBingkai);
  const badan = new THREE.Mesh(new THREE.CylinderGeometry(R, R, tebal, 56).rotateX(Math.PI / 2).translate(0, 0, tebal / 2), matBingkai);
  const bingkai = new THREE.Mesh(new THREE.TorusGeometry(R, tebal * 0.35, 10, 64), matBingkai);
  bingkai.position.z = tebal;
  const muka = new THREE.Mesh(new THREE.CircleGeometry(R * 0.96, 56), bahanPadat(warnaMuka));
  muka.position.z = tebal + 0.003;
  for (const m of [badan, bingkai, muka]) { m.castShadow = m.receiveShadow = true; jg.add(m); }
  const matJarum = bahanPadat(warnaJarum);
  const zM = tebal + 0.01;
  for (let i = 0; i < 12; i++) {
    const besarT = i % 3 === 0;
    const t = kotakBulat(R * (besarT ? 0.07 : 0.04), R * (besarT ? 0.17 : 0.1), 0.012, matJarum, { alas: true, radius: 0.004 });
    const a = (i / 12) * Math.PI * 2;
    t.position.set(Math.sin(a) * R * 0.66, Math.cos(a) * R * 0.66, zM);
    t.rotation.z = -a;
    t.castShadow = false;
    jg.add(t);
  }
  const jarum = (panjang, lebarJ, z) => {
    const poros = new THREE.Group();
    poros.position.z = z;
    const m = kotakBulat(lebarJ, panjang, 0.014, matJarum, { alas: true, radius: Math.min(0.006, lebarJ / 3) });
    m.position.y = -R * 0.1;
    m.castShadow = false;
    poros.add(m);
    jg.add(poros);
    return poros;
  };
  const jarumPendek = jarum(R * 0.6, R * 0.1, zM + 0.006), jarumPanjang = jarum(R * 0.88, R * 0.065, zM + 0.022);
  const tutup = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.07, R * 0.07, 0.02, 16).rotateX(Math.PI / 2), matJarum);
  tutup.position.z = zM + 0.034;
  jg.add(tutup);
  const tiang = [];
  if (berdiri) {
    const matTiang = bahanPadat(W.pelat);
    const t1 = kotakBulat(0.1, pusatY, 0.1, matTiang, { alas: true, radius: 0.02 });
    t1.position.z = tebal * 0.3;
    const tp = kotakBulat(R * 1.1, 0.06, 0.5, matTiang, { alas: true, radius: 0.02 });
    tp.position.z = tebal * 0.3;
    g.add(tepiPelat(t1), tepiPelat(tp));
    tiang.push(t1, tp);
  }
  function aturSudut(aJam, aMenit) { jarumPendek.rotation.z = -aJam; jarumPanjang.rotation.z = -aMenit; }
  function aturJarum(j, m) { aturSudut((((j % 12) + m / 60) / 12) * Math.PI * 2, (m / 60) * Math.PI * 2); }
  aturJarum(jam, menit);
  const tepi = tepiDenyut(ruas(lingkaran(R * 1.12, 64, 0).map((p) => V(p.x, p.z, tebal + 0.02)), true));
  jg.add(tepi);
  if (hadap) g.rotation.y = HADAP;
  return rampung(g, {
    nama, penting, aturJarum, aturSudut, pusat: V(0, pusatY, tebal),
    bagian: { badan, bingkai, muka, jarumPendek, jarumPanjang, tiang, tepi: [tepi], denyut: [bingkai, badan], emas: [bingkai, badan] },
  });
}

// kue: kue dua tingkat (silinder radius 0.5 dan 0.35, kertas) dengan pita hias zamrud dan sebatang lilin.
export function kue(opsi = {}) {
  const { r1 = 0.5, r2 = 0.35, t1 = 0.34, t2 = 0.28, lilin = true, warna = kertasAman(), warnaHias = W.zamrud, nama = "kue", penting = true } = opsi;
  const g = new THREE.Group();
  const tingkat = (r, t, y) => {
    const e = 0.04;
    const profil = [[0, 0], [r, 0], [r, t - e], [r - e * 0.3, t - e * 0.3], [r - e, t], [0, t]].map(([x, yy]) => new THREE.Vector2(x, yy));
    const m = new THREE.Mesh(new THREE.LatheGeometry(profil, 48), bahanPadat(warna));
    m.position.y = y;
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    return m;
  };
  const a = tingkat(r1, t1, 0), b = tingkat(r2, t2, t1);
  const matHias = bahanPadat(warnaHias);
  const hias = [[r1, 0.05], [r2, t1 + 0.05]].map(([r, y]) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r + 0.004, 0.022, 8, 64), matHias);
    m.rotation.x = Math.PI / 2;
    m.position.y = y;
    g.add(m);
    return m;
  });
  let batang = null;
  if (lilin) {
    batang = silinder(0.025, 0.2, bahanPadat(warnaHias), { segmen: 10 });
    batang.position.y = t1 + t2;
    g.add(batang);
  }
  const tepi = tepiDenyut([...ruas(lingkaran(r1 + 0.02, 56, 0.01), true), ...ruas(lingkaran(r1 + 0.02, 56, t1), true), ...ruas(lingkaran(r2 + 0.02, 48, t1 + t2), true)]);
  g.add(tepi);
  return rampung(g, { nama, penting, bagian: { tingkat: [a, b], hias, lilin: batang, tepi: [tepi], denyut: denyutAman(warna, [a, b]), emas: [a, b] } });
}

// pita: dua tiang tipis (tinggi 1.2, berjarak 2.4 di x lokal) dengan pita melengkung (tabung tipis kertas) dan simpul di tengah.
//   lendut  lengkung pita: positif = melendut ke bawah (bawaan 0.3), negatif = melengkung ke atas
export function pita(opsi = {}) {
  const { jarak = 2.4, tinggi = 1.2, radius = 0.03, lendut = 0.3, warna = kertasAman(), warnaTiang = W.zamrudRedup, nama = "pita", penting = true } = opsi;
  const g = new THREE.Group();
  const matTiang = bahanPadat(warnaTiang);
  const tiang = [-1, 1].map((s) => {
    const t = silinder(0.035, tinggi, matTiang, { segmen: 12 });
    t.position.x = (s * jarak) / 2;
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), matTiang);
    bola.position.set((s * jarak) / 2, tinggi + 0.03, 0);
    const kaki = kotakBulat(0.22, 0.06, 0.22, bahanPadat(W.pelat), { alas: true, radius: 0.02 });
    kaki.position.x = (s * jarak) / 2;
    g.add(t, bola, kaki);
    return t;
  });
  const yP = tinggi - 0.06;
  const kurva = new THREE.QuadraticBezierCurve3(V(-jarak / 2, yP, 0), V(0, yP - 2 * lendut, 0), V(jarak / 2, yP, 0));
  const matPita = bahanPadat(warna);
  const tali = new THREE.Mesh(new THREE.TubeGeometry(kurva, 40, radius, 8, false), matPita);
  tali.castShadow = true;
  g.add(tali);
  const tengah = kurva.getPoint(0.5);
  const simpulPita = new THREE.Group();
  simpulPita.position.copy(tengah);
  for (const s of [-1, 1]) {
    const l = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.022, 8, 20), matPita);
    l.scale.set(1, 0.6, 1);
    l.position.x = s * 0.085;
    simpulPita.add(l);
    const e = kotakBulat(0.05, 0.18, 0.012, matPita, { radius: 0.005 });
    e.position.set(s * 0.04, -0.1, 0);
    e.rotation.z = s * 0.35;
    simpulPita.add(e);
  }
  const inti = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), matPita);
  simpulPita.add(inti);
  g.add(simpulPita);
  const tepi = tepiDenyut(ruas(kurva.getPoints(24)));
  g.add(tepi);
  return rampung(g, { nama, penting, bagian: { tiang, pita: tali, simpul: simpulPita, tepi: [tepi], denyut: denyutAman(warna, [tali]), emas: [tali, ...simpulPita.children] } });
}

// piala: kaki silinder, mangkuk bola terpotong, dua pegangan torus (kertas). Tinggi ±0.55 × skala.
//   debu: true = lapisan debu di mangkuk dan alas (aturDebu); warna (mis. W.abu untuk piala lama)
export function piala(opsi = {}) {
  const { skala = 1, warna = kertasAman(), debu = false, benih = 6, nama = "piala", penting = true } = opsi;
  const g = new THREE.Group();
  const isi = new THREE.Group();
  isi.scale.setScalar(skala);
  g.add(isi);
  const mat = bahanPadat(warna);
  const p = [[0.001, 0], [0.15, 0], [0.155, 0.03], [0.12, 0.05], [0.05, 0.07], [0.035, 0.1], [0.032, 0.24], [0.055, 0.265], [0.033, 0.29]];
  const c = 0.47, Rl = 0.17, Rd = 0.15;
  for (let i = 0; i <= 10; i++) { const a = ((-80 + i * 10) * Math.PI) / 180; p.push([Rl * Math.cos(a), c + Rl * Math.sin(a)]); }
  p.push([0.175, c + 0.068], [Rd * Math.cos(0.35), c + 0.068]);
  for (let i = 0; i <= 9; i++) { const a = ((20 - i * 10) * Math.PI) / 180; p.push([Rd * Math.cos(a), c + Rd * Math.sin(a)]); }
  p.push([0.001, c - Rd * Math.sin((70 * Math.PI) / 180)]);
  const badan = new THREE.Mesh(new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x, y)), 40), mat);
  badan.castShadow = badan.receiveShadow = true;
  isi.add(badan);
  const pegangan = [-1, 1].map((s) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.016, 8, 20, Math.PI), mat);
    m.rotation.z = -s * (Math.PI / 2);
    m.position.set(s * 0.158, c + 0.01, 0);
    m.castShadow = true;
    isi.add(m);
    return m;
  });
  const tepi = tepiDenyut([...ruas(lingkaran(0.19 * skala, 40, 0.54 * skala), true), ...ruas(lingkaran(0.17 * skala, 40, 0.01), true)]);
  g.add(tepi);
  rampung(g, { nama, penting, puncak: V(0, 0.55 * skala, 0), bagian: { badan, pegangan, tepi: [tepi], denyut: denyutAman(warna, [badan]), emas: [badan, ...pegangan] } });
  if (debu) lapisanDebu(g, { jumlah: 60, benih, bagian: [badan], ukuran: [0.008 * skala, 0.02 * skala], ambang: 0.35 });
  return g;
}

// ================================================================ katalog
export const DAFTAR_PERABOT = [
  { nama: "mejaBundar", kategori: "perabot", sub: "meja dan kursi", buat: mejaBundar, contoh: {} },
  { nama: "mejaKotak", kategori: "perabot", sub: "meja dan kursi", buat: mejaKotak, contoh: {} },
  { nama: "mejaKecil", kategori: "perabot", sub: "meja dan kursi", buat: mejaKecil, contoh: {} },
  { nama: "kursiKotak", kategori: "perabot", sub: "meja dan kursi", buat: kursiKotak, contoh: {} },
  { nama: "kursiRendah", kategori: "perabot", sub: "meja dan kursi", buat: kursiRendah, contoh: {} },
  { nama: "rakBuku", kategori: "perabot", sub: "penyimpanan", buat: rakBuku, contoh: { bukuBesar: 6, debu: true } },
  { nama: "rakKecil", kategori: "perabot", sub: "penyimpanan", buat: rakKecil, contoh: {} },
  { nama: "lemari", kategori: "perabot", sub: "penyimpanan", buat: lemari, contoh: { buka: 0.8 } },
  { nama: "folderBersama", kategori: "perabot", sub: "penyimpanan", buat: folderBersama, contoh: { buka: [0, 0, 1, 0] } },
  { nama: "kotakCelah", kategori: "perabot", sub: "penyimpanan", buat: kotakCelah, contoh: {} },
  { nama: "papanTulis", kategori: "perabot", sub: "papan dan layar", buat: papanTulis, contoh: { kolom: ["TUGAS", "TENGGAT", "PJ"], baris: 3 } },
  { nama: "layarKanal", kategori: "perabot", sub: "papan dan layar", buat: layarKanal, contoh: { isi: "artikel" } },
  { nama: "layarPapar", kategori: "perabot", sub: "papan dan layar", buat: layarPapar, contoh: {} },
  { nama: "bendera", kategori: "perabot", sub: "tanda dan lampu", buat: bendera, contoh: {} },
  { nama: "panji", kategori: "perabot", sub: "tanda dan lampu", buat: panji, contoh: {} },
  { nama: "lentera", kategori: "perabot", sub: "tanda dan lampu", buat: lentera, contoh: { nyala: 0.9 } },
  { nama: "lampuGagasan", kategori: "perabot", sub: "tanda dan lampu", buat: lampuGagasan, contoh: {} },
  { nama: "stasiunMeja", kategori: "perabot", sub: "perlengkapan", buat: stasiunMeja, contoh: { peserta: 5 } },
  { nama: "jamDinding", kategori: "perabot", sub: "perlengkapan", buat: jamDinding, contoh: {} },
  { nama: "kue", kategori: "perabot", sub: "perlengkapan", buat: kue, contoh: {} },
  { nama: "pita", kategori: "perabot", sub: "perlengkapan", buat: pita, contoh: {} },
  { nama: "piala", kategori: "perabot", sub: "perlengkapan", buat: piala, contoh: {} },
];
