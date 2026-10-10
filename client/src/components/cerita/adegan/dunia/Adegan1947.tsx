import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { Bintang, Bulan, CahayaMalam, Karang, Keterangan, KilauBulan, Label, Laut, Perahu, W, aturKamera, bacaProgres, campur, mulus, type KeadaanAwak } from "./bersama3d";

/**
 * Bagian 1 · Yogyakarta 1947–1948. Perahu kecil di laut malam melaju pelan di
 * antara dua karang besar. Kamera turun mendekat seiring bacaan. Lapis 1 memberi
 * nama kedua karang; lapis 2 menandai perahu sebagai republik yang baru lahir.
 */
export default function Adegan1947({ progres, lapis, tenang }: PropsAdegan3D) {
  const perahu = useRef<THREE.Group>(null);
  const awak = useRef<KeadaanAwak>({ fase: [0, 0], hadap: [0, 0] });
  const size = useThree((s) => s.size);

  useFrame(({ clock, camera }) => {
    const p = bacaProgres(progres, tenang);
    const t = tenang ? 0 : clock.elapsedTime;
    awak.current.fase[0] = awak.current.fase[1] = t * 2.2;
    const g = perahu.current;
    if (g) {
      g.position.set(Math.sin(t * 0.4) * 0.05, 0.06 + Math.sin(t * 1.3) * 0.035, campur(3.6, -0.6, mulus(0.02, 0.95, p)));
      g.rotation.set(Math.sin(t * 1.1) * 0.03, Math.PI / 2 + Math.sin(t * 0.5) * 0.05, Math.sin(t * 1.3 + 1) * 0.04);
    }
    const e = mulus(0, 1, p);
    aturKamera(camera, size.width / Math.max(1, size.height), [0.2, campur(2.0, 1.5, e), campur(-1.2, -1.6, e)], [campur(0.42, 0.3, e), campur(0.46, 0.2, e), 1], 5.6, campur(1.15, 0.88, e));
  });

  return (
    <>
      <CahayaMalam />
      <fog attach="fog" args={[W.kabut, 14, 36]} />
      <Bintang />
      <Bulan p={[-1.2, 3.6, -22]} />
      <directionalLight position={[-1.2, 3.6, -22]} intensity={1.1} color="#F3E3B6" />
      <Laut tenang={tenang} />
      <KilauBulan dari={[-1.1, -16]} tenang={tenang} jumlah={18} />
      <Karang p={[-3.6, 0, -2.6]} tinggi={5.4} biji={2} />
      <Karang p={[3.8, 0, -3]} tinggi={5} biji={7} lebar={1.1} />
      <group ref={perahu}>
        <group scale={0.78}>
          <Perahu panjang={2.6} lebar={0.82} awak={2} keadaan={awak} lentera tenang={tenang} />
        </group>
        <Label p={[0, 1.3, 0]} tampil={lapis >= 2} nada="emas">Republik yang baru lahir</Label>
      </group>
      <Label p={[-3.6, 6.1, -2.6]} tampil={lapis >= 1}>Amerika Serikat</Label>
      <Label p={[3.8, 5.7, -3]} tampil={lapis >= 1}>Uni Soviet</Label>
      <Keterangan
        progres={progres}
        tenang={tenang}
        tahap={[
          { dari: 0, teks: "Yogyakarta, 1947: HMI berdiri" },
          { dari: 0.5, teks: "1948: mendayung di antara dua karang" },
        ]}
      />
    </>
  );
}
