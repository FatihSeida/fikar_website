# dunia: Pustaka, Rencana, Arsip

Tiga dunia dasar seri 44 indikator, masing-masing satu berkas di `kit/dunia/`: `duniaPustaka` (`pustaka.js`), `duniaRencana` (`rencana.js`), dan `duniaArsip` (`arsip.js`). Semuanya diekspor lewat `../../kit/index.js` dan terdaftar di `DAFTAR_DUNIA`.

Dunia hanya menyusun dan menempatkan benda kit. Kapan benda muncul, bergerak, berdenyut, atau menjadi emas tetap diatur adegan video (KONTRAK §7).

## Konvensi bersama

```js
const d = duniaPustaka(v, {
  tanpa: ["meja"],                                   // benda yang tidak dibuat
  posisi: { rakKanan: titik(2.0, -2.9, 0.1) },       // menimpa posisi
  opsi: { rakKiri: { debu: true, bukuBesar: 6 } },   // diteruskan ke pembuat benda kit
  ganti: { meja: (opsi) => stasiunMeja() },          // mengganti satu benda
  bangku: false,                                     // opsi khusus dunia (lihat tiap dunia)
});
d.benda.kursi1;   // Object3D yang sudah ada di scene
d.urutan;         // urutan muncul yang wajar: muncul(d.urutan, { t: 0.6 })
d.fokus;          // fokus kamera bawaan: jadwalIndikator({ fokus: d.fokus, ... })
d.H;              // 16
d.titik.meja;     // titik dunia bernama (Vector3 atau array Vector3)
```

- **Nama kelompok.** Di Pustaka dan Rencana, nama kelompok di `tanpa` dan `opsi` berlaku untuk semua anggotanya: `tanpa: ["kursi"]` sama dengan `tanpa: ["kursi1", …, "kursi5"]`, dan `opsi: { kursi: { warna: W.abu } }` diteruskan ke setiap kursi. Opsi anggota (`opsi.kursi2`) menimpa opsi kelompok.
- **Titik dihitung dari tata letak bawaan**, sekali saat dunia dibuat. Titik tetap ada walaupun bendanya ditiadakan lewat `tanpa`. Bila benda dipindah sesudah dunia dibuat, hitung ulang titiknya sendiri (mis. `benda.localToWorld(...)`).
- **Benda bergantung ikut pindah.** `posisi.meja` di Pustaka ikut memindahkan kursi, bangku, dan lentera. Di Rencana mode rapat, `posisi.meja` memindahkan pengurus dan kursi. `opsi.lintasan.ke` memindahkan bendera.
- **Dunia tidak menyetel keadaan.** Keadaan (`abu`, `pudar`, `nyala`, debu, laci, pintu) disetel adegan setiap frame tanpa syarat, seperti biasa.
- **Benda tambahan** dibuat sesudah dunia, dengan pembuat kit biasa. Untuk muncul bersama dunia: `muncul([...d.urutan, tambahan], { t: 0.6 })`.

Semua tata letak bawaan lolos `periksaZona` pada format indikator dengan `d.fokus` dan H 16, tanpa benda penting yang bertabrakan (lihat bagian Pengujian).

## duniaPustaka

Ruang baca berlantai: dua rak buku di tepi belakang lantai, meja bundar, lima figur duduk di bangku, dan lima lentera padam di atas meja.

```js
import { buatVideo, formatIndikator, jadwalIndikator, duniaPustaka, muncul, denyutCermin, klikEmas, setelKeadaan, halus, rentang } from "../../kit/index.js";

let jadwal;
const v = buatVideo({ format: formatIndikator({ /* … */ }), kamera: (t) => jadwal(t) });
const d = duniaPustaka(v, { opsi: { rakKiri: { debu: true, bukuBesar: 6 } } });          // indikator 04
jadwal = jadwalIndikator({ fokus: d.fokus, cermin: { fokus: d.titik.rakKiri, H: 12 }, langkah: { fokus: d.titik.meja } });
muncul(d.urutan, { t: 0.6, jeda: 0.04 });
denyutCermin(d.benda.rakKiri.userData.bagian.bukuBesar, { mulai: 7.0, selesai: 11.8 });
v.setiapFrame((t) => setelKeadaan(d.benda.lentera1, "nyala", 0.9 * halus(rentang(t, 15.6, 16.0))));
```

