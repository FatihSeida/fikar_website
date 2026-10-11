# benda: figur dan bangunan

Pustaka benda untuk figur (`benda/figur.js`), bangunan (`benda/bangunan.js`), dan opsi tambahan `pion` dan `rumah` (`benda/dasar.js`). Semuanya diimpor dari `../../kit/index.js`.

Semua pembuat mengikuti KONTRAK §5:
- `nama(opsi = {})` mengembalikan `THREE.Group`. Titik asalnya di tengah alas, di permukaan tanah.
- Ukuran bawaan diambil dari kamus prompt, dan semuanya bisa ditimpa lewat `opsi`.
- Warna diambil dari `W`. Warna kamus yang tidak ada di palet diturunkan dari campuran token, jadi ikut berubah bila tema diganti.
- Setiap benda punya bahannya sendiri. Teks selalu lewat `label3D`.
- `userData` berisi `nama`, `penting: true`, dan `bagian`.

Benda dibuat sesudah `buatVideo()`. Benda yang memasang label (`gerbangKampus`/`gerbangKecil` dengan `label`, dan `fondasiLempeng` dengan `label`) mewajibkan urutan ini.

## Contoh

```js
import { buatVideo, formatIndikator, jadwalIndikator, titik, setelKeadaan, halus, rentang,
         gerbangKampus, gedungKelas, kerumunan, pionPendamping, menaraPB, fondasiLempeng,
         muncul, klikEmas, denyutCermin } from "../../kit/index.js";

const v = buatVideo({ format: formatIndikator({ /* … */ }) });
const gerbang = v.tambah(gerbangKampus({ label: "LK 1" }));   // sudah menghadap kamera, rotasi 0
gerbang.position.copy(titik(-3.4, -3.6));
const kader = v.tambah(kerumunan({ jumlah: 20, susunan: "dua-lingkaran", ragamJaket: true }));
kader.position.copy(titik(0.6, 1.0));
muncul(kader.userData.bagian.pion, { t: 1.6, jeda: 0.13 });   // satu per satu
const p = v.tambah(pionPendamping());
klikEmas(p.userData.bagian.lencana, { t: 12.6 });            // lencana emas tanpa mengemaskan cincin
const pb = v.tambah(menaraPB());
klikEmas(pb, { t: 15.8 });                                    // hanya kubus puncak yang menjadi emas
v.setiapFrame((t) => setelKeadaan(pb, "lampu", halus(rentang(t, 2, 2.6))));
```

## Arah dan orientasi

- Kamera kit memandang dari arah +x +z. Sisi benda yang terlihat adalah +x (kanan bawah layar), +z (kiri bawah layar), dan atas.
- Bangunan berbentuk kotak (gedung, rumah, ruang) dibangun sejajar sumbu dunia, sehingga tampak sebagai belah ketupat. Pintu ada di muka +z dan jendela di muka +z dan +x.
- Benda berwajah dibangun menghadap kamera: `gerbangKampus`, `gerbangKecil`, `bingkaiPintu`, `podium`, dan `stanPajangan`.
  - Rotasi y 0: mukanya sejajar layar dan menghadap penonton.
  - +45°: menghadap +x.
  - −45°: menghadap +z (tampak tiga perempat).
  - ±90°: tampak dari samping. Hindari.
- **gerbangKampus.** Brief Dunia Kader menulis "rotasi y −45 derajat" untuk gerbang lama yang memanjang di sumbu z. Gerbang lain yang memanjang di sumbu x tampak dari samping dengan rotasi itu (tiang bertumpuk). Gerbang kit sudah benar tanpa rotasi, jadi **biarkan rotasi 0**. Rotasi −45° tidak lagi membuatnya tampak dari samping, hanya miring tiga perempat (diuji).
- Pion: sisi +z adalah depan figur (`jalan({ hadap: true })` memutar +z ke arah jalan). Pada rotasi 0, lencana, papan, dan pengeras suara tampak tiga perempat. `rotation.y = Math.PI / 4` menghadapkannya lurus ke penonton.

## Keadaan

