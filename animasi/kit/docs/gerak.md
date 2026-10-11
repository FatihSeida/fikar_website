# gerak

Gerak standar bagian D dalam bentuk deklaratif. Gerak dipanggil sekali saat adegan dibangun (sesudah `buatVideo()`), dengan waktunya. Kit mengevaluasinya tiap frame sebagai fungsi murni dari `t` dan otomatis mencatat peristiwa bunyi (KONTRAK bagian 3) dengan `x` dari proyeksi benda pada detik peristiwa.

## Contoh

```js
import { titik, pion, muncul, jalan, hilang, klikEmas, denyutCermin, tumbuh } from "../../kit/index.js";

const f = v.tambah(pion());
muncul(f, { t: 0.8 });
const j = jalan(f, { t: 0.8, jalur: [titik(-3, -2), titik(-1, 0), titik(1, 1)], lengkung: true });
if (j.selesai) hilang(f, { t: j.selesai });            // masuk pintu saat tiba
denyutCermin(komisariat, { mulai: 7.0, selesai: 11.8 });
muncul(tabel, { t: 12.4 });
tumbuh(tabel.userData.bagian.batang, { t: 12.9, sumbu: "x" });  // berurutan, 0.3 s per batang
klikEmas(tabel, { t: 15.6 });
```

Brief memberi jendela waktu, bukan kecepatan. Gerak di bawah ini menerima jendela itu langsung:

```js
muncul(d.urutan, { t: 0.6, selesai: 2.0 });                        // 11 benda, yang terakhir selesai tepat 2.0
jalan(f, { t: 1.6, jalur: d.titik.jalur, lengkung: true, durasi: 1.6 });   // tiba tepat 3.2
gantiBenda(lembar, amp, { t: 14.8 });                              // lembar terlipat menjadi amplop di tempatnya
lintas(amp, { t: 15.1, durasi: 0.6, jalur: [lembar.position.clone(), titik(2, 1, 0.4), titik(3, 2, 1.2)], lengkung: true });
aliran({ jalur: d.jalur("komisariat1", "cabang"), mulai: 2.0, selesai: 6.0, beku: { lanjut: 15.8 } });
aliranTersendat({ jalur: d.jalur("cabang", "badko", "pb"), tahan: d.titik.retak, mulai: 3.4, lepas: 16.1 });
```

## Cara kerja

- Tiap benda punya saluran `posisi`, `tampak`, `tumbuh`, `sambung`, `emas`. Di tiap saluran berlaku gerak yang paling akhir dimulai (mulai ≤ t); sebelum gerak pertama dimulai, gerak pertama menentukan keadaan awal (mis. sebelum `muncul` benda tak terlihat, sebelum `jalan` figur menunggu di titik awal). Jadi `muncul` → `hilang` → `muncul` lagi berjalan benar.
- Efek (`pegas` klik emas, `getar`, `putar`) dijumlahkan. `denyut` diambil maksimumnya.
- Posisi, skala, dan rotasi dasar benda dicatat pada frame pertama. Pindahkan benda sebelum itu; bila harus dipindah sesudahnya, panggil `aturDasar(obj)`.
- Gerak menimpa posisi/skala/rotasi/opasitas benda. `v.setiapFrame` berjalan sesudah gerak, jadi bisa menimpa lagi; jangan mengatur properti yang sama dari dua tempat.
- Geseran gerak (`naik` pada `muncul`, `turun` pada `hilang`, ayunan `jalan`) berlaku di sumbu y **lokal induk** benda. Benda yang anak dari kelompok miring atau berputar ikut miring arahnya; untuk benda seperti itu pakai `muncul(benda, { naik: 0 })`.
- **Beku.** Format indikator membekukan gerak bersambung (`jalan`, `lintas`, `aliran`, `aliranTersendat`, `debu`, `putar`) yang dimulai sebelum 6.6: melambat dari 6.0, berhenti di 6.6, dan tetap diam. Gerak yang dimulai sesudah 6.6 tidak terpengaruh. Opsinya:
  - `beku: false`: boleh terus berjalan.
  - `beku: { lanjut: 13, landai: 0.4 }`: beku di 6.6 lalu berjalan lagi mulai detik 13 dari tempat ia berhenti; lajunya naik 0 → 1 selama `landai` detik. Untuk gerak Gejala yang diam selama Cermin lalu bergerak lagi di Langkah. Bunyi langkah dan aliran ikut diam selama beku.
  - `jam: fn`: jam sendiri, mis. `waktuBeku(6, 6.6, { lanjut: 13 })` dari inti.
