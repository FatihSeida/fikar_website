# Kontrak bersama Series interaktif

Baca bersama `aturan-kerja-agen.md`. Kontrak kode sudah ada dan tidak diubah agen lain:

- `shared/cerita.ts`: bentuk isi cerita (`CeritaSeri`, `BabCerita`, tiga lapis penjelasan).
- `client/src/components/cerita/kontrak.ts`: antarmuka adegan (`PropsAdegan3D`, `PropsAdegan2D`, `DaftarAdegan`).
- `client/src/components/seri/tipe.ts`: props setiap tampilan halaman seri (`PropsHalamanSeri`).
- `shared/rilis.ts`: jadwal, `segeraTampil` (H-2), `labelWaktu`, `labelRilis`.
- `server/kampanye.ts` dan `server/konten/series/index.ts`: API (lihat di bawah).

## Kepemilikan berkas

| Agen | Berkas |
|---|---|
| A · Opus · mesin cerita + adegan Series 1 | `client/src/components/cerita/**` kecuali `kontrak.ts` dan `adegan/evidence/**` |
| B · Opus · adegan Series 2 | `client/src/components/cerita/adegan/evidence/**` |
| C · Sonnet · isi cerita | `server/konten/series/kaderisasiGoInternational.ts`, `server/konten/series/kebijakanKaderisasiBerbasisBukti.ts` |
| D · Sonnet · daftar dan menu Series | `client/src/pages/SeriesPage.tsx`, `client/src/components/Navbar.tsx`, fungsi `SlideSeries` di `client/src/components/sections/EvidenceTeaser.tsx`, gambar baru di `client/public/series/**` |
| E · Sonnet · kerangka Series 3 | `client/src/components/seri/SeriPemuda.tsx`, `client/src/components/seri/pemuda/**` |
| F · Sonnet · Series 4, beranda, pesan | `client/src/components/seri/SeriPahlawan.tsx`, `client/src/components/seri/pahlawan/**`, `client/src/pages/Home.tsx`, `client/src/components/sections/BicaraZulfikar.tsx` (baru), `client/src/components/admin/PesanPanel.tsx` (baru), `client/src/pages/Admin.tsx` |

## API yang tersedia

- `GET /api/seri`: daftar empat seri. Tiap item: `slug, nomor, rilis, terbit, segera`; bila `terbit` atau `segera` (H-2) juga `judul, subjudul` (caption), `tampilan`. Di localhost dan untuk admin semua judul tampil. Seri yang belum terbit tidak bisa dibuka.
- `GET /api/seri/:slug`: `{ ...seri, rilis, tampilan, cerita? }`. `tampilan` = `"cerita"` (Series 1 dan 2, berisi `cerita: CeritaSeri`), `"pemuda"` (Series 3), `"pahlawan"` (Series 4), atau `"naskah"`. Sebelum terbit menjawab 403 `{ rilis }`, kecuali admin/localhost.
- `GET /api/statistik/pemuda` (Series 3, terkunci sampai 28 Oktober kecuali admin/localhost): `kuis { total, komisariat, cabang, rataSkor, tingkat[{min,max,jumlah}], retensiLk1 (persen), programTerlaksana (persen), provinsi[{nama,jumlah}], cabangTerbanyak[], perHari[{tanggal,jumlah}] }`, `kunjungan { hari, total{kunjungan,pengunjung}, perHari[{tanggal,kunjungan,pengunjung}], provinsi[] }`, `masalah`, `tanggapan`, `ditarik`.
- `GET /api/peta-suara`: dipakai komponen `PetaSuaraKader` yang sudah ada.
- `GET /api/fitur/bangun-hmi/hasil` (terkunci sampai 25 November kecuali admin/localhost): `jumlah, komisariat, cabang, ditarik, bagian[{ id, rataRata, dipilihMendesak, cara[3], usulan }]`. Isi bagian (nama, tema, sasaran, pilihan) dari `GET /api/konten/bangun-hmi`.
- `POST /api/fitur/pesan-zulfikar`: `{ nama, komisariat?, cabang?, kontak?, pesan }` (nama 2–80, pesan 10–2000). Selalu terbuka. Admin membaca lewat `GET /api/admin/fitur/pesan-zulfikar` (kolom `nama, komisariat, cabang, kontak, kota, provinsi, createdAt, data.pesan`).

## Rupa

- Warna (CSS): latar gelap `hsl(var(--evidence))` (hijau sangat gelap), hijau `hsl(var(--primary))`, emas `hsl(var(--gold))`, gading `hsl(var(--background))`. Di three.js pakai hex: hijau gelap `#071610`/`#0B2A1E`, hijau HMI `#0E8A4F`, emas `#DCC38A`, gading `#F6F4E9`.
- Huruf: judul `font-serif` (Noto Serif), isi DM Sans. Label kecil memakai kelas `evidence-kicker`.
- Cerita interaktif berlatar hijau gelap yang **tidak polos**: misalnya butiran cahaya emas yang melayang pelan, garis kontur atau jaring tipis, cahaya radial, tekstur halus. Selaras dengan halaman `/hmi-evidence`.
- Tata letak cerita: dua kolom bergantian. Bab ganjil: penjelasan kiri, adegan kanan; bab genap sebaliknya. Adegan menempel (sticky) selama babnya digulir. Di ponsel: adegan di atas (menempel, setinggi ±40% layar), penjelasan di bawah.

