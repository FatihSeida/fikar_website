import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { AlasCahaya, Cahaya, Kotak, Label, Silinder, WARNA, geo, halus, lambert, lepas, rata, ruas, tepi, useBahanSendiri, useHurufSiap, useKamera, useKendali } from "./bersama3d";

/**
 * Bab 6 · Membaca perjalanan kader.
 * Jalur dengan empat stasiun (Daftar LK, LK 1, Pengurus, LK 2). Titik-titik
 * kader berjalan bersama; sebagian berhenti di tengah jalan dan memudar di
 * pinggir jalur, sehingga terlihat di titik mana kader paling banyak berhenti.
 */

const KURVA = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.9, 0, 1.5),
  new THREE.Vector3(-1.6, 0, 1.15),
  new THREE.Vector3(-0.5, 0, 0.35),
  new THREE.Vector3(0.6, 0, 0.05),
  new THREE.Vector3(1.7, 0, -0.75),
  new THREE.Vector3(2.9, 0, -1.15),
]);
const STASIUN = [
  { u: 0, nama: "Daftar LK", dokumen: "formulir" },
  { u: 0.34, nama: "LK 1", dokumen: "sertifikat LK 1" },
  { u: 0.67, nama: "Pengurus", dokumen: "SK komisariat" },
  { u: 1, nama: "LK 2", dokumen: "sertifikat LK 2" },
].map((s) => ({ ...s, titik: KURVA.getPointAt(s.u) }));

const ATAS = new THREE.Vector3(0, 1, 0);
function samping(u: number, keluar: THREE.Vector3) {
  return keluar.copy(KURVA.getTangentAt(Math.min(0.999, Math.max(0.001, u)))).cross(ATAS).normalize();
}

/** Pita jalan datar beserta dua garis tepinya, digambar bertahap. */
function buatJalan() {
  const N = 160;
  const lebar = 0.15;
  const posisi: number[] = [];
  const tepiKiri: number[] = [];
  const tepiKanan: number[] = [];
  const indeks: number[] = [];
  const s = new THREE.Vector3();
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const t = KURVA.getPointAt(u);
    samping(u, s);
    posisi.push(t.x + s.x * lebar, 0.01, t.z + s.z * lebar, t.x - s.x * lebar, 0.01, t.z - s.z * lebar);
    tepiKiri.push(t.x + s.x * lebar, 0.02, t.z + s.z * lebar);
    tepiKanan.push(t.x - s.x * lebar, 0.02, t.z - s.z * lebar);
    if (i < N) {
      const a = i * 2;
      indeks.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const pita = new THREE.BufferGeometry();
  pita.setAttribute("position", new THREE.Float32BufferAttribute(posisi, 3));
  pita.setIndex(indeks);
  pita.computeVertexNormals();
  const garis = [tepiKiri, tepiKanan].map((t) => new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(t, 3)));
  return { pita, garis, jumlahIndeks: indeks.length, jumlahTitik: N + 1 };
}
const JALAN = buatJalan();

// Stasiun terakhir yang dicapai setiap kader: 5 berhenti sebelum LK 1, 9 sesudah LK 1
// (paling banyak), 4 sesudah menjadi pengurus, 6 sampai LK 2. Ini gambaran, bukan data.
const SAMPAI = [1, 3, 0, 1, 2, 1, 3, 0, 1, 1, 2, 3, 0, 1, 3, 2, 1, 0, 1, 3, 2, 1, 0, 3];
function acak(i: number) {
  const x = Math.sin(i * 78.233 + 1.7) * 43758.5453;
  return x - Math.floor(x);
}
const KADER = SAMPAI.map((sampai, i) => {
  const jeda = i * 0.025;
  const awal = new THREE.Vector3();
  // Antre di sekitar stasiun pertama sebelum berangkat.
  const sudut = (i / SAMPAI.length) * Math.PI * 2;
  awal.set(STASIUN[0].titik.x - 0.35 + Math.cos(sudut) * (0.25 + acak(i) * 0.3), 0.1, STASIUN[0].titik.z + 0.15 + Math.sin(sudut) * (0.22 + acak(i + 9) * 0.25));
  let berhentiU = 1;
  const akhir = new THREE.Vector3();
  if (sampai < 3) {
    const a = STASIUN[sampai].u;
    const b = STASIUN[sampai + 1].u;
    berhentiU = a + (b - a) * (0.3 + acak(i + 3) * 0.4);
    const s = samping(berhentiU, new THREE.Vector3());
    const sisi = i % 2 ? 1 : -1;
    akhir.copy(KURVA.getPointAt(berhentiU)).addScaledVector(s, sisi * (0.34 + acak(i + 5) * 0.22));
  } else {
    const sudutAkhir = acak(i + 11) * Math.PI * 2;
    akhir.copy(STASIUN[3].titik).add(new THREE.Vector3(Math.cos(sudutAkhir) * 0.34, 0, 0.62 + Math.sin(sudutAkhir) * 0.2));
  }
  akhir.y = 0.1;
  return { sampai, jeda, awal, berhentiU, akhir, goyang: (acak(i + 7) - 0.5) * 0.1 };
});
const JEDA_MAKS = (SAMPAI.length - 1) * 0.025;

