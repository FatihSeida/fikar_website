# Prompt Animasi Indikator 24 dari 44

Judul indikator: Program mudah dibuat, tetapi agenda pelaksanaannya lemah.

Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai J.

## A. Tugas dan Aturan Teknis

1. Buat satu video animasi three.js berdurasi 21 detik untuk Instagram Reels, ukuran 1080 x 1920 piksel, di folder baru `animasi/indikator-24/` (berisi `index.html` dan berkas `.js` pendukung). Kerjakan semuanya di dalam folder ini saja. Jangan mengubah folder animasi lain.
2. Ikuti kontrak halaman di `animasi/README.md`:
   - Halaman wajib menyediakan `window.DURASI = 21`, `window.siap` (Promise yang selesai setelah font termuat dan adegan siap), dan `window.tampilkan(t)` yang menggambar keadaan tepat pada detik `t`, kanvas dan teks HTML sekaligus, secara sinkron.
   - Semua gerak dihitung dari `t`. Dilarang memakai `Math.random()` tanpa benih, jam internal, transisi CSS, atau animasi CSS.
   - Dengan `?rekam=1`, halaman tidak menjalankan loop `requestAnimationFrame`. Tanpa parameter itu, halaman memutar animasi berulang untuk pratinjau, dan `?t=12` membekukan tampilan di detik 12.
   - Renderer `preserveDrawingBuffer: true`, `setPixelRatio(1)`, ukuran 1080 x 1920. `html, body { width: 1080px; height: 1920px; overflow: hidden }`.
3. Gunakan `three` versi 0.170 dari `node_modules` root proyek (`import * as THREE from "three"`, addons dari `three/addons/...`).
4. Sebagai titik awal kode, pelajari dan salin pola dari `animasi/ekosistem-berbasis-bukti/`: `alat.js` (renderer, palet `W`, fungsi `titik`, easing `keluar3`, `masukKeluar3`, `halus`, `pegas`, `jendela`, `rentang`, `lenting`), `isyarat.js` (acak berbenih), `benda-a.js` dan `benda-b.js` (pembuat benda seperti `pion`, `lemari`, `kartuProker`, `buku`, `sertifikat`, `suratKeputusan`, `amplop`, `labelEmas`, `rumah`, `gedungCabang`, `menaraBadko`, `menaraPB`, `stasiunMeja`), serta `index.html` (font, kabut, label HTML, pil ajakan). Salin berkas yang dibutuhkan ke folder `indikator-24` lalu sesuaikan, jangan mengimpor lintas folder.
5. Font sama dengan `ekosistem-berbasis-bukti/index.html`: Noto Serif (judul), DM Sans (keterangan), JetBrains Mono (label), dimuat dari Google Fonts dengan `display=block`.
6. Angka desimal di prompt ini memakai titik. Waktu dalam detik.

## B. Kanvas, Zona Layar, dan Warna

1. Zona kepala, y 0 sampai 600 piksel. Kabut atas berwarna latar solid sampai y 420, lalu gradien ke transparan sampai y 600.
2. Zona adegan 3D, y 600 sampai 1440 piksel. Semua benda penting harus terlihat utuh di zona ini.
3. Zona bawah, y 1440 sampai 1920 piksel. Kabut bawah bergradien dari transparan mulai y 1440 menjadi latar solid penuh dari y 1630.
4. Lebar konten teks 880 piksel (x 100 sampai 980), rata tengah.
5. Palet warna (HSL). Pakai hanya warna ini:
   - `latar` hsl(153, 50%, 7%): latar scene (`scene.background`) dan body.
   - `grid` hsl(153, 36%, 11.5%): garis grid kecil setiap 1 unit. `gridMayor` hsl(153, 40%, 15%): garis grid besar setiap 5 unit.
   - `pelat` hsl(153, 36%, 10%): alas benda dan lantai panggung.
   - `zamrud` hsl(153, 62%, 36%): benda yang sedang berproses. `zamrudPijar` hsl(153, 72%, 42%): garis aktif, tepi kaca, denyut cermin. `zamrudRedup` hsl(153, 55%, 24%): dinding bangunan dan benda netral.
   - `emas` hsl(42, 52%, 58%) dan `emasPijar` hsl(42, 80%, 52%): hanya untuk hasil Langkah di Bagian 3.
   - `krem` hsl(42, 33%, 96%): teks utama. `kertas` hsl(42, 28%, 86%): dokumen, kertas, kartu.
   - `abu` hsl(150, 5%, 52%) dan `abuGelap` hsl(150, 6%, 34%): benda dalam keadaan gejala atau kusam.
   - `pion` hsl(150, 10%, 80%): figur manusia normal.
