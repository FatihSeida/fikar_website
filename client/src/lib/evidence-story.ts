export type EvidenceScene = {
  label: string;
  era: string;
  chapter: string;
  title: string;
  body: string;
  bodySecondary?: string;
  bridge: string;
  image: string;
  position: string;
  symbol: string;
};

export type HistoryMoment = {
  years: string;
  title: string;
  body: string;
  image: string;
  focus: string;
  focusX: number;
  focusY: number;
  zoom: number;
  panX: number;
  panY: number;
};

/** Enam adegan sejarah yang menjadi rekonstruksi visual bab pertama pada mobile. */
export const historyMoments: readonly HistoryMoment[] = [
  {
    years: "1947–1949",
    title: "Dari ruang kuliah menuju republik yang dipertahankan.",
    body: "Pada tahun-tahun awalnya, HMI tumbuh di tengah Revolusi Kemerdekaan. Kader dan mahasiswa membantu perjuangan sebagai penghubung, tenaga penerangan, relawan, serta anggota Corps Mahasiswa ketika Agresi Militer Belanda dan Peristiwa Madiun menguji Republik.",
    image: "hmi-1947-1949",
    focus: "Relawan mahasiswa meninggalkan ruang belajar untuk membantu perjuangan Republik",
    focusX: 70,
    focusY: 43,
    zoom: 1.75,
    panX: -2,
    panY: -3,
  },
  {
    years: "1950–1963",
    title: "Organisasi dibangun di tengah pertarungan gagasan.",
    body: "Sesudah pengakuan kedaulatan, HMI memperluas cabang, menyusun metode training, menerbitkan media, dan menegaskan independensinya. Proses itu berlangsung ketika arus Islam, nasionalisme, dan komunisme berkompetisi menentukan arah kehidupan nasional.",
    image: "hmi-1950-1963",
    focus: "Kader berdiskusi, mencetak media, dan menghubungkan cabang-cabang HMI",
    focusX: 58,
    focusY: 54,
    zoom: 1.68,
    panX: 2,
    panY: -2,
  },
  {
    years: "1964–1965",
    title: "Ketika eksistensi HMI hendak diakhiri.",
    body: "Kampanye pembubaran HMI bergerak terbuka melalui PKI, CGMI, dan kelompok-kelompok sekutunya. Di tengah tekanan itu, HMI bertahan bersama solidaritas pemuda dan mahasiswa Islam yang berhimpun dalam pembelaan terhadap keberadaan organisasi.",
    image: "hmi-1964-1965",
    focus: "Kader HMI bertahan di tengah arus kampanye pembubaran organisasi",
    focusX: 46,
    focusY: 46,
    zoom: 1.66,
    panX: -2,
    panY: -3,
  },
  {
    years: "1965–1968",
    title: "Gerakan mahasiswa memasuki ruang politik nasional.",
    body: "Sesudah G30S 1965, kader HMI ikut membentuk Kesatuan Aksi Mahasiswa Indonesia. Gelombang Angkatan '66 dan Tritura membawa mahasiswa ke jalan, sekaligus menempatkan mereka di tengah peralihan kekuasaan dari Orde Lama menuju Orde Baru.",
    image: "hmi-1965-1968",
    focus: "Mahasiswa menyuarakan Tritura melalui mimbar jalanan dan gerak massa",
    focusX: 24,
    focusY: 48,
    zoom: 1.72,
    panX: 3,
    panY: -3,
  },
  {
    years: "1970–1986",
    title: "Pembaruan pemikiran berhadapan dengan politik penyeragaman.",
    body: "Pembaruan pemikiran Islam memperoleh ruang di lingkungan HMI, sementara kekuasaan Orde Baru semakin terkonsolidasi. Undang-Undang Nomor 8 Tahun 1985 dan Kongres HMI ke-16 di Padang pada 1986 membawa perdebatan asas organisasi ke titik penentuan.",
    image: "hmi-1970-1986",
    focus: "Delegasi HMI berdebat di bawah tekanan kebijakan Asas Tunggal Pancasila",
    focusX: 60,
    focusY: 48,
    zoom: 1.68,
    panX: -2,
    panY: -2,
  },
  {
    years: "1986–1998",
    title: "Satu tradisi kader, dua jalan organisasi.",
    body: "Keputusan Kongres Padang melahirkan HMI DIPO yang menerima penyesuaian asas dan HMI MPO yang menolaknya. Keduanya menempuh ruang gerak berbeda di bawah tekanan Orde Baru hingga gelombang Reformasi membuka babak politik yang baru.",
    image: "hmi-1986-1998",
    focus: "Jalan organisasi terbelah sebelum kembali menuju gelombang Reformasi",
    focusX: 67,
    focusY: 44,
    zoom: 1.72,
    panX: 2,
    panY: -3,
  },
] as const;

