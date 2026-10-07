import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, MessageSquareText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PilihCabang, { namaCabangDipilih } from "@/components/PilihCabang";
import InfoPersetujuan from "@/components/InfoPersetujuan";
import { queryClient } from "@/lib/queryClient";

type TanggapanPublik = { id: number; createdAt: string; komisariat: string; cabang: string; nama: string | null; isi: string };

const tanggalPendek = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

/**
 * Kolom tanggapan di akhir setiap seri. Komisariat dan cabang wajib supaya
 * tanggapan bisa dibaca per wilayah; nama pribadi boleh kosong. Tanggapan baru
 * tampil setelah dibaca moderator.
 */
export default function KolomTanggapan({ slug }: { slug: string }) {
  const kunci = [`/api/seri/${slug}/tanggapan`];
  const { data: daftar = [] } = useQuery<TanggapanPublik[]>({ queryKey: kunci });
  const [komisariat, setKomisariat] = useState("");
  const [cabangPilihan, setCabangPilihan] = useState("");
  const [cabangLain, setCabangLain] = useState("");
  const [nama, setNama] = useState("");
  const [isi, setIsi] = useState("");
  const [kirim, setKirim] = useState<"diam" | "mengirim" | "terkirim" | "gagal">("diam");
  const [pesanGalat, setPesanGalat] = useState("");

  const cabang = namaCabangDipilih(cabangPilihan, cabangLain);
  const kurang = komisariat.trim().length < 2 || cabang.length < 2
    ? "Isi nama komisariat dan cabang."
    : isi.trim().length < 10
      ? "Tulis tanggapan minimal 10 karakter."
      : "";

  const kirimTanggapan = async () => {
    setKirim("mengirim");
    setPesanGalat("");
    try {
      const res = await fetch(`/api/seri/${slug}/tanggapan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ komisariat, cabang, nama, isi }),
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
      <h2 className="mt-4 font-serif text-3xl leading-tight">Bagaimana pengalaman di komisariat dan cabangmu?</h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        Tanggapanmu menjadi bahan perbaikan ke depan. Sebutkan komisariat dan cabangmu supaya suara setiap wilayah terbaca. Nama pribadi boleh dikosongkan.
      </p>

      {kirim === "terkirim" ? (
        <div className="mt-8 border border-primary/40 bg-primary/[0.04] p-5" role="status">
          <p className="inline-flex items-center gap-2 font-medium text-primary"><CheckCircle2 className="h-4 w-4" /> Terima kasih, tanggapanmu sudah diterima.</p>
          <p className="mt-1 text-sm text-muted-foreground">Tanggapan tampil di halaman ini setelah dibaca moderator.</p>
          <button type="button" onClick={() => setKirim("diam")} className="mt-3 text-sm text-primary underline-offset-4 hover:underline">Tulis tanggapan lain</button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input value={komisariat} onChange={(e) => setKomisariat(e.target.value)} maxLength={120} placeholder="Nama komisariat" aria-label="Nama komisariat" />
            <PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} />
          </div>
          <Input value={nama} onChange={(e) => setNama(e.target.value)} maxLength={80} placeholder="Nama (opsional)" aria-label="Nama" />
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
                <p className="mt-3 text-xs text-muted-foreground">
                  {item.nama ? `${item.nama} · ` : ""}Komisariat {item.komisariat.replace(/^komisariat\s+/i, "")} · Cabang {item.cabang} · {tanggalPendek(item.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
