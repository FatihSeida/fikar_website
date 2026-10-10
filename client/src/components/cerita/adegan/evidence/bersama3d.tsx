import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SANS, SERIF, tekstur } from "@/components/bangun/dasar";
import type { PropsAdegan3D } from "../../kontrak";

/**
 * Bahan bersama adegan 3D Series 2: warna, geometri, label kanvas, kamera,
 * dan pengendali progres. Semua bahan tidak memakai tone mapping supaya warna
 * sama persis dengan palet situs, apa pun pengaturan <Canvas> milik mesin.
 */

export type V3 = [number, number, number];

export const WARNA = {
  malam: "#071610",
  gelap: "#0B2A1E",
  hutan: "#12392A",
  hijau: "#0E8A4F",
  hijauMuda: "#3FAE76",
  emas: "#DCC38A",
  emasTua: "#B08D4F",
  gading: "#F6F4E9",
  kertas: "#EDE7D6",
  pudar: "#4C5F55",
  peringatan: "#E39B4B",
};

// ——— Hitungan kecil

export const jepit = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** Progres lokal 0–1 di antara a dan b. */
export const ruas = (x: number, a: number, b: number) => jepit((x - a) / (b - a));
export const halus = (t: number) => t * t * (3 - 2 * t);
export const lepas = (t: number) => 1 - Math.pow(1 - t, 3);
/** Sedikit melewati lalu kembali, untuk benda yang "mendarat". */
export const pegas = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return t <= 0 ? 0 : t >= 1 ? 1 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const campur = (a: number, b: number, t: number) => a + (b - a) * t;

// ——— Geometri dan bahan bersama

export const geo = {
  kotak: new THREE.BoxGeometry(1, 1, 1),
  bidang: new THREE.PlaneGeometry(1, 1),
  bola: new THREE.SphereGeometry(0.5, 18, 12),
  silinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 28),
  lingkaran: new THREE.CircleGeometry(0.5, 40),
};
export const geoTepi = {
  kotak: new THREE.EdgesGeometry(geo.kotak),
  silinder: new THREE.EdgesGeometry(geo.silinder, 40),
};

const cacheBahan = new Map<string, THREE.Material>();

/** Bahan bayangan halus (Lambert) yang dipakai bersama; jangan diubah dari luar. */
export function lambert(warna: string, terang = 0) {
  const kunci = `l|${warna}|${terang}`;
  let m = cacheBahan.get(kunci);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: warna, toneMapped: false, emissive: terang ? warna : "#000000", emissiveIntensity: terang });
    cacheBahan.set(kunci, m);
  }
  return m;
}

/** Bahan rata tanpa cahaya (untuk benda yang menyala). */
export function rata(warna: string) {
  const kunci = `b|${warna}`;
  let m = cacheBahan.get(kunci);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color: warna, toneMapped: false });
    cacheBahan.set(kunci, m);
  }
  return m;
}

export function tepi(warna: string, opacity: number) {
  const kunci = `t|${warna}|${opacity}`;
  let m = cacheBahan.get(kunci);
  if (!m) {
    m = new THREE.LineBasicMaterial({ color: warna, transparent: true, opacity, toneMapped: false });
    cacheBahan.set(kunci, m);
  }
  return m;
}

/** Bahan milik satu benda (misalnya yang memudar), dibuang saat benda dilepas. */
export function useBahanSendiri<T extends THREE.Material | THREE.Material[] | null>(buat: () => T, deps: unknown[] = []) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const m = useMemo(buat, deps);
  useEffect(
    () => () => {
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m?.dispose();
    },
    [m],
  );
  return m;
}

// ——— Tekstur

