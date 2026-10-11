Prompt Animasi Indikator 39 dari 44
Judul indikator: Perbuatan buruk sebagian kader atau alumni merusak citra seluruh HMI.
Kelompok Tata Kelola. Mode Ikhtiar. Program terkait 11 Pemeriksaan Kepatuhan Konstitusi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-39/. Jangan mengubah folder video lain.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-39 --format evidence --judul "Perbuatan buruk sebagian kader atau alumni merusak citra seluruh HMI.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-39/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru. Bercak noda memakai warna bawaan lantaiUbin.aturNoda (sudah diturunkan dari token).
Aturan warna video ini:
Bagian 1: ubin bernoda menuju abuGelap. Komisariat memudar ke abu dari 0 ke 1 selama noda menjalar, dan abu penuh pada 6.0.
Bagian 2: lembar penutup berwarna abu (setelKeadaan(lembar, "abu", 1)) dan menjadi satu-satunya titik masalah yang berdenyut (denyutCermin). Tidak ada emas.
Bagian 3: timbangan dan pagar berwarna zamrud (proses), lembar catatan berwarna kertas. Emas hanya untuk satu rantai hasil: batang pagar di sekeliling ubin asal. Komisariat melepas abu sesudah pagar menjadi emas.
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
fokus: titik(0, -0.8, 0.6);
gejala: { muat: [lantai, komisariat] } (perkiraan H sekitar 12);
sebab: { muat: [lantai, komisariat], H: 10 };
ikhtiar: { muat: [lantai, komisariat, timbangan, lembarCatatan, titikMendarat], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikMendarat adalah tujuan lembar penutup pada G Bagian 3 nomor 2.
D. Benda yang Dipakai
Dari kit:
lantaiUbin({ n: 5, ukuran: 0.95, tinggi: 0.08, jarak: 1 }): lantai 5 x 5 ubin zamrudRedup. Penyetel di lantai.userData: aturNoda(i, j, k), aturSemuaNoda((i, j) => k), jarakDari(i0, j0, i, j), aturPagar(i, j, k), titikUbin(i, j). Ubin di bagian.ubin[j * 5 + i]. Bagian emas adalah batang pagar (bagian.pagar).
rumah(): komisariat 1.8 x 1.2 x 1.6, atap 0.7.
ikonTimbangan({ skala: 2.4 }): timbangan, tinggi sekitar 1.2 unit. bagian.balok, bagian.piring[].
lembarKertas({ rebah: false, lebar: 0.8, panjang: 1.0, garis: 4 }), skala 1.3: lembar catatan berdiri menghadap kamera. bagian.garis[] dimunculkan satu per satu.
lembarKertas({ lebar: 0.9, panjang: 0.9, garis: 0 }): lembar penutup, berbaring.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "39", kategori: "TATA KELOLA", judul: "Perbuatan buruk sebagian kader atau alumni merusak citra seluruh HMI.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Pelanggaran **ditangani diam-diam atau dibiarkan**, jadi satu perbuatan buruk terasa mewakili semua."
ikhtiar:
{ teks: "**Pemeriksaan Kepatuhan Konstitusi** memastikan pelanggaran ditangani adil, sesuai aturan, dan tercatat.", masuk: [13.6, 14.1], keluar: [18.0, 18.4] }
{ teks: "Penanganan yang jelas memisahkan perbuatan perorangan dari nama seluruh organisasi.", masuk: [18.6, 19.1], keluar: [22.6, 23.0] }
program: "Program 11".
kuis: { pertanyaan: "Jika terjadi pelanggaran etika atau aturan organisasi, bagaimana komisariatmu menanganinya?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar kit. Tanah bergrid bawaan, lalu benda di bawah ini ditaruh sendiri. Sumber tata letak Gejala adalah prompt lama animasi/dokumen/seri-44-prompt/indikator-39.md bagian F. Lantai 7 x 7 di prompt lama dikecilkan menjadi 5 x 5 dan diputar sejajar layar, karena belah ketupat 7 x 7 selebar 9.9 unit tidak muat di kamera format evidence.
Lantai: pusat di titik(0, 0.4), rotation.y = Math.PI / 4. Dengan rotasi ini kolom i bertambah ke kanan layar dan baris j bertambah ke bawah layar. Lantai menempati r −2.5 sampai 2.5 dan d −2.1 sampai 2.9. Panggil lantai.updateMatrixWorld(true) sesudah menaruhnya. Titik dunia ubin = lantai.localToWorld(lantai.userData.titikUbin(i, j)).
Ubin asal: (2, 2), tepat di tengah lantai.
Cincin dihitung dengan jarakDari(2, 2, i, j): cincin 1 berisi 8 ubin, cincin 2 berisi 16 ubin.
Cincin 2 bagian atas (8 ubin, dekat komisariat): seluruh baris j = 0, ditambah (0, 1), (4, 1), dan (0, 2).
Cincin 2 bagian bawah (8 ubin): (4, 2), (0, 3), (4, 3), dan seluruh baris j = 4.
Komisariat: titik(0, -3.5), di belakang lantai, rotasi 0. Sudut depannya sekitar 0.2 unit dari tepi belakang lantai.
Timbangan: titik(-2.4, -3.1), di kiri komisariat. Lembar catatan: titik(2.4, -3.1), di kanan komisariat, menghadap kamera (hadap bawaan).
Lembar penutup: di atas ubin asal, rotation.y = Math.PI / 4 supaya sejajar ubin. Titik awalnya ubin asal + y 1.2, titik tutupnya ubin asal + y 0.1.
titikMendarat = posisi lembar catatan + titik(0, 0.3, 0.6).
Pengecualian zona: tidak ada yang direncanakan. Bila kamera sebab memotong timbangan atau lembar catatan sebelum keduanya muncul, itu tidak dihitung karena keduanya belum tampak.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 2.0: ke-25 ubin muncul dari tengah ke tepi. Urutkan bagian.ubin menurut cincin (cincin 0, lalu 1, lalu 2), lalu muncul(urut, { t: 0.6, selesai: 2.0, durasi: 0.3, naik: 0 }).
0.6 sampai 1.1: komisariat muncul.
2.0 sampai 2.6: ubin asal mendapat noda (aturNoda(2, 2, k), k naik 0 ke 1).
2.6 sampai 4.4: noda menjalar ke cincin 1. Kedelapan ubin diurutkan acak berbenih (acak(39)). Ubin ke-m mulai pada 2.6 + 0.18m, noda naik 0 ke 1 dalam 0.5 detik.
4.2 sampai 6.0: noda menjalar ke cincin 2 bagian atas, ke arah komisariat. Ubin ke-m mulai pada 4.2 + 0.18m, durasi 0.5. Pada 6.0 ada 17 dari 25 ubin bernoda.
2.6 sampai 6.0: abu komisariat naik dari 0 ke 1 (halus(rentang(t, 2.6, 6.0))).
Semua noda disetel di satu v.setiapFrame lewat aturSemuaNoda((i, j) => ...), tanpa syarat, dari tabel waktu mulai tiap ubin.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 6.9: lembar penutup muncul di ubin asal + y 1.2 (naik: 0), abu.
6.9 sampai 7.5: lembar penutup turun menutup ubin asal (lintas, durasi 0.6). Pelanggaran ditutup diam-diam.
7.8 sampai 11.3: noda tetap menjalar ke cincin 2 bagian bawah. Ubin ke-m mulai pada 7.8 + 0.42m, durasi 0.5. Pada 11.3 semua ubin bernoda.
8.0 sampai 12.4: denyutCermin(lembarPenutup, { mulai: 8.0, selesai: 12.4 }).
11.3 sampai 13.0: adegan diam. Komisariat tetap abu penuh.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 14.0: timbangan lalu lembar catatan muncul (jeda 0.2). Balok timbangan miring 0.3 radian (bagian.balok.rotation.z disetel di v.setiapFrame). Keempat garis lembar catatan belum tampak.
14.2 sampai 15.2: lembar penutup terangkat dari ubin asal dan terbang ke titikMendarat (busur, tinggi 1.2, durasi 1.0). Noda ubin asal kembali terlihat. Pada 15.2 lembar penutup hilang (durasi 0.2) dan garis pertama lembar catatan muncul (tercatat).
15.2 sampai 16.0: balok timbangan kembali datar, 0.3 ke 0 radian (halus). Bila piring tidak ikut, cukup balok yang diputar.
16.0 sampai 16.8: pagar zamrud turun mengelilingi ubin asal (aturPagar(2, 2, k), k naik 0 ke 1).
16.8 sampai 17.6: garis kedua sampai keempat lembar catatan muncul (jeda 0.25).
18.6 sampai 19.6: cincin 1 kembali bersih (noda 1 ke 0, durasi 0.4, ubin ke-m mulai 18.6 + 0.08m).
19.6 sampai 20.6: cincin 2 kembali bersih (ke-16 ubin, durasi 0.4, ubin ke-m mulai 19.6 + 0.04m). Ubin asal tetap bernoda di dalam pagar: perbuatan perorangan tetap tercatat, tidak lagi menjalar ke nama semua.
20.8: klikEmas(lantai.userData.bagian.pagar). Batang pagar menjadi emas.
21.0 sampai 21.8: abu komisariat dilepas dari 1 ke 0, sehingga komisariat kembali berwarna zamrudRedup.
Jangan menampilkan figur siapa pun di video ini, termasuk sesudah ikhtiar.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
2.0: debu (kuat 0.4, posisi ubin asal) saat noda pertama muncul;
7.5: kertas (kuat 0.5, posisi ubin asal) saat lembar penutup menutup ubin;
16.0: garis-sambung (durasi 0.8, posisi ubin asal) saat pagar turun;
18.6: hilang pelan (kuat 0.3, posisi pusat lantai) saat ubin mulai bersih.
Video ini tanpa figur, jadi tidak ada langkah yang perlu diredam.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di lembar catatan atau di lantai. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Catatan kepekaan indikator ini, wajib dipatuhi:
tanpa figur pelaku yang digambarkan; video ini tidak memakai pion sama sekali;
tanpa kekerasan: tidak ada palu, benturan, retak, atau benda yang dihancurkan;
tanpa kesan menuduh pihak tertentu: tidak ada label, nama, tanda panah, atau sorot yang menunjuk orang atau kelompok. Noda hanya bercak di ubin.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-39 --periksa, lalu lihat hasil/gambar/indikator-39/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: lantai lengkap, ubin asal bernoda, noda mulai menjalar ke cincin 1, komisariat mulai abu;
5.5: cincin 1 bernoda penuh, noda merambat ke baris dekat komisariat, komisariat hampir abu penuh;
9.5: lembar penutup abu menutup ubin asal dan berdenyut, noda masih menjalar di cincin bawah, kalimat sebab terbaca;
14.5: timbangan miring dan lembar catatan tampak, lembar penutup sedang terbang, kalimat ikhtiar pertama terbaca;
17.1: pagar zamrud sudah turun di sekeliling ubin asal, garis lembar catatan bertambah;
21.1: pagar emas, ubin lain bersih, hanya ubin asal bernoda, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-39. Hasilnya hasil/video/indikator-39.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, ukuran lantai, benda lokal bila ada).
