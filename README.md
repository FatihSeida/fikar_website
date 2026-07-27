# Situs Ghina Nur Muslimah

Situs personal untuk membaca dan menulis catatan, pemikiran, dan aktivitas.

## Teknologi

- **Frontend:** React 18 + Vite, wouter, TanStack Query, Tailwind CSS, framer-motion
- **Backend:** Express 5, Drizzle ORM, PostgreSQL
- **Editor:** TipTap, dengan sanitasi HTML DOMPurify di sisi server

## Menjalankan secara lokal

Butuh Node.js 20+ dan PostgreSQL.

```bash
npm install
cp .env.example .env      # lalu isi nilainya
npm run db:push           # buat tabel
npm run dev               # http://localhost:5000
```

## Variabel lingkungan

| Nama | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL |
| `SESSION_SECRET` | Kunci penandatanganan session. Nilai acak panjang untuk produksi. |
| `ADMIN_PASSWORD` | Password panel admin di `/admin` |
| `PORT` | Port HTTP, default 5000 |

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
3. Buat `.env` berisi nilai produksi. Gunakan `SESSION_SECRET` acak dan `ADMIN_PASSWORD` yang kuat — jangan pakai nilai contoh.
4. Bangun dan jalankan:

```bash
npm ci
npm run db:push
npm run build
npm start
```

5. Jalankan sebagai layanan yang otomatis restart, misalnya lewat systemd atau pm2.
6. Letakkan di belakang reverse proxy (nginx/Caddy) yang menangani HTTPS.

Berkas yang diunggah lewat panel admin disimpan di `client/public/uploads/`. Sertakan direktori ini dalam cadangan.

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
