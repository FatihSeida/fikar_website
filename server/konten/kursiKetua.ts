/**
 * Isi "Sehari di Kursi Ketua": 15 situasi dalam lima babak, kunci nilai lima
 * dimensi, potret kepemimpinan, dan teks halaman hasil. Disimpan di server dan
 * baru dikirim ke pengunjung setelah jadwal rilis (shared/rilis.ts).
 *
 * Nilai setiap pilihan: 0–2 per dimensi, null bila dimensi tidak dinilai pada
 * situasi itu. Dimensi: A arah dan prioritas, P partisipasi dan keterbukaan,
 * K pengembangan kader, D delegasi dan sistem, J menjaga diri dan dukungan.
 */

type Nilai = [number | null, number | null, number | null, number | null, number | null];

interface Pilihan {
  label: string;
  konsekuensi: string;
  /** Frasa singkat untuk "Dalam simulasi ini, kamu memilih …". */
  ringkas: string;
  nilai: Nilai;
  /** Untuk pilihan yang layak ditinjau: manfaat yang dikejar, yang terlewat, dan alternatifnya. */
  temuan?: { judul: string; manfaat: string; terlewat: string; coba: string };
}

interface Situasi {
  nomor: number;
  babak: number;
  judul: string;
  teks: string;
  /** Teks pengganti bila keputusan sebelumnya memenuhi syarat. */
  varian?: { syarat: Record<number, string>; teks: string }[];
  pertanyaan: string;
  /** Konteks singkat untuk "pada situasi …". */
  konteks: string;
  pilihan: [Pilihan, Pilihan, Pilihan, Pilihan];
}

const babak = [
  { nomor: 1, nama: "Pagi", fokus: "Menentukan perhatian" },
  { nomor: 2, nama: "Siang", fokus: "Mendengar dan memutuskan" },
  {
    nomor: 3, nama: "Sore", fokus: "Membagi pekerjaan",
    varian: [{ syarat: { 2: "D" }, teks: "Pekerjaan tambahan dari dua agenda yang kamu jalankan sendiri pagi tadi mulai menumpuk." }],
  },
  { nomor: 4, nama: "Malam", fokus: "Memberi ruang tumbuh" },
  {
    nomor: 5, nama: "Menjelang pulang", fokus: "Menjaga keberlangsungan",
    varian: [{ syarat: { 7: "A", 9: "C" }, teks: "Dua pekerjaan yang kamu ambil alih sore tadi kini berada di tanganmu." }],
  },
];

