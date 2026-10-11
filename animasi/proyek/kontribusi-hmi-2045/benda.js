// Benda bagian 1: dua bangunan Yogyakarta, perahu berdayung, karang, menara cip.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { W, bahan, jala, balok, pion, warna, teksturTeks, sprite, bahanGaris, garisSambung, TEKSTUR_CAHAYA } from "./dasar.js";
import { acak, N_DAYUNG } from "./isyarat.js";

// ---------------------------------------------------------------- bantuan bentuk
// Atap perisai (limasan): alas 2w × 2d, bubungan sepanjang 2r di ketinggian h.
export function geoAtapPerisai(w, d, h, r) {
  const A = [-w, 0, -d], B = [w, 0, -d], C = [w, 0, d], D = [-w, 0, d], E = [-r, h, 0], F = [r, h, 0];
  const seg = [D, C, F, D, F, E, B, A, E, B, E, F, A, D, E, C, B, F, A, B, C, A, C, D];
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(seg.flat(), 3));
  g.computeVertexNormals();
  return g;
}
// Prisma segitiga (pedimen) menghadap +z: lebar 2w, tinggi h, tebal t.
export function geoPedimen(w, h, t) {
  const s = new THREE.Shape([new THREE.Vector2(-w, 0), new THREE.Vector2(w, 0), new THREE.Vector2(0, h)]);
  return new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false }).translate(0, 0, -t / 2);
}
function kolom(r, h, mat) {
  const m = jala(new THREE.CylinderGeometry(r, r * 1.1, h, 14), mat);
  m.position.y = h / 2;
  return m;
}

// Bahan jendela emas bersama: intensitasnya diatur adegan (menyala saat gedung "lahir").
export function bahanJendela() {
  return new THREE.MeshStandardMaterial({ color: warna("hsl(153, 30%, 9%)"), emissive: W.emasPijar.clone(), emissiveIntensity: 0, roughness: 0.4 });
}

// ---------------------------------------------------------------- ruang kuliah 1947
export function buatRuangKuliah() {
  const g = new THREE.Group();
  const matDinding = bahan(W.dindingTerang, { roughness: 0.7 });
  const matPlint = bahan(W.petak, { roughness: 0.8 });
  const matAtap = bahan(W.atap, { roughness: 0.6 });
  const matJendela = bahanJendela();
  const matBingkai = bahan(warna("hsl(153, 22%, 14%)"));
  const matPutih = bahan(warna("hsl(45, 14%, 62%)"), { roughness: 0.55 });
  // Bangunan sekolah satu lantai: dinding tinggi berjendela banyak, atap limasan, serambi masuk berpedimen.
  const plint = balok(3.2, 0.18, 2.15, 0.03, matPlint);
  plint.position.y = 0.09;
  const dinding = balok(2.8, 1.28, 1.55, 0.02, matDinding);
  dinding.position.set(0, 0.18 + 0.64, -0.08);
  const lis = balok(2.94, 0.08, 1.69, 0.01, matPutih);
  lis.position.set(0, 1.47, -0.08);
  const atap = jala(geoAtapPerisai(1.6, 0.98, 0.56, 0.92), matAtap);
  atap.position.set(0, 1.5, -0.08);
  g.add(plint, dinding, lis, atap);
  const zDepan = -0.08 + 0.775;
  // Empat jendela tinggi dan pintu di muka depan (+z), tiga jendela di muka samping (+x).
  for (const x of [-1.12, -0.66, 0.66, 1.12]) {
    const bingkai = balok(0.32, 0.78, 0.05, 0.01, matPutih);
    bingkai.position.set(x, 0.86, zDepan + 0.01);
    const kaca = balok(0.24, 0.68, 0.05, 0, matJendela);
    kaca.position.set(x, 0.86, zDepan + 0.03);
    const palang = balok(0.24, 0.035, 0.06, 0, matPutih);
    palang.position.set(x, 0.98, zDepan + 0.04);
    g.add(bingkai, kaca, palang);
  }
  const pintuB = balok(0.46, 0.92, 0.05, 0.01, matPutih);
  pintuB.position.set(0, 0.18 + 0.46, zDepan + 0.01);
  const pintu = balok(0.36, 0.84, 0.05, 0, matJendela);
  pintu.position.set(0, 0.18 + 0.42, zDepan + 0.03);
  g.add(pintuB, pintu);
  for (const z of [-0.5, 0.0, 0.5]) {
    const bingkai = balok(0.05, 0.78, 0.32, 0.01, matPutih);
    bingkai.position.set(1.41, 0.86, z - 0.08);
    const kaca = balok(0.05, 0.68, 0.24, 0, matJendela);
    kaca.position.set(1.43, 0.86, z - 0.08);
    g.add(bingkai, kaca);
  }
  // Serambi masuk: dua tiang, atap kecil berpedimen.
  for (const x of [-0.36, 0.36]) {
    const t = kolom(0.05, 1.0, matPutih);
    t.position.set(x, 0.18, zDepan + 0.5);
    g.add(t);
  }
  const atapSerambi = balok(0.98, 0.08, 0.62, 0.02, matPutih);
  atapSerambi.position.set(0, 1.22, zDepan + 0.27);
  const ped = jala(geoPedimen(0.5, 0.26, 0.6), matPutih);
  ped.position.set(0, 1.26, zDepan + 0.27);
  g.add(atapSerambi, ped);
  for (let k = 0; k < 2; k++) {
    const anak = balok(0.9 - k * 0.14, 0.07, 0.2, 0.01, matPlint);
    anak.position.set(0, 0.035 + k * 0.07, zDepan + 0.72 - k * 0.12);
    g.add(anak);
  }
  return { g, matJendela };
}

