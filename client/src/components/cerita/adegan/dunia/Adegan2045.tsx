import { motion, useTransform } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { Kanvas2D, Keterangan2D, SERIF, W2, useProgres } from "./bersama2d";

/**
 * Bagian 8 · Waktunya tidak panjang. Penanda berjalan di linimasa 2026 → 2045
 * → 2047 dan sosok kader di atasnya tumbuh dari usia 19 ke 38. Di 2045 muncul
 * tanda seratus tahun Indonesia, di 2047 seratus tahun HMI. Lapis 1 menandai
 * jaraknya: hanya 19 tahun. Lapis 2 menandai usia mulai memimpin.
 */

const X0 = 70;
const X1 = 530;
const Y = 392;
const TAHUN0 = 2026;
const TAHUN1 = 2047;
const xTahun = (th: number) => X0 + ((th - TAHUN0) / (TAHUN1 - TAHUN0)) * (X1 - X0);
const TANDA = [2026, 2030, 2035, 2040, 2045, 2047];

export default function Adegan2045({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  // Berjalan ke 2045, berhenti sebentar di sana, lalu lanjut ke 2047.
  const tahun = useTransform(p, [0.08, 0.66, 0.78, 0.92], [TAHUN0, 2045, 2045, TAHUN1], { clamp: true });
  const x = useTransform(tahun, xTahun);
  const geser = useTransform(x, (v) => v - X0);
  const labelTahun = useTransform(tahun, (v) => String(Math.round(v)));
  const labelUsia = useTransform(tahun, (v) => `${19 + Math.round(v) - TAHUN0} tahun`);
  const tumbuh = useTransform(tahun, [2026, 2045], [0.78, 1.12], { clamp: true });
  const pimpin = useTransform(tahun, [2043, 2045], [0, 1], { clamp: true });
  const indonesia = useTransform(tahun, [2044.4, 2045.2], [0, 1], { clamp: true });
  const hmi = useTransform(tahun, [2046.4, 2047], [0, 1], { clamp: true });
  const lintasan = useTransform(tahun, [TAHUN0, TAHUN1], [0, 1]);

  return (
    <Kanvas2D>
      {/* Linimasa */}
      <line x1={X0} x2={X1} y1={Y} y2={Y} stroke={W2.gading} strokeOpacity={0.2} strokeWidth={2} />
      <motion.line x1={X0} y1={Y} x2={X1} y2={Y} stroke={W2.emas} strokeWidth={2.5} style={{ pathLength: lintasan }} />
      {Array.from({ length: TAHUN1 - TAHUN0 + 1 }, (_, i) => TAHUN0 + i).map((th) => (
        <line key={th} x1={xTahun(th)} x2={xTahun(th)} y1={Y - (TANDA.includes(th) ? 8 : 4)} y2={Y + (TANDA.includes(th) ? 8 : 4)} stroke={W2.gading} strokeOpacity={TANDA.includes(th) ? 0.6 : 0.25} />
      ))}
      {TANDA.map((th) => (
        <text key={th} x={xTahun(th)} y={Y + 30} textAnchor={th === 2045 ? "end" : th === 2047 ? "start" : "middle"} dx={th === 2045 ? 6 : th === 2047 ? -4 : 0} fill={th >= 2045 ? W2.emas : W2.gading} fillOpacity={th >= 2045 ? 1 : 0.6} fontSize={th >= 2045 ? 17 : 14.5} fontWeight={th >= 2045 ? 700 : 400}>
          {th}
        </text>
      ))}

      {/* Tonggak 2045 dan 2047 */}
      <motion.g style={{ opacity: indonesia }}>
        <line x1={xTahun(2045)} x2={xTahun(2045)} y1={Y - 8} y2={Y - 226} stroke={W2.emas} strokeOpacity={0.6} strokeDasharray="3 5" />
        <rect x={xTahun(2045) - 34} y={Y - 244} width={34} height={11} fill="#C8463D" />
        <rect x={xTahun(2045) - 34} y={Y - 233} width={34} height={11} fill={W2.gading} />
        <text x={xTahun(2045) - 42} y={Y - 233} textAnchor="end" fill={W2.gading} fontSize={15}>Indonesia 100 tahun</text>
      </motion.g>
      <motion.g style={{ opacity: hmi }}>
        <line x1={xTahun(2047)} x2={xTahun(2047)} y1={Y - 8} y2={Y - 262} stroke={W2.emas} strokeOpacity={0.6} strokeDasharray="3 5" />
        <rect x={xTahun(2047) - 34} y={Y - 280} width={34} height={22} fill={W2.hijau} />
        <rect x={xTahun(2047) - 34} y={Y - 272} width={34} height={6} fill="#141a17" />
        <text x={xTahun(2047) - 42} y={Y - 265} textAnchor="end" fill={W2.gading} fontSize={15}>HMI 100 tahun</text>
      </motion.g>

      {lapis >= 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <path d={`M${xTahun(2026)},${Y + 50} L${xTahun(2026)},${Y + 58} L${xTahun(2045)},${Y + 58} L${xTahun(2045)},${Y + 50}`} fill="none" stroke={W2.emas} strokeOpacity={0.7} />
          <text x={(xTahun(2026) + xTahun(2045)) / 2} y={Y + 78} textAnchor="middle" fill={W2.emasMuda} fontSize={15.5} fontFamily={SERIF} fontStyle="italic">hanya 19 tahun lagi</text>
        </motion.g>
      )}

      {/* Sosok kader yang berjalan dan tumbuh */}
      <motion.g style={{ x: geser }}>
        <motion.circle cx={X0} cy={Y} r={7} fill={W2.emas} />
        <motion.g style={{ scale: tumbuh, transformOrigin: `${X0}px ${Y - 6}px`, transformBox: "view-box" }}>
          <ellipse cx={X0} cy={Y - 4} rx={22} ry={4} fill="#000" fillOpacity={0.25} />
          <path d={`M${X0 - 9},${Y - 8} L${X0 - 6},${Y - 48} L${X0 + 6},${Y - 48} L${X0 + 9},${Y - 8}`} fill="none" stroke={W2.gading} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${X0 - 15},${Y - 50} Q${X0},${Y - 100} ${X0 + 15},${Y - 50} Z`} fill={W2.hijau} stroke={W2.gading} strokeWidth={1.5} />
          <motion.path d={`M${X0 - 12},${Y - 88} L${X0 + 13},${Y - 54}`} stroke={W2.emas} strokeWidth={5} style={{ opacity: pimpin }} />
          <circle cx={X0} cy={Y - 110} r={13} fill="#C89F7A" />
          <rect x={X0 - 11} y={Y - 126} width={22} height={8} rx={2} fill="#141a17" />
          <rect x={X0 + 14} y={Y - 80} width={13} height={17} fill={W2.gading} fillOpacity={0.9} />
        </motion.g>
        <g transform={`translate(${X0}, ${Y - 172})`}>
          <rect x={-56} y={-26} width={112} height={52} fill="#061511" fillOpacity={0.88} stroke={W2.emas} strokeOpacity={0.6} />
          <motion.text x={0} y={-3} textAnchor="middle" fill={W2.emas} fontSize={21} fontFamily={SERIF} fontWeight={700}>{labelTahun}</motion.text>
          <motion.text x={0} y={18} textAnchor="middle" fill={W2.gading} fontSize={15.5}>{labelUsia}</motion.text>
        </g>
        {lapis >= 2 && (
          <motion.text x={X0} y={Y - 208} textAnchor="middle" fill={W2.emasMuda} fontSize={14} fontStyle="italic" style={{ opacity: pimpin }}>
            usia mulai memimpin
          </motion.text>
        )}
      </motion.g>

      <Keterangan2D
        p={p}
        tahap={[
          { dari: 0, teks: "2026: kader LK 1 berusia 19 tahun" },
          { dari: 0.3, teks: "Waktu berjalan lebih cepat dari dugaan" },
          { dari: 0.64, teks: "2045: berusia 38, saatnya memimpin" },
          { dari: 0.86, teks: "2047: HMI genap seratus tahun" },
        ]}
      />
    </Kanvas2D>
  );
}
