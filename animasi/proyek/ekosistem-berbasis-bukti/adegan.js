// Reels 62 detik: "Mewujudkan HMI dengan Ekosistem Berbasis Bukti". Semua keadaan dihitung dari t.
// Kontrak halaman: lihat animasi/README.md. Waktu peristiwa dibaca dari isyarat.js (sama dengan suara.mjs).
import * as THREE from "three";
import {
  ISO, klem, campur, rentang, halus, keluar3, masukKeluar3, lenting, titik, $, composer, matahari, ARAH_CAHAYA, kamera,
  keadaan, aturKamera, kameraDariFase, buatLabel, taruh, gambarSemuaTekstur, BATAS,
} from "./alat.js";
import { DURASI, T, KETERANGAN } from "./isyarat.js";
import {
  A, B, HB, P_CABANG, P_BADKO, P_PB, lokal, JALAN_FIGUR, KARTU_KE, PUSAT_ORBIT, RING_ORBIT, LABEL_ORBIT, taliOrbit, cincinOrbit,
  lembar, dok, rumahK, SIMPUL, stasiun, bahanTanah,
} from "./dunia.js";
import { gerakA } from "./gerak-a.js";
import { gerakB } from "./gerak-b.js";

// ---------------------------------------------------------------- kamera
const F_LEMARI = lokal(0.25, 1.35, 0.45);
const F_KARTU = KARTU_KE.clone().lerp(JALAN_FIGUR[1], 0.32).setY(1.85);
const F_BUKU = lokal(1.4, 1.2, 0.5);
const F_LEMBAR = PUSAT_ORBIT.clone();
const F_DOK = B.clone().add(titik(0.05, 0.3, 1.15));
const F_RUMAH = HB.clone().add(titik(0, -0.9, 1.0));
const F_PB = P_PB.clone().add(titik(0, 1.0, 2.2));
const F_PB_AKHIR = P_PB.clone().add(titik(0, 1.0, 2.2));
const F_JAUH6 = titik(0, -13.6, 2.3);
const F_RUMAH8 = HB.clone().add(titik(0, 0.2, 0.9));
const F_LEMARI9 = lokal(0.75, 1.3, 0.6);
const F_AKHIR = titik(0, -9.9, 2.6);
const ikut = (t) => { // adegan 6: fokus naik mengikuti gelombang titik emas
  const u = masukKeluar3(rentang(t, 33.3, 36.95));
  return new THREE.Vector3().lerpVectors(F_RUMAH, P_PB.clone().add(titik(0, 2.6, 3.4)), u);
};
const FASE = [
  { t: 0, d: 1, f: (t) => keadaan(F_LEMARI, campur(10.6, 9.7, halus(rentang(t, 0, 8))), ISO, 40, 540, 1040) },
  { t: 7.9, d: 1.1, f: () => keadaan(F_KARTU, 7.6, ISO, 40, 540, 990) },
  { t: 12.85, d: 1.3, f: () => keadaan(F_BUKU, 9.8, ISO, 38, 540, 1030) },
  { t: 18.85, d: 1.25, f: () => keadaan(F_LEMBAR, 8.0, ISO, 45, 540, 975) },
  { t: 24.85, d: 0.9, f: () => keadaan(F_DOK, 8.7, ISO, 45, 540, 975) },
  { t: 31.5, d: 1.7, f: () => keadaan(F_RUMAH, 12.6, ISO, 45, 540, 1080) },
  { t: 33.25, d: 0.4, f: (t) => keadaan(ikut(t), campur(12.6, 13.8, halus(rentang(t, 33.3, 36.9))), ISO, 45, 540, 1080) },
  { t: 37.0, d: 2.2, f: () => keadaan(F_JAUH6, 30, ISO, 45, 540, 1000) },
  { t: 39.5, d: 1.3, f: (t) => keadaan(F_PB, 16.5, ISO, campur(45, 48.5, halus(rentang(t, 40.0, 47.0))), 540, 990) },
  { t: 46.75, d: 1.15, f: () => keadaan(F_RUMAH8, 11.6, ISO, 45, 540, 1150) },
  { t: 50.65, d: 1.1, f: () => keadaan(F_LEMARI9, 11.4, ISO, 40, 540, 1040) },
  { t: T.mundur[0], d: T.mundur[1] - T.mundur[0], f: () => keadaan(F_AKHIR, 41.5, ISO, 45, 540, 905) },
];

// ---------------------------------------------------------------- teks: keterangan dan label
const elKet = [...document.querySelectorAll(".ket")];
const elKalimat = [...elKet[5].querySelectorAll(".kal")];
const elAjakan = $("ajakan");
const elKabut = $("kabut-atas");

