import { usePage } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PemikiranPage() {
  const { data: page, isLoading } = usePage("pemikiran-ide");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-mono text-lg animate-pulse">Memuat halaman...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="font-serif text-4xl">Halaman tidak ditemukan</h1>
        <a href="/" className="text-primary hover:underline font-mono" data-testid="link-back-home">Kembali ke Beranda</a>
      </div>
    );
  }

  const paragraphs = page.content.split("\n").filter(p => p.trim());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NoiseOverlay />
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-24 px-6"
      >
        <div className="container mx-auto max-w-3xl">
          <a href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-xs mb-12" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" /> KEMBALI KE BERANDA
          </a>

          <header className="mb-12">
            <span className="block font-mono text-xs text-primary tracking-widest mb-4 uppercase">PEMIKIRAN</span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-4">
              {page.title}
            </h1>
            <div className="h-1 w-20 bg-primary mt-6"></div>
          </header>

          <div className="space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-foreground/80 font-sans leading-8">
                {p}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
