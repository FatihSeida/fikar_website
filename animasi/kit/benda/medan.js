// Pustaka benda: medan dan struktur (jalan dan lantai, jembatan dan sambungan, tanaman dan bola dunia,
// aliran dan wadah, lapisan). Rincian: kit/docs/benda-medan-perabot.md.
//
// KONTRAK bagian 5: pembuat(opsi = {}) → THREE.Group, titik asal di tengah alas (y = 0), satuan dunia (1 = satu sel grid),
// userData { nama, penting, bagian, setelKeadaan }. Warna dari tema W; tiap benda punya bahannya sendiri; teks hanya label3D.
// Benda tidak bergantung pada waktu: permukaan yang berubah (ban, noda, isi, retak, tunas) punya penyetel di userData
// yang dipanggil adegan dengan nilai turunan t, misalnya v.setiapFrame((t) => ban.userData.aturGeser(3 * t)).
// Benda antartitik (jalan, lintasan, jembatanTabung, panahGaris, garisPutus, talang) memakai titik lokal grup:
// biarkan grupnya di titik asal dunia supaya titik lokal = titik dunia.
import * as THREE from "three";
import { W, cssWarna } from "../inti/tema.js";
import {
  bahanPadat, bahanKaca, bahanGaris, bahanPijar, kotakBulat, garisTepi, garisDari, catatDasar, keadaanBawaan, aturOpasitas, opasitasEfektif,
} from "../inti/bahan.js";
import { acak, klem, halus } from "../inti/waktu.js";
import { titik } from "../inti/ruang.js";
import { aktif } from "../inti/aktif.js";
import { label3D } from "../halaman/label.js";

// ================================================================ bantu
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const ATAS = V(0, 1, 0);
const daftarBahan = (o) => (o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []);

// Warna turunan token tema: geser saturasi dan kecerahan dalam HSL sRGB (seperti CSS), hue tetap ikut tema.
// Dipakai untuk warna kamus yang bukan token, mis. ubin hsl(153, 30%, 16%) = zamrudRedup (s −0.25, l −0.08).
function geserHSL(token, ds = 0, dl = 0) {
  const h = token.getHSL({}, THREE.SRGBColorSpace);
  return new THREE.Color().setHSL(h.h, klem(h.s + ds), klem(h.l + dl), THREE.SRGBColorSpace);
}
// Untuk bahan tanpa cahaya (garis, MeshBasic): kertas/krem polos berada di ambang bloom 0.74, jadi diredupkan.
const redup = (token, k = 0.85) => token.clone().multiplyScalar(k);
// Kertas untuk benda padat bercahaya: kertas polos pada muka yang menghadap matahari sedikit melewati ambang bloom 0.74;
// 0.9 × kertas (linear) tetap di bawahnya pada sudut mana pun dan nyaris tidak berbeda di mata.
const kertasAman = () => redup(W.kertas, 0.9);

// Garis tepi denyut (zamrudPijar 3 px, tersembunyi sampai keadaan "denyut"). sumber: { w, h, d, alas } atau pasangan titik.
function tepiDenyut(sumber) {
  const mat = bahanGaris(W.zamrudPijar, 3, 0);
  mat.userData.tepiDenyut = true;
  const l = Array.isArray(sumber) ? garisDari(sumber, mat) : garisTepi(sumber, { bahan: mat });
  l.visible = false;
  return l;
}
// Permukaan yang ikut menyala saat "denyut". Emissive denyut (zamrudPijar 0.5) di atas permukaan terang (kertas, krem, pion)
// melewati ambang bloom, jadi benda terang hanya berdenyut lewat garis tepinya.
function denyutAman(warna, daftar) {
  const c = warna.isColor ? warna : new THREE.Color(warna);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b > 0.42 ? [] : daftar;
}
// Ganti nilai dasar bahan (titik nol keadaan bawaan kit) sekaligus nilai yang tampak.
function gantiDasar(m, { warna, emisif, kuat } = {}) {
  const d = catatDasar(m);
  if (warna) { d.warna.copy(warna); m.color.copy(warna); }
  if (emisif && d.emisif) { d.emisif.copy(emisif); m.emissive.copy(emisif); }
  if (kuat !== undefined && d.emisif) { d.kuatEmisif = kuat; m.emissiveIntensity = kuat; }
}
// Terapkan ulang keadaan bawaan (abu, pudar, emas, denyut) di atas nilai dasar yang baru diganti.
function segarkan(g) {
  const k = g.userData.keadaan;
  if (k) keadaanBawaan(g, "abu", k.abu ?? 0);
}
// Opasitas bahan lapisan (noda, debu, pola, retak) yang diatur benda sendiri: dasar × opasitas benda × faktor.
// Bahan seperti ini dibuat transparent: true sejak awal dan diberi abaikanKeadaan supaya "pudar" tidak menimpanya.
function aturFaktor(m, f, g) {
  const d = catatDasar(m);
  m.userData.faktorOpasitas = f;
  m.opacity = d.opasitas * opasitasEfektif(g) * f;
}
// Titik jangkar kosong (untuk label3D dan titik bantu).
function jangkar(induk, x = 0, y = 0, z = 0) {
  const o = new THREE.Object3D();
  o.position.set(x, y, z);
  induk.add(o);
  return o;
}
// Label HTML lewat label3D. Dilewati bila teks kosong, opsi false, atau belum ada video aktif (mis. uji di Node).
function pasangLabel(teks, pada, opsi = {}) {
  if (!teks || opsi === false || !aktif.video) return null;
  return label3D(teks, { pada, ...opsi });
}
// Akhiri pembuat benda: isi userData dan catat nilai dasar semua bahan (opasitas, warna, emissive awal).
// Nama bagian berulang ("ubin 3", "laci 2") untuk sumber peristiwa bunyi (userData.nama). Tidak mengubah tampilan.
function namai(daftar, dasar) {
  daftar.forEach((o, i) => { if (o) o.userData.nama = `${dasar} ${i + 1}`; });
  return daftar;
}
function rampung(g, data) {
  g.userData = { penting: true, ...data, bagian: { ...(data.bagian ?? {}) } };
  g.traverse((o) => { for (const m of daftarBahan(o)) catatDasar(m); });
  return g;
}
// Pasangan titik untuk garisDari dari polyline (tutup: sambung titik akhir ke awal).
function ruas(titikList, tutup = false) {
  const p = [];
  const n = titikList.length;
  for (let i = 0; i < n - (tutup ? 0 : 1); i++) {
    const a = titikList[i], b = titikList[(i + 1) % n];
    p.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  return p;
}
function lingkaran(r, n = 64, y = 0) {
  return Array.from({ length: n }, (_, i) => V(r * Math.cos((i / n) * Math.PI * 2), y, r * Math.sin((i / n) * Math.PI * 2)));
}
// Kurva lewat titik-titik: CatmullRom (centripetal) bila lengkung, selain itu garis patah.
function kurvaDari(titikList, lengkung = true) {
  const t = titikList.map((p) => p.clone());
  if (t.length > 2 && lengkung) return new THREE.CatmullRomCurve3(t, false, "centripetal");
  const c = new THREE.CurvePath();
  for (let i = 1; i < t.length; i++) c.add(new THREE.LineCurve3(t[i - 1], t[i]));
  return c;
}
// Titik pada jarak s sepanjang kurva; di luar [0, L] diperpanjang lurus searah garis singgung ujung.
function padaJarak(kurva, L, s, out = V()) {
  if (s <= 0) return out.copy(kurva.getPointAt(0)).addScaledVector(kurva.getTangentAt(0), s);
  if (s >= L) return out.copy(kurva.getPointAt(1)).addScaledVector(kurva.getTangentAt(1), s - L);
  return out.copy(kurva.getPointAt(s / L));
}
// Tekstur kanvas 2D (warna lewat cssWarna token). gambar(ctx, w, h).
function teksturKanvas(w, h, gambar) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  gambar(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// Bantu untuk pembuat benda lain (perabot.js, benda-lokal.js video). Bukan bagian kontrak; boleh berubah.
export const bantuBenda = {
  V, ATAS, geserHSL, redup, kertasAman, tepiDenyut, denyutAman, gantiDasar, segarkan, aturFaktor, jangkar, pasangLabel, rampung, ruas, lingkaran,
  kurvaDari, padaJarak, teksturKanvas, daftarBahan, namai,
};

// Keadaan untuk benda yang hanya terdiri dari garis (LineMaterial tidak ikut keadaan bawaan kit).
// abu/pudar/emas menggeser warna, pudar menurunkan opasitas, denyut menebalkan garis dan menggeser warna ke zamrudPijar.
function keadaanGaris(g, bahanList, lebar) {
  const k = { abu: 0, pudar: 0, emas: 0, nyala: 0, denyut: 0 };
  return (n, v) => {
    if (!(n in k)) return false;
    k[n] = v;
    for (const m of bahanList) {
      const d = catatDasar(m);
      m.color.copy(d.warna);
      if (k.abu) m.color.lerp(W.abu, k.abu);
      if (k.pudar) m.color.lerp(W.abuGelap, k.pudar);
      if (k.denyut) m.color.lerp(W.zamrudPijar, 0.6 * k.denyut);
      if (k.emas) m.color.lerp(W.emas, k.emas);
      m.linewidth = lebar * (1 + 0.8 * k.denyut);
      m.userData.faktorOpasitas = 1 - 0.85 * k.pudar;
      m.opacity = d.opasitas * opasitasEfektif(g) * m.userData.faktorOpasitas;
    }
    return true;
  };
}

// ================================================================ jalan dan lantai
const warnaUbin = () => geserHSL(W.zamrudRedup, -0.25, -0.08); // hsl(153, 30%, 16%)

function buatUbin(lebar, tinggi, dalam, warna) {
  const m = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { radius: 0.03, alas: true });
  m.castShadow = false; // ubin rata: tidak membayangi tanah, hanya menerima bayangan
  return m;
}
// Rusuk atas tiap ubin (dalam koordinat grup) untuk garis tepi denyut.
function garisAtasUbin(ubin) {
  const p = [];
  const v = V();
  for (const m of ubin) {
    const { w, h, d } = m.userData.kotak;
    const s = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => v.set((a * w) / 2, h + 0.004, (b * d) / 2).applyEuler(m.rotation).add(m.position).clone());
    p.push(...ruas(s, true));
  }
  return p;
}
// Deret ubin di sepanjang kurva. Jarak antarubin rata; ubin yang lebih panjang dari jaraknya dipendekkan (pas) supaya
// tidak bertumpuk, dan tinggi ubin berselang 0.004 supaya sudut yang bersinggungan di tikungan tidak z-fighting.
function deretUbin(kurva, { jumlah, jarak, lebar, dalam, tinggi, celah, pas, warna }) {
  const L = kurva.getLength();
  let n, s, awal;
  if (jumlah && jarak) { n = jumlah; s = jarak; awal = (L - (n - 1) * s) / 2; }
  else if (jumlah) { n = jumlah; s = n > 1 ? L / (n - 1) : 0; awal = n > 1 ? 0 : L / 2; }
  else { s = jarak ?? 1; n = Math.max(1, Math.floor(L / s + 1e-6) + 1); awal = (L - (n - 1) * s) / 2; }
  const d = pas && s > 0 ? Math.min(dalam, Math.max(0.3, s - celah)) : dalam;
  const ubin = [], titikUbin = [];
  for (let i = 0; i < n; i++) {
    const si = awal + i * s;
    const p = padaJarak(kurva, L, si);
    const t = kurva.getTangentAt(klem(si / L));
    const m = buatUbin(lebar, tinggi, d, warna);
    m.position.set(p.x, p.y + (i % 2) * 0.004, p.z);
    m.rotation.y = Math.atan2(t.x, t.z);
    m.userData.nama = `ubin ${i + 1}`;
    ubin.push(m);
    titikUbin.push(V(p.x, p.y + tinggi, p.z));
  }
  return { ubin, titikUbin, panjang: L, jarak: s };
}

