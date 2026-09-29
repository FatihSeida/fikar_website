import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { bagikanGambar, buatStory, type HasilBagikan, type IsiStory } from "@/lib/story";

const pesanHasil: Record<HasilBagikan, string> = {
  dibagikan: "Pilih Instagram, lalu Story.",
  diunduh: "Gambar Story tersimpan. Unggah ke Instagram Story dari HP-mu.",
  batal: "",
};

/**
 * Gambar Story dibuat lebih dulu saat komponen tampil, karena lembar bagikan
 * di HP hanya boleh dibuka langsung setelah tombol ditekan.
 */
export default function TombolStory({ isi, namaFile, className = "" }: { isi: IsiStory; namaFile: string; className?: string }) {
  const [gambar, setGambar] = useState<Blob | null>(null);
  const [pesan, setPesan] = useState("");
  const kunci = JSON.stringify(isi);

  useEffect(() => {
    let aktif = true;
    setGambar(null);
    buatStory(JSON.parse(kunci) as IsiStory).then((blob) => { if (aktif) setGambar(blob); }).catch(() => undefined);
    return () => { aktif = false; };
  }, [kunci]);

  const bagikan = async () => {
    if (!gambar) return;
    setPesan(pesanHasil[await bagikanGambar(gambar, namaFile, isi.judul)]);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={bagikan}
        disabled={!gambar}
        className="inline-flex items-center gap-2 border border-[#c13584]/40 bg-gradient-to-r from-[#833ab4] via-[#c13584] to-[#f77737] px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <Instagram className="h-4 w-4" /> {gambar ? "Bagikan ke Instagram Story" : "Menyiapkan gambar…"}
      </button>
      {pesan && <p className="mt-2 text-xs opacity-70" role="status">{pesan}</p>}
    </div>
  );
}
