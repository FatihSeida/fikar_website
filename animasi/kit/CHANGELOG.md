# Catatan Perubahan Kit

## 0.1.0
- Kerangka awal: README (aturan pakai) dan KONTRAK.

## 0.2.0
- Modul Suara: 31 jenis bunyi, mastering −18 LUFS / −2 dBTP, mux, gelombang, cek sinkron (`kit/suara/`).
- KONTRAK §3: medan opsional `x1` dan `periode`, aturan nilai `kuat`/`durasi`, ekspor `bunyi` di `suara.js`. §6: bentuk berkas peristiwa, kode keluar, `uji.mjs`.

## 0.3.0
- Modul Fondasi: inti (mesin, tema, ruang, waktu, tanah, kamera, bahan), halaman (kerangka, komponen, label3D, format indikator), gerak (13 gerak standar + catatan peristiwa), `buatVideo()`, benda dasar (pion, rumah), templat `indikator` dan `kosong`, video contoh `animasi/contoh-kit/`.
- KONTRAK: `video.js`, `KIT.versi` null sampai siap, aturan `sumber` unik dan penghapusan peristiwa struktur ganda, aturan bahan dan keadaan benda.

## 0.4.0
- Modul Alat: `npm run buat` (lembar periksa, cek zona, cek palet, render paralel 3 browser, suara, laporan) dan `npm run baru` (templat). Untuk video 21 detik, alur penuh sekitar 25 detik.
- Opsi `--gpu` untuk kartu grafis diskrit.
- KONTRAK: `KIT.paletTerlarang`, aturan `tampilkan(t)` tanpa ketergantungan frame sebelumnya, opsi CLI.

## 0.5.0
- Pustaka benda: 108 benda di katalog, dalam enam berkas baru dan `DAFTAR_BENDA` untuk katalog.
  - `figur.js`, `bangunan.js`, dan opsi baru `pion` / `rumah` (Benda A).
  - `medan.js`, `perabot.js` (Benda B).
  - `dokumen.js`, `ikon.js` (Benda C).
  - Dokumentasinya di `docs/benda-*.md`.
- Pembuat jalan ubin bernama `jalanUbin`, karena `jalan` adalah gerak berjalan.
- KONTRAK §5: keadaan `lencana` dan `lampu`, aturan panggilan terakhir yang berlaku. §7 baru: konvensi dunia. `contoh-kit` tetap identik.

## 0.6.0
- Dunia dasar (`kit/dunia/`): Kader, Jenjang, Simpul, Pustaka, Rencana, Arsip, dengan tata letak yang sudah diuji muat di kamera. Perakit bersama `susunDunia` dan `luaskan` (nama kelompok). Dokumentasinya di `docs/dunia-*.md`, termasuk tabel selisih dari prompt.
- Katalog (`kit/katalog/`): semua benda dan dunia, dengan parameter `keadaan`, `benda`, `dunia`, `hanya`, dan `bloom`. Ditambah `uji-bloom.mjs`.
- Inti:
  - Opasitas bersarang dikalikan (`opasitasEfektif`, diekspor).
  - Denyut tidak lagi bloom pada bahan terang; bahan gelap tidak berubah.
- Halaman: `label3D` menyembunyikan label yang bendanya belum masuk adegan. Gaya label `mikro` 15 px.
- Gerak: `jalan` dan `aliran` menerima `THREE.Curve` apa pun sebagai `jalur`; sebelumnya macet.
- Alat:
  - `buat` menerima jalur bertingkat (`kit/katalog` → `hasil/kit-katalog-*`).
  - `baru` menerima nama berawalan `_`.
- Benda:
  - `gembok`, `palu`, dan `lencana` memakai kertas lengkung.
  - `papanTulis` punya mode tabel dengan label mikro yang muat.
  - `garisWaktu.geserPenanda` memakai `aturOpasitas`.
- KONTRAK §5: opasitas efektif, larangan bloom selain emas, label benda di luar adegan. §6: katalog dan jalur bertingkat. `contoh-kit` tetap identik (630 frame).

## 1.0.0
Putaran perbaikan dari uji coba indikator 05 dan 06 (direncanakan sebagai 0.7.0). Sejak versi ini kit dianggap stabil: perubahan berikutnya hanya bila video sungguhan menemukan kekurangan.
- Gerak:
  - `jalan({ durasi })` dan `panjangJalur`.
  - `lintas` (benda apa pun di sepanjang jalur) dan `gantiBenda`.
  - `aliranTersendat` (dari indikator-05).
  - `aliran({ naik })`; bunyi aliran mengikuti beku dan akhir adegan; `bunyi: { durasi }`.
  - `beku: { lanjut, landai }` untuk gerak berkelanjutan.
  - Opsi `selesai` pada `muncul`, `hilang`, `klikEmas`, dan `tumbuh` untuk memuatkan deretan ke satu jendela.
  - `klikEmas` membaca `userData.lonjakEmas`; pion tidak lagi membesar.
