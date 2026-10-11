// Pembuat benda bagian 2: gerbang LK dan cap stempel, meja forum, cetak biru, lempeng fondasi,
// kartu program kerja, gedung cabang, menara PB.
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { W, warna, bahan, bayang, balok, balokAlas, kanvasTeks, kotakBulat, FONT, sprite, LEBAR, TINGGI } from "./dasar.js";
import { acak, LAPIS } from "./isyarat.js";

export function bahanGaris(c, lebar, opasitas = 1) {
  const m = new LineMaterial({ color: c.clone(), linewidth: lebar, transparent: true, opacity: opasitas, depthWrite: false });
  m.resolution.set(LEBAR, TINGGI);
  return m;
}
export function garis(pos, mat) { return new LineSegments2(new LineSegmentsGeometry().setPositions(pos), mat); }
function papanTeks(teks, w, h, { latar = "hsl(153, 45%, 12%)", tinta = "hsl(42, 33%, 94%)", font = `700 120px ${FONT.mono}`, px = 256 } = {}) {
  const { c, g, tx } = kanvasTeks(px * w / h | 0, px);
  g.fillStyle = latar;
  kotakBulat(g, 0, 0, c.width, c.height, px * 0.12); g.fill();
  g.fillStyle = tinta;
  g.font = font;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(teks, c.width / 2, c.height / 2 + px * 0.04);
  tx.needsUpdate = true;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6, emissive: new THREE.Color(1, 1, 1), emissiveMap: tx, emissiveIntensity: 0.25 }));
}

// ---------------------------------------------------------------- gerbang LK (muka menghadap +z lokal = ke kamera)
export function buatGerbangLK() {
  const g = new THREE.Group();
  const mRangka = bahan(warna("hsl(153, 28%, 20%)"), { roughness: 0.45, metalness: 0.15 });
  const tiang = [-1, 1].map((s) => { const m = balokAlas(0.2, 2.08, 0.26, 0.04, mRangka); m.position.x = s * 0.66; return m; });
  const ambang = balok(1.62, 0.26, 0.32, 0.05, mRangka); ambang.position.y = 2.2;
  const papan = papanTeks("LK", 0.56, 0.24, { font: `700 150px ${FONT.mono}` }); papan.position.set(0, 2.2, 0.165);
  // Pintu: daun pintu yang bisa digulung ke atas (skala y dari atas).
  const mPintu = bahan(warna("hsl(26, 30%, 26%)"), { roughness: 0.55, emissive: W.zamrudRedup.clone(), emissiveIntensity: 0 });
  const daun = bayang(new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.0, 0.05).translate(0, -1.0, 0), mPintu));
  daun.position.set(0, 2.06, -0.04);
  const gagang = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), bahan(W.kertas)); gagang.position.set(0.38, -1.05, 0.04); daun.add(gagang);
  const mPortal = new THREE.MeshBasicMaterial({ color: W.zamrudPijar.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.04), mPortal); portal.position.set(0, 1.03, 0.02);
  // Mesin cap: rumah mesin di atas ambang, batang piston, dan stempel karet bergagang.
  const mMesin = bahan(warna("hsl(150, 5%, 38%)"), { roughness: 0.4, metalness: 0.5 });
  const mesin = new THREE.Group();
  const rumahMesin = balok(0.56, 0.36, 0.46, 0.05, mMesin); rumahMesin.position.y = 2.51;
  const stempel = new THREE.Group();
  const batang = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 12).translate(0, 0.55, 0), mMesin);
  batang.position.y = 0.42;
  const kenop = bayang(new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), bahan(warna("hsl(8, 45%, 40%)"), { roughness: 0.4 }))); kenop.position.y = 0.4;
  const leher = bayang(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.2, 16), bahan(warna("hsl(8, 45%, 40%)")))); leher.position.y = 0.26;
  const blok = balok(0.6, 0.17, 0.46, 0.03, bahan(warna("hsl(26, 38%, 38%)"), { roughness: 0.6 })); blok.position.y = 0.1;
  const bantal = balok(0.56, 0.04, 0.42, 0.01, bahan(warna("hsl(150, 4%, 18%)"), { roughness: 0.9 })); bantal.position.y = 0.0;
  stempel.add(batang, kenop, leher, blok, bantal);
  mesin.add(rumahMesin, stempel);
  g.add(...tiang, ambang, papan, daun, portal, mesin);
  g.userData = { mRangka, asal: mRangka.color.clone(), daun, mPintu, mPortal, mesin, stempel, papan };
  return g;
}

