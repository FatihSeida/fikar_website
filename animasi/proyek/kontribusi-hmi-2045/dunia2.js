// Dunia bagian 2: jalan HMI (adegan 5), modal yang bocor (6), dua gapura dan figur muda (7), bola dunia (9).
import * as THREE from "three";
import {
  W, scene, klem, campur, rentang, halus, keluar3, lenting, jendela, warna, dunia, bahan, balok, pion, sprite, bahanGaris, garisSambung,
  buatLabel, taruh, GEO_PION,
} from "./dasar.js";
import { buatBuku, buatBendera, buatBangunanAlumni, buatTarikTambang, buatGapura, buatBolaDunia, buatTitikDunia, arahBola } from "./benda2.js";
import { tambahBusa } from "./dunia.js";
import {
  acak, T_NAIK, T_BARIS, T_ANGIN, T_BUKU, T_CABANG, T_ALUMNI, T_LUAS, T_TITIK, T_TALI, T_SENTAK, T_BOCOR, T_GAPURA, T_MUDA,
  T_LEWAT_GAPURA, T_DUNIA, GAPURA_B, B_AKHIR, TITIK_DUNIA,
} from "./isyarat.js";

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q = new THREE.Quaternion();
const NAIK = new THREE.Vector3(0, 1, 0);
const DIR_X = { a: -Math.SQRT1_2, b: Math.SQRT1_2 }; // dunia −x: naik ke kiri di layar
const DIR_Z = { a: Math.SQRT1_2, b: Math.SQRT1_2 };  // dunia −z: naik ke kanan di layar
const tambah = (p, d, k) => ({ a: p.a + d.a * k, b: p.b + d.b * k });

// ---------------------------------------------------------------- jalan setapak: lini masa HMI
const Q0 = { a: 1.8, b: 12.6 };
const RUAS = [[DIR_X, 5.2], [DIR_Z, 4.8], [DIR_X, 4.4], [DIR_Z, 5.4]];
const Q = [Q0];
for (const [d, L] of RUAS) Q.push(tambah(Q[Q.length - 1], d, L));
const S_RUAS = [0];
for (const [, L] of RUAS) S_RUAS.push(S_RUAS[S_RUAS.length - 1] + L);
const S_CABANG = S_RUAS[3];
function titikJalan(s) { // (a, b) pada jalan; di luar rentang diperpanjang lurus
  let i = 0;
  while (i < RUAS.length - 1 && s > S_RUAS[i + 1]) i++;
  return tambah(Q[i], RUAS[i][0], s - S_RUAS[i]);
}
function arahJalan(s) { // arah halus (rata-rata di sekitar s) dalam (a, b)
  const p = titikJalan(s - 0.45), q = titikJalan(s + 0.45);
  const L = Math.hypot(q.a - p.a, q.b - p.b) || 1;
  return { a: (q.a - p.a) / L, b: (q.b - p.b) / L };
}
// Sumbu dunia x sebagai arah samping pada cabang (tegak lurus −z).
const SAMPING_CABANG = { a: Math.SQRT1_2, b: -Math.SQRT1_2 };

const jalan = new THREE.Group();
scene.add(jalan);
const matJalan = bahan(W.petak, { roughness: 0.7 });
const matJejak = new THREE.MeshBasicMaterial({ color: W.zamrudPijar.clone().multiplyScalar(1.5) });
const lempeng = []; // {m, tMuncul}
const T_MUNCUL_RUAS = [27.75, 29.35, 30.95];
for (let i = 0; i < 3; i++) {
  const [d, L] = RUAS[i];
  const tengah = tambah(Q[i], d, L / 2);
  const m = balok(L + 1.4, 0.14, 1.4, 0.04, matJalan);
  dunia(tengah.a, tengah.b, 0.07, m.position);
  m.rotation.y = d === DIR_X ? 0 : Math.PI / 2;
  jalan.add(m);
  lempeng.push({ m, tMuncul: T_MUNCUL_RUAS[i] });
}
// Dua jalur sejajar pada cabang: tumbuh dari simpang yang sama, berjalan berdampingan tanpa bertemu.
const LAT_CABANG = 0.62, PISAH = 1.0, S_PISAH = S_CABANG + PISAH, PANJANG_CABANG = RUAS[3][1] - PISAH + 0.85;
const geserCabang = (s) => LAT_CABANG * halus((s - S_PISAH + 0.35) / 1.05);
const pangkalCabang = (() => { // potongan bersama sebelum jalan terbelah
  const geo = new THREE.BoxGeometry(PISAH + 0.7, 0.13, 1.4).translate((PISAH + 0.7) / 2, 0, 0);
  const m = new THREE.Mesh(geo, matJalan);
  m.castShadow = m.receiveShadow = true;
  const p = tambah(Q[3], DIR_Z, 0);
  dunia(p.a, p.b, 0.065, m.position);
  m.rotation.y = Math.PI / 2;
  jalan.add(m);
  return m;
})();
const jalurCabang = [-1, 1].map((c) => {
  const geo = new THREE.BoxGeometry(PANJANG_CABANG, 0.12, 0.74).translate(PANJANG_CABANG / 2, 0, 0);
  const m = new THREE.Mesh(geo, matJalan);
  m.castShadow = m.receiveShadow = true;
  const p = tambah(tambah(Q[3], DIR_Z, PISAH - 0.05), SAMPING_CABANG, c * LAT_CABANG);
  dunia(p.a, p.b, 0.06, m.position);
  m.rotation.y = Math.PI / 2;
  jalan.add(m);
  return m;
});
// Garis jejak zamrud di tengah jalan, tumbuh mengikuti barisan.
const titikJejak = [];
for (let s = 0; s <= S_CABANG + 0.001; s += 0.2) { const p = titikJalan(s); dunia(p.a, p.b, 0.15, _v); titikJejak.push(_v.x, _v.y, _v.z); }
const PANJANG_JEJAK = S_CABANG;
const matGarisJejak = bahanGaris(W.zamrudPijar.clone().multiplyScalar(1.4), 3, 0, { dashed: true, dashSize: PANJANG_JEJAK * 1.1, gapSize: PANJANG_JEJAK * 1.1 });
const garisJejak = garisSambung(titikJejak, matGarisJejak);
jalan.add(garisJejak);
const jejakCabang = [-1, 1].map((c) => {
  const pts = [];
  for (let s = S_CABANG; s <= S_RUAS[4] + 0.3; s += 0.2) { const p = tambah(titikJalan(s), SAMPING_CABANG, c * geserCabang(s)); dunia(p.a, p.b, 0.14, _v); pts.push(_v.x, _v.y, _v.z); }
  const L = S_RUAS[4] + 0.3 - S_CABANG;
  const mat = bahanGaris(W.zamrudPijar.clone().multiplyScalar(1.4), 3, 0, { dashed: true, dashSize: L * 1.1, gapSize: L * 1.1 });
  const g = garisSambung(pts, mat);
  jalan.add(g);
  return { g, mat, L };
});

