import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { angka, desimal, tanggalLengkap, tanggalSingkat } from "./data";

/**
 * Grafik Series 3: SVG dan HTML polos, tanpa pustaka tambahan.
 *
 * Warna sudah diperiksa dengan validator palet dataviz (permukaan putih, mode terang;
 * situs ini hanya punya tema terang):
 *   kategori  #157A4A, #BA8620  : lulus semua (CVD terburuk dE 10,6; penglihatan normal dE 20,9; kontras >= 3:1)
 *   ordinal   #86B99B, #4E9A6F, #157A4A, #0C4A2E : lulus (satu rona, L menurun, ujung terang 2,23:1)
 */
export const TOKEN_VIZ = {
  "--viz-surface": "#FFFFFF",
  "--viz-ink": "#14211A",
  "--viz-ink-2": "#4B5851",
  "--viz-ink-3": "#66726B",
  "--viz-grid": "#EDE9DD",
  "--viz-axis": "#CFC8B8",
  "--viz-s1": "#157A4A",
  "--viz-s1-hover": "#0E5A36",
  "--viz-s2": "#BA8620",
  "--viz-track": "#E1EEE6",
} as CSSProperties;

export const WARNA_TINGKAT = ["#86B99B", "#4E9A6F", "#157A4A", "#0C4A2E"];

const teks = (warna: string, ukuran = 11): CSSProperties => ({ fill: warna, fontSize: ukuran });
const INK_3 = "var(--viz-ink-3)";

function useLebar<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [lebar, setLebar] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ukur = () => setLebar(Math.round(el.getBoundingClientRect().width));
    ukur();
    const pengamat = new ResizeObserver(ukur);
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, []);
  return [ref, lebar] as const;
}

/* ---------- Kartu, tabel, tooltip ---------- */

export type DataTabel = { kepala: string[]; baris: (string | number)[][] };

