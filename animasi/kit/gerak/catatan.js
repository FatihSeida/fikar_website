// Pencatat gerak dan peristiwa bunyi.
// Gerak didaftarkan saat adegan dibangun, lalu dievaluasi tiap frame sebagai fungsi murni dari t.
// Setiap benda punya "saluran" keadaan; di tiap saluran, gerak yang paling akhir dimulai (mulai ≤ t) yang berlaku,
// dan sebelum gerak pertama dimulai, gerak pertama menentukan keadaan awalnya. Efek (pegas, getar, putar) dijumlahkan.
import * as THREE from "three";
import { videoAktif } from "../inti/aktif.js";
import { aturOpasitas, setelKeadaan, tampakGaris } from "../inti/bahan.js";

// Jenis peristiwa yang dikenali modul Suara (KONTRAK bagian 3).
export const JENIS = new Set([
  "grid-nyala", "melambat", "kartu-akhir", "pil",
  "muncul", "hilang", "tumbuh", "menyala", "padam", "retak", "putar",
  "klik-emas", "centang", "denting",
  "denyut",
  "langkah",
  "lempar", "mendarat",
  "kertas", "balon", "label-ganti", "cap", "kayu", "laci-buka", "pintu",
  "garis-sambung", "garis-putus",
  "aliran", "debu", "gemuruh", "whoosh",
]);
// Saluran "terakhir berlaku". Urutan ini juga urutan evaluasinya.
const SALURAN = ["posisi", "tampak", "tumbuh", "sambung", "emas"];

// Nama sumber peristiwa, unik per benda: benda kedua bernama sama menjadi "pion-2", ketiga "pion-3", dan seterusnya
// (modul Suara menggabungkan dan mengatur kaki kiri-kanan per sumber). Urutan penamaan = urutan deklarasi gerak.
const _namaUnik = new WeakMap();
const _jumlahNama = new Map();
export function namaBenda(o) {
  if (!o || typeof o !== "object") return "benda";
  if (_namaUnik.has(o)) return _namaUnik.get(o);
  const dasar = o.userData?.nama || o.name || "benda";
  const n = (_jumlahNama.get(dasar) ?? 0) + 1;
  _jumlahNama.set(dasar, n);
  const nama = n === 1 ? dasar : `${dasar}-${n}`;
  _namaUnik.set(o, nama);
  return nama;
}

// Catat peristiwa bunyi tambahan (KONTRAK bagian 3). kuat bawaan 0.7 (tingkat kalibrasi modul Suara; 0 = bisu).
//   posisi       Object3D | Vector3 | (t) => Vector3 | label3D: mengisi x dari proyeksinya pada detik t
//   posisiAkhir  sama, dibaca pada detik t + durasi: mengisi x1 (panning bergeser x → x1 selama durasi)
//   x, x1        angka 0..1 langsung, bila tidak ada posisi
//   periode      khusus "denyut" (bawaan Suara 1.2 s)
// Jenis berdurasi dengan ketukan akhir (laci-buka, pintu, garis-sambung) wajib diberi durasi.
// Contoh: catat({ t: 4.2, jenis: "pintu", durasi: 0.9, posisi: rumah, sumber: "pintu komisariat" }).
const _diperingatkan = new Set();
export function catat({ t, jenis, kuat = 0.7, durasi = 0, nada = 0, sumber, posisi = null, posisiAkhir = null, x, x1, periode }) {
  const v = videoAktif("catat");
  if (!JENIS.has(jenis) && !_diperingatkan.has(jenis)) {
    _diperingatkan.add(jenis);
    console.warn(`[kit] jenis peristiwa "${jenis}" belum dikenal modul Suara (KONTRAK bagian 3).`);
  }
  const ev = { t, jenis, kuat, durasi, nada, sumber: sumber ?? (posisi?.isObject3D ? namaBenda(posisi) : jenis), posisi, posisiAkhir, x, x1, periode };
  v.peristiwa.push(ev);
  return ev;
}

