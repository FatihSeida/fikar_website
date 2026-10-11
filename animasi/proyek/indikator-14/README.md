# Indikator 14 — satu lingkar baca

21 detik,1080×1920,30 fps. Dibuat dari templat indikator Kit1.1.0; semua benda/gerak diimpor dari ../kit/index.js. Sembilan lentera padam satu per satu dari pinggir ke tengah; meja kosong berdenyut; lima figur datang dan duduk, buku terbuka, MINGGU1→MINGGU3, ringkasan terbang ke kanal, satu lentera dan ringkasan menjadi emas.

CTA mengikuti arahan terakhir: ISI KUIS dan ahmadzulfikar.com/kuis. Penutup tetap Jangan bicara HMI tanpa bukti. Keadaan lokal dihitung dari min(t,18); seluruh gerak selesai sebelum18. Suara wajib memakai peristiwa kit, termasuk sembilan peristiwa padam dan klik lentera akhir.

Penyesuaian sesuai dokumentasi Dunia Pustaka: empat lampu tambahan menggantung di depan bagian atas rak dengan tali0.3, bukan di atas rak yang akan keluar zona. Kanal di r3,d2.4 agar utuh di lantai, tinggi1.4 agar ringkasan0.85×1.05 muat. Label kanal dibuat terpisah lewat label3D agar terbaca tanpa berdesakan. Latar boleh terpotong ketika Cermin fokus meja; meja utama tetap diperiksa. Figur berjalan diganti pion duduk saat tiba. Ringkasan terbang ditempel sekitar15.4, lalu emas15.6–16.4; tangkapan15 menangkap proses terbang sesuai jadwalG.

## Pemeriksaan

node --check indikator-14/adegan.js
node --import ./indikator-14/browser.mjs kit/alat/buat.mjs indikator-14 --periksa --jepret 3,9,15,19.5

Lembar10titik:0 pelanggaran zona,palet bersih,65 peristiwa suara. Lembar dilihat dan final19.5 ditinjau root. Render penuh selesai: H.2641080×1920,30fps,630frame; video dan audio21.000detik.

browser.mjs wrapper lokal Chrome/headless=new karena Edge bawaan gagal launch. Kit bersama tidak diubah. Render penuh memakai perintah yang sama tanpa --periksa/--jepret.

## Audio final

Root menyelesaikan campuran lokal suara.js: klik emas0.6× dan grid0.35×. Enam sampel sinkron lulus, kenyaringan−18.0LUFS dan puncak−2.0dBTP, pembatas maksimum1.6dB menurut laporan root. Audio14 tidak diubah pada penyempurnaan audio09. ffprobe final mengonfirmasi H.2641080×1920,30fps,630frame dan AAC dengan durasi video/audio masing-masing21.000detik. Seek berulang, pembekuan3D, CTA dan penutup lolos pemeriksaan root.