## Perilaku cerita interaktif

- Setiap bab menampilkan `label`, `judul`, `inti`, dan `poin`. Tombol `lanjut.judul` membuka lapis kedua; setelah itu tombol `dalam.judul` membuka lapis ketiga (beserta `kutipan` naskah asli bila ada). Adegan menerima `lapis` (0, 1, 2) dan boleh menambah detail.
- Di akhir bab ada kotak "Sudah paham?" berisi kalimat `pahami` dan tombol "Saya paham, lanjutkan". Bab berikutnya baru terbuka setelah tombol ini ditekan. Pembaca yang kembali bisa langsung melihat bab yang sudah dibuka.
- Kemajuan disimpan per seri di `localStorage` (dibungkus try/catch). Ada daftar isi (bab yang sudah terbuka bisa diulang) dan tombol "Ulangi dari awal".
- Setelah bab terakhir: `penutup`, `rujukan` (bila ada), lalu `tanggapan` dari props (kolom tanggapan kader, berlatar terang).

## Rancangan bab dan adegan

Kunci `adegan` di isi cerita harus sama dengan kunci di `DaftarAdegan`. 3D = three.js (react-three-fiber), 2D = SVG/HTML dengan framer-motion.

### Series 1 · Kaderisasi Go International (sumber: PDF "Kontribusi HMI Menyongsong Indonesia Emas 2045")

| Bab | Kunci adegan | Jenis | Isi bab | Yang diperlihatkan adegan |
|---|---|---|---|---|
| 1 | `dunia-1947` | 3D | Yogyakarta 1947: Lafran Pane dan kawan-kawan mendirikan HMI dengan tujuan besar. 1948: Hatta, "mendayung di antara dua karang". | Perahu kecil di laut malam di antara dua karang besar (Amerika dan Uni Soviet). Lapis 1: label karang. |
| 2 | `dunia-perahu` | 3D | Bebas aktif berakar di dalam negeri: Madiun 1948, KAA Bandung 1955, Gerakan Non-Blok 1961. Syaratnya perahu kokoh dan pendayung seirama. | Pendayung di perahu: awalnya tak seirama (perahu berputar), makin digulir makin seirama dan perahu melaju. |
| 3 | `dunia-karang-baru` | 3D | Karang hari ini tidak lagi dua: Timur Tengah, Ukraina, Amerika–Tiongkok, dan perlombaan teknologi (cip, AI, data, energi). | Bola dunia dengan banyak karang/titik panas; simpul teknologi menyala. |
| 4 | `dunia-teknologi` | 2D | Teknologi tidak menang sendirian: yang menang adalah yang mampu menyerap, mengorganisasi, dan memakainya bersama. | Kepingan yang hanya tersusun menjadi satu bentuk utuh saat bergerak bersama. |
| 5 | `dunia-jejak-hmi` | 2D | HMI lahir di masa tidak tenang: revolusi, tuntutan pembubaran 1960-an, Nilai Dasar Perjuangan (keislaman, kemodernan, keindonesiaan). | Linimasa 1947 → 1960-an → NDP; tiga lingkaran yang bertemu. |
| 6 | `dunia-dua-wajah` | 2D | Dua wajah: asas tunggal 1980-an dan HMI MPO, kembali ke asas Islam 1999, alumni di mana-mana. Kebesaran HMI datang dari tetap menjadi rumah. | Rumah yang sempat terbelah lalu tetap berdiri dengan banyak jendela menyala. |
| 7 | `dunia-modal` | 2D | Modal besar (ratusan cabang, alumni di semua sektor) yang habis untuk berebut posisi, dualisme, faksi; pekerjaan dasar tertinggal. | Aliran energi dari satu sumber: sebagian bocor ke pertengkaran, sebagian sampai ke kaderisasi, tata kelola, digital. |
| 8 | `dunia-2045` | 2D | Waktunya tidak panjang: 2045 Indonesia seratus tahun, 2047 HMI seratus tahun. Kader LK 1 usia 19 tahun akan berusia 38 pada 2045. | Linimasa 2026 → 2045 → 2047 dengan sosok kader yang tumbuh. |
| 9 | `dunia-mendayung` | 3D | Pekerjaan paling tidak glamor: mengurangi pertengkaran antarsaudara. Persatuan bukan keseragaman; yang berbahaya adalah kontestasi yang tak pernah selesai. | Perahu yang separuh awaknya mendayung berlawanan (berputar), lalu seirama dan bergerak maju. |
| 10 | `dunia-go-international` | 3D | Persatuan untuk melompat: kader menembus kampus dan riset dunia, karya dibaca di luar negeri, bekerja di lembaga global lalu pulang membawa pengetahuan. | Bola dunia dengan busur cahaya dari Indonesia ke berbagai negara dan kembali pulang. |

