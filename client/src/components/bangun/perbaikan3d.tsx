import * as THREE from "three";
import { Bola, Figur, Kerucut, Kotak, Papan, Silinder, WARNA, tekstur, teksturTulisan, type V3 } from "./dasar";

/**
 * Wujud setiap cara perbaikan di bangunan. Urutan tiap daftar mengikuti urutan
 * `pilihan` di server/konten/bangunHmi.ts (0, 1, 2). Tulisan di bangunan dibuat
 * umum supaya isi pilihan tetap hanya dikirim server setelah rilis.
 */

const Y = [0, 2.0, 3.6, 5.2, 6.8, 8.4];
const lantai = (k: number) => Y[k] + 0.1;

function Cincin({ p, r = 0.5, warna = WARNA.emas }: { p: V3; r?: number; warna?: string }) {
  return (
    <mesh position={p}>
      <torusGeometry args={[r, 0.03, 8, 40]} />
      <meshBasicMaterial color={warna} transparent opacity={0.85} />
    </mesh>
  );
}

function Tiang({ p, h, warna = WARNA.baja }: { p: V3; h: number; warna?: string }) {
  return <Kotak p={[p[0], p[1] + h / 2, p[2]]} s={[0.07, h, 0.07]} warna={warna} tepi={false} />;
}

const tulisan = (teks: string, warna = WARNA.emas, latar: string = WARNA.hijauTua, ukuran = 56) =>
  teksturTulisan([{ teks, ukuran, warna, spasi: 4 }], { lebar: 1024, tinggi: Math.round(ukuran * 1.6), latar });

const teksturQr = () =>
  tekstur("qr", 128, 128, (ctx, w) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, w);
    ctx.fillStyle = "#111111";
    let x = 9;
    for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) {
      x = (x * 37 + 11) % 101;
      if (x % 3 === 0) ctx.fillRect(8 + i * 7, 8 + j * 7, 7, 7);
    }
    for (const [fx, fy] of [[8, 8], [78, 8], [8, 78]]) {
      ctx.fillRect(fx, fy, 42, 42);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(fx + 6, fy + 6, 30, 30);
      ctx.fillStyle = "#111111";
      ctx.fillRect(fx + 12, fy + 12, 18, 18);
    }
  });

const teksturGrafik = () =>
  tekstur("grafik", 512, 352, (ctx, w, h) => {
    ctx.fillStyle = "#F7F3E6";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = WARNA.hijauTua;
    ctx.font = `600 34px "DM Sans", sans-serif`;
    ctx.fillText("LAPORAN KEUANGAN", 28, 52);
    [0.35, 0.5, 0.42, 0.68, 0.82].forEach((t, i) => {
      ctx.fillStyle = i === 4 ? WARNA.emas : WARNA.hijau;
      ctx.fillRect(40 + i * 92, h - 30 - t * 230, 60, t * 230);
    });
    ctx.fillStyle = "#1C1F1D";
    ctx.fillRect(28, h - 30, w - 56, 3);
  });

const teksturCeklis = () =>
  tekstur("ceklis", 384, 288, (ctx, w, h) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#1C1F1D";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    for (let i = 0; i < 4; i++) {
      const y = 50 + i * 60;
      ctx.strokeStyle = WARNA.hijau;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(44, y + 14);
      ctx.lineTo(70, y - 14);
      ctx.stroke();
      ctx.fillStyle = "#9AA39E";
      ctx.fillRect(92, y - 4, 220 - i * 30, 10);
    }
  });

const teksturTanggapan = () =>
  tekstur("tanggapan", 512, 320, (ctx, w, h) => {
    ctx.fillStyle = WARNA.hijauTua;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 3; i++) {
      const y = 24 + i * 98;
      ctx.fillStyle = "#F7F3E6";
      ctx.beginPath();
      ctx.roundRect(i % 2 ? 150 : 28, y, 330, 72, 18);
      ctx.fill();
      ctx.strokeStyle = WARNA.emas;
      ctx.lineWidth = 9;
      ctx.beginPath();
      const x = i % 2 ? 175 : 53;
      ctx.moveTo(x, y + 36);
      ctx.lineTo(x + 14, y + 52);
      ctx.lineTo(x + 40, y + 20);
      ctx.stroke();
      ctx.fillStyle = "#9AA39E";
      ctx.fillRect(x + 62, y + 30, 200, 12);
    }
  });

