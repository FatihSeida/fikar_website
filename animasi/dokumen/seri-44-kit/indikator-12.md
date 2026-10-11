Prompt Animasi Indikator 12 dari 44
Judul indikator: Dies Natalis tidak lagi semarak dengan kegiatan ilmiah, sosial, seni, dan karya.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 09 Ruang Karya Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-12-v2/. Folder lama animasi/proyek/indikator-12/ jangan diubah. Folder itu boleh dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-12-v2 --format evidence --judul "Dies Natalis tidak lagi semarak dengan kegiatan ilmiah, sosial, seni, dan karya.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-12-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: panggung abu penuh (setelKeadaan(pentas, "abu", 1)), pita dan kue berwarna abu lewat opsi warnanya. Komisariat abu penuh. Penonton berwarna pion.
Bagian 2: empat petak garis putus, jam pasir, dan kartu yang dibawa tergesa berwarna abu. Satu titik masalah: keempat petak kosong berdenyut zamrud sebagai satu kelompok. Tidak ada emas.
Bagian 3: garis waktu, penanda bulan, rak karya, dan kartu karya berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: keempat stan pajangan yang terisi di akhir Bagian 3. Panggung melepas abu sesudah stan menjadi emas.
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
fokus: titik(0, 0.4, 0.4);
gejala: { muat: [pentas, komisariat, penonton[3], penonton[7]] };
sebab: { muat: [petak[0], petak[3], jamPasir, tujuanTergesa], H: 8 };
ikhtiar: { muat: [pentas, garisBulan, rak, komisariat], H: 11 };
tidak ada kunci tambahan.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Figur tergesa dibaca di titik awalnya di luar layar, jadi tujuannya ditulis sebagai Vector3.
D. Benda yang Dipakai
Dari kit:
panggung({ lebar: 6.2, dalam: 3.2, warna: W.abuGelap, tangga: false }): panggung peringatan, rotasi y 45 derajat (sejajar layar). yPentas = pentas.userData.atas.
pita({ jarak: 4.8, tinggi: 1.25, warna: W.abu, warnaTiang: W.abuGelap }): dekor pita, rotasi y 45 derajat.
kue({ warna: W.abu, warnaHias: W.abuGelap, lilin: false }): kue peringatan.
pion({ tangan: true, warna: W.pion, skala: 0.85 }) x 8: penonton, bernama penonton 1 sampai penonton 8.
rumah({ lebar: 1.4, tinggi: 1.0, dalam: 1.2, atap: 0.55 }): komisariat. Ukurannya diperkecil supaya muat di sudut kiri depan tanpa menyentuh penonton.
garisPutus({ titik: [...], warna: W.abu, lebar: 3 }) x 4: petak stan yang kosong, berupa persegi panjang tegak 1.05 x 1.5 yang menghadap kamera.
jamPasir({ skala: 1.5 }): tanda waktu yang habis. Penyetel: bagian.pasirAtas.scale.y = k, bagian.pasirBawah.scale.y = 1 − k, bagian.aliran.visible.
pion({ skala: 0.85, nama: "figur tergesa" }): satu figur yang datang di menit terakhir.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.6 }): kartu yang dibawa tergesa.
garisWaktu({ panjang: 6.0, jarak: 0.5, label: false, panah: true, sejajarLayar: true }): garis waktu dua belas penanda bulan, tanpa label. bagian.penanda[0..11].
rakKecil({ lebar: 1.2, tinggi: 1.2, dalam: 0.4, rak: 2 }): rak karya, rotasi y 45 derajat supaya muka rak menghadap kamera.
kartuKecil({ simbol: "garis", warnaSimbol: W.zamrud, rebah: false, miring: 0, skala: 0.4 }) x 12: kartu karya bulanan.
stanPajangan({ isi: "kertas" }), stanPajangan({ isi: "grafik" }), stanPajangan({ isi: "figur" }), stanPajangan({ isi: "bingkai" }): empat stan pajangan yang terisi, rotasi 0 (sudah menghadap kamera).
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "12", kategori: "KADERISASI", judul: "Dies Natalis tidak lagi semarak dengan kegiatan ilmiah, sosial, seni, dan karya.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Karya baru dicari **menjelang peringatan**, jadi panggungnya ada tetapi isinya kosong."
ikhtiar:
{ teks: "**Ruang Karya Kader** mengumpulkan karya kader sepanjang tahun, lengkap dengan catatannya.", masuk: [13.6, 14.1], keluar: [18.4, 18.8] }
{ teks: "Saat peringatan tiba, isinya sudah tersedia untuk dipamerkan.", masuk: [19.0, 19.5], keluar: [22.6, 23.0] }
program: "Program 09".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“TULISAN”, “RISET”, “SOSIAL”, “SENI” di atas stan 1 sampai 4, geser [0, 1.6, 0], gaya mikro, ukuran ikut kamera (skala: () => 16 / v.rig.keadaan.H). Masuk bersama stannya, keluar 22.6 sampai 23.0.
Judul format sudah tiga baris, jadi jangan menambah label di sekitar kepala.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar kit. Tata letaknya sama dengan animasi/proyek/indikator-12/adegan.js, ditambah satu komisariat.
Benda dan posisinya:
Panggung: titik(0, -0.5). Lantai atas di yPentas.
Pita: titik(0, -1.4, yPentas). Kue: titik(0, 0.35, yPentas).
Penonton i (i = 0 sampai 7): titik(-2.1 + (i % 4) × 1.4 + (i ≥ 4 ? 0.15 : 0), 2.2 + floor(i / 4) × 1.1), rotasi y 1.25π (menghadap panggung).
Komisariat: titik(-3.2, 2.9). Pintu di muka +z.
Petak i (i = 0 sampai 3): pusat alas C = titik(rStan[i], -0.9, yPentas) dengan rStan = [-2.1, -0.7, 0.7, 2.1]. Titik garis: [C + titik(-0.525, 0, 0), C + titik(0.525, 0, 0), C + titik(0.525, 0, 1.5), C + titik(-0.525, 0, 1.5), C + titik(-0.525, 0, 0)]. Bidangnya sejajar layar, jadi menghadap kamera tanpa rotasi.
Jam pasir: titik(1.4, 0.5, yPentas).
Figur tergesa: mulai di titik(4.3, 1.4), di luar layar kanan. tujuanTergesa = titik(2.1, 1.5), di depan tepi panggung di bawah petak 4.
Kartu tergesa: ikut figur di y 0.55 (di depan dada), lalu mendarat berdiri di titik(2.1, -0.9, yPentas).
Garis waktu: pusat pita di titik(0.3, 1.65), di antara tepi depan panggung (d 1.1) dan baris depan penonton (d 2.2). Bila titik asal grup ternyata di ujung kiri pita, geser grup supaya pusat pita tetap di titik itu. penanda[i] = garisBulan.localToWorld(garisBulan.userData.titikPeriode(i)).
Rak karya: titik(2.4, 0.45, yPentas), rotasi y 45 derajat, di atas panggung di kanan kue.
Kartu karya k (k = 0 sampai 11): muncul di penanda[k] + y 0.75. Tujuan: lantai rak rak.userData.titikRak(floor(k / 6)) digeser titik(-0.5 + 0.2 × (k % 6), 0). Ubah ke titik dunia dengan rak.localToWorld bila titik itu lokal.
Stan i: di pusat petak i, titik(rStan[i], -0.9, yPentas).
Pengecualian zona:
Penonton, komisariat, dan pita: userData.penting = (t) => !(t > 6.0 && t < 13.0).
Figur tergesa dan kartunya: userData.penting = (t) => t >= 10.6 (masuk dari luar layar kanan; diperiksa sesudah masuk).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-12/adegan.js. Dunia, benda, posisi, dan waktunya sama persis. Komisariat ditambahkan ke urutan muncul.
0.6 sampai 2.0: panggung, pita, kue, delapan penonton, dan komisariat muncul (muncul([pentas, dekor, kue, ...penonton, komisariat], { t: 0.6, selesai: 2.0 })). Panggung dan komisariat abu penuh.
2.0 sampai 3.0: penonton bertepuk. Di v.setiapFrame: lengan rotation.x = -1.1 dan rotation.z = ±(0.8 + 0.15 × tepuk), dengan tepuk = sin((t − 2) × 8π + 0.15i). Badan memantul |tepuk| × 0.035 unit. Di luar jendela itu lengan turun (rotation.z = ±0.14, rotation.x = 0).
2.0 sampai 12.4: pita berayun pelan, rotation.x pita dan simpulnya 0.025 × sin(2.4 × τ) dengan τ = waktuBeku(6, 6.6)(t), sehingga ayunan ikut beku 6.0 sampai 6.6.
3.0 sampai 6.0: diam. Panggung abu tanpa isi, hanya pita dan kue.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: keempat petak garis putus tergambar di tempat stan (aturTampak 0 ke 1, jeda 0.1).
6.8 sampai 7.2: jam pasir muncul.
7.0 sampai 11.8: keempat petak berdenyut sebagai satu kelompok (denyutCermin(petak, { mulai: 7.0, selesai: 11.8 })).
7.2 sampai 10.4: pasir atas habis: k dari 1 ke 0.05 (halus(rentang(t, 7.2, 10.4))), aliran.visible hanya selama 7.2 sampai 10.4.
10.0 sampai 11.0: figur tergesa muncul di titik(4.3, 1.4) pada 10.0 (durasi 0.2, naik: 0), lalu jalan ke tujuanTergesa (durasi: 1.0, frek: 6, hadap: true). Kartu tergesa lintas di jalur yang sama dengan y 0.55 dan durasi yang sama.
11.0 sampai 11.6: kartu tergesa busur ke titik(2.1, -0.9, yPentas) (tinggi 0.8, durasi 0.6). Kartu berdiri sendirian di petak yang luas.
11.6 sampai 13.0: adegan diam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.6: figur tergesa, kartunya, dan jam pasir hilang.
13.4 sampai 13.9: garis waktu muncul. Kedua belas penanda belum tampak.
13.9 sampai 14.4: rak karya muncul di panggung.
14.4 sampai 18.84: dua belas bulan berjalan dari kiri ke kanan. Untuk k = 0 sampai 11, t_k = 14.4 + 0.34k: penanda k muncul (durasi 0.25, naik: 0.2), kartu karya k muncul di atas penanda pada t_k (durasi 0.2), lalu lintas ke tempatnya di rak (mulai t_k + 0.2, durasi 0.5). Kartu terakhir tiba 18.84.
19.2 sampai 20.5: keempat petak berubah menjadi stan yang terisi (gantiBenda(petak[i], stan[i], { t: 19.2 + 0.3 * i, durasi: 0.4, tempat: false }), dengan stan sudah di titik(rStan[i], -0.9, yPentas)). Label stan masuk bersamaan.
20.6: keempat stan klikEmas (jeda 0.12). Selesai sekitar 21.8.
21.0 sampai 21.8: abu panggung dilepas dari 1 ke 0.
Penonton tetap diam di tempat. Jangan menggerakkan penonton ke stan, karena gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
2.05, 2.28, 2.51, 2.74: kayu (kuat 0.22, x 0.5) sebagai tepuk penonton (sama dengan video lama);
7.2: debu pelan (kuat 0.2, durasi 3.2) di jam pasir saat pasir mengalir.
Langkah figur tergesa tetap terdengar tetapi tidak riuh: bunyi: { kuat: 0.4 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di garis waktu, penanda bulan, kue, atau stan. Penanda bulan tanpa label dan tanpa angka tahun.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada penonton yang berbondong ke stan sesudah stan terisi.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-12-v2 --periksa, lalu lihat hasil/gambar/indikator-12-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.5,9.5,14.5,19.4,22.1 bila titik bawaan tidak pas):
3: panggung abu kosong dengan pita dan kue, penonton baru menurunkan tangan, komisariat abu di kiri depan;
5.5: semua diam, panggung tanpa isi;
9.5: kamera dekat ke panggung, empat petak garis putus berdenyut, pasir jam sebagian besar sudah turun, kalimat sebab terbaca;
14.5: garis waktu dan rak karya tampak, penanda pertama muncul, kalimat ikhtiar pertama terbaca;
19.4: dua belas penanda lengkap, rak berisi dua belas kartu, petak pertama mulai berubah menjadi stan, kalimat ikhtiar kedua mulai masuk;
22.1: keempat stan terisi dan emas, panggung sudah melepas abu, baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-12-v2. Hasilnya hasil/video/indikator-12-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, titik asal garisWaktu, arti titikRak), lalu hasil zona, warna, LUFS, dan sinkron.
