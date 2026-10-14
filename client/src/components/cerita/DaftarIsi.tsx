import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import type { BabCerita } from "@shared/cerita";
import { duaAngka } from "./alat";

/** Daftar isi cerita. Semua bagian terbuka: klik salah satu untuk melompat ke sana. */

type PropsDaftar = {
  bab: BabCerita[];
  aktif: number;
  onPilih: (id: string) => void;
  ringkas?: boolean;
};

export function DaftarIsi({ bab, aktif, onPilih, ringkas = false }: PropsDaftar) {
  const teks = ringkas ? "text-sm" : "text-[15px]";
  return (
    <ol className={ringkas ? "space-y-0.5" : "space-y-1"}>
      {bab.map((b, i) => {
        const sedang = i === aktif;
        return (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => onPilih(b.id)}
              aria-current={sedang ? "step" : undefined}
              aria-label={`Bagian ${i + 1}: ${b.judul}${sedang ? ", sedang dibaca" : ""}`}
              className={`flex w-full items-start gap-3 px-3 py-2 text-left transition-colors hover:bg-white/[0.06] ${sedang ? "bg-white/[0.07]" : ""}`}
            >
              <span className="mt-0.5 w-7 shrink-0 font-serif text-sm text-[#DCC38A]">{duaAngka(i + 1)}</span>
              <span className="min-w-0 flex-1">
                <span className={`block leading-snug text-[#F6F4E9] ${teks}`}>{b.judul}</span>
              </span>
              <span className="mt-0.5 shrink-0" aria-hidden="true">
                {sedang && <span className="mt-1 block h-2 w-2 rounded-full bg-[#DCC38A] shadow-[0_0_10px_#DCC38A]" />}
              </span>
            </button>
          </li>
        );
      })}
      <li>
        <button type="button" onClick={() => onPilih("penutup")} className="flex w-full items-start gap-3 px-3 py-2 text-left transition-colors hover:bg-white/[0.06]">
          <span className="mt-0.5 w-7 shrink-0 font-serif text-sm text-[#DCC38A]">✦</span>
          <span className={`flex-1 text-[#F6F4E9] ${teks}`}>Penutup</span>
        </button>
      </li>
    </ol>
  );
}

type PropsMengambang = PropsDaftar & { tampil: boolean; tenang: boolean };

/** Tombol kecil di pojok kiri bawah: posisi baca dan daftar isi yang bisa dibuka. */
export function DaftarIsiMengambang({ tampil, tenang, ...daftar }: PropsMengambang) {
  const [buka, setBuka] = useState(false);
  const wadah = useRef<HTMLDivElement>(null);
  const tombol = useRef<HTMLButtonElement>(null);
  const idPanel = useId();
  const jumlah = daftar.bab.length;
  const posisi = Math.min(Math.max(daftar.aktif, 0) + 1, jumlah);
  const persen = Math.round((posisi / Math.max(1, jumlah)) * 100);

  useEffect(() => {
    if (!buka) return;
    const tutupDiLuar = (e: PointerEvent) => { if (!wadah.current?.contains(e.target as Node)) setBuka(false); };
    const tutupEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBuka(false);
        tombol.current?.focus();
      }
    };
    document.addEventListener("pointerdown", tutupDiLuar);
    document.addEventListener("keydown", tutupEsc);
    return () => {
      document.removeEventListener("pointerdown", tutupDiLuar);
      document.removeEventListener("keydown", tutupEsc);
    };
  }, [buka]);

  useEffect(() => { if (!tampil) setBuka(false); }, [tampil]);

  return (
    <div
      ref={wadah}
      className={`fixed left-3 z-40 transition-all duration-500 md:left-6 bottom-[calc(76px+env(safe-area-inset-bottom))] md:bottom-6 ${tampil ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      aria-hidden={!tampil}
    >
      <AnimatePresence>
        {buka && (
          <motion.div
            id={idPanel}
            role="dialog"
            aria-label="Daftar isi"
            initial={tenang ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={tenang ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-full left-0 mb-3 w-[min(360px,calc(100vw-24px))] border border-[#DCC38A]/20 bg-[#061511]/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="evidence-kicker">Daftar isi</span>
              <span className="text-xs text-white/50">Bagian {posisi} dari {jumlah}</span>
            </div>
            <div className="max-h-[min(56vh,460px)] overflow-y-auto py-2">
              <DaftarIsi {...daftar} ringkas onPilih={(id) => { setBuka(false); daftar.onPilih(id); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        ref={tombol}
        type="button"
        tabIndex={tampil ? 0 : -1}
        onClick={() => setBuka((b) => !b)}
        aria-expanded={buka}
        aria-controls={buka ? idPanel : undefined}
        aria-label={`Daftar isi, bagian ${posisi} dari ${jumlah}`}
        className="flex items-center gap-2 rounded-full border border-[#DCC38A]/30 bg-[#061511]/95 p-1.5 text-left text-[#F6F4E9] shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition-colors hover:border-[#DCC38A]/70 md:gap-3 md:pr-4"
      >
        <span
          aria-hidden="true"
          className="grid h-9 w-9 place-items-center rounded-full"
          style={{ background: `conic-gradient(#DCC38A ${persen}%, rgba(255,255,255,0.12) 0)` }}
        >
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#071610] font-serif text-[11px] text-[#DCC38A]">{duaAngka(posisi)}</span>
        </span>
        <span aria-hidden="true" className="hidden leading-tight md:block">
          <span className="block text-[10px] uppercase tracking-[0.18em] text-white/55">Bagian {posisi} dari {jumlah}</span>
          <span className="block text-sm">Daftar isi</span>
        </span>
        <ChevronUp aria-hidden="true" className={`mr-1 h-4 w-4 text-[#DCC38A] transition-transform md:mr-0 ${buka ? "" : "rotate-180"}`} />
      </button>
    </div>
  );
}
