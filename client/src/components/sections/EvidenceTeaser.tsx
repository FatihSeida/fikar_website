import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";

/** Tiga pintu masuk; dulu bagian "Mulai di sini" tersendiri, kini penutup teaser. */
const pintu = [
  {
    judul: "Apa itu HMI Evidence",
    uraian: "Bukti sebagai dasar perkaderan: masalah dikenali, perjalanan kader dicatat, hasil dievaluasi.",
    href: "/hmi-evidence",
  },
  {
    judul: "Siapa Zulfikar",
    uraian: "Kader HMI Cabang Gowa Raya, Kandidat Ketua Umum PB HMI Periode 2026–2028.",
    href: "/tentang",
  },
  {
    judul: "Seberapa Evidence Komisariatmu?",
    uraian: "Ikuti kuis audit atau kirim masalah komisariatmu. Keduanya menjadi bukti untuk perbaikan HMI.",
    href: "/ikut",
  },
];

export default function EvidenceTeaser() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const first = useTransform(scrollYProgress, [0, 0.18, 0.34], [1, 1, 0]);
  const second = useTransform(scrollYProgress, [0.28, 0.46, 0.64], [0, 1, 0]);
  const third = useTransform(scrollYProgress, [0.58, 0.76, 1], [0, 1, 1]);
  const firstImage = useTransform(scrollYProgress, [0, 0.34, 0.46], [1, 1, 0]);
  const secondImage = useTransform(scrollYProgress, [0.3, 0.48, 0.66], [0, 1, 0]);
  const thirdImage = useTransform(scrollYProgress, [0.56, 0.74, 1], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.01]);
  // Kartu hanya bisa diklik saat bingkai terakhir benar-benar terlihat.
  const thirdPointer = useTransform(third, (nilai) => (nilai > 0.6 ? "auto" : "none"));

  return (
    <section ref={ref} className="relative h-[260vh] bg-[hsl(var(--evidence))] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img style={{ scale, opacity: firstImage }} src="/scrollytelling/hmi-evidence-04-lingkaran-organisasi-v1.webp" alt="Ilustrasi ruang organisasi dan perjalanan kader" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <motion.img style={{ scale, opacity: secondImage }} src="/scrollytelling/hmi-evidence-03-perubahan-zaman-v1.webp" alt="Ilustrasi Student Needs dan Student Interest" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <motion.img style={{ scale, opacity: thirdImage }} src="/scrollytelling/hmi-evidence-05-berbasis-bukti-v1.webp" alt="Ilustrasi ekosistem perkaderan berbasis bukti" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />
        <div className="container relative mx-auto h-full px-6 md:px-10">
          <span className="evidence-kicker absolute left-6 top-28 md:left-10">HMI Evidence</span>

          <motion.div style={{ opacity: first }} className="absolute inset-x-6 top-1/2 max-w-3xl -translate-y-1/2 md:inset-x-auto md:left-10">
            <p className="text-shadow-cinematic font-serif text-4xl leading-tight md:text-6xl">Setiap periode, organisasi terus bergerak.</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">Kepengurusan berganti, forum berjalan, dan program kembali disusun.</p>
          </motion.div>

          <motion.div style={{ opacity: second }} className="absolute inset-x-6 top-1/2 max-w-3xl -translate-y-1/2 md:inset-x-auto md:left-10">
            <p className="text-shadow-cinematic font-serif text-4xl leading-tight md:text-6xl">Tetapi, apakah perjalanan kader ikut terbaca?</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">Tanpa pengetahuan yang utuh, Student Needs dan Student Interest mudah tergantikan oleh asumsi.</p>
          </motion.div>

          <motion.div style={{ opacity: third, pointerEvents: thirdPointer }} className="absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-10">
            <p className="text-shadow-cinematic max-w-3xl font-serif text-4xl leading-tight md:text-6xl">Transformasi Gerakan Organisasi Berbasis Bukti.</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">Komitmen HMI Evidence menghadirkan ekosistem perkaderan berkelanjutan.</p>
            <span className="evidence-kicker mt-10 block text-white/60">Mulai di sini</span>
            <ol className="mt-4 grid max-w-5xl gap-2 md:grid-cols-3 md:gap-3">
              {pintu.map((item, index) => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex h-full items-center gap-4 border border-white/15 bg-black/35 p-4 backdrop-blur-sm transition-colors hover:border-[hsl(var(--gold))] md:flex-col md:items-start md:gap-0 md:p-6">
                    <span className="font-serif text-2xl text-[hsl(var(--gold))] md:text-3xl">0{index + 1}</span>
                    <span className="flex-1">
                      <span className="block font-serif text-lg md:mt-3 md:text-2xl">{item.judul}</span>
                      <span className="mt-2 hidden text-sm leading-relaxed text-white/65 md:block">{item.uraian}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[hsl(var(--gold))] transition-transform group-hover:translate-x-1 md:mt-5" />
                  </Link>
                </li>
              ))}
            </ol>
          </motion.div>

          <div className="absolute bottom-8 left-6 right-6 h-px bg-white/20 md:left-10 md:right-10">
            <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "left" }} className="h-full bg-[hsl(var(--gold))]" />
          </div>
        </div>
      </div>
    </section>
  );
}