// ---------------------------------------------------------------- meja forum dan kursi
export function buatKursi() {
  const g = new THREE.Group();
  const m = bahan(warna("hsl(150, 6%, 40%)"), { roughness: 0.6 });
  const dudukan = balok(0.34, 0.045, 0.34, 0.012, m); dudukan.position.y = 0.32;
  const sandaran = balok(0.34, 0.36, 0.045, 0.012, m); sandaran.position.set(0, 0.52, -0.15);
  g.add(dudukan, sandaran);
  for (const [x, z] of [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]]) {
    const kaki = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.3, 6), m); kaki.position.set(x, 0.15, z); g.add(kaki);
  }
  g.traverse((o) => { if (o.isMesh) bayang(o); });
  return g;
}
export const SLOT_FORUM = [[-0.56, 0.72], [0, 0.72], [0.56, 0.72], [1.18, 0], [0.56, -0.72], [0, -0.72], [-0.56, -0.72], [-1.18, 0]];
export function buatMeja() {
  const g = new THREE.Group();
  const mKayu = bahan(warna("hsl(26, 26%, 28%)"), { roughness: 0.55 });
  const atas = balok(1.8, 0.07, 0.92, 0.025, mKayu); atas.position.y = 0.6;
  g.add(atas);
  for (const [x, z] of [[-0.8, -0.36], [0.8, -0.36], [-0.8, 0.36], [0.8, 0.36]]) { const k = balok(0.07, 0.58, 0.07, 0.01, mKayu); k.position.set(x, 0.29, z); g.add(k); }
  // Dua mikrofon meja dan tumpukan kertas: tanda meja sidang.
  const mMik = bahan(warna("hsl(150, 4%, 22%)"), { roughness: 0.35, metalness: 0.4 });
  for (const [x, z, a] of [[-0.45, 0.2, 0.5], [0.45, -0.2, -2.6]]) {
    const mik = new THREE.Group();
    const alas = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.025, 16), mMik);
    const leher = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6).translate(0, 0.15, 0), mMik); leher.rotation.z = 0.35;
    const kepala = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.06, 4, 8), mMik); kepala.position.set(-0.11, 0.29, 0); kepala.rotation.z = 0.9;
    mik.add(alas, leher, kepala);
    mik.position.set(x, 0.648, z); mik.rotation.y = a;
    g.add(mik);
  }
  const kertas = balok(0.3, 0.03, 0.22, 0.005, bahan(W.kertas, { roughness: 0.9 })); kertas.position.set(0.05, 0.65, 0.12); kertas.rotation.y = 0.2;
  g.add(kertas);
  g.traverse((o) => { if (o.isMesh) bayang(o); });
  return g;
}

