import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import SectionHeader from "@/components/SectionHeader";
import { useArticles, useNews, useGallery } from "@/hooks/use-content";

// --- Sections ---

const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen pt-20 md:pt-0 flex flex-col md:flex-row">
      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 order-2 md:order-1 bg-background relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-sm tracking-widest text-primary mb-4 block">
            BERDIRI 2024
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-8 text-foreground">
            Ahmad <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
              Zulfikar
            </span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md mb-10">
            Seorang desainer multidisiplin dan insinyur frontend yang menciptakan pengalaman digital dengan presisi dan jiwa. Saat ini sedang membangun masa depan antarmuka web.
          </p>
          
          <div className="flex gap-6 items-center">
            <a 
              href="#profile" 
              className="group flex items-center gap-3 font-mono text-sm tracking-widest hover:text-primary transition-colors"
            >
              BACA BIO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#writing" 
              className="group flex items-center gap-3 font-mono text-sm tracking-widest hover:text-primary transition-colors"
            >
              KARYA TERBARU <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen order-1 md:order-2 relative bg-gray-100 overflow-hidden">
        {/* Unsplash fallback in case local file missing */}
        {/* portrait of man in suit looking away studio lighting black and white */}
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src="/images/hero-photo.jpg" // User requested specific path
          alt="Ahmad Zulfikar"
          className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
          onError={(e) => {
            // Fallback if local image doesn't exist
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
        <SectionHeader title="Jurnal Visual" subtitle="KARYA TERPILIH" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
          {galleryItems?.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group overflow-hidden bg-gray-100 ${item.colSpan || 'col-span-1'}`}
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

const WritingSection = () => {
  const { data: articles, isLoading } = useArticles();
  
  if (isLoading) return <div className="py-20 text-center font-mono">Memuat Artikel...</div>;

  const featured = articles?.find(a => a.isFeatured) || articles?.[0];
  const others = articles?.filter(a => a.id !== featured?.id) || [];

  return (
    <section id="writing" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <SectionHeader title="Pemikiran & Ide" subtitle="TULISAN" />

        {/* Featured Article */}
        {featured && (
          <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] bg-muted relative overflow-hidden group">
               {/* Minimalist placeholder for article image */}
               <div className="absolute inset-0 bg-neutral-200 group-hover:bg-neutral-300 transition-colors flex items-center justify-center">
                  <span className="font-serif italic text-4xl text-neutral-400">Unggulan</span>
               </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6 font-mono text-xs tracking-widest text-muted-foreground">
                <span className="text-primary">{featured.date}</span>
                <span>/</span>
                <span className="uppercase">{featured.tag}</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight group-hover:text-primary transition-colors">
                <a href={`/article/${featured.slug}`}>{featured.title}</a>
              </h3>
              <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-8 line-clamp-3">
                {featured.excerpt}
              </p>
              <a href={`/article/${featured.slug}`} className="inline-flex items-center gap-2 font-mono text-sm border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
                BACA ARTIKEL <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Other Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {others.map((article) => (
            <article key={article.id} className="group">
              <div className="flex justify-between items-baseline mb-4 font-mono text-xs text-muted-foreground">
                <span>{article.date}</span>
                <span className="px-2 py-1 border border-border rounded-full text-[10px] uppercase">{article.tag}</span>
              </div>
              <h4 className="text-2xl font-serif font-bold mb-4 leading-snug group-hover:text-primary transition-colors">
                <a href={`/article/${article.slug}`}>{article.title}</a>
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                {article.excerpt}
              </p>
              <a href={`/article/${article.slug}`} className="text-primary font-mono text-xs hover:underline inline-flex items-center gap-1">
                BACA SELENGKAPNYA <ArrowUpRight className="w-3 h-3" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsSection = () => {
  const { data: newsItems, isLoading } = useNews();

  if (isLoading) return null;

  return (
    <section className="py-20 md:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/20 pb-8">
          <div>
            <span className="block font-mono text-xs text-primary tracking-widest mb-4 uppercase">PEMBARUAN</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Pers & Berita</h2>
          </div>
          <a href="#" className="hidden md:block font-mono text-xs border-b border-white pb-1 hover:text-primary hover:border-primary transition-colors mt-8 md:mt-0">
            LIHAT ARSIP
          </a>
        </div>

        <div className="space-y-0">
          {newsItems?.map((item, index) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col md:flex-row gap-6 md:gap-12 py-8 border-b border-white/10 hover:bg-white/5 transition-colors items-baseline"
            >
              <span className="font-serif text-3xl md:text-4xl text-white/20 group-hover:text-primary transition-colors font-bold w-16">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-primary">{item.source}</span>
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  <span className="font-mono text-xs text-white/60">{item.date}</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-medium leading-tight group-hover:translate-x-2 transition-transform duration-300">
                  {item.headline}
                </h3>
              </div>
              
              <div className="md:self-center">
                <ArrowUpRight className="w-6 h-6 text-white/40 group-hover:text-primary group-hover:rotate-45 transition-all" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 text-foreground">
          Mari ciptakan sesuatu <br />
          <span className="italic text-primary">luar biasa.</span>
        </h2>
        <p className="font-sans text-xl text-muted-foreground mb-12 max-w-xl mx-auto">
          Tersedia untuk peluang lepas dan kolaborasi pilihan. Hubungi saya jika Anda memiliki proyek dalam pikiran.
        </p>
        <a 
          href="mailto:hello@ahmadzulfikar.com"
          className="inline-block px-10 py-5 bg-foreground text-background font-mono text-sm tracking-widest hover:bg-primary transition-colors duration-300 shadow-lg hover:shadow-primary/25"
        >
          MULAI PERCAKAPAN
        </a>
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
        <WritingSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