// ---------------------------------------------------------------- gedung sidang 1948
export function buatGedungSidang() {
  const g = new THREE.Group();
  const matDinding = bahan(W.dindingTerang, { roughness: 0.7 });
  const matPutih = bahan(warna("hsl(45, 14%, 62%)"), { roughness: 0.55 });
  const matPlint = bahan(W.petak, { roughness: 0.8 });
  const matAtap = bahan(W.atap, { roughness: 0.6 });
  const matJendela = bahanJendela();
  const matBingkai = bahan(warna("hsl(153, 22%, 14%)"));
  const podium = balok(3.5, 0.3, 2.5, 0.03, matPlint);
  podium.position.y = 0.15;
  g.add(podium);
  for (let k = 0; k < 3; k++) { // tangga lebar di depan
    const s = balok(2.1 - k * 0.12, 0.1, 0.16, 0.01, matPlint);
    s.position.set(0, 0.05 + k * 0.1, 1.33 - k * 0.14);
    g.add(s);
  }
  const badan = balok(3.0, 1.5, 1.55, 0.02, matDinding);
  badan.position.set(0, 0.3 + 0.75, -0.35);
  const lis = balok(3.12, 0.1, 1.67, 0.01, matBingkai);
  lis.position.set(0, 1.84, -0.35);
  const atap = jala(geoAtapPerisai(1.5, 0.74, 0.34, 1.0), matAtap);
  atap.position.set(0, 1.89, -0.35);
  g.add(badan, lis, atap);
  // Jendela dua lantai.
  const zDepan = -0.35 + 0.775;
  for (const y of [0.72, 1.4]) for (let k = 0; k < 7; k++) {
    const x = -1.26 + k * 0.42;
    const kaca = balok(0.2, 0.36, 0.05, 0, matJendela);
    kaca.position.set(x, y, zDepan + 0.02);
    g.add(kaca);
  }
  for (const y of [0.72, 1.4]) for (let k = 0; k < 3; k++) {
    const kaca = balok(0.05, 0.36, 0.2, 0, matJendela);
    kaca.position.set(1.515, y, -0.85 + k * 0.5);
    g.add(kaca);
  }
  // Serambi bertiang dengan pedimen (muka gedung pemerintahan).
  for (let k = 0; k < 6; k++) {
    const t = kolom(0.075, 1.32, matPutih);
    t.position.set(-1.0 + k * 0.4, 0.3, zDepan + 0.5);
    g.add(t);
  }
  const balokAtas = balok(2.4, 0.16, 0.72, 0.02, matPutih);
  balokAtas.position.set(0, 1.7, zDepan + 0.3);
  const pedimen = jala(geoPedimen(1.2, 0.42, 0.66), matPutih);
  pedimen.position.set(0, 1.78, zDepan + 0.3);
  g.add(balokAtas, pedimen);
  // Tiang bendera dengan panji emas.
  const tiang = jala(new THREE.CylinderGeometry(0.022, 0.026, 1.2, 8), matPutih);
  tiang.position.set(0, 2.23 + 0.6, -0.35);
  const panji = jala(new THREE.BoxGeometry(0.46, 0.28, 0.02), bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0, roughness: 0.5 }));
  panji.position.set(0.25, 3.25, -0.35);
  g.add(tiang, panji);
  return { g, matJendela, panji };
}

