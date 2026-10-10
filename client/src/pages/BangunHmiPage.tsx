import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Hand, Maximize2, Users } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import BangunanHmi from "@/components/BangunanHmi";
import TombolStory from "@/components/TombolStory";
import InfoPersetujuan from "@/components/InfoPersetujuan";
import PilihCabang, { namaCabangDipilih } from "@/components/PilihCabang";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { indikator } from "@/lib/indikator";
import { queryClient } from "@/lib/queryClient";
import { labelRilis, sudahRilis } from "@shared/rilis";
import type { ApiPanggung, PinBagian } from "@/components/bangun/Panggung";
import type { KontenBangunHmi } from "../../../server/konten/bangunHmi";

// Bangunan 3D dimuat terpisah supaya halaman lain tidak ikut menanggung ukurannya.
const Panggung = lazy(() => import("@/components/bangun/Panggung"));

type Bagian = KontenBangunHmi["bagian"][number];
type Perbaikan = { cara: number | null; usulan: string };
type Tahap = "pembuka" | "identitas" | "nilai" | "prioritas" | "perbaikan" | "selesai";
type HasilBersama = {
  jumlah: number; komisariat: number; cabang: number; ditarik: string;
  bagian: { id: string; rataRata: number | null; dipilihMendesak: number; cara: number[]; usulan: number }[];
};

const judulIndikator = new Map(indikator.map((item) => [item.nomor, item.teks]));
/** Warna penanda per nilai, dari Rapuh (1) sampai Kokoh (5); abu-abu biru bila belum dinilai. */
const WARNA_NILAI = ["#B5523B", "#D08A3C", "#B8A43F", "#5E9B6B", "#0E8A4F"];
const BELUM = "#8FA3B8";
const perbaikanSiap = (p?: Perbaikan) => !!p && (p.cara !== null || p.usulan.trim().length >= 5);

