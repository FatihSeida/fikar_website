import { createContext, useContext } from "react";
import * as THREE from "three";

/**
 * Bahan dasar bangunan Bangun HMI: kotak, silinder, bola, dan papan bergambar
 * dengan garis tepi tipis supaya tampak seperti ilustrasi vektor. Geometri dan
 * bahan dipakai bersama agar adegan tetap ringan di ponsel.
 */

export type V3 = [number, number, number];

export const WARNA = {
  hijau: "#0E8A4F",
  hijauTua: "#0A5C37",
  hitam: "#1C1F1D",
  putih: "#F2F0E8",
  dinding: "#E9E5DA",
  kaca: "#3D74C4",
  kacaGelap: "#22343A",
  baja: "#4B5551",
  karat: "#8A5A3C",
  emas: "#DCC38A",
  fondasi: "#0B2A1E",
  kayu: "#9A6B3F",
  kayuTua: "#6B4A2F",
  interior: "#EFE6D2",
  perancah: "#D39B2A",
};

/**
 * Gaya satu bagian bangunan: `rencana` digambar sebagai garis biru cetak biru
 * (belum dinilai), `lapuk` 0–1 memudarkan warna menurut penilaian, `sorot`
 * memberi cahaya emas tipis saat bagian itu dipilih.
 */
export type Gaya = { rencana: boolean; lapuk: number; sorot: boolean };
export const GayaBagian = createContext<Gaya>({ rencana: false, lapuk: 0, sorot: false });

const geoKotak = new THREE.BoxGeometry(1, 1, 1);
const geoTepiKotak = new THREE.EdgesGeometry(geoKotak);
const geoSilinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 18);
const geoTepiSilinder = new THREE.EdgesGeometry(geoSilinder, 40);
const geoBola = new THREE.SphereGeometry(0.5, 16, 12);
const geoBidang = new THREE.PlaneGeometry(1, 1);
const geoKerucut = new THREE.ConeGeometry(0.5, 1, 18);

const tepiBiasa = new THREE.LineBasicMaterial({ color: "#18241E", transparent: true, opacity: 0.42 });
const tepiRencana = new THREE.LineBasicMaterial({ color: "#4F86C9", transparent: true, opacity: 0.85 });
const isiRencana = new THREE.MeshBasicMaterial({ color: "#D6E6F7", transparent: true, opacity: 0.16, depthWrite: false });

const PUDAR = new THREE.Color("#7A7468");
const EMAS = new THREE.Color(WARNA.emas);
const cacheBahan = new Map<string, THREE.Material>();

function bahan(warna: string, gaya: Gaya, opacity: number, terang: number): THREE.Material {
  if (gaya.rencana) return isiRencana;
  const kunci = `${warna}|${gaya.lapuk.toFixed(2)}|${gaya.sorot}|${opacity}|${terang}`;
  let hasil = cacheBahan.get(kunci);
  if (!hasil) {
    const warnaAkhir = new THREE.Color(warna).lerp(PUDAR, gaya.lapuk);
    const m = new THREE.MeshLambertMaterial({ color: warnaAkhir, transparent: opacity < 1, opacity, depthWrite: opacity >= 1 });
    if (terang > 0) {
      m.emissive = new THREE.Color(warna);
      m.emissiveIntensity = terang;
    } else if (gaya.sorot) {
      m.emissive = EMAS;
      m.emissiveIntensity = 0.16;
    }
    hasil = m;
    cacheBahan.set(kunci, hasil);
  }
  return hasil;
}

type PropsBentuk = { p?: V3; s?: V3; r?: V3; warna: string; opacity?: number; terang?: number; tepi?: boolean };

export function Kotak({ p = [0, 0, 0], s = [1, 1, 1], r, warna, opacity = 1, terang = 0, tepi = true }: PropsBentuk) {
  const gaya = useContext(GayaBagian);
  return (
    <group position={p} rotation={r}>
      <mesh geometry={geoKotak} material={bahan(warna, gaya, opacity, terang)} scale={s} />
      {tepi && <lineSegments geometry={geoTepiKotak} material={gaya.rencana ? tepiRencana : tepiBiasa} scale={s} />}
    </group>
  );
}

/** Silinder tegak; `s` = [diameter, tinggi, diameter]. */
export function Silinder({ p = [0, 0, 0], s = [1, 1, 1], r, warna, opacity = 1, terang = 0, tepi = true }: PropsBentuk) {
  const gaya = useContext(GayaBagian);
  return (
    <group position={p} rotation={r}>
      <mesh geometry={geoSilinder} material={bahan(warna, gaya, opacity, terang)} scale={s} />
      {tepi && <lineSegments geometry={geoTepiSilinder} material={gaya.rencana ? tepiRencana : tepiBiasa} scale={s} />}
    </group>
  );
}

export function Bola({ p = [0, 0, 0], s = [1, 1, 1], warna, opacity = 1, terang = 0 }: PropsBentuk) {
  const gaya = useContext(GayaBagian);
  return <mesh position={p} geometry={geoBola} material={bahan(warna, gaya, opacity, terang)} scale={s} />;
}

export function Kerucut({ p = [0, 0, 0], s = [1, 1, 1], r, warna, opacity = 1, terang = 0 }: PropsBentuk) {
  const gaya = useContext(GayaBagian);
  return <mesh position={p} rotation={r} geometry={geoKerucut} material={bahan(warna, gaya, opacity, terang)} scale={s} />;
}

const cachePapan = new Map<string, THREE.Material>();

