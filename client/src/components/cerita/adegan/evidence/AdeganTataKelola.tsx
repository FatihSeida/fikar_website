import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { HURUF_JUDUL, Kanvas, Muncul, MunculLapis, Pil, W, bungkus, useProgres } from "./bersama2d";

/**
 * Bab 7 · Tata kelola dibaca sepanjang periode.
 * Lini masa empat kepengurusan dengan batang SK. Garis "hari ini" bergerak;
 * jejak kegiatan muncul di setiap batang. Satu komisariat tidak berganti
 * pengurus: batangnya menguning sebelum habis, lalu menyala sebagai peringatan.
 */

const X0 = 118;
const SKALA = 88; // satu tahun
const X = (t: number) => X0 + t * SKALA;
const BARIS = [
  { nama: "Komisariat A", sk: [[0, 1], [1, 2], [2, 3]] },
  { nama: "Komisariat B", sk: [[0.35, 1.35]], terlambat: 1.35 },
  { nama: "Komisariat C", sk: [[0.6, 1.6], [1.6, 2.6], [2.6, 3.6]] },
  { nama: "Cabang", sk: [[0.15, 1.15], [1.15, 2.15], [2.15, 3.15]] },
].map((b, i) => ({ ...b, y: 100 + i * 48 }));
const T_AKHIR = 2.8;
const TINGGI = 20;

function acak(i: number) {
  const x = Math.sin(i * 91.17 + 3.3) * 43758.5453;
  return x - Math.floor(x);
}
/** Jejak kegiatan (surat) di sepanjang batang yang aktif. */
const JEJAK = BARIS.flatMap((b, r) => {
  const hasil: { t: number; y: number }[] = [];
  for (let j = 0; j < 18; j++) {
    const t = 0.05 + j * 0.16 + acak(r * 31 + j) * 0.08;
    const aktif = b.sk.some(([s, e]) => t > s + 0.3 && t < e - 0.03);
    if (aktif && t < T_AKHIR) hasil.push({ t, y: b.y + (acak(r * 17 + j) - 0.5) * 8 });
  }
  return hasil;
});

function BatangSK({ c, s, e, y, terlambat }: { c: MotionValue<number>; s: number; e: number; y: number; terlambat?: number }) {
  const opacity = useTransform(c, [s - 0.02, s + 0.03], [0, 1]);
  const isi = useTransform(c, (v) => Math.max(0, Math.min(v, e) - s) * SKALA);
  const akhir = Math.min(e, 3.15);
  const warna = useTransform(c, terlambat ? [terlambat - 0.25, terlambat] : [0, 1], terlambat ? [W.hijau, W.peringatan] : [W.hijau, W.hijau]);
  return (
    <motion.g style={{ opacity }}>
      <rect x={X(s) + 1} y={y - TINGGI / 2} width={(akhir - s) * SKALA - 2} height={TINGGI} rx={6} fill="rgba(14,138,79,0.16)" stroke="rgba(63,174,118,0.55)" strokeWidth={1} />
      <motion.rect x={X(s) + 1} y={y - TINGGI / 2} width={isi} height={TINGGI} rx={6} fill={warna} />
      <text x={X(s) + 8} y={y} fontSize={9.5} fontWeight={600} fill={W.gading} dominantBaseline="central">
        SK
      </text>
    </motion.g>
  );
}

function Terlambat({ c, mulai, y }: { c: MotionValue<number>; mulai: number; y: number }) {
  const lebar = useTransform(c, (v) => Math.max(0, v - mulai) * SKALA);
  const tampak = useTransform(c, [mulai, mulai + 0.04], [0, 1]);
  const segera = useTransform(c, [mulai - 0.24, mulai - 0.18, mulai - 0.02, mulai], [0, 1, 1, 0]);
  return (
    <g>
      <motion.rect x={X(mulai)} y={y - TINGGI / 2} width={lebar} height={TINGGI} rx={6} fill="rgba(227,155,75,0.18)" stroke={W.peringatan} strokeWidth={1.4} strokeDasharray="4 3" style={{ opacity: tampak }} />
      <motion.g style={{ opacity: segera }}>
        <Pil x={X(mulai) - 10} y={y - 24} teks="segera regenerasi" ukuran={9.5} warna={W.peringatan} garis="rgba(227,155,75,0.7)" />
      </motion.g>
      <motion.g style={{ opacity: tampak }}>
        <g transform={`translate(${X(mulai) + 6} ${y - 24})`}>
          <path d="M0 -8 L8 6 H-8 Z" fill={W.peringatan} />
          <text x={0} y={2} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill={W.malam}>
            !
          </text>
        </g>
        <text x={X(mulai) - 6} y={y - 24} textAnchor="end" fontSize={10} fontWeight={600} fill={W.peringatan} dominantBaseline="central">
          SK habis, belum berganti
        </text>
      </motion.g>
    </g>
  );
}

