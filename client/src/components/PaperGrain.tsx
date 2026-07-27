/**
 * Serat kertas halus di atas seluruh halaman. Menggantikan NoiseOverlay
 * lama yang memakai noise berfrekuensi tinggi dan terlihat seperti derau
 * digital. Nilai baseFrequency lebih rendah menghasilkan butiran yang
 * lebih besar dan lembut, menyerupai serat kertas beras.
 */
export default function PaperGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-multiply"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="paperGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.42"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperGrain)" />
      </svg>
    </div>
  );
}
