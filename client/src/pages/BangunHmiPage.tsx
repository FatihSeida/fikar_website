import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Users } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import BangunanHmi from "@/components/BangunanHmi";
import TombolStory from "@/components/TombolStory";
import InfoPersetujuan from "@/components/InfoPersetujuan";
import PilihCabang, { namaCabangDipilih } from "@/components/PilihCabang";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { indikator } from "@/lib/indikator";
import { queryClient } from "@/lib/queryClient";
import { labelRilis, sudahRilis } from "@shared/rilis";
import type { KontenBangunHmi } from "../../../server/konten/bangunHmi";

type Bagian = KontenBangunHmi["bagian"][number];
type Perbaikan = { cara: number | null; usulan: string };
type Tahap = "pembuka" | "identitas" | "nilai" | "prioritas" | "perbaikan" | "selesai";
type HasilBersama = {
  jumlah: number; komisariat: number; cabang: number; ditarik: string;
  bagian: { id: string; rataRata: number | null; dipilihMendesak: number; cara: number[]; usulan: number }[];
};

const judulIndikator = new Map(indikator.map((item) => [item.nomor, item.teks]));

/** "Masukanku untuk PB: perbaiki Lantai dengan pendampingan 90 hari setelah LK 1" */
function kalimatMasukan(bagian: Bagian, perbaikan: Perbaikan) {
  return perbaikan.cara !== null
    ? `Perbaiki ${bagian.nama.toLowerCase()} dengan ${bagian.pilihan[perbaikan.cara]}.`
    : `Perbaiki ${bagian.nama.toLowerCase()}: ${perbaikan.usulan.trim()}`;
}

function Langkah({ nomor, judul }: { nomor: number; judul: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
      <span>Langkah {nomor} dari 4</span>
      <span>{judul}</span>
    </div>
  );
}

