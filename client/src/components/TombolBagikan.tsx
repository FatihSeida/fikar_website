import { useState } from "react";
import { Link2, MessageCircle } from "lucide-react";

/**
 * Tombol bagikan ke WhatsApp dan salin tautan. Tautannya diberi `ref=bagikan`
 * supaya kunjungan dari hasil berbagi terlihat di analytics.
 */
export default function TombolBagikan({ path, pesan, className = "", gelap = false }: { path: string; pesan: string; className?: string; gelap?: boolean }) {
  const [tersalin, setTersalin] = useState(false);
  const tautan = `${window.location.origin}${path}${path.includes("?") ? "&" : "?"}ref=bagikan`;

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(tautan);
      setTersalin(true);
      window.setTimeout(() => setTersalin(false), 1800);
    } catch {
      window.prompt("Salin tautan ini:", tautan);
    }
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${pesan}\n\n${tautan}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-90 ${gelap ? "bg-[#25d366] text-[#062014]" : "bg-primary text-primary-foreground"}`}
      >
        <MessageCircle className="h-4 w-4" /> Bagikan ke WhatsApp
      </a>
      <button
        type="button"
        onClick={salin}
        className={`inline-flex items-center gap-2 border px-5 py-3 text-xs uppercase tracking-[0.14em] transition-colors ${gelap ? "border-white/30 text-white hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]" : "border-border hover:border-primary hover:text-primary"}`}
      >
        <Link2 className="h-4 w-4" /> {tersalin ? "Tautan tersalin" : "Salin tautan"}
      </button>
    </div>
  );
}
