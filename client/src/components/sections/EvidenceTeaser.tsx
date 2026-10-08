import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import TeksIstilah from "@/components/TeksIstilah";
import VisiMisiDialog from "@/components/VisiMisiDialog";
import { tigaMasalah } from "@/lib/pesan";
import { RILIS, sudahRilis, type FiturRilis } from "@shared/rilis";

/** Pintu masuk di slide pertama. Kartu fitur kampanye baru tampil di situs publik sesudah jadwal rilisnya. */
const pintu: { judul: string; uraian: string; href: string; fitur?: FiturRilis }[] = [
  {
    judul: "Apa itu HMI Evidence",
    uraian: "Bukti sebagai dasar perkaderan: masalah dikenali, perjalanan kader dicatat, hasil dievaluasi.",
    href: "/hmi-evidence",
  },
  {
    judul: "Siapa Zulfikar",
    uraian: "Kader HMI Cabang Gowa Raya, Kandidat Ketua Umum PB HMI Periode 2026–2028.",
    href: "/tentang",
  },
  {
    judul: "Seberapa Evidence Komisariatmu?",
    uraian: "Ikuti kuis audit atau kirim masalah komisariatmu. Keduanya menjadi bukti untuk perbaikan HMI.",
    href: "/ikut",
  },
  {
    judul: "Sehari di Kursi Ketum",
    uraian: "Jalani satu hari sebagai ketua umum dalam 15 situasi, lalu lihat potret cara memimpinmu.",
    href: "/kursi-ketum",
    fitur: "kursi-ketua",
  },
  {
    judul: "Bangun HMI Bersama",
    uraian: "Nilai bagian-bagian bangunan HMI, lalu pilih yang paling dulu harus diperbaiki.",
    href: "/bangun-hmi",
    fitur: "bangun-hmi",
  },
  {
    judul: "Framework Maturity Cabang",
    uraian: "Untuk pengurus cabang: nilai enam dimensi kerja cabang, lalu unduh panduan dan templatnya.",
    href: "/maturity-cabang",
    fitur: "maturity-cabang",
  },
];

const seri: FiturRilis[] = ["series-1", "series-2", "series-3", "series-4"];

/** "Rabu, 21 Okt" */
const tanggalPendek = (waktu: number) =>
  new Date(waktu).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", timeZone: "Asia/Jakarta" });

// Kapan setiap slide muncul dan hilang pada progres gulir, untuk dua atau tiga slide.
const RENTANG = {
  2: { isi: [[0, 0.3, 0.5], [0.44, 0.66, 1]], gambar: [[0, 0.48, 0.62], [0.42, 0.6, 1]] },
  3: { isi: [[0, 0.18, 0.34], [0.28, 0.46, 0.64], [0.58, 0.76, 1]], gambar: [[0, 0.34, 0.46], [0.3, 0.48, 0.66], [0.56, 0.74, 1]] },
};
const keluaran = (urutan: number, jumlah: number) => (urutan === 0 ? [1, 1, 0] : urutan === jumlah - 1 ? [0, 1, 1] : [0, 1, 0]);

type PropsSlide = { progres: MotionValue<number>; rentang: number[]; nilai: number[] };

function GambarSlide({ progres, rentang, nilai, skala, src, alt }: PropsSlide & { skala: MotionValue<number>; src: string; alt: string }) {
  const opacity = useTransform(progres, rentang, nilai);
  return <motion.img style={{ scale: skala, opacity }} src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />;
}

function IsiSlide({ progres, rentang, nilai, children }: PropsSlide & { children: ReactNode }) {
  const opacity = useTransform(progres, rentang, nilai);
  // Tombol di dalam slide hanya bisa diklik saat slide itu benar-benar terlihat.
  const pointerEvents = useTransform(opacity, (v) => (v > 0.6 ? "auto" : "none"));
  return (
    <motion.div style={{ opacity, pointerEvents }} className="absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-10">
      {children}
    </motion.div>
  );
}

