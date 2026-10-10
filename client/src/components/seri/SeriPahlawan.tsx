import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowRight, Users } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import { proseKelas } from "@/pages/NoteDetail";
import { labelWaktu } from "@shared/rilis";
import HasilBangun from "./pahlawan/HasilBangun";
import LatarPahlawan from "./pahlawan/LatarPahlawan";
import type { PropsHalamanSeri } from "./tipe";

/**
 * Series 4 · Menjadi Pahlawan, Bersama Membangun HMI. Terbit di Hari Pahlawan.
 * Urutan halaman: pembuka, naskah (atau kerangkanya), ajakan ke Bangun HMI Bersama,
 * hasil bersama kader, lalu kolom tanggapan.
 */

// Kerangka naskah: hanya garis besar, supaya halaman tidak kosong bila naskah belum diisi admin.
const kerangka = ["Mengapa Hari Pahlawan", "Bangunan yang kita warisi", "Giliran kita membangun"];

function KerangkaNaskah() {
  return (
    <ol className="grid">
      {kerangka.map((judul, i) => (
        <li key={judul} className="grid gap-4 border-t border-border py-10 first:border-t-0 first:pt-0 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8">
          <span className="font-serif text-5xl leading-none text-primary/70">0{i + 1}</span>
          <div>
            <h3 className="font-serif text-2xl leading-snug md:text-3xl">{judul}</h3>
            <div className="mt-5 grid max-w-2xl gap-2.5" aria-hidden="true">
              <span className="block h-2.5 w-full rounded-full bg-muted" />
              <span className="block h-2.5 w-[92%] rounded-full bg-muted" />
              <span className="block h-2.5 w-[68%] rounded-full bg-muted" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Bagian ini sedang ditulis.</p>
          </div>
        </li>
      ))}
      {import.meta.env.DEV && (
        <li className="border-t border-border pt-6 text-xs text-muted-foreground">Catatan pengembangan: tulis naskah di panel admin, tab Series. Begitu terisi, kerangka ini diganti naskahnya.</li>
      )}
    </ol>
  );
}

export default function SeriPahlawan({ seri, naskah, tanggapan }: PropsHalamanSeri) {
  const { data: peserta } = useQuery<{ jumlah: number }>({ queryKey: ["/api/fitur/bangun-hmi/jumlah"] });
  // Penanda komponen sisipan ([[nama]]) milik tampilan naskah biasa tidak dipakai di sini.
  const isiNaskah = naskah.replace(/<p>\s*\[\[[a-z-]+\]\]\s*<\/p>/g, "").trim();
  const nomor = String(seri.nomor).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar dark />

      <header className="relative overflow-hidden bg-[hsl(var(--evidence))] text-white">
        <LatarPahlawan />
        <div className="container relative mx-auto px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-48">
          <span className="evidence-kicker mb-6 block">Series {nomor} · Hari Pahlawan, 10 November</span>
          <h1 className="text-shadow-cinematic max-w-4xl font-serif text-4xl leading-[1.08] md:text-7xl">{seri.judul}</h1>
          {seri.subjudul && (
            <p className="mt-8 max-w-2xl border-l border-[hsl(var(--gold))] pl-6 text-lg leading-relaxed text-white/80 md:text-xl">{seri.subjudul}</p>
          )}
          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/65">
            <span>Oleh <span className="text-white">{seri.penulis}</span></span>
            <span aria-hidden="true">·</span>
            <span>Terbit {labelWaktu(seri.rilis)}</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/bangun-hmi" className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--evidence))] transition-transform hover:-translate-y-0.5">
              Ikut membangun HMI <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#hasil" className="inline-flex items-center gap-2 border border-white/40 px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:border-white">
              Lihat hasilnya <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 py-20 md:px-10 md:py-28">
          {isiNaskah ? (
            <div className={proseKelas} dangerouslySetInnerHTML={{ __html: isiNaskah }} />
          ) : (
            <div className="max-w-4xl"><KerangkaNaskah /></div>
          )}
        </section>

        {/* Ajakan ke Bangun HMI Bersama */}
        <section className="relative overflow-hidden bg-[hsl(var(--evidence))] text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgb(220_195_138/.2),transparent_50%)]" />
          <div className="container relative mx-auto grid items-center gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div className="max-w-3xl">
              <span className="evidence-kicker mb-5 block">Giliranmu membangun</span>
              <h2 className="font-serif text-3xl leading-snug md:text-5xl md:leading-[1.2]">Nilai bangunan HMI, lalu pilih tiga bagian yang paling dulu harus diperbaiki.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                Ada sebelas bagian Graha Dipo Insancita, sekretariat PB HMI. Nilai kondisinya satu per satu, dan lihat bangunannya berubah mengikuti pilihanmu. Waktunya sekitar tiga menit.
              </p>
              {!!peserta?.jumlah && (
                <p className="mt-5 inline-flex items-center gap-2 text-sm text-[hsl(var(--gold))]"><Users className="h-4 w-4" /> {peserta.jumlah} kader sudah ikut membangun</p>
              )}
            </div>
            <div>
              <Link href="/bangun-hmi" className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--evidence))] transition-transform hover:-translate-y-0.5">
                Mulai membangun <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <HasilBangun />

        <section className="container mx-auto max-w-3xl px-6 pb-24 pt-4 md:px-10 md:pb-32">{tanggapan}</section>
      </main>

      <SiteFooter />
    </div>
  );
}
