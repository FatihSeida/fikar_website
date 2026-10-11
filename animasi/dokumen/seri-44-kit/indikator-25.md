Prompt Animasi Indikator 25 dari 44
Judul indikator: Program disusun tanpa target yang jelas.
Kelompok Target Program. Mode Ikhtiar. Program terkait 03 Indeks Kaderisasi dan 05 Penataan Ulang Fungsi Balitbang.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-25/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-25 --format evidence --judul "Program disusun tanpa target yang jelas.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-25/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Pemanah berwarna pion. Setiap anak panah menjadi abu penuh dalam 0.3 detik sesudah menancap.
Bagian 2: jalur tembak, lingkaran sasaran kosong, tanda tanya, dan balon berwarna abu atau kertas redup. Lingkaran kosong boleh berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: garis awal, penanda pantau, dan papan sasaran berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: anak panah ketujuh yang menancap di pusat papan sasaran, lalu papan sasaran itu. Komisariat melepas abu sesudahnya.
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
gejala: { muat: [d.benda.papan, d.benda.lintasan, d.benda.bendera, komisariat, pemanah, ...titikTancap] } (perkiraan H sekitar 15);
sebab: { muat: [pemanah, ...titikTancap, pusatSasaran], H: 10 };
ikhtiar: { muat: [d.benda.lintasan, d.benda.bendera, pemanah, pin1, pin3, papanSasaran, komisariat, pusatSasaran.clone().setY(3.1)], H: 11 } (lintasan dan bendera penting lagi mulai 13.0, dan titik y 3.1 di atas papan menjaga label UKURAN HASIL tetap di dalam zona; H naik otomatis).
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikTancap (enam titik) dan pusatSasaran dijelaskan di bagian F.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6, atap 0.7.
pion({ tangan: "satuNaik" }): pemanah, tangan kanan terangkat.
anakPanah() x 7: enam anak panah Bagian 1 dan satu anak panah Bagian 3. Batang jari 0.025 panjang 0.9, titik asal di ujung mata. Arah diatur dengan userData.arahkan(vektor), dipanggil sekali sebelum frame pertama.
garisPutus({ titik: [...], warna: W.abu, lebar: 3 }) x 6: jalur tembak abu.
garisPutus({ lingkaran: 1.0, warna: W.abu, lebar: 3 }): lingkaran sasaran kosong di tanah.
tandaTanya({ ukuran: 0.4, hadapKamera: true }): tanda tanya di atas lingkaran kosong, disetel abu.
balonKata({ isi: "kabur", skala: 0.5, benih: 25 }): balon di atas kepala pemanah.
papanSasaran(): tiga cincin 1.0, 0.66, 0.33 di tiang 1.2, condong 15 derajat. Tanpa label bawaan. userData.titikPusat() memberi pusat cincin.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 4 }): garis awal di tanah.
pin({ tinggi: 0.6 }) x 3: penanda pantau di sepanjang lintasan.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "25", kategori: "TARGET PROGRAM", judul: "Program disusun tanpa target yang jelas.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Program dimulai **tanpa keadaan awal dan ukuran hasil**, jadi berhasil atau gagal hanya soal perasaan."
ikhtiar:
{ teks: "**Indeks Kaderisasi** dan **Balitbang** membantu setiap program menuliskan keadaan awal dan satu ukuran hasil.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Kemajuan dipantau berkala, bukan hanya diumumkan di akhir periode.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 03 · Program 05".
kuis: { pertanyaan: "Saat menyusun program kerja, apakah setiap program komisariatmu punya target yang bisa diukur?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
“UKURAN HASIL”: label3D("UKURAN HASIL", { pada: papanSasaran, geser: [0, 2.6, 0], gaya: "kotak", kelas: "zamrud", skala: 0.7 }), masuk 14.0 sampai 14.4, keluar 22.6 sampai 23.0.
“KEADAAN AWAL”: label3D("KEADAAN AWAL", { pada: titikGarisAwal, geser: [0, 0.15, 0], gaya: "mikro" }), masuk 14.6 sampai 15.0, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaRencana(v, { tanpa: ["meja"] }) (resep 25 di docs dunia). Benda: papan di titik(-1.6, -2.6), lintasan tujuh ubin dari titik(-2.8, 2.6) ke titik(3.0, -0.3), bendera di titik(3.5, -0.7).
Titik dunia yang dipakai: d.titik.ubin[0] sampai d.titik.ubin[4], d.titik.lintasanAwal.
Dunia ini tidak punya komisariat. Tambahkan komisariat = v.tambah(rumah()) di titik(2.2, 2.2), di kanan bawah lintasan, tidak menyentuh ubin.
Benda tambahan dan posisinya:
Pemanah: berdiri di atas ubin pertama, d.titik.ubin[0] (y permukaan ubin), diputar y 160 derajat sehingga menghadap kanan atas layar searah lintasan. Prompt lama menaruhnya di titik(-2.8, 2.4), yang menimpa awal lintasan kit; ubin pertama dipakai sebagai gantinya.
tangan = posisi pemanah + y 1.0, titik lepas anak panah.
titikTancap (enam titik di tanah, y 0): A1 titik(-1.2, 0.2), A2 titik(-0.2, 2.6), A3 titik(-0.4, -0.9), A4 titik(1.6, -0.6), A5 titik(-2.6, 0.6), A6 titik(0.2, -1.6). Semua bebas dari ubin lintasan, papan, dan komisariat, tersebar di kipas ke kanan atas pemanah.
Jalur tembak ke-i: tiga titik tangan, titik tengah antara tangan dan Ai pada y 1.4, lalu Ai. y garis mengikuti titik, tidak ditempel ke tanah.
pusatSasaran = titik(2.6, -2.2). Lingkaran kosong di tanah di titik ini (y 0.02). Tanda tanya di pusatSasaran + y 1.6.
Balon kabur: titik asal ekor di atas kepala pemanah (posisi pemanah + y 1.15).
Papan sasaran: di pusatSasaran (resep kit, tidak menimpa bendera), menghadap kamera. Bila cincinnya tampak terlalu miring pada rotasi 0, putar y 45 derajat dan laporkan.
titikGarisAwal = titik tengah d.titik.ubin[0] dan d.titik.ubin[1], y 0.08. Garis awal: ruas lurus sepanjang 1.4 unit melintang tegak lurus lintasan, berpusat di titik itu (ujung-ujungnya titikGarisAwal ± titik(0.31, 0.63)).
Pin 1, 2, 3: di d.titik.ubin[2], [3], dan [4], masing-masing + titik(-0.34, -0.67), yaitu 0.75 unit di sisi atas layar lintasan.
Jalur anak panah ketujuh: tangan, d.titik.ubin[2] + y 1.0, d.titik.ubin[3] + y 1.0, d.titik.ubin[4] + y 1.0, lalu papanSasaran.userData.titikPusat() (panggil sesudah updateMatrixWorld(true)).
Pengecualian zona: papan boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). komisariat, bendera, dan lintasan boleh terpotong 6.0 sampai 13.0 ((t) => t < 6.0 || t >= 13.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.4: benda dunia, komisariat, dan pemanah muncul (muncul([...d.urutan, komisariat, pemanah], { t: 0.6, selesai: 1.4 })). Komisariat abu penuh sejak awal.
1.4 sampai 6.0: pemanah melepas enam anak panah, satu setiap 0.7 detik, pada 1.4, 2.1, 2.8, 3.5, 4.2, dan 4.9, berurutan ke A1 sampai A6.
Setiap anak panah muncul di tangan 0.15 detik sebelum dilepas (muncul, durasi 0.15, naik 0), lalu terbang dengan busur dari tangan ke titik tancapnya (tinggi 1.2, durasi 0.6). Sebelum frame pertama, arahkan ujungnya ke (Ai − tangan) dengan komponen y −0.8 kali panjang mendatarnya, sehingga anak panah menancap condong ke arah terbangnya.
Setiap anak panah abu penuh dalam 0.3 detik sesudah mendarat (setelKeadaan(anak, "abu", ...) di v.setiapFrame). Anak panah terakhir mendarat 5.5.
Tidak ada papan sasaran di layar sepanjang Bagian 1.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.6: keenam jalur tembak abu tergambar dari tangan pemanah ke masing-masing anak panah (aturTampak 0 ke 1, jeda 0.1). Jalur menyebar ke enam arah yang berbeda.
7.6 sampai 8.1: lingkaran sasaran kosong abu muncul di tanah di pusatSasaran (muncul, naik 0). Tanda tanya abu muncul di atasnya pada 7.9.
8.4 sampai 8.8: balon kabur muncul di atas kepala pemanah (muncul, naik 0.2).
9.0 sampai 12.6: denyutCermin(lingkaranKosong, { mulai: 9.0, selesai: 12.6 }). Ini satu-satunya titik masalah: tempat ukuran hasil yang tidak pernah ditulis.
12.6 sampai 13.0: adegan diam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.4: keenam jalur tembak memudar ke opacity 0 (aturOpasitas), balon kabur dan tanda tanya hilang, keenam anak panah abu hilang (jeda 0.05).
13.4 sampai 13.8: lingkaran kosong berubah menjadi papan sasaran (gantiBenda(lingkaranKosong, papanSasaran, { tempat: false })). Label “UKURAN HASIL” masuk 14.0.
14.2 sampai 14.8: garis awal zamrud tergambar melintang lintasan di depan pemanah (aturTampak 0 ke 1). Label “KEADAAN AWAL” masuk 14.6.
15.0 sampai 15.9: tiga pin pantau muncul berurutan di samping ubin ketiga, keempat, dan kelima (muncul, jeda 0.3).
16.0 sampai 17.6: adegan diam, kalimat ikhtiar pertama terbaca.
17.8 sampai 18.0: anak panah ketujuh muncul di tangan (muncul, durasi 0.2, naik 0). Sebelum frame pertama, arahkan ujungnya ke arah pusatSasaran dari tangan, mendatar.
18.2 sampai 20.2: anak panah ketujuh meluncur melewati ketiga pin lalu ke pusat papan (lintas, jalur di bagian F, lengkung: true, durasi 2.0). Hitung detik lewat setiap pin dari pada(t) hasil lintas (perkiraan 18.7, 19.2, dan 19.6).
Pada detik lewat setiap pin: pin itu bergetar kecil (getar, durasi 0.4, amp 0.03, bunyi: false).
20.2: anak panah menancap di pusat papan sasaran.
20.4: klikEmas([anakPanah7, papanSasaran], { jeda: 0.2 }).
21.4 sampai 22.2: abu komisariat dilepas dari 1 ke 0.
Pemanah tetap satu-satunya figur. Jangan menampilkan figur lain yang ikut memanah atau bersorak.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TARGET PROGRAM).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
setiap anak panah Bagian 1 saat menancap (1.4 + 0.7i + 0.6): kayu pelan (kuat 0.35, posisi anak panah itu);
9.0: gemuruh pelan (kuat 0.25, durasi 2.0) saat lingkaran kosong mulai berdenyut;
detik lewat pin 1, 2, 3: denting dengan nada 0, 1, 2 (kuat 0.5, posisi pin);
20.2: kayu (kuat 0.6, posisi papan sasaran) saat anak panah menancap.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia. Bendera dunia adalah bendera polos kit tanpa lambang.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di papan sasaran, pin, atau label. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML. Isi balon tidak terbaca (pola kabur).
Anak panah tidak boleh mengarah ke figur atau komisariat. Ini adegan sasaran, bukan kekerasan.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-25 --periksa, lalu lihat hasil/gambar/indikator-25/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: pemanah di awal lintasan, dua anak panah abu sudah menancap di tempat berbeda, anak panah ketiga sedang terbang;
5.8: enam anak panah abu tersebar, tidak ada papan sasaran;
9.5: kamera dekat, jalur tembak abu menyebar, lingkaran kosong bertanda tanya berdenyut, balon kabur di atas pemanah, kalimat sebab terbaca;
14.5: papan sasaran berdiri dengan label UKURAN HASIL, garis awal sedang tergambar, kalimat ikhtiar pertama terbaca;
19.5: anak panah ketujuh sudah melewati pin kedua, ketiga pin tampak;
21.4: anak panah menancap di pusat papan, papan dan anak panah emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-25. Hasilnya hasil/video/indikator-25.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal, rotasi papan sasaran), lalu hasil zona, warna, LUFS, dan sinkron.
