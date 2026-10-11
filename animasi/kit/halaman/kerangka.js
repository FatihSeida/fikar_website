// Kerangka halaman: kanvas, kabut atas/bawah, lapisan label 3D, lapisan teks, font.
// Urutan lapisan dari bawah: kanvas WebGL → kabut → label benda → teks halaman.

export const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700"
  + "&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=block";
// Muka font yang ditunggu sebelum window.siap selesai.
export const MUKA_FONT = [
  '400 40px "DM Sans"', '500 40px "DM Sans"', '600 40px "DM Sans"', '700 40px "DM Sans"',
  '400 22px "JetBrains Mono"', '500 22px "JetBrains Mono"', '600 22px "JetBrains Mono"', '700 22px "JetBrains Mono"',
  '400 50px "Noto Serif"', '700 50px "Noto Serif"', 'italic 400 50px "Noto Serif"', 'italic 700 50px "Noto Serif"',
];
const CSS_URL = new URL("./kerangka.css", import.meta.url).href;

function pastikanLink(href, cocok) {
  const ada = [...document.querySelectorAll('link[rel="stylesheet"]')].find((l) => cocok(l.href));
  if (ada) return ada;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
  return l;
}

// kabut: { atas: [solidSampai, beningDi], bawah: [beningDari, solidDari] } dalam piksel, atau null.
export function pasangKerangka({ ukuran, kabut = null }) {
  const { lebar, tinggi } = ukuran;
  pastikanLink(FONT_URL, (h) => h.includes("fonts.googleapis.com"));
  pastikanLink(CSS_URL, (h) => h.endsWith("/kit/halaman/kerangka.css"));
  for (const el of [document.documentElement, document.body]) { el.style.width = lebar + "px"; el.style.height = tinggi + "px"; }

  const kanvas = document.createElement("canvas");
  kanvas.id = "kanvas";
  kanvas.width = lebar; kanvas.height = tinggi;
  kanvas.style.width = lebar + "px"; kanvas.style.height = tinggi + "px";
  document.body.prepend(kanvas);

  let kabutAtas = null, kabutBawah = null;
  if (kabut?.atas) {
    const [a, b] = kabut.atas;
    kabutAtas = document.createElement("div");
    kabutAtas.id = "kabut-atas"; kabutAtas.className = "kit-kabut";
    Object.assign(kabutAtas.style, { top: "0px", height: b + "px",
      background: `linear-gradient(to bottom, var(--latar) 0px, var(--latar) ${a}px, color-mix(in srgb, var(--latar) 0%, transparent) ${b}px)` });
  }
  if (kabut?.bawah) {
    const [a, b] = kabut.bawah;
    kabutBawah = document.createElement("div");
    kabutBawah.id = "kabut-bawah"; kabutBawah.className = "kit-kabut";
    Object.assign(kabutBawah.style, { top: a + "px", height: (tinggi - a) + "px",
      background: `linear-gradient(to bottom, color-mix(in srgb, var(--latar) 0%, transparent) 0px, var(--latar) ${b - a}px, var(--latar) 100%)` });
  }
  const lapisanLabel = document.createElement("div");
  lapisanLabel.id = "label3d";
  const lapisanHalaman = document.createElement("div");
  lapisanHalaman.id = "halaman";
  kanvas.after(...[kabutAtas, kabutBawah, lapisanLabel, lapisanHalaman].filter(Boolean));
  return { kanvas, kabutAtas, kabutBawah, lapisanLabel, lapisanHalaman };
}

// Tunggu semua stylesheet dan font termuat. teks: string berisi semua huruf yang akan tampil (subset font Google).
export async function tungguHalaman(teks = "") {
  await Promise.all([...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => (l.sheet ? null
    : new Promise((ok) => { l.addEventListener("load", ok, { once: true }); l.addEventListener("error", ok, { once: true }); }))));
  const contoh = (document.body.textContent + " " + teks + " →·–—0123456789").replace(/\s+/g, " ");
  await Promise.all(MUKA_FONT.map((f) => document.fonts.load(f, contoh)));
  await document.fonts.ready;
}