// Barisan enam figur yang menempuh lini masa.
const KF_JALAN = [[27.4, -0.2], [28.2, 0.35], [30.0, 5.5], [31.6, 9.75], [33.0, 14.25], [34.35, 19.5]];
function sBarisan(t) {
  if (t <= KF_JALAN[0][0]) return KF_JALAN[0][1];
  for (let i = 1; i < KF_JALAN.length; i++) {
    const [t0, s0] = KF_JALAN[i - 1], [t1, s1] = KF_JALAN[i];
    if (t <= t1) return campur(s0, s1, (t - t0) / (t1 - t0));
  }
  return KF_JALAN[KF_JALAN.length - 1][1];
}
export function pusatBarisan(t, out) { // titik dunia pusat barisan (untuk kamera), dihaluskan
  let sa = 0, sb = 0, sw = 0;
  for (let k = -6; k <= 6; k++) {
    const dt = k * 0.12, w = Math.exp(-(dt * dt) / (2 * 0.45 * 0.45));
    const p = titikJalan(sBarisan(t + dt) - 0.55);
    sa += p.a * w; sb += p.b * w; sw += w;
  }
  return dunia(sa / sw, sb / sw, 0, out);
}
const ALUMNI = [
  { jenis: "kementerian", a: -2.9, b: 29.6, rot: 0 },
  { jenis: "parlemen", a: 5.2, b: 28.2, rot: 0 },
  { jenis: "kampus", a: 1.3, b: 31.9, rot: 0 },
  { jenis: "usaha", a: -4.9, b: 25.4, rot: 0 },
  { jenis: "pendopo", a: 6.1, b: 24.2, rot: 0 },
];
const bangunanAlumni = ALUMNI.map((x, k) => {
  const o = buatBangunanAlumni(x.jenis);
  dunia(x.a, x.b, 0, o.g.position);
  o.g.scale.setScalar(0.9);
  jalan.add(o.g);
  return { ...o, ...x, tMuncul: T_ALUMNI[0] + k * 0.24 };
});
const UJUNG_CABANG = [-1, 1].map((c) => tambah(titikJalan(S_RUAS[4]), SAMPING_CABANG, c * LAT_CABANG));
const garisAlumni = bangunanAlumni.map((bg, k) => {
  const asal = UJUNG_CABANG[bg.a < 1.5 ? 0 : 1];
  const pts = [];
  for (let j = 0; j <= 16; j++) { const u = j / 16; dunia(campur(asal.a, bg.a, u), campur(asal.b, bg.b, u), 0.05 + 0.5 * Math.sin(Math.PI * u), _v); pts.push(_v.x, _v.y, _v.z); }
  const L = Math.hypot(bg.a - asal.a, bg.b - asal.b) * 1.15;
  const mat = bahanGaris(W.zamrudPijar.clone().multiplyScalar(1.3), 2.6, 0, { dashed: true, dashSize: L * 1.1, gapSize: L * 1.1 });
  const g = garisSambung(pts, mat);
  jalan.add(g);
  return { g, mat, L, asal, tujuan: bg };
});