Keadaan baku (`emas`, `nyala`, `denyut`, `abu`, `pudar`) bekerja pada semua benda lewat `setelKeadaan` dan gerak kit. `bagian.emas`, `bagian.denyut`, dan `bagian.tepi` sudah diisi supaya hasilnya masuk akal: misalnya PB hanya mengemaskan kubus puncak, dan ruang hanya mengemaskan dindingnya.

Tepi denyut berupa garis zamrudPijar 3 px yang tersembunyi sampai `denyut > 0`, mengikuti pola `rumah`.

Keadaan tambahan (tercatat di KONTRAK §5):

| Keadaan | Benda | Arti |
|---|---|---|
| `lampu` 0..1 | `rumahKecil`, `gedungCabang`, `menaraBadko`, `menaraPB`, `ruangKarya` | Jendela padam (0) sampai menyala (1). Bawaan 1, atau `opsi.lampu` |
| `lencana` 0..1 | `pion({ lencana: true })`, `pionPendamping` | Lencana tampak atau tidak, tetap ikut opasitas pion |
| `aktif` 0..1 | pion, kerumunan | Cincin kaki (sudah ada sejak 0.3.0) |
| `nyala` 0..1 | `lengkungAudit` | Lampu lengkung: zamrudPijar dengan emissive 0.45 di bawah ambang bloom. Pada benda lain `nyala` = kurva emissive `klikEmas` |

`pion()` memasang `userData.lonjakEmas = 0`, jadi `klikEmas` pada pion tidak membesarkan figur; hanya cincin kakinya yang menjadi emas. `klikEmas(pion, { lonjak: 0.25 })` tetap bisa memaksa lonjakan.

Bloom:
- Emissive bawaan 0, kecuali dua bahan:
  - jendela menyala: `KUAT_JENDELA` 0.42, zamrudPijar;
  - cincin pion (sudah ada sebelumnya, tersembunyi kecuali `aktif`).
- Diuji dengan render halaman uji berbloom dan tanpa bloom pada keadaan normal, abu, dan lampu padam untuk semua benda: 0 piksel berbeda.
- Hanya keadaan emas yang berpendar.

## dasar.js: opsi baru pion dan rumah

Semua opsi kompatibel ke belakang. `contoh-kit` dirender ulang dan hasilnya identik per byte.

| Opsi pion | Bawaan | Arti |
|---|---|---|
| `tangan` | `false` | `true` atau `"turun"`, `"naik"`, `"terbuka"`, `"satuNaik"` (tangan kanan +x naik). Lengan berporos di bahu: `bagian.tangan = [kiri, kanan]` adalah Group poros. Untuk gerak angkat, putar `rotation.z` (ke samping) atau `rotation.x` (ke depan). Pose `"turun"` sama persis dengan `tangan: true` lama |
| `panjangTangan` | 0.35 | Mis. 0.4 untuk "tangan yang bisa terangkat" (indikator 32) |
| `pegang` | `null` | Object3D di depan dada (titik pegang lokal 0, 0.52, 0.26). Posisi benda itu sendiri menjadi geseran. `bagian.pegang`, `bagian.titikPegang` |
| `cincinTipis` | `false` | Cincin kaki tebal 0.016 (mantan ketua). Tampak lewat `aktif`, seperti cincin biasa |
| `lencana` | `false` | Cakram r 0.12 di dada (+z), `warnaLencana` bawaan `W.zamrud`. `bagian.lencana` adalah benda sendiri: `klikEmas(p.userData.bagian.lencana)`. Kebal keadaan badan |
| `warnaJaket` | `null` | Warna badan dan lengan. Kepala tetap `warna` |

Opsi rumah: `lebarPintu` dan `tinggiPintu`, bawaan 0.4 × 0.7 (sama dengan sebelumnya).

## figur.js

| Pembuat | Opsi utama | Catatan |
|---|---|---|
| `kerumunan` | `jumlah` 12, `susunan` (lihat di bawah), `radius`, `jarak` 0.62, `kolom` (baris), `benih`, `ragamJaket`, `hadapPusat` true, `pion: {…}` (diteruskan ke setiap pion) | Lihat catatan di bawah tabel |
| `pionOrator` | opsi pion, `warnaPengeras` (`W.kertas`) | Lengan kanan menjulur memegang pengeras suara (kerucut). `bagian.pengeras` |
| `pionPengamat` | opsi pion | Papan catat kecil di depan dada, condong supaya mukanya terlihat kamera. `bagian.papan` |
| `pionPendamping` | opsi pion | `aktif: true`, `lencana: true` |
| `pionMuda` | opsi pion | `skala: 0.85` |

