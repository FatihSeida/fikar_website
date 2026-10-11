Prompt Animasi Indikator 35 dari 44
Judul indikator: Peran, jumlah, dan mutu HMI dinilai mengecil.
Kelompok Target Program. Mode Ikhtiar. Program terkait 03 Indeks Kaderisasi dan 04 Platform Kaderisasi Digital.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-35/. Folder video lain jangan diubah.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-35 --format evidence --judul "Peran, jumlah, dan mutu HMI dinilai mengecil.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-35/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat berwarna abu penuh (setelKeadaan(komisariat, "abu", 1)). Kedua figur berwarna pion. Balon panah berwarna abu (warna: W.abu).
Bagian 2: balon panah tetap abu. Satu titik masalah, yaitu papan rencana yang kosong, boleh denyutCermin. Tidak ada emas.
Bagian 3: layar papar, garis dasar, dan kartu data berwarna zamrud (proses). Isi layar memakai POLA_LAYAR, yang sudah memakai warna token. Emas hanya untuk satu rantai hasil: layar papar. Komisariat melepas abu sesudah layar menjadi emas.
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Titik bantu: atasBalonA = posisi akhir figur A + y 1.9, atasBalonB = posisi akhir figur B + y 1.9.
fokus: d.fokus;
gejala: { muat: [d.benda.papan, komisariat, figurA, figurB, atasBalonA] } (perkiraan H sekitar 12.5);
sebab: { muat: [d.benda.papan, figurA, figurB, atasBalonA, atasBalonB], H: 10 };
ikhtiar: { muat: [layar, komisariat, figurA], H: 11 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. Posisi akhir kedua figur adalah titik tujuan lintas.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6 dengan atap 0.7. Dunia Rencana tidak punya komisariat, jadi benda ini ditambahkan.
pion() x 2: figur A dan figur B.
balonKata({ isi: "panahNaik", warna: W.abu, skala }) x 5 dan balonKata({ isi: "panahTurun", warna: W.abu, skala }) x 5: balon penilaian yang saling bertentangan, tanpa angka.
layarKanal({ lebar: 2.4, tinggi: 1.6, kaki: 0.9 }): layar papar. Isinya digambar dengan setelIsi(kunci, POLA_LAYAR.kosong()) dan POLA_LAYAR.grafik(nilai[]), tanpa teks dan tanpa angka. Benda ini dipilih, bukan layarPapar, karena batangnya harus bisa diperbarui.
garisPutus({ titik: [a, b], warna: W.zamrudPijar, lebar: 2 }): garis dasar di muka layar.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, warna: W.zamrud, skala: 0.4 }) x 5: kartu data dari komisariat ke layar.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "35", kategori: "TARGET PROGRAM", judul: "Peran, jumlah, dan mutu HMI dinilai mengecil.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Komisariat **tidak punya angka dasar** tentang dirinya, jadi penilaian maju atau mundur hanya bergantung pada kesan."
ikhtiar:
{ teks: "**Indeks Kaderisasi** memberi setiap komisariat ukuran dasar yang sederhana.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Platform Kaderisasi Digital** memperbaruinya setiap semester, sehingga perubahan terlihat dari waktu ke waktu.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 03 · Program 04".
kuis: { pertanyaan: "Saat menilai komisariatmu berkembang atau mundur, apa yang dipakai sebagai dasar?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label mikro kelas zamrud penanda semester di atas layar, jangkar layar, geser [0, 2.75, 0]: “SEMESTER GANJIL” masuk 14.0 sampai 14.3, berganti “SEMESTER GENAP” pada 18.6 dan “SEMESTER BERIKUTNYA” pada 19.8 (gantiLabel), keluar 22.6 sampai 23.0.
Label mikro “UKURAN DASAR” di ujung kiri garis dasar, geser [-0.1, 0.12, 0]. Masuk 14.3 sampai 14.6, keluar 22.6 sampai 23.0.
F. Dunia dan Posisi
Dunia dasar duniaRencana(v, { tanpa: ["meja", "lintasan", "bendera"] }). Meja ditiadakan sesuai resep 35 di docs dunia. Lintasan dan bendera juga ditiadakan karena figur B di titik prompt lama jatuh tepat di ubin lintasan. Benda yang tersisa: papan di titik(-1.6, -2.6), menghadap kamera, permukaannya kosong.
Titik dunia yang dipakai: d.titik.papan, d.titik.depanPapan.
Benda tambahan dan posisinya:
Komisariat: di titik(1.8, 0.2), rotasi 0. Ujung kirinya di r 0.6, jadi tidak menutupi papan.
Pintu komisariat (asal kartu data): komisariat.position + titik(-0.57, 0.57, 0.6), yaitu tengah muka +z, setinggi 0.6.
Figur A: mulai di titik(0.6, 2.2), rotasi y 3 * Math.PI / 4 (menghadap kanan layar), bergeser ke titik(1.0, 2.2).
Figur B: mulai di titik(3.0, 2.2), rotasi y -Math.PI / 4 (menghadap kiri layar), bergeser ke titik(2.6, 2.2).
Balon: anak figur, di y 1.15 di atas kakinya, sehingga ikut bergeser. Setel balon.rotation.y = -figur.rotation.y sekali, sesudah balon ditambahkan ke figur (A: -3 * Math.PI / 4, B: Math.PI / 4), supaya balon tetap menghadap kamera; lintas figur tanpa hadap tidak mengubah rotasi.
Layar papar: di titik(-0.9, 0.8), menghadap kamera (bawaan hadap), di antara papan dan komisariat. Puncak layar (y 2.5) tetap di bawah tepi bawah papan di layar. Bila bertumpuk dengan papan, geser layar ke bawah layar paling banyak 0.4 dan laporkan.
Garis dasar: dua titik di muka layar, layar.localToWorld(new THREE.Vector3(±1.05, yDasar, 0.07)) sesudah layar.updateMatrixWorld(true). yDasar = 1.54, setinggi puncak batang terendah semester ganjil (bidang layar 2.26 x 1.46 berpusat y 1.7, puncaknya 2.43; batang 0.35 berpuncak pada 0.84 - 0.66 x 0.35 = 0.609 dari atas, jadi 2.43 - 1.46 x 0.609 = 1.54). Laporkan 1.54.
Tujuan kartu data: pusat muka layar (layar.userData.pusatLayar, ubah ke titik dunia bila lokal).
Pengecualian zona: papan dan figur B boleh terpotong sesudah 13.0 (userData.penting = (t) => t < 13.0). komisariat boleh terpotong selama 6.0 sampai 13.0.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 1.6: papan, komisariat, figur A, dan figur B muncul (muncul([...d.urutan, komisariat, figurA, figurB], { t: 0.6, selesai: 1.6 })). Papan kosong. Komisariat abu penuh sejak awal.
1.6 sampai 6.0: kedua figur bergeser pelan saling mendekat (lintas, durasi: 4.4, dari posisi awal ke posisi akhir di bagian F).
1.6 sampai 6.3: enam balon muncul bergantian dari figur yang berbeda pada 1.6 (A, panah naik), 2.3 (B, panah turun), 3.0 (A), 3.7 (B), 4.4 (A), dan 5.1 (B). Skala balon ke-k (k 0 sampai 5) adalah 0.32 + 0.04k, jadi semakin besar. Setiap balon muncul (durasi: 0.25, naik: 0), lalu hilang 1.2 detik kemudian (durasi: 0.3). Balon A dan B sempat tampak bersamaan dan saling bertentangan.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.8 sampai 10.5: empat balon lagi, skala 0.52, pada 6.8 (B, turun), 7.6 (A, naik), 8.4 (B, turun), dan 9.2 (A, naik). Masing-masing hilang 1.0 detik sesudah muncul.
9.6 sampai 12.6: papan yang kosong berdenyut (denyutCermin(d.benda.papan, { mulai: 9.6, selesai: 12.6 })). Tidak ada angka dasar di papan.
10.5 sampai 13.0: adegan diam. Kedua figur berdiri berhadapan.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.9: layar papar muncul di samping komisariat (muncul, durasi: 0.5), isinya kosong.
14.0: isi layar menjadi grafik semester ganjil, POLA_LAYAR.grafik([0.45, 0.6, 0.35]). 14.0 sampai 14.6: garis dasar tergambar dari kiri ke kanan (aturTampak 0 ke 1).
15.0, 15.6, dan 16.2: tiga kartu data muncul di pintu komisariat (durasi: 0.2, naik: 0), meluncur ke pusat layar (lintas, durasi: 0.8), lalu hilang saat tiba (durasi: 0.2). Kartu terakhir hilang 17.2.
18.0 sampai 18.6: kartu data keempat meluncur ke layar dengan cara yang sama. 18.6: penanda semester berganti “SEMESTER GENAP”, dan isi layar menjadi POLA_LAYAR.grafik([0.55, 0.62, 0.45]). Garis dasar tetap, jadi perubahan terlihat.
19.2 sampai 19.8: kartu data kelima. 19.8: penanda berganti “SEMESTER BERIKUTNYA”, isi layar POLA_LAYAR.grafik([0.6, 0.7, 0.55]).
20.6: klikEmas(layar).
20.8 sampai 21.6: abu komisariat dilepas dari 1 ke 0.
21.6 sampai 23.0: adegan diam. Kedua figur tetap berdiri, tidak ada figur tambahan.
Isi layar disetel dari v.setiapFrame lewat setelIsi dengan kunci: "mati" sebelum 14.0, "ganjil" 14.0 sampai 18.6, "genap" 18.6 sampai 19.8, "lanjut" sesudah 19.8.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TARGET PROGRAM).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
setiap balon panah: balon (kuat 0.4) saat muncul. muncul balon diberi bunyi: false;
14.0: kertas (kuat 0.5) saat grafik pertama tampak di layar;
18.6 dan 19.8: tumbuh (kuat 0.4, durasi 0.35) saat batang diperbarui.
Figur tidak berjalan (hanya lintas), jadi tidak ada bunyi langkah. Beri bunyi: false pada lintas figur.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di layar, batang, balon, atau label, termasuk angka contoh dari prompt lama (“48”, “22”, “9”) dan nomor semester. Video ini tidak memakai data nyata.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-35 --periksa, lalu lihat hasil/gambar/indikator-35/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: dua figur berhadapan di depan komisariat abu, balon panah naik dan panah turun tampak bersamaan;
5.5: balon terbesar di atas figur B, kedua figur sudah lebih dekat;
10.2: kamera dekat ke kedua figur dan papan kosong, papan berdenyut, kalimat sebab terbaca;
14.5: layar papar menampilkan grafik dengan garis dasar dan label SEMESTER GANJIL, kalimat ikhtiar pertama terbaca;
18.9: batang sudah diperbarui, label SEMESTER GENAP, garis dasar tetap;
21.7: layar emas, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-35. Hasilnya hasil/video/indikator-35.mp4. Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, letak layar, nilai yDasar), lalu hasil zona, warna, LUFS, dan sinkron.
