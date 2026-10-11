# Indikator 10 — Pengetahuan ke-HMI-an

Video 21 detik, 1080×1920, 30 fps, kit 1.1.0. Source dibuat melalui templat `npm run baru -- indikator-10 --format indikator --judul ...` dan mengimpor `../kit/index.js`.

## Menjalankan

Dari folder `animasi/` di PowerShell:

```powershell
npm run buat -- indikator-10 --pratinjau
node --import ./indikator-10/browser.mjs kit/alat/buat.mjs indikator-10 --periksa --jepret 3,9,15,19.5
```

`browser.mjs` adalah penyesuaian lokal untuk Chrome 154 headless baru. Edge/headless lama pada alat bersama gagal di lingkungan ini; berkas kit tidak diubah. Bila render penuh dijadwalkan, gunakan:

```powershell
node --import ./indikator-10/browser.mjs kit/alat/buat.mjs indikator-10 --gpu
```

Render visual penuh dan audio final sudah selesai. Keluaran final: `../hasil/indikator-10-suara.mp4`; versi bisu: `../hasil/indikator-10.mp4`. Audio menggunakan SFX kit dengan penyesuaian lokal `suara.js`: kuat tiga `klik-emas` serentak pada 14.2 detik dikali 0.6 (0.7 → 0.42).

## Alur dan penyesuaian

- Gejala: jalan berhenti sesudah gerbang LK 1. Empat kader berjalan berjarak 0.5 detik, berhenti menyebar di bibir jalan, menoleh, lalu pudar sampai opacity 0.15. Komisariat abu tidak terjangkau.
- Cermin: kamera fokus ke bibir patahan; denyut zamrud hanya pada tepi patahan, 7.0–11.8.
- Langkah: tiga ubin KONSTITUSI / SEJARAH / STRUKTUR muncul 12.4–14.2, emas 14.2–15.0; dua kader menapakinya dan masuk pintu sebelum 17.6. Komisariat pulih ke zamrudRedup.
- Seluruh gerak 3D sudah selesai pada 18; kamera menjauh sesuai jadwal kartu akhir. Semua keadaan dihitung dari t; rotasi menoleh ditambahkan sesudah gerak kit mengembalikan rotasi dasar setiap frame.
- Tata letak memakai Dunia Kader kit: bangunan dan tangga dipadatkan, fokus `d.fokus`, jalan enam ubin alih-alih sembilan. Tiga ubin terakhir disembunyikan sejak awal dan diganti hasil pada titik yang sama.
- Gerbang LK 1 diperkecil ke 0.58 alih-alih 0.8 agar tidak menutupi empat siluet dan tangga; letak sedikit sebelum ubin ketiga agar bibir patahan terbaca.
- Kecepatan jalan dihitung oleh kit dari `durasi`: kader lama tiba 3.0–4.5; kader lanjutan menempuh jalur 1.85 detik agar jendela 15.0–17.6 terpenuhi.
- Label ubin adalah HTML mikro warna latar di atas emas, berjangkar pada masing-masing ubin. Warna teks gelap menjaga kontras terhadap bloom.
- Ajakan mengikuti override pengguna: label HTML `ISI KUIS` di top 1450 masuk 18.6–19.2 dan pil `ahmadzulfikar.com/kuis`. Penutup tetap “Jangan bicara HMI tanpa bukti.”

## QA terakhir

- `node --check indikator-10/adegan.js` dan `node --check indikator-10/benda-lokal.js`: lulus.
- Alat kit: 21 s, 30 fps, 1080×1920, versi 1.1.0; 10 titik; **0 pelanggaran zona**, **0 warna terlarang**.
- **80 peristiwa bunyi** terdaftar, termasuk langkah, putar, padam, denyut, muncul, klik emas, pintu, dan struktur kartu akhir.
- Lembar: `../hasil/indikator-10-lembar.png`.
- Cuplikan penuh: `../hasil/indikator-10-t3.png`, `-t9.png`, `-t15.png`, `-t19.5.png`.
- Lembar serta cuplikan t3/t15 ditinjau visual; tiga label emas jelas dan tepat pada ubin; objek penting muat zona.

## Validasi audio final

Audio saja dibuat ulang dengan `node kit/suara/buat-suara.mjs indikator-10`; tidak ada render ulang visual.

- WAV 21.000 detik, 48 kHz, stereo, 16-bit; 80/80 peristiwa dibunyikan, tanpa penggabungan, pemangkasan, atau jenis tidak dikenal.
- Loudness WAV dan MP4 AAC: **−18.0 LUFS**; true peak **−2.0 dBTP** (ebur128 dan pemeriksaan internal cocok).
- Pembatas puncak maksimum turun dari 4.9 dB pada tiga klik serentak menjadi **1.0 dB** (0.90 s); aktif pada 3.53% sampel. **Tidak ada peringatan** pada pembuatan audio terakhir.
- Semua 6 titik sinkron audio MP4 lulus: selisih 0.0–2.3 ms, termasuk masuk kader, langkah, kartu akhir, dan pil.
- Video bisu tidak berubah: SHA256 sebelum dan sesudah audio `260BF4A43E3018CFF27F965A5A0B3EE9064C0B949BC3DA91839367F53C13A3AF`.
- Pemeriksaan seek dan freeze oleh root lulus; bukti `../hasil/indikator-10-determinisme.json`.
