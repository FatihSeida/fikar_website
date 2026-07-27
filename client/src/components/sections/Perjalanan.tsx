import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useGallery } from "@/hooks/use-content";
import { perjalanan } from "@/lib/perjalanan";

const JEDA_MS = 7000;

/**
 * Perjalanan dari SD sampai kuliah, sebagai slider yang berjalan sendiri.
 *
 * Naskahnya tetap di kode (lib/perjalanan.ts) sementara fotonya diambil dari
 * tabel gallery, supaya pemilik situs masih bisa mengganti foto lewat panel
 * admin tanpa menyentuh kode. Bila jumlah foto lebih sedikit dari jumlah
 * slide, foto dipakai berulang.
 *
 * Slider yang berjalan sendiri wajib bisa dihentikan (WCAG 2.2.2), jadi ada
 * tombol jeda, gerakan berhenti saat kursor atau fokus keyboard masuk, dan
 * autoplay tidak pernah menyala bila pengguna meminta pengurangan gerak.
 */
export default function Perjalanan() {
  const { data: galleryItems } = useGallery();
  const [api, setApi] = useState<CarouselApi>();
  const [aktif, setAktif] = useState(0);
  // Dua sebab berhenti yang dipisah: jeda yang dipilih pengguna harus
  // menempel, sedangkan jeda karena kursor atau fokus hanya sementara.
  // Bila keduanya satu state, menggeser kursor keluar akan membatalkan
  // pilihan pengguna.
  const [dijedaManual, setDijedaManual] = useState(false);
  const [disinggahi, setDisinggahi] = useState(false);
  const [kurangiGerak, setKurangiGerak] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const perbarui = () => setKurangiGerak(mq.matches);
    perbarui();
    mq.addEventListener("change", perbarui);
    return () => mq.removeEventListener("change", perbarui);
  }, []);

  useEffect(() => {
    if (!api) return;
    const pilih = () => setAktif(api.selectedScrollSnap());
    pilih();
    api.on("select", pilih);
    return () => {
      api.off("select", pilih);
    };
  }, [api]);

  const berhenti = dijedaManual || disinggahi || kurangiGerak;

  useEffect(() => {
    if (!api || berhenti) return;
    const id = window.setInterval(() => api.scrollNext(), JEDA_MS);
    return () => window.clearInterval(id);
  }, [api, berhenti]);

  return (
    <section id="perjalanan" className="border-t border-border bg-muted/40 py-24 md:py-36">
      <div className="container mx-auto px-6">
        <SectionHeader title="Perjalanan" subtitle="Tentang" />

        <div
          onMouseEnter={() => setDisinggahi(true)}
          onMouseLeave={() => setDisinggahi(false)}
          onFocusCapture={() => setDisinggahi(true)}
          onBlurCapture={() => setDisinggahi(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start" }}
            className="w-full"
          >
            <CarouselContent>
              {perjalanan.map((slide, i) => {
                const foto = galleryItems?.length
                  ? galleryItems[i % galleryItems.length]
                  : null;

                return (
                  <CarouselItem key={slide.jenjang}>
                    <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
                      <div className="order-2 flex flex-col justify-center md:order-1">
                        <span className="eyebrow mb-5 block">
                          {slide.periode}
                        </span>
                        <h3 className="mb-2 font-serif text-2xl text-foreground md:text-3xl">
                          {slide.jenjang}
                        </h3>
                        <p className="mb-7 text-base text-muted-foreground">
                          {slide.sekolah}
                        </p>
                        <p className="measure text-lg text-muted-foreground">
                          {slide.cerita}
                        </p>
                        <div className="mt-10 h-px w-16 bg-accent" />
                      </div>

                      <div className="order-1 h-[320px] overflow-hidden bg-background shadow-paper md:order-2 md:h-[460px]">
                        {foto && (
                          <motion.img
                            key={foto.image}
                            initial={{ opacity: 0, scale: 1.03 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                            src={foto.image}
                            alt={foto.caption}
                            loading="lazy"
                            className="h-full w-full object-cover object-top"
                          />
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-3">
              {perjalanan.map((slide, i) => (
                <button
                  key={slide.jenjang}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Ke ${slide.jenjang}`}
                  aria-current={i === aktif}
                  className={`h-px w-10 transition-colors duration-500 ${
                    i === aktif ? "bg-foreground" : "bg-border"
                  }`}
                  data-testid={`dot-perjalanan-${i}`}
                />
              ))}
            </div>

            {!kurangiGerak && (
              <button
                type="button"
                onClick={() => setDijedaManual((v) => !v)}
                aria-pressed={dijedaManual}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
                data-testid="button-jeda-perjalanan"
              >
                {!dijedaManual ? (
                  <>
                    <Pause className="h-3.5 w-3.5" /> Jeda
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Putar
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
