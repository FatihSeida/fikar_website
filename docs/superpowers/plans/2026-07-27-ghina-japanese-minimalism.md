# Redesain Situs Ghina Nur Muslimah — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah situs portfolio "Dewi Valentin" menjadi situs personal Ghina Nur Muslimah bergaya Japanese minimalism, sekaligus melepas seluruh ketergantungan Replit agar bisa dijalankan di VPS.

**Architecture:** Fitur, rute, dan skema database tidak berubah. Perubahan terjadi di tiga lapisan: (1) token desain di `client/src/index.css` + `tailwind.config.ts` yang mengalir ke seluruh komponen, (2) `client/src/pages/Home.tsx` yang saat ini berisi lima komponen section inline dipecah menjadi berkas terpisah di `client/src/components/sections/` agar tiap section punya satu tanggung jawab dan mudah diedit, (3) konfigurasi build/runtime yang dibersihkan dari Replit dan diberi pemuatan `.env`.

**Tech Stack:** React 18 + Vite 7, Tailwind CSS 3, framer-motion, wouter, Express 5, Drizzle ORM + PostgreSQL, sharp (baru, untuk optimasi foto).

---

## Catatan Verifikasi

Repositori ini **tidak punya framework test sama sekali** (tidak ada vitest/jest, tidak ada berkas test, tidak ada skrip `test` di `package.json`). Spec secara eksplisit menempatkan penambahan infrastruktur baru di luar lingkup, dan pekerjaan ini adalah redesain visual yang nilainya dinilai dengan mata, bukan dengan assertion.

Karena itu loop verifikasi tiap task adalah:

1. `npm run check` — TypeScript compiler, menangkap error tipe/impor/nama berkas
2. `npm run build` — memastikan Vite + esbuild berhasil membangun produksi
3. Pemeriksaan di browser pada `http://localhost:5000` untuk task yang mengubah tampilan

Ini bukan pengganti test otomatis. Setiap klaim "berhasil" harus disertai keluaran perintah yang benar-benar dijalankan.

## Prasyarat

Sebelum Task 1, pastikan hal berikut terpenuhi. Keduanya memblokir seluruh pekerjaan.

- [ ] **`node_modules` kosong — jalankan install**

```bash
npm install
```

- [ ] **Butuh database PostgreSQL lokal**

PostgreSQL 17 sudah terpasang dan servicenya berjalan di mesin ini (`postgresql-x64-17`). Buat database untuk pengembangan. Ganti `<PASSWORD>` dengan password user `postgres` di mesin ini:

```bash
"/c/Program Files/PostgreSQL/17/bin/createdb.exe" -U postgres -h 127.0.0.1 ghina_dev
```

Perintah akan meminta password secara interaktif. Jika password tidak diketahui, tanyakan ke pemilik mesin — jangan menebak.

Connection string yang dihasilkan: `postgresql://postgres:<PASSWORD>@127.0.0.1:5432/ghina_dev`

## Struktur Berkas

**Dibuat:**

| Berkas | Tanggung jawab |
|---|---|
| `.env` | Nilai rahasia lokal. Tidak di-commit. |
| `.env.example` | Daftar variabel yang dibutuhkan, tanpa nilai rahasia. Di-commit. |
| `README.md` | Cara menjalankan, variabel lingkungan, cara deploy ke VPS. |
| `script/optimize-photos.ts` | Mengubah 5 foto 4000×6000 menjadi WebP siap web. |
| `client/src/lib/site.ts` | Konstanta identitas situs (nama, tautan sosial) di satu tempat. |
| `client/src/components/PaperGrain.tsx` | Tekstur serat kertas. Menggantikan `NoiseOverlay`. |
| `client/src/components/sections/Hero.tsx` | Section pembuka. |
| `client/src/components/sections/About.tsx` | Section Tentang / Filosofi. |
| `client/src/components/sections/Gallery.tsx` | Galeri editorial asimetris. |
| `client/src/components/sections/Pemikiran.tsx` | Ringkasan Pemikiran & Ide. |
| `client/src/components/sections/Notes.tsx` | Daftar Catatan & Aktivitas. |
| `client/src/components/sections/Contact.tsx` | Ajakan berbincang. |
| `client/src/components/sections/SiteFooter.tsx` | Footer minimal. |
| `client/src/assets/potret-utama.webp` | Foto hero hasil optimasi (dihasilkan Task 2). |
| `client/public/galeri/galeri-0{1..4}.webp` | Foto galeri hasil optimasi (dihasilkan Task 2). |

**Diubah:**

| Berkas | Perubahan |
|---|---|
| `package.json` | Hapus 3 devDependency Replit; tambah `sharp`, `cross-env`, `dotenv`; skrip `dev` lintas-platform; tambah skrip `optimize-photos`. |
| `vite.config.ts` | Hapus plugin Replit dan alias `@assets`. |
| `drizzle.config.ts` | Muat `.env`. |
| `server/index.ts` | Muat `.env` di baris paling atas. |
| `server/routes.ts` | Ganti data seed agar sesuai identitas baru. |
| `client/index.html` | Ganti ~25 keluarga font menjadi Noto Serif + DM Sans saja; `lang="id"`; judul halaman. |
| `client/src/index.css` | Seluruh token warna, font, dan utilitas aksesibilitas. |
| `tailwind.config.ts` | Peta `fontFamily`. |
| `client/src/components/Navbar.tsx` | Identitas, warna, tautan. |
| `client/src/components/SectionHeader.tsx` | Gaya baru. |
| `client/src/pages/Home.tsx` | Menjadi komposisi tipis dari section. |
| `client/src/pages/NoteDetail.tsx` | Restyle. |
| `client/src/pages/PemikiranPage.tsx` | Restyle. |
| `client/src/pages/Admin.tsx` | Restyle ringan (nama + warna). |
| `client/src/pages/not-found.tsx` | Restyle + terjemahan Bahasa Indonesia. |
| `.gitignore` | Tambah `.env`, `client/public/galeri`. |

**Dihapus:**

| Berkas | Alasan |
|---|---|
| `.replit` | Konfigurasi platform Replit. |
| `replit.md` | Digantikan `README.md`. |
| `attached_assets/` | Aset situs lama, tidak dipakai lagi. |
| `client/src/components/NoiseOverlay.tsx` | Digantikan `PaperGrain.tsx`. |

