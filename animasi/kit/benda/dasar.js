// Benda dasar: pion (figur manusia) dan rumah (komisariat). Mengikuti KONTRAK bagian 5:
// fungsi(opsi) → THREE.Group, titik asal di tengah alas (y = 0), userData { nama, penting, bagian, setelKeadaan }.
// Benda tidak bergantung pada waktu; gerak diatur modul gerak. Setiap benda punya bahannya sendiri.
import * as THREE from "three";
import { W } from "../inti/tema.js";
import { bahanPadat, bahanGaris, kotakBulat, garisTepi, catatDasar, setelKeadaan, opasitasEfektif, EMAS } from "../inti/bahan.js";

// ---------------------------------------------------------------- pion (prompt D.4)
// Badan kapsul radius 0.18 dengan silinder setinggi 0.46, kepala bola radius 0.16, tinggi total ±1.0 unit. Tanpa wajah.
// Sisi +z lokal adalah depan figur (jalan({ hadap: true }) memutar +z ke arah jalan).
// opsi:
//   warna        warna kepala (dan badan bila warnaJaket kosong), bawaan W.pion
//   warnaJaket   warna badan dan lengan, untuk kerumunan berjaket beragam (bawaan sama dengan warna)
//   pudar        abuGelap, opacity 0.15
//   aktif        cincin torus r 0.32 tebal 0.03 di kaki; cincinTipis: tebal 0.016 (mis. mantan ketua)
//   warnaCincin  bawaan W.zamrudPijar
//   duduk        tinggi turun 0.25
//   tangan       false | true (= "turun") | "turun" | "naik" | "terbuka" | "satuNaik"; silinder r 0.05,
//                panjangTangan bawaan 0.35. Lengan berporos di bahu: bagian.tangan = [kiri (−x), kanan (+x)],
//                putar poros itu (rotation.z / rotation.x) untuk mengangkat tangan. "satuNaik" mengangkat tangan kanan.
//   pegang       Object3D yang dipegang di depan badan (dada, sisi +z). Posisinya sendiri menjadi geseran dari titik pegang.
//   lencana      cakram pipih r 0.12 di dada (sisi +z), warnaLencana bawaan W.zamrud
//   skala
// Keadaan: "aktif" 0..1 (cincin), "emas" 0..1 (cincin berubah emas; badan tidak pernah emas), "nyala",
// "lencana" 0..1 (tampak lencana), plus bawaan kit ("pudar", "abu", "denyut") untuk badan.
// Lencana menjadi emas lewat bendanya sendiri: klikEmas(p.userData.bagian.lencana).
const GEO_KEPALA = new THREE.SphereGeometry(0.16, 24, 16);
const GEO_CINCIN = new THREE.TorusGeometry(0.32, 0.03, 10, 48);
const GEO_CINCIN_TIPIS = new THREE.TorusGeometry(0.32, 0.016, 8, 48);
const GEO_LENCANA = new THREE.CylinderGeometry(0.12, 0.12, 0.025, 28).rotateX(Math.PI / 2);
const geoBadan = new Map();
function badanPion(silinder) {
  if (!geoBadan.has(silinder)) geoBadan.set(silinder, new THREE.CapsuleGeometry(0.18, silinder, 6, 20).translate(0, silinder / 2 + 0.18, 0));
  return geoBadan.get(silinder);
}
// Lengan menggantung dari poros bahu (ujung atas silinder di titik asal poros).
const geoLengan = new Map();
function lenganPion(panjang) {
  if (!geoLengan.has(panjang)) geoLengan.set(panjang, new THREE.CylinderGeometry(0.05, 0.05, panjang, 12).translate(0, -panjang / 2, 0));
  return geoLengan.get(panjang);
}
// Bahu dipilih supaya pose "turun" berpanjang 0.35 sama dengan tangan versi 0.3.0 (pusat ±0.215, 0.5, miring 0.14).
const BAHU = { x: 0.215 - 0.175 * Math.sin(0.14), y: 0.5 + 0.175 * Math.cos(0.14) };
// Rotasi poros [x, z] per pose; s = −1 kiri, +1 kanan.
const POSE = {
  turun: (s) => [0, s * 0.14],
  naik: (s) => [0, s * (Math.PI - 0.32)],
  terbuka: (s) => [-1.15, s * 0.18],
};

