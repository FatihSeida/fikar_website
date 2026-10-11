# Indikator 03 — Luna

Pola perkaderan tertinggal dari tuntutan abad ke-21. Dibuat oleh agen GPT-6 Luna, lalu diperiksa dan dirapikan oleh agen utama.

Animasi 21 detik, 1080×1920, 30 fps. Keluaran video: `../hasil/indikator-03.mp4`.

Jalankan dari folder `animasi/`:

```powershell
npm run pratinjau -- indikator-03
node indikator-03/rekam.mjs --cuplik 3,9,15,19.5
node indikator-03/rekam.mjs --periksa
node indikator-03/rekam.mjs
```

Perekam lokal mengikuti kontrak perekam bersama, dengan mode headless baru dan Chrome sebagai cadangan jika Edge berhenti. Font Google membutuhkan koneksi internet. `--periksa` memeriksa font, durasi, kanvas dan teks setelah lompatan waktu mundur, serta keadaan akhir yang membeku. Pembulatan opacity teks oleh compositor browser dapat berbeda satu nilai warna dari 255 walaupun keadaan kanvas dan HTML sama.

Untuk melihat satu waktu, tambahkan `?t=9` pada alamat pratinjau.

## Efek suara

Efek suara sintetis yang mengikuti waktu adegan: ruang muncul, gerak cepat di balik jendela, denyut cermin, kartu terangkat dan terbang, usapan modul, jam kembali berjalan, lalu CTA. Tidak ada voiceover atau musik latar.

Jalankan dari folder `animasi/` setelah video tanpa suara tersedia di `hasil/indikator-03.mp4`:

```bash
node indikator-03/suara.mjs
```

Skrip membuat `hasil/indikator-03.wav` (21 detik, stereo, 48 kHz, PCM 16-bit, target sekitar −18 LUFS dan true peak −1 dBTP), lalu membuat `hasil/indikator-03-suara.mp4` dengan menyalin stream video asli dan menyandikan audio AAC 192 kb/s. Audio memudar pada 20.4–21 detik. Berkas video tanpa suara tetap utuh.