// ---------------------------------------------------------------- perahu
// Sumbu lokal: +x haluan, y atas (0 = garis air), z lebar (+z kanan / starboard).
export const PERAHU = { L: 6.3, B: 1.8 };
const lebarLambung = (u) => (PERAHU.B / 2) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * u - 1), 2.3)), 0.6);
const atasLambung = (u) => 0.44 + 0.42 * Math.pow(Math.abs(2 * u - 1), 3.2);
const bawahLambung = (u) => -0.32 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * u - 1), 2.0)), 0.55);
const xLambung = (u) => (u - 0.5) * PERAHU.L;
function lebarPada(u, y) { // setengah lebar bagian dalam lambung pada ketinggian y
  const w = lebarLambung(u), at = atasLambung(u), bw = bawahLambung(u);
  const c = klem((at - y) / Math.max(1e-4, at - bw), 0, 1);
  return w * Math.sqrt(1 - c * c);
}
const klem = (x, a, b) => Math.min(b, Math.max(a, x));

function teksturPapan(warnaDasar, warnaGaris, jumlah, arah) {
  return teksturTeks(256, 256, (c, w, h) => {
    c.fillStyle = warnaDasar;
    c.fillRect(0, 0, w, h);
    const r = acak(5);
    for (let k = 0; k < 400; k++) { // serat kayu halus
      c.fillStyle = `rgba(255,240,220,${0.02 + 0.03 * r()})`;
      const x = r() * w, y = r() * h;
      if (arah === "v") c.fillRect(x, y, 1, 14 + 30 * r()); else c.fillRect(x, y, 14 + 30 * r(), 1);
    }
    c.fillStyle = warnaGaris;
    for (let k = 0; k <= jumlah; k++) {
      const p = Math.round((k / jumlah) * (arah === "v" ? h : w));
      if (arah === "v") c.fillRect(0, p - 1, w, 3); else c.fillRect(p - 1, 0, 3, h);
    }
  });
}