const situasi: Situasi[] = [
  {
    nomor: 1, babak: 1, judul: "Tiga pesan, satu pagi",
    teks: "Laporan kegiatan harus selesai siang ini. Panitia membutuhkan keputusan anggaran. Seorang kader mengirim pesan: “Bang/Kak, saya sedang kepikiran berhenti.”",
    pertanyaan: "Apa yang kamu lakukan terlebih dahulu?",
    konteks: "tiga kebutuhan datang di pagi yang sama",
    pilihan: [
      { label: "Menyelesaikan laporan sendiri, kemudian menangani pesan lainnya.", konsekuensi: "Laporan bergerak cepat, tetapi dua kebutuhan lain menunggu tenaga dan waktumu.", ringkas: "menyelesaikan laporan sendiri lebih dulu", nilai: [2, 0, null, 0, null],
        temuan: { judul: "Ketika tiga kebutuhan datang bersamaan, kamu mengerjakan laporan sendiri lebih dulu.", manfaat: "Kamu memastikan tenggat yang paling jelas terpenuhi.", terlewat: "Namun, kader yang sedang ragu dan panitia yang menunggu keputusan tidak mendapat kabar, dan semua bergantung pada tenagamu.", coba: "tentukan prioritas bersama satu pengurus, bagikan penanggung jawab, lalu kirim kabar singkat kepada kader kapan kalian bisa berbicara." } },
      { label: "Mengajak kader berbicara terlebih dahulu, lalu mengurus pekerjaan yang tertunda.", konsekuensi: "Kader mendapat perhatian langsung, sementara pekerjaan membutuhkan pengaturan ulang.", ringkas: "mengajak kader yang ragu berbicara lebih dulu", nilai: [1, 2, null, 0, null],
        temuan: { judul: "Ketika tiga kebutuhan datang bersamaan, kamu mendahulukan percakapan dengan kader.", manfaat: "Kader yang ragu merasa diperhatikan pada saat yang penting.", terlewat: "Namun, laporan dan keputusan anggaran tertunda tanpa ada yang memegangnya.", coba: "sebelum menemui kader, serahkan laporan dan keputusan anggaran kepada penanggung jawab dengan tenggat yang jelas." } },
      { label: "Menentukan prioritas bersama sekretaris, membagi penanggung jawab, lalu menjadwalkan percakapan dengan kader.", konsekuensi: "Tiga kebutuhan mulai ditangani, meskipun kamu perlu memastikan pembagian tugas dipahami.", ringkas: "menentukan prioritas bersama sekretaris dan membagi penanggung jawab", nilai: [2, 2, null, 2, null] },
      { label: "Meminta semua pihak membawa persoalannya ke rapat pengurus nanti sore.", konsekuensi: "Persoalan akan dibahas bersama, tetapi kebutuhan yang mendesak belum mendapat respons sekarang.", ringkas: "menunda semua persoalan sampai rapat sore", nilai: [0, 1, null, 1, null],
        temuan: { judul: "Ketika tiga kebutuhan datang bersamaan, kamu menundanya sampai rapat sore.", manfaat: "Kamu ingin semua dibahas bersama dan adil.", terlewat: "Namun, kebutuhan yang mendesak, termasuk kader yang ingin berhenti, belum mendapat respons ketika paling dibutuhkan.", coba: "pisahkan yang mendesak hari ini dari yang bisa menunggu rapat, lalu tunjuk satu orang untuk menangani yang mendesak." } },
    ],
  },
  {
    nomor: 2, babak: 1, judul: "Kegiatan besar atau pendampingan?",
    teks: "Tim mengusulkan acara besar yang dapat menarik perhatian. Pada minggu yang sama, pendampingan kader pasca-LK 1 belum berjalan. Tenaga pengurus terbatas.",
    pertanyaan: "Mana yang kamu dahulukan?",
    konteks: "acara besar bersaing dengan pendampingan kader",
    pilihan: [
      { label: "Mendahulukan acara besar; momentum sulit diulang.", konsekuensi: "Organisasi mendapat kesempatan tampil, tetapi tindak lanjut perkaderan kembali tertunda.", ringkas: "mendahulukan acara besar", nilai: [2, 0, 0, null, 0],
        temuan: { judul: "Ketika tenaga terbatas, kamu mendahulukan acara besar.", manfaat: "Kamu menjaga momentum dan nama organisasi.", terlewat: "Namun, kader pasca-LK 1 kembali menunggu pendampingan, dan pola ini membuat kader mudah hilang.", coba: "kecilkan skala acara sampai sesuai tenaga, dan pastikan satu agenda pendampingan tetap berjalan pada minggu yang sama." } },
      { label: "Mendahulukan pendampingan dan mengecilkan skala acara.", konsekuensi: "Perhatian diarahkan pada keberlanjutan kader, sementara jangkauan acara berkurang.", ringkas: "mendahulukan pendampingan dan mengecilkan acara", nilai: [2, 1, 2, null, 1] },
      { label: "Meminta data kesiapan kedua kegiatan, lalu memilih skala yang realistis.", konsekuensi: "Keputusan memiliki dasar yang lebih jelas, tetapi informasi harus dikumpulkan dengan cepat.", ringkas: "meminta data kesiapan sebelum memilih skala kegiatan", nilai: [2, 2, 1, null, 2] },
      { label: "Menjalankan keduanya dan turun langsung menutup kekurangan tenaga.", konsekuensi: "Kedua agenda tetap berjalan, dengan tambahan beban yang bertumpu padamu.", ringkas: "menjalankan dua agenda dan menutup kekurangan tenaga sendiri", nilai: [1, 0, 1, null, 0],
        temuan: { judul: "Ketika tenaga terbatas, kamu menjalankan keduanya dan menutup kekurangannya sendiri.", manfaat: "Tidak ada agenda yang dikorbankan.", terlewat: "Namun, beban bertumpu padamu, dan tim belum belajar memilih ketika tenaga tidak cukup.", coba: "minta data kesiapan kedua kegiatan, lalu putuskan bersama tim mana yang dikecilkan atau ditunda." } },
    ],
  },
  {
    nomor: 3, babak: 1, judul: "Sisa waktu tiga puluh menit",
    teks: "Sebelum rapat, kamu punya tiga puluh menit. Ada bahan rapat yang belum terbaca, tugas pribadi yang tertunda, dan pengurus yang meminta arahan.",
    pertanyaan: "Bagaimana kamu memakai waktu itu?",
    konteks: "waktu tiga puluh menit sebelum rapat",
    pilihan: [
      { label: "Memakai seluruh waktu untuk membaca bahan rapat.", konsekuensi: "Kamu lebih siap memutuskan, tetapi kebutuhan pribadi dan arahan pengurus menunggu.", ringkas: "memakai seluruh waktu untuk membaca bahan rapat", nilai: [2, null, null, 0, 0],
        temuan: { judul: "Ketika waktu sempit, kamu memakai semuanya untuk membaca bahan rapat.", manfaat: "Kamu datang ke rapat dengan persiapan yang baik.", terlewat: "Namun, pengurus menunggu arahan dan kebutuhan pribadimu kembali tertunda.", coba: "minta pengurus menuliskan dua pilihan beserta kendalanya, sehingga kamu cukup membaca ringkasan dan masih punya waktu untuk satu urusan pribadi." } },
      { label: "Memberi arahan kepada pengurus agar pekerjaan mereka bergerak.", konsekuensi: "Tim mendapat kepastian, sementara persiapanmu sendiri berkurang.", ringkas: "memberi arahan kepada pengurus", nilai: [1, null, null, 1, 0],
        temuan: { judul: "Ketika waktu sempit, kamu memakainya untuk memberi arahan.", manfaat: "Pekerjaan tim tetap bergerak.", terlewat: "Namun, kamu masuk rapat dengan persiapan tipis, dan kebutuhan pribadimu tidak mendapat tempat.", coba: "biasakan pengurus datang dengan pilihan dan kendala tertulis, sehingga arahan bisa diberikan lebih singkat." } },
      { label: "Meminta pengurus menulis dua opsi beserta kendalanya, lalu membagi waktu untuk membaca ringkasan dan menyelesaikan satu kebutuhan pribadi.", konsekuensi: "Pengurus ikut menyiapkan keputusan dan kamu menjaga sebagian kebutuhanmu, dengan persiapan yang lebih ringkas.", ringkas: "meminta pengurus menyiapkan dua pilihan dan menyisakan waktu untuk kebutuhan pribadi", nilai: [2, null, null, 2, 2] },
      { label: "Menunda rapat agar semua persiapan selesai.", konsekuensi: "Persiapan bertambah, tetapi jadwal orang lain ikut berubah.", ringkas: "menunda rapat sampai semua persiapan selesai", nilai: [1, null, null, 0, 1],
        temuan: { judul: "Ketika waktu sempit, kamu menunda rapat.", manfaat: "Kamu ingin semua siap sebelum memutuskan.", terlewat: "Namun, jadwal pengurus lain ikut bergeser, dan kebiasaan menunggu persiapan sempurna bisa memperlambat organisasi.", coba: "jalankan rapat sesuai jadwal dengan bahan ringkas, dan tandai keputusan yang perlu dibahas ulang setelah datanya lengkap." } },
    ],
  },
  {
    nomor: 4, babak: 2, judul: "Keputusanmu dipertanyakan",
    teks: "Dalam rapat, seorang pengurus berkata: “Keputusan ini terlalu cepat. Kami belum diajak bicara.”",
    pertanyaan: "Bagaimana kamu menanggapinya?",
    konteks: "keputusanmu dipertanyakan dalam rapat",
    pilihan: [
      { label: "Menjelaskan alasan keputusan dan meminta tim menjalankannya terlebih dahulu.", konsekuensi: "Arah tetap jelas, tetapi keberatan pengurus belum memengaruhi keputusan.", ringkas: "menjelaskan alasan dan meminta tim menjalankan keputusan dulu", nilai: [2, 0, null, null, null],
        temuan: { judul: "Ketika keputusanmu dipertanyakan, kamu menjelaskan alasan dan meminta tim menjalankannya.", manfaat: "Arah tetap jelas dan pekerjaan tidak berhenti.", terlewat: "Namun, pengurus yang merasa tidak dilibatkan bisa menjalankan keputusan tanpa rasa memiliki.", coba: "minta keberatan yang spesifik, tetapkan batas waktu pembahasan, lalu jelaskan bagian mana yang berubah dan mana yang tetap." } },
      { label: "Membuka kembali pembahasan dan meminta keberatan yang spesifik.", konsekuensi: "Tim memperoleh ruang memengaruhi keputusan, dengan tambahan waktu pembahasan.", ringkas: "membuka kembali pembahasan dan meminta keberatan yang spesifik", nilai: [1, 2, null, null, null] },
      { label: "Mengambil suara terbanyak untuk segera menyelesaikan perbedaan.", konsekuensi: "Keputusan mendapat dukungan jumlah, tetapi alasan kelompok yang berbeda bisa belum terurai.", ringkas: "mengambil suara terbanyak", nilai: [2, 1, null, null, null] },
      { label: "Membicarakannya secara pribadi setelah rapat.", konsekuensi: "Hubungan dapat dijaga, sementara persoalan pelibatan tim belum dibahas bersama.", ringkas: "membicarakannya secara pribadi setelah rapat", nilai: [1, 1, null, null, null],
        temuan: { judul: "Ketika keputusanmu dipertanyakan, kamu membicarakannya secara pribadi.", manfaat: "Kamu menjaga hubungan dan menghindari ketegangan di forum.", terlewat: "Namun, persoalan pelibatan tim tidak dibahas bersama, sehingga keberatan serupa bisa muncul lagi.", coba: "akui keberatan di forum, sepakati cara pelibatan untuk keputusan berikutnya, lalu lanjutkan percakapan pribadi bila perlu." } },
    ],
  },
  {
    nomor: 5, babak: 2, judul: "Program lama kehilangan peserta",
    teks: "Program rutin semakin sepi. Pengurus berbeda pendapat tentang penyebabnya.",
    pertanyaan: "Apa langkahmu?",
    konteks: "program rutin kehilangan peserta",
    pilihan: [
      { label: "Mengganti format berdasarkan pengalamanmu mengikuti kegiatan serupa.", konsekuensi: "Perubahan bisa dimulai cepat, tetapi penyebab sepinya peserta belum diperiksa.", ringkas: "mengganti format berdasarkan pengalamanmu sendiri", nilai: [2, 0, null, null, null],
        temuan: { judul: "Ketika program sepi, kamu mengganti format berdasarkan pengalamanmu.", manfaat: "Perubahan bisa dimulai cepat.", terlewat: "Namun, penyebab sepinya peserta belum diperiksa, sehingga format baru bisa mengulang masalah yang sama.", coba: "periksa catatan kehadiran dan tanyakan beberapa kader yang tidak datang, lalu uji satu perubahan kecil." } },
      { label: "Bertanya kepada beberapa peserta dan kader yang tidak datang sebelum menentukan perubahan.", konsekuensi: "Pengalaman kader masuk ke pertimbangan, meskipun jawaban beberapa orang belum mewakili semuanya.", ringkas: "bertanya kepada peserta dan kader yang tidak datang", nilai: [1, 2, null, null, null] },
      { label: "Memeriksa catatan kehadiran dan umpan balik, lalu menguji satu perubahan kecil.", konsekuensi: "Tim mendapat dasar dan kesempatan belajar sebelum melakukan perubahan besar.", ringkas: "memeriksa catatan kehadiran lalu menguji satu perubahan kecil", nilai: [2, 2, null, null, null] },
      { label: "Menghentikan program dan memindahkan tenaga ke kegiatan baru.", konsekuensi: "Tenaga segera tersedia, tetapi pelajaran dari program lama mungkin ikut hilang.", ringkas: "menghentikan program lama", nilai: [1, 0, null, null, null],
        temuan: { judul: "Ketika program sepi, kamu menghentikannya.", manfaat: "Tenaga organisasi segera bisa dipakai untuk hal lain.", terlewat: "Namun, pelajaran dari program lama ikut hilang, dan kader yang masih datang tidak ditanya.", coba: "sebelum menghentikan, catat apa yang berhasil dan tidak, lalu putuskan bersama pengurus berdasarkan catatan itu." } },
    ],
  },
  {
    nomor: 6, babak: 2, judul: "Ide kader baru berbeda dari kebiasaan",
    teks: "Kader baru menawarkan format diskusi yang belum pernah dicoba. Beberapa pengurus menganggapnya kurang cocok.",
    pertanyaan: "Apa yang kamu lakukan?",
    konteks: "kader baru menawarkan ide yang berbeda dari kebiasaan",
    pilihan: [
      { label: "Meminta mereka mengikuti format yang sudah berjalan dahulu.", konsekuensi: "Pelaksanaan lebih mudah diperkirakan, tetapi ide baru belum memperoleh ruang uji.", ringkas: "meminta kader baru mengikuti format yang sudah berjalan", nilai: [null, 0, 0, 1, null],
        temuan: { judul: "Ketika kader baru membawa ide berbeda, kamu memintanya mengikuti format lama.", manfaat: "Pelaksanaan lebih mudah diperkirakan.", terlewat: "Namun, ide baru tidak sempat diuji, dan kader baru belajar bahwa usulannya tidak punya tempat.", coba: "beri ruang uji coba kecil dengan pendamping dan ukuran keberhasilan yang disepakati di awal." } },
      { label: "Memberi kesempatan mencoba dalam skala kecil, dengan pendamping dan evaluasi.", konsekuensi: "Kader mendapat ruang belajar dan organisasi dapat menilai hasilnya dengan risiko terbatas.", ringkas: "memberi kesempatan mencoba dalam skala kecil dengan pendamping", nilai: [null, 2, 2, 2, null] },
      { label: "Membawa ide itu ke rapat berikutnya agar semua pengurus menyetujui.", konsekuensi: "Pelibatan bertambah, tetapi percobaan bergantung pada jadwal pembahasan.", ringkas: "membawa ide kader ke rapat berikutnya", nilai: [null, 1, 1, 1, null],
        temuan: { judul: "Ketika kader baru membawa ide berbeda, kamu menunggu persetujuan rapat.", manfaat: "Semua pengurus ikut dilibatkan.", terlewat: "Namun, semangat kader bisa surut selama menunggu jadwal pembahasan.", coba: "tetapkan batas uji coba yang boleh langsung dijalankan tanpa menunggu rapat, misalnya satu sesi dengan pendamping." } },
      { label: "Membantu sendiri agar ide tersebut langsung terlaksana.", konsekuensi: "Ide mendapat dukungan kuat, sementara pelaksanaannya kembali bergantung pada waktumu.", ringkas: "membantu sendiri agar ide langsung terlaksana", nilai: [null, 1, 1, 0, null],
        temuan: { judul: "Ketika kader baru membawa ide berbeda, kamu turun tangan sendiri.", manfaat: "Ide mendapat dukungan kuat dan cepat terlaksana.", terlewat: "Namun, pelaksanaan bergantung pada waktumu, dan kader kehilangan kesempatan memimpin idenya sendiri.", coba: "pasangkan kader dengan pendamping dan biarkan kader memimpin pelaksanaannya." } },
    ],
  },
  {
    nomor: 7, babak: 3, judul: "Tugas penting belum selesai",
    teks: "Penanggung jawab belum menyelesaikan pekerjaan. Tenggat besok pagi.",
    pertanyaan: "Apa yang kamu lakukan?",
    konteks: "pekerjaan penting tersendat menjelang tenggat",
    pilihan: [
      { label: "Mengambil alih agar pekerjaan pasti selesai.", konsekuensi: "Tenggat lebih terlindungi, tetapi beban berpindah kepadamu dan proses belajar penanggung jawab terpotong.", ringkas: "mengambil alih pekerjaan yang tersendat", nilai: [2, null, 0, 0, null],
        temuan: { judul: "Ketika pekerjaan tersendat, kamu mengambil alih.", manfaat: "Kamu melindungi tenggat.", terlewat: "Namun, jika pola ini berulang, penanggung jawab kehilangan kesempatan belajar dan tim terbiasa menunggu penyelamatan.", coba: "sepakati hasil minimum, tanyakan satu kendala utama, dan tetapkan waktu pemeriksaan. Ambil alih bagian yang benar-benar mendesak saja." } },
      { label: "Menanyakan kendala, menyepakati hasil minimum, dan menjadwalkan pemeriksaan singkat.", konsekuensi: "Tanggung jawab tetap pada penanggung jawab, dengan bantuan yang lebih terarah.", ringkas: "menanyakan kendala dan menyepakati hasil minimum", nilai: [2, null, 2, 2, null] },
      { label: "Mengalihkan pekerjaan kepada pengurus yang lebih berpengalaman.", konsekuensi: "Peluang selesai meningkat, tetapi pengurus yang mampu mendapat tambahan beban.", ringkas: "mengalihkan pekerjaan kepada pengurus yang lebih berpengalaman", nilai: [2, null, 0, 1, null],
        temuan: { judul: "Ketika pekerjaan tersendat, kamu mengalihkannya kepada yang lebih berpengalaman.", manfaat: "Peluang pekerjaan selesai meningkat.", terlewat: "Namun, pengurus yang mampu makin terbebani, dan penanggung jawab awal tidak belajar dari kendalanya.", coba: "tanyakan kendala penanggung jawab lebih dulu, lalu minta pengurus berpengalaman mendampingi, bukan mengambil alih." } },
      { label: "Meminta penanggung jawab menyelesaikannya tanpa bantuan karena sudah menerima tugas.", konsekuensi: "Batas tanggung jawab jelas, tetapi kendala yang menghambat bisa tetap ada.", ringkas: "meminta penanggung jawab menyelesaikannya tanpa bantuan", nilai: [1, null, 0, 1, null],
        temuan: { judul: "Ketika pekerjaan tersendat, kamu meminta penanggung jawab menyelesaikannya sendiri.", manfaat: "Batas tanggung jawab menjadi jelas.", terlewat: "Namun, kendala yang menghambat tidak terlihat, dan tenggat bisa tetap terlewat.", coba: "tanyakan satu kendala utama dan tawarkan bantuan yang terarah, tanpa memindahkan tanggung jawabnya." } },
    ],
  },
  {
    nomor: 8, babak: 3, judul: "Semua keputusan kecil menunggumu",
    teks: "Poster, pemilihan ruangan, dan pembagian konsumsi selalu meminta persetujuan ketua.",
    pertanyaan: "Bagaimana kamu mengaturnya?",
    konteks: "keputusan kecil selalu menunggu persetujuanmu",
    pilihan: [
      { label: "Menyetujui satu per satu agar tidak ada kesalahan.", konsekuensi: "Kamu menjaga kendali, tetapi alur kerja melambat ketika kamu tidak tersedia.", ringkas: "menyetujui keputusan kecil satu per satu", nilai: [null, null, null, 0, null],
        temuan: { judul: "Ketika keputusan kecil menumpuk, kamu menyetujuinya satu per satu.", manfaat: "Kamu menjaga mutu dan mencegah kesalahan.", terlewat: "Namun, pekerjaan berhenti setiap kali kamu tidak tersedia, dan panitia tidak belajar memutuskan.", coba: "sepakati daftar keputusan yang boleh diambil panitia sendiri dan yang harus dikonsultasikan." } },
      { label: "Memberikan seluruh keputusan kepada panitia.", konsekuensi: "Panitia mendapat keleluasaan, tetapi batas kewenangan dan tanggung jawab perlu dipastikan.", ringkas: "memberikan seluruh keputusan kepada panitia", nilai: [null, null, null, 1, null],
        temuan: { judul: "Ketika keputusan kecil menumpuk, kamu menyerahkan semuanya kepada panitia.", manfaat: "Panitia mendapat keleluasaan dan kamu terbebas dari antrean persetujuan.", terlewat: "Namun, tanpa batas yang jelas, panitia bisa ragu atau mengambil keputusan yang seharusnya dibicarakan.", coba: "tuliskan batas kewenangan panitia, termasuk hal yang tetap perlu dikonsultasikan." } },
      { label: "Menyepakati keputusan yang dapat diambil panitia sendiri dan hal yang harus dikonsultasikan.", konsekuensi: "Tim memperoleh ruang bergerak dengan batas yang lebih jelas.", ringkas: "menyepakati batas kewenangan panitia", nilai: [null, null, null, 2, null] },
      { label: "Menunjuk satu pengurus untuk menyaring semua permintaan sebelum sampai kepadamu.", konsekuensi: "Gangguan berkurang, tetapi ketergantungan bisa berpindah kepada satu orang lain.", ringkas: "menunjuk satu pengurus untuk menyaring semua permintaan", nilai: [null, null, null, 1, null],
        temuan: { judul: "Ketika keputusan kecil menumpuk, kamu menunjuk satu penyaring.", manfaat: "Gangguan kepadamu berkurang.", terlewat: "Namun, ketergantungan hanya berpindah ke satu orang, dan panitia tetap tidak punya kewenangan.", coba: "sepakati keputusan yang boleh diambil panitia langsung, sehingga penyaring hanya menangani yang benar-benar perlu." } },
    ],
  },
  {
    nomor: 9, babak: 3, judul: "Orang yang paling mampu mulai lelah",
    teks: "Pengurus yang biasanya diandalkan berkata: “Saya sudah terlalu banyak pegang pekerjaan.”",
    pertanyaan: "Apa tanggapanmu?",
    konteks: "pengurus andalan mulai kelelahan",
    pilihan: [
      { label: "Memintanya bertahan sampai kegiatan selesai.", konsekuensi: "Pekerjaan tetap pada orang yang berpengalaman, tetapi tanda kelelahan belum ditangani.", ringkas: "meminta pengurus andalan bertahan sampai kegiatan selesai", nilai: [null, null, null, 0, 0],
        temuan: { judul: "Ketika pengurus andalan kelelahan, kamu memintanya bertahan.", manfaat: "Pekerjaan tetap di tangan orang yang paling berpengalaman.", terlewat: "Namun, tanda kelelahan tidak ditangani, dan organisasi makin bergantung pada satu orang.", coba: "kurangi tugasnya dan susun pembagian ulang bersama tim, dengan pendamping bagi pengurus yang menerima tugas baru." } },
      { label: "Mengurangi tugasnya dan menyusun pembagian ulang bersama tim.", konsekuensi: "Beban mulai tersebar, dengan kebutuhan penyesuaian dan pendampingan bagi pengurus lain.", ringkas: "mengurangi tugasnya dan menyusun pembagian ulang bersama tim", nilai: [null, null, null, 2, 2] },
      { label: "Mengambil sebagian pekerjaannya sendiri.", konsekuensi: "Ia mendapat bantuan cepat, tetapi beban organisasi kembali terkumpul pada ketua.", ringkas: "mengambil sebagian pekerjaannya sendiri", nilai: [null, null, null, 0, 1],
        temuan: { judul: "Ketika pengurus andalan kelelahan, kamu mengambil sebagian pekerjaannya.", manfaat: "Ia segera mendapat bantuan.", terlewat: "Namun, beban organisasi kembali terkumpul pada ketua, dan pembagian kerja tim tidak berubah.", coba: "bagikan pekerjaannya kepada beberapa pengurus lain, dan cukup kamu yang memastikan pembagian itu berjalan." } },
      { label: "Memberinya waktu istirahat dan menunda pekerjaan yang tidak mendesak.", konsekuensi: "Tim mendapat ruang pulih, sementara jadwal dan hasil kegiatan perlu disesuaikan.", ringkas: "memberinya waktu istirahat dan menunda yang tidak mendesak", nilai: [null, null, null, 1, 2] },
    ],
  },
  {
    nomor: 10, babak: 4, judul: "Kader melakukan kesalahan pertamanya",
    teks: "Kader baru salah mengirim informasi kegiatan. Beberapa peserta datang pada waktu yang keliru.",
    varian: [{ syarat: { 6: "B" }, teks: "Dalam kegiatan percobaan format diskusi baru yang kamu izinkan siang tadi, kader baru salah mengirim informasi kegiatan. Beberapa peserta datang pada waktu yang keliru." }],
    pertanyaan: "Bagaimana kamu menanganinya?",
    konteks: "kader baru melakukan kesalahan pertamanya",
    pilihan: [
      { label: "Menegurnya di grup agar semua orang belajar.", konsekuensi: "Kesalahan segera diketahui bersama, tetapi kader bisa merasa dipermalukan dan enggan mencoba lagi.", ringkas: "menegur kader di grup", nilai: [null, 0, 0, null, null],
        temuan: { judul: "Ketika kader melakukan kesalahan pertamanya, kamu menegurnya di grup.", manfaat: "Kamu ingin semua orang belajar dari kesalahan itu.", terlewat: "Namun, kader bisa merasa dipermalukan dan enggan mencoba lagi, terutama pada tugas pertamanya.", coba: "bantu koreksi informasinya lebih dulu, lalu bahas penyebab dan pencegahannya secara pribadi." } },
      { label: "Membantu mengoreksi informasi, lalu membahas penyebab dan pencegahannya secara pribadi.", konsekuensi: "Dampak ditangani dan kader memperoleh kesempatan memahami tanggung jawabnya.", ringkas: "membantu koreksi lalu membahas penyebabnya secara pribadi", nilai: [null, 2, 2, null, null] },
      { label: "Memperbaiki semuanya tanpa membicarakan kesalahan tersebut.", konsekuensi: "Situasi cepat tenang, tetapi kader belum mendapat umpan balik yang dapat dipakai.", ringkas: "memperbaiki kesalahan kader tanpa membicarakannya", nilai: [null, 0, 0, null, null],
        temuan: { judul: "Ketika kader melakukan kesalahan pertamanya, kamu memperbaikinya tanpa membicarakannya.", manfaat: "Situasi cepat tenang dan kader tidak merasa malu.", terlewat: "Namun, pekerjaan pulih tanpa pelajaran, dan kader belum tahu apa yang perlu diubah.", coba: "minta kader menyusun koreksi dan langkah pencegahannya, lalu tinjau bersama." } },
      { label: "Memintanya menyusun koreksi dan langkah pencegahan, kemudian meninjaunya bersama.", konsekuensi: "Kader ikut memulihkan dampak dan berlatih mengambil tanggung jawab, dengan pendampinganmu.", ringkas: "meminta kader menyusun koreksi dan pencegahan lalu meninjaunya bersama", nilai: [null, 2, 2, null, null] },
    ],
  },
  {
    nomor: 11, babak: 4, judul: "Kader yang pendiam selalu terlewat",
    teks: "Dalam diskusi, orang yang sama terus berbicara. Beberapa kader jarang menyampaikan pendapat.",
    pertanyaan: "Apa yang kamu lakukan?",
    konteks: "kader pendiam terus terlewat dalam diskusi",
    pilihan: [
      { label: "Melanjutkan diskusi; siapa pun sebenarnya boleh berbicara.", konsekuensi: "Alur tetap lancar, tetapi hambatan kader yang belum berani belum teratasi.", ringkas: "melanjutkan diskusi seperti biasa", nilai: [null, 0, 0, null, null],
        temuan: { judul: "Ketika kader pendiam terlewat, kamu melanjutkan diskusi seperti biasa.", manfaat: "Alur diskusi tetap lancar.", terlewat: "Namun, suara yang sama terus mendominasi, dan kader yang belum berani tidak pernah mendapat jalan masuk.", coba: "sediakan waktu menulis pendapat sebelum diskusi, lalu tawarkan giliran tanpa memaksa." } },
      { label: "Menyediakan waktu menulis pendapat sebelum diskusi dan menawarkan giliran tanpa memaksa.", konsekuensi: "Cara berpartisipasi menjadi lebih beragam dan kader punya waktu menyiapkan gagasan.", ringkas: "menyediakan waktu menulis pendapat dan menawarkan giliran", nilai: [null, 2, 2, null, null] },
      { label: "Menunjuk kader yang pendiam untuk langsung menjawab.", konsekuensi: "Kesempatan diberikan, tetapi sebagian kader mungkin belum merasa siap.", ringkas: "menunjuk kader pendiam untuk langsung menjawab", nilai: [null, 1, 1, null, null],
        temuan: { judul: "Ketika kader pendiam terlewat, kamu menunjuknya langsung.", manfaat: "Kader pendiam mendapat kesempatan berbicara.", terlewat: "Namun, kader yang belum siap bisa merasa tertekan dan makin enggan.", coba: "beri waktu menyiapkan pendapat lebih dulu, misalnya menulis singkat, sebelum menawarkan giliran." } },
      { label: "Mengajak mereka berbicara setelah forum untuk memahami hambatannya.", konsekuensi: "Kamu mendapat pemahaman lebih dekat, meskipun pola forum hari ini belum berubah.", ringkas: "mengajak kader pendiam berbicara setelah forum", nilai: [null, 2, 1, null, null] },
    ],
  },
  {
    nomor: 12, babak: 4, judul: "Siapa mendapat tugas berikutnya?",
    teks: "Ada pekerjaan riset kecil. Pengurus berpengalaman bisa menyelesaikannya cepat; kader lain ingin belajar tetapi belum pernah melakukannya.",
    pertanyaan: "Kepada siapa tugas itu kamu berikan?",
    konteks: "tugas riset kecil perlu diberikan kepada seseorang",
    pilihan: [
      { label: "Memberikan tugas kepada pengurus berpengalaman demi kualitas hasil.", konsekuensi: "Hasil lebih mudah diperkirakan, sementara kesempatan belajar kader lain tertunda.", ringkas: "memberikan tugas riset kepada pengurus berpengalaman", nilai: [null, null, 0, 1, null],
        temuan: { judul: "Ketika ada tugas riset kecil, kamu memberikannya kepada yang berpengalaman.", manfaat: "Hasilnya lebih mudah diperkirakan.", terlewat: "Namun, kader yang ingin belajar kehilangan kesempatan, dan keahlian riset tetap terkumpul pada orang yang sama.", coba: "pasangkan kader yang ingin belajar dengan pendamping berpengalaman, dengan target bertahap." } },
      { label: "Memasangkan kader yang ingin belajar dengan pendamping, disertai target bertahap.", konsekuensi: "Pekerjaan menjadi ruang pengembangan, dengan kebutuhan waktu pendampingan.", ringkas: "memasangkan kader yang ingin belajar dengan pendamping", nilai: [null, null, 2, 2, null] },
      { label: "Memberikan tugas sepenuhnya kepada kader baru agar ia belajar mandiri.", konsekuensi: "Kepercayaan diberikan, tetapi kesulitan bisa tidak terlihat sampai terlambat.", ringkas: "memberikan tugas sepenuhnya kepada kader baru", nilai: [null, null, 1, 1, null],
        temuan: { judul: "Ketika ada tugas riset kecil, kamu memberikannya sepenuhnya kepada kader baru.", manfaat: "Kamu memberi kepercayaan dan ruang belajar mandiri.", terlewat: "Namun, tanpa pendamping, kesulitan kader bisa tidak terlihat sampai terlambat.", coba: "tetap beri kepercayaan, tetapi sepakati satu pendamping dan satu waktu pemeriksaan di tengah jalan." } },
      { label: "Membuka tugas bagi siapa pun yang ingin mengambilnya.", konsekuensi: "Pilihan lebih terbuka, tetapi orang yang sudah percaya diri mungkin kembali mendominasi.", ringkas: "membuka tugas bagi siapa pun yang ingin mengambilnya", nilai: [null, null, 1, 1, null],
        temuan: { judul: "Ketika ada tugas riset kecil, kamu membukanya untuk siapa saja.", manfaat: "Kesempatan terbuka bagi semua.", terlewat: "Namun, orang yang sudah percaya diri cenderung mengambilnya lagi, sementara kader yang ragu tetap di pinggir.", coba: "tawarkan langsung kepada kader yang ingin belajar, dengan pendamping dan target kecil." } },
    ],
  },
  {
    nomor: 13, babak: 5, judul: "Kamu sendiri mulai kelelahan",
    teks: "Sudah beberapa malam kamu kurang tidur. Malam ini masih ada pekerjaan organisasi.",
    pertanyaan: "Apa yang kamu lakukan?",
    konteks: "kamu sendiri mulai kelelahan",
    pilihan: [
      { label: "Menyelesaikannya dahulu; istirahat setelah semuanya beres.", konsekuensi: "Pekerjaan bergerak malam ini, tetapi pemulihan terus menunggu pekerjaan habis.", ringkas: "menyelesaikan pekerjaan dulu dan menunda istirahat", nilai: [null, null, null, 0, 0],
        temuan: { judul: "Ketika kamu kelelahan, kamu tetap menyelesaikan pekerjaan dulu.", manfaat: "Tugas malam ini tetap selesai.", terlewat: "Namun, pekerjaan organisasi jarang benar-benar habis, sehingga pemulihanmu terus tertunda.", coba: "tentukan yang benar-benar mendesak, bagikan sisanya, dan beri tahu tim kapan kamu kembali tersedia." } },
      { label: "Menentukan yang benar-benar mendesak, membagi sisanya, dan memberi tahu kapan kamu kembali tersedia.", konsekuensi: "Organisasi tetap bergerak dengan batas waktu yang lebih jelas.", ringkas: "memilih yang mendesak, membagi sisanya, dan memberi tahu kapan kembali tersedia", nilai: [null, null, null, 2, 2] },
      { label: "Mematikan ponsel tanpa memberi kabar karena sudah tidak sanggup.", konsekuensi: "Kamu memperoleh jeda, tetapi tim belum tahu cara melanjutkan pekerjaan.", ringkas: "mematikan ponsel tanpa memberi kabar", nilai: [null, null, null, 0, 1],
        temuan: { judul: "Ketika kamu kelelahan, kamu mematikan ponsel tanpa kabar.", manfaat: "Kamu mendapat jeda yang memang dibutuhkan.", terlewat: "Namun, tim tidak tahu cara melanjutkan pekerjaan, dan jeda yang mendadak bisa menambah beban esok hari.", coba: "kirim satu pesan singkat sebelum beristirahat: apa yang ditunda, siapa yang memegang, dan kapan kamu kembali." } },
      { label: "Menghubungi orang yang dipercaya untuk bercerita, lalu memutuskan pekerjaan yang dapat ditunda.", konsekuensi: "Kamu mendapat dukungan dan ruang menilai kebutuhanmu, dengan penyesuaian agenda.", ringkas: "bercerita kepada orang yang dipercaya lalu menunda yang bisa ditunda", nilai: [null, null, null, 1, 2] },
    ],
  },
  {
    nomor: 14, babak: 5, judul: "Siapa tempatmu meminta bantuan?",
    teks: "Saat ada keputusan sulit, apa yang paling mungkin kamu lakukan?",
    pertanyaan: "Pilih yang paling mendekati kebiasaanmu.",
    konteks: "kamu menghadapi keputusan sulit",
    pilihan: [
      { label: "Memikirkannya sendiri agar tidak membebani orang lain.", konsekuensi: "Kamu menjaga kemandirian, tetapi pandangan dan dukungan lain tidak masuk.", ringkas: "memikirkan keputusan sulit sendiri", nilai: [null, 0, null, null, 0],
        temuan: { judul: "Ketika menghadapi keputusan sulit, kamu memikirkannya sendiri.", manfaat: "Kamu tidak ingin membebani orang lain.", terlewat: "Namun, pandangan dan dukungan lain tidak masuk, dan beban keputusan sepenuhnya kamu tanggung.", coba: "pilih dua orang dengan sudut pandang berbeda, misalnya satu pengurus dan satu pendamping, untuk dimintai pandangan sebelum memutuskan." } },
      { label: "Mendiskusikannya dengan satu orang yang dipercaya.", konsekuensi: "Kamu mendapat dukungan dekat, meskipun sudut pandangnya mungkin terbatas.", ringkas: "mendiskusikannya dengan satu orang yang dipercaya", nilai: [null, 1, null, null, 1],
        temuan: { judul: "Ketika menghadapi keputusan sulit, kamu mendiskusikannya dengan satu orang.", manfaat: "Kamu mendapat dukungan dari orang yang dekat dan dipercaya.", terlewat: "Namun, satu sudut pandang bisa terbatas, terutama untuk keputusan yang menyangkut banyak orang.", coba: "tambahkan satu sumber pandangan sesuai persoalannya: pengurus, pendamping, atau orang di luar organisasi." } },
      { label: "Membawa persoalan kepada orang sesuai kebutuhannya: pengurus, pendamping, atau orang di luar organisasi.", konsekuensi: "Dukungan lebih beragam, dengan kebutuhan menjaga batas informasi yang dibagikan.", ringkas: "membawa persoalan kepada orang yang sesuai kebutuhannya", nilai: [null, 2, null, null, 2] },
      { label: "Meminta senior menentukan keputusan yang harus diambil.", konsekuensi: "Kamu mendapat arah cepat, tetapi tanggung jawab pengambilan keputusan perlu tetap jelas.", ringkas: "meminta senior menentukan keputusan", nilai: [null, 1, null, null, 1],
        temuan: { judul: "Ketika menghadapi keputusan sulit, kamu meminta senior menentukannya.", manfaat: "Kamu mendapat arah yang cepat dari yang berpengalaman.", terlewat: "Namun, tanggung jawab keputusan menjadi kabur, dan pengurus bisa bertanya siapa yang sebenarnya memutuskan.", coba: "minta pandangan senior sebagai bahan, lalu ambil dan jelaskan keputusannya sendiri." } },
    ],
  },
  {
    nomor: 15, babak: 5, judul: "Besok kamu tidak bisa hadir",
    teks: "Ada urusan pribadi yang membuatmu tidak tersedia sepanjang hari.",
    varian: [{ syarat: { 8: "C" }, teks: "Ada urusan pribadi yang membuatmu tidak tersedia sepanjang hari. Tim sudah memiliki sebagian batas keputusan yang kalian sepakati sore tadi." }],
    pertanyaan: "Apa yang kamu siapkan?",
    konteks: "kamu tidak bisa hadir esok hari",
    pilihan: [
      { label: "Tetap meminta semua keputusan dikirim kepadamu melalui pesan.", konsekuensi: "Kendali tetap padamu, tetapi ketidakhadiranmu belum menjadi kesempatan tim memimpin.", ringkas: "tetap meminta semua keputusan dikirim kepadamu", nilai: [null, null, null, 0, 0],
        temuan: { judul: "Ketika kamu tidak bisa hadir, kamu tetap memegang semua keputusan lewat pesan.", manfaat: "Kendali tetap padamu dan kesalahan bisa dicegah.", terlewat: "Namun, kamu tidak benar-benar beristirahat, dan tim kehilangan kesempatan belajar memimpin.", coba: "tunjuk pengganti, serahkan informasi penting, dan sepakati batas kewenangannya selama kamu tidak ada." } },
      { label: "Menunjuk pengganti, menyerahkan informasi penting, dan menyepakati batas kewenangan.", konsekuensi: "Tim dapat bergerak dengan arah dan tanggung jawab yang lebih jelas.", ringkas: "menunjuk pengganti dan menyepakati batas kewenangannya", nilai: [null, null, null, 2, 2] },
      { label: "Menunda kegiatan yang memerlukan keputusan ketua.", konsekuensi: "Risiko keputusan keliru berkurang, tetapi kegiatan bergantung pada kehadiranmu.", ringkas: "menunda kegiatan yang memerlukan keputusan ketua", nilai: [null, null, null, 0, 1],
        temuan: { judul: "Ketika kamu tidak bisa hadir, kamu menunda kegiatan yang perlu keputusan ketua.", manfaat: "Risiko keputusan keliru berkurang.", terlewat: "Namun, kegiatan organisasi bergantung pada kehadiranmu, dan tim tidak terlatih bergerak tanpa ketua.", coba: "tunjuk pengganti dengan batas kewenangan yang jelas, sehingga kegiatan tetap berjalan." } },
      { label: "Membiarkan pengurus menjalankan kegiatan lalu membahas hasilnya setelah kamu kembali.", konsekuensi: "Tim mendapat kepercayaan, tetapi informasi dan batas keputusan perlu sudah tersedia.", ringkas: "membiarkan pengurus menjalankan kegiatan dan membahas hasilnya kemudian", nilai: [null, null, null, 1, 2] },
    ],
  },
];

