Prompt Animasi Indikator 08 dari 44
Judul indikator: Manajemen organisasi lemah dan tertinggal dari kebutuhan kontemporer.
Kelompok Tata Kelola. Mode Ikhtiar. Program terkait 10 Arsip dan Memori Organisasi dan 11 Pemeriksaan Kepatuhan Konstitusi.
Prompt ini lengkap dan berdiri sendiri. Kerjakan semua bagian A sampai K.
A. Tugas dan Aturan Teknis
Buat satu video animasi berdurasi 31 detik, 1080 x 1920 piksel, untuk Instagram Reels, di folder animasi/proyek/indikator-08-v2/. Folder lama animasi/proyek/indikator-08/ jangan diubah, tetapi wajib dibaca sebagai acuan Bagian 1.
Baca animasi/README.md, lalu animasi/kit/PANDUAN-EVIDENCE.md. Kit harus versi 1.3.1 atau lebih baru.
Dari folder animasi/, jalankan npm run baru -- indikator-08-v2 --format evidence --judul "Manajemen organisasi lemah dan tertinggal dari kebutuhan kontemporer.". Edit hanya adegan.js. Impor hanya dari ../../kit/index.js. Benda yang belum ada di kit dibuat di animasi/proyek/indikator-08-v2/benda-lokal.js, lalu dilaporkan. Jangan mengubah kit.
Ikuti kerangka adegan.js di panduan: format, dunia, Bagian 1 sampai 3, lalu akhiriEvidence paling akhir. Jangan menulis segmenKuis, jadwalEvidence, atau kamera: di buatVideo.
Semua gerak dihitung dari waktu t. Pakai gerak standar kit dan acak(benih). Dilarang memakai Math.random() tanpa benih, jam internal, transisi CSS, atau animasi CSS.
Angka desimal memakai titik. Waktu dalam detik. Posisi ditulis dengan titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar, y ke atas. Sumbu dunia +x sama dengan titik(0.707, 0.707), yaitu diagonal layar dari kiri atas ke kanan bawah.
Jalankan semua perintah dari PowerShell atau terminal biasa, bukan sandbox.
B. Format, Zona, dan Warna
Pakai formatEvidence dengan isi teks di bagian E. Format sudah mengatur kepala, keterangan bawah, kartu pertanyaan, pil, kartu akhir, kabut, dan zona adegan y 600 sampai 1440.
Warna hanya lewat token tema W. Tidak ada warna baru.
Aturan warna video ini:
Bagian 1: papan kusam (abu, permukaan W.abuGelap) dan berdebu mulai 4.0. Kertas tugas yang tetap melayang menjadi abu mulai 4.0. Komisariat abu penuh.
Bagian 2: balon kabur dan kertas yang terbang berwarna bawaan atau abu. Satu titik masalah boleh berdenyut zamrud: ketiga balon kabur (denyutCermin). Tidak ada emas.
Bagian 3: folder bersama, centang, dan pengamat berwarna zamrud atau bawaan (proses). Kertas tugas pulih dari abu saat berangkat ke folder. Emas hanya untuk satu rantai hasil: laci folder bersama sesudah diperiksa. Komisariat melepas abu sesudahnya.
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
fokus: titik(-0.4, -0.7, 0.8) (fokus video lama);
gejala: { muat: [d.benda.papan, d.benda.meja, ...pengurus, komisariat] } (H dihitung otomatis);
sebab: { muat: [pengurus2, pengurus3, pengurus4, d.benda.meja, atasBalon2, atasBalon4], H: 9 };
ikhtiar: { muat: [folder, d.benda.meja, ponsel1, ponsel5], H: 11 };
tambahan: [{ t: [17.5, 18.5], muat: [folder, titikPengamat, d.benda.meja, komisariat], H: 11 }].
Isi muat dengan benda dan juga titik tujuan gerak (Vector3) karena benda dibaca di posisi dasarnya. atasBalon2 dan atasBalon4 adalah puncak balon pengurus 2 dan 4 (titik balon + y 0.45).
D. Benda yang Dipakai
Dari kit:
duniaRencana(v, { rapat: true, opsi: { papan: { kolom: ["TUGAS", "TENGGAT", "PJ"], baris: 4, debu: true, opsiLabel: { skala: () => 16 / v.rig.keadaan.H } } } }): dunia Rencana mode rapat, lima pengurus berdiri mengelilingi meja bundar di titik(0, 0.6), papan bersama berdebu. Sama dengan video lama.
ponselKecil() x 5: ponsel di meja, di depan tiap pengurus.
rumah(): komisariat, diskalakan 0.8 (scale.setScalar(0.8)).
balonKata({ isi: "kabur", skala: 0.5, benih: 1 | 2 | 3 }) x 3: isi kepala tiga pengurus.
kartuKecil({ simbol: "garis", rebah: false, miring: 0, skala: 0.45 }) x 3: kertas yang terbang dari meja di Bagian 2.
folderBersama(): folder bersama berlaci empat (NOTULENSI, KEPUTUSAN, LAPORAN, DOKUMENTASI dari atas), label di sisi kiri. aturLaci(i, k), titikLaci(i), bagian.laci[i].
centang({ ukuran: 0.3, hadapKamera: false, tengah: true, warna: W.zamrud }) x 3: tanda laci sudah diperiksa.
pionPengamat(): pemeriksa dengan papan catat kecil.
Benda lokal (salin persis dari animasi/proyek/indikator-08/benda-lokal.js ke animasi/proyek/indikator-08-v2/benda-lokal.js):
kertasTugas({ nama, skala: 0.75 }) x 12: kartuKecil({ rebah: false, miring: 0, hadap: 0, simbol: "garis" }) kit di dalam pembungkus Group berotasi "YXZ" dengan rotation.y 45 derajat (menghadap kamera). Kartu digeser y -0.4 di dalam pembungkus, jadi titik asal kertas di tengah kartu dan kertas bisa condong, berguling, dan berputar di tempat. Skala seragam 0.75.
nasibKertas(kertas, opsi): gerak lokal yang menghitung seluruh perjalanan satu kertas sebagai fungsi murni dari t lewat daftarkan (saluran posisi, tampak, dan efek): muncul dari ponsel (asal) naik ke tempat melayang (rumah) dalam 0.5 detik; melayang tidak beraturan berbenih (amplitudo 0.3) dengan jam waktuBeku sehingga berhenti di 6.6; jatuh opsional melewati tepi meja lalu tenggelam; kembali opsional dengan gerak muncul standar; lalu terbang (busur setinggi 0.7, masukKeluar3) ke titik ke sambil meluruskan diri dan mengecil ke skalaPapan. Mengembalikan { tTiba }.
E. Teks di Layar (isi sudah final, tinggal dipasang)
Isi formatEvidence persis seperti ini:
nomor: "08", kategori: "TATA KELOLA", judul: "Manajemen organisasi lemah dan tertinggal dari kebutuhan kontemporer.", mode: "ikhtiar".
gejala: "" (label GEJALA saja).
sebab: "Tugas, keputusan, dan uang **tersimpan di kepala** masing-masing pengurus, jadi tidak bisa diperiksa bersama."
ikhtiar:
{ teks: "**Arsip dan Memori Organisasi** menaruh tugas, keputusan, dan laporan di satu tempat yang bisa diperiksa.", masuk: [13.6, 14.1], keluar: [17.2, 17.6] }
{ teks: "**Pemeriksaan Kepatuhan Konstitusi** memeriksanya secara rutin, bukan hanya saat ada masalah.", masuk: [18.0, 18.5], keluar: [22.6, 23.0] }
program: "Program 10 · Program 11".
kuis: { pertanyaan: "Apakah pembagian tugas dan kewenangan setiap pengurus di komisariatmu tertulis jelas?", kalimat: "Jawabanmu langsung memberi satu langkah untuk komisariatmu." }
ajakan, baca, dan sumber memakai bawaan format.
Label 3D tambahan:
Label kolom papan TUGAS, TENGGAT, PJ milik papan, ikut hilang bersama papan.
Label laci NOTULENSI, KEPUTUSAN, LAPORAN, DOKUMENTASI milik folderBersama, ikut muncul bersama folder.
F. Dunia dan Posisi
Dunia dasar duniaRencana mode rapat. Benda: papan di titik(-1.6, -2.6) (kaki 0.4, menghadap kamera), meja bundar di titik(0, 0.6), pengurus1..5 berdiri pada radius 1.75 dari pusat meja. Pengurus 1 paling dekat ke penonton, lalu searah jarum jam di layar: kiri depan, kiri belakang, kanan belakang, kanan depan.
Titik dunia yang dipakai: d.titik.pengurus[i], d.titik.meja.
Benda tambahan dan posisinya (Bagian 1 sama dengan video lama):
Sudut pengurus ke-i: π/2 + i * 2π/5; arah radial(a) = titik(cos a, sin a).
Ponsel ke-i: pusat meja + radial(sudut_i) x 0.95, y meja.userData.tinggiAtas.
Kertas tugas: 12 buah dari 5 ponsel (3, 3, 2, 2, 2). Urutan muncul per putaran: kertas pertama tiap ponsel, lalu kedua, lalu ketiga. asal = ponsel + y (tinggiAtas + 0.55). rumah = ponsel dengan y 1.6 + 0.5k, digeser KANAN dan BAWAH masing-masing (r() - 0.5) x 0.5 dengan r = acak(808) dipanggil berurutan. Benih gerak 100 + nomor kertas.
Empat kertas jatuh (indeks ponsel 0 sampai 4, putaran, sudut celah, detik, putar): (0, 0, 126 derajat, 4.0, 1.3), (4, 0, 54 derajat, 4.4, -1.1), (1, 0, 198 derajat, 4.8, 1.5), (3, 0, 342 derajat, 5.2, -1.4). Durasi jatuh 0.8. Titik lewat = pusat meja + radial(celah) x 1.62.
Komisariat: titik(-2.9, 2.7), rotasi 0, skala 0.8, di kiri bawah meja, tidak menyentuh pengurus kiri depan dan lintasan kertas yang jatuh.
Balon kabur 1, 2, 3: titik ekor di d.titik.pengurus[1], d.titik.pengurus[2], dan d.titik.pengurus[3] + y 1.15 (di atas kepala pengurus 2, 3, 4).
Kertas terbang Bagian 2: mulai di ponsel pengurus 2, 3, 4 + y 0.05, berakhir di pusat meja + radial(sudut_i) x 2.6 + y 1.8.
Folder bersama: titik(2.4, -1.9), rotasi 0, di kanan belakang meja (bekas tempat kosong di kanan papan).
Laci tujuan: kertas dari ponsel 1 dan 4 ke laci 0 (NOTULENSI), ponsel 2 dan 5 ke laci 1 (KEPUTUSAN), ponsel 3 ke laci 2 (LAPORAN). Titik tujuan laci i dihitung sekali sebelum frame pertama dengan laci terbuka penuh: folder.userData.aturLaci(i, 1), folder.updateMatrixWorld(true), ke = folder.localToWorld(folder.userData.titikLaci(i)), lalu aturLaci(i, 0) lagi.
Centang laci i: pusat muka laci i (new Box3().setFromObject(folder.userData.bagian.laci[i])), x di sisi kanan muka (maks x - 0.25), z di muka + 0.06, supaya tidak menutupi gagang.
Pengamat (titikPengamat): folder + titik(-1.2, 0.5), rotasi y menghadap folder (Math.atan2(dx, dz) dari pengamat ke folder).
Pengecualian zona (laporkan): selama 6.0 sampai 13.0 kamera dekat ke kepala pengurus, jadi papan, pengurus 1 dan 5, ponsel, dan kertas tugas userData.penting = (t) => !(t > 6.0 && t < 13.0). Komisariat (t) => t < 6.0 || t >= 17.5.
G. Adegan per Bagian
Bagian 1, Gejala (0.6 sampai 6.0)
Acuan: animasi/proyek/indikator-08/adegan.js, bagian Gejala. Dunia, benda, posisi, dan waktunya sama persis. Satu-satunya tambahan adalah komisariat.
0.6 sampai 1.6: papan, meja, pengurus, ponsel, dan komisariat muncul berurutan (muncul([...d.urutan, ...ponsel, komisariat], { t: 0.6, selesai: 1.6 })). Komisariat abu penuh sejak awal.
1.6 sampai 4.0: dua belas kertas tugas muncul dari layar ponsel dan melayang (nasibKertas, tMuncul = 1.6 + idx * jeda, jeda = (4.0 - 0.5 - 1.6) / 11, dMuncul: 0.5). Kertas terakhir selesai muncul tepat 4.0. Setiap kertas: catat({ t: tMuncul, jenis: "kertas", kuat: 0.4 }).
4.0 sampai 6.0: empat kertas jatuh melewati tepi meja di celah antarpengurus dan hilang di bawah tanah (data jatuh di bagian F). Setiap kertas yang jatuh: catat({ t: tJatuh + 0.05, jenis: "hilang", kuat: 0.5 }). Kertas terakhir hilang tepat 6.0.
4.0 sampai 5.2: papan menjadi kusam dan berdebu (setelKeadaan(papan, "abu", k) dan papan.userData.aturDebu(k) dengan k = halus(rentang(t, 4.0, 5.2))). Permukaan papan memakai warnaAbu = W.abuGelap, bintik debu dimajukan papan.userData.bagian.debu.position.z += 0.03. 4.0: catat({ jenis: "padam", kuat: 0.4, posisi: papan }).
4.0 sampai 5.0: kertas yang tetap melayang menjadi abu (setelKeadaan(kertas, "abu", halus(rentang(t, 4.0, 5.0)))).
Gerak melayang kertas melambat 6.0 dan berhenti 6.6 (jam waktuBeku(...v.beku)). Kertas tetap di udara.
Bagian 2, Kenapa Fenomena Tersebut Masih Terjadi? (6.0 sampai 13.0)
6.6 sampai 7.4: tiga balon kabur muncul di atas kepala pengurus 2, 3, 4 (6.6, 6.8, 7.0; durasi 0.4, naik: 0). Isinya kabur, tidak terbaca.
8.2, 9.2, dan 10.2: satu kertas abu muncul di depan ponsel pengurus 2, 3, lalu 4 (durasi 0.2, naik: 0), terbang menjauh dari meja (busur, durasi 0.9, tinggi 0.6, putar: 1.2), lalu hilang saat tiba (durasi 0.3).
8.4 sampai 12.8: ketiga balon kabur berdenyut zamrud (denyutCermin(balon, { mulai: 8.4, selesai: 12.8 })).
Kertas tugas yang beku tetap berserakan di udara, abu. Papan tetap kusam.
Bagian 3, Ikhtiar HMI Evidence (13.0 sampai 23.0)
13.0 sampai 13.4: balon kabur dan papan hilang (label kolom papan ikut).
13.4 sampai 13.9: folder bersama muncul di kanan belakang meja.
13.75 sampai 15.4: empat kertas yang jatuh di Bagian 1 muncul kembali di atas tempat melayangnya, masing-masing 0.55 detik sebelum berangkat (kembali pada nasibKertas), yaitu 13.75, 13.87, 14.75, dan 14.87.
13.9 sampai 17.6: tiga aliran kertas masuk ke tiga laci. Kertas tiap laci diurutkan menurut nomor kertas (n). Laci 0 terbuka 13.9 sampai 14.3; kertasnya berangkat 14.3 + 0.12n (n = 0 sampai 4); laci tertutup 15.6 sampai 16.0. Laci 1 terbuka 14.9 sampai 15.3; kertas berangkat 15.3 + 0.12n; tertutup 16.6 sampai 17.0. Laci 2 terbuka 15.9 sampai 16.3; kertas berangkat 16.3 + 0.12n (n = 0, 1); tertutup 17.2 sampai 17.6. Laci lewat folder.userData.aturLaci(i, halus(rentang(t, buka, buka + 0.4)) - halus(rentang(t, tutup, tutup + 0.4))) di setiapFrame.
Setiap kertas terbang ke laci tujuannya (terbang: { t, durasi: 0.7 }, ke laci, skalaApung: 0.75, skalaPapan: 0.4, pusatPapan: folder.position, skalaPapanFn: () => 1), pulih dari abu dalam 0.35 detik sejak berangkat, lalu hilang saat tiba (t: tTiba, durasi 0.15, turun: 0.1, tanpa bunyi bawaan).
18.2 sampai 18.7: pengamat muncul di depan kiri folder.
18.8, 19.4, dan 20.0: centang zamrud muncul di muka laci 0, 1, lalu 2 (durasi 0.28, naik: 0, skala: 0.4, tanpa bunyi bawaan).
20.8: laci folder klikEmas (klikEmas(folder, { t: 20.8 }), bagian emas bawaan folder adalah laci). Ini satu-satunya rantai emas.
21.4 sampai 22.2: komisariat melepas abu dari 1 ke 0.
Jangan menambah figur lain. Pengamat adalah satu-satunya figur baru.
Bagian 4 dan 5, Kuis dan Kartu akhir (23.0 sampai 31.0)
Paling akhir di adegan.js, panggil akhiriEvidence(v, { komisariat, kamera: { ...bagian C } }). Lengkung yang berdenyut otomatis dari kategori (TATA KELOLA).
Semua gerak Bagian 1 sampai 3 selesai sebelum 23.0. Sesudah akhiriEvidence tidak ada benda, label, atau setiapFrame baru.
H. Bunyi
Gerak standar kit sudah mencatat bunyi. Tambahkan lewat catat (beri sumber unik):
pada setiap laci terbuka (13.9, 14.9, 15.9): laci-buka (durasi 0.4, kuat 0.5, posisi folder, nada nomor laci);
kertas pertama tiap aliran (14.3, 15.3, 16.3): whoosh (durasi 0.7, kuat 0.3, dari kertas ke laci);
18.8, 19.4, dan 20.0: centang (kuat 0.55, nada 0, 1, 2, posisi centang);
21.4: menyala (kuat 0.5, posisi komisariat) saat komisariat melepas abu.
Pengurus dan pengamat tidak berjalan, jadi tidak perlu peredaman langkah.
I. Keadaan Akhir
Pada 28.0 sampai 31.0, terowongan audit, komisariat, dan laporan emas tetap tampak di belakang kartu akhir. Benda Bagian 1 sampai 3 sudah tidak tampak.
J. Larangan
Tidak boleh ada logo resmi HMI, bendera HMI, atau wajah manusia.
Tidak boleh ada teks Arab, nama tokoh nyata, atau nama cabang dan komisariat nyata.
Tidak boleh ada angka di kertas, papan, laci, atau ponsel. Tidak ada simbol uang atau nominal.
Tidak boleh ada teks yang terbaca di balon. Isi balon hanya kabur.
Tidak boleh ada warna merah, oranye, atau biru.
Tidak boleh ada teks 3D. Semua teks lewat HTML.
K. Pemeriksaan Hasil
Jalankan npm run buat -- indikator-08-v2 --periksa, lalu lihat hasil/gambar/indikator-08-v2/lembar.png. Periksa hanya Bagian 1 sampai 3; Bagian 4 dan 5 otomatis.
Periksa titik berikut (pakai --titik bila titik bawaan tidak pas):
3: kertas tugas muncul dan melayang di atas ponsel, papan dengan kolom TUGAS, TENGGAT, PJ masih bersih;
5.5: papan kusam berdebu, kertas melayang abu, satu kertas sedang jatuh melewati tepi meja, komisariat abu;
9.5: kamera dekat ke kepala pengurus, tiga balon kabur berdenyut zamrud, satu kertas sedang terbang menjauh, kalimat sebab terbaca;
14.5: folder tampak, laci NOTULENSI terbuka, kertas pertama sedang masuk, kalimat ikhtiar pertama terbaca;
19.7: pengamat berdiri di depan folder, centang laci 0 dan laci 1 tampak;
21.1: laci folder emas, ketiga centang tampak, kalimat ikhtiar kedua dan baris program terbaca.
Ulangi sampai laporan menulis Zona: 0 pelanggaran, warna bersih, dan tidak ada peringatan kit.
Setelah semuanya benar, jalankan npm run buat -- indikator-08-v2. Hasilnya hasil/video/indikator-08-v2.mp4.
Laporkan setiap penyimpangan dari prompt ini beserta alasannya (kunci kamera yang dinaikkan, pengecualian zona, benda lokal yang disalin, perubahan nasibKertas bila diperlukan untuk tujuan laci).
