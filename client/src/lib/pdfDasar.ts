import type { Content, ContentText, TDocumentDefinitions } from "pdfmake/interfaces";
import { polaIstilah } from "@/lib/istilah";
import serif400 from "@fontsource/noto-serif/files/noto-serif-latin-400-normal.woff?url";
import serif400i from "@fontsource/noto-serif/files/noto-serif-latin-400-italic.woff?url";
import serif600 from "@fontsource/noto-serif/files/noto-serif-latin-600-normal.woff?url";
import serif600i from "@fontsource/noto-serif/files/noto-serif-latin-600-italic.woff?url";
import sans400 from "@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff?url";
import sans400i from "@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff?url";
import sans600 from "@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff?url";
import sans600i from "@fontsource/dm-sans/files/dm-sans-latin-600-italic.woff?url";

/**
 * Bahan bersama untuk laporan PDF yang dibuat di peramban: huruf situs, warna,
 * dan potongan tata letak. pdfmake baru dimuat saat laporan diminta.
 */

// Warna tema situs (lihat index.css), dalam hex untuk PDF.
export const HIJAU = "#155B3C";
export const TINTA = "#151E1A";
export const REDUP = "#516158";
export const GARIS = "#DAD5C8";
export const ALAS = "#ECE8DD";

export const LEBAR = 495; // lebar isi A4 dengan margin 50 pt

/** Kalimat dengan istilah bahasa Inggris dimiringkan, seperti TeksIstilah: potongan bernomor ganjil adalah istilahnya. */
export const teks = (isi: string): (string | ContentText)[] =>
  isi.split(polaIstilah).map((bagian, i) => (i % 2 === 1 ? { text: bagian, italics: true } : bagian)).filter((bagian) => bagian !== "");

export const label = (isi: string, warna = REDUP): ContentText => ({ text: isi.toUpperCase(), fontSize: 7, characterSpacing: 1.6, color: warna });

export const garis = (atas = 0, bawah = 0): Content => ({ canvas: [{ type: "line", x1: 0, y1: 0, x2: LEBAR, y2: 0, lineWidth: 0.7, lineColor: GARIS }], margin: [0, atas, 0, bawah] });

/** Batang persentase dengan label di kiri; `keterangan` menggantikan angka persen bila diisi. */
export function batang(judul: string, persen: number, lebar: number, keterangan?: string): Content {
  return {
    stack: [
      { columns: [{ text: judul, fontSize: 9.5 }, { text: keterangan ?? `${persen}%`, fontSize: 9.5, color: REDUP, alignment: "right", width: keterangan ? 110 : 34 }] },
      {
        canvas: [
          { type: "rect", x: 0, y: 0, w: lebar, h: 4, r: 2, color: ALAS },
          ...(persen > 0 ? [{ type: "rect" as const, x: 0, y: 0, w: (lebar * persen) / 100, h: 4, r: 2, color: HIJAU }] : []),
        ],
        margin: [0, 4, 0, 0],
      },
    ],
    margin: [0, 0, 0, 10],
  };
}

async function keBase64(url: string): Promise<string> {
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let biner = "";
  for (let i = 0; i < bytes.length; i += 0x8000) biner += String.fromCharCode(...Array.from(bytes.subarray(i, i + 0x8000)));
  return btoa(biner);
}

/** Foto WebP diubah ke JPEG karena PDF hanya menerima JPEG dan PNG. */
export async function fotoJpeg(url: string, lebar: number, tinggi: number): Promise<string> {
  const gambar = new Image();
  gambar.src = url;
  await gambar.decode();
  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  kanvas.getContext("2d")!.drawImage(gambar, 0, 0, lebar, tinggi);
  return kanvas.toDataURL("image/jpeg", 0.85);
}

/** Kop laporan: lambang HMI, label, judul, dan baris keterangan. */
export function kop(logo: string, labelKop: string, judul: string, keterangan: string): Content {
  return {
    columns: [
      { image: logo, fit: [17, 46], width: 17 },
      {
        stack: [
          label(labelKop, HIJAU),
          { text: judul, font: "Serif", fontSize: 17, margin: [0, 5, 0, 3] },
          { text: keterangan, fontSize: 8.5, color: REDUP },
        ],
        margin: [14, 2, 0, 0],
      },
    ],
  };
}

/** Pengaturan halaman A4 yang sama untuk semua laporan. */
export function halamanDasar(judulBerkas: string, subjek: string, teksKaki: string): Omit<TDocumentDefinitions, "content"> {
  return {
    pageSize: "A4",
    pageMargins: [50, 46, 50, 54],
    info: { title: judulBerkas, author: "HMI Evidence", subject: subjek },
    defaultStyle: { font: "Sans", fontSize: 10, color: TINTA },
    footer: (halaman: number, jumlah: number) => ({
      columns: [
        { text: teksKaki, fontSize: 7.5, color: REDUP },
        { text: `${halaman} / ${jumlah}`, fontSize: 7.5, color: REDUP, alignment: "right", width: 40 },
      ],
      margin: [50, 18, 50, 0],
    }),
  };
}

/** Memuat pdfmake beserta huruf situs, lalu memberikan fungsi untuk mengunduh dokumen. */
export async function siapkanPdf() {
  const urlHuruf = [serif400, serif400i, serif600, serif600i, sans400, sans400i, sans600, sans600i];
  const [modul, logo, ...huruf] = await Promise.all([import("pdfmake/build/pdfmake"), keBase64("/hmi-logo.png"), ...urlHuruf.map(keBase64)]);
  const pdfMake = ((modul as { default?: unknown }).default ?? modul) as typeof import("pdfmake/build/pdfmake");
  const nama = ["s400", "s400i", "s600", "s600i", "d400", "d400i", "d600", "d600i"].map((kode) => `${kode}.woff`);
  const vfs = Object.fromEntries(nama.map((berkas, i) => [berkas, huruf[i]]));
  const fonts = {
    Serif: { normal: nama[0], italics: nama[1], bold: nama[2], bolditalics: nama[3] },
    Sans: { normal: nama[4], italics: nama[5], bold: nama[6], bolditalics: nama[7] },
  };
  return {
    logo: `data:image/png;base64,${logo}`,
    unduh: (dokumen: TDocumentDefinitions, namaBerkas: string) =>
      new Promise<void>((selesai) => pdfMake.createPdf(dokumen, undefined, fonts, vfs).download(namaBerkas, () => selesai())),
  };
}
