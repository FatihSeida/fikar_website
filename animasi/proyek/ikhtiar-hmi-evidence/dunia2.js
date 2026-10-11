// Adegan 5–9: estafet, distorsi, rutinisasi karisma, ujian lima lapis, penutup.
import * as THREE from "three";
import {
  scene, W, warna, bahan, balok, sprite, bahanAditif, ruas, aturRuas, titikUV, kanvasTeks, FONT,
  klem, campur, rentang, halus, keluar3, lenting, masukKeluar3,
} from "./dasar.js";
import { buatPion, warnaiPion, buatRumah, kusamkanRumah, TINGGI_PION } from "./benda.js";
import {
  buatGerbangLK, buatKursi, buatMeja, SLOT_FORUM, buatLembarCetakBiru, buatRangka, LEMPENG, buatLempeng,
  buatKartu, buatCabang, buatMenara, bahanGaris,
} from "./benda2.js";
import { POS_KOLAM, JAKET_PENDIRI } from "./dunia1.js";
import {
  TATA, JAKET, dariUV, N_ESTAFET, STASIUN, T_SERAH, T_LEPAS_KOLAM, LAMA_JALAN, MAJU, LAMA_JALAN_AKHIR, MAJU_AKHIR, RUMAH,
  T_MASUK_PINTU, T_GERBANG_UBAH, T_CAP, T_TEKAN, T_KURSI, T_LARUT, T_RANGKA, T_LEMPENG, LAMA_JATUH, LAPIS,
  T_KARTU, T_CEK, T_LOLOS, T_PUDAR, T_MENARA, T_KEPUTUSAN, T_GARIS,
} from "./isyarat.js";

const ARAH_V = new THREE.Vector3(Math.SQRT1_2, 0, Math.SQRT1_2);  // turun di layar
const ARAH_U = new THREE.Vector3(Math.SQRT1_2, 0, -Math.SQRT1_2); // ke kanan di layar
const HADAP_TURUN = Math.PI / 4, HADAP_NAIK = -3 * Math.PI / 4;
const _a = new THREE.Vector3(), _b = new THREE.Vector3();

// ---------------------------------------------------------------- jalan garis waktu
const [V0, V1] = TATA.JALAN;
const PANJANG_JALAN = V1 - V0;
const jalan = new THREE.Group();
{
  const alas = balok(PANJANG_JALAN, 0.04, 0.95, 0.015, bahan(warna("hsl(153, 24%, 13%)"), { roughness: 0.85 }));
  alas.position.set(PANJANG_JALAN / 2, 0.02, 0);
  jalan.add(alas);
  const mTik = new THREE.MeshBasicMaterial({ color: warna("hsl(153, 25%, 30%)") });
  for (let s = 0.5; s < PANJANG_JALAN; s += 0.69) {
    const panjang = Math.round(s / 0.69) % 5 === 0 ? 0.62 : 0.3;
    const tik = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.01, panjang), mTik);
    tik.position.set(s, 0.045, 0.47 - panjang / 2 - 0.03);
    jalan.add(tik);
  }
}
jalan.position.copy(titikUV(0, V0));
jalan.rotation.y = -Math.PI / 4; // sumbu x lokal → arah turun di layar
scene.add(jalan);
const bahanJejak = bahanAditif(W.zamrudPijar.clone().multiplyScalar(1.4), 0.9);
const jejak = ruas(bahanJejak, 0.07);
scene.add(jejak);

