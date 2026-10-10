import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import type { CeritaSeri } from "@shared/cerita";
import type { PropsHalamanSeri } from "@/components/seri/tipe";
import LatarHidup from "./LatarHidup";
import Pembuka from "./Pembuka";
import Bab from "./Bab";
import { BagianTerkunci, Penutup } from "./Penutup";
import { DaftarIsiMengambang } from "./DaftarIsi";
import { gulirKe, useDaftarAdegan, useKemajuan } from "./alat";

/**
 * Cerita interaktif Series 1 dan 2: pembuka, bagian-bagian bergambar yang
 * terbuka satu per satu setelah pembaca menandai paham, penutup, lalu kolom
 * tanggapan kader. Kemajuan disimpan per seri di perangkat pembaca.
 */

const hitungMenit = (cerita: CeritaSeri) => {
  const teks = [
    cerita.pembuka.pengantar,
    ...cerita.bab.flatMap((b) => [b.judul, b.inti, ...(b.poin ?? []), b.lanjut?.isi ?? "", b.dalam?.isi ?? "", b.dalam?.kutipan ?? "", b.pahami]),
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

export default function CeritaInteraktif({ seri, cerita, tanggapan }: PropsHalamanSeri & { cerita: CeritaSeri }) {
  const tenang = useReducedMotion() ?? false;
  const jumlah = cerita.bab.length;
  const { sampai, paham, ulangi } = useKemajuan(seri.slug, jumlah);
  const daftar = useDaftarAdegan(seri.slug);
  const [putaran, setPutaran] = useState(0);
  const [tuju, setTuju] = useState<string | null>(null);
  const [aktif, setAktif] = useState(-1);
  // Bagian yang dibuka selama kunjungan ini diberi animasi masuk; yang sudah terbuka sebelumnya langsung tampil.
  const awalTerbuka = useRef(sampai);
  const menit = useMemo(() => hitungMenit(cerita), [cerita]);

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
  }, [cerita.bab, sampai, putaran]);

  useEffect(() => {
    if (!tuju) return;
    setTuju(null);
    // Tunggu bagian baru selesai digambar sebelum digulir ke sana.
    requestAnimationFrame(() => requestAnimationFrame(() => gulirKe(tuju, tenang)));
  }, [tuju, tenang]);

  const tandaiPaham = useCallback((indeks: number) => {
    paham(indeks);
    setTuju(indeks + 1 < jumlah ? cerita.bab[indeks + 1].id : "penutup");
  }, [paham, jumlah, cerita.bab]);

  const mulaiLagi = useCallback(() => {
    ulangi();
    awalTerbuka.current = 0;
    setPutaran((p) => p + 1);
    setAktif(-1);
    if (cerita.bab[0]) setTuju(cerita.bab[0].id);
  }, [ulangi, cerita.bab]);

  const pilih = useCallback((id: string) => gulirKe(id, tenang), [tenang]);
  const mulai = () => gulirKe(sampai >= jumlah ? "penutup" : cerita.bab[Math.min(sampai, jumlah - 1)]?.id ?? "penutup", tenang);

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
          sampai={sampai}
          menit={menit}
          tenang={tenang}
          onMulai={mulai}
          onPilih={pilih}
          onUlangi={mulaiLagi}
        />

        <div ref={wadahBab}>
          {cerita.bab.map((bab, i) => i <= sampai && (
            <Bab
              key={`${bab.id}-${putaran}`}
              bab={bab}
              indeks={i}
              jumlah={jumlah}
              entri={daftar?.[bab.adegan]}
              memuat={daftar === null}
              tenang={tenang}
              sudahPaham={i < sampai}
              baru={i > awalTerbuka.current}
              onPaham={() => tandaiPaham(i)}
              onLanjut={() => gulirKe(i + 1 < jumlah ? cerita.bab[i + 1].id : "penutup", tenang)}
            />
          ))}
        </div>

        {sampai < jumlah ? (
          <BagianTerkunci bab={cerita.bab} sampai={sampai} />
        ) : (
          <Penutup key={`penutup-${putaran}`} cerita={cerita} baru={awalTerbuka.current < jumlah} tenang={tenang} onUlangi={mulaiLagi} />
        )}
      </main>

      <section ref={refTanggapan} aria-label="Tanggapan kader" className="relative bg-background px-5 pb-24 pt-16 text-foreground md:px-8">
        <div className="mx-auto max-w-3xl">{tanggapan}</div>
      </section>

      <SiteFooter />

      <DaftarIsiMengambang
        tampil={!pembukaTerlihat && !tanggapanTerlihat && aktif >= 0}
        bab={cerita.bab}
        sampai={sampai}
        aktif={aktif}
        onPilih={pilih}
        onUlangi={mulaiLagi}
        tenang={tenang}
      />
    </div>
  );
}
