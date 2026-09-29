import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { Link } from "wouter";

const facts = [
  ["Lahir", site.lahir],
  ["Pendidikan", "Sarjana Ilmu Hukum UIN Alauddin Makassar · Magister Ilmu Hukum Universitas Trisakti"],
  ["Profesi", site.profesi],
  ["Amanah", "Wakil Sekretaris Bidang Pariwisata dan Ekonomi Kreatif PB HMI"],
];

export default function About() {
  return (
    <section id="tentang" className="border-t border-border py-24 md:py-36">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-32">
            <span className="eyebrow mb-6 block">Tentang Zulfikar</span>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              Ditempa dalam kaderisasi. Bertumbuh melalui pengabdian.
            </h2>
            <div className="mt-8 h-px w-20 bg-accent" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <p className="measure text-xl leading-relaxed text-foreground md:text-2xl">
              Bagi Ahmad Zulfikar, organisasi bukan hanya ruang mengambil peran, tetapi tempat membina diri, merawat gagasan, dan menghadirkan manfaat bagi sesama.
            </p>
            <p className="measure mt-7 text-base text-muted-foreground">
              Perjalanannya dari Komisariat, Cabang, Badko, hingga Pengurus Besar mempertemukan kaderisasi dengan pendidikan hukum, advokasi pekerja, kebijakan strategis, dan tanggung jawab publik.
            </p>

            <dl className="mt-12 border-t border-border">
              {facts.map(([label, value]) => (
                <div key={label} className="grid gap-2 border-b border-border py-5 sm:grid-cols-[8rem_1fr]">
                  <dt className="eyebrow pt-1">{label}</dt>
                  <dd className="text-sm leading-relaxed text-foreground md:text-base">{value}</dd>
                </div>
              ))}
            </dl>

            <Link href="/tentang" className="group mt-10 inline-flex items-center gap-3 text-sm font-medium text-primary">
              Profil dan rekam jejak
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
