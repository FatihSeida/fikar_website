// Tata letak dunia: tanah bergrid, lemari dan sekitarnya (A), meja dokumen (B), bangunan berjenjang (C),
// tiga stasiun, kubah perisai, ladang rumah untuk penutup. Hanya membangun; gerak ada di gerak-*.js.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  W, DEG, scene, bahan, balok, bayang, sprite, titik, KANAN, BAWAH, warna, garisJalur, busur, bahanGaris, garisDari, acak, ARAH_CAHAYA,
} from "./alat.js";
import {
  pion, lemari, isiKusam, isiTertata, kepulDebu, balonPesan, balonKosong, kartuProker, KARTU, buku, halamanSobek, LEMARI,
} from "./benda-a.js";
import {
  lembarDokumen, sertifikat, suratKeputusan, stempel, amplop, labelEmas, rumah, gedungCabang, menaraBadko, menaraPB,
  stasiunTangga, stasiunRak, stasiunMeja, kubahPerisai,
} from "./benda-b.js";
import { T, acak as acakI } from "./isyarat.js";

// ---------------------------------------------------------------- titik-titik pokok
export const A = new THREE.Vector3(0, 0, 0);           // lemari sekretariat
export const B = titik(7.5, 0.8);                      // tempat dokumen (adegan 4–5)
export const HB = titik(0, -7.0);                      // pusat rumah-rumah komisariat
export const P_CABANG = titik(1.7, -10.2);
export const P_BADKO = titik(-3.0, -13.4);
export const P_PB = titik(0, -19.9);
export const ROT_LEMARI = 20 * DEG;

