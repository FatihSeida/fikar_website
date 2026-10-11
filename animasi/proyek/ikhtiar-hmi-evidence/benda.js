// Pembuat benda bagian 1: figur pion, kitab terbuka, ruang kuliah 1947, ubin kalender, rumah komisariat.
// Setiap benda dibentuk dari geometri berbentuk (lathe, extrude, balok bulat, teks kanvas), bukan kubus polos.
import * as THREE from "three";
import { W, warna, bahan, bayang, balok, balokAlas, kanvasTeks, kotakBulat, FONT, sprite } from "./dasar.js";
import { acak } from "./isyarat.js";

// ---------------------------------------------------------------- figur pion tanpa wajah
const PROFIL_PION = [
  [0, 0], [0.27, 0], [0.285, 0.02], [0.28, 0.05], [0.245, 0.075], [0.2, 0.092], [0.184, 0.125], [0.17, 0.2],
  [0.156, 0.32], [0.142, 0.44], [0.132, 0.515], [0.162, 0.548], [0.178, 0.574], [0.162, 0.6], [0.105, 0.618],
  [0.078, 0.64], [0, 0.645],
].map(([r, y]) => new THREE.Vector2(r, y));
const GEO_PION = new THREE.LatheGeometry(PROFIL_PION, 40);
const GEO_KEMEJA = new THREE.LatheGeometry(PROFIL_PION.slice(8, 12).map((p) => new THREE.Vector2(p.x + 0.006, p.y)), 6, -0.3, 0.6);
const GEO_KEPALA = new THREE.SphereGeometry(0.138, 32, 20).translate(0, 0.765, 0);
export const TINGGI_PION = 0.903;

// Pion: badan (jaket) dari lathe, bidang kemeja di depan (+z lokal) supaya arah hadap terbaca, kepala bulat polos.
export function buatPion(jaketCss, { kepala = W.kepala } = {}) {
  const g = new THREE.Group();
  const jaket = warna(jaketCss);
  const mBadan = bahan(jaket, { roughness: 0.55 });
  const mKepala = bahan(kepala, { roughness: 0.45 });
  const mKemeja = bahan(warna("hsl(42, 30%, 88%)"), { roughness: 0.6 });
  const badan = bayang(new THREE.Mesh(GEO_PION, mBadan));
  const kemeja = new THREE.Mesh(GEO_KEMEJA, mKemeja);
  const kpl = bayang(new THREE.Mesh(GEO_KEPALA, mKepala));
  const tubuh = new THREE.Group(); // condong/tekan diterapkan di sini
  tubuh.add(badan, kemeja, kpl);
  g.add(tubuh);
  g.userData = { tubuh, mBadan, mKepala, mKemeja, jaket: jaket.clone(), kepala: kepala.clone() };
  return g;
}
// Warnai pion: k = 0 asli, redup (0..1) menggelapkan, abu (0..1) menuju abu-abu, nyala = pendar emas.
const _c = new THREE.Color();
export function warnaiPion(p, { redup = 0, abu = 0, nyala = 0, warnaNyala = W.emasPijar, opasitas = 1 } = {}) {
  const d = p.userData;
  const gelap = 1 - 0.75 * redup;
  d.mBadan.color.copy(d.jaket).lerp(_c.copy(W.abu).multiplyScalar(0.8), abu).multiplyScalar(gelap);
  d.mKepala.color.copy(d.kepala).lerp(W.abu, abu * 0.6).multiplyScalar(gelap);
  d.mKemeja.color.setHSL(0.117, 0.3 * (1 - abu), 0.88 * gelap);
  d.mBadan.emissive.copy(warnaNyala).multiplyScalar(nyala * 0.35);
  d.mKepala.emissive.copy(warnaNyala).multiplyScalar(nyala * 0.7);
  for (const m of [d.mBadan, d.mKepala, d.mKemeja]) {
    m.transparent = opasitas < 0.999;
    m.opacity = opasitas;
    m.depthWrite = opasitas > 0.5;
  }
  p.visible = opasitas > 0.003;
}

