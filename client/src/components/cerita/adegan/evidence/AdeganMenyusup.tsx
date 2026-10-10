import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { HURUF_JUDUL, Kanvas, Muncul, MunculLapis, W, bungkus, useProgres } from "./bersama2d";

/**
 * Bab 10 · Transformasi yang menyusup.
 * Tiga anak tangga di atas fondasi "identitas dokumen" terbuka satu per satu;
 * tahap berikutnya baru terbuka setelah tahap sebelumnya diterima. Perisai
 * menjaga data kader, dan garis putus-putus di atas menandai bahwa fondasi ini
 * bukan langit-langit: masih ada lapis berikutnya.
 */

const DASAR = 334;
const TANGGA = [
  { x: 24, tinggi: 64, warna: W.hijau, judul: "Tahap 1", isi: ["sertifikat, SK,", "surat lebih mudah"] },
  { x: 141, tinggi: 118, warna: "#1F9A5E", judul: "Tahap 2", isi: ["cabang menerima", "rekapnya sendiri"] },
  { x: 258, tinggi: 172, warna: "#3FAE76", judul: "Tahap 3", isi: ["memori dibaca", "untuk forum dan", "kebijakan"] },
];
const LEBAR = 117;
const buka = (i: number) => 0.12 + i * 0.18;

function Kunci({ x, y, terbuka }: { x: number; y: number; terbuka: MotionValue<number> }) {
  const angkat = useTransform(terbuka, [0, 1], [0, -5]);
  const opacity = useTransform(terbuka, [0, 0.6, 1], [1, 1, 0]);
  return (
    <motion.g style={{ opacity }}>
      <motion.path d={`M${x - 5} ${y - 2} V${y - 7} a5 5 0 0 1 10 0 V${y - 2}`} stroke={W.emas} strokeWidth={1.8} fill="none" style={{ y: angkat }} />
      <rect x={x - 7.5} y={y - 2} width={15} height={11} rx={2} fill={W.emas} />
    </motion.g>
  );
}

function AnakTangga({ p, i }: { p: MotionValue<number>; i: number }) {
  const t = TANGGA[i];
  const atas = DASAR - t.tinggi;
  const terbuka = useTransform(p, [buka(i), buka(i) + 0.12], [0, 1], { clamp: true });
  const isi = useTransform(terbuka, [0, 1], [0, 1]);
  const tinggiIsi = useTransform(terbuka, (u) => t.tinggi * u);
  const yIsi = useTransform(terbuka, (u) => DASAR - t.tinggi * u);
  const teks = useTransform(terbuka, [0.6, 1], [0, 1]);
  const diterima = useTransform(p, [buka(i + 1) - 0.02, buka(i + 1) + 0.04], [0, 1], { clamp: true });
  const cx = t.x + LEBAR / 2;
  return (
    <g>
      <rect x={t.x + 1} y={atas} width={LEBAR - 2} height={t.tinggi} rx={4} fill="rgba(14,138,79,0.06)" stroke={W.pudar} strokeWidth={1} strokeDasharray="4 4" />
      <motion.rect x={t.x + 1} y={yIsi} width={LEBAR - 2} height={tinggiIsi} rx={4} fill={t.warna} stroke={W.emas} strokeWidth={1} style={{ opacity: isi }} />
      <Kunci x={cx} y={atas + t.tinggi / 2} terbuka={terbuka} />
      <motion.g style={{ opacity: teks }}>
        <text x={t.x + 9} y={atas + 15} fontSize={9.5} fontWeight={600} letterSpacing={1.4} fill={W.emas} dominantBaseline="central">
          {t.judul.toUpperCase()}
        </text>
        {t.isi.map((b, j) => (
          <text key={b} x={t.x + 9} y={atas + 33 + j * 13} fontSize={10.5} fill={W.gading} dominantBaseline="central">
            {b}
          </text>
        ))}
      </motion.g>
      {i < TANGGA.length - 1 && (
        <motion.g style={{ opacity: diterima }}>
          <circle cx={t.x + LEBAR - 13} cy={atas + 14} r={7} fill={W.emas} />
          <path d={`M${t.x + LEBAR - 16.5} ${atas + 14} l2.5 2.5 l4.5 -5`} stroke={W.malam} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </motion.g>
      )}
    </g>
  );
}

