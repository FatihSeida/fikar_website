import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useLocation } from "wouter";
import TeksIstilah from "@/components/TeksIstilah";
import { pesanAudiens, type AudiensId } from "@/lib/pesan";
import "@/styles/sambutan.css";

const KUNCI = "hmi-evidence-sambutan";
const lembut = [0.16, 1, 0.3, 1] as const;

/** Figur setinggi panel yang keluar di sisi kanan; nama berada di kiri kepalanya. */
function FotoZulfikar({ animasi }: { animasi: boolean }) {
  return (
    <div className="sambutan-foto">
      <div className="sambutan-jendela">
        <motion.figure
          initial={animasi ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: lembut }}
        >
          <img src="/ahmad/hero-cutout-v2.webp" alt="Ahmad Zulfikar mengenakan peci dan selempang HMI" />
        </motion.figure>
      </div>
      <div className="sambutan-nama">
        <em>Yakin Usaha Sampai</em>
        <strong>Ahmad Zulfikar</strong>
        <span>Kandidat Ketua Umum PB HMI <span className="whitespace-nowrap">Periode 2026–2028</span></span>
      </div>
    </div>
  );
}

/**
 * Dialog selamat datang pada kunjungan pertama ke beranda. Muncul sekali per
 * peramban, setelah pemuat pembuka selesai. Tambahkan `?sambutan` di alamat
 * untuk menampilkannya lagi.
 */
