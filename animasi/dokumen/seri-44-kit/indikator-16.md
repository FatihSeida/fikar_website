Prompt Animasi Indikator 16 dari 44
Judul indikator: Basis intelektual di kampus-kampus unggulan melemah.
Kelompok Pengetahuan. Mode Ikhtiar. Program terkait 05 Penataan Ulang Fungsi Balitbang dan 09 Ruang Karya Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-16/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-16 --format evidence --judul "Basis intelektual di kampus-kampus unggulan melemah.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-16/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: kedua rak dan komisariat abu penuh. Sembilan kader berwarna pion. Ikon bidang di atas kepala mereka abu penuh (setelKeadaan(ikon, "abu", 1)).
Bagian 2: daftar minat kosong berwarna abu. Tiga lampu gagasan hanya menyala redup zamrud (nyala paling tinggi 0.4), bergantian. Satu titik masalah: daftar minat yang kosong berdenyut zamrud. Tidak ada emas.
Bagian 3: ikon bidang melepas abu menjadi zamrud bawaan. Meja riset, tanda tanya, tag bidang, dan tiga garis putus berwarna zamrud atau bawaan (proses). Lampu gagasan menyala zamrud bersama (warnaNyala: "zamrud"). Emas hanya untuk satu rantai hasil: lembar hasil riset di akhir Bagian 3. Komisariat melepas abu sesudahnya.
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
gejala: { muat: [d.benda.rakKiri, d.benda.rakKanan, komisariat, kader[6], kader[7]] };
sebab: { muat: [daftar, lampu[0], lampu[1], lampu[2]], H: 8 };
ikhtiar: { muat: [daftar, mejaRiset, lampu[0], lampu[1], lampu[2]], H: 11 };
tidak ada kunci tambahan.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaPustaka(v, { tanpa: ["meja", "kursi", "bangku", "lentera"] }): lantai dan dua rak buku (resep 16 di dokumentasi dunia, sudah diuji).
pion() x 9: kader, bernama kader K1, kader K2, kader K3, kader D1, kader D2, kader D3, kader T1, kader T2, kader T3.
ikonKubus() x 3 (bidang teknik), ikonDaun() x 3 (bidang hayati), ikonTimbangan() x 3 (bidang hukum dan sosial): ikon bidang, masing-masing anak kadernya di y 1.3.
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7.
panelKertas({ lebar: 1.4, tinggi: 1.8, baris: 9, kosong: true }): daftar minat (resep “daftar minat 16” di dokumentasi benda). Baris diisi dengan tumbuh(daftar.userData.bagian.baris[i], { sumbu: "x" }).
lampuGagasan({ radius: 0.3, tali: 0.4, warnaNyala: "zamrud" }) x 3: lampu gagasan tiap kelompok kampus.
mejaBundar({ radius: 0.6 }): meja riset di tengah. tinggiAtas = permukaan meja.
tandaTanya({ ukuran: 0.35, hadapKamera: true, tengah: true }): pertanyaan organisasi di atas meja riset.
tag({ label: "TEKNIK", rebah: false }), tag({ label: "HAYATI", rebah: false }), tag({ label: "SOSIAL", rebah: false }): tag bidang di samping lampu, tegak (rebah: false, karena tag bawaan berbaring).
garisPutus({ titik: [...], lengkung: true, warna: W.zamrudPijar, lebar: 3 }) x 3: garis dari tiap lampu ke meja riset.
lembarKertas({ rebah: false, lebar: 0.6, panjang: 0.8, garis: 4 }): lembar hasil riset.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "16", kategori: "PENGETAHUAN", judul: "Basis intelektual di kampus-kampus unggulan melemah.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Keahlian kader **tersebar dan tidak dipetakan**, jadi kader dengan minat serupa jarang dipertemukan."
ikhtiar:
{ teks: "**Balitbang yang ditata ulang** memetakan keahlian kader dan menghubungkan pertanyaan organisasi dengan kajian.", masuk: [13.6, 14.1], keluar: [16.8, 17.2] }
{ teks: "Kader dengan minat serupa dipertemukan dalam riset, dan hasilnya terbit di **Ruang Karya Kader**.", masuk: [17.4, 17.9], keluar: [22.6, 23.0] }
program: "Program 05 · Program 09".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label tag “TEKNIK”, “HAYATI”, “SOSIAL” dipasang tag sendiri lewat opsi label.
Tidak ada label tambahan lain.
F. Dunia dan Posisi
Dunia dasar duniaPustaka tanpa meja, kursi, bangku, dan lentera. Benda: lantai di titik(0, 0) (permukaan y 0.1), rakKiri di titik(-2.6, -2.8, 0.1), rakKanan di titik(2.4, -2.9, 0.1). Semua benda tambahan yang berdiri di lantai memakai y 0.1.
Titik dunia yang dipakai: d.titik.lantai.
Benda tambahan dan posisinya. Prompt lama menebar kader secara acak; di sini posisinya ditetapkan supaya tidak menabrak rak, komisariat, dan meja riset:
Kader dan ikonnya: K1 titik(-3.0, -1.2, 0.1) kubus, D1 titik(-1.1, -1.6, 0.1) daun, T1 titik(0.9, -1.5, 0.1) timbangan, K2 titik(3.0, -1.0, 0.1) kubus, T2 titik(-2.5, 0.8, 0.1) timbangan, D2 titik(2.3, 0.5, 0.1) daun, K3 titik(-1.0, 2.7, 0.1) kubus, T3 titik(0.5, 3.0, 0.1) timbangan, D3 titik(-1.4, 0.5, 0.1) daun. Urutan larik kader: K1, D1, T1, K2, T2, D2, K3, T3, D3.
Jalan di tempat: setiap kader berkeliling lingkaran kecil jari 0.25 di sekitar titiknya (lima titik jalur tertutup, lengkung: true), tanpa hadap.
Komisariat: titik(2.7, 2.6, 0.1), di sudut kanan depan lantai. Pintu di muka +z.
Daftar minat: titik(-2.9, 2.4, 0.1). Bawaan hadap panel sudah menghadap kamera.
Lampu gagasan 1, 2, 3: di atas K1, D2, T3. Titik asal di posisi kader + y 1.95, sehingga bola di atas ikon.
Tag: di pusat bola lampu + titik(0.45, 0, -0.1), tegak menghadap kamera (rebah: false).
Meja riset: titik(0, 0.6, 0.1).
Tanda tanya: di atas meja, y 0.1 + mejaRiset.userData.tinggiAtas + 0.35.
Garis lampu i: titik [pusat bola lampu i, titik tengah lampu i dan tanda tanya + y 0.4, tanda tanya].
Tujuan kader daun di sekitar meja riset (jari 1.0, sudut 0, 130, dan 230 derajat supaya tidak bertumpuk): D2 ke titik(1.0, 0.6, 0.1), D3 ke titik(-0.64, 1.37, 0.1), D1 ke titik(-0.64, -0.17, 0.1).
Lembar hasil riset: lahir di tempat tanda tanya, berdiri, menghadap kamera lewat hadap bawaannya.
Pengecualian zona:
lantai, rakKiri, dan rakKanan: userData.penting = (t) => t < 6.0.
Komisariat: userData.penting = (t) => t < 6.0 || t >= 23.0.
Kader yang tidak disebut di muat (K2, T1, K3, T2): userData.penting = (t) => t < 6.0.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/dokumen/seri-44-prompt/indikator-16.md bagian F dan G Bagian 1, dipindah ke dunia Pustaka kit di bagian F.
0.6 sampai 1.2: lantai, kedua rak, dan komisariat muncul (muncul([...d.urutan, komisariat], { t: 0.6, selesai: 1.2 })). Rak dan komisariat abu penuh.
1.0 sampai 2.0: sembilan kader muncul tersebar (muncul(kader, { t: 1.0, selesai: 2.0 })), ikon ikut muncul sebagai anak kader. Ikon abu penuh.
2.0 sampai 5.9: setiap kader berjalan pelan di tempatnya sendiri, satu putaran lingkaran kecil (jalan, durasi: 3.9). Mulai kader ke-i digeser 0.08i detik supaya langkahnya tidak serempak: jalan(kader[i], { t: 2.0 + 0.08 * i, durasi: 3.9, beku: false, ... }). Ikon tetap berputar mulai 2.0 durasi 3.9.
2.0 sampai 5.9: setiap ikon berputar pelan setengah putaran (putar(ikon, { t: 2.0, durasi: 3.9, sudut: Math.PI })).
Tidak ada kader yang saling mendekat. Putaran ikon selesai 5.9, tetapi langkah kader dengan i ≥ 2 berakhir sesudah 6.0 (sampai 6.54), jadi jalan memakai beku: false supaya tidak terbeku di tengah lingkaran.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: daftar minat muncul, abu, kesembilan barisnya kosong (garis putus-putus).
7.0 sampai 11.8: daftar minat berdenyut (denyutCermin(daftar, { mulai: 7.0, selesai: 11.8 })).
7.4 sampai 8.0: tiga lampu gagasan muncul di atas K1, D2, T3 (jeda 0.2), padam.
8.0 sampai 11.6: lampu menyala sendiri-sendiri, tidak pernah bersamaan. Lampu 1 pada 8.0 sampai 9.2, lampu 2 pada 9.2 sampai 10.4, lampu 3 pada 10.4 sampai 11.6. Setiap jendela: nyala 0 ke 0.4 dalam 0.3 detik, tahan, lalu kembali ke 0 dalam 0.3 detik terakhir.
11.6 sampai 13.0: adegan diam. Ketiga lampu padam, kader tetap tersebar.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 15.2: kesembilan baris daftar terisi satu per satu (tumbuh, sumbu x, t 13.4, jeda 0.2, durasi 0.2). Bersamaan, abu ikon kader ke-k dilepas dari 1 ke 0 pada 13.4 + 0.2k sampai 13.7 + 0.2k. Keahlian dipetakan.
15.0 sampai 15.5: meja riset muncul di tengah lantai.
15.4 sampai 15.7: tanda tanya muncul di atas meja (pertanyaan organisasi).
15.6 sampai 16.2: tag TEKNIK, HAYATI, SOSIAL muncul di samping lampu 1, 2, 3 (jeda 0.15).
16.2 sampai 17.4: adegan tetap. Kalimat ikhtiar pertama keluar 16.8 sampai 17.2.
17.4 sampai 18.2: tiga garis putus zamrud tergambar dari tiap lampu ke meja riset (aturTampak 0 ke 1, jeda 0.15, durasi 0.5).
18.2 sampai 19.8: tiga kader daun (D1, D2, D3) jalan ke tujuannya di sekitar meja riset (durasi: 1.6, lengkung: true, hadap: false). Ikon daun ikut sebagai anak, jadi hadap: false menjaga ikon tetap menghadap kamera seperti di Bagian 1.
19.8 sampai 20.2: ketiga lampu menyala bersama (nyala 0 ke 0.9, zamrud).
20.2 sampai 20.6: tanda tanya berubah menjadi lembar hasil riset (gantiBenda(tanya, lembarRiset, { t: 20.2, durasi: 0.4 })).
20.8: lembar hasil riset klikEmas.
21.2 sampai 22.0: abu komisariat dilepas dari 1 ke 0.
Kader lain tetap di tempatnya. Hanya kelompok daun yang dipertemukan, sebagai contoh satu riset.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (PENGETAHUAN).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
8.0, 9.2, 10.4: menyala (kuat 0.3) di lampu yang menyala sendirian, dan padam (kuat 0.3) 0.3 detik sebelum jendelanya berakhir;
17.4: garis-sambung (durasi 0.8) saat garis lampu tergambar;
19.8: menyala (kuat 0.6) saat ketiga lampu menyala bersama.
Langkah kader dibisukan sebagian: bunyi: { kuat: 0.2 } pada jalan Bagian 1 dan bunyi: { kuat: 0.35 } pada jalan Bagian 3.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata. Tidak boleh ada nama kampus nyata; tag hanya menyebut bidang.
Tidak boleh ada angka di daftar minat atau lembar hasil riset. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada rombongan kader yang berbondong ke komisariat sesudah riset jadi.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-16 --periksa, lalu lihat hasil/gambar/indikator-16/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.5,9.5,14.5,18.5,21.6 bila titik bawaan tidak pas):
3: sembilan kader tersebar berjalan pelan di tempat, ikon abu berputar, komisariat abu di kanan depan;
5.5: kader tetap terpisah, tidak ada yang saling mendekat;
9.5: daftar minat kosong berdenyut, lampu kedua di atas D2 menyala redup sendirian, kalimat sebab terbaca;
14.5: sebagian besar baris daftar terisi, sebagian ikon sudah zamrud, kalimat ikhtiar pertama terbaca;
18.5: tiga garis lampu sudah tergambar ke meja riset, tag bidang tampak, kader daun mulai berjalan, kalimat ikhtiar kedua terbaca;
21.6: tiga kader daun di sekitar meja, lampu menyala bersama, lembar hasil riset emas, baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-16. Hasilnya hasil/video/indikator-16.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, posisi kader yang digeser), lalu hasil zona, warna, LUFS, dan sinkron.
