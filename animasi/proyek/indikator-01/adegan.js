// Reels 21 detik, Indikator 01 / 44: "Jumlah mahasiswa baru yang masuk HMI menurun."
// Semua keadaan dihitung dari t. Kontrak halaman: lihat animasi/README.md. Waktu dibaca dari isyarat.js.
import * as THREE from "three";
import {
  W, klem, campur, rentang, halus, keluar3, masukKeluar3, pegas, titik, $, composer, matahari, ARAH_CAHAYA,
  keadaan, aturKamera, buatLabel, taruh,
} from "./alat.js";
import {
  DURASI, T, TAHUN, LAJU, HILANG, tau, padaJalur, PINTU, DEPAN_PINTU, GERBANG,
} from "./isyarat.js";
import { BARIS_Y } from "./benda.js";
import { bahanTanah, rumah, arus, meja, lima, PUNCAK_TANGGA } from "./dunia.js";

// ---------------------------------------------------------------- kamera (bagian C.6, dengan penyesuaian Bagian 1)
const F1 = titik(-0.6, -1.2, 0);   // Bagian 1: gerbang dan komisariat utuh di layar
const F2 = titik(2.6, 2.2, 0.6);   // Bagian 2: pintu komisariat
const F3 = titik(1.0, 2.0, 0);     // Bagian 3
const F4 = titik(1.0, 2.0, 0.8);   // kartu akhir: fokus naik 0.8
const _f = new THREE.Vector3();
function kameraPada(t) {
  _f.copy(F1);
  let H = campur(19, 18, masukKeluar3(rentang(t, 0, 1.2)));
  if (t > 6) { const k = masukKeluar3(rentang(t, 6, 7)); _f.lerpVectors(F1, F2, k); H = campur(18, 12, k); }
  if (t > 12) { const k = masukKeluar3(rentang(t, 12, 13)); _f.lerpVectors(F2, F3, k); H = campur(12, 16, k); }
  if (t > 18) { const k = masukKeluar3(rentang(t, 18, 19.5)); _f.lerpVectors(F3, F4, k); H = campur(16, 21, k); }
  return keadaan(_f, H);
}

// ---------------------------------------------------------------- bantuan
function opasitas(mat, a) { mat.transparent = true; mat.opacity = a; }
const _v = new THREE.Vector3();
const lajuBeku = (t) => (t <= T.beku[0] ? 1 : Math.max(0, 1 - (t - T.beku[0]) / 0.6)); // dτ/dt
const ayun = (dt, k = 1) => 0.04 * Math.abs(Math.sin(4 * Math.PI * dt)) * k;          // naik turun 4 Hz

function letak(fig, r, d, y, a, skala = 1) {
  fig.grup.visible = a > 0.002;
  if (!fig.grup.visible) return;
  fig.grup.position.copy(titik(r, d, y));
  fig.grup.scale.setScalar(skala);
  opasitas(fig.mat, a);
  fig.grup.children.forEach((m) => { m.castShadow = a > 0.5; });
}

// ---------------------------------------------------------------- arus figur (Bagian 1) dan tiga figur terakhir (Bagian 2)
function gerakArus(t) {
  const ta = tau(t);
  const laju = lajuBeku(t);
  for (const f of arus) {
    if (t < f.te) { f.grup.visible = false; continue; }
    const masuk = (s) => halus(s / 0.45); // memudar masuk saat melewati gerbang
    if (f.tiga >= 0) {
      // Tiga figur terakhir: terus berjalan sampai berdiri di depan pintu (melambat di ujung).
      const L = f.jalur.L, Ld = 0.6, dt = t - f.te, dt1 = (L - Ld) / LAJU;
      let s, k = 1;
      if (dt < dt1) s = LAJU * dt;
      else { const u = klem((dt - dt1) / (2 * Ld / LAJU)); s = L - Ld + Ld * (1 - (1 - u) * (1 - u)); k = 1 - u; }
      let [r, d] = padaJalur(f.jalur, s);
      let y = ayun(dt, k), a = masuk(s);
      // Bagian 3: masuk ke komisariat.
      const t0 = T.tigaMasuk + 0.15 * f.tiga;
      if (t > t0) {
        const m = halus(rentang(t, t0, t0 + 0.55));
        r = campur(r, PINTU[0], m); d = campur(d, PINTU[1], m);
        const h = rentang(t, t0 + 0.2, t0 + 0.2 + HILANG);
        y = ayun(t - t0, m < 1 ? 1 : 0) - 0.3 * h; a = 1 - h;
      }
      letak(f, r, d, y, a);
      continue;
    }
    const dt = ta - f.te;
    const s = LAJU * dt;
    if (f.jenis === "B") {
      if (t >= f.tMasuk) { // tiba di depan pintu: masuk ke dalam (gerak Hilang)
        const h = rentang(t, f.tMasuk, f.tMasuk + HILANG);
        letak(f, campur(DEPAN_PINTU[0], PINTU[0], h), campur(DEPAN_PINTU[1], PINTU[1], h), -0.3 * h, 1 - h);
      } else {
        const [r, d] = padaJalur(f.jalur, s);
        letak(f, r, d, ayun(dt, laju), masuk(s));
      }
    } else {
      // Memudar di tepi kiri. Yang terhenti di tengah jalan ikut menghilang saat Bagian 3 dimulai.
      const h = Math.max(klem((ta - f.tauHilang) / HILANG), rentang(t, T.tigaMasuk, T.tigaMasuk + HILANG));
      const [r, d] = padaJalur(f.jalur, s);
      letak(f, r, d, ayun(dt, laju) - 0.3 * h, masuk(s) * (1 - h));
    }
  }
}

