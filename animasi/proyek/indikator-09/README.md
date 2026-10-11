# Indikator 09 — forum pertanyaan kader

21 detik, 1080×1920, 30 fps. Dibuat dari templat indikator Kit 1.1.0, mengimpor ../kit/index.js. Tidak ada teks Arab, simbol agama, atau figur beribadah. Forum biasa: peserta redup, sepuluh kertas masuk kotak, tiga tema emas, pemateri bergabung duduk, dua lentera menyala.

CTA mengikuti arahan terakhir: ISI KUIS dan ahmadzulfikar.com/kuis; penutup tetap Jangan bicara HMI tanpa bukti. Semua gerak memakai waktu t; keadaan lokal memakai min(t,18), sehingga 3D berhenti sebelum kartu akhir. Efek suara memakai peristiwa kit dan catat untuk panah/lentera.

Penyesuaian tata letak: memakai dunia pustaka kit (rak menghadap kamera, bangku rendah, lantai y0.1). Kotak digeser ke r2.2,d2.6 untuk menjaga celah dari peserta kanan. Kamera Langkah kembali ke fokus dunia kit agar kedua rak tetap utuh. Tema memakai panel tegak 1.4×0.5 pada d1.2,y1.05; label terbaca di depan meja dan tidak tertutup lampu. Pemateri duduk di r0.55,d−0.6 agar wajah polos/kepalanya tidak tertutup lentera tengah. Latar boleh terpotong ketika Cermin fokus kotak; benda utama kotak tetap diperiksa. Emas mulai tepat t15 dan selesai15.8; tangkapan15 menunjukkan awal perubahan,16.6 hasil emas lengkap.

## Pemeriksaan

node --check indikator-09/adegan.js
node --import ./indikator-09/browser.mjs kit/alat/buat.mjs indikator-09 --periksa --jepret 3,9,15,19.5

Lembar10titik:0 pelanggaran zona, palet bersih,87 peristiwa suara. Lembar dan tangkapan resolusi penuh dilihat; tema dipindahkan setelah pemeriksaan visual agar ketiga label terbaca. Render penuh selesai: MP4 H.2641080×1920,30fps,630frame; video dan audio21.000detik.

browser.mjs adalah wrapper lokal Chrome/headless=new karena Edge bawaan gagal diluncurkan pada mesin ini; kit bersama tidak diubah. Render penuh menggunakan perintah sama tanpa --periksa/--jepret.

## Audio final

Campuran lokal suara.js menurunkan grid menjadi0.35× dan klik emas0.6×. Dunia memakai lima bunyi kelompok; sepuluh kartu masing-masing tetap memiliki desir lempar dan ketukan mendarat, sementara letup/hilang duplikat dibisukan. Tema tetap memiliki tiga desir/lipat dan tiga klik emas. Waktu peristiwa tidak digeser; visual dan kit tidak diubah.

87peristiwa visual →48bunyi,39lapisan duplikat dibisukan,0dipangkas otomatis. WAV48kHz stereo16bit dan AAC192k,21.000detik. WAV/AAC−18.0LUFS,−2.0dBTP; pembatas maksimum1.7dB. Keenam sampel sinkron otomatis lulus: +0.7,+2.0,−0.3,+26.5,+1.8,+0.0ms. Pemeriksaan tambahan pada campuran final: klik tema15.0→+0.75ms; kertas pemateri15.8→+26.5ms. Pemeriksaan sasaran memakai dua calon khusus sehingga tidak menyatakan keduanya terisolasi dari ekor bunyi lain.

Laporan: laporan-suara-final.txt dan laporan-sasaran-suara.json. Regenerasi: node kit/suara/buat-suara.mjs indikator-09. Seek berulang dan pembekuan3D lolos pemeriksaan root; CTA dan penutup terlihat.

