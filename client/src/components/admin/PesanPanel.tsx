import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { KirimanFitur } from "@shared/schema";

/** Pesan dari "Bicara dengan Ahmad Zulfikar" di beranda. Pesannya ada di kolom data.pesan. */

const KUNCI = "/api/admin/fitur/pesan-zulfikar";

const waktu = (nilai: string | Date) =>
  new Date(nilai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const isiPesan = (item: KirimanFitur) => String((item.data as { pesan?: string } | null)?.pesan ?? "");

function unduhCsv(data: KirimanFitur[]) {
  const sel = (nilai: unknown) => `"${String(nilai ?? "").replace(/"/g, '""')}"`;
  const baris = [
    ["Waktu", "Nama", "Komisariat", "Cabang", "Kota", "Provinsi", "Kontak", "Pesan"],
    ...data.map((item) => [waktu(item.createdAt), item.nama, item.komisariat, item.cabang, item.kota, item.provinsi, item.kontak, isiPesan(item)]),
  ];
  const blob = new Blob([`﻿${baris.map((kolom) => kolom.map(sel).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
  const tautan = document.createElement("a");
  tautan.href = URL.createObjectURL(blob);
  tautan.download = `pesan-zulfikar-${new Date().toISOString().slice(0, 10)}.csv`;
  tautan.click();
  URL.revokeObjectURL(tautan.href);
}

export default function PesanPanel() {
  const { data = [], isLoading } = useQuery<KirimanFitur[]>({ queryKey: [KUNCI], staleTime: 30_000 });
  const daftar = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Pesan untuk Ahmad Zulfikar</h2>
          <p className="text-sm text-muted-foreground">Kiriman dari bagian "Bicara dengan Ahmad Zulfikar" di beranda, yang terbaru di atas. Kontak hanya untuk membalas pesan.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => unduhCsv(daftar)} disabled={!daftar.length}>
          <Download className="mr-2 h-4 w-4" /> Unduh CSV
        </Button>
      </div>

      {!isLoading && <p className="text-sm text-muted-foreground">{daftar.length} pesan</p>}
      {isLoading && <p className="text-muted-foreground">Memuat pesan…</p>}
      {!isLoading && daftar.length === 0 && <p className="text-muted-foreground">Belum ada pesan.</p>}

      <div className="grid gap-4">
        {daftar.map((item) => {
          const lokasi = [item.kota, item.provinsi].filter(Boolean).join(", ");
          return (
            <Card key={item.id}>
              <CardContent className="grid gap-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium">{item.nama || "Tanpa nama"}</p>
                  <p className="text-sm text-muted-foreground">{waktu(item.createdAt)}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {[item.komisariat && `Komisariat ${item.komisariat.replace(/^komisariat\s+/i, "")}`, item.cabang && `Cabang ${item.cabang}`, lokasi && `Dikirim dari ${lokasi}`].filter(Boolean).join(" · ") || "Komisariat dan cabang tidak diisi"}
                </p>
                <p className="whitespace-pre-line break-words text-sm leading-relaxed">{isiPesan(item)}</p>
                <p className="text-xs text-muted-foreground">{item.kontak ? `Kontak: ${item.kontak}` : "Tanpa kontak"}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
