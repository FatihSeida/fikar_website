// Pintu masuk kit animasi. Video cukup mengimpor dari sini:
//   import { buatVideo, formatIndikator, titik, W, pion, rumah, muncul, jalan } from "../kit/index.js";
// Rincian tiap modul ada di kit/docs/.

// inti
export { klem, campur, rentang, halus, keluar3, masukKeluar3, lenting, jendela, pegas, acak, waktuBeku } from "./inti/waktu.js";
export { PALET, W, buatTema, pakaiTema, cssWarna, varWarna } from "./inti/tema.js";
export { DEG, ISO, KANAN, BAWAH, NAIK, titik, keRD, sudutLayar, hadapKamera, keLayar, kotakLayar } from "./inti/ruang.js";
export { buatMesin, BLOOM, CAHAYA } from "./inti/mesin.js";
export { buatKamera, jadwalKamera, jadwalIndikator, jadwalEvidence, fokusUntuk, hMuat } from "./inti/kamera.js";
export { buatTanah } from "./inti/tanah.js";
export {
  bahanPadat, bahanKaca, bahanPijar, bahanGaris, kotakBulat, garisDari, garisTepi, garisJalur, tampakGaris,
  aturOpasitas, opasitasEfektif, setelKeadaan, keadaanBawaan, catatDasar, kurvaNyala, nilaiDenyut, EMAS, DENYUT, PUDAR,
} from "./inti/bahan.js";
export { videoAktif } from "./inti/aktif.js";

// halaman
export { FONT_URL, MUKA_FONT } from "./halaman/kerangka.js";
export { kepala, keterangan, alurLangkah, panel, kartuAkhir, sorot } from "./halaman/komponen.js";
export { label3D } from "./halaman/label.js";
export { formatIndikator, WAKTU_INDIKATOR, ZONA_INDIKATOR, TITIK_PERIKSA_INDIKATOR } from "./halaman/format/indikator.js";
export { formatEvidence, WAKTU_EVIDENCE } from "./halaman/format/evidence.js";

// gerak
export {
  muncul, hilang, klikEmas, denyutCermin, jalan, lintas, gantiBenda, busur, aliran, aliranTersendat, debu, tumbuh, sambungGaris,
  gantiLabel, putar, getar, panjangJalur,
} from "./gerak/standar.js";
export { catat, aturDasar, daftarkan, daftarkanMandiri, JENIS } from "./gerak/catatan.js";
export { segmenKuis, akhiriEvidence } from "./gerak/kuis.js";

// benda dan dunia
export * from "./benda/index.js";
export * from "./dunia/index.js";

// video
export { buatVideo } from "./video.js";
