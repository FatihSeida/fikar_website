// Ikon kecil melayang dan properti kecil. Ikon bidang (kubus, daun, timbangan, buku, cakram, retak, grafik, dokumen),
// panah, gelombang sinyal, lalu properti: gembok, kompas, papan sasaran, anak panah, palu, pengeras suara, lencana,
// jam pasir. Mengikuti KONTRAK bagian 5 seperti dokumen.js: fungsi(opsi) → THREE.Group, titik asal di tengah alas,
// userData { nama, penting, bagian }. Ikon melayang bawaan penting: false. Warna hanya dari tema W, tanpa emissive bawaan.
// Ikon pipih menghadap kamera (hadapKamera: true); ikon bervolume diputar di sumbu y (hadap). Rincian: kit/docs/benda-dokumen-ikon.md.
import * as THREE from "three";
import { W } from "../inti/tema.js";
import { DEG, ISO } from "../inti/ruang.js";
import { bahanPadat, bahanKaca, bahanGaris, kotakBulat, garisTepi } from "../inti/bahan.js";
import { videoAktif } from "../inti/aktif.js";
import { label3D } from "../halaman/label.js";

// ---------------------------------------------------------------- pembantu (salinan kecil dari dokumen.js)
const HADAP = 45 * DEG;
const _geo = new Map();
const kunci = (...a) => a.map((x) => (typeof x === "number" ? x.toFixed(4) : String(x))).join(",");
function geoTetap(k, buat) {
  let g = _geo.get(k);
  if (!g) { g = buat(); _geo.set(k, g); }
  return g;
}
function mesh(geo, mat, bayangan = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = bayangan;
  m.receiveShadow = true;
  return m;
}
function bahanIsi(warna, warnaAbu = W.abuGelap, opsi = {}) {
  const m = bahanPadat(warna, opsi);
  m.userData.warnaAbu = warnaAbu;
  return m;
}
// Kertas untuk permukaan lengkung: kertas penuh yang menghadap matahari kit melewati ambang bloom (lihat dokumen.js).
const kertasLengkung = () => W.kertas.clone().lerp(W.abu, 0.15);
// Hanya bahan gelap yang menyala saat denyut; permukaan terang berdenyut lewat garis tepinya (lihat dokumen.js).
function saringDenyut(daftar) {
  const hasil = [];
  for (const x of daftar) {
    x?.traverse?.((o) => {
      if (!o.isMesh || o.isLineSegments2) return;
      const c = (Array.isArray(o.material) ? o.material[0] : o.material)?.color;
      if (c && 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b < 0.4) hasil.push(o);
    });
  }
  return hasil;
}
function kelompokHadap(kamera, hadap = HADAP) {
  const p = new THREE.Group();
  if (kamera) p.rotation.set(-ISO * DEG, 45 * DEG, 0, "YXZ");
  else p.rotation.y = hadap;
  return p;
}
function tepiDenyut(sumber) {
  const mat = bahanGaris(W.zamrudPijar, 3, 0);
  mat.userData.tepiDenyut = true;
  const l = garisTepi(sumber, { bahan: mat });
  l.visible = false;
  return l;
}
const ikutKamera = (f = 1) => { const v = videoAktif("label benda"); return () => (16 / v.rig.keadaan.H) * f; };
function buatLabel(spek, jangkar, bawaan = {}) {
  if (spek == null || spek === false || spek === "") return null;
  const o = typeof spek === "object" ? spek : { teks: String(spek) };
  const { teks, ...opsi } = { ...bawaan, ...o };
  if (opsi.skala === "ikut") opsi.skala = ikutKamera(1);
  return label3D(teks, { pada: jangkar, ...opsi });
}
function jangkar(induk, x, y, z) {
  const j = new THREE.Object3D();
  j.position.set(x, y, z);
  induk.add(j);
  return j;
}
// Nama bagian berulang ("belahan 1", "piring 2") untuk sumber peristiwa bunyi (userData.nama). Tidak mengubah tampilan.
function namai(daftar, dasar) {
  daftar.forEach((o, i) => { if (o) o.userData.nama = `${dasar} ${i + 1}`; });
  return daftar;
}
function selesai(g, { nama, penting, skala = 1, bagian, ...lain }) {
  g.scale.setScalar(skala);
  g.name = nama;
  g.userData = { nama, penting, bagian, ...lain };
  return g;
}
// Silinder dari titik a ke b (jari rA di a, rB di b).
function silinderAntara(a, b, rA, rB, mat, seg = 12) {
  const d = new THREE.Vector3().subVectors(b, a);
  const m = mesh(new THREE.CylinderGeometry(rB, rA, d.length(), seg), mat);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}
function geoPiringan(r, d, seg = 40) { // silinder pipih bersumbu z, alas di z = 0
  return geoTetap("piring" + kunci(r, d, seg), () => new THREE.CylinderGeometry(r, r, d, seg).rotateX(Math.PI / 2).translate(0, 0, d / 2));
}
function ekstrusi(bentuk, d, bevel = 0) { // bentuk 2D diekstrusi setebal d, berpusat di z = 0
  const geo = new THREE.ExtrudeGeometry(bentuk, { depth: d, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 16 });
  return geo.translate(0, 0, -d / 2);
}
function geoBintang(r, n, dalam, d) {
  return geoTetap("bintang" + kunci(r, n, dalam, d), () => {
    const s = new THREE.Shape();
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? r * dalam : r;
      if (i === 0) s.moveTo(rr * Math.cos(a), rr * Math.sin(a)); else s.lineTo(rr * Math.cos(a), rr * Math.sin(a));
    }
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  });
}
function geoEkorPita(w, h, d = 0.01) {
  return geoTetap("ekor" + kunci(w, h, d), () => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, -h); s.lineTo(0, -h + w * 0.55); s.lineTo(-w / 2, -h); s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  });
}
const geoKotak = (w, h, d, ay = 0.5) => geoTetap("k" + kunci(w, h, d, ay), () => new THREE.BoxGeometry(w, h, d).translate(0, (0.5 - ay) * h, 0));

// ================================================================ ikon bidang
// Semua ikon bidang: ukuran ≈ lebar/tinggi total (bawaan 0.4–0.55), warna bawaan zamrud. Untuk Bagian Gejala pakai
// setelKeadaan(ikon, "abu", 1); untuk hasil klikEmas(ikon).

