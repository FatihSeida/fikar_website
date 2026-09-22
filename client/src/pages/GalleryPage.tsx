import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";

const photos = [
  { src: "/ahmad/standing-centered.webp", alt: "Ahmad Zulfikar berdiri mengenakan atribut HMI", className: "md:col-span-4 aspect-[4/5]" },
  { src: "/ahmad/gallery-02.webp?v=oriented", alt: "Potret Ahmad Zulfikar mengenakan batik", className: "md:col-span-4 aspect-[4/5]" },
  { src: "/ahmad/profile-centered.webp", alt: "Ahmad Zulfikar duduk mengenakan atribut HMI", className: "md:col-span-4 aspect-[4/5]" },
  { src: "/ahmad/gallery-01.webp", alt: "Ahmad Zulfikar berbicara dalam sesi dokumentasi", className: "md:col-span-6 aspect-video" },
  { src: "/ahmad/gallery-03.webp", alt: "Ahmad Zulfikar dalam sesi wawancara", className: "md:col-span-6 aspect-video" },
  { src: "/ahmad/gallery-04.webp", alt: "Dokumentasi Ahmad Zulfikar", className: "md:col-span-6 aspect-video" },
  { src: "/ahmad/gallery-06.webp", alt: "Potret dokumenter Ahmad Zulfikar", className: "md:col-span-6 aspect-video" },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="pb-28 pt-36">
        <header className="container mx-auto px-6 md:px-10">
          <span className="eyebrow mb-6 block">Dokumentasi</span>
          <h1 className="max-w-3xl font-serif text-5xl md:text-7xl">Potret perjalanan dan ruang pengabdian.</h1>
          <p className="mt-7 max-w-xl text-muted-foreground">Arsip visual Ahmad Zulfikar dalam ruang HMI, profesi, dan percakapan gagasan.</p>
        </header>
        <div className="container mx-auto mt-16 grid gap-4 px-6 md:grid-cols-12 md:px-10">
          {photos.map((photo, index) => (
            <motion.figure key={photo.src} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: (index % 3) * 0.06, duration: 0.8 }} className={`group overflow-hidden bg-[hsl(var(--evidence))] ${photo.className}`}>
              <img src={photo.src} alt={photo.alt} loading={index > 1 ? "lazy" : "eager"} className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.025]" />
            </motion.figure>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