### Benda

| Kunci | Benda kit | Letak bawaan | Catatan |
|---|---|---|---|
| `lantai` | `ruangAcara({ lebar: 8, dalam: 8 })` | `titik(0, 0)`, diputar 45° | Permukaan di y 0.1 |
| `rakKiri` | `rakBuku({ buku: 64, benih: 11 })` | `titik(-2.6, -2.8, 0.1)`, muka ke kamera | |
| `rakKanan` | `rakBuku({ buku: 64, benih: 23 })` | `titik(2.4, -2.9, 0.1)`, muka ke kamera | |
| `meja` | `mejaBundar()` | `titik(0, 1.0, 0.1)` | Permukaan di y 0.85 |
| `bangku1..5` | `kursiRendah()` | radius 1.8 dari pusat meja | Ada bila `bangku: true` |
| `kursi1..5` | `pion({ duduk: true })` | di atas bangku, menghadap pusat meja | Nama kunci mengikuti prompt: "kursi" adalah figur duduk |
| `lentera1..5` | `lentera()` | pusat bola di y 3.0, radius 1.0 di atas meja | Padam (`nyala` 0) |

Kursi1 paling dekat ke penonton, lalu searah jarum jam di layar: kiri depan, kiri belakang, kanan belakang, kanan depan. Lentera ke-i tergantung di arah kursi ke-i. Tidak ada kursi tepat di belakang meja, jadi pemateri di `titik(0, -0.6)` (indikator 09) tidak bertabrakan.

`urutan`: lantai, rakKiri, rakKanan, meja, bangku1..5, kursi1..5, lentera1..5.

### Titik

| Titik | Isi |
|---|---|
| `lantai` | Pusat permukaan lantai, `titik(0, 0, 0.1)`. **Benda tambahan yang berdiri di lantai memakai y 0.1**, termasuk jalur figur yang berjalan |
| `meja` | Pusat permukaan meja (buku terbuka, bola dunia, peta lokal) |
| `rakKiri`, `rakKanan` | Tengah muka rak pada setengah tinggi (fokus cermin H 12) |
| `kursi[i]` | Titik lantai tiap kursi (tujuan figur yang datang) |
| `duduk[i]` | Titik asal figur duduk (puncak bangku). Untuk figur yang datang lalu duduk: ganti ke `pion({ duduk: true })` di titik ini |
| `atasKepala[i]` | Di atas kepala figur duduk, tempat ujung ekor `balonKata` |
| `depanKursi[i]` | Di permukaan meja, di depan kursi i (kartu paragraf, kertas tanya) |
| `lentera[i]` | Pusat bola lentera i |
| `pusatLentera` | Pusat lingkar lentera di atas meja, y 3.0 (lampu gagasan) |

### Opsi

| Opsi | Bawaan | Arti |
|---|---|---|
| `bangku` | `true` | Bangku rendah di bawah setiap figur duduk, sehingga kursi kosong tetap tampak saat figurnya belum datang (14, 30). `false`: figur duduk langsung di lantai, seperti prompt |

### Penyimpangan dari prompt

| Bagian | Prompt | Kit | Alasan |
|---|---|---|---|
| `lantai` | pelat 8 × 0.1 × 8 (arah tidak disebut), warna pelat | `ruangAcara` 8 × 0.1 × 8 diputar 45° (sejajar layar), warna lantai kit bergaris tepi zamrudRedup | Lantai 8 × 8 yang sejajar sumbu dunia tampak sebagai belah ketupat selebar 11.3 unit, padahal lebar frustum 16 hanya 9 unit. Lantai sejajar layar selebar 8 unit (x 60–1020). Warna pelat hampir sama dengan latar, sehingga lantai tidak terbaca |
| `rakKiri`, `rakKanan` | arah tidak disebut | diputar 45°, muka ke kamera, sejajar tepi belakang lantai | Mengikuti lantai sejajar layar; buku besar dan debu terlihat penuh saat cermin |
| `rakKanan` | `titik(2.4, -3.0)` | `titik(2.4, -2.9)` | Puncak rak keluar zona atas 5 px |
| isi rak | 40 buku | 64 buku | 40 buku (lebar 0.12–0.2) hanya mengisi separuh rak 3.0, dan kedua rak tampak setengah kosong di sisi kanan |
| tinggi benda | y 0 | y 0.1 | Benda berdiri di atas lantai setebal 0.1 |
| `kursi1..5` | pion duduk (tinggi turun 0.25) di lantai | pion duduk di atas `bangku1..5` (kursiRendah, tinggi 0.3) | Figur duduk di lantai hanya setinggi meja (kepala ±0.79, meja 0.75). `bangku: false` kembali ke bentuk prompt |

