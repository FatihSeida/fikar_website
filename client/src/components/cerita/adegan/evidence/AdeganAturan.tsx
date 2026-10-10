import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SANS, tekstur } from "@/components/bangun/dasar";
import type { PropsAdegan3D } from "../../kontrak";
import { AlasCahaya, Cahaya, Kotak, Label, WARNA, geo, geoTepi, lambert, lepas, ruas, tepi, useBahanSendiri, useHurufSiap, useKamera, useKendali } from "./bersama3d";

/**
 * Bab 1 · Kaya aturan, miskin ingatan.
 * Buku aturan jatuh satu per satu menjadi tumpukan tinggi, sementara map di
 * lemari arsip di sebelahnya memudar sampai raknya kosong.
 */

const LEBAR_BUKU = 2.5;
const DALAM_BUKU = 1.7;
const X_BUKU = -1.6;
const X_RAK = 1.75;

const BUKU = [
  { judul: "Anggaran Dasar", warna: "#0E8A4F", tulisan: "#F6F4E9", tebal: 0.42, putar: 0.05, geser: 0 },
  { judul: "Anggaran Rumah Tangga", warna: "#E9E1CB", tulisan: "#0B2A1E", tebal: 0.4, putar: -0.05, geser: 0.07 },
  { judul: "Pedoman Perkaderan", warna: "#C9A866", tulisan: "#0B2A1E", tebal: 0.5, putar: 0.07, geser: -0.06 },
  { judul: "Program Kerja Nasional", warna: "#17583A", tulisan: "#DCC38A", tebal: 0.38, putar: -0.06, geser: 0.08 },
  { judul: "Rekomendasi Kongres", warna: "#F2EEE2", tulisan: "#0E8A4F", tebal: 0.36, putar: 0.03, geser: -0.03 },
  { judul: "Hasil Kongres XXXII", warna: "#A9824A", tulisan: "#F6F4E9", tebal: 0.44, putar: -0.04, geser: 0.04 },
];
const TINGGI_TUMPUKAN = BUKU.reduce((j, b) => j + b.tebal, 0);