// Posisi dunia dari spesifikasi posisi peristiwa, dibaca setelah adegan dihitung pada detik t.
export function posisiDunia(p, t, out = new THREE.Vector3()) {
  if (!p) return null;
  if (p.isObject3D) return p.getWorldPosition(out);
  if (p.isVector3) return out.copy(p);
  if (typeof p.posisiDunia === "function") return p.posisiDunia(t, out);
  if (typeof p === "function") return out.copy(p(t));
  return null;
}

function keadaanBenda(v, obj) {
  let s = v.objekGerak.get(obj);
  if (!s) {
    s = {
      dasar: null, efek: [], denyut: [],
      saluran: Object.fromEntries(SALURAN.map((n) => [n, []])),
      acc: { posisi: null, _pos: new THREE.Vector3(), geser: new THREE.Vector3(), skala: new THREE.Vector3(), putar: new THREE.Vector3() },
    };
    v.objekGerak.set(obj, s);
  }
  return s;
}
// rek: { mulai, hitung(t, acc), sebelum?(acc) }. saluran: salah satu SALURAN, "efek", atau "denyut".
export function daftarkan(obj, saluran, rek) {
  const v = videoAktif("gerak");
  const s = keadaanBenda(v, obj);
  const daftar = SALURAN.includes(saluran) ? s.saluran[saluran] : s[saluran];
  let i = daftar.length;
  while (i > 0 && daftar[i - 1].mulai > rek.mulai) i--;
  daftar.splice(i, 0, rek);
  return rek;
}
// Benda yang menggerakkan dirinya sendiri (aliran, debu): rek.perbarui(t) dipanggil tiap frame.
export function daftarkanMandiri(rek) {
  videoAktif("gerak").mandiri.push(rek);
  return rek;
}
// Catat ulang posisi, skala, dan rotasi dasar benda (bila benda dipindah setelah gerak dihitung pertama kali).
export function aturDasar(obj) {
  const s = videoAktif("aturDasar").objekGerak.get(obj);
  if (s) s.dasar = null;
}

// Dipanggil buatVideo tiap frame.
export function evaluasiGerak(v, t) {
  for (const [obj, s] of v.objekGerak) {
    if (!s.dasar) s.dasar = { posisi: obj.position.clone(), skala: obj.scale.clone(), rotasi: obj.rotation.clone() };
    const acc = s.acc;
    acc.dasar = s.dasar;
    acc.posisi = null; acc.hadap = null;
    acc.geser.set(0, 0, 0); acc.skala.set(1, 1, 1); acc.putar.set(0, 0, 0);
    acc.opasitas = 1; acc.tumbuh = 1; acc.sambung = 1; acc.emas = 0; acc.nyala = 0; acc.denyut = 0;
    for (const n of SALURAN) {
      const daftar = s.saluran[n];
      if (!daftar.length) continue;
      let r = null;
      for (const x of daftar) if (x.mulai <= t) r = x;
      if (r) r.hitung(t, acc);
      else if (daftar[0].sebelum) daftar[0].sebelum(acc);
      else daftar[0].hitung(t, acc);
    }
    for (const r of s.efek) r.hitung(t, acc);
    for (const r of s.denyut) r.hitung(t, acc);

    const d = s.dasar;
    obj.position.copy(acc.posisi ?? d.posisi).add(acc.geser);
    obj.scale.copy(d.skala).multiply(acc.skala);
    obj.rotation.set(d.rotasi.x + acc.putar.x, (acc.hadap ?? d.rotasi.y) + acc.putar.y, d.rotasi.z + acc.putar.z, d.rotasi.order);
    const punya = (n) => s.saluran[n].length > 0;
    if (punya("tampak")) aturOpasitas(obj, acc.opasitas);
    if (punya("tumbuh")) obj.visible = (punya("tampak") ? obj.visible : true) && acc.tumbuh > 0.001;
    if (punya("sambung")) { const tadi = obj.visible; tampakGaris(obj, acc.sambung); obj.visible = obj.visible && (punya("tampak") ? tadi : true); }
    if (punya("emas")) { setelKeadaan(obj, "emas", acc.emas); setelKeadaan(obj, "nyala", acc.nyala); }
    if (s.denyut.length) setelKeadaan(obj, "denyut", acc.denyut);
  }
  for (const m of v.mandiri) m.perbarui(t);
}
