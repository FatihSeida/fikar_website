# Kit Animasi HMI Evidence

Kit ini adalah pustaka bersama untuk semua video animasi three.js di `animasi/`. Isinya objek, dunia, gerak, tata letak teks, suara, dan alat rekam yang sudah teruji. Satu video cukup menulis adegannya sendiri lalu memanggil isi kit.

Kit dipakai untuk banyak jenis konten, bukan hanya seri 44 indikator: video indikator, video narasi tulisan, video tata cara, dan format baru yang belum ada. Karena itu semua bagian kit bisa dikustomisasi lewat parameter, tanpa menyalin atau mengubah kode kit.

Kontrak antarmodul dijelaskan di `KONTRAK.md`. Rincian tiap modul ada di `docs/`.

**Membuat video format evidence (seri 44 indikator)? Cukup baca `PANDUAN-EVIDENCE.md` dan prompt videonya;** dokumen lain di bawah hanya rujukan bila panduan itu kurang.

## Aturan pakai

1. **Mulai dari templat.** Buat video baru dengan `npm run baru -- <nama> [--format <format>]` dari folder `animasi/`. Perintah ini membuat `animasi/proyek/<nama>/` berisi `index.html` dan `adegan.js` yang sudah terhubung ke kit.
2. **Impor, jangan salin.** Folder video hanya mengimpor dari `../../kit/` dan dari file di foldernya sendiri. Jangan menyalin file kit ke folder video. Aturan "salin, jangan impor lintas folder" di prompt lama digantikan oleh aturan ini.
3. **Pekerjaan video tidak mengubah kit.** Kalau butuh objek, gerak, atau bunyi yang belum ada, buat di folder video (misalnya `benda-lokal.js`), lalu laporkan. Objek yang berguna dipindahkan ke kit lewat pekerjaan terpisah. Ini mencegah bentrok saat beberapa video dibuat bersamaan.
4. **Isi brief lebih kuat daripada bawaan kit.** Teks, adegan, waktu, dan warna yang disebut brief dipakai apa adanya. Kit mengisi semua yang tidak disebut brief: tata letak, bahan, pencahayaan, suara, dan pemeriksaan. Kalau angka di brief membuat benda penting keluar layar atau saling bertabrakan, pakai tata letak kit yang sudah teruji dan catat penyimpangannya di laporan.
5. **Semua gerak dihitung dari waktu `t`.** Dilarang memakai `Math.random()` tanpa benih, jam internal, transisi CSS, atau animasi CSS. Pakai `acak(benih)` dan fungsi waktu dari kit.
6. **Warna lewat tema.** Pakai token tema (`W.emas`, `W.zamrudRedup`, dan seterusnya). Warna baru hanya boleh dipakai bila brief memintanya, lewat `buatTema({...})`.
7. **Suara selalu ada.** Gerak standar kit otomatis mencatat peristiwa bunyi. Bunyi tambahan atau pengganti ditulis di `animasi/proyek/<nama>/suara.js`. Setiap video menghasilkan satu video final bersuara; versi bisunya hanya bahan antara.
8. **Periksa lewat lembar periksa.** Jalankan `npm run buat -- <nama> --periksa`, lalu lihat satu gambar `hasil/gambar/<nama>/lembar.png` beserta laporan zona dan warnanya. Setelah semuanya benar, jalankan `npm run buat -- <nama>` untuk render penuh dan suara.
9. **Jalankan dari PowerShell atau terminal biasa.** Microsoft Edge langsung menutup diri di dalam sandbox Bash milik Claude Code.
10. **Kerja paralel.** Satu pekerjaan video hanya menulis ke `animasi/proyek/<nama>/`, `animasi/hasil/video/<nama>.mp4`, dan `animasi/hasil/*/<nama>/`. Jangan mematikan proses yang tidak kamu mulai sendiri.

## Keluaran setiap video

Tata letak ditentukan di satu tempat, `alat/jalur.mjs`. Tidak ada berkas lepas di `hasil/`.

- `hasil/video/<nama>.mp4`: video final bersuara; satu-satunya video per animasi.
- `hasil/gambar/<nama>/lembar.png`: lembar periksa. Di folder yang sama: `t3.png` (hasil `--jepret 3`) dan `gelombang.png` (gelombang suara).
- `hasil/kerja/<nama>/`: bahan antara, boleh dihapus kapan saja. Isinya `bisu.mp4` (render tanpa suara), `audio.wav`, dan `peristiwa.json` (daftar peristiwa untuk suara).

## Alur kerja video baru

1. **Buat folder.** `npm run baru -- <nama> --format indikator --judul "..."` (video 21 detik seri lama), `--format evidence --judul "..."` (video 31 detik lima bagian dengan kuis: Gejala, sebab, Ikhtiar atau Pandangan, Kuis, Kartu akhir), atau `--format kosong` untuk format bebas.
2. **Petakan brief ke kit.**
   - Teks → opsi format, misalnya `formatIndikator({ nomor, kategori, judul, cermin, langkah, ajakan })`.
   - Dunia → `dunia<Nama>(v, { tanpa, posisi, opsi, ganti })` (KONTRAK §7).
   - Benda → pembuat di `benda/`; cari di katalog atau `docs/benda-*.md`.
   - Adegan → gerak standar (`muncul`, `jalan`, `klikEmas`, `denyutCermin`, ...) dengan waktu dari brief.
   - Yang belum ada di kit → `benda-lokal.js` di folder video.
