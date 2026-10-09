import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import type { PropsHalamanSeri } from "./tipe";

/** Sementara: kerangka Series 3 sedang dibangun. */
export default function SeriPemuda({ seri, tanggapan }: PropsHalamanSeri) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-24 pt-36">
        <h1 className="font-serif text-5xl">{seri.judul}</h1>
        <div className="mt-16">{tanggapan}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
