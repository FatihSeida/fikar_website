import type { ReactNode } from "react";
import { ArrowRight, Info, Lock, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { labelWaktu, RILIS } from "@shared/rilis";
import { angka, deretKuisHarian, desimal, NAMA_TINGKAT, rilisDariGalat, tanggalLengkap, useStatistikPemuda, waktuTarik, type StatistikPemuda } from "./data";
import { DaftarBatang, GrafikHarian, KartuGrafik, Meter, TOKEN_VIZ, UbinAngka, WARNA_TINGKAT } from "./grafik";

const persen = (bagian: number, total: number) => (total > 0 ? desimal((bagian / total) * 100) : "0");

function Rangka() {
  return (
    <div className="grid gap-4 motion-safe:animate-pulse" aria-hidden="true">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className="h-[130px] rounded-lg bg-[#E9E5D8]" />)}
      </div>
      <div className="h-72 rounded-lg bg-[#E9E5D8]" />
    </div>
  );
}

function KotakPesan({ ikon, judul, isi, aksi }: { ikon: ReactNode; judul: string; isi: string; aksi?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--viz-axis)] bg-[var(--viz-surface)] px-6 py-10 text-center" role="status">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">{ikon}</div>
      <p className="font-serif text-xl text-foreground">{judul}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{isi}</p>
      {aksi && <div className="mt-5">{aksi}</div>}
    </div>
  );
}

