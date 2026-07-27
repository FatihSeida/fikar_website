import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { usePage } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import { proseKelas } from "@/pages/NoteDetail";

export default function PemikiranPage() {
  const { data: page, isLoading } = usePage("pemikiran-ide");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-muted-foreground">Memuat halaman…</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6">
        <h1 className="font-serif text-3xl">Halaman tidak ditemukan</h1>
        <a href="/" className="text-primary hover:underline" data-testid="link-back-home">
          Kembali ke beranda
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="px-6 pb-28 pt-36"
      >
        <div className="container mx-auto max-w-2xl">
          <a
            href="/"
            className="mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-back-home"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </a>

          <header className="mb-14">
            <span className="eyebrow mb-6 block">Pemikiran</span>
            <h1 className="font-serif text-4xl leading-[1.15] md:text-5xl">
              {page.title}
            </h1>
            <div className="mt-9 h-px w-16 bg-accent" />
          </header>

          <div className={proseKelas} dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </motion.div>
    </div>
  );
}