- Semua gerak menerima `bunyi: false` (tanpa peristiwa) atau `bunyi: { kuat, jenis, durasi }`. `kuat` bawaan 0.7, yaitu tingkat kalibrasi tiap jenis di modul Suara; 0 = bisu. `durasi` menimpa lama peristiwa berdurasi (`aliran`, `whoosh`, `tumbuh`, `putar`, ...). Gerak yang menerima array memakai `jeda` antarbenda dan memberi `nada` 0, 1, 2, … pada peristiwanya.
- Peristiwa berdurasi diisi `durasi` sesuai lama geraknya. `x1` (posisi layar akhir, untuk panning) diisi dari proyeksi posisi akhir pada detik `t + durasi`. `denyut` diberi `periode`.
- **Akhir adegan.** Bunyi `aliran` (juga `aliranTersendat`) dipotong di `v.akhirAdegan`, supaya desisnya tidak berjalan di bawah kartu akhir. Bawaannya `format.akhirAdegan`, lalu awal kartu akhir format (`format.waktu.kartu.kepala[0]`: indikator 18.2, evidence 28.2), lalu durasi video; ganti lewat `buatVideo({ akhirAdegan })`. Gerak yang dimulai sesudahnya tidak dipotong.
- Aturan B.6 (emas hanya untuk hasil Bagian 3) adalah pilihan pemanggil.

## Daftar gerak

