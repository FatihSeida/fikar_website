# benda: medan dan perabot

Pustaka benda bagian B. Ada dua berkas, keduanya diekspor lewat `../../kit/index.js`:

- `kit/benda/medan.js` berisi medan dan struktur: jalan dan lantai, jembatan dan sambungan, tanaman dan bola dunia, aliran dan wadah, serta lapisan. Katalognya `DAFTAR_MEDAN`.
- `kit/benda/perabot.js` berisi perabot dan perlengkapan: meja dan kursi, penyimpanan, papan dan layar, tanda dan lampu, serta perlengkapan lain. Katalognya `DAFTAR_PERABOT`.

Semua pembuat mengikuti KONTRAK bagian 5, yaitu `nama(opsi = {})` yang mengembalikan `THREE.Group`. Titik asalnya di tengah alas pada y = 0. `userData` berisi `{ nama, penting, bagian, ... }`, warnanya dari `W`, dan bahannya milik tiap instans. Semua teks dibuat dengan `label3D`. Bangun benda **sesudah** `buatVideo()`.

## Contoh

```js
import {
  buatVideo, formatIndikator, titik, halus, rentang, setelKeadaan, muncul, klikEmas, denyutCermin, catat,
  jalanUbin, tanggaJenjang, lemari, folderBersama, wadahKaca, lentera, banKonveyor,
} from "../../kit/index.js";

const v = buatVideo({ format: formatIndikator({ /* … */ }) });
const jalan = v.tambah(jalanUbin({ titik: [titik(-2.6, -2.6), titik(-0.4, -0.2), titik(1.8, 1.6)], jumlah: 9 }));
const tangga = v.tambah(tanggaJenjang());               // label LK 1..3 ikut muncul bersama tangga
tangga.position.copy(titik(4.2, -0.4));
const folder = v.tambah(folderBersama());
folder.position.copy(titik(2.8, -1.8));
const wadah = v.tambah(wadahKaca({ label: "KARYA", isi: 0.2 }));
const lampu = v.tambah(lentera());
lampu.position.copy(titik(0, 1, 2.75));                 // pusat bola pada y 3.0

muncul([jalan, tangga, folder, wadah, lampu], { t: 0.6 });
denyutCermin(folder, { mulai: 7.0, selesai: 11.8 });
klikEmas(folder.userData.bagian.laci[2], { t: 14.6 });  // hanya laci LAPORAN
catat({ t: 13.2, jenis: "laci-buka", durasi: 0.4, posisi: folder });

v.setiapFrame((t) => {                                   // setiap frame, tanpa syarat
  folder.userData.aturLaci(2, halus(rentang(t, 13.2, 13.6)) - halus(rentang(t, 14.2, 14.6)));
  wadah.userData.aturIsi(0.2 + 1.0 * halus(rentang(t, 15.2, 17.6)));
  setelKeadaan(lampu, "nyala", 0.9 * halus(rentang(t, 15.6, 16.0)));
});
```

## Aturan umum