// ---------------------------------------------------------------- estafet
const pembawa = Array.from({ length: N_ESTAFET }, (_, k) => {
  const p = buatPion(JAKET[[3, 0, 8, 4, 2, 7, 1][k]]);
  scene.add(p);
  const bara = sprite(W.emas, 0.42);
  scene.add(bara);
  return { p, bara, sisi: k % 2 ? -1 : 1 };
});
const titikEmas = new THREE.Group();
titikEmas.add(new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 12), new THREE.MeshBasicMaterial({ color: W.emasPijar.clone().multiplyScalar(2.2) })), sprite(W.emas, 1.35));
scene.add(titikEmas);
// Posisi pembawa k pada detik t (u, v) dan arah hadapnya.
function keadaanPembawa(k, t) {
  const t0 = T_SERAH[k];
  const akhir = k === N_ESTAFET - 1;
  const lama = akhir ? LAMA_JALAN_AKHIR : LAMA_JALAN, maju = akhir ? MAJU_AKHIR : MAJU;
  const j = klem((t - t0) / lama);
  const v = STASIUN[k] + maju * j;
  const minggir = halus(rentang(t, t0 + lama + 0.05, t0 + lama + 0.45));
  const u = 0.62 * minggir * (k % 2 ? -1 : 1);
  const hadap = t < t0 ? HADAP_NAIK : campur(HADAP_NAIK + Math.PI * 2, HADAP_TURUN + Math.PI * 2, halus(rentang(t, t0, t0 + 0.16)));
  const bob = j > 0 && j < 1 ? Math.abs(Math.sin(Math.PI * 2 * j)) * 0.05 : 0;
  return { u, v, hadap, bob };
}
function tanganPembawa(k, t, out) {
  const s = keadaanPembawa(k, t);
  const p = dariUV(s.u, s.v);
  return out.set(p.x + Math.sin(s.hadap) * 0.26, 0.5 + s.bob, p.z + Math.cos(s.hadap) * 0.26);
}

// ---------------------------------------------------------------- rumah komisariat
const rumah = RUMAH.map((h) => {
  const r = buatRumah(h.lebar, h.tinggi);
  r.position.copy(titikUV(h.u, h.v));
  r.rotation.y = h.u < 0 ? Math.PI / 2 : 0; // pintu menghadap jalan dan kamera
  scene.add(r);
  return { r, h };
});

// ---------------------------------------------------------------- gerbang LK, antrean figur, piramida, meja forum
const gerbang = buatGerbangLK();
gerbang.position.copy(titikUV(0, TATA.GERBANG_LK));
gerbang.rotation.y = Math.PI / 4;
scene.add(gerbang);
const SLOT = 1.26;
function gAntrean(t) {
  t = Math.min(t, 39.6);
  if (t < T_CAP[0]) return (t - T_CAP[0]) / 0.92;
  let j = 0;
  while (j + 1 < T_CAP.length && t >= T_CAP[j + 1]) j++;
  return j + masukKeluar3(rentang(t, T_CAP[j] + 0.2, T_CAP[j] + 0.75));
}
const antrean = Array.from({ length: 5 }, (_, j) => {
  const p = buatPion(JAKET[[5, 9, 11, 6, 10][j]]);
  const tanda = new THREE.Mesh(new THREE.CircleGeometry(0.09, 20).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: W.abuGelap.clone(), roughness: 0.9 }));
  tanda.position.y = TINGGI_PION + 0.004;
  p.userData.tubuh.add(tanda);
  scene.add(p);
  return { p, tanda };
});
const piramida = [];
{
  const pusat = titikUV(TATA.PIRAMIDA.u, TATA.PIRAMIDA.v);
  const susunan = [[-0.62, 0, 0], [0, 0, 0], [0.62, 0, 0], [-0.31, 1, 0], [0.31, 1, 0], [0, 2, 1]];
  susunan.forEach(([du, baris, atas], i) => {
    const p = buatPion(atas ? "hsl(160, 12%, 15%)" : JAKET[[0, 4, 2, 9, 3][i % 5]]);
    p.rotation.y = HADAP_TURUN;
    scene.add(p);
    piramida.push({ p, du, baris, atas, pusat });
  });
}
const meja = buatMeja();
meja.position.copy(titikUV(TATA.FORUM.u, TATA.FORUM.v));
scene.add(meja);
const SLOT_AWAL = [0, 1, 2, 4, 5, 6];
const kursi = SLOT_AWAL.map(() => { const k = buatKursi(); scene.add(k); return k; });
function slotPos(s, out) {
  const n = SLOT_FORUM.length;
  const a = ((Math.floor(s) % n) + n) % n, b = (a + 1) % n, f = s - Math.floor(s);
  const pa = SLOT_FORUM[a], pb = SLOT_FORUM[b];
  return out.set(campur(pa[0], pb[0], f), 0, campur(pa[1], pb[1], f));
}