const barisan = Array.from({ length: 6 }, (_, k) => {
  const g = new THREE.Group();
  const p = pion(k % 2 ? W.pion : W.pionB);
  p.scale.setScalar(0.62);
  g.add(p);
  jalan.add(g);
  return { g, p, baris: Math.floor(k / 2), kolom: k % 2 ? 1 : -1, tujuan: bangunanAlumni[[0, 1, 3, 2, 4, 1][k]] };
});
const bendera = buatBendera();
bendera.g.scale.setScalar(0.9);
jalan.add(bendera.g);
// Bambu runcing dipikul empat figur selama ruas revolusi.
const matBambu = bahan(warna("hsl(70, 16%, 56%)"), { roughness: 0.7 });
const bambu = [0, 2, 3, 5].map((k) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.25, 6).translate(0, 0.62, 0), matBambu);
  m.castShadow = true;
  m.position.set(0.16, 0.38, 0);
  m.rotation.z = -0.5;
  barisan[k].g.add(m);
  return m;
});
const TITIK_BENDERA = titikJalan(S_RUAS[1] - 0.2);

const buku = buatBuku();
const S_BUKU = S_RUAS[2] + 1.9;
const POS_BUKU = tambah(titikJalan(S_BUKU), { a: -DIR_X.b, b: DIR_X.a }, -1.35);
dunia(POS_BUKU.a, POS_BUKU.b, 0, buku.g.position);
buku.g.rotation.y = Math.PI / 4;
jalan.add(buku.g);

// Garis angin di atas ruas 1960-an: lengkung putus-putus yang bergerak dari kiri ke kanan layar.
const angin = [];
{
  const r = acak(44);
  const tengah = tambah(Q[1], DIR_Z, 2.4);
  for (let k = 0; k < 11; k++) {
    const pts = [];
    const db = (r() - 0.5) * 4.2, y0 = 0.25 + r() * 1.45, fase = r() * 6;
    for (let j = 0; j <= 30; j++) {
      const u = j / 30, a = tengah.a - 4.2 + 8.4 * u;
      dunia(a, tengah.b + db + 0.35 * Math.sin(u * 5 + fase), y0 + 0.22 * Math.sin(u * 7.5 + fase), _v);
      pts.push(_v.x, _v.y, _v.z);
    }
    const mat = bahanGaris(warna("hsl(150, 25%, 82%)"), 2.4, 0, { dashed: true, dashSize: 1.3 + r() * 1.2, gapSize: 2.6 + r() * 2 });
    const g = garisSambung(pts, mat);
    jalan.add(g);
    angin.push({ g, mat, laju: 7 + r() * 4, geser: r() * 8 });
  }
}
const ARAH_ANGIN = dunia(1, 0, 0, new THREE.Vector3()).normalize(); // angin bertiup ke kanan layar (+a)

const lblEra = [
  { el: buatLabel("lbl-era", "<i></i>revolusi"), t: T_BARIS[0] + 0.3, s: 2.2, sisi: -1, dx: -120 },
  { el: buatLabel("lbl-era", "<i></i>1960-an"), t: T_ANGIN[0] + 0.1, s: S_RUAS[1] + 2.6, sisi: 1, dx: 170 },
  { el: buatLabel("lbl-era emas", "<i></i>NDP"), t: T_BUKU, s: S_BUKU, sisi: 1, dx: 70 },
  { el: buatLabel("lbl-era", "<i></i>1980-an"), t: T_CABANG[0] + 0.15, s: S_CABANG + 2.6, sisi: -1, dx: -120 },
  { el: buatLabel("lbl-era", "<i></i>alumni"), t: T_ALUMNI[0] + 0.2, s: null, sisi: -1, dx: -30 },
];

