import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InfoPersetujuan from "@/components/InfoPersetujuan";
import PilihCabang, { namaCabangDipilih } from "@/components/PilihCabang";

/**
 * Dua jalan agar suara kader sampai: menceritakan masalah komisariat (formulir
 * di /ikut) atau menulis langsung kepada Ahmad Zulfikar (formulir di sini).
 * Pesan dikirim ke /api/fitur/pesan-zulfikar dan hanya dibaca lewat panel admin.
 */

const PESAN_MIN = 10;
const PESAN_MAKS = 2000;
const kosong = { nama: "", komisariat: "", kontak: "", pesan: "" };

function FormPesan() {
  const [isian, setIsian] = useState(kosong);
  const [cabangPilihan, setCabangPilihan] = useState("");
  const [cabangLain, setCabangLain] = useState("");
  const [status, setStatus] = useState<"diam" | "mengirim" | "terkirim">("diam");
  const [galat, setGalat] = useState("");

  const ubah = (kunci: keyof typeof kosong) => (event: { target: { value: string } }) => setIsian((lama) => ({ ...lama, [kunci]: event.target.value }));
  const cabang = namaCabangDipilih(cabangPilihan, cabangLain);
  const panjangPesan = isian.pesan.trim().length;
  const siap = isian.nama.trim().length >= 2 && panjangPesan >= PESAN_MIN;

  // Setelah terkirim, formulir yang panjang berganti kotak ucapan yang pendek; bawa kotak itu ke layar.
  const kotakTerkirim = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status !== "terkirim") return;
    const diam = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    kotakTerkirim.current?.scrollIntoView({ block: "center", behavior: diam ? "auto" : "smooth" });
  }, [status]);

  const kirim = async (event: FormEvent) => {
    event.preventDefault();
    if (!siap || status === "mengirim") return;
    setGalat("");
    setStatus("mengirim");
    try {
      const res = await fetch("/api/fitur/pesan-zulfikar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: isian.nama.trim(),
          komisariat: isian.komisariat.trim() || undefined,
          cabang: cabang || undefined,
          kontak: isian.kontak.trim() || undefined,
          pesan: isian.pesan.trim(),
        }),
      });
      if (!res.ok) {
        const balasan = await res.json().catch(() => null);
        setGalat(typeof balasan?.message === "string" ? balasan.message : "Pesan belum terkirim. Coba lagi sebentar lagi.");
        setStatus("diam");
        return;
      }
      setIsian(kosong);
      setCabangPilihan("");
      setCabangLain("");
      setStatus("terkirim");
    } catch {
      setGalat("Pesan belum terkirim. Periksa sambunganmu, lalu coba lagi.");
      setStatus("diam");
    }
  };

  if (status === "terkirim") {
    return (
      <div ref={kotakTerkirim} className="border border-primary/40 bg-primary/5 p-6 md:p-8" role="status">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <h4 className="mt-4 font-serif text-2xl leading-snug">Terima kasih, pesanmu sudah terkirim.</h4>
        <p className="mt-3 text-muted-foreground">Pesanmu akan dibaca Ahmad Zulfikar dan tim. Kalau kamu mengisi kontak, balasan dikirim ke sana.</p>
        <button type="button" onClick={() => setStatus("diam")} className="mt-6 border border-border bg-background px-5 py-3 text-xs uppercase tracking-[0.14em] transition-colors hover:border-primary">
          Tulis pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={kirim} noValidate className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="bz-nama">Nama</Label>
        <Input id="bz-nama" value={isian.nama} onChange={ubah("nama")} maxLength={80} autoComplete="name" placeholder="Namamu" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <Label htmlFor="bz-komisariat">Komisariat <span className="font-normal text-muted-foreground">(boleh dikosongkan)</span></Label>
          <Input id="bz-komisariat" value={isian.komisariat} onChange={ubah("komisariat")} maxLength={120} placeholder="mis. Komisariat Hukum" />
        </div>
        <div className="grid content-start gap-2">
          <Label>Cabang <span className="font-normal text-muted-foreground">(boleh dikosongkan)</span></Label>
          <PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} />
          {cabangPilihan && (
            <button type="button" onClick={() => { setCabangPilihan(""); setCabangLain(""); }} className="justify-self-start text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
              Hapus pilihan cabang
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bz-kontak">WhatsApp atau email <span className="font-normal text-muted-foreground">(boleh dikosongkan)</span></Label>
        <Input id="bz-kontak" value={isian.kontak} onChange={ubah("kontak")} maxLength={120} autoComplete="email" placeholder="Kalau kamu ingin dibalas" />
        <p className="text-xs text-muted-foreground">Kontak hanya dipakai untuk membalas pesanmu.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bz-pesan">Pesanmu</Label>
        <Textarea
          id="bz-pesan"
          value={isian.pesan}
          onChange={ubah("pesan")}
          maxLength={PESAN_MAKS}
          rows={6}
          placeholder="Tulis pertanyaan, saran, atau kabar dari komisariat dan cabangmu."
        />
        <p className="text-xs text-muted-foreground">
          {panjangPesan < PESAN_MIN ? `Minimal ${PESAN_MIN} karakter (${panjangPesan}/${PESAN_MIN})` : `${isian.pesan.length}/${PESAN_MAKS}`}
        </p>
      </div>

      <InfoPersetujuan />

      {galat && <p className="text-sm text-destructive" role="alert">{galat}</p>}

      <div>
        <Button type="submit" size="lg" disabled={!siap || status === "mengirim"}>
          {status === "mengirim" ? "Mengirim…" : "Kirim pesan"}
        </Button>
      </div>
    </form>
  );
}

export default function BicaraZulfikar() {
  return (
    <section id="bicara" className="scroll-mt-20 border-t border-border bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-28">
            <span className="eyebrow mb-6 block">Suara kader</span>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Ada yang ingin kamu sampaikan?</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">Ada dua jalan agar suaramu sampai. Pilih yang paling pas dengan keperluanmu.</p>

            <Link href="/ikut#kirim-masalah" className="group mt-10 block border border-border bg-background p-6 transition-colors hover:border-primary md:p-7">
              <span className="font-serif text-3xl text-primary">01</span>
              <h3 className="mt-3 font-serif text-2xl leading-snug">Ceritakan komisariatmu</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ada masalah yang sedang dihadapi komisariat atau cabangmu? Tulis ceritanya di formulir singkat. Masalah nyata dari lapangan adalah bukti pertama untuk memperbaiki HMI.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Tulis ceritanya <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="border border-border bg-background p-6 md:p-9">
            <span className="font-serif text-3xl text-primary">02</span>
            <h3 className="mt-3 font-serif text-2xl leading-snug md:text-3xl">Bicara dengan Ahmad Zulfikar</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Punya pertanyaan, saran, atau kabar dari lapangan? Tulis langsung di sini. Pesanmu hanya dibaca Ahmad Zulfikar dan tim.
            </p>
            <div className="mt-8">
              <FormPesan />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