Lentera pada "ketinggian y 3.0" dibaca sebagai pusat bola, jadi titik asal lentera (di bawah bola) ada di y 2.75. Fokus `titik(0, 0, 0.8)` sama dengan prompt.

### Resep per indikator

| Indikator | Penyesuaian |
|---|---|
| 04 | `opsi: { rakKiri: { debu: true, bukuBesar: 6 } }`. Buku besar di ruang ke-2 dari bawah (`rakBesar` 2): `d.benda.rakKiri.userData.bagian.bukuBesar`. Debu: `rakKiri.userData.aturDebu(k)`. Cermin: `cermin: { fokus: d.titik.rakKiri, H: 12 }`. `bukuTerbuka` di `d.titik.meja`, `paragraf1..5` di `d.titik.depanKursi[i]`, `balonKutipan` di `d.titik.atasKepala[i]` |
| 09 | `pemateri` di `titik(0, -0.6, 0.1)`. `kotakPertanyaan` (`kotakCelah`) di `titik(1.8, 2.6, 0.1)`. Kertas tanya terbang dari `d.titik.duduk[i]` ke `kotak.userData.titikCelah` |
| 14 | `opsi: { lentera: { nyala: 0.4 } }`. Kursi kosong: munculkan `kursi1..5` mulai 12.4 (atau `tanpa: ["kursi"]` lalu buat figur yang berjalan ke `d.titik.kursi[i]`). Empat lentera tambahan, diuji lolos zona (tidak bisa di atas rak karena puncak rak sudah di tepi atas zona): `lentera({ tali: 0.3, nyala: 0.4 })` di `d.benda.rakKiri.position` (dan rakKanan) `.clone().add(titik(±1.0, 0.7)).setY(2.3)`, yaitu menggantung di depan ruang teratas rak. `kanal` (`panelKertas({ lebar: 1.6, tinggi: 1.0, judul: "KANAL KOMISARIAT" })`) di `titik(3.0, 2.6, 0.1)`; prompt `titik(3.6, 2.6)` melewati tepi lantai (diuji) |
| 16 | `tanpa: ["meja", "kursi", "bangku", "lentera"]` (diuji). Kader berjalan di y 0.1 |
| 30 | `tanpa: ["lentera"]` lalu `lampuGagasan()` dengan pusat bola di `d.titik.pusatLentera` (titik asal `pusatLentera.y − 0.45`). Kursi kosong seperti 14. `kotakUsulan` di `titik(2.6, 2.4, 0.1)`, `petakUji` di `titik(-2.6, 2.4, 0.1)` |
| 42 | `bolaDunia` di `d.titik.meja`. Pembicara = `kursi1..5`; dengan `bangku: false` celah antara figur dan lantai terlihat jelas saat figur diangkat 0.3 (cermin). `petaLokal` di `d.titik.meja` |

## duniaRencana

Ruang perencanaan: papan tulis di belakang, meja kerja, lintasan tujuh ubin, dan bendera di ujung lintasan. Mode `rapat` mengganti meja kerja dengan meja rapat bundar.

```js
const d = duniaRencana(v, { opsi: { papan: { kolom: ["TUGAS", "TENGGAT", "PJ"] } }, rapat: true });   // indikator 08
jadwal = jadwalIndikator({ fokus: d.fokus, cermin: { fokus: d.titik.papan, H: 12 }, langkah: { fokus: titik(-0.8, -1.2) } });
denyutCermin(d.benda.papan, { mulai: 7.0, selesai: 11.8 });
```

### Benda