function Titik({ c, t, y }: { c: MotionValue<number>; t: number; y: number }) {
  const opacity = useTransform(c, [t - 0.01, t + 0.04], [0, 1]);
  return <motion.circle cx={X(t)} cy={y} r={2.6} fill={W.gading} style={{ opacity }} />;
}

function Laporan({ c, t }: { c: MotionValue<number>; t: number }) {
  const opacity = useTransform(c, [t, t + 0.05], [0.15, 1]);
  return (
    <motion.g style={{ opacity }}>
      <path d={`M${X(t)} 70 V262`} stroke={W.emas} strokeWidth={0.8} strokeDasharray="2 4" opacity={0.6} />
      <rect x={X(t) - 6} y={330} width={12} height={15} rx={1.5} fill={W.kertas} />
      <rect x={X(t) - 3.5} y={334} width={7} height={1.4} fill="rgba(11,42,30,0.4)" />
      <rect x={X(t) - 3.5} y={338} width={7} height={1.4} fill="rgba(11,42,30,0.4)" />
    </motion.g>
  );
}

function Isi({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const c = useTransform(p, [0.06, 0.86], [0.2, T_AKHIR], { clamp: true });
  const xKursor = useTransform(c, X);
  const masuk = useTransform(p, [0, 0.06], [0.3, 1], { clamp: true });
  return (
    <Kanvas>
      <motion.g style={{ opacity: masuk }}>
        {["Tahun 1", "Tahun 2", "Tahun 3"].map((t, i) => (
          <text key={t} x={X(i + 0.5)} y={46} textAnchor="middle" fontSize={10.5} fill={W.gading} opacity={0.65}>
            {t}
          </text>
        ))}
        <path d={`M${X0} 58 H${X(3)}`} stroke={W.pudar} strokeWidth={1} />
        {[0, 1, 2, 3].map((t) => <path key={t} d={`M${X(t)} 54 V62`} stroke={W.pudar} strokeWidth={1} />)}
        {BARIS.map((b) => (
          <g key={b.nama}>
            <text x={10} y={b.y} fontSize={11.5} fill={W.gading} dominantBaseline="central">
              {b.nama}
            </text>
            <path d={`M${X0} ${b.y} H${X(3)}`} stroke="rgba(111,130,120,0.35)" strokeWidth={1} />
          </g>
        ))}
      </motion.g>

      <MunculLapis tampak={lapis >= 1} tenang={tenang}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => <Laporan key={j} c={c} t={j / 3} />)}
        <text x={200} y={362} textAnchor="middle" fontSize={10.5} fill={W.emas}>
          laporan 4 bulanan tersusun dari jejak yang sudah ada
        </text>
      </MunculLapis>

      {BARIS.map((b) => b.sk.map(([s, e]) => <BatangSK key={`${b.nama}-${s}`} c={c} s={s} e={e} y={b.y} terlambat={b.terlambat} />))}
      {JEJAK.map((j, i) => <Titik key={i} c={c} t={j.t} y={j.y} />)}
      {BARIS.map((b) => b.terlambat !== undefined && <Terlambat key={b.nama} c={c} mulai={b.terlambat} y={b.y} />)}

      <MunculLapis tampak={lapis >= 2} tenang={tenang}>
        {[
          { t: 1, y: BARIS[0].y },
          { t: 2, y: BARIS[0].y },
          { t: 1.15, y: BARIS[3].y },
          { t: 2.15, y: BARIS[3].y },
        ].map((s) => (
          <g key={`${s.t}-${s.y}`}>
            <path d={`M${X(s.t) - 12} ${s.y - 13} Q${X(s.t)} ${s.y - 26} ${X(s.t) + 12} ${s.y - 13}`} stroke={W.emas} strokeWidth={1.4} fill="none" />
            <path d={`M${X(s.t) + 12} ${s.y - 13} l-5 -1.5 M${X(s.t) + 12} ${s.y - 13} l-1.5 -5`} stroke={W.emas} strokeWidth={1.4} />
            <rect x={X(s.t) - 4} y={s.y - 27} width={8} height={6} rx={1} fill={W.emas} />
          </g>
        ))}
        <text x={200} y={386} textAnchor="middle" fontSize={10.5} fill={W.gading} opacity={0.9}>
          serah terima memindahkan pengetahuan, bukan hanya jabatan
        </text>
      </MunculLapis>

      <motion.g style={{ x: xKursor }}>
        <path d="M0 68 V262" stroke={W.emas} strokeWidth={1.6} />
        <Pil x={0} y={278} teks="hari ini" ukuran={10.5} warna={W.malam} latar={W.emas} garis={W.emas} />
      </motion.g>

      <Muncul p={p} a={0.86} b={0.95}>
        <text x={200} y={316} textAnchor="middle" fontSize={14.5} fill={W.gading} style={{ fontFamily: HURUF_JUDUL, fontStyle: "italic" }}>
          terlihat sebelum menjadi persoalan
        </text>
      </Muncul>
    </Kanvas>
  );
}

export default bungkus(Isi);
