# dunia: Kader, Jenjang, Simpul

Tiga dunia dasar seri 44 indikator, masing-masing satu berkas di `kit/dunia/`: `duniaKader` (`kader.js`), `duniaJenjang` (`jenjang.js`), dan `duniaSimpul` (`simpul.js`). Semuanya diekspor lewat `../../kit/index.js` dan terdaftar di `DAFTAR_DUNIA`.

Dunia hanya menyusun dan menempatkan benda kit. Kapan benda muncul, bergerak, berdenyut, atau menjadi emas tetap diatur adegan video (KONTRAK §7).

## Konvensi bersama

```js
const d = duniaJenjang(v, {
  tanpa: ["jembatan"],                                   // benda yang tidak dibuat (nama kelompok boleh)
  posisi: { pb: titik(3.0, 2.4) },                       // menimpa posisi
  opsi: { jembatanCabang: { retak: true } },             // diteruskan ke pembuat benda kit
  ganti: { badko: (opsi) => menaraBadko({ ...opsi, tinggi: 3.6 }) },
});
d.benda.badko;     // Object3D yang sudah ada di scene
d.urutan;          // urutan muncul yang wajar: muncul(d.urutan, { t: 0.6 })
d.fokus;           // fokus kamera bawaan: jadwalIndikator({ fokus: d.fokus, ... })
d.H;               // 16
d.titik.retak;     // titik dunia bernama (Vector3, array, atau objek berisi Vector3)
```

- **Nama kelompok.** `tanpa` dan `opsi` menerima nama kelompok yang berlaku untuk semua anggotanya, dan opsi anggota menimpa opsi kelompok (aturan yang sama dengan Pustaka dan Rencana, lewat `luaskan` di `_susun.js`). Kelompoknya: `komisariat` (komisariat1..3) dan `jembatan` (kelima jembatan) di Jenjang, `simpul` (simpul1..8) di Simpul.
- **Benda yang bergantung ikut pindah.** Ujung jalan Kader mengikuti `posisi.gerbang` dan `posisi.komisariat`. Ujung jembatan Jenjang mengikuti posisi kedua bangunannya, dan jembatan yang salah satu ujungnya ditiadakan ikut ditiadakan. Di Simpul, `posisi.komisariat` ikut memindahkan lingkaran simpul, layar, dan `d.fokus`.
- **Titik dihitung sekali** saat dunia dibuat, dari benda yang benar-benar dibuat (sesudah `posisi`, `opsi`, dan `ganti`). Bila benda dipindah sesudahnya, hitung ulang sendiri (`benda.localToWorld(...)`).
- **Jalan dan jembatan berporos di tengahnya.** Grup `jalan` (Kader) dan grup setiap jembatan (Jenjang) diletakkan di titik tengahnya, bukan di titik asal dunia. Akibatnya skala `muncul` dan lonjakan `klikEmas` berporos di tengah benda. Tanpa ini, jembatan yang diklik emas akan melompat menjauhi titik asal. Konsekuensinya, `userData.kurva`, `userData.titikUbin`, dan `userData.jalur` milik benda itu berupa titik lokal grup. Pakai `d.titik.ubin`, `d.titik.jalur`, `d.titik.jalurJembatan`, atau `d.jalur(...)`, yang semuanya titik dunia.
- **Dunia tidak menyetel keadaan.** Keadaan (`abu`, `pudar`, `lampu`, `sambung`, retak) disetel adegan setiap frame tanpa syarat, seperti biasa. Keadaan awal yang menjadi opsi pembuat bendanya (`retak` jembatan, `tersambung` simpul, `lampu` gedung) boleh diberikan lewat `opsi`.
- **Benda tambahan** dibuat sesudah dunia dengan pembuat kit biasa. Untuk muncul bersama dunia: `muncul([...d.urutan, tambahan], { t: 0.6 })`.

Semua tata letak bawaan lolos `periksaZona` pada format indikator dengan `d.fokus` dan H 16, tanpa benda penting yang bertabrakan, dan semua titik bernama jatuh di dalam zona adegan (lihat bagian Pengujian).

## duniaKader

Jalan masuk kader: gerbang kampus dan gedung kelas di kiri atas, jalan ubin yang menurun ke pintu komisariat di kanan bawah, tangga jenjang (LK 1–3) di tengah atas, dan lapangan kosong di kiri bawah.

```js
import { buatVideo, formatIndikator, jadwalIndikator, duniaKader, pion, muncul, jalan, hilang, denyutCermin, setelKeadaan } from "../../kit/index.js";

let jadwal;
const v = buatVideo({ format: formatIndikator({ /* … */ }), kamera: (t) => jadwal(t) });
const d = duniaKader(v);
jadwal = jadwalIndikator({ fokus: d.fokus, cermin: { fokus: d.titik.pintu.clone().setY(0.6), H: 12 } });
muncul(d.urutan, { t: 0.6 });
const f = v.tambah(pion());
const j = jalan(f, { t: 1.6, jalur: d.titik.jalur, lengkung: true });   // keluar gerbang, lewat jalan, ke depan pintu
if (j.selesai) hilang(f, { t: j.selesai });
denyutCermin(d.benda.komisariat, { mulai: 7.0, selesai: 11.8 });
v.setiapFrame((t) => setelKeadaan(d.benda.komisariat, "abu", 1));
```