// ---------------------------------------------------------------- cetak biru: lembar gambar teknik dan rangka bangunan
export function buatLembarCetakBiru(ukuran) {
  const { c, g, tx } = kanvasTeks(1024, 1024);
  g.fillStyle = "hsl(178, 42%, 14%)";
  g.fillRect(0, 0, 1024, 1024);
  g.strokeStyle = "hsla(175, 60%, 72%, 0.14)"; g.lineWidth = 1.5;
  for (let i = 0; i <= 1024; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.moveTo(0, i); g.lineTo(1024, i); g.stroke(); }
  g.strokeStyle = "hsla(175, 55%, 85%, 0.9)"; g.lineWidth = 5;
  g.strokeRect(40, 40, 944, 944);
  // Tampak depan gedung: alas berjenjang, tiang, atap pelana.
  g.lineWidth = 6;
  g.strokeRect(200, 520, 560, 70); g.strokeRect(230, 470, 500, 50);
  for (let x = 270; x <= 690; x += 84) g.strokeRect(x, 270, 34, 200);
  g.beginPath(); g.moveTo(200, 270); g.lineTo(480, 120); g.lineTo(760, 270); g.closePath(); g.stroke();
  g.strokeRect(445, 360, 70, 110);
  // Garis ukuran.
  g.lineWidth = 3; g.setLineDash([14, 10]);
  g.beginPath(); g.moveTo(200, 640); g.lineTo(760, 640); g.moveTo(820, 120); g.lineTo(820, 590); g.stroke();
  g.setLineDash([]);
  for (const [x, y] of [[200, 640], [760, 640]]) { g.beginPath(); g.moveTo(x, y - 14); g.lineTo(x, y + 14); g.stroke(); }
  for (const [x, y] of [[820, 120], [820, 590]]) { g.beginPath(); g.moveTo(x - 14, y); g.lineTo(x + 14, y); g.stroke(); }
  // Denah kecil dan kotak judul tanpa kata.
  g.lineWidth = 4;
  g.strokeRect(120, 720, 300, 200); g.strokeRect(120, 720, 120, 90); g.strokeRect(300, 810, 120, 110);
  g.strokeRect(640, 820, 300, 110);
  for (let y = 845; y < 920; y += 24) { g.beginPath(); g.moveTo(660, y); g.lineTo(660 + 140 + (y % 3) * 40, y); g.stroke(); }
  tx.needsUpdate = true;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTex: { value: tx }, uBuka: { value: 0 }, uKuat: { value: 1 }, uTepi: { value: W.zamrudPijar.clone() } },
    transparent: true, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform sampler2D uTex; uniform float uBuka; uniform float uKuat; uniform vec3 uTepi; varying vec2 vUv;
      void main(){
        float d = length(vUv - 0.5) / 0.72;
        float m = 1.0 - smoothstep(uBuka - 0.06, uBuka, d);
        float tepi = exp(-pow((d - uBuka) * 22.0, 2.0)) * step(0.001, uBuka) * (1.0 - step(0.999, uBuka));
        vec3 c = texture2D(uTex, vUv).rgb;
        gl_FragColor = vec4(c * m + uTepi * tepi * 1.6, (m * 0.97 + tepi) * uKuat);
      }`,
  });
  const lembar = new THREE.Mesh(new THREE.PlaneGeometry(ukuran, ukuran).rotateX(-Math.PI / 2), mat);
  return lembar;
}
// Rangka gedung (garis), alas di y = 0, menghadap +z lokal: dinding, atap pelana, serambi bertiang, pintu.
export function buatRangka(lebar = 1.45, dalam = 1.05, tinggi = 0.78, mat) {
  const a = lebar / 2, b = dalam / 2, h = tinggi, r = h + 0.42;
  const p = [];
  const garisKe = (x1, y1, z1, x2, y2, z2) => p.push(x1, y1, z1, x2, y2, z2);
  for (const y of [0, h]) { garisKe(-a, y, -b, a, y, -b); garisKe(a, y, -b, a, y, b); garisKe(a, y, b, -a, y, b); garisKe(-a, y, b, -a, y, -b); }
  for (const [x, z] of [[-a, -b], [a, -b], [a, b], [-a, b]]) garisKe(x, 0, z, x, h, z);
  // Atap pelana dengan bubungan sejajar z (segitiga di muka depan dan belakang).
  for (const z of [-b - 0.08, b + 0.08]) { garisKe(-a - 0.1, h, z, 0, r, z); garisKe(0, r, z, a + 0.1, h, z); garisKe(-a - 0.1, h, z, a + 0.1, h, z); }
  garisKe(0, r, -b - 0.08, 0, r, b + 0.08);
  garisKe(-a - 0.1, h, -b - 0.08, -a - 0.1, h, b + 0.08);
  garisKe(a + 0.1, h, -b - 0.08, a + 0.1, h, b + 0.08);
  // Tiang serambi dan pintu di muka depan.
  for (let i = 0; i < 4; i++) { const x = -a + 0.22 + i * ((lebar - 0.44) / 3); garisKe(x, 0, b + 0.08, x, h, b + 0.08); }
  garisKe(-0.13, 0, b, -0.13, 0.42, b); garisKe(-0.13, 0.42, b, 0.13, 0.42, b); garisKe(0.13, 0.42, b, 0.13, 0, b);
  // Jendela di sisi +x.
  for (const z of [-0.22, 0.22]) { garisKe(a, 0.3, z - 0.1, a, 0.3, z + 0.1); garisKe(a, 0.55, z - 0.1, a, 0.55, z + 0.1); garisKe(a, 0.3, z - 0.1, a, 0.55, z - 0.1); garisKe(a, 0.3, z + 0.1, a, 0.55, z + 0.1); }
  return garis(p, mat);
}

// ---------------------------------------------------------------- lempeng fondasi
export const LEMPENG = LAPIS.map((nama, k) => ({ nama, lebar: 3.0 - 0.22 * k, tebal: 0.27 }));
function teksturBatu(k) { // blok batu berpola, untuk lempeng fondasi
  const { c, g, tx } = kanvasTeks(256, 256);
  const r = acak(500 + k);
  g.fillStyle = "rgb(150,150,150)"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 32) for (let x = -((y / 32) % 2) * 32; x < 256; x += 64) {
    const l = 120 + r() * 50;
    g.fillStyle = `rgb(${l},${l},${l})`; g.fillRect(x + 2, y + 2, 60, 28);
  }
  tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
  tx.repeat.set(2, 2);
  tx.needsUpdate = true;
  return tx;
}
export function buatLempeng(k) {
  const { lebar, tebal } = LEMPENG[k];
  const g = new THREE.Group();
  const m = bahan(warna(`hsl(153, ${16 + 2 * k}%, ${30 + 2 * k}%)`), { map: teksturBatu(k), roughness: 0.8, emissive: W.zamrudPijar.clone(), emissiveIntensity: 0 });
  const slab = balokAlas(lebar, tebal, lebar, 0.04, m);
  const a = lebar / 2 + 0.005;
  const tepi = garis([-a, tebal, -a, a, tebal, -a, a, tebal, -a, a, tebal, a, a, tebal, a, -a, tebal, a, -a, tebal, a, -a, tebal, -a,
    a, 0.02, a, -a, 0.02, a, a, 0.02, a, a, 0.02, -a], bahanGaris(W.zamrud, 2, 0.35));
  // Alur pahat di muka depan.
  const alur = balok(lebar - 0.3, 0.025, 0.01, 0, bahan(warna("hsl(153, 20%, 11%)"))); alur.position.set(0, tebal * 0.5, a);
  const alur2 = alur.clone(); alur2.rotation.y = Math.PI / 2; alur2.position.set(a, tebal * 0.5, 0);
  g.add(slab, tepi, alur, alur2);
  g.userData = { m, tepi, lebar, tebal };
  return g;
}

// ---------------------------------------------------------------- kartu program kerja
const RGB = (h, s, l, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`;
export function buatKartu(jenis) {
  const g = new THREE.Group();
  const { c, g: x, tx } = kanvasTeks(420, 540);
  const papan = new THREE.Group();
  const mBingkai = bahan(warna("hsl(153, 30%, 16%)"), { roughness: 0.4, metalness: 0.2, emissive: W.emasPijar.clone(), emissiveIntensity: 0 });
  const bingkai = balok(1.0, 1.28, 0.06, 0.03, mBingkai);
  const mMuka = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.7, emissive: new THREE.Color(1, 1, 1), emissiveMap: tx, emissiveIntensity: 0.12, transparent: true });
  const muka = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 1.21), mMuka); muka.position.z = 0.032;
  papan.add(bingkai, muka);
  papan.position.y = 0.72;
  const kaki = balok(0.56, 0.05, 0.3, 0.015, mBingkai); kaki.position.y = 0.025;
  const tiang = balok(0.06, 0.12, 0.06, 0.01, mBingkai); tiang.position.y = 0.1;
  const pijar = sprite(W.emas, 2.6); pijar.position.set(0, 0.72, -0.2); pijar.material.opacity = 0;
  g.add(papan, kaki, tiang, pijar);
  let kunci = "";
  const r = acak(jenis === "ramai" ? 77 : 78);
  const hias = Array.from({ length: 26 }, () => ({ x: 20 + r() * 380, y: 110 + r() * 410, a: r() * 6.28, w: 10 + r() * 16, h: r() }));
  function gambar(nCek, emas) {
    const k = `${nCek}|${emas.toFixed(2)}`;
    if (k === kunci) return;
    kunci = k;
    x.clearRect(0, 0, 420, 540);
    x.fillStyle = emas > 0 ? `hsl(${42}, ${30 + 30 * emas}%, ${93 - 6 * emas}%)` : RGB(42, 30, 93);
    kotakBulat(x, 0, 0, 420, 540, 30); x.fill();
    x.fillStyle = emas > 0.5 ? "hsl(42, 55%, 38%)" : RGB(153, 45, 18);
    x.save(); kotakBulat(x, 0, 0, 420, 540, 30); x.clip(); x.fillRect(0, 0, 420, 92); x.restore();
    x.fillStyle = RGB(42, 33, 96);
    x.font = `700 42px ${FONT.sans}`; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("Program Kerja", 210, 48);
    if (jenis === "ramai") {
      // Kartu yang hanya ramai: konfeti, bintang, pengeras suara, tanda seru.
      const warnaHias = [RGB(8, 60, 58), RGB(188, 55, 45), RGB(320, 40, 55), RGB(200, 55, 55), RGB(160, 50, 40)];
      hias.forEach((h, i) => {
        x.save(); x.translate(h.x, h.y); x.rotate(h.a); x.fillStyle = warnaHias[i % warnaHias.length];
        if (h.h < 0.5) x.fillRect(-h.w / 2, -h.w / 5, h.w, h.w / 2.5);
        else { x.beginPath(); for (let s = 0; s < 10; s++) { const rr = s % 2 ? h.w * 0.4 : h.w; x.lineTo(Math.cos(s * Math.PI / 5) * rr, Math.sin(s * Math.PI / 5) * rr); } x.closePath(); x.fill(); }
        x.restore();
      });
      x.fillStyle = RGB(8, 55, 50);
      x.beginPath(); x.moveTo(110, 240); x.lineTo(200, 190); x.lineTo(200, 350); x.lineTo(110, 300); x.closePath(); x.fill();
      x.fillRect(80, 240, 34, 60);
      x.font = `700 120px ${FONT.sans}`; x.fillText("!!!", 300, 275);
      for (let i = 0; i < 2; i++) { // baris kosong: tidak ada isian nilai
        x.strokeStyle = RGB(153, 25, 50, 0.5); x.lineWidth = 4;
        kotakBulat(x, 34, 400 + i * 64, 40, 40, 8); x.stroke();
        x.fillStyle = RGB(153, 10, 60, 0.35); x.fillRect(96, 413 + i * 64, 150 + 60 * i, 14);
      }
    } else {
      LAPIS.forEach((nama, i) => {
        const y = 140 + i * 78;
        x.strokeStyle = RGB(153, 40, 22); x.lineWidth = 5;
        kotakBulat(x, 34, y - 4, 50, 50, 10); x.stroke();
        x.fillStyle = RGB(153, 45, 16); x.textAlign = "left";
        x.font = `600 38px ${FONT.sans}`; x.fillText(nama, 110, y + 22);
        if (i < nCek) {
          x.strokeStyle = emas > 0.5 ? "hsl(42, 70%, 34%)" : RGB(153, 62, 30); x.lineWidth = 9; x.lineCap = "round";
          x.beginPath(); x.moveTo(44, y + 20); x.lineTo(57, y + 34); x.lineTo(80, y + 2); x.stroke();
        }
      });
    }
    tx.needsUpdate = true;
  }
  gambar(0, 0);
  g.userData = { papan, mBingkai, mMuka, pijar, gambar };
  return g;
}

