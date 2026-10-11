Prompt Animasi Indikator 10 dari 44
Judul indikator: Pengetahuan mengenai ke-HMI-an dan organisasi belum optimal.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 01 Sistem Kaderisasi Berkelanjutan.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-10-v2/. Folder lama animasi/proyek/indikator-10/ jangan diubah. Folder itu boleh dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-10-v2 --format evidence --judul "Pengetahuan mengenai ke-HMI-an dan organisasi belum optimal.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-10-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat, gedung kelas, dan tiga ubin jalan lama berwarna abu penuh (setelKeadaan(..., "abu", 1)). Figur kader berwarna pion, lalu memudar (pudar) setelah tiba di ujung jalan.
Bagian 2: slot jalur kosong berwarna abu. Kader tetap pudar. Satu titik masalah: bibir jalan patah berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: ubin baru, kartu catatan, pin, dan dua garis putus berwarna zamrud (proses). Pendamping memakai warna pion dengan lencana bawaan pionPendamping. Emas hanya untuk satu rantai hasil: ketiga ubin baru di akhir Bagian 3. Komisariat melepas abu sesudah ubin menjadi emas.
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
gejala: { muat: [d.benda.gerbang, d.benda.komisariat, gerbangLK1] } (perkiraan H sekitar 13.5);
sebab: { muat: [gerbangLK1, patah, d.titik.ubin[5], tujuanKader[0], tujuanKader[3]], H: 8 };
ikhtiar: { muat: [gerbangLK1, d.titik.ubin[5], d.benda.komisariat, d.titik.puncakTangga[1], tujuanPendamping], H: 11 };
tidak ada kunci tambahan.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Kader dibaca di titik awalnya (gerbang), jadi tujuan kader ditulis sebagai Vector3.
D. Benda yang Dipakai
Dari kit:
duniaKader(v): gerbang, gedung kelas, jalan ubin, komisariat, dan tangga jenjang LK 1 sampai LK 3.
gerbangKampus({ nama: "gerbang LK 1", label: "LK 1", opsiLabel: { skala: 0.85 } }): gerbang LK 1, scale.setScalar(0.58), rotasi 0 (sudah menghadap kamera).
pion() x 4: kader terhenti, bernama kader terhenti 1 sampai kader terhenti 4. Tinggi sekitar 1.0 unit.
garisPutus({ persegi: [0.9, 0.9], warna: W.abu, lebar: 3 }) x 3: slot jalur yang tidak ada.
ubinJalan() x 3: ubin jalur baru, bernama ubin KONSTITUSI, ubin SEJARAH, ubin STRUKTUR.
kartuKecil({ simbol: "garis", warnaSimbol: W.zamrud, rebah: false, miring: 0, skala: 0.5 }) x 3: kartu catatan, tegak menghadap kamera. Titik asalnya di tepi bawah.
pin(): penanda kader yang berhenti, tinggi 0.6, titik asal di ujung bawah.
garisPutus({ titik: [...], lengkung: true, warna: W.zamrudPijar, lebar: 3 }) x 2: garis catatan (kartu ke pin) dan garis jenjang (ujung jalur baru ke LK 2).
pionPendamping(): satu pendamping (aktif: true, lencana: true bawaan).
Benda lokal:
tepiJalanPatah({ arah }): bibir jalan yang patah. Salin dari animasi/proyek/indikator-10/benda-lokal.js. Bentuknya dinding zigzag delapan titik selebar 2.0 unit, tegak lurus arah, berpusat 0.43 unit di depan titik asal ke arah arah. Titik zigzag bergantian maju 0.08 dan mundur 0.12. Dinding membentang dari y −0.18 sampai y 0.065, warna W.abuGelap, sisi ganda. Garis tepi atas zamrudPijar 3 px di y 0.075, tersembunyi, diisi ke userData.bagian.tepi supaya hanya patahan yang berdenyut. userData.bagian.denyut kosong.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "10", kategori: "KADERISASI", judul: "Pengetahuan mengenai ke-HMI-an dan organisasi belum optimal.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Belajar berhenti di LK 1. **Tidak ada jalur lanjutan** yang tercatat, jadi tidak terlihat siapa yang tertinggal."
ikhtiar:
{ teks: "**Sistem Kaderisasi Berkelanjutan** menyusun jalur belajar sesudah LK 1 sampai jenjang berikutnya.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Setiap langkah tercatat, sehingga kader yang berhenti di tengah jalan terlihat dan bisa disapa.", masuk: [17.8, 18.3], keluar: [22.6, 23.0] }
program: "Program 01".
kuis: { pertanyaan: "Setelah LK 1, adakah agenda belajar lanjutan untuk kader baru di komisariatmu?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“KAMPUS” pada d.benda.gerbang, geser [0, 2.65, 0], gaya benda, skala 0.85, masuk 0.8 sampai 1.3, keluar 5.8 sampai 6.2.
“KOMISARIAT” pada d.benda.komisariat, geser [0, 2.12, 0], gaya benda, ukuran ikut kamera (skala: () => 0.85 * 16 / v.rig.keadaan.H), masuk 1.1 sampai 1.6, keluar 6.0 sampai 6.3.
“KONSTITUSI”, “SEJARAH”, “STRUKTUR” pada ubin baru 1, 2, 3, geser [0, 0.16, 0], gaya mikro, kelas: "gelap", ax: 0.5, ay: 0.5, ukuran ikut kamera (skala: () => 1.05 * 16 / v.rig.keadaan.H). Masuk 0.3 sampai 0.7 detik sesudah ubinnya mulai muncul, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaKader(v) tanpa penyesuaian. Benda: gerbang di titik(-2.1, -0.7), kelas di titik(-2.85, -2.9), jalan enam ubin dari bawah gerbang ke depan pintu komisariat, komisariat di titik(2.6, 2.2), tangga di titik(1.2, -1.5).
Titik dunia yang dipakai: d.titik.gerbang, d.titik.ubin[2] sampai d.titik.ubin[5], d.titik.depanPintu, d.titik.puncakTangga[1].
Benda tambahan dan posisinya:
Ubin lama: lama = d.benda.jalan.userData.bagian.ubin. Ubin lama[3] sampai lama[5] disembunyikan sejak awal dan setiap frame (visible = false, userData.abaikanZona = true). Tiga ubin pertama menjadi jalan buntu.
Titik ujung: ujung = d.titik.ubin[2].clone().setY(0.065). Arah jalan: arah = d.titik.ubin[3] − ujung, y dinolkan, lalu dinormalkan.
Gerbang LK 1: ujung − arah × 0.55, y 0.065.
Bibir patah (patah): di ujung, dibuat dengan tepiJalanPatah({ arah }).
Kader i (i = 0 sampai 3): tujuanKader[i] = ujung + titik((i − 1.5) × 0.55, 0.14), y 0.065. Jalurnya [d.titik.gerbang + titik((i − 1.5) × 0.12, 0) y 0.065, gerbangLK1.position + titik((i − 1.5) × 0.2, 0), tujuanKader[i]]. Kader mulai di titik pertama jalurnya.
Slot persegi i (i = 0 sampai 2): di d.titik.ubin[3 + i], y 0.08, rotasi sama dengan lama[3 + i].rotation.
Ubin baru i: di d.titik.ubin[3 + i] dengan y 0, rotasi dan skala disalin dari lama[3 + i].
Kartu catatan i: di d.titik.ubin[3 + i] + titik(-0.6, 0.6), y 0.065, yaitu di sisi kiri bawah jalur. Bawaan hadap 45 derajat sudah menghadapkan mukanya ke kamera.
Pin: di tujuanKader[2], y 1.15 (tepat di atas kepala kader 3).
Garis catatan: titik [kartuCatatan1.position + y 0.45, titik tengah kartu catatan 1 dan pin + y 0.9, pin.position + y 0.6].
Garis jenjang: titik [d.titik.ubin[5] dengan y 0.08, titik(0.6, 0.6, 1.4), d.titik.puncakTangga[1]]. Titik tengahnya sengaja di kiri komisariat supaya garis tidak melintasi atap.
Pendamping: mulai di d.titik.depanPintu. Jalurnya [d.titik.depanPintu, d.titik.ubin[5], d.titik.ubin[4], d.titik.ubin[3], tujuanPendamping], semua y 0.065. tujuanPendamping = tujuanKader[2] + titik(-0.39, 0.46), yaitu sudut 130 derajat di kiri depan kader 3, supaya kedua figur tidak bertumpuk.
Pengecualian zona:
gerbang dan kelas: userData.penting = (t) => t < 6.0.
tangga dan komisariat: userData.penting = (t) => !(t > 6.0 && t < 13.0) (terpotong saat kamera dekat ke ujung patah).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-10/adegan.js. Dunia, benda, posisi, dan waktunya sama persis.
0.6 sampai 1.6: semua benda dunia, gerbang LK 1, dan bibir patah muncul (muncul([...d.urutan, gerbangLK1, patah], { t: 0.6, selesai: 1.6, durasi: 0.4 })). Komisariat, gedung kelas, dan lama[0] sampai lama[2] abu penuh sejak awal.
0.8 sampai 1.6: label KAMPUS dan KOMISARIAT masuk.
1.6 sampai 4.5: empat kader keluar dari gerbang kampus satu per satu. Kader i muncul pada 1.6 + 0.5i (durasi 0.2, naik: 0), lalu jalan di jalurnya dengan durasi: 1.4, lengkung: true, hadap: true. Waktu tiba: 3.0, 3.5, 4.0, 4.5.
Setiap kader menoleh sesudah tiba: di v.setiapFrame, rotasi y ditambah sin(2π × (t − tiba) / 0.85) × 30° selama 0.85 detik sesudah tiba. Tambahan ini tidak terakumulasi karena gerak kit memulihkan rotasi dasar tiap evaluasi.
Setiap kader memudar: setelKeadaan(kader, "pudar", halus(rentang(t, tiba + 0.55, tiba + 1.0))). Kader terakhir pudar penuh pada 5.5.
5.5 sampai 6.0: diam. Semua jalan kader sudah selesai sebelum 6.0, jadi beku bawaan tidak mengenai apa pun.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.4: ketiga slot persegi abu tergambar di tempat ubin yang hilang (aturTampak 0 ke 1, slot berikutnya mulai 0.15 detik sesudahnya). Sebelum 6.6 nilainya 0.
7.0 sampai 11.8: bibir patah berdenyut (denyutCermin(patah, { mulai: 7.0, selesai: 11.8 })).
8.0 sampai 10.3: keempat kader makin tidak terlihat. aturOpasitas 1 ke 0.5, kader 1 mulai 8.0, jeda 0.5, durasi 0.8 per kader. Keadaan pudar tetap 1.
10.3 sampai 13.0: adegan diam. Hanya jalan buntu, slot kosong, dan kader samar yang tersisa.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.8: slot persegi memudar (aturOpasitas 1 ke 0). Bibir patah hilang pada 13.4 (durasi 0.4, turun: 0).
13.6 sampai 15.4: ketiga ubin baru muncul berurutan di tempat ubin yang hilang (muncul, t 13.6, 14.2, 14.8, durasi 0.6). Labelnya masuk mengikuti bagian E.
15.6 sampai 16.6: garis jenjang tergambar dari ujung jalur baru ke anak tangga LK 2 (aturTampak 0 ke 1).
16.6 sampai 17.8: adegan tetap. Kalimat ikhtiar pertama keluar 17.2 sampai 17.6.
17.8 sampai 18.5: ketiga kartu catatan muncul di samping ubin baru (muncul, t 17.8, jeda 0.2, durasi 0.3).
18.6 sampai 19.2: pin muncul di atas kepala kader 3 (durasi 0.4, naik: 0.3). Bersamaan, kader 3 kembali terlihat: aturOpasitas 0.5 ke 1 dan pudar 1 ke 0. Kader lain tetap samar.
18.9 sampai 19.5: garis catatan tergambar dari kartu catatan 1 ke pin (aturTampak 0 ke 1).
19.4 sampai 21.2: pendamping muncul di d.titik.depanPintu pada 19.4 (durasi 0.2, naik: 0), lalu jalan balik di jalur baru ke tujuanPendamping (durasi: 1.8, lengkung: true, hadap: true). Tiba 21.2 dan berdiri di samping kader 3.
21.4: ketiga ubin baru klikEmas (jeda 0.15). Selesai 22.5.
21.8 sampai 22.6: abu komisariat dilepas dari 1 ke 0.
Hanya pendamping yang berjalan. Jangan menampilkan rombongan kader yang masuk komisariat.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
setiap kader tiba: putar pada tiba + 0.1 (durasi 0.65, kuat 0.25) dan padam pada tiba + 0.65 (kuat 0.35), posisi kader (sama dengan video lama);
15.6: garis-sambung (durasi 1.0) saat garis jenjang tergambar;
18.9: garis-sambung (durasi 0.6) saat garis catatan tergambar;
19.3: pintu (durasi 0.25, kuat 0.5) di komisariat saat pendamping keluar.
Langkah kader dan pendamping dibisukan sebagian: bunyi: { kuat: 0.25 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di kartu catatan atau label ubin. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada rombongan figur yang berbondong masuk komisariat sesudah ikhtiar. Paling banyak satu figur bergerak sebagai tanda arah, yaitu pendamping.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-10-v2 --periksa, lalu lihat hasil/gambar/indikator-10-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.5,9.5,14.5,19.5,22.3 bila titik bawaan tidak pas):
3: kader 1 baru tiba di bibir patah dan menoleh, kader 2 dan 3 masih berjalan dari gerbang;
5.5: keempat kader pudar berjajar di bibir patah, tiga tempat ubin sesudahnya kosong;
9.5: kamera dekat ke ujung patah, tiga slot persegi abu, bibir patah berdenyut, kader makin samar, kalimat sebab terbaca;
14.5: dua ubin baru dengan label KONSTITUSI dan SEJARAH, ubin ketiga sedang muncul, kalimat ikhtiar pertama terbaca;
19.5: tiga kartu catatan, pin di atas kader 3, kader 3 terlihat jelas, garis catatan tergambar, pendamping baru keluar pintu, kalimat ikhtiar kedua terbaca;
22.3: ketiga ubin emas, pendamping berdiri di samping kader 3, komisariat mulai melepas abu, baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-10-v2. Hasilnya hasil/video/indikator-10-v2.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, benda lokal).
