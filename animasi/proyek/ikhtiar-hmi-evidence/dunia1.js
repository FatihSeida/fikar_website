// Adegan 1–4: kitab dan rantai cahaya, satu nada, ruang kuliah 1947, tanggal lahir.
import * as THREE from "three";
import {
  scene, W, warna, bahan, sprite, bahanAditif, bahanSinar, ruas, aturRuas, titikUV,
  klem, campur, rentang, halus, keluar3, lenting, masukKeluar3,
} from "./dasar.js";
import { buatPion, warnaiPion, buatKitab, buatRuang, buatUbin, teksturUbin, TINGGI_PION } from "./benda.js";
import {
  TATA, T_KITAB, T_HALAMAN, T_RANTAI, N_TITIK, T_ASAL, FIGUR_NADA, JAKET, LAMA_PUTAR, T_SATU_NADA,
  T_RUANG, T_PENDIRI, T_NYALA, T_UBIN, T_BALIK, T_MUNDUR, LANGKAH_MUNDUR,
} from "./isyarat.js";

export const ASAL = new THREE.Vector3(0, 0, 0);
export const POS_KITAB = titikUV(TATA.KITAB.u, TATA.KITAB.v);
export const POS_PENDIRI = new THREE.Vector3(-1.5, 0.12, 0);
export const POS_MUNDUR = new THREE.Vector3(-2.06, 0.12, -0.38);
export const JAKET_PENDIRI = "hsl(160, 12%, 17%)";

// ---------------------------------------------------------------- kitab
const kitab = buatKitab();
kitab.rotation.y = Math.PI / 4; // punggung sejajar arah turun di layar, halaman membentang kiri-kanan
kitab.position.copy(POS_KITAB);
scene.add(kitab);
const cincinKitab = new THREE.Mesh(new THREE.RingGeometry(1.12, 1.15, 96).rotateX(-Math.PI / 2), bahanAditif(W.zamrudPijar.clone().multiplyScalar(1.4), 0));
cincinKitab.position.copy(POS_KITAB).setY(0.02);
scene.add(cincinKitab);

// ---------------------------------------------------------------- rantai cahaya: titik-titik yang disambung mata rantai
const ARAH_ASAL = ASAL.clone().sub(POS_KITAB).setY(0).normalize();
const SAMPING = new THREE.Vector3(ARAH_ASAL.z, 0, -ARAH_ASAL.x);
const JARAK = ASAL.distanceTo(POS_KITAB);
const kurva = new THREE.CatmullRomCurve3([
  POS_KITAB.clone().add(new THREE.Vector3(0, 0.42, 0)),
  POS_KITAB.clone().addScaledVector(ARAH_ASAL, 0.9).add(new THREE.Vector3(0, 1.5, 0)),
  POS_KITAB.clone().addScaledVector(ARAH_ASAL, JARAK * 0.4).addScaledVector(SAMPING, -0.9).add(new THREE.Vector3(0, 2.5, 0)),
  POS_KITAB.clone().addScaledVector(ARAH_ASAL, JARAK * 0.75).addScaledVector(SAMPING, 0.5).add(new THREE.Vector3(0, 2.0, 0)),
  ASAL.clone().addScaledVector(ARAH_ASAL, -1.2).add(new THREE.Vector3(0, 1.2, 0)),
  ASAL.clone().add(new THREE.Vector3(0, 0.78, 0)),
], false, "centripetal");
const PER_RUAS = 3;
const N_MATA = (N_TITIK - 1) * PER_RUAS;
const geoMata = new THREE.TorusGeometry(0.085, 0.02, 8, 24).scale(1.75, 1, 1);
const bahanMata = new THREE.MeshStandardMaterial({ color: W.zamrud.clone(), emissive: W.zamrudPijar.clone(), emissiveIntensity: 1.1, roughness: 0.35, metalness: 0.3, transparent: true });
const mata = new THREE.InstancedMesh(geoMata, bahanMata, N_MATA);
mata.frustumCulled = false;
scene.add(mata);
const dataMata = [];
for (let i = 0; i < N_MATA; i++) {
  const s = (i + 0.5) / N_MATA;
  const p = kurva.getPointAt(s), tg = kurva.getTangentAt(s);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), tg);
  if (i % 2) q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
  dataMata.push({ s, p, q });
}
const titikRantai = Array.from({ length: N_TITIK }, (_, i) => {
  const g = new THREE.Group();
  const inti = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), new THREE.MeshBasicMaterial({ color: W.krem.clone().multiplyScalar(1.5), transparent: true }));
  const pijar = sprite(warna("hsl(150, 60%, 70%)"), 0.9);
  g.add(inti, pijar);
  g.position.copy(kurva.getPointAt(i / (N_TITIK - 1)));
  scene.add(g);
  return { g, inti, pijar, s: i / (N_TITIK - 1) };
});
// Titik-titik kecil yang keluar dari halaman lalu bergabung ke awal rantai.
const percikHalaman = Array.from({ length: 7 }, (_, i) => {
  const s = sprite(warna("hsl(150, 60%, 72%)"), 0.42);
  scene.add(s);
  const a = (i / 7) * Math.PI * 2;
  return { s, dari: new THREE.Vector3(Math.cos(a) * 0.55, 0.2, Math.sin(a) * 0.4), t0: 1.95 + 0.07 * i };
});