// ubinJalan: kotak 0.9 × 0.06 × 0.9, hsl(153, 30%, 16%) (turunan zamrudRedup).
export function ubinJalan(opsi = {}) {
  const { lebar = 0.9, tinggi = 0.06, dalam = 0.9, warna = warnaUbin(), nama = "ubin jalan", penting = true } = opsi;
  const g = new THREE.Group();
  const ubin = buatUbin(lebar, tinggi, dalam, warna);
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(ubin, tepi);
  return rampung(g, { nama, penting, bagian: { ubin, tepi: [tepi], denyut: [ubin], emas: [ubin] } });
}

// jalanUbin: deret ubin di sepanjang kurva halus lewat titik-titik lokal.
//   titik      Vector3[] (mis. [titik(-2.6, -2.6), titik(-0.4, -0.2), titik(1.8, 1.6)])
//   jumlah     banyak ubin, rata dari titik awal sampai akhir (jarak = panjang / (jumlah − 1))
//   jarak      jarak antarubin (bawaan 1); dengan jumlah juga diberi, deretnya diletakkan di tengah kurva
//   lengkung   true = CatmullRom; false = garis patah
//   pas        true = ubin dipendekkan bila jarak < dalam + celah, supaya tidak bertumpuk
// userData: kurva (lokal), panjang, jarak, titikUbin (pusat atas tiap ubin), pada(u) titik lokal pada 0..1.
// Namanya bukan `jalan` karena nama itu dipakai gerak berjalan di kit/index.js.
export function jalanUbin(opsi = {}) {
  const {
    titik: T = [V(-3, 0, 0.6), V(0, 0, -0.4), V(3, 0, 0.6)], jumlah, jarak, lengkung = true,
    lebar = 0.9, dalam = 0.9, tinggi = 0.06, celah = 0.1, pas = true, warna = warnaUbin(), nama = "jalan", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const kurva = kurvaDari(T, lengkung);
  const d = deretUbin(kurva, { jumlah, jarak, lebar, dalam, tinggi, celah, pas, warna });
  d.ubin.forEach((m) => g.add(m));
  const tepi = tepiDenyut(garisAtasUbin(d.ubin));
  g.add(tepi);
  return rampung(g, {
    nama, penting, kurva, panjang: d.panjang, jarak: d.jarak, titikUbin: d.titikUbin,
    pada: (u, out = V()) => out.copy(kurva.getPointAt(klem(u))),
    bagian: { ubin: d.ubin, tepi: [tepi], denyut: d.ubin, emas: d.ubin },
  });
}

// persimpangan: ubin pusat dan beberapa lengan jalan. arah: Vector3 per lengan (bawaan sumbu dunia ±x, ±z, yaitu
// keempat arah diagonal layar, sejajar grid). lengan: ubin per lengan. userData.ujung[i]: titik lokal sesudah ubin terakhir.
export function persimpangan(opsi = {}) {
  const {
    lengan = 3, jarak = 1, arah = [V(1, 0, 0), V(0, 0, 1), V(-1, 0, 0), V(0, 0, -1)], lebar = 0.9, dalam = 0.9, tinggi = 0.06,
    pusat = 1.0, warna = warnaUbin(), nama = "persimpangan", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const ubinPusat = buatUbin(pusat, tinggi + 0.01, pusat, warna);
  g.add(ubinPusat);
  const semua = [ubinPusat];
  const lenganList = [], ujung = [];
  arah.forEach((a0, k) => {
    const a = a0.clone().setY(0).normalize();
    const deret = [];
    for (let i = 0; i < lengan; i++) {
      const m = buatUbin(lebar, tinggi, Math.min(dalam, jarak - 0.06), warna);
      m.position.copy(a).multiplyScalar(jarak * (i + 1) + (pusat - jarak) / 2);
      m.position.y = (i % 2) * 0.004;
      m.rotation.y = Math.atan2(a.x, a.z);
      g.add(m);
      deret.push(m);
      semua.push(m);
    }
    lenganList.push(deret);
    ujung.push(a.clone().multiplyScalar(jarak * (lengan + 1) + (pusat - jarak) / 2));
  });
  const tepi = tepiDenyut(garisAtasUbin(semua));
  g.add(tepi);
  return rampung(g, { nama, penting, ujung, bagian: { pusat: ubinPusat, lengan: lenganList, ubin: namai(semua, "ubin"), tepi: [tepi], denyut: semua, emas: semua } });
}

// lintasan: deret ubin lurus dari `dari` ke `ke` dengan dua rel tipis di sisinya dan garis mulai (lintasan kerja).
// userData.titikUbin: pusat atas tiap ubin (untuk kartu yang maju satu ubin).
export function lintasan(opsi = {}) {
  const {
    dari = V(-3, 0, 0), ke = V(3, 0, 0), jumlah = 7, jarak, lebar = 0.9, dalam = 0.9, tinggi = 0.06, rel = true,
    warna = warnaUbin(), warnaRel = W.zamrudRedup, nama = "lintasan", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const kurva = kurvaDari([dari, ke], false);
  const d = deretUbin(kurva, { jumlah, jarak, lebar, dalam, tinggi, celah: 0.1, pas: true, warna });
  d.ubin.forEach((m) => g.add(m));
  const arah = ke.clone().sub(dari).setY(0).normalize();
  const sisi = V().crossVectors(arah, ATAS).normalize();
  const sudut = Math.atan2(arah.x, arah.z);
  const tengah = dari.clone().add(ke).multiplyScalar(0.5);
  const matRel = bahanPadat(warnaRel);
  const relList = [];
  if (rel) {
    for (const s of [-1, 1]) {
      const r = kotakBulat(0.05, 0.04, d.panjang + 1.0, matRel, { radius: 0.015, alas: true });
      r.position.copy(tengah).addScaledVector(sisi, s * (lebar / 2 + 0.12));
      r.rotation.y = sudut;
      r.castShadow = false;
      g.add(r);
      relList.push(r);
    }
    const garisMulai = kotakBulat(lebar + 0.3, 0.04, 0.06, matRel, { radius: 0.015, alas: true });
    garisMulai.position.copy(dari).addScaledVector(arah, -0.5);
    garisMulai.rotation.y = sudut;
    g.add(garisMulai);
    relList.push(garisMulai);
  }
  const tepi = tepiDenyut(garisAtasUbin(d.ubin));
  g.add(tepi);
  return rampung(g, {
    nama, penting, kurva, panjang: d.panjang, titikUbin: d.titikUbin,
    pada: (u, out = V()) => out.copy(kurva.getPointAt(klem(u))),
    bagian: { ubin: d.ubin, rel: relList, tepi: [tepi], denyut: d.ubin, emas: d.ubin },
  });
}

// tanggaJenjang: tiga anak tangga lebar 1.2, dalam 0.9, tinggi 0.4 / 0.8 / 1.2, zamrudRedup.
// Naik ke −z lokal (kanan atas layar), sehingga muka tegak tiap anak tangga menghadap kiri bawah (sisi yang terkena
// matahari) dan profil tangganya tampak di sisi kanan. Label HTML di atas tiap anak tangga (bisa diganti lewat gantiLabel).
//   label     teks per anak tangga (bawaan "LK 1", "LK 2", "LK 3"); false = tanpa label
//   opsiLabel opsi label3D tambahan (gaya, masuk, keluar, skala, ...)
// userData: puncak[i] (titik lokal pusat atas), label[i]; bagian.anak[i] (mesh, bahannya sendiri).
export function tanggaJenjang(opsi = {}) {
  const {
    lebar = 1.2, dalam = 0.9, tinggi = [0.4, 0.8, 1.2], label = ["LK 1", "LK 2", "LK 3"], opsiLabel = {},
    warna = W.zamrudRedup, nama = "tangga jenjang", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const n = tinggi.length;
  const anak = [], puncak = [], lbl = [], tepi = [];
  const matTepi = bahanGaris(W.zamrudPijar, 3, 0);
  matTepi.userData.tepiDenyut = true;
  tinggi.forEach((h, i) => {
    const z = ((n - 1) * dalam) / 2 - i * dalam;
    const m = kotakBulat(lebar, h, dalam, bahanPadat(warna), { alas: true, radius: 0.04 });
    m.position.z = z;
    m.userData.nama = `anak tangga ${i + 1}`;
    g.add(m);
    anak.push(m);
    const l = garisTepi({ w: lebar, h, d: dalam, alas: true }, { bahan: matTepi });
    l.position.z = z;
    l.visible = false;
    g.add(l);
    tepi.push(l);
    puncak.push(V(0, h, z));
    lbl.push(label ? pasangLabel(label[i], jangkar(g, 0, h + 0.1, z), opsiLabel) : null);
  });
  return rampung(g, { nama, penting, puncak, label: lbl, bagian: { anak, tepi, denyut: anak, emas: anak } });
}

// garisWaktu: pita 9 × 0.05 × 0.4 (pelat, tepi zamrudRedup) dengan ujung panah, dan tiang penanda 0.08 × 0.5 × 0.08
// di awal tiap periode (setiap 2.25 unit) berlabel HTML. Dibangun memanjang di x lokal; sejajarLayar (bawaan) memutar
// grup 45° sehingga pita memanjang ke kanan layar.
// userData: titikPeriode(i) (titik lokal di tengah periode i, di atas pita), label[i],
//           geserPenanda(s): tiang dan labelnya bergeser ke kiri sejauh s, memudar di ujung pita (periode berganti).
export function garisWaktu(opsi = {}) {
  const {
    panjang = 9, lebar = 0.4, tebal = 0.05, jarak = 2.25, tiang = [0.08, 0.5, 0.08],
    label = ["PERIODE 1", "PERIODE 2", "PERIODE 3", "PERIODE 4"], opsiLabel = {}, sejajarLayar = true, panah = true,
    warna = W.pelat, warnaTepi = W.zamrudRedup, warnaTiang = W.zamrud, nama = "garis waktu", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const matPita = bahanPadat(warna);
  const pita = kotakBulat(panjang, tebal, lebar, matPita, { alas: true, radius: 0.02 });
  pita.add(garisTepi(pita, { warna: warnaTepi, lebar: 2 }));
  g.add(pita);
  let ujung = null;
  if (panah) {
    const s = new THREE.Shape();
    s.moveTo(0, -0.34); s.lineTo(0.42, 0); s.lineTo(0, 0.34); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: tebal, bevelEnabled: false }).rotateX(-Math.PI / 2);
    ujung = new THREE.Mesh(geo, matPita);
    ujung.position.x = panjang / 2 + 0.03;
    ujung.castShadow = ujung.receiveShadow = true;
    ujung.add(garisTepi(geo, { warna: warnaTepi, lebar: 2 }));
    g.add(ujung);
  }
  const n = Math.max(1, Math.round(panjang / jarak));
  const x0 = -panjang / 2;
  const penanda = [], lbl = [];
  for (let i = 0; i < n; i++) {
    const p = new THREE.Group();
    p.position.set(x0 + i * jarak + 0.12, tebal, -lebar / 2 - 0.08);
    const m = kotakBulat(tiang[0], tiang[1], tiang[2], bahanPadat(warnaTiang), { alas: true, radius: 0.02 });
    p.add(m);
    g.add(p);
    penanda.push(p);
    lbl.push(label ? pasangLabel(label[i], jangkar(p, 0, tiang[1] + 0.12, 0), opsiLabel) : null);
  }
  const xDasar = penanda.map((p) => p.position.x);
  function geserPenanda(s) {
    penanda.forEach((p, i) => {
      const x = xDasar[i] - s;
      const f = halus((x - x0 + 0.05) / 0.17) * halus((panjang / 2 - x) / 0.4);
      p.position.x = x;
      p.scale.y = Math.max(1e-3, f);
      aturOpasitas(p, f); // ikut opasitas garis waktu; dibaca juga oleh label3D (ikutOpasitas) dan periksaZona
      p.visible = f > 0.01;
    });
  }
  const tepi = tepiDenyut({ w: panjang, h: tebal, d: lebar, alas: true });
  g.add(tepi);
  if (sejajarLayar) g.rotation.y = Math.PI / 4;
  return rampung(g, {
    nama, penting, label: lbl, geserPenanda,
    titikPeriode: (i, out = V()) => out.set(x0 + (i + 0.5) * jarak, tebal, 0),
    bagian: { pita, ujung, penanda: namai(penanda, "penanda"), tepi: [tepi], denyut: [pita], emas: [pita, ...(ujung ? [ujung] : [])] },
  });
}

// blokTanah: tanah terangkat 5 × 0.3 × 6 (pelat) bergaris tepi atas zamrudRedup, untuk adegan celah.
//   sisiCelah  "kiri" | "kanan" | "depan" | "belakang": tepi denyut hanya di sisi celah (bawaan: seluruh tepi atas)
//   patah      sisi yang tepinya patah bergerigi (mis. ujung jalan yang terputus); amplitudo, benih
// Sisi: kiri = −x, kanan = +x, depan = +z (kiri bawah layar), belakang = −z.
export function blokTanah(opsi = {}) {
  const {
    lebar = 5, tinggi = 0.3, dalam = 6, warna = W.pelat, warnaTepi = W.zamrudRedup, sisiCelah = null, patah = null,
    amplitudo = 0.22, benih = 5, nama = "blok tanah", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const w = lebar / 2, d = dalam / 2, y = tinggi + 0.004;
  // Sudut (x, z): depan-kiri, depan-kanan, belakang-kanan, belakang-kiri. Sisi: depan, kanan, belakang, kiri.
  const sudut = [[-w, d], [w, d], [w, -d], [-w, -d]];
  const namaSisi = ["depan", "kanan", "belakang", "kiri"];
  const r = acak(benih);
  const garis = []; // titik keliling (x, z)
  sudut.forEach((a, i) => {
    const b = sudut[(i + 1) % 4];
    garis.push(a);
    if (patah === namaSisi[i]) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const k = Math.max(4, Math.round(L / 0.35));
      const nx = (b[1] - a[1]) / L, nz = -(b[0] - a[0]) / L; // normal ke luar
      for (let j = 1; j < k; j++) {
        const u = j / k, off = (j % 2 ? -1 : 0.4) * amplitudo * (0.5 + 0.5 * r());
        garis.push([a[0] + (b[0] - a[0]) * u + nx * off, a[1] + (b[1] - a[1]) * u + nz * off]);
      }
    }
  });
  let lantai;
  const mat = bahanPadat(warna);
  if (patah) {
    const s = new THREE.Shape(garis.map(([x, z]) => new THREE.Vector2(x, -z)));
    const geo = new THREE.ExtrudeGeometry(s, { depth: tinggi, bevelEnabled: false }).rotateX(-Math.PI / 2);
    lantai = new THREE.Mesh(geo, mat);
    lantai.castShadow = lantai.receiveShadow = true;
  } else {
    lantai = kotakBulat(lebar, tinggi, dalam, mat, { alas: true, radius: 0.04 });
  }
  g.add(lantai);
  const keliling = garis.map(([x, z]) => V(x, y, z));
  g.add(garisDari(ruas(keliling, true), bahanGaris(warnaTepi, 1.5, 0.7)));
  let tepiTitik;
  if (sisiCelah) {
    const i = namaSisi.indexOf(sisiCelah);
    const [a, b] = [sudut[i], sudut[(i + 1) % 4]];
    tepiTitik = [a[0], y, a[1], b[0], y, b[1], a[0], 0.01, a[1], b[0], 0.01, b[1], a[0], 0.01, a[1], a[0], y, a[1], b[0], 0.01, b[1], b[0], y, b[1]];
  } else tepiTitik = ruas(keliling, true);
  const tepi = tepiDenyut(tepiTitik);
  g.add(tepi);
  return rampung(g, { nama, penting, tinggiAtas: tinggi, bagian: { lantai, tepi: [tepi], denyut: [lantai], emas: [lantai] } });
}

// lantaiUbin: 7 × 7 ubin 0.95 × 0.08 × 0.95 (zamrudRedup) berjarak 1, berpusat di titik asal.
// Noda per ubin: aturNoda(i, j, k) dengan k 0..1 menampakkan bercak gelap hsl(153, 10%, 12%) dan menggeser ubin ke abuGelap.
// Bingkai: aturPagar(i, j, k) memasang bingkai tebal (empat batang zamrudPijar) di ubin (i, j); k 0..1 = turun dan tampak.
// i = kolom (sumbu x), j = baris (sumbu z), 0..n−1. jarakDari(i0, j0, i, j) = jarak cincin (Chebyshev) untuk pola menjalar.
// bagian: ubin[j * n + i], noda[j * n + i] (bidang bercak), pagar (grup bingkai); ubinDi(i, j), titikUbin(i, j).
const _teksturNoda = new Map();
function teksturNoda(benih) {
  if (_teksturNoda.has(benih)) return _teksturNoda.get(benih);
  const t = teksturKanvas(128, 128, (c, w, h) => {
    const r = acak(benih);
    c.fillStyle = "#fff";
    for (let i = 0; i < 24; i++) {
      const x = w / 2 + (r() - 0.5) * w * 0.62, y = h / 2 + (r() - 0.5) * h * 0.62, rad = 7 + r() * 20;
      c.globalAlpha = 0.45 + r() * 0.5;
      c.beginPath(); c.ellipse(x, y, rad, rad * (0.55 + 0.45 * r()), r() * Math.PI, 0, Math.PI * 2); c.fill();
    }
  });
  _teksturNoda.set(benih, t);
  return t;
}
export function lantaiUbin(opsi = {}) {
  const {
    n = 7, ukuran = 0.95, tinggi = 0.08, jarak = 1, warna = W.zamrudRedup, warnaNoda = geserHSL(W.zamrudRedup, -0.45, -0.12),
    warnaPagar = W.zamrudPijar, nama = "lantai ubin", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const ubin = [], noda = [], tingkat = [];
  const geoNoda = new THREE.PlaneGeometry(ukuran * 0.96, ukuran * 0.96).rotateX(-Math.PI / 2);
  const pusat = (i) => (i - (n - 1) / 2) * jarak;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const m = kotakBulat(ukuran, tinggi, ukuran, bahanPadat(warna), { alas: true, radius: 0.03 });
    m.position.set(pusat(i), 0, pusat(j));
    m.castShadow = false;
    g.add(m);
    ubin.push(m);
    const k = j * n + i;
    const matNoda = bahanPadat(warnaNoda, { map: teksturNoda(1 + (k % 4)), transparent: true, depthWrite: false });
    matNoda.userData.abaikanKeadaan = true;
    const bn = new THREE.Mesh(geoNoda, matNoda);
    bn.position.set(pusat(i), tinggi + 0.003, pusat(j));
    bn.rotation.y = (k % 4) * (Math.PI / 2);
    bn.receiveShadow = true;
    bn.visible = false;
    bn.userData.abaikanZona = true;
    g.add(bn);
    noda.push(bn);
    tingkat.push(0);
  }
  // Bingkai pagar: empat batang di sekeliling satu ubin.
  const pagar = new THREE.Group();
  const matPagar = bahanPadat(warnaPagar);
  const sisi = ukuran + 0.14;
  for (const [w, d, x, z] of [[sisi, 0.07, 0, sisi / 2], [sisi, 0.07, 0, -sisi / 2], [0.07, sisi, sisi / 2, 0], [0.07, sisi, -sisi / 2, 0]]) {
    const b = kotakBulat(w, 0.1, d, matPagar, { alas: true, radius: 0.025 });
    b.position.set(x, 0, z);
    pagar.add(b);
  }
  pagar.visible = false;
  g.add(pagar);
  const warnaDasar = warna.clone();
  const _c = new THREE.Color();
  function aturNoda(i, j, k) {
    const idx = j * n + i;
    if (idx < 0 || idx >= n * n) return;
    k = klem(k);
    tingkat[idx] = k;
    aturFaktor(noda[idx].material, k, g);
    noda[idx].visible = k > 0.002;
    gantiDasar(ubin[idx].material, { warna: _c.copy(warnaDasar).lerp(W.abuGelap, k) });
  }
  function aturPagar(i, j, k) {
    k = klem(k);
    pagar.position.set(pusat(i), tinggi + 0.6 * (1 - halus(k)), pusat(j));
    pagar.visible = k > 0.01;
  }
  const ubinDi = (i, j) => ubin[j * n + i];
  const tepi = tepiDenyut({ w: n * jarak, h: tinggi, d: n * jarak, alas: true });
  g.add(tepi);
  const hasil = rampung(g, {
    nama, penting, n, ubinDi, aturPagar,
    aturNoda(i, j, k) { aturNoda(i, j, k); segarkan(g); },
    // Setel banyak noda sekaligus: fn(i, j) → 0..1, lalu keadaan disegarkan sekali.
    aturSemuaNoda(fn) { for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) aturNoda(i, j, fn(i, j)); segarkan(g); },
    tingkatNoda: (i, j) => tingkat[j * n + i],
    jarakDari: (i0, j0, i, j) => Math.max(Math.abs(i - i0), Math.abs(j - j0)),
    titikUbin: (i, j, out = V()) => out.set(pusat(i), tinggi, pusat(j)),
    bagian: { ubin: namai(ubin, "ubin"), noda, pagar, tepi: [tepi], denyut: ubin, emas: [...pagar.children] },
  });
  return hasil;
}

// petakTanah: kotak tanah 1.2 × 0.2 × 1.2 hsl(153, 30%, 14%) dengan tiga alur tanah di atasnya (petak uji).
export function petakTanah(opsi = {}) {
  const {
    lebar = 1.2, tinggi = 0.2, dalam = 1.2, alur = 3, warna = geserHSL(W.zamrudRedup, -0.25, -0.1), nama = "petak tanah", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const tanah = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { alas: true, radius: 0.05 });
  g.add(tanah);
  const matAlur = bahanPadat(geserHSL(warna, 0, -0.04));
  const gundukan = [];
  for (let i = 0; i < alur; i++) {
    const m = kotakBulat(lebar - 0.24, 0.05, 0.12, matAlur, { alas: true, radius: 0.025 });
    m.position.set(0, tinggi - 0.01, (i - (alur - 1) / 2) * (dalam / (alur + 0.6)));
    g.add(m);
    gundukan.push(m);
  }
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(tepi);
  return rampung(g, { nama, penting, tinggiAtas: tinggi + 0.04, bagian: { tanah, alur: gundukan, tepi: [tepi], denyut: [tanah], emas: [tanah] } });
}

// genangan: cakram pipih tak beraturan radius 1.2, hsl(153, 15%, 18%), dengan bibir tipis zamrudRedup.
// aturUkuran(r): radius baru (mis. genangan mengecil ke 0.6). Tepi denyut di bibirnya.
export function genangan(opsi = {}) {
  const { radius = 1.2, tebal = 0.02, benih = 3, warna = geserHSL(W.zamrudRedup, -0.4, -0.06), nama = "genangan", penting = true } = opsi;
  const g = new THREE.Group();
  const r = acak(benih);
  const f1 = r() * 6.28, f2 = r() * 6.28;
  const N = 56;
  const tepiTitik = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const rr = radius * (1 + 0.07 * Math.sin(3 * a + f1) + 0.045 * Math.sin(5 * a + f2));
    return new THREE.Vector2(rr * Math.cos(a), rr * Math.sin(a));
  });
  const geo = new THREE.ExtrudeGeometry(new THREE.Shape(tepiTitik), { depth: tebal, bevelEnabled: false, curveSegments: 1 }).rotateX(-Math.PI / 2);
  const air = new THREE.Mesh(geo, bahanPadat(warna, { roughness: 0.55 }));
  air.position.y = 0.006;
  air.receiveShadow = true;
  air.castShadow = false;
  const isi = new THREE.Group();
  isi.add(air);
  const bibir = tepiTitik.map((p) => V(p.x, 0.006 + tebal + 0.002, -p.y));
  isi.add(garisDari(ruas(bibir, true), bahanGaris(W.zamrudRedup, 2, 0.9)));
  const tepi = tepiDenyut(ruas(bibir, true));
  isi.add(tepi);
  g.add(isi);
  return rampung(g, {
    nama, penting,
    aturUkuran(rBaru) { const s = Math.max(1e-3, rBaru / radius); isi.scale.set(s, 1, s); },
    bagian: { air, tepi: [tepi], denyut: [air], emas: [air] },
  });
}

