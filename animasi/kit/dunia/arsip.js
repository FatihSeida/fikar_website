// Dunia Arsip: lemari sekretariat, garis waktu empat periode, dan folder bersama berlaci empat.
// KONTRAK.md §7. Kunci benda, titik, opsi, dan penyimpangan dari prompt: docs/dunia-pustaka-rencana-arsip.md.
//
//   const d = duniaArsip(v);                                              // lemari berisi map
//   const d = duniaArsip(v, { opsi: { lemari: { isi: "kosong", buka: 1 } } });   // lemari kosong terbuka (33)
//   const d = duniaArsip(v, { opsi: { lemari: { kaca: true } } });             // lemari kaca berisi piala (43)
//
// Piala di lemari kaca diberi lapisan debu (awalnya 0): d.benda.lemari.userData.bagian.piala[i].userData.aturDebu(k).
import * as THREE from "three";
import { titik, DEG } from "../inti/ruang.js";
import { garisWaktu, lapisanDebu } from "../benda/medan.js";
import { lemari, folderBersama } from "../benda/perabot.js";
import { susunDunia } from "./_susun.js";

const P = {
  lemari: titik(-2.6, -1.4),        // prompt titik(-2.6, -1.6)
  garisWaktu: titik(0.2, 2.8),      // prompt titik(0.6, 2.8)
  folder: titik(2.8, -1.8),         // prompt titik(2.8, -1.8)
};

export function duniaArsip(v, opsi = {}) {
  const o = { ...opsi, opsi: opsi.opsi ?? {} };
  const resep = [
    { nama: "lemari", buat: (op) => lemari(op), posisi: P.lemari, rotasi: 20 * DEG },
    // Pita 7.2 (prompt 9) dengan jarak periode 1.8 (prompt 2.25): pita 9 unit lebih lebar dari layar pada frustum 16.
    { nama: "garisWaktu", buat: (op) => garisWaktu({ panjang: 7.2, jarak: 1.8, ...op }), posisi: P.garisWaktu },
    { nama: "folder", buat: (op) => folderBersama({ nama: "folder", ...op }), posisi: P.folder },
  ];
  const { benda, urutan } = susunDunia(v, resep, o);

  const t = {};
  const lem = benda.lemari;
  if (lem) {
    const { tinggi = 2.5, dalam = 0.78 } = o.opsi.lemari ?? {};
    t.lemari = lem.localToWorld(new THREE.Vector3(0, tinggi / 2, dalam / 2));              // muka lemari, setengah tinggi
    t.depanLemari = lem.localToWorld(new THREE.Vector3(0, 0, dalam / 2 + 1.0)).setY(0);   // tanah 1 unit di depan pintu
    const ruang = lem.userData.lantaiRuang ?? [];
    t.rakLemari = ruang.map((y) => lem.localToWorld(new THREE.Vector3(0, y, 0)));          // lantai tiap ruang rak (bawah → atas)
    const piala = lem.userData.bagian?.piala ?? [];
    // Dengan rotasi 20°, isi di belakang pintu kaca tampak bergeser ke kanan (paralaks) sehingga piala tengah
    // bawaan lemari tertutup rangka dan gagang di tengah pintu. Piala dimajukan ke depan rak dan disebar supaya
    // ketiganya tampak lewat kaca (dua di daun kiri, satu di daun kanan). Putaran 60° membuat pegangan tetap tampak
    // menyamping di layar tanpa menembus dinding samping lemari.
    if (piala.length === 3) {
      const { lebar = 1.8 } = o.opsi.lemari ?? {};
      [-0.68, -0.35, 0.36].forEach((x, i) => {
        piala[i].position.x = x * (lebar / 1.8);
        piala[i].position.z = dalam / 2 - 0.21;
        piala[i].rotation.y = 60 * DEG;
      });
      lem.updateMatrixWorld(true);
    }
    piala.forEach((p, i) => {
      // lemari tidak meneruskan opsi debu ke pialanya; lapisan ditambahkan di sini (aturDebu(k), awalnya 0).
      if (!p.userData.aturDebu) {
        lapisanDebu(p, { jumlah: 60, benih: 40 + i, bagian: [p.userData.bagian.badan], ukuran: [0.0064, 0.016], ambang: 0.35, kadar: 0 });
      }
    });
    if (piala.length) t.piala = piala.map((p) => p.getWorldPosition(new THREE.Vector3()));  // alas tiap piala
  }
  const gw = benda.garisWaktu;
  if (gw?.userData.titikPeriode) {   // dilewati bila garisWaktu diganti benda lain
    const { panjang = 7.2, jarak = 1.8, tebal = 0.05 } = o.opsi.garisWaktu ?? {};
    const n = Math.max(1, Math.round(panjang / jarak));
    t.periode = Array.from({ length: n }, (_, i) => gw.localToWorld(gw.userData.titikPeriode(i)));  // pusat pita tiap periode
    t.garisAwal = gw.localToWorld(new THREE.Vector3(-panjang / 2, tebal, 0));
    t.garisAkhir = gw.localToWorld(new THREE.Vector3(panjang / 2, tebal, 0));
  }
  const f = benda.folder;
  if (f?.userData.titikLaci) {   // dilewati bila folder diganti benda lain
    const { tinggi = 1.6, dalam = 1.0, laci = 4 } = o.opsi.folder ?? {};
    t.folder = f.localToWorld(new THREE.Vector3(0, tinggi / 2, dalam / 2));                  // muka folder, setengah tinggi
    t.laci = Array.from({ length: laci }, (_, i) => f.localToWorld(f.userData.titikLaci(i))); // tujuan dokumen (laci tertutup)
  }
  return { benda, urutan, fokus: titik(0, 0), H: 16, titik: t };
}