// ---------------------------------------------------------------- titik asal emas
const asalInti = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), new THREE.MeshBasicMaterial({ color: W.emasPijar.clone().multiplyScalar(2.4) }));
const asalPijar = sprite(W.emas, 2.6);
const asal = new THREE.Group();
asal.add(asalInti, asalPijar);
asal.position.set(0, 0.78, 0);
scene.add(asal);
const cincinAsal = new THREE.Mesh(new THREE.RingGeometry(0.9, 0.98, 96).rotateX(-Math.PI / 2), bahanAditif(W.emasPijar.clone().multiplyScalar(1.4), 0));
cincinAsal.position.set(0, 0.025, 0);
const gelombangAsal = new THREE.Mesh(new THREE.RingGeometry(0.97, 1.0, 128).rotateX(-Math.PI / 2), bahanAditif(W.emasPijar.clone().multiplyScalar(1.4), 0));
gelombangAsal.position.set(0, 0.025, 0);
scene.add(cincinAsal, gelombangAsal);

// ---------------------------------------------------------------- figur satu nada
const bahanGarisNada = bahanAditif(W.zamrudPijar.clone().multiplyScalar(1.15), 0.5);
const figurNada = FIGUR_NADA.map((f) => {
  const p = buatPion(JAKET[f.jaket]);
  const pos = titikUV(f.u, f.v);
  p.position.copy(pos);
  p.scale.setScalar(f.skala);
  scene.add(p);
  const ke = Math.atan2(ASAL.x - pos.x, ASAL.z - pos.z);
  let beda = ke - f.arah;
  while (beda > Math.PI) beda -= Math.PI * 2;
  while (beda < -Math.PI) beda += Math.PI * 2;
  if (Math.abs(beda) < 1.2) beda += Math.sign(beda || 1) * 1.6; // pastikan putarannya terlihat
  const g = ruas(bahanGarisNada, 0.022);
  scene.add(g);
  return { f, p, pos, sudut0: f.arah, beda, garis: g, jauh: pos.length() };
});
const _a = new THREE.Vector3(), _b = new THREE.Vector3();

