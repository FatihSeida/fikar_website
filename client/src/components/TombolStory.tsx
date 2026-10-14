import { useCallback, useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import { bagikanGambar, buatStory, type HasilBagikan, type IsiStory } from "@/lib/story";

const pesanHasil: Record<HasilBagikan, string> = {
  dibagikan: "Pilih Instagram, lalu Story.",
  diunduh: "Gambar Story tersimpan. Unggah ke Instagram Story dari HP-mu.",
  ulang: "Gambar sudah siap. Ketuk sekali lagi untuk membagikannya.",
  batal: "",
};

type PropsTombolStory = {
  isi: IsiStory;
  namaFile: string;
  className?: string;
  /** Tampilan kecil untuk baris bagikan. */
  ringkas?: boolean;
  /**
   * Gambar baru dibuat saat pembaca menunjukkan niat (menyentuh, mengarahkan kursor, atau
   * memfokuskan tombol), bukan saat halaman dibuka. Halaman yang hanya dibaca tidak ikut
   * mengunduh latar Story (sekitar 250 KB) dan menggambar kanvas besar.
   */
  tunda?: boolean;
  /** Tautan yang ikut disalin saat Story dibagikan, untuk ditempel di stiker Tautan Instagram. */
  tautanSalin?: string;
};

/**
 * Tanpa `tunda`, gambar Story dibuat lebih dulu saat komponen tampil, karena lembar bagikan
 * di HP hanya boleh dibuka langsung setelah tombol ditekan.
 */
export default function TombolStory({ isi, namaFile, className = "", ringkas = false, tunda = false, tautanSalin }: PropsTombolStory) {
  const [gambar, setGambar] = useState<Blob | null>(null);
  const [menyiapkan, setMenyiapkan] = useState(false);
  const [pesan, setPesan] = useState("");
  const kunci = JSON.stringify(isi);
  const janji = useRef<Promise<Blob | null> | null>(null);
  const versi = useRef(0);

  const siapkan = useCallback(() => {
    if (!janji.current) {
      const saatIni = versi.current;
      janji.current = buatStory(JSON.parse(kunci) as IsiStory)
        .then((blob) => {
          if (versi.current === saatIni) setGambar(blob);
          return blob;
        })
        .catch(() => {
          if (versi.current === saatIni) janji.current = null;
          return null;
        });
    }
    return janji.current;
  }, [kunci]);

  // Isi berubah: gambar lama tidak berlaku lagi.
  useEffect(() => {
    versi.current += 1;
    janji.current = null;
    setGambar(null);
    if (!tunda) void siapkan();
  }, [kunci, tunda, siapkan]);

  const bagikan = async () => {
    setPesan("");
    let blob = gambar;
    let baruSiap = false;
    if (!blob) {
      setMenyiapkan(true);
      blob = await siapkan();
      setMenyiapkan(false);
      baruSiap = true;
      if (!blob) {
        setPesan("Gambar belum bisa dibuat. Coba lagi sebentar lagi.");
        return;
      }
    }
    // Disalin lebih dulu, selagi ketukan masih berlaku; hasilnya dibaca sesudah lembar bagikan ditutup.
    const tersalin = tautanSalin && navigator.clipboard
      ? navigator.clipboard.writeText(tautanSalin).then(() => true, () => false)
      : Promise.resolve(false);
    const hasil = await bagikanGambar(blob, namaFile, isi.judul, baruSiap);
    const catatan = hasil !== "ulang" && hasil !== "batal" && (await tersalin) ? " Tautannya sudah disalin untuk stiker Tautan." : "";
    setPesan(pesanHasil[hasil] + catatan);
  };

  const menunggu = !tunda && !gambar;
  const tulisan = menyiapkan || menunggu ? "Menyiapkan gambar…" : ringkas ? "Instagram Story" : "Bagikan ke Instagram Story";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={bagikan}
        onPointerEnter={tunda ? () => void siapkan() : undefined}
        onFocus={tunda ? () => void siapkan() : undefined}
        onTouchStart={tunda ? () => void siapkan() : undefined}
        disabled={menunggu || menyiapkan}
        className={`inline-flex items-center gap-2 border border-[#c13584]/40 bg-gradient-to-r from-[#833ab4] via-[#c13584] to-[#f77737] font-medium uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${ringkas ? "px-4 py-2.5 text-[11px] tracking-[0.12em]" : "px-5 py-3 text-xs tracking-[0.14em]"}`}
      >
        <Instagram className="h-4 w-4" /> {tulisan}
      </button>
      {pesan && <p className="mt-2 max-w-sm text-xs leading-relaxed opacity-75" role="status">{pesan}</p>}
    </div>
  );
}
