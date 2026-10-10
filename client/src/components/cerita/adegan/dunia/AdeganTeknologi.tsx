import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { Kanvas2D, Keterangan2D, SERIF, W2, useProgres, useRentang, useWaktu } from "./bersama2d";

/**
 * Bagian 4 · Teknologi tidak menang sendirian. Enam kepingan (cip, AI, data,
 * energi, orang, tata kelola) mula-mula berserakan dan bergerak sendiri-sendiri.
 * Makin digulir, kepingan bergerak bersama dan menyatu menjadi satu lingkaran
 * yang berputar pelan. Lapis 1 menambahkan tiga langkah: menyerap,
 * mengorganisasi, memakai bersama. Lapis 2 menambahkan cincin "waktu yang lama".
 */

const CX = 300;
const CY = 232;
const R0 = 74;
const R1 = 146;
const KEPING = [
  { nama: "Cip", sebar: [110, 92], putar: -38, warna: W2.emas },
  { nama: "AI", sebar: [498, 84], putar: 52, warna: W2.hijauMuda },
  { nama: "Data", sebar: [536, 300], putar: -64, warna: W2.emas },
  { nama: "Energi", sebar: [372, 448], putar: 28, warna: W2.hijauMuda },
  { nama: "Orang", sebar: [98, 400], putar: 70, warna: W2.gading },
  { nama: "Tata kelola", sebar: [196, 236], putar: -22, warna: W2.gading },
];

function sektor(a0: number, a1: number) {
  const r = (deg: number) => (deg * Math.PI) / 180;
  const p = (rad: number, a: number) => `${(CX + rad * Math.cos(r(a))).toFixed(1)},${(CY + rad * Math.sin(r(a))).toFixed(1)}`;
  return `M${p(R1, a0)} A${R1},${R1} 0 0 1 ${p(R1, a1)} L${p(R0, a1)} A${R0},${R0} 0 0 0 ${p(R0, a0)} Z`;
}

function Keping({ i, p, waktu, putarCincin }: { i: number; p: MotionValue<number>; waktu: MotionValue<number>; putarCincin: MotionValue<number> }) {
  const k = KEPING[i];
  const a0 = -90 + i * 60 + 2;
  const a1 = a0 + 56;
  const tengahSudut = ((a0 + 28) * Math.PI) / 180;
  const rTengah = (R0 + R1) / 2;
  const cx = CX + rTengah * Math.cos(tengahSudut);
  const cy = CY + rTengah * Math.sin(tengahSudut);
  const menyatu = useRentang(p, 0.12 + i * 0.045, 0.52 + i * 0.03);
  const x = useTransform([menyatu, waktu], ([m, t]: number[]) => (k.sebar[0] - cx) * (1 - m) + Math.sin(t / 900 + i * 1.3) * 10 * (1 - m));
  const y = useTransform([menyatu, waktu], ([m, t]: number[]) => (k.sebar[1] - cy) * (1 - m) + Math.cos(t / 1100 + i) * 10 * (1 - m));
  const rotate = useTransform([menyatu, waktu], ([m, t]: number[]) => k.putar * (1 - m) + Math.sin(t / 1300 + i * 2) * 14 * (1 - m));
  // Tulisan selalu tegak walaupun kepingan dan cincin berputar.
  const tegak = useTransform([rotate, putarCincin], ([a, b]: number[]) => -(a + b));
  return (
    <motion.g style={{ x, y, rotate, transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }}>
      <path d={sektor(a0, a1)} fill={k.warna} fillOpacity={0.16} stroke={k.warna} strokeWidth={1.6} strokeLinejoin="round" />
      <motion.text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={W2.gading} fontSize={k.nama.length > 6 ? 15 : 18} fontWeight={600} style={{ rotate: tegak, transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }}>
        {k.nama}
      </motion.text>
    </motion.g>
  );
}

const LANGKAH = ["Menyerap", "Mengorganisasi", "Memakai bersama"];

export default function AdeganTeknologi({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const waktu = useWaktu(tenang);
  const utuh = useRentang(p, 0.6, 0.72);
  const putarBersama = useTransform([utuh, waktu], ([u, t]: number[]) => u * ((t / 120) % 360));
  const cahayaInti = useTransform(utuh, [0, 1], [0, 1]);
  const langkah = [useTransform(p, [0.55, 0.65], [0.3, 1]), useTransform(p, [0.68, 0.78], [0.3, 1]), useTransform(p, [0.8, 0.9], [0.3, 1])];

  return (
    <Kanvas2D>
        <defs>
          <radialGradient id="tek-inti">
            <stop offset="0%" stopColor={W2.emas} stopOpacity={0.55} />
            <stop offset="100%" stopColor={W2.emas} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* Bayangan lingkaran utuh sebagai tujuan */}
        <circle cx={CX} cy={CY} r={(R0 + R1) / 2} fill="none" stroke={W2.emas} strokeOpacity={0.12} strokeWidth={R1 - R0} />
        {lapis >= 2 && (
          <motion.circle cx={CX} cy={CY} r={R1 + 26} fill="none" stroke={W2.emas} strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="3 9" style={{ rotate: putarBersama, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        )}
        {lapis >= 2 && (
          <motion.text x={CX} y={CY - R1 - 38} textAnchor="middle" fill={W2.emasMuda} fontSize={15.5} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            … dalam waktu yang lama
          </motion.text>
        )}
        <motion.circle cx={CX} cy={CY} r={R0 - 6} fill="url(#tek-inti)" style={{ opacity: cahayaInti }} />
        <motion.g style={{ rotate: putarBersama, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}>
          {KEPING.map((_, i) => <Keping key={i} i={i} p={p} waktu={waktu} putarCincin={putarBersama} />)}
        </motion.g>
        <motion.g style={{ opacity: cahayaInti }}>
          <text x={CX} y={CY - 6} textAnchor="middle" fill={W2.gading} fontSize={19} fontFamily={SERIF} fontStyle="italic">Bergerak</text>
          <text x={CX} y={CY + 18} textAnchor="middle" fill={W2.gading} fontSize={19} fontFamily={SERIF} fontStyle="italic">bersama</text>
        </motion.g>
        {lapis >= 1 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {LANGKAH.map((teks, i) => {
              const x = 110 + i * 190;
              return (
                <motion.g key={teks} style={{ opacity: langkah[i] }}>
                  <circle cx={x} cy={420} r={15} fill={W2.malam} stroke={W2.emas} strokeWidth={1.5} />
                  <text x={x} y={421} textAnchor="middle" dominantBaseline="middle" fill={W2.emas} fontSize={15.5} fontFamily={SERIF}>{i + 1}</text>
                  <text x={x} y={455} textAnchor="middle" fill={W2.gading} fontSize={16.5} fontWeight={500}>{teks}</text>
                  {i < 2 && <path d={`M${x + 26},420 L${x + 164},420`} stroke={W2.emas} strokeOpacity={0.4} strokeDasharray="4 6" />}
                </motion.g>
              );
            })}
          </motion.g>
        )}
      <Keterangan2D
        p={p}
        tahap={[
          { dari: 0, teks: "Sendiri-sendiri: kepingan berserakan" },
          { dari: 0.6, teks: "Bergerak bersama: menjadi satu kekuatan" },
        ]}
      />
    </Kanvas2D>
  );
}
