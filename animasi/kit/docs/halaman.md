# halaman

`buatVideo()`, kerangka halaman, komponen teks, label 3D, dan format. Semua teks adalah HTML yang digerakkan oleh `t`; tidak ada teks 3D, transisi CSS, atau animasi CSS.

## Contoh

```js
import { buatVideo, formatIndikator, jadwalIndikator, titik, pion, rumah, label3D, gantiLabel } from "../../kit/index.js";

let jadwal;
const v = buatVideo({
  format: formatIndikator({
    nomor: "01", kategori: "KADERISASI",
    judul: "Jumlah mahasiswa baru yang masuk HMI menurun.",
    cermin: "Berapa peserta **LK 1** kita dalam tiga tahun terakhir?",
    langkah: "Satu tabel sederhana, lalu tanya lima kader baru alasannya.",
    ajakan: "ahmadzulfikar.com/kuis",
  }),
  kamera: (t) => jadwal(t),
});
const kom = v.tambah(rumah());
kom.position.copy(titik(2.6, 2.2));
jadwal = jadwalIndikator({ cermin: { fokus: titik(2.6, 2.2, 0.6) } });
const tahun = label3D("2024", { pada: kom, geser: [0, 2.4, 0], gaya: "kotak", masuk: 0.6, keluar: [6, 6.4] });
gantiLabel(tahun, { t: 2.4, teks: "2025" });
```

`index.html` cukup memuat font, `../../kit/halaman/kerangka.css`, dan `<script type="module" src="./adegan.js">` (lihat templat di `kit/alat/templat/`).

## buatVideo(opsi) → v

| Opsi | Bawaan |
|---|---|
| `durasi` | dari format (indikator: 21, evidence: 31) |
| `fps` | 30 |
| `ukuran` | `{ lebar: 1080, tinggi: 1920 }` |
| `tema` | palet B.5 (`buatTema({...})` untuk mengganti) |
| `format` | `null` = tanpa teks bawaan, tanpa kabut, zona seluruh layar |
| `kamera` | fungsi `t → { H, fokus }`, atau `{ jadwal, piksel, azimut, elevasi }`; bawaan dari format |
| `tanah` | opsi `buatTanah`, atau `false` |
| `bloom`, `cahaya` | opsi `buatMesin`, atau `false` |
| `zona`, `kabut`, `titikPeriksa`, `beku` | menimpa nilai format |

`v` berisi `scene`, `kamera`, `renderer`, `mesin`, `tanah`, `rig` (`rig.keadaan.H`), `W`, `ukuran`, `zona`, `format`, dan:
- `v.tambah(...benda)`: tambah ke scene, mengembalikan benda pertama.
- `v.setiapFrame((t, info) => …)`: dipanggil tiap frame sesudah gerak. `info.hitungSaja` true saat kit hanya menghitung (peristiwa, periksa zona).
- `v.tunggu(promise)`: `window.siap` menunggu janji ini (tekstur, data).
- `v.keLayar(pos)`: piksel dari titik dunia. `v.tampilkan(t)`, `v.hitung(t)`.

Globals yang dipasang (KONTRAK bagian 2): `DURASI`, `FPS`, `UKURAN`, `siap`, `tampilkan(t)`, `KIT.versi`, `KIT.peristiwa()`, `KIT.periksaZona(t)`, `KIT.titikPeriksa`. `?rekam=1` mematikan loop; tanpa parameter pratinjau berulang; `?t=12` membekukan di detik 12.

Urutan tiap frame: kamera dan tanah → gerak → `setiapFrame` → label 3D → render → komponen teks.

## format/indikator.js

`formatIndikator({ nomor, total=44, kategori, judul, gejala="", cermin, langkah, ajakan="ahmadzulfikar.com/kuis", sumber, merek="HMI EVIDENCE", penutup="Jangan bicara HMI tanpa bukti.", label: { gejala, cermin, langkah }, barisNomor })`