- Inti:
  - `fokusUntuk` untuk membingkai kamera, dan `waktuBeku(a, b, { lanjut })`.
  - `userData.penting` boleh berupa fungsi `t`, dan `abaikanZona` berlaku untuk seluruh isi kelompok.
  - `buatVideo({ akhirAdegan })`.
- Alat: `buat --jepret` untuk tangkapan resolusi penuh.
- Dunia:
  - Jenjang: cabang di `titik(-2.85, -1.0)`, sehingga jembatan cabang–badko 1.85 unit. Tata letak lama: `posisi: { cabang: titik(-2.85, 0.1) }`. `d.jalur(...)` kini berada di atas tabung (`{ angkat: 0 }` = sumbu). Lembar `samping.komisariat1` dan `samping.cabang` digeser.
  - Kader: `potong` tanpa garis atap; titik `jalurPendek` dan `sampingKomisariat`.
- Benda: `jembatanTabung` punya garis tepi denyut dan `userData.radius`. Bagian berulang diberi nama supaya laporan bunyi terbaca.
- Halaman: varian label `kelas: "zamrud" | "abu"`.
- KONTRAK §3, §4, §5, §6, §7 diperbarui. `contoh-kit` tetap identik (630 frame).

## 1.1.0
- Format indikator: pil ajakan bawaan menjadi `ahmadzulfikar.com/kuis` untuk semua indikator, menggantikan `ahmadzulfikar.com/indikator/NN` di prompt seri. Templat `indikator` ikut. Video yang mengisi `ajakan` sendiri tidak berubah (`contoh-kit` tetap identik).

## 1.2.0
Format video lima bagian dengan kuis ("Prompt Animasi Seri 44 Indikator (Versi Kit)", Prompt 00). Semua perubahan kompatibel ke belakang: `formatIndikator`, `jadwalIndikator`, dan perilaku bawaan lain tidak berubah; `contoh-kit` dan `indikator-05` sampai `indikator-14` dirender ulang identik (lembar periksa dan `peristiwa.json` sama byte demi byte, satu pengecualian pada lembar `indikator-11`: lihat catatan uji di bawah; `contoh-kit` t 15 tetap MD5 63A7EE69…).
- Format `evidence` (`halaman/format/evidence.js`): `formatEvidence(isi)` dan `WAKTU_EVIDENCE`. Video 31 detik: grid menyala 0–0.6, Gejala 0.6–6.0, sebab 6.0–13.0, Ikhtiar atau Pandangan 13.0–23.0, Kuis 23.0–28.0, Kartu akhir 28.0–31.0, beku 6.0–6.6.
  - Isi: `nomor`, `total`, `kategori`, `judul`, `mode` (`"ikhtiar"` atau `"pandangan"`), `waktu`, `gejala`, `sebab`, `ikhtiar` (1–3 kalimat `{ teks, masuk, keluar }`), `program`, `kuis` (`{ pertanyaan, kalimat }`), `ajakan`, `baca`, `sumber`, `label`, `merek`, `penutup`, `barisNomor`.
  - Teks, label, kartu pertanyaan, pil bersama, kartu akhir, baris baca dan sumber persis seperti bagian B Prompt 00. Titik periksa 11 titik, dihitung ulang bila `waktu` diganti. Peristiwa struktur: `grid-nyala`, `melambat`, `pil`, `kartu-akhir`. Pemeriksaan jumlah baris (judul, kalimat, kartu pertanyaan maksimal 3; label maksimal 2) memberi `console.warn`.