## Token Warna

Nilai HSL di bawah sudah dihitung dari hex di spec dan **rasio kontrasnya sudah diverifikasi**:

| Token | Hex | HSL | Kontras di atas rice paper |
|---|---|---|---|
| `--background` (rice paper) | `#F7F3EC` | `38 41% 95%` | — |
| `--foreground` (ink) | `#1C1A17` | `36 10% 10%` | 15.7:1 ✅ AAA |
| `--muted-foreground` | `#5B5548` | `41 12% 32%` | 6.8:1 ✅ AA |
| `--primary` / `--clay-deep` | `#8F5539` | `19 43% 39%` | 5.4:1 ✅ AA — untuk teks kecil |
| `--accent` / clay | `#B97455` | `19 42% 53%` | 3.3:1 ⚠️ hanya garis & teks besar |
| `--moss` | `#A9B79C` | `91 16% 67%` | 1.7:1 ⚠️ hanya elemen non-teks |
| `--peach` | `#F1DDD1` | `23 53% 88%` | — latar |
| `--border` | `#E3DACB` | `38 30% 84%` | — garis |

**Aturan yang mengikat:** clay `#B97455` dan moss tidak boleh dipakai untuk teks berukuran normal. Label kecil dan eyebrow memakai `--primary` (`#8F5539`).

---

### Task 1: Lepas Replit, siapkan env lokal

**Files:**
- Delete: `.replit`
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `drizzle.config.ts`
- Modify: `server/index.ts:1`
- Create: `.env.example`
- Create: `.env`
- Modify: `.gitignore`

- [ ] **Step 1: Hapus berkas dan folder Replit**

```bash
rm -f .replit
rm -rf attached_assets
```

- [ ] **Step 2: Copot dependensi Replit, pasang yang dibutuhkan**

```bash
npm uninstall @replit/vite-plugin-cartographer @replit/vite-plugin-dev-banner @replit/vite-plugin-runtime-error-modal
npm install dotenv
npm install --save-dev sharp cross-env
```

- [ ] **Step 3: Perbarui skrip di `package.json`**

Ganti blok `"scripts"` menjadi:

```json
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "build": "tsx script/build.ts",
    "start": "cross-env NODE_ENV=production node dist/index.cjs",
    "check": "tsc",
    "db:push": "drizzle-kit push",
    "optimize-photos": "tsx script/optimize-photos.ts"
  },
```

Alasan `cross-env`: sintaks `NODE_ENV=... perintah` adalah sintaks shell POSIX dan gagal di Windows, sedangkan situs ini dikembangkan di Windows dan akan dijalankan di VPS Linux.

- [ ] **Step 4: Bersihkan `vite.config.ts`**

Ganti seluruh isi berkas dengan:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

- [ ] **Step 5: Muat `.env` di server**

Di `server/index.ts`, sisipkan dua baris ini sebagai **baris paling atas berkas**, sebelum impor lain, karena `./routes` secara transitif mengimpor `./db` yang membaca `process.env.DATABASE_URL` saat modul dimuat:

```ts
import "dotenv/config";
```

Sehingga awal berkas menjadi:

```ts
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
```

- [ ] **Step 6: Muat `.env` di `drizzle.config.ts`**

Ganti seluruh isi berkas dengan:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum diatur. Salin .env.example menjadi .env lalu isi nilainya.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

- [ ] **Step 7: Buat `.env.example`**

```
# Koneksi PostgreSQL. Di VPS, ganti host/user/password sesuai server.
DATABASE_URL=postgresql://user:password@127.0.0.1:5432/ghina

# Kunci penandatanganan session. Buat nilai acak panjang untuk produksi:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=ganti-dengan-nilai-acak-panjang

# Password panel admin di /admin
ADMIN_PASSWORD=ganti-password-ini

# Port HTTP
PORT=5000
```

- [ ] **Step 8: Buat `.env` lokal**

Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` dengan connection string dari bagian Prasyarat. `.env` tidak boleh di-commit.

- [ ] **Step 9: Tambah entri `.gitignore`**

Tambahkan baris berikut ke `.gitignore`:

```
.env
```

`client/public/galeri` sengaja **tidak** diabaikan meski isinya berkas hasil generate — tidak ada langkah build di VPS yang menghasilkannya, jadi berkasnya harus ikut di-commit agar situs berjalan setelah deploy.

- [ ] **Step 10: Verifikasi**

```bash
npm run check
```
Expected: keluar tanpa error.

```bash
npm run dev
```
Expected: tercetak `serving on port 5000`. Hentikan dengan Ctrl+C setelah pesan itu muncul.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: remove Replit platform dependencies, load .env locally"
```

---

### Task 2: Optimalkan foto

Lima foto sumber berukuran 4000×6000 piksel, 1.7–2.6 MB per berkas. Terlalu berat untuk web.

**Files:**
- Create: `script/optimize-photos.ts`
- Create: `client/src/assets/potret-utama.webp` (dihasilkan)
- Create: `client/public/galeri/galeri-0{1..4}.webp` (dihasilkan)

- [ ] **Step 1: Tulis skrip optimasi**

Buat `script/optimize-photos.ts`:

```ts
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const SUMBER = path.resolve("photo");
const TUJUAN_HERO = path.resolve("client/src/assets");
const TUJUAN_GALERI = path.resolve("client/public/galeri");

// DSC00042 dipilih sebagai potret utama (hero). Sisanya masuk galeri.
const HERO = { dari: "DSC00042.jpg", ke: "potret-utama.webp", lebar: 1600 };

const GALERI = [
  { dari: "DSC00098.jpg", ke: "galeri-01.webp" },
  { dari: "DSC00190.jpg", ke: "galeri-02.webp" },
  { dari: "DSC00265.jpg", ke: "galeri-03.webp" },
  { dari: "DSC00385.jpg", ke: "galeri-04.webp" },
];

const LEBAR_GALERI = 1200;

async function optimalkan(dari: string, ke: string, lebar: number) {
  const info = await sharp(dari)
    .resize({ width: lebar, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(ke);
  const kb = Math.round(info.size / 1024);
  console.log(`${path.basename(ke)}  ${info.width}x${info.height}  ${kb} KB`);
}

async function jalankan() {
  await mkdir(TUJUAN_HERO, { recursive: true });
  await mkdir(TUJUAN_GALERI, { recursive: true });

  await optimalkan(
    path.join(SUMBER, HERO.dari),
    path.join(TUJUAN_HERO, HERO.ke),
    HERO.lebar,
  );

  for (const item of GALERI) {
    await optimalkan(
      path.join(SUMBER, item.dari),
      path.join(TUJUAN_GALERI, item.ke),
      LEBAR_GALERI,
    );
  }
}

jalankan().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Jalankan skrip**

```bash
npm run optimize-photos
```

Expected: lima baris keluaran. `potret-utama.webp` berukuran 1600×2400, empat berkas galeri 1200×1800. Setiap berkas harus di bawah 400 KB — jika ada yang melebihi, turunkan `quality` ke 78 dan jalankan ulang.

- [ ] **Step 3: Verifikasi ukuran berkas**

```bash
ls -la client/src/assets/potret-utama.webp client/public/galeri/
```
Expected: seluruh berkas WebP ada dan jauh lebih kecil dari sumber JPG.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add photo optimization script and generated WebP assets"
```

