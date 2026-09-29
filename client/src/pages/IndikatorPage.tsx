import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import { indikator, kelompokIndikator, sumberIndikator, type KelompokId } from "@/lib/indikator";

export function SumberIndikator({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      Sumber: {sumberIndikator.penulis}, <cite>{sumberIndikator.judul}</cite> ({sumberIndikator.kota}: {sumberIndikator.penerbit}, {sumberIndikator.tahun}).
    </p>
  );
}

export default function IndikatorPage() {
  const [pilihan, setPilihan] = useState<KelompokId | "semua">("semua");
  const kelompokTampil = pilihan === "semua" ? kelompokIndikator : kelompokIndikator.filter((kelompok) => kelompok.id === pilihan);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="container mx-auto px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <header className="max-w-4xl">
          <span className="eyebrow mb-6 block">44 Indikator Kemunduran HMI</span>
          <h1 className="font-serif text-4xl leading-tight md:text-6xl">Satu indikator, satu pertanyaan, satu praktik.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Pada 2006, Agussalim Sitompul mencatat 44 indikator kemunduran HMI sebagai bahan otokritik. Daftar ini bukan vonis, melainkan pertanyaan yang masih bisa diperiksa di komisariat, cabang, Badko, dan Pengurus Besar. Buka satu indikator, bahas pertanyaannya di rapat, lalu coba praktiknya.
          </p>
          <SumberIndikator className="mt-6" />
        </header>

        <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Saring kelompok">
          <button
            type="button"
            onClick={() => setPilihan("semua")}
            aria-pressed={pilihan === "semua"}
            className="border border-border px-4 py-2 text-sm transition-colors aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            Semua (44)
          </button>
          {kelompokIndikator.map((kelompok) => (
            <button
              type="button"
              key={kelompok.id}
              onClick={() => setPilihan(kelompok.id)}
              aria-pressed={pilihan === kelompok.id}
              className="border border-border px-4 py-2 text-sm transition-colors aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            >
              {kelompok.judul} ({indikator.filter((item) => item.kelompok === kelompok.id).length})
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-16">
          {kelompokTampil.map((kelompok) => {
            const daftar = indikator.filter((item) => item.kelompok === kelompok.id);
            return (
              <section key={kelompok.id} className="grid gap-8 border-t border-foreground pt-6 md:grid-cols-12">
                <div className="md:col-span-4">
                  <span className="eyebrow text-primary">{kelompok.sorotan}</span>
                  <h2 className="mt-3 font-serif text-3xl">{kelompok.judul}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{daftar.length} indikator</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground"><strong className="font-medium text-foreground">Arah perbaikan.</strong> {kelompok.arahPerbaikan}</p>
                </div>
                <ol className="grid gap-px self-start border border-border bg-border sm:grid-cols-2 md:col-span-8">
                  {daftar.map((item) => (
                    <li key={item.nomor} className="bg-background">
                      <Link href={`/indikator/${item.nomor}`} className="group flex h-full gap-4 p-5 transition-colors hover:bg-primary/5">
                        <span className="w-9 shrink-0 font-serif text-2xl text-primary">{item.nomor}</span>
                        <span className="flex-1 leading-snug">{item.teks}</span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
                  {daftar.length % 2 === 1 && <li aria-hidden="true" className="hidden bg-background sm:block" />}
                </ol>
              </section>
            );
          })}
        </div>

        <aside className="mt-20 flex flex-col items-start justify-between gap-6 border border-border p-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl">Seberapa evidence komisariatmu?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Ukur lewat 20 pertanyaan singkat, perdalam dengan audit lanjutan untuk kader pasca-LK 2 dan LK 3, lalu lihat indikator mana yang paling perlu diperhatikan.</p>
          </div>
          <Link href="/kuis" className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground">Ikuti kuis <ArrowRight className="h-4 w-4" /></Link>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
