import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { kelompokIndikator } from "@/lib/indikator";
import { pertanyaanKuis, pertanyaanLanjutan, rasio, tingkatHasil, type PertanyaanKuis } from "@/lib/kuis";
import type { HasilKuis } from "@shared/schema";

const angka = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });
// Satu hue, terang ke gelap: tingkat jawaban 0 sampai 3.
const warnaTingkat = ["bg-primary/15", "bg-primary/40", "bg-primary/65", "bg-primary/90"];

function waktu(nilai: string | Date) {
  return new Date(nilai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function tingkatDari(skor: number) {
  return tingkatHasil.find((tingkat) => skor >= tingkat.min && skor <= tingkat.max)?.judul ?? "";
}

const normal = (teks: string | null) => (teks ?? "").trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Satu komisariat bisa mengirim berkali-kali. Supaya angka "X% komisariat"
 * jujur, statistik hanya memakai kiriman terakhir per komisariat dan cabang;
 * kiriman tanpa nama komisariat atau cabang tetap dihitung masing-masing.
 * Data dari server sudah terurut dari yang terbaru.
 */
function kirimanTerakhir(data: HasilKuis[]) {
  const terlihat = new Set<string>();
  return data.filter((hasil) => {
    if (!normal(hasil.komisariat) || !normal(hasil.cabang)) return true;
    const kunci = `${normal(hasil.komisariat)}|${normal(hasil.cabang)}`;
    if (terlihat.has(kunci)) return false;
    terlihat.add(kunci);
    return true;
  });
}

/** CSV lengkap: satu baris per kiriman, satu kolom per pertanyaan, ditambah angka komisariat. */
function unduhCsv(data: HasilKuis[]) {
  const sel = (nilai: unknown) => `"${String(nilai ?? "").replace(/"/g, '""')}"`;
  const kepala = [
    "Waktu", "Komisariat", "Cabang", "Skor", "Tingkat",
    "Peserta LK 1", "Aktif 3 bulan", "Retensi (%)", "Program direncanakan", "Program terlaksana", "Keterlaksanaan (%)",
    ...[...pertanyaanKuis, ...pertanyaanLanjutan].map((pertanyaan) => `${pertanyaan.id.toUpperCase()} ${pertanyaan.teks}`),
  ];
  const baris = data.map((hasil) => [
    waktu(hasil.createdAt), hasil.komisariat, hasil.cabang, hasil.skor, tingkatDari(hasil.skor),
    hasil.pesertaLk1, hasil.aktifLk1, rasio(hasil.aktifLk1, hasil.pesertaLk1),
    hasil.programRencana, hasil.programTerlaksana, rasio(hasil.programTerlaksana, hasil.programRencana),
    ...hasil.jawaban.split(","),
  ]);
  const blob = new Blob([`\uFEFF${[kepala, ...baris].map((kolom) => kolom.map(sel).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
  const tautan = document.createElement("a");
  tautan.href = URL.createObjectURL(blob);
  tautan.download = `hasil-audit-komisariat-${new Date().toISOString().slice(0, 10)}.csv`;
  tautan.click();
  URL.revokeObjectURL(tautan.href);
}

function Batang({ label, nilai, maksimum, keterangan }: { label: string; nilai: number; maksimum: number; keterangan: string }) {
  return (
    <li className="text-sm">
      <div className="flex items-baseline justify-between gap-3">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">{keterangan}</span>
      </div>
      <span className="mt-1 block h-1.5 rounded-full bg-muted">
        <span className="block h-full rounded-full bg-primary/70" style={{ width: `${maksimum ? (nilai / maksimum) * 100 : 0}%` }} />
      </span>
    </li>
  );
}

/** Sebaran tingkat jawaban (0–3) per pertanyaan, dengan pilihan yang paling banyak dipilih. */
function SebaranJawaban({ judul, pertanyaan, daftar }: { judul: string; pertanyaan: readonly PertanyaanKuis[]; daftar: number[][] }) {
  const sebaran = pertanyaan.map((item, i) => {
    const jumlah = [0, 0, 0, 0];
    for (const jawaban of daftar) jumlah[jawaban[i]] = (jumlah[jawaban[i]] ?? 0) + 1;
    const persen = jumlah.map((nilai) => (daftar.length ? (nilai / daftar.length) * 100 : 0));
    return { pertanyaan: item, persen, terbanyak: persen.indexOf(Math.max(...persen)) };
  });
  return (
    <Card><CardContent className="p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg">{judul}</h3>
          <p className="mt-1 text-xs text-muted-foreground">n = {daftar.length} komisariat. Arahkan kursor ke batang untuk melihat pilihan jawabannya.</p>
        </div>
        <ul className="flex flex-wrap gap-3 text-xs text-muted-foreground" aria-label="Keterangan tingkat">
          {warnaTingkat.map((warna, tingkat) => (
            <li key={tingkat} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 ${warna}`} />Tingkat {tingkat}</li>
          ))}
        </ul>
      </div>
      <ol className="mt-5 grid gap-5">
        {sebaran.map(({ pertanyaan: item, persen, terbanyak }) => (
          <li key={item.id} className="text-sm">
            <p><span className="mr-2 tabular-nums text-muted-foreground">{item.id.toUpperCase()}</span>{item.teks}</p>
            <div className="mt-2 flex h-3 gap-[2px] overflow-hidden rounded-sm bg-background">
              {persen.map((nilai, tingkat) => nilai > 0 && (
                <span
                  key={tingkat}
                  className={warnaTingkat[tingkat]}
                  style={{ width: `${nilai}%` }}
                  title={`Tingkat ${tingkat} · ${item.pilihan[tingkat]?.label}: ${angka.format(nilai)}%`}
                />
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {angka.format(persen[terbanyak])}% menjawab <span className="text-foreground">"{item.pilihan[terbanyak]?.label}"</span>
            </p>
          </li>
        ))}
      </ol>
    </CardContent></Card>
  );
}

function Angka({ judul, nilai, catatan }: { judul: string; nilai: string; catatan: string }) {
  return (
    <Card><CardContent className="p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{judul}</p>
      <p className="mt-2 font-serif text-4xl tabular-nums">{nilai}</p>
      <p className="mt-1 text-xs text-muted-foreground">{catatan}</p>
    </CardContent></Card>
  );
}

export default function KuisPanel() {
  const { data = [], isLoading } = useQuery<HasilKuis[]>({ queryKey: ["/api/admin/kuis"], staleTime: 60_000 });
  const [cabang, setCabang] = useState("semua");

  const daftarCabang = Array.from(
    data.reduce((peta, hasil) => (normal(hasil.cabang) && !peta.has(normal(hasil.cabang)) ? peta.set(normal(hasil.cabang), hasil.cabang!.trim()) : peta), new Map<string, string>()),
  ).sort((a, b) => a[1].localeCompare(b[1], "id"));
  const sesuaiCabang = (hasil: HasilKuis) => cabang === "semua" || normal(hasil.cabang) === cabang;
  const semuaKiriman = data.filter(sesuaiCabang);
  const unik = kirimanTerakhir(data).filter(sesuaiCabang);

  // Hanya hasil yang panjang jawabannya cocok dengan versi kuis sekarang yang dirinci per pertanyaan.
  const semuaJawaban = unik.map((hasil) => hasil.jawaban.split(",").map(Number));
  const lengkap = semuaJawaban.filter((jawaban) => jawaban.length >= pertanyaanKuis.length).map((jawaban) => jawaban.slice(0, pertanyaanKuis.length));
  const lanjutan = semuaJawaban
    .filter((jawaban) => jawaban.length >= pertanyaanKuis.length + pertanyaanLanjutan.length)
    .map((jawaban) => jawaban.slice(pertanyaanKuis.length, pertanyaanKuis.length + pertanyaanLanjutan.length));
  const rataSkor = unik.length ? unik.reduce((jumlah, hasil) => jumlah + hasil.skor, 0) / unik.length : 0;
  const denganRetensi = unik.filter((hasil) => hasil.pesertaLk1 !== null && hasil.aktifLk1 !== null && hasil.pesertaLk1 > 0);
  const denganProgram = unik.filter((hasil) => hasil.programRencana !== null && hasil.programTerlaksana !== null && hasil.programRencana > 0);
  const jumlahkan = (daftar: HasilKuis[], kolom: "pesertaLk1" | "aktifLk1" | "programRencana" | "programTerlaksana") => daftar.reduce((total, hasil) => total + (hasil[kolom] ?? 0), 0);
  const retensi = rasio(jumlahkan(denganRetensi, "aktifLk1"), jumlahkan(denganRetensi, "pesertaLk1"));
  const keterlaksanaan = rasio(jumlahkan(denganProgram, "programTerlaksana"), jumlahkan(denganProgram, "programRencana"));

  const perTingkat = tingkatHasil.map((tingkat) => ({ ...tingkat, jumlah: unik.filter((hasil) => hasil.skor >= tingkat.min && hasil.skor <= tingkat.max).length }));
  const perKelompok = kelompokIndikator.map((kelompok) => {
    const indeks = pertanyaanKuis.flatMap((pertanyaan, i) => (pertanyaan.kelompok === kelompok.id ? [i] : []));
    const total = lengkap.reduce((jumlah, jawaban) => jumlah + indeks.reduce((sub, i) => sub + jawaban[i], 0), 0);
    const maksimum = lengkap.length * indeks.length * 3;
    return { ...kelompok, persen: maksimum ? (total / maksimum) * 100 : 0 };
  });
  const perCabang = Array.from(
    unik.reduce((peta, hasil) => {
      const nama = hasil.cabang?.trim() || "Tidak disebut";
      return peta.set(nama, (peta.get(nama) ?? 0) + 1);
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1]).slice(0, 15);
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Hasil Kuis</h2>
          <p className="text-sm text-muted-foreground">Statistik memakai kiriman terakhir setiap komisariat, supaya satu komisariat tidak terhitung berkali-kali.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={cabang}
            onChange={(e) => setCabang(e.target.value)}
            aria-label="Saring cabang"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="semua">Semua cabang</option>
            {daftarCabang.map(([kunci, nama]) => <option key={kunci} value={kunci}>{nama}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={() => unduhCsv(semuaKiriman)} disabled={!semuaKiriman.length}>
            <Download className="mr-2 h-4 w-4" /> Unduh CSV
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat hasil kuis…</p>}
      {!isLoading && unik.length === 0 && <p className="text-muted-foreground">Belum ada hasil kuis{cabang === "semua" ? " yang dikirim" : " dari cabang ini"}.</p>}

      {unik.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Angka judul="Komisariat" nilai={angka.format(unik.length)} catatan={`dari ${angka.format(semuaKiriman.length)} kiriman · ${angka.format(lanjutan.length)} ikut audit lanjutan`} />
            <Angka judul="Rata-rata skor" nilai={`${angka.format(rataSkor)} / ${pertanyaanKuis.length * 3}`} catatan={`n = ${unik.length}`} />
            <Angka judul="Retensi kader setelah LK 1" nilai={retensi === null ? "—" : `${retensi}%`} catatan={denganRetensi.length ? `gabungan ${angka.format(jumlahkan(denganRetensi, "aktifLk1"))} dari ${angka.format(jumlahkan(denganRetensi, "pesertaLk1"))} peserta · n = ${denganRetensi.length}` : "Belum ada yang mengisi"} />
            <Angka judul="Keterlaksanaan program" nilai={keterlaksanaan === null ? "—" : `${keterlaksanaan}%`} catatan={denganProgram.length ? `gabungan ${angka.format(jumlahkan(denganProgram, "programTerlaksana"))} dari ${angka.format(jumlahkan(denganProgram, "programRencana"))} program · n = ${denganProgram.length}` : "Belum ada yang mengisi"} />
          </div>

          <div className={`grid gap-4 ${cabang === "semua" ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
            <Card><CardContent className="p-5">
              <h3 className="font-serif text-lg">Sebaran tingkat</h3>
              <ol className="mt-4 grid gap-3">
                {perTingkat.map((tingkat) => (
                  <Batang key={tingkat.judul} label={tingkat.judul} nilai={tingkat.jumlah} maksimum={unik.length} keterangan={`${tingkat.jumlah} · skor ${tingkat.min}–${tingkat.max}`} />
                ))}
              </ol>
            </CardContent></Card>
            <Card><CardContent className="p-5">
              <h3 className="font-serif text-lg">Kekuatan per kelompok</h3>
              <p className="mt-1 text-xs text-muted-foreground">Persentase dari skor maksimal; makin rendah, makin perlu diperkuat.</p>
              <ol className="mt-4 grid gap-3">
                {perKelompok.map((kelompok) => (
                  <Batang key={kelompok.id} label={kelompok.judul} nilai={kelompok.persen} maksimum={100} keterangan={`${angka.format(kelompok.persen)}%`} />
                ))}
              </ol>
            </CardContent></Card>
            {cabang === "semua" && (
              <Card><CardContent className="p-5">
                <h3 className="font-serif text-lg">Cabang</h3>
                <ol className="mt-4 grid gap-3">
                  {perCabang.map(([nama, jumlah]) => (
                    <Batang key={nama} label={nama} nilai={jumlah} maksimum={perCabang[0][1]} keterangan={String(jumlah)} />
                  ))}
                </ol>
              </CardContent></Card>
            )}
          </div>

          {lengkap.length > 0 && <SebaranJawaban judul="Sebaran jawaban per pertanyaan" pertanyaan={pertanyaanKuis} daftar={lengkap} />}
          {lanjutan.length > 0 && <SebaranJawaban judul="Audit lanjutan: kader pasca-LK 2 dan LK 3" pertanyaan={pertanyaanLanjutan} daftar={lanjutan} />}

          <Card><CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-normal">Waktu</th>
                  <th className="px-5 py-3 font-normal">Komisariat</th>
                  <th className="px-5 py-3 font-normal">Cabang</th>
                  <th className="px-5 py-3 text-right font-normal">Skor</th>
                  <th className="px-5 py-3 font-normal">Tingkat</th>
                  <th className="px-5 py-3 text-right font-normal">Retensi</th>
                  <th className="px-5 py-3 text-right font-normal">Program</th>
                </tr>
              </thead>
              <tbody>
                {semuaKiriman.map((hasil) => {
                  const r = rasio(hasil.aktifLk1, hasil.pesertaLk1);
                  const k = rasio(hasil.programTerlaksana, hasil.programRencana);
                  return (
                    <tr key={hasil.id} className="border-b border-border last:border-0">
                      <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{waktu(hasil.createdAt)}</td>
                      <td className="px-5 py-3">{hasil.komisariat || <span className="text-muted-foreground">Tidak diisi</span>}</td>
                      <td className="px-5 py-3">{hasil.cabang || <span className="text-muted-foreground">Tidak diisi</span>}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{hasil.skor}</td>
                      <td className="px-5 py-3">{tingkatDari(hasil.skor)}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{r === null ? "—" : `${hasil.aktifLk1}/${hasil.pesertaLk1} (${r}%)`}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{k === null ? "—" : `${hasil.programTerlaksana}/${hasil.programRencana} (${k}%)`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent></Card>
        </>
      )}
    </div>
  );
}