---

### Task 3: Token desain

**Files:**
- Modify: `client/src/index.css`
- Modify: `tailwind.config.ts:85-89`
- Modify: `client/index.html`

- [ ] **Step 1: Ganti isi `client/src/index.css`**

Ganti seluruh berkas dengan:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Japanese minimalism — nilai HSL, rasio kontras terverifikasi.
     Lihat docs/superpowers/plans untuk tabel kontras lengkap. */

  --background: 38 41% 95%;        /* #F7F3EC rice paper */
  --foreground: 36 10% 10%;        /* #1C1A17 ink — 15.7:1 */

  --muted: 23 53% 88%;             /* #F1DDD1 peach */
  --muted-foreground: 41 12% 32%;  /* #5B5548 — 6.8:1 */

  /* Clay pekat. Aman untuk teks kecil (5.4:1). Dipakai untuk eyebrow,
     tautan, dan CTA. */
  --primary: 19 43% 39%;           /* #8F5539 */
  --primary-foreground: 38 41% 95%;

  /* Clay terang. Kontras 3.3:1 — HANYA untuk garis, teks besar, dan
     elemen non-teks. Jangan dipakai untuk body atau label kecil. */
  --accent: 19 42% 53%;            /* #B97455 */
  --accent-foreground: 36 10% 10%;

  /* Pale moss. Kontras 1.7:1 — HANYA elemen non-teks. */
  --moss: 91 16% 67%;              /* #A9B79C */

  --card: 0 0% 100%;
  --card-foreground: 36 10% 10%;

  --popover: 0 0% 100%;
  --popover-foreground: 36 10% 10%;

  --secondary: 23 53% 88%;
  --secondary-foreground: 36 10% 10%;

  --destructive: 0 55% 42%;
  --destructive-foreground: 38 41% 95%;

  --border: 38 30% 84%;            /* #E3DACB */
  --input: 38 30% 84%;
  --ring: 19 43% 39%;

  --radius: 0rem;

  --font-serif: 'Noto Serif', Georgia, serif;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  /* Beberapa komponen shadcn/ui memakai font-mono. Diarahkan ke DM Sans
     agar tidak ada keluarga font ketiga yang ikut terunduh. */
  --font-mono: 'DM Sans', system-ui, sans-serif;
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.8;
  }

  ::selection {
    background-color: hsl(var(--muted));
    color: hsl(var(--foreground));
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    @apply font-semibold tracking-tight;
    line-height: 1.2;
  }

  /* Fokus keyboard harus selalu terlihat. */
  :focus-visible {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 3px;
  }

  .font-serif { font-family: var(--font-serif); }
  .font-sans { font-family: var(--font-sans); }
  .font-mono { font-family: var(--font-mono); }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  /* Lebar baca nyaman untuk teks panjang. */
  .measure {
    max-width: 68ch;
  }

  /* Label kecil: huruf kapital berjarak lebar, menggantikan peran font mono. */
  .eyebrow {
    font-size: 0.6875rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: hsl(var(--primary));
  }

  /* Bayangan alami yang menyebar, bukan bayangan tajam. */
  .shadow-paper {
    box-shadow: 0 18px 48px -24px hsl(36 10% 10% / 0.18);
  }
}

html {
  scroll-behavior: smooth;
}

/* Seluruh animasi dinonaktifkan bila pengguna memintanya. */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

`tailwind.config.ts` tidak perlu diubah. Blok `fontFamily`-nya (baris 85–89) sudah menunjuk ke `var(--font-sans)`, `var(--font-serif)`, dan `var(--font-mono)` — ketiga variabel itulah yang diganti nilainya di Step 1, sehingga perubahan font mengalir dengan sendirinya.

- [ ] **Step 2: Ramping­kan pemuatan font di `client/index.html`**

Berkas saat ini mengunduh sekitar 25 keluarga font padahal hanya dua yang dipakai. Ganti seluruh isi dengan:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ghina Nur Muslimah</title>
    <meta name="description" content="Ruang tenang untuk menulis dan membaca — catatan, pemikiran, dan aktivitas Ghina Nur Muslimah." />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Noto+Serif:wght@400;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Perhatikan `maximum-scale=1` pada meta viewport lama sudah dihapus — atribut itu mencegah pengguna memperbesar halaman dan melanggar aksesibilitas.

- [ ] **Step 3: Verifikasi**

```bash
npm run check
```
Expected: keluar tanpa error.

- [ ] **Step 4: Commit**

```bash
git add client/src/index.css client/index.html
git commit -m "feat: apply Japanese minimalism design tokens and trim font loading"
```

---

### Task 4: Tekstur serat kertas

**Files:**
- Create: `client/src/components/PaperGrain.tsx`
- Delete: `client/src/components/NoiseOverlay.tsx`

- [ ] **Step 1: Buat `client/src/components/PaperGrain.tsx`**

```tsx
/**
 * Serat kertas halus di atas seluruh halaman. Menggantikan NoiseOverlay
 * lama yang memakai noise berfrekuensi tinggi dan terlihat seperti derau
 * digital. Nilai baseFrequency lebih rendah menghasilkan butiran yang
 * lebih besar dan lembut, menyerupai serat kertas beras.
 */
export default function PaperGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-multiply"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="paperGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.42"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperGrain)" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Hapus komponen lama**

```bash
rm client/src/components/NoiseOverlay.tsx
```

Komponen ini masih diimpor oleh `Home.tsx`, `NoteDetail.tsx`, dan `PemikiranPage.tsx`. Ketiganya akan diperbarui di Task 13 dan 14. Sampai saat itu `npm run check` akan gagal pada ketiga berkas tersebut — ini diharapkan.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: replace noise overlay with soft paper grain"
```

