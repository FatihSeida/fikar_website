import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import { kelompok } from "@/lib/riwayat";
import { site } from "@/lib/site";

/**
 * Riwayat lengkap. Dipisah dari beranda karena isinya dua puluh baris
 * lebih — memuatnya di beranda akan mengorbankan ruang kosong yang justru
 * menjadi ciri tampilan ini.
 */
export default function TentangPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="px-6 pb-28 pt-36"
      >
        <div className="container mx-auto max-w-3xl">
          <a
            href="/"
            className="mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-back-home"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </a>

          <header className="mb-16">
            <span className="eyebrow mb-6 block">Riwayat</span>
            <h1 className="mb-7 font-serif text-4xl leading-[1.15] md:text-5xl">
              {site.nama}, {site.gelar}
            </h1>

            <dl className="measure space-y-2 text-base text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="eyebrow sm:w-28 sm:shrink-0 sm:pt-1">Lahir</dt>
                <dd>{site.lahir}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="eyebrow sm:w-28 sm:shrink-0 sm:pt-1">Asal</dt>
                <dd>{site.asal}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="eyebrow sm:w-28 sm:shrink-0 sm:pt-1">Domisili</dt>
                <dd>{site.domisili}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="eyebrow sm:w-28 sm:shrink-0 sm:pt-1">Surel</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-primary transition-colors hover:text-foreground"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-9 h-px w-16 bg-accent" />
          </header>

          {kelompok.map((bagian) => (
            <section key={bagian.judul} className="mb-16">
              <h2 className="mb-8 font-serif text-2xl text-foreground">
                {bagian.judul}
              </h2>

              <dl className="border-t border-border">
                {bagian.baris.map((baris, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 border-b border-border py-5 md:flex-row md:gap-10"
                  >
                    <dt className="eyebrow md:w-40 md:shrink-0 md:pt-1">
                      {baris.periode}
                    </dt>
                    <dd>
                      <span className="block text-base text-foreground">
                        {baris.lembaga}
                      </span>
                      {baris.peran && (
                        <span className="block text-sm text-muted-foreground">
                          {baris.peran}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
