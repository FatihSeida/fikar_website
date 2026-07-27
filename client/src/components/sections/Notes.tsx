import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useNotes } from "@/hooks/use-content";

export default function Notes() {
  const { data: noteItems, isLoading } = useNotes();

  return (
    <section id="catatan" className="border-t border-border py-24 md:py-36">
      <div className="container mx-auto px-6">
        <SectionHeader title="Catatan & Aktivitas" subtitle="Catatan" />

        {isLoading && <p className="text-muted-foreground">Memuat catatan…</p>}

        {!isLoading && noteItems?.length === 0 && (
          <p className="text-muted-foreground">Belum ada catatan.</p>
        )}

        <div className="border-t border-border">
          {noteItems?.map((item, index) => {
            const external = Boolean(item.sourceUrl);

            return (
              <motion.a
                key={item.id}
                href={item.sourceUrl ?? `/catatan/${item.slug}`}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="group flex flex-col gap-4 border-b border-border py-9 md:flex-row md:items-baseline md:gap-12"
                data-testid={`note-item-${item.id}`}
              >
                <span className="font-serif text-sm text-primary md:w-10 md:shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="eyebrow">{item.tag}</span>
                    <span className="h-px w-4 bg-border" />
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {item.date}
                    </span>
                    {item.sourceName && (
                      <>
                        <span className="h-px w-4 bg-border" />
                        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {item.sourceName}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="mb-2 font-serif text-2xl text-foreground transition-colors duration-500 group-hover:text-primary md:text-3xl">
                    {item.title}
                  </h3>

                  <p className="measure text-base text-muted-foreground">
                    {item.excerpt}
                  </p>

                  {external && (
                    <span className="sr-only">
                      (membuka situs {item.sourceName ?? "luar"} di tab baru)
                    </span>
                  )}
                </div>

                {/* alt kosong dan disembunyikan dari pembaca layar: judul di
                    sebelahnya sudah menjelaskan isi tautan, jadi gambar ini
                    murni pendamping visual. */}
                {item.coverImage && (
                  <div
                    aria-hidden="true"
                    className="w-full overflow-hidden bg-muted md:w-44 md:shrink-0 md:self-center"
                  >
                    <img
                      src={item.coverImage}
                      alt=""
                      loading="lazy"
                      className="h-44 w-full object-cover object-top transition-transform [transition-duration:1200ms] ease-out group-hover:scale-[1.04] md:h-28"
                    />
                  </div>
                )}

                <ArrowUpRight className="h-5 w-5 shrink-0 text-accent transition-transform duration-500 group-hover:-translate-y-1 md:self-center" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