export function buatPerahu() {
  const g = new THREE.Group();
  // Lambung: permukaan parametrik dua sisi (luar terlihat dari samping, dalam terlihat dari atas).
  const NU = 56, NV = 18;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= NU; i++) {
    const u = i / NU;
    const w = lebarLambung(u), at = atasLambung(u), bw = bawahLambung(u);
    for (let j = 0; j <= NV; j++) {
      const v = j / NV, f = Math.PI * (v - 0.5);
      pos.push(xLambung(u), at - (at - bw) * Math.cos(f), w * Math.sin(f));
      uv.push(u * 3, v);
    }
  }
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
    const a = i * (NV + 1) + j, b = a + NV + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geoLambung = new THREE.BufferGeometry();
  geoLambung.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geoLambung.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geoLambung.setIndex(idx);
  geoLambung.computeVertexNormals();
  const texLambung = teksturPapan("#4a3424", "rgba(20,12,6,0.55)", 7, "v");
  texLambung.wrapS = THREE.RepeatWrapping;
  const matLambung = bahan(new THREE.Color(1, 1, 1), { map: texLambung, side: THREE.DoubleSide, roughness: 0.75 });
  const lambung = jala(geoLambung, matLambung);
  g.add(lambung);

  // Pinggiran (lis emas) di sepanjang tepi atas kedua sisi, ditutup di haluan dan buritan.
  const matLis = bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0.15, roughness: 0.38, metalness: 0.3 });
  for (const s of [-1, 1]) {
    const titik = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; titik.push(new THREE.Vector3(xLambung(u), atasLambung(u) + 0.015, s * lebarLambung(u))); }
    const lis = jala(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(titik), 80, 0.045, 8, false), matLis);
    g.add(lis);
  }
  for (const s of [-1, 1]) { // ujung haluan dan buritan
    const ujung = jala(new THREE.SphereGeometry(0.085, 14, 10), matLis);
    ujung.position.set(s * PERAHU.L / 2, atasLambung(1) + 0.02, 0);
    g.add(ujung);
  }

  // Lantai dua belahan dengan garis retak bergerigi di tengah kapal.
  const Y_LANTAI = 0.0;
  const retak = [];
  { const r = acak(12); for (let k = 0; k <= 9; k++) { const z = -1 + (2 * k) / 9; retak.push([0.05 + (k % 2 ? 0.13 : -0.11) + (r() - 0.5) * 0.08, z]); } }
  const tepi = (u) => lebarPada(u, Y_LANTAI) * 0.97;
  const texLantai = teksturPapan("#7a5b3c", "rgba(30,18,8,0.6)", 5, "v");
  texLantai.wrapS = texLantai.wrapT = THREE.RepeatWrapping;
  texLantai.repeat.set(1.4, 1.4);
  const matLantai = bahan(new THREE.Color(1, 1, 1), { map: texLantai, roughness: 0.8 });
  const lantai = [];
  for (const sisi of [1, -1]) { // 1 = belahan haluan, -1 = belahan buritan
    const pts = [];
    const uRetak = (z) => 0.5 + retak.reduce((s, q) => s, 0) / PERAHU.L;
    // Garis retak dari kiri ke kanan, lalu tepi lambung kembali.
    for (const [x, zn] of retak) {
      const u = 0.5 + x / PERAHU.L;
      pts.push(new THREE.Vector2(x, -zn * tepi(u)));
    }
    const uAwal = 0.5 + retak[retak.length - 1][0] / PERAHU.L;
    const uUjung = sisi > 0 ? 0.9 : 0.1;
    const n = 18;
    for (let k = 0; k <= n; k++) { const u = uAwal + (uUjung - uAwal) * (k / n); pts.push(new THREE.Vector2(xLambung(u), -tepi(u))); }
    for (let k = n; k >= 0; k--) { const u = 0.5 + retak[0][0] / PERAHU.L + (uUjung - 0.5 - retak[0][0] / PERAHU.L) * (k / n); pts.push(new THREE.Vector2(xLambung(u), tepi(u))); }
    void uRetak;
    const bentuk = new THREE.Shape(sisi > 0 ? pts : pts.reverse());
    const geo = new THREE.ExtrudeGeometry(bentuk, { depth: 0.05, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const m = jala(geo, matLantai.clone());
    m.position.y = Y_LANTAI;
    const pivot = new THREE.Group(); // berputar di sekitar garis retak
    pivot.add(m);
    g.add(pivot);
    lantai.push({ pivot, m, sisi });
  }
  // Garis retak bercahaya abu-abu.
  const titikRetak = [];
  for (const [x, zn] of retak) titikRetak.push(x, Y_LANTAI + 0.07, zn * tepi(0.5 + x / PERAHU.L));
  const garisRetak = garisSambung(titikRetak, bahanGaris(warna("hsl(150, 8%, 78%)"), 4, 0));
  g.add(garisRetak);

  // Bangku melintang dan delapan pendayung dengan dayung.
  const matBangku = bahan(W.kayuTerang, { roughness: 0.7 });
  const matDayung = bahan(warna("hsl(34, 34%, 52%)"), { roughness: 0.6 });
  const X_BARIS = [2.05, 0.98, -0.98, -2.05];
  const pendayung = [];
  const geoGagang = new THREE.CylinderGeometry(0.034, 0.034, 2.75, 8).rotateX(Math.PI / 2).translate(0, 0, 0.72);
  const geoBilah = (() => {
    const b = new THREE.SphereGeometry(1, 16, 8);
    b.scale(0.06, 0.035, 0.32);
    return b.translate(0, 0, 1.92);
  })();
  for (let baris = 0; baris < 4; baris++) {
    const x = X_BARIS[baris];
    const u = 0.5 + x / PERAHU.L;
    const lb = lebarPada(u, 0.12);
    const bangku = balok(0.26, 0.07, lb * 2, 0.02, matBangku);
    bangku.position.set(x - 0.05, 0.16, 0);
    g.add(bangku);
    for (const s of [-1, 1]) {
      const i = (s < 0 ? 0 : 4) + baris;
      const badan = new THREE.Group();
      const p = pion(s < 0 ? W.pion : W.pion);
      p.scale.setScalar(0.74);
      badan.add(p);
      badan.position.set(x - 0.12, 0.19, s * 0.36);
      g.add(badan);
      const tumpu = new THREE.Group();
      tumpu.position.set(x + 0.05, atasLambung(u) + 0.06, s * (lebarLambung(u) + 0.02));
      tumpu.scale.z = s;
      tumpu.rotation.order = "YXZ";
      const dayung = new THREE.Group();
      dayung.add(jala(geoGagang, matDayung), jala(geoBilah, matDayung));
      tumpu.add(dayung);
      g.add(tumpu);
      // Ganjal dayung kecil di pinggiran.
      const ganjal = jala(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8), matLis);
      ganjal.position.set(x + 0.05, atasLambung(u) + 0.03, s * lebarLambung(u));
      g.add(ganjal);
      pendayung[i] = { badan, tumpu, s, u, x, p };
    }
  }
  // Pendar emas di bawah perahu saat serempak.
  const pendar = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 5.2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({
    map: TEKSTUR_CAHAYA, color: W.emasPijar.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  pendar.position.y = 0.035;
  pendar.renderOrder = 1;
  g.add(pendar);
  return { g, matLambung, matLis, lantai, garisRetak, pendayung, pendar, matLantai };
}
export { atasLambung, lebarLambung, xLambung };

// ---------------------------------------------------------------- karang
// Gumpalan batu bersudut (ikosahedron yang diacak), kerangka gelap dengan puncak lebih terang.
function geoBatu(benih, sx, sy, sz, kasar = 0.3) {
  const r = acak(benih);
  const g = new THREE.IcosahedronGeometry(1, 1);
  const p = g.attributes.position;
  const geser = new Map();
  for (let i = 0; i < p.count; i++) {
    const kunci = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    if (!geser.has(kunci)) geser.set(kunci, 1 + kasar * (r() - 0.5) * 2);
    const k = geser.get(kunci);
    p.setXYZ(i, p.getX(i) * k * sx, Math.max(p.getY(i) * k, -0.25) * sy, p.getZ(i) * k * sz);
  }
  const ng = g.toNonIndexed();
  ng.computeVertexNormals();
  const n = ng.attributes.position.count;
  const war = new Float32Array(n * 3);
  const gelap = W.batu, terang = W.batuTerang, basah = warna("hsl(160, 14%, 13%)");
  const c = new THREE.Color();
  for (let i = 0; i < n; i += 3) { // satu warna per segitiga (rata)
    const y = (ng.attributes.position.getY(i) + ng.attributes.position.getY(i + 1) + ng.attributes.position.getY(i + 2)) / 3;
    const ny = ng.attributes.normal.getY(i);
    c.copy(gelap).lerp(terang, klem(ny * 0.8 + 0.1 + 0.15 * (r() - 0.5), 0, 1));
    if (y < 0.35) c.lerp(basah, klem(1 - y / 0.35, 0, 1) * 0.8);
    for (let k = 0; k < 3; k++) war.set([c.r, c.g, c.b], (i + k) * 3);
  }
  ng.setAttribute("color", new THREE.BufferAttribute(war, 3));
  return ng;
}
export function buatKarang(benih) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.92, metalness: 0 });
  const r = acak(benih);
  // Dua belahan (untuk adegan 4): a = sisi kiri, b = sisi kanan karang.
  const belahan = [new THREE.Group(), new THREE.Group()];
  const susun = [
    [0, 0, 0, 1.35, 3.3, 1.2, 0], [0.95, 0, 0.55, 1.0, 2.3, 0.95, 1], [-0.9, 0, -0.45, 1.05, 2.6, 0.9, 0],
    [0.6, 0, -1.05, 0.85, 1.5, 0.8, 1], [-0.55, 0, 1.05, 0.8, 1.7, 0.75, 0], [1.55, 0, -0.35, 0.6, 1.1, 0.6, 1],
    [-1.55, 0, 0.35, 0.65, 1.2, 0.6, 0], [0.25, 0, 1.45, 0.55, 0.85, 0.55, 1],
  ];
  susun.forEach(([x, y, z, sx, sy, sz, b], k) => {
    const m = jala(geoBatu(benih * 31 + k, sx, sy, sz, 0.32), mat);
    m.position.set(x, y, z);
    m.rotation.y = r() * Math.PI;
    belahan[b].add(m);
  });
  // Taring runcing.
  for (let k = 0; k < 4; k++) {
    const kerucut = new THREE.ConeGeometry(0.32, 1.6 + r() * 1.0, 5, 1).toNonIndexed();
    kerucut.computeVertexNormals();
    const n = kerucut.attributes.position.count;
    const war = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) war.set([W.batu.r * 1.1, W.batu.g * 1.1, W.batu.b * 1.1], i * 3);
    kerucut.setAttribute("color", new THREE.BufferAttribute(war, 3));
    const m = jala(kerucut, mat);
    const sudut = (k / 4) * Math.PI * 2 + r();
    m.position.set(Math.cos(sudut) * 0.55, 1.6 + r() * 0.8, Math.sin(sudut) * 0.5);
    m.rotation.set((r() - 0.5) * 0.5, 0, (r() - 0.5) * 0.5);
    belahan[k % 2].add(m);
  }
  g.add(...belahan);
  return { g, belahan, mat };
}