### Benda

| Kunci | Benda kit | Letak bawaan | Catatan |
|---|---|---|---|
| `gerbang` | `gerbangKampus()` | `titik(-2.1, -0.7)`, rotasi 0 (menghadap kamera) | `label` lewat `opsi.gerbang` |
| `kelas` | `gedungKelas()` 3.0 × 2.2 × 2.0 | `titik(-2.85, -2.9)` | Di belakang gerbang |
| `jalan` | `jalanUbin({ jarak: 1 })`, 6 ubin | dari bawah gerbang, melengkung sedikit ke bawah layar, sampai depan pintu komisariat | Grup di tengah jalan (lihat Konvensi). `opsi.jalan.titik` (titik dunia) mengganti lintasannya |
| `komisariat` | `rumah()` 1.8 × 1.2 × 1.6, atap 0.7 | `titik(2.6, 2.2)` = prompt | Pintu di muka +z (kiri bawah layar), tempat jalan berakhir |
| `tangga` | `tanggaJenjang()` | `titik(1.2, -1.5)` | Label LK 1–3 ikut muncul bersama tangga |

`urutan`: gerbang, kelas, jalan, komisariat, tangga.

### Titik

Semua titik di tanah (y 0) kecuali disebut.

| Titik | Isi |
|---|---|
| `gerbang`, `depanGerbang`, `belakangGerbang` | Pusat gerbang, 1 unit di depannya (arah penonton), 1 unit di belakangnya (di dalam kampus) |
| `atasGerbang` | 0.3 di atas balok gerbang (label tahun di 01) |
| `kelas` | Pusat alas gedung kelas (figur yang berkeliling di 02) |
| `jalur` | Array titik untuk `jalan()` figur: belakang gerbang → gerbang → tiga titik di sepanjang jalan → `depanPintu`. Pakai `lengkung: true`. Panjang 5.5 unit (4.6 s pada 1.2 unit/s) |
| `jalurPendek` | Jalur "dari ujung jalan": 0.5 sebelum `depanPintu` (di jalan) → `depanPintu`. Dengan `potong` terus lewat `pintu`, bagian dalam dekat pintu depan, `dalam`, bagian dalam dekat pintu belakang, `pintuBelakang`, sampai `luarBelakang` (4.5 unit, 3.7 s). Pakai `lengkung: true`. Lihat Jalur dan waktu |
| `awalJalan`, `tengahJalan`, `ujungJalan` | Titik pada kurva jalan, di permukaan ubin |
| `ubin[i]` | Pusat atas tiap ubin (enam), dari gerbang ke komisariat |
| `komisariat` | Pusat alas komisariat |
| `pintu`, `depanPintu` | Ambang pintu, dan 0.45 di depan pintu (tujuan figur yang masuk) |
| `atap` | Puncak bubungan (panji 21 dan 34, label). Dengan `potong` (tanpa garis atap): puncak dinding belakang, y 1.68 |
| `depanKomisariat` | Alun-alun di kiri depan pintu, di bawah ujung jalan: tempat figur berkumpul "di depan komisariat" |
| `dalam`, `pintuBelakang`, `luarBelakang` | Hanya dengan `potong`: tengah lantai ruang (y 0.06), ambang pintu belakang, dan 0.45 di luar pintu belakang |
| `sampingKomisariat` | Hanya dengan `potong`: pusat ruang kosong di kanan komisariat (`komisariat` + `titik(3.1, 0.45)`) untuk benda pendukung. Dua benda berdampingan di `± titik(0.55, 0)` (kalender 1.2 dan daftar hadir 0.9 di 06). Diuji dengan fokus `d.titik.komisariat.clone().add(titik(0.3, 0.3, 2.0))`; pada `d.fokus` titik ini di luar layar kanan |
| `puncakTangga[i]` | Pusat atas anak tangga LK 1, 2, 3 |
| `lapangan` | Pusat lapangan kosong di kiri bawah, bebas sampai radius ±1.5 tanpa menyentuh jalan |

### Opsi

| Opsi | Bawaan | Arti |
|---|---|---|
| `potong` | `false` | `true` atau angka skala. Komisariat diganti `rumahPotong` (potongan isometrik: dinding depan rendah, pintu belakang) yang diskalakan 1.4 (`true`) atau sebesar angka, di `titik(2.3, 1.9)`. Jalan tetap berakhir di pintu depannya. Tanpa garis atap: garis itu memotong setiap figur di dalam ruang (`opsi: { komisariat: { garisAtap: true } }` memulihkannya). Mengisi `dalam`, `pintuBelakang`, `luarBelakang`, `sampingKomisariat`, dan bagian dalam `jalurPendek` |