Bagian E terpasang persis: kepala top 226 (merek, `INDIKATOR 01 / 44 · KATEGORI`, h1 Noto Serif 700 50 px; masuk 0.6–1.2 naik 12 px, pudar 17.6–18.0), keterangan top 1490 (GEJALA abu 1.2–5.8, CERMIN zamrudTerang 6.6–12.0, LANGKAH emas 13.6–18.0; masuk 0.5 s naik 16 px), kartu akhir (judul miring 18.2–18.8, pil emas top 1500 18.6–19.2 skala 0.92 → 1, sumber top 1640 19.0–19.6). Kabut atas solid sampai 420 bening di 600, kabut bawah bening di 1440 solid dari 1630. Zona adegan y 600–1440. `titikPeriksa` [0.8, 3, 5.5, 6.8, 9, 12.6, 15, 16.6, 19.5, 20.9]. Gerak bersambung yang berjalan sebelum 6.6 melambat 6.0 → berhenti 6.6 (`beku`). Judul atau keterangan lebih dari 3 baris memunculkan peringatan di konsol.

`WAKTU_INDIKATOR` berisi semua waktu di atas (`gejala`, `cermin`, `langkah`, `akhir`, `beku`, `denyut` [7.0, 11.8], `ket`, `kartu`). Peristiwa struktur: `grid-nyala` 0, `melambat` 6.0, `denyut` 7.0 (4.8 s; dilewati bila `denyutCermin` sudah mencatat denyut di dekatnya), `kartu-akhir` 18.2, `pil` 18.6.

## format/evidence.js

Format video 31 detik seri 44 indikator versi lima bagian: Gejala, sebab, Ikhtiar atau Pandangan, Kuis, Kartu akhir (Prompt 00 bagian B). Kabut, zona adegan, dan piksel fokus sama dengan format indikator.

```js
import { buatVideo, formatEvidence, jadwalEvidence, segmenKuis, duniaKader } from "../../kit/index.js";

let jadwal;
const v = buatVideo({
  format: formatEvidence({
    nomor: "01", kategori: "KADERISASI", judul: "Jumlah mahasiswa baru yang masuk HMI menurun.", mode: "ikhtiar",
    sebab: "Yang tidak ikut **tidak pernah ditanya**. Penurunan baru terasa ketika sudah jauh.",
    ikhtiar: [
      { teks: "Peserta LK 1 dicatat setiap tahun dalam **Indeks Kaderisasi**, jadi penurunan terbaca sejak awal.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] },
      { teks: "**Pemetaan Kebutuhan Mahasiswa** menanyakan alasan yang tidak ikut.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] },
    ],
    program: "Program 03 · Program 06",
    kuis: { pertanyaan: "Jumlah peserta LK 1 terakhir dari komisariatmu?", kalimat: "Ukur komisariatmu, dapatkan laporannya." },
  }),
  kamera: (t) => jadwal(t),
});
const d = duniaKader(v);
jadwal = jadwalEvidence({ fokus: d.fokus, kuis: { fokus: segmenKuis(v, { komisariat: d.benda.komisariat, kelompok: "kaderisasi" }).fokus } });
```

`formatEvidence({ nomor="00", total=44, kategori, judul, mode="ikhtiar", waktu, gejala="", sebab="", ikhtiar=[], program="", kuis: { pertanyaan, kalimat }, ajakan="ahmadzulfikar.com/kuis", baca, sumber, label, merek="HMI EVIDENCE", penutup="Jangan bicara HMI tanpa bukti.", barisNomor })`

