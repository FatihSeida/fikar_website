import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";

export type RingkasSeri = {
  slug: string;
  nomor: number;
  rilis: number;
  terbit: boolean;
  judul?: string;
  subjudul?: string | null;
  ringkasan?: string | null;
  gambar?: string | null;
  penulis?: string;
};

/** "Rabu, 21 Oktober 2026 · 15.00 WIB" */
export const labelTerbit = (rilis: number) =>
  `${new Date(rilis).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" })} · 15.00 WIB`;

/** Tab Series: empat seri tulisan, terbit satu per satu setiap Rabu pukul 15.00 WIB. */
export default function SeriesPage() {
  const { data: daftar = [], isLoading } = useQuery<RingkasSeri[]>({ queryKey: ["/api/seri"] });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="pt-24">
        <section className="container mx-auto px-6 pb-10 pt-20 md:px-10">
          <span className="eyebrow mb-6 block">Series HMI Evidence</span>
          <h1 className="max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Empat seri tentang arah kaderisasi HMI.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Tulisan Ahmad Zulfikar yang berangkat dari keadaan komisariat dan cabang. Setiap seri terbit pada hari Rabu pukul 15.00 WIB dan bisa ditanggapi atas nama komisariat dan cabangmu.
          </p>
        </section>

        <section className="container mx-auto px-6 pb-28 md:px-10">
          {isLoading ? (
            <p className="text-muted-foreground">Memuat seri…</p>
          ) : (
            <ol className="grid gap-px border border-border bg-border md:grid-cols-2">
              {daftar.map((item) => {
                const nomor = String(item.nomor).padStart(2, "0");
                const bisaDibuka = item.terbit || !!item.judul;
                const isi = (
                  <>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-4xl text-primary">{nomor}</span>
                      {!item.terbit && <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Segera terbit</span>}
                    </div>
                    {item.judul ? (
                      <>
                        <h2 className="mt-6 font-serif text-3xl leading-tight">{item.judul}</h2>
                        {(item.subjudul || item.ringkasan) && <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{item.subjudul || item.ringkasan}</p>}
                      </>
                    ) : (
                      <h2 className="mt-6 flex-1 font-serif text-3xl leading-tight text-muted-foreground">Seri {nomor}</h2>
                    )}
                    <p className="mt-6 text-sm text-muted-foreground">
                      {item.terbit ? `Terbit ${labelTerbit(item.rilis)}` : `Terbit ${labelTerbit(item.rilis)}${item.judul ? " · pratinjau" : ""}`}
                    </p>
                    {bisaDibuka && <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">Baca seri <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>}
                  </>
                );
                return (
                  <li key={item.slug} className="bg-background">
                    {bisaDibuka ? (
                      <Link href={`/series/${item.slug}`} className="group flex h-full flex-col p-8 transition-colors hover:bg-primary/5 md:p-10">{isi}</Link>
                    ) : (
                      <div className="flex h-full flex-col p-8 opacity-70 md:p-10">{isi}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
