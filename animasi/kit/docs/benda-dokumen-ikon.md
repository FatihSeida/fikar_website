# benda: dokumen dan ikon

Pustaka benda kertas, papan, penanda kecil, ikon melayang, dan properti kecil. Berkasnya `benda/dokumen.js` dan `benda/ikon.js`. Semuanya diekspor ulang lewat `../../kit/index.js`, dan katalognya ada di `DAFTAR_DOKUMEN` dan `DAFTAR_IKON` dengan kategori `dokumen`, `penanda`, `ikon`, dan `properti`.

```js
import { buatVideo, titik, muncul, tumbuh, klikEmas, gantiLabel, panelKertas, kartuProker, balonKata } from "../../kit/index.js";

const v = buatVideo({ ... });                       // benda dibuat SESUDAH buatVideo()
const tabel = v.tambah(panelKertas({ lebar: 2.2, tinggi: 1.6, panjangBatang: [1.6, 1.1, 0.7], labelBaris: ["2024", "2025", "2026"] }));
tabel.position.copy(titik(0.8, 3.6));
muncul(tabel, { t: 12.4 });
tumbuh(tabel.userData.bagian.batang, { t: 12.9, sumbu: "x" });   // batang tumbuh berurutan
klikEmas(tabel, { t: 15.6 });                                     // bingkai dan batang menjadi emas
```

## Konvensi bersama

Semua pembuat mengikuti KONTRAK §5:

- `nama(opsi = {})` mengembalikan `THREE.Group` dengan titik asal di tengah alas (y = 0).
- `userData` berisi `{ nama, penting, bagian, ... }`.
- Tiap benda punya bahannya sendiri. Geometri boleh dipakai bersama.
- Tidak ada emissive bawaan dan tidak ada ketergantungan waktu.

| Opsi umum | Arti |
|---|---|
| `skala` | Skala seragam benda, mis. `balonKata({ skala: 0.5 })` |
| `nama`, `penting` | `userData.nama` dan `userData.penting`. Ikon melayang dan tag bawaannya `penting: false`; selebihnya `true` |
| `rebah` | Lembar berbaring muka ke atas (titik asal di tengah alasnya). `false` berarti berdiri dengan tepi bawah di titik asal |
| `miring` | Untuk benda berdiri: condong ke belakang dalam radian. Dokumen bawaannya 12°, kartuProker 10°, panel 20° (= "miring 70° dari tanah") |
| `hadap` | Rotasi y dalam radian. Bawaan 45° membuat muka benda (+z lokal) menghadap kamera dan garis teks mendatar di layar |
| `hadapKamera` | Ikon pipih, balon, centang, dan tanda tanya menghadap kamera penuh (billboard). `false` berarti memakai `hadap` |
| `warna…` | Hanya token tema (`W.kertas`, `W.zamrud`, …) atau campuran dua token |
| `label` | Teks HTML lewat `label3D`, atau `{ teks, ...opsi label3D }`. Teks berisi `\n` dipecah menjadi beberapa baris. Label hanya dibuat bila opsi diisi, jadi pembuat tanpa label tidak butuh video aktif |

**Label di atas kertas** (kepala kolom, label baris, judul panel, label tag) memakai gaya `baris` (teks gelap) dengan `skala: "ikut"`. Artinya ukuran label ikut kamera (16 / H), sehingga label tetap sebanding dengan kertasnya saat kamera mendekat. Bila teks tidak muat, label dikecilkan secara seragam per kelompok, dan judul panjang dipecah menjadi dua baris. Label tetap tidak bisa lebih kecil dari ukuran yang masih terbaca. Untuk teks panjang, lebarkan panelnya.

**Label benda yang belum dimasukkan ke scene disembunyikan** oleh `label3D` (sejak kit 0.6.0), dan tampil setelah bendanya masuk adegan.

## Keadaan

Semua benda menerima keadaan baku lewat `setelKeadaan(benda, nama, nilai)` dan gerak kit, yaitu `emas`, `nyala`, `denyut`, `abu`, dan `pudar`. Bagian yang terkena keadaan diatur lewat `userData.bagian.emas`, `.denyut`, dan `.tepi`.

**Aturan emas.**

| Jenis benda | Yang menjadi emas | Yang tetap gelap supaya terbaca |
|---|---|---|
| Dokumen kecil (kartuKecil, lembarKertas, sertifikat, suratKeputusan, amplop, map, tag, kartuProker) | Kertasnya | Garis teks, bingkai, segel, cap, pita kepala |
| Papan besar (`panelKertas`) | Bingkai, batang, garis isi, kotak cek, centang, isi petak | Kertasnya, supaya pendarnya tidak menyilaukan |