function Angka({ data }: { data: StatistikPemuda }) {
  const { kuis, kunjungan } = data;
  const harian = deretKuisHarian(data);
  const sumbuKunjungan = kunjungan.perHari.map((h) => h.tanggal);
  const hari = kunjungan.hari;
  const totalTingkat = kuis.tingkat.reduce((a, t) => a + t.jumlah, 0);
  const provinsiKuis = kuis.provinsi.slice(0, 8);
  const provinsiPengunjung = kunjungan.provinsi.slice(0, 8);
  const totalProvKuis = kuis.provinsi.reduce((a, p) => a + p.jumlah, 0);
  const totalProvPengunjung = kunjungan.provinsi.reduce((a, p) => a + p.jumlah, 0);
  const puncakKuis = Math.max(0, ...harian.nilai);
  const puncakKunjungan = Math.max(0, ...kunjungan.perHari.map((h) => h.kunjungan));

  return (
    <div className="grid gap-5">
      {/* Angka utama */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <UbinAngka label="Peserta kuis audit" nilai={angka(kuis.total)} keterangan="yang sudah mengisi kuis" />
        <UbinAngka label="Komisariat" nilai={angka(kuis.komisariat)} keterangan="ikut mengisi kuis" />
        <UbinAngka label="Cabang" nilai={angka(kuis.cabang)} keterangan="terwakili di kuis" />
        <UbinAngka label="Rata-rata skor" nilai={kuis.rataSkor === null ? "–" : desimal(kuis.rataSkor)} satuan={kuis.rataSkor === null ? undefined : "dari 60"} keterangan={kuis.rataSkor === null ? "menunggu peserta pertama" : "skor kuis audit"} />
        <UbinAngka label="Kunjungan situs" nilai={angka(kunjungan.total.kunjungan)} keterangan={`${hari} hari terakhir`} />
        <UbinAngka label="Pengunjung" nilai={angka(kunjungan.total.pengunjung)} keterangan={`orang berbeda per hari, ${hari} hari terakhir`} />
        <UbinAngka label="Masalah komisariat" nilai={angka(data.masalah)} keterangan="dikirim lewat kotak masalah" />
        <UbinAngka label="Tanggapan Series" nilai={angka(data.tanggapan)} keterangan="pada seluruh Series" />
      </div>

      {/* Kuis per hari */}
      <KartuGrafik
        judul="Kuis yang diisi setiap hari"
        uraian={`Jumlah kader yang menyelesaikan kuis audit, ${harian.tanggal.length} hari terakhir.`}
        tabel={{ kepala: ["Tanggal", "Peserta kuis"], baris: harian.tanggal.map((t, i) => [tanggalLengkap(t), harian.nilai[i]]) }}
      >
        <GrafikHarian
          tanggal={harian.tanggal}
          bentuk="batang"
          seri={[{ id: "kuis", nama: "peserta kuis", warna: "var(--viz-s1)", nilai: harian.nilai }]}
          ringkasan={`Grafik batang peserta kuis per hari. Total ${angka(kuis.total)} peserta${puncakKuis > 0 ? `, paling ramai ${angka(puncakKuis)} peserta dalam sehari` : ""}.`}
          kosong="Belum ada yang mengisi kuis. Batang akan muncul di sini begitu kader mulai mengisi."
        />
      </KartuGrafik>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Tingkat skor */}
        <KartuGrafik
          judul="Di tingkat mana komisariat berada"
          uraian="Skor kuis dibagi menjadi empat tingkat. Makin tua warnanya, makin tinggi tingkatnya."
          tabel={{ kepala: ["Tingkat", "Rentang skor", "Jumlah", "Bagian (%)"], baris: kuis.tingkat.map((t, i) => [NAMA_TINGKAT[i] ?? `Tingkat ${i + 1}`, `${t.min} sampai ${t.max}`, t.jumlah, persen(t.jumlah, totalTingkat)]) }}
          kaki="Skor tertinggi adalah 60. Tingkat dihitung dari skor kuis, bukan dari penilaian pihak lain."
        >
          <DaftarBatang
            jalur
            kosong="Belum ada peserta. Batang akan terisi setelah ada yang menyelesaikan kuis."
            baris={kuis.tingkat.map((t, i) => ({
              id: String(t.min),
              nama: NAMA_TINGKAT[i] ?? `Tingkat ${i + 1}`,
              keterangan: `skor ${t.min}–${t.max}`,
              nilai: t.jumlah,
              warna: WARNA_TINGKAT[i] ?? WARNA_TINGKAT[WARNA_TINGKAT.length - 1],
              tip: `${angka(t.jumlah)} peserta (${persen(t.jumlah, totalTingkat)}% dari seluruh peserta)`,
            }))}
          />
        </KartuGrafik>

        {/* Setelah LK 1 dan program */}
        <KartuGrafik
          judul="Kader bertahan dan program berjalan"
          uraian="Dua angka dari bagian kuis yang menanyakan keadaan komisariat."
          tabel={{ kepala: ["Ukuran", "Persen"], baris: [["Kader yang masih aktif setelah LK 1", kuis.retensiLk1 === null ? "Belum ada data" : `${desimal(kuis.retensiLk1)}%`], ["Program komisariat yang terlaksana", kuis.programTerlaksana === null ? "Belum ada data" : `${desimal(kuis.programTerlaksana)}%`]] }}
          kaki="Dilaporkan sendiri oleh komisariat yang mengisi kuis, tidak diperiksa pihak lain."
        >
          <div className="my-auto grid gap-9">
            <Meter
              judul="Kader yang masih aktif setelah LK 1"
              nilai={kuis.retensiLk1}
              uraian="Dari seluruh peserta LK 1 yang dilaporkan, sekian persen masih aktif di komisariat."
              kosong="Belum ada komisariat yang mengisi bagian ini."
            />
            <Meter
              judul="Program komisariat yang terlaksana"
              nilai={kuis.programTerlaksana}
              uraian="Dari seluruh program yang direncanakan, sekian persen benar-benar berjalan."
              kosong="Belum ada komisariat yang mengisi bagian ini."
            />
          </div>
        </KartuGrafik>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <KartuGrafik
          judul="Provinsi asal peserta kuis"
          uraian="Delapan provinsi dengan peserta terbanyak."
          tabel={{ kepala: ["Provinsi", "Peserta kuis"], baris: kuis.provinsi.map((p) => [p.nama, p.jumlah]) }}
          kaki="Provinsi diperkirakan dari jaringan pengirim, jadi bisa meleset."
        >
          <DaftarBatang
            kosong="Belum ada data provinsi. Daftar akan terisi setelah ada peserta."
            baris={provinsiKuis.map((p) => ({ id: p.nama, nama: p.nama, nilai: p.jumlah, warna: "var(--viz-s1)", tip: `${angka(p.jumlah)} peserta (${persen(p.jumlah, totalProvKuis)}% dari yang provinsinya terbaca)` }))}
          />
        </KartuGrafik>
        <KartuGrafik
          judul="Provinsi asal pengunjung situs"
          uraian={`Delapan provinsi dengan pengunjung terbanyak, ${hari} hari terakhir.`}
          tabel={{ kepala: ["Provinsi", "Pengunjung"], baris: kunjungan.provinsi.map((p) => [p.nama, p.jumlah]) }}
          kaki="Satu orang dihitung sekali per hari. Provinsi diperkirakan dari jaringan pengunjung."
        >
          <DaftarBatang
            kosong="Belum ada data provinsi pengunjung."
            baris={provinsiPengunjung.map((p) => ({ id: p.nama, nama: p.nama, nilai: p.jumlah, warna: "var(--viz-s1)", tip: `${angka(p.jumlah)} pengunjung (${persen(p.jumlah, totalProvPengunjung)}% dari yang provinsinya terbaca)` }))}
          />
        </KartuGrafik>
      </div>

      {/* Kunjungan per hari */}
      <KartuGrafik
        judul="Kunjungan ke situs setiap hari"
        uraian={`Berapa kali situs dibuka dan berapa orang yang membukanya, ${hari} hari terakhir.`}
        tabel={{ kepala: ["Tanggal", "Kunjungan", "Pengunjung"], baris: kunjungan.perHari.map((h) => [tanggalLengkap(h.tanggal), h.kunjungan, h.pengunjung]) }}
        kaki="Pengunjung dihitung per hari: orang yang sama pada hari berbeda dihitung lagi."
      >
        <GrafikHarian
          tanggal={sumbuKunjungan}
          bentuk="garis"
          seri={[
            { id: "kunjungan", nama: "kunjungan", warna: "var(--viz-s1)", nilai: kunjungan.perHari.map((h) => h.kunjungan) },
            { id: "pengunjung", nama: "pengunjung", warna: "var(--viz-s2)", nilai: kunjungan.perHari.map((h) => h.pengunjung) },
          ]}
          ringkasan={`Grafik garis kunjungan dan pengunjung per hari selama ${hari} hari. Total ${angka(kunjungan.total.kunjungan)} kunjungan oleh ${angka(kunjungan.total.pengunjung)} pengunjung${puncakKunjungan > 0 ? `, paling ramai ${angka(puncakKunjungan)} kunjungan dalam sehari` : ""}.`}
          kosong="Belum ada kunjungan tercatat pada rentang ini."
        />
      </KartuGrafik>
    </div>
  );
}

