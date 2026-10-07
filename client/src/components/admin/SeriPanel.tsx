import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExternalLink, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import { labelTerbit } from "@/pages/SeriesPage";
import type { Seri } from "@shared/schema";

type SeriAdmin = Seri & { rilis: number };
const KUNCI = "/api/admin/seri";

type Formulir = { judul: string; subjudul: string; penulis: string; ringkasan: string; isi: string; gambar: string; tautanMedia: string; namaMedia: string };

const keFormulir = (seri: SeriAdmin): Formulir => ({
  judul: seri.judul, subjudul: seri.subjudul ?? "", penulis: seri.penulis, ringkasan: seri.ringkasan ?? "", isi: seri.isi,
  gambar: seri.gambar ?? "", tautanMedia: seri.tautanMedia ?? "", namaMedia: seri.namaMedia ?? "",
});

/** Editor naskah empat seri. Jadwal terbit tetap mengikuti shared/rilis.ts. */
function EditorSeri({ seri }: { seri: SeriAdmin }) {
  const { toast } = useToast();
  const [form, setForm] = useState<Formulir>(() => keFormulir(seri));
  const [unggah, setUnggah] = useState(false);
  const ubah = (kolom: keyof Formulir) => (e: { target: { value: string } }) => setForm((lama) => ({ ...lama, [kolom]: e.target.value }));

  const simpan = useMutation({
    mutationFn: () => apiRequest("PUT", `${KUNCI}/${seri.slug}`, {
      ...form,
      subjudul: form.subjudul || null, ringkasan: form.ringkasan || null, gambar: form.gambar || null,
      tautanMedia: form.tautanMedia || null, namaMedia: form.namaMedia || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KUNCI] });
      queryClient.invalidateQueries({ queryKey: ["/api/seri"] });
      queryClient.invalidateQueries({ queryKey: [`/api/seri/${seri.slug}`] });
      toast({ title: "Tersimpan", description: `Naskah Series ${seri.nomor} diperbarui.` });
    },
    onError: (galat: Error) => toast({ title: "Gagal menyimpan", description: galat.message.replace(/^\d+: /, ""), variant: "destructive" }),
  });

  const unggahGambar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const berkas = e.target.files?.[0];
    if (!berkas) return;
    setUnggah(true);
    const data = new FormData();
    data.append("file", berkas);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const isi = await res.json();
      setForm((lama) => ({ ...lama, gambar: isi.url }));
    } catch {
      toast({ title: "Gagal", description: "Gagal mengunggah gambar", variant: "destructive" });
    }
    setUnggah(false);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Judul</Label><Input value={form.judul} onChange={ubah("judul")} /></div>
        <div><Label>Penulis</Label><Input value={form.penulis} onChange={ubah("penulis")} /></div>
      </div>
      <div><Label>Subjudul (opsional)</Label><Input value={form.subjudul} onChange={ubah("subjudul")} /></div>
      <div><Label>Ringkasan untuk daftar seri (opsional)</Label><Textarea rows={2} value={form.ringkasan} onChange={ubah("ringkasan")} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Tautan versi media (opsional)</Label><Input value={form.tautanMedia} onChange={ubah("tautanMedia")} placeholder="https://..." /></div>
        <div><Label>Nama media (opsional)</Label><Input value={form.namaMedia} onChange={ubah("namaMedia")} placeholder="Kompas" /></div>
      </div>
      <div>
        <Label>Gambar sampul (opsional)</Label>
        <Input type="file" accept="image/*" onChange={unggahGambar} />
        {unggah && <p className="mt-1 text-sm text-muted-foreground">Mengunggah…</p>}
        {form.gambar && (
          <div className="relative mt-2">
            <img src={form.gambar} alt="" className="h-40 w-full rounded object-cover" />
            <button type="button" onClick={() => setForm((lama) => ({ ...lama, gambar: "" }))} className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground" aria-label="Hapus gambar">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <div>
        <Label>Naskah</Label>
        <p className="mb-2 text-xs text-muted-foreground">Pakai Judul 2 untuk membagi tulisan menjadi bagian pendek. Untuk menyisipkan kotak ajakan kuis, tulis satu paragraf berisi <code>[[ajakan-kuis]]</code>; untuk Peta Suara Kader (mulai 28 Oktober), <code>[[peta-suara-kader]]</code>.</p>
        <RichTextEditor content={form.isi} onChange={(html) => setForm((lama) => ({ ...lama, isi: html }))} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => simpan.mutate()} disabled={simpan.isPending || form.judul.trim().length < 3}>{simpan.isPending ? "Menyimpan…" : "Simpan naskah"}</Button>
        <Link href={`/series/${seri.slug}`} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">Lihat halaman <ExternalLink className="h-3.5 w-3.5" /></Link>
      </div>
    </div>
  );
}

export default function SeriPanel() {
  const { data: daftar = [], isLoading } = useQuery<SeriAdmin[]>({ queryKey: [KUNCI] });
  const [dipilih, setDipilih] = useState<string | null>(null);
  const aktif = daftar.find((item) => item.slug === dipilih) ?? daftar[0];

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-serif text-2xl">Series</h2>
        <p className="text-sm text-muted-foreground">Setiap seri terbit otomatis pada jadwalnya bila naskah sudah diisi. Sebelum itu hanya admin yang bisa membuka halamannya.</p>
      </div>
      {isLoading && <p className="text-muted-foreground">Memuat…</p>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {daftar.map((item) => {
          const terbit = Date.now() >= item.rilis;
          return (
            <button key={item.slug} type="button" onClick={() => setDipilih(item.slug)} className="text-left">
              <Card className={aktif?.slug === item.slug ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-primary">Series {String(item.nomor).padStart(2, "0")}</p>
                  <p className="mt-1 font-serif text-lg leading-snug">{item.judul}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{terbit ? "Terbit" : "Terjadwal"} {labelTerbit(item.rilis)}</p>
                  {!item.isi.trim() && <p className="mt-1 text-xs text-destructive">Naskah belum diisi</p>}
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
      {aktif && <Card><CardContent className="p-5"><EditorSeri key={aktif.slug} seri={aktif} /></CardContent></Card>}
    </div>
  );
}
