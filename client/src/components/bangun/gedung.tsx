import { useMemo, type ReactNode } from "react";
import { useLoader, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Bola, Figur, GayaBagian, Kotak, Papan, Silinder, WARNA, teksturBuku, teksturLouver, teksturRetak, teksturTulisan, tekstur, type V3 } from "./dasar";
import PropPerbaikan from "./perbaikan3d";

/**
 * Graha Dipo Insancita, sekretariat PB HMI, sebagai bangunan yang dinilai
 * bersama. Setiap bagian digambar menurut nilainya: cetak biru bila belum
 * dinilai, 1 Rapuh sampai 5 Kokoh. Fondasi, logo, dan papan nama tidak dinilai.
 *
 * Tata letak (satuan bebas): lebar 12 (x −6…6), dalam 8 (z −4…4, muka di z=4),
 * lantai dasar 0–2, lantai 1–4 setinggi 1,6, atap di 8,4.
 */

export const Y = [0, 2.0, 3.6, 5.2, 6.8, 8.4];
const SIRIP = [2.15, 3.4, 4.65, 5.85];
const BAY: [number, number][] = [[2.3, 3.25], [3.55, 4.5], [4.8, 5.7]];
const SISI = [-1, 1] as const;
const tengah = (b: [number, number]) => (b[0] + b[1]) / 2;
const lebar = (b: [number, number]) => b[1] - b[0];
const tengahLantai = (k: number) => (Y[k] + Y[k + 1]) / 2;
const tinggiLantai = (k: number) => Y[k + 1] - Y[k];

export const ID_BAGIAN = ["atap", "jendela", "ruang-kerja", "instalasi", "dinding", "tiang", "rangka", "perpustakaan", "lemari-arsip", "pintu", "lantai"] as const;
export const LANTAI_RUANG: Record<string, number> = { "lemari-arsip": 1, "ruang-kerja": 2, perpustakaan: 3 };

export type Perbaikan = { cara: number | null; usulan: string };
export const perbaikanSiap = (p?: Perbaikan) => !!p && (p.cara !== null || p.usulan.trim().length >= 5);

type PropsBagian = { n: number | null; bening: number | null };

/** Enam ruang jendela (tiga di kiri logo, tiga di kanan), dari dalam ke luar. */
function tiapBay(isi: (x: number, w: number, urutan: number, sisi: number) => ReactNode) {
  return SISI.flatMap((s) => BAY.map((b, i) => isi(s * tengah(b), lebar(b), i + (s > 0 ? 3 : 0), s)));
}

function Retak({ p, s, berat, r }: { p: V3; s: [number, number]; berat: boolean; r?: V3 }) {
  return <Papan p={p} s={s} r={r} peta={teksturRetak(berat)} />;
}

function DindingDalam({ k }: { k: number }) {
  return <Kotak p={[0, tengahLantai(k), 2.35]} s={[11.8, tinggiLantai(k) - 0.2, 0.08]} warna={WARNA.interior} tepi={false} />;
}

// ——— Bagian yang tidak dinilai

function Fondasi() {
  const plakat = (teks: string) => teksturTulisan([{ teks, ukuran: 46, warna: WARNA.emas, spasi: 6 }], { lebar: 1024, tinggi: 112, latar: "#0F3626" });
  return (
    <>
      <Kotak p={[0, -0.35, 1.2]} s={[14, 0.7, 12.4]} warna={WARNA.fondasi} />
      <Kotak p={[0, 0.01, 5.6]} s={[13.6, 0.02, 3.4]} warna="#D8D1C0" tepi={false} />
      {["NILAI DASAR PERJUANGAN", "TUJUAN HMI", "INDEPENDENSI"].map((teks, i) => (
        <Papan key={teks} p={[(i - 1) * 4.6, -0.35, 7.41]} s={[4.2, 0.46]} peta={plakat(teks)} />
      ))}
    </>
  );
}

function Identitas() {
  const logo = useLoader(THREE.TextureLoader, "/bangun/logo-hmi.png");
  const bahanLogo = useMemo(() => {
    logo.colorSpace = THREE.SRGBColorSpace;
    logo.anisotropy = 8;
    return new THREE.MeshBasicMaterial({ map: logo, transparent: true, alphaTest: 0.5 });
  }, [logo]);
  const gambar = logo.image as HTMLImageElement | undefined;
  const rasio = gambar ? gambar.width / gambar.height : 0.368;
  const tinggi = 5.3;
  const papanNama = teksturTulisan(
    [
      { teks: "Pengurus Besar", ukuran: 40, warna: "#1C1F1D" },
      { teks: "HIMPUNAN MAHASISWA ISLAM", ukuran: 62, warna: WARNA.hijau, spasi: 2 },
      { teks: "( PB HMI )", ukuran: 44, warna: "#1C1F1D" },
    ],
    { lebar: 1024, tinggi: 264, latar: "#FFFFFF" },
  );
  return (
    <>
      <mesh position={[0, 6.05, 4.34]} scale={[tinggi * rasio, tinggi, 1]} material={bahanLogo}>
        <planeGeometry />
      </mesh>
      <Kotak p={[0, 2.85, 4.17]} s={[4.7, 1.25, 0.1]} warna="#FFFFFF" />
      <Papan p={[0, 2.85, 4.225]} s={[4.55, 1.17]} peta={papanNama} />
    </>
  );
}

// ——— Sebelas bagian yang dinilai

