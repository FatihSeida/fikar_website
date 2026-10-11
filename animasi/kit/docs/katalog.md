# katalog

`kit/katalog/` adalah halaman yang menampilkan semua benda kit (`DAFTAR_BENDA`) dan semua dunia kit (`DAFTAR_DUNIA`), satu halaman per detik. Gunanya dua. Pertama, untuk melihat apa saja yang tersedia sebelum menulis adegan. Kedua, untuk memastikan tidak ada yang rusak sesudah kit diubah (README, bagian "Mengubah kit"). Halaman ini memenuhi kontrak halaman (KONTRAK §2), jadi alat `buat` bisa menangkapnya seperti video.

| Berkas | Isi |
|---|---|
| `katalog/index.html` | Kerangka halaman dan gaya kepala katalog |
| `katalog/katalog.js` | Tata letak halaman, parameter URL, `window.KATALOG` |
| `katalog/uji-bloom.mjs` | Uji bloom untuk semua benda dan dunia |

## Membuka di server pratinjau

Dari `animasi/` lewat PowerShell:

```
npm run buat -- kit/katalog --pratinjau
```

Buka alamat yang dicetak, misalnya `http://localhost:5180/kit/katalog/`. Port bisa 5181 atau lebih bila 5180 sedang dipakai proses lain. Tanpa parameter, halaman berganti setiap detik. `?t=7.5` membekukan halaman ke-8. Parameter bisa digabung, misalnya `?keadaan=denyut&t=0.5`. Cara lama `node rekam.mjs --pratinjau kit/katalog` juga bisa.

## Isi halaman

- **Halaman benda.** Benda dikelompokkan per kategori, urut seperti `DAFTAR_BENDA`. Satu halaman memuat paling banyak 12 benda (3 kolom × 4 baris, sel 350 × 405 px). Kategori yang lebih panjang dibagi rata. Bawaannya ada 12 halaman benda.
  - Setiap benda dibuat dari `contoh`-nya, diskalakan terhadap titik asalnya supaya kotak layarnya muat di 300 × 284 px, lalu digeser di tanah ke tengah sel.
  - Di bawah setiap benda ada label nama dan label mikro `×s`, yaitu skala katalog. ×1 berarti ukuran asli pada H 16.
  - Label milik benda sendiri tidak ikut diskalakan, jadi pada benda yang diperkecil, label itu tampak besar.
  - Kamera halaman benda memakai H 16 dengan fokus `titik(0, 0)` di tengah layar. Zonanya seluruh layar.
- **Halaman dunia.** Ada satu halaman untuk setiap dunia, dibangun dengan `buat(v, {})`.
  - Kamera memakai `d.fokus` dan `d.H`. Piksel fokus (540, 1010) dan zona y 600–1440 diambil dari format indikator, dan zonanya digambar sebagai garis putus.
  - Label mikro di setiap benda adalah kuncinya di `d.benda`. Kepala halaman memuat jumlah benda, H, dan nama `d.titik`.
  - `periksaZona` memakai zona ini, sehingga `buat --periksa` melaporkan benda dunia yang keluar zona.
- **Galat.**
  - Dunia yang masih stub (galatnya berisi "belum dibuat") tampil sebagai pesan "Dunia … belum dibuat" dan hanya memberi `console.warn`.
  - Galat dunia lainnya, benda yang gagal dibuat dari `contoh`-nya, serta nama atau keadaan yang tidak dikenal memberi `console.error`. Akibatnya `buat` gagal dengan keras.
  - Benda yang gagal ditandai label abu `GAGAL: …` di selnya.

`window.KATALOG` berisi `{ halaman: [{ judul, pesan, isi: [{ nama, sel: { x0, y0, x1, y1 } }] }], gagal: [{ nama, pesan }] }`. `sel` adalah kotak sel dalam piksel layar, yang berguna untuk memotong tangkapan per benda.

## Parameter URL

