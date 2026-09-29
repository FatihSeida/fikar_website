# Situs Ahmad Zulfikar

Situs kandidat Ketua Umum PB HMI Ahmad Zulfikar, dengan pengalaman scrollytelling HMI Evidence, profil, pemikiran, catatan, dan galeri.

## Teknologi

- **Frontend:** React 18 + Vite, wouter, TanStack Query, Tailwind CSS, framer-motion
- **Backend:** Express 5, Drizzle ORM, PostgreSQL
- **Editor:** TipTap, dengan sanitasi HTML DOMPurify di sisi server

## Menjalankan secara lokal

Butuh Node.js 20+. PostgreSQL tidak wajib untuk sekadar melihat situsnya.

```bash
npm install
cp .env.example .env
npm run dev               # http://localhost:5000
```

Tanpa `DATABASE_URL`, situs berjalan memakai penyimpanan dalam memori dan
mengisi dirinya dengan data contoh saat boot. Cukup untuk mengembangkan
tampilan, tetapi setiap perubahan lewat panel admin hilang saat server
dimatikan.

Bila ingin data menetap saat pengembangan, isi `DATABASE_URL` di `.env`
lalu jalankan `npm run db:push` sekali untuk membuat tabelnya.

## Variabel lingkungan

| Nama | Pengembangan | Produksi |
|---|---|---|
| `DATABASE_URL` | Opsional — kosong berarti penyimpanan dalam memori | **Wajib** |
| `SESSION_SECRET` | Opsional | **Wajib**, minimal 32 karakter acak |
| `ADMIN_PASSWORD` | Opsional | **Wajib**, minimal 12 karakter |
| `PORT` | Opsional, default 5000 | Opsional, default 5000 |
| `BATAS_PERMINTAAN_AKTIF` | Opsional, default 200 | Opsional, default 200 |
| `BATAS_PER_IP_PER_MENIT` | Opsional, default 3000 | Opsional, default 3000 |
| `BATAS_API_PER_IP_PER_MENIT` | Opsional, default 600 | Opsional, default 600 |

Di produksi server sengaja menolak menyala bila salah satu dari ketiga
variabel wajib itu kosong, supaya situs tidak pernah berjalan memakai
password bawaan atau kunci session yang bisa ditebak.

Perbedaan lain antara kedua lingkungan: di produksi server mengikat
`0.0.0.0` (agar terjangkau reverse proxy), memercayai satu lapis proxy,
menandai cookie session sebagai `secure`, dan menyimpan session di
PostgreSQL. Di pengembangan server mengikat `127.0.0.1` dan menyimpan
session di memori.

## Pengamanan bawaan

- Percobaan login admin dibatasi dan sesi diperbarui setelah autentikasi berhasil.
- Permintaan mutasi lintas situs ditolak melalui pemeriksaan `Origin` dan `Sec-Fetch-Site`.
- Unggahan dibatasi 5 MB, hanya menerima JPEG, PNG, atau WebP, dan tanda tangan berkas diperiksa.
- Konten editor disanitasi dan seluruh masukan memiliki batas panjang serta format yang jelas.
- Header CSP, HSTS, anti-framing, MIME sniffing, referrer, dan permissions diterapkan di produksi.
- Server tidak mencatat isi respons API atau kredensial ke log.
- Perlindungan beban (`server/perlindungan.ts`): bila lebih dari `BATAS_PERMINTAAN_AKTIF` permintaan sedang ditangani sekaligus, permintaan baru langsung dijawab 503 dengan `Retry-After` alih-alih menumpuk di memori VPS. Beacon analytics dilepas lebih dulu saat server mulai penuh.
- Satu IP (IPv6 dihitung per blok /64) dibatasi `BATAS_PER_IP_PER_MENIT` permintaan per menit dan `BATAS_API_PER_IP_PER_MENIT` untuk API. Satu kunjungan pertama memicu sekitar 20 permintaan, jadi batas bawaan masih memuat sekitar 150 pengunjung baru per menit dari satu WiFi atau CGNAT. Naikkan sementara bila banyak orang membuka situs dari satu jaringan, misalnya di lokasi Kongres.
- Respons API publik (catatan, galeri, halaman) di-cache 30 detik di memori dan dikosongkan setiap kali admin mengubah konten.
- JS dan CSS dikompres brotli dan gzip saat build, lalu dikirim terkompresi oleh server.