// ---------------------------------------------------------------- ikonKubus (teknik)
// Kubus bertepi garis kertas; dalam kamera isometrik tampak sebagai segi enam tiga warna.
export function ikonKubus(opsi = {}) {
  const { ukuran = 0.4, warna = W.zamrud, warnaGaris = W.kertas, garis = true, hadap = 0, nama = "ikon kubus", penting = false, skala = 1 } = opsi;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const kubus = kotakBulat(ukuran, ukuran, ukuran, bahanPadat(warna), { radius: ukuran * 0.07, alas: true });
  putar.add(kubus);
  let mGaris = null;
  if (garis) { mGaris = garisTepi(kubus, { warna: warnaGaris, lebar: 2, opasitas: 0.9 }); kubus.add(mGaris); }
  const tepi = tepiDenyut(kubus);
  kubus.add(tepi);
  return selesai(g, { nama, penting, skala, bagian: { badan: kubus, garis: mGaris, emas: [kubus], denyut: saringDenyut([kubus]), tepi: [tepi] } });
}

// ---------------------------------------------------------------- ikonDaun (ilmu hayat)
// Daun lonjong bertangkai dengan urat tengah dan urat samping, condong 32°. Menghadap kamera.
export function ikonDaun(opsi = {}) {
  const { ukuran = 0.5, warna = W.zamrud, warnaUrat = W.zamrudRedup, hadapKamera = true, hadap = HADAP, nama = "ikon daun", penting = false, skala = 1 } = opsi;
  const s = ukuran;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const daun = new THREE.Group();
  daun.rotation.z = -32 * DEG;
  daun.position.y = s * 0.11;
  putar.add(daun);
  const d = s * 0.06;
  const geoDaun = geoTetap("daun" + kunci(s), () => {
    const b = new THREE.Shape();
    b.moveTo(0, 0);
    b.bezierCurveTo(s * 0.36, s * 0.1, s * 0.34, s * 0.62, 0, s * 0.88);
    b.bezierCurveTo(-s * 0.34, s * 0.62, -s * 0.36, s * 0.1, 0, 0);
    return ekstrusi(b, d, s * 0.012);
  });
  const mat = bahanPadat(warna);
  const helai = mesh(geoDaun, mat);
  const matUrat = bahanIsi(warnaUrat);
  const zMuka = d / 2 + s * 0.012 + 0.003;
  const urat = [];
  const tengah = mesh(geoKotak(s * 0.035, s * 0.74, 0.008, 0), matUrat, false);
  tengah.position.set(0, s * 0.06, zMuka);
  urat.push(tengah);
  for (const [y, p] of [[0.24, 0.17], [0.42, 0.16], [0.6, 0.11]]) {
    for (const a of [-1, 1]) {
      const u = mesh(geoKotak(s * 0.026, s * p, 0.008, 0), matUrat, false);
      u.position.set(0, s * y, zMuka);
      u.rotation.z = -a * 52 * DEG;
      urat.push(u);
    }
  }
  const tangkai = mesh(geoKotak(s * 0.045, s * 0.15, d * 0.8, 0), bahanPadat(warna));
  tangkai.position.y = -s * 0.12;
  daun.add(helai, tangkai, ...urat);
  return selesai(g, { nama, penting, skala, bagian: { helai, tangkai, urat, emas: [helai, tangkai], denyut: saringDenyut([helai, tangkai, ...urat]), tepi: [] } });
}

// ---------------------------------------------------------------- ikonTimbangan (hukum dan sosial)
// Tiang pada alas, balok mendatar di puncak, dua piring tergantung pada tali. Balok sejajar layar (hadap 45°).
export function ikonTimbangan(opsi = {}) {
  const { ukuran = 0.55, warna = W.zamrud, hadap = HADAP, nama = "ikon timbangan", penting = false, skala = 1 } = opsi;
  const s = ukuran;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const mat = bahanPadat(warna);
  const alas = mesh(geoTetap("timbAlas" + kunci(s), () => new THREE.CylinderGeometry(s * 0.16, s * 0.2, s * 0.05, 24).translate(0, s * 0.025, 0)), mat);
  const tiang = mesh(geoTetap("timbTiang" + kunci(s), () => new THREE.CylinderGeometry(s * 0.032, s * 0.032, s * 0.64, 12).translate(0, s * 0.37, 0)), mat);
  const puncak = mesh(geoTetap("timbPuncak" + kunci(s), () => new THREE.SphereGeometry(s * 0.06, 16, 10)), mat);
  puncak.position.y = s * 0.72;
  const balok = kotakBulat(s * 1.0, s * 0.05, s * 0.06, mat, { radius: s * 0.02 });
  balok.position.y = s * 0.67;
  putar.add(alas, tiang, puncak, balok);
  const piring = [], tali = [];
  for (const a of [-1, 1]) {
    const x = a * s * 0.44;
    const p = mesh(geoTetap("timbPiring" + kunci(s), () => new THREE.CylinderGeometry(s * 0.2, s * 0.11, s * 0.05, 28)), mat);
    p.position.set(x, s * 0.33, 0);
    putar.add(p);
    piring.push(p);
    for (const b of [-1, 1]) {
      const t = silinderAntara(new THREE.Vector3(x, s * 0.66, 0), new THREE.Vector3(x + b * s * 0.15, s * 0.355, 0), s * 0.016, s * 0.016, mat, 6);
      putar.add(t);
      tali.push(t);
    }
  }
  const semua = [alas, tiang, puncak, balok, ...piring, ...tali];
  return selesai(g, { nama, penting, skala, bagian: { balok, piring: namai(piring, "piring"), tali, emas: semua, denyut: saringDenyut(semua), tepi: [] } });
}

