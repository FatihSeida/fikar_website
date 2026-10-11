import * as THREE from 'three';
import { W, stanPajangan, tumpukanKertas, pion, kotakBulat, bahanPadat, bahanGaris, garisDari } from '../../kit/index.js';

export function petakKosong(nama) {
  const g = new THREE.Group();
  g.rotation.y = Math.PI / 4;
  const p = [], w = 1.05, h = 1.5;
  const tepi = [[[-w / 2, 0], [w / 2, 0]], [[w / 2, 0], [w / 2, h]], [[w / 2, h], [-w / 2, h]], [[-w / 2, h], [-w / 2, 0]]];
  for (const [a, b] of tepi) {
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.15);
    for (let i = 0; i < n; i++) {
      const u = i / n, v = (i + 0.58) / n;
      p.push(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 0,
        a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v, 0);
    }
  }
  const l = garisDari(p, bahanGaris(W.zamrudPijar, 3, 0));
  g.add(l);
  g.userData = { nama, penting: true, bagian: { tepi: [l], denyut: [] } };
  return g;
}

function kotak(w, h, d, warna, x, y, z) {
  const m = kotakBulat(w, h, d, bahanPadat(warna), { radius: 0.012, alas: true });
  m.position.set(x, y, z);
  return m;
}

export function stanKarya(i) {
  const nama = ['tulisan', 'riset', 'sosial', 'seni'][i];
  const s = stanPajangan({ nama: `stan ${nama}`, isi: ['kertas', 'grafik', 'figur', 'bingkai'][i], lebar: 1.12, tinggi: 1.65, dalam: 0.65 });
  const bagian = s.userData.bagian, isi = bagian.isi;
  isi.clear();
  if (i === 0) {
    const k = tumpukanKertas({ jumlah: 6, rapi: true, tumpukan: 1, ukuran: [0.6, 0.035, 0.46], penting: false, benih: 12 });
    k.position.set(-0.12, 0.63, 0.06);
    isi.add(k);
    const lembar = kotak(0.44, 0.52, 0.025, W.kertas, 0.18, 0.9, -0.23);
    isi.add(lembar);
    for (let j = 0; j < 4; j++) isi.add(kotak(0.31 - (j === 3 ? 0.09 : 0), 0.024, 0.018, W.abuGelap, 0.18, 1.29 - j * 0.09, -0.205));
  } else if (i === 1) {
    [0.3, 0.5, 0.72].forEach((h, j) => isi.add(kotak(0.2, h, 0.11, W.kertas, -0.3 + j * 0.3, 0.67, -0.15)));
    isi.add(kotak(0.92, 0.035, 0.14, W.abu, 0, 0.63, -0.15));
  } else if (i === 2) {
    for (const x of [-0.2, 0.2]) {
      const p = pion({ skala: 0.59, tangan: 'terbuka', penting: false });
      p.position.set(x, 0.63, 0.02);
      isi.add(p);
    }
    isi.add(kotak(0.3, 0.045, 0.04, W.pion, 0, 0.95, 0.1));
  } else {
    for (const [w, h, x, y] of [[0.84, 0.06, 0, 0.72], [0.84, 0.06, 0, 1.39], [0.06, 0.73, -0.39, 0.72], [0.06, 0.73, 0.39, 0.72]]) isi.add(kotak(w, h, 0.06, W.kertas, x, y, -0.15));
    const disk = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), bahanPadat(W.zamrudPijar));
    disk.position.set(-0.13, 1.15, -0.1);
    const bentuk = new THREE.Shape();
    bentuk.moveTo(-0.24, 0); bentuk.lineTo(0.24, 0); bentuk.lineTo(0.07, 0.34); bentuk.closePath();
    const triangle = new THREE.Mesh(new THREE.ShapeGeometry(bentuk), bahanPadat(W.kertas));
    triangle.position.set(0.08, 0.8, -0.08);
    isi.add(disk, triangle);
  }
  bagian.emas = [bagian.meja, bagian.kepala];
  isi.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return s;
}