Untuk pengganti lain, pakai `ganti.komisariat`. Titik pintu dihitung dari `userData.depanPintu` benda pengganti; benda tanpa titik itu dianggap berpintu di muka +z.

### Jalur dan waktu

Figur kit berjalan 1.2 unit/s. Jalur dunia ini lebih panjang daripada jendela waktu brief (diukur pada kurva `lengkung: true`, dunia `potong: true`):

| Jalur | Panjang | Waktu pada 1.2 unit/s |
|---|---|---|
| `d.titik.jalur` (belakang gerbang → depan pintu) | 5.5 | 4.6 s |
| `d.titik.jalur` lalu dalam ruang sampai `luarBelakang` (`potong`) | 9.4 | 7.8 s |
| `d.titik.jalurPendek` (`potong`: ujung jalan → lewat ruang → `luarBelakang`) | 4.5 | 3.7 s |
| `d.titik.jalurPendek.slice(0, 5)` (ujung jalan → `dalam`) | 2.5 | 2.1 s |
| `d.titik.jalurPendek` tanpa `potong` | 0.5 | 0.4 s |

Untuk jendela yang lebih pendek, hitung laju dari panjang kurva: `const k = new THREE.CatmullRomCurve3(d.titik.jalurPendek, false, "centripetal"); jalan(f, { t, jalur: k, laju: k.getLength() / detik })`. Di 06, tiap kader menempuh `jalurPendek` dalam 1.6 s (±2.8 unit/s, `frek: 5`) dan tetap terbaca sebagai berjalan cepat. Figur yang muncul di ujung jalan: `muncul(f, { t, durasi: 0.3, naik: 0 })` pada titik pertama jalur.

### Figur di sekitar figur tengah

Pada kamera isometrik, figur tepat di belakang figur tengah (atas layar) bertumpuk dengan kepala figur tengah menjadi "totem", dan figur tepat di depannya (bawah layar) menutupi badannya. Letakkan figur pada sudut layar yang menyamping, mis. 0°, 130°, dan 230° pada radius 0.8 (diuji di 06; `titik(R cos, R sin)`: 0° = kanan layar, 90° = bawah layar):

```js
const keliling = (sudut, R = 0.8) => d.titik.dalam.clone().setY(0).add(titik(R * Math.cos(sudut * DEG), R * Math.sin(sudut * DEG)));
[0, 130, 230].map((s) => keliling(s));   // kanan, kiri depan (dekat pintu), kiri belakang
```

Hindari sudut sekitar 90° (depan) dan 270° (belakang). Figur yang datang lewat pintu depan ke tujuan seperti ini: `[...d.titik.jalurPendek.slice(0, 4), tujuan]` dengan `lengkung: true`.

### Penyimpangan dari prompt

Pada angka prompt dan fokus `titik(0, 0)`, dunia selebar 12 unit, padahal lebar frustum 16 hanya 9 unit (diukur dengan kit): kelas x −233…209, y 283…758; gerbang x −60…324, y 495…774; tangga x 879…1209. Gedung kelas saja setinggi 4 dari 7 unit layar zona, jadi dunia dipadatkan ke arah komisariat, yang tetap di titik prompt karena banyak benda tambahan indikator diletakkan relatif terhadapnya.

| Bagian | Prompt | Kit | Alasan |
|---|---|---|---|
| `gerbang` | `titik(-3.4, -3.6)`, rotasi y −45° | `titik(-2.1, -0.7)`, rotasi 0 | Keluar kiri dan atas. Gerbang kit sudah menghadap kamera pada rotasi 0 (docs/benda-figur-bangunan.md) |
| `kelas` | `titik(-4.6, -5.4)` | `titik(-2.85, -2.9)` | Keluar kiri 233 px dan atas 317 px. Tetap di belakang gerbang, tanpa bertabrakan |
| `jalan` | 9 ubin dari `titik(-2.6, -2.6)` lewat `titik(-0.4, -0.2)` ke `titik(1.8, 1.6)` | 6 ubin berjarak 1 dari bawah gerbang (`-2.1, -0.7`), lewat tengah yang digeser `titik(-0.15, 0.3)`, ke depan pintu (`1.43, 2.8`) | Mengikuti gerbang yang dipindah. Ujung prompt jatuh di dinding belakang komisariat (muka −x), padahal pintu ada di muka +z yang terlihat kamera; jalan kit berakhir tepat di depan pintu. Jarak ubin 1 sesuai kamus |
| `tangga` | `titik(4.2, -0.4)` | `titik(1.2, -1.5)` | Keluar kanan sampai x 1209 |
| `komisariat` + `potong` | `titik(2.6, 2.2)`, diperbesar 1.4 | `titik(2.3, 1.9)` | Pada titik prompt, rumahPotong 1.4× keluar bawah (y 1446) dan kanan (x 1083) |
| fokus | `titik(0, 0)` | `titik(-0.28, 0, 1.7)` | Fokus dinaikkan supaya susunan setinggi ±6.6 unit layar berada di tengah zona (kelas y ±625, komisariat y ±1420), dan digeser sedikit ke kiri supaya kelas dan rumahPotong sama-sama muat |

