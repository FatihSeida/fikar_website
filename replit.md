# Portfolio Website - Ahmad Zulfikar

## Overview
Personal portfolio website for Ahmad Zulfikar with minimalist, typographic design. Features admin dashboard for content management.

## User Preferences
- Language: Bahasa Indonesia for all UI text and content
- Fonts: Playfair Display (serif headings), DM Sans (body), DM Mono (meta text)
- Accent color: #C8392B (red) for hover states and highlights
- Navbar links: white by default, red on hover
- Minimalist monochrome design with noise texture overlay

## Project Architecture
- **Frontend**: React + Vite with wouter routing, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js with Drizzle ORM + PostgreSQL
- **File uploads**: multer, stored in client/public/uploads/

### Database Tables
- `gallery` - Image gallery items (image, caption, colSpan)
- `notes` - Catatan & Aktivitas entries (title, slug, excerpt, content, tag, date, coverImage)
- `pages` - Static page content like Pemikiran & Ide (slug, title, content)

### Key Routes
- `/` - Homepage with Hero, Galeri, Pemikiran & Ide, Catatan & Aktivitas sections
- `/catatan/:slug` - Note detail page
- `/pemikiran-ide` - Full Pemikiran & Ide page
- `/admin` - Admin dashboard (tabs: Galeri, Catatan & Aktivitas, Pemikiran & Ide)

### API Endpoints
- GET/POST/DELETE `/api/gallery` - Gallery CRUD
- GET/POST/PUT/DELETE `/api/notes` - Notes CRUD
- GET/PUT `/api/pages/:slug` - Static pages
- POST `/api/upload` - File upload

## Recent Changes
- 2026-02-20: Restructured content model - replaced articles/news with notes (Catatan & Aktivitas), added static pages, built admin dashboard
- CTA section moved from bottom to hero section
- All text converted to Indonesian