| Kunci | Benda kit | Letak bawaan | Catatan |
|---|---|---|---|
| `papan` | `papanTulis({ kaki: 0.4 })` | `titik(-1.6, -2.6)`, menghadap kamera | 4.0 × 2.6; `kolom`, `baris`, `debu`, `permukaanBaru` lewat `opsi.papan` |
| `meja` | `mejaKotak()` 2.4 × 0.8 × 1.2 zamrudRedup | `titik(-1.3, -0.5)`, sejajar sumbu dunia | Mode rapat: `mejaBundar()` di `titik(0, 0.6)` |
| `lintasan` | `lintasan({ jumlah: 7 })` | dari `titik(-2.8, 2.6)` ke `titik(3.0, -0.3)` | Dibangun dari titik dunia; grup di titik asal. Pindahkan lewat `opsi.lintasan: { dari, ke }` |
| `bendera` | `bendera()` | ujung lintasan + `titik(0.5, -0.4)` = `titik(3.5, -0.7)` | Kain mengarah ke kanan layar |
| `pengurus1..N` | `pion()` | mode rapat, radius 1.75 dari pusat meja, menghadap meja | Duduk bila ada kursi |
| `kursi1..M` | `kursiKotak()` | mode rapat, radius 1.75, menghadap meja | |

Mode rapat tidak membuat `lintasan` dan `bendera`, karena meja rapat menempati jalur lintasan. Pengurus dan kursi ke-0 paling dekat ke penonton, lalu searah jarum jam di layar.

`urutan`: papan, meja, lintasan, bendera (mode rapat: papan, meja, kursi, pengurus).

### Titik

| Titik | Isi |
|---|---|
| `papan` | Pusat muka papan (fokus cermin 08, 35) |
| `depanPapan` | Tanah 1 unit di depan pusat papan (grafik 35, figur yang menulis) |
| `meja` | Pusat permukaan meja (palu, kartu 24) |
| `ubin[i]`, `lintasanAwal`, `lintasanAkhir` | Pusat atas tiap ubin lintasan (kartu yang maju satu ubin) |
| `bendera`, `puncakBendera` | Alas dan puncak tiang |
| `pengurus[i]`, `kursi[i]`, `duduk[i]` | Mode rapat: titik lantai pengurus, titik lantai kursi, titik asal figur duduk (dudukan kursi, y 0.42) |

### Opsi

| Opsi | Bawaan | Arti |
|---|---|---|
| `rapat` | `false` | `true` atau `{ pengurus = 5, kursi = 0 }`. "Dunia Rencana dengan meja rapat" (08, 27, 32, 41): meja diganti `mejaBundar` di `titik(0, 0.6)`, dengan pengurus berdiri dan/atau kursi. Bila keduanya ada, pengurus duduk di kursi. Pindahkan lewat `posisi.meja`; pengurus dan kursi ikut |

### Penyimpangan dari prompt

| Bagian | Prompt | Kit | Alasan |
|---|---|---|---|
| `papan` | `titik(-1.6, -3.2)`, kaki 1.0 | `titik(-1.6, -2.6)`, kaki 0.4 | Puncak papan (y 3.6) di d −3.2 jatuh 575 px di atas piksel fokus, padahal zona hanya 410 px di atasnya: keluar 165 px |
| fokus | `titik(0, 0)` | `titik(0, 0, 0.8)` | Bersama dua perubahan papan di atas, puncak papan masuk zona (y ±610) dan ujung bawah lintasan tetap jauh dari tepi bawah (y ±1320) |
| `meja` | `titik(-1.2, 0.4)` (arah tidak disebut) | `titik(-1.3, -0.5)`, sejajar sumbu dunia | Di posisi prompt sudut depan meja menimpa ubin dan rel lintasan, ke arah mana pun meja diputar |
| `lintasan` | ke `titik(3.6, -0.6)` | ke `titik(3.0, -0.3)` (arah sama, 7 ubin berjarak 1.08) | Bersama bendera, ujung kanan keluar zona |
| `bendera` | `titik(4.1, -1.0)` | `titik(3.5, -0.7)` (selisih yang sama terhadap ujung lintasan) | Kain bendera mengarah ke kanan dan keluar zona sampai x ±1120 |

### Resep per indikator

