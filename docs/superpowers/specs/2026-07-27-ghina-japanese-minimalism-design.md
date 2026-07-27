# Redesain Situs Personal Ghina Nur Muslimah

Tanggal: 2026-07-27

## Ringkasan

Situs saat ini adalah portfolio atas nama "Dewi Valentin" dengan gaya minimalis-monokrom beraksen merah. Situs akan di-rebrand penuh menjadi situs personal **Ghina Nur Muslimah** — ruang untuk membaca dan menulis pemikiran serta catatan aktivitas — dengan arah visual **Japanese Minimalism**.

Fitur tidak bertambah dan tidak berkurang. Yang berubah: identitas, konten, seluruh lapisan visual, dan pelepasan ketergantungan platform Replit karena situs akan dijalankan di VPS.

## Konteks Subjek

Sumber: profil Instagram publik [@nurghinaa](https://www.instagram.com/nurghinaa/) dan lima foto studio di folder `photo/`.

- Bio: *"fatum brutum amor fati"*
- Afiliasi: PB HMI (periode 24/26), OIC Youth Indonesia, awardee Beasiswa Unggulan
- Pendidikan: alumnus UIN Palangkaraya, sedang menempuh M.Ak
- Lokasi saat ini: Konya, Turki
- Foto: lima potret studio berlatar putih dengan atribut HMI (selempang hijau-hitam, medali HMI)

Konteks ini menjadi bahan naskah Hero, section Tentang/Filosofi, dan Footer.

## Arah Visual

### Palet

| Peran | Nama | Nilai |
|---|---|---|
| Latar utama | rice paper | `#F7F3EC` |
| Teks & heading | ink black | `#1C1A17` |
| Aksen, CTA, garis | muted clay | `#B97455` |
| Aksen sekunder, hover | pale moss | `#A9B79C` |
| Latar section alternatif | white & peach | `#F1DDD1` |

Radius sudut tetap `0rem`. Aksen merah lama (`#C8392B`) dihapus seluruhnya.

### Tipografi

- Heading: **Noto Serif** (menggantikan Playfair Display)
- Body, navigasi, kontrol: **DM Sans** (dipertahankan)
- DM Mono dihapus. Label/eyebrow kecil memakai DM Sans dengan `letter-spacing` lebar dan ukuran kecil.

Keterbacaan: `line-height` body minimal 1.8, lebar baca dibatasi ~65–70 karakter, ukuran body minimal 16px pada desktop.

### Tekstur dan Bayangan

- `NoiseOverlay` yang ada diganti menjadi paper grain halus — opacity rendah, butiran lembut menyerupai serat kertas, bukan noise tajam.
- Bayangan lembut dan menyebar (natural), bukan bayangan tajam berkontras tinggi.

### Komposisi

- Layout asimetris terinspirasi komposisi cetak: rasio kolom ganjil (mis. `1.1fr / 0.9fr`), bukan pembagian rata 50/50.
- Ruang kosong sebagai elemen desain, bukan sisa.
- Fotografi, tipografi, dan spasi yang membawa desain — bukan ornamen.

### Animasi

Nyaris tak terlihat:
- Fade masuk lambat dengan pergeseran kecil (≤ 12px), durasi 0.8–1.2 detik
- Image mask lambat saat galeri masuk viewport
- Gerakan garis tipis sebagai aksen
- Transisi antar section yang halus

Wajib menghormati `prefers-reduced-motion`: seluruh animasi dinonaktifkan bila pengguna memilihnya.

### Yang Dihindari

Grid padat, kartu mengkilap, gradien terang (termasuk gradien merah-oranye pada judul saat ini), copy penjualan agresif, ikon dekoratif.

## Struktur Halaman

### Beranda (`/`)

1. **Hero** — foto `DSC00042.jpg` (hadap depan, tangan terkatup) sebagai satu-satunya gambar. Pernyataan singkat, satu CTA. Tanpa headline gradien.
2. **Tentang / Filosofi** (baru) — potret singkat dan nilai yang dipegang, disusun dari konteks subjek di atas.
3. **Galeri** — empat foto sisanya (`DSC00098`, `DSC00190`, `DSC00265`, `DSC00385`) dalam layout editorial asimetris. Sumber data tetap tabel `gallery`.
4. **Pemikiran & Ide** — sumber tetap tabel `pages` slug `pemikiran-ide`. Hanya tipografi yang di-restyle.
5. **Catatan & Aktivitas** — sumber tetap tabel `notes`. Section gelap berkontras keras yang sekarang diganti menjadi nuansa kertas.
6. **Kontak** — CTA sederhana (mailto). Menggantikan slot "booking/purchase" dari referensi gaya, yang tidak relevan untuk situs personal.
7. **Footer** — minimal: nama, tahun, tautan Instagram [@nurghinaa](https://www.instagram.com/nurghinaa/). Tautan sosial lain yang tidak diketahui akunnya tidak ditampilkan.

### Halaman Lain

- `/catatan/:slug` — detail catatan
- `/pemikiran-ide` — halaman penuh Pemikiran & Ide
- `/admin` — dashboard admin

Ketiganya ikut di-restyle warna dan tipografinya agar konsisten. Fungsi tidak berubah.

## Konten

Seluruh naskah Hero, Tentang/Filosofi, dan Kontak ditulis sebagai draf awal dalam Bahasa Indonesia dengan nada tenang dan tidak berlebihan, lalu dapat diedit pemilik situs melalui panel admin.

Konten Galeri, Pemikiran & Ide, dan Catatan & Aktivitas tetap berasal dari database dan dikelola lewat admin seperti sekarang.

## Migrasi dari Replit

Situs akan dijalankan di VPS. Seluruh ketergantungan platform Replit dilepas.

### Dihapus

- Berkas `.replit`
- DevDependency `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal` beserta pemakaiannya di `vite.config.ts`
- Alias `@assets` yang menunjuk `attached_assets/`, beserta folder `attached_assets/` (berisi aset lama yang tidak lagi dipakai)

### Ditambah / Diubah

- Foto baru ditempatkan di `client/src/assets/` dan diimpor langsung oleh komponen.
- Berkas `.env` lokal beserta `.env.example` berisi `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD` — nilai-nilai ini sebelumnya disuplai oleh secrets Replit. `.env` masuk `.gitignore`; `.env.example` di-commit tanpa nilai rahasia.
- Skrip `dev` di `package.json` memakai penetapan variabel lingkungan yang lintas-platform, karena sintaks `NODE_ENV=... tsx ...` saat ini gagal di Windows.
- Skrip seed untuk mengisi data awal: satu baris `pages` (`pemikiran-ide`), beberapa `notes` contoh, dan empat item `gallery` dari foto — agar situs tidak kosong saat pertama dijalankan.
- `replit.md` diganti menjadi `README.md` berisi cara menjalankan, variabel lingkungan yang dibutuhkan, dan cara deploy ke VPS.

### Tetap

Database tetap PostgreSQL melalui `pg` + Drizzle ORM. Kode saat ini sudah portabel dan hanya membutuhkan `DATABASE_URL`, sehingga berjalan pada Postgres manapun di VPS. Skema tabel tidak berubah.

## Aksesibilitas

- Kontras teks memenuhi WCAG AA (rasio ≥ 4.5:1 untuk teks normal). Kombinasi ink `#1C1A17` di atas rice paper `#F7F3EC` memenuhi ini dengan lapang. Clay `#B97455` hanya dipakai untuk teks berukuran besar, garis, atau elemen non-teks — tidak untuk body kecil.
- Setiap gambar memiliki `alt` deskriptif.
- Fokus keyboard terlihat jelas pada seluruh elemen interaktif.
- Struktur heading berurutan tanpa melompati tingkat.
- `prefers-reduced-motion` dihormati.
- Navigasi dapat dioperasikan sepenuhnya dengan keyboard.

## Performa

- Lima foto sumber berukuran 1.7–2.6 MB (4000×6000 piksel) — terlalu besar untuk web. Foto dikompresi dan diubah ukurannya sebelum dipakai: lebar maksimum 1600px untuk hero, 1200px untuk galeri, format WebP dengan fallback JPEG.
- Gambar galeri dimuat dengan `loading="lazy"`; gambar hero dimuat eager.
- Font dimuat dengan `display=swap` dan dibatasi hanya pada bobot yang benar-benar dipakai.

## Responsif

Tiga breakpoint mengikuti konvensi Tailwind yang sudah dipakai: mobile (default), `md` (≥768px), `lg` (≥1024px). Layout asimetris dua kolom runtuh menjadi satu kolom pada mobile dengan urutan yang tetap masuk akal saat dibaca.

## Di Luar Lingkup

- Tidak ada fitur baru pada panel admin
- Tidak ada perubahan skema database
- Tidak ada penambahan halaman baru di luar yang sudah ada
- Tidak ada refaktor pada komponen `ui/` (shadcn) selain penyesuaian token warna yang mengalir dari CSS variable