function Lantai({ n }: PropsBagian) {
  const muka = 4.08;
  return (
    <>
      <Kotak p={[0, 0.06, 0]} s={[11.9, 0.12, 7.9]} warna="#CFC8B6" tepi={false} />
      {[2.0, 3.6, 5.2, 6.8].map((y) => <Kotak key={y} p={[0, y, 0]} s={[12.15, 0.2, 8.15]} warna={WARNA.putih} />)}
      {n !== null && n <= 2 && [[-4.6, 3.6], [3.2, 5.2], [-3.4, 6.8], [4.4, 2.0]].map(([x, y]) => <Retak key={`${x}${y}`} p={[x, y, muka]} s={[1.4, 0.2]} berat={n === 1} />)}
      {n === 1 && [[-3.9, 3.6, 0.7], [4.2, 5.2, 0.9], [3.0, 6.8, 0.6]].map(([x, y, w]) => <Kotak key={`l${x}`} p={[x, y, 4.0]} s={[w, 0.22, 0.2]} warna="#2A2622" tepi={false} />)}
      {n === 5 && [2.0, 3.6, 5.2, 6.8].map((y) => <Kotak key={`e${y}`} p={[0, y - 0.115, muka]} s={[12.1, 0.035, 0.02]} warna={WARNA.emas} terang={0.5} tepi={false} />)}
    </>
  );
}

function Tiang({ n }: PropsBagian) {
  const z = 4.12;
  const tiang: ReactNode[] = [];
  for (const s of SISI) {
    SIRIP.forEach((x, i) => {
      const xs = s * x;
      const patah = n === 1 && ((s === -1 && i === 1) || (s === 1 && i === 2));
      if (!patah) {
        tiang.push(<Kotak key={`${s}${i}`} p={[xs, 4.2, z]} s={[0.3, 8.4, 0.3]} warna={WARNA.hijau} />);
        return;
      }
      tiang.push(
        <group key={`${s}${i}`}>
          <Kotak p={[xs, 1.75, z]} s={[0.3, 3.5, 0.3]} warna={WARNA.hijau} />
          <Kotak p={[xs, 6.5, z]} s={[0.3, 3.8, 0.3]} warna={WARNA.hijau} />
          {/* Besi tulangan terlihat di bagian yang patah, ditopang balok kayu darurat. */}
          <Kotak p={[xs - 0.06, 4.05, z]} s={[0.03, 1.1, 0.03]} warna={WARNA.karat} tepi={false} />
          <Kotak p={[xs + 0.06, 4.05, z]} s={[0.03, 1.1, 0.03]} warna={WARNA.karat} tepi={false} />
          <Kotak p={[xs, 2.3, 5.02]} s={[0.12, 4.9, 0.12]} r={[-0.38, 0, 0]} warna={WARNA.kayu} />
        </group>,
      );
    });
  }
  return (
    <>
      {tiang}
      {n === 2 && [[-3.4, 2.8], [2.15, 5.6], [4.65, 3.4], [-5.85, 6.3]].map(([x, y]) => <Retak key={`r${x}`} p={[x, y, 4.275]} s={[0.28, 1.3]} berat={false} />)}
      {n === 1 && [[-2.15, 6.0], [5.85, 2.4]].map(([x, y]) => <Retak key={`r${x}`} p={[x, y, 4.275]} s={[0.28, 1.6]} berat />)}
      {n === 5 && SISI.flatMap((s) => SIRIP.map((x) => <Kotak key={`e${s}${x}`} p={[s * x, 8.47, z]} s={[0.38, 0.12, 0.38]} warna={WARNA.emas} terang={0.35} />))}
    </>
  );
}

function Jendela({ n, bening }: PropsBagian) {
  const panel: ReactNode[] = [];
  for (let k = 1; k <= 4; k++) {
    const y0 = Y[k] + 0.12;
    const y1 = Y[k + 1] - 0.12;
    const yc = (y0 + y1) / 2;
    const h = y1 - y0;
    tiapBay((x, w, urutan) => {
      const id = k * 10 + urutan;
      const pecah = n === 1 && [11, 24, 32, 43, 15].includes(id);
      const dipapan = n === 1 && [20, 35, 41].includes(id);
      const retak = n === 2 && [13, 22, 34, 40].includes(id);
      panel.push(
        <group key={id}>
          {pecah ? (
            <>
              <Kotak p={[x, yc, 3.97]} s={[w, h, 0.04]} warna="#141A17" />
              <Kotak p={[x - w * 0.3, y1 - 0.2, 3.985]} s={[w * 0.35, 0.3, 0.03]} r={[0, 0, 0.5]} warna={WARNA.kaca} opacity={0.6} tepi={false} />
            </>
          ) : (
            <Kotak p={[x, yc, 3.97]} s={[w, h, 0.04]} warna={WARNA.kaca} opacity={bening === k ? 0.1 : 0.5} terang={n === 5 ? 0.22 : 0} />
          )}
          <Kotak p={[x, yc, 3.995]} s={[w, 0.04, 0.03]} warna={WARNA.hitam} tepi={false} />
          {dipapan && (
            <>
              <Kotak p={[x, yc + 0.25, 4.03]} s={[w + 0.1, 0.16, 0.04]} r={[0, 0, 0.35]} warna={WARNA.kayu} />
              <Kotak p={[x, yc - 0.25, 4.03]} s={[w + 0.1, 0.16, 0.04]} r={[0, 0, -0.3]} warna={WARNA.kayu} />
            </>
          )}
          {retak && <Retak p={[x, yc, 4.0]} s={[w, h]} berat={false} />}
          {n === 5 && <Kotak p={[x + w * 0.15, yc, 4.0]} s={[0.08, h * 0.9, 0.01]} r={[0, 0, 0.45]} warna="#FFFFFF" opacity={0.5} tepi={false} />}
        </group>,
      );
      return null;
    });
  }
  return <>{panel}</>;
}