// ================================================================ jembatan dan sambungan
// jembatanTabung: tabung tipis radius 0.06 (zamrudRedup) dari `dari` ke `ke` (titik lokal; bawaan pada y 0.3).
//   retak   true = dua potongan dengan celah `celah` (0.3) di tengah dan garis retak tipis di kedua ujung patahan
// aturRetak(k): k 0 = utuh, 1 = celah penuh (retak pulih: animasikan 1 → 0). userData.jalur [dari, ke] = sumbu tabung;
// bola aliran r 0.07 di sumbu hampir tenggelam, jadi angkat jalurnya radius + 0.06 (userData.radius) supaya di atas tabung.
// Denyut: garis tepi siluet di kedua sisi tabung, cincin di kedua ujung, dan cincin di ujung patahan selama retak.
export function jembatanTabung(opsi = {}) {
  const {
    dari = V(-2, 0.3, 0), ke = V(2, 0.3, 0), radius = 0.06, retak = false, celah = 0.3, warna = W.zamrudRedup,
    warnaRetak = redup(W.kertas, 0.85), nama = "jembatan", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const arah = ke.clone().sub(dari);
  const L = arah.length();
  arah.normalize();
  const geo = new THREE.CylinderGeometry(radius, radius, 1, 16).translate(0, 0.5, 0);
  const mat = bahanPadat(warna);
  const a = new THREE.Mesh(geo, mat), b = new THREE.Mesh(geo, mat);
  a.position.copy(dari);
  a.quaternion.setFromUnitVectors(ATAS, arah);
  b.position.copy(ke);
  b.quaternion.setFromUnitVectors(ATAS, arah.clone().negate());
  for (const m of [a, b]) { m.castShadow = true; m.receiveShadow = true; g.add(m); }
  // Garis retak: cincin bergerigi di permukaan tabung pada tiap ujung patahan.
  const matRetak = bahanGaris(warnaRetak, 2, 1);
  matRetak.userData.abaikanKeadaan = true;
  const cincinRetak = (benih) => {
    const r = acak(benih);
    const n = 14;
    const p = Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return V(radius * 1.12 * Math.cos(t), (i % 2 ? 1 : -1) * (0.012 + 0.025 * r()), radius * 1.12 * Math.sin(t));
    });
    const l = garisDari(ruas(p, true), matRetak);
    const grup = new THREE.Group();
    grup.add(l);
    g.add(grup);
    return grup;
  };
  const retakA = cincinRetak(11), retakB = cincinRetak(12);
  retakA.quaternion.copy(a.quaternion);
  retakB.quaternion.copy(a.quaternion);
  // Garis tepi denyut (tersembunyi sampai keadaan "denyut"), anak tiap potongan (sumbu lokal y 0..1, ikut memanjang dan
  // memendek bersama aturRetak): dua garis siluet untuk kamera kit (azimut 45°) dan cincin di ujung luar, ditambah cincin
  // di ujung patahan dalam grup yang hanya tampak selama retak (saat utuh kedua ujung itu berimpit di tengah jembatan).
  const KAMERA = V(1, 1, 1).normalize();
  const cincinTepi = (y) => ruas(lingkaran(radius * 1.12, 24, y), true);
  const ujungPatah = [];
  const tepi = [a, b].flatMap((m) => {
    const n = arah.clone().cross(KAMERA);
    if (n.lengthSq() < 1e-8) n.copy(arah).cross(V(1, 0, 0));
    n.normalize().multiplyScalar(radius * 1.1).applyQuaternion(m.quaternion.clone().invert());
    const sisi = tepiDenyut([n.x, 0, n.z, n.x, 1, n.z, -n.x, 0, -n.z, -n.x, 1, -n.z, ...cincinTepi(0)]);
    const patah = tepiDenyut(cincinTepi(1));
    const grupPatah = new THREE.Group();
    grupPatah.add(patah);
    m.add(sisi, grupPatah);
    ujungPatah.push(grupPatah);
    return [sisi, patah];
  });
  function aturRetak(k) {
    k = klem(k);
    const panjang = Math.max(1e-3, (L - celah * k) / 2);
    a.scale.y = b.scale.y = panjang;
    retakA.position.copy(dari).addScaledVector(arah, panjang - 0.02);
    retakB.position.copy(ke).addScaledVector(arah, -(panjang - 0.02));
    aturFaktor(matRetak, k, g);
    retakA.visible = retakB.visible = k > 0.01;
    for (const u of ujungPatah) u.visible = k > 0.01;
  }
  aturRetak(retak ? 1 : 0);
  return rampung(g, {
    nama, penting, aturRetak, panjang: L, radius, jalur: [dari.clone(), ke.clone()],
    bagian: { tabung: [a, b], retak: [retakA, retakB], tepi, denyut: [a, b], emas: [a, b] },
  });
}

