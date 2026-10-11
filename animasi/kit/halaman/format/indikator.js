// Format "indikator": video 21 detik seri 44 indikator (prompt bagian B, C.7, dan E).
// Isi teks masuk lewat parameter; tata letak, gaya, dan waktunya sudah tertanam.
import { kepala, keterangan, kartuAkhir } from "../komponen.js";
import { jadwalIndikator } from "../../inti/kamera.js";

// Pembagian waktu (bagian C.7) dan waktu teks (bagian E). Pakai di adegan, misalnya WAKTU_INDIKATOR.cermin[0].
export const WAKTU_INDIKATOR = {
  durasi: 21,
  gridNyala: [0, 0.6],
  gejala: [0.6, 6.0],
  cermin: [6.0, 12.0],
  langkah: [12.0, 18.0],
  akhir: [18.0, 21.0],
  beku: [6.0, 6.6],          // gerak yang sedang berjalan melambat lalu berhenti
  denyut: [7.0, 11.8],       // denyut cermin pada benda cermin
  kepala: { masuk: [0.6, 1.2], keluar: [17.6, 18.0] },
  ket: {
    gejala: { masuk: [1.2, 1.7], keluar: [5.4, 5.8] },
    cermin: { masuk: [6.6, 7.1], keluar: [11.6, 12.0] },
    langkah: { masuk: [13.6, 14.1], keluar: [17.6, 18.0] },
  },
  kartu: { kepala: [18.2, 18.8], pil: [18.6, 19.2], sumber: [19.0, 19.6] },
};

export const ZONA_INDIKATOR = { x0: 0, y0: 600, x1: 1080, y1: 1440 };
export const TITIK_PERIKSA_INDIKATOR = [0.8, 3, 5.5, 6.8, 9, 12.6, 15, 16.6, 19.5, 20.9];

// isi:
//   nomor "01", total 44, kategori "KADERISASI"  → baris "INDIKATOR 01 / 44 · KADERISASI" (atau barisNomor langsung)
//   judul        judul indikator (h1)
//   gejala       teks di bawah label GEJALA (bawaan kosong: label saja)
//   cermin       teks CERMIN; langkah: teks LANGKAH. **kata** dicetak berwarna label.
//   ajakan       isi pil; bawaan "ahmadzulfikar.com/kuis" untuk semua indikator
//   sumber       baris sumber; bawaan sumber seri 44 indikator
//   merek, penutup, label { gejala, cermin, langkah }
export function formatIndikator(isi = {}) {
  const W = WAKTU_INDIKATOR;
  const {
    nomor = "00", total = 44, kategori = "", judul = "", gejala = "", cermin = "", langkah = "",
    ajakan = "ahmadzulfikar.com/kuis",
    sumber = "Sumber indikator: Agussalim Sitompul, 44 Indikator Kemunduran HMI (2006)",
    merek = "HMI EVIDENCE", penutup = "Jangan bicara HMI tanpa bukti.",
  } = isi;
  const label = { gejala: "GEJALA", cermin: "CERMIN", langkah: "LANGKAH", ...isi.label };
  const barisNomor = isi.barisNomor ?? `INDIKATOR ${nomor} / ${total}${kategori ? " · " + kategori : ""}`;
  return {
    nama: "indikator",
    durasi: W.durasi,
    zona: { ...ZONA_INDIKATOR },
    kabut: { atas: [420, 600], bawah: [1440, 1630] },
    fokusPiksel: { x: 540, y: 1010 },
    titikPeriksa: [...TITIK_PERIKSA_INDIKATOR],
    tanah: { nyala: W.gridNyala, jari: 20 },
    beku: W.beku,
    waktu: W,
    kamera: () => jadwalIndikator(),
    // Peristiwa struktur video untuk modul Suara (x = 0.5). Yang sama jenisnya dengan peristiwa gerak di dekatnya dilewati.
    peristiwa: [
      // durasi 0 = durasi bawaan jenis di modul Suara (grid-nyala 1.8 s, melambat 1 s, kartu-akhir sampai video selesai).
      { t: 0, jenis: "grid-nyala" },
      { t: W.beku[0], jenis: "melambat" },
      { t: W.denyut[0], jenis: "denyut", durasi: W.denyut[1] - W.denyut[0], periode: 1.2 },
      { t: W.kartu.kepala[0], jenis: "kartu-akhir" },
      { t: W.kartu.pil[0], jenis: "pil" },
    ],
    pasang() {
      const kep = kepala({ merek, nomor: barisNomor, judul, masuk: W.kepala.masuk, keluar: W.kepala.keluar });
      const ket = [
        keterangan({ label: label.gejala, warna: "abu", teks: gejala, ...W.ket.gejala }),
        keterangan({ label: label.cermin, warna: "zamrudTerang", teks: cermin, ...W.ket.cermin }),
        keterangan({ label: label.langkah, warna: "emas", teks: langkah, ...W.ket.langkah }),
      ];
      kartuAkhir({ merek, judul: penutup, ajakan, sumber, waktu: W.kartu });
      this.periksaTeks = () => periksaBaris([kep.judul, ...ket.map((k) => k.el.querySelector(".kit-ket-teks")).filter(Boolean)]);
    },
  };
}

// Bagian E: judul dan keterangan maksimal 3 baris. Diperiksa setelah font termuat; pelanggaran hanya diperingatkan.
function periksaBaris(daftar) {
  for (const e of daftar) {
    const baris = Math.round(e.offsetHeight / parseFloat(getComputedStyle(e).lineHeight));
    if (baris > 3) console.warn(`[kit] teks "${e.textContent.slice(0, 40)}…" ${baris} baris, maksimal 3.`);
  }
}
