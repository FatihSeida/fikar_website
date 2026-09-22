import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";

const photos = [
  { src: "/ahmad/standing-centered.webp", alt: "Ahmad Zulfikar berdiri mengenakan atribut HMI", className: "md:col-span-4 md:aspect-[4/5]" },
  { src: "/ahmad/gallery-02.webp?v=oriented", alt: "Potret Ahmad Zulfikar mengenakan batik", className: "md:col-span-4 md:aspect-[4/5]" },
  { src: "/ahmad/profile-centered.webp", alt: "Ahmad Zulfikar duduk mengenakan atribut HMI", className: "md:col-span-4 md:aspect-[4/5]" },
  { src: "/ahmad/gallery-01.webp", alt: "Ahmad Zulfikar berbicara dalam sesi dokumentasi", className: "md:col-span-6 md:aspect-video" },
  { src: "/ahmad/gallery-03.webp", alt: "Ahmad Zulfikar dalam sesi wawancara", className: "md:col-span-6 md:aspect-video" },
  { src: "/ahmad/gallery-04.webp", alt: "Dokumentasi Ahmad Zulfikar", className: "md:col-span-6 md:aspect-video" },
  { src: "/ahmad/gallery-06.webp", alt: "Potret dokumenter Ahmad Zulfikar", className: "md:col-span-6 md:aspect-video" },
];

export default function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowLeft") setSelected(current => current === null ? null : (current - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight") setSelected(current => current === null ? null : (current + 1) % photos.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const move = (direction: number) => setSelected(current => current === null ? null : (current + direction + photos.length) % photos.length);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="pb-28 pt-36">
        <header className="container mx-auto px-6 md:px-10">
          <span className="eyebrow mb-6 block">Dokumentasi</span>
          <h1 className="max-w-3xl font-serif text-5xl md:text-7xl">Potret perjalanan dan ruang pengabdian.</h1>
          <p className="mt-7 max-w-xl text-muted-foreground">Arsip visual Ahmad Zulfikar dalam ruang HMI, profesi, dan percakapan gagasan.</p>
        </header>
        <div className="mobile-gallery-track container mx-auto mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-5 md:mt-16 md:grid md:grid-cols-12 md:gap-4 md:overflow-visible md:px-10 md:pb-0">
          {photos.map((photo, index) => (
            <motion.figure key={photo.src} initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: (index % 3) * 0.06, duration: reducedMotion ? 0.01 : 0.8 }} className={`group aspect-[4/5] min-w-[82vw] snap-center overflow-hidden bg-[hsl(var(--evidence))] md:min-w-0 ${photo.className}`}>
              <button type="button" className="relative h-full w-full" onClick={() => setSelected(index)} aria-label={`Buka foto ${index + 1}: ${photo.alt}`}>
                <img src={photo.src} alt={photo.alt} loading={index > 1 ? "lazy" : "eager"} className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.025]" />
                <span className="absolute bottom-3 right-3 border border-white/25 bg-black/35 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur md:hidden">Lihat penuh</span>
              </button>
            </motion.figure>
          ))}
        </div>
        <p className="mt-3 px-6 text-[9px] uppercase tracking-[0.16em] text-muted-foreground md:hidden">Geser untuk melihat dokumentasi lainnya</p>
      </main>
      <SiteFooter />

      <AnimatePresence>
        {selected !== null && (
          <motion.div className="fixed inset-0 z-[220] grid place-items-center bg-[#03100c] p-4 pb-[calc(80px+env(safe-area-inset-bottom))] pt-16 text-white md:p-10" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={`Foto ${selected + 1} dari ${photos.length}`}>
            <button type="button" className="absolute right-4 top-4 grid h-11 w-11 place-items-center border border-white/20 bg-white/5" onClick={() => setSelected(null)} aria-label="Tutup foto"><X className="h-5 w-5" /></button>
            <motion.img key={photos[selected].src} src={photos[selected].src} alt={photos[selected].alt} className="max-h-full max-w-full object-contain" initial={reducedMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? 0.01 : .35 }} />
            <button type="button" className="absolute bottom-[calc(18px+env(safe-area-inset-bottom))] left-4 grid h-11 w-11 place-items-center border border-white/20 bg-white/5 md:bottom-auto md:top-1/2" onClick={() => move(-1)} aria-label="Foto sebelumnya"><ChevronLeft className="h-5 w-5" /></button>
            <span className="absolute bottom-[calc(31px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 font-serif text-sm text-[#e2cb8e]">{String(selected + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
            <button type="button" className="absolute bottom-[calc(18px+env(safe-area-inset-bottom))] right-4 grid h-11 w-11 place-items-center border border-white/20 bg-white/5 md:bottom-auto md:top-1/2" onClick={() => move(1)} aria-label="Foto berikutnya"><ChevronRight className="h-5 w-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
