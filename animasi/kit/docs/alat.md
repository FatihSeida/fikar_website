# Modul Alat

Modul Alat adalah alur baris perintah yang mengubah folder video menjadi MP4 yang sudah diperiksa, dirender, dan bersuara, cukup dengan satu perintah. Tujuannya mempercepat produksi. Agen tidak perlu lagi mengambil tangkapan layar satu per satu lalu membaca gambarnya satu per satu, karena alat ini memberi **satu lembar periksa** ditambah **pemeriksaan otomatis**.

| Berkas | Isi |
|---|---|
| `alat/buat.mjs` | Periksa, render paralel, suara, dan laporan (KONTRAK §6) |
| `alat/baru.mjs` | Membuat `animasi/proyek/<nama>/` dari templat |
| `alat/jalur.mjs` | Tata letak `hasil/` dan pencari folder video; dipakai `buat`, `buat-suara`, `uji-bloom`, dan `rapikan` |
| `alat/peramban.mjs` | Memilih peramban (Edge, lalu Chromium cadangan) dan memeriksa ffmpeg; lihat bagian Peramban |
| `animasi/rapikan.mjs` | `npm run rapikan`: memindahkan berkas lepas di `hasil/` ke tata letak (lihat bagian Video lama) |
| `alat/templat/<format>/` | Berkas templat, milik modul Fondasi |
| `animasi/proyek/_uji-alat/` | Fikstur uji regresi untuk kedua alat (lihat bagian akhir) |

Semua perintah dijalankan dari `animasi/` lewat PowerShell atau terminal biasa. Edge langsung menutup diri di dalam sandbox Bash milik Claude Code.

## Perintah

```
npm run baru -- <nama> [--format indikator|kosong|evidence] [--judul "Judul video"]
npm run buat -- <nama> --periksa [--titik 1,2.5,8] [--jepret 3,5.5]
npm run buat -- <nama> --jepret 3,5.5
npm run buat -- <nama> [--titik ...] [--paralel N]
npm run buat -- <nama> --pratinjau
npm run rapikan [-- --coba]
```

`npm run buat -- …` sama dengan `node kit/alat/buat.mjs …`, dan `npm run baru -- …` sama dengan `node kit/alat/baru.mjs …`.

| Opsi | Arti |
|---|---|
| `--periksa` | Berhenti sesudah tahap periksa: lembar, laporan zona dan warna, `peristiwa.json` |
| `--pratinjau` | Hanya menjalankan server Vite lalu mencetak alamatnya (tambahkan `?t=12` untuk membekukan detik 12) |
| `--titik 1,2.5,8` | Detik untuk lembar periksa. Bawaannya `KIT.titikPeriksa`, atau 8 titik merata bila halaman tidak menyediakannya |
| `--jepret 3,5.5` | Tangkapan resolusi penuh di detik itu: `hasil/gambar/<nama>/t3.png`, `hasil/gambar/<nama>/t5.5.png`. Tanpa `--periksa` hanya ini yang dikerjakan (tanpa lembar, laporan, dan render); dengan `--periksa`, sesudah lembar. Lihat bagian Jepret |
| `--paralel N` | Jumlah browser yang merender bersamaan, 1–16. Bawaannya 3 (lihat bagian Render) |

Cara kerja yang disarankan: jalankan `--periksa`, lihat `hasil/gambar/<nama>/lembar.png` dan laporannya, perbaiki adegan, ulangi. Setelah semuanya benar, jalankan tanpa `--periksa`. Tahap periksa selalu ikut berjalan, jadi lembar dan laporannya selalu sesuai dengan video yang dirender.

## Keluaran

Tata letak `hasil/` ditentukan di `alat/jalur.mjs`. Tidak ada berkas lepas di `hasil/`, dan hanya satu video per animasi: yang bersuara.

