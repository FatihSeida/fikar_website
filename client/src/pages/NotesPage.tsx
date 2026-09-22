import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import Notes from "@/components/sections/Notes";
import SiteFooter from "@/components/sections/SiteFooter";

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="pt-24">
        <section className="container mx-auto px-6 pb-8 pt-20 md:px-10">
          <span className="eyebrow mb-6 block">Catatan &amp; Aktivitas</span>
          <h1 className="max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Catatan, gagasan, dan aktivitas Ahmad Zulfikar.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">Ruang yang menghimpun tulisan, pandangan, refleksi, dan aktivitas Ahmad Zulfikar.</p>
        </section>
        <Notes />
      </main>
      <SiteFooter />
    </div>
  );
}