/** Narasi HMI Evidence berfokus pada tata kelola perkaderan berbasis bukti. */
export const evidenceStory: readonly EvidenceScene[] = [
  {
    label: "HMI dari masa ke masa",
    era: "1947 sampai Reformasi",
    chapter: "Pergulatan berubah, ikhtiar berlanjut",
    title: "HMI bergerak dari masa ke masa dengan dinamikanya. Apakah pergulatannya tetap sama?",
    body: "Sejak kelahirannya, HMI mengalami pergulatan ideologi, organisasi, dan kaderisasi. Bentuk tantangannya berubah, tetapi setiap zaman selalu menuntut kader membaca keadaan dan menentukan sikap.",
    bodySecondary: "Pergulatan masa lalu mungkin tidak kembali dalam bentuk yang sama. Untuk menjaga eksistensinya, HMI merutinkan aktivitas dan menerjemahkan karisma pendirinya, Lafran Pane, menjadi kerja sehari-hari yang dilanjutkan oleh kader.",
    bridge: "Namun, keberlangsungan struktur belum selalu berarti organisasi memahami perjalanan kadernya.",
    image: "01-indonesia",
    position: "50% 50%",
    symbol: "1947",
  },
  {
    label: "Perjalanan kader",
    era: "Selepas Latihan Kader",
    chapter: "Nama tercatat, perjalanan diabaikan",
    title: "Nama kader tercatat, belum tentu perjalanannya diperhatikan.",
    body: "HMI dapat mengetahui siapa yang telah mengikuti Latihan Kader. Tetapi organisasi belum tentu mengetahui siapa yang tetap aktif, siapa yang berhenti, kompetensi apa yang berkembang, mengapa prosesnya terputus, dan dukungan apa yang mereka perlukan.",
    bridge: "Jumlah peserta memberi angka. Perjalanan kader memberi makna yang dibutuhkan untuk membina.",
    image: "02-kelahiran-hmi",
    position: "58% 50%",
    symbol: "Kader",
  },
  {
    label: "Data dan pengetahuan",
    era: "Komisariat sampai PB",
    chapter: "Notulensi dan dokumentasi belum terhubung",
    title: "Data ada di banyak tempat, tetapi tidak terkelola. Produksi data akhirnya menuju kesia-siaan.",
    body: "Komisariat, Cabang, Badko, dan Pengurus Besar dapat memiliki notulensi dan dokumentasi organisasi, tetapi mengelolanya melalui alur yang berbeda serta membaca peristiwa dengan tindak lanjut yang berbeda. Data dihasilkan di banyak tempat, tetapi belum digunakan seutuhnya sehingga tidak menjadi insight bagi organisasi.",
    bridge: "Definisi, data, dan insight perlu dikelola agar transisi kepemimpinan dapat berkelanjutan.",
    image: "01-indonesia",
    position: "52% 50%",
    symbol: "Data",
  },
  {
    label: "Ruang keputusan",
    era: "Rapat Bidang sampai Pleno",
    chapter: "Ketika asumsi menjadi dasar",
    title: "Program disusun. Student Needs dan Student Interest bisa jadi tidak tersentuh.",
    body: "Ketika perjalanan kader tidak terbaca, Rapat Bidang menyusun kegiatan, Rapat Presidium menentukan langkah, Rapat Harian menelaah pelaksanaan, dan Pleno mengevaluasi organisasi dengan pengetahuan yang tidak utuh. Program akhirnya sedikit demi sedikit memiliki jalan yang berbeda antara visi kepengurusan dan misi organisasi.",
    bridge: "HMI pun berisiko menawarkan jawaban lama kepada mahasiswa yang menghadapi persoalan baru.",
    image: "03-perubahan-zaman",
    position: "65% 50%",
    symbol: "?",
  },
  {
    label: "Energi organisasi",
    era: "Di tengah dinamika internal",
    chapter: "Yang lebih mudah dipetakan",
    title: "Peta dukungan terlihat lebih jelas daripada perjalanan kader.",
    body: "Menjelang Rapat Anggota Komisariat, Konferensi Cabang, Musyawarah Daerah, atau Kongres, dukungan dan delegasi dapat dipetakan dengan cermat. Namun, organisasi belum tentu mengetahui komisariat mana yang kehilangan kader setelah latihan atau cabang mana yang membutuhkan penguatan pembinaan.",
    bridge: "Ketika energi lebih banyak terserap ke dalam, jarak dengan persoalan mahasiswa dan masyarakat semakin melebar.",
    image: "04-lingkaran-organisasi",
    position: "53% 50%",
    symbol: "HMI",
  },
  {
    label: "Ekosistem berbasis bukti",
    era: "HMI Evidence",
    chapter: "Pengalaman menjadi dasar keputusan",
    title: "Menghadirkan pengalaman kader ke dalam keputusan organisasi.",
    body: "Melalui ekosistem perkaderan berbasis bukti atau evidence-based, Komisariat mengenali perjalanan kader dan tindak lanjutnya. Cabang membaca pola antarkomisariat. Badko menghubungkan pengalaman antarcabang. Pengurus Besar mengolah pola nasional menjadi arah kebijakan, pedoman, dan dukungan perkaderan.",
    bodySecondary: "Ekosistem ini mengikhtiarkan tata kelola data yang menghadirkan bukti seterang cahaya. Pengambilan keputusan tidak lagi bertumpu pada asumsi atau emosi, tetapi pada bukti yang dapat diperiksa bersama.",
    bridge: "Bukti bukan alat untuk membuat peringkat, melainkan cara menemukan titik yang perlu didukung, dipelajari, dan diperbaiki.",
    image: "05-berbasis-bukti",
    position: "62% 50%",
    symbol: "Bukti",
  },
] as const;

export const storyImage = (name: string) => name.startsWith("history/")
  ? `/scrollytelling/${name}.webp`
  : `/scrollytelling/hmi-evidence-${name}-v1.webp`;

export const historyImage = (name: string) => `/scrollytelling/history/${name}.webp`;
