# Modul Suara

Modul Suara mengubah daftar peristiwa bunyi (KONTRAK §3) menjadi efek suara tersintesis, memasternya, lalu menggabungkannya ke video bisu. Tidak ada desain suara per video: gerak standar kit mencatat peristiwa, dan modul ini memberi setiap peristiwa bunyi yang sesuai.

Paletnya lembut, hangat, dan digital, seperti suara antarmuka di video penjelasan. Tidak ada musik dan tidak ada yang tajam di atas sekitar 8 kHz. Musik Instagram ditambahkan pengguna di atasnya, jadi efek ini dibuat untuk duduk di bawah musik.

Semua sintesis berjalan di Node murni tanpa dependensi, dengan derau berbenih. Masukan yang sama selalu menghasilkan WAV yang sama persis. ffmpeg dipakai untuk menggabung, mengukur, dan menggambar gelombang.

| Berkas | Isi |
|---|---|
| `suara/index.mjs` | API `buatSuara()`, `cetakLaporan()`, `PALET`, `JENIS` |
| `suara/buat-suara.mjs` | Baris perintah (KONTRAK §6) |
| `suara/palet.mjs` | Satu bunyi untuk setiap jenis |
| `suara/susun.mjs` | Pengisian nilai bawaan, penyaringan, penipisan, batas suara serentak, render, kalibrasi |
| `suara/master.mjs` | Tapis, normalisasi kenyaringan, pembatas puncak sejati |
| `suara/dsp.mjs` | Acak berbenih, tangga nada, filter, BS.1770, puncak sejati, penulis WAV |
| `suara/periksa.mjs` | ffmpeg (gabung, ebur128, gelombang, dekode) dan periksa sinkron |
| `suara/uji.mjs` | Uji modul dan katalog semua bunyi untuk didengar |

## Menjalankan

### Baris perintah

Dari folder `animasi/`:

```
node kit/suara/buat-suara.mjs <nama>
```

Biasanya perintah ini dipanggil otomatis oleh `npm run buat -- <nama>`. Prosesnya:

1. Membaca `hasil/kerja/<nama>/peristiwa.json`.
2. Memuat `animasi/proyek/<nama>/suara.js` bila ada, lalu menerapkan `sesuaikan()` dan `bunyi`.
3. Menulis `hasil/kerja/<nama>/audio.wav`: 48 kHz, stereo, 16-bit, tepat `durasi × 48000` sampel.
4. Bila `hasil/kerja/<nama>/bisu.mp4` ada, menggabungkannya menjadi `hasil/video/<nama>.mp4`, video final bersuara. Video disalin apa adanya, audio AAC 192k, dengan `+faststart`. Bila video bisu belum ada, hanya WAV yang dibuat, disertai peringatan.
5. Menulis `hasil/gambar/<nama>/gelombang.png`.
6. Mencetak laporan singkat: jumlah peristiwa, LUFS dan puncak sejati (internal dan ebur128), kerja pembatas, tabel sinkron, dan peringatan.

Kode keluar 0 berarti berkas sudah dibuat, termasuk bila ada peringatan. Kode 1 berarti galat: berkas peristiwa tidak ada atau rusak, ffmpeg tidak ada padahal video perlu digabung, atau `suara.js` gagal dimuat.

### API

```js
import { buatSuara, cetakLaporan } from "../../kit/suara/index.mjs";

const laporan = await buatSuara({
  peristiwa,                  // array peristiwa (wajib)
  durasi: 21,                 // detik (wajib)
  keluaranWav: "hasil/kerja/x/audio.wav", // wajib
  video: "hasil/kerja/x/bisu.mp4",        // opsional; bila ada, keluaranVideo wajib
  keluaranVideo: "hasil/video/x.mp4",
  gelombang: "hasil/gambar/x/gelombang.png", // opsional
  sesuaikan,                  // opsional: (peristiwa, { durasi, fps }) => peristiwa, boleh async
  bunyi,                      // opsional: bunyi lokal, lihat di bawah
  fps: 30,                    // untuk nomor frame di laporan
  periksaSinkron: true,
});
cetakLaporan(laporan);
```

`laporan` berisi:

| Medan | Isi |
|---|---|
| `wav`, `video`, `gelombang` | Berkas yang ditulis (`video` null bila tidak digabung) |
| `sampel`, `sampleRate`, `durasi` | Panjang WAV |
| `jumlah` | `{ masuk, dibunyikan, digabung, dipangkas, dibisukan, takDikenal }` |
| `perJenis`, `takDikenal` | Jumlah peristiwa per jenis yang dibunyikan, dan per jenis yang tidak dikenal |
| `lufs`, `puncakSejatiDb`, `puncakSampelDb` | Ukuran internal sesudah mastering |
| `penguatanDb`, `pembatas` | Penguatan normalisasi; `pembatas = { tekananMaksDb, waktu, persen }` |
| `ffmpeg`, `ffmpegVideo` | `{ lufs, puncakSejatiDb }` menurut `ebur128` untuk WAV dan audio MP4 |
| `sinkron` | Sampel periksa sinkron: `{ jenis, sumber, t, frame, pita, kontrasDb, terukur, selisihMs, lulus }` |
| `peringatan` | Daftar teks, termasuk jenis tak dikenal |

## Berkas peristiwa

`hasil/kerja/<nama>/peristiwa.json` ditulis oleh alat `buat` dari `window.KIT.peristiwa()`. Bentuknya:

```json
{
  "durasi": 21,
  "fps": 30,
  "peristiwa": [
    { "t": 0.0, "jenis": "grid-nyala", "x": 0.5, "kuat": 0.7, "durasi": 1.8, "nada": 0, "sumber": "grid" },
    { "t": 12.4, "jenis": "muncul", "x": 0.62, "kuat": 0.8, "durasi": 0, "nada": 0, "sumber": "tabel" }
  ]
}
```

| Medan | Wajib | Arti |
|---|---|---|
| `durasi` | ya | Panjang video dalam detik. WAV dibuat tepat sepanjang ini. |
| `fps` | tidak | Bawaan 30. Hanya dipakai untuk nomor frame di laporan dan batas selisih durasi video. |
| `peristiwa` | ya | Array peristiwa. Urutannya bebas; modul mengurutkan menurut `t`. |

Medan per peristiwa:

| Medan | Bawaan | Arti |
|---|---|---|
| `t` | wajib | Detik mulai. Peristiwa dengan `t` tidak sah, negatif, atau ≥ `durasi` diabaikan dengan peringatan. |
| `jenis` | wajib | Salah satu jenis di bawah. Jenis tak dikenal diabaikan dengan peringatan. |
| `x` | 0,5 | Posisi layar 0 (kiri) sampai 1 (kanan), untuk pan stereo. |
| `kuat` | 0,7 | 0 sampai 1. Nilai 0 membisukan peristiwa. |
| `durasi` | 0 | Detik, untuk jenis berdurasi. 0 berarti durasi bawaan jenis itu. |
| `nada` | 0 | Bilangan bulat, langkah tangga nada untuk urutan yang naik. Boleh negatif. |
| `sumber` | `""` | Nama benda. Dipakai untuk laporan, penggabungan per sumber, dan langkah kiri-kanan. |
| `x1` | tidak ada | Tambahan, opsional: posisi akhir untuk bunyi yang bergerak. Pan meluncur dari `x` ke `x1` selama durasi. |
| `periode` | 1,2 | Tambahan, opsional, khusus `denyut`: periode denyut dalam detik. |

Medan lain boleh ada dan diteruskan apa adanya ke `sesuaikan()`.

## Parameter bunyi