function perbaruiJalan(t) {
  const tampak = t > 27.5 && t < 42.8;
  jalan.visible = tampak;
  if (!tampak) { lblEra.forEach((l) => (l.el.style.opacity = "0")); return; }
  const tenggelam = halus(rentang(t, 41.95, 42.7));
  jalan.position.y = -2.6 * tenggelam;
  const s = sBarisan(t);
  for (const l of lempeng) {
    const k = lenting(rentang(t, l.tMuncul, l.tMuncul + 0.5), 1.2);
    l.m.visible = k > 0.002;
    l.m.scale.set(1, Math.max(0.001, k), 1);
    l.m.position.y = 0.07 * k;
  }
  const tumbuhPangkal = klem((s + 1.8 - S_CABANG) / (PISAH + 0.7));
  pangkalCabang.visible = tumbuhPangkal > 0.002;
  pangkalCabang.scale.set(Math.max(0.001, tumbuhPangkal), 1, 1);
  const tumbuhCabang = klem((s + 1.8 - S_PISAH) / PANJANG_CABANG);
  jalurCabang.forEach((m) => { m.visible = tumbuhCabang > 0.002; m.scale.set(Math.max(0.001, tumbuhCabang), 1, 1); });
  // Jejak zamrud mengikuti barisan.
  const kj = klem((s - 0.2) / PANJANG_JEJAK);
  matGarisJejak.opacity = kj > 0 ? 0.9 : 0;
  matGarisJejak.dashOffset = PANJANG_JEJAK * 1.1 * (1 - kj);
  jejakCabang.forEach((jc) => { const k = klem((s - S_CABANG) / jc.L); jc.mat.opacity = k > 0 ? 0.9 : 0; jc.mat.dashOffset = jc.L * 1.1 * (1 - k); });

  // Barisan.
  const kuatAngin = jendela(t, T_ANGIN[0], T_ANGIN[1], 0.3, 0.4);
  const melangkah = t > 27.9 && t < 34.6 ? 1 : 0;
  barisan.forEach((f, k) => {
    let sf = s - 0.55 * f.baris;
    const p = titikJalan(sf);
    const d = arahJalan(sf);
    let lat = f.kolom * 0.3;
    let samping = { a: -d.b, b: d.a };
    if (sf > S_CABANG) { lat = f.kolom * Math.max(0.3 * (1 - halus((sf - S_CABANG) / 0.5)), geserCabang(sf)) ; samping = SAMPING_CABANG; lat = f.kolom * Math.max(0.3, geserCabang(sf)); }
    let pa = p.a + samping.a * lat, pb = p.b + samping.b * lat;
    let skala = 1, alfa = 1;
    // Alumni: menyebar ke bangunan masing-masing lalu masuk.
    const tSebar = T_ALUMNI[0] - 0.1 + 0.12 * k;
    if (t > tSebar) {
      const u = halus(rentang(t, tSebar, tSebar + 1.0));
      const tj = f.tujuan;
      pa = campur(pa, tj.a + 0.6, u); pb = campur(pb, tj.b - 0.9, u);
      skala = 1 - 0.7 * halus(rentang(t, tSebar + 0.7, tSebar + 1.15));
      alfa = 1 - halus(rentang(t, tSebar + 0.8, tSebar + 1.15));
    }
    dunia(pa, pb, 0.14, f.g.position);
    const langkah = melangkah * Math.abs(Math.sin(Math.PI * (t - 28.0) / 0.48 + (f.baris % 2) * 0.4));
    f.g.position.y = 0.14 + 0.07 * langkah;
    // Condong melawan angin, bergoyang tetapi tidak roboh.
    const condong = kuatAngin * (0.46 + 0.12 * Math.sin(t * 10 + k * 1.7)) + 0.05 * melangkah * Math.sin(Math.PI * (t - 28) / 0.48);
    _v2.copy(ARAH_ANGIN).multiplyScalar(-1);
    _v.crossVectors(NAIK, _v2).normalize();
    f.g.quaternion.setFromAxisAngle(_v, condong);
    const hadir = lenting(rentang(t, 27.85 + 0.05 * k, 28.25 + 0.05 * k), 1.4);
    f.g.scale.setScalar(Math.max(0.001, skala * hadir));
    f.g.visible = alfa > 0.02 && hadir > 0.002;
    f.p.material.opacity = alfa;
    f.p.material.transparent = alfa < 1;
  });
  // Bendera dibawa figur terdepan selama revolusi, lalu ditancapkan di ujung ruas pertama.
  const pembawa = barisan[1];
  const tancap = t > 29.75;
  if (!tancap) { const d = arahJalan(s); dunia(0, 0, 0, _v2); bendera.g.position.copy(pembawa.g.position).add(dunia(-d.b * 0.22, d.a * 0.22, 0, _v)); }
  else dunia(TITIK_BENDERA.a + 0.5, TITIK_BENDERA.b + 0.15, 0.14, bendera.g.position);
  const hadirBendera = lenting(rentang(t, 27.95, 28.35), 1.4);
  bendera.g.visible = hadirBendera > 0.002;
  bendera.g.scale.setScalar(0.9 * Math.max(0.001, hadirBendera));
  const bawaBambu = 1 - halus(rentang(t, 30.0, 30.4));
  bambu.forEach((m) => { m.visible = bawaBambu > 0.01; m.scale.setScalar(Math.max(0.001, bawaBambu)); });
  bendera.g.rotation.y = Math.PI / 4;
  bendera.kain.rotation.y = 0.25 * Math.sin(t * 5) - 0.2;
  bendera.kain.material.emissiveIntensity = 0.25 + 0.15 * Math.sin(t * 3);

  // Angin.
  angin.forEach((a) => { a.mat.opacity = 0.75 * kuatAngin; a.g.visible = kuatAngin > 0.01; a.mat.dashOffset = -(t * a.laju + a.geser); });

  // Buku NDP menyala.
  const nyala = halus(rentang(t, T_BUKU, T_BUKU + 0.5));
  const kilat = t >= T_BUKU ? Math.exp(-(t - T_BUKU) * 2.5) : 0;
  const bukuK = lenting(rentang(t, T_BUKU - 0.7, T_BUKU - 0.2), 1.2);
  buku.g.scale.setScalar(Math.max(0.001, bukuK) * 1.35);
  buku.g.visible = bukuK > 0.002;
  const redupBuku = 1 - 0.65 * halus(rentang(t, 36.0, 37.0));
  buku.matHalaman.emissiveIntensity = nyala * (0.42 + 0.6 * kilat) * redupBuku;
  buku.matHalamanTepi.emissiveIntensity = nyala * (0.1 + 0.3 * kilat) * redupBuku;
  buku.pijar.material.opacity = nyala * (0.28 + 0.3 * kilat) * redupBuku;
  buku.lampu.intensity = nyala * (1.6 + 2.4 * kilat) * redupBuku;
  buku.matSorot.uniforms.uKuat.value = nyala * (0.22 + 0.3 * kilat) * redupBuku;
  buku.percik.forEach((p, k) => {
    const u = ((t - T_BUKU) * 0.45 + k / buku.percik.length) % 1;
    p.position.set(Math.sin(k * 2.3) * 0.45 * (1 - u * 0.5), 1.0 + u * 2.6, Math.cos(k * 1.7) * 0.4);
    p.material.opacity = nyala * Math.sin(Math.PI * u) * 0.9 * redupBuku;
  });

  // Bangunan alumni muncul, garis zamrud tersambung dari ujung jalur.
  bangunanAlumni.forEach((bg) => {
    const k = lenting(rentang(t, bg.tMuncul, bg.tMuncul + 0.55), 1.4);
    bg.g.visible = k > 0.002;
    bg.g.scale.set(0.9, 0.9 * Math.max(0.001, k), 0.9);
    bg.matJendela.emissiveIntensity = halus(rentang(t, bg.tMuncul + 0.3, bg.tMuncul + 0.7)) * 1.1;
  });
  garisAlumni.forEach((ga, k) => {
    const u = halus(rentang(t, ga.tujuan.tMuncul - 0.15, ga.tujuan.tMuncul + 0.45));
    ga.mat.opacity = u > 0 ? 0.85 : 0;
    ga.mat.dashOffset = ga.L * 1.1 * (1 - u);
  });

  // Label era.
  const pudarEra = 1 - halus(rentang(t, 36.0, 36.5));
  lblEra.forEach((l, k) => {
    const a = halus(rentang(t, l.t, l.t + 0.3)) * pudarEra;
    const aktif = jendela(t, l.t, (lblEra[k + 1]?.t ?? 36) + 0.1, 0.2, 0.3);
    l.el.style.borderColor = aktif > 0.5 ? (k === 2 ? "hsl(42 60% 62%)" : "hsl(153 52% 58%)") : "";
    if (l.s === null) dunia(0.6, 30.3, 1.2, _v);
    else if (k === 2) dunia(POS_BUKU.a, POS_BUKU.b, 1.9, _v);
    else { const p = titikJalan(l.s); dunia(p.a, p.b, 0.2, _v); }
    taruh(l.el, _v, a * (0.4 + 0.6 * aktif), { ax: l.sisi < 0 ? 1 : 0, ay: 0.5, dx: l.dx, jepit: true, skala: 0.92 + 0.08 * lenting(rentang(t, l.t, l.t + 0.35)) });
  });
}

