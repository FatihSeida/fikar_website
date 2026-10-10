import { motion } from "framer-motion";
import { ArrowRight, Lock, MessageSquareText } from "lucide-react";
import { Link } from "wouter";
import type { BabCerita, CeritaSeri } from "@shared/cerita";
import { TombolUlangi } from "./DaftarIsi";
import { duaAngka, paragraf } from "./alat";

/** Penutup cerita (setelah bagian terakhir dipahami) dan penanda bagian yang belum terbuka. */

export function BagianTerkunci({ bab, sampai }: { bab: BabCerita[]; sampai: number }) {
  const berikut = bab[sampai + 1];
  const sisa = bab.length - sampai - 1;
  return (
    <section aria-label="Bagian yang belum terbuka" className="container mx-auto px-5 pb-28 pt-6 md:px-8">
      <div className="mx-auto max-w-xl border border-dashed border-white/15 bg-[#04110c]/40 px-6 py-10 text-center">
        <Lock aria-hidden="true" className="mx-auto h-5 w-5 text-[#DCC38A]/60" />
        {berikut ? (
          <>
            <p className="evidence-kicker mt-4 text-white/45">Bagian {sampai + 2} dari {bab.length} · belum terbuka</p>
            <p className="mt-3 font-serif text-2xl leading-snug text-white/40">{berikut.judul}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/55">Tekan “Saya paham, lanjutkan” di atas untuk membukanya.</p>
            <p className="mt-2 text-xs text-white/35">{sisa > 1 ? `Masih ada ${sisa} bagian lagi, lalu penutup.` : "Ini bagian terakhir sebelum penutup."}</p>
          </>
        ) : (
          <>
            <p className="evidence-kicker mt-4 text-white/45">Penutup · belum terbuka</p>
            <p className="mt-4 text-sm leading-relaxed text-white/55">Penutup terbuka setelah kamu menandai paham bagian terakhir.</p>
          </>
        )}
      </div>
    </section>
  );
}

export function Penutup({ cerita, baru, tenang, onUlangi }: { cerita: CeritaSeri; baru: boolean; tenang: boolean; onUlangi: () => void }) {
  const { penutup, rujukan } = cerita;
  return (
    <motion.section
      id="penutup"
      aria-labelledby="judul-penutup"
      initial={baru && !tenang ? { opacity: 0, y: 40 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-16 px-5 pb-28 pt-[16vh] md:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-[#DCC38A]/40" />
          <p className="evidence-kicker">Penutup · {duaAngka(cerita.bab.length)} bagian selesai</p>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-transparent to-[#DCC38A]/40" />
        </div>
        <h2 id="judul-penutup" tabIndex={-1} data-fokus className="mt-10 text-balance text-center font-serif text-4xl leading-[1.1] text-[#F6F4E9] focus:outline-none md:text-6xl">
          {penutup.judul}
        </h2>
        <div className="mx-auto mt-10 max-w-2xl space-y-5 text-[17px] leading-[1.85] text-white/80 md:text-lg">
          {paragraf(penutup.isi).map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {penutup.ajakan && (
          <div className="mx-auto mt-12 max-w-2xl border border-[#DCC38A]/35 bg-gradient-to-br from-[#DCC38A]/[0.12] to-transparent p-7 md:p-9">
            <p className="evidence-kicker">Ajakan</p>
            <p className="mt-3 font-serif text-xl leading-snug text-[#F6F4E9] md:text-2xl">{penutup.ajakan}</p>
          </div>
        )}

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center gap-x-7 gap-y-4">
          <a href="#tanggapan" className="inline-flex items-center gap-2 bg-[#DCC38A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#071610] transition-transform hover:-translate-y-0.5">
            <MessageSquareText className="h-4 w-4" /> Tulis tanggapan
          </a>
          <Link href="/series" className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-[#DCC38A]">
            Baca seri lain <ArrowRight className="h-4 w-4" />
          </Link>
          <TombolUlangi onUlangi={onUlangi} />
        </div>

        {!!rujukan?.length && (
          <div className="mx-auto mt-16 max-w-2xl border-t border-white/10 pt-8">
            <h3 className="font-sans text-[11px] font-normal uppercase tracking-[0.22em] text-white/50">Rujukan</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/60 marker:text-[#DCC38A]/70">
              {rujukan.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </div>
        )}
      </div>
    </motion.section>
  );
}
