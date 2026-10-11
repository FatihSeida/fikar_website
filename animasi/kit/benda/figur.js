// Figur: kerumunan pion dan varian pion siap pakai (orator, pengamat, pendamping, muda).
// Mengikuti KONTRAK bagian 5: fungsi(opsi) → THREE.Group, titik asal di tengah alas (y = 0), warna dari W,
// setiap benda punya bahannya sendiri, tanpa ketergantungan pada waktu. Rincian: kit/docs/benda-figur-bangunan.md.
import * as THREE from "three";
import { W } from "../inti/tema.js";
import { acak } from "../inti/waktu.js";
import { titik } from "../inti/ruang.js";
import { bahanPadat, kotakBulat, setelKeadaan } from "../inti/bahan.js";
import { pion } from "./dasar.js";

const SUDUT_KAMERA = Math.PI / 4; // rotasi y yang menghadapkan sisi +z figur ke penonton (bawah layar)

// ---------------------------------------------------------------- kerumunan
// Sekumpulan pion dalam satu Group. Titik asal di pusat kerumunan.
// opsi:
//   jumlah      bawaan 12
//   susunan     "acak" (sebaran berbenih dalam lingkaran radius), "baris" (baris sejajar layar, maju ke bawah layar),
//               "lingkaran" (mulai dari atas layar searah jarum jam), "dua-lingkaran" (dalam dan luar)
//   radius      acak/lingkaran: bawaan 1.6. dua-lingkaran: [dalam, luar], bawaan [1.2, 1.9]
//   jarak       jarak antarfigur untuk "baris" (dan jarak minimum "acak"), bawaan 0.62
//   kolom       jumlah figur per baris untuk "baris", bawaan = jumlah (satu baris)
//   benih       benih acak (posisi "acak" dan ragam jaket), bawaan 1
//   ragamJaket  true = warna jaket beragam dari token tema (kepala tetap W.pion)
//   hadapPusat  lingkaran: sisi +z figur menghadap pusat (bawaan true); susunan lain menghadap penonton
//   pion        opsi yang diteruskan ke setiap pion, mis. { duduk: true } atau { tangan: "naik" }
// userData.bagian.pion: array pion (untuk muncul/jalan bergiliran); userData.posisi: posisi lokal tiap pion.
// Pion di dalamnya penting: false; Group kerumunan yang diperiksa zona.
export function kerumunan(opsi = {}) {
  const {
    jumlah = 12, susunan = "acak", radius, jarak = 0.62, kolom, benih = 1, ragamJaket = false, hadapPusat = true,
    pion: opsiPion = {}, nama = "kerumunan", penting = true,
  } = opsi;
  const r = acak(benih);
  const posisi = [];
  const hadap = [];
  if (susunan === "baris") {
    const k = Math.max(1, Math.min(jumlah, kolom ?? jumlah));
    const nBaris = Math.ceil(jumlah / k);
    const jarakBaris = jarak * 1.7; // jarak ke bawah layar tampak memendek di kamera isometrik
    for (let i = 0; i < jumlah; i++) {
      const b = Math.floor(i / k), c = i % k;
      const nDiBaris = Math.min(k, jumlah - b * k);
      const geser = nBaris > 1 && b % 2 ? jarak / 2 : 0; // baris berselang digeser setengah supaya kepala di belakang terlihat
      posisi.push(titik((c - (nDiBaris - 1) / 2) * jarak + geser, (b - (nBaris - 1) / 2) * jarakBaris));
      hadap.push(SUDUT_KAMERA);
    }
  } else if (susunan === "lingkaran" || susunan === "dua-lingkaran") {
    const cincin = susunan === "lingkaran"
      ? [[radius ?? 1.6, jumlah]]
      : (() => {
        const [r1, r2] = Array.isArray(radius) ? radius : radius ? [radius, radius * 1.6] : [1.2, 1.9];
        const n1 = Math.max(1, Math.round((jumlah * r1) / (r1 + r2)));
        return [[r1, n1], [r2, jumlah - n1]];
      })();
    cincin.forEach(([rr, n], ci) => {
      const awal = ci % 2 ? Math.PI / Math.max(1, n) : 0; // lingkar luar digeser setengah langkah supaya tidak segaris
      for (let i = 0; i < n; i++) {
        const a = awal + (i / n) * Math.PI * 2;
        const p = titik(rr * Math.sin(a), -rr * Math.cos(a));
        posisi.push(p);
        hadap.push(hadapPusat ? Math.atan2(-p.x, -p.z) : SUDUT_KAMERA);
      }
    });
  } else {
    if (susunan !== "acak") console.warn(`[kit] kerumunan: susunan "${susunan}" tidak dikenal; dipakai "acak".`);
    const R = radius ?? 1.6;
    let minimum = jarak * 0.85;
    for (let i = 0; i < jumlah; i++) {
      let p = null;
      for (let coba = 0; coba < 400 && !p; coba++) {
        const a = r() * Math.PI * 2, d = R * Math.sqrt(r());
        const q = new THREE.Vector3(d * Math.cos(a), 0, d * Math.sin(a));
        if (posisi.every((o) => o.distanceTo(q) >= minimum)) p = q;
        if (coba === 399) { minimum *= 0.8; coba = -1; } // terlalu padat: longgarkan jarak minimum
      }
      posisi.push(p);
      hadap.push(SUDUT_KAMERA);
    }
  }

  const ragam = [
    W.pion, W.pion.clone().lerp(W.kertas, 0.6), W.pion.clone().lerp(W.abu, 0.5),
    W.pion.clone().lerp(W.zamrud, 0.3), W.pion.clone().lerp(W.abuGelap, 0.45),
  ];
  const g = new THREE.Group();
  const daftar = posisi.map((p, i) => {
    const f = pion({
      ...opsiPion, warnaJaket: ragamJaket ? ragam[Math.floor(r() * ragam.length)] : opsiPion.warnaJaket, penting: false,
      nama: `${opsiPion.nama ?? "figur"} ${i + 1}`, // sumber bunyi yang terbaca: "figur 3", bukan "pion-3"
    });
    f.position.copy(p);
    f.rotation.y = hadap[i];
    g.add(f);
    return f;
  });
  g.userData = {
    nama, penting, bagian: { pion: daftar, tepi: [] }, posisi: posisi.map((p) => p.clone()),
    // Keadaan khas pion diteruskan ke setiap pion (emas = cincin, badan tidak pernah emas). pudar, abu, denyut
    // ditangani bawaan kit pada Group ini, supaya ikut opasitas kerumunan (muncul/hilang pada Group).
    setelKeadaan(n, nilai) {
      if (n !== "emas" && n !== "nyala" && n !== "aktif" && n !== "lencana") return false;
      for (const f of daftar) setelKeadaan(f, n, nilai);
      return true;
    },
  };
  return g;
}

