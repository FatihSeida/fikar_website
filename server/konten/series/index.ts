import type { CeritaSeri } from "@shared/cerita";
import { ceritaKaderisasiGoInternational } from "./kaderisasiGoInternational";
import { ceritaKebijakanKaderisasiBerbasisBukti } from "./kebijakanKaderisasiBerbasisBukti";

/**
 * Cara setiap seri ditampilkan:
 * - "cerita": cerita interaktif dengan adegan visual, isinya dari berkas di folder ini.
 * - "pemuda": kerangka Series 3 dengan peta dan statistik partisipasi.
 * - "pahlawan": kerangka Series 4 dengan hasil Bangun HMI Bersama.
 * - "naskah": naskah biasa yang ditulis admin di panel Series.
 */
export type TampilanSeri = "cerita" | "pemuda" | "pahlawan" | "naskah";

export const ceritaSeri: Record<string, () => CeritaSeri> = {
  "kaderisasi-go-international": ceritaKaderisasiGoInternational,
  "kebijakan-kaderisasi-berbasis-bukti": ceritaKebijakanKaderisasiBerbasisBukti,
};