// ---------------------------------------------------------------- kitab terbuka
// Punggung kitab sepanjang z lokal; halaman membentang ke ±x. Dipasang miring 45° agar terbaca dari depan.
const LEBAR_HAL = 0.9, PANJANG_HAL = 1.24;
const yHalaman = (x) => { const s = Math.min(1, Math.abs(x) / LEBAR_HAL); return 0.055 + 0.15 * Math.pow(Math.sin(Math.PI / 2 * Math.min(1, s * 1.7)), 0.75) - 0.025 * s; };
function geoPermukaan(kiri, nx = 28) {
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= nx; i++) {
    const s = 0.03 + (i / nx) * (LEBAR_HAL - 0.05);
    const x = kiri ? -s : s;
    for (let j = 0; j <= 1; j++) {
      const z = (j - 0.5) * (PANJANG_HAL - 0.06);
      pos.push(x, yHalaman(x) + 0.003, z);
      uv.push(kiri ? 1 - i / nx : i / nx, 1 - j);
    }
  }
  for (let i = 0; i < nx; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    if (kiri) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function teksturHalaman(benih) {
  const { c, g, tx } = kanvasTeks(512, 720);
  g.fillStyle = "hsl(42, 32%, 90%)";
  g.fillRect(0, 0, c.width, c.height);
  const r = acak(benih);
  g.fillStyle = "hsl(30, 20%, 30%)";
  // Baris tulisan rata kanan (seperti kitab berbahasa Arab), dengan satu judul bab.
  g.fillRect(150, 70, 212, 14);
  for (let y = 130; y < 660; y += 34) {
    const panjang = 300 + r() * 120;
    let x = 450;
    while (x > 450 - panjang) { const w = 14 + r() * 46; g.globalAlpha = 0.55 + r() * 0.3; g.fillRect(x - w, y, w, 7 + r() * 3); x -= w + 10 + r() * 8; }
  }
  g.globalAlpha = 1;
  g.strokeStyle = "hsl(153, 40%, 30%)";
  g.lineWidth = 4;
  g.strokeRect(36, 36, 440, 648);
  tx.needsUpdate = true;
  return tx;
}
export function buatKitab() {
  const g = new THREE.Group();
  const mSampul = bahan(warna("hsl(153, 40%, 15%)"), { roughness: 0.5 });
  const mTepi = bahan(warna("hsl(40, 22%, 52%)"), { roughness: 0.9 });
  for (const s of [-1, 1]) {
    const sampul = balok(LEBAR_HAL + 0.08, 0.04, PANJANG_HAL + 0.1, 0.015, mSampul);
    sampul.position.set(s * (LEBAR_HAL + 0.08) / 2, 0.02, 0);
    sampul.rotation.z = s * 0.06;
    g.add(sampul);
    // Blok halaman: penampang melengkung yang diekstrusi sepanjang punggung.
    const bentuk = new THREE.Shape();
    bentuk.moveTo(0.02, 0.045);
    for (let i = 0; i <= 20; i++) { const x = 0.02 + (i / 20) * (LEBAR_HAL - 0.02); bentuk.lineTo(x, yHalaman(x)); }
    bentuk.lineTo(LEBAR_HAL, 0.045);
    bentuk.lineTo(0.02, 0.045);
    const geo = new THREE.ExtrudeGeometry(bentuk, { depth: PANJANG_HAL - 0.04, bevelEnabled: false, curveSegments: 4 }).translate(0, 0, -(PANJANG_HAL - 0.04) / 2);
    if (s < 0) geo.scale(-1, 1, 1);
    const blok = bayang(new THREE.Mesh(geo, mTepi));
    if (s < 0) blok.material = mTepi.clone(), blok.material.side = THREE.DoubleSide;
    g.add(blok);
    const muka = new THREE.Mesh(geoPermukaan(s < 0), new THREE.MeshStandardMaterial({ map: teksturHalaman(s < 0 ? 3 : 4), color: new THREE.Color(0.56, 0.56, 0.56), roughness: 0.9 }));
    muka.receiveShadow = true;
    g.add(muka);
  }
  const punggung = bayang(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, PANJANG_HAL + 0.1, 16, 1, false, Math.PI / 2, Math.PI).rotateX(Math.PI / 2), mSampul));
  punggung.position.y = 0.0;
  g.add(punggung);
  // Lembar yang dibalik: berporos di punggung, berputar dari kanan ke kiri.
  const poros = new THREE.Group();
  const lembar = new THREE.Mesh(geoPermukaan(false), new THREE.MeshStandardMaterial({ map: teksturHalaman(5), color: new THREE.Color(0.6, 0.6, 0.6), roughness: 0.9, side: THREE.DoubleSide }));
  lembar.position.y = 0.004;
  poros.add(lembar);
  g.add(poros);
  g.userData = { poros, lembar, yHalaman };
  return g;
}