// ---------------------------------------------------------------- ikonBuku
// Buku terbuka berbentuk V (dua halaman bergaris di atas sampul), menghadap kamera.
export function ikonBuku(opsi = {}) {
  const { ukuran = 0.6, warna = W.zamrud, warnaHalaman = W.kertas, warnaGaris = W.zamrudRedup, hadapKamera = true, hadap = HADAP, nama = "ikon buku", penting = false, skala = 1 } = opsi;
  const s = ukuran;
  const w = s * 0.44, h = s * 0.62;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const isi = new THREE.Group();
  isi.position.y = h / 2 + s * 0.04;
  putar.add(isi);
  const matSampul = bahanPadat(warna), matHalaman = bahanPadat(warnaHalaman), matGaris = bahanIsi(warnaGaris);
  const halaman = [], sampul = [];
  for (const a of [-1, 1]) {
    const sisi = new THREE.Group();
    sisi.rotation.y = a < 0 ? 20 * DEG : -20 * DEG; // tepi luar halaman maju ke arah kamera (bentuk V)
    isi.add(sisi);
    const sm = kotakBulat(w + s * 0.04, h + s * 0.07, s * 0.03, matSampul, { radius: s * 0.012 });
    sm.position.set(a * (w / 2 + s * 0.02), 0, -s * 0.032);
    const hl = kotakBulat(w, h, s * 0.035, matHalaman, { radius: s * 0.01 });
    hl.position.set(a * (w / 2 + s * 0.006), 0, 0);
    sisi.add(sm, hl);
    sampul.push(sm);
    halaman.push(hl);
    for (let i = 0; i < 4; i++) {
      const p = w * (i === 0 ? 0.5 : 0.62 + 0.08 * ((i * 7) % 3));
      const m = mesh(geoKotak(p, s * 0.035, 0.006), matGaris, false);
      m.position.set(a * (w / 2 + s * 0.006), h * (0.28 - i * 0.19), s * 0.02);
      sisi.add(m);
    }
  }
  return selesai(g, { nama, penting, skala, bagian: { halaman: namai(halaman, "halaman"), sampul, emas: [...sampul, ...halaman], denyut: saringDenyut(sampul), tepi: [] } });
}

// ---------------------------------------------------------------- ikonCakram
// Cakram (piringan rekaman) dengan dua alur melingkar, label tengah, dan lubang. Menghadap kamera.
export function ikonCakram(opsi = {}) {
  const { ukuran = 0.5, warna = W.zamrud, warnaAlur = W.zamrudRedup, warnaTengah = W.kertas, hadapKamera = true, hadap = HADAP, nama = "ikon cakram", penting = false, skala = 1 } = opsi;
  const r = ukuran / 2, d = ukuran * 0.07;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const isi = new THREE.Group();
  isi.position.set(0, r, -d / 2);
  putar.add(isi);
  const piringan = mesh(geoPiringan(r, d, 48), bahanPadat(warna));
  const matAlur = bahanIsi(warnaAlur);
  const alur = [0.8, 0.62].map((k) => {
    const m = mesh(geoTetap("alur" + kunci(r, k), () => new THREE.TorusGeometry(r * k, r * 0.035, 6, 48)), matAlur, false);
    m.position.z = d;
    return m;
  });
  const tengah = mesh(geoPiringan(r * 0.34, 0.012, 32), bahanIsi(warnaTengah, W.abu), false);
  tengah.position.z = d;
  const lubang = mesh(geoPiringan(r * 0.09, 0.016, 16), bahanIsi(W.pelat, W.pelat), false);
  lubang.position.z = d;
  isi.add(piringan, ...alur, tengah, lubang);
  return selesai(g, { nama, penting, skala, bagian: { piringan, alur, tengah, emas: [piringan, tengah], denyut: saringDenyut([piringan, ...alur]), tepi: [] } });
}

// ---------------------------------------------------------------- ikonRetak (kegagalan)
// Lempeng terbelah dua oleh retakan zigzag, kedua belahan sedikit renggang. Bawaan abu. bagian.belahan untuk memisahkan.
export function ikonRetak(opsi = {}) {
  const { ukuran = 0.5, warna = W.abu, celah = 0.07, hadapKamera = true, hadap = HADAP, nama = "ikon retak", penting = false, skala = 1 } = opsi;
  const s = ukuran, d = s * 0.08, bevel = s * 0.016;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const isi = new THREE.Group();
  isi.position.y = s * 0.5 + bevel;
  putar.add(isi);
  const Z = [[0.07, 0.5], [-0.08, 0.25], [0.1, 0.04], [-0.08, -0.2], [0.05, -0.5]];
  const bentuk = (titik2) => {
    const b = new THREE.Shape();
    titik2.forEach(([x, y], i) => (i ? b.lineTo(x * s, y * s) : b.moveTo(x * s, y * s)));
    b.closePath();
    return b;
  };
  const kiri = [[-0.5, -0.5], ...[...Z].reverse(), [-0.5, 0.5]];
  const kanan = [Z[0], [0.5, 0.5], [0.5, -0.5], ...[...Z].reverse().slice(0, 4)];
  const mat = bahanPadat(warna);
  const belahan = [kiri, kanan].map((t, i) => {
    const m = mesh(geoTetap("retak" + kunci(s, i), () => ekstrusi(bentuk(t), d, bevel)), mat);
    const a = i ? 1 : -1;
    m.position.set(a * celah * s * 0.5, i ? -s * 0.02 : 0, 0);
    m.rotation.z = -a * 4 * DEG;
    isi.add(m);
    return m;
  });
  return selesai(g, { nama, penting, skala, bagian: { belahan: namai(belahan, "belahan"), emas: belahan, denyut: saringDenyut(belahan), tepi: [] } });
}

// ---------------------------------------------------------------- ikonGrafik
// Tiga batang naik di atas alas tipis, sejajar layar. bagian.batang (titik asal di alas → tumbuh(batang, { sumbu: "y" })).
export function ikonGrafik(opsi = {}) {
  const { ukuran = 0.5, tinggi = [0.4, 0.65, 1], warna = W.zamrud, warnaAlas = W.abuGelap, hadap = HADAP, nama = "ikon grafik", penting = false, skala = 1 } = opsi;
  const s = ukuran;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const alas = kotakBulat(s * 1.0, s * 0.05, s * 0.36, bahanPadat(warnaAlas), { radius: s * 0.02, alas: true });
  putar.add(alas);
  const n = tinggi.length;
  const batang = tinggi.map((t, i) => {
    const b = kotakBulat(s * 0.22, Math.max(0.02, s * 0.8 * t), s * 0.22, bahanPadat(warna), { radius: s * 0.025, alas: true });
    b.position.set((i - (n - 1) / 2) * s * 0.31, s * 0.05, 0);
    b.userData.nama = `batang ${i + 1}`;
    putar.add(b);
    return b;
  });
  return selesai(g, { nama, penting, skala, bagian: { alas, batang, emas: batang, denyut: saringDenyut(batang), tepi: [] } });
}