const lblOrbit = LABEL_ORBIT.map((n) => buatLabel("lbl-orbit", n));
const lblDok = dok.map((d) => buatLabel("lbl-benda emas", d.nama));
const lblTingkat = ["Komisariat", "Cabang", "Badko", "PB"].map((n, i) => buatLabel("lbl-tingkat" + (i === 3 ? " pb" : ""), n));
const lblStasiun = stasiun.map((s) => buatLabel("lbl-stasiun", s.nama));
const ANGKA = [24, 31, 18, 27, 22];
const lblAngka = ANGKA.map((n) => buatLabel("lbl-angka", `<b>${n}</b><span>kader</span>`));
const lblWaktu = buatLabel("lbl-waktu", "setahun kemudian");
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _arahKam = new THREE.Vector3();

function tampakkanTeks(t) {
  KETERANGAN.forEach(([a, b], i) => {
    const masuk = halus(rentang(t, a, a + 0.3));
    const keluar = halus(rentang(t, b - 0.22, b));
    const el = elKet[i];
    el.style.opacity = String(masuk * (1 - keluar));
    el.style.transform = `translateY(${((1 - masuk) * 16 - keluar * 12).toFixed(1)}px)`;
  });
  // Adegan 6: tiap kalimat menyala saat gelombang titik tiba di tingkatnya.
  elKalimat.forEach((el, i) => {
    const k = halus(rentang(t, T.tingkat[i] - 0.1, T.tingkat[i] + 0.25));
    el.style.opacity = String(0.3 + 0.7 * k);
    el.style.color = i === 3 && k > 0.5 ? "var(--emas-terang)" : "";
  });
  const aAjak = halus(rentang(t, T.ajakan[0], T.ajakan[1]));
  elAjakan.style.opacity = String(aAjak);
  elAjakan.style.transform = `translateY(${((1 - aAjak) * 24).toFixed(1)}px) scale(${(0.94 + 0.06 * lenting(rentang(t, T.ajakan[0], T.ajakan[0] + 0.6))).toFixed(3)})`;
}

// Adegan 4: posisi label orbit dan tali zamrudnya. Dipanggil sebelum render supaya tali tergambar pada frame yang sama.
const orbit = LABEL_ORBIT.map(() => ({ pos: new THREE.Vector3(), a: 0, kedalaman: 1 }));
function orbitLabel(t) {
  _arahKam.set(0, 0, -1).applyQuaternion(kamera.quaternion);
  cincinOrbit.g.updateMatrixWorld(true);
  const aOrbitAkhir = 1 - halus(rentang(t, 24.45, 24.95));
  orbit.forEach((o, i) => {
    const ti = T.labelOrbit[i];
    const sudut = Math.PI * 0.5 + i * Math.PI * 0.5 + 0.42 * (t - T.labelOrbit[0]);
    o.pos.set(Math.cos(sudut) * RING_ORBIT, 0, Math.sin(sudut) * RING_ORBIT).applyMatrix4(cincinOrbit.g.matrixWorld);
    o.kedalaman = halus(-_v2.copy(o.pos).sub(PUSAT_ORBIT).dot(_arahKam) / 0.6 + 0.5);
    o.a = halus(rentang(t, ti, ti + 0.25)) * aOrbitAkhir;
    const tali = taliOrbit[i];
    tali.l.visible = o.a > 0;
    if (o.a > 0) {
      _v2.copy(o.pos).sub(PUSAT_ORBIT).multiplyScalar(0.3).add(PUSAT_ORBIT);
      tali.l.geometry.setPositions([_v2.x, _v2.y, _v2.z, o.pos.x, o.pos.y, o.pos.z]);
      tali.mat.opacity = 0.75 * o.a * (0.4 + 0.6 * o.kedalaman);
    }
  });
}