const teksturPapanTulis = () =>
  tekstur("papantulis", 512, 224, (ctx, w, h) => {
    ctx.fillStyle = "#1F3A2C";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(40, 50 + i * 42);
      ctx.lineTo(160 + ((i * 97) % 260), 50 + i * 42);
      ctx.stroke();
    }
  });

/** Usulan sendiri: bintang emas dan papan kecil di dekat bagian yang diperbaiki. */
const LETAK_USULAN: Record<string, V3> = {
  atap: [-2.5, 10.3, 3.6], jendela: [-5.0, 8.0, 4.8], tiang: [5.9, 9.0, 4.6], "ruang-kerja": [-2.2, 5.0, 4.6],
  perpustakaan: [2.2, 6.6, 4.6], "lemari-arsip": [2.2, 3.4, 4.6], lantai: [-4.4, 4.0, 4.7], dinding: [6.8, 7.0, -1.5],
  rangka: [-6.8, 9.0, 3.0], pintu: [-2.4, 2.9, 5.2], instalasi: [3.8, 10.9, -1.6],
};

function UsulanKader({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.32]} />
        <meshLambertMaterial color={WARNA.emas} emissive={WARNA.emas} emissiveIntensity={0.5} />
      </mesh>
      <Papan p={[0, -0.55, 0]} s={[1.5, 0.3]} peta={tulisan("USULAN KADER", WARNA.emas, WARNA.hijauTua, 48)} />
    </group>
  );
}

function Rumah({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <Kotak p={[0, 0.35, 0]} s={[0.9, 0.7, 0.8]} warna="#F2EDE0" />
      <Kotak p={[0, 0.85, 0]} s={[0.66, 0.66, 0.86]} r={[0, 0, Math.PI / 4]} warna={WARNA.hijau} />
      <Kotak p={[0, 0.25, 0.41]} s={[0.22, 0.4, 0.02]} warna={WARNA.kayuTua} tepi={false} />
    </group>
  );
}