### Resep per indikator

| Indikator | Penyesuaian |
|---|---|
| 01 | Bawaan. Arus figur: `jalan(f, { jalur: d.titik.jalur, lengkung: true })`; figur yang lurus: `[d.titik.belakangGerbang, d.titik.gerbang, titik(-6, 0)]`. Label tahun di `d.titik.atasGerbang`. Cermin: `d.titik.pintu.clone().setY(0.6)`, H 12. Lima figur dan tabel di sekitar `d.titik.depanKomisariat`; tabel prompt `titik(0.8, 3.6)` jatuh di tepi bawah zona, tepat di depan pintu |
| 02 | `tanpa: ["jalan"]` (tangga juga bila tidak dipakai). Benda yang naik ke atas blok tanah: `posisi: { gerbang: titik(r, d, 0.3), ... }` (y = tinggi blok) |
| 03 | Tidak memakai duniaKader; bangun `ruangLatihan()` langsung |
| 06 | `potong: true` (garis atap mati bawaan). Kader lewat: `jalan(f, { jalur: d.titik.jalurPendek, lengkung: true, beku: false })` dengan laju dari panjang kurva (lihat Jalur dan waktu; 06: 1.6 s per kader, jeda 0.6), `hilang` saat tiba, dan `pudar` mulai 55% perjalanan (`halus(rentang(t, t0 + 0.55 * (t1 - t0), t1 + 0.35))`). Ruang kosong: `setelKeadaan(d.benda.komisariat, "abu", …)`. Lingkaran kosong `garisPutus({ lingkaran: 0.48 })` di `d.titik.dalam`. Cermin: fokus `d.titik.dalam.clone().setY(1.0)`, H 12 (y 0.6 juga lolos zona sejak garis atap mati; y 1.0 menaruh ruang di tengah zona). Langkah: fokus `d.titik.komisariat.clone().add(titik(0.3, 0.3, 2.0))` (= `titik(2.6, 2.2, 2.0)`), dan benda latar (`gerbang`, `kelas`, `jalan`, `tangga`) `penting: false` sejak Cermin karena boleh terpotong. Pendamping `pion({ lencana: true })` di `d.titik.dalam`, tiga kader berhenti di sudut 0°, 130°, 230° (lihat Figur di sekitar figur tengah). Kalender prompt `titik(4.2, 2.8)` keluar layar kanan: kalender dan daftar hadir di `d.titik.sampingKomisariat ∓ titik(0.55, 0)`; isi petak `muncul(kalender.userData.bagian.isiPetak[i])`, centang `muncul(daftarHadir.userData.bagian.centang.slice(0, 3))` |
| 10 | `gerbangLK1` (`gerbangKampus({ label: "LK 1" })`, skala 0.8) di `d.titik.ubin[2]`. Ujung jalan patah: sembunyikan ubin sesudahnya, `d.benda.jalan.userData.bagian.ubin.slice(3).forEach((u) => (u.visible = false))`, lalu `ubinBaru1..3` muncul tepat di `d.titik.ubin[3..5]`. Cermin: `d.titik.ubin[2]` |
| 17 | Delapan kader berbaris di sekitar `d.titik.depanGerbang`, satu baris sejajar layar; baris selebar ±3.2 unit masih di dalam layar (`depanGerbang` di x ±322, baris x ±130–514). Penanda bulan di `d.titik.ubin[1]`, `[3]`, `[5]`. Penghubung di `d.titik.depanKomisariat` |
| 19 | `ruangRamai` di `d.titik.lapangan`. Pelat 3 × 3 (setengah diagonal layar 2.1) melewati radius bebas lapangan dan menyentuh jalan; perkecil pelatnya, atau `tanpa: ["jalan"]`. `kajianBaru` di `d.titik.depanKomisariat` (prompt `titik(2.6, 3.6)` keluar bawah) |
| 21 | Persimpangan dari `titik(0, 0)` memotong jalan: `tanpa: ["jalan"]`. Panji di `d.titik.atap` |
| 31 | Pendamping dan dua lingkaran radius 1.2 / 1.9: di `d.titik.lapangan` lingkaran luar menyentuh jalan, jadi `tanpa: ["jalan"]` atau radius lebih kecil |
| 34 | Panji di `d.titik.atap`. Pelintas berjalan di `d.titik.jalur` (atau dibalik). Lingkar pengurus di `d.titik.depanKomisariat` |
| ubin prompt | `opsi: { jalan: { jumlah: 9, jarak: 0 } }` memberi 9 ubin rata dari ujung ke ujung (`jarak: 0` mematikan jarak bawaan 1) |

## duniaJenjang