3. **Periksa.** `npm run buat -- <nama> --periksa`, lalu lihat `hasil/gambar/<nama>/lembar.png`. Untuk detail kecil, tambah `--jepret 3,15` supaya dapat tangkapan resolusi penuh. Ulangi sampai zona, palet, dan tampilan benar.
4. **Render.** `npm run buat -- <nama>`, atau tambah `--gpu` supaya lebih cepat. Hasilnya `hasil/video/<nama>.mp4` (bersuara).
5. **Laporkan.** Catat penyimpangan dari brief beserta alasannya. Kendala kit dan benda lokal yang layak dipindah ke kit dicatat di `USULAN.md`.

### Prompt seri 44 indikator

**Prompt versi kit.** "Prompt Animasi Seri 44 Indikator (Versi Kit)" (format evidence, kit 1.2.0 ke atas; Prompt 00 adalah pekerjaan satu kali yang menambahkan format itu ke kit) ditulis untuk kit ini. Semua bagiannya (A sampai K) dikerjakan seperti tertulis: pakai `npm run baru -- <nama> --format evidence`, `formatEvidence`, `jadwalEvidence`, dan `segmenKuis` (dipanggil paling akhir; lihat `docs/halaman.md`, `docs/inti.md`, `docs/gerak.md`, dan KONTRAK §8). Tabel di bawah **hanya berlaku untuk prompt seri lama** (format indikator 21 detik).

**Prompt seri lama.** Prompt ini ditulis sebelum kit ada, jadi sebagian isinya sudah dikerjakan kit. Baca semuanya, tetapi kerjakan hanya yang belum ditangani kit.

| Bagian prompt | Ditangani oleh |
|---|---|
| A. Tugas dan aturan teknis | Kontrak halaman dan `buatVideo()`. Aturan "salin, jangan impor lintas folder" digantikan aturan pakai nomor 2 |
| B. Kanvas, zona, warna | `formatIndikator` dan tema bawaan |
| C. Satuan, koordinat, kamera | `titik()` dan `jadwalIndikator()`. Video hanya mengisi fokus dan tinggi yang disebut brief |
| D. Bahan, figur, gerak standar | `inti/bahan.js`, `pion`, dan `gerak/standar.js` |
| E. Teks di layar | Opsi format; isinya dipakai apa adanya, kecuali pil ajakan: selalu `ahmadzulfikar.com/kuis`, bukan `/indikator/NN` (bawaan format) |
| F. Dunia dan benda | Dunia dasar kit, ditambah "Penyesuaian dunia" dari brief |
| G. Adegan per bagian | Ditulis di `adegan.js`; ini pekerjaan utama setiap video |
| H, I. Keadaan akhir, larangan | Format dan pemeriksaan `buat` |
| J. Pemeriksaan hasil | Lembar periksa, ditambah pemeriksaan khusus yang disebut brief |

## Peta dokumen

| Dokumen | Isi |
|---|---|
| `KONTRAK.md` | Antarmuka antarmodul: halaman, peristiwa bunyi, zona, benda, alat, dunia |
| `docs/inti.md`, `docs/halaman.md`, `docs/gerak.md` | Mesin, tema, kamera, bahan; teks dan format; gerak standar |
| `docs/benda-*.md` | Semua pembuat benda beserta opsi dan bagiannya |
| `docs/dunia-*.md` | Dunia dasar, titik bernama, dan selisihnya dari prompt |
| `docs/suara.md`, `docs/alat.md`, `docs/katalog.md` | Bunyi; perintah `buat` dan `baru`; halaman katalog |

## Kustomisasi

| Lapis | Yang bisa diatur |
|---|---|
| Tema | Semua warna palet, lewat `buatTema()` |
| Ukuran | 1080×1920 (Reels, bawaan), 1080×1350 (feed), 1080×1080, atau ukuran lain lewat `window.UKURAN` |
| Format | Preset `indikator` dan `evidence`, atau rakit sendiri dari komponen halaman (kepala, keterangan, alur langkah, panel, kartu akhir) |
| Kamera | Jadwal tinggi frustum dan titik fokus, lewat keyframe (`jadwalKamera`, `jadwalIndikator`, `jadwalEvidence`) |
| Dunia | Pilih dunia dasar, lalu sembunyikan, pindahkan, atau tambah benda |
| Benda | Ukuran, warna, varian (misalnya pion duduk, pudar, bertangan, bercincin) |
| Gerak | Waktu, durasi, kecepatan, lintasan |
| Suara | Ganti, tambah, atau matikan bunyi per peristiwa |

## Mengubah kit

- **Kompatibel ke belakang.** Tambahkan opsi baru, jangan mengubah perilaku bawaan, karena video lama akan berubah bila dirender ulang.
- **Catat setiap perubahan.** Naikkan nomor di `VERSI` dan catat perubahannya di `CHANGELOG.md`.
- **Uji sesudah mengubah.** Jalankan `npm run buat -- kit/katalog --periksa` (semua benda dan dunia) dan `node kit/katalog/uji-bloom.mjs`. Lalu render `animasi/proyek/contoh-kit/` dan pastikan hasilnya identik dengan sebelum perubahan. Untuk video lain, bandingkan MD5 `hasil/gambar/<nama>/lembar.png` dan `hasil/kerja/<nama>/peristiwa.json` sebelum dan sesudah. Kepala lembar mencetak versi kit, jadi MD5 lembar berubah begitu `VERSI` dinaikkan; bandingkan sebelum menaikkan `VERSI`, atau bandingkan piksel di bawah kepala lembar (y ≥ 125).
