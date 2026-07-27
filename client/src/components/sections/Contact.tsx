import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Kontak. Diarahkan ke Instagram karena alamat surel belum diketahui.
 * Bila nanti ada surel, tambahkan di client/src/lib/site.ts.
 */
export default function Contact() {
  return (
    <section id="kontak" className="border-t border-border bg-muted/40 py-24 md:py-36">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:grid md:grid-cols-[0.85fr_1.15fr] md:gap-20"
        >
          <div>
            <span className="eyebrow mb-6 block">Kontak</span>
            <div className="h-px w-16 bg-accent" />
          </div>

          <div className="mt-8 md:mt-0">
            <h2 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
              Mari berbincang
            </h2>
            <p className="measure mb-10 text-lg text-muted-foreground">
              Untuk diskusi, undangan menulis, atau sekadar bertukar kabar.
            </p>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center border border-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors duration-500 hover:bg-foreground hover:text-background"
                data-testid="link-cta-kontak"
              >
                {site.email}
              </a>

              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-foreground"
                data-testid="link-kontak-instagram"
              >
                {site.instagram.pengguna}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
                <span className="sr-only">(membuka Instagram di tab baru)</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
