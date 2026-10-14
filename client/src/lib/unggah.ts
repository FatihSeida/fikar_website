import { isiGalat } from "@/lib/queryClient";

const JENIS_DIIZINKAN = ["image/jpeg", "image/png", "image/webp"];
const BATAS_BYTE = 5 * 1024 * 1024;

/** Mengunggah satu gambar ke server dan mengembalikan alamatnya. Bila gagal, Error-nya berisi alasan yang bisa dibaca orang. */
export async function unggahGambar(berkas: File): Promise<string> {
  if (!JENIS_DIIZINKAN.includes(berkas.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WebP. Foto HEIC dari iPhone perlu diubah dulu.");
  }
  if (berkas.size > BATAS_BYTE) {
    throw new Error(`Ukuran gambar ${(berkas.size / 1024 / 1024).toFixed(1)} MB, batasnya 5 MB. Kecilkan dulu gambarnya.`);
  }

  const data = new FormData();
  data.append("file", berkas);

  let res: Response;
  try {
    res = await fetch("/api/upload", { method: "POST", body: data });
  } catch {
    throw new Error(isiGalat(null));
  }
  if (!res.ok) throw new Error(isiGalat(new Error(`${res.status}: ${await res.text()}`)));

  const isi = await res.json().catch(() => null);
  if (typeof isi?.url !== "string") throw new Error("Server tidak mengirim alamat gambar. Coba unggah ulang.");
  return isi.url;
}
