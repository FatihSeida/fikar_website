import { Suspense, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { tekstur, type V3 } from "./dasar";
import { Gedung, type KeadaanGedung } from "./gedung";

/**
 * Panggung 3D Bangun HMI: bangunan bisa diputar dan diperbesar dengan jari
 * atau tetikus. Kamera terbang ke bagian yang sedang dipilih. Adegan hanya
 * digambar ulang saat ada perubahan supaya hemat baterai.
 */

export type PinBagian = { id: string; nomor: number; label: string; warna: string; aktif?: boolean; lencana?: string };
export type ApiPanggung = { potret: (ukuran?: number) => string };

const PIN: Record<string, V3> = {
  atap: [0, 10.35, 4.2], jendela: [-4.95, 7.6, 4.3], tiang: [5.85, 6.2, 4.45], perpustakaan: [3.95, 6.0, 4.3],
  "ruang-kerja": [-3.95, 4.4, 4.3], "lemari-arsip": [3.95, 2.8, 4.3], rangka: [-3.9, 9.3, 3.8], lantai: [-5.0, 2.0, 4.3],
  pintu: [0, 1.0, 5.6], instalasi: [3.8, 10.4, -1.6], dinding: [6.1, 4.0, -2.0],
};

const KAMERA: Record<string, { pos: V3; target: V3 }> = {
  awal: { pos: [16, 9, 22.5], target: [0, 4.0, 1.2] },
  potret: { pos: [17.5, 9.2, 22.6], target: [0.4, 4.3, 0.8] },
  atap: { pos: [7, 14, 15], target: [0, 9, 2] },
  jendela: { pos: [-7, 8, 14], target: [-3.9, 6, 3] },
  tiang: { pos: [10, 6.5, 14], target: [3.5, 4.5, 3.5] },
  "ruang-kerja": { pos: [-3.6, 4.8, 10.5], target: [-3.9, 4.4, 3] },
  perpustakaan: { pos: [3.6, 6.4, 10.5], target: [3.9, 6.0, 3] },
  "lemari-arsip": { pos: [3.6, 3.2, 10.5], target: [3.9, 2.8, 3] },
  lantai: { pos: [-9, 5, 14], target: [0, 4, 3] },
  rangka: { pos: [-15, 9, 12], target: [-3, 5, 0] },
  pintu: { pos: [5, 2.8, 14], target: [0, 1.2, 5] },
  instalasi: { pos: [15, 13, 3], target: [3.5, 7.5, -0.5] },
  dinding: { pos: [17, 6, -4], target: [6, 4.2, 0] },
};

type Tujuan = { pos: THREE.Vector3; target: THREE.Vector3 } | null;

/** Terbang halus ke sudut pandang bagian yang dipilih; berhenti bila pengunjung memutar sendiri. */
function Kamera({ fokus, kontrol, tujuan }: { fokus: string | null; kontrol: MutableRefObject<OrbitControlsImpl | null>; tujuan: MutableRefObject<Tujuan> }) {
  const { camera, size, invalidate } = useThree();
  const aspek = size.width / Math.max(1, size.height);
  useEffect(() => {
    const preset = KAMERA[fokus ?? "awal"] ?? KAMERA.awal;
    const target = new THREE.Vector3(...preset.target);
    // Di layar sempit, titik pandang ditarik ke tengah bangunan supaya sisi lain tidak terpotong.
    if (fokus && aspek < 1.2) target.lerp(new THREE.Vector3(...KAMERA.awal.target), 0.4);
    // Layar sempit (ponsel) memundurkan kamera supaya bangunan tetap utuh terlihat;
    // sorotan bagian tetap menyisakan bangunan di sekitarnya.
    const faktor = THREE.MathUtils.clamp(1.35 / aspek, 1, 2) * (fokus ? 1.45 : 1);
    tujuan.current = { pos: new THREE.Vector3(...preset.pos).sub(target).multiplyScalar(faktor).add(target), target };
    invalidate();
  }, [fokus, aspek, invalidate, tujuan]);
  useFrame((_, dt) => {
    const t = tujuan.current;
    const k = kontrol.current;
    if (!t || !k) return;
    const laju = 1 - Math.pow(0.002, Math.min(dt, 0.1));
    camera.position.lerp(t.pos, laju);
    k.target.lerp(t.target, laju);
    k.update();
    if (camera.position.distanceTo(t.pos) < 0.03 && k.target.distanceTo(t.target) < 0.03) tujuan.current = null;
    else invalidate();
  });
  return null;
}

function PutarTerus({ aktif }: { aktif: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => { if (aktif) invalidate(); }, [aktif, invalidate]);
  useFrame(() => { if (aktif) invalidate(); });
  return null;
}

function Alas({ alas }: { alas: MutableRefObject<THREE.Group | null> }) {
  const bayang = tekstur("bayang", 256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(20,30,24,0.35)");
    g.addColorStop(1, "rgba(20,30,24,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  return (
    <group ref={alas}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 1]}>
        <circleGeometry args={[19, 64]} />
        <meshBasicMaterial color="#E9E3D3" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 1.2]} scale={[22, 18, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={bayang} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Gambar bangunan beresolusi tinggi untuk Story, tanpa alas dan tanpa penanda. */
function Potret({ onSiap, alas }: { onSiap?: (api: ApiPanggung) => void; alas: MutableRefObject<THREE.Group | null> }) {
  const { gl, scene, camera, invalidate } = useThree();
  useEffect(() => {
    if (!onSiap) return;
    onSiap({
      potret: (ukuran = 1080) => {
        const kamera = (camera as THREE.PerspectiveCamera).clone();
        kamera.position.set(...KAMERA.potret.pos);
        kamera.aspect = 1;
        kamera.lookAt(...KAMERA.potret.target);
        kamera.updateProjectionMatrix();
        const ukuranLama = gl.getSize(new THREE.Vector2());
        const rasioLama = gl.getPixelRatio();
        if (alas.current) alas.current.visible = false;
        gl.setPixelRatio(1);
        gl.setSize(ukuran, ukuran, false);
        gl.render(scene, kamera);
        const url = gl.domElement.toDataURL("image/png");
        if (alas.current) alas.current.visible = true;
        gl.setPixelRatio(rasioLama);
        gl.setSize(ukuranLama.x, ukuranLama.y, false);
        invalidate();
        return url;
      },
    });
  }, [onSiap, gl, scene, camera, invalidate, alas]);
  return null;
}

function Penanda({ pin, onPilih }: { pin: PinBagian; onPilih?: (id: string) => void }) {
  return (
    <Html position={PIN[pin.id]} center zIndexRange={[30, 0]}>
      <button
        type="button"
        onClick={() => onPilih?.(pin.id)}
        title={pin.label}
        aria-label={`${pin.label}${pin.lencana ? `, ${pin.lencana}` : ""}`}
        className={`flex items-center gap-1.5 rounded-full border text-[11px] font-medium shadow-md transition-all ${pin.aktif ? "border-[#DCC38A] bg-[#0B2A1E] py-1 pl-1 pr-3 text-white" : "border-white/80 bg-white/90 p-0.5 text-[#0B2A1E] hover:scale-110"}`}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: pin.warna }}>{pin.nomor}</span>
        {pin.aktif && <span className="whitespace-nowrap">{pin.label}</span>}
        {pin.lencana && !pin.aktif && <span className="whitespace-nowrap pr-1.5 text-[10px]">{pin.lencana}</span>}
      </button>
    </Html>
  );
}

