import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { Buih, CahayaMalam, Keterangan, Label, Laut, PanahPutar, Pendar, Perahu, W, aturKamera, bacaProgres, mulus, type KeadaanAwak } from "./bersama3d";

/**
 * Bagian 2 · Bebas aktif. Empat pendayung mula-mula tidak seirama sehingga
 * perahu berputar di dekat pelampung "Madiun 1948". Makin digulir, dayung
 * makin seirama dan perahu melaju melewati Bandung 1955 dan Non-Blok 1961.
 */

const JUMLAH = 4;
const ACAK = [0.1, 0.62, 0.31, 0.87];
const DUA_PI = Math.PI * 2;

type Pelampung = { x: number; z: number; tahun: string; nama: string };
const PELAMPUNG: Pelampung[] = [
  { x: 1.6, z: 2.1, tahun: "1948", nama: "Madiun 1948" },
  { x: 6.8, z: -2.0, tahun: "1955", nama: "KAA Bandung 1955" },
  { x: 11.2, z: 2.0, tahun: "1961", nama: "Non-Blok 1961" },
];
const PERJALANAN = 11.6;

function TiangPelampung({ indeks, jalan, lapis }: { indeks: number; jalan: MutableRefObject<number>; lapis: number }) {
  const ref = useRef<THREE.Group>(null);
  const data = PELAMPUNG[indeks];
  const x = () => data.x - jalan.current;
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    g.position.set(x(), Math.sin(clock.elapsedTime * 1.4 + indeks) * 0.04, data.z);
    g.visible = x() > -9 && x() < 12;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.2, 12]} />
        <meshLambertMaterial color={W.gading} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        <meshLambertMaterial color="#D9B97E" />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshBasicMaterial color="#FFE7A8" />
      </mesh>
      <Pendar p={[0, 1.35, 0]} ukuran={1.4} warna="#FFD98A" kuat={0.8} />
      <Label p={[0, 1.85, 0]} tampil={() => x() > -6 && x() < 7} nada="emas">{lapis >= 1 ? data.nama : data.tahun}</Label>
    </group>
  );
}

export default function AdeganPerahu({ progres, lapis, tenang }: PropsAdegan3D) {
  const putar = useRef<THREE.Group>(null);
  const awak = useRef<KeadaanAwak>({ fase: Array(JUMLAH).fill(0), hadap: Array(JUMLAH).fill(0) });
  const jalan = useRef(0);
  const ombak = useRef(0);
  const laju = useRef(0);
  const keadaan = useRef({ yaw: 0.6 });
  const iramaRef = useRef(0);
  const size = useThree((s) => s.size);
  const pelampung = useMemo(() => PELAMPUNG.map((_, i) => i), []);

  useFrame(({ clock, camera }, delta) => {
    const p = bacaProgres(progres, tenang);
    const t = tenang ? 0 : clock.elapsedTime;
    const dt = Math.min(delta, 0.1);
    const irama = mulus(0.12, 0.5, p);
    iramaRef.current = irama;
    for (let i = 0; i < JUMLAH; i++) {
      awak.current.fase[i] = t * 2.5 + (1 - irama) * (ACAK[i] * DUA_PI + Math.sin(t * 0.9 + i * 1.7) * 1.6);
    }
    // Belum seirama: perahu berputar. Seirama: haluan kembali lurus.
    const k = keadaan.current;
    if (tenang) k.yaw = 0;
    else {
      k.yaw += dt * (1 - irama) * 0.85;
      if (irama > 0.5) {
        const lurus = Math.round(k.yaw / DUA_PI) * DUA_PI;
        k.yaw += (lurus - k.yaw) * Math.min(1, dt * 2.6 * irama);
      }
    }
    const g = putar.current;
    if (g) {
      g.rotation.set(Math.sin(t * 1.2) * 0.03 * (1 + (1 - irama) * 2), k.yaw, Math.sin(t * 1.5) * 0.04 * (1 + (1 - irama)));
      g.position.y = 0.08 + Math.sin(t * 1.3) * 0.03;
    }
    jalan.current = mulus(0.42, 1, p) * PERJALANAN;
    ombak.current = jalan.current + t * 0.9 * irama;
    laju.current = mulus(0.45, 0.65, p);
    aturKamera(camera, size.width / Math.max(1, size.height), [0.6, 0.4, 0], [0.75, 0.62, 1.25], 3.1);
  });

  return (
    <>
      <CahayaMalam />
      <fog attach="fog" args={[W.kabut, 10, 26]} />
      <Laut jalan={ombak} tenang={tenang} />
      <group ref={putar}>
        <Perahu panjang={3.4} lebar={0.95} awak={JUMLAH} keadaan={awak} tenang={tenang} />
        <Buih panjangPerahu={3.4} laju={laju} />
      </group>
      <PanahPutar jari={2.3} kuat={() => 1 - mulus(0, 0.5, iramaRef.current)} tenang={tenang} />
      {pelampung.map((i) => <TiangPelampung key={i} indeks={i} jalan={jalan} lapis={lapis} />)}
      <Keterangan
        progres={progres}
        tenang={tenang}
        tahap={[
          { dari: 0, teks: "Belum seirama: perahu berputar" },
          { dari: 0.3, teks: "Pendayung mulai seirama" },
          { dari: 0.5, teks: "Seirama: perahu melaju" },
        ]}
      />
    </>
  );
}