/** Cahaya bulat lembut untuk alas adegan di latar hijau gelap. */
export function teksturCahaya(warna = "14,138,79", kuat = 0.32) {
  return tekstur(`cahaya-evidence|${warna}|${kuat}`, 256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
    g.addColorStop(0, `rgba(${warna},${kuat})`);
    g.addColorStop(0.55, `rgba(${warna},${kuat * 0.35})`);
    g.addColorStop(1, `rgba(${warna},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

export type GayaLabel = {
  ukuran?: number;
  warna?: string;
  /** Warna latar pil; null untuk tulisan tanpa latar. */
  latar?: string | null;
  garis?: string | null;
  tebal?: number;
  serif?: boolean;
  kapital?: boolean;
};

/** Persegi panjang bersudut bulat (tanpa roundRect supaya aman di Safari lama). */
export function jalurBulat(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const cacheLabel = new Map<string, { peta: THREE.CanvasTexture; aspek: number }>();

/** Tulisan (boleh beberapa baris, dipisah \n) di atas pil membulat. Dibuat sekali lalu disimpan. */
export function teksturLabel(teks: string, gaya: GayaLabel = {}) {
  const { ukuran = 44, warna = WARNA.gading, latar = "rgba(7,22,16,0.86)", garis = "rgba(220,195,138,0.6)", tebal, serif = false, kapital = false } = gaya;
  const kunci = JSON.stringify([teks, ukuran, warna, latar, garis, tebal, serif, kapital]);
  const ada = cacheLabel.get(kunci);
  if (ada) return ada;

  const kanvas = document.createElement("canvas");
  let ctx = kanvas.getContext("2d")!;
  const font = `${tebal ?? (serif ? 600 : 500)} ${ukuran}px ${serif ? SERIF : SANS}`;
  const spasi = kapital ? ukuran * 0.16 : 0;
  const baris = (kapital ? teks.toUpperCase() : teks).split("\n");
  const aturHuruf = (c: CanvasRenderingContext2D) => {
    c.font = font;
    if ("letterSpacing" in c) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spasi}px`;
  };
  aturHuruf(ctx);
  const lebarTeks = Math.max(...baris.map((b) => ctx.measureText(b).width));
  const tinggiBaris = ukuran * 1.22;
  const padX = latar ? ukuran * 0.62 : ukuran * 0.16;
  const padY = latar ? ukuran * 0.36 : ukuran * 0.12;
  const w = Math.ceil(lebarTeks + padX * 2 + 4);
  const h = Math.ceil(tinggiBaris * baris.length + padY * 2 + 4);
  kanvas.width = w;
  kanvas.height = h;
  ctx = kanvas.getContext("2d")!;
  if (latar) {
    jalurBulat(ctx, 2, 2, w - 4, h - 4, Math.min(h / 2 - 2, ukuran * 0.9));
    ctx.fillStyle = latar;
    ctx.fill();
    if (garis) {
      ctx.lineWidth = Math.max(2, ukuran * 0.06);
      ctx.strokeStyle = garis;
      ctx.stroke();
    }
  }
  aturHuruf(ctx);
  ctx.fillStyle = warna;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  baris.forEach((b, i) => ctx.fillText(b, w / 2 + spasi / 2, padY + 2 + tinggiBaris * (i + 0.5) + ukuran * 0.04));

  const peta = new THREE.CanvasTexture(kanvas);
  peta.colorSpace = THREE.SRGBColorSpace;
  peta.anisotropy = 4;
  const hasil = { peta, aspek: w / h };
  cacheLabel.set(kunci, hasil);
  return hasil;
}

// Tulisan di kanvas digambar sekali saja, jadi hurufnya harus sudah termuat.
let hurufSudah = false;
const hurufSiap: Promise<void> = (typeof document !== "undefined" && "fonts" in document
  ? Promise.all([document.fonts.load('500 40px "DM Sans"'), document.fonts.load('600 40px "Noto Serif"')]).then(() => undefined, () => undefined)
  : Promise.resolve()
).then(() => {
  hurufSudah = true;
});

export function useHurufSiap() {
  const [siap, setSiap] = useState(hurufSudah);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (siap) return;
    let hidup = true;
    hurufSiap.then(() => {
      if (hidup) {
        setSiap(true);
        invalidate();
      }
    });
    return () => {
      hidup = false;
    };
  }, [siap, invalidate]);
  return siap;
}

// ——— Pengendali progres, lapis, dan waktu

export type Keadaan = {
  /** Progres bab yang dihaluskan (0–1); 1 bila tenang. */
  p: number;
  /** 0–1 saat lapis kedua (lanjut) terbuka. */
  l1: number;
  /** 0–1 saat lapis ketiga (dalam) terbuka. */
  l2: number;
  /** Waktu berjalan (detik) untuk gerak yang terus hidup; berhenti bila tenang. */
  t: number;
  dt: number;
  tenang: boolean;
};

/**
 * Menghaluskan progres dan lapis, lalu meminta gambar ulang hanya selama ada
 * yang masih bergerak (Canvas memakai frameloop="demand"). Gerak yang hidup
 * terus (butiran, putaran) cukup membaca `t`: selama kanvas terlihat dan gerak
 * tidak dikurangi, mesin cerita sudah meminta gambar baru ±30 kali per detik.
 * Panggil paling awal di komponen adegan supaya useFrame-nya berjalan lebih dulu.
 */
