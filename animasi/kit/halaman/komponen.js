// Komponen teks halaman. Semuanya digerakkan oleh t: buatVideo() memanggil perbarui(t) tiap frame.
// Posisi dan ukuran dalam piksel halaman. Waktu [a, b] dalam detik.
import { videoAktif } from "../inti/aktif.js";
import { varWarna } from "../inti/tema.js";
import { campur, keluar3, halus, rentang } from "../inti/waktu.js";

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
// Teks biasa → HTML aman; **kata** dicetak berwarna (warna label komponen), tanda bintangnya hilang.
export const sorot = (teks = "") => String(teks).replace(/[&<>"]/g, (c) => ESC[c]).replace(/\*\*(.+?)\*\*/g, '<b class="kit-sorot">$1</b>');

function el(tag, kelas, induk, html) {
  const e = document.createElement(tag);
  if (kelas) e.className = kelas;
  if (html !== undefined) e.innerHTML = html;
  if (induk) induk.appendChild(e);
  return e;
}
function daftar(komp, siapa) {
  const v = videoAktif(siapa);
  v.komponen.push(komp);
  return komp;
}
const lapisan = (siapa) => videoAktif(siapa).halaman.lapisanHalaman;
const jendelaWaktu = (w, lama) => (w == null ? null : Array.isArray(w) ? w : [w, w + lama]);
// Opasitas masuk (keluar3) × keluar (halus). masuk/keluar null = selalu tampak di sisi itu.
function tampak(t, masuk, keluar) {
  const a = masuk ? keluar3(rentang(t, masuk[0], masuk[1])) : 1;
  const b = keluar ? halus(rentang(t, keluar[0], keluar[1])) : 0;
  return { a, op: a * (1 - b) };
}
const kotak = (e, { kiri, top, lebar, tinggi }) => {
  if (kiri !== undefined) e.style.left = kiri + "px";
  if (top !== undefined) e.style.top = top + "px";
  if (lebar !== undefined) e.style.width = lebar + "px";
  if (tinggi !== undefined) e.style.height = tinggi + "px";
};

// ---------------------------------------------------------------- kepala: baris merek, baris nomor, judul h1
// Masuk: opacity 0 → 1 sambil naik `naik` px (keluar3). Keluar: pudar (halus).
export function kepala({ merek = "HMI EVIDENCE", nomor = null, judul = "", miring = false, top = 226, kiri = 100, lebar = 880,
  masuk = [0.6, 1.2], keluar = null, naik = 12 } = {}) {
  const akar = el("header", "kit-kepala", lapisan("kepala"));
  kotak(akar, { kiri, top, lebar });
  if (merek) el("div", "kit-merek", akar).textContent = merek;
  if (nomor) el("div", "kit-nomor", akar).textContent = nomor;
  const h1 = el("h1", "kit-judul" + (miring ? " miring" : ""), akar, sorot(judul));
  const mIn = jendelaWaktu(masuk, 0.6), mOut = jendelaWaktu(keluar, 0.4);
  return daftar({
    el: akar, judul: h1,
    perbarui(t) {
      const { a, op } = tampak(t, mIn, mOut);
      akar.style.opacity = op.toFixed(4);
      akar.style.transform = `translateY(${((1 - a) * naik).toFixed(1)}px)`;
    },
  }, "kepala");
}

// ---------------------------------------------------------------- keterangan: label kecil + teks, **kata** berwarna label
// warna: token tema (mis. "abu", "zamrudTerang", "emas") atau warna CSS.
// Opsi tambahan (format evidence); tanpa opsi ini komponen berperilaku seperti biasa:
//   ukuranLabel, jarakLabel  ukuran font label (px) dan letter-spacing-nya (em); padding kiri label mengikuti jarakLabel
//   program                  baris kecil mono di bawah teks (14 px), atau di bawah kalimat yang sedang tampak
//   kalimat                  [{ teks, masuk, keluar }]: label tetap tampak menurut masuk/keluar komponen, sedangkan kalimatnya
//                            bergantian dengan celup pudar menurut jendelanya sendiri (kosong = jendela label). Jendela kalimat
//                            harus berurutan tanpa tumpang tindih. Baris program ikut tinggi kalimat yang tampak.
export function keterangan({ label = "", warna = "krem", teks = "", top = 1490, kiri = 100, lebar = 880,
  masuk = null, keluar = null, naik = 16, ukuranLabel = null, jarakLabel = null, program = "", kalimat = null } = {}) {
  const akar = el("div", "kit-ket", lapisan("keterangan"));
  kotak(akar, { kiri, top, lebar });
  akar.style.setProperty("--warna-label", varWarna(warna));
  let eLabel = null;
  if (label) {
    eLabel = el("div", "kit-ket-label", akar);
    eLabel.textContent = label;
    if (ukuranLabel != null) eLabel.style.fontSize = ukuranLabel + "px";
    if (jarakLabel != null) { eLabel.style.letterSpacing = jarakLabel + "em"; eLabel.style.paddingLeft = jarakLabel + "em"; }
  }
  const mIn = jendelaWaktu(masuk, 0.5), mOut = jendelaWaktu(keluar, 0.4);
  if (!kalimat?.length) {
    if (teks) el("p", "kit-ket-teks", akar, sorot(teks));
    if (program) el("div", "kit-ket-program", akar).textContent = program;
    return daftar({
      el: akar,
      perbarui(t) {
        const { a, op } = tampak(t, mIn, mOut);
        akar.style.opacity = op.toFixed(4);
        akar.style.transform = `translateY(${((1 - a) * naik).toFixed(1)}px)`;
      },
    }, "keterangan");
  }

  // Mode kalimat bergantian: label, kalimat, dan baris program masing-masing punya opasitas sendiri.
  const ks = kalimat.map((k) => {
    const m = jendelaWaktu(k.masuk ?? masuk, 0.5);
    return { teks: k.teks ?? "", masuk: m, keluar: jendelaWaktu(k.keluar ?? keluar, 0.4), mulai: m ? m[0] : -Infinity };
  });
  const eTeks = el("p", "kit-ket-teks", akar);
  const eProg = program ? el("div", "kit-ket-program", akar) : null;
  if (eProg) eProg.textContent = program;
  let kini = -1, tinggi = null;
  // Tinggi alami tiap kalimat (px). Benar hanya sesudah font termuat, jadi diukur saat dibutuhkan, bukan saat dibangun.
  const ukur = () => {
    eTeks.style.height = "";
    const h = ks.map((k) => { eTeks.innerHTML = sorot(k.teks); return eTeks.offsetHeight; });
    kini = -1;
    return h;
  };
  return daftar({
    el: akar, label: eLabel, teks: eTeks, program: eProg,
    // Jumlah baris tiap kalimat, untuk pemeriksaan format.
    barisKalimat() { const lh = parseFloat(getComputedStyle(eTeks).lineHeight); return ukur().map((h) => Math.round(h / lh)); },
    perbarui(t) {
      akar.style.opacity = "1";
      const { a, op } = tampak(t, mIn, mOut);
      const naikLabel = `translateY(${((1 - a) * naik).toFixed(1)}px)`;
      if (eLabel) { eLabel.style.opacity = op.toFixed(4); eLabel.style.transform = naikLabel; }
      if (eProg && ks.length > 1 && !tinggi) tinggi = ukur();
      let i = 0;
      ks.forEach((k, j) => { if (t >= k.mulai) i = j; });
      if (i !== kini) { eTeks.innerHTML = sorot(ks[i].teks); kini = i; }
      const kt = tampak(t, ks[i].masuk, ks[i].keluar);
      eTeks.style.opacity = kt.op.toFixed(4);
      eTeks.style.transform = `translateY(${((1 - kt.a) * naik).toFixed(1)}px)`;
      if (eProg) {
        eProg.style.opacity = op.toFixed(4);
        eProg.style.transform = naikLabel;
        if (tinggi) {
          // Baris program meluncur ke tinggi kalimat berikutnya selama jeda di antara kedua kalimat, tanpa lompatan.
          const berikut = ks[i + 1];
          let h = tinggi[i];
          if (berikut) {
            const akhirJeda = berikut.mulai;
            const awalJeda = Math.min(ks[i].keluar ? ks[i].keluar[1] : akhirJeda, akhirJeda);
            h = campur(h, tinggi[i + 1], halus(rentang(t, awalJeda, akhirJeda)));
          }
          eTeks.style.height = h.toFixed(1) + "px";
        }
      }
    },
  }, "keterangan");
}

// ---------------------------------------------------------------- alur langkah: "buka → jawab → hasil"
// langkah: ["buka", ...]; waktu: [[mulai, selesai], ...] per langkah. Langkah aktif emas dengan garis bawah yang terisi,
// langkah selesai zamrudTerang, sisanya krem samar.
export function alurLangkah({ langkah = [], waktu = [], top = 420, kiri = 100, lebar = 880, masuk = null, keluar = null, ukuran = 28 } = {}) {
  const akar = el("div", "kit-alur", lapisan("alurLangkah"));
  kotak(akar, { kiri, top, lebar });
  akar.style.fontSize = ukuran + "px";
  const item = langkah.map((n, i) => {
    if (i > 0) el("span", "kit-panah", akar).textContent = "→";
    const s = el("span", "kit-langkah", akar);
    s.append(document.createTextNode(n));
    return { s, isi: el("i", null, s) };
  });
  const mIn = jendelaWaktu(masuk, 0.5), mOut = jendelaWaktu(keluar, 0.4);
  return daftar({
    el: akar,
    perbarui(t) {
      akar.style.opacity = tampak(t, mIn, mOut).op.toFixed(4);
      item.forEach(({ s, isi }, i) => {
        const [a, b] = waktu[i] ?? [Infinity, Infinity];
        const aktif = Math.min(halus((t - a) / 0.25), halus((b - t) / 0.25));
        const selesai = halus((t - b) / 0.3);
        const dasar = `color-mix(in srgb, var(--zamrud-terang) ${(selesai * 100).toFixed(1)}%, color-mix(in srgb, var(--krem) 34%, transparent))`;
        s.style.color = `color-mix(in srgb, var(--emas) ${(aktif * 100).toFixed(1)}%, ${dasar})`;
        s.style.fontWeight = aktif > 0.5 ? "700" : "500";
        isi.style.width = (rentang(t, a, b) * 100).toFixed(2) + "%";
        isi.style.opacity = aktif.toFixed(4);
      });
    },
  }, "alurLangkah");
}

// ---------------------------------------------------------------- panel HUD generik
// isi: string HTML atau Element. animasi(t, elIsi): opsional, untuk menggerakkan isi panel dari t.
// kelas: kelas CSS tambahan pada panel (format evidence: "kartu-kuis" untuk kartu pertanyaan kuis).
export function panel({ judul = "", isi = "", top = 1160, kiri = 100, lebar = 880, tinggi, masuk = null, keluar = null, naik = 16, animasi, kelas = "" } = {}) {
  const akar = el("section", "kit-panel" + (kelas ? " " + kelas : ""), lapisan("panel"));
  kotak(akar, { kiri, top, lebar, tinggi });
  if (judul) el("div", "kit-panel-kepala", akar).textContent = judul;
  const elIsi = el("div", "kit-panel-isi", akar);
  if (typeof isi === "string") elIsi.innerHTML = isi; else if (isi) elIsi.appendChild(isi);
  const mIn = jendelaWaktu(masuk, 0.5), mOut = jendelaWaktu(keluar, 0.4);
  return daftar({
    el: akar, isi: elIsi,
    perbarui(t) {
      const { a, op } = tampak(t, mIn, mOut);
      akar.style.opacity = op.toFixed(4);
      akar.style.transform = `translateY(${((1 - a) * naik).toFixed(1)}px)`;
      if (animasi) animasi(t, elIsi);
    },
  }, "panel");
}

// ---------------------------------------------------------------- kartu akhir: merek + judul miring, pil ajakan emas, baris sumber
// baca (opsional, format evidence): baris di antara pil dan sumber, mis. "Baca lengkapnya: ahmadzulfikar.com/indikator/01".
// Waktu dan posisinya: waktu.baca (bawaan [18.8, 19.4]), top.baca (bawaan 1600).
export function kartuAkhir({ merek = "HMI EVIDENCE", judul = "Jangan bicara HMI tanpa bukti.", ajakan = "", sumber = "", panah = true,
  waktu = {}, top = {}, kiri = 100, lebar = 880, baca = "" } = {}) {
  const w = { kepala: [18.2, 18.8], pil: [18.6, 19.2], sumber: [19.0, 19.6], baca: [18.8, 19.4], ...waktu };
  const y = { kepala: 226, pil: 1500, sumber: 1640, baca: 1600, ...top };
  const kep = kepala({ merek, judul, miring: true, top: y.kepala, kiri, lebar, masuk: w.kepala, keluar: null });
  let pil = null, elBaca = null, elSumber = null;
  if (ajakan) {
    pil = el("div", "kit-ajakan" + (panah ? " panah" : ""), lapisan("kartuAkhir"));
    kotak(pil, { kiri, top: y.pil, lebar });
    el("div", null, pil).textContent = ajakan;
  }
  if (baca) {
    elBaca = el("div", "kit-baca", lapisan("kartuAkhir"));
    kotak(elBaca, { kiri, top: y.baca, lebar });
    elBaca.textContent = baca;
  }
  if (sumber) {
    elSumber = el("div", "kit-sumber", lapisan("kartuAkhir"));
    kotak(elSumber, { kiri, top: y.sumber, lebar });
    elSumber.textContent = sumber;
  }
  return daftar({
    el: kep.el, pil, baca: elBaca, sumber: elSumber,
    perbarui(t) {
      if (pil) {
        const a = keluar3(rentang(t, w.pil[0], w.pil[1]));
        pil.style.opacity = a.toFixed(4);
        pil.style.transform = `scale(${(0.92 + 0.08 * a).toFixed(4)})`;
      }
      if (elBaca) {
        const a = keluar3(rentang(t, w.baca[0], w.baca[1]));
        elBaca.style.opacity = a.toFixed(4);
        elBaca.style.transform = `translateY(${((1 - a) * 12).toFixed(1)}px)`;
      }
      if (elSumber) {
        const a = keluar3(rentang(t, w.sumber[0], w.sumber[1]));
        elSumber.style.opacity = a.toFixed(4);
        elSumber.style.transform = `translateY(${((1 - a) * 12).toFixed(1)}px)`;
      }
    },
  }, "kartuAkhir");
}
