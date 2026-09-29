import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import TeksIstilah from "@/components/TeksIstilah";
import TombolBagikan from "@/components/TombolBagikan";
import TombolStory from "@/components/TombolStory";
import { indikator, kelompokIndikator } from "@/lib/indikator";
import { programDenganNomor } from "@/lib/program";
import { SumberIndikator } from "@/pages/IndikatorPage";

export default function IndikatorDetailPage() {
  const params = useParams<{ nomor: string }>();
  const nomor = /^\d{1,2}$/.test(params.nomor ?? "") ? Number(params.nomor) : NaN;
  const item = indikator.find((entri) => entri.nomor === nomor);

  if (!item) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto flex min-h-[70vh] flex-col items-start justify-center gap-5 px-6 pt-32 md:px-10">
          <h1 className="font-serif text-3xl">Indikator tidak ditemukan</h1>
          <Link href="/indikator" className="text-primary hover:underline">Lihat 44 indikator</Link>
        </main>
      </div>
    );
  }

  const kelompok = kelompokIndikator.find((entri) => entri.id === item.kelompok);
  const sebelumnya = indikator.find((entri) => entri.nomor === item.nomor - 1);
  const berikutnya = indikator.find((entri) => entri.nomor === item.nomor + 1);
  const program = (item.program ?? []).map((kode) => ({ kode, data: programDenganNomor(kode) })).filter((entri) => entri.data);
  const pesan = `Indikator #${item.nomor} dari 44 Indikator Kemunduran HMI (Agussalim Sitompul, 2006):\n"${item.teks}"\n\nPertanyaan untuk komisariat kita: ${item.pertanyaan}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="container mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <Link href="/indikator" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> 44 Indikator
        </Link>

        <header className="mt-10">
          <p className="eyebrow text-primary">Indikator #{item.nomor} dari 44 · {kelompok?.judul}</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">{item.teks}</h1>
        </header>

        <section className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2">
          <div className="bg-background p-7">
            <span className="eyebrow">Pertanyaan untuk komisariatmu</span>
            <p className="mt-4 font-serif text-2xl leading-snug"><TeksIstilah>{item.pertanyaan}</TeksIstilah></p>
          </div>
          <div className="bg-background p-7">
            <span className="eyebrow">Praktik yang bisa dicoba bulan ini</span>
            <p className="mt-4 leading-relaxed text-muted-foreground"><TeksIstilah>{item.praktik}</TeksIstilah></p>
          </div>
        </section>

        {kelompok && (
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-medium text-foreground">Kelompok {kelompok.judul}.</strong> {kelompok.arahPerbaikan}
          </p>
        )}

        {program.length > 0 && (
          <section className="mt-10">
            <span className="eyebrow">Program HMI Evidence yang terkait</span>
            <ul className="mt-4 grid gap-2">
              {program.map(({ kode, data }) => (
                <li key={kode}>
                  <Link href={`/hmi-evidence#program-${kode}`} className="group inline-flex items-center gap-3 text-sm">
                    <span className="font-serif text-lg text-primary">{kode}</span>
                    <span className="border-b border-transparent group-hover:border-primary">{data!.judul}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 border-t border-border pt-8">
          <span className="eyebrow">Bagikan ke grup komisariatmu</span>
          <div className="mt-4 flex flex-wrap items-start gap-3">
            <TombolBagikan path={`/indikator/${item.nomor}`} pesan={pesan} />
            <TombolStory
              namaFile={`story-indikator-${item.nomor}.png`}
              isi={{
                label: `Indikator #${item.nomor} dari 44 · ${kelompok?.judul ?? ""}`,
                judul: item.teks,
                labelIsi: "Pertanyaan untuk komisariatmu",
                isi: item.pertanyaan,
                catatan: "Sumber: Agussalim Sitompul (2006)",
                tautan: `ahmadzulfikar.com/indikator/${item.nomor}`,
              }}
            />
          </div>
        </section>

        <SumberIndikator className="mt-10" />

        <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm" aria-label="Indikator lain">
          {sebelumnya ? (
            <Link href={`/indikator/${sebelumnya.nomor}`} className="group">
              <span className="eyebrow">Sebelumnya · #{sebelumnya.nomor}</span>
              <span className="mt-2 block text-muted-foreground group-hover:text-foreground">{sebelumnya.teks}</span>
            </Link>
          ) : <span />}
          {berikutnya && (
            <Link href={`/indikator/${berikutnya.nomor}`} className="group text-right">
              <span className="eyebrow">Berikutnya · #{berikutnya.nomor}</span>
              <span className="mt-2 block text-muted-foreground group-hover:text-foreground">{berikutnya.teks}</span>
            </Link>
          )}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
