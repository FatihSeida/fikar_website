Prompt Animasi Indikator 38 dari 44
Judul indikator: HMI lambat mengikuti perkembangan sosial budaya yang sangat cepat.
Kelompok Pengetahuan. Mode Ikhtiar. Program terkait 06 Pemetaan Kebutuhan Mahasiswa dan Kampus dan 08 Kurikulum Keterampilan Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-38/. Jangan mengubah folder video lain.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-38 --format evidence --judul "HMI lambat mengikuti perkembangan sosial budaya yang sangat cepat.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-38/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Sumbu dunia +z sama dengan titik(-0.707, 0.707).
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Ban dan benda zaman memakai warna bawaannya (ikon zamrud, ponsel kertas), karena benda zaman adalah dunia mahasiswa yang terus berubah, bukan benda gejala.
Bagian 2: komisariat tetap abu. Jam dinding berwarna bawaan dan menjadi satu-satunya titik masalah yang berdenyut (denyutCermin). Tidak ada emas.
Bagian 3: garis waktu, kartu temuan, garis penghubung, dan buku kurikulum berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: buku kurikulum yang selesai diperbarui lalu masuk ke pintu komisariat. Komisariat melepas abu saat buku masuk.
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
fokus: titik(-0.2, 0, 0.8);
gejala: { muat: [ban, komisariat] } (perkiraan H sekitar 13);
sebab: { muat: [komisariat, jam, titik(-0.9, -0.6, 0.3)], H: 9 };
ikhtiar: { muat: [ban, komisariat, garis, buku, titikDepanPintu], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikDepanPintu adalah tujuan buku pada G Bagian 3 nomor 8.
D. Benda yang Dipakai
Dari kit:
banKonveyor({ panjang: 6, lebar: 1.6, tinggi: 0.3, periode: 0.6 }): ban berjalan. Permukaannya bergeser lewat ban.userData.aturGeser(s). Tinggi permukaan ban.userData.tinggiAtas (0.3).
rumah(): komisariat 1.8 x 1.2 x 1.6, atap 0.7, pintu di muka +z (menghadap ban).
Benda zaman, empat jenis yang bergiliran, total 34 buah:
ponselKecil({ dokumen: 0, rebah: false, miring: 0, skala: 1.4 });
ikonKubus({ skala: 1.0 });
gelombangSinyal({ skala: 1.0 });
ikonPanah({ arah: "naik", skala: 1.0 }).
jamDinding({ besar: true }): jam berdiri di tiang, radius 0.7, pusat muka di y 1.8, menghadap kamera. Jarum lewat jam.userData.aturJarum(j, menit): jarum pendek sudah ikut maju menit / 60 jam di dalam aturJarum, jadi j diisi 10 saja.
garisWaktu({ panjang: 4.2, jarak: 1.4, label: ["SEMESTER 1", "SEMESTER 2", "SEMESTER 3"] }): garis waktu semester, memanjang ke kanan layar. Tiang penanda di garis.userData.bagian.penanda[i].
buku({ terbuka: true, warna: W.zamrud }), skala 1.5: buku kurikulum. bagian.garis[] adalah garis isi halaman, bagian.halaman[] menjadi emas.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, warna: W.zamrud, skala: 0.5 }) x 3: kartu temuan.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 2 }) x 3: garis dari penanda semester ke buku.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "38", kategori: "PENGETAHUAN", judul: "HMI lambat mengikuti perkembangan sosial budaya yang sangat cepat.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Perubahan yang dialami mahasiswa **baru disadari setelah lama terjadi**, karena tidak ada yang memantaunya secara rutin."
ikhtiar:
{ teks: "**Pemetaan Kebutuhan Mahasiswa** memantau perubahan yang dialami mahasiswa setiap semester.", masuk: [13.6, 14.1], keluar: [18.0, 18.4] }
{ teks: "**Kurikulum Keterampilan Kader** diperbarui dari temuan itu, tidak menunggu tertinggal jauh.", masuk: [18.6, 19.1], keluar: [22.6, 23.0] }
program: "Program 06 · Program 08".
kuis: { pertanyaan: "Pernahkah komisariatmu mengkaji persoalan nyata di sekitar kampus, lalu menuliskan usulan solusinya?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label SEMESTER 1 sampai 3 adalah label bawaan garisWaktu, ikut muncul dan pudar bersama garis waktu.
Label mikro “KURIKULUM” di atas buku (pada: buku, geser [0, 0.7, 0], gaya mikro), masuk 14.0 sampai 14.4. Label berjangkar buku, jadi ikut terbang dan pudar bersama buku pada 20.2 sampai 21.4.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar kit. Tanah bergrid bawaan, lalu benda di bawah ini ditaruh sendiri. Sumber tata letak Gejala adalah prompt lama animasi/dokumen/seri-44-prompt/indikator-38.md bagian F, dipadatkan supaya muat di kamera format evidence (ban 12 unit menjadi 6 unit).
Ban: pusat di titik(-0.9, -0.6), rotasi 0, sehingga ban memanjang dari kiri atas ke kanan bawah layar. Ujung awal (kiri atas) di titik(-3.02, -2.72), ujung akhir (kanan bawah) di titik(1.22, 1.52).
Jalur benda zaman: dari A = titik(-2.88, -2.58, 0.3) lurus ke B = titik(1.08, 1.38, 0.3) di garis tengah permukaan ban. Panjang 5.6 unit.
Komisariat: titik(2.3, -1.2), di sisi kanan atas ban, rotasi 0. Muka pintunya menghadap ban, berjarak sekitar 1.1 unit dari tepi ban. Pintu di titik(1.73, -0.63). Titik depan pintu titikDepanPintu = titik(1.41, -0.31, 0.5).
Jam: titik(0.9, -1.9), di kiri depan komisariat, menghadap kamera (rotasi bawaan hadap: true).
Garis waktu: pusat di titik(-1.4, 2.7), di bawah kiri ban, memanjang ke kanan layar.
Buku kurikulum: titik(2.0, 2.7), berbaring terbuka, skala 1.5, di bawah ujung akhir ban.
Titik asal kartu temuan di permukaan ban: S0 = titik(-1.96, -1.66, 0.3), S1 = titik(-0.9, -0.6, 0.3), S2 = titik(0.16, 0.46, 0.3). Titik asal kartu ada di tepi bawahnya.
Garis penghubung i: dari puncak tiang penanda i (posisi dunia garis.userData.bagian.penanda[i] + y 0.5) ke buku + y 0.15.
Pengecualian zona:
ban boleh terpotong selama kamera dekat Bagian 2 (ban.userData.penting = (t) => !(t > 6.0 && t < 14.0));
benda zaman tidak diperiksa (userData.penting = false), karena muncul dan hilang di kedua ujung ban yang bisa terpotong;
garis penghubung tidak diperiksa (userData.penting = false), karena kotak pembatas garis diagonal dilaporkan longgar.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: ban dan komisariat muncul (muncul([ban, komisariat], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.0 sampai 22.6: permukaan ban bergeser di dalam v.setiapFrame, setiap frame tanpa syarat: ban.userData.aturGeser(2.95 * tau), dengan tau = 0 sebelum 1.0, tau = t − 1.0 dari 1.0 sampai 22.0, lalu tau = 21.0 + u − u² / 1.2 dengan u = t − 22.0 dari 22.0 sampai 22.6 (melambat halus), dan tau = 21.3 sesudah 22.6. Ban tidak ikut beku format, karena prompt lama menulis ban terus bergerak.
1.6 sampai 6.0: benda zaman melaju di atas ban. Benda ke-k (k = 0, 1, 2, …) dimulai pada 1.6 + 0.55k dengan jenis bergiliran ponsel, kubus, sinyal, panah:
muncul di A selama 0.3 detik, naik: 0;
lintas dari A ke B, durasi 1.9 (2.95 unit per detik, sama dengan permukaan ban), kurva: (u) => u (linear, supaya benda tidak meluncur terhadap tekstur ban), beku: false, bunyi: false;
hilang di B saat tiba, durasi 0.3, turun: 0.
Pada Bagian 1 ada delapan benda zaman (k = 0 sampai 7, yang terakhir dimulai 5.45). Benda yang masih melaju pada 6.0 terus melaju (beku: false).
Komisariat diam di samping ban dan tertinggal oleh arus. Prompt lama menulis komisariat bergeser 0.2 unit per detik di atas ban. Di sini komisariat dibuat diam, karena posisi komisariat saat akhiriEvidence harus sama dengan posisi dasarnya. Laporkan penyimpangan ini.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.0 sampai 13.0: arus benda zaman berlanjut dengan aturan yang sama (k = 8 sampai 20, dimulai 6.0 sampai 12.6). Urutan jenis bergeser satu langkah tiap empat benda (sinyal, panah, ponsel, kubus, lalu panah, ponsel, kubus, sinyal, dan seterusnya), sehingga pola di atas ban terus berganti.
6.6 sampai 7.2: jam muncul.
6.6 sampai 12.6: jarum jam berjalan sangat pelan, dari pukul 10.10 ke 10.15 (aturJarum(10, menit), menit naik linear dari 10 ke 15). Jam yang hampir diam ini kontras dengan ban yang cepat.
7.2 sampai 12.6: denyutCermin(jam, { mulai: 7.2, selesai: 12.6 }).
Komisariat tetap abu penuh. Kamera dekat ke komisariat dan jam (H 9), sehingga ban hanya tampak sebagian di kiri.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.0 sampai 22.0: arus benda zaman tetap berjalan (k = 21 sampai 33, dimulai 13.15 sampai 19.75; benda terakhir hilang 21.65 sampai 21.95). Dunia mahasiswa tetap berubah.
13.4 sampai 14.0: garis waktu muncul bersama ketiga labelnya.
14.0 sampai 14.4: buku kurikulum muncul, warna zamrud. Semua buku.userData.bagian.garis belum tampak.
Tiga kartu temuan, i = 0, 1, 2, dengan T0 = 14.6, T1 = 15.9, T2 = 17.2:
Ti sampai Ti + 0.6: tiang penanda i berdenyut (denyutCermin(garis.userData.bagian.penanda[i], { mulai: Ti, selesai: Ti + 0.6, periode: 0.6 }));
Ti sampai Ti + 0.3: kartu temuan i muncul di Si (naik: 0);
Ti + 0.3 sampai Ti + 1.1: kartu terbang ke buku (busur, ke buku + y 0.15, tinggi 1.2, durasi 0.8);
Ti + 1.1: kartu hilang (durasi 0.2) dan sepertiga garis halaman buku tumbuh (tumbuh(bagian.garis.slice(...), { t: Ti + 1.1, durasi: 0.3, jeda: 0, sumbu: "x" }); bagi bagian.garis menjadi tiga kelompok sama banyak, berurutan, 4 garis per kelompok; bukan muncul, karena ke-12 garis memakai satu bahan bersama);
Ti + 1.1 sampai Ti + 1.5: jarum panjang jam maju 20 menit (aturJarum(10, menit): menit 15 ke 35, 35 ke 55, 55 ke 75; menit 75 berarti pukul 11.15, yaitu aturJarum(10, 75)), tanda pemantauan yang kini rutin. Jam berhenti di 11.15 sampai akhir Bagian 3.
Kartu mendarat pada 15.7, 17.0, dan 18.3.
18.6 sampai 19.4: ketiga garis penghubung tergambar dari penanda ke buku (aturTampak 0 ke 1, jeda 0.15). Kurikulum diperbarui dari temuan semester.
19.8: klikEmas(buku). Halaman buku menjadi emas.
20.2 sampai 21.2: buku melayang ke titikDepanPintu (busur, tinggi 1.2, durasi 1.0), lalu hilang di pintu pada 21.2.
21.0 sampai 21.8: abu komisariat dilepas dari 1 ke 0, sehingga komisariat kembali berwarna zamrudRedup.
22.0 sampai 22.6: ban melambat lalu berhenti (lihat G Bagian 1 nomor 2). Garis waktu dan garis penghubung tetap tampak sampai akhiriEvidence memudarkannya.
Jangan menampilkan figur yang berbondong masuk komisariat. Video ini tidak memakai figur.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (PENGETAHUAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.0: gemuruh pelan (kuat 0.25, durasi 5.0, posisi ban) saat ban mulai berjalan;
6.6: gemuruh pelan (kuat 0.2, durasi 6.0, posisi ban) selama ban terus berjalan di Bagian 2;
15.7, 17.0, 18.3: denting dengan nada 0, 1, 2 (posisi buku) saat kartu temuan masuk buku;
18.6: garis-sambung (durasi 0.8, posisi buku) saat garis penghubung tergambar.
lintas benda zaman dibisukan (bunyi: false), supaya 34 desir tidak menumpuk.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di jam, garis waktu, kartu, atau buku selain label SEMESTER 1 sampai 3. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada logo aplikasi atau merek di ponsel dan layar benda zaman.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-38 --periksa, lalu lihat hasil/gambar/indikator-38/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: ban bergaris bergerak, tiga benda zaman melaju di atasnya, komisariat abu diam di samping ban;
5.5: arus benda zaman rapat, komisariat tetap abu dan diam;
9.5: kamera dekat ke komisariat dan jam, jam berdenyut zamrud, ban terpotong di kiri, kalimat sebab terbaca;
14.5: garis waktu tiga semester dan buku terbuka tampak, kalimat ikhtiar pertama terbaca;
16.0: kartu temuan pertama sudah masuk buku, sepertiga garis halaman tampak, kartu kedua muncul dari ban;
21.5: buku emas sudah masuk pintu, komisariat sedang melepas abu, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-38. Hasilnya hasil/video/indikator-38.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, komisariat yang diam, benda lokal bila ada), lalu hasil zona, warna, LUFS, dan sinkron.
