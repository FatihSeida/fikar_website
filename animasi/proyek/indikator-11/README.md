# Indikator 11 — Lembaga kekaryaan

Video memakai kit 1.1.0 langsung dari `../kit/index.js`, 21 detik, 1080×1920, 30 fps. Semua gerak dihitung dari t. SFX kit dicatat dalam daftar peristiwa: dunia muncul, pintu rolling, langkah empat pengurus, tiga balon rapat, kertas kesepakatan, kabel tersambung, lampu, klik emas, penutup dan pil.

Teks brief dipertahankan. Override pengguna dipasang sebagai `ISI KUIS` top 1450 pada 18.6–21, pil `ahmadzulfikar.com/kuis`, serta penutup `Jangan bicara HMI tanpa bukti.`

## Penyesuaian tata letak

- Dunia Jenjang tetap dibuat oleh `duniaJenjang`, tetapi posisi dan ukuran menara/komisariat dipadatkan supaya ruang karya, kabel, cabang dan rapat terbaca. Menara PB 3.3, Badko 2.7 unit, sementara cabang 2.1 unit. Komisariat dan menara abu serta opacity .27.
- Ruang karya diposisikan `titik(-2.3,.15)`, cabang `titik(.45,-1.05)`, meja `titik(.4,2.15)`. Kamera memakai `fokusUntuk` agar benda utama aman di zona 600–1440.
- Zoom Cermin tetap H12 ke ruang karya. Cabang/meja dan latar Jenjang boleh terpotong selama 6–13 detik, melalui `userData.penting(t)`. Ruang karya, papan nama kosong, rolling door, dan kabel tetap diperiksa sebagai masalah utama.
- Bangunan ruang karya memakai kit, dengan warna abu gejala dipastikan abuGelap; papan nama tetap tanpa tulisan. Denyut hanya papan dan rolling door sesuai bagian kit.
- Kabel putus menjuntai dibuat lokal dari tabung .045 unit, kemudian tersambung pada 15.2–16.2. Ini satu-satunya benda lokal.
- Dua pengurus lembaga mulai keluar saat pintu terangkat pada 12.4; bergerak ke rapat setelahnya. Dua pengurus cabang bergabung 13.4. Tiga balon muncul 13.4, 13.8, 14.2. Catatan muncul 14.6–15.2. Hanya ruang karya menjadi emas.
- Keadaan akhir 3D menetap setelah 18; kamera tetap menjauh sampai 19.5 sesuai brief.

## Pemeriksaan dan render

Playwright bawaan kit memakai Edge headless lama yang gagal pada mesin ini. `browser.mjs` hanya menyesuaikan peluncuran proses ini ke Chrome `--headless=new`; tidak mengubah kit.

Jalankan dari folder `animasi`:

```powershell
node --check indikator-11/adegan.js
node --check indikator-11/benda-lokal.js
node --import ./indikator-11/browser.mjs kit/alat/buat.mjs indikator-11 --periksa --jepret 3,9,15,19.5
# Render penuh dijadwalkan root setelah review:
node --import ./indikator-11/browser.mjs kit/alat/buat.mjs indikator-11 --gpu
```

Usulan kit (dicatat lokal agar tidak menyunting berkas bersama): opsi browser/headless dapat diteruskan melalui CLI `buat`, sebab Playwright 1.48 mengirim `--headless=old` yang sudah dihapus pada Chromium baru. Kabel putus menjuntai dengan fungsi sambung deterministik dapat menjadi varian benda kit.

Hasil QA sumber: syntax check lolos; lembar 10 titik menghasilkan 0 pelanggaran zona dan 0 warna terlarang. Daftar suara berisi 60 peristiwa. Jepret 3, 9, 15, dan 19.5 tersedia; t3 menunjukkan pintu tertutup dan kabel menjuntai terputus, t15 empat pengurus mengelilingi meja dengan catatan terbaca. Root sudah menyelesaikan render penuh dan pemeriksaan seek/freeze.

## Audio final

Video final 21.000 detik, 630 frame, H.264 1080×1920 30 fps; AAC stereo 48 kHz. `suara.js` menurunkan grid pembuka dan letup latar yang rapat, menonjolkan onset pertama tanpa memindahkan waktunya, serta membuang bunyi `muncul` yang menggandakan `balon`/`kertas` pada objek sama. Semua kejadian visual tetap mempunyai SFX, dan visual tidak berubah.

Regenerasi audio saja: `node kit/suara/buat-suara.mjs indikator-11`. Hasil final 60 peristiwa masukan → 56 dibunyikan, tanpa pemangkasan. WAV dan MP4 sama-sama −18.0 LUFS / −2.0 dBTP. Pembatas maksimum turun dari 3.6 ke 1.2 dB. Keenam sampel sinkron MP4 lulus: onset awal 0.600 terukur 0.601 (+0.7 ms); sampel lain −0.8 hingga +4.2 ms. Laporan tersimpan di `hasil/indikator-11-audio-laporan.txt`. Stream video dalam versi bisu dan bersuara disalin utuh, diverifikasi dengan SHA-256 identik.
