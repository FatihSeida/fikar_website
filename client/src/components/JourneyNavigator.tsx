import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Compass, X } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const destinations = [
  { href: "/", index: "01", title: "Beranda", description: "Rangkuman perjalanan dan gagasan Ahmad Zulfikar." },
  { href: "/hmi-evidence", index: "02", title: "HMI Evidence", description: "Scrollytelling, visi, misi, dan program strategis HMI Evidence." },
  { href: "/tentang", index: "03", title: "Tentang", description: "Profil serta rekam jejak organisasi." },
  { href: "/indikator", index: "04", title: "Indikator", description: "44 indikator kemunduran HMI, satu per satu." },
  { href: "/kuis", index: "05", title: "Kuis", description: "Seberapa evidence komisariatmu? 20 pertanyaan inti dan audit lanjutan." },
  { href: "/ikut", index: "06", title: "Audit Komisariat", description: "Seberapa evidence komisariatmu? Kuis audit dan kirim masalah." },
  { href: "/galeri", index: "07", title: "Galeri", description: "Dokumentasi gagasan, kaderisasi, dan pengabdian." },
  { href: "/catatan", index: "08", title: "Catatan", description: "Tulisan, gagasan, dan aktivitas Ahmad Zulfikar." },
];

function destinationIndex(location: string) {
  const index = destinations.findIndex((item) => item.href === "/"
    ? location === "/"
    : location === item.href || location.startsWith(`${item.href}/`));
  return Math.max(index, 0);
}

export default function JourneyNavigator({ location }: { location: string }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const activeIndex = destinationIndex(location);
  const current = destinations[activeIndex];
  const next = destinations[(activeIndex + 1) % destinations.length];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? Math.min(100, Math.round((window.scrollY / maximum) * 100)) : 100);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [location]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      triggerRef.current?.focus();
    };
  }, [open]);

  const progressStyle = {
    "--journey-progress": `${progress * 3.6}deg`,
  } as CSSProperties;

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        className="journey-trigger"
        onClick={() => setOpen(true)}
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.6 }}
        aria-label={`Buka peta eksplorasi. Posisi saat ini ${current.title}, progres baca ${progress} persen`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="journey-trigger-ring" style={progressStyle} aria-hidden="true">
          <Compass className="h-4 w-4" />
        </span>
        <span className="journey-trigger-copy">
          <small>Jelajahi</small>
          <strong>Jelajahi</strong>
        </span>
        <span className="journey-trigger-percent" aria-hidden="true">{String(progress).padStart(2, "0")}%</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="journey-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.35 }}
          >
            <button className="journey-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Tutup peta eksplorasi" />
            <motion.section
              ref={panelRef}
              className="journey-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="journey-title"
              initial={reducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: reducedMotion ? 0.01 : 0.65, ease: [0.76, 0, 0.24, 1] }}
            >
              <header className="journey-panel-header">
                <div>
                  <span>Peta eksplorasi</span>
                  <h2 id="journey-title">Telusuri satu rangkaian gagasan.</h2>
                </div>
                <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Tutup peta eksplorasi">
                  <X className="h-5 w-5" />
                </button>
              </header>

              <nav className="journey-destinations" aria-label="Peta eksplorasi website">
                {destinations.map((item, index) => {
                  const active = index === activeIndex;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`journey-destination${active ? " is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{item.index}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>

              <footer className="journey-panel-footer">
                <span>Berikutnya dalam perjalanan</span>
                <Link href={next.href} onClick={() => setOpen(false)}>
                  {next.title} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