Jenjang organisasi: tiga komisariat kecil di kiri depan, gedung cabang di kiri belakang, menara badko di tengah, menara PB di kanan depan, dan jembatan tabung (y 0.3) dari setiap jenjang ke jenjang di atasnya. Puncak keempat jenjang naik dari kiri ke kanan.

```js
const d = duniaJenjang(v, { opsi: { jembatanCabang: { retak: true } } });   // indikator 05
jadwal = jadwalIndikator({ fokus: d.fokus, cermin: { fokus: d.benda.badko.position.clone().setY(1.5), H: 12 } });
muncul(d.urutan, { t: 0.6, jeda: 0.09 });                                     // 11 benda, selesai t 2.0
aliran({ jalur: d.jalur("komisariat1", "cabang"), mulai: 2.0, selesai: 6.0 });  // di atas tabung
denyutCermin([d.benda.badko, d.benda.jembatanCabang], { mulai: 7.0, selesai: 11.8 }); // tepi badko, tepi dan ujung patahan jembatan
v.setiapFrame((t) => d.benda.jembatanCabang.userData.aturRetak(1 - halus(rentang(t, 15.8, 16.1))));   // retak menutup
klikEmas(d.benda.jembatanCabang, { t: 16.1 });
aliran({ jalur: d.jalur("cabang", "badko", "pb"), mulai: 16.45, selesai: 21, emas: true, beku: false });
```

### Benda

| Kunci | Benda kit | Letak bawaan | Catatan |
|---|---|---|---|
| `komisariat1`, `komisariat2`, `komisariat3` | `rumahKecil()` 1.2 × 0.9 × 1.1 | `titik(-2.6, 3.1)`, `titik(-1.0, 3.4)`, `titik(-3.55, 2.0)` | Keadaan `lampu` |
| `cabang` | `gedungCabang()` 2.0 × 2.4 × 2.0 | `titik(-2.85, -1.0)` | Jauh di belakang badko, supaya jembatan cabang → badko panjang |
| `badko` | `menaraBadko()` 1.6 × 4.0 × 1.6 | `titik(0.3, 0.85)` | Utuh tanpa tertutup benda lain (benda cermin 05) |
| `pb` | `menaraPB()` 2.0 × 6.0 × 2.0, kubus puncak 0.9 zamrudRedup | `titik(3.0, 2.6)` | `klikEmas(pb)` hanya mengemaskan kubus |
| `jembatanKomisariat1..3` | `jembatanTabung()` r 0.06, y 0.3 | dari dinding komisariat ke dinding cabang | Jembatan dinamai menurut jenjang bawahnya |
| `jembatanCabang` | sama | cabang → badko, 1.85 unit (±200 px pada H 16) | Jembatan yang retak di 05; terlihat utuh dari muka cabang sampai badko. Tiap separuh retak memuat ±5 bola tumpukan (tata letak lama ±2) |
| `jembatanBadko` | sama | badko → PB | |

Ujung setiap jembatan berada di dinding kedua bangunan (masuk 0.03 ke dinding), jadi celah retak `retak: true` jatuh tepat di tengah bagian yang tampak. Kelima jembatan terlihat; jembatan dari komisariat muncul di atas atap komisariat menuju cabang. `denyutCermin` pada jembatan menyalakan permukaan tabung dan garis tepinya: kedua siluet tabung, cincin di ujung luar, dan cincin di kedua ujung patahan selama retak (docs/benda-medan-perabot.md).

`urutan`: komisariat1, komisariat2, komisariat3, cabang, jembatanKomisariat1..3, badko, jembatanCabang, pb, jembatanBadko (setiap jembatan sesudah kedua ujungnya).

### Titik dan jalur

| Titik | Isi |
|---|---|
| `atas.<nama>` | Pusat puncak bangunan `<nama>` (komisariat1..3, cabang, badko, pb) |
| `samping.<nama>` | Pusat lembar melayang 0.8 × 1.0 milik bangunan itu (halamanTugas 05). Komisariat1: 0.9 ke belakang dan 1.3 di atas bubungan, melayang di atas jembatan komisariat → cabang. Komisariat3: 0.65 di atas bubungan. Komisariat2: di kanannya, y 1.45. Cabang: 0.8 di depan muka +x, y 1.9. Badko dan PB: 0.5 di depan sudut terdepan, y 2.0 dan 2.6. Keenam lembar tidak saling menutupi, tidak menutupi satu pun dari kelima jembatan, dan lolos zona (diuji dengan `lembarKertas({ rebah: false })` yang tepi bawahnya di `samping.y − 0.5`) |
| `depanPintu.<nama>` | Depan pintu tiap bangunan (muka +z) |
| `jalurJembatan.<jembatan>` | `[ujung bawah, ujung atas]` di **sumbu tabung** (y 0.3), titik dunia: letak bunyi, label, dan panjang jembatan. Bukan untuk `aliran` (bola tenggelam di tabung); pakai `d.jalur(...)` |
| `tengahJembatan.<jembatan>` | Tengah tiap jembatan, di sumbu tabung |
| `retak` | Tengah `jembatanCabang`, di sumbu tabung (pusat celah). Titik yang sama di atas tabung: `d.jalur("cabang", "badko").getPointAt(0.5)` |

