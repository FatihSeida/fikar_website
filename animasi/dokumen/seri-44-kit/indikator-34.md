Prompt Animasi Indikator 34 dari 44
Judul indikator: Nama baik dan kekuatan batin HMI memudar.
Kelompok Tata Kelola. Mode Pandangan. Program terkait 06 Pemetaan Kebutuhan Mahasiswa dan Kampus.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-34/. Folder video lain jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-34 --format evidence --judul "Nama baik dan kekuatan batin HMI memudar.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-34/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Panji polos zamrud memudar ke abu. Pelintas berwarna pion.
Bagian 2: panji tetap abu dan tembus sebagian. Balon pembelaan berwarna abu (warna: W.abu). Satu titik masalah, yaitu panji, boleh denyutCermin. Tidak ada emas.
Bagian 3: kartu kerja berwarna bawaan dengan centang zamrud, papan persepsi dan kartu persepsi berwarna zamrud (proses). Emas hanya untuk satu rantai hasil: kartu di kolom KESAN, lalu kain panji. Panji kembali zamrud dan komisariat melepas abu di akhir.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Titik bantu: puncakPanji = d.titik.atap + y 2.3, ujungBalon = d.titik.lapangan + y 1.6, dan tujuanMahasiswa dari bagian F.
fokus: d.fokus;
gejala: { muat: [d.benda.gerbang, d.benda.komisariat, puncakPanji] } (perkiraan H sekitar 14);
sebab: { muat: [d.benda.komisariat, puncakPanji, ujungBalon], H: 10 };
ikhtiar: { muat: [d.benda.komisariat, puncakPanji, kartuKerja[0], kartuKerja[3], tujuanMahasiswa], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [papan, d.benda.komisariat, puncakPanji], H: 12 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya.
D. Benda yang Dipakai
Dari kit:
panji({ pola: false }): panji polos tanpa lambang, kain 1.0 x 0.7 di tiang 2.2, berdiri di atap komisariat. aturKibar(fase, amp) dan aturTembus(a) dipanggil dari v.setiapFrame. bagian.kain[] berisi potongan kain.
pion() x 10: pelintas Bagian 1. pion() x 2: pelintas Bagian 2. pion() x 1: satu mahasiswa di Bagian 3.
balonKata({ isi: "kabur", skala: 0.4, benih: k }) x 5: balon kabur di atas pelintas.
balonKata({ isi: "garis", skala: 0.5, warna: W.abu }) x 3: balon pembelaan dari komisariat.
kartuProker({ garis: 2, cek: 2, tercentang: 2, skala: 0.5 }) x 4: kartu kerja yang terlihat dan bisa diperiksa.
papanTulis({ lebar: 2.6, tinggi: 1.8, kaki: 1.0, kolom: ["KESAN", "BUTUH", "HARAPAN"], baris: ["", "", ""] }): papan persepsi.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, warna: W.zamrud, skala: 0.37 }) x 5: kartu persepsi mahasiswa.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "34", kategori: "TATA KELOLA", judul: "Nama baik dan kekuatan batin HMI memudar.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Persepsi mahasiswa terhadap HMI **hanya diasumsikan**, tidak pernah diukur, jadi perbaikannya pun hanya ditebak."
ikhtiar (berisi kalimat pandangan):
{ teks: "HMI Evidence memandang nama baik dipulihkan oleh **kerja yang terlihat dan bisa diperiksa**, bukan oleh pembelaan diri.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Karena itu persepsi mahasiswa diukur lewat **Pemetaan Kebutuhan Mahasiswa**, lalu perbaikan dimulai dari temuan itu.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 06".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan: tidak ada. Kepala kolom papan (“KESAN”, “BUTUH”, “HARAPAN”) dipasang oleh papanTulis.
F. Dunia dan Posisi
Dunia dasar duniaKader(v, { tanpa: ["kelas", "tangga"] }). Benda: gerbang di titik(-2.1, -0.7), jalan dari gerbang ke pintu komisariat, komisariat di titik(2.6, 2.2).
Titik dunia yang dipakai: d.titik.atap, d.titik.belakangGerbang, d.titik.gerbang, d.titik.depanGerbang, d.titik.awalJalan, d.titik.tengahJalan, d.titik.ujungJalan, d.titik.depanKomisariat, d.titik.lapangan.
Benda tambahan dan posisinya:
Panji: di d.titik.atap (resep 34 di docs dunia), menghadap kamera (bawaan hadap).
Jalur pelintas Bagian 1: [d.titik.belakangGerbang, d.titik.gerbang, d.titik.awalJalan, d.titik.tengahJalan, d.titik.depanKomisariat, d.titik.depanKomisariat + titik(2.6, 1.2)], semua di y 0, lengkung: true. Pelintas lewat di depan komisariat lalu keluar layar kanan bawah, tidak masuk pintu.
Balon kabur: anak scene (v.tambah), bukan anak pion, karena jalan({ hadap: true }) memutar pion dan balon yang menghadap kamera ikut miring bila menjadi anaknya. Balon ikut berjalan lewat jalan(balon, { t: <mulai pelintas k>, jalur: <jalur pelintas k, digeser +1.15 di y>, durasi: 3.0, lengkung: true, bunyi: false }) tanpa hadap, sehingga geraknya (termasuk beku bawaan) sama dengan pelintas; muncul dan hilang balon sesuai bagian G.
Balon pembelaan: muncul di d.titik.atap + titik(-0.5, 0, 0.7), di kiri tiang panji, lalu melayang menuju ujungBalon (d.titik.lapangan + y 1.6).
Jalur pelintas Bagian 2: dari d.titik.lapangan + titik(-2.4, 0.2) ke d.titik.lapangan + titik(1.0, 1.2).
Kartu kerja 1 sampai 4: berderet di d.titik.depanKomisariat + titik(-0.9 + 0.6k, 0), k 0 sampai 3, menghadap kamera (bawaan hadap).
Satu mahasiswa Bagian 3: muncul di d.titik.lapangan + titik(-1.2, 0), berjalan ke tujuanMahasiswa = d.titik.depanKomisariat + titik(-0.3, 1.0), di depan deretan kartu kerja.
Papan persepsi: di d.titik.lapangan, menghadap kamera (rotasi y 45 derajat bawaan). Panggil papan.updateMatrixWorld(true) sesudah menaruhnya.
Kartu persepsi: asal di kepala mahasiswa (tujuanMahasiswa + y 1.4), d.titik.tengahJalan + y 0.9, d.titik.awalJalan + y 0.9, d.titik.depanGerbang + y 0.9, dan d.titik.ujungJalan + y 0.9. Tujuannya sel papan (papan.localToWorld(papan.userData.titikSel(k, r)), digeser turun 0.4 x 0.37 karena titik asal kartu di tepi bawah). Urutan tujuan: KESAN baris 2, BUTUH baris 2, KESAN baris 1, HARAPAN baris 2, KESAN baris 0.
Pengecualian zona: gerbang dan jalan boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). Pelintas Bagian 1 tidak dihitung sesudah melewati d.titik.depanKomisariat (keluar layar) dan sejak 6.4 bila dibekukan. Pelintas Bagian 2 tidak dihitung (penting: false), karena masuk dan keluar dari tepi layar.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: gerbang, jalan, komisariat, dan panji muncul (muncul([...d.urutan, panji], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
0.6 sampai 6.0: panji berkibar pelan (aturKibar(2.2 * t, 0.06) tiap frame).
1.6 sampai 6.0: sepuluh pelintas berjalan melintas di depan komisariat, mulai 1.6 + 0.4k (k 0 sampai 9). Masing-masing muncul di titik awal (durasi: 0.3, naik: 0), lalu jalan dengan durasi: 3.0, lengkung: true, hadap: true, bunyi: { kuat: 0.25 }. Pelintas yang tiba di ujung jalur hilang.
Balon kabur muncul di atas pelintas k = 0, 2, 3, 5, dan 6, pada 1.2 detik sesudah pelintas itu mulai (saat berjalan di jalan menuju komisariat), lalu hilang 1.0 detik kemudian (durasi: 0.3). Balon terakhir hilang 6.2.
1.6 sampai 5.6: panji memudar ke abu (setelKeadaan(panji, "abu", 0 ke 1)) dan kainnya menjadi tembus sebagian (aturTembus 1 ke 0.45).
Pelintas yang masih berjalan melambat 6.0 dan berhenti 6.6 (beku bawaan), lalu hilang pada 6.6 dengan satu bunyi lembut (kuat 0.3) untuk semuanya.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.0 sampai 6.6: kibaran panji melemah, amp 0.06 ke 0.025, lalu tetap 0.025.
7.0, 8.2, dan 9.4: balon pembelaan muncul di kiri tiang panji (durasi: 0.3, naik: 0), lalu melayang menuju ujungBalon (busur, tinggi: 0.5, durasi: 1.4). Setiap balon hilang 0.4 detik sebelum tiba (durasi: 0.4), jadi tidak pernah sampai.
7.0 sampai 12.0: dua pelintas Bagian 2 berjalan di lapangan tanpa menoleh (mulai 7.0 dan 8.0, jalan dengan durasi: 4.0, hadap: true, bunyi: { kuat: 0.2 }), lalu hilang saat tiba. Pembelaan tidak didengar.
9.6 sampai 12.6: panji berdenyut (denyutCermin(panji, { mulai: 9.6, selesai: 12.6 }), tepi denyut mengenai tiang).
12.0 sampai 13.0: adegan diam.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.4 sampai 15.6: empat kartu kerja muncul satu per satu di depan komisariat (muncul, durasi: 0.4, jeda 0.6). Setiap kartu sudah memuat dua centang zamrud. Kerja yang terlihat dan bisa diperiksa.
15.6 sampai 17.4: satu mahasiswa muncul di lapangan (durasi: 0.3, naik: 0), lalu jalan ke tujuanMahasiswa (durasi: 1.8, hadap: true) dan berhenti menghadap deretan kartu kerja. Hanya satu figur.
17.8 sampai 18.4: papan persepsi muncul di lapangan (muncul, durasi: 0.6).
18.4 sampai 20.6: lima kartu persepsi muncul di asalnya (durasi: 0.3, naik: 0) dan meluncur ke sel papan (lintas, durasi: 0.6) bersamaan: muncul dan lintas kartu ke-k (k 0 sampai 4) dimulai pada 18.4 + 0.4k, jadi kartu ke-k mendarat 19.0 + 0.4k dan kartu kelima mendarat 20.6. Kartu menumpuk di kolom dari bawah ke atas.
20.8: ketiga kartu di kolom KESAN klikEmas bersamaan. Itu temuan pemetaan.
20.8 sampai 21.6: panji kembali berwarna: abu 1 ke 0, aturTembus 0.45 ke 1, kibaran amp 0.025 ke 0.06.
21.6: klikEmas(panji.userData.bagian.kain[0]), yaitu seluruh kain (panji({ pola: false }) hanya punya satu mesh kain, dan kain tidak boleh diberi pola atau garis).
21.6 sampai 22.4: abu komisariat dilepas dari 1 ke 0.
22.4 sampai 23.0: adegan diam. Jangan menampilkan rombongan mahasiswa yang datang ke komisariat. Gambar seperti itu sama dengan klaim hasil.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat: d.benda.komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA). Panji ikut memudar bersama benda lain.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Kibaran panji tetap disetel di setiapFrame yang sama, dengan amp 0.06 sesudah 21.6. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
7.0, 8.2, dan 9.4: balon (kuat 0.4) saat balon pembelaan muncul. muncul balon diberi bunyi: false;
1.6: gemuruh sangat pelan (kuat 0.2, durasi 4.0) selama panji memudar;
18.4: kertas (kuat 0.5) saat kartu persepsi pertama berangkat.
Langkah pelintas dibisukan sebagian: bunyi: { kuat: 0.25 } pada jalan.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3, termasuk panji, sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Catatan kepekaan: panji polos tanpa lambang, bukan bendera HMI. Pakai panji({ pola: false }). Jangan menambahkan lambang, huruf, garis hias, atau pola apa pun pada kain.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada teks yang terbaca di balon. Isi balon hanya “kabur” dan “garis”.
Tidak boleh ada angka di papan atau kartu.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-34 --periksa, lalu lihat hasil/gambar/indikator-34/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: pelintas berjalan di depan komisariat, satu balon kabur tampak, panji polos mulai memudar;
5.5: panji hampir abu penuh dan tembus, pelintas terakhir di jalan;
10.5: kamera dekat ke komisariat, satu balon pembelaan melayang dan mulai pudar, panji berdenyut, kalimat sebab terbaca;
14.5: dua kartu kerja bercentang sudah berdiri di depan komisariat, kalimat pandangan pertama terbaca;
18.7: papan persepsi tampak, kartu persepsi pertama meluncur;
22.5: kolom KESAN emas, kain panji emas, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-34. Hasilnya hasil/video/indikator-34.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, bagian kain yang menjadi emas), lalu hasil zona, warna, LUFS, dan sinkron.
