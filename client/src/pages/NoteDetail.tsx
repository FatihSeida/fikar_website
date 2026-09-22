import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useNote } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";

/** Kelas prose dipakai bersama PemikiranPage. */
export const proseKelas =
  "measure text-lg leading-[1.9] text-muted-foreground [&_blockquote]:my-10 [&_blockquote]:border-l [&_blockquote]:border-accent [&_blockquote]:py-1 [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-2xl [&_blockquote]:leading-relaxed [&_blockquote]:text-foreground [&_h1]:font-serif [&_h1]:text-foreground [&_h2]:mb-5 [&_h2]:mt-14 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground [&_img]:my-10 [&_img]:w-full [&_li]:mb-2 [&_ol]:mb-7 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-7 [&_p:first-child]:text-xl [&_p:first-child]:leading-[1.8] [&_p:first-child]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-6";

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
        <Link href="/" className="text-primary hover:underline" data-testid="link-back-home">
          Kembali ke beranda
        </Link>
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
        <div className="container mx-auto max-w-3xl">
          <Link
            href="/catatan"
            className="mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-back-notes"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke catatan
          </Link>

          <header className="mb-14 border-b border-border pb-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="eyebrow">{note.tag}</span>
              <span className="h-px w-4 bg-border" />
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {note.date}
              </span>
            </div>

            <h1 className="mb-7 max-w-3xl font-serif text-4xl leading-[1.12] md:text-6xl">
              {note.title}
            </h1>

            <p className="measure text-lg text-muted-foreground">{note.excerpt}</p>

          </header>

          {note.coverImage && (
            <div className="mb-14 overflow-hidden shadow-paper">
              <img src={note.coverImage} alt={note.title} className="w-full" />
            </div>
          )}

          <div className={proseKelas} dangerouslySetInnerHTML={{ __html: note.content }} />

          {note.sourceUrl && (
            <a
              href={note.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex items-center gap-3 border border-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors duration-500 hover:bg-foreground hover:text-background"
              data-testid="link-note-source"
            >
              Baca di {note.sourceName ?? "sumber asli"}
            </a>
          )}

          <aside className="mt-20 border-t border-border pt-10">
            <p className="eyebrow">Lanjutkan pembacaan</p>
            <p className="mt-4 max-w-xl font-serif text-2xl leading-relaxed text-foreground">Empat catatan ini menjadi pondasi pemikiran bagi transformasi gerakan organisasi berbasis bukti.</p>
            <a href="/hmi-evidence" className="mt-7 inline-flex border border-foreground px-6 py-3 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-foreground hover:text-background">Jelajahi HMI Evidence</a>
          </aside>
        </div>
      </motion.article>
      <SiteFooter />
    </div>
  );
}
