Prompt Animasi Indikator 11 dari 44
Judul indikator: Lembaga kekaryaan HMI kurang berfungsi.
Kelompok Tata Kelola. Mode Ikhtiar. Program terkait 09 Ruang Karya Kader dan 11 Pemeriksaan Kepatuhan Konstitusi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-11-v2/. Folder lama animasi/proyek/indikator-11/ jangan diubah. Folder itu boleh dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-11-v2 --format evidence --judul "Lembaga kekaryaan HMI kurang berfungsi.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-11-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: ruang karya dan gedung cabang abu penuh, lampu padam. Jenjang lain (tiga komisariat, badko, PB, jembatan dunia) abu dan tembus pandang 0.27. Kabel karya abuGelap.
Bagian 2: tumpukan kartu program dan panel laporan cabang berwarna abu. Satu titik masalah: kabel karya yang putus berdenyut zamrud. Tidak ada emas.
Bagian 3: ruang karya melepas abu dan lampunya menyala. Rak pamer, kartu karya, jembatan tabung, bola aliran, kartu laporan, dan centang berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: jembatan tabung di akhir Bagian 3. Gedung cabang melepas abu dan lampunya menyala sesudah laporan diperiksa.
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
fokus: titik(-0.8, 0.6, 1.0);
gejala: { muat: [karya, ...d.urutan, meja] } (seluruh jenjang tampak; H dihitung otomatis, perkiraan sekitar 15);
sebab: { muat: [karya, kabel, panelLaporan, titikTumpukan], H: 8 };
ikhtiar: { muat: [karya, rak, d.benda.cabang, panelLaporan], H: 11 };
tidak ada kunci tambahan.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaJenjang(v, { posisi, opsi }) dengan penyesuaian di bagian F: tiga komisariat kecil, gedung cabang, menara badko, menara PB, dan lima jembatan tabung dunia.
ruangKarya({ warna: W.abuGelap, lampu: 0, nama: "ruang karya" }): lembaga kekaryaan, 1.8 x 1.4 x 1.6, pintu rolling tertutup. Semua bahannya diberi material.userData.warnaAbu = W.abuGelap (sama dengan video lama) supaya keadaan abu tetap gelap.
stasiunMeja({ radius: 0.7, alas: 1.1, kertas: false, nama: "meja cabang" }): meja rapat cabang yang kosong.
kartuKecil({ simbol: "garis", skala: 0.6 }) x 4: kartu program yang menumpuk, berbaring.
panelKertas({ lebar: 1.3, tinggi: 1.5, baris: 3, cek: true, judul: "LAPORAN CABANG" }): panel laporan cabang. Ketiga baris isinya disembunyikan sampai ditumbuhkan (tumbuh pada userData.bagian.baris[i], sumbu x).
rakKecil({ lebar: 1.2, tinggi: 1.2, dalam: 0.4, rak: 2 }): rak pamer ruang karya, diputar y 45 derajat supaya muka rak menghadap kamera.
kartuKecil({ simbol: "garis", warnaSimbol: W.zamrud, rebah: false, miring: 0, skala: 0.5 }) x 6: tiga kartu karya untuk rak pamer dan tiga kartu laporan untuk panel.
jembatanTabung({ dari, ke, radius: 0.06 }): jembatan dari ruang karya ke gedung cabang.
aliran({ ... }): bola zamrud yang mengalir di punggung jembatan.
Benda lokal:
kabelKarya(): kabel yang putus. Salin dari animasi/proyek/indikator-11/benda-lokal.js. Tiga tabung jari 0.045 warna W.abuGelap, masing-masing kurva CatmullRom dari titik dunia: kiri titik(-1.36, 0.45, 0.42) → titik(-1.03, 0.6, 0.35) → titik(-0.77, 0.68, 0.11); kanan titik(-0.13, 0.3, 0.42) → titik(-0.36, 0.6, 0.32) → titik(-0.44, 0.68, 0.11); penyambung titik(-0.77, 0.68, 0.11) → titik(-0.62, 0.72, 0.08) → titik(-0.44, 0.68, 0.11) yang tersembunyi. Penyetel userData.sambung(k) tetap ada, tetapi video ini tidak memakainya karena kabel diganti jembatan.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "11", kategori: "TATA KELOLA", judul: "Lembaga kekaryaan HMI kurang berfungsi.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Lembaga kekaryaan berdiri, tetapi programnya **tidak terhubung** ke rencana dan laporan cabang."
ikhtiar:
{ teks: "**Ruang Karya Kader** memberi lembaga kekaryaan tempat terbit dan tempat memamerkan karya.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Pemeriksaan Kepatuhan Konstitusi** memastikan programnya masuk laporan cabang dan diperiksa.", masuk: [17.8, 18.3], keluar: [22.6, 23.0] }
program: "Program 09 · Program 11".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“CABANG” pada d.benda.cabang, geser [0, 2.3, 0], gaya mikro, kelas: "abu", ukuran ikut kamera (skala: () => 16 / v.rig.keadaan.H), masuk 1.0, keluar 22.6 sampai 23.0.
“LAPORAN CABANG” adalah judul panel (judul panelKertas), bukan label tambahan.
F. Dunia dan Posisi
Dunia dasar duniaJenjang dengan penyesuaian yang sama dengan video lama:
posisi: komisariat1: titik(-3.2, -3), komisariat2: titik(-1.7, -3.3), komisariat3: titik(-3.6, -1.65), cabang: titik(0.45, -1.05), badko: titik(2.45, -1.9), pb: titik(3.6, 0.15).
opsi: komisariat: { lebar: 0.8, tinggi: 0.6, dalam: 0.7, atap: 0.35, lampu: 0 }, cabang: { lebar: 1.7, tinggi: 2.1, dalam: 1.7, lampu: 0 }, badko: { lebar: 0.95, tinggi: 2.7, dalam: 0.95, baris: 4, kolom: 2, lampu: 0 }, pb: { lebar: 1.1, tinggi: 3.3, dalam: 1.1, kubus: 0.5, baris: 5, kolom: 2, lampu: 0 }.
latar = d.urutan tanpa d.benda.cabang.
Komisariat video ini adalah d.benda.komisariat3 (dipakai akhiriEvidence).
Titik dunia yang dipakai: d.titik.depanPintu.cabang.
Benda tambahan dan posisinya:
Ruang karya: titik(-2.3, 0.15). Pintunya di muka +z (kiri bawah layar). pintuKarya = karya.localToWorld(karya.userData.depanPintu.clone()) sesudah karya.updateMatrixWorld(true).
Meja cabang: titik(0.4, 2.15).
Kabel karya: grup di titik asal dunia, titik tabung seperti bagian D.
Tumpukan kartu program: titikTumpukan = pintuKarya + titik(0.25, -0.25), yaitu 0.35 unit ke dalam ambang pintu. Kartu ke-k (k = 0 sampai 3) di titikTumpukan, y 0.05 + 0.04k, diputar y (acak(11 + k)() − 0.5) × 20°.
Panel laporan cabang: titik(2.0, 0.8). Bawaan hadap panel sudah menghadap kamera.
Rak pamer: titik(-2.2, 2.1), rotasi y 45 derajat.
Kartu karya i (i = 0 sampai 2): berangkat dari pintuKarya y 0.4. Tujuan: kartu 1 dan 2 di lantai rak bawah (rak.userData.titikRak(0)) digeser titik(-0.3, 0) dan titik(0.3, 0), kartu 3 di lantai rak atas (rak.userData.titikRak(1)). Ubah ke titik dunia dengan rak.localToWorld bila titik itu lokal.
Jembatan tabung: dari = titik(-1.32, 0.49, 0.5) (muka +x ruang karya), ke = titik(0.21, -0.04, 0.5) (muka +z gedung cabang). Grup di titik asal dunia.
Aliran: jalur [dari, ke] dengan naik: 0.12 (jari tabung + 0.06) supaya bola meluncur di punggung tabung.
Kartu laporan i: berangkat dari d.titik.depanPintu.cabang y 0.8, mendarat di panelLaporan.userData.titikBaris(i) (titik dunia, panggil sesudah matriks panel diperbarui).
Pengecualian zona:
latar selain komisariat3: userData.penting = (t) => t < 6.0.
d.benda.komisariat3: userData.penting = (t) => t < 6.0 || t >= 23.0.
meja: userData.penting = (t) => t < 6.0.
d.benda.cabang: userData.penting = (t) => !(t > 6.0 && t < 13.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-11/adegan.js. Dunia, benda, posisi, dan waktunya sama persis.
0.6 sampai 1.5: semua benda dunia muncul (muncul(d.urutan, { t: 0.6, selesai: 1.5, durasi: 0.4 })). Di v.setiapFrame, setiap benda latar abu penuh dan aturOpasitas(b, 0.27 × halus(rentang(t, 0.6, 1.5))). Gedung cabang abu penuh. Semua lampu jenjang 0.
1.0: label CABANG masuk.
1.4 sampai 1.9: meja cabang muncul (durasi 0.5).
1.5 sampai 2.0: ruang karya muncul (durasi 0.5). Abu penuh, pintu tertutup.
1.65 sampai 2.0: kabel karya muncul (durasi 0.35, naik: 0).
2.0 sampai 3.1: lampu ruang karya berkedip dua kali lalu padam: lampu 0.7 pada 2.0 sampai 2.2 dan 2.85 sampai 3.1, selain itu 0.
3.1 sampai 6.0: diam. Ruang karya berdiri terpisah dari gedung cabang, kabelnya putus di tengah.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: pintu rolling ruang karya terangkat sebagian (karya.userData.bukaPintu(0.4 × halus(rentang(t, 6.6, 7.2))) di v.setiapFrame).
7.0 sampai 7.5: panel laporan cabang muncul, abu penuh, ketiga barisnya kosong.
7.0 sampai 11.8: kabel karya berdenyut (denyutCermin(kabel, { mulai: 7.0, selesai: 11.8 })).
7.2 sampai 10.0: empat kartu program muncul satu per satu di ambang pintu dan menumpuk (muncul, t 7.2, 8.0, 8.8, 9.6, durasi 0.4, naik: 0.3). Semuanya abu penuh dan tidak bergerak keluar.
10.0 sampai 13.0: adegan diam. Tumpukan tertahan di dalam, panel laporan tetap kosong.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 14.4: pintu rolling terbuka penuh (bukaPintu 0.4 ke 1). Lampu ruang karya 0 ke 1, abu ruang karya 1 ke 0.
13.6 sampai 14.1: rak pamer muncul di depan ruang karya.
14.2: tumpukan kartu program hilang (durasi 0.3, turun: 0).
14.3 sampai 15.9: tiga kartu karya muncul di ambang pintu (t 14.3, 14.8, 15.3, durasi 0.2), lalu lintas ke tempatnya di rak (mulai 0.1 detik sesudah muncul, durasi 0.5). Kartu ketiga tiba 15.9.
15.9 sampai 17.6: adegan tetap. Kalimat ikhtiar pertama keluar 17.2 sampai 17.6.
17.6 sampai 18.2: kabel karya berubah menjadi jembatan tabung (gantiBenda(kabel, jembatan, { t: 17.6, durasi: 0.6, tempat: false })).
18.2 sampai 20.0: bola aliran zamrud meluncur dari ruang karya ke gedung cabang (aliran({ jalur: [dari, ke], mulai: 18.2, selesai: 20.0, naik: 0.12 })).
18.8 sampai 20.4: tiga kartu laporan muncul di depan pintu cabang (t 18.8, 19.3, 19.8, durasi 0.2), lalu lintas ke baris panel (mulai t + 0.2, durasi 0.4). Kartu tiba 19.4, 19.9, 20.4. Saat tiba, kartu hilang (durasi 0.2, turun: 0) dan baris tujuannya tumbuh (sumbu x, durasi 0.3). Baris terakhir penuh 20.7.
20.8 sampai 21.4: ketiga centang panel muncul (muncul(panelLaporan.userData.bagian.centang.slice(0, 3), { t: 20.8, jeda: 0.15, durasi: 0.3 })).
21.4: jembatan tabung klikEmas.
21.4 sampai 22.2: gedung cabang melepas abu (1 ke 0) dan lampunya menyala (0 ke 1).
22.0 sampai 22.8: komisariat3 kembali utuh, aturOpasitas 0.27 ke 1, supaya siap dipakai Bagian 4. Abunya tetap 1 dan dilepas akhiriEvidence.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat3, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Bola aliran sudah selesai 20.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
2.2 dan 3.1: padam (kuat 0.4) di ruang karya saat lampu berkedip (sama dengan video lama);
13.4: pintu (durasi 1.0) di ruang karya saat pintu rolling terbuka;
13.6: menyala di ruang karya saat lampunya menyala;
17.6: garis-sambung (durasi 0.6) di jembatan saat kabel tersambung menjadi jembatan.
Tidak ada figur, jadi tidak ada langkah yang perlu diredam.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata. Label “CABANG” dan “LAPORAN CABANG” tetap umum, tanpa nama tempat.
Tidak boleh ada angka di panel laporan, kartu program, atau kartu karya. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-11-v2 --periksa, lalu lihat hasil/gambar/indikator-11-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.5,9.5,14.5,19.7,22.3 bila titik bawaan tidak pas):
3: ruang karya abu berdiri terpisah dari gedung cabang, kabel putus, lampu karya sedang berkedip kedua kali, jenjang lain tembus pandang;
5.5: semua diam, lampu karya padam, meja cabang kosong;
9.5: kamera dekat, pintu rolling terangkat sebagian, tiga kartu program abu menumpuk di ambang, kabel berdenyut, panel laporan kosong, kalimat sebab terbaca;
14.5: pintu terbuka penuh, lampu karya menyala, rak pamer tampak, kartu karya pertama meluncur ke rak, kalimat ikhtiar pertama terbaca;
19.7: jembatan tabung terpasang, bola aliran di punggungnya, baris pertama panel terisi, kalimat ikhtiar kedua terbaca;
22.3: jembatan emas, tiga centang di panel, gedung cabang menyala, baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-11-v2. Hasilnya hasil/video/indikator-11-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal, arti titikRak bila ternyata titik dunia), lalu hasil zona, warna, LUFS, dan sinkron.
