# Usulan kit dari Indikator 10

Tidak mengubah USULAN.md bersama.

- Tambahkan benda `tepiJalanPatah({arah,lebar})` dengan bibir bergerigi dan sasaran denyut hanya garis patahan. Versi lokal ada pada `benda-lokal.js`.
- Tambahkan gerak `menoleh` yang memberi rotasi ±30° dengan waktu berhenti yang tegas; saat ini evaluasi lokal menambah rotasi pada hasil reset gerak kit setiap frame.
- Tambahkan preset peramban Chrome headless baru pada alat, sebab Edge/headless lama gagal di mesin ini. Sementara gunakan preload `browser.mjs` lokal.
- Dunia Kader menyediakan resep indikator 10, tetapi gerbang tambahan skala 0.8 menutupi figur di jalan. Opsi ukuran gerbang/gerbang latihan yang lebih kecil dapat membantu preset ini.
