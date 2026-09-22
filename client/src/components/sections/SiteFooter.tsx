import { site } from "@/lib/site";
import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="bg-[hsl(var(--evidence))] py-14 text-white">
      <div className="container mx-auto flex flex-col justify-between gap-8 px-6 md:flex-row md:items-end md:px-10">
        <div>
          <p className="font-serif text-2xl">{site.nama}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">Transformasi gerakan organisasi berbasis bukti</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.14em] text-white/55">
          <Link href="/hmi-evidence" className="evidence-shimmer">HMI Evidence</Link>
          <Link href="/tentang" className="hover:text-[hsl(var(--gold))]">Tentang</Link>
          <Link href="/catatan" className="hover:text-[hsl(var(--gold))]">Catatan</Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
