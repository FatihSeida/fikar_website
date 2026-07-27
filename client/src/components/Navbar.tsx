import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/lib/site";

const navLinks = [
  { name: "Beranda", href: "#hero" },
  { name: "Tentang", href: "#tentang" },
  { name: "Perjalanan", href: "#perjalanan" },
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
