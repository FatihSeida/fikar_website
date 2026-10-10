import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import DaftarLangkah from "@/components/DaftarLangkah";
import { caraKepemimpinan } from "@/lib/pesan";

/** Ruang Kepemimpinan: Sehari di Kursi Ketum dan Maturity Level Cabang dalam satu halaman. */
export default function KepemimpinanPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main>
        <section className="container mx-auto px-6 pb-24 pt-32 md:px-10 md:pt-40">
          <span className="eyebrow mb-6 block">Ruang Kepemimpinan</span>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Seberapa siap kamu memimpin?</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Dua latihan untuk ketum dan pengurus: rasakan satu hari memimpin dari kursi ketua umum, lalu ukur seberapa matang cabangmu bekerja. Hasilnya bisa langsung dibawa ke rapat pengurus.
          </p>
          <DaftarLangkah langkah={caraKepemimpinan} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
