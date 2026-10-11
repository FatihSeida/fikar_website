Prompt Animasi Indikator 44 dari 44
Judul indikator: HMI menghadapi risiko kehilangan jati diri dan kepribadian yang utuh.
Kelompok Tata Kelola. Mode Pandangan. Program terkait 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-44/. Jangan mengubah folder video lain.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-44 --format evidence --judul "HMI menghadapi risiko kehilangan jati diri dan kepribadian yang utuh.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-44/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh (setelKeadaan(komisariat, "abu", 1)). Fondasi memudar ke abu dari 0 ke 1 saat lempengnya bergeser. Kartu keputusan berwarna kertas bawaan.
Bagian 2: komisariat dan fondasi tetap abu. Kelima kartu keputusan menjadi satu-satunya titik masalah yang berdenyut (denyutCermin). Kompas berwarna bawaan. Tidak ada emas.
Bagian 3: buku dasar berwarna zamrud, garis penelusur zamrudPijar, tag alasan berwarna bawaan (proses). Emas hanya untuk satu rantai hasil: buku dasar yang menjadi tujuan semua garis penelusur. Fondasi dan komisariat melepas abu sesudah buku menjadi emas.
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
fokus: titik(0, 0.4, 0.8);
gejala: { muat: [fondasi, komisariat, titik(-3.0, 2.2, 0.6)] } (perkiraan H sekitar 12);
sebab: { muat: [garis, fondasi, kompas], H: 10 };
ikhtiar: { muat: [fondasi, komisariat, garis, buku, kompas], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Titik titik(-3.0, 2.2, 0.6) adalah titik berangkat kartu di Bagian 1.
D. Benda yang Dipakai
Dari kit:
fondasiLempeng() tanpa label: lima lempeng 3.2 x 0.18 x 3.2, gradasi zamrudRedup (bawah) ke pelat (atas). bagian.lempeng[i] urut dari bawah ke atas. userData.atas adalah permukaan lempeng teratas (y 0.9).
rumah(): komisariat 1.8 x 1.2 x 1.6, atap 0.7, berdiri di atas fondasi.
kartuKecil({ simbol: "garis", skala: 0.7 }) x 5: kartu keputusan, berbaring (0.42 x 0.56).
garisWaktu({ panjang: 5.6, jarak: 1.4, label: false }): garis waktu keputusan tanpa label, memanjang ke kanan layar.
kompas({ miring: 0.35 }), skala 0.7: kompas di depan komisariat. arahJarum ke atas layar (90°, satuan mengikuti docs benda). Jarum di bagian.jarum.
buku({ tinggi: 0.8, lebar: 0.6, tebal: 0.16, warna: W.zamrud }), tertutup, skala 1.1: buku dasar, polos. Buku tertutup menggambar dua strip pita di sampulnya; sembunyikan keduanya sebelum frame pertama: buku.userData.bagian.pita.forEach((m) => { m.visible = false; }). Emas tetap lewat bagian.emas.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 2 }) x 5: garis penelusur dari kartu ke buku dasar.
tag({ rebah: true }) x 5: tag alasan tanpa label, satu di setiap kartu.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "44", kategori: "TATA KELOLA", judul: "HMI menghadapi risiko kehilangan jati diri dan kepribadian yang utuh.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Keputusan diambil **tanpa jejak alasan**, jadi arah organisasi mudah bergeser tanpa disadari."
ikhtiar:
{ teks: "HMI Evidence memandang jati diri terjaga ketika setiap keputusan **bisa ditelusuri sampai ke nilai dasarnya**.", masuk: [13.6, 14.1], keluar: [17.6, 18.0] }
{ teks: "Karena itu **Arsip Organisasi** mencatat keputusan beserta alasannya, bukan hanya hasilnya.", masuk: [18.2, 18.7], keluar: [22.6, 23.0] }
program: "Program 10".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Fondasi, garis waktu, dan buku dasar sengaja tanpa label.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar kit. Tanah bergrid bawaan, lalu benda di bawah ini ditaruh sendiri. Sumber tata letak Gejala adalah prompt lama animasi/dokumen/seri-44-prompt/indikator-44.md bagian F dan G Bagian 1. Fondasi di prompt lama ada di titik(0, 0.6); di sini digeser ke titik(0, -1.0) supaya garis waktu dan buku dasar muat di bawahnya.
Fondasi: titik(0, -1.0), rotasi 0. Label lempeng prompt lama (“NDP”, “MISSION”, dan seterusnya) tidak dipasang.
Komisariat: titik(0, -1.0, 0.9) (y = fondasi.userData.atas), di tengah lempeng teratas, rotasi 0.
Tumpukan kartu di Bagian 1: di atas lempeng teratas, di sisi kanan depan komisariat (sisi +x), titik(0.88, -0.12, 0.92 + 0.025k) untuk kartu ke-k (k = 0 sampai 4).
Jalur kartu Bagian 1: dari titik(-3.0, 2.2, 0.6) lewat titik(-1.4, 1.4, 1.6) ke tumpukan, lengkung: true. Kartu langsung ke rumah tanpa melewati gerbang apa pun.
Pergeseran lempeng Bagian 1, dalam koordinat lokal fondasi terhadap posisi dasar tiap lempeng:
lempeng 1: x +0.3;
lempeng 3: z −0.25;
lempeng 2: z +0.35;
lempeng 0: x −0.2;
lempeng 4 (teratas, tempat komisariat) tidak bergeser.
Garis waktu: pusat di titik(0, 3.0). Petak kartu ke-j (j = 0 sampai 4) di titik(-2.2 + 1.1j, 3.0, 0.07), di atas pita.
Sudut simpang kartu ke-j: 0.16j radian (sekitar 9° x j), sehingga setiap kartu sedikit lebih bergeser dari kartu sebelumnya.
Kompas: titik(2.4, 1.0), di kanan depan fondasi, condong ke kamera.
Buku dasar: titik(0, 1.95), berbaring, rotation.y = Math.PI / 4 supaya sejajar layar, di antara sudut depan fondasi dan garis waktu.
Garis penelusur j: dari petak kartu j (y 0.1) ke buku dasar titik(0, 1.95, 0.15). Garis tergambar dari ujung kartu menuju buku.
Tag alasan j: petak kartu j + titik(0, -0.35, 0.02), di tepi atas kartu.
Pengecualian zona: garis penelusur tidak diperiksa (userData.penting = false), karena kotak pembatas garis diagonal dilaporkan longgar. Kartu yang sedang terbang masuk dari kiri bawah tidak diperiksa sebelum tiba (userData.penting = (t) => t >= saat tiba).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.78: kelima lempeng turun berurutan dari atas, dari lempeng 0 sampai lempeng 4. Lempeng ke-i mulai pada 0.6 + 0.22i: muncul (durasi 0.3, naik: 0) bersama lintas dari posisi dasar + y 1.2 ke posisi dasar (titik lokal fondasi, durasi 0.3).
1.6 sampai 2.0: komisariat muncul di atas fondasi. Komisariat abu penuh sejak awal.
2.0 sampai 4.0: lima kartu terbang langsung ke sisi komisariat dan menumpuk. Kartu ke-k mulai pada 2.0 + 0.35k: muncul di titik berangkat (durasi 0.2, naik: 0), lalu lintas di jalur F nomor 5 ke tumpukan k, durasi 0.6. Kartu terakhir tiba 4.0.
4.0 sampai 5.6: setiap kartu yang menumpuk membuat satu lempeng bergeser ke arah berbeda (lintas di koordinat lokal fondasi, durasi 0.4): lempeng 1 pada 4.0, lempeng 3 pada 4.4, lempeng 2 pada 4.8, lempeng 0 pada 5.2.
4.0 sampai 6.0: komisariat miring 6° (putar(komisariat, { t: 4.0, durasi: 2.0, sudut: 0.105, sumbu: "z" })).
4.0 sampai 6.0: abu fondasi naik dari 0 ke 1 (setelKeadaan(fondasi, "abu", halus(rentang(t, 4.0, 6.0)))). Jangan menyetel abu pada lempeng satu per satu di frame yang sama.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: garis waktu muncul di bawah fondasi.
7.2 sampai 9.7: kartu diambil dari tumpukan, mulai dari yang paling atas, dan diletakkan berderet di garis waktu dari kiri ke kanan. Kartu ke-j yang diambil (kartu tumpukan k = 4 − j) mulai pada 7.2 + 0.4j:
lintas dari tumpukan ke petak j, lengkung: true, durasi 0.6;
saat tiba, kartu berputar di sumbu y sebesar sudut simpang j (putar, durasi 0.3).
Kartu terakhir tiba 9.4 dan selesai berputar 9.7. Deretan kartu tampak makin lama makin melenceng arahnya.
9.0 sampai 9.5: kompas muncul di kanan depan fondasi.
9.6 sampai 12.5: jarum kompas melantur. Lima putar(kompas.userData.bagian.jarum, { sumbu: "y", ... }) berurutan:
9.6, durasi 0.4, sudut +0.9;
10.2, durasi 0.5, sudut −1.4;
10.9, durasi 0.4, sudut +1.1;
11.5, durasi 0.4, sudut −0.7;
12.1, durasi 0.4, sudut +1.3. Jumlah sudutnya +1.2 radian dari arah awal.
9.8 sampai 12.6: denyutCermin(kartu, { mulai: 9.8, selesai: 12.6 }) untuk kelima kartu. Keputusan berderet tanpa jejak alasan.
Komisariat tetap miring dan abu. Lempeng tetap bergeser.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.8: buku dasar muncul di antara fondasi dan garis waktu. Buku polos, tanpa judul, tanpa label, tanpa tanda apa pun.
14.2 sampai 16.2: dari setiap kartu, garis penelusur tergambar mundur ke buku dasar (aturTampak 0 ke 1, durasi 0.8, garis ke-j mulai 14.2 + 0.3j).
16.4 sampai 17.4: kartu kembali sejajar. Kartu ke-j berputar balik sebesar minus sudut simpang j (putar, durasi 0.6, mulai 16.4 + 0.1j).
16.4 sampai 17.2: jarum kompas kembali tenang ke atas (putar, sudut −1.2, durasi 0.8).
17.0 sampai 17.95: keempat lempeng yang bergeser kembali ke posisi dasarnya (lintas, durasi 0.5, mulai 17.0, 17.15, 17.3, 17.45).
17.2 sampai 18.0: komisariat kembali tegak (putar, sudut −0.105, sumbu “z”, durasi 0.8). Jumlah semua putar komisariat harus 0 sebelum 23.0.
18.4 sampai 19.9: lima tag alasan muncul di tepi atas kelima kartu (muncul, durasi 0.3, jeda 0.3, naik: 0). Setiap keputusan kini tercatat bersama alasannya.
20.2: klikEmas(buku). Buku dasar menjadi emas.
20.6 sampai 21.4: abu fondasi dan abu komisariat dilepas dari 1 ke 0, sehingga keduanya kembali ke warna bawaannya.
Tidak ada figur di video ini, termasuk sesudah pandangan.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA). Kartu pertanyaan tidak tampil karena pertanyaan: null. Komisariat berdiri di atas fondasi, jadi titik P terowongan berada di y 0.9.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
0.9, 1.12, 1.34, 1.56, 1.78: kayu dengan nada 0 sampai 4 (posisi fondasi) saat tiap lempeng mendarat;
4.0: gemuruh (kuat 0.35, durasi 2.0, posisi fondasi) saat lempeng bergeser dan komisariat miring;
14.2, 14.5, 14.8, 15.1, 15.4: garis-sambung dengan nada 0 sampai 4 (durasi 0.8, posisi buku) saat garis penelusur tergambar.
Video ini tanpa figur, jadi tidak ada langkah yang perlu diredam.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di kartu, garis waktu, atau kompas. Kompas tidak diberi huruf arah mata angin. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Catatan kepekaan indikator ini, wajib dipatuhi: buku dasar polos tanpa judul atau teks apa pun. Tidak ada label3D yang berjangkar pada buku, tidak ada garis tulisan di sampul, tidak ada simbol atau lambang. Hal yang sama berlaku untuk fondasi: label lempeng tidak dipasang.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-44 --periksa, lalu lihat hasil/gambar/indikator-44/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: fondasi lima lempeng tersusun, komisariat di atasnya, dua kartu sudah menumpuk di sisi kanan komisariat dan kartu ketiga sedang terbang;
5.5: empat lempeng bergeser ke arah berbeda, komisariat miring, fondasi hampir abu penuh;
9.5: kelima kartu berderet di garis waktu dengan arah makin melenceng, kompas tampak, kalimat sebab terbaca;
14.5: buku dasar polos tampak, garis penelusur pertama sedang tergambar, kalimat pandangan pertama terbaca;
17.7: kartu sudah sejajar, jarum kompas tenang ke atas, lempeng hampir kembali ke tempatnya;
21.3: buku dasar emas, lima tag alasan tampak, komisariat tegak, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-44. Hasilnya hasil/video/indikator-44.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, label fondasi yang tidak dipasang, benda lokal bila ada), lalu hasil zona, warna, LUFS, dan sinkron.