Bagian kecil bisa diklik sendiri, misalnya `klikEmas(panel.userData.bagian.batang[0])`, `klikEmas(kartu.userData.bagian.tag)`, atau `klikEmas(sasaran.userData.bagian.cincin[2])`.

**Aturan bloom (sudah diukur).**

- Hanya emas yang melewati ambang bloom 0.74. Kertas yang rata menghadap ke atas mencapai luminans 0.64. Kertas yang menghadap tepat ke arah matahari kit mencapai 0.76, jadi permukaan lengkung (tanda tanya, pengeras suara, anak panah, pasir jam, bibir papan sasaran) memakai kertas yang diredupkan 15%.
- Emissive denyut (zamrudPijar × 0.5) di atas kertas juga melewati ambang. Karena itu `bagian.denyut` hanya berisi bahan gelap (luminans albedo di bawah 0.4). Benda kertas berdenyut lewat garis tepinya (`bagian.tepi`, 3 px zamrudPijar).
- Diuji dengan membandingkan tangkapan berbloom dan tanpa bloom pada 9 halaman uji. Selisihnya 0 piksel di semua halaman tanpa emas.

**Anak benda.** Tag, centang di panel dan kartu, serta dokumen di ponsel adalah benda tersendiri. Bila anak sudah punya keadaan sendiri (mis. tag yang sudah diklik emas), keadaan induk (mis. `abu`) tidak menimpanya.

**Nama bagian berulang.** Bagian yang biasa dimunculkan, ditumbuhkan, atau diklik satu per satu punya `userData.nama` bernomor mulai 1, sehingga laporan bunyi (`sumber`) menulis `petak 3` atau `centang 2`, bukan `benda-3`. Nomor 1 = indeks 0: `muncul(kalender.userData.bagian.isiPetak[2])` tercatat sebagai `petak 3`.

| Benda | Nama |
|---|---|
| `panelKertas` | `isiPetak[i]` → `petak N`, `petak[i]` → `alas petak N`, `baris N`, `batang N`, `garis N` (baris tanpa kolom), `sel R.K`, `centang N` (kotak cek), `centang R.K` (`isiSel: "centang"`), `kotak cek N`, `baris kosong N` (`slot`), `jalur N` |
| `kartuProker` | `garis N`, `kotak cek N`, `centang N`, `tag <label>` (mis. `tag PJ`) |
| `lembarKertas`, `buku` terbuka, `ikonDokumen` | `garis N`; `buku` dan `ikonBuku`: `halaman N` |
| `kartuKecil`, `suratKeputusan`, `sertifikat`, `balonKata`, `map`, `ponselKecil` | `simbol N`, `isi N`, `teks N`, `isi N`, `halaman N`, `dokumen N` |
| `tumpukanKertas`, `ikonGrafik`, `gelombangSinyal`, `papanSasaran`, `ikonRetak`, `ikonTimbangan` | `kertas N`, `batang N`, `busur N`, `cincin N`, `belahan N`, `piring N` |

**Opasitas bersarang dikalikan** (sejak kit 0.6.0, lihat `opasitasEfektif` di `docs/inti.md`). `hilang` pada papan ikut menghilangkan isinya, termasuk anak yang dimunculkan sendiri, dan urutan pemanggilan tidak berpengaruh.

## dokumen.js

### Kartu dan lembar

