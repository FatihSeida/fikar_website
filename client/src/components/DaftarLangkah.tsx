import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { sudahRilis } from "@shared/rilis";
import type { CaraIkut } from "@/lib/pesan";

/**
 * Kotak-kotak ajakan bernomor (halaman Audit Komisariat dan Ruang Kepemimpinan).
 * Kartu fitur kampanye baru tampil sesudah jadwal rilisnya; di localhost semuanya tampil.
 */
export default function DaftarLangkah({ langkah }: { langkah: readonly CaraIkut[] }) {
  const tampil = langkah.filter((l) => !l.fitur || import.meta.env.DEV || sudahRilis(l.fitur));
  return (
    <ol className={`mt-14 grid gap-px border border-border bg-border ${tampil.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
      {tampil.map((l, index) => (
        // Langkah utama tampil di latar hijau tua dengan huruf emas berkilau, seperti tulisan HMI Evidence.
        <li key={l.href} className={l.utama ? "bg-[hsl(var(--evidence))]" : "bg-background"}>
          <Link
            href={l.href}
            className={`group flex h-full flex-col p-7 md:p-9 transition-colors ${l.utama
              ? "bg-[radial-gradient(circle_at_88%_8%,rgb(220_195_138/.2),transparent_48%)] text-white hover:bg-white/[0.04]"
              : "hover:bg-primary/5"}`}
          >
            <span className={`font-serif text-3xl ${l.utama ? "evidence-shimmer" : "text-primary"}`}>0{index + 1}</span>
            <h2 className={`mt-4 font-serif text-2xl ${l.utama ? "evidence-shimmer" : ""}`}>{l.judul}</h2>
            <p className={`mt-3 flex-1 text-sm leading-relaxed ${l.utama ? "text-white/75" : "text-muted-foreground"}`}>{l.uraian}</p>
            <span className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${l.utama ? "text-[hsl(var(--gold))]" : "text-primary"}`}>Mulai <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
