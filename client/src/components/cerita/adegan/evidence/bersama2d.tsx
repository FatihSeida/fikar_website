import type { ComponentType, ReactNode } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import type { PropsAdegan2D } from "../../kontrak";

/**
 * Bahan bersama adegan 2D Series 2 (SVG yang digerakkan progres gulir).
 * Semua adegan memakai kotak gambar 400 × 400 yang menyesuaikan diri:
 * panel tinggi di desktop dan panel lebar setinggi ±40% layar di ponsel.
 */

export const W = {
  malam: "#071610",
  gelap: "#0B2A1E",
  hutan: "#12392A",
  hijau: "#0E8A4F",
  hijauMuda: "#3FAE76",
  emas: "#DCC38A",
  emasTua: "#B08D4F",
  gading: "#F6F4E9",
  kertas: "#EDE7D6",
  pudar: "#6F8278",
  peringatan: "#E39B4B",
};

export const HURUF = '"DM Sans", system-ui, sans-serif';
export const HURUF_JUDUL = '"Noto Serif", Georgia, serif';

/** Progres yang dipakai adegan: tetap 1 (keadaan akhir) bila pembaca meminta gerak dikurangi. */
export function useProgres(progres: MotionValue<number>, tenang: boolean) {
  const satu = useMotionValue(1);
  return tenang ? satu : progres;
}

/** Nilai 0–1 di antara dua titik progres. */
export function useRuas(p: MotionValue<number>, a: number, b: number) {
  return useTransform(p, [a, b], [0, 1], { clamp: true });
}

/**
 * Membungkus adegan supaya dipasang ulang ketika `tenang` berubah, sehingga
 * semua useTransform di dalamnya berlangganan ke sumber progres yang benar.
 */
export function bungkus(Isi: ComponentType<PropsAdegan2D>) {
  function Adegan(props: PropsAdegan2D) {
    return <Isi key={props.tenang ? "tenang" : "gerak"} {...props} />;
  }
  Adegan.displayName = `Adegan(${Isi.displayName ?? Isi.name})`;
  return Adegan;
}

/** Wadah SVG: memenuhi panel adegan dan selalu utuh terlihat. */
export function Kanvas({ children, viewBox = "0 0 400 400" }: { children: ReactNode; viewBox?: string }) {
  return (
    <div className="relative h-full w-full">
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" style={{ fontFamily: HURUF }}>
        {children}
      </svg>
    </div>
  );
}

/** Perkiraan lebar teks DM Sans (cukup untuk mengukur pil label). */
export function lebarTeks(teks: string, ukuran: number, kapital = false) {
  return teks.length * ukuran * (kapital ? 0.72 : 0.55);
}

/** Pil label: kotak membulat dengan tulisan di tengah. `x`,`y` = titik tengah. */
export function Pil({
  x,
  y,
  teks,
  ukuran = 12,
  warna = W.gading,
  latar = "rgba(7,22,16,0.88)",
  garis = "rgba(220,195,138,0.55)",
  lebar,
  kapital = false,
  tebal = 500,
}: {
  x: number;
  y: number;
  teks: string;
  ukuran?: number;
  warna?: string;
  latar?: string;
  garis?: string;
  lebar?: number;
  kapital?: boolean;
  tebal?: number;
}) {
  const w = lebar ?? lebarTeks(teks, ukuran, kapital) + ukuran * 1.6;
  const h = ukuran * 2;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={latar} stroke={garis} strokeWidth={1} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={ukuran}
        fontWeight={tebal}
        fill={warna}
        letterSpacing={kapital ? ukuran * 0.16 : 0}
        style={{ textTransform: kapital ? "uppercase" : undefined }}
      >
        {teks}
      </text>
    </g>
  );
}

/** Kelompok yang muncul (memudar masuk dan sedikit naik) di antara dua titik progres. */
export function Muncul({ p, a, b, children, naik = 6, hilang }: { p: MotionValue<number>; a: number; b: number; children: ReactNode; naik?: number; hilang?: [number, number] }) {
  const masuk = useTransform(p, [a, b], [0, 1], { clamp: true });
  const keluar = useTransform(p, hilang ?? [2, 3], [1, 0], { clamp: true });
  const opacity = useTransform([masuk, keluar], ([m, k]: number[]) => m * k);
  const y = useTransform(masuk, [0, 1], [naik, 0]);
  return <motion.g style={{ opacity, y }}>{children}</motion.g>;
}

/** Kelompok yang tampak hanya saat lapis tertentu terbuka (memudar halus). */
export function MunculLapis({ tampak, tenang, children }: { tampak: boolean; tenang: boolean; children: ReactNode }) {
  return (
    <motion.g initial={false} animate={{ opacity: tampak ? 1 : 0 }} transition={{ duration: tenang ? 0 : 0.45 }} style={{ pointerEvents: "none" }}>
      {children}
    </motion.g>
  );
}

/** Lembar dokumen kecil dengan sudut terlipat dan garis-garis isi. */
export function Lembar({ x, y, w, h, judul, warna = W.kertas, tinta = W.gelap, baris = 4, ukuranJudul = 10 }: { x: number; y: number; w: number; h: number; judul?: string; warna?: string; tinta?: string; baris?: number; ukuranJudul?: number }) {
  const lipat = Math.min(w, h) * 0.2;
  const awal = judul ? y + ukuranJudul * 2.4 : y + h * 0.2;
  const sela = (y + h - h * 0.12 - awal) / Math.max(1, baris);
  return (
    <g>
      <path d={`M${x} ${y} H${x + w - lipat} L${x + w} ${y + lipat} V${y + h} H${x} Z`} fill={warna} stroke="rgba(11,42,30,0.35)" strokeWidth={0.8} />
      <path d={`M${x + w - lipat} ${y} V${y + lipat} H${x + w}`} fill="rgba(11,42,30,0.12)" stroke="rgba(11,42,30,0.35)" strokeWidth={0.8} />
      {judul && (
        <text x={x + w * 0.12} y={y + ukuranJudul * 1.5} fontSize={ukuranJudul} fontWeight={600} fill={tinta} dominantBaseline="central">
          {judul}
        </text>
      )}
      {Array.from({ length: baris }, (_, i) => (
        <rect key={i} x={x + w * 0.12} y={awal + i * sela} width={w * (i === baris - 1 ? 0.45 : 0.72)} height={Math.max(1.6, h * 0.028)} rx={1} fill="rgba(11,42,30,0.22)" />
      ))}
    </g>
  );
}
