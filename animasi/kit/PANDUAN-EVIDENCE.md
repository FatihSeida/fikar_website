# Panduan Video Format Evidence (kit 1.3.2)

Ini satu-satunya dokumen kit yang perlu dibaca untuk video seri 44 indikator, selain prompt videonya. Semua perintah dijalankan dari `animasi/`: di PC Windows lewat **PowerShell** (Edge menutup diri di sandbox Bash), di sesi cloud lewat Bash biasa. Jangan ubah kit; benda yang tidak ada dibuat di folder video, lalu dilaporkan.

## 1. Mulai
`npm run baru -- indikator-NN --format evidence --judul "Judul indikator"` membuat `animasi/proyek/indikator-NN/` (`index.html`, `adegan.js`). Edit hanya `adegan.js`; impor hanya dari `../../kit/index.js`.

## 2. Kerangka adegan.js (urutan jangan dibalik)
```js
import { buatVideo, formatEvidence, akhiriEvidence, duniaKader, titik, W, pion, muncul, jalan, hilang, klikEmas /* ... */ } from "../../kit/index.js";

// 1. format (teks dari prompt, persis)
const v = buatVideo({
  format: formatEvidence({
    nomor: "01", kategori: "KADERISASI", judul: "...", sebab: "... **kata penting** ...",
    ikhtiar: [{ teks: "...", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }], program: "Program 03",
    kuis: { pertanyaan: "...?", kalimat: "..." },
  }),
});
// 2. dunia
const d = duniaKader(v, { tanpa: ["kelas", "tangga"] });
const { gerbang, komisariat } = d.benda;
for (const b of [gerbang, d.benda.jalan]) b.userData.penting = (t) => t < 6.0; // latar boleh terpotong sesudah Bagian 1
// 3. Bagian 1-3 (0.6-23.0): benda (v.tambah), gerak, label3D, v.setiapFrame(t => setelKeadaan(...))
muncul(d.urutan, { t: 0.6, selesai: 1.6 });
const f = v.tambah(pion());
muncul(f, { t: 1.0, naik: 0 });
const j = jalan(f, { t: 1.0, jalur: d.titik.jalur, lengkung: true });
if (j.selesai) hilang(f, { t: j.selesai });
// 4. PALING AKHIR: Bagian 4-5 dan seluruh kamera
akhiriEvidence(v, { komisariat, kamera: {
  fokus: d.fokus,
  gejala: { muat: [gerbang, komisariat] }, sebab: { muat: [komisariat] }, ikhtiar: { muat: [f, komisariat] },
} });
```
- `akhiriEvidence` mengerjakan Bagian 4 (kuis 23.0-28.0), Bagian 5 (kartu akhir 28.0-31.0), dan seluruh kamera. Video **tidak** menulis `segmenKuis`, `jadwalEvidence`, `let jadwal`, atau `kamera:` di `buatVideo`.
- Lengkung kuis yang berdenyut (`kelompok`) otomatis dari `kategori`: KADERISASI, TATA KELOLA, PENGETAHUAN, TARGET PROGRAM, EVALUASI DAN ARSIP, DATA DAN JARINGAN. Kategori lain melempar galat; isi `kelompok: "kaderisasi" | "tata-kelola" | "pengetahuan" | "target-program" | "evaluasi-arsip" | "data-jaringan"` (atau `null`).
- Sesudahnya jangan membuat benda, label, atau `setiapFrame` lagi. Gerak berkelanjutan harus selesai sebelum 23.0.
- Kunci kamera: `awal` H 13 · `gejala` t 0-1.2 H 11 · `sebab` 6-7 H 8 · `ikhtiar` 13-14 H 11 · `tambahan: [{ t: [17.5, 18.5], muat: [...] }]` untuk geseran kamera di tengah bagian. Kunci tanpa `muat` boleh memakai `{ H, fokus }` biasa.

