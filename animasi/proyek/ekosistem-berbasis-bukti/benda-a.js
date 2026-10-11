// Benda bagian A: figur pion, lemari sekretariat beserta isinya, debu, balon pesan, kartu program kerja, buku aturan.
import * as THREE from "three";
import {
  W, C, FONT, warna, bahan, balok, bayang, sprite, teksturKanvas, persegiBulat, acak, garisDari, bahanGaris,
} from "./alat.js";

// ---------------------------------------------------------------- figur pion tanpa wajah (bubutan)
const PROFIL_PION = (() => {
  const p = [];
  const t = (r, y) => p.push(new THREE.Vector2(r, y));
  t(0, 0); t(0.34, 0); t(0.36, 0.025); t(0.358, 0.075); t(0.33, 0.105); t(0.28, 0.125);
  t(0.265, 0.16); t(0.225, 0.19); t(0.19, 0.27); t(0.162, 0.4); t(0.146, 0.54);
  t(0.2, 0.585); t(0.228, 0.625); t(0.222, 0.665); t(0.17, 0.69); t(0.122, 0.715);
  const cy = 0.885, r = 0.19;
  for (let i = 0; i <= 14; i++) {
    const a = (-54 + (144 * i) / 14) * Math.PI / 180;
    t(Math.max(0.0001, r * Math.cos(a)), cy + r * Math.sin(a));
  }
  t(0, cy + r);
  return p;
})();
const GEO_PION = new THREE.LatheGeometry(PROFIL_PION, 40);
GEO_PION.computeVertexNormals();
export function pion(c = W.pion, opsi = {}) {
  const m = new THREE.Mesh(GEO_PION, bahan(c, { roughness: 0.42, metalness: 0.04, ...opsi }));
  return bayang(m);
}

// ---------------------------------------------------------------- tekstur kertas
function teksturHalamanSobek() { // halaman abu-abu bergaris
  return teksturKanvas(256, 320, (g, w, h) => {
    g.fillStyle = "hsl(40, 6%, 66%)"; g.fillRect(0, 0, w, h);
    g.fillStyle = "hsl(40, 6%, 50%)";
    for (let y = 46; y < h - 20; y += 26) g.fillRect(24, y, w * (0.55 + 0.3 * Math.abs(Math.sin(y))), 7);
    g.fillStyle = "hsl(30, 12%, 45%)"; g.globalAlpha = 0.25;
    g.beginPath(); g.ellipse(w * 0.7, h * 0.72, 46, 30, 0.4, 0, Math.PI * 2); g.fill(); // noda
  });
}
const TX_SOBEK = teksturHalamanSobek();
export function halamanSobek(lebar = 0.44, tinggi = 0.56, benih = 3) {
  const r = acak(benih);
  const s = new THREE.Shape();
  s.moveTo(-lebar / 2, -tinggi / 2);
  s.lineTo(lebar / 2, -tinggi / 2);
  s.lineTo(lebar / 2, tinggi * 0.1);
  // tepi atas sobek: zig-zag dari kanan ke kiri, turun miring
  const n = 9;
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    const x = lebar / 2 - lebar * u;
    const y = tinggi * (0.1 + 0.4 * u) + (i % 2 ? 1 : -1) * (0.025 + 0.03 * r());
    s.lineTo(x, Math.min(y, tinggi / 2));
  }
  s.lineTo(-lebar / 2, -tinggi / 2);
  const geo = new THREE.ShapeGeometry(s);
  // UV dari posisi
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / lebar + 0.5, pos.getY(i) / tinggi + 0.5);
  const m = new THREE.Mesh(geo, bahan(warna("hsl(40, 6%, 70%)"), { map: TX_SOBEK, side: THREE.DoubleSide, roughness: 0.9 }));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// ---------------------------------------------------------------- lemari sekretariat (depan menghadap +z lokal)