| Isi | Arti |
|---|---|
| `nomor`, `total`, `kategori`, `judul`, `merek`, `penutup`, `barisNomor` | sama seperti `formatIndikator` |
| `mode` | `"ikhtiar"` (bawaan) atau `"pandangan"`: label Bagian 3 `IKHTIAR HMI EVIDENCE` atau `PANDANGAN HMI EVIDENCE`. Nilai lain melempar galat |
| `waktu` | menimpa pembagian waktu bawaan (lihat bawah) |
| `gejala` | teks di bawah label GEJALA; bawaan kosong (label saja) |
| `sebab` | satu kalimat Bagian 2 |
| `ikhtiar` | 1 sampai 3 kalimat Bagian 3, tiap satu `{ teks, masuk: [a, b], keluar: [c, d] }`. Label Bagian 3 tetap tampak; hanya kalimatnya yang berganti dengan celup pudar (jeda di antara `keluar` kalimat lama dan `masuk` kalimat baru, mis. 17.6 sampai 18.0 = 0.4 s). `masuk`/`keluar` yang kosong memakai jendela label (cukup untuk satu kalimat). Jendela kalimat harus berurutan tanpa tumpang tindih. Lebih dari 3 kalimat memunculkan peringatan |
| `program` | baris kecil di bawah kalimat Bagian 3, mis. `"Program 03 · Program 06"`; boleh kosong. Tampak selama label Bagian 3 tampak, 14 px di bawah kalimat yang sedang tampak. Selama jeda antara dua kalimat yang tingginya berbeda, baris ini meluncur halus ke tinggi kalimat berikutnya |
| `kuis` | `{ pertanyaan, kalimat }`. `pertanyaan` `null` (atau kosong) menyembunyikan kartu pertanyaan; `kalimat` tampil di bawah label kuis (kosong = label saja) |
| `ajakan` | isi pil; bawaan `ahmadzulfikar.com/kuis` |
| `baca` | bawaan `Baca lengkapnya: ahmadzulfikar.com/indikator/NN`, NN dari `nomor` (diisi nol di depan sampai 2 digit); `""` menyembunyikan |
| `sumber` | bawaan `Sumber indikator: Agussalim Sitompul, 44 Indikator Kemunduran HMI (2006)` |
| `label` | `{ gejala, sebab, ikhtiar, kuis, pertanyaan }` menimpa teks label (`ikhtiar` = label Bagian 3 untuk kedua mode, `pertanyaan` = judul kartu pertanyaan) |

Pembagian waktu bawaan (detik): grid menyala 0.0–0.6, Bagian 1 Gejala 0.6–6.0, Bagian 2 sebab 6.0–13.0, Bagian 3 Ikhtiar 13.0–23.0, Bagian 4 Kuis 23.0–28.0, Bagian 5 Kartu akhir 28.0–31.0, `beku` 6.0–6.6 (gerak bersambung melambat lalu berhenti, seperti format indikator). Durasi video = akhir kartu akhir (31).

Teks (semua `masuk` naik 16 px kecuali dicatat, `keluar` hanya pudar):

| Teks | Tempat | Waktu |
|---|---|---|
| Kepala: merek, `INDIKATOR NN / 44 · KATEGORI`, h1 Noto Serif 700 50 px | top 226 (kepala indikator) | masuk 0.6–1.2 (naik 12), keluar 22.6–23.0 |
| `GEJALA` abu | top 1490 | masuk 1.2–1.7, keluar 5.4–5.8 |
| `KENAPA FENOMENA TERSEBUT MASIH TERJADI?` zamrudTerang, kalimat sebab | top 1490 | masuk 6.6–7.1, keluar 12.6–13.0 |
| `IKHTIAR` atau `PANDANGAN HMI EVIDENCE` emas | top 1490 | label masuk 13.6–14.1, keluar 22.6–23.0; kalimat menurut `ikhtiar[i]` |
| Baris program: JetBrains Mono 500 20 px, krem 0.55 | 14 px di bawah kalimat | selama label Bagian 3 |
| `AYO IKUTI KUIS SEBERAPA EVIDENCE KOMISARIATMU` emas | top 1490 | label masuk 23.4–23.9, keluar 27.6–28.0; kalimat kuis masuk 23.6–24.1, keluar 25.6–26.0 |
| Kartu pertanyaan (komponen `panel`, kelas `kartu-kuis`): judul `PERTANYAAN DI KUIS` emas JetBrains Mono 700 20 px letter-spacing 0.24em, isi DM Sans 600 38 px krem, bingkai 2 px zamrudPijar, sudut 18 px, latar `latar` 0.85 | top 330, lebar 880 | masuk 23.4–23.9 (naik 12), keluar 27.6–28.0 |
| Pil ajakan: latar emas, teks `latar`, JetBrains Mono 700 38 px, tinggi 92 px, diikuti panah | top 1540 | masuk 26.0–26.6 (skala 0.92 → 1), tetap tampak sampai selesai |
| Kartu akhir: merek dan h1 Noto Serif italic 700 52 px | top 226 | masuk 28.2–28.8 |
| Baris baca: JetBrains Mono 500 20 px, krem 0.6 | top 1660 | masuk 28.6–29.2 |
| Baris sumber: JetBrains Mono 500 19 px, krem 0.45 | top 1696 | masuk 28.8–29.4 |

