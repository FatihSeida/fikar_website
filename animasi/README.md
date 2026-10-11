# Animasi

Animasi three.js untuk konten Instagram (Reels 1080×1920), direkam menjadi MP4 bersuara. **Mulai dari dokumen ini.** Dokumen ini menunjukkan berkas mana yang perlu dibaca untuk setiap tugas, jadi dokumen lain tidak perlu dibaca.

## Isi folder

| Folder | Isi |
|---|---|
| `kit/` | Pustaka bersama: benda, dunia, gerak, suara, format teks, dan alat rekam. Jangan diubah saat membuat video. |
| `proyek/<nama>/`, misalnya `proyek/indikator-05/` | Folder kerja satu animasi: kode adegannya saja. Perintah cukup memakai `<nama>`; alat mencarinya otomatis di `proyek/`. |
| `dokumen/` | Bahan tulisan: prompt seri 44 indikator dan naskah VO. |
| `hasil/video/` | **Video final.** Satu berkas per animasi, `<nama>.mp4`, sudah bersuara. |
| `hasil/gambar/<nama>/` | Gambar: lembar periksa `lembar.png`, tangkapan `t3.png`, gelombang suara `gelombang.png`. |
| `hasil/kerja/<nama>/` | Bahan antara: video bisu, wav, dan daftar peristiwa bunyi. Boleh dihapus kapan saja. |
| `proyek/_uji-*/` | Folder uji milik kit. |

## Mau mengerjakan apa? Baca ini saja

| Tugas | Yang dibaca |
|---|---|
| Video seri indikator, format evidence (31 detik) | `kit/PANDUAN-EVIDENCE.md` dan prompt videonya di `dokumen/seri-44-kit/indikator-NN.md` |
| Video lain dengan kit (format indikator 21 detik, atau format bebas) | `kit/README.md`, lalu dokumen `kit/docs/` yang ditunjuknya |
| Mengubah atau menambah isi kit | `kit/README.md`, `kit/KONTRAK.md`, dokumen modul yang diubah, dan `kit/USULAN.md` |
| Mengubah video lama tanpa kit (indikator 01–04 versi lama, video tulisan, video kuis) | README di folder video itu dan bagian "Video lama" di bawah |

## Aturan tetap

1. **Satu video bersuara per animasi** di `hasil/video/<nama>.mp4`. Efek suara selalu ada walaupun prompt tidak menyebutnya. Pengecualian: empat draf lama dibuat sebelum aturan suara, yaitu `kuis-evidence-haiku`, `-sonnet`, `-opus`, dan `perbandingan-haiku-sonnet-opus`.
2. **Hasil tidak boleh tercampur.** Video masuk `hasil/video/`, gambar masuk `hasil/gambar/<nama>/`, bahan antara masuk `hasil/kerja/<nama>/`. Tidak ada berkas lepas di `hasil/`.
3. **Link ajakan** semua video indikator: `ahmadzulfikar.com/kuis`.
4. **Tempat menjalankan perintah.** Di PC Windows pakai PowerShell atau terminal biasa, karena Microsoft Edge langsung menutup diri di dalam sandbox Bash milik Claude Code. Di sesi cloud pakai Bash biasa (lihat bagian "Sesi cloud").
5. **Jangan mengubah kit saat membuat video.** Benda yang belum ada dibuat di folder video, dan kendala kit dicatat di `kit/USULAN.md`.
6. **Kerja paralel aman.** Satu pekerjaan hanya menulis ke folder videonya dan ke `hasil/*/<nama>`, dan tidak mematikan proses yang tidak dimulainya sendiri.

## Perintah

Semua dijalankan dari folder `animasi/`. Jalankan `npm install` sekali di awal.

