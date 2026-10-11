# inti

Mesin, tema, ruang, waktu, tanah, kamera, dan bahan. Semuanya diimpor dari `../../kit/index.js`.
`buatVideo()` (lihat `halaman.md`) sudah merangkai mesin, kamera, tanah, dan cahaya; bagian ini dipakai untuk membangun benda dan mengatur waktu.

## Contoh

```js
import { buatVideo, formatIndikator, jadwalIndikator, titik, W, bahanPadat, kotakBulat, garisTepi, setelKeadaan, halus, rentang } from "../../kit/index.js";

const v = buatVideo({ format: formatIndikator({ nomor: "07", kategori: "TATA KELOLA", judul: "…" }),
                      kamera: jadwalIndikator({ fokus: titik(0, 0, 0.8) }) });
const meja = kotakBulat(2.0, 0.2, 1.2, bahanPadat(W.zamrudRedup), { alas: true });
meja.add(garisTepi(meja));                       // tepi zamrudPijar 2 px
meja.position.copy(titik(-1, 2));
meja.userData = { nama: "meja", penting: true };
v.tambah(meja);
v.setiapFrame((t) => setelKeadaan(meja, "abu", 1 - halus(rentang(t, 12, 12.8))));
```

## waktu (`inti/waktu.js`, murni, bisa dipakai di Node)

| Fungsi | Arti |
|---|---|
| `klem(x, a=0, b=1)`, `campur(a, b, k)` | jepit, interpolasi linear |
| `rentang(t, a, b)` | posisi t di [a, b], 0..1 |
| `halus(x)`, `keluar3(x)`, `masukKeluar3(x)`, `lenting(x, s=1.7)` | easing |
| `jendela(t, a, b, masuk=0.3, keluar=0.3)` | 1 di dalam [a, b] dengan tepi halus |
| `pegas(dt, laju=12, frek=22)` | getaran teredam, 1 pada dt 0. Skala klik: `1 + 0.25 * pegas(t - t0)` |
| `acak(benih)` | fungsi acak berbenih (mulberry32). Satu-satunya sumber acak yang boleh dipakai |
| `waktuBeku(mulai, henti, { lanjut, landai=0.4 })` | jam τ(t) yang melambat lalu berhenti; `τ.laju(t)` = dτ/dt. Dengan `lanjut`, jam berjalan lagi mulai detik itu (paling cepat `henti`), lajunya naik 0 → 1 selama `landai` detik, dan τ meneruskan dari nilai bekunya. `τ.henti`, `τ.lanjut` menyimpan kedua detik. Di gerak cukup `beku: { lanjut }` (`gerak.md`) |

## tema (`inti/tema.js`)

- `W`: token warna aktif (`THREE.Color`) = palet B.5: `latar grid gridMayor pelat zamrud zamrudPijar zamrudRedup emas emasPijar krem kertas abu abuGelap pion`, ditambah `zamrudTerang` (khusus teks label CERMIN).
- `PALET`: string HSL aslinya.
- `buatTema(ubah)`: tema baru, mis. `buatTema({ emas: "hsl(45, 60%, 60%)" })`. Pasang lewat `buatVideo({ tema })`; isi `W` diganti di tempat dan variabel CSS `--emas`, `--zamrud-terang`, … ikut berubah. Bangun benda sesudah `buatVideo()`.
- `cssWarna(nama, alfa)`, `varWarna(nama)`: string CSS dari token.

## ruang (`inti/ruang.js`)

- `titik(r, d, y=0)`: r ke kanan layar, d ke bawah layar (mendekati penonton), y ke atas. 1 unit = 1 sel grid.
- `keRD(v)`: kebalikan `titik`. `KANAN`, `BAWAH`, `NAIK`, `DEG`, `ISO` (35.26°).
- `sudutLayar(r, d)`: rotasi y supaya sisi +z lokal menghadap arah layar itu.
- `hadapKamera(obj)`: bidang xy benda selalu menghadap kamera (untuk balon, papan).
- `keLayar(pos, kamera, ukuran)` → `{ x, y }` piksel; di video cukup `v.keLayar(pos)`.
- `kotakLayar(obj, kamera, ukuran)` → `{ x0, y0, x1, y1 }` piksel (dipakai `periksaZona`). Mesh tak terlihat, bahan dengan opacity < 0.1, dan mesh yang dirinya atau salah satu induknya ber-`userData.abaikanZona` dilewati.
- Sisi benda yang terlihat kamera: +x (kanan bawah layar) dan +z (kiri bawah layar), plus atas.

## kamera (`inti/kamera.js`)

Ortografis isometrik, azimut 45°, elevasi 35.26°, tidak pernah berputar. Yang berubah hanya tinggi frustum `H` (unit dunia dari atas ke bawah layar) dan titik fokus, yang selalu jatuh di piksel fokus (format indikator: 540, 1010).

