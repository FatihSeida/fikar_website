Prompt Animasi Indikator 43 dari 44
Judul indikator: Keberhasilan masa lalu tidak dipelihara, ditingkatkan, dan dikonsolidasikan sebagai modal perjuangan.
Kelompok Evaluasi dan Arsip. Mode Ikhtiar. Program terkait 10 Arsip dan Memori Organisasi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-43/. Jangan mengubah folder video lain.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-43 --format evidence --judul "Keberhasilan masa lalu tidak dipelihara, ditingkatkan, dan dikonsolidasikan sebagai modal perjuangan.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-43/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh (setelKeadaan(komisariat, "abu", 1)). Ketiga piala memudar ke abu dan berdebu. Kilat piala saat muncul memakai denyut zamrud, bukan emas.
Bagian 2: piala tetap abu dan berdebu, dan menjadi satu-satunya titik masalah yang berdenyut (denyutCermin). Figur berwarna pion. Tidak ada emas.
Bagian 3: map langkah kerja berwarna kertas dengan tab bawaan, kartu langkah berwarna kertas dengan garis zamrud (proses). Emas hanya untuk satu rantai hasil: map langkah kerja yang diserahkan kepada pengurus baru. Debu dan abu piala hilang sesudah map menjadi emas, lalu komisariat melepas abu.
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
fokus: titik(-0.2, 0, 1.0);
gejala: { muat: [d.benda.lemari, d.benda.garisWaktu, komisariat] } (perkiraan H sekitar 13);
sebab: { muat: [d.benda.lemari, titikBaru], H: 9 };
ikhtiar: { muat: [d.benda.lemari, komisariat, meja, titikLama, titikBaru], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikBaru dan titikLama ada di bagian F.
D. Benda yang Dipakai
Dari kit:
duniaArsip: lemari({ kaca: true }) berisi tiga piala, dan garisWaktu dengan label PERIODE 1 sampai 4.
rumah(): komisariat 1.8 x 1.2 x 1.6, atap 0.7.
pionMuda(): pengurus baru, skala 0.85.
pion({ cincinTipis: true }): pengurus lama, cincin kaki tipis tampak lewat setelKeadaan(lama, "aktif", 1).
balonKata({ isi: "tanya", skala: 0.6 }): balon tanya pengurus baru.
mejaKecil({ lebar: 0.8, tinggi: 0.6, dalam: 0.5 }): meja kecil di samping lemari.
map({ lembar: 3 }), skala 0.7: map langkah kerja, berbaring.
kartuKecil({ simbol: "garis", skala: 0.35 }) x 3: kartu langkah.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "43", kategori: "EVALUASI DAN ARSIP", judul: "Keberhasilan masa lalu tidak dipelihara, ditingkatkan, dan dikonsolidasikan sebagai modal perjuangan.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Yang diwariskan hanya **cerita suksesnya**, bukan cara meraihnya, jadi keberhasilan tidak bisa diulang."
ikhtiar:
{ teks: "**Arsip dan Memori Organisasi** mendokumentasikan cara meraih keberhasilan, langkah demi langkah.", masuk: [13.6, 14.1], keluar: [17.8, 18.2] }
{ teks: "Serah terima memindahkan cara kerja itu kepada pengurus berikutnya, bukan hanya jabatan.", masuk: [18.4, 18.9], keluar: [22.6, 23.0] }
program: "Program 10".
kuis: { pertanyaan: "Saat serah terima kepengurusan, apa yang dipindahkan kepada pengurus baru?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label PERIODE 1 sampai 4 adalah label bawaan garisWaktu, ikut bergeser lewat geserPenanda.
Label mikro “LANGKAH KERJA” di atas map (pada: map, geser [0, 0.35, 0], gaya mikro), masuk 13.2 sampai 13.6. Label berjangkar map, jadi ikut berpindah bersama map.
F. Dunia dan Posisi
Dunia dasar duniaArsip(v, { tanpa: ["folder"], opsi: { lemari: { kaca: true }, garisWaktu: { panjang: 5.4, jarak: 1.35 } }, posisi: { garisWaktu: titik(0.2, 2.6) } }). Ini resep 43 di docs dunia. Folder ditiadakan supaya ada ruang untuk komisariat. Garis waktu dipendekkan dari 7.2 ke 5.4 (tetap empat periode) supaya muat di kamera format evidence. Sumber Gejala adalah prompt lama animasi/dokumen/seri-44-prompt/indikator-43.md bagian F dan G Bagian 1.
Lemari kaca di titik(-2.6, -1.4), rotasi y 20° (bawaan dunia). Piala: d.benda.lemari.userData.bagian.piala[i], alasnya di d.titik.piala[i], debu lewat piala.userData.aturDebu(k). Pintu lewat d.benda.lemari.userData.aturPintu(kKiri, kKanan).
Garis waktu di titik(0.2, 2.6), memanjang ke kanan layar. Geser lewat d.benda.garisWaktu.userData.geserPenanda(s).
Komisariat: titik(2.6, -1.4), rotasi 0. Pintu di titik(2.03, -0.83). titikDepanPintu = titik(1.71, -0.51).
titikBaru = d.titik.depanLemari + titik(0.5, 0.35): tempat pengurus baru berdiri di depan lemari, tanpa menutupi piala.
Meja kecil: titik(-1.1, -0.8), rapat di kanan lemari. Map berbaring di atas meja, titikMap = posisi meja + y 0.63.
titikLama = titik(-0.9, 0.0): tempat pengurus lama, di depan kanan meja kecil, menghadap pengurus baru.
Titik dada untuk serah terima: dada lama = titikLama + y 0.6, dada baru = titikBaru + y 0.5.
Titik muncul kartu langkah i: di depan kaca, sejajar piala i, d.titik.piala[i] + titik(-0.25, 0.55, 0.35).
Pengecualian zona: garis waktu dan komisariat boleh terpotong selama kamera dekat Bagian 2 (userData.penting = (t) => !(t > 6.0 && t < 13.0)).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: lemari kaca, garis waktu, dan komisariat muncul (muncul([...d.urutan, komisariat], { t: 0.6, selesai: 1.6 })). Ketiga piala belum tampak. Komisariat abu penuh sejak awal.
1.6 sampai 3.0: ketiga piala muncul di rak lemari, piala ke-i pada 1.6 + 0.5i (muncul, durasi 0.4, naik: 0). Kilat kecil sesudah tiap piala muncul: denyutCermin(piala[i], { mulai: 1.9 + 0.5i, selesai: 2.5 + 0.5i, periode: 0.6 }), satu denyut lalu padam.
3.0 sampai 6.0: debu menumpuk perlahan di ketiga piala (aturDebu(k), k naik 0 ke 1) dan piala memudar ke abu (setelKeadaan(piala, "abu", k)), keduanya dengan halus(rentang(t, 3.0, 6.0)).
3.0 sampai 6.0: garis waktu bergeser maju satu periode (geserPenanda(1.35 * halus(rentang(t, 3.0, 6.0)))). Penanda periode bergeser ke kiri.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 8.6: pengurus baru muncul di titikDepanPintu (durasi 0.3, naik: 0), lalu berjalan ke titikBaru (jalan, durasi 2.0, hadap: true, jalur: [titikDepanPintu, titikBaru + titik(0, 1.0), titikBaru], lengkung: true). Ruas terakhir jalur mengarah ke atas layar, jadi dengan hadap: true figur tiba dalam keadaan menghadap ke arah lemari.
8.8 sampai 9.2: balon tanya muncul di atas kepala pengurus baru (titik asal ekor di titikBaru + y 1.0). Balon tetap tampak sampai 19.0.
9.4 sampai 12.4: denyutCermin(d.benda.lemari.userData.bagian.piala, { mulai: 9.4, selesai: 12.4 }). Yang tersisa hanya piala berdebu, tanpa cara meraihnya.
10.2 sampai 12.2: garis waktu bergeser satu periode lagi. Nilai geser total = 1.35 * halus(rentang(t, 3.0, 6.0)) + 1.35 * halus(rentang(t, 10.2, 12.2)). Periode terus berganti.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.2 sampai 13.6: meja kecil dan map langkah kerja muncul di samping lemari (jeda 0.1). Label “LANGKAH KERJA” masuk bersama map.
Tiga kartu langkah, i = 0, 1, 2, mulai Ti = 13.8, 14.5, dan 15.2:
Ti sampai Ti + 0.2: kartu langkah muncul di depan kaca, sejajar piala i (naik: 0);
Ti + 0.2 sampai Ti + 0.8: kartu terbang ke titikMap (busur, tinggi 0.5, durasi 0.6);
Ti + 0.8: kartu hilang di map (durasi 0.2). Setiap piala menyumbang satu langkah caranya.
Kartu mendarat pada 14.6, 15.3, dan 16.0.
16.0 sampai 16.4: pengurus lama muncul di titikLama dengan cincin kaki tipis, menghadap pengurus baru.
16.6 sampai 17.2: map berpindah dari meja ke dada pengurus lama (lintas, durasi 0.6).
18.6 sampai 19.4: serah terima. Map berpindah dari dada pengurus lama ke dada pengurus baru (lintas, durasi 0.8).
19.0 sampai 19.3: balon tanya pengurus baru hilang.
19.8: klikEmas(map). Map menjadi emas.
20.0 sampai 21.0: debu ketiga piala hilang (aturDebu 1 ke 0) dan abu piala dilepas (1 ke 0).
21.0 sampai 21.8: abu komisariat dilepas dari 1 ke 0, sehingga komisariat kembali berwarna zamrudRedup.
Jangan menampilkan rombongan pengurus yang datang. Cukup dua figur yang bertukar map.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (EVALUASI DAN ARSIP).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.9, 2.4, 2.9: menyala pelan (kuat 0.4, nada 0, 1, 2, posisi piala i) saat kilat piala;
3.0: debu (kuat 0.3, posisi lemari) saat debu mulai menumpuk;
18.6: kertas (kuat 0.5, posisi titikLama) saat map diserahkan;
20.0: debu (kuat 0.4, posisi lemari) saat debu piala hilang.
Langkah pengurus baru diredam: bunyi: { kuat: 0.4 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka atau tulisan di piala, map, atau kartu langkah, selain label “LANGKAH KERJA” dan label PERIODE. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
Pengurus lama bukan tokoh nyata: tanpa nama, tanpa jabatan tertulis, tanpa ciri yang bisa dikenali.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-43 --periksa, lalu lihat hasil/gambar/indikator-43/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: lemari kaca dengan tiga piala, piala ketiga baru berkilat, debu belum tampak;
5.5: ketiga piala abu dan berdebu, penanda periode bergeser ke kiri;
10.0: kamera dekat ke lemari, pengurus baru berdiri di depan lemari dengan balon tanya, piala berdenyut, kalimat sebab terbaca;
14.5: meja kecil dan map tampak, kartu langkah pertama sedang terbang ke map, kalimat ikhtiar pertama terbaca;
17.5: map di dada pengurus lama, kedua figur berhadapan;
21.3: map emas di dada pengurus baru, piala bersih dari debu, balon tanya sudah hilang, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-43. Hasilnya hasil/video/indikator-43.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, folder yang ditiadakan, garis waktu yang dipendekkan, benda lokal bila ada), lalu hasil zona, warna, LUFS, dan sinkron.
