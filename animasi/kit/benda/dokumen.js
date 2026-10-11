// Benda dokumen: kartu, lembar, sertifikat, SK, amplop, map, panel kertas, buku, tumpukan kertas, penanda kecil
// (tag, centang, tanda tanya), ponsel, dan balon kata. Mengikuti KONTRAK bagian 5:
//   fungsi(opsi) → THREE.Group, titik asal di tengah alas (y = 0), userData { nama, penting, bagian, setelKeadaan? }.
// Warna hanya dari tema W (atau campuran dua token W). Tiap benda punya bahannya sendiri; geometri boleh dipakai bersama.
// Teks hanya lewat label3D, dibuat bila opsi label diisi (butuh buatVideo() lebih dulu). Tidak ada emissive bawaan.
// Rincian opsi dan resep: kit/docs/benda-dokumen-ikon.md.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { W } from "../inti/tema.js";
import { DEG, ISO, titik } from "../inti/ruang.js";
import { acak } from "../inti/waktu.js";
import { bahanPadat, bahanGaris, kotakBulat, garisTepi, keadaanBawaan } from "../inti/bahan.js";
import { videoAktif } from "../inti/aktif.js";
import { label3D } from "../halaman/label.js";

// ---------------------------------------------------------------- pembantu bersama
const HADAP = 45 * DEG; // rotasi y yang membuat sisi +z lokal menghadap kamera

const _geo = new Map();
const kunci = (...a) => a.map((x) => (typeof x === "number" ? x.toFixed(4) : String(x))).join(",");
function geoTetap(k, buat) {
  let g = _geo.get(k);
  if (!g) { g = buat(); _geo.set(k, g); }
  return g;
}
// Kotak polos. ax/ay: titik asal di sumbu x/y (0 = ujung kiri/bawah, 0.5 = tengah). Batang yang tumbuh memakai ax = 0.
function geoKotak(w, h, d, ax = 0.5, ay = 0.5) {
  return geoTetap("k" + kunci(w, h, d, ax, ay), () => new THREE.BoxGeometry(w, h, d).translate((0.5 - ax) * w, (0.5 - ay) * h, 0));
}
function mesh(geo, mat, bayangan = false) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = bayangan;
  m.receiveShadow = true;
  return m;
}
// Garis isi di muka kertas: kotak tipis (tebal 0.006) tepat di depan muka.
function garisIsi(w, h, mat, ax = 0) {
  const m = mesh(geoKotak(w, h, 0.006, ax), mat);
  m.position.z = 0.004;
  return m;
}
// Ruas tebal dari titik a ke b (koordinat muka), untuk lipatan amplop dan sejenisnya.
function ruas(a, b, tebal, mat, z = 0.005) {
  const m = mesh(geoKotak(Math.hypot(b[0] - a[0], b[1] - a[1]), tebal, 0.006), mat);
  m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z);
  m.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]);
  return m;
}
// Bahan isi (garis, simbol) dengan warna abunya sendiri, supaya tetap terbaca saat benda menjadi abu.
function bahanIsi(warna, warnaAbu = W.abuGelap, opsi = {}) {
  const m = bahanPadat(warna, opsi);
  m.userData.warnaAbu = warnaAbu;
  return m;
}
const campurWarna = (a, b, k) => a.clone().lerp(b, k);
// Nama bagian berulang ("petak 3", "centang 2") untuk sumber peristiwa bunyi, yang memakai userData.nama: tanpa nama,
// laporan suara hanya berisi "benda", "benda-2", ... Tidak mengubah tampilan.
function namai(daftar, dasar) {
  daftar.forEach((o, i) => { if (o) o.userData.nama = `${dasar} ${i + 1}`; });
  return daftar;
}
// Kertas untuk permukaan lengkung (tabung, kerucut, bola): permukaan yang menghadap matahari kit mencapai luminans 0.76,
// di atas ambang bloom 0.74. Kertas diredupkan 15% supaya hanya emas yang berpendar.
const kertasLengkung = () => campurWarna(W.kertas, W.abu, 0.15);
// Bagian yang boleh menyala saat denyut: hanya bahan gelap. Emissive denyut (zamrudPijar × 0.5) di atas kertas
// melewati ambang bloom, jadi permukaan terang hanya berdenyut lewat garis tepinya.
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
// Garis tepi untuk denyut cermin (tersembunyi sampai keadaan "denyut" > 0).
function tepiDenyut(sumber) {
  const mat = bahanGaris(W.zamrudPijar, 3, 0);
  mat.userData.tepiDenyut = true;
  const l = garisTepi(sumber, { bahan: mat });
  l.visible = false;
  return l;
}
// Kelompok putar: menghadap kamera penuh (billboard) atau hanya diputar di sumbu y.
function kelompokHadap(kamera, hadap = HADAP) {
  const p = new THREE.Group();
  if (kamera) p.rotation.set(-ISO * DEG, 45 * DEG, 0, "YXZ");
  else p.rotation.y = hadap;
  return p;
}
// Keadaan untuk benda yang berisi benda lain (tag, centang, dokumen kecil): keadaan bawaan berlaku ke seluruh benda,
// lalu anak yang punya keadaan sendiri (mis. tag yang sudah diklik emas) dipulihkan ke keadaannya sendiri.
function keadaanBersarang(g, anak) {
  return (nama, nilai) => {
    keadaanBawaan(g, nama, nilai);
    for (const a of anak) {
      const k = a.userData.keadaan;
      if (k) for (const [n, v] of Object.entries(k)) keadaanBawaan(a, n, v);
    }
    return true;
  };
}
// Label. spek: teks, atau { teks, ...opsi label3D }. skala "ikut" = ikut membesar/mengecil bersama kamera (16 / H).
const ikutKamera = (f = 1) => { const v = videoAktif("label benda"); return () => (16 / v.rig.keadaan.H) * f; };
// Teks berisi "\n" dipecah menjadi beberapa baris.
const lolos = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function buatLabel(spek, jangkar, bawaan = {}) {
  if (spek == null || spek === false || spek === "") return null;
  const o = typeof spek === "object" ? spek : { teks: String(spek) };
  let { teks, ...opsi } = { ...bawaan, ...o };
  if (opsi.skala === "ikut") opsi.skala = ikutKamera(1);
  else if (typeof opsi.skala === "string" && opsi.skala.startsWith("ikut×")) opsi.skala = ikutKamera(parseFloat(opsi.skala.slice(5)));
  if (!opsi.html && String(teks).includes("\n")) { teks = String(teks).split("\n").map(lolos).join("<br>"); opsi.html = true; }
  return label3D(teks, { pada: jangkar, ...opsi });
}
// Lebar teks label mono 21–22 px dalam unit dunia pada kamera H 16 (≈ 0.105 unit per huruf, skala 1).
const LEBAR_HURUF = 0.105;
// Skala label yang dikecilkan supaya teks muat di `lebar` unit (tidak pernah diperbesar).
function skalaMuat(skala, teks, lebar) {
  const perlu = Math.max(...String(teks).split("\n").map((b) => b.length)) * LEBAR_HURUF + 0.04;
  const f = Math.min(1, lebar / perlu);
  if (skala === "ikut") return ikutKamera(f);
  if (typeof skala === "function") return (t) => skala(t) * f;
  return (typeof skala === "number" ? skala : 1) * f;
}
const terpanjang = (daftar) => daftar.reduce((a, b) => (String(b).length > String(a).length ? b : a), "");
// Pecah teks panjang menjadi dua baris di spasi yang paling dekat ke tengah bila tidak muat di `lebar` unit.
function bungkus(teks, lebar) {
  const s = String(teks);
  if (s.includes("\n") || s.length * LEBAR_HURUF + 0.04 <= lebar || !s.includes(" ")) return s;
  let terbaik = -1;
  for (let i = 0; i < s.length; i++) if (s[i] === " " && (terbaik < 0 || Math.abs(i - s.length / 2) < Math.abs(terbaik - s.length / 2))) terbaik = i;
  return s.slice(0, terbaik) + "\n" + s.slice(terbaik + 1);
}
function jangkar(induk, x, y, z) {
  const j = new THREE.Object3D();
  j.position.set(x, y, z);
  induk.add(j);
  return j;
}
// Isi umum userData. Semua benda di berkas ini lewat sini.
function selesai(g, { nama, penting, skala = 1, bagian, ...lain }) {
  g.scale.setScalar(skala);
  g.name = nama;
  g.userData = { nama, penting, bagian, ...lain };
  return g;
}