6. Aturan warna per bagian:
   - Bagian 1 (Gejala): benda utama berwarna `abu` atau `abuGelap`, tanpa emissive.
   - Bagian 2 (Cermin): benda utama mendapat denyut tepi `zamrudPijar`.
   - Bagian 3 (Langkah): benda hasil berubah ke `emas`, emissive `emasPijar` naik dari 0 ke 0.9 dalam 0.8 detik. Hanya satu kelompok benda yang boleh menjadi emas, kecuali adegan di bawah menyebut lain.
   - Bloom memakai UnrealBloomPass (kekuatan 0.5, radius 0.5, ambang 0.74) seperti di alat.js, sehingga hanya emas yang berpendar.
   - Dilarang memakai merah, oranye, atau biru. Gejala selalu abu-abu.

## C. Satuan, Koordinat, dan Kamera

1. Satu unit dunia sama dengan satu sel grid kecil.
2. Posisi ditulis dengan fungsi `titik(r, d, y)` dari alat.js: `r` positif ke kanan layar, `d` positif ke bawah layar (mendekati penonton), `y` positif ke atas. Pusat dunia `titik(0, 0)`.
3. Tanah bergrid memakai shader seperti `bahanTanah` di `ekosistem-berbasis-bukti/dunia.js`: warna latar, garis grid tiap 1 unit, garis mayor tiap 5 unit, pudar radial dari titik fokus. Bidang 300 x 300 unit, ditambah bidang penerima bayangan.
4. Kamera `OrthographicCamera` isometrik dari arah (+x, +y, +z): azimut 45 derajat, elevasi 35.26 derajat. Kamera tidak pernah berputar.
5. Tinggi frustum vertikal default 16 unit (lebar 9 unit). Titik fokus kamera diproyeksikan ke piksel (540, 1010), yaitu tengah zona adegan.
6. Jadwal kamera (semua memakai `masukKeluar3`), kecuali adegan di bawah menyebut lain:
   - t 0.0 sampai 1.2: tinggi frustum 19 ke 16, fokus `titik(0, 0)`.
   - t 6.0 sampai 7.0: tinggi frustum 16 ke 12 (atau angka yang disebut adegan), fokus pindah ke benda cermin.
   - t 12.0 sampai 13.0: tinggi kembali 16, fokus kembali ke `titik(0, 0)` atau yang disebut adegan.
   - t 18.0 sampai 19.5: tinggi 16 ke 21, fokus naik 0.8 unit.
7. Pembagian waktu video:
   - t 0.0 sampai 0.6: grid menyala dari tengah ke tepi (radius pudar grid naik dari 0 ke 20 unit).
   - t 0.6 sampai 6.0: Bagian 1, Gejala.
   - t 6.0 sampai 12.0: Bagian 2, Cermin. Gerak melambat dan berhenti pada t 6.6, kecuali gerak yang disebut boleh berjalan.
   - t 12.0 sampai 18.0: Bagian 3, Langkah.
   - t 18.0 sampai 21.0: kartu akhir.

## D. Bahan, Figur, dan Gerak Standar

1. Benda padat: `MeshStandardMaterial`, roughness 0.8, metalness 0, bayangan aktif. Kotak memakai `RoundedBoxGeometry` radius 0.06.
2. Benda kaca: warna `zamrud`, transparan opacity 0.28, garis tepi `LineSegments2` warna `zamrudPijar` tebal 2 piksel.
3. Teks yang menempel di benda dibuat sebagai label HTML yang diproyeksikan tiap frame (pola `.lbl-benda` di ekosistem-berbasis-bukti), bukan teks 3D.
4. Figur pion: badan kapsul radius 0.18 dengan bagian silinder setinggi 0.46, kepala bola radius 0.16, tinggi total sekitar 1.0 unit. Tanpa wajah. Tangan hanya jika disebut (silinder radius 0.05 panjang 0.35). Warna normal `pion`.
   - Figur pudar: warna bergeser ke `abuGelap`, opacity turun ke 0.15.
   - Figur berhasil atau aktif: cincin torus radius 0.32 tebal 0.03 di bawah kaki, bukan badan yang berubah emas.
   - Figur berjalan: kecepatan 1.2 unit per detik, badan naik turun 0.04 unit pada 4 Hz.
   - Figur duduk: tinggi figur diturunkan 0.25 unit.