// ---------------------------------------------------------------- varian pion
// Semua varian menerima opsi pion (warna, warnaJaket, aktif, pudar, duduk, skala, ...); opsi yang disebut menimpa bawaan.

// pionOrator: tangan kanan terangkat ke depan memegang pengeras suara (kerucut kecil di depan kepala).
// warnaPengeras bawaan W.kertas. bagian.pengeras.
export function pionOrator(opsi = {}) {
  const { warnaPengeras = W.kertas, ...sisa } = opsi;
  const g = pion({ tangan: "turun", nama: "orator", ...sisa });
  const kanan = g.userData.bagian.tangan[1];
  if (kanan && sisa.tangan === undefined) kanan.rotation.set(-1.75, 0, 0.15); // lengan kanan ke depan, sedikit naik
  const turun = sisa.duduk ? 0.25 : 0;
  const pengeras = new THREE.Group();
  const mat = bahanPadat(warnaPengeras);
  const corong = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.04, 0.26, 20, 1, true).rotateX(Math.PI / 2), mat);
  mat.side = THREE.DoubleSide;
  const pangkal = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 14).rotateX(Math.PI / 2), mat);
  pangkal.position.z = -0.16;
  const gagang = kotakBulat(0.04, 0.1, 0.04, mat, { radius: 0.015 });
  gagang.position.set(0, -0.08, -0.12);
  pengeras.add(corong, pangkal, gagang);
  pengeras.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  pengeras.position.set(0.17, 0.86 - turun, 0.42);
  g.add(pengeras);
  g.userData.bagian.pengeras = pengeras;
  return g;
}

// pionPengamat: memegang papan catat kecil (papan, kertas bergaris, penjepit) di depan dada, condong ke belakang
// supaya mukanya terlihat kamera. bagian.papan.
export function pionPengamat(opsi = {}) {
  const papan = new THREE.Group();
  const alas = kotakBulat(0.3, 0.38, 0.025, bahanPadat(W.zamrudRedup), { radius: 0.01 });
  const kertas = kotakBulat(0.25, 0.3, 0.012, bahanPadat(W.kertas), { radius: 0.004 });
  kertas.position.set(0, -0.02, 0.016);
  const matGaris = bahanPadat(W.abuGelap);
  for (let i = 0; i < 3; i++) {
    const garis = kotakBulat(i === 2 ? 0.11 : 0.18, 0.022, 0.006, matGaris, { radius: 0 });
    garis.position.set(i === 2 ? -0.035 : 0, 0.06 - i * 0.07, 0.024);
    papan.add(garis);
  }
  const jepit = kotakBulat(0.12, 0.05, 0.04, bahanPadat(W.zamrud), { radius: 0.012 });
  jepit.position.set(0, 0.18, 0.016);
  papan.add(alas, kertas, jepit);
  papan.position.set(0, 0.03, 0.02);
  papan.rotation.x = -0.75;
  papan.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  const g = pion({ tangan: "terbuka", nama: "pengamat", pegang: papan, ...opsi });
  // Kedua lengan menjulur ke papan (bila pose tangan tidak dipilih sendiri).
  if (opsi.tangan === undefined) for (const t of g.userData.bagian.tangan) t.rotation.set(-1.15, 0, Math.sign(t.position.x) * 0.12);
  g.userData.bagian.papan = papan;
  return g;
}

// pionPendamping: cincin kaki aktif dan lencana di dada (lihat pion: keadaan "aktif", "emas", "lencana").
export function pionPendamping(opsi = {}) {
  return pion({ aktif: true, lencana: true, nama: "pendamping", ...opsi });
}

// pionMuda: pion skala 0.85 (kader muda, mahasiswa baru).
export function pionMuda(opsi = {}) {
  return pion({ skala: 0.85, nama: "kader muda", ...opsi });
}

// Daftar katalog: { nama, kategori, buat, contoh }.
export const DAFTAR_FIGUR = [
  { nama: "kerumunan", kategori: "figur", buat: kerumunan, contoh: { jumlah: 12, susunan: "acak", radius: 1.3, ragamJaket: true, benih: 3 } },
  { nama: "pionOrator", kategori: "figur", buat: pionOrator, contoh: {} },
  { nama: "pionPengamat", kategori: "figur", buat: pionPengamat, contoh: {} },
  { nama: "pionPendamping", kategori: "figur", buat: pionPendamping, contoh: {} },
  { nama: "pionMuda", kategori: "figur", buat: pionMuda, contoh: {} },
];
