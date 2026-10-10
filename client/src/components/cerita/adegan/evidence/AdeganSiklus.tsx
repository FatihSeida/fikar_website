import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PropsAdegan3D } from "../../kontrak";
import { AlasCahaya, Cahaya, Label, Silinder, WARNA, geo, lambert, pegas, rata, ruas, tepi, useBahanSendiri, useHurufSiap, useKamera, useKendali } from "./bersama3d";

/**
 * Bab 9 · Ekosistem berbasis bukti.
 * Cincin tiga simpul (Kaderisasi → Tata kelola → Kebijakan) dijahit benang emas
 * (identitas dokumen) dan terus berputar: organisasi belajar. Saat lapis kedua
 * dibuka, satu mata rantai putus, putarannya berhenti, dan semua mulai dari awal.
 */

const R = 1.75;
const DERAJAT = Math.PI / 180;
const SIMPUL = [
  { nama: "Kaderisasi", sudut: 90 * DERAJAT, warna: WARNA.hijau },
  { nama: "Tata kelola", sudut: -30 * DERAJAT, warna: WARNA.hijauMuda },
  { nama: "Kebijakan", sudut: -150 * DERAJAT, warna: WARNA.emas },
];
/** Mata rantai antarsimpul, searah jarum jam. Busur kedua yang putus. */
const BUSUR = [
  { dari: 90, ke: -30, isi: "jejak" },
  { dari: -30, ke: -150, isi: "pola" },
  { dari: -150, ke: -270, isi: "perbaikan" },
].map((b) => ({ ...b, dari: b.dari * DERAJAT, ke: b.ke * DERAJAT, tengah: ((b.dari + b.ke) / 2) * DERAJAT }));
const PUTUS = 1;

/** Busur cincin (boleh dililit benang heliks) sebagai kurva, supaya bisa digambar bertahap. */
class KurvaBusur extends THREE.Curve<THREE.Vector3> {
  constructor(private dari: number, private ke: number, private lilit = 0, private jarak = 0) {
    super();
  }
  getPoint(t: number, keluar = new THREE.Vector3()) {
    const a = this.dari + (this.ke - this.dari) * t;
    const putaran = a * this.lilit;
    const r = R + Math.cos(putaran) * this.jarak;
    return keluar.set(Math.cos(a) * r, Math.sin(a) * r, Math.sin(putaran) * this.jarak);
  }
}

const RANTAI = BUSUR.map((b) => ({
  ...b,
  cincin: new THREE.TubeGeometry(new KurvaBusur(b.dari, b.ke), 72, 0.075, 10, false),
  benang: new THREE.TubeGeometry(new KurvaBusur(b.dari, b.ke, 26, 0.14), 360, 0.016, 5, false),
}));
const geoManik = geo.bola;
const MANIK = 12;
const sementara = new THREE.Object3D();
const pudar = new THREE.Color(WARNA.pudar);

const geoPanah = new THREE.ConeGeometry(0.5, 1, 14);

/** Panah kecil di tengah mata rantai, menunjukkan arah siklus (searah jarum jam). */
function Panah({ sudut, bahan, k }: { sudut: number; bahan: THREE.Material; k: ReturnType<typeof useKendali> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const s = ruas(k.current.p, 0.62, 0.72);
    m.visible = s > 0.001;
    m.scale.set(0.24 * s, 0.32 * s, 0.24 * s);
  });
  // Arah searah jarum jam = turunan posisi terhadap sudut yang mengecil.
  const putar = Math.atan2(-Math.cos(sudut), Math.sin(sudut)) - Math.PI / 2;
  return <mesh ref={ref} geometry={geoPanah} material={bahan} position={[Math.cos(sudut) * R, Math.sin(sudut) * R, 0]} rotation={[0, 0, putar]} />;
}

function gambarBertahap(g: THREE.BufferGeometry, u: number) {
  const n = g.index ? g.index.count : 0;
  g.setDrawRange(0, Math.floor((n * u) / 3) * 3);
}