// ---------------------------------------------------------------- ikonDokumen
// Lembar bersudut lipat dengan judul dan garis teks, menghadap kamera.
export function ikonDokumen(opsi = {}) {
  const { ukuran = 0.5, warna = W.kertas, warnaGaris = W.zamrudRedup, hadapKamera = true, hadap = HADAP, nama = "ikon dokumen", penting = false, skala = 1 } = opsi;
  const s = ukuran, w = s * 0.76, h = s, c = w * 0.3, d = s * 0.05;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const geoLembar = geoTetap("dok" + kunci(s), () => {
    const b = new THREE.Shape();
    b.moveTo(-w / 2, 0); b.lineTo(w / 2, 0); b.lineTo(w / 2, h - c); b.lineTo(w / 2 - c, h); b.lineTo(-w / 2, h); b.closePath();
    return ekstrusi(b, d, s * 0.01);
  });
  const lembar = mesh(geoLembar, bahanPadat(warna));
  const geoLipat = geoTetap("lipat" + kunci(s), () => {
    const b = new THREE.Shape();
    b.moveTo(w / 2 - c, h); b.lineTo(w / 2 - c, h - c); b.lineTo(w / 2, h - c); b.closePath();
    return ekstrusi(b, 0.008);
  });
  const lipat = mesh(geoLipat, bahanIsi(W.abu.clone().lerp(warna, 0.35), W.abuGelap), false);
  lipat.position.z = d / 2 + s * 0.012;
  const matGaris = bahanIsi(warnaGaris);
  const garis = [[0.42, 0.07, 0.74], [0.62, 0.04, 0.55], [0.56, 0.04, 0.4], [0.62, 0.04, 0.25], [0.36, 0.04, 0.1]].map(([p, t, y], i) => {
    const m = mesh(geoKotak(w * p, s * t, 0.006), matGaris, false);
    m.position.set(-w / 2 + w * 0.13 + (w * p) / 2, h * y + (i === 0 ? 0 : 0), d / 2 + s * 0.012);
    return m;
  });
  putar.add(lembar, lipat, ...garis);
  return selesai(g, { nama, penting, skala, bagian: { lembar, lipat, garis: namai(garis, "garis"), emas: [lembar], denyut: saringDenyut([lembar, lipat, ...garis]), tepi: [] } });
}

// ================================================================ panah dan sinyal
function bentukPanah(h, lebarKepala = 0.66, lebarBatang = 0.28, tinggiKepala = 0.46) {
  const wk = lebarKepala * h, wb = lebarBatang * h, hk = tinggiKepala * h;
  const s = new THREE.Shape();
  s.moveTo(-wb / 2, 0); s.lineTo(wb / 2, 0); s.lineTo(wb / 2, h - hk); s.lineTo(wk / 2, h - hk);
  s.lineTo(0, h); s.lineTo(-wk / 2, h - hk); s.lineTo(-wb / 2, h - hk); s.closePath();
  return s;
}
// ---------------------------------------------------------------- ikonPanah
// Panah tebal naik atau turun (arah: "naik" | "turun"), menghadap kamera. Titik asal di bawah.
export function ikonPanah(opsi = {}) {
  const { ukuran = 0.5, arah = "naik", warna = W.zamrud, hadapKamera = true, hadap = HADAP, nama = "ikon panah", penting = false, skala = 1 } = opsi;
  const s = ukuran;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const turun = arah === "turun";
  const geo = geoTetap("panah" + kunci(s, turun), () => {
    const x = ekstrusi(bentukPanah(s), s * 0.08, s * 0.015);
    return turun ? x.rotateZ(Math.PI).translate(0, s, 0) : x;
  });
  const m = mesh(geo, bahanPadat(warna));
  m.position.y = s * 0.015;
  putar.add(m);
  return selesai(g, { nama, penting, skala, bagian: { badan: m, emas: [m], denyut: saringDenyut([m]), tepi: [] } });
}

// ---------------------------------------------------------------- gelombangSinyal
// Titik sumber dan `jumlah` busur yang memancar ke arah `sudut` (radian di bidang layar; 90° = ke atas), lebar busur `sebar`.
// Titik asal di titik sumber. bagian.busur (dari dalam ke luar) untuk dimunculkan berurutan: muncul(busur, { t, jeda: 0.12 }).
export function gelombangSinyal(opsi = {}) {
  const {
    ukuran = 0.6, jumlah = 3, sudut = 90 * DEG, sebar = 100 * DEG, warna = W.zamrudPijar, hadapKamera = true, hadap = HADAP,
    nama = "gelombang sinyal", penting = false, skala = 1,
  } = opsi;
  const s = ukuran;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const matTitik = bahanPadat(warna);
  const sumber = mesh(geoTetap("sinyalTitik" + kunci(s), () => new THREE.SphereGeometry(s * 0.075, 16, 12)), matTitik);
  putar.add(sumber);
  const busur = [];
  for (let i = 0; i < jumlah; i++) {
    const R = s * (0.3 + (0.66 * i) / Math.max(1, jumlah - 1));
    const m = mesh(geoTetap("sinyal" + kunci(R, s, sebar), () => new THREE.TorusGeometry(R, s * 0.05, 8, 40, sebar)), bahanPadat(warna));
    m.rotation.z = sudut - sebar / 2;
    m.userData.nama = `busur ${i + 1}`;
    putar.add(m);
    busur.push(m);
  }
  return selesai(g, { nama, penting, skala, bagian: { sumber, busur, emas: [sumber, ...busur], denyut: saringDenyut([sumber, ...busur]), tepi: [] } });
}