function LemariArsip({ n }: PropsBagian) {
  const dasar = Y[1] + 0.1;
  const jumlah = n === null ? 2 : [1, 1, 2, 2, 3][n - 1];
  return (
    <>
      <DindingDalam k={1} />
      {tiapBay((x, _w, u) => {
        const roboh = n === 1 && (u === 1 || u === 4);
        return (
          <group key={u}>
            {Array.from({ length: jumlah }, (_, j) => {
              const lx = x + (j - (jumlah - 1) / 2) * 0.3;
              if (roboh && j === 0) return <Kotak key={j} p={[lx, dasar + 0.2, 3.1]} s={[0.28, 1.0, 0.36]} r={[0, 0, 1.25]} warna="#5A6B63" />;
              return (
                <group key={j}>
                  <Kotak p={[lx, dasar + 0.5, 3.0]} s={[0.26, 1.0, 0.36]} warna="#5A6B63" />
                  {[0.2, 0.5, 0.8].map((dy) => <Kotak key={dy} p={[lx, dasar + dy, 3.185]} s={[0.2, 0.02, 0.01]} warna={WARNA.hitam} tepi={false} />)}
                  {n !== null && n >= 4 && ["#C49A3A", "#0E8A4F", "#7B2D26"].map((warna, m) => <Kotak key={warna} p={[lx, dasar + 0.24 + m * 0.3, 3.186]} s={[0.1, 0.05, 0.01]} warna={warna} tepi={false} />)}
                </group>
              );
            })}
            {n !== null && n <= 2 && [0, 1, 2].map((m) => <Kotak key={`k${m}`} p={[x + (m - 1) * 0.25, dasar + 0.01, 3.4 + m * 0.08]} s={[0.18, 0.01, 0.24]} r={[0, m * 0.7, 0]} warna="#FFFFFF" tepi={false} />)}
          </group>
        );
      })}
      {n === 5 && (
        <>
          <Kotak p={[2.775, dasar + 0.4, 3.5]} s={[0.6, 0.04, 0.3]} warna={WARNA.kayu} />
          <Kotak p={[2.775, dasar + 0.6, 3.45]} s={[0.4, 0.28, 0.02]} warna="#2E6FD0" terang={0.6} />
        </>
      )}
    </>
  );
}

function Meja({ x, dasar, miring = false, laptop = false }: { x: number; dasar: number; miring?: boolean; laptop?: boolean }) {
  return (
    <group position={[x, dasar, 3.15]} rotation={[0, 0, miring ? 0.25 : 0]}>
      <Kotak p={[0, 0.55, 0]} s={[0.78, 0.05, 0.42]} warna={WARNA.kayu} />
      <Kotak p={[-0.34, 0.27, 0]} s={[0.04, 0.54, 0.38]} warna={WARNA.kayuTua} tepi={false} />
      {!miring && <Kotak p={[0.34, 0.27, 0]} s={[0.04, 0.54, 0.38]} warna={WARNA.kayuTua} tepi={false} />}
      {laptop && (
        <>
          <Kotak p={[0, 0.585, 0.02]} s={[0.3, 0.015, 0.2]} warna="#3B3F3D" tepi={false} />
          <Kotak p={[0, 0.68, -0.08]} s={[0.3, 0.19, 0.015]} r={[-0.2, 0, 0]} warna="#3E7FD8" terang={0.7} tepi={false} />
        </>
      )}
    </group>
  );
}

function RuangKerja({ n }: PropsBagian) {
  const dasar = Y[2] + 0.1;
  return (
    <>
      <DindingDalam k={2} />
      {tiapBay((x, _w, u) => {
        const ada = n === null || n >= 3 || (n === 2 && u % 2 === 0) || (n === 1 && (u === 1 || u === 4));
        if (!ada) return null;
        return (
          <group key={u}>
            <Meja x={x} dasar={dasar} miring={n === 1} laptop={n !== null && n >= 4} />
            {n !== 1 && (
              <>
                <Kotak p={[x, dasar + 0.3, 3.6]} s={[0.3, 0.04, 0.28]} warna={WARNA.hitam} tepi={false} />
                <Kotak p={[x, dasar + 0.5, 3.73]} s={[0.3, 0.36, 0.03]} warna={WARNA.hitam} tepi={false} />
              </>
            )}
            {n === 5 && u % 2 === 1 && <Figur p={[x, dasar + 0.32, 3.58]} duduk warna={u === 1 ? WARNA.hijau : "#2C3E50"} />}
          </group>
        );
      })}
      {n === 5 &&
        SISI.map((s) => (
          <group key={s}>
            <Kotak p={[s * 3.9, dasar + 1.05, 2.42]} s={[1.6, 0.6, 0.02]} warna="#F7F3E6" />
            {["#C49A3A", "#0E8A4F", "#7B2D26", "#1F4E79", "#C49A3A", "#0E8A4F"].map((warna, m) => (
              <Kotak key={m} p={[s * 3.9 - 0.55 + (m % 3) * 0.55, dasar + 0.92 + Math.floor(m / 3) * 0.26, 2.44]} s={[0.22, 0.16, 0.01]} warna={warna} tepi={false} />
            ))}
          </group>
        ))}
    </>
  );
}

function Rak({ x, dasar, isi }: { x: number; dasar: number; isi: number }) {
  const peta = teksturBuku(isi);
  return (
    <group position={[x, dasar, 2.75]}>
      <Kotak p={[0, 0.62, 0]} s={[0.84, 1.24, 0.3]} warna={WARNA.kayuTua} />
      {[0.25, 0.65, 1.05].map((y) => <Papan key={y} p={[0, y, 0.155]} s={[0.76, 0.34]} peta={peta} />)}
    </group>
  );
}

