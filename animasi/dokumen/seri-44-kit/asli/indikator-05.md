Prompt Animasi Indikator 05 dari 44
Judul indikator: Sebagian aparat organisasi, seperti Badko, kurang berfungsi.
Kelompok Tata Kelola. Mode Ikhtiar. Program terkait 11 Pemeriksaan Kepatuhan Konstitusi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-05-v2/. Folder lama animasi/proyek/indikator-05/ jangan diubah, tetapi wajib dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-05-v2 --format evidence --judul "Sebagian aparat organisasi, seperti Badko, kurang berfungsi.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-05-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: menara badko abu penuh mulai 3.9 sampai 4.7. Bola aliran yang tertahan di celah retak meredup abu (bawaan aliranTersendat). Jembatan cabang ke badko retak.
Bagian 2: lembar kewenangan abu penuh. Satu titik masalah boleh berdenyut zamrud: lembar kewenangan (denyutCermin). Tidak ada emas.
Bagian 3: panel periksa, centang, dan lembar koreksi berwarna zamrud (proses). Panel periksa badko abu sampai koreksinya ditempel. Emas hanya untuk satu rantai hasil: jembatan cabang ke badko yang tertutup kembali, lalu bola aliran yang lepas dan berjalan sampai PB.
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
gejala: { muat: d.urutan } (seluruh jenjang; H dihitung otomatis, perkiraan sekitar 16);
sebab: { muat: [d.benda.badko, d.benda.jembatanCabang, lembarKewenangan], H: 9 };
ikhtiar: { muat: [panelKomisariat, panelCabang, panelBadko, panelPB], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [d.benda.badko, d.benda.jembatanCabang, panelBadko, d.titik.atas.pb], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaJenjang(v, { opsi: { jembatanCabang: { retak: true } } }): dunia Jenjang, cabang di titik(-2.85, -1.0) (bawaan kit, sama dengan video lama). Retak lewat d.benda.jembatanCabang.userData.aturRetak(k).
aliran({ ... }) x 3: aliran komisariat ke cabang (lancar).
aliranTersendat({ ... }): aliran cabang ke badko ke PB yang tertahan di depan celah retak. Gerak ini sudah ada di kit 1.3.1; video lama memakai versi lokalnya (lokal.js), yang tidak dipakai lagi.
lembarKertas({ rebah: false, miring: 0, lebar: 0.8, panjang: 1.0, garis: 5, judul: true, benih: 5 }): lembar kewenangan di samping badko.
panelKertas({ lebar: 0.8, tinggi: 1.0, baris: 3, cek: true, tercentang: 3, kaki: false, miring: 0, dasar: ... }) x 3: panel periksa komisariat 1, cabang, dan PB. Centangnya (userData.bagian.centang) dimunculkan satu per satu dengan muncul.
panelKertas({ lebar: 0.8, tinggi: 1.0, baris: 3, cek: true, tercentang: 3, kaki: false, miring: 0, dasar: ... }): panel periksa badko. Centangnya baru dimunculkan sesudah koreksi; sebelum itu yang tampak hanya kotak cek kosong.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.45, warna: W.zamrud }): lembar koreksi.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "05", kategori: "TATA KELOLA", judul: "Sebagian aparat organisasi, seperti Badko, kurang berfungsi.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Kewenangan Badko tertulis di konstitusi, tetapi **tidak ada yang memeriksa** apakah benar-benar dijalankan."
ikhtiar:
{ teks: "**Pemeriksaan Kepatuhan Konstitusi** membandingkan kewenangan setiap jenjang dengan yang benar-benar berjalan.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Titik yang macet terlihat, lalu koreksinya dicatat dan diperiksa ulang.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 11".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Nama jenjang seperti video lama: label3D("CABANG" | "BADKO" | "PB", { pada: d.benda[n], geser: [0, d.titik.atas[n].y + 0.3, 0], masuk: [tMasuk, tMasuk + 0.4], keluar: [22.6, 23.0] }), dengan tMasuk = 0.6 + d.urutan.indexOf(benda) * 0.09 + 0.3 (CABANG 1.17, BADKO 1.53, PB 1.71). Komisariat tidak diberi label.
Label "KEWENANGAN" gaya kotak kelas abu, skala 0.65, pada: lembarKewenangan.userData.bagian.badan, geser: [0, -0.18, 0], ax: 0.5, ay: 0.5. Masuk 7.0 sampai 7.4, keluar 13.4 sampai 13.6.
Tanda status di atas tiap panel periksa (resep kit 05): "BERJALAN" gaya kotak kelas zamrud, skala 0.65, pada: panel, geser: [0, dasar + 1.2, 0]. Panel komisariat 1 masuk 14.7 sampai 15.0, cabang 15.1 sampai 15.4, PB 15.5 sampai 15.8; semua keluar 22.6 sampai 23.0. Panel badko: "TERSENDAT" kelas abu, masuk 15.9 sampai 16.2, keluar 19.0 sampai 19.2; lalu "BERJALAN" kelas zamrud, masuk 19.3 sampai 19.6, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaJenjang dengan jembatan cabang retak. Benda: komisariat1 di titik(-2.6, 3.1), komisariat2 di titik(-1.0, 3.4), komisariat3 di titik(-3.55, 2.0), cabang di titik(-2.85, -1.0), badko di titik(0.3, 0.85), pb di titik(3.0, 2.6), dan lima jembatan tabung pada y 0.3. Tata letaknya sama dengan video lama.
Titik dunia yang dipakai: d.jalur(...), d.titik.jalurJembatan.jembatanKomisariat2, d.titik.jalurJembatan.jembatanCabang, d.titik.retak, d.titik.atas.<nama>, d.titik.samping.<nama>.
Benda tambahan dan posisinya:
Aliran lancar: d.jalur("komisariat1" | "komisariat2" | "komisariat3", "cabang").
Aliran tersendat: jalur: d.jalur("cabang", "badko", "pb"), tahan: panjang / 2 - 0.23, dengan panjang = jarak d.titik.jalurJembatan.jembatanCabang[0] ke [1]. Bola berhenti tepat sebelum celah.
Lembar kewenangan: di d.titik.samping.badko dengan tepi bawah di samping.badko.y - 0.5 (posisi = samping.badko + y -0.5).
Panel periksa: x dan z di d.titik.samping.komisariat1, samping.cabang, samping.badko, dan samping.pb, y 0, dengan dasar = samping.<nama>.y - 0.5. Keempat titik ini sudah teruji tidak saling menutupi dan tidak menutupi jembatan. Panel menghadap kamera (hadap bawaan 45 derajat).
Lembar koreksi: muncul di pusat panel badko + titik(-0.7, 0) (kiri panel), lalu menempel di muka panel badko: pusat muka panel + titik(0, 0.04) (sedikit ke arah penonton). Titik asal kartu di tepi bawah, jadi letakkan 0.18 di bawah pusat itu.
Pengecualian zona (laporkan): selama 6.0 sampai 13.0 hanya badko, jembatanCabang, dan lembar kewenangan yang penting; bangunan dan jembatan lain userData.penting = (t) => !(t > 6.0 && t < 13.0). Sesudah 17.5 kamera mendekat ke badko: komisariat1..3, jembatanKomisariat1..3, cabang, panel komisariat 1, dan panel cabang penting = (t) => t < 6.0 || (t >= 13.0 && t < 17.5).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-05/adegan.js, bagian Gejala. Dunia, benda, posisi, dan waktunya sama persis.
0.6 sampai 2.0: semua bangunan dan jembatan muncul berurutan dari komisariat ke PB (muncul(d.urutan, { t: 0.6, jeda: 0.09 }), 11 benda). Label CABANG, BADKO, PB masuk sesuai bagian E.
2.0 sampai 6.0: aliran komisariat 1, 2, 3 ke cabang, lancar: aliran({ jalur: d.jalur(n, "cabang"), mulai: 2.0 + 0.1 * i, selesai: 6.0, bunyi: false, beku: { lanjut: 19.8 } }). Bola yang masih di jalan membeku 6.0 sampai 6.6, lalu berjalan lagi mulai 19.8 dan habis masuk cabang. Bunyi seperti video lama: catat({ t: 2.0, jenis: "aliran", durasi: 4.6, kuat: 0.6, posisi: jalurJembatan.jembatanKomisariat2[0], posisiAkhir: jalurJembatan.jembatanKomisariat2[1], sumber: "aliran komisariat" }).
3.4 sampai 5.6: aliran cabang ke badko tertahan di depan celah retak: aliranTersendat({ jalur, tahan, mulai: 3.4, jumlah: 6, selang: 0.3, lepas: 19.8 }). Bola menumpuk segitiga 3-2-1 lalu meredup abu. Pada detik bola pertama berhenti (tiba[0]): catat({ jenis: "retak", kuat: 0.6, posisi: d.titik.retak, sumber: "tumpukan" }).
3.9 sampai 4.7: badko menjadi abu penuh (setelKeadaan(badko, "abu", halus(rentang(t, 3.9, 4.7)))). 3.9: catat({ jenis: "padam", kuat: 0.7, posisi: badko, sumber: "badko" }).
Gerak aliran membeku 6.0 sampai 6.6 (beku bawaan).
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.1: lembar kewenangan muncul di samping badko. Abu penuh sejak muncul. Label KEWENANGAN masuk 7.0 sampai 7.4.
7.6 sampai 12.8: lembar kewenangan berdenyut zamrud (denyutCermin(lembarKewenangan, { mulai: 7.6, selesai: 12.8 })). Tidak ada figur atau benda lain yang mendekat ke lembar itu.
Tumpukan bola abu tetap diam di depan celah. Badko tetap abu.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 14.3: panel periksa komisariat 1, cabang, dan PB muncul berurutan (13.4, 13.6, 13.8; durasi 0.5).
13.6 sampai 14.0: lembar kewenangan berubah menjadi panel periksa badko (gantiBenda(lembarKewenangan, panelBadko, { t: 13.6, durasi: 0.4 })). Panel badko abu penuh. Label KEWENANGAN keluar.
14.4 sampai 15.6: centang zamrud muncul di panel yang berjalan, tiga per panel (muncul(panel.userData.bagian.centang, { jeda: 0.1, durasi: 0.25, naik: 0, skala: 0.5 })): komisariat 1 mulai 14.4, cabang 14.8, PB 15.2. Panel badko tetap berisi kotak cek kosong.
14.7 sampai 16.2: tanda BERJALAN masuk di ketiga panel, lalu TERSENDAT di panel badko (bagian E).
16.2 sampai 17.6: adegan tetap.
18.2 sampai 18.5: lembar koreksi muncul di kiri panel badko (naik: 0).
18.5 sampai 19.0: lembar koreksi menempel di muka panel badko (lintas, durasi 0.5).
19.0 sampai 19.4: panel badko melepas abu (1 ke 0). 19.1 sampai 19.6: centang panel badko muncul (muncul, jeda 0.1, durasi 0.25, naik: 0, skala: 0.5). Tanda TERSENDAT berganti BERJALAN.
19.5 sampai 19.8: celah retak menutup (aturRetak(1 - halus(rentang(t, 19.5, 19.8))) di setiapFrame).
19.8: jembatan cabang ke badko klikEmas. Pada detik yang sama tumpukan bola lepas (lepas: 19.8), berubah emas (bawaan lepasEmas), dan berjalan sampai PB. Aliran komisariat yang membeku ikut berjalan lagi (beku: { lanjut: 19.8 }).
19.8 sampai 20.6: badko melepas abu (1 ke 0).
Bola emas terakhir harus tiba di ujung jalur sebelum 22.8. Bila belum, naikkan laju aliranTersendat menjadi 2.5 dan laporkan. Jangan menambah aliran emas baru.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat1, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0, termasuk aliran dan aliran tersendat. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi (aliranTersendat mencatat aliran dan kayu sendiri). Tambahkan lewat catat (beri sumber unik):
7.6: gemuruh pelan (kuat 0.25, durasi 5.0, posisi lembar kewenangan) selama lembar berdenyut tanpa disentuh;
19.0: cap (kuat 0.45, posisi panel badko) saat lembar koreksi menempel;
19.5: tumbuh (durasi 0.3, kuat 0.6, posisi d.titik.retak) saat celah menutup;
20.2: menyala (kuat 0.5, posisi badko) saat badko pulih.
Tidak ada figur, jadi tidak perlu peredaman langkah.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang, badko, dan komisariat nyata. Label hanya CABANG, BADKO, PB, KEWENANGAN, BERJALAN, dan TERSENDAT.
Tidak boleh ada angka di panel atau lembar. Isi lembar kewenangan hanya garis.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-05-v2 --periksa, lalu lihat hasil/gambar/indikator-05-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: seluruh jenjang tampak, aliran komisariat ke cabang berjalan, label CABANG, BADKO, PB terbaca;
5.5: badko abu, bola menumpuk di depan celah retak dan mulai abu;
9.5: kamera dekat ke badko, lembar kewenangan abu berdenyut zamrud dengan label KEWENANGAN, tumpukan abu di celah, kalimat sebab terbaca;
14.5: empat panel periksa tampak, centang pertama muncul di panel komisariat, panel badko abu, kalimat ikhtiar pertama terbaca;
19.3: lembar koreksi sudah menempel di panel badko, abunya sedang lepas;
22.3: jembatan cabang ke badko emas dan utuh, bola emas sudah dekat PB, badko pulih, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-05-v2. Hasilnya hasil/video/indikator-05-v2.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, laju aliran tersendat bila dinaikkan).