// ================================================================ properti kecil
// ---------------------------------------------------------------- gembok
// Badan 0.3 × 0.25 × 0.15 kertas (kertasLengkung: tepi bulatnya melewati ambang bloom bila kertas penuh), busur setengah lingkaran abu, lubang kunci di muka depan (menghadap kamera).
// bagian.busur berporos di kaki kirinya: busur.position.y naik dan busur.rotation.y = -π/2 untuk membuka; terbuka: true.
export function gembok(opsi = {}) {
  const {
    lebar = 0.3, tinggi = 0.25, dalam = 0.15, warna = kertasLengkung(), warnaBusur = W.abu, warnaLubang = W.pelat, terbuka = false,
    hadap = HADAP, nama = "gembok", penting = true, skala = 1,
  } = opsi;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const badan = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { radius: Math.min(0.035, dalam * 0.25), alas: true });
  putar.add(badan);
  const rb = lebar * 0.3, tb = lebar * 0.07, kakiB = tinggi * 0.28;
  const matBusur = bahanPadat(warnaBusur);
  const busur = new THREE.Group();
  busur.position.set(-rb, tinggi, 0);
  const lengkung = mesh(geoTetap("gembokBusur" + kunci(rb, tb), () => new THREE.TorusGeometry(rb, tb, 10, 28, Math.PI)), matBusur);
  lengkung.position.set(rb, kakiB, 0);
  const kakiKiri = mesh(geoTetap("gembokKaki" + kunci(tb, kakiB), () => new THREE.CylinderGeometry(tb, tb, kakiB + 0.03, 12).translate(0, (kakiB - 0.03) / 2, 0)), matBusur);
  const kakiKanan = kakiKiri.clone();
  kakiKanan.position.x = 2 * rb;
  busur.add(lengkung, kakiKiri, kakiKanan);
  if (terbuka) { busur.position.y += kakiB * 0.9; busur.rotation.y = -0.35 * Math.PI; }
  putar.add(busur);
  const matLubang = bahanIsi(warnaLubang, W.pelat);
  const lubang = mesh(geoPiringan(lebar * 0.1, 0.006, 20), matLubang, false);
  lubang.position.set(0, tinggi * 0.56, dalam / 2);
  const celah = mesh(geoKotak(lebar * 0.07, tinggi * 0.26, 0.006, 1), matLubang, false);
  celah.position.set(0, tinggi * 0.56, dalam / 2 + 0.003);
  putar.add(lubang, celah);
  const tepi = tepiDenyut(badan);
  badan.add(tepi);
  return selesai(g, { nama, penting, skala, bagian: { badan, busur, emas: [badan, lengkung, kakiKiri, kakiKanan], denyut: saringDenyut([badan, busur]), tepi: [tepi] } });
}

