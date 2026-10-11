Prompt Animasi Indikator 04 dari 44
Judul indikator: Kader penerus kurang melanjutkan pandangan visioner para pendahulu.
Kelompok Kaderisasi. Mode Pandangan. Program terkait 09 Ruang Karya Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-04-v2/. Folder lama animasi/proyek/indikator-04/ (bila ada) jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-04-v2 --format evidence --judul "Kader penerus kurang melanjutkan pandangan visioner para pendahulu.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-04-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: rak kiri (rak pendahulu) abu penuh dan berdebu. Komisariat abu penuh. Lentera padam. Balon kutipan berupa garis putus tanpa badan.
Bagian 2: podium dan balon kata tetap warna bawaan. Satu titik masalah boleh berdenyut zamrud: keenam buku besar pendahulu (denyutCermin). Tidak ada emas.
Bagian 3: buku terbuka dan garis tautan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: lembar karya kader yang masuk rak di samping buku pendahulu.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Nama kunci tetap ikhtiar walaupun mode pandangan:
fokus: d.fokus;
gejala: { muat: [d.benda.rakKiri, d.benda.rakKanan, d.benda.meja, komisariat] } (H dihitung otomatis);
sebab: { muat: [d.benda.rakKiri, podium, ujungBalonKiri, ujungBalonKanan], H: 9 };
ikhtiar: { muat: [d.benda.rakKiri, d.benda.meja, d.titik.meja], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [d.benda.rakKiri, d.benda.meja, d.titik.depanKursi[0], titikRakKarya], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. ujungBalonKiri dan ujungBalonKanan adalah titik akhir balon kata (bagian F). titikRakKarya adalah tempat lembar karya di rak.
D. Benda yang Dipakai
Dari kit:
duniaPustaka(v, { opsi: { rakKiri: { debu: true, bukuBesar: 6 } } }): dunia Pustaka dengan resep kit indikator 04. Buku besar pendahulu di ruang rak ke-2 dari bawah: d.benda.rakKiri.userData.bagian.bukuBesar (6 buah). Debu rak lewat d.benda.rakKiri.userData.aturDebu(k).
rumah(): komisariat, diskalakan 0.7 (scale.setScalar(0.7)).
balonKata({ isi: "kosong", putus: true, skala: 0.5 }) x 3: balon kutipan bergaris putus tanpa badan.
debu({ ... }): debu yang naik dari rak pendahulu.
podium({ pion: true }): podium dengan figur orator di atasnya (podium.userData.bagian.pion). Rotasi 0, menghadap kamera.
balonKata({ isi: "garis", skala: 0.45 }) x 4: balon kata orator. Isinya garis tanpa teks terbaca.
buku({ berdiri: true, tinggi: 0.54, lebar: 0.5, tebal: 0.25, warna: W.abu }): salinan buku besar yang diambil dari rak, berdiri dengan punggung menghadap +z seperti di rak (ukurannya sama dengan buku besar rak: 0.25 x 0.54 x 0.5; rak membatasi tinggi buku besar 0.6 menjadi 0.54). Putar sama dengan rak kiri supaya punggungnya menghadap kamera.
buku({ terbuka: true, tinggi: 0.8, lebar: 0.6, warna: W.zamrudRedup }): buku pendahulu yang dibuka di meja.
lembarKertas({ rebah: false, miring: 0, lebar: 0.5, panjang: 0.5, garis: 4 }): lembar karya kader. Berdiri, menghadap kamera (hadap bawaan 45 derajat).
garisPutus({ titik: [...], lengkung: true, warna: W.zamrudPijar, lebar: 3 }): garis tautan dari buku terbuka ke lembar karya.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "04", kategori: "KADERISASI", judul: "Kader penerus kurang melanjutkan pandangan visioner para pendahulu.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Gagasan pendahulu **hanya dikutip** di pidato, jarang dibaca utuh dan dilanjutkan menjadi karya."
ikhtiar (kalimat pandangan):
{ teks: "HMI Evidence memandang warisan pendahulu sebagai **bahan kerja**, bukan hiasan pidato.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Karena itu **Ruang Karya Kader** menautkan bacaan pendahulu dengan tulisan kader yang bisa dibaca angkatan berikutnya.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 09".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Dunia dasar duniaPustaka dengan resep 04. Benda dunia: lantai di titik(0, 0) (permukaan y 0.1), rakKiri di titik(-2.6, -2.8, 0.1), rakKanan di titik(2.4, -2.9, 0.1), meja di titik(0, 1.0, 0.1) (permukaan y 0.85), bangku1..5 dan kursi1..5 pada radius 1.8 dari pusat meja, lentera1..5 padam di atas meja (pusat bola y 3.0). Prompt lama memakai rak tanpa arah dan lantai 8 x 8; tata letak kit yang dipakai.
Titik dunia yang dipakai: d.titik.atasKepala[i], d.titik.meja, d.titik.depanKursi[0], d.titik.rakKiri.
Benda tambahan dan posisinya:
Komisariat: titik(2.6, 2.5, 0.1), di sudut kanan bawah lantai, rotasi 0, skala 0.7. Tidak menyentuh kursi kanan depan.
Balon kutipan 1, 2, 3: titik ekor di d.titik.atasKepala[1], d.titik.atasKepala[3], dan d.titik.atasKepala[4] (kursi kiri depan, kanan belakang, kanan depan).
Debu: pusat di d.titik.rakKiri + titik(0, 0.5) (di depan muka rak), sebar: 1.0.
Podium: titik(0, -1.0, 0.1), di belakang meja dan di antara kedua rak. Kepala orator kira-kira y 2.35 di atas lantai.
Balon kata orator: titik ekor mulai di atas kepala orator, podium.position + y 2.45. Balon 1 dan 3 bergerak ke ujungBalonKiri = titik mulai + titik(-1.6, 0, 0.4); balon 2 dan 4 ke ujungBalonKanan = titik mulai + titik(1.6, 0, 0.4).
Buku yang diambil: mulai di posisi dunia buku besar ketiga (bukuBesar[2].getWorldPosition(...)), lalu ke d.titik.meja + y 0.02, lewat titik tengah titik(-1.3, -1.0, 2.2).
Buku terbuka: d.titik.meja + y 0.02, tanpa rotation.y tambahan (hadap bawaan 45 derajat sudah membuat halamannya mendatar di layar).
Lembar karya: tepi bawah di d.titik.depanKursi[0] (di permukaan meja, di depan kursi terdekat ke penonton).
Garis tautan: titik [d.titik.meja + y 0.15, titik tengah antara buku dan lembar + y 0.6, lembar karya + y 0.35].
titikRakKarya: lantai ruang rak ke-2, di samping kanan buku besar keenam: posisi dunia bukuBesar[5] digeser 0.28 ke arah +x lokal rak kiri, y sama dengan alas buku besar, digeser 0.05 ke arah muka rak (+z lokal rak). Bila tempat itu sudah terisi buku biasa, sembunyikan buku biasa yang tertimpa (rakKiri.userData.bagian.buku[i].visible = false) sebelum frame pertama dan laporkan nomornya.
Pengecualian zona (laporkan): lentera1..5 dan rakKanan boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). Komisariat (t) => t < 6.0 || t >= 17.5. Kursi dan bangku (t) => t < 6.0 || t >= 13.0.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: dunia Pustaka dan komisariat muncul (muncul([...d.urutan, komisariat], { t: 0.6, selesai: 1.6 })). Lentera padam semua. Komisariat abu penuh sejak awal.
1.6 sampai 2.6: tiga balon kutipan muncul di atas kursi kiri depan, kanan belakang, dan kanan depan (1.6, 1.9, 2.2; durasi 0.4, naik: 0). Balon kosong dan diam.
3.6 sampai 4.6: rak kiri menjadi abu penuh (setelKeadaan(rakKiri, "abu", ...)) dan debunya menebal dari 0 ke 1 (aturDebu).
3.6 sampai 6.0: debu melayang naik dari rak pendahulu (debu({ pusat, mulai: 3.6, selesai: 6.0, jumlah: 14, sebar: 1.0, naik: 0.8, benih: 4 })).
4.4, 4.9, 5.4: balon kutipan hilang satu per satu (durasi 0.4, turun: 0).
Debu yang masih melayang melambat 6.0 dan berhenti 6.6 (beku bawaan).
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: podium dengan orator muncul di belakang meja.
7.2 sampai 11.4: empat balon kata keluar dari atas kepala orator pada 7.2, 8.2, 9.2, dan 10.2. Setiap balon muncul (durasi 0.3, naik: 0), lalu bergerak menjauh ke ujungnya (lintas, mulai 0.3 sesudah muncul, durasi 0.9, tanpa lengkung), lalu hilang (durasi 0.3) tepat saat tiba. Balon 1 dan 3 ke kiri, balon 2 dan 4 ke kanan.
8.0 sampai 12.8: keenam buku besar pendahulu berdenyut zamrud (denyutCermin(rakKiri.userData.bagian.bukuBesar, { mulai: 8.0, selesai: 12.8 })). Buku tetap di raknya dan tetap tertutup. Rak tetap abu dan berdebu.
11.4 sampai 13.0: adegan diam. Orator tetap di podium.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.4: podium hilang.
13.6 sampai 13.9: buku besar ketiga diambil dari rak: gantiBenda(bukuBesar[2], bukuAmbil, { t: 13.6, durasi: 0.3, tempat: false }), dengan bukuAmbil sudah diletakkan di posisi dunia buku besar itu.
13.9 sampai 14.6: buku yang diambil melayang ke meja (lintas, durasi 0.7, lengkung: true, lewat titik tengah di bagian F).
14.0 sampai 15.0: debu rak kiri hilang (aturDebu 1 ke 0). 14.6 sampai 15.4: rak kiri melepas abu (1 ke 0).
14.7 sampai 15.1: buku berubah menjadi buku terbuka di meja (gantiBenda(bukuAmbil, bukuBuka, { t: 14.7, durasi: 0.4, tempat: false })).
15.1 sampai 17.6: adegan tetap. Buku terbuka di tengah meja.
18.0 sampai 18.4: lembar karya kader muncul di depan kursi terdekat ke penonton (naik: 0.3).
18.4 sampai 19.2: garis tautan zamrud tergambar dari buku terbuka ke lembar karya (aturTampak 0 ke 1).
20.0 sampai 20.9: lembar karya terbang ke rak pendahulu dan berdiri di titikRakKarya, di samping buku besar (busur, tinggi 1.0, durasi 0.9). Garis tautan tetap tampak.
21.1: lembar karya klikEmas. Ini satu-satunya rantai emas.
21.1 sampai 22.6: adegan tetap. Lentera tetap padam. Jangan menambah figur yang datang membaca.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Abu komisariat tetap 1 sampai 23.0 dan dilepas oleh akhiriEvidence.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
3.6: debu (kuat 0.5, posisi d.titik.rakKiri) saat rak mulai berdebu;
7.2: gemuruh pelan (kuat 0.25, durasi 4.0, posisi podium) selama orator berbicara;
18.4: garis-sambung (durasi 0.8, posisi dari buku terbuka ke lembar karya);
20.9: kertas (kuat 0.5, posisi titikRakKarya) saat lembar masuk rak.
Tidak ada figur yang berjalan, jadi tidak perlu peredaman langkah.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata. Buku pendahulu tidak diberi judul, nama pengarang, atau wajah.
Tidak boleh ada teks kutipan yang terbaca di balon. Balon kutipan kosong, balon orator berisi garis.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada rombongan figur yang datang ke rak sesudah pandangan. Hasil cukup ditunjukkan oleh lembar karya emas.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-04-v2 --periksa, lalu lihat hasil/gambar/indikator-04-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: tiga balon kutipan bergaris putus kosong di atas kursi, lentera padam, komisariat abu di sudut kanan bawah;
5.5: rak kiri abu dan berdebu, debu melayang, balon terakhir sedang hilang;
9.5: kamera dekat ke rak kiri dan podium, satu balon kata sedang menjauh, buku besar berdenyut zamrud, kalimat sebab terbaca;
14.5: buku besar sedang melayang ke meja, debu rak menipis, kalimat pandangan pertama terbaca;
19.5: lembar karya berdiri di depan kursi, garis tautan zamrud sudah tergambar dari buku terbuka;
21.9: lembar karya emas berdiri di rak di samping buku besar, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-04-v2. Hasilnya hasil/video/indikator-04-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, buku biasa yang disembunyikan di rak), lalu hasil zona, warna, LUFS, dan sinkron.