- `jadwalKamera({ awal: { H, fokus }, kunci: [{ t: [a, b], H?, fokus?, naik?, kurva? }] })` → fungsi `t → { H, fokus }`. Tiap kunci membaur dari keadaan sebelumnya (bawaan `masukKeluar3`). `naik` menggeser fokus ke atas relatif.
- `jadwalIndikator({ fokus, cermin: { fokus, H, t }, langkah: { fokus, H, t }, akhir: { H, naik, t }, awal: { H } })`: preset C.6 (0–1.2 H 19→16; 6–7 H 12 ke benda cermin; 12–13 H 16; 18–19.5 H 21, fokus naik 0.8). Untuk prompt yang fokusnya titik(0, 0, 0.8): `jadwalIndikator({ fokus: titik(0, 0, 0.8) })`.
- `jadwalEvidence({ fokus, awal, gejala, sebab, ikhtiar, kuis, akhir, tambahan })`: jadwal format evidence (Prompt 00 bagian C), dibangun di atas `jadwalKamera`; bawaan kamera `formatEvidence`. Tiap bagian berbentuk `{ t, H, fokus }` dan boleh diganti sebagian. Semua kunci `masukKeluar3`:

  | Kunci | `t` | `H` | Fokus |
  |---|---|---|---|
  | `awal` | – | 13 | `fokus` (bawaan `titik(0, 0)`) |
  | `gejala` | 0–1.2 | 11 | `gejala.fokus ?? fokus` |
  | `sebab` | 6.0–7.0 | 8 | `sebab.fokus ?? fokus` |
  | `ikhtiar` | 13.0–14.0 | 11 | `ikhtiar.fokus ?? fokus` |
  | `kuis` | 23.0–24.0 | **14** (Prompt 00: 12; lihat penyimpangan di bawah) | `kuis.fokus ?? fokus`; isi dengan `segmenKuis(...).fokus` |
  | `akhir` | 28.0–29.5 | 15 | fokus sebelumnya, naik `akhir.naik` (bawaan 0.8) |

  **Penyimpangan dari Prompt 00: H kuis 14, bukan 12.** Dengan tata letak terowongan `segmenKuis` yang ditetapkan Prompt 00 bagian E, fokus di titik tengah P dan E, dan H 12, atap komisariat di P (komisariat diam di P sampai m + 1.0 = 24.0) berada di dalam zona kepala y < 600, tempat kartu pertanyaan, dan ujung kanan komisariat di E hanya ±5 px dari tepi frame. Diukur pada `contoh-evidence` (`periksaZona`, kotak layar; "y0" = tepi atas kotak, zona mulai y 600):

  | H kuis | komisariat y0 di t 24.0 / 24.5 | lengkung 1 y0 di t 24.5 / 26.8 | hasil di titik periksa 24.5 dan 26.8 |
  |---|---|---|---|
  | 12 | 503 / 555 | 562 / 562 | melanggar (atas): komisariat di 24.5, lengkung 1 di keduanya |
  | 13 | 542 / 590 | 596 / 596 | melanggar (atas): komisariat di 24.5, lengkung 1 di keduanya |
  | **14** | 575 / di dalam zona | di dalam zona | **lolos** |

  Bagian G Prompt 00 mengharuskan zona aman di semua titik periksa dan prompt indikator memakai kunci kuis bawaan, jadi bawaan `jadwalEvidence` diganti ke H 14 (H bulat terkecil yang lolos di 24.5 dan 26.8; lihat juga catatan kotak torus di `gerak.md`). Pada H 14 atap komisariat di P masih 18–25 px di atas y 600 selama t 23.8–24.2 (kotak pembatas geometri; tepi kotak itu berada di pita pudar kabut atas y 420–600 dan jauh di bawah kartu pertanyaan, yang berakhir di y ≈ 512), jadi titik periksa di antara itu (mis. `--titik 24`) melaporkan komisariat keluar zona atas. Untuk menghilangkannya sama sekali pakai H 15 (`kuis: { fokus: seg.fokus, H: 15 }`). `kuis: { H: 12 }` memulihkan bawaan Prompt 00.

  `tambahan` adalah array kunci bebas `{ t: [a, b], H?, fokus?, naik?, kurva? }` untuk geseran kamera di tengah bagian; `t` wajib. Semua kunci (utama dan tambahan) diurutkan menurut awal `t` (stabil, kunci utama dulu bila awalnya sama), karena tiap kunci membaur dari keadaan sebelumnya; `H` atau `fokus` yang kosong pada kunci tambahan berarti keadaan sebelumnya. Kamera tetap ortografis isometrik dan tidak pernah berputar. Contoh (indikator 01): `jadwalEvidence({ fokus: d.fokus, gejala: { fokus: fokusUntuk([gerbang, komisariat], { H: 11 }) }, sebab: { fokus: fokusUntuk([gerbang, kartu1, kartu3], { H: 8 }) }, ikhtiar: { fokus: fokusUntuk([gerbang, grafik, papan], { H: 11 }) }, tambahan: [{ t: [17.5, 18.5], H: 11, fokus: fokusUntuk([papan, komisariat], { H: 11 }) }], kuis: { fokus: seg.fokus } })`.