Titik untuk bangunan yang ditiadakan lewat `tanpa` tidak dibuat.

`d.jalur(...nama, { angkat })` membuat `THREE.CurvePath` lewat jembatan yang menghubungkan bangunan berurutan, naik atau turun jenjang: `d.jalur("komisariat1", "cabang", "badko", "pb")`, `d.jalur("pb", "badko", "cabang", "komisariat2")`, satu jembatan `d.jalur("cabang", "badko")`. Ruas di antara dua jembatan melintas di dalam bangunan, jadi bola aliran "masuk" lalu "keluar" bangunan. Setiap dua nama berurutan harus dihubungkan satu jembatan; selain itu fungsi melempar galat.

Jalur berada **di atas tabung**: `angkat` bawaan = jari-jari tabung + 0.06 (0.12 pada tabung bawaan), sehingga bola aliran r 0.07 meluncur di punggung tabung dan terlihat. `{ angkat: 0 }` memberi sumbu tabung (sama dengan `jalurJembatan`), tempat bola hampir seluruhnya tenggelam. Jangan mengangkat jalur ini lagi (indikator-05 pilot memakai `angkat()` lokal sebelum bawaan ini ada).

### Opsi

Tidak ada opsi khusus. Retak lewat `opsi: { jembatanCabang: { retak: true } }` (keadaan awal) atau `d.benda.jembatanCabang.userData.aturRetak(k)` setiap frame. Semua jembatan sekaligus: `opsi: { jembatan: { radius: 0.05 } }` (`d.jalur` ikut mengangkat jalurnya sesuai jari-jari). Tata letak lama (cabang dekat badko, jembatan cabang → badko 1.1 unit): `posisi: { cabang: titik(-2.85, 0.1) }`.

### Penyimpangan dari prompt

Menara PB setinggi 6 unit memakan 6.6 dari 7 unit layar zona adegan pada H 16, jadi alasnya harus di dekat tepi bawah zona: PB tidak bisa berada "jauh di kanan atas" seperti di prompt, dan bangunan lain tidak bisa lebih rendah darinya. Lebar keempat bangunan (komisariat, cabang 2.9, badko 2.4, PB 2.9 unit layar) juga melebihi lebar layar 9 unit bila berjajar. Pada angka prompt dengan fokus prompt (diukur dengan kit): PB x 748…1100, y 205…935; badko y 564; komisariat2 y 1461; komisariat3 x −49.

| Bagian | Prompt | Kit | Alasan |
|---|---|---|---|
| `pb` | `titik(3.2, -4.2)` | `titik(3.0, 2.6)` | Keluar atas 395 px dan kanan 20 px. Alas PB harus di dekat tepi bawah zona |
| `badko` | `titik(1.5, -1.6)` | `titik(0.3, 0.85)` | Keluar atas 36 px. Di kiri PB tanpa tertutup PB, puncaknya 0.8 unit di bawah puncak PB |
| `cabang` | `titik(-0.6, 1.0)` | `titik(-2.85, -1.0)` | Memberi ruang badko; jauh di belakang badko, sehingga jembatan cabang → badko melintang 1.85 unit di layar tanpa tertutup (retak dan tumpukan aliran terbaca; pada tata letak lama `titik(-2.85, 0.1)` hanya 1.1 unit, ±2 bola per separuh), jembatan komisariat terlihat di atas atap, dan puncaknya di bawah puncak badko |
| `komisariat1` | `titik(-3.2, 3.2)` | `titik(-2.6, 3.1)` | Menyusun ulang ketiga komisariat di depan cabang tanpa menutupi jembatan cabang → badko |
| `komisariat2` | `titik(-1.6, 4.0)` | `titik(-1.0, 3.4)` | Keluar bawah 21 px |
| `komisariat3` | `titik(-4.0, 1.7)` | `titik(-3.55, 2.0)` | Keluar kiri 49 px |
| `jembatan` | menghubungkan bangunan (pusat ke pusat tidak disebut) | dari dinding ke dinding pada y 0.3 | Celah retak 0.3 tepat di tengah bagian yang tampak |

Ukuran semua bangunan dan fokus `titik(0, 0, 1.2)` sama dengan prompt.

### Resep per indikator

