// Gerak adegan 1–5: lemari, debu, balon, kartu program kerja, buku aturan, lembar bukti, identitas dokumen.
import * as THREE from "three";
import { W, DEG, klem, campur, rentang, halus, halus2, keluar3, masukKeluar3, lenting, pegas, kejut, KANAN, NAIK, warna, tampakJalur } from "./alat.js";
import { T } from "./isyarat.js";
import {
  L, kusam, tertata, sobekJatuh, debu, figur, figurBaru, JALAN_FIGUR, balon, slotBalasan, rangkaKartu, kartu, salinan, KARTU_DARI, KARTU_KE,
  bukuAturan, paruhBuku, paruhLemari, garisUtuh, percikPatah, lembar, PUSAT_ORBIT, taliOrbit, cincinOrbit, dok, cap, NORMAL_DOK, POS_CAP,
  sambung, lokal,
} from "./dunia.js";

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _e = new THREE.Euler(0, 0, 0, "YXZ");
const ABU = warna("hsl(150, 5%, 58%)");
export const T_GANTI = 50.8; // batas "setahun kemudian": lemari kembali tertutup, isinya tertata

// Figur pion berjalan dengan lompatan kecil.
function jalankan(fig, t, [t0, t1], jalan, lompatan = 5) {
  const u = rentang(t, t0, t1);
  fig.position.lerpVectors(jalan[0], jalan[1], masukKeluar3(u));
  const aktif = t > t0 && t < t1;
  const fase = u * lompatan;
  fig.position.y = aktif ? Math.abs(Math.sin(Math.PI * fase)) * 0.09 : 0;
  _v.copy(jalan[1]).sub(jalan[0]).normalize();
  fig.rotation.set(0, 0, 0);
  if (aktif) { const miring = 0.08 * Math.sin(Math.PI * u); fig.rotateOnWorldAxis(_v2.crossVectors(NAIK, _v).normalize(), miring); }
}

// Muka benda menghadap kamera (elevasi el derajat, azimut kamera).
function hadapKamera(obj, el, az, rz = 0) { _e.set(-el * DEG, az * DEG, rz, "YXZ"); obj.rotation.copy(_e); }

