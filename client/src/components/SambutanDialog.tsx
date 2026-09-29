import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUp, X } from "lucide-react";
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
            <div className="sambutan-panel">
              <div className="sambutan-cincin" aria-hidden="true"><i /><i /><i /></div>
              <div className="sambutan-isi">
                <div>
                  <motion.p className="sambutan-eyebrow" {...muncul(0)}>Selamat datang</motion.p>
                  <DialogPrimitive.Title asChild>
                    <motion.h2 className="sambutan-judul" {...muncul(1)}>Saya adalah…</motion.h2>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    Pilih peranmu di HMI untuk melihat bagian gagasan HMI Evidence yang paling dekat denganmu, atau kenali Zulfikar lebih dulu.
                  </DialogPrimitive.Description>
                  <motion.div className="sambutan-peran" role="group" aria-label="Pilih peranmu" {...muncul(2)}>
                    {pesanAudiens.map((item, index) => (
                      <button key={item.id} type="button" aria-pressed={peran === item.id} onClick={() => setPeran(item.id)}>
                        <span>0{index + 1}</span>
                        <strong>{item.label}</strong>
                      </button>
                    ))}
                  </motion.div>
                  <motion.button type="button" className="sambutan-kenali" onClick={() => pergi("/tentang")} {...muncul(3)}>
                    Kenali Zulfikar <ArrowRight size={16} />
                  </motion.button>
                </div>

                <motion.div className="sambutan-tengah" aria-live="polite" {...muncul(2)}>
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
                    ) : (
                      <motion.div key="awal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                        <p className="sambutan-eyebrow">HMI Evidence</p>
                        <h3 className="mt-4">Satu gerakan, banyak peran.</h3>
                        <p>Setiap kader memegang bagian dari perbaikan HMI. Pilih peranmu, dan kami tunjukkan gagasan HMI Evidence yang paling dekat dengan keseharianmu.</p>
                        <span className="sambutan-petunjuk">
                          <ArrowLeft size={14} className="sambutan-panah-kiri" />
                          <ArrowUp size={14} className="sambutan-panah-atas" />
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
