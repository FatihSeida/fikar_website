import { useQuery } from "@tanstack/react-query";

/**
 * Peta Suara Kader: 38 provinsi sebagai petak berukuran sama yang disusun
 * mengikuti letak geografisnya (tile grid map). Warna menunjukkan jumlah
 * partisipasi, bukan skor atau isi kiriman.
 */

// [nama provinsi, kode, baris, kolom]
const PETAK: [string, string, number, number][] = [
  ["Aceh", "AC", 0, 0], ["Sumatera Utara", "SU", 1, 1], ["Kepulauan Riau", "KR", 1, 3], ["Kalimantan Utara", "KU", 1, 7],
  ["Gorontalo", "GO", 1, 9], ["Sulawesi Utara", "SA", 1, 10], ["Sumatera Barat", "SB", 2, 1], ["Riau", "RI", 2, 2],
  ["Kalimantan Barat", "KB", 2, 5], ["Kalimantan Timur", "KI", 2, 7], ["Sulawesi Tengah", "ST", 2, 9], ["Maluku Utara", "MU", 2, 11],
  ["Papua Barat Daya", "PD", 2, 12], ["Papua Barat", "PB", 2, 13], ["Papua", "PA", 2, 15], ["Bengkulu", "BE", 3, 1],
  ["Jambi", "JA", 3, 2], ["Kepulauan Bangka Belitung", "BB", 3, 4], ["Kalimantan Tengah", "KT", 3, 6], ["Sulawesi Barat", "SR", 3, 8],
  ["Papua Tengah", "PT", 3, 14], ["Papua Pegunungan", "PE", 3, 15], ["Sumatera Selatan", "SS", 4, 3], ["Kalimantan Selatan", "KS", 4, 7],
  ["Sulawesi Selatan", "SN", 4, 8], ["Sulawesi Tenggara", "SG", 4, 9], ["Maluku", "MA", 4, 11], ["Papua Selatan", "PS", 4, 15],
  ["Lampung", "LA", 5, 3], ["DKI Jakarta", "JK", 5, 5], ["Banten", "BT", 6, 4], ["Jawa Barat", "JB", 6, 5],
  ["Jawa Tengah", "JT", 6, 6], ["Jawa Timur", "JI", 6, 7], ["Bali", "BA", 6, 8], ["Nusa Tenggara Barat", "NB", 6, 9],
  ["DI Yogyakarta", "YO", 7, 6], ["Nusa Tenggara Timur", "NT", 7, 10],
];

// Satu rona hijau, dari pucat ke tua; kosong memakai warna alas.
const RAMPA = ["#E4EEE7", "#BDD7C6", "#8FBDA0", "#4E8F6A", "#155B3C"];
// Provinsi tanpa kiriman: kotak bergaris tanpa isi, supaya jelas beda dari jumlah kecil.
const KOSONG = { background: "transparent", boxShadow: "inset 0 0 0 1px #CFC8B8" };

type DataPeta = { ditarik: string; total: number; provinsi: { nama: string; jumlah: number }[]; cabang: { nama: string; jumlah: number }[] };

export default function PetaSuaraKader() {
  const { data, isLoading, error } = useQuery<DataPeta>({ queryKey: ["/api/peta-suara"] });
  if (isLoading) return <p className="my-12 text-muted-foreground">Memuat Peta Suara Kader…</p>;
  if (error || !data) return null;

  const jumlah = new Map(data.provinsi.map((p) => [p.nama.toLowerCase(), p.jumlah]));
  const maks = Math.max(1, ...data.provinsi.map((p) => p.jumlah));
  const tingkat = (n: number) => (n === 0 ? -1 : Math.min(4, Math.floor((n / maks) * 5 - 1e-9)));
  const batas = RAMPA.map((_, i) => Math.ceil((maks * i) / 5) + (i === 0 ? 1 : 0));
  const tanggal = new Date(data.ditarik).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const terbanyak = data.provinsi.slice(0, 8);

  return (
    <figure className="not-prose my-14">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Peta Suara Kader</p>
      <p className="mt-2 font-serif text-2xl leading-snug text-foreground">Dari mana suara kader datang</p>

      <div className="mt-6 grid gap-[3px]" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }} role="img" aria-label={`Peta partisipasi per provinsi, ${data.total} kiriman`}>
        {Array.from({ length: 8 * 16 }, (_, i) => {
          const baris = Math.floor(i / 16);
          const kolom = i % 16;
          const petak = PETAK.find(([, , b, k]) => b === baris && k === kolom);
          if (!petak) return <span key={i} className="aspect-square" />;
          const [nama, kode] = petak;
          const n = jumlah.get(nama.toLowerCase()) ?? 0;
          const t = tingkat(n);
          return (
            <span key={i} title={`${nama}: ${n} kiriman`}
              className="flex aspect-square items-center justify-center rounded-[3px] text-[8px] font-medium sm:text-[10px]"
              style={t < 0 ? { ...KOSONG, color: "#8A948E" } : { background: RAMPA[t], color: t >= 3 ? "#F6F4E9" : "#3D4A43" }}>
              {kode}
            </span>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground" aria-label="Keterangan warna">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={KOSONG} /> Belum ada</span>
        {RAMPA.map((warna, i) => (
          <span key={warna} className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: warna }} />{i === 4 ? `${batas[i]}+` : `${batas[i]}–${Math.max(batas[i], batas[i + 1] - 1)}`}</span>
        ))}
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Provinsi dengan partisipasi terbanyak</p>
          <ol className="mt-3 grid gap-2 text-sm">
            {terbanyak.map((p, i) => (
              <li key={p.nama} className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
                <span><span className="mr-2 tabular-nums text-muted-foreground">{i + 1}</span>{p.nama}</span>
                <span className="tabular-nums text-muted-foreground">{p.jumlah}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Cabang dengan partisipasi terbanyak</p>
          <ol className="mt-3 grid gap-2 text-sm">
            {data.cabang.slice(0, 8).map((c, i) => (
              <li key={c.nama} className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
                <span><span className="mr-2 tabular-nums text-muted-foreground">{i + 1}</span>{c.nama}</span>
                <span className="tabular-nums text-muted-foreground">{c.jumlah}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <figcaption className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {data.total} kiriman dari kuis audit komisariat, masalah komisariat, tanggapan Series, dan fitur kampanye, ditarik {tanggal}. Provinsi diperkirakan dari jaringan pengirim; cabang sesuai yang diisi. Peta menampilkan jumlah partisipasi, bukan skor atau isi kiriman, dan bukan potret seluruh HMI.
      </figcaption>
    </figure>
  );
}