export function pion(opsi = {}) {
  const {
    warna = W.pion, pudar = false, aktif = false, duduk = false, tangan = false, skala = 1, warnaCincin = W.zamrudPijar, nama = "pion", penting = true,
    warnaJaket = null, panjangTangan = 0.35, pegang = null, cincinTipis = false, lencana = false, warnaLencana = W.zamrud,
  } = opsi;
  const turun = duduk ? 0.25 : 0;
  const g = new THREE.Group();
  const mat = bahanPadat(warna);
  const matBadan = warnaJaket ? bahanPadat(warnaJaket) : mat;
  const badan = new THREE.Mesh(badanPion(0.46 - turun), matBadan);
  const kepala = new THREE.Mesh(GEO_KEPALA, mat);
  kepala.position.y = 0.88 - turun;
  g.add(badan, kepala);
  const daftarTangan = [];
  const pose = tangan === true ? "turun" : tangan;
  if (pose) {
    if (!POSE[pose] && pose !== "satuNaik") console.warn(`[kit] pion: tangan "${pose}" tidak dikenal; dipakai "turun".`);
    for (const s of [-1, 1]) {
      const p = pose === "satuNaik" ? (s > 0 ? "naik" : "turun") : POSE[pose] ? pose : "turun";
      const [rx, rz] = POSE[p](s);
      const poros = new THREE.Group();
      poros.position.set(s * BAHU.x, BAHU.y - turun, 0);
      poros.rotation.set(rx, 0, rz);
      const m = new THREE.Mesh(lenganPion(panjangTangan), matBadan);
      m.castShadow = true;
      poros.add(m);
      g.add(poros);
      daftarTangan.push(poros);
    }
  }
  for (const o of g.children) { o.castShadow = true; o.receiveShadow = false; }

  const matCincin = bahanPadat(warnaCincin, { transparent: true, emissive: new THREE.Color(warnaCincin), emissiveIntensity: 0.35 });
  matCincin.userData.abaikanKeadaan = true;
  catatDasar(matCincin); // opacity dasar 1; tampaknya cincin lewat faktorOpasitas
  const cincin = new THREE.Mesh(cincinTipis ? GEO_CINCIN_TIPIS : GEO_CINCIN, matCincin);
  cincin.rotation.x = -Math.PI / 2;
  cincin.position.y = 0.035;
  cincin.receiveShadow = true;
  cincin.userData.abaikanZona = true;
  g.add(cincin);

  const k = { aktif: aktif ? 1 : 0, emas: 0, nyala: null, lencana: lencana ? 1 : 0 };
  const warnaC = new THREE.Color(warnaCincin);
  function aturCincin() {
    const a = Math.max(k.aktif, k.emas);
    cincin.visible = a > 0.01;
    cincin.scale.setScalar(0.7 + 0.3 * a);
    matCincin.userData.faktorOpasitas = a;
    matCincin.opacity = a * opasitasEfektif(g);
    matCincin.color.copy(warnaC).lerp(W.emas, k.emas);
    if (k.emas > 0) { matCincin.emissive.copy(W.emasPijar); matCincin.emissiveIntensity = k.nyala ?? EMAS.akhir * k.emas; }
    else { matCincin.emissive.copy(warnaC); matCincin.emissiveIntensity = 0.35; }
  }
  aturCincin();

  // Lencana: benda sendiri (emas/nyala lewat klikEmas pada mesh ini), kebal keadaan badan (abaikanKeadaan).
  // Tampaknya diatur keadaan pion "lencana" lewat faktorOpasitas, jadi tetap ikut opasitas pion.
  let mLencana = null, aturLencana = null;
  if (lencana) {
    const matL = bahanPadat(warnaLencana, { transparent: true });
    matL.userData.abaikanKeadaan = true;
    catatDasar(matL);
    mLencana = new THREE.Mesh(GEO_LENCANA, matL);
    mLencana.position.set(0, 0.62 - turun, 0.198);
    mLencana.castShadow = true;
    const kl = { emas: 0, nyala: null };
    const warnaL = new THREE.Color(warnaLencana);
    aturLencana = () => {
      mLencana.visible = k.lencana > 0.01;
      matL.userData.faktorOpasitas = k.lencana;
      matL.opacity = k.lencana * opasitasEfektif(g);
      matL.color.copy(warnaL).lerp(W.emas, kl.emas);
      if (kl.emas > 0) { matL.emissive.copy(W.emasPijar); matL.emissiveIntensity = kl.nyala ?? EMAS.akhir * kl.emas; }
      else { matL.emissive.setRGB(0, 0, 0); matL.emissiveIntensity = 0; }
    };
    mLencana.userData = {
      nama: "lencana", penting: false, bagian: { tepi: [] },
      setelKeadaan(n, nilai) {
        if (n === "emas" || n === "nyala") { kl[n] = nilai; aturLencana(); }
        return true; // keadaan lain tidak berlaku untuk lencana
      },
    };
    aturLencana();
    g.add(mLencana);
  }

  // Benda yang dipegang: titik pegang di depan dada; posisi benda itu sendiri menjadi geseran.
  let titikPegang = null;
  if (pegang) {
    titikPegang = new THREE.Group();
    titikPegang.position.set(0, 0.52 - turun, 0.26);
    titikPegang.add(pegang);
    g.add(titikPegang);
  }

  g.scale.setScalar(skala);
  g.userData = {
    nama, penting,
    lonjakEmas: 0, // klikEmas tanpa opsi lonjak: figur tidak membesar, hanya cincin kakinya yang menjadi emas
    // tepi kosong: denyut pada pion hanya menyalakan permukaan badan, tanpa garis kotak.
    bagian: { badan, kepala, tangan: daftarTangan, cincin, lencana: mLencana, pegang, titikPegang, tepi: [], denyut: [badan, kepala, ...daftarTangan] },
    setelKeadaan(n, nilai) {
      if (n === "aktif" || n === "emas" || n === "nyala") { k[n] = nilai; aturCincin(); return true; }
      if (n === "lencana") { k.lencana = nilai; aturLencana?.(); return true; }
      return false; // pudar, abu, denyut: penanganan bawaan kit (cincin dan lencana dikecualikan lewat abaikanKeadaan)
    },
  };
  if (pudar) setelKeadaan(g, "pudar", 1);
  return g;
}

