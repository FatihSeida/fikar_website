// Tata dunia: tanah bergrid, dua blok tanah dengan isinya, figur, kertas survei, papan jembatan, debu.
// Hanya membangun; semua gerak ada di adegan.js.
import * as THREE from "three";
import { W, scene, warna } from "./alat.js";
import { G, Z_KIRI, Z_KANAN, ATAS, GERBANG, KELAS, KOM, FIGUR_KOM, Z_JEMBATAN, xPapan, yPapan, xBlokKiri, xBlokKanan } from "./tata.js";
import { T, daftarDebu } from "./isyarat.js";
import { pion, gerbangKampus, gedungKelas, rumahKomisariat, blokTanah, kertasSurvei, papanJembatan, butirDebu } from "./benda.js";

// ---------------------------------------------------------------- tanah bergrid (pola bahanTanah di ekosistem-berbasis-bukti/dunia.js)
export const bahanTanah = new THREE.ShaderMaterial({
  uniforms: {
    uLatar: { value: W.latar }, uGaris: { value: W.grid }, uMayor: { value: W.gridMayor },
    uFokus: { value: new THREE.Vector3() }, uJari: { value: 0 },
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
      float pudar = 1.0 - smoothstep(uJari * 0.3, max(uJari, 0.001), d);
      vec3 c = mix(uLatar, uGaris, kecil * pudar);
      c = mix(c, uMayor, besar * pudar);
      gl_FragColor = vec4(c, 1.0);
    }`,
});
const tanah = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), bahanTanah);
tanah.rotation.x = -Math.PI / 2;
scene.add(tanah);
const bidangBayang = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ color: warna("hsl(153, 60%, 2%)"), opacity: 0.5 }));
bidangBayang.rotation.x = -Math.PI / 2;
bidangBayang.position.y = 0.004;
bidangBayang.receiveShadow = true;
scene.add(bidangBayang);

// ---------------------------------------------------------------- blok kiri: gerbang dan gedung kelas
export const blokKiri = new THREE.Group();
blokKiri.position.set(xBlokKiri(0), 0, Z_KIRI);
scene.add(blokKiri);
export const lantaiKiri = blokTanah(+1);
blokKiri.add(lantaiKiri.grup);
export const gerbang = gerbangKampus();
gerbang.rotation.y = -Math.PI / 2; // balok atas sejajar tepi celah (sumbu z), jalan lewat gerbang menuju celah
export const POS_GERBANG = new THREE.Vector3(GERBANG.x, ATAS, GERBANG.z);
blokKiri.add(gerbang);
export const kelas = gedungKelas();
export const POS_KELAS = new THREE.Vector3((KELAS.x0 + KELAS.x1) / 2, ATAS, (KELAS.z0 + KELAS.z1) / 2);
blokKiri.add(kelas);

// ---------------------------------------------------------------- blok kanan: komisariat dan tiga figur
export const blokKanan = new THREE.Group();
blokKanan.position.set(xBlokKanan(0), 0, Z_KANAN);
scene.add(blokKanan);
export const lantaiKanan = blokTanah(-1);
blokKanan.add(lantaiKanan.grup);
export const kom = rumahKomisariat();
export const POS_KOM = new THREE.Vector3(KOM.x, ATAS, KOM.z);
blokKanan.add(kom.grup);
export const figKom = FIGUR_KOM.map(([x, z]) => {
  const p = pion();
  p.dasar = new THREE.Vector3(x, ATAS, z);
  blokKanan.add(p.grup);
  return p;
});

// ---------------------------------------------------------------- enam figur kelas (posisi dunia dihitung tiap frame)
export const figKelas = [0, 1, 2].map(() => [0, 1].map(() => { const p = pion(); scene.add(p.grup); return p; }));

// ---------------------------------------------------------------- kertas survei dan papan jembatan
export const kertas = T.lempar.map(() => { const k = kertasSurvei(); k.m.visible = false; scene.add(k.m); return k; });
export const papan = T.lempar.map((_, i) => {
  const p = papanJembatan();
  p.dasar = new THREE.Vector3(xPapan(i), yPapan, Z_JEMBATAN);
  p.m.position.copy(p.dasar);
  p.m.visible = false;
  scene.add(p.m);
  return p;
});

// ---------------------------------------------------------------- debu yang jatuh dari tepi celah (acak berbenih)
export const debu = daftarDebu().map((d) => {
  const m = butirDebu();
  m.visible = false;
  scene.add(m);
  return { ...d, m, z: (d.sisi < 0 ? Z_KIRI : Z_KANAN) + d.dz };
});