// ---------------------------------------------------------------- modal yang bocor: titik cabang dan tarik tambang
const PUSAT_LADANG = { a: 0.4, b: 26.2 };
const TAMBANG = [{ a: 3.7, b: 19.2 }, { a: -3.8, b: 21.6 }, { a: -2.4, b: 33.4 }];
const tambang = TAMBANG.map((p, k) => {
  const o = buatTarikTambang(60 + k);
  dunia(p.a, p.b, 0, o.g.position);
  o.g.rotation.y = Math.PI / 4;
  scene.add(o.g);
  dunia(p.a, p.b, 0.55, (o.pusat = new THREE.Vector3()));
  return { ...o, p, k };
});
const titikCabang = [];
{
  const r = acak(91);
  let coba = 0;
  while (titikCabang.length < 340 && coba++ < 6000) {
    const a = (r() - 0.5) * 22, b = 7 + r() * 40;
    if (TAMBANG.some((q) => Math.abs(a - q.a) < 3.0 && Math.abs(b - q.b) < 1.8)) continue;
    if (ALUMNI.some((q) => Math.hypot(a - q.a, b - q.b) < 1.4)) continue;
    const d = Math.hypot(a - PUSAT_LADANG.a, (b - PUSAT_LADANG.b) * 0.6);
    titikCabang.push({ a, b, d, bocor: r() < 0.5, u: r(), tujuan: TAMBANG.reduce((m, q, i) => (Math.hypot(a - q.a, b - q.b) < Math.hypot(a - TAMBANG[m].a, b - TAMBANG[m].b) ? i : m), 0) });
  }
}
const D_MAKS = Math.max(...titikCabang.map((p) => p.d));
const geoTitik = new THREE.BufferGeometry();
{
  const pos = [], tOn = [], bocor = [], acakA = [];
  for (const p of titikCabang) {
    dunia(p.a, p.b, 0.08, _v);
    pos.push(_v.x, _v.y, _v.z);
    tOn.push(T_TITIK[0] + (T_TITIK[1] - T_TITIK[0] - 0.3) * (p.d / D_MAKS) + 0.12 * p.u);
    bocor.push(p.bocor ? 1 : 0);
    acakA.push(p.u);
  }
  geoTitik.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geoTitik.setAttribute("aNyala", new THREE.Float32BufferAttribute(tOn, 1));
  geoTitik.setAttribute("aBocor", new THREE.Float32BufferAttribute(bocor, 1));
  geoTitik.setAttribute("aAcak", new THREE.Float32BufferAttribute(acakA, 1));
}
const matTitik = new THREE.ShaderMaterial({
  uniforms: { uT: { value: 0 }, uKuras: { value: 0 }, uHilang: { value: 0 }, uUkuran: { value: 22 }, uZamrud: { value: W.zamrudPijar.clone().multiplyScalar(1.5) }, uAbu: { value: W.abu.clone() } },
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `uniform float uT; uniform float uKuras; uniform float uHilang; uniform float uUkuran; attribute float aNyala; attribute float aBocor; attribute float aAcak;
    varying float vA; varying float vAbu;
    void main(){
      float on = smoothstep(aNyala, aNyala + 0.18, uT);
      float kilat = uT > aNyala ? exp(-(uT - aNyala) * 5.0) : 0.0;
      float kuras = uKuras * (aBocor > 0.5 ? 1.0 : 0.45);
      vAbu = kuras;
      vA = on * (1.0 - 0.72 * kuras) * (1.0 - uHilang) * (0.8 + 0.2 * sin(uT * 3.0 + aAcak * 30.0)) + kilat * 0.8;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uUkuran * (0.75 + 0.5 * aAcak) * (1.0 + kilat * 0.6);
    }`,
  fragmentShader: `uniform vec3 uZamrud; uniform vec3 uAbu; varying float vA; varying float vAbu;
    void main(){ float d = length(gl_PointCoord - 0.5); float inti = 1.0 - smoothstep(0.08, 0.2, d); float halo = 1.0 - smoothstep(0.0, 0.5, d);
      vec3 c = mix(uZamrud, uAbu, vAbu); gl_FragColor = vec4(c, (inti * 0.9 + halo * 0.35) * vA); }`,
});
const ladang = new THREE.Points(geoTitik, matTitik);
ladang.frustumCulled = false;
scene.add(ladang);
// Partikel energi yang mengalir dari titik ke tali tarik-menarik.
const N_ALIR = 220;
const geoAlir = new THREE.BufferGeometry();
const posAlir = new Float32Array(N_ALIR * 3), aAlir = new Float32Array(N_ALIR);
geoAlir.setAttribute("position", new THREE.BufferAttribute(posAlir, 3).setUsage(THREE.DynamicDrawUsage));
geoAlir.setAttribute("aU", new THREE.BufferAttribute(aAlir, 1).setUsage(THREE.DynamicDrawUsage));
const matAlir = new THREE.ShaderMaterial({
  uniforms: { uKuat: { value: 0 }, uUkuran: { value: 12 }, uZamrud: { value: W.zamrudPijar.clone() }, uAbu: { value: warna("hsl(150, 6%, 70%)") } },
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `uniform float uUkuran; attribute float aU; varying float vU;
    void main(){ vU = aU; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_PointSize = uUkuran * (1.0 - 0.45 * aU); }`,
  fragmentShader: `uniform float uKuat; uniform vec3 uZamrud; uniform vec3 uAbu; varying float vU;
    void main(){ float d = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.1, 0.5, d);
      vec3 c = mix(uZamrud, uAbu, smoothstep(0.0, 0.45, vU)) * 1.4; gl_FragColor = vec4(c, a * uKuat * min(1.0, 2.5 * sin(3.14159 * vU))); }`,
});
const alir = new THREE.Points(geoAlir, matAlir);
alir.frustumCulled = false;
scene.add(alir);
const sumberAlir = (() => {
  const bocor = titikCabang.filter((p) => p.bocor);
  const r = acak(92);
  return Array.from({ length: N_ALIR }, (_, k) => ({ p: bocor[Math.floor(r() * bocor.length)], fase: r(), laju: 0.55 + 0.35 * r() }));
})();

