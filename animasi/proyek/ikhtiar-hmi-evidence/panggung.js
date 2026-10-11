// Kamera, keterangan, label, dan tampilkan(t).
import * as THREE from "three";
import { composer, keadaan, aturKamera, titikUV, buatLabel, taruh, $, klem, campur, rentang, halus, halus2, keluar3 } from "./dasar.js";
import { perbaruiDunia1, POS_KITAB, POS_PENDIRI } from "./dunia1.js";
import { perbaruiDunia2, POS_FONDASI, TINGGI_FONDASI, menara, kemajuanGaris, titikPadaGaris } from "./dunia2.js";
import { DURASI, TATA, vTitik, T_GARIS } from "./isyarat.js";

// ---------------------------------------------------------------- kamera
const _v = new THREE.Vector3();
function vHalus(t) { // rata-rata berbobot posisi titik emas di sekitar t
  let s = 0, w = 0;
  for (let k = -8; k <= 8; k++) { const dt = k * 0.08; const g = Math.exp(-(dt * dt) / (2 * 0.35 * 0.35)); s += vTitik(t + dt) * g; w += g; }
  return s / w;
}
function kepalaHalus(t, out) {
  out.set(0, 0, 0);
  let w = 0;
  for (let k = -6; k <= 6; k++) {
    const dt = k * 0.1, g = Math.exp(-(dt * dt) / (2 * 0.4 * 0.4));
    titikPadaGaris(kemajuanGaris(t + dt), _v);
    out.addScaledVector(_v, g); w += g;
  }
  return out.multiplyScalar(1 / w);
}
const TENGAH_AKHIR = titikUV(1.5, 10.0, 0);
const _k = new THREE.Vector3();
const FASE = [
  { t: 0, d: 1, f: (t) => keadaan(POS_KITAB.clone().setY(0.25), campur(7.2, 7.8, rentang(t, 0, 2.3)), 540, 860) },
  { t: 2.25, d: 2.9, f: () => keadaan(POS_KITAB.clone().multiplyScalar(0.5).setY(0.8), 24, 540, 800) },
  { t: 5.15, d: 1.5, f: (t) => keadaan({ x: 0, y: 0.4, z: 0 }, campur(23, 22, rentang(t, 6, 12)), 540, 800) },
  { t: 11.85, d: 2.1, f: (t) => keadaan({ x: -0.1, y: 0.75, z: -0.1 }, campur(15.0, 14.4, rentang(t, 14, 20)), 520, 800) },
  { t: 19.95, d: 1.25, f: () => keadaan(POS_PENDIRI.clone().add(new THREE.Vector3(0.55, 0.75, 0.4)), 10.6, 540, 800) },
  { t: 26.55, d: 1.45, f: (t) => { const p = titikUV(0, vHalus(t) - 1.9, 0.4); return keadaan(p, 12.6, 540, 800); } },
  { t: 32.3, d: 1.5, f: (t) => keadaan(titikUV(0, campur(14.8, 15.2, rentang(t, 33, 39)), 0.5), 13.6, 540, 800) },
  { t: 38.75, d: 1.3, f: () => keadaan(POS_FONDASI.clone().setY(0.6), 10.6, 540, 820) },
  { t: 44.55, d: 1.0, f: () => keadaan(POS_FONDASI.clone().add(new THREE.Vector3(0.15, TINGGI_FONDASI + 0.2, 0.15)), 10.4, 540, 800) },
  { t: 50.35, d: 1.3, f: () => keadaan(menara.position.clone().add(new THREE.Vector3(0.45, 3.6, 0.45)), 12.5, 540, 760) },
  { t: 52.05, d: 1.4, f: (t) => { kepalaHalus(t, _k); const w = halus(rentang(t, 52.2, 55.6)); _k.lerp(TENGAH_AKHIR, 0.2 + 0.6 * w); _k.y = 0.5; return keadaan(_k.clone(), campur(13.5, 33, w), 540, 815); } },
  { t: 55.3, d: 2.2, f: (t) => keadaan(TENGAH_AKHIR, campur(35.6, 36.4, rentang(t, 55.3, 58)), 540, 845) },
];
function keadaanKamera(t) {
  const s = FASE[0].f(t);
  for (let i = 1; i < FASE.length; i++) {
    const fz = FASE[i];
    if (t <= fz.t) break;
    const w = halus2((t - fz.t) / fz.d);
    const b = fz.f(t);
    for (const k in s) s[k] = campur(s[k], b[k], w);
  }
  return s;
}

// ---------------------------------------------------------------- keterangan dan label
const KET = [[1.0, 5.85], [6.45, 11.8], [23.2, 26.85], [34.0, 38.85], [52.6, 58.5]];
const elKet = [...document.querySelectorAll(".ket")];
const lblTempat = buatLabel("lbl-tempat", "Yogyakarta, 5 Februari 1947.");
function tampakkanTeks(t) {
  elKet.forEach((el, i) => {
    const [a, b] = KET[i];
    const masuk = halus(rentang(t, a, a + 0.4));
    const keluar = halus(rentang(t, b - 0.3, b));
    el.style.opacity = String(masuk * (1 - keluar));
    el.style.transform = `translateY(${((1 - masuk) * 16 - keluar * 10).toFixed(1)}px)`;
  });
  const aT = halus(rentang(t, 14.0, 14.45)) * (1 - halus(rentang(t, 19.55, 19.95)));
  _v.set(2.3, 0.12, 2.0);
  taruh(lblTempat, _v, aT, { ax: 0.5, ay: 0, dy: 40 + 10 * (1 - halus(rentang(t, 14.0, 14.5))), bawah: 1470 });
}

// ---------------------------------------------------------------- tampilkan
export function tampilkan(t) {
  t = klem(t, 0, DURASI);
  aturKamera(keadaanKamera(t));
  perbaruiDunia1(t);
  perbaruiDunia2(t);
  composer.render();
  tampakkanTeks(t);
}
