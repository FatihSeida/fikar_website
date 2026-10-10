import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, Users } from "lucide-react";
import { Link } from "wouter";
import BangunanHmi, { warnaNilai } from "@/components/BangunanHmi";
import type { PinBagian } from "@/components/bangun/Panggung";
import type { Perbaikan } from "@/components/bangun/gedung";
import { labelRilis } from "@shared/rilis";
import type { KontenBangunHmi } from "../../../../../server/konten/bangunHmi";

/**
 * "Hasil Bangun HMI Bersama" di Series 4: bangunan 3D gabungan menurut kader,
 * peringkat bagian yang paling mendesak, dan jumlah peserta. Isi bagian datang
 * dari /api/konten/bangun-hmi, angkanya dari /api/fitur/bangun-hmi/hasil
 * (terkunci sampai 25 November kecuali di localhost dan untuk admin).
 */

// Bangunan 3D dimuat terpisah supaya three.js tidak ikut bundel halaman ini.
const Panggung = lazy(() => import("@/components/bangun/Panggung"));

type HasilBersama = {
  jumlah: number; komisariat: number; cabang: number; ditarik: string;
  bagian: { id: string; rataRata: number | null; dipilihMendesak: number; cara: number[]; usulan: number }[];
};
type Bagian = KontenBangunHmi["bagian"][number];

/** Warna per nilai, dari Rapuh (1) sampai Kokoh (5); sama dengan yang dipakai di Bangun HMI Bersama. */
const WARNA_NILAI = ["#B5523B", "#D08A3C", "#B8A43F", "#5E9B6B", "#0E8A4F"];
const BELUM = "#8FA3B8";

const angka = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });
const huruf = (teks: string) => teks.charAt(0).toUpperCase() + teks.slice(1);

function adaWebgl() {
  try {
    const kanvas = document.createElement("canvas");
    return !!(kanvas.getContext("webgl2") || kanvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Bangunan baru disiapkan saat hampir terlihat, dan berhenti berputar saat di luar layar. */
function useTerlihat() {
  const ref = useRef<HTMLDivElement>(null);
  const [pernah, setPernah] = useState(false);
  const [sekarang, setSekarang] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setPernah(true); setSekarang(true); return; }
    const amati = new IntersectionObserver(([entri]) => {
      setSekarang(entri.isIntersecting);
      if (entri.isIntersecting) setPernah(true);
    }, { rootMargin: "240px 0px" });
    amati.observe(el);
    return () => amati.disconnect();
  }, []);
  return { ref, pernah, sekarang };
}

type PropsBangunan = {
  webgl: boolean;
  kelas: string;
  nama?: Record<string, string>;
  nilai?: Record<string, number>;
  prioritas?: string[];
  perbaikan?: Record<string, Perbaikan | undefined>;
  pin?: PinBagian[];
};

function Bangunan({ webgl, kelas, nama = {}, nilai = {}, prioritas = [], perbaikan = {}, pin }: PropsBangunan) {
  const { ref, pernah, sekarang } = useTerlihat();
  const diam = useReducedMotion();
  const isi: Omit<ComponentProps<typeof Panggung>, "className"> = { nilai, prioritas, perbaikan, fokus: null, pin, putar: sekarang && !diam };
  const menyiapkan = <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Menyiapkan bangunan…</div>;
  return (
    <div ref={ref} className={kelas}>
      {!webgl ? (
        <BangunanHmi nilai={nilai} nama={nama} sorot={prioritas} className="h-full w-full" />
      ) : pernah ? (
        <Suspense fallback={menyiapkan}><Panggung {...isi} className="h-full w-full" /></Suspense>
      ) : menyiapkan}
    </div>
  );
}

const kelasTombolUtama = "inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90";
const latarBangunan = "overflow-hidden border border-border bg-gradient-to-b from-[#ECE6D6] to-[#F6F3EA]";

/** Tampilan sebelum ada angka: hasil belum dibuka, atau belum ada masukan. Bangunan tampil sebagai cetak biru. */
function BelumAdaHasil({ webgl, nama, judul, uraian, peserta, ikon }: { webgl: boolean; nama: Record<string, string>; judul: string; uraian: string; peserta?: number; ikon?: ReactNode }) {
  return (
    <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
      <div>
        {ikon}
        <p className="font-serif text-3xl leading-snug md:text-4xl">{judul}</p>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{uraian}</p>
        {!!peserta && <p className="mt-5 inline-flex items-center gap-2 text-sm text-primary"><Users className="h-4 w-4" /> {peserta} kader sudah ikut membangun</p>}
        <div className="mt-8">
          <Link href="/bangun-hmi" className={kelasTombolUtama}>Ikut menilai bangunan <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
      <figure>
        <div className={latarBangunan}><Bangunan webgl={webgl} nama={nama} kelas="h-[320px] w-full md:h-[440px]" /></div>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">Bangunan ini masih rencana. Setiap penilaian kader ikut membangunnya.</figcaption>
      </figure>
    </div>
  );
}

