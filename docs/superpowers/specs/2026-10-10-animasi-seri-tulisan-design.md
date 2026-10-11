# Seri Animasi Tiga Tulisan HMI Evidence

Tanggal: 10 Oktober 2026

Tiga video animasi three.js berdurasi 50–60 detik, satu untuk setiap tulisan. Masing-masing dikerjakan satu agen Opus 5.5 secara bersamaan. Skenario di bawah ditulis pengguna dan menjadi acuan utama.

| Video | Tulisan sumber | Folder | Keluaran |
|---|---|---|---|
| 1 | `D:\Dev Activities\Writing Project\09_Ikhtiar_HMI_Evidence_Transformasi_Gerakan_Organisasi_Berbasis_Bukti\Ikhtiar_HMI_Evidence_Transformasi_Gerakan_Organisasi_Berbasis_Bukti.pdf` | `animasi/ikhtiar-hmi-evidence/` | `hasil/ikhtiar-hmi-evidence-suara.mp4` |
| 2 | `D:\Dev Activities\Writing Project\08_Kontribusi_HMI_Menyongsong_Indonesia_Emas_2045_HMI_Indonesia_dan_Dunia\Kontribusi_HMI_Menyongsong_Indonesia_Emas_2045_HMI_Indonesia_dan_Dunia.pdf` | `animasi/kontribusi-hmi-2045/` | `hasil/kontribusi-hmi-2045-suara.mp4` |
| 3 | `D:\Dev Activities\Kongres Project\Claude outputs\Mewujudkan HMI dengan Ekosistem Berbasis Bukti (Evidence-based).pdf` | `animasi/ekosistem-berbasis-bukti/` | `hasil/ekosistem-berbasis-bukti-suara.mp4` |

## Aturan bersama

- **Format:** 1080×1920, 30 fps, H.264 + AAC. Perekam `animasi/rekam.mjs` dan kontrak halamannya dijelaskan di `animasi/README.md`. Versi tanpa suara `hasil/<nama>.mp4` dihasilkan perekam; versi bersuara `hasil/<nama>-suara.mp4` dihasilkan skrip suara di folder masing-masing.
- **Bahasa visual satu seri** (sama dengan video kuis `animasi/kuis-evidence-opus-intro/`):
  - grid hijau gelap (`hsl(153 50% 7%)`);
  - emas (`hsl(42 52% 58%)`) hanya untuk benda yang punya identitas atau bukti;
  - garis zamrud untuk jejak dan keterhubungan;
  - abu-abu untuk ingatan yang hilang atau terputus;
  - figur pion tanpa wajah;
  - kamera ortografis isometrik.
- **Objek harus dikenali.** Kitab, perahu, lemari, gapura, menara, dan benda lain dimodelkan sebagai benda yang jelas bentuknya, bukan kubus abstrak. Ini video tentang tata kelola organisasi dan narasi sejarah, bukan diagram jaringan.
- **Teks:** teks dan label dalam skenario dipakai kata per kata. Font sama dengan seri kuis: Noto Serif, DM Sans, dan mono untuk label kecil. Header kecil tetap di atas berisi "HMI EVIDENCE" dan judul pendek tulisan.
- **Zona aman Instagram:** semua teks penting berada di y 220–1480 dan x 60–940.
- **Efek suara:** disintesis dengan kode (tanpa sampel unduhan, tanpa musik), deterministik, dan waktunya diambil dari modul isyarat yang sama dengan animasi. Mastering sekitar −18 LUFS, true peak ≤ −1 dBTP. Pola acuannya `animasi/kuis-evidence-opus-intro/isyarat.js` dan `suara.mjs`.
- **Fakta:** bila skenario berbeda dengan tulisan sumber, teks skenario tetap dipakai dan perbedaannya dilaporkan.

## Skenario (dari pengguna)

Ketiganya tetap memakai bahasa visual yang sama dengan poster kuis supaya terasa satu seri: grid hijau gelap; emas hanya untuk benda yang punya identitas atau bukti; garis zamrud untuk jejak dan keterhubungan; abu-abu untuk ingatan yang hilang atau terputus; figur pion tanpa wajah; kamera ortografis isometrik.

Durasi tiap video sekitar 50–60 detik, dan bisa dipangkas menjadi 30 detik untuk Reels.

### Video 1 — Ikhtiar HMI Evidence: Transformasi Gerakan Organisasi Berbasis Bukti

Pesan inti: nilai bertahan bukan karena terus disebut, tetapi karena bisa ditelusuri jalannya sampai ke sumber.

