Prompt Animasi Indikator 30 dari 44
Judul indikator: Gagasan pembaruan HMI tidak lagi tampak kuat.
Kelompok Pengetahuan. Mode Ikhtiar. Program terkait 09 Ruang Karya Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-30/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-30 --format evidence --judul "Gagasan pembaruan HMI tidak lagi tampak kuat.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-30/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Lampu gagasan besar menyala zamrud redup (warnaNyala: "zamrud", nyala paling tinggi 0.25), lalu padam ke abuGelap. Kotak usulan berwarna pelat dan berdebu.
Bagian 2: lampu kecil menyala zamrud paling tinggi 0.5, lalu padam dan menjadi abu. Kotak usulan boleh berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: petak uji, tunas, dan kartu catatan berwarna zamrud atau kertas (proses). Emas hanya untuk satu rantai hasil: tunas pertama lalu kartu catatannya. Komisariat melepas abu sesudahnya.
Bagian 4 dan 5: diatur akhiriEvidence. Emas hanya pada lembar laporan.
Dilarang memakai merah, oranye, atau biru. Lampu gagasan tidak boleh memakai nyala emas.
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
gejala: { muat: [d.benda.rakKiri, d.benda.rakKanan, d.benda.meja, lampuBesar, kotakUsulan, komisariat] } (perkiraan H sekitar 16);
sebab: { muat: [d.benda.meja, ...lampuKecil, kotakUsulan], H: 9 };
ikhtiar: { muat: [d.benda.meja, petak1, petak2, petak3, kartuCatatan], H: 11 };
tambahan: [{ t: [20.6, 21.4], muat: [petak1, petak3, komisariat], H: 12 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, diperkecil scale.setScalar(0.75) supaya muat di lantai pustaka.
lampuGagasan({ radius: 0.45, tali: 0.8, warnaNyala: "zamrud" }): lampu gagasan besar. Kuat cahaya lewat keadaan "nyala" (0 padam abuGelap).
lampuGagasan({ radius: 0.14, tali: 0.05, warnaNyala: "zamrud" }) x 5: lampu gagasan kecil di meja.
kotakCelah({ warna: W.pelat, debu: true, label: "USULAN" }): kotak usulan. userData.titikCelah, userData.aturDebu(k).
debu({ ... }): debu yang naik dari kotak usulan.
petakTanah({ lebar: 1.2, tinggi: 0.2, dalam: 1.2 }): petak uji pertama. petakTanah({ lebar: 0.9, tinggi: 0.2, dalam: 0.9 }) x 2: petak kedua dan ketiga. userData.tinggiAtas = permukaan atas.
tunas({ tinggi: 0.7, tumbuh: 0 }) x 3: tunas di tiap petak. userData.aturTumbuh(k).
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.6 }): kartu catatan uji, tegak menghadap kamera.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "30", kategori: "PENGETAHUAN", judul: "Gagasan pembaruan HMI tidak lagi tampak kuat.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Usulan baru **ditolak atau dibiarkan sebelum diuji**, jadi tidak pernah ada bukti apakah ia berhasil."
ikhtiar:
{ teks: "**Ruang Karya Kader** memberi ruang uji coba kecil bagi usulan kader.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Hasil uji coba dicatat, sehingga gagasan yang berhasil punya bukti untuk diperluas.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 09".
kuis: { pertanyaan: "Dalam tiga bulan terakhir, berapa tulisan atau kajian yang dihasilkan kader komisariatmu?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label “USULAN” adalah label bawaan kotakCelah, ikut tampak bersama kotak.
“UJI COBA”: label3D("UJI COBA", { pada: petak1, geser: [0, 1.2, 0], gaya: "mikro" }), masuk 13.9 sampai 14.3, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaPustaka(v, { tanpa: ["lentera", "kursi"] }) (resep 30 di docs dunia). Bangku tetap ada dan kosong, karena tidak ada yang datang mengusulkan. Benda: lantai (permukaan y 0.1) di titik(0, 0), rakKiri di titik(-2.6, -2.8, 0.1), rakKanan di titik(2.4, -2.9, 0.1), meja (mejaBundar, permukaan y 0.85) di titik(0, 1.0, 0.1), bangku1 sampai bangku5 pada radius 1.8.
Titik dunia yang dipakai: d.titik.pusatLentera, d.titik.depanKursi[0] sampai d.titik.depanKursi[4], d.titik.meja. Semua benda tambahan yang berdiri di lantai memakai y 0.1.
Dunia ini tidak punya komisariat. Tambahkan komisariat = v.tambah(rumah()), skala 0.75, di titik(3.0, 0.6, 0.1), di sisi kanan lantai, bebas dari bangku kanan depan dan kotak usulan.
Benda tambahan dan posisinya:
Lampu gagasan besar: pusat bola di d.titik.pusatLentera (y 3.0), jadi titik asalnya di d.titik.pusatLentera − y 0.45.
Lampu kecil ke-i: di d.titik.depanKursi[i], berdiri di permukaan meja.
Kotak usulan: titik(2.6, 2.4, 0.1) (resep kit).
Debu: pusat di titik dunia kotakUsulan.localToWorld(kotakUsulan.userData.titikCelah.clone()).
Petak 1: titik(-2.6, 2.4, 0.1) (resep kit). Petak 2: titik(-1.4, 3.1, 0.1). Petak 3: titik(-3.3, 1.3, 0.1). Ketiganya sejajar sumbu dunia, tidak saling menyentuh, dan tidak menyentuh bangku.
Tunas ke-k: di pusat permukaan petak ke-k (y 0.1 + tinggiAtas).
Kartu catatan: petak 1 + titik(-0.95, 0.15), y 0.1, di kiri bawah petak 1.
Lampu yang dipindah: lampu kecil ke-1 (d.titik.depanKursi[1], kiri depan meja) ke pusat permukaan petak 1 + y 0.05. Lampu kecil ke-0 ke petak 2 dan lampu kecil ke-2 ke petak 3 dengan cara yang sama.
Pengecualian zona: rakKiri, rakKanan, dan lampu besar boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). komisariat boleh terpotong 6.0 sampai 20.6 ((t) => t < 6.0 || t >= 20.6). kotakUsulan boleh terpotong sesudah 13.0 ((t) => t < 13.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: dunia pustaka, lampu besar, kotak usulan, dan komisariat muncul (muncul([...d.urutan, lampuBesar, kotakUsulan, komisariat], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal. Bangku kosong. Lapisan debu kotak penuh (aturDebu(1)).
Lampu besar di v.setiapFrame (setelKeadaan(lampuBesar, "nyala", n)): n = 0.25 pada 0.6 sampai 1.7; berkedip lemah dua kali, turun ke 0.05 lalu naik lagi ke 0.25 pada 1.7 sampai 2.0 dan 2.3 sampai 2.6; lalu meredup dari 0.25 ke 0 pada 2.8 sampai 5.4. Hitung n dari t saja.
1.8 sampai 5.8: debu naik dari celah kotak usulan (debu({ pusat, mulai: 1.8, selesai: 5.8, jumlah: 14, sebar: 0.35, naik: 0.8, benih: 30, beku: false })). Debu terakhir hilang sebelum 6.6.
Lampu padam penuh 5.4. Bangku tetap kosong.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.4: lima lampu kecil muncul di permukaan meja di depan setiap bangku (muncul, jeda 0.15, naik 0.2), padam.
7.6 sampai 11.6: lampu kecil menyala sebentar lalu padam satu per satu, urut ke-0 sampai ke-4, mulai 7.6, 8.4, 9.2, 10.0, dan 10.8. Untuk lampu yang mulai di t0: nyala 0 ke 0.5 pada t0 sampai t0 + 0.3, tetap 0.5 sampai t0 + 0.6, lalu turun ke 0 pada t0 + 0.6 sampai t0 + 1.0, kemudian abu penuh dalam 0.3 detik. Semua disetel di v.setiapFrame.
11.0 sampai 12.8: denyutCermin(kotakUsulan, { mulai: 11.0, selesai: 12.8 }). Ini satu-satunya titik masalah: usulan yang dibiarkan berdebu.
12.8 sampai 13.0: adegan diam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.9: petak uji pertama muncul (muncul, naik 0.3). Label “UJI COBA” masuk 13.9.
14.0 sampai 14.4: abu lampu kecil ke-1 dilepas dari 1 ke 0 dan nyalanya naik lagi ke 0.4.
14.4 sampai 15.2: lampu itu dipindah dari meja ke petak uji (busur, tinggi 1.0, durasi 0.8).
15.2 sampai 15.6: lampu masuk ke tanah petak (hilang, durasi 0.4, turun 0.3).
15.4 sampai 17.0: tunas pertama tumbuh dari petak (tunas1.userData.aturTumbuh(halus(rentang(t, 15.4, 17.0))) di v.setiapFrame).
16.6 sampai 17.1: kartu catatan uji muncul di samping petak (muncul, naik 0.3).
17.1 sampai 17.6: adegan diam, kalimat ikhtiar pertama terbaca.
18.2 sampai 18.9: petak kedua dan ketiga dibuka (muncul, jeda 0.3, naik 0.3).
19.0 sampai 19.8: lampu kecil ke-0 dan ke-2 melepas abu (19.0 sampai 19.3), lalu dipindah ke petak kedua dan ketiga (busur, tinggi 1.0, durasi 0.8, mulai 19.0 dan 19.2).
19.8 sampai 20.4: kedua lampu masuk ke tanah (hilang, mulai 19.8 dan 20.0). Tunas kedua dan ketiga mulai tumbuh sedikit, aturTumbuh 0 ke 0.3 pada 20.0 sampai 21.0. Keduanya masih tahap uji, tidak menjadi emas.
21.0: klikEmas([tunas1, kartuCatatan], { jeda: 0.2 }).
21.4 sampai 22.2: abu komisariat dilepas dari 1 ke 0.
Bangku tetap kosong. Jangan menampilkan figur yang berdatangan mengisi bangku. Itu klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (PENGETAHUAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
5.4: padam (kuat 0.5, posisi lampu besar) saat lampu gagasan besar padam;
setiap lampu kecil saat padam (t0 + 0.6): padam (kuat 0.4, posisi lampu itu);
15.4: tumbuh (kuat 0.5, durasi 1.6, posisi petak 1) saat tunas pertama tumbuh;
16.6: kertas (posisi kartu catatan) saat kartu catatan muncul.
Bunyi debu Bagian 1 dibisukan sebagian: bunyi: { kuat: 0.3 } pada debu.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka atau tulisan di kartu catatan, petak, atau kotak usulan selain label “USULAN” dan “UJI COBA”.
Tidak boleh ada warna merah, oranye, atau biru. Lampu gagasan tidak boleh menyala emas.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh menampilkan figur yang berdatangan atau bangku yang terisi sesudah ikhtiar. Itu klaim hasil.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-30 --periksa, lalu lihat hasil/gambar/indikator-30/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: ruang baca dengan bangku kosong, lampu gagasan besar redup zamrud, debu naik dari kotak usulan;
5.5: lampu besar padam, kotak usulan berdebu, bangku tetap kosong;
9.5: kamera dekat ke meja, dua lampu kecil sudah padam abu, satu sedang menyala, kalimat sebab terbaca;
14.5: petak uji tampak dengan label UJI COBA, lampu kecil sedang dipindah ke petak, kalimat ikhtiar pertama terbaca;
19.5: petak kedua dan ketiga sudah terbuka, dua lampu sedang dipindah;
21.3: tunas pertama dan kartu catatan emas, tunas kedua dan ketiga masih kecil, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-30. Hasilnya hasil/video/indikator-30.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, benda lokal, skala komisariat).
