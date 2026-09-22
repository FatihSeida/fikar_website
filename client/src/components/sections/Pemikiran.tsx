import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { usePage } from "@/hooks/use-content";

/**
 * Ringkasan halaman Pemikiran. Konten berasal dari editor TipTap dan sudah
 * disanitasi di server (server/routes.ts sanitizeHtml), jadi dirender
 * sebagai HTML.
 */
export default function Pemikiran() {
  const { data: page, isLoading } = usePage("pemikiran-ide");

  // Section-nya selalu dirender supaya jangkar #pemikiran tetap ada. Navbar
  // dan CTA hero menautkannya, dan keduanya mati bila elemen ini hilang saat
  // data belum termuat atau gagal diambil.
  return (
    <section id="pemikiran" className="border-t border-border py-24 md:py-36">
      <div className="container mx-auto px-6">
        <SectionHeader title={page?.title ?? "Pemikiran"} subtitle="Esai & gagasan" />

        {isLoading && <p className="text-muted-foreground">Memuat halaman…</p>}

        {!isLoading && !page && (
          <p className="text-muted-foreground">Belum ada tulisan.</p>
        )}

        {page && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:grid md:grid-cols-[1.15fr_0.85fr] md:gap-20"
        >
          <div
            className="measure text-lg text-muted-foreground [&_blockquote]:border-l [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground [&_p]:mb-6"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          <div className="mt-10 md:mt-0">
            <a
              href="/pemikiran"
              className="group inline-flex items-center gap-3 text-sm text-primary transition-colors hover:text-foreground"
              data-testid="link-pemikiran-selengkapnya"
            >
              Baca selengkapnya
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
        )}
      </div>
    </section>
  );
}