| Berkas | Dibuat oleh |
|---|---|
| `hasil/gambar/<nama>/lembar.png` | Tahap periksa |
| `hasil/gambar/<nama>/t<detik>.png` | `--jepret` |
| `hasil/kerja/<nama>/peristiwa.json` | Tahap periksa, bila halaman punya `KIT.peristiwa` |
| `hasil/kerja/<nama>/bisu.mp4` | Render (video bisu, bahan antara) |
| `hasil/kerja/<nama>/audio.wav` | `kit/suara/buat-suara.mjs` |
| `hasil/video/<nama>.mp4` | `kit/suara/buat-suara.mjs`: video final bersuara |
| `hasil/gambar/<nama>/gelombang.png` | `kit/suara/buat-suara.mjs` |

**Nama polos dan folder video.** Video diberi nama polos (`indikator-05`), dan folder halamannya dicari di `animasi/proyek/<nama>/` lebih dulu, lalu di `animasi/<nama>/` (halaman milik kit seperti `kit/katalog`). Halaman video dibuka di `/proyek/<nama>/`.

**Halaman di folder bertingkat.** `<nama>` boleh berupa jalur di bawah `animasi/`, misalnya `npm run buat -- kit/katalog --periksa` untuk `animasi/kit/katalog/index.html`. Garis miring balik dari PowerShell (`kit\katalog`) diubah menjadi `/`. Halaman dibuka di `/kit/katalog/`, sedangkan nama di `hasil/` memakai `-` sebagai pengganti `/`: `hasil/gambar/kit-katalog/lembar.png`, `hasil/video/kit-katalog.mp4`, dan seterusnya. Langkah suara menerima nama berkas itu (`kit-katalog`), jadi `suara.js` di folder bertingkat tidak ikut terbaca. Nama tanpa garis miring berjalan persis seperti sebelumnya.

Selama render ada folder sementara `hasil/kerja/<nama>/sementara-<pid>/`. Folder ini dihapus di akhir, juga bila proses gagal atau dibatalkan dengan Ctrl+C. Bila proses dimatikan paksa, misalnya keluarannya dipotong dengan `Select-Object -First`, folder ini tertinggal dan dihapus otomatis oleh render berikutnya untuk video yang sama.

## Alur `buat`

1. **Server.** Vite berakar di `animasi/` dengan opsi yang sama seperti `rekam.mjs`: `configFile: false`, `css.postcss: {}`, `cacheDir` `node_modules/.vite/<nama>`, `optimizeDeps.entries` `[proyek/<nama>/index.html]`, port 5180 (atau port berikutnya yang kosong).
2. **Halaman.** Edge tanpa jendela (playwright-core, `channel: "msedge"`) membuka `/proyek/<nama>/?rekam=1`. Batas waktu `goto` dan `window.siap` masing-masing 90 detik, karena 30 detik pernah gagal saat mesin sibuk. Alat membaca `DURASI`, `FPS` (bawaan 30), dan `UKURAN` (bawaan 1080×1920). Bila `UKURAN` berbeda, ukuran viewport diubah lalu halaman dimuat ulang. Lebar dan tinggi harus genap karena video memakai yuv420p.
3. **Periksa.** Untuk setiap titik: `tampilkan(t)`, tangkapan layar, lalu `KIT.periksaZona(t)`. Tangkapan dianalisis warnanya, lalu disusun menjadi lembar. `KIT.peristiwa()` ditulis ke JSON.
4. **Render** (tanpa `--periksa`). Rentang frame dibagi ke N browser. Setiap browser mengirim PNG ke ffmpeg-nya sendiri dan menghasilkan satu segmen. Segmen lalu disambung tanpa enkode ulang menjadi `hasil/kerja/<nama>/bisu.mp4`. Jumlah frame hasil diperiksa dengan ffprobe dan harus sama dengan `round(DURASI × FPS)`.
5. **Suara.** Menjalankan `node kit/suara/buat-suara.mjs <nama>`. Langkah ini dilewati dengan peringatan bila skripnya belum ada atau bila halaman tidak punya `KIT.peristiwa`, sehingga video lama tidak kehilangan `hasil/video/<nama>.mp4` buatan alurnya sendiri. Langkah ini membaca `kerja/<nama>/peristiwa.json` dan `kerja/<nama>/bisu.mp4`, lalu menulis `kerja/<nama>/audio.wav`, `video/<nama>.mp4`, dan `gambar/<nama>/gelombang.png`.
6. **Laporan akhir.** ffprobe untuk `bisu.mp4` dan `video/<nama>.mp4` (codec, ukuran berkas, jumlah frame, durasi, audio), waktu render, dan laporan modul Suara (LUFS, puncak sejati, tabel sinkron). Video final yang tidak dibuat ulang di proses ini diberi tanda `LAMA`.