// ---------------------------------------------------------------- komisariat: abu selama gejala, denyut cermin, kembali zamrudRedup
function gerakRumah(t) {
  const k = halus(rentang(t, T.emas[0], T.emas[1]));
  rumah.matDinding.color.copy(W.abu).lerp(W.zamrudRedup, k);
  rumah.matAtap.color.copy(W.abuGelap).lerp(W.pelat, k);
  rumah.matPintu.color.copy(W.abuGelap).lerp(W.pelat, k);
  const aktif = t > T.denyut[0] && t < T.denyut[1];
  const p = aktif ? Math.pow(Math.sin(Math.PI * (t - T.denyut[0]) / T.periodeDenyut), 2) : 0;
  rumah.tepi.forEach((l) => { l.visible = p > 0.002; });
  rumah.matDenyut.opacity = p;
  for (const m of [rumah.matDinding, rumah.matPintu]) { m.emissive.copy(W.zamrudPijar); m.emissiveIntensity = 0.5 * p; }
}

// ---------------------------------------------------------------- tabel dan lima figur baru (Bagian 3)
function nyalaEmas(t) { // 0 → 1.4 sesaat → 0.9 dalam 0.8 s
  const k = rentang(t, T.emas[0], T.emas[1]);
  if (k <= 0) return 0;
  return k < 0.5 ? 1.4 * keluar3(k / 0.5) : 1.4 - 0.5 * halus((k - 0.5) / 0.5);
}
function gerakTabel(t) {
  meja.grup.visible = t >= T.tabelMuncul;
  if (!meja.grup.visible) return;
  const k = keluar3(rentang(t, T.tabelMuncul, T.tabelMuncul + 0.5));
  meja.grup.position.y = -0.6 * (1 - k);
  meja.grup.scale.setScalar(0.85 + 0.15 * k);
  for (const m of meja.semuaBahan) opasitas(m, k);
  meja.batang.forEach((b, i) => {
    const u = keluar3(rentang(t, T.batang[i], T.batang[i] + 0.3));
    b.visible = u > 0.001;
    b.scale.x = Math.max(0.001, u);
  });
  const kE = keluar3(rentang(t, T.emas[0], T.emas[1]));
  const e = nyalaEmas(t);
  for (const m of meja.matEmas) {
    m.color.copy(W.zamrud).lerp(W.emas, kE);
    m.emissive.copy(W.emasPijar);
    m.emissiveIntensity = e;
  }
  meja.papan.scale.setScalar(1 + 0.25 * pegas(t - T.emas[0], 12, 22) * (t >= T.emas[0] ? 1 : 0));
}
function gerakLima(t) {
  lima.forEach((f, i) => {
    const t0 = T.limaMuncul + 0.12 * i;
    const k = keluar3(rentang(t, t0, t0 + 0.5));
    f.grup.visible = t >= t0;
    if (f.grup.visible) {
      f.grup.position.copy(titik(f.r, f.d, -0.6 * (1 - k)));
      f.grup.scale.setScalar(0.85 + 0.15 * k);
      opasitas(f.mat, k);
    }
    const tb = T.balon[i];
    const kb = keluar3(rentang(t, tb, tb + 0.5));
    f.balon.grup.visible = t >= tb;
    if (f.balon.grup.visible) {
      f.balon.grup.position.copy(f.posBalon).setY(f.posBalon.y - 0.6 * (1 - kb));
      f.balon.grup.scale.setScalar(0.5 * (0.85 + 0.15 * kb));
      opasitas(f.balon.mat, 0.85 * kb);
      f.balon.matTitik.opacity = kb;
    }
  });
}

// ---------------------------------------------------------------- teks: kepala, keterangan, kartu akhir, label benda
const elKepala = $("kepala"), elAkhir = $("kepala-akhir"), elAjakan = $("ajakan"), elSumber = $("sumber");
const elKet = [...document.querySelectorAll(".ket")];
const KET = [[1.2, 5.4, 5.8], [6.6, 11.6, 12.0], [13.6, 17.6, 18.0]]; // [masuk, mulai keluar, habis]
const lblTahun = TAHUN.map((n) => buatLabel("lbl-tahun", n));
const lblLK = ["LK 1", "LK 2", "LK 3"].map((n) => buatLabel("lbl-benda", n));
const lblBaris = TAHUN.map((n) => buatLabel("lbl-baris", n));
const POS_TAHUN = titik(GERBANG[0], GERBANG[1], 2.75);