// papanJembatan: papan 0.9 × 0.08 × 0.5 warna kertas dengan dua alur tipis (papan penutup celah).
export function papanJembatan(opsi = {}) {
  const { lebar = 0.9, tinggi = 0.08, dalam = 0.5, warna = kertasAman(), nama = "papan jembatan", penting = true } = opsi;
  const g = new THREE.Group();
  const papan = kotakBulat(lebar, tinggi, dalam, bahanPadat(warna), { alas: true, radius: 0.03 });
  g.add(papan);
  const matAlur = bahanPadat(geserHSL(warna, -0.08, -0.22));
  const alur = [-1, 1].map((s) => {
    const m = kotakBulat(lebar - 0.12, 0.01, 0.025, matAlur, { radius: 0.004, alas: true });
    m.position.set(0, tinggi - 0.004, (s * dalam) / 6);
    g.add(m);
    return m;
  });
  const tepi = tepiDenyut({ w: lebar, h: tinggi, d: dalam, alas: true });
  g.add(tepi);
  return rampung(g, { nama, penting, bagian: { papan, alur, tepi: [tepi], denyut: denyutAman(warna, [papan]), emas: [papan, ...alur] } });
}

// simpul: bola radius 0.3 di atas alas silinder radius 0.35 tinggi 0.15. Lepas = abu, tersambung = zamrud.
//   tersambung  0..1 awal. Keadaan khusus "sambung" 0..1 (setelKeadaan(simpul, "sambung", k)) atau aturSambung(k).
// userData.titikSambung: pusat bola (lokal), untuk ujung garis penghubung.
export function simpul(opsi = {}) {
  const { radius = 0.3, alasR = 0.35, alasT = 0.15, tersambung = 0, warnaLepas = W.abu, warnaSambung = W.zamrud, nama = "simpul", penting = true } = opsi;
  const g = new THREE.Group();
  const alas = new THREE.Mesh(new THREE.CylinderGeometry(alasR, alasR + 0.02, alasT, 32).translate(0, alasT / 2, 0), bahanPadat(W.pelat));
  const matBola = bahanPadat(warnaLepas);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 20), matBola);
  bola.position.y = alasT + radius * 0.92;
  for (const m of [alas, bola]) { m.castShadow = m.receiveShadow = true; g.add(m); }
  const bibir = garisDari(ruas(lingkaran(alasR + 0.01, 48, alasT + 0.002), true), bahanGaris(W.zamrudRedup, 1.5, 0.9));
  g.add(bibir);
  const tepi = tepiDenyut(ruas(lingkaran(radius * 1.08, 48, bola.position.y), true));
  g.add(tepi);
  const _c = new THREE.Color();
  let k = 0;
  function aturSambung(v) {
    k = klem(v);
    gantiDasar(matBola, { warna: _c.copy(warnaLepas).lerp(warnaSambung, k) });
    segarkan(g);
  }
  rampung(g, {
    nama, penting, aturSambung, titikSambung: bola.position.clone(),
    tersambung: () => k,
    setelKeadaan(n, v) { if (n === "sambung") { aturSambung(v); return true; } return false; },
    bagian: { alas, bola, tepi: [tepi], denyut: [bola], emas: [bola] },
  });
  if (tersambung) aturSambung(tersambung);
  return g;
}