function Perpustakaan({ n }: PropsBagian) {
  const dasar = Y[3] + 0.1;
  const isi = n === null ? 0.5 : [0.06, 0.28, 0.55, 0.88, 1][n - 1];
  return (
    <>
      <DindingDalam k={3} />
      {tiapBay((x, _w, u) => <Rak key={u} x={x} dasar={dasar} isi={isi} />)}
      {n === 1 &&
        [[-2.6, 0.4], [-2.9, 0.9], [3.1, 0.2], [4.3, 1.1], [4.0, 0.6]].map(([x, putar]) => (
          <Kotak key={x} p={[x, dasar + 0.03, 3.4]} s={[0.22, 0.05, 0.16]} r={[0, putar, 0]} warna="#7B2D26" tepi={false} />
        ))}
      {n === 5 && (
        <>
          <Kotak p={[-3.4, dasar + 0.45, 3.45]} s={[1.2, 0.05, 0.4]} warna={WARNA.kayu} />
          <Kotak p={[-3.4, dasar + 0.22, 3.45]} s={[0.08, 0.44, 0.08]} warna={WARNA.kayuTua} tepi={false} />
          <Figur p={[-3.8, dasar + 0.3, 3.75]} duduk warna={WARNA.hijau} />
          <Figur p={[-3.0, dasar + 0.3, 3.75]} duduk warna="#7B2D26" />
          <Kotak p={[-3.4, dasar + 0.62, 3.4]} s={[0.12, 0.12, 0.12]} warna="#FFE7A8" terang={1} tepi={false} />
        </>
      )}
    </>
  );
}

function Dinding({ n }: PropsBagian) {
  const muralTekstur = tekstur("mural", 512, 64, (ctx, w, h) => {
    ctx.fillStyle = WARNA.hijauTua;
    ctx.fillRect(0, 0, w, h);
    for (let x = -h; x < w; x += 28) {
      ctx.fillStyle = (x / 28) % 2 === 0 ? WARNA.emas : WARNA.hijau;
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + 14, h);
      ctx.lineTo(x + 14 + h, 0);
      ctx.lineTo(x + h, 0);
      ctx.fill();
    }
  });
  const kanan = 6.075;
  const putar: V3 = [0, Math.PI / 2, 0];
  const dasarAula = Y[4] + 0.1;
  return (
    <>
      {SISI.map((s) => <Kotak key={s} p={[s * 6.0, 4.2, 0]} s={[0.12, 8.4, 7.9]} warna={WARNA.dinding} />)}
      <Kotak p={[0, 4.2, -3.97]} s={[11.9, 8.4, 0.12]} warna={WARNA.dinding} />
      {SISI.flatMap((s) => [-2.6, 0, 2.6].map((z) => <Kotak key={`h${s}${z}`} p={[s * 6.07, 4.2, z]} s={[0.04, 8.4, 0.28]} warna={WARNA.hijau} tepi={false} />))}
      {SISI.flatMap((s) => [1, 2, 3, 4].flatMap((k) => [-1.3, 1.3].map((z) => <Kotak key={`j${s}${k}${z}`} p={[s * 6.07, tengahLantai(k), z]} s={[0.03, 0.8, 0.9]} warna={WARNA.kacaGelap} tepi={false} />)))}
      {/* Aula di lantai 4 */}
      <DindingDalam k={4} />
      {[-5.2, -4.2, -3.0, 3.0, 4.2, 5.2].map((x) => <Kotak key={x} p={[x, dasarAula + 0.25, 3.2]} s={[0.3, 0.5, 0.3]} warna="#7A2E2E" tepi={false} />)}
      {n !== null && n <= 2 && [[5.6, -1.9], [3.4, 1.8], [1.4, -0.6], [7.2, 1.2]].map(([y, z]) => <Retak key={`${y}${z}`} p={[kanan + 0.005, y, z]} r={putar} s={[1.7, 1.7]} berat={n === 1} />)}
      {n === 1 && (
        <>
          {[[4.6, 0.8, 1.6], [2.4, -2.2, 1.2], [6.8, -0.4, 1.4]].map(([y, z, w]) => <Kotak key={`n${y}`} p={[kanan, y, z]} s={[0.01, w * 0.8, w]} warna="#5F6B55" opacity={0.5} tepi={false} />)}
          {[[3.0, 0.6], [5.9, -3.0]].map(([y, z]) => <Kotak key={`b${y}`} p={[kanan, y, z]} s={[0.02, 0.5, 0.7]} warna="#A0522D" />)}
        </>
      )}
      {n === 5 && <Papan p={[kanan + 0.01, 1.0, 0]} r={putar} s={[7.6, 0.9]} peta={muralTekstur} />}
    </>
  );
}

function Rangka({ n }: PropsBagian) {
  const warna = (i: number) => (n === 1 ? WARNA.karat : n === 2 ? (i % 2 ? WARNA.karat : WARNA.baja) : n !== null && n >= 4 ? "#3A423F" : WARNA.baja);
  return (
    <>
      {SISI.flatMap((s) =>
        SIRIP.map((x, i) => {
          const xs = s * x;
          if (n === 1 && s === -1 && i === 2) {
            return (
              <group key={`${s}${i}`}>
                <Kotak p={[xs, 2.3, 3.45]} s={[0.14, 4.6, 0.14]} r={[0, 0, 0.04]} warna={warna(i)} />
                <Kotak p={[xs, 6.9, 3.45]} s={[0.14, 3.0, 0.14]} warna={warna(i)} />
              </group>
            );
          }
          return <Kotak key={`${s}${i}`} p={[xs, 4.2, 3.45]} s={[0.14, 8.4, 0.14]} warna={warna(i)} />;
        }),
      )}
      {[2.0, 3.6, 5.2, 6.8, 8.4].map((y, i) => (
        <Kotak key={y} p={[0, y - 0.17, 3.45]} s={[11.8, 0.12, 0.12]} r={n === 1 && i === 2 ? [0, 0, 0.05] : undefined} warna={warna(i)} />
      ))}
      {/* Rangka di atap yang menopang tulisan GRAHA DIPO INSANCITA */}
      {Array.from({ length: 9 }, (_, i) => -5.2 + i * 1.3).map((x, i) => (
        <group key={`t${x}`}>
          <Kotak p={[x, 9.28, 3.75]} s={[0.07, 1.35, 0.07]} warna={warna(i)} tepi={false} />
          {i < 8 && !(n === 1 && i % 3 === 1) && <Kotak p={[x + 0.65, 9.28, 3.75]} s={[0.05, 1.87, 0.05]} r={[0, 0, (i % 2 ? 1 : -1) * 0.766]} warna={warna(i)} tepi={false} />}
        </group>
      ))}
      <Kotak p={[0, 9.95, 3.75]} s={[10.5, 0.07, 0.07]} warna={warna(0)} tepi={false} />
      {n === 5 &&
        [-1.3, 1.3].flatMap((z) =>
          [1, -1].map((arah) => <Kotak key={`x${z}${arah}`} p={[6.13, 3.6, z]} s={[0.06, 4.0, 0.06]} r={[arah * 0.644, 0, 0]} warna={WARNA.emas} terang={0.3} />),
        )}
    </>
  );
}

