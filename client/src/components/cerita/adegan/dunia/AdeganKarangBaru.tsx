import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { Atmosfer, BolaDunia, Bongkah, Busur, CahayaMalam, Keterangan, LabelBola, RAD, TitikPanas, W, aturKamera, bacaProgres, campur, mulus, titikDunia } from "./bersama3d";

/**
 * Bagian 3 · Karang hari ini. Bola dunia berputar dari Atlantik ke Asia.
 * Dua karang lama (Amerika dan Uni Soviet) memudar, lalu titik panas menyala
 * satu per satu: Timur Tengah, Ukraina, Amerika dan Tiongkok. Terakhir simpul
 * teknologi (cip, AI, data, energi) tersambung dan menyala.
 */

const JARI = 2;
const PANAS = [
  { lon: 35, lat: 31.5, nama: "Timur Tengah", mulai: 0.22 },
  { lon: 32, lat: 49, nama: "Ukraina", mulai: 0.3 },
  { lon: -98, lat: 39, nama: "Amerika", mulai: 0.38 },
  { lon: 108, lat: 34, nama: "Tiongkok", mulai: 0.42 },
];
const TEKNOLOGI = [
  { lon: 121, lat: 23.7, nama: "Cip", mulai: 0.58 },
  { lon: -122, lat: 37.5, nama: "AI", mulai: 0.64 },
  { lon: 8, lat: 50, nama: "Data", mulai: 0.7 },
  { lon: 52, lat: 25, nama: "Energi", mulai: 0.76 },
];
const JARING: [number, number][] = [[0, 1], [0, 2], [2, 3], [3, 0], [1, 2]];
const LAMA = [
  { lon: -98, lat: 39 },
  { lon: 37.6, lat: 55.7 },
];

/** Karang lama: bongkah karang di permukaan bola yang tenggelam saat dunia menjadi ramai. */
function KarangLama({ lon, lat, nyala }: { lon: number; lat: number; nyala: () => number }) {
  const ref = useRef<THREE.Group>(null);
  const { posisi, putar } = useMemo(() => {
    const v = titikDunia(lon, lat, 1);
    return { posisi: v.clone().multiplyScalar(JARI), putar: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v) };
  }, [lon, lat]);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const n = nyala();
    g.visible = n > 0.01;
    g.scale.set(0.6 + 0.4 * n, Math.max(0.01, n), 0.6 + 0.4 * n);
  });
  return (
    <group position={posisi} quaternion={putar}>
      <group ref={ref}>
        <Bongkah p={[0, 0.16, 0]} s={[0.2, 0.26, 0.18]} biji={4} />
        <Bongkah p={[0.02, 0.42, 0]} s={[0.12, 0.2, 0.11]} r={[0, 1, 0]} biji={5} />
      </group>
    </group>
  );
}

export default function AdeganKarangBaru({ progres, lapis, tenang }: PropsAdegan3D) {
  const bola = useRef<THREE.Group>(null);
  const p = useRef(0);
  const size = useThree((s) => s.size);

  useFrame(({ clock, camera }) => {
    const pr = bacaProgres(progres, tenang);
    p.current = pr;
    const t = tenang ? 0 : clock.elapsedTime;
    const lon = campur(-30, 64, mulus(0.05, 0.9, pr)) + Math.sin(t * 0.15) * 3;
    const g = bola.current;
    if (g) g.rotation.set(campur(30, 24, pr) * RAD, -lon * RAD, 0);
    aturKamera(camera, size.width / Math.max(1, size.height), [0, -0.15, 0], [0, 0.12, 1], JARI * 1.32);
  });

  const nyalaSejak = (mulai: number) => () => mulus(mulai, mulai + 0.08, p.current);

  return (
    <>
      <CahayaMalam kuat={0.9} />
      <Atmosfer jari={JARI} />
      <group ref={bola}>
        <BolaDunia jari={JARI}>
          {LAMA.map((k, i) => (
            <KarangLama key={i} lon={k.lon} lat={k.lat} nyala={() => 1 - mulus(0.16, 0.3, p.current)} />
          ))}
          {PANAS.map((h) => (
            <TitikPanas key={h.nama} lon={h.lon} lat={h.lat} jari={JARI} nyala={nyalaSejak(h.mulai)} tenang={tenang} ukuran={1.25} />
          ))}
          <Busur a={[-98, 39]} b={[108, 34]} jari={JARI} progres={progres} tenang={tenang} rentang={[0.44, 0.56]} warna={W.panas} tinggi={0.28} tebal={0.01} />
          {TEKNOLOGI.map((s) => (
            <TitikPanas key={s.nama} lon={s.lon} lat={s.lat} jari={JARI} warna={W.hijauMuda} nyala={nyalaSejak(s.mulai)} tenang={tenang} ukuran={0.9} />
          ))}
          {JARING.map(([a, b], i) => (
            <Busur key={i} a={[TEKNOLOGI[a].lon, TEKNOLOGI[a].lat]} b={[TEKNOLOGI[b].lon, TEKNOLOGI[b].lat]} jari={JARI} progres={progres} tenang={tenang} rentang={[0.68 + i * 0.04, 0.86 + i * 0.03]} warna={W.hijauMuda} tinggi={0.22} tebal={0.008} />
          ))}
          <LabelBola lon={-98} lat={39} jari={JARI} angkat={0.75} tampil={() => p.current < 0.2} nada="emas">Dulu: Amerika</LabelBola>
          <LabelBola lon={37.6} lat={55.7} jari={JARI} angkat={0.75} tampil={() => p.current < 0.2} nada="emas">Dulu: Uni Soviet</LabelBola>
          {PANAS.map((h) => (
            <LabelBola key={h.nama} lon={h.lon} lat={h.lat} jari={JARI} angkat={h.nama === "Tiongkok" ? 0.5 : 0.28} tampil={() => p.current >= h.mulai + 0.04} nada="panas">{h.nama}</LabelBola>
          ))}
          {TEKNOLOGI.map((s) => (
            <LabelBola key={s.nama} lon={s.lon} lat={s.lat} jari={JARI} angkat={0.22} tampil={() => lapis >= 1 && p.current >= s.mulai + 0.04} nada="hijau">{s.nama}</LabelBola>
          ))}
          <TitikPanas lon={117} lat={-2} jari={JARI} warna={W.emas} nyala={() => (lapis >= 2 ? 1 : 0)} tenang={tenang} ukuran={1.1} />
          <LabelBola lon={117} lat={-2} jari={JARI} angkat={0.25} tampil={() => lapis >= 2} nada="emas">Indonesia: berlomba atau diatur?</LabelBola>
        </BolaDunia>
      </group>
      <Keterangan
        progres={progres}
        tenang={tenang}
        bawah={0.8}
        tahap={[
          { dari: 0, teks: "Dulu: dua karang besar" },
          { dari: 0.2, teks: "Kini: karang di banyak tempat" },
          { dari: 0.58, teks: "Perlombaan baru: teknologi" },
        ]}
      />
    </>
  );
}