// ---------------------------------------------------------------- fondasi: pendiri, cetak biru, lempeng, rangka, kartu
const POS_FONDASI = titikUV(TATA.FONDASI.u, TATA.FONDASI.v);
const pendiri2 = buatPion(JAKET_PENDIRI);
pendiri2.position.copy(POS_FONDASI);
pendiri2.rotation.y = HADAP_TURUN;
scene.add(pendiri2);
const lembar = buatLembarCetakBiru(3.2);
lembar.position.copy(POS_FONDASI).setY(0.012);
scene.add(lembar);
const N_SERPIH = 46;
const serpih = Array.from({ length: N_SERPIH }, (_, i) => {
  const s = sprite(i % 3 ? warna("hsl(170, 60%, 70%)") : W.zamrudPijar, 0.32);
  scene.add(s);
  const a = i * 2.399, r = 0.35 + 1.15 * Math.sqrt((i + 0.5) / N_SERPIH);
  return { s, ke: new THREE.Vector3(Math.cos(a) * r, 0.03, Math.sin(a) * r), y0: 0.1 + 0.75 * ((i * 37) % N_SERPIH) / N_SERPIH, tunda: 0.25 * ((i * 13) % N_SERPIH) / N_SERPIH };
});
const lempeng = LEMPENG.map((_, k) => { const g = buatLempeng(k); g.position.copy(POS_FONDASI); scene.add(g); return g; });
const TINGGI_FONDASI = LEMPENG.reduce((s, l) => s + l.tebal, 0);
// Nama lapis tercetak di muka depan-kanan (+x) tiap lempeng.
const labelLempeng = LEMPENG.map((l, k) => {
  const { c, g, tx } = kanvasTeks(1024, 96);
  g.fillStyle = "hsl(42, 33%, 94%)";
  g.font = `700 66px ${FONT.sans}`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(l.nama, 512, 50);
  tx.needsUpdate = true;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(l.lebar * 0.9, l.lebar * 0.9 * 96 / 1024), new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, color: W.krem.clone() }));
  m.rotation.y = Math.PI / 2;
  m.position.set(l.lebar / 2 + 0.012, l.tebal * 0.5, 0);
  lempeng[k].add(m);
  return m;
});
const bahanRangka = bahanGaris(W.zamrudPijar.clone().multiplyScalar(1.5), 2.6, 1);
const rangka = buatRangka(1.15, 0.85, 0.62, bahanRangka);
rangka.position.copy(POS_FONDASI).add(new THREE.Vector3(-0.42, TINGGI_FONDASI, -0.42));
scene.add(rangka);
const kartu = [buatKartu("lolos"), buatKartu("ramai")];
const POS_KARTU = [new THREE.Vector3(0.62, 0, -0.05), new THREE.Vector3(-0.05, 0, 0.62)];
kartu.forEach((k) => { k.rotation.y = Math.PI / 4; k.scale.setScalar(0.82); scene.add(k); });

// ---------------------------------------------------------------- penutup: cabang, menara PB, garis emas
const cabang = buatCabang();
cabang.position.copy(titikUV(TATA.CABANG.u, TATA.CABANG.v));
scene.add(cabang);
const menara = buatMenara();
menara.position.copy(titikUV(TATA.MENARA.u, TATA.MENARA.v));
menara.rotation.y = Math.PI / 2;
scene.add(menara);

