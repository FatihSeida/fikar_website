import type { ComponentType, MutableRefObject } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Kontrak antara mesin cerita (CeritaInteraktif) dan adegan visual setiap bab.
 * Mesin menyediakan wadah, progres gulir, dan lapis penjelasan yang terbuka;
 * adegan hanya menggambar isinya. Lihat docs/series-interaktif/kontrak.md.
 */

export type Lapis = 0 | 1 | 2;

/**
 * Adegan 3D digambar di dalam <Canvas> react-three-fiber milik mesin.
 * `progres` dibaca di useFrame (bukan state) supaya gulir tidak memicu render ulang React.
 */
export type PropsAdegan3D = {
  /** 0–1: seberapa jauh pembaca menggulir bab ini. */
  progres: MutableRefObject<number>;
  /** Lapis penjelasan yang sedang terbuka: 0 inti, 1 lanjut, 2 dalam. Boleh menambah detail. */
  lapis: Lapis;
  /** Pembaca meminta gerak dikurangi (prefers-reduced-motion): tampilkan keadaan akhir tanpa animasi panjang. */
  tenang: boolean;
};

/** Adegan 2D (SVG/HTML dengan framer-motion) untuk diagram yang lebih jelas tanpa 3D. */
export type PropsAdegan2D = {
  progres: MotionValue<number>;
  lapis: Lapis;
  tenang: boolean;
};

export type EntriAdegan =
  | { jenis: "3d"; Komponen: ComponentType<PropsAdegan3D>; /** Keterangan singkat untuk pembaca layar. */ alt: string }
  | { jenis: "2d"; Komponen: ComponentType<PropsAdegan2D>; alt: string };

export type DaftarAdegan = Record<string, EntriAdegan>;
