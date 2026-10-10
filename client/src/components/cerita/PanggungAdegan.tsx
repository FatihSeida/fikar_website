import { Component, Suspense, useEffect, useRef, useState, useSyncExternalStore, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import type { EntriAdegan, Lapis } from "./kontrak";

/**
 * Wadah adegan satu bagian. Adegan baru dipasang saat wadahnya mendekati layar.
 * Kanvas WebGL paling banyak dua sekaligus (yang paling dekat ke tengah layar),
 * digambar hanya saat ada perubahan (frameloop "demand"), dengan resolusi
 * dibatasi 1,75. Tanpa WebGL, atau bila adegan gagal, tampil kartu keterangan.
 *
 * Catatan untuk adegan 3D: mesin hanya menyediakan kanvas transparan, kamera
 * bawaan (fov 35, posisi [0, 0, 10]) dan progres. Cahaya, kabut, dan posisi
 * kamera diatur adegan sendiri. Selama wadah terlihat dan gerak tidak dikurangi,
 * mesin meminta gambar baru sekitar 30 kali per detik untuk gerak latar.
 */

// ——— Batas dua kanvas WebGL

const BATAS_KANVAS = 2;
const calon = new Map<string, HTMLElement>();
const pendengar = new Set<() => void>();
let diizinkan: ReadonlySet<string> = new Set();
let antrean = 0;
let gulirTerpasang = false;

function hitungIzin() {
  antrean = 0;
  const tengah = window.innerHeight / 2;
  const urut = Array.from(calon, ([id, el]) => {
    const r = el.getBoundingClientRect();
    return { id, jarak: Math.abs((r.top + r.bottom) / 2 - tengah) };
  })
    .sort((a, b) => a.jarak - b.jarak)
    .slice(0, BATAS_KANVAS)
    .map((c) => c.id);
  if (urut.length === diizinkan.size && urut.every((id) => diizinkan.has(id))) return;
  diizinkan = new Set(urut);
  pendengar.forEach((beri) => beri());
}

function jadwalkanIzin() {
  if (!antrean) antrean = requestAnimationFrame(hitungIzin);
}

function ikutiIzin(beri: () => void) {
  pendengar.add(beri);
  return () => { pendengar.delete(beri); };
}

function useIzinKanvas(id: string, el: HTMLElement | null, ingin: boolean) {
  useEffect(() => {
    if (!el || !ingin) return;
    if (!gulirTerpasang) {
      gulirTerpasang = true;
      window.addEventListener("scroll", () => { if (calon.size > BATAS_KANVAS) jadwalkanIzin(); }, { passive: true });
    }
    calon.set(id, el);
    jadwalkanIzin();
    return () => {
      calon.delete(id);
      jadwalkanIzin();
    };
  }, [id, el, ingin]);
  return useSyncExternalStore(ikutiIzin, () => diizinkan.has(id), () => false);
}

// ——— Pemeriksaan WebGL, sekali per halaman

let adaWebgl: boolean | null = null;
function webglTersedia() {
  if (adaWebgl !== null) return adaWebgl;
  try {
    const kanvas = document.createElement("canvas");
    const gl = (kanvas.getContext("webgl2") ?? kanvas.getContext("webgl")) as WebGLRenderingContext | null;
    adaWebgl = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    adaWebgl = false;
  }
  return adaWebgl;
}

function useDiLayar(el: HTMLElement | null, rootMargin: string) {
  const [ya, setYa] = useState(false);
  useEffect(() => {
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setYa(true);
      return;
    }
    const pengamat = new IntersectionObserver(([e]) => setYa(e.isIntersecting), { rootMargin });
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, [el, rootMargin]);
  return ya;
}

class Penahan extends Component<{ cadangan: ReactNode; children: ReactNode }, { galat: boolean }> {
  state = { galat: false };
  static getDerivedStateFromError() {
    return { galat: true };
  }
  componentDidCatch(galat: unknown) {
    console.warn("Adegan gagal digambar", galat);
  }
  render() {
    return this.state.galat ? this.props.cadangan : this.props.children;
  }
}

/** Menyalurkan progres gulir ke ref adegan dan meminta gambar baru setiap kali berubah. */
function Jembatan({ nilai, progres, terlihat, tenang }: { nilai: MotionValue<number>; progres: MutableRefObject<number>; terlihat: boolean; tenang: boolean }) {
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
      if (t - lalu >= 32) {
        lalu = t;
        invalidate();
      }
    };
    id = requestAnimationFrame(detak);
    return () => cancelAnimationFrame(id);
  }, [terlihat, tenang, invalidate]);
  return null;
}

