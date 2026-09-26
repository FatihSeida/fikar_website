import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import { kelompok, pengalamanAdvokasi, ringkasanProfil, ruangPengabdian, sumberProfil } from "@/lib/riwayat";
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

            <div className="mt-16 grid gap-10 border-y border-border py-10 md:grid-cols-12 md:py-14">
              <div className="md:col-span-4">
                <span className="eyebrow text-primary">Tiga Ruang Pengabdian</span>
                <h3 className="mt-5 max-w-sm font-serif text-3xl leading-tight md:text-4xl">Hukum, kaderisasi, dan perjuangan pekerja bertemu dalam satu perjalanan.</h3>
              </div>
              <div className="grid content-start gap-5 text-base leading-relaxed text-muted-foreground md:col-span-8 md:pl-8 md:text-lg">
                {ringkasanProfil.map((paragraf) => <p key={paragraf}>{paragraf}</p>)}
              </div>
            </div>

            <div className="grid border-b border-border md:grid-cols-3">
              {ruangPengabdian.map((ruang, index) => (
                <motion.article
                  key={ruang.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.08 }}
                  className="border-border py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                >
                  <span className="font-serif text-3xl text-primary">0{index + 1}</span>
                  <h4 className="mt-4 font-serif text-2xl">{ruang.label}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ruang.uraian}</p>
                </motion.article>
              ))}
            </div>

            <section className="mt-24 grid gap-10 md:grid-cols-12 md:gap-14">
              <div className="md:col-span-4">
                <span className="eyebrow text-primary">Pengalaman Advokasi</span>
                <h3 className="mt-5 font-serif text-3xl leading-tight md:text-5xl">Membela hak pekerja dari ruang perundingan hingga aksi lapangan.</h3>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">Sembilan pengalaman berikut merekam pendampingan buruh yang dilakukan Ahmad Zulfikar di Makassar dan sekitarnya.</p>
                <a href={sumberProfil.url} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 border-b border-primary pb-1 text-xs uppercase tracking-[0.14em] text-primary">
                  Sumber: {sumberProfil.nama}, {sumberProfil.tanggal}<ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <ol className="grid gap-x-10 md:col-span-8 md:grid-cols-2">
                {pengalamanAdvokasi.map((pengalaman, index) => (
                  <motion.li
                    key={pengalaman.judul}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: (index % 2) * 0.07 }}
                    className="grid grid-cols-[42px_1fr] gap-4 border-t border-border py-7"
                  >
                    <span className="font-serif text-2xl text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="font-medium leading-snug">{pengalaman.judul}</h4>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pengalaman.uraian}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </section>

            <div className="mt-24 grid gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20">
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
