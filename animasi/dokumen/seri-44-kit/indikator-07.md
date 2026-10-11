Prompt Animasi Indikator 07 dari 44
Judul indikator: Komisariat belum tumbuh di seluruh perguruan tinggi dalam satu kota.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 06 Pemetaan Kebutuhan Mahasiswa dan Kampus.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-07-v2/. Folder lama animasi/proyek/indikator-07/ jangan diubah, tetapi wajib dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-07-v2 --format evidence --judul "Komisariat belum tumbuh di seluruh perguruan tinggi dalam satu kota.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-07-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Titik dunia (x, z) sama dengan titik(0.707 * (x - z), 0.707 * (x + z)).
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: kampus 3, 4, dan 6 (tanpa komisariat) menjadi abu gelap (warnaAbu badan = W.abuGelap, setelKeadaan(kampus, "abu", 1)). Tiga komisariat kecil menyala hangat redup (benda lokal, di bawah ambang bloom).
Bagian 2: lembar peta kosong abu penuh. Satu titik masalah boleh berdenyut zamrud: garis alas ketiga kampus tanpa komisariat (denyutCermin). Tidak ada emas.
Bagian 3: garis batas kampus, pin kampus berkomisariat, garis kenal, dan kartu kebutuhan berwarna zamrud (proses). Pin kampus kosong abu. Emas hanya untuk satu rantai hasil: pin kampus 4 sesudah kebutuhan mahasiswanya terkumpul.
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
fokus: titik(0, -0.9, 0.7);
gejala: { muat: [...kampus, ...komisariat, ...atasKampus] } (seluruh peta; H dihitung otomatis, perkiraan sekitar 16);
sebab: { muat: [kampus3, kampus4, kampus6, panelPeta], H: 10 } (ketiga kampus tersebar dari kiri ke kanan, jadi H akan naik otomatis);
ikhtiar: { muat: [...kampus, ...titikPin], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [kampus4, kampus5, komisariat5, titikKartu, mahasiswa2, mahasiswa3], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. atasKampus adalah titik di atas tiap kampus pada y 1.38 + 0.85; titikPin adalah ujung bawah pin di atap tiap kampus (y 1.38) + y 0.6.
D. Benda yang Dipakai
Dari kit:
gedungKelas() x 6: kampus, skala 0.6 (scale.setScalar(0.6)), sejajar sumbu dunia. Tinggi atap 1.38.
pion({ skala: 0.55 }) x 4: mahasiswa di sekitar kampus tanpa komisariat.
panelKertas({ lebar: 1.8, tinggi: 1.2, baris: 4, kosong: true, kaki: "tiang", dasar: 0.6 }): lembar peta kosong.
tandaTanya({ ukuran: 0.45, hadapKamera: true, tengah: true }): tanda tanya di depan lembar peta kosong.
garisPutus({ persegi: [2.1, 1.6], warna: W.zamrudPijar, lebar: 3 }) x 6: garis batas yang melingkari tiap kampus, di tanah y 0.03.
pin() x 6: penanda peta di atap tiap kampus (titik asal di ujung bawah).
kartuProker({ garis: 3, kaki: true, skala: 0.4, warna: W.zamrud }): kartu kebutuhan di samping kampus 4.
garisPutus({ titik: [...], lengkung: true, warna: W.zamrudPijar, lebar: 3 }): garis kenal dari komisariat 5 ke kartu kebutuhan.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.3, warna: W.zamrud }) x 2: kebutuhan dari dua mahasiswa kampus 4.
Benda lokal (salin persis dari animasi/proyek/indikator-07/benda-lokal.js ke animasi/proyek/indikator-07-v2/benda-lokal.js; hanya tiga ini yang dipakai):
komisariatHangat({ nama, lampu: 0, skala: 0.75 }) x 3: rumahKecil({ jendela: false }) kit (1.2 x 0.9 x 1.1) diskalakan 0.75, ditambah tiga jendela kotak tipis (dua 0.03 x 0.24 x 0.22 di muka +x, satu 0.22 x 0.24 x 0.03 di muka +z, pada tinggi 0.495 lokal). Jendela padam = W.pelat dicampur W.zamrudRedup 0.35; menyala = W.kertas x 0.45 dengan emissive W.kertas kuat 0.25 (di bawah ambang bloom). Keadaan "lampu" 0 sampai 1. userData.atas = (0.9 + 0.5) x 0.75 (puncak atap).
garisAlas(w, d): persegi panjang garis di tanah y 0.03 mengelilingi tapak benda, W.zamrudPijar 3 piksel, tersembunyi sampai keadaan denyut lebih dari 0. Dipasang sebagai bagian.tepi kampus tanpa komisariat.
ruasJalan(dari, ke) x 5: kotak lebar 0.15, tinggi 0.02, warna W.pelat, titik asal di dari, memanjang di sumbu x lokal (bisa tumbuh sumbu x), penting: false.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "07", kategori: "KADERISASI", judul: "Komisariat belum tumbuh di seluruh perguruan tinggi dalam satu kota.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Peta kampus di satu kota **tidak pernah digambar**, jadi kampus yang belum tersentuh tidak terlihat."
ikhtiar:
{ teks: "**Pemetaan Kebutuhan Mahasiswa dan Kampus** memetakan setiap kampus dan komisariat di wilayah cabang.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Kampus yang masih kosong terlihat, lalu kebutuhan mahasiswanya dipelajari lebih dulu.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 06".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar. Peta kota disusun dari benda kit dan benda lokal, sama dengan video lama.
Kampus 1 sampai 6 di titik(-3.0, -3.2), titik(-0.2, -4.0), titik(2.9, -3.3), titik(-3.0, 1.9), titik(-0.3, 1.2), dan titik(3.0, 2.3). Kampus 3, 4, dan 6 tanpa komisariat; masing-masing diberi garisAlas(3.4, 2.4) sebagai anak, bagian.tepi = [alas, ...tepi], dan bagian.denyut = [] (denyut hanya di garis, bukan di permukaan).
Komisariat 1, 2, dan 5: di posisi kampus 1, 2, dan 5 + Vector3(1.55, 0, 0.19) (dunia x, z), yaitu + titik(0.96, 1.23).
Jalan kota (ruasJalan, koordinat dunia x, z): A dari (-6.4, -1.6) ke (4.3, -1.6); B dari (-4.6, 2.25) ke (3.6, 2.25); C dari (-0.6, -3.65) ke (-0.6, 2.25); D dari (-2.2, -1.6) ke (-2.2, 4.4); E dari (2.25, -4.3) ke (2.25, 0.55).
Mahasiswa 1 sampai 4 (dunia x, z): (0.95, -3.45) di kampus 3; (0.75, 3.05) dan (-0.55, 4.6) di kampus 4; (4.95, 0.35) di kampus 6. Rotasi y acak berbenih: const r = acak(7), lalu rotation.y = r() * 2 * Math.PI berurutan.
Benda tambahan Bagian 2 dan 3:
Lembar peta kosong: titik(2.3, -0.3), menghadap kamera (hadap bawaan), di antara kampus 3 dan kampus 6 dan tidak menyentuh jalan E. Bila menutupi kampus 3 atau kampus 6, geser paling banyak 0.5 unit dan laporkan.
Tanda tanya: pusat muka lembar peta, digeser 0.05 ke arah penonton (titik(0, 1)).
Garis batas ke-i: berpusat di posisi kampus ke-i, sejajar sumbu dunia.
Pin ke-i: mendarat di atasKampus[i] = posisi kampus ke-i dengan y 1.38. Jatuh dari titik yang sama + y 1.6.
Kartu kebutuhan: titikKartu = posisi kampus 4 + titik(0.96, 1.23) (tempat komisariat kelak, sisi yang sama dengan komisariat kampus lain).
Garis kenal: titik [awal, tengah, ujung] dengan awal = komisariat 5 + y (userData.atas + 0.05), ujung = titikKartu + y 0.65, tengah = titik tengah awal dan ujung dengan y = maks(y awal, y ujung) + 0.6 + 0.08 x jarak awal ke ujung. Pasang userData.abaikanZona = true (garis lengkung diagonal dilaporkan keluar zona padahal tidak).
Kartu kebutuhan mahasiswa: muncul di atas kepala mahasiswa 2 dan 3 (posisi + y 0.75), mendarat di titikKartu + y 0.35.
Pengecualian zona (laporkan): selama kunci tambahan (sesudah 17.5) kamera mendekat ke kampus 4 dan 5, jadi kampus 1, 2, 3, 6, komisariat 1 dan 2, pin di atasnya, dan garis batasnya userData.penting = (t) => t < 17.5. Jalan kota sudah penting: false.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-07/adegan.js, bagian Gejala. Dunia, benda, posisi, dan waktunya sama persis.
0.6 sampai 1.6: kelima jalan tergambar dari pangkalnya (tumbuh(jalan, { t: 0.6, durasi: 0.35, jeda: 0.12, sumbu: "x", bunyi: { kuat: 0.4 } })).
0.9 sampai 2.4: keenam kampus muncul berurutan (muncul(kampus, { t: 0.9, selesai: 2.4 })).
2.4 sampai 3.6: tiga komisariat kecil muncul di samping kampus 1, 2, 5 (muncul(komisariat, { t: 2.4, selesai: 3.6, durasi: 0.45 }), mulai 2.4, 2.775, 3.15). Jendela tiap komisariat menyala 0.2 detik sesudah mulai munculnya, naik dalam 0.3 detik (setelKeadaan(m, "lampu", halus(rentang(t, tLampu, tLampu + 0.3)))). Pada setiap tLampu: catat({ jenis: "menyala", kuat: 0.4, nada: i }).
3.7, 3.95, dan 4.2: kampus 3, 4, dan 6 berubah abu gelap, masing-masing dalam 0.6 detik (setelKeadaan(kampus, "abu", halus(rentang(t, tAbu, tAbu + 0.6)))). Pada setiap tAbu: catat({ jenis: "padam", kuat: 0.55, nada: -i }).
4.7 sampai 5.5: empat mahasiswa kecil muncul dan berdiri diam (muncul(mahasiswa, { t: 4.7, jeda: 0.14, durasi: 0.4, naik: 0.3, bunyi: { kuat: 0.35 } })).
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: lembar peta kosong muncul di antara kampus 3 dan kampus 6. Abu penuh sejak muncul. Baris kosongnya berupa garis putus.
7.0 sampai 7.4: tanda tanya muncul di depan lembar peta (naik: 0).
7.4 sampai 12.8: garis alas ketiga kampus tanpa komisariat berdenyut zamrud (denyutCermin([kampus3, kampus4, kampus6], { mulai: 7.4, selesai: 12.8, bunyi: false })). Kampus tetap abu gelap; permukaannya tidak menyala.
Mahasiswa tetap diam. Tidak ada pin dan tidak ada garis batas.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.4: lembar peta dan tanda tanya hilang.
13.6 sampai 15.9: garis batas tergambar melingkari kampus 1 sampai 6 satu per satu (aturTampak 0 ke 1 dalam 0.3 detik, mulai 13.6 + 0.4i).
13.9 sampai 16.4: sesudah garis batasnya selesai, pin kampus ke-i jatuh ke atapnya: muncul(pin, { t: 13.9 + 0.4i, durasi: 0.12, naik: 0, skala: 1, bunyi: false }) dan lintas(pin, { t: 13.9 + 0.4i, durasi: 0.35, jalur: [atas + y 1.6, atas] }). Pin kampus 1, 2, 5 zamrud (bawaan). Pin kampus 3, 4, 6 abu penuh (setelKeadaan(pin, "abu", 1)).
16.4 sampai 17.6: adegan tetap. Semua kampus sudah terpetakan.
18.0 sampai 18.4: kartu kebutuhan muncul di samping kampus 4.
18.4 sampai 19.0: garis kenal zamrud tergambar dari komisariat 5 ke kartu kebutuhan (aturTampak 0 ke 1).
19.2 sampai 20.2: dua kartu kecil muncul di atas kepala mahasiswa 2 dan 3 (19.2 dan 19.5; durasi 0.25, naik: 0), terbang ke kartu kebutuhan (busur, mulai 19.4 dan 19.7, durasi 0.5, tinggi 0.6), lalu hilang saat tiba (19.9 dan 20.2, durasi 0.2).
20.4 sampai 20.8: pin kampus 4 melepas abu (1 ke 0).
20.8: pin kampus 4 klikEmas. Ini satu-satunya rantai emas. Pin kampus 3 dan 6 tetap abu.
Jangan menambah komisariat baru di kampus 4 dan jangan menampilkan rombongan mahasiswa yang datang.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: komisariat5, kamera: { ...bagian C } }). Komisariat 5 (komisariat kecil di samping kampus 5) menjadi komisariat segmen kuis. Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
7.4: satu denyut di tengah stereo (x: 0.5, durasi 5.4, periode 1.2, sumber: "kampus tanpa komisariat"), karena ketiga kampus tersebar kiri dan kanan;
setiap pin tiba (13.9 + 0.4i + 0.35): mendarat (kuat 0.5, nada i, posisi pin);
18.4: garis-sambung (durasi 0.6, posisi dari komisariat 5 ke titikKartu).
Mahasiswa tidak berjalan, jadi tidak perlu peredaman langkah.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama kampus, kota, cabang, dan komisariat nyata. Kampus tidak diberi label nama.
Tidak boleh ada angka di peta, kartu, atau pin.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh menggambarkan komisariat baru yang langsung berdiri di kampus kosong. Hasil cukup ditunjukkan oleh pin emas.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-07-v2 --periksa, lalu lihat hasil/gambar/indikator-07-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3.4: jalan dan enam kampus tampak, dua komisariat sudah menyala hangat, komisariat ketiga sedang muncul;
5.5: kampus 3, 4, 6 abu gelap, empat mahasiswa kecil berdiri di sekitarnya;
9.5: lembar peta kosong abu dengan tanda tanya, garis alas kampus tanpa komisariat berdenyut zamrud, kalimat sebab terbaca;
15.0: garis batas kampus 1 sampai 3 sudah tergambar, pin kampus 1 dan 2 zamrud di atap, kalimat ikhtiar pertama terbaca;
19.3: garis kenal tergambar dari komisariat 5 ke kartu kebutuhan, kartu kecil pertama muncul di atas mahasiswa;
21.6: pin kampus 4 emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-07-v2. Hasilnya hasil/video/indikator-07-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal yang disalin, geseran lembar peta bila ada), lalu hasil zona, warna, LUFS, dan sinkron.
