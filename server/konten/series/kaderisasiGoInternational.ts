import type { CeritaSeri } from "@shared/cerita";
import { referensi } from "../opiniIndonesiaEmas";

/**
 * Series 1, diadaptasi dari opini "Kontribusi HMI Menyongsong Indonesia Emas 2045: HMI, Indonesia dan Dunia"
 * (server/konten/opiniIndonesiaEmas.ts). Fakta, angka, dan semua `kutipan` di sini harus sama dengan
 * opini itu, karena pembaca bisa membuka tulisannya lewat tautan di judul seri.
 */
export function ceritaKaderisasiGoInternational(): CeritaSeri {
  return {
    slug: "kaderisasi-go-international",
    pembuka: {
      label: "Series 01",
      judul: "Kontribusi HMI Menyongsong Indonesia Emas 2045: HMI, Indonesia, dan Dunia",
      pengantar:
        "Kamu akan menyusuri satu cerita panjang, dari sebuah ruang kuliah di Yogyakarta tahun 1947 sampai seratus tahun HMI pada 2047. Pelan-pelan kamu akan paham kenapa rukun di dalam rumah menjadi syarat untuk melangkah jauh ke dunia, dan apa yang bisa kita kerjakan agar Indonesia tampil lebih depan dan bercahaya di panggung dunia. Ikuti sebuah perahu kecil yang harus mendayung di antara dua karang.",
    },
    bab: [
      {
        id: "bab-1",
        adegan: "dunia-1947",
        label: "Bagian 1 · Yogyakarta, 1947",
        judul: "Dua peristiwa di Yogyakarta",
        inti: "Awal Februari 1947, di sebuah ruang kuliah di Yogyakarta, Lafran Pane dan kawan-kawannya mendirikan HMI. Republik waktu itu baru berumur satu setengah tahun dan pasukan Belanda masih ada di banyak kota. Sekitar satu setengah tahun kemudian, di kota yang sama, Mohammad Hatta menjawab satu pertanyaan besar: Indonesia mau berdiri di belakang Amerika atau di belakang Uni Soviet?",
        poin: [
          "HMI berdiri di ruang kuliah Sekolah Tinggi Islam, saat republik masih kecil dan dikepung.",
          "Tujuan yang mereka tulis terdengar besar: mempertahankan Negara Republik Indonesia dan mempertinggi derajat rakyat, serta menegakkan dan mengembangkan ajaran Islam.",
          "Jawaban Hatta dikenal sebagai “mendayung di antara dua karang”. Dua karang itu adalah dua kekuatan besar dunia saat itu.",
          "Indonesia harus menjadi subjek yang menentukan sikapnya sendiri, bukan objek dalam pertarungan pihak lain.",
        ],
        lanjut: {
          judul: "Kenapa dua peristiwa ini dihubungkan?",
          isi: "Dua peristiwa ini sering diceritakan terpisah, padahal lahir dari keadaan yang sama. Republik saat itu kecil, dikepung, belum diakui banyak negara, dan di dalam tubuhnya sendiri sedang terbelah.\n\nJawaban yang diberikan pun mirip. Pihak yang lemah tidak bisa bertahan dengan menumpang arus orang lain. Ia juga tidak akan bertahan kalau sibuk bertengkar dengan dirinya sendiri.",
        },
        dalam: {
          judul: "Dari mana cerita ini berangkat?",
          isi: "Dari dua peristiwa itu, tulisan ini menarik satu benang merah: kalau ingin mandiri di hadapan dunia, harganya adalah rukun di dalam rumah sendiri.\n\nSeluruh cerita di Series ini bergerak dari kalimat itu.",
          kutipan:
            "Dari sanalah premis tulisan ini berangkat, kemandirian di hadapan dunia selalu dibayar dengan kerukunan di dalam rumah.",
        },
      },
      {
        id: "bab-2",
        adegan: "dunia-perahu",
        label: "Bagian 2 · Bebas aktif, 1948 sampai 1961",
        judul: "Bebas aktif berakar di dalam negeri",
        inti: "Pilihan bebas aktif sering dibaca sebagai sikap diplomasi saja. Padahal akarnya ada di dalam negeri. Hanya dua pekan setelah pidato Hatta, meletus peristiwa Madiun.",
        poin: [
          "Bebas aktif artinya tidak memihak satu blok, tetapi juga tidak diam: ikut bekerja untuk ketertiban dunia.",
          "Peristiwa Madiun 1948 adalah perpecahan kiri dan kanan di dalam negeri.",
          "Bagian “aktif” terbukti nyata: Konferensi Asia Afrika di Bandung tahun 1955, lalu Gerakan Non-Blok enam tahun kemudian.",
          "Syaratnya jarang diucapkan: perahu yang kokoh dan pendayung yang seirama.",
        ],
        lanjut: {
          judul: "Kenapa akarnya di dalam negeri?",
          isi: "Perpecahan kiri dan kanan di dalam negeri saat itu adalah cermin kecil dari Perang Dingin, yaitu persaingan dua kekuatan besar dunia yang membuat banyak negara terpaksa memilih pihak.\n\nSeandainya republik memilih satu blok, perpecahan di dalam hampir pasti berubah menjadi perang yang dikendalikan dari luar. Jadi bebas aktif bukan hanya cara menghadapi dunia. Ia juga cara menjaga agar bangsa yang baru lahir tidak tercabik oleh dunia.",
        },
        dalam: {
          judul: "Apa maksud kata “aktif”?",
          isi: "Kata “aktif” bukan hiasan. Pembukaan Undang-Undang Dasar sudah lebih dulu menyebut tugas ikut melaksanakan ketertiban dunia.\n\nTugas itu dijalankan secara nyata ketika Bandung menjadi tuan rumah Konferensi Asia Afrika pada 1955. Indonesia juga ikut membidani, atau ikut melahirkan, Gerakan Non-Blok, kelompok negara yang tidak mau masuk ke blok mana pun. Tetapi ada satu syarat untuk semua itu.",
          kutipan:
            "Mendayung di antara dua karang hanya mungkin dilakukan oleh perahu yang kokoh dan pendayung yang bergerak seirama. Perahu yang awaknya saling berebut dayung tidak perlu menunggu karang untuk karam.",
        },
      },
      {
        id: "bab-3",
        adegan: "dunia-karang-baru",
        label: "Bagian 3 · Dunia hari ini",
        judul: "Karang hari ini tidak lagi dua",
        inti: "Karang hari ini tidak lagi dua, dan sebagian di antaranya sudah membentur. Pada 28 Februari 2026, Amerika Serikat dan Israel menyerang Iran, dan dalam hitungan hari Selat Hormuz praktis tertutup. Namun perlombaan yang paling menentukan barangkali justru yang paling sunyi: perlombaan teknologi.",
        poin: [
          "Sebelum perang, sekitar seperlima perdagangan minyak dunia lewat laut melewati Selat Hormuz. Harga minyak Brent, patokan harga minyak dunia, menembus 100 dolar per barel pada 8 Maret.",
          "Di Eropa, perang Rusia dan Ukraina belum juga berakhir. Persaingan Amerika dengan Tiongkok merambat ke hampir semua bidang, dari tarif dagang sampai bahan baku teknologi.",
          "Cip semikonduktor, komponen kecil di dalam komputer dan ponsel, kini diperlakukan seperti senjata.",
          "Pelajaran yang cukup terang: yang maju dalam teknologi akan menang, dan yang tertinggal akan diatur.",
        ],
        lanjut: {
          judul: "Apa artinya “akan diatur”?",
          isi: "Negara yang menguasai teknologi menulis aturan mainnya. Negara lain menjadi pasar, pemasok bahan mentah, dan sumber data.\n\nContohnya cip semikonduktor, yang diatur lewat pembatasan ekspor: negara tertentu bisa menentukan siapa yang boleh membelinya. Contoh lain, Tiongkok membatasi ekspor sejumlah logam tanah jarang sejak April 2025 sebagai balasan atas tarif Amerika. Logam itu adalah bahan yang dibutuhkan industri cip dan pesawat.",
        },
        dalam: {
          judul: "Siapa memegang ukuran baru itu?",
          isi: "Dulu karang berarti dua blok yang saling berhadapan. Sekarang sebagian karang tidak tampak seperti perang. Ia datang sebagai pembatasan ekspor cip, atau sebagai perebutan data dan energi, tetapi akibatnya bisa sangat besar bagi bangsa yang tertinggal.",
          kutipan:
            "Kecerdasan buatan, data, dan energi menjadi ukuran baru kekuatan sebuah bangsa. Negara yang menguasai teknologi menulis aturan mainnya, sementara negara lain menjadi pasar, pemasok bahan mentah, dan sumber data.",
        },
      },
      {
        id: "bab-4",
        adegan: "dunia-teknologi",
        label: "Bagian 4 · Teknologi dan kapasitas",
        judul: "Teknologi tidak menang sendirian",
        inti: "Kesimpulan tadi perlu dibaca dengan hati-hati: teknologi tidak pernah menang sendirian. Uni Soviet, negara yang pertama kali mengirim manusia ke luar angkasa pada 1961, bubar pada akhir 1991 tanpa pernah kalah dalam perang terbuka.",
        poin: [
          "Yang meruntuhkan Uni Soviet bukan kekurangan teknologi, melainkan ekonomi yang macet dan republik-republik anggotanya yang satu per satu memilih jalan sendiri.",
          "Memiliki teknologi saja belum cukup untuk kuat.",
          "Yang menang adalah yang mampu menyerap, mengorganisasi, dan memakai teknologi bersama-sama dalam waktu yang lama.",
        ],
        lanjut: {
          judul: "Kenapa Uni Soviet dijadikan contoh?",
          isi: "Uni Soviet sangat maju dalam teknologi. Ia bahkan lebih dulu mengirim manusia ke luar angkasa. Tetapi ekonominya macet, dan republik-republik anggotanya satu per satu memilih jalan sendiri.\n\nNegara itu bubar tanpa pernah kalah dalam perang terbuka. Jadi teknologi hanya satu bagian dari kekuatan. Bagian lainnya adalah ekonomi yang berjalan dan anggota yang tetap mau bersama.",
        },
        dalam: {
          judul: "Kenapa harus bersama-sama?",
          isi: "Bayangkan sebuah tim yang punya mesin terbaik, tetapi anggotanya saling tarik ke arah yang berbeda. Mesinnya ada, geraknya tidak. Teknologi hanyalah alat, dan alat itu baru bermakna kalau orang-orang yang memakainya bergerak bersama.\n\nKarena itu ukurannya bukan siapa yang punya teknologi, melainkan siapa yang bisa memakainya bersama-sama.",
          kutipan:
            "Yang menang bukan sekadar yang memiliki teknologi, melainkan yang mampu menyerap, mengorganisasi, dan memakainya bersama-sama dalam waktu yang lama.",
        },
      },
      {
        id: "bab-5",
        adegan: "dunia-karang-baru",
        label: "Bagian 5 · Indonesia hari ini",
        judul: "Indonesia di tengah karang baru",
        inti: "Indonesia sedang belajar mendayung di tengah karang-karang baru itu. Langkah-langkahnya dibaca berbeda-beda, tetapi satu hal sulit dibantah: getaran dari karang yang jauh kini langsung terasa di dapur rumah tangga.",
        poin: [
          "6 Januari 2025: Indonesia resmi menjadi anggota penuh BRICS.",
          "19 Februari 2026 di Washington: Presiden Prabowo Subianto menyatakan kesiapan mengirim hingga 8.000 personel untuk pasukan stabilisasi di Gaza, dalam pertemuan Board of Peace.",
          "Pada hari yang sama, Indonesia menandatangani perjanjian dagang dengan Amerika Serikat yang menetapkan tarif resiprokal 19 persen.",
          "Sebagian melihat langkah-langkah ini sebagai bebas aktif yang lincah, sebagian lain bertanya apakah ruang gerak kita masih lahir dari kekuatan sendiri.",
        ],
        lanjut: {
          judul: "Kenapa terasa sampai ke dapur?",
          isi: "APBN 2026 disusun dengan asumsi harga minyak Indonesia 70 dolar per barel. Bila harga itu naik ke 100 dolar, Menteri ESDM menyebut kebutuhan subsidi energi berpotensi bertambah hingga Rp230 triliun. Subsidi energi adalah uang negara yang dipakai supaya harga energi tetap terjangkau.\n\nPerang di Teluk, dengan kata lain, bukan lagi berita luar negeri.",
        },
        dalam: {
          judul: "Apa artinya bebas aktif hari ini?",
          isi: "Bagi Indonesia, bebas aktif hari ini berarti sesuatu yang lebih berat daripada tahun 1948. Karangnya lebih banyak, dan getarannya sampai ke rumah tangga.\n\nKarena itu kebebasan memilih tidak cukup hanya diucapkan. Ia perlu ditopang kapasitas sendiri.",
          kutipan:
            "Ruang manuver di antara kekuatan besar hanya tersedia bagi bangsa yang punya kapasitas sendiri, mulai dari energi, pangan, teknologi, sampai sumber daya manusia. Tanpa itu, kebebasan memilih hanya tersisa di atas kertas.",
        },
      },
      {
        id: "bab-6",
        adegan: "dunia-jejak-hmi",
        label: "Bagian 6 · Jejak HMI",
        judul: "HMI lahir di masa yang tidak tenang",
        inti: "Sekarang cerita kembali ke ruang kuliah di Yogyakarta itu. HMI lahir bukan di masa tenang, dan perjalanannya pun jauh dari tenang. Dari revolusi sampai tuntutan pembubaran, HMI bertahan lalu merumuskan Nilai Dasar Perjuangan.",
        poin: [
          "Masa revolusi: banyak anggota HMI ikut memanggul senjata dalam barisan mahasiswa melawan agresi militer Belanda.",
          "Pertengahan 1960-an: HMI menghadapi tuntutan pembubaran dan berhasil bertahan.",
          "Menjelang akhir 1960-an: di bawah Nurcholish Madjid, HMI merumuskan Nilai Dasar Perjuangan (NDP).",
          "NDP mempertemukan keislaman, kemodernan, dan keindonesiaan.",
        ],
        lanjut: {
          judul: "Apa itu NDP?",
          isi: "Nilai Dasar Perjuangan, disingkat NDP, adalah kerangka berpikir yang mempertemukan tiga hal: keislaman, kemodernan, dan keindonesiaan. Sampai sekarang NDP masih diajarkan di ruang-ruang Latihan Kader.\n\nLatihan Kader, atau LK, adalah pelatihan berjenjang bagi kader HMI.",
        },
        dalam: {
          judul: "Apa sumbangan terbesar HMI?",
          isi: "Di balik semua cerita bertahan itu, ada satu hal yang khas dari HMI. Hal itu dekat dengan semangat NDP tadi, yang mempertemukan keislaman, kemodernan, dan keindonesiaan, bukan memisahkannya.",
          kutipan:
            "Sumbangan terbesar HMI barangkali memang di situ, kebiasaan menghasilkan orang-orang yang mampu menjembatani iman dan negara tanpa harus memilih salah satunya.",
        },
      },
      {
        id: "bab-7",
        adegan: "dunia-dua-wajah",
        label: "Bagian 7 · Dua wajah HMI",
        judul: "Dua wajah yang perlu dilihat bersamaan",
        inti: "Sejarah yang jujur juga mencatat sisi yang lebih berat. Ketika kewajiban asas tunggal datang pada pertengahan 1980-an, HMI terbelah. Namun kebesaran HMI justru datang dari kemampuannya tetap menjadi rumah.",
        poin: [
          "Asas tunggal adalah kewajiban agar organisasi memakai satu asas yang sama. Sebagian HMI menerima, sebagian menolak dan kemudian dikenal sebagai HMI MPO.",
          "Keputusan tentang identitas itu memisahkan satu keluarga selama puluhan tahun, bahkan setelah HMI kembali ke asas Islam pada 1999.",
          "Alumni HMI tersebar di kementerian, parlemen, kampus, dunia usaha, dan pemerintahan daerah.",
          "Anggapan bahwa HMI adalah tangga menuju kekuasaan juga sering terdengar.",
        ],
        lanjut: {
          judul: "Apa saja dua wajah itu?",
          isi: "Wajah pertama adalah sumbangsih. Alumni HMI hadir di banyak bidang dan sumbangsih mereka nyata.\n\nWajah kedua adalah sisi yang lebih berat: perpecahan karena asas tunggal, dan anggapan bahwa HMI adalah tangga menuju kekuasaan. Perlu diingat bahwa tidak semua alumni berdiri di sisi yang sama dalam setiap perkara. Kedua wajah itu perlu dilihat bersamaan.",
        },
        dalam: {
          judul: "Apa yang membuat HMI besar?",
          isi: "Bukan bebasnya HMI dari konflik. Sejarah di atas menunjukkan HMI pernah dituntut bubar, pernah terbelah, dan sampai kini masih sering dianggap sebagai tangga menuju kekuasaan. Yang membuatnya bertahan adalah kemampuan untuk tetap menjadi tempat pulang bersama.",
          kutipan:
            "Kebesaran HMI tidak pernah datang dari bebasnya HMI dari konflik, melainkan dari kemampuannya untuk tetap menjadi rumah meski penghuninya berbeda pendapat.",
        },
      },
      {
        id: "bab-8",
        adegan: "dunia-modal",
        label: "Bagian 8 · Modal HMI hari ini",
        judul: "Modal besar yang habis di tempat salah",
        inti: "Bagaimana dengan HMI hari ini? Modalnya tidak kecil: ratusan cabang di hampir seluruh provinsi, dengan jaringan alumni yang menjangkau hampir setiap sektor. Tetapi modal sebesar itu sering habis di tempat yang salah.",
        poin: [
          "Energi organisasi tersedot ke perebutan posisi.",
          "Dualisme kepengurusan, yaitu ada dua pengurus di satu tempat, masih terjadi di sejumlah tempat.",
          "Kubu-kubu, yaitu kelompok yang bersaing di dalam organisasi, terbentuk di sekitar forum permusyawaratan lalu bertahan bertahun-tahun sesudahnya.",
          "Pekerjaan dasar berjalan lebih lambat: merawat kaderisasi, menertibkan tata kelola, dan mengejar ketertinggalan digital.",
        ],
        lanjut: {
          judul: "Apa maksudnya “habis di tempat yang salah”?",
          isi: "Bayangkan tenaga organisasi sebagai air dari satu sumber. Kalau sebagian besar mengalir ke perebutan posisi dan pertengkaran antarkubu, yang sampai ke kaderisasi tinggal sedikit.\n\nKubu-kubu itu terbentuk di sekitar forum permusyawaratan, lalu bertahan bertahun-tahun sesudahnya.",
        },
        dalam: {
          judul: "Pekerjaan dasar apa yang tertinggal?",
          isi: "Ada tiga pekerjaan paling mendasar yang disebut dalam tulisan ini: merawat kaderisasi, menertibkan tata kelola, dan mengejar ketertinggalan digital. Ketiganya tidak meriah, tetapi organisasi kader bertumpu padanya.\n\nKarena tenaga habis di tempat lain, ketiganya berjalan lebih lambat, sementara dunia di luar bergerak cepat.",
          kutipan:
            "Sementara itu, pekerjaan yang paling mendasar seperti merawat kaderisasi, menertibkan tata kelola, dan mengejar ketertinggalan digital berjalan lebih lambat daripada yang dibutuhkan.",
        },
      },
      {
        id: "bab-9",
        adegan: "dunia-2045",
        label: "Bagian 9 · Menuju 2045 dan 2047",
        judul: "Waktunya tidak panjang",
        inti: "Indonesia menargetkan diri menjadi negara maju pada 2045, tepat seratus tahun kemerdekaan. Dua tahun kemudian, pada 2047, HMI genap berusia seratus tahun. Jaraknya terasa jauh, padahal dekat.",
        poin: [
          "2045: Indonesia menargetkan menjadi negara maju, dengan bonus demografi (banyaknya penduduk usia produktif) sebagai salah satu tumpuan. Tumpuan itu sedang diuji.",
          "Ekonomi tumbuh 5,29 persen pada triwulan II 2026 (April sampai Juni), tetapi jumlah kelas menengah menyusut dari 47,9 juta orang pada 2024 menjadi 46,7 juta pada 2025.",
          "Pengangguran anak muda usia 15 sampai 24 tahun naik dari 16,26 persen pada November 2025 menjadi 17,37 persen pada Mei 2026. Artinya, lebih dari satu dari enam anak muda di angkatan kerja belum mendapatkan pekerjaan.",
          "2047: seratus tahun HMI. Kader yang hari ini mengikuti LK 1 di usia 19 tahun akan berusia sekitar 38 tahun pada 2045, usia ketika seseorang mulai memimpin.",
        ],
        lanjut: {
          judul: "Kenapa bonus demografi bisa jadi beban?",
          isi: "Bonus demografi hanya menjadi bonus kalau generasi mudanya siap dan terserap, artinya punya bekal dan mendapat tempat untuk bekerja atau berkarya. Kalau tidak, ia berubah menjadi beban.\n\nKarena itu yang perlu dilihat bukan hanya berapa banyak anak muda, tetapi berapa banyak yang siap dan terserap.",
        },
        dalam: {
          judul: "Bagaimana seratus tahun HMI akan dinilai?",
          isi: "Pengandaian tentang usia 19 dan 38 tahun itu sengaja dibuat sederhana, supaya dua puluh tahun terasa dekat. Usia 38 tahun adalah usia ketika seseorang mulai memimpin, entah sebuah laboratorium, perusahaan, lembaga negara, atau gerakan.\n\nKader yang sama itu pula yang hari ini sedang menghadapi pasar kerja yang sempit dan dunia yang bergejolak. Waktu kerja kader angkatan hari ini sudah berjalan sekarang, bukan nanti.",
          kutipan:
            "Seratus tahun HMI, dengan demikian, tidak akan dinilai dari peringatan yang meriah, melainkan dari apa yang dikerjakan kader angkatan hari ini selama dua dekade ke depan.",
        },
      },
      {
        id: "bab-10",
        adegan: "dunia-mendayung",
        label: "Bagian 10 · Pekerjaan yang tidak glamor",
        judul: "Mengurangi pertengkaran antarsaudara",
        inti: "Banyak orang sibuk meramal masa depan. Tetapi bagi organisasi kader, yang paling langka bukan kemampuan meramal, melainkan kemampuan bergerak bersama setelah ramalan dibuat. Karena itu, pekerjaan terpenting HMI hari ini barangkali justru yang paling tidak glamor: mengurangi pertarungan antarsaudara.",
        poin: [
          "Yang dikurangi adalah konflik kepentingan sesama, entah antarcabang, antarfaksi, maupun antargenerasi alumni.",
          "Persatuan tidak berarti keseragaman.",
          "Perbedaan pendapat, kritik, dan kontestasi (persaingan) adalah tanda organisasi yang hidup.",
          "Yang berbahaya adalah kontestasi yang tidak pernah selesai.",
        ],
        lanjut: {
          judul: "Persatuan berarti semua harus sama?",
          isi: "Tidak. Persatuan di sini tidak berarti keseragaman. Perbedaan pendapat, kritik, dan persaingan adalah tanda organisasi yang masih hidup.\n\nPerbedaan itu sehat selama ada akhirnya. Kapan ia berubah menjadi bahaya, kita lihat sebentar lagi.",
        },
        dalam: {
          judul: "Kapan persaingan jadi berbahaya?",
          isi: "Bayangkan sebuah perahu. Separuh awaknya mendayung ke kiri, separuh ke kanan. Semua berkeringat, tetapi perahu hanya berputar di tempat. Itulah gambaran kontestasi yang tidak pernah selesai.\n\nYang dibutuhkan bukan memadamkan perbedaan, melainkan tahu kapan sebuah perdebatan selesai, lalu kembali mendayung ke arah yang sama.\n\nPersatuan seperti itu tidak lahir dari seruan, melainkan dari aturan main yang dipercaya semua pihak. Sengketa diselesaikan lewat mekanisme yang tertulis dan berjenjang, bukan lewat kubu. Keputusan forum dicatat beserta alasannya, sehingga pihak yang kalah tahu dasar keputusan itu dan pihak yang menang tidak bisa mengubahnya sesuka hati. Pengurus yang terpilih membuka pintu bagi mereka yang tidak memilihnya sejak hari pertama. Hal-hal sederhana seperti ini lebih menentukan daripada pidato persatuan yang paling indah.",
          kutipan:
            "Yang berbahaya adalah kontestasi yang tidak pernah selesai, yang kalah memilih keluar, yang menang memilih menutup pintu, dan setelah keputusan diambil, perahu masih berputar di tempat karena separuh awaknya mendayung ke arah yang berlawanan.",
        },
      },
      {
        id: "bab-11",
        adegan: "dunia-go-international",
        label: "Bagian 11 · Melompat ke dunia",
        judul: "Persatuan untuk melompat",
        inti: "Persatuan juga tidak berguna kalau hanya dipakai untuk bertahan. Ia baru bermakna ketika menjadi landasan untuk melompat. HMI perlu mengajak kadernya memakai kacamata yang lebih lebar: melihat ke dalam negeri, dan juga ke luar.",
        poin: [
          "Berapa kader yang menembus kampus dan riset kelas dunia.",
          "Berapa karya yang dibaca di luar negeri.",
          "Berapa kader yang bekerja di lembaga global lalu membawa pulang pengetahuannya.",
          "Berapa prestasi yang membuat nama Indonesia disebut dengan hormat.",
        ],
        lanjut: {
          judul: "Apa bedanya dengan ukuran selama ini?",
          isi: "Ukuran sumbangsih HMI ke depan tidak cukup lagi dihitung dari berapa alumninya yang menduduki jabatan di dalam negeri.\n\nUkuran baru menambahkan empat hal: kader di kampus dan riset kelas dunia, karya yang dibaca di luar negeri, kader di lembaga global yang pulang membawa ilmu, dan prestasi yang mengangkat nama Indonesia.",
        },
        dalam: {
          judul: "Rumah seperti apa yang dibutuhkan?",
          isi: "Prestasi semacam itu tidak lahir dari organisasi yang energinya habis untuk bertengkar. Kuncinya ada pada dua kata: rukun dan hangat. Rukun memberi tenaga untuk pergi jauh. Hangat membuat orang ingin pulang.\n\nJadi “go international” bukan berarti meninggalkan rumah. Artinya pergi jauh, lalu pulang membawa sesuatu.",
          kutipan:
            "Ia lahir dari rumah yang cukup rukun sehingga penghuninya punya tenaga untuk pergi jauh, dan cukup hangat sehingga mereka ingin pulang.",
        },
      },
    ],
    penutup: {
      judul: "Bawa Indonesia bersinar di panggung dunia",
      isi: "Lafran Pane dan kawan-kawannya mendirikan HMI ketika republik sedang dikepung. Hatta merumuskan bebas aktif ketika republik sedang terbelah. Keduanya memahami hal yang sama: karang di luar tidak pernah bisa dipindahkan, yang bisa diatur hanyalah cara kita mendayung.\n\nHampir delapan puluh tahun kemudian, karangnya berganti rupa menjadi perang yang mengguncang jalur energi dunia, perlombaan teknologi, dan perebutan masa depan, tetapi pelajarannya tetap. Indonesia hanya bisa bersinar di panggung dunia kalau rumahnya rukun, dan HMI hanya bisa ikut menyalakan sinar itu kalau tidak sibuk berkelahi dengan dirinya sendiri.\n\nKarena itu, ajakan ini untuk seluruh kader HMI, dari komisariat sampai Pengurus Besar, dari kader yang baru mengikuti LK 1 sampai alumni yang sudah lama berkarya. Mari rapatkan barisan dan bersama-sama menyongsong Indonesia Emas 2045. Mari bawa Indonesia tampil lebih depan di panggung dunia, bukan hanya hadir, tetapi bercahaya.\n\nMulainya dari hal yang dekat. Cabang bisa mendata kadernya yang sedang studi lanjut, meneliti, atau bekerja di luar negeri, lalu menghubungkan mereka dengan kader yang ingin menyusul. Komisariat bisa memasukkan bacaan tentang energi, pangan, teknologi, dan geopolitik ke dalam kajian rutinnya, karena persoalan-persoalan itulah yang kelak akan mereka pimpin.\n\nSeratus tahun HMI kelak tidak akan dikenang dari seberapa keras kita berebut kemudi, melainkan dari seberapa jauh perahu ini sampai.",
      ajakan:
        "Di tengah karang yang makin banyak, di bagian mana dari perahu ini kamu memilih berdiri? Pilih tempatmu, lalu mulai dari komisariat dan cabangmu: mendayung bersama, supaya Indonesia tampil lebih depan dan bercahaya di panggung dunia.",
    },
    rujukan: referensi,
  };
}