---

### Task 5: Konstanta identitas situs

Nama, tautan sosial, dan teks pembuka dipakai di beberapa berkas. Diletakkan di satu tempat agar tidak tersebar.

**Files:**
- Create: `client/src/lib/site.ts`

- [ ] **Step 1: Buat berkas**

```ts
/**
 * Identitas situs. Diubah di sini, bukan di tiap komponen.
 *
 * Catatan: alamat surel belum diketahui, jadi kontak diarahkan ke
 * Instagram. Bila nanti ada surel, tambahkan field `email` di sini dan
 * tampilkan di Contact.tsx serta SiteFooter.tsx.
 */
export const site = {
  nama: "Ghina Nur Muslimah",
  namaDepan: "Ghina",
  namaBelakang: "Nur Muslimah",
  instagram: {
    label: "Instagram",
    pengguna: "@nurghinaa",
    url: "https://www.instagram.com/nurghinaa/",
  },
} as const;
```

- [ ] **Step 2: Verifikasi**

`tsconfig.json` menyertakan seluruh `client/src/**/*`, jadi berkas baru ini langsung ikut diperiksa:

```bash
npm run check
```
Expected: keluar tanpa error selain error `NoiseOverlay` yang tersisa dari Task 4.

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/site.ts
git commit -m "feat: add site identity constants"
```

---

### Task 6: Navbar

**Files:**
- Modify: `client/src/components/Navbar.tsx`

Masalah pada versi sekarang: nama "Dewi Valentin", tautan nav berwarna putih di atas latar terang (nyaris tak terbaca sebelum di-scroll), tombol CTA merah, dan mailto ke domain lama.

- [ ] **Step 1: Ganti seluruh isi berkas**

```tsx
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/lib/site";

