Prompt Animasi Indikator 17 dari 44
Judul indikator: Tindak lanjut perkaderan tidak berjalan sebagaimana mestinya.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 01 Sistem Kaderisasi Berkelanjutan, 02 Jaringan Pendamping dan Instruktur, dan 03 Indeks Kaderisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-17/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-17 --format evidence --judul "Tindak lanjut perkaderan tidak berjalan sebagaimana mestinya.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-17/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh (setelKeadaan(komisariat, "abu", 1)). Penanda bulan abu. Sertifikat abu. Figur berwarna pion; figur yang berhenti di penanda bulan berubah abu.
Bagian 2: tumpukan sertifikat abu, dengan denyutCermin sebagai satu titik masalah. Figur yang berhenti memudar (pudar). Tidak ada emas.
Bagian 3: garis waktu, penanda bulan, kartu catatan, dan cincin aktif berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: cincin kaki kader di BULAN 3 yang didatangi pendamping. Komisariat melepas abu sesudah cincin itu menjadi emas.
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
gejala: { muat: [d.benda.gerbang, d.benda.komisariat, kader[0], kader[7]] } (perkiraan H sekitar 13.5);
sebab: { muat: [tumpukan, puncakTumpukan, berhenti[1], berhenti[5]], H: 9 }, dengan puncakTumpukan = d.titik.lapangan + y 1.2 (Vector3);
ikhtiar: { muat: [d.benda.gerbang, d.benda.komisariat, pin[0], pin[2]], H: 11 };
tambahan: [{ t: [17.6, 18.6], muat: [pin[2], berhenti[5], d.titik.depanPintu, d.benda.komisariat, tujuanPendamping], H: 10 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. kader[i] dibaca di posisi barisnya, jadi untuk kader yang berhenti di penanda, masukkan titik berhentinya (berhenti[i], Vector3, bagian F) di muat, bukan bendanya.
D. Benda yang Dipakai
Dari kit:
duniaKader (gerbang, jalan, komisariat). gerbangKampus memakai label: "LK 1".
pion() x 8: kader peserta LK, tinggi sekitar 1.0 unit.
sertifikat({ segel: true, skala: 0.3 }) x 8: sertifikat Bagian 1, berdiri menghadap kamera (bawaan).
sertifikat({ segel: true, skala: 0.3 }) x 8: sertifikat yang terbang ke tumpukan di Bagian 2.
tumpukanKertas({ jumlah: 8, rapi: true, tumpukan: 1, ukuran: [0.85, 0.1, 0.6], benih: 17 }): tumpukan sertifikat. Lembarnya userData.bagian.kertas[k], letak rapinya userData.tataRapi[k].posisi (lokal). Pastikan urutan k dari bawah ke atas; bila terbalik, balik indeksnya dan laporkan.
pin({ tinggi: 0.6 }) x 3: penanda BULAN 1, BULAN 2, BULAN 3.
garisPutus({ titik: [...], lengkung: true, warna: W.zamrudPijar, lebar: 3 }): garis waktu sesudah LK di sepanjang jalan.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.5, warna: W.zamrud }) x 3: kartu catatan Indeks Kaderisasi di samping tiap penanda.
pionPendamping(): pendamping (cincin aktif dan lencana bawaan).
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "17", kategori: "KADERISASI", judul: "Tindak lanjut perkaderan tidak berjalan sebagaimana mestinya.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Keberhasilan LK diukur dari jumlah peserta, **bukan dari siapa yang masih aktif** sesudahnya."
ikhtiar:
{ teks: "**Indeks Kaderisasi** mencatat keaktifan kader setelah latihan, bukan hanya jumlah pesertanya.", masuk: [13.6, 14.1], keluar: [17.6, 18.0] }
{ teks: "**Pendamping** dari jaringan pendamping menyapa kader yang mulai menghilang sebelum terlambat.", masuk: [18.2, 18.7], keluar: [22.6, 23.0] }
program: "Program 01 · Program 02 · Program 03".
kuis: { pertanyaan: "Tiga bulan setelah LK 1, berapa banyak peserta dari komisariatmu yang masih aktif?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label gerbang “LK 1” lewat opsi: { gerbang: { label: "LK 1", opsiLabel: { masuk: [1.0, 1.4], keluar: [22.6, 23.0] } } }.
Label mikro “BULAN 1”, “BULAN 2”, “BULAN 3” di atas masing-masing pin, geser: [0, 0.75, 0], gaya mikro. Masuk bersama pinnya, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaKader(v, { tanpa: ["kelas", "tangga"], opsi: { gerbang: { label: "LK 1", opsiLabel: { ... } } } }). Benda: gerbang di titik(-2.1, -0.7), jalan enam ubin dari gerbang ke pintu komisariat, komisariat di titik(2.6, 2.2).
Titik dunia yang dipakai: d.titik.depanGerbang, d.titik.ubin[0] sampai d.titik.ubin[5], d.titik.depanKomisariat, d.titik.depanPintu, d.titik.lapangan.
Benda tambahan dan posisinya:
Kader 1 sampai 8 (kader[0] sampai kader[7]): satu baris sejajar layar di d.titik.depanGerbang + titik(-1.575 + 0.45 i, 0), i = 0 sampai 7, dari kiri ke kanan.
Sertifikat Bagian 1: di atas kepala tiap kader, posisi kader + titik(0, 0, 1.35). Tujuan “masuk ke tangan”: posisi kader + titik(0, 0.25, 0.55).
Pin 1, 2, 3: di d.titik.ubin[1], d.titik.ubin[3], dan d.titik.ubin[5], masing-masing + titik(-0.65, 0.65) (sisi kiri bawah jalan), y 0.
Titik berhenti kader (berhenti[i] untuk kader[i]). Pasangan A (kader[7] dan kader[6]) ke d.titik.depanKomisariat + titik(-0.35, 0) dan + titik(0.35, 0). Pasangan B (kader[5] dan kader[4]) ke d.titik.ubin[5] + titik(0.25, -0.25) dan + titik(-0.25, 0.25). Pasangan C (kader[3] dan kader[2]) ke d.titik.ubin[3] dengan geser yang sama. Pasangan D (kader[1] dan kader[0]) ke d.titik.ubin[1] dengan geser yang sama.
Jalur tiap kader: [posisi baris, d.titik.ubin[1], ..., ubin terakhir sebelum tujuan, titik berhenti], lengkung: true. d.titik.ubin[0] tidak dipakai karena letaknya tepat di gerbang, di belakang baris, sehingga kader akan mundur dulu; pasangan D langsung dari posisi baris ke titik berhenti. Dengan durasi yang sama, laju menjadi sekitar 1.9 sampai 2.6 unit per detik.
Tumpukan sertifikat: di d.titik.lapangan. Titik muncul sertifikat Bagian 2: d.titik.lapangan + titik(0.6, -0.6, 1.8).
Garis waktu: titik [d.titik.ubin[0], ..., d.titik.ubin[5], d.titik.depanPintu] dengan y 0.08 (di atas ubin).
Kartu catatan i: di posisi pin i + titik(-0.45, 0), berdiri di tanah, tegak menghadap kamera.
Pendamping: muncul di d.titik.depanPintu. tujuanPendamping = titik berhenti kader[5] + titik(0.35, 0.6), yaitu di depan pintu, samping kanan bawah kader itu (di luar alas komisariat, 0.8 dari kader[4]).
Pengecualian zona: gerbang dan komisariat boleh terpotong selama kamera sebab (userData.penting = (t) => !(t > 6.0 && t < 13.0)). Tumpukan tidak dihitung sesudah 13.4 ((t) => t < 13.4).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: semua benda dunia dan ketiga pin muncul (muncul([...d.urutan, ...pin], { t: 0.6, selesai: 1.6 })). Komisariat dan pin abu penuh sejak awal.
1.0 sampai 1.4: delapan kader muncul di barisnya (muncul(kader, { t: 1.0, selesai: 1.4, naik: 0 })).
1.4 sampai 1.9: delapan sertifikat muncul di atas kepala kader (muncul, naik: 0, selesai: 1.9), abu.
1.9 sampai 2.2: sertifikat turun ke dada kader (lintas, durasi 0.3), lalu hilang 2.1 sampai 2.4 (durasi 0.3), seolah masuk ke tangan.
2.4 sampai 5.6: kader berangkat dari ujung kanan baris lebih dulu supaya tidak saling menembus (jalan, bunyi: { kuat: 0.25 }, pakai durasi):
kader[7] t 2.4 dan kader[6] t 2.6, durasi 2.9, tiba 5.3 dan 5.5 di depan komisariat;
kader[5] t 2.8 dan kader[4] t 3.0, durasi 2.4, tiba 5.2 dan 5.4 di BULAN 3;
kader[3] t 3.2 dan kader[2] t 3.4, durasi 1.7, tiba 4.9 dan 5.1 di BULAN 2;
kader[1] t 3.6 dan kader[0] t 3.8, durasi 1.0, tiba 4.6 dan 4.8 di BULAN 1.
Kader pasangan B, C, dan D berubah abu dalam 0.4 detik sejak tiba (setelKeadaan(k, "abu", ...)). Mereka berhenti dan tidak melanjutkan. Hanya pasangan A yang sampai di depan komisariat; keduanya tetap berwarna pion.
Semua kader sudah tiba sebelum 6.0, jadi beku bawaan tidak menahan siapa pun di tengah jalan.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
7.0 sampai 11.3: delapan sertifikat Bagian 2 datang satu per satu ke tumpukan. Untuk k = 0 sampai 7, t_k = 7.0 + 0.45 k:
t_k: sertifikat k muncul di titik muncul (muncul, durasi 0.25, naik: 0), abu;
t_k + 0.25: busur ke tumpukan.localToWorld(tataRapi[k].posisi) + y 0.05, tinggi 0.8, durasi 0.6;
t_k + 0.85: gantiBenda(sertifikat, tumpukan.userData.bagian.kertas[k], { durasi: 0.3, tempat: false }). Tumpukan bertambah tinggi lapis demi lapis sampai delapan lapis pada 11.3. Seluruh tumpukan abu.
7.4 sampai 11.2: enam kader yang berhenti memudar satu per satu (setelKeadaan(k, "pudar", ...), masing-masing 0.8 detik):
kader[1] 7.4 sampai 8.2 dan kader[0] 8.0 sampai 8.8, ke 0.85;
kader[3] 8.6 sampai 9.4 dan kader[2] 9.2 sampai 10.0, ke 0.85;
kader[5] 9.8 sampai 10.6 dan kader[4] 10.4 sampai 11.2, hanya ke 0.45 (mulai menghilang).
11.0 sampai 12.8: denyutCermin(tumpukan, { mulai: 11.0, selesai: 12.8 }). Yang dihitung hanya tumpukan, sementara figur di sisi lain hilang tanpa catatan.
12.8 sampai 13.0: adegan diam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.8: tumpukan sertifikat hilang (lembarnya ikut).
13.6 sampai 14.4: ketiga pin melepas abu ke zamrud (setelKeadaan(pin, "abu", 1 - ...)).
13.6 sampai 14.6: garis waktu zamrud tergambar dari gerbang ke pintu komisariat (aturTampak 0 ke 1).
14.6, 15.2, dan 15.8: kartu catatan 1, 2, dan 3 muncul di samping pin BULAN 1, 2, dan 3 (muncul, durasi 0.4, naik: 0).
16.4 sampai 16.8: kedua kader pasangan A mendapat cincin aktif zamrud (setelKeadaan(k, "aktif", ...) 0 ke 1). Kader yang pudar tetap pudar: catatan menunjukkan siapa yang masih aktif dan siapa yang mulai hilang.
17.8 sampai 18.2: pendamping muncul di d.titik.depanPintu (muncul, naik: 0).
18.2 sampai 19.4: pendamping berjalan ke tujuanPendamping di samping kader[5] (jalan, durasi 1.2, lengkung: true).
19.6 sampai 20.4: kader[5] pulih. Pudar 0.45 ke 0 dan abu 1 ke 0.
20.2 sampai 20.6: cincin aktif kader[5] tampak (aktif 0 ke 1).
20.6: klikEmas(kader[5]). Hanya cincin kakinya yang menjadi emas (pion tidak melonjak).
20.8 sampai 21.6: abu komisariat dilepas dari 1 ke 0.
21.6 sampai 23.0: adegan diam. Kader lain yang pudar tetap pudar. Jangan menampilkan rombongan figur yang kembali atau berbondong ke komisariat.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
2.1: kertas (kuat 0.4) saat sertifikat masuk ke tangan, posisi kader[3];
7.4: gemuruh pelan (kuat 0.25, durasi 4.0) selama figur memudar, posisi kader[3];
14.6, 15.2, 15.8: denting nada 0, 1, 2 saat kartu catatan muncul, posisi pin masing-masing;
19.6: menyala (kuat 0.5) saat kader[5] pulih.
Langkah kader dibisukan sebagian: bunyi: { kuat: 0.25 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di sertifikat, kartu, atau tumpukan. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh menggambarkan semua kader yang pudar kembali aktif. Hanya satu kader yang dipulihkan pendamping.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-17 --periksa, lalu lihat hasil/gambar/indikator-17/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: sertifikat sudah masuk, kader berangkat satu per satu di jalan, belum ada yang berhenti;
5.5: pasangan BULAN 1 dan BULAN 2 sudah berhenti dan abu, pasangan BULAN 3 baru tiba, dua kader di depan komisariat;
9.5: kamera dekat, tumpukan sertifikat sudah beberapa lapis dan sertifikat berikutnya melayang, kader BULAN 1 sudah pudar, kalimat sebab terbaca;
14.5: tumpukan sudah hilang, garis waktu zamrud tergambar, pin zamrud, kalimat ikhtiar pertama terbaca;
19.7: pendamping berdiri di samping kader BULAN 3 yang mulai pulih;
21.7: cincin kader itu emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-17. Hasilnya hasil/video/indikator-17.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, urutan lembar tumpukan, benda lokal), lalu hasil zona, warna, LUFS, dan sinkron.
