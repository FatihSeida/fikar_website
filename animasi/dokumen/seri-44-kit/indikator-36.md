Prompt Animasi Indikator 36 dari 44
Judul indikator: HMI tidak memiliki media representatif sebagai penghubung dan ruang gagasan.
Kelompok Data dan Jaringan. Mode Ikhtiar. Program terkait 09 Ruang Karya Kader dan 18 HMI Podcast dan Media Channel.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-36/. Folder video lain jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-36 --format evidence --judul "HMI tidak memiliki media representatif sebagai penghubung dan ruang gagasan.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-36/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Simpul lepas dan abu (setelKeadaan(simpul, "sambung", 0)). Penonton berwarna pion. Isi layar pamflet generik dari POLA_LAYAR.
Bagian 2: layar mati (POLA_LAYAR.kosong()). Kartu karya yang melayang tanpa arah berwarna abu (setelKeadaan(kartu, "abu", 1)). Satu titik masalah, yaitu layar kanal, boleh denyutCermin. Tidak ada emas.
Bagian 3: kartu karya, gelombang sinyal, dan garis sinyal berwarna zamrud (proses). Simpul berubah zamrud saat tersambung. Emas hanya untuk satu rantai hasil: layar kanal. Komisariat melepas abu sesudah layar menjadi emas.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Gelombang sinyal (skala 2.0) menjulang di atas layar, jadi gelombang itu sendiri dimasukkan ke muat.
fokus: d.fokus;
gejala: { muat: [d.benda.layar, d.benda.simpul3, d.benda.simpul5, d.benda.simpul7] } (perkiraan H sekitar 15);
sebab: { muat: [d.benda.layar, d.benda.komisariat, d.benda.simpul6, d.benda.simpul3], H: 10 };
ikhtiar: { muat: [d.benda.layar, gelombang, d.benda.simpul2, d.benda.simpul3, d.benda.simpul5, d.benda.simpul7], H: 12 } (H naik otomatis, perkiraan sekitar 18.5, supaya puncak gelombang tetap di zona).
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Kartu karya Bagian 2 sengaja keluar dari bingkai, jadi tidak dimasukkan.
D. Benda yang Dipakai
Dari kit:
Layar dunia (layarKanal, diperbesar lewat opsi dunia, lihat bagian F). Isi lewat setelIsi(kunci, fn) dengan POLA_LAYAR.pamflet(benih), POLA_LAYAR.kosong(), dan POLA_LAYAR.artikel(). Semuanya tanpa teks terbaca.
pion() x 6: penonton.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.5 }) x 6: kartu karya Bagian 2 (abu).
kartuKecil({ simbol: "garis", rebah: false, miring: 0, warna: W.zamrud, skala: 0.5 }) x 6: kartu karya Bagian 3.
gelombangSinyal({ sudut: Math.PI / 2, jumlah: 3, skala: 2.0 }): gelombang sinyal di atas layar (sudut dalam radian). bagian.sumber (titik sumber) dan bagian.busur[] dimunculkan berurutan.
garisPutus({ titik: [a, b], warna: W.zamrudPijar, lebar: 2 }) x 6: garis sinyal dari layar ke setiap simpul. geser(s) menjalankan ruasnya.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "36", kategori: "DATA DAN JARINGAN", judul: "HMI tidak memiliki media representatif sebagai penghubung dan ruang gagasan.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Karya dan gagasan kader **tidak punya kanal terbit yang tetap**, jadi tersebar lalu hilang di linimasa."
ikhtiar:
{ teks: "**Ruang Karya Kader** menghimpun tulisan dan karya kader dengan catatan yang rapi.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**HMI Podcast dan Media Channel** menjadi kanal terbit yang tetap, sehingga gagasan punya rumah.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 09 · Program 18".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Dunia dasar duniaSimpul(v, { tanpa: ["simpul1", "simpul8"], posisi: { layar: titik(-1.6, -2.2) }, opsi: { layar: { lebar: 3.6, tinggi: 2.4, kaki: 0.6 } } }) (resep 36 di docs dunia, diuji lolos zona). Layar 1.5 kali menutupi simpul1 dan simpul8, jadi keduanya ditiadakan. Benda: komisariat di titik(0, 0), simpul2 sampai simpul7 di lingkaran jari-jari 3.9 (simpul2 kanan atas, lalu searah jarum jam sampai simpul7 di kiri), layar di titik(-1.6, -2.2) menghadap kamera.
Titik dunia yang dipakai: d.titik.layar, d.titik.depanLayar, d.titik.komisariat, d.titik.simpul[1] sampai d.titik.simpul[6] (tetap ada walaupun simpul1 dan simpul8 ditiadakan).
Benda tambahan dan posisinya:
Penonton baris depan layar (4 figur): d.titik.depanLayar + titik(-1.25 + 0.7k, 0), k 0 sampai 3. Baris belakang (2 figur, lebih dekat ke penonton video): d.titik.depanLayar + titik(-0.55, 0.6) dan + titik(0.15, 0.6). Semua rotasi y 5 * Math.PI / 4 (membelakangi kamera, menghadap layar).
Arah pergi penonton: 1.0 unit ke arah titik(-0.6, 0.8) yang dinormalkan (kiri bawah), menjauhi komisariat.
Kartu karya Bagian 2: asal d.titik.simpul[i] + y 0.4 (i 1 sampai 6). Arah luar u = arah dari komisariat ke simpul itu di tanah, s = u diputar 90 derajat (tanda berselang-seling per kartu). Jalur: [awal, awal + u × 1.0 + s × 0.6 + y 0.6, awal + u × 2.6 + y 1.0], lengkung: true.
Kartu karya Bagian 3: asal sama, tujuan d.titik.layar, lewat titik tengah yang dinaikkan 1.0 (lengkung: true).
Gelombang sinyal: di d.titik.layar + y 1.4 (di atas tepi atas layar), menghadap kamera.
Garis sinyal: dari d.titik.layar ke d.titik.simpul[i], i 1 sampai 6.
Pengecualian zona: simpul2 sampai simpul7 boleh terpotong selama 6.0 sampai 13.0 (userData.penting = (t) => t < 6.0 || t >= 13.0). Kartu karya Bagian 2 tidak dihitung (penting: false). Garis sinyal dikecualikan bila kotak pembatasnya dilaporkan keluar zona padahal garisnya di dalam (abaikanZona, lihat USULAN kit).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: komisariat, keenam simpul, layar, dan penonton muncul (muncul([...d.urutan, ...penonton], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh, simpul lepas dan abu.
0.6 sampai 6.6: layar menampilkan pamflet generik yang berganti tiap 0.6 detik tetapi tampak sama: setelIsi(Math.floor(t / 0.6), POLA_LAYAR.pamflet(Math.floor(t / 0.6) % 2)).
1.8 sampai 6.0: penonton pergi satu per satu, baris belakang lebih dulu, mulai 1.8, 2.4, 3.0, 3.6, 4.2, dan 4.8. Masing-masing: berbalik (putar, sudut: Math.PI, durasi: 0.4, sumbu: "y"), lalu jalan 1.0 unit ke arah pergi (durasi: 0.8, bunyi: { kuat: 0.25 }), lalu hilang saat tiba (durasi: 0.3). Penonton terakhir tiba tepat 6.0, jadi tidak ada yang dibekukan.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6: layar mati, isinya POLA_LAYAR.kosong() dengan kunci "mati".
7.0 sampai 11.1: enam kartu karya abu keluar dari simpul2 sampai simpul7, mulai 7.0 + 0.5i (i 0 sampai 5). Masing-masing muncul (durasi: 0.3, naik: 0), melayang tanpa arah di jalurnya (lintas, durasi: 1.6, lengkung: true), lalu hilang 1.2 detik sesudah mulai (durasi: 0.4), sebelum tiba di ujung. Karya tersebar lalu hilang di tepi.
9.6 sampai 12.6: layar kanal berdenyut (denyutCermin(d.benda.layar, { mulai: 9.6, selesai: 12.6 })).
11.1 sampai 13.0: adegan diam. Layar mati, simpul tetap lepas.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 16.9: enam kartu karya zamrud keluar dari simpul2 sampai simpul7, mulai 13.4 + 0.5i. Masing-masing muncul (durasi: 0.3, naik: 0), meluncur ke layar (lintas, durasi: 1.0, lengkung: true), lalu hilang saat tiba (durasi: 0.2).
14.4: kartu pertama tiba, isi layar menjadi tata letak artikel yang rapi (POLA_LAYAR.artikel(), kunci "artikel") dan tetap sampai akhir. Layar menyala kembali.
18.2 sampai 18.6: gelombang sinyal muncul di atas layar (muncul([gelombang.userData.bagian.sumber, ...gelombang.userData.bagian.busur], { t: 18.2, jeda: 0.12, naik: 0 })).
18.6 sampai 20.7: enam garis sinyal tergambar dari layar ke simpul2 sampai simpul7, mulai 18.6 + 0.3i, masing-masing dalam 0.6 detik (aturTampak 0 ke 1). Ruasnya berjalan dari layar ke simpul (geser(1.2 × min(t, 22.6))).
Saat garis ke simpul itu selesai tergambar, simpul tersambung dalam 0.3 detik (setelKeadaan(simpul, "sambung", 0 ke 1)).
21.0: klikEmas(d.benda.layar).
21.0 sampai 21.8: abu komisariat dilepas dari 1 ke 0.
21.8 sampai 23.0: adegan diam. Jangan menampilkan penonton yang berbondong kembali ke layar. Gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (DATA DAN JARINGAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Geseran ruas garis sinyal berhenti di 22.6. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
6.6: padam (kuat 0.5) di layar saat layar mati;
14.4: menyala (kuat 0.5) di layar saat isi artikel muncul;
18.6 dan 20.1: garis-sambung (kuat 0.4, durasi 0.6) untuk garis sinyal pertama dan terakhir.
Langkah penonton dibisukan sebagian: bunyi: { kuat: 0.25 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada teks terbaca, logo platform media sosial, atau nama kanal nyata di layar. Isi layar hanya pola POLA_LAYAR.
Tidak boleh ada angka di layar atau kartu.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-36 --periksa, lalu lihat hasil/gambar/indikator-36/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: layar menampilkan pamflet, penonton pertama sedang menghilang, penonton kedua berjalan pergi, penonton ketiga mulai berbalik;
5.5: hanya satu penonton yang tersisa dan sedang berjalan pergi, simpul tetap abu;
10.2: kamera lebih dekat, layar mati, dua atau tiga kartu karya abu melayang menjauh dari simpul, layar berdenyut, kalimat sebab terbaca;
14.5: kartu karya zamrud mengalir ke layar, layar menampilkan artikel, kalimat ikhtiar pertama terbaca;
19.5: gelombang sinyal tampak, sebagian garis sinyal sudah tergambar dan simpulnya zamrud;
22.1: semua simpul tersambung, layar emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-36. Hasilnya hasil/video/indikator-36.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, simpul yang ditiadakan), lalu hasil zona, warna, LUFS, dan sinkron.