function Atap({ n }: PropsBagian) {
  const huruf = n === 1 ? "GRA A DIP   INS NC TA" : n === 2 ? "GRAHA DIPO INSAN ITA" : "GRAHA DIPO INSANCITA";
  const peta = teksturTulisan([{ teks: huruf, ukuran: 96, warna: "#FFFFFF", spasi: 10 }], { lebar: 2048, tinggi: 128 });
  const semak = n !== null && n >= 4 ? "#3F8F4A" : "#7A5A3A";
  return (
    <>
      <Kotak p={[0, 8.5, 0]} s={[12.2, 0.2, 8.2]} warna={WARNA.putih} />
      {n === 1 ? (
        <>
          <Kotak p={[-1.6, 8.85, 4.0]} s={[9.0, 0.5, 0.22]} warna={WARNA.hijau} />
          <Kotak p={[5.15, 8.85, 4.0]} s={[1.9, 0.5, 0.22]} warna={WARNA.hijau} />
          <Kotak p={[3.5, 8.7, 4.6]} s={[0.6, 0.2, 0.25]} r={[0.3, 0.4, 0.2]} warna={WARNA.hijau} />
          <Kotak p={[-2, 8.63, -1]} s={[5, 0.04, 3.5]} r={[0.05, 0.2, 0.04]} warna="#2F6FB0" />
        </>
      ) : (
        <Kotak p={[0, 8.85, 4.0]} s={[12.2, 0.5, 0.22]} warna={WARNA.hijau} />
      )}
      {SISI.map((s) => <Kotak key={s} p={[s * 6.0, 8.8, 0]} s={[0.22, 0.4, 8.2]} warna={WARNA.hijau} />)}
      <Kotak p={[0, 8.8, -4.0]} s={[12.2, 0.4, 0.22]} warna={WARNA.hijau} />
      <Kotak p={[0, 9.3, 3.1]} s={[4.6, 1.4, 1.1]} warna={WARNA.hijau} />
      {SISI.map((s) => (
        <group key={`p${s}`}>
          <Kotak p={[s * 5.1, 9.2, 3.5]} s={[1.5, 0.3, 0.6]} warna={WARNA.hijauTua} />
          {(n === null || n === 1 || n >= 4) && [-0.45, 0, 0.45].map((dx) => <Bola key={dx} p={[s * 5.1 + dx, 9.48, 3.5]} s={n === 1 ? [0.25, 0.18, 0.25] : [0.42, 0.36, 0.42]} warna={semak} />)}
        </group>
      ))}
      {n === 5 && <Kotak p={[0, 9.62, 4.09]} s={[10.8, 0.62, 0.02]} warna={WARNA.emas} terang={0.7} opacity={0.35} tepi={false} />}
      <Papan p={[0, 9.62, 4.14]} s={[10.6, 0.66]} peta={peta} />
      {n === 5 && (
        <group position={[0, 10, 2.2]}>
          <Silinder p={[0, 0.9, 0]} s={[0.06, 1.8, 0.06]} warna={WARNA.hitam} tepi={false} />
          <Kotak p={[0.35, 1.55, 0]} s={[0.6, 0.45, 0.02]} warna={WARNA.hijau} tepi={false} />
          <Kotak p={[0.95, 1.55, 0]} s={[0.6, 0.45, 0.02]} warna={WARNA.hitam} tepi={false} />
        </group>
      )}
    </>
  );
}

function Motor({ p }: { p: V3 }) {
  return (
    <group position={p}>
      {[-0.28, 0.28].map((z) => <Silinder key={z} p={[0, 0.17, z]} r={[0, 0, Math.PI / 2]} s={[0.34, 0.07, 0.34]} warna={WARNA.hitam} tepi={false} />)}
      <Kotak p={[0, 0.36, 0]} s={[0.14, 0.2, 0.62]} warna="#9E2B25" tepi={false} />
      <Kotak p={[0, 0.5, -0.05]} s={[0.16, 0.06, 0.34]} warna={WARNA.hitam} tepi={false} />
    </group>
  );
}

