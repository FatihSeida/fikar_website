/**
 * Daftar cabang HMI per Badko untuk pilihan di kuis audit komisariat.
 * Sumber: LPJ Sekretaris Jenderal PB HMI Periode 2024–2026 (Kongres HMI XXXIII).
 * Status persiapan ("Pers.") sengaja tidak ditampilkan. Badko Maluku dan
 * Papua Barat Daya belum terdata, jadi ada pilihan "Cabang lainnya".
 */
export interface BadkoCabang { badko: string; cabang: readonly string[]; }

export const badkoCabang: readonly BadkoCabang[] = [
  { badko: "Badko Aceh", cabang: ["Banda Aceh", "Lhokseumawe", "Aceh Besar", "Tapaktuan", "Langsa", "Meulaboh", "Sigli", "Takengon", "Bireun", "Blangpidie", "Kutacane", "Nagan Raya"] },
  { badko: "Badko Sumatera Utara", cabang: ["Medan", "Siantar Simalungun", "Kisaran Asahan", "Deli Serdang", "Binjai", "Langkat", "Labuhanbatu Raya", "Padang Sidimpuan", "Mandailing Natal", "Padang Lawas", "Sibolga-Tapanuli Tengah", "Dairi Phakpak Karo"] },
  { badko: "Badko Sumatera Barat", cabang: ["Padang", "Bukittinggi", "Pariaman", "Batusangkar", "Solok", "Sijunjung", "Padang Panjang", "Pesisir Selatan", "Solok Selatan", "Pasaman Barat", "Payakumbuh", "Dharmasraya", "Lubuk Sikapang"] },
  { badko: "Badko Riau-Kepulauan Riau", cabang: ["Pekanbaru", "Batam", "Tembilahan", "Rengat", "Natuna", "Dumai", "Bengkalis", "Rokan Hulu", "Tanjung Pinang-Bintan", "Rokan Hilir", "Karimun", "Bintan"] },
  { badko: "Badko Jambi", cabang: ["Jambi", "Sarolangon", "Tebo", "Batanghari", "Kerinci", "Bangko", "Tanjung Jabung Barat", "Muara Bungo", "Tanjung Jabung Timur"] },
  { badko: "Badko Sumatera Bagian Selatan", cabang: ["Palembang", "Bandar Lampung", "Metro", "Bengkulu", "Bangka Belitung", "Curup", "Kota Bumi", "Baturaja", "Lubuklinggau", "Oku Timur", "Pagar Alam", "Kalianda", "Pringsewu", "Prabumulih", "Musi Banyuasin", "Lampung Timur", "Lahat", "Ogan Hilir"] },
  { badko: "Badko Jabodetabek-Banten", cabang: ["Jakarta Pusat-Utara", "Jakarta Raya", "Jakarta Timur", "Jakarta Selatan", "Jakarta Barat", "Serang", "Ciputat", "Depok", "Bogor", "Kota Bogor", "Bekasi", "Karawang", "Cilegon", "Lebak", "Pandegelang", "Tangerang", "Kabupaten Tangerang"] },
  { badko: "Badko Jawa Barat", cabang: ["Bandung", "Kabupaten Bandung", "Jatinangor-Sumedang", "Garut", "Cirebon", "Sukabumi", "Cianjur", "Purwakarta", "Subang", "Majalengka", "Ciamis", "Kuningan", "Indramayu", "Tasikmalaya", "Kota Banjar"] },
  { badko: "Badko Jawa Tengah-DIY", cabang: ["Yogyakarta", "Sulaksumur-Sleman", "Semarang", "Surakarta", "Sukoharjo", "Purwokerto", "Pekalongan", "Salatiga", "Magelang", "Kudus", "Tegal", "Blora", "Kebumen", "Pati", "Brebes"] },
  { badko: "Badko Jawa Timur", cabang: ["Surabaya", "Malang", "Jember", "Jombang", "Ponorogo", "Bojonegoro", "Kediri", "Tulungagung", "Bangkalan", "Sumenep", "Pamekasan", "Probolinggo", "Pacitan", "Banyuwangi", "Pasuruan", "Tuban", "Bondowoso-Situbondo", "Blitar", "Mojokerto", "Sampang", "Gresik", "Lamongan", "Sidoarjo", "Kota Malang"] },
  { badko: "Badko Kalimantan Barat", cabang: ["Pontianak", "Mempawah", "Singkawang", "Sintang", "Ketapang", "Sambas", "Kuburaya"] },
  { badko: "Badko Kalimantan Selatan", cabang: ["Banjarmasin", "Banjarbaru", "Barabai", "Kandangan", "Amuntai", "Tanah Laut", "Kota Baru-Tanah Bumbu", "Tanjung"] },
  { badko: "Badko Kalimantan Timur-Utara", cabang: ["Samarinda", "Tarakan", "Balikpapan", "Kutaikartanegara", "Sangatta", "Paser", "Berau", "Tanjung Selor", "Nunukan"] },
  { badko: "Badko Kalimantan Tengah", cabang: ["Palangkaraya", "Sampit", "Kapuas", "Pangkalambun"] },
  { badko: "Badko Sulawesi Selatan", cabang: ["Makassar", "Makassar Timur", "Gowa Raya", "Palopo", "Pare-Pare", "Pinrang", "Soppeng", "Wajo", "Sidrap", "Bone", "Butta Salewangan Maros", "Bulukumba", "Jeneponto", "Pangkep", "Sinjai", "Barru", "Enrekang", "Takalar", "Bantaeng", "Luwu Utara", "Selayar"] },
  { badko: "Badko Sulawesi Tengah", cabang: ["Palu", "Poso", "Tolitoli", "Luwuk Banggai", "Buol", "Morowali"] },
  { badko: "Badko Sulawesi Tenggara", cabang: ["Kendari", "Bau-Bau", "Konawe", "Kolaka", "Kolaka Utara", "Raha", "Bombana", "Buton", "Konawe Selatan", "Wakatobi", "Kolaka Timur"] },
  { badko: "Badko Sulawesi Utara-Gorontalo", cabang: ["Manado", "Gorontalo", "Tondano", "Bolaang Mongondow Raya", "Limboto", "Puwohato", "Boalemo", "Bone Bolango"] },
  { badko: "Badko Sulawesi Barat", cabang: ["Manakarra", "Polewali Mandar", "Majene", "Mamuju Tengah", "Mamasa"] },
  { badko: "Badko Bali Nusra", cabang: ["Denpasar", "Mataram", "Kupang", "Singaraja", "Selong", "Bima", "Sumbawa", "Lombok Tengah", "Lombok Timur", "Dompu", "Sumbawa Barat", "Alor", "Ende", "Maumere", "Lombok Barat"] },
  { badko: "Badko Maluku Utara", cabang: ["Ternate", "Bacan", "Tidore"] },
  { badko: "Badko Papua", cabang: ["Merauke", "Mimika", "Fak Fak", "Biak"] },
  { badko: "Cabang Istimewa Luar Negeri", cabang: ["Istimewa Mesir", "Istimewa Turki"] },
];

export const semuaCabang: readonly string[] = badkoCabang.flatMap((item) => item.cabang);

/** Nilai pilihan untuk cabang yang belum ada di daftar; nama cabangnya diketik sendiri. */
export const CABANG_LAINNYA = "__lainnya__";