const dimensi = [
  { kode: "A", nama: "Arah dan prioritas", uraian: "Menentukan tujuan, tenggat, dan keputusan yang jelas." },
  { kode: "P", nama: "Partisipasi dan keterbukaan", uraian: "Mendengar, mempertimbangkan bukti, dan melibatkan orang secara relevan." },
  { kode: "K", nama: "Pengembangan kader", uraian: "Memberi kesempatan mencoba, umpan balik, dan pendampingan." },
  { kode: "D", nama: "Delegasi dan sistem", uraian: "Membagi kewenangan, informasi, serta tanggung jawab." },
  { kode: "J", nama: "Menjaga diri dan dukungan", uraian: "Mengenali batas, meminta bantuan, dan merawat keberlangsungan kerja." },
];

/** Potret dari dua dimensi terkuat; kunci berupa dua kode dimensi berurutan A-P-K-D-J. */
const potret: Record<string, { nama: string; uraian: string; tantangan: string; kutipan: string }> = {
  AP: { nama: "Pengarah yang Mendengar", uraian: "Kamu berusaha menjaga arah sambil memberi ruang bagi pandangan orang lain.", tantangan: "memastikan pembahasan berakhir pada keputusan dan tanggung jawab yang jelas.", kutipan: "Menjaga arah sambil memberi ruang bagi setiap pandangan." },
  AK: { nama: "Penggerak Perkaderan", uraian: "Kamu menghubungkan pencapaian pekerjaan dengan kesempatan kader berkembang.", tantangan: "menjaga ruang belajar ketika tenggat mulai menekan.", kutipan: "Pekerjaan selesai, kader ikut bertumbuh." },
  AD: { nama: "Penata Gerak Organisasi", uraian: "Kamu mengandalkan arah yang jelas dan pembagian tanggung jawab.", tantangan: "memastikan sistem tetap peka terhadap kebutuhan kader.", kutipan: "Arah yang jelas, tanggung jawab yang terbagi." },
  AJ: { nama: "Penjaga Ritme", uraian: "Kamu berusaha menjaga tujuan tanpa mengabaikan keberlangsungan tenaga.", tantangan: "menerjemahkan ritme pribadi menjadi kebiasaan kerja bersama.", kutipan: "Menjaga tujuan tanpa menghabiskan tenaga." },
  PK: { nama: "Pendamping yang Membuka Ruang", uraian: "Kamu memberi perhatian pada suara kader dan kesempatan mereka mencoba.", tantangan: "menetapkan batas, target, dan keputusan saat pembahasan panjang.", kutipan: "Mendengar suara kader, membuka ruang untuk mencoba." },
  PD: { nama: "Perangkai Kerja Bersama", uraian: "Kamu cenderung melibatkan tim dan membagi kewenangan.", tantangan: "memastikan pelibatan tidak membuat tanggung jawab menjadi kabur.", kutipan: "Melibatkan tim, membagi kewenangan dengan jelas." },
  PJ: { nama: "Perawat Hubungan", uraian: "Kamu memberi ruang untuk didengar dan meminta dukungan.", tantangan: "membicarakan keputusan sulit secara terbuka, termasuk ketika mengecewakan orang.", kutipan: "Memberi ruang untuk didengar, berani meminta dukungan." },
  KD: { nama: "Pembangun Kemandirian Kader", uraian: "Kamu memakai pekerjaan sebagai ruang belajar dengan tanggung jawab yang dibagi.", tantangan: "menyesuaikan pendampingan dengan kesiapan setiap kader.", kutipan: "Memberi ruang mencoba, mendampingi proses, lalu mempercayakan tanggung jawab." },
  KJ: { nama: "Pendamping yang Menjaga", uraian: "Kamu memperhatikan perkembangan kader sekaligus kebutuhan dukungan.", tantangan: "tetap memberi tantangan dan tanggung jawab yang cukup.", kutipan: "Memperhatikan perkembangan kader, menjaga dukungan tetap ada." },
  DJ: { nama: "Penjaga Keberlangsungan", uraian: "Kamu berusaha membuat organisasi bergerak tanpa bergantung pada satu orang.", tantangan: "menjaga semangat, arah, dan kualitas hubungan di dalam sistem tersebut.", kutipan: "Organisasi tetap bergerak tanpa bergantung pada satu orang." },
};

