import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";

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

  return (
    <section ref={ref} className="relative h-[260vh] bg-[hsl(var(--evidence))] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img style={{ scale, opacity: firstImage }} src="/scrollytelling/hmi-evidence-04-lingkaran-organisasi-v1.webp" alt="Ilustrasi ruang organisasi dan perjalanan kader" className="absolute inset-0 h-full w-full object-cover" />
        <motion.img style={{ scale, opacity: secondImage }} src="/scrollytelling/hmi-evidence-03-perubahan-zaman-v1.webp" alt="Ilustrasi Student Needs dan Student Interest" className="absolute inset-0 h-full w-full object-cover" />
        <motion.img style={{ scale, opacity: thirdImage }} src="/scrollytelling/hmi-evidence-05-berbasis-bukti-v1.webp" alt="Ilustrasi ekosistem perkaderan berbasis bukti" className="absolute inset-0 h-full w-full object-cover" />
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

          <motion.div style={{ opacity: third }} className="absolute inset-x-6 top-1/2 max-w-3xl -translate-y-1/2 md:inset-x-auto md:left-10">
            <p className="text-shadow-cinematic font-serif text-4xl leading-tight md:text-6xl">Transformasi Gerakan Organisasi Berbasis Bukti.</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">Komitmen HMI Evidence menghadirkan ekosistem perkaderan terbaharukan.</p>
            <Link href="/hmi-evidence" className="mt-8 inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--evidence))]">
              Selanjutnya <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="absolute bottom-8 left-6 right-6 h-px bg-white/20 md:left-10 md:right-10">
            <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "left" }} className="h-full bg-[hsl(var(--gold))]" />
          </div>
        </div>
      </div>
    </section>
  );
}