// ---------------------------------------------------------------- tanah bergrid (dengan denyut zamrud untuk penutup)
export const bahanTanah = new THREE.ShaderMaterial({
  uniforms: {
    uLatar: { value: W.latar }, uGaris: { value: W.grid }, uMayor: { value: W.gridMayor },
    uFokus: { value: new THREE.Vector3() }, uJari: { value: 20 },
    uPusat: { value: A.clone() }, uDenyut: { value: -1 }, uKuatDenyut: { value: 0 }, uZamrud: { value: W.zamrudPijar.clone() },
  },
  vertexShader: `
    varying vec3 vW;
    void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `
    uniform vec3 uLatar; uniform vec3 uGaris; uniform vec3 uMayor; uniform vec3 uFokus; uniform float uJari;
    uniform vec3 uPusat; uniform float uDenyut; uniform float uKuatDenyut; uniform vec3 uZamrud;
    varying vec3 vW;
    float garis(vec2 p, float tebal) {
      vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
      return 1.0 - min(min(g.x, g.y) / tebal, 1.0);
    }
    void main() {
      vec2 p = vW.xz + vec2(0.5, 0.5);
      float kecil = garis(p, 1.1);
      float besar = garis(p / 5.0, 1.5);
      float d = length(vW.xz - uFokus.xz);
      float pudar = 1.0 - smoothstep(uJari * 0.3, uJari, d);
      vec3 c = mix(uLatar, uGaris, kecil * pudar);
      c = mix(c, uMayor, besar * pudar);
      float dp = length(vW.xz - uPusat.xz);
      float dalam = 1.0 - smoothstep(uDenyut - 0.6, uDenyut, dp);
      float depan = exp(-pow((dp - uDenyut) / 1.1, 2.0));
      float g = max(kecil * 0.7, besar);
      c += uZamrud * g * (0.32 * dalam + 1.25 * depan) * uKuatDenyut * (1.0 - smoothstep(uJari * 0.55, uJari * 1.05, d));
      gl_FragColor = vec4(c, 1.0);
    }`,
});
const tanah = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), bahanTanah);
tanah.rotation.x = -Math.PI / 2;
tanah.position.copy(titik(0, -8));
scene.add(tanah);
const bayangan = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ color: warna("hsl(153, 60%, 2%)"), opacity: 0.5 }));
bayangan.rotation.x = -Math.PI / 2;
bayangan.position.copy(tanah.position).setY(0.004);
bayangan.receiveShadow = true;
scene.add(bayangan);

// ---------------------------------------------------------------- A: lemari sekretariat dan sekitarnya
export const L = lemari();
L.grup.position.copy(A);
L.grup.rotation.y = ROT_LEMARI;
scene.add(L.grup);
L.grup.updateMatrixWorld(true);
export const lokal = (x, y, z) => L.grup.localToWorld(new THREE.Vector3(x, y, z));
export const kusam = isiKusam();
L.grup.add(kusam);
export const tertata = isiTertata();
L.grup.add(tertata.grup);
export const sobekJatuh = halamanSobek(0.42, 0.54, 13);
scene.add(sobekJatuh);
export const debu = kepulDebu();
L.grup.add(debu.grup);
export const figur = bayang(pion(W.pion));
figur.scale.setScalar(1.12);
scene.add(figur);
export const figurBaru = bayang(pion(warna("hsl(150, 14%, 84%)")));
figurBaru.scale.setScalar(1.12);
scene.add(figurBaru);
export const JALAN_FIGUR = [lokal(-3.6, 0, 2.9), lokal(-1.42, 0, 1.6)];

export const balon = balonPesan();
scene.add(balon.grup);
export const slotBalasan = balonKosong();
scene.add(slotBalasan);

// Kartu program kerja: tiga kartu dalam satu rangka yang menghadap kamera.
export const rangkaKartu = new THREE.Group();
scene.add(rangkaKartu);
export const kartu = kartuProker(["lama", "baru"]);
export const salinan = [kartuProker(["baru"]), kartuProker(["baru"])];
rangkaKartu.add(kartu.grup, ...salinan.map((s) => s.grup));
export const KARTU_DARI = lokal(0.15, 1.3, 0.05);
export const KARTU_KE = lokal(0.2, 2.5, 1.5);

// Tumpukan buku aturan di samping lemari (bawah → atas).
export const tumpukan = new THREE.Group();
tumpukan.position.copy(lokal(2.75, 0, 0.2));
tumpukan.rotation.y = ROT_LEMARI - 0.04;
scene.add(tumpukan);
const DATA_BUKU = [
  { tebal: 0.28, panjang: 1.98, lebar: 1.34, sampul: warna("hsl(150, 10%, 28%)"), teks: "", dx: -0.02, ry: -0.02 },
  { tebal: 0.3, panjang: 1.92, lebar: 1.3, sampul: warna("hsl(160, 14%, 30%)"), teks: "", dx: 0.04, ry: 0.05 },
  { tebal: 0.26, panjang: 1.86, lebar: 1.28, sampul: warna("hsl(150, 8%, 38%)"), teks: "", dx: -0.05, ry: -0.06 },
  { tebal: 0.46, panjang: 2.02, lebar: 1.36, sampul: warna("hsl(140, 18%, 32%)"), teks: "Program Kerja", dx: 0.02, ry: 0.03 },
  { tebal: 0.5, panjang: 2.06, lebar: 1.38, sampul: warna("hsl(178, 26%, 28%)"), teks: "Pedoman Perkaderan", dx: -0.03, ry: -0.035 },
  { tebal: 0.44, panjang: 1.96, lebar: 1.34, sampul: warna("hsl(153, 44%, 26%)"), teks: "ART", dx: 0.03, ry: 0.045 },
];
export const bukuAturan = [];
{
  let y = 0;
  for (const d of DATA_BUKU) {
    const b = buku(d);
    b.position.set(d.dx, y, 0);
    b.rotation.y = d.ry;
    tumpukan.add(b);
    bukuAturan.push({ g: b, y, tebal: d.tebal });
    y += d.tebal;
  }
}
export const TINGGI_TUMPUKAN = DATA_BUKU.reduce((s, d) => s + d.tebal, 0);
tumpukan.updateMatrixWorld(true);
// Garis dari buku ke lemari: dua paruh yang nanti patah di tengah.
const ujungBuku = tumpukan.localToWorld(new THREE.Vector3(-0.2, TINGGI_TUMPUKAN + 0.02, 0.1));
const ujungLemari = lokal(0.35, LEMARI.h + 0.13, 0.15);
export const JALUR_ATURAN = busur(ujungBuku, ujungLemari, 0.85, 48);
function paruh(titikArr, jangkar) {
  const g = new THREE.Group();
  g.position.copy(jangkar);
  const rel = titikArr.map((p) => p.clone().sub(jangkar));
  const mat = bahanGaris(W.zamrud, 6, 0);
  const l = garisJalur(rel, mat);
  g.add(l);
  scene.add(g);
  return { g, l, mat, ujung: rel[rel.length - 1].clone() };
}
export const paruhBuku = paruh(JALUR_ATURAN.slice(0, 25), ujungBuku);
export const paruhLemari = paruh(JALUR_ATURAN.slice(24).reverse(), ujungLemari);
export const garisUtuh = (() => { const m = bahanGaris(W.zamrudPijar, 6, 0); const l = garisJalur(JALUR_ATURAN, m); scene.add(l); return { l, mat: m }; })();
export const percikPatah = sprite(warna("hsl(150, 5%, 70%)"), 0.9);
percikPatah.position.copy(JALUR_ATURAN[24]);
scene.add(percikPatah);

// ---------------------------------------------------------------- B: dokumen
const PUTAR_DOK = (el) => new THREE.Euler(-el * DEG, 45 * DEG, 0, "YXZ");
export const lembar = lembarDokumen();
lembar.grup.position.copy(B).add(titik(-0.1, 0, 1.95));
lembar.grup.rotation.copy(PUTAR_DOK(38));
lembar.grup.traverse((o) => { o.castShadow = false; });
scene.add(lembar.grup);
export const LABEL_ORBIT = ["siapa", "dari mana", "kapan", "terhubung dengan apa"];
export const PUSAT_ORBIT = lembar.grup.position.clone();
export const RING_ORBIT = 1.3;
// Tali orbit: garis zamrud tipis dari tepi lembar ke tiap label.
export const taliOrbit = LABEL_ORBIT.map(() => { const m = bahanGaris(W.zamrudPijar, 2.4, 0); const l = garisDari([0, 0, 0, 0, 0, 1], m); l.frustumCulled = false; scene.add(l); return { l, mat: m }; });
export const cincinOrbit = (() => {
  const pts = [];
  for (let i = 0; i <= 96; i++) { const a = (i / 96) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * RING_ORBIT, 0, Math.sin(a) * RING_ORBIT)); }
  const m = bahanGaris(W.zamrud, 2, 0);
  const l = garisJalur(pts, m);
  const g = new THREE.Group(); g.add(l); g.position.copy(PUSAT_ORBIT); scene.add(g);
  return { g, l, mat: m };
})();

export const dok = [
  { ...sertifikat(), nama: "sertifikat", w: 1.7, h: 1.2, kode: "0247", pos: B.clone().add(titik(-1.05, -0.55, 1.78)) },
  { ...suratKeputusan(), nama: "SK", w: 1.16, h: 1.6, kode: "0012", pos: B.clone().add(titik(1.02, 0.0, 1.36)) },
  { ...amplop(), nama: "surat", w: 1.5, h: 0.94, kode: "0118", pos: B.clone().add(titik(-0.72, 1.3, 0.86)) },
];
for (const d of dok) {
  d.grup.position.copy(d.pos);
  d.grup.rotation.copy(PUTAR_DOK(55));
  scene.add(d.grup);
  const t = labelEmas(d.kode);
  t.grup.position.set(-d.w / 2 + 0.02, d.h / 2 - 0.14, d.tebal / 2 + 0.012);
  t.grup.rotation.z = 0.2;
  d.grup.add(t.grup);
  d.tag = t;
  d.kilau = sprite(W.emasPijar, 1.2);
  d.kilau.material.opacity = 0;
  scene.add(d.kilau);
  d.grup.updateMatrixWorld(true);
  d.posTag = t.grup.getWorldPosition(new THREE.Vector3());
}
export const cap = stempel();
scene.add(cap);
export const NORMAL_DOK = new THREE.Vector3(0, 0, 1).applyEuler(PUTAR_DOK(55));
export const POS_CAP = dok[1].cap.getWorldPosition(new THREE.Vector3());
{ // sumbu stempel sejajar normal dokumen
  cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), NORMAL_DOK);
}
export const sambung = (() => {
  const p = [dok[0].posTag, dok[1].posTag, dok[2].posTag, dok[0].posTag];
  return [0, 1, 2].map((i) => { const m = bahanGaris(W.zamrudPijar, 4, 0); const l = garisJalur(busur(p[i], p[i + 1], 0.12, 24), m); scene.add(l); return { l, mat: m }; });
})();

// ---------------------------------------------------------------- C: bangunan berjenjang
const POS_RUMAH = [[-2.6, 0], [-1.35, 0.85], [0, 1.25], [1.35, 0.85], [2.6, 0]].map(([r, d]) => HB.clone().add(titik(r, d)));
export const rumahK = POS_RUMAH.map((p, i) => {
  const r = rumah();
  r.grup.position.copy(p);
  r.grup.rotation.y = (10 + 8 * Math.sin(i * 2.3)) * DEG;
  scene.add(r.grup);
  r.atap = p.clone().setY(1.36);
  return r;
});
export const cabang = gedungCabang();
cabang.grup.position.copy(P_CABANG);
cabang.grup.rotation.y = 0;
scene.add(cabang.grup);
export const badko = menaraBadko();
badko.grup.position.copy(P_BADKO);
scene.add(badko.grup);
export const pb = menaraPB();
pb.grup.position.copy(P_PB);
scene.add(pb.grup);
export const SIMPUL = {
  cabang: P_CABANG.clone().setY(2.0),
  badko: P_BADKO.clone().setY(4.55),
  pb: P_PB.clone().setY(pb.yMahkota),
};
export const kilauPB = sprite(W.emasPijar, 3.2);
kilauPB.position.copy(SIMPUL.pb);
kilauPB.material.opacity = 0;
scene.add(kilauPB);
export const kilauSimpul = [SIMPUL.cabang, SIMPUL.badko].map((p) => { const s = sprite(W.zamrudPijar, 2.2); s.position.copy(p); s.material.opacity = 0; scene.add(s); return s; });
// Garis zamrud antartingkat (busur atap ke atap).
const garisTingkat = (a, b, angkat) => { const m = bahanGaris(W.zamrud, 3, 0); const l = garisJalur(busur(a, b, angkat, 32), m); scene.add(l); return { l, mat: m }; };
export const hubungRumah = rumahK.map((r) => garisTingkat(r.atap, SIMPUL.cabang, 0.7));
export const hubungCabang = garisTingkat(SIMPUL.cabang, SIMPUL.badko, 0.9);
export const hubungBadko = garisTingkat(SIMPUL.badko, SIMPUL.pb, 1.0);

// ---------------------------------------------------------------- tiga stasiun di sekeliling menara PB
export const RING = 3.2;
export const stasiun = [
  { ...stasiunTangga(), pos: P_PB.clone().add(titik(-3.0, -1.1)), ry: 70 * DEG, nama: "Kaderisasi" },
  { ...stasiunRak(), pos: P_PB.clone().add(titik(3.0, -1.1)), ry: 18 * DEG, nama: "Tata kelola" },
  { ...stasiunMeja(), pos: P_PB.clone().add(titik(0, 3.2)), ry: 0, nama: "Kebijakan" },
];
for (const s of stasiun) { s.grup.position.copy(s.pos); s.grup.rotation.y = s.ry; scene.add(s.grup); }
export const cincinEko = (() => {
  const pts = [];
  for (let i = 0; i <= 128; i++) {
    const a = Math.PI - 0.351 - (i / 128) * Math.PI * 2; // searah jarum jam di layar, mulai dari tangga
    pts.push(P_PB.clone().addScaledVector(KANAN, Math.cos(a) * RING).addScaledVector(BAWAH, -Math.sin(a) * RING).setY(0.06));
  }
  const m = bahanGaris(W.zamrud, 3, 0);
  const l = garisJalur(pts, m);
  scene.add(l);
  return { l, mat: m };
})();

// ---------------------------------------------------------------- kubah perisai di atas rumah-rumah komisariat
export const kubah = kubahPerisai(1);
kubah.m.position.copy(HB).add(titik(0, 0.55));
kubah.m.rotation.y = 45 * DEG; // sumbu lokal x searah KANAN, z searah BAWAH
kubah.m.scale.set(3.55, 1.9, 1.75);
scene.add(kubah.m);
export const cincinKubah = (() => {
  const pts = [];
  for (let i = 0; i <= 96; i++) { const a = (i / 96) * Math.PI * 2; pts.push(kubah.m.position.clone().addScaledVector(KANAN, Math.cos(a) * 3.55).addScaledVector(BAWAH, Math.sin(a) * 1.75).setY(0.05)); }
  const m = bahanGaris(W.zamrudPijar, 3, 0);
  const l = garisJalur(pts, m);
  scene.add(l);
  return { l, mat: m };
})();

// ---------------------------------------------------------------- ladang rumah komisariat (penutup): muncul saat denyut lewat
export const ladangData = [];
{
  const r = acak(58);
  const JARAK = 2.4;
  for (let i = -6; i <= 6; i++) for (let j = -10; j <= 4; j++) {
    const rr = i * JARAK + (r() - 0.5) * 1.0, dd = j * JARAK + (r() - 0.5) * 1.0;
    const tinggi = 0.55 + r() * 0.6, lebar = 0.8 + r() * 0.3, kon = r();
    const p = titik(rr, dd);
    const dA = p.distanceTo(A);
    if (dA < 4.6) continue;
    if (Math.abs(rr) < 5.2 && dd < -4.2 && dd > -24.5) continue; // kolom bangunan berjenjang
    if (p.distanceTo(B) < 3.4) continue;
    if (Math.abs(rr - 2.75) < 2.6 && Math.abs(dd + 0.8) < 2.4) continue; // tumpukan buku
    if (Math.abs(rr) > 13.5) continue;
    ladangData.push({ p, dA, tinggi, lebar, kon });
  }
}
const N_LADANG = ladangData.length;
const geoLadang = (() => {
  const badan = new THREE.BoxGeometry(0.9, 1, 0.9).translate(0, 0.5, 0);
  const atap = new THREE.ConeGeometry(0.68, 0.42, 4, 1).rotateY(Math.PI / 4).translate(0, 1.21, 0);
  badan.setAttribute("aAtap", new THREE.BufferAttribute(new Float32Array(badan.attributes.position.count).fill(0), 1));
  atap.setAttribute("aAtap", new THREE.BufferAttribute(new Float32Array(atap.attributes.position.count).fill(1), 1));
  return mergeGeometries([badan, atap]);
})();
export const atrLadang = {};
for (const [nama, dinamis] of [["aTinggi", false], ["aNyala", true], ["aGeser", true]]) {
  const a = new THREE.InstancedBufferAttribute(new Float32Array(N_LADANG), 1);
  if (dinamis) a.setUsage(THREE.DynamicDrawUsage);
  geoLadang.setAttribute(nama, a);
  atrLadang[nama] = a;
}
export const bahanLadang = new THREE.ShaderMaterial({
  uniforms: {
    uL: { value: ARAH_CAHAYA }, uBadan: { value: warna("hsl(153, 26%, 15%)") }, uAtap: { value: warna("hsl(153, 30%, 11%)") },
    uHijau: { value: W.zamrudPijar.clone() }, uLatar: { value: W.latar }, uFokus: { value: new THREE.Vector3() }, uJari: { value: 30 },
  },
  vertexShader: `
    attribute float aAtap; attribute float aTinggi; attribute float aNyala; attribute float aGeser;
    varying vec3 vN; varying vec3 vLokal; varying vec3 vDunia; varying float vNyala; varying float vAtap; varying float vH; varying vec2 vAsal;
    void main() {
      vAsal = instanceMatrix[3].xz;
      float h = aTinggi;
      vec3 p = position;
      p.y = aAtap > 0.5 ? p.y - 1.0 + h : p.y * h;
      vLokal = p;
      p.y += aGeser;
      vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
      vDunia = w.xyz;
      vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
      vNyala = aNyala; vAtap = aAtap; vH = h;
      gl_Position = projectionMatrix * viewMatrix * w;
    }`,
  fragmentShader: `
    uniform vec3 uL; uniform vec3 uBadan; uniform vec3 uAtap; uniform vec3 uHijau; uniform vec3 uLatar; uniform vec3 uFokus; uniform float uJari;
    varying vec3 vN; varying vec3 vLokal; varying vec3 vDunia; varying float vNyala; varying float vAtap; varying float vH; varying vec2 vAsal;
    float acak(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
    void main() {
      if (vDunia.y < -0.01) discard;
      vec3 n = normalize(vN);
      float dif = max(dot(n, uL), 0.0);
      vec3 alb = mix(uBadan, uAtap, vAtap);
      vec3 c = alb * (0.55 + 0.25 * n.y + 1.35 * dif);
      float sisi = (1.0 - vAtap) * (1.0 - step(0.5, abs(n.y)));
      float u = abs(n.x) > 0.5 ? vLokal.z : vLokal.x;
      float kolom = 1.0 - step(0.085, abs(abs(u) - 0.2));
      float baris = step(0.12, vLokal.y) * step(vLokal.y, vH - 0.1) * (1.0 - step(0.15, fract((vLokal.y - 0.12) / 0.3) * 0.3));
      float jendela = sisi * kolom * baris;
      float muka = abs(n.x) > 0.5 ? 1.0 + sign(n.x) : 4.0 + sign(n.z);
      float nomor = acak(vec3(vAsal * 0.731 + muka * 1.37, floor((vLokal.y - 0.12) / 0.3) + 7.0 * step(0.0, u)));
      float pecahan = clamp(vNyala, 0.0, 1.0);
      float kilat = max(vNyala - 1.0, 0.0);
      float nyalaJendela = step(nomor, pecahan * 1.02 - 0.01);
      c *= 1.0 - 0.45 * jendela;
      c += uHijau * (jendela * (2.3 * nyalaJendela + 0.9 * kilat) + (0.04 + 0.08 * pecahan + 0.5 * kilat) * sisi + (0.08 + 0.18 * pecahan + 0.6 * kilat) * vAtap);
      float pudar = 1.0 - smoothstep(uJari * 0.62, uJari, length(vDunia.xz - uFokus.xz));
      gl_FragColor = vec4(mix(uLatar, c, pudar), 1.0);
    }`,
});
export const ladang = new THREE.InstancedMesh(geoLadang, bahanLadang, N_LADANG);
ladang.frustumCulled = false;
{
  const m = new THREE.Matrix4();
  ladangData.forEach((g, i) => { ladang.setMatrixAt(i, m.makeScale(g.lebar, 1, g.lebar).setPosition(g.p.x, 0, g.p.z)); atrLadang.aTinggi.array[i] = g.tinggi; atrLadang.aGeser.array[i] = -3; });
  ladang.instanceMatrix.needsUpdate = true;
}
scene.add(ladang);
// Garis zamrud dari lemari ke sebagian rumah ladang dan ke rumah-rumah komisariat.
export const tautLemari = (() => {
  const asal = lokal(0, LEMARI.h + 0.15, 0);
  const tujuan = [...rumahK.map((r) => ({ p: r.atap, d: r.atap.distanceTo(A) }))];
  const r = acakI(5);
  const pilih = ladangData.filter((g) => g.dA < 11).sort((a, b) => a.dA - b.dA);
  for (let i = 0; i < pilih.length; i += 2) tujuan.push({ p: pilih[i].p.clone().setY(pilih[i].tinggi + 0.45), d: pilih[i].dA });
  return tujuan.map((x) => {
    const m = bahanGaris(W.zamrudPijar, 2.6, 0);
    const l = garisJalur(busur(asal, x.p, 0.5 + 0.08 * x.d + 0.3 * r(), 30), m);
    scene.add(l);
    return { l, mat: m, d: x.d };
  });
})();
export const kilauLemari = sprite(W.emasPijar, 3.0);
kilauLemari.position.copy(lokal(0, 1.35, 0.9));
kilauLemari.material.opacity = 0;
scene.add(kilauLemari);
