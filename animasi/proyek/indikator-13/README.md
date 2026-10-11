# Indikator 13 — Kegiatan HMI sepi dari pengunjung.

Video kit 1.1.0, 21 detik, 1080 × 1920, 30 fps. Semua impor pustaka melalui `../kit/index.js`; tidak ada perubahan kit atau folder video lain.

## Adegan

- Ruang acara 6 × 5, 20 kursi dalam empat baris dan lima kolom.
- Empat hadir duduk, empat absen di luar membelakangi ruang. Cincin absen berdenyut 7–11.8.
- Empat kartu naik 12.4–13.6; empat balon dan putaran absen 13.6–14.8.
- Delapan benda emas mulai 14.8, terbang dan menjadi satu tumpukan sebelum 15.6.
- Enam baru dan dua absen masuk 15.6–17.6. **Tepat 12 dari 20 kursi terisi** pada 17.6 dan akhir. Dua absen tetap di luar.
- Seluruh benda diam mulai 18; kamera menjauh hingga 19.5. CTA `ISI KUIS`, URL bawaan `ahmadzulfikar.com/kuis`, penutup tetap `Jangan bicara HMI tanpa bukti.`

## Penyesuaian tata letak

Mengikuti aturan kit ketika angka brief mengganggu ruang layar: ruang tetap 6 × 5 di titik(0, 0.4), diputar 45° agar susunan baris terbaca. Empat absen disebar dua kali dua di r 4.15–5 dan d 1.25–4, menggantikan diagonal rapat brief agar kepala, cincin, dan balon terpisah. Kamera luas H 17.5 (awal 20.5), fokus r 1.1, d 1.1/1.2, y 0.25, menggantikan H 16 dan fokus yang kurang memuat gabungan ruang–absen. Cermin tetap H 12 dan fokus r 4.6, d 2.6; ruang, kursi, hadir hanya menjadi latar selama 6<t<13 sehingga boleh terpotong. Semua absen dan hasil tetap diperiksa. Kartu pertama bergeser r +0.18 dari kepala untuk menghindari klip 6 px pada 12.5667 saat kamera kembali.

Pion lokal menambah panel punggung abu gelap tanpa simbol agar arah membelakangi/berbalik terlihat tanpa wajah. Enam peserta baru masuk dari sisi terdekat baris tujuan; dua absen lewat depan. Bidang internal kartu/balon berputar rebah saat pendaratan, tanpa mengganti jumlah benda.

## QA

`node --check indikator-13/adegan.js` lulus. `audit.mjs` memeriksa zona pada **631 frame** (0–21, 30 fps): nol pelanggaran; 20 kursi, 4 hadir awal, 4 absen, 8 hasil, 6 peserta baru, 12 terisi pada 17.6; seek acak 3/9/15/16.6/19.5 identik dan seluruh properti benda 18 vs 20.9 identik. Tidak ada pageerror. Hasil tersimpan di `hasil/indikator-13-audit.json`.

Lembar kit 10 titik, ditambah jepret 3/9/15/16.6/19.5 diperiksa visual: nol pelanggaran zona, palet bersih, tidak ada teks bertabrakan dengan 3D, cincin dan delapan benda emas terbaca. 131 peristiwa SFX. `suara.js` meredam delapan klik emas ×0.5 dan grid ×0.35 untuk ruang dinamika. Render penuh dijadwalkan oleh root setelah source+QA selesai.

## Perintah

Jalankan dari `animasi/` di PowerShell. Chrome dipilih lewat preload lokal karena Edge pada mesin ini gagal diluncurkan.

```powershell
node indikator-13/audit.mjs
node --import ./indikator-13/browser.mjs kit/alat/buat.mjs indikator-13 --periksa --jepret 3,9,15,19.5 --paralel 1
node --import ./indikator-13/browser.mjs kit/alat/buat.mjs indikator-13 --paralel 2
```

Perintah terakhir menghasilkan MP4 bisu, MP4 bersuara, WAV, lembar, daftar peristiwa, dan laporan audio sesuai kit.

## Hasil final

Render penuh selesai: `hasil/indikator-13-suara.mp4`, H.264 1080×1920, 30 fps, 630 frame, tepat 21 detik, AAC stereo 48 kHz. Audio WAV dan AAC terukur −18.0 LUFS / −2.0 dBTP, limiter maksimum 3.1 dB. Keenam sampel sinkron lulus, selisih maksimum 2.2 ms; tanpa peringatan audio. Pemeriksaan root mengonfirmasi seek konsisten, objek beku pada penutup, serta teks ISI KUIS dan ahmadzulfikar.com/kuis terlihat.
