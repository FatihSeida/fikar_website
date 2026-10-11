// Benda dan gerak lokal indikator-07 (peta kota). Hanya yang belum ada di kit; calon pindahan ke kit dicatat di laporan.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  W, DEG, bahanPadat, bahanGaris, bahanPijar, kotakBulat, garisDari, rumahKecil, cincin,
  rentang, masukKeluar3, daftarkan,
} from "../../kit/index.js";

// ---------------------------------------------------------------- komisariatHangat
// rumahKecil kit tanpa jendela zamrudnya, diganti jendela "cahaya hangat redup" (brief F/G): kertas diredupkan
// (0.45 × linear) dengan emissive kertas lemah. Luminans terburuk (muka tersorot matahari) ±0.33 + 0.03 + 0.19 = 0.55,
// di bawah ambang bloom 0.74, jadi tidak berpendar. Keadaan "lampu" 0..1 (padam → menyala); abu/pudar bawaan kit untuk dinding.
const KUAT_HANGAT = 0.25;
export function komisariatHangat({ nama = "komisariat", lampu = 0, skala = 0.75 } = {}) {
  const g = rumahKecil({ jendela: false, nama });
  const lebar = 1.2, tinggi = 0.9, dalam = 1.1; // ukuran bawaan rumahKecil
  const hangat = W.kertas.clone().multiplyScalar(0.45);
  const padam = W.pelat.clone().lerp(W.zamrudRedup, 0.35);
  const mat = bahanPadat(padam, { emissive: W.kertas.clone(), emissiveIntensity: 0 });
  mat.userData.abaikanKeadaan = true;
  const geos = [];
  for (const z of [-dalam * 0.23, dalam * 0.23]) geos.push(new THREE.BoxGeometry(0.03, 0.24, 0.22).translate(lebar / 2 + 0.012, tinggi * 0.55, z));
  geos.push(new THREE.BoxGeometry(0.22, 0.24, 0.03).translate(0.25, tinggi * 0.55, dalam / 2 + 0.012));
  const jendela = new THREE.Mesh(mergeGeometries(geos), mat);
  jendela.receiveShadow = true;
  g.add(jendela);
  function aturLampu(k) {
    mat.color.copy(padam).lerp(hangat, k);
    mat.emissiveIntensity = KUAT_HANGAT * k;
  }
  aturLampu(lampu);
  g.scale.setScalar(skala);
  g.userData.bagian.jendela = jendela;
  g.userData.atas = (tinggi + 0.5) * skala; // puncak atap
  g.userData.setelKeadaan = (n, nilai) => {
    if (n === "lampu") { aturLampu(nilai); return true; }
    return false;
  };
  return g;
}

// ---------------------------------------------------------------- garisAlas
// Garis alas: persegi panjang mendatar di tanah mengelilingi tapak benda (w × d lokal), zamrudPijar 3 px, tersembunyi
// sampai keadaan "denyut" > 0. Dipasang sebagai bagian.tepi benda, sehingga denyutCermin berdenyut di garis alas.
export function garisAlas(w, d, { y = 0.03, lebar = 3 } = {}) {
  const x = w / 2, z = d / 2;
  const p = [-x, y, -z, x, y, -z, x, y, -z, x, y, z, x, y, z, -x, y, z, -x, y, z, -x, y, -z];
  const l = garisDari(p, bahanGaris(W.zamrudPijar, lebar, 0));
  l.visible = false;
  return l;
}

// ---------------------------------------------------------------- ruasJalan
// Ruas jalan kota lurus dari `dari` ke `ke` (di tanah): kotak tipis lebar 0.15 tinggi 0.02 warna pelat (brief F).
// Titik asal di `dari`, memanjang di sumbu x lokal, jadi tumbuh(ruas, { sumbu: "x" }) menggambarnya dari pangkal.
export function ruasJalan(dari, ke, { lebar = 0.15, tinggi = 0.02, warna = W.pelat, nama = "jalan" } = {}) {
  const g = new THREE.Group();
  g.position.copy(dari).setY(0);
  const L = Math.hypot(ke.x - dari.x, ke.z - dari.z);
  const m = kotakBulat(L, tinggi, lebar, bahanPadat(warna), { alas: true, radius: 0.005 });
  m.position.x = L / 2;
  m.castShadow = false;
  g.add(m);
  g.rotation.y = Math.atan2(-(ke.z - dari.z), ke.x - dari.x);
  g.userData = { nama, penting: false, bagian: { tepi: [] } };
  return g;
}

// ---------------------------------------------------------------- titikCahaya
// Titik cahaya kecil di tanah: bola zamrudPijar r 0.1 (bahanPijar kuat 1, luminans ±0.36, tidak berpendar) dan cincin tipis.
export function titikCahaya({ nama = "titik cahaya" } = {}) {
  const g = new THREE.Group();
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), bahanPijar(W.zamrudPijar, 1));
  bola.position.y = 0.16;
  const halo = cincin({ radius: 0.24, tebal: 0.014, nama: `${nama} cincin` });
  g.add(bola, halo);
  g.userData = { nama, penting: true, bagian: { tepi: [], denyut: [], emas: [] } };
  return g;
}

// ---------------------------------------------------------------- gerak lokal
// jatuhMenancap: benda jatuh tegak dari `tinggi` di atas `ke`, dipercepat (u²), lalu memantul kecil dua kali yang meluruh.
// Mengembalikan detik mendarat.
export function jatuhMenancap(obj, { t, ke, tinggi = 2.6, durasi = 0.42, pantul = 0.12, lamaPantul = 0.45 }) {
  const tiba = t + durasi;
  daftarkan(obj, "posisi", {
    mulai: t,
    sebelum: (acc) => { acc.posisi = acc._pos.copy(ke).setY(ke.y + tinggi); },
    hitung(tt, acc) {
      const u = rentang(tt, t, tiba);
      let y = ke.y + tinggi * (1 - u * u);
      if (tt > tiba) {
        const w = rentang(tt, tiba, tiba + lamaPantul);
        y = ke.y + pantul * Math.abs(Math.sin(2 * Math.PI * w)) * (1 - w) * (1 - w);
      }
      acc.posisi = acc._pos.set(ke.x, y, ke.z);
    },
  });
  return tiba;
}

// toleh: figur berputar menghadap `ke` (sisi +z lokal), condong sedikit ke arahnya, dengan lompatan kecil.
// Pion tidak berwajah dan simetris, jadi condong dan lompatan itulah yang membuat gerak menoleh terbaca.
// Figur harus memakai rotation.order "YXZ" (diatur di sini sebelum frame pertama).
export function toleh(f, { t, ke, durasi = 0.5, condong = 12 * DEG, lompat = 0.05 }) {
  f.rotation.order = "YXZ";
  const sasaran = Math.atan2(ke.x - f.position.x, ke.z - f.position.z);
  daftarkan(f, "efek", {
    mulai: t,
    hitung(tt, acc) {
      const k = masukKeluar3(rentang(tt, t, t + durasi));
      let dy = sasaran - acc.dasar.rotasi.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      acc.putar.y += dy * k;
      acc.putar.x += condong * k;
      acc.geser.y += lompat * Math.sin(Math.PI * rentang(tt, t, t + 0.3));
    },
  });
  return { mulai: t, selesai: t + durasi };
}
