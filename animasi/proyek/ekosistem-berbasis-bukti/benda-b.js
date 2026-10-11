// Benda bagian B: dokumen (lembar, sertifikat, SK, stempel, amplop), label emas, bangunan berjenjang,
// tiga stasiun ekosistem, kubah perisai.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { W, C, FONT, warna, bahan, balok, bayang, teksturKanvas, persegiBulat, acak } from "./alat.js";
import { pion } from "./benda-a.js";

// ---------------------------------------------------------------- dokumen kertas: badan tipis + muka bertekstur
function kertas(w, h, tx, { tebal = 0.024, warnaBadan = "hsl(42, 22%, 70%)", pijar = 0.04 } = {}) {
  const g = new THREE.Group();
  const badan = bayang(balok(w, h, tebal, 0.008, bahan(warna(warnaBadan), { roughness: 0.75 })), true, false);
  g.add(badan);
  const mat = new THREE.MeshStandardMaterial({ map: tx, color: new THREE.Color(0.74, 0.74, 0.72), roughness: 0.9, emissive: new THREE.Color(1, 1, 1), emissiveMap: tx, emissiveIntensity: pijar });
  const muka = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.012, h - 0.012), mat);
  muka.position.z = tebal / 2 + 0.0008;
  g.add(muka);
  return { grup: g, mat, tebal };
}
function bar(g, x, y, w, h, warnaCss) { g.fillStyle = warnaCss; persegiBulat(g, x, y, w, h, h / 2); g.fill(); }

// Lembar dokumen umum (adegan 4).
const TX_LEMBAR = teksturKanvas(768, 1024, (g, w, h) => {
  g.fillStyle = C.kertas; g.fillRect(0, 0, w, h);
  g.fillStyle = "hsl(153, 40%, 26%)"; persegiBulat(g, 60, 64, 86, 86, 14); g.fill();
  bar(g, 176, 74, 380, 30, "hsl(153, 30%, 22%)");
  bar(g, 176, 120, 240, 20, C.tintaRedup);
  g.fillStyle = "hsl(153, 20%, 40%)"; g.fillRect(60, 192, w - 120, 4);
  const lebar = [0.92, 0.86, 0.95, 0.7, 0, 0.9, 0.82, 0.94, 0.6, 0, 0.88, 0.78];
  lebar.forEach((p, i) => { if (p) bar(g, 60, 240 + i * 46, (w - 120) * p, 18, "hsl(153, 8%, 64%)"); });
  g.strokeStyle = "hsl(153, 15%, 55%)"; g.lineWidth = 3;
  for (let i = 0; i <= 3; i++) { g.beginPath(); g.moveTo(60, 820 + i * 44); g.lineTo(w - 60, 820 + i * 44); g.stroke(); }
  for (const x of [60, 300, w - 60]) { g.beginPath(); g.moveTo(x, 820); g.lineTo(x, 952); g.stroke(); }
});
export function lembarDokumen() { return kertas(1.3, 1.73, TX_LEMBAR); }