| Pembuat | Bawaan | Opsi utama | `bagian` |
|---|---|---|---|
| `kartuKecil` | 0.6 × 0.02 × 0.8 kertas, berbaring | `simbol: null \| "garis" \| "grafik" \| "centang"`, `warnaSimbol`, `label` (di luar tepi jauh kartu) | `badan`, `muka`, `simbol[]` |
| `lembarKertas` | 0.8 × 0.02 × 1.0, berbaring | `lebar`, `panjang`, `garis` (jumlah baris), `judul` (batang judul), `benih`, `rebah: false` untuk berdiri | `badan`, `judul`, `garis[]` |
| `sertifikat` | 1.7 × 1.2, berdiri | `segel` (roset berpita), `warnaHias` | `bingkai[]`, `teks[]`, `segel` |
| `suratKeputusan` | 1.16 × 1.6, berdiri | `cap: false` = belum dicap, `warnaCap` | `isi[]`, `cap` (kelompok; `muncul(cap)` lalu `catat({ jenis: "cap" })`) |
| `amplop` | 1.5 × 0.94 × 0.05, berdiri | `prangko`, `skala: 0.5` untuk amplop kecil | `tutup` berporos di tepi atas: `tutup.rotation.x = -π·k` membuka |
| `map` | 0.8 × 0.06 × 1.0, berbaring | `warnaTab`, `lembar` (jumlah lembar yang mengintip) | `sampulDepan` berporos di tepi kiri (`rotation.y = -π·k`), `tab`, `pita`, `halaman[]` |
| `kartuProker` | 1.0 × 1.25 tegak di kaki kecil | `garis` (baris isi), `cek: n` + `tercentang`, `tahun: "2025"` (label kotak; ganti dengan `gantiLabel(kartu.userData.label.tahun, { t, teks: "2026" })`), `tag: ["TGL", "PJ", "Rp"]`, `kaki` | `kepala`, `garis[]`, `kotakCek[]`, `centang[]`, `tag[]` |

### panelKertas

Satu pembuat untuk semua papan kertas: panel tegak atau condong di atas alas (`kaki: "alas" | "tiang" | false`, `dasar` = tinggi tepi bawah). Bawaannya 2.0 × 1.4, condong 20°, berbingkai zamrud.

| Opsi | Isi |
|---|---|
| `batang: [1, 0.7, 0.45]` | Batang mendatar, panjangnya pecahan dari lebar jalur |
| `panjangBatang: [1.6, 1.1, 0.7]` | Sama, dalam unit dunia (diperkecil seimbang bila tidak muat) |
| `jalur: true` | Jalur samar di belakang tiap batang ("kapasitas") |
| `labelBaris` | Label kiri tiap baris (HTML) |
| `baris: n` | Baris garis teks |
| `kolom: [...]` | Kepala kolom HTML, garis pemisah, dan sel per baris. `isiSel: "garis" \| "centang" \| "kosong"` |
| `cek: true` | Kotak cek di awal tiap baris. Centangnya tersembunyi kecuali `i < tercentang` |
| `kosong: [2]` atau `true` | Baris kosong: isinya disembunyikan dan diganti garis putus-putus |
| `grid: [7, 4]` | Petak kalender (kertas di atas panel zamrudRedup). `terisi: [..]` = petak yang sudah berisi zamrud |
| `kepala`, `cincin` | Pita kepala dan cincin pengikat (kalender) |
| `judul` | Teks di tengah panel, atau di atas bila ada isi |
| `skalaLabel` | `"ikut"` (bawaan), angka, atau fungsi |

`bagian` berisi:

- `batang[]`: titik asal di pangkal kiri, jadi bisa ditumbuhkan dengan `tumbuh(…, { sumbu: "x" })`.
- `baris[]`: kelompok isi per baris, titik asal di awal baris. `tumbuh(baris[i], { sumbu: "x" })` mengisi baris dari kiri.
- `sel[r][c]`, `centangSel[r][c]`, `centang[]`, `kotakCek[]`.
- `petak[]` dan `isiPetak[]` (pakai `muncul(isiPetak[i])`; tercatat di laporan bunyi sebagai `petak i+1`).
- `slot[]`, `jalur[]`, `bingkai[]`, `kertas`, `muka`, `papan`.

`userData` berisi:

- `label`: `{ judul, kolom[], baris[] }`.
- Titik dunia untuk benda yang terbang ke papan: `titikBaris(i)`, `titikSel(r, c)`, `titikPetak(i)`, dan `kuaternion()`. Panggil sesudah matriks dunia diperbarui, mis. di `v.setiapFrame`.

Resep untuk kebutuhan seri:

```js
panelKertas({ lebar: 2.2, tinggi: 1.6, panjangBatang: [1.6, 1.1, 0.7], labelBaris: ["2024", "2025", "2026"] }) // tabel 01
panelKertas({ lebar: 1.2, tinggi: 1.6, baris: 4, kosong: [2] })            // agenda 32; isi: tumbuh(bagian.baris[2], { sumbu: "x" })
panelKertas({ lebar: 4.0, tinggi: 2.6, kolom: ["TUGAS", "TENGGAT", "PJ"], baris: 4, cek: true, kosong: true, kaki: "tiang" }) // papan bersama 08
panelKertas({ lebar: 1.6, tinggi: 2.0, kolom: ["APA", "SIAPA", "KAPAN"], baris: 5, cek: true })   // daftar lanjut 27
panelKertas({ lebar: 1.2, tinggi: 1.0, grid: [7, 4], kepala: true, cincin: true })                // kalender 06
panelKertas({ lebar: 0.9, tinggi: 1.4, baris: 6, cek: true })                                     // daftar hadir 06
panelKertas({ lebar: 1.4, tinggi: 1.8, baris: 9, kosong: true })                                  // daftar minat 16
panelKertas({ lebar: 1.4, tinggi: 1.0, batang: [0.8, 0.5, 0.3], jalur: true })                    // lembar pilah 29
panelKertas({ lebar: 4.0, tinggi: 2.0, labelBaris: ["HADIR TEPAT WAKTU", …], kolom: ["M1", "M2", "M3", "M4"], isiSel: "centang" }) // papan aturan 41
panelKertas({ lebar: 1.6, tinggi: 0.5, judul: "TEMA 1", kaki: false, bingkai: false, miring: 0 }) // tema kajian 09, tigaTanya 18
```

### Buku dan tumpukan

| Pembuat | Opsi | `bagian` / `userData` |
|---|---|---|
| `buku` | `tinggi` 0.8 (panjang halaman), `lebar` 0.6, `tebal` 0.16, `terbuka`, `berdiri` (punggung menghadap +z seperti di rak), `warna`, atau `benih` untuk warna acak berbenih | Tertutup: `sampul[]`, `halaman`, `pita[]`. Terbuka: `halaman[]` (emas), `sampul[]`, `garis[]` |
| `warnaBuku(benih)` | Warna sampul acak berbenih dari campuran token tema (rak buku); sama benih = sama warna | — |
| `tumpukanKertas` | `jumlah` 12, `rapi`, `tumpukan` 3, `ukuran` `[0.34, 0.05, 0.44]`, `sebar`, `benih` | `bagian.kertas[]`. `userData.tataRapi[i]` dan `tataAcak[i]` berbentuk `{ posisi, putar }`, untuk `busur(kertas[i], { t, ke: tataRapi[i].posisi, putar: tataRapi[i].putar - tataAcak[i].putar })` |

### Penanda kecil, ponsel, balon

| Pembuat | Opsi | Catatan |
|---|---|---|
| `tag` | `label: "TGL"`. Bila label diisi, lebar bawaannya memanjang (0.1 + 0.09 per huruf) supaya teks muat; tanpa label ukurannya 0.18 × 0.12. `rebah`, `warnaPita` | Emas seluruh tag. Di `kartuProker({ tag })` tag berdiri di muka kartu |
| `centang` | `ukuran` 0.4, `warna` zamrud, `hadapKamera`, `tengah` (titik asal di tengah) | Dua kaki berujung bulat |
| `tandaTanya` | `ukuran` 0.5, `hadapKamera`, `tengah` | Tabung melengkung dan titik bola, bukan teks 3D |
| `ponselKecil` | 0.35 × 0.06 × 0.6, `rebah`, `miring` 15°, `dokumen: 3` (kartu kecil melayang di atasnya) | `bagian.dokumen[]` adalah benda sendiri. Untuk menerbangkannya ke tempat lain, pindahkan dulu ke scene dengan `v.scene.attach(dok)` sesudah posisi ponsel final, sebelum frame pertama |
| `balonKata` | 1.4 × 0.8 × 0.08 kertas opacity 0.85, selalu menghadap kamera. `isi: "titik" \| "tanya" \| "kosong" \| "panahNaik" \| "panahTurun" \| "kabur" \| "garis"`, `putus` (garis tepi putus-putus tanpa badan), `cermin`, `skala`, `warnaIsi`, `benih` (untuk `kabur`) | Titik asal di ujung ekor: letakkan di atas kepala figur (y ±1.15 untuk pion). `bagian.badan`, `isi[]`, `garisPutus` |

## ikon.js

Ikon bidang berukuran sekitar 0.4–0.6 unit (40–70 px pada H 16), warna bawaan zamrud, dan `penting: false`. Titik asalnya di bawah ikon; untuk melayang di atas pion, beri `position.y` sekitar 1.3. Ikon pipih menghadap kamera, sedangkan ikon bervolume (kubus, timbangan, grafik) diputar di sumbu y, sehingga `putar(ikon, …)` tetap terbaca.

