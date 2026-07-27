import { motion } from "framer-motion";

/**
 * Tentang / Filosofi. Naskah berbasis profil publik dan dapat disunting
 * pemilik situs. Kolom kiri menahan kutipan, kolom kanan menahan narasi —
 * lebar tidak sama, mengikuti komposisi cetak.
 */

const keterangan = [
  { label: "Organisasi", nilai: "PB HMI 2024–2026" },
  { label: "Organisasi", nilai: "OIC Youth Indonesia" },
  { label: "Beasiswa", nilai: "Awardee Beasiswa Unggulan" },
  { label: "Pendidikan", nilai: "UIN Palangka Raya" },
  { label: "Domisili", nilai: "Konya, Turki" },
];

export default function About() {
  return (
    <section id="tentang" className="border-t border-border py-24 md:py-36">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20"
        >
          <div>
            <span className="eyebrow mb-6 block">Tentang</span>
            {/* Kutipan ini sekaligus judul section — dijadikan h2 agar
                pembaca layar yang menelusuri per-heading tidak melewati
                seluruh bagian Tentang. */}
            <h2 className="font-serif text-2xl leading-snug text-foreground md:text-3xl">
              fatum brutum,
              <br />
              amor fati
            </h2>
            <div className="mt-7 h-px w-16 bg-accent" />
          </div>

          <div>
            <p className="measure mb-6 text-lg text-muted-foreground">
              Takdir berjalan tanpa diminta, dan tugas kita adalah mencintainya.
              Kalimat itu yang saya bawa ke mana-mana.
            </p>
            <p className="measure mb-6 text-lg text-muted-foreground">
              Saya Ghina. Aktif di pergerakan mahasiswa, sedang menempuh studi
              magister akuntansi, dan saat ini tinggal di Konya, Turki.
            </p>
            <p className="measure mb-12 text-lg text-muted-foreground">
              Sebagian besar yang saya kerjakan berpusat pada satu hal:
              mendengarkan, lalu menuliskannya kembali dengan lebih jernih.
              Situs ini tempat tulisan-tulisan itu disimpan.
            </p>

            <dl className="border-t border-border">
              {keterangan.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <dt className="eyebrow sm:w-32 sm:shrink-0">{item.label}</dt>
                  <dd className="text-base text-foreground">{item.nilai}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