Penutup: karang tak bisa dipindahkan, yang bisa diatur hanyalah cara mendayung; seratus tahun HMI dikenang dari seberapa jauh perahu ini sampai.

### Series 2 · Kebijakan Kaderisasi Berbasis Bukti (sumber: DOCX "HMI Evidence: Transformasi Gerakan Organisasi Berbasis Bukti")

| Bab | Kunci adegan | Jenis | Isi bab | Yang diperlihatkan adegan |
|---|---|---|---|---|
| 1 | `bukti-aturan` | 3D | Kaya aturan, miskin ingatan: ART (laporan dan database 4 bulanan), Pedoman Perkaderan, Program Kerja Nasional; Rekomendasi Kongres XXXII: 267 cabang tanpa database yang valid. | Tumpukan buku aturan yang tinggi di samping rak arsip yang kosong dan memudar. |
| 2 | `bukti-ingatan` | 2D | Ingatan pergi bersama orangnya: LPJ, memori serah terima, data LK, surat, SK, notulen dibuat berbeda-beda dan hilang saat demisioner. | Sosok pengurus dikelilingi dokumen; saat sosok pergi, dokumennya memudar. |
| 3 | `bukti-jejak` | 2D | Apa itu bukti: jejak yang bisa ditelusuri (siapa, dari struktur mana, kapan, terhubung dengan apa). Berakar pada insan akademis. | Satu dokumen dengan empat label menyala yang tersambung ke dokumen lain. |
| 4 | `bukti-identitas` | 3D | Identitas dokumen: perubahan kecil, cara dokumen memperkenalkan dirinya. Sertifikat, SK, surat tetap dibuat seperti biasa. | Sertifikat, SK, dan surat menerima cap identitas lalu tersambung satu sama lain. |
| 5 | `bukti-memori` | 3D | Memori berjenjang: komisariat → cabang → Badko → PB. Tiga syarat: manfaat dulu, standar di belakang, mengalir kembali ke bawah. | Piramida empat tingkat dengan butiran yang naik lalu kembali turun. |
| 6 | `bukti-kaderisasi` | 3D | Pilar 1: membaca perjalanan kader (formulir LK, sertifikat LK 1, SK komisariat, sertifikat LK 2), tahu di titik mana kader berhenti. | Jalur perjalanan dengan stasiun LK 1 → pengurus → LK 2; titik-titik kader yang berhenti di tengah jalan. |
| 7 | `bukti-tatakelola` | 2D | Pilar 2: tata kelola dibaca sepanjang periode: masa SK, regenerasi terlambat terlihat lebih awal, laporan 4 bulanan dari jejak yang ada, serah terima memindahkan pengetahuan. | Lini masa kepengurusan dengan batang SK; satu batang yang lewat waktunya menyala sebagai peringatan. |
| 8 | `bukti-kebijakan` | 2D | Pilar 3: forum (RAK sampai Kongres) dibuka dengan gambaran bersama; klaster cabang dihitung; proposal berdasarkan kebutuhan nyata kader. | Meja musyawarah dengan layar bersama di tengah. |
| 9 | `bukti-siklus` | 3D | Ekosistem: kaderisasi → jejak → tata kelola → kebijakan → kaderisasi. Identitas dokumen adalah benangnya. | Cincin tiga simpul yang berputar dengan benang; lapis 1: satu mata rantai putus dan putarannya berhenti. |
| 10 | `bukti-menyusup` | 2D | Transformasi bertahap, AI sebagai pembaca bukan pengganti musyawarah, aturan main data (milik lembaga, UU PDP), dan batas konsep (fondasi, bukan langit-langit). | Anak tangga yang terbuka satu per satu, dengan perisai pelindung data. |

Penutup: dari organisasi yang ingatannya bergantung pada orang menjadi organisasi yang mengingat dirinya sendiri. "Jangan bicara HMI tanpa bukti."

## Uji tampilan

- Halaman seri: `http://localhost:5000/series/kaderisasi-go-international`, `.../kebijakan-kaderisasi-berbasis-bukti`, `.../hmi-dan-para-pemuda-untuk-2045`, `.../menjadi-pahlawan-bersama-membangun-hmi`. Di localhost semua terbuka.
- Tangkapan layar tanpa layar: `python "C:/Users/fatih/AppData/Local/Temp/claude/D--Dev-Activities-Fikar-Website/f819d3b9-b88a-4641-91eb-78ccfd3d6084/scratchpad/cdp_shot3d.py" <lebar> <tinggi> <ponsel 0|1> <nama> <url> "<js langkah 1>" ["<js langkah 2>" ...]`. Setiap langkah dijalankan lalu difoto ke folder scratchpad (`<nama>_<n>.png`). WebGL berjalan lewat SwiftShader, jadi lambat tetapi akurat. Gunakan nama berkas dengan awalan agenmu supaya tidak bertabrakan.