// ---------------------------------------------------------------- kompas
// Cakram rebah jari 0.9 tebal 0.08 warna kertas, cincin tepi, delapan garis arah, dan jarum pipih panjang 0.8.
// arahJarum: sudut jarum di layar (0 = kanan, 90° = atas layar, 45° = kanan atas). Putar jarum: putar(bagian.jarum, { sumbu: "y", sudut }).
// miring: cakram dicondongkan ke arah kamera (0 = rebah, 90° = tegak). label: teks HTML di atas kompas.
export function kompas(opsi = {}) {
  const {
    jari = 0.9, tebal = 0.08, warna = W.kertas, warnaTepi = W.zamrudRedup, warnaJarum = W.zamrud, warnaEkor = W.abuGelap,
    arahJarum = 90 * DEG, miring = 0, label = null, nama = "kompas", penting = true, skala = 1,
  } = opsi;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, HADAP);
  g.add(putar);
  const condong = new THREE.Group();
  condong.position.y = tebal / 2 + jari * Math.sin(miring);
  condong.rotation.x = miring;
  putar.add(condong);
  const piringan = mesh(geoTetap("kompas" + kunci(jari, tebal), () => new THREE.CylinderGeometry(jari, jari, tebal, 64)), bahanPadat(warna));
  const matTepi = bahanIsi(warnaTepi);
  const cincin = mesh(geoTetap("kompasCincin" + kunci(jari), () => new THREE.TorusGeometry(jari - 0.045, 0.03, 8, 64).rotateX(Math.PI / 2)), matTepi);
  cincin.position.y = tebal / 2;
  condong.add(piringan, cincin);
  const garisArah = [];
  const matArah = bahanIsi(warnaTepi); // bahan sendiri: garis arah tetap gelap saat kompas emas
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, besar = i % 2 === 0;
    const m = mesh(geoKotak(besar ? 0.04 : 0.025, 0.012, besar ? jari * 0.2 : jari * 0.11), matArah, false);
    const rr = jari * (besar ? 0.72 : 0.77);
    m.position.set(Math.sin(a) * rr, tebal / 2 + 0.006, Math.cos(a) * rr);
    m.rotation.y = a;
    condong.add(m);
    garisArah.push(m);
  }
  const jarum = new THREE.Group();
  jarum.position.y = tebal / 2 + 0.03;
  jarum.rotation.y = arahJarum;
  const pj = jari * 0.45, lj = jari * 0.09;
  const geoSetengah = geoTetap("jarum" + kunci(pj, lj), () => {
    const b = new THREE.Shape();
    b.moveTo(0, -lj); b.lineTo(pj, 0); b.lineTo(0, lj); b.closePath();
    return new THREE.ExtrudeGeometry(b, { depth: 0.03, bevelEnabled: false }).rotateX(-Math.PI / 2);
  });
  const utara = mesh(geoSetengah, bahanPadat(warnaJarum));
  const selatan = mesh(geoSetengah, bahanIsi(warnaEkor, W.abuGelap));
  selatan.rotation.y = Math.PI;
  const pin = mesh(geoTetap("pin" + kunci(jari), () => new THREE.CylinderGeometry(jari * 0.055, jari * 0.055, 0.05, 16)), matArah);
  pin.position.y = 0.035;
  jarum.add(utara, selatan, pin);
  condong.add(jarum);
  const tepi = tepiDenyut(piringan);
  piringan.add(tepi);
  // Label di atas tepi jauh cakram (sisi -z lokal = atas layar), supaya tidak menutupi jarum.
  const lbl = buatLabel(label, jangkar(condong, 0, tebal / 2 + 0.02, -jari - 0.1), { gaya: "benda" });
  return selesai(g, {
    nama, penting, skala, label: lbl,
    bagian: { piringan, cincin, garisArah, jarum, utara, selatan, emas: [piringan, cincin, utara], denyut: saringDenyut([cincin, utara, selatan, ...garisArah]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- papanSasaran
// Tiga cincin konsentris (jari 1.0, 0.66, 0.33, tebal 0.08; pelat, zamrudRedup, kertas) tegak di tiang 1.2, menghadap kamera.
// label: tiga teks dari luar ke dalam, mis. ["MASALAH", "KEADAAN AWAL", "UKURAN HASIL"]. bagian.cincin[0..2] (luar → dalam)
// bisa dimunculkan dan diklik emas sendiri. userData.titikPusat(out): titik dunia di muka cincin dalam (sasaran anak panah).
export function papanSasaran(opsi = {}) {
  const {
    jari = [1.0, 0.66, 0.33], tebal = 0.08, tiang = 1.2, warna = [W.pelat, W.zamrudRedup, W.kertas], warnaTepi = W.zamrudRedup,
    miring = 15 * DEG, hadap = HADAP, label = null, skalaLabel = "ikut", nama = "papan sasaran", penting = true, skala = 1,
  } = opsi;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const matKayu = bahanPadat(W.pelat);
  const alas = kotakBulat(0.7, 0.06, 0.45, matKayu, { radius: 0.02, alas: true });
  alas.position.z = -0.1;
  const batang = kotakBulat(0.12, tiang, 0.12, matKayu, { radius: 0.03, alas: true });
  batang.position.z = -0.16;
  putar.add(alas, batang);
  for (const m of [alas, batang]) m.add(garisTepi(m, { warna: warnaTepi, lebar: 2, opasitas: 0.8 }));
  const papan = new THREE.Group();
  papan.position.y = tiang;
  papan.rotation.x = -miring;
  putar.add(papan);
  // Tiap cincin punya bibir kertas tipis di tepinya (anak cincin, ikut muncul dan emas bersama cincinnya),
  // supaya cincin pelat terluar tetap terbaca di atas latar gelap.
  const matBibir = jari.map(() => bahanPadat(kertasLengkung()));
  const cincin = jari.map((r, i) => {
    const m = mesh(geoPiringan(r, tebal, 64), bahanPadat(warna[i] ?? W.kertas));
    m.position.z = i * 0.022;
    m.userData.nama = `cincin ${i + 1}`;
    const bibir = mesh(geoTetap("bibirSasaran" + kunci(r), () => new THREE.TorusGeometry(r - 0.012, 0.016, 6, 64)), matBibir[i], false);
    bibir.position.z = tebal;
    m.add(bibir);
    papan.add(m);
    return m;
  });
  cincin[0].add(garisTepi(cincin[0].geometry, { warna: warnaTepi, lebar: 2, opasitas: 0.9 }));
  const zMuka = tebal + (jari.length - 1) * 0.022 + 0.01;
  const lbl = [];
  if (Array.isArray(label)) {
    label.forEach((teks, i) => {
      const y = i < jari.length - 1 ? (jari[i] + jari[i + 1]) / 2 : 0;
      // Di atas cincin gelap: teks terang bertitik ("benda"). Di atas cincin terang: kotak gelap ("kotak") supaya terbaca.
      const gelap = (warna[i] ?? W.kertas).getHSL({}).l < 0.5;
      const skalaL = !gelap && skalaLabel === "ikut" ? ikutKamera(0.75) : skalaLabel;
      lbl.push(buatLabel(teks, jangkar(papan, 0, y, zMuka), { gaya: gelap ? "benda" : "kotak", ax: 0.5, ay: 0.5, skala: skalaL }));
    });
  }
  const tepi = tepiDenyut(cincin[0]);
  cincin[0].add(tepi);
  const pusat = new THREE.Vector3(0, 0, zMuka);
  return selesai(g, {
    nama, penting, skala, label: lbl,
    titikPusat: (out = new THREE.Vector3()) => papan.localToWorld(out.copy(pusat)),
    bagian: { papan, cincin, batang, emas: cincin, denyut: saringDenyut(cincin), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- anakPanah
// Batang tipis jari 0.025 panjang 0.9 berujung kerucut dan berbulu zamrud. Titik asal di ujung mata panah; badan naik ke +y
// (bawaan: menancap tegak di tanah). userData.arahkan(arah) memutar panah supaya ujungnya menuju vektor `arah`
// (panggil di v.setiapFrame bila arah berubah selama terbang, karena gerak menimpa rotasi).
export function anakPanah(opsi = {}) {
  const { panjang = 0.9, jari = 0.025, warna = kertasLengkung(), warnaBulu = W.zamrud, nama = "anak panah", penting = true, skala = 1 } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  const pk = Math.min(0.16, panjang * 0.18);
  const kepala = mesh(geoTetap("mataPanah" + kunci(jari, pk), () => new THREE.ConeGeometry(jari * 2.6, pk, 16).rotateX(Math.PI).translate(0, pk / 2, 0)), mat);
  const batang = mesh(geoTetap("batangPanah" + kunci(jari, panjang, pk), () => new THREE.CylinderGeometry(jari, jari, panjang - pk, 10).translate(0, pk + (panjang - pk) / 2, 0)), mat);
  const matBulu = bahanPadat(warnaBulu);
  const geoBulu = geoTetap("bulu" + kunci(panjang), () => {
    const b = new THREE.Shape();
    const L = Math.min(0.24, panjang * 0.26), w = 0.075;
    b.moveTo(0, 0); b.lineTo(w, L * 0.25); b.lineTo(w, L); b.lineTo(0, L * 0.82); b.closePath();
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(-w, L * 0.25); s.lineTo(-w, L); s.lineTo(0, L * 0.82); s.closePath();
    return new THREE.ExtrudeGeometry([b, s], { depth: 0.008, bevelEnabled: false }).translate(0, panjang - L - 0.02, -0.004);
  });
  const bulu = [0, Math.PI / 2].map((a) => { const m = mesh(geoBulu, matBulu); m.rotation.y = a; return m; });
  g.add(kepala, batang, ...bulu);
  const _a = new THREE.Vector3(), BAWAH_LOKAL = new THREE.Vector3(0, -1, 0);
  return selesai(g, {
    nama, penting, skala,
    arahkan: (arah) => { g.quaternion.setFromUnitVectors(BAWAH_LOKAL, _a.copy(arah).normalize()); return g; },
    bagian: { kepala, batang, bulu, emas: [kepala, batang, ...bulu], denyut: saringDenyut([kepala, batang, ...bulu]), tepi: [] },
  });
}

// ---------------------------------------------------------------- palu
// Palu sidang: kepala silinder jari 0.12 panjang 0.4 dengan dua pita, gagang 0.6 yang ujungnya bersandar di meja.
// bagian.ayun berporos di ujung gagang: ayun.rotation.z = -sudut mengangkat kepala (ketukan: naik lalu turun).
// alas: true menambah landasan bundar di bawah kepala.
export function palu(opsi = {}) {
  const {
    jari = 0.12, panjang = 0.4, gagang = 0.6, warna = kertasLengkung(), warnaPita = W.zamrudRedup, alas = false, hadap = 0,
    nama = "palu", penting = true, skala = 1,
  } = opsi;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const tinggiAlas = alas ? 0.06 : 0;
  let mAlas = null;
  if (alas) {
    mAlas = mesh(geoTetap("landasan" + kunci(jari), () => new THREE.CylinderGeometry(jari * 1.9, jari * 2.1, tinggiAlas, 32).translate(0, tinggiAlas / 2, 0)), bahanPadat(warnaPita));
    putar.add(mAlas);
  }
  const ujungY = 0.045;
  const ayun = new THREE.Group();
  ayun.position.set(gagang, ujungY, 0);
  putar.add(ayun);
  const pusatKepala = new THREE.Vector3(-gagang, tinggiAlas + jari - ujungY, 0);
  const mat = bahanPadat(warna), matPita = bahanIsi(warnaPita);
  const kepala = mesh(geoTetap("kepalaPalu" + kunci(jari, panjang), () => new THREE.CylinderGeometry(jari, jari, panjang, 32).rotateX(Math.PI / 2)), mat);
  kepala.position.copy(pusatKepala);
  const pita = [-1, 1].map((a) => {
    const m = mesh(geoTetap("pitaPalu" + kunci(jari, panjang), () => new THREE.CylinderGeometry(jari * 1.07, jari * 1.07, panjang * 0.1, 32).rotateX(Math.PI / 2)), matPita);
    m.position.copy(pusatKepala).add(new THREE.Vector3(0, 0, a * panjang * 0.3));
    return m;
  });
  const mGagang = silinderAntara(pusatKepala, new THREE.Vector3(-0.02, 0, 0), 0.035, 0.042, mat, 16);
  const ujung = mesh(geoTetap("ujungPalu", () => new THREE.SphereGeometry(0.05, 16, 10)), mat);
  ayun.add(kepala, ...pita, mGagang, ujung);
  return selesai(g, {
    nama, penting, skala,
    bagian: { ayun, kepala, pita, gagang: mGagang, alas: mAlas, emas: [kepala, mGagang, ujung], denyut: saringDenyut([kepala, mGagang, ...pita]), tepi: [] },
  });
}

// ---------------------------------------------------------------- pengerasSuara
// Corong kerucut (mulut ke +x lokal, condong 10° ke atas) dengan bibir dan bagian dalam zamrudRedup, pegangan di bawah.
// hadap bawaan 30°: mulut ke kanan layar, sedikit menghadap kamera supaya lubangnya terlihat. Titik asal di bawah pegangan.
export function pengerasSuara(opsi = {}) {
  const { ukuran = 0.5, warna = kertasLengkung(), warnaDalam = W.zamrudRedup, hadap = 30 * DEG, miring = 10 * DEG, nama = "pengeras suara", penting = true, skala = 1 } = opsi;
  const s = ukuran;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const condong = new THREE.Group();
  condong.position.y = s * 0.3;
  condong.rotation.z = miring;
  putar.add(condong);
  const rM = s * 0.22, rB = s * 0.075, L = s * 0.5;
  const luar = mesh(geoTetap("corong" + kunci(s), () => new THREE.CylinderGeometry(rM, rB, L, 32, 1, true).rotateZ(-Math.PI / 2)), bahanPadat(warna, { side: THREE.FrontSide }));
  const dalam = mesh(geoTetap("corongDalam" + kunci(s), () => new THREE.CylinderGeometry(rM * 0.97, rB * 0.95, L * 0.99, 32, 1, true).rotateZ(-Math.PI / 2)), bahanIsi(warnaDalam, W.abuGelap, { side: THREE.BackSide }), false);
  luar.position.x = dalam.position.x = s * 0.12;
  const bibir = mesh(geoTetap("bibir" + kunci(s), () => new THREE.TorusGeometry(rM, s * 0.022, 8, 32).rotateY(Math.PI / 2)), bahanIsi(warnaDalam));
  bibir.position.x = s * 0.12 + L / 2;
  const belakang = mesh(geoTetap("pangkalCorong" + kunci(s), () => new THREE.CylinderGeometry(rB, rB * 1.1, s * 0.13, 20).rotateZ(-Math.PI / 2)), bahanPadat(warna));
  belakang.position.x = s * 0.12 - L / 2 - s * 0.06;
  const pegangan = kotakBulat(s * 0.07, s * 0.24, s * 0.07, bahanIsi(warnaDalam), { radius: s * 0.02 });
  pegangan.position.set(-s * 0.02, -s * 0.15, 0);
  pegangan.rotation.z = 0.25;
  condong.add(luar, dalam, bibir, belakang, pegangan);
  return selesai(g, {
    nama, penting, skala,
    bagian: { corong: luar, dalam, bibir, pegangan, emas: [luar, belakang, bibir], denyut: saringDenyut([luar, belakang, bibir, pegangan]), tepi: [] },
  });
}

// ---------------------------------------------------------------- lencana
// Cakram pipih jari 0.12 (untuk dada figur) dengan cincin tepi dan bintang zamrud; pita: true menambah dua ekor pita.
// Tegak menghadap kamera; titik asal di bawah (pusat cakram di y = jari, atau lebih tinggi bila berpita).
// Emas: cakram dan cincin; bintang tetap gelap supaya terbaca.
export function lencana(opsi = {}) {
  const { jari = 0.12, tebal = 0.03, warna = kertasLengkung(), warnaTepi = W.zamrud, pita = false, hadapKamera = false, hadap = HADAP, nama = "lencana", penting = true, skala = 1 } = opsi;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const isi = new THREE.Group();
  isi.position.y = jari + (pita ? jari * 1.1 : 0);
  putar.add(isi);
  const cakram = mesh(geoPiringan(jari, tebal, 40), bahanPadat(warna));
  const matTepi = bahanIsi(warnaTepi);
  const cincin = mesh(geoTetap("lencanaCincin" + kunci(jari), () => new THREE.TorusGeometry(jari * 0.84, jari * 0.09, 8, 40)), bahanIsi(warnaTepi));
  cincin.position.z = tebal;
  const bintang = mesh(geoBintang(jari * 0.46, 5, 0.45, tebal * 0.4), matTepi, false);
  bintang.position.z = tebal;
  isi.add(cakram, cincin, bintang);
  const ekor = [];
  if (pita) {
    const matPita = bahanIsi(W.zamrud);
    for (const a of [-1, 1]) {
      const e = mesh(geoEkorPita(jari * 0.62, jari * 1.5, tebal * 0.4), matPita);
      e.rotation.z = a * 0.3;
      e.position.set(a * jari * 0.25, -jari * 0.5, -0.004);
      isi.add(e);
      ekor.push(e);
    }
  }
  return selesai(g, { nama, penting, skala, bagian: { cakram, cincin, bintang, pita: ekor, emas: [cakram, cincin], denyut: saringDenyut([cakram, cincin, bintang]), tepi: [] } });
}

// ---------------------------------------------------------------- jamPasir
// Jam pasir setinggi 0.6: dua pelat zamrudRedup, tiga tiang, kaca bening berbentuk dua bola, pasir kertas.
// isi = bagian pasir yang masih di atas (0..1). Untuk menggerakkan: bagian.pasirAtas.scale.y = k, bagian.pasirBawah.scale.y = 1 − k
// (titik asal keduanya di dasar masing-masing), bagian.aliran.visible selama pasir mengalir.
export function jamPasir(opsi = {}) {
  const { tinggi = 0.6, warna = W.zamrudRedup, warnaPasir = kertasLengkung(), isi = 0.6, hadap = HADAP, nama = "jam pasir", penting = true, skala = 1 } = opsi;
  const h = tinggi, rP = h * 0.3, tP = h * 0.07;
  const g = new THREE.Group();
  const putar = kelompokHadap(false, hadap);
  g.add(putar);
  const matRangka = bahanPadat(warna);
  const pelat = [tP / 2, h - tP / 2].map((y) => {
    const m = mesh(geoTetap("jpPelat" + kunci(h), () => new THREE.CylinderGeometry(rP, rP, tP, 32)), matRangka);
    m.position.y = y;
    return m;
  });
  const tiang = [90, 210, 330].map((a) => {
    const m = mesh(geoTetap("jpTiang" + kunci(h), () => new THREE.CylinderGeometry(h * 0.018, h * 0.018, h - 2 * tP, 8)), matRangka);
    m.position.set(Math.cos(a * DEG) * rP * 0.84, h / 2, Math.sin(a * DEG) * rP * 0.84);
    return m;
  });
  const y0 = tP, y1 = h - tP, ym = h / 2, rB = rP * 0.7, rN = h * 0.03;
  const jariPada = (y) => rN + (rB - rN) * Math.pow(Math.min(1, Math.abs(y - ym) / (ym - y0)), 0.55) * (1 - 0.35 * Math.pow(Math.abs(y - ym) / (ym - y0), 6));
  const kaca = mesh(geoTetap("jpKaca" + kunci(h), () => {
    const p = [];
    for (let i = 0; i <= 32; i++) { const y = y0 + ((y1 - y0) * i) / 32; p.push(new THREE.Vector2(Math.max(0.002, jariPada(y)), y)); }
    return new THREE.LatheGeometry(p, 32);
  }), bahanKaca(W.zamrud), false);
  const matPasir = bahanPadat(warnaPasir);
  const hA = (y1 - ym) * 0.62, hB = (ym - y0) * 0.5;
  const pasirAtas = mesh(geoTetap("jpAtas" + kunci(h), () => new THREE.CylinderGeometry(jariPada(ym + hA) * 0.92, rN, hA, 24).translate(0, hA / 2, 0)), matPasir, false);
  pasirAtas.position.y = ym;
  pasirAtas.scale.y = Math.max(1e-3, isi);
  const pasirBawah = mesh(geoTetap("jpBawah" + kunci(h), () => new THREE.ConeGeometry(jariPada(y0 + 0.01) * 0.92, hB, 24).translate(0, hB / 2, 0)), matPasir, false);
  pasirBawah.position.y = y0;
  pasirBawah.scale.y = Math.max(1e-3, 1 - isi);
  const aliran = mesh(geoTetap("jpAliran" + kunci(h), () => new THREE.CylinderGeometry(rN * 0.35, rN * 0.35, ym - y0, 6).translate(0, (ym - y0) / 2, 0)), matPasir, false);
  aliran.position.y = y0;
  aliran.visible = isi > 0 && isi < 1;
  putar.add(...pelat, ...tiang, pasirAtas, pasirBawah, aliran, kaca);
  return selesai(g, {
    nama, penting, skala,
    bagian: { pelat, tiang, kaca, pasirAtas, pasirBawah, aliran, emas: [...pelat, ...tiang], denyut: saringDenyut([...pelat, ...tiang]), tepi: [] },
  });
}

// ---------------------------------------------------------------- katalog
export const DAFTAR_IKON = [
  { nama: "ikonKubus", kategori: "ikon", buat: ikonKubus, contoh: {} },
  { nama: "ikonDaun", kategori: "ikon", buat: ikonDaun, contoh: {} },
  { nama: "ikonTimbangan", kategori: "ikon", buat: ikonTimbangan, contoh: {} },
  { nama: "ikonBuku", kategori: "ikon", buat: ikonBuku, contoh: {} },
  { nama: "ikonCakram", kategori: "ikon", buat: ikonCakram, contoh: {} },
  { nama: "ikonRetak", kategori: "ikon", buat: ikonRetak, contoh: {} },
  { nama: "ikonGrafik", kategori: "ikon", buat: ikonGrafik, contoh: {} },
  { nama: "ikonDokumen", kategori: "ikon", buat: ikonDokumen, contoh: {} },
  { nama: "ikonPanah", kategori: "ikon", buat: ikonPanah, contoh: { arah: "naik" } },
  { nama: "gelombangSinyal", kategori: "ikon", buat: gelombangSinyal, contoh: {} },
  { nama: "gembok", kategori: "properti", buat: gembok, contoh: {} },
  { nama: "kompas", kategori: "properti", buat: kompas, contoh: { arahJarum: 45 * DEG } },
  { nama: "papanSasaran", kategori: "properti", buat: papanSasaran, contoh: {} },
  { nama: "anakPanah", kategori: "properti", buat: anakPanah, contoh: {} },
  { nama: "palu", kategori: "properti", buat: palu, contoh: { alas: true } },
  { nama: "pengerasSuara", kategori: "properti", buat: pengerasSuara, contoh: {} },
  { nama: "lencana", kategori: "properti", buat: lencana, contoh: { pita: true } },
  { nama: "jamPasir", kategori: "properti", buat: jamPasir, contoh: {} },
];
