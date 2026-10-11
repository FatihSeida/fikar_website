Prompt Animasi Indikator 13 dari 44
Judul indikator: Kegiatan HMI sepi dari pengunjung.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 06 Pemetaan Kebutuhan Mahasiswa dan Kampus dan 03 Indeks Kaderisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-13-v2/. Folder lama animasi/proyek/indikator-13/ jangan diubah. Folder itu boleh dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-13-v2 --format evidence --judul "Kegiatan HMI sepi dari pengunjung.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-13-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: ruang acara abu 0.7 (setelKeadaan(ruang, "abu", 0.7)). Kursi kosong menjadi abu penuh. Figur hadir berwarna pion. Figur absen berwarna W.abu. Komisariat abu penuh.
Bagian 2: kartu acara lama tetap kertas biasa. Satu titik masalah: kartu acara yang sama itu berdenyut zamrud. Kursi yang baru ditinggalkan menjadi abu. Tidak ada emas.
Bagian 3: papan kehadiran, dua lingkaran garis putus, balon, dan kartu alasan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: kartu acara baru di akhir Bagian 3. Ruang acara melepas abu sesudah kartu baru menjadi emas.
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
fokus: titik(1.1, 1.1, 0.25);
gejala: { muat: [ruang, absen[1], absen[3], komisariat] } (H akan naik sekitar 17 sampai 18 karena ruang 6 x 5 dan kelompok absen di kanan);
sebab: { muat: [kartuAcara, kursi[0], kursi[7], kursi[13], kursi[15]], H: 8 };
ikhtiar: { muat: [papan, kartuAcara, kursi[13], kursi[15], absen[0], absen[3]], H: 11 };
tidak ada kunci tambahan.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
ruangAcara({ warna: W.pelat, nama: "ruang acara" }): lantai 6 x 0.1 x 5, rotasi y 45 derajat supaya baris dan kolom sejajar layar.
kursiKotak() x 20: empat baris berisi lima, rotasi y 45 derajat, bernama kursi 1 sampai kursi 20.
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7.
kartuProker({ garis: 3, kaki: true, skala: 0.7 }): kartu acara lama.
panelKertas({ lebar: 1.8, tinggi: 1.3, batang: [1, 0.7, 0.45], labelBaris: ["KEGIATAN A", "KEGIATAN B", "KEGIATAN C"] }): papan kehadiran. Batang tanpa angka.
garisPutus({ lingkaran: 0.45, warna: W.zamrudPijar, lebar: 3 }) x 2: penanda kursi yang ditinggalkan.
balonKata({ isi: "titik", skala: 0.45 }) x 4: balon figur absen. Titik asal di ujung ekor.
kartuKecil({ simbol: "garis", warnaSimbol: W.zamrud, rebah: false, miring: 0, skala: 0.5 }) x 4: kartu alasan.
kartuProker({ garis: 3, cek: 3, tag: ["TGL", "PJ"], kaki: true, skala: 0.7 }): kartu acara baru.
Benda lokal:
figurBerpunggung({ nama, duduk, warna }): pion({ nama, duduk, warna }) ditambah panel punggung kotakBulat 0.22 x 0.26 x 0.025 warna W.abuGelap (radius 0.018) di titik lokal (0, 0.52, −0.183) untuk figur berdiri atau (0, 0.27, −0.183) untuk figur duduk. Panel ini memberi arah hadap pada pion tanpa wajah. Salin dari fungsi figur di animasi/proyek/indikator-13/adegan.js. Dipakai untuk 4 figur hadir (duduk, W.pion) dan 4 figur absen (berdiri, W.abu).
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "13", kategori: "KADERISASI", judul: "Kegiatan HMI sepi dari pengunjung.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Kegiatan diulang **dengan format yang sama**, tanpa melihat siapa yang datang dan siapa yang berhenti datang."
ikhtiar:
{ teks: "**Indeks Kaderisasi** mencatat kehadiran dan keterlibatan dari kegiatan ke kegiatan.", masuk: [13.6, 14.1], keluar: [17.0, 17.4] }
{ teks: "**Pemetaan Kebutuhan Mahasiswa** menanyakan alasan yang berhenti datang, lalu kegiatan berikutnya disusun dari situ.", masuk: [17.6, 18.1], keluar: [22.6, 23.0] }
program: "Program 06 · Program 03".
kuis: { pertanyaan: "Ketika ada kader yang berhenti aktif, apakah komisariatmu menanyakan alasannya?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label kotak di atas kartu acara (pada: kartuAcara, geser [0, 1.3, 0], gaya kotak): “KEGIATAN A” masuk 6.8 sampai 7.2, berganti “KEGIATAN B” pada 8.4 dan “KEGIATAN C” pada 10.0 (gantiLabel), keluar 17.0 sampai 17.4.
Label baris papan kehadiran (“KEGIATAN A”, “KEGIATAN B”, “KEGIATAN C”) dipasang panelKertas sendiri lewat labelBaris.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar kit. Tata letaknya sama dengan animasi/proyek/indikator-13/adegan.js, ditambah komisariat, kartu acara, dan papan kehadiran.
Benda dan posisinya:
Ruang acara: titik(0, 0.4), rotasi y 45 derajat.
Kursi i = b × 5 + c (b baris 0 sampai 3, c kolom 0 sampai 4): kursiP[i] = titik((c − 2) × 1.0, -1.25 + b × 1.1, 0.1), rotasi y 45 derajat.
Figur hadir: duduk di kursi indeks 0, 7, 13, 15, di kursiP[indeks] + y 0.16 (pion duduk diangkat ke dudukan kursi), rotasi y 45 derajat (menghadap kamera).
Figur absen: berdiri di titik(4.15, 1.25), titik(5.0, 1.9), titik(4.15, 3.35), titik(5.0, 4.0), rotasi y 0.75π (membelakangi ruang di kiri).
Komisariat: titik(4.5, -1.3), di kanan atas ruang, di atas kelompok absen. Pintu di muka +z.
Kartu acara lama dan kartu acara baru: titik(1.3, 3.7, 0.1), di bawah tepi depan ruang. Bawaan hadap sudah menghadap kamera.
Papan kehadiran: titik(-1.4, 3.7, 0.1), di kiri kartu acara.
Lingkaran penanda: di kursiP[15] lalu kursiP[13], y 0.12.
Balon i: ujung ekor di atas kepala absen i, posisi absen + y 1.15.
Kartu alasan i: muncul di tempat balon i, lalu menuju titik(1.3, 3.7, 1.5 + 0.06i) di atas kartu acara.
Pengecualian zona:
Ruang acara, kursi, dan figur hadir: userData.penting = (t) => !(t > 6.0 && t < 23.0) (latar yang terpotong saat kamera dekat).
Komisariat: userData.penting = (t) => !(t > 6.0 && t < 23.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-13/adegan.js. Dunia, benda, posisi, dan waktunya sama persis. Komisariat ditambahkan.
0.6 sampai 1.1: ruang acara muncul. Abu 0.7 sejak awal.
0.85 sampai 2.4: kursi muncul per baris, baris b pada 0.85 + 0.35b (durasi 0.5).
1.0 sampai 1.5: komisariat muncul, abu penuh.
2.4 sampai 3.38: empat figur hadir duduk dan empat figur absen berdiri muncul berpasangan (muncul, figur ke-i pada 2.4 + 0.16i, durasi 0.5).
3.4 sampai 4.4: keenam belas kursi kosong menjadi abu penuh (setelKeadaan(kursi, "abu", halus(rentang(t, 3.4, 4.4)))). Kursi yang terisi tetap 0.
4.4 sampai 6.0: diam. Ruang sepi, empat orang duduk, empat orang di luar membelakangi ruang.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.1: kartu acara lama muncul di depan ruang. Label “KEGIATAN A” masuk 6.8 sampai 7.2.
7.0 sampai 11.8: kartu acara berdenyut (denyutCermin(kartuAcara, { mulai: 7.0, selesai: 11.8 })).
7.2, 8.4, 10.0: kartu acara “dicap ulang” tanpa berubah: getar(kartuAcara, { t, durasi: 0.4, amp: 0.04 }). Pada 8.4 label berganti “KEGIATAN B”, pada 10.0 berganti “KEGIATAN C”.
8.6 sampai 9.4: figur hadir di kursi 15 pergi (aturOpasitas 1 ke 0). Kursi 15 menjadi abu (0 ke 1) pada jendela yang sama.
10.2 sampai 11.0: figur hadir di kursi 13 pergi dengan cara yang sama. Kursi 13 menjadi abu.
11.0 sampai 13.0: adegan diam. Tinggal dua figur hadir (kursi 0 dan 7), kursi kosong bertambah.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.9: papan kehadiran muncul di kiri kartu acara.
13.9 sampai 14.8: ketiga batang tumbuh berurutan (tumbuh(papan.userData.bagian.batang, { t: 13.9, sumbu: "x" }), 0.3 detik per batang). Panjang batang menurun, sesuai kursi yang terisi dari kegiatan ke kegiatan. Tidak ada angka.
15.0 sampai 15.8: dua lingkaran penanda tergambar di kursi 15 lalu kursi 13 (aturTampak 0 ke 1, jeda 0.4, durasi 0.4). Kursi yang ditinggalkan kini tercatat.
15.8 sampai 17.6: adegan tetap. Kalimat ikhtiar pertama keluar 17.0 sampai 17.4.
17.6 sampai 18.4: keempat figur absen berbalik menghadap ruang (putar(absen[i], { t: 17.6, durasi: 0.8, sudut: -Math.PI })).
18.2 sampai 18.95: empat balon muncul di atas kepala figur absen (t 18.2, jeda 0.15, durasi 0.3).
18.9 sampai 20.65: balon i berubah menjadi kartu alasan di tempatnya (gantiBenda(balon[i], kartuAlasan[i], { t: 18.9 + 0.25i, durasi: 0.3 })), lalu kartu itu lintas ke atas kartu acara (mulai 19.2 + 0.25i, durasi 0.7, lengkung: true, titik tengah dinaikkan 0.8). Kartu terakhir tiba 20.65.
20.7 sampai 21.1: keempat kartu alasan hilang ke dalam kartu acara. Pada 20.8 kartu acara lama berubah menjadi kartu acara baru (gantiBenda(kartuAcara, kartuBaru, { t: 20.8, durasi: 0.4 })).
21.3: kartu acara baru klikEmas.
21.6 sampai 22.4: abu ruang acara dilepas dari 0.7 ke 0. Kursi kosong tetap abu.
Tidak ada figur baru yang masuk dan duduk. Kursi kosong tetap kosong; yang berubah hanya cara kegiatan disusun.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
7.2, 8.4, 10.0: cap (kuat 0.5) di kartu acara setiap kali dicap ulang;
17.6: putar (durasi 0.8, kuat 0.3) di kelompok absen saat mereka berbalik;
18.2 + 0.15i: balon (kuat 0.4) di setiap balon yang muncul.
Tidak ada figur yang berjalan, jadi tidak ada langkah yang perlu diredam.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di papan kehadiran, kartu acara, atau label kegiatan. Label kegiatan memakai huruf A, B, C. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML. Isi balon hanya tiga titik.
Tidak boleh ada rombongan figur yang masuk dan memenuhi kursi sesudah kartu acara baru jadi.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-13-v2 --periksa, lalu lihat hasil/gambar/indikator-13-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.5,9.5,14.5,19.3,21.6 bila titik bawaan tidak pas):
3: ruang dan dua puluh kursi lengkap, figur hadir dan absen sedang muncul, komisariat abu di kanan atas;
5.5: enam belas kursi kosong abu, empat figur duduk, empat figur absen membelakangi ruang;
9.5: kamera dekat ke kartu acara berlabel KEGIATAN B yang berdenyut, kursi 15 sudah kosong dan abu, kalimat sebab terbaca;
14.5: papan kehadiran dengan dua batang sudah tumbuh, kalimat ikhtiar pertama terbaca;
19.3: figur absen sudah berbalik, balon pertama dan kedua sudah menjadi kartu alasan, kalimat ikhtiar kedua terbaca;
21.6: kartu acara baru emas, ruang mulai melepas abu, baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-13-v2. Hasilnya hasil/video/indikator-13-v2.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, benda lokal).
