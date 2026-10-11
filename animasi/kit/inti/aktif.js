// Video yang sedang dibangun di halaman ini. Diisi buatVideo(); dibaca gerak, label, dan komponen halaman.
// Satu halaman = satu video.
export const aktif = { video: null };

export function videoAktif(siapa = "fungsi ini") {
  if (!aktif.video) throw new Error(`[kit] ${siapa} dipanggil sebelum buatVideo(). Panggil buatVideo() dulu di adegan.js.`);
  return aktif.video;
}