Label (dan kalimat) keterangan: label JetBrains Mono 700 22 px letter-spacing 0.24em; label lebih dari 30 karakter (sebab, kuis) memakai 20 px dan 0.16em, maksimal dua baris. Kalimat DM Sans 600 40 px, line-height 1.3, krem, maksimal 3 baris. Pil di akhir Bagian 4 adalah pil kartu akhir yang sama, jadi tidak muncul dua kali. Judul dan kalimat lebih dari 3 baris, label lebih dari 2 baris, dan kartu pertanyaan lebih dari 3 baris memunculkan peringatan di konsol (diperiksa setelah font termuat, seperti format indikator).

`waktu` menimpa pembagian: sebagian atau semua dari `gridNyala`, `gejala`, `sebab`, `ikhtiar`, `kuis`, `akhir`, `beku`, masing-masing `[a, b]`. Semua waktu teks diturunkan dari pembagian ini dengan selisih yang sama seperti bawaan (mis. label masuk 0.6 s sesudah bagiannya mulai, keluar 0.4 s sebelum bagiannya selesai, pil 3.0 s sesudah Kuis mulai, kepala kartu akhir 0.2 s sesudah Kartu akhir mulai), jadi seluruh teks ikut bergeser. Durasi video = `akhir[1]`. Titik periksa bawaan `[0.8, 3, 5.5, 9.5, 14.5, 18, 22, 24.5, 26.8, 29.5, 30.9]` dihitung ulang sebanding di dalam bagian yang sama (30.9 tetap di dekat akhir kartu akhir). Waktu kalimat `ikhtiar` tetap diisi pemanggil. Contoh: `waktu: { sebab: [6, 12], ikhtiar: [12, 24], kuis: [24, 28.5], akhir: [28.5, 31] }`.

**Templat dan contoh.** `npm run baru -- <nama> --format evidence --judul "..."` membuat `adegan.js` dari `kit/alat/templat/evidence/` (dunia Kader, teks contoh, `segmenKuis`), dan `animasi/proyek/contoh-evidence/` adalah hasilnya dengan teks contoh. Urutan panggilan di templat wajib diikuti: `buatVideo` (kamera `(t) => jadwal(t)`), dunia, adegan Bagian 1–3, `setiapFrame`, `segmenKuis` paling akhir, lalu `jadwal = jadwalEvidence({ ..., kuis: { fokus: seg.fokus } })`. Peringatan `[kit]` format ini (teks lebih dari 3 baris, label lebih dari 2 baris, `fokusUntuk` tidak muat) hanya muncul di konsol browser; sejak 1.2.0 `npm run buat` mencetaknya di ringkasan periksa (`alat.md`).

**duniaKader pada kamera evidence.** `duniaKader` disusun untuk H 16 (`d.H`), sedangkan kamera evidence memakai H 8–14. Pada H 11 gerbang dan komisariat sekaligus selebar 1327 px (zona 1080 px; `fokusUntuk([gerbang, komisariat], { H: 11 })` memberi peringatan `1327×799 px tidak muat`), jadi keduanya baru muat pada H ≈ 13.5 ke atas; gedung kelas dan tangga tidak muat di H 11 dan 8. Templat memakai H 14 untuk Gejala, `tanpa: ["kelas", "tangga"]`, dan menandai gerbang dan jalan `penting: (t) => t < 6.0` (benda latar boleh terpotong saat kamera mendekat). Brief yang memakai H 11 untuk Gejala harus memilih fokus yang memuat bendanya atau menaikkan H, lalu mencatat penyimpangannya.

