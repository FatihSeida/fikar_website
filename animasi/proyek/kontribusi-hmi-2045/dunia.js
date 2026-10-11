// Dunia bagian 1: tanah grid yang bisa menjadi air, Yogyakarta 1947/1948, perahu, karang, menara cip.
import * as THREE from "three";
import {
  W, scene, klem, campur, rentang, halus, keluar3, lenting, warna, dunia, yawDari, bahanGaris, garisSambung, sprite, buatLabel, taruh,
} from "./dasar.js";
import { buatRuangKuliah, buatGedungSidang, buatPerahu, buatKarang, buatMenaraCip, atasLambung, lebarLambung, xLambung } from "./benda.js";
import {
  T_KULIAH, T_KULIAH_NYALA, T_SIDANG, T_SIDANG_NYALA, T_GARIS, T_TENGGELAM, T_AIR, T_KARANG, LAMA_KARANG, T_RETAK, T_DERIT, T_BELAH,
  T_EMAS_PERAHU, T_LEWAT_GAPURA, KARANG_POS, menara, lintasPerahu, fasaDayung, arahDayung, kuatDayung, bilahDiAir, DORONG, N_DAYUNG, PSI0,
} from "./isyarat.js";

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();

// ---------------------------------------------------------------- tanah: grid hijau gelap ↔ permukaan air
const N_BUSA = 24, N_RIAK = 16;
export const bahanTanah = new THREE.ShaderMaterial({
  uniforms: {
    uLatar: { value: W.latar }, uGaris: { value: W.grid }, uMayor: { value: W.gridMayor },
    uFokus: { value: new THREE.Vector3() }, uJari: { value: 20 }, uT: { value: 0 },
    uAirC: { value: new THREE.Vector2() }, uAirR: { value: 0 },
    uAir: { value: warna("hsl(158, 46%, 9%)") }, uAirTerang: { value: warna("hsl(152, 40%, 30%)") },
    uBusaW: { value: warna("hsl(150, 30%, 62%)") }, uJejakW: { value: W.zamrudPijar.clone() },
    uPerahu: { value: new THREE.Vector4(0, 0, 0, 0) }, uKilau: { value: 1 },
    uBusa: { value: Array.from({ length: N_BUSA }, () => new THREE.Vector4()) },
    uRiak: { value: Array.from({ length: N_RIAK }, () => new THREE.Vector4()) },
  },
  vertexShader: `
    varying vec3 vW;
    void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `
    uniform vec3 uLatar; uniform vec3 uGaris; uniform vec3 uMayor; uniform vec3 uFokus; uniform float uJari; uniform float uT;
    uniform vec2 uAirC; uniform float uAirR; uniform vec3 uAir; uniform vec3 uAirTerang; uniform vec3 uBusaW; uniform vec3 uJejakW;
    uniform vec4 uPerahu; uniform float uKilau; uniform vec4 uBusa[${N_BUSA}]; uniform vec4 uRiak[${N_RIAK}];
    varying vec3 vW;
    float garis(vec2 p, float tebal) {
      vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
      return 1.0 - min(min(g.x, g.y) / tebal, 1.0);
    }
    float tinggi(vec2 p) {
      return 0.50 * sin(dot(p, vec2(0.95, 0.55)) + uT * 1.35)
           + 0.34 * sin(dot(p, vec2(-0.62, 1.2)) + uT * 1.7 + 1.3)
           + 0.22 * sin(dot(p, vec2(1.9, -1.4)) + uT * 2.3 + 0.4)
           + 0.14 * sin(dot(p, vec2(-2.6, -2.1)) + uT * 2.9 + 2.0);
    }
    void main() {
      vec2 p = vW.xz;
      float d = length(p - uFokus.xz);
      float pudar = 1.0 - smoothstep(uJari * 0.3, uJari, d);
      vec2 pg = p + vec2(0.35);
      vec3 cGrid = mix(uLatar, uGaris, garis(pg, 1.1) * pudar);
      cGrid = mix(cGrid, uMayor, garis(pg / 5.0, 1.5) * pudar);

      float jAir = length(p - uAirC);
      float air = 1.0 - smoothstep(uAirR - 1.6, uAirR, jAir);
      vec3 c = cGrid;
      if (air > 0.001) {
        float h = tinggi(p);
        vec2 grad = vec2(tinggi(p + vec2(0.04, 0.0)) - h, tinggi(p + vec2(0.0, 0.04)) - h) / 0.04;
        vec2 pr = pg + grad * 0.07;
        vec3 cAir = mix(uLatar, uAir, pudar * 0.9 + 0.1);
        cAir = mix(cAir, uGaris * 1.05, garis(pr, 1.0) * 0.55 * pudar);
        cAir = mix(cAir, uMayor * 1.05, garis(pr / 5.0, 1.3) * 0.6 * pudar);
        // Kilau ombak: garis kontur pendek yang terputus-putus, bukan peta topografi.
        float ck = h * 1.8;
        float w = fwidth(ck);
        float kontur = 1.0 - smoothstep(w * 0.4, w * 1.5, abs(fract(ck) - 0.5));
        float hadap = smoothstep(0.1, 0.9, dot(normalize(grad + 1e-4), vec2(0.707, 0.707)));
        float petak = smoothstep(0.25, 0.75, 0.5 + 0.5 * sin(dot(p, vec2(0.83, 1.31)) * 1.7 + uT * 0.7) * sin(dot(p, vec2(-1.21, 0.57)) * 1.9 - uT * 0.55 + 1.0) + 0.25);
        cAir += uAirTerang * kontur * petak * (0.1 + 0.55 * hadap) * pudar * uKilau;
        cAir += uAirTerang * 0.06 * (h + 1.2) * pudar;
        // Busa dan riak di sekitar benda yang tegak di air.
        float busa = 0.0;
        for (int i = 0; i < ${N_BUSA}; i++) {
          vec4 b = uBusa[i];
          if (b.w <= 0.0) continue;
          float dd = length(p - b.xy) - b.z;
          if (dd < -0.4) continue;
          float riak = 0.5 + 0.5 * sin(dd * 8.0 - uT * 3.6 + float(i) * 1.7);
          busa += b.w * exp(-max(dd, 0.0) * 4.0) * (0.45 + 0.55 * riak) * (1.0 - smoothstep(-0.05, -0.4, dd));
          busa += b.w * 0.35 * exp(-pow((dd - 0.55 - 0.25 * fract(uT * 0.5 + float(i) * 0.37)) / 0.06, 2.0));
        }
        for (int i = 0; i < ${N_RIAK}; i++) {
          vec4 r = uRiak[i];
          if (r.w <= 0.0) continue;
          float dd = length(p - r.xy);
          float rad = 0.1 + r.z * 1.25;
          busa += r.w * exp(-pow((dd - rad) / (0.045 + 0.04 * r.z), 2.0)) * exp(-r.z * 2.6);
          busa += r.w * 0.6 * exp(-dd * dd / 0.02) * exp(-r.z * 7.0);
        }
        // Jejak perahu: dua lengan V di belakang buritan dan alur tengah.
        float jejak = 0.0;
        if (uPerahu.w > 0.0) {
          vec2 q = p - uPerahu.xy;
          float yaw = uPerahu.z;
          vec2 maju = vec2(cos(yaw), -sin(yaw));
          vec2 sisi = vec2(sin(yaw), cos(yaw));
          float s = -(dot(q, maju) + 2.9);
          float lat = abs(dot(q, sisi));
          if (s > -3.4) {
            float sp = max(s, 0.0);
            float lengan = exp(-pow((lat - (0.9 + 0.36 * sp)) / (0.1 + 0.05 * sp), 2.0)) * exp(-sp / 8.0) * step(0.0, s);
            float tengah = exp(-pow(lat / (0.45 + 0.08 * sp), 2.0)) * exp(-sp / 4.5) * step(0.0, s);
            float lambung = exp(-pow((lat - 0.95) / 0.12, 2.0)) * (1.0 - step(0.0, s)) * smoothstep(-3.4, -2.6, s);
            float gerigi = 0.6 + 0.4 * sin(sp * 6.0 - uT * 9.0 + lat * 4.0);
            jejak = uPerahu.w * (lengan * 0.9 + tengah * 0.45 * gerigi + lambung * 0.5);
          }
        }
        cAir += uBusaW * busa * 0.55 * pudar + uJejakW * jejak * 0.7 * pudar;
        float tepi = exp(-pow((jAir - uAirR + 0.6) / 0.45, 2.0)) * step(0.5, uAirR);
        cAir += uBusaW * tepi * 0.3 * pudar;
        c = mix(cGrid, cAir, air);
      }
      gl_FragColor = vec4(c, 1.0);
    }`,
});
export const tanah = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), bahanTanah);
tanah.rotation.x = -Math.PI / 2;
scene.add(tanah);
export const bayangan = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), new THREE.ShadowMaterial({ color: warna("hsl(153, 60%, 2%)"), opacity: 0.5 }));
bayangan.rotation.x = -Math.PI / 2;
bayangan.position.y = 0.004;
bayangan.receiveShadow = true;
scene.add(bayangan);

// Pengumpul busa dan riak tiap frame.
const busaFrame = [];
const riakFrame = [];
export function tambahBusa(x, z, r, kuat) { if (kuat > 0.01) busaFrame.push([x, z, r, kuat]); }
function tambahRiak(x, z, umur, kuat) { if (kuat > 0.01) riakFrame.push([x, z, umur, kuat]); }

// ---------------------------------------------------------------- Yogyakarta: ruang kuliah 1947 dan gedung sidang 1948
const POS_KULIAH = { a: -1.55, b: 2.25 }, POS_SIDANG = { a: 1.55, b: -2.05 };
const kuliah = buatRuangKuliah();
const sidang = buatGedungSidang();
for (const [o, p] of [[kuliah.g, POS_KULIAH], [sidang.g, POS_SIDANG]]) { o.scale.setScalar(0.78); dunia(p.a, p.b, 0, o.position); scene.add(o); }
// Garis tipis zamrud di tanah, dari serambi ruang kuliah ke tangga gedung sidang.
const A_GARIS = dunia(POS_KULIAH.a, POS_KULIAH.b, 0.03).add(new THREE.Vector3(1.2, 0, 0.35)), B_GARIS = dunia(POS_SIDANG.a, POS_SIDANG.b, 0.03).add(new THREE.Vector3(-0.85, 0, 1.2));
const titikGaris = [];
for (let k = 0; k <= 24; k++) {
  const u = k / 24;
  _v.copy(A_GARIS).lerp(B_GARIS, u);
  titikGaris.push(_v.x, 0.03 + 0.25 * Math.sin(Math.PI * u), _v.z);
}
const PANJANG_GARIS = A_GARIS.distanceTo(B_GARIS) * 1.02;
const matGaris = bahanGaris(W.zamrudPijar.clone().multiplyScalar(1.3), 3.2, 0, { dashed: true, dashSize: PANJANG_GARIS * 1.2, gapSize: PANJANG_GARIS * 1.2 });
const garisYogya = garisSambung(titikGaris, matGaris);
scene.add(garisYogya);
const percikGaris = sprite(W.zamrudPijar, 1.1, 0);
scene.add(percikGaris);
const simpulGaris = [A_GARIS, B_GARIS].map((p) => { const s = sprite(W.zamrudPijar, 0.7, 0); s.position.copy(p); scene.add(s); return s; });
const lblTahun = [buatLabel("lbl-tahun", "1947"), buatLabel("lbl-tahun", "1948")];

function perbaruiYogya(t) {
  const tampak = t < 8.5;
  kuliah.g.visible = sidang.g.visible = tampak;
  if (!tampak) { lblTahun.forEach((l) => (l.style.opacity = "0")); garisYogya.visible = false; percikGaris.visible = false; simpulGaris.forEach((s) => (s.visible = false)); return; }
  const turun = halus(rentang(t, T_TENGGELAM[0], T_TENGGELAM[1]));
  [[kuliah, T_KULIAH, T_KULIAH_NYALA], [sidang, T_SIDANG, T_SIDANG_NYALA]].forEach(([b, rt, tn]) => {
    const k = lenting(rentang(t, rt[0], rt[1]), 1.3);
    b.g.scale.set(0.78, 0.78 * Math.max(0.001, k), 0.78);
    b.g.visible = k > 0.002 && tampak;
    b.g.position.y = -4.6 * turun; // seluruh gedung (termasuk tiang panji) sudah di bawah air sebelum sapuan air lewat
    const nyala = halus(rentang(t, tn - 0.05, tn + 0.15));
    b.matJendela.emissiveIntensity = nyala * (0.95 + 0.9 * Math.exp(-Math.max(0, t - tn) * 3.5)) * (1 - turun);
  });
  sidang.panji.material.emissiveIntensity = 0.35 * halus(rentang(t, T_SIDANG_NYALA, T_SIDANG_NYALA + 0.3));
  sidang.panji.rotation.y = 0.12 * Math.sin(t * 2.6);
  // Garis penghubung.
  const k = halus(rentang(t, T_GARIS[0], T_GARIS[1]));
  const pudarGaris = 1 - halus(rentang(t, 7.0, 7.6));
  garisYogya.visible = k > 0 && pudarGaris > 0;
  matGaris.dashOffset = PANJANG_GARIS * 1.2 * (1 - k);
  matGaris.opacity = 0.95 * pudarGaris;
  const pc = k > 0 && k < 1 ? 1 : 0;
  percikGaris.visible = pc > 0;
  if (pc) { const i = Math.min(23, Math.floor(k * 24)); const f = k * 24 - i; percikGaris.position.set(campur(titikGaris[i * 3], titikGaris[i * 3 + 3], f), campur(titikGaris[i * 3 + 1], titikGaris[i * 3 + 4], f), campur(titikGaris[i * 3 + 2], titikGaris[i * 3 + 5], f)); percikGaris.material.opacity = 1; }
  simpulGaris.forEach((s, j) => { const a = halus(rentang(t, T_GARIS[0] + j * (T_GARIS[1] - T_GARIS[0]), T_GARIS[0] + j * (T_GARIS[1] - T_GARIS[0]) + 0.2)); s.visible = a > 0; s.material.opacity = a * pudarGaris; });
  // Label tahun di atas atap masing-masing.
  const aT = [halus(rentang(t, T_KULIAH_NYALA, T_KULIAH_NYALA + 0.3)), halus(rentang(t, T_SIDANG_NYALA, T_SIDANG_NYALA + 0.3))].map((x) => x * (1 - halus(rentang(t, 6.9, 7.3))));
  taruh(lblTahun[0], dunia(POS_KULIAH.a, POS_KULIAH.b, 1.75, _v), aT[0], { ay: 1, dy: -6, skala: 0.85 + 0.15 * lenting(rentang(t, T_KULIAH_NYALA, T_KULIAH_NYALA + 0.4)) });
  taruh(lblTahun[1], dunia(POS_SIDANG.a, POS_SIDANG.b, 2.75, _v), aT[1], { ay: 1, dy: -6, skala: 0.85 + 0.15 * lenting(rentang(t, T_SIDANG_NYALA, T_SIDANG_NYALA + 0.4)) });
}

// ---------------------------------------------------------------- perahu
const perahu = buatPerahu();
scene.add(perahu.g);
const A0 = 28 * Math.PI / 180;      // sapuan dayung
const DIP_AIR = 0.33, DIP_ANGKAT = 0.08;
export function sapuan(p) { // −A0 … A0, positif = bilah ke arah haluan
  p -= Math.floor(p);
  return p < DORONG ? A0 * Math.cos((Math.PI * p) / DORONG) : -A0 * Math.cos((Math.PI * (p - DORONG)) / (1 - DORONG));
}
// Keadaan perahu di dunia: posisi, sudut rotation.y, ayun.
export function keadaanPerahu(t, out = {}) {
  const l = lintasPerahu(t);
  dunia(l.a, l.b, 0, (out.pos ??= new THREE.Vector3()));
  out.yaw = yawDari(l.psi);
  out.tampak = l.tampak;
  out.b = l.b;
  return out;
}
const _kp = {};
const _m = new THREE.Matrix4();
const _bilah = new THREE.Vector3();
function posisiBilah(t, i, ke) { // posisi dunia bilah dayung i saat sapuan = ke (di permukaan air)
  const r = perahu.pendayung[i];
  const kp = keadaanPerahu(t, {});
  const jarak = 1.92;
  _bilah.set(r.x + 0.05 + Math.sin(ke) * jarak, 0, r.s * (lebarLambung(r.u) + Math.cos(ke) * jarak));
  _m.makeRotationY(kp.yaw).setPosition(kp.pos);
  return _bilah.applyMatrix4(_m);
}

function perbaruiPerahu(t) {
  const kp = keadaanPerahu(t, _kp);
  perahu.g.visible = kp.tampak;
  if (!kp.tampak) { bahanTanah.uniforms.uPerahu.value.w = 0; return; }
  const serentak = t >= 47.5;
  perahu.g.position.copy(kp.pos);
  const retak = halus(rentang(t, T_RETAK, T_RETAK + 0.25));
  const getar = t > T_DERIT && t < T_RETAK + 0.6 ? 0.012 * Math.sin(t * 90) * (1 - rentang(t, T_RETAK, T_RETAK + 0.6)) : 0;
  perahu.g.position.y = 0.03 * Math.sin(t * 1.7) - 0.015;
  perahu.g.rotation.set(0, 0, 0);
  perahu.g.rotation.y = kp.yaw;
  perahu.g.rotateX((0.03 + 0.04 * retak * (t < 27.5 ? 1 : 0)) * Math.sin(t * 1.3) + getar);
  perahu.g.rotateZ(0.012 * Math.sin(t * 1.1 + 0.6) + (serentak ? -0.02 : 0));

  // Lantai retak menjadi abu-abu, dua belahan sedikit menjauh dan miring.
  const kembali = serentak ? 1 : 0; // adegan 8: perahu yang sama, lantainya sudah dirapatkan
  const r = retak * (1 - kembali);
  for (const l of perahu.lantai) {
    l.pivot.position.x = l.sisi * 0.07 * r;
    l.pivot.rotation.z = -l.sisi * 0.045 * r;
    l.m.material.color.setRGB(1, 1, 1).lerp(_c.setRGB(0.42, 0.45, 0.44), r);
  }
  const kilatRetak = t >= T_RETAK ? Math.exp(-(t - T_RETAK) * 4) : 0;
  perahu.garisRetak.material.opacity = r * (0.7 + 0.3 * kilatRetak);
  perahu.garisRetak.material.color.copy(W.abu).lerp(W.krem, kilatRetak).multiplyScalar(1.4);

  // Lis emas: menyala saat perahu utuh, kelabu saat awaknya berebut dayung, terang saat serempak.
  const emas = serentak ? halus(rentang(t, T_EMAS_PERAHU - 0.2, T_EMAS_PERAHU + 0.4)) : 0;
  const kelabu = serentak ? 0 : halus(rentang(t, T_RETAK, T_RETAK + 0.8));
  perahu.matLis.color.copy(W.emas).lerp(W.abu, kelabu);
  let denyut = 0;
  if (serentak) { const p = fasaDayung(t, 0); const f = p - Math.floor(p); denyut = Math.exp(-f * 5); }
  perahu.matLis.emissiveIntensity = (0.22 + 0.08 * Math.sin(t * 2)) * (1 - kelabu) * (serentak ? 0 : 1) + emas * (0.75 + 0.45 * denyut);
  perahu.pendar.material.opacity = emas * (0.32 + 0.18 * denyut);

  // Dayung dan pendayung.
  const kuat = kuatDayung(t);
  for (let i = 0; i < N_DAYUNG; i++) {
    const rw = perahu.pendayung[i];
    const p = fasaDayung(t, i);
    const arah = arahDayung(t, i);
    const al = sapuan(p) * arah * kuat;
    const air = bilahDiAir(p) * kuat;
    const dip = campur(DIP_ANGKAT * 0.6, campur(DIP_ANGKAT, DIP_AIR, air), kuat);
    rw.tumpu.rotation.set(rw.s * dip, rw.s * al, 0, "YXZ");
    rw.badan.rotation.set(0, 0, -0.32 * (al / A0));
    rw.badan.position.y = 0.19 + 0.02 * Math.abs(al / A0);
  }
  // Riak saat bilah masuk dan keluar air.
  if (kuat > 0.3) {
    for (let i = 0; i < N_DAYUNG; i++) {
      const p = fasaDayung(t, i);
      const f = (p - fasaDayung(t - 0.01, i)) / 0.01;
      if (f <= 0) continue;
      const pecahan = p - Math.floor(p);
      const umurMasuk = pecahan / f;
      if (umurMasuk < 1.2) {
        const tm = t - umurMasuk;
        const b = posisiBilah(tm, i, A0 * arahDayung(tm, i));
        tambahRiak(b.x, b.z, umurMasuk, serentak ? 1.0 : 0.8);
      }
      const umurKeluar = (pecahan - DORONG) / f;
      if (umurKeluar > 0 && umurKeluar < 0.8) {
        const tk = t - umurKeluar;
        const b = posisiBilah(tk, i, -A0 * arahDayung(tk, i));
        tambahRiak(b.x, b.z, umurKeluar, 0.45);
      }
    }
  }
  // Jejak di air: kuat saat melaju, sedikit saat berputar di tempat.
  const laju = serentak ? klem((lintasPerahu(t).b - lintasPerahu(t - 0.1).b) / 0.1 / 6) : 0;
  bahanTanah.uniforms.uPerahu.value.set(kp.pos.x, kp.pos.z, kp.yaw, laju);
  tambahBusa(kp.pos.x, kp.pos.z, 2.6, 0.25 * (t > T_RETAK && t < 27 ? 1 : 0.4));
}
const _c = new THREE.Color();

// ---------------------------------------------------------------- dua karang
const karang = KARANG_POS.map((p, k) => {
  const kr = buatKarang(11 + k * 7);
  dunia(p.a, p.b, 0, kr.g.position);
  kr.g.rotation.y = yawDari(PSI0) + Math.PI / 2 + (k ? Math.PI : 0); // sumbu belahan sejajar haluan perahu
  kr.g.scale.setScalar(k ? 0.98 : 1.06);
  scene.add(kr.g);
  return { ...kr, p, tNaik: T_KARANG[k] };
});
function perbaruiKarang(t) {
  for (const kr of karang) {
    const naik = lenting(rentang(t, kr.tNaik, kr.tNaik + LAMA_KARANG), 1.1);
    const belah = halus(rentang(t, T_BELAH, T_BELAH + 1.3));
    const tenggelam = rentang(t, T_BELAH + 0.35, T_BELAH + 1.6);
    kr.g.visible = naik > 0.001 && tenggelam < 1;
    if (!kr.g.visible) continue;
    kr.g.position.y = -4.6 * (1 - naik) - 4.8 * tenggelam * tenggelam;
    kr.belahan.forEach((b, j) => {
      const s = j === 0 ? -1 : 1;
      b.position.x = s * 1.1 * belah;
      b.rotation.z = -s * 0.32 * belah;
    });
    const getar = t > T_BELAH - 0.1 && t < T_BELAH + 0.4 ? 0.04 * Math.sin(t * 70) : 0;
    kr.g.position.x += 0;
    kr.belahan[0].position.y = getar;
    tambahBusa(kr.g.position.x, kr.g.position.z, 1.9 * kr.g.scale.x * klem(naik), (0.6 + 0.4 * Math.exp(-Math.max(0, t - kr.tNaik - 0.6) * 2)) * klem(naik) * (1 - tenggelam));
  }
}

// ---------------------------------------------------------------- menara cip
const menaraObj = menara.map((m) => {
  const o = buatMenaraCip(m);
  o.g.rotation.y = m.putar * Math.PI / 2;
  dunia(m.a, m.b, 0, o.g.position);
  o.g.visible = false;
  scene.add(o.g);
  return { ...o, m };
});
function perbaruiMenara(t, kam) {
  const daftarBusa = [];
  for (const o of menaraObj) {
    const m = o.m;
    const naik = lenting(rentang(t, m.tNaik, m.tNaik + 0.85), 1.25);
    const turun = m.susunan === "A" ? rentang(t, 26.85 + 0.3 * m.u, 27.5 + 0.3 * m.u) : 0;
    const keluar = 1 - naik + turun * turun;
    o.g.visible = naik > 0.001 && turun < 1;
    if (!o.g.visible) continue;
    o.g.position.y = -(o.tinggiTotal + 0.4) * klem(keluar, 0, 1.2);
    const denyut = m.nyala ? 0.85 + 0.15 * Math.sin(t * 3 + m.u * 20) : 1;
    o.matBadan.emissiveIntensity = (m.nyala ? 1.0 : 0.32) * denyut * (1 + 1.2 * Math.exp(-Math.max(0, t - m.tNaik - 0.4) * 3) * (m.nyala ? 1 : 0.3));
    if (o.lampu) o.lampu.material.opacity = 0.75 * denyut * naik;
    const dx = o.g.position.x - kam.fx, dz = o.g.position.z - kam.fz;
    daftarBusa.push([dx * dx + dz * dz, o.g.position.x, o.g.position.z, m.lebar * 0.5 + 0.38, klem(naik) * (1 - turun) * 0.7]);
  }
  daftarBusa.sort((a, b) => a[0] - b[0]);
  for (const b of daftarBusa.slice(0, 20)) tambahBusa(b[1], b[2], b[3], b[4]);
}

// ---------------------------------------------------------------- ekspor
export function perbaruiDunia1(t, kam, air) {
  busaFrame.length = 0;
  riakFrame.length = 0;
  const u = bahanTanah.uniforms;
  u.uT.value = t;
  u.uFokus.value.set(kam.fx, 0, kam.fz);
  u.uJari.value = kam.H * 1.1 * (0.35 + 0.65 * keluar3(rentang(t, 0, 1.2)));
  u.uAirC.value.set(air.x, air.z);
  u.uAirR.value = air.r;
  u.uKilau.value = klem(21 / kam.H, 0.4, 1);
  tanah.position.set(kam.fx, 0, kam.fz);
  bayangan.position.set(kam.fx, 0.004, kam.fz);
  perbaruiYogya(t);
  perbaruiPerahu(t);
  perbaruiKarang(t);
  perbaruiMenara(t, kam);
}
export function tutupAir() { // kirim busa dan riak ke shader (setelah semua bagian dunia menambahkan)
  const u = bahanTanah.uniforms;
  for (let i = 0; i < N_BUSA; i++) { const b = busaFrame[i]; if (b) u.uBusa.value[i].set(...b); else u.uBusa.value[i].set(0, 0, 0, 0); }
  for (let i = 0; i < N_RIAK; i++) { const r = riakFrame[i]; if (r) u.uRiak.value[i].set(...r); else u.uRiak.value[i].set(0, 0, 0, 0); }
}
export { T_LEWAT_GAPURA, atasLambung, xLambung };