function ringkas(konten: KontenBangunHmi, data: HasilBersama) {
  const isi = new Map<string, Bagian>(konten.bagian.map((b) => [b.id, b]));
  // Yang paling sering dipilih mendesak di atas; bila sama banyak, yang kondisinya lebih rapuh dulu.
  const urut = data.bagian
    .filter((b) => isi.has(b.id))
    .sort((a, b) => b.dipilihMendesak - a.dipilihMendesak || (a.rataRata ?? 6) - (b.rataRata ?? 6));
  const nilai: Record<string, number> = {};
  for (const b of urut) if (b.rataRata !== null) nilai[b.id] = Math.min(5, Math.max(1, Math.round(b.rataRata)));
  const prioritas = urut.filter((b) => b.dipilihMendesak > 0).slice(0, 3).map((b) => b.id);
  // Cara perbaikan terbanyak untuk tiga bagian itu; bila tak ada yang memilih cara, bagian dibiarkan berperancah.
  const perbaikan: Record<string, Perbaikan> = {};
  for (const id of prioritas) {
    const cara = urut.find((b) => b.id === id)!.cara;
    const maks = Math.max(...cara);
    if (maks > 0) perbaikan[id] = { cara: cara.indexOf(maks), usulan: "" };
  }
  return { isi, urut, nilai, prioritas, perbaikan };
}

function Angka({ nilai, label }: { nilai: number; label: string }) {
  return (
    <div className="bg-background px-4 py-5 md:px-7 md:py-7">
      <p className="font-serif text-4xl leading-none md:text-6xl">{angka.format(nilai)}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </div>
  );
}

