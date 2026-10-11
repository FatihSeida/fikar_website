Prompt Animasi Indikator 19 dari 44
Judul indikator: Kegiatan keislaman mahasiswa di dalam dan luar kampus berkembang di luar HMI.
Kelompok Kaderisasi. Mode Pandangan. Program terkait 06 Pemetaan Kebutuhan Mahasiswa dan Kampus.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-19/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-19 --format evidence --judul "Kegiatan keislaman mahasiswa di dalam dan luar kampus berkembang di luar HMI.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-19/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Kedua tempat kegiatan lain memakai warna bawaan ruangAcara dan figur berwarna pion sepanjang video. Tempat kegiatan lain tidak pernah diberi abu, pudar, atau denyut.
Bagian 2: garis putus yang menjauh dari komisariat berwarna abu. Papan di depan komisariat abu dan kosong, dengan denyutCermin sebagai satu titik masalah. Tidak ada emas.
Bagian 3: jalur ke tempat kegiatan, kartu kebutuhan, dan papan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: kartu kegiatan khas komisariat yang lahir dari papan. Komisariat melepas abu saat kartu itu masuk pintu, dan sesudahnya tidak lebih terang daripada tempat kegiatan lain.
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
fokus: d.fokus;
gejala: { muat: [d.benda.gerbang, d.benda.komisariat, ruang1, ruang2] };
sebab: { muat: [d.benda.komisariat, papan, d.titik.depanKomisariat], H: 9 };
ikhtiar: { muat: [d.benda.komisariat, papan, ruang1, ruang2], H: 11 }. Tidak ada kunci tambahan: kedua tempat kegiatan lain tetap di dalam bingkai sampai akhir Bagian 3.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaKader (gerbang, jalan, komisariat).
ruangAcara({ lebar: 2.0, dalam: 2.0 }) x 2: tempat kegiatan 1 dan 2, identik, tanpa label, tanpa simbol, tanpa benda tambahan di atasnya selain figur. Permukaan di userData.atas.
kerumunan({ jumlah: 5, susunan: "lingkaran", radius: 0.6, hadapPusat: true, benih: 4 }) x 2: figur di tiap tempat kegiatan (bagian.pion).
pion() x 4: mahasiswa yang berjalan dari gerbang ke tempat kegiatan.
garisPutus({ titik: [...], warna: W.abu, lebar: 3 }): garis yang menjauh dari komisariat.
papanTulis({ lebar: 2.0, tinggi: 1.2, kaki: 0.5, kolom: ["BUTUH", "MINAT", "TANTANGAN"], baris: ["", ""] }): papan pemetaan di depan komisariat.
garisPutus({ titik: [...], lengkung: true, warna: W.zamrudPijar, lebar: 3 }) x 2: jalur dari komisariat ke tiap tempat kegiatan.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.37, warna: W.zamrud }) x 6: kartu kebutuhan.
kartuProker({ garis: 3, kaki: false, skala: 0.6 }): kartu kegiatan khas komisariat.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "19", kategori: "KADERISASI", judul: "Kegiatan keislaman mahasiswa di dalam dan luar kampus berkembang di luar HMI.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Minat keislaman mahasiswa berubah, tetapi **tidak pernah dipelajari**, hanya dicurigai atau dibiarkan."
ikhtiar:
{ teks: "HMI Evidence memandang tumbuhnya kegiatan keislaman di luar HMI sebagai **cermin kebutuhan**, bukan saingan.", masuk: [13.6, 14.1], keluar: [17.6, 18.0] }
{ teks: "**Pemetaan Kebutuhan Mahasiswa** mempelajari apa yang dicari mahasiswa, lalu HMI menawarkan kekhasannya sendiri.", masuk: [18.2, 18.7], keluar: [22.6, 23.0] }
program: "Program 06".
kuis: { pertanyaan: "Bagaimana komisariatmu mengetahui Student Needs dan Student Interest mahasiswa di kampus?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Tempat kegiatan lain sengaja tanpa label. Label kolom papan dipasang papanTulis.
F. Dunia dan Posisi
Dunia dasar duniaKader(v, { tanpa: ["kelas", "tangga"] }). Benda: gerbang di titik(-2.1, -0.7), jalan dari gerbang ke pintu komisariat (dibiarkan kosong sepanjang video), komisariat di titik(2.6, 2.2).
Titik dunia yang dipakai: d.titik.belakangGerbang, d.titik.gerbang, d.titik.depanGerbang, d.titik.lapangan, d.titik.tengahJalan, d.titik.depanKomisariat, d.titik.komisariat, d.titik.pintu.
Benda tambahan dan posisinya:
Tempat kegiatan 1 (ruang1): di d.titik.lapangan, rotasi y 45 derajat (sejajar layar). Pelat 2.0 dipakai karena pelat 3.0 di prompt lama melewati radius bebas lapangan dan menyentuh jalan.
Tempat kegiatan 2 (ruang2): di titik(1.6, -1.0), rotasi y 45 derajat. Titik ini bebas sesudah tangga ditiadakan, jauh dari jalan dan komisariat.
Kerumunan 1 dan 2: di pusat permukaan masing-masing ruang (posisi ruang + y userData.atas).
Mahasiswa W1 dan W3 berjalan ke ruang1, jalur [d.titik.belakangGerbang, d.titik.gerbang, d.titik.depanGerbang, ruang1 + titik(0.7, -0.4, 0.1)] dan ujung kedua ruang1 + titik(-0.4, -0.7, 0.1). W2 dan W4 berjalan ke ruang2, jalur [d.titik.belakangGerbang, d.titik.gerbang, d.titik.depanGerbang, titik(0, -0.2), ruang2 + titik(-0.7, 0.4, 0.1)] dan ujung kedua ruang2 + titik(-0.4, 0.7, 0.1). Semua lengkung: true.
Garis abu yang menjauh: titik [d.titik.komisariat + titik(1.0, 0.4, 0.08), d.titik.komisariat + titik(2.0, 0.8, 0.08), d.titik.komisariat + titik(3.0, 1.2, 0.08)], mengarah ke kanan bawah, menjauhi kedua tempat kegiatan, dan sengaja keluar layar.
Papan: di d.titik.depanKomisariat, menghadap kamera (rotasi y 45 derajat bawaan). Panggil papan.updateMatrixWorld(true) sesudah menaruhnya. Sel tujuan kartu: papan.localToWorld(papan.userData.titikSel(k, r)), baris dari bawah r = 1 lalu 0.
Jalur zamrud 1: [d.titik.depanKomisariat, ruang1 + titik(0.9, 0.3)], y 0.08. Jalur zamrud 2: [d.titik.depanKomisariat, d.titik.tengahJalan, ruang2 + titik(-0.3, 1.0)], y 0.08.
Kartu kebutuhan: muncul di pusat ruang asalnya + y 1.6, lalu menempuh jalur zamrud ruangnya dari ujung ruang ke papan (titik jalur dibalik, diangkat ke y 0.9), berakhir di sel tujuannya.
Kartu kegiatan khas: muncul di posisi papan + titik(0, 0.9, 0.6), lalu menuju d.titik.pintu + y 0.7.
Pengecualian zona: gerbang dan jalan boleh terpotong sesudah 6.0 ((t) => t < 6.0). ruang1, ruang2, kedua kerumunan, dan keempat mahasiswa boleh terpotong selama sebab ((t) => !(t > 6.0 && t < 13.0)). Garis abu tidak dihitung (userData.penting = false).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: semua benda dunia dan kedua ruang muncul (muncul([...d.urutan, ruang1, ruang2], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.2 sampai 2.0: sepuluh figur kedua kerumunan muncul (muncul([...], selesai: 2.0, naik: 0). Urutan muncul di kedua ruang bergantian, jadi keduanya terisi bersamaan.
2.2 sampai 5.6: figur kerumunan bergoyang hidup. Setiap figur getar tiga kali pada 2.2, 3.4, dan 4.6 ditambah 0.12 x urutan figur dalam kerumunannya, amp: 0.03, durasi: 0.5, bunyi: false. Waktu di kedua ruang sama.
2.0 sampai 5.6: empat mahasiswa keluar dari belakang gerbang dan berjalan ke tempat kegiatan (muncul durasi 0.3 naik: 0 di titik awal, lalu jalan, bunyi: { kuat: 0.25 }): W1 t 2.0 ke ruang1 (durasi 1.8), W2 t 2.0 ke ruang2 (durasi 2.4), W3 t 3.2 ke ruang1 (durasi 1.8), W4 t 2.8 ke ruang2 (durasi 2.8). Jalur ke ruang2 lebih panjang, jadi lajunya dijaga sekitar 2 unit per detik (W2 2.2, W4 1.9). Mereka tiba 3.8, 4.4, 5.0, dan 5.6, lalu berdiri di tepi ruang.
Tidak ada figur di jalan menuju komisariat dan tidak ada siapa pun di depan komisariat.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.6: garis abu tergambar dari sisi kanan komisariat ke arah kanan bawah (aturTampak 0 ke 1).
7.6 sampai 12.6: ruas garis abu terus bergeser menjauh dari komisariat (garis.userData.geser(0.5 * (t - 7.6)) di setiapFrame, dijepit pada 12.6).
7.2 sampai 7.8: papan muncul di depan komisariat, abu, semua sel kosong.
10.6 sampai 12.8: denyutCermin(papan, { mulai: 10.6, selesai: 12.8 }). Papan pemetaan tidak pernah diisi.
Kedua tempat kegiatan dan figurnya tetap seperti di akhir Bagian 1 (diam karena beku), tanpa perubahan warna.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.4 sampai 14.0: garis abu memudar ke opacity 0 (aturOpasitas).
13.6 sampai 14.6: abu papan dilepas dari 1 ke 0, sehingga papan kembali zamrud.
13.8 sampai 14.8: kedua jalur zamrud tergambar dari depan komisariat ke kedua tempat kegiatan, bersamaan (aturTampak 0 ke 1).
14.9 sampai 18.0: enam kartu kebutuhan. Untuk k = 0 sampai 5, t_k = 14.9 + 0.36 k, asal bergantian ruang1, ruang2, ruang1, ruang2, ruang1, ruang2:
t_k: kartu muncul di atas kerumunan asalnya (muncul, durasi 0.3, naik: 0);
t_k + 0.3: kartu menempuh jalur zamrud ke papan (lintas, durasi 1.0, lengkung: true);
tujuan berurutan: BUTUH, MINAT, TANTANGAN, BUTUH, MINAT, TANTANGAN. Kartu menumpuk dari bawah (r = 1 lalu 0). Kedua tempat kegiatan menyumbang jumlah kartu yang sama.
18.6 sampai 19.0: kartu kegiatan khas muncul di depan papan (muncul, naik: 0).
19.2: klikEmas(kartuKhas).
19.6 sampai 21.0: kartu emas melayang ke pintu komisariat (busur, tinggi 1.0, durasi 1.4), lalu hilang di pintu 21.0 sampai 21.4.
21.0 sampai 21.8: abu komisariat dilepas dari 1 ke 0. Komisariat kembali ke warna bawaan, sama terangnya dengan tempat kegiatan lain.
21.8 sampai 23.0: adegan diam. Kedua tempat kegiatan tetap utuh dan tetap ramai. Jangan menampilkan figur yang pindah dari tempat kegiatan lain ke komisariat.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
6.6: garis-sambung (kuat 0.3, durasi 1.0) saat garis abu tergambar, posisi komisariat;
13.4: garis-putus (kuat 0.4) saat garis abu lepas;
13.8: garis-sambung (durasi 1.0) saat kedua jalur zamrud tergambar, posisi papan.
Langkah mahasiswa dibisukan sebagian: bunyi: { kuat: 0.25 } pada jalan. getar figur kerumunan tanpa bunyi.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, simbol agama, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Catatan kepekaan: tempat kegiatan lain digambar netral, berupa pelat tanpa label, tanpa simbol, dan tanpa nama organisasi. Tempat kegiatan lain tidak pernah digambar lebih buruk dari komisariat: tidak abu, tidak pudar, tidak berdenyut, tidak mengecil, tidak kehilangan figur, dan tidak lebih redup daripada komisariat di detik mana pun.
Tidak boleh ada teks pada kartu atau papan selain label kolom. Tidak boleh ada angka.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-19 --periksa, lalu lihat hasil/gambar/indikator-19/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
4.1: kedua tempat kegiatan ramai dan bergoyang, mahasiswa pertama sudah tiba, jalan ke komisariat kosong;
5.9: empat mahasiswa di tempat kegiatan, komisariat abu dan sepi;
9.5: kamera dekat, garis abu menjauh dari komisariat, papan abu kosong, kalimat sebab terbaca;
15.1: garis abu sudah hilang, jalur zamrud tergambar ke kedua tempat kegiatan, kalimat pandangan pertama terbaca;
19.5: kartu kegiatan khas sudah emas di depan papan berisi enam kartu;
21.05: kartu emas di pintu komisariat, kedua tempat kegiatan tetap utuh dan sama terang, kalimat pandangan kedua dan baris program terbaca.
Bandingkan warna komisariat dan kedua tempat kegiatan di titik 21.05: komisariat tidak boleh tampak lebih terang atau lebih istimewa.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-19. Hasilnya hasil/video/indikator-19.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, ukuran pelat), lalu hasil zona, warna, LUFS, dan sinkron.
