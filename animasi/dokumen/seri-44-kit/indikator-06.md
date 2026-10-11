Prompt Animasi Indikator 06 dari 44
Judul indikator: Komisariat belum optimal dalam rekrutmen dan pembinaan anggota.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 01 Sistem Kaderisasi Berkelanjutan dan 02 Jaringan Pendamping dan Instruktur.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-06-v2/. Folder lama animasi/proyek/indikator-06/ jangan diubah, tetapi wajib dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-06-v2 --format evidence --judul "Komisariat belum optimal dalam rekrutmen dan pembinaan anggota.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-06-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat (ruang terpotong) abu penuh. Kader baru berwarna pion, lalu pudar saat keluar pintu belakang.
Bagian 2: tiga kader baru memudar perlahan. Lingkaran tempat pendamping berwarna abu. Satu titik masalah boleh berdenyut zamrud: ketiga lingkaran kosong (denyutCermin). Tidak ada emas.
Bagian 3: pendamping, garis penghubung, dan kartu catatan perjalanan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: cincin kaki ketiga kader baru (aktif). Komisariat melepas abu sesudahnya.
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
gejala: { muat: [d.benda.gerbang, d.benda.komisariat, d.titik.luarBelakang] } (H dihitung otomatis, perkiraan sekitar 14);
sebab: { muat: [kader1, kader3, lingkaran1, d.titik.pintu], H: 9 };
ikhtiar: { muat: [kader1, kader3, pendamping1, kartu1, kartu3, d.titik.pintu], H: 11 };
tambahan: [{ t: [20.2, 21.0], muat: [kader1, kader3, kartu1, kartu3, d.benda.komisariat], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaKader(v, { potong: true, opsi: { komisariat: { garisAtap: false } } }): dunia Kader dengan komisariat terpotong (rumahPotong 1.4 kali), garis atap mati. Sama dengan video lama.
pion() x 6: kader baru Bagian 1, tinggi sekitar 1.0 unit.
pion() x 3: kader baru Bagian 2 dan 3 (kader 1, 2, 3). Rotasi y 45 derajat, menghadap kamera.
garisPutus({ lingkaran: 0.3, warna: W.abu, lebar: 3 }) x 3: tempat pendamping yang masih kosong, di tanah y 0.02.
pionPendamping() x 3: pendamping (lencana dan cincin kaki bawaan). Rotasi y 45 derajat.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 2 }) x 3: garis penghubung pendamping dan kader.
kartuProker({ garis: 2, cek: 3, tercentang: 3, kaki: true, skala: 0.45, warna: W.zamrud }) x 3: kartu catatan perjalanan. Centangnya (userData.bagian.centang) dimunculkan satu per satu dengan muncul.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "06", kategori: "KADERISASI", judul: "Komisariat belum optimal dalam rekrutmen dan pembinaan anggota.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Kader baru masuk setelah LK 1, tetapi **tidak ada pendamping** yang jelas untuk setiap orang."
ikhtiar:
{ teks: "**Jaringan Pendamping dan Instruktur** memasangkan setiap kader baru dengan pendamping yang tercatat.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Sistem Kaderisasi Berkelanjutan** memantau perjalanan mereka sesudah latihan, bukan hanya saat latihan.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 01 · Program 02".
kuis: { pertanyaan: "Setelah LK 1, apakah setiap kader baru di komisariatmu punya pendamping yang jelas?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Dunia dasar duniaKader dengan potong: true. Benda: gerbang di titik(-2.1, -0.7), kelas di titik(-2.85, -2.9), jalan dari gerbang ke pintu depan komisariat, komisariat (rumahPotong 1.4 kali) di titik(2.3, 1.9), tangga di titik(1.2, -1.5).
Titik dunia yang dipakai: d.titik.depanPintu, d.titik.pintu, d.titik.ubin, d.titik.dalam, d.titik.pintuBelakang, d.titik.luarBelakang, d.titik.depanKomisariat.
Benda tambahan dan posisinya:
Jalur kader Bagian 1 (sama dengan video lama): UJUNG = d.titik.depanPintu digeser 0.5 ke arah ubin terakhir (d.titik.ubin.at(-1)), y 0. Kurva CatmullRomCurve3 centripetal lewat [UJUNG, depanPintu, pintu, lokal(-0.4, 0.45), dalam, lokal(0.4, -0.45), pintuBelakang, luarBelakang], semua y 0, dengan lokal(x, z) = komisariat.localToWorld(new Vector3(x, 0, z)). Untuk CatmullRomCurve3 dan Vector3, adegan.js boleh menambah satu impor: import * as THREE from "three" (seperti indikator-02-v2); impor dari kit tetap hanya dari ../../kit/index.js.
Kader 1, 2, 3: di d.titik.depanKomisariat + titik(-1.1, 0), + titik(0, 0), dan + titik(1.1, 0), sebaris sejajar layar di depan komisariat, di bawah ujung jalan.
Lingkaran kosong dan pendamping ke-i: kader ke-i + titik(-0.5, -0.2) (kiri sedikit ke belakang, supaya tidak bertumpuk seperti totem dan tidak menyentuh dinding komisariat).
Garis penghubung ke-i: titik [pendamping + y 0.55, kader + y 0.55].
Kartu catatan ke-i: kader ke-i + titik(-0.25, 0.75), di depan pasangan, menghadap kamera (hadap bawaan).
Pengecualian zona (laporkan): kelas dan tangga boleh terpotong sepanjang video (userData.penting = false), karena kamera evidence lebih dekat daripada H 16. gerbang dan jalan (t) => t < 6.0. Komisariat (t) => t < 6.0 || t >= 20.2.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-06/adegan.js, bagian Gejala. Dunia, benda, posisi, dan waktunya sama persis.
0.6 sampai 1.6: semua benda dunia muncul (muncul(d.urutan, { t: 0.6 })). Komisariat abu penuh sejak awal (setelKeadaan(komisariat, "abu", 1)).
1.6 sampai 6.5: enam kader baru datang dari ujung jalan, masuk pintu depan, melintas di tengah ruang, keluar pintu belakang. Kader ke-i: t0 = 1.6 + 0.6 * i, muncul(f, { t: t0, durasi: 0.3, naik: 0 }), jalan(f, { t: t0, jalur: kurva, laju: kurva.getLength() / 1.6, frek: 5, beku: false, bunyi: { kuat: 0.35 } }), lalu hilang(f, { t: j.selesai, durasi: 0.3 }).
Setiap kader memudar mulai 55 persen perjalanannya: setelKeadaan(f, "pudar", halus(rentang(t, t0 + 0.55 * (t1 - t0), t1 + 0.35))) di setiapFrame, dengan t1 = j.selesai. Kader terakhir hilang sekitar 6.5.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.4: kader 1, 2, 3 muncul di depan komisariat (6.6, 6.8, 7.0; durasi 0.4, naik: 0). Mereka berdiri diam, masing-masing sendirian.
7.2 sampai 7.8: tiga lingkaran kosong abu muncul di samping kiri setiap kader (jeda 0.2, naik: 0, tanpa bunyi bawaan).
8.0 sampai 12.0: ketiga kader memudar perlahan dari 0 ke 0.6 (setelKeadaan(kader, "pudar", 0.6 * halus(rentang(t, 8.0, 12.0)))).
8.4 sampai 12.8: ketiga lingkaran kosong berdenyut zamrud (denyutCermin(lingkaran, { mulai: 8.4, selesai: 12.8 })).
12.8 sampai 13.0: adegan diam. Komisariat tetap abu.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.6 sampai 14.6: pendamping muncul di dalam setiap lingkaran (13.6, 13.9, 14.2; durasi 0.4, naik: 0.3). Lingkaran di bawahnya hilang pada detik yang sama (durasi 0.4, turun: 0).
14.6 sampai 15.4: garis penghubung zamrud tergambar dari pendamping ke kader (aturTampak 0 ke 1), mulai 14.6, 14.8, 15.0, masing-masing 0.4 detik.
14.8 sampai 15.8: pudar ketiga kader kembali dari 0.6 ke 0. Tidak ada yang memudar lagi sesudah ini.
15.8 sampai 17.6: adegan tetap.
18.2 sampai 18.8: kartu catatan perjalanan muncul di depan setiap pasangan (18.2, 18.4, 18.6; durasi 0.4).
19.0 sampai 20.3: centang muncul di setiap kartu, tiga per kartu (muncul(kartu.userData.bagian.centang, { t: 19.0 + 0.4 * k, jeda: 0.12, durasi: 0.25, naik: 0, skala: 0.5, bunyi: { jenis: "centang", kuat: 0.4 } })).
20.6 sampai 21.4: cincin kaki ketiga kader menyala (setelKeadaan(kader, "aktif", halus(rentang(t, tk, tk + 0.3)))) lalu klikEmas(kader, { t: tk, lonjak: 0 }), dengan tk = 20.6, 20.8, 21.0. Hanya cincin kaki yang menjadi emas. Ini satu-satunya rantai emas.
21.4 sampai 22.2: komisariat melepas abu dari 1 ke 0.
Jangan menampilkan kader lain yang berdatangan. Tiga pasangan ini cukup.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI). Komisariat berskala dasar 1.4 mengecil ke 0.8 di segmen kuis (bawaan).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
7.2: garis-sambung (durasi 0.6, posisi lingkaran 1, sumber: "tempat kosong") saat lingkaran kosong muncul;
8.0: gemuruh pelan (kuat 0.25, durasi 4.0, posisi kader 2) selama kader memudar;
14.6: garis-sambung (durasi 0.8, posisi dari pendamping 1 ke kader 3) saat garis penghubung tergambar;
21.4: menyala (kuat 0.5, posisi komisariat) saat komisariat melepas abu.
Langkah keenam kader Bagian 1 dibisukan sebagian: bunyi: { kuat: 0.35 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka atau nama di kartu catatan. Isinya garis dan centang saja.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada rombongan kader baru yang berbondong masuk sesudah ikhtiar.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-06-v2 --periksa, lalu lihat hasil/gambar/indikator-06-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: kader pertama sudah di ambang pintu belakang dan mulai pudar, kader kedua di tengah ruang, komisariat abu;
5.5: kader keempat atau kelima keluar pintu belakang dan memudar, kader sebelumnya sudah hilang;
9.5: kamera dekat, tiga kader berdiri sendirian dan mulai pudar, tiga lingkaran kosong berdenyut zamrud, kalimat sebab terbaca;
14.9: pendamping sudah di dalam ketiga lingkaran, garis penghubung mulai tergambar, kalimat ikhtiar pertama terbaca;
19.9: tiga kartu catatan berdiri di depan pasangan, centang kartu pertama dan kedua sudah muncul;
22.1: cincin kaki ketiga kader emas, komisariat utuh di bingkai (kunci tambahan), kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-06-v2. Hasilnya hasil/video/indikator-06-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, letak kader bila depanKomisariat membuat pasangan menyentuh dinding atau jalan), lalu hasil zona, warna, LUFS, dan sinkron.