// ---------------------------------------------------------------- rumah / komisariat
// Dinding kotak (bawaan 1.8 × 1.2 × 1.6, zamrudRedup), atap prisma setinggi 0.7 (pelat) dengan bubungan sejajar lebar,
// pintu kotak lebarPintu × tinggiPintu (bawaan 0.4 × 0.7) di sisi yang terlihat kamera: "depan" = sisi +z lokal (kiri bawah layar), "samping" = sisi +x (kanan bawah).
// userData.depanPintu: titik lokal di depan pintu (tujuan figur yang masuk). Ubah ke dunia: rumah.localToWorld(v.clone()).
// Keadaan bawaan kit: "abu" (dinding abu, atap dan pintu abuGelap), "denyut" (tepi dinding dan kusen pintu),
// "emas" (bagian.emas, bawaan dinding dan pintu).
export function rumah(opsi = {}) {
  const {
    lebar = 1.8, tinggi = 1.2, dalam = 1.6, atap = 0.7, pintu = "depan", geserPintu = -0.4, lebarPintu = 0.4, tinggiPintu = 0.7,
    warnaDinding = W.zamrudRedup, warnaAtap = W.pelat, warnaPintu = W.pelat, nama = "komisariat", penting = true,
  } = opsi;
  const g = new THREE.Group();
  const matDinding = bahanPadat(warnaDinding);
  const matAtap = bahanPadat(warnaAtap);
  const matPintu = bahanPadat(warnaPintu);
  matAtap.userData.warnaAbu = W.abuGelap;
  matPintu.userData.warnaAbu = W.abuGelap;

  const dinding = kotakBulat(lebar, tinggi, dalam, matDinding, { alas: true });
  g.add(dinding);
  const lebih = 0.08;
  const s = new THREE.Shape();
  s.moveTo(-dalam / 2 - lebih, 0); s.lineTo(dalam / 2 + lebih, 0); s.lineTo(0, atap); s.closePath();
  const geoAtap = new THREE.ExtrudeGeometry(s, { depth: lebar + 0.12, bevelEnabled: false })
    .rotateY(Math.PI / 2).translate(-(lebar + 0.12) / 2, tinggi, 0);
  const mAtap = new THREE.Mesh(geoAtap, matAtap);
  mAtap.castShadow = mAtap.receiveShadow = true;
  g.add(mAtap);

  const mPintu = kotakBulat(lebarPintu, tinggiPintu, 0.05, matPintu, { radius: 0.02, alas: true });
  const depanPintu = new THREE.Vector3();
  if (pintu === "samping") {
    mPintu.position.set(lebar / 2 + 0.02, 0, -geserPintu);
    mPintu.rotation.y = Math.PI / 2;
    depanPintu.set(lebar / 2 + 0.45, 0, -geserPintu);
  } else {
    mPintu.position.set(geserPintu, 0, dalam / 2 + 0.02);
    depanPintu.set(geserPintu, 0, dalam / 2 + 0.45);
  }
  g.add(mPintu);

  // Garis tepi denyut cermin (tersembunyi sampai keadaan "denyut" > 0).
  const matDenyut = bahanGaris(W.zamrudPijar, 3, 0);
  const tepiDinding = garisTepi({ w: lebar, h: tinggi, d: dalam, alas: true }, { bahan: matDenyut });
  const tepiPintu = garisTepi({ w: lebarPintu, h: tinggiPintu, d: 0.05, alas: true }, { bahan: matDenyut });
  tepiPintu.position.copy(mPintu.position);
  tepiPintu.rotation.copy(mPintu.rotation);
  tepiDinding.visible = tepiPintu.visible = false;
  g.add(tepiDinding, tepiPintu);

  g.userData = {
    nama, penting, depanPintu,
    bagian: { dinding, atap: mAtap, pintu: mPintu, tepi: [tepiDinding, tepiPintu], denyut: [dinding, mPintu], emas: [dinding, mPintu] },
  };
  return g;
}
export const komisariat = rumah;