- **Sisi depan.** Sisi depan benda adalah +z lokal, yang menghadap kiri bawah layar dan terkena matahari.
- **Menghadap kamera.** Papan, layar, jam, bendera, dan panji punya `hadap: true` (bawaan), sehingga grupnya diputar 45° dan mukanya menghadap kamera. Putar ulang grup itu bila adegan butuh arah lain.
- **Benda antartitik.** `jalan`, `lintasan`, `jembatanTabung`, `panahGaris`, `garisPutus`, dan `talang` dibangun dari titik lokal. Biarkan grupnya di titik asal dunia supaya titik lokal sama dengan titik dunia. Grupnya juga boleh dipindah sebagai satu kesatuan.
- **Penyetel.** Bagian yang bergerak tidak bergantung pada waktu, jadi benda menyediakan penyetel di `userData`, misalnya `aturLaci`, `aturPintu`, `aturIsi`, `aturGeser`, dan `aturJarum`. Panggil penyetel dari `v.setiapFrame` dengan nilai turunan `t`, **setiap frame dan tanpa syarat**, supaya lompat waktu tetap persis.
- **Keadaan baku.** `emas`, `nyala`, `denyut`, `abu`, dan `pudar` bekerja pada semua benda lewat `setelKeadaan` atau gerak kit. Sasarannya diatur lewat `bagian.emas`, `bagian.denyut`, dan `bagian.tepi` milik tiap benda:
  - `emas` hanya mengenai bagian hasil. Contohnya laci, binder, buku besar, dan permukaan baru, bukan seluruh lemari.
  - `bagian.tepi` selalu diisi sendiri oleh benda, kadang kosong (`cincin`, `panahGaris`, `kerucutSorot`, `garisPutus`). Tepi itu tersembunyi sampai keadaan `denyut` naik, dan kit tidak perlu membuatnya otomatis dari kotak tiap mesh.
  - Bagian yang diatur satu per satu punya bahannya sendiri. Contohnya `tanggaJenjang.bagian.anak[i]`, `jalan.bagian.ubin[i]`, `lantaiUbin.bagian.ubin[k]`, `folderBersama.bagian.laci[i]`, `lemari.bagian.pintu[i]`, `rakBuku.bagian.buku[i]`, `layarPapar.bagian.ikon[i]`, dan piala di dalam lemari. Jadi `setelKeadaan(folder.userData.bagian.laci[2], "emas", 1)` hanya mengenai satu laci.
- **Nama bagian berulang.** Bagian yang biasa digerakkan satu per satu punya `userData.nama` bernomor mulai 1, sehingga laporan bunyi menulis `ubin 3` atau `laci 2`, bukan `benda-3`: `ubin` (`jalanUbin`, `persimpangan`, `lantaiUbin`), `anak tangga`, `penanda` (`garisWaktu`), `daun` (`tunas`), `titik` (`bolaDunia`), `buku` dan `buku besar` (`rakBuku`), `map` (`lemari`), `laci` (`folderBersama`). Nomor 1 = indeks 0, jadi `bagian.laci[2]` bernama `laci 3`.
- **Keadaan khusus.** `simpul` punya `"sambung"`, sedangkan `lentera` dan `lampuGagasan` memakai ulang `"nyala"` sebagai kuat cahaya (lihat tabel). `garisPutus` dan rangka `bolaDunia` adalah garis, jadi keadaannya ditangani sendiri. `abu`, `pudar`, dan `emas` menggeser warnanya, sedangkan `denyut` menebalkan garis.
- **Bloom.** Emissive bawaan semua benda adalah 0, dan hanya emas yang melewati ambang 0.74. Ini sudah diuji dengan membandingkan render ber-bloom dan tanpa bloom: semua benda dalam keadaan diam, ditambah denyut, nyala zamrud 1.4, layar, noda, dan sorot, mengubah 0 piksel. Dua aturan menjaga hal ini:
  - **Kertas.** Kertas polos pada muka yang menghadap matahari sedikit melewati ambang. Karena itu warna kertas bawaan benda padat di sini adalah `0.9 × W.kertas` (linear), yang nyaris tidak berbeda di mata. Bila memberi `warna: W.kertas` sendiri, sisi yang menghadap matahari bisa sedikit berpendar.
  - **Denyut pada benda terang.** Pada kertas, krem, atau pion, emissive denyut (zamrudPijar 0.5) ikut melewati ambang. Benda terang (`kotakCelah`, `papanJembatan`, `kue`, `pita`, `piala`) karena itu hanya berdenyut lewat garis tepinya.
- **Label.** Semua label dibuat lewat `label3D`, dikembalikan di `userData.label`, dan ikut memudar bersama bendanya. Teksnya bisa diganti dengan `gantiLabel(label, { t, teks })`. Opsi `label: false` meniadakan label, dan `opsiLabel` diteruskan ke `label3D` (`gaya`, `masuk`, `keluar`, `skala`, …). Ukuran label tetap dalam piksel, jadi label panjang pada papan sempit perlu `opsiLabel: { skala }` atau papan yang lebih lebar.
- **Nama `jalanUbin`.** Pembuat jalan ubin bernama `jalanUbin`, karena `jalan` adalah gerak berjalan di `kit/index.js`.

