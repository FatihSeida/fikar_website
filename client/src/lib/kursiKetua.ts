import type { KontenKursiKetua } from "../../../server/konten/kursiKetua";

/**
 * Penilaian "Sehari di Kursi Ketua". Isinya diambil dari server setelah rilis;
 * berkas ini hanya berisi cara membaca jawaban, bukan situasinya.
 */
export type Konten = KontenKursiKetua;
export type Situasi = Konten["situasi"][number];
export type Pilihan = Situasi["pilihan"][number];
export type KodeDimensi = "A" | "P" | "K" | "D" | "J";
export const KODE: KodeDimensi[] = ["A", "P", "K", "D", "J"];
export const HURUF = ["A", "B", "C", "D"] as const;

/** Jawaban: nomor situasi → indeks pilihan asli (0–3). */
export type Jawaban = Record<number, number>;

const rasioPilihan = (pilihan: Pilihan) => {
  const dinilai = pilihan.nilai.filter((n): n is number => n !== null);
  return dinilai.length ? dinilai.reduce((a, b) => a + b, 0) / (dinilai.length * 2) : 1;
};

/** Persentase setiap dimensi terhadap nilai maksimalnya sendiri. */
export function hitungDimensi(konten: Konten, jawaban: Jawaban): Record<KodeDimensi, number> {
  const jumlah = { A: 0, P: 0, K: 0, D: 0, J: 0 };
  const maks = { A: 0, P: 0, K: 0, D: 0, J: 0 };
  for (const s of konten.situasi) {
    const pilihan = s.pilihan[jawaban[s.nomor]];
    if (!pilihan) continue;
    KODE.forEach((kode, i) => {
      const nilai = pilihan.nilai[i];
      if (nilai === null) return;
      jumlah[kode] += nilai;
      maks[kode] += 2;
    });
  }
  return Object.fromEntries(KODE.map((kode) => [kode, maks[kode] ? Math.round((jumlah[kode] / maks[kode]) * 100) : 0])) as Record<KodeDimensi, number>;
}

/** Huruf pilihan asli untuk menguji syarat cerita bercabang. */
const hurufJawaban = (jawaban: Jawaban, nomor: number) => (jawaban[nomor] === undefined ? undefined : HURUF[jawaban[nomor]]);

export function cocokSyarat(syarat: Record<number, string>, jawaban: Jawaban) {
  return Object.entries(syarat).every(([nomor, huruf]) => hurufJawaban(jawaban, Number(nomor)) === huruf);
}

export function teksVarian<T extends { varian?: { syarat: Record<number, string>; teks: string }[] }>(item: T, jawaban: Jawaban, bawaan: string) {
  return item.varian?.find((v) => cocokSyarat(v.syarat, jawaban))?.teks ?? bawaan;
}

type Terpilih = { situasi: Situasi; pilihan: Pilihan; rasio: number };

function semuaTerpilih(konten: Konten, jawaban: Jawaban): Terpilih[] {
  return konten.situasi.flatMap((situasi) => {
    const pilihan = situasi.pilihan[jawaban[situasi.nomor]];
    return pilihan ? [{ situasi, pilihan, rasio: rasioPilihan(pilihan) }] : [];
  });
}

const label = (persen: number) => (persen >= 75 ? "Tampak kuat" : persen >= 50 ? "Mulai tampak" : "Perlu dikuatkan");