// pin: penanda peta, kerucut terbalik tinggi 0.6 dengan bola radius 0.15 di atasnya (zamrud). Titik asal di ujung bawah.
export function pin(opsi = {}) {
  const { tinggi = 0.6, radius = 0.15, warna = W.zamrud, nama = "pin", penting = true } = opsi;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  const kerucut = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.72, tinggi, 24).rotateX(Math.PI).translate(0, tinggi / 2, 0), mat);
  const kepala = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 18), mat);
  kepala.position.y = tinggi + radius * 0.55;
  const mata = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.38, 16, 12), bahanPadat(kertasAman()));
  mata.position.set(radius * 0.48, kepala.position.y + radius * 0.25, radius * 0.48);
  for (const m of [kerucut, kepala, mata]) { m.castShadow = true; g.add(m); }
  const tepi = tepiDenyut(ruas(lingkaran(radius * 1.15, 40, kepala.position.y), true));
  g.add(tepi);
  return rampung(g, { nama, penting, puncak: V(0, kepala.position.y + radius, 0), bagian: { kerucut, kepala, tepi: [tepi], denyut: [kerucut, kepala], emas: [kerucut, kepala] } });
}

// panahGaris: panah 3D (tabung tipis + kepala kerucut) melewati titik-titik lokal.
//   titik     Vector3[] (bawaan dua titik pada y 0.1); lengkung = kurva halus
//   tebal     radius tabung (0.035); kepala { panjang, radius }
//   warna     bawaan zamrudPijar (mis. W.abu untuk "panah satu arah" yang kusam)
// aturTampak(k): panah tergambar bertahap dari pangkal, kepala ikut di ujungnya (0 = tak tampak, 1 = penuh).
export function panahGaris(opsi = {}) {
  const {
    titik: T = [V(-1.5, 0.1, 0), V(1.5, 0.1, 0)], lengkung = false, tebal = 0.035, kepala = {}, warna = W.zamrudPijar,
    nama = "panah", penting = true,
  } = opsi;
  const kp = { panjang: 0.28, radius: 0.1, ...kepala };
  const g = new THREE.Group();
  const kurva = kurvaDari(T, lengkung);
  const L = kurva.getLength();
  const uUjung = klem((L - kp.panjang * 0.9) / L, 0.05, 1);
  const contoh = Array.from({ length: 41 }, (_, i) => kurva.getPointAt((uUjung * i) / 40));
  const batangKurva = new THREE.CatmullRomCurve3(contoh, false, "centripetal");
  const segmen = 40, radial = 8;
  const mat = bahanPadat(warna);
  const batang = new THREE.Mesh(new THREE.TubeGeometry(batangKurva, segmen, tebal, radial, false), mat);
  const ujung = new THREE.Mesh(new THREE.ConeGeometry(kp.radius, kp.panjang, 16).translate(0, kp.panjang / 2, 0), mat);
  for (const m of [batang, ujung]) { m.castShadow = true; g.add(m); }
  const _t = V();
  function aturTampak(k) {
    k = klem(k);
    const n = Math.round(segmen * k);
    batang.geometry.setDrawRange(0, n * radial * 6);
    batang.visible = n > 0;
    const p = batangKurva.getPointAt(Math.max(1e-3, k));
    batangKurva.getTangentAt(Math.max(1e-3, k), _t);
    ujung.position.copy(p).addScaledVector(_t, -0.01);
    ujung.quaternion.setFromUnitVectors(ATAS, _t);
    ujung.visible = k > 0.02;
    ujung.scale.setScalar(halus(k / 0.15));
  }
  aturTampak(1);
  return rampung(g, { nama, penting, aturTampak, kurva, panjang: L, bagian: { batang, ujung, tepi: [], denyut: [batang, ujung], emas: [batang, ujung] } });
}

// garisPutus: garis putus-putus (lebar piksel tetap) di antara titik, atau berbentuk lingkaran/persegi di tanah.
//   titik      Vector3[] lokal; lengkung = kurva halus. Atau:
//   lingkaran  radius (lingkaran mendatar di tanah, pusat titik asal), atau persegi: [lebar, dalam]
//   y          tinggi bentuk lingkaran/persegi (0.02); putus/sela panjang ruas dan celah (0.18 / 0.12)
//   warna      zamrudPijar; lebar 3 px; opasitas 1
// aturTampak(k): garis tergambar bertahap; geser(s): ruas bergeser sejauh s unit di sepanjang garis (semut berjalan).
// Keadaan: abu, pudar, emas menggeser warna; denyut menebalkan garis (garis tidak ikut keadaan bawaan kit).
export function garisPutus(opsi = {}) {
  const {
    titik: T = null, lengkung = false, lingkaran: rLingkaran = null, persegi = null, y = 0.02, putus = 0.18, sela = 0.12,
    warna = W.zamrudPijar, lebar = 3, opasitas = 1, nama = "garis putus", penting = true,
  } = opsi;
  const g = new THREE.Group();
  let jalur, tutup = false;
  if (rLingkaran) { jalur = lingkaran(rLingkaran, Math.max(24, Math.round(rLingkaran * 40)), y); tutup = true; }
  else if (persegi) {
    const [w, d] = persegi;
    jalur = [V(-w / 2, y, -d / 2), V(w / 2, y, -d / 2), V(w / 2, y, d / 2), V(-w / 2, y, d / 2)];
    tutup = true;
  } else {
    const titikList = T ?? [V(-1.5, 0.05, 0), V(1.5, 0.05, 0)];
    jalur = lengkung && titikList.length > 2 ? kurvaDari(titikList, true).getSpacedPoints(64) : titikList;
  }
  if (tutup) jalur = [...jalur, jalur[0]];
  const kum = [0];
  for (let i = 1; i < jalur.length; i++) kum.push(kum[i - 1] + jalur[i].distanceTo(jalur[i - 1]));
  const L = kum[kum.length - 1];
  const pada = (s, out) => {
    let i = 1;
    while (i < jalur.length - 1 && kum[i] < s) i++;
    const u = klem((s - kum[i - 1]) / Math.max(1e-9, kum[i] - kum[i - 1]));
    return out.copy(jalur[i - 1]).lerp(jalur[i], u);
  };
  const mat = bahanGaris(warna, lebar, opasitas);
  const periode = putus + sela;
  let jumlahRuas = 0;
  const _a = V(), _b = V();
  // Posisi ruas: tiap ruas dipecah di sudut jalur supaya tetap menempel pada bentuknya.
  function posisi(geserS) {
    const p = [];
    const fase = ((geserS % periode) + periode) % periode;
    for (let s0 = fase - periode; s0 < L; s0 += periode) {
      const a = Math.max(0, s0), b = Math.min(L, s0 + putus);
      if (b - a < 1e-4) continue;
      let s = a;
      while (s < b - 1e-6) {
        let i = 1;
        while (i < kum.length - 1 && kum[i] <= s + 1e-9) i++;
        const e = Math.min(b, kum[i]);
        pada(s, _a); pada(e, _b);
        p.push(_a.x, _a.y, _a.z, _b.x, _b.y, _b.z);
        s = e;
      }
    }
    jumlahRuas = p.length / 6;
    return p;
  }
  const garis = garisDari(posisi(0), mat);
  g.add(garis);
  let tampak = 1;
  function aturTampak(k) {
    tampak = klem(k);
    const c = Math.round(jumlahRuas * tampak);
    garis.geometry.instanceCount = c;
    garis.visible = c > 0;
  }
  function geser(s) {
    garis.geometry.setPositions(posisi(s));
    aturTampak(tampak);
  }
  return rampung(g, {
    nama, penting, aturTampak, geser, panjang: L,
    setelKeadaan: keadaanGaris(g, [mat], lebar),
    bagian: { garis, tepi: [], denyut: [], emas: [] },
  });
}

// ================================================================ tanaman, bola dunia, peta
// tunas: batang hijau tipis (radius 0.04, tinggi 0.7) dengan dua daun pipih zamrud dan kuncup di pucuk.
// aturTumbuh(k): 0 = belum tumbuh, 1 = penuh; batang memanjang lalu daun membuka berurutan. Awal: opsi tumbuh (bawaan 1).
export function tunas(opsi = {}) {
  const { tinggi = 0.7, radius = 0.04, daun = 2, tumbuh = 1, warna = W.zamrud, warnaBatang = W.zamrud, nama = "tunas", penting = true } = opsi;
  const g = new THREE.Group();
  const batang = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius, tinggi, 10).translate(0, tinggi / 2, 0), bahanPadat(warnaBatang));
  batang.castShadow = true;
  g.add(batang);
  const s = new THREE.Shape();
  const pj = 0.36, lb = 0.13;
  s.moveTo(0, 0);
  s.quadraticCurveTo(pj * 0.45, lb, pj, 0);
  s.quadraticCurveTo(pj * 0.45, -lb, 0, 0);
  const geoDaun = new THREE.ExtrudeGeometry(s, { depth: 0.014, bevelEnabled: false, curveSegments: 10 }).translate(0, 0, -0.007).rotateX(-Math.PI / 2);
  const matDaun = bahanPadat(warna);
  const daunList = [], posDaun = [], mulaiDaun = [];
  for (let i = 0; i < daun; i++) {
    const poros = new THREE.Group();
    const m = new THREE.Mesh(geoDaun, matDaun);
    m.rotation.z = 0.55; // condong ke atas
    m.castShadow = true;
    poros.add(m);
    poros.rotation.y = Math.PI / 4 + i * Math.PI + (i > 1 ? Math.PI / 2 : 0);
    g.add(poros);
    daunList.push(poros);
    posDaun.push(0.45 + 0.25 * (i / Math.max(1, daun - 1)));
    mulaiDaun.push(0.45 + 0.2 * i);
  }
  const kuncup = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.25, 12, 8).scale(1, 1.4, 1), matDaun);
  kuncup.castShadow = true;
  g.add(kuncup);
  function aturTumbuh(k) {
    k = klem(k);
    const kb = halus(k / 0.6) * 0.75 + 0.25 * halus((k - 0.4) / 0.6);
    batang.scale.y = Math.max(1e-3, kb);
    batang.visible = kb > 0.005;
    kuncup.position.y = tinggi * kb;
    kuncup.scale.setScalar(Math.max(1e-3, halus(k / 0.25)));
    kuncup.visible = k > 0.005;
    daunList.forEach((d, i) => {
      const sd = halus((k - mulaiDaun[i]) / 0.3);
      d.position.y = tinggi * kb * posDaun[i];
      d.scale.setScalar(Math.max(1e-3, sd));
      d.visible = sd > 0.01;
    });
  }
  aturTumbuh(tumbuh);
  const tepi = tepiDenyut(ruas([V(0, 0, 0), V(0, tinggi, 0)]));
  g.add(tepi);
  return rampung(g, { nama, penting, aturTumbuh, bagian: { batang, daun: namai(daunList, "daun"), kuncup, tepi: [tepi], denyut: [batang], emas: [batang, kuncup, ...daunList] } });
}