// Sertifikat dengan pita segel.
const TX_SERTIFIKAT = teksturKanvas(1024, 720, (g, w, h) => {
  g.fillStyle = "hsl(42, 34%, 91%)"; g.fillRect(0, 0, w, h);
  g.strokeStyle = C.zamrud; g.lineWidth = 14; g.strokeRect(26, 26, w - 52, h - 52);
  g.lineWidth = 3; g.strokeRect(50, 50, w - 100, h - 100);
  g.fillStyle = C.tinta; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `700 100px ${FONT.serif}`; g.fillText("SERTIFIKAT", w / 2, 176);
  g.fillStyle = "hsl(153, 30%, 30%)"; g.font = `600 38px ${FONT.mono}`; g.fillText("LATIHAN KADER I", w / 2, 262);
  bar(g, w / 2 - 260, 352, 520, 26, "hsl(153, 12%, 58%)");
  bar(g, w / 2 - 190, 404, 380, 18, "hsl(153, 8%, 70%)");
  g.fillStyle = "hsl(153, 20%, 45%)"; g.fillRect(130, 586, 230, 4); g.fillRect(w - 360, 586, 230, 4);
  g.strokeStyle = "hsl(153, 30%, 28%)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(150, 566); g.bezierCurveTo(190, 520, 220, 600, 260, 550); g.bezierCurveTo(290, 520, 300, 580, 340, 556); g.stroke();
});
function geoRoset(r, n = 18, dalam = 0.82) {
  const s = new THREE.Shape();
  for (let i = 0; i <= n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * dalam : r;
    if (i === 0) s.moveTo(rr * Math.cos(a), rr * Math.sin(a)); else s.lineTo(rr * Math.cos(a), rr * Math.sin(a));
  }
  return new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 4 });
}
function geoEkorPita(w, h) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, -h); s.lineTo(0, -h + w * 0.55); s.lineTo(-w / 2, -h); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
}
export function sertifikat() {
  const k = kertas(1.7, 1.2, TX_SERTIFIKAT);
  const segel = new THREE.Group();
  const matPita = bahan(warna("hsl(153, 50%, 30%)"), { roughness: 0.5, emissive: W.zamrudRedup.clone(), emissiveIntensity: 0.3 });
  const matRoset = bahan(warna("hsl(153, 45%, 40%)"), { roughness: 0.4, metalness: 0.2, emissive: W.zamrudRedup.clone(), emissiveIntensity: 0.35 });
  const ekor1 = new THREE.Mesh(geoEkorPita(0.12, 0.34), matPita); ekor1.rotation.z = 0.32; ekor1.position.set(-0.04, -0.02, 0.0);
  const ekor2 = new THREE.Mesh(geoEkorPita(0.12, 0.34), matPita); ekor2.rotation.z = -0.32; ekor2.position.set(0.04, -0.02, 0.0);
  const roset = new THREE.Mesh(geoRoset(0.19), matRoset); roset.position.z = 0.014;
  const inti = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 32).rotateX(Math.PI / 2), bahan(warna("hsl(153, 40%, 52%)"), { roughness: 0.35, metalness: 0.3 }));
  inti.position.z = 0.06;
  segel.add(ekor1, ekor2, roset, inti);
  bayang(segel, true, false);
  segel.position.set(0.52, -0.3, k.tebal / 2 + 0.004);
  k.grup.add(segel);
  return { ...k, segel };
}

