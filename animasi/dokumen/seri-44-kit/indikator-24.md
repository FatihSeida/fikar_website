Prompt Animasi Indikator 24 dari 44
Judul indikator: Program mudah dibuat, tetapi agenda pelaksanaannya lemah.
Kelompok Target Program. Mode Ikhtiar. Program terkait 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-24/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-24 --format evidence --judul "Program mudah dibuat, tetapi agenda pelaksanaannya lemah.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-24/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Sumbu dunia +z sama dengan titik(-0.707, 0.707).
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh (setelKeadaan(komisariat, "abu", 1)). Keenam kartu program berwarna kertas saat di meja, lalu abu penuh begitu tiba di tumpukan.
Bagian 2: kartu yang berangkat, jejaknya, dan tanda tanya berwarna abu. Kartu yang macet boleh berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: tag jadwal dan penanggung jawab, kartu langkah bercentang, dan figur pengurus berwarna normal atau zamrud (proses). Kartu langkah di titik macet tetap abu sampai ditolong. Emas hanya untuk satu rantai hasil: kartu program yang tiba di ujung lintasan beserta kedua tagnya. Komisariat melepas abu sesudah kartu itu menjadi emas.
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
gejala: { muat: [d.benda.papan, d.benda.meja, d.benda.lintasan, d.benda.bendera, komisariat] } (perkiraan H sekitar 15);
sebab: { muat: [titikTumpukan, puncakTumpukan, d.titik.ubin[0], titikMacet], H: 9 }, dengan puncakTumpukan = titikTumpukan + titik(0.3, -0.5, 0.6). Jangan memasukkan benda kartu ke muat Bagian 2, karena posisi dasarnya masih di meja;
ikhtiar: { muat: [d.titik.ubin[0], titikMacet, d.titik.ubin[3]], H: 11 };
tambahan: [{ t: [17.6, 18.6], muat: [d.benda.lintasan, d.benda.bendera, komisariat, depanPintuKom], H: 11 }] (seluruh lintasan penting lagi mulai 18.6, jadi H naik otomatis sekitar 13.84).
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikTumpukan, titikMacet, dan depanPintuKom dijelaskan di bagian F.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6, atap 0.7.
kartuProker({ garis: 3, kaki: false, skala: 0.45 }) x 5: kartu program kartu1 sampai kartu5, sekitar 0.45 x 0.56, tegak menghadap kamera.
kartuProker({ garis: 3, kaki: false, skala: 0.45, tag: ["TGL", "PJ"] }): kartu6, ukuran dan arah sama. Tag ada di userData.bagian.tag[0] (TGL) dan [1] (PJ). Kedua tag tidak tampak sebelum Bagian 3 karena gerak pertamanya adalah muncul pada 13.6.
palu({ alas: false }): palu di atas meja. userData.bagian.ayun berporos di ujung gagang.
garisPutus({ titik: [...], warna: W.abu, lebar: 3 }): jejak abu kartu yang berangkat, y 0.08.
tandaTanya({ ukuran: 0.3, hadapKamera: true }): tanda tanya di atas kartu yang macet.
kartuKecil({ simbol: "centang", skala: 0.6 }) x 7: kartu langkah berbaring di atas ubin (rebah bawaan, muka ke atas), simbol centang zamrud. Satu untuk setiap ubin.
kartuKecil({ simbol: null, skala: 0.6 }): kartu langkah kosong di ubin ketiga (titik macet), disetel abu penuh.
pion(): satu pengurus yang datang menolong.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "24", kategori: "TARGET PROGRAM", judul: "Program mudah dibuat, tetapi agenda pelaksanaannya lemah.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Tidak ada yang tahu program **macet di langkah mana**, karena jejak pelaksanaannya tidak dicatat."
ikhtiar:
{ teks: "**Arsip dan Memori Organisasi** memberi setiap program jejak jadwal, penanggung jawab, dan realisasi.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Langkah yang tersendat terlihat sejak awal, sehingga bisa ditolong sebelum periode habis.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 10".
kuis: { pertanyaan: "Dari program yang direncanakan di awal periode, berapa yang benar-benar terlaksana?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label tag “TGL” dan “PJ” adalah label bawaan tag kartuProker, ikut tampak bersama tagnya.
Label “TERSENDAT” di atas kartu yang macet: label3D("TERSENDAT", { pada: kartu6, geser: [0, 0.85, 0], gaya: "kotak", kelas: "abu", skala: 0.65 }), masuk 18.0 sampai 18.4, keluar 20.0 sampai 20.3.
F. Dunia dan Posisi
Dunia dasar duniaRencana(v) tanpa penyesuaian (resep 24 di docs dunia). Benda: papan di titik(-1.6, -2.6), meja (mejaKotak 2.4 x 0.8 x 1.2, sejajar sumbu dunia) di titik(-1.3, -0.5), lintasan tujuh ubin dari titik(-2.8, 2.6) ke titik(3.0, -0.3), bendera di titik(3.5, -0.7).
Titik dunia yang dipakai: d.titik.meja, d.titik.ubin[0] sampai d.titik.ubin[6], d.titik.bendera.
Dunia ini tidak punya komisariat. Tambahkan komisariat = v.tambah(rumah()) di titik(2.2, 2.2), di kanan bawah lintasan, tidak menyentuh ubin. Pintunya di muka +z (kiri bawah layar). Titik bantu: depanPintuKom = posisi komisariat + titik(-0.88, 0.88).
Benda tambahan dan posisinya:
Kartu di meja (y = d.titik.meja.y, permukaan meja): kartu1 sampai kartu6 di d.titik.meja + titik(-0.63, -0.21), titik(-0.21, -0.63), titik(-0.21, 0.21), titik(0.21, -0.21), titik(0.21, 0.63), dan titik(0.63, 0.21).
Palu: d.titik.meja + titik(0.78, 0.78), y permukaan meja, diputar y 45 derajat.
titikTumpukan = titik(-3.2, 1.2), di tanah kiri bawah meja, bebas dari lintasan. Kartu ke-k (k = 1 sampai 6) di tumpukan berada di titikTumpukan + (k − 1) x titik(0.06, -0.1), sehingga kartu berikutnya berdiri sedikit di belakang dan terlihat menyembul. kartu6 paling belakang.
titikMacet = d.titik.ubin[2] + titik(0, -0.2), y permukaan ubin. Kartu program berdiri di belakang tengah ubin supaya kartu langkah di depannya tetap terlihat.
Jejak abu: garis dari d.titik.ubin[0] lewat d.titik.ubin[1] ke d.titik.ubin[2], masing-masing + titik(0, -0.2), y 0.08.
Tanda tanya: titikMacet + y 0.95.
Kartu langkah ke-i: berbaring di d.titik.ubin[i] + titik(0, 0.12), y permukaan ubin + 0.01.
Pengurus: muncul di depanPintuKom, berjalan ke berdiriPengurus = d.titik.ubin[2] + titik(0.34, 0.67) (0.75 unit di samping lintasan, sisi bawah layar), lalu menghadap kartu.
Jalur kartu ke ujung: d.titik.ubin[2] sampai d.titik.ubin[6], masing-masing + titik(0, -0.2).
Pengecualian zona: papan dan meja boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). komisariat boleh terpotong 6.0 sampai 13.0 ((t) => t < 6.0 || t >= 13.0). lintasan dan bendera boleh terpotong 6.0 sampai 18.6 ((t) => t < 6.0 || t >= 18.6). kartu1 sampai kartu5 boleh terpotong sesudah 13.0 ((t) => t < 13.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: semua benda dunia, palu, dan komisariat muncul (muncul([...d.urutan, palu, komisariat], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.6 sampai 3.6: enam kartu muncul di meja satu per satu, urut kartu1 sampai kartu6, pada 1.6, 2.0, 2.4, 2.8, 3.2, dan 3.6 (muncul, durasi 0.3, naik 0.2). Tag kartu belum tampak.
Setiap kartu yang muncul diiringi ketukan palu: di v.setiapFrame, palu.userData.bagian.ayun.rotation.z = −0.6 x k, dengan k naik 0 ke 1 selama 0.12 detik sebelum kartu muncul lalu turun 1 ke 0 selama 0.13 detik sesudahnya. Di luar ketukan k = 0. Hitung k dari t saja.
4.0 sampai 6.0: keenam kartu meluncur dari meja ke tumpukan (lintas, durasi 0.6, jeda 0.28, beku: false), urut kartu1 sampai kartu6, ke posisi tumpukan masing-masing di bagian F. Jalur tiga titik: posisi meja, titik tengah + y 0.9, posisi tumpukan.
Setiap kartu menjadi abu penuh dalam 0.3 detik sesudah tiba (setelKeadaan(kartu, "abu", ...) di v.setiapFrame). Lintasan kosong. Bendera diam.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.4: kartu6 (paling belakang di tumpukan) melompat ke awal lintasan (busur, dari posisi tumpukannya ke d.titik.ubin[0] + titik(0, -0.2), tinggi 0.8, durasi 0.8). Kartu tetap abu.
7.4 sampai 9.0: kartu6 meluncur di lintasan ke titikMacet (lintas, durasi 1.6, kurva bawaan sehingga melambat di ujung). Jejak abu tergambar di belakangnya (garis.userData.aturTampak 0 ke 1, 7.4 sampai 9.0).
9.0: kartu berhenti di ubin ketiga tanpa sebab yang terlihat.
9.2 sampai 9.6: tanda tanya abu muncul di atas kartu (muncul).
9.6 sampai 11.0: jejak abu memudar ke opacity 0 (aturOpasitas), seolah perjalanan kartu tidak pernah dicatat.
9.6 sampai 12.6: denyutCermin(kartu6, { mulai: 9.6, selesai: 12.6 }). Ini satu-satunya titik masalah.
12.6 sampai 13.0: adegan diam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.4: tanda tanya hilang.
13.4 sampai 13.8: abu kartu6 dilepas dari 1 ke 0.
13.6 sampai 14.2: kedua tag kartu6 muncul berurutan, TGL lalu PJ (muncul(kartu6.userData.bagian.tag, { t: 13.6, jeda: 0.25, naik: 0 })).
14.4 sampai 15.4: kartu langkah bercentang di ubin pertama dan kedua muncul berbaring (muncul, jeda 0.3, naik 0), lalu kartu langkah kosong abu di ubin ketiga muncul pada 15.1. Ini jejak realisasi: dua langkah selesai, langkah ketiga belum.
15.4 sampai 17.6: adegan diam, kalimat ikhtiar pertama terbaca.
17.4 sampai 17.8: pengurus muncul di depanPintuKom (muncul, naik 0).
18.0 sampai 18.4: label “TERSENDAT” masuk di atas kartu6.
18.2 sampai 19.8: pengurus berjalan dari depanPintuKom ke berdiriPengurus (jalan, durasi: 1.6, hadap: true), lalu berhenti menghadap kartu.
20.0 sampai 20.4: kartu langkah abu di ubin ketiga berubah menjadi kartu langkah bercentang (gantiBenda, tempat: true). Label “TERSENDAT” keluar 20.0 sampai 20.3.
20.4 sampai 21.8: kartu6 meluncur dari ubin ketiga ke ubin ketujuh (lintas, durasi 1.4, jalur di bagian F). Kartu langkah bercentang di ubin keempat sampai ketujuh muncul tepat sebelum kartu lewat, pada 20.65, 21.0, 21.35, dan 21.7 (muncul, durasi 0.3, naik 0).
21.9: klikEmas([kartu6, ...kartu6.userData.bagian.tag]). Kartu dan kedua tagnya menjadi emas di ujung lintasan, di samping bendera.
22.0 sampai 22.6: abu komisariat dilepas dari 1 ke 0.
Pengurus tetap berdiri di samping lintasan. Hanya satu figur. Jangan menampilkan rombongan figur atau kartu lain yang ikut melaju.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TARGET PROGRAM).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.6, 2.0, 2.4, 2.8, 3.2, dan 3.6: kayu (kuat 0.5, posisi palu) pada setiap ketukan palu;
9.0: garis-putus pelan (kuat 0.4, posisi kartu6) saat kartu berhenti di tengah lintasan;
9.6: gemuruh pelan (kuat 0.3, durasi 1.4) saat jejak memudar;
20.0: centang (posisi kartu langkah ubin ketiga) saat titik macet tertolong.
Langkah pengurus dibisukan sebagian: bunyi: { kuat: 0.3 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia. Bendera di ujung lintasan adalah bendera polos kit tanpa lambang.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka, tanggal, atau nominal di kartu dan tag. Label tag hanya “TGL” dan “PJ”.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh menampilkan rombongan figur atau semua kartu sekaligus melaju sesudah ikhtiar. Itu klaim hasil.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-24 --periksa, lalu lihat hasil/gambar/indikator-24/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3.2: empat kartu sudah di meja, palu sedang mengetuk (kartu kelima baru muncul);
5.5: sebagian besar kartu sudah menumpuk abu di kiri bawah meja, lintasan kosong;
9.5: kamera dekat, satu kartu abu berhenti di ubin ketiga dengan tanda tanya, jejak abu masih tampak dan mulai memudar, kalimat sebab terbaca;
14.5: kartu macet sudah bertag TGL dan PJ, kartu langkah pertama mulai muncul, kalimat ikhtiar pertama terbaca;
20.7: kartu langkah ubin ketiga sudah bercentang, pengurus berdiri di samping lintasan, kartu program mulai melaju;
22.3: kartu program emas di ujung lintasan, komisariat mulai lepas abu, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-24. Hasilnya hasil/video/indikator-24.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal), lalu hasil zona, warna, LUFS, dan sinkron.
