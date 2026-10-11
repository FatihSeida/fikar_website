// Benda khusus video contoh (belum ada di kit/benda): gapura dan papan kehadiran.
// Mengikuti KONTRAK bagian 5 supaya bisa dipindah ke kit/benda lewat pekerjaan terpisah.
import * as THREE from "three";
import { W, DEG, bahanPadat, bahanGaris, kotakBulat, garisTepi } from "../../kit/index.js";

// Gapura: dua tiang 0.4 × 2.2 × 0.4 berjarak 2.6 unit dan balok atas 3.2 × 0.35 × 0.45, pelat bertepi zamrudRedup.
// Dibangun memanjang di sumbu x lokal; rotasi y 45° membuat baloknya sejajar layar.
export function gapura() {
  const g = new THREE.Group();
  const mat = bahanPadat(W.pelat);
  const garis = bahanGaris(W.zamrudRedup, 2);
  for (const x of [-1.3, 1.3]) {
    const tiang = kotakBulat(0.4, 2.2, 0.4, mat, { alas: true });
    tiang.position.x = x;
    tiang.add(garisTepi(tiang, { bahan: garis }));
    g.add(tiang);
  }
  const balok = kotakBulat(3.2, 0.35, 0.45, mat, { alas: true });
  balok.position.y = 2.2;
  balok.add(garisTepi(balok, { bahan: garis }));
  g.add(balok);
  g.userData = { nama: "gapura", penting: false, bagian: {} };
  return g;
}

// Papan kehadiran: panel kertas 2.0 × 1.4 berdiri miring 70° menghadap kamera, bingkai dan tiga batang zamrud
// (titik asal batang di pangkal kiri, supaya gerak tumbuh memanjang ke kanan). Bingkai dan batang menjadi emas.
export const BARIS_Y = [0.36, 0, -0.36];
export function papanHadir({ panjang = [1.0, 1.25, 1.5] } = {}) {
  const luar = new THREE.Group();
  luar.rotation.y = 45 * DEG;                 // sumbu x lokal = kanan layar
  const papan = new THREE.Group();
  papan.position.set(0, 0.85, 0);
  papan.rotation.x = -20 * DEG;               // condong ke belakang: miring 70° dari tanah
  luar.add(papan);
  const kertas = kotakBulat(2.0, 1.4, 0.04, bahanPadat(W.kertas), { radius: 0.02 });
  papan.add(kertas);
  const matBingkai = bahanPadat(W.zamrud);
  const bingkai = [];
  for (const [bw, bh, x, y] of [[2.04, 0.05, 0, 0.7], [2.04, 0.05, 0, -0.7], [0.05, 1.4, -1.0, 0], [0.05, 1.4, 1.0, 0]]) {
    const b = kotakBulat(bw, bh, 0.06, matBingkai, { radius: 0.02 });
    b.position.set(x, y, 0.01);
    papan.add(b);
    bingkai.push(b);
  }
  const batang = panjang.map((p, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(p, 0.09, 0.04).translate(p / 2, 0, 0), bahanPadat(W.zamrud));
    m.position.set(-0.6, BARIS_Y[i], 0.035);
    m.userData.nama = `batang ${i + 1}`;
    papan.add(m);
    return m;
  });
  const kaki = kotakBulat(1.8, 0.16, 0.36, bahanPadat(W.pelat), { radius: 0.04, alas: true });
  kaki.position.z = 0.28;
  luar.add(kaki);
  luar.userData = {
    nama: "papan kehadiran", penting: true,
    bagian: { papan, kertas, batang, bingkai, emas: [...bingkai, ...batang], tepi: [] },
    // Titik dunia untuk label baris i (di kiri batang). Panggil setelah matriks dunia diperbarui.
    titikBaris: (i, out = new THREE.Vector3()) => papan.localToWorld(out.set(-0.8, BARIS_Y[i], 0.05)),
  };
  return luar;
}
