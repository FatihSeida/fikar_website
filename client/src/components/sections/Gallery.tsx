import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { useGallery } from "@/hooks/use-content";

/**
 * Galeri editorial. Tiap slot punya tinggi dan offset berbeda supaya
 * susunannya tidak terbaca sebagai grid. Pola diulang bila jumlah foto
 * melebihi empat.
 */
const slot = [
  { tinggi: "h-[420px] md:h-[560px]", offset: "md:mt-0", kolom: "md:col-span-7" },
  { tinggi: "h-[340px] md:h-[420px]", offset: "md:mt-28", kolom: "md:col-span-5" },
  { tinggi: "h-[340px] md:h-[420px]", offset: "md:mt-0", kolom: "md:col-span-5" },
  { tinggi: "h-[420px] md:h-[560px]", offset: "md:mt-20", kolom: "md:col-span-7" },
];

export default function Gallery() {
  const { data: galleryItems, isLoading } = useGallery();

  return (
    <section id="galeri" className="border-t border-border bg-muted/40 py-24 md:py-36">
      <div className="container mx-auto px-6">
        <SectionHeader title="Galeri" subtitle="Potret" />

        {isLoading && (
          <p className="text-muted-foreground">Memuat galeri…</p>
        )}

        {!isLoading && galleryItems?.length === 0 && (
          <p className="text-muted-foreground">Belum ada foto.</p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-8 md:gap-y-4">
          {galleryItems?.map((item, idx) => {
            const s = slot[idx % slot.length];
            return (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`${s.kolom} ${s.offset}`}
                data-testid={`gallery-item-${item.id}`}
              >
                <div className={`${s.tinggi} overflow-hidden bg-background shadow-paper`}>
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform [transition-duration:1200ms] ease-out hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  {item.caption}
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
