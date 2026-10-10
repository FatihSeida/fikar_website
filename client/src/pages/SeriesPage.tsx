import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import { labelWaktu } from "@shared/rilis";

export type RingkasSeri = {
  slug: string;
  nomor: number;
  rilis: number;
  terbit: boolean;
  /** Dua hari sebelum terbit: judul dan caption sudah tampil, isinya belum bisa dibuka. */
  segera?: boolean;
  judul?: string;
  subjudul?: string | null;
  ringkasan?: string | null;
  gambar?: string | null;
  penulis?: string;
  tampilan?: "cerita" | "pemuda" | "pahlawan" | "naskah";
};

/** "Rabu, 21 Oktober 2026 · 15.00 WIB" (jamnya mengikuti jadwal rilis seri itu). */
export const labelTerbit = (rilis: number) => labelWaktu(rilis);

/** Latar tiap baris: gambar yang sudah dipakai di halaman HMI Evidence, diberi lapisan hijau gelap. */
const latar: Record<number, { src: string; posisi: string }> = {
  1: { src: "/scrollytelling/hmi-evidence-06-masa-depan-v1.webp", posisi: "center 55%" },
  2: { src: "/scrollytelling/hmi-evidence-05-berbasis-bukti-v1.webp", posisi: "center" },
  3: { src: "/scrollytelling/hmi-evidence-01-indonesia-v1.webp", posisi: "center" },
  4: { src: "/scrollytelling/hmi-evidence-02-kelahiran-hmi-v1.webp", posisi: "center" },
};

function BarisSeri({ item }: { item: RingkasSeri }) {
  const nomor = String(item.nomor).padStart(2, "0");
  const segera = !item.terbit && !!item.segera;
  // Judul seri yang belum terbit hanya dikirim ke admin dan ke localhost.
  const pratinjau = !item.terbit && !item.segera;
  const gambar = latar[item.nomor];

  const isi = (
    <>
      {gambar && (
        <img
          src={gambar.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: gambar.posisi }}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.03] ${segera ? "opacity-60 saturate-50" : ""}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#071610] via-[#071610]/85 to-[#071610]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071610]/80 via-transparent to-[#071610]/30" />
      <div className="container relative mx-auto grid items-center gap-x-12 gap-y-4 px-6 py-14 md:grid-cols-[auto_1fr] md:px-10 md:py-20">
        <span aria-hidden="true" className="font-serif text-7xl leading-none text-[hsl(var(--gold))] md:min-w-[11rem] md:text-[9rem]">{nomor}</span>
        <div className="max-w-2xl">
          <span className="evidence-kicker block max-md:sr-only">Seri {nomor}</span>
          <h2 className="text-shadow-cinematic mt-3 font-serif text-3xl leading-tight md:text-5xl">{item.judul ?? `Seri ${nomor}`}</h2>
          {(item.subjudul || item.ringkasan) && <p className="mt-4 leading-relaxed text-white/75 md:text-lg">{item.subjudul || item.ringkasan}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {segera ? (
              <span className="inline-flex items-center gap-2 border border-white/25 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white/80">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Segera terbit · {labelWaktu(item.rilis)}
              </span>
            ) : (
              <>
                {pratinjau && <span className="border border-[hsl(var(--gold))]/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--gold))]">Pratinjau admin</span>}
                <span className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--evidence))] transition-transform motion-safe:group-hover:-translate-y-0.5">
                  Baca seri <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                </span>
                <span className="text-sm text-white/60">{item.terbit ? "Terbit" : "Dijadwalkan"} {labelWaktu(item.rilis)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <li className="border-t border-white/10 last:border-b">
      {segera ? (
        <div className="relative block overflow-hidden bg-[#071610] text-white">{isi}</div>
      ) : (
        <Link href={`/series/${item.slug}`} className="group relative block overflow-hidden bg-[#071610] text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--gold))]">
          {isi}
        </Link>
      )}
    </li>
  );
}

/** Tab Series: empat seri tulisan, satu baris untuk setiap seri, urut menurut waktu terbit. */
export default function SeriesPage() {
  const { data: daftar = [], isLoading, isError } = useQuery<RingkasSeri[]>({ queryKey: ["/api/seri"], staleTime: 60_000 });
  // Seri yang belum terbit dan belum masuk H-2 tidak tampil di publik (server juga tidak mengirim judulnya).
  const tampil = daftar.filter((item) => item.terbit || item.segera || item.judul).sort((a, b) => a.rilis - b.rilis || a.nomor - b.nomor);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="pt-24">
        <section className="container mx-auto px-6 pb-12 pt-20 md:px-10">
          <span className="eyebrow mb-6 block">Series HMI Evidence</span>
          <h1 className="max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Empat seri tentang arah kaderisasi HMI.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Empat cerita tentang arah HMI: kader yang melangkah ke dunia, ingatan organisasi yang bisa dibaca bersama, suara pemuda dari seluruh Indonesia, dan ajakan membangun HMI bersama.
          </p>
        </section>

        {tampil.length > 0 ? (
          <ol>{tampil.map((item) => <BarisSeri key={item.slug} item={item} />)}</ol>
        ) : (
          <section className="container mx-auto px-6 pb-28 md:px-10">
            <p className="text-muted-foreground">
              {isLoading ? "Memuat seri…" : isError ? "Daftar seri belum bisa dimuat. Coba muat ulang halaman ini." : "Belum ada seri yang bisa dibaca. Kunjungi lagi sebentar lagi."}
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
