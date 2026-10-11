// Format "evidence": video 31 detik seri 44 indikator versi lima bagian (Prompt 00 bagian B).
// Gejala → sebab → Ikhtiar atau Pandangan → Kuis → Kartu akhir. Isi teks masuk lewat parameter;
// tata letak, gaya, dan waktunya sudah tertanam. Kabut, zona adegan, dan piksel fokus sama dengan format indikator.
import { kepala, keterangan, panel, kartuAkhir, sorot } from "../komponen.js";
import { jadwalEvidence } from "../../inti/kamera.js";

// Pembagian waktu bawaan (detik). Semua waktu teks diturunkan dari pembagian ini (lihat `turunkan`), jadi `waktu` yang
// menimpa pembagian ikut menggeser seluruh teks. Hasil bawaannya:
//   gridNyala 0–0.6, gejala 0.6–6.0, sebab 6.0–13.0, ikhtiar 13.0–23.0, kuis 23.0–28.0, akhir 28.0–31.0, beku 6.0–6.6
const BAGIAN = {
  gridNyala: [0, 0.6],
  gejala: [0.6, 6.0],
  sebab: [6.0, 13.0],
  ikhtiar: [13.0, 23.0],
  kuis: [23.0, 28.0],
  akhir: [28.0, 31.0],
};
const URUTAN = Object.keys(BAGIAN);

const r3 = (x) => Math.round(x * 1000) / 1000;
const jend = (a, lama) => [r3(a), r3(a + lama)];

// Semua waktu video dari pembagian `b` (gridNyala, gejala, sebab, ikhtiar, kuis, akhir, beku opsional).
function turunkan(b) {
  return {
    ...b,
    durasi: b.akhir[1],                          // durasi video = akhir kartu akhir
    beku: b.beku ?? jend(b.sebab[0], 0.6),       // gerak bersambung melambat lalu berhenti
    kepala: { masuk: jend(b.gejala[0], 0.6), keluar: jend(b.ikhtiar[1] - 0.4, 0.4) },
    ket: {
      gejala: { masuk: jend(b.gejala[0] + 0.6, 0.5), keluar: jend(b.gejala[1] - 0.6, 0.4) },
      sebab: { masuk: jend(b.sebab[0] + 0.6, 0.5), keluar: jend(b.sebab[1] - 0.4, 0.4) },
      ikhtiar: { masuk: jend(b.ikhtiar[0] + 0.6, 0.5), keluar: jend(b.ikhtiar[1] - 0.4, 0.4) },   // label dan baris program
      kuis: { masuk: jend(b.kuis[0] + 0.4, 0.5), keluar: jend(b.kuis[1] - 0.4, 0.4) },           // label
    },
    kalimatKuis: { masuk: jend(b.kuis[0] + 0.6, 0.5), keluar: jend(b.kuis[0] + 2.6, 0.4) },
    kartuTanya: { masuk: jend(b.kuis[0] + 0.4, 0.5), keluar: jend(b.kuis[1] - 0.4, 0.4) },
    kartu: {
      kepala: jend(b.akhir[0] + 0.2, 0.6),
      pil: jend(b.kuis[0] + 3.0, 0.6),           // pil sudah tampak sebelum kartu akhir dan dipakai bersama kartu akhir
      baca: jend(b.akhir[0] + 0.6, 0.6),
      sumber: jend(b.akhir[0] + 0.8, 0.6),
    },
  };
}

export const WAKTU_EVIDENCE = turunkan(BAGIAN);

const TITIK_PERIKSA_BAWAAN = [0.8, 3, 5.5, 9.5, 14.5, 18, 22, 24.5, 26.8, 29.5, 30.9];

// Titik periksa bawaan dipetakan ke posisi yang setara di waktu baru: sebanding di dalam bagian yang sama.
function titikPeriksa(w) {
  return TITIK_PERIKSA_BAWAAN.map((p) => {
    const nama = URUTAN.find((n) => p <= BAGIAN[n][1]) ?? "akhir";
    const [a, b] = BAGIAN[nama], [a2, b2] = w[nama];
    return Math.round((a2 + ((p - a) / (b - a)) * (b2 - a2)) * 100) / 100;
  });
}