function HasilKader({ konten }: { konten: KontenBangunHmi }) {
  const { data } = useQuery<HasilBersama>({ queryKey: ["/api/fitur/bangun-hmi/hasil"] });
  if (!data) return null;
  const urut = [...data.bagian].sort((a, b) => b.dipilihMendesak - a.dipilihMendesak);
  const maks = Math.max(1, ...urut.map((b) => b.dipilihMendesak));
  const namaBagian = new Map(konten.bagian.map((b) => [b.id, b]));
  return (
    <section className="mt-16 border-t border-border pt-10">
      <p className="eyebrow text-primary">Hasil Bangun HMI Bersama</p>
      <h2 className="mt-3 font-serif text-3xl">Bagian yang paling mendesak menurut kader</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {data.jumlah} masukan dari {data.komisariat} komisariat di {data.cabang} cabang · data ditarik {new Date(data.ditarik).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}. Data sukarela dari peserta kampanye, bukan potret seluruh HMI.
      </p>
      <ol className="mt-8 grid gap-5">
        {urut.map((b) => {
          const isi = namaBagian.get(b.id)!;
          const caraTeratas = b.cara.indexOf(Math.max(...b.cara));
          return (
            <li key={b.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{isi.nama} <span className="font-normal text-muted-foreground">· {isi.tema}</span></span>
                <span className="tabular-nums text-muted-foreground">{b.dipilihMendesak} kali dipilih</span>
              </div>
              <span className="mt-1.5 block h-2 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary/80" style={{ width: `${(b.dipilihMendesak / maks) * 100}%` }} /></span>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Rata-rata kondisi {b.rataRata ?? "–"} dari 5{b.dipilihMendesak > 0 && Math.max(...b.cara) > 0 ? ` · cara perbaikan terbanyak: ${isi.pilihan[caraTeratas]}` : ""}{b.usulan > 0 ? ` · ${b.usulan} usulan sendiri` : ""}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function BangunHmiPage() {
  const { data: konten, isLoading, error } = useQuery<KontenBangunHmi>({ queryKey: ["/api/konten/bangun-hmi"] });
  const { data: peserta } = useQuery<{ jumlah: number }>({ queryKey: ["/api/fitur/bangun-hmi/jumlah"] });
  const [tahap, setTahap] = useState<Tahap>("pembuka");
  const [komisariat, setKomisariat] = useState("");
  const [cabangPilihan, setCabangPilihan] = useState("");
  const [cabangLain, setCabangLain] = useState("");
  const [nilai, setNilai] = useState<Record<string, number>>({});
  const [prioritas, setPrioritas] = useState<string[]>([]);
  const [perbaikan, setPerbaikan] = useState<Record<string, Perbaikan>>({});
  const [kirim, setKirim] = useState<"diam" | "mengirim" | "gagal">("diam");
  const [pesanGalat, setPesanGalat] = useState("");

  const cabang = namaCabangDipilih(cabangPilihan, cabangLain);
  const nama = useMemo(() => Object.fromEntries((konten?.bagian ?? []).map((b) => [b.id, b.nama])), [konten]);
  const keAtas = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const pindah = (baru: Tahap) => { setTahap(baru); keAtas(); };
  const hasilTerbuka = sudahRilis("hasil-bangun-hmi") || import.meta.env.DEV;

  const sorotKartu = (id: string) => document.getElementById(`bagian-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

  const kirimMasukan = async () => {
    if (!konten) return;
    setKirim("mengirim");
    setPesanGalat("");
    try {
      const res = await fetch("/api/fitur/bangun-hmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          komisariat: komisariat.trim(), cabang, nilai,
          prioritas: prioritas.map((id) => ({ bagian: id, cara: perbaikan[id]?.cara ?? null, usulan: perbaikan[id]?.cara === null ? perbaikan[id]?.usulan.trim() || null : null })),
        }),
      });
      if (res.ok) {
        // Jumlah peserta dan hasil bersama ikut diperbarui dengan masukan yang baru masuk.
        queryClient.invalidateQueries({ queryKey: ["/api/fitur/bangun-hmi/jumlah"] });
        queryClient.invalidateQueries({ queryKey: ["/api/fitur/bangun-hmi/hasil"] });
        setKirim("diam");
        pindah("selesai");
        return;
      }
      const balasan = await res.json().catch(() => null);
      setPesanGalat(typeof balasan?.message === "string" ? balasan.message : "");
      setKirim("gagal");
    } catch {
      setKirim("gagal");
    }
  };

  const tombolUtama = "inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50";
  const tombolKembali = "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="container mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-32 md:px-10 md:pt-40">
        {isLoading && <p className="text-muted-foreground">Menyiapkan bangunan…</p>}
        {error && <p className="text-muted-foreground">Halaman belum bisa dimuat. Coba muat ulang.</p>}

        {konten && tahap === "pembuka" && (
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <header>
              <span className="eyebrow mb-6 block">HMI Evidence · Menjadi pahlawan, bersama membangun HMI</span>
              <h1 className="font-serif text-4xl leading-tight md:text-6xl">{konten.judul}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{konten.pengantar}</p>
              <div className="mt-8 max-w-2xl border-l-2 border-primary pl-5">
                <p className="eyebrow text-primary">Fondasi yang tidak dinilai</p>
                <ul className="mt-3 grid gap-2 text-sm">
                  {konten.fondasi.map((f) => <li key={f.nama}><span className="font-medium">{f.nama}.</span> <span className="text-muted-foreground">{f.uraian}</span></li>)}
                </ul>
              </div>
              <p className="mt-8 text-sm text-muted-foreground">Nilai sebelas bagian bangunan, pilih tiga yang paling mendesak, lalu sampaikan cara perbaikannya. Waktu {konten.waktu}.</p>
              {peserta && peserta.jumlah > 0 && <p className="mt-3 inline-flex items-center gap-2 text-sm text-primary"><Users className="h-4 w-4" /> {peserta.jumlah} kader sudah ikut membangun</p>}
              <div className="mt-8"><button type="button" onClick={() => pindah("identitas")} className={tombolUtama}>Mulai membangun <ArrowRight className="h-4 w-4" /></button></div>
            </header>
            <BangunanHmi nilai={{}} nama={nama} className="w-full" />
          </div>
        )}

        {konten && tahap === "identitas" && (
          <section className="max-w-2xl">
            <Langkah nomor={1} judul="Komisariat dan cabang" />
            <h2 className="mt-8 font-serif text-3xl leading-snug md:text-4xl">Dari komisariat dan cabang mana kamu membangun?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Masukanmu digabung per cabang supaya terlihat bagian mana yang paling dirasakan di setiap wilayah.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Input value={komisariat} onChange={(e) => setKomisariat(e.target.value)} maxLength={120} placeholder="Nama komisariat" aria-label="Nama komisariat" />
              <PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} />
            </div>
            <InfoPersetujuan className="mt-5" />
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button type="button" disabled={komisariat.trim().length < 2 || cabang.length < 2} onClick={() => pindah("nilai")} className={tombolUtama}>Lanjut menilai <ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={() => pindah("pembuka")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
            </div>
          </section>
        )}

        {konten && tahap === "nilai" && (
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div className="sticky top-20 z-10 -mx-6 bg-background/95 px-6 pb-3 pt-2 backdrop-blur lg:top-28 lg:mx-0 lg:bg-transparent lg:p-0">
              <BangunanHmi nilai={nilai} nama={nama} onPilih={sorotKartu} className="mx-auto max-h-[30vh] w-full lg:max-h-none" />
              <p className="mt-2 text-center text-xs text-muted-foreground">{Object.keys(nilai).length} dari {konten.bagian.length} bagian dinilai · {konten.skala[0]} (1) sampai {konten.skala[4]} (5)</p>
            </div>
            <section>
              <Langkah nomor={2} judul="Nilai kondisi setiap bagian" />
              <h2 className="mt-8 font-serif text-3xl leading-snug">Seberapa kokoh setiap bagian HMI hari ini?</h2>
              <p className="mt-3 text-muted-foreground">Nilai dari pengalamanmu di komisariat dan cabang. Gambar bangunan berubah mengikuti penilaianmu.</p>
              <ol className="mt-8 grid gap-4">
                {konten.bagian.map((b) => (
                  <li key={b.id} id={`bagian-${b.id}`} className="scroll-mt-40 border border-border bg-background p-5">
                    <p className="font-serif text-xl">{b.nama}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{b.tema}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Indikator {b.indikator.map((n, i) => <span key={n}>{i > 0 && ", "}<Link href={`/indikator/${n}`} className="hover:text-primary hover:underline" title={judulIndikator.get(n)}>{n}</Link></span>)}
                    </p>
                    <div className="mt-4 grid grid-cols-5 gap-1.5" role="radiogroup" aria-label={`Nilai ${b.nama}`}>
                      {konten.skala.map((labelSkala, i) => (
                        <button key={labelSkala} type="button" role="radio" aria-checked={nilai[b.id] === i + 1} onClick={() => setNilai((lama) => ({ ...lama, [b.id]: i + 1 }))}
                          className={`border px-1 py-2 text-center transition-colors ${nilai[b.id] === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"}`}>
                          <span className="block font-serif text-lg leading-none">{i + 1}</span>
                          <span className="mt-1 block text-[10px] uppercase tracking-[0.08em] opacity-80">{labelSkala}</span>
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <button type="button" disabled={Object.keys(nilai).length < konten.bagian.length} onClick={() => pindah("prioritas")} className={tombolUtama}>Pilih tiga yang mendesak <ArrowRight className="h-4 w-4" /></button>
                <button type="button" onClick={() => pindah("identitas")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
              </div>
            </section>
          </div>
        )}

        {konten && tahap === "prioritas" && (
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <BangunanHmi nilai={nilai} nama={nama} sorot={prioritas} className="w-full max-w-md" />
            <section>
              <Langkah nomor={3} judul="Tiga bagian paling mendesak" />
              <h2 className="mt-8 font-serif text-3xl leading-snug">Bagian mana yang paling mendesak diperbaiki?</h2>
              <p className="mt-3 text-muted-foreground">Pilih tepat tiga. Bagian dengan nilai terendah ditampilkan lebih dulu.</p>
              <div className="mt-8 grid gap-2">
                {[...konten.bagian].sort((a, b) => nilai[a.id] - nilai[b.id]).map((b) => {
                  const dipilih = prioritas.includes(b.id);
                  const penuh = prioritas.length >= 3 && !dipilih;
                  return (
                    <button key={b.id} type="button" role="checkbox" aria-checked={dipilih} disabled={penuh}
                      onClick={() => setPrioritas((lama) => (dipilih ? lama.filter((id) => id !== b.id) : [...lama, b.id]))}
                      className={`flex items-center justify-between gap-4 border px-5 py-4 text-left transition-colors disabled:opacity-40 ${dipilih ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                      <span><span className="font-serif text-lg">{b.nama}</span><span className="block text-sm text-muted-foreground">{b.tema}</span></span>
                      <span className="shrink-0 text-sm text-muted-foreground">{konten.skala[nilai[b.id] - 1]} ({nilai[b.id]})</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <button type="button" disabled={prioritas.length !== 3} onClick={() => pindah("perbaikan")} className={tombolUtama}>Tentukan cara perbaikan <ArrowRight className="h-4 w-4" /></button>
                <button type="button" onClick={() => pindah("nilai")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
              </div>
            </section>
          </div>
        )}

        {konten && tahap === "perbaikan" && (
          <section className="max-w-3xl">
            <Langkah nomor={4} judul="Cara perbaikan" />
            <h2 className="mt-8 font-serif text-3xl leading-snug">Bagaimana sebaiknya ketiganya diperbaiki?</h2>
            <p className="mt-3 text-muted-foreground">Pilih satu cara untuk setiap bagian, atau tulis usulanmu sendiri.</p>
            <div className="mt-8 grid gap-6">
              {prioritas.map((id, urutan) => {
                const b = konten.bagian.find((x) => x.id === id)!;
                const isi = perbaikan[id];
                const atur = (baru: Perbaikan) => setPerbaikan((lama) => ({ ...lama, [id]: baru }));
                return (
                  <fieldset key={id} className="border border-border p-5">
                    <legend className="px-2 font-serif text-xl">{urutan + 1}. {b.nama}</legend>
                    <p className="text-sm text-muted-foreground">{b.tema}</p>
                    <div className="mt-4 grid gap-2" role="radiogroup" aria-label={`Cara memperbaiki ${b.nama}`}>
                      {b.pilihan.map((p, i) => (
                        <button key={p} type="button" role="radio" aria-checked={isi?.cara === i} onClick={() => atur({ cara: i, usulan: "" })}
                          className={`border px-4 py-3 text-left transition-colors ${isi?.cara === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                      <button type="button" role="radio" aria-checked={isi?.cara === null} onClick={() => atur({ cara: null, usulan: isi?.usulan ?? "" })}
                        className={`border px-4 py-3 text-left transition-colors ${isi?.cara === null ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                        Usulan sendiri
                      </button>
                      {isi?.cara === null && (
                        <Textarea value={isi.usulan} onChange={(e) => atur({ cara: null, usulan: e.target.value })} maxLength={500} rows={3} placeholder={`Tulis cara memperbaiki ${b.nama.toLowerCase()}`} aria-label={`Usulan untuk ${b.nama}`} />
                      )}
                    </div>
                  </fieldset>
                );
              })}
            </div>
            {kirim === "gagal" && <p className="mt-4 text-sm text-destructive" role="alert">{pesanGalat || "Belum terkirim. Coba lagi sebentar lagi."}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button type="button" onClick={kirimMasukan}
                disabled={kirim === "mengirim" || prioritas.some((id) => !perbaikan[id] || (perbaikan[id].cara === null && perbaikan[id].usulan.trim().length < 5))}
                className={tombolUtama}>
                {kirim === "mengirim" ? "Mengirim…" : "Kirim masukan untuk PB"} <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => pindah("prioritas")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
            </div>
          </section>
        )}

        {konten && tahap === "selesai" && (() => {
          const utama = konten.bagian.find((b) => b.id === prioritas[0])!;
          return (
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <section>
                <p className="inline-flex items-center gap-2 text-sm text-primary"><CheckCircle2 className="h-4 w-4" /> Masukanmu sudah diterima</p>
                <div className="mt-6 bg-[hsl(var(--evidence))] p-8 text-white md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--gold))]">Masukanku untuk PB</p>
                  <p className="evidence-shimmer mt-4 font-serif text-3xl leading-snug md:text-4xl">{kalimatMasukan(utama, perbaikan[utama.id])}</p>
                  <p className="mt-6 text-sm text-white/70">Komisariat {komisariat.trim().replace(/^komisariat\s+/i, "")} · Cabang {cabang}</p>
                </div>
                <ol className="mt-8 grid gap-3">
                  {prioritas.map((id, i) => {
                    const b = konten.bagian.find((x) => x.id === id)!;
                    return <li key={id} className="flex gap-3"><span className="font-serif text-xl text-primary">{i + 1}</span><span className="leading-relaxed">{kalimatMasukan(b, perbaikan[id])}</span></li>;
                  })}
                </ol>
                <TombolStory
                  className="mt-8"
                  namaFile="story-bangun-hmi-bersama.png"
                  isi={{ label: "Bangun HMI Bersama", judul: "Masukanku untuk PB", labelIsi: utama.nama, isi: kalimatMasukan(utama, perbaikan[utama.id]), catatan: "Ikut membangun HMI di ahmadzulfikar.com/bangun-hmi", tautan: "ahmadzulfikar.com/bangun-hmi" }}
                />
                <p className="mt-6 text-sm text-muted-foreground">
                  {hasilTerbuka ? "Hasil pilihan seluruh kader sudah dibuka di bawah." : `Hasil pilihan seluruh kader dibuka ${labelRilis("hasil-bangun-hmi")}. Sampai saat itu, halaman ini hanya menampilkan jumlah peserta.`}
                </p>
              </section>
              <BangunanHmi nilai={nilai} nama={nama} sorot={prioritas} className="w-full" />
            </div>
          );
        })()}

        {konten && hasilTerbuka && (tahap === "pembuka" || tahap === "selesai") && <HasilKader konten={konten} />}
      </main>
      <SiteFooter />
    </div>
  );
}
