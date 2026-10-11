# Indikator 04 — Sol

Kader penerus kurang melanjutkan pandangan visioner para pendahulu. Dibuat oleh agen GPT-6.1 Sol, lalu diperiksa oleh agen utama.

Animasi 21 detik, 1080×1920, 30 fps. Keluaran: `../hasil/indikator-04.mp4`.

Jalankan dari folder `animasi/`:

```powershell
npm run pratinjau -- indikator-04
node indikator-04/rekam.mjs --cuplik 3,9,15,19.5
node indikator-04/rekam.mjs --periksa
node indikator-04/rekam.mjs
```

Perekam lokal mengikuti kontrak perekam bersama, dengan mode headless baru dan Chrome sebagai cadangan jika Edge berhenti. Tidak perlu mengubah perekam bersama atau memasang paket tambahan. Font Google membutuhkan koneksi internet.

`--periksa` memeriksa font, durasi, pengulangan frame setelah lompatan waktu mundur, dan keadaan akhir yang membeku. Pendar dibatasi ke hasil emas: buku terbuka, kelima paragraf, dan satu lentera.

Untuk melihat satu waktu, tambahkan `?t=9` pada alamat pratinjau.

Efek suara disintesis lokal tanpa voiceover, sampel eksternal, atau musik latar. Setelah video asli selesai direkam, jalankan:

```powershell
node indikator-04/suara.mjs
```

Perintah ini membuat `../hasil/indikator-04.wav` (21 detik, stereo 48 kHz) dan `../hasil/indikator-04-suara.mp4` (AAC 192 kbps). Stream video disalin tanpa pengodean ulang; video asli tetap tersedia. Bunyi buku, kertas, ketukan, denyut cermin, dan chime singkat mengikuti waktu di `adegan.js`.

Mastering menargetkan sekitar −18 LUFS dengan batas true peak maksimal −1 dBTP. Skrip memeriksa loudness AAC, metadata, dan kesamaan hash stream video; daftar cue serta hasil QA tersimpan di `../hasil/indikator-04-suara-cue.json`. Gambar gelombang ada di `../hasil/indikator-04-gelombang.png`. Memerlukan `ffmpeg` dan `ffprobe` di PATH.