const dukungan = {
  soal: [3, 9, 13, 14, 15],
  tersebar: { judul: "Dukungan mulai tersebar", uraian: "Pilihanmu menunjukkan pembagian beban dan beberapa tempat meminta bantuan. Periksa apakah dukungan itu benar-benar tersedia ketika kamu tidak bisa hadir." },
  belumKebiasaan: { judul: "Dukungan ada, tetapi belum menjadi kebiasaan", uraian: "Kamu beberapa kali meminta bantuan, tetapi pada situasi lain kembali mengambil alih. Tentukan kapan bantuan diminta sebelum pekerjaan menjadi mendesak." },
  kembaliKepadamu: { judul: "Beban banyak kembali kepadamu", uraian: "Dalam beberapa situasi, kamu memilih mengerjakan sendiri atau mempertahankan semua persetujuan. Coba lepaskan satu keputusan rutin dengan batas kewenangan yang jelas." },
};

const ruangTumbuh = {
  soal: [6, 7, 10, 11, 12],
  pendampingan: { judul: "Ruang mencoba dengan pendampingan", uraian: "Kesempatan, umpan balik, dan tanggung jawab berjalan bersama." },
  didengar: { judul: "Ruang didengar, tetapi kesempatan masih terbatas", uraian: "Suara kader diperhatikan, namun keputusan atau pekerjaan sering tetap dipegang pengurus." },
  mandiri: { judul: "Ruang mandiri dengan dukungan yang belum jelas", uraian: "Kepercayaan diberikan, tetapi pendampingan dan batas tugas belum konsisten." },
  arahan: { judul: "Ruang yang banyak mengikuti arahan", uraian: "Kepastian pekerjaan diutamakan; kesempatan kader memutuskan perlu diperluas." },
  // Pilihan yang memberi kepercayaan tanpa pendampingan.
  tandaMandiri: [{ soal: 12, pilihan: "C" }, { soal: 7, pilihan: "D" }, { soal: 12, pilihan: "D" }],
};

