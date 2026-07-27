import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNote } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";

/** Kelas prose dipakai bersama PemikiranPage. */
export const proseKelas =
  "measure text-lg text-muted-foreground [&_blockquote]:border-l [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_h1]:font-serif [&_h1]:text-foreground [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-9 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground [&_img]:my-10 [&_img]:w-full [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6";

export default function NoteDetail() {
  const [, params] = useRoute("/catatan/:slug");
  const { data: note, isLoading, error } = useNote(params?.slug || "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-muted-foreground">Memuat catatan…</span>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6">
        <h1 className="font-serif text-3xl">Catatan tidak ditemukan</h1>
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

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="px-6 pb-28 pt-36"
      >
        <div className="container mx-auto max-w-2xl">
          <a
            href="/#catatan"
            className="mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-back-notes"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke catatan
          </a>

          <header className="mb-14">
            <div className="mb-6 flex items-center gap-3">
              <span className="eyebrow">{note.tag}</span>
              <span className="h-px w-4 bg-border" />
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {note.date}
              </span>
            </div>

            <h1 className="mb-7 font-serif text-4xl leading-[1.15] md:text-5xl">
              {note.title}
            </h1>

            <p className="measure text-lg text-muted-foreground">{note.excerpt}</p>

            <div className="mt-9 h-px w-16 bg-accent" />
          </header>

          {note.coverImage && (
            <div className="mb-14 overflow-hidden shadow-paper">
              <img src={note.coverImage} alt={note.title} className="w-full" />
            </div>
          )}

          <div className={proseKelas} dangerouslySetInnerHTML={{ __html: note.content }} />

          <p className="mt-20 border-t border-border pt-8 font-serif italic text-muted-foreground">
            Terima kasih telah membaca.
          </p>
        </div>
      </motion.article>
    </div>
  );
}