- `jadwalEvidence({ fokus, awal, gejala, sebab, ikhtiar, kuis, akhir, tambahan })` (`inti/kamera.js`), dibangun di atas `jadwalKamera`: awal H 13, gejala 0–1.2 H 11, sebab 6–7 H 8, ikhtiar 13–14 H 11, kuis 23–24, akhir 28–29.5 H 15 (fokus naik 0.8), dan `tambahan` untuk geseran di tengah bagian. **Penyimpangan dari Prompt 00: H kuis bawaan 14, bukan 12.** Dengan terowongan `segmenKuis` yang ditetapkan prompt, pada H 12 atap komisariat di P berada 97 px (t 24.0) sampai 45 px (t 24.5) di atas zona y 600 dan ujung kanan komisariat di E ±5 px dari tepi frame; H 13 masih melanggar (komisariat di 24.5, lengkung 1 di 24.5 dan 26.8); H 14 lolos `periksaZona` di titik periksa 24.5 dan 26.8. Angka lengkap di `docs/inti.md`. `kuis: { H: 12 }` memulihkan angka prompt; di H 14 atap masih 18–25 px di atas zona selama t 23.8–24.2 (H 15 menghilangkannya).
- `lengkungAudit` (`benda/bangunan.js`, terdaftar di `DAFTAR_BENDA` kategori bangunan dengan `contoh`): dua kaki silinder r 0.05 setinggi 0.8 di z lokal ±1.0, busur setengah torus r 1.0 (puncak y 1.8), alas silinder r 0.12 × 0.04, zamrudRedup. Keadaan khusus `nyala` 0..1 (lampu: zamrudPijar, emissive 0.45 di bawah ambang bloom), label mikro di atas puncak, `bagian` (`kaki`, `busur`, `alas`, `tepi`), `userData.puncak`. Lolos `uji-bloom.mjs` di semua keadaan selain emas.
- `segmenKuis(v, { komisariat, kelompok, mulai = 23.0, sembunyikan, skala = 0.8 })` (`gerak/kuis.js`): adegan 3D Bagian 4. Benda lain memudar, enam `lengkungAudit` membentuk terowongan di sepanjang sumbu dunia +x dari P (titik tanah komisariat), komisariat meluncur P → E = P + `titik(4.6, 4.6)`, tiap lengkung menyala saat dilewati (peristiwa `menyala` nada 0..5), lalu `lembarKertas` emas mendarat di atap (m + 3.2). Mengembalikan `{ fokus, lengkung, laporan, P, E }`. **Dipanggil paling akhir di `adegan.js`** (sesudah semua benda, label, gerak, dan `setiapFrame`; komisariat sudah di tempat akhir).
- `label3D`: objek label punya `pada` (jangkar asli) dan `pengali` (`null` atau `(t) => 0..1` yang dikalikan ke opasitas; dipakai `segmenKuis`). Label yang tidak memakainya tidak berubah.
- Komponen halaman (opsi baru; bawaan tidak berubah):
  - `keterangan`: `ukuranLabel`, `jarakLabel`, `program`, `kalimat` (`[{ teks, masuk, keluar }]`, kalimat bergantian dengan celup pudar).
  - `panel`: `kelas` (kartu pertanyaan `kartu-kuis`).
  - `kartuAkhir`: `baca` (baris baca), `waktu.baca`, `top.baca`.
  - CSS (`kerangka.css`): `.kit-ket-program`, `.kit-baca`, `.kit-panel.kartu-kuis`.
- Templat `alat/templat/evidence/` (`index.html`, `adegan.js`): dunia Kader, teks contoh, `segmenKuis`, dan `jadwalEvidence`, dengan urutan panggilan dan nilai contoh yang ditandai. `npm run baru -- <nama> --format evidence --judul "..."` bekerja tanpa mengubah `baru.mjs`. Video uji `animasi/contoh-evidence/` (dunia Kader, teks contoh, modul kuis): 0 pelanggaran zona di 11 titik periksa, warna bersih, render penuh 930 frame dengan suara −18.0 LUFS, −2.0 dBTP, sinkron ok.
- Alat `buat`: console.warn berawalan `[kit]` dari halaman (teks lebih dari 3 baris, `fokusUntuk` tidak muat, dst.) dikumpulkan dan dicetak di bagian "Peringatan kit" serta satu baris `peringatan` di ringkasan periksa (juga untuk `--jepret`). Sebelumnya hanya `console.error` yang dilaporkan, jadi peringatan itu tidak pernah terlihat. Tidak menggagalkan proses dan tidak mengubah berkas hasil apa pun.
- Dokumentasi: `halaman.md` (format evidence, `lbl.pada`/`lbl.pengali`, catatan duniaKader pada kamera evidence), `inti.md` (`jadwalEvidence`, penyimpangan H 14), `gerak.md` (`segmenKuis`, `akhirAdegan` evidence 28.2), `benda-figur-bangunan.md` (`lengkungAudit`), `alat.md` (peringatan kit, format `evidence`), KONTRAK §1, §4, §5, §6, dan §8 baru, README (alur kerja, prompt versi kit).
- Catatan uji: kepala lembar periksa mencetak versi kit, jadi MD5 `-lembar.png` berubah begitu `VERSI` dinaikkan (piksel di bawah kepala tetap sama). Perbandingan regresi dilakukan sebelum `VERSI` dinaikkan. Pada lembar `indikator-11`, acuan yang direkam sebelum perubahan kit berbeda dari hasil sekarang pada anti-alias teks HTML; frame penuh `indikator-11` di t 3, 9, 15, dan 19.5 yang direkam sebelum ada perubahan kit identik byte demi byte dengan render sekarang, jadi acuan itulah yang menyimpang (lihat laporan integrasi), bukan kit.