## medan.js

### Jalan dan lantai

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `ubinJalan()` | kotak 0.9 × 0.06 × 0.9, warna hsl(153, 30%, 16%), yaitu turunan zamrudRedup | `bagian.ubin` |
| `jalanUbin({ titik, jumlah, jarak, lengkung = true, pas = true, celah = 0.1 })` | ubin di sepanjang kurva CatmullRom lewat `titik`. `jumlah` saja berarti ubin rata dari ujung ke ujung. `jarak` saja (bawaan 1) berarti deret ubin di tengah kurva. `pas` memendekkan ubin bila jarak kurang dari dalam ubin + celah. Tinggi ubin berselang 0.004, jadi tidak ada z-fighting di tikungan | `kurva`, `panjang`, `jarak`, `titikUbin[]` (pusat atas tiap ubin), `pada(u)`; `bagian.ubin[]`, dan tiap ubin punya bahannya sendiri |
| `persimpangan({ lengan = 3, jarak = 1, arah, pusat = 1.0 })` | ubin pusat dengan lengan ke ±x dan ±z dunia, yaitu empat arah diagonal layar | `ujung[i]` (titik lokal sesudah ubin terakhir); `bagian.pusat`, `bagian.lengan[i][]`, `bagian.ubin[]` |
| `lintasan({ dari, ke, jumlah = 7, rel = true })` | ubin lurus dengan dua rel tipis dan garis mulai (zamrudRedup) | `titikUbin[]` (kartu yang maju satu ubin), `pada(u)`; `bagian.ubin`, `bagian.rel` |
| `tanggaJenjang({ lebar = 1.2, dalam = 0.9, tinggi = [0.4, 0.8, 1.2], label = ["LK 1", "LK 2", "LK 3"] })` | naik ke kanan atas layar. Muka tegak tiap anak tangga menghadap kiri bawah dan terang, dan profil tangga terlihat di sisi kanan | `puncak[i]`, `label[i]`; `bagian.anak[i]` |
| `garisWaktu({ panjang = 9, jarak = 2.25, label = PERIODE 1..4, sejajarLayar = true, panah = true })` | pita pelat bertepi zamrudRedup dengan ujung panah, dan tiang penanda zamrud 0.08 × 0.5 di awal tiap periode. Grupnya diputar 45° supaya memanjang ke kanan layar | `titikPeriode(i)`, `label[i]`, `geserPenanda(s)` (tiang dan labelnya bergeser ke kiri lalu memudar di ujung pita); `bagian.penanda[]` |
| `blokTanah({ lebar = 5, tinggi = 0.3, dalam = 6, sisiCelah, patah, amplitudo, benih })` | tanah pelat bertepi atas zamrudRedup. `sisiCelah` (`"kiri"`, `"kanan"`, `"depan"`, `"belakang"`) membatasi tepi denyut ke sisi celah. `patah` membuat sisi itu bergerigi | `tinggiAtas`; `bagian.lantai` |
| `lantaiUbin({ n = 7, ukuran = 0.95, tinggi = 0.08, jarak = 1 })` | 7 × 7 ubin zamrudRedup berpusat di titik asal. i adalah kolom (x) dan j adalah baris (z) | `aturNoda(i, j, k)`: bercak hsl(153, 10%, 12%) dan ubin menuju abuGelap. `aturSemuaNoda((i, j) => k)`, `tingkatNoda(i, j)`, `jarakDari(i0, j0, i, j)` (cincin Chebyshev untuk pola menjalar), `aturPagar(i, j, k)` (bingkai zamrudPijar turun dan tampak), `ubinDi(i, j)`, `titikUbin(i, j)`; `bagian.ubin[j*n+i]`, `bagian.noda[]`, `bagian.pagar`. Bagian emas adalah batang pagar |
| `petakTanah({ lebar = 1.2, tinggi = 0.2, dalam = 1.2, alur = 3 })` | petak uji hsl(153, 30%, 14%) dengan tiga alur | `tinggiAtas` (letakkan `tunas` di sini) |
| `genangan({ radius = 1.2, benih })` | cakram tak beraturan hsl(153, 15%, 18%) dengan bibir zamrudRedup. Tepi denyutnya mengikuti bibir | `aturUkuran(r)` (mis. 1.2 → 0.6) |

