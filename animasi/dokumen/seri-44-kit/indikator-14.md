Prompt Animasi Indikator 14 dari 44
Judul indikator: Tradisi intelektual HMI memudar.
Kelompok Pengetahuan. Mode Ikhtiar. Program terkait 09 Ruang Karya Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-14-v2/. Folder lama animasi/proyek/indikator-14/ jangan diubah. Folder itu boleh dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-14-v2 --format evidence --judul "Tradisi intelektual HMI memudar.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-14-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: kedua rak, meja, dan komisariat abu penuh. Sembilan lentera mulai redup (nyala 0.4) lalu padam satu per satu. Kanal komisariat berwarna W.abuGelap dengan bingkai W.abu (opsi warna, sama dengan video lama).
Bagian 2: balon kata berwarna kertas redup bawaan dan menguap. Lentera padam. Satu titik masalah: meja berdenyut zamrud. Tidak ada emas.
Bagian 3: lembar tulisan dan buku baru berwarna zamrud atau kertas (proses). Lentera yang dinyalakan buku memakai nyala zamrud (warnaNyala: "zamrud"), bukan emas. Emas hanya untuk satu rantai hasil: buku terakhir yang masuk rak. Meja melepas abu saat diskusi berikutnya mulai, kedua rak melepas abu sesudah buku terakhir menjadi emas.
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
gejala: { muat: [d.benda.rakKiri, d.benda.rakKanan, d.benda.meja, kanal, komisariat] };
sebab: { muat: [d.benda.meja, ...d.titik.kursi, puncakBalon], H: 8 }, dengan puncakBalon = d.titik.atasKepala[0].clone().add(titik(0, 0, 1.0));
ikhtiar: { muat: [d.benda.meja, kanal, d.benda.rakKanan], H: 11 };
tidak ada kunci tambahan.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaPustaka(v, { opsi: { lentera: { warnaNyala: "zamrud" } } }): lantai, dua rak buku, meja bundar, lima bangku, lima figur duduk (kursi1..5), lima lentera.
lentera({ tali: 0.3, warnaNyala: "zamrud" }) x 4: lentera tambahan di depan rak, bernama lentera 6 sampai lentera 9.
panelKertas({ lebar: 1.6, tinggi: 1.4, miring: 0, nama: "kanal komisariat", warna: W.abuGelap, warnaBingkai: W.abu }): kanal komisariat, tempat terbit.
rumah({ lebar: 1.4, tinggi: 1.0, dalam: 1.2, atap: 0.55 }): komisariat. Ukurannya diperkecil supaya muat di sudut kiri depan lantai tanpa menyentuh bangku.
balonKata({ isi: "titik", skala: 0.45 }) x 8: lima balon Bagian 2 dan tiga balon Bagian 3. Titik asal di ujung ekor.
debu({ ... }) x 5: uap kecil saat balon Bagian 2 menguap.
lembarKertas({ lebar: 0.4, panjang: 0.5, garis: 3, rebah: false, miring: 0 }) x 3: tulisan kader.
buku({ berdiri: true, tinggi: 0.5, lebar: 0.38, tebal: 0.1, warna: W.zamrud }) x 3: buku yang masuk rak.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "14", kategori: "PENGETAHUAN", judul: "Tradisi intelektual HMI memudar.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Diskusi berlangsung, tetapi **tidak ada yang ditulis**, jadi gagasannya hilang begitu forum bubar."
ikhtiar:
{ teks: "**Ruang Karya Kader** memberi tempat terbit bagi tulisan dan kajian kader, sekecil apa pun.", masuk: [13.6, 14.1], keluar: [17.4, 17.8] }
{ teks: "Karya tercatat dan terhitung, sehingga tradisinya bisa dilihat, bukan hanya diklaim.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 09".
kuis: { pertanyaan: "Dalam tiga bulan terakhir, berapa tulisan atau kajian yang dihasilkan kader komisariatmu?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“KANAL KOMISARIAT” pada kanal, geser [0, 1.7, 0], gaya kotak, kelas: "zamrud", skala 0.58, masuk 0.9, keluar 22.6 sampai 23.0 (sama dengan video lama, ditambah jendela keluar).
F. Dunia dan Posisi
Dunia dasar duniaPustaka dengan satu penyesuaian: nyala lentera berwarna zamrud. Benda: lantai di titik(0, 0) (permukaan y 0.1), rakKiri di titik(-2.6, -2.8, 0.1), rakKanan di titik(2.4, -2.9, 0.1), meja di titik(0, 1.0, 0.1), bangku1..5 dan kursi1..5 pada radius 1.8 dari meja, lentera1..5 dengan pusat bola di y 3.0.
Titik dunia yang dipakai: d.titik.meja, d.titik.kursi[i], d.titik.atasKepala[i], d.titik.rakKanan.
Benda tambahan dan posisinya:
Lentera tambahan i (i = 0 sampai 3): di rak.position + titik(i % 2 === 0 ? -0.85 : 0.85, 0.7), y 2.3, dengan rak = rakKiri untuk i 0 dan 1, rakKanan untuk i 2 dan 3. Urutan lentera dalam daftar lampu: indeks 0 sampai 4 = lentera1..5, indeks 5 sampai 8 = lentera tambahan.
Kanal: titik(3, 2.4, 0.1). Bawaan hadap sudah menghadap kamera.
Komisariat: titik(-3.1, 2.7, 0.1), di sudut kiri depan lantai. Pintu di muka +z.
Balon Bagian 2: ujung ekor di d.titik.atasKepala[i], naik 1.0 unit lurus ke atas.
Balon Bagian 3: ujung ekor di d.titik.atasKepala[i] untuk kursi1, kursi3, kursi5 (indeks 0, 2, 4).
Tempat lembar di kanal: tiga titik di muka kanal, geser lokal x −0.5, 0, 0.5 dari pusat muka, tegak, 0.05 di depan muka. Hitung titik dunianya dengan kanal.userData.bagian.muka.localToWorld(...) sesudah kanal.updateMatrixWorld(true). Lembar sudah menghadap kamera lewat hadap bawaannya.
Tempat buku di rak: di depan buku rak kanan, pada lantai rak yang paling dekat dengan setengah tinggi rak (d.benda.rakKanan.userData.lantaiRak), berjajar di geser x lokal rak −0.3, 0, 0.3, maju 0.1 dari muka rak. Buku diputar y 45 derajat supaya sejajar muka rak.
Pengecualian zona:
lantai, rakKiri, dan lentera 6 dan 7: userData.penting = (t) => t < 6.0.
rakKanan, kanal, lentera 8 dan 9, dan lentera1..5: userData.penting = (t) => !(t > 6.0 && t < 13.0).
Komisariat: userData.penting = (t) => t < 6.0 || t >= 23.0.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-14/adegan.js. Dunia, benda, posisi, dan waktunya sama persis. Komisariat ditambahkan.
0.6 sampai 1.6: semua benda dunia kecuali kursi1..5, keempat lentera tambahan, kanal, dan komisariat muncul (muncul([...], { t: 0.6, selesai: 1.6, durasi: 0.4 })). Figur duduk kursi1..5 belum tampak, jadi lima bangku kosong. Rak, meja, dan komisariat abu penuh.
0.9: label KANAL KOMISARIAT masuk.
0.6 sampai 1.6: kesembilan lentera redup (nyala 0.4).
1.6 sampai 5.95: lentera padam satu per satu dengan urutan indeks [8, 5, 7, 6, 4, 1, 3, 2, 0]. Lentera ke-n dalam urutan itu turun dari 0.4 ke 0 pada 1.6 + 0.5n sampai 1.95 + 0.5n. Lampu di tepi rak padam lebih dulu, lentera1 di atas meja padam terakhir.
Bangku tetap kosong sampai 6.0.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.3: lima figur duduk (kursi1..5) muncul di bangku (jeda 0.15, durasi 0.4). Diskusi berlangsung.
7.0 sampai 11.8: meja berdenyut (denyutCermin(d.benda.meja, { mulai: 7.0, selesai: 11.8 })).
7.4 sampai 11.9: lima balon naik dari kursi indeks 0, 2, 4, 1, 3 pada t 7.4, 8.2, 9.0, 9.8, 10.6. Setiap balon muncul di atas kepala (durasi 0.3), lalu lintas naik 1.0 unit (mulai t + 0.3, durasi 1.0), dan menguap: aturOpasitas 1 ke 0 dari t + 0.8 sampai t + 1.3. Bersamaan, debu({ pusat: puncak balon, mulai: t + 0.8, selesai: t + 1.3, jumlah: 6, sebar: 0.3, naik: 0.4, benih: 20 + i }).
11.6 sampai 12.2: kelima figur duduk hilang (jeda 0.1). Forum bubar.
12.2 sampai 13.0: adegan diam. Bangku kosong, meja kosong, lentera padam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.8: kelima figur duduk muncul lagi (jeda 0.12). Diskusi berikutnya.
13.4 sampai 14.2: abu meja dilepas dari 1 ke 0.
14.0 sampai 17.0: tiga balon dari kursi1, kursi3, kursi5 pada t 14.0, 14.8, 15.6. Setiap balon muncul (durasi 0.3), berubah menjadi lembar tulisan di tempatnya (gantiBenda(balon, lembar, { t: t + 0.4, durasi: 0.3 })), lalu lembar lintas ke tempatnya di muka kanal (mulai t + 0.7, durasi 0.7, lengkung: true, titik tengah dinaikkan 1.0). Lembar tiba 15.4, 16.2, 17.0 dan menempel berjajar di kanal.
17.0 sampai 18.0: adegan tetap. Kalimat ikhtiar pertama keluar 17.4 sampai 17.8.
18.0 sampai 21.0: lembar i berubah menjadi buku di kanal (gantiBenda(lembar[i], buku[i], { t: 18.0 + i, durasi: 0.4 })), lalu buku lintas ke tempatnya di rak kanan (mulai 18.4 + i, durasi 0.6, lengkung: true, titik tengah dinaikkan 1.0). Buku tiba 19.0, 20.0, 21.0.
Setiap buku tiba, satu lentera menyala zamrud: lentera1 pada 19.0 sampai 19.4, lentera2 pada 20.0 sampai 20.4, lentera3 pada 21.0 sampai 21.4 (nyala 0 ke 0.9). Lentera lain tetap padam.
21.2: buku ketiga klikEmas.
21.4 sampai 22.2: abu kedua rak dilepas dari 1 ke 0.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (PENGETAHUAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Debu Bagian 2 sudah selesai 11.9. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.6 + 0.5n: padam (kuat 0.65) di lentera yang padam (sama dengan video lama);
7.4, 8.2, 9.0, 9.8, 10.6: balon (kuat 0.35) di setiap balon Bagian 2;
15.4, 16.2, 17.0: kertas (kuat 0.4) saat lembar menempel di kanal;
19.0, 20.0, 21.0: menyala (kuat 0.5) di lentera yang menyala.
Tidak ada figur yang berjalan, jadi tidak ada langkah yang perlu diredam.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di lembar, buku, atau kanal, termasuk hitungan karya. “Terhitung” ditunjukkan lewat lentera yang menyala satu per satu, bukan angka.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML. Isi balon hanya tiga titik.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-14-v2 --periksa, lalu lihat hasil/gambar/indikator-14-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.8,10.0,15.0,19.3,22.0 bila titik bawaan tidak pas):
3: bangku kosong, tiga lentera rak sudah padam, lentera lain masih redup;
5.8: hampir semua lentera padam, lentera1 sedang padam terakhir;
10.0: kamera dekat ke meja, lima figur duduk, balon ketiga sedang naik dan menguap, meja berdenyut, kalimat sebab terbaca;
15.0: figur duduk kembali, balon pertama sudah menjadi lembar dan meluncur ke kanal, kalimat ikhtiar pertama terbaca;
19.3: buku pertama sudah di rak kanan, lentera1 menyala zamrud, lembar kedua sedang menjadi buku, kalimat ikhtiar kedua terbaca;
22.0: buku ketiga emas di rak, tiga lentera menyala zamrud, baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-14-v2. Hasilnya hasil/video/indikator-14-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, warna nyala lentera, letak lantai rak), lalu hasil zona, warna, LUFS, dan sinkron.