| Gerak | Bawaan (bagian D) | Peristiwa |
|---|---|---|
| `muncul(benda\|[...], { t, durasi=0.5, jeda=0.12, selesai, naik=0.6, skala=0.85 })` | naik dari y −0.6 (lokal induk), skala 0.85 → 1, opacity 0 → 1, keluar3 | `muncul` |
| `hilang(benda\|[...], { t, durasi=0.4, turun=0.3, jeda=0, selesai })` | turun 0.3, opacity 1 → 0 | `hilang` |
| `klikEmas(benda\|[...], { t, durasi=0.8, lonjak, jeda=0, selesai })` | warna ke emas, emissive 0 → 1.4 → 0.9, skala 1 + `lonjak` → 1 pegas. Bagian: `userData.bagian.emas`. `lonjak` bawaan `userData.lonjakEmas` benda, selain itu 0.25. Pion memberi `lonjakEmas: 0`: figur tidak membesar, hanya cincin kakinya yang menjadi emas (`lonjak: 0.25` bila memang ingin melonjak) | `klik-emas` |
| `denyutCermin(benda\|[...], { mulai, selesai, periode=1.2 })` | tepi zamrudPijar 0 → 0.5 → 0 (`bagian.tepi`, dibuat otomatis bila tak ada), permukaan `bagian.denyut`; paling redup di `mulai`, puncak di mulai + periode/2 | `denyut` (durasi, periode) |
| `jalan(obj, { t, jalur, laju=1.2, durasi, ayun=0.04, frek, lengkung=false, hadap=false })` | 1.2 unit/s, naik turun 0.04 pada 4 Hz. `jalur`: array Vector3 atau `THREE.Curve`. `durasi`: tiba tepat `durasi` detik sesudah `t` (menimpa `laju`); `frek` lalu mengikuti laju, 4 × √(laju/1.2) dijepit 3–6 Hz, kecuali diisi sendiri. Mengembalikan `{ mulai, selesai, panjang, pada(t) }`; `selesai` null bila beku sebelum tiba | `langkah` tiap tapak (nada 0/1) |
| `lintas(obj, { t, jalur, durasi, laju=2, lengkung=false, hadap=false, kurva=masukKeluar3 })` | benda apa pun (amplop, berkas, ikon, bola) meluncur di sepanjang jalur dalam `durasi` detik (atau dengan `laju`), tanpa ayunan dan tanpa langkah. Jalur dan `hadap` seperti `jalan`; sebelum `t` diam di titik awal. Mengembalikan `{ mulai, selesai, panjang, pada(t) }` | `whoosh` (durasi, x titik awal → x1 titik akhir) |
| `gantiBenda(a, b, { t, durasi=0.4, skala=0.6, tempat=true })` | `a` memudar dan mengecil ke `skala` selama 60% awal, `b` muncul dari `skala` ke 1 selama 60% akhir. `tempat: true` memindah `b` ke posisi `a` saat dipanggil; `false` = `b` tetap di posisinya. Sebelum `t`, `b` tak terlihat | `kertas` |
| `busur(obj, { t, ke, dari, tinggi=1.0, durasi=0.8, putar=0 })` | parabola dari `dari` (bawaan posisi dasar) ke `ke` | `lempar` (durasi, x → x1), `mendarat` di t + durasi |
| `aliran({ jalur, mulai, selesai, laju=2, jarak=0.6, radius=0.07, naik=0, emas=false })` | bola cahaya zamrudPijar (emas: berpendar) di sepanjang kurva; array titik selalu dilengkungkan. `naik`: bola diangkat sekian unit di atas jalur, untuk jalur yang berada di sumbu pipa atau tabung (`d.jalur` Jenjang sudah di atas tabung; jangan diangkat lagi). Mengembalikan Group yang sudah di scene | `aliran` (x → x1) selama bola bergerak: sampai bola terakhir tiba, diam selama beku, terpotong di akhir adegan |
| `aliranTersendat({ jalur, tahan, mulai, jumlah=6, selang=0.3, laju=2, radius=0.07, naik=0, redup=0.9, lepas=null, lepasEmas=true, emas=false, benih=1 })` | `jumlah` bola berangkat tiap `selang` detik dan berhenti di `tahan` (jarak dari awal jalur, atau Vector3: pusat bola terdepan tepat di titik terdekat di jalur, mis. `d.titik.retak`; untuk berhenti sebelum celah pakai angka, mis. `panjang / 2 − 0.23`), antre dan menumpuk segitiga 3-2-1, lalu meredup menjadi abu dalam `redup` detik (`false` = tetap berwarna). Mulai `lepas` (detik nyata) tumpukan berjalan lagi sampai ujung, bola terdepan dulu, dan berubah emas (`lepasEmas: false` = warna semula). Mengembalikan `{ grup, mulai, tiba: [...], lepas, selesai, panjang, tahan }` | `aliran` sampai bola terakhir berhenti, `kayu` tiap bola menumbuk (nada naik), `aliran` lagi saat lepas |
| `debu({ pusat, mulai, selesai, jumlah=14, sebar=0.6, naik=0.8, benih=1 })` | butir r 0.03 abu opacity 0.4 melayang naik lalu hilang, posisi dari `acak(benih)` | `debu` |
| `tumbuh(benda\|[...], { t, durasi=0.3, jeda=durasi, selesai, sumbu="y" })` | skala sumbu 0 → 1, berurutan. Titik asal geometri harus di pangkal | `tumbuh` (durasi, nada naik) |
| `sambungGaris(garis, { t, durasi=0.6 })` | garis dari `garisJalur()` tampak bertahap | `garis-sambung` (durasi: ping di t + durasi; x ujung awal → x1 ujung akhir) |
| `gantiLabel(label, { t, teks, durasi=0.3 })` | teks `label3D` berganti dengan celup pudar | `label-ganti` |
| `putar(obj, { t, durasi=0.8, sudut=2π, sumbu="y" })` | berputar lalu tetap di sudut akhir | `putar` (durasi) |
| `getar(obj, { t, durasi=0.5, amp=0.06, frek=16 })` | bergetar mendatar, meluruh | `gemuruh` (durasi) |