// Jalur garis emas: menara → cabang → komisariat → fondasi → ruang kuliah 1947 (titik henti = T_GARIS).
const rumahJalur = rumah.filter(({ h }) => h.u < 0 && h.u > -3 && h.v > 9.5 && h.v < 12).sort((a, b) => a.h.v - b.h.v)[0];
function uvY(u, v, y = 0.06) { return titikUV(u, v, y); }
const pintuRumah = rumahJalur.r.position.clone().add(new THREE.Vector3(rumahJalur.h.lebar / 2 + 0.12, 0.06, 0));
const pM = menara.position, pC = cabang.position, pF = POS_FONDASI;
const BAGIAN = [
  [new THREE.Vector3(pM.x, 5.38, pM.z), new THREE.Vector3(pM.x + 0.62, 4.9, pM.z), new THREE.Vector3(pM.x + 0.62, 0.36, pM.z), new THREE.Vector3(pM.x + 1.05, 0.06, pM.z),
    uvY(0.15, TATA.MENARA.v - 0.6), uvY(0.15, TATA.CABANG.v + 0.9), uvY(TATA.CABANG.u - 0.35, TATA.CABANG.v + 1.0), new THREE.Vector3(pC.x, 0.06, pC.z + 0.8)],
  [new THREE.Vector3(pC.x, 0.06, pC.z + 0.8), uvY(0.15, TATA.CABANG.v - 0.2), uvY(0.15, rumahJalur.h.v + 0.9), pintuRumah],
  [pintuRumah, uvY(-0.15, rumahJalur.h.v - 0.8), uvY(-0.15, 6.0), uvY(TATA.FONDASI.u - 2.0, TATA.FONDASI.v + 2.1),
    new THREE.Vector3(pF.x + 1.55, 0.06, pF.z + 1.55), new THREE.Vector3(pF.x + 0.6, TINGGI_FONDASI + 0.04, pF.z + 0.6), new THREE.Vector3(pF.x, TINGGI_FONDASI + 0.04, pF.z)],
  [new THREE.Vector3(pF.x, TINGGI_FONDASI + 0.04, pF.z), new THREE.Vector3(pF.x - 1.0, TINGGI_FONDASI + 0.04, pF.z - 0.1), new THREE.Vector3(pF.x - 1.55, 0.06, pF.z - 0.1),
    new THREE.Vector3(2.6, 0.18, 1.0), new THREE.Vector3(1.2, 0.18, 0.6), new THREE.Vector3(POS_KOLAM.x + 0.2, 0.18, 0.15), new THREE.Vector3(POS_KOLAM.x, 0.18, 0)],
];
const titikGaris = [], tGaris = [];
BAGIAN.forEach((bag, b) => {
  const panjang = [0];
  for (let i = 1; i < bag.length; i++) panjang.push(panjang[i - 1] + bag[i].distanceTo(bag[i - 1]));
  bag.forEach((p, i) => {
    if (b > 0 && i === 0) return;
    titikGaris.push(p);
    tGaris.push(b + panjang[i] / panjang[panjang.length - 1]); // posisi dalam "nomor bagian"
  });
});
const bahanGarisEmas = new THREE.MeshBasicMaterial({ color: W.emas.clone().multiplyScalar(1.3) });
const ruasEmas = titikGaris.slice(1).map(() => { const m = ruas(bahanGarisEmas, 0.062); scene.add(m); return m; });
const kepalaGaris = sprite(W.emas, 1.5);
scene.add(kepalaGaris);
const SINGGAH = [new THREE.Vector3(pC.x, 0.07, pC.z + 0.8), pintuRumah.clone().setY(0.07), new THREE.Vector3(pF.x, TINGGI_FONDASI + 0.05, pF.z), POS_KOLAM.clone().setY(0.2)];
const cincinSinggah = SINGGAH.map((p) => {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.58, 64).rotateX(-Math.PI / 2), bahanAditif(W.emasPijar.clone().multiplyScalar(1.6), 0));
  m.position.copy(p);
  scene.add(m);
  return m;
});
// Kemajuan garis dalam "nomor bagian" (0..4) pada detik t: melambat di tiap titik singgah.
export function kemajuanGaris(t) {
  for (let b = 0; b < 4; b++) if (t < T_GARIS[b + 1]) return b + masukKeluar3(rentang(t, T_GARIS[b], T_GARIS[b + 1]));
  return 4;
}
export function titikPadaGaris(g, out) {
  if (g <= 0) return out.copy(titikGaris[0]);
  for (let i = 1; i < titikGaris.length; i++) if (g <= tGaris[i]) {
    const f = (g - tGaris[i - 1]) / (tGaris[i] - tGaris[i - 1] || 1);
    return out.copy(titikGaris[i - 1]).lerp(titikGaris[i], f);
  }
  return out.copy(titikGaris[titikGaris.length - 1]);
}