function perbaruiLadang(t, kam) {
  const tampak = t > 36.0 && t < 42.8;
  ladang.visible = tampak;
  alir.visible = tampak && t > T_BOCOR[0];
  const hilang = halus(rentang(t, 41.95, 42.6));
  matTitik.uniforms.uT.value = t;
  matTitik.uniforms.uKuras.value = halus(rentang(t, T_BOCOR[0] + 0.3, T_BOCOR[1]));
  matTitik.uniforms.uHilang.value = hilang;
  matTitik.uniforms.uUkuran.value = klem(500 / kam.H, 12, 26);
  matAlir.uniforms.uUkuran.value = klem(420 / kam.H, 12, 20);
  // Tarik tambang.
  tambang.forEach((tb) => {
    const muncul = lenting(rentang(t, T_TALI + 0.15 * tb.k, T_TALI + 0.15 * tb.k + 0.55), 1.3);
    tb.g.visible = tampak && muncul > 0.002;
    if (!tb.g.visible) return;
    tb.g.scale.set(1, Math.max(0.001, muncul), 1);
    tb.g.position.y = -2.0 * hilang;
    let dx = 0.12 * Math.sin(t * 2.4 + tb.k * 1.9);
    T_SENTAK.forEach((ts, j) => {
      if (t < ts) return;
      const arah = (j + tb.k) % 2 ? 1 : -1;
      const u = t - ts;
      dx += arah * 0.42 * (1 - Math.exp(-u * 7)) * Math.exp(-u * 1.1);
    });
    const sentak = T_SENTAK.reduce((m, ts) => Math.max(m, t >= ts ? Math.exp(-(t - ts) * 6) : 0), 0);
    tb.tali.position.x = dx;
    tb.tanda.position.x = dx;
    tb.tanda.material.emissive.copy(W.abu);
    tb.tanda.material.emissiveIntensity = 0.3 + 0.9 * sentak;
    tb.regu.forEach((r, s) => r.forEach((m, j) => {
      m.p.position.set(m.x0 + dx, 0, m.z0);
      const arah = s === 0 ? 1 : -1;
      m.p.rotation.set(0, 0, arah * (0.38 + 0.07 * Math.sin(t * 9 + j + s * 2) + 0.12 * sentak));
    }));
  });
  // Partikel mengalir dari titik yang bocor ke tali, berubah abu-abu.
  const kuatAlir = halus(rentang(t, T_BOCOR[0], T_BOCOR[0] + 0.6)) * (1 - hilang);
  matAlir.uniforms.uKuat.value = kuatAlir;
  if (alir.visible) {
    sumberAlir.forEach((s, k) => {
      const u = (((t - T_BOCOR[0]) * s.laju + s.fase) % 1 + 1) % 1;
      const tujuan = tambang[s.p.tujuan].pusat;
      dunia(s.p.a, s.p.b, 0.1, _v);
      const tinggi = 1.4 + 0.6 * s.fase;
      posAlir[k * 3] = campur(_v.x, tujuan.x, u);
      posAlir[k * 3 + 1] = campur(_v.y, tujuan.y, u) + tinggi * Math.sin(Math.PI * u);
      posAlir[k * 3 + 2] = campur(_v.z, tujuan.z, u);
      aAlir[k] = u;
    });
    geoAlir.attributes.position.needsUpdate = true;
    geoAlir.attributes.aU.needsUpdate = true;
  }
}

