import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import { HIJAU, REDUP, TINTA, batang, garis, halamanDasar, kop, label, siapkanPdf } from "@/lib/pdfDasar";
import type { HasilKursi } from "@/lib/kursiKetua";

/** Laporan pribadi "Sehari di Kursi Ketum" sebagai berkas PDF yang langsung terunduh. */
export async function unduhLaporanKursi(hasil: HasilKursi, data: { kursi: string; komisariat: string; cabang: string; tanggal: string; komitmen: string }, namaBerkas: string) {
  const pdf = await siapkanPdf();
  const paragraf = (isi: string, atas = 0): Content => ({ text: isi, fontSize: 10.5, lineHeight: 1.5, margin: [0, atas, 0, 8] });
  // Judul bagian selalu berpindah halaman bersama isi pertamanya, tidak tertinggal sendirian.
  const judulBagian = (eyebrow: string, judul: string, [pertama, ...sisa]: Content[]): Content[] => [
    { stack: [{ ...label(eyebrow, HIJAU), margin: [0, 22, 0, 0] }, { text: judul, font: "Serif", fontSize: 16, margin: [0, 6, 0, 10] }, pertama], unbreakable: true },
    ...sisa,
  ];

  const pembuka: Content[] = [
    label("Hari selesai. Apa yang terlihat dari keputusanmu?", HIJAU),
    { text: hasil.potret.nama, font: "Serif", fontSize: 26, margin: [0, 8, 0, 8] },
    paragraf(hasil.potret.uraian),
    paragraf(`Dua kekuatan yang paling tampak: ${hasil.kekuatan.join(" dan ")}.${hasil.campuran ? ` Kecenderunganmu campuran; ${hasil.campuran} juga hampir sama kuat.` : ""}`),
    ...(hasil.bukti.length ? [paragraf(`Dalam simulasi ini, kamu memilih ${hasil.bukti.map((b) => b.pilihan.ringkas).join(", dan ")}.`)] : []),
    ...(hasil.pola ? [paragraf(`Namun, pada situasi ${hasil.pola.situasi.konteks}, kamu memilih ${hasil.pola.pilihan.ringkas}. ${hasil.pola.pilihan.konsekuensi}`)] : []),
    paragraf(`Tantanganmu: ${hasil.potret.tantangan}`),
    ...(hasil.penutup ? [{ text: hasil.penutup, italics: true, fontSize: 10, color: REDUP, margin: [0, 4, 0, 0] } as Content] : []),
  ];

  const caraMemimpin: Content[] = [
    ...judulBagian("Cara kamu memimpin", "Lima dimensi dalam keputusanmu", [{ stack: hasil.dimensi.map((d) => batang(d.nama, d.persen, 495, d.label)) }]),
    ...hasil.praktik.map((t): Content => ({ text: [{ text: "Sudah muncul: ", bold: true }, `Dalam simulasi ini, kamu memilih ${t.pilihan.ringkas}. ${t.pilihan.konsekuensi}`], fontSize: 9.5, lineHeight: 1.4, margin: [0, 4, 0, 4] })),
    ...hasil.perhatian.map((t): Content => ({ text: [{ text: "Perlu diperhatikan: ", bold: true }, `Dalam simulasi ini, kamu memilih ${t.pilihan.ringkas}. ${t.pilihan.konsekuensi}`], fontSize: 9.5, lineHeight: 1.4, margin: [0, 4, 0, 4] })),
  ];

  const dukungan: Content[] = [
    ...judulBagian("Siapa yang menjagamu?", hasil.dukungan.judul, [paragraf(hasil.dukungan.uraian)]),
    ...judulBagian("Kader seperti apa yang mendapat ruang tumbuh?", hasil.ruangTumbuh.judul, [paragraf(`${hasil.ruangTumbuh.uraian} Bagian ini menjelaskan lingkungan yang didorong oleh pilihanmu, bukan sifat kader.`)]),
  ];

  const ditinjau: Content[] = [
    ...judulBagian("Tiga keputusan yang paling layak ditinjau", "Pilihanmu, manfaatnya, dan yang mungkin terlewat", hasil.ditinjau.map((t): Content => ({
      stack: [
        { text: t.pilihan.temuan!.judul, font: "Serif", fontSize: 12, margin: [0, 0, 0, 4] },
        { text: `${t.pilihan.temuan!.manfaat} ${t.pilihan.temuan!.terlewat}`, fontSize: 9.5, lineHeight: 1.4 },
        { text: [{ text: "Coba berikutnya: ", bold: true }, t.pilihan.temuan!.coba], fontSize: 9.5, lineHeight: 1.4, margin: [0, 4, 0, 0] },
      ],
      margin: [0, 0, 0, 14],
      unbreakable: true,
    }))),
  ];

  const langkah: Content[] = [
    ...judulBagian("Tiga langkah untuk tujuh hari berikutnya", "Coba bersama pengurus", hasil.langkah.map((l, i): Content => ({
      columns: [
        { text: String(i + 1).padStart(2, "0"), font: "Serif", fontSize: 16, color: HIJAU, width: 30 },
        { stack: [{ text: l.kebutuhan, bold: true, fontSize: 10 }, { text: l.langkah, fontSize: 9.5, lineHeight: 1.4, margin: [0, 2, 0, 0] }] },
      ],
      margin: [0, 0, 0, 10],
      unbreakable: true,
    }))),
    { text: [{ text: "Komitmen pekan ini: ", bold: true }, data.komitmen], fontSize: 10, margin: [0, 6, 0, 0] },
  ];

  const penutup: Content[] = [
    garis(24, 10),
    { text: "Pengalaman ini merupakan refleksi atas pilihan dalam simulasi. Hasilnya bukan tes psikologi, penilaian resmi, atau bukti tentang kualitas kepemimpinan seseorang.", fontSize: 8, color: REDUP, lineHeight: 1.4 },
    { text: [{ text: "HMI Evidence · ", color: HIJAU }, { text: "ahmadzulfikar.com", color: TINTA }], fontSize: 8.5, margin: [0, 8, 0, 0] },
  ];

  const dokumen: TDocumentDefinitions = {
    ...halamanDasar(namaBerkas.replace(/\.pdf$/, ""), "Sehari di Kursi Ketum", `HMI Evidence · Sehari di Kursi Ketum · Komisariat ${data.komisariat} · Cabang ${data.cabang}`),
    content: [
      kop(pdf.logo, "HMI Evidence · Sehari di Kursi Ketum", `Laporan pribadi · ${data.kursi}`, `Komisariat ${data.komisariat} · Cabang ${data.cabang} · ${data.tanggal}`),
      garis(16, 22),
      ...pembuka, ...caraMemimpin, ...dukungan, ...ditinjau, ...langkah, ...penutup,
    ],
  };
  await pdf.unduh(dokumen, namaBerkas);
}
