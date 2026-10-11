# Indikator 12

Dies Natalis tidak lagi semarak dengan kegiatan ilmiah, sosial, seni, dan karya.

Video final 21 detik, 630 frame, 1080 × 1920, 30 fps, memakai kit 1.1.0 melalui `../kit/index.js`. Render penuh telah diselesaikan pengendali produksi; video bisu dan versi bersuara tersedia di `hasil/`.

## Adegan

- 0.6–2.0: panggung abu, pita, kue dua tingkat, dan delapan penonton muncul.
- 2.0–3.0: tepuk singkat; penonton kemudian diam. Pita bergoyang pelan, melambat 6.0–6.6, lalu berhenti.
- 7.0–11.8: empat petak kosong tegak dengan garis putus-putus zamrud berdenyut.
- 12.4–14.4: kue/pita pindah ke sudut; stan TULISAN, RISET, SOSIAL, SENI muncul berurutan setiap 0.4 detik.
- 14.4–15.2: empat meja dan kepala stan menjadi emas; isi karya tetap kontras.
- 15.2–17.5: delapan penonton berjalan mendekat, dua orang untuk setiap stan.
- 18.0–21.0: objek 3D diam, kamera menjauh; penutup tetap “Jangan bicara HMI tanpa bukti.” serta ISI KUIS dan `ahmadzulfikar.com/kuis`.

## Penyesuaian tata letak

- Panggung 6.2 × 0.4 × 3.2 dan menghadap layar agar empat stan terpisah dengan jelas, menggantikan 5 × 0.4 × 3 dalam brief. Tangga bawaan kit ditiadakan karena brief meminta pelat panggung saja.
- Stan 1.12 × 1.65 × 0.65; isi lokal memperbesar tumpukan/lembar tulisan, tiga batang grafik, dua figur bergandengan, dan bingkai seni abstrak agar terbaca pada layar ponsel. Rangka berasal dari `stanPajangan`, kertas dari `tumpukanKertas`, figur dari `pion`.
- Bagian emas dibatasi pada meja dan kepala keempat stan agar isi karya tidak melebur dalam bloom. Panel tetap gelap; karya tidak kehilangan bentuk.
- Kue diperkecil 25% dan pita menjadi 22% ketika mencapai sudut agar tidak menutup stan. Judul utama ditetapkan 44 px melalui CSS lokal, dua baris pada QA. Label stan digeser 18 px ke atas agar tidak menyentuh kepala stan.
- Semua benda penting tetap diperiksa, tanpa `abaikanZona` atau pengecualian waktu.

## Perintah PowerShell dari `animasi/`

```powershell
npm run baru -- indikator-12 --format indikator --judul "Dies Natalis tidak lagi semarak dengan kegiatan ilmiah, sosial, seni, dan karya."
node --check indikator-12/adegan.js
node --check indikator-12/benda-lokal.js
node --import ./indikator-12/browser.mjs kit/alat/buat.mjs indikator-12 --periksa --jepret 3,9,15,19.5
node indikator-12/periksa-lokal.mjs
# Render penuh (sudah selesai):
node --import ./indikator-12/browser.mjs kit/alat/buat.mjs indikator-12 --gpu
# Buat ulang audio saja, menyalin stream video yang sudah ada:
node kit/suara/buat-suara.mjs indikator-12
```

`browser.mjs` memakai Chrome headless baru karena Edge pada mesin produksi langsung menutup saat diluncurkan. Berkas ini hanya menyesuaikan browser lokal, tanpa mengubah kit.

## Hasil QA

- Lembar sepuluh titik kit: 0 pelanggaran zona, palet bersih, 98 peristiwa bunyi kit.
- Jepret 3, 9, 15, 19.5 detik diperiksa visual: gejala, petak kosong, empat karya emas, dan kartu akhir sesuai brief; tidak ada teks yang bertabrakan dengan benda penting.
- Audit lokal: kontrak 21 detik / 30 fps / 1080 × 1920 / kit 1.1.0; judul 44 px dan dua baris; 0 kesalahan halaman.
- Pemeriksaan zona setiap 0.25 detik: 0 pelanggaran.
- Screenshot t9 identik setelah melompat ke t19.5 dan t3, SHA256 `03449593d81e28b3da8f649badf0fc97989d919a572d30081508f3d753cfb1d9`.
- Posisi, skala, rotasi, dan visibilitas objek narasi sama persis pada t18 dan t21. Kamera akhir tetap boleh bergerak sesuai brief.
- `hasil/indikator-12-qa-lokal.json` menyimpan audit tambahan.
- `suara.js` mengalikan kuat empat `klik-emas` dengan 0.6, mempertahankan waktu dan pan. Ini mengurangi puncak gabungan pada 14.4 detik. Visual dan kit tetap sama; pembuatan ulang audio menyalin stream video.
- Audio final: 98 peristiwa masuk, 85 dibunyikan, 13 dipangkas, tanpa jenis tak dikenal. Ebur128 WAV dan MP4: −18.0 LUFS / −2.0 dBTP. Limiter turun dari 4.6 dB menjadi 0.6 dB maksimum (18.28 detik); enam pemeriksaan sinkron lulus, selisih 0.0–1.8 ms. Laporan lengkap: `hasil/indikator-12-laporan-audio.txt`.
- ffprobe final: H.264 1080 × 1920, 30/1 fps, 630 frame, video/audio masing-masing 21.000 detik; AAC stereo 48 kHz. `hasil/indikator-12-ffprobe-final.json` menyimpan rincian. Hash stream video bisu dan bersuara sama: `577a89bf9391c6c2632451330194b436915e1f511a4146eb76ca99e6dd8aaa5f`.