## 3. Kamera yang muat otomatis
`{ muat: [benda, titik...], H }`: fokus = semua isi `muat` ditaruh di tengah zona adegan (x 0-1080, y 600-1440); H = maks(H yang diberi atau bawaan kunci, `hMuat(muat)`). Tidak perlu coba-coba H, dan tidak ada peringatan "tidak muat".
- `muat` boleh berisi `Object3D` dan `Vector3`. Benda dibaca di **posisi dasarnya** (sebelum gerak), jadi tambahkan titik tujuan `lintas`, `busur`, dan `jalan` sebagai `Vector3`.
- `margin: 20` menyisakan 20 px di tiap sisi zona. `fokus: titik(...)` bersama `muat` menahan kamera di titik itu dan hanya menghitung H. `hMuat(benda, { fokus, margin })` mengembalikan H-nya saja.
- Prompt menyebut H tertentu? Isi `H`; bila tidak muat, H dinaikkan otomatis. Di laporan cukup sebut kunci mana yang memakai `muat`, tanpa perlu mencari angka H akhirnya.

## 4. Contekan API (waktu dalam detik; `t` = awal gerak)
**Posisi dan warna.** `titik(r, d, y)`: r kanan layar, d bawah layar (ke penonton), y atas. `W.abu W.abuGelap W.zamrud W.zamrudPijar W.zamrudRedup W.emas W.kertas W.pelat W.pion`. Emas hanya untuk hasil Bagian 3.

**formatEvidence.** `nomor total kategori judul mode("ikhtiar"|"pandangan") gejala sebab ikhtiar[{teks,masuk,keluar}] program kuis{pertanyaan,kalimat} ajakan baca sumber label waktu merek penutup barisNomor`. `**kata**` dicetak berwarna. Maks 3 kalimat ikhtiar (jendelanya tidak tumpang tindih); judul, kalimat, dan pertanyaan maks 3 baris. Waktu: grid 0-0.6, gejala 0.6-6.0, sebab 6.0-13.0, ikhtiar 13.0-23.0, kuis 23-28, akhir 28-31. Gerak berkelanjutan membeku 6.0-6.6 (`v.beku`).

**Gerak** (benda atau array; array: `jeda` antar benda, atau `selesai` = benda terakhir selesai di detik itu):
- `muncul(b, { t, durasi 0.5, naik 0.6, jeda 0.12, selesai })`: benda tak tampak sebelum `t`; `naik: 0` bila tidak boleh naik dari bawah. `hilang(b, { t, durasi 0.4, turun 0.3, bunyi })`.
- `jalan(figur, { t, jalur: [Vector3], lengkung, laju 1.2, durasi, beku, bunyi: { kuat } })` mengembalikan `{ selesai }` (null bila membeku di tengah jalan). `lintas(b, { t, durasi, jalur, lengkung, kurva, beku })`: benda apa pun meluncur.
- `busur(b, { t, dari, ke, tinggi 1, durasi 0.8 })`: parabola. `gantiBenda(a, b, { t, durasi 0.4, tempat })`: a berubah jadi b. `tumbuh(batang, { t, durasi 0.3, sumbu: "y" })` (array berurutan).
- `klikEmas(b, { t, durasi, jeda })`: benda hasil jadi emas. `denyutCermin(b, { mulai, selesai })`: tepi zamrud berdenyut. `debu({ pusat, mulai, selesai, jumlah, sebar, naik, benih, induk })`.
- `catat({ t, jenis, kuat, durasi, posisi, sumber })`: bunyi tambahan (`gemuruh`, `debu`, `kertas`, `garis-sambung`, `garis-putus`, ...); `sumber` unik.