/** Pusat kelompok kader yang berhenti sesudah LK 1 (penurunan terbesar). */
const PUSAT_TERBANYAK = KADER.filter((k) => k.sampai === 1)
  .reduce((j, k) => j.add(k.akhir), new THREE.Vector3())
  .divideScalar(KADER.filter((k) => k.sampai === 1).length);

const WARNA_JALAN = new THREE.Color(WARNA.gading);
const WARNA_BERHENTI = new THREE.Color("#6F8278");
const WARNA_SAMPAI = new THREE.Color(WARNA.emas);
const sementara = new THREE.Object3D();
const titik = new THREE.Vector3();
const arahSamping = new THREE.Vector3();
const warna = new THREE.Color();
const geoCincin = new THREE.RingGeometry(0.62, 0.7, 48);

export default function AdeganKaderisasi(props: PropsAdegan3D) {
  const k = useKendali(props);
  const siap = useHurufSiap();
  useKamera([-0.1, 0.4, 0.15], [0.1, 0.9, 1], 7.0, 4.6);

  const kader = useRef<THREE.InstancedMesh>(null);
  const stasiun = useRef<(THREE.Group | null)[]>([]);
  const cincin = useRef<THREE.Mesh>(null);
  const bahanCincin = useBahanSendiri(() => new THREE.MeshBasicMaterial({ color: WARNA.peringatan, transparent: true, depthWrite: false, toneMapped: false }));
  const bahanPita = useMemo(() => lambert("#24503D"), []);
  const garisJalan = useMemo(() => JALAN.garis.map((g) => new THREE.Line(g, tepi(WARNA.emas, 0.6))), []);

  useFrame(() => {
    const { p } = k.current;
    const gambar = ruas(p, 0, 0.16);
    JALAN.pita.setDrawRange(0, Math.floor((JALAN.jumlahIndeks * gambar) / 6) * 6);
    JALAN.garis.forEach((g) => g.setDrawRange(0, Math.floor(JALAN.jumlahTitik * gambar)));
    STASIUN.forEach((s, i) => {
      const g = stasiun.current[i];
      if (!g) return;
      const u = lepas(ruas(gambar, s.u - 0.05, s.u + 0.05));
      g.visible = u > 0.001;
      g.scale.setScalar(0.4 + 0.6 * u);
    });

    const m = kader.current;
    if (m) {
      const jalan = ruas(p, 0.16, 0.86) * (1 + JEDA_MAKS);
      KADER.forEach((d, i) => {
        const u = jalan - d.jeda;
        let pudar = 0;
        if (u <= 0) titik.copy(d.awal);
        else {
          const uJalan = Math.min(u, d.berhentiU);
          titik.copy(KURVA.getPointAt(Math.min(1, uJalan)));
          titik.addScaledVector(samping(uJalan, arahSamping), d.goyang);
          titik.y = 0.1;
          // Sesaat setelah berangkat, kader bergeser dari antrean ke jalur.
          const berangkat = halus(ruas(u, 0, 0.04));
          titik.lerp(d.awal, 1 - berangkat);
          const minggir = halus(ruas(u, d.berhentiU, d.berhentiU + 0.06));
          titik.lerp(d.akhir, minggir);
          pudar = minggir;
        }
        sementara.position.copy(titik);
        sementara.scale.setScalar(0.2);
        sementara.updateMatrix();
        m.setMatrixAt(i, sementara.matrix);
        warna.copy(WARNA_JALAN).lerp(d.sampai === 3 ? WARNA_SAMPAI : WARNA_BERHENTI, pudar);
        m.setColorAt(i, warna);
      });
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }

    const sorot = ruas(p, 0.86, 0.95);
    if (cincin.current) {
      cincin.current.visible = sorot > 0.001;
      cincin.current.scale.setScalar(0.6 + 0.4 * lepas(sorot));
    }
    bahanCincin.opacity = sorot;
  });

  return (
    <>
      <Cahaya />
      <AlasCahaya p={[0, -0.01, 0.1]} ukuran={10} />
      <mesh geometry={JALAN.pita} material={bahanPita} />
      {garisJalan.map((g, i) => <primitive key={i} object={g} />)}
      {STASIUN.map((s, i) => (
        <group key={s.nama} ref={(g) => { stasiun.current[i] = g; }} position={[s.titik.x, 0, s.titik.z]}>
          <Silinder p={[0, 0.06, 0]} s={[0.78, 0.12, 0.78]} bahan={lambert(i === 3 ? WARNA.emas : WARNA.emasTua)} garis={tepi(WARNA.gelap, 0.5)} />
          <Kotak p={[0, 0.38, -0.2]} s={[0.32, 0.42, 0.03]} r={[-0.1, 0, 0]} bahan={lambert(WARNA.kertas)} garis={tepi(WARNA.gelap, 0.5)} />
          <Kotak p={[0, 0.48, -0.18]} s={[0.2, 0.03, 0.01]} r={[-0.1, 0, 0]} bahan={rata(WARNA.hijau)} garis={null} />
        </group>
      ))}
      <instancedMesh ref={kader} args={[geo.bola, lambert("#FFFFFF"), KADER.length]} frustumCulled={false} />
      <mesh ref={cincin} geometry={geoCincin} material={bahanCincin} rotation={[-Math.PI / 2, 0, 0]} position={[PUSAT_TERBANYAK.x, 0.03, PUSAT_TERBANYAK.z]} />
      {siap && (
        <>
          {STASIUN.map((s, i) => (
            <group key={s.nama}>
              <Label teks={s.nama} k={k} muncul={(st) => ruas(st.p, s.u * 0.16 - 0.01, s.u * 0.16 + 0.04)} p={[s.titik.x, 1.45, s.titik.z - 0.2]} tinggi={0.34} gaya={{ ukuran: 42, warna: i === 3 ? WARNA.emas : WARNA.gading }} />
              <Label teks={s.dokumen} k={k} muncul={(st) => st.l1} p={[s.titik.x, 0.98, s.titik.z - 0.2]} tinggi={0.25} gaya={{ ukuran: 40, latar: null, warna: WARNA.emas }} />
            </group>
          ))}
          {STASIUN.slice(0, 3).map((s, i) => {
            const tengah = KURVA.getPointAt((s.u + STASIUN[i + 1].u) / 2);
            return <Label key={s.nama} teks="jarak waktu" k={k} muncul={(st) => st.l2} p={[tengah.x, 0.14, tengah.z]} tinggi={0.24} gaya={{ ukuran: 40, warna: WARNA.gading, garis: "rgba(246,244,233,0.4)" }} />;
          })}
          <Label teks="paling banyak berhenti di sini" k={k} muncul={(st) => ruas(st.p, 0.88, 0.96)} p={[PUSAT_TERBANYAK.x, 0.15, PUSAT_TERBANYAK.z + 1.05]} tinggi={0.32} gaya={{ ukuran: 40, warna: WARNA.peringatan, garis: "rgba(227,155,75,0.8)" }} />
          <Label teks="dibaca dari dokumen yang sudah ada" k={k} muncul={(st) => st.l1} p={[-1.9, 0.1, -2.0]} tinggi={0.3} gaya={{ ukuran: 40 }} />
        </>
      )}
    </>
  );
}