export function useKendali({ progres, lapis, tenang }: PropsAdegan3D): MutableRefObject<Keadaan> {
  const invalidate = useThree((s) => s.invalidate);
  const k = useRef<Keadaan>({ p: tenang ? 1 : 0, l1: lapis >= 1 ? 1 : 0, l2: lapis >= 2 ? 1 : 0, t: 0, dt: 0, tenang });
  const acuan = useRef({ lapis, tenang, berubah: true });
  acuan.current.lapis = lapis;
  acuan.current.tenang = tenang;

  useEffect(() => {
    acuan.current.berubah = true;
    invalidate();
  }, [lapis, tenang, invalidate]);

  useFrame((_, delta) => {
    const s = k.current;
    const a = acuan.current;
    const dt = Math.min(delta, 1 / 20);
    const tp = a.tenang ? 1 : jepit(progres.current);
    const t1 = a.lapis >= 1 ? 1 : 0;
    const t2 = a.lapis >= 2 ? 1 : 0;
    const lama = s.p + s.l1 * 3 + s.l2 * 7;
    if (a.tenang) {
      s.p = tp;
      s.l1 = t1;
      s.l2 = t2;
    } else {
      s.p = THREE.MathUtils.damp(s.p, tp, 4.5, dt);
      s.l1 = THREE.MathUtils.damp(s.l1, t1, 4, dt);
      s.l2 = THREE.MathUtils.damp(s.l2, t2, 4, dt);
      if (Math.abs(s.p - tp) < 2e-4) s.p = tp;
      if (Math.abs(s.l1 - t1) < 2e-3) s.l1 = t1;
      if (Math.abs(s.l2 - t2) < 2e-3) s.l2 = t2;
    }
    s.tenang = a.tenang;
    s.dt = a.tenang ? 0 : dt;
    s.t += s.dt;
    const berubah = lama !== s.p + s.l1 * 3 + s.l2 * 7;
    // Satu gambar tambahan setelah perubahan terakhir supaya anak komponen ikut membaca nilai akhir.
    if (berubah || a.berubah) invalidate();
    a.berubah = berubah;
  });
  return k;
}

/**
 * Menempatkan kamera supaya kotak isi adegan (lebar × tinggi di sekitar `sasaran`)
 * selalu muat, baik di panel tinggi desktop maupun panel lebar ponsel, dan tidak
 * jatuh di tepi kanvas yang dipudarkan mesin.
 */
export function useKamera(sasaran: V3, arah: V3, lebar: number, tinggi: number, fov = 30) {
  const { camera, size, invalidate } = useThree();
  const kunci = `${sasaran.join()}|${arah.join()}|${lebar}|${tinggi}|${fov}`;
  useEffect(() => {
    const kamera = camera as THREE.PerspectiveCamera;
    if (!("fov" in kamera)) return;
    const aspek = size.width / Math.max(1, size.height);
    const v = THREE.MathUtils.degToRad(fov);
    // Mesin memudarkan tepi kanvas: di layar lebar berbentuk elips (penuh sampai 74%),
    // di ponsel hanya atas dan bawah (8%). Isi adegan dijaga di bagian yang tidak pudar.
    const lebarLayar = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    const ruangL = lebarLayar ? 0.86 : 0.9;
    const ruangT = lebarLayar ? 0.88 : 0.86;
    const jarak = Math.max(tinggi / ruangT / 2 / Math.tan(v / 2), lebar / ruangL / 2 / (Math.tan(v / 2) * aspek));
    const titik = new THREE.Vector3(...sasaran);
    kamera.fov = fov;
    kamera.aspect = aspek;
    kamera.near = Math.max(0.05, jarak / 50);
    kamera.far = jarak * 6;
    kamera.position.copy(titik).addScaledVector(new THREE.Vector3(...arah).normalize(), jarak);
    kamera.up.set(0, 1, 0);
    kamera.lookAt(titik);
    kamera.updateProjectionMatrix();
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, size.width, size.height, invalidate, kunci]);
}

// ——— Komponen kecil

/** Cahaya adegan: terang dari atas, sedikit hijau dari bawah supaya selaras dengan latar. */
export function Cahaya() {
  return (
    <>
      <hemisphereLight args={["#FFFFFF", "#3B5A4C", 1.55]} />
      <directionalLight position={[4, 8, 6]} intensity={1.7} />
      <directionalLight position={[-6, 3, -4]} intensity={0.45} />
    </>
  );
}