## 1.3.0
Video format evidence lebih cepat dan hemat token dibuat. Semua tambahan kompatibel ke belakang: `contoh-kit`, `contoh-evidence`, `indikator-01-v2`, `indikator-02-v2`, dan `indikator-05` sampai `indikator-14` dirender ulang identik (lembar periksa dan `peristiwa.json` sama MD5-nya, diperiksa sebelum `VERSI` dinaikkan).
- `akhiriEvidence(v, { komisariat, kelompok, kamera, mulai, sembunyikan, skala })` (`gerak/kuis.js`): Bagian 4 dan 5 dalam satu panggilan di akhir `adegan.js`. Menjalankan `segmenKuis` (mulai dari `v.format.waktu.kuis[0]`), membangun `jadwalEvidence` dengan fokus kuis dari segmenKuis (kunci kuis dan akhir mengikuti waktu format), dan memasangnya sebagai kamera video. `kelompok` otomatis dari `kategori` format (6 kategori seri); bisa ditimpa, `null` = tanpa denyut; kategori lain tanpa `kelompok` melempar galat. Video tidak perlu `let jadwal`, `kamera: (t) => jadwal(t)`, `segmenKuis`, maupun `jadwalEvidence`.
- `buatVideo`: `v.aturKamera(fn)` mengganti jadwal kamera sesudah video dibuat. `formatEvidence` menyimpan `kategori` pada objek format.
- `hMuat(benda, { fokus, margin, zona, piksel })` (`inti/kamera.js`): H terkecil (dibulatkan ke atas 0.01) di mana kotak layar benda muat di zona adegan, dihitung langsung. Tanpa `fokus`, cocok dengan `fokusUntuk(benda, { H })` (tanpa peringatan di H itu, peringatan di H − 0.01); dengan `fokus`, kamera tetap di titik itu.
- Kunci `jadwalEvidence` (dan `kamera` di `akhiriEvidence`) menerima `{ muat: [benda...], H, margin }`: fokus = `fokusUntuk(muat)`, H = maks(H yang diberi atau bawaan kunci, `hMuat`). Berlaku untuk `awal`, `gejala`, `sebab`, `ikhtiar`, `kuis`, `akhir`, dan tiap kunci `tambahan`. Bila kunci juga memberi `fokus`, fokus itu dipakai dan H dihitung untuk fokus itu. `fokusUntuk` tidak berubah.
- `kit/PANDUAN-EVIDENCE.md`: panduan singkat (satu-satunya dokumen kit yang perlu dibaca agen video evidence): perintah templat, kerangka `adegan.js`, contekan API, jebakan beserta perbaikannya, dan alur pemeriksaan. README menunjuk ke panduan itu. Templat `alat/templat/evidence/adegan.js` memakai kerangka baru.
- Catatan: `docs/inti.md`, `docs/gerak.md`, dan `KONTRAK.md` belum memuat `hMuat`, `muat`, dan `akhiriEvidence`; rujukannya di panduan dan entri ini.
- Catatan uji: salinan `contoh-evidence` yang memakai `akhiriEvidence` dan kunci `muat` menghasilkan frame 24.5, 26.8, dan 29.5 identik byte demi byte dengan `contoh-evidence`, dan 0 pelanggaran zona. `hMuat` sama dengan H hasil coba-coba satu per satu 0.01 (dengan dan tanpa `fokus`).