/** Bagian statistik Series 3: ubin angka, grafik, dan catatan cara membacanya. */
export default function StatistikPemuda() {
  const { data, isLoading, error, refetch, isFetching } = useStatistikPemuda();
  const rilis = rilisDariGalat(error);
  const belumRilis = rilis !== undefined;

  return (
    <section id="angka" className="scroll-mt-24 border-t border-border bg-[hsl(var(--muted))]/45" style={TOKEN_VIZ}>
      <div className="container mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary">Angka partisipasi</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">Seberapa jauh suara kader sudah terkumpul</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Angka di bawah ini dihitung dari kuis audit komisariat, kotak masalah, tanggapan Series, dan kunjungan ke situs. Isinya bertambah setiap kali ada kader yang ikut mengisi.
            </p>
          </div>
          <Link href="/kuis" className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90">
            Ikut mengisi kuis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 flex gap-3 border-l-2 border-[hsl(var(--gold))] bg-[hsl(var(--background))] px-4 py-3.5 text-sm leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p>
            <strong className="font-semibold text-foreground">Data ini sukarela.</strong> Hanya kader yang mau mengisi yang terhitung, jadi angkanya bukan potret seluruh HMI. Bacalah sebagai gambaran dari mereka yang bersuara.
          </p>
        </div>

        <div className="mt-8" aria-busy={isLoading}>
          {isLoading ? (
            <Rangka />
          ) : belumRilis ? (
            <KotakPesan
              ikon={<Lock className="h-5 w-5" />}
              judul="Angka partisipasi belum dibuka"
              isi={`Angka ini dibuka bersama terbitnya Series 3 pada ${labelWaktu(rilis ?? RILIS["series-3"]).replace(" · ", ", pukul ")}.`}
            />
          ) : error || !data ? (
            <KotakPesan
              ikon={<RefreshCw className="h-5 w-5" />}
              judul="Angka belum bisa dimuat"
              isi="Ada gangguan saat mengambil data. Periksa sambunganmu, lalu coba lagi."
              aksi={<button type="button" onClick={() => refetch()} className="text-sm font-medium text-primary underline-offset-4 hover:underline">Coba lagi</button>}
            />
          ) : (
            <div className={isFetching ? "opacity-70 transition-opacity" : "transition-opacity"}>
              <Angka data={data} />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <p>Data ditarik {waktuTarik(data.ditarik)}.</p>
                <button type="button" onClick={() => refetch()} disabled={isFetching} className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline disabled:opacity-60">
                  <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "motion-safe:animate-spin" : ""}`} aria-hidden="true" /> Perbarui angka
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
