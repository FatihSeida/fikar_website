import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Link, useRoute } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import KolomTanggapan from "@/components/KolomTanggapan";
import PetaSuaraKader from "@/components/PetaSuaraKader";
import { SegeraHadir } from "@/components/SegeraHadir";
import { proseKelas } from "@/pages/NoteDetail";
import { labelTerbit } from "@/pages/SeriesPage";
import type { Seri } from "@shared/schema";
import type { CeritaSeri } from "@shared/cerita";
import type { InfoSeri } from "@/components/seri/tipe";

// Tampilan khusus dimuat terpisah: cerita interaktif membawa three.js, kerangka membawa grafik.
const CeritaInteraktif = lazy(() => import("@/components/cerita/CeritaInteraktif"));
const SeriPemuda = lazy(() => import("@/components/seri/SeriPemuda"));
const SeriPahlawan = lazy(() => import("@/components/seri/SeriPahlawan"));

type SeriLengkap = Seri & { rilis: number; tampilan?: "cerita" | "pemuda" | "pahlawan" | "naskah"; cerita?: CeritaSeri };

/**
 * Ajakan di tengah atau akhir tulisan, disisipkan admin dengan [[ajakan-kuis]].
 * Memakai span, bukan p, supaya gaya paragraf naskah tidak ikut menimpanya.
 */
function AjakanKuis() {
  return (
    <aside className="my-12 bg-[hsl(var(--evidence))] p-8 text-white">
      <span className="block text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--gold))]">Audit komisariat</span>
      <span className="mt-3 block font-serif text-2xl leading-snug">Seberapa evidence komisariatmu?</span>
      <span className="mt-3 block text-sm leading-relaxed text-white/75">Ukur kebiasaan komisariatmu lewat 20 pertanyaan singkat, lalu bawa laporannya ke rapat pengurus.</span>
      <Link href="/kuis" className="mt-6 inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--evidence))]">
        Ikuti kuis audit <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}

/** Komponen interaktif yang bisa disisipkan admin di naskah dengan paragraf [[nama-komponen]]. */
const komponenSisipan: Record<string, () => JSX.Element | null> = {
  "ajakan-kuis": AjakanKuis,
  "peta-suara-kader": PetaSuaraKader,
};

// Potongan naskah sesudah komponen sisipan tidak memperbesar paragraf pertamanya lagi.
const proseLanjutan = proseKelas.replace(/\[&_p:first-child\]:\S+\s?/g, "");

/** Naskah dipotong di setiap [[komponen]]; komponennya dirender di luar gaya naskah. */
function IsiSeri({ html }: { html: string }) {
  const bagian = html.split(/<p>\s*\[\[([a-z-]+)\]\]\s*<\/p>/g);
  let pertama = true;
  return (
    <div>
      {bagian.map((potongan, i) => {
        if (i % 2 === 1) {
          const Komponen = komponenSisipan[potongan];
          return Komponen ? <Komponen key={i} /> : null;
        }
        if (!potongan.trim()) return null;
        const kelas = pertama ? proseKelas : proseLanjutan;
        pertama = false;
        return <div key={i} className={kelas} dangerouslySetInnerHTML={{ __html: potongan }} />;
      })}
    </div>
  );
}

const menitBaca = (html: string) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));

/** "403: {...rilis...}" dari pengambil data bawaan menjadi waktu rilis seri. */
function rilisDariGalat(galat: unknown): number | null {
  const pesan = galat instanceof Error ? galat.message : "";
  if (!pesan.startsWith("403:")) return null;
  try {
    const rilis = JSON.parse(pesan.slice(4)).rilis;
    return typeof rilis === "number" ? rilis : null;
  } catch {
    return null;
  }
}

export default function SeriDetailPage() {
  const [, params] = useRoute("/series/:slug");
  const slug = params?.slug ?? "";
  const { data: seri, isLoading, error } = useQuery<SeriLengkap>({ queryKey: [`/api/seri/${slug}`], enabled: !!slug });

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Memuat seri…</div>;
  }

  const rilis = rilisDariGalat(error);
  if (rilis) {
    return (
      <SegeraHadir isi={{
        eyebrow: `Segera terbit · ${labelTerbit(rilis)}`,
        judul: "Series HMI Evidence",
        uraian: "Seri ini sedang disiapkan dan terbit otomatis sesuai jadwal. Sambil menunggu, ukur komisariatmu lewat kuis audit atau baca gagasan HMI Evidence.",
        peluncuran: rilis,
        catatanAdmin: "",
      }} />
    );
  }

  if (error || !seri) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6">
        <h1 className="font-serif text-3xl">Seri ini sedang disiapkan</h1>
        <p className="max-w-md text-center text-muted-foreground">Naskahnya akan tampil di sini begitu siap. Sambil menunggu, baca seri lain atau ikuti kuis audit komisariat.</p>
        <Link href="/series" className="text-primary hover:underline">Kembali ke Series</Link>
      </div>
    );
  }

  const info: InfoSeri = {
    slug: seri.slug, nomor: seri.nomor, judul: seri.judul, subjudul: seri.subjudul, rilis: seri.rilis,
    penulis: seri.penulis, tautanMedia: seri.tautanMedia, namaMedia: seri.namaMedia,
  };
  const memuat = <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--evidence))] text-white/70">Memuat seri…</div>;
  const tanggapan = <KolomTanggapan slug={seri.slug} />;
  if (seri.tampilan === "cerita" && seri.cerita) {
    return <Suspense fallback={memuat}><CeritaInteraktif seri={info} cerita={seri.cerita} naskah={seri.isi} tanggapan={tanggapan} /></Suspense>;
  }
  if (seri.tampilan === "pemuda") return <Suspense fallback={memuat}><SeriPemuda seri={info} naskah={seri.isi} tanggapan={tanggapan} /></Suspense>;
  if (seri.tampilan === "pahlawan") return <Suspense fallback={memuat}><SeriPahlawan seri={info} naskah={seri.isi} tanggapan={tanggapan} /></Suspense>;

  const nomor = String(seri.nomor).padStart(2, "0");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <article className="px-6 pb-28 pt-36">
        <div className="container mx-auto max-w-3xl">
          <Link href="/series" className="mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Semua seri
          </Link>

          <header className="mb-14 border-b border-border pb-12">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="eyebrow">Series {nomor}</span>
              <span className="h-px w-4 bg-border" />
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{labelTerbit(seri.rilis)}</span>
            </div>
            <h1 className="mb-7 font-serif text-4xl leading-[1.12] md:text-6xl">{seri.judul}</h1>
            {seri.subjudul && <p className="measure text-xl leading-relaxed text-muted-foreground">{seri.subjudul}</p>}
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <span>Oleh <span className="text-foreground">{seri.penulis}</span></span>
              <span aria-hidden="true">·</span>
              <span>{menitBaca(seri.isi)} menit baca</span>
              {seri.tautanMedia && (
                <>
                  <span aria-hidden="true">·</span>
                  <a href={seri.tautanMedia} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    Juga dimuat di {seri.namaMedia || "media"} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </>
              )}
            </p>
          </header>

          {seri.gambar && (
            <div className="mb-14 overflow-hidden shadow-paper">
              <img src={seri.gambar} alt={seri.judul} className="w-full" />
            </div>
          )}

          {seri.isi.trim() ? <IsiSeri html={seri.isi} /> : <p className="text-muted-foreground">Naskah seri ini belum diisi. Tulis naskahnya di panel admin, tab Series.</p>}

          <AjakanKuis />

          <KolomTanggapan slug={seri.slug} />
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