Objek utama: kitab terbuka, rantai cahaya, ruang kuliah 1947, dua ubin kalender, lima lempeng fondasi, kartu program kerja.

1. **Pembuka (0–6 detik).** Kitab terbuka naik dari grid. Dari halamannya keluar untaian titik cahaya yang saling menyambung menjadi rantai, berjalan mundur jauh ke titik asal yang bersinar emas.
   - Teks: "Isi tanpa jalan tidak bisa dipercaya."
2. **Satu nada (6–12 detik).** Puluhan figur dari berbagai sudut grid, dengan warna jaket berbeda, berbalik menghadap ke satu titik yang sama. Garis halus menyambung mereka ke titik itu.
   - Teks: "79 tahun, berbeda generasi, tetap satu nada."
3. **Asal mula (12–20 detik).** Kamera masuk ke ruang kuliah 1947. Satu figur berdiri di depan, 14 lainnya menyala satu per satu.
   - Label: "Yogyakarta, 5 Februari 1947."
4. **Tanggal lahir (20–27 detik).** Dua ubin kalender berdiri di samping figur pendiri, bertuliskan 5 Februari 1922 dan 5 Februari 1947, keduanya bersinar sama. Ubin pertama berputar dan berganti menjadi 12 April 1923. Figur pendiri melangkah mundur keluar dari cahaya, dan sorotan tetap tinggal pada ruang kuliah.
   - Teks: "Yang diikuti adalah nilainya, bukan sosoknya."
5. **Estafet (27–33 detik).** Dari ruang kuliah, figur-figur berjalan berantai di sepanjang garis waktu dan saling menyerahkan titik emas kecil. Rumah-rumah komisariat tumbuh di kiri kanan jalan.
6. **Distorsi (33–39 detik).** Di beberapa titik, rumah komisariat berubah kusam. Pintu LK menjadi gerbang cap stempel yang hanya mengecap figur lewat. Satu figur di puncak tumpukan menekan figur di bawahnya. Meja forum hanya berisi kursi-kursi yang berpindah tempat.
   - Teks: "Yang tersisa kadang hanya bentuknya."
7. **Rutinisasi karisma (39–45 detik).** Figur pendiri larut menjadi cetak biru bangunan. Lima lempeng turun menjadi fondasinya: NDP, Mission, Sejarah, Praktik, Konstitusi.
8. **Ujian lima lapis (45–51 detik).** Sebuah kartu program kerja meluncur ke atas fondasi. Lima lempeng menyala satu per satu seperti diperiksa. Kartu yang lolos berubah emas, kartu lain yang hanya ramai memudar.
9. **Penutup (51–58 detik).** Sebuah titik keputusan di menara PB ditarik garis emas mundur, melewati cabang, komisariat, dan fondasi, sampai ke ruang kuliah 1947 tanpa putus.
   - Teks: "Selama sanadnya tidak terputus, HMI akan tetap satu nada."

### Video 2 — Kontribusi HMI Menyongsong Indonesia Emas 2045: HMI, Indonesia dan Dunia

Pesan inti: kemandirian di hadapan dunia selalu dibayar dengan kerukunan di dalam rumah.

Objek utama: perahu dan pendayung, dua karang, menara cip, jalan sejarah yang bercabang, dua gapura 2045 dan 2047, bola dunia.

1. **Pembuka (0–8 detik).** Dua bangunan di grid Yogyakarta berdampingan, yaitu ruang kuliah dan gedung sidang. Garis tipis menghubungkan keduanya.
   - Label: "1947, HMI berdiri. 1948, bebas aktif dirumuskan."
2. **Dua karang (8–15 detik).** Grid berubah menjadi permukaan air. Perahu dengan delapan pendayung terjepit di antara dua karang besar.
   - Teks: "Mendayung di antara dua karang."
3. **Retak di dalam (15–20 detik).** Lantai perahu retak di tengah, separuh awak mendayung ke arah berlawanan, dan perahu berputar di tempat.
   - Teks: "Perahu yang awaknya berebut dayung tidak perlu menunggu karang untuk karam."
4. **Karang hari ini (20–27 detik).** Kedua karang membelah dan berlipat menjadi banyak menara cip dan server yang tumbuh dari air. Sebagian menara menyala, sebagian redup.
   - Teks: "Karang hari ini tidak lagi dua."
5. **Jalan HMI (27–36 detik).** Kamera naik ke jalan setapak isometrik yang menjadi lini masa HMI:
   - figur berjalan berbaris (revolusi);
   - angin kencang yang dilalui tanpa roboh (1960-an);
   - sebuah buku menyala (NDP);
   - jalan bercabang dua dan keduanya berjalan sejajar tanpa bertemu (1980-an);
   - bangunan-bangunan tempat alumni tersebar.
