import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import Hero from "@/components/sections/Hero";
import EvidenceTeaser from "@/components/sections/EvidenceTeaser";
import About from "@/components/sections/About";
import GalleryPreview from "@/components/sections/GalleryPreview";
import Notes from "@/components/sections/Notes";
import SiteFooter from "@/components/sections/SiteFooter";
// Dialog sambutan baru tampil setelah pemuat pembuka selesai, jadi kodenya tidak perlu ikut bundel awal.
const SambutanDialog = lazy(() => import("@/components/SambutanDialog"));
// Formulir pesan (dengan pemilih cabang) berada di bawah lipatan, jadi dimuat terpisah dari bundel awal.
const BicaraZulfikar = lazy(() => import("@/components/sections/BicaraZulfikar"));

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar dark />
      <main>
        <Hero />
        <EvidenceTeaser />
        <Suspense fallback={<section id="bicara" className="min-h-[70vh] border-t border-border bg-muted/30" />}><BicaraZulfikar /></Suspense>
        <About />
        <GalleryPreview />
        <Notes />
      </main>
      <SiteFooter />
      <Suspense fallback={null}><SambutanDialog /></Suspense>
    </div>
  );
}
