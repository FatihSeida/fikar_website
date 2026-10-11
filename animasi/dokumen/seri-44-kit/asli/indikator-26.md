Prompt Animasi Indikator 26 dari 44
Judul indikator: Strategi perjuangan HMI melemah.
Kelompok Tata Kelola. Mode Pandangan. Program terkait 05 Penataan Ulang Fungsi Balitbang.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-26/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-26 --format evidence --judul "Strategi perjuangan HMI melemah.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-26/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Arah layar di prompt ini memakai sudut s: titik(R cos s, R sin s), dengan 0 derajat ke kanan layar dan 90 derajat ke bawah layar.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Jalan kecil berwarna ubin kit. Kartu program berwarna kertas saat muncul, lalu abu penuh saat menjauh.
Bagian 2: panah pendek berwarna abu (W.abu). Kompas abu penuh. Kompas boleh berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: lembar kajian berwarna kertas, kompas melepas abu menjadi warna bawaannya, panah searah berwarna zamrudPijar (proses). Emas hanya untuk satu hasil: kompas yang jarumnya sudah menetap. Komisariat melepas abu sesudahnya.
Bagian 4 dan 5: diatur akhiriEvidence. Emas hanya pada lembar laporan.
Dilarang memakai merah, oranye, atau biru.
C. Waktu dan Kamera
Pembagian waktu memakai bawaan formatEvidence:
0.0 sampai 0.6: grid menyala;
0.6 sampai 6.0: Bagian 1, Gejala;
6.0 sampai 13.0: Bagian 2, sebab;
13.0 sampai 23.0: Bagian 3, Pandangan;
23.0 sampai 28.0: Bagian 4, Kuis;
28.0 sampai 31.0: Bagian 5, Kartu akhir.
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis:
fokus: d.fokus;
gejala: { muat: [komisariat, ...titikKartuAkhir] } (perkiraan H sekitar 14);
sebab: { muat: [komisariat, kompas, ...ujungPanahAbu], H: 9 };
ikhtiar: { muat: [komisariat, kompas, ...titikKartuAkhir, ...ujungPanahSearah], H: 12 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikKartuAkhir, ujungPanahAbu, dan ujungPanahSearah (masing-masing delapan titik) dijelaskan di bagian F.
D. Benda yang Dipakai
Dari kit:
jalanUbin({ titik: [awal, ujung], jumlah: 3 }) x 8: jalan kecil tiga ubin ke delapan arah.
kartuProker({ garis: 3, kaki: false, skala: 0.45 }) x 8: kartu program di ujung setiap jalan, tegak menghadap kamera.
panahGaris({ titik: [...], warna: W.abu, tebal: 0.035 }) x 8: panah pendek abu Bagian 2.
kompas({ arahJarum: 67.5 * Math.PI / 180, skala: 0.6 }): kompas rebah di tanah, jari cakram 0.54 sesudah skala. userData.bagian.jarum diputar dengan putar(..., { sumbu: "y" }).
lembarKertas({ rebah: false, garis: 4, skala: 0.5 }): lembar kajian.
panahGaris({ titik: [...], warna: W.zamrudPijar, tebal: 0.035 }) x 8: panah searah Bagian 3.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "26", kategori: "TATA KELOLA", judul: "Strategi perjuangan HMI melemah.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Program disusun satu per satu **tanpa arah yang sama**, jadi tenaga organisasi terpecah ke banyak tujuan."
ikhtiar (berisi kalimat pandangan):
{ teks: "HMI Evidence memandang strategi sebagai **arah yang disusun dari kajian keadaan organisasi**, bukan slogan.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Balitbang yang ditata ulang** menyusun kajian itu, lalu setiap program ditelusuri ke arah yang sama.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 05".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“ARAH KERJA”: label3D("ARAH KERJA", { pada: kompas, geser: [0, 0.35, 0], gaya: "mikro" }), masuk 8.6 sampai 9.0, keluar 22.6 sampai 23.0.
“KAJIAN”: label3D("KAJIAN", { pada: lembarKajian, geser: [0, 0.65, 0], gaya: "mikro" }), ikut tampak bersama lembar.
F. Dunia dan Posisi
Dunia dasar duniaSimpul(v, { tanpa: ["simpul", "layar"] }). Yang tersisa hanya komisariat (rumah()) di titik(0, 0) dengan d.fokus = titik(0, 0, 0.5). Titik dunia yang dipakai: d.titik.komisariat, d.titik.atap.
Delapan arah: s_k = 22.5 + 45k derajat (k = 0 sampai 7), vektor satuan u_k = titik(cos s_k, sin s_k). Tidak ada arah yang tepat ke atas layar, supaya ruang di atas komisariat bebas untuk kompas.
Benda tambahan dan posisinya (semuanya relatif ke d.titik.komisariat, y 0):
Jalan ke-k: dari 1.5 x u_k ke 3.3 x u_k, tiga ubin. Grup jalan di titik asal dunia.
Kartu ke-k: muncul di 3.5 x u_k, lalu bergeser ke 3.8 x u_k. titikKartuAkhir[k] = 3.8 x u_k.
Panah abu ke-k: dari 1.3 x u_k ke R_k x u_k pada y 0.3, dengan R_k berurutan 2.0, 2.6, 1.8, 2.3, 2.9, 2.1, 2.5, 1.9. Semua berhenti jauh sebelum kartu. ujungPanahAbu[k] = R_k x u_k.
Kompas: titik(0, -2.9), rebah di tanah (y 0.02), di antara jalan ke-5 (s 247.5) dan jalan ke-6 (s 292.5). Jarak ke kedua jalan 1.1 unit, cukup untuk cakram 0.54 dan ubin 0.45.
Arah bersama D = titik(0.383, -0.924) (s 292.5, kanan atas). Jarum kompas yang menetap menunjuk D, yaitu arahJarum 67.5 derajat menurut konvensi kompas (0 kanan, 90 derajat atas).
Lembar kajian: muncul di d.titik.atap + y 0.6, lalu melayang ke kompas + y 0.15.
Panah searah ke-k: dari 3.8 x u_k + titik(0, 0, 0.3) sepanjang 1.0 unit ke arah D. ujungPanahSearah[k] = 3.8 x u_k + D, y 0.3.
Pengecualian zona: kartu dan jalan boleh terpotong 6.0 sampai 13.0 (userData.penting = (t) => t < 6.0 || t >= 13.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.4: komisariat muncul (muncul(d.urutan, { t: 0.6, selesai: 1.4 })). Komisariat abu penuh sejak awal.
1.4 sampai 4.4: delapan jalan tumbuh satu per satu, urut k = 0 sampai 7, mulai 1.4 + 0.375k. Ubin setiap jalan muncul dari dekat komisariat ke luar (muncul(jalan.userData.bagian.ubin, { t, jeda: 0.08, naik: 0 })). Kartu jalan itu muncul di ujungnya 0.3 detik sesudah ubin terakhir.
4.4 sampai 6.0: kedelapan kartu bergeser menjauh dari 3.5 x u_k ke 3.8 x u_k (lintas, durasi 1.6, beku: false) dan menjadi abu penuh (setelKeadaan(kartu, "abu", halus(rentang(t, 4.4, 6.0)))). Tidak ada dua jalan yang searah.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 8.2: delapan panah abu tergambar dari dinding komisariat ke delapan arah (aturTampak 0 ke 1, jeda 0.15), masing-masing berhenti pendek di R_k.
8.4 sampai 8.9: kompas muncul di atas komisariat (muncul, naik 0), abu penuh. Label “ARAH KERJA” masuk 8.6.
9.0 sampai 12.6: jarum kompas berputar tidak menentu (putar(kompas.userData.bagian.jarum, { t: 9.0, durasi: 3.6, sudut: 6 * Math.PI + 2.0, sumbu: "y" })), lalu berhenti 2.0 radian menyimpang dari D.
9.0 sampai 12.6: denyutCermin(kompas, { mulai: 9.0, selesai: 12.6 }). Ini satu-satunya titik masalah.
12.6 sampai 13.0: adegan diam.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.9: lembar kajian muncul di atas atap komisariat (muncul, naik 0.3), seolah disusun dari dalam organisasi.
14.2 sampai 15.0: lembar kajian melayang ke kompas (busur, tinggi 0.6, durasi 0.8).
15.0 sampai 15.3: lembar kajian masuk ke kompas (hilang, durasi 0.3, turun 0.1).
15.0 sampai 15.4: abu kompas dilepas dari 1 ke 0.
15.0 sampai 15.8: jarum berputar sisa putarannya lalu menetap tepat di D (putar(kompas.userData.bagian.jarum, { t: 15.0, durasi: 0.8, sudut: 2 * Math.PI - 2.0, sumbu: "y" })). Jumlah kedua putaran 8π, sehingga jarum kembali ke arahJarum awal.
15.8 sampai 17.6: adegan diam, kalimat pandangan pertama terbaca.
18.2 sampai 19.0: kedelapan panah abu ditarik kembali (aturTampak 1 ke 0, jeda 0.05).
18.8 sampai 20.6: kedelapan panah searah zamrud tergambar dari kartu ke arah D (aturTampak 0 ke 1, jeda 0.2, urut k = 0 sampai 7). Abu setiap kartu dilepas dari 1 ke 0 selama 0.4 detik saat panahnya selesai tergambar.
21.0: klikEmas(kompas). Kompas satu-satunya benda emas.
21.4 sampai 22.2: abu komisariat dilepas dari 1 ke 0.
Kartu tidak berpindah tempat. Hanya arahnya yang disatukan. Tidak ada figur.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
6.6: garis-sambung pelan (kuat 0.4, durasi 1.6) saat panah abu tergambar;
15.0: kertas (posisi kompas) saat lembar kajian masuk ke kompas;
15.8: denting (kuat 0.5, posisi kompas) saat jarum menetap;
18.8: garis-sambung (kuat 0.5, durasi 1.8) saat panah searah tergambar.
Bunyi muncul ubin dibisukan sebagian: bunyi: { kuat: 0.3 } pada muncul ubin.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada huruf mata angin, angka, atau slogan di kompas dan kartu.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh menggambarkan kartu atau figur yang berbondong ke satu arah sesudah pandangan. Hanya panah yang menjadi searah.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-26 --periksa, lalu lihat hasil/gambar/indikator-26/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: empat atau lima jalan kecil sudah tumbuh dari komisariat, kartu muncul di ujungnya;
5.5: delapan jalan ke delapan arah, kartu sedang menjauh dan menjadi abu;
9.5: kamera dekat, panah abu pendek ke banyak arah, kompas abu berdenyut dengan jarum berputar, kalimat sebab terbaca;
14.5: lembar kajian sedang melayang ke kompas, kalimat pandangan pertama terbaca;
16.1: kompas lepas abu, jarum menetap ke kanan atas;
21.3: delapan panah zamrud searah, kompas emas, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-26. Hasilnya hasil/video/indikator-26.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, benda lokal, arah putar jarum).