**Gagal dengan keras.** Seperti `rekam.mjs`, proses gagal dengan kode keluar 1 bila ada `pageerror`, `console.error` (selain "Failed to load resource"), respons 4xx/5xx (favicon diabaikan), halaman crash, atau halaman dimuat ulang di tengah proses (biasanya karena Vite baru menemukan dependensi; cukup jalankan ulang). Langkah suara yang gagal juga membuat kode keluar 1, tetapi laporan akhir tetap dicetak. Server, semua browser, proses ffmpeg, dan folder sementara selalu dibersihkan.

Laporan zona dan warna tidak menggagalkan proses. Keduanya hanya laporan yang perlu dibaca.

## Peringatan kit

Pemeriksaan baris format (`[kit] teks "…" 4 baris, maksimal 3`, label lebih dari 2 baris, kalimat `ikhtiar` lebih dari 3 baris, kartu pertanyaan lebih dari 3 baris) dan peringatan lain dari kit (mis. `fokusUntuk` benda tidak muat) ditulis lewat `console.warn` berawalan `[kit]` di halaman. Sebelum 1.2.0 `buat` hanya melaporkan `console.error`, jadi peringatan ini tidak pernah terlihat. Sejak 1.2.0 `buat` mengumpulkan semua `console.warn` berawalan `[kit]` (tanpa duplikat) dan mencetaknya:

```
Peringatan kit (2; tidak menggagalkan proses)
  [kit] fokusUntuk: benda 1327×799 px tidak muat di zona 1080×840 px pada H 11.
  [kit] teks "Kalimat yang terlalu panjang…" 4 baris, maksimal 3.
```

- Bagian ini dicetak sebelum "Ringkasan periksa" (juga untuk `--jepret` tanpa `--periksa`), hanya bila ada peringatan. Ringkasan punya baris `peringatan` (`tidak ada`, atau jumlahnya).
- Peringatan **tidak menggagalkan proses** dan tidak mengubah kode keluar, lembar, `peristiwa.json`, atau berkas hasil lain. Baca dan perbaiki sebelum render penuh: prompt indikator mensyaratkan tidak ada teks lebih dari 3 baris.
- Hanya peringatan berawalan `[kit]` yang dikumpulkan; `console.warn` lain di halaman diabaikan.

## Lembar periksa

`hasil/gambar/<nama>/lembar.png` adalah satu gambar yang memuat seluruh video:

- Baris kepala berisi nama, durasi, fps, ukuran, jumlah dan asal titik, versi kit, lalu ringkasan: jumlah pelanggaran zona, putusan warna, dan jumlah peristiwa.
- Setiap tangkapan diperkecil setengah (540×960 untuk 9:16) dengan bingkai abu terang, jadi tepi frame selalu terlihat.
- Di atas setiap ubin tertulis `t <detik> s  f <frame>`. Di kanan atasnya ada tanda `ZONA n` (magenta) dan `merah 0.67%` (biru muda) bila titik itu melanggar.
- Pada ubin yang melanggar zona, garis putus putih menandai zona dan kotak magenta menandai benda yang keluar, lengkap dengan namanya. Kotak dijepit ke dalam ubin, jadi benda yang sudah di luar layar tampil sebagai garis di tepi tempat ia keluar.
- Warna terlarang ditandai kotak putus biru muda.
- Jumlah kolom dipilih supaya lembar sedikit melebar: 8 titik menjadi 4×2, 10 titik 5×2, 12 titik 6×2, dan 16 titik 6×3.

Untuk 8 titik pada 1080×1920, lembarnya sekitar 2300×2200 piksel dan 1 MB. Satu kali `Read` sudah cukup untuk membaca judul, keterangan, dan kartu akhir.

## Jepret