### Jembatan dan sambungan

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `jembatanTabung({ dari, ke, radius = 0.06, retak = false, celah = 0.3 })` | tabung zamrudRedup. Bila retak, tabungnya terdiri dari dua potongan dengan celah, dan tiap ujung patahan diberi cincin retak bergerigi tipis. Denyut: permukaan tabung menyala, ditambah garis tepi zamrudPijar 3 px di kedua siluet tabung (untuk kamera kit), cincin di kedua ujung luar, dan cincin di kedua ujung patahan selama retak. Garis itu tersembunyi di luar denyut | `aturRetak(k)` (0 utuh, 1 celah penuh), `radius`, `jalur` [dari, ke] = sumbu tabung. Bola `aliran` (r 0.07) di sumbu hampir seluruhnya tenggelam di tabung r 0.06; untuk aliran di atas tabung, angkat jalurnya `radius + 0.06` (Dunia Jenjang: `d.jalur(...)` sudah terangkat). `bagian.tabung[]`, `bagian.retak[]`, `bagian.tepi[]` |
| `papanJembatan({ lebar = 0.9, tinggi = 0.08, dalam = 0.5 })` | papan kertas dengan dua alur | |
| `simpul({ radius = 0.3, alasR = 0.35, alasT = 0.15, tersambung = 0 })` | bola di atas alas pelat. Saat lepas berwarna abu, saat tersambung berwarna zamrud | keadaan `"sambung"` 0..1 atau `aturSambung(k)`, `titikSambung` (pusat bola) |
| `pin({ tinggi = 0.6, radius = 0.15 })` | penanda peta zamrud yang titik asalnya di ujung bawah | `puncak` |
| `panahGaris({ titik, lengkung, tebal = 0.035, kepala, warna = zamrudPijar })` | tabung dengan kepala kerucut. Warna `W.abu` cocok untuk panah satu arah yang kusam | `aturTampak(k)` (tergambar dari pangkal, kepala mengikuti), `kurva`; `bagian.batang`, `bagian.ujung` |
| `garisPutus({ titik \| lingkaran: r \| persegi: [w, d], putus = 0.18, sela = 0.12, lebar = 3, warna = zamrudPijar })` | garis putus dengan lebar tetap dalam piksel, berupa jalur, lingkaran di tanah, atau persegi di tanah | `aturTampak(k)`, `geser(s)` (ruas berjalan di sepanjang garis); `bagian.garis` |

### Tanaman, bola dunia, dan peta

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `tunas({ tinggi = 0.7, radius = 0.04, daun = 2, tumbuh = 1 })` | batang dan dua daun pipih zamrud, dengan kuncup di pucuk | `aturTumbuh(k)`: batang memanjang lalu daun membuka berurutan; `bagian.batang`, `bagian.daun[]`, `bagian.kuncup` |
| `bolaDunia({ radius = 1.4, lintang, bujur = 12, titik = [[bujur, lintang], ...], isi = true, miring = 23.4 })` | garis lintang dan bujur zamrudRedup di atas bola pelat, sehingga garis belakangnya tertutup. Titik asalnya di bawah bola | `aturPutar(sudut)`, `aturTitik(i, k)`, `arahBola(lon, lat)`, `pusat`; `bagian.putar` (grup yang berputar, juga bisa digerakkan dengan gerak `putar`), `bagian.titik[]` |
| `petaLokal({ lebar = 2.4, tebal = 0.06, dalam = 2.4, benih })` | pelat zamrudRedup dengan jalan kertas, blok kecil, dan satu blok kampus | `bagian.jalan[]`, `bagian.blok[]` |

