import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { Kanvas2D, Keterangan2D, SERIF, W2, useProgres, useRentang } from "./bersama2d";

/**
 * Bagian 7 · Modal yang habis di tempat salah. Energi mengalir dari satu
 * sumber (ratusan cabang, alumni di semua sektor). Aliran tebal berbelok ke
 * perebutan posisi, dualisme, dan faksi lalu berputar-putar di sana; aliran
 * tipis sampai ke kaderisasi, tata kelola, dan digital yang terisi sedikit.
 * Lapis 2 memperlihatkan bila energi itu dialihkan ke pekerjaan dasar.
 */

const SUMBER = { x: 96, y: 250 };
const ALIRAN = [
  { y: 84, nama: "Berebut posisi", tebal: 15, bocor: true },
  { y: 152, nama: "Dualisme", tebal: 12, bocor: true },
  { y: 220, nama: "Faksi", tebal: 10, bocor: true },
  { y: 296, nama: "Kaderisasi", tebal: 3.5, bocor: false, isi: 0.22 },
  { y: 358, nama: "Tata kelola", tebal: 3, bocor: false, isi: 0.16 },
  { y: 420, nama: "Digital", tebal: 2.5, bocor: false, isi: 0.1 },
];
const XUJUNG = 404;
const jalur = (y: number) => `M${SUMBER.x + 46},${SUMBER.y} C${SUMBER.x + 170},${SUMBER.y} ${XUJUNG - 150},${y} ${XUJUNG},${y}`;

function Aliran({ i, p, lapis }: { i: number; p: MotionValue<number>; lapis: number }) {
  const a = ALIRAN[i];
  const tampil = useRentang(p, 0.1 + i * 0.04, 0.4 + i * 0.04);
  const isi = useRentang(p, 0.55, 0.85);
  const warna = a.bocor ? W2.panas : W2.hijauMuda;
  const lebarIsi = useTransform(isi, [0, 1], [0, (a.isi ?? 0) * 150]);
  return (
    <g>
      <path d={jalur(a.y)} fill="none" stroke={warna} strokeOpacity={0.1} strokeWidth={a.tebal} strokeLinecap="round" />
      <motion.path d={jalur(a.y)} fill="none" stroke={warna} strokeOpacity={a.bocor ? 0.75 : 0.9} strokeWidth={a.tebal} strokeLinecap="round" style={{ pathLength: tampil }} />
      <motion.path
        d={jalur(a.y)}
        fill="none"
        stroke="#FFF1C4"
        strokeOpacity={0.55}
        strokeWidth={Math.max(1.2, a.tebal * 0.25)}
        strokeDasharray="2 14"
        style={{ opacity: tampil }}
        animate={{ strokeDashoffset: [0, -32] }}
        transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
      />
      <text x={XUJUNG + 18} y={a.y - (a.bocor ? 2 : 6)} fill={a.bocor ? "#F7C9AE" : W2.gading} fontSize={16} fontWeight={600} dominantBaseline="middle">{a.nama}</text>
      {a.bocor ? (
        // Energi yang berputar-putar di tempat: lingkaran panah yang terus berputar.
        <motion.g style={{ opacity: tampil, transformOrigin: `${XUJUNG + 0}px ${a.y}px`, transformBox: "view-box" }} animate={{ rotate: 360 }} transition={{ duration: 3 + i, ease: "linear", repeat: Infinity }}>
          <path d={`M${XUJUNG + 10},${a.y} A10,10 0 1 1 ${XUJUNG},${a.y - 10}`} fill="none" stroke={W2.panas} strokeWidth={2} />
          <path d={`M${XUJUNG - 4},${a.y - 14} L${XUJUNG + 1},${a.y - 10} L${XUJUNG - 4},${a.y - 6}`} fill="none" stroke={W2.panas} strokeWidth={2} />
        </motion.g>
      ) : (
        <motion.g style={{ opacity: tampil }}>
          <rect x={XUJUNG + 18} y={a.y + 8} width={150} height={7} fill={W2.gading} fillOpacity={0.1} />
          <motion.rect x={XUJUNG + 18} y={a.y + 8} height={7} fill={W2.hijauMuda} style={{ width: lebarIsi }} />
          {lapis >= 2 && <motion.rect initial={{ width: 0 }} animate={{ width: 112 }} transition={{ duration: 1.2, ease: "easeOut" }} x={XUJUNG + 18} y={a.y + 8} height={7} fill="none" stroke={W2.emas} strokeDasharray="3 3" />}
          {lapis >= 1 && <text x={XUJUNG + 18} y={a.y + 32} fill={W2.redup} fontSize={13.5} fontStyle="italic">tertinggal</text>}
        </motion.g>
      )}
    </g>
  );
}

export default function AdeganModal({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const sumber = useRentang(p, 0, 0.1);
  const denyut = useTransform(sumber, [0, 1], [0.6, 1]);

  return (
    <Kanvas2D>
      <defs>
        <radialGradient id="modal-sumber">
          <stop offset="0%" stopColor="#FFF1C4" />
          <stop offset="55%" stopColor={W2.emas} />
          <stop offset="100%" stopColor="#8F7440" />
        </radialGradient>
      </defs>
      {ALIRAN.map((_, i) => <Aliran key={i} i={i} p={p} lapis={lapis} />)}
      <motion.g style={{ scale: denyut, transformOrigin: `${SUMBER.x}px ${SUMBER.y}px`, transformBox: "view-box" }}>
        <circle cx={SUMBER.x} cy={SUMBER.y} r={70} fill={W2.emas} fillOpacity={0.08} />
        <circle cx={SUMBER.x} cy={SUMBER.y} r={48} fill="url(#modal-sumber)" />
        <text x={SUMBER.x} y={SUMBER.y - 6} textAnchor="middle" fill={W2.malam} fontSize={16.5} fontWeight={700}>Modal</text>
        <text x={SUMBER.x} y={SUMBER.y + 13} textAnchor="middle" fill={W2.malam} fontSize={16.5} fontWeight={700}>HMI</text>
      </motion.g>
      <text x={SUMBER.x} y={SUMBER.y + 82} textAnchor="middle" fill={W2.gading} fillOpacity={0.75} fontSize={14}>ratusan cabang</text>
      <text x={SUMBER.x} y={SUMBER.y + 99} textAnchor="middle" fill={W2.gading} fillOpacity={0.75} fontSize={14}>alumni di semua sektor</text>
      {lapis >= 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={XUJUNG + 18} y={40} fill={W2.panas} fontSize={12} letterSpacing={2}>TERBUANG</text>
          <text x={XUJUNG + 18} y={268} fill={W2.hijauMuda} fontSize={12} letterSpacing={2}>PEKERJAAN DASAR</text>
        </motion.g>
      )}
      {lapis >= 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={24} y={420} fill={W2.emasMuda} fontSize={14.5} fontFamily={SERIF} fontStyle="italic">Garis putus-putus:</text>
          <text x={24} y={438} fill={W2.emasMuda} fontSize={14.5} fontFamily={SERIF} fontStyle="italic">bila energi dialihkan</text>
        </motion.g>
      )}
      <Keterangan2D
        p={p}
        tahap={[
          { dari: 0, teks: "Modal besar dari satu sumber" },
          { dari: 0.22, teks: "Sebagian besar habis untuk bertengkar" },
          { dari: 0.6, teks: "Pekerjaan dasar hanya kebagian sedikit" },
        ]}
      />
    </Kanvas2D>
  );
}