// SK dengan cap stempel.
const TX_SK = teksturKanvas(720, 1000, (g, w, h) => {
  g.fillStyle = C.kertas; g.fillRect(0, 0, w, h);
  g.fillStyle = C.tinta; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `700 62px ${FONT.serif}`; g.fillText("SURAT", w / 2, 92); g.fillText("KEPUTUSAN", w / 2, 160);
  g.fillStyle = "hsl(153, 20%, 40%)"; g.fillRect(70, 212, w - 140, 4);
  bar(g, w / 2 - 170, 238, 340, 18, "hsl(153, 10%, 58%)");
  [0.9, 0.82, 0.88, 0.64].forEach((p, i) => bar(g, 70, 300 + i * 40, (w - 140) * p, 15, "hsl(153, 8%, 66%)"));
  g.fillStyle = "hsl(153, 30%, 28%)"; g.font = `700 30px ${FONT.mono}`; g.fillText("MEMUTUSKAN", w / 2, 500);
  [0.86, 0.92, 0.7, 0.8].forEach((p, i) => bar(g, 70, 548 + i * 40, (w - 140) * p, 15, "hsl(153, 8%, 66%)"));
  g.fillStyle = "hsl(153, 20%, 45%)"; g.fillRect(w - 300, 920, 230, 4);
  g.strokeStyle = "hsl(153, 30%, 28%)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(w - 280, 900); g.bezierCurveTo(w - 240, 850, w - 210, 930, w - 180, 878); g.bezierCurveTo(w - 150, 840, w - 130, 905, w - 92, 884); g.stroke();
});
const TX_CAP = teksturKanvas(256, 256, (g, w, h) => {
  const r = acak(77);
  g.strokeStyle = "hsl(153, 62%, 32%)"; g.fillStyle = "hsl(153, 62%, 32%)";
  g.lineWidth = 12; g.beginPath(); g.arc(w / 2, h / 2, 112, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 5; g.beginPath(); g.arc(w / 2, h / 2, 84, 0, Math.PI * 2); g.stroke();
  g.font = `700 64px ${FONT.mono}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("HMI", w / 2, h / 2 + 2);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; g.beginPath(); g.arc(w / 2 + 98 * Math.cos(a), h / 2 + 98 * Math.sin(a), 4, 0, Math.PI * 2); g.fill(); }
  g.globalCompositeOperation = "destination-out"; // tinta tidak rata
  for (let i = 0; i < 260; i++) { g.globalAlpha = 0.25 + 0.5 * r(); g.beginPath(); g.arc(r() * w, r() * h, 1 + r() * 4, 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
});
export function suratKeputusan() {
  const k = kertas(1.16, 1.6, TX_SK);
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), new THREE.MeshBasicMaterial({ map: TX_CAP, transparent: true, opacity: 0, depthWrite: false }));
  cap.position.set(0.24, -0.5, k.tebal / 2 + 0.003);
  cap.rotation.z = -0.18;
  k.grup.add(cap);
  return { ...k, cap };
}
// Stempel karet: gagang bubutan, balok kayu, bantalan karet. Sumbu +y lokal, bantalan di y = 0.
export function stempel() {
  const g = new THREE.Group();
  const prof = [];
  const t = (r, y) => prof.push(new THREE.Vector2(r, y));
  t(0, 0.13); t(0.1, 0.13); t(0.1, 0.16); t(0.06, 0.2); t(0.045, 0.32); t(0.05, 0.38);
  for (let i = 0; i <= 10; i++) { const a = (-70 + 160 * i / 10) * Math.PI / 180; t(Math.max(0.0001, 0.11 * Math.cos(a)), 0.48 + 0.11 * Math.sin(a)); }
  t(0, 0.59);
  const gagang = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), bahan(warna("hsl(28, 30%, 38%)"), { roughness: 0.5 }));
  const blok = balok(0.36, 0.1, 0.36, 0.02, bahan(warna("hsl(28, 25%, 30%)"), { roughness: 0.6 }));
  blok.position.y = 0.08;
  const karet = balok(0.33, 0.035, 0.33, 0.006, bahan(warna("hsl(153, 40%, 16%)"), { roughness: 0.9 }));
  karet.position.y = 0.0175;
  g.add(bayang(gagang), blok, karet);
  return g;
}

// Surat berupa amplop.
const TX_AMPLOP = teksturKanvas(1024, 640, (g, w, h) => {
  g.fillStyle = "hsl(42, 30%, 92%)"; g.fillRect(0, 0, w, h);
  g.fillStyle = "hsl(42, 18%, 84%)";
  g.beginPath(); g.moveTo(0, 0); g.lineTo(w / 2, h * 0.56); g.lineTo(w, 0); g.closePath(); g.fill();
  g.fillStyle = "hsl(42, 14%, 80%)";
  g.beginPath(); g.moveTo(0, h); g.lineTo(w * 0.44, h * 0.5); g.lineTo(w * 0.56, h * 0.5); g.lineTo(w, h); g.closePath(); g.fill();
  g.strokeStyle = "hsl(42, 12%, 66%)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(4, 4); g.lineTo(w / 2, h * 0.56); g.lineTo(w - 4, 4); g.stroke();
  g.beginPath(); g.moveTo(4, h - 4); g.lineTo(w * 0.44, h * 0.5); g.moveTo(w - 4, h - 4); g.lineTo(w * 0.56, h * 0.5); g.stroke();
  // perangko
  g.fillStyle = "hsl(42, 30%, 96%)"; g.fillRect(w - 190, 40, 140, 160);
  g.fillStyle = C.zamrud; g.fillRect(w - 176, 54, 112, 132);
  g.fillStyle = "hsl(42, 30%, 92%)";
  for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(w - 190 + 9 + i * 17.5, 40, 6, 0, Math.PI * 2); g.arc(w - 190 + 9 + i * 17.5, 200, 6, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = "hsl(42, 30%, 92%)"; g.lineWidth = 5; g.beginPath(); g.arc(w - 120, 120, 34, 0, Math.PI * 2); g.stroke();
  // alamat
  bar(g, w * 0.36, h * 0.66, w * 0.4, 20, "hsl(153, 12%, 52%)");
  bar(g, w * 0.36, h * 0.66 + 42, w * 0.32, 16, "hsl(153, 8%, 64%)");
  bar(g, w * 0.36, h * 0.66 + 78, w * 0.26, 16, "hsl(153, 8%, 64%)");
});
export function amplop() {
  const k = kertas(1.5, 0.94, TX_AMPLOP, { tebal: 0.05, warnaBadan: "hsl(42, 22%, 84%)" });
  return k;
}

// ---------------------------------------------------------------- label emas identitas (menempel di sudut dokumen)
function teksturKode(kode) {
  return teksturKanvas(512, 200, (g, w, h) => {
    g.fillStyle = "hsl(153, 50%, 9%)";
    const r = acak(kode.length * 31 + kode.charCodeAt(1));
    let x = 16;
    while (x < 200) { const lb = 4 + Math.floor(r() * 3) * 4; g.fillRect(x, 34, lb, 132); x += lb + 6 + Math.floor(r() * 2) * 4; }
    g.font = `700 92px ${FONT.mono}`; g.textAlign = "left"; g.textBaseline = "middle";
    g.fillText(kode, 222, h / 2 + 6);
  });
}
export function labelEmas(kode) {
  const g = new THREE.Group();
  const w = 0.62, h = 0.28, ch = 0.09;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + ch, h / 2); s.lineTo(w / 2, h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(-w / 2 + ch, -h / 2); s.lineTo(-w / 2, -h / 2 + ch); s.lineTo(-w / 2, h / 2 - ch); s.closePath();
  const lubang = new THREE.Path(); lubang.absarc(-w / 2 + 0.075, 0, 0.032, 0, Math.PI * 2, true); s.holes.push(lubang);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 });
  const mat = bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0.35, roughness: 0.32, metalness: 0.45 });
  g.add(bayang(new THREE.Mesh(geo, mat), true, false));
  const kodeM = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.18), new THREE.MeshBasicMaterial({ map: teksturKode(kode), transparent: true, depthWrite: false }));
  kodeM.position.set(0.06, 0, 0.031);
  g.add(kodeM);
  return { grup: g, mat };
}

// ---------------------------------------------------------------- bangunan berjenjang
function teksturJendela(kolom, baris, { pintu = false, lebarJ = 0.5, tinggiJ = 0.55, dinding = "hsl(153, 24%, 18%)", untukPijar = false } = {}) {
  return teksturKanvas(256, 256, (g, w, h) => {
    g.fillStyle = untukPijar ? "#000" : dinding; g.fillRect(0, 0, w, h);
    const sw = w / kolom, sh = (pintu ? h * 0.78 : h * 0.94) / baris;
    for (let i = 0; i < kolom; i++) for (let j = 0; j < baris; j++) {
      const jw = sw * lebarJ, jh = sh * tinggiJ;
      const x = i * sw + (sw - jw) / 2, y = h * 0.04 + j * sh + (sh - jh) / 2;
      g.fillStyle = untukPijar ? "#fff" : "hsl(153, 40%, 30%)";
      g.fillRect(x, y, jw, jh);
    }
    if (pintu) {
      g.fillStyle = untukPijar ? "#777" : "hsl(153, 30%, 12%)";
      g.fillRect(w / 2 - w * 0.12, h * 0.8, w * 0.24, h * 0.2);
    }
  });
}
function bahanDinding(kolom, baris, opsi = {}) {
  return new THREE.MeshStandardMaterial({
    map: teksturJendela(kolom, baris, opsi), emissiveMap: teksturJendela(kolom, baris, { ...opsi, untukPijar: true }),
    emissive: W.zamrudPijar.clone(), emissiveIntensity: 0.4, roughness: 0.7,
  });
}
const matAtap = () => bahan(warna("hsl(153, 30%, 12%)"), { roughness: 0.75 });
const matPolos = () => bahan(warna("hsl(153, 24%, 18%)"), { roughness: 0.75 });

// Rumah komisariat: badan, atap limas, jendela menyala.
export function rumah() {
  const g = new THREE.Group();
  const dinding = bahanDinding(2, 1, { lebarJ: 0.46, tinggiJ: 0.5 });
  const depan = bahanDinding(2, 1, { pintu: true, lebarJ: 0.4, tinggiJ: 0.42 });
  const polos = matPolos();
  const badan = bayang(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.82, 1.0).translate(0, 0.41, 0), [dinding, dinding, polos, polos, depan, dinding]));
  const atap = bayang(new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.5, 4, 1).rotateY(Math.PI / 4).translate(0, 0.82 + 0.25, 0), matAtap()));
  g.add(badan, atap);
  return { grup: g, bahan: [dinding, depan], tinggi: 1.32 };
}
function lantaiBangunan(w, h, d, kolomW, kolomD, baris, opsi = {}) {
  const sisiW = bahanDinding(kolomW, baris, opsi), sisiD = bahanDinding(kolomD, baris, opsi);
  const depan = opsi.pintuDepan ? bahanDinding(kolomW, baris, { ...opsi, pintu: true }) : sisiW;
  const polos = matPolos();
  const m = bayang(new THREE.Mesh(new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0), [sisiD, sisiD, polos, polos, depan, sisiW]));
  return { m, bahan: [...new Set([sisiW, sisiD, depan])] };
}
function tepiAtap(w, d, y) {
  const g = new THREE.Group();
  const mat = matAtap();
  for (const [bw, bd, x, z] of [[w + 0.08, 0.08, 0, d / 2], [w + 0.08, 0.08, 0, -d / 2], [0.08, d, w / 2, 0], [0.08, d, -w / 2, 0]]) {
    const b = balok(bw, 0.14, bd, 0, mat); b.position.set(x, y + 0.07, z); g.add(b);
  }
  const tutup = balok(w, 0.04, d, 0, mat); tutup.position.y = y + 0.02; g.add(tutup);
  return g;
}
// Gedung cabang: tiga lantai, atap datar berpagar, kanopi pintu.
export function gedungCabang() {
  const g = new THREE.Group();
  const l = lantaiBangunan(2.3, 1.75, 1.6, 6, 4, 3, { pintuDepan: true, lebarJ: 0.5, tinggiJ: 0.5 });
  g.add(l.m, tepiAtap(2.3, 1.6, 1.75));
  const kanopi = balok(0.9, 0.06, 0.4, 0.01, matAtap()); kanopi.position.set(0, 0.62, 0.8 + 0.2); g.add(kanopi);
  const unit = balok(0.6, 0.3, 0.5, 0.02, matPolos()); unit.position.set(-0.5, 1.75 + 0.15 + 0.04, -0.2); g.add(unit);
  return { grup: g, bahan: l.bahan, tinggi: 2.1 };
}
// Menara Badko: badan tinggi, lantai mundur, atap.
export function menaraBadko() {
  const g = new THREE.Group();
  const a = lantaiBangunan(1.65, 3.4, 1.65, 3, 3, 8, { pintuDepan: true, lebarJ: 0.46, tinggiJ: 0.5 });
  const b = lantaiBangunan(1.25, 0.9, 1.25, 2, 2, 2, { lebarJ: 0.46, tinggiJ: 0.5 });
  b.m.position.y = 3.4;
  g.add(a.m, b.m, tepiAtap(1.65, 1.65, 3.4), tepiAtap(1.25, 1.25, 4.3));
  return { grup: g, bahan: [...a.bahan, ...b.bahan], tinggi: 4.5 };
}
// Menara PB: badan paling tinggi, dua lantai mundur, mahkota yang bisa menyala emas, menara runcing.
export function menaraPB() {
  const g = new THREE.Group();
  const a = lantaiBangunan(2.05, 4.3, 2.05, 4, 4, 10, { pintuDepan: true, lebarJ: 0.46, tinggiJ: 0.5 });
  const b = lantaiBangunan(1.6, 1.1, 1.6, 3, 3, 2, { lebarJ: 0.46, tinggiJ: 0.5 });
  b.m.position.y = 4.3;
  g.add(a.m, b.m, tepiAtap(2.05, 2.05, 4.3), tepiAtap(1.6, 1.6, 5.4));
  const matMahkota = bahan(warna("hsl(153, 20%, 24%)"), { emissive: W.emasPijar.clone(), emissiveIntensity: 0, roughness: 0.35, metalness: 0.3 });
  const mahkota = balok(1.0, 0.75, 1.0, 0.04, matMahkota); mahkota.position.y = 5.54 + 0.375; g.add(mahkota);
  const runcing = bayang(new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.95, 16).translate(0, 6.29 + 0.475, 0), matMahkota)); g.add(runcing);
  return { grup: g, bahan: [...a.bahan, ...b.bahan], matMahkota, tinggi: 7.2, yMahkota: 5.92 };
}

// ---------------------------------------------------------------- tiga stasiun ekosistem
function alasStasiun() {
  const m = bayang(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.26, 0.1, 56), bahan(warna("hsl(153, 30%, 13%)"), { roughness: 0.6, emissive: W.zamrudPijar.clone(), emissiveIntensity: 0 })));
  m.position.y = 0.05;
  return m;
}
// Tangga (kaderisasi): anak tangga naik ke belakang, pegangan di satu sisi, pion kecil yang mendaki.
export function stasiunTangga() {
  const g = new THREE.Group();
  const alas = alasStasiun(); g.add(alas);
  const n = 6, tinggiA = 0.2, dalamA = 0.3, lebarA = 1.1;
  const matAnak = bahan(warna("hsl(153, 18%, 46%)"), { roughness: 0.5, emissive: W.zamrudPijar.clone(), emissiveIntensity: 0 });
  const geos = [];
  for (let i = 0; i < n; i++) {
    const h = tinggiA * (i + 1);
    geos.push(new THREE.BoxGeometry(lebarA, h, dalamA).translate(0, 0.1 + h / 2, 0.75 - dalamA / 2 - i * dalamA));
  }
  const anak = bayang(new THREE.Mesh(mergeGeometries(geos), matAnak));
  g.add(anak);
  const matPeg = bahan(warna("hsl(42, 10%, 78%)"), { roughness: 0.3, metalness: 0.7 });
  const titikPeg = [];
  for (let i = 0; i <= n; i += 2) {
    const z = 0.75 - dalamA * 0.5 - i * dalamA * ((n - 1) / n), y = 0.1 + tinggiA * (Math.min(i, n - 1) + 1);
    const tiang = balok(0.04, 0.55, 0.04, 0, matPeg); tiang.position.set(lebarA / 2 - 0.05, y + 0.27, z); g.add(tiang);
    titikPeg.push(new THREE.Vector3(lebarA / 2 - 0.05, y + 0.55, z));
  }
  for (let i = 0; i < titikPeg.length - 1; i++) {
    const a = titikPeg[i], b = titikPeg[i + 1];
    const p = balok(0.05, 0.05, a.distanceTo(b) + 0.04, 0, matPeg);
    p.position.copy(a).add(b).multiplyScalar(0.5);
    p.lookAt(b.x, b.y, b.z);
    g.add(p);
  }
  const pendaki = pion(W.pion); pendaki.scale.setScalar(0.5); g.add(pendaki);
  const jalur = (u) => { // u 0..1: posisi pendaki dari kaki tangga ke puncak
    const k = Math.min(n - 1, u * n);
    const i = Math.floor(k), f = k - i;
    const hop = Math.sin(Math.PI * f) * 0.08;
    const yA = 0.1 + tinggiA * (i + 1), yB = 0.1 + tinggiA * (Math.min(i + 1, n - 1) + 1);
    return new THREE.Vector3(-0.15, (f < 0.5 ? yA : yB) + hop, 0.75 - dalamA * 0.5 - k * dalamA);
  };
  return { grup: g, alas, matAktif: [matAnak], pendaki, jalur };
}
// Rak arsip (tata kelola): rangka, papan rak, kotak arsip berlabel emas kecil.
export function stasiunRak() {
  const g = new THREE.Group();
  const alas = alasStasiun(); g.add(alas);
  const matRangka = bahan(warna("hsl(153, 16%, 40%)"), { roughness: 0.45, metalness: 0.3, emissive: W.zamrudPijar.clone(), emissiveIntensity: 0 });
  const W_ = 1.5, D_ = 0.55, H_ = 1.9;
  for (const x of [-W_ / 2, W_ / 2]) for (const z of [-D_ / 2, D_ / 2]) { const t = balok(0.05, H_, 0.05, 0, matRangka); t.position.set(x, 0.1 + H_ / 2, z); g.add(t); }
  const papanY = [0.14, 0.72, 1.3, 1.88];
  for (const y of papanY) { const p = balok(W_ + 0.06, 0.04, D_ + 0.04, 0.008, matRangka); p.position.set(0, y + 0.02, 0); g.add(p); }
  const warnaKotak = [warna("hsl(42, 22%, 78%)"), warna("hsl(153, 26%, 34%)"), warna("hsl(42, 16%, 66%)")];
  const matLabel = bahan(W.emas, { emissive: W.emasPijar.clone(), emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.3 });
  for (let l = 0; l < 3; l++) for (let i = 0; i < 4; i++) {
    const k = balok(0.3, 0.36, 0.44, 0.015, bahan(warnaKotak[(i + l) % 3], { roughness: 0.7 }));
    k.position.set(-0.53 + i * 0.355, papanY[l] + 0.04 + 0.18, 0);
    g.add(k);
    const lb = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.008), matLabel);
    lb.position.set(k.position.x, k.position.y + 0.05, 0.224);
    g.add(lb);
  }
  return { grup: g, alas, matAktif: [matRangka], matLabel };
}
// Meja musyawarah (kebijakan): meja bundar, figur di sekeliling, satu lembar di tengah.
export function stasiunMeja() {
  const g = new THREE.Group();
  const alas = alasStasiun(); g.add(alas);
  const matMeja = bahan(warna("hsl(28, 22%, 40%)"), { roughness: 0.5, emissive: W.zamrudPijar.clone(), emissiveIntensity: 0 });
  const daun = bayang(new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.07, 48), matMeja)); daun.position.y = 0.1 + 0.62; g.add(daun);
  const kaki = bayang(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.58, 16), matMeja)); kaki.position.y = 0.1 + 0.29; g.add(kaki);
  const tapak = bayang(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.04, 32), matMeja)); tapak.position.y = 0.12; g.add(tapak);
  const lembar = balok(0.42, 0.012, 0.56, 0.004, bahan(W.kertas, { roughness: 0.8, emissive: warna("hsl(42, 30%, 50%)"), emissiveIntensity: 0.15 }));
  lembar.position.set(0, 0.1 + 0.66, 0); lembar.rotation.y = 0.4; g.add(lembar);
  const peserta = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    const p = pion(W.pion); p.scale.setScalar(0.62); p.position.set(Math.cos(a) * 0.98, 0.1, Math.sin(a) * 0.98); g.add(p); peserta.push(p);
  }
  return { grup: g, alas, matAktif: [matMeja], peserta };
}

// ---------------------------------------------------------------- kubah perisai tipis
export function kubahPerisai(r = 0.82) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uWarna: { value: W.zamrudPijar.clone() }, uKuat: { value: 0 }, uNaik: { value: 0 }, uT: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
    vertexShader: `varying vec3 vN; varying vec3 vL; varying vec3 vV;
      void main(){ vL = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uWarna; uniform float uKuat; uniform float uNaik; uniform float uT; varying vec3 vN; varying vec3 vL; varying vec3 vV;
      void main(){
        float h = vL.y / ${r.toFixed(3)};
        if (h > uNaik) discard;
        float fres = pow(1.0 - abs(dot(normalize(vN), vec3(0.0, 0.0, 1.0))), 2.2);
        float az = atan(vL.z, vL.x) * 7.0 / 3.14159;
        float garisA = smoothstep(0.0, 0.05, abs(fract(az) - 0.5) - 0.44);
        float garisB = smoothstep(0.0, 0.05, abs(fract(h * 4.0) - 0.5) - 0.44);
        float tepi = 1.0 - smoothstep(0.0, 0.08, uNaik - h);
        float fres3 = pow(1.0 - abs(dot(normalize(vN), vec3(0.0, 0.0, 1.0))), 3.2);
        float a = (0.02 + 0.55 * fres3 + 0.18 * max(garisA, garisB)) * uKuat + tepi * 0.8 * uKuat * step(uNaik, 0.999);
        gl_FragColor = vec4(uWarna, a);
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  return { m, mat };
}
