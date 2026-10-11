# Animasi Reels: Cara Mengisi Kuis "Seberapa Evidence Komisariatmu?"

Tanggal: 9 Oktober 2026

## Tujuan

Video Reels Instagram berdurasi 30 detik yang menjelaskan cara mengisi kuis audit komisariat di ahmadzulfikar.com/kuis. Gayanya mengikuti video penjelas isometrik ala "How sites survive a DDoS": latar gelap, judul tetap di atas, alur langkah yang menyala bergantian, adegan 3D di tengah, dan panel angka "live" di bawah.

Animasi dibuat dengan three.js di folder `animasi/` di root proyek, lalu direkam frame demi frame menjadi MP4. Kode situs dan `package.json` utama tidak berubah.

## Keluaran

Tiga versi dari brief yang sama untuk dibandingkan, masing-masing dibuat satu agen: Haiku 5.5 (`animasi/kuis-evidence-haiku/`), Sonnet 5.5 (`animasi/kuis-evidence-sonnet/`), dan Opus 5.5 (`animasi/kuis-evidence-opus/`). Perekam bersama `animasi/rekam.mjs` dan kontraknya di `animasi/README.md` dibuat lebih dulu.

- `animasi/hasil/kuis-evidence-<model>.mp4`: 1080×1920, 30 fps, 900 frame, H.264 (`yuv420p`), tanpa suara. Musik ditambahkan saat unggah di Instagram atau CapCut.

## Alur 30 detik

Teks tetap di atas: judul **Seberapa Evidence Komisariatmu?** dan alur `buka → jawab → perdalam → angka → hasil`. Langkah yang sedang berjalan menyala.

| Detik | Langkah | Keterangan di layar | Adegan 3D | Panel bawah |
|---|---|---|---|---|
| 0–3 | pembuka | Cara mengisi kuis audit komisariat · 7–10 menit, tanpa daftar | Kamera turun ke papan gelap, jalur menyala | Muncul perlahan |
| 3–7 | buka | Buka ahmadzulfikar.com/kuis, tekan Mulai kuis | Gerbang berlabel `/kuis` menyala, kubus emas muncul | — |
| 7–17 | jawab | Jawab 20 pertanyaan sesuai keadaan sekarang, bukan harapan | Kubus melompati 20 petak dalam 6 gugus, petak menyala, nama kelompok muncul | `Pertanyaan n/20`, skor naik, 6 batang kelompok terisi |
| 17–21 | perdalam | Opsional: 10 soal lanjutan tentang kader pasca-LK 2 dan LK 3 | Jalur cabang bergaris putus berlabel LK 2 dan LK 3 | `Lanjutan n/10` |
| 21–24 | angka | Opsional: 4 angka, retensi kader dan keterlaksanaan program | 4 pilar kecil naik | Persen retensi dan keterlaksanaan program |
| 24–28 | hasil | Dapat skor, tingkat, temuan, dan laporan PDF | Menara naik melewati 4 pita tingkat, berhenti di "Mulai Membaca Bukti" | `Skor 38/60` + tingkat |
| 28–30 | penutup | Jangan bicara HMI tanpa bukti. · ahmadzulfikar.com/kuis | Kamera menjauh | — |

### Fakta kuis yang dipakai (dari `client/src/lib/kuis.ts` dan `client/src/pages/KuisPage.tsx`)

- 20 pertanyaan inti dalam 6 kelompok, berurutan: Kaderisasi (5), Tata Kelola (4), Pengetahuan (3), Target Program (3), Evaluasi dan Arsip (3), Data dan Jaringan (2).
- Tiap jawaban bernilai 0–3, skor maksimal 60.
- 10 soal lanjutan opsional: 5 pasca-LK 2 dan 5 pasca-LK 3.
- 4 angka opsional: peserta LK 1, yang masih aktif, program direncanakan, dan program terlaksana.
- 4 tingkat hasil: Titik Berangkat (0–15), Mulai Mencatat (16–30), Mulai Membaca Bukti (31–45), Bukti Menjadi Kebiasaan (46–60).

