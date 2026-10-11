Prompt Animasi Indikator 18 dari 44
Judul indikator: Evaluasi perjalanan organisasi dan program kerja jarang dilakukan secara terencana dan berkelanjutan.
Kelompok Evaluasi dan Arsip. Mode Ikhtiar. Program terkait 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-18/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-18 --format evidence --judul "Evaluasi perjalanan organisasi dan program kerja jarang dilakukan secara terencana dan berkelanjutan.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-18/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Kartu program berubah abu sesudah tersandung. Batu berwarna W.abuGelap.
Bagian 2: lembar evaluasi abu. Keempat batu mendapat denyutCermin sebagai satu titik masalah (batu yang sama di setiap periode). Tidak ada emas.
Bagian 3: lembar evaluasi baru dan map evaluasi berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: kartu proker baru yang disusun dari map evaluasi. Komisariat melepas abu saat kartu itu melewati batu.
Bagian 4 dan 5: diatur akhiriEvidence. Emas hanya pada lembar laporan.
Dilarang memakai merah, oranye, atau biru.
C. Waktu dan Kamera
Pembagian waktu memakai bawaan formatEvidence:
0.0 sampai 0.6: grid menyala;
0.6 sampai 6.0: Bagian 1, Gejala;
6.0 sampai 13.0: Bagian 2, sebab;
13.0 sampai 23.0: Bagian 3, Ikhtiar;
23.0 sampai 28.0: Bagian 4, Kuis;
28.0 sampai 31.0: Bagian 5, Kartu akhir.
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis:
fokus: d.fokus;
gejala: { muat: [d.benda.lemari, d.benda.folder, d.titik.garisAwal, d.titik.garisAkhir, komisariat] };
sebab: { muat: [d.titik.garisAwal, d.titik.garisAkhir, d.titik.periode[3].clone().add(titik(0.6, 0, 1.4)), d.titik.periode[3].clone().add(titik(0.6, 1.0)), d.titik.periode[3].clone().add(titik(1.3, 0))], H: 9 } (pita 7.2 unit, jadi H akan dinaikkan otomatis, sekitar 13.5; itu wajar. Titik terakhir menjaga batu periode 4 tidak terpotong);
ikhtiar: { muat: [d.benda.folder, d.titik.garisAwal, d.titik.garisAkhir, d.titik.periode[3].clone().add(titik(1.3, 0))], H: 11 } (H dinaikkan otomatis, sekitar 13.5);
tambahan: [{ t: [17.6, 18.6], muat: [d.benda.folder, meja, komisariat, d.titik.periode[3], d.titik.garisAkhir.clone().setY(1.2), d.titik.periode[3].clone().add(titik(1.5, 0))], H: 11 }] (titik terakhir adalah tempat kartu emas mendarat).
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaArsip (lemari, garis waktu PERIODE 1 sampai 4, folder bersama berlaci NOTULENSI, KEPUTUSAN, LAPORAN, DOKUMENTASI).
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7. Dunia Arsip tidak punya komisariat.
kartuProker({ garis: 3, kaki: true, skala: 0.45 }) x 4: kartu program tiap periode.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.7 }) x 4: lembar evaluasi yang jatuh (Bagian 2), abu.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.7, warna: W.zamrud }) x 4: lembar evaluasi yang disimpan (Bagian 3).
mejaKecil(): meja penyusunan program, 1.0 x 0.6 x 0.6 (userData.tinggiAtas).
map({ lembar: 3, warnaTab: W.zamrud }): map evaluasi yang ditarik dari laci.
kartuProker({ garis: 3, kaki: true, skala: 0.45 }): kartu proker baru.
Benda lokal:
batu() x 4: kotak bersudut bulat 0.5 x 0.28 x 0.42 (pakai kotakBulat dan bahanPadat kit), warna W.abuGelap, diputar y 20 derajat dan z 6 derajat supaya tampak tidak beraturan. Titik asal di tengah alas. userData.bagian.denyut berisi mesh batu (bahan gelap, aman untuk denyut).
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "18", kategori: "EVALUASI DAN ARSIP", judul: "Evaluasi perjalanan organisasi dan program kerja jarang dilakukan secara terencana dan berkelanjutan.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Evaluasi dianggap formalitas karena **hasilnya tidak pernah dibaca** saat menyusun program baru."
ikhtiar:
{ teks: "**Arsip dan Memori Organisasi** menyimpan setiap evaluasi di tempat yang mudah ditemukan.", masuk: [13.6, 14.1], keluar: [17.6, 18.0] }
{ teks: "Evaluasi periode lalu menjadi bahan wajib sebelum program baru disusun.", masuk: [18.2, 18.7], keluar: [22.6, 23.0] }
program: "Program 10".
kuis: { pertanyaan: "Setelah sebuah kegiatan selesai, apakah komisariatmu membuat evaluasi tertulis?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Label PERIODE 1 sampai 4 dan label laci sudah dipasang dunia.
F. Dunia dan Posisi
Dunia dasar duniaArsip(v) tanpa penyesuaian. Benda: lemari di titik(-2.6, -1.4) rotasi y 20 derajat, garisWaktu di titik(0.2, 2.8) memanjang ke kanan layar (pita 7.2, periode tiap 1.8), folder di titik(2.8, -1.8).
Titik dunia yang dipakai: d.titik.periode[0] sampai d.titik.periode[3], d.titik.garisAwal, d.titik.garisAkhir.
Benda tambahan dan posisinya:
Komisariat: rumah() di titik(-0.2, 0.2), rotasi 0 (pintu di muka +z). Titik ini bebas di antara lemari dan folder, di atas garis waktu.
Batu i (i = 0 sampai 3): di d.titik.periode[i] + titik(0.9, 0), di atas pita.
Kartu program i: muncul di d.titik.periode[i] + titik(0.25, 0), berhenti di d.titik.periode[i] + titik(0.6, 0), tepat sebelum batu.
Lembar evaluasi (Bagian 2 dan 3) periode i: muncul di d.titik.periode[i] + titik(0.6, 0, 1.0), di atas kartu program. Titik jatuh Bagian 2: d.titik.periode[i] + titik(0.6, 1.0), di tanah depan pita.
Laci LAPORAN terbuka: laciTerbuka = folder.localToWorld(folder.userData.titikLaci(2)) yang dihitung sekali sesudah memanggil folder.userData.aturLaci(2, 1) dan folder.updateMatrixWorld(true). Laci tetap diatur tiap frame di setiapFrame.
Meja penyusunan: di titik(2.0, 1.2), sejajar sumbu dunia. atasMeja = posisi meja + y tinggiAtas.
Map evaluasi: muncul di laciTerbuka, mendarat di atasMeja + titik(-0.25, 0, 0.03).
Kartu proker baru: muncul di atasMeja + titik(0.3, 0), lalu menuju d.titik.periode[3] + titik(0.25, 0), lalu melompat ke d.titik.periode[3] + titik(1.5, 0).
Pengecualian zona: lemari hanya penting sebelum 6.0 ((t) => t < 6.0). folder boleh terpotong selama sebab ((t) => !(t > 6.0 && t < 13.0)). komisariat boleh terpotong 6.0 sampai 17.6 ((t) => t < 6.0 || t >= 17.6).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: semua benda dunia, komisariat, dan keempat batu muncul (muncul([...d.urutan, komisariat, ...batu], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.6 sampai 5.9: empat kartu program, satu per periode. Untuk i = 0 sampai 3, t0 = 1.6 + 1.1 i:
t0 sampai t0 + 0.25: kartu i muncul (muncul, durasi 0.25, naik: 0). Kartu ini muncul dari nol, tanpa bahan dari periode sebelumnya;
t0 + 0.25 sampai t0 + 0.65: kartu meluncur ke titik berhentinya di depan batu (lintas, durasi 0.4);
t0 + 0.65 sampai t0 + 1.0: kartu tersandung, condong 20 derajat ke arah batu (kanan layar) lalu kembali (dua putar bersamaan, sumbu x sudut -0.25 dan sumbu z sudut -0.25 pada t0 + 0.65 durasi 0.15, lalu sudut +0.25 pada kedua sumbu pada t0 + 0.8 durasi 0.2);
t0 + 0.65 sampai t0 + 0.95: kartu berubah abu dan tetap di depan batu.
Kartu keempat selesai 5.9. Keempat kartu abu tertahan di depan batu yang sama.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
7.0 sampai 11.7: lembar evaluasi jatuh dari setiap periode dan hilang. Untuk i = 0 sampai 3, tE = 7.0 + 1.1 i:
tE: lembar evaluasi abu muncul di atas kartu program periode i (muncul, durasi 0.3, naik: 0);
tE + 0.4 sampai tE + 1.0: lembar jatuh ke titik jatuh di depan pita (lintas, durasi 0.6);
tE + 1.0: lembar hilang (durasi 0.4). Tidak ada yang menangkapnya.
10.8 sampai 12.8: denyutCermin(batu, { mulai: 10.8, selesai: 12.8 }) pada keempat batu sekaligus.
12.8 sampai 13.0: adegan diam. Keempat kartu abu tetap tertahan.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.8: laci LAPORAN terbuka (aturLaci(2, k) 0 ke 1 di setiapFrame).
13.8 sampai 16.6: empat lembar evaluasi zamrud disimpan. Untuk i = 0 sampai 3:
13.8 + 0.5 i: lembar zamrud muncul di atas kartu program periode i (durasi 0.3, naik: 0);
14.1 + 0.5 i sampai 14.9 + 0.5 i: lembar melayang ke laciTerbuka (busur, tinggi 1.4, durasi 0.8);
14.9 + 0.5 i: lembar hilang di laci (durasi 0.2).
16.8 sampai 17.2: laci LAPORAN menutup (aturLaci(2, k) 1 ke 0).
17.8 sampai 18.2: meja penyusunan muncul.
18.4 sampai 18.8: laci LAPORAN terbuka lagi.
18.8 sampai 19.1: map evaluasi muncul di laciTerbuka (naik: 0).
19.0 sampai 19.8: map ditarik keluar ke atas meja (busur, tinggi 1.0, durasi 0.8).
19.8 sampai 20.2: laci LAPORAN menutup.
20.0 sampai 20.4: kartu proker baru muncul di atas meja di samping map.
20.4: klikEmas(kartuBaru).
20.8 sampai 21.6: kartu emas meluncur ke awal periode 4 (lintas, durasi 0.8, jalur [atasMeja + titik(0.3, 0), titik tengah yang diangkat y 0.6, periode[3] + titik(0.25, 0)], lengkung: true).
21.7 sampai 22.5: kartu emas melompati kartu abu dan batu periode 4, lalu mendarat di d.titik.periode[3] + titik(1.5, 0) (busur(kartuBaru, { t: 21.7, dari: d.titik.periode[3].clone().add(titik(0.25, 0)), ke: d.titik.periode[3].clone().add(titik(1.5, 0)), tinggi: 1.0, durasi: 0.8 }); dari wajib diisi, karena busur tanpa dari mulai dari posisi dasar kartu di meja dan menggantikan lintas 20.8).
21.6 sampai 22.4: abu komisariat dilepas dari 1 ke 0.
22.5 sampai 23.0: adegan diam. Kartu abu lama tetap di tempatnya.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (EVALUASI DAN ARSIP).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
2.25, 3.35, 4.45, 5.55: kayu (kuat 0.4) saat kartu tersandung, posisi batu masing-masing;
13.4 dan 18.4: laci-buka (durasi 0.4) saat laci LAPORAN terbuka, posisi folder;
16.8 dan 19.8: laci-buka (kuat 0.4, durasi 0.4) saat laci menutup, posisi folder.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di kartu, lembar, atau map. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-18 --periksa, lalu lihat hasil/gambar/indikator-18/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: kartu pertama sudah abu di depan batu, kartu kedua meluncur menuju batu periode 2;
5.7: kartu keempat sedang tersandung batu periode 4;
9.5: lembar evaluasi periode 3 di atas kartunya, dua lembar sebelumnya sudah jatuh dan hilang, kalimat sebab terbaca;
14.5: laci LAPORAN terbuka, lembar zamrud pertama melayang ke laci, kalimat ikhtiar pertama terbaca;
20.7: map evaluasi di atas meja, kartu proker baru sudah emas di sampingnya;
22.0: kartu emas melayang melewati batu periode 4, kalimat ikhtiar kedua dan baris program terbaca.
Judul indikator ini panjang. Bila konsol memberi peringatan judul lebih dari 3 baris, laporkan; jangan mengubah teks judul.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-18. Hasilnya hasil/video/indikator-18.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal batu), lalu hasil zona, warna, LUFS, dan sinkron.