// Geometri bentuk.
function geoBingkai(w, h, t, d = 0.004) { // persegi panjang berlubang (bingkai garis), muka menghadap +z
  return geoTetap("bingkai" + kunci(w, h, t, d), () => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.closePath();
    const a = w / 2 - t, b = h / 2 - t;
    const l = new THREE.Path();
    l.moveTo(-a, -b); l.lineTo(-a, b); l.lineTo(a, b); l.lineTo(a, -b); l.closePath();
    s.holes.push(l);
    return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  });
}
function geoBintang(r, n, dalam, d) { // bintang/roset n sudut, diekstrusi setebal d
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
function geoEkorPita(w, h, d = 0.01) { // pita dengan takik V di ujung bawah; pangkal di y = 0
  return geoTetap("ekor" + kunci(w, h, d), () => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, -h); s.lineTo(0, -h + w * 0.55); s.lineTo(-w / 2, -h); s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  });
}
function geoPiringan(r, d, seg = 40) { // silinder pipih bersumbu z (muka menghadap +z), alas di z = 0
  return geoTetap("piring" + kunci(r, d, seg), () => new THREE.CylinderGeometry(r, r, d, seg).rotateX(Math.PI / 2).translate(0, 0, d / 2));
}
function bentukPanah(h, lebarKepala = 0.62, lebarBatang = 0.26, tinggiKepala = 0.46) { // panah ke +y, pangkal di y = 0
  const wk = lebarKepala * h, wb = lebarBatang * h, hk = tinggiKepala * h;
  const s = new THREE.Shape();
  s.moveTo(-wb / 2, 0); s.lineTo(wb / 2, 0); s.lineTo(wb / 2, h - hk); s.lineTo(wk / 2, h - hk);
  s.lineTo(0, h); s.lineTo(-wk / 2, h - hk); s.lineTo(-wb / 2, h - hk); s.closePath();
  return s;
}
// Garis putus-putus sebagai satu mesh (kotak kecil di sepanjang jalur), supaya ikut keadaan dan tebalnya ikut skala dunia.
function geoPutus(titik2, { tebal = 0.035, dash = 0.09, celah = 0.06, dalam = 0.012, tutup = true } = {}) {
  const p = tutup ? [...titik2, titik2[0]] : titik2;
  const kum = [0];
  for (let i = 1; i < p.length; i++) kum.push(kum[i - 1] + p[i].distanceTo(p[i - 1]));
  const total = kum[kum.length - 1];
  const pada = (s) => {
    let i = 1;
    while (i < p.length - 1 && kum[i] < s) i++;
    const u = (s - kum[i - 1]) / Math.max(1e-9, kum[i] - kum[i - 1]);
    return p[i - 1].clone().lerp(p[i], Math.min(1, Math.max(0, u)));
  };
  const n = Math.max(1, Math.round(total / (dash + celah)));
  const langkah = total / n, panjang = (langkah * dash) / (dash + celah);
  const potong = [];
  for (let k = 0; k < n; k++) {
    const a = pada(k * langkah), b = pada(k * langkah + panjang);
    const L = a.distanceTo(b);
    if (L < 1e-4) continue;
    potong.push(new THREE.BoxGeometry(L, tebal, dalam).rotateZ(Math.atan2(b.y - a.y, b.x - a.x)).translate((a.x + b.x) / 2, (a.y + b.y) / 2, 0));
  }
  const hasil = mergeGeometries(potong);
  potong.forEach((x) => x.dispose());
  return hasil;
}

// ---------------------------------------------------------------- lembar dasar
// Badan tipis + kelompok `muka` (x kanan, y atas, z keluar dari muka depan; titik asal di tengah muka).
// rebah: berbaring muka ke atas, titik asal di tengah alas. Selain itu berdiri dengan tepi bawah di titik asal,
// condong `miring` radian ke belakang. hadap: rotasi y (bawaan 45° = muka menghadap kamera, garis teks mendatar di layar).
function bangunLembar({ lebar, tinggi, tebal, warna, rebah, miring = 0, hadap = HADAP, radius = 0.012 }) {
  const g = new THREE.Group();
  const putar = new THREE.Group();
  putar.rotation.y = hadap;
  g.add(putar);
  const lembar = new THREE.Group();
  if (rebah) {
    lembar.rotation.x = -Math.PI / 2;
    lembar.position.y = tebal / 2;
    putar.add(lembar);
  } else {
    const condong = new THREE.Group();
    condong.rotation.x = -miring;
    putar.add(condong);
    lembar.position.y = tinggi / 2;
    condong.add(lembar);
  }
  const mat = bahanPadat(warna);
  const badan = kotakBulat(lebar, tinggi, tebal, mat, { radius });
  const muka = new THREE.Group();
  muka.position.z = tebal / 2;
  lembar.add(badan, muka);
  return { g, putar, lembar, badan, muka, mat };
}
// Jangkar label di atas lembar: rebah → di luar tepi jauhnya (atas layar), berdiri → di atas tepi atasnya.
function jangkarAtas(L, { rebah, tebal, tinggi }, jarak = 0.12) {
  return rebah ? jangkar(L.putar, 0, tebal + 0.03, -tinggi / 2 - jarak * 0.5) : jangkar(L.lembar, 0, tinggi / 2 + jarak, 0);
}
// Blok garis teks rata kiri. Panjang tiap garis acak berbenih antara min..maks × lebar; garis terakhir lebih pendek.
function blokGaris(muka, mat, { x0, yAtas, lebar, n, h, jarak, r, min = 0.6, maks = 0.95, akhirPendek = true }) {
  const daftar = [];
  for (let i = 0; i < n; i++) {
    const k = akhirPendek && n > 2 && i === n - 1 ? min * 0.75 : min + (maks - min) * r();
    const m = garisIsi(lebar * k, h, mat, 0);
    m.position.set(x0, yAtas - i * jarak, 0.004);
    muka.add(m);
    daftar.push(m);
  }
  return daftar;
}