| Indikator | Penyesuaian |
|---|---|
| 05 | Contoh di atas (diuji di indikator-05: retak, aliran naik dan turun, klikEmas jembatan berporos di tengahnya). Nama jenjang: `label3D("BADKO", { pada: d.benda.badko, geser: [0, d.titik.atas.badko.y + 0.3, 0] })`, juga CABANG dan PB (atap komisariat tidak punya latar kosong). Aliran yang tersendat (gerak lokal 05, `aliranTersendat`): bola di `d.jalur("cabang", "badko", "pb")` berhenti `panjang / 2 − 0.23` dari awal, tepat sebelum celah (`panjang` = jarak `d.titik.jalurJembatan.jembatanCabang[0]` ke `[1]`), lalu menumpuk dan meredup abu; bunyinya di `d.titik.retak`. Cermin H 12 pada badko memotong bangunan lain: selama 6.0–13.0 hanya badko dan `jembatanCabang` yang `penting`. Halaman tugas: `lembarKertas({ rebah: false })` dengan tepi bawah di `d.titik.samping.<nama>.y − 0.5`; tanda `label3D("BERJALAN", { pada: lembar.userData.bagian.badan, geser: [0, -0.18, 0], gaya: "kotak", kelas: "zamrud", skala: 0.65, ax: 0.5, ay: 0.5 })`, TERSENDAT dengan `kelas: "abu"` (docs/halaman.md). Amplop `amplop({ skala: 0.5, miring: 0 })` dari halaman badko turun ke punggung jembatan badko → PB (`jalurJembatan.jembatanBadko` pada y 0.4), menyusurinya, lalu menempel rata di muka +z PB (putar y −45°) |
| 11 | Fokus cabang: `d.benda.cabang.position.clone().setY(1.2)`. Komisariat dan PB diredupkan lewat `setelKeadaan(…, "pudar" \| "abu", k)` dan `"lampu"`. Ruang kosong (diukur pada tata letak lama, cabang `titik(-2.85, 0.1)`; ukur ulang) tersisa hanya di depan badko (bawah tengah layar); `ruangKarya` 1.8 × 1.6 tidak muat tanpa memindahkan `komisariat2` lewat `posisi` atau `tanpa`. Kabel putus: `jembatanTabung({ dari, ke, radius: 0.04, retak: true })` |

## duniaSimpul

Jaringan simpul: komisariat di pusat, delapan simpul melingkar (simpul1 di atas layar, lalu searah jarum jam), dan layar kanal di dalam lingkaran di kiri atas. Simpul mulai lepas: abu, tanpa garis.

```js
const d = duniaSimpul(v);
jadwal = jadwalIndikator({ fokus: d.fokus, cermin: { fokus: d.titik.komisariat.clone().setY(0.6), H: 12 } });
const garis = d.titik.simpul.map((p) => v.tambah(garisJalur([d.titik.pusat, p])));   // indikator 37
garis.forEach((g, i) => sambungGaris(g, { t: 13.0 + 0.25 * i }));
v.setiapFrame((t) => d.titik.simpul.forEach((_, i) =>
  setelKeadaan(d.benda[`simpul${i + 1}`], "sambung", halus(rentang(t, 13.6 + 0.25 * i, 14.0 + 0.25 * i)))));
```

### Benda

| Kunci | Benda kit | Letak bawaan | Catatan |
|---|---|---|---|
| `komisariat` | `rumah()` seperti Kader | `titik(0, 0)` = prompt | |
| `simpul1..8` | `simpul({ tersambung: 0 })` | lingkaran radius 3.9 dari komisariat, simpul1 di `titik(0, -3.9)` lalu searah jarum jam | Keadaan `"sambung"` 0..1 (abu → zamrud) |
| `layar` | `layarKanal()` 2.4 × 1.6, kaki 0.9 | `titik(-1.42, -2.3)`, menghadap kamera | `setelIsi`/`gambar` untuk isi layar |

`urutan`: komisariat, simpul1..8, layar.

### Titik

| Titik | Isi |
|---|---|
| `komisariat` | Pusat alas komisariat |
| `pusat` | Ujung garis penghubung di komisariat (pusat rumah, y 0.6): garis tampak keluar dari dinding |
| `atap` | Puncak bubungan (alternatif ujung garis bila jaringan ingin memancar dari atap) |
| `depanPintu` | Depan pintu komisariat |
| `simpul[i]` | Pusat bola simpul ke-(i+1), ujung garis penghubung. Tetap ada walaupun simpulnya ditiadakan |
| `tengahGaris[i]` | Tengah garis `pusat` → `simpul[i]` (gembok 37) |
| `layar`, `depanLayar` | Pusat muka layar, dan tanah 1 unit di depan layar (penonton 36) |

### Opsi

Tidak ada opsi khusus. Semua simpul sekaligus: `opsi: { simpul: { radius: 0.25 } }`, `tanpa: ["simpul"]`.

### Penyimpangan dari prompt

| Bagian | Prompt | Kit | Alasan |
|---|---|---|---|
| radius lingkaran | 4.0 | 3.9 | Kotak alas simpul3 dan simpul7 keluar kiri dan kanan 3 px |
| `layar` | `titik(-3.2, -3.0)` | `titik(-1.42, -2.3)` | Di titik prompt layar menimpa simpul8 (`-2.83, -2.83`) dan puncaknya keluar zona atas (y ±558). Di dalam lingkaran, di antara simpul8 dan simpul1, layar hanya menyentuh tepi kedua simpul itu dan garis penghubung lewat di bawah panelnya |
| fokus | `titik(0, 0)` | `titik(0, 0, 0.5)` | Puncak layar dekat tepi atas zona; lingkaran simpul memberi ruang di bawah |

