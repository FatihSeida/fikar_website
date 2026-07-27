import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App";
import "./index.css";

// Seluruh animasi di situs ini digerakkan framer-motion lewat inline style,
// sehingga media query prefers-reduced-motion di index.css tidak menyentuhnya.
// MotionConfig-lah yang benar-benar mematuhi preferensi pengguna.
createRoot(document.getElementById("root")!).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>,
);
