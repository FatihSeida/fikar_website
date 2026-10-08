/**
 * Gambar bangunan HMI untuk "Bangun HMI Bersama". Setiap bagian diwarnai
 * menurut nilainya: satu rona hijau dari pucat (1, rapuh) ke tua (5, kokoh);
 * bagian yang belum dinilai bergaris putus-putus. Fondasi tidak dinilai.
 */
const RAMPA = ["#E4EEE7", "#BDD7C6", "#8FBDA0", "#4E8F6A", "#155B3C"];
const BELUM = "#F4F1E8";
const GARIS = "#7D8F84";

type Nilai = Record<string, number | undefined>;

export const warnaNilai = (nilai?: number) => (nilai ? RAMPA[nilai - 1] : BELUM);

export default function BangunanHmi({ nilai, nama, sorot = [], onPilih, className = "" }: {
  nilai: Nilai;
  nama: Record<string, string>;
  sorot?: string[];
  onPilih?: (id: string) => void;
  className?: string;
}) {
  const atur = (id: string) => ({
    fill: warnaNilai(nilai[id]),
    stroke: sorot.includes(id) ? "#C9A95E" : GARIS,
    strokeWidth: sorot.includes(id) ? 2.5 : 1,
    strokeDasharray: nilai[id] ? undefined : "4 3",
    style: { cursor: onPilih ? "pointer" : undefined, transition: "fill .35s ease" },
    onClick: onPilih ? () => onPilih(id) : undefined,
  });
  const judul = (id: string) => <title>{`${nama[id] ?? id}${nilai[id] ? ` · nilai ${nilai[id]}` : " · belum dinilai"}`}</title>;
  const rapuh = (id: string) => (nilai[id] ?? 5) <= 2;
  const dinilai = Object.values(nilai).filter(Boolean).length;

  return (
    <svg viewBox="0 0 400 360" role="img" aria-label={`Bangunan HMI, ${dinilai} dari 11 bagian sudah dinilai`} className={className}>
      {/* Atap */}
      <g {...atur("atap")}>{judul("atap")}<polygon points="20,120 200,34 380,120" /></g>

      {/* Dinding sebagai latar ruangan, beserta retaknya bila rapuh */}
      <g {...atur("dinding")}>{judul("dinding")}<rect x="56" y="128" width="288" height="170" /></g>
      {rapuh("dinding") && <polyline points="300,140 292,160 304,176 296,196" fill="none" stroke="#9C5B3B" strokeWidth="1.5" pointerEvents="none" />}

      {/* Rangka: balok atas dan balok lantai dua */}
      <g {...atur("rangka")}>{judul("rangka")}<rect x="44" y="118" width="312" height="10" /><rect x="56" y="200" width="288" height="7" /></g>

      {/* Tiang */}
      <g {...atur("tiang")}>{judul("tiang")}<rect x="44" y="128" width="12" height="170" /><rect x="344" y="128" width="12" height="170" /></g>

      {/* Jendela di lantai dua */}
      <g {...atur("jendela")}>
        {judul("jendela")}
        <rect x="80" y="142" width="50" height="42" /><rect x="270" y="142" width="50" height="42" />
        <path d="M105 142v42M80 163h50M295 142v42M270 163h50" fill="none" />
      </g>

      {/* Ruang kerja di lantai dua: meja dan layar */}
      <g {...atur("ruang-kerja")}>
        {judul("ruang-kerja")}
        <rect x="156" y="140" width="88" height="58" rx="3" />
        <rect x="186" y="150" width="28" height="18" fill="#FFFFFF" fillOpacity=".55" />
        <rect x="170" y="176" width="60" height="6" /><path d="M176 182v14M224 182v14" fill="none" />
      </g>

      {/* Instalasi listrik dan air */}
      <g {...atur("instalasi")} fill="none" strokeWidth={4} stroke={warnaNilai(nilai.instalasi) === BELUM ? GARIS : warnaNilai(nilai.instalasi)}>
        {judul("instalasi")}
        <path d="M66 134v158M66 134h80M146 134v6" />
        <circle cx="146" cy="146" r="6" fill={warnaNilai(nilai.instalasi)} strokeWidth="1.5" stroke={GARIS} />
      </g>

      {/* Fondasi: tidak dinilai. Digambar sebelum teras supaya anak tangga berdiri di atasnya. */}
      <g>
        <title>Fondasi: Nilai Dasar Perjuangan, Tujuan HMI, Independensi (tidak dinilai)</title>
        <rect x="20" y="308" width="360" height="44" fill="#0B2A1E" />
        {["NDP", "Tujuan HMI", "Independensi"].map((teks, i) => (
          <text key={teks} x={20 + 60 + i * 120} y="343" textAnchor="middle" fontSize="10" letterSpacing="1" fill="#DCC38A" fontFamily="DM Sans, sans-serif">{teks.toUpperCase()}</text>
        ))}
      </g>

      {/* Lantai satu: perpustakaan, pintu, lemari arsip */}
      <g {...atur("perpustakaan")}>
        {judul("perpustakaan")}
        <rect x="76" y="220" width="72" height="70" />
        <path d="M76 243h72M76 266h72" fill="none" />
        {[84, 92, 100, 110, 118, 128].map((x, i) => <rect key={i} x={x} y={226 + (i % 3) * 23} width="6" height="15" fill="#FFFFFF" fillOpacity=".55" />)}
      </g>
      <g {...atur("pintu")}>
        {judul("pintu")}
        <rect x="180" y="224" width="40" height="74" rx="2" />
        <circle cx="212" cy="262" r="2.5" fill={GARIS} stroke="none" />
        <rect x="166" y="308" width="68" height="9" /><rect x="156" y="317" width="88" height="9" />
      </g>
      <g {...atur("lemari-arsip")}>
        {judul("lemari-arsip")}
        <rect x="260" y="220" width="62" height="70" />
        <path d="M260 243h62M260 266h62" fill="none" />
        {[232, 255, 278].map((y) => <rect key={y} x="284" y={y - 2} width="14" height="4" fill={GARIS} stroke="none" />)}
      </g>

      {/* Lantai */}
      <g {...atur("lantai")}>{judul("lantai")}<rect x="36" y="298" width="328" height="10" /></g>
      {rapuh("lantai") && <polyline points="96,298 104,308 112,300" fill="none" stroke="#9C5B3B" strokeWidth="1.5" pointerEvents="none" />}

    </svg>
  );
}
