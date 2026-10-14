import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, MessageSquareText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InfoPersetujuan from "@/components/InfoPersetujuan";
import { queryClient } from "@/lib/queryClient";

/** `komisariat` dan `cabang` hanya ada pada tanggapan lama; tanggapan baru tidak menanyakannya. */
type TanggapanPublik = { id: number; createdAt: string; komisariat: string; cabang: string; nama: string | null; isi: string };

const tanggalPendek = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

/** Penulis, wilayah (hanya bila ada pada tanggapan lama), dan tanggal. Tanpa nama berarti anonim. */
const keterangan = (item: TanggapanPublik) =>
  [
    item.nama || "Anonim",
    item.komisariat && `Komisariat ${item.komisariat.replace(/^komisariat\s+/i, "")}`,
    item.cabang && `Cabang ${item.cabang}`,
    tanggalPendek(item.createdAt),
  ].filter(Boolean).join(" · ");

/**
 * Kolom tanggapan di akhir setiap seri. Cukup tulis tanggapan; nama boleh
 * dikosongkan (anonim). Tanggapan baru tampil setelah dibaca moderator.
 */
export default function KolomTanggapan({ slug }: { slug: string }) {
  const kunci = [`/api/seri/${slug}/tanggapan`];
  const { data: daftar = [] } = useQuery<TanggapanPublik[]>({ queryKey: kunci });
  const [nama, setNama] = useState("");
  const [isi, setIsi] = useState("");
  const [kirim, setKirim] = useState<"diam" | "mengirim" | "terkirim" | "gagal">("diam");
  const [pesanGalat, setPesanGalat] = useState("");

  const kurang = isi.trim().length < 10 ? "Tulis tanggapan minimal 10 karakter." : "";

  const kirimTanggapan = async () => {
    setKirim("mengirim");
    setPesanGalat("");
    try {
      const res = await fetch(`/api/seri/${slug}/tanggapan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, isi }),
      });
      if (res.ok) {
        setKirim("terkirim");
        setIsi("");
        queryClient.invalidateQueries({ queryKey: kunci });
        return;
      }
      const balasan = await res.json().catch(() => null);
      setPesanGalat(typeof balasan?.message === "string" ? balasan.message : "");
      setKirim("gagal");
    } catch {
      setKirim("gagal");
    }
  };

  return (
    <section id="tanggapan" className="scroll-mt-24 border-t border-border pt-12">
      <p className="eyebrow text-primary">Tanggapan kader</p>
      <h2 className="mt-4 font-serif text-3xl leading-tight">Bagaimana tanggapanmu atas Series ini?</h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        Tanggapanmu menjadi bahan perbaikan ke depan. Tulis namamu, atau kosongkan bila ingin anonim.
      </p>

      {kirim === "terkirim" ? (
        <div className="mt-8 border border-primary/40 bg-primary/[0.04] p-5" role="status">
          <p className="inline-flex items-center gap-2 font-medium text-primary"><CheckCircle2 className="h-4 w-4" /> Terima kasih, tanggapanmu sudah diterima.</p>
          <p className="mt-1 text-sm text-muted-foreground">Tanggapan tampil di halaman ini setelah dibaca moderator.</p>
          <button type="button" onClick={() => setKirim("diam")} className="mt-3 text-sm text-primary underline-offset-4 hover:underline">Tulis tanggapan lain</button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          <Input value={nama} onChange={(e) => setNama(e.target.value)} maxLength={80} placeholder="Nama (kosongkan bila ingin anonim)" aria-label="Nama" />
          <div>
            <Textarea value={isi} onChange={(e) => setIsi(e.target.value)} maxLength={2000} rows={5} placeholder="Tulis tanggapan, pengalaman, atau koreksimu atas tulisan ini." aria-label="Tanggapan" />
            <p className="mt-1 text-right text-xs tabular-nums text-muted-foreground">{isi.length}/2000</p>
          </div>
          <InfoPersetujuan tambahan="Tanggapan tampil setelah dibaca moderator." />
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={kirimTanggapan} disabled={kirim === "mengirim" || kurang !== ""} className="bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60">
              {kirim === "mengirim" ? "Mengirim…" : "Kirim tanggapan"}
            </button>
            {kurang && <p className="text-sm text-muted-foreground">{kurang}</p>}
          </div>
          {kirim === "gagal" && <p className="text-sm text-destructive" role="alert">{pesanGalat || "Belum terkirim. Coba lagi sebentar lagi."}</p>}
        </div>
      )}

      {daftar.length > 0 && (
        <div className="mt-14">
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground"><MessageSquareText className="h-4 w-4" /> {daftar.length} tanggapan</p>
          <ol className="mt-5 grid gap-4">
            {daftar.map((item) => (
              <li key={item.id} className="border border-border bg-background p-5">
                <p className="whitespace-pre-line leading-relaxed">{item.isi}</p>
                <p className="mt-3 text-xs text-muted-foreground">{keterangan(item)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