### Aliran dan wadah

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `banKonveyor({ panjang = 12, lebar = 2, tinggi = 0.3, periode = 0.6 })` | ban di sepanjang x lokal, dari kiri atas ke kanan bawah layar, dengan permukaan bergaris CanvasTexture dan rel zamrudRedup | `aturGeser(s)`: pola bergeser s unit ke +x, mis. `aturGeser(3 * t)`. `pada(s)`, `tinggiAtas`; `bagian.ban`, `bagian.rel` |
| `corong({ radiusAtas = 0.6, radiusBawah = 0.12, tinggi = 0.8, leher = 0.3, kaki = 0 })` | corong bubutan berdinding. `kaki > 0` menambah tiga kaki dari tanah | `mulut`, `keluar` |
| `talang({ titik, radius = 0.15, tebal = 0.03, lengkung = true })` | setengah pipa di sepanjang titik. Titik yang diberikan adalah garis bibir talang | `pada(u)` (dasar talang), `jalurAliran(n)` (titik untuk `aliran`), `kurva` |
| `wadahKaca({ radius = 0.8, tinggi = 2.0, isi = 0, label })` | silinder kaca dengan bibir dan garis siluet zamrudPijar, isi zamrud, dan alas pelat | `aturIsi(h)` dalam unit dunia (mis. 0.3 → 1.8), `mulut`, `label`; `bagian.kaca`, `bagian.isi` |
| `kerucutSorot({ tinggi = 4, radiusBawah = 1.2, opasitas = 0.12, kolam = true })` | kerucut krem transparan yang memudar ke lantai, dengan genangan cahaya di tanah. Titik asalnya di pusat cahaya di tanah. `penting: false` | `bagian.kerucut`, `bagian.kolam` |

### Lapisan

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `cincin({ radius = 1.0, tebal = 0.03, warna = zamrudPijar })` | torus mendatar di tanah | `aturRadius(r)` mengubah radius tanpa menebalkan tabung (untuk gema). Pudarkan dengan `aturOpasitas` |
| `lapisanDebu(sasaran, { jumlah = 140, benih, ukuran, arah = atas, ambang = 0.55, bagian, opasitas = 0.75, kadar = 1, induk })` | bintik abu berbenih di segitiga yang menghadap `arah`. `bagian` membatasi mesh yang ditaburi. `induk` dipakai untuk bagian yang bergerak | mengembalikan InstancedMesh dan memasang `sasaran.userData.aturDebu(k)` serta `bagian.debu` |

## perabot.js

### Meja dan kursi

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `mejaBundar({ radius = 1.3, tebal = 0.1, kakiR = 0.2, kakiT = 0.65 })` | zamrudRedup dengan alas kaki pelat | `tinggiAtas` 0.75; `bagian.daun` |
| `mejaKotak({ lebar = 2.4, tinggi = 0.8, dalam = 1.2, padat })` | daun dan empat kaki. `padat: true` membuatnya satu kotak utuh | `tinggiAtas` |
| `mejaKecil({ lebar = 1.0, tinggi = 0.6, dalam = 0.6 })` | sama dengan `mejaKotak` | `tinggiAtas` |
| `kursiKotak({ lebar = 0.4, tinggiDuduk = 0.42, sandaran = 0.4, tepi = true })` | dudukan, sandaran di −z, dan empat kaki, berwarna pelat. Tepi zamrudRedup membuat kursi pelat terbaca di atas tanah | `titikDuduk` |
| `kursiRendah({ radius = 0.25, tinggi = 0.3 })` | bangku bubutan zamrudRedup | `titikDuduk` |

