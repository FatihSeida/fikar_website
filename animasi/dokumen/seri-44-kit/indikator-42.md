Prompt Animasi Indikator 42 dari 44
Judul indikator: Aktivis terlalu berpikir umum dan global tanpa kedalaman yang memadai.
Kelompok Pengetahuan. Mode Ikhtiar. Program terkait 08 Kurikulum Keterampilan Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-42/. Jangan mengubah folder video lain.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-42 --format evidence --judul "Aktivis terlalu berpikir umum dan global tanpa kedalaman yang memadai.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-42/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: kelima pembicara abu penuh (setelKeadaan(figur, "abu", 1)). Komisariat abu penuh. Bola dunia berwarna bawaan (garis zamrudRedup).
Bagian 2: pembicara dan komisariat tetap abu. Balon kecil berwarna kertas bawaan. Tidak ada denyut dan tidak ada emas.
Bagian 3: peta lokal, kartu data, dan garis penghubung berwarna zamrud (proses); kerucut sorot krem bawaan. Emas hanya untuk satu rantai hasil: tumpukan kartu data di atas peta lokal. Komisariat melepas abu sesudah tumpukan menjadi emas.
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
fokus: titik(0, -0.2, 0.9);
gejala: { muat: [d.benda.meja, bola, d.benda.kursi1, d.benda.kursi3, d.benda.kursi4, d.benda.rakKiri, komisariat] } (perkiraan H sekitar 13);
sebab: { muat: [bola, d.benda.kursi2, d.benda.kursi5], H: 9 };
ikhtiar: { muat: [d.benda.meja, bolaKecil, d.benda.kursi1, d.benda.kursi3, d.benda.kursi4, komisariat], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Lantai dunia tidak dimasukkan ke muat karena lantai 8 x 8 memang lebih lebar dari layar.
D. Benda yang Dipakai
Dari kit:
duniaPustaka: lantai ruangAcara 8 x 8, satu rakBuku, mejaBundar() (permukaan y 0.85), dan lima figur duduk kursi1..5 (pion({ duduk: true })), yaitu kelima pembicara.
rumah(): komisariat 1.8 x 1.2 x 1.6, atap 0.7.
bolaDunia({ radius: 1.1 }): bola dunia besar di atas meja. Putaran lewat bola.userData.aturPutar(sudut).
bolaDunia({ radius: 0.45 }): bola dunia kecil di latar (Bagian 3).
balonKata({ isi: "kosong", skala: 1.0 }) x 5: balon besar kosong Bagian 1.
balonKata({ isi: "titik", skala: 0.45 }) x 1: balon kecil yang melompat di Bagian 2.
petaLokal({ lebar: 1.8, dalam: 1.8, benih: 42 }): peta kampus dan sekitarnya di atas meja (sudut peta berjarak 1.27 dari pusat, di dalam tepi meja yang beradius 1.3).
kerucutSorot({ tinggi: 2.6, radiusBawah: 1.1, opasitas: 0.12 }): sorot yang turun ke peta lokal.
kartuKecil({ simbol: "grafik", warna: W.zamrud, skala: 0.7 }) x 5: kartu data, berbaring.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 2 }): garis dari bola kecil ke tumpukan kartu data.
balonKata({ isi: "garis", skala: 0.45 }) x 3: balon diskusi Bagian 3.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "42", kategori: "PENGETAHUAN", judul: "Aktivis terlalu berpikir umum dan global tanpa kedalaman yang memadai.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Diskusi bergerak dari isu ke isu **tanpa membawa data atau konteks lokal**, jadi semuanya terasa dangkal."
ikhtiar:
{ teks: "**Kurikulum Keterampilan Kader** melatih kader membaca data dan konteks di sekitarnya.", masuk: [13.6, 14.1], keluar: [18.0, 18.4] }
{ teks: "Isu besar dibedah dari kasus yang dekat, sehingga pembahasannya punya kedalaman.", masuk: [18.6, 19.1], keluar: [22.6, 23.0] }
program: "Program 08".
kuis: { pertanyaan: "Saat berdiskusi tentang suatu isu, apakah kader komisariatmu membawa data atau bacaan?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Dunia dasar duniaPustaka(v, { tanpa: ["rakKanan", "lentera"], bangku: false, posisi: { rakKiri: titik(-2.2, -2.9, 0.1) }, opsi: { rakKiri: { lebar: 2.0, buku: 40 } } }). Ini resep 42 di docs dunia (bangku: false supaya celah antara figur dan lantai terlihat saat figur diangkat), dengan rak kanan dan lentera ditiadakan supaya ada ruang untuk komisariat dan bola dunia tidak tertutup lentera. Sumber Gejala adalah prompt seri versi pertama (format 21 detik) bagian F dan G Bagian 1.
Semua benda tambahan yang berdiri di lantai memakai y 0.1.
Komisariat: titik(2.3, -2.5, 0.1), di tempat rak kanan, rotasi 0.
Bola dunia besar: titik asalnya (bawah bola) di d.titik.meja. Pusat bola G = d.titik.meja + y 1.1.
Pembicara: d.benda.kursi1..5 di d.titik.duduk[i]. Kursi1 paling dekat ke penonton, lalu searah jarum jam di layar (kiri depan, kiri belakang, kanan belakang, kanan depan). Posisi terangkat = d.titik.duduk[i] + y 0.3.
Balon besar Bagian 1: titik asal (ujung ekor) di d.titik.atasKepala[i] + y 0.3, karena figur sedang terangkat.
Titik lompatan balon kecil Bagian 2, berurutan, semuanya relatif terhadap G: P0 = G + titik(-1.3, 0.2, 0), P1 = G + titik(1.3, 0.2, 0), P2 = G + titik(0, 0.3, 1.3), P3 = G + titik(-0.9, 0.5, -0.6), P4 = G + titik(0.9, 0.5, 0.7), P5 = G + titik(-1.3, 0.2, 0.4), P6 = G + titik(1.3, 0.2, -0.2).
Bola dunia kecil: titik asalnya di titik(0, -1.3, 0.1), di belakang meja, di celah antara kursi kiri belakang dan kanan belakang (celah yang di docs dunia dipakai pemateri). Pusatnya G2 = titik(0, -1.3, 0.55).
Peta lokal dan kerucut sorot: keduanya di d.titik.meja (kerucut berpusat di permukaan meja).
Kartu data k (k = 0 sampai 4): berangkat dari d.titik.depanKursi[k], mendarat di d.titik.meja + y (0.06 + 0.025k), diputar sedikit (rotation.y berganti −0.1, 0.08, −0.05, 0.1, 0) supaya tampak menumpuk.
Garis penghubung: dari G2 ke d.titik.meja + y 0.2.
Balon diskusi Bagian 3: di d.titik.atasKepala[0], [2], dan [4] (kursi1, kursi3, kursi5) tanpa tambahan y, karena figur sudah turun.
Pengecualian zona:
lantai tidak diperiksa (userData.penting = false), karena lebih lebar dari layar;
rak buku boleh terpotong sesudah Bagian 1 (userData.penting = (t) => t < 6.0);
komisariat boleh terpotong selama kamera dekat Bagian 2 (userData.penting = (t) => !(t > 6.0 && t < 13.0));
kerucut sorot memakai penting: false bawaan.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: dunia pustaka dan komisariat muncul (muncul([...d.urutan, komisariat], { t: 0.6, selesai: 1.6 })). Pembicara dan komisariat abu penuh sejak awal.
1.2 sampai 1.7: bola dunia besar muncul di atas meja.
0.6 sampai 22.6: bola dunia berputar pelan di v.setiapFrame: bola.userData.aturPutar(0.6 * (min(t, 22.6) − 0.6)), sudut dalam radian.
1.6 sampai 4.0: kelima pembicara terangkat 0.3 unit dari lantai (lintas dari d.titik.duduk[i] ke posisi terangkat, durasi 2.4). Mereka melayang, tidak berpijak.
1.9 sampai 6.0: balon besar kosong muncul bergantian di atas kursi1, kursi3, kursi5, kursi2, lalu kursi4, pada 1.9, 2.6, 3.3, 4.0, dan 4.7. Setiap balon muncul 0.3 detik, lalu hilang 1.0 detik sesudah mulai (durasi 0.3). Balon terakhir hilang 5.7 sampai 6.0.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 6.9: balon kecil muncul di P0.
7.0 sampai 12.2: balon kecil melompat dari satu sisi bola ke sisi lain tanpa berhenti. Lompatan ke-k (k = 0 sampai 5) dari Pk ke Pk+1, mulai 7.0 + 0.9k, busur durasi 0.7, tinggi 0.8. Setiap lompatan hanya menyentuh permukaan bola lalu pergi lagi.
12.2 sampai 12.6: balon kecil hilang di P6.
Pembicara tetap melayang dan abu. Bola dunia tetap berputar. Kamera dekat ke bola (H 9).
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.8: bola dunia besar mengecil dan pindah ke latar: gantiBenda(bola, bolaKecil, { t: 13.2, durasi: 0.6, tempat: false }). Bola kecil ikut berputar pelan dengan rumus yang sama.
13.8 sampai 14.4: peta lokal muncul di atas meja, lalu kerucut sorot turun ke peta (muncul, 13.9 sampai 14.4).
14.6 sampai 15.4: kelima pembicara turun kembali ke lantai (lintas dari posisi terangkat ke d.titik.duduk[i], durasi 0.8). Mereka kembali berpijak.
15.0 sampai 15.8: abu kelima pembicara dilepas dari 1 ke 0.
15.8 sampai 17.94: lima kartu data, k = 0 sampai 4, mulai Tk = 15.8 + 0.36k: muncul di d.titik.depanKursi[k] (durasi 0.2, naik: 0), lalu terbang ke tumpukan di atas peta (busur, tinggi 0.5, durasi 0.5, dari Tk + 0.2 sampai Tk + 0.7). Kartu terakhir mendarat 17.94.
18.6 sampai 19.4: garis penghubung zamrud tergambar dari bola kecil ke tumpukan kartu data (aturTampak 0 ke 1). Isu besar dibaca dari kasus yang dekat.
19.6 sampai 20.3: tiga balon diskusi berisi garis muncul di atas kursi1, kursi3, dan kursi5 (jeda 0.2). Balon hilang pada 21.8 sampai 22.2.
20.6: klikEmas kelima kartu data bersamaan. Tumpukan menjadi emas.
21.0 sampai 21.8: abu komisariat dilepas dari 1 ke 0, sehingga komisariat kembali berwarna zamrudRedup.
Jangan menambah figur yang datang bergabung ke meja. Gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (PENGETAHUAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.6: whoosh pelan (kuat 0.3, durasi 2.4, posisi meja) saat pembicara terangkat;
6.6: balon (kuat 0.5, posisi P0) saat balon kecil muncul;
13.9: menyala (kuat 0.6, posisi meja) saat kerucut sorot turun;
18.6: garis-sambung (durasi 0.8, posisi meja) saat garis dari bola kecil tergambar.
Video ini tanpa figur berjalan, jadi tidak ada langkah yang perlu diredam.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di kartu data, grafik, atau peta. Peta lokal tidak diberi nama tempat. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML. Isi balon tidak terbaca (kosong, titik, atau garis).
Bola dunia tidak menampilkan nama negara, garis batas negara, atau penanda tempat nyata.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-42 --periksa, lalu lihat hasil/gambar/indikator-42/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: bola dunia besar berputar di atas meja, pembicara mulai terangkat, satu balon besar kosong di atas kursi3;
5.5: kelima pembicara melayang 0.3 unit, balon kosong di atas kursi4, semua pembicara abu;
9.5: kamera dekat ke bola dunia, balon kecil sedang melompat di atas sisi bola, kalimat sebab terbaca;
14.5: bola kecil di latar, peta lokal dan kerucut sorot di meja, kalimat ikhtiar pertama terbaca;
18.3: kelima kartu data sudah menumpuk di atas peta, pembicara berpijak dan tidak lagi abu;
21.7: tumpukan kartu emas, garis dari bola kecil tergambar, balon diskusi tampak, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-42. Hasilnya hasil/video/indikator-42.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda dunia yang ditiadakan, benda lokal bila ada), lalu hasil zona, warna, LUFS, dan sinkron.