export function gerakA(t, kam) {
  // ---------------------------------------------------------------- lemari: pintu, isi, cahaya
  const lama = t < T_GANTI;
  const tp = lama ? T.pintuBuka : T.pintuBaru;
  const uBuka = rentang(t, tp[0], tp[1]);
  const sudut = (lama ? 104 : 112) * DEG * (halus2(uBuka) + 0.04 * pegas(t - tp[1], 7, 16) * (t > tp[1] ? 1 : 0));
  L.pintu[0].rotation.y = -sudut;
  L.pintu[1].rotation.y = sudut * (lama ? 0.93 : 1);
  kusam.visible = lama;
  tertata.grup.visible = !lama;
  const cahaya = lama ? 0 : halus(rentang(t, T.cahayaTertata, T.cahayaTertata + 0.9));
  L.lampu.intensity = 9 * cahaya;
  L.lampuRedup.intensity = lama ? 1.6 * halus(uBuka) * (1 - 0.8 * halus(rentang(t, 7.9, 8.4))) : 0;
  L.pendar.material.uniforms.uKuat.value = 0.85 * cahaya;
  tertata.matLabel.emissiveIntensity = 0.25 + 1.4 * cahaya;

  // ---------------------------------------------------------------- figur lama (adegan 1–3) dan figur baru (penutup)
  figur.visible = t < 18.95;
  if (t < 12.9) jalankan(figur, t, T.figurMasuk, JALAN_FIGUR);
  else jalankan(figur, t, [12.95, 13.9], [JALAN_FIGUR[1], lokal(1.25, 0, 2.45)], 4);
  if (t > T.balonKirim - 0.15) { // sentak kecil saat mengirim pesan, lalu tertunduk saat tidak ada balasan
    const k = t < T.balonKirim ? (t - T.balonKirim + 0.15) / 0.15 : pegas(t - T.balonKirim, 10, 20);
    figur.scale.set(1.12 * (1 + 0.04 * k), 1.12 * (1 - 0.07 * k), 1.12 * (1 + 0.04 * k));
    const tunduk = 0.11 * halus(rentang(t, T.tanpaBalasan, T.tanpaBalasan + 0.6));
    figur.rotateOnWorldAxis(_v2.set(1, 0, -0.3).normalize(), tunduk);
  } else figur.scale.setScalar(1.12);
  figurBaru.visible = t >= T_GANTI;
  if (figurBaru.visible) jalankan(figurBaru, t, T.figurBaru, JALAN_FIGUR);

  // ---------------------------------------------------------------- kepulan debu
  for (const p of debu.partikel) {
    const dt = t - (T.debu + p.tunda);
    const hidup = lama && dt > 0 && dt < 2.6;
    p.s.visible = hidup;
    if (!hidup) continue;
    const k = 1 - Math.exp(-dt * 2.4);
    p.s.position.set(p.x0 + p.arah.x * p.jauh * k, p.y0 + p.arah.y * p.jauh * k * 0.6 + 0.22 * dt, 0.3 + p.arah.z * p.jauh * k);
    p.s.scale.setScalar(p.ukuran * (0.45 + 1.3 * k));
    p.s.material.opacity = 0.42 * Math.pow(1 - dt / 2.6, 1.6) * halus(dt / 0.08);
  }

  // ---------------------------------------------------------------- halaman sobek yang jatuh keluar
  sobekJatuh.visible = lama && t >= T.halamanJatuh[0] && t < 19;
  if (sobekJatuh.visible) {
    const u = rentang(t, T.halamanJatuh[0], T.halamanJatuh[1]);
    const a = lokal(0.35, 1.45, 0.45), b = lokal(-0.15, 0.012, 1.55);
    sobekJatuh.position.lerpVectors(a, b, halus(u));
    sobekJatuh.position.y = campur(1.45, 0.012, u * u * (3 - 2 * u));
    sobekJatuh.position.addScaledVector(KANAN, 0.22 * Math.sin(u * Math.PI * 2.5) * (1 - u));
    sobekJatuh.rotation.set(campur(-0.2, -Math.PI / 2, halus(u)) + 0.5 * Math.sin(u * 9) * (1 - u), 0.3 + u * 0.6, 0.4 * Math.sin(u * 7) * (1 - u));
  }

  // ---------------------------------------------------------------- balon pesan tanpa balasan
  const aBalon = t >= T.balonKirim && t < 7.95;
  balon.grup.visible = aBalon;
  if (aBalon) {
    const u = rentang(t, T.balonNaik[0], T.balonNaik[1]);
    const asal = _v.copy(figur.position).setY(1.45);
    const tuju = _v2.copy(figur.position).addScaledVector(KANAN, 0.55).setY(3.75);
    balon.grup.position.lerpVectors(asal, tuju, keluar3(u));
    const muncul = lenting(rentang(t, T.balonKirim, T.balonKirim + 0.4), 1.6);
    const redup = halus(rentang(t, T.tanpaBalasan, T.tanpaBalasan + 0.5));
    const pudar = 1 - halus(rentang(t, 7.25, 7.9));
    balon.grup.position.y += 0.05 * Math.sin(t * 2.2) * rentang(t, 5.4, 5.8) + 0.35 * halus(rentang(t, T.tanpaBalasan, 7.9));
    balon.grup.scale.setScalar(Math.max(0.001, muncul * (1 - 0.12 * redup)));
    hadapKamera(balon.grup, 22, kam.az, 0.06 * redup);
    balon.mat.color.copy(warna("hsl(42, 26%, 90%)")).lerp(ABU, redup);
    balon.mat.emissiveIntensity = 0.12 * (1 - redup);
    balon.mat.transparent = true;
    balon.mat.opacity = pudar;
    balon.titik.forEach((m, i) => {
      const ketik = t >= T.ketik[0] && t < T.ketik[1] ? Math.max(0, Math.sin((t - T.ketik[0]) * Math.PI * 2 * 1.6 - i * 0.9)) : 0;
      m.position.y = 0.07 * ketik;
      m.material.transparent = true;
      m.material.opacity = pudar;
      m.material.color.copy(warna("hsl(153, 25%, 22%)")).lerp(ABU, redup * 0.6);
    });
  }
  const aSlot = halus(rentang(t, 5.5, 5.85)) * (1 - halus(rentang(t, 7.2, 7.8)));
  slotBalasan.visible = aSlot > 0;
  if (slotBalasan.visible) {
    slotBalasan.position.copy(figur.position).addScaledVector(KANAN, 1.95).setY(4.55);
    hadapKamera(slotBalasan, 22, kam.az);
    slotBalasan.scale.setScalar(0.92);
    slotBalasan.material.opacity = 0.75 * aSlot * (0.8 + 0.2 * Math.cos(t * 9));
  }

  // ---------------------------------------------------------------- kartu program kerja, tahun diganti, lalu disalin
  const aKartu = t >= T.kartuAmbil[0] && t < T.kartuPergi[1];
  rangkaKartu.visible = aKartu;
  if (aKartu) {
    const u = masukKeluar3(rentang(t, T.kartuAmbil[0], T.kartuAmbil[1]));
    const pergi = masukKeluar3(rentang(t, T.kartuPergi[0], T.kartuPergi[1]));
    rangkaKartu.position.lerpVectors(KARTU_DARI, KARTU_KE, u).lerp(KARTU_DARI, pergi);
    rangkaKartu.position.y += 0.04 * Math.sin(t * 1.9) * u;
    rangkaKartu.scale.setScalar(Math.max(0.001, campur(0.22, 1, u) * campur(1, 0.35, pergi)));
    const pudarKartu = 1 - halus(rentang(t, T.kartuPergi[0] + 0.15, T.kartuPergi[1]));
    rangkaKartu.traverse((o) => {
      if (!o.material) return;
      const m = o.material;
      if (m.userData.transparanAsli === undefined) m.userData.transparanAsli = m.transparent;
      m.transparent = m.userData.transparanAsli || pudarKartu < 0.999;
      m.opacity = pudarKartu;
    });
    hadapKamera(rangkaKartu, 26, kam.az, campur(-0.5, 0.0, u) + 0.4 * pergi);
    const k = rentang(t, T.angkaGanti - 0.14, T.angkaGanti + 0.14);
    kartu.angka.lama.scale.y = Math.max(0.001, 1 - 2 * k);
    kartu.angka.lama.visible = k < 0.5;
    kartu.angka.baru.scale.y = Math.max(0.001, (k - 0.5) * 2) * (1 + 0.12 * pegas(t - T.angkaGanti - 0.14, 9, 20));
    kartu.angka.baru.visible = k > 0.5;
    kartu.matMuka.emissiveIntensity = 0.04 + 0.2 * kejut(t - T.angkaGanti, 5) * (t > T.angkaGanti ? 1 : 0);
    salinan.forEach((s, i) => {
      const ts = T.salin[i];
      const m = keluar3(rentang(t, ts - 0.05, ts + 0.2));
      s.grup.visible = t >= ts - 0.05;
      s.grup.position.set(0.24 * (i + 1) * m, -0.2 * (i + 1) * m, -0.07 * (i + 1));
      const kk = pegas(t - ts - 0.2, 12, 26);
      s.grup.scale.setScalar(1 + 0.03 * kk);
      const abu = 0.35 + 0.2 * i;
      s.matBadan.color.copy(warna("hsl(42, 18%, 66%)")).lerp(ABU, abu);
      s.matMuka.color.setScalar(0.72 - 0.17 * (i + 1));
      s.matMuka.emissiveIntensity = 0.02;
    });
    kartu.grup.position.z = 0.0;
  }

  // ---------------------------------------------------------------- buku aturan bertumpuk
  bukuAturan.forEach((b, i) => {
    const tl = T.buku[i];
    const jatuh = 0.42;
    b.g.visible = t >= tl - jatuh;
    if (!b.g.visible) return;
    const u = klem((t - (tl - jatuh)) / jatuh);
    b.g.position.y = b.y + 2.8 * (1 - u * u);
    const kk = t > tl ? pegas(t - tl, 11, 30) : 0;
    b.g.scale.set(1 + 0.025 * kk, 1 - 0.07 * kk, 1 + 0.025 * kk);
  });
  // Garis dari tumpukan ke lemari: tumbuh, hampir sampai, lalu patah dan menjadi abu-abu.
  const tumbuh = halus(rentang(t, T.garisTumbuh[0], T.garisTumbuh[1]));
  const patah = t >= T.garisPatah;
  if (!lama) {
    tampakJalur(garisUtuh.l, 1);
    garisUtuh.mat.color.copy(W.zamrudPijar);
    garisUtuh.mat.opacity = 1;
    paruhBuku.g.visible = paruhLemari.g.visible = false;
  } else if (!patah) {
    tampakJalur(garisUtuh.l, tumbuh * 0.985);
    garisUtuh.mat.color.copy(W.zamrud);
    garisUtuh.mat.opacity = 0.9 * (t >= T.garisTumbuh[0] ? 1 : 0);
    paruhBuku.g.visible = paruhLemari.g.visible = false;
  } else {
    garisUtuh.l.visible = false;
    const dt = t - T.garisPatah;
    const jatuhK = keluar3(klem(dt / 0.5)) + 0.06 * pegas(dt - 0.5, 8, 18) * (dt > 0.5 ? 1 : 0);
    const abu = halus(klem(dt / 0.35));
    for (const [pr, besar] of [[paruhBuku, 0.95], [paruhLemari, 1.1]]) {
      pr.g.visible = t < 19.2;
      tampakJalur(pr.l, 1);
      _v.copy(pr.ujung).setY(0).normalize();
      const sumbu = _v2.crossVectors(NAIK, _v).normalize();
      pr.g.quaternion.setFromAxisAngle(sumbu, besar * jatuhK);
      pr.mat.color.copy(W.zamrud).lerp(ABU, abu);
      pr.mat.opacity = campur(0.9, 0.6, abu);
    }
  }
  const pc = t >= T.garisPatah ? t - T.garisPatah : -1;
  percikPatah.visible = pc >= 0 && pc < 0.6;
  if (percikPatah.visible) { percikPatah.material.opacity = 0.9 * Math.exp(-pc * 6); percikPatah.scale.setScalar(0.5 + 1.4 * keluar3(pc / 0.4)); }

  // ---------------------------------------------------------------- lembar bukti dan empat label yang mengitari
  const aLembar = t >= T.lembarMuncul[0] && t < 25.15;
  lembar.grup.visible = aLembar;
  const nyalaOrbit = halus(rentang(t, T.labelOrbit[0] - 0.3, T.labelOrbit[0])) * (1 - halus(rentang(t, 24.5, 25.0)));
  if (aLembar) {
    const u = rentang(t, T.lembarMuncul[0], T.lembarMuncul[1]);
    const keluar = halus(rentang(t, 24.55, 25.1));
    lembar.grup.position.copy(PUSAT_ORBIT);
    lembar.grup.position.y += -0.7 * (1 - keluar3(u)) + 0.06 * Math.sin(t * 1.7) + 0.4 * keluar;
    lembar.grup.scale.setScalar(Math.max(0.001, campur(0.55, 1, lenting(u, 1.2)) * (1 - keluar)));
    hadapKamera(lembar.grup, 30, kam.az, 0.035 * Math.sin(t * 1.3));
    lembar.mat.emissiveIntensity = 0.04 + 0.08 * nyalaOrbit;
  }
  cincinOrbit.g.visible = nyalaOrbit > 0;
  cincinOrbit.g.rotation.set(0.32, 0, 0.12);
  cincinOrbit.mat.opacity = 0.55 * nyalaOrbit;
  tampakJalur(cincinOrbit.l, halus(rentang(t, T.labelOrbit[0] - 0.4, T.labelOrbit[3])));

  // ---------------------------------------------------------------- identitas dokumen
  dok.forEach((d, i) => {
    const t0 = T.dokKeluar[i];
    const lipat = rentang(t, T.lipat[0] + 0.1 * i, T.lipat[0] + 0.1 * i + 0.55);
    d.grup.visible = t >= t0 && lipat < 1;
    if (!d.grup.visible) { d.kilau.visible = false; return; }
    const u = rentang(t, t0, t0 + 0.55);
    d.grup.position.copy(d.pos);
    d.grup.position.y += -1.0 * (1 - keluar3(u)) + 0.035 * Math.sin(t * 1.5 + i * 2);
    const s = Math.max(0.001, campur(0.4, 1, lenting(u, 1.4)) * (1 - keluar3(lipat)));
    d.grup.scale.setScalar(s);
    d.grup.rotation.z = 0.25 * (1 - keluar3(u)) * (i % 2 ? -1 : 1) + 1.2 * lipat * lipat;
    // Label emas: terbang masuk lalu menempel dengan "klik".
    const tk = T.tagKlik[i];
    const tg = d.tag.grup;
    tg.visible = t >= tk - 0.32;
    const f = halus2(rentang(t, tk - 0.32, tk));
    tg.position.set(-d.w / 2 + 0.02 + 0.15 * (1 - f), d.h / 2 - 0.14 + 0.85 * (1 - f), d.tebal / 2 + 0.012 + 0.5 * (1 - f));
    const kk = t >= tk ? pegas(t - tk, 9, 24) : 0;
    tg.scale.setScalar(campur(1.25, 1, f) * (1 - 0.14 * kk));
    tg.rotation.z = 0.2 - 0.35 * (1 - f);
    d.tag.mat.emissiveIntensity = 0.35 + 1.4 * kejut(t - tk, 4) * (t >= tk ? 1 : 0) + 0.6 * halus(rentang(t, T.lipat[0] - 0.3, T.lipat[0]));
    const fl = t >= tk ? Math.exp(-(t - tk) * 5) : 0;
    d.kilau.visible = fl > 0.01 || lipat > 0;
    tg.updateMatrixWorld(true);
    tg.getWorldPosition(d.kilau.position);
    d.kilau.material.opacity = Math.max(0.9 * fl, 0.55 * Math.sin(Math.PI * lipat));
    d.kilau.scale.setScalar(lipat > 0 ? 0.8 + 0.8 * lipat : 0.6 + 1.6 * keluar3(rentang(t, tk, tk + 0.4)));
  });
  // Stempel turun ke SK.
  const ts = T.stempel;
  cap.visible = t > ts - 0.65 && t < ts + 0.6;
  if (cap.visible) {
    let jarak;
    if (t < ts) { const u = rentang(t, ts - 0.65, ts); jarak = 1.5 * (1 - u * u); }
    else if (t < ts + 0.09) jarak = -0.012;
    else jarak = 1.2 * keluar3(rentang(t, ts + 0.09, ts + 0.5));
    cap.position.copy(POS_CAP).addScaledVector(NORMAL_DOK, Math.max(jarak, 0) + 0.012).addScaledVector(KANAN, 0.35 * (1 - rentang(t, ts - 0.65, ts)));
    const tekan = t >= ts && t < ts + 0.12 ? 1 : 0;
    cap.scale.set(1, 1 - 0.08 * tekan, 1);
    cap.traverse((o) => { if (o.material) { o.material.transparent = true; o.material.opacity = 1 - halus(rentang(t, ts + 0.3, ts + 0.6)); } });
  }
  const capSK = dok[1].cap;
  capSK.material.opacity = t >= ts ? 0.92 : 0;
  capSK.scale.setScalar(t >= ts ? 1 + 0.15 * Math.exp(-(t - ts) * 9) : 1);
  // Garis zamrud menyambung ketiga dokumen.
  sambung.forEach((s, i) => {
    const a = T.garisSambung[0] + i * 0.36;
    const k = halus(rentang(t, a, a + 0.42));
    const pudar = 1 - halus(rentang(t, T.lipat[0], T.lipat[0] + 0.35));
    tampakJalur(s.l, k);
    s.l.visible = s.l.visible && pudar > 0;
    s.mat.opacity = 0.95 * pudar;
  });
}
