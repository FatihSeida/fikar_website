Prompt Animasi Indikator 41 dari 44
Judul indikator: Disiplin organisasi anggota dan aktivis rendah.
Kelompok Tata Kelola. Mode Ikhtiar. Program terkait 11 Pemeriksaan Kepatuhan Konstitusi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-41/. Jangan mengubah folder video lain.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-41 --format evidence --judul "Disiplin organisasi anggota dan aktivis rendah.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-41/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Sudut layar a pada lingkaran ditulis titik(R cos a, R sin a): 0° kanan layar, 90° bawah layar.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh (setelKeadaan(komisariat, "abu", 1)). Kursi kosong abu penuh. Kartu tugas yang menumpuk abu. Figur berwarna pion.
Bagian 2: balon kesepakatan berwarna kertas bawaan. Meja rapat menjadi satu-satunya titik masalah yang berdenyut (denyutCermin). Tidak ada emas.
Bagian 3: surat keputusan berwarna kertas dengan cap, kartu bercentang dengan simbol zamrud (proses). Emas hanya untuk satu rantai hasil: surat keputusan yang sudah dicap dan diperiksa. Komisariat melepas abu sesudah surat keputusan menjadi emas.
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
fokus: titik(0.2, -0.4, 0.8);
gejala: { muat: [d.benda.meja, jam, komisariat, titikDepanPintu] } (perkiraan H sekitar 12.5);
sebab: { muat: [d.benda.meja, d.benda.kursi5, d.benda.kursi6, jam], H: 9 };
ikhtiar: { muat: [d.benda.meja, komisariat, jam, titikDepanPintu, titikBelakangMeja], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikDepanPintu dan titikBelakangMeja ada di bagian F.
D. Benda yang Dipakai
Dari kit:
duniaRencana mode rapat: mejaBundar() (radius 1.3, permukaan y 0.75) dan enam kursiKotak().
rumah(): komisariat 1.8 x 1.2 x 1.6, atap 0.7.
jamDinding({ besar: true }): jam berdiri di tiang, radius 0.7, pusat muka di y 1.8, menghadap kamera. Jarum lewat jam.userData.aturJarum(j, menit): jarum pendek sudah ikut maju menit / 60 jam di dalam aturJarum, jadi j diisi 10 saja.
pion({ duduk: true }) x 5: figur duduk (dua tepat waktu sejak awal, dua yang terlambat, satu di Bagian 3).
pion() x 3: figur berjalan dari pintu komisariat ke kursi (dua yang terlambat, satu di Bagian 3). Saat tiba, figur berdiri berganti menjadi figur duduk (gantiBenda, tempat: false).
kartuKecil({ simbol: "garis", skala: 0.6 }) x 3: kartu tugas berbaring yang menumpuk di meja.
balonKata({ isi: "titik", skala: 0.6 }) x 3: balon kesepakatan Bagian 2. balonKata({ isi: "garis", skala: 0.6 }) x 1: balon kesepakatan Bagian 3.
suratKeputusan({ cap: true }), skala 0.45: surat keputusan berdiri di meja. Cap di bagian.cap, disembunyikan oleh muncul(sk.userData.bagian.cap, { t: 14.6 }) sampai 14.6 (cap: false membuat bagian.cap kosong).
kartuKecil({ simbol: "centang", skala: 0.6 }) x 5: kartu bercentang di depan kursi yang terisi.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "41", kategori: "TATA KELOLA", judul: "Disiplin organisasi anggota dan aktivis rendah.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Kesepakatan kerja **hanya diucapkan di rapat**, tidak tertulis, jadi tidak ada yang bisa diperiksa."
ikhtiar:
{ teks: "**Pemeriksaan Kepatuhan Konstitusi** memeriksa pelaksanaan kesepakatan dan keputusan forum secara rutin.", masuk: [13.6, 14.1], keluar: [17.8, 18.2] }
{ teks: "Kesepakatan ditulis dan diperiksa bersama, sehingga disiplin menjadi kebiasaan, bukan teguran.", masuk: [18.4, 18.9], keluar: [22.6, 23.0] }
program: "Program 11".
kuis: { pertanyaan: "Apakah pembagian tugas dan kewenangan setiap pengurus di komisariatmu tertulis jelas?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada.
F. Dunia dan Posisi
Dunia dasar duniaRencana(v, { rapat: { pengurus: 0, kursi: 6 }, posisi: { meja: titik(0.4, 0.8) }, tanpa: ["papan"] }). Ini resep 41 di docs dunia, tanpa papan aturan (papan aturan prompt lama tidak dipakai lagi; ruangnya dipakai komisariat). Sumber Gejala adalah prompt lama animasi/dokumen/seri-44-prompt/indikator-41.md bagian F dan G Bagian 1.
Meja di titik(0.4, 0.8). Enam kursi pada radius 1.75, kursi ke-0 paling dekat ke penonton, lalu searah jarum jam di layar. Kira-kira:
kursi 0 di 90° (bawah), kursi 1 di 150° (kiri bawah), kursi 2 di 210° (kiri atas);
kursi 3 di 270° (belakang meja), kursi 4 di 330° (kanan atas), kursi 5 di 30° (kanan bawah).
Nama kunci kit berawal dari 1: kursi ke-i adalah d.benda[kursi${i + 1}], titik lantainya d.titik.kursi[i], titik duduknya d.titik.duduk[i].
Pembagian kursi:
tepat waktu sejak awal: kursi 0 dan kursi 3;
terlambat di Bagian 1: figur A ke kursi 2, figur B ke kursi 1;
kosong: kursi 4 dan kursi 5. Kursi 4 diisi figur C di Bagian 3, kursi 5 tetap kosong sampai akhir.
Figur duduk dihadapkan ke pusat meja: sisi +z pion menghadap pusat meja.
Jam: titik(2.6, -2.6) (resep 41, sudah diuji lolos zona), menghadap kamera.
Komisariat: titik(-2.0, -2.4), di kiri belakang meja, rotasi 0. Pintu di titik(-2.57, -1.83). titikDepanPintu = titik(-2.89, -1.51).
titikBelakangMeja = titik(0.4, -1.7), di belakang kursi 3.
Tumpukan kartu tugas: di permukaan meja, titik(0.95, 1.1, 0.77), kartu ke-k di y 0.77 + 0.025k.
Depan kursi i di meja: pusat meja + titik(0.85 cos a, 0.85 sin a, 0.76), dengan a sudut kursi i.
Balon kesepakatan: titik asal (ujung ekor) di pusat meja + y 1.0.
Surat keputusan: pusat meja + titik(0, -0.1, 0.75), menghadap kamera (hadap bawaan).
Jalur figur:
A: [titikDepanPintu, d.titik.kursi[2]];
B: [titikDepanPintu, d.titik.kursi[1]];
C: [titikDepanPintu, titikBelakangMeja, d.titik.kursi[4]], lengkung: true, lewat belakang kursi 3 tanpa menabraknya.
Pengecualian zona: komisariat boleh terpotong selama kamera dekat Bagian 2 (komisariat.userData.penting = (t) => !(t > 6.0 && t < 13.0)).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: meja, kursi, jam, komisariat, dan dua figur duduk tepat waktu (kursi 0 dan 3) muncul (muncul([...d.urutan, jam, komisariat, duduk0, duduk3], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.6: kartu tugas pertama muncul di tumpukan (durasi 0.3, naik: 0), abu.
1.6 sampai 12.567: jarum jam berputar cepat, satu putaran jarum panjang per 1.4 detik: aturJarum(10, menit) dengan menit = 10 + 42.857 x (t − 1.6). Sebelum 1.6 menit = 10. Pada 12.567 menit = 480 (jarum panjang tepat di angka 12), lalu jam berhenti di situ sampai akhir Bagian 3. Jarum panjang melewati angka 12 pada 2.767, 4.167, 5.567, dan seterusnya.
2.8 sampai 4.3: figur A muncul di titikDepanPintu tepat sesudah jarum melewati angka 12 (2.8, durasi 0.3, naik: 0), berjalan ke kursi 2 (jalan, durasi 1.2, tiba 4.0, hadap: true), lalu berganti menjadi figur duduk di d.titik.duduk[2] (gantiBenda, 4.0 sampai 4.3).
4.0: kartu tugas kedua muncul di atas tumpukan.
4.2 sampai 5.9: figur B muncul di titikDepanPintu (4.2), berjalan ke kursi 1 (durasi 1.4, tiba 5.6), lalu berganti menjadi figur duduk di d.titik.duduk[1] (5.6 sampai 5.9).
5.6: kartu tugas ketiga muncul di atas tumpukan.
Kursi abu disetel tiap frame: kursi 4 dan 5 abu 1; kursi 2 abu 1 sampai 4.0 lalu turun ke 0 pada 4.0 sampai 4.3; kursi 1 abu 1 sampai 5.6 lalu turun ke 0 pada 5.6 sampai 5.9. Kartu tugas abu 1.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
Tiga balon kesepakatan, dimulai pada T = 6.8, 8.6, dan 10.4:
T sampai T + 0.3: balon muncul di atas pusat meja (naik: 0);
T + 0.3 sampai T + 1.7: balon naik 1.0 unit (lintas, durasi 1.4);
T + 0.9 sampai T + 1.7: balon menguap (hilang, durasi 0.8, turun: 0);
T + 1.3 sampai T + 1.9: kepulan kecil di titik balon menguap (debu, jumlah 6, sebar 0.3, naik 0.4, benih berbeda tiap balon).
7.4 sampai 12.4: denyutCermin(d.benda.meja, { mulai: 7.4, selesai: 12.4 }). Meja tetap kosong, tidak ada yang tertulis.
Jam terus berputar cepat. Kursi 4 dan 5 tetap kosong dan abu. Kartu tugas tetap menumpuk.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.6: balon kesepakatan berisi garis muncul di atas pusat meja.
13.8 sampai 14.2: balon berubah menjadi surat keputusan yang berdiri di meja (gantiBenda, tempat: false). Kesepakatan kini tertulis.
14.6 sampai 14.9: cap turun di surat keputusan (muncul(sk.userData.bagian.cap, { t: 14.6, durasi: 0.3, naik: 0 })).
15.2 sampai 16.6: ketiga kartu tugas, mulai dari yang paling atas, meluncur ke depan kursi 1, 2, dan 3 (lintas, durasi 0.5, mulai 15.2, 15.5, 15.8). Saat tiba (15.7, 16.0, 16.3), setiap kartu tugas berganti menjadi kartu bercentang (gantiBenda, durasi 0.3, tempat: false; kartu bercentang sudah ditaruh di depan kursinya).
16.4 sampai 16.7: kartu bercentang muncul di depan kursi 0. Keempat kursi yang terisi kini punya kartu bercentang.
18.4 sampai 20.5: figur C muncul di titikDepanPintu (18.4), berjalan lewat belakang meja ke kursi 4 (lengkung: true, durasi 1.8, tiba 20.2), lalu berganti menjadi figur duduk di d.titik.duduk[4] (20.2 sampai 20.5). Abu kursi 4 turun ke 0 pada 20.2 sampai 20.5. Hanya satu figur, sebagai tanda arah.
20.5 sampai 20.8: kartu bercentang muncul di depan kursi 4.
21.0: klikEmas(sk). Surat keputusan menjadi emas.
21.2 sampai 22.0: abu komisariat dilepas dari 1 ke 0, sehingga komisariat kembali berwarna zamrudRedup.
Kursi 5 tetap kosong dan abu. Jangan menampilkan rombongan figur yang datang. Gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
4.0 dan 5.6: kertas (kuat 0.5, posisi tumpukan) saat kartu tugas bertambah;
8.1, 9.9, 11.7: debu pelan (kuat 0.3, posisi balon) saat balon kesepakatan menguap;
14.75: cap (posisi surat keputusan) saat cap turun.
Langkah figur yang berjalan diredam: bunyi: { kuat: 0.4 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di jam, kartu, atau surat keputusan. Jam hanya memakai penanda garis bawaan. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML. Isi balon kesepakatan tidak terbaca (hanya titik atau garis).
Figur yang terlambat tidak diberi tanda teguran, label nama, atau warna berbeda. Disiplin digambarkan lewat kesepakatan tertulis, bukan hukuman.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-41 --periksa, lalu lihat hasil/gambar/indikator-41/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: jarum jam berputar cepat, dua figur duduk tepat waktu, figur A baru keluar dari pintu komisariat, empat kursi lain abu;
5.5: figur B hampir tiba di kursi 1, tumpukan kartu tugas bertambah, kursi 4 dan 5 abu;
9.5: kamera dekat ke meja, balon kesepakatan kedua sedang naik dan menguap, meja berdenyut, kursi 4 dan 5 kosong abu, kalimat sebab terbaca;
14.5: surat keputusan berdiri di meja tanpa cap, kalimat ikhtiar pertama terbaca;
16.7: kartu bercentang di depan empat kursi yang terisi, cap sudah ada di surat keputusan;
22.1: surat keputusan emas, figur C duduk di kursi 4, kursi 5 tetap kosong, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-41. Hasilnya hasil/video/indikator-41.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, papan yang ditiadakan, benda lokal bila ada), lalu hasil zona, warna, LUFS, dan sinkron.
