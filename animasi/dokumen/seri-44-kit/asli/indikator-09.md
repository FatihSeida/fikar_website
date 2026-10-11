Prompt Animasi Indikator 09 dari 44
Judul indikator: Pemahaman, penghayatan, dan pengamalan ajaran Islam masih kurang.
Kelompok Kaderisasi. Mode Pandangan. Program terkait 01 Sistem Kaderisasi Berkelanjutan dan 06 Pemetaan Kebutuhan Mahasiswa dan Kampus.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-09-v2/. Folder lama animasi/proyek/indikator-09/ jangan diubah, tetapi wajib dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-09-v2 --format evidence --judul "Pemahaman, penghayatan, dan pengamalan ajaran Islam masih kurang.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-09-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo. Video lama memasang keterangan “ISI KUIS” sendiri; di video ini jangan, karena format evidence sudah mengatur teks kuis.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: kedua rak, meja, peserta, dan pemateri abu penuh. Panah satu arah abu. Komisariat abu penuh. Lentera padam.
Bagian 2: buku kajian abu. Tanda tanya di atas kepala peserta warna bawaan (kertas redup), lalu memudar. Satu titik masalah boleh berdenyut zamrud: buku kajian (denyutCermin). Tidak ada emas.
Bagian 3: papan, kartu pertanyaan, dan buku kajian baru berwarna zamrud (proses). Rak, meja, peserta, dan pemateri melepas abu. Emas hanya untuk satu rantai hasil: kelima lentera di atas meja yang menyala berurutan (nyala 0.9 = emas).
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
Kamera diisi lewat kamera di akhiriEvidence, memakai kunci muat supaya fokus dan H dihitung otomatis. Nama kunci tetap ikhtiar walaupun mode pandangan:
fokus: d.fokus;
gejala: { muat: [d.benda.rakKiri, d.benda.rakKanan, d.benda.meja, kotak, komisariat] } (H dihitung otomatis);
sebab: { muat: [d.benda.meja, pemateri, ...titikTanya], H: 9 };
ikhtiar: { muat: [kotak, papan, d.benda.meja], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [papan, d.benda.meja, d.titik.pusatLentera, komisariat], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. titikTanya adalah lima titik tanda tanya di atas kepala peserta (bagian F) + y 0.25.
D. Benda yang Dipakai
Dari kit:
duniaPustaka(v): dunia Pustaka bawaan (sama dengan video lama). Lima peserta duduk (kursi1..5), lima lentera padam.
pion(): pemateri berdiri.
pion({ duduk: true }): pemateri yang duduk bergabung (dari video lama).
kotakCelah({ label: null }): kotak pertanyaan. Titik celah lewat kotak.userData.titikCelah (lokal, ubah dengan kotak.localToWorld).
panahGaris({ titik: [...], warna: W.abu, tebal: 0.025, kepala: { radius: 0.075, panjang: 0.2 }, penting: false }) x 3: panah satu arah dari pemateri ke peserta.
rumah(): komisariat, diskalakan 0.7 (scale.setScalar(0.7)).
tandaTanya({ ukuran: 0.35, hadapKamera: true, tengah: true }) x 5: pertanyaan tiap peserta.
buku({ tinggi: 0.6, lebar: 0.45, tebal: 0.12, warna: W.abu }): buku kajian yang sama setiap periode, berbaring.
papanTulis({ lebar: 1.8, tinggi: 1.2, kaki: 0.6, kolom: ["", "", ""], baris: ["", ""] }): papan penyusun pertanyaan, tanpa label terbaca.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.3, warna: W.zamrud }) x 5: pertanyaan yang sudah ditangkap dan disusun.
buku({ terbuka: true, tinggi: 0.8, lebar: 0.6, warna: W.zamrud }): buku kajian baru.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "09", kategori: "KADERISASI", judul: "Pemahaman, penghayatan, dan pengamalan ajaran Islam masih kurang.", mode: "pandangan".
gejala: "" (label GEJALA saja).
sebab: "Kajian disusun dari **tema turun-temurun**, bukan dari pertanyaan yang benar-benar dimiliki kader."
ikhtiar (kalimat pandangan):
{ teks: "HMI Evidence memandang keislaman tumbuh dari **pertanyaan yang dijawab dengan sungguh-sungguh**, bukan dari hafalan tema.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Karena itu pertanyaan kader dikumpulkan lebih dulu, lalu kajian disusun dari situ.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 01 · Program 06".
kuis: { pertanyaan: null, kalimat: "Ukur komisariatmu, dapatkan laporannya." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label "PERTANYAAN" di atas kotak, seperti video lama: label3D("PERTANYAAN", { pada: kotak, geser: [0, 0.95, 0], gaya: "kotak", kelas: "zamrud", masuk: 0.9, skala: 0.8, keluar: [22.6, 23.0] }).
Label mikro periode di atas meja: label3D("PERIODE 1", { pada: d.titik.meja, geser: [0, 0.55, 0], gaya: "mikro", masuk: [7.4, 7.8], keluar: [12.6, 13.0] }), berganti "PERIODE 2" pada 9.2 dan "PERIODE 3" pada 11.0 (gantiLabel).
F. Dunia dan Posisi
Dunia dasar duniaPustaka tanpa penyesuaian. Benda: lantai di titik(0, 0) (permukaan y 0.1), rakKiri di titik(-2.6, -2.8, 0.1), rakKanan di titik(2.4, -2.9, 0.1), meja di titik(0, 1.0, 0.1) (permukaan y 0.85), bangku1..5 dan kursi1..5 pada radius 1.8, lentera1..5 padam (pusat bola y 3.0).
Titik dunia yang dipakai: d.titik.duduk[i], d.titik.atasKepala[i], d.titik.meja, d.titik.pusatLentera.
Benda tambahan dan posisinya (Bagian 1 sama dengan video lama):
Pemateri: titik(0, -0.6, 0.1), di belakang meja, tidak bertabrakan dengan kursi.
Pemateri duduk: titik(0.55, -0.6, 0.35) (posisi video lama).
Kotak pertanyaan: titik(2.2, 2.6, 0.1). celah = kotak.localToWorld(kotak.userData.titikCelah.clone()), sesudah kotak.updateMatrixWorld(true).
Panah satu arah 1, 2, 3: dari titik(0, -0.25, 1.1) ke d.titik.duduk[1], d.titik.duduk[0], dan d.titik.duduk[4] dengan y 0.95.
Komisariat: titik(-2.6, 2.5, 0.1), di sudut kiri bawah lantai (berseberangan dengan kotak), rotasi 0, skala 0.7. Tidak menyentuh kursi kiri depan.
Tanda tanya ke-i: d.titik.atasKepala[i] + y 0.2.
Buku kajian: d.titik.meja, diputar 45 derajat supaya sampulnya mendatar di layar.
Papan: titik(0, -2.5, 0.1), di antara kedua rak, menghadap kamera (hadap bawaan). Kepala pemateri tidak menutupi papan.
Kartu pertanyaan ke-k: sel papan papan.localToWorld(papan.userData.titikSel(kolom, baris)) (panggil papan.updateMatrixWorld(true) sesudah menaruh papan), urutan sel (0, 1), (1, 1), (2, 1), (0, 0), (1, 0), yaitu baris bawah dulu. Titik asal kartu di tepi bawah, jadi turunkan 0.4 x 0.3 dari pusat sel, lalu majukan 0.03 ke arah penonton.
Jalur kartu: dari celah lewat titik(1.4, 0.2, 2.0) ke selnya, di bawah lingkar lentera.
Buku kajian baru: muncul di depan papan, papan.position + titik(0, 0.5, 1.0), lalu turun ke d.titik.meja + y 0.02.
Pengecualian zona (laporkan): lantai, rakKiri, rakKanan, dan lentera1..5 boleh terpotong sesudah 6.0 (userData.penting = (t) => t < 6.0). Kotak (t) => t < 6.0 || t >= 13.0. Komisariat (t) => t < 6.0 || t >= 17.5. Panah satu arah sudah penting: false.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-09/adegan.js, bagian Gejala. Dunia, benda, posisi, dan waktunya sama persis. Satu-satunya tambahan adalah komisariat.
0.6 sampai 1.6: dunia Pustaka, pemateri, kotak, dan komisariat muncul (muncul([...d.urutan, pemateri, kotak, komisariat], { t: 0.6, selesai: 1.6, durasi: 0.4 })). Label PERTANYAAN masuk 0.9.
Sejak awal, kedua rak, meja, peserta, pemateri, dan komisariat abu penuh (setelKeadaan(..., "abu", 1) di setiapFrame).
1.6 sampai 6.6: panah satu arah keluar dari pemateri ke tiga peserta, berulang setiap 0.8 detik. Di setiapFrame, untuk panah ke-i: fase = ((min(t, 6.6) - 1.6 - 0.08 * i) % 0.8 + 0.8) % 0.8, aktif bila 1.6 <= t < 6.6, aturTampak(aktif ? halus(min(fase / 0.3, 1)) : 0), aturOpasitas(aktif ? 0.85 * (1 - halus(rentang(fase, 0.55, 0.8))) : 0). Bunyi: catat({ t, jenis: "whoosh", durasi: 0.5, kuat: 0.28, x: 0.5, sumber: "panah satu arah" }) pada 1.6, 2.4, 3.2, 4.0, 4.8, dan 5.6.
2.6 sampai 6.0: peserta meredup satu per satu. Di setiapFrame, peserta ke-i: masuk = halus(rentang(t, 0.85 + 0.03 * i, 1.3 + 0.03 * i)), redup = halus(rentang(t, 2.6 + 0.6 * i, 3.2 + 0.6 * i)), aturOpasitas(peserta, masuk * (1 - 0.7 * redup * (1 - pulih))), dengan pulih dari Bagian 3 (0 sampai 19.6).
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.5: lima tanda tanya tampak di atas kepala peserta. Semua opasitas tanda tanya diatur di setiapFrame (jangan memakai muncul atau hilang untuk tanda tanya): a = halus(rentang(t, 6.6 + 0.12 * i, 7.0 + 0.12 * i)).
7.4 sampai 8.8: buku kajian muncul di meja (durasi 0.4, naik: 0.3), lalu hilang pada 8.8 (durasi 0.4). Label PERIODE 1 masuk.
9.2 sampai 10.6: buku yang sama muncul lagi pada 9.2, label berganti PERIODE 2, lalu hilang pada 10.6.
11.0: buku yang sama muncul lagi dan tetap, label berganti PERIODE 3. Isi buku tidak pernah berubah.
8.0 sampai 11.6: tanda tanya memudar perlahan tanpa disentuh: opasitas dikali 1 - 0.75 * halus(rentang(t, 8.0 + 0.3 * i, 11.6 + 0.2 * i)).
11.4 sampai 12.9: buku kajian berdenyut zamrud (denyutCermin(buku, { mulai: 11.4, selesai: 12.9 })).
Pemateri tetap berdiri dan abu. Peserta tetap redup.
Bagian 3, Pandangan HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.5: papan muncul di antara kedua rak.
13.2 sampai 13.6: tanda tanya kembali jelas: faktor pudar dikali 1 - halus(rentang(t, 13.2, 13.6)).
13.6 sampai 15.4: tanda tanya ke-i ditangkap kotak pertanyaan (busur, dari titiknya ke celah, mulai 13.6 + 0.3 * i, durasi 0.6, tinggi 1.0). Saat tiba, opasitasnya dikali 1 - halus(rentang(t, tiba, tiba + 0.15)).
15.4 sampai 17.0: lima kartu pertanyaan keluar dari celah satu per satu dan menempel di sel papan: muncul(kartu, { t: 15.4 + 0.35 * k, durasi: 0.15, naik: 0 }), lintas(kartu, { t: 15.4 + 0.35 * k, durasi: 0.6, jalur: [celah, titik(1.4, 0.2, 2.0), sel], lengkung: true }).
17.0 sampai 17.6: adegan tetap.
18.2 sampai 18.6: buku kajian baru muncul di depan papan.
18.6 sampai 19.4: buku kajian lama hilang (18.6, durasi 0.4). Buku kajian baru turun ke meja (lintas, mulai 18.6, durasi 0.8, lengkung: true).
19.6 sampai 20.3: pemateri berubah menjadi pemateri yang duduk bergabung (gantiBenda(pemateri, pemateriDuduk, { t: 19.6, durasi: 0.7, tempat: false })).
19.6 sampai 20.8: pulih = halus(rentang(t, 19.6, 20.8)). Abu rak, meja, peserta, dan pemateri dilepas (1 - pulih). Peserta kembali penuh.
20.8 sampai 22.0: kelima lentera menyala emas berurutan (setelKeadaan(lentera_i, "nyala", 0.9 * halus(rentang(t, 20.8 + 0.2 * i, 21.2 + 0.2 * i)))). Ini satu-satunya rantai emas.
Jangan menambah peserta atau figur lain.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (KADERISASI).
Abu komisariat tetap 1 sampai 23.0 dan dilepas oleh akhiriEvidence.
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
7.4, 9.2, dan 11.0: kertas (kuat 0.4, posisi d.titik.meja, nada 0) setiap buku yang sama muncul lagi;
setiap tanda tanya tiba di celah (14.2 + 0.3 * i): mendarat (kuat 0.4, nada i, posisi celah);
20.8 + 0.2 * i: menyala (kuat 0.5, nada i, posisi lentera ke-i).
Tidak ada figur yang berjalan, jadi tidak perlu peredaman langkah.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Catatan kepekaan: tanpa simbol agama (tidak ada kubah, bulan sabit, bintang, kaligrafi, sajadah, tasbih, peci, atau ornamen yang menyerupainya), tanpa teks Arab, dan tanpa kesan menilai kesalehan kader. Buku kajian polos tanpa hiasan.
Peserta yang meredup hanya menandai pertanyaan yang tidak tersentuh. Tidak ada tanda, label, atau warna yang menilai pribadi peserta.
Tidak boleh ada teks pertanyaan yang terbaca. Kartu dan tanda tanya tanpa isi tulisan.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-09-v2 --periksa, lalu lihat hasil/gambar/indikator-09-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: panah abu keluar dari pemateri ke peserta, satu peserta mulai redup, label PERTANYAAN terbaca;
5.5: tiga atau empat peserta sudah redup, rak dan meja abu, komisariat abu di sudut kiri bawah;
9.5: kamera dekat ke meja, buku kajian yang sama tampak lagi dengan label PERIODE 2, tanda tanya mulai pudar, kalimat sebab terbaca;
14.5: papan tampak, tanda tanya sedang terbang ke kotak pertanyaan, kalimat pandangan pertama terbaca;
19.7: buku kajian baru sudah di meja, buku lama hilang, lima kartu menempel di papan;
22.3: kelima lentera menyala emas, rak dan peserta pulih, pemateri duduk, kalimat pandangan kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-09-v2. Hasilnya hasil/video/indikator-09-v2.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, letak papan bila menyentuh rak).