function Pintu({ n }: PropsBagian) {
  const terbuka = n === null || n >= 3;
  const spanduk = teksturTulisan([{ teks: "SELAMAT DATANG, KADER", ukuran: 54, warna: WARNA.emas, spasi: 6 }], { lebar: 1024, tinggi: 72, latar: WARNA.hijauTua });
  const pagar: ReactNode[] = [];
  for (let x = -6.6; x <= 6.61; x += 0.4) if (Math.abs(x) > 2.2) pagar.push(<Kotak key={x.toFixed(1)} p={[x, 0.55, 7.0]} s={[0.05, 1.1, 0.05]} warna={WARNA.hitam} tepi={false} />);
  return (
    <>
      <Kotak p={[0, 2.2, 4.5]} s={[12.2, 0.4, 1.0]} warna={WARNA.hijau} />
      <Kotak p={[0, 1.98, 4.5]} s={[12.2, 0.05, 1.0]} warna={WARNA.putih} tepi={false} />
      {SISI.map((s) => <Kotak key={s} p={[s * 4.05, 1.0, 3.98]} s={[3.9, 1.85, 0.05]} warna={WARNA.kacaGelap} opacity={0.9} />)}
      <Kotak p={[0, 0.98, 3.98]} s={[3.8, 1.85, 0.05]} warna={n === 1 ? "#141A17" : WARNA.kaca} opacity={0.75} terang={n === 5 ? 0.35 : 0} />
      <Kotak p={[0, 0.98, 4.01]} s={[0.05, 1.85, 0.04]} warna={WARNA.hitam} tepi={false} />
      <Kotak p={[0, 1.0, 1.9]} s={[4, 1.9, 0.08]} warna={WARNA.interior} tepi={false} />
      <Kotak p={[0, 0.06, 5.0]} s={[4.4, 0.12, 0.6]} warna="#CFC8B6" />
      <Kotak p={[0, 0.03, 5.5]} s={[4.8, 0.06, 0.5]} warna="#CFC8B6" />
      {pagar}
      {SISI.map((s) => <Kotak key={`r${s}`} p={[s * 4.4, 1.08, 7.0]} s={[4.4, 0.05, 0.05]} warna={WARNA.hitam} tepi={false} />)}
      {/* Gerbang geser: tertutup bila rapuh atau retak, bergeser ke kanan bila terbuka. */}
      <group position={[terbuka ? 4.4 : 0, 0, terbuka ? 7.1 : 7.0]}>
        {Array.from({ length: 11 }, (_, i) => -2.0 + i * 0.4).map((x) => <Kotak key={x} p={[x, 0.55, 0]} s={[0.05, 1.1, 0.05]} warna={WARNA.hitam} tepi={false} />)}
        <Kotak p={[0, 1.08, 0]} s={[4.3, 0.06, 0.06]} warna={WARNA.hitam} tepi={false} />
        <Kotak p={[0, 0.1, 0]} s={[4.3, 0.06, 0.06]} warna={WARNA.hitam} tepi={false} />
      </group>
      {n === 1 && (
        <>
          <Kotak p={[0, 0.6, 7.06]} s={[0.12, 0.16, 0.06]} warna={WARNA.emas} />
          <Bola p={[-3.0, 0.22, 6.3]} s={[0.45, 0.4, 0.45]} warna="#262A28" />
          <Bola p={[-2.6, 0.18, 6.5]} s={[0.36, 0.32, 0.36]} warna="#262A28" />
          <Retak p={[0.6, 1.1, 4.02]} s={[1.4, 1.4]} berat />
        </>
      )}
      {n !== null && n >= 4 && (
        <>
          <Papan p={[0, 2.2, 5.01]} s={[5.2, 0.36]} peta={spanduk} />
          <Motor p={[-4.6, 0, 5.8]} />
          <Motor p={[-3.8, 0, 5.8]} />
        </>
      )}
      {n === 5 && (
        <>
          <Figur p={[0.7, 0.02, 6.3]} warna={WARNA.hijau} />
          <Figur p={[-0.5, 0.02, 5.8]} warna="#7B2D26" />
          <Figur p={[0.2, 0.14, 5.0]} warna="#1F4E79" />
          {SISI.map((s) => (
            <group key={`t${s}`}>
              <Silinder p={[s * 2.6, 0.2, 5.0]} s={[0.36, 0.4, 0.36]} warna="#B5643C" />
              <Bola p={[s * 2.6, 0.62, 5.0]} s={[0.55, 0.55, 0.55]} warna="#3F8F4A" />
            </group>
          ))}
        </>
      )}
    </>
  );
}

function Cincin({ p, r = 0.5, warna }: { p: V3; r?: number; warna: string }) {
  return (
    <mesh position={p} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[r, 0.03, 8, 40]} />
      <meshBasicMaterial color={warna} transparent opacity={0.8} />
    </mesh>
  );
}