// ---------------------------------------------------------------- jendela bercahaya pada muka gedung
function jendelaMuka(g, mat, { w, h, x0, y0, kolom, baris, lebarJ, tinggiJ, sumbu, muka }) {
  for (let i = 0; i < kolom; i++) for (let j = 0; j < baris; j++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(lebarJ, tinggiJ), mat);
    const a = x0 + (kolom === 1 ? 0 : (i / (kolom - 1)) * w) , y = y0 + (baris === 1 ? 0 : (j / (baris - 1)) * h);
    if (sumbu === "z") m.position.set(a, y, muka + 0.004);
    else { m.rotation.y = Math.PI / 2; m.position.set(muka + 0.004, y, -a); }
    g.add(m);
  }
}

// ---------------------------------------------------------------- gedung cabang (pintu di +z lokal)
export function buatCabang() {
  const g = new THREE.Group();
  const w = 1.75, h = 1.3, d = 1.35;
  const mDinding = bahan(warna("hsl(150, 16%, 30%)"), { roughness: 0.8 });
  const mJendela = new THREE.MeshStandardMaterial({ color: W.zamrud.clone(), emissive: W.zamrudPijar.clone(), emissiveIntensity: 0.85 });
  const badan = balokAlas(w, h, d, 0.03, mDinding);
  const atap = balokAlas(w + 0.1, 0.1, d + 0.1, 0.02, bahan(warna("hsl(153, 30%, 14%)"))); atap.position.y = h;
  const pintu = balok(0.32, 0.5, 0.05, 0.01, bahan(warna("hsl(26, 30%, 22%)"))); pintu.position.set(0, 0.25, d / 2 + 0.01);
  const papan = papanTeks("Cabang", 0.9, 0.2, { font: `700 124px ${FONT.sans}` }); papan.position.set(0, 0.7, d / 2 + 0.012);
  g.add(badan, atap, pintu, papan);
  jendelaMuka(g, mJendela, { w: 1.2, h: 0, x0: -0.6, y0: 1.04, kolom: 4, baris: 1, lebarJ: 0.18, tinggiJ: 0.22, sumbu: "z", muka: d / 2 });
  jendelaMuka(g, mJendela, { w: 0.8, h: 0.5, x0: -0.4, y0: 0.45, kolom: 3, baris: 2, lebarJ: 0.18, tinggiJ: 0.22, sumbu: "x", muka: w / 2 });
  const tiang = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6), bahan(W.kertas)); tiang.position.set(w / 2 - 0.15, h + 0.4, d / 2 - 0.15);
  const bendera = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.16), new THREE.MeshStandardMaterial({ color: W.zamrud.clone(), side: THREE.DoubleSide, emissive: W.zamrudRedup.clone(), emissiveIntensity: 0.6 }));
  bendera.position.set(w / 2 - 0.15 + 0.13, h + 0.62, d / 2 - 0.15);
  g.add(tiang, bendera);
  g.traverse((o) => { if (o.isMesh && o.material !== mJendela) bayang(o); });
  return g;
}

