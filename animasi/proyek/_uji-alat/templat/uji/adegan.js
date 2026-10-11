// animasi/__NAMA__: "__JUDUL__"
// Templat uji untuk kit/alat/baru.mjs (dipakai lewat --templat _uji-alat/templat --format uji).
// Halaman minimal yang memenuhi kontrak, supaya hasil baru.mjs bisa langsung diuji dengan buat.mjs --periksa.
const NAMA = "__NAMA__";
const JUDUL = "__JUDUL__";
const DURASI = 2;
const kotak = document.getElementById("kotak");

function tampilkan(t) {
  kotak.style.transform = `rotate(${(t / DURASI) * 90}deg)`;
  document.querySelector("h1").style.opacity = String(Math.min(1, t / 0.5));
}

window.DURASI = DURASI;
window.FPS = 30;
window.UKURAN = { lebar: 1080, tinggi: 1920 };
window.tampilkan = tampilkan;
window.KIT = {
  versi: "uji",
  peristiwa: () => [{ t: 0.5, jenis: "muncul", x: 0.5, kuat: 0.7, durasi: 0, nada: 0, sumber: NAMA }],
  periksaZona: () => [],
  titikPeriksa: [0.25, 1, 1.75],
};
window.siap = document.fonts.ready.then(() => {
  if (document.title.indexOf(JUDUL) !== 0) throw new Error("judul di JS dan HTML tidak sama");
  tampilkan(0);
});