function Instalasi({ n }: PropsBagian) {
  const lampuNyala = (i: number) => n === null || n >= 3 || (n === 2 && i % 2 === 0);
  return (
    <>
      <Papan p={[0, 5.2, 3.96]} s={[4.0, 6.4]} peta={teksturLouver(n === 1)} />
      {/* Tandon air dan antena di atap */}
      {[[3.4, -2.0], [4.2, -2.0], [3.4, -1.2], [4.2, -1.2]].map(([x, z]) => <Kotak key={`${x}${z}`} p={[x, 8.75, z]} s={[0.06, 0.3, 0.06]} warna={WARNA.baja} tepi={false} />)}
      <Silinder p={[3.8, 9.5, -1.6]} s={[1.1, 1.2, 1.1]} warna="#2E7FBF" />
      <Silinder p={[-4, 10.2, -2.6]} s={[0.08, 3.2, 0.08]} warna={WARNA.baja} tepi={false} />
      <Kotak p={[-4, 11.3, -2.6]} s={[0.8, 0.05, 0.05]} warna={WARNA.baja} tepi={false} />
      <Kotak p={[-4, 10.9, -2.6]} s={[0.6, 0.05, 0.05]} warna={WARNA.baja} tepi={false} />
      {/* Unit AC dan pipa di dinding samping kanan */}
      {[3.0, 4.6, 6.2].flatMap((y, i) =>
        [-3.3, 3.3].map((z, j) => {
          const jatuh = n === 1 && i === 0 && j === 1;
          const miring = n === 1 && (i + j) % 2 === 1;
          return (
            <group key={`${y}${z}`} position={jatuh ? [6.7, 0.26, 3.3] : [6.25, y, z]} rotation={jatuh ? [0.4, 0.6, 1.3] : miring ? [0.3, 0, 0.2] : undefined}>
              <Kotak s={[0.32, 0.42, 0.62]} warna="#D9DCD8" />
              <Silinder p={[0.17, 0, 0]} r={[0, 0, Math.PI / 2]} s={[0.3, 0.02, 0.3]} warna={WARNA.hitam} tepi={false} />
            </group>
          );
        }),
      )}
      <Kotak p={[6.1, 4.6, -3.7]} s={[0.06, 8.6, 0.06]} warna="#3A3F3C" tepi={false} />
      {[-4.5, -1.5, 1.5, 4.5].map((x, i) => <Kotak key={x} p={[x, 1.94, 4.7]} s={[0.4, 0.04, 0.14]} warna={lampuNyala(i) ? "#FFE7A8" : "#6B6A62"} terang={lampuNyala(i) ? 0.9 : 0} tepi={false} />)}
      {n === 1 && (
        <>
          {[[0.7, 4.0], [-0.5, 5.5], [0.4, 6.8], [-0.9, 3.0], [1.1, 5.0]].map(([sudut, y], i) => <Kotak key={i} p={[6.11, y, -2.9 + i * 0.12]} s={[0.02, 2.4, 0.02]} r={[sudut, 0, 0]} warna={WARNA.hitam} tepi={false} />)}
          <Kotak p={[6.08, 6.4, -1.6]} s={[0.01, 3.8, 0.28]} warna="#5DA9E9" opacity={0.55} tepi={false} />
        </>
      )}
      {n !== null && n >= 4 && <Kotak p={[6.13, 8.0, 0]} s={[0.08, 0.1, 7.6]} warna={WARNA.baja} tepi={false} />}
      {n === 5 && (
        <>
          {[-2.2, -0.6, 1.0].map((x) => <Kotak key={x} p={[x, 8.95, -2.3]} s={[1.4, 0.05, 1.0]} r={[-0.35, 0, 0]} warna="#1E3A6E" />)}
          {[0.35, 0.6, 0.85].map((r) => <Cincin key={r} p={[-4, 11.8, -2.6]} r={r} warna={WARNA.emas} />)}
        </>
      )}
    </>
  );
}

// ——— Perancah untuk tiga bagian paling mendesak

const KUNING = WARNA.perancah;

export function Perancah({ p, s: [w, h], arah = "z" }: { p: V3; s: [number, number]; arah?: "x" | "z" }) {
  const kolom = Math.max(2, Math.round(w / 0.9));
  const baris = Math.max(2, Math.round(h / 0.9));
  const dx = w / kolom;
  const dy = h / baris;
  const bagian: ReactNode[] = [];
  for (let i = 0; i <= kolom; i++) bagian.push(<Kotak key={`v${i}`} p={[-w / 2 + i * dx, 0, 0]} s={[0.05, h, 0.05]} warna={KUNING} tepi={false} />);
  for (let j = 0; j <= baris; j++) {
    bagian.push(<Kotak key={`h${j}`} p={[0, -h / 2 + j * dy, 0]} s={[w, 0.04, 0.04]} warna={KUNING} tepi={false} />);
    if (j % 2 === 1) bagian.push(<Kotak key={`d${j}`} p={[0, -h / 2 + j * dy, -0.22]} s={[w, 0.03, 0.42]} warna={WARNA.kayu} tepi={false} />);
  }
  const panjang = Math.hypot(dx, dy);
  const sudut = Math.atan2(dy, dx);
  for (let i = 0; i < kolom; i += 2) {
    for (let j = 0; j < baris; j++) {
      bagian.push(<Kotak key={`x${i}${j}`} p={[-w / 2 + (i + 0.5) * dx, -h / 2 + (j + 0.5) * dy, 0.02]} s={[panjang, 0.025, 0.025]} r={[0, 0, j % 2 ? -sudut : sudut]} warna={KUNING} tepi={false} />);
    }
  }
  bagian.push(<Kotak key="jaring" p={[0, 0, 0.05]} s={[w, h, 0.005]} warna="#3E8E5A" opacity={0.18} tepi={false} />);
  return <group position={p} rotation={arah === "x" ? [0, Math.PI / 2, 0] : undefined}>{bagian}</group>;
}

/** Derek menara untuk perbaikan rangka. */
function Derek() {
  return (
    <group position={[-9, 0, -2.5]}>
      <Kotak p={[0, 6.5, 0]} s={[0.6, 13, 0.6]} warna={KUNING} />
      {Array.from({ length: 12 }, (_, i) => <Kotak key={i} p={[0, 0.55 + i * 1.05, 0.31]} s={[0.02, 1.2, 0.02]} r={[0, 0, i % 2 ? 0.5 : -0.5]} warna={WARNA.hitam} tepi={false} />)}
      <Kotak p={[4, 13.1, 0]} s={[9, 0.35, 0.35]} warna={KUNING} />
      <Kotak p={[-1.8, 13.1, 0]} s={[3, 0.35, 0.35]} warna={KUNING} />
      <Kotak p={[-2.8, 12.6, 0]} s={[0.9, 0.8, 0.7]} warna="#555B58" />
      <Kotak p={[0.5, 12.4, 0]} s={[0.8, 0.8, 0.8]} warna="#E8E1CF" />
      <Kotak p={[6, 11.6, 0]} s={[0.02, 3.0, 0.02]} warna={WARNA.hitam} tepi={false} />
      <Kotak p={[6, 10, 0]} s={[1.8, 0.18, 0.18]} warna={WARNA.baja} />
    </group>
  );
}

