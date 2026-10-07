import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HasilKuis, KirimanFitur, MasalahKomisariat, Tanggapan } from "@shared/schema";

/**
 * Data fitur kampanye di panel admin: semua kiriman per cabang, lalu ringkasan
 * Sehari di Kursi Ketua, Bangun HMI Bersama, dan Maturity Level Cabang.
 */

const angka = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });
const waktu = (nilai: string | Date) => new Date(nilai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const normal = (teks: string | null | undefined) => (teks ?? "").trim().toLowerCase().replace(/\s+/g, " ");

function unduhCsv(namaBerkas: string, kepala: string[], baris: unknown[][]) {
  const sel = (nilai: unknown) => `"${String(nilai ?? "").replace(/"/g, '""')}"`;
  const blob = new Blob([`﻿${[kepala, ...baris].map((kolom) => kolom.map(sel).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
  const tautan = document.createElement("a");
  tautan.href = URL.createObjectURL(blob);
  tautan.download = `${namaBerkas}-${new Date().toISOString().slice(0, 10)}.csv`;
  tautan.click();
  URL.revokeObjectURL(tautan.href);
}

function Angka({ judul, nilai, catatan }: { judul: string; nilai: string; catatan?: string }) {
  return (
    <Card><CardContent className="p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{judul}</p>
      <p className="mt-2 font-serif text-3xl tabular-nums">{nilai}</p>
      {catatan && <p className="mt-1 text-xs text-muted-foreground">{catatan}</p>}
    </CardContent></Card>
  );
}

function Batang({ label, nilai, maksimum, keterangan }: { label: string; nilai: number; maksimum: number; keterangan: string }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm"><span>{label}</span><span className="tabular-nums text-muted-foreground">{keterangan}</span></div>
      <span className="mt-1 block h-1.5 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary/75" style={{ width: `${maksimum ? (nilai / maksimum) * 100 : 0}%` }} /></span>
    </li>
  );
}

const useKiriman = (fitur: string) => useQuery<KirimanFitur[]>({ queryKey: [`/api/admin/fitur/${fitur}`], staleTime: 60_000 });

/** Semua kiriman dikelompokkan per cabang (Rencana Kampanye v4, bagian 1.0). */
function PerCabang() {
  const { data: kuis = [] } = useQuery<HasilKuis[]>({ queryKey: ["/api/admin/kuis"], staleTime: 60_000 });
  const { data: masalah = [] } = useQuery<MasalahKomisariat[]>({ queryKey: ["/api/admin/masalah"], staleTime: 60_000 });
  const { data: tanggapan = [] } = useQuery<Tanggapan[]>({ queryKey: ["/api/admin/tanggapan"], staleTime: 60_000 });
  const { data: kursi = [] } = useKiriman("kursi-ketua");
  const { data: bangun = [] } = useKiriman("bangun-hmi");
  const { data: maturity = [] } = useKiriman("maturity-cabang");
  const { data: komitmen = [] } = useKiriman("maturity-komitmen");

  const sumber = [
    { kunci: "audit", label: "Audit komisariat", data: kuis },
    { kunci: "masalah", label: "Masalah", data: masalah },
    { kunci: "tanggapan", label: "Tanggapan Series", data: tanggapan },
    { kunci: "kursi", label: "Kursi Ketua", data: kursi },
    { kunci: "bangun", label: "Bangun HMI", data: bangun },
    { kunci: "maturity", label: "Maturity", data: maturity },
    { kunci: "komitmen", label: "Komitmen cabang", data: komitmen },
  ] as const;

  const peta = new Map<string, { nama: string; jumlah: Record<string, number>; komisariat: Set<string> }>();
  for (const s of sumber) {
    for (const item of s.data as { cabang: string | null; komisariat?: string | null }[]) {
      const kunci = normal(item.cabang) || "(belum diisi)";
      const isi = peta.get(kunci) ?? { nama: item.cabang?.trim() || "(belum diisi)", jumlah: {}, komisariat: new Set<string>() };
      isi.jumlah[s.kunci] = (isi.jumlah[s.kunci] ?? 0) + 1;
      if (item.komisariat) isi.komisariat.add(normal(item.komisariat));
      peta.set(kunci, isi);
    }
  }
  const total = (isi: { jumlah: Record<string, number> }) => Object.values(isi.jumlah).reduce((a, b) => a + b, 0);
  const daftar = Array.from(peta.values()).sort((a, b) => total(b) - total(a));

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">Setiap baris adalah satu cabang beserta jumlah kiriman dari semua kegiatan. Kiriman tanpa cabang dikumpulkan di baris “belum diisi”. Laporan dikembalikan ke cabang secara manual.</p>
        <Button variant="outline" size="sm" onClick={() => unduhCsv("kiriman-per-cabang", ["Cabang", "Komisariat terdata", ...sumber.map((s) => s.label), "Total"], daftar.map((d) => [d.nama, d.komisariat.size, ...sumber.map((s) => d.jumlah[s.kunci] ?? 0), total(d)]))} disabled={!daftar.length}>
          <Download className="mr-2 h-4 w-4" /> Unduh CSV
        </Button>
      </div>
      <Card><CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-normal">Cabang</th>
              <th className="px-4 py-3 text-right font-normal">Komisariat</th>
              {sumber.map((s) => <th key={s.kunci} className="px-4 py-3 text-right font-normal">{s.label}</th>)}
              <th className="px-4 py-3 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {daftar.map((d) => (
              <tr key={d.nama} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{d.nama}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{d.komisariat.size}</td>
                {sumber.map((s) => <td key={s.kunci} className="px-4 py-3 text-right tabular-nums">{d.jumlah[s.kunci] ?? <span className="text-muted-foreground">-</span>}</td>)}
                <td className="px-4 py-3 text-right font-medium tabular-nums">{total(d)}</td>
              </tr>
            ))}
            {daftar.length === 0 && <tr><td colSpan={sumber.length + 3} className="px-4 py-6 text-center text-muted-foreground">Belum ada kiriman.</td></tr>}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}

type IsiKursi = { kursi: string; potret: string; nilai: Record<"A" | "P" | "K" | "D" | "J", number> };
const DIMENSI = [["A", "Arah dan prioritas"], ["P", "Partisipasi dan keterbukaan"], ["K", "Pengembangan kader"], ["D", "Delegasi dan sistem"], ["J", "Menjaga diri dan dukungan"]] as const;

function KursiKetua() {
  const { data = [], isLoading } = useKiriman("kursi-ketua");
  const isi = data.map((k) => ({ ...k, isi: k.data as IsiKursi }));
  const potret = Array.from(isi.reduce((m, k) => m.set(k.isi.potret, (m.get(k.isi.potret) ?? 0) + 1), new Map<string, number>())).sort((a, b) => b[1] - a[1]);
  const rata = (kode: keyof IsiKursi["nilai"]) => (isi.length ? isi.reduce((a, k) => a + k.isi.nilai[kode], 0) / isi.length : 0);
  if (isLoading) return <p className="text-muted-foreground">Memuat…</p>;
  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted-foreground">Hanya untuk internal: ringkasan potret dan lima dimensi, bukan jawaban per situasi. Data ini tidak dipakai di konten dan tidak ditampilkan ke publik.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Angka judul="Peserta" nilai={angka.format(isi.length)} catatan={`${isi.filter((k) => k.isi.kursi === "cabang").length} memilih kursi cabang`} />
        <Angka judul="Mengisi komisariat dan cabang" nilai={angka.format(isi.filter((k) => k.komisariat && k.cabang).length)} />
        <Angka judul="Potret terbanyak" nilai={potret[0]?.[0] ?? "-"} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="p-5">
          <h3 className="font-serif text-lg">Sebaran potret</h3>
          <ol className="mt-4 grid gap-3">{potret.map(([nama, n]) => <Batang key={nama} label={nama} nilai={n} maksimum={potret[0][1]} keterangan={String(n)} />)}</ol>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <h3 className="font-serif text-lg">Rata-rata lima dimensi</h3>
          <p className="mt-1 text-xs text-muted-foreground">Persentase terhadap nilai maksimal setiap dimensi; makin rendah, makin perlu latihan.</p>
          <ol className="mt-4 grid gap-3">{DIMENSI.map(([kode, nama]) => <Batang key={kode} label={nama} nilai={rata(kode)} maksimum={100} keterangan={`${angka.format(rata(kode))}%`} />)}</ol>
        </CardContent></Card>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" disabled={!isi.length} onClick={() => unduhCsv("sehari-di-kursi-ketua", ["Waktu", "Kursi", "Potret", ...DIMENSI.map(([, n]) => n), "Komisariat", "Cabang", "Kota"], isi.map((k) => [waktu(k.createdAt), k.isi.kursi, k.isi.potret, ...DIMENSI.map(([kode]) => k.isi.nilai[kode]), k.komisariat, k.cabang, k.kota]))}>
          <Download className="mr-2 h-4 w-4" /> Unduh CSV
        </Button>
      </div>
    </div>
  );
}

type IsiBangun = { nilai: Record<string, number>; prioritas: { bagian: string; cara: number | null; usulan: string | null }[] };

function BangunHmi() {
  const { data = [], isLoading } = useKiriman("bangun-hmi");
  const isi = data.map((k) => ({ ...k, isi: k.data as IsiBangun }));
  const bagian = Array.from(new Set(isi.flatMap((k) => Object.keys(k.isi.nilai))));
  const ringkas = bagian.map((id) => ({
    id,
    rata: isi.length ? isi.reduce((a, k) => a + (k.isi.nilai[id] ?? 0), 0) / isi.length : 0,
    mendesak: isi.filter((k) => k.isi.prioritas.some((p) => p.bagian === id)).length,
  })).sort((a, b) => b.mendesak - a.mendesak);
  const usulan = isi.flatMap((k) => k.isi.prioritas.filter((p) => p.usulan).map((p) => ({ ...p, komisariat: k.komisariat, cabang: k.cabang, createdAt: k.createdAt })));
  if (isLoading) return <p className="text-muted-foreground">Memuat…</p>;
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Angka judul="Masukan" nilai={angka.format(isi.length)} />
        <Angka judul="Cabang" nilai={angka.format(new Set(isi.map((k) => normal(k.cabang))).size)} />
        <Angka judul="Usulan sendiri" nilai={angka.format(usulan.length)} />
      </div>
      <Card><CardContent className="p-5">
        <h3 className="font-serif text-lg">Bagian paling mendesak</h3>
        <ol className="mt-4 grid gap-3">{ringkas.map((r) => <Batang key={r.id} label={`${r.id} · rata-rata kondisi ${angka.format(r.rata)}`} nilai={r.mendesak} maksimum={ringkas[0]?.mendesak || 1} keterangan={`${r.mendesak} kali dipilih`} />)}</ol>
      </CardContent></Card>
      {usulan.length > 0 && (
        <Card><CardContent className="p-5">
          <h3 className="font-serif text-lg">Usulan sendiri</h3>
          <ul className="mt-4 grid gap-3 text-sm">
            {usulan.map((u, i) => <li key={i} className="border-t border-border pt-3"><span className="text-xs uppercase tracking-[0.12em] text-primary">{u.bagian}</span><p className="mt-1">{u.usulan}</p><p className="mt-1 text-xs text-muted-foreground">{u.komisariat} · Cabang {u.cabang} · {waktu(u.createdAt)}</p></li>)}
          </ul>
        </CardContent></Card>
      )}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" disabled={!isi.length} onClick={() => unduhCsv("bangun-hmi-bersama", ["Waktu", "Komisariat", "Cabang", "Kota", ...bagian.map((b) => `Nilai ${b}`), "Prioritas 1", "Cara 1", "Prioritas 2", "Cara 2", "Prioritas 3", "Cara 3"],
          isi.map((k) => [waktu(k.createdAt), k.komisariat, k.cabang, k.kota, ...bagian.map((b) => k.isi.nilai[b]), ...k.isi.prioritas.flatMap((p) => [p.bagian, p.usulan ?? `pilihan ${(p.cara ?? 0) + 1}`])]))}>
          <Download className="mr-2 h-4 w-4" /> Unduh CSV
        </Button>
      </div>
    </div>
  );
}

type IsiMaturity = { tingkat: Record<string, number>; prioritas: { dimensi: string; target: number }[]; tradisi: Record<string, string> };

function Maturity() {
  const { data = [], isLoading } = useKiriman("maturity-cabang");
  const { data: komitmen = [] } = useKiriman("maturity-komitmen");
  const { data: unduhan = [] } = useKiriman("maturity-unduhan");
  const isi = data.map((k) => ({ ...k, isi: k.data as IsiMaturity }));
  const dimensi = Array.from(new Set(isi.flatMap((k) => Object.keys(k.isi.tingkat))));
  const perBerkas = Array.from(unduhan.reduce((m, u) => m.set((u.data as { berkas: string }).berkas, (m.get((u.data as { berkas: string }).berkas) ?? 0) + 1), new Map<string, number>())).sort((a, b) => b[1] - a[1]);
  const tradisi = Array.from(new Set(isi.flatMap((k) => Object.keys(k.isi.tradisi))));
  if (isLoading) return <p className="text-muted-foreground">Memuat…</p>;
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Angka judul="Profil cabang" nilai={angka.format(isi.length)} catatan={`${new Set(isi.map((k) => normal(k.cabang))).size} cabang berbeda`} />
        <Angka judul="Komitmen implementasi" nilai={angka.format(komitmen.length)} />
        <Angka judul="Unduhan" nilai={angka.format(unduhan.length)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="p-5">
          <h3 className="font-serif text-lg">Rata-rata tingkat per dimensi</h3>
          <ol className="mt-4 grid gap-3">{dimensi.map((d) => {
            const rata = isi.length ? isi.reduce((a, k) => a + (k.isi.tingkat[d] ?? 0), 0) / isi.length : 0;
            const prioritas = isi.filter((k) => k.isi.prioritas.some((p) => p.dimensi === d)).length;
            return <Batang key={d} label={`${d} · ${prioritas} memilih sebagai prioritas`} nilai={rata} maksimum={4} keterangan={`${angka.format(rata)} dari 4`} />;
          })}</ol>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <h3 className="font-serif text-lg">Unduhan per berkas</h3>
          <ol className="mt-4 grid gap-3">{perBerkas.map(([berkas, n]) => <Batang key={berkas} label={berkas} nilai={n} maksimum={perBerkas[0][1]} keterangan={String(n)} />)}</ol>
          {!perBerkas.length && <p className="mt-4 text-sm text-muted-foreground">Belum ada unduhan.</p>}
        </CardContent></Card>
      </div>
      {tradisi.length > 0 && (
        <Card><CardContent className="p-5">
          <h3 className="font-serif text-lg">Tradisi baik yang hilang</h3>
          <ul className="mt-4 grid gap-2 text-sm">{tradisi.map((t) => {
            const hitung = (j: string) => isi.filter((k) => k.isi.tradisi[t] === j).length;
            return <li key={t} className="flex flex-wrap justify-between gap-2 border-t border-border pt-2"><span>{t}</span><span className="text-muted-foreground">masih hidup {hitung("hidup")} · hilang {hitung("hilang")} · tidak tahu {hitung("tidak-tahu")}</span></li>;
          })}</ul>
        </CardContent></Card>
      )}
      <Card><CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <tr><th className="px-4 py-3 font-normal">Waktu</th><th className="px-4 py-3 font-normal">Cabang</th><th className="px-4 py-3 font-normal">Nama</th><th className="px-4 py-3 font-normal">Jabatan</th><th className="px-4 py-3 font-normal">Kontak</th></tr>
          </thead>
          <tbody>
            {komitmen.map((k) => (
              <tr key={k.id} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{waktu(k.createdAt)}</td>
                <td className="px-4 py-3">{k.cabang}</td>
                <td className="px-4 py-3">{k.nama}</td>
                <td className="px-4 py-3">{(k.data as { jabatan: string }).jabatan}</td>
                <td className="px-4 py-3">{k.kontak}</td>
              </tr>
            ))}
            {!komitmen.length && <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Belum ada komitmen.</td></tr>}
          </tbody>
        </table>
      </CardContent></Card>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" disabled={!isi.length} onClick={() => unduhCsv("maturity-level-cabang", ["Waktu", "Cabang", "Kota", ...dimensi.map((d) => `Tingkat ${d}`), "Prioritas", ...tradisi.map((t) => `Tradisi ${t}`)],
          isi.map((k) => [waktu(k.createdAt), k.cabang, k.kota, ...dimensi.map((d) => k.isi.tingkat[d]), k.isi.prioritas.map((p) => `${p.dimensi} → ${p.target}`).join("; "), ...tradisi.map((t) => k.isi.tradisi[t])]))}>
          <Download className="mr-2 h-4 w-4" /> Unduh CSV
        </Button>
      </div>
    </div>
  );
}

export default function KampanyePanel() {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-serif text-2xl">Fitur Kampanye</h2>
        <p className="text-sm text-muted-foreground">Data dari Sehari di Kursi Ketua, Bangun HMI Bersama, dan Maturity Level Cabang, serta seluruh kiriman per cabang.</p>
      </div>
      <Tabs defaultValue="cabang">
        <TabsList className="mb-4 h-auto flex-wrap justify-start">
          <TabsTrigger value="cabang">Per cabang</TabsTrigger>
          <TabsTrigger value="kursi">Kursi Ketua</TabsTrigger>
          <TabsTrigger value="bangun">Bangun HMI</TabsTrigger>
          <TabsTrigger value="maturity">Maturity Cabang</TabsTrigger>
        </TabsList>
        <TabsContent value="cabang"><PerCabang /></TabsContent>
        <TabsContent value="kursi"><KursiKetua /></TabsContent>
        <TabsContent value="bangun"><BangunHmi /></TabsContent>
        <TabsContent value="maturity"><Maturity /></TabsContent>
      </Tabs>
    </div>
  );
}
