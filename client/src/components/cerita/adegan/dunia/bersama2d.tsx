import { useState, type ReactNode } from "react";
import { useMotionValue, useMotionValueEvent, useTime, useTransform, type MotionValue } from "framer-motion";

/**
 * Bahan bersama adegan 2D Series 1: kanvas SVG 600 × 520 yang menyesuaikan
 * wadah, warna merek, keterangan bawah yang berganti mengikuti progres, dan
 * pembantu progres (keadaan akhir bila gerak dikurangi).
 */

export const W2 = {
  malam: "#071610",
  hijauGelap: "#0B2A1E",
  hijau: "#0E8A4F",
  hijauMuda: "#3FBF7F",
  emas: "#DCC38A",
  emasMuda: "#F3E3B6",
  gading: "#F6F4E9",
  panas: "#E8875A",
  redup: "rgba(246,244,233,0.35)",
};

export const SANS = '"DM Sans", system-ui, sans-serif';
export const SERIF = '"Noto Serif", Georgia, serif';

/** Progres yang dipakai adegan 2D: tetap 1 bila pembaca meminta gerak dikurangi. */
export function useProgres(progres: MotionValue<number>, tenang: boolean) {
  const satu = useMotionValue(1);
  return tenang ? satu : progres;
}

/** Waktu berjalan (ms) untuk gerak latar; diam bila gerak dikurangi. */
export function useWaktu(tenang: boolean) {
  const waktu = useTime();
  const nol = useMotionValue(0);
  return tenang ? nol : waktu;
}

/** Nilai 0–1 yang naik dari `a` ke `b` mengikuti progres. */
export function useRentang(p: MotionValue<number>, a: number, b: number) {
  return useTransform(p, [a, b], [0, 1], { clamp: true });
}

export function Kanvas2D({ children, viewBox = "0 0 600 520" }: { children: ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" style={{ fontFamily: SANS }}>
      {children}
    </svg>
  );
}

/** Keterangan di bawah adegan (di dalam SVG, y ≈ 500), berganti mengikuti progres. */
export function Keterangan2D({ p, tahap, y = 500 }: { p: MotionValue<number>; tahap: { dari: number; teks: string }[]; y?: number }) {
  const cari = (v: number) => tahap.reduce((hasil, t, i) => (v >= t.dari ? i : hasil), 0);
  const [indeks, setIndeks] = useState(() => cari(p.get()));
  useMotionValueEvent(p, "change", (v) => {
    const i = cari(v);
    if (i !== indeks) setIndeks(i);
  });
  const teks = tahap[indeks]?.teks ?? "";
  return (
    <g key={indeks}>
      <text x={300} y={y} textAnchor="middle" fill={W2.gading} fontSize={22} fontFamily={SERIF} fontStyle="italic" stroke={W2.malam} strokeWidth={6} strokeOpacity={0.85} paintOrder="stroke">
        {teks}
      </text>
      <line x1={300 - teks.length * 5} x2={300 + teks.length * 5} y1={y + 12} y2={y + 12} stroke={W2.emas} strokeOpacity={0.6} />
    </g>
  );
}
