// Benda bagian 2: jalan sejarah (buku NDP, bendera barisan, bangunan alumni), tarik tambang, gapura, bola dunia.
import * as THREE from "three";
import { W, bahan, jala, balok, pion, warna, teksturTeks, sprite, bahanGaris, garisRuas, garisSambung } from "./dasar.js";
import { geoAtapPerisai, geoPedimen } from "./benda.js";
import { acak } from "./isyarat.js";

// ---------------------------------------------------------------- buku NDP di atas mimbar
export function buatBuku() {
  const g = new THREE.Group();
  const matKayu = bahan(W.dinding, { roughness: 0.7 });
  const kaki = balok(0.42, 0.62, 0.42, 0.03, matKayu);
  kaki.position.y = 0.31;
  const alas = balok(0.72, 0.08, 0.72, 0.02, matKayu);
  alas.position.y = 0.04;
  const papan = balok(1.0, 0.06, 0.78, 0.02, matKayu);
  papan.position.y = 0.66;
  papan.rotation.x = 0.28;
  g.add(kaki, alas, papan);
  const buku = new THREE.Group();
  buku.position.set(0, 0.74, 0);
  buku.rotation.x = 0.28;
  const matSampul = bahan(warna("hsl(153, 40%, 16%)"), { roughness: 0.5 });
  const garisHalaman = teksturTeks(256, 256, (c, w, h) => {
    c.fillStyle = "#000"; c.fillRect(0, 0, w, h);
    c.fillStyle = "rgba(255,210,120,0.95)";
    for (let y = 34; y < h - 24; y += 22) c.fillRect(26, y, w - 52 - ((y * 7) % 40), 5);
  });
  const matHalaman = bahan(warna("hsl(45, 28%, 66%)"), { emissive: W.emasPijar.clone(), emissiveMap: garisHalaman, emissiveIntensity: 0, roughness: 0.6 });
  const matHalamanTepi = bahan(warna("hsl(45, 24%, 58%)"), { emissive: W.emasPijar.clone(), emissiveIntensity: 0, roughness: 0.6 });
  for (const s of [-1, 1]) {
    const sisi = new THREE.Group();
    sisi.rotation.z = -s * 0.16;
    const sampul = balok(0.5, 0.03, 0.66, 0.01, matSampul);
    sampul.position.set(s * 0.25, 0, 0);
    // Blok halaman melengkung naik ke arah punggung buku.
    const geo = new THREE.BoxGeometry(0.46, 0.06, 0.6, 10, 1, 1);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + 0.23; // 0 di punggung, 0,46 di tepi
      if (p.getY(i) > 0) p.setY(i, p.getY(i) + 0.05 * Math.exp(-x * 9) - 0.012 * x);
    }
    geo.computeVertexNormals();
    const halaman = jala(geo, [matHalamanTepi, matHalamanTepi, matHalaman, matHalamanTepi, matHalamanTepi, matHalamanTepi]);
    halaman.position.set(s * 0.245, 0.045, 0);
    if (s < 0) halaman.scale.x = -1;
    sisi.add(sampul, halaman);
    buku.add(sisi);
  }
  g.add(buku);
  const pijar = sprite(W.emasPijar, 3.2, 0);
  pijar.position.y = 1.0;
  g.add(pijar);
  const lampu = new THREE.PointLight(W.emasPijar.clone(), 0, 5, 2);
  lampu.position.set(0, 2.4, 0.6);
  g.add(lampu);
  // Sorot cahaya tipis ke atas.
  const matSorot = new THREE.ShaderMaterial({
    uniforms: { uWarna: { value: W.emasPijar.clone() }, uKuat: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uWarna; uniform float uKuat; varying vec2 vUv;
      void main(){ float a = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 1.6); gl_FragColor = vec4(uWarna, a * uKuat); }`,
  });
  const sorot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.5, 3.2, 32, 1, true), matSorot);
  sorot.position.y = 0.8 + 1.6;
  g.add(sorot);
  const percik = Array.from({ length: 10 }, () => { const s = sprite(W.emas, 0.22, 0); g.add(s); return s; });
  return { g, matHalaman, matHalamanTepi, pijar, lampu, matSorot, percik };
}

// ---------------------------------------------------------------- pembawa bendera (barisan revolusi)
export function buatBendera() {
  const g = new THREE.Group();
  const tiang = jala(new THREE.CylinderGeometry(0.02, 0.022, 1.5, 8), bahan(warna("hsl(45, 14%, 62%)")));
  tiang.position.y = 0.75;
  const kain = new THREE.PlaneGeometry(0.62, 0.38, 10, 1).translate(0.31, 0, 0);
  const matKain = bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0.2, side: THREE.DoubleSide, roughness: 0.6 });
  const bendera = jala(kain, matKain);
  bendera.position.y = 1.3;
  g.add(tiang, bendera);
  return { g, kain: bendera };
}

// ---------------------------------------------------------------- bangunan alumni
// Kementerian, parlemen (atap kubah terbelah), kampus (menara jam), kantor tinggi, pendopo pemerintah daerah.
export function buatBangunanAlumni(jenis) {
  const g = new THREE.Group();
  const matDinding = bahan(W.dinding, { roughness: 0.7 });
  const matTerang = bahan(warna("hsl(45, 12%, 58%)"), { roughness: 0.6 });
  const matAtap = bahan(W.atap, { roughness: 0.6 });
  const matJendela = new THREE.MeshStandardMaterial({ color: warna("hsl(153, 30%, 10%)"), emissive: W.zamrudPijar.clone(), emissiveIntensity: 0, roughness: 0.4 });
  const jendelaBaris = (w, y0, baris, kolom, zMuka, langkahY = 0.32) => {
    for (let b = 0; b < baris; b++) for (let k = 0; k < kolom; k++) {
      const j = balok(0.14, 0.18, 0.03, 0, matJendela);
      j.position.set(-w / 2 + (w / kolom) * (k + 0.5), y0 + b * langkahY, zMuka);
      g.add(j);
    }
  };
  if (jenis === "kementerian") {
    const b = balok(1.9, 0.95, 1.1, 0.02, matDinding); b.position.y = 0.475; g.add(b);
    jendelaBaris(1.6, 0.35, 2, 5, 0.56);
    for (let k = 0; k < 4; k++) { const c = jala(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10), matTerang); c.position.set(-0.45 + k * 0.3, 0.45, 0.78); g.add(c); }
    const atasK = balok(1.2, 0.1, 0.5, 0.01, matTerang); atasK.position.set(0, 0.95, 0.72); g.add(atasK);
    const ped = jala(geoPedimen(0.6, 0.26, 0.42), matTerang); ped.position.set(0, 1.0, 0.72); g.add(ped);
    const atap = jala(geoAtapPerisai(1.0, 0.6, 0.25, 0.6), matAtap); atap.position.set(0, 0.95, 0); g.add(atap);
  } else if (jenis === "parlemen") {
    const b = balok(2.2, 0.55, 1.3, 0.02, matDinding); b.position.y = 0.275; g.add(b);
    jendelaBaris(1.9, 0.27, 1, 7, 0.66);
    const matKubah = bahan(warna("hsl(153, 34%, 30%)"), { roughness: 0.4, metalness: 0.2 });
    for (const s of [-1, 1]) { // dua cangkang setengah kubah yang terbelah di tengah
      const k = jala(new THREE.SphereGeometry(0.62, 28, 14, 0, Math.PI, 0, Math.PI / 2), matKubah);
      k.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2;
      k.scale.set(1, 0.85, 1.05);
      k.position.set(s * 0.06, 0.55, 0);
      g.add(k);
    }
  } else if (jenis === "kampus") {
    const b = balok(1.7, 0.85, 1.0, 0.02, matDinding); b.position.y = 0.425; g.add(b);
    jendelaBaris(1.5, 0.3, 2, 5, 0.51);
    const atap = jala(geoAtapPerisai(0.95, 0.58, 0.35, 0.5), matAtap); atap.position.y = 0.85; g.add(atap);
    const menara = balok(0.42, 1.0, 0.42, 0.02, matTerang); menara.position.set(0.55, 1.2, 0.1); g.add(menara);
    const jam = jala(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 20).rotateX(Math.PI / 2), matJendela); jam.position.set(0.55, 1.45, 0.32); g.add(jam);
    const puncak = jala(new THREE.ConeGeometry(0.32, 0.4, 4).rotateY(Math.PI / 4), matAtap); puncak.position.set(0.55, 1.9, 0.1); g.add(puncak);
  } else if (jenis === "usaha") {
    const b = balok(0.85, 2.3, 0.85, 0.02, matDinding); b.position.y = 1.15; g.add(b);
    for (let y = 0; y < 6; y++) for (let k = 0; k < 3; k++) {
      const j1 = balok(0.16, 0.2, 0.03, 0, matJendela); j1.position.set(-0.27 + k * 0.27, 0.35 + y * 0.32, 0.435); g.add(j1);
      const j2 = balok(0.03, 0.2, 0.16, 0, matJendela); j2.position.set(0.435, 0.35 + y * 0.32, -0.27 + k * 0.27); g.add(j2);
    }
    const atap = balok(0.95, 0.12, 0.95, 0.02, matTerang); atap.position.y = 2.36; g.add(atap);
    const sisi = balok(0.7, 0.9, 0.9, 0.02, matDinding); sisi.position.set(-0.75, 0.45, 0.05); g.add(sisi);
  } else { // pendopo pemerintah daerah: atap joglo bertingkat di atas tiang
    const lantai = balok(1.7, 0.16, 1.7, 0.02, matTerang); lantai.position.y = 0.08; g.add(lantai);
    for (const x of [-0.6, 0.6]) for (const z of [-0.6, 0.6]) { const c = jala(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 10), matTerang); c.position.set(x, 0.5, z); g.add(c); }
    const bawah = jala(geoAtapPerisai(1.05, 1.05, 0.32, 0.45), matAtap); bawah.position.y = 0.85; g.add(bawah);
    const atas = jala(geoAtapPerisai(0.55, 0.55, 0.6, 0.12), matAtap); atas.position.y = 1.08; g.add(atas);
    const j = balok(0.9, 0.4, 0.9, 0.01, matJendela); j.position.y = 0.45; j.scale.set(1, 1, 1); g.add(j);
  }
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { g, matJendela };
}

// ---------------------------------------------------------------- tarik tambang
// Dua regu bertiga di sepanjang sumbu lokal x, tali di antaranya. Regu kiri menarik ke −x, kanan ke +x.
export function buatTarikTambang(benih) {
  const g = new THREE.Group();
  const r = acak(benih);
  const regu = [[], []];
  for (let s = 0; s < 2; s++) for (let k = 0; k < 3; k++) {
    const p = new THREE.Group();
    const badan = pion(s === 0 ? W.pion : W.pionB);
    badan.scale.setScalar(0.82 + 0.06 * r());
    p.add(badan);
    g.add(p);
    regu[s].push({ p, x0: (s === 0 ? -1 : 1) * (0.62 + k * 0.5), z0: (k % 2 ? 0.1 : -0.1) });
  }
  const matTali = bahan(warna("hsl(38, 30%, 60%)"), { roughness: 0.8 });
  const tali = jala(new THREE.CylinderGeometry(0.035, 0.035, 1, 8).rotateZ(Math.PI / 2), matTali);
  tali.position.y = 0.5;
  tali.scale.x = 3.8;
  const tanda = balok(0.08, 0.3, 0.08, 0.01, bahan(W.abu, { roughness: 0.6 }));
  tanda.position.y = 0.38;
  const garisTengah = balok(0.06, 0.02, 1.2, 0, bahan(W.abuGelap));
  garisTengah.position.y = 0.01;
  g.add(tali, tanda, garisTengah);
  return { g, regu, tali, tanda };
}

// ---------------------------------------------------------------- gapura 2045 / 2047
// Sumbu lokal x melintang (kiri-kanan), muka depan menghadap +z. Bukaan cukup lebar untuk perahu berdayung.
export const LEBAR_BUKAAN = 6.2;
export function buatGapura(tahun) {
  const g = new THREE.Group();
  const matEmas = bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0.06, roughness: 0.36, metalness: 0.35 });
  const matGelap = bahan(warna("hsl(42, 30%, 30%)"), { emissive: W.emasPijar.clone(), emissiveIntensity: 0.02, roughness: 0.5, metalness: 0.2 });
  const xTiang = LEBAR_BUKAAN / 2 + 0.45;
  for (const s of [-1, 1]) {
    const tiang = new THREE.Group();
    tiang.position.x = s * xTiang;
    const susun = [[1.25, 0.36, 1.25, 0.18, matGelap], [0.9, 3.0, 0.9, 0.36 + 1.5, matEmas], [1.12, 0.2, 1.12, 3.46, matGelap],
      [0.98, 0.34, 0.98, 3.73, matEmas], [0.78, 0.3, 0.78, 4.05, matGelap], [0.58, 0.28, 0.58, 4.34, matEmas], [0.38, 0.24, 0.38, 4.6, matGelap]];
    for (const [w, h, d, y, m] of susun) { const b = balok(w, h, d, 0.03, m); b.position.y = y; tiang.add(b); }
    for (const dx of [-0.24, 0.24]) { const relief = balok(0.1, 2.4, 0.04, 0.01, matGelap); relief.position.set(dx, 1.95, 0.46); tiang.add(relief); }
    const mahkota = jala(new THREE.ConeGeometry(0.16, 0.42, 6), matEmas);
    mahkota.position.y = 4.93;
    tiang.add(mahkota);
    g.add(tiang);
  }
  const ambang = balok(LEBAR_BUKAAN + 1.5, 0.46, 0.7, 0.04, matEmas);
  ambang.position.y = 3.28;
  const ambangBawah = balok(LEBAR_BUKAAN + 0.4, 0.12, 0.5, 0.02, matGelap);
  ambangBawah.position.y = 2.99;
  g.add(ambang, ambangBawah);
  // Papan tahun di atas ambang, angka emas terang pada dasar gelap.
  const peta = teksturTeks(512, 192, (c, w, h) => {
    c.fillStyle = "#2a2412"; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(230,190,110,0.9)"; c.lineWidth = 6; c.strokeRect(12, 12, w - 24, h - 24);
    c.fillStyle = "#f3d58e"; c.font = "700 132px 'JetBrains Mono', monospace"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(String(tahun), w / 2, h / 2 + 8);
  });
  const cahaya = teksturTeks(512, 192, (c, w, h) => {
    c.fillStyle = "#000"; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(200,150,60,0.6)"; c.lineWidth = 6; c.strokeRect(12, 12, w - 24, h - 24);
    c.fillStyle = "#ffd27a"; c.font = "700 132px 'JetBrains Mono', monospace"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(String(tahun), w / 2, h / 2 + 8);
  });
  const matPapanMuka = new THREE.MeshStandardMaterial({ map: peta, emissiveMap: cahaya, emissive: W.emasPijar.clone(), emissiveIntensity: 0.3, roughness: 0.5 });
  const papan = jala(new THREE.BoxGeometry(2.5, 0.94, 0.2), [matEmas, matEmas, matEmas, matEmas, matPapanMuka, matEmas]);
  papan.position.y = 3.98;
  const puncak = balok(1.0, 0.22, 0.24, 0.03, matEmas);
  puncak.position.y = 4.56;
  g.add(papan, puncak);
  const lampu = new THREE.PointLight(W.emasPijar.clone(), 0, 9, 2);
  lampu.position.set(0, 2.2, 1.4);
  g.add(lampu);
  // Tirai cahaya di bukaan.
  const matTirai = new THREE.ShaderMaterial({
    uniforms: { uWarna: { value: W.emasPijar.clone() }, uKuat: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uWarna; uniform float uKuat; varying vec2 vUv;
      void main(){ float a = pow(1.0 - vUv.y, 1.8) * 0.8 + 0.1; float tepi = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
      gl_FragColor = vec4(uWarna, a * tepi * uKuat); }`,
  });
  const tirai = new THREE.Mesh(new THREE.PlaneGeometry(LEBAR_BUKAAN, 2.9), matTirai);
  tirai.position.y = 1.45;
  g.add(tirai);
  return { g, matEmas, matGelap, matPapanMuka, lampu, matTirai };
}