type PropsPanggung = KeadaanGedung & {
  pin?: PinBagian[];
  putar?: boolean;
  onSiap?: (api: ApiPanggung) => void;
  className?: string;
};

function Adegan({ pin, putar = false, onSiap, ...gedung }: Omit<PropsPanggung, "className">) {
  const kontrol = useRef<OrbitControlsImpl | null>(null);
  const tujuan = useRef<Tujuan>(null);
  const alas = useRef<THREE.Group | null>(null);
  return (
    <>
      <hemisphereLight args={["#FFFFFF", "#B9B2A0", 1.6]} />
      <directionalLight position={[10, 16, 12]} intensity={2.1} />
      <directionalLight position={[-12, 8, -6]} intensity={0.55} />
      <Alas alas={alas} />
      <Gedung {...gedung} />
      {pin?.map((p) => <Penanda key={p.id} pin={p} onPilih={gedung.onPilih} />)}
      <OrbitControls
        ref={kontrol}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={50}
        maxPolarAngle={1.5}
        autoRotate={putar}
        autoRotateSpeed={0.7}
        onStart={() => { tujuan.current = null; }}
      />
      <Kamera fokus={gedung.fokus} kontrol={kontrol} tujuan={tujuan} />
      <PutarTerus aktif={putar} />
      <Potret onSiap={onSiap} alas={alas} />
    </>
  );
}

// Tulisan di bangunan digambar ke kanvas sekali saja, jadi hurufnya harus sudah termuat.
const hurufSiap = Promise.all([document.fonts.load('600 40px "DM Sans"'), document.fonts.load('600 40px "Noto Serif"')]).catch(() => undefined);

export default function Panggung({ className = "", ...isi }: PropsPanggung) {
  const [siap, setSiap] = useState(false);
  useEffect(() => {
    let hidup = true;
    hurufSiap.then(() => { if (hidup) setSiap(true); });
    return () => { hidup = false; };
  }, []);
  return (
    <div className={`relative touch-none select-none ${className}`}>
      {siap && <Canvas
        flat
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ fov: 32, position: [22, 12, 30], near: 0.5, far: 300 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <Adegan {...isi} />
        </Suspense>
      </Canvas>}
    </div>
  );
}
