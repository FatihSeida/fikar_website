Prompt Animasi Indikator 31 dari 44
Judul indikator: Pertumbuhan massa tidak diimbangi perkaderan yang intensif dan selektif.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 02 Jaringan Pendamping dan Instruktur.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-31/. Folder video lain jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-31 --format evidence --judul "Pertumbuhan massa tidak diimbangi perkaderan yang intensif dan selektif.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-31/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Sudut layar θ: 0 derajat ke kanan layar, 90 derajat ke bawah layar, sehingga titik di lingkaran berjari-jari R adalah titik(R cos θ, R sin θ).
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Pendamping dan kader baru berwarna pion. Garis beban berwarna abu.
Bagian 2: garis beban tetap abu, lalu menipis dan sebagian putus. Satu titik masalah, yaitu pendamping lama, boleh denyutCermin. Tidak ada emas.
Bagian 3: timbangan dan garis kelompok berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: timbangan yang sudah seimbang. Komisariat melepas abu sesudah timbangan menjadi emas.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Titik bantu: L = d.titik.lapangan, cincinKiri = L + titik(-2.1, 0), cincinKanan = L + titik(2.1, 0), cincinAtas = L + titik(0, -2.1), cincinBawah = L + titik(0, 2.1), dan pusat kelompok G0 sampai G3 dari bagian F.
fokus: d.fokus;
gejala: { muat: [d.benda.gerbang, d.benda.komisariat, cincinKiri, cincinBawah] } (perkiraan H sekitar 13.5);
sebab: { muat: [pendamping, cincinKiri, cincinKanan, cincinAtas, cincinBawah], H: 9 };
ikhtiar: { muat: [timbangan, d.benda.komisariat, G0 + titik(0, -0.8), G2 + titik(-0.8, 0), G2 + titik(0, 0.8)], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Pusat kelompok G0 sampai G3 adalah titik tujuan, jadi wajib masuk sebagai Vector3.
D. Benda yang Dipakai
Dari kit:
pionPendamping(): pendamping lama. Cincin kaki aktif dan lencana zamrud sudah bawaan.
pionPendamping() x 3: pendamping baru dari instruktur, pengurus, dan alumni.
pion() x 20: kader baru. Tinggi sekitar 1.0 unit.
garisPutus({ titik: [a, b], warna: W.abu, lebar: 2, putus: 0.1, sela: 0.07 }) x 16: garis beban dari dada pendamping lama ke dada setiap kader Bagian 1.
garisPutus({ titik: [a, b], warna: W.zamrudPijar, lebar: 2, putus: 0.1, sela: 0.07 }) x 20: garis kelompok dari dada setiap pendamping ke dada lima kadernya.
Benda lokal (di benda-lokal.js, dilaporkan):
timbangan(): mengembalikan THREE.Group dengan titik asal di tengah alas. Bagiannya:
alas: silinder jari-jari 0.4, tinggi 0.06, warna W.zamrudRedup;
tiang: silinder jari-jari 0.05, tinggi 1.5, berdiri di atas alas, warna W.zamrud;
poros: Group di y 1.56. Di dalamnya balok kotakBulat(1.8, 0.07, 0.07) dengan radius sudut 0.02, sejajar sumbu x lokal, warna W.zamrud;
piring kiri dan kanan: masing-masing Group anak root (bukan anak poros) dengan titik asal di titik gantung. Isinya tali silinder jari-jari 0.012 setinggi 0.5 yang menjulur ke bawah, dan piring silinder jari-jari 0.32 tinggi 0.04 di ujung bawah tali. Tali W.zamrudRedup, piring W.zamrud;
userData.aturMiring(a) (radian, positif berarti piring kanan turun): poros.rotation.z = -a; titik gantung kiri di (−0.9 cos a, 1.56 + 0.9 sin a, 0) lokal, titik gantung kanan di (0.9 cos a, 1.56 − 0.9 sin a, 0) lokal. Piring tetap tegak, tidak ikut berputar;
root diputar rotation.y = Math.PI / 4 supaya balok sejajar layar dan piring kanan tampak di kanan layar;
userData.nama = "timbangan", userData.bagian.emas berisi semua mesh, userData.bagian.tepi berisi garis tepi alas dan balok, userData.bagian.piring = [kiri, kanan]. Setiap mesh punya bahannya sendiri.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "31", kategori: "KADERISASI", judul: "Pertumbuhan massa tidak diimbangi perkaderan yang intensif dan selektif.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Jumlah anggota bertambah, tetapi **jumlah pendamping tetap**, dan tidak ada yang menghitung selisihnya."
ikhtiar:
{ teks: "**Jaringan Pendamping dan Instruktur** menyiapkan pendamping dari instruktur, pengurus, dan alumni.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Perbandingan pendamping dan kader baru dihitung per komisariat, sehingga kekurangannya terlihat.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 02".
kuis: { pertanyaan: "Setelah LK 1, apakah setiap kader baru di komisariatmu punya pendamping yang jelas?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label mikro “PENDAMPING” di atas pendamping lama, geser [0, 1.35, 0]. Masuk 1.0 sampai 1.4, keluar 6.0 sampai 6.3.
Label mikro kelas zamrud “INSTRUKTUR”, “PENGURUS”, dan “ALUMNI” di atas masing-masing pendamping baru, geser [0, 1.35, 0]. Masuk bersama figurnya (0.3 detik), keluar 22.6 sampai 23.0.
Label mikro “PENDAMPING” di bawah piring kiri timbangan dan “KADER BARU” di bawah piring kanan, jangkar Group piring, geser [0, -0.75, 0]. Ikut muncul bersama timbangan, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaKader(v, { tanpa: ["kelas", "tangga", "jalan"] }). Jalan ditiadakan sesuai resep 31 di docs dunia, karena lingkaran luar berjari-jari 1.9 di lapangan menyentuh jalan. Benda yang tersisa: gerbang di titik(-2.1, -0.7) dan komisariat di titik(2.6, 2.2).
Titik dunia yang dipakai: d.titik.belakangGerbang, d.titik.depanGerbang, d.titik.lapangan, d.titik.komisariat, d.titik.depanPintu.
Benda tambahan dan posisinya (L = d.titik.lapangan, semua di tanah y 0 kecuali disebut):
Pendamping lama: di L, rotasi y Math.PI / 4 (menghadap penonton).
Kader Bagian 1 (16 figur): lingkaran dalam jari-jari 1.2 berisi 8 figur pada θ = 22.5 + 45k (k 0 sampai 7); lingkaran luar jari-jari 1.9 berisi 8 figur pada θ = 15 + 30k untuk k = 0, 1, 3, 4, 6, 7, 9, 10. Tidak ada figur tepat di θ 90 atau 270, supaya tidak menutupi atau bertumpuk dengan pendamping.
Kader tambahan Bagian 2 (4 figur): lingkaran luar jari-jari 1.9, θ = 75, 165, 255, dan 345 (celah yang sengaja dikosongkan di Bagian 1).
Jalur kader: [d.titik.belakangGerbang, d.titik.depanGerbang, (titik bantu), sasaran], lengkung: true. Titik bantu hanya untuk sasaran di separuh bawah lingkaran (d sasaran lebih besar dari d L): L + titik(2.3, 0) bila sasaran di kanan L, L + titik(-2.3, 0) bila di kiri.
Garis beban: dari pendamping lama + y 0.55 ke sasaran kader + y 0.55.
Timbangan: di titik tengah antara d.titik.lapangan dan d.titik.komisariat, lalu + titik(0, -0.9). Bila bertumpuk dengan atap komisariat atau lingkaran luar, geser di sumbu d ke atas layar paling banyak 0.8 dan laporkan.
Pusat kelompok Bagian 3: G0 = L + titik(-1.0, -0.7), G1 = L + titik(1.0, -0.7), G2 = L + titik(-1.0, 0.9), G3 = L + titik(1.0, 0.9).
Slot kader di setiap kelompok: Gk + titik(0.6 cos θ, 0.6 sin θ) untuk θ = 0, 55, 125, 180, dan 300.
Asal pendamping baru: INSTRUKTUR dari L + titik(-3.8, 0.9) (luar layar kiri) ke G2; ALUMNI dari d.titik.belakangGerbang lewat d.titik.depanGerbang ke G1; PENGURUS dari d.titik.depanPintu ke G3. Pendamping lama pindah dari L ke G0.
Pembagian kader ke kelompok: rakus dan pasti. Untuk G0, lalu G1, G2, G3, ambil 5 kader terdekat yang belum terpakai, lalu isi slot kelompok itu menurut sudut yang paling dekat dengan arah datang kader.
Pengecualian zona: gerbang boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). komisariat boleh terpotong selama Bagian 2 ((t) => t < 6.0 || t >= 13.0). Pendamping INSTRUKTUR tidak dihitung sebelum masuk layar ((t) => t >= 15.6).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: gerbang dan komisariat muncul (muncul(d.urutan, { t: 0.6, selesai: 1.6 })), lalu pendamping lama muncul 1.0 sampai 1.5 (muncul, naik: 0). Komisariat abu penuh sejak awal.
1.6 sampai 5.65: 16 kader berdatangan dari belakang gerbang, jeda 0.15 detik (mulai 1.6 sampai 3.85). Urutan datang: sasaran yang paling bawah di layar lebih dulu, supaya figur yang datang tidak menembus figur yang sudah berdiri. Setiap kader muncul di titik awal (durasi: 0.3, naik: 0), lalu jalan dengan durasi: 1.8, hadap: true, bunyi: { kuat: 0.25 }.
Saat setiap kader tiba (j.selesai), garis bebannya tergambar dalam 0.3 detik (aturTampak 0 ke 1).
4.6 sampai 6.0: pendamping lama bergetar kewalahan (getar, durasi: 1.4, amp: 0.05, frek: 7). Ke-16 garis beban menipis ke opacity 0.6 (aturOpasitas 1 ke 0.6).
Semua kader sudah tiba sebelum 6.0, jadi tidak ada figur yang dibekukan di tengah jalan.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
7.0 sampai 9.5: empat kader tambahan datang ke celah lingkaran luar (mulai 7.0, 7.3, 7.6, 7.9; jalan dengan durasi: 1.6, aturan jalur yang sama). Mereka tidak mendapat garis beban. Jumlah anggota bertambah, pendamping tetap satu.
8.8 sampai 11.05: enam garis beban putus satu per satu (hilang, durasi: 0.25, turun: 0, bunyi: false) pada 8.8, 9.2, 9.6, 10.0, 10.4, dan 10.8. Yang putus adalah garis ke kader lingkaran luar k = 0, 3, 6, 9, 1, dan 7.
8.8 sampai 10.8: sepuluh garis beban yang tersisa menipis dari opacity 0.6 ke 0.3 (aturOpasitas).
9.6 sampai 12.6: pendamping lama berdenyut (denyutCermin(pendamping, { mulai: 9.6, selesai: 12.6 })).
11.1 sampai 13.0: adegan diam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.8: sepuluh garis beban yang tersisa memudar ke opacity 0 (aturOpasitas 0.3 ke 0).
13.4 sampai 13.9: timbangan muncul (muncul, durasi: 0.5), zamrud, langsung miring berat ke sisi KADER BARU (aturMiring(0.35)). Label piring ikut muncul.
14.6 sampai 16.6: tiga pendamping baru muncul di asalnya (durasi: 0.3, naik: 0) lalu jalan (hadap: true, bunyi: { kuat: 0.4 }), semuanya tiba 16.6:
INSTRUKTUR mulai 14.6, durasi: 2.0, ke G2;
ALUMNI mulai 14.8, durasi: 1.8, ke G1;
PENGURUS mulai 15.0, durasi: 1.6, ke G3.
15.8 sampai 16.8: pendamping lama jalan ke G0 (durasi: 1.0). Ke-20 kader jalan serentak ke slot kelompoknya (durasi: 1.0, bunyi: { kuat: 0.15 }). Kerumunan terbagi menjadi empat kelompok berisi lima.
16.6 sampai 17.4: timbangan berkurang miringnya, aturMiring 0.35 ke 0.12 (halus).
17.0 sampai 17.6: 20 garis kelompok zamrud tergambar dari setiap pendamping ke lima kadernya (aturTampak 0 ke 1).
18.6 sampai 19.6: timbangan menjadi datar, aturMiring 0.12 ke 0 (halus). Perbandingan sudah dihitung.
20.0: klikEmas(timbangan).
20.2 sampai 21.0: abu komisariat dilepas dari 1 ke 0.
21.0 sampai 23.0: adegan diam. Jangan menampilkan rombongan kader yang datang sesudah timbangan seimbang. Gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
8.8, 9.2, dan 9.6: garis-putus (kuat 0.5) di titik tengah garis yang putus. Tiga putusan sesudahnya tanpa bunyi supaya tidak riuh;
18.6: gemuruh pelan (kuat 0.25, durasi 1.0) saat balok timbangan bergerak datar.
getar pendamping sudah mencatat gemuruh; beri bunyi: { kuat: 0.3 }.
Langkah kader dibisukan sebagian: bunyi: { kuat: 0.25 } di Bagian 1 dan 2, bunyi: { kuat: 0.15 } saat berpindah kelompok.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka atau rasio di layar, termasuk label “1 : 20” dan “1 : 5” dari prompt lama. Perbandingan hanya dibaca dari timbangan. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-31 --periksa, lalu lihat hasil/gambar/indikator-31/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: kader berdatangan dari gerbang, sebagian sudah berdiri mengelilingi pendamping dengan garis beban abu;
5.5: dua lingkaran hampir penuh, pendamping bergetar, garis beban mulai tipis;
9.5: kamera dekat ke kerumunan, kader tambahan tanpa garis, dua garis sudah putus, pendamping berdenyut, kalimat sebab terbaca;
14.5: timbangan miring ke sisi KADER BARU, pendamping baru berjalan dengan label, kalimat ikhtiar pertama terbaca;
17.3: empat kelompok berisi lima sudah terbentuk, garis kelompok zamrud sedang tergambar;
20.3: timbangan datar dan emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-31. Hasilnya hasil/video/indikator-31.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, geseran timbangan, benda lokal timbangan).
