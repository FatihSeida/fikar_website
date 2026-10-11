Prompt Animasi Indikator 21 dari 44
Judul indikator: Organisasi mahasiswa Islam baru bermunculan.
Kelompok Kaderisasi. Mode Pandangan. Program terkait 06 Pemetaan Kebutuhan Mahasiswa dan Kampus.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-21/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-21 --format evidence --judul "Organisasi mahasiswa Islam baru bermunculan.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-21/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Sumbu dunia +z sama dengan titik(-0.707, 0.707).
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Tiga bangunan baru memakai warna bawaan rumahKecil dengan jendela menyala (lampu 1) sepanjang video. Bangunan baru tidak pernah diberi abu, pudar, atau denyut.
Bagian 2: tiga lapis pagar garis putus di sekeliling komisariat berwarna abu, dengan denyutCermin pada pagar sebagai satu titik masalah. Tidak ada emas.
Bagian 3: papan dan kartu alasan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: panji kekhasan di atap komisariat. Komisariat melepas abu sesudah panji menjadi emas.
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
fokus: titik(-0.4, 0.8, 0.8);
gejala: { muat: [d.benda.komisariat, rumahLain1, rumahLain2, rumahLain3] };
sebab: { muat: [d.benda.komisariat, pagar3, d.titik.atap.clone().setY(2.6)], H: 8 };
ikhtiar: { muat: [d.benda.komisariat, papan, rumahLain1, rumahLain2, rumahLain3, d.titik.atap.clone().setY(3.6)], H: 11 }. Tidak ada kunci tambahan: ketiga bangunan baru tetap di dalam bingkai sampai akhir Bagian 3.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
duniaKader hanya untuk komisariat (rumah() 1.8 x 1.2 x 1.6, atap 0.7) dan titiknya.
persimpangan({ lengan: 2, jarak: 1 }): persimpangan kampus empat arah. userData.ujung[i] (titik lokal), bagian.lengan[i][], bagian.ubin[].
rumahKecil({ lampu: 1 }) x 3: bangunan baru, identik satu sama lain, tanpa label, tanpa simbol.
pion(): mahasiswa baru di tengah persimpangan.
pion() x 2: pelintas, mahasiswa yang datang dari arah bangunan baru.
balonKata({ isi: "tanya", skala: 0.35 }) x 4: tanda pilihan di atas tiap bangunan dan komisariat.
garisPutus({ persegi: [w, d], warna: W.abu, lebar: 3 }) x 3: pagar abu, ukuran [2.4, 2.2], [2.8, 2.6], dan [3.2, 3.0].
papanTulis({ lebar: 1.6, tinggi: 1.1, kaki: 0.6, kolom: ["BUTUH", "MINAT", "SUASANA"], baris: ["", "", ""] }): papan alasan.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.3, warna: W.zamrud }) x 6: kartu alasan.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.4, warna: W.zamrud }): kartu temuan yang menjadi panji.
panji({ lebar: 0.6, tinggi: 0.9, tiang: 1.6 }): panji kekhasan komisariat, kain polos dengan pola tiga garis lengkung bawaan, tanpa lambang.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "21", kategori: "KADERISASI", judul: "Organisasi mahasiswa Islam baru bermunculan.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Alasan mahasiswa memilih organisasi **tidak pernah dipetakan**, jadi kekhasan HMI dirumuskan dari perasaan, bukan temuan."
ikhtiar:
{ teks: "HMI Evidence memandang hadirnya organisasi baru sebagai hal wajar dalam kehidupan kampus, **bukan ancaman**.", masuk: [13.6, 14.1], keluar: [17.6, 18.0] }
{ teks: "Yang perlu dikerjakan adalah memahami alasan mahasiswa memilih, lalu merumuskan kekhasan HMI dari temuan itu.", masuk: [18.2, 18.7], keluar: [22.6, 23.0] }
program: "Program 06".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Bangunan baru sengaja tanpa label. Label kolom papan dipasang papanTulis.
F. Dunia dan Posisi
Persimpangan dari titik(0, 0) memotong jalan Dunia Kader, jadi tata letak disusun ulang. Urutan pembuatan: persimpangan dulu, lalu duniaKader dengan posisi komisariat hasil hitungan.
Persimpangan: pusat C = titik(-0.4, 0.8). Empat lengan ke arah dunia +x (kanan bawah), -x (kiri atas), +z (kiri bawah), dan -z (kanan atas). Tentukan indeks lengan dari arah ujung[i] dan simpan sebagai ujung.px, ujung.mx, ujung.pz, ujung.mz dalam titik dunia (C + ujung lokal). Arah satuan: arah.px = titik(0.707, 0.707), arah.mx = titik(-0.707, -0.707), arah.pz = titik(-0.707, 0.707), arah.mz = titik(0.707, -0.707).
Komisariat: duniaKader(v, { tanpa: ["gerbang", "kelas", "jalan", "tangga"], posisi: { komisariat: ujung.mz + titik(0.88, -0.88) } }), rotasi 0. Dengan ini d.titik.depanPintu jatuh tepat di ujung lengan -z, jadi lengan itu berakhir di pintu komisariat (perkiraan posisi komisariat titik(2.6, -2.2)). Titik dunia yang dipakai: d.titik.komisariat, d.titik.depanPintu, d.titik.atap.
Bangunan baru (rotasi agar muka berpintu terlihat kamera):
rumahLain1 di ujung.mx + arah.mx x 1.05, rotasi y 90 derajat (pintu menghadap persimpangan);
rumahLain2 di ujung.pz + arah.pz x 1.05, rotasi 0;
rumahLain3 di ujung.px + arah.px x 1.05, rotasi 0. Perkiraan posisi: titik(-3.26, -2.06), titik(-3.26, 3.66), dan titik(2.46, 3.66). Ketiganya sama ukuran, sama warna, sama lampu.
Benda tambahan lain:
Mahasiswa baru: di C, sepanjang video.
Balon tanya: di atas tiap bangunan baru (posisi bangunan + y 1.7) dan di atas komisariat (d.titik.atap + y 0.3).
Pagar 1, 2, 3: persegi berpusat di d.titik.komisariat, y 0.08, sejajar sumbu dunia. Pagar ketiga memotong ujung lengan -z sehingga jalan ke pintu tertutup.
Papan: di C + titik(2.3, 0), yaitu di antara lengan -z dan lengan +x, menghadap kamera (rotasi y 45 derajat bawaan). Panggil papan.updateMatrixWorld(true). Sel: papan.localToWorld(papan.userData.titikSel(k, r)), baris dari bawah r = 2, 1, 0.
Pelintas P1: muncul di ujung.pz, berjalan ke C + arah.pz x 1.0. Pelintas P2: muncul di ujung.px, berjalan ke C + arah.px x 1.0. Keduanya berhenti di sisi depan kiri dan depan kanan mahasiswa baru, tidak tepat di depannya.
Kartu alasan: muncul di atas kepala figur asalnya (posisi figur + y 1.3).
Kartu temuan: muncul di depan kolom BUTUH (papan + titik(-0.5, 0.6, 1.2)), mendarat di d.titik.atap.
Panji: berdiri di d.titik.atap.
Pengecualian zona: ketiga bangunan baru, persimpangan, dan pelintas boleh terpotong selama sebab ((t) => !(t > 6.0 && t < 13.0)).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: komisariat dan persimpangan muncul (muncul([d.benda.komisariat, persimpangan], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.2 sampai 1.6: mahasiswa baru muncul di tengah persimpangan (naik: 0).
1.6 sampai 3.2: tiga bangunan baru naik dari tanah di ujung lengan, satu per satu (muncul(rumahLain, { t: 1.6, selesai: 3.2 }), naik bawaan 0.6). Jendelanya menyala.
3.2 sampai 5.6: mahasiswa baru menoleh bergantian ke rumahLain1 (3.2), rumahLain2 (3.9), rumahLain3 (4.6), lalu komisariat (5.3). Setiap kali, ia diputar menghadap bangunan itu (putar, sumbu y, durasi 0.3, sudut = selisih arah hadap baru dan lama, dihitung dari atan2 posisi dunia), dan balon tanya muncul di atas bangunan itu (muncul, durasi 0.3, naik: 0).
Komisariat tetap abu dan tidak berbeda dari pilihan lain.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.0: keempat balon tanya hilang bersamaan.
6.8 sampai 7.6, 8.4 sampai 9.2, dan 10.0 sampai 10.8: pagar 1, 2, lalu 3 tergambar di sekeliling komisariat (aturTampak 0 ke 1). Pagar makin tebal, mengurung komisariat sendiri.
11.0 sampai 12.8: denyutCermin([pagar1, pagar2, pagar3], { mulai: 11.0, selesai: 12.8 }).
Bangunan baru dan mahasiswa baru diam di tempatnya. Pagar tidak menyentuh dan tidak mengarah ke bangunan baru.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.4 sampai 14.4: ketiga pagar memudar ke opacity 0 dari luar ke dalam (pagar 3 13.4 sampai 13.8, pagar 2 13.7 sampai 14.1, pagar 1 14.0 sampai 14.4, aturOpasitas).
13.8 sampai 14.1: pelintas P1 muncul di ujung lengan +z. 14.0 sampai 15.2: P1 berjalan ke titik berhentinya (jalan, durasi 1.2).
14.2 sampai 14.5: pelintas P2 muncul di ujung lengan +x. 14.4 sampai 15.6: P2 berjalan ke titik berhentinya (jalan, durasi 1.2).
14.4 sampai 14.9: papan muncul.
15.0 sampai 18.0: enam kartu alasan. Untuk k = 0 sampai 5, t_k = 15.0 + 0.4 k, asal berurutan: mahasiswa baru, P1, P2, mahasiswa baru, P1, P2:
t_k: kartu muncul di atas kepala figur asal (muncul, durasi 0.3, naik: 0);
t_k + 0.3: kartu meluncur ke selnya (lintas, durasi 0.7);
tujuan berurutan: BUTUH, MINAT, BUTUH, SUASANA, BUTUH, MINAT. Kartu menumpuk dari bawah. Kolom BUTUH berisi 3 kartu.
18.4 sampai 18.7: kartu temuan muncul di depan kolom BUTUH (naik: 0).
18.8 sampai 19.6: kartu temuan melayang ke atap komisariat (busur, tinggi 1.2, durasi 0.8).
19.6 sampai 20.0: gantiBenda(kartuTemuan, panji, { durasi: 0.4, tempat: false }). Panji berdiri di atap.
20.0 sampai 22.8: panji berkibar (panji.userData.aturKibar(6 * Math.min(t, 22.8), 0.06 * (1 - halus(rentang(t, 22.4, 22.8)))) di setiapFrame, dan sebelum 20.0 fasenya tetap). Kibaran berhenti 22.8.
20.2: klikEmas(panji).
20.4 sampai 21.2: abu komisariat dilepas dari 1 ke 0.
21.2 sampai 23.0: adegan diam. Ketiga bangunan baru tetap berdiri utuh, jendelanya tetap menyala. Pelintas tetap berdiri di tempatnya. Jangan menampilkan figur yang berbondong ke komisariat.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
6.8, 8.4, 10.0: kayu (kuat 0.5) saat setiap lapis pagar terpasang, posisi komisariat;
13.4: garis-putus (kuat 0.4) saat pagar mulai memudar.
Langkah pelintas dibisukan sebagian: bunyi: { kuat: 0.25 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia. Panji adalah kain polos berpola abstrak, bukan bendera HMI.
Tidak boleh ada teks Arab, simbol agama, nama tokoh nyata, nama cabang dan komisariat nyata, atau nama organisasi lain.
Catatan kepekaan: bangunan organisasi lain netral, tanpa label, tanpa simbol. Bangunan itu tidak boleh tampak dikalahkan atau dihancurkan: tidak runtuh, tidak retak, tidak hilang, tidak memudar, tidak abu, lampunya tidak padam, dan tidak dikelilingi atau disentuh pagar.
Tidak boleh ada teks pada kartu atau balon. Isi balon hanya tanda tanya. Tidak ada angka.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-21 --periksa, lalu lihat hasil/gambar/indikator-21/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: dua bangunan baru sudah berdiri, yang ketiga sedang naik, mahasiswa baru di tengah persimpangan;
5.5: empat balon tanya tampak, mahasiswa baru menghadap komisariat yang abu;
9.5: kamera dekat, dua lapis pagar abu di sekeliling komisariat, kalimat sebab terbaca;
14.5: pagar sudah hilang, dua pelintas berjalan dari arah bangunan baru, papan muncul, kalimat pandangan pertama terbaca;
19.9: panji berdiri di atap komisariat, papan berisi enam kartu;
20.5: panji emas, ketiga bangunan baru utuh dengan jendela menyala, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-21. Hasilnya hasil/video/indikator-21.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, indeks lengan persimpangan, posisi komisariat hasil hitungan).
