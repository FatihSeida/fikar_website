import { useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, Check, Plus } from "lucide-react";
import type { BabCerita } from "@shared/cerita";
import type { EntriAdegan, Lapis } from "./kontrak";
import PanggungAdegan from "./PanggungAdegan";
import { duaAngka, paragraf } from "./alat";

/**
 * Satu bagian cerita: dua kolom bergantian (bagian ganjil penjelasan di kiri,
 * genap di kanan), adegan menempel selama bagian digulir. Di ponsel adegan
 * menempel di atas setinggi 40% layar. Penjelasan dibuka bertahap, lalu
 * pembaca menandai paham untuk membuka bagian berikutnya.
 */

type PropsBab = {
  bab: BabCerita;
  indeks: number;
  jumlah: number;
  entri: EntriAdegan | undefined;
  memuat: boolean;
  tenang: boolean;
  sudahPaham: boolean;
  baru: boolean;
  onPaham: () => void;
  onLanjut: () => void;
};

const MULUS = [0.22, 1, 0.36, 1] as const;

function Lapisan({ tingkat, judul, terbuka, onUbah, tenang, children }: { tingkat: string; judul: string; terbuka: boolean; onUbah: () => void; tenang: boolean; children: ReactNode }) {
  const id = useId();
  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={onUbah}
        aria-expanded={terbuka}
        aria-controls={terbuka ? id : undefined}
        className="group flex w-full items-center justify-between gap-5 py-4 text-left"
      >
        <span>
          <span className="block text-[10px] uppercase tracking-[0.22em] text-[#DCC38A]/75">{tingkat}</span>
          <span className="mt-1 block font-serif text-lg leading-snug text-[#F6F4E9] transition-colors group-hover:text-[#DCC38A] md:text-xl">{judul}</span>
        </span>
        <span aria-hidden="true" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${terbuka ? "rotate-45 border-[#DCC38A] bg-[#DCC38A] text-[#071610]" : "border-[#DCC38A]/40 text-[#DCC38A] group-hover:border-[#DCC38A]"}`}>
          <Plus className="h-4 w-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {terbuka && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: tenang ? 0 : 0.5, ease: MULUS }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pb-7 text-[15px] leading-[1.8] text-white/75 md:text-base">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Bab({ bab, indeks, jumlah, entri, memuat, tenang, sudahPaham, baru, onPaham, onLanjut }: PropsBab) {
  const ref = useRef<HTMLElement>(null);
  const [lapis, setLapis] = useState<Lapis>(0);
  // Progres 0 saat bagian mulai masuk layar, 1 saat ujung bagian (kotak "Sudah paham?") terlihat.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end end"] });
  const progres = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.5, restDelta: 0.0005 });
  const teksKiri = indeks % 2 === 0;
  const terakhir = indeks === jumlah - 1;
  const idJudul = `${bab.id}-judul`;

  const ubahLanjut = () => setLapis(lapis >= 1 ? 0 : 1);
  const ubahDalam = () => setLapis(lapis >= 2 ? (bab.lanjut ? 1 : 0) : 2);
  const munculPoin = tenang ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "0px 0px -12% 0px" }, transition: { duration: 0.7, ease: MULUS } };

  return (
    <motion.section
      ref={ref}
      id={bab.id}
      aria-labelledby={idJudul}
      initial={baru && !tenang ? { opacity: 0, y: 48 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: MULUS }}
      className="container relative mx-auto flex scroll-mt-[60px] flex-col px-5 md:px-8 lg:grid lg:scroll-mt-0 lg:grid-cols-12 lg:gap-x-14"
    >
      {/* Penjelasan */}
      <div className={`relative pb-[12vh] pt-8 lg:row-start-1 lg:col-span-5 lg:pb-[16vh] lg:pt-[20vh] ${teksKiri ? "lg:col-start-1" : "lg:col-start-8"}`}>
        <header>
          <div className="flex items-end gap-4">
            <span aria-hidden="true" className="font-serif text-6xl leading-none text-[#DCC38A]/30 lg:text-7xl">{duaAngka(indeks + 1)}</span>
            <p className="evidence-kicker pb-1.5">{bab.label}</p>
          </div>
          <h2 id={idJudul} tabIndex={-1} data-fokus className="mt-5 text-balance font-serif text-[2rem] leading-[1.12] text-[#F6F4E9] focus:outline-none md:text-[2.75rem] xl:text-5xl">
            {bab.judul}
          </h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-white/80 md:text-lg">{bab.inti}</p>
        </header>

        {!!bab.poin?.length && (
          <ol className="mt-[9vh] space-y-[7vh] lg:mt-[14vh] lg:space-y-[16vh]">
            {bab.poin.map((poin, i) => (
              <motion.li key={i} {...munculPoin} className="relative flex gap-4 border-l border-[#DCC38A]/40 bg-gradient-to-r from-[#DCC38A]/[0.07] to-transparent py-4 pl-5 pr-3">
                <span aria-hidden="true" className="absolute -left-[4.5px] top-6 h-2 w-2 rounded-full bg-[#DCC38A] shadow-[0_0_12px_#DCC38A]" />
                <span className="font-serif text-sm text-[#DCC38A]/80">{duaAngka(i + 1)}</span>
                <span className="text-[15px] leading-relaxed text-[#F6F4E9]/90 md:text-base">{poin}</span>
              </motion.li>
            ))}
          </ol>
        )}

        {(bab.lanjut || bab.dalam) && (
          <div className="mt-[9vh] border-b border-white/10 lg:mt-[14vh]">
            {bab.lanjut && (
              <Lapisan tingkat="Penjelasan tambahan" judul={bab.lanjut.judul} terbuka={lapis >= 1} onUbah={ubahLanjut} tenang={tenang}>
                {paragraf(bab.lanjut.isi).map((p, i) => <p key={i}>{p}</p>)}
              </Lapisan>
            )}
            <AnimatePresence initial={false}>
              {bab.dalam && (lapis >= 1 || !bab.lanjut) && (
                <motion.div key="dalam" initial={tenang ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={tenang ? undefined : { opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: MULUS }} className="overflow-hidden">
                  <Lapisan tingkat="Lebih dalam" judul={bab.dalam.judul} terbuka={lapis >= 2} onUbah={ubahDalam} tenang={tenang}>
                    {paragraf(bab.dalam.isi).map((p, i) => <p key={i}>{p}</p>)}
                    {bab.dalam.kutipan && (
                      <figure className="!mt-6 border-l-2 border-[#DCC38A] bg-[#DCC38A]/[0.06] py-4 pl-5 pr-4">
                        <blockquote className="font-serif text-[17px] italic leading-relaxed text-[#F6F4E9]/90 md:text-lg">“{bab.dalam.kutipan.replace(/^["“]|["”]$/g, "")}”</blockquote>
                        <figcaption className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#DCC38A]/80">Dari naskah asli</figcaption>
                      </figure>
                    )}
                  </Lapisan>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Gerbang pemahaman */}
        <div className="mt-[9vh] border border-[#DCC38A]/30 bg-[#04110c]/75 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm md:p-8 lg:mt-[14vh]">
          <p className="evidence-kicker">Sudah paham?</p>
          <p className="mt-3 font-serif text-xl leading-snug text-[#F6F4E9] md:text-2xl">{bab.pahami}</p>
          {sudahPaham ? (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="inline-flex items-center gap-2 text-sm text-[#DCC38A]"><Check className="h-4 w-4" /> Sudah kamu pahami</span>
              <button type="button" onClick={onLanjut} className="inline-flex items-center gap-2 text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline">
                {terakhir ? "Ke penutup" : "Ke bagian berikutnya"} <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={onPaham} className="mt-6 inline-flex items-center gap-2 bg-[#DCC38A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#071610] shadow-[0_10px_30px_-10px_rgba(220,195,138,0.6)] transition-transform hover:-translate-y-0.5">
                Saya paham, lanjutkan <ArrowDown className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs leading-relaxed text-white/50">{terakhir ? "Penutup terbuka setelah tombol ini ditekan." : "Bagian berikutnya terbuka setelah tombol ini ditekan."}</p>
            </>
          )}
        </div>
      </div>

      {/* Adegan: menempel di atas pada ponsel, di kolom samping pada layar lebar */}
      <div className={`sticky top-[60px] z-10 order-first -mx-5 h-[40svh] md:-mx-8 lg:order-none lg:top-[84px] lg:row-start-1 lg:mx-0 lg:h-[calc(100svh-104px)] lg:self-start lg:col-span-7 ${teksKiri ? "lg:col-start-6" : "lg:col-start-1"}`}>
        <div aria-hidden="true" className="absolute inset-0 bg-[#071610] lg:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,rgba(14,138,79,0.16),transparent_75%)]" />
          <div className="absolute inset-x-0 top-full h-8 bg-gradient-to-b from-[#071610] to-transparent" />
        </div>
        <div className="absolute inset-0">
          <PanggungAdegan id={bab.id} entri={entri} memuat={memuat} progres={progres} lapis={lapis} tenang={tenang} judul={bab.judul} />
        </div>
      </div>
    </motion.section>
  );
}