type PropsPanggung = {
  id: string;
  entri: EntriAdegan | undefined;
  memuat: boolean;
  progres: MotionValue<number>;
  lapis: Lapis;
  tenang: boolean;
  judul: string;
};

function Kanvas3D({ entri, progres, lapis, tenang, terlihat }: { entri: Extract<EntriAdegan, { jenis: "3d" }>; progres: MotionValue<number>; lapis: Lapis; tenang: boolean; terlihat: boolean }) {
  const ref = useRef(progres.get());
  const Adegan = entri.Komponen;
  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 1.75]}
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

/** Kartu tenang pengganti adegan: tanpa WebGL, adegan gagal, atau kunci adegan tidak dikenal. */
function KartuCadangan({ teks, catatan }: { teks: string; catatan: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="relative max-w-sm border border-[#DCC38A]/25 bg-[#04110c]/60 p-6 text-center">
        <div aria-hidden="true" className="mx-auto mb-5 h-16 w-16 rounded-full border border-[#DCC38A]/40 shadow-[0_0_40px_rgba(220,195,138,0.15)]">
          <div className="m-[22%] h-[56%] rounded-full border border-[#DCC38A]/30" />
        </div>
        <p className="text-sm leading-relaxed text-white/75">{teks}</p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#DCC38A]/70">{catatan}</p>
      </div>
    </div>
  );
}

function Menunggu() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(220,195,138,0.12),transparent_70%)]" />
    </div>
  );
}

export default function PanggungAdegan({ id, entri, memuat, progres, lapis, tenang, judul }: PropsPanggung) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const dekat = useDiLayar(el, "90% 0px 90% 0px");
  const terlihat = useDiLayar(el, "0px");
  const tigaDimensi = entri?.jenis === "3d";
  const webgl = tigaDimensi ? webglTersedia() : true;
  const izin = useIzinKanvas(id, el, dekat && tigaDimensi && webgl);
  const alt = entri?.alt ?? `Gambar untuk bagian "${judul}" sedang disiapkan.`;

  let isi: ReactNode;
  if (memuat) isi = <Menunggu />;
  else if (!entri) isi = <KartuCadangan teks={alt} catatan="Gambar menyusul" />;
  else if (entri.jenis === "3d") {
    if (!webgl) isi = <KartuCadangan teks={entri.alt} catatan="Peramban ini tidak bisa menampilkan gambar 3D" />;
    else if (izin) isi = (
      <Penahan cadangan={<KartuCadangan teks={entri.alt} catatan="Gambar 3D tidak bisa ditampilkan" />}>
        {/* Tepi kanvas memudar supaya adegan menyatu dengan latar halaman. */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_92%,transparent)] lg:[mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_74%,transparent_100%)]">
          <Kanvas3D entri={entri} progres={progres} lapis={lapis} tenang={tenang} terlihat={terlihat} />
        </div>
      </Penahan>
    );
    else isi = <Menunggu />;
  } else if (dekat) {
    const Adegan = entri.Komponen;
    isi = (
      <Penahan cadangan={<KartuCadangan teks={entri.alt} catatan="Gambar tidak bisa ditampilkan" />}>
        <Adegan progres={progres} lapis={lapis} tenang={tenang} />
      </Penahan>
    );
  }

  return (
    <div ref={setEl} role="img" aria-label={alt} className="relative h-full w-full">
      {isi}
    </div>
  );
}
