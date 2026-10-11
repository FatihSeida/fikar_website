# Kontrak Kit

Kontrak antarmodul kit. Setiap modul dibangun terpisah, ada yang paralel, jadi antarmuka di bawah ini mengikat. Kalau sebuah modul butuh mengubah kontrak, laporkan perubahannya; jangan diam-diam mengubah bentuknya.

## 1. Struktur dan pemilik

```
animasi/
  proyek/<nama>/      folder satu video: index.html, adegan.js, suara.js opsional, berkas lokal
  hasil/              keluaran alat: video/, gambar/<nama>/, kerja/<nama>/ (bagian 6)
  kit/
    README.md, KONTRAK.md, VERSI, CHANGELOG.md
    index.js           pintu masuk: mengekspor ulang semua yang dipakai video
    video.js           buatVideo(), perakit semua bagian                        (Fondasi)
    inti/              mesin, tema, ruang, waktu, tanah, kamera, bahan         (Fondasi)
    halaman/           kerangka.html/css, komponen teks, format/ (indikator, evidence)  (Fondasi)
    gerak/             gerak standar, pencatat peristiwa, segmenKuis (kuis.js)   (Fondasi)
    alat/templat/<format>/  berkas templat; placeholder __NAMA__ dan __JUDUL__  (Fondasi)
    alat/buat.mjs      alur periksa, render, dan suara                         (Alat)
    alat/baru.mjs      pembuat folder video dari templat                       (Alat)
    alat/jalur.mjs     tata letak hasil/ dan pencari folder video, dipakai semua alat   (Alat)
    suara/             pustaka bunyi, peta peristiwa, mastering, mux          (Suara)
    benda/             pustaka objek                                           (Benda A, B, C)
    dunia/             dunia dasar siap pakai, satu berkas per dunia            (Dunia 1, Dunia 2)
    katalog/           halaman yang menampilkan semua benda dan dunia          (Katalog)
    docs/<modul>.md    dokumentasi tiap modul, ditulis pemiliknya
```

Video contoh untuk menguji kit ada di `animasi/proyek/contoh-kit/` (Fondasi). Video dibuat di `animasi/proyek/<nama>/` dan mengimpor `../../kit/index.js`. Server Vite berakar di `animasi/`, dan halaman video dibuka di `/proyek/<nama>/` (halaman milik kit, seperti `kit/katalog`, di `/kit/katalog/`). Semua alat dan `rekam.mjs` menerima nama polos (`indikator-05`) dan mencarinya di `proyek/<nama>/` lebih dulu, lalu di `animasi/<nama>/`. `rekam.mjs` lama memakai akar yang sama dan tetap bisa merekam video kit.

## 2. Kontrak halaman video

Halaman video wajib menyediakan objek global berikut. Fungsi `buatVideo()` di kit memasangnya otomatis.

| Global | Isi |
|---|---|
| `window.DURASI` | Panjang video dalam detik |
| `window.FPS` | Frame per detik; bawaan 30 |
| `window.UKURAN` | `{ lebar, tinggi }`; bawaan `{ lebar: 1080, tinggi: 1920 }` |
| `window.siap` | Promise yang selesai setelah font dan adegan siap |
| `window.tampilkan(t)` | Menggambar keadaan tepat pada detik `t`, kanvas dan HTML, secara sinkron |
| `window.KIT.versi` | Isi baris pertama file `kit/VERSI`; bernilai `null` sampai `siap` selesai |
| `window.KIT.peristiwa()` | Daftar peristiwa bunyi; lihat bagian 3 |
| `window.KIT.periksaZona(t)` | Benda penting yang keluar zona pada detik `t`; lihat bagian 4 |
| `window.KIT.titikPeriksa` | Daftar detik untuk lembar periksa; bawaan dari format |
| `window.KIT.paletTerlarang` | Opsional. Pengganti daftar warna terlarang untuk pemeriksaan palet; bentuknya ada di `docs/alat.md` |

`tampilkan(t)` tidak boleh bergantung pada frame sebelumnya, karena render paralel melompat ke detik mana saja. `buat` memanggil `periksaZona(t)` tepat setelah tangkapan layar pada detik `t`.

