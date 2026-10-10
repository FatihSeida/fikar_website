# Aturan kerja agen: Series interaktif dan fitur pendukung

Disusun 10 Oktober 2026. Berlaku untuk pengerjaan Series 1–4, menu Series, beranda, dan panel admin.

## Pembagian model

| Pekerjaan | Model | Alasan |
|---|---|---|
| Mesin cerita interaktif (scrollytelling, dua kolom bergantian, lapis penjelasan, gerbang "sudah paham", latar hidup) | **Opus** | Interaksi inti dan animasi |
| Adegan 3D/2D Series 1 (Kaderisasi Go International) | **Opus** | Animasi |
| Adegan 3D/2D Series 2 (Kebijakan Kaderisasi Berbasis Bukti) | **Opus** | Animasi |
| Isi cerita Series 1 dan 2 dalam bahasa sederhana (dari PDF dan DOCX) | Sonnet | Penulisan ulang naskah |
| Halaman daftar Series 4 baris, aturan H-2, menu Series saat diarahkan tetikus, caption | Sonnet | Antarmuka biasa |
| Kerangka Series 3 (peta dan statistik kuis serta kunjungan) | Sonnet | Grafik dan tata letak |
| Kerangka Series 4 (hasil Bangun HMI Bersama), "Bicara dengan Ahmad Zulfikar" di beranda, panel pesan admin | Sonnet | Formulir dan tata letak |
| Kontrak bersama, server, integrasi, peninjauan, uji, commit | Agen utama (Opus) | Menjaga semuanya menyatu |

Aturannya: **pekerjaan animasi dan interaksi dikerjakan Opus; sisanya Sonnet.** Bila pekerjaan Sonnet ternyata butuh animasi yang rumit, catat di laporan dan serahkan ke agen utama.

## Aturan untuk setiap agen

1. **Hanya ubah berkas milikmu** (lihat `kontrak.md`, bagian "Kepemilikan berkas"). Butuh perubahan di berkas lain? Tulis di laporan akhir, jangan ubah sendiri.
2. **Jangan commit, push, atau deploy.** Agen utama yang menggabungkan dan meng-commit.
3. **Jangan mematikan server dan jangan menyalakannya lewat Bash.** Server pengembangan berjalan di `http://localhost:5000` (Vite memuat ulang otomatis). Bila mati, nyalakan dengan alat `preview_start` bernama `dev`; bila alat itu tidak ada, lewati uji tampilan dan catat di laporan. Jangan jalankan `npm run build`.
4. **Periksa tipe dengan `npx tsc --noEmit -p .`**. Abaikan galat dari berkas milik agen lain yang sedang dikerjakan; pastikan berkasmu sendiri bersih.
5. **Bahasa Indonesia yang mudah dipahami** untuk semua teks di layar. Kalimat pendek, istilah dijelaskan, tanpa jargon yang tidak perlu. Ikuti gaya penulisan situs: tanpa tanda pisah panjang (em dash) dalam kalimat.
6. **Isi rahasia tetap di server.** Teks cerita, judul seri yang belum terbit, dan isi fitur hanya datang dari API. Berkas klien tidak boleh memuat naskah seri.
7. **Ringan dan aman di ponsel**: muat three.js hanya di halaman yang memakainya, gambar adegan hanya saat terlihat, batasi resolusi (dpr ≤ 1.75), hormati `prefers-reduced-motion`, sediakan cadangan tanpa WebGL.
8. **Patuhi CSP produksi**: semua aset (model, tekstur, font, HDR) dari domain sendiri. Jangan memakai CDN, worker blob, atau `eval`. Komponen drei yang mengambil berkas dari luar (misalnya `Environment` preset, `Text` troika, dekoder Draco dari CDN) tidak boleh dipakai.
9. **Laporan akhir** singkat: berkas yang dibuat atau diubah, cara mengujinya, dan hal yang perlu diputuskan agen utama.
