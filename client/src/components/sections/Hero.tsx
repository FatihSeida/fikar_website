import { motion } from "framer-motion";
import potretUtama from "@/assets/potret-utama.webp";
import { site } from "@/lib/site";

/**
 * Pembuka: satu pernyataan singkat, satu foto, satu ajakan.
 * Kolom sengaja tidak sama lebar (1.05fr / 0.95fr) mengikuti komposisi
 * cetak asimetris.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen flex-col pt-24 md:grid md:grid-cols-[1.05fr_0.95fr] md:pt-0"
    >
      <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <span className="eyebrow mb-6 block">
            Catatan &middot; Pemikiran &middot; Aktivitas
          </span>

          <h1 className="mb-8 font-serif text-4xl leading-[1.15] text-foreground md:text-5xl lg:text-6xl">
            {/* Spasi eksplisit: JSX membuang whitespace di sekitar <br/>,
                sehingga nama terbaca menyatu oleh pembaca layar. */}
            {site.namaDepan}{" "}
            <br />
            {site.namaBelakang}
          </h1>

          <p className="measure mb-10 text-lg text-muted-foreground">
            Ruang tenang untuk menulis dan membaca — tempat pemikiran, catatan,
            dan perjalanan disimpan dengan sederhana.
          </p>

          <a
            href="#pemikiran"
            className="inline-flex w-fit items-center border border-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors duration-500 hover:bg-foreground hover:text-background"
            data-testid="link-cta-hero"
          >
            Baca Tulisan
          </a>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
            className="mt-16 h-px bg-accent"
          />
        </motion.div>
      </div>

      <div className="order-1 h-[58vh] overflow-hidden bg-muted md:order-2 md:h-screen">
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          src={potretUtama}
          alt={`Potret ${site.nama}`}
          width={1600}
          height={2400}
          className="h-full w-full object-cover object-top"
        />
      </div>
    </section>
  );
}