function Isi({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const fondasi = useTransform(p, [0, 0.08], [0.35, 1], { clamp: true });
  return (
    <Kanvas>
      <Muncul p={p} a={0.78} b={0.9}>
        {[
          { x: 300, y: 112, w: 75, h: 50 },
          { x: 334, y: 62, w: 41, h: 50 },
        ].map((g, i) => (
          <rect key={i} x={g.x} y={g.y} width={g.w} height={g.h} rx={4} fill="none" stroke={W.emas} strokeWidth={1} strokeDasharray="3 4" opacity={0.75 - i * 0.25} />
        ))}
        <text x={375} y={30} textAnchor="end" fontSize={10.5} fill={W.emas}>
          lapis berikutnya: menilai mutu
        </text>
        <text x={375} y={45} textAnchor="end" fontSize={10} fill={W.gading} opacity={0.75}>
          fondasi, bukan langit-langit
        </text>
      </Muncul>

      {TANGGA.map((_, i) => <AnakTangga key={i} p={p} i={i} />)}

      <motion.g style={{ opacity: fondasi }}>
        <rect x={24} y={DASAR} width={351} height={28} rx={4} fill={W.hutan} stroke={W.emas} strokeWidth={1.2} />
        <text x={200} y={DASAR + 14} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} letterSpacing={1.2} fill={W.emas}>
          IDENTITAS DOKUMEN · FONDASI
        </text>
      </motion.g>

      <Muncul p={p} a={0.64} b={0.76}>
        <path d="M64 70 L93 80 V103 C93 124 81 134 64 141 C47 134 35 124 35 103 V80 Z" fill={W.hutan} stroke={W.emas} strokeWidth={1.5} />
        <path d="M52 104 l8 8 l15 -16" stroke={W.emas} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={104} y={84} fontSize={12} fontWeight={600} fill={W.gading} dominantBaseline="central">
          data kader dilindungi
        </text>
      </Muncul>
      <MunculLapis tampak={lapis >= 2} tenang={tenang}>
        {["milik lembaga, bukan perorangan", "dengan persetujuan (UU PDP)", "yang naik hanya ringkasan"].map((b, i) => (
          <g key={b}>
            <circle cx={108} cy={104 + i * 16} r={2} fill={W.emas} />
            <text x={115} y={104 + i * 16} fontSize={10} fill={W.gading} opacity={0.9} dominantBaseline="central">
              {b}
            </text>
          </g>
        ))}
      </MunculLapis>

      <MunculLapis tampak={lapis >= 1} tenang={tenang}>
        <g>
          <rect x={46} y={172} width={210} height={28} rx={14} fill="rgba(7,22,16,0.9)" stroke="rgba(220,195,138,0.6)" />
          <circle cx={62} cy={186} r={9} fill={W.emas} />
          <text x={62} y={186} textAnchor="middle" dominantBaseline="central" fontSize={8.5} fontWeight={700} fill={W.malam}>
            AI
          </text>
          <text x={77} y={186} fontSize={10.5} fill={W.gading} dominantBaseline="central">
            membaca, forum yang memutuskan
          </text>
        </g>
      </MunculLapis>

      <Muncul p={p} a={0.88} b={0.96}>
        <text x={200} y={388} textAnchor="middle" fontSize={14} fill={W.gading} style={{ fontFamily: HURUF_JUDUL, fontStyle: "italic" }}>
          masuk perlahan, lewat hal-hal kecil
        </text>
      </Muncul>
    </Kanvas>
  );
}

export default bungkus(Isi);
