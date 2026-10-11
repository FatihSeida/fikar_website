// Koordinat dunia dan proyeksi ke layar.
// titik(r, d, y): r positif ke kanan layar, d positif ke bawah layar (mendekati penonton), y ke atas.
// Satu unit = satu sel grid kecil. Arah layar ini berlaku untuk kamera isometrik azimut 45°.
import * as THREE from "three";

export const DEG = Math.PI / 180;
export const ISO = Math.atan(1 / Math.SQRT2) / DEG; // 35.26°
export const KANAN = new THREE.Vector3(Math.SQRT1_2, 0, -Math.SQRT1_2);
export const BAWAH = new THREE.Vector3(Math.SQRT1_2, 0, Math.SQRT1_2);
export const NAIK = new THREE.Vector3(0, 1, 0);

export const titik = (r, d, y = 0) => new THREE.Vector3().addScaledVector(KANAN, r).addScaledVector(BAWAH, d).setY(y);
// Kebalikan titik(): { r, d, y } dari posisi dunia.
export const keRD = (v) => ({ r: v.dot(KANAN), d: v.dot(BAWAH), y: v.y });

// Sudut rotasi y supaya sisi +z lokal benda menghadap arah layar (r, d). Contoh: sudutLayar(0, 1) = menghadap ke bawah layar.
export const sudutLayar = (r, d) => { const v = titik(r, d); return Math.atan2(v.x, v.z); };

// Putar benda supaya bidang xy lokalnya selalu menghadap kamera (kamera kit tidak pernah berputar).
export function hadapKamera(obj, azimut = 45, elevasi = ISO) {
  obj.rotation.set(-elevasi * DEG, azimut * DEG, 0, "YXZ");
  return obj;
}

const _p = new THREE.Vector3();
// Posisi piksel { x, y } dari titik dunia. Kamera harus sudah diatur (matrixWorld terbaru).
export function keLayar(pos, kamera, ukuran, out = { x: 0, y: 0 }) {
  _p.copy(pos).project(kamera);
  out.x = (_p.x + 1) / 2 * ukuran.lebar;
  out.y = (1 - _p.y) / 2 * ukuran.tinggi;
  return out;
}

// Kotak pembatas benda di layar { x0, y0, x1, y1 } (piksel), dari kotak lokal tiap mesh yang tampak.
// Mesh dengan opacity < 0.1 dilewati, juga mesh yang dirinya atau salah satu induknya ber-userData.abaikanZona
// (bendera pada kelompok berlaku untuk seluruh isinya). Null bila tidak ada yang tampak.
const _k = new THREE.Vector3();
export function kotakLayar(obj, kamera, ukuran) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const tampak = (o) => { for (let p = o; p; p = p.parent) if (!p.visible || p.userData.abaikanZona) return false; return true; };
  obj.traverse((o) => {
    if (!(o.isMesh || o.isLine || o.isLineSegments2) || !o.geometry || !tampak(o)) return;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    if (ms.every((m) => !m || m.visible === false || (m.transparent && m.opacity < 0.1))) return;
    const g = o.geometry;
    if (!g.boundingBox) g.computeBoundingBox();
    const b = g.boundingBox;
    if (!b || b.isEmpty()) return;
    for (let i = 0; i < 8; i++) {
      _k.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).applyMatrix4(o.matrixWorld);
      _k.project(kamera);
      const x = (_k.x + 1) / 2 * ukuran.lebar, y = (1 - _k.y) / 2 * ukuran.tinggi;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  });
  return x0 === Infinity ? null : { x0, y0, x1, y1 };
}
