import { motion, useReducedMotion } from "framer-motion";

/**
 * Latar hijau gelap Series 4: jaring tipis, cahaya radial, gambar rencana bangunan
 * (cetak biru) berwarna emas, dan butiran cahaya yang melayang pelan.
 * Semua lapisan hanya hiasan, jadi disembunyikan dari pembaca layar.
 */

// Letak butiran tetap (bukan acak) supaya tampilannya sama di setiap muat ulang.
const butiran = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  ukuran: 2 + (i % 3),
  durasi: 7 + (i % 5) * 1.6,
  tunda: (i % 7) * 0.7,
}));

const jaring = "linear-gradient(rgb(220 195 138 / .07) 1px, transparent 1px), linear-gradient(90deg, rgb(220 195 138 / .07) 1px, transparent 1px)";

export default function LatarPahlawan() {
  const diam = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: jaring, backgroundSize: "56px 56px", maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgb(220_195_138/.20),transparent_46%),radial-gradient(circle_at_8%_95%,rgb(14_138_79/.22),transparent_50%)]" />

      {/* Cetak biru bangunan: di ponsel samar di belakang tulisan, di layar lebar di sisi kanan. */}
      <svg viewBox="0 0 520 420" fill="none" stroke="#DCC38A" strokeWidth="1.1" className="absolute -right-24 bottom-0 w-[480px] opacity-[0.16] md:right-6 md:w-[560px] md:opacity-[0.28] lg:right-16 lg:w-[640px]">
        <polygon points="40,170 260,50 480,170" />
        <polyline points="70,170 260,72 450,170" strokeDasharray="4 5" />
        <rect x="70" y="170" width="380" height="190" />
        <line x1="130" y1="170" x2="130" y2="360" />
        <line x1="200" y1="170" x2="200" y2="360" />
        <line x1="320" y1="170" x2="320" y2="360" />
        <line x1="390" y1="170" x2="390" y2="360" />
        <rect x="228" y="268" width="64" height="92" />
        <path d="M228 268 A32 32 0 0 1 292 268" />
        <rect x="88" y="200" width="30" height="38" />
        <rect x="88" y="274" width="30" height="38" />
        <rect x="402" y="200" width="30" height="38" />
        <rect x="402" y="274" width="30" height="38" />
        <rect x="224" y="196" width="72" height="40" strokeDasharray="4 5" />
        <line x1="20" y1="360" x2="500" y2="360" />
        <line x1="70" y1="392" x2="450" y2="392" strokeDasharray="2 4" />
        <line x1="70" y1="384" x2="70" y2="400" />
        <line x1="450" y1="384" x2="450" y2="400" />
        <circle cx="260" cy="118" r="16" strokeDasharray="3 4" />
      </svg>

      {butiran.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[hsl(var(--gold))]"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.ukuran, height: b.ukuran }}
          initial={{ opacity: 0.3 }}
          animate={diam ? { opacity: 0.3 } : { y: [0, -34, 0], opacity: [0.12, 0.65, 0.12] }}
          transition={{ duration: b.durasi, delay: b.tunda, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
