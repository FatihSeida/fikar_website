Prompt Animasi Indikator 15 dari 44
Judul indikator: Gagasan dan karya HMI belum cukup menjawab persoalan masyarakat.
Kelompok Pengetahuan. Mode Ikhtiar. Program terkait 09 Ruang Karya Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-15/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-15 --format evidence --judul "Gagasan dan karya HMI belum cukup menjawab persoalan masyarakat.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-15/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: kelima rumah warga dan komisariat abu penuh. Menara kampus memakai warna bawaannya. Figur di atap dan dua warga berwarna pion. Balon gagasan berwarna kertas redup bawaan.
Bagian 2: panah lingkar, balon gagasan, dan balon tanya warga berwarna abu (W.abu atau setelKeadaan(..., "abu", 1)). Satu titik masalah: genangan berdenyut zamrud. Tidak ada emas.
Bagian 3: kartu data dan garis telusur berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: lembar karya yang dikirim ke rumah warga. Komisariat melepas abu saat lembar karya lahir. Rumah warga yang menerima melepas abu dan jendelanya menyala zamrud.
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
fokus: titik(0, 0.6, 1.2);
gejala: { muat: [menara, figurAtas[2], komisariat, rumahWarga[2], rumahWarga[3]] } (H akan naik sekitar 15);
sebab: { muat: [panahLingkar, genangan, warga[0], warga[1], titikJatuh], H: 8 };
ikhtiar: { muat: [komisariat, genangan, rumahWarga[0], rumahWarga[1], rumahWarga[4], tujuanFigur], H: 11 };
tidak ada kunci tambahan.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
menaraKampus({ lebar: 1.6, tinggi: 3.6, dalam: 1.6 }): menara kampus, tempat diskusi. Ukuran bawaan 2.0 x 5.0 x 2.0 diperkecil supaya menara dan permukiman muat bersama di zona adegan. menara.userData.atap = tinggi atap.
pion({ skala: 0.8 }) x 3: figur di atap menara, bernama figur atas 1 sampai figur atas 3.
rumahWarga() x 5: permukiman, 0.9 x 0.7 x 0.9 dengan atap prisma dan satu jendela di muka +x.
genangan({ radius: 0.7, benih: 4 }): persoalan warga.
pion() x 2: warga di tepi genangan.
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7.
balonKata({ isi: "titik", skala: 0.45 }) x 3: balon gagasan Bagian 1.
panahGaris({ titik: [...], lengkung: true, warna: W.abu }): panah lingkar tertutup di atas menara.
balonKata({ isi: "titik", skala: 0.4 }) x 2: balon gagasan yang berputar di Bagian 2.
balonKata({ isi: "tanya", skala: 0.4 }) x 2: persoalan warga yang tidak sampai.
pion({ nama: "figur lapangan" }): satu kader yang turun ke lapangan.
kartuKecil({ simbol: "garis", warnaSimbol: W.zamrud, rebah: false, miring: 0, skala: 0.5 }) x 3: kartu data lapangan.
lembarKertas({ rebah: false, lebar: 0.8, panjang: 1.0, garis: 4 }): lembar karya.
garisPutus({ titik: [...], lengkung: true, warna: W.zamrudPijar, lebar: 3 }): garis telusur dari rumah warga kembali ke komisariat.
Benda lokal:
jendelaLampu(): kotakBulat(0.02, 0.18, 0.2) dengan warna dasar W.abuGelap, dipasang sebagai anak rumah warga 1 pada (0.49, 0.406, 0) lokal, yaitu 0.01 di depan jendela bawaan muka +x. Ukuran dan tinggi pusatnya sama dengan jendela bawaan rumahWarga. Penyetel userData.aturNyala(k) menggeser warnanya dari W.abuGelap ke W.zamrudPijar tanpa emissive, sehingga tetap di bawah ambang bloom. userData.penting = false.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "15", kategori: "PENGETAHUAN", judul: "Gagasan dan karya HMI belum cukup menjawab persoalan masyarakat.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Gagasan lahir di ruang diskusi **tanpa turun ke lapangan**, jadi persoalan warga tidak pernah masuk ke dalamnya."
ikhtiar:
{ teks: "**Ruang Karya Kader** mendorong karya yang berangkat dari data lapangan dan persoalan warga.", masuk: [13.6, 14.1], keluar: [17.4, 17.8] }
{ teks: "Karya itu diterbitkan dan ditindaklanjuti, sehingga dampaknya bisa ditelusuri.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 09".
kuis: { pertanyaan: "Pernahkah komisariatmu mengkaji persoalan nyata di sekitar kampus, lalu menuliskan usulan solusinya?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“KAMPUS” pada menara, geser [0, menara.userData.atap + 1.3, 0], gaya benda, masuk 1.0 sampai 1.5, keluar 6.0 sampai 6.3.
“WARGA” pada rumah warga 2, geser [0, 1.3, 0], gaya benda, masuk 2.6 sampai 3.1, keluar 6.0 sampai 6.3.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar kit. Prompt lama menaruh menara 5 unit di titik(-2.4, -3.0) dan permukiman di titik(1.0, 1.0) sampai titik(3.6, 3.4). Dengan kamera kit, susunan itu butuh H sekitar 20, jadi menara diperkecil dan semua benda dipadatkan seperti di bawah. Arah susunannya tetap: kampus di kiri atas, permukiman di kanan bawah.
Benda dan posisinya:
Menara kampus: titik(-2.0, -1.0). Pintunya di muka +z. depanPintuMenara = menara.localToWorld(menara.userData.depanPintu.clone()).
Figur atas: di menara.position + titik(-0.35, -0.15, atap), + titik(0.35, -0.15, atap), dan + titik(0, 0.3, atap), dengan atap = menara.userData.atap. Rotasi y 45 derajat (menghadap kamera).
Rumah warga 1 sampai 5: titik(0.4, 0.7), titik(1.8, 0.0), titik(3.0, 0.8), titik(2.8, 2.3), titik(1.0, 2.6). Rotasi 0, sejajar sumbu dunia.
Genangan: titik(1.7, 1.4), di tengah permukiman.
Warga 1 dan 2: titik(1.0, 1.6) dan titik(2.45, 1.45), di tepi genangan, rotasi y 45 derajat.
Komisariat: titik(-2.0, 2.0). Pintu di muka +z. depanPintuKom = komisariat.position + titik(-0.88, 0.88) (1.25 unit ke arah +z dari pusat).
Balon gagasan Bagian 1: ujung ekor di figur atas + y 0.95, naik ke + titik(-0.4, -0.4, 1.0) dari titik itu.
Panah lingkar: R = menara.position dengan y atap + 1.5. Titik: [R + titik(-0.7, 0), R + titik(0, -0.45, 0.25), R + titik(0.7, 0), R + titik(0, 0.45, -0.25), R + titik(-0.7, 0)].
Balon gagasan Bagian 2: berjalan di titik panah lingkar. Balon A mulai di titik pertama, balon B mulai di titik ketiga.
Balon tanya: ujung ekor di atas kepala warga (y 1.15). titikJatuh = titik(-0.6, -0.1), tanah kosong di antara permukiman dan menara.
Figur lapangan: jalur pergi [depanPintuKom, titik(-2.2, 3.55), titik(-0.6, 3.3), tujuanFigur], tujuanFigur = titik(0.6, 1.75). Ruas pertama sejajar muka pintu komisariat supaya figur tidak menembus sudut depan rumah. Jalur pulang adalah jalur yang sama dibalik.
Kartu data: muncul di titik(1.7, 1.4, 0.9) (atas genangan), titik(1.0, 1.6, 1.3) (atas warga 1), titik(2.45, 1.45, 1.3) (atas warga 2). Kartu ke-k menumpuk di atas kepala figur pada y 1.3 + 0.06k.
Lembar karya: lahir di depanPintuKom + y 1.4, lalu mendarat berdiri di titik(-0.15, 1.25, 0), yaitu 0.75 unit di depan pintu rumah warga 1.
Garis telusur: titik [titik(-0.15, 1.25, 0.08), titik(-0.6, 3.3, 0.08), titik(-2.2, 3.55, 0.08), depanPintuKom dengan y 0.08].
Pengecualian zona:
Balon gagasan Bagian 1: userData.penting = false (sengaja naik menjauh dan menghilang).
Menara dan figur atas: userData.penting = (t) => t < 13.0.
Panah lingkar dan balon gagasan Bagian 2: userData.penting = (t) => t < 13.2.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: prompt seri versi pertama (format 21 detik) bagian F dan G Bagian 1, dipindah ke posisi kit di bagian F.
0.6 sampai 1.6: menara kampus naik dari tanah (tumbuh(menara, { t: 0.6, durasi: 1.0, sumbu: "y" })).
1.6 sampai 2.24: tiga figur atas muncul di atap (jeda 0.12, durasi 0.4).
2.0 sampai 3.0: kelima rumah warga, genangan, dan komisariat muncul (muncul([...rumahWarga, genangan, komisariat], { t: 2.0, selesai: 3.0 })). Rumah warga dan komisariat abu penuh sejak awal.
3.0 sampai 3.7: dua warga muncul di tepi genangan (jeda 0.2).
3.6 sampai 6.2: tiga balon gagasan dari figur atas 1, 2, 3 pada t 3.6, 4.2, 4.8. Setiap balon muncul di atas kepala (durasi 0.3), lintas naik menjauh dari permukiman (mulai t + 0.3, durasi 0.8), lalu hilang pada t + 1.1. Lintas terakhir selesai 5.9, sebelum beku.
Permukiman tetap abu dan tidak tersentuh.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: panah lingkar abu tergambar di atas menara (aturTampak 0 ke 1).
7.0 sampai 11.8: genangan berdenyut (denyutCermin(genangan, { mulai: 7.0, selesai: 11.8 })).
7.2 sampai 12.0: dua balon gagasan berputar mengikuti panah lingkar, dua putaran, dan tidak pernah turun. Balon A muncul 7.2, lintas di titik lingkar dua putaran (mulai 7.4, durasi 4.4, lengkung: true). Balon B muncul 7.4 di titik ketiga, lintas dua putaran mulai dari situ (mulai 7.6, durasi 4.4). Keduanya diam di ujung jalurnya sampai 13.2.
8.0 sampai 9.5: balon tanya dari warga 1 muncul 8.0, lalu busur ke titikJatuh (mulai 8.2, tinggi 1.4, durasi 1.0) dan hilang saat mendarat (9.2, durasi 0.3). Persoalan warga jatuh sebelum sampai menara.
9.6 sampai 11.1: balon tanya dari warga 2 dengan pola yang sama (muncul 9.6, busur 9.8 sampai 10.8, hilang 10.8).
11.1 sampai 13.0: adegan diam. Panah lingkar tetap tampak.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.6: panah lingkar dan kedua balon gagasan hilang.
13.6 sampai 15.4: figur lapangan muncul di depanPintuKom pada 13.6 (durasi 0.2, naik: 0), lalu jalan di jalur pergi (durasi: 1.8, lengkung: true, hadap: true). Tiba di tujuanFigur 15.4.
15.4 sampai 16.6: tiga kartu data muncul di atas genangan, warga 1, dan warga 2 (t 15.4, 15.6, 15.8, durasi 0.3), lalu masing-masing lintas ke atas kepala figur (mulai t + 0.3, durasi 0.5). Kartu terakhir tiba 16.6.
16.6 sampai 18.4: figur jalan pulang di jalur yang sama dibalik (durasi: 1.8). Ketiga kartu lintas di jalur yang sama dengan y 1.3 + 0.06k dan durasi yang sama, sehingga terbawa di atas kepala figur. Kalimat ikhtiar pertama keluar 17.4 sampai 17.8.
18.4: figur hilang di pintu komisariat (durasi 0.3, turun: 0). Kartu data 1 berubah menjadi lembar karya (gantiBenda(kartuData[0], lembar, { t: 18.4, durasi: 0.4, tempat: false })), kartu 2 dan 3 hilang bersamaan.
18.4 sampai 19.2: abu komisariat dilepas dari 1 ke 0.
19.0 sampai 20.2: lembar karya busur ke depan pintu rumah warga 1 (tinggi 1.4, durasi 1.2).
20.4: lembar karya klikEmas.
20.6 sampai 21.2: rumah warga 1 melepas abu (1 ke 0) dan jendelanya menyala (jendela.userData.aturNyala 0 ke 1).
21.2 sampai 22.4: garis telusur tergambar dari lembar karya kembali ke pintu komisariat (aturTampak 0 ke 1). Dampaknya bisa ditelusuri.
Genangan tidak mengecil dan rumah warga lain tidak berubah. Jangan menggambarkan persoalan yang langsung selesai.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (PENGETAHUAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
3.6, 4.2, 4.8: balon (kuat 0.35) di setiap balon gagasan Bagian 1;
13.2: garis-putus di menara saat panah lingkar putus;
20.6: menyala (kuat 0.5) di rumah warga 1 saat jendelanya menyala;
21.2: garis-sambung (durasi 1.2) saat garis telusur tergambar.
Langkah figur lapangan diredam: bunyi: { kuat: 0.4 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata. Label “KAMPUS” dan “WARGA” tetap umum, tanpa nama tempat.
Tidak boleh ada angka di kartu data atau lembar karya. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML. Isi balon hanya titik atau tanda tanya, tanpa keluhan yang terbaca.
Tidak boleh ada rombongan figur atau warga yang berbondong ke komisariat sesudah karya terbit. Hanya satu figur lapangan yang bergerak.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-15 --periksa, lalu lihat hasil/gambar/indikator-15/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.5,9.3,14.5,18.7,21.5 bila titik bawaan tidak pas):
3: menara berdiri dengan tiga figur di atap, permukiman abu dan genangan baru muncul, komisariat abu;
5.5: balon gagasan ketiga naik menjauh dari permukiman, dua warga di tepi genangan;
9.3: panah lingkar abu di atas menara, dua balon gagasan berputar, balon tanya pertama baru jatuh di tanah kosong, genangan berdenyut, kalimat sebab terbaca;
14.5: figur lapangan sedang berjalan dari komisariat menuju genangan, kalimat ikhtiar pertama terbaca;
18.7: figur sudah masuk pintu, lembar karya muncul di depan pintu komisariat, komisariat mulai melepas abu, kalimat ikhtiar kedua terbaca;
21.5: lembar emas berdiri di depan rumah warga 1, jendela rumah itu menyala zamrud, garis telusur mulai tergambar, baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-15. Hasilnya hasil/video/indikator-15.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, nama opsi ukuran menaraKampus, benda lokal), lalu hasil zona, warna, LUFS, dan sinkron.
