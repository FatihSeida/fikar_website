Prompt Animasi Indikator 02 dari 44
Judul indikator: Jarak HMI dengan kehidupan mahasiswa semakin lebar.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 06 Pemetaan Kebutuhan Mahasiswa dan Kampus.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-02-v2/. Folder lama animasi/proyek/indikator-02/ jangan diubah, tetapi boleh dibaca sebagai acuan tata letak.
Video sudah dibuat; untuk membuat ulang, edit adegan.js yang ada di folder itu (jangan npm run baru). Isi adegan Bagian 1 sampai 3 di sana boleh dipakai ulang, tetapi kerangka lama (jadwalEvidence, segmenKuis, dan kamera di buatVideo) diganti dengan akhiriEvidence.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Edit hanya adegan.js. Impor dari kit hanya dari ../../kit/index.js; untuk Vector3 dan THREE.Curve (jalur keliling figur), adegan.js boleh menambah satu impor: import * as THREE from "three". Benda yang belum ada di kit dibuat di animasi/proyek/indikator-02-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah. Konversi dari koordinat dunia (x, z): r = 0.707(x − z), d = 0.707(x + z).
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Tepi kedua blok tanah netral.
Bagian 2: kartu kegiatan yang berputar dan balon keluhan berwarna kertas redup (W.kertas dicampur W.abu 0.4, tanpa token baru). Panah lingkaran tertutup berwarna abu. Tidak ada emas.
Bagian 3: papan peta dan kartu keluhan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: kolom tertinggi, kartu kegiatan yang ditarik darinya, lalu jembatan yang terbentuk dari kartu itu. Komisariat melepas abu saat kartu kegiatan masuk.
Bagian 4 dan 5: diatur akhiriEvidence. Emas hanya pada lembar laporan.
Dilarang memakai merah, oranye, atau biru.
C. Waktu dan Kamera
Pembagian waktu memakai bawaan formatEvidence: grid 0.0 sampai 0.6, Gejala 0.6 sampai 6.0, sebab 6.0 sampai 13.0, Ikhtiar 13.0 sampai 23.0, Kuis 23.0 sampai 28.0, Kartu akhir 28.0 sampai 31.0.
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis:
fokus: G;
awal: { H: 15 };
gejala: { muat: [kelas, gerbang, ...figurKampus, ...sudutKeliling, komisariat, ...figurKomisariat], fokus: G } (kamera tetap di G; video ini butuh H jauh lebih besar dari bawaan karena dua blok yang menjauh harus terlihat dengan celahnya, H dihitung otomatis, perkiraan sekitar 21; lempeng blok boleh terpotong, lihat pengecualian zona);
sebab: { muat: [komisariat, ...figurKomisariat, kartuPutar, puncakKartu, balon1, tepiKiriCelah], H: 10 } (H dihitung otomatis, perkiraan sekitar 11);
ikhtiar: { muat: [papanPeta, komisariat, ...figurKomisariat, tepiKiriCelah, ...tujuanBalon], H: 12 } (H dihitung otomatis, perkiraan sekitar 13);
tambahan: [{ t: [19.4, 20.2], fokus: G, muat: [komisariat, papanJembatan1, papanJembatan5, tengahJembatan], H: 12 }] (jembatan dan figur yang melangkah; kamera tetap di G, H dihitung otomatis, perkiraan sekitar 13);
kuis dan akhir: diisi akhiriEvidence.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. sudutKeliling, puncakKartu, tujuanBalon, tengahJembatan, dan tepiKiriCelah didefinisikan di bagian F.
D. Benda yang Dipakai
Dari kit:
blokTanah({ lebar: 5, tinggi: 0.3, dalam: 6, sisiCelah: "kanan", patah: "kanan", benih: 3 }): blok kampus (kiri).
blokTanah({ lebar: 5, tinggi: 0.3, dalam: 6, sisiCelah: "kiri", patah: "kiri", benih: 7 }): blok komisariat (kanan). Opsi patah menerima nama sisi (kiri, kanan, depan, belakang), bukan true.
gerbangKampus() dan gedungKelas() di atas blok kampus.
rumah() 1.8 x 1.2 x 1.6 dengan atap 0.7: komisariat, di atas blok komisariat.
pion() x 6: figur kampus. pion() x 3: figur komisariat.
debu({ ... }): debu yang jatuh dari tepi celah (naik negatif, beku: false, induk: blok, bunyi: false).
kartuProker({ garis: 3, kaki: false }): kartu kegiatan yang berputar, skala 0.6.
panahGaris({ titik: [...], lengkung: true, warna: W.abu }): panah lingkaran tertutup di atas atap.
balonKata({ isi: "titik", skala: 0.5, warna: kertas redup }) x 10: empat balon keluhan Bagian 2, enam balon Bagian 3.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, hadap: 0, skala: 0.55, warna: W.zamrud, warnaSimbol: W.pelat }) x 6: keluhan yang tertangkap papan, anak papan peta, berdiri tegak di selnya. Skala 0.55 supaya muat di sel papan.
papanTulis({ lebar: 2.6, tinggi: 1.8, kaki: 1.0, kolom: ["BUTUH", "MINAT", "TANTANGAN"], baris: ["", "", ""] }): papan peta.
papanJembatan() x 5: jembatan, 0.9 x 0.08 x 0.5.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "02", kategori: "KADERISASI", judul: "Jarak HMI dengan kehidupan mahasiswa semakin lebar.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Kegiatan disusun dari **dugaan pengurus**. Keluhan mahasiswa jatuh di tengah jalan."
ikhtiar:
{ teks: "**Pemetaan Kebutuhan Mahasiswa** mencatat apa yang dibutuhkan, diminati, dan dihadapi mahasiswa setiap semester.", masuk: [13.6, 14.1], keluar: [19.0, 19.4] }
{ teks: "Kegiatan disusun dari **peta itu**, bukan dari dugaan pengurus.", masuk: [19.6, 20.1], keluar: [22.6, 23.0] }
program: "Program 06".
kuis: { pertanyaan: "Bagaimana komisariatmu mengetahui Student Needs dan Student Interest mahasiswa di kampus?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label “KAMPUS” di atas gerbang dan “KOMISARIAT” di atas komisariat, gaya benda, masuk 1.1, keluar 6.0 sampai 6.3.
F. Dunia dan Posisi
Dunia ini tidak memakai dunia dasar kit. Tata letaknya sudah teruji di animasi/proyek/indikator-02/tata.js (koordinat dunia x, z). Pindahkan angkanya ke kit dengan konversi di bagian A.
Titik tengah celah G: dunia (x 1.9, z 1.0), yaitu titik(0.64, 2.05).
Lebar celah: 0.4 unit pada 1.6, melebar halus ke 3.0 unit pada 5.6, lalu tetap.
Blok kampus: pusatnya di dunia x = 1.9 − lebarCelah/2 − 2.5, z = 0.6 (Z_KIRI di tata.js). Blok komisariat: x = 1.9 + lebarCelah/2 + 2.5, z = −0.6 (Z_KANAN di tata.js). Kedua blok bergeser hanya di sumbu dunia x, sehingga celah terbuka di diagonal layar.
Buat kedua blok langsung di posisi akhirnya (lebarCelah 3.0), lalu hapus selisih celah awal dengan lintas: blok kampus dari x akhir + 1.3 ke x akhir, blok komisariat dari x akhir − 1.3 ke x akhir, pada 1.6 sampai 5.6, kurva halus, beku: false, bunyi: false. Dengan begitu komisariat sudah di tempat akhirnya saat akhiriEvidence dipanggil, dan terowongan kuis sejajar dengannya.
Permukaan atas blok di y 0.3. Semua benda di atas blok menjadi anak blok supaya ikut bergeser.
Isi blok kampus (lokal, pusat blok, alas y 0.3, tepi celah di x +2.5):
gedung kelas menempati x −0.75 sampai 1.25, z −0.6 sampai 2.4, muka berjendela menghadap +x;
gerbang di x 2.25, z 1.2, balok atas sejajar sumbu z;
enam figur kampus berkeliling gedung kelas searah jarum jam pada jarak 0.4 dari dinding (jalur keliling di tata.js), jarak antarfigur rata.
Isi blok komisariat (lokal, tepi celah di x −2.5):
komisariat di x −1.35, z 0.95, pintu di muka +z;
tiga figur komisariat diam di (x −0.45, z 2.05), (x 0.4, z 2.1), dan (x −1.75, z 2.55), mengapit pintu tanpa menutupinya;
papan peta di x −1.6, z −1.9, menghadap kamera, di belakang komisariat (atas layar) supaya pintu tetap terlihat.
Debu: pusat di tepi kedua blok yang menghadap celah, sebar: 0.8, 1.7 sampai 5.5, naik: -0.4 (debu jatuh), beku: false, induk: blok masing-masing, bunyi: false (bunyinya dicatat sendiri, bagian H).
Kartu kegiatan Bagian 2: berangkat dan kembali ke puncak atap komisariat. Panah lingkaran: busur abu dari atap naik 1.2 unit lalu turun kembali ke atap, sedikit bergeser di sumbu z (titik: atap, atap + (0, 0.8, 0.35), atap + (0, 1.2, 0), atap + (0, 0.8, −0.35), atap).
Balon keluhan: titik asal ekor di atas kepala figur kampus (y 1.15 dari kaki). Titik jatuh: tengah celah G, y −1.0. Balon Bagian 3 menuju tujuanBalon: titik sel papan (papanPeta.localToWorld(papanPeta.userData.titikSel(c, r)), sesudah papanPeta.updateMatrixWorld(true)) + 1.5 x (1, 1, 1), yaitu digeser sejajar arah pandang kamera, sehingga posisi layarnya sama dengan sel tetapi balon lewat di depan papan dan tidak tertutup. Kartu keluhan berdiri tegak di sel itu, titik asalnya 0.4 x skala di bawah titik sel.
Jembatan: lima papan di garis lurus melintasi celah di z lokal yang sama dengan gerbang (dunia z 1.8), dari tepi blok komisariat ke tepi blok kampus, jarak rata 0.6 unit (x dunia 3.1, 2.5, 1.9, 1.3, 0.7). Sisi 0.9 papan melintang (sumbu z), permukaan atas papan di y 0.32.
Titik bantu untuk kamera (dunia): tepiKiriCelah = tepi blok kampus yang menghadap celah pada lebar akhir, (x 0.4, y 0.3, z 1.0). sudutKeliling = keempat sudut jalur keliling gedung kelas (lokal blok kampus, x −1.15 atau 1.65, z −1.0 atau 2.8, y 0.3; ubah ke titik dunia dengan localToWorld). puncakKartu = puncak atap komisariat + y 1.2 (puncak busur kartuPutar). tengahJembatan = (x 1.9, y 0.32, z 1.8). papanJembatan1 dan papanJembatan5 = papan jembatan pertama (x 3.1) dan kelima (x 0.7).
Pengecualian zona (laporkan):
kedua blok tanah: userData.penting = false (kedua lempeng blok terlalu lebar untuk muat di zona pada H yang masuk akal; benda di atas blok tetap diperiksa).
gerbang, gedung kelas, dan figur kampus: userData.penting = (t) => t < 6.0 (sesudahnya kamera dekat ke komisariat).
balon keluhan Bagian 2 dan 3: userData.penting = (t) => t > saat balon itu muncul + 0.5 (muncul di atas figur yang boleh di luar bingkai kamera dekat).
papan peta dan kartu keluhan: userData.penting = (t) => t >= 14.0 && t < 19.6 (kamera masih bergeser ke papan sebelum 14.0 dan pindah ke G sesudah 19.6).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.1: kedua blok muncul bersamaan.
0.66 sampai 1.1: gerbang, gedung kelas, komisariat, figur kampus, lalu figur komisariat muncul berurutan.
1.6 sampai 5.6: kedua blok menjauh sehingga celah melebar dari 0.4 ke 3.0 unit (halus; lintas dari posisi celah 0.4 ke posisi akhir, bagian F).
1.6 sampai 6.0: enam figur kampus berkeliling gedung kelas pada 1.2 unit per detik. Tiga figur komisariat diam. Hitung jarak tempuh dengan jam beku format (waktuBeku(...v.beku)) supaya figur kampus 1 berhenti tepat di lorong depan gerbang, tempat penyeberang Bagian 3 berangkat.
1.7 sampai 5.5: debu jatuh dari kedua tepi celah.
Gerak figur melambat 6.0 dan berhenti 6.6 (beku bawaan).
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.2: panah lingkaran abu tergambar di atas atap komisariat (aturTampak 0 ke 1).
6.8 sampai 12.4: kartu kegiatan naik dari atap lalu jatuh kembali ke atap yang sama mengikuti panah, tiga putaran: 6.8 sampai 8.4, 8.6 sampai 10.2, dan 10.4 sampai 12.0 (busur dari atap ke atap, tinggi 1.2).
7.2, 8.2, 9.2, dan 10.2: empat balon keluhan muncul di atas empat figur kampus (yang terdekat ke G lebih dulu), lalu melayang ke celah (busur, durasi 0.9, tinggi 0.6) dan terus jatuh ke dalam celah sampai y −1.0, lalu hilang.
12.0 sampai 13.0: adegan diam. Panah lingkaran tetap tampak.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.5: papan peta muncul di blok komisariat.
13.4 sampai 16.4: enam balon keluhan muncul di atas figur kampus dengan jeda 0.5 detik, lalu melayang menyeberangi celah ke tujuanBalon di depan papan (busur, durasi 0.8, tinggi 1.0). Saat mendarat, setiap balon berganti menjadi kartu keluhan di sel papan (gantiBenda, durasi 0.3, tempat: false). Urutan kolom: BUTUH, TANTANGAN, BUTUH, MINAT, BUTUH, TANTANGAN. Kartu menumpuk dari bawah ke atas (baris r = 2, 1, 0).
16.6: ketiga kartu di kolom BUTUH klikEmas bersamaan.
16.8 sampai 17.2: kartu kegiatan baru muncul di depan kolom BUTUH, warna emas.
17.2 sampai 18.4: kartu kegiatan bergerak ke puncak atap komisariat (lintas, durasi 1.2). Saat tiba, panah lingkaran abu terputus dan hilang (hilang, dengan bunyi garis-putus).
18.2 sampai 19.0: abu komisariat dilepas dari 1 ke 0.
19.6 sampai 20.8: kartu kegiatan bergerak ke tepi celah di blok komisariat, lalu berganti menjadi lima papan jembatan yang muncul satu per satu dari tepi blok komisariat ke tepi blok kampus (gantiBenda untuk papan pertama dengan tempat: false karena papan sudah di tempatnya, muncul jeda 0.25 untuk sisanya). Kelima papan berwarna emas.
21.4 sampai 23.0: satu figur kampus (figur kampus 1, yang berhenti di lorong depan gerbang) berjalan dari depan gerbang ke tengah jembatan dan berhenti di sana. Hanya satu figur, bukan rombongan.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI). Komisariat berdiri di atas blok, jadi titik P modul otomatis berada di y 0.3.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
1.6: gemuruh pelan (kuat 0.35, durasi 4.0) selama blok menjauh;
1.7: debu di tiap tepi celah (posisi dunia tepi blok, dua peristiwa), karena debu dipanggil dengan bunyi: false;
setiap balon Bagian 2 yang masuk celah: hilang dengan kuat 0.4;
18.4: garis-putus saat panah lingkaran terputus (hilang pada panah dipanggil dengan bunyi: false).
Langkah figur kampus dibisukan sebagian: bunyi: { kuat: 0.25 }.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Blok, jembatan, dan figur sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada teks keluhan yang terbaca di balon atau kartu. Isi balon hanya tiga titik.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-02-v2 --periksa, lalu lihat hasil/gambar/indikator-02-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik 3,5.5,9.5,14.5,18.5,22.2, karena titik bawaan 18 dan 22 jatuh sebelum peristiwanya selesai):
3: celah mulai melebar, debu jatuh, figur kampus berkeliling;
5.5: celah hampir 3 unit, isi kedua blok (gedung kelas, gerbang, figur, komisariat) utuh di zona adegan, lempeng blok boleh terpotong di tepi luar;
9.5: kamera dekat, kartu kegiatan di puncak putaran kedua di atas atap, satu balon sedang jatuh ke celah, kalimat sebab terbaca;
14.5: papan peta tampak, balon menyeberang, kalimat ikhtiar pertama terbaca;
18.5: kartu kegiatan emas tiba di atap, panah lingkaran terputus;
22.2: jembatan emas lengkap, satu figur melangkah di atasnya, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-02-v2. Hasilnya hasil/video/indikator-02-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan lewat muat, pengecualian zona), lalu hasil zona, warna, LUFS, dan sinkron.