Parameter URL:
- `?rekam=1`: tanpa loop `requestAnimationFrame`.
- Tanpa parameter: pratinjau berulang.
- `?t=12`: tampilan dibekukan di detik 12.

## 3. Peristiwa bunyi

`window.KIT.peristiwa()` mengembalikan array yang urut menurut `t`. Setiap anggotanya berbentuk:

```js
{ t: 12.4, jenis: "muncul", x: 0.62, kuat: 0.8, durasi: 0, nada: 0, sumber: "tabel" }
```

| Medan | Arti |
|---|---|
| `t` | Detik mulai |
| `jenis` | Salah satu jenis di daftar di bawah |
| `x` | Posisi layar horizontal, 0 (kiri) sampai 1 (kanan), untuk panning stereo. Dihitung dari proyeksi benda pada detik `t` |
| `kuat` | Kekuatan 0 sampai 1 |
| `durasi` | Detik, untuk bunyi yang berlangsung lama (0 berarti bunyi sesaat) |
| `nada` | Bilangan bulat untuk urutan yang nadanya naik, misalnya batang ke-0, ke-1, ke-2 |
| `sumber` | Nama benda, untuk laporan |
| `x1` | Opsional. Posisi layar akhir; panning bergeser dari `x` ke `x1` selama `durasi`. Berguna untuk `lempar`, `whoosh`, `aliran`, dan `garis-sambung` |
| `periode` | Opsional, untuk `denyut`. Bawaan 1.2 detik |

Aturan nilai:
- `kuat` bawaan 0.7; nilai 0 berarti bisu.
- `laci-buka`, `pintu`, dan `garis-sambung` membunyikan ketukan akhirnya pada `t + durasi`, jadi modul gerak wajib mengisi `durasi`.
- `denyut` paling pelan di `t` dan paling keras di `t + periode/2`.

Jenis peristiwa yang dikenali modul Suara:

| Kelompok | Jenis |
|---|---|
| Struktur video | `grid-nyala`, `melambat`, `kartu-akhir`, `pil` |
| Benda | `muncul`, `hilang`, `tumbuh`, `menyala`, `padam`, `retak`, `putar` |
| Hasil | `klik-emas`, `centang`, `denting` |
| Cermin | `denyut` (berdurasi) |
| Gerak figur | `langkah` |
| Lempar | `lempar`, `mendarat` |
| Kertas | `kertas`, `balon`, `label-ganti`, `cap`, `kayu`, `laci-buka`, `pintu` |
| Garis | `garis-sambung`, `garis-putus` |
| Suasana | `aliran` (berdurasi), `debu`, `gemuruh` (berdurasi), `whoosh` |

- Jenis yang tidak dikenal diabaikan dengan peringatan, tidak membuat proses gagal.
- `sumber` dibuat unik per benda (`pion`, `pion-2`, ...), karena Suara menggabungkan peristiwa dan menggilir kaki per `sumber`. Bagian berulang yang biasa digerakkan satu per satu diberi `userData.nama` bernomor mulai 1 (`petak 3`, `laci 2`), supaya `sumber` terbaca.
- Bunyi `aliran` hanya terdengar selama gerak berjalan: diam saat beku, dan tidak melewati `v.akhirAdegan` (bawaannya awal kartu akhir).
- Peristiwa struktur dari format dibuang bila ada peristiwa gerak berjenis sama dalam rentang 0.5 detik, supaya tidak berbunyi ganda.
- Video boleh menambah atau mengganti peristiwa lewat `animasi/proyek/<nama>/suara.js`:
  - `sesuaikan(peristiwa, { durasi, fps })`: mengembalikan daftar baru atau mengubah daftar di tempat. Boleh async.
  - `bunyi = { jenis: buat(s) | { buat, tingkat, ... } }`: bunyi lokal untuk jenis baru atau pengganti jenis kit. Rinciannya ada di `docs/suara.md`.

## 4. Pemeriksaan zona

`window.KIT.periksaZona(t)` mengembalikan array pelanggaran untuk benda yang ditandai penting (`userData.penting = true`):

```js
{ sumber: "komisariat", kotak: { x0, y0, x1, y1 }, zona: { x0, y0, x1, y1 }, keluar: ["kiri", "atas"] }
```

