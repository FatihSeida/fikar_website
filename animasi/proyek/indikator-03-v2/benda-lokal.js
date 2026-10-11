// Benda lokal indikator-03-v2. Kit tidak punya kotak polos, jadi "kotak cepat" (dunia luar yang terus bergerak) dibuat di sini.
// Hanya mengimpor dari ../../kit/index.js.
import { W, bahanPadat, kotakBulat } from "../../kit/index.js";

// kotakCepat: kotak padat 0.3 × 0.3 × 0.3 berwarna W.zamrud (bahanPadat kit), titik asal di tengah alas.
// Berada di balik dinding ruang latihan dan memang keluar bingkai jendela, jadi tidak dihitung dalam pemeriksaan zona.
export function kotakCepat(opsi = {}) {
  const { ukuran = 0.3, warna = W.zamrud, nama = "kotak cepat" } = opsi;
  const kotak = kotakBulat(ukuran, ukuran, ukuran, bahanPadat(warna), { alas: true, radius: 0.02 });
  kotak.name = nama;
  Object.assign(kotak.userData, { nama, penting: false, abaikanZona: true, bagian: { emas: [kotak], denyut: [kotak], tepi: [] } });
  return kotak;
}