export default function SambutanDialog() {
  const [buka, setBuka] = useState(false);
  const [peran, setPeran] = useState<AudiensId | null>(null);
  const [, navigate] = useLocation();
  const animasi = !useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const gantiRef = useRef<HTMLButtonElement>(null);
  const peranTerakhir = useRef<AudiensId | null>(null);
  // Di HP dan tablet daftar peran dan pesannya tampil bergantian dalam satu lembar,
  // jadi fokus dipindahkan ke bagian yang baru tampil.
  const hp = window.matchMedia("(max-width: 1279px)").matches;

  useEffect(() => {
    if (!hp) return;
    if (peran) {
      panelRef.current?.scrollTo({ top: 0 });
      gantiRef.current?.focus({ preventScroll: true });
    } else if (peranTerakhir.current) {
      document.querySelector<HTMLElement>(`.sambutan-peran [data-peran="${peranTerakhir.current}"]`)?.focus({ preventScroll: true });
    }
  }, [peran, hp]);

  useEffect(() => {
    let paksa = false;
    let sudah = false;
    try {
      paksa = new URLSearchParams(window.location.search).has("sambutan");
      sudah = localStorage.getItem(KUNCI) === "1";
    } catch {
      // Penyimpanan diblokir: tetap tampilkan sekali di sesi ini.
    }
    if (sudah && !paksa) return;
    let jeda = 0;
    const cek = window.setInterval(() => {
      if (document.querySelector(".app-loader")) return;
      window.clearInterval(cek);
      jeda = window.setTimeout(() => setBuka(true), 450);
    }, 200);
    return () => {
      window.clearInterval(cek);
      window.clearTimeout(jeda);
    };
  }, []);

  const tutup = () => {
    setBuka(false);
    try {
      localStorage.setItem(KUNCI, "1");
    } catch {
      // Abaikan.
    }
  };
  const pergi = (href: string) => {
    tutup();
    navigate(href);
  };
  const gantiPeran = () => {
    peranTerakhir.current = peran;
    setPeran(null);
  };
  const pesan = pesanAudiens.find((item) => item.id === peran);
  const muncul = (urutan: number) => (animasi
    ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.35 + urutan * 0.07, ease: lembut } }
    : {});

  return (
    <DialogPrimitive.Root open={buka} onOpenChange={(nilai) => { if (!nilai) tutup(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <motion.div className="sambutan-overlay" initial={animasi ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content
          className="sambutan"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            (event.currentTarget as HTMLElement).focus();
          }}
        >
          <motion.div
            className="relative"
            initial={animasi ? { opacity: 0, y: 40, scale: 0.97 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: lembut }}
          >
            <div className="sambutan-panel" ref={panelRef}>
              <div className="sambutan-cincin" aria-hidden="true"><i /><i /><i /></div>
              <div className="sambutan-isi" data-peran={peran ? "dipilih" : "belum"}>
                {/* Kepala lembar di HP: foto kecil, nama, dan tombol tutup dalam satu baris. */}
                <div className="sambutan-profil">
                  <span className="sambutan-avatar" aria-hidden="true"><img src="/ahmad/hero-cutout-v2.webp" alt="" /></span>
                  <div>
                    <strong>Ahmad Zulfikar</strong>
                    <span>Kandidat Ketua Umum PB HMI<br />Periode 2026–2028</span>
                  </div>
                  <DialogPrimitive.Close className="sambutan-tutup-hp" aria-label="Tutup sambutan">
                    <X size={14} />
                  </DialogPrimitive.Close>
                </div>

                <div className="sambutan-kiri">
                  <motion.p className="sambutan-eyebrow" {...muncul(0)}>Selamat datang</motion.p>
                  <DialogPrimitive.Title asChild>
                    <motion.h2 className="sambutan-judul" {...muncul(1)}>Saya adalah…</motion.h2>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    Pilih peranmu di HMI untuk melihat bagian gagasan HMI Evidence yang paling dekat denganmu, atau kenali Zulfikar lebih dulu.
                  </DialogPrimitive.Description>
                  <motion.p className="sambutan-sub" {...muncul(1)}>Pilih peranmu. Kami tunjukkan gagasan HMI Evidence yang paling dekat denganmu.</motion.p>
                  <motion.div className="sambutan-peran" role="group" aria-label="Pilih peranmu" {...muncul(2)}>
                    {pesanAudiens.map((item, index) => (
                      <button key={item.id} type="button" data-peran={item.id} aria-pressed={peran === item.id} onClick={() => setPeran(item.id)}>
                        <span>0{index + 1}</span>
                        <strong>{item.label}</strong>
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    ))}
                  </motion.div>
                  <motion.div className="sambutan-aksi" {...muncul(3)}>
                    <button type="button" className="sambutan-kenali" onClick={() => pergi("/tentang")}>
                      Kenali Zulfikar <ArrowRight size={16} />
                    </button>
                    <button type="button" className="sambutan-nanti-hp" onClick={tutup}>Nanti saja</button>
                  </motion.div>
                </div>

                <motion.div className="sambutan-tengah" aria-live="polite" {...muncul(2)}>
                  <button type="button" ref={gantiRef} className="sambutan-ganti" onClick={gantiPeran}>
                    <ArrowLeft size={14} /> Ganti peran
                  </button>
                  <AnimatePresence mode="wait" initial={false}>
                    {pesan ? (
                      <motion.div key={pesan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                        <p className="sambutan-eyebrow">{pesan.label}</p>
                        <h3 className="mt-4"><TeksIstilah>{pesan.judul}</TeksIstilah></h3>
                        <p><TeksIstilah>{pesan.pesan}</TeksIstilah></p>
                        <div className="sambutan-langkah">
                          {pesan.langkah.map((langkah) => (
                            <button key={langkah.href} type="button" onClick={() => pergi(langkah.href)}>
                              {langkah.label} <ArrowRight size={16} />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : !hp && (
                      <motion.div key="awal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                        <p className="sambutan-eyebrow">HMI Evidence</p>
                        <h3 className="mt-4">Satu gerakan, banyak peran.</h3>
                        <p>Setiap kader memegang bagian dari perbaikan HMI. Pilih peranmu, dan kami tunjukkan gagasan HMI Evidence yang paling dekat dengan keseharianmu.</p>
                        <span className="sambutan-petunjuk">
                          <ArrowLeft size={14} />
                          Pilih peranmu
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button type="button" className="sambutan-nanti" onClick={tutup}>Nanti saja, lihat situs</button>
                </motion.div>

                <div className="sambutan-ruang-foto" aria-hidden="true" />
              </div>
            </div>
            <FotoZulfikar animasi={animasi} />
            <DialogPrimitive.Close className="sambutan-tutup" aria-label="Tutup sambutan">
              <X size={16} />
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
