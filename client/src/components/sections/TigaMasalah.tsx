import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TeksIstilah from "@/components/TeksIstilah";
import VisiMisiDialog from "@/components/VisiMisiDialog";
import { tigaMasalah } from "@/lib/pesan";

export default function TigaMasalah() {
  const [visiMisiOpen, setVisiMisiOpen] = useState(false);
  return (
    <>
    <section className="bg-[hsl(var(--evidence))] py-24 text-white md:py-32">
      <div className="container mx-auto px-6 md:px-10">
        <span className="evidence-kicker">Tiga masalah yang paling terasa</span>
        <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Yang dirasakan kader, dan jawaban HMI Evidence.</h2>
        <ol className="mt-14 grid gap-px bg-white/15 md:grid-cols-3">
          {tigaMasalah.map((item, index) => (
            <motion.li key={item.masalah} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * 0.08 }} className="bg-[hsl(var(--evidence))] py-8 md:px-8 md:first:pl-0">
              <span className="font-serif text-3xl text-[hsl(var(--gold))]">0{index + 1}</span>
              <h3 className="mt-4 font-serif text-2xl leading-snug"><TeksIstilah>{item.masalah}</TeksIstilah></h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75"><TeksIstilah>{item.jawaban}</TeksIstilah></p>
            </motion.li>
          ))}
        </ol>
        <button type="button" onClick={() => setVisiMisiOpen(true)} className="mt-12 inline-flex items-center gap-2 border-b border-[hsl(var(--gold))] pb-1 text-sm text-[hsl(var(--gold))]">
          Lihat visi, misi, dan program strategis <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
    <VisiMisiDialog open={visiMisiOpen} onOpenChange={setVisiMisiOpen} />
    </>
  );
}
