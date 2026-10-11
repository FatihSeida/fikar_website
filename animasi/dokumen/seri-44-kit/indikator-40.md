Prompt Animasi Indikator 40 dari 44
Judul indikator: Gejala politik uang dalam pemilihan ketua umum merusak moral kepemimpinan dan citra HMI.
Kelompok Tata Kelola. Mode Pandangan. Program terkait 11 Pemeriksaan Kepatuhan Konstitusi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-40/. Jangan mengubah folder video lain.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-40 --format evidence --judul "Gejala politik uang dalam pemilihan ketua umum merusak moral kepemimpinan dan citra HMI.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-40/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh (setelKeadaan(komisariat, "abu", 1)). Amplop abu penuh. Kotak suara memudar ke abu dari 0 ke 1.
Bagian 2: tirai gelap memakai W.latar. Amplop abu dan pudar selama berada di sisi gelap. Lembar aturan yang masih kosong menjadi satu-satunya titik masalah yang berdenyut (denyutCermin). Tidak ada emas.
Bagian 3: kerucut sorot krem bawaan, lembar aturan berbingkai zamrud dengan centang zamrud (proses). Emas hanya untuk satu rantai hasil: aturan yang sudah tertulis dan diperiksa, lalu kotak suara yang menjadi emas. Komisariat melepas abu sesudah kotak suara menjadi emas.
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
fokus: titik(0.2, -0.4, 0.9);
gejala: { muat: [ruang, kotak, komisariat] } (perkiraan H sekitar 12.5);
sebab: { muat: [kotak, lembarAturan, titik(-2.4, 0.4, 1.0)], H: 9 };
ikhtiar: { muat: [ruang, kotak, lembarAturan, komisariat], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Kerucut sorot tidak dimasukkan ke muat (bawaannya penting: false).
D. Benda yang Dipakai
Dari kit:
ruangAcara({ lebar: 4.4, dalam: 3.6 }): lantai ruang pemilihan, permukaan di y 0.1.
kotakSuara({ alas: true, pagarKaca: false }): kotak 1.0 berwarna kertas dengan celah di atas, di atas alas pelat 2.0 x 0.2 x 2.0.
amplop({ skala: 0.5, prangko: false }) x 15: amplop polos, 0.75 x 0.47. Delapan untuk orbit Bagian 1, lima untuk Bagian 2, dua untuk Bagian 3.
panelKertas({ lebar: 1.1, tinggi: 1.4, baris: 4, cek: true, kosong: true, judul: "ATURAN", kaki: "tiang" }): lembar aturan. bagian.baris[] ditumbuhkan dengan tumbuh(..., { sumbu: "x" }), bagian.slot[] adalah garis putus baris kosong, bagian.centang[] dimunculkan satu per satu.
kerucutSorot({ tinggi: 4, radiusBawah: 2.4, opasitas: 0.12 }): sorot yang menerangi seluruh ruang.
rumah(): komisariat 1.8 x 1.2 x 1.6, atap 0.7.
Benda lokal (di benda-lokal.js):
tiraiGelap(): kotak tipis 1.2 x 0.01 x 3.6 dengan bahan bahanPadat(W.latar, { transparent: true }), titik asal di tengah alas. Opasitas hanya lewat aturOpasitas. userData.penting = false. Fungsinya membuat sisi kiri ruang tampak gelap.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "40", kategori: "TATA KELOLA", judul: "Gejala politik uang dalam pemilihan ketua umum merusak moral kepemimpinan dan citra HMI.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Aturan pembiayaan pemilihan **tidak tertulis rinci dan tidak diperiksa**, jadi godaan bekerja di ruang gelap."
ikhtiar:
{ teks: "HMI Evidence memandang kepemimpinan yang lahir dari politik uang **kehilangan pijakan moralnya** sejak hari pertama.", masuk: [13.6, 14.1], keluar: [16.0, 16.4] }
{ teks: "Karena itu aturan pembiayaan dan kampanye perlu ditulis terbuka dan diperiksa lewat **Pemeriksaan Kepatuhan Konstitusi**.", masuk: [16.6, 17.1], keluar: [22.6, 23.0] }
program: "Program 11".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Judul “ATURAN” di lembar aturan adalah label HTML bawaan panelKertas.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar kit. Tanah bergrid bawaan, lalu benda di bawah ini ditaruh sendiri. Sumber tata letak Gejala adalah prompt seri versi pertama (format 21 detik) bagian F. Kotak suara dan alasnya sekarang benda kit kotakSuara.
Ruang: pusat di titik(-0.4, 0.4), rotation.y = Math.PI / 4 supaya sejajar layar. Lebar 4.4 ke kanan layar (r −2.6 sampai 1.8), dalam 3.6 ke bawah layar (d −1.4 sampai 2.2).
Kotak suara: titik(-0.4, 0.4, 0.1), di tengah ruang. Titik celah dunia C = titik(-0.4, 0.4, 1.3) (lantai 0.1 + alas 0.2 + kotak 1.0), sama dengan kotak.userData.celah di koordinat dunia.
Tirai gelap: pusat di titik(-2.0, 0.4, 0.105), rotation.y = Math.PI / 4, menutupi lajur kiri ruang dari r −2.6 sampai −1.4. Kotak suara tetap di sisi terang.
Lembar aturan: titik(1.0, -0.2, 0.1), di kanan belakang kotak, menghadap kamera (hadap bawaan).
Komisariat: titik(2.6, -2.4), di luar ruang, kanan atas, rotasi 0.
Kerucut sorot: titik asalnya (pusat genangan cahaya) di titik(-0.4, 0.4, 0.1).
Orbit amplop Bagian 1: amplop ke-i (i = 0 sampai 7) berputar mengelilingi pusat kotak di tanah titik(-0.4, 0.4), radius 1.6 untuk i genap dan 2.2 untuk i ganjil, tinggi y 0.8 + 0.14i, sudut awal 45° x i. Jalurnya 25 titik di lingkaran itu, dari sudut awal sampai satu putaran penuh.
Titik awal amplop Bagian 2 (sisi gelap), k = 0 sampai 4: titik(-2.4, 0.4 + o, 1.0 + 0.1k) dengan o berturut-turut −0.8, 0.6, −0.2, 1.0, −0.5.
Titik awal amplop Bagian 3: titik(-2.4, 0.6, 1.1) dan titik(-2.4, 0.0, 1.2). Titik henti Z masing-masing = titik awal + 0.6 x (C − titik awal), yaitu 60% jalan menuju celah.
Pengecualian zona: tirai gelap dan kerucut sorot tidak diperiksa (penting: false). Amplop orbit boleh terpotong saat kamera mulai mendekat (userData.penting = (t) => t < 6.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: ruang, kotak suara, dan komisariat muncul (muncul([ruang, kotak, komisariat], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.6 sampai 4.7: delapan amplop muncul satu per satu di titik awal orbitnya, amplop ke-i pada 1.6 + 0.4i (muncul, durasi 0.3, naik: 0). Amplop abu penuh.
Amplop ke-i langsung mengorbit: lintas(amplop, { t: 1.6 + 0.4 * i, durasi: 7.0 - (1.6 + 0.4 * i), jalur: orbit[i], lengkung: true, hadap: true, kurva: (u) => u * u, bunyi: false }). Kurva kuadrat membuat setiap amplop makin cepat, dan amplop yang muncul belakangan menempuh satu putaran dalam waktu lebih pendek, jadi seluruh orbit tampak makin cepat.
Beku bawaan format menghentikan orbit: melambat 6.0, berhenti 6.6.
1.6 sampai 6.0: abu kotak suara naik dari 0 ke 1 (halus(rentang(t, 1.6, 6.0))).
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.0: kedelapan amplop orbit hilang (selesai: 7.0), supaya tidak menumpuk di kamera dekat.
6.8 sampai 7.6: tirai gelap muncul, opasitas 0 ke 0.8 (aturOpasitas di v.setiapFrame, opasitas 0 sebelum 6.8, tanpa muncul). Sisi kiri ruang kini gelap.
7.0 sampai 7.5: lembar aturan muncul. Keempat barisnya kosong (garis putus), keempat centang belum tampak.
7.6 sampai 12.6: lima amplop datang dari sisi gelap. Amplop ke-k dimulai pada Tk = 7.6 + 0.9k:
Tk: muncul di titik awalnya (durasi 0.3, naik: 0);
Tk sampai Tk + 1.4: lintas ke C, lengkung: true, lewat titik tengah yang diangkat ke y 1.6, bunyi: { kuat: 0.3 };
pudar: setelKeadaan(amplop, "pudar", 0.8 * (1 - halus(rentang(t, Tk + 0.84, Tk + 1.19)))), jadi amplop baru jelas terlihat sesaat sebelum masuk celah;
Tk + 1.4: hilang di celah (durasi 0.2, turun: 0.2).
Amplop ke-4 (terakhir) dimulai 11.2 dan masuk celah 12.6 sampai 12.8.
7.8 sampai 12.6: denyutCermin(lembarAturan, { mulai: 7.8, selesai: 12.6 }). Aturan ada tempatnya, tetapi belum tertulis.
Kotak suara tetap abu penuh.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.0 dan 13.15: dua amplop terakhir muncul di sisi gelap (durasi 0.3, naik: 0), pudar 0.8, lalu lintas ke titik hentinya Z, durasi 1.2 (tiba 14.2 dan 14.35). Pudar turun dari 0.8 ke 0 pada 13.6 sampai 14.2, saat cahaya datang.
13.2 sampai 14.0: kerucut sorot muncul di atas kotak suara.
13.4 sampai 14.2: opasitas tirai gelap turun dari 0.8 ke 0. Seluruh ruang terang.
14.8 sampai 15.2: kedua amplop yang berhenti di udara hilang (durasi 0.4, turun: 0), sebelum sampai ke celah.
15.2 sampai 16.8: adegan diam di bawah cahaya.
16.8 sampai 18.4: keempat baris aturan tertulis satu per satu (tumbuh(lembarAturan.userData.bagian.baris, { t: 16.8, durasi: 0.4, sumbu: "x" })). Garis putus baris ke-i hilang pada 16.8 + 0.4i (durasi 0.3, turun: 0).
18.8 sampai 19.85: keempat centang muncul (muncul(lembarAturan.userData.bagian.centang, { t: 18.8, jeda: 0.25, durasi: 0.3, naik: 0 })). Aturan sudah diperiksa.
20.2 sampai 20.6: abu kotak suara dilepas dari 1 ke 0.
20.6: klikEmas(kotak). Kotak suara menjadi emas.
21.0 sampai 21.8: abu komisariat dilepas dari 1 ke 0, sehingga komisariat kembali berwarna zamrudRedup.
Jangan menampilkan figur pemilih atau kandidat yang datang sesudahnya. Video ini tidak memakai figur.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA). Kartu pertanyaan tidak tampil karena pertanyaan: null.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.6: whoosh pelan (kuat 0.3, durasi 4.4, posisi kotak) selama orbit makin cepat;
13.2: menyala (kuat 0.6, posisi kotak) saat kerucut sorot menyala;
18.8, 19.05, 19.3, 19.55: centang dengan nada 0 sampai 3 (posisi lembar aturan) saat centang muncul.
Desir lintas orbit Bagian 1 dibisukan (bunyi: false), karena sudah diwakili satu whoosh panjang.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di lembar aturan, kotak suara, atau amplop. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Catatan kepekaan indikator ini, wajib dipatuhi:
tanpa figur yang bisa dikenali sebagai orang atau kandidat nyata; video ini tidak memakai pion sama sekali;
tanpa angka uang dan tanpa simbol mata uang: amplop polos (prangko: false), tanpa tulisan, tanpa lembaran uang yang mengintip;
disarankan tayang sesudah Kongres. Catatan ini untuk penjadwalan tayang, tidak mengubah isi video.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-40 --periksa, lalu lihat hasil/gambar/indikator-40/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: empat amplop abu mengorbit kotak suara pada ketinggian berbeda, kotak mulai abu;
5.5: delapan amplop mengorbit cepat, kotak hampir abu penuh;
9.5: kamera dekat, sisi kiri ruang gelap, satu amplop pudar sedang melayang ke celah, lembar aturan kosong berdenyut, kalimat sebab terbaca;
14.5: kerucut sorot menyala, ruang terang, dua amplop berhenti di udara sebelum celah, kalimat pandangan pertama terbaca;
18.7: keempat baris aturan tertulis, garis putus sudah hilang, kalimat pandangan kedua terbaca;
21.7: centang lengkap, kotak suara emas, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-40. Hasilnya hasil/video/indikator-40.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal tiraiGelap), lalu hasil zona, warna, LUFS, dan sinkron.
