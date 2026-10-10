import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, RotateCcw, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import TombolStory from "@/components/TombolStory";
import InfoPersetujuan from "@/components/InfoPersetujuan";
import PilihCabang, { namaCabangDipilih } from "@/components/PilihCabang";
import { Input } from "@/components/ui/input";
import { bacaHasil, teksVarian, type Jawaban, type Konten } from "@/lib/kursiKetua";

const ROMAWI = ["I", "II", "III", "IV", "V"];
const KURSI = { komisariat: "Ketua Umum Komisariat", cabang: "Ketua Umum Cabang" } as const;
type Kursi = keyof typeof KURSI;

/** Urutan pilihan diacak sekali per permainan supaya pilihan yang tampak ideal tidak selalu di posisi yang sama. */
function acakUrutan(konten: Konten) {
  return Object.fromEntries(konten.situasi.map((s) => {
    const urutan = [0, 1, 2, 3];
    for (let i = urutan.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [urutan[i], urutan[j]] = [urutan[j], urutan[i]];
    }
    return [s.nomor, urutan];
  })) as Record<number, number[]>;
}

function Pembuka({ konten, mulai }: { konten: Konten; mulai: (kursi: Kursi) => void }) {
  const [kursi, setKursi] = useState<Kursi | null>(null);
  return (
    <header>
      <span className="eyebrow mb-6 block">HMI Evidence · Simulasi kepemimpinan</span>
      <h1 className="font-serif text-4xl leading-tight md:text-6xl">{konten.judul}</h1>
      <p className="mt-4 font-serif text-xl italic text-muted-foreground md:text-2xl">{konten.subjudul}</p>
      <div className="mt-10 grid max-w-2xl gap-4 text-lg leading-relaxed">
        {konten.pengantar.map((baris, i) => <p key={i} className={i === 0 ? "font-serif text-2xl" : "text-muted-foreground"}>{baris}</p>)}
      </div>
      <div className="mt-10 grid max-w-2xl gap-6 border-y border-border py-8 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="eyebrow">Di akhir, kamu mendapat</p>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed">
            {konten.hasilDidapat.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
          </ul>
        </div>
        <p className="text-sm text-muted-foreground md:text-right">Waktu<br /><span className="font-serif text-2xl text-foreground">{konten.waktu}</span></p>
      </div>
      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">{konten.batasan}</p>

      <p className="mt-10 font-medium">Kursi mana yang kamu duduki hari ini?</p>
      <div className="mt-3 grid max-w-2xl gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Pilih kursi">
        {(Object.keys(KURSI) as Kursi[]).map((kunci) => (
          <button key={kunci} type="button" role="radio" aria-checked={kursi === kunci} onClick={() => setKursi(kunci)}
            className={`border px-5 py-4 text-left transition-colors ${kursi === kunci ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
            <span className="font-serif text-lg">{KURSI[kunci]}</span>
          </button>
        ))}
      </div>
      <button type="button" disabled={!kursi} onClick={() => kursi && mulai(kursi)} className="mt-8 inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-50">
        Duduk di Kursi Ketum <ArrowRight className="h-4 w-4" />
      </button>
    </header>
  );
}

function LayarSituasi({ konten, langkah, jawaban, urutan, pilih, lanjut, kembali }: {
  konten: Konten; langkah: number; jawaban: Jawaban; urutan: Record<number, number[]>;
  pilih: (nomor: number, indeks: number) => void; lanjut: () => void; kembali: () => void;
}) {
  const situasi = konten.situasi[langkah];
  const babak = konten.babak[situasi.babak - 1];
  const pertamaDiBabak = konten.situasi.findIndex((s) => s.babak === situasi.babak) === langkah;
  const pengantarBabak = pertamaDiBabak ? teksVarian(babak, jawaban, "") : "";
  const dipilih = jawaban[situasi.nomor];
  const terakhir = langkah === konten.situasi.length - 1;

  return (
    <section aria-live="polite">
      <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
        <span>Babak {ROMAWI[babak.nomor - 1]} · {babak.nama}</span>
        <span>Situasi {langkah + 1} dari {konten.situasi.length}</span>
      </div>
      <span className="mt-3 block h-1 bg-muted">
        <span className="block h-full bg-primary transition-[width] duration-300" style={{ width: `${(langkah / konten.situasi.length) * 100}%` }} />
      </span>

      {pertamaDiBabak && (
        <div className="mt-10 border-l-2 border-primary pl-5">
          <p className="eyebrow text-primary">{babak.nama} · {babak.fokus}</p>
          {pengantarBabak && <p className="mt-2 font-serif text-lg italic">{pengantarBabak}</p>}
        </div>
      )}

      <p className="mt-10 font-serif text-lg text-primary">{String(situasi.nomor).padStart(2, "0")}. {situasi.judul}</p>
      <p className="mt-4 text-lg leading-relaxed">{teksVarian(situasi, jawaban, situasi.teks)}</p>
      <h2 className="mt-6 font-serif text-2xl leading-snug md:text-3xl">{situasi.pertanyaan}</h2>

      <div className="mt-8 grid gap-3" role="radiogroup" aria-label={situasi.pertanyaan}>
        {urutan[situasi.nomor].map((indeks) => {
          const pilihan = situasi.pilihan[indeks];
          const aktif = dipilih === indeks;
          return (
            <button key={indeks} type="button" role="radio" aria-checked={aktif} onClick={() => pilih(situasi.nomor, indeks)}
              className={`border px-5 py-4 text-left leading-snug transition-colors ${aktif ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-primary/5"}`}>
              {pilihan.label}
            </button>
          );
        })}
      </div>

      {dipilih !== undefined && (
        <div className="mt-6 bg-[hsl(var(--evidence))] p-6 text-white">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--gold))]">Konsekuensi</p>
          <p className="mt-2 font-serif text-lg leading-relaxed">{situasi.pilihan[dipilih].konsekuensi}</p>
          <button type="button" onClick={lanjut} className="mt-5 inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--evidence))]">
            {terakhir ? "Lihat hasil hari ini" : "Lanjut"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <button type="button" onClick={kembali} className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {langkah === 0 ? "Kembali ke pembuka" : "Sebelumnya"}
      </button>
    </section>
  );
}

function Hasil({ konten, kursi, jawaban, ulangi }: { konten: Konten; kursi: Kursi; jawaban: Jawaban; ulangi: () => void }) {
  const hasil = useMemo(() => bacaHasil(konten, jawaban), [konten, jawaban]);
  const [komitmen, setKomitmen] = useState(0);
  const [komisariat, setKomisariat] = useState("");
  const [cabangPilihan, setCabangPilihan] = useState("");
  const [cabangLain, setCabangLain] = useState("");
  const [mintaIdentitas, setMintaIdentitas] = useState(false);
  const [pdf, setPdf] = useState<"diam" | "menyiapkan" | "gagal">("diam");
  const cabang = namaCabangDipilih(cabangPilihan, cabangLain);
  const identitasLengkap = komisariat.trim().length >= 2 && cabang.length >= 2;
  const namaKomisariat = komisariat.trim().replace(/^komisariat\s+/i, "");
  const langkahDipilih = hasil.langkah[komitmen];

  // Ringkasan hasil (potret, lima dimensi, kursi) tersimpan otomatis; jawaban per situasi tidak dikirim.
  const [simpanan, setSimpanan] = useState<{ id: number; kunci: string } | null>(null);
  const sudahDisimpan = useRef(false);
  useEffect(() => {
    if (sudahDisimpan.current) return;
    sudahDisimpan.current = true;
    fetch("/api/fitur/kursi-ketua", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kursi, potret: hasil.potret.nama, nilai: hasil.persen }) })
      .then((res) => (res.ok ? res.json() : null))
      .then((isi) => { if (typeof isi?.id === "number") setSimpanan({ id: isi.id, kunci: isi.kunci }); })
      .catch(() => {});
  }, [kursi, hasil]);

  const identitasTersimpan = useRef("");
  useEffect(() => {
    const nilai = `${komisariat.trim()}|${cabang}`;
    if (!simpanan || !identitasLengkap || identitasTersimpan.current === nilai) return;
    const jeda = window.setTimeout(() => {
      fetch(`/api/fitur/kursi-ketua/${simpanan.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kunci: simpanan.kunci, komisariat: komisariat.trim(), cabang }) })
        .then((res) => { if (res.ok) identitasTersimpan.current = nilai; })
        .catch(() => {});
    }, 1200);
    return () => window.clearTimeout(jeda);
  }, [simpanan, identitasLengkap, komisariat, cabang]);

  const unduhPdf = async () => {
    setPdf("menyiapkan");
    try {
      const { unduhLaporanKursi } = await import("@/lib/laporanKursiPdf");
      const tanggal = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      await unduhLaporanKursi(hasil, { kursi: KURSI[kursi], komisariat: namaKomisariat, cabang, tanggal, komitmen: langkahDipilih.komitmen },
        `Sehari di Kursi Ketum - Komisariat ${namaKomisariat} - Cabang ${cabang} - HMI Evidence.pdf`.replace(/[\\/:*?"<>|]+/g, "-"));
      setPdf("diam");
    } catch {
      setPdf("gagal");
    }
  };

  const bawaKeRapat = async () => {
    const pesan = `Langkah pekan ini dari Sehari di Kursi Ketum: ${langkahDipilih.langkah} Coba juga simulasinya di ahmadzulfikar.com/kursi-ketum`;
    if (navigator.share) {
      try { await navigator.share({ text: pesan }); return; } catch { return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, "_blank", "noopener");
  };

  const bagian = "mt-16 border-t border-border pt-10";
  return (
    <div className="max-w-3xl">
      <span className="eyebrow text-primary">Hari selesai</span>
      <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{konten.penutup.judul}</h1>
      {hasil.penutup && <p className="mt-4 font-serif text-lg italic text-muted-foreground">{hasil.penutup}</p>}

      <section className="mt-10 bg-[hsl(var(--evidence))] p-8 text-white md:p-10">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--gold))]">Potret kepemimpinanmu · {KURSI[kursi]}</p>
        <h2 className="evidence-shimmer mt-4 font-serif text-4xl leading-tight md:text-5xl">{hasil.potret.nama}</h2>
        <p className="mt-3 font-serif text-lg italic text-white/80">“{hasil.potret.kutipan}”</p>
        <p className="mt-6 leading-relaxed text-white/80">{hasil.potret.uraian}</p>
        <p className="mt-4 text-sm text-white/70">Dua kekuatan yang paling tampak: <span className="text-white">{hasil.kekuatan.join(" dan ")}</span>.{hasil.campuran && <> Kecenderunganmu campuran; <span className="text-white">{hasil.campuran}</span> juga hampir sama kuat.</>}</p>
        {hasil.bukti.length > 0 && <p className="mt-4 leading-relaxed text-white/80">Ini terlihat ketika kamu {hasil.bukti.map((b) => b.pilihan.ringkas).join(", dan ketika kamu ")}.</p>}
        {hasil.pola && <p className="mt-4 leading-relaxed text-white/80">Namun, pada situasi {hasil.pola.situasi.konteks}, kamu memilih {hasil.pola.pilihan.ringkas}. {hasil.pola.pilihan.konsekuensi}</p>}
        <p className="mt-6 border-t border-white/15 pt-4 text-sm text-white/70">Tantanganmu: {hasil.potret.tantangan}</p>
      </section>

      <section className={bagian}>
        <p className="eyebrow">Cara kamu memimpin</p>
        <h2 className="mt-3 font-serif text-3xl">Lima dimensi dalam keputusanmu</h2>
        <ol className="mt-8 grid gap-5">
          {hasil.dimensi.map((d) => (
            <li key={d.kode}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{d.nama}</span>
                <span className="text-muted-foreground">{d.label}</span>
              </div>
              <span className="mt-1.5 block h-2 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary/80" style={{ width: `${Math.max(4, d.persen)}%` }} /></span>
              <p className="mt-1.5 text-xs text-muted-foreground">{d.uraian}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">Setiap dimensi dibaca dari beberapa situasi, bukan satu jawaban, dan tidak ada skor total “ketua terbaik”.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {hasil.praktik.length > 0 && (
            <div>
              <p className="eyebrow text-primary">Praktik yang sudah muncul</p>
              <ul className="mt-3 grid gap-3 text-sm leading-relaxed">
                {hasil.praktik.map((t) => <li key={t.situasi.nomor}>Dalam simulasi ini, kamu memilih {t.pilihan.ringkas}. <span className="text-muted-foreground">{t.pilihan.konsekuensi}</span></li>)}
              </ul>
            </div>
          )}
          {hasil.perhatian.length > 0 && (
            <div>
              <p className="eyebrow text-primary">Konsekuensi yang perlu diperhatikan</p>
              <ul className="mt-3 grid gap-3 text-sm leading-relaxed">
                {hasil.perhatian.map((t) => <li key={t.situasi.nomor}>Dalam simulasi ini, kamu memilih {t.pilihan.ringkas}. <span className="text-muted-foreground">{t.pilihan.konsekuensi}</span></li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className={bagian}>
        <p className="eyebrow">Siapa yang menjagamu?</p>
        <h2 className="mt-3 font-serif text-3xl">{hasil.dukungan.judul}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{hasil.dukungan.uraian}</p>
      </section>

      <section className={bagian}>
        <p className="eyebrow">Kader seperti apa yang mendapat ruang tumbuh?</p>
        <h2 className="mt-3 font-serif text-3xl">{hasil.ruangTumbuh.judul}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{hasil.ruangTumbuh.uraian} Bagian ini menjelaskan lingkungan yang didorong oleh pilihanmu, bukan sifat kader.</p>
      </section>

      {hasil.ditinjau.length > 0 && (
        <section className={bagian}>
          <p className="eyebrow">Keputusan yang paling layak ditinjau</p>
          <div className="mt-6 grid gap-4">
            {hasil.ditinjau.map((t) => (
              <article key={t.situasi.nomor} className="border border-border bg-background p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Situasi {String(t.situasi.nomor).padStart(2, "0")} · {t.situasi.judul}</p>
                <h3 className="mt-2 font-serif text-xl leading-snug">{t.pilihan.temuan!.judul}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{t.pilihan.temuan!.manfaat} {t.pilihan.temuan!.terlewat}</p>
                <p className="mt-3 leading-relaxed"><span className="font-medium text-primary">Coba berikutnya:</span> {t.pilihan.temuan!.coba}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={bagian}>
        <p className="eyebrow">Tiga langkah untuk tujuh hari berikutnya</p>
        <h2 className="mt-3 font-serif text-3xl">Pilih satu sebagai komitmen pekan ini</h2>
        <div className="mt-6 grid gap-3" role="radiogroup" aria-label="Komitmen pekan ini">
          {hasil.langkah.map((l, i) => (
            <button key={l.kode} type="button" role="radio" aria-checked={komitmen === i} onClick={() => setKomitmen(i)}
              className={`flex gap-4 border p-5 text-left transition-colors ${komitmen === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}>
              <span className="font-serif text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-medium">{l.kebutuhan}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{l.langkah}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={bagian}>
        <p className="eyebrow">Bagikan dan simpan</p>
        <h2 className="mt-3 font-serif text-3xl">Komitmen pekan ini: {langkahDipilih.komitmen}</h2>
        <p className="mt-3 text-sm text-muted-foreground">Kartu hanya memuat potret dan komitmen yang kamu pilih, tanpa jawaban tentang kelelahan, konflik, atau orang tempat meminta bantuan.</p>
        <div className="mt-6 flex flex-wrap items-start gap-3">
          <TombolStory
            namaFile="story-sehari-di-kursi-ketum.png"
            isi={{ label: "Sehari di Kursi Ketum", judul: `Potretku: ${hasil.potret.nama}`, labelIsi: "Komitmen pekan ini", isi: langkahDipilih.komitmen, catatan: "Refleksi kepemimpinan dari pilihan dalam simulasi.", tautan: "ahmadzulfikar.com/kursi-ketum" }}
          />
          <button type="button" onClick={() => (identitasLengkap ? unduhPdf() : setMintaIdentitas(true))} disabled={pdf === "menyiapkan"}
            className="inline-flex items-center gap-2 border border-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60">
            <Download className="h-4 w-4" /> {pdf === "menyiapkan" ? "Menyiapkan PDF…" : "Simpan hasil pribadi (PDF)"}
          </button>
          <button type="button" onClick={bawaKeRapat} className="inline-flex items-center gap-2 border border-border px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary">
            <Share2 className="h-4 w-4" /> Bawa satu langkah ke rapat
          </button>
        </div>
        {pdf === "gagal" && <p className="mt-3 text-sm text-destructive" role="alert">PDF belum berhasil dibuat. Periksa koneksi lalu coba lagi.</p>}
        {mintaIdentitas && (
          <div className="mt-6 border border-primary/40 bg-primary/[0.04] p-5">
            <p className="font-medium">Lengkapi komisariat dan cabang untuk menyimpan laporan</p>
            <p className="mt-1 text-sm text-muted-foreground">Keduanya dicantumkan di kop laporan PDF-mu.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input value={komisariat} onChange={(e) => setKomisariat(e.target.value)} maxLength={120} placeholder="Nama komisariat" aria-label="Nama komisariat" />
              <PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} />
            </div>
            <InfoPersetujuan className="mt-4" />
            <button type="button" onClick={() => { setMintaIdentitas(false); unduhPdf(); }} disabled={!identitasLengkap}
              className="mt-4 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-50">
              <Download className="h-4 w-4" /> Simpan hasil pribadi (PDF)
            </button>
          </div>
        )}
      </section>

      <button type="button" onClick={ulangi} className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <RotateCcw className="h-4 w-4" /> Coba keputusan berbeda
      </button>
      <p className="mt-10 text-xs leading-relaxed text-muted-foreground">{konten.batasan}</p>
    </div>
  );
}

export default function KursiKetuaPage() {
  const { data: konten, isLoading, error } = useQuery<Konten>({ queryKey: ["/api/konten/kursi-ketua"] });
  const [tahap, setTahap] = useState<"pembuka" | "situasi" | "hasil">("pembuka");
  const [kursi, setKursi] = useState<Kursi>("komisariat");
  const [langkah, setLangkah] = useState(0);
  const [jawaban, setJawaban] = useState<Jawaban>({});
  const [urutan, setUrutan] = useState<Record<number, number[]>>({});

  const keAtas = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const mulai = (pilihan: Kursi) => {
    if (!konten) return;
    setKursi(pilihan);
    setUrutan(acakUrutan(konten));
    setJawaban({});
    setLangkah(0);
    setTahap("situasi");
    keAtas();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className="container mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-32 md:px-10 md:pt-40">
        {isLoading && <p className="text-muted-foreground">Menyiapkan hari pertamamu…</p>}
        {error && <p className="text-muted-foreground">Simulasi belum bisa dimuat. Coba muat ulang halaman.</p>}
        {konten && tahap === "pembuka" && <Pembuka konten={konten} mulai={mulai} />}
        {konten && tahap === "situasi" && (
          <LayarSituasi
            konten={konten}
            langkah={langkah}
            jawaban={jawaban}
            urutan={urutan}
            pilih={(nomor, indeks) => setJawaban((lama) => ({ ...lama, [nomor]: indeks }))}
            lanjut={() => {
              if (langkah === konten.situasi.length - 1) setTahap("hasil");
              else setLangkah((lama) => lama + 1);
              keAtas();
            }}
            kembali={() => (langkah === 0 ? setTahap("pembuka") : setLangkah((lama) => lama - 1))}
          />
        )}
        {konten && tahap === "hasil" && <Hasil konten={konten} kursi={kursi} jawaban={jawaban} ulangi={() => mulai(kursi)} />}
      </main>
      <SiteFooter />
    </div>
  );
}
