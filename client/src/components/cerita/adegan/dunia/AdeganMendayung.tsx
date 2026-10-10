import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { Buih, CahayaMalam, Keterangan, Label, Laut, PanahPutar, Pendar, Perahu, W, aturKamera, bacaProgres, campur, mulus, type KeadaanAwak } from "./bersama3d";

/**
 * Bagian 9 · Mengurangi pertengkaran. Separuh awak menghadap ke belakang dan
 * mendayung berlawanan, perahu berputar di tempat. Lalu mereka berbalik, irama
 * menyatu, dan perahu maju ke arah fajar 2045. Baju awak tetap berbeda warna:
 * persatuan bukan keseragaman.
 */

const JUMLAH = 6;
const DUA_PI = Math.PI * 2;

export default function AdeganMendayung({ progres, lapis, tenang }: PropsAdegan3D) {
  const putar = useRef<THREE.Group>(null);
  const fajar = useRef<THREE.Group>(null);
  const awak = useRef<KeadaanAwak>({ fase: Array(JUMLAH).fill(0), hadap: Array(JUMLAH).fill(0) });
  const ombak = useRef(0);
  const laju = useRef(0);
  const keadaan = useRef({ yaw: 0, jalan: 0 });
  const tahapRef = useRef(0);
  const size = useThree((s) => s.size);

  useFrame(({ clock, camera }, delta) => {
    const p = bacaProgres(progres, tenang);
    const t = tenang ? 0 : clock.elapsedTime;
    const dt = Math.min(delta, 0.1);
    const balik = mulus(0.38, 0.58, p);
    const irama = mulus(0.45, 0.66, p);
    tahapRef.current = p;
    for (let i = 0; i < JUMLAH; i++) {
      const belakang = i >= JUMLAH / 2;
      awak.current.hadap[i] = belakang ? 1 - balik : 0;
      awak.current.fase[i] = t * 2.6 + (belakang ? (1 - irama) * Math.PI : 0);
    }
    const k = keadaan.current;
    if (tenang) k.yaw = 0;
    else {
      k.yaw += dt * (1 - balik) * 0.75;
      if (balik > 0.6) {
        const lurus = Math.round(k.yaw / DUA_PI) * DUA_PI;
        k.yaw += (lurus - k.yaw) * Math.min(1, dt * 2.4 * balik);
      }
    }
    const g = putar.current;
    if (g) {
      g.rotation.set(Math.sin(t * 1.2) * 0.025, k.yaw, Math.sin(t * 1.5) * 0.035);
      g.position.y = 0.09 + Math.sin(t * 1.3) * 0.03;
    }
    const maju = mulus(0.62, 1, p);
    ombak.current = maju * 9 + t * 1.1 * irama;
    laju.current = mulus(0.6, 0.8, p);
    const f = fajar.current;
    if (f) {
      f.position.y = campur(-1.4, 1.3, mulus(0.5, 0.92, p));
      f.visible = p > 0.5;
    }
    aturKamera(camera, size.width / Math.max(1, size.height), [0.9, campur(0.5, 0.7, maju), -0.2], [0.55, campur(0.75, 0.36, maju), 1.3], 3.6, campur(1, 1.08, maju));
  });

  return (
    <>
      <CahayaMalam />
      <fog attach="fog" args={[W.kabut, 12, 30]} />
      <group ref={fajar} position={[-5.5, 0, -22]}>
        <Pendar ukuran={18} warna="#F2C86E" kuat={0.7} />
        <mesh>
          <circleGeometry args={[1.6, 48]} />
          <meshBasicMaterial color="#F6D98E" fog={false} />
        </mesh>
        <Label p={[0, 2.5, 0]} tampil={() => tahapRef.current > 0.7} nada="emas">2045 · 2047</Label>
      </group>
      <Laut jalan={ombak} tenang={tenang} />
      <PanahPutar jari={3} kuat={() => 1 - mulus(0.36, 0.5, tahapRef.current)} tenang={tenang} />
      <group ref={putar}>
        <Perahu panjang={4.6} lebar={1.05} awak={JUMLAH} keadaan={awak} tenang={tenang} />
        <Buih panjangPerahu={4.6} laju={laju} />
        <Label p={[-1.1, 1.25, 0]} tampil={() => lapis >= 1 && tahapRef.current < 0.42} nada="panas">Berlawanan arah</Label>
        <Label p={[1.1, 1.25, 0]} tampil={() => lapis >= 1 && tahapRef.current < 0.42}>Menghadap ke depan</Label>
        <Label p={[0, 1.35, 0]} tampil={() => lapis >= 2 && tahapRef.current > 0.66} nada="emas">Berbeda warna, satu irama</Label>
      </group>
      <Keterangan
        progres={progres}
        tenang={tenang}
        tahap={[
          { dari: 0, teks: "Saling berlawanan: perahu berputar" },
          { dari: 0.4, teks: "Berbalik, mencari irama yang sama" },
          { dari: 0.62, teks: "Seirama: perahu maju" },
        ]}
      />
    </>
  );
}
