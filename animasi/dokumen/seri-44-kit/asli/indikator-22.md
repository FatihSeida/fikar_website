Prompt Animasi Indikator 22 dari 44
Judul indikator: Persoalan internal antara HMI DIPO dan HMI MPO berlarut-larut.
Kelompok Tata Kelola. Mode Pandangan. Program terkait 19 Museum dan Perpustakaan Digital.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-22/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-22 --format evidence --judul "Persoalan internal antara HMI DIPO dan HMI MPO berlarut-larut.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-22/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
Aturan simetri (wajib, video ini sangat peka). Sumbu simetri adalah garis tengah layar r = 0. Semua benda dan gerak sisi kanan dibuat dari sisi kiri lewat satu fungsi cermin, bukan ditulis ulang dengan tangan:
posisi: titik(r, d, y) menjadi titik(-r, d, y). Dalam koordinat dunia, (x, y, z) menjadi (z, y, x);
rotasi y: θ menjadi π/2 − θ. Benda yang diputar 45 derajat tetap 45 derajat;
sudut putar dan opsi putar pada busur: s menjadi −s;
opsi pembuat benda dan benih: sama persis;
waktu, durasi, jeda, tinggi busur, dan kurva gerak: sama persis. Pasangan kiri dan kanan dimulai pada detik yang sama. muncul dan hilang untuk pasangan memakai jeda: 0. Benda di sumbu (komisariat, rak, buku, figur pembaca) diletakkan tepat di r = 0 dan diputar 45 derajat supaya tampak dari depan dan simetris terhadap dirinya sendiri.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Kedua rumah dan kedua blok tanah memakai warna bawaan sepanjang video. Keduanya tidak pernah diberi abu, pudar, denyut, nyala, atau emas.
Bagian 1: komisariat di sumbu abu penuh.
Bagian 2: potongan kertas abu. Kedua belas potongan mendapat denyutCermin bersamaan sebagai satu titik masalah. Tidak ada emas.
Bagian 3: potongan kertas melepas abu saat terbang ke rak (proses). Buku zamrud. Emas hanya untuk satu rantai hasil di tengah: buku sumber yang terbuka, lalu rak. Komisariat di sumbu melepas abu.
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
Kamera diisi lewat kamera di akhiriEvidence. Setiap kunci memakai fokus tetap di sumbu r = 0 bersama muat, sehingga muat hanya menghitung H dan kamera tidak pernah condong ke satu sisi:
gejala: { fokus: titik(0, 0.5, 0.8), muat: [blokKiri, blokKanan, komisariat, titik(-2.5, -0.6, 2.2), titik(2.5, -0.6, 2.2)] };
sebab: { fokus: titik(0, -0.6, 0.6), muat: [titik(-1.4, -2.0), titik(1.4, -2.0), titik(-1.4, 0.8), titik(1.4, 0.8), titik(-1.4, -0.6, 1.8), titik(1.4, -0.6, 1.8)], H: 8 };
ikhtiar: { fokus: titik(0, 0.4, 0.8), muat: [blokKiri, blokKanan, komisariat, rak, titik(-2.5, -0.6, 2.2), titik(2.5, -0.6, 2.2)], H: 11 };
tambahan: [{ t: [18.4, 19.4], fokus: titik(0, -0.2, 0.9), muat: [rumahKiri, rumahKanan, rak, titik(0, -0.6, 2.0)], H: 10 }].
Titik muat selalu berpasangan dan simetris. Kedua rumah selalu ada di dalam bingkai pada Bagian 1 dan Bagian 3.
D. Benda yang Dipakai
Dari kit:
blokTanah({ lebar: 2.6, tinggi: 0.3, dalam: 2.6 }) x 2: blok kiri dan blok kanan, tanpa patah dan tanpa sisiCelah (supaya tepinya tidak bergerigi acak).
rumah() x 2: rumah kiri dan rumah kanan, identik, 1.8 x 1.2 x 1.6 dengan atap 0.7, anak dari bloknya masing-masing.
rumahKecil({ lampu: 1 }): komisariat di sumbu, 1.2 x 0.9 x 1.1. Ukurannya berbeda dari kedua rumah supaya tidak terbaca sebagai salah satu sisi.
jalanUbin({ titik: [...], jumlah: 3 }) x 2: jalan kiri dan jalan kanan dari komisariat ke kedua blok.
kartuKecil({ simbol: null, skala: 0.35 }) x 12: potongan kertas, berbaring, enam dari tiap sisi.
rakKecil({ lebar: 1.2, tinggi: 1.2, dalam: 0.4, rak: 2 }): rak sumber di tengah celah (userData.titikRak(i)).
buku({ tinggi: 0.55, lebar: 0.4, tebal: 0.14, berdiri: true, warna: W.zamrud }): buku utuh yang tersusun di rak.
buku({ tinggi: 0.55, lebar: 0.4, tebal: 0.14, terbuka: true, warna: W.zamrud }): buku yang sama dalam keadaan terbuka.
pion(): satu pembaca dari komisariat di sumbu.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "22", kategori: "TATA KELOLA", judul: "Persoalan internal antara HMI DIPO dan HMI MPO berlarut-larut.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Perbedaan sejarah sering dibicarakan **dari cerita sepotong-sepotong**, jarang dari sumber yang utuh."
ikhtiar:
{ teks: "HMI Evidence memandang persoalan ini sebagai wilayah sejarah dan musyawarah, **bukan wilayah klaim**.", masuk: [13.6, 14.1], keluar: [17.6, 18.0] }
{ teks: "Yang bisa dikerjakan adalah membuka sumber yang utuh lewat **Museum dan Perpustakaan Digital** untuk setiap generasi.", masuk: [18.2, 18.7], keluar: [22.6, 23.0] }
program: "Program 19".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Tidak boleh ada label apa pun di adegan.
F. Dunia dan Posisi
Tidak memakai dunia dasar kit. Tanah bergrid bawaan. Prompt lama memakai dua jalan dari satu titik asal; di sini titik asal itu menjadi komisariat di sumbu, dan kedua jalan menuju dua rumah identik di dua blok yang dipisah celah.
Benda dan posisinya (sisi kanan selalu cermin sisi kiri):
Blok kiri: di titik(-2.2, -0.6), rotasi y 45 derajat (tepinya sejajar layar). Bergeser ke titik(-2.5, -0.6) di Bagian 1. Blok kanan: cermin, yaitu titik(2.2, -0.6) lalu titik(2.5, -0.6), rotasi 45 derajat. Celah di tengah 1.8 unit, lalu 2.4 unit. Tepi depan blok di d 0.7, tepi belakang di d -1.9.
Rumah kiri dan kanan: di pusat atas bloknya (lokal 0, 0.3, 0), rotasi lokal 0. Karena blok sudah diputar 45 derajat, rotasi dunia rumah 45 derajat, sehingga muka berpintu menghadap tepat ke penonton dan kedua rumah sama terang. Rumah adalah anak blok supaya ikut bergeser.
Komisariat: rumahKecil di titik(0, 2.8), rotasi y 45 derajat.
Jalan kiri: titik [titik(-0.75, 2.2), titik(-1.5, 1.5), titik(-2.2, 0.8)], tiga ubin, berakhir di tepi depan blok kiri. Jalan kanan: cermin.
Potongan kertas kiri k (k = 0 sampai 5): titik awal titik(-1.4, d_k, 1.2), titik jatuh titik(-a_k, d_k, 0.02), rotasi y awal θ_k, putar selama terbang s_k. Nilai (a_k, d_k, θ_k, s_k): (0.55, -1.5, 0.3, 1.2), (0.25, -1.0, 1.1, -0.9), (0.6, -0.4, 2.0, 1.5), (0.2, 0.1, 0.7, -1.3), (0.5, 0.5, 2.6, 0.8), (0.35, -1.8, 1.6, -1.1). Potongan kanan k: cermin dari potongan kiri k (posisi r dibalik, rotasi y π/2 − θ_k, putar −s_k).
Rak: di titik(0, -0.6, 0), rotasi y 45 derajat (muka ke penonton), di tanah dasar celah. Titik masuk potongan: rak.localToWorld(rak.userData.titikRak(1)) + y 0.3, di sumbu.
Buku utuh: berdiri di tengah ruang rak bawah (rak.localToWorld(rak.userData.titikRak(0))), di sumbu, menghadap penonton.
Buku terbuka: di atas rak, titik(0, -0.6, 1.25), di sumbu.
Pembaca: muncul di titik(0, 1.9), berjalan lurus di sumbu ke titik(0, 0.5), di depan rak.
Pengecualian zona: tidak ada untuk rumah, blok, rak, dan komisariat pada Bagian 1 dan 3. Selama sebab (H 8), blok, rumah, jalan, dan komisariat boleh terpotong ((t) => !(t > 6.0 && t < 13.0)), dengan aturan yang sama untuk kiri dan kanan.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.2: komisariat di sumbu muncul (muncul, durasi 0.6). Komisariat abu penuh sejak awal.
1.0 sampai 1.5: blok kiri dan blok kanan muncul bersamaan (muncul([blokKiri, blokKanan], { t: 1.0, jeda: 0 })).
1.3 sampai 1.8: rumah kiri dan rumah kanan muncul bersamaan (jeda: 0).
1.8 sampai 3.6: kedua jalan tumbuh ubin demi ubin dari komisariat ke kedua blok, bersamaan (muncul(jalanKiri.userData.bagian.ubin, { t: 1.8, jeda: 0.6 }) dan panggilan yang sama untuk jalan kanan).
4.0 sampai 5.6: kedua blok beserta rumahnya bergeser menjauh 0.3 unit dari sumbu, bersamaan (lintas, durasi 1.6, beku: false). Celah melebar dari 1.8 ke 2.4. Jalan tetap, ujungnya masih di bawah tepi depan blok.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
7.0 sampai 11.9: potongan kertas beterbangan dari kedua sisi ke dalam celah. Untuk k = 0 sampai 5, t_k = 7.0 + 0.8 k, pasangan kiri dan kanan bersamaan:
t_k: potongan k kiri dan kanan muncul di titik awalnya di atas sisi dalam blok (muncul, durasi 0.3, naik: 0, jeda: 0), abu;
t_k + 0.2 sampai t_k + 1.1: potongan terbang ke titik jatuhnya di tanah celah (busur, tinggi 0.8, durasi 0.9, putar s_k untuk kiri dan −s_k untuk kanan);
sesudah mendarat, potongan tetap berserakan dan tidak pernah tersusun.
11.4 sampai 12.8: denyutCermin pada kedua belas potongan sekaligus.
12.8 sampai 13.0: adegan diam.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.9: rak muncul di tengah celah, di sumbu.
14.2 sampai 17.5: potongan kertas naik dari kedua sisi ke rak, berpasangan. Untuk k = 0 sampai 5, t_k = 14.2 + 0.5 k:
t_k sampai t_k + 0.8: potongan k kiri dan kanan melayang ke titik masuk rak (busur, tinggi 1.0, durasi 0.8, putar −s_k untuk kiri dan s_k untuk kanan), sambil melepas abu;
t_k + 0.8: kedua potongan hilang bersamaan di rak (durasi 0.2, jeda: 0).
14.8 sampai 17.6: buku utuh tumbuh di rak bawah dari tinggi 0 ke penuh (tumbuh, sumbu y, durasi 2.8), seiring potongan yang masuk. Buku utuh pada 17.6.
19.0 sampai 19.4: buku dibuka. gantiBenda(bukuUtuh, bukuTerbuka, { durasi: 0.4, tempat: false }), buku terbuka di atas rak.
20.0: klikEmas(bukuTerbuka) (halamannya menjadi emas).
20.6: klikEmas(rak). Rak menyala emas.
20.8 sampai 21.6: abu komisariat di sumbu dilepas dari 1 ke 0.
21.2 sampai 21.4: pembaca muncul di titik(0, 1.9) (naik: 0). 21.4 sampai 22.4: pembaca berjalan lurus di sumbu ke depan rak (jalan, durasi 1.0). Hanya satu figur, dari komisariat di sumbu, bukan dari salah satu sisi.
22.4 sampai 23.0: adegan diam. Kedua rumah tetap identik, sama warna, dan sama terang. Tidak ada sisi yang bergerak mendekat.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }) dengan komisariat = rumahKecil di sumbu, bukan salah satu dari kedua rumah. Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Pasangan kiri dan kanan berbunyi pada detik yang sama dan panning-nya otomatis tercermin. Beri sumber berpasangan yang setara, mis. potongan kiri 1 dan potongan kanan 1.
Tambahkan lewat catat, semuanya di sumbu (posisi titik(0, -0.6)):
4.0: gemuruh pelan (kuat 0.3, durasi 1.6) saat kedua blok menjauh, satu peristiwa saja;
17.6: denting (kuat 0.5) saat buku utuh;
19.0: tidak perlu catat; gantiBenda sudah berbunyi kertas.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Catatan kepekaan, SANGAT PEKA: dua sisi digambar simetris persis (bentuk, ukuran, warna, waktu gerak sama). Tidak ada label DIPO atau MPO di adegan, dan tidak ada label lain apa pun. Tidak ada sisi yang menang, mendekat lebih dulu, bergerak lebih banyak, lebih besar, lebih terang, lebih dekat ke penonton, atau menjadi emas. Emas hanya pada rak atau buku sumber di tengah.
Satu-satunya perbedaan kiri dan kanan yang diizinkan adalah arah bayangan dan arsiran dari cahaya kit. Laporkan bila ada perbedaan lain.
Tidak boleh ada teks pada potongan kertas atau buku. Tidak ada angka.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-22 --periksa, lalu lihat hasil/gambar/indikator-22/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: dua blok dan dua rumah identik, jalan kiri dan kanan sama panjang dan tumbuh bersamaan;
5.5: kedua blok sudah menjauh sama jauh, celah melebar;
9.5: kamera dekat ke celah, potongan kertas dari kiri dan kanan berserakan secara cermin, kalimat sebab terbaca;
14.5: rak di tengah, pasangan potongan pertama melayang ke rak, kalimat pandangan pertama terbaca;
20.3: buku terbuka emas di atas rak, kedua rumah tampak utuh dan sama;
21.7: rak emas, pembaca berjalan di sumbu, kalimat pandangan kedua dan baris program terbaca.
Uji simetri: ambil npm run buat -- indikator-22 --jepret 3,9.5,14.5,20.3, lalu bandingkan setiap tangkapan dengan cerminan horizontalnya pada zona adegan. Selain bayangan dan arsiran cahaya, kiri dan kanan harus sama. Tulis hasilnya di laporan.
Bila konsol memberi peringatan teks lebih dari 3 baris, laporkan; jangan mengubah teks.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-22. Hasilnya hasil/video/indikator-22.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, hasil uji simetri).