export default function AdeganSiklus(props: PropsAdegan3D) {
  const k = useKendali(props);
  const siap = useHurufSiap();
  useKamera([0, -0.3, 0], [0, 0.22, 1], 5.9, 5.8);

  const putus = useRef<THREE.Group>(null);
  const simpul = useRef<(THREE.Group | null)[]>([]);
  const manik = useRef<THREE.InstancedMesh>(null);
  const aliran = useRef(0);
  const bahanPutus = useBahanSendiri(() => new THREE.MeshLambertMaterial({ color: WARNA.gading, toneMapped: false }));
  const benangPutus = useBahanSendiri(() => new THREE.MeshBasicMaterial({ color: WARNA.emas, toneMapped: false }));
  const warnaCincin = new THREE.Color(WARNA.gading);
  const warnaBenang = new THREE.Color(WARNA.emas);

  useFrame(() => {
    const { p, l1, dt } = k.current;
    const henti = l1;
    // Putaran siklus (manik yang beredar) melambat sampai berhenti saat mata rantai putus.
    aliran.current += dt * 0.5 * (1 - henti);

    SIMPUL.forEach((_, i) => {
      const g = simpul.current[i];
      if (!g) return;
      const s = pegas(ruas(p, i * 0.05, i * 0.05 + 0.1));
      g.visible = s > 0.001;
      g.scale.setScalar(s);
    });
    RANTAI.forEach((r, i) => {
      gambarBertahap(r.cincin, ruas(p, 0.1 + i * 0.09, 0.19 + i * 0.09));
      gambarBertahap(r.benang, ruas(p, 0.4 + i * 0.07, 0.47 + i * 0.07));
    });

    if (putus.current) {
      const b = RANTAI[PUTUS].tengah;
      putus.current.position.set(Math.cos(b) * 0.5 * henti, Math.sin(b) * 0.5 * henti, 0.15 * henti);
      putus.current.rotation.z = 0.22 * henti;
    }
    bahanPutus.color.copy(warnaCincin).lerp(pudar, henti);
    benangPutus.color.copy(warnaBenang).lerp(pudar, henti);

    const m = manik.current;
    if (m) {
      const muncul = ruas(p, 0.6, 0.7);
      for (let i = 0; i < MANIK; i++) {
        const sudut = BUSUR[0].dari - (i / MANIK) * Math.PI * 2 - aliran.current - p * 1.6;
        // Manik di mata rantai yang putus ikut hilang.
        const a = ((((BUSUR[0].dari - sudut) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
        const diPutus = a > 1 / 3 && a < 2 / 3 ? henti : 0;
        sementara.position.set(Math.cos(sudut) * R, Math.sin(sudut) * R, 0);
        sementara.scale.setScalar(0.2 * muncul * (1 - diPutus));
        sementara.updateMatrix();
        m.setMatrixAt(i, sementara.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <Cahaya />
      <AlasCahaya p={[0, -2.6, -0.4]} ukuran={7} kuat={0.22} />
      <group rotation={[-0.5, 0, 0]}>
        <group>
          {RANTAI.map((r, i) =>
            i === PUTUS ? (
              <group key={i} ref={putus}>
                <mesh geometry={r.cincin} material={bahanPutus} />
                <mesh geometry={r.benang} material={benangPutus} />
                <Panah sudut={r.tengah} bahan={benangPutus} k={k} />
              </group>
            ) : (
              <group key={i}>
                <mesh geometry={r.cincin} material={lambert(WARNA.gading)} />
                <mesh geometry={r.benang} material={rata(WARNA.emas)} />
                <Panah sudut={r.tengah} bahan={rata(WARNA.emas)} k={k} />
              </group>
            ),
          )}
          <instancedMesh ref={manik} args={[geoManik, rata(WARNA.gading), MANIK]} frustumCulled={false} />
          {SIMPUL.map((s, i) => (
            <group key={s.nama} ref={(g) => { simpul.current[i] = g; }} position={[Math.cos(s.sudut) * R, Math.sin(s.sudut) * R, 0]}>
              <Silinder s={[0.66, 0.36, 0.66]} r={[Math.PI / 2, 0, 0]} bahan={lambert(s.warna)} garis={tepi(WARNA.emas, 0.7)} />
            </group>
          ))}
          {siap &&
            SIMPUL.map((s, i) => (
              <Label key={s.nama} teks={s.nama} k={k} muncul={(st) => ruas(st.p, i * 0.05 + 0.04, i * 0.05 + 0.12)} p={[Math.cos(s.sudut) * (R + 0.72), Math.sin(s.sudut) * (R + 0.55), 0.3]} tinggi={0.34} gaya={{ ukuran: 42, warna: i === 2 ? WARNA.emas : WARNA.gading }} />
            ))}
          {siap &&
            RANTAI.map((r, i) => (
              <Label key={r.isi} teks={r.isi} k={k} muncul={(st) => st.l2 * (i === PUTUS ? 1 - st.l1 * 0.6 : 1)} p={[Math.cos(r.tengah) * (R - 0.66), Math.sin(r.tengah) * (R - 0.66), 0.2]} tinggi={0.26} gaya={{ ukuran: 40, latar: null, warna: WARNA.emas, serif: true, tebal: 400 }} />
            ))}
        </group>
      </group>
      {siap && (
        <>
          <Label teks={"organisasi\nterus belajar"} k={k} muncul={(st) => ruas(st.p, 0.7, 0.8) * (1 - st.l1)} p={[0, -0.1, 0]} tinggi={0.62} gaya={{ ukuran: 44, latar: null, serif: true, warna: WARNA.gading }} />
          <Label teks={"berhenti belajar,\nmulai dari awal"} k={k} muncul={(st) => st.l1} p={[0, -0.1, 0]} tinggi={0.62} gaya={{ ukuran: 44, latar: null, serif: true, warna: WARNA.peringatan }} />
          <Label teks="benang emas: identitas dokumen" k={k} muncul={(st) => ruas(st.p, 0.55, 0.65) * (1 - st.l1)} p={[0, -2.95, 0]} tinggi={0.32} gaya={{ ukuran: 40, warna: WARNA.emas }} />
          <Label teks="mata rantai putus" k={k} muncul={(st) => ruas(st.l1, 0.5, 1)} p={[0, -2.95, 0]} tinggi={0.32} gaya={{ ukuran: 40, warna: WARNA.peringatan, garis: "rgba(227,155,75,0.8)" }} />
        </>
      )}
    </>
  );
}
