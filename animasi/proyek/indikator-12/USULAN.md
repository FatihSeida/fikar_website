# Usulan lokal dari indikator-12

Kit 1.1.0 tidak diubah.

- Tambahkan opsi `ukuranIsi` dan `emas: "rangka"` pada `stanPajangan`. Isi bawaan relatif kecil ketika empat stan berada dalam satu layar. Video ini mengganti `bagian.isi` secara lokal dan membatasi `bagian.emas` pada meja/kepala agar karya tetap terbaca.
- Tambahkan pembuat petak kosong tegak putus-putus. `garisPutus({ persegi })` saat ini menyediakan persegi tanah; video ini memakai `garisDari` lokal sebagai petak tegak dengan denyut kit.
- Tambahkan opsi ukuran judul format indikator agar brief 44 px tidak perlu kelas CSS lokal.
- Alat render bisa menyediakan pilihan browser serta headless baru melalui argumen. Video ini memakai preload `browser.mjs` untuk Chrome karena Edge di lingkungan produksi gagal diluncurkan.