5. Gerak standar:
   - Muncul: naik dari y -0.6 ke 0, skala 0.85 ke 1, opacity 0 ke 1, 0.5 detik, `keluar3`. Jeda antar benda berurutan 0.12 detik bila tidak disebut lain.
   - Hilang: turun 0.3 unit dan opacity 1 ke 0, 0.4 detik.
   - Efek klik emas: skala 1.25 ke 1 dengan `pegas` selama 0.35 detik, emissive sesaat 1.4 lalu turun ke 0.9.
   - Denyut cermin: emissive tepi `zamrudPijar` 0 ke 0.5 ke 0, periode 1.2 detik.
   - Aliran: bola cahaya radius 0.07 warna `zamrudPijar` (atau `emas` di Bagian 3) bergerak di sepanjang kurva 2 unit per detik, jarak antar bola 0.6 unit.
   - Debu: bola radius 0.03 warna `abu` opacity 0.4, melayang naik 0.8 unit lalu hilang, posisi dari acak berbenih.

## E. Teks di Layar (isi sudah final, tinggal dipasang)

1. Kepala (top 226 piksel, lebar 880, rata tengah):
   - Baris merek: "HMI EVIDENCE", JetBrains Mono 700 20 piksel, warna `emas`, letter-spacing 0.32em, dengan garis pendek di kiri dan kanan (pola `.merek` di ekosistem-berbasis-bukti).
   - Baris nomor: "INDIKATOR 24 / 44 · TARGET PROGRAM", JetBrains Mono 600 22 piksel, warna krem opacity 0.62, margin atas 14 piksel.
   - Judul `h1`: "Program mudah dibuat, tetapi agenda pelaksanaannya lemah.". Noto Serif 700 50 piksel, warna `krem`, line-height 1.1, maksimal 3 baris, margin atas 18 piksel.
   - Waktu: muncul t 0.6 sampai 1.2 (opacity 0 ke 1 sambil naik 12 piksel), tetap sampai t 17.6, pudar t 17.6 sampai 18.0.
2. Keterangan bawah (top 1490 piksel, lebar 880, rata tengah). Di atas setiap teks ada label kecil JetBrains Mono 700 22 piksel, letter-spacing 0.24em. Teks memakai DM Sans 600 40 piksel, line-height 1.3, warna `krem`, maksimal 3 baris. Kata di antara tanda bintang ganda dicetak berwarna (warna label bagian itu), tanda bintangnya tidak ditampilkan.
   - t 1.2 sampai 5.8: label "GEJALA" warna `abu`, tanpa teks di bawahnya.
   - t 6.6 sampai 12.0: label "CERMIN" warna hsl(153, 52%, 52%) dan teks: "Program kita sudah punya **jadwal, penanggung jawab, dan anggaran**?". Masuk t 6.6 sampai 7.1, keluar t 11.6 sampai 12.0.
   - t 13.6 sampai 18.0: label "LANGKAH" warna `emas` dan teks: "**Tiga hal** untuk setiap program, ditinjau tiap dua minggu.". Masuk t 13.6 sampai 14.1, keluar t 17.6 sampai 18.0.
   - Setiap masuk: opacity 0 ke 1 sambil naik 16 piksel, 0.5 detik, `keluar3`.
3. Kartu akhir (t 18.0 sampai 21.0):
   - Kepala berganti menjadi baris merek dan `h1` Noto Serif italic 700 52 piksel: "Jangan bicara HMI tanpa bukti." Masuk t 18.2 sampai 18.8.
   - Pil ajakan (pola `#ajakan`): latar `emas`, teks warna latar, JetBrains Mono 700 38 piksel, tinggi 92 piksel, sudut penuh, top 1500 piksel, isi "ahmadzulfikar.com/indikator/24" diikuti panah. Masuk t 18.6 sampai 19.2 dengan skala 0.92 ke 1.
   - Baris sumber: top 1640 piksel, JetBrains Mono 500 19 piksel, warna krem opacity 0.45, isi "Sumber indikator: Agussalim Sitompul, 44 Indikator Kemunduran HMI (2006)". Masuk t 19.0 sampai 19.6.
   - Adegan 3D tetap terlihat di belakang dalam keadaan akhir Bagian 3.

## F. Dunia dan Benda

Dunia dasar "Dunia Rencana":
1. `papan`: papanTulis di `titik(-1.6, -3.2)`.
2. `meja`: kotak 2.4 x 0.8 x 1.2 warna `zamrudRedup` di `titik(-1.2, 0.4)`.
3. `lintasan`: 7 ubinJalan dari `titik(-2.8, 2.6)` lurus ke `titik(3.6, -0.6)`.
4. `bendera`: bendera di ujung lintasan `titik(4.1, -1.0)`.
5. Fokus kamera default `titik(0, 0)`.

