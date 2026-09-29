import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AjakDukung from "@/components/AjakDukung";
import { caraIkut } from "@/lib/pesan";
import { kelompokIndikator } from "@/lib/indikator";

const kosong = { cabang: "", komisariat: "", kelompok: "", masalah: "", nama: "", kontak: "", situs: "" };

function FormMasalah() {
  const [isian, setIsian] = useState(kosong);
  const [bolehDikutip, setBolehDikutip] = useState(false);
  const [persetujuan, setPersetujuan] = useState(false);
  const [status, setStatus] = useState<"diam" | "mengirim" | "terkirim">("diam");
  const [galat, setGalat] = useState("");

  const ubah = (kunci: keyof typeof kosong) => (event: { target: { value: string } }) => setIsian((lama) => ({ ...lama, [kunci]: event.target.value }));

  const kirim = async (event: FormEvent) => {
    event.preventDefault();
    setGalat("");
    setStatus("mengirim");
    try {
      const res = await fetch("/api/masalah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...isian, kelompok: isian.kelompok || null, bolehDikutip, persetujuan }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Kiriman belum berhasil. Coba lagi sebentar lagi.");
      }
      setStatus("terkirim");
      setIsian(kosong);
      setBolehDikutip(false);
      setPersetujuan(false);
    } catch (error) {
      setGalat(error instanceof Error ? error.message : "Kiriman belum berhasil.");
      setStatus("diam");
    }
  };

  if (status === "terkirim") {
    return (
      <div className="border border-primary/40 bg-primary/5 p-8" role="status">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <h3 className="mt-4 font-serif text-2xl">Terima kasih, masalahmu sudah kami terima.</h3>
        <p className="mt-3 max-w-xl text-muted-foreground">Setiap kiriman dibaca tim dan menjadi bahan untuk memahami keadaan HMI dari komisariat. Sambil menunggu, coba ukur komisariatmu lewat kuis.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/kuis" className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground">Ikuti kuis <ArrowRight className="h-4 w-4" /></Link>
          <button type="button" onClick={() => setStatus("diam")} className="border border-border px-5 py-3 text-xs uppercase tracking-[0.14em]">Kirim masalah lain</button>
        </div>
        <AjakDukung
          className="mt-8 bg-background"
          uraian="Ajak kader dan komisariat lain ikut menceritakan masalahnya atau mengukur komisariatnya lewat kuis audit."
          path="/ikut"
          pesan="Aku baru mengirim masalah komisariat untuk perbaikan HMI. Seberapa Evidence Komisariatmu? Kirim masalah atau ikuti kuis audit komisariat, dan dukung Transformasi Gerakan Organisasi Berbasis Bukti."
          namaFile="story-audit-komisariat.png"
          story={{
            label: "Audit komisariat",
            judul: "Seberapa Evidence Komisariatmu?",
            isi: "Kirim masalah komisariatmu atau ikuti kuis audit untuk perbaiki tata kelola organisasi yang lebih baik.",
            tautan: "ahmadzulfikar.com/ikut",
          }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={kirim} className="grid gap-6" noValidate={false}>
      {/* Kolom jebakan: disembunyikan dari manusia, biasanya diisi bot. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Situs web <input tabIndex={-1} autoComplete="off" value={isian.situs} onChange={ubah("situs")} /></label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cabang">Cabang</Label>
          <Input id="cabang" required minLength={2} maxLength={80} value={isian.cabang} onChange={ubah("cabang")} placeholder="mis. Gowa Raya" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="komisariat">Komisariat</Label>
          <Input id="komisariat" required minLength={2} maxLength={120} value={isian.komisariat} onChange={ubah("komisariat")} placeholder="mis. Komisariat Syariah dan Hukum" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="kelompok">Masalahnya paling dekat dengan <span className="text-muted-foreground">(opsional)</span></Label>
        <select
          id="kelompok"
          value={isian.kelompok}
          onChange={ubah("kelompok")}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Belum tahu</option>
          {kelompokIndikator.map((kelompok) => <option key={kelompok.id} value={kelompok.id}>{kelompok.judul}: {kelompok.sorotan}</option>)}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="masalah">Ceritakan masalahnya</Label>
        <Textarea
          id="masalah"
          required
          minLength={20}
          maxLength={3000}
          rows={7}
          value={isian.masalah}
          onChange={ubah("masalah")}
          placeholder="Apa yang terjadi, sejak kapan, siapa yang terdampak, dan apa yang sudah dicoba?"
        />
        <p className="text-xs text-muted-foreground">{isian.masalah.trim().length < 20 ? `Minimal 20 karakter (${isian.masalah.trim().length}/20)` : `${isian.masalah.length}/3000`}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="nama">Nama <span className="text-muted-foreground">(opsional)</span></Label>
          <Input id="nama" maxLength={80} value={isian.nama} onChange={ubah("nama")} autoComplete="name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="kontak">WhatsApp atau email <span className="text-muted-foreground">(opsional)</span></Label>
          <Input id="kontak" maxLength={120} value={isian.kontak} onChange={ubah("kontak")} placeholder="Kalau ingin kami hubungi" />
        </div>
      </div>

      <div className="grid gap-3 text-sm">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" checked={bolehDikutip} onChange={(e) => setBolehDikutip(e.target.checked)} />
          <span>Masalah ini boleh dikutip tanpa menyebut nama dan komisariat.</span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" required className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" checked={persetujuan} onChange={(e) => setPersetujuan(e.target.checked)} />
          <span>Saya setuju data ini disimpan dan dibaca tim HMI Evidence untuk memahami masalah komisariat. Kontak hanya dipakai untuk menindaklanjuti kiriman ini dan tidak dibagikan.</span>
        </label>
      </div>

      {galat && <p className="text-sm text-destructive" role="alert">{galat}</p>}

      <div>
        <Button type="submit" size="lg" disabled={status === "mengirim" || !persetujuan || isian.masalah.trim().length < 20}>
          {status === "mengirim" ? "Mengirim…" : "Kirim masalah"}
        </Button>
      </div>
    </form>
  );
}

export default function IkutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main>
        <section className="container mx-auto px-6 pb-20 pt-32 md:px-10 md:pt-40">
          <span className="eyebrow mb-6 block">Audit Komisariat</span>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Seberapa Evidence Komisariatmu?</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Satu paket untuk komisariatmu: ukur kebiasaannya lewat kuis audit, atau ceritakan masalah yang sedang dihadapi. Keduanya menjadi bukti untuk memperbaiki HMI, dan bisa dilakukan hari ini dari HP.</p>

          <ol className="mt-14 grid gap-px border border-border bg-border md:grid-cols-3">
            {caraIkut.map((langkah, index) => (
              <li key={langkah.href} className="bg-background">
                <Link href={langkah.href} className="group flex h-full flex-col p-7 transition-colors hover:bg-primary/5">
                  <span className="font-serif text-3xl text-primary">0{index + 1}</span>
                  <h2 className="mt-4 font-serif text-2xl">{langkah.judul}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{langkah.uraian}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">Mulai <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="kirim-masalah" className="scroll-mt-24 border-t border-border py-24 md:py-32">
          <div className="container mx-auto grid gap-12 px-6 md:grid-cols-12 md:px-10">
            <div className="md:col-span-4">
              <span className="eyebrow text-primary">Kirim Masalah Komisariatmu</span>
              <h2 className="mt-5 font-serif text-3xl leading-tight md:text-4xl">Masalah nyata dari komisariat adalah bukti pertama.</h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">HMI Evidence dimulai dari mengenali masalah sebelum menyusun program. Ceritakan satu masalah yang sedang dihadapi komisariat atau cabangmu. Nama dan kontak tidak wajib.</p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Kiriman hanya bisa dibaca tim melalui panel admin. Masalah hanya dikutip tanpa nama, dan hanya bila kamu mengizinkannya.</p>
            </div>
            <div className="relative md:col-span-8">
              <FormMasalah />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
