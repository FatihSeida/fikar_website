import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import PetaSuaraKader from "@/components/PetaSuaraKader";
import SiteFooter from "@/components/sections/SiteFooter";
import HeroPemuda from "./pemuda/HeroPemuda";
import NaskahKerangka from "./pemuda/NaskahKerangka";
import StatistikPemuda from "./pemuda/StatistikPemuda";
import type { PropsHalamanSeri } from "./tipe";

/**
 * Series 3, "HMI dan Para Pemuda untuk 2045": kerangka halaman. Hero, tulisan (atau catatan arah bila naskah
 * masih kosong), Peta Suara Kader, statistik kuis dan kunjungan, lalu kolom tanggapan.
 */
export default function SeriPemuda({ seri, naskah, tanggapan }: PropsHalamanSeri) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar dark />
      <main>
        <HeroPemuda seri={seri} />
        <NaskahKerangka naskah={naskah} />
        <section id="peta" className="scroll-mt-24 border-t border-border">
          <div className="container mx-auto max-w-4xl px-5 py-6 md:px-10">
            <PetaSuaraKader />
          </div>
        </section>
        <StatistikPemuda />
        <div className="container mx-auto max-w-3xl px-5 pb-28 pt-16 md:px-10">{tanggapan}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