| Indikator | Penyesuaian |
|---|---|
| 08 | `rapat: true` (5 pengurus berdiri), `opsi: { papan: { kolom: ["TUGAS", "TENGGAT", "PJ"] } }` (diuji). Kartu tugas terbang ke `d.benda.papan.localToWorld(d.benda.papan.userData.titikSel(c, r))` |
| 24 | Bawaan. Palu dan kartu di `d.titik.meja`. Kartu maju di `d.titik.ubin[i]`, sampai di `d.titik.bendera` |
| 25 | `tanpa: ["meja"]`. `papanSasaran` di `titik(2.6, -2.2)` tidak menimpa bendera |
| 27 | `rapat: true`, `opsi: { pengurus: { tangan: "terbuka" } }` |
| 32 | `rapat: { pengurus: 6 }`, `opsi: { pengurus1: { tangan: "turun", panjangTangan: 0.4 }, … }`. `agenda` di `titik(-2.4, -1.6, 0.8)` berdiri di depan papan |
| 35 | `tanpa: ["meja"]`: figur A di `titik(-0.8, 1.0)` menimpa sudut meja kerja. Grafik tumbuh di sekitar `d.titik.depanPapan` |
| 41 | `rapat: { pengurus: 0, kursi: 6 }`, `posisi: { meja: titik(0.4, 0.8) }`, `opsi: { papan: { baris: [...3 aturan], kolom: ["M1", "M2", "M3", "M4"] } }` (diuji). Pengurus datang ke `d.titik.kursi[i]` lalu duduk di `d.titik.duduk[i]`. `jamBesar` (`jamDinding({ besar: true })`) di `titik(2.6, -2.6)`, diuji lolos zona; posisi prompt `titik(-2.6, -2.6)` menimpa papan. Pada papan berbaris ini label kolom M1–M4 berdesakan dan label baris panjang melewati garis kolom (perilaku `papanTulis`); setel `kolomLabel` atau `opsiLabel` di video |

## duniaArsip

Ruang arsip: lemari sekretariat, garis waktu empat periode, dan folder bersama berlaci empat.

```js
const d = duniaArsip(v);
jadwal = jadwalIndikator({ fokus: d.fokus, cermin: { fokus: d.titik.periode[3], H: 12 } });            // indikator 18
v.setiapFrame((t) => d.benda.folder.userData.aturLaci(2, halus(rentang(t, 14.0, 14.4))));             // laci LAPORAN
```

### Benda

| Kunci | Benda kit | Letak bawaan | Catatan |
|---|---|---|---|
| `lemari` | `lemari()` (isi map) | `titik(-2.6, -1.4)`, rotasi y 20° | `isi`, `kaca`, `buka`, `label` lewat `opsi.lemari` |
| `garisWaktu` | `garisWaktu({ panjang: 7.2, jarak: 1.8 })` | `titik(0.2, 2.8)`, memanjang ke kanan layar | Label PERIODE 1–4; `geserPenanda(s)` |
| `folder` | `folderBersama()` | `titik(2.8, -1.8)` | Label laci di sisi kiri; `aturLaci(i, k)` |

`urutan`: lemari, garisWaktu, folder.

**Lemari kaca (43).** `opsi: { lemari: { kaca: true } }` membuat pintu kaca dengan tiga piala. Dunia menambahkan lapisan debu pada setiap piala (awalnya 0): `d.benda.lemari.userData.bagian.piala[i].userData.aturDebu(k)`. Piala dimajukan ke depan rak dan disebar (dua di daun kiri, satu di daun kanan), karena dengan rotasi 20° piala tengah bawaan lemari tertutup rangka dan gagang di tengah pintu.

### Titik

| Titik | Isi |
|---|---|
| `lemari` | Tengah muka lemari pada setengah tinggi (fokus cermin 33, 43) |
| `depanLemari` | Tanah 1 unit di depan pintu lemari (figur, kursi 43) |
| `rakLemari[i]` | Pusat lantai tiap ruang rak, bawah ke atas (rak kosong 33) |
| `piala[i]` | Alas tiap piala, hanya bila lemari berisi piala |
| `periode[i]` | Pusat atas pita tiap periode (kartu program, batu 18) |
| `garisAwal`, `garisAkhir` | Ujung kiri dan kanan pita (tanpa kepala panah) |
| `folder` | Tengah muka folder pada setengah tinggi |
| `laci[i]` | Tujuan dokumen di atas baki laci i (laci 0 di atas: NOTULENSI, KEPUTUSAN, LAPORAN, DOKUMENTASI), dihitung saat laci tertutup. Untuk laci yang sedang terbuka: `folder.localToWorld(folder.userData.titikLaci(i))` |

