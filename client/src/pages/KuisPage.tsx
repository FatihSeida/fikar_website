import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Download, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import SiteFooter from "@/components/sections/SiteFooter";
import TeksIstilah from "@/components/TeksIstilah";
import AjakDukung from "@/components/AjakDukung";
import ProfilDialog from "@/components/ProfilDialog";
import VisiMisiDialog from "@/components/VisiMisiDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { kelompokIndikator } from "@/lib/indikator";
import {
  angkaKosong, angkaKuis, kelompokLanjutan, periksaAngka, pertanyaanKuis, pertanyaanLanjutan, programPertanyaan, rasio,
  saranKelompok, tingkatHasil, type AngkaId, type AngkaKuis, type KelompokKuis, type PertanyaanKuis,
} from "@/lib/kuis";
import { badkoCabang, CABANG_LAINNYA } from "@shared/cabang";
import { programDenganNomor } from "@/lib/program";

const skorMaksimal = pertanyaanKuis.length * 3;

/** Kolom kanan hasil kuis: ajakan dukungan dari Zulfikar dan tim HMI Evidence. */
function AjakanDukungan() {
  const [profilOpen, setProfilOpen] = useState(false);
  const [visiMisiOpen, setVisiMisiOpen] = useState(false);
  return (
    <>
    <aside className="lg:sticky lg:top-28">
      <div className="relative overflow-hidden bg-[hsl(var(--evidence))] text-white">
        <div className="relative aspect-[4/3.4] overflow-hidden">
          <img src="/ahmad/profile-centered.webp" alt="Zulfikar mengenakan peci dan selempang HMI" className="h-full w-full object-cover object-[center_22%]" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--evidence))] via-[hsl(var(--evidence))]/10 to-transparent" />
          <span className="absolute left-6 top-6 border border-[hsl(var(--gold))]/60 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--gold))] backdrop-blur">HMI Evidence</span>
        </div>
        <div className="relative px-7 pb-8 md:px-9">
          <h2 className="-mt-6 font-serif text-3xl leading-tight">Mohon dukunganmu untuk memenangkan Kongres HMI XXXIII.</h2>
          <p className="mt-5 text-sm leading-relaxed text-white/75">
            HMI Evidence bukan satu orang. HMI Evidence adalah tim, dan komitmen untuk memperbaiki kaderisasi ke depan: latihan yang punya tindak lanjut, pendampingan yang merata, dan keputusan yang bisa diperiksa bersama.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Hasil audit komisariat yang kamu kirim akan menjadi rujukan perbaikan HMI ke depan. Setiap jawaban adalah bukti.
          </p>
          <div className="mt-7 border-t border-white/15 pt-5">
            <p className="font-serif text-xl text-[hsl(var(--gold))]">Zulfikar</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/55">Kandidat Ketua Umum PB HMI Periode 2026–2028</p>
          </div>
          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setProfilOpen(true)} className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--gold))] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--evidence))]">Kenali Zulfikar</button>
            <button type="button" onClick={() => setVisiMisiOpen(true)} className="inline-flex items-center justify-center gap-2 border border-white/30 px-4 py-3 text-xs uppercase tracking-[0.14em] text-white hover:border-white">Visi dan program</button>
          </div>
        </div>
      </div>
    </aside>
    <ProfilDialog open={profilOpen} onOpenChange={setProfilOpen} />
    <VisiMisiDialog open={visiMisiOpen} onOpenChange={setVisiMisiOpen} />
    </>
  );
}

/** Tiga kotak kecil yang menunjukkan tingkat jawaban (0–3). */
function TitikSkor({ skor }: { skor: number }) {
  return (
    <span className="inline-flex gap-1" aria-label={`Tingkat ${skor} dari 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-2 w-2 ${i <= skor ? "bg-primary" : "bg-muted"}`} />
      ))}
    </span>
  );
}

type ButirTemuan = { pertanyaan: PertanyaanKuis; skor: number };

/** Persentase dan butir temuan setiap kelompok dari sekumpulan pertanyaan beserta jawabannya. */
function hitungKelompok<K extends { id: KelompokKuis }>(daftarKelompok: readonly K[], pertanyaan: readonly PertanyaanKuis[], jawaban: number[]) {
  return daftarKelompok.map((kelompok) => {
    const butir: ButirTemuan[] = pertanyaan.flatMap((item, i) => (item.kelompok === kelompok.id ? [{ pertanyaan: item, skor: jawaban[i] }] : []));
    const nilai = butir.reduce((jumlah, item) => jumlah + item.skor, 0);
    return { kelompok, butir, persen: butir.length ? Math.round((nilai / (butir.length * 3)) * 100) : 0 };
  });
}

