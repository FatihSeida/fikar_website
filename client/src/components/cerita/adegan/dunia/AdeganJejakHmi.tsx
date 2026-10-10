import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { Kanvas2D, Keterangan2D, SERIF, W2, useProgres, useRentang } from "./bersama2d";

/**
 * Bagian 5 · Jejak HMI. Linimasa berbentuk ombak yang bergolak (1947, 1960-an)
 * lalu menenang (NDP) tergambar mengikuti bacaan. Di bawahnya tiga lingkaran,
 * keislaman, kemodernan, dan keindonesiaan, bergerak saling mendekat sampai
 * bertemu di tengah: Nilai Dasar Perjuangan.
 */

const X0 = 70;
const X1 = 530;
const YL = 128;
const amplitudo = (x: number) => 24 * (1 - Math.min(1, Math.max(0, (x - 360) / 150)));
const yOmbak = (x: number) => YL + amplitudo(x) * Math.sin((x - X0) / 19);
const JALUR = (() => {
  const titik: string[] = [];
  for (let x = X0; x <= X1; x += 4) titik.push(`${x},${yOmbak(x).toFixed(1)}`);
  return `M${titik.join(" L")}`;
})();

const HENTI = [
  { x: 92, tahun: "1947", teks: "Lahir di masa revolusi", tambah: "Ikut memanggul senjata", di: 0.12 },
  { x: 300, tahun: "1960-an", teks: "Dituntut bubar, bertahan", tambah: "Tetap berdiri", di: 0.3 },
  { x: 506, tahun: "Akhir 1960-an", teks: "Merumuskan NDP", tambah: "Dipimpin Nurcholish Madjid", di: 0.48 },
];

const PUSAT = { x: 300, y: 330 };
const LINGKAR = [
  { nama: "Keislaman", x: 254, y: 306, warna: W2.hijauMuda, tx: 214, ty: 290 },
  { nama: "Kemodernan", x: 346, y: 306, warna: W2.emas, tx: 388, ty: 290 },
  { nama: "Keindonesiaan", x: 300, y: 384, warna: W2.gading, tx: 300, ty: 432 },
];
const JARI = 70;

function Henti({ i, p, lapis }: { i: number; p: MotionValue<number>; lapis: number }) {
  const h = HENTI[i];
  const muncul = useRentang(p, h.di - 0.04, h.di + 0.04);
  const skala = useTransform(muncul, [0, 1], [0.2, 1]);
  const y = yOmbak(h.x);
  const atas = i % 2 === 0;
  return (
    <motion.g style={{ opacity: muncul }}>
      <motion.circle cx={h.x} cy={y} r={8} fill={W2.emas} style={{ scale: skala, transformOrigin: `${h.x}px ${y}px`, transformBox: "view-box" }} />
      <circle cx={h.x} cy={y} r={14} fill="none" stroke={W2.emas} strokeOpacity={0.4} />
      <text x={h.x} y={atas ? 46 : 190} textAnchor="middle" fill={W2.emas} fontSize={20} fontFamily={SERIF} fontWeight={600}>{h.tahun}</text>
      <text x={h.x} y={atas ? 68 : 212} textAnchor="middle" fill={W2.gading} fontSize={16}>{h.teks}</text>
      {lapis >= 1 && (
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={h.x} y={atas ? 88 : 232} textAnchor="middle" fill={W2.redup} fontSize={14} fontStyle="italic">
          {h.tambah}
        </motion.text>
      )}
    </motion.g>
  );
}

function Lingkar({ i, p }: { i: number; p: MotionValue<number> }) {
  const l = LINGKAR[i];
  const temu = useRentang(p, 0.52, 0.8);
  const x = useTransform(temu, [0, 1], [(l.x - PUSAT.x) * 1.7, 0]);
  const y = useTransform(temu, [0, 1], [(l.y - PUSAT.y) * 0.5, 0]);
  const muncul = useRentang(p, 0.46, 0.56);
  return (
    <motion.g style={{ x, y, opacity: muncul }}>
      <circle cx={l.x} cy={l.y} r={JARI} fill={l.warna} fillOpacity={0.13} stroke={l.warna} strokeOpacity={0.8} strokeWidth={1.6} style={{ mixBlendMode: "screen" }} />
      <text x={l.tx} y={l.ty} textAnchor="middle" fill={l.warna} fontSize={16.5} fontWeight={600} stroke={W2.malam} strokeWidth={4} strokeOpacity={0.8} paintOrder="stroke">{l.nama}</text>
    </motion.g>
  );
}

export default function AdeganJejakHmi({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const garis = useRentang(p, 0.04, 0.5);
  const inti = useRentang(p, 0.78, 0.9);
  const skalaInti = useTransform(inti, [0, 1], [0.4, 1]);

  return (
    <Kanvas2D>
      <defs>
        <radialGradient id="jejak-inti">
          <stop offset="0%" stopColor="#FFF1C4" stopOpacity={0.95} />
          <stop offset="60%" stopColor={W2.emas} stopOpacity={0.35} />
          <stop offset="100%" stopColor={W2.emas} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={JALUR} fill="none" stroke={W2.gading} strokeOpacity={0.12} strokeWidth={2} />
      <motion.path d={JALUR} fill="none" stroke={W2.emas} strokeWidth={2.4} strokeLinecap="round" style={{ pathLength: garis }} />
      {HENTI.map((_, i) => <Henti key={i} i={i} p={p} lapis={lapis} />)}

      {LINGKAR.map((_, i) => <Lingkar key={i} i={i} p={p} />)}
      <motion.g style={{ opacity: inti, scale: skalaInti, transformOrigin: "300px 334px", transformBox: "view-box" }}>
        <circle cx={300} cy={334} r={30} fill="url(#jejak-inti)" />
        <text x={300} y={340} textAnchor="middle" fill={W2.malam} fontSize={17} fontWeight={700} fontFamily={SERIF}>NDP</text>
      </motion.g>
      {lapis >= 2 && (
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={300} y={474} textAnchor="middle" fill={W2.emasMuda} fontSize={14.5} fontStyle="italic">
          Sumbangan terbesar: cara berpikir yang mempertemukan
        </motion.text>
      )}
      <Keterangan2D
        p={p}
        tahap={[
          { dari: 0, teks: "Lahir dan bertahan di masa sulit" },
          { dari: 0.52, teks: "NDP: tiga nilai bertemu" },
        ]}
      />
    </Kanvas2D>
  );
}