Lembar periksa memperkecil setiap tangkapan setengahnya, jadi detail 17 px (label mikro, tanda di kertas, bola aliran, celah retak) sulit dibaca. `--jepret` menulis tangkapan resolusi penuh (mis. 1080×1920) dari halaman yang sama, tanpa skrip Playwright atau PIL sendiri:

```
npm run buat -- indikator-05 --jepret 3,5.5,15.35          # hanya tangkapan, ±4 s termasuk membuka Edge
npm run buat -- indikator-05 --periksa --jepret 15.35      # lembar dan laporan, lalu tangkapan
```

- Nama berkas memakai angka sesudah diurai: `3` dan `3.0` menjadi `t3.png`, `5.5` menjadi `t5.5.png`, sama dengan `rekam.mjs --cuplik` (yang menulis berkas lepas `<nama>-t3.png`; lihat bagian Video lama). Berkas lama bernama sama ditimpa.
- Detik di luar 0–durasi diabaikan dengan peringatan. Detik tidak harus tepat di frame; `tampilkan(t)` menggambar keadaan tepat pada `t`.
- Tangkapannya PNG dari CDP yang sama dengan render (±0,4–0,6 MB per tangkapan 1080×1920), tanpa bingkai, label, atau kotak zona. Untuk memperbesar satu bagian, potong berkas ini.
- `peristiwa.json` hanya ditulis bila `--periksa` ikut.

## Laporan zona

`KIT.periksaZona(t)` dipanggil sesudah tangkapan di setiap titik. Hasilnya dicetak sebagai tabel ringkas dengan kolom `t`, `sumber`, `keluar`, dan `kotak (px)`, paling banyak 30 baris. Halaman tanpa `window.KIT.periksaZona` dilewati dengan catatan.

## Laporan warna

Setiap tangkapan dipindai piksel demi piksel dalam HSL. Sebuah piksel masuk kategori bila hue-nya ada di rentang kategori itu dan saturasi (S), kecerahan (L), serta kroma (C = maks − min, 0–1) memenuhi batasnya:

| Kategori | Hue | S ≥ | L | C ≥ |
|---|---|---|---|---|
| merah | 345°–12° | 0,45 | 0,18–0,88 | 0,20 |
| oranye | 12°–33° | 0,50 | 0,20–0,85 | 0,20 |
| biru | 190°–255° | 0,35 | 0,18–0,88 | 0,15 |

- **Hanya piksel inti yang dihitung**, yaitu piksel yang kedelapan tetangganya juga masuk kategori yang sama. Tepi antialias teks gelap di atas emas (misalnya pil kartu akhir) menghasilkan piksel ber-hue 15–34° yang tipis. Tanpa saringan ini, piksel itu akan terbaca oranye.
- Titik dinyatakan **LANGGAR** bila satu kategori mencapai **0,01%** piksel inti (±207 piksel pada 1080×1920). Jumlah di antara 0,001% dan 0,01% dicetak sebagai `sedikit`.
- Laporan per titik memuat persentase, kotak lokasi (kuantil 1–99% piksel inti), dan letak kasarnya (misalnya `tengah kanan`).
- **Penyetelan.** Ambang ini disetel pada 121 tangkapan video seri yang sudah ada. Emas `hsl(42,52%,58%)` dan `hsl(42,80%,52%)` dengan bloom terbaca pada hue 34–60° (bayangan emas berpijar turun sampai ±34°), dan zamrud tidak pernah di atas ±190°. Dengan ambang ini, semua video seri bersih kecuali poster bergambar toa merah di `ikhtiar-hmi-evidence` detik 48, yang memang merah. Interior hangat di video yang sama menyentuh 0,005% (`sedikit`).
- **Mengganti aturan.** Halaman bisa menyediakan `window.KIT.paletTerlarang` untuk menggantikan seluruh daftar:

  ```js
  window.KIT.paletTerlarang = [
    { nama: "merah", hue: [345, 12] },                       // medan yang kosong: sMin 0.45, lMin 0.18, lMax 0.88, cMin 0.2
    { nama: "ungu", hue: [260, 300], sMin: 0.3, cMin: 0.15 },
  ];
  ```

  `hue` adalah `[dari, sampai]` dalam derajat. Rentang yang melewati 0° ditulis dengan `dari > sampai`. Array kosong mematikan pemeriksaan warna.