| Perintah | Hasil |
|---|---|
| `npm run baru -- <nama> --format evidence --judul "..."` | Membuat `proyek/<nama>/` dari templat (`evidence`, `indikator`, atau `kosong`) |
| `npm run buat -- <nama> --periksa` | Lembar periksa `hasil/gambar/<nama>/lembar.png`, ditambah laporan zona, warna, dan peringatan |
| `npm run buat -- <nama> --jepret 3,15` | Tangkapan resolusi penuh `hasil/gambar/<nama>/t3.png` |
| `npm run buat -- <nama>` | Render penuh dan suara: `hasil/video/<nama>.mp4`. Tambah `--gpu` supaya lebih cepat |
| `npm run buat -- <nama> --pratinjau` | Server pratinjau di browser; tambah `?t=12` di alamat untuk membekukan detik 12 |
| `npm run rapikan` | Memindahkan berkas lepas di `hasil/` ke tempatnya (dipakai sesudah video lama dirender) |

### Sesi cloud (claude.ai/code, termasuk dari HP)

**Sekali saja, oleh pengguna:**
1. Buka claude.ai/code di browser HP.
2. Ketuk ikon awan bernama environment di atas kotak pesan, lalu gerigi environment itu.
3. Ubah **Network access** menjadi **Full**.

Tanpa langkah ini, Chromium tidak bisa diunduh.

**Setiap sesi berjalan otomatis:** hook di `.claude/settings.json` menjalankan `animasi/siapkan-cloud.sh`. Skrip ini memasang paket npm, ffmpeg, dan Chromium, lalu mencetak ringkasan. Bila ringkasan itu melaporkan Chromium gagal, berarti langkah di atas belum dilakukan.

**Cara meminta video:** "Buat video dari `animasi/dokumen/seri-44-kit/indikator-15.md`."

**Untuk Claude di sesi cloud:**
- Perintah dijalankan dengan Bash biasa.
- Alat otomatis memakai Chromium dengan render tanpa GPU. Render penuh 31 detik butuh sekitar 10-20 menit, jadi jalankan di latar dan tunggu sampai selesai.
- Sesudah render, kirim `hasil/video/<nama>.mp4` ke pengguna dengan `SendUserFile` (`display: "attach"`) supaya bisa diunduh di HP.
- Folder `hasil/` tidak di-commit.

### Video lama

Video yang dibuat sebelum kit memakai perekam dan skrip suaranya sendiri:
1. `npm run rekam -- <nama>`, atau `node proyek/<nama>/rekam.mjs` untuk indikator-03 dan 04. Langkah ini wajib, karena skrip suara membaca video bisu yang baru direkam;
2. `node proyek/<nama>/suara.mjs`;
3. `npm run rapikan`.

Langkah terakhir menaruh video bersuaranya di `hasil/video/<nama>.mp4` dan gambarnya di `hasil/gambar/<nama>/`.

## Kontrak halaman animasi

Berlaku untuk semua video, dengan atau tanpa kit. Kit sudah memasang kontrak ini lewat `buatVideo()`.

Perekam membuka `index.html` di Edge tanpa jendela (viewport 1080×1920, `deviceScaleFactor` 1) dengan `?rekam=1`. Untuk setiap frame, perekam memanggil `tampilkan(t)` lalu mengambil tangkapan seluruh halaman, sehingga teks HTML/CSS di atas kanvas ikut terekam.

Halaman wajib menyediakan:

- `window.DURASI`: panjang animasi dalam detik.
- `window.siap`: Promise yang selesai setelah font termuat dan adegan siap digambar.
- `window.tampilkan(t)`: menggambar keadaan tepat pada detik `t`, kanvas dan teks HTML sekaligus, secara sinkron.

Aturannya:

- **Semua gerak dihitung dari `t`.** Tidak boleh ada `Math.random()` tanpa benih, jam internal, transisi CSS, atau animasi CSS.
- **Mode rekam dan pratinjau.** Dengan `?rekam=1`, halaman tidak menjalankan loop `requestAnimationFrame`. Tanpa parameter itu, halaman memutar animasi berulang untuk pratinjau, dan `?t=12` membekukannya di detik 12.
- **Renderer:** `preserveDrawingBuffer: true`, `setPixelRatio(1)`, ukuran 1080×1920. Latar diatur lewat `scene.background` atau `renderer.setClearColor`.
- **Ukuran halaman tetap:** `html, body { width: 1080px; height: 1920px; overflow: hidden }`.
- **Pustaka:** `three` (0.170) dan `vite` diambil dari `node_modules` root proyek.