`WAKTU_EVIDENCE` berisi semua waktu bawaan: `durasi`, `gridNyala`, `gejala`, `sebab`, `ikhtiar`, `kuis`, `akhir`, `beku`, `kepala`, `ket` (`gejala`, `sebab`, `ikhtiar`, `kuis`), `kalimatKuis`, `kartuTanya`, `kartu` (`kepala`, `pil`, `baca`, `sumber`). Format yang dibuat memuat versi yang sudah ditimpa di `format.waktu`; pakai itu di adegan bila `waktu` diganti. Peristiwa struktur: `grid-nyala` 0, `melambat` 6.0, `pil` 26.0, `kartu-akhir` 28.2; tidak ada `denyut` bawaan. `v.akhirAdegan` bawaan = awal kepala kartu akhir (28.2). Kamera bawaan format `jadwalEvidence()`; ganti lewat `buatVideo({ kamera })` (lihat `inti.md`).

## Komponen teks

Semua komponen mendaftar sendiri ke video aktif dan diperbarui dari `t`. Posisi dalam piksel (`kiri`, `top`, `lebar`; bawaan kiri 100, lebar 880). Waktu `masuk`/`keluar` berupa `[a, b]` (atau angka awal, lama bawaan); `null` = selalu tampak di sisi itu. Teks boleh memakai `**kata**` untuk kata berwarna.

| Komponen | Opsi utama |
|---|---|
| `kepala({ merek, nomor, judul, miring, top=226, masuk=[0.6,1.2], keluar, naik=12 })` | merek bergaris, baris nomor, h1 |
| `keterangan({ label, warna, teks, top=1490, masuk, keluar, naik=16, ukuranLabel, jarakLabel, program, kalimat })` | `warna`: token tema (`"abu"`, `"zamrudTerang"`, `"emas"`) atau CSS; `**kata**` berwarna label. Opsi terakhir untuk format evidence, lihat di bawah tabel |
| `alurLangkah({ langkah: [...], waktu: [[a,b],...], top=420, masuk, keluar, ukuran=28 })` | langkah aktif emas bergaris bawah terisi, selesai zamrudTerang |
| `panel({ judul, isi, top=1160, tinggi, masuk, keluar, animasi(t, elIsi), kelas })` | panel HUD; `isi` HTML atau Element, `animasi` menggerakkan isinya dari t; `kelas` = kelas CSS tambahan (`"kartu-kuis"`: kartu pertanyaan kuis) |
| `kartuAkhir({ merek, judul, ajakan, sumber, baca, panah=true, waktu: { kepala, pil, sumber, baca }, top: { kepala, pil, sumber, baca } })` | judul miring, pil emas, baris baca (opsional, bawaan `top.baca` 1600 dan `waktu.baca` [18.8, 19.4]), baris sumber |

Opsi `keterangan` tambahan (semua bawaan tidak mengubah apa pun):
- `ukuranLabel` (px) dan `jarakLabel` (em): ukuran font dan letter-spacing label; padding kiri label mengikuti `jarakLabel`. Bawaan CSS 22 px dan 0.24em.
- `program`: baris kecil JetBrains Mono 500 20 px, krem 0.55, 14 px di bawah teks. Ikut jendela komponen.
- `kalimat`: `[{ teks, masuk, keluar }]`. Label tetap tampak menurut `masuk`/`keluar` komponen, sedangkan kalimatnya bergantian menurut jendelanya sendiri (kosong = jendela komponen), naik 16 px saat masuk dan pudar saat keluar. Dalam mode ini label, kalimat, dan baris program masing-masing punya opasitas sendiri (komponen `{ el, label, teks, program, barisKalimat() }`). Jendela kalimat harus berurutan tanpa tumpang tindih; tinggi alami tiap kalimat diukur sekali sesudah font termuat untuk menggerakkan baris program.

Format lain cukup merakit komponen ini sendiri (lihat templat `kosong`). Untuk ukuran 1080×1350 atau 1080×1080, atur `ukuran`, `zona`, `kabut`, dan `top` komponen.