/** Bidang datar bergambar (tulisan, logo, retakan). Menghadap +z kecuali diputar. */
export function Papan({ p = [0, 0, 0], s = [1, 1], r, peta, opacity = 1 }: { p?: V3; s?: [number, number]; r?: V3; peta: THREE.Texture; opacity?: number }) {
  const gaya = useContext(GayaBagian);
  const o = gaya.rencana ? opacity * 0.3 : opacity;
  const kunci = `${peta.uuid}|${o}`;
  let m = cachePapan.get(kunci);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ map: peta, transparent: true, opacity: o, alphaTest: 0.02, depthWrite: false, side: THREE.DoubleSide });
    cachePapan.set(kunci, m);
  }
  return <mesh position={p} rotation={r} geometry={geoBidang} material={m} scale={[s[0], s[1], 1]} />;
}

/** Orang sederhana: badan kapsul dan kepala bola. */
export function Figur({ p, warna = "#2C3E50", duduk = false }: { p: V3; warna?: string; duduk?: boolean }) {
  const tinggi = duduk ? 0.28 : 0.42;
  return (
    <group position={p}>
      <Silinder p={[0, tinggi / 2, 0]} s={[0.2, tinggi, 0.16]} warna={warna} tepi={false} />
      <Bola p={[0, tinggi + 0.12, 0]} s={[0.18, 0.2, 0.18]} warna="#C89F7A" />
    </group>
  );
}

// ——— Tekstur dari kanvas (tulisan, retakan, buku, kisi-kisi), disimpan supaya dibuat sekali saja.

const cacheTekstur = new Map<string, THREE.CanvasTexture>();

export function tekstur(kunci: string, lebar: number, tinggi: number, gambar: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  let t = cacheTekstur.get(kunci);
  if (!t) {
    const kanvas = document.createElement("canvas");
    kanvas.width = lebar;
    kanvas.height = tinggi;
    gambar(kanvas.getContext("2d")!, lebar, tinggi);
    t = new THREE.CanvasTexture(kanvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    cacheTekstur.set(kunci, t);
  }
  return t;
}

export const SANS = '"DM Sans", system-ui, sans-serif';
export const SERIF = '"Noto Serif", Georgia, serif';

/** Tulisan satu atau beberapa baris di tengah bidang. */
export function teksturTulisan(baris: { teks: string; ukuran: number; warna: string; tebal?: number; serif?: boolean; spasi?: number }[], o: { lebar: number; tinggi: number; latar?: string }) {
  return tekstur(`tulisan|${JSON.stringify(baris)}|${o.lebar}x${o.tinggi}|${o.latar}`, o.lebar, o.tinggi, (ctx, w, h) => {
    if (o.latar) {
      ctx.fillStyle = o.latar;
      ctx.fillRect(0, 0, w, h);
    }
    const total = baris.reduce((jumlah, b) => jumlah + b.ukuran * 1.25, 0);
    let y = (h - total) / 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const b of baris) {
      y += b.ukuran * 0.625;
      ctx.font = `${b.tebal ?? 600} ${b.ukuran}px ${b.serif ? SERIF : SANS}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${b.spasi ?? 0}px`;
      ctx.fillStyle = b.warna;
      ctx.fillText(b.teks, w / 2, y);
      y += b.ukuran * 0.625;
    }
  });
}

/** Acak berbiji supaya retakan selalu tampak sama. */
function acak(biji: number) {
  let x = biji;
  return () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  };
}

export function teksturRetak(berat: boolean) {
  return tekstur(`retak|${berat}`, 256, 256, (ctx, w, h) => {
    const r = acak(berat ? 7 : 3);
    ctx.strokeStyle = "rgba(30,26,22,0.85)";
    ctx.lineCap = "round";
    for (let i = 0; i < (berat ? 5 : 2); i++) {
      let x = w * (0.2 + r() * 0.6);
      let y = h * r() * 0.3;
      ctx.lineWidth = berat ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let j = 0; j < 7; j++) {
        x += (r() - 0.5) * 60;
        y += 20 + r() * 25;
        ctx.lineTo(x, y);
        if (berat && r() > 0.6) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + (r() - 0.5) * 50, y + 15);
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    }
  });
}

/** Deret punggung buku; `isi` 0–1 menentukan berapa banyak rak yang terisi. */
export function teksturBuku(isi: number) {
  return tekstur(`buku|${isi}`, 256, 64, (ctx, w, h) => {
    const r = acak(11);
    const warna = ["#7B2D26", "#1F4E79", "#0E8A4F", "#C49A3A", "#4A3B6B", "#2F2F2F", "#9C5B2E", "#E8E1CF"];
    let x = 4;
    while (x < w * isi - 6) {
      const lebar = 8 + r() * 10;
      const tinggi = h * (0.62 + r() * 0.34);
      ctx.fillStyle = warna[Math.floor(r() * warna.length)];
      ctx.fillRect(x, h - tinggi, lebar - 1.5, tinggi);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x + 2, h - tinggi + 6, lebar - 6, 2);
      x += lebar;
    }
  });
}

/** Kisi-kisi louver abu-abu di zona tengah fasad; `celah` membuat beberapa bilah hilang. */
export function teksturLouver(celah: boolean) {
  return tekstur(`louver|${celah}`, 128, 512, (ctx, w, h) => {
    const r = acak(5);
    ctx.fillStyle = "#3A3F3C";
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 12) {
      if (celah && r() > 0.78) continue;
      ctx.fillStyle = "#8E9590";
      ctx.fillRect(0, y, w, 7);
      ctx.fillStyle = "#B9BFBA";
      ctx.fillRect(0, y, w, 2);
    }
  });
}