// ---------------------------------------------------------------- ruang kuliah 1947 (diorama tanpa dinding depan)
export const RUANG = { X: 2.3, Z: 2.0, H: 2.05 };
function teksturLantai() {
  const { c, g, tx } = kanvasTeks(512, 512);
  const r = acak(11);
  for (let i = 0; i < 16; i++) {
    g.fillStyle = `hsl(28, ${24 + r() * 8}%, ${19 + r() * 5}%)`;
    g.fillRect(i * 32, 0, 32, 512);
    g.fillStyle = "hsl(28, 30%, 11%)";
    g.fillRect(i * 32, 0, 2, 512);
    const sambung = r() * 512;
    g.fillRect(i * 32, sambung, 32, 2);
  }
  tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
  tx.needsUpdate = true;
  return tx;
}
function teksturPapan() {
  const { c, g, tx } = kanvasTeks(512, 240);
  g.fillStyle = "hsl(160, 28%, 15%)";
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = "hsla(42, 30%, 92%, 0.75)";
  g.lineCap = "round";
  const r = acak(31);
  // Coretan kapur tanpa kata: baris tulisan dan satu bagan kecil.
  g.lineWidth = 4;
  for (let b = 0; b < 4; b++) {
    let x = 40;
    const y = 48 + b * 40;
    while (x < 300 + r() * 60) { const w = 18 + r() * 40; g.beginPath(); g.moveTo(x, y + r() * 4); g.lineTo(x + w, y + r() * 4); g.stroke(); x += w + 12; }
  }
  g.lineWidth = 3.5;
  g.strokeRect(370, 50, 100, 60);
  g.beginPath(); g.moveTo(420, 110); g.lineTo(420, 140); g.moveTo(380, 140); g.lineTo(460, 140); g.moveTo(380, 140); g.lineTo(380, 165); g.moveTo(460, 140); g.lineTo(460, 165); g.stroke();
  g.strokeRect(355, 165, 50, 34); g.strokeRect(435, 165, 50, 34);
  tx.needsUpdate = true;
  return tx;
}
export function buatRuang() {
  const { X, Z, H } = RUANG;
  const g = new THREE.Group();
  const lantaiTx = teksturLantai();
  lantaiTx.repeat.set(1.4, 1.2);
  const lantai = balok(2 * X, 0.12, 2 * Z, 0.02, bahan(warna("hsl(28, 30%, 30%)"), { map: lantaiTx, roughness: 0.75 }));
  lantai.position.y = 0.06;
  g.add(lantai);
  const mDinding = bahan(warna("hsl(48, 12%, 52%)"), { roughness: 0.85 });
  const mLis = bahan(warna("hsl(28, 30%, 22%)"), { roughness: 0.7 });
  const dindingX = balok(0.14, H, 2 * Z + 0.14, 0, mDinding); // dinding papan tulis (x = −X)
  dindingX.position.set(-X - 0.07, H / 2 + 0.12, -0.07);
  const dindingZ = balok(2 * X, H, 0.14, 0, mDinding.clone()); // dinding jendela (z = −Z)
  dindingZ.position.set(0, H / 2 + 0.12, -Z - 0.07);
  g.add(dindingX, dindingZ);
  // Lis kayu bawah dan atas.
  for (const [w, d, x, z] of [[0.05, 2 * Z, -X + 0.025, 0], [2 * X, 0.05, 0, -Z + 0.025]]) {
    const bawah = balok(w, 0.5, d, 0, mLis); bawah.position.set(x, 0.37, z); g.add(bawah);
    const atas = balok(w, 0.06, d, 0, mLis); atas.position.set(x, H + 0.09, z); g.add(atas);
  }
  // Dinding depan rendah (ambang) supaya ruang terbaca tertutup.
  const mAmbang = bahan(warna("hsl(48, 10%, 40%)"), { roughness: 0.85 });
  const ambangX = balok(0.12, 0.2, 2 * Z, 0.02, mAmbang); ambangX.position.set(X - 0.06, 0.22, 0);
  const ambangZ = balok(2 * X - 0.9, 0.2, 0.12, 0.02, mAmbang); ambangZ.position.set(-0.45, 0.22, Z - 0.06);
  g.add(ambangX, ambangZ);
  // Papan tulis di dinding x = −X.
  const bingkai = balok(0.06, 1.06, 2.3, 0.02, mLis);
  bingkai.position.set(-X + 0.03, 1.32, 0);
  const papan = new THREE.Mesh(new THREE.PlaneGeometry(2.16, 0.94), new THREE.MeshStandardMaterial({ map: teksturPapan(), roughness: 0.9 }));
  papan.rotation.y = Math.PI / 2;
  papan.position.set(-X + 0.065, 1.32, 0);
  const rak = balok(0.1, 0.04, 2.2, 0.01, mLis); rak.position.set(-X + 0.08, 0.8, 0);
  g.add(bingkai, papan, rak);
  // Dua jendela di dinding z = −Z, kacanya bercahaya emas (cahaya ruang 1947).
  const mKaca = new THREE.MeshBasicMaterial({ color: W.emasPijar.clone().multiplyScalar(1.2) });
  const kaca = [];
  for (const x of [-0.55, 1.2]) {
    const bk = balok(0.92, 1.0, 0.06, 0.01, mLis); bk.position.set(x, 1.38, -Z + 0.03); g.add(bk);
    const k = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.88), mKaca); k.position.set(x, 1.38, -Z + 0.065); g.add(k); kaca.push(k);
    const tiangV = balok(0.05, 0.88, 0.03, 0, mLis); tiangV.position.set(x, 1.38, -Z + 0.08);
    const tiangH = balok(0.8, 0.05, 0.03, 0, mLis); tiangH.position.set(x, 1.38, -Z + 0.08);
    g.add(tiangV, tiangH);
  }
  // Meja dosen di depan kelas.
  const mKayu = bahan(warna("hsl(26, 32%, 30%)"), { roughness: 0.6 });
  const mejaDosen = new THREE.Group();
  const atasMD = balok(0.5, 0.06, 0.8, 0.015, mKayu); atasMD.position.y = 0.62;
  const badanMD = balok(0.42, 0.56, 0.72, 0.01, mKayu); badanMD.position.y = 0.34;
  mejaDosen.add(atasMD, badanMD);
  mejaDosen.position.set(-1.95, 0.06, -1.62);
  mejaDosen.scale.set(0.8, 0.85, 0.6);
  g.add(mejaDosen);
  // Meja dan bangku mahasiswa: tiga baris menghadap papan tulis.
  const BARIS = [{ x: -0.1, z: [-1.4, -0.7, 0, 0.7, 1.4] }, { x: 0.85, z: [-1.4, -0.7, 0, 0.7, 1.4] }, { x: 1.8, z: [-1.05, -0.35, 0.35, 1.05] }];
  const kursiMhs = [];
  for (const b of BARIS) {
    const panjang = b.z.length * 0.7 + 0.1;
    const meja = balok(0.36, 0.05, panjang, 0.012, mKayu); meja.position.set(b.x - 0.42, 0.56, 0); g.add(meja);
    for (const z of [-panjang / 2 + 0.08, panjang / 2 - 0.08]) {
      const kaki = balok(0.3, 0.44, 0.05, 0, mLis); kaki.position.set(b.x - 0.42, 0.34, z); g.add(kaki);
    }
    const bangku = balok(0.22, 0.05, panjang, 0.012, mKayu); bangku.position.set(b.x + 0.2, 0.33, 0); g.add(bangku);
    for (const z of b.z) kursiMhs.push(new THREE.Vector3(b.x, 0.12, z));
  }
  g.userData = { kaca, mKaca, mDinding: [dindingX.material, dindingZ.material], kursiMhs };
  return g;
}