- Fokus yang bergantung pada benda: `let j; buatVideo({ kamera: (t) => j(t) }); …bangun… j = jadwalIndikator({...})` (sama untuk `jadwalEvidence`).
- `fokusUntuk(benda | [benda, titik, ...], { H=16, zona, piksel, y=0 })` → Vector3: fokus yang menaruh kotak layar gabungan benda (aturan `kotakLayar`) tepat di tengah zona adegan pada tinggi `H`. Bawaannya zona video dan piksel fokus format. Posisi benda dibaca saat dipanggil, jadi panggil sesudah dunia dan benda diletakkan. Karena kamera ortografis, semua titik di sepanjang arah pandang memberi gambar yang sama; `y` memilih tingginya (bawaan 0: titik tanah di piksel fokus, tempat pudar tanah dan kotak bayangan berpusat). Bila benda lebih besar daripada zona pada H itu, konsol memberi peringatan. Contoh: `jadwalIndikator({ fokus: fokusUntuk(d.urutan), cermin: { fokus: fokusUntuk([badko, jembatanCabang], { H: 12 }), H: 12 } })`. Fokus yang sudah tepat (mis. `d.fokus` dunia kit) tidak perlu diganti.
- `buatKamera({ ukuran, piksel, azimut, elevasi })`: dipakai `buatVideo`; `v.rig.keadaan.H` = tinggi frustum saat ini (berguna untuk skala label). `v.rig.azimut`, `v.rig.elevasi`, `v.rig.piksel` menyimpan pengaturannya.

## Pemeriksaan zona (`KIT.periksaZona`, di `video.js`)

`periksaZona(t)` menghitung adegan pada detik `t`, lalu memeriksa setiap benda penting yang tampak (semua induknya `visible`, opasitas efektif ≥ 0.5). Kotak layarnya dari `kotakLayar`, dibandingkan dengan zona format.

- `userData.penting`: `true`/`false`, atau fungsi `(t) => boolean` yang dievaluasi pada detik pemeriksaan. Contoh untuk zoom Cermin, saat benda latar memang terpotong: `b.userData.penting = (t) => !(t > 6.0 && t < 13.0)`. Tidak perlu lagi menyetel `penting` di `v.setiapFrame`.
- `userData.abaikanZona = true` berlaku untuk benda itu **dan seluruh isinya**. Pada kelompok, semua mesh di dalamnya tidak dihitung dalam kotak induknya, dan benda penting di dalamnya tidak diperiksa. Pada mesh (cincin pion, genangan sorot), hanya mesh itu yang dilewati, seperti sebelumnya.

## mesin (`inti/mesin.js`)

`buatMesin({ kanvas, ukuran, kamera, bloom, cahaya })`: renderer (`preserveDrawingBuffer`, pixel ratio 1, tanpa tone mapping, bayangan PCFSoft), scene, komposer HalfFloat MSAA 4×, `UnrealBloomPass` (`BLOOM`: kekuatan 0.5, radius 0.5, ambang 0.74), `OutputPass`. Cahaya `CAHAYA`: hemisfer 1.6, matahari 2.6 dari arah (−0.32, 1, 0.78), mengikuti fokus kamera. Dengan cahaya ini hanya emissive emas yang melewati ambang bloom. Pengecualiannya permukaan lengkung berwarna `kertas` atau `krem` penuh: muka yang menghadap matahari memantulkan sampai ±1.0 × luminans albedo (linear), ditambah ±0.03 spekular. Untuk kertas angkanya ±0.76, di atas ambang 0.74, jadi benda kertas lengkung memakai kertas yang diredupkan (lihat `docs/benda-*.md`). Uji ulang lewat katalog (`docs/katalog.md`): pada keadaan biasa, denyut, abu, dan pudar, bloom tidak mengubah satu piksel pun kecuali di benda emas. Akses lewat `v.mesin`, `v.scene`, `v.renderer`.

## tanah (`inti/tanah.js`)

`buatTanah({ luas=300, jari=20, nyala=[a, b], bayangan=0.5 })`: shader grid (garis 1 unit warna `grid`, mayor 5 unit `gridMayor`), pudar radial dari fokus kamera, radius nyala 0 → `jari` selama `nyala`. `buatVideo` memasangnya otomatis (format indikator: nyala 0–0.6); `tanah: false` untuk mematikan.

