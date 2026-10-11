Prompt Animasi Indikator 33 dari 44
Judul indikator: Dokumen dan sejarah organisasi belum dikelola dengan kuat.
Kelompok Evaluasi dan Arsip. Mode Ikhtiar. Program terkait 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-33/. Folder video lain jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-33 --format evidence --judul "Dokumen dan sejarah organisasi belum dikelola dengan kuat.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-33/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Lemari kosong berwarna bawaan. Pengurus berwarna pion.
Bagian 2: lembar dokumen yang berserakan berwarna abu (setelKeadaan(lembar, "abu", 1)). Satu titik masalah, yaitu lemari kosong, boleh denyutCermin. Tidak ada emas.
Bagian 3: tag identitas, lembar yang sudah bertag, gedung cabang, dan aliran berwarna zamrud atau bawaan (proses). Emas hanya untuk satu rantai hasil: lemari yang sudah berisi. Komisariat melepas abu sesudah lemari menjadi emas.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Titik bantu: S = titik(-0.6, 0.8) (pusat sebaran lembar), sebarKiri = S + titik(-1.2, 0), sebarKanan = S + titik(1.2, 0.4).
fokus: d.fokus;
gejala: { muat: [d.benda.lemari, pintuKeluar, komisariat, pengurus1, pengurus5] } (perkiraan H sekitar 13);
sebab: { muat: [d.benda.lemari, sebarKiri, sebarKanan], H: 9 };
ikhtiar: { muat: [d.benda.lemari, sebarKiri, sebarKanan, komisariat], H: 11 };
tambahan: [{ t: [17.4, 18.4], muat: [d.benda.lemari, komisariat, cabang], H: 12 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Lembar yang terbang keluar layar sengaja tidak dimasukkan.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7. Dunia Arsip tidak punya komisariat, jadi benda ini ditambahkan.
bingkaiPintu(): pintu keluar, lubang 1.0 x 1.9, daun terbuka bawaan.
pion({ pegang: ponselKecil({ dokumen: 3 }) }) x 5: pengurus yang membawa dokumen di ponselnya masing-masing.
Lembar dokumen dengan tiga bentuk, masing-masing 3 buah (9 lembar), semuanya berbaring:
bentuk A: kartuKecil({ simbol: "garis", skala: 0.7 }), 0.42 x 0.56;
bentuk B: lembarKertas({ lebar: 0.55, panjang: 0.7, garis: 3 });
bentuk C: lembarKertas({ lebar: 0.7, panjang: 0.45, garis: 2 }).
tag({ rebah: true, warnaPita: W.zamrud }) x 6: tag identitas, satu untuk setiap lembar yang tersisa.
gedungCabang(): gedung cabang, 2.0 x 2.4 x 2.0, jendela menyala bawaan.
aliran({ ... }): aliran zamrud dari lemari lewat komisariat ke gedung cabang.
debu({ ... }): kepulan kecil saat lembar tertiup.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "33", kategori: "EVALUASI DAN ARSIP", judul: "Dokumen dan sejarah organisasi belum dikelola dengan kuat.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Dokumen dibuat **tanpa identitas yang seragam**, jadi tidak bisa ditemukan lagi saat dibutuhkan."
ikhtiar:
{ teks: "**Arsip dan Memori Organisasi** memberi setiap dokumen nomor, tanggal, dan pembuat yang seragam.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Dokumen dihimpun berjenjang dari komisariat ke cabang, sehingga menjadi memori bersama.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 10".
kuis: { pertanyaan: "Di mana notulensi, keputusan, dan dokumen komisariatmu disimpan?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label mikro kelas zamrud “NOMOR · TANGGAL · PEMBUAT” di atas lembar bertag pertama, geser [0, 0.45, 0]. Masuk 13.6 sampai 14.0, keluar 15.2 sampai 15.5 (sebelum lembar itu terbang ke lemari).
Label “KOMISARIAT” gaya benda di atas komisariat, geser [0, 2.3, 0], dan label “CABANG” gaya benda di atas gedung cabang, geser [0, 2.8, 0]. KOMISARIAT masuk 18.0 sampai 18.4, CABANG masuk bersama gedungnya. Keduanya keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaArsip(v, { tanpa: ["garisWaktu", "folder"], opsi: { lemari: { isi: "kosong", buka: 1 } } }) (resep 33 di docs dunia). Benda yang tersisa: lemari di titik(-2.6, -1.4), rotasi y 20 derajat, pintu terbuka dan rak kosong. Garis waktu dan folder bersama tidak dipakai di video ini.
Titik dunia yang dipakai: d.titik.lemari, d.titik.depanLemari, d.titik.rakLemari[0] sampai [2] (bawah ke atas).
Benda tambahan dan posisinya:
Komisariat: di titik(1.8, 2.2), rotasi 0.
Pintu keluar: bingkaiPintu() di titik(-2.8, 2.2), rotasi 0 (menghadap kamera). Posisi resep titik(-3.6, 1.2) menutupi daun pintu kiri lemari yang terbuka, jadi pintu dipindah ke kiri bawah. Bila keluar zona, geser ke kanan paling banyak 0.6 dan laporkan.
Pengurus 1 sampai 5: berdiri sejajar layar di titik(-1.4, 0), titik(-0.75, 0), titik(-0.1, 0), titik(0.55, 0), dan titik(1.2, 0), rotasi y Math.PI / 4. Daun kanan lemari yang terbuka menjangkau r -2.18 sampai -1.90 dan d sampai 0.21, sedangkan badan komisariat mulai di r 0.6 dan d 1.0; barisan ini berjarak dari keduanya. Jalur keluar setiap pengurus: posisinya, lalu pintuKeluar.userData.depan, lalu pintuKeluar.userData.belakang (titik dunia, ubah dari lokal bila perlu).
Lembar dokumen: sembilan lembar tersebar di sekitar S = titik(-0.6, 0.8), tiap lembar di S + titik(r, d) dengan r dari acak(33) antara -1.2 dan 1.2 dan d antara -0.6 dan 0.6, jarak antarpusat minimal 0.55. Rotasi y acak berbenih yang sama. Urutan bentuk: A, B, C, A, B, C, A, B, C. Lembar berbaring di y 0.01.
Tiga lembar yang tertiup: lembar ke-2, ke-4, dan ke-9 (satu dari setiap bentuk). Jalur tiup: posisinya, lalu posisi + titik(-1.0, -0.3, 0.8), lalu titik(-5.4, 0.4, 1.4) di luar layar kiri. lengkung: true.
Tujuan lembar ke lemari: d.titik.rakLemari[k] untuk k = 0, 0, 1, 1, 2, 2 (dua lembar per ruang rak), lembar kedua di ruang yang sama ditumpuk 0.03 lebih tinggi.
Gedung cabang: di titik(2.8, -1.8), tempat folder bawaan, rotasi 0.
Jalur aliran: [puncakLemari, atapKomisariat, puncakCabang], dengan puncakLemari = d.titik.lemari + y 1.4, atapKomisariat = komisariat.position + y 2.1, dan puncakCabang = cabang.position + y 2.6. lengkung: true.
Pengecualian zona: lembar yang tertiup tidak dihitung sejak mulai terbang (userData.penting = (t) => t < saatTerbang). pintuKeluar boleh terpotong sesudah 6.0 ((t) => t < 6.0). komisariat boleh terpotong selama 6.0 sampai 17.4.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: lemari, pintu keluar, dan komisariat muncul (muncul([...d.urutan, pintuKeluar, komisariat], { t: 0.6, selesai: 1.6 })). Lemari terlihat kosong dengan pintu terbuka. Komisariat abu penuh sejak awal.
1.6 sampai 2.4: lima pengurus muncul berurutan, masing-masing dengan ponsel dan tiga dokumen kecil melayang di atasnya (muncul, selesai: 2.4).
2.4 sampai 6.0: pengurus berjalan satu per satu ke pintu keluar dan hilang di baliknya. Mulai 2.4, 2.75, 3.1, 3.45, dan 3.8 (jeda 0.35), masing-masing jalan dengan durasi: 1.9, hadap: true, bunyi: { kuat: 0.25 }. Pengurus kelima tiba 5.7 dan selesai hilang tepat pada 6.0, jadi tidak ada yang tersisa saat gerak dibekukan. Saat tiba (j.selesai), pengurus hilang (durasi: 0.3) bersama ponsel dan dokumennya.
Semua pengurus sudah hilang sebelum 6.0. Lemari tetap kosong.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.4: sembilan lembar dokumen muncul berserakan di lantai (muncul, naik: 0, selesai: 7.4), semuanya abu.
7.8 sampai 10.8: tiga lembar tertiup satu per satu. Lembar ke-2 mulai 7.8, ke-4 mulai 8.6, ke-9 mulai 9.4. Masing-masing lintas di jalur tiupnya (durasi: 1.4, lengkung: true), lalu hilang 0.3 detik sebelum tiba di ujung jalur. Di titik awal setiap tiupan, debu kecil (jumlah: 6, sebar: 0.3, naik: 0.4, beku: false) selama 0.6 detik.
9.6 sampai 12.6: lemari kosong berdenyut (denyutCermin(d.benda.lemari, { mulai: 9.6, selesai: 12.6 })). Tepi setiap ruang rak yang kosong menyala.
10.8 sampai 13.0: adegan diam. Enam lembar abu tersisa di lantai.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 15.2: enam tag identitas menempel satu per satu di sudut setiap lembar yang tersisa (muncul, naik: 0, jeda 0.35, tag menjadi anak lembar, 0.02 di atas permukaannya). Saat tag menempel, abu lembar itu dilepas dari 1 ke 0 dalam 0.3 detik.
15.4 sampai 17.45: lembar yang sudah bertag masuk ke lemari satu per satu (busur, tinggi: 1.0, durasi: 0.7, jeda 0.27), ke tujuan rak di bagian F. Beri putar = -25° - rotasi acak lembar (dalam radian: -0.436 - r), supaya rotation.y akhir lembar = -25° dan lembar mendarat sejajar rak (lembar sudah memutar badannya 45° sendiri, sedangkan lemari berotasi 20°).
17.8 sampai 18.3: gedung cabang muncul di kanan atas (muncul, durasi: 0.5).
18.6 sampai 21.6: aliran zamrud naik dari puncak lemari, lewat atap komisariat, ke puncak gedung cabang (aliran({ jalur, mulai: 18.6, selesai: 19.6, laju: 5 })). Opsi mulai dan selesai adalah jendela pemancar: bola pertama tiba 20.6 dan bola terakhir tiba 21.6, sebelum 22.0.
21.2: klikEmas(d.benda.lemari). Bila bagian emas lemari kosong hampir tidak tampak, emaskan juga enam lembar di rak (klikEmas, jeda 0.05) dan laporkan.
21.2 sampai 22.0: abu komisariat dilepas dari 1 ke 0.
22.0 sampai 23.0: adegan diam.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (EVALUASI DAN ARSIP).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
4.3: pintu (kuat 0.3, durasi 0.9) di pintu keluar saat pengurus pertama masuk;
7.8, 8.6, dan 9.4: debu (kuat 0.4) di titik awal setiap tiupan (debu diberi bunyi: false);
15.4: laci-buka (kuat 0.4, durasi 0.5) saat lembar pertama masuk lemari.
Langkah pengurus dibisukan sebagian: bunyi: { kuat: 0.25 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata. Label CABANG dan KOMISARIAT tetap generik.
Tidak boleh ada angka di tag atau lembar dokumen. Nomor, tanggal, dan pembuat hanya disebut lewat label mikro, tanpa isi nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-33 --periksa, lalu lihat hasil/gambar/indikator-33/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: lemari kosong terbuka, satu pengurus sedang berjalan ke pintu keluar dengan ponsel dan dokumennya;
5.5: hanya satu pengurus yang tersisa dan sedang masuk pintu;
10.2: kamera dekat ke lemari, lembar abu berserakan, satu lembar sedang tertiup, lemari berdenyut, kalimat sebab terbaca;
14.5: sebagian lembar sudah bertag dan berwarna terang, label NOMOR · TANGGAL · PEMBUAT tampak, kalimat ikhtiar pertama terbaca;
18.6: semua lembar sudah di rak lemari, gedung cabang tampak;
22.3: aliran sudah sampai ke cabang, lemari emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-33. Hasilnya hasil/video/indikator-33.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, letak pintu keluar, bagian lemari yang menjadi emas), lalu hasil zona, warna, LUFS, dan sinkron.