const navLinks = [
  { name: "Beranda", href: "#hero" },
  { name: "Tentang", href: "#tentang" },
  { name: "Galeri", href: "#galeri" },
  { name: "Pemikiran", href: "#pemikiran" },
  { name: "Catatan", href: "#catatan" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (window.location.pathname !== "/") {
      setLocation("/");
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
          isScrolled
            ? "border-border/70 bg-background/90 py-4 backdrop-blur-md"
            : "border-transparent bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          <Link
            href="/"
            className="font-serif text-lg tracking-tight text-foreground"
            data-testid="link-logo"
          >
            {site.namaDepan}{" "}
            <span className="text-muted-foreground">{site.namaBelakang}</span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            className="text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Buka menu navigasi"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background"
          >
            <button
              className="absolute right-6 top-6 p-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu navigasi"
              data-testid="button-close-menu"
            >
              <X className="h-7 w-7" />
            </button>

            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-serif text-2xl text-foreground transition-colors hover:text-primary"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

Tombol "MARI BICARA" berwarna solid dihapus dari navbar — spec meminta satu CTA saja di pembuka, dan section Kontak sudah menangani ajakan berbincang.

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Navbar.tsx
git commit -m "feat: restyle navbar for new identity and readable contrast"
```

---

### Task 7: SectionHeader

**Files:**
- Modify: `client/src/components/SectionHeader.tsx`

- [ ] **Step 1: Ganti seluruh isi berkas**

```tsx
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Judul section. Garis tipis clay menggantikan balok tebal merah pada
 * versi lama — aksen, bukan penekanan.
 */
export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-16">
      {subtitle && <span className="eyebrow mb-5 block">{subtitle}</span>}
      <h2 className="font-serif text-3xl text-foreground md:text-4xl">{title}</h2>
      <div className="mt-7 h-px w-16 bg-accent" />
    </div>
  );
}
```

Prop `centered` dihapus karena tidak dipakai di mana pun dan spec meminta komposisi asimetris.

- [ ] **Step 2: Commit**

```bash
git add client/src/components/SectionHeader.tsx
git commit -m "feat: restyle section header with quiet accent rule"
```

---

### Task 8: Section Hero

**Files:**
- Create: `client/src/components/sections/Hero.tsx`

Naskah di bawah adalah **draf**. Berbasis fakta dari profil publik (afiliasi PB HMI, OIC Youth Indonesia, Beasiswa Unggulan, UIN Palangka Raya, studi magister akuntansi, tinggal di Konya). Pemilik situs dapat menyuntingnya nanti.

- [ ] **Step 1: Buat berkas**

```tsx
import { motion } from "framer-motion";
import potretUtama from "@/assets/potret-utama.webp";
import { site } from "@/lib/site";

/**
 * Pembuka: satu pernyataan singkat, satu foto, satu ajakan.
 * Kolom sengaja tidak sama lebar (1.05fr / 0.95fr) mengikuti komposisi
 * cetak asimetris.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen flex-col pt-24 md:grid md:grid-cols-[1.05fr_0.95fr] md:pt-0"
    >
      <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <span className="eyebrow mb-6 block">
            Catatan &middot; Pemikiran &middot; Aktivitas
          </span>

          <h1 className="mb-8 font-serif text-4xl leading-[1.15] text-foreground md:text-5xl lg:text-6xl">
            {site.namaDepan}
            <br />
            {site.namaBelakang}
          </h1>

          <p className="measure mb-10 text-lg text-muted-foreground">
            Ruang tenang untuk menulis dan membaca — tempat pemikiran, catatan,
            dan perjalanan disimpan dengan sederhana.
          </p>

          <a
            href="#pemikiran"
            className="inline-flex w-fit items-center border border-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors duration-500 hover:bg-foreground hover:text-background"
            data-testid="link-cta-hero"
          >
            Baca Tulisan
          </a>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
            className="mt-16 h-px bg-accent"
          />
        </motion.div>
      </div>

      <div className="order-1 h-[58vh] overflow-hidden bg-muted md:order-2 md:h-screen">
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          src={potretUtama}
          alt={`Potret ${site.nama}`}
          width={1600}
          height={2400}
          className="h-full w-full object-cover object-top"
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/sections/Hero.tsx
git commit -m "feat: add hero section"
```

---

### Task 9: Section Tentang / Filosofi

**Files:**
- Create: `client/src/components/sections/About.tsx`

- [ ] **Step 1: Buat berkas**

```tsx
import { motion } from "framer-motion";

/**
 * Tentang / Filosofi. Naskah berbasis profil publik dan dapat disunting
 * pemilik situs. Kolom kiri menahan kutipan, kolom kanan menahan narasi —
 * lebar tidak sama, mengikuti komposisi cetak.
 */

const keterangan = [
  { label: "Organisasi", nilai: "PB HMI 2024–2026" },
  { label: "Organisasi", nilai: "OIC Youth Indonesia" },
  { label: "Beasiswa", nilai: "Awardee Beasiswa Unggulan" },
  { label: "Pendidikan", nilai: "UIN Palangka Raya" },
  { label: "Domisili", nilai: "Konya, Turki" },
];

export default function About() {
  return (
    <section id="tentang" className="border-t border-border py-24 md:py-36">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20"
        >
          <div>
            <span className="eyebrow mb-6 block">Tentang</span>
            <p className="font-serif text-2xl leading-snug text-foreground md:text-3xl">
              fatum brutum,
              <br />
              amor fati
            </p>
            <div className="mt-7 h-px w-16 bg-accent" />
          </div>

          <div>
            <p className="measure mb-6 text-lg text-muted-foreground">
              Takdir berjalan tanpa diminta, dan tugas kita adalah mencintainya.
              Kalimat itu yang saya bawa ke mana-mana.
            </p>
            <p className="measure mb-6 text-lg text-muted-foreground">
              Saya Ghina. Aktif di pergerakan mahasiswa, sedang menempuh studi
              magister akuntansi, dan saat ini tinggal di Konya, Turki.
            </p>
            <p className="measure mb-12 text-lg text-muted-foreground">
              Sebagian besar yang saya kerjakan berpusat pada satu hal:
              mendengarkan, lalu menuliskannya kembali dengan lebih jernih.
              Situs ini tempat tulisan-tulisan itu disimpan.
            </p>

            <dl className="border-t border-border">
              {keterangan.map((item) => (
                <div
                  key={item.nilai}
                  className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <dt className="eyebrow sm:w-32 sm:shrink-0">{item.label}</dt>
                  <dd className="text-base text-foreground">{item.nilai}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/sections/About.tsx
git commit -m "feat: add about section"
```

---

### Task 10: Section Galeri

**Files:**
- Create: `client/src/components/sections/Gallery.tsx`

Data tetap berasal dari tabel `gallery` lewat hook `useGallery()` yang sudah ada. Yang berubah hanya penyusunannya: dari grid tiga kolom seragam menjadi susunan editorial dengan tinggi dan pergeseran vertikal yang berbeda-beda.

- [ ] **Step 1: Buat berkas**

```tsx
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { useGallery } from "@/hooks/use-content";

/**
 * Galeri editorial. Tiap slot punya tinggi dan offset berbeda supaya
 * susunannya tidak terbaca sebagai grid. Pola diulang bila jumlah foto
 * melebihi empat.
 */
const slot = [
  { tinggi: "h-[420px] md:h-[560px]", offset: "md:mt-0", kolom: "md:col-span-7" },
  { tinggi: "h-[340px] md:h-[420px]", offset: "md:mt-28", kolom: "md:col-span-5" },
  { tinggi: "h-[340px] md:h-[420px]", offset: "md:mt-0", kolom: "md:col-span-5" },
  { tinggi: "h-[420px] md:h-[560px]", offset: "md:mt-20", kolom: "md:col-span-7" },
];

export default function Gallery() {
  const { data: galleryItems, isLoading } = useGallery();

  return (
    <section id="galeri" className="border-t border-border bg-muted/40 py-24 md:py-36">
      <div className="container mx-auto px-6">
        <SectionHeader title="Galeri" subtitle="Potret" />

        {isLoading && (
          <p className="text-muted-foreground">Memuat galeri…</p>
        )}

        {!isLoading && galleryItems?.length === 0 && (
          <p className="text-muted-foreground">Belum ada foto.</p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-8 md:gap-y-4">
          {galleryItems?.map((item, idx) => {
            const s = slot[idx % slot.length];
            return (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`${s.kolom} ${s.offset}`}
                data-testid={`gallery-item-${item.id}`}
              >
                <div className={`${s.tinggi} overflow-hidden bg-background shadow-paper`}>
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  {item.caption}
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

Keterangan foto kini selalu terlihat di bawah gambar, bukan tersembunyi di balik lapisan hitam yang hanya muncul saat hover — lapisan hover itu tidak dapat diakses lewat keyboard maupun sentuhan.

- [ ] **Step 2: Commit**

```bash
git add client/src/components/sections/Gallery.tsx
git commit -m "feat: add editorial gallery section"
```

---

### Task 11: Section Pemikiran & Ide

**Files:**
- Create: `client/src/components/sections/Pemikiran.tsx`

Versi lama memecah konten dengan `page.content.split("\n")` dan merendernya sebagai teks biasa. Konten itu sebenarnya HTML dari editor TipTap, sudah disanitasi di server, sehingga seharusnya dirender sebagai HTML. Ini diperbaiki di sini.

- [ ] **Step 1: Buat berkas**

```tsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { usePage } from "@/hooks/use-content";

/**
 * Ringkasan Pemikiran & Ide. Konten berasal dari editor TipTap dan sudah
 * disanitasi di server (server/routes.ts sanitizeHtml), jadi dirender
 * sebagai HTML — bukan dipecah per baris seperti versi sebelumnya.
 */
export default function Pemikiran() {
  const { data: page, isLoading } = usePage("pemikiran-ide");

  if (isLoading || !page) return null;

  return (
    <section id="pemikiran" className="border-t border-border py-24 md:py-36">
      <div className="container mx-auto px-6">
        <SectionHeader title={page.title} subtitle="Pemikiran" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:grid md:grid-cols-[1.15fr_0.85fr] md:gap-20"
        >
          <div
            className="measure text-lg text-muted-foreground [&_blockquote]:border-l [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground [&_p]:mb-6"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          <div className="mt-10 md:mt-0">
            <a
              href="/pemikiran-ide"
              className="group inline-flex items-center gap-3 text-sm text-primary transition-colors hover:text-foreground"
              data-testid="link-pemikiran-selengkapnya"
            >
              Baca selengkapnya
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/sections/Pemikiran.tsx
git commit -m "feat: add pemikiran section, render sanitized HTML properly"
```

---

### Task 12: Section Catatan & Aktivitas

**Files:**
- Create: `client/src/components/sections/Notes.tsx`

Versi lama memakai latar `bg-foreground` (ink hampir hitam) dengan teks `text-white/50` — kontras rendah dan bertabrakan dengan arah "kertas". Diganti menjadi latar terang.

- [ ] **Step 1: Buat berkas**

```tsx
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useNotes } from "@/hooks/use-content";

export default function Notes() {
  const { data: noteItems, isLoading } = useNotes();

  return (
    <section id="catatan" className="border-t border-border py-24 md:py-36">
      <div className="container mx-auto px-6">
        <SectionHeader title="Catatan & Aktivitas" subtitle="Catatan" />

        {isLoading && <p className="text-muted-foreground">Memuat catatan…</p>}

        {!isLoading && noteItems?.length === 0 && (
          <p className="text-muted-foreground">Belum ada catatan.</p>
        )}

        <div className="border-t border-border">
          {noteItems?.map((item, index) => (
            <motion.a
              key={item.id}
              href={`/catatan/${item.slug}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="group flex flex-col gap-4 border-b border-border py-9 md:flex-row md:items-baseline md:gap-12"
              data-testid={`note-item-${item.id}`}
            >
              <span className="font-serif text-sm text-accent md:w-10 md:shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <span className="eyebrow">{item.tag}</span>
                  <span className="h-px w-4 bg-border" />
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {item.date}
                  </span>
                </div>

                <h3 className="mb-2 font-serif text-2xl text-foreground transition-colors duration-500 group-hover:text-primary md:text-3xl">
                  {item.title}
                </h3>

                <p className="measure text-base text-muted-foreground">
                  {item.excerpt}
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 shrink-0 text-accent transition-transform duration-500 group-hover:-translate-y-1 md:self-center" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/sections/Notes.tsx
git commit -m "feat: add notes section on paper background"
```

---

### Task 13: Section Kontak dan Footer

**Files:**
- Create: `client/src/components/sections/Contact.tsx`
- Create: `client/src/components/sections/SiteFooter.tsx`

- [ ] **Step 1: Buat `client/src/components/sections/Contact.tsx`**

```tsx
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Kontak. Diarahkan ke Instagram karena alamat surel belum diketahui.
 * Bila nanti ada surel, tambahkan di client/src/lib/site.ts.
 */
export default function Contact() {
  return (
    <section id="kontak" className="border-t border-border bg-muted/40 py-24 md:py-36">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:grid md:grid-cols-[0.85fr_1.15fr] md:gap-20"
        >
          <div>
            <span className="eyebrow mb-6 block">Kontak</span>
            <div className="h-px w-16 bg-accent" />
          </div>

          <div className="mt-8 md:mt-0">
            <h2 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
              Mari berbincang
            </h2>
            <p className="measure mb-10 text-lg text-muted-foreground">
              Untuk diskusi, undangan menulis, atau sekadar bertukar kabar.
            </p>

            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors duration-500 hover:bg-foreground hover:text-background"
              data-testid="link-cta-kontak"
            >
              {site.instagram.pengguna}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Buat `client/src/components/sections/SiteFooter.tsx`**

```tsx
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-serif text-base text-foreground">{site.nama}</p>

        <div className="flex items-center gap-8">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-social-instagram"
          >
            {site.instagram.label}
          </a>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

Empat tautan sosial palsu pada footer lama (Twitter, LinkedIn, Instagram, GitHub — semuanya `href="#"`) dihapus. Hanya akun yang benar-benar diketahui yang ditampilkan.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/sections/Contact.tsx client/src/components/sections/SiteFooter.tsx
git commit -m "feat: add contact section and minimal footer"
```

---

### Task 14: Rakit halaman Beranda

**Files:**
- Modify: `client/src/pages/Home.tsx`

- [ ] **Step 1: Ganti seluruh isi berkas**

`Home.tsx` semula 219 baris berisi lima definisi komponen inline. Kini menjadi komposisi saja:

```tsx
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Pemikiran from "@/components/sections/Pemikiran";
import Notes from "@/components/sections/Notes";
import Contact from "@/components/sections/Contact";
import SiteFooter from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Pemikiran />
        <Notes />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 2: Verifikasi tipe**

```bash
npm run check
```
Expected: `NoteDetail.tsx` dan `PemikiranPage.tsx` masih gagal karena mengimpor `NoiseOverlay` yang dihapus di Task 4. `Home.tsx` tidak boleh muncul dalam daftar error. Kedua berkas itu diperbaiki di Task 15.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Home.tsx
git commit -m "refactor: compose home page from focused section components"
```

---

### Task 15: Restyle halaman detail

**Files:**
- Modify: `client/src/pages/NoteDetail.tsx`
- Modify: `client/src/pages/PemikiranPage.tsx`

- [ ] **Step 1: Ganti seluruh isi `client/src/pages/NoteDetail.tsx`**

```tsx
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNote } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";

/** Kelas prose dipakai bersama PemikiranPage. */
export const proseKelas =
  "measure text-lg text-muted-foreground [&_blockquote]:border-l [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_h1]:font-serif [&_h1]:text-foreground [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-9 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground [&_img]:my-10 [&_img]:w-full [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6";

export default function NoteDetail() {
  const [, params] = useRoute("/catatan/:slug");
  const { data: note, isLoading, error } = useNote(params?.slug || "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-muted-foreground">Memuat catatan…</span>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6">
        <h1 className="font-serif text-3xl">Catatan tidak ditemukan</h1>
        <a href="/" className="text-primary hover:underline" data-testid="link-back-home">
          Kembali ke beranda
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="px-6 pb-28 pt-36"
      >
        <div className="container mx-auto max-w-2xl">
          <a
            href="/#catatan"
            className="mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-back-notes"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke catatan
          </a>

          <header className="mb-14">
            <div className="mb-6 flex items-center gap-3">
              <span className="eyebrow">{note.tag}</span>
              <span className="h-px w-4 bg-border" />
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {note.date}
              </span>
            </div>

            <h1 className="mb-7 font-serif text-4xl leading-[1.15] md:text-5xl">
              {note.title}
            </h1>

            <p className="measure text-lg text-muted-foreground">{note.excerpt}</p>

            <div className="mt-9 h-px w-16 bg-accent" />
          </header>

          {note.coverImage && (
            <div className="mb-14 overflow-hidden shadow-paper">
              <img src={note.coverImage} alt={note.title} className="w-full" />
            </div>
          )}

          <div className={proseKelas} dangerouslySetInnerHTML={{ __html: note.content }} />

          <p className="mt-20 border-t border-border pt-8 font-serif italic text-muted-foreground">
            Terima kasih telah membaca.
          </p>
        </div>
      </motion.article>
    </div>
  );
}
```

Tombol "Bagikan" pada versi lama dihapus — tombol itu tidak punya penangan klik sama sekali, jadi tidak melakukan apa pun saat ditekan.

- [ ] **Step 2: Ganti seluruh isi `client/src/pages/PemikiranPage.tsx`**

```tsx
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { usePage } from "@/hooks/use-content";
import Navbar from "@/components/Navbar";
import PaperGrain from "@/components/PaperGrain";
import { proseKelas } from "@/pages/NoteDetail";

export default function PemikiranPage() {
  const { data: page, isLoading } = usePage("pemikiran-ide");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-muted-foreground">Memuat halaman…</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6">
        <h1 className="font-serif text-3xl">Halaman tidak ditemukan</h1>
        <a href="/" className="text-primary hover:underline" data-testid="link-back-home">
          Kembali ke beranda
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaperGrain />
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="px-6 pb-28 pt-36"
      >
        <div className="container mx-auto max-w-2xl">
          <a
            href="/"
            className="mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            data-testid="link-back-home"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </a>

          <header className="mb-14">
            <span className="eyebrow mb-6 block">Pemikiran</span>
            <h1 className="font-serif text-4xl leading-[1.15] md:text-5xl">
              {page.title}
            </h1>
            <div className="mt-9 h-px w-16 bg-accent" />
          </header>

          <div className={proseKelas} dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 3: Verifikasi tipe**

```bash
npm run check
```
Expected: keluar tanpa error. Seluruh impor `NoiseOverlay` sudah hilang.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/NoteDetail.tsx client/src/pages/PemikiranPage.tsx
git commit -m "feat: restyle note detail and pemikiran pages"
```

---

### Task 16: Restyle halaman Admin dan 404

**Files:**
- Modify: `client/src/pages/Admin.tsx`
- Modify: `client/src/pages/not-found.tsx`

`Admin.tsx` berukuran 562 baris dan sebagian besar memakai komponen `ui/` yang warnanya sudah mengalir dari token di Task 3. Perubahan di sini minimal dan hanya menyentuh yang masih menampilkan identitas lama atau warna keras.

- [ ] **Step 1: Perbaiki tiga warna di luar palet pada `Admin.tsx`**

Berkas ini tidak memuat nama persona lama sama sekali, jadi hanya tiga baris yang perlu disentuh. Sisanya memakai komponen `ui/` yang warnanya sudah mengalir dari token Task 3.

Baris 65 — teks galat memakai merah Tailwind mentah:

```tsx
            {error && <p className="text-sm text-red-500" data-testid="text-login-error">
```

menjadi:

```tsx
            {error && <p className="text-sm text-destructive" data-testid="text-login-error">
```

Baris 375 — tombol hapus foto:

```tsx
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
```

menjadi:

```tsx
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
```

Baris 411 — kelas `font-mono` kini tidak berarti karena font mono sudah dipetakan ke DM Sans:

```tsx
                    <span className="text-xs font-mono text-primary">{note.tag}</span>
```

menjadi:

```tsx
                    <span className="text-xs uppercase tracking-[0.14em] text-primary">{note.tag}</span>
```

- [ ] **Step 2: Ganti seluruh isi `client/src/pages/not-found.tsx`**

Halaman ini masih berbahasa Inggris padahal seluruh situs berbahasa Indonesia, dan memakai `text-red-500` yang di luar palet.

```tsx
import { Link } from "wouter";
import PaperGrain from "@/components/PaperGrain";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6">
      <PaperGrain />
      <div className="max-w-md text-center">
        <span className="eyebrow mb-6 block">404</span>

        <h1 className="mb-6 font-serif text-3xl text-foreground md:text-4xl">
          Halaman tidak ditemukan
        </h1>

        <p className="mb-10 text-base text-muted-foreground">
          Halaman yang Anda cari tidak ada. Mungkin sudah dipindahkan atau dihapus.
        </p>

        <Link
          href="/"
          className="inline-flex items-center border border-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors duration-500 hover:bg-foreground hover:text-background"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verifikasi**

```bash
npm run check
```
Expected: keluar tanpa error.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/Admin.tsx client/src/pages/not-found.tsx
git commit -m "feat: restyle admin and 404 pages to match new palette"
```

---

### Task 17: Ganti data seed

**Files:**
- Modify: `server/routes.ts:153-207`

Data seed sekarang berisi artikel tentang desain/arsitektur milik persona lama dan enam foto stok Unsplash. Diganti dengan konten yang sesuai dan foto asli.

- [ ] **Step 1: Ganti fungsi `seedDatabase` seutuhnya**

Ganti baris 153 sampai akhir berkas dengan:

```ts
async function seedDatabase() {
  const existingNotes = await storage.getNotes();
  if (existingNotes.length === 0) {
    await storage.createNote({
      title: "Menulis sebagai Cara Mendengar",
      slug: "menulis-sebagai-cara-mendengar",
      excerpt:
        "Kenapa saya menuliskan kembali apa yang saya dengar, bukan langsung menanggapinya.",
      content:
        "<p>Menulis bukan cara saya bicara, melainkan cara saya mendengar dengan lebih pelan. Ada jarak yang muncul antara mendengar dan menuliskan, dan di jarak itulah biasanya saya menemukan apa yang sebenarnya sedang dikatakan orang lain.</p><p>Karena itu catatan-catatan di sini jarang berupa kesimpulan. Sebagian besar hanya rekaman dari proses yang belum selesai.</p>",
      tag: "Catatan",
      date: "Juli 2026",
      coverImage: null,
    });

    await storage.createNote({
      title: "Belajar di Kota yang Tidak Terburu-buru",
      slug: "belajar-di-kota-yang-tidak-terburu-buru",
      excerpt: "Catatan singkat dari hari-hari menempuh studi di Konya.",
      content:
        "<p>Konya mengajarkan satu hal yang tidak saya dapat dari tempat lain: bahwa kecepatan bukan ukuran kesungguhan. Kota ini bergerak pelan, dan lama-lama saya ikut menyesuaikan diri.</p><p>Banyak hal yang dulu terasa mendesak ternyata bisa menunggu. Sebagian bahkan hilang sendiri ketika tidak buru-buru ditanggapi.</p>",
      tag: "Aktivitas",
      date: "Juni 2026",
      coverImage: null,
    });

    await storage.createNote({
      title: "Organisasi dan Kesabaran",
      slug: "organisasi-dan-kesabaran",
      excerpt: "Tentang bekerja bersama orang yang tidak selalu sependapat.",
      content:
        "<p>Bekerja di organisasi mengajarkan bahwa keputusan paling baik jarang datang dari orang yang paling cepat bicara. Ia biasanya muncul setelah semua orang selesai didengarkan.</p><p>Kesabaran, dalam konteks itu, bukan sifat pasif. Ia kerja yang menuntut perhatian penuh.</p>",
      tag: "Pemikiran",
      date: "Mei 2026",
      coverImage: null,
    });
  }

  const existingGallery = await storage.getGalleryItems();
  if (existingGallery.length === 0) {
    const gallerySeeds = [
      { image: "/galeri/galeri-01.webp", caption: "Hormat" },
      { image: "/galeri/galeri-02.webp", caption: "Sejenak menoleh" },
      { image: "/galeri/galeri-03.webp", caption: "Berdiri tenang" },
      { image: "/galeri/galeri-04.webp", caption: "Jeda" },
    ];
    for (const seed of gallerySeeds) {
      await storage.createGalleryItem({
        image: seed.image,
        caption: seed.caption,
        colSpan: "col-span-1",
      });
    }
  }

  const pemikiranPage = await storage.getPage("pemikiran-ide");
  if (!pemikiranPage) {
    await storage.upsertPage("pemikiran-ide", {
      title: "Pemikiran & Ide",
      content:
        "<p>Halaman ini berisi hal-hal yang sedang saya pikirkan — sebagian sudah matang, sebagian besar belum.</p><p>Saya percaya bahwa gagasan yang baik tidak perlu diucapkan dengan keras. Ia cukup diletakkan dengan jelas, lalu dibiarkan bekerja pada orang yang membacanya.</p><p>Isi halaman ini akan berubah dari waktu ke waktu.</p>",
    });
  }
}
```

Perhatikan konten kini berupa HTML, bukan teks dengan `\n`, karena dirender lewat `dangerouslySetInnerHTML` di Task 11 dan 15.

- [ ] **Step 2: Bersihkan data seed lama dari database**

Seed hanya berjalan bila tabel kosong, sehingga data lama tidak akan tergantikan dengan sendirinya:

```bash
"/c/Program Files/PostgreSQL/17/bin/psql.exe" -U postgres -h 127.0.0.1 -d ghina_dev -c "TRUNCATE gallery, notes, pages RESTART IDENTITY;"
```

- [ ] **Step 3: Verifikasi**

```bash
npm run dev
```

Buka `http://localhost:5000` di peramban. Periksa:
- Tiga catatan baru tampil di section Catatan & Aktivitas
- Empat foto asli tampil di Galeri
- Section Pemikiran & Ide menampilkan paragraf yang benar

Hentikan server dengan Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add server/routes.ts
git commit -m "feat: replace seed content with Ghina's identity and real photos"
```

---

### Task 18: Dokumentasi dan verifikasi menyeluruh

**Files:**
- Create: `README.md`
- Delete: `replit.md`

- [ ] **Step 1: Buat `README.md`**

````markdown
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
````

- [ ] **Step 2: Hapus `replit.md`**

```bash
rm replit.md
```

- [ ] **Step 3: Verifikasi tipe dan build**

```bash
npm run check
```
Expected: keluar tanpa error.

```bash
npm run build
```
Expected: selesai tanpa error, `dist/public/` dan `dist/index.cjs` terbentuk.

- [ ] **Step 4: Pastikan tidak ada sisa Replit atau identitas lama**

```bash
grep -rn "Dewi\|Valentin\|replit\|REPL_ID\|attached_assets" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.html" --include="*.md" . | grep -v node_modules | grep -v package-lock | grep -v "docs/superpowers"
```
Expected: tidak ada hasil. Bila ada, perbaiki sebelum lanjut.

- [ ] **Step 5: Verifikasi di peramban**

```bash
npm run dev
```

Buka `http://localhost:5000` dan periksa satu per satu:

| Yang diperiksa | Harapan |
|---|---|
| Beranda | Tujuh section berurutan: Hero, Tentang, Galeri, Pemikiran, Catatan, Kontak, Footer |
| Foto hero | Tampil, tidak gepeng, wajah tidak terpotong |
| Navigasi | Kelima tautan menggulir ke section yang benar |
| Lebar 375px | Tidak ada gulir horizontal, kolom runtuh jadi satu |
| Tab keyboard | Setiap tautan dan tombol menampilkan cincin fokus yang jelas |
| `/catatan/menulis-sebagai-cara-mendengar` | Halaman detail tampil dengan gaya baru |
| `/pemikiran-ide` | Halaman penuh tampil |
| `/admin` | Bisa login dengan `ADMIN_PASSWORD` dari `.env`, ketiga tab berfungsi |
| Rute acak, mis. `/abc` | Halaman 404 berbahasa Indonesia |

Hentikan server dengan Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: replace replit.md with README covering local dev and VPS deploy"
```

---

## Setelah Selesai

Hal berikut sengaja tidak dikerjakan dan bisa dipertimbangkan nanti:

- **Alamat surel** belum ada, sehingga kontak hanya lewat Instagram. Tambahkan di `client/src/lib/site.ts` bila sudah ada.
- **Naskah Hero, Tentang, dan Kontak** masih draf. Naskah Hero dan Tentang tertanam di komponen, jadi pengubahannya lewat kode; hanya Galeri, Pemikiran, dan Catatan yang dapat disunting lewat panel admin.
- **`favicon.png`** masih milik situs lama. Belum diganti karena tidak ada berkas pengganti.
