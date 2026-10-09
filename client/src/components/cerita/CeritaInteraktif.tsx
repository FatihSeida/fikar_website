import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import type { CeritaSeri } from "@shared/cerita";
import type { PropsHalamanSeri } from "@/components/seri/tipe";

/** Sementara: mesin cerita interaktif sedang dibangun. */
export default function CeritaInteraktif({ seri, cerita, tanggapan }: PropsHalamanSeri & { cerita: CeritaSeri }) {
  return (
    <div className="min-h-screen bg-[hsl(var(--evidence))] text-white">
      <Navbar dark />
      <main className="container mx-auto px-6 pb-24 pt-36">
        <p className="evidence-kicker">Series {String(seri.nomor).padStart(2, "0")}</p>
        <h1 className="mt-4 font-serif text-5xl">{cerita.pembuka.judul}</h1>
        {cerita.bab.map((bab) => <p key={bab.id} className="mt-6 text-white/80">{bab.judul}: {bab.inti}</p>)}
        <div className="mt-16 bg-background p-6 text-foreground">{tanggapan}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
