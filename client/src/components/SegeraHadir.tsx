import { useEffect, useState, type ComponentType } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { auditSudahDibuka, PELUNCURAN_AUDIT } from "@shared/audit";
import { RILIS, sudahRilis, type FiturRilis } from "@shared/rilis";

function pecahWaktu(ms: number) {
  const detikTotal = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "Hari", nilai: Math.floor(detikTotal / 86400) },
    { label: "Jam", nilai: Math.floor((detikTotal % 86400) / 3600) },
    { label: "Menit", nilai: Math.floor((detikTotal % 3600) / 60) },
    { label: "Detik", nilai: detikTotal % 60 },
  ];
}

export type IsiSegeraHadir = { eyebrow: string; judul: string; uraian: string; peluncuran: number; catatanAdmin: string };

const isiAudit: IsiSegeraHadir = {
  eyebrow: "Segera hadir · 7 Oktober 2026",
  judul: "Seberapa Evidence Komisariatmu?",
  uraian: "Kuis audit komisariat sedang kami siapkan: 20 pertanyaan inti, audit lanjutan untuk kader pasca-LK 2 dan LK 3, serta laporan PDF untuk dibawa ke rapat pengurus. Dibuka serentak untuk seluruh komisariat pada 7 Oktober 2026.",
  peluncuran: PELUNCURAN_AUDIT,
  catatanAdmin: "dibuka untuk umum 7 Oktober 2026",
};

/** "4 November 2026, 15.00 WIB" */
function tanggalRilis(peluncuran: number) {
  const tanggal = new Date(peluncuran).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
  const jam = new Date(peluncuran).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
  return `${tanggal}, ${jam} WIB`;
}

/** Dialog "Segera hadir" untuk fitur yang belum dibuka, lengkap dengan hitung mundur. */
export function SegeraHadir({ isi = isiAudit }: { isi?: IsiSegeraHadir }) {
  const [, navigate] = useLocation();
  const [sisa, setSisa] = useState(() => isi.peluncuran - Date.now());

  useEffect(() => {
    const jam = window.setInterval(() => {
      const baru = isi.peluncuran - Date.now();
      setSisa(baru);
      if (baru <= 0) window.location.reload();
    }, 1000);
    return () => window.clearInterval(jam);
  }, [isi.peluncuran]);

  return (
    <div className="min-h-screen bg-[hsl(var(--evidence))]">
      <Navbar />
      <DialogPrimitive.Root open onOpenChange={(buka) => { if (!buka) navigate("/"); }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[300] bg-[radial-gradient(ellipse_at_50%_40%,rgb(7_22_16/.72),rgb(2_8_6/.92))] backdrop-blur-sm" />
          <DialogPrimitive.Content
            className="fixed left-1/2 top-1/2 z-[301] w-[min(600px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[64px_20px_20px_20px] bg-[linear-gradient(158deg,#0d2a1e_0%,#081b13_46%,#051209_100%)] text-[#f6f4e9] shadow-[0_50px_120px_rgb(0_0_0/.55)] outline-none"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="pointer-events-none absolute inset-3 rounded-[54px_12px_12px_12px] border border-[#dcc38a]/35" aria-hidden="true" />
            <div className="relative px-7 pb-8 pt-12 sm:px-12 sm:pb-11 sm:pt-14">
              <DialogPrimitive.Close className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[#dcc38a]/45 bg-black/30 text-[#e8d19b] transition-colors hover:bg-[#dcc38a]/15" aria-label="Tutup dan kembali ke beranda">
                <X size={16} />
              </DialogPrimitive.Close>
              <p className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-[#dcc38a]">
                {isi.eyebrow}
                <span className="h-px w-14 bg-gradient-to-r from-[#dcc38a] to-transparent" aria-hidden="true" />
              </p>
              <DialogPrimitive.Title className="mt-5 font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl">
                {isi.judul}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-5 text-[15px] leading-relaxed text-[#e9eee3]/75">
                {isi.uraian}
              </DialogPrimitive.Description>

              <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label="Hitung mundur pembukaan">
                {pecahWaktu(sisa).map((bagian) => (
                  <div key={bagian.label} className="rounded-[4px_14px_4px_4px] border border-[#dcc38a]/28 bg-black/25 px-2 py-3 text-center">
                    <p className="font-serif text-3xl tabular-nums text-[#e8d19b] sm:text-4xl">{String(bagian.nilai).padStart(2, "0")}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#e9eee3]/55">{bagian.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                <Link href="/hmi-evidence" className="inline-flex items-center justify-between gap-2 bg-gradient-to-br from-[#e5cf95] to-[#c9a95e] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0a1f16]">
                  Baca HMI Evidence <ArrowRight size={16} />
                </Link>
                <Link href="/kuis" className="inline-flex items-center justify-between gap-2 border border-white/25 px-5 py-3.5 text-xs uppercase tracking-[0.14em] text-white transition-colors hover:border-[#dcc38a]">
                  Ikuti kuis audit <ArrowRight size={16} className="text-[#dcc38a]" />
                </Link>
              </div>
              <Link href="/" className="mt-5 inline-block text-xs text-[#e9eee3]/55 underline-offset-4 hover:text-white hover:underline">Kembali ke beranda</Link>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}

/**
 * Membuka halaman hanya setelah jadwal peluncurannya. Sebelum itu pengunjung
 * melihat dialog "Segera hadir" dan kode halamannya tidak dimuat; admin yang
 * sedang masuk tetap bisa meninjaunya. Di localhost semua fitur langsung
 * terbuka untuk ditinjau; tambahkan ?segera untuk melihat dialognya.
 */
function Gerbang({ terbuka, isi, halaman: Halaman }: { terbuka: boolean; isi: IsiSegeraHadir; halaman: ComponentType }) {
  const pratinjau = terbuka || (import.meta.env.DEV && !/[?&]segera/.test(window.location.search));
  const { data } = useQuery<{ isAdmin: boolean }>({ queryKey: ["/api/admin/check"], enabled: !pratinjau, staleTime: 60_000 });

  if (pratinjau) return <Halaman />;
  if (!data) return <div className="min-h-screen bg-background" />;
  if (!data.isAdmin) return <SegeraHadir isi={isi} />;
  return (
    <>
      <Halaman />
      <p className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] left-1/2 z-[80] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#dcc38a]/50 bg-[hsl(var(--evidence))] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#e8d19b] shadow-lg md:bottom-5 print:hidden">
        Pratinjau admin · {isi.catatanAdmin}
      </p>
    </>
  );
}

/** Kuis audit dan halaman Audit Komisariat, dibuka 7 Oktober 2026. */
export function GerbangAudit({ halaman }: { halaman: ComponentType }) {
  return <Gerbang terbuka={auditSudahDibuka()} isi={isiAudit} halaman={halaman} />;
}

/** Fitur kampanye dengan jadwal di shared/rilis.ts. */
export function GerbangRilis({ fitur, halaman, judul, uraian }: { fitur: FiturRilis; halaman: ComponentType; judul: string; uraian: string }) {
  const tanggal = tanggalRilis(RILIS[fitur]);
  const isi: IsiSegeraHadir = {
    eyebrow: `Segera hadir · ${tanggal}`,
    judul,
    uraian,
    peluncuran: RILIS[fitur],
    catatanAdmin: `dibuka untuk umum ${tanggal}`,
  };
  return <Gerbang terbuka={sudahRilis(fitur)} isi={isi} halaman={halaman} />;
}
