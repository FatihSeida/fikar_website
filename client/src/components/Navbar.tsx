import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { BookOpen, FileText, Home as HomeIcon, Images, Menu, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";
import { sudahRilis } from "@shared/rilis";

const semuaTautan = [
  { name: "Beranda", href: "/", icon: HomeIcon },
  { name: "HMI Evidence", shortName: "Evidence", href: "/hmi-evidence", icon: null },
  // Tab Series baru tampil setelah seri pertama terbit.
  { name: "Series", href: "/series", icon: BookOpen, fitur: "series-1" as const },
  { name: "Tentang", href: "/tentang", icon: UserRound },
  { name: "Galeri", href: "/galeri", icon: Images },
  { name: "Catatan", href: "/catatan", icon: FileText },
];

export default function Navbar({ dark = false }: { dark?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  // Di localhost menu fitur kampanye langsung tampil supaya bisa ditinjau sebelum rilis.
  const navLinks = semuaTautan.filter((link) => !link.fitur || import.meta.env.DEV || sudahRilis(link.fitur));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cinematic = location === "/hmi-evidence";
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
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} aria-current={location === link.href ? "page" : undefined} className={`text-xs uppercase tracking-[0.14em] transition-colors ${link.href === "/hmi-evidence" ? `evidence-shimmer ${lightInk ? "" : "evidence-shimmer-light"}` : `hover:opacity-70 ${location === link.href ? ink : muted}`}`}>
                {link.name}
              </Link>
            ))}
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