function Hasil({ konten, data, webgl, warna }: { konten: KontenBangunHmi; data: HasilBersama; webgl: boolean; warna: (n: number) => string }) {
  const [sesudah, setSesudah] = useState(false);
  const { isi, urut, nilai, prioritas, perbaikan } = useMemo(() => ringkas(konten, data), [konten, data]);
  const nama = useMemo(() => Object.fromEntries(konten.bagian.map((b) => [b.id, b.nama])), [konten]);
  // Setelah diperbaiki, penanda bagian yang sudah dibangun ulang ikut berwarna Kokoh.
  const pin = useMemo<PinBagian[]>(
    () => prioritas.map((id, i) => ({ id, nomor: i + 1, label: nama[id] ?? id, warna: sesudah && perbaikan[id] ? warna(5) : nilai[id] ? warna(nilai[id]) : BELUM })),
    [prioritas, nama, nilai, perbaikan, sesudah, warna],
  );
  const bisaDiperbaiki = Object.keys(perbaikan).length > 0;
  const maks = Math.max(1, ...urut.map((b) => b.dipilihMendesak));

  return (
    <>
      <div className="mt-10 grid grid-cols-3 gap-px border border-border bg-border">
        <Angka nilai={data.jumlah} label="Masukan" />
        <Angka nilai={data.komisariat} label="Komisariat" />
        <Angka nilai={data.cabang} label="Cabang" />
      </div>
      <p className="mt-3 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Data ditarik {new Date(data.ditarik).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}. Ini masukan sukarela dari peserta kampanye, bukan potret seluruh HMI.
      </p>

      <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <figure className="lg:sticky lg:top-28">
          <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Tampilan bangunan">
            {[{ nilai: false, label: "Kondisi sekarang" }, ...(bisaDiperbaiki ? [{ nilai: true, label: "Setelah diperbaiki" }] : [])].map((t) => (
              <button
                key={t.label}
                type="button"
                aria-pressed={sesudah === t.nilai}
                onClick={() => setSesudah(t.nilai)}
                className={`border px-3.5 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${sesudah === t.nilai ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={latarBangunan}>
            <Bangunan
              webgl={webgl}
              nama={nama}
              nilai={nilai}
              prioritas={prioritas}
              perbaikan={sesudah ? perbaikan : {}}
              pin={pin}
              kelas="h-[360px] w-full sm:h-[460px] lg:h-[560px]"
            />
          </div>
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground" aria-label="Arti warna bagian bangunan">
            <li className="font-medium text-foreground">Kondisi bagian</li>
            {konten.skala.map((label, i) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: warna(i + 1) }} aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
          <figcaption className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {sesudah
              ? "Bangunan setelah tiga bagian teratas diperbaiki dengan cara yang paling banyak dipilih kader."
              : "Warna tiap bagian mengikuti rata-rata nilai kader. Tiga bagian yang paling sering dipilih mendesak dipasangi perancah dan diberi angka 1 sampai 3."}
            {" "}Geser untuk memutar bangunan.
          </figcaption>
        </figure>

        <div>
          <h3 className="font-serif text-2xl leading-snug md:text-3xl">Bagian yang paling mendesak</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Diurutkan dari yang paling sering dipilih kader sebagai mendesak. Tiga teratas berwarna hijau, sama dengan bagian yang berperancah di bangunan.
          </p>
          <ol className="mt-6 grid">
            {urut.map((b, i) => {
              const bagian = isi.get(b.id)!;
              const utama = i < 3 && b.dipilihMendesak > 0;
              const terbanyak = Math.max(...b.cara);
              const bulat = b.rataRata !== null ? Math.min(5, Math.max(1, Math.round(b.rataRata))) : null;
              return (
                <li key={b.id} className="group -mx-3 border-b border-border px-3 py-4 transition-colors last:border-0 hover:bg-primary/5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{bagian.nama}</p>
                  <div className="mt-1 flex items-baseline justify-between gap-4">
                    <span className="flex items-baseline gap-3">
                      <span className="w-4 shrink-0 font-serif text-sm text-muted-foreground">{i + 1}</span>
                      <span className="font-medium leading-snug">{huruf(bagian.sasaran)}</span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums">{b.dipilihMendesak}<span className="text-muted-foreground"> kali dipilih</span></span>
                  </div>
                  <span className="mt-2.5 block h-2 bg-muted">
                    <span
                      className={`block h-full rounded-r transition-colors ${utama ? "bg-primary" : "bg-muted-foreground/35 group-hover:bg-muted-foreground/55"}`}
                      style={{ width: `${(b.dipilihMendesak / maks) * 100}%` }}
                    />
                  </span>
                  <div className="mt-2.5 grid gap-1 pl-7 text-[13px] leading-relaxed text-muted-foreground">
                    <p className="inline-flex flex-wrap items-center gap-x-2">
                      <span>Kondisi rata-rata</span>
                      {bulat ? (
                        <span className="inline-flex items-center gap-1.5 text-foreground">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: warna(bulat) }} aria-hidden="true" />
                          {angka.format(b.rataRata!)} dari 5 ({konten.skala[bulat - 1]})
                        </span>
                      ) : <span>belum dinilai</span>}
                    </p>
                    <p>
                      {terbanyak > 0
                        ? <>Cara perbaikan terbanyak: <span className="text-foreground">{huruf(bagian.pilihan[b.cara.indexOf(terbanyak)])}</span></>
                        : b.dipilihMendesak > 0 ? "Belum ada yang memilih cara dari daftar." : "Belum ada kader yang memilih bagian ini."}
                      {b.usulan > 0 && ` · ${b.usulan} usulan sendiri`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}

export default function HasilBangun() {
  const { data: konten, error: galatKonten } = useQuery<KontenBangunHmi>({ queryKey: ["/api/konten/bangun-hmi"] });
  const { data, error, isLoading } = useQuery<HasilBersama>({ queryKey: ["/api/fitur/bangun-hmi/hasil"] });
  const { data: peserta } = useQuery<{ jumlah: number }>({ queryKey: ["/api/fitur/bangun-hmi/jumlah"] });
  const [webgl] = useState(adaWebgl);
  // Tanpa WebGL bangunan digambar dengan SVG yang punya jenjang warna hijau sendiri.
  const warna = useMemo(() => (webgl ? (n: number) => WARNA_NILAI[n - 1] : (n: number) => warnaNilai(n)), [webgl]);
  const namaBagian = useMemo(() => Object.fromEntries((konten?.bagian ?? []).map((b) => [b.id, b.nama])), [konten]);

  // Sebelum hasilnya dibuka, server menjawab 403 beserta waktu rilisnya.
  const terkunci = error instanceof Error && error.message.startsWith("403");

  let isi: ReactNode;
  if (terkunci) {
    isi = (
      <BelumAdaHasil
        webgl={webgl}
        nama={namaBagian}
        peserta={peserta?.jumlah}
        ikon={<p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary"><Lock className="h-4 w-4" /> Belum dibuka</p>}
        judul={`Hasil dibuka ${labelRilis("hasil-bangun-hmi")}`}
        uraian="Sampai hari itu masukan kader dikumpulkan dulu. Setelah dibuka, di sini terlihat bagian bangunan HMI yang paling mendesak menurut kader dari berbagai cabang."
      />
    );
  } else if (error || galatKonten) {
    isi = <p className="mt-10 text-muted-foreground">Hasil belum bisa dimuat. Coba muat ulang halaman ini.</p>;
  } else if (isLoading || !data || !konten) {
    isi = <p className="mt-10 text-muted-foreground">Memuat hasil…</p>;
  } else if (data.jumlah === 0) {
    isi = (
      <BelumAdaHasil
        webgl={webgl}
        nama={namaBagian}
        judul="Belum ada masukan"
        uraian="Belum ada kader yang selesai menilai bangunan ini. Jadilah yang pertama, dan lihat bangunannya mulai terbentuk."
      />
    );
  } else {
    isi = <Hasil konten={konten} data={data} webgl={webgl} warna={warna} />;
  }

  return (
    <section id="hasil" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10">
        <span className="eyebrow mb-5 block">Hasil Bangun HMI Bersama</span>
        <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Bangunan HMI menurut kader</h2>
        {isi}
      </div>
    </section>
  );
}
