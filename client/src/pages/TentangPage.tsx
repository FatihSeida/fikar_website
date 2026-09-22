import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import { kelompok } from "@/lib/riwayat";
import { misi, site, visi } from "@/lib/site";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main>
        <section className="container mx-auto grid min-h-screen items-center gap-14 px-6 pb-20 pt-32 md:grid-cols-12 md:px-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="md:col-span-6">
            <span className="eyebrow mb-7 block">Tentang</span>
            <h1 className="font-serif text-5xl leading-[0.98] md:text-7xl">{site.nama}</h1>
            <p className="mt-5 text-sm uppercase tracking-[0.18em] text-primary">{site.profesi}</p>
            <p className="mt-9 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Tumbuh melalui kaderisasi HMI, pendidikan hukum, dan ruang advokasi. Perjalanan itu menumbuhkan satu keyakinan: organisasi harus mengenali kadernya, membaca kenyataan, dan mengarahkan setiap ikhtiar pada pengabdian.
            </p>
            <dl className="mt-12 grid max-w-xl gap-7 border-t border-border pt-8 sm:grid-cols-2">
              <div><dt className="eyebrow mb-2">Lahir</dt><dd>{site.lahir}</dd></div>
              <div><dt className="eyebrow mb-2">Domisili</dt><dd>{site.domisili}</dd></div>
              <div className="sm:col-span-2"><dt className="eyebrow mb-2">Fokus</dt><dd className="leading-relaxed text-muted-foreground">{site.fokus}</dd></div>
            </dl>
          </motion.div>
          <motion.figure initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.1 }} className="relative overflow-hidden bg-[hsl(var(--evidence))] md:col-span-6 md:ml-8">
            <div className="aspect-[4/5]"><img src="/ahmad/profile-centered.webp" alt="Potret Ahmad Zulfikar" className="h-full w-full object-cover object-center" /></div>
            <figcaption className="absolute bottom-0 left-0 bg-background/90 px-5 py-3 text-xs uppercase tracking-[0.16em] backdrop-blur">Gagasan · Kaderisasi · Pengabdian</figcaption>
          </motion.figure>
        </section>

        <section className="bg-[hsl(var(--evidence))] px-6 py-24 text-white md:px-10 md:py-32">
          <div className="container mx-auto grid gap-12 md:grid-cols-12">
            <div className="md:col-span-3"><span className="evidence-kicker text-white/60">Visi</span></div>
            <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="font-serif text-3xl leading-snug md:col-span-9 md:text-5xl">“{visi}”</motion.blockquote>
          </div>
        </section>

        <section className="container mx-auto px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-3"><span className="eyebrow">Enam Misi</span></div>
            <ol className="grid gap-x-10 gap-y-12 md:col-span-9 md:grid-cols-2">
              {misi.map((item, index) => (
                <motion.li key={item} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (index % 2) * 0.08 }} className="border-t border-border pt-6">
                  <span className="font-serif text-3xl text-primary">0{index + 1}</span>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{item}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-border px-6 py-24 md:px-10 md:py-32">
          <div className="container mx-auto">
            <span className="eyebrow mb-6 block">Jejak Perjalanan</span>
            <h2 className="max-w-3xl font-serif text-4xl md:text-6xl">Berangkat dari proses, bertumbuh melalui tanggung jawab.</h2>
            <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20">
              {kelompok.map((bagian, index) => (
                <motion.section key={bagian.judul} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ delay: (index % 2) * 0.08 }} className="content-start border-t border-foreground pt-5">
                  <h3 className="font-serif text-2xl md:text-3xl">{bagian.judul}</h3>
                  <ol className="mt-8 grid gap-7 sm:grid-cols-2">
                    {bagian.baris.map((baris) => (
                      <li key={`${baris.periode}-${baris.lembaga}`}>
                        <span className="eyebrow block text-primary">{baris.periode}</span>
                        <strong className="mt-2 block font-medium">{baris.lembaga}</strong>
                        {baris.peran && <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{baris.peran}</span>}
                      </li>
                    ))}
                  </ol>
                </motion.section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