- **`kuat`** mengatur keras dan cerahnya bunyi. Pada 0,7, bunyi tepat di tingkat kalibrasi jenisnya. Gain mengikuti `(kuat / 0,7)^1,5`: kuat 1 sekitar +4,6 dB, 0,35 sekitar −9 dB, 0,1 sekitar −25 dB. Kecerahan diatur tapis-lolos-bawah satu kutub dari 2 kHz (kuat 0) sampai sekitar 10 kHz (kuat 1), jadi bunyi lemah juga lebih redup.
- **`nada`** menaikkan bunyi per langkah pentatonik D mayor (D, E, F#, A, B); lima langkah sama dengan satu oktaf. Setiap jenis bernada punya derajat dasar (0 = D4, 5 = D5, 10 = D6). Bila hasilnya lebih dari 9 langkah di atas dasar atau nada pokoknya di atas 2,5 kHz, nada diturunkan satu oktaf, jadi urutan panjang tetap enak didengar. Bunyi bernada yang naik dilunakkan 1,5 dB per oktaf. Pada jenis yang tidak bernada (misalnya `kayu`, `cap`, `gemuruh`), `nada` menggeser warna bunyi dengan perbandingan yang sama.
- **`durasi`** hanya dipakai jenis berdurasi, yang ditandai di tabel. Jenis lain mengabaikannya.
- **`x`** di-pan dengan hukum daya-sama. x = 0 dan x = 1 dipetakan ke pan ±0,75, supaya tidak ada bunyi yang menempel di satu telinga.
- **Variasi.** Setiap peristiwa mendapat variasi kecil berbenih menurut urutannya di antara jenis yang sama: nada sekitar ±0,4% (`langkah` ±5%), gain sekitar ±1 dB (`langkah` ±2 dB), kecerahan ±8%, dan derau yang berbeda. Dua puluh langkah tidak terdengar seperti mesin. `langkah` juga bergantian kaki kiri-kanan per `sumber`.
- **Penggabungan.** Peristiwa sejenis dari `sumber` yang sama yang lebih rapat dari `jarakMin` digabung. Yang pertama dipertahankan dengan kuat sedikit lebih tinggi. Untuk `langkah` jaraknya 60 ms, dan 30 ms untuk jenis lain.
- **Batas suara serentak.** Paling banyak 4 bunyi sejenis (5 untuk `muncul`, `tumbuh`, `denting`; 3 untuk `debu`) dan 12 bunyi total yang aktif bersamaan. Kelebihannya dipangkas. Bunyi latar (`grid-nyala`, `melambat`, `denyut`, `aliran`, `gemuruh`) tidak dihitung. `kartu-akhir`, `klik-emas`, `centang`, dan `cap` tidak pernah dipangkas.
- **Kerapatan.** n bunyi sejenis yang mulai dalam jendela pendek masing-masing dikali n^−0,4, jadi lima benda yang muncul bersamaan tidak lima kali lebih keras.
- **Pudar.** Setiap bunyi punya pudar masuk 1 ms dan pudar keluar 20 ms di ujung penyangganya, juga bila terpotong akhir video.

## Daftar jenis

Kolom *tingkat* adalah target kenyaringan 100 ms terbesar (LUFS relatif) pada kuat 0,7. Penguatan setiap jenis dihitung otomatis dari target ini, jadi keseimbangan antarjenis tetap walaupun warna bunyinya diubah. Sesudah dicampur, seluruh trek dinormalkan ke −18 LUFS.

| Jenis | Kelompok | Bunyi | Berdurasi | Tingkat |
|---|---|---|---|---|
| `grid-nyala` | Struktur video | Desir udara yang mengembang pelan di atas alas kuint rendah D–A; dunia menyala. | ya, bawaan 1,8 s | −25 |
| `melambat` | Struktur video | Desah rendah yang turun lalu reda; gerak melambat dan berhenti. | ya, bawaan 1 s | −24 |
| `kartu-akhir` | Struktur video | Dentum lembut dan akor hangat sus4 → mayor yang meluruh pelan sampai video selesai. | ya, bawaan sampai akhir video | −18 |
| `pil` | Struktur video | Tik-pop kecil bernada; label pil seperti "Indikator 17 dari 44" muncul. | – | −22 |
| `muncul` | Benda | Letup lembut bernada dengan sedikit badan rendah; benda muncul. | – | −20 |
| `hilang` | Benda | Nada kecil yang meluncur turun dengan hembus udara; benda menghilang. | – | −22 |
| `tumbuh` | Benda | Bip lembut yang meluncur naik sekuint selama benda tumbuh. | ya, bawaan 0,35 s | −21 |
| `menyala` | Benda | Kilau kaca dua nada dengan getar halus dan dengung hangat; benda menyala. | – | −21 |
| `padam` | Benda | Nada yang turun dan meredup dengan desah rendah; benda padam. | – | −22 |
| `retak` | Benda | Retakan pendek berbutir di atas dentum kecil; tidak tajam. | – | −20 |
| `putar` | Benda | Desir putar yang membesar lalu mengecil dengan dengung tipis. | ya, bawaan 0,6 s | −23 |
| `klik-emas` | Hasil | Klik renyah lalu denting emas dua nada yang hangat; hasil yang benar. | – | −17 |
| `centang` | Hasil | Dua nada naik yang cepat, A lalu D; tanda centang. | – | −19 |
| `denting` | Hasil | Denting lonceng kecil yang lembut; nada naik untuk urutan. | – | −20 |
| `denyut` | Cermin | Dengung rendah D–A yang membesar dan mengecil seirama denyut. Mulai dari titik paling lirih di `t` dan memuncak di `t + periode/2`. | ya, bawaan 2,4 s | −25 |
| `langkah` | Gerak figur | Ketuk langkah lembut: badan rendah dan tumit kayu kecil, kaki kiri-kanan bergantian. | – | −25 |
| `lempar` | Lempar | Jentik kecil lalu desir terbang yang memuncak di tengah lintasan; pakai `x1` untuk arah. | ya, bawaan 0,45 s | −21 |
| `mendarat` | Lempar | Letup-dentum lembut; benda mendarat. | – | −19 |
| `kertas` | Kertas | Desir kertas berbutir; lembar, tabel, atau dokumen muncul. | – | −21 |
| `balon` | Kertas | "Blup" naik sekuint yang singkat; balon ucapan atau pesan muncul. | – | −20 |
| `label-ganti` | Kertas | Tik mekanis kecil bernada; label atau angka berganti. | – | −23 |
| `cap` | Kertas | Dentum kayu dan tepukan karet di kertas; stempel atau cap. | – | −16 |
| `kayu` | Kertas | Ketuk kayu yang hangat; papan, balok, atau rak terpasang. | – | −19 |
| `laci-buka` | Kertas | Gesek kayu yang meluncur, lalu ketuk kecil saat laci berhenti di `t + durasi`. | ya, bawaan 0,5 s | −21 |
| `pintu` | Kertas | Ayunan udara dengan derit tipis, ditutup ketuk gerendel lembut di `t + durasi`. | ya, bawaan 0,9 s | −21 |
| `garis-sambung` | Garis | Luncuran nada lembut selama garis ditarik, lalu ping kecil saat tersambung di `t + durasi`. | ya, bawaan 0,4 s | −22 |
| `garis-putus` | Garis | Patahan pendek: jepret lembut, nada jatuh, dentum kecil. | – | −20 |
| `aliran` | Suasana | Desis lembut yang bergelombang dengan kilau pentatonik jarang; pakai `x1` untuk arah aliran. | ya, bawaan 2 s | −26 |
| `debu` | Suasana | Kepulan debu: desah rendah dengan butir-butir halus yang menyebar. | – | −22 |
| `gemuruh` | Suasana | Gemuruh gesek rendah yang bergerinda halus; balok bergeser atau tanah bergerak. | ya, bawaan 1,5 s | −22 |
| `whoosh` | Suasana | Desir udara yang menebal lalu menghilang; perpindahan cepat atau kamera berayun. Tanpa `x1`, desir bergeser sedikit dari kiri ke kanan. | ya, bawaan 0,6 s | −21 |

Jenis bernada (nada naik per langkah pentatonik dari derajat dasar): `kartu-akhir` (D3; seluruh akor bergeser), `pil` (A5), `muncul` (D5), `hilang` (D5), `tumbuh` (F#4), `menyala` (A5), `padam` (D5), `klik-emas` (D6), `centang` (A5), `denting` (A5), `denyut` (D3), `balon` (A4), `label-ganti` (D6), `garis-sambung` (D5), dan `aliran` (A4, untuk kilaunya).

Untuk mendengar semua bunyi, jalankan `node kit/suara/uji.mjs`. Uji ini menulis `katalog-suara.wav` ke folder sementara sistem dan mencetak lokasinya.

## Menyesuaikan lewat `suara.js`

Video boleh punya `animasi/proyek/<nama>/suara.js`. Dua ekspor dikenali, dan keduanya opsional:

- `sesuaikan(peristiwa, { durasi, fps })` menerima salinan peristiwa yang sudah berisi nilai bawaan dan sudah urut. Fungsi ini mengembalikan array baru, atau mengubah array itu langsung tanpa mengembalikan apa pun. Boleh async. Hasilnya disaring lagi, jadi jenis yang masih tidak dikenal tetap diabaikan dengan peringatan.
- `bunyi` adalah objek berisi bunyi lokal. Bunyi lokal menambah jenis baru, atau menimpa jenis kit untuk video ini saja.

Contoh:

```js
// animasi/proyek/indikator-07/suara.js
export function sesuaikan(peristiwa, { durasi }) {
  const hasil = peristiwa
    .filter((p) => p.jenis !== "debu")                              // matikan semua debu
    .filter((p) => !(p.jenis === "langkah" && p.sumber === "pion-3")); // matikan langkah satu figur

  for (const p of hasil) {
    if (p.jenis === "cap") p.kuat = 1;                // cap lebih kuat
    if (p.sumber === "papan") p.jenis = "kayu";       // ganti bunyi satu benda
    if (p.jenis === "denyut") p.periode = 1.5;        // samakan dengan denyut di gambar
    if (p.jenis === "muncul" && p.t > 12) p.t += 0.05; // geser sedikit
  }

  hasil.push({ t: 14.2, jenis: "centang", x: 0.7 });                     // tambah peristiwa
  hasil.push({ t: 15.0, jenis: "aliran", durasi: 2.5, x: 0.2, x1: 0.8 }); // aliran kiri ke kanan
  hasil.push({ t: durasi - 0.8, jenis: "lonceng-lokal", x: 0.5 });       // bunyi lokal (di bawah)
  return hasil;
}

export const bunyi = {
  "lonceng-lokal": {
    tingkat: -20, lama: 0.8, dasar: 10, impulsif: true,
    buat(s) {
      s.ton(0, { f: s.f(0), dur: 0.8, serang: 0.003, parsial: [[1, 1, 0.3], [2, 0.12, 0.15]], gain: 0.1 });
    },
  },
};
```

Bunyi lokal boleh hanya berupa fungsi `buat(s)`. Bila berupa objek, medannya sama dengan entri di `palet.mjs` (lihat komentar di kepala berkas itu). Bawaannya: `tingkat −20`, `lama 1 s`, tidak berdurasi, tidak bernada.

Isi `s` di dalam `buat(s)`:

| Nama | Arti |
|---|---|
| `s.ton(t, { f, dur, serang, lepas, parsial, gain, pan, bentuk, getar })` | Nada aditif. `parsial` berisi `[rasio, amplitudo, peluruhan detik]`. `f`, `pan`, `bentuk` boleh fungsi waktu lokal. |
| `s.derau(t, { dur, fc, q, jenis, bentuk, gain, pan })` | Derau berbenih tersaring. `jenis` bisa `"bp"`, `"lp"`, atau `"hp"`. `fc` boleh fungsi waktu. |
| `s.dentum(t, { f0, f1, lama, gain, pan })` | Hentakan rendah dengan nada turun. |
| `s.f(k)` | Frekuensi derajat pentatonik `k` di atas nada dasar, sudah termasuk `nada` dan variasi. |
| `s.rasio` | Perbandingan nada (dari `nada` dan variasi) untuk bunyi yang tidak bernada. |
| `s.durasi`, `s.kuat`, `s.nada`, `s.ev`, `s.indeks`, `s.indeksSumber`, `s.sisa`, `s.acak()` | Durasi efektif, nilai peristiwa, peristiwa utuh, urutan, sisa detik video, dan acak berbenih |

Waktu `t` di dalam `buat(s)` adalah detik sejak peristiwa mulai. `pan` adalah geseran terhadap pan peristiwa. Komponen di atas 7,5 kHz tidak disintesis.

Bunyi lokal yang berguna untuk video lain dipindahkan ke `palet.mjs` lewat pekerjaan kit terpisah (README, aturan 3).

## Mastering

Urutannya:

1. Tapis-lolos-atas 30 Hz (orde 2), lalu tapis-lolos-bawah Butterworth orde 4 di 7,8 kHz.
2. Pudar awal 5 ms dan pudar akhir 0,3 s.
3. Normalisasi kenyaringan terintegrasi ke −18 LUFS. Pengukurannya mengikuti ITU-R BS.1770-4: bobot K, blok 400 ms, langkah 100 ms, gerbang −70 LUFS dan −10 LU.
4. Pembatas puncak sejati. Puncak antarsampel diukur dengan oversampling 4×. Plafonnya −2 dBTP dengan pandang-depan 1,5 ms dan pelepasan 80 ms, kiri-kanan terkait. Penguatan dan pembatas diulang sampai kenyaringan tepat −18 LUFS (±0,02).
5. Ditulis ke WAV 16-bit.

Hasilnya diperiksa ulang dengan `ffmpeg -af ebur128=peak=true` untuk WAV dan audio MP4. Pada uji, WAV terukur −18,0 LUFS dan −2,0 dBTP, dan MP4 (AAC) −18,0 LUFS dan −1,8 sampai −2,0 dBTP.

Bila satu bunyi jauh lebih menonjol daripada sisanya, misalnya satu `cap` kuat 1 di video yang hampir sepi, pembatas harus bekerja lebih keras untuk mencapai −18 LUFS. Bila tekanannya lebih dari 4 dB, laporan menyebut detik dan jenis bunyinya. Turunkan `kuat` bunyi itu lewat `sesuaikan()` bila terdengar tertekan.

## Periksa sinkron

Audio akhir didekode ulang oleh ffmpeg dari MP4, atau dari WAV bila tidak ada video. Calon sampel adalah peristiwa impulsif dengan kuat ≥ 0,25 yang memenuhi tiga syarat: tidak ada peristiwa lain yang mulai 120 ms sebelum atau 30 ms sesudahnya, tidak berada di 0,35 s terakhir, dan serangannya menonjol ≥ 15 dB di atas latar pada pitanya (lebar, tinggi > 1,2 kHz, atau rendah < 250 Hz).

Dari calon itu dipilih enam sampel yang tersebar merata, dengan jenis yang beragam. Awal bunyi adalah bingkai 1 ms pertama yang ≥ 10 dB di atas latar dan ≥ −20 dB dari puncak serangannya. Pencarian berlangsung dari t − 35 ms sampai t + 80 ms. Sampel lulus bila selisihnya paling banyak ±33 ms (satu frame pada 30 fps). Pada uji, semua selisih berada di antara −0,3 dan +3 ms.

## Mengubah palet kit

1. Ubah atau tambah entri di `suara/palet.mjs`. Pakai `ton`, `derau`, dan `dentum`, dan atur `tingkat` relatif terhadap jenis sejenis.
2. Jalankan `node kit/suara/uji.mjs`. Uji ini harus LULUS: −18 ± 0,2 LUFS, puncak sejati ≤ −1 dBTP, enam sampel sinkron lulus, semua jenis berbunyi, panjang tepat, dan hasil deterministik. Dengarkan `katalog-suara.wav` yang ditulisnya.
3. Ikuti aturan perubahan kit: tetap kompatibel ke belakang, naikkan `VERSI`, dan catat di `CHANGELOG.md`. Mengubah bunyi bawaan mengubah suara video lama bila dirender ulang.

## Batasan

- Bunyi berdurasi dengan ketukan di akhir (`laci-buka`, `pintu`, `garis-sambung`) menaruh ketukannya di `t + durasi`. Gerak yang mencatat peristiwa ini perlu mengisi `durasi` sesuai lama geraknya.
- `denyut` mengandaikan denyut gambar mulai dari titik terlirih di `t`. Bila fasenya berbeda, geser `t` atau atur `periode` lewat `sesuaikan()`.
- Periksa sinkron hanya memakai peristiwa impulsif yang terpisah. Bunyi lembut seperti `whoosh`, `aliran`, dan `grid-nyala` tidak diukur.
