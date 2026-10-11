Prompt Animasi Indikator 20 dari 44
Judul indikator: Peran HMI dalam gerakan mahasiswa regional dan nasional menurun.
Kelompok Tata Kelola. Mode Pandangan. Program terkait 05 Penataan Ulang Fungsi Balitbang dan 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-20/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-20 --format evidence --judul "Peran HMI dalam gerakan mahasiswa regional dan nasional menurun.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-20/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat dan podium utama abu penuh. Tiga podium lain memakai warna bawaan podium. Gema dan lembar pernyataan berwarna abu.
Bagian 2: balon kata dan pecahannya abu. Garis persegi kosong di bawah podium utama abu, dengan denyutCermin sebagai satu titik masalah. Tidak ada emas.
Bagian 3: lembar kajian berwarna zamrud (proses). Lempeng fondasi memakai gradasi bawaan fondasiLempeng. Emas hanya untuk satu rantai hasil: lempeng fondasi lalu balon sikap di atasnya. Podium utama dan komisariat melepas abu.
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
gejala: { muat: [komisariat, podiumUtama, podiumLain1, podiumLain2, podiumLain3, titik(0, -1.0, 3.8)] };
sebab: { muat: [podiumUtama, persegiKosong, titik(0, -1.0, 3.6), titik(0, -0.1)], H: 8 };
ikhtiar: { muat: [komisariat, podiumUtama, titik(0, -1.0, 3.4)], H: 11 };
tambahan: [{ t: [18.2, 19.2], muat: [komisariat, podiumUtama, titik(0, -1.0, 3.7)], H: 10 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Titik y 3.4 sampai 3.8 di atas podium utama memuat balon dan lembar yang terbang.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7.
podium({ pion: true }): podium utama, 1.0 x 1.2 x 0.8 menghadap kamera, figur di atasnya (bagian.pion).
podium({ pion: true }) x 3: podium lain, diskalakan 0.9 lewat p.scale.setScalar(0.9) sesudah dibuat (podium tidak punya opsi skala). Tanpa label.
cincin({ radius: 0.5, tebal: 0.03, warna: W.abu }) x 9: gema podium lain (aturRadius).
lembarKertas({ rebah: false, lebar: 0.5, panjang: 0.65, garis: 3 }): lembar pernyataan.
garisPutus({ persegi: [1.9, 1.9], warna: W.abu, lebar: 3 }): tanah kosong di bawah podium utama.
balonKata({ isi: "titik", skala: 0.5 }) x 4: balon pernyataan Bagian 2.
ikonRetak({ skala: 1.2 }) x 4: balon yang retak (bagian.belahan[0..1]), abu bawaan.
kartuKecil({ simbol: "garis", skala: 0.9, warna: W.zamrud }) x 5: lembar kajian, berbaring.
fondasiLempeng(): fondasi kajian di bawah podium utama, tanpa label, diskalakan 0.6 lewat fondasi.scale.setScalar(0.6) sesudah dibuat (fondasiLempeng tidak punya opsi skala; hasilnya 1.92 x 0.54 x 1.92). bagian.lempeng[0..4] dari bawah ke atas. Pada skala 0.6 setiap lempeng setebal 0.108. Kedua penskalaan dipasang sebelum gerak didaftarkan.
balonKata({ isi: "garis", skala: 0.6 }): balon sikap.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 2 }): tambatan balon sikap ke fondasi.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "20", kategori: "TATA KELOLA", judul: "Peran HMI dalam gerakan mahasiswa regional dan nasional menurun.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Sikap organisasi sering diambil **tanpa kajian yang tersimpan**, jadi mudah dipatahkan dan cepat dilupakan."
ikhtiar:
{ teks: "HMI Evidence memandang peran gerakan dibangun dari **sikap yang bisa diperiksa**, bukan dari banyaknya pernyataan.", masuk: [13.6, 14.1], keluar: [17.8, 18.2] }
{ teks: "Karena itu **Balitbang** menyiapkan kajian, dan **Arsip Organisasi** menyimpannya bersama sikap yang diambil.", masuk: [18.4, 18.9], keluar: [22.6, 23.0] }
program: "Program 05 · Program 10".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Tidak memakai dunia dasar kit. Tanah bergrid bawaan dengan alun-alun kosong. Tata letak dari prompt lama dipertahankan, ditambah komisariat.
Benda dan posisinya:
Komisariat: rumah() di titik(-2.6, -2.4), rotasi 0 (pintu di muka +z). Atap: posisi komisariat + y 1.9.
Podium utama: di titik(0, -1.0), rotasi 0 (menghadap kamera).
Podium lain 1, 2, 3: di titik(-3.4, 0.6), titik(3.2, 0.4), dan titik(0.2, 3.4), skala 0.9, rotasi 0.
Gema: cincin di posisi tiap podium lain, y 0.03.
Kepala figur podium utama: kepala(t) = posisi dunia podiumUtama.userData.bagian.pion + y 1.15, ditambah tinggi angkat podium di Bagian 3 (0 sampai 0.54).
Lembar pernyataan: muncul di titik(0, -1.0, 2.6), naik ke titik(0, -1.0, 3.6), jatuh ke titik(0, -0.1, 0.02).
Persegi kosong: di posisi podium utama, y 0.02.
Balon pernyataan k: muncul di kepala, naik ke kepala + y 0.7. Ikon retak k ditaruh di titik naik itu. Titik jatuh pecahan: titik(0, -0.4, 0.02).
Fondasi: di posisi podium utama, y 0, skala 0.6. Lempeng k menempati y 0.108 k sampai 0.108 (k + 1).
Lembar kajian k: muncul di atap komisariat + y 0.2, mendarat di posisi podium utama + titik(0, 0.75, 0.108 k + 0.05), di depan podium setinggi lempeng yang akan terbentuk.
Balon sikap: di kepala sesudah podium terangkat 0.54, yaitu kepala awal + y 0.54.
Tambatan: dari ekor balon sikap ke puncak fondasi di depan podium (posisi podium utama + titik(0, 0.75, 0.54)).
Pengecualian zona: podium lain hanya penting sebelum 6.0 ((t) => t < 6.0). Kesembilan cincin gema: userData.penting = false (boleh keluar zona sepanjang video, karena radius 2.2 tidak muat di zona walaupun H dinaikkan). komisariat boleh terpotong selama sebab ((t) => !(t > 6.0 && t < 13.0)). Pecahan retak yang sedang jatuh tidak dihitung.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 2.0: komisariat, podium utama, dan ketiga podium lain muncul berurutan dengan figurnya (muncul([...], { t: 0.6, selesai: 2.0 })). Komisariat dan podium utama abu penuh sejak awal.
2.0 sampai 4.5: podium lain memancarkan gema. Untuk m = 0, 1, 2 dan podium j = 0, 1, 2, gema mulai pada t = 2.0 + 0.7 m + 0.15 j: radius 0.5 ke 2.2 dan opacity 0.7 ke 0 dalam 0.8 detik (aturRadius dan aturOpasitas di setiapFrame, opacity 0 di luar jendelanya). Gema terakhir selesai 4.5.
4.0 sampai 4.3: lembar pernyataan muncul di atas kepala figur podium utama (muncul, naik: 0), abu.
4.3 sampai 4.9: lembar naik ke titik(0, -1.0, 3.6) (lintas, durasi 0.6) sambil berputar satu putaran (putar, sumbu y, sudut 2π, 4.3 sampai 5.1).
5.0 sampai 5.6: lembar jatuh ke tanah di depan podium (lintas, durasi 0.6), lalu hilang 5.6 sampai 6.0. Tidak ada gema dari podium utama.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: persegi kosong abu tergambar di tanah di bawah podium utama (aturTampak 0 ke 1). Podium berdiri di atas tanah kosong.
7.0 sampai 12.1: empat balon pernyataan. Untuk k = 0 sampai 3, t_k = 7.0 + 1.1 k:
t_k: balon muncul di atas kepala figur (muncul, durasi 0.3, naik: 0), abu;
t_k + 0.3 sampai t_k + 0.8: balon naik 0.7 (lintas, durasi 0.5);
t_k + 0.8: gantiBenda(balon, retak_k, { durasi: 0.2, tempat: false });
t_k + 0.8 sampai t_k + 1.1: kedua belahan merenggang ke kiri dan kanan 0.25 (geser belahan[0].position.x dan belahan[1].position.x di setiapFrame dengan halus(rentang(t, t_k + 0.8, t_k + 1.1)));
t_k + 1.0 sampai t_k + 1.5: ikon retak jatuh ke titik(0, -0.4, 0.02) (lintas, durasi 0.5);
t_k + 1.5: ikon retak hilang (durasi 0.3). Balon terakhir selesai 12.1.
10.8 sampai 12.8: denyutCermin(persegiKosong, { mulai: 10.8, selesai: 12.8 }).
12.8 sampai 13.0: adegan diam.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.8: persegi kosong memudar ke opacity 0 (aturOpasitas).
14.0 sampai 17.8: lima lembar kajian menumpuk menjadi fondasi. Untuk k = 0 sampai 4, t_k = 14.0 + 0.7 k:
t_k: lembar kajian k muncul di atas atap komisariat (muncul, durasi 0.3, naik: 0);
t_k + 0.1 sampai t_k + 0.7: lembar melayang ke depan podium utama (busur, tinggi 1.5, durasi 0.6);
t_k + 0.7: gantiBenda(lembar, fondasi.userData.bagian.lempeng[k], { durasi: 0.3, tempat: false });
t_k + 0.7 sampai t_k + 1.0: podium utama beserta figurnya naik dari y 0.108 k ke y 0.108 (k + 1) (lintas, durasi 0.3), sehingga podium selalu berdiri di atas lempeng teratas. Lempeng terakhir terbentuk 17.8. Podium kini berdiri di atas fondasi setinggi 0.54.
18.0 sampai 18.6: abu podium utama dilepas dari 1 ke 0.
18.4 sampai 18.9: balon sikap muncul di atas kepala figur (muncul, durasi 0.5, naik: 0). Balon ini diam dan tidak retak.
19.0 sampai 19.6: tambatan zamrud tergambar dari ekor balon ke puncak fondasi (aturTampak 0 ke 1).
20.0 sampai 21.3: klikEmas(fondasi.userData.bagian.lempeng, { t: 20.0, jeda: 0.12 }), dari lempeng bawah ke atas.
21.0: klikEmas(balonSikap).
21.2 sampai 22.0: abu komisariat dilepas dari 1 ke 0.
22.0 sampai 23.0: adegan diam. Podium lain tetap seperti semula. Jangan menampilkan figur yang berbondong ke podium utama.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
2.0: gemuruh pelan (kuat 0.3, durasi 2.5) selama gema podium lain, posisi titik(0, 0.4);
7.8, 8.9, 10.0, 11.1: retak (kuat 0.5) saat balon retak, posisi podium utama;
14.7, 15.4, 16.1, 16.8, 17.5: kayu nada 0 sampai 4 saat lempeng terbentuk, posisi podium utama.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, nama cabang dan komisariat nyata, atau nama organisasi lain. Podium lain tanpa label.
Tidak boleh ada teks terbaca di balon atau lembar. Isi balon hanya titik dan garis. Tidak ada angka.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-20 --periksa, lalu lihat hasil/gambar/indikator-20/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: gema abu mengembang dari tiga podium lain, podium utama abu dan diam;
5.5: lembar pernyataan jatuh di depan podium utama tanpa gema;
9.5: kamera dekat, persegi kosong di bawah podium, satu balon sedang retak dan jatuh, kalimat sebab terbaca;
14.5: lembar kajian pertama melayang dari komisariat ke podium, kalimat pandangan pertama terbaca;
18.1: podium berdiri di atas lima lempeng fondasi;
22.1: lempeng fondasi dan balon sikap emas, tambatan zamrud tampak, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-20. Hasilnya hasil/video/indikator-20.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, skala fondasi), lalu hasil zona, warna, LUFS, dan sinkron.