// ---------------------------------------------------------------- ruang kuliah 1947
const ruang = buatRuang();
scene.add(ruang);
const lampuRuang = new THREE.PointLight(W.emasPijar.clone(), 0, 8, 1.6);
lampuRuang.position.set(-0.4, 1.7, -0.5);
scene.add(lampuRuang);
// Sinar jendela miring ke dalam ruang.
const sinarJendela = [-0.55, 1.2].map((x) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2.4), bahanSinar(`float a = pow(1.0 - uv.y, 1.3) * smoothstep(0.0, 0.25, uv.x) * smoothstep(1.0, 0.75, uv.x); gl_FragColor = vec4(uWarna, a * uKuat);`, W.emasPijar));
  m.geometry.translate(0, -1.2, 0);
  m.position.set(x, 1.8, -1.95);
  m.rotation.x = -0.62;
  ruang.add(m);
  return m;
});
const pendiri = buatPion(JAKET_PENDIRI);
pendiri.position.copy(POS_PENDIRI);
pendiri.rotation.y = Math.PI / 2;
scene.add(pendiri);
const JAKET_1947 = ["hsl(30, 14%, 30%)", "hsl(205, 18%, 36%)", "hsl(160, 14%, 24%)", "hsl(24, 26%, 34%)", "hsl(220, 16%, 28%)", "hsl(80, 12%, 32%)", "hsl(352, 20%, 32%)"];
const mahasiswa = ruang.userData.kursiMhs.map((pos, k) => {
  const p = buatPion(JAKET_1947[k % JAKET_1947.length]);
  p.position.copy(pos);
  p.rotation.y = -Math.PI / 2;
  p.scale.setScalar(0.92);
  scene.add(p);
  return p;
});
// Sorotan emas dari atas: kerucut cahaya dan kolam cahaya di lantai.
const sorot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.62, 3.2, 40, 1, true), bahanSinar(`float a = pow(clamp(1.0 - uv.y, 0.0, 1.0), 1.1) * 0.5 + 0.08; gl_FragColor = vec4(uWarna, a * uKuat);`, W.emasPijar));
sorot.position.copy(POS_PENDIRI).setY(1.72);
scene.add(sorot);
const kolam = new THREE.Mesh(new THREE.CircleGeometry(0.7, 48).rotateX(-Math.PI / 2), bahanSinar(`float d = length(uv - 0.5) * 2.0; float a = (1.0 - smoothstep(0.55, 1.0, d)) * 0.8; gl_FragColor = vec4(uWarna, a * uKuat);`, W.emasPijar));
kolam.position.copy(POS_PENDIRI).setY(0.125);
scene.add(kolam);
export const POS_KOLAM = kolam.position.clone();

// ---------------------------------------------------------------- ubin kalender
const ubin = [
  buatUbin(teksturUbin("5", "Februari", "1922"), teksturUbin("12", "April", "1923")),
  buatUbin(teksturUbin("5", "Februari", "1947"), teksturUbin("5", "Februari", "1947")),
];
ubin[0].position.set(-1.4, 0.12, 1.2);
ubin[1].position.set(-1.4, 0.12, -1.2);
for (const u of ubin) { u.rotation.y = Math.PI / 4; scene.add(u); }

