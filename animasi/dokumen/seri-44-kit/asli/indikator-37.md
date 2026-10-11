Prompt Animasi Indikator 37 dari 44
Judul indikator: Jaringan organisasi HMI lemah.
Kelompok Data dan Jaringan. Mode Ikhtiar. Program terkait 02 Jaringan Pendamping dan Instruktur dan 12 Jaringan Kader Global.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-37/. Folder video lain jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-37 --format evidence --judul "Jaringan organisasi HMI lemah.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-37/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Simpul lepas dan abu (setelKeadaan(simpul, "sambung", 0)).
Bagian 2: kader berwarna pion. Garis yang gagal tersambung berwarna abu (W.abu). Satu titik masalah, yaitu balon tanya kader, boleh denyutCermin. Tidak ada emas.
Bagian 3: tag bidang, garis pilihan, dan garis sambung berwarna zamrud (proses). Simpul yang sudah terdata naik ke sambung 0.4. Emas hanya untuk satu rantai hasil: simpul RISET yang tersambung. Komisariat melepas abu sesudah simpul itu menjadi emas.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Titik bantu: atasBalon = posisi kader + y 1.9, ujungCoba[k] = d.titik.pusat.clone().lerp(d.titik.simpul[i], 0.45) untuk i = 1, 4, 6, dan atasTag1 = d.titik.simpul[0] + y 0.8.
fokus: d.fokus;
gejala: { muat: [d.benda.simpul1, d.benda.simpul3, d.benda.simpul5, d.benda.simpul7] } (perkiraan H sekitar 14.5);
sebab: { muat: [d.benda.komisariat, kader, atasBalon, ujungCoba[0], ujungCoba[1], ujungCoba[2]], H: 9 };
ikhtiar: { muat: [d.benda.simpul1, d.benda.simpul3, d.benda.simpul5, d.benda.simpul7, atasTag1, kader], H: 12 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Simpul dibaca di posisi bawaannya (jari-jari 3.9), yaitu tujuan lintas Bagian 1.
D. Benda yang Dipakai
Dari kit:
Simpul dunia (simpul()) x 8, keadaan "sambung" 0 sampai 1.
pion({ tangan: "satuNaik" }): satu kader di depan komisariat, lengan kanan terangkat.
balonKata({ isi: "tanya", skala: 0.45 }): balon tanya kader.
garisPutus({ titik: [d.titik.pusat, d.titik.simpul[i]], warna: W.abu, lebar: 2 }) x 3: garis yang mencoba tersambung lalu gagal.
tag({ label, rebah: false, warnaPita: W.zamrud }) x 9: delapan tag bidang di simpul dan satu tag kebutuhan di samping balon kader. Lebar tag memanjang sesuai labelnya.
garisPutus({ titik: [a, b], warna: W.zamrudPijar, lebar: 2 }): garis pilihan dari tag kebutuhan ke tag RISET.
garisJalur([d.titik.pusat, d.titik.simpul[3]], { warna: W.zamrudPijar, lebar: 3 }): garis sambung dari komisariat ke simpul RISET, ditampakkan dengan sambungGaris.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "37", kategori: "DATA DAN JARINGAN", judul: "Jaringan organisasi HMI lemah.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Alumni dan mitra ada di mana-mana, tetapi **tidak terdata menurut keahliannya**, jadi sulit dihubungi saat dibutuhkan."
ikhtiar:
{ teks: "**Jaringan Pendamping** dan **Jaringan Kader Global** mendata alumni dan mitra menurut bidang, dengan izin mereka.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Kader yang butuh mentor bisa dihubungkan ke orang yang tepat.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 02 · Program 12".
kuis: { pertanyaan: "Jika kader membutuhkan mentor atau mitra di bidang tertentu, bisakah komisariatmu menghubungkannya?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Teks bidang dipasang lewat opsi label milik tag: simpul1 “HUKUM”, simpul2 “KESEHATAN”, simpul3 “TEKNIK”, simpul4 “RISET”, simpul5 “PENDIDIKAN”, simpul6 “MEDIA”, simpul7 “EKONOMI”, simpul8 “SOSIAL”, dan tag kebutuhan kader “RISET”.
F. Dunia dan Posisi
Dunia dasar duniaSimpul(v, { tanpa: ["layar"] }) (resep 37 di docs dunia). Benda: komisariat di titik(0, 0), simpul1 sampai simpul8 di lingkaran jari-jari 3.9, simpul1 di titik(0, -3.9) lalu searah jarum jam (simpul3 kanan, simpul4 kanan bawah, simpul5 bawah, simpul7 kiri).
Titik dunia yang dipakai: d.titik.komisariat, d.titik.pusat, d.titik.depanPintu, d.titik.simpul[0] sampai d.titik.simpul[7].
Benda tambahan dan posisinya:
Titik awal simpul Bagian 1: S_i = K + 0.75 × (P_i − K), dengan K = d.titik.komisariat dan P_i = posisi bawaan simpul ke-i (jari-jari 3.9). Simpul mulai di jari-jari sekitar 2.9, lalu menjauh ke P_i. Prompt lama menulis jari-jari 5.2; di kit itu keluar layar, jadi simpul menjauh ke jari-jari bawaan 3.9.
Kader: di d.titik.depanPintu + titik(-0.3, 0.3), rotasi y Math.PI / 4 (menghadap penonton).
Balon tanya: di posisi kader + y 1.15.
Garis coba: dari d.titik.pusat ke d.titik.simpul[1], [4], dan [6] (simpul2, simpul5, simpul7), hanya tergambar sampai 45% panjangnya.
Tag bidang: berdiri di d.titik.simpul[i] + y 0.45 (di atas bola), menghadap kamera (bawaan hadap).
Tag kebutuhan: di samping kanan balon, posisi balon + titik(0.55, 0, 0.1).
Garis pilihan: dari tag kebutuhan ke tag RISET di simpul4 (d.titik.simpul[3] + y 0.45).
Garis sambung: dari d.titik.pusat ke d.titik.simpul[3].
Pengecualian zona: simpul1 sampai simpul8 boleh terpotong selama 6.0 sampai 13.0 (userData.penting = (t) => t < 6.0 || t >= 13.0). Bila garis dilaporkan keluar zona padahal tampak di dalam, beri abaikanZona dan laporkan.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.1: komisariat muncul (muncul, durasi: 0.5). Komisariat abu penuh sejak awal.
1.6 sampai 3.0: delapan simpul muncul di titik awalnya S_i (muncul, selesai: 3.0), lepas dan abu.
3.0 sampai 6.0: simpul menjauh perlahan dari S_i ke P_i (lintas, durasi: 3.0, beku: false). Tidak ada garis penghubung.
Semua gerak Bagian 1 berakhir tepat 6.0.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.0: kader muncul di depan pintu komisariat dengan lengan kanan terangkat (muncul, durasi: 0.4, naik: 0).
7.0 sampai 7.3: balon tanya muncul di atas kepala kader.
7.8 sampai 10.4: tiga percobaan sambung yang gagal, mulai 7.8, 8.6, dan 9.4. Masing-masing: garis abu tergambar dari komisariat ke arah simpulnya sampai 45% panjang (aturTampak 0 ke 0.45, 0.5 detik), lalu memudar 0.6 detik sesudah mulai (aturOpasitas 1 ke 0, 0.4 detik). Tidak ada garis yang sampai.
9.8 sampai 12.6: balon tanya berdenyut (denyutCermin(balon, { mulai: 9.8, selesai: 12.6 })).
10.4 sampai 13.0: adegan diam. Simpul tetap lepas dan abu.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 15.9: delapan tag bidang menempel satu per satu di atas simpul1 sampai simpul8 (muncul, durasi: 0.4, jeda 0.3). Saat tag menempel, simpul itu naik ke sambung 0.4 dalam 0.3 detik (terdata, belum tersambung).
16.2 sampai 16.6: tag kebutuhan “RISET” muncul di samping balon tanya kader (muncul, naik: 0).
16.8 sampai 17.4: garis pilihan zamrud tergambar dari tag kebutuhan ke tag RISET di simpul4 (aturTampak 0 ke 1). 17.6 sampai 18.0: garis pilihan memudar (aturOpasitas 1 ke 0).
18.2 sampai 19.0: garis sambung menyala dari komisariat ke simpul4 (sambungGaris(garisSambung, { t: 18.2, durasi: 0.8 })).
19.0 sampai 19.4: simpul4 tersambung penuh (sambung 0.4 ke 1).
19.6: klikEmas(d.benda.simpul4).
19.8 sampai 20.6: abu komisariat dilepas dari 1 ke 0.
20.0 sampai 20.4: balon tanya dan tag kebutuhan hilang bersamaan. Pertanyaan sudah terjawab.
20.6 sampai 23.0: adegan diam. Kader tetap satu-satunya figur. Jangan menampilkan rombongan figur atau garis ke semua simpul sekaligus. Gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (DATA DAN JARINGAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
7.0: balon (kuat 0.5) saat balon tanya muncul. muncul balon diberi bunyi: false;
8.4, 9.2, dan 10.0: garis-putus (kuat 0.4) di ujung garis coba saat memudar;
16.8: garis-sambung (kuat 0.4, durasi 0.6) saat garis pilihan tergambar.
sambungGaris sudah mencatat garis-sambung untuk garis sambung. Tidak ada figur yang berjalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata. Tag hanya memuat nama bidang. Nama kota dari prompt lama (“MAKASSAR”, “BANDUNG”, dan seterusnya) tidak dipakai.
Tidak boleh ada angka di tag atau label.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-37 --periksa, lalu lihat hasil/gambar/indikator-37/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: komisariat abu di tengah, delapan simpul abu di jari-jari dalam, tanpa garis;
5.5: simpul hampir sampai di jari-jari 3.9, masih tanpa garis;
9.5: kamera dekat, kader dengan lengan terangkat dan balon tanya, satu garis abu sedang tergambar lalu memudar, kalimat sebab terbaca;
14.5: sebagian simpul sudah bertag bidang dan sedikit kehijauan, kalimat ikhtiar pertama terbaca;
17.4: tag kebutuhan RISET tampak, garis pilihan zamrud sampai ke tag RISET di simpul4;
19.9: garis sambung dari komisariat ke simpul4, simpul4 emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-37. Hasilnya hasil/video/indikator-37.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, jari-jari simpul).