export function TabelData({ judul, tabel }: { judul: string; tabel: DataTabel }) {
  return (
    <div className="max-h-72 overflow-auto rounded-md border border-border">
      <table className="w-full border-collapse text-left text-[13px]">
        <caption className="sr-only">{judul}</caption>
        <thead className="sticky top-0 bg-[#F4F1E8]">
          <tr>
            {tabel.kepala.map((k, i) => (
              <th key={k} scope="col" className={`px-3 py-2 font-medium text-[var(--viz-ink-2)] ${i > 0 ? "text-right" : ""}`}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabel.baris.map((baris, r) => (
            <tr key={r} className="border-t border-border">
              {baris.map((sel, i) => (i === 0
                ? <th key={i} scope="row" className="px-3 py-1.5 font-normal text-[var(--viz-ink)]">{sel}</th>
                : <td key={i} className="px-3 py-1.5 text-right tabular-nums text-[var(--viz-ink)]">{typeof sel === "number" ? angka(sel) : sel}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Kartu grafik: judul, tombol tampilan tabel (kembaran grafik untuk pembaca layar), dan catatan kaki. */
export function KartuGrafik({ judul, uraian, tabel, kaki, kelas = "", children }: {
  judul: string;
  uraian?: string;
  tabel: DataTabel;
  kaki?: ReactNode;
  kelas?: string;
  children: ReactNode;
}) {
  const [lihatTabel, setLihatTabel] = useState(false);
  const id = useId();
  return (
    <section aria-labelledby={id} className={`flex min-w-0 flex-col rounded-lg border border-border bg-[var(--viz-surface)] p-5 sm:p-6 ${kelas}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-[14rem] flex-1">
          <h3 id={id} className="font-serif text-[17px] font-semibold leading-snug text-[var(--viz-ink)]">{judul}</h3>
          {uraian && <p className="mt-1 text-[13px] leading-relaxed text-[var(--viz-ink-2)]">{uraian}</p>}
        </div>
        <button
          type="button"
          aria-pressed={lihatTabel}
          onClick={() => setLihatTabel((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-[var(--viz-ink-2)] transition-colors hover:border-[var(--viz-s1)] hover:text-[var(--viz-s1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--viz-s1)]"
        >
          {lihatTabel ? <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> : <Table2 className="h-3.5 w-3.5" aria-hidden="true" />}
          {lihatTabel ? "Lihat grafik" : "Lihat tabel"}
        </button>
      </div>
      <div className="mt-5 flex flex-1 flex-col">{lihatTabel ? <TabelData judul={judul} tabel={tabel} /> : children}</div>
      {kaki && <p className="mt-4 text-xs leading-relaxed text-[var(--viz-ink-3)]">{kaki}</p>}
    </section>
  );
}

/** Kotak keterangan yang mengikuti penunjuk. Letaknya di dalam induk yang `relative` selebar `lebar`. */
function Tip({ x, y, lebar, naik = false, children }: { x: number; y: number; lebar: number; /** true: kotak berada di atas titik y, bukan di bawahnya. */ naik?: boolean; children: ReactNode }) {
  const kiri = x > lebar * 0.55;
  return (
    <div
      className="pointer-events-none absolute z-10 w-max min-w-[8.5rem] max-w-[14rem] rounded-md border border-[var(--viz-axis)] bg-[var(--viz-surface)] px-3 py-2 text-xs shadow-[0_10px_28px_-14px_rgba(20,33,26,0.45)]"
      style={{ ...(kiri ? { right: lebar - x + 12 } : { left: x + 12 }), top: y, transform: naik ? "translateY(-100%)" : undefined }}
    >
      {children}
    </div>
  );
}

/* ---------- Grafik harian (batang atau garis) ---------- */

export type SeriHarian = { id: string; nama: string; warna: string; nilai: number[] };

/** Skala sumbu y yang rapi: batas atas dan langkah bilangan bulat. */
function skala(maks: number) {
  if (maks <= 4) return { puncak: 4, langkah: 1 };
  const kasar = maks / 4;
  const pangkat = 10 ** Math.floor(Math.log10(kasar));
  const langkah = [1, 2, 5, 10].map((k) => k * pangkat).find((k) => k >= kasar) ?? kasar;
  return { puncak: Math.ceil(maks / langkah) * langkah, langkah };
}

function jalurBatang(x: number, lebar: number, atas: number, dasar: number) {
  const r = Math.min(4, lebar / 2, dasar - atas);
  return `M${x},${dasar}V${atas + r}Q${x},${atas} ${x + r},${atas}H${x + lebar - r}Q${x + lebar},${atas} ${x + lebar},${atas + r}V${dasar}Z`;
}

export function GrafikHarian({ tanggal, seri, bentuk, ringkasan, kosong, tinggi = 220 }: {
  tanggal: string[];
  seri: SeriHarian[];
  bentuk: "batang" | "garis";
  /** Kalimat ringkas untuk pembaca layar. */
  ringkasan: string;
  /** Pesan bila semua nilai nol. */
  kosong?: string;
  tinggi?: number;
}) {
  const [ref, lebar] = useLebar<HTMLDivElement>();
  const [aktif, setAktif] = useState<number | null>(null);
  const n = tanggal.length;
  if (n === 0) return null;

  const m = { l: 38, r: 16, t: 12, b: 28 };
  const w = Math.max(lebar, 260);
  const pw = w - m.l - m.r;
  const ph = tinggi - m.t - m.b;
  const maks = Math.max(0, ...seri.flatMap((s) => s.nilai));
  const { puncak, langkah } = skala(maks);
  const band = pw / n;
  const x = (i: number) => m.l + band * (i + 0.5);
  const y = (v: number) => m.t + ph - (v / puncak) * ph;
  const dasar = m.t + ph;
  const tebal = Math.min(24, Math.max(2, band * 0.62));
  const langkahLabel = Math.max(1, Math.ceil(72 / band));
  const tandaY = Array.from({ length: Math.floor(puncak / langkah) + 1 }, (_, i) => i * langkah);
  const semuaNol = maks === 0;

  const dariPointer = (e: PointerEvent<SVGRectElement>) => {
    const kotak = e.currentTarget.getBoundingClientRect();
    const i = Math.floor(((e.clientX - kotak.left) / kotak.width) * n);
    setAktif(Math.min(n - 1, Math.max(0, i)));
  };
  const dariKeyboard = (e: KeyboardEvent<HTMLDivElement>) => {
    const geser = (selisih: number) => { e.preventDefault(); setAktif((a) => Math.min(n - 1, Math.max(0, (a ?? n - 1) + selisih))); };
    if (e.key === "ArrowLeft") geser(-1);
    else if (e.key === "ArrowRight") geser(1);
    else if (e.key === "Home") { e.preventDefault(); setAktif(0); }
    else if (e.key === "End") { e.preventDefault(); setAktif(n - 1); }
    else if (e.key === "Escape") setAktif(null);
  };
  const bacaan = aktif === null ? "" : `${tanggalLengkap(tanggal[aktif])}: ${seri.map((s) => `${angka(s.nilai[aktif])} ${s.nama}`).join(", ")}`;

  return (
    <div>
      {seri.length > 1 && (
        <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-[var(--viz-ink-2)]" aria-label="Keterangan warna">
          {seri.map((s) => (
            <li key={s.id} className="inline-flex items-center gap-2">
              <span aria-hidden="true" className={bentuk === "garis" ? "h-[2px] w-4 rounded-full" : "h-2.5 w-2.5 rounded-sm"} style={{ background: s.warna }} />
              {s.nama}
            </li>
          ))}
        </ul>
      )}
      <div
        ref={ref}
        className="relative rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--viz-s1)]"
        style={{ height: tinggi }}
        tabIndex={0}
        role="group"
        aria-label={`${ringkasan} Gunakan tombol panah kiri dan kanan untuk membaca nilai per hari.`}
        onKeyDown={dariKeyboard}
        onFocus={(e) => { if (e.target === e.currentTarget && e.currentTarget.matches(":focus-visible")) setAktif((a) => a ?? n - 1); }}
        onBlur={() => setAktif(null)}
      >
        {lebar > 0 && (
          <svg width={w} height={tinggi} className="block overflow-visible" aria-hidden="true">
            {tandaY.map((v) => (
              <g key={v}>
                <line x1={m.l} x2={w - m.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--viz-axis)" : "var(--viz-grid)"} strokeWidth={1} />
                <text x={m.l - 8} y={y(v)} textAnchor="end" dominantBaseline="central" style={teks(INK_3)} className="tabular-nums">{angka(v)}</text>
              </g>
            ))}
            {tanggal.map((t, i) => ((n - 1 - i) % langkahLabel === 0 && x(i) > m.l + 12 ? (
              <text key={t} x={x(i)} y={dasar + 18} textAnchor="middle" style={teks(INK_3)}>{tanggalSingkat(t)}</text>
            ) : null))}

            {aktif !== null && bentuk === "batang" && (
              <rect x={m.l + band * aktif} y={m.t} width={band} height={ph} fill="#14211A" opacity={0.05} />
            )}

            {bentuk === "batang"
              ? seri.map((s) => s.nilai.map((v, i) => (v > 0 ? (
                <path key={`${s.id}${i}`} d={jalurBatang(x(i) - tebal / 2, tebal, y(v), dasar)} fill={aktif === i ? "var(--viz-s1-hover)" : s.warna} />
              ) : null)))
              : [...seri].reverse().map((s) => (
                <path key={s.id} d={s.nilai.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("")} fill="none" stroke={s.warna} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              ))}

            {bentuk === "garis" && aktif !== null && <line x1={x(aktif)} x2={x(aktif)} y1={m.t} y2={dasar} stroke="var(--viz-axis)" strokeWidth={1} />}
            {bentuk === "garis" && [...seri].reverse().map((s) => {
              const i = aktif ?? n - 1;
              return (
                <g key={s.id}>
                  <circle cx={x(i)} cy={y(s.nilai[i])} r={6} fill="var(--viz-surface)" />
                  <circle cx={x(i)} cy={y(s.nilai[i])} r={4} fill={s.warna} />
                </g>
              );
            })}

            <rect
              x={m.l} y={0} width={pw} height={tinggi} fill="transparent" style={{ touchAction: "pan-y" }}
              onPointerMove={dariPointer} onPointerDown={dariPointer} onPointerLeave={() => setAktif(null)}
            />
          </svg>
        )}

        {semuaNol && kosong && lebar > 0 && (
          <p className="pointer-events-none absolute inset-x-0 text-center" style={{ top: m.t + ph / 2 - 24 }}>
            <span className="inline-block max-w-[17rem] rounded-md bg-[var(--viz-surface)] px-3 py-2 text-[13px] leading-snug text-[var(--viz-ink-2)]">{kosong}</span>
          </p>
        )}

        {aktif !== null && (
          <Tip x={x(aktif)} y={m.t + 4} lebar={w}>
            <p className="text-[var(--viz-ink-3)]">{tanggalLengkap(tanggal[aktif])}</p>
            <ul className="mt-1.5 grid gap-1">
              {seri.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-[2px] w-3 shrink-0 rounded-full" style={{ background: s.warna }} />
                  <span className="font-semibold tabular-nums text-[var(--viz-ink)]">{angka(s.nilai[aktif])}</span>
                  <span className="text-[var(--viz-ink-2)]">{s.nama}</span>
                </li>
              ))}
            </ul>
          </Tip>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{bacaan}</p>
    </div>
  );
}

/* ---------- Daftar batang mendatar ---------- */

export type BarisBatang = {
  id: string;
  nama: string;
  /** Keterangan kecil di sebelah nama, misalnya rentang skor. */
  keterangan?: string;
  nilai: number;
  /** Kalimat di kotak keterangan saat disorot. */
  tip: string;
  warna: string;
};

export function DaftarBatang({ baris, kosong, jalur = false }: { baris: BarisBatang[]; kosong: string; /** Jalur pucat di belakang batang, berguna untuk skala tetap seperti tingkat. */ jalur?: boolean }) {
  const [ref, lebar] = useLebar<HTMLDivElement>();
  const [tip, setTip] = useState<{ x: number; y: number; nama: string; isi: string } | null>(null);
  if (baris.length === 0) {
    return <p className="rounded-md border border-dashed border-[var(--viz-axis)] px-4 py-6 text-center text-[13px] leading-relaxed text-[var(--viz-ink-2)]">{kosong}</p>;
  }
  const maks = Math.max(1, ...baris.map((b) => b.nilai));
  const semuaNol = baris.every((b) => b.nilai === 0);
  const tunjuk = (b: BarisBatang, e: PointerEvent<HTMLLIElement>) => {
    const kotak = ref.current?.getBoundingClientRect();
    if (kotak) setTip({ x: e.clientX - kotak.left, y: e.clientY - kotak.top - 14, nama: b.nama, isi: b.tip });
  };
  const fokus = (b: BarisBatang, el: HTMLElement) => {
    const kotak = ref.current?.getBoundingClientRect();
    if (kotak) setTip({ x: Math.min(lebar * 0.4, 120), y: el.getBoundingClientRect().top - kotak.top, nama: b.nama, isi: b.tip });
  };
  return (
    <div ref={ref} className="relative">
      <ul className="grid gap-0.5">
        {baris.map((b) => (
          <li
            key={b.id}
            tabIndex={0}
            className="-mx-2 rounded-md px-2 py-2 transition-colors hover:bg-black/[0.035] focus-visible:bg-black/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--viz-s1)]"
            onPointerMove={(e) => tunjuk(b, e)}
            onPointerLeave={() => setTip(null)}
            onFocus={(e) => fokus(b, e.currentTarget)}
            onBlur={() => setTip(null)}
          >
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-[var(--viz-ink)]">{b.nama}</span>
              {b.keterangan && <span className="shrink-0 text-xs text-[var(--viz-ink-3)]">{b.keterangan}</span>}
            </div>
            <div className="relative mt-1 flex h-5 items-center">
              {jalur && <span aria-hidden="true" className="absolute left-0 h-3 w-[86%] rounded-r-[4px] bg-[var(--viz-track)]" />}
              <span aria-hidden="true" className="relative h-3 flex-none rounded-r-[4px]" style={{ width: b.nilai > 0 ? `${Math.max(1.5, (b.nilai / maks) * 86)}%` : 0, background: b.warna }} />
              <span className="relative ml-2 text-[13px] font-semibold tabular-nums text-[var(--viz-ink)]">{angka(b.nilai)}</span>
            </div>
          </li>
        ))}
      </ul>
      {semuaNol && <p className="mt-3 text-[13px] leading-relaxed text-[var(--viz-ink-2)]">{kosong}</p>}
      {tip && (
        <Tip x={tip.x} y={tip.y} lebar={lebar} naik>
          <p className="font-semibold text-[var(--viz-ink)]">{tip.nama}</p>
          <p className="mt-0.5 text-[var(--viz-ink-2)]">{tip.isi}</p>
        </Tip>
      )}
    </div>
  );
}

/* ---------- Meter persen dan ubin angka ---------- */

export function Meter({ judul, nilai, uraian, kosong }: { judul: string; nilai: number | null; uraian: string; kosong: string }) {
  const ada = nilai !== null;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="min-w-0 text-[13px] font-medium leading-snug text-[var(--viz-ink)]">{judul}</p>
        <p className="shrink-0 text-[28px] font-semibold leading-none text-[var(--viz-ink)]">{ada ? `${desimal(nilai)}%` : "–"}</p>
      </div>
      <div
        role="meter" aria-label={judul} aria-valuemin={0} aria-valuemax={100} aria-valuenow={nilai ?? undefined}
        aria-valuetext={ada ? `${desimal(nilai)} persen` : "Belum ada data"}
        className="mt-3 h-3 overflow-hidden rounded-[4px] bg-[var(--viz-track)]"
      >
        {ada && <div className="h-full rounded-r-[4px] bg-[var(--viz-s1)]" style={{ width: `${Math.min(100, nilai > 0 ? Math.max(1.5, nilai) : 0)}%` }} />}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--viz-ink-3)]">{ada ? uraian : kosong}</p>
    </div>
  );
}

export function UbinAngka({ label, nilai, satuan, keterangan }: { label: string; nilai: string; satuan?: string; keterangan: string }) {
  return (
    <div className="rounded-lg border border-border bg-[var(--viz-surface)] p-4 sm:p-5">
      <p className="text-[13px] leading-snug text-[var(--viz-ink-2)]">{label}</p>
      <p className="mt-2.5 text-[34px] font-semibold leading-none text-[var(--viz-ink)] sm:text-[40px]">
        {nilai}
        {satuan && <span className="ml-1 text-base font-medium text-[var(--viz-ink-3)]">{satuan}</span>}
      </p>
      <p className="mt-2.5 text-xs leading-snug text-[var(--viz-ink-3)]">{keterangan}</p>
    </div>
  );
}
