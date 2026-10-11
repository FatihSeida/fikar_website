Prompt Animasi Indikator 27 dari 44
Judul indikator: Retorika lebih banyak daripada tindakan.
Kelompok Target Program. Mode Ikhtiar. Program terkait 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-27/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-27 --format evidence --judul "Retorika lebih banyak daripada tindakan.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-27/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Pengurus berwarna pion. Balon kata berwarna kertas saat muncul, lalu abu penuh pada 5.0 sampai 6.0.
Bagian 2: meja kerja dan bingkai kosong di atasnya berwarna abu. Meja kerja boleh berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: papan rekap, kartu rencana, kartu tindak lanjut, dan garis pasangan berwarna zamrud atau kertas (proses). Garis untuk rencana tanpa tindak lanjut berwarna abu. Emas hanya untuk satu rantai hasil: keempat pasangan yang lengkap (kartu rencana dan kartu tindak lanjutnya). Komisariat melepas abu sesudahnya.
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
gejala: { muat: [d.benda.meja, d.benda.pengurus1, d.benda.pengurus2, d.benda.pengurus3, d.benda.pengurus4, d.benda.pengurus5, tujuanBalon[5], komisariat] } (perkiraan H sekitar 14);
sebab: { muat: [d.benda.meja, mejaKerja, tujuanBalon[5]], H: 10 };
ikhtiar: { muat: [papanRekap, d.benda.meja, mejaKerja, komisariat], H: 12 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. tujuanBalon dijelaskan di bagian F.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6, atap 0.7.
Pengurus dunia: pion({ tangan: "terbuka" }) x 5 lewat opsi.pengurus (tangan terbuka dan kosong).
balonKata({ isi: "titik", skala: 0.6 }) x 6: balon kata balon1 sampai balon6, sekitar 0.84 x 0.48, selalu menghadap kamera.
mejaKecil({ lebar: 1.0, tinggi: 0.6, dalam: 0.6 }): meja kerja, userData.tinggiAtas 0.6.
garisPutus({ persegi: [0.8, 0.4], warna: W.abu, lebar: 3 }): bingkai kosong di atas meja kerja.
papanTulis({ lebar: 3.4, tinggi: 2.4, kaki: 0.4, kolom: ["RENCANA", "TINDAK LANJUT"], baris: ["", "", "", "", "", ""] }): papan rekap, enam baris.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.4 }) x 6: kartu rencana, pengganti balon di kolom RENCANA.
kartuKecil({ simbol: "centang", rebah: false, miring: 0, skala: 0.4 }) x 4: kartu tindak lanjut.
panahGaris({ titik: [a, b], warna: W.zamrudPijar, tebal: 0.025, kepala: { panjang: 0.01, radius: 0.005 } }) x 4: garis pasangan lengkap, kepala panah hampir tidak tampak (kepala: false diabaikan kit, kerucut kepala bawaan tetap tergambar).
garisPutus({ titik: [a, b], warna: W.abu, lebar: 3 }) x 2: garis rencana tanpa tindak lanjut.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "27", kategori: "TARGET PROGRAM", judul: "Retorika lebih banyak daripada tindakan.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Rencana yang diumumkan **tidak pernah disandingkan** dengan tindak lanjutnya, jadi ucapan dan kerja tampak sama."
ikhtiar:
{ teks: "**Arsip dan Memori Organisasi** mencatat setiap rencana yang diumumkan beserta tindak lanjutnya.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Keduanya diletakkan berdampingan, sehingga yang dikerjakan bisa dibedakan dari yang hanya diucapkan.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 10".
kuis: { pertanyaan: "Dari program yang direncanakan di awal periode, berapa yang benar-benar terlaksana?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“MEJA KERJA”: label3D("MEJA KERJA", { pada: mejaKerja, geser: [0, 0.9, 0], gaya: "benda" }), masuk 7.0 sampai 7.4, keluar 22.6 sampai 23.0.
Kepala kolom “RENCANA” dan “TINDAK LANJUT” adalah label bawaan papanTulis, ikut tampak bersama papan.
F. Dunia dan Posisi
Dunia dasar duniaRencana(v, { rapat: true, tanpa: ["papan"], opsi: { pengurus: { tangan: "terbuka" } } }) (resep 27 di docs dunia; papan dunia ditiadakan karena papan rekap baru muncul di Bagian 3). Benda: meja (mejaBundar, permukaan y 0.75) di titik(0, 0.6), pengurus1 sampai pengurus5 pada radius 1.75 menghadap meja, pengurus1 paling dekat ke penonton lalu searah jarum jam.
Titik dunia yang dipakai: d.titik.meja, d.titik.pengurus[0] sampai d.titik.pengurus[4].
Dunia ini tidak punya komisariat. Tambahkan komisariat = v.tambah(rumah()) di titik(2.9, 2.4), di kanan bawah, bebas dari pengurus kanan depan.
Benda tambahan dan posisinya:
Urutan pengurus yang bicara: pengurus1, pengurus3, pengurus5, pengurus2, pengurus4, pengurus1. Balon ke-j berangkat dari atas kepala pengurusnya (d.titik.pengurus[i] + y 1.15).
tujuanBalon[0..5] (gugus di atas meja, relatif ke titik(0, 0.6)): titik(-0.9, 0, 2.5), titik(0.9, 0, 2.4), titik(0, 0, 2.9), titik(-0.6, 0, 3.5), titik(0.7, 0, 3.4), titik(0.1, 0, 4.0).
Meja kerja: titik(2.9, -0.7), sejajar sumbu dunia, di kanan atas meja rapat. Bingkai kosong di atasnya pada y 0.61.
Papan rekap: titik(-1.6, -2.6) (letak papan dunia bawaan), menghadap kamera (rotasi y 45 derajat), kaki 0.4. Panggil papanRekap.updateMatrixWorld(true) lalu hitung sel dengan papanRekap.localToWorld(papanRekap.userData.titikSel(c, r)). Kolom 0 = RENCANA, kolom 1 = TINDAK LANJUT, baris r = 0 sampai 5 dari atas ke bawah.
Kartu rencana ke-r: di sel (0, r), digeser 0.03 ke muka papan. Kartu tindak lanjut di sel (1, r) untuk r = 0, 1, 3, 4. Baris 2 dan 5 tidak punya tindak lanjut.
Kartu tindak lanjut sebelum terbang: berdiri berjajar di atas meja kerja, y 0.6, di meja kerja + titik(-0.33, -0.1), titik(-0.11, -0.03), titik(0.11, 0.03), titik(0.33, 0.1).
Garis pasangan: dari tepi kanan kartu rencana ke tepi kiri kartu tindak lanjut di baris yang sama, pada tinggi tengah kartu, 0.04 di depan muka papan. Garis abu baris 2 dan 5: dari tepi kanan kartu rencana ke pusat sel (1, r) yang kosong.
Pengecualian zona: komisariat boleh terpotong 6.0 sampai 13.0 (userData.penting = (t) => t < 6.0 || t >= 13.0). pengurus1 sampai pengurus5 boleh terpotong 6.0 sampai 13.0 dengan aturan yang sama.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: meja, pengurus, dan komisariat muncul (muncul([...d.urutan, komisariat], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal. Tangan pengurus terbuka dan kosong.
1.6 sampai 5.35: enam balon muncul bergantian dari pengurus, pada 1.6, 2.15, 2.7, 3.25, 3.8, dan 4.35. Setiap balon muncul di atas kepala pengurusnya (muncul, durasi 0.3, naik 0), lalu naik ke tujuanBalon masing-masing (lintas, durasi 1.0, mulai 0.3 sesudah muncul).
5.0 sampai 6.0: semua balon menjadi abu penuh (setelKeadaan(balon, "abu", halus(rentang(t, 5.0, 5.6)))) dan berdesakan (getar, t 5.2, durasi 0.8, amp 0.04, bunyi: false).
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.1: meja kerja muncul di kanan atas meja rapat (muncul), abu penuh. Label “MEJA KERJA” masuk 7.0.
7.2 sampai 7.8: bingkai kosong abu tergambar di atas meja kerja (aturTampak 0 ke 1). Meja kerja tidak berisi apa pun.
7.8 sampai 12.0: keenam balon abu naik perlahan 0.3 unit lagi (lintas, durasi 4.2, dari tujuanBalon ke tujuanBalon + y 0.3). Ucapan terus naik, meja kerja tetap kosong.
8.4 sampai 12.6: denyutCermin(mejaKerja, { mulai: 8.4, selesai: 12.6 }). Ini satu-satunya titik masalah.
12.6 sampai 13.0: adegan diam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.8: papan rekap muncul di kiri atas (muncul).
13.6 sampai 14.0: abu keenam balon dilepas dari 1 ke 0.
13.8 sampai 16.4: keenam balon turun ke kolom RENCANA (busur, dari tujuanBalon + y 0.3 ke sel (0, r) papan, tinggi 0.6, durasi 0.8, jeda 0.36), balon ke-j ke baris r = j. Saat mendarat, balon berganti menjadi kartu rencana (gantiBenda(balon, kartuRencana, { durasi: 0.3, tempat: false })).
16.6 sampai 17.3: empat kartu tindak lanjut muncul berjajar di atas meja kerja (muncul, jeda 0.15, naik 0.2). Abu meja kerja dilepas dari 1 ke 0 pada 16.6 sampai 17.0, dan bingkai kosong hilang.
18.0 sampai 19.6: keempat kartu tindak lanjut terbang ke kolom TINDAK LANJUT baris 0, 1, 3, dan 4 (busur, tinggi 1.0, durasi 0.7, jeda 0.3).
19.8 sampai 20.6: garis pasangan tergambar per baris dari atas ke bawah (aturTampak 0 ke 1, jeda 0.1). Baris 0, 1, 3, 4 memakai garis zamrud penuh. Baris 2 dan 5 memakai garis putus abu ke sel yang kosong.
20.8: klikEmas keempat pasangan lengkap (kartu rencana dan kartu tindak lanjut baris 0, 1, 3, 4), jeda 0.08. Kartu rencana baris 2 dan 5 tetap kertas.
21.6 sampai 22.4: abu komisariat dilepas dari 1 ke 0.
Pengurus tetap di tempat dengan tangan terbuka. Jangan menambah figur yang bekerja atau bersorak.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TARGET PROGRAM).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
setiap balon Bagian 1 saat muncul: balon (kuat 0.45, posisi balon itu);
7.2: garis-putus pelan (kuat 0.35, posisi meja kerja) saat bingkai kosong tergambar;
19.8: garis-sambung (kuat 0.5, durasi 0.8, posisi papan rekap) saat garis pasangan tergambar;
20.8: kertas pelan (kuat 0.4, posisi papan rekap) bersama klik emas pasangan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada teks yang terbaca di balon atau kartu. Isi balon hanya tiga titik, isi kartu hanya garis dan centang.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada angka di papan rekap. Jumlah baris tidak boleh diberi nomor.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-27 --periksa, lalu lihat hasil/gambar/indikator-27/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
4.3: tiga balon sudah naik di atas meja rapat, tangan pengurus terbuka;
5.5: enam balon abu berdesakan di atas meja;
9.5: kamera dekat, meja kerja abu kosong berdenyut di samping gugus balon, kalimat sebab terbaca;
15.3: papan rekap tampak, dua balon pertama sudah menjadi kartu rencana, kalimat ikhtiar pertama terbaca;
20.3: kartu tindak lanjut sudah di papan, garis pasangan sedang tergambar;
21.9: empat pasangan emas, dua garis putus abu, komisariat mulai lepas abu, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-27. Hasilnya hasil/video/indikator-27.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal), lalu hasil zona, warna, LUFS, dan sinkron.
