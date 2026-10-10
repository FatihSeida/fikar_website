import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronUp, Lock, RotateCcw } from "lucide-react";
import type { BabCerita } from "@shared/cerita";
import { duaAngka } from "./alat";

/**
 * Daftar isi cerita. Bagian yang sudah terbuka bisa diklik untuk diulang;
 * bagian yang belum terbuka tampil redup dengan gembok.
 */

type PropsDaftar = {
  bab: BabCerita[];
  sampai: number;
  aktif: number;
  onPilih: (id: string) => void;
  ringkas?: boolean;
};

export function DaftarIsi({ bab, sampai, aktif, onPilih, ringkas = false }: PropsDaftar) {
  const selesai = sampai >= bab.length;
  return (
    <ol className={ringkas ? "space-y-0.5" : "space-y-1"}>
      {bab.map((b, i) => {
        const terbuka = i <= sampai;
        const paham = i < sampai;
        const sedang = i === aktif;
        const isi = (
          <>
            <span className={`mt-0.5 w-7 shrink-0 font-serif text-sm ${terbuka ? "text-[#DCC38A]" : "text-white/25"}`}>{duaAngka(i + 1)}</span>
            <span className="min-w-0 flex-1">
              <span className={`block leading-snug ${ringkas ? "text-sm" : "text-[15px]"} ${terbuka ? "text-[#F6F4E9]" : "text-white/30"}`}>{b.judul}</span>
            </span>
            <span className="mt-0.5 shrink-0" aria-hidden="true">
              {paham ? <Check className="h-4 w-4 text-[#DCC38A]" /> : terbuka ? <span className="mt-1 block h-2 w-2 rounded-full bg-[#DCC38A] shadow-[0_0_10px_#DCC38A]" /> : <Lock className="h-3.5 w-3.5 text-white/25" />}
            </span>
          </>
        );
        const status = paham ? "sudah dipahami" : terbuka ? "sedang dibaca" : "belum terbuka";
        return (
          <li key={b.id}>
            {terbuka ? (
              <button
                type="button"
                onClick={() => onPilih(b.id)}
                aria-current={sedang ? "step" : undefined}
                aria-label={`Bagian ${i + 1}: ${b.judul}, ${status}`}
                className={`flex w-full items-start gap-3 px-3 py-2 text-left transition-colors hover:bg-white/[0.06] ${sedang ? "bg-white/[0.07]" : ""}`}
              >
                {isi}
              </button>
            ) : (
              <div aria-label={`Bagian ${i + 1}: ${b.judul}, ${status}`} className="flex items-start gap-3 px-3 py-2">
                {isi}
              </div>
            )}
          </li>
        );
      })}
      <li>
        {selesai ? (
          <button type="button" onClick={() => onPilih("penutup")} className="flex w-full items-start gap-3 px-3 py-2 text-left transition-colors hover:bg-white/[0.06]">
            <span className="mt-0.5 w-7 shrink-0 font-serif text-sm text-[#DCC38A]">✦</span>
            <span className={`flex-1 ${ringkas ? "text-sm" : "text-[15px]"} text-[#F6F4E9]`}>Penutup</span>
          </button>
        ) : (
          <div className="flex items-start gap-3 px-3 py-2">
            <span className="mt-0.5 w-7 shrink-0 font-serif text-sm text-white/25">✦</span>
            <span className={`flex-1 ${ringkas ? "text-sm" : "text-[15px]"} text-white/30`}>Penutup</span>
            <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 text-white/25" />
          </div>
        )}
      </li>
    </ol>
  );
}

/** Tombol "Ulangi dari awal" dengan konfirmasi singkat supaya tidak terhapus tanpa sengaja. */
export function TombolUlangi({ onUlangi, kecil = false }: { onUlangi: () => void; kecil?: boolean }) {
  const [tanya, setTanya] = useState(false);
  if (!tanya) {
    return (
      <button type="button" onClick={() => setTanya(true)} className={`inline-flex items-center gap-2 text-white/60 underline-offset-4 transition-colors hover:text-[#DCC38A] hover:underline ${kecil ? "text-xs" : "text-sm"}`}>
        <RotateCcw className="h-3.5 w-3.5" /> Ulangi dari awal
      </button>
    );
  }
  return (
    <div role="group" aria-label="Konfirmasi ulangi dari awal" className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${kecil ? "text-xs" : "text-sm"}`}>
      <span className="text-white/70">Semua bagian akan terkunci lagi. Lanjut?</span>
      <button type="button" autoFocus onClick={() => { setTanya(false); onUlangi(); }} className="font-semibold text-[#DCC38A] underline underline-offset-4">Ya, ulangi</button>
      <button type="button" onClick={() => setTanya(false)} className="text-white/60 hover:text-white">Batal</button>
    </div>
  );
}

type PropsMengambang = PropsDaftar & { tampil: boolean; onUlangi: () => void; tenang: boolean };

/** Tombol kecil di pojok kiri bawah: posisi baca dan daftar isi yang bisa dibuka. */
export function DaftarIsiMengambang({ tampil, onUlangi, tenang, ...daftar }: PropsMengambang) {
  const [buka, setBuka] = useState(false);
  const wadah = useRef<HTMLDivElement>(null);
  const tombol = useRef<HTMLButtonElement>(null);
  const idPanel = useId();
  const jumlah = daftar.bab.length;
  const persen = Math.round((Math.min(daftar.sampai, jumlah) / Math.max(1, jumlah)) * 100);
  const posisi = daftar.aktif >= 0 ? daftar.aktif + 1 : Math.min(daftar.sampai + 1, jumlah);

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
            className="absolute bottom-full left-0 mb-3 w-[min(360px,calc(100vw-24px))] border border-[#DCC38A]/20 bg-[#061511]/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="evidence-kicker">Daftar isi</span>
              <span className="text-xs text-white/50">{Math.min(daftar.sampai, jumlah)} dari {jumlah} dipahami</span>
            </div>
            <div className="max-h-[min(56vh,460px)] overflow-y-auto py-2">
              <DaftarIsi {...daftar} ringkas onPilih={(id) => { setBuka(false); daftar.onPilih(id); }} />
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <TombolUlangi kecil onUlangi={() => { setBuka(false); onUlangi(); }} />
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
        className="flex items-center gap-2 rounded-full border border-[#DCC38A]/30 bg-[#061511]/90 p-1.5 text-left text-[#F6F4E9] shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:border-[#DCC38A]/70 md:gap-3 md:pr-4"
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
