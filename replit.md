# Portfolio Website - Ahmad Zulfikar

## Overview
Personal portfolio website for Ahmad Zulfikar with minimalist, typographic design. Features password-protected admin dashboard for content management with rich text editing.

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
- **Rich text editor**: TipTap (headings, bold/italic/underline, alignment, lists, image upload, blockquotes)
- **Admin auth**: express-session with password protection
- **HTML sanitization**: DOMPurify on server side for content security

### Database Tables
- `gallery` - Image gallery items (image, caption, colSpan)
- `notes` - Catatan & Aktivitas entries (title, slug, excerpt, content as HTML, tag, date, coverImage)
- `pages` - Static page content like Pemikiran & Ide (slug, title, content as HTML)

### Key Routes
- `/` - Homepage with Hero, Galeri, Pemikiran & Ide, Catatan & Aktivitas sections
- `/catatan/:slug` - Note detail page (renders HTML content)
- `/pemikiran-ide` - Full Pemikiran & Ide page (renders HTML content)
- `/admin` - Password-protected admin dashboard (tabs: Galeri, Catatan & Aktivitas, Pemikiran & Ide)

### API Endpoints
- POST `/api/admin/login` - Admin login
- POST `/api/admin/logout` - Admin logout
- GET `/api/admin/check` - Check admin session
- GET/POST/DELETE `/api/gallery` - Gallery CRUD (POST/DELETE require auth)
- GET/POST/PUT/DELETE `/api/notes` - Notes CRUD (POST/PUT/DELETE require auth)
- GET/PUT `/api/pages/:slug` - Static pages (PUT requires auth)
- POST `/api/upload` - File upload (requires auth)

### Environment Variables
- `SESSION_SECRET` - Session encryption secret
- `ADMIN_PASSWORD` - Admin panel password (default: admin2026)

## Recent Changes
- 2026-02-20: Added password protection for admin panel using express-session
- 2026-02-20: Integrated TipTap rich text editor for notes and pages content
- 2026-02-20: Added DOMPurify HTML sanitization on server for XSS prevention
- 2026-02-20: Content pages now render HTML from rich text editor
- 2026-02-20: Restructured content model - replaced articles/news with notes, added static pages, built admin dashboard
- CTA section moved from bottom to hero section
- All text converted to Indonesian
