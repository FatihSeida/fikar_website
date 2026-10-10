import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";
import { HURUF_JUDUL, Kanvas, Lembar, Muncul, MunculLapis, Pil, W, bungkus, useProgres } from "./bersama2d";

/**
 * Bab 2 · Ingatan pergi bersama orangnya.
 * Seorang pengurus dikelilingi dokumen yang terhubung ke kepalanya. Saat ia
 * demisioner dan pergi, benangnya putus dan dokumennya memudar; pengurus baru
 * datang ke ruang yang kosong dan harus mulai dari awal.
 */

const KEPALA = { x: 200, y: 205 };
const R = 145;
const DOKUMEN = [
  { judul: "LPJ", sudut: 190, simpan: "flashdisk" },
  { judul: "Serah\nterima", sudut: 222, simpan: "laptop pribadi" },
  { judul: "Data LK", sudut: 254, simpan: "grup WA" },
  { judul: "Surat", sudut: 286, simpan: "lemari sekret" },
  { judul: "SK", sudut: 318, simpan: "email lama" },
  { judul: "Notulen", sudut: 350, simpan: "map kertas" },
].map((d) => {
  const r = (d.sudut * Math.PI) / 180;
  return { ...d, x: KEPALA.x + Math.cos(r) * R, y: KEPALA.y + Math.sin(r) * R };
});
const KW = 58;
const KH = 72;

function Sosok({ warna }: { warna: string }) {
  return (
    <g>
      <circle cx={KEPALA.x} cy={KEPALA.y} r={20} fill={warna} />
      <path d={`M${KEPALA.x - 34} 292 Q${KEPALA.x - 34} 240 ${KEPALA.x} 236 Q${KEPALA.x + 34} 240 ${KEPALA.x + 34} 292 Z`} fill={warna} />
    </g>
  );
}

function Benang({ p, i, x, y }: { p: MotionValue<number>; i: number; x: number; y: number }) {
  const a = 0.03 + i * 0.045;
  const pathLength = useTransform(p, [a, a + 0.08, 0.37, 0.45], [0, 1, 1, 0]);
  const opacity = useTransform(pathLength, [0, 0.05, 1], [0, 0.55, 0.55]);
  return <motion.path d={`M${KEPALA.x} ${KEPALA.y} L${x} ${y}`} stroke={W.emas} strokeWidth={1.2} fill="none" style={{ pathLength, opacity }} />;
}

function Kartu({ p, i, d, lapis, tenang }: { p: MotionValue<number>; i: number; d: (typeof DOKUMEN)[number]; lapis: number; tenang: boolean }) {
  const a = 0.03 + i * 0.045;
  const hilangA = 0.44 + i * 0.022;
  const opacity = useTransform(p, [a, a + 0.08, hilangA, hilangA + 0.14], [0, 1, 1, 0.1]);
  const scale = useTransform(p, [a, a + 0.08], [0.7, 1]);
  const y = useTransform(p, [hilangA, hilangA + 0.14], [0, 14]);
  const rotate = useTransform(p, [hilangA, hilangA + 0.14], [0, i % 2 ? 9 : -9]);
  const bayang = useTransform(p, [hilangA + 0.08, hilangA + 0.2], [0, 0.55]);
  const baris = d.judul.split("\n");
  return (
    <g>
      <motion.rect x={d.x - KW / 2} y={d.y - KH / 2} width={KW} height={KH} rx={3} fill="none" stroke={W.pudar} strokeDasharray="4 4" strokeWidth={1} style={{ opacity: bayang }} />
      <motion.g style={{ opacity, scale, y, rotate }}>
        <Lembar x={d.x - KW / 2} y={d.y - KH / 2} w={KW} h={KH} baris={3} />
        {baris.map((b, j) => (
          <text key={j} x={d.x} y={d.y - 22 + j * 12} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fill={W.gelap}>
            {b}
          </text>
        ))}
      </motion.g>
      <MunculLapis tampak={lapis >= 1} tenang={tenang}>
        <text x={d.x} y={d.y + KH / 2 + 12} textAnchor="middle" fontSize={11} fill={W.emas} dominantBaseline="central">
          {d.simpan}
        </text>
      </MunculLapis>
    </g>
  );
}

function Isi({ progres, lapis, tenang }: PropsAdegan2D) {
  const p = useProgres(progres, tenang);
  const pergiX = useTransform(p, [0.42, 0.64], [0, 150]);
  const pergiO = useTransform(p, [0.44, 0.64], [1, 0]);
  const datangX = useTransform(p, [0.66, 0.84], [-150, 0]);
  const datangO = useTransform(p, [0.66, 0.8], [0, 1]);
  return (
    <Kanvas>
      {DOKUMEN.map((d, i) => <Benang key={d.judul} p={p} i={i} x={d.x} y={d.y} />)}
      {DOKUMEN.map((d, i) => <Kartu key={d.judul} p={p} i={i} d={d} lapis={lapis} tenang={tenang} />)}

      <motion.g style={{ x: pergiX, opacity: pergiO }}>
        <Sosok warna={W.gading} />
        <Muncul p={p} a={0.35} b={0.4}>
          <Pil x={KEPALA.x} y={KEPALA.y - 44} teks="Demisioner" ukuran={11} warna={W.peringatan} garis="rgba(227,155,75,0.7)" />
        </Muncul>
      </motion.g>
      <motion.g style={{ x: datangX, opacity: datangO }}>
        <Sosok warna={W.hijauMuda} />
        <Muncul p={p} a={0.84} b={0.92} naik={4}>
          <circle cx={KEPALA.x + 34} cy={KEPALA.y - 34} r={14} fill={W.gelap} stroke={W.emas} strokeWidth={1.2} />
          <text x={KEPALA.x + 34} y={KEPALA.y - 33} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={600} fill={W.emas} style={{ fontFamily: HURUF_JUDUL }}>
            ?
          </text>
        </Muncul>
      </motion.g>

      <Muncul p={p} a={0} b={0.02} hilang={[0.42, 0.52]}>
        <Pil x={KEPALA.x} y={312} teks="Pengurus" ukuran={12} />
      </Muncul>
      <Muncul p={p} a={0.72} b={0.84}>
        <Pil x={KEPALA.x} y={312} teks="Pengurus baru" ukuran={12} warna={W.hijauMuda} garis="rgba(63,174,118,0.7)" />
      </Muncul>
      <Muncul p={p} a={0.86} b={0.95}>
        <text x={200} y={350} textAnchor="middle" fontSize={15} fill={W.gading} style={{ fontFamily: HURUF_JUDUL, fontStyle: "italic" }}>
          mulai lagi dari awal
        </text>
      </Muncul>

      <MunculLapis tampak={lapis >= 2} tenang={tenang}>
        {["Periode 1", "Periode 2", "Periode 3"].map((t, i) => (
          <g key={t}>
            <text x={110 + i * 90} y={384} textAnchor="middle" dominantBaseline="central" fontSize={10.5} fill={W.gading} opacity={0.8}>
              {t} ↺
            </text>
            {i < 2 && <path d={`M${146 + i * 90} 384 h18`} stroke={W.emas} strokeWidth={1} opacity={0.6} />}
          </g>
        ))}
      </MunculLapis>
    </Kanvas>
  );
}

export default bungkus(Isi);