// ---------------------------------------------------------------- ubin kalender
export function teksturUbin(tgl, bulan, tahun) {
  const { c, g, tx } = kanvasTeks(460, 560);
  g.fillStyle = "hsl(42, 30%, 93%)";
  kotakBulat(g, 0, 0, 460, 560, 36); g.fill();
  g.fillStyle = "hsl(153, 45%, 18%)";
  g.save(); kotakBulat(g, 0, 0, 460, 560, 36); g.clip(); g.fillRect(0, 0, 460, 132); g.restore();
  g.fillStyle = "hsl(42, 33%, 96%)";
  g.font = `700 54px ${FONT.sans}`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(bulan, 230, 72);
  g.fillStyle = "hsl(153, 50%, 9%)";
  g.font = `700 230px ${FONT.serif}`;
  g.fillText(tgl, 230, 300);
  g.fillStyle = "hsl(153, 30%, 22%)";
  g.font = `700 74px ${FONT.mono}`;
  g.fillText(tahun, 230, 480);
  // Dua cincin pengikat.
  g.fillStyle = "hsl(153, 50%, 8%)";
  for (const x of [130, 330]) { g.beginPath(); g.arc(x, 26, 13, 0, Math.PI * 2); g.fill(); }
  tx.needsUpdate = true;
  return tx;
}
export function buatUbin(depan, belakang) {
  const g = new THREE.Group();
  const W_ = 0.92, H_ = 1.12;
  const mBingkai = bahan(warna("hsl(153, 30%, 14%)"), { roughness: 0.4, metalness: 0.2 });
  const bingkai = balok(W_ + 0.08, H_ + 0.08, 0.07, 0.03, mBingkai);
  const muka = new THREE.Mesh(new THREE.PlaneGeometry(W_, H_), new THREE.MeshBasicMaterial({ map: depan, color: new THREE.Color(0.74, 0.74, 0.74) }));
  muka.position.z = 0.037;
  const punggung = new THREE.Mesh(new THREE.PlaneGeometry(W_, H_), new THREE.MeshBasicMaterial({ map: belakang, color: new THREE.Color(0.74, 0.74, 0.74) }));
  punggung.position.z = -0.037;
  punggung.rotation.y = Math.PI;
  const papan = new THREE.Group();
  papan.add(bingkai, muka, punggung);
  papan.position.y = 0.92;
  const kaki = balok(0.5, 0.06, 0.34, 0.02, mBingkai); kaki.position.y = 0.03;
  const tiang = balok(0.06, 0.34, 0.06, 0.01, mBingkai); tiang.position.y = 0.2;
  const pijar = sprite(W.emas, 2.4);
  pijar.position.set(0, 0.92, -0.45);
  g.add(papan, kaki, tiang, pijar);
  g.userData = { papan, mBingkai, muka: muka.material, punggung: punggung.material, pijar };
  return g;
}