/** Satu kelompok temuan: saran kelompok, program terkait, dan temuan per pertanyaan. */
function KelompokTemuan({ idKelompok, judul, sorotan, persen, butir, terbukaAwal }: {
  idKelompok: KelompokKuis;
  judul: string;
  sorotan: string;
  persen: number;
  butir: ButirTemuan[];
  terbukaAwal: boolean;
}) {
  const [terbuka, setTerbuka] = useState(terbukaAwal);
  const saran = saranKelompok[idKelompok];
  const daftar = butir;

  return (
    <section className="border border-border bg-background">
      <button
        type="button"
        onClick={() => setTerbuka((nilai) => !nilai)}
        aria-expanded={terbuka}
        className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
      >
        <span>
          <span className="eyebrow text-primary">{judul} · {persen}%</span>
          <span className="mt-1 block font-serif text-xl">{sorotan}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform print:hidden ${terbuka ? "rotate-180" : ""}`} />
      </button>
      <div className={`border-t border-border px-5 pb-6 pt-5 md:px-6 ${terbuka ? "" : "hidden print:block"}`}>
        <p className="leading-relaxed"><TeksIstilah>{saran.saran}</TeksIstilah></p>
        <div className="print:hidden">
          <p className="eyebrow mt-4">Rencana Program Kami</p>
          <ul className="mt-2 grid gap-1 text-sm">
            {saran.program.map((kode) => (
              <li key={kode}>
                <Link href={`/hmi-evidence#program-${kode}`} className="text-primary hover:underline">Program {kode}: {programDenganNomor(kode)?.judul}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-6">
          {daftar.map(({ pertanyaan, skor }) => {
            const pilihan = pertanyaan.pilihan.find((item) => item.skor === skor) ?? pertanyaan.pilihan[0];
            return (
              <article key={pertanyaan.id} className="break-inside-avoid border-t border-border pt-5">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-serif text-lg leading-snug"><TeksIstilah>{pertanyaan.teks}</TeksIstilah></h4>
                  <span className="mt-1.5 flex shrink-0 items-center gap-2 text-xs tabular-nums text-muted-foreground"><TitikSkor skor={skor} /> {skor}/3</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Jawabanmu: <TeksIstilah>{pilihan.label}</TeksIstilah></p>
                <dl className="mt-4 grid gap-4 text-sm leading-relaxed sm:grid-cols-2">
                  <div>
                    <dt className="eyebrow">Temuan</dt>
                    <dd className="mt-1.5"><TeksIstilah>{pilihan.temuan}</TeksIstilah></dd>
                  </div>
                  <div>
                    <dt className="eyebrow">{skor === 3 ? "Langkah berikutnya" : "Naik satu tingkat"}</dt>
                    <dd className="mt-1.5"><TeksIstilah>{pilihan.langkah}</TeksIstilah></dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Terkait:{" "}
                  {pertanyaan.indikatorTerkait.map((nomor, i) => (
                    <span key={nomor}>{i > 0 && ", "}<Link href={`/indikator/${nomor}`} className="hover:text-primary hover:underline">Indikator {nomor}</Link></span>
                  ))}
                  <span className="print:hidden">
                    {" · "}
                    {programPertanyaan(pertanyaan).map((kode, i) => (
                      <span key={kode}>{i > 0 && ", "}<Link href={`/hmi-evidence#program-${kode}`} className="hover:text-primary hover:underline">Program {kode}</Link></span>
                    ))}
                  </span>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Cabang dipilih dari daftar per Badko; cabang yang belum terdata bisa diketik sendiri. */
function PilihCabang({ pilihan, setPilihan, lainnya, setLainnya }: {
  pilihan: string;
  setPilihan: (nilai: string) => void;
  lainnya: string;
  setLainnya: (nilai: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <select
        value={pilihan}
        onChange={(e) => setPilihan(e.target.value)}
        aria-label="Pilih cabang"
        className={`h-10 w-full rounded-md border border-input bg-background px-3 text-sm ${pilihan ? "" : "text-muted-foreground"}`}
      >
        <option value="">Pilih cabang</option>
        {badkoCabang.map((badko) => (
          <optgroup key={badko.badko} label={badko.badko}>
            {badko.cabang.map((nama) => <option key={nama} value={nama}>{nama}</option>)}
          </optgroup>
        ))}
        <option value={CABANG_LAINNYA}>Cabang lainnya (belum ada di daftar)</option>
      </select>
      {pilihan === CABANG_LAINNYA && (
        <Input value={lainnya} onChange={(e) => setLainnya(e.target.value)} maxLength={80} placeholder="Tulis nama cabang" aria-label="Nama cabang" />
      )}
    </div>
  );
}

function AngkaKunci({ angka }: { angka: AngkaKuis }) {
  const retensi = rasio(angka.aktifLk1, angka.pesertaLk1);
  const keterlaksanaan = rasio(angka.programTerlaksana, angka.programRencana);
  if (retensi === null && keterlaksanaan === null) return null;
  const kartu = [
    retensi !== null && { judul: "Retensi kader setelah LK 1", nilai: retensi, rinci: `${angka.aktifLk1} dari ${angka.pesertaLk1} peserta masih aktif tiga bulan kemudian` },
    keterlaksanaan !== null && { judul: "Keterlaksanaan program", nilai: keterlaksanaan, rinci: `${angka.programTerlaksana} dari ${angka.programRencana} program sudah terlaksana` },
  ].filter((item) => item !== false);
  return (
    <section className="mt-12 break-inside-avoid">
      <h3 className="eyebrow font-sans font-normal">Angka kunci komisariatmu</h3>
      <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
        {kartu.map((item) => (
          <div key={item.judul} className="bg-background p-5">
            <p className="text-sm text-muted-foreground">{item.judul}</p>
            <p className="mt-2 font-serif text-5xl tabular-nums">{item.nilai}<span className="text-2xl text-muted-foreground">%</span></p>
            <p className="mt-2 text-sm text-muted-foreground">{item.rinci}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Catat angka yang sama setiap angkatan dan setiap periode. Arah perubahannya lebih penting daripada angkanya hari ini.</p>
    </section>
  );
}

function Hasil({ jawaban, angka, ulangi }: { jawaban: number[]; angka: AngkaKuis; ulangi: () => void }) {
  const [komisariat, setKomisariat] = useState("");
  const [cabangPilihan, setCabangPilihan] = useState("");
  const [cabangLain, setCabangLain] = useState("");
  const [mintaIdentitas, setMintaIdentitas] = useState(false);
  const cabang = cabangPilihan === CABANG_LAINNYA ? cabangLain.trim() : cabangPilihan;
  const identitasLengkap = komisariat.trim().length >= 2 && cabang.length >= 2;
  const [cerita, setCerita] = useState("");
  const [nama, setNama] = useState("");
  const [kontak, setKontak] = useState("");
  const [bolehDikutip, setBolehDikutip] = useState(false);
  const [persetujuan, setPersetujuan] = useState(false);
  const [kirim, setKirim] = useState<"diam" | "mengirim" | "terkirim" | "gagal">("diam");
  const [pesanGalat, setPesanGalat] = useState("");
  // Skor utama selalu dari pertanyaan inti, supaya sebanding antarkomisariat.
  const jawabanInti = jawaban.slice(0, pertanyaanKuis.length);
  const jawabanLanjutan = jawaban.slice(pertanyaanKuis.length);
  const adaLanjutan = jawabanLanjutan.length === pertanyaanLanjutan.length;
  const skor = jawabanInti.reduce((jumlah, nilai) => jumlah + nilai, 0);
  const skorLanjutan = jawabanLanjutan.reduce((jumlah, nilai) => jumlah + nilai, 0);
  const tingkat = tingkatHasil.find((item) => skor >= item.min && skor <= item.max) ?? tingkatHasil[0];

  const perKelompok = hitungKelompok(kelompokIndikator, pertanyaanKuis, jawabanInti);
  const urutTemuan = [...perKelompok].sort((a, b) => a.persen - b.persen);
  const perLanjutan = adaLanjutan ? hitungKelompok(kelompokLanjutan, pertanyaanLanjutan, jawabanLanjutan) : [];

  const adaCerita = cerita.trim().length > 0;
  const perluPersetujuan = adaCerita || nama.trim().length > 0 || kontak.trim().length > 0;
  const kurang = adaCerita && cerita.trim().length < 20
    ? "Ceritakan kondisi komisariatmu minimal 20 karakter."
    : adaCerita && (!komisariat.trim() || !cabang)
      ? "Isi nama komisariat dan cabang supaya ceritamu bisa ditindaklanjuti."
      : perluPersetujuan && !persetujuan
        ? "Centang persetujuan penyimpanan data untuk mengirim cerita atau kontak."
        : "";

  const kirimHasil = async () => {
    setKirim("mengirim");
    setPesanGalat("");
    try {
      const res = await fetch("/api/kuis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban, komisariat, cabang, ...angka, cerita, nama, kontak, bolehDikutip, persetujuan }),
      });
      if (res.ok) {
        setKirim("terkirim");
        return;
      }
      const isi = await res.json().catch(() => null);
      setPesanGalat(typeof isi?.message === "string" ? isi.message : "");
      setKirim("gagal");
    } catch {
      setKirim("gagal");
    }
  };

  const tanggal = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  // "Teknik" dan "Komisariat Teknik" sama-sama tampil sebagai "Komisariat Teknik".
  const namaKomisariat = komisariat.trim().replace(/^komisariat\s+/i, "");
  const namaCabang = cabang.replace(/^(?:hmi\s+)?cabang\s+/i, "");

  // Judul dokumen menjadi nama berkas bawaan saat laporan disimpan sebagai PDF.
  const cetak = () => {
    const judulAsli = document.title;
    document.title = `Laporan Audit Komisariat ${namaKomisariat} - Cabang ${namaCabang} - HMI Evidence`;
    window.addEventListener("afterprint", () => { document.title = judulAsli; }, { once: true });
    window.print();
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7 print:col-span-12">
        {/* Kop laporan: hanya tampil saat dicetak atau disimpan sebagai PDF. */}
        <div className="mb-10 hidden items-center gap-5 border-b border-border pb-6 print:flex">
          <img src="/hmi-logo.png" alt="" width={147} height={400} className="h-16 w-auto" />
          <div>
            <p className="eyebrow text-primary">HMI Evidence · Laporan Audit Komisariat</p>
            <p className="mt-2 font-serif text-2xl">
              Komisariat {namaKomisariat || <span className="text-muted-foreground">……………………</span>} · Cabang {namaCabang || <span className="text-muted-foreground">……………………</span>}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{tanggal} · ahmadzulfikar.com/kuis</p>
          </div>
        </div>

        {/* Pengantar laporan: memperkenalkan HMI Evidence sebelum hasil audit. Hanya di PDF. */}
        <section className="hidden print:block print:break-after-page">
          <p className="eyebrow text-primary">Pengantar</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight">HMI Evidence: Transformasi Gerakan Organisasi Berbasis Bukti</h2>
          <div className="mt-6 grid gap-4 text-base leading-relaxed">
            <p>HMI Evidence adalah gerakan untuk mentransformasi HMI menjadi organisasi yang berbasis bukti (<em>evidence-based</em>): setiap keputusan perkaderan berangkat dari data dan kenyataan di komisariat, bukan dari kebiasaan atau dugaan.</p>
            <p>HMI Evidence adalah komitmen nyata untuk perkaderan HMI. Perkaderan yang baik tidak cukup ditandai oleh ramainya latihan, tetapi oleh kader yang bertahan, didampingi, dan terus tumbuh berkarya sesudahnya.</p>
            <p>Kuis audit komisariat ini adalah salah satu langkah kecil kami untuk memperlihatkan komitmen itu: menghadirkan ekosistem perkaderan <em>next level</em>, yang dimulai dari keberanian setiap komisariat mengukur dirinya sendiri.</p>
            <p>Laporan ini merangkum hasil audit komisariatmu: skor, angka kunci, serta temuan dan langkah perbaikan untuk setiap jawaban{adaLanjutan ? ", termasuk audit lanjutan tentang kader pasca-LK 2 dan LK 3" : ""}. Bawalah ke rapat pengurus sebagai bahan diskusi bersama.</p>
          </div>
          <p className="mt-8 border-l-2 border-primary pl-4 font-serif text-xl italic">Jangan bicara HMI tanpa bukti.</p>
        </section>

        <span className="eyebrow text-primary">Hasil kuis</span>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-serif text-7xl tabular-nums">{skor}<span className="text-3xl text-muted-foreground"> / {skorMaksimal}</span></p>
            <h2 className="mt-4 font-serif text-3xl">{tingkat.judul}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground"><TeksIstilah>{tingkat.uraian}</TeksIstilah></p>
          </div>
          <div>
            <h3 className="eyebrow font-sans font-normal">Kekuatan per kelompok</h3>
            <ol className="mt-4 grid gap-4">
              {perKelompok.map(({ kelompok, persen }) => (
                <li key={kelompok.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{kelompok.judul}</span>
                    <span className="tabular-nums text-muted-foreground">{persen}%</span>
                  </div>
                  <span className="mt-1 block h-1.5 rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary/75" style={{ width: `${persen}%` }} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {adaLanjutan && (
          <section className="mt-12 break-inside-avoid border border-border p-5 md:p-6">
            <p className="eyebrow text-primary">Audit lanjutan · kader LK 2 dan LK 3</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-10">
              <p className="font-serif text-5xl tabular-nums">{skorLanjutan}<span className="text-2xl text-muted-foreground"> / {pertanyaanLanjutan.length * 3}</span></p>
              <ol className="grid gap-4">
                {perLanjutan.map(({ kelompok, persen }) => (
                  <li key={kelompok.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span>{kelompok.judul} <span className="text-muted-foreground">· {kelompok.sorotan}</span></span>
                      <span className="tabular-nums text-muted-foreground">{persen}%</span>
                    </div>
                    <span className="mt-1 block h-1.5 rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-primary/75" style={{ width: `${persen}%` }} />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Skor utama di atas tetap dihitung dari {pertanyaanKuis.length} pertanyaan inti, supaya bisa dibandingkan antarkomisariat.</p>
          </section>
        )}

        <AngkaKunci angka={angka} />

        <AjakDukung
          className="mt-12 print:hidden"
          uraian="Bagikan hasil komisariatmu ke WhatsApp atau Instagram Story, lalu ajak komisariat lain mengukur dirinya."
          path="/kuis"
          pesan={`Komisariatku ada di tingkat "${tingkat.judul}" (${skor}/${skorMaksimal}) di kuis Seberapa Evidence Komisariatmu? Coba ukur komisariatmu juga, dan dukung Transformasi Gerakan Organisasi Berbasis Bukti.`}
          namaFile="story-kuis-hmi-evidence.png"
          story={{
            label: "Kuis audit komisariat",
            judul: "Seberapa Evidence Komisariatmu?",
            skor: { nilai: skor, maksimal: skorMaksimal, tingkat: tingkat.judul },
            isi: "Ikuti kuis audit komisariat untuk perbaiki tata kelola organisasi yang lebih baik.",
            tautan: "ahmadzulfikar.com/kuis",
          }}
        />

        <section className="mt-14 border-t border-border pt-8 print:mt-0 print:break-before-page print:border-0 print:pt-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl">Temuan audit</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Setiap jawabanmu dibaca sebagai temuan, lengkap dengan satu langkah untuk naik satu tingkat. Kelompok yang paling perlu diperkuat tampil lebih dulu.</p>
            </div>
            <button type="button" onClick={() => (identitasLengkap ? cetak() : setMintaIdentitas(true))} className="inline-flex items-center gap-2 border border-primary px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground print:hidden">
              <Download className="h-4 w-4" /> Unduh laporan (PDF)
            </button>
          </div>
          {mintaIdentitas && (
            <div className="mt-6 border border-primary/40 bg-primary/[0.04] p-5 print:hidden">
              <p className="font-medium">Lengkapi identitas komisariat untuk mengunduh laporan</p>
              <p className="mt-1 text-sm text-muted-foreground">Nama komisariat dan cabang dicantumkan di kop laporan PDF.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input value={komisariat} onChange={(e) => setKomisariat(e.target.value)} maxLength={120} placeholder="Nama komisariat" aria-label="Nama komisariat" />
                <PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} />
              </div>
              <button
                type="button"
                onClick={() => { setMintaIdentitas(false); cetak(); }}
                disabled={!identitasLengkap}
                className="mt-4 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Unduh laporan (PDF)
              </button>
            </div>
          )}
          <div className="mt-8 grid gap-4">
            {urutTemuan.map(({ kelompok, persen, butir }, i) => (
              <KelompokTemuan key={kelompok.id} idKelompok={kelompok.id} judul={kelompok.judul} sorotan={kelompok.sorotan} persen={persen} butir={butir} terbukaAwal={i < 2} />
            ))}
          </div>
          {adaLanjutan && (
            <>
              <h4 className="mt-10 font-serif text-xl print:mt-0 print:break-before-page">Audit lanjutan: kader pasca-LK 2 dan LK 3</h4>
              <div className="mt-4 grid gap-4">
                {perLanjutan.map(({ kelompok, persen, butir }) => (
                  <KelompokTemuan key={kelompok.id} idKelompok={kelompok.id} judul={kelompok.judul} sorotan={kelompok.sorotan} persen={persen} butir={butir} terbukaAwal={false} />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="mt-14 border-t border-border pt-8 print:hidden">
          <h3 className="font-serif text-2xl">Kirim hasil audit dan ceritakan kondisi komisariatmu</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Mengirim hasil audit adalah bagian dari komitmen HMI Evidence: data ini menjadi rujukan perbaikan. Isi nama komisariat dan cabang supaya petanya lengkap. Cerita dan kontak tidak wajib, dan hanya dibaca tim.
          </p>
          {kirim === "terkirim" ? (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-primary" role="status">
              <CheckCircle2 className="h-4 w-4" /> {adaCerita ? "Hasil audit dan ceritamu terkirim. Terima kasih." : "Hasil audit terkirim. Terima kasih."}
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={komisariat} onChange={(e) => setKomisariat(e.target.value)} maxLength={120} placeholder="Nama komisariat" aria-label="Nama komisariat" />
                <PilihCabang pilihan={cabangPilihan} setPilihan={setCabangPilihan} lainnya={cabangLain} setLainnya={setCabangLain} />
              </div>
              <div>
                <label htmlFor="cerita-komisariat" className="text-sm font-medium">Ceritakan kondisi komisariatmu <span className="font-normal text-muted-foreground">(opsional)</span></label>
                <Textarea
                  id="cerita-komisariat"
                  value={cerita}
                  onChange={(e) => setCerita(e.target.value)}
                  maxLength={3000}
                  rows={5}
                  className="mt-2"
                  placeholder="Masalah apa yang paling dirasakan komisariatmu saat ini? Sejak kapan, siapa yang terdampak, dan apa yang sudah dicoba?"
                />
                {adaCerita && <p className="mt-1 text-xs text-muted-foreground">Minimal 20 karakter ({cerita.trim().length}/20)</p>}
              </div>
              {adaCerita && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={nama} onChange={(e) => setNama(e.target.value)} maxLength={80} placeholder="Nama (opsional)" aria-label="Nama" />
                  <Input value={kontak} onChange={(e) => setKontak(e.target.value)} maxLength={120} placeholder="WhatsApp atau email (opsional)" aria-label="WhatsApp atau email" />
                </div>
              )}
              {adaCerita && (
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" checked={bolehDikutip} onChange={(e) => setBolehDikutip(e.target.checked)} />
                  <span>Cerita ini boleh dikutip tanpa menyebut nama dan komisariat.</span>
                </label>
              )}
              {perluPersetujuan && (
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" checked={persetujuan} onChange={(e) => setPersetujuan(e.target.checked)} />
                  <span>Saya setuju data ini disimpan dan dibaca tim HMI Evidence untuk memahami masalah komisariat. Kontak hanya dipakai untuk menindaklanjuti kiriman ini dan tidak dibagikan.</span>
                </label>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <button type="button" onClick={kirimHasil} disabled={kirim === "mengirim" || kurang !== ""} className="bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60">
                  {kirim === "mengirim" ? "Mengirim…" : "Kirim hasil audit"}
                </button>
                {kurang && <p className="text-sm text-muted-foreground">{kurang}</p>}
              </div>
            </div>
          )}
          {kirim === "gagal" && <p className="mt-2 text-sm text-destructive" role="alert">{pesanGalat || "Belum terkirim. Coba lagi sebentar lagi."}</p>}
        </section>

        <button type="button" onClick={ulangi} className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary print:hidden">
          <RotateCcw className="h-4 w-4" /> Ulangi kuis
        </button>

        {/* Penutup laporan: ajakan dukungan. Hanya di PDF. */}
        <section className="hidden print:block print:break-before-page">
          <p className="eyebrow text-primary">Dukungan</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight">Mari wujudkan HMI yang belajar dari bukti.</h2>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)_200px] items-start gap-8">
            <div className="grid gap-4 text-base leading-relaxed">
              <p>Perbaikan perkaderan membutuhkan kepemimpinan yang berani berangkat dari bukti. Karena itu, kami memohon dukungan seluruh kader HMI untuk <strong>Ahmad Zulfikar</strong> sebagai Ketua Umum PB HMI Periode 2026–2028 di Kongres HMI XXXIII.</p>
              <p>Suarakan dukungan ini di komisariatmu dan kepada cabangmu, agar cabangmu turut mendukung Ahmad Zulfikar di Kongres HMI XXXIII.</p>
            </div>
            <figure>
              <img src="/ahmad/profile-centered.webp" alt="Ahmad Zulfikar" width={800} height={1000} className="aspect-[4/5] w-full object-cover object-[center_22%]" />
              <figcaption className="mt-3">
                <span className="block font-serif text-lg">Ahmad Zulfikar</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Kandidat Ketua Umum PB HMI Periode 2026–2028</span>
              </figcaption>
            </figure>
          </div>
          <div className="mt-10 border-t border-border pt-5 text-sm text-muted-foreground">
            <p className="eyebrow text-primary">Yakin Usaha Sampai</p>
            <p className="mt-2">Pelajari gagasan HMI Evidence dan ajak komisariat lain mengukur dirinya di <span className="text-foreground">ahmadzulfikar.com</span></p>
          </div>
        </section>
      </div>

      <div className="lg:col-span-5 print:hidden">
        <AjakanDukungan />
      </div>
    </div>
  );
}

/** Langkah opsional sesudah pertanyaan terakhir: angka retensi kader dan keterlaksanaan program. */
function LangkahAngka({ awal, kembali, lanjut }: { awal: AngkaKuis; kembali: () => void; lanjut: (angka: AngkaKuis) => void }) {
  const [isian, setIsian] = useState<Record<AngkaId, string>>(() => ({
    pesertaLk1: awal.pesertaLk1?.toString() ?? "",
    aktifLk1: awal.aktifLk1?.toString() ?? "",
    programRencana: awal.programRencana?.toString() ?? "",
    programTerlaksana: awal.programTerlaksana?.toString() ?? "",
  }));
  const [galat, setGalat] = useState("");

  const selesai = () => {
    const tidakBulat = angkaKuis.some((item) => isian[item.id].trim() !== "" && !/^\d{1,4}$/.test(isian[item.id].trim()));
    if (tidakBulat) {
      setGalat("Isi dengan angka bulat antara 0 dan 9999.");
      return;
    }
    const angka = { ...angkaKosong };
    for (const item of angkaKuis) angka[item.id] = isian[item.id].trim() === "" ? null : Number(isian[item.id].trim());
    const pesan = periksaAngka(angka);
    if (pesan) {
      setGalat(pesan);
      return;
    }
    lanjut(angka);
  };

  const kolom = (id: AngkaId) => {
    const item = angkaKuis.find((angka) => angka.id === id)!;
    return (
      <label className="grid gap-2 text-sm">
        <span>{item.label}</span>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={9999}
          step={1}
          value={isian[id]}
          onChange={(e) => { setIsian((lama) => ({ ...lama, [id]: e.target.value })); setGalat(""); }}
          className="max-w-[10rem] tabular-nums"
        />
      </label>
    );
  };

  return (
    <section aria-live="polite">
      <div className="flex items-baseline justify-between text-sm text-muted-foreground">
        <span>Langkah terakhir · opsional</span>
        <span>Angka komisariat</span>
      </div>
      <span className="mt-3 block h-1 bg-primary" />
      <h2 className="mt-10 font-serif text-3xl leading-snug md:text-4xl">Angka komisariatmu</h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Dua pasang angka ini membuat hasil auditmu lebih tajam. Boleh dikosongkan bila belum tahu, tetapi justru di situlah temuannya: komisariat yang berbasis bukti tahu angkanya.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <fieldset className="grid gap-5 border border-border p-5">
          <legend className="eyebrow px-2 text-primary">Retensi kader</legend>
          {kolom("pesertaLk1")}
          {kolom("aktifLk1")}
        </fieldset>
        <fieldset className="grid gap-5 border border-border p-5">
          <legend className="eyebrow px-2 text-primary">Keterlaksanaan program</legend>
          {kolom("programRencana")}
          {kolom("programTerlaksana")}
        </fieldset>
      </div>
      {galat && <p className="mt-4 text-sm text-destructive" role="alert">{galat}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" onClick={selesai} className="inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground">
          Lihat hasil audit <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => lanjut(angkaKosong)} className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">Lewati</button>
      </div>
      <button type="button" onClick={kembali} className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Sebelumnya
      </button>
    </section>
  );
}

/** Sesudah pertanyaan inti: tawaran memperdalam audit ke kader pasca-LK 2 dan LK 3. */
function TawaranLanjutan({ ya, tidak, kembali }: { ya: () => void; tidak: () => void; kembali: () => void }) {
  const jenjang = [
    { kode: "LK 1", nama: "Basic Training", ranah: "Pembinaan sikap", status: "Sudah diaudit", selesai: true },
    { kode: "LK 2", nama: "Intermediate Training", ranah: "Penguatan nalar", status: `${pertanyaanLanjutan.filter((p) => p.kelompok === "pasca-lk2").length} soal lanjutan`, selesai: false },
    { kode: "LK 3", nama: "Advance Training", ranah: "Profesionalisme dan karya", status: `${pertanyaanLanjutan.filter((p) => p.kelompok === "pasca-lk3").length} soal lanjutan`, selesai: false },
  ];
  return (
    <section aria-live="polite">
      <div className="flex items-baseline justify-between text-sm text-muted-foreground">
        <span>Audit inti selesai</span>
        <span>{pertanyaanKuis.length} dari {pertanyaanKuis.length}</span>
      </div>
      <span className="mt-3 block h-1 bg-primary" />
      <h2 className="mt-10 font-serif text-3xl leading-snug md:text-4xl">Perdalam audit ke kader pasca-LK 2 dan LK 3?</h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        Audit inti memotret kader setelah LK 1, tahap pembinaan sikap. Perkaderan HMI tidak berhenti di sana: LK 2 mengasah nalar, dan LK 3 membentuk profesionalisme. {pertanyaanLanjutan.length} soal lanjutan menilai apa yang dilakukan komisariatmu terhadap kader setelah kedua jenjang itu.
      </p>
      <ol className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
        {jenjang.map((item) => (
          <li key={item.kode} className={`p-5 ${item.selesai ? "bg-muted/50" : "bg-background"}`}>
            <p className="eyebrow text-primary">{item.kode} · <TeksIstilah>{item.nama}</TeksIstilah></p>
            <p className="mt-2 font-serif text-xl">{item.ranah}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              {item.selesai && <CheckCircle2 className="h-4 w-4 text-primary" />}{item.status}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={ya} className="inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground">
          Ya, lanjutkan audit ({pertanyaanLanjutan.length} soal) <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={tidak} className="border border-border px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary">
          Tidak, lihat hasil
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Sekitar tiga menit. Jawaban audit inti tetap tersimpan.</p>
      <button type="button" onClick={kembali} className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Sebelumnya
      </button>
    </section>
  );
}

export default function KuisPage() {
  const [mulai, setMulai] = useState(false);
  const [langkah, setLangkah] = useState(0);
  const [jawaban, setJawaban] = useState<number[]>([]);
  // null: belum memutuskan audit lanjutan; true/false: sudah memilih.
  const [ikutLanjutan, setIkutLanjutan] = useState<boolean | null>(null);
  const [angka, setAngka] = useState<AngkaKuis>(angkaKosong);
  const [angkaSelesai, setAngkaSelesai] = useState(false);

  const jumlahInti = pertanyaanKuis.length;
  const daftar = ikutLanjutan ? [...pertanyaanKuis, ...pertanyaanLanjutan] : pertanyaanKuis;
  const tawaran = langkah === jumlahInti && ikutLanjutan === null && jawaban.length >= jumlahInti;
  const semuaTerjawab = !tawaran && ikutLanjutan !== null && langkah >= daftar.length && jawaban.length >= daftar.length;
  const selesai = semuaTerjawab && angkaSelesai;
  const pertanyaan = !tawaran && langkah < daftar.length ? daftar[langkah] : undefined;
  const bagianLanjutan = langkah >= jumlahInti;
  const nomor = bagianLanjutan ? langkah - jumlahInti + 1 : langkah + 1;
  const total = bagianLanjutan ? pertanyaanLanjutan.length : jumlahInti;
  const judulKelompok = pertanyaan
    ? (bagianLanjutan ? kelompokLanjutan : kelompokIndikator).find((item) => item.id === pertanyaan.kelompok)?.judul
    : undefined;

  const pilih = (skor: number) => {
    const baru = [...jawaban];
    baru[langkah] = skor;
    setJawaban(baru);
    window.setTimeout(() => {
      setLangkah((lama) => lama + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  };

  const ulangi = () => {
    setJawaban([]);
    setLangkah(0);
    setIkutLanjutan(null);
    setAngka(angkaKosong);
    setAngkaSelesai(false);
    setMulai(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main className={`container mx-auto w-full flex-1 px-6 pb-24 pt-32 md:px-10 md:pt-40 print:max-w-none print:px-0 print:pb-0 print:pt-0 ${selesai ? "max-w-6xl" : "max-w-4xl"}`}>
        {!mulai && (
          <header>
            <span className="eyebrow mb-6 block">Kuis Komisariat</span>
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">Seberapa evidence komisariatmu?</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {jumlahInti} pertanyaan inti tentang kebiasaan komisariatmu sehari-hari, yang bisa diperdalam dengan {pertanyaanLanjutan.length} soal lanjutan tentang kader pasca-LK 2 dan LK 3, ditambah empat angka opsional. Sekitar tujuh sampai sepuluh menit. Jawab sesuai keadaan sekarang, bukan keadaan yang diharapkan. Hasilnya berupa laporan audit: temuan untuk setiap jawaban, langkah untuk naik satu tingkat, dan laporan yang bisa diunduh sebagai PDF untuk rapat pengurus.
            </p>
            <button type="button" onClick={() => setMulai(true)} className="mt-10 inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground">
              Mulai kuis <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-4 text-xs text-muted-foreground">Tidak perlu mendaftar. Jawabanmu tidak dikirim ke mana pun kecuali kamu memilih mengirimnya di akhir.</p>
          </header>
        )}

        {mulai && pertanyaan && (
          <section aria-live="polite">
            <div className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
              <span>{bagianLanjutan && <span className="hidden sm:inline">Audit lanjutan · </span>}Pertanyaan {nomor} dari {total}</span>
              <span className="text-right">{judulKelompok}</span>
            </div>
            <span className="mt-3 block h-1 bg-muted">
              <span className="block h-full bg-primary transition-[width] duration-300" style={{ width: `${((nomor - 1) / total) * 100}%` }} />
            </span>

            <h2 key={pertanyaan.id} className="mt-10 font-serif text-3xl leading-snug md:text-4xl"><TeksIstilah>{pertanyaan.teks}</TeksIstilah></h2>

            <div className="mt-8 grid gap-3" role="radiogroup" aria-label={pertanyaan.teks}>
              {pertanyaan.pilihan.map((pilihan) => {
                const dipilih = jawaban[langkah] === pilihan.skor;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={dipilih}
                    key={pilihan.label}
                    onClick={() => pilih(pilihan.skor)}
                    className={`border px-5 py-4 text-left leading-snug transition-colors ${dipilih ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-primary/5"}`}
                  >
                    <TeksIstilah>{pilihan.label}</TeksIstilah>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setLangkah((lama) => Math.max(0, lama - 1))}
              disabled={langkah === 0}
              className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Sebelumnya
            </button>
          </section>
        )}

        {mulai && tawaran && (
          <TawaranLanjutan
            ya={() => { setIkutLanjutan(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            tidak={() => { setIkutLanjutan(false); setJawaban((lama) => lama.slice(0, jumlahInti)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            kembali={() => setLangkah(jumlahInti - 1)}
          />
        )}

        {semuaTerjawab && !angkaSelesai && (
          <LangkahAngka
            awal={angka}
            kembali={() => {
              // Tanpa audit lanjutan, kembali ke tawaran supaya pilihannya bisa diubah.
              if (ikutLanjutan) setLangkah(daftar.length - 1);
              else { setIkutLanjutan(null); setLangkah(jumlahInti); }
            }}
            lanjut={(isian) => {
              setAngka(isian);
              setAngkaSelesai(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {selesai && <Hasil jawaban={jawaban.slice(0, daftar.length)} angka={angka} ulangi={ulangi} />}
      </main>
      <SiteFooter />
    </div>
  );
}
