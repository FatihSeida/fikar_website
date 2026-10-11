// Tanah bergrid: garis kecil tiap 1 unit, garis mayor tiap 5 unit, pudar radial dari fokus kamera,
// dan radius nyala yang bisa dianimasikan (grid menyala dari tengah ke tepi). Ditambah bidang penerima bayangan.
import * as THREE from "three";
import { W } from "./tema.js";
import { keluar3, rentang } from "./waktu.js";

// opsi: luas (unit, bawaan 300), jari (radius pudar penuh, bawaan 20),
//       nyala [a, b] (radius naik 0 → jari selama a..b; null = langsung penuh), bayangan (opasitas bayangan, 0 = tanpa).
export function buatTanah({ luas = 300, jari = 20, nyala = null, bayangan = 0.5 } = {}) {
  const bahan = new THREE.ShaderMaterial({
    uniforms: {
      uLatar: { value: W.latar }, uGaris: { value: W.grid }, uMayor: { value: W.gridMayor },
      uFokus: { value: new THREE.Vector3() }, uJari: { value: jari },
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
  const grup = new THREE.Group();
  grup.name = "tanah";
  const bidang = new THREE.Mesh(new THREE.PlaneGeometry(luas, luas), bahan);
  bidang.rotation.x = -Math.PI / 2;
  bidang.userData.abaikanZona = true;
  grup.add(bidang);
  if (bayangan > 0) {
    const penerima = new THREE.Mesh(new THREE.PlaneGeometry(luas, luas), new THREE.ShadowMaterial({ color: new THREE.Color("hsl(153, 60%, 2%)"), opacity: bayangan }));
    penerima.rotation.x = -Math.PI / 2;
    penerima.position.y = 0.004;
    penerima.receiveShadow = true;
    penerima.userData.abaikanZona = true;
    grup.add(penerima);
  }

  function perbarui(t, fokus) {
    bahan.uniforms.uFokus.value.set(fokus.x, 0, fokus.z);
    bahan.uniforms.uJari.value = nyala ? jari * keluar3(rentang(t, nyala[0], nyala[1])) : jari;
  }
  return { grup, bahan, perbarui };
}
