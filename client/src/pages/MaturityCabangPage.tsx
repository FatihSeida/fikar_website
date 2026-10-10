import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileSpreadsheet, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import InfoPersetujuan from "@/components/InfoPersetujuan";
import PilihCabang, { namaCabangDipilih } from "@/components/PilihCabang";
import { Input } from "@/components/ui/input";
import type { KontenMaturityCabang } from "../../../server/konten/maturityCabang";

type Tahap = "pembuka" | "nilai" | "profil" | "tradisi" | "selesai";
type Prioritas = { dimensi: string; target: number };

/** Tangga empat tingkat: tingkat sekarang terisi hijau, target bergaris emas. */
function Tangga({ tingkat, target }: { tingkat: number; target?: number }) {
  return (
    <span className="grid grid-cols-4 gap-1" aria-hidden="true">
      {[1, 2, 3, 4].map((t) => (
        <span key={t} className={`h-2.5 rounded-sm ${t <= tingkat ? "bg-primary" : target && t <= target ? "border-2 border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/15" : "bg-muted"}`} />
      ))}
    </span>
  );
}

function Langkah({ nomor, judul }: { nomor: number; judul: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
      <span>Langkah {nomor} dari 3</span>
      <span>{judul}</span>
    </div>
  );
}

export default function MaturityCabangPage() {
  const { data: konten, isLoading, error } = useQuery<KontenMaturityCabang>({ queryKey: ["/api/konten/maturity-cabang"] });
  const [tahap, setTahap] = useState<Tahap>("pembuka");
  const [cabangPilihan, setCabangPilihan] = useState("");
  const [cabangLain, setCabangLain] = useState("");
  const [tingkat, setTingkat] = useState<Record<string, number>>({});
  const [prioritas, setPrioritas] = useState<Prioritas[]>([]);
  const [tradisi, setTradisi] = useState<Record<string, string>>({});
  const [kirim, setKirim] = useState<"diam" | "mengirim" | "gagal">("diam");
  const [pesanGalat, setPesanGalat] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [kontak, setKontak] = useState("");
  const [komitmen, setKomitmen] = useState<"diam" | "mengirim" | "terkirim" | "gagal">("diam");

  const cabang = namaCabangDipilih(cabangPilihan, cabangLain);
  const keAtas = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const pindah = (baru: Tahap) => { setTahap(baru); keAtas(); };
  const tombolUtama = "inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50";
  const tombolKembali = "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary";

  const rataRata = konten ? Object.values(tingkat).reduce((a, b) => a + b, 0) / konten.dimensi.length : 0;
  const tingkatProfil = konten ? konten.tingkat[Math.min(3, Math.max(0, Math.round(rataRata) - 1))] : "";

  const aturPrioritas = (dimensi: string) => setPrioritas((lama) => {
    if (lama.some((p) => p.dimensi === dimensi)) return lama.filter((p) => p.dimensi !== dimensi);
    if (lama.length >= 2) return lama;
    return [...lama, { dimensi, target: Math.min(4, (tingkat[dimensi] ?? 1) + 1) }];
  });

  const kirimProfil = async () => {
    setKirim("mengirim");
    setPesanGalat("");
    try {
      const res = await fetch("/api/fitur/maturity-cabang", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cabang, tingkat, prioritas, tradisi }) });
      if (res.ok) { setKirim("diam"); pindah("selesai"); return; }
      const balasan = await res.json().catch(() => null);
      setPesanGalat(typeof balasan?.message === "string" ? balasan.message : "");
      setKirim("gagal");
    } catch {
      setKirim("gagal");
    }
  };

  const kirimKomitmen = async () => {
    setKomitmen("mengirim");
    try {
      const res = await fetch("/api/fitur/maturity-komitmen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cabang, nama, jabatan, kontak }) });
      setKomitmen(res.ok ? "terkirim" : "gagal");
    } catch {
      setKomitmen("gagal");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="container mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-32 md:px-10 md:pt-40">
        {isLoading && <p className="text-muted-foreground">Menyiapkan penilaian…</p>}
        {error && <p className="text-muted-foreground">Halaman belum bisa dimuat. Coba muat ulang.</p>}

        {konten && tahap === "pembuka" && (
          <header>
            <span className="eyebrow mb-6 block">HMI Evidence · Untuk pengurus cabang</span>
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">{konten.judul}</h1>
            <p className="mt-6 font-serif text-2xl leading-snug">{konten.pembuka}</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{konten.pengantar}</p>
            <ol className="mt-8 grid max-w-2xl gap-px border border-border bg-border sm:grid-cols-4">
              {konten.tingkat.map((t, i) => (
                <li key={t} className="bg-background p-4"><span className="font-serif text-2xl text-primary">{i + 1}</span><span className="mt-1 block text-sm leading-snug">{t}</span></li>
              ))}
            </ol>
            <p className="mt-10 font-medium">Cabang mana yang kamu nilai?</p>
            <div className="mt-3 max-w-md"><PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} /></div>
            <InfoPersetujuan className="mt-4 max-w-2xl" />
            <div className="mt-8"><button type="button" disabled={cabang.length < 2} onClick={() => pindah("nilai")} className={tombolUtama}>Mulai menilai cabang <ArrowRight className="h-4 w-4" /></button></div>
          </header>
        )}

        {konten && tahap === "nilai" && (
          <section>
            <Langkah nomor={1} judul="Penilaian diri" />
            <h2 className="mt-8 font-serif text-3xl leading-snug md:text-4xl">Di tingkat mana cabang {cabang} hari ini?</h2>
            <p className="mt-3 text-muted-foreground">Untuk setiap dimensi, pilih keadaan yang paling sesuai dengan kenyataan sekarang, bukan yang diharapkan.</p>
            <div className="mt-8 grid gap-6">
              {konten.dimensi.map((d, urutan) => (
                <fieldset key={d.id} className="border border-border p-5">
                  <legend className="px-2 font-serif text-xl">{urutan + 1}. {d.nama}</legend>
                  <div className="mt-2 grid gap-2" role="radiogroup" aria-label={d.nama}>
                    {d.tingkat.map((uraian, i) => (
                      <button key={i} type="button" role="radio" aria-checked={tingkat[d.id] === i + 1} onClick={() => setTingkat((lama) => ({ ...lama, [d.id]: i + 1 }))}
                        className={`grid grid-cols-[auto_minmax(0,1fr)] gap-4 border px-4 py-3 text-left transition-colors ${tingkat[d.id] === i + 1 ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                        <span className="font-serif text-xl text-primary">{i + 1}</span>
                        <span><span className="block text-xs uppercase tracking-[0.12em] text-muted-foreground">{konten.tingkat[i]}</span><span className="mt-1 block leading-snug">{uraian}</span></span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button type="button" disabled={Object.keys(tingkat).length < konten.dimensi.length} onClick={() => pindah("profil")} className={tombolUtama}>Lihat profil cabang <ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={() => pindah("pembuka")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
            </div>
          </section>
        )}

        {konten && tahap === "profil" && (
          <section>
            <Langkah nomor={2} judul="Profil dan prioritas" />
            <h2 className="mt-8 font-serif text-3xl leading-snug md:text-4xl">Profil cabang {cabang}</h2>
            <p className="mt-3 text-muted-foreground">Secara umum cabangmu berada di sekitar tingkat <span className="font-medium text-foreground">{tingkatProfil}</span>. Pilih satu atau dua dimensi yang ingin dinaikkan, lalu tentukan targetnya.</p>
            <ol className="mt-8 grid gap-3">
              {konten.dimensi.map((d) => {
                const p = prioritas.find((x) => x.dimensi === d.id);
                const sekarang = tingkat[d.id];
                const penuh = prioritas.length >= 2 && !p;
                return (
                  <li key={d.id} className={`border p-5 transition-colors ${p ? "border-primary bg-primary/[0.04]" : "border-border"}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg">{d.nama}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Sekarang: {konten.tingkat[sekarang - 1]}</p>
                      </div>
                      <button type="button" role="checkbox" aria-checked={!!p} disabled={penuh || sekarang === 4} onClick={() => aturPrioritas(d.id)}
                        className={`border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors disabled:opacity-40 ${p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                        {sekarang === 4 ? "Sudah tertinggi" : p ? "Prioritas" : "Jadikan prioritas"}
                      </button>
                    </div>
                    <div className="mt-3 max-w-sm"><Tangga tingkat={sekarang} target={p?.target} /></div>
                    {p && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Target:</span>
                        {[2, 3, 4].filter((t) => t > sekarang).map((t) => (
                          <button key={t} type="button" onClick={() => setPrioritas((lama) => lama.map((x) => (x.dimensi === d.id ? { ...x, target: t } : x)))}
                            className={`border px-3 py-1.5 transition-colors ${p.target === t ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/15" : "border-border hover:border-[hsl(var(--gold))]"}`}>
                            {t}. {konten.tingkat[t - 1]}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button type="button" disabled={prioritas.length === 0} onClick={() => pindah("tradisi")} className={tombolUtama}>Lanjut <ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={() => pindah("nilai")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
            </div>
          </section>
        )}

        {konten && tahap === "tradisi" && (
          <section>
            <Langkah nomor={3} judul="Tradisi baik yang hilang" />
            <h2 className="mt-8 font-serif text-3xl leading-snug md:text-4xl">Tradisi baik yang dulu ada di HMI</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Kritik tidak boleh menjadi vonis untuk seluruh HMI. Karena itu setiap tradisi ditanyakan kembali: masih hidup di cabangmu, sudah hilang, atau kamu tidak tahu?</p>
            <div className="mt-8 grid gap-4">
              {konten.tradisi.map((t) => (
                <article key={t.id} className="border border-border p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t.rujukan}</p>
                  <h3 className="mt-1 font-serif text-xl">{t.judul}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{t.cerita}</p>
                  <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label={t.judul}>
                    {konten.jawabanTradisi.map((j) => (
                      <button key={j.id} type="button" role="radio" aria-checked={tradisi[t.id] === j.id} onClick={() => setTradisi((lama) => ({ ...lama, [t.id]: j.id }))}
                        className={`border px-4 py-2 text-sm transition-colors ${tradisi[t.id] === j.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"}`}>
                        {j.label}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {kirim === "gagal" && <p className="mt-4 text-sm text-destructive" role="alert">{pesanGalat || "Belum terkirim. Coba lagi sebentar lagi."}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button type="button" disabled={Object.keys(tradisi).length < konten.tradisi.length || kirim === "mengirim"} onClick={kirimProfil} className={tombolUtama}>
                {kirim === "mengirim" ? "Menyimpan…" : "Simpan profil cabang"} <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => pindah("profil")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
            </div>
          </section>
        )}

        {konten && tahap === "selesai" && (
          <div>
            <p className="inline-flex items-center gap-2 text-sm text-primary"><CheckCircle2 className="h-4 w-4" /> Profil cabang {cabang} tersimpan</p>
            <h2 className="mt-4 font-serif text-3xl leading-snug md:text-4xl">Mulai naikkan tingkatnya</h2>
            <ul className="mt-6 grid gap-3">
              {prioritas.map((p) => {
                const d = konten.dimensi.find((x) => x.id === p.dimensi)!;
                return (
                  <li key={p.dimensi} className="border border-border p-5">
                    <p className="font-serif text-lg">{d.nama}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Dari {konten.tingkat[tingkat[p.dimensi] - 1]} menuju {konten.tingkat[p.target - 1]}</p>
                    <p className="mt-2 leading-relaxed">Target: {d.tingkat[p.target - 1]}</p>
                    <div className="mt-3 max-w-sm"><Tangga tingkat={tingkat[p.dimensi]} target={p.target} /></div>
                  </li>
                );
              })}
            </ul>

            <section className="mt-14 border-t border-border pt-10">
              <p className="eyebrow">Panduan dan templat</p>
              <h3 className="mt-3 font-serif text-2xl">Unduh perlengkapan untuk pengurus cabang</h3>
              <div className="mt-6 grid gap-3">
                {konten.unduhan.map((u) => (
                  <a key={u.berkas} href={`/api/unduhan/maturity/${u.berkas}?cabang=${encodeURIComponent(cabang)}`} download
                    className="group flex items-start gap-4 border border-border p-5 transition-colors hover:border-primary hover:bg-primary/5">
                    {u.format === "Excel" ? <FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> : <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />}
                    <span className="flex-1"><span className="block font-medium">{u.judul}</span><span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{u.uraian}</span></span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-primary"><Download className="h-4 w-4" /> {u.format}</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-14 bg-[hsl(var(--evidence))] p-8 text-white md:p-10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--gold))]">Komitmen cabang</p>
              <h3 className="mt-3 font-serif text-3xl">Saya akan implementasikan di cabang</h3>
              {komitmen === "terkirim" ? (
                <p className="mt-5 flex items-start gap-2 text-[hsl(var(--gold))]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0" /> Terima kasih. Komitmen cabang {cabang} tercatat, dan tim akan menghubungi untuk mendampingi.</p>
              ) : (
                <>
                  <p className="mt-3 max-w-xl leading-relaxed text-white/75">Isi nama, jabatan, dan kontakmu. Tim HMI Evidence akan menghubungi untuk mendampingi uji coba di cabangmu.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <Input value={nama} onChange={(e) => setNama(e.target.value)} maxLength={80} placeholder="Nama" aria-label="Nama" className="border-white/25 bg-white/10 text-white placeholder:text-white/50" />
                    <Input value={jabatan} onChange={(e) => setJabatan(e.target.value)} maxLength={80} placeholder="Jabatan di cabang" aria-label="Jabatan" className="border-white/25 bg-white/10 text-white placeholder:text-white/50" />
                    <Input value={kontak} onChange={(e) => setKontak(e.target.value)} maxLength={120} placeholder="WhatsApp atau email" aria-label="Kontak" className="border-white/25 bg-white/10 text-white placeholder:text-white/50" />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-white/60">Dengan mengirim, kamu setuju kiriman ini disimpan dan dibaca tim HMI Evidence untuk memahami kondisi akar rumput dan dijadikan bahan analisis ke depan. Kontak hanya dipakai untuk menindaklanjuti komitmen ini dan tidak dibagikan.</p>
                  <button type="button" onClick={kirimKomitmen} disabled={komitmen === "mengirim" || nama.trim().length < 2 || jabatan.trim().length < 2 || kontak.trim().length < 5}
                    className="mt-6 inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--evidence))] disabled:opacity-50">
                    {komitmen === "mengirim" ? "Mengirim…" : "Saya akan implementasikan di cabang"}
                  </button>
                  {komitmen === "gagal" && <p className="mt-3 text-sm text-red-300" role="alert">Belum terkirim. Coba lagi sebentar lagi.</p>}
                </>
              )}
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
