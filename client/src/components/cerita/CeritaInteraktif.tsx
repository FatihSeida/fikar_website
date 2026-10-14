import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import type { CeritaSeri } from "@shared/cerita";
import type { PropsHalamanSeri } from "@/components/seri/tipe";
import LatarHidup from "./LatarHidup";
import Pembuka from "./Pembuka";
import Bab from "./Bab";
import { Penutup } from "./Penutup";
import { DaftarIsiMengambang } from "./DaftarIsi";
import { gulirKe, useDaftarAdegan } from "./alat";

/**
 * Cerita interaktif Series 1 dan 2: pembuka, bagian-bagian bergambar, penutup,
 * lalu kolom tanggapan kader. Semua bagian terbuka sejak awal; pembaca bebas
 * menggulir atau melompat lewat daftar isi.
 */

const hitungMenit = (cerita: CeritaSeri) => {
  const teks = [
    cerita.pembuka.pengantar,
    ...cerita.bab.flatMap((b) => [b.judul, b.inti, ...(b.poin ?? []), b.lanjut?.isi ?? "", b.dalam?.isi ?? "", b.dalam?.kutipan ?? ""]),
    cerita.penutup.isi,
  ].join(" ");
  return Math.max(3, Math.round(teks.split(/\s+/).filter(Boolean).length / 200));
};

function useTerlihat(rootMargin = "0px") {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [ya, setYa] = useState(false);
  useEffect(() => {
    if (!el || typeof IntersectionObserver === "undefined") return;
    const pengamat = new IntersectionObserver(([e]) => setYa(e.isIntersecting), { rootMargin });
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, [el, rootMargin]);
  return [setEl, ya] as const;
}

/**
 * Mesin 3D (sekitar 800 KB sebelum dikompres) tidak ikut diunduh saat halaman dibuka.
 * Ia diunduh sesudah halaman selesai digambar dan peramban senggang, supaya sudah siap
 * ketika pembaca menggulir ke adegan pertama. Dilewati bila pembaca menghemat kuota.
 */
function useMuatMesin3D() {
  useEffect(() => {
    const koneksi = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (koneksi?.saveData) return;
    const muat = () => { void import("./Kanvas3D"); };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(muat, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(muat, 2000);
    return () => window.clearTimeout(id);
  }, []);
}

export default function CeritaInteraktif({ seri, cerita, tanggapan }: PropsHalamanSeri & { cerita: CeritaSeri }) {
  const tenang = useReducedMotion() ?? false;
  const daftar = useDaftarAdegan(seri.slug);
  const [aktif, setAktif] = useState(-1);
  const menit = useMemo(() => hitungMenit(cerita), [cerita]);
  useMuatMesin3D();

  const [refPembuka, pembukaTerlihat] = useTerlihat();
  const [refCerita, ceritaTerlihat] = useTerlihat();
  const [refTanggapan, tanggapanTerlihat] = useTerlihat();

  // Bagian yang sedang melintasi garis tengah layar menjadi bagian aktif (daftar isi dan arah cahaya latar).
  const wadahBab = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wadah = wadahBab.current;
    if (!wadah || typeof IntersectionObserver === "undefined") return;
    const pengamat = new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          if (!e.isIntersecting) continue;
          const i = cerita.bab.findIndex((b) => b.id === e.target.id);
          if (i >= 0) setAktif(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    wadah.querySelectorAll("section[id]").forEach((s) => pengamat.observe(s));
    return () => pengamat.disconnect();
  }, [cerita.bab]);

  const pilih = useCallback((id: string) => gulirKe(id, tenang), [tenang]);
  const mulai = () => gulirKe(cerita.bab[0]?.id ?? "penutup", tenang);

  const sisiCahaya = aktif < 0 || pembukaTerlihat ? "kanan" : aktif % 2 === 0 ? "kanan" : "kiri";

  return (
    <div className="relative isolate min-h-screen text-[#F6F4E9]">
      <LatarHidup tenang={tenang} sisi={sisiCahaya} jalan={ceritaTerlihat} />
      <Navbar gelap />

      <main ref={refCerita}>
        <Pembuka
          ref={refPembuka}
          seri={seri}
          cerita={cerita}
          menit={menit}
          tenang={tenang}
          onMulai={mulai}
          onPilih={pilih}
        />

        <div ref={wadahBab}>
          {cerita.bab.map((bab, i) => (
            <Bab
              key={bab.id}
              bab={bab}
              indeks={i}
              entri={daftar?.[bab.adegan]}
              memuat={daftar === null}
              tenang={tenang}
            />
          ))}
        </div>

        <Penutup cerita={cerita} tenang={tenang} />
      </main>

      <section ref={refTanggapan} aria-label="Tanggapan kader" className="relative bg-background px-5 pb-24 pt-16 text-foreground md:px-8">
        <div className="mx-auto max-w-3xl">{tanggapan}</div>
      </section>

      <SiteFooter />

      <DaftarIsiMengambang
        tampil={!pembukaTerlihat && !tanggapanTerlihat && aktif >= 0}
        bab={cerita.bab}
        aktif={aktif}
        onPilih={pilih}
        tenang={tenang}
      />
    </div>
  );
}
