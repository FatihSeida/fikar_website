import { useState } from "react";
import { Facebook, Link2, Linkedin, MessageCircle, Send, Share2, Twitter } from "lucide-react";
import TombolStory from "@/components/TombolStory";
import type { IsiStory } from "@/lib/story";

/**
 * Baris bagikan untuk halaman tulisan (catatan dan Series): WhatsApp, Facebook, X,
 * Telegram, LinkedIn, lembar bagikan perangkat, Instagram Story, dan salin tautan.
 * Setiap tautan diberi `ref=bagikan-<tujuan>` supaya asal kunjungan terlihat di analytics.
 */

const enc = encodeURIComponent;

const tujuan = [
  { kode: "wa", nama: "WhatsApp", Ikon: MessageCircle, url: (tautan: string, pesan: string) => `https://wa.me/?text=${enc(`${pesan}\n\n${tautan}`)}` },
  { kode: "fb", nama: "Facebook", Ikon: Facebook, url: (tautan: string) => `https://www.facebook.com/sharer/sharer.php?u=${enc(tautan)}` },
  { kode: "x", nama: "X", Ikon: Twitter, url: (tautan: string, pesan: string) => `https://twitter.com/intent/tweet?text=${enc(pesan)}&url=${enc(tautan)}` },
  { kode: "tg", nama: "Telegram", Ikon: Send, url: (tautan: string, pesan: string) => `https://t.me/share/url?url=${enc(tautan)}&text=${enc(pesan)}` },
  { kode: "li", nama: "LinkedIn", Ikon: Linkedin, url: (tautan: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(tautan)}` },
];

/** Memotong teks di batas kata supaya muat di kartu Story. */
export function potongKata(teks: string, maks: number) {
  const bersih = teks.replace(/\s+/g, " ").trim();
  if (bersih.length <= maks) return bersih;
  return `${bersih.slice(0, maks).replace(/\s+\S*$/, "").replace(/[,.;:\s]+$/, "")}…`;
}

type PropsBagikan = {
  /** Alamat halaman tanpa domain, misalnya "/catatan/judul". */
  path: string;
  judul: string;
  /** Kalimat pengantar yang menyertai tautan. */
  pesan: string;
  /** Isi kartu Story; `tautan` di dalamnya hanya tulisan di gambar. */
  story: IsiStory;
  namaFile: string;
  gelap?: boolean;
  className?: string;
};

export default function BagikanHalaman({ path, judul, pesan, story, namaFile, gelap = false, className = "" }: PropsBagikan) {
  const [tersalin, setTersalin] = useState(false);
  const tautan = (kode: string) => `${window.location.origin}${path}${path.includes("?") ? "&" : "?"}ref=bagikan-${kode}`;
  const bisaBagikan = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const salin = async () => {
    const isi = tautan("salin");
    try {
      await navigator.clipboard.writeText(isi);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 1800);
    } catch {
      window.prompt("Salin tautan ini:", isi);
    }
  };

  const lainnya = () => {
    navigator.share({ title: judul, text: pesan, url: tautan("lainnya") }).catch(() => undefined);
  };

  const garis = gelap
    ? "border-white/25 text-white/80 hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] focus-visible:outline-[hsl(var(--gold))]"
    : "border-border text-foreground hover:border-primary hover:text-primary focus-visible:outline-primary";
  const kotak = `grid h-10 w-10 place-items-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${garis}`;

  return (
    <div role="group" aria-label="Bagikan halaman ini" className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`mr-1 text-[10px] uppercase tracking-[0.2em] ${gelap ? "text-white/55" : "text-muted-foreground"}`}>Bagikan</span>
      {tujuan.map(({ kode, nama, Ikon, url }) => (
        <a
          key={kode}
          href={url(tautan(kode), pesan)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${nama}`}
          title={nama}
          className={kotak}
        >
          <Ikon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
      {bisaBagikan && (
        <button type="button" onClick={lainnya} aria-label="Bagikan lewat aplikasi lain" title="Aplikasi lain" className={kotak}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <TombolStory isi={story} namaFile={namaFile} ringkas tunda tautanSalin={tautan("story")} />
      <button
        type="button"
        onClick={salin}
        className={`inline-flex h-10 items-center gap-2 border px-4 text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${garis}`}
      >
        <Link2 className="h-4 w-4" aria-hidden="true" /> {tersalin ? "Tautan tersalin" : "Salin tautan"}
      </button>
    </div>
  );
}
