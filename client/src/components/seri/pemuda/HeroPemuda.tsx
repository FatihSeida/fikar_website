import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { labelWaktu } from "@shared/rilis";
import type { InfoSeri } from "../tipe";

const RADIUS_CINCIN = [70, 135, 210, 300, 400];
// Titik emas di cincin: [indeks cincin, sudut derajat, jeda kedip]
const TITIK: [number, number, number][] = [
  [0, 20, 0], [0, 200, 1.4], [1, 75, 0.6], [1, 250, 2.2], [2, 130, 1.1], [2, 310, 0.2], [2, 40, 2.8],
  [3, 95, 1.8], [3, 190, 0.4], [3, 285, 2.4], [4, 15, 1.2], [4, 160, 2.0], [4, 230, 0.8], [4, 335, 1.6],
];

const TAUTAN = [
  { href: "#tulisan", teks: "Tulisan" },
  { href: "#peta", teks: "Peta suara" },
  { href: "#angka", teks: "Angka partisipasi" },
  { href: "#tanggapan", teks: "Tanggapan" },
];

function lompat(e: MouseEvent<HTMLAnchorElement>, diam: boolean) {
  const sasaran = document.querySelector(e.currentTarget.getAttribute("href") ?? "");
  if (!sasaran) return;
  e.preventDefault();
  sasaran.scrollIntoView({ behavior: diam ? "auto" : "smooth", block: "start" });
}

/** Hero hijau tua Series 3: cincin suara yang merambat pelan dari satu titik, seperti suara kader dari seluruh Indonesia. */
export default function HeroPemuda({ seri }: { seri: InfoSeri }) {
  const diam = !!useReducedMotion();
  const nomor = String(seri.nomor).padStart(2, "0");

  return (
    <header className="relative isolate overflow-hidden bg-[hsl(var(--evidence))] text-white">
      {/* Cahaya dan jaring tipis */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "radial-gradient(60% 75% at 82% 8%, hsl(var(--gold) / 0.16), transparent 62%), radial-gradient(55% 70% at 0% 100%, hsl(var(--primary) / 0.42), transparent 65%)" }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 90% at 70% 30%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 90% at 70% 30%, #000 20%, transparent 78%)",
        }}
      />

      {/* Cincin suara */}
      <svg aria-hidden="true" viewBox="-450 -450 900 900" className="absolute -right-[360px] -top-[250px] -z-10 h-[820px] w-[820px] max-w-none sm:-right-[8%] sm:-top-[26%] md:-right-[2%] md:-top-[34%] md:h-[1000px] md:w-[1000px]">
        {RADIUS_CINCIN.map((r, i) => (
          <motion.circle
            key={r} cx={0} cy={0} r={r} fill="none" stroke="hsl(42 52% 58%)" strokeWidth={1}
            initial={{ opacity: 0.14 }}
            animate={diam ? undefined : { opacity: [0.1, 0.34, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
          />
        ))}
        {TITIK.map(([cincin, sudut, jeda], i) => {
          const r = RADIUS_CINCIN[cincin];
          const rad = (sudut * Math.PI) / 180;
          return (
            <motion.circle
              key={i} cx={Math.cos(rad) * r} cy={Math.sin(rad) * r} r={cincin > 2 ? 3.2 : 2.6} fill="hsl(42 52% 62%)"
              initial={{ opacity: 0.55 }}
              animate={diam ? undefined : { opacity: [0.25, 0.95, 0.25] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: jeda }}
            />
          );
        })}
        <circle cx={0} cy={0} r={6} fill="hsl(42 52% 62%)" />
        <circle cx={0} cy={0} r={14} fill="none" stroke="hsl(42 52% 62%)" strokeOpacity={0.5} />
      </svg>

      <div className="container mx-auto max-w-5xl px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
        <Link href="/series" className="mb-12 inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-[hsl(var(--gold))]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua seri
        </Link>

        <p className="evidence-kicker flex items-center gap-3">
          <span>Series {nomor}</span>
          <span aria-hidden="true" className="h-px w-8 bg-[hsl(var(--gold))]/60" />
          <span className="text-white/60">Suara kader</span>
        </p>
        <h1 className="mt-6 max-w-3xl font-serif text-[2.5rem] leading-[1.08] md:text-6xl lg:text-7xl">{seri.judul}</h1>
        {seri.subjudul && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">{seri.subjudul}</p>}

        <p className="mt-9 flex flex-col gap-y-1.5 text-sm text-white/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
          <span>Oleh <span className="text-white">{seri.penulis}</span></span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>{labelWaktu(seri.rilis)}</span>
          {seri.tautanMedia && (
            <>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <a href={seri.tautanMedia} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[hsl(var(--gold))] hover:underline">
                Juga dimuat di {seri.namaMedia || "media"} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </>
          )}
        </p>

        <nav aria-label="Isi halaman" className="mt-12 flex flex-wrap gap-2.5">
          {TAUTAN.map((t) => (
            <a
              key={t.href} href={t.href} onClick={(e) => lompat(e, diam)}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--gold))]"
            >
              {t.teks}
            </a>
          ))}
        </nav>
      </div>
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/40 to-transparent" />
    </header>
  );
}