export const LEMARI = { w: 1.8, h: 2.5, d: 0.78, t: 0.06 };
const TX_PLAT = teksturKanvas(512, 96, (g, w, h) => {
  g.fillStyle = "hsl(153, 30%, 12%)"; persegiBulat(g, 0, 0, w, h, 14); g.fill();
  g.strokeStyle = "hsl(42, 20%, 70%)"; g.lineWidth = 4; persegiBulat(g, 8, 8, w - 16, h - 16, 9); g.stroke();
  g.fillStyle = "hsl(42, 30%, 90%)"; g.font = `700 44px ${FONT.mono}`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("SEKRETARIAT", w / 2, h / 2 + 2);
});

export function lemari() {
  const { w, h, d, t } = LEMARI;
  const g = new THREE.Group();
  const matBadan = bahan(warna("hsl(150, 9%, 42%)"), { roughness: 0.46, metalness: 0.28 });
  const matDalam = bahan(warna("hsl(150, 10%, 17%)"), { roughness: 0.95 });
  const matGelap = bahan(warna("hsl(153, 22%, 11%)"), { roughness: 0.7 });
  const matPintu = bahan(warna("hsl(150, 9%, 46%)"), { roughness: 0.42, metalness: 0.3 });
  const matPanel = bahan(warna("hsl(150, 8%, 50%)"), { roughness: 0.4, metalness: 0.3 });
  const matGagang = bahan(warna("hsl(42, 10%, 80%)"), { roughness: 0.25, metalness: 0.8 });
  const y0 = 0.12;
  const kaki = balok(w - 0.08, y0, d - 0.1, 0.02, matGelap); kaki.position.y = y0 / 2;
  const sisiL = balok(t, h - y0, d, 0.012, matBadan); sisiL.position.set(-w / 2 + t / 2, y0 + (h - y0) / 2, 0);
  const sisiR = sisiL.clone(); sisiR.position.x = w / 2 - t / 2;
  const belakang = balok(w, h - y0, t, 0.01, matBadan); belakang.position.set(0, y0 + (h - y0) / 2, -d / 2 + t / 2);
  const dasar = balok(w - 2 * t, t, d - t, 0, matBadan); dasar.position.set(0, y0 + t / 2, t / 2);
  const mahkota = balok(w + 0.12, 0.12, d + 0.1, 0.025, matBadan); mahkota.position.set(0, h + 0.06, 0.01);
  g.add(kaki, sisiL, sisiR, belakang, dasar, mahkota);
  // Dinding dalam yang gelap, supaya ruang dalam terbaca dalam.
  const dalamB = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * t, h - y0 - t), matDalam);
  dalamB.position.set(0, y0 + t + (h - y0 - t) / 2, -d / 2 + t + 0.002);
  const dalamL = new THREE.Mesh(new THREE.PlaneGeometry(d - t, h - y0 - t), matDalam);
  dalamL.rotation.y = Math.PI / 2; dalamL.position.set(-w / 2 + t + 0.002, dalamB.position.y, t / 2);
  const dalamR = dalamL.clone(); dalamR.rotation.y = -Math.PI / 2; dalamR.position.x = w / 2 - t - 0.002;
  for (const m of [dalamB, dalamL, dalamR]) m.receiveShadow = true;
  g.add(dalamB, dalamL, dalamR);
  const RAK_Y = [y0 + 0.8, y0 + 1.5];
  for (const y of RAK_Y) { const r = balok(w - 2 * t, 0.045, d - t - 0.03, 0.01, matBadan); r.position.set(0, y, t / 2 - 0.015); g.add(r); }
  // Pelat nama.
  const plat = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.184), new THREE.MeshStandardMaterial({ map: TX_PLAT, roughness: 0.5 }));
  plat.position.set(0, h + 0.06, d / 2 + 0.061);
  g.add(plat);
  // Pintu: berengsel di tepi luar, terbuka ke arah +z.
  const pintu = [-1, 1].map((sisi) => {
    const engsel = new THREE.Group();
    engsel.position.set(sisi * w / 2, 0, d / 2);
    const lebarP = w / 2 - 0.008, tinggiP = h - y0 - 0.04;
    const daun = balok(lebarP, tinggiP, 0.045, 0.012, matPintu);
    daun.position.set(-sisi * lebarP / 2, y0 + 0.02 + tinggiP / 2, 0.024);
    engsel.add(daun);
    for (const [py, ph] of [[y0 + 0.14 + 0.55, 1.0], [y0 + 1.33 + 0.45, 0.82]]) {
      const panel = balok(lebarP - 0.2, ph, 0.02, 0.008, matPanel);
      panel.position.set(-sisi * lebarP / 2, py, 0.054);
      engsel.add(panel);
    }
    const gagang = balok(0.045, 0.3, 0.05, 0.018, matGagang);
    gagang.position.set(-sisi * (lebarP - 0.09), y0 + 1.22, 0.075);
    engsel.add(gagang);
    g.add(engsel);
    return engsel;
  });
  // Cahaya dalam (penutup): lampu titik hangat dan pendar di dinding belakang.
  const lampu = new THREE.PointLight(W.emasPijar.clone(), 0, 4.5, 1.6);
  lampu.position.set(0, 1.4, 0.25);
  g.add(lampu);
  const lampuRedup = new THREE.PointLight(warna("hsl(150, 12%, 75%)"), 0, 3.2, 1.6); // isi kusam tetap terbaca
  lampuRedup.position.set(0, 1.5, 0.7);
  g.add(lampuRedup);
  const pendar = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * t, h - y0 - t), new THREE.ShaderMaterial({
    uniforms: { uWarna: { value: W.emasPijar.clone() }, uKuat: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uWarna; uniform float uKuat; varying vec2 vUv;
      void main(){ vec2 d = (vUv - 0.5) * vec2(1.6, 1.0); float a = exp(-dot(d, d) * 3.0); gl_FragColor = vec4(uWarna, a * uKuat); }`,
  }));
  pendar.position.set(0, dalamB.position.y, -d / 2 + t + 0.01);
  g.add(pendar);
  return { grup: g, pintu, lampu, lampuRedup, pendar, RAK_Y, y0 };
}

// Isi lemari yang kusam: map abu-abu miring, kotak arsip, halaman sobek.
export function isiKusam() {
  const g = new THREE.Group();
  const { w, d, t } = LEMARI;
  const abu = [warna("hsl(40, 6%, 46%)"), warna("hsl(150, 5%, 40%)"), warna("hsl(35, 8%, 52%)"), warna("hsl(150, 4%, 34%)")];
  const m = (i) => bahan(abu[i % abu.length], { roughness: 0.92 });
  const zDalam = -0.03;
  // Rak bawah (y 0.18–0.92): dua kotak arsip, satu condong; satu map rebah.
  const k1 = balok(0.24, 0.58, 0.5, 0.02, m(0)); k1.position.set(-0.55, 0.18 + 0.29, zDalam); g.add(k1);
  const k2 = balok(0.24, 0.58, 0.5, 0.02, m(2)); k2.position.set(-0.24, 0.18 + 0.28, zDalam); k2.rotation.z = -0.28; g.add(k2);
  const rebah = balok(0.62, 0.06, 0.46, 0.01, m(1)); rebah.position.set(0.42, 0.18 + 0.03, zDalam + 0.02); rebah.rotation.y = 0.12; g.add(rebah);
  const rebah2 = balok(0.56, 0.05, 0.44, 0.01, m(3)); rebah2.position.set(0.4, 0.18 + 0.085, zDalam); rebah2.rotation.y = -0.08; g.add(rebah2);
  // Rak tengah (y 0.97–1.6): tiga map tipis condong, sela kosong.
  [[-0.66, 0.0, 0], [-0.58, 0.16, 1], [-0.47, 0.34, 3]].forEach(([x, rz, i]) => {
    const mp = balok(0.06, 0.52, 0.46, 0.01, m(i)); mp.position.set(x + 0.26 * Math.sin(rz), 0.97 + 0.26, zDalam); mp.rotation.z = -rz; g.add(mp);
  });
  const mp4 = balok(0.06, 0.5, 0.46, 0.01, m(2)); mp4.position.set(0.52, 0.97 + 0.25, zDalam); mp4.rotation.z = 0.05; g.add(mp4);
  const sobek1 = halamanSobek(0.34, 0.44, 5); sobek1.position.set(0.66, 0.97 + 0.36, zDalam + 0.12); sobek1.rotation.set(0, -0.15, 0.08); g.add(sobek1);
  // Rak atas (y 1.67–2.4): tumpukan kertas kusam dan satu map jatuh miring.
  for (let i = 0; i < 5; i++) {
    const kt = balok(0.5, 0.025, 0.4, 0.004, bahan(warna(`hsl(40, 6%, ${58 + (i % 2) * 6}%)`), { roughness: 0.95 }));
    kt.position.set(-0.4 + 0.02 * Math.sin(i * 2.1), 1.67 + 0.0125 + i * 0.027, zDalam + 0.02 * Math.cos(i * 1.7));
    kt.rotation.y = 0.12 * Math.sin(i * 3.1);
    g.add(kt);
  }
  const sobek2 = halamanSobek(0.36, 0.46, 9); sobek2.position.set(-0.36, 1.67 + 0.16, zDalam + 0.21); sobek2.rotation.set(-1.25, 0, 0.3); g.add(sobek2);
  const jatuh = balok(0.06, 0.5, 0.44, 0.01, m(1)); jatuh.position.set(0.35, 1.67 + 0.2, zDalam); jatuh.rotation.z = 0.72; g.add(jatuh);
  return g;
}

// Isi lemari yang tertata (penutup): binder rapi dengan label emas di punggungnya.
export function isiTertata() {
  const g = new THREE.Group();
  const warnaBinder = [warna("hsl(153, 32%, 30%)"), warna("hsl(42, 22%, 78%)"), warna("hsl(160, 25%, 38%)")];
  const matLabel = bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0.9, roughness: 0.35, metalness: 0.3 });
  const label = [];
  const lantai = [0.18, 0.97, 1.67];
  lantai.forEach((y, li) => {
    const n = 10;
    for (let i = 0; i < n; i++) {
      const x = -0.74 + i * 0.165;
      const b = balok(0.14, 0.56, 0.5, 0.012, bahan(warnaBinder[(i + li) % 3], { roughness: 0.6 }));
      b.position.set(x, y + 0.28, -0.03);
      g.add(b);
      const lb = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.13, 0.01), matLabel);
      lb.position.set(x, y + 0.36, 0.225);
      g.add(lb);
      const lubang = new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), bahan(warna("hsl(153, 30%, 10%)")));
      lubang.position.set(x, y + 0.14, 0.222);
      g.add(lubang);
      label.push(lb);
    }
  });
  return { grup: g, matLabel };
}

// ---------------------------------------------------------------- kepulan debu: sprite abu-abu yang mengembang
export function kepulDebu(n = 46, benih = 21) {
  const r = acak(benih);
  const g = new THREE.Group();
  const partikel = [];
  for (let i = 0; i < n; i++) {
    const s = sprite(warna("hsl(40, 6%, 62%)"), 0.3, false);
    s.material.opacity = 0;
    const sudut = (r() - 0.5) * Math.PI * 1.1;
    partikel.push({
      s, arah: new THREE.Vector3(Math.sin(sudut) * (0.6 + r()), 0.2 + r() * 0.9, 0.6 + r() * 1.0),
      jauh: 0.7 + r() * 1.2, ukuran: 0.22 + r() * 0.4, tunda: r() * 0.25, y0: 0.5 + r() * 1.7, x0: (r() - 0.5) * 1.4,
    });
    g.add(s);
  }
  return { grup: g, partikel };
}

// ---------------------------------------------------------------- balon pesan
export function bentukBalon(w, h, r, ekor, cermin = false) {
  const s = new THREE.Shape();
  const x0 = -w / 2, y0 = -h / 2, f = cermin ? -1 : 1;
  const P = (x, y) => [f * x, y];
  s.moveTo(...P(x0 + r, y0));
  s.lineTo(...P(x0 + w * 0.2, y0));
  s.lineTo(...P(x0 + w * 0.1, y0 - ekor));
  s.lineTo(...P(x0 + w * 0.38, y0));
  s.lineTo(...P(x0 + w - r, y0));
  s.quadraticCurveTo(...P(x0 + w, y0), ...P(x0 + w, y0 + r));
  s.lineTo(...P(x0 + w, y0 + h - r));
  s.quadraticCurveTo(...P(x0 + w, y0 + h), ...P(x0 + w - r, y0 + h));
  s.lineTo(...P(x0 + r, y0 + h));
  s.quadraticCurveTo(...P(x0, y0 + h), ...P(x0, y0 + h - r));
  s.lineTo(...P(x0, y0 + r));
  s.quadraticCurveTo(...P(x0, y0), ...P(x0 + r, y0));
  return s;
}
export function balonPesan() {
  const g = new THREE.Group();
  const geo = new THREE.ExtrudeGeometry(bentukBalon(1.15, 0.72, 0.24, 0.26), { depth: 0.08, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 3, curveSegments: 12 });
  geo.translate(0, 0, -0.04);
  const mat = bahan(warna("hsl(42, 26%, 90%)"), { roughness: 0.4, emissive: warna("hsl(42, 30%, 60%)"), emissiveIntensity: 0.12 });
  const badan = bayang(new THREE.Mesh(geo, mat), true, false);
  g.add(badan);
  const matTitik = bahan(warna("hsl(153, 25%, 22%)"), { roughness: 0.5 });
  const titik = [-0.24, 0, 0.24].map((x) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 12), matTitik); m.position.set(x, 0, 0.09); g.add(m); return m; });
  return { grup: g, mat, titik };
}
// Garis putus-putus berbentuk balon (slot balasan yang kosong).
export function balonKosong() {
  const pts = bentukBalon(1.15, 0.72, 0.24, 0.26, true).getSpacedPoints(64);
  const p = [];
  for (let i = 0; i < pts.length - 1; i += 2) p.push(pts[i].x, pts[i].y, 0, pts[i + 1].x, pts[i + 1].y, 0);
  return garisDari(p, bahanGaris(warna("hsl(150, 5%, 60%)"), 3.2, 0));
}

// ---------------------------------------------------------------- kartu program kerja
const TX_KARTU = teksturKanvas(1024, 656, (g, w, h) => {
  g.fillStyle = C.kertas; g.fillRect(0, 0, w, h);
  g.fillStyle = "hsl(153, 35%, 18%)"; g.fillRect(0, 0, w, 178);
  g.fillStyle = C.krem; g.font = `700 64px ${FONT.mono}`; g.textBaseline = "middle"; g.textAlign = "left";
  g.fillText("PROGRAM KERJA", 52, 72);
  g.fillStyle = "hsl(42, 20%, 76%)"; g.font = `600 34px ${FONT.sans}`;
  g.fillText("Komisariat · periode", 54, 136);
  const baris = [0.78, 0.62, 0.7, 0.5];
  baris.forEach((p, i) => {
    const y = 240 + i * 96;
    g.strokeStyle = "hsl(153, 30%, 30%)"; g.lineWidth = 6; g.strokeRect(56, y, 44, 44);
    g.fillStyle = "hsl(153, 10%, 62%)"; persegiBulat(g, 128, y + 10, (w - 190) * p, 24, 12); g.fill();
  });
});
function teksturTahun(teks) {
  return teksturKanvas(512, 200, (g, w, h) => {
    g.fillStyle = C.krem; g.font = `700 150px ${FONT.serif}`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(teks, w / 2, h / 2 + 8);
  });
}
const TX_TAHUN = { lama: teksturTahun("2025"), baru: teksturTahun("2026") };
export const KARTU = { w: 1.8, h: 1.15 };
export function kartuProker(tahun = ["lama", "baru"]) {
  const g = new THREE.Group();
  const { w, h } = KARTU;
  const matBadan = bahan(warna("hsl(42, 18%, 66%)"), { roughness: 0.8 });
  const badan = bayang(balok(w, h, 0.035, 0.03, matBadan), true, false);
  g.add(badan);
  const matMuka = new THREE.MeshStandardMaterial({ map: TX_KARTU, color: new THREE.Color(0.72, 0.72, 0.7), roughness: 0.9, emissive: new THREE.Color(1, 1, 1), emissiveMap: TX_KARTU, emissiveIntensity: 0.04 });
  const muka = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.04, h - 0.04), matMuka);
  muka.position.z = 0.0185;
  g.add(muka);
  const angka = {};
  for (const k of tahun) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.242), new THREE.MeshBasicMaterial({ map: TX_TAHUN[k], transparent: true, depthWrite: false }));
    m.position.set(w / 2 - 0.4, h / 2 - 0.02 - 0.157, 0.02);
    g.add(m);
    angka[k] = m;
  }
  return { grup: g, matBadan, matMuka, angka };
}

// ---------------------------------------------------------------- buku aturan (punggung menghadap +z lokal)
const TX_HALAMAN = teksturKanvas(64, 64, (g, w, h) => {
  g.fillStyle = "hsl(42, 28%, 86%)"; g.fillRect(0, 0, w, h);
  g.fillStyle = "hsl(42, 14%, 70%)";
  for (let y = 2; y < h; y += 6) g.fillRect(0, y, w, 2);
});
TX_HALAMAN.wrapS = TX_HALAMAN.wrapT = THREE.RepeatWrapping;
TX_HALAMAN.repeat.set(1, 3);
export function buku({ panjang = 2.0, tebal = 0.46, lebar = 1.36, sampul, teks = "", pita = "hsl(42, 30%, 88%)" }) {
  const g = new THREE.Group();
  const cssSampul = `#${sampul.getHexString()}`;
  const matSampul = bahan(sampul, { roughness: 0.55 });
  const matHalaman = bahan(warna("hsl(42, 28%, 88%)"), { map: TX_HALAMAN, roughness: 0.9 });
  const papan = 0.05;
  const atas = balok(panjang, papan, lebar, 0.014, matSampul); atas.position.set(0, tebal - papan / 2, 0);
  const bawah = balok(panjang, papan, lebar, 0.014, matSampul); bawah.position.set(0, papan / 2, 0);
  const isi = bayang(new THREE.Mesh(new THREE.BoxGeometry(panjang - 0.07, tebal - 2 * papan + 0.004, lebar - 0.1), matHalaman));
  isi.position.set(0, tebal / 2, -0.03);
  const punggung = balok(panjang, tebal, 0.09, 0.03, matSampul); punggung.position.set(0, tebal / 2, lebar / 2 - 0.045);
  g.add(atas, bawah, isi, punggung);
  const wl = panjang * 0.94, hl = tebal * 0.84;
  const tx = teksturKanvas(1024, Math.round((1024 * hl) / wl), (c, w, h) => {
    c.fillStyle = cssSampul; c.fillRect(0, 0, w, h);
    c.fillStyle = pita; c.globalAlpha = 0.85;
    c.fillRect(30, h * 0.12, 10, h * 0.76); c.fillRect(w - 40, h * 0.12, 10, h * 0.76);
    c.fillRect(56, h * 0.12, 4, h * 0.76); c.fillRect(w - 60, h * 0.12, 4, h * 0.76);
    c.globalAlpha = 1;
    if (teks) {
      let ukuran = Math.min(h * 0.5, 96);
      c.font = `700 ${ukuran}px ${FONT.sans}`;
      while (c.measureText(teks).width > w - 170) { ukuran -= 2; c.font = `700 ${ukuran}px ${FONT.sans}`; }
      c.fillStyle = "hsl(42, 33%, 94%)"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(teks, w / 2, h / 2 + ukuran * 0.04);
    }
  });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(wl, hl), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6, emissive: new THREE.Color(1, 1, 1), emissiveMap: tx, emissiveIntensity: 0.08 }));
  label.position.set(0, tebal / 2, lebar / 2 + 0.0015);
  g.add(label);
  return g;
}
