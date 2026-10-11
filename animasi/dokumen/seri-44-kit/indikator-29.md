Prompt Animasi Indikator 29 dari 44
Judul indikator: Keterlibatan dalam politik menyerap perhatian, tenaga, pikiran, dan dana.
Kelompok Tata Kelola. Mode Ikhtiar. Program terkait 11 Pemeriksaan Kepatuhan Konstitusi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-29/.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.2 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-29 --format evidence --judul "Keterlibatan dalam politik menyerap perhatian, tenaga, pikiran, dan dana.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-29/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan perintah sesuai README: PowerShell di PC Windows, Bash biasa di sesi cloud.
Keputusan di PANDUAN-EVIDENCE bagian 7 berlaku: jangan berhenti untuk bertanya; catat penyimpangan satu baris di laporan.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: komisariat abu penuh. Wadah PERKADERAN dan KARYA abu penuh. Wadah URUSAN LAIN berwarna bawaan. Bola aliran zamrudPijar bawaan kit.
Bagian 2: map laporan dan gemboknya abu. Map boleh berdenyut zamrud (denyutCermin). Tidak ada emas.
Bagian 3: panel laporan dan aliran berwarna zamrud (proses). Wadah PERKADERAN dan KARYA melepas abu saat aliran masuk. Emas hanya untuk satu hasil: panel laporan yang terbuka. Komisariat melepas abu sesudahnya.
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
fokus: titik(0, 0, 0.8);
gejala: { muat: [komisariat, corong, wadahKader, wadahKarya, wadahLain] } (perkiraan H sekitar 14);
sebab: { muat: [komisariat, map, corong], H: 9 };
ikhtiar: { muat: [komisariat, panelLaporan, wadahKader, wadahKarya, wadahLain], H: 12 }.
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) bila perlu. Panel laporan berdiri di tempat map, jadi posisi dasarnya sudah benar.
D. Benda yang Dipakai
Dari kit:
rumah(): komisariat, 1.8 x 1.2 x 1.6, atap 0.7.
corong({ radiusAtas: 0.6, radiusBawah: 0.12, tinggi: 0.6, leher: 0.25, kaki: 1.1 }): corong berkaki. userData.mulut dan userData.keluar adalah titik lokal mulut atas dan lubang keluar.
talang({ titik: [...], radius: 0.12 }) x 3: talang dari corong ke tiap wadah. userData.jalurAliran(n) memberi titik aliran.
wadahKaca({ radius: 0.6, tinggi: 1.0, isi: 0.1, label }) x 3: wadahKader (label “PERKADERAN”), wadahKarya (label “KARYA”), wadahLain (label “URUSAN LAIN”). userData.aturIsi(h) dan userData.mulut.
aliran({ jalur, mulai, selesai, laju: 2, jarak }): bola cahaya tenaga dan dana.
map({ lembar: 2 }): map laporan tertutup, berbaring. userData.bagian.sampulDepan berporos di tepi kiri.
gembok(): gembok di atas map, userData.bagian.busur berporos di kaki kiri.
panelKertas({ lebar: 2.0, tinggi: 1.2, batang: [0.3, 0.2, 0.9], jalur: true, labelBaris: ["PERKADERAN", "KARYA", "URUSAN LAIN"], kaki: "alas" }): panel laporan dengan batang pembagian tanpa angka.
Benda lokal: tidak ada.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "29", kategori: "TATA KELOLA", judul: "Keterlibatan dalam politik menyerap perhatian, tenaga, pikiran, dan dana.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Pemakaian waktu dan dana **tidak pernah dilaporkan terbuka**, jadi prioritas organisasi tidak bisa dibahas jujur."
ikhtiar:
{ teks: "**Pemeriksaan Kepatuhan Konstitusi** memeriksa administrasi dan keuangan secara rutin.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "Laporan yang terbuka membuat pembagian tenaga dan dana bisa dibahas bersama.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 11".
kuis: { pertanyaan: "Bagaimana laporan keuangan komisariatmu disampaikan?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label wadah “PERKADERAN”, “KARYA”, dan “URUSAN LAIN” adalah label bawaan wadahKaca, ikut tampak bersama wadahnya.
“LAPORAN”: label3D("LAPORAN", { pada: map, geser: [0, 0.55, 0], gaya: "mikro" }), masuk 6.8 sampai 7.2, keluar 14.8 sampai 15.1.
Label baris panel laporan adalah label bawaan panelKertas, ikut tampak bersama panel.
F. Dunia dan Posisi
Dunia ini tidak memakai dunia dasar kit. Semua benda ditaruh langsung di tanah bergrid.
Komisariat: komisariat = v.tambah(rumah()) di titik(0, -2.6). Prompt lama menaruhnya di titik(0, -3.0); di sana atapnya keluar zona atas, jadi digeser 0.4 ke bawah layar.
Corong: titik(0, 0.3), di depan komisariat (bawah layar). Lubang keluar sekitar y 1.1, mulut atas sekitar y 1.95. Ambil titik dunianya dengan corong.localToWorld(corong.userData.mulut.clone()) dan .keluar sesudah updateMatrixWorld(true).
Wadah: wadahKader di titik(-2.6, 1.8), wadahKarya di titik(0, 2.6), wadahLain di titik(2.6, 1.8). Mulut wadah di y 1.0, lebih rendah dari lubang keluar corong.
Talang ke-k: titik [keluar corong, titik tengah antara keluar corong dan mulut wadah ke-k pada y 1.05, mulut wadah ke-k + y 0.05]. Grup talang di titik asal dunia.
Aliran masuk: jalur [komisariat + titik(0, 1.25, 0.6) (tepat di luar sudut depan komisariat), titik(0, -0.5, 2.2), mulut corong]. Aliran keluar ke-k: talang.userData.jalurAliran(12) milik talang ke-k.
Map laporan: titik(-2.4, -1.6), berbaring, di kiri komisariat. Gembok di pusat map, y 0.07.
Panel laporan: di titik yang sama dengan map, berdiri menghadap kamera.
Pengecualian zona: wadahKader, wadahKarya, wadahLain, dan talang boleh terpotong 6.0 sampai 13.0 (userData.penting = (t) => t < 6.0 || t >= 13.0).
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
0.6 sampai 2.0: komisariat, corong, ketiga talang, dan ketiga wadah muncul (muncul([komisariat, corong, ...talang, wadahKader, wadahKarya, wadahLain], { t: 0.6, selesai: 2.0 })). Komisariat abu penuh sejak awal. Wadah PERKADERAN dan KARYA abu penuh.
2.0 sampai 5.6: tenaga mengalir dari komisariat ke corong (aliran, jalur masuk, mulai: 2.0, selesai: 5.6, laju: 4, jarak: 0.9, beku: false).
2.9 sampai 5.4: dari corong, aliran terbagi timpang. Talang URUSAN LAIN rapat (jarak: 0.9), talang PERKADERAN dan KARYA jarang (jarak: 6.0). Ketiganya laju: 4, mulai: 2.9, selesai: 5.4, beku: false, sehingga kira-kira delapan dari sepuluh bola masuk ke URUSAN LAIN. Bola pertama baru masuk corong sekitar 2.7, jadi aliran keluar tidak boleh berangkat lebih awal.
3.5 sampai 6.2: isi wadah berubah di v.setiapFrame: URUSAN LAIN aturIsi 0.1 ke 0.85, PERKADERAN 0.1 ke 0.25, KARYA 0.1 ke 0.2 (halus(rentang(t, 3.5, 6.2))).
Bola terakhir tiba sebelum 7.6. Tidak ada aliran yang membeku di layar.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.1: map laporan tertutup muncul di kiri komisariat (muncul, naik 0.2), abu penuh. Label “LAPORAN” masuk 6.8.
7.3 sampai 7.7: gembok abu muncul di atas map (muncul, naik 0.3).
7.8 sampai 12.6: denyutCermin(map, { mulai: 7.8, selesai: 12.6 }). Ini satu-satunya titik masalah: laporan yang tertutup.
6.6 sampai 13.0: wadah PERKADERAN dan KARYA tetap abu dan hampir kosong, wadah URUSAN LAIN tetap tinggi. Tidak ada aliran baru.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.4 sampai 13.8: gembok terbuka. Di v.setiapFrame, busur gembok naik 0.12 dan berputar y 1.2 radian dengan k = halus(rentang(t, 13.4, 13.8)).
13.9 sampai 14.3: gembok hilang. Abu map dilepas dari 1 ke 0 pada 13.9 sampai 14.3.
14.2 sampai 14.8: sampul map terbuka (sampulDepan.rotation.y = −π x halus(rentang(t, 14.2, 14.8))).
14.8 sampai 15.2: map berubah menjadi panel laporan berdiri (gantiBenda(map, panelLaporan, { tempat: true })). Label “LAPORAN” keluar 14.8.
15.2 sampai 16.1: ketiga batang panel tumbuh dari kiri (tumbuh(panelLaporan.userData.bagian.batang, { t: 15.2, sumbu: "x" })). Batang URUSAN LAIN paling panjang. Tidak ada angka.
16.1 sampai 17.6: adegan diam, kalimat ikhtiar pertama terbaca.
18.2 sampai 20.4: tenaga mengalir lagi dari komisariat ke corong (aliran, jalur masuk, laju: 4, jarak: 1.2).
19.1 sampai 20.6: dari corong, aliran terbagi rata ke ketiga talang (aliran, laju: 4, jarak: 1.8 untuk ketiganya, mulai: 19.1, selesai: 20.6).
19.8 sampai 21.6: abu wadah PERKADERAN dan KARYA dilepas dari 1 ke 0 (halus(rentang(t, 19.8, 20.6))), isi PERKADERAN naik 0.25 ke 0.7 dan KARYA 0.2 ke 0.65 (halus(rentang(t, 19.8, 21.6))). Isi URUSAN LAIN tetap 0.85.
21.0: klikEmas(panelLaporan). Bingkai, batang, dan garis panel menjadi emas.
21.4 sampai 22.2: abu komisariat dilepas dari 1 ke 0.
Bola aliran terakhir tiba sebelum 22.6. Tidak ada figur.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi aliran. Tambahkan lewat catat (beri sumber unik):
7.3: cap pelan (kuat 0.4, posisi map) saat gembok terpasang;
13.4: pintu (kuat 0.5, durasi 0.4, posisi map) saat gembok terbuka;
14.2: kertas (posisi map) saat sampul map terbuka.
Bunyi aliran Bagian 1 dan Bagian 3 dibisukan sebagian supaya tidak riuh: bunyi: { kuat: 0.35 } pada setiap aliran.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada simbol partai, gambar kotak suara, nama lembaga politik, atau atribut kampanye. Arah aliran yang menyerap tenaga digambar netral sebagai wadah URUSAN LAIN.
Tidak boleh ada angka, nominal, atau persentase di panel dan wadah.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-29 --periksa, lalu lihat hasil/gambar/indikator-29/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3.4: aliran dari komisariat ke corong, bola rapat menuju URUSAN LAIN, bola jarang ke dua wadah lain;
5.5: wadah URUSAN LAIN hampir penuh, PERKADERAN dan KARYA abu hampir kosong;
9.5: kamera dekat, map tertutup bergembok abu berdenyut di samping komisariat, kalimat sebab terbaca;
14.5: gembok sudah hilang, sampul map sedang terbuka, kalimat ikhtiar pertama terbaca;
20.3: aliran terbagi rata ke ketiga talang, wadah PERKADERAN dan KARYA mulai lepas abu;
22.1: panel laporan emas, isi ketiga wadah lebih seimbang, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-29. Hasilnya hasil/video/indikator-29.mp4.
Di sesi cloud, render berjalan tanpa GPU (10–20 menit): jalankan di latar, lalu kirim berkas itu ke pengguna dengan SendUserFile, display attach.
Laporkan singkat: satu baris per penyimpangan (kunci kamera yang dinaikkan, pengecualian zona, benda lokal, ukuran corong yang disesuaikan), lalu hasil zona, warna, LUFS, dan sinkron.