**Label dan keadaan.** `label3D("teks", { pada: benda|Vector3, geser: [x, y, z], gaya: "benda"|"kotak"|"baris"|"mikro", masuk: [a, b], keluar: [c, d] })`; `gantiLabel(label, { t, teks })`. Di dalam `v.setiapFrame((t) => ...)` setel tanpa syarat tiap frame: `setelKeadaan(b, "abu"|"pudar"|"emas"|"denyut", 0..1)`, `aturOpasitas(b, 0..1)`, `garis.userData.aturTampak(0..1)` (garisPutus, panahGaris).

**Benda** (hanya opsi yang dipakai prompt 01-02; sisanya bawaan):
- `pion({ skala, pudar, aktif, duduk, tangan })` · `rumah()` (komisariat) · `gerbangKampus()` · `gedungKelas()` (arahkan dengan `rotation.y`).
- `kartuKecil({ simbol: null|"garis"|"grafik"|"centang", warna, skala, rebah, miring, hadap })` · `tandaTanya({ ukuran, hadapKamera, tengah })` · `kartuProker({ garis, kaki, skala, warna })` · `lembarKertas()` · `balonKata({ isi: "titik"|"tanya"|"kosong"|..., skala, warna })` (titik asal di ujung ekor, taruh di kepala figur).
- `papanTulis({ lebar, tinggi, kaki, kolom: ["A", "B"], baris: ["", ""] })` + `userData.titikSel(kolom, baris)` · `ikonGrafik({ tinggi: [1, 0.65, 0.35], skala })` (`userData.bagian.batang`).
- `blokTanah({ lebar, tinggi, dalam, sisiCelah, patah, benih })` · `papanJembatan()` · `garisPutus({ titik, lengkung, warna, lebar })` · `panahGaris({ titik, lengkung, warna })`.
- `duniaKader(v, { tanpa })`: `d.benda.{gerbang,kelas,jalan,komisariat,tangga}`, `d.titik.{jalur,belakangGerbang,depanGerbang,atasGerbang,lapangan,pintu,depanPintu,depanKomisariat,atap}`, `d.urutan`, `d.fokus`.

## 5. Jebakan (yang sudah menjebak agen sebelumnya)
- `kartuKecil` tegak menghadap kamera = `rebah: false, miring: 0` (+ `skala` agar muat di sel papan). Titik asalnya tepi bawah: pusat kartu = posisi + 0.4 × skala ke atas.
- `tandaTanya` di kartu tegak: `hadapKamera: false, tengah: true`, geser 0.03 ke muka kartu (`titik(0, 1)`). Bila dijadikan anak kartu, tambah `hadap: 0` supaya tidak berputar dua kali. Agar tidak ikut `setelKeadaan(kartu, "abu")`: `tanya.userData.bagian.badan.material.userData.abaikanKeadaan = true`.
- `papan.userData.titikSel(k, r)` mengembalikan titik **lokal**: pakai `papan.localToWorld(...)` (panggil `papan.updateMatrixWorld(true)` sesudah menaruh papan). Baris `r = 0` ada di atas, jadi menumpuk dari bawah berarti `r = 2, 1, 0`.
- `blokTanah({ patah })` menerima nama sisi (`"kiri" | "kanan" | "depan" | "belakang"`), bukan `true`.
- `debu` yang jatuh: `naik` negatif (mis. -0.4) dan `beku: false`. Dengan `induk`, beri `bunyi: false` dan catat bunyinya sendiri: `catat({ jenis: "debu", posisi: <Vector3 dunia> })`.
- `gantiBenda(a, b, ...)` dengan `a` yang bergerak: `tempat: false` (b tidak dipindah ke posisi dasar a).
- Figur yang dibekukan format (6.0-6.6) tetap tampak sampai Bagian 4. Bila kamera mendekat dan mereka menutupi teks atau keluar zona, hilangkan: `hilang(f, { t: 6.6 })`.
- Benda yang sengaja terpotong (latar, jejak panjang, masuk dari luar layar) dikecualikan: `b.userData.penting = false` atau `(t) => t < 6.0`. Laporkan pengecualiannya. Dengan kamera dekat Bagian 2-3, biasanya ini mengenai `kelas`, `tangga`, dan juga `komisariat` (`(t) => t < 6.0 || t >= <saat kamera kembali>`).
- Garis di tanah (jejak `garisPutus`) yang melewati ubin jalan dipasang di y 0.08. Ubin setinggi 0.06 menutupi garis di y 0.02.