/** Langkah tujuh hari untuk dimensi yang paling perlu dikuatkan. */
const langkah: Record<string, { kebutuhan: string; langkah: string; komitmen: string }> = {
  A: { kebutuhan: "Arah belum jelas", langkah: "Pilih tiga prioritas pekan ini. Untuk setiap prioritas, tulis hasil minimum, penanggung jawab, dan tenggat.", komitmen: "Tiga prioritas. Tiga penanggung jawab. Satu tenggat yang jelas." },
  P: { kebutuhan: "Pelibatan terbatas", langkah: "Sebelum satu keputusan penting, minta dua pandangan berbeda dan jelaskan alasan keputusan akhirnya.", komitmen: "Dua pandangan berbeda sebelum satu keputusan penting." },
  K: { kebutuhan: "Ruang belajar terbatas", langkah: "Serahkan satu tugas kepada kader dengan target kecil, pendamping, serta jadwal umpan balik.", komitmen: "Satu tugas. Satu kader. Satu percakapan umpan balik." },
  D: { kebutuhan: "Delegasi terbatas", langkah: "Sepakati satu jenis keputusan yang dapat diambil pengurus tanpa persetujuan ketua.", komitmen: "Satu keputusan rutin dilepas, dengan batas kewenangan yang jelas." },
  J: { kebutuhan: "Dukungan terbatas", langkah: "Bicarakan satu beban dengan orang yang dipercaya dan tentukan pekerjaan yang dapat dibagi atau ditunda.", komitmen: "Satu beban dibicarakan. Satu pekerjaan dibagi." },
};