| Parameter | Isi |
|---|---|
| (tanpa) | Semua halaman benda, lalu semua dunia |
| `?keadaan=emas\|nyala\|denyut\|abu\|pudar` | Keadaan itu pada semua benda dan semua benda dunia, dengan nilai penuh. `nyala` = puncak `klikEmas` (emas 1, nyala 1.4). `denyut` statis di puncaknya (1) |
| `?benda=<nama>` | Satu benda besar (kotak 900 × 1170 px) dengan kategori, skala, dan ringkasan `contoh` |
| `?dunia=<nama>`, `?dunia=semua` | Satu dunia, atau semua dunia tanpa halaman benda |
| `?hanya=<nama>` | Halaman tetap sama, tetapi hanya benda itu yang dibuat, di sel dan ukurannya sendiri. Untuk uji per benda |
| `?bloom=0` | Tanpa `UnrealBloomPass` |

## Menangkap dengan `buat`

```
npm run buat -- kit/katalog --periksa
```

Nama di `hasil/` memakai `kit-katalog` (lihat `alat.md`, bagian halaman di folder bertingkat).

- `hasil/gambar/kit-katalog/lembar.png` berisi 18 titik (12 halaman benda, 6 dunia) dalam susunan 6 × 3. Seluruh pustaka ada dalam satu gambar, dan nama benda masih terbaca dengan sekali `Read`.
- Untuk melihat satu halaman lebih dekat, tambahkan `--titik 7.5`. `KIT.titikPeriksa` adalah tengah setiap halaman (0.5, 1.5, …).
- Laporan zona (halaman dunia) dan laporan warna dicetak seperti untuk video. `hasil/kerja/kit-katalog/peristiwa.json` kosong.
- Proses gagal (kode 1) bila ada `console.error`.

`buat` tidak meneruskan parameter URL. Keadaan lain dilihat lewat pratinjau atau lewat `uji-bloom.mjs --lembar`.

## Uji bloom

Aturan palet: yang boleh berpendar hanya emas. Pada keadaan biasa, denyut, abu, dan pudar, bloom tidak boleh mengubah satu piksel pun.

```
node kit/katalog/uji-bloom.mjs [biasa,denyut,abu,pudar] [--izinkan lentera] [--lembar]
```

1. Setiap halaman ditangkap dengan bloom dan dengan `?bloom=0`, lalu piksel yang berbeda dipetakan ke sel benda atau ke halaman dunia.
2. Benda yang selnya berubah diuji sendirian lewat `?hanya=` (dua kali, diambil yang terkecil), karena pendar satu benda meluber ke sel tetangganya. Uji per benda sengaja tidak memakai `?benda=`. Perbesaran sampai ×12 membuat kilau tepi bulat kertas melewati ambang, padahal pada ukuran wajar aman.
3. Hasilnya `luber` (sendirian 0 piksel), `emas` (berpendar tetapi ada di `--izinkan`, bawaannya `lentera` karena contohnya menyala emas), atau `LANGGAR`. Beda di halaman dunia dan beda di luar sel pada halaman tanpa benda berpendar juga `LANGGAR`. Kode keluar 1 bila ada pelanggaran atau galat konsol.
4. `--lembar` menulis `hasil/gambar/kit-katalog/<keadaan>-lembar.png` (semua halaman, skala 0.4) untuk dilihat.

Setiap perbandingan memakai browser baru dan server tanpa HMR. Browser yang sudah membuka puluhan halaman WebGL, atau GPU yang sedang dipakai render lain, kadang menggambar sedikit berbeda. Uji ulang di langkah 2 menyaring beda palsu itu. Satu putaran empat keadaan memakan waktu sekitar 2 menit.

Hasil pada kit 0.5.0 (2026-10-10): abu dan pudar 0 piksel. Biasa dan denyut hanya mengenai `lentera` (emas, diizinkan) beserta luberannya ke sembilan tetangga dan 11 piksel di luar sel. Hasil akhirnya LULUS. Sebelum perbaikan denyut di inti, keadaan denyut membuat keenam figur dan `papanSasaran` berpendar (Δ sampai 131), dan pendarnya meluber ke tetangganya.

## Kapan dijalankan

Sesudah mengubah inti, halaman, benda, atau dunia, jalankan `npm run buat -- kit/katalog --periksa` dan lihat lembarnya. Bila bahan, cahaya, warna, atau benda berubah, jalankan juga `node kit/katalog/uji-bloom.mjs`. Setelah itu, periksa `contoh-kit` (README, bagian "Mengubah kit").
