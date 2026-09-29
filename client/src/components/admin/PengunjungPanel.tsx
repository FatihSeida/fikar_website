import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { JumlahBerlabel, StatistikKunjungan } from "@shared/schema";

const pilihanRentang = [7, 30, 90] as const;
const angka = new Intl.NumberFormat("id-ID");

function formatTanggal(tanggal: string) {
  return new Date(`${tanggal}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/** Satu seri, satu warna: batang harian pengunjung dengan tooltip per batang. */
function GrafikHarian({ data }: { data: StatistikKunjungan["perHari"] }) {
  const [aktif, setAktif] = useState<number | null>(null);
  const tertinggi = Math.max(1, ...data.map((item) => item.pengunjung));
  const titik = aktif === null ? null : data[aktif];

  return (
    <div>
      <div className="mb-2 flex h-6 items-baseline justify-between text-xs text-muted-foreground">
        <span>Pengunjung per hari</span>
        {titik && (
          <span className="text-foreground">
            {formatTanggal(titik.tanggal)}: <strong>{angka.format(titik.pengunjung)}</strong> pengunjung, {angka.format(titik.kunjungan)} halaman dibuka
          </span>
        )}
      </div>
      <div className="flex h-40 items-end gap-[2px] border-b border-border" onMouseLeave={() => setAktif(null)}>
        {data.map((item, index) => (
          <button
            type="button"
            key={item.tanggal}
            className="group flex h-full flex-1 items-end focus:outline-none"
            onMouseEnter={() => setAktif(index)}
            onFocus={() => setAktif(index)}
            aria-label={`${formatTanggal(item.tanggal)}: ${item.pengunjung} pengunjung`}
          >
            <span
              className={`block w-full rounded-t-[4px] transition-colors ${aktif === index ? "bg-primary" : "bg-primary/70 group-hover:bg-primary"}`}
              style={{ height: `${Math.max(item.pengunjung ? 2 : 0, (item.pengunjung / tertinggi) * 100)}%` }}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>{data[0] && formatTanggal(data[0].tanggal)}</span>
        <span>{data.at(-1) && formatTanggal(data.at(-1)!.tanggal)}</span>
      </div>
    </div>
  );
}

function DaftarBatang({ judul, data, keterangan, kosong }: { judul: string; data: (JumlahBerlabel & { provinsi?: string })[]; keterangan?: string; kosong: string }) {
  const tertinggi = Math.max(1, ...data.map((item) => item.jumlah));
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-serif text-lg">{judul}</h3>
        {keterangan && <p className="mt-1 text-xs text-muted-foreground">{keterangan}</p>}
        {data.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{kosong}</p>
        ) : (
          <ol className="mt-4 grid gap-3">
            {data.map((item) => (
              <li key={item.nama} className="text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate">
                    {item.nama}
                    {item.provinsi && <span className="text-muted-foreground"> · {item.provinsi}</span>}
                  </span>
                  <span className="tabular-nums text-muted-foreground">{angka.format(item.jumlah)}</span>
                </div>
                <span className="mt-1 block h-1.5 rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-primary/70" style={{ width: `${(item.jumlah / tertinggi) * 100}%` }} />
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

function PembuatTautan() {
  const [label, setLabel] = useState("");
  const [tersalin, setTersalin] = useState(false);
  const bersih = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  const tautan = `${window.location.origin}/?ref=${bersih || "nama-grup"}`;

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(tautan);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 1800);
    } catch {
      setTersalin(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-serif text-lg">Tautan bertanda untuk tiap grup</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Bagikan tautan berbeda ke tiap grup WA atau cabang. Kunjungan dari tautan itu akan muncul di daftar Sumber sebagai "Tautan: nama-grup".
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="mis. cabang makassar" maxLength={60} />
          <Button type="button" onClick={salin} disabled={!bersih}>{tersalin ? "Tersalin" : "Salin tautan"}</Button>
        </div>
        <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{tautan}</p>
      </CardContent>
    </Card>
  );
}

export default function PengunjungPanel() {
  const [hari, setHari] = useState<(typeof pilihanRentang)[number]>(30);
  const { data, isLoading, isError } = useQuery<StatistikKunjungan>({
    queryKey: [`/api/admin/kunjungan?hari=${hari}`],
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Pengunjung</h2>
          <p className="text-sm text-muted-foreground">Tanpa cookie dan tanpa menyimpan alamat IP. Diperbarui setiap menit.</p>
        </div>
        <div className="flex gap-1" role="group" aria-label="Rentang waktu">
          {pilihanRentang.map((pilihan) => (
            <Button key={pilihan} size="sm" variant={hari === pilihan ? "default" : "outline"} onClick={() => setHari(pilihan)}>
              {pilihan} hari
            </Button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat data kunjungan…</p>}
      {isError && <p className="text-destructive">Data kunjungan gagal dimuat.</p>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card><CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Pengunjung</p>
              <p className="mt-2 font-serif text-4xl tabular-nums">{angka.format(data.total.pengunjung)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Dihitung per hari, lalu dijumlahkan selama {data.hari} hari</p>
            </CardContent></Card>
            <Card><CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Halaman dibuka</p>
              <p className="mt-2 font-serif text-4xl tabular-nums">{angka.format(data.total.kunjungan)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Setiap perpindahan halaman dihitung satu</p>
            </CardContent></Card>
          </div>

          <Card><CardContent className="p-5"><GrafikHarian data={data.perHari} /></CardContent></Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <DaftarBatang
              judul="Kota"
              data={data.kota}
              keterangan="Perkiraan dari alamat IP. Pengguna data seluler sering terbaca di kota gerbang operator, misalnya Jakarta."
              kosong="Belum ada kunjungan dengan kota yang terbaca."
            />
            <DaftarBatang judul="Provinsi" data={data.provinsi} kosong="Belum ada kunjungan dengan provinsi yang terbaca." />
            <DaftarBatang
              judul="Sumber"
              data={data.sumber}
              keterangan="Dari mana pengunjung datang. WhatsApp sering tidak mengirim referrer, jadi pakai tautan bertanda."
              kosong="Belum ada data sumber."
            />
            <DaftarBatang judul="Halaman terpopuler" data={data.halaman} keterangan="Jumlah dibuka, bukan jumlah orang." kosong="Belum ada halaman yang dibuka." />
            <DaftarBatang judul="Perangkat" data={data.perangkat} kosong="Belum ada data perangkat." />
            <PembuatTautan />
          </div>

          <p className="text-xs text-muted-foreground">Data lokasi IP oleh DB-IP (db-ip.com), lisensi CC BY 4.0.</p>
        </>
      )}
    </div>
  );
}