function tampakkanTeks(t) {
  const aK = keluar3(rentang(t, T.kepalaMasuk[0], T.kepalaMasuk[1]));
  elKepala.style.opacity = String(aK * (1 - halus(rentang(t, 17.6, 18.0))));
  elKepala.style.transform = `translateY(${((1 - aK) * 12).toFixed(1)}px)`;
  const aA = keluar3(rentang(t, T.kepalaAkhir[0], T.kepalaAkhir[1]));
  elAkhir.style.opacity = String(aA);
  elAkhir.style.transform = `translateY(${((1 - aA) * 12).toFixed(1)}px)`;
  KET.forEach(([a, b, c], i) => {
    const m = keluar3(rentang(t, a, a + 0.5));
    elKet[i].style.opacity = String(m * (1 - halus(rentang(t, b, c))));
    elKet[i].style.transform = `translateY(${((1 - m) * 16).toFixed(1)}px)`;
  });
  const aJ = keluar3(rentang(t, T.ajakan[0], T.ajakan[1]));
  elAjakan.style.opacity = String(aJ);
  elAjakan.style.transform = `scale(${(0.92 + 0.08 * aJ).toFixed(4)})`;
  const aS = keluar3(rentang(t, T.sumber[0], T.sumber[1]));
  elSumber.style.opacity = String(aS);
  elSumber.style.transform = `translateY(${((1 - aS) * 12).toFixed(1)}px)`;
}

function tampakkanLabel(t, kam) {
  // Tahun di atas gerbang: 2024 → 2025 → 2026.
  lblTahun.forEach((el, w) => {
    const a0 = T.gelombang[w];
    const masuk = halus(rentang(t, a0, a0 + 0.25));
    const keluar = w < 2 ? halus(rentang(t, T.gelombang[w + 1] - 0.05, T.gelombang[w + 1] + 0.15)) : halus(rentang(t, 6.0, 6.4));
    taruh(el, POS_TAHUN, masuk * (1 - keluar), { ay: 1, dy: -14 + (1 - masuk) * 10 });
  });
  // LK 1–3 di atas masing-masing anak tangga.
  const aLK = halus(rentang(t, 0.3, 0.9));
  lblLK.forEach((el, i) => taruh(el, PUNCAK_TANGGA[i], aLK, { ay: 0.5 }));
  // Tahun di tiap baris tabel.
  if (meja.grup.visible) meja.grup.updateMatrixWorld(true);
  const kT = keluar3(rentang(t, T.tabelMuncul, T.tabelMuncul + 0.5));
  lblBaris.forEach((el, i) => {
    const a = meja.grup.visible ? kT * halus(rentang(t, T.batang[i] - 0.1, T.batang[i] + 0.15)) : 0;
    _v.set(-0.82, BARIS_Y[i], 0.05);
    meja.papan.localToWorld(_v);
    taruh(el, _v, a, { ay: 0.5, skala: 16 / kam.H }); // ikut mengecil bersama papan saat kamera menjauh
  });
}

// ---------------------------------------------------------------- kontrak halaman
function tampilkan(t) {
  t = klem(t, 0, DURASI);
  const kam = kameraPada(t);
  aturKamera(kam);
  matahari.target.position.set(kam.fx, 0, kam.fz);
  matahari.position.set(kam.fx, 0, kam.fz).addScaledVector(ARAH_CAHAYA, 50);
  matahari.target.updateMatrixWorld();
  const lebarBayang = Math.max(14, kam.H * 0.75);
  Object.assign(matahari.shadow.camera, { left: -lebarBayang, right: lebarBayang, top: lebarBayang, bottom: -lebarBayang });
  matahari.shadow.camera.updateProjectionMatrix();
  bahanTanah.uniforms.uFokus.value.set(kam.fx, 0, kam.fz);
  bahanTanah.uniforms.uJari.value = 20 * keluar3(rentang(t, T.gridNyala[0], T.gridNyala[1]));
  gerakArus(t);
  gerakRumah(t);
  gerakTabel(t);
  gerakLima(t);
  composer.render();
  tampakkanTeks(t);
  tampakkanLabel(t, kam);
}

window.DURASI = DURASI;
window.tampilkan = tampilkan;
window.siap = (async () => {
  await Promise.all([
    '700 50px "Noto Serif"', 'italic 700 52px "Noto Serif"', '600 40px "DM Sans"',
    '500 19px "JetBrains Mono"', '600 22px "JetBrains Mono"', '700 22px "JetBrains Mono"',
  ].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
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
