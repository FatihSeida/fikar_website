import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { HURUF_JUDUL, Kanvas, Lembar, Muncul, MunculLapis, Pil, W, bungkus, useProgres } from "./bersama2d";

/**
 * Bab 3 · Apa itu bukti.
 * Satu surat menyalakan empat label jejaknya (siapa, dari mana, kapan,
 * terhubung dengan apa), lalu benangnya menyambung ke dokumen lain sehingga
 * asal-usulnya bisa diperiksa orang lain.
 */

const DOK = { x: 148, y: 84, w: 104, h: 132 };

const LABEL = [
  { judul: "Siapa", isi: "Sekretaris Umum", x: 14, y: 70, ke: [DOK.x, 112] },
  { judul: "Dari mana", isi: "Komisariat Ekonomi", x: 14, y: 152, ke: [DOK.x, 176] },
  { judul: "Kapan", isi: "12 Maret 2026", x: 268, y: 70, ke: [DOK.x + DOK.w, 112] },
  { judul: "Terhubung", isi: "SK No. 07/2026", x: 268, y: 152, ke: [DOK.x + DOK.w, 176] },
] as const;
const LW = 118;
const LH = 40;

const TERKAIT = [
  { judul: "SK", label: "SK pengurus", x: 85 },
  { judul: "LK 1", label: "Sertifikat LK 1", x: 200 },
  { judul: "Notulen", label: "Notulen", x: 315 },
];
const Y_TERKAIT = 262;

function LabelJejak({ p, i, l }: { p: MotionValue<number>; i: number; l: (typeof LABEL)[number] }) {
  const a = 0.12 + i * 0.12;
  const nyala = useTransform(p, [a, a + 0.08], [0, 1], { clamp: true });
  const opacity = useTransform(nyala, [0, 1], [0.28, 1]);
  const isiO = useTransform(nyala, [0.3, 1], [0, 1]);
  const kiri = l.x < 200;
  const dari = kiri ? l.x + LW : l.x;
  const garis = useTransform(nyala, [0, 1], [0, 1]);
  return (
    <g>
      <motion.path d={`M${dari} ${l.y + LH / 2} L${l.ke[0]} ${l.ke[1]}`} stroke={W.emas} strokeWidth={1.2} fill="none" style={{ pathLength: garis }} />
      <motion.circle cx={l.ke[0]} cy={l.ke[1]} r={3.2} fill={W.emas} style={{ opacity: nyala }} />
      <motion.g style={{ opacity }}>
        <rect x={l.x} y={l.y} width={LW} height={LH} rx={8} fill="rgba(7,22,16,0.9)" stroke={W.pudar} strokeWidth={1} />
        <motion.rect x={l.x} y={l.y} width={LW} height={LH} rx={8} fill="rgba(220,195,138,0.12)" stroke={W.emas} strokeWidth={1.3} style={{ opacity: nyala }} />
        <text x={l.x + 10} y={l.y + 13} fontSize={11.5} fontWeight={600} fill={W.emas} dominantBaseline="central">
          {l.judul}
        </text>
        <motion.text x={l.x + 10} y={l.y + 28} fontSize={10.5} fill={W.gading} dominantBaseline="central" style={{ opacity: isiO }}>
          {l.isi}
        </motion.text>
      </motion.g>
    </g>
  );
}

