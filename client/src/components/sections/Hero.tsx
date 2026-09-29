import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { site } from "@/lib/site";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative min-h-[108vh] overflow-hidden bg-[hsl(var(--evidence))] text-white">
      <motion.img src="/ahmad/hero.webp" alt={`Potret ${site.nama}`} style={{ y: imageY }} className="hero-portrait absolute inset-0 h-[66%] w-full object-cover object-[46%_center] md:h-[108%] md:object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/10 md:from-black/90 md:via-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--evidence))] via-transparent to-black/30" />

      <motion.div style={{ y: copyY, opacity: fade }} className="container relative z-10 mx-auto flex min-h-screen items-end px-6 pb-20 pt-32 md:items-center md:px-10 md:pb-0">
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="evidence-kicker mb-6">
            {site.kandidat}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.08 }} className="text-shadow-cinematic font-serif text-5xl leading-[0.95] md:text-7xl lg:text-[6.5rem]">
            Ahmad<br />Zulfikar
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mt-8 max-w-xl border-l border-[hsl(var(--gold))] pl-6">
            <p className="text-xl leading-relaxed text-white/88 md:text-2xl">
              Transformasi gerakan organisasi berbasis bukti.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Untuk HMI yang mampu belajar dari kenyataan, menjaga pengetahuan, dan menciptakan masa depan.
            </p>
          </motion.div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/hmi-evidence" className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--evidence))] transition-transform hover:-translate-y-0.5">
              Jelajahi HMI Evidence <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/tentang" className="inline-flex items-center border border-white/40 px-6 py-3 text-xs uppercase tracking-[0.16em] text-white hover:border-white">
              Siapa Zulfikar
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-7 right-7 z-10 hidden items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/55 md:flex">
        Gulir untuk mulai <ArrowDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}