Setiap gerak mengembalikan waktu `{ mulai, selesai }` (array untuk gerak yang menerima banyak benda), kecuali `aliran` dan `debu` yang mengembalikan Group-nya.

## Waktu dari brief

- **Urutan dalam jendela.** `muncul`, `hilang`, `klikEmas`, dan `tumbuh` menerima `selesai`: jeda dihitung ulang supaya benda terakhir selesai tepat di detik itu, `jeda = (selesai − t − durasi) / (n − 1)`. Bila jendelanya lebih pendek daripada `durasi`, durasi dipendekkan dan semua benda bergerak serentak. Contoh: brief "semua bangunan muncul 0.6–2.0" menjadi `muncul(d.urutan, { t: 0.6, selesai: 2.0 })`.
- **Waktu tiba.** `jalan` dan `lintas` menerima `durasi`, jadi tidak perlu mengukur jalur lalu menghitung laju. Bila tetap butuh panjangnya, `panjangJalur(jalur, { lengkung })` mengukur persis seperti `jalan` dan `lintas` (array: ruas lurus, atau kurva halus bila `lengkung: true`; `THREE.Curve`: `getLength()`). `aliran` dan `aliranTersendat` selalu melengkungkan array, jadi untuk keduanya pakai `lengkung: true`.
- **Beku lalu lanjut.** `beku: { lanjut: X }` pada gerak bersambung (lihat Cara kerja). Contoh indikator 05: aliran Gejala diam selama Cermin, lalu mengalir lagi saat celah tertutup di 15.8: `aliran({ ..., selesai: 6.0, beku: { lanjut: 15.8 } })`.

## Zona selama zoom Cermin

Selama zoom Cermin (H 12) benda latar memang boleh terpotong. Daripada menyetel `userData.penting` setiap frame, beri fungsi waktu: `b.userData.penting = (t) => !(t > 6.0 && t < 13.0)`. Kelompok yang seluruh isinya boleh keluar zona cukup diberi `userData.abaikanZona = true` pada kelompoknya. Rinciannya di `inti.md` (Pemeriksaan zona). Fokus kamera yang menaruh benda di tengah zona dihitung oleh `fokusUntuk` (`inti.md`, kamera).

## segmenKuis (Bagian 4 format evidence)

`segmenKuis(v, opsi)` (`gerak/kuis.js`) mengatur adegan 3D Bagian 4: semua benda lain memudar, enam `lengkungAudit` membentuk terowongan, komisariat meluncur di bawahnya, lalu satu lembar laporan emas mendarat di atapnya. Teks Bagian 4 (label kuis, kalimat, kartu pertanyaan, pil) dipasang format, bukan modul ini.

```js
const seg = segmenKuis(v, { komisariat: d.benda.komisariat, kelompok: "kaderisasi", mulai: 23.0 });
// kamera kuis: jadwalEvidence({ ..., kuis: { fokus: seg.fokus } })
// atau jadwalKamera({ kunci: [{ t: [23.0, 24.0], H: 14, fokus: seg.fokus }, ...] })   (H 14 = bawaan jadwalEvidence)
```

| Opsi | Bawaan | Arti |
|---|---|---|
| `komisariat` | wajib | Object3D komisariat dari adegan. Boleh anak benda lain (mis. blok tanah) |
| `kelompok` | tanpa | `"kaderisasi"`, `"tata-kelola"`, `"pengetahuan"`, `"target-program"`, `"evaluasi-arsip"`, atau `"data-jaringan"`: lengkung kelompok video berdenyut. Tanpa `kelompok` tidak ada yang berdenyut; nilai lain melempar galat |
| `mulai` | 23.0 | Detik awal segmen (m di bawah) |
| `sembunyikan` | semua benda di scene | Array benda yang dipudarkan. Bawaan: semua anak scene kecuali tanah, cahaya, komisariat, dan benda modul ini |
| `skala` | 0.8 | Skala komisariat selama segmen, mutlak: komisariat berskala dasar 1.4 (`duniaKader({ potong })`) juga mengecil ke 0.8 |