export function kontenKursiKetua() {
  return {
    judul: "Sehari di Kursi Ketua",
    subjudul: "Bagaimana kamu memimpin ketika semua membutuhkanmu?",
    pengantar: [
      "Pukul 08.00. Ponselmu sudah dipenuhi pesan.",
      "Agenda organisasi mendekat. Pengurus menunggu keputusan. Seorang kader ingin bercerita. Di luar organisasi, ada pekerjaan pribadi yang belum selesai.",
      "Hari ini, kamu duduk di kursi ketua.",
      "Hadapi 15 situasi. Pilih tindakan yang paling mungkin kamu lakukan, termasuk ketika pilihan itu terasa kurang ideal. Tidak ada ketua yang selalu memiliki waktu, tenaga, dan informasi yang lengkap.",
    ],
    hasilDidapat: [
      "Potret cara memimpin.",
      "Gambaran pembagian beban dan dukungan pribadi.",
      "Gambaran ruang tumbuh yang kamu berikan kepada kader.",
      "Tiga langkah yang bisa dicoba bersama pengurus.",
    ],
    waktu: "sekitar 10 menit",
    batasan: "Pengalaman ini merupakan refleksi atas pilihan dalam simulasi. Hasilnya bukan tes psikologi, penilaian resmi, atau bukti tentang kualitas kepemimpinan seseorang.",
    penutup: {
      judul: "Hari selesai. Apa yang terlihat dari keputusanmu?",
      varian: [{ syarat: { 1: "B" }, teks: "Percakapan dengan kader yang sempat ingin berhenti pagi tadi mendapat waktu." }],
    },
    babak,
    situasi,
    dimensi,
    potret,
    dukungan,
    ruangTumbuh,
    langkah,
  };
}

export type KontenKursiKetua = ReturnType<typeof kontenKursiKetua>;
export const NAMA_POTRET = Object.values(potret).map((item) => item.nama);