function tampakkanLabel(t, kam) {
  BATAS.atas = 492;
  // Adegan 4: empat label mengitari lembar bukti (posisi dihitung di orbitLabel sebelum render).
  lblOrbit.forEach((el, i) => {
    const o = orbit[i];
    taruh(el, o.pos, o.a * (0.35 + 0.65 * o.kedalaman), { ay: 0.5, jepit: true, skala: (0.86 + 0.14 * o.kedalaman) * (0.7 + 0.3 * lenting(rentang(t, T.labelOrbit[i], T.labelOrbit[i] + 0.35))) });
  });
  // Adegan 5: nama dokumen di bawah tiap dokumen.
  lblDok.forEach((el, i) => {
    const d = dok[i];
    const a = halus(rentang(t, T.dokKeluar[i] + 0.3, T.dokKeluar[i] + 0.6)) * (1 - halus(rentang(t, T.lipat[0] - 0.2, T.lipat[0] + 0.1)));
    if (a <= 0) { el.style.opacity = "0"; return; }
    d.grup.updateMatrixWorld(true);
    _v.set(0, -d.h / 2 - 0.06, 0).applyMatrix4(d.grup.matrixWorld);
    taruh(el, _v, a, { ay: 0, dy: 12 });
  });
  // Adegan 6: nama tingkat.
  const keluar6 = 1 - halus(rentang(t, 39.4, 39.8));
  const posT = [
    [rumahK[0].grup.position.clone().add(titik(0.6, 0, 2.15)), { ay: 1, dy: -6, jepit: true }],
    [P_CABANG.clone().add(titik(1.35, 0, 1.0)), { ax: 0, ay: 0.5, dx: 18 }],
    [P_BADKO.clone().add(titik(-1.0, 0, 2.6)), { ax: 1, ay: 0.5, dx: -18 }],
    [SIMPUL.pb.clone().add(titik(0.7, 0, 0.15)), { ax: 0, ay: 0.5, dx: 22 }],
  ];
  lblTingkat.forEach((el, i) => {
    const a = halus(rentang(t, T.tingkat[i] - 0.05, T.tingkat[i] + 0.25)) * keluar6;
    taruh(el, posT[i][0], a, { ...posT[i][1], skala: 0.85 + 0.15 * lenting(rentang(t, T.tingkat[i], T.tingkat[i] + 0.4)) });
  });
  // Adegan 7: nama stasiun.
  lblStasiun.forEach((el, i) => {
    const s = stasiun[i];
    const a = halus(rentang(t, T.stasiun[i] + 0.15, T.stasiun[i] + 0.45)) * (1 - halus(rentang(t, 46.7, 47.1)));
    el.classList.toggle("aktif", (s.aktif || 0) > 0.5);
    if (i === 2) { _v.copy(s.pos).add(titik(1.35, 0, 0.5)); taruh(el, _v, a, { ax: 0, ay: 0.5, dx: 10, jepit: true }); }
    else { _v.copy(s.pos).setY(i === 0 ? 1.85 : 2.3); taruh(el, _v, a, { ay: 1, dy: -8, jepit: true }); }
  });
  // Adegan 8: angka ringkasan naik keluar dari kubah.
  lblAngka.forEach((el, i) => {
    const ta = T.angkaNaik[i];
    const u = rentang(t, ta, ta + 1.25);
    const a = halus(u / 0.15) * (1 - halus((u - 0.75) / 0.25)) * (t > ta ? 1 : 0) * (t < 51 ? 1 : 0);
    _v.copy(rumahK[i].atap).setY(1.6 + 2.0 * keluar3(u)).addScaledVector(titik(0, -1, 0), 0.9 * keluar3(u));
    taruh(el, _v, a, { ay: 1, skala: 0.8 + 0.2 * lenting(u / 0.3) });
  });
  // Penutup: penanda waktu.
  const aW = halus(rentang(t, T.setahun, T.setahun + 0.35)) * (1 - halus(rentang(t, 53.3, 53.7)));
  taruh(lblWaktu, lokal(0, 3.35, 0), aW, { ay: 1 });
}

// ---------------------------------------------------------------- kontrak halaman
function tampilkan(t) {
  t = klem(t, 0, DURASI);
  const kam = kameraDariFase(FASE, t);
  aturKamera(kam);
  matahari.target.position.set(kam.fx, 0, kam.fz);
  matahari.position.set(kam.fx, 0, kam.fz).addScaledVector(ARAH_CAHAYA, 50);
  matahari.target.updateMatrixWorld();
  const lebarBayang = Math.max(14, kam.H * 0.75);
  Object.assign(matahari.shadow.camera, { left: -lebarBayang, right: lebarBayang, top: lebarBayang, bottom: -lebarBayang });
  matahari.shadow.camera.updateProjectionMatrix();
  bahanTanah.uniforms.uFokus.value.set(kam.fx, 0, kam.fz);
  bahanTanah.uniforms.uJari.value = kam.H * 1.05;
  gerakA(t, kam);
  gerakB(t, kam);
  orbitLabel(t);
  composer.render();
  tampakkanTeks(t);
  tampakkanLabel(t, kam);
}

window.DURASI = DURASI;
window.tampilkan = tampilkan;
window.siap = (async () => {
  await Promise.all([
    '700 54px "Noto Serif"', 'italic 700 50px "Noto Serif"', '700 100px "Noto Serif"',
    '400 22px "DM Sans"', '500 22px "DM Sans"', '600 38px "DM Sans"', '700 50px "DM Sans"',
    '400 20px "JetBrains Mono"', '500 28px "JetBrains Mono"', '600 22px "JetBrains Mono"', '700 40px "JetBrains Mono"',
  ].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  gambarSemuaTekstur();
  tampilkan(0);
})();

const prm = new URLSearchParams(location.search);
if (!prm.has("rekam")) {
  window.siap.then(() => {
    if (prm.has("t")) { tampilkan(parseFloat(prm.get("t")) || 0); return; }
    const mulai = performance.now();
    const putar = () => { tampilkan(((performance.now() - mulai) / 1000) % DURASI); requestAnimationFrame(putar); };
    putar();
  });
}
