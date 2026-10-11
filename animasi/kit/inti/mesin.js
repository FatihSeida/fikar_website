// Mesin gambar: renderer, scene, komposisi dengan bloom, dan cahaya.
// Cahaya bawaan (hemisfer 1.6, matahari 2.6) diuji di indikator-01: hanya benda emas ber-emissive yang melewati ambang bloom 0.74.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { W } from "./tema.js";

export const BLOOM = { kekuatan: 0.5, radius: 0.5, ambang: 0.74 };
export const CAHAYA = {
  langit: "hsl(150, 30%, 70%)", tanah: "hsl(153, 50%, 6%)", hemisfer: 1.6,
  matahari: "hsl(45, 40%, 96%)", kuatMatahari: 2.6,
  arah: [-0.32, 1, 0.78],     // arah datang sinar (dinormalkan)
  bayangan: 2048,             // ukuran peta bayangan
};

// opsi: kanvas, ukuran { lebar, tinggi }, kamera (THREE.Camera), bloom {kekuatan, radius, ambang} | false, cahaya {...CAHAYA} | false.
export function buatMesin({ kanvas, ukuran, kamera, bloom = {}, cahaya = {} }) {
  const { lebar, tinggi } = ukuran;
  const renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.setSize(lebar, tinggi, false);
  renderer.setClearColor(W.latar, 1);
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = W.latar; // objek warna tema yang sama, ikut bila tema diganti

  const rt = new THREE.WebGLRenderTarget(lebar, tinggi, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(1);
  composer.setSize(lebar, tinggi);
  composer.addPass(new RenderPass(scene, kamera));
  let bloomPass = null;
  if (bloom !== false) {
    const b = { ...BLOOM, ...bloom };
    bloomPass = new UnrealBloomPass(new THREE.Vector2(lebar, tinggi), b.kekuatan, b.radius, b.ambang);
    composer.addPass(bloomPass);
  }
  composer.addPass(new OutputPass());

  let hemi = null, matahari = null;
  const c = { ...CAHAYA, ...(cahaya || {}) };
  const arah = new THREE.Vector3(...c.arah).normalize();
  if (cahaya !== false) {
    hemi = new THREE.HemisphereLight(new THREE.Color(c.langit), new THREE.Color(c.tanah), c.hemisfer);
    matahari = new THREE.DirectionalLight(new THREE.Color(c.matahari), c.kuatMatahari);
    matahari.castShadow = true;
    matahari.shadow.mapSize.set(c.bayangan, c.bayangan);
    Object.assign(matahari.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 100 });
    matahari.shadow.bias = -0.0006;
    matahari.shadow.normalBias = 0.02;
    scene.add(hemi, matahari, matahari.target);
  }

  // Matahari dan kotak bayangannya mengikuti fokus kamera supaya bayangan tetap tajam saat kamera pindah.
  function ikutiFokus(fokus, H) {
    if (!matahari) return;
    matahari.target.position.set(fokus.x, 0, fokus.z);
    matahari.position.set(fokus.x, 0, fokus.z).addScaledVector(arah, 50);
    matahari.target.updateMatrixWorld();
    const s = Math.max(14, H * 0.75);
    Object.assign(matahari.shadow.camera, { left: -s, right: s, top: s, bottom: -s });
    matahari.shadow.camera.updateProjectionMatrix();
  }

  return { renderer, scene, composer, bloom: bloomPass, hemi, matahari, arahCahaya: arah, ikutiFokus, render: () => composer.render() };
}
