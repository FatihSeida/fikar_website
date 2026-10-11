# Usulan Perbaikan Kit

Kendala yang ditemukan saat membuat video sungguhan. Usulan dikumpulkan di sini, lalu dikerjakan sekaligus dalam satu putaran perbaikan. Setiap usulan mencatat video asalnya dan cara video itu mengakalinya.

## Terbuka

### Dari indikator-07 (kit 1.1.0)

- **Zona garis lengkung.**
  - Masalah: `kotakLayar` memproyeksikan 8 sudut kotak pembatas, sehingga `garisPutus` yang diagonal dilaporkan keluar zona padahal tidak.
  - Akalan sementara: `abaikanZona`.
  - Usulan: untuk benda garis, proyeksikan titik-titik garisnya.
- **`sambungGaris` dengan `garisPutus`.**
  - Masalah: `sambungGaris` butuh `nRuas`, yang hanya dimiliki `garisJalur`.
  - Usulan: pakai `userData.aturTampak` bila ada.
- **Warna benda.**
  - `rumahKecil` belum punya opsi `warnaLampu`. Usulan: tambahkan opsi itu, termasuk satu warna hangat redup yang aman dari bloom.
  - `gedungKelas` belum punya opsi `warnaAbu`.
- **`denyutCermin`.**
  - Opsi `permukaan: false`: denyut permukaan membuat bangunan abu tampak "sudah pulih".
  - Mode `tepi: "alas"`, yaitu garis keliling alas.
  - Bunyi denyut sebaiknya di-pan ke rata-rata posisi layar semua benda, bukan hanya benda pertama.
- **Bantuan kamera.**
  - Usulan: fungsi yang mengembalikan H terkecil yang memuat sekumpulan benda beserta marginnya.
  - Pendamping `fokusUntuk`, yang saat ini hanya memberi peringatan.
- **Gerak baru.**
  - `jatuhMenancap`: jatuh lalu memantul dua kali.
  - `toleh`: pion berputar, condong, dan melompat kecil supaya putarannya terlihat.
  - Contohnya ada di `animasi/proyek/indikator-07/benda-lokal.js`.
- **Benda lokal yang layak dipindah ke kit** (dari `animasi/proyek/indikator-07/benda-lokal.js`):
  - `ruasJalan`: jalan yang tumbuh dari satu ujung;
  - `garisAlas`;
  - `titikCahaya`;
  - `komisariatHangat`.

### Dari indikator-08 (kit 1.1.0)

- **Debu `papanTulis` tidak tampak.**
  - Masalah: bintik `lapisanDebu` hanya berjarak 0.004 dari muka papan, sehingga tertimbun oleh presisi depth.
  - Akalan sementara: `bagian.debu.position.z += 0.03`.
  - Usulan: perbesar jaraknya, atau pakai `polygonOffset`.
- **Label kolom `papanTulis`.**
  - Masalah: kalau hanya `kolom` yang diisi, label tetap 22 px dan tidak ikut skala kamera, sehingga label saling menempel di H 21. Mode tabel sudah benar.
  - Usulan: perilaku mode tabel dijadikan bawaan.
- **Lonjakan `klikEmas` belum menular ke benda yang menempel.**
  - Contohnya kertas di papan.
  - Usulan: opsi `ikut: [...]`, atau `klikEmas` mengembalikan fungsi lonjakannya.
- **`kartuKecil` belum punya `tengah: true`.**
- **Gerak baru.**
  - `melayangAcak`: melayang dengan benih, ikut beku.
  - `terbangKe`: busur dengan putaran dan skala yang ikut berubah.
  - Contohnya `nasibKertas` di `animasi/proyek/indikator-08/benda-lokal.js`.
- **Fokus kamera Dunia Rencana.**
  - Masalah: `d.fokus` membuat isi condong ke atas. Fokus Cermin di papan membuat pengurus depan menabrak teks keterangan bawah.
  - Usulan: `d.fokusCermin`, atau `fokusUntuk` yang menghindari zona teks.
- **`buat --periksa --titik` menimpa lembar bawaan.**
  - Usulan: lembar dengan titik khusus diberi nama sendiri, misalnya `-lembar-titik.png`.

### Dari indikator-01-v2 dan 02-v2 (kit 1.2.0, format evidence)

- **Pencari H terkecil.** Agen mencari H dengan menangkap `console.warn` dari `fokusUntuk`. Usulan: `hMuat(benda, { margin })`, yang juga sudah diusulkan dari indikator-07.
- **Figur yang beku.** Beku bawaan menahan figur yang masih berjalan sampai Bagian 4. Di kamera dekat Bagian 2, figur itu menumpuk dan menimpa teks. Usulan: opsi format `bekuHilang: [6.6, 7.0]`, atau resep di dokumentasi.
- **`blokTanah({ patah: true })` diam-diam tidak bergerigi.** Opsi ini hanya menerima nama sisi. Usulan: `true` berarti sama dengan `sisiCelah`, atau beri peringatan.
- **`debu`.**
  - Belum ada opsi `jatuh`; agen memakai `naik` negatif.
  - Dengan `induk`, panning bunyi memakai koordinat lokal.
  - Ikut beku secara bawaan.
- **`gantiBenda` dengan `tempat: true`** memakai posisi `a` saat dipanggil, bukan pada detik t. Untuk benda yang bergerak, ini perlu didokumentasikan.
- **`papanTulis.titikSel` mengembalikan titik lokal.** Usulan: tambah `titikSelDunia`, atau sebut dengan jelas di dokumentasi. Usulan lain: opsi untuk menempel kartu di sel.
- **Kartu tegak menghadap kamera.** Butuh `rebah: false, miring: 0, hadap: 0`, ditambah `skala`. Bila `tandaTanya` dipasang `hadapKamera`, ia terbenam di kartu tegak.
- **Pemeriksaan zona hanya di titik periksa.** Usulan: `buat --sapu 0.1` untuk menangkap pelanggaran saat transisi, misalnya atap komisariat di 23.7–24.4 dengan kuis H 14.
- **Rotasi `gerbangKampus` dan `gedungKelas` terhadap sumbu dunia** belum didokumentasikan.
- **Jalur keliling tertutup untuk `jalan`.** Agen membuat sendiri subkelas `THREE.Curve`. Usulan: helper jalur keliling.
- **Balon yang menyeberang tertutup papan** karena kedalaman. Usulan: opsi `diAtas` (tanpa uji kedalaman) untuk benda yang melayang.

### Untuk penulis prompt seri versi kit

- **Kamera Gejala Dunia Kader dengan `fokusUntuk([gerbang, komisariat])`.** Baru muat mulai H ≈ 13.5, bukan 11. Izin +1.5 tidak cukup.
- **Dua `blokTanah` 5×6 dengan celah 3.0.** Baru utuh di layar mulai H ≈ 28. Pada H 21.2 isi blok sudah muat.
- **Jejak figur yang lurus di indikator 01** keluar dari bingkai kamera Bagian 2 (fokus gerbang dan kartu tahun, H 8). Akibatnya pemeriksaan K "jejak sedang memudar" sulit terlihat.
- **Pemeriksaan K yang tepat di waktu tiba** (01 titik 18, 02 titik 22) baru terpenuhi sesudah waktu itu. Sebaiknya titik K diberi selisih sekitar 0.3 detik.
