import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AppLoader() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = reducedMotion ? 700 : 2500;
    const startedAt = performance.now();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const ratio = Math.min(0.96, elapsed / Math.max(1, duration - 260));
      setProgress(Math.round((1 - Math.pow(1 - ratio, 2.2)) * 100));
    }, 50);

    const complete = window.setTimeout(() => setProgress(100), duration - 220);
    const hide = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setVisible(false);
    }, duration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(complete);
      window.clearTimeout(hide);
      document.body.style.overflow = previousOverflow;
    };
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="app-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: reducedMotion ? 0.1 : 0.65, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-live="polite"
          aria-label={`Memuat website ${progress} persen`}
        >
          <div className="app-loader-glow" aria-hidden="true" />
          <div className="app-loader-top" aria-hidden="true">
            <span>Ahmad Zulfikar</span>
            <span>HMI Evidence</span>
          </div>

          <div className="app-loader-content">
            <motion.div
              className="app-loader-map"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <img src="/ahmad/indonesia-loader-1400.webp" srcSet="/ahmad/indonesia-loader-800.webp 800w, /ahmad/indonesia-loader-1400.webp 1400w" sizes="(max-width: 767px) 100vw, 1100px" width={1400} height={560} alt="" />
              <div className="app-loader-signal" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="app-loader-ripples" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </motion.div>

            <div className="app-loader-caption">
              <div>
                <span>Memuat perjalanan</span>
                <strong>Transformasi Gerakan Organisasi Berbasis Bukti</strong>
              </div>
              <span className="app-loader-percentage">{String(progress).padStart(2, "0")}%</span>
            </div>

            <div className="app-loader-progress" aria-hidden="true">
              <motion.span animate={{ scaleX: progress / 100 }} transition={{ duration: 0.15 }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