function Terkait({ p, i, t }: { p: MotionValue<number>; i: number; t: (typeof TERKAIT)[number] }) {
  const a = 0.6 + i * 0.05;
  const garis = useTransform(p, [a, a + 0.1], [0, 1], { clamp: true });
  const muncul = useTransform(p, [a + 0.06, a + 0.14], [0, 1], { clamp: true });
  const scale = useTransform(muncul, [0, 1], [0.7, 1]);
  const awalX = DOK.x + DOK.w / 2 + (t.x - 200) * 0.25;
  return (
    <g>
      <motion.path
        d={`M${awalX} ${DOK.y + DOK.h} C${awalX} ${DOK.y + DOK.h + 26}, ${t.x} ${Y_TERKAIT - 34}, ${t.x} ${Y_TERKAIT - 4}`}
        stroke={W.emas}
        strokeWidth={1.3}
        fill="none"
        style={{ pathLength: garis, opacity: 0.85 }}
      />
      <motion.g style={{ opacity: muncul, scale }}>
        <Lembar x={t.x - 22} y={Y_TERKAIT} w={44} h={54} judul={t.judul} ukuranJudul={9} baris={3} />
        <circle cx={t.x + 14} cy={Y_TERKAIT + 46} r={3.4} fill={W.emas} stroke={W.gelap} strokeWidth={0.8} />
        <text x={t.x} y={Y_TERKAIT + 68} textAnchor="middle" fontSize={11} fill={W.gading} dominantBaseline="central">
          {t.label}
        </text>
      </motion.g>
    </g>
  );
}

function Isi({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const masuk = useTransform(p, [0, 0.1], [0.85, 1], { clamp: true });
  const masukO = useTransform(p, [0, 0.08], [0.4, 1], { clamp: true });
  return (
    <Kanvas>
      {TERKAIT.map((t, i) => <Terkait key={t.label} p={p} i={i} t={t} />)}
      <motion.g style={{ scale: masuk, opacity: masukO }}>
        <Lembar x={DOK.x} y={DOK.y} w={DOK.w} h={DOK.h} judul="SURAT" ukuranJudul={11} baris={6} />
        <path d={`M${DOK.x + 58} ${DOK.y + 116} q6 -10 12 0 t12 0 t10 -4`} stroke={W.gelap} strokeWidth={1.2} fill="none" opacity={0.6} />
        <circle cx={DOK.x + 26} cy={DOK.y + 112} r={9} fill="none" stroke={W.hijau} strokeWidth={1.4} opacity={0.7} />
      </motion.g>
      <Muncul p={p} a={0.6} b={0.68}>
        <circle cx={DOK.x + DOK.w - 12} cy={DOK.y + DOK.h - 10} r={4} fill={W.emas} stroke={W.gelap} strokeWidth={0.8} />
      </Muncul>
      {LABEL.map((l, i) => <LabelJejak key={l.judul} p={p} i={i} l={l} />)}

      <Muncul p={p} a={0.84} b={0.94}>
        <g transform="translate(118 364)">
          <circle cx={0} cy={0} r={7} fill="none" stroke={W.emas} strokeWidth={1.8} />
          <path d="M5 5 L11 11" stroke={W.emas} strokeWidth={2.2} strokeLinecap="round" />
        </g>
        <text x={136} y={364} fontSize={15} fill={W.gading} dominantBaseline="central" style={{ fontFamily: HURUF_JUDUL, fontStyle: "italic" }}>
          bisa diperiksa orang lain
        </text>
      </Muncul>

      <MunculLapis tampak={lapis >= 1} tenang={tenang}>
        <Pil x={200} y={30} teks="Watak insan akademis: objektif, rasional, kritis" ukuran={11} warna={W.emas} />
      </MunculLapis>
      <MunculLapis tampak={lapis >= 2} tenang={tenang}>
        <path d={`M200 ${Y_TERKAIT - 4} V${DOK.y + DOK.h + 4}`} stroke={W.peringatan} strokeWidth={1.6} strokeDasharray="3 4" fill="none" />
        <g transform={`translate(214 ${Y_TERKAIT - 22})`}>
          <circle cx={0} cy={0} r={6} fill={W.malam} stroke={W.peringatan} strokeWidth={1.6} />
          <path d="M4.5 4.5 L9 9" stroke={W.peringatan} strokeWidth={2} strokeLinecap="round" />
        </g>
        <text x={228} y={Y_TERKAIT - 24} fontSize={10.5} fill={W.peringatan} dominantBaseline="central">
          telusuri asal-usulnya
        </text>
      </MunculLapis>
    </Kanvas>
  );
}

export default bungkus(Isi);
