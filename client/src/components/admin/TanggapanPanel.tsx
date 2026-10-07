import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Download, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Seri, Tanggapan } from "@shared/schema";

const KUNCI = "/api/admin/tanggapan";
const labelStatus: Record<string, string> = { baru: "Belum dibaca", tampil: "Ditampilkan", ditolak: "Tidak ditampilkan" };

const waktu = (nilai: string | Date) =>
  new Date(nilai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function unduhCsv(data: Tanggapan[], judulSeri: Map<string, string>) {
  const sel = (nilai: unknown) => `"${String(nilai ?? "").replace(/"/g, '""')}"`;
  const baris = [
    ["Waktu", "Seri", "Komisariat", "Cabang", "Nama", "Kota", "Provinsi", "Status", "Tanggapan"],
    ...data.map((t) => [waktu(t.createdAt), judulSeri.get(t.seriSlug) ?? t.seriSlug, t.komisariat, t.cabang, t.nama, t.kota, t.provinsi, labelStatus[t.status] ?? t.status, t.isi]),
  ];
  const blob = new Blob([`﻿${baris.map((kolom) => kolom.map(sel).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
  const tautan = document.createElement("a");
  tautan.href = URL.createObjectURL(blob);
  tautan.download = `tanggapan-series-${new Date().toISOString().slice(0, 10)}.csv`;
  tautan.click();
  URL.revokeObjectURL(tautan.href);
}

/** Moderasi tanggapan kader atas Series: hanya yang ditampilkan muncul di halaman seri. */
export default function TanggapanPanel() {
  const { data = [], isLoading } = useQuery<Tanggapan[]>({ queryKey: [KUNCI] });
  const { data: daftarSeri = [] } = useQuery<Seri[]>({ queryKey: ["/api/admin/seri"] });
  const [seri, setSeri] = useState("semua");
  const [status, setStatus] = useState("baru");
  const judulSeri = new Map(daftarSeri.map((item) => [item.slug, `Series ${item.nomor}: ${item.judul}`]));

  const segarkan = () => queryClient.invalidateQueries({ queryKey: [KUNCI] });
  const ubahStatus = useMutation({ mutationFn: ({ id, status: baru }: { id: number; status: string }) => apiRequest("PATCH", `${KUNCI}/${id}`, { status: baru }), onSuccess: segarkan });
  const hapus = useMutation({ mutationFn: (id: number) => apiRequest("DELETE", `${KUNCI}/${id}`), onSuccess: segarkan });

  const tersaring = data.filter((t) => (seri === "semua" || t.seriSlug === seri) && (status === "semua" || t.status === status));
  const jumlah = (s: string) => data.filter((t) => (seri === "semua" || t.seriSlug === seri) && t.status === s).length;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Tanggapan Series</h2>
          <p className="text-sm text-muted-foreground">Baca setiap tanggapan, lalu pilih ditampilkan atau tidak. Hanya yang ditampilkan muncul di halaman seri.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={seri} onChange={(e) => setSeri(e.target.value)} aria-label="Saring seri" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="semua">Semua seri</option>
            {daftarSeri.map((item) => <option key={item.slug} value={item.slug}>{`Series ${item.nomor}: ${item.judul}`}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={() => unduhCsv(tersaring, judulSeri)} disabled={!tersaring.length}>
            <Download className="mr-2 h-4 w-4" /> Unduh CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Saring status">
        {(["baru", "tampil", "ditolak", "semua"] as const).map((s) => (
          <button key={s} type="button" role="tab" aria-selected={status === s} onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-sm ${status === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
            {s === "semua" ? `Semua (${data.filter((t) => seri === "semua" || t.seriSlug === seri).length})` : `${labelStatus[s]} (${jumlah(s)})`}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat tanggapan…</p>}
      {!isLoading && tersaring.length === 0 && <p className="text-muted-foreground">Tidak ada tanggapan di sini.</p>}

      <div className="grid gap-3">
        {tersaring.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.12em] text-primary">{judulSeri.get(t.seriSlug) ?? t.seriSlug}</p>
                <span className="text-xs text-muted-foreground">{labelStatus[t.status] ?? t.status} · {waktu(t.createdAt)}</span>
              </div>
              <p className="mt-3 whitespace-pre-line leading-relaxed">{t.isi}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {t.nama ? `${t.nama} · ` : ""}{t.komisariat} · Cabang {t.cabang}{t.kota ? ` · dikirim dari ${t.kota}` : ""}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.status !== "tampil" && <Button size="sm" onClick={() => ubahStatus.mutate({ id: t.id, status: "tampil" })}>Tampilkan</Button>}
                {t.status !== "ditolak" && <Button size="sm" variant="outline" onClick={() => ubahStatus.mutate({ id: t.id, status: "ditolak" })}>Jangan tampilkan</Button>}
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (window.confirm("Hapus tanggapan ini secara permanen?")) hapus.mutate(t.id); }}>
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