## 1.3.1
Keluaran `hasil/` dipisah menurut jenis, dan folder video dipindah ke `animasi/proyek/`. Rendernya tidak berubah: lembar periksa `contoh-kit`, `contoh-evidence`, `indikator-02-v2`, dan `indikator-05` sama piksel demi piksel di bawah kepala lembar (y ≥ 125), dan frame `contoh-kit` detik 15 sama MD5-nya.
- Tata letak `hasil/` (didefinisikan di satu tempat, `alat/jalur.mjs`): `video/<nama>.mp4` (satu-satunya video per animasi, bersuara), `gambar/<nama>/` (`lembar.png`, `t<detik>.png`, `gelombang.png`), dan `kerja/<nama>/` (`bisu.mp4`, `audio.wav`, `peristiwa.json`). `buat`, `suara/buat-suara.mjs` (juga bila dijalankan sendiri), dan `katalog/uji-bloom.mjs --lembar` (`gambar/kit-katalog/<keadaan>-lembar.png`) menulis langsung ke sana. Tidak ada lagi berkas lepas di `hasil/`. Folder sementara render pindah ke `kerja/<nama>/sementara-<pid>/`. Laporan ffprobe, LUFS, dan sinkron tidak berubah, hanya jalurnya.
- `animasi/rapikan.mjs` (`npm run rapikan`, `--coba` untuk pratinjau pemetaan): memindahkan berkas lepas di `hasil/` ke tata letak itu. Dipakai untuk pemindahan satu kali dan sesudah video lama (tanpa kit) dirender ulang dengan `rekam.mjs` atau `suara.mjs` miliknya sendiri, yang masih menulis berkas lepas. Tidak pernah menghapus, dan hanya menimpa target yang lebih lama. Lihat `docs/alat.md`, bagian Video lama.
- Folder video dipindah dari `animasi/<nama>/` ke `animasi/proyek/<nama>/`, jadi impor kit menjadi `../../kit/index.js` (dan `../../kit/halaman/kerangka.css` di `index.html`). Semua alat dan `rekam.mjs` tetap menerima nama polos (`indikator-05`): `cariHalaman()` di `alat/jalur.mjs` mencari di `proyek/<nama>/` lebih dulu, lalu di `animasi/<nama>/` (untuk `kit/katalog`). Halaman dibuka di `/proyek/<nama>/`; akar server Vite tetap `animasi/`.
- `baru` membuat `animasi/proyek/<nama>/`, templat mengimpor `../../kit/`, dan langkah berikutnya yang dicetaknya menyebut lokasi keluaran baru.
- Dokumen yang menyebut jalur keluaran atau folder video diperbarui: `README.md`, `KONTRAK.md` (bagian 1 dan 6), `PANDUAN-EVIDENCE.md`, dan `docs/` (`alat`, `suara`, `katalog`, serta contoh impor di dokumen modul).

## 1.3.2
Alat render bisa berjalan di sesi cloud Claude Code (Ubuntu tanpa Edge, GPU, dan ffmpeg) selain di PC Windows. Di PC ini tidak ada yang berubah: peramban tetap Edge, dan lembar periksa `indikator-05` sama piksel demi piksel di bawah kepala lembar (y ≥ 125) dengan sebelum perubahan.
- `alat/peramban.mjs`: satu pemilih peramban untuk `buat`, `rekam.mjs`, dan `katalog/uji-bloom.mjs`. Urutannya Edge (`msedge`), Chromium kelolaan Playwright, lalu Chromium/Chrome sistem di jalur Linux umum. Peramban cadangan memakai WebGL perangkat lunak (SwiftShader). Satu baris `Peramban: …` dicetak sekali per proses, dan `KIT_PERAMBAN=msedge|chromium|<jalur>` memaksa satu pilihan tanpa cadangan. Bila tidak ada peramban yang bisa dibuka, pesan galatnya menyebut yang dicoba dan cara memperbaikinya.
- `buat` (render penuh) dan `rekam.mjs` berhenti sejak awal dengan petunjuk `apt-get install -y ffmpeg` bila `ffmpeg` atau `ffprobe` tidak ada di PATH. `--periksa`, `--jepret`, dan `--pratinjau` tidak memerlukannya.
- `animasi/siapkan-cloud.sh` dan `.claude/settings.json` (hook SessionStart di akar repo): di sesi cloud, memasang `npm install` (akar dan `animasi/`), ffmpeg lewat apt, dan Chromium Playwright. Tidak melakukan apa pun di luar cloud, melewati yang sudah terpasang, dan tidak pernah menggagalkan sesi. Unduhan Chromium diblokir oleh akses jaringan "Trusted", jadi environment harus diubah ke "Full" sekali.
- Ukuran: `indikator-05` (630 frame, 3 halaman) dirender dengan Chromium cadangan dalam 247 s di i7-13620H tanpa GPU (2,5 frame/s), lawan 33 s dengan Edge. Adegannya tampil benar.
