import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const images = [
  { src: "/ahmad/standing-centered.webp", alt: "Ahmad Zulfikar berdiri mengenakan atribut HMI" },
  { src: "/ahmad/gallery-01.webp", alt: "Ahmad Zulfikar berbicara" },
  { src: "/ahmad/gallery-03.webp", alt: "Ahmad Zulfikar dalam sesi percakapan" },
];

export default function GalleryPreview() {
  return (
    <section className="border-t border-border bg-muted/35 py-24 md:py-36">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-5 block">Dokumentasi</span>
            <h2 className="font-serif text-4xl md:text-5xl">Galeri</h2>
          </div>
          <Link href="/galeri" className="group hidden items-center gap-2 text-sm text-primary sm:inline-flex">Lihat semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-12">
          {images.map((image, index) => (
            <motion.div key={image.src} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={`overflow-hidden bg-[hsl(var(--evidence))] ${index === 0 ? "md:col-span-5 md:row-span-2" : "md:col-span-7"}`}>
              <img src={image.src} alt={image.alt} loading="lazy" className={`w-full object-cover object-center transition-transform duration-1000 hover:scale-[1.025] ${index === 0 ? "h-[480px] md:h-[580px]" : "h-[240px] md:h-[282px]"}`} />
            </motion.div>
          ))}
        </div>
        <Link href="/galeri" className="mt-8 inline-flex items-center gap-2 text-sm text-primary sm:hidden">Lihat semua <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