// ---------------------------------------------------------------- rumah komisariat (pintu di +z lokal)
export function buatRumah(lebar = 0.9, tinggi = 0.7) {
  const g = new THREE.Group();
  const w = lebar, d = lebar * 0.95;
  const mDinding = bahan(warna("hsl(150, 18%, 30%)"), { roughness: 0.8 });
  const mAtap = bahan(warna("hsl(153, 34%, 15%)"), { roughness: 0.6 });
  const mPintu = bahan(warna("hsl(26, 30%, 22%)"), { roughness: 0.6 });
  const mJendela = new THREE.MeshStandardMaterial({ color: W.zamrud.clone(), emissive: W.zamrudPijar.clone(), emissiveIntensity: 0.9, roughness: 0.4 });
  const badan = balokAlas(w, tinggi, d, 0.02, mDinding);
  // Atap pelana: segitiga diekstrusi, bubungan sejajar sumbu z sehingga muka depan berbentuk segi lima.
  const t = new THREE.Shape();
  const o = 0.09;
  t.moveTo(-w / 2 - o, 0); t.lineTo(w / 2 + o, 0); t.lineTo(0, w * 0.48); t.closePath();
  const atap = bayang(new THREE.Mesh(new THREE.ExtrudeGeometry(t, { depth: d + 0.14, bevelEnabled: false }).translate(0, tinggi - 0.01, -(d + 0.14) / 2), mAtap));
  const tutup = new THREE.Shape(); // dinding segitiga di bawah atap
  tutup.moveTo(-w / 2, 0); tutup.lineTo(w / 2, 0); tutup.lineTo(0, w * 0.4); tutup.closePath();
  const gevel = bayang(new THREE.Mesh(new THREE.ExtrudeGeometry(tutup, { depth: d - 0.02, bevelEnabled: false }).translate(0, tinggi - 0.01, -(d - 0.02) / 2), mDinding));
  const pintu = balok(0.22, 0.4, 0.04, 0.01, mPintu); pintu.position.set(0, 0.2, d / 2 + 0.01);
  const jendelaGevel = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20), mJendela); jendelaGevel.position.set(0, tinggi + w * 0.17, d / 2 + 0.004);
  const jendela = [];
  for (const s of [-1, 1]) { // jendela samping (+x dan −x)
    const j = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), mJendela);
    j.rotation.y = s * Math.PI / 2;
    j.position.set(s * (w / 2 + 0.004), tinggi * 0.55, 0);
    jendela.push(j);
  }
  const jDepan = [-1, 1].map((s) => { const j = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.16), mJendela); j.position.set(s * w * 0.3, tinggi * 0.58, d / 2 + 0.004); return j; });
  // Tiang bendera kecil di bubungan.
  const tiang = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 6), mPintu); tiang.position.set(0, tinggi + w * 0.48 + 0.16, d / 2 - 0.05);
  const bendera = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.1), new THREE.MeshStandardMaterial({ color: W.zamrud.clone(), side: THREE.DoubleSide, emissive: W.zamrudRedup.clone(), emissiveIntensity: 0.5 }));
  bendera.position.set(0.09, tinggi + w * 0.48 + 0.29, d / 2 - 0.05);
  const isi = new THREE.Group();
  isi.add(badan, atap, gevel, pintu, jendelaGevel, ...jendela, ...jDepan, tiang, bendera);
  g.add(isi);
  g.userData = { isi, mDinding, mAtap, mJendela, mBendera: bendera.material, asal: { dinding: mDinding.color.clone(), atap: mAtap.color.clone() } };
  return g;
}
const ABU_DINDING = warna("hsl(150, 4%, 33%)"), ABU_ATAP = warna("hsl(150, 3%, 22%)");
export function kusamkanRumah(r, k, nyala = 1) {
  const d = r.userData;
  d.mDinding.color.copy(d.asal.dinding).lerp(ABU_DINDING, k);
  d.mAtap.color.copy(d.asal.atap).lerp(ABU_ATAP, k);
  d.mJendela.color.copy(W.zamrud).lerp(W.abuGelap, k);
  d.mJendela.emissiveIntensity = 0.9 * (1 - k) * nyala;
  d.mBendera.color.copy(W.zamrud).lerp(W.abu, k);
  d.mBendera.emissiveIntensity = 0.5 * (1 - k);
}
