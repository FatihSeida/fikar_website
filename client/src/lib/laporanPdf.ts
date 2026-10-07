import type { Content, ContentText, TDocumentDefinitions } from "pdfmake/interfaces";
import { ALAS, GARIS, HIJAU, LEBAR, REDUP, TINTA, batang, fotoJpeg, garis, halamanDasar, kop as kopLaporan, label, siapkanPdf, teks } from "@/lib/pdfDasar";

/**
 * Laporan audit komisariat sebagai berkas PDF yang langsung terunduh, juga di HP,
 * tanpa dialog cetak. Isinya sama dengan laporan cetak di halaman kuis:
 * pengantar, hasil, temuan per jawaban, lalu ajakan dukungan.
 */

export type ButirLaporan = { teks: string; skor: number; jawaban: string; temuan: string; langkah: string; indikator: readonly number[] };
export type KelompokLaporan = { judul: string; sorotan: string; persen: number; saran: string; butir: ButirLaporan[] };
export type DataLaporan = {
  komisariat: string;
  cabang: string;
  tanggal: string;
  skor: number;
  skorMaksimal: number;
  tingkat: string;
  uraianTingkat: string;
  kekuatan: { judul: string; persen: number }[];
  lanjutan: { skor: number; maksimal: number; kelompok: { judul: string; sorotan: string; persen: number }[] } | null;
  angkaKunci: { judul: string; nilai: number; rinci: string }[];
  temuan: KelompokLaporan[];
  temuanLanjutan: KelompokLaporan[];
};

const KOLOM_KANAN = 250;

/** Tiga kotak kecil yang menunjukkan tingkat jawaban (0–3), seperti di halaman. */
const titikSkor = (skor: number) => [1, 2, 3].map((i) => ({ type: "rect" as const, x: (i - 1) * 8, y: 2, w: 5, h: 5, color: i <= skor ? HIJAU : ALAS }));

function kelompokTemuan(kelompok: KelompokLaporan): Content[] {
  return [
    {
      stack: [
        label(`${kelompok.judul} · ${kelompok.persen}%`, HIJAU),
        { text: kelompok.sorotan, font: "Serif", fontSize: 15, margin: [0, 4, 0, 6] },
        { text: teks(kelompok.saran), fontSize: 10, lineHeight: 1.4 },
      ],
      margin: [0, 18, 0, 4],
      unbreakable: true,
    },
    ...kelompok.butir.map((butir): Content => ({
      stack: [
        garis(8, 10),
        {
          columns: [
            { text: teks(butir.teks), font: "Serif", fontSize: 11.5, lineHeight: 1.25 },
            { columns: [{ canvas: titikSkor(butir.skor), width: 26 }, { text: `${butir.skor}/3`, fontSize: 8, color: REDUP }], width: 50, margin: [8, 2, 0, 0] },
          ],
        },
        { text: ["Jawabanmu: ", ...teks(butir.jawaban)], fontSize: 9, color: REDUP, margin: [0, 3, 0, 8] },
        {
          columns: [
            { stack: [label("Temuan"), { text: teks(butir.temuan), fontSize: 9.5, lineHeight: 1.35, margin: [0, 4, 0, 0] }] },
            { stack: [label(butir.skor === 3 ? "Langkah berikutnya" : "Naik satu tingkat"), { text: teks(butir.langkah), fontSize: 9.5, lineHeight: 1.35, margin: [0, 4, 0, 0] }] },
          ],
          columnGap: 18,
        },
        { text: `Terkait: ${butir.indikator.map((nomor) => `Indikator ${nomor}`).join(", ")}`, fontSize: 8, color: REDUP, margin: [0, 6, 0, 0] },
      ],
      unbreakable: true,
    })),
  ];
}

