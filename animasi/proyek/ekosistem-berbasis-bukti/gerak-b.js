// Gerak adegan 6–9: bangunan berjenjang, aliran titik emas, tiga stasiun, kubah perisai, denyut grid penutup.
import * as THREE from "three";
import { W, scene, klem, campur, rentang, halus, keluar3, lenting, pegas, kejut, KANAN, BAWAH, sprite, tampakJalur, acak } from "./alat.js";
import { T } from "./isyarat.js";
import {
  A, HB, P_PB, dok, rumahK, cabang, badko, pb, SIMPUL, kilauPB, kilauSimpul, hubungRumah, hubungCabang, hubungBadko,
  stasiun, cincinEko, RING, kubah, cincinKubah, bahanTanah, ladang, ladangData, atrLadang, bahanLadang, tautLemari, kilauLemari,
} from "./dunia.js";

const _v = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _r = new THREE.Vector3();

// ---------------------------------------------------------------- titik-titik cahaya (shader titik aditif)
function sistemTitik(n, warnaC) {
  const pos = new Float32Array(n * 3), alfa = new Float32Array(n), ukuran = new Float32Array(n);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute("aAlfa", new THREE.BufferAttribute(alfa, 1).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute("aUkuran", new THREE.BufferAttribute(ukuran, 1).setUsage(THREE.DynamicDrawUsage));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uWarna: { value: warnaC.clone() }, uSkala: { value: 1 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aAlfa; attribute float aUkuran; uniform float uSkala; varying float vA;
      void main(){ vA = aAlfa; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_PointSize = aUkuran * uSkala; }`,
    fragmentShader: `uniform vec3 uWarna; varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.12, 0.5, d); float inti = 1.0 - smoothstep(0.0, 0.18, d);
        if (vA * a < 0.003) discard; gl_FragColor = vec4(uWarna * (1.0 + 0.8 * inti), vA * a); }`,
  });
  const p = new THREE.Points(g, mat);
  p.frustumCulled = false;
  scene.add(p);
  return { p, pos, alfa, ukuran, mat, g, n };
}
function perbarui(s) {
  s.g.attributes.position.needsUpdate = true;
  s.g.attributes.aAlfa.needsUpdate = true;
  s.g.attributes.aUkuran.needsUpdate = true;
}
// Busur a → b dengan tonjolan ke atas dan goyangan ke samping.
function padaBusur(a, b, u, angkat, goyang, out) {
  out.lerpVectors(a, b, u);
  out.y += 4 * angkat * u * (1 - u);
  out.addScaledVector(KANAN, goyang * Math.sin(Math.PI * u));
  return out;
}

// ---------------------------------------------------------------- aliran memori berjenjang
const N_ALIR = 1600;
const aliran = sistemTitik(N_ALIR, W.emasPijar.clone().multiplyScalar(1.25));
const dataAlir = [];
{
  const r = acak(91);
  const geser = () => new THREE.Vector3((r() - 0.5) * 0.4, (r() - 0.5) * 0.2, (r() - 0.5) * 0.4);
  for (let i = 0; i < N_ALIR; i++) {
    const h = Math.floor(r() * 5);
    const t0 = T.lipat[0] + 0.05 + r() * 0.45;
    const dur0 = 1.0 + r() * 0.35;
    const td = T.tingkat[0] + Math.pow(r(), 1.25) * 2.3;
    const turun = td < 34.3 && r() < 0.5;
    const tr = turun ? Math.max(td + 3.7, T.aliranTurun[0] + r() * 1.0) : 1e9;
    dataAlir.push({
      d: i % 3, h, t0, dur0, td, tr,
      gDok: geser().multiplyScalar(1.5), gRumah: geser(), gCabang: geser().multiplyScalar(1.6), gBadko: geser(), gPB: geser().multiplyScalar(0.6),
      angkat: [1.4 + r() * 0.8, 0.45 + r() * 0.4, 0.6 + r() * 0.4, 0.6 + r() * 0.4],
      goyang: (r() - 0.5) * 0.9, ukuran: 7 + r() * 7,
    });
  }
}
const LEG = 1.2, LEG_TURUN = 0.55;
function tampakkanAliran(t, kam) {
  aliran.mat.uniforms.uSkala.value = klem(12 / kam.H, 0.4, 1.4);
  const aktif = t > T.lipat[0] && t < 40.6;
  aliran.p.visible = aktif;
  if (!aktif) return;
  for (let i = 0; i < N_ALIR; i++) {
    const q = dataAlir[i];
    let a = 0;
    const o = _v;
    const rumahP = _r.copy(rumahK[q.h].atap).add(q.gRumah);
    if (t >= q.t0 && t < q.t0 + q.dur0) { // dokumen → rumah komisariat
      const u = (t - q.t0) / q.dur0;
      padaBusur(_b.copy(dok[q.d].pos).add(q.gDok), rumahP, u * u * (3 - 2 * u), q.angkat[0], q.goyang * 2, o);
      a = halus(u / 0.08) * (1 - halus((u - 0.85) / 0.15) * 0.6);
    } else if (t >= q.td && t < q.td + 3 * LEG) { // naik: rumah → cabang → Badko → PB
      const k = (t - q.td) / LEG, leg = Math.floor(k), u = k - leg;
      const titikL = [rumahP, _b.copy(SIMPUL.cabang).add(q.gCabang), null, null];
      if (leg === 0) padaBusur(titikL[0], titikL[1], u, q.angkat[1], q.goyang, o);
      else if (leg === 1) padaBusur(_a.copy(SIMPUL.cabang).add(q.gCabang), _b.copy(SIMPUL.badko).add(q.gBadko), u, q.angkat[2], q.goyang * 0.6, o);
      else padaBusur(_a.copy(SIMPUL.badko).add(q.gBadko), _b.copy(SIMPUL.pb).add(q.gPB), u, q.angkat[3], q.goyang * 0.4, o);
      a = (leg === 0 ? halus(u / 0.15) : 1) * (leg === 2 ? 1 - halus((u - 0.8) / 0.2) : 1);
    } else if (t >= q.tr && t < q.tr + 3 * LEG_TURUN) { // turun: PB → Badko → cabang → rumah
      const k = (t - q.tr) / LEG_TURUN, leg = Math.floor(k), u = k - leg;
      if (leg === 0) padaBusur(_a.copy(SIMPUL.pb).add(q.gPB), _b.copy(SIMPUL.badko).add(q.gBadko), u, 0.35, -q.goyang * 0.5, o);
      else if (leg === 1) padaBusur(_a.copy(SIMPUL.badko).add(q.gBadko), _b.copy(SIMPUL.cabang).add(q.gCabang), u, 0.35, -q.goyang * 0.6, o);
      else padaBusur(_a.copy(SIMPUL.cabang).add(q.gCabang), rumahP, u, 0.3, -q.goyang, o);
      a = 0.75 * (leg === 0 ? halus(u / 0.2) : 1) * (leg === 2 ? 1 - halus((u - 0.75) / 0.25) : 1);
    }
    aliran.alfa[i] = a;
    if (a > 0) { aliran.pos[i * 3] = o.x; aliran.pos[i * 3 + 1] = o.y; aliran.pos[i * 3 + 2] = o.z; }
    aliran.ukuran[i] = q.ukuran;
  }
  perbarui(aliran);
}

// ---------------------------------------------------------------- partikel emas yang berputar di antara tiga stasiun
const N_PUTAR = 96;
const putaran = sistemTitik(N_PUTAR, W.emasPijar.clone().multiplyScalar(1.3));
const S_STASIUN = [0, 139.8 / 360, 249.9 / 360, 1];
function bukaCincin(t) { // bagian cincin (0..1, searah jarum jam dari tangga) yang sudah tersambung
  const tahap = [[T.stasiun[1], S_STASIUN[1]], [T.stasiun[2], S_STASIUN[2]], [T.putar, 1]];
  let s = 0;
  for (let i = 0; i < 3; i++) {
    const [ta, sa] = tahap[i];
    const sb = i === 0 ? 0 : tahap[i - 1][1];
    if (t >= ta) s = Math.max(s, campur(sb, sa, halus(rentang(t, ta, ta + 0.55))));
  }
  return s;
}
function posCincin(s, out, y = 0.4) {
  const th = Math.PI - 0.351 - 2 * Math.PI * s;
  return out.copy(P_PB).addScaledVector(KANAN, Math.cos(th) * RING).addScaledVector(BAWAH, -Math.sin(th) * RING).setY(y);
}

// ---------------------------------------------------------------- titik data kader di rumah komisariat (adegan 8)
const titikKader = [];
{
  const r = acak(64);
  rumahK.forEach((rm, h) => {
    for (let i = 0; i < 7; i++) {
      const s = sprite(W.emasPijar, 0.24);
      s.material.opacity = 0;
      scene.add(s);
      titikKader.push({ s, h, fase: r() * Math.PI * 2, jari: 0.62 + r() * 0.2, y: 0.25 + r() * 0.95, laju: 0.4 + r() * 0.5 });
    }
  });
}

// ---------------------------------------------------------------- dunia pada detik t
export function gerakB(t, kam) {
  // Bangunan tumbuh dari grid.
  const naik = (m, ta, dur = 0.6) => {
    const k = lenting(rentang(t, ta, ta + dur), 1.3);
    m.visible = k > 0.002;
    m.scale.set(1, Math.max(0.001, k), 1);
  };
  rumahK.forEach((r, i) => naik(r.grup, T.bangunNaik[0] + 0.07 * i, 0.5));
  naik(cabang.grup, 32.05);
  naik(badko.grup, 32.3, 0.7);
  naik(pb.grup, 32.55, 0.8);

  // Denyut penutup: lingkaran zamrud meluas dari lemari di sepanjang grid.
  const R = t < T.denyutGrid[0] ? -1 : 34 * Math.pow(rentang(t, T.denyutGrid[0], T.denyutGrid[1]), 0.85);
  bahanTanah.uniforms.uDenyut.value = R;
  bahanTanah.uniforms.uKuatDenyut.value = halus(rentang(t, T.denyutGrid[0], T.denyutGrid[0] + 0.4));
  const lewat = (p) => (R < 0 ? 0 : halus((R - p.distanceTo(A)) / 1.2)); // 0..1: denyut sudah melewati titik ini
  const kilatDenyut = (p) => { if (R < 0) return 0; const d = R - p.distanceTo(A); return d > 0 ? Math.exp(-d / 1.6) : 0; };

  // Jendela menyala: rumah saat titik tiba, lalu tiap tingkat saat gelombang sampai.
  const nyalaTingkat = (ta) => (t >= ta ? 0.55 + 1.6 * kejut(t - ta, 2.2) : 0);
  const turunBalik = (ta) => (t >= ta ? 0.5 * kejut(t - ta, 1.5) : 0);
  rumahK.forEach((r) => {
    const k = 0.22 + nyalaTingkat(T.tingkat[0] - 0.2) + turunBalik(T.aliranTurun[0] + 1.4) + 1.2 * kilatDenyut(r.grup.position) + 0.3 * lewat(r.grup.position);
    for (const m of r.bahan) m.emissiveIntensity = k;
  });
  const tingkatB = [[cabang, T.tingkat[1]], [badko, T.tingkat[2]], [pb, T.tingkat[3]]];
  tingkatB.forEach(([g, ta], i) => {
    const k = 0.18 + nyalaTingkat(ta) * 0.8 + turunBalik(T.aliranTurun[0] + 0.55 * (2 - i)) + 1.0 * kilatDenyut(g.grup.position) + 0.25 * lewat(g.grup.position);
    for (const m of g.bahan) m.emissiveIntensity = k;
  });
  const mahkota = halus(rentang(t, T.tingkat[3] - 0.1, T.tingkat[3] + 0.25));
  pb.matMahkota.color.copy(warnaMahkota).lerp(W.emas, mahkota);
  pb.matMahkota.emissiveIntensity = mahkota * (1.0 + 1.2 * kejut(t - T.tingkat[3], 2.5) * (t > T.tingkat[3] ? 1 : 0));
  kilauPB.visible = mahkota > 0 && pb.grup.visible;
  kilauPB.material.opacity = mahkota * (0.55 + 0.45 * kejut(t - T.tingkat[3], 2) * (t > T.tingkat[3] ? 1 : 0));
  kilauPB.scale.setScalar(3.0 + 2.5 * kejut(t - T.tingkat[3], 3) * (t > T.tingkat[3] ? 1 : 0));
  kilauSimpul.forEach((s, i) => {
    const ta = T.tingkat[i + 1];
    s.visible = t > ta && t < ta + 1.5;
    s.material.opacity = 0.8 * kejut(t - ta, 2.5);
  });
  // Garis zamrud antartingkat: digambar mendahului gelombang titik.
  const garisT = (g, ta, dur) => tampakJalur(g.l, halus(rentang(t, ta, ta + dur)));
  hubungRumah.forEach((g, i) => garisT(g, T.tingkat[0] - 0.35 + 0.05 * i, 0.7));
  garisT(hubungCabang, T.tingkat[1] - 0.45, 0.8);
  garisT(hubungBadko, T.tingkat[2] - 0.45, 0.9);
  const terangHubung = 0.55 + 0.4 * halus(rentang(t, T.denyutGrid[0] + 1.2, T.denyutGrid[0] + 2.4));
  for (const g of [...hubungRumah, hubungCabang, hubungBadko]) g.mat.opacity = terangHubung * (g.l.visible ? 1 : 0);

  tampakkanAliran(t, kam);

  // Tiga stasiun: tumbuh bergantian, yang aktif menyala; pion mendaki tangga.
  const kalimat = [[T.stasiun[0], T.stasiun[1]], [T.stasiun[1], T.stasiun[2]], [T.stasiun[2], T.putar]];
  const semua = halus(rentang(t, T.putar, T.putar + 0.4)) * (1 - halus(rentang(t, 46.9, 47.6)));
  stasiun.forEach((s, i) => {
    naik(s.grup, T.stasiun[i] - 0.1, 0.55);
    const [a, b] = kalimat[i];
    const aktif = Math.max(halus(rentang(t, a, a + 0.3)) * (1 - halus(rentang(t, b, b + 0.3))), semua);
    s.alas.material.emissiveIntensity = 0.05 + 0.3 * aktif + 0.15 * lewat(s.pos);
    for (const m of s.matAktif) m.emissiveIntensity = 0.28 * aktif;
    s.aktif = aktif;
  });
  const tg = stasiun[0];
  const daki = Math.max(rentang(t, T.stasiun[0] + 0.3, T.stasiun[0] + 1.6), t > T.putar ? rentang(t, T.putar + 0.1, T.putar + 1.4) : 0);
  tg.pendaki.position.copy(tg.jalur(daki));
  stasiun[1].matLabel.emissiveIntensity = 0.5 + 1.2 * stasiun[1].aktif;
  stasiun[2].peserta.forEach((p, i) => { p.position.y = 0.1 + 0.04 * Math.max(0, Math.sin(t * 6 + i * 1.3)) * stasiun[2].aktif; });
  const buka = bukaCincin(t);
  tampakJalur(cincinEko.l, buka);
  cincinEko.mat.opacity = 0.85;
  putaran.mat.uniforms.uSkala.value = klem(12 / kam.H, 0.4, 1.4);
  putaran.p.visible = buka > 0 && t < 47.3;
  if (putaran.p.visible) {
    const pudar = 1 - halus(rentang(t, 46.8, 47.3));
    for (let i = 0; i < N_PUTAR; i++) {
      const s = (i / N_PUTAR + 0.21 * (t - T.stasiun[1])) % 1;
      posCincin(s, _v, 0.42 + 0.08 * Math.sin(i * 1.7 + t * 3));
      putaran.pos[i * 3] = _v.x; putaran.pos[i * 3 + 1] = _v.y; putaran.pos[i * 3 + 2] = _v.z;
      putaran.alfa[i] = (s <= buka ? 1 : 0) * pudar * (0.65 + 0.35 * Math.sin(i * 2.3)) * (1 + 0.6 * semua);
      putaran.ukuran[i] = 13 + 6 * ((i * 7) % 3);
    }
    perbarui(putaran);
  }

  // Kubah perisai dan titik data kader.
  const aKubah = t > T.perisai - 0.1 && t < 51.1;
  kubah.m.visible = aKubah;
  kubah.mat.uniforms.uNaik.value = halus(rentang(t, T.perisai, T.perisai + 0.7)) * 1.001;
  kubah.mat.uniforms.uKuat.value = (0.9 + 0.1 * Math.sin(t * 5)) * (1 - halus(rentang(t, 50.55, 51.0)));
  tampakJalur(cincinKubah.l, halus(rentang(t, T.perisai - 0.15, T.perisai + 0.25)));
  cincinKubah.l.visible = cincinKubah.l.visible && aKubah;
  cincinKubah.mat.opacity = 0.9 * (1 - halus(rentang(t, 50.55, 51.0)));
  const aTitik = halus(rentang(t, T.titikRumah, T.titikRumah + 0.4)) * (1 - halus(rentang(t, 50.5, 50.95)));
  for (const q of titikKader) {
    q.s.visible = aTitik > 0;
    if (!q.s.visible) continue;
    const r = rumahK[q.h].grup.position;
    const a = q.fase + q.laju * t;
    q.s.position.set(r.x + Math.cos(a) * q.jari, q.y + 0.08 * Math.sin(t * 2 + q.fase), r.z + Math.sin(a) * q.jari);
    q.s.material.opacity = 0.85 * aTitik;
  }

  // Ladang rumah: muncul ketika denyut lewat; jendela menyala.
  bahanLadang.uniforms.uFokus.value.set(kam.fx, 0, kam.fz);
  bahanLadang.uniforms.uJari.value = kam.H * 1.0;
  ladang.visible = R > 0;
  if (ladang.visible) {
    ladangData.forEach((g, i) => {
      const d = R - g.dA;
      const k = d > 0 ? lenting(klem(d / 2.4), 1.5) : 0;
      atrLadang.aGeser.array[i] = -(g.tinggi + 0.8) * (1 - k);
      atrLadang.aNyala.array[i] = d > 0 ? campur(0.25, 0.55 + 0.45 * g.kon, halus(d / 3)) + 1.2 * Math.exp(-d / 1.8) : 0;
    });
    atrLadang.aGeser.needsUpdate = true;
    atrLadang.aNyala.needsUpdate = true;
  }
  for (const tl of tautLemari) { tampakJalur(tl.l, R < 0 ? 0 : klem((R - 0.5) / tl.d)); tl.mat.opacity = 0.75; }
  // Cahaya tertata yang keluar dari lemari pada penutup.
  const cahaya = halus(rentang(t, T.cahayaTertata, T.cahayaTertata + 0.8));
  kilauLemari.visible = t > T.cahayaTertata;
  kilauLemari.material.opacity = cahaya * (0.55 + 0.25 * Math.sin(t * 2.4)) + 0.4 * kejut(t - T.cahayaTertata, 3) * (t > T.cahayaTertata ? 1 : 0);
  kilauLemari.scale.setScalar(2.6 + 1.6 * halus(rentang(t, T.mundur[0], T.mundur[1])));
}
const warnaMahkota = pb.matMahkota.color.clone();