/** Kotak dengan garis tepi tipis (gaya vektor). */
export function Kotak({ p, s = [1, 1, 1], r, bahan, garis = tepi(WARNA.gelap, 0.45) }: { p?: V3; s?: V3; r?: V3; bahan: THREE.Material; garis?: THREE.Material | null }) {
  return (
    <group position={p} rotation={r}>
      <mesh geometry={geo.kotak} material={bahan} scale={s} />
      {garis && <lineSegments geometry={geoTepi.kotak} material={garis} scale={s} />}
    </group>
  );
}

/** Silinder tegak; `s` = [diameter, tinggi, diameter]. */
export function Silinder({ p, s = [1, 1, 1], r, bahan, garis = tepi(WARNA.gelap, 0.45) }: { p?: V3; s?: V3; r?: V3; bahan: THREE.Material; garis?: THREE.Material | null }) {
  return (
    <group position={p} rotation={r}>
      <mesh geometry={geo.silinder} material={bahan} scale={s} />
      {garis && <lineSegments geometry={geoTepi.silinder} material={garis} scale={s} />}
    </group>
  );
}

/** Cahaya bulat di lantai adegan. */
export function AlasCahaya({ p = [0, 0, 0], ukuran = 8, warna, kuat }: { p?: V3; ukuran?: number; warna?: string; kuat?: number }) {
  const peta = teksturCahaya(warna, kuat);
  const bahan = useBahanSendiri(() => new THREE.MeshBasicMaterial({ map: peta, transparent: true, depthWrite: false, toneMapped: false }), [peta]);
  return <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} scale={[ukuran, ukuran, 1]} geometry={geo.bidang} material={bahan} renderOrder={-1} />;
}

const qSementara = new THREE.Quaternion();
const vSementara = new THREE.Vector3();
/** Tinggi pil label paling kecil di layar (piksel CSS): lebih besar di layar lebar. */
const minPiksel = (lebarKanvas: number) => (lebarKanvas >= 560 ? 30 : 25);

/**
 * Label pil yang selalu menghadap kamera dan selalu terbaca (tidak tertutup benda).
 * `muncul` menghitung tampak 0–1 dari keadaan adegan setiap bingkai.
 */
export function Label({
  teks,
  gaya,
  p = [0, 0, 0],
  tinggi = 0.32,
  k,
  muncul,
  jangkar = "tengah",
}: {
  teks: string;
  gaya?: GayaLabel;
  p?: V3;
  tinggi?: number;
  k?: MutableRefObject<Keadaan>;
  muncul?: (k: Keadaan) => number;
  /** Titik pegang label: tengah, kiri (label tumbuh ke kanan), atau kanan. */
  jangkar?: "tengah" | "kiri" | "kanan";
}) {
  const { peta, aspek } = teksturLabel(teks, gaya);
  const bahan = useBahanSendiri(() => new THREE.MeshBasicMaterial({ map: peta, transparent: true, depthWrite: false, depthTest: false, toneMapped: false }), [peta]);
  const ref = useRef<THREE.Group>(null);
  const lebar = tinggi * aspek;
  const geser = jangkar === "kiri" ? lebar / 2 : jangkar === "kanan" ? -lebar / 2 : 0;
  useFrame(({ camera, size }) => {
    const g = ref.current;
    if (!g) return;
    if (g.parent) {
      g.parent.getWorldQuaternion(qSementara);
      qSementara.invert().multiply(camera.quaternion);
      g.quaternion.copy(qSementara);
    } else g.quaternion.copy(camera.quaternion);
    const o = muncul && k ? jepit(muncul(k.current)) : 1;
    bahan.opacity = o;
    g.visible = o > 0.01;
    // Di kanvas sempit (ponsel) label diperbesar supaya tulisannya tetap terbaca.
    let besar = 1;
    if ("fov" in camera) {
      const jarak = camera.position.distanceTo(g.getWorldPosition(vSementara));
      const pikselPerSatuan = size.height / (2 * jarak * Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov) / 2));
      besar = jepit(minPiksel(size.width) / (tinggi * pikselPerSatuan), 1, 1.6);
    }
    g.scale.setScalar((0.92 + 0.08 * o) * besar);
  });
  return (
    <group ref={ref} position={p}>
      <mesh position={[geser, 0, 0]} geometry={geo.bidang} material={bahan} scale={[lebar, tinggi, 1]} renderOrder={20} />
    </group>
  );
}