| Pembuat | Bentuk | Opsi / `bagian` |
|---|---|---|
| `ikonKubus` | Kubus bertepi garis kertas (segi enam tiga warna di kamera isometrik) | `garis`, `warnaGaris` |
| `ikonDaun` | Daun lonjong condong dengan urat | `warnaUrat`; `helai`, `urat[]` |
| `ikonTimbangan` | Tiang, balok, dua piring bertali | `balok`, `piring[]` |
| `ikonBuku` | Buku terbuka berbentuk V, bawaan 0.6 | `halaman[]`, `sampul[]` |
| `ikonCakram` | Piringan beralur, label tengah, lubang | `piringan`, `alur[]` |
| `ikonRetak` | Lempeng terbelah zigzag, bawaan abu | `celah`; `belahan[]` untuk dipisahkan |
| `ikonGrafik` | Tiga batang di alas | `tinggi: [0.4, 0.65, 1]`; `batang[]` → `tumbuh(…, { sumbu: "y" })` |
| `ikonDokumen` | Lembar bersudut lipat bergaris | `lembar`, `lipat`, `garis[]` |
| `ikonPanah` | Panah tebal | `arah: "naik" \| "turun"` |
| `gelombangSinyal` | Titik sumber dan tiga busur | `sudut` (90° = ke atas), `sebar`, `jumlah`. Titik asal di titik sumber. `busur[]` → `muncul(busur, { t, jeda: 0.12 })` |

### Properti kecil

| Pembuat | Bawaan | Opsi / `bagian` |
|---|---|---|
| `gembok` | Badan 0.3 × 0.25 × 0.15 kertas lengkung (kertas 15% ke abu, supaya tepi bulatnya tidak bloom), busur abu, lubang kunci | `terbuka`; `busur` berporos di kaki kiri (naikkan `position.y`, putar `rotation.y`) |
| `kompas` | Cakram rebah jari 0.9 tebal 0.08, jarum 0.8 | `arahJarum` (sudut layar: 0 kanan, 90° atas, 45° kanan atas), `miring` (condong ke kamera), `label`; `jarum` → `putar(bagian.jarum, { sumbu: "y", sudut })`. Emas: cakram, cincin, jarum utara; garis arah tetap gelap |
| `papanSasaran` | Cincin 1.0 / 0.66 / 0.33 tebal 0.08 (pelat, zamrudRedup, kertas) dengan bibir kertas, tiang 1.2, condong 15° | `label: ["MASALAH", "KEADAAN AWAL", "UKURAN HASIL"]` (teks terang di cincin gelap, kotak di cincin terang). `cincin[0..2]` luar → dalam. `userData.titikPusat()` |
| `anakPanah` | Batang jari 0.025 panjang 0.9, mata kerucut, bulu zamrud | Titik asal di ujung mata; badan naik ke +y (menancap tegak). `userData.arahkan(vektor)` mengarahkan ujungnya; panggil di `v.setiapFrame` bila arah berubah, karena gerak menimpa rotasi |
| `palu` | Kepala jari 0.12 panjang 0.4, gagang 0.6, warna bawaan kertas lengkung | `alas` (landasan); `ayun` berporos di ujung gagang: `ayun.rotation.z = -sudut` mengangkat kepala |
| `pengerasSuara` | Corong 0.5, mulut ke kanan layar | `hadap`, `miring`; `corong`, `bibir`, `pegangan` |
| `lencana` | Cakram jari 0.12 dengan cincin dan bintang, tegak, warna bawaan kertas lengkung | `pita` (dua ekor pita). Emas: cakram dan cincin; bintang tetap gelap |
| `jamPasir` | Tinggi 0.6, kaca bening, pasir kertas | `isi` 0..1; `pasirAtas.scale.y = k`, `pasirBawah.scale.y = 1 − k`, `aliran.visible` |

## Batas yang diketahui

- Permukaan emas yang rata menghadap ke atas (kartu dan map berbaring, cakram kompas) tampak sangat terang. Itu rumus emas kit. Untuk emas yang lebih lembut, berdirikan dokumennya (`rebah: false`).
- Label sel pada panel sempit dikecilkan sampai teksnya muat (mis. "SIAPA" pada panel 1.6 menjadi sekitar 11 px pada H 16). Lebarkan panel atau dekatkan kamera bila label harus terbaca di ponsel.
- Belum ada pembuat berbentuk "pecah" untuk balon (balon pecah menjadi partikel kertas). Pakai `tumpukanKertas` atau `kartuKecil` kecil dengan `busur`.
