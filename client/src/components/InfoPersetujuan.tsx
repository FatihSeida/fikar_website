import { Info } from "lucide-react";

/**
 * Teks persetujuan yang sama untuk semua formulir kampanye (Rencana Kampanye v4,
 * bagian 1.0). Tanpa kotak centang: dengan mengirim, pengisi menyetujuinya.
 */
export default function InfoPersetujuan({ className = "", tambahan }: { className?: string; tambahan?: string }) {
  return (
    <p className={`flex items-start gap-2 text-xs leading-relaxed text-muted-foreground ${className}`}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span>
        Dengan mengirim, kamu setuju kiriman ini disimpan dan dibaca tim HMI Evidence untuk memahami kondisi akar rumput dan dijadikan bahan analisis ke depan.
        {tambahan ? ` ${tambahan}` : ""}
      </span>
    </p>
  );
}