// ---------------------------------------------------------------- dua gapura dan figur muda
const gapura = GAPURA_B.map((b, k) => {
  const o = buatGapura(k === 0 ? 2045 : 2047);
  dunia(0, b, 0, o.g.position);
  o.g.rotation.y = Math.PI / 4 - 0.26;
  o.g.visible = false;
  scene.add(o.g);
  return { ...o, b, k };
});
const B_MUDA = [31.2, 37.3];
const muda = new THREE.Group();
const pionMuda = pion(W.pion);
muda.add(pionMuda);
scene.add(muda);
const bayanganMuda = [44.25, 45.25, 46.25].map((tk) => {
  const m = new THREE.Mesh(GEO_PION, new THREE.MeshBasicMaterial({ color: W.zamrudPijar.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(m);
  return { m, tk };
});
const lblUmur = buatLabel("lbl-umur", "<b>19</b><small>TAHUN</small>");
const elUmur = lblUmur.querySelector("b");
function keadaanMuda(t) {
  const k = halus(rentang(t, T_MUDA[0], T_MUDA[1]));
  const kt = keluar3(rentang(t, T_MUDA[0] + 0.1, T_MUDA[1] - 0.2));
  return { b: campur(B_MUDA[0], B_MUDA[1], k), skala: campur(0.62, 1.32, kt), k: kt };
}
function perbaruiGapura(t) {
  gapura.forEach((g) => {
    const tg = T_GAPURA[g.k];
    const naik = lenting(rentang(t, tg, tg + 0.75), 1.15);
    g.g.visible = naik > 0.002;
    if (!g.g.visible) return;
    g.g.position.y = -5.6 * (1 - naik);
    const kilat = t >= tg + 0.6 ? Math.exp(-(t - tg - 0.6) * 3) : 0;
    const lewat = T_LEWAT_GAPURA[g.k];
    const kilatLewat = t >= lewat - 0.08 ? Math.exp(-Math.max(0, t - lewat) * 3.2) * halus((t - lewat + 0.08) / 0.08) : 0;
    const sampai = g.k === 0 ? halus(rentang(t, T_MUDA[1] - 0.4, T_MUDA[1] + 0.3)) * (1 - halus(rentang(t, 47.8, 48.4))) : 0;
    g.matEmas.emissiveIntensity = 0.1 + 0.32 * kilat + 0.35 * kilatLewat + 0.12 * sampai;
    g.matPapanMuka.emissiveIntensity = 0.95 + 0.6 * kilat + 0.5 * kilatLewat;
    g.lampu.intensity = naik * (5 + 8 * kilat + 10 * kilatLewat);
    g.matTirai.uniforms.uKuat.value = halus(rentang(t, tg + 0.5, tg + 1.0)) * (0.1 * sampai + 0.32 * kilatLewat);
    if (t > 47.7) tambahBusa(g.g.position.x + 2.55, g.g.position.z - 2.55, 0.62, 0.6 * naik);
    if (t > 47.7) tambahBusa(g.g.position.x - 2.55, g.g.position.z + 2.55, 0.62, 0.6 * naik);
  });
  // Figur muda berjalan menuju gapura dan tumbuh lebih tinggi.
  const ada = jendela(t, T_MUDA[0] - 0.35, 48.35, 0.3, 0.35);
  muda.visible = ada > 0.01;
  const km = keadaanMuda(t);
  dunia(0, km.b, 0, muda.position);
  const jalan = t > T_MUDA[0] && t < T_MUDA[1] ? Math.abs(Math.sin(Math.PI * (t - T_MUDA[0]) / 0.42)) : 0;
  muda.position.y = 0.06 * jalan;
  muda.scale.setScalar(km.skala * Math.max(0.001, ada));
  pionMuda.material.emissive.copy(W.emasPijar);
  pionMuda.material.emissiveIntensity = 0.15 * halus(rentang(t, T_MUDA[1] - 0.3, T_MUDA[1] + 0.4));
  bayanganMuda.forEach((bm) => {
    const s = keadaanMuda(bm.tk);
    dunia(0, s.b, 0, bm.m.position);
    bm.m.scale.setScalar(s.skala);
    const a = halus(rentang(t, bm.tk, bm.tk + 0.25)) * (1 - halus(rentang(t, 47.75, 48.3)));
    bm.m.visible = a > 0.01;
    bm.m.material.opacity = 0.2 * a;
  });
  const umur = Math.round(19 + 19 * rentang(t, T_MUDA[0] + 0.15, T_MUDA[1] - 0.15));
  elUmur.textContent = String(umur);
  _v.copy(muda.position);
  _v.y = 1.0 * km.skala + 0.15;
  taruh(lblUmur, _v, ada * halus(rentang(t, T_MUDA[0] - 0.1, T_MUDA[0] + 0.25)), { ay: 1, dy: -10 });
}

// ---------------------------------------------------------------- bola dunia
export const R_BOLA = 4.7;
export const B_BOLA = B_AKHIR + 6.4;
export const Y_BOLA = 5.3;
const bola = buatBolaDunia(R_BOLA);
dunia(0, B_BOLA, Y_BOLA, bola.g.position);
bola.miring.quaternion.setFromAxisAngle(dunia(1, 0, 0, new THREE.Vector3()).normalize(), -0.36);
scene.add(bola.g);
const ASAL = TITIK_DUNIA[0];
const titikDunia = TITIK_DUNIA.map((p, k) => {
  const o = buatTitikDunia(R_BOLA, p.lon, p.lat, k === 0 ? null : ASAL);
  bola.putar.add(o.g);
  if (o.busur) bola.putar.add(o.busur);
  return { ...o, ...p };
});
const lblDunia = [
  { el: buatLabel("lbl-dunia kiri", "kampus"), nama: "Kairo" },
  { el: buatLabel("lbl-dunia", "riset"), nama: "Tokyo" },
  { el: buatLabel("lbl-dunia kiri", "forum dunia"), nama: "Jenewa" },
];
const _arahKamera = new THREE.Vector3(1, 1, 1).normalize();
function perbaruiBola(t) {
  const tampak = t > 51.5;
  bola.g.visible = tampak;
  if (!tampak) { lblDunia.forEach((l) => (l.el.style.opacity = "0")); return; }
  const lon = 74 + 2.4 * (t - 60);
  bola.putar.rotation.y = ((45 - lon) * Math.PI) / 180;
  const nyala = halus(rentang(t, T_DUNIA, T_DUNIA + 0.9));
  const kilat = t >= T_DUNIA ? Math.exp(-(t - T_DUNIA) * 2) : 0;
  bola.matBola.uniforms.uKuat.value = nyala * (0.6 + 0.4 * kilat) + 0.12;
  bola.matDarat.uniforms.uKuat.value = halus(rentang(t, T_DUNIA + 0.1, T_DUNIA + 1.0)) * 0.85;
  bola.matDarat.uniforms.uUkuran.value = 5.2;
  bola.matGrid.opacity = 0.32 * halus(rentang(t, T_DUNIA, T_DUNIA + 0.8));
  bola.matCincin.opacity = 0.4 * halus(rentang(t, T_DUNIA + 0.3, T_DUNIA + 1.2));
  bola.g.position.y = Y_BOLA + 0.08 * Math.sin(t * 1.2);
  titikDunia.forEach((p) => {
    const a = halus(rentang(t, p.tNyala, p.tNyala + 0.25));
    const kp = t >= p.tNyala ? Math.exp(-(t - p.tNyala) * 4) : 0;
    p.matInti.opacity = a;
    p.pijar.material.opacity = a * (0.7 + 0.3 * Math.sin(t * 4 + p.lon)) + kp;
    p.pijar.scale.setScalar(R_BOLA * (0.24 + 0.12 * kp));
    p.matTiang.opacity = a * 0.9;
    if (p.busur) { const u = halus(rentang(t, p.tNyala - 0.15, p.tNyala + 0.55)); p.busur.material.opacity = u > 0 ? 0.8 : 0; p.busur.material.dashOffset = p.panjang * (1 - u); }
  });
  lblDunia.forEach((l) => {
    const p = titikDunia.find((x) => x.nama === l.nama);
    p.g.children[0].getWorldPosition(_v);
    _v2.copy(_v).sub(bola.g.position).normalize();
    const hadap = halus((_v2.dot(_arahKamera) - 0.15) / 0.25);
    const a = halus(rentang(t, p.tNyala + 0.2, p.tNyala + 0.55)) * hadap;
    taruh(l.el, _v, a, { ax: l.el.classList.contains("kiri") ? 1 : 0, ay: 0.5, dx: l.el.classList.contains("kiri") ? -14 : 14 });
  });
}

// ---------------------------------------------------------------- ekspor
export function perbaruiDunia2(t, kam) {
  perbaruiJalan(t);
  perbaruiLadang(t, kam);
  perbaruiGapura(t);
  perbaruiBola(t);
}
export { Q0, PUSAT_LADANG, keadaanMuda };
