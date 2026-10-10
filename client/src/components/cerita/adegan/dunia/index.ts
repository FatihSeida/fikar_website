import type { DaftarAdegan } from "../../kontrak";
import Adegan1947 from "./Adegan1947";
import AdeganPerahu from "./AdeganPerahu";
import AdeganKarangBaru from "./AdeganKarangBaru";
import AdeganTeknologi from "./AdeganTeknologi";
import AdeganJejakHmi from "./AdeganJejakHmi";
import AdeganDuaWajah from "./AdeganDuaWajah";
import AdeganModal from "./AdeganModal";
import Adegan2045 from "./Adegan2045";
import AdeganMendayung from "./AdeganMendayung";
import AdeganGoInternational from "./AdeganGoInternational";

/** Adegan Series 1 (Kaderisasi Go International). Kunci sama dengan `adegan` di isi cerita. */
export const adeganDunia: DaftarAdegan = {
  "dunia-1947": { jenis: "3d", Komponen: Adegan1947, alt: "Perahu kecil berlayar di laut malam di antara dua karang besar, lambang Indonesia yang harus mendayung di antara Amerika Serikat dan Uni Soviet." },
  "dunia-perahu": { jenis: "3d", Komponen: AdeganPerahu, alt: "Empat pendayung di satu perahu. Mula-mula dayungnya tidak seirama sehingga perahu berputar, lalu makin seirama dan perahu melaju melewati penanda 1948, 1955, dan 1961." },
  "dunia-karang-baru": { jenis: "3d", Komponen: AdeganKarangBaru, alt: "Bola dunia. Dua karang lama memudar, lalu titik panas menyala di Timur Tengah, Ukraina, Amerika, dan Tiongkok, disusul simpul teknologi: cip, AI, data, dan energi." },
  "dunia-teknologi": { jenis: "2d", Komponen: AdeganTeknologi, alt: "Enam kepingan, yaitu cip, AI, data, energi, orang, dan tata kelola, mula-mula berserakan lalu bergerak bersama dan menyatu menjadi satu lingkaran utuh." },
  "dunia-jejak-hmi": { jenis: "2d", Komponen: AdeganJejakHmi, alt: "Linimasa bergelombang dari 1947, tuntutan pembubaran 1960-an, sampai NDP. Di bawahnya tiga lingkaran, keislaman, kemodernan, dan keindonesiaan, saling mendekat dan bertemu di tengah." },
  "dunia-dua-wajah": { jenis: "2d", Komponen: AdeganDuaWajah, alt: "Sebuah rumah retak di tengah pada 1980-an. Retaknya tetap terlihat, tetapi rumah tetap berdiri, lalu jendelanya menyala dan cahayanya menyebar ke banyak tempat." },
  "dunia-modal": { jenis: "2d", Komponen: AdeganModal, alt: "Energi mengalir dari satu sumber, modal HMI. Aliran tebal habis berputar-putar di perebutan posisi, dualisme, dan faksi; aliran tipis sampai ke kaderisasi, tata kelola, dan digital." },
  "dunia-2045": { jenis: "2d", Komponen: Adegan2045, alt: "Linimasa 2026 sampai 2047. Sosok kader berjalan dan tumbuh dari usia 19 tahun menjadi 38 tahun pada 2045, saat Indonesia berusia seratus tahun, lalu HMI berusia seratus tahun pada 2047." },
  "dunia-mendayung": { jenis: "3d", Komponen: AdeganMendayung, alt: "Perahu dengan enam pendayung. Separuh awak mendayung berlawanan sehingga perahu berputar di tempat, lalu mereka berbalik, mendayung seirama, dan perahu maju ke arah fajar 2045." },
  "dunia-go-international": { jenis: "3d", Komponen: AdeganGoInternational, alt: "Bola dunia. Busur cahaya berangkat dari Indonesia ke kampus, pusat riset, dan lembaga dunia, lalu busur emas kembali pulang dan Indonesia makin terang." },
};