### Angka contoh

Panel memakai angka contoh dan selalu memuat label **contoh**: skor akhir 38/60 (tingkat Mulai Membaca Bukti), persen per kelompok, dan persen retensi/keterlaksanaan. Angka-angka itu harus konsisten satu sama lain: jumlah skor per pertanyaan = 38, dan persen kelompok dihitung dari skor itu dengan rumus yang sama seperti `hitungKelompok` di `KuisPage.tsx`.

## Tampilan

- **Warna:** latar `hsl(153 50% 7%)` (`--evidence`) dengan grid halus. Petak belum dijawab hijau tua, petak sudah dijawab zamrud terang (turunan `--primary`), petak aktif dan kubus komisariat emas `hsl(42 52% 58%)` (`--gold`).
- **Cahaya:** bloom lembut pada petak yang menyala dan menara hasil.
- **Kamera:** ortografis isometrik, bergeser pelan mengikuti kubus.
- **Font:** Noto Serif (judul, penutup), DM Sans (keterangan), mono (alur langkah, panel), seperti di situs.
- **Zona aman Instagram:** semua teks dan panel penting berada di antara y≈220 dan y≈1480, serta menjauhi ±140 px di sisi kanan. Area di bawah y≈1480 dibiarkan untuk nama akun dan keterangan Instagram.

## Struktur dan cara kerja

```
animasi/
  package.json      ← devDependency: playwright-core
  README.md         ← cara pratinjau dan render
  rekam.mjs         ← perekam umum: node rekam.mjs <nama-animasi>
  kuis-evidence-haiku/   ← versi agen Haiku 5.5
  kuis-evidence-sonnet/  ← versi agen Sonnet 5.5
  kuis-evidence-opus/    ← versi agen Opus 5.5
    index.html      ← judul, alur langkah, keterangan, panel (HTML/CSS)
    adegan.js       ← adegan three.js dan linimasa 30 detik
  hasil/            ← MP4 keluaran (di-.gitignore)
```

- `three` dan `vite` diambil dari `node_modules` root proyek yang sudah ada (three 0.170). `animasi/package.json` hanya menambah `playwright-core`.
- **Kontrak halaman animasi:** halaman menyediakan `window.DURASI` (detik), `window.siap` (Promise yang selesai setelah font dan adegan siap), dan `window.tampilkan(t)` yang menggambar keadaan tepat pada detik `t`, termasuk teks HTML-nya. Seluruh animasi dihitung dari `t` (tanpa acak tak berbenih, tanpa jam internal), sehingga setiap frame bisa diulang persis.
- **Pratinjau:** `npm run pratinjau` di `animasi/` menjalankan Vite untuk `kuis-evidence/`. Animasi berputar terus mengikuti jam browser. `?t=12` membekukan tampilan di detik 12.
- **Render:** `npm run rekam kuis-evidence` menjalankan Vite secara terprogram, membuka Microsoft Edge tanpa jendela (`channel: "msedge"`, viewport 1080×1920), menunggu `window.siap`, lalu untuk setiap frame `i` memanggil `tampilkan(i / 30)` dan mengambil tangkapan layar. Gambar dialirkan ke ffmpeg (`image2pipe`, libx264, `yuv420p`, `+faststart`) menjadi `hasil/kuis-evidence.mp4`.
- Font Google dimuat dari internet, jadi render perlu koneksi.

## Pemeriksaan

1. Pratinjau dibekukan di detik 2, 5, 12, 19, 22, 26, dan 29. Tangkapan layar tiap detik itu dicek: teks benar, tidak terpotong, berada di zona aman, dan adegan sesuai langkah.
2. Konsol browser bebas galat.
3. `ffprobe` pada MP4: durasi 30,0 detik, 900 frame, 1080×1920, `h264`, `yuv420p`.
4. MP4 dikirim ke pengguna untuk ditonton.

## Di luar cakupan

- Suara, musik, atau sulih suara.
- Versi feed 4:5 atau durasi lain.
- Perubahan pada kode situs.
