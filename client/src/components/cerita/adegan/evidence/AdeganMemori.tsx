import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { AlasCahaya, Cahaya, Label, WARNA, geo, geoTepi, lambert, lepas, rata, ruas, tepi, useHurufSiap, useKamera, useKendali } from "./bersama3d";

/**
 * Bab 5 · Memori berjenjang.
 * Piramida empat tingkat (Komisariat, Cabang, Badko, PB) tersusun dari bawah.
 * Butiran dokumen melompat naik dari tingkat ke tingkat di sisi kiri, lalu
 * gambaran emas mengalir kembali turun sampai ke komisariat di sisi kanan.
 */

const TEBAL = 0.3;
const TINGKAT = [
  { nama: "Komisariat", peran: "menyimpan", ukuran: 4.0, y: 0, warna: "#0E8A4F" },
  { nama: "Cabang", peran: "menghimpun", ukuran: 3.0, y: 0.95, warna: "#2B9C63" },
  { nama: "Badko", peran: "membaca pola", ukuran: 2.0, y: 1.9, warna: "#62B486" },
  { nama: "PB", peran: "gambaran nasional", ukuran: 1.05, y: 2.85, warna: "#DCC38A" },
];
const muncul = (i: number) => (i === 0 ? [-0.12, 0] : [(i - 1) * 0.07, (i - 1) * 0.07 + 0.11]);

/** Titik pijak di setiap tingkat untuk butiran yang melompat (sisi kiri naik, kanan turun). */
function pijakan(sisi: 1 | -1) {
  return TINGKAT.map((t, i) => {
    const atas = TINGKAT[i + 1];
    const x = atas ? (t.ukuran / 2 + atas.ukuran / 2) / 2 : t.ukuran / 4;
    return new THREE.Vector3(sisi * x, t.y + TEBAL / 2 + 0.05, 0);
  });
}
const PIJAK_KIRI = pijakan(-1);
const PIJAK_KANAN = pijakan(1);

const JUMLAH = 30;
const ACAK = Array.from({ length: JUMLAH }, (_, i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
});

/** Lembar dokumen kecil yang tergeletak di pinggir tingkat komisariat. */
const LEMBAR = Array.from({ length: 22 }, (_, i) => {
  const sisi = i % 4;
  const u = (ACAK[i % JUMLAH] - 0.5) * 3.4;
  const r = 1.75;
  const [x, z] = sisi === 0 ? [u, r] : sisi === 1 ? [r, u] : sisi === 2 ? [u, -r] : [-r, u];
  return { x, z, putar: ACAK[(i * 7) % JUMLAH] * Math.PI };
});

const sementara = new THREE.Object3D();
const titik = new THREE.Vector3();

/** Posisi butiran pada lintasan lompat: dari pijakan ke pijakan dengan lengkung kecil. */
function lompat(jalur: THREE.Vector3[], fase: number, z: number, keluar: THREE.Vector3) {
  const lompatan = jalur.length - 1;
  const f = Math.min(fase * lompatan, lompatan - 1e-6);
  const i = Math.floor(f);
  const s = f - i;
  keluar.copy(jalur[i]).lerp(jalur[i + 1], s);
  keluar.y += Math.sin(s * Math.PI) * 0.42;
  keluar.z = z;
  return keluar;
}