- `kotak` adalah kotak pembatas benda setelah diproyeksikan ke piksel layar.
- `zona` diambil dari format. Untuk format indikator dan evidence, zonanya x 0–1080 dan y 600–1440.
- Array kosong berarti aman.
- `userData.penting` boleh berupa fungsi `(t) => boolean` yang dievaluasi pada detik pemeriksaan, misalnya untuk benda latar yang sengaja terpotong saat kamera mendekat di Cermin.
- `userData.abaikanZona` berlaku untuk benda itu beserta seluruh isinya.

## 5. Konvensi benda

- Pembuat benda adalah fungsi `namaBenda(opsi = {})` yang mengembalikan `THREE.Group`.
- Titik asal benda ada di tengah alasnya, di permukaan tanah (y = 0). Ukurannya dalam unit dunia sesuai kamus prompt; satu unit sama dengan satu sel grid.
- Setiap benda mengisi `userData`:

  | Medan | Isi |
  |---|---|
  | `nama` | Nama benda |
  | `penting` | Bawaan `true` untuk benda utama |
  | `bagian` | Bagian yang bisa digerakkan, misalnya `{ pintu, laci: [...] }` |
  | `setelKeadaan(nama, nilai)` | Untuk keadaan seperti `"pudar"`, `"emas"`, `"denyut"`, `"padam"` |

- Warna diambil dari tema `W`. Bahan dibuat lewat `bahanPadat()` dan `bahanKaca()` dari inti, supaya aturan emas dan bloom tetap terjaga.
- Teks yang menempel pada benda selalu berupa label HTML lewat `label3D()` dari halaman, tidak pernah teks 3D.
- Benda tidak boleh bergantung pada waktu. Gerak diatur oleh modul gerak.
- Setiap benda memiliki bahannya sendiri, karena gerak dan keadaan mengubah bahan. Jangan berbagi satu bahan antarbenda.
- Keadaan baku: `emas`, `nyala`, `denyut`, `abu`, `pudar`. Keadaan khusus: `aktif` dan `lencana` (pion), `lampu` (jendela menyala pada bangunan, 0 sampai 1). `userData.setelKeadaan` boleh mengembalikan `false` supaya keadaan ditangani bawaan kit.
- Bila keadaan yang sama disetel pada kelompok dan pada anaknya dalam frame yang sama, panggilan terakhir yang berlaku.
- Opasitas yang tampak = `userData.opasitas` benda × milik semua induknya (`opasitasEfektif`). Ubah `userData.opasitas` hanya lewat `aturOpasitas`. Benda yang mengatur opacity bahannya sendiri memakai `opasitasEfektif(g)`.
- Selain `emas` dan `nyala`, tidak ada keadaan yang boleh membuat piksel melewati ambang bloom. Permukaan lengkung berwarna kertas atau krem penuh melewati ambang, jadi harus diredupkan. Uji dengan `node kit/katalog/uji-bloom.mjs`.
- Label pada benda disembunyikan selama bendanya belum ditambahkan ke adegan.
- Objek yang dikembalikan `label3D` punya `pada` (jangkar asli: `Object3D`, `Vector3`, fungsi, atau `null`) dan `pengali` (`null`, atau fungsi `(t) => 0..1` yang dikalikan ke opasitas label; bawaan `null` tidak mengubah apa pun). Modul gerak yang mengisi `pengali` wajib membungkus yang sudah ada (`(t) => asli(t) * baru(t)`).
- Petunjuk opsional:
  - `userData.bagian.emas`, `.denyut`, `.tepi`: bagian yang terkena keadaan;
  - `material.userData.warnaAbu` dan `abaikanKeadaan`;
  - `userData.abaikanZona` untuk benda yang boleh keluar zona;
  - `userData.lonjakEmas`: lonjakan skala bawaan `klikEmas` (pion: 0).
- Benda dibuat setelah `buatVideo()` supaya tema yang diganti ikut berlaku.

## 6. Alat baris perintah

Semua perintah dijalankan dari `animasi/` lewat PowerShell.