Catatan `kerumunan`:
- `susunan` berisi salah satu dari empat nilai:
  - `"acak"` (bawaan): sebaran berbenih dengan jarak minimum.
  - `"baris"`: baris sejajar layar; baris berselang digeser setengah langkah supaya kepala di belakang terlihat.
  - `"lingkaran"`: mulai dari atas layar, searah jarum jam.
  - `"dua-lingkaran"`: `radius` bawaan `[1.2, 1.9]`, jumlah dibagi sebanding keliling.
- `bagian.pion` berisi semua pion (masing-masing `penting: false`), bernama `figur 1`, `figur 2`, … (atau `<pion.nama> 1`, … bila `pion: { nama }` diisi), supaya laporan bunyi gerak per pion terbaca. `userData.posisi` berisi posisi lokal tiap pion.
- Keadaan `emas`, `nyala`, `aktif`, dan `lencana` diteruskan ke setiap pion, jadi `emas` mengemaskan cincin dan badan tidak pernah emas. `pudar`, `abu`, dan `denyut` ditangani pada Group, sehingga ikut opasitas kerumunan.

## bangunan.js

### Gerbang dan bingkai

| Pembuat | Bawaan | Opsi, `bagian`, `userData` |
|---|---|---|
| `gerbangKampus` | Tiang 0.4 × 2.2 × 0.4 berjarak 2.6, balok 3.2 × 0.35 × 0.45, pelat bertepi zamrudRedup | `jarak`, `tinggi`, `tiang`, `balok: [w, h, d]`, `warna`, `warnaTepi`, `label`, `opsiLabel` (diteruskan ke `label3D`, mis. `{ masuk, keluar }`). `bagian.tiang`, `bagian.balok`. `userData.depan` dan `userData.belakang` adalah titik lewat. `userData.label` |
| `gerbangKecil` | Tiang 0.2 × 1.6, balok 1.6 × 0.2 × 0.2, zamrud bertepi zamrudPijar | `lebar`, `tinggi`, `tiang`, `label`, `opsiLabel` (lainnya sama dengan `gerbangKampus`) |
| `bingkaiPintu` | Lubang 1.0 × 1.9, kusen pelat bertepi, lorong gelap, daun pintu terbuka 0.45 ke arah penonton | `lebar`, `tinggi`, `daun`, `buka` (0..1 × 90°), `celah`. `bagian.daun` adalah poros engsel (`rotation.y = −buka·π/2`). `userData.depan`, `userData.belakang` |

### Gedung