const PROP: Record<string, (() => JSX.Element)[]> = {
  atap: [
    () => (
      <group position={[-3.8, 8.6, 1.2]}>
        <Tiang p={[-0.9, 0, 0]} h={1.2} />
        <Tiang p={[0.9, 0, 0]} h={1.2} />
        <Kotak p={[0, 1.7, 0]} s={[2.4, 1.2, 0.08]} warna={WARNA.emas} />
        <Papan p={[0, 1.7, 0.05]} s={[2.25, 1.1]} peta={teksturTulisan([{ teks: "KAJIAN", ukuran: 96, warna: WARNA.hijauTua, serif: true }, { teks: "sebelum bersikap", ukuran: 46, warna: "#1C1F1D", tebal: 500 }], { lebar: 512, tinggi: 256, latar: "#F7F3E6" })} />
      </group>
    ),
    () => (
      <group position={[-3.8, 8.6, 1.4]}>
        <Silinder p={[0, 0.05, 0]} s={[0.8, 0.1, 0.8]} warna={WARNA.emas} />
        <Silinder p={[0, 0.9, 0]} s={[0.1, 1.7, 0.1]} warna={WARNA.emas} />
        <Kotak p={[0, 1.75, 0]} s={[2.0, 0.08, 0.08]} warna={WARNA.emas} terang={0.3} />
        {[-0.95, 0.95].map((x) => (
          <group key={x}>
            <Kotak p={[x, 1.45, 0]} s={[0.02, 0.6, 0.02]} warna={WARNA.hitam} tepi={false} />
            <Silinder p={[x, 1.13, 0]} s={[0.6, 0.06, 0.6]} warna={WARNA.emas} />
          </group>
        ))}
      </group>
    ),
    () => (
      <>
        <Papan p={[0, 8.85, 4.13]} s={[6.4, 0.42]} peta={tulisan("SUARA MAHASISWA")} />
        <group position={[4.6, 9.4, 3.3]} rotation={[0, -0.5, 0]}>
          <Kerucut p={[0, 0, 0.3]} r={[-Math.PI / 2, 0, 0]} s={[0.6, 0.8, 0.6]} warna={WARNA.emas} />
          <Silinder p={[0, -0.4, 0]} s={[0.08, 0.7, 0.08]} warna={WARNA.baja} tepi={false} />
        </group>
      </>
    ),
  ],
  jendela: [
    () => (
      <>
        {[-5.25, -4.025, 4.025, 5.25].map((x, i) => (
          <group key={x}>
            <Figur p={[x - 0.16, lantai(1), 3.72]} warna={WARNA.hijau} />
            <Figur p={[x + 0.16, lantai(1), 3.72]} warna={i % 2 ? "#7B2D26" : "#2C3E50"} />
          </group>
        ))}
        <Kotak p={[0, 2.8, 2.42]} s={[11.6, 1.2, 0.02]} warna="#FFE7A8" terang={0.6} tepi={false} />
      </>
    ),
    () => (
      <>
        <Kotak p={[7.35, 5.95, 0]} s={[2.6, 0.9, 1.4]} warna={WARNA.kaca} opacity={0.6} />
        <Kotak p={[7.35, 5.45, 0]} s={[2.6, 0.12, 1.5]} warna={WARNA.putih} />
        <group position={[10.5, 0, 0]}>
          <Kotak p={[0, -0.35, 0]} s={[4.2, 0.7, 5]} warna={WARNA.fondasi} />
          <Kotak p={[0, 3.2, 0]} s={[3.6, 6.4, 4.2]} warna="#E3D9C2" />
          {[1.4, 3.0, 4.6].flatMap((y) => [-1, 0, 1].map((i) => <Kotak key={`${y}${i}`} p={[i * 1.1, y, 2.11]} s={[0.6, 0.8, 0.02]} warna={WARNA.kaca} tepi={false} />))}
          <Kotak p={[0, 6.7, 0]} s={[3.9, 0.6, 4.5]} warna="#C9B994" />
          <Papan p={[0, 6.7, 2.26]} s={[2.2, 0.42]} peta={tulisan("KAMPUS", WARNA.hijauTua, "#F7F3E6")} />
        </group>
      </>
    ),
    () => (
      <>
        <group position={[-4.4, 10.2, 1.8]}>
          <Silinder p={[0, -0.9, 0]} s={[0.1, 0.9, 0.1]} warna={WARNA.baja} tepi={false} />
          <Bola s={[1.4, 1.4, 1.4]} warna={WARNA.kaca} />
          <mesh scale={1.42}>
            <sphereGeometry args={[0.5, 12, 8]} />
            <meshBasicMaterial color={WARNA.emas} wireframe transparent opacity={0.7} />
          </mesh>
        </group>
        {[-5.4, -4.6, 4.6, 5.4].map((x, i) => (
          <group key={x}>
            <Tiang p={[x, 9.1, 4.0]} h={1.1} warna={WARNA.hitam} />
            <Kotak p={[x + 0.22, 10.0, 4.0]} s={[0.42, 0.28, 0.02]} warna={["#7B2D26", "#1F4E79", "#C49A3A", "#0E8A4F"][i]} tepi={false} />
          </group>
        ))}
      </>
    ),
  ],
  "ruang-kerja": [
    () => (
      <>
        {[-5.3, -2.6, 2.6, 5.3].map((x, i) => (
          <group key={x}>
            <Kotak p={[x, lantai(2) + 1.0, 2.42]} s={[0.62, 0.46, 0.03]} warna={WARNA.emas} />
            <Kotak p={[x, lantai(2) + 1.0, 2.44]} s={[0.5, 0.34, 0.01]} warna={["#7B2D26", "#1F4E79", "#0E8A4F", "#C49A3A"][i]} tepi={false} />
          </group>
        ))}
      </>
    ),
    () => (
      <group position={[-5.25, lantai(2), 3.6]}>
        {[0, 1, 2, 3].map((i) => <Kotak key={i} p={[-0.3 + i * 0.2, 0.08 + i * 0.16, 0]} s={[0.2, 0.16 + i * 0.32, 0.3]} warna={i === 3 ? WARNA.emas : WARNA.hijau} />)}
        <Figur p={[0.3, 0.64, 0]} warna="#2C3E50" />
        <Kotak p={[0.05, 0.35, -0.35]} s={[0.26, 0.18, 0.08]} warna={WARNA.kayuTua} />
      </group>
    ),
    () => (
      <>
        <Papan p={[-2.55, lantai(2) + 1.25, 2.43]} s={[0.8, 0.26]} peta={tulisan("KOHATI", "#FFFFFF", WARNA.hijau, 64)} />
        <Kotak p={[-2.55, lantai(2) + 0.3, 3.55]} s={[0.4, 0.6, 0.3]} warna={WARNA.hijau} />
        <Figur p={[-2.55, lantai(2), 3.25]} warna="#6B2D5C" />
      </>
    ),
  ],
  instalasi: [
    () => (
      <>
        <group position={[1.2, 8.6, -2.6]}>
          <Kotak p={[0, 0.6, 0]} s={[0.8, 1.2, 0.6]} warna="#2B302D" />
          {[0.3, 0.55, 0.8, 1.05].map((y) => <Kotak key={y} p={[0, y, 0.31]} s={[0.6, 0.05, 0.01]} warna="#7CFFB0" terang={1} tepi={false} />)}
        </group>
        <Kotak p={[6.16, 4.6, 2.0]} s={[0.04, 8.4, 0.04]} warna="#7CFFB0" terang={1} tepi={false} />
        {[2.0, 3.6, 5.2, 6.8].map((y) => <Bola key={y} p={[6.18, y + 0.6, 2.0]} s={[0.16, 0.16, 0.16]} warna="#7CFFB0" terang={1} />)}
      </>
    ),
    () => (
      <>
        {[[9.2, 6.4], [10.6, 5.0], [11.2, 3.4]].map(([x, z], i) => (
          <group key={i}>
            <Rumah p={[x, -0.7, z]} />
            <Kotak p={[(6.8 + x) / 2, -0.66, (4.6 + z) / 2]} s={[Math.hypot(x - 6.8, z - 4.6), 0.03, 0.06]} r={[0, -Math.atan2(z - 4.6, x - 6.8), 0]} warna="#7CFFB0" terang={1} tepi={false} />
          </group>
        ))}
      </>
    ),
    () => (
      <group position={[-1.5, 8.6, -2.2]}>
        <Silinder p={[0, 0.4, 0]} s={[0.12, 0.8, 0.12]} warna={WARNA.baja} tepi={false} />
        <mesh position={[0, 1.05, 0]} rotation={[-0.9, 0, 0]}>
          <sphereGeometry args={[0.75, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
          <meshLambertMaterial color="#E8E8E2" side={THREE.DoubleSide} />
        </mesh>
        {[0.3, 0.55, 0.8].map((r) => <Cincin key={r} p={[0, 1.7, 0.9]} r={r} />)}
      </group>
    ),
  ],
  dinding: [
    () => (
      <group position={[3.6, lantai(4), 3.55]}>
        <Silinder p={[0, 0.4, 0]} s={[0.7, 0.05, 0.7]} warna={WARNA.kayu} />
        <Silinder p={[0, 0.2, 0]} s={[0.08, 0.4, 0.08]} warna={WARNA.kayuTua} tepi={false} />
        {[[-0.5, 0], [0.5, 0], [0, -0.45]].map(([x, z], i) => <Figur key={i} p={[x, 0, z]} duduk warna={[WARNA.hijau, "#7B2D26", "#2C3E50"][i]} />)}
        <Kotak p={[0.1, 0.44, 0.1]} s={[0.22, 0.02, 0.16]} warna="#FFFFFF" tepi={false} />
      </group>
    ),
    () => <Papan p={[6.09, 6.0, 0]} r={[0, Math.PI / 2, 0]} s={[2.2, 1.4]} peta={teksturTanggapan()} />,
    () => (
      <>
        {[-3.2, -0.65, 0.65, 3.2].map((z) => (
          <group key={z}>
            <Kotak p={[6.09, 2.8, z]} s={[0.03, 0.8, 0.6]} warna={WARNA.emas} terang={0.25} />
            <Kotak p={[6.11, 2.8, z]} s={[0.01, 0.6, 0.44]} warna={WARNA.hijauTua} tepi={false} />
            <Kotak p={[6.3, 3.35, z]} s={[0.25, 0.06, 0.12]} warna={WARNA.hitam} tepi={false} />
          </group>
        ))}
      </>
    ),
  ],
  tiang: [
    () => (
      <>
        {[-4.65, -3.4, 3.4, 4.65].map((x) => (
          <group key={x} position={[x, 7.6, 4.3]} rotation={[Math.PI / 2, 0, 0]}>
            <Silinder s={[0.56, 0.04, 0.56]} warna={WARNA.hijauTua} tepi={false} />
            <Silinder p={[0, -0.01, 0]} s={[0.38, 0.04, 0.38]} warna="#FFFFFF" tepi={false} />
            <Silinder p={[0, -0.02, 0]} s={[0.18, 0.04, 0.18]} warna={WARNA.emas} terang={0.4} tepi={false} />
          </group>
        ))}
      </>
    ),
    () => <>{[-5.85, -4.65, -3.4, -2.15, 2.15, 3.4, 4.65, 5.85].map((x) => <Papan key={x} p={[x, 1.4, 4.28]} s={[0.26, 0.26]} peta={teksturQr()} />)}</>,
    () => (
      <group position={[-6.0, 0, 6.3]}>
        <Tiang p={[-0.7, 0, 0]} h={1.0} warna={WARNA.hitam} />
        <Tiang p={[0.7, 0, 0]} h={1.0} warna={WARNA.hitam} />
        <Kotak p={[0, 1.5, 0]} s={[1.7, 1.15, 0.05]} warna={WARNA.emas} />
        <Papan p={[0, 1.5, 0.03]} s={[1.6, 1.1]} peta={teksturGrafik()} />
      </group>
    ),
  ],
  rangka: [
    () => (
      <>
        <Kotak p={[-6.35, 4.6, 4.3]} s={[0.12, 9.2, 0.12]} warna={WARNA.emas} terang={0.3} />
        {[2.0, 3.6, 5.2, 6.8, 8.4].map((y) => <Kotak key={y} p={[-6.15, y, 4.3]} s={[0.5, 0.08, 0.08]} warna={WARNA.emas} terang={0.3} />)}
        {[2.8, 4.4, 6.0, 7.6].map((y) => <Bola key={`b${y}`} p={[-6.35, y, 4.3]} s={[0.24, 0.24, 0.24]} warna={WARNA.emas} terang={0.5} />)}
      </>
    ),
    () => (
      <>
        {[[4.4, 2.2, "#1F6F78"], [6.0, -1.0, "#7B2D26"], [7.6, 1.6, WARNA.emas]].map(([y, z, warna]) => (
          <group key={String(y)} position={[-6.6, Number(y), Number(z)]}>
            <Kotak s={[1.1, 1.0, 1.5]} warna={String(warna)} />
            <Kotak p={[-0.56, 0, 0]} s={[0.01, 0.5, 1.0]} warna={WARNA.kaca} tepi={false} />
          </group>
        ))}
      </>
    ),
    () => (
      <>
        {[2.6, 4.2, 5.8, 7.4].map((y) => (
          <group key={y}>
            <Kerucut p={[-6.3, y, 4.35]} r={[Math.PI, 0, 0]} s={[0.3, 0.4, 0.3]} warna={WARNA.emas} terang={0.4} />
            <Kerucut p={[-6.75, y + 0.3, 4.35]} s={[0.22, 0.3, 0.22]} warna="#FFFFFF" />
          </group>
        ))}
        <Kotak p={[-6.3, 5.0, 4.35]} s={[0.05, 7.0, 0.05]} warna={WARNA.emas} terang={0.6} tepi={false} />
        <Kotak p={[-6.75, 5.3, 4.35]} s={[0.04, 6.4, 0.04]} warna="#FFFFFF" tepi={false} />
      </>
    ),
  ],
  perpustakaan: [
    () => (
      <group position={[3.4, lantai(3), 3.5]}>
        <Silinder p={[0, 0.4, 0]} s={[0.7, 0.05, 0.7]} warna={WARNA.kayu} />
        <Silinder p={[0, 0.2, 0]} s={[0.08, 0.4, 0.08]} warna={WARNA.kayuTua} tepi={false} />
        {[[-0.5, 0], [0.5, 0], [0, -0.45], [0, 0.42]].map(([x, z], i) => <Figur key={i} p={[x, 0, z]} duduk warna={[WARNA.hijau, "#7B2D26", "#2C3E50", "#1F4E79"][i]} />)}
        {[-0.12, 0.12].map((x) => <Kotak key={x} p={[x, 0.45, 0.05]} s={[0.16, 0.04, 0.12]} warna="#C49A3A" tepi={false} />)}
      </group>
    ),
    () => (
      <group position={[3.4, lantai(3), 3.45]}>
        <Kotak p={[0, 0.55, 0]} s={[1.1, 0.05, 0.42]} warna="#E8E1CF" />
        {[-0.28, 0.28].map((x) => <Papan key={x} p={[x, 0.82, -0.1]} s={[0.42, 0.3]} peta={teksturGrafik()} />)}
        <Figur p={[0, 0.3, 0.4]} duduk warna={WARNA.hijau} />
      </group>
    ),
    () => (
      <group position={[3.4, lantai(3), 3.45]}>
        <Kotak p={[-0.2, 0.32, 0]} s={[0.7, 0.62, 0.45]} warna="#3A3F3C" />
        <Silinder p={[-0.2, 0.68, 0]} r={[0, 0, Math.PI / 2]} s={[0.2, 0.72, 0.2]} warna={WARNA.baja} />
        {[0, 1, 2, 3, 4].map((i) => <Kotak key={i} p={[0.45, 0.06 + i * 0.1, 0]} s={[0.3, 0.09, 0.22]} warna={["#7B2D26", "#1F4E79", WARNA.hijau, "#C49A3A", "#4A3B6B"][i]} />)}
      </group>
    ),
  ],
  "lemari-arsip": [
    () => (
      <group position={[-3.4, lantai(1), 3.5]}>
        <Kotak p={[0, 0.45, 0]} s={[0.8, 0.05, 0.36]} warna={WARNA.kayu} />
        <Kotak p={[0, 0.6, 0]} s={[0.32, 0.24, 0.24]} warna="#F7F3E6" />
        <Kotak p={[0, 0.6, 0]} s={[0.34, 0.05, 0.26]} warna={WARNA.emas} tepi={false} />
        <Kotak p={[0, 0.6, 0]} s={[0.05, 0.26, 0.26]} warna={WARNA.emas} tepi={false} />
        <Figur p={[-0.55, 0, 0.1]} warna={WARNA.hijau} />
        <Figur p={[0.55, 0, 0.1]} warna="#2C3E50" />
      </group>
    ),
    () => (
      <group position={[-3.4, lantai(1), 3.45]}>
        <Kotak p={[-0.25, 0.45, 0]} s={[0.36, 0.9, 0.36]} warna="#2B302D" />
        {[0.25, 0.45, 0.65].map((y) => <Kotak key={y} p={[-0.25, y, 0.185]} s={[0.26, 0.04, 0.01]} warna="#7CFFB0" terang={1} tepi={false} />)}
        <Kotak p={[0.3, 0.4, 0]} s={[0.5, 0.04, 0.3]} warna={WARNA.kayu} />
        <Kotak p={[0.3, 0.58, -0.05]} s={[0.34, 0.24, 0.02]} warna="#3E7FD8" terang={0.7} tepi={false} />
      </group>
    ),
    () => (
      <group position={[-2.775, lantai(1), 3.62]}>
        <Tiang p={[-0.32, 0, 0]} h={0.9} warna={WARNA.hitam} />
        <Tiang p={[0.32, 0, 0]} h={0.9} warna={WARNA.hitam} />
        <Papan p={[0, 1.05, 0.04]} s={[0.8, 0.6]} peta={teksturCeklis()} />
      </group>
    ),
  ],
  pintu: [
    () => (
      <>
        {[[3.6, "#7B2D26"], [4.8, "#1F4E79"], [6.0, "#C49A3A"]].map(([x, warna]) => (
          <group key={String(x)} position={[Number(x), 0, 6.1]}>
            {[[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]].map(([dx, dz]) => <Tiang key={`${dx}${dz}`} p={[dx, 0, dz]} h={0.8} warna="#E8E1CF" />)}
            <Kerucut p={[0, 1.05, 0]} r={[0, Math.PI / 4, 0]} s={[1.3, 0.5, 1.3]} warna={String(warna)} />
            <Kotak p={[0, 0.4, 0.3]} s={[0.8, 0.08, 0.3]} warna="#F7F3E6" tepi={false} />
          </group>
        ))}
      </>
    ),
    () => (
      <>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 2.7, 0, 6.6]}>
            <Tiang p={[0, 0, 0]} h={1.8} warna={WARNA.kayuTua} />
            <group position={[s * 0.55, 1.5, 0]}>
              <Kotak s={[1.1, 0.3, 0.04]} warna={WARNA.hijauTua} />
              <Kerucut p={[s * 0.62, 0, 0]} r={[0, 0, -s * Math.PI / 2]} s={[0.3, 0.2, 0.06]} warna={WARNA.hijauTua} />
              <Papan p={[0, 0, 0.03]} s={[1.0, 0.24]} peta={tulisan("KAMPUS BARU", WARNA.emas, WARNA.hijauTua, 52)} />
            </group>
          </group>
        ))}
      </>
    ),
    () => (
      <group position={[-2.9, 0, 6.5]}>
        <Tiang p={[-1.25, 0, 0]} h={1.5} warna={WARNA.hitam} />
        <Tiang p={[1.25, 0, 0]} h={1.5} warna={WARNA.hitam} />
        <Papan p={[0, 1.2, 0.02]} s={[2.5, 0.62]} peta={teksturTulisan([{ teks: "PENDAFTARAN DIBUKA", ukuran: 60, warna: WARNA.emas, spasi: 4 }, { teks: "sepanjang tahun", ukuran: 44, warna: "#FFFFFF", tebal: 500 }], { lebar: 1024, tinggi: 256, latar: WARNA.hijau })} />
      </group>
    ),
  ],
  lantai: [
    () => (
      <>
        {[["30", 6.75], ["60", 6.25], ["90", 5.8]].map(([angka, z]) => (
          <group key={String(angka)} position={[0, 0.03, Number(z)]}>
            <Silinder s={[0.62, 0.05, 0.62]} warna="#B8B09C" />
            <Papan p={[0, 0.03, 0]} r={[-Math.PI / 2, 0, 0]} s={[0.46, 0.3]} peta={tulisan(String(angka), WARNA.hijauTua, WARNA.emas, 120)} />
          </group>
        ))}
      </>
    ),
    () => (
      <>
        {[2.0, 3.6, 5.2, 6.8].map((y) => (
          <Papan key={y} p={[0, y, 4.085]} s={[12.1, 0.2]} peta={tekstur("ubin", 512, 16, (ctx, w, h) => {
            ctx.fillStyle = WARNA.putih;
            ctx.fillRect(0, 0, w, h);
            for (let x = 0; x < w; x += 16) {
              ctx.fillStyle = WARNA.emas;
              ctx.fillRect(x + 4, 3, 8, h - 6);
            }
          })} />
        ))}
      </>
    ),
    () => (
      <>
        <Papan p={[-3.9, lantai(4) + 0.95, 2.42]} s={[1.6, 0.7]} peta={teksturPapanTulis()} />
        <Figur p={[-3.0, lantai(4), 2.75]} warna={WARNA.hijau} />
        {[-4.2, -5.2].map((x) => <Figur key={x} p={[x, lantai(4) + 0.25, 3.2]} duduk warna="#2C3E50" />)}
      </>
    ),
  ],
};

export default function PropPerbaikan({ bagian, cara }: { bagian: string; cara: number | null }) {
  if (cara === null) return LETAK_USULAN[bagian] ? <UsulanKader p={LETAK_USULAN[bagian]} /> : null;
  const Isi = PROP[bagian]?.[cara];
  return Isi ? <Isi /> : null;
}