## label3D(isi, opsi)

Label HTML yang diproyeksikan dari titik dunia tiap frame, memudar di luar zona adegan (zona −80 px di atas, +10 px di bawah) dan di tepi layar.

| Opsi | Arti |
|---|---|
| `pada` | `Object3D`, `Vector3`, atau `(t) => Vector3` |
| `geser` | `[x, y, z]` geser dunia dari jangkar, mis. `[0, 2.2, 0]` di atas rumah |
| `gaya` | `"benda"` (titik + mono 22 px, bawaan), `"kotak"` (berbingkai), `"baris"` (teks gelap di atas kertas), `"mikro"` (mono 15 px tanpa titik, untuk benda kecil seperti tag, sel tabel, dan keterangan alat) |
| `kelas` | Kelas CSS tambahan. Varian warna (token tema saja) untuk `benda`, `kotak`, dan `mikro`: `"emas"`, `"zamrud"`, `"abu"` (tabel di bawah). `"gelap"` untuk mikro gelap di atas kertas |
| `dx`, `dy`, `ax`, `ay` | geser piksel; jangkar label (bawaan tengah bawah) |
| `masuk`, `keluar`, `opasitas(t)` | waktu tampak |
| `ikutOpasitas` | bawaan true bila `pada` benda: ikut pudar bersama bendanya (opasitas efektif, termasuk induknya) |
| `skala` | angka atau `(t) => angka`, mis. `() => 16 / v.rig.keadaan.H` supaya ikut mengecil saat kamera menjauh |
| `html` | true bila `isi` HTML mentah |

Varian warna `kelas`:

| Gaya | `emas` | `zamrud` | `abu` |
|---|---|---|---|
| `benda` | titik emas | teks zamrudTerang | titik dan teks abu |
| `kotak` | penuh emas, teks latar | teks dan bingkai zamrudTerang | teks dan bingkai abu |
| `mikro` | teks emas | teks zamrudTerang | teks abu |

Tanda status kecil (05: BERJALAN / TERSENDAT) tanpa CSS lokal:

```js
label3D("BERJALAN", { pada: lembar.userData.bagian.badan, geser: [0, -0.18, 0], gaya: "kotak", kelas: "zamrud", skala: 0.65, ax: 0.5, ay: 0.5 });
label3D("TERSENDAT", { pada: lembarBadko.userData.bagian.badan, geser: [0, -0.18, 0], gaya: "kotak", kelas: "abu", skala: 0.65, ax: 0.5, ay: 0.5 });
```

Label yang `pada`-nya `Object3D` disembunyikan selama benda itu belum masuk adegan, yaitu bila akar induknya bukan `THREE.Scene`. Label benda yang dibuat tetapi belum (atau tidak pernah) ditambahkan lewat `v.tambah` tidak lagi muncul di titik asal dunia. Label dengan `pada` berupa `Vector3` atau fungsi tidak terpengaruh.

Teks label diganti dengan gerak `gantiLabel` (lihat `gerak.md`).

Objek yang dikembalikan `label3D` (`{ el, isi, pada, pengali, ganti, semuaTeks(), posisiDunia(t), perbarui(t) }`) punya dua medan yang dibaca modul gerak seperti `segmenKuis`; label yang tidak memakainya berperilaku persis seperti sebelumnya:
- `lbl.pada`: jangkar asli dari opsi `pada` (`Object3D`, `Vector3`, fungsi, atau `null`), untuk mengetahui benda mana yang menjadi jangkar label.
- `lbl.pengali`: `null` (bawaan) atau fungsi `(t) => 0..1` yang dikalikan ke opasitas label tiap frame (sesudah `masuk`/`keluar`, opasitas benda, dan celup `gantiLabel`). Untuk memudarkan label yang jangkarnya bukan benda (titik, fungsi) atau benda yang tidak ikut dipudarkan. Modul yang mengisinya wajib membungkus pengali yang sudah ada: `lbl.pengali = (t) => asli(t) * baru(t)`.
