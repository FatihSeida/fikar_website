Prompt Animasi Indikator 28 dari 44
Judul indikator: Kader pemecah masalah kurang berkembang dibandingkan kader penggalang solidaritas.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 08 Kurikulum Keterampilan Kader dan 09 Ruang Karya Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-28/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-28 --format evidence --judul "Kader pemecah masalah kurang berkembang dibandingkan kader penggalang solidaritas.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-28/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Panggung, orator, dan kerumunan berwarna normal di bawah kerucut sorot krem transparan. Pojok kerja (meja kecil, pekerja, kertas) diredupkan pudar 0.6 sehingga hampir tidak terlihat.
Bagian 2: pojok kerja tetap redup (pudar 0.45 supaya ikon retak terbaca). Ikon retak abu bawaan. Meja kecil boleh berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: pojok kerja melepas redupnya. Sorot kedua krem transparan. Ikon keterampilan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: lembar karya yang masuk rak. Komisariat melepas abu sesudahnya.
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
fokus: titik(0, 0, 0.8);
gejala: { muat: [panggung, kerumunan, mejaKecil, pekerja, komisariat] } (perkiraan H sekitar 14);
sebab: { muat: [orator, mejaKecil, pekerja, ikonRetak], H: 10 };
ikhtiar: { muat: [mejaKecil, pekerja, titikIkonTengah, rak], H: 11 };
tambahan: [{ t: [20.2, 21.0], muat: [mejaKecil, rak, komisariat], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikIkonTengah dijelaskan di bagian F.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6, atap 0.7.
panggung({ lebar: 3.0, tinggi: 0.4, dalam: 2.0 }): panggung, tangga di muka +z. userData.atas = permukaan atas.
pionOrator(): orator dengan pengeras suara.
kerumunan({ jumlah: 8, susunan: "baris", kolom: 4, hadapPusat: false, benih: 28 }): delapan figur dalam dua baris. userData.bagian.pion berisi kedelapan pion.
kerucutSorot({ tinggi: 4, radiusBawah: 1.4 }): sorot pertama ke orator. kerucutSorot({ tinggi: 3.5, radiusBawah: 1.0 }): sorot kedua ke meja kecil. Keduanya penting: false bawaan.
mejaKecil({ lebar: 1.0, tinggi: 0.6, dalam: 0.6 }): meja kerja di pojok, tinggiAtas 0.6.
pion(): pekerja di belakang meja kecil.
tumpukanKertas({ jumlah: 12, tumpukan: 3, ukuran: [0.22, 0.03, 0.28], sebar: 0.35, benih: 8 }): kertas di meja kecil. userData.tataAcak[i] dan tataRapi[i] dipakai untuk merapikan.
ikonRetak(): masalah yang dikerjakan, userData.bagian.belahan[0..1].
ikonBuku(), ikonGrafik({ tinggi: [0.4, 0.65, 1] }), dan centang({ ukuran: 0.4, hadapKamera: true }): ikon riset, literasi data, dan uji solusi.
lembarKertas({ rebah: false, garis: 4, skala: 0.5 }): lembar karya.
rakKecil({ lebar: 1.2, tinggi: 1.2, dalam: 0.4, rak: 2 }): rak karya. userData.titikRak(i).
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "28", kategori: "KADERISASI", judul: "Kader pemecah masalah kurang berkembang dibandingkan kader penggalang solidaritas.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Kerja memecahkan masalah **tidak pernah dicatat dan dihargai**, sementara kerja menggalang massa selalu terlihat."
ikhtiar:
{ teks: "**Kurikulum Keterampilan Kader** melatih riset, literasi data, dan cara menguji solusi.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Ruang Karya Kader** mencatat dan menghargai hasilnya, sehingga kerja sunyi ini ikut terlihat.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 08 · Program 09".
kuis: { pertanyaan: "Pernahkah komisariatmu mengkaji persoalan nyata di sekitar kampus, lalu menuliskan usulan solusinya?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“RUANG KARYA”: label3D("RUANG KARYA", { pada: rak, geser: [0, 1.45, 0], gaya: "benda" }), masuk 18.0 sampai 18.4, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia ini tidak memakai dunia dasar kit. Semua benda ditaruh langsung di tanah bergrid.
Panggung: titik(-1.6, -1.4), sejajar sumbu dunia (lebar 3.0 di sumbu x, dalam 2.0 di sumbu z), tangga di muka +z (kiri bawah layar).
Orator: di pusat permukaan panggung (panggung.userData.atas), rotasi y 0 sehingga menghadap +z ke arah kerumunan.
Sorot pertama: titik asalnya di pusat permukaan panggung (y 0.4), sehingga kolam cahaya jatuh di sekitar orator.
Kerumunan: pusat di titik(-2.6, 0.9), dua baris sejajar layar, di depan muka bertangga panggung. Setiap pion diputar y menghadap orator.
Komisariat: komisariat = v.tambah(rumah()) di titik(2.4, -1.8), di kanan atas, bebas dari panggung.
Pojok kerja (kanan bawah):
Meja kecil: titik(2.4, 1.6), sejajar sumbu dunia.
Pekerja: meja kecil + titik(0, -0.75), di belakang meja, rotasi y 45 derajat (menghadap kamera).
Tumpukan kertas: di pusat permukaan meja kecil (y 0.6). Mulai dari susunan acak (tataAcak).
Ikon retak: meja kecil + titik(0, 0, 1.1), melayang di atas meja di depan dada pekerja. Kedua belahan mula-mula terpisah 0.12 unit masing-masing ke kiri dan kanan dari kedudukan utuhnya (sumbu x lokal).
Sorot kedua: titik asal di pusat meja kecil, y 0.
Ikon keterampilan: pekerja + titik(-0.6, 0, 1.6) (buku), + titik(0, 0, 1.8) (grafik), + titik(0.6, 0, 1.6) (centang). titikIkonTengah = pekerja + titik(0, 0, 1.8).
Rak karya: titik(1.0, 2.6), rotasi y 45 derajat (muka +z menghadap kamera). Tujuan lembar karya: rak.localToWorld(rak.userData.titikRak(1)) (panggil rak.updateMatrixWorld(true) sesudah menaruh rak).
Pengecualian zona: panggung, orator, kerumunan, dan sorot pertama boleh terpotong sesudah 13.0 (userData.penting = (t) => t < 13.0). komisariat boleh terpotong 6.0 sampai 20.2 ((t) => t < 6.0 || t >= 20.2). Kelompok kerumunan diberi aturan yang sama untuk semua pionnya.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 2.0: panggung, orator, sorot pertama, kedelapan pion kerumunan, pojok kerja (meja kecil, pekerja, tumpukan kertas), dan komisariat muncul (muncul([panggung, orator, sorot1, ...kerumunan.userData.bagian.pion, mejaKecil, pekerja, tumpukan, komisariat], { t: 0.6, selesai: 2.0 })). Komisariat abu penuh sejak awal.
Pojok kerja diredupkan sejak awal: setelKeadaan(benda, "pudar", 0.6) untuk meja kecil, pekerja, dan tumpukan kertas di v.setiapFrame.
2.0 sampai 6.0: kerumunan bergoyang serempak dengan periode 0.6 detik. Di v.setiapFrame, rotation.z setiap pion = 0.06 x sin(2π (t − 2.0) / 0.6) x halus(rentang(t, 2.0, 2.3)) x (1 − halus(rentang(t, 21.8, 22.4))).
2.0 sampai 5.8: pekerja merapikan kertas di pojok yang redup. Kertas ke-i (i = 0 sampai 11) melompat kecil dari susunan acak ke susunan rapi pada 2.0 + 0.32i (busur(kertas[i], { t, ke: tataRapi[i].posisi, putar: tataRapi[i].putar - tataAcak[i].putar, tinggi: 0.2, durasi: 0.3 })). Hampir tidak terlihat karena redup.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: redup pojok kerja turun dari 0.6 ke 0.45, supaya kerja pekerja sedikit terbaca tetapi tetap di sudut gelap.
6.8 sampai 7.3: ikon retak abu muncul di atas meja kecil (muncul, naik 0.2), kedua belahan masih terpisah.
7.4 sampai 11.4: kedua belahan perlahan didekatkan dari terpisah 0.12 ke 0.06 (setel posisi x belahan di v.setiapFrame dari halus(rentang(t, 7.4, 11.4))). Kerja ini berlangsung tanpa sorot.
6.0 sampai 12.6: kerumunan tetap bergoyang di bawah sorot (rumus bagian G Bagian 1 nomor 3).
8.0 sampai 12.6: denyutCermin(mejaKecil, { mulai: 8.0, selesai: 12.6 }). Ini satu-satunya titik masalah: kerja yang tidak terlihat.
12.6 sampai 13.0: adegan diam selain goyang kerumunan.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 14.2: redup pojok kerja dilepas dari 0.45 ke 0.
14.0 sampai 14.6: sorot kedua turun ke meja kecil (muncul(sorot2, { t: 14.0, durasi: 0.6, naik: -0.8 }), yaitu masuk dari atas).
14.8 sampai 15.8: tiga ikon keterampilan muncul di atas pekerja berurutan, buku, grafik, lalu centang (muncul, jeda 0.3, naik 0.3). Ketiga batang grafik tumbuh 15.2 sampai 16.1 (tumbuh, sumbu y). Tidak ada angka.
16.2 sampai 17.4: ikon diam di atas pekerja, kalimat ikhtiar pertama terbaca.
17.4 sampai 17.9: ketiga ikon meluncur ke ikon retak lalu hilang ke dalamnya (lintas, durasi 0.4, jeda 0.05; hilang saat tiba).
17.4 sampai 18.0: kedua belahan ikon retak menyatu penuh (jarak 0.06 ke 0).
18.2 sampai 18.6: ikon retak yang sudah utuh berubah menjadi lembar karya (gantiBenda(ikonRetak, lembarKarya, { tempat: true })). Rak karya muncul di bawah tengah layar 18.0 sampai 18.5, label “RUANG KARYA” masuk 18.0.
18.8 sampai 19.8: lembar karya melayang ke rak (busur, tinggi 1.0, durasi 1.0) dan berdiri di rak tingkat kedua.
20.0: klikEmas(lembarKarya).
20.6 sampai 21.4: abu komisariat dilepas dari 1 ke 0.
21.8 sampai 22.4: goyang kerumunan berhenti (faktor terakhir rumus goyang). Sorot pertama tetap menyala. Jangan menampilkan kerumunan yang berpindah ke pojok kerja. Itu klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kelompok: "pengetahuan", kamera: { ...bagian C } }). Kategori video ini KADERISASI, tetapi kuisnya mengukur kelompok pengetahuan, jadi kelompok: "pengetahuan" wajib ditulis. Lengkung PENGETAHUAN yang berdenyut.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
2.0: gemuruh sangat pelan (kuat 0.2, durasi 4.0, posisi kerumunan) sebagai riuh kerumunan;
14.0: menyala (kuat 0.5, posisi meja kecil) saat sorot kedua turun;
18.0: garis-sambung pelan (kuat 0.4, durasi 0.4, posisi ikon retak) saat kedua belahan menyatu;
19.8: kayu (kuat 0.5, posisi rak) saat lembar karya berdiri di rak.
Bunyi lempar dan mendarat dari kedua belas kertas Bagian 1 dibisukan sebagian: bunyi: { kuat: 0.2 } pada busur kertas.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada spanduk, poster, atau tulisan di panggung. Orator tidak boleh tampak sebagai tokoh tertentu.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Kerumunan dan orator tidak boleh digambar buruk atau diejek. Kerja menggalang tetap digambar wajar; yang dikoreksi hanya kerja pemecah masalah yang tidak terlihat.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-28 --periksa, lalu lihat hasil/gambar/indikator-28/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: orator di bawah sorot, kerumunan bergoyang, pojok kerja redup di kanan bawah;
5.5: sebagian kertas di pojok sudah rapi, pojok tetap hampir tidak terlihat;
9.5: kamera mencakup orator dan meja kecil, ikon retak abu dengan belahan yang mulai mendekat, meja kecil berdenyut, kalimat sebab terbaca;
14.5: pojok sudah tidak redup, sorot kedua turun ke meja kecil, kalimat ikhtiar pertama terbaca;
19.1: lembar karya sedang melayang ke rak, label RUANG KARYA tampak;
20.3: lembar karya emas berdiri di rak, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-28. Hasilnya hasil/video/indikator-28.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, benda lokal, arti naik negatif pada sorot kedua).
