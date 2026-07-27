# Situs Nur Ghina Muslimah

Situs personal untuk membaca dan menulis catatan, pemikiran, dan aktivitas.

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
| `SESSION_SECRET` | Opsional | **Wajib**, nilai acak panjang |
| `ADMIN_PASSWORD` | Opsional | **Wajib**, password kuat |
| `PORT` | Opsional, default 5000 | Opsional, default 5000 |

Di produksi server sengaja menolak menyala bila salah satu dari ketiga
variabel wajib itu kosong, supaya situs tidak pernah berjalan memakai
password bawaan atau kunci session yang bisa ditebak.

Perbedaan lain antara kedua lingkungan: di produksi server mengikat
`0.0.0.0` (agar terjangkau reverse proxy), memercayai satu lapis proxy,
menandai cookie session sebagai `secure`, dan menyimpan session di
PostgreSQL. Di pengembangan server mengikat `127.0.0.1` dan menyimpan
session di memori.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Bangun untuk produksi ke `dist/` |
| `npm start` | Jalankan hasil build |
| `npm run check` | Pemeriksaan tipe TypeScript |
| `npm run db:push` | Terapkan skema ke database |
| `npm run optimize-photos` | Ubah foto di `photo/` menjadi WebP siap web |

## Deploy ke VPS

1. Pasang Node.js 20+ dan PostgreSQL di server.
2. Buat database, lalu salin repositori ke server.
3. Atur environment variable di panel hosting — bukan lewat berkas `.env` yang di-commit:

   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://pengguna:sandi@host:5432/nama_basis_data
   SESSION_SECRET=<hasil node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   ADMIN_PASSWORD=<password kuat>
   ```

   Jangan memakai nilai contoh. Server akan menolak menyala bila salah satunya kosong.
4. Bangun dan jalankan:

```bash
npm ci
npm run db:push
npm run build
npm start
```

5. Jalankan sebagai layanan yang otomatis restart, misalnya lewat systemd atau pm2.
6. Letakkan di belakang reverse proxy (nginx/Caddy) yang menangani HTTPS.

Berkas yang diunggah lewat panel admin disimpan di `uploads/` pada akar proyek. Direktori ini tidak masuk repositori dan tidak terhapus saat build, jadi sertakan dalam cadangan.

## Struktur

```
client/src/
  components/sections/   Section halaman beranda
  components/ui/         Komponen shadcn/ui
  pages/                 Rute: Home, NoteDetail, PemikiranPage, Admin
  lib/site.ts            Identitas situs
server/                  Express, rute API, Drizzle
shared/schema.ts         Skema database
script/                  Skrip build dan optimasi foto
```

## Desain

Arah visual dan keputusan desain tercatat di `docs/superpowers/specs/`.
