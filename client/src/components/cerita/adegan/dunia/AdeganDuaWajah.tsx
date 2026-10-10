import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { Kanvas2D, Keterangan2D, SERIF, W2, useProgres, useRentang } from "./bersama2d";

/**
 * Bagian 6 · Dua wajah HMI. Sebuah rumah retak di tengah pada 1980-an (asas
 * tunggal, HMI MPO) dan kedua sisinya merenggang. Retaknya tidak hilang dan
 * ditandai garis emas, tetapi rumah tetap berdiri. Lalu jendelanya menyala satu
 * per satu dan cahayanya menyebar ke banyak tempat (alumni di berbagai bidang).
 * Lapis 2 menambahkan wajah lain: anggapan bahwa HMI adalah tangga kekuasaan.
 */

const RETAK = "M300,150 L294,190 L306,228 L296,268 L305,310 L297,352 L300,402";
const JENDELA = [
  { x: 214, y: 270 }, { x: 254, y: 270 }, { x: 214, y: 326 }, { x: 254, y: 326 },
  { x: 322, y: 270 }, { x: 362, y: 270 }, { x: 322, y: 326 }, { x: 362, y: 326 },
];
const TUJUAN = [
  { x: 86, y: 150, nama: "Kementerian" },
  { x: 514, y: 150, nama: "Parlemen" },
  { x: 70, y: 300, nama: "Kampus" },
  { x: 530, y: 300, nama: "Dunia usaha" },
  { x: 300, y: 446, nama: "Daerah" },
];

function Separuh({ sisi, p, children }: { sisi: -1 | 1; p: MotionValue<number>; children: ReactNode }) {
  const pisah = useRentang(p, 0.12, 0.32);
  const rapat = useRentang(p, 0.42, 0.58);
  const x = useTransform([pisah, rapat], ([a, b]: number[]) => sisi * (a * 30 - b * 26));
  const rotate = useTransform([pisah, rapat], ([a, b]: number[]) => sisi * (a * 5 - b * 4.6));
  return (
    <motion.g style={{ x, rotate, transformOrigin: `${300 + sisi * 60}px 402px`, transformBox: "view-box" }}>
      {children}
    </motion.g>
  );
}

function Jendela({ i, p }: { i: number; p: MotionValue<number> }) {
  const j = JENDELA[i];
  const urutan = [0, 5, 2, 7, 4, 1, 6, 3][i];
  const nyala = useRentang(p, 0.6 + urutan * 0.035, 0.66 + urutan * 0.035);
  return (
    <g>
      <rect x={j.x} y={j.y} width={26} height={34} fill="#0d241a" stroke={W2.emas} strokeOpacity={0.5} strokeWidth={1} />
      <motion.rect x={j.x} y={j.y} width={26} height={34} fill="#F6D98E" style={{ opacity: nyala }} />
      <line x1={j.x + 13} x2={j.x + 13} y1={j.y} y2={j.y + 34} stroke={W2.malam} strokeOpacity={0.5} />
    </g>
  );
}

function Pancaran({ i, p, lapis }: { i: number; p: MotionValue<number>; lapis: number }) {
  const t = TUJUAN[i];
  const jalan = useRentang(p, 0.72 + i * 0.03, 0.88 + i * 0.02);
  const cx = useTransform(jalan, [0, 1], [300, t.x]);
  const cy = useTransform(jalan, [0, 1], [300, t.y]);
  const tampak = useTransform(jalan, [0, 0.1, 1], [0, 1, 1]);
  return (
    <motion.g style={{ opacity: tampak }}>
      <motion.line x1={300} y1={300} x2={cx} y2={cy} stroke={W2.emas} strokeOpacity={0.25} strokeDasharray="2 6" />
      <motion.circle cx={cx} cy={cy} r={7} fill="#F6D98E" />
      <motion.circle cx={cx} cy={cy} r={16} fill="#F6D98E" fillOpacity={0.15} />
      {lapis >= 1 && (
        <text x={t.y > 400 ? t.x + 24 : t.x} y={t.y > 400 ? t.y + 5 : t.y - 18} textAnchor={t.y > 400 ? "start" : "middle"} fill={W2.gading} fontSize={15}>{t.nama}</text>
      )}
    </motion.g>
  );
}