**Tata letak.** P = posisi dunia komisariat **saat segmenKuis dipanggil** (titik tanah, tinggi alas ikut: komisariat di atas blok setinggi 0.3 memberi P.y 0.3, dan seluruh terowongan berdiri di y itu). Enam lengkung ke-i (i = 0..5) di `P + titik(0.84 + 0.56 i, 0.84 + 0.56 i)`, bidang busur tegak lurus sumbu x dunia. Label berurutan: KADERISASI, TATA KELOLA, PENGETAHUAN, TARGET PROGRAM, EVALUASI DAN ARSIP, DATA DAN JARINGAN (`label3D` gaya mikro, lewat opsi `label` `lengkungAudit`). E = `P + titik(4.6, 4.6)`, fokus = titik tengah P dan E (Vector3, y ikut P).

**Gerak** (detik relatif terhadap m = `mulai`):

| Waktu | Isi |
|---|---|
| m + 0.0–0.6 | Benda sembunyikan memudar ke opacity 0 lewat `aturOpasitas` (tanpa bunyi `hilang`). Komisariat mengecil ke `skala`, abunya dilepas penuh |
| m + 0.2–0.9 | Enam lengkung `muncul` berurutan, jeda 0.08 (tiap lengkung 0.3 s) |
| m + 0.4–1.6 | Lengkung `kelompok` berdenyut (`denyutCermin`, periode 0.6) |
| m + 1.0–2.6 | Komisariat meluncur P → E (`lintas`, durasi 1.6, tanpa ayunan). Tiap lengkung `nyala` (0 → 1 dalam 0.25 s, tetap menyala) tepat saat pusat komisariat melewati bidangnya (sekitar m + 1.57 sampai m + 2.0), dengan peristiwa `menyala` bernada naik 0..5 |
| m + 2.6–3.2 | `lembarKertas` berdiri (rebah false, lebar 0.8, panjang 1.0, garis 4) muncul di `E + titik(-0.6, -0.6, 1.0)` (`muncul` 0.3 s) dan meluncur (`lintas` 0.6 s) ke puncak atap komisariat + y 0.5 |
| m + 3.2 | `klikEmas` pada lembar laporan, satu-satunya benda emas Bagian 4. Keadaan akhir bertahan sampai video selesai |

Mengembalikan `{ fokus, lengkung: [6 Group], laporan, P, E }`.