## 6. Pemeriksaan
1. `npm run buat -- indikator-NN --periksa` menulis `hasil/gambar/indikator-NN/lembar.png` dan laporan di terminal (zona, warna, `Peringatan kit`). Buka lembar dan lihat **hanya Bagian 1-3**: titik 0.8, 3, 5.5, 9.5, 14.5, 18, 22. Titik 24.5, 26.8, 29.5, 30.9 (Bagian 4-5) otomatis; tidak perlu diperiksa.
2. Ulangi sampai `Zona: 0 pelanggaran`, warna bersih, dan tidak ada peringatan. Pelanggaran zona dilaporkan per benda dan detik: naikkan H lewat `muat`/`margin`, geser benda, atau kecualikan lewat `userData.penting`.
3. Untuk detail kecil saja: `npm run buat -- indikator-NN --jepret 3,15` (tangkapan penuh `hasil/gambar/indikator-NN/t3.png`, cepat). Titik lembar lain: `--titik 2,8,16`.
4. Render penuh: `npm run buat -- indikator-NN` (tambah `--gpu` bila ada kartu grafis). Di sesi cloud, yang tidak punya GPU, render 31 detik butuh sekitar 10-20 menit: jalankan di latar (`run_in_background`) dan tunggu sampai selesai. Sesudah itu kirim `hasil/video/indikator-NN.mp4` ke pengguna dengan `SendUserFile` (`display: "attach"`). Hasil: `hasil/video/indikator-NN.mp4` (bersuara; versi bisunya hanya bahan antara di `hasil/kerja/indikator-NN/bisu.mp4`).
5. Laporkan penyimpangan dari prompt beserta alasannya (H yang dinaikkan, pengecualian zona, benda lokal). Laporan cukup pendek: satu baris per penyimpangan, lalu hasil zona, warna, LUFS, dan sinkron.

## 7. Keputusan yang sudah disetujui (jangan berhenti untuk bertanya)
Bila prompt tidak bisa dipenuhi persis, ambil sendiri keputusan berikut, catat satu baris di laporan, lalu lanjutkan sampai render selesai.
- **Kamera tidak muat:** H naik lewat `muat`, setinggi yang diperlukan. Bila prompt menyebut H, angka itu dianggap batas bawah.
- **Benda latar terpotong saat kamera mendekat:** kecualikan dari zona lewat `userData.penting`.
- **Benda tidak muat di sel atau papan:** kecilkan `skala`.
- **Benda bertabrakan atau keluar zona:**
  - geser sesedikit mungkin;
  - bila perlu lebih dari 1 unit, pilih posisi terdekat yang lolos.
- **Figur yang dibekukan format masih tampak dan menutupi teks atau benda penting:** `hilang` di 6.6-7.0.
- **Titik periksa K jatuh sebelum peristiwanya selesai:** nilai keadaannya saat peristiwa itu selesai.
- **Bunyi yang sudah dicatat gerak standar** (misalnya `gantiBenda` mencatat `kertas`): jangan catat ulang.
- **Opsi atau benda yang disebut prompt tidak ada di kit:**
  - pakai yang paling dekat di kit;
  - bila tidak ada sama sekali, buat di `benda-lokal.js`.

**Yang tidak boleh diubah:**
- teks di layar;
- urutan adegan;
- waktu peristiwa (toleransi ±0.3 detik);
- aturan warna dan emas;
- link;
- larangan bagian J.

Bila salah satunya mustahil dipenuhi, kerjakan versi terdekat, tulis **PERLU KEPUTUSAN** di laporan, dan tetap selesaikan render.