// ---------------------------------------------------------------- kartuKecil
// Kartu tipis 0.6 × 0.02 × 0.8 warna kertas (kertas survei, kertas tugas, kertas tanya, usulan).
// simbol: null | "garis" (tiga baris teks) | "grafik" (tiga batang kecil) | "centang". label: teks HTML di atas kartu.
export function kartuKecil(opsi = {}) {
  const {
    lebar = 0.6, panjang = 0.8, tebal = 0.02, warna = W.kertas, warnaSimbol = W.zamrudRedup, simbol = null,
    rebah = true, miring = 12 * DEG, hadap = HADAP, label = null, nama = "kartu kecil", penting = true, skala = 1,
  } = opsi;
  const L = bangunLembar({ lebar, tinggi: panjang, tebal, warna, rebah, miring, hadap, radius: 0.009 });
  const s = Math.min(lebar, panjang);
  const matSimbol = bahanIsi(warnaSimbol);
  const daftar = [];
  if (simbol === "garis") {
    daftar.push(...blokGaris(L.muka, matSimbol, { x0: -lebar * 0.32, yAtas: s * 0.24, lebar: lebar * 0.64, n: 3, h: s * 0.075, jarak: s * 0.22, r: acak(3), min: 0.7, maks: 1 }));
  } else if (simbol === "grafik") {
    [0.28, 0.46, 0.66].forEach((t, i) => {
      const m = mesh(geoKotak(s * 0.14, s * t, 0.006, 0.5, 0), matSimbol);
      m.position.set((i - 1) * s * 0.22, -s * 0.32, 0.004);
      L.muka.add(m);
      daftar.push(m);
    });
    const alas = garisIsi(s * 0.72, s * 0.035, matSimbol, 0.5);
    alas.position.y = -s * 0.34;
    L.muka.add(alas);
    daftar.push(alas);
  } else if (simbol === "centang") {
    const c = centang({ ukuran: s * 0.6, tebal: s * 0.11, dalam: 0.01, warna: warnaSimbol, hadapKamera: false, hadap: 0, tengah: true, penting: false });
    c.position.z = 0.006;
    L.muka.add(c);
    daftar.push(c);
  }
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  const lbl = buatLabel(label, jangkarAtas(L, { rebah, tebal, tinggi: panjang }), { gaya: "benda" });
  return selesai(L.g, {
    nama, penting, skala, label: lbl,
    bagian: { badan: L.badan, muka: L.muka, simbol: namai(daftar, "simbol"), emas: [L.badan], denyut: saringDenyut([L.badan, ...daftar]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- lembarKertas
// Lembar umum (halaman tugas, ringkasan, pernyataan, tata tertib, catatan cara). Bawaan 0.8 × 0.02 × 1.0, berbaring.
// judul: batang judul zamrudRedup di atas; garis: jumlah baris teks. berdiri: rebah false (tepi bawah di titik asal).
export function lembarKertas(opsi = {}) {
  const {
    lebar = 0.8, panjang = 1.0, tebal = 0.02, garis = 5, judul = true, rebah = true, miring = 12 * DEG, hadap = HADAP,
    warna = W.kertas, warnaGaris = W.abu, warnaJudul = W.zamrudRedup, benih = 1, label = null,
    nama = "lembar kertas", penting = true, skala = 1,
  } = opsi;
  const L = bangunLembar({ lebar, tinggi: panjang, tebal, warna, rebah, miring, hadap, radius: 0.01 });
  const s = Math.min(lebar, panjang);
  const mx = lebar * 0.13, x0 = -lebar / 2 + mx, lb = lebar - 2 * mx;
  let y = panjang / 2 - Math.max(panjang * 0.13, mx);
  let mJudul = null;
  if (judul) {
    mJudul = garisIsi(lb * 0.62, s * 0.075, bahanIsi(warnaJudul), 0);
    mJudul.position.set(x0, y, 0.004);
    L.muka.add(mJudul);
    y -= s * 0.17;
  }
  const yb = -panjang / 2 + Math.max(panjang * 0.12, mx);
  const jarak = garis > 1 ? Math.min(s * 0.13, (y - yb) / (garis - 1)) : 0;
  const daftar = blokGaris(L.muka, bahanIsi(warnaGaris), { x0, yAtas: y, lebar: lb, n: garis, h: Math.min(s * 0.045, jarak * 0.45 || s * 0.045), jarak, r: acak(benih) });
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  const lbl = buatLabel(label, jangkarAtas(L, { rebah, tebal, tinggi: panjang }), { gaya: "benda" });
  return selesai(L.g, {
    nama, penting, skala, label: lbl,
    bagian: { badan: L.badan, muka: L.muka, judul: mJudul, garis: namai(daftar, "garis"), emas: [L.badan], denyut: saringDenyut([L.badan, mJudul, ...daftar]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- sertifikat
// Lembar mendatar 1.7 × 1.2 dengan bingkai ganda, batang judul, dan segel roset berpita di kanan bawah. Bawaan berdiri.
// Emas: kertas (bingkai dan segel tetap zamrud). bagian.segel bisa dimunculkan sendiri.
export function sertifikat(opsi = {}) {
  const {
    lebar = 1.7, tinggi = 1.2, tebal = 0.03, rebah = false, miring = 12 * DEG, hadap = HADAP, warna = W.kertas,
    warnaHias = W.zamrud, segel = true, label = null, nama = "sertifikat", penting = true, skala = 1,
  } = opsi;
  const L = bangunLembar({ lebar, tinggi, tebal, warna, rebah, miring, hadap, radius: 0.015 });
  const s = Math.min(lebar, tinggi);
  const matBingkai = bahanIsi(warnaHias);
  const b1 = mesh(geoBingkai(lebar - s * 0.07, tinggi - s * 0.07, s * 0.035), matBingkai);
  const b2 = mesh(geoBingkai(lebar - s * 0.16, tinggi - s * 0.16, s * 0.012), matBingkai);
  b1.position.z = b2.position.z = 0.001;
  L.muka.add(b1, b2);
  const matTeks = bahanIsi(W.zamrudRedup), matGaris = bahanIsi(W.abu);
  const teks = [
    [lebar * 0.44, s * 0.085, 0, tinggi * 0.25, matTeks],
    [lebar * 0.24, s * 0.035, 0, tinggi * 0.13, matGaris],
    [lebar * 0.5, s * 0.05, 0, tinggi * 0.0, matTeks],
    [lebar * 0.36, s * 0.03, 0, -tinggi * 0.09, matGaris],
    [lebar * 0.2, s * 0.018, -lebar * 0.24, -tinggi * 0.3, matGaris],
  ].map(([w, h, x, y, m]) => { const g = garisIsi(w, h, m, 0.5); g.position.set(x, y, 0.004); L.muka.add(g); return g; });
  let grupSegel = null;
  if (segel) {
    grupSegel = new THREE.Group();
    const r = s * 0.17;
    const matPita = bahanIsi(W.zamrudRedup), matRoset = bahanIsi(warnaHias), matInti = bahanIsi(W.zamrudRedup);
    for (const a of [-1, 1]) {
      const e = mesh(geoEkorPita(r * 0.55, r * 1.5, 0.01), matPita, true);
      e.rotation.z = a * 0.32;
      e.position.set(a * r * 0.2, -r * 0.2, 0.002);
      grupSegel.add(e);
    }
    const roset = mesh(geoBintang(r, 16, 0.82, 0.02), matRoset, true);
    roset.position.z = 0.012;
    const inti = mesh(geoPiringan(r * 0.58, 0.012), matInti);
    inti.position.z = 0.032;
    grupSegel.add(roset, inti);
    grupSegel.position.set(lebar * 0.3, -tinggi * 0.22, 0.002);
    L.muka.add(grupSegel);
  }
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  const lbl = buatLabel(label, jangkarAtas(L, { rebah, tebal, tinggi }), { gaya: "benda" });
  return selesai(L.g, {
    nama, penting, skala, label: lbl,
    bagian: {
      badan: L.badan, muka: L.muka, bingkai: [b1, b2], teks: namai(teks, "teks"), segel: grupSegel,
      emas: [L.badan], denyut: saringDenyut([b1, b2, ...(grupSegel ? [grupSegel] : [])]), tepi: [tepi],
    },
  });
}

// ---------------------------------------------------------------- suratKeputusan
// SK tegak 1.16 × 1.6: dua batang judul, garis pemisah, baris teks, batang "memutuskan", garis tanda tangan,
// dan cap stempel (dua cincin dan bintang) zamrud di kanan bawah. cap: false = belum dicap.
// bagian.cap bisa dimunculkan dengan muncul() saat dicap (catat peristiwa "cap" sendiri). Emas: kertas.
export function suratKeputusan(opsi = {}) {
  const {
    lebar = 1.16, tinggi = 1.6, tebal = 0.03, rebah = false, miring = 12 * DEG, hadap = HADAP, warna = W.kertas,
    warnaCap = W.zamrud, cap = true, benih = 11, label = null, nama = "surat keputusan", penting = true, skala = 1,
  } = opsi;
  const L = bangunLembar({ lebar, tinggi, tebal, warna, rebah, miring, hadap, radius: 0.015 });
  const matTeks = bahanIsi(W.zamrudRedup), matGaris = bahanIsi(W.abu);
  const isi = [];
  const pusat = (w, h, y, m) => { const g = garisIsi(w, h, m, 0.5); g.position.set(0, y, 0.004); L.muka.add(g); isi.push(g); return g; };
  pusat(lebar * 0.34, tinggi * 0.034, tinggi * 0.4, matTeks);
  pusat(lebar * 0.6, tinggi * 0.034, tinggi * 0.335, matTeks);
  pusat(lebar * 0.84, tinggi * 0.006, tinggi * 0.285, matTeks);
  pusat(lebar * 0.4, tinggi * 0.016, tinggi * 0.245, matGaris);
  const r = acak(benih);
  const x0 = -lebar * 0.42, lb = lebar * 0.84;
  isi.push(...blokGaris(L.muka, matGaris, { x0, yAtas: tinggi * 0.17, lebar: lb, n: 4, h: tinggi * 0.016, jarak: tinggi * 0.05, r, min: 0.65 }));
  pusat(lebar * 0.36, tinggi * 0.026, -tinggi * 0.055, matTeks);
  isi.push(...blokGaris(L.muka, matGaris, { x0, yAtas: -tinggi * 0.13, lebar: lb, n: 4, h: tinggi * 0.016, jarak: tinggi * 0.05, r, min: 0.65 }));
  const ttd = garisIsi(lebar * 0.3, tinggi * 0.008, matTeks, 0.5);
  ttd.position.set(lebar * 0.2, -tinggi * 0.4, 0.004);
  L.muka.add(ttd);
  isi.push(ttd);
  let grupCap = null;
  if (cap) {
    grupCap = new THREE.Group();
    const rc = lebar * 0.15, matCap = bahanIsi(warnaCap, W.abuGelap);
    const luar = mesh(geoTetap("cincin" + kunci(rc), () => new THREE.RingGeometry(rc * 0.84, rc, 48)), matCap);
    const dalam = mesh(geoTetap("cincin" + kunci(rc * 0.7), () => new THREE.RingGeometry(rc * 0.62, rc * 0.7, 48)), matCap);
    const bintang = mesh(geoBintang(rc * 0.36, 5, 0.45, 0.002), matCap);
    grupCap.add(luar, dalam, bintang);
    grupCap.position.set(lebar * 0.2, -tinggi * 0.36, 0.009);
    grupCap.rotation.z = -0.22;
    L.muka.add(grupCap);
  }
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  const lbl = buatLabel(label, jangkarAtas(L, { rebah, tebal, tinggi }), { gaya: "benda" });
  return selesai(L.g, {
    nama, penting, skala, label: lbl,
    bagian: { badan: L.badan, muka: L.muka, isi: namai(isi, "isi"), cap: grupCap, emas: [L.badan], denyut: saringDenyut([...isi, ...(grupCap ? [grupCap] : [])]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- amplop
// Amplop 1.5 × 0.94 (skala 0.5 untuk amplop kecil): badan kertas, tutup segitiga yang bisa dibuka, garis lipatan.
// Bawaan berdiri menghadap kamera. bagian.tutup berporos di tepi atas: tutup.rotation.x = -π·k membuka ke arah kamera.
export function amplop(opsi = {}) {
  const {
    lebar = 1.5, tinggi = 0.94, tebal = 0.05, rebah = false, miring = 12 * DEG, hadap = HADAP, warna = W.kertas,
    warnaGaris = W.abu, prangko = false, label = null, nama = "amplop", penting = true, skala = 1,
  } = opsi;
  const L = bangunLembar({ lebar, tinggi, tebal, warna, rebah, miring, hadap, radius: 0.02 });
  const matGaris = bahanIsi(warnaGaris);
  const t = Math.min(lebar, tinggi) * 0.022;
  const lipat = [
    ruas([-lebar / 2 + 0.02, -tinggi / 2 + 0.02], [-lebar * 0.07, -tinggi * 0.06], t, matGaris),
    ruas([lebar / 2 - 0.02, -tinggi / 2 + 0.02], [lebar * 0.07, -tinggi * 0.06], t, matGaris),
  ];
  L.muka.add(...lipat);
  // Tutup: segitiga dari tepi atas ke 56% tinggi, berporos di tepi atas.
  const tutup = new THREE.Group();
  tutup.position.set(0, tinggi / 2 - 0.004, 0.002);
  const ujung = -tinggi * 0.58;
  const geoTutup = geoTetap("tutup" + kunci(lebar, tinggi), () => {
    const s = new THREE.Shape();
    s.moveTo(-lebar / 2 + 0.012, 0); s.lineTo(lebar / 2 - 0.012, 0); s.lineTo(0, ujung); s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
  });
  const matTutup = bahanPadat(warna);
  const mTutup = mesh(geoTutup, matTutup, true);
  const tepiTutup = [
    ruas([-lebar / 2 + 0.03, -0.01], [0, ujung + 0.01], t, matGaris, 0.016),
    ruas([lebar / 2 - 0.03, -0.01], [0, ujung + 0.01], t, matGaris, 0.016),
  ];
  tutup.add(mTutup, ...tepiTutup);
  L.muka.add(tutup);
  let mPrangko = null;
  if (prangko) {
    mPrangko = garisIsi(lebar * 0.12, lebar * 0.14, bahanIsi(W.zamrud), 0.5);
    mPrangko.position.set(lebar * 0.36, tinggi * 0.22, 0.02);
    L.muka.add(mPrangko);
  }
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  const lbl = buatLabel(label, jangkarAtas(L, { rebah, tebal, tinggi }), { gaya: "benda" });
  return selesai(L.g, {
    nama, penting, skala, label: lbl,
    bagian: { badan: L.badan, muka: L.muka, tutup, lipat: [...lipat, ...tepiTutup], prangko: mPrangko, emas: [L.badan, mTutup], denyut: saringDenyut([L.badan, mTutup, ...lipat, ...tepiTutup]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- map (folder)
// Map tipis 0.8 × 0.06 × 1.0: sampul belakang bertab, beberapa lembar yang mengintip di tepi atas, sampul depan
// dengan pita label. Bawaan berbaring. bagian.sampulDepan berporos di tepi kiri: rotation.y = -π·k membuka ke kamera.
export function map(opsi = {}) {
  const {
    lebar = 0.8, panjang = 1.0, tebal = 0.06, rebah = true, miring = 12 * DEG, hadap = HADAP,
    warna = campurWarna(W.kertas, W.abu, 0.22), warnaTab = W.zamrudRedup, lembar: nLembar = 3,
    label = null, nama = "map", penting = true, skala = 1,
  } = opsi;
  const tS = Math.min(0.016, tebal * 0.3);
  const L = bangunLembar({ lebar, tinggi: panjang, tebal: tS, warna, rebah, miring, hadap, radius: 0.007 });
  const matTab = bahanIsi(warnaTab);
  const tab = kotakBulat(lebar * 0.34, panjang * 0.08, tS, matTab, { radius: 0.006 });
  tab.position.set(-lebar * 0.22, panjang / 2 + panjang * 0.035, 0);
  L.lembar.add(tab);
  const matHalaman = bahanPadat(W.kertas);
  const halaman = [];
  const ruangIsi = Math.max(0.004, tebal - 2 * tS);
  for (let i = 0; i < nLembar; i++) {
    const h = kotakBulat(lebar - 0.06, panjang - 0.04, Math.min(0.006, ruangIsi / nLembar), matHalaman, { radius: 0.002 });
    h.position.set((i - 1) * 0.008, 0.02 - i * 0.006, tS / 2 + (i + 0.5) * (ruangIsi / nLembar));
    L.lembar.add(h);
    halaman.push(h);
  }
  // Sampul depan: sedikit lebih pendek supaya tepi atas lembar dan tab terlihat.
  const sampulDepan = new THREE.Group();
  sampulDepan.position.set(-lebar / 2, 0, tS / 2 + ruangIsi + tS / 2);
  const depan = kotakBulat(lebar, panjang - 0.07, tS, bahanPadat(warna), { radius: 0.007 });
  depan.position.set(lebar / 2, -0.035, 0);
  const pita = garisIsi(lebar * 0.46, panjang * 0.11, bahanIsi(warnaTab), 0.5); // bahan sendiri: pita tetap gelap saat map emas
  pita.position.set(lebar / 2, panjang * 0.18, tS / 2 + 0.003);
  sampulDepan.add(depan, pita);
  L.lembar.add(sampulDepan);
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  const lbl = buatLabel(label, jangkarAtas(L, { rebah, tebal, tinggi: panjang }), { gaya: "benda" });
  return selesai(L.g, {
    nama, penting, skala, label: lbl,
    bagian: { sampulBelakang: L.badan, sampulDepan, depan, tab, pita, halaman: namai(halaman, "halaman"), emas: [L.badan, depan, tab], denyut: saringDenyut([L.badan, depan, tab, pita]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- buku
// Warna sampul acak berbenih dari campuran token tema (untuk rak buku). Sama benih = sama warna.
export function warnaBuku(benih = 1) {
  const r = acak(benih * 7919 + 13);
  const pasangan = [[W.pelat, W.zamrudRedup], [W.zamrudRedup, W.zamrud], [W.abuGelap, W.zamrudRedup], [W.abuGelap, W.abu], [W.zamrudRedup, W.kertas]];
  const [a, b] = pasangan[Math.floor(r() * pasangan.length)];
  return campurWarna(a, b, 0.2 + 0.6 * r());
}
// Buku tertutup (berbaring: punggung di sisi +z, kepala halaman di +x; berdiri: punggung menghadap +z seperti di rak)
// atau terbuka (dua halaman membentang ke ±x, punggung sepanjang z). Ukuran: tinggi (panjang halaman), lebar (sampul),
// tebal. warna sampul, atau benih untuk warnaBuku(benih). Emas: sampul (tertutup) atau halaman (terbuka).
export function buku(opsi = {}) {
  const {
    tinggi = 0.8, lebar = 0.6, tebal = 0.16, terbuka = false, berdiri = false, warna = null, benih = null,
    hadap = terbuka ? HADAP : 0, warnaHalaman = W.kertas, garis = true, nama = "buku", penting = true, skala = 1,
  } = opsi;
  const warnaSampul = warna ?? (benih != null ? warnaBuku(benih) : W.zamrud);
  const g = new THREE.Group();
  const putar = new THREE.Group();
  putar.rotation.y = hadap;
  g.add(putar);
  const matSampul = bahanPadat(warnaSampul);
  const matHalaman = bahanPadat(warnaHalaman);
  matHalaman.userData.warnaAbu = campurWarna(W.abu, W.kertas, 0.3);
  const matGaris = bahanIsi(W.abu);
  const tS = Math.max(0.012, Math.min(0.03, tebal * 0.16));
  if (!terbuka) {
    const isi = new THREE.Group();
    putar.add(isi);
    const bawah = kotakBulat(tinggi, tS, lebar, matSampul, { radius: tS * 0.45, alas: true });
    const atas = kotakBulat(tinggi, tS, lebar, matSampul, { radius: tS * 0.45, alas: true });
    atas.position.y = tebal - tS;
    const lebarIsi = lebar - 0.02 - tS;
    const halaman = kotakBulat(tinggi - 0.03, tebal - 2 * tS + 0.004, lebarIsi, matHalaman, { radius: 0.004, alas: true });
    halaman.position.set(0, tS - 0.002, -lebar / 2 + 0.02 + lebarIsi / 2 - 0.01);
    const punggung = kotakBulat(tinggi, tebal, tS * 1.4, matSampul, { radius: tS * 0.5, alas: true });
    punggung.position.z = lebar / 2 - tS * 0.7;
    const matPita = bahanIsi(campurWarna(warnaSampul, W.kertas, 0.55), W.abu);
    const pita = [-1, 1].map((s) => {
      const m = mesh(geoKotak(Math.max(0.02, tinggi * 0.035), tebal * 0.8, 0.006), matPita);
      m.position.set(s * tinggi * 0.34, tebal / 2, lebar / 2 + 0.003);
      return m;
    });
    isi.add(bawah, atas, halaman, punggung, ...pita);
    if (berdiri) {
      isi.rotation.z = Math.PI / 2;
      isi.position.set(tebal / 2, tinggi / 2, 0);
    }
    const tepi = tepiDenyut({ w: tinggi, h: tebal, d: lebar, alas: true });
    isi.add(tepi);
    return selesai(g, {
      nama, penting, skala, warna: warnaSampul,
      bagian: { isi, sampul: [bawah, atas, punggung], halaman, pita, emas: [bawah, atas, punggung], denyut: saringDenyut([bawah, atas, punggung]), tepi: [tepi] },
    });
  }
  // Terbuka: sampul rata di tanah, blok halaman sedikit naik ke arah punggung, garis teks di tiap halaman.
  const tH = Math.max(0.03, tebal * 0.3);
  const blok = [], daftarGaris = [], sampul = [];
  const r = acak(5);
  for (const s of [-1, 1]) {
    const sm = kotakBulat(lebar + 0.02, tS, tinggi + 0.05, matSampul, { radius: tS * 0.45, alas: true });
    sm.position.x = s * (lebar / 2 + 0.01);
    putar.add(sm);
    sampul.push(sm);
    const poros = new THREE.Group();
    poros.position.set(s * lebar, tS, 0);
    poros.rotation.z = -s * 3.5 * DEG;
    putar.add(poros);
    const b = kotakBulat(lebar - 0.03, tH, tinggi - 0.02, matHalaman, { radius: 0.006, alas: true });
    b.position.x = -s * (lebar / 2 - 0.005);
    poros.add(b);
    blok.push(b);
    if (garis) {
      for (let i = 0; i < 6; i++) {
        const p = (0.55 + 0.35 * r()) * (lebar - 0.16);
        const m = mesh(geoKotak(p, 0.004, Math.max(0.018, tinggi * 0.03), 0), matGaris);
        // Rata kiri halaman: halaman kanan mulai dari sisi punggung, halaman kiri dari tepi luarnya (poros).
        m.position.set(s > 0 ? -lebar + 0.08 : 0.08, tH + 0.002, -tinggi * 0.36 + i * tinggi * 0.13);
        poros.add(m);
        daftarGaris.push(m);
      }
    }
  }
  const lipatan = mesh(geoKotak(0.016, 0.006, tinggi - 0.04), matGaris);
  lipatan.position.y = tS + tH + lebar * Math.sin(3.5 * DEG) + 0.002;
  putar.add(lipatan);
  return selesai(g, {
    nama, penting, skala, warna: warnaSampul,
    bagian: { halaman: namai(blok, "halaman"), sampul, garis: namai(daftarGaris, "garis"), emas: blok, denyut: saringDenyut([...sampul, ...daftarGaris]), tepi: [] },
  });
}

// ---------------------------------------------------------------- tumpukanKertas
// Kotak-kotak kecil kertas di atas meja: berantakan (rapi false) atau tersusun dalam beberapa tumpukan.
// userData.tataRapi[i] dan tataAcak[i] = { posisi (lokal), putar (rotasi y) } untuk menggerakkan kertas dari satu tata
// ke tata lain, mis. busur(kertas[i], { t, ke: tataRapi[i].posisi, putar: tataRapi[i].putar - tataAcak[i].putar }).
export function tumpukanKertas(opsi = {}) {
  const {
    jumlah = 12, rapi = false, tumpukan = 3, ukuran = [0.34, 0.05, 0.44], sebar = 0.6, benih = 7,
    warna = W.kertas, nama = "tumpukan kertas", penting = true, skala = 1,
  } = opsi;
  const [w, h, d] = ukuran;
  const r = acak(benih);
  const g = new THREE.Group();
  const nPer = Math.ceil(jumlah / Math.max(1, tumpukan));
  const tataRapi = [], tataAcak = [], kertas = [];
  for (let i = 0; i < jumlah; i++) {
    const s = Math.floor(i / nPer), k = i % nPer;
    const pr = titik((s - (Math.min(tumpukan, Math.ceil(jumlah / nPer)) - 1) / 2) * (w + 0.14) + (r() - 0.5) * 0.02, (r() - 0.5) * 0.02, k * (h + 0.003));
    tataRapi.push({ posisi: pr, putar: HADAP + (r() - 0.5) * 0.08 });
  }
  const jejak = [];
  for (let i = 0; i < jumlah; i++) {
    const p = titik((r() - 0.5) * 2.4 * sebar, (r() - 0.5) * 1.6 * sebar);
    const lapis = jejak.filter((q) => q.distanceTo(p) < Math.max(w, d) * 0.8).length;
    jejak.push(p.clone());
    p.y = lapis * (h + 0.003);
    tataAcak.push({ posisi: p, putar: r() * Math.PI });
  }
  for (let i = 0; i < jumlah; i++) {
    const m = kotakBulat(w, h, d, bahanPadat(warna), { radius: Math.min(0.012, h * 0.3), alas: true });
    const tata = rapi ? tataRapi[i] : tataAcak[i];
    m.position.copy(tata.posisi);
    m.rotation.y = tata.putar;
    m.userData.nama = `kertas ${i + 1}`;
    g.add(m);
    kertas.push(m);
  }
  const tepi = kertas.map((m) => { const l = tepiDenyut(m); m.add(l); return l; });
  return selesai(g, { nama, penting, skala, tataRapi, tataAcak, bagian: { kertas, emas: kertas, denyut: saringDenyut(kertas), tepi } });
}

// ---------------------------------------------------------------- tag
// Tempelan kecil 0.18 × 0.02 × 0.12: kertas dengan pita zamrud di ujung kiri, label HTML mikro (TGL, PJ, Rp) di atasnya.
// Bila label diisi tanpa lebar, lebar bawaan memanjang sesuai label (0.1 + 0.09 per huruf) supaya teksnya muat di kertas.
// Bawaan berbaring; berdiri (rebah false) untuk menempel di kartu tegak. Emas: seluruh tag (kertas dan pita).
export function tag(opsi = {}) {
  const label = opsi.label ?? null;
  const nHuruf = label == null ? 0 : String(typeof label === "object" ? label.teks : label).length;
  const {
    lebar = nHuruf ? Math.max(0.18, 0.1 + 0.09 * nHuruf) : 0.18, tinggi = nHuruf ? 0.15 : 0.12, tebal = 0.02,
    warna = W.kertas, warnaPita = W.zamrud, rebah = true, miring = 0, hadap = HADAP, skalaLabel = "ikut×0.8",
    nama = "tag", penting = false, skala = 1,
  } = opsi;
  const L = bangunLembar({ lebar, tinggi, tebal, warna, rebah, miring, hadap, radius: Math.min(0.012, tinggi * 0.12) });
  const fp = Math.min(0.2, 0.05 / lebar); // pita selebar ±0.05 unit, paling banyak 20% tag
  const pita = mesh(geoKotak(lebar * fp, tinggi, 0.006, 0), bahanPadat(warnaPita));
  pita.position.set(-lebar / 2, 0, 0.002);
  L.muka.add(pita);
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  const lbl = buatLabel(label, jangkar(L.muka, (lebar * fp) / 2, 0, 0.01), { gaya: "baris", ax: 0.5, ay: 0.5, skala: skalaLabel });
  return selesai(L.g, {
    nama, penting, skala, label: lbl,
    bagian: { badan: L.badan, pita, emas: [L.badan, pita], denyut: saringDenyut([pita]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- centang
// Tanda centang tebal zamrud dari dua kaki berujung bulat. ukuran = lebar total. Bawaan menghadap kamera;
// hadapKamera false = di bidang xy lokal (untuk ditempel di panel). tengah: titik asal di tengah, bukan di ujung bawah.
export function centang(opsi = {}) {
  const {
    ukuran = 0.4, tebal = null, dalam = 0.05, warna = W.zamrud, hadapKamera = true, hadap = HADAP, tengah = false,
    nama = "centang", penting = true, skala = 1,
  } = opsi;
  const s = ukuran, t = tebal ?? s * 0.17;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const mat = bahanPadat(warna);
  const A = [-0.46 * s, 0.06 * s], B = [-0.12 * s, -0.27 * s], C = [0.46 * s, 0.4 * s];
  const geser = tengah ? [0.0, -((B[1] - t / 2) + (C[1] + t / 2)) / 2] : [0, -(B[1] - t / 2)];
  const kaki = [[A, B], [B, C]].map(([a, b]) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) + t;
    const m = kotakBulat(L, t, dalam, mat, { radius: Math.min(t, dalam) * 0.48 });
    m.position.set((a[0] + b[0]) / 2 + geser[0], (a[1] + b[1]) / 2 + geser[1], 0);
    m.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]);
    putar.add(m);
    return m;
  });
  return selesai(g, { nama, penting, skala, bagian: { kaki, emas: kaki, denyut: kaki, tepi: [] } });
}

// ---------------------------------------------------------------- tandaTanya
// Tanda tanya dari tabung melengkung dan titik bola (bukan teks 3D). ukuran = tinggi total. Bawaan menghadap kamera.
export function tandaTanya(opsi = {}) {
  const {
    ukuran = 0.5, tebal = null, warna = kertasLengkung(), hadapKamera = true, hadap = HADAP, tengah = false,
    nama = "tanda tanya", penting = true, skala = 1,
  } = opsi;
  const s = ukuran, r = tebal ?? s * 0.075;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const isi = new THREE.Group();
  isi.position.y = tengah ? -s * 0.5 : 0;
  putar.add(isi);
  const mat = bahanPadat(warna);
  const geoKait = geoTetap("tanya" + kunci(s, r), () => {
    const p = [[-0.21, 0.66], [-0.14, 0.82], [0.02, 0.89], [0.18, 0.82], [0.21, 0.66], [0.11, 0.53], [0.02, 0.46], [0, 0.39], [0, 0.35]];
    const kurva = new THREE.CatmullRomCurve3(p.map(([x, y]) => new THREE.Vector3(x * s, y * s, 0)), false, "centripetal");
    const tabung = new THREE.TubeGeometry(kurva, 48, r, 12, false);
    const ujungA = new THREE.SphereGeometry(r, 12, 8).translate(p[0][0] * s, p[0][1] * s, 0);
    const ujungB = new THREE.SphereGeometry(r, 12, 8).translate(0, p[p.length - 1][1] * s, 0);
    const titikBawah = new THREE.SphereGeometry(r * 1.4, 16, 12).translate(0, r * 1.4, 0);
    const satu = [tabung, ujungA, ujungB, titikBawah].map((x) => x.toNonIndexed());
    satu.forEach((x) => x.deleteAttribute("uv"));
    return mergeGeometries(satu);
  });
  const m = mesh(geoKait, mat, true);
  isi.add(m);
  return selesai(g, { nama, penting, skala, bagian: { badan: m, emas: [m], denyut: saringDenyut([m]), tepi: [] } });
}

// ---------------------------------------------------------------- ponselKecil
// Ponsel 0.35 × 0.06 × 0.6 (badan abuGelap, layar kertas redup). Bawaan berdiri condong 15° menghadap kamera,
// tepi bawah di titik asal; rebah: true = tergeletak. dokumen: jumlah kartu kecil yang melayang di atas ponsel
// (bagian.dokumen, masing-masing benda kartuKecil sendiri yang bisa diklik emas atau diterbangkan).
export function ponselKecil(opsi = {}) {
  const {
    lebar = 0.35, tinggi = 0.6, tebal = 0.06, rebah = false, miring = 15 * DEG, hadap = HADAP, warna = W.abuGelap,
    warnaLayar = W.kertas, dokumen = 0, nama = "ponsel", penting = true, skala = 1,
  } = opsi;
  const L = bangunLembar({ lebar, tinggi, tebal, warna, rebah, miring, hadap, radius: Math.min(0.045, tebal * 0.45) });
  const layar = mesh(geoKotak(lebar - 0.06, tinggi - 0.15, 0.006), bahanIsi(campurWarna(warnaLayar, warna, 0.35), W.abu));
  layar.position.set(0, 0.005, 0.004);
  const celah = garisIsi(lebar * 0.24, 0.018, bahanIsi(W.pelat, W.pelat), 0.5);
  celah.position.y = tinggi / 2 - 0.035;
  L.muka.add(layar, celah);
  const daftar = [];
  const atas = rebah ? tebal + 0.25 : tinggi * Math.cos(miring) + 0.14;
  for (let j = 0; j < dokumen; j++) {
    const d = kartuKecil({ rebah: false, hadap: 0, simbol: "garis", skala: 0.34, penting: false, nama: `dokumen ${j + 1}` });
    d.position.set((j - (dokumen - 1) / 2) * 0.24, atas + (j % 2) * 0.07, 0.02 * j);
    d.rotation.z = (j - (dokumen - 1) / 2) * -0.12;
    L.putar.add(d);
    daftar.push(d);
  }
  const tepi = tepiDenyut(L.badan);
  L.badan.add(tepi);
  return selesai(L.g, {
    nama, penting, skala, setelKeadaan: daftar.length ? keadaanBersarang(L.g, daftar) : undefined,
    bagian: { badan: L.badan, layar, dokumen: daftar, emas: [L.badan, layar], denyut: saringDenyut([L.badan]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- balonKata
function bentukBalon(w, h, r, ekor, f) {
  const s = new THREE.Shape();
  const x0 = -w / 2, y0 = -h / 2;
  const P = (x, y) => [f * x, y];
  s.moveTo(...P(x0 + r, y0));
  s.lineTo(...P(x0 + w * 0.3, y0));
  s.lineTo(...P(x0 + w * 0.22, y0 - ekor));
  s.lineTo(...P(x0 + w * 0.46, y0));
  s.lineTo(...P(x0 + w - r, y0));
  s.quadraticCurveTo(...P(x0 + w, y0), ...P(x0 + w, y0 + r));
  s.lineTo(...P(x0 + w, y0 + h - r));
  s.quadraticCurveTo(...P(x0 + w, y0 + h), ...P(x0 + w - r, y0 + h));
  s.lineTo(...P(x0 + r, y0 + h));
  s.quadraticCurveTo(...P(x0, y0 + h), ...P(x0, y0 + h - r));
  s.lineTo(...P(x0, y0 + r));
  s.quadraticCurveTo(...P(x0, y0), ...P(x0 + r, y0));
  return s;
}
// Balon kata 1.4 × 0.8 × 0.08 kertas opacity 0.85 dengan ekor segitiga, selalu menghadap kamera.
// Titik asal di ujung ekor: letakkan di atas kepala figur (mis. y 1.2); badan balon naik ke kanan atas (cermin: kiri atas).
// isi: "titik" | "tanya" | "kosong" | "panahNaik" | "panahTurun" | "kabur" | "garis". putus: garis tepi putus-putus
// (badan hampir bening). Emas: badan balon (isi tetap gelap).
export function balonKata(opsi = {}) {
  const {
    lebar = 1.4, tinggi = 0.8, tebal = 0.08, ekor = 0.22, isi = "titik", putus = false, cermin = false,
    warna = W.kertas, opasitas = 0.85, warnaIsi = W.zamrudRedup, hadapKamera = true, hadap = HADAP, benih = 4,
    nama = "balon kata", penting = true, skala = 1,
  } = opsi;
  const g = new THREE.Group();
  const putar = kelompokHadap(hadapKamera, hadap);
  g.add(putar);
  const f = cermin ? -1 : 1;
  const r = Math.min(tinggi * 0.45, lebar * 0.28);
  const tubuh = new THREE.Group(); // titik asalnya pusat badan balon
  tubuh.position.set(-f * (-lebar / 2 + lebar * 0.22), tinggi / 2 + ekor, 0);
  putar.add(tubuh);
  const bentuk = bentukBalon(lebar, tinggi, r, ekor, f);
  const matBadan = bahanPadat(warna, opasitas < 1 ? { transparent: true, opacity: opasitas } : {});
  const badan = mesh(geoTetap("balon" + kunci(lebar, tinggi, r, ekor, f, tebal), () =>
    new THREE.ExtrudeGeometry(bentuk, { depth: tebal, bevelEnabled: false, curveSegments: 14 }).translate(0, 0, -tebal / 2)), matBadan, !putus);
  badan.visible = !putus; // balon putus-putus: hanya garis tepinya (badan tetap ada untuk garis tepi denyut)
  tubuh.add(badan);
  let garisPutus = null;
  if (putus) {
    const titikTepi = bentuk.getSpacedPoints(160);
    titikTepi.pop();
    garisPutus = mesh(geoTetap("putus" + kunci(lebar, tinggi, r, ekor, f), () => geoPutus(titikTepi, { tebal: 0.04, dash: 0.1, celah: 0.07, dalam: 0.02 })), bahanPadat(warna), true);
    tubuh.add(garisPutus);
  }
  // Isi balon di muka depan.
  const z = tebal / 2 + 0.004;
  const matIsi = bahanIsi(warnaIsi);
  const daftar = [];
  const tambah = (m, x, y) => { m.position.set(x, y, z); tubuh.add(m); daftar.push(m); return m; };
  if (isi === "titik") {
    for (const x of [-1, 0, 1]) tambah(mesh(geoPiringan(tinggi * 0.095, 0.01), matIsi), x * lebar * 0.2, 0);
  } else if (isi === "garis") {
    const r0 = acak(benih);
    [0.86, 0.7, 0.5].forEach((k, i) => tambah(garisIsi(lebar * 0.6 * (k + 0.1 * r0()), tinggi * 0.075, matIsi, 0), -lebar * 0.3, tinggi * (0.18 - i * 0.18)));
  } else if (isi === "kabur") {
    const r0 = acak(benih);
    const matKabur = bahanIsi(W.abu, W.abuGelap, { transparent: true, opacity: 0.4, depthWrite: false });
    for (let b = 0; b < 3; b++) {
      let x = -lebar * 0.34 + r0() * lebar * 0.05;
      const ujung = lebar * (0.2 + 0.14 * r0());
      while (x < ujung) {
        const w = lebar * (0.06 + 0.12 * r0());
        tambah(garisIsi(Math.min(w, ujung - x + 0.02), tinggi * (0.08 + 0.05 * r0()), matKabur, 0), x, tinggi * (0.2 - b * 0.2) + (r0() - 0.5) * 0.03);
        x += w + lebar * (0.03 + 0.04 * r0());
      }
    }
  } else if (isi === "tanya") {
    const t = tandaTanya({ ukuran: tinggi * 0.66, warna: warnaIsi, hadapKamera: false, hadap: 0, tengah: true, penting: false, nama: "isi tanya" });
    tambah(t, 0, 0);
  } else if (isi === "panahNaik" || isi === "panahTurun") {
    const h = tinggi * 0.62;
    const geoP = geoTetap("panahBalon" + kunci(h), () => new THREE.ExtrudeGeometry(bentukPanah(h), { depth: 0.014, bevelEnabled: false }).translate(0, -h / 2, 0));
    const m = tambah(mesh(geoP, matIsi), 0, 0);
    if (isi === "panahTurun") m.rotation.z = Math.PI;
  }
  const tepi = tepiDenyut(badan);
  tubuh.add(tepi); // anak tubuh, bukan badan: tetap tampak pada balon putus-putus yang badannya disembunyikan
  const emas = putus ? [garisPutus] : [badan];
  return selesai(g, {
    nama, penting, skala,
    bagian: { badan, tubuh, isi: namai(daftar, "isi"), garisPutus, emas, denyut: saringDenyut([putus ? garisPutus : badan, ...daftar]), tepi: [tepi] },
  });
}

// ---------------------------------------------------------------- kartuProker
// Kartu program kerja tegak 1.0 × 1.25 di kaki kecil: pita kepala zamrudRedup, baris isi (garis) atau baris centang
// (cek: n, tercentang: berapa yang sudah dicentang), label tahun HTML yang bisa diganti (gantiLabel(userData.label.tahun)),
// dan tempelan (tag: ["TGL", "PJ", "Rp"]) di bawah kartu. Condong 10° ke belakang supaya mukanya terang.
// Emas: kertasnya (pita kepala, garis, dan centang tetap gelap). Tag dan centang adalah benda sendiri: klikEmas(bagian.tag).
export function kartuProker(opsi = {}) {
  const {
    lebar = 1.0, tinggi = 1.25, tebal = 0.04, miring = 10 * DEG, hadap = HADAP, kaki = true,
    warna = W.kertas, warnaKepala = W.zamrudRedup, warnaGaris = W.abu, warnaIsi = W.zamrud,
    garis = 3, cek = 0, tercentang = 0, tahun = null, tag: daftarTag = null, benih = 2,
    nama = "kartu proker", penting = true, skala = 1,
  } = opsi;
  const g = new THREE.Group();
  const putar = new THREE.Group();
  putar.rotation.y = hadap;
  g.add(putar);
  let mKaki = null;
  const dasar = kaki ? 0.05 : 0;
  if (kaki) {
    mKaki = kotakBulat(lebar * 0.56, 0.1, 0.26, bahanPadat(W.pelat), { radius: 0.03, alas: true });
    putar.add(mKaki);
  }
  const condong = new THREE.Group();
  condong.position.y = dasar;
  condong.rotation.x = -miring;
  putar.add(condong);
  const lembar = new THREE.Group();
  lembar.position.y = tinggi / 2;
  condong.add(lembar);
  const badan = kotakBulat(lebar, tinggi, tebal, bahanPadat(warna), { radius: 0.025 });
  const muka = new THREE.Group();
  muka.position.z = tebal / 2;
  lembar.add(badan, muka);

  const mx = Math.min(lebar, tinggi) * 0.09, wi = lebar - 2 * mx;
  const hk = tinggi * 0.17;
  const kepala = mesh(geoKotak(wi, hk, 0.008), bahanIsi(warnaKepala));
  kepala.position.set(0, tinggi / 2 - mx - hk / 2, 0.005);
  const judul = garisIsi(wi * 0.5, hk * 0.24, bahanIsi(W.kertas, W.abu), 0);
  judul.position.set(-wi / 2 + 0.07, kepala.position.y, 0.011);
  muka.add(kepala, judul);

  const yBawah = -tinggi / 2 + mx + (daftarTag?.length ? 0.2 : 0);
  let y = tinggi / 2 - mx - hk - 0.1;
  const matGaris = bahanIsi(warnaGaris);
  const daftarGaris = [], kotakCek = [], daftarCentang = [];
  if (cek > 0) {
    const rowH = Math.min(0.2, (y - yBawah) / cek);
    const sq = rowH * 0.62;
    const matCek = bahanIsi(warnaKepala);
    const r = acak(benih);
    for (let i = 0; i < cek; i++) {
      const yi = y - i * rowH - sq / 2;
      const kotak = mesh(geoTetap("cek" + kunci(sq), () => geoBingkai(sq, sq, sq * 0.16, 0.006)), matCek);
      kotak.position.set(-wi / 2 + sq / 2, yi, 0.001);
      const gr = garisIsi((wi - sq - 0.08) * (0.55 + 0.35 * r()), Math.min(0.05, rowH * 0.25), matGaris, 0);
      gr.position.set(-wi / 2 + sq + 0.08, yi, 0.004);
      const c = centang({ ukuran: sq * 1.15, dalam: 0.012, warna: warnaIsi, hadapKamera: false, hadap: 0, tengah: true, penting: false, nama: `centang ${i + 1}` });
      c.position.set(-wi / 2 + sq / 2 + sq * 0.12, yi + sq * 0.08, 0.01);
      c.visible = i < tercentang;
      muka.add(kotak, gr, c);
      kotakCek.push(kotak); daftarGaris.push(gr); daftarCentang.push(c);
    }
  } else {
    daftarGaris.push(...blokGaris(muka, matGaris, { x0: -wi / 2, yAtas: y - 0.02, lebar: wi, n: garis, h: 0.05, jarak: Math.min(0.15, (y - yBawah) / Math.max(1, garis)), r: acak(benih), min: 0.55, maks: 0.95 }));
  }
  const daftarTagB = [];
  if (daftarTag?.length) {
    const n = daftarTag.length, wt = Math.min(0.26, (wi - 0.04 * (n - 1)) / n), ht = 0.15;
    daftarTag.forEach((teks, j) => {
      const t = tag({ lebar: wt, tinggi: ht, rebah: false, hadap: 0, label: teks, penting: false, nama: `tag ${teks}` });
      t.position.set(-wi / 2 + wt / 2 + j * (wt + 0.04), -tinggi / 2 + mx * 0.8, 0.004);
      muka.add(t);
      daftarTagB.push(t);
    });
  }
  const tepi = tepiDenyut(badan);
  badan.add(tepi);
  const lblTahun = buatLabel(tahun, jangkar(muka, lebar / 2 - 0.2, tinggi / 2 + 0.05, 0.01), { gaya: "kotak", ax: 0.5, ay: 1, skala: "ikut" });
  return selesai(g, {
    nama, penting, skala, label: { tahun: lblTahun },
    setelKeadaan: keadaanBersarang(g, [...daftarTagB, ...daftarCentang]),
    bagian: {
      badan, muka, kaki: mKaki, kepala, judul, garis: namai(daftarGaris, "garis"), kotakCek: namai(kotakCek, "kotak cek"), centang: daftarCentang, tag: daftarTagB,
      emas: [badan], denyut: saringDenyut([kepala, ...daftarGaris, ...kotakCek]), tepi: [tepi],
    },
  });
}

// ---------------------------------------------------------------- panelKertas
// Panel kertas tegak/condong di atas alas: dasar semua "papan" (tabel batang, agenda, papan kolom, daftar centang,
// kalender, daftar hadir, daftar minat, lembar pilah). Isi yang bisa digerakkan ada di bagian:
//   batang[i]   batang mendatar (titik asal di pangkal kiri → tumbuh(batang, { sumbu: "x" }))
//   baris[i]    kelompok isi tiap baris (titik asal di awal baris → tumbuh(baris[i], { sumbu: "x" }) mengisi baris)
//   sel[r][c]   garis isi tiap sel kolom; centangSel[r][c] centang tiap sel (isiSel: "centang")
//   centang[i]  centang di kotak cek baris i (cek: true); tersembunyi kecuali i < tercentang → muncul(centang[i], { t })
//   petak[i], isiPetak[i]  petak grid dan isinya (zamrud, tersembunyi kecuali indeks di `terisi`) → muncul(isiPetak[i])
//   slot[i]     garis putus-putus baris kosong (`kosong`)
// Label HTML: kolom (kepala kolom), labelBaris (kiri tiap baris), judul. userData.label = { judul, kolom[], baris[] }.
// Titik dunia untuk benda yang terbang ke papan: userData.titikBaris(i), titikSel(r, c), titikPetak(i), kuaternion().
// Emas: bingkai, pita kepala, batang, garis isi, centang, isi petak; kertas tetap.
export function panelKertas(opsi = {}) {
  const grid = opsi.grid ?? null;
  const {
    lebar = 2.0, tinggi = 1.4, tebal = 0.04, miring = 20 * DEG, hadap = HADAP, kaki = "alas",
    dasar = kaki === "alas" ? 0.14 : kaki === "tiang" ? 0.6 : 0,
    warna = grid ? W.zamrudRedup : W.kertas, warnaBingkai = W.zamrud, bingkai = true,
    warnaIsi = W.zamrud, warnaGaris = W.abu, warnaPetak = W.kertas,
    judul = null, kolom = null, baris = 0, batang = null, panjangBatang = null, jalur = false, labelBaris = null,
    isiSel = "garis", cek = false, tercentang = 0, kosong = [], terisi = [], kepala = false, cincin = false,
    benih = 5, skalaLabel = "ikut", nama = "panel kertas", penting = true, skala = 1,
  } = opsi;
  const g = new THREE.Group();
  const putar = new THREE.Group();
  putar.rotation.y = hadap;
  g.add(putar);
  const papan = new THREE.Group();
  papan.position.y = dasar;
  papan.rotation.x = -miring;
  putar.add(papan);
  const lembarG = new THREE.Group();
  lembarG.position.y = tinggi / 2;
  papan.add(lembarG);
  const matKertas = bahanPadat(warna);
  if (grid) matKertas.userData.warnaAbu = W.abuGelap;
  const kertas = kotakBulat(lebar, tinggi, tebal, matKertas, { radius: 0.02 });
  const muka = new THREE.Group();
  muka.position.z = tebal / 2;
  lembarG.add(kertas, muka);

  const matBingkai = bahanPadat(warnaBingkai);
  const daftarBingkai = [];
  if (bingkai) {
    for (const [bw, bh, x, y] of [[lebar + 0.04, 0.05, 0, tinggi / 2], [lebar + 0.04, 0.05, 0, -tinggi / 2], [0.05, tinggi, -lebar / 2, 0], [0.05, tinggi, lebar / 2, 0]]) {
      const b = kotakBulat(bw, bh, tebal + 0.02, matBingkai, { radius: 0.02 });
      b.position.set(x, y, 0.01);
      lembarG.add(b);
      daftarBingkai.push(b);
    }
  }
  const matKaki = bahanPadat(W.pelat);
  const daftarKaki = [];
  if (kaki === "alas") {
    const k = kotakBulat(Math.min(lebar * 0.82, lebar - 0.2), 0.16, 0.36, matKaki, { radius: 0.04, alas: true });
    k.position.z = 0.02;
    putar.add(k);
    daftarKaki.push(k);
  } else if (kaki === "tiang") {
    for (const s of [-1, 1]) {
      const k = kotakBulat(0.07, dasar + 0.12, 0.07, matKaki, { radius: 0.02, alas: true });
      k.position.set(s * (lebar / 2 - 0.2), 0, -0.07);
      putar.add(k);
      daftarKaki.push(k);
    }
  }

  const lblOpsi = { gaya: "baris", ax: 0.5, ay: 0.5, skala: skalaLabel };
  const lbl = { judul: null, kolom: [], baris: [] };
  const ruang = 0.1 + (bingkai ? 0.04 : 0);
  const xKiri = -lebar / 2 + ruang, xKanan = lebar / 2 - ruang;
  let yAtas = tinggi / 2 - ruang;
  const yBawah = -tinggi / 2 + ruang;
  const lebarIsi = xKanan - xKiri;
  const emas = [...daftarBingkai];

  // Pita kepala (kalender) dan cincin pengikat.
  let mKepala = null;
  const daftarCincin = [];
  if (kepala) {
    const hk = Math.min(0.24, tinggi * 0.15);
    mKepala = mesh(geoKotak(lebarIsi + 0.04, hk, 0.01), bahanIsi(warnaIsi));
    mKepala.position.set(0, yAtas - hk / 2 + 0.03, 0.006);
    muka.add(mKepala);
    emas.push(mKepala);
    yAtas -= hk + 0.05;
  }
  if (cincin) {
    const matCincin = bahanPadat(W.abu);
    for (const s of [-1, 1]) {
      const c = mesh(geoTetap("cincinIkat", () => new THREE.TorusGeometry(0.055, 0.016, 8, 24)), matCincin, true);
      c.rotation.y = Math.PI / 2;
      c.position.set(s * lebar * 0.24, tinggi / 2, 0);
      lembarG.add(c);
      daftarCincin.push(c);
    }
  }

  const bagian = {
    papan, lembar: lembarG, kertas, muka, bingkai: daftarBingkai, kaki: daftarKaki, kepala: mKepala, cincin: daftarCincin,
    baris: [], batang: [], jalur: [], sel: [], centangSel: [], kotakCek: [], centang: [], slot: [], petak: [], isiPetak: [],
    garisKolom: [],
  };
  const anak = [];
  const posPetak = [], posBaris = [];
  let xa = xKiri, colW = 0, yBarisFn = () => 0;

  if (grid) {
    // ------------------------------------------------ grid petak (kalender)
    if (judul) { lbl.judul = buatLabel(judul, jangkar(muka, 0, yAtas - 0.1, 0.012), lblOpsi); yAtas -= 0.24; }
    const [nk, nb] = grid;
    const tinggiIsi = yAtas - yBawah;
    const gap = Math.min(lebarIsi / nk, tinggiIsi / nb) * 0.16;
    const wS = (lebarIsi - gap * (nk - 1)) / nk, hS = (tinggiIsi - gap * (nb - 1)) / nb;
    const matPetak = bahanIsi(warnaPetak, W.abu);
    for (let rI = 0; rI < nb; rI++) {
      for (let c = 0; c < nk; c++) {
        const i = rI * nk + c;
        const x = xKiri + c * (wS + gap) + wS / 2, y = yAtas - rI * (hS + gap) - hS / 2;
        const p = mesh(geoKotak(wS, hS, 0.012), matPetak);
        p.position.set(x, y, 0.006);
        p.userData.nama = `alas petak ${i + 1}`;
        const isiP = mesh(geoKotak(wS + 0.004, hS + 0.004, 0.016), bahanPadat(warnaIsi));
        isiP.userData.nama = `petak ${i + 1}`;
        isiP.position.set(x, y, 0.009);
        isiP.visible = terisi.includes(i);
        muka.add(p, isiP);
        bagian.petak.push(p);
        bagian.isiPetak.push(isiP);
        posPetak.push(new THREE.Vector3(x, y, 0.03));
      }
    }
    emas.push(...bagian.isiPetak);
  } else {
    // ------------------------------------------------ baris: batang, garis, kolom, kotak cek
    const nBaris = batang?.length ?? panjangBatang?.length ?? (labelBaris?.length || baris);
    const adaIsi = nBaris > 0 || kolom;
    if (judul) {
      const teks = adaIsi ? String(judul) : bungkus(judul, lebarIsi);
      const opsiJ = { ...lblOpsi, skala: skalaMuat(skalaLabel, teks, lebarIsi) };
      if (adaIsi) { lbl.judul = buatLabel(teks, jangkar(muka, 0, yAtas - 0.09, 0.012), opsiJ); yAtas -= 0.24; }
      else lbl.judul = buatLabel(teks, jangkar(muka, 0, 0, 0.012), opsiJ);
    }
    const sLbl = typeof skalaLabel === "number" ? skalaLabel : 1;
    const gw = labelBaris ? Math.min(lebarIsi * 0.55, (LEBAR_HURUF * String(terpanjang(labelBaris)).length + 0.12) * sLbl) : 0;
    const skalaBaris = labelBaris ? skalaMuat(skalaLabel, terpanjang(labelBaris), gw - 0.04) : null;
    let yKepalaKolom = null;
    if (kolom) {
      const hk = 0.22;
      yKepalaKolom = yAtas - hk / 2;
      yAtas -= hk + 0.05;
    }
    const rowH = nBaris > 0 ? (yAtas - yBawah) / nBaris : 0;
    const sq = Math.min(rowH * 0.62, 0.17);
    const cw = cek ? sq + 0.1 : 0;
    xa = xKiri + gw + cw;
    const xb = xKanan, lebarJalur = xb - xa;
    const yBaris = (i) => yAtas - (i + 0.5) * rowH;
    yBarisFn = yBaris;
    const matGarisKolom = bahanIsi(warnaIsi);
    if (kolom) {
      colW = lebarJalur / kolom.length;
      // Satu skala untuk semua kepala kolom (dikecilkan menurut teks terpanjang) supaya ukurannya seragam.
      const skalaKolom = skalaMuat(skalaLabel, terpanjang(kolom), colW - 0.04);
      kolom.forEach((teks, c) => lbl.kolom.push(buatLabel(teks, jangkar(muka, xa + (c + 0.5) * colW, yKepalaKolom, 0.012), { ...lblOpsi, skala: skalaKolom })));
      const pemisah = garisIsi(xb - xKiri + 0.04, 0.02, matGarisKolom, 0);
      pemisah.position.set(xKiri - 0.02, yAtas + 0.025, 0.004);
      muka.add(pemisah);
      bagian.garisKolom.push(pemisah);
      for (let c = 1; c < kolom.length; c++) {
        const v = mesh(geoKotak(0.014, yKepalaKolom + 0.11 - yBawah, 0.006, 0.5, 1), matGarisKolom);
        v.position.set(xa + c * colW, yKepalaKolom + 0.11, 0.004);
        muka.add(v);
        bagian.garisKolom.push(v);
      }
      emas.push(...bagian.garisKolom);
    }
    const r = acak(benih);
    const maksBatang = panjangBatang ? Math.max(...panjangBatang) : 1;
    const faktor = panjangBatang ? Math.min(1, lebarJalur / maksBatang) : lebarJalur;
    const kosongSemua = kosong === true;
    for (let i = 0; i < nBaris; i++) {
      const y = yBaris(i);
      posBaris.push(new THREE.Vector3(xa, y, 0.03));
      const bg = new THREE.Group();
      bg.position.set(xa, y, 0);
      bg.userData.nama = `baris ${i + 1}`;
      muka.add(bg);
      bagian.baris.push(bg);
      if (batang || panjangBatang) {
        const p = panjangBatang ? panjangBatang[i] * faktor : batang[i] * faktor;
        const hb = Math.min(0.09, rowH * 0.5);
        if (jalur) {
          const j = mesh(geoKotak(lebarJalur, hb, 0.006, 0), bahanIsi(campurWarna(warna, W.abu, 0.35), W.abu));
          j.position.set(xa, y, 0.003);
          j.userData.nama = `jalur ${i + 1}`;
          muka.add(j);
          bagian.jalur.push(j);
        }
        const b = mesh(geoKotak(Math.max(0.001, p), hb, 0.04, 0), bahanPadat(warnaIsi));
        b.position.z = 0.02;
        b.userData.nama = `batang ${i + 1}`;
        bg.add(b);
        bagian.batang.push(b);
        emas.push(b);
      } else if (kolom) {
        const matBaris = bahanIsi(warnaGaris);
        const sel = [], cs = [];
        for (let c = 0; c < kolom.length; c++) {
          if (isiSel === "centang") {
            const ct = centang({ ukuran: Math.min(colW, rowH) * 0.55, dalam: 0.012, warna: warnaIsi, hadapKamera: false, hadap: 0, tengah: true, penting: false, nama: `centang ${i + 1}.${c + 1}` });
            ct.position.set((c + 0.5) * colW, 0, 0.01);
            ct.visible = false;
            bg.add(ct);
            cs.push(ct);
            anak.push(ct);
            emas.push(ct);
          } else if (isiSel === "garis") {
            const m = garisIsi(colW * (0.42 + 0.4 * r()), Math.min(0.05, rowH * 0.28), matBaris, 0);
            m.position.x = c * colW + Math.min(0.08, colW * 0.12);
            m.userData.nama = `sel ${i + 1}.${c + 1}`;
            bg.add(m);
            sel.push(m);
            emas.push(m);
          }
        }
        bagian.sel.push(sel);
        bagian.centangSel.push(cs);
      } else {
        const m = garisIsi(lebarJalur * (0.55 + 0.4 * r()), Math.min(0.05, rowH * 0.3), bahanIsi(warnaGaris), 0);
        m.userData.nama = `garis ${i + 1}`;
        bg.add(m);
        bagian.sel.push([m]);
        emas.push(m);
      }
      if (kosongSemua || (Array.isArray(kosong) && kosong.includes(i))) {
        // Baris kosong: isi disembunyikan, diganti garis putus-putus seperti baris formulir yang belum diisi.
        // Isi yang tumbuh kemudian menutup garis ini (garisnya sedikit di belakang).
        bg.visible = false;
        const slot = mesh(geoTetap("slot" + kunci(lebarJalur), () => geoPutus([new THREE.Vector2(0, 0), new THREE.Vector2(lebarJalur - 0.02, 0)], { tebal: 0.02, dash: 0.07, celah: 0.05, dalam: 0.004, tutup: false })), bahanIsi(W.abu, W.abuGelap));
        slot.position.set(xa, y, 0.002);
        slot.userData.nama = `baris kosong ${i + 1}`;
        muka.add(slot);
        bagian.slot[i] = slot;
      }
      if (labelBaris?.[i] != null) {
        lbl.baris.push(buatLabel(labelBaris[i], jangkar(muka, xKiri + gw / 2, y, 0.012), { ...lblOpsi, skala: skalaBaris }));
      }
      if (cek) {
        const xc = xKiri + gw + sq / 2 + 0.02;
        const kotak = mesh(geoTetap("cek" + kunci(sq), () => geoBingkai(sq, sq, sq * 0.16, 0.006)), bahanIsi(warnaIsi));
        kotak.position.set(xc, y, 0.001);
        const ct = centang({ ukuran: sq * 1.15, dalam: 0.012, warna: warnaIsi, hadapKamera: false, hadap: 0, tengah: true, penting: false, nama: `centang ${i + 1}` });
        ct.position.set(xc + sq * 0.12, y + sq * 0.08, 0.012);
        kotak.userData.nama = `kotak cek ${i + 1}`;
        ct.visible = i < tercentang;
        muka.add(kotak, ct);
        bagian.kotakCek.push(kotak);
        bagian.centang.push(ct);
        anak.push(ct);
        emas.push(kotak, ct);
      }
    }
  }
  const tepi = tepiDenyut(kertas);
  kertas.add(tepi);
  bagian.emas = emas;
  bagian.denyut = saringDenyut(daftarBingkai.length ? daftarBingkai : [kertas]);
  bagian.tepi = [tepi];

  const keDunia = (p, out) => muka.localToWorld(out.copy(p));
  return selesai(g, {
    nama, penting, skala, label: lbl,
    setelKeadaan: anak.length ? keadaanBersarang(g, anak) : undefined,
    // Titik dunia (panggil sesudah matriks dunia diperbarui, mis. di v.setiapFrame).
    titikBaris: (i, out = new THREE.Vector3()) => keDunia(posBaris[i] ?? new THREE.Vector3(), out),
    titikSel: (rI, c, out = new THREE.Vector3()) => keDunia(new THREE.Vector3(xa + (c + 0.5) * colW, yBarisFn(rI), 0.03), out),
    titikPetak: (i, out = new THREE.Vector3()) => keDunia(posPetak[i] ?? new THREE.Vector3(), out),
    kuaternion: (out = new THREE.Quaternion()) => muka.getWorldQuaternion(out),
    bagian,
  });
}

// ---------------------------------------------------------------- katalog
export const DAFTAR_DOKUMEN = [
  { nama: "kartuKecil", kategori: "dokumen", buat: kartuKecil, contoh: { simbol: "garis" } },
  { nama: "kartuProker", kategori: "dokumen", buat: kartuProker, contoh: { cek: 3, tercentang: 2, tag: ["TGL", "PJ", "Rp"] } },
  { nama: "lembarKertas", kategori: "dokumen", buat: lembarKertas, contoh: {} },
  { nama: "sertifikat", kategori: "dokumen", buat: sertifikat, contoh: {} },
  { nama: "suratKeputusan", kategori: "dokumen", buat: suratKeputusan, contoh: {} },
  { nama: "amplop", kategori: "dokumen", buat: amplop, contoh: {} },
  { nama: "map", kategori: "dokumen", buat: map, contoh: {} },
  { nama: "panelKertas", kategori: "dokumen", buat: panelKertas, contoh: { lebar: 2.2, tinggi: 1.6, panjangBatang: [1.6, 1.1, 0.7] } },
  { nama: "buku", kategori: "dokumen", buat: buku, contoh: {} },
  { nama: "tumpukanKertas", kategori: "dokumen", buat: tumpukanKertas, contoh: {} },
  { nama: "ponselKecil", kategori: "dokumen", buat: ponselKecil, contoh: { dokumen: 3 } },
  { nama: "tag", kategori: "penanda", buat: tag, contoh: { lebar: 0.3, tinggi: 0.18 } },
  { nama: "centang", kategori: "penanda", buat: centang, contoh: {} },
  { nama: "tandaTanya", kategori: "penanda", buat: tandaTanya, contoh: {} },
  { nama: "balonKata", kategori: "penanda", buat: balonKata, contoh: { isi: "titik" } },
];