// bolaDunia: bola rangka radius 1.4 dengan garis lintang dan bujur (zamrudRedup), isi gelap supaya sisi belakang tertutup,
// sumbu miring 23°, dan titik nyala opsional. Titik asal di bawah bola (pusat pada y = radius).
//   titik      [[bujur, lintang], ...] titik nyala (bahan pijar zamrudPijar kuat 1, di bawah ambang bloom)
//   isi        true = bola dalam pelat (garis belakang tertutup); warna garis, lebar (px)
// aturPutar(sudut): putaran pada sumbu bumi. aturTitik(i, k): titik ke-i tampak 0..1. bagian.putar: grup yang berputar.
export function bolaDunia(opsi = {}) {
  const {
    radius: R = 1.4, lintang = [-60, -30, 0, 30, 60], bujur = 12, warna = W.zamrudRedup, lebar = 1.6, isi = true, miring = 23.4,
    titik: titikNyala = [], warnaTitik = W.zamrudPijar, nama = "bola dunia", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const poros = new THREE.Group();
  poros.position.y = R;
  poros.rotation.z = (miring * Math.PI) / 180;
  const putar = new THREE.Group();
  poros.add(putar);
  g.add(poros);
  const arahBola = (lon, lat, out = V()) => {
    const l = (lon * Math.PI) / 180, b = (lat * Math.PI) / 180;
    return out.set(Math.cos(b) * Math.sin(l), Math.sin(b), Math.cos(b) * Math.cos(l));
  };
  let inti = null;
  if (isi) {
    inti = new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 32), bahanPadat(W.pelat));
    inti.castShadow = inti.receiveShadow = true;
    putar.add(inti);
  }
  const p = [];
  const R1 = R * 1.003;
  for (const lat of lintang) for (let k = 0; k < 72; k++) {
    const a = arahBola(k * 5, lat), b = arahBola((k + 1) * 5, lat);
    p.push(a.x * R1, a.y * R1, a.z * R1, b.x * R1, b.y * R1, b.z * R1);
  }
  for (let j = 0; j < bujur; j++) for (let k = 0; k < 36; k++) {
    const lon = (j * 360) / bujur;
    const a = arahBola(lon, -90 + k * 5), b = arahBola(lon, -90 + (k + 1) * 5);
    p.push(a.x * R1, a.y * R1, a.z * R1, b.x * R1, b.y * R1, b.z * R1);
  }
  const matGaris = bahanGaris(warna, lebar, 1);
  const rangka = garisDari(p, matGaris);
  putar.add(rangka);
  const geoTitik = new THREE.SphereGeometry(R * 0.045, 12, 8);
  const titikList = titikNyala.map(([lon, lat]) => {
    const m = new THREE.Mesh(geoTitik, bahanPijar(warnaTitik, 1));
    arahBola(lon, lat, m.position).multiplyScalar(R * 1.01);
    putar.add(m);
    return m;
  });
  const tepi = tepiDenyut(ruas(lingkaran(R * 1.02, 72, R), true));
  g.add(tepi);
  const k = { abu: 0, pudar: 0, emas: 0 };
  const garisKeadaan = keadaanGaris(g, [matGaris], lebar);
  return rampung(g, {
    nama, penting, pusat: V(0, R, 0), arahBola,
    aturPutar(sudut) { putar.rotation.y = sudut; },
    aturTitik(i, v) { const m = titikList[i]; if (!m) return; m.scale.setScalar(Math.max(1e-3, v)); m.visible = v > 0.01; },
    // Garis rangka tidak ikut keadaan bawaan: diteruskan ke keadaan garis, lalu bawaan kit untuk isi dan titik.
    setelKeadaan(n, v) { if (n in k || n === "denyut") garisKeadaan(n, v); return false; },
    bagian: { poros, putar, inti, rangka, titik: namai(titikList, "titik"), tepi: [tepi], denyut: inti ? [inti] : [], emas: titikList },
  });
}

// petaLokal: pelat 2.4 × 0.06 × 2.4 (zamrudRedup) berpola jalan kertas dan blok kecil (peta kampus dan daerah).
export function petaLokal(opsi = {}) {
  const { lebar = 2.4, tebal = 0.06, dalam = 2.4, benih = 7, warna = W.zamrudRedup, warnaJalan = kertasAman(), nama = "peta lokal", penting = true } = opsi;
  const g = new THREE.Group();
  const pelat = kotakBulat(lebar, tebal, dalam, bahanPadat(warna), { alas: true, radius: 0.03 });
  g.add(pelat);
  const r = acak(benih);
  const matJalan = bahanPadat(warnaJalan);
  const jalanList = [];
  const garisX = [-0.22, 0.3].map((u) => u * lebar), garisZ = [-0.28, 0.18].map((u) => u * dalam);
  for (const x of garisX) {
    const m = kotakBulat(0.06, 0.012, dalam - 0.1, matJalan, { radius: 0.004, alas: true });
    m.position.set(x, tebal, 0); g.add(m); jalanList.push(m);
  }
  for (const z of garisZ) {
    const m = kotakBulat(lebar - 0.1, 0.012, 0.06, matJalan, { radius: 0.004, alas: true });
    m.position.set(0, tebal, z); g.add(m); jalanList.push(m);
  }
  // Blok di tiap petak di antara jalan.
  const tepiX = [-lebar / 2 + 0.08, ...garisX, lebar / 2 - 0.08], tepiZ = [-dalam / 2 + 0.08, ...garisZ, dalam / 2 - 0.08];
  const warnaBlok = [W.pelat, geserHSL(W.zamrudRedup, -0.15, 0.08), geserHSL(W.kertas, -0.1, -0.12)];
  const matBlok = warnaBlok.map((c) => bahanPadat(c));
  const blok = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const x0 = tepiX[i] + 0.08, x1 = tepiX[i + 1] - 0.08, z0 = tepiZ[j] + 0.08, z1 = tepiZ[j + 1] - 0.08;
    const kampus = i === 1 && j === 1;
    const n = kampus ? 1 : 1 + Math.floor(r() * 3);
    for (let b = 0; b < n; b++) {
      const w = kampus ? (x1 - x0) * 0.8 : Math.min(x1 - x0, 0.14 + r() * 0.2), d = kampus ? (z1 - z0) * 0.7 : Math.min(z1 - z0, 0.14 + r() * 0.2);
      const h = kampus ? 0.2 : 0.05 + r() * 0.12;
      if (w < 0.06 || d < 0.06) continue;
      const m = kotakBulat(w, h, d, matBlok[kampus ? 2 : Math.floor(r() * 2)], { radius: 0.015, alas: true });
      m.position.set(kampus ? (x0 + x1) / 2 : x0 + w / 2 + r() * Math.max(0, x1 - x0 - w), tebal, kampus ? (z0 + z1) / 2 : z0 + d / 2 + r() * Math.max(0, z1 - z0 - d));
      g.add(m);
      blok.push(m);
    }
  }
  const tepi = tepiDenyut({ w: lebar, h: tebal, d: dalam, alas: true });
  g.add(tepi);
  return rampung(g, { nama, penting, bagian: { pelat, jalan: jalanList, blok, tepi: [tepi], denyut: [pelat], emas: [pelat, ...jalanList] } });
}

// ================================================================ aliran dan wadah
// banKonveyor: ban berjalan panjang 12, lebar 2, tinggi 0.3, memanjang di x lokal (bawaan: kiri atas → kanan bawah layar).
// Permukaan bergaris CanvasTexture; aturGeser(s): pola bergeser s unit ke +x (adegan memanggil dengan, mis., 3 * t).
// userData.pada(s, out): titik lokal di permukaan ban pada jarak s dari ujung −x; tinggiAtas.
export function banKonveyor(opsi = {}) {
  const { panjang = 12, lebar = 2, tinggi = 0.3, periode = 0.6, warna = W.pelat, warnaRel = W.zamrudRedup, nama = "ban konveyor", penting = true } = opsi;
  const g = new THREE.Group();
  const matBadan = bahanPadat(warna);
  const badan = kotakBulat(panjang, tinggi - 0.02, lebar, matBadan, { alas: true, radius: 0.05 });
  g.add(badan);
  const ujung = [-1, 1].map((s) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry((tinggi - 0.02) / 2, (tinggi - 0.02) / 2, lebar - 0.02, 24).rotateX(Math.PI / 2), matBadan);
    m.position.set((s * panjang) / 2, (tinggi - 0.02) / 2, 0);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    return m;
  });
  const tekstur = teksturKanvas(64, 16, (c, w, h) => {
    c.fillStyle = cssWarna("zamrudRedup"); c.fillRect(0, 0, w, h);
    c.fillStyle = cssWarna("pelat"); c.fillRect(0, 0, w * 0.36, h);
  });
  tekstur.wrapS = tekstur.wrapT = THREE.RepeatWrapping;
  tekstur.repeat.set(panjang / periode, 1);
  const matBan = bahanPadat(new THREE.Color(1, 1, 1), { map: tekstur }); // putih netral: warna dari tekstur (token tema)
  const lebarBan = lebar - 0.24;
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(panjang, lebarBan).rotateX(-Math.PI / 2), matBan);
  ban.position.y = tinggi + 0.003;
  ban.receiveShadow = true;
  g.add(ban);
  const matRel = bahanPadat(warnaRel);
  const rel = [-1, 1].map((s) => {
    const m = kotakBulat(panjang + 0.12, 0.1, 0.1, matRel, { alas: true, radius: 0.03 });
    m.position.set(0, tinggi - 0.04, (s * (lebar - 0.1)) / 2);
    g.add(m);
    return m;
  });
  const tepi = tepiDenyut({ w: panjang, h: tinggi, d: lebar, alas: true });
  g.add(tepi);
  return rampung(g, {
    nama, penting, tinggiAtas: tinggi,
    aturGeser(s) { tekstur.offset.x = ((((-s / periode) % 1) + 1) % 1); },
    pada: (s, out = V()) => out.set(-panjang / 2 + s, tinggi, 0),
    bagian: { badan, ban, rel, ujung, tepi: [tepi], denyut: [badan, ...rel], emas: rel },
  });
}