| Perintah | Hasil |
|---|---|
| `npm run baru -- <nama> [--format indikator\|kosong\|evidence] [--judul "..."]` | Membuat `animasi/proyek/<nama>/` dari templat |
| `npm run buat -- <nama> --periksa` | Tangkapan layar di `titikPeriksa` digabung menjadi `hasil/gambar/<nama>/lembar.png` berlabel detik, ditambah laporan zona dan laporan warna di luar palet. Juga menulis `hasil/kerja/<nama>/peristiwa.json`. Peringatan kit (`console.warn` berawalan `[kit]`, mis. teks lebih dari 3 baris) dicetak di bagian "Peringatan kit" dan satu baris ringkasan; tidak menggagalkan proses dan tidak mengubah berkas hasil |
| `npm run buat -- <nama>` | Pemeriksaan di atas, render penuh ke video bisu `hasil/kerja/<nama>/bisu.mp4`, suara ke video final `hasil/video/<nama>.mp4`, lalu laporan ffprobe, LUFS, dan sinkronisasi |
| `npm run buat -- <nama> --pratinjau` | Server pratinjau |
| Opsi tambahan `buat` | `--titik 1,2.5,8` (titik periksa sendiri), `--paralel N` (bawaan 3 browser), `--gpu` (kartu grafis diskrit, hampir 2× lebih cepat) |
| `node kit/suara/buat-suara.mjs <nama>` | Membaca `hasil/kerja/<nama>/peristiwa.json` dan `animasi/proyek/<nama>/suara.js` (bila ada), lalu menulis `hasil/kerja/<nama>/audio.wav`, `hasil/video/<nama>.mp4` (bila `bisu.mp4` ada), dan `hasil/gambar/<nama>/gelombang.png`. Kode keluar 0 bila berkas tertulis (meski ada peringatan), 1 bila galat |
| `node kit/suara/uji.mjs` | Uji mandiri modul Suara, dijalankan setelah mengubah modul ini |
| `npm run buat -- <nama> --jepret 3,5.5` | Tangkapan resolusi penuh `hasil/gambar/<nama>/t3.png` dan `t5.5.png`. Tanpa `--periksa`, hanya tangkapan ini yang dibuat |
| `npm run buat -- kit/katalog --periksa` | Lembar periksa katalog: semua benda dan dunia. Parameter halaman dan pratinjaunya ada di `docs/katalog.md` |
| `node kit/katalog/uji-bloom.mjs [--lembar]` | Uji bloom semua benda di semua keadaan; kode keluar 1 bila ada keadaan selain emas yang bloom |

`<nama>` boleh berupa jalur bertingkat di bawah `animasi/` (misalnya `kit/katalog`); nama di `hasil/` memakai `-` sebagai pengganti `/` (`hasil/gambar/kit-katalog/lembar.png`).

Tata letak `hasil/`, satu-satunya yang boleh ada di sana (tidak ada berkas lepas), ditentukan di `alat/jalur.mjs`:

| Berkas | Isi |
|---|---|
| `hasil/video/<nama>.mp4` | Video final bersuara; satu-satunya video per animasi |
| `hasil/gambar/<nama>/` | `lembar.png`, `t<detik>.png` (`--jepret`), `gelombang.png` |
| `hasil/kerja/<nama>/` | Bahan antara: `bisu.mp4` (render tanpa suara), `audio.wav`, `peristiwa.json` |

Video lama (tanpa kit) masih menulis berkas lepas lewat perekam dan skrip suaranya sendiri; `npm run rapikan` memindahkannya ke tata letak ini (lihat `docs/alat.md`).

Bila halaman tidak punya `KIT.peristiwa` (video lama), `buat` melewati berkas peristiwa dan langkah suara, sehingga tidak menimpa `hasil/video/<nama>.mp4` lama dengan versi bisu.

Berkas `hasil/kerja/<nama>/peristiwa.json` berbentuk `{ durasi, fps, peristiwa: [...] }`.

## 7. Konvensi dunia

Dunia adalah susunan benda yang sudah diuji muat di kamera, dipakai ulang oleh banyak video. Dunia hanya menyusun dan menempatkan benda. Kapan benda muncul dan bergerak tetap diatur adegan video.