// ---------------------------------------------------------------- menara cip dan server
function teksturServer(nyala) {
  const peta = teksturTeks(256, 512, (c, w, h) => {
    c.fillStyle = nyala ? "#1b2b25" : "#3b403d";
    c.fillRect(0, 0, w, h);
    const r = acak(nyala ? 3 : 4);
    for (let y = 0; y < h; y += 32) { // unit rak
      c.fillStyle = nyala ? "#14211c" : "#2f3431";
      c.fillRect(0, y, w, 3);
      c.fillStyle = nyala ? "#22362e" : "#474d49";
      c.fillRect(14, y + 9, w - 28, 14);
      c.fillStyle = nyala ? "#0e1714" : "#2a2e2c";
      for (let x = 22; x < w - 60; x += 12) c.fillRect(x, y + 12, 6, 8); // kisi ventilasi
    }
    void r;
  });
  const cahaya = teksturTeks(256, 512, (c, w, h) => {
    c.fillStyle = "#000";
    c.fillRect(0, 0, w, h);
    const r = acak(nyala ? 13 : 14);
    c.strokeStyle = nyala ? "rgba(70,230,160,0.95)" : "rgba(150,160,155,0.28)";
    c.lineWidth = 3;
    for (let k = 0; k < 7; k++) { // jalur sirkuit: tegak dengan belokan siku
      let x = 24 + k * 34, y = h;
      c.beginPath();
      c.moveTo(x, y);
      while (y > 0) {
        y -= 30 + r() * 60;
        c.lineTo(x, y);
        if (r() < 0.5) { x += (r() < 0.5 ? -1 : 1) * 17; c.lineTo(x, y - 10); y -= 10; }
      }
      c.stroke();
      for (let y2 = 40; y2 < h; y2 += 70 + r() * 60) { c.fillStyle = c.strokeStyle; c.fillRect(x - 5, y2, 10, 10); }
    }
    if (nyala) for (let y = 0; y < h; y += 32) { // lampu indikator
      for (let k = 0; k < 3; k++) if (r() < 0.75) { c.fillStyle = k === 0 ? "rgba(120,255,190,1)" : "rgba(60,220,150,0.9)"; c.fillRect(w - 52 + k * 12, y + 12, 6, 6); }
    }
  });
  for (const tx of [peta, cahaya]) { tx.wrapS = tx.wrapT = THREE.RepeatWrapping; }
  return { peta, cahaya };
}
const TEKS_SERVER = {};
function geoPin(lebar) {
  const geos = [];
  const n = 6, sisi = lebar + 0.5;
  for (let k = 0; k < n; k++) {
    const p = -sisi / 2 + 0.2 + (k * (sisi - 0.4)) / (n - 1);
    for (const [x, z, rot] of [[p, sisi / 2 + 0.08, 0], [p, -sisi / 2 - 0.08, 0], [sisi / 2 + 0.08, p, 1], [-sisi / 2 - 0.08, p, 1]]) {
      const b = new THREE.BoxGeometry(rot ? 0.2 : 0.08, 0.07, rot ? 0.08 : 0.2);
      b.translate(x, 0.07, z);
      geos.push(b);
    }
  }
  return mergeGeometries(geos);
}
export function buatMenaraCip({ lebar, tinggi, nyala }) {
  const kunci = nyala ? "n" : "r";
  if (!TEKS_SERVER[kunci]) TEKS_SERVER[kunci] = teksturServer(nyala);
  const { peta, cahaya } = TEKS_SERVER[kunci];
  const g = new THREE.Group();
  const matPaket = bahan(nyala ? warna("hsl(153, 22%, 10%)") : warna("hsl(150, 3%, 24%)"), { roughness: 0.5 });
  const matPin = bahan(nyala ? warna("hsl(150, 10%, 62%)") : W.abu, { roughness: 0.35, metalness: 0.6 });
  const paket = balok(lebar + 0.5, 0.18, lebar + 0.5, 0.04, matPaket);
  paket.position.y = 0.09;
  const pin = jala(geoPin(lebar), matPin);
  // Badan: UV sisi diulang sesuai tinggi supaya unit rak tidak melar.
  const geoBadan = new THREE.BoxGeometry(lebar, tinggi, lebar);
  const uv = geoBadan.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const muka = Math.floor(i / 4);
    if (muka !== 2 && muka !== 3) uv.setY(i, uv.getY(i) * tinggi * 0.5);
  }
  const matBadan = bahan(new THREE.Color(1, 1, 1), {
    map: peta, emissiveMap: cahaya, emissive: nyala ? warna("hsl(153, 80%, 55%)") : warna("hsl(150, 5%, 60%)"),
    emissiveIntensity: nyala ? 1.0 : 0.3, roughness: 0.5, metalness: 0.15,
  });
  const badan = jala(geoBadan, matBadan);
  badan.position.y = 0.18 + tinggi / 2;
  // Tutup atas: inti cip berbingkai, dan antena kecil.
  const tutup = balok(lebar + 0.1, 0.1, lebar + 0.1, 0.02, matPaket);
  tutup.position.y = 0.18 + tinggi + 0.05;
  const matInti = bahan(nyala ? W.zamrud : W.abuGelap, { emissive: nyala ? W.zamrudPijar.clone() : W.abu.clone(), emissiveIntensity: nyala ? 0.9 : 0.12, roughness: 0.3, metalness: 0.4 });
  const inti = balok(lebar * 0.55, 0.06, lebar * 0.55, 0.01, matInti);
  inti.position.y = 0.18 + tinggi + 0.13;
  const antena = jala(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), matPin);
  antena.position.set(lebar * 0.3, 0.18 + tinggi + 0.35, -lebar * 0.3);
  g.add(paket, pin, badan, tutup, inti, antena);
  const lampu = nyala ? sprite(W.zamrudPijar, 1.1, 0.9) : null;
  if (lampu) { lampu.position.set(lebar * 0.3, 0.18 + tinggi + 0.62, -lebar * 0.3); g.add(lampu); }
  return { g, matBadan, matInti, lampu, tinggiTotal: 0.18 + tinggi + 0.6 };
}
