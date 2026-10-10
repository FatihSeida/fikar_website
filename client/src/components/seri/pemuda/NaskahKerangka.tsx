import { PenLine } from "lucide-react";
import { proseKelas } from "@/pages/NoteDetail";

/** Empat bagian tulisan Series 3. Catatannya hanya menjelaskan arah bagian itu, bukan isi naskah. */
const BAGIAN = [
  {
    judul: "Apa yang dirasakan komisariat",
    catatan: "Bagian ini bercerita tentang hari-hari di komisariat: rasanya mengikuti LK 1, apa yang membuat kader bertahan, dan apa yang membuat sebagian lain pelan-pelan berhenti.",
  },
  {
    judul: "Dari mana suara-suara ini datang",
    catatan: "Bagian ini menjelaskan siapa saja yang sudah bersuara lewat kuis, kotak masalah, dan tanggapan Series, dari provinsi dan cabang mana, serta cara membaca peta di bawah.",
  },
  {
    judul: "Apa kata angka",
    catatan: "Bagian ini membaca angka partisipasi: berapa kader yang masih aktif setelah LK 1, berapa program komisariat yang benar-benar berjalan, dan apa yang belum bisa disimpulkan dari data sukarela.",
  },
  {
    judul: "Apa artinya untuk 2045",
    catatan: "Bagian ini menutup dengan pertanyaan terbesar: kader yang baru ikut LK 1 hari ini akan berusia sekitar 38 tahun pada 2045. Apa yang perlu dikerjakan komisariat, cabang, dan PB mulai sekarang?",
  },
];

/** Marker sisipan seri lain ([[peta-suara-kader]] dan sejenisnya) dibuang: peta dan angka sudah ada di halaman ini. */
const bersihkan = (html: string) => html.replace(/<p>\s*\[\[[a-z-]+\]\]\s*<\/p>/g, "");

function KotakMenyusul() {
  return (
    <div className="mt-6 rounded-md border border-dashed border-primary/35 bg-primary/[0.035] px-5 py-5">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        <PenLine className="h-3.5 w-3.5" aria-hidden="true" /> Naskah bagian ini sedang disiapkan
      </p>
      <div className="mt-4 grid gap-2.5 motion-safe:animate-pulse" aria-hidden="true">
        <span className="block h-2 w-full rounded-full bg-primary/10" />
        <span className="block h-2 w-[92%] rounded-full bg-primary/10" />
        <span className="block h-2 w-[64%] rounded-full bg-primary/10" />
      </div>
    </div>
  );
}

/**
 * Kerangka tulisan Series 3. Selama naskah admin masih kosong, tiap bagian menampilkan catatan arah dan
 * kotak "sedang disiapkan"; begitu naskah diisi, naskah itulah yang tampil.
 */
export default function NaskahKerangka({ naskah }: { naskah: string }) {
  const html = bersihkan(naskah).trim();

  return (
    <section id="tulisan" className="scroll-mt-24">
      <div className="container mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-24">
        {html ? (
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-primary">Tulisan</p>
            <div className={`mt-8 ${proseKelas}`} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        ) : (
          <>
            <div className="max-w-2xl">
              <p className="eyebrow text-primary">Tulisan</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">Empat hal yang akan dibahas</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Naskah lengkap menyusul. Peta dan angka di bawah sudah berjalan, jadi kamu bisa melihat suara kader terkumpul sambil tulisannya disiapkan.
              </p>
            </div>

            <ol className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2">
              {BAGIAN.map((bagian, i) => (
                <li key={bagian.judul} className="flex flex-col">
                  <div className="flex items-baseline gap-4 border-b border-border pb-4">
                    <span className="font-serif text-4xl leading-none text-primary" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-serif text-2xl leading-snug">{bagian.judul}</h3>
                  </div>
                  <p className="mt-5 leading-relaxed text-muted-foreground">{bagian.catatan}</p>
                  <KotakMenyusul />
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