export async function unduhLaporanPdf(data: DataLaporan, namaBerkas: string): Promise<void> {
  const [pdf, foto] = await Promise.all([siapkanPdf(), fotoJpeg("/ahmad/profile-centered.webp", 480, 600)]);

  const kop = kopLaporan(pdf.logo, "HMI Evidence · Laporan Audit Komisariat", `Komisariat ${data.komisariat} · Cabang ${data.cabang}`, `${data.tanggal} · ahmadzulfikar.com/kuis`);

  const pengantar: Content[] = [
    label("Pengantar", HIJAU),
    { text: "HMI Evidence: Transformasi Gerakan Organisasi Berbasis Bukti", font: "Serif", fontSize: 22, lineHeight: 1.15, margin: [0, 8, 0, 14] },
    ...[
      "HMI Evidence adalah gerakan untuk mentransformasi HMI menjadi organisasi yang berbasis bukti (evidence-based): setiap keputusan perkaderan berangkat dari data dan kenyataan di komisariat, bukan dari kebiasaan atau dugaan.",
      "HMI Evidence adalah komitmen nyata untuk perkaderan HMI. Perkaderan yang baik tidak cukup ditandai oleh ramainya latihan, tetapi oleh kader yang bertahan, didampingi, dan terus tumbuh berkarya sesudahnya.",
    ].map((paragraf): Content => ({ text: teks(paragraf), fontSize: 10.5, lineHeight: 1.5, margin: [0, 0, 0, 9] })),
    {
      text: ["Kuis audit komisariat ini adalah salah satu langkah kecil kami untuk memperlihatkan komitmen itu: menghadirkan ekosistem perkaderan ", { text: "next level", italics: true }, ", yang dimulai dari keberanian setiap komisariat mengukur dirinya sendiri."],
      fontSize: 10.5, lineHeight: 1.5, margin: [0, 0, 0, 9],
    },
    {
      text: `Laporan ini merangkum hasil audit komisariatmu: skor, angka kunci, serta temuan dan langkah perbaikan untuk setiap jawaban${data.lanjutan ? ", termasuk audit lanjutan tentang kader pasca-LK 2 dan LK 3" : ""}. Bawalah ke rapat pengurus sebagai bahan diskusi bersama.`,
      fontSize: 10.5, lineHeight: 1.5,
    },
    {
      table: { widths: ["*"], body: [[{ text: "Jangan bicara HMI tanpa bukti.", font: "Serif", italics: true, fontSize: 14 }]] },
      layout: { hLineWidth: () => 0, vLineWidth: (i: number) => (i === 0 ? 2 : 0), vLineColor: () => HIJAU, paddingLeft: () => 12, paddingTop: () => 2, paddingBottom: () => 2 },
      margin: [0, 18, 0, 0],
    },
  ];

  const hasil: Content[] = [
    label("Hasil kuis", HIJAU),
    {
      columns: [
        {
          stack: [
            { text: [{ text: String(data.skor), fontSize: 52 }, { text: ` / ${data.skorMaksimal}`, fontSize: 20, color: REDUP }], font: "Serif" },
            { text: data.tingkat, font: "Serif", fontSize: 18, margin: [0, 6, 0, 6] },
            { text: teks(data.uraianTingkat), fontSize: 9.5, color: REDUP, lineHeight: 1.45 },
          ],
        },
        { stack: [label("Kekuatan per kelompok"), { text: "", margin: [0, 0, 0, 8] }, ...data.kekuatan.map((item) => batang(item.judul, item.persen, KOLOM_KANAN))], width: KOLOM_KANAN },
      ],
      columnGap: 30,
      margin: [0, 10, 0, 0],
    },
  ];

  if (data.lanjutan) {
    hasil.push({
      table: {
        widths: ["*"],
        body: [[{
          stack: [
            label("Audit lanjutan · kader LK 2 dan LK 3", HIJAU),
            {
              columns: [
                { text: [{ text: String(data.lanjutan.skor), fontSize: 34 }, { text: ` / ${data.lanjutan.maksimal}`, fontSize: 15, color: REDUP }], font: "Serif", width: 120 },
                { stack: data.lanjutan.kelompok.map((item) => batang(`${item.judul} · ${item.sorotan}`, item.persen, 300)), width: 300 },
              ],
              columnGap: 20,
              margin: [0, 10, 0, 0],
            },
            { text: `Skor utama di atas tetap dihitung dari ${data.skorMaksimal / 3} pertanyaan inti, supaya bisa dibandingkan antarkomisariat.`, fontSize: 8, color: REDUP, margin: [0, 2, 0, 0] },
          ],
        }]],
      },
      layout: { hLineColor: () => GARIS, vLineColor: () => GARIS, hLineWidth: () => 0.7, vLineWidth: () => 0.7, paddingLeft: () => 16, paddingRight: () => 16, paddingTop: () => 14, paddingBottom: () => 12 },
      margin: [0, 24, 0, 0],
      unbreakable: true,
    });
  }

  if (data.angkaKunci.length) {
    hasil.push({
      stack: [
        label("Angka kunci komisariatmu"),
        {
          columns: data.angkaKunci.map((item) => ({
            stack: [
              { text: item.judul, fontSize: 9, color: REDUP },
              { text: [{ text: String(item.nilai), fontSize: 34 }, { text: "%", fontSize: 16, color: REDUP }], font: "Serif", margin: [0, 4, 0, 4] },
              { text: item.rinci, fontSize: 8.5, color: REDUP },
            ],
          })),
          columnGap: 20,
          margin: [0, 10, 0, 6],
        },
        { text: "Catat angka yang sama setiap angkatan dan setiap periode. Arah perubahannya lebih penting daripada angkanya hari ini.", fontSize: 8, color: REDUP },
      ],
      margin: [0, 24, 0, 0],
      unbreakable: true,
    });
  }

  const temuan: Content[] = [
    { text: "Temuan audit", font: "Serif", fontSize: 18, pageBreak: "before" },
    { text: "Setiap jawabanmu dibaca sebagai temuan, lengkap dengan satu langkah untuk naik satu tingkat. Kelompok yang paling perlu diperkuat tampil lebih dulu.", fontSize: 9.5, color: REDUP, lineHeight: 1.4, margin: [0, 6, 0, 0] },
    ...data.temuan.flatMap(kelompokTemuan),
  ];
  if (data.temuanLanjutan.length) {
    temuan.push({ text: "Audit lanjutan: kader pasca-LK 2 dan LK 3", font: "Serif", fontSize: 18, pageBreak: "before" });
    temuan.push(...data.temuanLanjutan.flatMap(kelompokTemuan));
  }

  const dukungan: Content[] = [
    { ...label("Dukungan", HIJAU), pageBreak: "before" } as Content,
    { text: "Mari wujudkan HMI yang belajar dari bukti.", font: "Serif", fontSize: 22, lineHeight: 1.15, margin: [0, 8, 0, 18] },
    {
      columns: [
        {
          stack: [
            { text: ["Perbaikan perkaderan membutuhkan kepemimpinan yang berani berangkat dari bukti. Karena itu, kami memohon dukungan seluruh kader HMI untuk ", { text: "Ahmad Zulfikar", bold: true }, " sebagai Ketua Umum PB HMI Periode 2026–2028 di Kongres HMI XXXIII."], fontSize: 10.5, lineHeight: 1.5, margin: [0, 0, 0, 10] },
            { text: "Suarakan dukungan ini di komisariatmu dan kepada cabangmu, agar cabangmu turut mendukung Ahmad Zulfikar di Kongres HMI XXXIII.", fontSize: 10.5, lineHeight: 1.5 },
          ],
        },
        {
          stack: [
            { image: foto, width: 150, height: 187.5 },
            { text: "Ahmad Zulfikar", font: "Serif", fontSize: 13, margin: [0, 8, 0, 2] },
            label("Kandidat Ketua Umum PB HMI Periode 2026–2028"),
          ],
          width: 150,
        },
      ],
      columnGap: 28,
    },
    garis(28, 12),
    label("Yakin Usaha Sampai", HIJAU),
    { text: ["Pelajari gagasan HMI Evidence dan ajak komisariat lain mengukur dirinya di ", { text: "ahmadzulfikar.com", color: TINTA }], fontSize: 9.5, color: REDUP, margin: [0, 5, 0, 0] },
  ];

  const dokumen: TDocumentDefinitions = {
    ...halamanDasar(namaBerkas.replace(/\.pdf$/, ""), "Laporan Audit Komisariat", `HMI Evidence · Komisariat ${data.komisariat} · Cabang ${data.cabang}`),
    content: [kop, garis(16, 22), ...pengantar, { text: "", pageBreak: "after" }, ...hasil, ...temuan, ...dukungan],
  };

  await pdf.unduh(dokumen, namaBerkas);
}