## Berkas peristiwa

`hasil/kerja/<nama>/peristiwa.json` berbentuk `{ durasi, fps, peristiwa }`, dengan satu peristiwa per baris, sesuai `docs/suara.md`. Isi `peristiwa` adalah hasil `KIT.peristiwa()` apa adanya. Bila urutannya tidak menurut `t`, alat memberi peringatan lalu mengurutkannya. Peristiwa di luar `0 ≤ t < durasi` juga diberi peringatan, karena modul Suara akan mengabaikannya.

## Peramban

`alat/peramban.mjs` adalah satu-satunya tempat alat kit membuka browser (`buat`, `rekam.mjs`, `katalog/uji-bloom.mjs`; folder `proyek/` lama tidak ikut). Urutannya:

1. **Microsoft Edge** (`channel: "msedge"`): perilaku di PC Windows, tidak berubah.
2. **Chromium kelolaan Playwright** (`npx playwright-core install chromium`, dari `animasi/`).
3. **Chromium atau Chrome sistem** di jalur Linux umum (`/usr/bin/chromium`, `/usr/bin/google-chrome`, dan sejenisnya).

- Nomor 2 dan 3 berjalan dengan WebGL perangkat lunak (SwiftShader: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --enable-webgl`), karena mesin tanpa GPU, seperti sesi cloud Claude Code, tidak punya pilihan lain. Adegan tampil benar, tetapi pikselnya sedikit berbeda dari Edge dengan GPU dan renderernya jauh lebih lambat: `indikator-05` (630 frame, 3 halaman) 247 s di i7-13620H dengan Chromium cadangan, lawan 33 s dengan Edge. `--gpu` hanya berlaku untuk Edge.
- Satu baris `Peramban: …` dicetak sekali per proses. `KIT_PERAMBAN=msedge`, `chromium`, atau jalur lengkap ke `chrome`/`chromium` memaksa satu pilihan tanpa cadangan (gagal dengan pesan bila tidak bisa dibuka).
- Sebelum render penuh, `buat` dan `rekam.mjs` memeriksa `ffmpeg` dan `ffprobe`. Bila tidak ada, proses berhenti dengan petunjuk `apt-get install -y ffmpeg`.
- Di sesi cloud, `animasi/siapkan-cloud.sh` (dipanggil hook SessionStart di `.claude/settings.json`) memasang npm, ffmpeg, dan Chromium. Unduhan Chromium memerlukan akses jaringan environment "Full".

## Render paralel

- **Tangkapan layar** memakai CDP `Page.captureScreenshot` dengan `optimizeForSpeed: true`. Pikselnya identik dengan `page.screenshot()` milik `rekam.mjs` (sudah diuji), tetapi sekitar 2,2× lebih cepat (57 ms lawan 126 ms per frame).
- **Satu browser per bagian.** Beberapa halaman dalam satu browser berbagi proses GPU, sehingga tangkapannya antre. Pada fikstur, tangkapan saja (tanpa enkode) naik dari 17 ke 22 frame/s bila memakai 1→3 halaman dalam satu browser, tetapi naik ke 32 frame/s bila memakai 1→3 browser. Pada `indikator-01` dengan 1→4 browser, angkanya 15→32 frame/s.
- **Penyambungan tanpa enkode ulang.** Setiap bagian dienkode dengan pengaturan yang sama seperti `rekam.mjs` (`libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart`), lalu disambung dengan concat demuxer `-c copy`. Hasilnya tepat frame demi frame: `proyek/_uji-alat/periksa-urutan.mjs` membaca nomor frame dari setiap frame MP4 dan menemukan 0…N−1 berurutan, dengan PTS berjarak rata.
- **Ukuran waktu di mesin ini** (i7-13620H, Intel UHD, 2026-10-10). Waktu yang dicatat adalah waktu render, dari membuka browser sampai MP4 jadi:

  | Video | rekam.mjs | `--paralel 1` | 2 | 3 | 4 |
  |---|---|---|---|---|---|
  | Salinan `indikator-01`, 630 frame | 97 s (seluruh proses) | 44–46 s | 29 s | 25,5–28 s | – |
  | Fikstur 20 s, 600 frame (median) | – | 34,8 s | 26,9 s | 24,4 s | 23,9 s |

  `--paralel 3` sekitar 1,65× lebih cepat daripada serial pada adegan seri, dan proses `buat` utuh (periksa, lembar, render) sekitar 3× lebih cepat daripada `rekam.mjs`. Bawaannya 3 karena selalu sedikit lebih cepat daripada 2. Nilai 4 hanya sedikit lebih baik, dan pada mesin ini GPU terintegrasi menjadi batasnya. Untuk video sangat pendek (±4 s), waktu membuka browser mendominasi, jadi paralel hampir tidak terasa.
- Render paralel mengandalkan kontrak `tampilkan(t)`: keadaan pada detik `t` tidak boleh bergantung pada frame sebelumnya. Halaman yang menyimpan keadaan antar-frame akan rusak di sambungan segmen.

## `baru`

`node kit/alat/baru.mjs <nama> [--format indikator|kosong|evidence] [--judul "..."]`

- Menyalin `kit/alat/templat/<format>/` (termasuk subfolder) ke `animasi/proyek/<nama>/`, lalu mengganti `__NAMA__` dan `__JUDUL__` di berkas teks. Templat mengimpor `../../kit/index.js` karena folder video berada dua tingkat di bawah `animasi/`.
- Format bawaannya `indikator`; `evidence` membuat video lima bagian 31 detik (dunia Kader, teks contoh, `segmenKuis`; lihat `halaman.md`). Judul bawaannya dibentuk dari nama: `indikator-05` menjadi `Indikator 05`.
- Nama harus huruf kecil, angka, `-`, atau `_`, dan tidak boleh `kit`, `hasil`, atau `node_modules`. Alat menolak bila folder tujuan sudah ada.
- Judul diloloskan menurut jenis berkas, karena placeholder bisa berada di dalam string JS (`judul: "__JUDUL__"`) maupun di teks HTML (`<title>`). Di `.js`/`.mjs`, karakter `\ " ' \` ${` diloloskan. Di `.html`/`.svg`, karakter `& < > "` diloloskan. Di `.json` dipakai pelolosan JSON, sedangkan `.css`, `.md`, dan `.txt` dibiarkan apa adanya. Berkas lain disalin byte demi byte.
- `--templat <folder>` memakai akar templat lain. Opsi ini untuk uji.
- Catatan: PowerShell 5.1 membuang tanda kutip ganda di dalam argumen program. Bila judul berisi `"`, jalankan dari cmd atau Bash, atau ubah judulnya di berkas sesudah dibuat.

## Fikstur uji `_uji-alat`

`animasi/proyek/_uji-alat/` adalah halaman tiruan yang memenuhi kontrak. Jangan dihapus. Isinya:

- Durasi 4 s, 30 fps, isi three.js dengan bayangan dan bloom seperti video seri: kotak emas, bola emas berpijar, tabung zamrud berpijar, dan kerucut "pelari".
- Teks `t … s · f …` dan kode biner 12 bit nomor frame di kiri atas.
- `KIT.titikPeriksa` (8 titik), `KIT.peristiwa` (6 peristiwa), dan `KIT.periksaZona`. Pelari sengaja keluar zona kanan pada detik 2,6–3,7.
- Bercak merah 120×120 px di x 860–980, y 760–880 pada detik 1,0–2,6.
- `templat/uji/` adalah templat kecil yang mandiri, tanpa kit, untuk menguji `baru.mjs`.

Uji regresi sesudah mengubah alat:

```
npm run buat -- _uji-alat --periksa
#   zona: 3 pelanggaran (pelari, kanan, t 2.70/3.20/3.70)
#   warna: LANGGAR merah di t 1.20/1.70/2.20, ±0.67%, x 862–977 y 762–877; emas dan zamrud tidak tertangkap
#   peristiwa: 6
npm run buat -- _uji-alat
node proyek/_uji-alat/periksa-urutan.mjs   # LULUS: 120 frame, urutan tepat
npm run baru -- uji-baru-tmp --templat proyek/_uji-alat/templat --format uji --judul "Uji 'kutip' & <tag>"
npm run buat -- uji-baru-tmp --periksa     # halaman melempar galat bila judul JS dan HTML tidak sama
```

Hapus `animasi/proyek/uji-baru-tmp/`, `hasil/*/uji-baru-tmp*`, dan `hasil/*/_uji-alat*` sesudahnya. Untuk menguji ukuran lain, ubah `UKURAN` di `proyek/_uji-alat/adegan.js` menjadi `{ lebar: 1080, tinggi: 1350 }`. Zona ikut diskalakan, dan `periksa-urutan.mjs` tetap bekerja karena kodenya ada di kiri atas. Untuk mengukur `--paralel`, naikkan `DURASI` sementara, lalu jalankan `periksa-urutan.mjs hasil/kerja/_uji-alat/bisu.mp4 <jumlah-frame>` (itu juga berkas bawaannya).

## Video lama

Video yang dibuat sebelum kit memakai perekam dan skrip suaranya sendiri: `rekam.mjs` di akar (`npm run rekam -- <nama>`), `proyek/indikator-03/rekam.mjs` dan `proyek/indikator-04/rekam.mjs`, serta `proyek/<nama>/suara.mjs`. Skrip-skrip itu masih menulis berkas lepas ke `hasil/` (`<nama>.mp4`, `<nama>-suara.mp4`, `<nama>.wav`, `<nama>-t3.png`, `<nama>-gelombang.png`, dan seterusnya). **Sesudah video lama dirender ulang, jalankan `npm run rapikan`.** Skrip itu memindahkan berkas lepas ke tata letak kit:

- `<nama>-suara.mp4` menjadi `video/<nama>.mp4`. `<nama>.mp4` menjadi `kerja/<nama>/bisu.mp4` bila sudah ada versi bersuara (lepas, atau `video/<nama>.mp4` yang berisi audio); bila tidak, ia satu-satunya versi dan menjadi `video/<nama>.mp4`.
- `<nama>.wav` menjadi `kerja/<nama>/audio.wav`. PNG masuk `gambar/<nama>/`, JSON dan TXT masuk `kerja/<nama>/`, dengan awalan `<nama>-` dibuang (`<nama>-t19.5.png` menjadi `gambar/<nama>/t19.5.png`).
- `<nama>` dikenali dari awalan terpanjang yang cocok dengan folder di `proyek/` (atau nama tambahan `kit-katalog` dan `indikator-09-14`); kalau tidak ada, dari akhiran yang dikenal (`-suara`, `-lembar`, `-gelombang`, `-peristiwa`, `-t<angka>`).
- `node rapikan.mjs --coba` mencetak seluruh pemetaan tanpa memindahkan apa pun. Berkas tidak pernah dihapus. Target yang sudah ada hanya ditimpa bila berkas sumber lebih baru. Berkas yang tidak dikenali dicetak dan dibiarkan.

Skrip suara lama (`proyek/<nama>/suara.mjs`) masih membaca video bisu dari `hasil/<nama>.mp4`; untuk menjalankannya lagi, render bisunya dulu dengan `rekam.mjs`.

## Batasan

- Oranye pekat yang hue-nya mendekati emas, misalnya `orange` CSS (#FFA500, hue 39°), tidak tertangkap. Pada rentang itu, emas berpijar dengan bloom tidak bisa dibedakan dari oranye hanya lewat hue, saturasi, dan kecerahan. `darkorange` (hue 33°) masih tertangkap.
- Warna yang hanya muncul di antara titik periksa tidak terlihat. Tambahkan titik dengan `--titik` atau `KIT.titikPeriksa`.
- Hasil render paralel tidak identik bit demi bit dengan render serial, karena setiap segmen mulai dengan keyframe baru. Pikselnya sama sebelum enkode, dan kualitasnya sama (CRF 18).
- Edge memakai GPU bawaan Windows (Intel UHD di mesin ini), seperti `rekam.mjs`.
