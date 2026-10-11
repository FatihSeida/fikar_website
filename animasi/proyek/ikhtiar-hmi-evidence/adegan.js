// "Ikhtiar HMI Evidence": animasi naratif 58 detik untuk Instagram (1080×1920).
// Kontrak halaman: window.DURASI, window.siap, window.tampilkan(t). Lihat animasi/README.md.
// Font dimuat lebih dulu karena teks pada permukaan benda (ubin kalender, papan LK, kartu) digambar ke kanvas
// saat benda dibuat; panggung.js baru diimpor setelah font siap.
import { DURASI } from "./isyarat.js";

window.DURASI = DURASI;
window.siap = (async () => {
  await Promise.all([
    '700 54px "Noto Serif"', 'italic 600 46px "Noto Serif"', 'italic 700 46px "Noto Serif"', '700 230px "Noto Serif"',
    '400 22px "DM Sans"', '600 26px "DM Sans"', '700 44px "DM Sans"',
    '500 20px "JetBrains Mono"', '600 27px "JetBrains Mono"', '700 64px "JetBrains Mono"',
  ].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  const { tampilkan } = await import("./panggung.js");
  window.tampilkan = tampilkan;
  tampilkan(0);
})();

const prm = new URLSearchParams(location.search);
if (!prm.has("rekam")) {
  window.siap.then(() => {
    if (prm.has("t")) { window.tampilkan(parseFloat(prm.get("t")) || 0); return; }
    const mulai = performance.now();
    const putar = () => { window.tampilkan(((performance.now() - mulai) / 1000) % DURASI); requestAnimationFrame(putar); };
    putar();
  });
}