### Penyimpanan

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `rakBuku({ lebar = 3, tinggi = 2.6, dalam = 0.6, rak = 4, buku = 40, benih, bukuBesar = 0, rakBesar = 2, debu, kosong })` | rangka gelap dengan ±40 buku berbenih (sebagian berpita, kadang satu condong). `bukuBesar` menaruh buku 0.25 × 0.6 × 0.5 hsl(42, 20%, 40%) di rak `rakBesar` (0 = bawah) | `aturDebu(k)` bila `debu`, `lantaiRak[]`; `bagian.buku[]`, `bagian.bukuBesar[]`, `bagian.rak[]`. Emas mengenai buku besar, atau semua buku bila tidak ada buku besar |
| `rakKecil({ lebar = 1.2, tinggi = 1.2, dalam = 0.4, rak = 2 })` | rak terbuka yang kosong | `titikRak(i)` |
| `lemari({ isi = "map" \| "kusam" \| "piala" \| "kosong", kaca, buka, label })` | lemari sekretariat 1.8 × 2.5 × 0.78 dengan dua pintu berengsel, tiga ruang, dan pelat nama. `kaca: true` membuat pintunya kaca berbingkai, dengan isi bawaan tiga piala | `aturPintu(k, kKanan = k)` (0 tertutup, 1 terbuka 100°), `lantaiRuang[]`, `label`; `bagian.pintu[]` (grup engsel), `bagian.map[]`, `bagian.piala[]`, `bagian.rak[]`. Denyut menyalakan tepi tiap ruang |
| `folderBersama({ laci = 4, label = NOTULENSI, KEPUTUSAN, LAPORAN, DOKUMENTASI, sisiLabel = "kiri", buka = [] })` | lemari kecil 1.4 × 1.6 × 1.0. Tiap laci punya muka, gagang, plakat, baki terbuka, dan tiga lembar kertas. Label menempel di sisi badan, jadi tidak ikut bergeser saat laci terbuka | `aturLaci(i, k)` (laci 0 di atas; 1 = tertarik 0.55 × dalam), `titikLaci(i)` (tujuan dokumen), `label[i]`; `bagian.laci[i]` (grup yang bisa diberi emas sendiri) |
| `kotakCelah({ lebar = 0.7, tinggi = 0.6, dalam = 0.7, warna = kertas, celah, debu, label })` | kotak dengan celah gelap di atasnya, dipakai sebagai kotak pertanyaan, atau sebagai kotak usulan dengan `warna: W.pelat, debu: true` | `titikCelah`, `aturDebu(k)` |

### Papan dan layar

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `papanTulis({ lebar = 4.0, tinggi = 2.6, kaki = 1.0, kolom, baris, kolomLabel = 0.55, debu, permukaanBaru })` | rangka zamrudRedup dengan permukaan hsl(153, 25%, 18%). `kaki: 0` membuatnya papan dinding. `kolom` dan `baris` menerima array label atau angka. Mode tabel (`kolom` diisi dan `baris` berupa daftar label): label memakai gaya mikro, ikut skala kamera, dikecilkan sampai muat di selnya, dan lebar kolom label baris mengikuti label terpanjang | `titikSel(c, r)`, `label.kolom[]`, `label.baris[]`, `aturUsap(k)` (permukaan pengganti tumbuh dari kiri), `aturDebu(k)`; `bagian.permukaan`, `bagian.baru`. Emas mengenai permukaan baru bila ada |
| `layarKanal({ lebar = 2.4, tinggi = 1.6, kaki = 0.9, resolusi = [480, 320], isi, terang = 0.8, label })` | layar berdiri. Permukaannya CanvasTexture tanpa cahaya, dengan kecerahan `terang` supaya tetap di bawah ambang bloom | `gambar((ctx, w, h) => …)` menggambar ulang sekarang. `setelIsi(kunci, fn)` hanya menggambar ulang bila kunci berubah, mis. `setelIsi(Math.floor(t / 0.6), POLA_LAYAR.pamflet(k))`. Juga `kanvas` dan `pusatLayar` |
| `POLA_LAYAR` | `kosong()`, `pamflet(benih)`, `artikel()`, `grafik(nilai[])`. Semuanya tanpa teks terbaca dan memakai warna token | |
| `layarPapar({ lebar = 1.8, tinggi = 1.2, kaki = 0.8 })` | panel gelap dengan tiga ikon timbul: grafik naik, ponsel, dan panah putar | `bagian.ikon[0..2]` |

