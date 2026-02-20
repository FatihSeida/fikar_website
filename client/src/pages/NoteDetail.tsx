import { useRoute } from "wouter";
import { useNote } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import { ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function NoteDetail() {
  const [, params] = useRoute("/catatan/:slug");
  const { data: note, isLoading, error } = useNote(params?.slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-mono text-lg animate-pulse">Memuat catatan...</span>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="font-serif text-4xl">Catatan tidak ditemukan</h1>
        <a href="/" className="text-primary hover:underline font-mono" data-testid="link-back-home">Kembali ke Beranda</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NoiseOverlay />
      <Navbar />

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-24 px-6"
      >
        <div className="container mx-auto max-w-3xl">
          <a href="/#catatan" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-xs mb-12" data-testid="link-back-notes">
            <ArrowLeft className="w-4 h-4" /> KEMBALI KE CATATAN
          </a>

          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6 font-mono text-xs tracking-widest text-muted-foreground">
              <span className="text-primary">{note.date}</span>
              <span className="w-1 h-1 bg-primary rounded-full"></span>
              <span className="uppercase">{note.tag}</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-8">
              {note.title}
            </h1>
            
            <p className="font-sans text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic">
              {note.excerpt}
            </p>
          </header>

          {note.coverImage && (
            <div className="mb-12 aspect-video overflow-hidden">
              <img src={note.coverImage} alt={note.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg prose-neutral max-w-none mx-auto font-sans">
             {note.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 leading-8 text-foreground/80">
                  {paragraph}
                </p>
             ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
             <div className="font-serif italic text-muted-foreground">
                Terima kasih telah membaca.
             </div>
             <button className="flex items-center gap-2 font-mono text-xs uppercase hover:text-primary transition-colors" data-testid="button-share">
                <Share2 className="w-4 h-4" /> Bagikan
             </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
