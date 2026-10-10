import { Link, useLocation } from "wouter";
import { useEffect, useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Home as HomeIcon, Images, Menu, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";
import { labelWaktu, segeraTampil } from "@shared/rilis";
import type { RingkasSeri } from "@/pages/SeriesPage";

const semuaTautan = [
  { name: "Beranda", href: "/", icon: HomeIcon },
  { name: "HMI Evidence", shortName: "Evidence", href: "/hmi-evidence", icon: null },
  // Tab Series baru tampil dua hari sebelum seri pertama terbit.
  { name: "Series", href: "/series", icon: BookOpen, fitur: "series-1" as const },
  { name: "Tentang", href: "/tentang", icon: UserRound },
  { name: "Galeri", href: "/galeri", icon: Images },
  { name: "Catatan", href: "/catatan", icon: FileText },
];

/**
 * Tautan Series di navigasi desktop. Saat diarahkan tetikus atau difokus papan ketik,
 * muncul daftar seri. Daftarnya baru diminta ke server setelah dibuka pertama kali,
 * jadi memuat halaman biasa tidak memanggil API.
 */
function TautanSeries({ href, name, aktif, lightInk, kelas }: { href: string; name: string; aktif: boolean; lightInk: boolean; kelas: string }) {
  const [buka, setBuka] = useState(false);
  const [pernahBuka, setPernahBuka] = useState(false);
  const tautanRef = useRef<HTMLAnchorElement>(null);
  const abaikanFokus = useRef(false);
  const idMenu = useId();
  const { data, isLoading, isError } = useQuery<RingkasSeri[]>({ queryKey: ["/api/seri"], enabled: pernahBuka, staleTime: 60_000 });
  const daftar = (data ?? []).filter((item) => item.judul).sort((a, b) => a.rilis - b.rilis || a.nomor - b.nomor);

  const tampilkan = () => { setPernahBuka(true); setBuka(true); };
  const tutupDenganEsc = () => {
    // Fokus yang kembali ke tautan tidak boleh membuka menu lagi.
    abaikanFokus.current = document.activeElement !== tautanRef.current;
    setBuka(false);
    tautanRef.current?.focus();
  };

  const panel = lightInk
    ? { kotak: "border-white/15 bg-[#071610]/95 text-white", nomor: "text-[hsl(var(--gold))]", status: "text-white/60", sorot: "hover:bg-white/10 focus-visible:bg-white/10", pesan: "text-white/60" }
    : { kotak: "border-border bg-background/95 text-foreground", nomor: "text-primary", status: "text-muted-foreground", sorot: "hover:bg-primary/5 focus-visible:bg-primary/5", pesan: "text-muted-foreground" };

  return (
    <div
      className="relative flex"
      onMouseEnter={tampilkan}
      onMouseLeave={() => setBuka(false)}
      onFocus={() => { if (abaikanFokus.current) { abaikanFokus.current = false; return; } tampilkan(); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setBuka(false); }}
      onKeyDown={(event) => { if (event.key === "Escape" && buka) tutupDenganEsc(); }}
    >
      <Link ref={tautanRef} href={href} aria-current={aktif ? "page" : undefined} aria-expanded={buka} aria-controls={buka ? idMenu : undefined} className={kelas}>
        {name}
      </Link>
      <AnimatePresence>
        {buka && (
          // Bagian atas (pt-5) menyambung tautan dan kotak supaya tetikus tidak keluar dari area saat turun.
          <div className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-5">
            <motion.div id={idMenu} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }} className={`border p-2 shadow-2xl backdrop-blur-xl ${panel.kotak}`}>
              {daftar.length > 0 ? (
                <ul>
                  {daftar.map((item) => {
                    const nomor = String(item.nomor).padStart(2, "0");
                    const bisaDibuka = item.terbit || !item.segera;
                    const status = item.terbit ? "Sudah terbit" : item.segera ? `Segera terbit · ${labelWaktu(item.rilis)}` : "Pratinjau admin";
                    const isi = (
                      <>
                        <span className={`pt-0.5 font-serif text-xl leading-none ${panel.nomor}`}>{nomor}</span>
                        <span className="block min-w-0">
                          <span className="block font-serif text-[15px] leading-snug">{item.judul}</span>
                          <span className={`mt-1 block text-[11px] leading-snug ${panel.status}`}>{status}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={item.slug}>
                        {bisaDibuka ? (
                          <Link href={`/series/${item.slug}`} className={`flex gap-4 px-3 py-3 outline-none transition-colors ${panel.sorot}`}>{isi}</Link>
                        ) : (
                          <div className="flex cursor-default gap-4 px-3 py-3 opacity-75">{isi}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className={`px-3 py-3 text-sm ${panel.pesan}`}>{isError ? "Daftar seri belum bisa dimuat." : isLoading ? "Memuat daftar seri…" : "Belum ada seri yang bisa dilihat."}</p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * `dark`: tulisan terang selama di atas sampul gelap, lalu kembali terang-latar saat digulir.
 * `gelap`: tetap bergaya gelap sepanjang halaman (halaman HMI Evidence dan cerita interaktif Series).
 */
export default function Navbar({ dark = false, gelap = false }: { dark?: boolean; gelap?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  // Di localhost menu fitur kampanye langsung tampil supaya bisa ditinjau sebelum rilis.
  const navLinks = semuaTautan.filter((link) => !link.fitur || import.meta.env.DEV || segeraTampil(link.fitur));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cinematic = gelap || location === "/hmi-evidence";
  const lightInk = cinematic || (dark && !isScrolled);
  const ink = lightInk ? "text-white" : "text-foreground";
  const muted = lightInk ? "text-white/70" : "text-muted-foreground";

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav aria-label="Navigasi utama" className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${cinematic ? "border-white/10 bg-[#071610]/85 py-3 backdrop-blur-xl" : isScrolled ? "border-border/70 bg-background/95 py-3 backdrop-blur-xl" : "border-transparent bg-transparent py-5"}`}>
        <div className="container mx-auto flex items-center justify-between px-5 md:px-8">
          <Link href="/" className={`flex items-center gap-3 font-serif text-lg tracking-tight ${ink}`}>
            <img src="/hmi-logo.png" alt="Logo HMI" width={147} height={400} className="h-9 w-auto" />
            <span>{site.namaDepan} <span className={muted}>{site.namaBelakang}</span></span>
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const kelas = `text-xs uppercase tracking-[0.14em] transition-colors ${link.href === "/hmi-evidence" ? `evidence-shimmer ${lightInk ? "" : "evidence-shimmer-light"}` : `hover:opacity-70 ${location === link.href ? ink : muted}`}`;
              return link.fitur === "series-1" ? (
                <TautanSeries key={link.href} href={link.href} name={link.name} aktif={location === link.href} lightInk={lightInk} kelas={kelas} />
              ) : (
                <Link key={link.href} href={link.href} aria-current={location === link.href ? "page" : undefined} className={kelas}>
                  {link.name}
                </Link>
              );
            })}
          </div>
          <button type="button" className={`hidden p-2 md:block lg:hidden ${ink}`} onClick={() => setMobileMenuOpen(true)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label="Buka menu navigasi">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <nav className="mobile-bottom-nav" aria-label="Navigasi utama mobile">
        {navLinks.map(link => {
          const Icon = link.icon;
          const active = location === link.href || (link.href !== "/" && location.startsWith(`${link.href}/`));
          const evidence = link.href === "/hmi-evidence";
          return (
            <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`${active ? "is-active" : ""} ${evidence ? "is-evidence" : ""}`}>
              <span>{Icon ? <Icon aria-hidden="true" /> : <img className="mobile-hmi-logo" src="/hmi-logo.png" alt="" aria-hidden="true" />}</span>
              <small>{link.shortName ?? link.name}</small>
            </Link>
          );
        })}
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div id="mobile-navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-[hsl(var(--evidence))] text-white">
            <button type="button" className="absolute right-5 top-5 p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Tutup menu navigasi">
              <X className="h-7 w-7" />
            </button>
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link, index) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                  <Link href={link.href} onClick={() => setMobileMenuOpen(false)} className={`font-serif text-3xl ${link.href === "/hmi-evidence" ? "evidence-shimmer" : "text-white/90 hover:text-[hsl(var(--gold))]"}`}>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