export default function AdeganDuaWajah({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const retak = useRentang(p, 0.1, 0.26);
  const label = useTransform(p, [0.22, 0.3, 0.44, 0.5], [0, 1, 1, 0]);
  const jahitan = useRentang(p, 0.5, 0.6);
  const retakMerah = useTransform(jahitan, [0, 1], [1, 0]);
  const tangga = useRentang(p, 0.75, 0.9);

  const atap = (sisi: -1 | 1) => `M300,150 L${300 + sisi * 128},236 L${300 + sisi * 128},244 L300,244 Z`;
  const badan = (sisi: -1 | 1) => (sisi < 0 ? "M192,244 L300,244 L300,402 L192,402 Z" : "M300,244 L408,244 L408,402 L300,402 Z");

  return (
    <Kanvas2D>
      <ellipse cx={300} cy={404} rx={190} ry={10} fill={W2.emas} fillOpacity={0.1} />
      {TUJUAN.map((_, i) => <Pancaran key={i} i={i} p={p} lapis={lapis} />)}
      {([-1, 1] as const).map((sisi) => (
        <Separuh key={sisi} sisi={sisi} p={p}>
          <path d={badan(sisi)} fill="#123a2a" stroke={W2.emas} strokeOpacity={0.7} strokeWidth={1.4} />
          <path d={atap(sisi)} fill={W2.hijau} fillOpacity={0.75} stroke={W2.emas} strokeOpacity={0.8} strokeWidth={1.4} strokeLinejoin="round" />
          {JENDELA.map((j, i) => ((sisi < 0 ? j.x < 300 : j.x > 300) ? <Jendela key={i} i={i} p={p} /> : null))}
          {sisi < 0 ? <path d="M280,402 L280,356 Q290,346 300,346 L300,402 Z" fill="#0b1f16" stroke={W2.emas} strokeOpacity={0.5} /> : <path d="M300,402 L300,346 Q310,346 320,356 L320,402 Z" fill="#0b1f16" stroke={W2.emas} strokeOpacity={0.5} />}
        </Separuh>
      ))}
      <motion.path d={RETAK} fill="none" stroke={W2.panas} strokeWidth={2.2} style={{ pathLength: retak, opacity: retakMerah }} />
      <motion.path d={RETAK} fill="none" stroke={W2.emas} strokeWidth={3} strokeLinecap="round" style={{ opacity: jahitan }} />

      <motion.g style={{ opacity: label }}>
        <text x={150} y={120} textAnchor="middle" fill={W2.gading} fontSize={16}>Menerima asas tunggal</text>
        <text x={450} y={120} textAnchor="middle" fill={W2.panas} fontSize={16}>Menolak: HMI MPO</text>
        <text x={300} y={84} textAnchor="middle" fill={W2.emas} fontSize={20} fontFamily={SERIF} fontWeight={600}>1980-an</text>
      </motion.g>
      {lapis >= 1 && (
        <motion.text x={300} y={120} textAnchor="middle" fill={W2.emasMuda} fontSize={14.5} fontStyle="italic" style={{ opacity: jahitan }}>
          1999: kembali ke asas Islam, lukanya tetap terasa
        </motion.text>
      )}
      {lapis >= 2 && (
        <motion.g style={{ opacity: tangga }}>
          <path d="M474,402 L414,262 M500,402 L440,262" stroke={W2.redup} strokeWidth={2} />
          {[0, 1, 2, 3].map((k) => {
            const y = 380 - k * 32;
            const geser = ((402 - y) * 60) / 140;
            return <line key={k} x1={474 - geser} x2={500 - geser} y1={y} y2={y} stroke={W2.redup} strokeWidth={2} />;
          })}
          <text x={478} y={428} textAnchor="middle" fill={W2.panas} fontSize={14} fontStyle="italic">Anggapan: tangga kekuasaan</text>
        </motion.g>
      )}
      <Keterangan2D
        p={p}
        tahap={[
          { dari: 0, teks: "Satu rumah bersama" },
          { dari: 0.12, teks: "1980-an: rumah terbelah" },
          { dari: 0.46, teks: "Retak, tetapi tetap berdiri" },
          { dari: 0.62, teks: "Jendelanya menyala di banyak tempat" },
        ]}
      />
    </Kanvas2D>
  );
}