### Opsi

Tidak ada opsi khusus. Varian lemari cukup lewat `opsi.lemari`.

### Penyimpangan dari prompt

| Bagian | Prompt | Kit | Alasan |
|---|---|---|---|
| `lemari` | `titik(-2.6, -1.6)` | `titik(-2.6, -1.4)` | Puncak lemari (mahkota di sudut belakang) keluar zona atas 13 px |
| `garisWaktu` | `titik(0.6, 2.8)`, pita 9 dengan periode tiap 2.25 | `titik(0.2, 2.8)`, pita 7.2 dengan periode tiap 1.8 | Pita 9 unit ditambah kepala panah lebih lebar dari layar (9 unit pada H 16). Pita 7.2 memakai x ±130–1050 |
| piala lemari kaca | posisi bawaan lemari | dimajukan, disebar, diputar 60° | Lihat di atas |

### Resep per indikator

| Indikator | Penyesuaian |
|---|---|
| 18 | `kartuProgram` di `d.titik.periode[i]`; batu di posisi relatif yang sama tiap periode, mis. `d.titik.periode[i].clone().add(titik(0.3, 0))`. Cermin: `d.titik.periode[3]`. `mapEvaluasi` terbang ke `d.titik.laci[2]` (LAPORAN), klik emas `d.benda.folder.userData.bagian.laci[2]`. Ujung garis waktu: `d.titik.garisAkhir` |
| 33 | `opsi: { lemari: { isi: "kosong", buka: 1 } }` (diuji). `denyutCermin(d.benda.lemari, …)` menyalakan tepi tiap ruang rak yang kosong. Folder belum tampak: munculkan sesudahnya. `pintuKeluar` prompt `titik(-5.0, 1.0)` di luar layar; `bingkaiPintu()` di `titik(-3.6, 1.2)` lolos zona (diuji), tetapi menutupi label PERIODE 1 dan daun pintu kiri lemari yang terbuka. Indikator ini tidak memakai garis waktu, jadi `opsi: { garisWaktu: { label: false } }` atau `tanpa: ["garisWaktu"]` membuat sudut kiri lega |
| 43 | `opsi: { lemari: { kaca: true } }` (diuji). Piala: `d.benda.lemari.userData.bagian.piala`, debu lewat `aturDebu(k)`, abu lewat `setelKeadaan(piala, "abu", k)`, posisi `d.titik.piala[i]`. Tiga kursi rendah dan mantan ketua di sekitar `d.titik.depanLemari`. Garis waktu bergeser: `d.benda.garisWaktu.userData.geserPenanda(s)`. Ruang di samping piala sempit; catatan cara bisa berdiri di ruang atas (`d.titik.rakLemari[2]`) atau di depan pintu kaca |

## Pengujian

Diuji dengan video sementara yang menampilkan setiap dunia dan variannya bergantian (`npm run buat -- <uji> --periksa` dan tangkapan penuh 1080 × 1920):

- **Zona.** Pada H 16 dengan `d.fokus`, tidak ada pelanggaran untuk Pustaka (bawaan; 04 + 14 dengan empat lentera tambahan dan kanal; 16 tanpa meja), Rencana (bawaan dengan kolom; rapat 5 pengurus; rapat 6 pengurus duduk; 41 dengan papan aturan dan jam), dan Arsip (bawaan; lemari kaca; lemari kosong terbuka).
- **Cermin H 12** di `rakKiri`, `meja` (Pustaka), `papan`, `lintasanAkhir`, `meja` rapat (Rencana), `lemari`, `periode[3]`, `folder`, dan lemari kaca (Arsip): benda kunci di tengah dan utuh. Benda lain boleh terpotong pada H 12.
- **Bloom.** Tangkapan dengan dan tanpa bloom dibandingkan per piksel. Semua dunia dalam keadaan bawaan, termasuk lentera redup 0.4 di Pustaka 14: 0 piksel berbeda. Hanya lentera yang menyala emas (`nyala` 0.9) yang berpendar.
- **Warna.** Pemeriksa palet bersih di semua titik.