### Tanda dan lampu

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `bendera({ tinggi = 1.8, kain = [0.7, 0.45] })` | tiang dengan kain segitiga zamrud | `aturKibar(fase, amp = 0.06)`, `puncak` |
| `panji({ lebar = 1.0, tinggi = 0.7, tiang = 2.2, pola = true })` | kain zamrud dengan pola tiga garis lengkung. `{ lebar: 0.6, tinggi: 0.9, tiang: 1.6 }` membuat panji tegak | `aturKibar(fase, amp)`, `aturTembus(a)` (opasitas kain, mis. 1 → 0.45); `bagian.kain[]`. Denyut mengenai tiang |
| `lentera({ radius = 0.25, tali = 1.2, nyala = 0, warnaNyala = "emas" })` | bola tergantung pada tali. Titik asalnya di bawah bola, dengan pusat di y = radius | keadaan `"nyala"` atau `aturNyala(k)`. Nilai 0 berarti padam (abuGelap), 0.4 redup, dan 0.9 menyala (emas dengan emissive emasPijar). `klikEmas` ikut menyalakannya. Juga `pusat` dan `atasTali` |
| `lampuGagasan({ radius = 0.45, tali = 0.8, warnaNyala })` | bola lampu dengan leher dan dudukan berulir. `warnaNyala: "zamrud"` membuatnya menyala zamrud di bawah ambang bloom | sama dengan `lentera` |

### Perlengkapan lain

| Pembuat | Bawaan dan opsi utama | userData, penyetel, bagian |
|---|---|---|
| `stasiunMeja({ radius = 0.72, alas = 1.2, peserta = 0, kertas = true })` | meja musyawarah di atas alas bundar. `peserta > 0` menambah pion skala 0.62 dengan `penting: false` | `titikPeserta(i, n)`, `tinggiAtas`; `bagian.peserta[]` |
| `jamDinding({ besar, radius, berdiri, tinggiPusat = 1.8, jam = 10, menit = 10 })` | muka kertas, bingkai zamrudRedup, 12 penanda, dan dua jarum. Varian `besar: true` beradius 0.7 dan berdiri di tiang. Jam dinding titik asalnya di tepi bawah | `aturJarum(jam, menit)`, `aturSudut(aJam, aMenit)`, `pusat`; `bagian.jarumPendek`, `bagian.jarumPanjang`, `bagian.bingkai`. Denyut mengenai bingkai |
| `kue({ r1 = 0.5, r2 = 0.35, lilin = true })` | dua tingkat kertas dengan pita hias zamrud | |
| `pita({ jarak = 2.4, tinggi = 1.2, lendut = 0.3 })` | dua tiang di x lokal dengan pita melendut dan simpul di tengahnya | `bagian.pita` |
| `piala({ skala = 1, warna = kertas, debu })` | kaki, mangkuk, dan dua pegangan, setinggi ±0.55. `warna: W.abu` untuk piala lama | `aturDebu(k)` bila `debu`, `puncak` |

## Katalog

`DAFTAR_MEDAN` (26 entri) dan `DAFTAR_PERABOT` (22 entri) berbentuk `{ nama, kategori: "medan" | "perabot", sub, buat, contoh }`. `sub` adalah subkelompok dari tabel di atas. Entri `lapisanDebu` membuat papan jembatan berdebu sebagai contoh.

## Bantu untuk benda baru

`bantuBenda`, dari `kit/benda/medan.js`, berisi alat yang dipakai kedua berkas. Alat ini bukan bagian kontrak dan bisa berubah:

- `geserHSL(token, ds, dl)`: warna turunan token dalam HSL sRGB.
- `kertasAman()`: kertas di bawah ambang bloom.
- `denyutAman(warna, daftar)`
- `tepiDenyut(kotak | pasanganTitik)`
- `gantiDasar(bahan, { warna, emisif, kuat })` dan `segarkan(benda)`: dipakai untuk keadaan khusus.
- `aturFaktor(bahan, f, benda)`: opasitas lapisan.
- `jangkar`, `pasangLabel`, `rampung`, `ruas`, `lingkaran`, `kurvaDari`, dan `teksturKanvas`.
- `namai(daftar, dasar)`: memberi `userData.nama` bernomor (`dasar 1`, `dasar 2`, …) pada bagian berulang.

Benda lokal video yang memakainya akan mengikuti aturan yang sama.
