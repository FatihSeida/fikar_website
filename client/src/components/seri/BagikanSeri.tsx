import BagikanHalaman, { potongKata } from "@/components/BagikanHalaman";
import type { InfoSeri } from "./tipe";

/** Baris bagikan untuk halaman Series, dengan kartu Story yang memuat nomor, judul, dan caption seri. */
export default function BagikanSeri({ seri, gelap = true, className = "" }: { seri: InfoSeri; gelap?: boolean; className?: string }) {
  const nomor = String(seri.nomor).padStart(2, "0");
  return (
    <BagikanHalaman
      gelap={gelap}
      className={className}
      path={`/series/${seri.slug}`}
      judul={seri.judul}
      pesan={`Baca “${seri.judul}”, Series ${nomor} HMI Evidence oleh Ahmad Zulfikar.`}
      namaFile={`story-series-${nomor}.png`}
      story={{
        label: `Series ${nomor}`,
        judul: seri.judul,
        isi: seri.subjudul ? potongKata(seri.subjudul, 230) : undefined,
        tautan: "ahmadzulfikar.com/series",
      }}
    />
  );
}
