import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import type { CeritaSeri } from "@shared/cerita";
import type { InfoSeri } from "@/components/seri/tipe";
import { DaftarIsi, TombolUlangi } from "./DaftarIsi";
import { duaAngka, paragraf } from "./alat";

/** Halaman pembuka cerita: judul, caption seri, penulis, cara membaca, dan daftar isi. */

type PropsPembuka = {
  seri: InfoSeri;
  cerita: CeritaSeri;
  sampai: number;
  menit: number;
  tenang: boolean;
  onMulai: () => void;
  onPilih: (id: string) => void;
  onUlangi: () => void;
};

const tanggal = (waktu: number) => new Date(waktu).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

const caraMembaca = [
  "Gulir pelan. Gambar di samping bergerak mengikuti bacaanmu.",
  "Buka penjelasan tambahan bila ingin tahu lebih dalam.",
  "Tekan “Saya paham” untuk membuka bagian berikutnya.",
];

const Pembuka = forwardRef<HTMLElement, PropsPembuka>(function Pembuka({ seri, cerita, sampai, menit, tenang, onMulai, onPilih, onUlangi }, ref) {
  const jumlah = cerita.bab.length;
  const nomor = `Series ${duaAngka(seri.nomor)}`;
  const label = cerita.pembuka.label.trim();
  const lanjutan = sampai > 0 && sampai < jumlah;
  const selesai = sampai >= jumlah;
  const masuk = (tunda: number) => (tenang ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: tunda, ease: [0.22, 1, 0.36, 1] as const } });

  return (
    <section ref={ref} aria-labelledby="judul-cerita" className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 lg:pt-32">
      {/* Cincin emas: perahu, karang, dan dunia dalam satu lambang tenang */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-[18vmax] top-1/2 hidden h-[80vmax] w-[80vmax] -translate-y-1/2 rounded-full border border-[#DCC38A]/[0.09] lg:block">
        <div className="absolute inset-[12%] rounded-full border border-[#DCC38A]/[0.07]" />
        <div className="absolute inset-[27%] rounded-full border border-[#DCC38A]/[0.06]" />
        <div className="absolute inset-[42%] rounded-full bg-[radial-gradient(circle,rgba(220,195,138,0.08),transparent_70%)]" />
      </div>

      <div className="container relative mx-auto grid gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.div {...masuk(0)} className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="evidence-kicker">{nomor}</span>
            {label && label.toLowerCase() !== nomor.toLowerCase() && (
              <>
                <span aria-hidden="true" className="h-px w-5 bg-[#DCC38A]/40" />
                <span className="evidence-kicker text-white/60">{label}</span>
              </>
            )}
            <span aria-hidden="true" className="h-px w-5 bg-[#DCC38A]/40" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">Cerita interaktif · {jumlah} bagian</span>
          </motion.div>

          <motion.h1 {...masuk(0.08)} id="judul-cerita" className="mt-7 text-balance font-serif text-[2.6rem] font-medium leading-[1.05] text-[#F6F4E9] md:text-7xl xl:text-[5.4rem]">
            {cerita.pembuka.judul}
          </motion.h1>

          {seri.subjudul && (
            <motion.p {...masuk(0.16)} className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-[#DCC38A] md:text-2xl">
              {seri.subjudul}
            </motion.p>
          )}

          <motion.div {...masuk(0.24)} className="mt-7 max-w-2xl space-y-4 text-[17px] leading-[1.75] text-white/75 md:text-lg">
            {paragraf(cerita.pembuka.pengantar).map((p, i) => <p key={i}>{p}</p>)}
          </motion.div>

          <motion.p {...masuk(0.3)} className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
            <span>Oleh <span className="text-[#F6F4E9]">{seri.penulis}</span></span>
            <span aria-hidden="true">·</span>
            <span>Terbit {tanggal(seri.rilis)}</span>
            <span aria-hidden="true">·</span>
            <span>Sekitar {menit} menit</span>
            {seri.tautanMedia && (
              <>
                <span aria-hidden="true">·</span>
                <a href={seri.tautanMedia} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#DCC38A] hover:underline">
                  Juga dimuat di {seri.namaMedia || "media"} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </>
            )}
          </motion.p>

          <motion.div {...masuk(0.36)} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <button type="button" onClick={onMulai} className="inline-flex items-center gap-2 bg-[#DCC38A] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#071610] shadow-[0_14px_40px_-14px_rgba(220,195,138,0.7)] transition-transform hover:-translate-y-0.5">
              {selesai ? "Baca penutup" : lanjutan ? `Lanjutkan dari bagian ${sampai + 1}` : "Mulai membaca"} <ArrowDown className="h-4 w-4" />
            </button>
            {sampai > 0 && <TombolUlangi onUlangi={onUlangi} />}
            <Link href="/series" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#DCC38A]">
              Semua seri <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.ol {...masuk(0.44)} className="mt-12 grid max-w-2xl gap-3 border-t border-white/10 pt-6 sm:grid-cols-3" aria-label="Cara membaca">
            {caraMembaca.map((cara, i) => (
              <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-white/60">
                <span className="font-serif text-[#DCC38A]">{i + 1}</span>
                <span>{cara}</span>
              </li>
            ))}
          </motion.ol>
        </div>

        <motion.aside {...masuk(0.5)} aria-labelledby="judul-daftar-isi" className="self-center lg:col-span-5 lg:pl-6 xl:pl-12">
          <div className="border border-[#DCC38A]/20 bg-[#04110c]/55 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 id="judul-daftar-isi" className="evidence-kicker font-sans font-normal">Daftar isi</h2>
              <span className="text-xs text-white/45">{Math.min(sampai, jumlah)} dari {jumlah} dipahami</span>
            </div>
            <div className="py-2">
              <DaftarIsi bab={cerita.bab} sampai={sampai} aktif={-1} onPilih={onPilih} ringkas />
            </div>
          </div>
        </motion.aside>
      </div>

    </section>
  );
});

export default Pembuka;