export default function AdeganMemori(props: PropsAdegan3D) {
  const k = useKendali(props);
  const siap = useHurufSiap();
  useKamera([0, 1.6, 0], [0.18, 0.5, 1], 6.3, 4.5);

  const tingkat = useRef<(THREE.Group | null)[]>([]);
  const naik = useRef<THREE.InstancedMesh>(null);
  const turun = useRef<THREE.InstancedMesh>(null);
  const lembar = useRef<THREE.InstancedMesh>(null);
  const jalurTurun = useMemo(() => [...PIJAK_KANAN].reverse(), []);

  useLayoutEffect(() => {
    const m = lembar.current;
    if (!m) return;
    LEMBAR.forEach((l, i) => {
      sementara.position.set(l.x, TEBAL / 2 + 0.012, l.z);
      sementara.rotation.set(0, l.putar, 0);
      sementara.scale.set(0.2, 0.02, 0.26);
      sementara.updateMatrix();
      m.setMatrixAt(i, sementara.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    const { p, t } = k.current;
    TINGKAT.forEach((_, i) => {
      const g = tingkat.current[i];
      if (!g) return;
      const [a, b] = muncul(i);
      const u = lepas(ruas(p, a, b));
      g.visible = u > 0.001;
      g.position.y = TINGKAT[i].y - (1 - u) * 1.2;
      g.scale.setScalar(0.7 + 0.3 * u);
    });
    const kuatNaik = ruas(p, 0.28, 0.4);
    const kuatTurun = ruas(p, 0.55, 0.68);
    const isi = (m: THREE.InstancedMesh | null, jalur: THREE.Vector3[], kuat: number, laju: number, geser: number) => {
      if (!m) return;
      m.visible = kuat > 0.001;
      for (let i = 0; i < JUMLAH; i++) {
        const fase = (t * laju + i / JUMLAH + geser) % 1;
        const z = (ACAK[(i * 3 + 1) % JUMLAH] - 0.5) * 0.9;
        lompat(jalur, fase, z, titik);
        const ujung = Math.min(1, fase / 0.06, (1 - fase) / 0.06);
        sementara.position.copy(titik);
        sementara.rotation.set(0, fase * 4, 0);
        sementara.scale.setScalar(0.1 * kuat * ujung);
        sementara.updateMatrix();
        m.setMatrixAt(i, sementara.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    };
    isi(naik.current, PIJAK_KIRI, kuatNaik, 0.07, 0);
    isi(turun.current, jalurTurun, kuatTurun, 0.07, 0.5);
  });

  return (
    <>
      <Cahaya />
      <AlasCahaya p={[0, -0.2, 0]} ukuran={9} />
      <group rotation={[0, 0.12, 0]}>
        {TINGKAT.map((t, i) => (
          <group key={t.nama} ref={(g) => { tingkat.current[i] = g; }}>
            <mesh geometry={geo.kotak} material={lambert(t.warna)} scale={[t.ukuran, TEBAL, t.ukuran]} />
            <lineSegments geometry={geoTepi.kotak} material={tepi(WARNA.emas, 0.55)} scale={[t.ukuran, TEBAL, t.ukuran]} />
            {i === 0 && <instancedMesh ref={lembar} args={[geo.kotak, lambert(WARNA.gading), LEMBAR.length]} frustumCulled={false} />}
          </group>
        ))}
        <instancedMesh ref={naik} args={[geo.kotak, rata(WARNA.gading), JUMLAH]} frustumCulled={false} />
        <instancedMesh ref={turun} args={[geo.bola, rata(WARNA.emas), JUMLAH]} frustumCulled={false} />
        {siap && (
          <>
            {TINGKAT.map((t, i) => {
              const [a, b] = muncul(i);
              return (
                <group key={t.nama}>
                  <Label teks={t.nama} k={k} muncul={(s) => (1 - s.l2) * ruas(s.p, a + 0.05, b + 0.03)} p={[0, t.y, t.ukuran / 2 + 0.05]} tinggi={0.32} gaya={{ ukuran: 42, warna: i === 3 ? WARNA.emas : WARNA.gading }} />
                  <Label teks={`${t.nama}: ${t.peran}`} k={k} muncul={(s) => s.l2 * ruas(s.p, a + 0.05, b + 0.03)} p={[0, t.y, t.ukuran / 2 + 0.05]} tinggi={0.32} gaya={{ ukuran: 42, warna: i === 3 ? WARNA.emas : WARNA.gading }} />
                </group>
              );
            })}
            <Label teks="dihimpun ke atas" k={k} muncul={(s) => ruas(s.p, 0.3, 0.42)} p={[-2.2, 2.2, 0]} tinggi={0.32} gaya={{ ukuran: 40 }} />
            <Label teks="kembali ke bawah" k={k} muncul={(s) => ruas(s.p, 0.57, 0.7)} p={[2.2, 2.2, 0]} tinggi={0.32} gaya={{ ukuran: 40, warna: WARNA.emas }} />
          </>
        )}
      </group>
      {siap && (
        <>
          {["1  Manfaat datang dulu", "2  Standar di belakang", "3  Mengalir ke bawah"].map((teks, i) => (
            <Label key={teks} teks={teks} k={k} muncul={(s) => s.l1 * ruas(s.p, 0.2 + i * 0.03, 0.3 + i * 0.03)} p={[-2.75, 3.75 - i * 0.4, 0]} tinggi={0.28} jangkar="kiri" gaya={{ ukuran: 40, warna: WARNA.gading }} />
          ))}
        </>
      )}
    </>
  );
}