// corong: corong berdinding (bubutan) dengan mulut radius 0.6, leher radius 0.12. Titik asal di ujung bawah leher.
//   tinggi (bagian kerucut) 0.8, leher 0.3, tebal dinding 0.04; kaki > 0 = tiga kaki dari tanah setinggi itu.
// userData: mulut (titik lokal pusat mulut), keluar (titik lokal ujung bawah).
export function corong(opsi = {}) {
  const { radiusAtas = 0.6, radiusBawah = 0.12, tinggi = 0.8, leher = 0.3, tebal = 0.04, kaki = 0, warna = W.zamrudRedup, nama = "corong", penting = true } = opsi;
  const g = new THREE.Group();
  const isi = new THREE.Group();
  isi.position.y = kaki;
  g.add(isi);
  const ra = radiusAtas, rb = radiusBawah, t = tebal, y1 = leher, y2 = leher + tinggi;
  const profil = [
    [rb - t, 0], [rb, 0], [rb, y1], [ra, y2], [ra, y2 + 0.03], [ra - t, y2 + 0.03], [rb - t, y1 + t * 0.6], [rb - t, 0],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const badan = new THREE.Mesh(new THREE.LatheGeometry(profil, 40), bahanPadat(warna, { side: THREE.DoubleSide }));
  badan.castShadow = badan.receiveShadow = true;
  isi.add(badan);
  const bibir = garisDari(ruas(lingkaran(ra - t / 2, 64, y2 + 0.032), true), bahanGaris(W.zamrud, 2, 0.9));
  isi.add(bibir);
  const kakiList = [];
  if (kaki > 0) {
    const matKaki = bahanPadat(W.pelat);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
      const atas = V(Math.cos(a) * (rb + (ra - rb) * 0.45), kaki + y1 + tinggi * 0.45, Math.sin(a) * (rb + (ra - rb) * 0.45));
      const bawah = V(Math.cos(a) * (ra * 0.9), 0, Math.sin(a) * (ra * 0.9));
      const d = atas.clone().sub(bawah);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, d.length(), 8).translate(0, d.length() / 2, 0), matKaki);
      m.position.copy(bawah);
      m.quaternion.setFromUnitVectors(ATAS, d.normalize());
      m.castShadow = true;
      g.add(m);
      kakiList.push(m);
    }
  }
  const tepi = tepiDenyut(ruas(lingkaran(ra + 0.01, 64, kaki + y2 + 0.03), true));
  g.add(tepi);
  return rampung(g, {
    nama, penting, mulut: V(0, kaki + y2, 0), keluar: V(0, kaki, 0),
    bagian: { badan, kaki: kakiList, tepi: [tepi], denyut: [badan], emas: [badan] },
  });
}

// talang: talang setengah pipa (radius 0.15, dinding 0.03) di sepanjang titik-titik lokal. Titik = garis sumbu pipa
// (setinggi bibir talang); dasar talang radius di bawahnya. userData.pada(u, out): titik lokal di dasar talang (untuk aliran),
// jalurAliran(n): n titik lokal di dasar talang dari awal ke akhir.
export function talang(opsi = {}) {
  const {
    titik: T = [V(-1.5, 0.8, 0), V(0, 0.55, 0), V(1.5, 0.3, 0)], lengkung = true, radius = 0.15, tebal = 0.03, segmen = 48,
    warna = W.zamrudRedup, nama = "talang", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const kurva = kurvaDari(T, lengkung);
  const busur = 10, r2 = radius - tebal;
  const luar = [], dalam = [];
  for (let i = 0; i <= busur; i++) { const th = (Math.PI * i) / busur; luar.push([radius * Math.cos(th), -radius * Math.sin(th)]); }
  for (let i = busur; i >= 0; i--) { const th = (Math.PI * i) / busur; dalam.push([r2 * Math.cos(th), -r2 * Math.sin(th)]); }
  const strip = [luar, [luar[busur], dalam[0]], dalam, [dalam[busur], luar[0]]];
  const pos = [], idx = [];
  const sisi = V(), naik = V(), _t = V();
  const bingkai = [];
  for (let i = 0; i <= segmen; i++) {
    const u = i / segmen;
    const p = kurva.getPointAt(u);
    kurva.getTangentAt(u, _t);
    const s = V().crossVectors(_t, ATAS);
    if (s.lengthSq() < 1e-6) s.copy(bingkai.length ? bingkai[bingkai.length - 1].s : V(0, 0, 1));
    s.normalize();
    const n = V().crossVectors(s, _t).normalize();
    bingkai.push({ p, s, n });
  }
  for (const st of strip) {
    const dasar = pos.length / 3;
    for (const { p, s, n } of bingkai) {
      for (const [a, b] of st) { sisi.copy(s).multiplyScalar(a); naik.copy(n).multiplyScalar(b); pos.push(p.x + sisi.x + naik.x, p.y + sisi.y + naik.y, p.z + sisi.z + naik.z); }
    }
    const m = st.length;
    for (let i = 0; i < segmen; i++) for (let j = 0; j < m - 1; j++) {
      const a = dasar + i * m + j, b = dasar + (i + 1) * m + j;
      idx.push(a, b, b + 1, a, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const badan = new THREE.Mesh(geo, bahanPadat(warna, { side: THREE.DoubleSide }));
  badan.castShadow = badan.receiveShadow = true;
  g.add(badan);
  const tepiTitik = [];
  for (const sgn of [-1, 1]) tepiTitik.push(...ruas(bingkai.map(({ p, s }) => p.clone().addScaledVector(s, sgn * radius))));
  const tepi = tepiDenyut(tepiTitik);
  g.add(tepi);
  const pada = (u, out = V()) => {
    const b = bingkai[Math.round(klem(u) * segmen)];
    return out.copy(b.p).addScaledVector(b.n, -(r2 - 0.07));
  };
  return rampung(g, {
    nama, penting, kurva, pada,
    jalurAliran: (n = 16) => Array.from({ length: n }, (_, i) => pada(i / (n - 1))),
    bagian: { badan, tepi: [tepi], denyut: [badan], emas: [badan] },
  });
}

// wadahKaca: silinder kaca transparan radius 0.8 tinggi 2.0 dengan alas pelat, bibir zamrudPijar, dan silinder isi zamrud.
//   isi       tinggi isi awal (unit dunia, 0..tinggi); aturIsi(h) mengubahnya (mis. naik ke 1.8)
//   label     teks label HTML di atas wadah (opsiLabel untuk label3D)
// Isi ikut keadaan (abu, emas). bagian: kaca, isi, alas.
export function wadahKaca(opsi = {}) {
  const {
    radius = 0.8, tinggi = 2.0, isi = 0, warnaIsi = W.zamrud, warnaKaca = W.zamrud, label = null, opsiLabel = {},
    nama = "wadah kaca", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const tAlas = 0.06;
  const alas = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.06, radius + 0.08, tAlas, 48).translate(0, tAlas / 2, 0), bahanPadat(W.pelat));
  alas.castShadow = alas.receiveShadow = true;
  g.add(alas);
  const rIsi = radius - 0.06;
  const mIsi = new THREE.Mesh(new THREE.CylinderGeometry(rIsi, rIsi, 1, 48).translate(0, 0.5, 0), bahanPadat(warnaIsi));
  mIsi.position.y = tAlas;
  mIsi.castShadow = mIsi.receiveShadow = true;
  g.add(mIsi);
  const kaca = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, tinggi, 48, 1, true).translate(0, tAlas + tinggi / 2, 0), bahanKaca(warnaKaca, { side: THREE.DoubleSide }));
  kaca.renderOrder = 1;
  kaca.castShadow = false;
  g.add(kaca);
  const matBibir = bahanGaris(W.zamrudPijar, 2, 0.9);
  const bibirAtas = lingkaran(radius, 72, tAlas + tinggi), bibirBawah = lingkaran(radius, 72, tAlas + 0.002);
  const pBibir = [...ruas(bibirAtas, true), ...ruas(bibirBawah, true)];
  // Garis sisi siluet: kamera kit tidak pernah berputar (azimut 45°), jadi tepi kiri-kanan silinder tetap di arah ±kanan layar.
  for (const s of [-1, 1]) { const x = s * radius * Math.SQRT1_2, z = -s * radius * Math.SQRT1_2; pBibir.push(x, tAlas, z, x, tAlas + tinggi, z); }
  g.add(garisDari(pBibir, matBibir));
  let tinggiIsi = 0;
  function aturIsi(h) {
    tinggiIsi = klem(h, 0, tinggi - 0.02);
    mIsi.scale.y = Math.max(1e-3, tinggiIsi);
    mIsi.visible = tinggiIsi > 0.005;
  }
  aturIsi(isi);
  const lbl = pasangLabel(label, jangkar(g, 0, tAlas + tinggi + 0.45, 0), opsiLabel);
  const tepi = tepiDenyut([...ruas(bibirAtas, true), ...ruas(bibirBawah, true)]);
  g.add(tepi);
  return rampung(g, {
    nama, penting, aturIsi, tinggiIsi: () => tinggiIsi, label: lbl, mulut: V(0, tAlas + tinggi, 0),
    bagian: { kaca, isi: mIsi, alas, tepi: [tepi], denyut: [kaca, mIsi], emas: [mIsi, kaca] },
  });
}

// kerucutSorot: kerucut cahaya transparan krem (opacity 0.12) dari atas, dengan genangan cahaya lembut di tanah.
// Titik asal di pusat lingkaran cahaya di tanah. Bukan benda penting (boleh keluar zona).
export function kerucutSorot(opsi = {}) {
  const { tinggi = 4, radiusBawah = 1.2, radiusAtas = 0.12, opasitas = 0.12, warna = W.krem, kolam = true, nama = "sorot", penting = false } = opsi;
  const g = new THREE.Group();
  // Opasitas penuh (`opasitas`) di dekat sumber, memudar ke 45% di lantai supaya terbaca sebagai cahaya, bukan kaca buram.
  const alfaKerucut = teksturKanvas(4, 64, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#fff"); gr.addColorStop(1, "#737373");
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  alfaKerucut.colorSpace = THREE.NoColorSpace;
  const kerucut = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusAtas, radiusBawah, tinggi, 48, 1, true).translate(0, tinggi / 2, 0),
    new THREE.MeshBasicMaterial({ color: warna.clone(), alphaMap: alfaKerucut, transparent: true, opacity: opasitas, depthWrite: false }),
  );
  kerucut.renderOrder = 2;
  kerucut.userData.abaikanZona = true;
  g.add(kerucut);
  let genang = null;
  if (kolam) {
    const alfa = teksturKanvas(128, 128, (c, w, h) => {
      const gr = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      gr.addColorStop(0, "#fff"); gr.addColorStop(0.7, "#bbb"); gr.addColorStop(1, "#000");
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
    });
    alfa.colorSpace = THREE.NoColorSpace;
    genang = new THREE.Mesh(
      new THREE.CircleGeometry(radiusBawah, 48).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: warna.clone(), alphaMap: alfa, transparent: true, opacity: opasitas * 1.2, depthWrite: false }),
    );
    genang.position.y = 0.012;
    genang.renderOrder = 2;
    genang.userData.abaikanZona = true;
    g.add(genang);
  }
  return rampung(g, { nama, penting, bagian: { kerucut, kolam: genang, tepi: [], denyut: [], emas: [] } });
}