// waktu menimpa pembagian: sebagian atau semua dari gridNyala, gejala, sebab, ikhtiar, kuis, akhir, beku (masing-masing [a, b]).
function susunWaktu(timpa = {}) {
  const b = { ...BAGIAN };
  for (const k of [...URUTAN, "beku"]) if (timpa[k]) b[k] = [...timpa[k]];
  return turunkan(b);
}

// Label lebih dari 30 karakter dikecilkan supaya tetap muat (maksimal dua baris).
const gayaLabel = (teks) => ([...teks].length > 30 ? { ukuranLabel: 20, jarakLabel: 0.16 } : {});

// isi:
//   nomor "01", total 44, kategori "KADERISASI", judul   → baris "INDIKATOR 01 / 44 · KADERISASI" (atau barisNomor langsung) dan h1
//   mode         "ikhtiar" (bawaan) atau "pandangan": menentukan label Bagian 3 (IKHTIAR / PANDANGAN HMI EVIDENCE)
//   waktu        menimpa pembagian waktu bawaan, mis. { kuis: [23, 29], akhir: [29, 32] }; titik periksa dihitung ulang
//   gejala       teks di bawah label GEJALA (bawaan kosong: label saja)
//   sebab        satu kalimat Bagian 2. **kata** dicetak berwarna label.
//   ikhtiar      1–3 kalimat Bagian 3: [{ teks, masuk: [a, b], keluar: [c, d] }]. Label tetap tampak, kalimat berganti dengan celup pudar.
//                masuk/keluar kosong = jendela label. Jendela kalimat harus berurutan tanpa tumpang tindih.
//   program      baris kecil di bawah kalimat Bagian 3, mis. "Program 03 · Program 06" (boleh kosong)
//   kuis         { pertanyaan, kalimat }: pertanyaan null (atau kosong) menyembunyikan kartu pertanyaan; kalimat di bawah label kuis
//   ajakan       isi pil; bawaan "ahmadzulfikar.com/kuis"
//   baca         baris baca; bawaan "Baca lengkapnya: ahmadzulfikar.com/indikator/NN" (NN dari nomor); "" menyembunyikan
//   sumber       baris sumber; bawaan sumber seri 44 indikator
//   label        { gejala, sebab, ikhtiar, kuis, pertanyaan } menimpa teks label (ikhtiar = label Bagian 3 untuk kedua mode)
//   merek, penutup, barisNomor   seperti formatIndikator
export function formatEvidence(isi = {}) {
  const W = susunWaktu(isi.waktu);
  const {
    nomor = "00", total = 44, kategori = "", judul = "", mode = "ikhtiar", gejala = "", sebab = "", ikhtiar = [], program = "",
    ajakan = "ahmadzulfikar.com/kuis",
    sumber = "Sumber indikator: Agussalim Sitompul, 44 Indikator Kemunduran HMI (2006)",
    merek = "HMI EVIDENCE", penutup = "Jangan bicara HMI tanpa bukti.",
  } = isi;
  if (mode !== "ikhtiar" && mode !== "pandangan") throw new Error(`[kit] formatEvidence: mode harus "ikhtiar" atau "pandangan", bukan ${JSON.stringify(mode)}.`);
  const kuis = { pertanyaan: null, kalimat: "", ...isi.kuis };
  const baca = isi.baca ?? `Baca lengkapnya: ahmadzulfikar.com/indikator/${String(nomor).padStart(2, "0")}`;
  const label = {
    gejala: "GEJALA",
    sebab: "KENAPA FENOMENA TERSEBUT MASIH TERJADI?",
    ikhtiar: mode === "pandangan" ? "PANDANGAN HMI EVIDENCE" : "IKHTIAR HMI EVIDENCE",
    kuis: "AYO IKUTI KUIS SEBERAPA EVIDENCE KOMISARIATMU",
    pertanyaan: "PERTANYAAN DI KUIS",
    ...isi.label,
  };
  const barisNomor = isi.barisNomor ?? `INDIKATOR ${nomor} / ${total}${kategori ? " · " + kategori : ""}`;
  return {
    nama: "evidence",
    kategori,                                                    // dibaca akhiriEvidence untuk memilih lengkung kuis yang berdenyut
    durasi: W.durasi,
    zona: { x0: 0, y0: 600, x1: 1080, y1: 1440 },               // sama dengan format indikator
    kabut: { atas: [420, 600], bawah: [1440, 1630] },
    fokusPiksel: { x: 540, y: 1010 },
    titikPeriksa: titikPeriksa(W),
    tanah: { nyala: W.gridNyala, jari: 20 },
    beku: W.beku,
    waktu: W,
    kamera: () => jadwalEvidence(),
    // Peristiwa struktur video untuk modul Suara (x = 0.5). Tidak ada denyut bawaan.
    peristiwa: [
      { t: 0, jenis: "grid-nyala" },
      { t: W.beku[0], jenis: "melambat" },
      { t: W.kartu.pil[0], jenis: "pil" },
      { t: W.kartu.kepala[0], jenis: "kartu-akhir" },
    ],
    pasang() {
      if (ikhtiar.length > 3) console.warn(`[kit] ikhtiar berisi ${ikhtiar.length} kalimat, maksimal 3.`);
      const kep = kepala({ merek, nomor: barisNomor, judul, masuk: W.kepala.masuk, keluar: W.kepala.keluar });
      const ket = [
        keterangan({ label: label.gejala, warna: "abu", teks: gejala, ...W.ket.gejala, ...gayaLabel(label.gejala) }),
        keterangan({ label: label.sebab, warna: "zamrudTerang", teks: sebab, ...W.ket.sebab, ...gayaLabel(label.sebab) }),
        keterangan({
          label: label.ikhtiar, warna: "emas", program, ...W.ket.ikhtiar, ...gayaLabel(label.ikhtiar),
          kalimat: ikhtiar.map(({ teks, masuk, keluar }) => ({ teks, masuk, keluar })),
        }),
        keterangan({
          label: label.kuis, warna: "emas", ...W.ket.kuis, ...gayaLabel(label.kuis),
          kalimat: kuis.kalimat ? [{ teks: kuis.kalimat, ...W.kalimatKuis }] : null,
        }),
      ];
      // Kartu pertanyaan (komponen panel) di zona kepala; isinya dibungkus <p> supaya jumlah barisnya bisa diperiksa.
      const tanya = kuis.pertanyaan
        ? panel({
          judul: label.pertanyaan, isi: `<p>${sorot(kuis.pertanyaan)}</p>`, top: 330, kelas: "kartu-kuis",
          ...W.kartuTanya, naik: 12,
        })
        : null;
      // Pil ajakan sudah masuk di akhir Bagian 4 dan dipakai bersama kartu akhir, jadi hanya ada satu pil.
      const akhir = kartuAkhir({ merek, judul: penutup, ajakan, sumber, baca, waktu: W.kartu, top: { pil: 1540, baca: 1660, sumber: 1696 } });
      this.periksaTeks = () => {
        const cek = [[kep.judul, 3], [akhir.el.querySelector(".kit-judul"), 3]];
        for (const k of ket) {
          cek.push([k.label, 2]);
          if (k.barisKalimat) k.barisKalimat().forEach((n, i) => { if (n > 3) console.warn(`[kit] kalimat ${i + 1} di bawah "${k.label.textContent}" ${n} baris, maksimal 3.`); });
          else cek.push([k.el.querySelector(".kit-ket-teks"), 3]);
        }
        if (tanya) cek.push([tanya.isi.querySelector("p"), 3]);
        periksaBaris(cek);
      };
    },
  };
}

// Judul, keterangan, dan kartu pertanyaan maksimal 3 baris; label maksimal 2 baris. Diperiksa setelah font termuat;
// pelanggaran hanya diperingatkan. daftar: [[elemen, maksimal baris], ...]
function periksaBaris(daftar) {
  for (const [e, maks] of daftar) {
    if (!e) continue;
    const baris = Math.round(e.offsetHeight / parseFloat(getComputedStyle(e).lineHeight));
    if (baris > maks) console.warn(`[kit] teks "${e.textContent.slice(0, 40)}…" ${baris} baris, maksimal ${maks}.`);
  }
}