| Pembuat | Bawaan | Catatan |
|---|---|---|
| `gedungKelas` | 3.0 × 2.2 × 2.0, warna kelas (≈ hsl(153, 20%, 22%)). Jendela 0.4 kertas opacity 0.5: 4 × 2 di muka +z, 3 × 2 di muka +x | `kolom`, `baris`, `kolomSamping` (0 = tanpa jendela samping). `bagian.jendela` (satu mesh) |
| `menaraKampus` | 2.0 × 5.0 × 2.0, jendela kecil, pintu, pagar atap | `userData.atap` = 5.0 (figur di atap). `userData.depanPintu` |
| `rumahWarga` | 0.9 × 0.7 × 0.9, dinding abu hangat (≈ hsl(42, 10%, 45%)), atap prisma, satu jendela +x | Opsi lain diteruskan ke `rumah()` |
| `rumahKecil` | Komisariat Dunia Jenjang 1.2 × 0.9 × 1.1, jendela menyala | Keadaan `lampu`. Opsi lain diteruskan ke `rumah()` |
| `rumahPotong` | Komisariat terpotong 1.8 × 1.2 × 1.6. Dinding belakang (−x, −z) penuh, dinding depan dipotong `potong` 0.45. Celah pintu depan di +z, pintu belakang 0.4 × 0.7 di −z, atap berupa garis | `pintuBelakang`, `geserPintu`, `geserPintuBelakang`, `garisAtap` (bawaan `true`; `duniaKader({ potong })` mematikannya karena garis atap memotong figur di dalam ruang). Untuk "diperbesar 1.4 kali": `scale.setScalar(1.4)`. `userData.depanPintu`, `userData.dalam`, `userData.luarBelakang`. `bagian.dindingDepan`, `bagian.dindingBelakang`, `bagian.lantai` |
| `gedungCabang` | 2.0 × 2.4 × 2.0, tiga lantai, jendela menyala di kedua muka, pintu berkanopi, unit atap | Keadaan `lampu` |
| `menaraBadko` | 1.6 × 4.0 × 1.6 dengan lantai mundur | Keadaan `lampu` |
| `menaraPB` | 2.0 × 6.0 × 2.0, lantai mundur, kubus puncak 0.9 zamrudRedup | `bagian.emas = [kubus]`: `klikEmas(pb)` hanya mengemaskan kubus. `bagian.kubus`. `userData.puncak` |
| `ruangKarya` | 1.8 × 1.4 × 1.6, pintu rolling bergaris (tertutup), papan nama kosong, jendela menyala di +x | `userData.bukaPintu(k)`: 0 tertutup sampai 1 tergulung ke atas; panggil setiap frame dari `setiapFrame`. `bagian.pintu`, `bagian.papanNama`. Denyut pada papan dan pintu |
| `ruangLatihan` | Lantai 6 × 0.1 × 5 dan dinding L setinggi 1.8: `"kiri"` di tepi −x, `"kanan"` di tepi −z | `jendela: [{ dinding, lebar 1.6, tinggi 1.0, geser 0, bawah 0.5 }]`; `geser` menjauhi sudut belakang. `userData.dinding.kiri/kanan = { pusat, rotasiY, panjang, tinggi }` untuk menempel papan tulis atau jam. `userData.atas` |

Keadaan "lampu" juga mengikuti `abu` dan `pudar`: jendela meredup bersama dinding. Gedung jenjang dan ruang karya memakai dinding sedikit lebih gelap daripada komisariat, supaya jendela terbaca.

### Panggung dan podium

| Pembuat | Bawaan | Catatan |
|---|---|---|
| `ruangAcara` | Lantai 6 × 0.1 × 5 bertepi zamrudRedup, garis batas dalam | `userData.atas`. Lantai sedikit lebih terang dari pelat supaya kursi pelat terbaca |
| `panggung` | 5 × 0.4 × 3 zamrudRedup, lantai atas lebih terang, tangga dua anak di muka +z | `lebar`, `tinggi`, `dalam`, `tangga`, `geserTangga`. `userData.atas`, `userData.kakiTangga` |
| `podium` | 1.0 × 1.2 × 0.8 zamrudRedup menghadap kamera, tutup dan panel muka | `pion: true` atau opsi pion untuk figur di atasnya (`bagian.pion`). Emas tidak mengenai figur |
| `alasPatung` | 1.6 × 0.4 × 1.6 dan 1.0 × 1.2 × 1.0 plus tutup, pelat bertepi | `bawah`, `atas`. Denyut pada tingkat atas. `userData.atas` |

### Pajangan dan struktur tetap

| Pembuat | Bawaan | Catatan |
|---|---|---|
| `stanPajangan` | 1.0 × 1.4 × 0.6 menghadap kamera: meja, panel, papan kepala zamrud | `isi`: `"kertas"` (tumpukan dan lembar), `"grafik"` (tiga batang), `"figur"` (dua figur kecil bergandengan), `"bingkai"` (bentuk abstrak). `bagian.isi`. Emas mengenai seluruh stan |
| `kotakSuara` | Kotak 1.0 kertas, celah atas, sabuk zamrud | `alas` (bawaan true, pelat 2.0 × 0.2 × 2.0), `pagarKaca` (empat dinding kaca 1.6). `bagian.pagar[i]` adalah benda sendiri: `klikEmas(bagian.pagar)` mengemaskan tepinya saja, bidang kaca tetap bening. `userData.celah` adalah tujuan amplop. Denyut pada alas |
| `fondasiLempeng` | 5 lempeng 3.2 × 0.18 × 3.2, gradasi zamrudRedup (bawah) ke pelat (atas), bertepi | Lihat catatan di bawah tabel |

