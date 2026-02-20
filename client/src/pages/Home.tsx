import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import SectionHeader from "@/components/SectionHeader";
import { useNotes, useGallery, usePage } from "@/hooks/use-content";

const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen pt-20 md:pt-0 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 order-2 md:order-1 bg-background relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-sm tracking-widest text-primary mb-4 block">
            BERDIRI 2024
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-6 text-foreground">
            Ahmad <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
              Zulfikar
            </span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md mb-8">
            Seorang desainer multidisiplin dan insinyur frontend yang menciptakan pengalaman digital dengan presisi dan jiwa.
          </p>
          
          <div className="space-y-4">
            <p className="font-sans text-base text-muted-foreground max-w-md">
              Tersedia untuk peluang lepas dan kolaborasi pilihan. Hubungi saya jika Anda memiliki proyek dalam pikiran.
            </p>
            <a 
              href="mailto:hello@ahmadzulfikar.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-sm tracking-widest hover:bg-primary transition-colors duration-300 shadow-lg hover:shadow-primary/25"
              data-testid="link-cta-hero"
            >
              <Mail className="w-4 h-4" /> MULAI PERCAKAPAN
            </a>
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-1/2 h-[50vh] md:h-screen order-1 md:order-2 relative bg-gray-100 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src="/images/hero-photo.jpg"
          alt="Ahmad Zulfikar"
          className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent md:hidden"></div>
      </div>
    </section>
  );
};

const GallerySection = () => {
  const { data: galleryItems, isLoading } = useGallery();

  if (isLoading) return <div className="py-20 text-center font-mono">Memuat Galeri...</div>;

  return (
    <section id="gallery" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeader title="Galeri" subtitle="KARYA TERPILIH" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
          {galleryItems?.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group overflow-hidden bg-gray-100"
              data-testid={`gallery-item-${item.id}`}
            >
              <img 
                src={item.image} 
                alt={item.caption} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-serif italic text-lg">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PemikiranSection = () => {
  const { data: page, isLoading } = usePage("pemikiran-ide");

  if (isLoading) return null;
  if (!page) return null;

  const paragraphs = page.content.split("\n").filter(p => p.trim());

  return (
    <section id="pemikiran" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <SectionHeader title={page.title} subtitle="PEMIKIRAN" />
        <div className="max-w-3xl">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg text-muted-foreground font-sans leading-relaxed mb-6">
              {p}
            </p>
          ))}
        </div>
        <a href="/pemikiran-ide" className="inline-flex items-center gap-2 font-mono text-sm mt-4 hover:text-primary transition-colors" data-testid="link-pemikiran-selengkapnya">
          BACA SELENGKAPNYA <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

const NotesSection = () => {
  const { data: noteItems, isLoading } = useNotes();

  if (isLoading) return null;

  return (
    <section id="catatan" className="py-20 md:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/20 pb-8">
          <div>
            <span className="block font-mono text-xs text-primary tracking-widest mb-4 uppercase">CATATAN</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Catatan & Aktivitas</h2>
          </div>
        </div>

        <div className="space-y-0">
          {noteItems?.map((item, index) => (
            <a 
              key={item.id} 
              href={`/catatan/${item.slug}`}
              className="group flex flex-col md:flex-row gap-6 md:gap-12 py-8 border-b border-white/10 hover:bg-white/5 transition-colors items-baseline"
              data-testid={`note-item-${item.id}`}
            >
              <span className="font-serif text-3xl md:text-4xl text-white/20 group-hover:text-primary transition-colors font-bold w-16">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-primary">{item.tag}</span>
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  <span className="font-mono text-xs text-white/60">{item.date}</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-medium leading-tight group-hover:translate-x-2 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm mt-2 line-clamp-2">{item.excerpt}</p>
              </div>
              
              <div className="md:self-center">
                <ArrowUpRight className="w-6 h-6 text-white/40 group-hover:text-primary group-hover:rotate-45 transition-all" />
              </div>
            </a>
          ))}
          {noteItems?.length === 0 && (
            <p className="text-white/40 text-center py-12 font-mono">Belum ada catatan.</p>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif text-lg font-bold">Ahmad Zulfikar</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">© {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
        </div>
        
        <div className="flex gap-8">
          {["Twitter", "LinkedIn", "Instagram", "GitHub"].map((social) => (
            <a 
              key={social} 
              href="#" 
              className="font-mono text-xs uppercase hover:text-primary transition-colors tracking-wider"
              data-testid={`link-social-${social.toLowerCase()}`}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NoiseOverlay />
      <Navbar />
      <main>
        <HeroSection />
        <GallerySection />
        <PemikiranSection />
        <NotesSection />
      </main>
      <Footer />
    </div>
  );
}