// ---------------------------------------------------------------- pembaruan per detik
export function perbaruiDunia1(t) {
  // Kitab naik dari bawah grid, lalu tenggelam kembali setelah kamera pergi.
  const naik = keluar3(rentang(t, T_KITAB[0], T_KITAB[1]));
  const turun = halus(rentang(t, 9.0, 10.0));
  kitab.visible = naik > 0.001 && turun < 0.999;
  kitab.position.y = -0.55 * (1 - naik) - 0.55 * turun;
  kitab.rotation.x = 0.0;
  const balik = masukKeluar3(rentang(t, T_HALAMAN[0], T_HALAMAN[1]));
  const { poros, lembar } = kitab.userData;
  poros.rotation.z = Math.PI * balik;
  lembar.scale.x = 1 - 0.22 * Math.sin(Math.PI * balik);
  lembar.position.y = 0.004 + 0.06 * Math.sin(Math.PI * balik);
  poros.visible = balik > 0.001 && balik < 0.985;
  const kc = rentang(t, T_KITAB[0] + 0.2, T_KITAB[1] + 0.5);
  cincinKitab.material.opacity = 0.45 * Math.sin(Math.PI * kc);
  cincinKitab.scale.setScalar(0.7 + 0.5 * keluar3(kc));
  cincinKitab.visible = kc > 0 && kc < 1;

  // Percik dari halaman.
  for (const p of percikHalaman) {
    const k = rentang(t, p.t0, p.t0 + 0.55);
    p.s.visible = k > 0 && k < 1;
    if (!p.s.visible) continue;
    _a.copy(p.dari).applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4).add(POS_KITAB);
    _b.copy(kurva.getPointAt(0));
    p.s.position.copy(_a).lerp(_b, halus(k));
    p.s.position.y += 0.35 * Math.sin(Math.PI * k);
    p.s.material.opacity = Math.sin(Math.PI * k);
  }

  // Rantai: kepala berjalan dari kitab ke titik asal; setelah adegan 2 dimulai rantai memudar.
  const kepala = rentang(t, T_RANTAI[0], T_RANTAI[1]);
  const pudar = 1 - halus(rentang(t, 7.2, 9.0));
  const tampakRantai = t >= T_RANTAI[0] && pudar > 0.001;
  mata.visible = tampakRantai;
  bahanMata.opacity = pudar;
  const m4 = new THREE.Matrix4(), sk = new THREE.Vector3();
  if (tampakRantai) {
    for (let i = 0; i < N_MATA; i++) {
      const d = dataMata[i];
      const k = lenting(klem((kepala - d.s) * 40), 1.6);
      sk.setScalar(Math.max(k, 0.0001));
      mata.setMatrixAt(i, m4.compose(d.p, d.q, sk));
    }
    mata.instanceMatrix.needsUpdate = true;
  }
  bahanMata.emissiveIntensity = 1.1 + 0.6 * Math.exp(-Math.abs(t - T_ASAL) * 4);
  titikRantai.forEach((x, i) => {
    const k = klem((kepala - x.s) * 30 + 0.05);
    const ujung = Math.exp(-Math.abs(kepala - x.s) * 30) * (kepala < 1 ? 1 : 0);
    x.g.visible = tampakRantai && k > 0;
    x.g.scale.setScalar(lenting(k, 2) * (1 + 0.6 * ujung));
    x.inti.material.opacity = pudar;
    x.pijar.material.opacity = (0.65 + 0.35 * ujung) * pudar;
  });

  // Titik asal: menyala emas saat rantai tiba, lalu menjadi pusat adegan 2 dan turun ke pendiri.
  const nyalaAsal = 0.35 * halus(rentang(t, T_RANTAI[0], T_RANTAI[0] + 0.6)) + 0.65 * halus(rentang(t, T_ASAL - 0.3, T_ASAL));
  const kilat = t >= T_ASAL ? Math.exp(-(t - T_ASAL) * 3) : 0;
  const denyut = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 / 1.7);
  const keRuang = halus(rentang(t, T_PENDIRI - 0.9, T_PENDIRI));
  asal.visible = nyalaAsal > 0.001 && t < T_PENDIRI + 0.05;
  asal.position.set(campur(0, POS_PENDIRI.x, keRuang), campur(0.78, 0.95, keRuang), 0);
  asalInti.scale.setScalar((0.6 + 0.4 * nyalaAsal) * (1 + 0.5 * kilat) * (1 - 0.6 * keRuang));
  asalPijar.material.opacity = nyalaAsal * (0.75 + 0.2 * denyut + 0.5 * kilat);
  asalPijar.scale.setScalar(2.6 + 1.6 * kilat + 0.6 * nyalaSatuNada(t));
  const aCincin = nyalaAsal * (1 - halus(rentang(t, 12.2, 12.8)));
  cincinAsal.visible = aCincin > 0.001;
  cincinAsal.material.opacity = 0.7 * aCincin;
  cincinAsal.scale.setScalar(1 + 0.12 * denyut);
  const gw = rentang(t, T_ASAL, T_ASAL + 1.1);
  gelombangAsal.visible = gw > 0 && gw < 1;
  gelombangAsal.scale.setScalar(1 + 9 * keluar3(gw));
  gelombangAsal.material.opacity = 0.7 * (1 - gw) * (1 - gw);

  // Figur satu nada: muncul, berbalik menghadap titik asal, garis halus menyambung; tenggelam saat ruang kuliah naik.
  const nada = nyalaSatuNada(t);
  bahanGarisNada.opacity = 0.42 + 0.45 * nada;
  for (const x of figurNada) {
    const muncul = lenting(rentang(t, x.f.tMuncul, x.f.tMuncul + 0.4), 1.8);
    const tenggelam = halus(rentang(t, 12.0 + x.jauh * 0.025, 12.6 + x.jauh * 0.025));
    x.p.visible = muncul > 0.001 && tenggelam < 0.999;
    if (!x.p.visible) { x.garis.visible = false; continue; }
    const k = rentang(t, x.f.tPutar, x.f.tPutar + LAMA_PUTAR);
    x.p.rotation.y = x.sudut0 + x.beda * masukKeluar3(k);
    x.p.position.copy(x.pos);
    x.p.position.y = 0.13 * Math.sin(Math.PI * k) - 1.0 * tenggelam * tenggelam;
    x.p.scale.setScalar(x.f.skala * Math.max(muncul, 0.001));
    x.p.userData.tubuh.rotation.x = 0.1 * halus(rentang(t, x.f.tPutar + LAMA_PUTAR * 0.6, x.f.tPutar + LAMA_PUTAR + 0.3)) + 0.04 * nada;
    warnaiPion(x.p, { nyala: 0.25 * nada });
    const g = halus(rentang(t, x.f.tPutar + LAMA_PUTAR - 0.1, x.f.tPutar + LAMA_PUTAR + 0.5)) * (1 - halus(rentang(t, 11.9, 12.4)));
    _a.copy(x.pos).setY(0.52 * x.f.skala);
    _b.set(0, 0.78, 0);
    aturRuas(x.garis, _a, _b, g);
  }

  // Ruang kuliah tumbuh dari titik asal.
  const r = keluar3(rentang(t, T_RUANG[0], T_RUANG[1]));
  ruang.visible = r > 0.001;
  ruang.scale.set(campur(0.55, 1, r), Math.max(r, 0.001), campur(0.55, 1, r));
  const terang = halus(rentang(t, T_RUANG[0] + 0.6, T_RUANG[1] + 0.4));
  lampuRuang.intensity = 7 * terang;
  ruang.userData.mKaca.color.copy(W.emasPijar).multiplyScalar(0.4 + 0.9 * terang);
  for (const s of sinarJendela) s.material.uniforms.uKuat.value = 0.16 * terang;

  // Pendiri muncul dari titik asal yang turun ke depan kelas.
  const hadir = lenting(rentang(t, T_PENDIRI - 0.05, T_PENDIRI + 0.35), 1.6);
  const mundur = rentang(t, T_MUNDUR[0], T_MUNDUR[1]);
  const pergi = halus(rentang(t, T_MUNDUR[1] + 0.1, T_MUNDUR[1] + 1.1));
  pendiri.visible = hadir > 0.001 && pergi < 0.999 && t < 30;
  pendiri.scale.setScalar(Math.max(hadir, 0.001));
  pendiri.position.copy(POS_PENDIRI).lerp(POS_MUNDUR, masukKeluar3(mundur));
  let langkah = 0;
  for (const tl of LANGKAH_MUNDUR) langkah = Math.max(langkah, Math.max(0, Math.sin(Math.PI * rentang(t, tl - 0.25, tl))));
  pendiri.position.y += 0.06 * langkah;
  const kilatPendiri = t >= T_PENDIRI ? Math.exp(-(t - T_PENDIRI) * 2.5) : 0;
  warnaiPion(pendiri, { nyala: 0.55 * kilatPendiri + 0.35 * (1 - halus(mundur)), redup: 0.75 * halus(rentang(t, T_MUNDUR[0] + 0.5, T_MUNDUR[1])), opasitas: 1 - pergi });

  // Sorotan emas: tetap tinggal di ruang kuliah setelah pendiri mundur.
  const aSorot = halus(rentang(t, T_PENDIRI - 0.2, T_PENDIRI + 0.4)) * (1 - halus(rentang(t, 27.1, 27.6)) * 0.55);
  sorot.visible = kolam.visible = aSorot > 0.001;
  sorot.material.uniforms.uKuat.value = 0.32 * aSorot;
  kolam.material.uniforms.uKuat.value = 0.55 * aSorot * (1 + 0.25 * halus(mundur));
  kolam.scale.setScalar(1 + 0.3 * halus(mundur));

  // Empat belas mahasiswa menyala satu per satu.
  mahasiswa.forEach((p, k) => {
    const ada = halus(rentang(t, T_RUANG[0] + 0.9, T_RUANG[1] + 0.1));
    p.visible = ada > 0.001;
    p.scale.setScalar(0.92 * Math.max(ada, 0.001));
    const tn = T_NYALA[k];
    const n = halus(rentang(t, tn, tn + 0.15));
    const kejut = t >= tn ? Math.exp(-(t - tn) * 4) : 0;
    warnaiPion(p, { redup: 0.65 * (1 - n), nyala: 0.3 * n + 0.9 * kejut });
    p.position.y = 0.12 + 0.08 * kejut;
  });

  // Ubin kalender: berdiri, bersinar sama; ubin pertama berbalik menjadi 12 April 1923.
  const kb = masukKeluar3(rentang(t, T_BALIK[0], T_BALIK[1]));
  ubin.forEach((u, i) => {
    const k = lenting(rentang(t, T_UBIN[0] + 0.2 * i, T_UBIN[1] + 0.2 * i), 1.5);
    u.visible = k > 0.001;
    u.scale.set(Math.max(k, 0.001), Math.max(k, 0.001), Math.max(k, 0.001));
    const d = u.userData;
    const sinar = halus(rentang(t, T_UBIN[1], T_UBIN[1] + 0.5)) * (i === 0 ? 1 - halus(rentang(t, T_BALIK[0] + 0.3, T_BALIK[1] + 0.2)) : 1);
    const denyutU = 0.85 + 0.15 * Math.sin(t * Math.PI * 2 / 1.6);
    d.mBingkai.emissive.copy(W.emasPijar);
    d.mBingkai.emissiveIntensity = 0.55 * sinar * denyutU;
    d.mBingkai.color.copy(warna("hsl(153, 30%, 14%)")).lerp(W.emas, 0.6 * sinar);
    d.pijar.material.opacity = 0.5 * sinar * denyutU;
    d.muka.color.setScalar(0.72 + 0.06 * sinar);
    if (i === 0) {
      d.papan.rotation.y = Math.PI * kb;
      d.papan.position.y = 0.92 + 0.22 * Math.sin(Math.PI * kb);
    }
  });
}

// Denyut bersama "satu nada" (0..1).
export function nyalaSatuNada(t) {
  return halus(rentang(t, T_SATU_NADA - 0.2, T_SATU_NADA + 0.25)) * (1 - 0.55 * halus(rentang(t, T_SATU_NADA + 0.4, T_SATU_NADA + 1.4))) * (1 - halus(rentang(t, 11.8, 12.4)));
}
export { ruang, pendiri, mahasiswa, ubin, kitab };