/** Seluruh bacaan halaman hasil, disusun dari jawaban. */
export function bacaHasil(konten: Konten, jawaban: Jawaban) {
  const persen = hitungDimensi(konten, jawaban);
  const urut = [...KODE].sort((a, b) => persen[b] - persen[a] || KODE.indexOf(a) - KODE.indexOf(b));
  const [kuat1, kuat2, ketiga] = urut;
  const kunci = [kuat1, kuat2].sort((a, b) => KODE.indexOf(a) - KODE.indexOf(b)).join("");
  const potret = konten.potret[kunci];
  // Selisih kecil dengan dimensi ketiga: kecenderungannya campuran, jangan disimpulkan terlalu tegas.
  const campuran = persen[kuat2] - persen[ketiga] < 5 ? ketiga : null;

  const terpilih = semuaTerpilih(konten, jawaban);
  const namaDimensi = (kode: KodeDimensi) => konten.dimensi.find((d) => d.kode === kode)!.nama;

  // Bukti kekuatan: pilihan bernilai 2 pada dua dimensi terkuat, dari situasi yang berbeda.
  const bukti: Terpilih[] = [];
  for (const kode of [kuat1, kuat2]) {
    const i = KODE.indexOf(kode);
    const ketemu = terpilih.filter((t) => t.pilihan.nilai[i] === 2 && !bukti.includes(t)).sort((a, b) => b.rasio - a.rasio)[0];
    if (ketemu) bukti.push(ketemu);
  }

  // Keputusan yang layak ditinjau: rasio terendah, paling banyak tiga, diusahakan dari babak berbeda.
  const calon = terpilih.filter((t) => t.pilihan.temuan).sort((a, b) => a.rasio - b.rasio || a.situasi.nomor - b.situasi.nomor);
  const ditinjau: Terpilih[] = [];
  for (const t of calon) {
    if (ditinjau.length === 3) break;
    if (!ditinjau.some((d) => d.situasi.babak === t.situasi.babak)) ditinjau.push(t);
  }
  for (const t of calon) {
    if (ditinjau.length === 3) break;
    if (!ditinjau.includes(t)) ditinjau.push(t);
  }

  const praktik = terpilih.filter((t) => t.rasio >= 0.875).sort((a, b) => b.rasio - a.rasio);
  const praktikBeda: Terpilih[] = [];
  for (const t of praktik) {
    if (praktikBeda.length === 2) break;
    if (!praktikBeda.some((p) => p.situasi.babak === t.situasi.babak)) praktikBeda.push(t);
  }
  const perhatian = [...terpilih].sort((a, b) => a.rasio - b.rasio).slice(0, 2).filter((t) => t.rasio < 0.75);

  // Siapa yang menjagamu: delegasi dan dukungan pada situasi beban pribadi.
  const nilaiBagian = (soal: number[], kodeDipakai: KodeDimensi[]) => {
    let total = 0;
    let maks = 0;
    for (const t of terpilih.filter((x) => soal.includes(x.situasi.nomor))) {
      kodeDipakai.forEach((kode) => {
        const nilai = t.pilihan.nilai[KODE.indexOf(kode)];
        if (nilai === null) return;
        total += nilai;
        maks += 2;
      });
    }
    return maks ? total / maks : 0;
  };
  const rasioDukungan = nilaiBagian(konten.dukungan.soal, ["D", "J"]);
  const dukungan = rasioDukungan >= 0.75 ? konten.dukungan.tersebar : rasioDukungan >= 0.4 ? konten.dukungan.belumKebiasaan : konten.dukungan.kembaliKepadamu;

  // Ruang tumbuh kader dari situasi yang menyangkut kesempatan kader.
  const rt = konten.ruangTumbuh;
  const rasioK = nilaiBagian(rt.soal, ["K"]);
  const rasioP = nilaiBagian(rt.soal, ["P"]);
  const mandiri = rt.tandaMandiri.some((tanda) => hurufJawaban(jawaban, tanda.soal) === tanda.pilihan);
  const ruangTumbuh = rasioK >= 0.75 ? rt.pendampingan : mandiri ? rt.mandiri : rasioP >= 0.6 ? rt.didengar : rt.arahan;

  // Tiga langkah tujuh hari dari tiga dimensi terlemah.
  const langkah = [...urut].reverse().slice(0, 3).map((kode) => ({ kode, ...konten.langkah[kode] }));

  return {
    persen,
    dimensi: KODE.map((kode) => ({ kode, nama: namaDimensi(kode), uraian: konten.dimensi.find((d) => d.kode === kode)!.uraian, persen: persen[kode], label: label(persen[kode]) })),
    potret,
    kekuatan: [namaDimensi(kuat1), namaDimensi(kuat2)],
    campuran: campuran ? namaDimensi(campuran) : null,
    bukti,
    pola: ditinjau[0] ?? null,
    praktik: praktikBeda,
    perhatian,
    dukungan,
    ruangTumbuh,
    ditinjau,
    langkah,
    penutup: teksVarian(konten.penutup, jawaban, ""),
  };
}

export type HasilKursi = ReturnType<typeof bacaHasil>;