// ---------------------------------------------------------------- pembaruan per detik
export function perbaruiDunia2(t) {
  // Jalan tumbuh dari depan ruang kuliah; jejak zamrud mengikuti titik emas.
  const tj = keluar3(rentang(t, 26.7, 27.7));
  jalan.visible = tj > 0.001;
  jalan.scale.set(Math.max(tj, 0.001), 1, 1);
  const vt = vTitikGambar(t);
  aturRuas(jejak, titikUV(0, V0, 0.05), titikUV(0, Math.max(V0, vt), 0.05), 1);
  jejak.visible = t > T_SERAH[0] && vt > V0;

  // Pembawa titik emas.
  pembawa.forEach((x, k) => {
    const muncul = lenting(rentang(t, 26.9 + 0.08 * k, 27.3 + 0.08 * k), 1.6);
    x.p.visible = muncul > 0.001;
    x.bara.visible = false;
    if (!x.p.visible) return;
    const s = keadaanPembawa(k, t);
    x.p.position.copy(titikUV(s.u, s.v, s.bob));
    x.p.rotation.y = s.hadap;
    x.p.scale.setScalar(Math.max(muncul, 0.001));
    const pegang = t >= T_SERAH[k] ? Math.exp(-(t - T_SERAH[k]) * 3) : 0;
    warnaiPion(x.p, { nyala: 0.6 * pegang });
    const sudahLepas = k + 1 < N_ESTAFET && t > T_SERAH[k + 1];
    if (sudahLepas) { // bara emas kecil tetap di dada pembawa
      x.bara.visible = true;
      x.bara.position.copy(x.p.position).add(new THREE.Vector3(Math.sin(s.hadap) * 0.2, 0.45, Math.cos(s.hadap) * 0.2));
      x.bara.material.opacity = 0.55 + 0.25 * Math.sin(t * 3 + k);
    }
  });
  // Titik emas: naik dari sorotan ruang kuliah, berpindah tangan, lalu tinggal di pembawa terakhir.
  titikEmas.visible = t >= T_LEPAS_KOLAM && t < T_MASUK_PINTU;
  titikEmas.scale.setScalar(1);
  if (titikEmas.visible) {
    if (t < T_SERAH[0]) {
      const k = halus(rentang(t, T_LEPAS_KOLAM, T_SERAH[0]));
      tanganPembawa(0, T_SERAH[0], _b);
      titikEmas.position.copy(POS_KOLAM).setY(0.5).lerp(_b, k);
      titikEmas.position.y += 1.4 * Math.sin(Math.PI * k);
    } else {
      let k = 0;
      while (k + 1 < N_ESTAFET && t >= T_SERAH[k + 1]) k++;
      const lepas = T_SERAH[k] + LAMA_JALAN;
      if (k + 1 < N_ESTAFET && t > lepas) {
        const f = halus(rentang(t, lepas, T_SERAH[k + 1]));
        tanganPembawa(k, t, _a); tanganPembawa(k + 1, T_SERAH[k + 1], _b);
        titikEmas.position.copy(_a).lerp(_b, f);
        titikEmas.position.y += 0.32 * Math.sin(Math.PI * f);
      } else if (k === N_ESTAFET - 1 && t > T_SERAH[k] + LAMA_JALAN_AKHIR) { // melompat masuk ke pintu LK
        const f = halus(rentang(t, T_SERAH[k] + LAMA_JALAN_AKHIR, T_MASUK_PINTU));
        tanganPembawa(k, T_SERAH[k] + LAMA_JALAN_AKHIR, _a);
        _b.copy(titikUV(0, TATA.GERBANG_LK, 1.0));
        titikEmas.position.copy(_a).lerp(_b, f);
        titikEmas.position.y += 0.45 * Math.sin(Math.PI * f);
        titikEmas.scale.setScalar(1 - 0.5 * f);
      } else tanganPembawa(k, t, titikEmas.position);
    }
  }

  // Rumah komisariat tumbuh, lalu sebagian kusam.
  for (const { r, h } of rumah) {
    const k = lenting(rentang(t, h.tTumbuh, h.tTumbuh + 0.45), 1.5);
    r.visible = k > 0.001;
    r.userData.isi.scale.set(1, Math.max(k, 0.001), 1);
    const kusam = h.tKusam ? halus(rentang(t, h.tKusam, h.tKusam + 0.7)) : 0;
    kusamkanRumah(r, kusam, 1);
    r.userData.isi.scale.y *= 1 - 0.05 * kusam;
  }

  // Gerbang LK: pintu yang menyala, lalu berubah menjadi gerbang cap.
  const gb = gerbang.userData;
  const ag = lenting(rentang(t, 31.3, 31.85), 1.4);
  gerbang.visible = ag > 0.001;
  gerbang.scale.set(1, Math.max(ag, 0.001), 1);
  const ubah = halus(rentang(t, T_GERBANG_UBAH[0], T_GERBANG_UBAH[1]));
  gb.mRangka.color.copy(gb.asal).lerp(W.abu, ubah);
  gb.daun.scale.y = Math.max(0.02, 1 - ubah);
  gb.mPintu.emissiveIntensity = 0.35 * (1 - ubah);
  const masuk = t >= T_MASUK_PINTU ? Math.exp(-(t - T_MASUK_PINTU) * 5) : 0;
  gb.mPortal.color.copy(W.zamrudPijar).lerp(W.emasPijar, masuk);
  gb.mPortal.opacity = (0.12 + 0.5 * masuk) * ag * (1 - ubah);
  const turunMesin = lenting(rentang(t, T_GERBANG_UBAH[0] + 0.3, T_GERBANG_UBAH[1] + 0.1), 1.3);
  gb.mesin.visible = turunMesin > 0.001;
  gb.mesin.position.y = 1.4 * (1 - turunMesin);
  gb.papan.material.emissiveIntensity = 0.25 * (1 - 0.7 * ubah);
  let tekanCap = 0;
  for (const tc of T_CAP) {
    const d = t - tc;
    if (d > -0.14 && d < 0) tekanCap = Math.max(tekanCap, masukKeluar3(1 + d / 0.14));
    else if (d >= 0 && d < 0.32) tekanCap = Math.max(tekanCap, 1 - halus(d / 0.32));
  }
  gb.stempel.position.y = campur(1.5, TINGGI_PION + 0.02, tekanCap);

  // Antrean figur melewati gerbang cap.
  const g = gAntrean(t);
  antrean.forEach((x, j) => {
    const v = TATA.GERBANG_LK + SLOT * (g - j);
    const muncul = halus(rentang(t, 33.3 + 0.1 * j, 33.8 + 0.1 * j));
    const keluar = halus(rentang(v, 18.6, 19.4));
    x.p.visible = muncul > 0.001 && v > 7.5 && keluar < 0.999;
    if (!x.p.visible) return;
    const geser = (g - j) - Math.floor(g - j);
    x.p.position.copy(titikUV(0, v, 0.04 * Math.abs(Math.sin(Math.PI * 2 * geser))));
    x.p.rotation.y = HADAP_TURUN;
    const dicap = t >= T_CAP[j];
    const kejut = dicap ? Math.exp(-(t - T_CAP[j]) * 9) : 0;
    x.p.userData.tubuh.scale.set(1 + 0.08 * kejut, 1 - 0.14 * kejut, 1 + 0.08 * kejut);
    x.tanda.visible = dicap;
    warnaiPion(x.p, { abu: dicap ? 0.55 * halus(rentang(t, T_CAP[j], T_CAP[j] + 0.4)) : 0, opasitas: muncul * (1 - keluar) });
  });

  // Piramida figur: yang di puncak menekan yang di bawah.
  let tekan = 0;
  for (const tt of T_TEKAN) {
    const d = t - tt;
    if (d > -0.25 && d < 0) tekan = Math.max(tekan, halus(1 + d / 0.25));
    else if (d >= 0) tekan = Math.max(tekan, Math.exp(-d * 3.2));
  }
  const ap = lenting(rentang(t, 32.9, 33.6), 1.4);
  const remas = [1 - 0.1 * tekan, 1 - 0.13 * tekan, 1];
  piramida.forEach((x, i) => {
    x.p.visible = ap > 0.001;
    let y = 0;
    for (let b = 0; b < x.baris; b++) y += TINGGI_PION * remas[b];
    y = y * ap + (x.atas ? -0.05 * tekan : 0);
    x.p.position.copy(x.pusat).addScaledVector(ARAH_U, x.du).setY(y);
    x.p.scale.set(Math.max(ap, 0.001), Math.max(ap, 0.001), Math.max(ap, 0.001));
    x.p.userData.tubuh.scale.set(1 + (1 - remas[x.baris]) * 0.5, remas[x.baris], 1 + (1 - remas[x.baris]) * 0.5);
    if (x.atas) x.p.scale.multiplyScalar(1.08);
    warnaiPion(x.p, { redup: x.atas ? 0 : 0.25 + 0.2 * tekan, abu: x.atas ? 0 : 0.35 });
  });

  // Meja forum: hanya kursi yang berpindah tempat.
  const am = lenting(rentang(t, 32.9, 33.5), 1.4);
  meja.visible = am > 0.001;
  meja.scale.set(1, Math.max(am, 0.001), 1);
  const geserKursi = masukKeluar3(rentang(t, T_KURSI[0][0], T_KURSI[0][1])) + 2 * masukKeluar3(rentang(t, T_KURSI[1][0], T_KURSI[1][1]));
  kursi.forEach((k, i) => {
    k.visible = am > 0.001;
    slotPos(SLOT_AWAL[i] + geserKursi, _a);
    k.position.copy(meja.position).add(_a);
    k.rotation.y = Math.atan2(-_a.x, -_a.z); // dudukan menghadap meja, sandaran menjauhi meja
    k.scale.setScalar(Math.max(am, 0.001));
  });

  // Pendiri larut menjadi cetak biru.
  const larut = rentang(t, T_LARUT[0], T_LARUT[1]);
  const hadir2 = halus(rentang(t, 38.9, 39.4));
  pendiri2.visible = hadir2 > 0.001 && larut < 0.6;
  warnaiPion(pendiri2, { nyala: 0.35 + 0.5 * larut, opasitas: hadir2 * (1 - halus(larut / 0.55)) });
  pendiri2.scale.set(1 + 0.25 * larut, Math.max(1 - 0.6 * larut, 0.001), 1 + 0.25 * larut);
  lembar.material.uniforms.uBuka.value = keluar3(rentang(t, T_LARUT[0] + 0.25, T_LARUT[1] + 0.25)) * 1.05;
  lembar.visible = t > T_LARUT[0];
  serpih.forEach((x) => {
    const k = rentang(t, T_LARUT[0] + x.tunda, T_LARUT[0] + x.tunda + 0.75);
    x.s.visible = k > 0 && k < 1;
    if (!x.s.visible) return;
    _a.set(0, x.y0, 0).lerp(x.ke, masukKeluar3(k)).add(POS_FONDASI);
    _a.y += 0.5 * Math.sin(Math.PI * k);
    x.s.position.copy(_a);
    x.s.material.opacity = Math.sin(Math.PI * k);
  });

  // Lima lempeng turun satu per satu.
  let tinggiTumpuk = 0;
  const nyalaCek = [];
  lempeng.forEach((l, k) => {
    const tk = T_LEMPENG[k];
    const jatuh = rentang(t, tk - LAMA_JATUH, tk);
    const pantul = t >= tk ? Math.exp(-(t - tk) * 9) * Math.sin((t - tk) * 30) * 0.05 : 0;
    l.visible = jatuh > 0;
    l.position.y = tinggiTumpuk + 3.6 * (1 - jatuh * jatuh) + pantul;
    tinggiTumpuk += LEMPENG[k].tebal;
    const cek = halus(rentang(t, T_CEK[k], T_CEK[k] + 0.12));
    const kejut = t >= T_CEK[k] ? Math.exp(-(t - T_CEK[k]) * 4) : 0;
    const akhir = 1 - 0.45 * halus(rentang(t, 49.8, 50.8));
    nyalaCek.push(cek);
    l.userData.m.emissiveIntensity = (0.1 * cek + 0.45 * kejut) * akhir + (t >= tk ? 0.2 * Math.exp(-(t - tk) * 5) : 0);
    l.userData.tepi.material.opacity = 0.35 + 0.4 * cek * akhir;
    l.userData.tepi.material.color.copy(W.zamrud).lerp(W.zamrudPijar.clone().multiplyScalar(1.5), cek);
    labelLempeng[k].material.color.copy(W.krem).multiplyScalar(0.85 + 0.6 * kejut);
  });

  // Rangka bangunan berdiri di atas fondasi.
  const rk = keluar3(rentang(t, T_RANGKA[0], T_RANGKA[1]));
  rangka.visible = rk > 0.001;
  rangka.scale.set(1, Math.max(rk, 0.001), 1);
  bahanRangka.opacity = 0.95;

  // Kartu program kerja: meluncur ke atas fondasi, diperiksa lima lapis.
  kartu.forEach((k, i) => {
    const [a, b] = T_KARTU[i];
    const m = keluar3(rentang(t, a, b));
    k.visible = m > 0.001;
    const asal = POS_KARTU[i].clone().addScaledVector(i ? new THREE.Vector3(-1, 0, 0) : new THREE.Vector3(0, 0, -1), -2.6 * (1 - m));
    k.position.copy(POS_FONDASI).add(asal).setY(TINGGI_FONDASI);
    const d = k.userData;
    if (i === 0) {
      const n = T_CEK.filter((tc) => t >= tc + 0.05).length;
      const emas = halus(rentang(t, T_LOLOS, T_LOLOS + 0.45));
      const kilat = t >= T_LOLOS ? Math.exp(-(t - T_LOLOS) * 2.5) : 0;
      d.gambar(n, emas);
      d.mBingkai.color.copy(warna("hsl(153, 30%, 16%)")).lerp(W.emas, emas);
      d.mBingkai.emissiveIntensity = 0.45 * emas + 0.6 * kilat;
      d.mMuka.emissiveIntensity = 0.12 + 0.2 * emas + 0.3 * kilat;
      d.pijar.material.opacity = 0.8 * emas;
      d.papan.position.y = 0.72 + 0.08 * Math.sin(Math.PI * rentang(t, T_LOLOS - 0.1, T_LOLOS + 0.5));
    } else {
      const p = halus(rentang(t, T_PUDAR[0], T_PUDAR[1]));
      d.gambar(0, 0);
      d.mMuka.color.setRGB(1, 1, 1).lerp(W.abu, p);
      d.mMuka.emissiveIntensity = 0.12 * (1 - p);
      d.mMuka.opacity = 1 - 0.6 * p;
      d.mBingkai.color.copy(warna("hsl(153, 30%, 16%)")).lerp(W.abuGelap, p);
      k.position.y -= 0.15 * p;
    }
  });
  // Penutup: cabang dan menara PB berdiri, titik keputusan menyala, garis emas ditarik mundur.
  const am2 = lenting(rentang(t, T_MENARA[0], T_MENARA[1]), 1.3);
  cabang.visible = menara.visible = am2 > 0.001;
  cabang.scale.set(1, Math.max(am2, 0.001), 1);
  menara.scale.set(1, Math.max(lenting(rentang(t, T_MENARA[0] + 0.12, T_MENARA[1] + 0.12), 1.3), 0.001), 1);
  const md = menara.userData;
  const kp = halus(rentang(t, T_KEPUTUSAN - 0.1, T_KEPUTUSAN + 0.1));
  const kilatK = t >= T_KEPUTUSAN ? Math.exp(-(t - T_KEPUTUSAN) * 3) : 0;
  md.titik.visible = kp > 0.001;
  md.titik.scale.setScalar(Math.max(kp, 0.001) * (1 + 0.6 * kilatK));
  md.pijar.material.opacity = kp * (0.75 + 0.5 * kilatK);
  md.pijar.scale.setScalar(1.8 + 2.2 * kilatK);
  const gk = kemajuanGaris(t);
  const tampakGaris = t >= T_GARIS[0];
  ruasEmas.forEach((m, i) => {
    if (!tampakGaris) { m.visible = false; return; }
    const g0 = tGaris[i], g1 = tGaris[i + 1];
    aturRuas(m, titikGaris[i], titikGaris[i + 1], klem((gk - g0) / (g1 - g0 || 1)));
    if (gk < g0) m.visible = false;
  });
  kepalaGaris.visible = tampakGaris;
  if (tampakGaris) {
    titikPadaGaris(gk, kepalaGaris.position);
    kepalaGaris.material.opacity = gk < 4 ? 1 : Math.exp(-(t - T_GARIS[4]) * 1.5);
  }
  bahanGarisEmas.color.copy(W.emas).multiplyScalar(1.3 + 0.5 * (t >= T_GARIS[4] ? Math.exp(-(t - T_GARIS[4]) * 2) : 0));
  cincinSinggah.forEach((m, i) => {
    const d = t - T_GARIS[i + 1];
    m.visible = d >= 0 && d < 1.2;
    if (!m.visible) return;
    const k = keluar3(d / 1.2);
    m.scale.setScalar(0.6 + (i === 3 ? 3.2 : 1.6) * k);
    m.material.opacity = 0.9 * (1 - k);
  });
}
// v titik emas untuk jejak jalan (dari keadaan gambar, bukan isyarat).
function vTitikGambar(t) {
  if (t < T_SERAH[0]) return V0;
  let k = 0;
  while (k + 1 < N_ESTAFET && t >= T_SERAH[k + 1]) k++;
  return keadaanPembawa(k, t).v;
}
export { POS_FONDASI, TINGGI_FONDASI, menara, cabang, kartu, gerbang };