// ================================================================ lapisan
// cincin: torus mendatar di tanah (gema, kelompok, keadaan aktif). radius 1.0, tebal (radius tabung) 0.03, zamrudPijar.
// aturRadius(r): radius berubah tanpa menebalkan tabungnya (gema yang mengembang 0.5 → 3.0; pudarkan dengan aturOpasitas).
export function cincin(opsi = {}) {
  const { radius = 1.0, tebal = 0.03, warna = W.zamrudPijar, segmen = 96, nama = "cincin", penting = true } = opsi;
  const g = new THREE.Group();
  const radial = 10;
  const geo = new THREE.TorusGeometry(radius, tebal, radial, segmen);
  // Simpan arah tiap verteks (cos u, sin u) dan geser tabungnya, supaya radius bisa diganti dengan tebal tetap.
  const cu = [], su = [], ta = [], tb = [];
  for (let j = 0; j <= radial; j++) for (let i = 0; i <= segmen; i++) {
    const u = (i / segmen) * Math.PI * 2, v = (j / radial) * Math.PI * 2;
    cu.push(Math.cos(u)); su.push(Math.sin(u)); ta.push(tebal * Math.cos(v)); tb.push(tebal * Math.sin(v));
  }
  const m = new THREE.Mesh(geo, bahanPadat(warna));
  m.rotation.x = -Math.PI / 2;
  m.position.y = tebal;
  m.receiveShadow = true;
  m.castShadow = false;
  g.add(m);
  const pos = geo.attributes.position;
  function aturRadius(r) {
    for (let k = 0; k < pos.count; k++) pos.setXYZ(k, (r + ta[k]) * cu[k], (r + ta[k]) * su[k], tb[k]);
    pos.needsUpdate = true;
    geo.computeBoundingSphere();
    geo.computeBoundingBox();
  }
  return rampung(g, { nama, penting, aturRadius, bagian: { cincin: m, tepi: [], denyut: [m], emas: [m] } });
}

// lapisanDebu(sasaran, opsi): lapisan bintik debu (abu) di permukaan benda. Bintik disebar acak berbenih di segitiga
// yang menghadap `arah` (bawaan atas) pada mesh sasaran, lalu dipasang sebagai anak `induk` (bawaan sasaran).
//   jumlah 140, benih 1, ukuran [0.012, 0.03], arah Vector3 lokal sasaran, ambang 0.55 (cos sudut),
//   bagian  mesh atau array mesh yang ditaburi (bawaan seluruh sasaran), opasitas 0.75, kadar awal 1
// Mengembalikan InstancedMesh dengan userData.aturDebu(k) (0 = bersih, 1 = penuh). Juga dipasang sebagai
// sasaran.userData.bagian.debu dan sasaran.userData.aturDebu. Bagian yang bergerak (pintu, laci) tidak ikut: pakai induk.
export function lapisanDebu(sasaran, opsi = {}) {
  const {
    jumlah = 140, benih = 1, ukuran = [0.012, 0.03], arah = ATAS, ambang = 0.55, bagian = null, warna = W.abu, opasitas = 0.75,
    kadar = 1, induk = sasaran,
  } = opsi;
  sasaran.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(induk.matrixWorld).invert();
  const rel = new THREE.Matrix4();
  const arahN = arah.clone().normalize();
  const segi = [];
  let total = 0;
  const a = V(), b = V(), c = V(), ab = V(), ac = V(), n = V();
  const sumber = bagian ? (Array.isArray(bagian) ? bagian : [bagian]) : [sasaran];
  for (const s of sumber) s.traverse((o) => {
    if (!o.isMesh || o.isLineSegments2 || o.isInstancedMesh || o.userData.lapisan || !o.geometry?.attributes?.position) return;
    rel.multiplyMatrices(inv, o.matrixWorld);
    const p = o.geometry.attributes.position, ix = o.geometry.index;
    const nTri = (ix ? ix.count : p.count) / 3;
    for (let t = 0; t < nTri; t++) {
      const i0 = ix ? ix.getX(3 * t) : 3 * t, i1 = ix ? ix.getX(3 * t + 1) : 3 * t + 1, i2 = ix ? ix.getX(3 * t + 2) : 3 * t + 2;
      a.fromBufferAttribute(p, i0).applyMatrix4(rel);
      b.fromBufferAttribute(p, i1).applyMatrix4(rel);
      c.fromBufferAttribute(p, i2).applyMatrix4(rel);
      ab.subVectors(b, a); ac.subVectors(c, a); n.crossVectors(ab, ac);
      const luas = n.length() / 2;
      if (luas < 1e-7) continue;
      n.normalize();
      if (n.dot(arahN) < ambang) continue;
      total += luas;
      segi.push({ a: a.clone(), ab: ab.clone(), ac: ac.clone(), n: n.clone(), kum: total });
    }
  });
  const mat = bahanPadat(warna, { transparent: true, opacity: opasitas, depthWrite: false });
  mat.userData.abaikanKeadaan = true;
  const debuMesh = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 7), mat, Math.max(1, segi.length ? jumlah : 1));
  debuMesh.userData.lapisan = true;
  debuMesh.userData.abaikanZona = true;
  debuMesh.castShadow = debuMesh.receiveShadow = false;
  debuMesh.frustumCulled = false;
  const r = acak(benih);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sk = V(), pp = V();
  const Z = V(0, 0, 1);
  if (segi.length) {
    for (let i = 0; i < jumlah; i++) {
      const x = r() * total;
      let lo = 0, hi = segi.length - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (segi[mid].kum < x) lo = mid + 1; else hi = mid; }
      const sg = segi[lo];
      let u = r(), w = r();
      if (u + w > 1) { u = 1 - u; w = 1 - w; }
      pp.copy(sg.a).addScaledVector(sg.ab, u).addScaledVector(sg.ac, w).addScaledVector(sg.n, 0.004);
      q.setFromUnitVectors(Z, sg.n);
      const s = ukuran[0] + (ukuran[1] - ukuran[0]) * r();
      sk.set(s, s * (0.7 + 0.3 * r()), s);
      debuMesh.setMatrixAt(i, m4.compose(pp, q, sk));
    }
  } else debuMesh.setMatrixAt(0, m4.makeScale(0, 0, 0));
  debuMesh.instanceMatrix.needsUpdate = true;
  induk.add(debuMesh);
  catatDasar(mat);
  function aturDebu(k) {
    k = klem(k);
    aturFaktor(mat, k, sasaran);
    debuMesh.visible = k > 0.002;
  }
  aturDebu(kadar);
  debuMesh.userData.aturDebu = aturDebu;
  sasaran.userData.bagian ??= {};
  sasaran.userData.bagian.debu = debuMesh;
  sasaran.userData.aturDebu = aturDebu;
  return debuMesh;
}

// ================================================================ katalog
export const DAFTAR_MEDAN = [
  { nama: "ubinJalan", kategori: "medan", sub: "jalan dan lantai", buat: ubinJalan, contoh: {} },
  { nama: "jalanUbin", kategori: "medan", sub: "jalan dan lantai", buat: jalanUbin, contoh: { titik: [titik(-2.6, -1.2), titik(0, 0.4), titik(2.6, -0.6)], jarak: 1 } },
  { nama: "persimpangan", kategori: "medan", sub: "jalan dan lantai", buat: persimpangan, contoh: { lengan: 3 } },
  { nama: "lintasan", kategori: "medan", sub: "jalan dan lantai", buat: lintasan, contoh: { jumlah: 7 } },
  { nama: "tanggaJenjang", kategori: "medan", sub: "jalan dan lantai", buat: tanggaJenjang, contoh: {} },
  { nama: "garisWaktu", kategori: "medan", sub: "jalan dan lantai", buat: garisWaktu, contoh: {} },
  { nama: "blokTanah", kategori: "medan", sub: "jalan dan lantai", buat: blokTanah, contoh: { lebar: 3, dalam: 3, sisiCelah: "kanan" } },
  { nama: "lantaiUbin", kategori: "medan", sub: "jalan dan lantai", buat: lantaiUbin, contoh: {} },
  { nama: "petakTanah", kategori: "medan", sub: "jalan dan lantai", buat: petakTanah, contoh: {} },
  { nama: "genangan", kategori: "medan", sub: "jalan dan lantai", buat: genangan, contoh: {} },
  { nama: "jembatanTabung", kategori: "medan", sub: "jembatan dan sambungan", buat: jembatanTabung, contoh: { retak: true } },
  { nama: "papanJembatan", kategori: "medan", sub: "jembatan dan sambungan", buat: papanJembatan, contoh: {} },
  { nama: "simpul", kategori: "medan", sub: "jembatan dan sambungan", buat: simpul, contoh: {} },
  { nama: "pin", kategori: "medan", sub: "jembatan dan sambungan", buat: pin, contoh: {} },
  { nama: "panahGaris", kategori: "medan", sub: "jembatan dan sambungan", buat: panahGaris, contoh: {} },
  { nama: "garisPutus", kategori: "medan", sub: "jembatan dan sambungan", buat: garisPutus, contoh: { lingkaran: 1.0 } },
  { nama: "tunas", kategori: "medan", sub: "tanaman dan dunia", buat: tunas, contoh: {} },
  { nama: "bolaDunia", kategori: "medan", sub: "tanaman dan dunia", buat: bolaDunia, contoh: { titik: [[107, -6], [110, -7], [98, 3.6]] } },
  { nama: "petaLokal", kategori: "medan", sub: "tanaman dan dunia", buat: petaLokal, contoh: {} },
  { nama: "banKonveyor", kategori: "medan", sub: "aliran dan wadah", buat: banKonveyor, contoh: { panjang: 6, lebar: 1.6 } },
  { nama: "corong", kategori: "medan", sub: "aliran dan wadah", buat: corong, contoh: { kaki: 0.6 } },
  { nama: "talang", kategori: "medan", sub: "aliran dan wadah", buat: talang, contoh: {} },
  { nama: "wadahKaca", kategori: "medan", sub: "aliran dan wadah", buat: wadahKaca, contoh: { isi: 0.9 } },
  { nama: "kerucutSorot", kategori: "medan", sub: "aliran dan wadah", buat: kerucutSorot, contoh: {} },
  { nama: "cincin", kategori: "medan", sub: "lapisan", buat: cincin, contoh: {} },
  {
    nama: "lapisanDebu", kategori: "medan", sub: "lapisan", contoh: {},
    // Lapisan, bukan benda: contohnya ditaburkan di atas papan jembatan.
    buat: (o = {}) => { const p = papanJembatan({ nama: "lapisan debu" }); lapisanDebu(p, { jumlah: 90, ...o }); return p; },
  },
];
