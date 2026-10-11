// Dunia Simpul: komisariat di pusat, delapan simpul melingkar radius 3.9 (simpul1 di atas layar, lalu searah jarum
// jam), dan layar kanal di dalam lingkaran, kiri atas. Simpul mulai "lepas": abu, tanpa garis. KONTRAK.md §7.
// Kunci benda, titik, opsi, dan penyimpangan dari prompt: docs/dunia-kader-jenjang-simpul.md.
//
//   const d = duniaSimpul(v);
//   d.benda.komisariat, .simpul1 … .simpul8, .layar
//   d.titik.simpul[i]   pusat bola simpul ke-(i+1), ujung garis penghubung; d.titik.pusat: ujung garis di komisariat
//   setelKeadaan(d.benda.simpul3, "sambung", k)   // abu → zamrud
import * as THREE from "three";
import { titik } from "../inti/ruang.js";
import { rumah } from "../benda/dasar.js";
import { simpul } from "../benda/medan.js";
import { layarKanal } from "../benda/perabot.js";
import { susunDunia, luaskan } from "./_susun.js";

const N = 8;
const JARI = 3.9; // prompt 4.0: kotak alas simpul3 dan simpul7 lewat 3 px dari tepi layar
const TATA = {
  komisariat: titik(0, 0), // = prompt
  // Prompt titik(-3.2, -3.0) bertumpuk dengan simpul8 (-2.83, -2.83) dan keluar zona atas. Di dalam lingkaran, di antara
  // simpul8 dan simpul1, layar hanya menyentuh tepi kedua simpul itu dan garis penghubung lewat di bawah panelnya.
  layar: titik(-1.42, -2.3),
  fokus: titik(0, 0, 0.5),
};
// Simpul ke-i (0-based) dari arah atas layar, searah jarum jam di layar.
const posisiSimpul = (i) => {
  const a = (i * 2 * Math.PI) / N;
  return TATA.komisariat.clone().add(titik(JARI * Math.sin(a), -JARI * Math.cos(a)));
};

const ANGGOTA = Array.from({ length: N }, (_, i) => `simpul${i + 1}`);

// opsi: tanpa, posisi, opsi, ganti (KONTRAK §7), dengan nama kelompok "simpul".
export function duniaSimpul(v, opsi = {}) {
  const o = luaskan(opsi, { simpul: N }); // "simpul" → simpul1..8 di tanpa dan opsi
  // Lingkaran simpul dan layar ikut bila komisariat dipindah lewat posisi.komisariat.
  const geser = (o.posisi?.komisariat ?? TATA.komisariat).clone().sub(TATA.komisariat);
  const resep = [
    { nama: "komisariat", buat: (op) => rumah({ nama: "komisariat", ...op }), posisi: TATA.komisariat },
    ...ANGGOTA.map((n, i) => ({
      // tersambung 0: lepas (abu). Sambungkan lewat setelKeadaan(simpul, "sambung", k) atau userData.aturSambung(k).
      nama: n, buat: (op) => simpul({ nama: n, tersambung: 0, ...op }), posisi: posisiSimpul(i).add(geser),
    })),
    // layarKanal sudah menghadap kamera (hadap: true memutar grupnya 45°); rotasi tidak ditimpa.
    { nama: "layar", buat: (op) => layarKanal({ nama: "layar", ...op }), posisi: TATA.layar.clone().add(geser) },
  ];
  const { benda, urutan } = susunDunia(v, resep, o);
  const kom = benda.komisariat;

  // ---------------------------------------------------------------- titik bernama (dunia)
  const T = {};
  const pKom = (kom?.position ?? TATA.komisariat).clone();
  T.komisariat = pKom.clone();
  T.pusat = pKom.clone().setY(0.6);                       // ujung garis penghubung (garis keluar dari dinding)
  if (kom) {
    T.atap = pKom.clone().setY(new THREE.Box3().setFromObject(kom).max.y);
    if (kom.userData.depanPintu) T.depanPintu = kom.localToWorld(kom.userData.depanPintu.clone());
  }
  // Pusat bola tiap simpul (dari tata letak bawaan bila simpulnya ditiadakan) dan titik tengah garis pusat → simpul.
  T.simpul = ANGGOTA.map((n, i) => {
    const b = benda[n];
    return b ? b.localToWorld((b.userData.titikSambung ?? new THREE.Vector3(0, 0.43, 0)).clone()) : posisiSimpul(i).add(geser).setY(0.43);
  });
  T.tengahGaris = T.simpul.map((p) => p.clone().lerp(T.pusat, 0.5));
  const lay = benda.layar;
  if (lay) {
    T.layar = lay.localToWorld(lay.userData.pusatLayar.clone());
    T.depanLayar = lay.position.clone().add(titik(0, 1.0)); // di depan layar (bawah layar), di tanah
  }

  return { benda, urutan, fokus: TATA.fokus.clone().add(geser), H: 16, titik: T };
}
