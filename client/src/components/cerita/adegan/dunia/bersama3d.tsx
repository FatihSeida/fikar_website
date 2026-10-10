import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Bahan bersama adegan Series 1: laut malam, karang, perahu dengan pendayung,
 * dan bola dunia dengan busur cahaya. Semuanya dibangun dari geometri sederhana
 * (tanpa berkas dari luar) dengan gaya ilustrasi vektor: bidang rata dan garis
 * tepi tipis. Tulisan memakai Html (huruf situs), bukan tekstur kanvas.
 */

export type V3 = [number, number, number];

export const W = {
  malam: "#071610",
  /** Warna kabut laut: sedikit lebih terang dari latar supaya cakrawala menyatu dengan cahaya halaman. */
  kabut: "#0a2219",
  hijauGelap: "#0B2A1E",
  laut: "#0d3326",
  hijau: "#0E8A4F",
  hijauMuda: "#3FBF7F",
  emas: "#DCC38A",
  emasTua: "#A88A4A",
  gading: "#F6F4E9",
  karang: "#29483c",
  panas: "#E8875A",
  kulit: "#C89F7A",
  peci: "#121815",
};

export const jepit = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const mulus = (a: number, b: number, x: number) => {
  const t = jepit((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const campur = (a: number, b: number, t: number) => a + (b - a) * t;

/** Progres yang dipakai adegan: keadaan akhir bila pembaca meminta gerak dikurangi. */
export const bacaProgres = (progres: MutableRefObject<number>, tenang: boolean) => (tenang ? 1 : jepit(progres.current));

/** Jarak kamera supaya benda berjari-jari `jari` muat di layar, untuk lebar dan tinggi kanvas berapa pun. */
export function jarakPas(kamera: THREE.Camera, aspek: number, jari: number) {
  const fov = (kamera as THREE.PerspectiveCamera).fov ?? 35;
  const v = THREE.MathUtils.degToRad(fov) / 2;
  const h = Math.atan(Math.tan(v) * aspek);
  return jari / Math.sin(Math.min(v, h));
}

const sementara = new THREE.Vector3();

/** Menaruh kamera di arah `arah` dari `sasaran` pada jarak yang pas; `jauh` 1 = pas, lebih besar = mundur. */
export function aturKamera(kamera: THREE.Camera, aspek: number, sasaran: V3, arah: V3, jari: number, jauh = 1) {
  const d = jarakPas(kamera, aspek, jari) * jauh;
  sementara.set(...arah).normalize().multiplyScalar(d);
  kamera.position.set(sasaran[0] + sementara.x, sasaran[1] + sementara.y, sasaran[2] + sementara.z);
  kamera.lookAt(sasaran[0], sasaran[1], sasaran[2]);
}

// ——— Tekstur cahaya lembut (tanpa tulisan), dibuat sekali

let teksturCahaya: THREE.CanvasTexture | null = null;
export function cahayaLembut() {
  if (!teksturCahaya) {
    const k = document.createElement("canvas");
    k.width = k.height = 128;
    const c = k.getContext("2d")!;
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.45)");
    g.addColorStop(0.6, "rgba(255,255,255,0.08)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
    teksturCahaya = new THREE.CanvasTexture(k);
    teksturCahaya.colorSpace = THREE.SRGBColorSpace;
  }
  return teksturCahaya;
}

export function Pendar({ p = [0, 0, 0], ukuran = 1, warna = W.emas, kuat = 1 }: { p?: V3; ukuran?: number; warna?: string; kuat?: number }) {
  return (
    <sprite position={p} scale={[ukuran, ukuran, 1]}>
      <spriteMaterial map={cahayaLembut()} color={warna} transparent opacity={kuat} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
    </sprite>
  );
}

// ——— Langit dan laut malam

export function CahayaMalam({ kuat = 1 }: { kuat?: number }) {
  return (
    <>
      <hemisphereLight args={["#cfeadb", "#06140e", 0.9 * kuat]} />
      <directionalLight position={[-6, 7, 5]} intensity={1.6 * kuat} color="#fff1d2" />
      <directionalLight position={[7, 3, -5]} intensity={0.45 * kuat} color="#7fd1a8" />
    </>
  );
}

export function Bintang({ jumlah = 220, jari = 40, biji = 3 }: { jumlah?: number; jari?: number; biji?: number }) {
  const geo = useMemo(() => {
    let s = biji;
    const acak = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    const pos = new Float32Array(jumlah * 3);
    for (let i = 0; i < jumlah; i++) {
      const a = acak() * Math.PI - Math.PI / 2;
      const t = 0.08 + acak() * 0.9;
      pos[i * 3] = Math.sin(a) * jari;
      pos[i * 3 + 1] = t * jari * 0.55;
      pos[i * 3 + 2] = -Math.cos(a) * jari;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [jumlah, jari, biji]);
  return (
    <points geometry={geo}>
      <pointsMaterial color={W.gading} size={0.2} sizeAttenuation transparent opacity={0.85} depthWrite={false} fog={false} />
    </points>
  );
}

export function Bulan({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <Pendar ukuran={9} warna={W.emas} kuat={0.35} />
      <mesh>
        <circleGeometry args={[0.9, 48]} />
        <meshBasicMaterial color="#F3E3B6" fog={false} />
      </mesh>
      <mesh position={[0.28, 0.18, 0.01]}>
        <circleGeometry args={[0.2, 24]} />
        <meshBasicMaterial color="#E4CF98" fog={false} />
      </mesh>
      <mesh position={[-0.3, -0.25, 0.01]}>
        <circleGeometry args={[0.13, 24]} />
        <meshBasicMaterial color="#E4CF98" fog={false} />
      </mesh>
    </group>
  );
}

/**
 * Laut bersegi yang bergelombang pelan. `jalan` menggeser pola gelombang ke
 * belakang sehingga perahu tampak melaju walaupun tetap di tengah.
 */
export function Laut({ jalan, tenang, lebar = 70, dalam = 60, segmen = 56, warna = W.laut }: { jalan?: MutableRefObject<number>; tenang: boolean; lebar?: number; dalam?: number; segmen?: number; warna?: string }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(lebar, dalam, segmen, Math.round((segmen * dalam) / lebar));
    g.rotateX(-Math.PI / 2);
    return g;
  }, [lebar, dalam, segmen]);
  const asal = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  useFrame(({ clock }) => {
    const t = tenang ? 0 : clock.elapsedTime;
    const geser = jalan?.current ?? 0;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < pos.count; i++) {
      const x = asal[i * 3] + geser;
      const z = asal[i * 3 + 2];
      arr[i * 3 + 1] = 0.14 * Math.sin(x * 0.8 + t * 0.9) + 0.1 * Math.sin(z * 1.1 - t * 0.7 + x * 0.3) + 0.05 * Math.sin((x + z) * 2.1 + t * 1.4);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh geometry={geo} position={[0, -0.05, 0]}>
      <meshLambertMaterial color={warna} flatShading />
    </mesh>
  );
}

/** Kilau bulan di permukaan laut: garis-garis cahaya yang berkedip pelan. */
export function KilauBulan({ dari, tenang, jumlah = 14 }: { dari: [number, number]; tenang: boolean; jumlah?: number }) {
  const grup = useRef<THREE.Group>(null);
  const garis = useMemo(() => Array.from({ length: jumlah }, (_, i) => {
    const t = i / jumlah;
    return { x: campur(dari[0], 0, t) + Math.sin(i * 7.3) * 0.5, z: campur(dari[1], 3, t), w: 0.5 + Math.abs(Math.sin(i * 3.1)) * 1.4, fase: i * 1.7 };
  }), [dari, jumlah]);
  useFrame(({ clock }) => {
    const g = grup.current;
    if (!g) return;
    const t = tenang ? 0 : clock.elapsedTime;
    g.children.forEach((m, i) => {
      ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.12 + 0.22 * (0.5 + 0.5 * Math.sin(t * 1.6 + garis[i].fase));
    });
  });
  return (
    <group ref={grup}>
      {garis.map((g, i) => (
        <mesh key={i} position={[g.x, 0.1, g.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[g.w, 0.045]} />
          <meshBasicMaterial color="#F3E3B6" transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

// ——— Karang

const cacheBatu = new Map<number, { geo: THREE.BufferGeometry; tepi: THREE.EdgesGeometry }>();
function geoBatu(biji: number) {
  let hasil = cacheBatu.get(biji);
  if (!hasil) {
    const g = new THREE.IcosahedronGeometry(1, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const z = p.getZ(i);
      const n = 0.5 * Math.sin(x * 2.7 + biji) + 0.3 * Math.sin(y * 3.3 + biji * 1.7) + 0.25 * Math.sin(z * 4.1 + biji * 0.6) + 0.15 * Math.sin((x + y + z) * 5.3 + biji);
      const s = 1 + 0.2 * n;
      p.setXYZ(i, x * s, y * s, z * s);
    }
    g.computeVertexNormals();
    hasil = { geo: g, tepi: new THREE.EdgesGeometry(g, 18) };
    cacheBatu.set(biji, hasil);
  }
  return hasil;
}

const bahanKarang = new THREE.MeshLambertMaterial({ color: W.karang, flatShading: true });
const bahanTepiKarang = new THREE.LineBasicMaterial({ color: W.emas, transparent: true, opacity: 0.3 });

export function Bongkah({ p, s, r = [0, 0, 0], biji }: { p: V3; s: V3; r?: V3; biji: number }) {
  const { geo, tepi } = geoBatu(biji);
  return (
    <group position={p} rotation={r} scale={s}>
      <mesh geometry={geo} material={bahanKarang} />
      <lineSegments geometry={tepi} material={bahanTepiKarang} />
    </group>
  );
}

/** Karang tinggi dari beberapa bongkah bertumpuk, dengan buih di kakinya. */
export function Karang({ p, tinggi = 4, biji = 1, lebar = 1 }: { p: V3; tinggi?: number; biji?: number; lebar?: number }) {
  const h = tinggi;
  return (
    <group position={p} scale={[lebar, 1, lebar]}>
      <Bongkah p={[0, h * 0.12, 0]} s={[1.45, h * 0.24, 1.3]} biji={biji} />
      <Bongkah p={[0.85, h * 0.04, 0.3]} s={[0.95, h * 0.14, 0.8]} r={[0, 0.6, 0]} biji={biji + 3} />
      <Bongkah p={[0.12, h * 0.42, -0.05]} s={[1.0, h * 0.27, 0.92]} r={[0, 1.1, 0.06]} biji={biji + 1} />
      <Bongkah p={[-0.1, h * 0.72, 0.05]} s={[0.66, h * 0.24, 0.6]} r={[0.05, 2.2, -0.08]} biji={biji + 2} />
      <Bongkah p={[0.02, h * 0.93, 0]} s={[0.34, h * 0.12, 0.32]} r={[0, 0.4, 0.1]} biji={biji + 4} />
      <mesh position={[0.2, 0.04, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.9, 40]} />
        <meshBasicMaterial color={W.gading} transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ——— Perahu dan pendayung

/** Lambung perahu: penampang setengah elips yang menyempit ke haluan dan buritan, ujungnya sedikit naik. */
function buatLambung(panjang: number, lebar: number, tinggi: number) {
  const nx = 28;
  const na = 10;
  const posisi: number[] = [];
  const indeks: number[] = [];
  const bibir: THREE.Vector3[][] = [[], []];
  for (let i = 0; i <= nx; i++) {
    const u = i / nx;
    const x = (u - 0.5) * panjang;
    const e = 1 - Math.pow(2 * u - 1, 2);
    const w = (lebar / 2) * Math.pow(Math.max(e, 0.0001), 0.55);
    const d = tinggi * (0.25 + 0.75 * Math.pow(Math.max(e, 0), 0.5));
    const naik = tinggi * 0.55 * Math.pow(2 * u - 1, 4);
    for (let j = 0; j <= na; j++) {
      const a = (j / na) * Math.PI;
      posisi.push(x, naik - d * Math.sin(a), w * Math.cos(a));
    }
    bibir[0].push(new THREE.Vector3(x, naik, w));
    bibir[1].push(new THREE.Vector3(x, naik, -w));
  }
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < na; j++) {
      const a = i * (na + 1) + j;
      const b = a + na + 1;
      indeks.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(posisi, 3));
  g.setIndex(indeks);
  g.computeVertexNormals();
  return { geo: g, bibir };
}

export type KeadaanAwak = { fase: number[]; hadap: number[] };

const BAJU = [W.gading, W.emas, "#7FC9A0", "#E9C46A", "#F6F4E9", "#A9D8BF", W.emas, "#F0E2BE"];

type PropsPerahu = {
  panjang?: number;
  lebar?: number;
  awak?: number;
  keadaan?: MutableRefObject<KeadaanAwak>;
  lentera?: boolean;
  bendera?: boolean;
  bajuSeragam?: boolean;
  tenang: boolean;
};

/**
 * Perahu dengan awak yang mendayung. Fase dan arah hadap setiap pendayung
 * dibaca dari `keadaan` setiap gambar: hadap 0 menghadap haluan, 1 berbalik.
 * Haluan menghadap +x.
 */
export function Perahu({ panjang = 3.4, lebar = 0.95, awak = 4, keadaan, lentera = false, bendera = true, bajuSeragam = false, tenang }: PropsPerahu) {
  const tinggi = lebar * 0.45;
  const { geo, bibir } = useMemo(() => buatLambung(panjang, lebar, tinggi), [panjang, lebar, tinggi]);
  const garisBibir = useMemo(() => {
    const bahan = new THREE.LineBasicMaterial({ color: W.emas });
    return bibir.map((sisi) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(sisi), bahan));
  }, [bibir]);
  const badan = useRef<(THREE.Group | null)[]>([]);
  const dayung = useRef<(THREE.Group | null)[]>([]);
  const angkat = useRef<(THREE.Group | null)[]>([]);
  const benderaRef = useRef<THREE.Group>(null);
  const posisiAwak = useMemo(() => Array.from({ length: awak }, (_, i) => (awak === 1 ? 0 : -panjang * 0.3 + (i * panjang * 0.6) / (awak - 1))), [awak, panjang]);

  useFrame(({ clock }) => {
    const k = keadaan?.current;
    for (let i = 0; i < awak; i++) {
      const fase = k?.fase[i] ?? 0;
      const hadap = k?.hadap[i] ?? 0;
      const sisi = i % 2 === 0 ? 1 : -1;
      const b = badan.current[i];
      if (b) b.rotation.y = hadap * Math.PI;
      const d = dayung.current[i];
      if (d) d.rotation.z = Math.sin(fase) * 0.62;
      const a = angkat.current[i];
      // Bilah masuk air saat ditarik ke belakang, terangkat saat kembali ke depan.
      if (a) a.rotation.x = -sisi * (0.32 + 0.24 * (0.5 + 0.5 * Math.cos(fase)));
    }
    if (benderaRef.current) benderaRef.current.rotation.y = (tenang ? 0 : Math.sin(clock.elapsedTime * 2.2) * 0.25) - 0.15;
  });

  return (
    <group>
      <mesh geometry={geo}>
        <meshLambertMaterial color={W.hijau} side={THREE.FrontSide} />
      </mesh>
      <mesh geometry={geo}>
        <meshLambertMaterial color="#E7DCC0" side={THREE.BackSide} />
      </mesh>
      {garisBibir.map((garis, i) => <primitive key={i} object={garis} />)}
      {posisiAwak.map((x, i) => {
        const sisi = i % 2 === 0 ? 1 : -1;
        return (
          <group key={i} position={[x, -tinggi * 0.2, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.16, 0.05, lebar * 0.82]} />
              <meshLambertMaterial color="#B88B55" />
            </mesh>
            <group ref={(el) => { badan.current[i] = el; }}>
              {/* Badan condong ke arah hadap dan lengan meraih ke depan, supaya arah hadap terbaca. */}
              <group position={[0, 0.04, 0]} rotation={[0, 0, -0.24]}>
                <mesh position={[0, 0.2, 0]}>
                  <cylinderGeometry args={[0.1, 0.14, 0.4, 10]} />
                  <meshLambertMaterial color={bajuSeragam ? W.gading : BAJU[i % BAJU.length]} />
                </mesh>
                <mesh position={[0, 0.49, 0]}>
                  <sphereGeometry args={[0.1, 14, 10]} />
                  <meshLambertMaterial color={W.kulit} />
                </mesh>
                <mesh position={[0, 0.58, 0]}>
                  <cylinderGeometry args={[0.085, 0.09, 0.07, 14]} />
                  <meshLambertMaterial color={W.peci} />
                </mesh>
                <mesh position={[0.1, 0.3, sisi * 0.06]} rotation={[0, 0, 1.15]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.26, 6]} />
                  <meshLambertMaterial color={bajuSeragam ? W.gading : BAJU[i % BAJU.length]} />
                </mesh>
              </group>
              {/* Dayung: berayun maju-mundur, bilahnya masuk dan keluar air */}
              <group position={[0.02, 0.36, sisi * 0.13]} ref={(el) => { dayung.current[i] = el; }}>
                <group ref={(el) => { angkat.current[i] = el; }}>
                  <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[0.016, 0.016, 1.0, 6]} />
                    <meshLambertMaterial color="#D9B97E" />
                  </mesh>
                  <mesh position={[0, -1.08, 0]}>
                    <boxGeometry args={[0.13, 0.3, 0.025]} />
                    <meshLambertMaterial color={W.emas} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        );
      })}
      {bendera && (
        <group position={[-panjang * 0.43, tinggi * 0.4, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.0, 6]} />
            <meshLambertMaterial color="#D9B97E" />
          </mesh>
          <group ref={benderaRef} position={[0, 0.86, 0]}>
            <mesh position={[-0.22, 0, 0]}>
              <planeGeometry args={[0.44, 0.26]} />
              <meshLambertMaterial color={W.hijau} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[-0.22, 0, 0.002]}>
              <planeGeometry args={[0.44, 0.07]} />
              <meshBasicMaterial color={W.peci} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      )}
      {lentera && (
        <group position={[panjang * 0.45, tinggi * 0.75, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.5, 6]} />
            <meshLambertMaterial color="#D9B97E" />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.07, 12, 8]} />
            <meshBasicMaterial color="#FFE7A8" />
          </mesh>
          <Pendar p={[0, 0.52, 0]} ukuran={1.5} warna="#FFD98A" kuat={0.8} />
          <pointLight position={[0, 0.55, 0]} intensity={1.6} distance={4} color="#FFD98A" />
        </group>
      )}
    </group>
  );
}

/** Jejak buih di belakang perahu, makin panjang saat perahu makin cepat. */
export function Buih({ panjangPerahu, laju }: { panjangPerahu: number; laju: MutableRefObject<number> }) {
  const kiri = useRef<THREE.Mesh>(null);
  const kanan = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const v = jepit(laju.current);
    for (const [m, s] of [[kiri.current, 1], [kanan.current, -1]] as const) {
      if (!m) continue;
      m.scale.set(0.3 + v * 3.2, 1, 1);
      m.position.set(-panjangPerahu * 0.5 - (0.3 + v * 3.2) / 2 * Math.cos(0.32), 0.12, s * (0.15 + (0.3 + v * 3.2) / 2 * Math.sin(0.32)));
      (m.material as THREE.MeshBasicMaterial).opacity = 0.08 + v * 0.35;
    }
  });
  return (
    <>
      {[kiri, kanan].map((r, i) => (
        <mesh key={i} ref={r} rotation={[-Math.PI / 2, 0, (i === 0 ? -1 : 1) * 0.32]}>
          <planeGeometry args={[1, 0.06]} />
          <meshBasicMaterial color={W.gading} transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

/** Panah melingkar di permukaan air: tanda perahu berputar di tempat. */
export function PanahPutar({ jari, kuat, tenang }: { jari: number; kuat: () => number; tenang: boolean }) {
  const grup = useRef<THREE.Group>(null);
  const bahan = useMemo(() => new THREE.MeshBasicMaterial({ color: W.emas, transparent: true, opacity: 0, depthWrite: false }), []);
  const busur = Math.PI * 1.55;
  const ujung = useMemo(() => {
    const posisi = new THREE.Vector3(Math.cos(busur) * jari, 0, -Math.sin(busur) * jari);
    const arah = new THREE.Vector3(-Math.sin(busur), 0, -Math.cos(busur)).normalize();
    return { posisi, putar: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah) };
  }, [busur, jari]);
  useFrame(({ clock }) => {
    const k = jepit(kuat());
    bahan.opacity = 0.7 * k;
    const g = grup.current;
    if (!g) return;
    g.visible = k > 0.01;
    g.rotation.y = tenang ? 0 : clock.elapsedTime * 0.9;
  });
  return (
    <group ref={grup} position={[0, 0.3, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={bahan}>
        <torusGeometry args={[jari, 0.035, 6, 72, busur]} />
      </mesh>
      <mesh position={ujung.posisi} quaternion={ujung.putar} material={bahan}>
        <coneGeometry args={[0.13, 0.32, 12]} />
      </mesh>
    </group>
  );
}

// ——— Tulisan di dalam adegan (Html memakai huruf situs)

export type Nada = "biasa" | "emas" | "panas" | "hijau";
const WARNA_NADA: Record<Nada, string> = {
  biasa: "border-white/30 text-[#F6F4E9]",
  emas: "border-[#DCC38A]/70 text-[#F3E3B6]",
  panas: "border-[#E8875A]/70 text-[#F7C9AE]",
  hijau: "border-[#3FBF7F]/70 text-[#C8F0DA]",
};

/** Label kecil di satu titik adegan. `tampil` boleh berupa fungsi yang dibaca setiap gambar. */
export function Label({ p = [0, 0, 0], tampil, children, nada = "biasa", kecil = false }: { p?: V3; tampil: boolean | (() => boolean); children: ReactNode; nada?: Nada; kecil?: boolean }) {
  const isi = useRef<HTMLSpanElement>(null);
  useFrame(() => {
    const el = isi.current;
    if (!el) return;
    const ya = typeof tampil === "function" ? tampil() : tampil;
    el.style.opacity = ya ? "1" : "0";
    el.style.transform = `translateY(${ya ? 0 : 6}px)`;
  });
  return (
    <Html position={p} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <span
        ref={isi}
        className={`block whitespace-nowrap rounded-full border bg-[#061511]/85 font-sans font-medium shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-500 ${kecil ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px] md:text-xs"} ${WARNA_NADA[nada]}`}
        style={{ opacity: 0 }}
      >
        {children}
      </span>
    </Html>
  );
}

const depanKamera = new THREE.Vector3();
const atasKamera = new THREE.Vector3();

/**
 * Keterangan di bagian bawah layar adegan yang berganti mengikuti progres,
 * misalnya "Belum seirama" lalu "Seirama". `bawah` 0 = tengah layar, 1 = tepi bawah.
 */
export function Keterangan({ tahap, progres, tenang, bawah = 0.72 }: { tahap: { dari: number; teks: string }[]; progres: MutableRefObject<number>; tenang: boolean; bawah?: number }) {
  const grup = useRef<THREE.Group>(null);
  const [indeks, setIndeks] = useState(() => (tenang ? tahap.length - 1 : 0));
  const sekarang = useRef(indeks);
  useFrame(({ camera }) => {
    const g = grup.current;
    if (g) {
      const fov = (camera as THREE.PerspectiveCamera).fov ?? 35;
      camera.getWorldDirection(depanKamera);
      atasKamera.set(0, 1, 0).applyQuaternion(camera.quaternion);
      g.position.copy(camera.position).addScaledVector(depanKamera, 6).addScaledVector(atasKamera, -Math.tan((fov * RAD) / 2) * 6 * bawah);
    }
    const pr = bacaProgres(progres, tenang);
    let i = 0;
    tahap.forEach((t, j) => { if (pr >= t.dari) i = j; });
    if (i !== sekarang.current) {
      sekarang.current = i;
      setIndeks(i);
    }
  });
  return (
    <group ref={grup}>
      <Html center zIndexRange={[25, 0]} style={{ pointerEvents: "none" }}>
        <span className="block whitespace-nowrap border-b border-[#DCC38A]/60 bg-[#061511]/75 px-3 py-1.5 font-serif text-[13px] italic text-[#F6F4E9] shadow-[0_8px_24px_rgba(0,0,0,0.35)] md:text-[15px]">
          {tahap[indeks]?.teks}
        </span>
      </Html>
    </group>
  );
}

// ——— Bola dunia

export const RAD = Math.PI / 180;
export function titikDunia(lon: number, lat: number, jari = 1) {
  const la = lat * RAD;
  const lo = lon * RAD;
  return new THREE.Vector3(jari * Math.cos(la) * Math.sin(lo), jari * Math.sin(la), jari * Math.cos(la) * Math.cos(lo));
}

/** Putaran bola supaya titik (lon, lat) menghadap kamera di +z. */
export const putaranKe = (lon: number, lat: number): V3 => [lat * RAD, -lon * RAD, 0];

// Garis pantai sangat kasar (lon, lat), cukup untuk peta titik-titik.
const BENUA: number[][] = [
  // Amerika Utara
  [-168, 66, -162, 70, -156, 71, -140, 70, -128, 70, -115, 68, -95, 72, -82, 73, -80, 63, -90, 57, -82, 52, -78, 58, -70, 61, -64, 60, -56, 52, -66, 45, -70, 42, -76, 38, -76, 35, -81, 31, -80, 25, -83, 29, -90, 30, -97, 27, -97, 22, -92, 18, -87, 21, -88, 16, -83, 10, -79, 8, -82, 7, -86, 11, -92, 14, -100, 17, -106, 23, -112, 30, -110, 24, -115, 30, -118, 34, -123, 39, -124, 46, -125, 50, -133, 56, -140, 60, -150, 60, -158, 57, -165, 60, -166, 64],
  // Greenland
  [-50, 60, -42, 60, -22, 70, -18, 77, -30, 83, -55, 82, -70, 78, -58, 75, -54, 68],
  // Amerika Selatan
  [-80, 8, -72, 12, -62, 11, -52, 5, -50, 0, -44, -2, -35, -5, -35, -9, -39, -14, -41, -22, -48, -26, -53, -34, -58, -38, -63, -41, -65, -47, -69, -52, -72, -54, -75, -50, -73, -40, -71, -30, -70, -18, -76, -14, -81, -6, -80, 0, -78, 3],
  // Eurasia
  [-9, 37, -9, 43, -1, 44, -4, 48, 2, 51, 8, 54, 8, 57, 11, 58, 5, 58, 5, 62, 14, 67, 20, 70, 30, 71, 40, 67, 45, 68, 55, 70, 68, 72, 70, 68, 80, 73, 100, 77, 112, 74, 130, 72, 140, 72, 160, 70, 170, 70, 180, 68, 180, 65, 175, 62, 163, 60, 160, 54, 156, 51, 155, 57, 142, 59, 136, 54, 141, 48, 135, 43, 130, 42, 129, 35, 126, 37, 125, 40, 121, 40, 118, 38, 122, 37, 120, 32, 122, 30, 118, 24, 110, 21, 108, 18, 106, 11, 103, 9, 105, 12, 101, 13, 100, 7, 103, 1, 101, 3, 98, 8, 98, 16, 94, 17, 92, 22, 87, 22, 80, 15, 78, 8, 73, 17, 72, 21, 67, 25, 61, 25, 57, 26, 56, 24, 59, 22, 52, 16, 43, 13, 39, 21, 35, 28, 33, 31, 35, 36, 27, 36, 26, 40, 29, 41, 23, 40, 22, 37, 19, 40, 16, 38, 18, 40, 13, 44, 12, 45, 16, 41, 15, 40, 12, 42, 8, 44, 3, 43, 3, 42, 0, 39, -2, 37],
  // Afrika
  [-17, 21, -16, 28, -10, 30, -6, 36, 3, 37, 10, 37, 11, 33, 20, 31, 25, 32, 32, 31, 34, 28, 37, 22, 39, 16, 43, 12, 51, 12, 48, 5, 42, -1, 40, -10, 40, -16, 35, -24, 33, -28, 27, -34, 20, -35, 18, -31, 15, -26, 12, -18, 13, -12, 9, -1, 9, 4, 5, 5, -2, 5, -8, 4, -13, 8, -17, 13],
  [44, -25, 47, -25, 50, -15, 49, -12, 44, -17],
  // Australia dan Selandia Baru
  [114, -22, 114, -34, 118, -35, 124, -33, 131, -31, 135, -35, 138, -35, 141, -38, 147, -39, 150, -37, 153, -31, 153, -25, 146, -19, 143, -11, 141, -13, 136, -12, 136, -15, 131, -11, 126, -14, 122, -18],
  [172, -34, 175, -37, 178, -38, 175, -42, 171, -46, 167, -46, 171, -42, 174, -39],
  // Jepang, Inggris, Irlandia, Filipina, Taiwan
  [130, 31, 132, 34, 136, 35, 140, 36, 141, 40, 142, 45, 145, 44, 141, 41, 140, 35, 135, 33],
  [-5, 50, 1, 51, 2, 53, -1, 55, -2, 58, -5, 58, -6, 56, -3, 54, -4, 52],
  [-10, 52, -6, 52, -6, 55, -8, 55],
  [120, 18, 122, 18, 124, 12, 126, 7, 122, 7, 121, 12],
  [120, 22, 122, 25, 121.5, 25, 120, 23],
];

const NUSANTARA: number[][] = [
  [95, 5.5, 98, 4, 104, -1, 106, -6, 104, -6, 101, -3, 98, 0, 95, 3],
  [105, -6, 106, -6, 111, -6.5, 114, -7, 114.5, -8.5, 110, -8.2, 106, -7.6],
  [109, 1, 110, -3, 114, -4, 116, -4, 118, 1, 119, 5, 117, 7, 115, 5, 111, 2],
  [119, -5.5, 119.5, -3, 120, 1, 125, 1.6, 121, 0.4, 123, -1, 121.5, -2, 123, -5, 121, -4.5],
  [131, -1, 135, -3, 141, -2.5, 146, -6, 150, -10, 143, -9, 138, -8, 135, -4.5, 132, -2.5],
  [115, -8.1, 120, -8.3, 125, -8.3, 127, -8.3, 124, -10.2, 119, -9.6],
  [127.5, 1.5, 128.5, 2, 128.8, 0, 127.5, -0.5],
  [126, -3, 128, -3, 128, -3.8, 126, -3.8],
];

function dalam(lon: number, lat: number, poli: number[]) {
  let hasil = false;
  for (let i = 0, j = poli.length - 2; i < poli.length; j = i, i += 2) {
    const xi = poli[i], yi = poli[i + 1], xj = poli[j], yj = poli[j + 1];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hasil = !hasil;
  }
  return hasil;
}

function kotak(poli: number[]) {
  let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
  for (let i = 0; i < poli.length; i += 2) {
    a = Math.min(a, poli[i]); b = Math.max(b, poli[i]);
    c = Math.min(c, poli[i + 1]); d = Math.max(d, poli[i + 1]);
  }
  return [a, b, c, d];
}

let titikDarat: { dunia: THREE.Vector3[]; nusantara: THREE.Vector3[] } | null = null;
function hitungDarat() {
  if (titikDarat) return titikDarat;
  const kotakBenua = BENUA.map(kotak);
  const kotakNusa = NUSANTARA.map(kotak);
  const kena = (lon: number, lat: number, daftar: number[][], kotakDaftar: number[][]) =>
    daftar.some((p, i) => { const k = kotakDaftar[i]; return lon >= k[0] && lon <= k[1] && lat >= k[2] && lat <= k[3] && dalam(lon, lat, p); });
  const dunia: THREE.Vector3[] = [];
  const N = 9000;
  const emas = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = emas * i;
    const v = new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
    const lat = Math.asin(v.y) / RAD;
    const lon = Math.atan2(v.x, v.z) / RAD;
    if (lat < -60) continue;
    if (kena(lon, lat, NUSANTARA, kotakNusa)) continue;
    if (kena(lon, lat, BENUA, kotakBenua)) dunia.push(v);
  }
  const nusantara: THREE.Vector3[] = [];
  for (let lat = -11; lat <= 7; lat += 0.75) {
    for (let lon = 94; lon <= 141.5; lon += 0.75) {
      if (kena(lon, lat, NUSANTARA, kotakNusa)) nusantara.push(titikDunia(lon, lat));
    }
  }
  titikDarat = { dunia, nusantara };
  return titikDarat;
}

const tegak = new THREE.Vector3(0, 0, 1);
function TitikTitik({ titik, jari, ukuran, warna }: { titik: THREE.Vector3[]; jari: number; ukuran: number; warna: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    titik.forEach((v, i) => {
      o.position.copy(v).multiplyScalar(jari * 1.002);
      o.quaternion.setFromUnitVectors(tegak, v);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [titik, jari]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, titik.length]}>
      <circleGeometry args={[ukuran, 6]} />
      <meshBasicMaterial color={warna} />
    </instancedMesh>
  );
}

/** Garis lintang dan bujur tipis. */
function Kisi({ jari }: { jari: number }) {
  const geo = useMemo(() => {
    const titik: THREE.Vector3[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 4) titik.push(titikDunia(lon, lat, jari), titikDunia(lon + 4, lat, jari));
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -84; lat < 84; lat += 4) titik.push(titikDunia(lon, lat, jari), titikDunia(lon, lat + 4, jari));
    }
    return new THREE.BufferGeometry().setFromPoints(titik);
  }, [jari]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={W.emas} transparent opacity={0.1} depthWrite={false} />
    </lineSegments>
  );
}

/** Bola dunia berupa peta titik-titik; Nusantara digambar lebih rapat dan berwarna emas. */
export function BolaDunia({ jari = 2, children, terangNusantara = 1 }: { jari?: number; children?: ReactNode; terangNusantara?: number }) {
  const darat = useMemo(hitungDarat, []);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[jari, 64, 48]} />
        <meshLambertMaterial color="#0C3123" emissive="#06170f" />
      </mesh>
      <Kisi jari={jari * 1.001} />
      <TitikTitik titik={darat.dunia} jari={jari} ukuran={jari * 0.0118} warna="#B9C9B4" />
      <TitikTitik titik={darat.nusantara} jari={jari} ukuran={jari * 0.0068} warna={terangNusantara > 0.5 ? "#F3D98F" : W.emas} />
      {children}
    </group>
  );
}

/** Lingkar cahaya di belakang bola dunia. */
export function Atmosfer({ jari = 2, warna = W.hijauMuda, kuat = 0.45 }: { jari?: number; warna?: string; kuat?: number }) {
  return <Pendar ukuran={jari * 3.3} warna={warna} kuat={kuat} />;
}

/**
 * Busur cahaya di atas bola dunia dari `a` ke `b` (lon, lat). Tergambar dari
 * `rentang[0]` sampai `rentang[1]` progres, lalu denyut cahaya berjalan di atasnya.
 */
export function Busur({ a, b, jari = 2, progres, tenang, rentang, warna = W.emas, tebal = 0.012, tinggi = 0.5, denyut = true }: { a: [number, number]; b: [number, number]; jari?: number; progres: MutableRefObject<number>; tenang: boolean; rentang: [number, number]; warna?: string; tebal?: number; tinggi?: number; denyut?: boolean }) {
  const segmen = 64;
  const radial = 5;
  const { geo, kurva } = useMemo(() => {
    const p0 = titikDunia(a[0], a[1], jari);
    const p2 = titikDunia(b[0], b[1], jari);
    const sudut = p0.angleTo(p2);
    const tengah = p0.clone().add(p2).normalize().multiplyScalar(jari * (1 + tinggi * sudut * 0.55 + 0.05));
    const kurva = new THREE.QuadraticBezierCurve3(p0, tengah, p2);
    return { geo: new THREE.TubeGeometry(kurva, segmen, tebal, radial, false), kurva };
  }, [a, b, jari, tinggi, tebal]);
  const kepala = useRef<THREE.Mesh>(null);
  const pendar = useRef<THREE.Sprite>(null);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(({ clock }) => {
    const p = bacaProgres(progres, tenang);
    const f = mulus(rentang[0], rentang[1], p);
    geo.setDrawRange(0, Math.floor(f * segmen) * radial * 6);
    const k = kepala.current;
    const s = pendar.current;
    if (!k || !s) return;
    let u = f;
    let tampak = f > 0.001 && f < 0.999;
    if (f >= 0.999 && denyut && !tenang) {
      u = (clock.elapsedTime * 0.35 + a[0] * 0.013) % 1;
      tampak = true;
    }
    k.visible = s.visible = tampak;
    if (tampak) {
      kurva.getPoint(u, k.position);
      s.position.copy(k.position);
    }
  });
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color={warna} transparent opacity={0.9} />
      </mesh>
      <mesh ref={kepala}>
        <sphereGeometry args={[tebal * 2.6, 10, 8]} />
        <meshBasicMaterial color="#FFF4D2" />
      </mesh>
      <sprite ref={pendar} scale={[0.32, 0.32, 1]}>
        <spriteMaterial map={cahayaLembut()} color={warna} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

/** Titik panas yang berdenyut di permukaan bola: inti dan cincin yang mengembang. */
export function TitikPanas({ lon, lat, jari = 2, warna = W.panas, nyala, tenang, ukuran: ukuranAwal = 1 }: { lon: number; lat: number; jari?: number; warna?: string; nyala: () => number; tenang: boolean; ukuran?: number | (() => number) }) {
  const grup = useRef<THREE.Group>(null);
  const cincin = useRef<THREE.Mesh>(null);
  const inti = useRef<THREE.Mesh>(null);
  const pendar = useRef<THREE.Sprite>(null);
  const { posisi, putar } = useMemo(() => {
    const v = titikDunia(lon, lat, 1);
    return { posisi: v.clone().multiplyScalar(jari * 1.006), putar: new THREE.Quaternion().setFromUnitVectors(tegak, v) };
  }, [lon, lat, jari]);
  useFrame(({ clock }) => {
    const n = jepit(nyala());
    const ukuran = typeof ukuranAwal === "function" ? ukuranAwal() : ukuranAwal;
    const g = grup.current;
    if (!g) return;
    g.visible = n > 0.01;
    const t = tenang ? 0.4 : (clock.elapsedTime * 0.7 + lon * 0.01) % 1;
    if (cincin.current) {
      cincin.current.scale.setScalar((0.6 + t * 2.4) * ukuran);
      (cincin.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.8 * n;
    }
    if (inti.current) {
      inti.current.scale.setScalar(ukuran * (0.4 + 0.6 * n));
      (inti.current.material as THREE.MeshBasicMaterial).opacity = n;
    }
    if (pendar.current) {
      (pendar.current.material as THREE.SpriteMaterial).opacity = n * 0.9;
      pendar.current.scale.set(0.5 * ukuran, 0.5 * ukuran, 1);
    }
  });
  return (
    <group ref={grup} position={posisi} quaternion={putar}>
      <mesh ref={inti}>
        <circleGeometry args={[0.055, 16]} />
        <meshBasicMaterial color={warna} transparent />
      </mesh>
      <mesh ref={cincin} position={[0, 0, 0.002]}>
        <ringGeometry args={[0.07, 0.085, 32]} />
        <meshBasicMaterial color={warna} transparent depthWrite={false} />
      </mesh>
      <sprite ref={pendar} position={[0, 0, 0.02]}>
        <spriteMaterial map={cahayaLembut()} color={warna} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

const arahLabel = new THREE.Vector3();
const keKamera = new THREE.Vector3();

/** Label di permukaan bola; tersembunyi saat titiknya berada di balik bola. */
export function LabelBola({ lon, lat, jari = 2, tampil, children, nada = "biasa", angkat = 0.18 }: { lon: number; lat: number; jari?: number; tampil: () => boolean; children: ReactNode; nada?: Nada; angkat?: number }) {
  const grup = useRef<THREE.Group>(null);
  const isi = useRef<HTMLSpanElement>(null);
  const posisi = useMemo(() => titikDunia(lon, lat, jari + angkat), [lon, lat, jari, angkat]);
  const warna = WARNA_NADA[nada];
  useFrame(({ camera }) => {
    const g = grup.current;
    const el = isi.current;
    if (!g || !el) return;
    g.getWorldPosition(arahLabel);
    keKamera.copy(camera.position).sub(arahLabel).normalize();
    const depan = arahLabel.normalize().dot(keKamera) > 0.2;
    el.style.opacity = tampil() && depan ? "1" : "0";
  });
  return (
    <group ref={grup} position={posisi}>
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <span ref={isi} className={`block whitespace-nowrap rounded-full border bg-[#061511]/85 px-2.5 py-0.5 font-sans text-[10px] font-medium shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-opacity duration-500 md:text-[11px] ${warna}`} style={{ opacity: 0 }}>
          {children}
        </span>
      </Html>
    </group>
  );
}