```js
const d = duniaJenjang(v, {
  tanpa: ["jembatan"],                         // benda dunia yang tidak dibuat
  posisi: { pb: titik(3.0, -3.6) },            // menimpa posisi
  opsi: { komisariat1: { label: "KOM A" } },   // diteruskan ke pembuat benda
  ganti: { badko: (opsiAsli) => bendaLain() }, // mengganti satu benda dengan benda lain
});
d.benda.pb;      // Object3D yang sudah ditambahkan ke adegan lewat v.tambah
d.urutan;        // daftar benda dalam urutan munculnya yang wajar
d.fokus;         // Vector3 fokus kamera bawaan
d.H;             // tinggi frustum bawaan (16)
d.titik.pintu;   // titik bernama yang berguna untuk adegan (pintu, ujung jalan, puncak, ...)
```

- Fungsi dunia bernama `dunia<Nama>(v, opsi = {})`, satu berkas per dunia di `kit/dunia/<nama>.js`, dan didaftarkan di `kit/dunia/index.js` (`DAFTAR_DUNIA`). Perakit bersama `susunDunia` dan `luaskan` (nama kelompok seperti `kursi` untuk kursi1..5 di `tanpa` dan `opsi`) ada di `kit/dunia/_susun.js`.
- Tata letak bawaan dunia wajib lolos `periksaZona` pada format indikator dengan `d.fokus` dan `d.H`. Bila angka prompt tidak muat, tata letak kit yang menang, dan selisihnya dicatat di dokumen dunianya (`docs/dunia-*.md`).
- Nama kunci `d.benda` mengikuti nama di prompt (`gerbang`, `komisariat`, `pb`, ...), supaya brief bisa langsung dipetakan.
- Dunia tidak mengubah tema, kamera, atau format.
- Perubahan tata letak bawaan dunia dicatat di CHANGELOG, beserta `posisi` untuk memulihkan tata letak lama.

## 8. Format evidence dan segmenKuis

Format `evidence` (`formatEvidence`, 31 detik: Gejala, sebab, Ikhtiar atau Pandangan, Kuis, Kartu akhir) dan modul `segmenKuis` ditambahkan di 1.2.0 dengan kontrak berikut. `formatIndikator`, `jadwalIndikator`, dan semua perilaku bawaan lain tidak berubah.

- Zona, kabut, dan piksel fokus sama dengan format indikator (§4). Peristiwa struktur: `grid-nyala` 0, `melambat` 6.0, `pil` 26.0, `kartu-akhir` 28.2; tidak ada `denyut` bawaan. `v.akhirAdegan` bawaan 28.2.
- `formatEvidence({ waktu })` menimpa pembagian waktu; format yang dibuat memuat waktu hasil timpaan di `format.waktu`. Adegan yang bergantung pada waktu Bagian 4 memakai `format.waktu.kuis[0]` sebagai `mulai` `segmenKuis`.
- Urutan panggilan di `adegan.js`: `buatVideo` (kamera `(t) => jadwal(t)`), dunia, adegan Bagian 1–3 dan `setiapFrame`, `segmenKuis` **paling akhir**, lalu `jadwal = jadwalEvidence({ ..., kuis: { fokus: seg.fokus } })`. `segmenKuis` membungkus semua benda sembunyikan di scene saat dipanggil dan membaca posisi komisariat (P) saat itu, jadi benda, label, atau `setiapFrame` yang dibuat sesudahnya tidak ikut dipudarkan, dan komisariat (beserta induknya) harus sudah di tempat akhirnya.
- Bagian 4 hanya punya satu benda emas: lembar laporan dari `segmenKuis`. Benda emas Bagian 3 memudar bersama benda lain.
- Kunci kuis `jadwalEvidence` memakai H 14 (Prompt 00: 12; penyimpangan sengaja, lihat `docs/inti.md`) dan fokus dari `segmenKuis(...).fokus`.
- `segmenKuis` memudarkan label yang jangkarnya bukan benda lewat `label.pengali` (§5) dan mencatat peristiwa bunyi `muncul`, `denyut`, `whoosh`, `menyala` (nada 0..5), dan `klik-emas` seperti gerak standar.
- Pil ajakan Bagian 4 adalah pil kartu akhir yang sama (masuk 26.0), jadi hanya ada satu pil.
- `lengkungAudit` (`benda/bangunan.js`) adalah benda biasa (§5) dengan keadaan khusus `nyala` 0..1 (lampu, emissive di bawah ambang bloom).