**Cara kerja dan syarat pakai:**
- **Panggil paling akhir di adegan**, sesudah semua benda, label, gerak, dan `setiapFrame` video dibuat: benda yang dibuat sesudahnya tidak ikut dipudarkan, dan `setiapFrame` yang dipasang sesudahnya menimpa abu komisariat. Letakkan komisariat (dan induknya) di tempat akhirnya sebelum memanggil. P dibaca saat itu, jadi induk yang masih bergeser sesudahnya (mis. blok yang menjauh lewat gerak) membuat terowongan meleset dari komisariat.
- Pemudaran memakai pembungkus (Group identitas) di antara tiap benda dan induknya; pembungkus memudar lewat `aturOpasitas`. Karena opasitas yang tampak = benda × induknya, gerak benda itu sendiri (`muncul`, `hilang`, `aturOpasitas` dari video) tidak tertimpa, benda yang sudah hilang tetap hilang, dan label berjangkar benda ikut pudar. Induk komisariat (mis. blok tanah) tidak dibungkus; yang dipudarkan adalah anak-anaknya selain komisariat, jadi komisariat tidak ikut memudar. Yang berupa Mesh dengan anak (bahan induk itu sendiri) tetap tampak.
- Label yang sudah ada: berjangkar benda yang dipudarkan ikut pudar sendiri; berjangkar bukan Object3D (titik, fungsi) atau berjangkar induk komisariat dipudarkan lewat `label.pengali` (opsi tambahan `label3D`: objek label punya `pada` dan `pengali`). Label berjangkar komisariat tetap tampak. Dengan `sembunyikan` eksplisit, hanya label berjangkar benda yang disebut (dan induk komisariat yang disebut) yang ikut.
- Gerak yang menulis bahannya sendiri tiap frame (`aliran`, `debu`, `aliranTersendat`) tidak ikut memudar bertahap; grupnya hilang sekaligus saat pemudaran selesai. Selesaikan benda seperti itu sebelum `mulai`.
- Abu komisariat dikalikan (1 − k) sesudah `setiapFrame` video; video tetap wajib menyetel abu tiap frame (aturan inti). Abu yang sudah 0 saat `mulai` (alur seri 44) tidak berubah.
- Semua dijadwalkan lewat pencatat gerak (`daftarkan`, `muncul`, `lintas`, `klikEmas`, `denyutCermin`), `daftarkanMandiri`, atau `setiapFrame`: adegan pada detik mana pun sama, tanpa bergantung pada frame sebelumnya (diuji: tangkapan pada halaman segar sama dengan halaman yang melompat bolak-balik).
- Peristiwa bunyi: `muncul` (nada 0..5), `denyut`, `whoosh` (komisariat dan lembar), `menyala` (nada 0..5), `muncul` lembar, dan `klik-emas`.

**Zona dan tinggi kamera.** Tata letak di atas dengan fokus di titik tengah dan H 12 menaruh atap komisariat (di P) 45 px (di t 24.5) sampai 97 px (di t 24.0 = m + 1.0) di atas zona (y 600), dan ujung kanan komisariat di E hanya sekitar 5 px dari tepi kanan. H 14 memuat semuanya dan lolos `periksaZona` di titik periksa 24.5 dan 26.8. H 14 adalah bawaan kunci kuis `jadwalEvidence` (penyimpangan dari H 12 Prompt 00; angka ukurnya di `inti.md`), jadi cukup `kuis: { fokus: seg.fokus }`. Catatan: `periksaZona` memakai kotak pembatas geometri (`kotakLayar`), yang untuk busur torus jauh lebih longgar daripada bentuk yang tampak (sekitar 70 px di atas puncak lengkung pertama pada H 12), jadi lengkung pertama bisa dilaporkan keluar zona atas padahal busurnya masih di dalam.

## Peristiwa tambahan dan pencatat

- `catat({ t, jenis, kuat=0.7, durasi=0, nada=0, sumber, posisi, posisiAkhir, x, x1, periode })`: peristiwa bunyi tambahan (mis. `pintu`, `kertas`, `cap`). `posisi`/`posisiAkhir`: benda, Vector3, `(t) => Vector3`, atau label; mengisi `x` (pada t) dan `x1` (pada t + durasi). `x`/`x1` boleh angka langsung. `laci-buka`, `pintu`, dan `garis-sambung` membunyikan ketukan akhirnya di t + durasi, jadi wajib diberi `durasi`, mis. `catat({ t: 4.2, jenis: "pintu", durasi: 0.9, posisi: rumah })`. Jenis di luar daftar KONTRAK diperingatkan di konsol.
- `JENIS`: himpunan jenis yang dikenali modul Suara.
- `daftarkan(obj, saluran, { mulai, hitung(t, acc), sebelum(acc) })` dan `daftarkanMandiri({ perbarui(t) })`: untuk menulis gerak baru di folder video dengan aturan yang sama. `acc` berisi `posisi`, `geser`, `skala`, `putar`, `hadap`, `opasitas`, `tumbuh`, `sambung`, `emas`, `nyala`, `denyut`.
- `KIT.peristiwa()` menggabungkan peristiwa gerak, `catat`, dan peristiwa struktur format, urut menurut `t`.
