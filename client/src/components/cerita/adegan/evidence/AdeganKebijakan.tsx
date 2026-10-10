import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { HURUF_JUDUL, Kanvas, Muncul, MunculLapis, Pil, W, bungkus, useProgres } from "./bersama2d";

/**
 * Bab 8 · Forum dibuka dengan gambaran bersama.
 * Meja musyawarah dilihat dari atas. Mula-mula peserta hanya bermodal
 * perkiraan ("katanya…"). Lalu layar di tengah meja menyala dengan gambaran
 * klaster cabang, pandangan semua peserta tertuju ke sana, dan usulan kegiatan
 * lahir dari kebutuhan nyata kader.
 */

const C = 200;
const MEJA = 108;
const PESERTA = Array.from({ length: 8 }, (_, i) => {
  const sudut = -Math.PI / 2 + (i * Math.PI) / 4;
  return { sudut, x: C + Math.cos(sudut) * 140, y: C + Math.sin(sudut) * 140, bx: C + Math.cos(sudut) * 150, by: C + Math.sin(sudut) * 150 };
});
const GELEMBUNG = [
  { i: 1, teks: "katanya…" },
  { i: 3, teks: "?" },
  { i: 5, teks: "kira-kira…" },
  { i: 7, teks: "?" },
];
const KLASTER = [
  { nama: "A", tinggi: 24 },
  { nama: "B", tinggi: 40 },
  { nama: "C", tinggi: 31 },
];

function Pandangan({ p, i }: { p: MotionValue<number>; i: number }) {
  const o = PESERTA[i];
  const a = 0.4 + i * 0.012;
  const pathLength = useTransform(p, [a, a + 0.12], [0, 1], { clamp: true });
  const x1 = C + Math.cos(o.sudut) * 126;
  const y1 = C + Math.sin(o.sudut) * 126;
  const x2 = C + Math.cos(o.sudut) * 66;
  const y2 = C + Math.sin(o.sudut) * 52;
  return <motion.path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={W.emas} strokeWidth={1.1} strokeDasharray="0" fill="none" style={{ pathLength, opacity: 0.7 }} />;
}

function Batang({ p, i, k }: { p: MotionValue<number>; i: number; k: (typeof KLASTER)[number] }) {
  const a = 0.4 + i * 0.04;
  const tinggi = useTransform(p, [a, a + 0.14], [0, k.tinggi], { clamp: true });
  const y = useTransform(tinggi, (t) => 226 - t);
  const huruf = useTransform(p, [0.34, 0.42], [0, 1], { clamp: true });
  const x = 172 + i * 28 - 8;
  return (
    <g>
      <motion.rect x={x} y={y} width={16} height={tinggi} rx={2} fill={i === 1 ? W.emas : W.hijauMuda} />
      <motion.text x={x + 8} y={235} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={W.gading} dominantBaseline="central" style={{ opacity: huruf }}>
        {k.nama}
      </motion.text>
    </g>
  );
}

function Usulan({ p, i }: { p: MotionValue<number>; i: number }) {
  const a = 0.62 + i * 0.06;
  const u = useTransform(p, [a, a + 0.12], [0, 1], { clamp: true });
  const x = useTransform(u, [0, 1], [0, i ? 44 : -44]);
  const y = useTransform(u, [0, 1], [-24, 0]);
  const cx = 200;
  return (
    <motion.g style={{ opacity: u, x, y }}>
      <rect x={cx - 26} y={258} width={52} height={32} rx={3} fill={W.kertas} />
      <path d={`M${cx - 18} 270 l4 4 l8 -8`} stroke={W.hijau} strokeWidth={2} fill="none" strokeLinecap="round" />
      <rect x={cx - 2} y={267} width={20} height={2} rx={1} fill="rgba(11,42,30,0.35)" />
      <rect x={cx - 2} y={273} width={14} height={2} rx={1} fill="rgba(11,42,30,0.35)" />
      <text x={cx} y={284} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={W.gelap} dominantBaseline="central">
        usulan
      </text>
    </motion.g>
  );
}

const FORUM = ["RAK", "Konfercab", "Musda", "Kongres"];