### Resep per indikator

| Indikator | Penyesuaian |
|---|---|
| 36 | `posisi: { layar: titik(-1.6, -2.2) }, opsi: { layar: { lebar: 3.6, tinggi: 2.4, kaki: 0.6 } }` (diuji lolos zona; dengan kaki bawaan 0.9 puncak layar keluar atas). Layar 1.5× menutupi simpul1 dan simpul8, jadi simpul itu sebaiknya tidak dipakai di 36. Pamflet: `v.setiapFrame((t) => d.benda.layar.userData.setelIsi(Math.floor(t / 0.6), POLA_LAYAR.pamflet(Math.floor(t / 0.6))))`. Penonton di sekitar `d.titik.depanLayar` (titik ini ikut layar yang dipindah). Tanggapan: `aliran({ jalur: [penonton, d.titik.layar] })` |
| 37 | Label: `label3D("HUKUM · MAKASSAR", { pada: d.benda.simpul1, geser: [0, 0.9, 0] })`. Garis `pusat` → `simpul[i]` dan gembok di `tengahGaris[i]`. Simpul melayang: geser `d.benda.simpulN.position.y` dari `setiapFrame` (panggil `aturDasar` bila gerak kit juga dipakai). Layar tidak disebut di 37: `tanpa: ["layar"]` membuat garis ke simpul8 dan simpul1 lega |

## Pengujian

Diuji dengan video sementara yang menampilkan setiap dunia dan variannya bergantian (`npm run buat -- <uji> --periksa`):

- **Zona.** Pada H 16 dengan `d.fokus`: Kader bawaan, Kader `potong`, Jenjang dengan retak, aliran, dan enam lembar `samping`, Simpul bawaan, dan resep 36: 0 pelanggaran. Semua `d.titik` jatuh di dalam zona adegan.
- **Cermin H 12** di pintu komisariat (Kader), `d.titik.dalam` y 1.0 (Kader `potong`), badko y 1.5 (Jenjang), dan komisariat (Simpul): benda kunci utuh di zona dan terbaca. Benda lain boleh terpotong pada H 12.
- **Gerak.** Figur menempuh `d.titik.jalur` sampai pintu, dan pada `potong` terus ke dalam lalu keluar pintu belakang. `aliran` lewat `d.jalur(...)` naik dan turun jenjang. `muncul(d.urutan)` dan `klikEmas(jembatanCabang)` berporos di tengah benda (tidak melompat).
- **Bloom.** Tangkapan dengan dan tanpa pass bloom dibandingkan per piksel: semua dunia dalam keadaan bawaan, ditambah badko abu dan berdenyut, jembatan berdenyut, komisariat/jalan/tangga Kader berdenyut, delapan simpul tersambung, layar berdenyut, dan bola aliran: 0 piksel berbeda. Kontrol: kubus PB emas dan badko `nyala` 1.4 mengubah ratusan ribu piksel.
- **Warna.** Pemeriksa palet bersih di semua titik.
- **Tata letak Jenjang (cabang `titik(-2.85, -1.0)`).** Pada H 16 dengan `d.fokus`: retak, aliran di atas tabung lewat `d.jalur` (bawaan dan `{ angkat: 0 }` sebagai pembanding), denyut badko dan jembatan, dan enam lembar `samping`: 0 pelanggaran zona; keenam lembar tidak saling menutupi dan tidak menutupi satu pun titik sumbu kelima jembatan (sampel tiap 2% panjang); semua `d.titik` di zona. Cermin H 12 badko y 1.5: badko dan `jembatanCabang` utuh di zona. Dekat (H 4 dan H 6): cincin ujung patahan tampak selama retak dan hilang saat utuh; garis siluet tampak di kedua sisi tabung.
- **Kader `potong`.** Tanpa garis atap, cermin `d.titik.dalam` y 0.6 dan y 1.0 lolos zona. Langkah dengan fokus `d.titik.komisariat + titik(0.3, 0.3, 2.0)`: kalender dan daftar hadir di `sampingKomisariat ∓ titik(0.55, 0)` dan tiga figur di sudut 0°, 130°, 230° lolos zona. Panjang jalur di tabel Jalur dan waktu diukur dari kurva yang sama dengan `jalan(…, { lengkung: true })`.

## Catatan untuk modul lain

- Sejak kit 0.6.0, `jalan()` dan `aliran()` menerima `THREE.Curve` apa pun sebagai `jalur`, termasuk `d.jalur(...)` dan `jalan.userData.kurva`. Kurva lokal milik grup yang dipindah perlu diubah ke koordinat dunia dulu.
- `npm run baru` menerima nama berawalan `_` sejak kit 0.6.0.