6. **Modal yang bocor (36–42 detik).** Ratusan titik cahaya cabang menyala di grid, tetapi sebagian energinya mengalir ke tarik-menarik tali antarkelompok figur, dan cahayanya meredup.
7. **Dua gapura (42–48 detik).** Gapura 2045 dan 2047 berdiri di depan. Satu figur muda berjalan menuju gapura dan tubuhnya tumbuh lebih tinggi.
   - Label: "19 tahun hari ini, 38 tahun pada 2045."
8. **Serempak (48–53 detik).** Kembali ke perahu. Pendayung bergerak serempak, perahu melesat melewati celah menara cip dan menembus kedua gapura.
9. **Penutup (53–60 detik).** Horizon melebar, dan bola dunia isometrik menyala di titik-titik kampus, riset, dan forum dunia saat perahu mendekat.
   - Teks: "Seratus tahun HMI tidak dikenang dari seberapa keras kita berebut kemudi, melainkan dari seberapa jauh perahu ini sampai."

### Video 3 — Mewujudkan HMI dengan Ekosistem Berbasis Bukti

Pesan inti: HMI tidak kekurangan aturan. Yang dibutuhkan adalah memori organisasi yang mudah ditelusuri.

Objek utama: lemari sekretariat, tumpukan buku aturan, tiga dokumen, label emas, bangunan berjenjang, tiga stasiun siklus.

1. **Pembuka (0–8 detik).** Lemari sekretariat di tengah grid. Satu figur membuka pintunya, debu mengepul, isinya map kusam dan halaman yang hilang. Figur itu mengirim balon pesan ke atas, dan tidak ada balasan.
   - Teks: "Ingatan yang tersimpan di kepala orang, pergi bersama orangnya."
2. **Menyalin (8–13 detik).** Figur mengambil satu kartu program kerja lama, mengganti angka tahunnya, dan kartu itu terlipat ganda seperti salinan.
   - Teks: "Organisasi yang tidak mengingat akan mengulang dirinya sendiri."
3. **Aturan sudah ada (13–19 detik).** Di samping lemari, buku aturan bertumpuk tinggi: ART, Pedoman Perkaderan, Program Kerja. Garis dari buku ke lemari terputus.
   - Teks: "Bukan kekurangan aturan."
4. **Arti bukti (19–25 detik).** Satu lembar dokumen melayang dan empat label kecil mengitarinya: siapa, dari mana, kapan, terhubung dengan apa.
   - Teks: "Bukti adalah jejak yang bisa ditelusuri."
5. **Identitas dokumen (25–32 detik).** Tiga dokumen keluar satu per satu: sertifikat dengan pita segel, SK dengan cap stempel, dan surat berupa amplop. Masing-masing ditempeli label emas dengan efek "klik", lalu ketiganya disambung garis zamrud.
   - Teks: "Mulai dari hal kecil. Setiap dokumen tahu siapa dirinya."
6. **Memori berjenjang (32–40 detik).** Dokumen beridentitas berlipat menjadi ribuan titik emas yang mengalir naik: dari rumah-rumah komisariat, ke gedung cabang, ke menara Badko, ke menara PB yang puncaknya menyala seperti di poster. Lalu sebagian cahaya mengalir kembali ke bawah.
   - Teks: "Komisariat mencatat. Cabang menghimpun. Badko membaca pola. PB melihat gambaran."
7. **Ekosistem (40–47 detik).** Tiga stasiun melingkari menara: tangga untuk kaderisasi, rak arsip untuk tata kelola, meja musyawarah untuk kebijakan. Partikel emas berputar di antara ketiganya.
   - Teks bergantian per stasiun, lalu: "Satu ekosistem."
8. **Rambu aturan main (47–51 detik).** Perisai tipis menyelubungi titik-titik di rumah komisariat. Hanya angka ringkasan yang naik, bukan titik per orang.
   - Teks: "Milik lembaga. Data kader dilindungi."
9. **Penutup (51–60 detik).** Setahun kemudian, lemari yang sama. Figur baru membukanya dan disambut cahaya tersusun, bukan debu. Kamera menjauh, dan lemari itu ternyata terhubung ke seluruh grid.
   - Teks: "Ia dimulai dari selembar sertifikat, sebuah nomor surat, dan satu SK yang tahu siapa dirinya."
   - Lalu: "Jangan bicara HMI tanpa bukti." dan "ahmadzulfikar.com/kuis".