function adaWebgl() {
  try {
    const kanvas = document.createElement("canvas");
    return !!(kanvas.getContext("webgl2") || kanvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * "Perbaiki perkaderan dan pedomannya melalui pendampingan 90 hari setelah LK 1."
 * Memakai uraian bagian, bukan nama bangunannya, supaya masukan untuk PB jelas maknanya.
 */
function kalimatMasukan(bagian: Bagian, perbaikan: Perbaikan) {
  return perbaikan.cara !== null
    ? `Perbaiki ${bagian.sasaran} melalui ${bagian.pilihan[perbaikan.cara]}.`
    : `Perbaiki ${bagian.sasaran}: ${perbaikan.usulan.trim()}`;
}

function Langkah({ nomor, judul }: { nomor: number; judul: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
      <span>Langkah {nomor} dari 4</span>
      <span>{judul}</span>
    </div>
  );
}

function HasilKader({ konten }: { konten: KontenBangunHmi }) {
  const { data } = useQuery<HasilBersama>({ queryKey: ["/api/fitur/bangun-hmi/hasil"] });
  if (!data) return null;
  const urut = [...data.bagian].sort((a, b) => b.dipilihMendesak - a.dipilihMendesak);
  const maks = Math.max(1, ...urut.map((b) => b.dipilihMendesak));
  const namaBagian = new Map(konten.bagian.map((b) => [b.id, b]));
  return (
    <section className="mt-16 border-t border-border pt-10">
      <p className="eyebrow text-primary">Hasil Bangun HMI Bersama</p>
      <h2 className="mt-3 font-serif text-3xl">Bagian yang paling mendesak menurut kader</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {data.jumlah} masukan dari {data.komisariat} komisariat di {data.cabang} cabang · data ditarik {new Date(data.ditarik).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}. Data sukarela dari peserta kampanye, bukan potret seluruh HMI.
      </p>
      <ol className="mt-8 grid gap-5">
        {urut.map((b) => {
          const isi = namaBagian.get(b.id)!;
          const caraTeratas = b.cara.indexOf(Math.max(...b.cara));
          return (
            <li key={b.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{isi.nama} <span className="font-normal text-muted-foreground">· {isi.tema}</span></span>
                <span className="tabular-nums text-muted-foreground">{b.dipilihMendesak} kali dipilih</span>
              </div>
              <span className="mt-1.5 block h-2 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary/80" style={{ width: `${(b.dipilihMendesak / maks) * 100}%` }} /></span>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Rata-rata kondisi {b.rataRata ?? "–"} dari 5{b.dipilihMendesak > 0 && Math.max(...b.cara) > 0 ? ` · cara perbaikan terbanyak: ${isi.pilihan[caraTeratas]}` : ""}{b.usulan > 0 ? ` · ${b.usulan} usulan sendiri` : ""}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function BangunHmiPage() {
  const { data: konten, isLoading, error } = useQuery<KontenBangunHmi>({ queryKey: ["/api/konten/bangun-hmi"] });
  const { data: peserta } = useQuery<{ jumlah: number }>({ queryKey: ["/api/fitur/bangun-hmi/jumlah"] });
  const [tahap, setTahap] = useState<Tahap>("pembuka");
  const [komisariat, setKomisariat] = useState("");
  const [cabangPilihan, setCabangPilihan] = useState("");
  const [cabangLain, setCabangLain] = useState("");
  const [nilai, setNilai] = useState<Record<string, number>>({});
  const [aktif, setAktif] = useState<string | null>(null);
  const [utuh, setUtuh] = useState(false);
  const [prioritas, setPrioritas] = useState<string[]>([]);
  const [perbaikan, setPerbaikan] = useState<Record<string, Perbaikan>>({});
  const [urutanPerbaikan, setUrutanPerbaikan] = useState(0);
  const [kirim, setKirim] = useState<"diam" | "mengirim" | "gagal">("diam");
  const [pesanGalat, setPesanGalat] = useState("");
  const [gambarBangunan, setGambarBangunan] = useState<string | undefined>();
  const [webgl] = useState(adaWebgl);
  const jedaLanjut = useRef<number>();

  const cabang = namaCabangDipilih(cabangPilihan, cabangLain);
  const nama = useMemo(() => Object.fromEntries((konten?.bagian ?? []).map((b) => [b.id, b.nama])), [konten]);
  const pindah = (baru: Tahap) => { setTahap(baru); setUtuh(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const hasilTerbuka = sudahRilis("hasil-bangun-hmi") || import.meta.env.DEV;
  useEffect(() => () => window.clearTimeout(jedaLanjut.current), []);

  const bagianAktif = konten?.bagian.find((b) => b.id === aktif) ?? konten?.bagian[0];
  const idPerbaikan = prioritas[urutanPerbaikan];
  const fokus = utuh ? null : tahap === "nilai" ? bagianAktif?.id ?? null : tahap === "perbaikan" ? idPerbaikan ?? null : null;
  const jumlahDinilai = Object.keys(nilai).length;

  const pilihBagian = (id: string) => { setAktif(id); setUtuh(false); };

  /** Setelah menilai, bangunan ditunjukkan sebentar, lalu beralih ke bagian berikutnya yang belum dinilai. */
  const beriNilai = (id: string, angka: number) => {
    if (!konten) return;
    const baru = { ...nilai, [id]: angka };
    setNilai(baru);
    window.clearTimeout(jedaLanjut.current);
    const urutan = konten.bagian.map((b) => b.id);
    const mulai = urutan.indexOf(id);
    const berikut = [...urutan.slice(mulai + 1), ...urutan.slice(0, mulai)].find((x) => !baru[x]);
    if (berikut) jedaLanjut.current = window.setTimeout(() => pilihBagian(berikut), 900);
  };

  const aturPrioritas = (id: string) =>
    setPrioritas((lama) => (lama.includes(id) ? lama.filter((x) => x !== id) : lama.length >= 3 ? lama : [...lama, id]));

  const kirimMasukan = async () => {
    if (!konten) return;
    setKirim("mengirim");
    setPesanGalat("");
    try {
      const res = await fetch("/api/fitur/bangun-hmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          komisariat: komisariat.trim(), cabang, nilai,
          prioritas: prioritas.map((id) => ({ bagian: id, cara: perbaikan[id]?.cara ?? null, usulan: perbaikan[id]?.cara === null ? perbaikan[id]?.usulan.trim() || null : null })),
        }),
      });
      if (res.ok) {
        // Jumlah peserta dan hasil bersama ikut diperbarui dengan masukan yang baru masuk.
        queryClient.invalidateQueries({ queryKey: ["/api/fitur/bangun-hmi/jumlah"] });
        queryClient.invalidateQueries({ queryKey: ["/api/fitur/bangun-hmi/hasil"] });
        setKirim("diam");
        pindah("selesai");
        return;
      }
      const balasan = await res.json().catch(() => null);
      setPesanGalat(typeof balasan?.message === "string" ? balasan.message : "");
      setKirim("gagal");
    } catch {
      setKirim("gagal");
    }
  };

  // Gambar Story diambil dari bangunan buatan pengunjung begitu panggung terakhir siap.
  const panggungSelesaiSiap = useCallback((api: ApiPanggung) => {
    window.setTimeout(() => setGambarBangunan(api.potret()), 300);
  }, []);

  const bangunan = (isi: Omit<ComponentProps<typeof Panggung>, "className">, kelas: string) =>
    webgl ? (
      <Suspense fallback={<div className={`${kelas} flex items-center justify-center text-sm text-muted-foreground`}>Menyiapkan bangunan…</div>}>
        <Panggung {...isi} className={kelas} />
      </Suspense>
    ) : (
      <BangunanHmi nilai={nilai} nama={nama} sorot={prioritas} className={kelas} />
    );

  const tombolUtama = "inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50";
  const tombolKembali = "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary";

  const pinNilai: PinBagian[] = (konten?.bagian ?? []).map((b, i) => ({
    id: b.id, nomor: i + 1, label: b.nama,
    warna: nilai[b.id] ? WARNA_NILAI[nilai[b.id] - 1] : BELUM,
    aktif: tahap === "nilai" && b.id === bagianAktif?.id && !utuh,
    lencana: tahap === "prioritas" && prioritas.includes(b.id) ? `Prioritas ${prioritas.indexOf(b.id) + 1}` : undefined,
  }));
  const pinPerbaikan: PinBagian[] = prioritas.map((id, i) => ({
    id, nomor: i + 1, label: nama[id] ?? id,
    warna: perbaikanSiap(perbaikan[id]) ? WARNA_NILAI[4] : WARNA_NILAI[1],
    aktif: i === urutanPerbaikan && !utuh,
  }));

  const pembangun = tahap === "nilai" || tahap === "prioritas" || tahap === "perbaikan";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className={`container mx-auto w-full flex-1 px-6 pb-24 md:px-10 ${pembangun ? "max-w-7xl pt-24 md:pt-32" : "max-w-6xl pt-32 md:pt-40"}`}>
        {isLoading && <p className="text-muted-foreground">Menyiapkan bangunan…</p>}
        {error && <p className="text-muted-foreground">Halaman belum bisa dimuat. Coba muat ulang.</p>}

        {konten && tahap === "pembuka" && (
          // Di ponsel bangunan tampil tepat di bawah judul; di layar lebar berada di kolom kanan.
          <div className="grid items-center gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
            <header>
              <span className="eyebrow mb-6 block">HMI Evidence · Menjadi pahlawan, bersama membangun HMI</span>
              <h1 className="font-serif text-4xl leading-tight md:text-6xl">{konten.judul}</h1>
            </header>
            <figure className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              {bangunan({ nilai: {}, prioritas: [], perbaikan: {}, fokus: null, putar: true }, "h-[340px] w-full md:h-[520px]")}
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">Bangunan ini masih rencana. Setiap penilaianmu ikut membangunnya.</figcaption>
            </figure>
            <div className="self-start">
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{konten.pengantar}</p>
              <div className="mt-8 max-w-2xl border-l-2 border-primary pl-5">
                <p className="eyebrow text-primary">Fondasi yang tidak dinilai</p>
                <ul className="mt-3 grid gap-2 text-sm">
                  {konten.fondasi.map((f) => <li key={f.nama}><span className="font-medium">{f.nama}.</span> <span className="text-muted-foreground">{f.uraian}</span></li>)}
                </ul>
              </div>
              <p className="mt-8 text-sm text-muted-foreground">Nilai sebelas bagian Graha Dipo Insancita, pilih tiga yang paling mendesak, lalu tentukan cara perbaikannya. Bangunan berubah mengikuti setiap pilihanmu. Waktu {konten.waktu}.</p>
              {peserta && peserta.jumlah > 0 && <p className="mt-3 inline-flex items-center gap-2 text-sm text-primary"><Users className="h-4 w-4" /> {peserta.jumlah} kader sudah ikut membangun</p>}
              <div className="mt-8"><button type="button" onClick={() => pindah("identitas")} className={tombolUtama}>Mulai membangun <ArrowRight className="h-4 w-4" /></button></div>
            </div>
          </div>
        )}

        {konten && tahap === "identitas" && (
          <section className="max-w-2xl">
            <Langkah nomor={1} judul="Komisariat dan cabang" />
            <h2 className="mt-8 font-serif text-3xl leading-snug md:text-4xl">Dari komisariat dan cabang mana kamu membangun?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Masukanmu digabung per cabang supaya terlihat bagian mana yang paling dirasakan di setiap wilayah.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Input value={komisariat} onChange={(e) => setKomisariat(e.target.value)} maxLength={120} placeholder="Nama komisariat" aria-label="Nama komisariat" />
              <PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} />
            </div>
            <InfoPersetujuan className="mt-5" />
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button type="button" disabled={komisariat.trim().length < 2 || cabang.length < 2} onClick={() => { setAktif(konten.bagian[0].id); pindah("nilai"); }} className={tombolUtama}>Lanjut menilai <ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={() => pindah("pembuka")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
            </div>
          </section>
        )}

        {konten && pembangun && (
          <div className="-mx-6 grid items-start md:-mx-10 lg:mx-0 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
            {/* Bangunan di tengah, tetap terlihat saat panel di bawah atau di samping digulir. */}
            <div className="sticky top-[60px] z-10 h-[46vh] min-h-[300px] overflow-hidden border-b border-border bg-gradient-to-b from-[#ECE6D6] to-[#F6F3EA] lg:top-28 lg:h-[calc(100vh-8.5rem)] lg:border">
              {bangunan(
                {
                  nilai, prioritas: tahap === "nilai" ? [] : prioritas, perbaikan: tahap === "perbaikan" ? perbaikan : {}, fokus,
                  pin: tahap === "perbaikan" ? pinPerbaikan : pinNilai,
                  onPilih: (id: string) => {
                    if (tahap === "nilai") pilihBagian(id);
                    else if (tahap === "prioritas") aturPrioritas(id);
                    else if (prioritas.includes(id)) { setUrutanPerbaikan(prioritas.indexOf(id)); setUtuh(false); }
                  },
                },
                "h-full w-full",
              )}
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full sm:bottom-auto sm:top-3 bg-[#0B2A1E]/85 px-3 py-1 text-[11px] text-white">
                {tahap === "nilai" ? `${jumlahDinilai} dari ${konten.bagian.length} bagian dinilai` : tahap === "prioritas" ? `${prioritas.length} dari 3 bagian dipilih` : `${prioritas.filter((id) => perbaikanSiap(perbaikan[id])).length} dari 3 bagian direncanakan`}
              </span>
              <span className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:inline-flex"><Hand className="h-3.5 w-3.5" /> Geser untuk memutar, cubit atau gulir untuk memperbesar</span>
              <button type="button" onClick={() => setUtuh(true)} className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-white/90 px-3 py-1.5 text-[11px] text-foreground shadow-sm hover:border-primary">
                <Maximize2 className="h-3.5 w-3.5" /> Lihat utuh
              </button>
            </div>

            <section className="px-6 pt-8 md:px-10 lg:px-0 lg:pt-0">
              {tahap === "nilai" && bagianAktif && (
                <>
                  <Langkah nomor={2} judul="Nilai kondisi setiap bagian" />
                  <div className="mt-4 flex gap-1" aria-hidden="true">
                    {konten.bagian.map((b) => <span key={b.id} className="h-1.5 flex-1 rounded-full" style={{ background: nilai[b.id] ? WARNA_NILAI[nilai[b.id] - 1] : "hsl(var(--muted))" }} />)}
                  </div>
                  <div className="mt-6 border border-border bg-background p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Bagian {konten.bagian.indexOf(bagianAktif) + 1} dari {konten.bagian.length}</p>
                    <h2 className="mt-2 font-serif text-3xl">{bagianAktif.nama}</h2>
                    <p className="mt-1 text-muted-foreground">{bagianAktif.tema}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Indikator {bagianAktif.indikator.map((n, i) => <span key={n}>{i > 0 && ", "}<Link href={`/indikator/${n}`} className="hover:text-primary hover:underline" title={judulIndikator.get(n)}>{n}</Link></span>)}
                    </p>
                    <p className="mt-5 text-sm font-medium">Seberapa kokoh bagian ini hari ini?</p>
                    <div className="mt-3 grid grid-cols-5 gap-1.5" role="radiogroup" aria-label={`Nilai ${bagianAktif.nama}`}>
                      {konten.skala.map((labelSkala, i) => {
                        const dipilih = nilai[bagianAktif.id] === i + 1;
                        return (
                          <button key={labelSkala} type="button" role="radio" aria-checked={dipilih} onClick={() => beriNilai(bagianAktif.id, i + 1)}
                            className={`border px-1 py-2.5 text-center transition-colors ${dipilih ? "text-white" : "border-border hover:border-primary/60"}`}
                            style={dipilih ? { background: WARNA_NILAI[i], borderColor: WARNA_NILAI[i] } : undefined}>
                            <span className="block font-serif text-lg leading-none">{i + 1}</span>
                            <span className="mt-1 block text-[10px] uppercase tracking-[0.06em] opacity-80">{labelSkala}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 min-h-[1.25rem] text-xs text-muted-foreground" role="status">
                      {nilai[bagianAktif.id] ? `Bangunan menampilkan ${bagianAktif.nama.toLowerCase()} dalam keadaan ${konten.skala[nilai[bagianAktif.id] - 1].toLowerCase()}.` : "Bagian yang belum dinilai masih berupa garis rencana."}
                    </p>
                  </div>
                  <ol className="mt-5 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-2">
                    {konten.bagian.map((b, i) => (
                      <li key={b.id}>
                        <button type="button" onClick={() => pilihBagian(b.id)} className={`flex w-full items-center gap-2 border px-2.5 py-2 text-left text-xs transition-colors ${b.id === bagianAktif.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`}>
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: nilai[b.id] ? WARNA_NILAI[nilai[b.id] - 1] : BELUM }}>{i + 1}</span>
                          <span className="truncate">{b.nama}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <button type="button" disabled={jumlahDinilai < konten.bagian.length} onClick={() => pindah("prioritas")} className={tombolUtama}>Pilih tiga yang mendesak <ArrowRight className="h-4 w-4" /></button>
                    <button type="button" onClick={() => pindah("identitas")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
                  </div>
                </>
              )}

              {tahap === "prioritas" && (
                <>
                  <Langkah nomor={3} judul="Tiga bagian paling mendesak" />
                  <h2 className="mt-6 font-serif text-3xl leading-snug">Bagian mana yang paling mendesak diperbaiki?</h2>
                  <p className="mt-3 text-muted-foreground">Pilih tepat tiga, di daftar ini atau langsung di bangunan. Bagian yang dipilih dipasangi perancah dan bendera urutannya.</p>
                  <div className="mt-6 grid gap-2">
                    {[...konten.bagian].sort((a, b) => nilai[a.id] - nilai[b.id]).map((b) => {
                      const urutan = prioritas.indexOf(b.id);
                      const dipilih = urutan >= 0;
                      return (
                        <button key={b.id} type="button" role="checkbox" aria-checked={dipilih} disabled={prioritas.length >= 3 && !dipilih} onClick={() => aturPrioritas(b.id)}
                          className={`flex items-center gap-4 border px-4 py-3 text-left transition-colors disabled:opacity-40 ${dipilih ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-serif text-sm ${dipilih ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{dipilih ? urutan + 1 : ""}</span>
                          <span className="flex-1"><span className="font-serif text-lg">{b.nama}</span><span className="block text-sm text-muted-foreground">{b.tema}</span></span>
                          <span className="shrink-0 text-sm" style={{ color: WARNA_NILAI[nilai[b.id] - 1] }}>{konten.skala[nilai[b.id] - 1]}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <button type="button" disabled={prioritas.length !== 3} onClick={() => { setUrutanPerbaikan(0); pindah("perbaikan"); }} className={tombolUtama}>Rencanakan perbaikan <ArrowRight className="h-4 w-4" /></button>
                    <button type="button" onClick={() => pindah("nilai")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
                  </div>
                </>
              )}

              {tahap === "perbaikan" && idPerbaikan && (() => {
                const b = konten.bagian.find((x) => x.id === idPerbaikan)!;
                const isi = perbaikan[idPerbaikan];
                const atur = (baru: Perbaikan) => setPerbaikan((lama) => ({ ...lama, [idPerbaikan]: baru }));
                const terakhir = urutanPerbaikan === prioritas.length - 1;
                const semuaSiap = prioritas.every((id) => perbaikanSiap(perbaikan[id]));
                return (
                  <>
                    <Langkah nomor={4} judul="Rencana perbaikan" />
                    <h2 className="mt-6 font-serif text-3xl leading-snug">Bagaimana sebaiknya ketiganya diperbaiki?</h2>
                    <div className="mt-5 grid grid-cols-3 gap-1.5" role="tablist">
                      {prioritas.map((id, i) => (
                        <button key={id} type="button" role="tab" aria-selected={i === urutanPerbaikan} onClick={() => { setUrutanPerbaikan(i); setUtuh(false); }}
                          className={`border px-2 py-2 text-left text-xs transition-colors ${i === urutanPerbaikan ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                          <span className="flex items-center gap-1.5 font-medium">{perbaikanSiap(perbaikan[id]) && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}{i + 1}. {nama[id]}</span>
                        </button>
                      ))}
                    </div>
                    <fieldset className="mt-5 border border-border p-5">
                      <legend className="px-2 font-serif text-xl">{b.nama}</legend>
                      <p className="text-sm text-muted-foreground">{b.tema}</p>
                      <div className="mt-4 grid gap-2" role="radiogroup" aria-label={`Cara memperbaiki ${b.nama}`}>
                        {b.pilihan.map((p, i) => (
                          <button key={p} type="button" role="radio" aria-checked={isi?.cara === i} onClick={() => atur({ cara: i, usulan: "" })}
                            className={`border px-4 py-3 text-left transition-colors ${isi?.cara === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                        <button type="button" role="radio" aria-checked={isi?.cara === null} onClick={() => atur({ cara: null, usulan: isi?.usulan ?? "" })}
                          className={`border px-4 py-3 text-left transition-colors ${isi?.cara === null ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
                          Usulan sendiri
                        </button>
                        {isi?.cara === null && (
                          <Textarea value={isi.usulan} onChange={(e) => atur({ cara: null, usulan: e.target.value })} maxLength={500} rows={3} placeholder={`Tulis cara memperbaiki ${b.nama.toLowerCase()}`} aria-label={`Usulan untuk ${b.nama}`} />
                        )}
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground" role="status">{perbaikanSiap(isi) ? "Perancah dilepas. Lihat hasil perbaikannya di bangunan." : "Bagian ini masih dipasangi perancah."}</p>
                    </fieldset>
                    {kirim === "gagal" && <p className="mt-4 text-sm text-destructive" role="alert">{pesanGalat || "Belum terkirim. Coba lagi sebentar lagi."}</p>}
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                      {!terakhir || !semuaSiap ? (
                        <button type="button" disabled={!perbaikanSiap(isi)} onClick={() => { setUrutanPerbaikan(terakhir ? prioritas.findIndex((id) => !perbaikanSiap(perbaikan[id])) : urutanPerbaikan + 1); setUtuh(false); }} className={tombolUtama}>
                          Bagian berikutnya <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button type="button" onClick={kirimMasukan} disabled={kirim === "mengirim"} className={tombolUtama}>
                          {kirim === "mengirim" ? "Mengirim…" : "Kirim masukan untuk PB"} <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                      <button type="button" onClick={() => pindah("prioritas")} className={tombolKembali}><ArrowLeft className="h-4 w-4" /> Kembali</button>
                    </div>
                  </>
                );
              })()}
            </section>
          </div>
        )}

        {konten && tahap === "selesai" && (() => {
          const utama = konten.bagian.find((b) => b.id === prioritas[0])!;
          return (
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
              <section>
                <p className="inline-flex items-center gap-2 text-sm text-primary"><CheckCircle2 className="h-4 w-4" /> Masukanmu sudah diterima</p>
                <div className="mt-6 bg-[hsl(var(--evidence))] p-8 text-white md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--gold))]">Masukanku untuk PB</p>
                  <p className="evidence-shimmer mt-4 font-serif text-3xl leading-snug md:text-4xl">{kalimatMasukan(utama, perbaikan[utama.id])}</p>
                  <p className="mt-6 text-sm text-white/70">Komisariat {komisariat.trim().replace(/^komisariat\s+/i, "")} · Cabang {cabang}</p>
                </div>
                <ol className="mt-8 grid gap-3">
                  {prioritas.map((id, i) => {
                    const b = konten.bagian.find((x) => x.id === id)!;
                    return <li key={id} className="flex gap-3"><span className="font-serif text-xl text-primary">{i + 1}</span><span className="leading-relaxed">{kalimatMasukan(b, perbaikan[id])}</span></li>;
                  })}
                </ol>
                <TombolStory
                  className="mt-8"
                  namaFile="story-bangun-hmi-bersama.png"
                  isi={{ label: "Bangun HMI Bersama", judul: "Masukanku untuk PB", labelIsi: "Prioritas pertama", isi: kalimatMasukan(utama, perbaikan[utama.id]), tautan: "ahmadzulfikar.com/bangun-hmi", gambar: gambarBangunan }}
                />
                <p className="mt-6 text-sm text-muted-foreground">
                  {hasilTerbuka ? "Hasil pilihan seluruh kader sudah dibuka di bawah." : `Hasil pilihan seluruh kader dibuka ${labelRilis("hasil-bangun-hmi")}. Sampai saat itu, halaman ini hanya menampilkan jumlah peserta.`}
                </p>
              </section>
              <figure>
                {bangunan({ nilai, prioritas, perbaikan, fokus: null, putar: !!gambarBangunan, onSiap: panggungSelesaiSiap }, "h-[380px] w-full md:h-[520px]")}
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">Graha Dipo Insancita versimu. Putar untuk melihat semua sisinya.</figcaption>
              </figure>
            </div>
          );
        })()}

        {konten && hasilTerbuka && (tahap === "pembuka" || tahap === "selesai") && <HasilKader konten={konten} />}
      </main>
      <SiteFooter />
    </div>
  );
}
