import { useRoute } from "wouter";
import { useArticle } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ArticleDetail() {
  const [match, params] = useRoute("/article/:slug");
  const { data: article, isLoading, error } = useArticle(params?.slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-mono text-lg animate-pulse">Loading Article...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="font-serif text-4xl">Article not found</h1>
        <a href="/" className="text-primary hover:underline font-mono">Return Home</a>
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
          <a href="/#writing" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-xs mb-12">
            <ArrowLeft className="w-4 h-4" /> BACK TO WRITING
          </a>

          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6 font-mono text-xs tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {article.date}</span>
              <span className="w-1 h-1 bg-primary rounded-full"></span>
              <span className="flex items-center gap-2 uppercase"><Tag className="w-3 h-3" /> {article.tag}</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-8">
              {article.title}
            </h1>
            
            <p className="font-sans text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic">
              {article.excerpt}
            </p>
          </header>

          <div className="prose prose-lg prose-neutral max-w-none mx-auto font-sans">
             {/* 
                In a real app, this would be a rich text renderer. 
                For now, simple splitting by newline to simulate paragraphs 
             */}
             {article.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 leading-8 text-foreground/80">
                  {paragraph}
                </p>
             ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
             <div className="font-serif italic text-muted-foreground">
                Thanks for reading.
             </div>
             <button className="flex items-center gap-2 font-mono text-xs uppercase hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" /> Share Article
             </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