// ---------------------------------------------------------------- menara PB (muka depan +z lokal)
export function buatMenara() {
  const g = new THREE.Group();
  const mBadan = bahan(warna("hsl(152, 18%, 32%)"), { roughness: 0.6, metalness: 0.1 });
  const mGelap = bahan(warna("hsl(153, 30%, 15%)"), { roughness: 0.5 });
  const mJendela = new THREE.MeshStandardMaterial({ color: W.zamrud.clone(), emissive: W.zamrudPijar.clone(), emissiveIntensity: 0.8 });
  const alas = balokAlas(2.0, 0.3, 2.0, 0.04, mGelap);
  const batang = balokAlas(1.2, 3.0, 1.2, 0.04, mBadan); batang.position.y = 0.3;
  const sabuk = balokAlas(1.4, 0.14, 1.4, 0.03, mGelap); sabuk.position.y = 3.3;
  const atas = balokAlas(0.86, 0.8, 0.86, 0.03, mBadan); atas.position.y = 3.44;
  const mahkota = bayang(new THREE.Mesh(new THREE.ConeGeometry(0.66, 0.55, 4).rotateY(Math.PI / 4).translate(0, 0.275, 0), mGelap)); mahkota.position.y = 4.24;
  const antena = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.55, 8).translate(0, 0.275, 0), mGelap); antena.position.y = 4.76;
  const papan = papanTeks("PB", 0.5, 0.3, { font: `700 160px ${FONT.mono}` }); papan.position.set(0, 3.84, 0.433);
  g.add(alas, batang, sabuk, atas, mahkota, antena, papan);
  jendelaMuka(g, mJendela, { w: 0.7, h: 2.3, x0: -0.35, y0: 0.75, kolom: 3, baris: 7, lebarJ: 0.16, tinggiJ: 0.17, sumbu: "z", muka: 0.6 });
  jendelaMuka(g, mJendela, { w: 0.7, h: 2.3, x0: -0.35, y0: 0.75, kolom: 3, baris: 7, lebarJ: 0.16, tinggiJ: 0.17, sumbu: "x", muka: 0.6 });
  const pintu = balok(0.36, 0.48, 0.05, 0.01, bahan(warna("hsl(26, 30%, 22%)"))); pintu.position.set(0, 0.54, 0.61);
  g.add(pintu);
  // Titik keputusan di puncak.
  const titik = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), new THREE.MeshBasicMaterial({ color: W.emas.clone().multiplyScalar(1.5) }));
  titik.position.y = 5.38;
  const pijar = sprite(W.emas, 1.8); pijar.position.y = 5.38;
  g.add(titik, pijar);
  g.userData = { titik, pijar, puncak: new THREE.Vector3(0, 5.38, 0), mJendela };
  return g;
}
