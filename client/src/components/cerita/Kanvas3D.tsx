import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import type { EntriAdegan, Lapis } from "./kontrak";

/**
 * Kanvas WebGL untuk satu adegan 3D. Dipisah dari PanggungAdegan supaya mesin 3D
 * (react-three-fiber dan three.js) tidak ikut diunduh saat halaman cerita dibuka.
 *
 * Mesin hanya menyediakan kanvas transparan, kamera bawaan (fov 35, posisi [0, 0, 10])
 * dan progres. Cahaya, kabut, dan posisi kamera diatur adegan sendiri. Gambar dibuat
 * hanya saat ada perubahan (frameloop "demand"); selama adegan terlihat dan gerak tidak
 * dikurangi, mesin meminta gambar baru secara berkala untuk gerak latar.
 */

// Perangkat sederhana (prosesor atau memori kecil): resolusi dan gerak latar diringankan.
const sederhana = typeof navigator !== "undefined"
  && ((navigator.hardwareConcurrency ?? 8) <= 4 || ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4);
const DPR_MAKS = sederhana ? 1.25 : 1.5;
/** Jarak antargambar gerak latar, dalam milidetik: sekitar 25 gambar per detik, atau 15 di perangkat sederhana. */
const JEDA_GAMBAR = sederhana ? 66 : 40;

/** Menyalurkan progres gulir ke ref adegan dan meminta gambar baru setiap kali berubah. */
function Jembatan({ nilai, progres, terlihat, tenang }: { nilai: MotionValue<number>; progres: React.MutableRefObject<number>; terlihat: boolean; tenang: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    progres.current = nilai.get();
    invalidate();
    return nilai.on("change", (v) => {
      progres.current = v;
      invalidate();
    });
  }, [nilai, progres, invalidate]);
  useEffect(() => {
    if (!terlihat || tenang) return;
    let id = 0;
    let lalu = 0;
    const detak = (t: number) => {
      id = requestAnimationFrame(detak);
      if (t - lalu >= JEDA_GAMBAR) {
        lalu = t;
        invalidate();
      }
    };
    id = requestAnimationFrame(detak);
    return () => cancelAnimationFrame(id);
  }, [terlihat, tenang, invalidate]);
  return null;
}

type PropsKanvas = {
  entri: Extract<EntriAdegan, { jenis: "3d" }>;
  progres: MotionValue<number>;
  lapis: Lapis;
  tenang: boolean;
  terlihat: boolean;
};

export default function Kanvas3D({ entri, progres, lapis, tenang, terlihat }: PropsKanvas) {
  const ref = useRef(progres.get());
  const Adegan = entri.Komponen;
  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, DPR_MAKS]}
      camera={{ fov: 35, position: [0, 0, 10], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <Jembatan nilai={progres} progres={ref} terlihat={terlihat} tenang={tenang} />
      <Suspense fallback={null}>
        <Adegan progres={ref} lapis={lapis} tenang={tenang} />
      </Suspense>
    </Canvas>
  );
}
