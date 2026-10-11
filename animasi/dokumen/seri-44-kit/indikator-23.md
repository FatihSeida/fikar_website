Prompt Animasi Indikator 23 dari 44
Judul indikator: HMI kehilangan figur panutan.
Kelompok Tata Kelola. Mode Pandangan. Program terkait 02 Jaringan Pendamping dan Instruktur dan 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-23/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-23 --format evidence --judul "HMI kehilangan figur panutan.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-23/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: alas patung dan komisariat abu penuh. Kader berwarna pion. Sorot memakai warna bawaan kerucutSorot.
Bagian 2: balon cerita berwarna kertas yang makin samar. Alas patung kosong mendapat denyutCermin sebagai satu titik masalah. Tidak ada emas.
Bagian 3: garis waktu berwarna zamrud (proses). Kartu langkah berwarna kertas, dua di antaranya abu sebagai tanda kegagalan yang ikut dicatat. Emas hanya untuk satu rantai hasil: garis waktu perjalanan sesudah pendamping dan kader selesai menyusurinya. Alas patung tetap abu dan kosong. Komisariat melepas abu di akhir.
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
fokus: titik(0, 0, 1.0);
gejala: { muat: [alas, komisariat, ...kader, alas.position.clone().setY(4.0)] };
sebab: { muat: [alas, ...kader, kader[2].position.clone().setY(1.8), kader[4].position.clone().setY(1.8)], H: 9 };
ikhtiar: { muat: [alas, garis, komisariat], H: 11 };
tambahan: [{ t: [17.4, 18.4], muat: [garis, titikMulai, titikAkhirPendamping, komisariat], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
alasPatung(): alas patung kosong, 1.6 x 0.4 x 1.6 dan 1.0 x 1.2 x 1.0 plus tutup (userData.atas). Tidak ada patung atau figur di atasnya, sepanjang video.
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7.
pion() x 5: kader baru.
kerucutSorot({ tinggi: 3.0, radiusBawah: 0.6, opasitas: 0.12 }): sorot lembut yang jatuh ke alas kosong.
balonKata({ isi: "kabur", skala: 0.45, benih: 23 }): balon cerita lisan yang berpindah dari kader ke kader.
garisWaktu({ panjang: 6.0, jarak: 1.2, label: false, panah: true }): garis waktu perjalanan dengan lima penanda, tanpa label (userData.titikPeriode(i)).
kartuProker({ garis: 2, kaki: true, skala: 0.4 }) x 5: kartu langkah.
pionPendamping(): pendamping (cincin aktif dan lencana bawaan).
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "23", kategori: "TATA KELOLA", judul: "HMI kehilangan figur panutan.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Teladan hanya dikenal **dari cerita lisan** yang makin kabur, tanpa catatan perjalanan yang bisa dipelajari."
ikhtiar:
{ teks: "HMI Evidence memandang panutan lahir dari **perjalanan yang terdokumentasi**, termasuk kegagalannya.", masuk: [13.6, 14.1], keluar: [17.6, 18.0] }
{ teks: "Karena itu **Jaringan Pendamping** dan **Arsip Organisasi** mencatat perjalanan kader dan alumni agar bisa dipelajari.", masuk: [18.2, 18.7], keluar: [22.6, 23.0] }
program: "Program 02 · Program 10".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Tidak memakai dunia dasar kit. Tanah bergrid bawaan dengan alun-alun kosong. Alas patung dari prompt lama digeser sedikit ke kiri supaya ada ruang untuk komisariat dan garis waktu.
Benda dan posisinya:
Alas patung: di titik(-1.0, -1.0), rotasi 0. Puncak alas: posisi alas + y userData.atas.
Komisariat: rumah() di titik(2.6, -1.4), rotasi 0 (pintu di muka +z).
Kader 1 sampai 5 (kader[0] sampai kader[4]): melingkari alas pada radius 1.8, di posisi alas + titik(1.8 cos a, 1.8 sin a) dengan sudut layar a = 0, 40, 140, 180, dan 230 derajat (0 = kanan, 90 = bawah). Sudut sekitar 90 dan 270 derajat dihindari supaya figur tidak saling menutupi dengan alas. Semua menghadap alas (rotasi y diarahkan ke pusat alas).
Sorot: titik asal di puncak alas.
Balon cerita: titik asal ekor di atas kepala kader (posisi kader + y 1.15). Urutan perpindahan kader[0], kader[1], kader[2], kader[3], kader[4].
Garis waktu: pusat di titik(0.6, 2.0), memanjang ke kanan layar dari r -2.4 sampai 3.6 (sejajar layar, bawaan). Bila titikPeriode(i) mengembalikan titik lokal, ubah dengan garis.localToWorld(...).
Kartu langkah i (i = 0 sampai 4): di titikPeriode(i) + titik(0.6, 0), di atas pita, menghadap kamera. Kartu i = 1 dan i = 3 abu (kegagalan).
titikMulai = titik(-2.0, 1.4), di belakang pita (atas layar), dekat ujung kiri garis waktu.
Kader muda: kader[2] (sudut 140 derajat, paling dekat ke ujung kiri garis waktu) berjalan ke titikMulai.
Pendamping: muncul di titikMulai + titik(0.5, 0). titikAkhirPendamping = titik(3.0, 1.4). Kader muda berhenti di titik(2.5, 1.4), di belakang pendamping.
Pengecualian zona: komisariat boleh terpotong selama sebab ((t) => !(t > 6.0 && t < 13.0)). kerucutSorot sudah penting: false bawaan.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.8: alas patung dan komisariat muncul (muncul([alas, komisariat], { t: 0.6, selesai: 1.2 })), lalu lima kader muncul di lingkarannya, menghadap alas (muncul(kader, { t: 1.2, selesai: 1.8, naik: 0 })). Alas dan komisariat abu penuh sejak awal.
2.0 sampai 3.0: sorot lembut turun ke puncak alas (aturOpasitas(sorot, 0 ke 1) di setiapFrame). Di bawah sorot tidak ada apa pun.
3.0 sampai 6.0: kader berdiri menghadap alas yang kosong. Sorot tetap menyala di atas alas kosong.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.4: sorot memudar ke 0.
7.0 sampai 7.3: balon cerita muncul di atas kepala kader[0]. Balon tidak memakai muncul dan hilang, karena aturOpasitas di setiapFrame berjalan sesudah gerak standar dan menimpa keduanya. Seluruh opasitas balon disetel di setiapFrame: aturOpasitas(balon, f(t)), dengan f = 0 sebelum 7.0, naik 0 ke 1.0 pada 7.0 sampai 7.3, lalu mengikuti baris di bawah.
7.6 sampai 11.3: balon berpindah dari kepala ke kepala seperti cerita dari mulut ke mulut (busur, tinggi 0.6, durasi 0.7): ke kader[1] 7.6 sampai 8.3, ke kader[2] 8.6 sampai 9.3, ke kader[3] 9.6 sampai 10.3, ke kader[4] 10.6 sampai 11.3. Setiap busur memakai dari: kepala kader sebelumnya, karena busur tanpa dari mulai dari posisi dasar balon (di atas kader[0]) dan menggantikan busur sebelumnya: busur(balon, { t: 8.6, dari: kepala kader[1], ke: kepala kader[2], tinggi: 0.6, durasi: 0.7 }) dan seterusnya; lompatan pertama (7.6) boleh tanpa dari. kepala kader[i] = posisi kader[i] + titik(0, 0, 1.15).
Setiap perpindahan, balon makin samar (aturOpasitas di setiapFrame): 1.0, lalu 0.8, 0.6, 0.4, dan 0.2, masing-masing turun halus selama busurnya. f tetap di antara dua busur.
11.6 sampai 12.0: balon hilang (f turun 0.2 ke 0, tanpa fungsi hilang).
10.4 sampai 12.6: denyutCermin(alas, { mulai: 10.4, selesai: 12.6 }). Tidak ada catatan perjalanan yang bisa dipelajari.
12.6 sampai 13.0: adegan diam.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.4 sampai 14.0: garis waktu muncul di bawah lingkaran kader. Alas patung tetap kosong dan abu.
14.2 sampai 16.4: lima kartu langkah muncul berurutan di atas pita (muncul(kartu, { t: 14.2, jeda: 0.45, durasi: 0.4, naik: 0 })). Kartu kedua dan keempat abu sejak muncul (setelKeadaan(kartu, "abu", 1)), sebagai langkah gagal yang tetap tercatat.
17.2 sampai 18.0: kader[2] berjalan dari lingkaran ke titikMulai (jalan, durasi 0.8, bunyi: { kuat: 0.25 }).
17.6 sampai 18.0: pendamping muncul di samping kanannya (naik: 0).
18.4 sampai 21.8: pendamping dan kader[2] berjalan bersama menyusuri garis waktu, di belakang pita, dari kiri ke kanan (jalan, durasi 3.4, mulai bersamaan, bunyi: { kuat: 0.25 }). Pendamping berhenti di titikAkhirPendamping, kader[2] berhenti 0.5 di belakangnya.
21.9: klikEmas(garis). Garis waktu perjalanan menjadi emas.
22.0 sampai 22.8: abu komisariat dilepas dari 1 ke 0.
22.8 sampai 23.0: adegan diam. Alas patung tetap kosong dan abu. Empat kader lain tetap di lingkaran. Jangan menampilkan rombongan yang ikut berjalan.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
7.0: balon (kuat 0.4) saat balon cerita muncul, posisi kader[0];
11.6: padam (kuat 0.3) saat balon cerita hilang, posisi kader[4];
13.4: garis-sambung (durasi 0.6) saat garis waktu terpasang, posisi garis waktu.
busur balon cerita memakai bunyi: { kuat: 0.3 }. Langkah figur dibisukan sebagian: bunyi: { kuat: 0.25 }.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada patung, figur, atau bentuk tokoh di atas alas patung, di detik mana pun.
Tidak boleh ada teks terbaca di balon atau kartu. Isi balon hanya pola kabur. Tidak ada angka.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-23 --periksa, lalu lihat hasil/gambar/indikator-23/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: lima kader melingkari alas abu yang kosong, sorot menyala di atas alas;
5.5: adegan sama, tidak ada apa pun di atas alas;
9.5: kamera dekat, balon cerita di atas kader ketiga sudah lebih samar, kalimat sebab terbaca;
14.5: garis waktu di bawah lingkaran, kartu langkah pertama muncul, kalimat pandangan pertama terbaca;
18.7: pendamping dan kader berjalan di awal garis waktu, satu kartu abu tampak di depan mereka;
22.5: garis waktu emas, pendamping dan kader di ujung kanan, alas tetap kosong, kalimat pandangan kedua dan baris program terbaca.
Kalimat pandangan pertama panjang. Bila konsol memberi peringatan lebih dari 3 baris, laporkan; jangan mengubah teks.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-23. Hasilnya hasil/video/indikator-23.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona), lalu hasil zona, warna, LUFS, dan sinkron.
