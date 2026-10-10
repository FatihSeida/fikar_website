import { useEffect, useMemo, useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Latar hijau gelap cerita interaktif yang hidup tetapi tenang: cahaya radial
 * yang berpindah mengikuti sisi adegan, garis kontur tipis, butiran cahaya emas
 * yang melayang pelan dan saling tersambung bila berdekatan, serta tekstur
 * halus. Butiran digambar di kanvas 2D 30 kali per detik dan berhenti saat
 * tab tersembunyi, saat pembaca di luar cerita, atau bila gerak dikurangi.
 */

const BUTIR = "data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E";

/** Garis kontur seperti peta topografi, dibuat sekali dengan acak berbiji. */
function buatKontur() {
  let biji = 7;
  const acak = () => {
    biji = (biji * 16807) % 2147483647;
    return biji / 2147483647;
  };
  const jalur: string[] = [];
  const pusat = [
    { x: 260, y: 300, cincin: 11 },
    { x: 1180, y: 720, cincin: 13 },
    { x: 1320, y: 120, cincin: 6 },
  ];
  for (const p of pusat) {
    const fase = [acak() * 6.28, acak() * 6.28, acak() * 6.28];
    for (let k = 1; k <= p.cincin; k++) {
      const titik: string[] = [];
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const r = k * 34 + 14 * Math.sin(3 * a + fase[0] + k * 0.18) + 9 * Math.sin(5 * a + fase[1] - k * 0.11) + 6 * Math.sin(2 * a + fase[2]);
        titik.push(`${(p.x + Math.cos(a) * r * 1.25).toFixed(1)},${(p.y + Math.sin(a) * r).toFixed(1)}`);
      }
      jalur.push(`M${titik.join("L")}Z`);
    }
  }
  return jalur;
}

type Butiran = { x: number; y: number; r: number; vy: number; fase: number; ayun: number };

function useButiranCahaya(kanvas: RefObject<HTMLCanvasElement>, tenang: boolean, jalan: boolean) {
  useEffect(() => {
    const el = kanvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    // Satu bintik cahaya digambar sekali lalu dipakai ulang untuk semua butiran.
    const bintik = document.createElement("canvas");
    bintik.width = bintik.height = 64;
    const b = bintik.getContext("2d")!;
    const g = b.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,240,196,1)");
    g.addColorStop(0.18, "rgba(232,205,140,0.85)");
    g.addColorStop(0.5, "rgba(220,195,138,0.18)");
    g.addColorStop(1, "rgba(220,195,138,0)");
    b.fillStyle = g;
    b.fillRect(0, 0, 64, 64);

    let lebar = 0;
    let tinggi = 0;
    let butiran: Butiran[] = [];
    const ukur = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      lebar = window.innerWidth;
      tinggi = window.innerHeight;
      el.width = Math.round(lebar * dpr);
      el.height = Math.round(tinggi * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const jumlah = lebar < 768 ? 24 : 44;
      if (butiran.length !== jumlah) {
        butiran = Array.from({ length: jumlah }, () => ({
          x: Math.random() * lebar,
          y: Math.random() * tinggi,
          r: 5 + Math.random() * 13,
          vy: 4 + Math.random() * 9,
          fase: Math.random() * Math.PI * 2,
          ayun: 6 + Math.random() * 14,
        }));
      }
    };

    const gambar = (t: number, dt: number) => {
      ctx.clearRect(0, 0, lebar, tinggi);
      const pos: [number, number][] = [];
      for (const p of butiran) {
        p.y -= p.vy * dt;
        if (p.y < -30) {
          p.y = tinggi + 30;
          p.x = Math.random() * lebar;
        }
        const x = p.x + Math.sin(t * 0.00023 + p.fase) * p.ayun;
        pos.push([x, p.y]);
      }
      // Jaring tipis antarbutiran yang berdekatan.
      ctx.lineWidth = 0.6;
      const batas = lebar < 768 ? 110 : 150;
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const dx = pos[i][0] - pos[j][0];
          const dy = pos[i][1] - pos[j][1];
          const d = Math.hypot(dx, dy);
          if (d < batas) {
            ctx.strokeStyle = `rgba(220,195,138,${((1 - d / batas) * 0.11).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(pos[i][0], pos[i][1]);
            ctx.lineTo(pos[j][0], pos[j][1]);
            ctx.stroke();
          }
        }
      }
      for (let i = 0; i < butiran.length; i++) {
        const p = butiran[i];
        ctx.globalAlpha = 0.28 + 0.32 * (0.5 + 0.5 * Math.sin(t * 0.0011 + p.fase * 3));
        ctx.drawImage(bintik, pos[i][0] - p.r, pos[i][1] - p.r, p.r * 2, p.r * 2);
      }
      ctx.globalAlpha = 1;
    };

    ukur();
    let id = 0;
    let lalu = 0;
    const putar = (t: number) => {
      id = requestAnimationFrame(putar);
      if (document.hidden) return;
      const dt = lalu ? Math.min(0.1, (t - lalu) / 1000) : 0;
      if (dt && dt < 0.031) return;
      lalu = t;
      gambar(t, dt);
    };
    if (tenang || !jalan) gambar(performance.now(), 0);
    else id = requestAnimationFrame(putar);

    const saatUbahUkuran = () => {
      ukur();
      if (tenang || !jalan) gambar(performance.now(), 0);
    };
    window.addEventListener("resize", saatUbahUkuran);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", saatUbahUkuran);
    };
  }, [kanvas, tenang, jalan]);
}

export default function LatarHidup({ tenang, sisi, jalan }: { tenang: boolean; sisi: "kiri" | "kanan" | "tengah"; jalan: boolean }) {
  const kanvas = useRef<HTMLCanvasElement>(null);
  const kontur = useMemo(buatKontur, []);
  const { scrollY } = useScroll();
  const geserKontur = useTransform(scrollY, (y) => -(y * 0.04) % 400);
  useButiranCahaya(kanvas, tenang, jalan);

  const posisiCahaya = sisi === "kiri" ? "22%" : sisi === "kanan" ? "78%" : "50%";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#071610]">
      <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-10%,rgba(14,138,79,0.16),transparent_70%),radial-gradient(70%_50%_at_50%_115%,rgba(11,42,30,0.9),transparent_70%)]" />
      <div
        className="absolute top-1/2 h-[95vmax] w-[95vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(14,138,79,0.2),rgba(14,138,79,0.06)_55%,transparent)] transition-[left] duration-[2400ms] ease-in-out"
        style={{ left: posisiCahaya }}
      />
      <div
        className="absolute top-[38%] h-[46vmax] w-[46vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(220,195,138,0.09),transparent)] transition-[left] duration-[3000ms] ease-in-out"
        style={{ left: posisiCahaya }}
      />
      <motion.div className="absolute -inset-x-[10%] -top-[10%] h-[140%]" style={{ y: tenang ? 0 : geserKontur }}>
        <motion.svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          animate={tenang ? undefined : { x: [0, 26, -14, 0], rotate: [0, 0.6, -0.4, 0] }}
          transition={{ duration: 90, ease: "easeInOut", repeat: Infinity }}
        >
          <g fill="none" stroke="#DCC38A" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {kontur.map((d, i) => <path key={i} d={d} strokeOpacity={i % 4 === 0 ? 0.085 : 0.045} />)}
          </g>
        </motion.svg>
      </motion.div>
      <canvas ref={kanvas} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 opacity-[0.11] mix-blend-soft-light" style={{ backgroundImage: `url("${BUTIR}")` }} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(2,8,6,0.55))]" />
    </div>
  );
}