/** Punggung buku: warna sampul, dua pita tipis, dan judul berhuruf kapital. */
function teksturPunggung(judul: string, latar: string, warna: string, aspek: number) {
  const w = 1024;
  const h = Math.round(w / aspek);
  return tekstur(`punggung|${judul}|${latar}|${w}x${h}`, w, h, (ctx) => {
    ctx.fillStyle = latar;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = warna;
    ctx.globalAlpha = 0.55;
    for (const x of [40, 58, w - 64, w - 46]) ctx.fillRect(x, 10, 6, h - 20);
    ctx.globalAlpha = 1;
    // Huruf diperkecil bila judul terlalu panjang untuk punggung buku.
    let ukuran = Math.round(h * 0.4);
    const atur = () => {
      ctx.font = `500 ${ukuran}px ${SANS}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${Math.round(ukuran * 0.15)}px`;
    };
    atur();
    while (ukuran > 12 && ctx.measureText(judul.toUpperCase()).width > w - 170) {
      ukuran -= 2;
      atur();
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(judul.toUpperCase(), w / 2, h / 2 + h * 0.03);
  });
}

function Buku({ data, siap }: { data: (typeof BUKU)[number]; siap: boolean }) {
  const bahan = useMemo(() => {
    const halaman = lambert("#F1ECDD");
    const sampul = lambert(data.warna);
    // Urutan sisi kotak: +x, -x, +y, -y, +z (punggung), -z.
    return [halaman, halaman, sampul, sampul, sampul, halaman];
  }, [data.warna]);
  const punggung = siap ? teksturPunggung(data.judul, data.warna, data.tulisan, LEBAR_BUKU / data.tebal) : null;
  const bahanPunggung = useBahanSendiri(() => (punggung ? new THREE.MeshBasicMaterial({ map: punggung, toneMapped: false }) : null), [punggung]);
  return (
    <>
      <mesh geometry={geo.kotak} material={bahan} scale={[LEBAR_BUKU, data.tebal, DALAM_BUKU]} />
      <lineSegments geometry={geoTepi.kotak} material={tepi(WARNA.gelap, 0.5)} scale={[LEBAR_BUKU, data.tebal, DALAM_BUKU]} />
      {bahanPunggung && <mesh geometry={geo.bidang} material={bahanPunggung} position={[0, 0, DALAM_BUKU / 2 + 0.002]} scale={[LEBAR_BUKU - 0.02, data.tebal - 0.02, 1]} />}
    </>
  );
}

// Lemari arsip: tiga ruang, masing-masing berisi lima map.
const RAK = { lebar: 2.3, tinggi: 2.9, dalam: 1.3, papan: 0.07 };
const RUANG = [0.07, 1.01, 1.96];
const WARNA_MAP = ["#F6F4E9", "#DCC38A", "#3FAE76", "#E7DDC4", "#B08D4F"];
const MAP = Array.from({ length: 15 }, (_, i) => {
  const ruang = Math.floor(i / 5);
  const urut = i % 5;
  return {
    x: X_RAK - RAK.lebar / 2 + 0.3 + urut * 0.36 + (ruang === 1 ? 0.12 : 0),
    y: RUANG[ruang] + 0.37,
    miring: urut === 4 ? -0.22 : urut === 3 && ruang === 2 ? -0.12 : 0,
    warna: WARNA_MAP[(i * 3 + ruang) % WARNA_MAP.length],
    // Urutan memudar diacak supaya terasa seperti ingatan yang hilang sedikit demi sedikit.
    giliran: [3, 9, 0, 12, 6, 14, 1, 10, 4, 7, 13, 2, 8, 11, 5][i],
  };
});

export default function AdeganAturan(props: PropsAdegan3D) {
  const k = useKendali(props);
  const siap = useHurufSiap();
  useKamera([0, 1.75, 0], [0.28, 0.34, 1], 6.1, 4.0);

  const buku = useRef<(THREE.Group | null)[]>([]);
  const map = useRef<(THREE.Mesh | null)[]>([]);
  const bahanMap = useBahanSendiri(() => MAP.map((m) => new THREE.MeshLambertMaterial({ color: m.warna, transparent: true, toneMapped: false })));
  const bahanRak = useBahanSendiri(() => new THREE.MeshLambertMaterial({ color: WARNA.hutan, transparent: true, toneMapped: false }));
  const garisRak = useBahanSendiri(() => new THREE.LineBasicMaterial({ color: WARNA.emas, transparent: true, opacity: 0.6, toneMapped: false }));
  const garisMap = tepi(WARNA.gelap, 0.4);

  useFrame(() => {
    const { p } = k.current;
    let y = 0;
    BUKU.forEach((b, i) => {
      const g = buku.current[i];
      const mulai = 0.02 + i * 0.075;
      const t = lepas(ruas(p, mulai, mulai + 0.14));
      if (g) {
        g.visible = t > 0.001;
        g.position.set(X_BUKU + b.geser, y + b.tebal / 2 + (1 - t) * 4.2, 0);
        g.rotation.set(0, b.putar, (1 - t) * (i % 2 ? 0.3 : -0.3));
      }
      y += b.tebal;
    });
    MAP.forEach((m, i) => {
      const mesh = map.current[i];
      const mulai = 0.22 + m.giliran * 0.04;
      const t = ruas(p, mulai, mulai + 0.09);
      bahanMap[i].opacity = 1 - t;
      if (mesh) {
        mesh.visible = t < 0.999;
        mesh.position.y = m.y - t * 0.12;
        mesh.scale.y = 1 - t * 0.2;
      }
    });
    const pudar = ruas(p, 0.35, 0.9);
    bahanRak.opacity = 1 - pudar * 0.5;
    garisRak.opacity = 0.6 - pudar * 0.32;
  });

  const papan = (key: string, p: [number, number, number], s: [number, number, number]) => <Kotak key={key} p={p} s={s} bahan={bahanRak} garis={garisRak} />;
  const { lebar, tinggi, dalam, papan: t } = RAK;

  return (
    <>
      <Cahaya />
      <AlasCahaya p={[0, 0.002, 0.2]} ukuran={9.5} />
      {BUKU.map((b, i) => (
        <group key={b.judul} ref={(g) => { buku.current[i] = g; }}>
          <Buku data={b} siap={siap} />
        </group>
      ))}
      <group>
        {papan("belakang", [X_RAK, tinggi / 2, -dalam / 2 + 0.03], [lebar, tinggi, 0.06])}
        {papan("kiri", [X_RAK - lebar / 2 + t / 2, tinggi / 2, 0], [t, tinggi, dalam])}
        {papan("kanan", [X_RAK + lebar / 2 - t / 2, tinggi / 2, 0], [t, tinggi, dalam])}
        {papan("atas", [X_RAK, tinggi - t / 2, 0], [lebar, t, dalam])}
        {papan("bawah", [X_RAK, t / 2, 0], [lebar, t, dalam])}
        {papan("rak1", [X_RAK, 0.98, 0], [lebar - 2 * t, 0.06, dalam - 0.06])}
        {papan("rak2", [X_RAK, 1.93, 0], [lebar - 2 * t, 0.06, dalam - 0.06])}
        {MAP.map((m, i) => (
          <group key={i} position={[m.x, 0, 0.08]} rotation={[0, 0, m.miring]}>
            <mesh ref={(el) => { map.current[i] = el; }} geometry={geo.kotak} material={bahanMap[i]} position={[0, m.y, 0]} scale={[0.27, 0.74, 0.95]}>
              <lineSegments geometry={geoTepi.kotak} material={garisMap} />
            </mesh>
          </group>
        ))}
      </group>
      {siap && (
        <>
          <Label teks="Aturan" k={k} muncul={(s) => ruas(s.p, 0.5, 0.6)} p={[X_BUKU, TINGGI_TUMPUKAN + 0.42, 0]} tinggi={0.36} gaya={{ warna: WARNA.emas, kapital: true }} />
          <Label teks="Arsip ingatan" p={[X_RAK, tinggi + 0.36, 0]} tinggi={0.36} gaya={{ kapital: true }} />
          <Label teks="kosong" k={k} muncul={(s) => ruas(s.p, 0.82, 0.92)} p={[X_RAK, 2.42, 0.2]} tinggi={0.34} gaya={{ latar: null, warna: "rgba(246,244,233,0.7)", serif: true, tebal: 400 }} />
          <Label teks={"267 cabang,\nbelum ada database yang valid"} k={k} muncul={(s) => s.l1} p={[X_RAK, 0.62, 0.75]} tinggi={0.56} gaya={{ ukuran: 40, warna: WARNA.gading, garis: "rgba(227,155,75,0.85)" }} />
          <Label teks="ART: lapor tiap 4 bulan" k={k} muncul={(s) => s.l2 * ruas(s.p, 0.3, 0.45)} p={[X_BUKU, TINGGI_TUMPUKAN + 0.95, 0]} tinggi={0.3} gaya={{ ukuran: 40 }} />
        </>
      )}
    </>
  );
}
