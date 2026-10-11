Prompt Animasi Indikator 32 dari 44
Judul indikator: Daya kritis aktivis HMI menurun.
Kelompok Tata Kelola. Mode Ikhtiar. Program terkait 08 Kurikulum Keterampilan Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-32/. Folder video lain jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-32 --format evidence --judul "Daya kritis aktivis HMI menurun.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-32/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Pengurus berwarna pion. Pengurus yang balonnya diabaikan berubah abu.
Bagian 2: semua pengurus yang sudah diam tetap abu. Satu titik masalah, yaitu lengan pengurus yang ragu, boleh denyutCermin. Tidak ada emas.
Bagian 3: kartu data, kartu argumen, dan garis catatan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: lembar catatan tanggapan. Komisariat melepas abu sesudah lembar catatan menjadi emas.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Titik bantu atasBalon4 = d.titik.pengurus[3] + y 1.9 (puncak balon di atas pengurus4).
fokus: d.fokus;
gejala: { muat: [d.benda.papan, d.benda.meja, komisariat, d.benda.pengurus1] } (perkiraan H sekitar 13);
sebab: { muat: [d.benda.meja, d.benda.pengurus1, d.benda.pengurus4, atasBalon4], H: 9 };
ikhtiar: { muat: [d.benda.meja, d.benda.pengurus1, atasBalon4, d.titik.meja], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [catatan, d.benda.meja, komisariat], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Tujuan kartu di meja (d.titik.meja) termasuk titik tujuan.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7. Dunia Rencana tidak punya komisariat, jadi benda ini ditambahkan.
Pengurus dunia (pion dengan tangan: "turun", panjangTangan: 0.4) x 6. Lengan berporos di bahu: p.userData.bagian.tangan[1] adalah lengan kanan. Untuk mengangkat, putar rotation.z lengan itu dari 0 ke sudut pose "satuNaik" (lihat pion({ tangan: "satuNaik" }) untuk tanda dan besar sudutnya) dari v.setiapFrame.
balonKata({ isi: "tanya", skala: 0.45 }) x 5: balon tanya. Titik asal di ujung ekor, diletakkan di atas kepala (y 1.15).
kartuKecil({ simbol: "grafik", rebah: false, miring: 0, warna: W.zamrud, skala: 0.5 }): kartu data.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, warna: W.zamrud, skala: 0.5 }) x 2: kartu argumen.
panelKertas({ lebar: 1.2, tinggi: 1.6, baris: 4, kosong: [2, 3], kaki: "tiang", dasar: 0.8 }): lembar catatan tanggapan (resep agenda 32 di docs). Baris 2 dan 3 kosong dan diisi di Bagian 3.
garisPutus({ titik: [a, b], warna: W.zamrudPijar, lebar: 2 }): garis dari meja ke lembar catatan.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "32", kategori: "TATA KELOLA", judul: "Daya kritis aktivis HMI menurun.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Kritik di rapat **dianggap serangan**, jadi kader belajar diam daripada berargumen."
ikhtiar:
{ teks: "**Kurikulum Keterampilan Kader** melatih daya kritis yang berangkat dari data dan argumen.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Rapat menyediakan ruang kritik yang beralasan, dan tanggapannya dicatat.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 08".
kuis: { pertanyaan: "Ketika ada kader yang menyampaikan kritik di rapat komisariatmu, apa yang biasanya terjadi?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label mikro kelas zamrud “CATATAN TANGGAPAN” di atas lembar catatan, geser [0, 2.6, 0]. Masuk 17.8 sampai 18.3, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaRencana(v, { rapat: { pengurus: 6 }, opsi: { pengurus: { tangan: "turun", panjangTangan: 0.4 } } }) (resep 32 di docs dunia). Benda: papan di titik(-1.6, -2.6) menghadap kamera, meja (mejaBundar) di titik(0, 0.6), pengurus1 sampai pengurus6 berdiri di jari-jari 1.75 dari pusat meja, menghadap meja. Mode rapat tidak membuat lintasan dan bendera.
Urutan pengurus: pengurus1 paling dekat ke penonton (bawah meja), lalu searah jarum jam di layar: pengurus2 kiri bawah, pengurus3 kiri atas, pengurus4 atas (menghadap penonton), pengurus5 kanan atas, pengurus6 kanan bawah. Titik lantainya d.titik.pengurus[0] sampai d.titik.pengurus[5].
Titik dunia yang dipakai: d.titik.meja, d.titik.pengurus[i], d.titik.papan.
Benda tambahan dan posisinya:
Komisariat: di titik(2.6, -2.0), kanan atas di samping papan, rotasi 0. Ujung kiri komisariat berjarak sekitar 1.2 unit dari pengurus5. Bila menyentuh pengurus atau papan, geser ke kanan atas dan laporkan.
Balon tanya: di d.titik.pengurus[i] + y 1.15 untuk pengurus yang bertanya.
Kartu data: muncul di samping kanan balon pengurus4, d.titik.pengurus[3] + titik(0.5, 0, 1.2), lalu mendarat berdiri di d.titik.meja (tepi bawah kartu di permukaan meja).
Kartu argumen: mendarat di d.titik.meja + titik(-0.4, 0.1) dan + titik(0.4, 0.1).
Lembar catatan: alas di titik(-2.4, -1.6), di depan sisi kiri papan, menghadap kamera (bawaan hadap).
Garis catatan: dari d.titik.meja + y 0.1 ke titik baris 2 lembar catatan (catatan.userData.titikBaris(2), dihitung sesudah matriks dunia diperbarui).
Pengecualian zona: papan dan komisariat boleh terpotong selama 6.0 sampai 17.5 (userData.penting = (t) => t < 6.0 || t >= 17.5).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: papan, meja, pengurus, dan komisariat muncul (muncul([...d.urutan, komisariat], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
Tiga siklus angkat tangan, masing-masing mulai t0: pengurus3 pada 1.6, pengurus5 pada 3.0, dan pengurus2 pada 4.4. Dalam satu siklus:
t0 sampai t0 + 0.4: lengan kanan naik ke pose "satuNaik" (halus);
t0 + 0.2: balon tanya muncul di atas kepalanya (durasi: 0.3, naik: 0);
t0 + 0.8: balon hilang sambil turun (durasi: 0.6, turun: 0.5);
t0 + 0.8 sampai t0 + 1.4: lengan turun perlahan ke 0;
t0 + 1.0 sampai t0 + 1.4: pengurus itu berubah abu (setelKeadaan 0 ke 1).
1.8 sampai 2.2: pengurus1 dan pengurus6 berpaling membelakangi meja (putar, sudut: Math.PI, durasi: 0.4, sumbu: "y"). Keduanya tetap membelakangi sampai Bagian 3.
Siklus terakhir selesai 5.8. Pengurus4 tetap menghadap meja dan melihat semuanya.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
7.4 sampai 8.0: pengurus4 mulai mengangkat lengan, tetapi berhenti setengah jalan (50% sudut "satuNaik"). Tidak ada balon.
8.0 sampai 11.0: lengan tertahan setengah terangkat.
8.4 sampai 11.4: lengan kanan pengurus4 berdenyut (denyutCermin(pengurus4.userData.bagian.tangan[1], { mulai: 8.4, selesai: 11.4 })).
11.0 sampai 11.6: lengan turun kembali ke 0. 11.2 sampai 11.8: pengurus4 berubah abu. Kader belajar diam.
11.8 sampai 13.0: adegan diam. Empat pengurus abu, dua membelakangi meja.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.6: lengan pengurus4 naik penuh ke pose "satuNaik".
13.4: balon tanya muncul di atas kepala pengurus4, dan kartu data muncul di samping kanannya (durasi: 0.3, naik: 0). Balon tanya kini membawa data.
14.0 sampai 14.8: kartu data melayang ke tengah meja (busur, ke: d.titik.meja, tinggi: 0.6, durasi: 0.8). 14.8: balon hilang. 14.8 sampai 15.2: lengan pengurus4 turun.
15.0 sampai 15.4: pengurus1 dan pengurus6 berbalik menghadap meja lagi (putar, sudut: -Math.PI, durasi: 0.4).
15.0 sampai 15.8: abu pengurus2, pengurus3, pengurus4, dan pengurus5 dilepas dari 1 ke 0.
15.8 sampai 17.3: pengurus3 lalu pengurus5 menyampaikan argumen. Masing-masing: lengan naik 0.3 detik, kartu argumen muncul di atas kepalanya (y 1.35), lalu busur ke tempatnya di meja (tinggi: 0.6, durasi: 0.7), lengan turun. Pengurus3 mulai 15.8, pengurus5 mulai 16.4.
17.8 sampai 18.3: lembar catatan muncul di depan papan (muncul, durasi: 0.5).
18.6 sampai 19.2: garis catatan zamrud tergambar dari meja ke lembar catatan (aturTampak 0 ke 1).
19.2 sampai 19.5: baris 2 lembar catatan terisi (tumbuh(catatan.userData.bagian.baris[2], { sumbu: "x" })). 19.8 sampai 20.1: baris 3 terisi dengan cara yang sama. Tanggapan dicatat.
20.6: klikEmas(catatan).
20.8 sampai 21.6: abu komisariat dilepas dari 1 ke 0.
21.6 sampai 23.0: adegan diam. Garis catatan memudar 22.0 sampai 22.6 (aturOpasitas 1 ke 0).
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.8, 3.2, dan 4.6: balon (kuat 0.5) saat balon tanya muncul, di posisi balon. muncul balon diberi bunyi: false supaya tidak berbunyi ganda;
7.4: whoosh pelan (kuat 0.3, durasi 0.6) saat lengan pengurus4 terangkat setengah lalu berhenti;
14.8: kertas (kuat 0.6) saat kartu data mendarat di meja;
19.2 dan 19.8: kertas (kuat 0.5) saat baris catatan terisi.
Pengurus tidak berjalan, jadi tidak ada bunyi langkah.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di kartu data atau lembar catatan. Isi balon hanya tanda tanya; tidak ada teks kritik yang terbaca.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Jangan menggambarkan pengurus yang marah atau saling menyerang. Berpaling dan diam sudah cukup.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-32 --periksa, lalu lihat hasil/gambar/indikator-32/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: pengurus3 sudah abu, pengurus1 dan pengurus6 membelakangi meja, pengurus5 mulai mengangkat lengan;
5.5: pengurus2 menurunkan lengan, balonnya sudah hilang;
9.5: kamera dekat ke meja, lengan pengurus4 tertahan setengah dan berdenyut, kalimat sebab terbaca;
14.5: kartu data sedang melayang ke tengah meja, kalimat ikhtiar pertama terbaca;
17.3: dua kartu argumen sudah di meja, semua pengurus menghadap meja;
20.9: baris catatan terisi, lembar catatan emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-32. Hasilnya hasil/video/indikator-32.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, letak komisariat, sudut lengan).