function Isi({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const layar = useTransform(p, [0.3, 0.4], [0, 1], { clamp: true });
  const gelap = useTransform(layar, [0, 1], [1, 0]);
  const curiga = useTransform(p, [0.28, 0.38], [1, 0], { clamp: true });
  return (
    <Kanvas>
      <circle cx={C} cy={C} r={MEJA + 6} fill="rgba(14,138,79,0.08)" />
      <circle cx={C} cy={C} r={MEJA} fill={W.gelap} stroke={W.emas} strokeWidth={1.4} />
      <circle cx={C} cy={C} r={MEJA - 10} fill="none" stroke="rgba(220,195,138,0.18)" strokeWidth={1} />

      <motion.g style={{ opacity: curiga }}>
        {[[1, 5], [3, 7], [0, 4]].map(([a, b]) => (
          <path key={`${a}-${b}`} d={`M${PESERTA[a].x} ${PESERTA[a].y} L${PESERTA[b].x} ${PESERTA[b].y}`} stroke={W.peringatan} strokeWidth={1} strokeDasharray="3 5" opacity={0.5} />
        ))}
      </motion.g>

      {PESERTA.map((_, i) => <Pandangan key={i} p={p} i={i} />)}

      <rect x={139} y={157} width={122} height={86} rx={6} fill={W.malam} stroke={W.emas} strokeWidth={1.2} />
      <motion.g style={{ opacity: gelap }}>
        <text x={C} y={200} textAnchor="middle" dominantBaseline="central" fontSize={11} fill={W.pudar}>
          belum ada gambaran
        </text>
      </motion.g>
      <motion.g style={{ opacity: layar }}>
        <rect x={139} y={157} width={122} height={86} rx={6} fill="rgba(14,138,79,0.18)" />
        <text x={C} y={171} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fill={W.emas}>
          gambaran bersama
        </text>
        <path d="M160 226 H240" stroke="rgba(246,244,233,0.35)" strokeWidth={1} />
      </motion.g>
      {KLASTER.map((k, i) => <Batang key={k.nama} p={p} i={i} k={k} />)}

      {[0, 1].map((i) => <Usulan key={i} p={p} i={i} />)}

      {PESERTA.map((o, i) => (
        <g key={i}>
          <ellipse cx={o.bx} cy={o.by} rx={19} ry={11} transform={`rotate(${(o.sudut * 180) / Math.PI + 90} ${o.bx} ${o.by})`} fill={W.hutan} stroke="rgba(220,195,138,0.4)" strokeWidth={1} />
          <circle cx={o.x} cy={o.y} r={10} fill={W.gading} />
        </g>
      ))}

      <motion.g style={{ opacity: curiga }}>
        {GELEMBUNG.map((g) => {
          const o = PESERTA[g.i];
          const x = C + Math.cos(o.sudut) * 88;
          const y = C + Math.sin(o.sudut) * 88;
          return <Pil key={g.i} x={x} y={y} teks={g.teks} ukuran={10} warna={W.gading} latar="rgba(76,95,85,0.92)" garis="rgba(246,244,233,0.3)" />;
        })}
      </motion.g>

      <Muncul p={p} a={0} b={0.02} hilang={[0.3, 0.36]}>
        <Caption teks="tanpa gambaran: perkiraan dan suasana forum" />
      </Muncul>
      <Muncul p={p} a={0.44} b={0.52} hilang={[0.7, 0.76]}>
        <Caption teks="semua melihat gambaran yang sama" />
      </Muncul>
      <Muncul p={p} a={0.8} b={0.9}>
        <Caption teks="beda pendapat tetap ada, dasarnya sama" />
      </Muncul>

      <MunculLapis tampak={lapis >= 1} tenang={tenang}>
        {FORUM.map((f, i) => {
          const x = 76 + i * 82;
          return (
            <g key={f}>
              {i > 0 && <path d={`M${x - 52} 18 H${x - 30}`} stroke={W.emas} strokeWidth={1} opacity={0.7} />}
              <Pil x={x} y={18} teks={f} ukuran={10} warna={W.emas} />
            </g>
          );
        })}
      </MunculLapis>
      <MunculLapis tampak={lapis >= 2} tenang={tenang}>
        <text x={C} y={370} textAnchor="middle" fontSize={10} fill={W.emas}>
          klaster cabang dalam Pedoman Perkaderan kini bisa dihitung
        </text>
      </MunculLapis>
    </Kanvas>
  );
}

function Caption({ teks }: { teks: string }) {
  return (
    <text x={C} y={388} textAnchor="middle" fontSize={14} fill={W.gading} style={{ fontFamily: HURUF_JUDUL, fontStyle: "italic" }}>
      {teks}
    </text>
  );
}

export default bungkus(Isi);