// ---------------------------------------------------------------- bola dunia
// Benua kasar (bujur, lintang) untuk titik-titik daratan.
const BENUA = [
  [[-17, 21], [-16, 28], [-10, 30], [-6, 35], [10, 37], [11, 33], [20, 31], [25, 32], [32, 31], [35, 28], [43, 12], [51, 12], [51, 10], [45, 2], [40, -5], [40, -15], [35, -23], [33, -26], [27, -34], [20, -35], [18, -32], [15, -27], [12, -18], [13, -11], [9, -1], [9, 4], [5, 6], [-4, 5], [-8, 4], [-13, 8], [-17, 14]],
  [[-9, 37], [-9, 43], [-2, 43.5], [-4.5, 48], [-1, 49.5], [2, 51], [5, 53], [8, 54], [8, 57], [10.5, 59], [5, 62], [10, 64], [14, 68], [20, 70], [26, 71], [30, 70], [40, 68], [44, 68], [52, 68], [60, 69], [68, 72], [75, 72], [82, 73], [90, 75], [100, 77], [110, 74], [115, 73], [130, 71], [140, 72], [150, 71], [160, 70], [170, 70], [180, 68], [180, 65], [178, 62], [170, 60], [163, 57], [162, 54], [156, 51], [155, 57], [150, 59], [143, 59], [137, 54], [140, 48], [135, 43], [130, 42], [129, 35], [126, 35], [126, 38], [122, 40], [121, 37], [122, 31], [120, 27], [117, 23], [110, 21], [108, 21], [106, 17], [109, 12], [105, 9], [103, 10], [101, 13], [100, 7], [103, 1.5], [101, 3], [98, 8], [98, 16], [94, 17], [92, 21], [88, 22], [86, 20], [80, 15], [77, 8], [73, 16], [72, 21], [67, 25], [62, 25], [57, 26], [56, 24], [59, 22], [55, 17], [52, 16], [45, 13], [43, 15], [39, 22], [35, 28], [34, 31], [35, 36], [31, 36.5], [27, 36.5], [26, 40], [23, 40], [23, 37], [21, 38], [19, 40], [16, 41], [18, 40], [16, 38], [12, 42], [10, 44], [7, 43.5], [3, 43], [0, 39], [-2, 37], [-6, 36]],
  [[-5, 50], [1.5, 51], [0, 53], [-1.5, 55], [-3, 58.5], [-6, 58], [-5, 55], [-3, 54], [-4.5, 52]],
  [[-10, 52], [-6, 52], [-6, 55], [-8, 55], [-10, 54]],
  [[130, 31], [132, 34], [135, 34], [140, 35], [141, 38], [142, 41], [141, 45], [145, 44], [142, 40], [141, 36], [138, 34], [133, 33]],
  [[95, 5.5], [98, 4], [104, -2], [106, -6], [104, -5.8], [101, -3], [98, 0], [95, 3]],
  [[105, -6], [108, -6.3], [112, -6.8], [114.5, -7.7], [114, -8.6], [110, -8.2], [106, -7.3], [105, -6.8]],
  [[109, 1.5], [110, -3], [114, -4], [116.5, -3.5], [118, 1], [119, 5], [117, 7], [115, 5], [111, 2]],
  [[119, -5.5], [120, -1], [121, 1], [124.5, 1.5], [122, -1], [123, -4], [121, -5], [120.5, -3]],
  [[131, -1], [135, -3.5], [138, -1.5], [141, -2.5], [146, -5], [150, -10.5], [147, -10], [143, -9], [141, -9], [138, -8], [137, -5], [133, -4], [132, -2.5]],
  [[115, -8.2], [122, -8.2], [124, -8.6], [122, -9.6], [116, -9]],
  [[120, 18], [122, 18.5], [122, 14], [124, 13], [126, 7], [124, 6.5], [122, 7], [121.5, 12], [120, 14]],
  [[114, -22], [114, -26], [115, -34], [118, -35], [123, -34], [129, -32], [134, -32.5], [138, -35], [140, -38], [146, -39], [150, -37], [153, -32], [153, -25], [146, -19], [142, -11], [141, -15], [136, -12], [131, -11], [129, -15], [125, -14], [122, -17], [117, -20]],
  [[172, -34.5], [178, -37.5], [175, -41.5], [171, -44], [167, -46], [170, -45], [174, -41], [173, -37]],
  [[49, -12], [50, -16], [47, -25], [44, -24], [44, -20], [46, -16]],
  [[79.8, 9.8], [81.9, 7.5], [81, 6], [80, 6.5]],
  [[-168, 66], [-162, 70], [-156, 71.3], [-140, 70], [-128, 70], [-115, 68], [-95, 72], [-85, 70], [-80, 64], [-85, 55], [-80, 52], [-78, 58], [-70, 60], [-64, 60], [-56, 52], [-60, 47], [-66, 45], [-70, 42], [-74, 40], [-76, 35], [-81, 31], [-80, 25], [-82, 29], [-84, 30], [-90, 30], [-97, 27], [-97, 22], [-94, 18], [-90, 21], [-87, 21], [-88, 16], [-84, 15], [-83, 10], [-80, 8], [-78, 9], [-81, 7.5], [-86, 12], [-92, 14.5], [-96, 16], [-105, 20], [-106, 23], [-110, 24], [-112, 29], [-115, 31], [-117, 33], [-121, 35], [-124, 40], [-124, 46], [-125, 49], [-130, 54], [-135, 58], [-142, 60], [-150, 61], [-155, 59], [-160, 59], [-165, 62], [-164, 65]],
  [[-73, 78], [-60, 82], [-30, 83], [-20, 80], [-20, 72], [-25, 68], [-35, 65], [-43, 60], [-50, 64], [-55, 70], [-65, 76]],
  [[-80, 9], [-75, 11], [-72, 12], [-62, 10.5], [-55, 6], [-50, 2], [-50, 0], [-44, -2], [-35, -5], [-35, -9], [-39, -15], [-40, -22], [-48, -26], [-53, -34], [-58, -35], [-57, -38], [-62, -40], [-65, -45], [-68, -50], [-69, -55], [-74, -52], [-75, -47], [-73, -40], [-72, -30], [-70, -20], [-76, -14], [-81, -6], [-80, -2], [-78, 2], [-77, 7]],
];
function diDarat(lon, lat) {
  for (const poli of BENUA) {
    let dalam = false;
    for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
      const [xi, yi] = poli[i], [xj, yj] = poli[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) dalam = !dalam;
    }
    if (dalam) return true;
  }
  return false;
}
// Arah satuan untuk (bujur, lintang): bujur 0 menghadap +z, kutub utara +y.
export function arahBola(lon, lat, out = new THREE.Vector3()) {
  const l = (lon * Math.PI) / 180, b = (lat * Math.PI) / 180;
  return out.set(Math.cos(b) * Math.sin(l), Math.sin(b), Math.cos(b) * Math.cos(l));
}
export function buatBolaDunia(R) {
  const g = new THREE.Group();     // posisi
  const miring = new THREE.Group(); // sumbu bumi dimiringkan
  const putar = new THREE.Group();  // berputar pada sumbunya
  g.add(miring);
  miring.add(putar);
  const matBola = new THREE.ShaderMaterial({
    uniforms: { uDasar: { value: warna("hsl(153, 45%, 9.5%)") }, uTepi: { value: W.zamrudPijar.clone() }, uKuat: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = vec3(0.0, 0.0, 1.0); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uDasar; uniform vec3 uTepi; uniform float uKuat; varying vec3 vN; varying vec3 vV;
      void main(){ float f = 1.0 - max(dot(normalize(vN), vV), 0.0); vec3 c = uDasar * (0.75 + 0.5 * vN.y * 0.5 + 0.25) + uTepi * pow(f, 3.0) * (0.35 + 0.65 * uKuat);
      gl_FragColor = vec4(c, 1.0); }`,
  });
  const bola = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 40), matBola);
  putar.add(bola);
  // Titik daratan (bola Fibonacci).
  const posDarat = [], acakDarat = [];
  const N = 9000, emas = Math.PI * (3 - Math.sqrt(5));
  const r = acak(21);
  const v = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N, rr = Math.sqrt(1 - y * y), th = emas * i;
    v.set(Math.cos(th) * rr, y, Math.sin(th) * rr);
    const lat = (Math.asin(v.y) * 180) / Math.PI, lon = (Math.atan2(v.x, v.z) * 180) / Math.PI;
    if (lat < -62 || !diDarat(lon, lat)) continue;
    posDarat.push(v.x * R * 1.004, v.y * R * 1.004, v.z * R * 1.004);
    acakDarat.push(r());
  }
  const geoDarat = new THREE.BufferGeometry();
  geoDarat.setAttribute("position", new THREE.Float32BufferAttribute(posDarat, 3));
  geoDarat.setAttribute("aAcak", new THREE.Float32BufferAttribute(acakDarat, 1));
  const matDarat = new THREE.ShaderMaterial({
    uniforms: { uWarna: { value: W.zamrudPijar.clone() }, uUkuran: { value: 6 }, uKuat: { value: 0 } },
    transparent: true, depthWrite: false,
    vertexShader: `uniform float uUkuran; attribute float aAcak; varying float vA;
      void main(){ vA = aAcak; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = uUkuran; }`,
    fragmentShader: `uniform vec3 uWarna; uniform float uKuat; varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.32, 0.5, d);
      gl_FragColor = vec4(uWarna * (0.75 + 0.5 * vA), a * uKuat); }`,
  });
  const darat = new THREE.Points(geoDarat, matDarat);
  putar.add(darat);
  // Garis lintang dan bujur.
  const p = [];
  const R1 = R * 1.002;
  for (let lat = -60; lat <= 60; lat += 30) for (let k = 0; k < 72; k++) {
    const a = arahBola(k * 5, lat), b = arahBola((k + 1) * 5, lat);
    p.push(a.x * R1, a.y * R1, a.z * R1, b.x * R1, b.y * R1, b.z * R1);
  }
  for (let lon = 0; lon < 360; lon += 30) for (let k = 0; k < 36; k++) {
    const a = arahBola(lon, -90 + k * 5), b = arahBola(lon, -90 + (k + 1) * 5);
    p.push(a.x * R1, a.y * R1, a.z * R1, b.x * R1, b.y * R1, b.z * R1);
  }
  const matGrid = bahanGaris(W.zamrud, 1.4, 0, { depthWrite: false });
  const grid = garisRuas(p, matGrid);
  putar.add(grid);
  // Cincin orbit tipis di luar bola.
  const cincinP = [];
  for (let k = 0; k < 128; k++) {
    const a = (k / 128) * Math.PI * 2, b = ((k + 1) / 128) * Math.PI * 2;
    cincinP.push(Math.cos(a) * R * 1.32, 0, Math.sin(a) * R * 1.32, Math.cos(b) * R * 1.32, 0, Math.sin(b) * R * 1.32);
  }
  const matCincin = bahanGaris(W.zamrud, 1.6, 0);
  const cincin = garisRuas(cincinP, matCincin);
  cincin.rotation.x = 0.28;
  g.add(cincin);
  return { g, miring, putar, bola, matBola, matDarat, matGrid, matCincin };
}
// Titik emas dan busur zamrud dari asal ke titik itu (dalam kerangka "putar").
export function buatTitikDunia(R, lon, lat, asal) {
  const g = new THREE.Group();
  const n = arahBola(lon, lat);
  const matInti = new THREE.MeshBasicMaterial({ color: W.emasPijar.clone().multiplyScalar(2.2), transparent: true, opacity: 0 });
  const inti = new THREE.Mesh(new THREE.SphereGeometry(R * 0.028, 12, 8), matInti);
  inti.position.copy(n).multiplyScalar(R * 1.01);
  const pijar = sprite(W.emasPijar, R * 0.32, 0);
  pijar.position.copy(n).multiplyScalar(R * 1.03);
  const matTiang = bahanGaris(W.emas, 3, 0);
  const ujung = n.clone().multiplyScalar(R * 1.16);
  const tiang = garisRuas([inti.position.x, inti.position.y, inti.position.z, ujung.x, ujung.y, ujung.z], matTiang);
  g.add(inti, pijar, tiang);
  let busur = null, panjang = 0;
  if (asal) { // busur lingkaran besar, terangkat sesuai jarak
    const a = arahBola(asal.lon, asal.lat), b = n;
    const sudut = a.angleTo(b);
    const titik = [];
    const q = new THREE.Vector3();
    for (let k = 0; k <= 48; k++) {
      const u = k / 48;
      q.copy(a).multiplyScalar(Math.sin((1 - u) * sudut)).addScaledVector(b, Math.sin(u * sudut)).divideScalar(Math.sin(sudut));
      const h = 1.01 + 0.22 * sudut * Math.sin(Math.PI * u);
      titik.push(q.x * R * h, q.y * R * h, q.z * R * h);
      if (k > 0) panjang += Math.hypot(titik[titik.length - 3] - titik[titik.length - 6], titik[titik.length - 2] - titik[titik.length - 5], titik[titik.length - 1] - titik[titik.length - 4]);
    }
    const mat = bahanGaris(W.zamrudPijar.clone().multiplyScalar(1.3), 2.6, 0, { dashed: true, dashSize: panjang, gapSize: panjang * 2 });
    busur = garisSambung(titik, mat);
  }
  return { g, n, matInti, pijar, matTiang, busur, panjang };
}