const PERANCAH: Record<string, { p: V3; s: [number, number]; arah?: "x" | "z" }[]> = {
  atap: [{ p: [0, 9.3, 4.75], s: [12.6, 1.6] }],
  jendela: [{ p: [-3.95, 5.4, 4.75], s: [3.9, 6.4] }, { p: [3.95, 5.4, 4.75], s: [3.9, 6.4] }],
  tiang: [{ p: [-4.0, 4.4, 4.85], s: [4.3, 8.6] }, { p: [4.0, 4.4, 4.85], s: [4.3, 8.6] }],
  "ruang-kerja": [{ p: [-3.95, 4.4, 4.7], s: [3.9, 1.8] }, { p: [3.95, 4.4, 4.7], s: [3.9, 1.8] }],
  perpustakaan: [{ p: [-3.95, 6.0, 4.7], s: [3.9, 1.8] }, { p: [3.95, 6.0, 4.7], s: [3.9, 1.8] }],
  "lemari-arsip": [{ p: [-3.95, 2.8, 4.7], s: [3.9, 1.8] }, { p: [3.95, 2.8, 4.7], s: [3.9, 1.8] }],
  lantai: [{ p: [0, 4.4, 4.95], s: [12.4, 5.2] }],
  dinding: [{ p: [6.6, 4.4, 0], s: [8.2, 8.6], arah: "x" }],
  rangka: [],
  pintu: [{ p: [0, 1.2, 5.4], s: [6.0, 2.4] }],
  instalasi: [{ p: [3.8, 9.7, -0.7], s: [2.4, 2.2] }],
};

/** Letak bendera nomor prioritas, di atas perancah masing-masing bagian. */
export const BENDERA: Record<string, V3> = {
  atap: [0.9, 10.1, 4.8], jendela: [-3.95, 8.6, 4.8], tiang: [4.0, 8.7, 4.9], "ruang-kerja": [-3.95, 5.3, 4.75],
  perpustakaan: [3.95, 6.9, 4.75], "lemari-arsip": [3.95, 3.7, 4.75], lantai: [-5.6, 7.0, 5.0], dinding: [6.6, 8.7, -3.5],
  rangka: [-9, 13.3, -2.5], pintu: [2.6, 2.4, 5.45], instalasi: [3.0, 10.8, -0.7],
};

function BenderaNomor({ p, nomor }: { p: V3; nomor: number }) {
  const peta = teksturTulisan([{ teks: String(nomor), ukuran: 150, warna: "#FFFFFF", serif: true }], { lebar: 256, tinggi: 192, latar: WARNA.hijauTua });
  return (
    <group position={p}>
      <Silinder p={[0, 0.6, 0]} s={[0.05, 1.2, 0.05]} warna={WARNA.hitam} tepi={false} />
      <Papan p={[0.33, 1.0, 0]} s={[0.62, 0.46]} peta={peta} />
    </group>
  );
}

const KOMPONEN: Record<string, (p: PropsBagian) => JSX.Element> = {
  atap: Atap, jendela: Jendela, "ruang-kerja": RuangKerja, instalasi: Instalasi, dinding: Dinding, tiang: Tiang,
  rangka: Rangka, perpustakaan: Perpustakaan, "lemari-arsip": LemariArsip, pintu: Pintu, lantai: Lantai,
};
const PUDAR = [0.55, 0.3, 0.12, 0, 0];

function Bagian({ id, n, sorot, onPilih, children }: { id: string; n: number | null; sorot: boolean; onPilih?: (id: string) => void; children: ReactNode }) {
  const gaya = useMemo(() => ({ rencana: n === null, lapuk: n ? PUDAR[n - 1] : 0, sorot }), [n, sorot]);
  const pilih = (e: ThreeEvent<MouseEvent>) => {
    if (!onPilih || e.delta > 6) return;
    e.stopPropagation();
    onPilih(id);
  };
  return (
    <GayaBagian.Provider value={gaya}>
      <group
        onClick={pilih}
        onPointerOver={(e) => { if (onPilih) { e.stopPropagation(); document.body.style.cursor = "pointer"; } }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
      >
        {children}
      </group>
    </GayaBagian.Provider>
  );
}

export type KeadaanGedung = {
  nilai: Record<string, number>;
  prioritas: string[];
  perbaikan: Record<string, Perbaikan | undefined>;
  fokus: string | null;
  onPilih?: (id: string) => void;
};

export function Gedung({ nilai, prioritas, perbaikan, fokus, onPilih }: KeadaanGedung) {
  const bening = fokus ? LANTAI_RUANG[fokus] ?? null : null;
  return (
    <group>
      <Fondasi />
      <Identitas />
      {ID_BAGIAN.map((id) => {
        const n = perbaikanSiap(perbaikan[id]) ? 5 : nilai[id] ?? null;
        const Isi = KOMPONEN[id];
        return (
          <Bagian key={id} id={id} n={n} sorot={fokus === id} onPilih={onPilih}>
            <Isi n={n} bening={bening} />
          </Bagian>
        );
      })}
      {prioritas.map((id, i) => (
        <group key={`prioritas-${id}`}>
          {perbaikanSiap(perbaikan[id]) ? (
            <PropPerbaikan bagian={id} cara={perbaikan[id]!.cara} />
          ) : (
            <>
              {PERANCAH[id]?.map((r, j) => <Perancah key={j} {...r} />)}
              {id === "rangka" && <Derek />}
            </>
          )}
          <BenderaNomor p={BENDERA[id]} nomor={i + 1} />
        </group>
      ))}
    </group>
  );
}
