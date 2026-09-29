import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Trash2, Download } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { kelompokIndikator } from "@/lib/indikator";
import type { MasalahKomisariat } from "@shared/schema";

const KUNCI = "/api/admin/masalah";
const labelStatus: Record<string, string> = { baru: "Baru", dibaca: "Dibaca", ditindaklanjuti: "Ditindaklanjuti" };
const labelKelompok = new Map(kelompokIndikator.map((kelompok) => [kelompok.id as string, kelompok.judul]));

function waktu(nilai: string | Date) {
  return new Date(nilai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function unduhCsv(data: MasalahKomisariat[]) {
  const sel = (nilai: unknown) => `"${String(nilai ?? "").replace(/"/g, '""')}"`;
  const baris = [
    ["Waktu", "Cabang", "Komisariat", "Kelompok", "Masalah", "Nama", "Kontak", "Boleh dikutip", "Status", "Sumber"],
    ...data.map((item) => [waktu(item.createdAt), item.cabang, item.komisariat, labelKelompok.get(item.kelompok ?? "") ?? "", item.masalah, item.nama, item.kontak, item.bolehDikutip ? "Ya" : "Tidak", labelStatus[item.status] ?? item.status, item.hasilKuisId ? "Kuis" : "Formulir"]),
  ];
  const blob = new Blob([`﻿${baris.map((kolom) => kolom.map(sel).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
  const tautan = document.createElement("a");
  tautan.href = URL.createObjectURL(blob);
  tautan.download = `masalah-komisariat-${new Date().toISOString().slice(0, 10)}.csv`;
  tautan.click();
  URL.revokeObjectURL(tautan.href);
}

export default function MasalahPanel() {
  const [filter, setFilter] = useState<string>("semua");
  const { data = [], isLoading } = useQuery<MasalahKomisariat[]>({ queryKey: [KUNCI], staleTime: 30_000 });

  const ubahStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => apiRequest("PATCH", `${KUNCI}/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KUNCI] }),
  });
  const hapus = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `${KUNCI}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KUNCI] }),
  });

  const tampil = filter === "semua" ? data : data.filter((item) => item.status === filter);
  const jumlah = (status: string) => data.filter((item) => item.status === status).length;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Masalah Komisariat</h2>
          <p className="text-sm text-muted-foreground">Kiriman dari formulir "Kirim Masalah Komisariatmu" dan cerita yang dikirim sesudah kuis audit.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => unduhCsv(data)} disabled={!data.length}>
          <Download className="mr-2 h-4 w-4" /> Unduh CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-1" role="group" aria-label="Saring status">
        {["semua", "baru", "dibaca", "ditindaklanjuti"].map((status) => (
          <Button key={status} size="sm" variant={filter === status ? "default" : "outline"} onClick={() => setFilter(status)}>
            {status === "semua" ? `Semua (${data.length})` : `${labelStatus[status]} (${jumlah(status)})`}
          </Button>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat kiriman…</p>}
      {!isLoading && tampil.length === 0 && <p className="text-muted-foreground">Belum ada kiriman.</p>}

      <div className="grid gap-4">
        {tampil.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {item.komisariat}
                    {item.hasilKuisId && <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-normal uppercase tracking-[0.12em] text-primary">Dari kuis</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cabang {item.cabang}
                    {item.kelompok && ` · ${labelKelompok.get(item.kelompok) ?? item.kelompok}`}
                    {` · ${waktu(item.createdAt)}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {Object.entries(labelStatus).map(([status, label]) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={item.status === status ? "default" : "ghost"}
                      onClick={() => ubahStatus.mutate({ id: item.id, status })}
                      disabled={ubahStatus.isPending}
                    >
                      {label}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Hapus kiriman"
                    onClick={() => { if (window.confirm("Hapus kiriman ini? Tindakan ini tidak bisa dibatalkan.")) hapus.mutate(item.id); }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed">{item.masalah}</p>
              <p className="text-xs text-muted-foreground">
                {item.nama || item.kontak ? `Kontak: ${[item.nama, item.kontak].filter(Boolean).join(" · ")}` : "Tanpa kontak"}
                {" · "}
                {item.bolehDikutip ? "Boleh dikutip tanpa nama" : "Tidak untuk dikutip"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
