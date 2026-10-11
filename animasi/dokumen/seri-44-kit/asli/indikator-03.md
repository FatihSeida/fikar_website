Prompt Animasi Indikator 03 dari 44
Judul indikator: Pola perkaderan tertinggal dari tuntutan abad ke-21.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 01 Sistem Kaderisasi Berkelanjutan dan 08 Kurikulum Keterampilan Kader.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-03-v2/. Folder lama animasi/proyek/indikator-03/ (bila ada) jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-03-v2 --format evidence --judul "Pola perkaderan tertinggal dari tuntutan abad ke-21.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-03-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Sumbu dunia +z sama dengan titik(-0.707, 0.707).
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: papan tulis dan jam abu penuh (setelKeadaan(..., "abu", 1)). Komisariat abu penuh. Peserta sedikit pudar (setelKeadaan(peserta, "pudar", 0.3)). Kotak di luar jendela zamrud (dunia luar yang terus bergerak).
Bagian 2: buku materi abu dan makin berdebu. Satu titik masalah boleh berdenyut zamrud: buku materi (denyutCermin). Tidak ada emas.
Bagian 3: tangga jenjang, garis sambung, kartu tindak lanjut, kartu penilaian, dan halaman baru berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: buku materi yang sudah terbuka beserta tiga halaman barunya.
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
fokus: titik(0.4, 0.8, 0.8);
gejala: { muat: [ruang, komisariat] } (H dihitung otomatis, perkiraan 14 sampai 16);
sebab: { muat: [meja, garisWaktu, pengajar1, pengajar3, titikPegang1, titikPegang3], H: 9 };
ikhtiar: { muat: [tangga, kartuLanjut, pendamping, meja], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [meja, papan, jam, peserta1, peserta6], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikPegang1 dan titikPegang3 adalah titik pegang buku di depan pengajar 1 dan 3 (bagian F).
D. Benda yang Dipakai
Dari kit:
ruangLatihan({ jendela: [{ dinding: "kanan", lebar: 1.6, tinggi: 1.0, geser: 1.2, bawah: 0.5 }] }): ruang latihan. Lantai 6 x 0.1 x 5, dinding L setinggi 1.8, dinding kiri di tepi -x lokal dan dinding kanan di tepi -z lokal. Jendela 1.6 x 1.0 di dinding kanan. Pakai userData.dinding.kiri dan userData.dinding.kanan ({ pusat, rotasiY, panjang, tinggi }) untuk menempel papan dan jam, dan userData.atas sebagai tinggi permukaan lantai.
papanTulis({ lebar: 2.8, tinggi: 1.2, kaki: 0, debu: true }): papan dinding. Debu lewat papan.userData.aturDebu(k). Majukan bintik debu supaya tidak terbenam: papan.userData.bagian.debu.position.z += 0.03.
jamDinding({ radius: 0.35 }): jam dinding, titik asal di tepi bawah. Jarum lewat jam.userData.aturJarum(jam, menit).
kursiRendah() x 6 dan pion({ duduk: true }) x 6: peserta latihan, duduk di kursi.userData.titikDuduk.
debu({ ... }): partikel debu di depan papan.
rumah(): komisariat, diskalakan 0.8 (scale.setScalar(0.8)).
garisWaktu({ panjang: 5.4, jarak: 1.8, label: ["PERIODE 1", "PERIODE 2", "PERIODE 3"] }): garis waktu periode di lantai, sejajar layar (bawaan). Titik periode lewat garisWaktu.userData.titikPeriode(i).
pion() x 3: pengajar dari periode ke periode.
mejaKecil({ lebar: 1.0, tinggi: 0.6, dalam: 0.6 }): meja materi di depan papan.
buku({ tinggi: 0.5, lebar: 0.4, tebal: 0.12 }): buku materi tertutup, berbaring. Debu lewat lapisanDebu(buku, { jumlah: 80, benih: 3 }), lalu buku.userData.aturDebu(k).
buku({ terbuka: true, tinggi: 0.5, lebar: 0.4 }): buku materi yang dibuka. Bagian halaman[] adalah bagian emas.
tanggaJenjang(): tangga jenjang LK 1 sampai LK 3 (label ikut muncul). Titik puncak lewat tangga.userData.puncak[i] (lokal, ubah ke dunia dengan tangga.localToWorld).
kartuProker({ garis: 3, kaki: true, skala: 0.5, warna: W.zamrud }): kartu tindak lanjut.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 3 }): garis sambung dari tangga ke kartu tindak lanjut.
pionPendamping(): pendamping di samping kartu tindak lanjut.
kartuKecil({ simbol: "centang", rebah: false, miring: 0, skala: 0.4, warna: W.zamrud }) x 3: kartu penilaian peserta.
lembarKertas({ lebar: 0.34, panjang: 0.44, garis: 3 }) x 3: halaman baru, berbaring di atas buku terbuka.
Benda lokal (di benda-lokal.js):
kotakCepat() x 8: kotak padat 0.3 x 0.3 x 0.3 unit, warna W.zamrud, bahan padat kit (bahanPadat), titik asal di tengah alas, userData.penting = false, userData.abaikanZona = true. Gantinya untuk “8 kotak kecil yang melintas cepat” di prompt lama, karena kit tidak punya kotak polos.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "03", kategori: "KADERISASI", judul: "Pola perkaderan tertinggal dari tuntutan abad ke-21.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Materi diwariskan apa adanya dari angkatan ke angkatan, **tanpa pernah ditinjau** dari hasil kadernya."
ikhtiar:
{ teks: "**Sistem Kaderisasi Berkelanjutan** menyambungkan latihan dengan tindak lanjut, pendampingan, dan jenjang berikutnya.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Kurikulum Keterampilan Kader** menambah literasi data, teknologi, dan riset, lalu ditinjau dari penilaian peserta.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 01 · Program 08".
kuis: { pertanyaan: "Setelah LK 1, adakah agenda belajar lanjutan untuk kader baru di komisariatmu?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label PERIODE 1 sampai 3 milik garisWaktu ikut muncul dan hilang bersama garis waktu.
Label LK 1 sampai LK 3 milik tanggaJenjang ikut muncul bersama tangga.
Label mikro kelas zamrud “DATA”, “TEKNOLOGI”, dan “RISET” (label3D, gaya: "mikro") di atas halaman baru ke-1, ke-2, dan ke-3, pada: lembarBaru[k], geser: [0, 0.35 + 0.22 * k, 0]. Masuk 0.1 sampai 0.4 detik sesudah halamannya muncul, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Video ini tidak memakai dunia dasar (resep kit indikator 03: bangun ruangLatihan() langsung). Prompt lama meletakkan ruang di titik(0, 0.6). Di kit ruang digeser ke titik(-0.4, 0.2) supaya komisariat muat di kanan bawah tanpa menyentuh lantai. Rotasi ruang 0 (sejajar sumbu dunia, tampak belah ketupat).
Sebut PL = ruang.position + y ruang.userData.atas (pusat permukaan lantai). Semua posisi di bawah relatif terhadap PL kecuali disebut lain.
Benda Bagian 1:
Papan: di dinding.kiri.pusat, rotasi y dinding.kiri.rotasiY (menimpa hadap bawaan papan), digeser 0.08 ke dalam ruang (+x lokal), tepi bawah papan 0.45 di atas lantai.
Jam: di dinding.kanan.pusat digeser 1.4 ke arah sudut belakang (-x lokal), rotasi y dinding.kanan.rotasiY, digeser 0.06 ke dalam ruang (+z lokal), pusat jam 1.25 di atas lantai (titik asal 0.9 di atas lantai). Jarum tetap di 10.10.
Kursi dan peserta: enam titik lantai di PL + titik(0, -1.7), titik(-0.85, -0.85), titik(-1.7, 0) (baris depan, dekat papan), lalu titik(0.99, -0.71), titik(0.14, 0.14), titik(-0.71, 0.99) (baris belakang). Peserta 1 sampai 6 berurutan seperti daftar ini. Pion duduk di kursi.userData.titikDuduk (ubah ke dunia), rotasi y -90 derajat, menghadap papan.
Kotak cepat: berjalan di balik dinding kanan, di garis lokal ruang z -3.1, dari x -2.6 ke x 2.6 (ruang.localToWorld). Kotak bernomor genap beralas 0.6 di atas lantai, bernomor ganjil 0.95 di atas lantai, sehingga lewat di dalam bukaan jendela (0.5 sampai 1.5 di atas lantai). Di luar bukaan jendela kotak tertutup dinding.
Debu: pusat di depan muka papan, 0.5 ke dalam ruang dari pusat papan, y 1.0 di atas lantai, sebar: 0.9.
Komisariat: titik(3.0, 3.0) (koordinat dunia, di luar lantai ruang), rotasi 0, skala 0.8.
Benda Bagian 2:
Meja: PL + titik(-1.56, -1.56), rotasi y 90 derajat, di antara papan dan baris depan peserta.
Garis waktu: di lantai (y = PL.y), digeser sampai titikPeriode(1) jatuh di PL + titik(0.3, 1.0).
Pengajar 1 sampai 3: di titikPeriode(i) + titik(0, -0.4), rotasi y 45 derajat (menghadap kamera).
Titik pegang buku: pengajar ke-i + titik(0, 0.3, 0.45) (titikPegang1 sampai titikPegang3).
Buku materi: mulai di titikPegang1. Akhir Bagian 2 di atas meja: posisi meja + y mejaKecil.userData.tinggiAtas.
Benda Bagian 3:
Tangga: PL + titik(0.9, 1.3), rotasi 0 (naik ke kanan atas layar).
Kartu tindak lanjut: puncak anak tangga LK 3 (tangga.localToWorld(tangga.userData.puncak[2])) + titik(0.9, 0.3), di lantai.
Garis sambung: titik [puncak[0], puncak[1], puncak[2], kartuLanjut + y 0.55] dalam koordinat dunia, tanpa lengkung, y tiap puncak + 0.03.
Pendamping: kartu tindak lanjut + titik(-0.55, 0.6), rotasi y 45 derajat.
Buku terbuka: tepat di posisi buku tertutup di atas meja.
Halaman baru k (k = 0, 1, 2): di atas halaman kanan buku terbuka (posisi dunia bukuBuka.userData.bagian.halaman[1]), y + 0.012 x (k + 1), berbaring, diputar 45 derajat supaya garisnya mendatar di layar.
Kartu penilaian k: titik muncul di atas kepala peserta 4, 5, 6, yaitu titik peserta + y 1.2.
Pengecualian zona (laporkan): ruang boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). Komisariat (t) => t < 6.0. Papan, jam, kursi, dan peserta (t) => t < 6.0 || t >= 17.5. Kotak cepat abaikanZona (memang berada di balik dinding dan keluar bingkai jendela).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.8: ruang, papan, jam, kursi, peserta, dan komisariat muncul berurutan (muncul([ruang, papan, jam, ...kursi, ...peserta, komisariat], { t: 0.6, selesai: 1.8 })). Papan dan jam abu penuh sejak awal. Komisariat abu penuh sejak awal.
0.6 sampai 6.6: peserta sedikit pudar (setelKeadaan(peserta, "pudar", 0.3) di setiapFrame). Papan berdebu penuh (aturDebu(1)). Jarum jam diam di 10.10.
1.8 sampai 6.0: kedelapan kotak cepat melintas di luar jendela dari kiri atas ke kanan bawah layar, 3 unit per detik. Kotak k mulai muncul pada 1.8 + 0.22k (durasi 0.1, naik: 0, tanpa bunyi). Lintasan ke-n kotak k mulai pada 1.8 + 0.22k + 1.8n: lintas(kotak, { t, durasi: 1.73, jalur: [awal, akhir], kurva: (u) => u, beku: false, bunyi: false }). Ulangi selama awal lintasan tidak lebih dari 20.8, sehingga lintasan terakhir selesai sebelum 22.6. Di dalam ruang semuanya diam.
1.8 sampai 6.0: debu melayang naik di depan papan (debu({ pusat, mulai: 1.8, selesai: 6.0, jumlah: 14, sebar: 0.9, naik: 0.8, benih: 3 })).
Gerak debu melambat 6.0 dan berhenti 6.6 (beku bawaan). Kotak cepat tidak ikut beku.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.0: peserta dan kursi hilang bersamaan (turun: 0), supaya lantai lapang untuk garis waktu.
6.6 sampai 7.2: garis waktu dan meja muncul. Ketiga pengajar muncul berurutan (jeda 0.15).
7.2 sampai 7.6: buku materi muncul di titikPegang1 (naik: 0). Buku abu penuh, debu 0.15.
8.2 sampai 9.0: buku dioper ke pengajar 2 (busur, dari titikPegang1 ke titikPegang2, tinggi 0.6, durasi 0.8). Pengajar 1 hilang pada 9.2 (periodenya selesai).
9.0 sampai 9.4: debu buku menebal ke 0.45 (aturDebu).
9.8 sampai 10.6: buku dioper ke pengajar 3 (busur, tinggi 0.6, durasi 0.8). Pengajar 2 hilang pada 10.8. 10.6 sampai 11.0: debu ke 0.7.
11.2 sampai 12.0: pengajar 3 meletakkan buku di atas meja (busur, tinggi 0.5, durasi 0.8). Pengajar 3 hilang pada 12.2. 12.0 sampai 12.4: debu ke 0.95. Buku tetap tertutup sepanjang Bagian 2.
11.6 sampai 12.9: buku berdenyut zamrud (denyutCermin(buku, { mulai: 11.6, selesai: 12.9 })).
Kotak cepat terus melintas di luar jendela.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.4: garis waktu hilang (labelnya ikut).
13.4 sampai 13.9: tangga jenjang muncul.
14.0 sampai 14.4: kartu tindak lanjut muncul.
14.4 sampai 15.4: garis sambung tergambar dari LK 1 lewat LK 2 dan LK 3 ke kartu tindak lanjut (aturTampak 0 ke 1).
15.4 sampai 15.9: pendamping muncul di samping kartu tindak lanjut.
15.9 sampai 17.6: adegan tetap. Garis sambung dan kartu tetap zamrud.
17.6 sampai 18.1: kursi dan peserta muncul kembali di tempat semula (jeda 0.04). Pudar peserta 0 (tidak redup lagi).
18.2 sampai 18.6: buku tertutup berubah menjadi buku terbuka (gantiBenda(bukuTutup, bukuBuka, { t: 18.2, durasi: 0.4, tempat: false })). Debu ikut hilang bersama buku tertutup.
18.6 sampai 19.2: tiga kartu penilaian muncul di atas kepala peserta 4, 5, 6 (18.6, 18.9, 19.2; durasi 0.3, naik: 0.2).
19.0 sampai 20.2: kartu penilaian k terbang ke buku (busur, mulai 19.0 + 0.3k, durasi 0.6, tinggi 0.8) dan tiba 19.6, 19.9, 20.2. Saat tiba, kartu berubah menjadi halaman baru k (gantiBenda(kartu, lembarBaru[k], { durasi: 0.3, tempat: false })). Label DATA, TEKNOLOGI, RISET masuk berurutan.
20.4 sampai 21.2: papan melepas abu dan debunya (abu dan aturDebu dari 1 ke 0). 20.4 sampai 21.0: jam melepas abu.
20.6 sampai 22.4: jarum menit berputar satu putaran (jam.userData.aturJarum(10, 10 + 60 * halus(rentang(t, 20.6, 22.4)))).
21.6: buku terbuka dan ketiga halaman baru klikEmas bersamaan. Ini satu-satunya rantai emas.
Kotak cepat menyelesaikan lintasan terakhirnya sebelum 22.6. Jangan menambah figur lain.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Abu komisariat tetap 1 sampai 23.0 dan dilepas oleh akhiriEvidence.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
setiap awal lintasan kotak 0 sampai 12.6: whoosh pelan (kuat 0.2, durasi 1.73, posisi jendela) dengan sumber: "dunia luar"; kotak lain tanpa bunyi;
12.0: debu (kuat 0.5, posisi buku) saat buku mendarat di meja dengan debu tebal;
14.4: garis-sambung (durasi 1.0, posisi dari tangga ke kartu tindak lanjut);
20.6: denting (kuat 0.4, posisi jam) saat jam mulai berjalan.
Tidak ada figur yang berjalan, jadi tidak perlu peredaman langkah.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di papan, buku, kartu, atau jam. Jam hanya berupa penanda tanpa angka.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Tidak boleh ada rombongan figur yang masuk sesudah ikhtiar. Peserta yang muncul kembali adalah peserta yang sama, bukan tambahan.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-03-v2 --periksa, lalu lihat hasil/gambar/indikator-03-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: kotak zamrud terlihat di bukaan jendela, ruang di dalam diam, peserta pudar, papan berdebu, jam abu;
5.5: debu melayang di depan papan, komisariat abu tampak utuh di kanan bawah;
9.5: kamera dekat, buku di tangan pengajar 2, pengajar 1 sudah hilang, label PERIODE terbaca, kalimat sebab terbaca;
14.5: tangga dan kartu tindak lanjut tampak, garis sambung mulai tergambar dari LK 1, kalimat ikhtiar pertama terbaca;
19.9: buku terbuka, dua halaman baru sudah di atas buku, kartu ketiga sedang terbang, label DATA dan TEKNOLOGI terbaca;
22.3: buku terbuka dan halamannya emas, jarum jam bergerak, papan bersih, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-03-v2. Hasilnya hasil/video/indikator-03-v2.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, benda lokal kotakCepat, letak ruang yang digeser).