Catatan `fondasiLempeng`:
- `bagian.lempeng[i]`, urut **dari bawah ke atas**, masing-masing benda dengan keadaannya sendiri. Contoh: `klikEmas(f.userData.bagian.lempeng, { jeda: 0.15 })` atau `denyutCermin(lempeng[i], …)`.
- `label`, juga urut **dari bawah ke atas**: brief yang menulis "dari atas ke bawah" perlu dibalik. Label dipasang di sisi kanan layar dengan garis penunjuk yang dikipas `jarakLabel` 0.32 supaya tidak bertumpuk. `opsiLabel` diteruskan ke `label3D`.
- `userData.jangkar[i]` adalah titik ujung garis penunjuk (mis. untuk centang). `userData.atas` adalah permukaan lempeng teratas.
- Label mengandaikan benda tidak diputar.
- Jangan menyetel keadaan yang sama pada fondasi dan pada lempengnya dalam frame yang sama, karena yang terakhir menang.

### Lengkung audit

| Pembuat | Bawaan | Opsi, `bagian`, `userData` |
|---|---|---|
| `lengkungAudit` | Dua kaki silinder r 0.05 setinggi 0.8 di z lokal −1.0 dan +1.0, busur setengah torus r 1.0 (tabung 0.05) berpusat di y 0.8 pada bidang y-z lokal (puncak y 1.8), dan alas silinder r 0.12 × 0.04 di bawah tiap kaki. Zamrud redup | `warna` (`W.zamrudRedup`), `label`, `opsiLabel` (diteruskan ke `label3D`), `nama`, `penting`. `bagian.kaki` (z −1 lalu +1), `bagian.busur`, `bagian.alas`, `bagian.tepi`. `userData.puncak` = (0, 1.8, 0) lokal, `userData.label` |

Dipakai `segmenKuis` untuk terowongan audit (`gerak.md`). Catatan:
- Bidang busur tegak lurus sumbu x lokal, jadi komisariat yang melaju di sumbu x dunia lewat di bawahnya. Pada rotasi 0 tidak ada yang perlu diputar.
- `label`: `label3D` gaya mikro berjangkar benda, `geser [0, 2.05, 0]` (di atas puncak), ikut muncul dan pudar bersama benda.
- Keadaan `nyala` 0..1 (lampu): warna ke zamrudPijar dan emissive zamrudPijar 0.45 (`KUAT_LENGKUNG`). Emissive ini tidak pernah melewati ambang bloom, termasuk bersama `denyut` (diuji dengan dan tanpa bloom: 0 piksel berbeda). Dilakukan dengan mengubah dasar bahan, jadi `abu`, `pudar`, `denyut`, dan `emas` tetap tersusun di atasnya. Selama `emas` > 0, `nyala` berarti kurva `klikEmas` (emissive emas) seperti pada benda lain, bukan lampu: `klikEmas(lengkung)` bekerja seperti pada benda lain, tetapi jangan menyetel `nyala` lampu bersamaan dengannya.
- `bagian.tepi`: garis denyut tunggal sepanjang lengkung (sisi +x, 3 px zamrudPijar), tersembunyi sampai `denyut` > 0. `bagian.denyut` dan `bagian.emas`: semua bagian.
- Titik periksa `periksaZona`: kotak pembatas busur diambil dari kotak geometri torus (longgar). Lihat catatan zona di `gerak.md` (segmenKuis).
- Satu bahan dipakai bersama semua bagian benda ini (kaki, busur, alas), seperti benda kit lain; antarbenda tidak berbagi.

## Katalog

`DAFTAR_FIGUR` dan `DAFTAR_BANGUNAN` berisi `{ nama, kategori, buat, contoh }` untuk setiap pembuat di atas. `kategori` berisi `"figur"` atau `"bangunan"`. `contoh` adalah opsi yang menampilkan benda dengan baik; untuk `fondasiLempeng`, `gerbangKecil`, dan `lengkungAudit` isinya berlabel, jadi panggil sesudah `buatVideo()`.