## bahan (`inti/bahan.js`)

| Fungsi | Isi |
|---|---|
| `bahanPadat(warna=W.zamrudRedup, opsi)` | MeshStandardMaterial roughness 0.8, metalness 0 |
| `bahanKaca(warna=W.zamrud, opsi)` | transparan opacity 0.28, depthWrite mati; pasangkan dengan `garisTepi` |
| `bahanPijar(warna, kuat=1)` | MeshBasic untuk titik cahaya; `kuat` > 1 berpendar |
| `bahanGaris(warna=W.zamrudPijar, lebar=2, opasitas=1)` | LineMaterial (piksel) |
| `kotakBulat(w, h, d, bahan, { radius=0.06, alas=false, bayangan=true })` | RoundedBoxGeometry; `alas: true` = titik asal di tengah alas |
| `garisTepi(sumber, { warna, lebar=2, opasitas, bahan })` | LineSegments2: `[w,h,d]`, `{w,h,d,alas}`, mesh `kotakBulat` (12 rusuk), atau geometri lain (EdgesGeometry 30°). Tambahkan sebagai anak mesh |
| `garisJalur(titik[], { warna, lebar, bagi=48 })`, `tampakGaris(garis, k)` | garis jalur yang bisa ditampakkan bertahap |
| `garisDari(posisi[], bahan)` | LineSegments2 dari pasangan titik |
| `aturOpasitas(obj, a)` | opasitas benda × opasitas dasar bahan × opasitas efektif induknya. Anak yang punya opasitas sendiri ikut dikalikan |
| `opasitasEfektif(obj)` | `userData.opasitas` benda dikali milik semua induknya (yang kosong = 1). Pakai ini, bukan `obj.userData.opasitas`, bila benda mengatur opacity bahannya sendiri |
| `setelKeadaan(obj, nama, nilai)` | lihat di bawah |
| `kurvaNyala(dt)`, `nilaiDenyut(t, mulai, selesai)`, `EMAS`, `DENYUT`, `PUDAR` | nilai standar B.6 dan D |

Keadaan (`setelKeadaan`, juga dipakai gerak): `"emas"` 0..1 (warna ke `W.emas`, emissive emasPijar 0.9 × nilai), `"nyala"` (emissive emas langsung, 0 → 1.4 → 0.9 saat klik), `"denyut"` 0..1 (tepi zamrudPijar + emissive 0.5 × nilai; pada bahan terang emissive dikecilkan, lihat aturan di bawah), `"abu"` 0..1 (warna ke `W.abu` atau `bahan.userData.warnaAbu`), `"pudar"` 0..1 (warna ke `abuGelap`, opacity ke 0.15). Sasaran diambil dari `userData.bagian.emas`, `.denyut`, `.tepi` bila ada; selain itu semua mesh. Benda boleh punya `userData.setelKeadaan(nama, nilai)` sendiri; kembalikan `false` untuk menyerahkan ke penanganan bawaan.

Aturan penting:
- Setel keadaan dan opasitas setiap frame tanpa syarat (nilai 0 untuk mati), supaya lompat waktu tetap persis.
- Benda yang digerakkan harus punya bahannya sendiri; bahan yang dipakai bersama ikut berubah semua.
- Bahan dijadikan transparan sekali untuk selamanya saat pertama dipudarkan, tidak pernah dibolak-balik (program shader tetap sama di setiap urutan render).
- **Opasitas bersarang.** Opasitas yang tampak adalah opasitas efektif: milik benda dikali milik semua induknya. Benda di dalam kelompok yang `muncul` atau `hilang` ikut memudar, dan hasilnya tidak bergantung pada urutan gerak kelompok dan anaknya. Garis tepi denyut juga ikut. Ubah `userData.opasitas` hanya lewat `aturOpasitas`. Menulisnya langsung tidak memperbarui bahan sampai panggilan berikutnya, dan nilai lama dari frame sebelumnya akan terbawa.
- **Denyut tidak pernah bloom.** Emissive denyut (zamrudPijar × 0.5, luminans ±0.18) dikalikan `(0.72 − (L + 0.03)) / 0.18`, dijepit 0..1. L adalah luminans linear warna bahan saat itu, sesudah abu, pudar, dan emas. Hasilnya: bahan dengan L ≤ 0.51 (semua token zamrud, pelat, abu, abuGelap, emas) tetap berdenyut penuh, pion (L 0.62) sekitar 0.38, sedangkan kertas dan krem 0, sehingga berdenyut hanya lewat garis tepinya. Benda yang sudah menyaring `bagian.denyut` ke bahan gelap tidak berubah.