function SlideMulai() {
  const tampil = pintu.filter((item) => !item.fitur || import.meta.env.DEV || sudahRilis(item.fitur));
  return (
    <>
      <h2 className="text-shadow-cinematic max-w-3xl font-serif text-3xl leading-tight md:text-6xl">Transformasi Gerakan Organisasi Berbasis Bukti.</h2>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70 max-md:[@media(max-height:760px)]:hidden md:mt-5">Komitmen HMI Evidence menghadirkan ekosistem perkaderan berkelanjutan.</p>
      <span className="evidence-kicker mt-6 block text-white/60 max-md:[@media(max-height:700px)]:hidden md:mt-8">Mulai di sini</span>
      <ol className="mt-3 grid max-w-5xl gap-1.5 md:mt-4 md:auto-rows-fr md:grid-cols-3 md:gap-3">
        {tampil.map((item, index) => (
          <li key={item.href}>
            <Link href={item.href} className="group flex h-full items-center gap-4 border border-white/15 bg-black/35 px-4 py-2.5 backdrop-blur-sm transition-colors hover:border-[hsl(var(--gold))] md:flex-col md:items-start md:gap-0 md:p-5">
              <span className="font-serif text-xl text-[hsl(var(--gold))] md:text-2xl">0{index + 1}</span>
              <span className="flex-1">
                <span className="block font-serif text-lg md:mt-2 md:text-xl">{item.judul}</span>
                <span className="mt-1.5 hidden text-sm leading-relaxed text-white/65 md:block md:[@media(max-height:900px)]:hidden">{item.uraian}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[hsl(var(--gold))] transition-transform group-hover:translate-x-1 md:mt-4" />
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}

function SlideSeries() {
  return (
    <>
      <span className="evidence-kicker block">Series HMI Evidence</span>
      <h2 className="text-shadow-cinematic mt-5 max-w-3xl font-serif text-3xl leading-tight md:text-6xl">Empat seri tentang arah kaderisasi HMI.</h2>
      <p className="mt-4 max-w-xl leading-relaxed text-white/70 max-md:[@media(max-height:700px)]:hidden md:mt-5 md:text-lg">
        Tulisan Ahmad Zulfikar yang berangkat dari keadaan komisariat dan cabang. Terbit setiap Rabu pukul 15.00 WIB dan bisa ditanggapi atas nama komisariat dan cabangmu.
      </p>
      <ol className="mt-6 grid max-w-5xl grid-cols-2 gap-2 md:mt-8 md:grid-cols-4 md:gap-3">
        {seri.map((fitur, index) => (
          <li key={fitur}>
            <Link href="/series" className="group block h-full border border-white/15 bg-black/35 p-4 backdrop-blur-sm transition-colors hover:border-[hsl(var(--gold))] md:p-5">
              <span className="font-serif text-2xl text-[hsl(var(--gold))]">0{index + 1}</span>
              <span className="mt-2 block text-xs uppercase tracking-[0.14em] text-white/65">{sudahRilis(fitur) ? "Sudah terbit" : tanggalPendek(RILIS[fitur])}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link href="/series" className="mt-6 inline-flex items-center gap-2 bg-[hsl(var(--gold))] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--evidence))] transition-transform hover:-translate-y-0.5 md:mt-8">
        Baca Series <ArrowRight className="h-4 w-4" />
      </Link>
    </>
  );
}

function SlideMasalah({ bukaVisiMisi }: { bukaVisiMisi: () => void }) {
  return (
    <>
      <span className="evidence-kicker block">Tiga masalah yang paling terasa</span>
      <h2 className="text-shadow-cinematic mt-3 max-w-3xl font-serif text-3xl leading-tight md:mt-5 md:text-5xl">Yang dirasakan kader, dan jawaban HMI Evidence.</h2>
      {/* Di ponsel ketiganya digeser ke samping supaya muat dalam satu layar. */}
      <ol className="-mx-6 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:mt-10 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden">
        {tigaMasalah.map((item, index) => (
          <li key={item.masalah} className="w-[88%] shrink-0 snap-center border border-white/15 bg-black/45 p-4 backdrop-blur-sm md:w-auto md:p-6">
            <span className="font-serif text-xl text-[hsl(var(--gold))] md:text-2xl">0{index + 1}</span>
            <h3 className="mt-2 font-serif text-lg leading-snug md:mt-3 md:text-2xl"><TeksIstilah>{item.masalah}</TeksIstilah></h3>
            <p className="mt-2 text-[13px] leading-normal text-white/75 md:mt-3 md:text-sm md:leading-relaxed"><TeksIstilah>{item.jawaban}</TeksIstilah></p>
          </li>
        ))}
      </ol>
      <button type="button" onClick={bukaVisiMisi} className="mt-4 inline-flex items-center gap-2 border-b border-[hsl(var(--gold))] pb-1 text-sm text-[hsl(var(--gold))] md:mt-8">
        Lihat visi, misi, dan program strategis <ArrowRight className="h-4 w-4" />
      </button>
    </>
  );
}

export default function EvidenceTeaser() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const skala = useTransform(scrollYProgress, [0, 1], [1.1, 1.01]);
  const [visiMisiOpen, setVisiMisiOpen] = useState(false);
  // Slide Series ikut jadwal terbit Series 1; jumlah slide tetap selama halaman terbuka.
  const [seriTampil] = useState(() => import.meta.env.DEV || sudahRilis("series-1"));

  const slide = [
    { kunci: "mulai", gambar: "/scrollytelling/hmi-evidence-05-berbasis-bukti-v1.webp", alt: "Ilustrasi ekosistem perkaderan berbasis bukti", isi: <SlideMulai /> },
    ...(seriTampil ? [{ kunci: "series", gambar: "/scrollytelling/hmi-evidence-03-perubahan-zaman-v1.webp", alt: "Ilustrasi perubahan zaman", isi: <SlideSeries /> }] : []),
    { kunci: "masalah", gambar: "/scrollytelling/hmi-evidence-04-lingkaran-organisasi-v1.webp", alt: "Ilustrasi ruang organisasi dan perjalanan kader", isi: <SlideMasalah bukaVisiMisi={() => setVisiMisiOpen(true)} /> },
  ];
  const rentang = RENTANG[slide.length as 2 | 3];

  return (
    <>
      <section ref={ref} className={`relative ${slide.length === 3 ? "h-[260vh]" : "h-[190vh]"} bg-[hsl(var(--evidence))] text-white`}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {slide.map((item, i) => (
            <GambarSlide key={item.kunci} progres={scrollYProgress} rentang={rentang.gambar[i]} nilai={keluaran(i, slide.length)} skala={skala} src={item.gambar} alt={item.alt} />
          ))}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />
          <div className="container relative mx-auto h-full px-6 md:px-10">
            {slide.map((item, i) => (
              <IsiSlide key={item.kunci} progres={scrollYProgress} rentang={rentang.isi[i]} nilai={keluaran(i, slide.length)}>
                {item.isi}
              </IsiSlide>
            ))}

            <div className="absolute bottom-8 left-6 right-6 h-px bg-white/20 md:left-10 md:right-10">
              <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "left" }} className="h-full bg-[hsl(var(--gold))]" />
            </div>
          </div>
        </div>
      </section>
      <VisiMisiDialog open={visiMisiOpen} onOpenChange={setVisiMisiOpen} />
    </>
  );
}
