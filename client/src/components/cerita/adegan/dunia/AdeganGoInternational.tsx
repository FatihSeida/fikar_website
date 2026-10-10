import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { Atmosfer, BolaDunia, Busur, CahayaMalam, Keterangan, LabelBola, RAD, TitikPanas, W, aturKamera, bacaProgres, campur, mulus } from "./bersama3d";

/**
 * Bagian 10 · Melompat ke dunia. Dari Indonesia busur cahaya berangkat satu
 * per satu ke kampus, pusat riset, dan lembaga dunia. Setelah itu busur emas
 * kembali pulang dan Indonesia makin terang: kader pulang membawa pengetahuan.
 */

const JARI = 2;
const RUMAH: [number, number] = [110.4, -7.8];
const TUJUAN = [
  { lon: 4.5, lat: 52.2, nama: "Leiden", peran: "riset" },
  { lon: 139.7, lat: 35.7, nama: "Tokyo", peran: "kampus" },
  { lon: 31.2, lat: 30, nama: "Kairo", peran: "kampus" },
  { lon: 6.1, lat: 46.2, nama: "Jenewa", peran: "lembaga dunia" },
  { lon: 144.9, lat: -37.8, nama: "Melbourne", peran: "kampus" },
  { lon: -0.1, lat: 51.5, nama: "London", peran: "karya dibaca" },
  { lon: -71.1, lat: 42.4, nama: "Boston", peran: "riset" },
];

export default function AdeganGoInternational({ progres, lapis, tenang }: PropsAdegan3D) {
  const bola = useRef<THREE.Group>(null);
  const p = useRef(0);
  const size = useThree((s) => s.size);

  useFrame(({ clock, camera }) => {
    const pr = bacaProgres(progres, tenang);
    p.current = pr;
    const t = tenang ? 0 : clock.elapsedTime;
    // Berangkat: bola berputar ke barat mengikuti busur. Pulang: kembali menghadap Indonesia.
    const pergi = mulus(0.05, 0.5, pr);
    const pulang = mulus(0.58, 0.92, pr);
    const lon = campur(campur(112, 52, pergi), 108, pulang) + Math.sin(t * 0.15) * 2.5;
    const lat = campur(campur(4, 26, pergi), 6, pulang);
    const g = bola.current;
    if (g) g.rotation.set(lat * RAD, -lon * RAD, 0);
    aturKamera(camera, size.width / Math.max(1, size.height), [0, -0.1, 0], [0, 0.1, 1], JARI * 1.42);
  });

  return (
    <>
      <CahayaMalam kuat={0.9} />
      <Atmosfer jari={JARI} warna={W.emas} kuat={0.32} />
      <group ref={bola}>
        <BolaDunia jari={JARI}>
          <TitikPanas lon={RUMAH[0]} lat={RUMAH[1]} jari={JARI} warna={W.emas} nyala={() => 0.6 + 0.4 * mulus(0.6, 0.95, p.current)} tenang={tenang} ukuran={() => 1 + 1.2 * mulus(0.6, 0.95, p.current)} />
          {TUJUAN.map((d, i) => {
            const mulai = 0.08 + i * 0.05;
            return (
              <group key={d.nama}>
                <Busur a={RUMAH} b={[d.lon, d.lat]} jari={JARI} progres={progres} tenang={tenang} rentang={[mulai, mulai + 0.14]} warna={W.hijauMuda} tinggi={0.42} tebal={0.009} denyut={false} />
                <Busur a={[d.lon, d.lat]} b={RUMAH} jari={JARI} progres={progres} tenang={tenang} rentang={[0.6 + i * 0.03, 0.74 + i * 0.03]} warna={W.emas} tinggi={0.5} tebal={0.012} />
                <TitikPanas lon={d.lon} lat={d.lat} jari={JARI} warna={W.hijauMuda} nyala={() => mulus(mulai + 0.12, mulai + 0.16, p.current)} tenang={tenang} ukuran={0.7} />
                <LabelBola lon={d.lon} lat={d.lat} jari={JARI} angkat={0.2} tampil={() => lapis >= 1 && p.current > mulai + 0.14} nada="hijau">
                  {d.nama} · {d.peran}
                </LabelBola>
              </group>
            );
          })}
          <LabelBola lon={RUMAH[0]} lat={RUMAH[1]} jari={JARI} angkat={0.3} tampil={() => p.current < 0.12 || p.current > 0.78} nada="emas">
            {lapis >= 2 ? "Rumah yang rukun, tempat kembali" : "Indonesia"}
          </LabelBola>
        </BolaDunia>
      </group>
      <Keterangan
        progres={progres}
        tenang={tenang}
        bawah={0.8}
        tahap={[
          { dari: 0, teks: "Berangkat dari rumah yang rukun" },
          { dari: 0.12, teks: "Kader menembus kampus dan riset dunia" },
          { dari: 0.6, teks: "Lalu pulang membawa pengetahuan" },
        ]}
      />
    </>
  );
}