Kamus bentuk benda yang dipakai di video ini:
- `ubinJalan`: kotak 0.9 x 0.06 x 0.9 warna hsl(153, 30%, 16%). Jalan dibangun dari deretan ubin berjarak 1 unit.
- `papanTulis`: rangka 4.0 x 2.6 x 0.12 berdiri di dua kaki 0.1 x 1.0 x 0.1, permukaan hsl(153, 25%, 18%).
- `bendera`: tiang silinder radius 0.04 tinggi 1.8 dengan kain segitiga 0.7 x 0.45 warna `zamrud`.
- `kartuProker`: kartu program kerja dari `ekosistem-berbasis-bukti/benda-a.js` (kartu tegak warna `kertas` dengan garis isi).

Penyesuaian dunia untuk video ini: Dunia Rencana. Benda tambahan:
1. `palu`: kepala silinder radius 0.12 panjang 0.4 dengan gagang 0.6, di atas meja.
2. `kartu1..6`: kartuProker.
3. `tumpukanSudut`: posisi di `titik(-3.4, 1.8)` tempat kartu menumpuk.
4. `tempelan`: tiga tag kecil per kartu (kotak 0.18 x 0.02 x 0.12) berlabel HTML mikro "TGL", "PJ", "Rp".
5. `penandaDuaMinggu`: label HTML "2 MINGGU" yang muncul di lintasan.

## G. Adegan per Bagian

**Bagian 1, Gejala (t 0.6 sampai 6.0)**
1. t 0.6 sampai 1.6: dunia rencana muncul.
2. t 1.6 sampai 4.0: enam kartu muncul di atas meja satu per satu. Setiap kartu yang muncul diikuti ketukan `palu` (palu turun dan naik 0.25 detik, gelombang kecil di meja).
3. t 4.0 sampai 6.0: semua kartu meluncur dari meja ke `tumpukanSudut` dan menumpuk diam, berubah `abu`. Lintasan kosong, bendera diam.

**Bagian 2, Cermin (t 6.0 sampai 12.0)**
1. Kamera fokus ke tumpukan kartu, tinggi frustum 12.
2. Denyut cermin `zamrudPijar` pada tepi tumpukan, t 7.0 sampai 11.8.

**Bagian 3, Langkah (t 12.0 sampai 18.0)**
1. Kamera kembali ke tinggi 16.
2. t 12.4 sampai 14.0: kartu terangkat satu per satu dari tumpukan, dan tiga `tempelan` menempel di setiap kartu dengan bunyi klik visual kecil.
3. t 14.0 sampai 14.8: semua tempelan berubah emas dengan efek klik emas (bagian D).
4. t 14.8 sampai 17.6: kartu-kartu berjalan di lintasan menuju bendera. Setiap 0.7 detik, label "2 MINGGU" muncul di lintasan dan kartu-kartu maju satu ubin. Kartu pertama mencapai bendera pada t 17.4.

## H. Keadaan Akhir

Pada t 18.0 sampai 21.0 adegan 3D berhenti dalam keadaan akhir Bagian 3 dan tetap terlihat di belakang kartu akhir seperti dijelaskan di bagian E nomor 3. Kamera menjauh sesuai bagian C nomor 6.

## I. Larangan

1. Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
2. Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
3. Tidak boleh ada warna merah, oranye, atau biru.
4. Tidak boleh ada teks 3D. Semua teks lewat HTML.
5. Tidak boleh ada gerak yang bergantung pada jam browser saat mode rekam.

## J. Pemeriksaan Hasil

1. Jalankan `npm run pratinjau -- indikator-24` dari folder `animasi/` untuk melihat hasil, lalu `npm run rekam -- indikator-24 --cuplik 3,9,15,19.5` untuk tangkapan layar.
2. Periksa keempat gambar di `animasi/hasil/` sesuai daftar berikut:
   - t 3: palu mengetuk dan kartu bertambah.
   - t 9: tumpukan kartu diam berdenyut.
   - t 15: kartu bertempelan emas mulai berjalan di lintasan.
   - t 19.5: kartu akhir.
3. Pastikan tidak ada teks yang bertabrakan dengan benda 3D, tidak ada benda penting yang terpotong kabut atas atau bawah, dan tidak ada warna di luar palet.
4. Setelah semua cocok, rekam video penuh dengan `npm run rekam -- indikator-24` (dijalankan dari terminal biasa, bukan sandbox).