Jalankan `npm audit` pada proses rilis untuk memastikan dependensi tetap bebas dari temuan yang telah diketahui.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Bangun untuk produksi ke `dist/` |
| `npm start` | Jalankan hasil build |
| `npm run check` | Pemeriksaan tipe TypeScript |
| `npm run db:push` | Terapkan skema ke database |
| `npm run optimize-ahmad-assets` | Optimalkan foto Ahmad dan visual scrollytelling menjadi WebP siap web |

## Deploy

Setiap push ke `main` otomatis ter-deploy lewat `.github/workflows/deploy.yml`.
Tidak ada langkah manual.

Build dijalankan di runner GitHub, bukan di VPS. VPS hanya punya 2 GB RAM dan
sudah melayani tiga situs lain, jadi menjalankan `vite build` di sana berisiko
kehabisan memori dan menjatuhkan situs-situs itu. Yang dikirim ke server hanya
`dist/` beserta `package.json` dan `package-lock.json`.

### Tempatnya di server

| | |
|---|---|
| Host | `103.179.57.165` (VPS IDCloudHost, Ubuntu 22.04) |
| Direktori | `~/fikar_website` |
| Port aplikasi | `5003` — hanya diakses nginx dari localhost |
| Proses | pm2, dengan nama `fikar-website` |
| Database | PostgreSQL `fikardb`, pengguna `fikaruser` |
| nginx | `/etc/nginx/sites-available/ahmadzulfikar.com` |

Port 5000–5002 sudah dipakai situs lain di VPS yang sama. Jangan pakai ulang.

Untuk pindah ke VPS lain, ikuti [docs/pindah-vps.md](docs/pindah-vps.md).

### Secret yang dibutuhkan repositori

`VPS_HOST`, `VPS_USER`, dan `VPS_SSH_KEY` — kunci SSH khusus deploy, terpisah
dari kunci pribadi, dan bisa dicabut sendiri tanpa mengganggu akses lain.

### Mengganti password admin

Rahasia produksi ada di `~/fikar_website/.env` di server, tidak pernah masuk
repositori:

```bash
ssh <pengguna>@103.179.57.165
nano ~/fikar_website/.env    # ubah ADMIN_PASSWORD
pm2 restart fikar-website --update-env
```

### Mengubah skema database

`npm run db:push` butuh drizzle-kit yang tidak terpasang di server. Hasilkan SQL
di lokal lalu terapkan:

```bash
npx drizzle-kit generate                       # tulis SQL ke migrations/
cat migrations/<berkas>.sql | ssh <pengguna>@103.179.57.165 \
  'cd ~/fikar_website && psql "$(grep ^DATABASE_URL= .env | cut -d= -f2-)" -v ON_ERROR_STOP=1 -f -'
```

Periksa dulu isi SQL-nya sebelum dijalankan — `generate` bisa menghasilkan
perintah yang menghapus kolom.

### Cadangan

Berkas yang diunggah lewat panel admin disimpan di `~/fikar_website/uploads/` di
server. Direktori ini tidak masuk repositori dan tidak tersentuh saat deploy,
jadi sertakan dalam cadangan bersama isi database.

## Struktur

```
client/src/
  components/sections/   Section halaman beranda
  components/ui/         Komponen shadcn/ui
  pages/                 Rute: Beranda, HMI Evidence, Tentang, Galeri, Catatan, Admin
  lib/site.ts            Identitas situs
server/                  Express, rute API, Drizzle
shared/schema.ts         Skema database
script/                  Skrip build dan optimasi foto
```

## Desain

Arah visual dan keputusan desain tercatat di `docs/superpowers/specs/`.
