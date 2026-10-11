Prompt Animasi Indikator 01 dari 44
Judul indikator: Jumlah mahasiswa baru yang masuk HMI menurun.
Kelompok Kaderisasi. Mode Ikhtiar. Program terkait 03 Indeks Kaderisasi dan 06 Pemetaan Kebutuhan Mahasiswa dan Kampus.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-01-v2/. Folder lama animasi/proyek/indikator-01/ jangan diubah.
Video sudah dibuat; untuk membuat ulang, edit adegan.js yang ada di folder itu (jangan npm run baru). Isi adegan Bagian 1 sampai 3 di sana boleh dipakai ulang, tetapi kerangka lama (jadwalEvidence, segmenKuis, dan kamera di buatVideo) diganti dengan akhiriEvidence.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-01-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Figur berwarna pion.
Bagian 2: jejak dan kartu tahun berwarna abu. Tidak ada emas.
Bagian 3: grafik dan kartu alasan berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: tumpukan alasan tertinggi lalu kartu kegiatan yang masuk komisariat. Komisariat melepas abu saat kartu kegiatan masuk.
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
gejala: { muat: [d.benda.gerbang, d.benda.komisariat] } (H dihitung otomatis, perkiraan sekitar 13.5);
sebab: { muat: [d.benda.gerbang, kartuTahun1, kartuTahun3], H: 8 };
ikhtiar: { muat: [d.benda.gerbang, grafik, papanPeta], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [papanPeta, d.benda.komisariat], H: 11 }] (H dihitung otomatis, perkiraan sekitar 14);
kuis dan akhir: diisi akhiriEvidence.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. kartuTahun1 dan kartuTahun3 adalah kartu tahun pertama dan ketiga (bagian F).
D. Benda yang Dipakai
Dari kit:
pion(): figur arus, 36 buah dalam tiga gelombang berisi 12. Tinggi sekitar 1.0 unit.
kartuKecil({ simbol: null, rebah: false, miring: 0 }) x 3: kartu tahun, 0.6 x 0.02 x 0.8, berdiri tegak menghadap kamera lewat opsi itu, tanpa diputar sendiri. Titik asalnya di tepi bawah.
tandaTanya({ ukuran: 0.25, hadapKamera: false, tengah: true, hadap: 0 }) x 3: isi kartu tahun yang kosong, dijadikan anak kartunya.
garisPutus({ titik: [...], warna: W.abu, lebar: 3 }) x 3: jejak abu figur yang tidak masuk.
ikonGrafik({ tinggi: [1.0, 0.65, 0.35] }): grafik tren, skala 1.3.
garisPutus({ titik: [...], warna: W.zamrudPijar, lebar: 3 }) x 3: jejak yang muncul kembali.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.36, warna: W.zamrud }) x 6: kartu alasan, berdiri tegak. Skala 0.36 supaya muat di sel papan.
papanTulis({ lebar: 2.6, tinggi: 1.8, kaki: 1.0, kolom: ["BUTUH", "MINAT", "TANTANGAN"], baris: ["", "", ""] }): papan peta.
kartuProker({ garis: 3, kaki: false }): kartu kegiatan, skala 0.6.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "01", kategori: "KADERISASI", judul: "Jumlah mahasiswa baru yang masuk HMI menurun.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Yang tidak ikut **tidak pernah ditanya**. Penurunan baru terasa ketika sudah jauh."
ikhtiar:
{ teks: "Peserta LK 1 dicatat setiap tahun dalam **Indeks Kaderisasi**, jadi penurunan terbaca sejak awal.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Pemetaan Kebutuhan Mahasiswa** menanyakan alasan yang tidak ikut, lalu kegiatan disusun dari situ.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 03 · Program 06".
kuis: { pertanyaan: "Jumlah peserta LK 1 terakhir dari komisariatmu?", kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label kotak tahun di atas gerbang (d.titik.atasGerbang): “2024” muncul 0.6, berganti “2025” pada 2.4 dan “2026” pada 4.2 (gantiLabel), keluar 6.0 sampai 6.3.
Label mikro “2024”, “2025”, “2026” di atas masing-masing kartu tahun, geser [0, 0.55, 0]. Masuk bersama kartunya, keluar 17.2 sampai 17.6. Pasang pada titik pusat kartu (Vector3 tetap, bukan kartunya) supaya label bertahan sesudah kartu berganti grafik pada 13.4.
F. Dunia dan Posisi
Dunia dasar duniaKader(v) tanpa penyesuaian. Benda: gerbang di titik(-2.1, -0.7), kelas di titik(-2.85, -2.9), jalan dari gerbang ke pintu komisariat, komisariat di titik(2.6, 2.2), tangga di titik(1.2, -1.5).
Titik dunia yang dipakai: d.titik.belakangGerbang, d.titik.depanGerbang, d.titik.jalur, d.titik.depanPintu, d.titik.atasGerbang, d.titik.lapangan, d.titik.pintu.
Benda tambahan dan posisinya:
Arus figur: semua figur mulai di d.titik.belakangGerbang. Figur B (berbelok) memakai jalur d.titik.jalur sampai d.titik.depanPintu. Figur L (lurus) berjalan dari d.titik.belakangGerbang lewat d.titik.depanGerbang dan d.titik.lapangan ke d.titik.lapangan + titik(-3.0, 1.6), lalu hilang di tepi layar.
Kartu tahun 1, 2, 3: pusat di d.titik.atasGerbang + titik(-0.9, 0, 0.6), + titik(0, 0, 0.6), dan + titik(0.9, 0, 0.6). Kartu berdiri tegak dan titik asalnya di tepi bawah, jadi letakkan kartu 0.4 di bawah pusat itu. Tanda tanya di tengah muka kartu, digeser 0.03 dari pusat kartu ke arah penonton (titik(0, 1)), sebagai anak kartu. Agar tanda tanya tidak ikut abu kartu: tanya.userData.bagian.badan.material.userData.abaikanKeadaan = true.
Jejak abu 1, 2, 3: jalur figur L, masing-masing digeser titik(0, -0.25), titik(0, 0), dan titik(0, 0.25), y 0.08 (ubin jalan setinggi 0.06 menutupi garis di y 0.02). Jejak zamrud 1, 2, 3: jalur dan geseran yang sama, y 0.08.
Grafik: di d.titik.atasGerbang + titik(0, 0, 0.3), menggantikan ketiga kartu tahun.
Papan peta: di d.titik.lapangan, menghadap kamera (hadap bawaan papanTulis 45 derajat, tanpa rotation.y tambahan).
Kartu alasan: muncul di ujung jejak L (d.titik.lapangan + titik(-3.0, 1.6), y 0.35), lalu mendarat di sel papan papanPeta.localToWorld(papanPeta.userData.titikSel(c, r)) (panggil papanPeta.updateMatrixWorld(true) sesudah menaruh papan). Kartu berdiri tegak, jadi titik asalnya 0.4 x skala di bawah titik sel. Kolom BUTUH berisi 3 kartu, MINAT 1 kartu, TANTANGAN 2 kartu. Baris r = 0 ada di atas, jadi menumpuk dari bawah berarti r = 2, 1, 0.
Kartu kegiatan: muncul di depan kolom BUTUH (titik sel BUTUH baris 2 + titik(0, 0.9), y 0.55), lalu menuju d.titik.pintu + y 0.7.
Pengecualian zona (laporkan):
gedung kelas: userData.penting = false (selalu terpotong di kiri atas).
komisariat, jalan, dan tangga: userData.penting = (t) => t < 6.0 || t > 18.5 (di luar bingkai selama kamera dekat ke gerbang dan papan).
figur L: userData.penting = (t) => t < saat figur itu mencapai d.titik.lapangan (sesudahnya berjalan keluar layar di kiri).
figur yang beku di 6.6: userData.penting = (t) => t < 6.4 (memudar 6.6 sampai 7.0 saat kamera masuk ke gerbang).
jejak abu dan jejak zamrud: userData.penting = false (menjalar keluar layar kiri bawah).
kartu alasan: userData.penting = (t) => t >= saat kartu itu mendarat (terbang masuk dari luar layar kiri).
papan peta: userData.penting = (t) => t < 23.0 (memudar bersama benda lain di segmen kuis).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: semua benda dunia muncul (muncul(d.urutan, { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
0.6 sampai 2.4: gelombang 2024, 12 figur keluar dari belakang gerbang dengan jeda 0.15 detik. Urutan jenis: B B B L B B B B L B B B (10 berbelok, 2 lurus).
2.4 sampai 4.2: gelombang 2025, urutan L L B L B B B B B L L L (6 berbelok, 6 lurus).
4.2 sampai 6.0: gelombang 2026, urutan B L B L B L L L L L L L (3 berbelok, 9 lurus).
Figur B yang tiba di d.titik.depanPintu langsung hilang (masuk komisariat). Figur L hilang saat mencapai ujung jalurnya. Kecepatan figur 3.6 unit per detik (laju: 3.6). Tiap figur muncul di titik awalnya pada detik berangkatnya (muncul, durasi 0.4, naik: 0).
Gerak figur yang masih berjalan melambat 6.0 dan berhenti 6.6 (beku bawaan format). Figur yang beku itu hilang pada 6.6 sampai 7.0 (hilang, durasi 0.4), supaya tidak menutupi kalimat sebab dan jejak abu. Hanya satu bunyi hilang lembut (kuat 0.3) untuk semuanya; sisanya bunyi: false.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.6: ketiga jejak abu tergambar dari gerbang ke ujung jalur L (aturTampak 0 ke 1).
7.0 sampai 7.8: ketiga kartu tahun muncul berurutan (jeda 0.2), abu, masing-masing dengan tanda tanya.
8.4 sampai 10.4: ketiga jejak memudar ke opacity 0 (aturOpasitas), seolah yang pergi tidak meninggalkan catatan.
10.4 sampai 13.0: adegan diam. Hanya kartu tahun kosong yang tersisa di atas gerbang.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.8: ketiga kartu tahun berubah menjadi grafik (gantiBenda(kartuTahun2, grafik, { t: 13.4, durasi: 0.4, tempat: false }), kartu kiri dan kanan hilang bersamaan). Tanda tanya ikut hilang.
13.8 sampai 14.7: ketiga batang grafik tumbuh berurutan (tumbuh, sumbu y, 0.3 detik per batang). Batang turun dari kiri ke kanan, sesuai tren 2024 sampai 2026. Tidak ada angka.
14.7 sampai 17.5: grafik tetap. Label tahun di atas kartu sudah keluar pada 17.2 sampai 17.6.
17.6 sampai 18.4: papan peta muncul di lapangan. Ketiga jejak zamrud tergambar ulang di jalur yang sama (aturTampak 0 ke 1).
18.4 sampai 20.8: enam kartu alasan muncul di ujung jejak (muncul, durasi 0.4, naik: 0) lalu meluncur ke papan (lintas, durasi 0.6), jeda 0.36 detik. Kartu terakhir mendarat 20.8. Urutan tujuan: BUTUH, TANTANGAN, BUTUH, MINAT, TANTANGAN, BUTUH. Kartu menumpuk di sel kolomnya dari bawah ke atas.
20.8: ketiga kartu di kolom BUTUH klikEmas bersamaan.
21.0 sampai 21.4: kartu kegiatan muncul di depan kolom BUTUH, warna emas.
21.4 sampai 22.4: kartu kegiatan melayang dengan busur setinggi 1.2 unit ke depan pintu komisariat (busur), lalu hilang di pintu pada 22.4.
22.0 sampai 22.8: abu komisariat dilepas dari 1 ke 0, sehingga komisariat kembali berwarna zamrudRedup.
Jangan menampilkan figur yang berbondong-bondong masuk sesudahnya. Gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Modul memudarkan semua benda lain, menampilkan terowongan enam lengkung, meluncurkan komisariat di bawahnya, lalu menempelkan laporan emas.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
8.4: gemuruh pelan (kuat 0.3, durasi 2.0) saat jejak memudar.
Bunyi kertas di 13.4 tidak dicatat lagi: gantiBenda sudah mencatatnya.
Langkah figur arus dibisukan sebagian supaya tidak riuh: bunyi: { kuat: 0.25 } pada jalan figur.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di grafik atau kartu. Video ini tidak memakai data nyata, jadi angka apa pun akan terbaca sebagai data karangan.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-01-v2 --periksa, lalu lihat hasil/gambar/indikator-01-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: gelombang 2025 berjalan, figur lurus lebih banyak daripada gelombang 2024;
5.5: gelombang 2026, hanya sedikit figur menuju komisariat;
9.5: kamera dekat ke gerbang, tiga kartu tahun kosong bertanda tanya, jejak sedang memudar (jejak abu mungkin nyaris tak tampak; periksa di pangkalnya dekat gerbang), kalimat sebab terbaca;
14.5: grafik tiga batang menurun, kalimat ikhtiar pertama terbaca;
18: papan peta muncul, jejak zamrud tergambar;
22: kartu kegiatan emas menuju pintu, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-01-v2. Hasilnya hasil/video/indikator-01-v2.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan lewat muat, pengecualian zona), lalu hasil zona, warna, LUFS, dan sinkron.
