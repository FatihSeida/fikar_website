// Tata letak "Dunia Kader" (bagian F): tanah bergrid, gerbang, kelas, jalan ubin, komisariat, tangga,
// arus figur, tabel, lima figur baru dan balon alasan. Hanya membangun; gerak ada di adegan.js.
import * as THREE from "three";
import { W, DEG, scene, titik, warna } from "./alat.js";
import { pion, gerbangKampus, gedungKelas, ubinJalan, tanggaJenjang, komisariat, balonKata, tabel } from "./benda.js";
import { FIGUR, titikJalan, GERBANG, RUMAH_P, PUSAT_LIMA, JARI_LIMA } from "./isyarat.js";

// ---------------------------------------------------------------- tanah bergrid (pola bahanTanah dari ekosistem-berbasis-bukti/dunia.js)
export const bahanTanah = new THREE.ShaderMaterial({
  uniforms: {
    uLatar: { value: W.latar }, uGaris: { value: W.grid }, uMayor: { value: W.gridMayor },
    uFokus: { value: new THREE.Vector3() }, uJari: { value: 20 },
  },
  vertexShader: `
    varying vec3 vW;
    void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `
    uniform vec3 uLatar; uniform vec3 uGaris; uniform vec3 uMayor; uniform vec3 uFokus; uniform float uJari;
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
      float pudar = 1.0 - smoothstep(uJari * 0.3, uJari + 0.001, d);
      vec3 c = mix(uLatar, uGaris, kecil * pudar);
      c = mix(c, uMayor, besar * pudar);
      gl_FragColor = vec4(c, 1.0);
    }`,
});
const tanah = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), bahanTanah);
tanah.rotation.x = -Math.PI / 2;
scene.add(tanah);
const penerima = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ color: warna("hsl(153, 60%, 2%)"), opacity: 0.5 }));
penerima.rotation.x = -Math.PI / 2;
penerima.position.y = 0.004;
penerima.receiveShadow = true;
scene.add(penerima);

// ---------------------------------------------------------------- dunia dasar
export const gerbang = gerbangKampus();
gerbang.position.copy(titik(GERBANG[0], GERBANG[1]));
gerbang.rotation.y = -45 * DEG;
scene.add(gerbang);

export const kelas = gedungKelas();
kelas.position.copy(titik(-4.6, -5.4));
kelas.rotation.y = 90 * DEG; // jendela menghadap ke arah gerbang (kanan bawah layar)
scene.add(kelas);

// 9 ubin dengan jarak sama sepanjang lengkung jalan.
export const ubin = [];
{
  const N = 200, kum = [0], p = [];
  for (let i = 0; i <= N; i++) p.push(titikJalan(i / N));
  for (let i = 1; i <= N; i++) kum.push(kum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  const L = kum[N];
  for (let k = 0; k < 9; k++) {
    const s = (k / 8) * L;
    let i = 1; while (i < N && kum[i] < s) i++;
    const a = p[i - 1], b = p[i];
    const u = ubinJalan();
    const pos = titik(a[0], a[1]);
    const arah = titik(b[0], b[1]).sub(pos);
    u.position.copy(pos).setY(0.03 + (k % 2) * 0.004);
    u.rotation.y = Math.atan2(arah.x, arah.z);
    scene.add(u);
    ubin.push(u);
  }
}

export const rumah = komisariat();
rumah.grup.position.copy(titik(RUMAH_P[0], RUMAH_P[1]));
scene.add(rumah.grup);

export const tangga = tanggaJenjang();
tangga.grup.position.copy(titik(4.2, -0.4));
// Rotasi 0: anak tangga naik ke kanan atas layar, muka tegaknya menghadap kiri bawah (terlihat kamera).
scene.add(tangga.grup);
tangga.grup.updateMatrixWorld(true);
export const PUNCAK_TANGGA = tangga.puncak.map((p) => tangga.grup.localToWorld(p.clone()));

// ---------------------------------------------------------------- arus: 36 figur pion
export const arus = FIGUR.map((f) => {
  const p = pion(W.pion);
  p.grup.visible = false;
  scene.add(p.grup);
  return { ...f, ...p };
});

// ---------------------------------------------------------------- tabel (awalnya tidak terlihat)
export const meja = tabel();
export const POS_TABEL = titik(0.8, 3.6, 0);
meja.grup.position.copy(POS_TABEL);
meja.grup.visible = false;
scene.add(meja.grup);

// ---------------------------------------------------------------- lima figur baru dan balon alasan
export const lima = [0, 1, 2, 3, 4].map((k) => {
  const a = (90 + k * 72) * DEG;
  const r = PUSAT_LIMA[0] + JARI_LIMA * Math.cos(a), d = PUSAT_LIMA[1] + JARI_LIMA * Math.sin(a);
  const p = pion(W.pion);
  p.grup.position.copy(titik(r, d));
  p.grup.visible = false;
  scene.add(p.grup);
  const b = balonKata();
  b.grup.visible = false;
  scene.add(b.grup);
  // Balon di atas kepala, sedikit bergeser keluar lingkaran supaya tidak saling menutupi.
  const posBalon = titik(r + 0.18 * Math.cos(a), d, 1.62 + (k % 2) * 0.16);
  return { ...p, balon: b, posBalon, r, d };
});
