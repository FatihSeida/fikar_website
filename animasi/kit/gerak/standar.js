// Gerak standar (prompt indikator bagian D) dalam bentuk deklaratif.
// Panggil saat adegan dibangun, sesudah buatVideo(). Setiap gerak dievaluasi dari t dan otomatis mencatat peristiwa bunyi.
// Semua gerak menerima opsi `bunyi`: false = tanpa peristiwa; { kuat, jenis } = timpa nilai bawaan (kuat bawaan 0.7).
// Gerak menyentuh posisi, skala, rotasi, dan opasitas benda; ubah letak dasar benda sebelum tampilkan pertama, bukan sesudahnya.
import * as THREE from "three";
import { videoAktif } from "../inti/aktif.js";
import { W } from "../inti/tema.js";
import { bahanPijar, kurvaNyala, nilaiDenyut, EMAS } from "../inti/bahan.js";
import { klem, campur, rentang, halus, keluar3, masukKeluar3, pegas, acak, waktuBeku } from "../inti/waktu.js";
import { catat, daftarkan, daftarkanMandiri, namaBenda } from "./catatan.js";

const IDENTITAS = (t) => t;
IDENTITAS.laju = () => 1;
const daftarDari = (x) => (Array.isArray(x) ? x : [x]);
// kuat bawaan 0.7 = tingkat kalibrasi tiap jenis di modul Suara; 0 = bisu.
const bunyiDari = (opsi, jenis) => (opsi.bunyi === false ? null : { jenis, kuat: 0.7, ...(opsi.bunyi || {}) });
// bunyi.durasi menimpa lama peristiwa berdurasi (peristiwa sesaat tidak diberi durasi).
function bunyikan(b, ev) {
  if (!b) return;
  const durasi = b.durasi !== undefined && ev.durasi !== undefined ? { durasi: b.durasi } : {};
  catat({ ...ev, jenis: b.jenis, kuat: ev.kuat ?? b.kuat, ...durasi });
}

// Jam gerak bersambung (jalan, lintas, aliran, aliranTersendat, debu, putar): format indikator membekukan gerak yang sudah
// berjalan sebelum t 6.6 (melambat 6.0 → berhenti 6.6). opsi.beku: false = boleh terus berjalan; { lanjut, landai } = beku
// lalu berjalan lagi mulai detik `lanjut` (laju naik selama `landai` detik, bawaan 0.4). opsi.jam: jam sendiri.
function jamUntuk(mulai, opsi) {
  if (opsi.jam) {
    const j = opsi.jam;
    if (!j.laju) j.laju = (t) => klem((j(t + 0.005) - j(t - 0.005)) / 0.01, 0, 1);
    return j;
  }
  const v = videoAktif("gerak");
  if (opsi.beku === false || !v.beku || mulai >= v.beku[1]) return IDENTITAS;
  return waktuBeku(v.beku[0], v.beku[1], opsi.beku && typeof opsi.beku === "object" ? opsi.beku : undefined);
}
// Rentang detik nyata di dalam [a, b] ketika jam berjalan: jam beku berhenti di τ.henti dan mungkin lanjut di τ.lanjut.
function rentangJalan(jam, a, b) {
  const r = [[a, jam.henti == null ? b : Math.min(b, jam.henti)]];
  if (jam.lanjut != null) r.push([Math.max(a, jam.lanjut), b]);
  return r.filter(([x, y]) => y - x > 1e-6);
}
// Urutan dalam jendela (opsi `selesai` gerak yang menerima array): jeda dihitung ulang supaya benda terakhir selesai tepat
// di `selesai`. Jendela yang lebih pendek daripada durasi memendekkan durasi, dan semua benda bergerak serentak.
function aturUrutan(n, t, durasi, jeda, selesai) {
  if (selesai === undefined || selesai === null) return { durasi, jeda };
  const ruang = selesai - t;
  if (ruang <= durasi) return { durasi: Math.max(0, ruang), jeda: 0 };
  return { durasi, jeda: n > 1 ? (ruang - durasi) / (n - 1) : jeda };
}
// Detik nyata saat jam mencapai tau (jam tidak pernah mundur). null bila tidak pernah tercapai.
function waktuNyata(jam, tau, durasi) {
  if (jam === IDENTITAS) return tau;
  if (jam(durasi) < tau - 1e-9) return null;
  let a = 0, b = durasi;
  for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (jam(m) >= tau) b = m; else a = m; }
  return b;
}

// ---------------------------------------------------------------- muncul / hilang
// muncul: naik dari y −0.6 ke 0, skala 0.85 → 1, opacity 0 → 1, 0.5 s, keluar3. Array: jeda 0.12 s antar benda,
// atau `selesai`: benda terakhir selesai tepat di detik itu. `naik` bergerak di sumbu y lokal induk benda.
// Sebelum t benda tidak terlihat. Bunyi "muncul" (nada = urutan).
export function muncul(benda, { t, durasi = 0.5, jeda = 0.12, selesai, naik = 0.6, skala = 0.85, kurva = keluar3, ...opsi } = {}) {
  const b = bunyiDari(opsi, "muncul");
  const daftar = daftarDari(benda);
  ({ durasi, jeda } = aturUrutan(daftar.length, t, durasi, jeda, selesai));
  return daftar.map((obj, i) => {
    const mulai = t + i * jeda;
    daftarkan(obj, "tampak", {
      mulai,
      sebelum: (acc) => { acc.opasitas = 0; },
      hitung(tt, acc) {
        const k = kurva(rentang(tt, mulai, mulai + durasi));
        acc.opasitas = k;
        acc.geser.y -= naik * (1 - k);
        acc.skala.multiplyScalar(campur(skala, 1, k));
      },
    });
    bunyikan(b, { t: mulai, posisi: obj, nada: i, sumber: namaBenda(obj) });
    return { mulai, selesai: mulai + durasi };
  });
}
// hilang: turun 0.3 unit dan opacity 1 → 0, 0.4 s. Array: jeda (bawaan 0) atau selesai. Bunyi "hilang".
export function hilang(benda, { t, durasi = 0.4, jeda = 0, selesai, turun = 0.3, kurva = halus, ...opsi } = {}) {
  const b = bunyiDari(opsi, "hilang");
  const daftar = daftarDari(benda);
  ({ durasi, jeda } = aturUrutan(daftar.length, t, durasi, jeda, selesai));
  return daftar.map((obj, i) => {
    const mulai = t + i * jeda;
    daftarkan(obj, "tampak", {
      mulai,
      sebelum: (acc) => { acc.opasitas = 1; },
      hitung(tt, acc) {
        const k = kurva(rentang(tt, mulai, mulai + durasi));
        acc.opasitas = 1 - k;
        acc.geser.y -= turun * k;
      },
    });
    bunyikan(b, { t: mulai, posisi: obj, nada: i, sumber: namaBenda(obj) });
    return { mulai, selesai: mulai + durasi };
  });
}

// ---------------------------------------------------------------- klikEmas
// Benda hasil berubah emas: warna ke W.emas (keluar3, 0.8 s), emissive emasPijar 0 → 1.4 sesaat → 0.9,
// skala 1.25 → 1 dengan pegas (≈0.35 s). Bagian yang berubah: userData.bagian.emas (bawaan semua mesh).
// lonjak bawaan userData.lonjakEmas benda (pion: 0, hanya cincin kakinya yang emas), selain itu 0.25.
// Aturan B.6 (emas hanya untuk hasil) adalah pilihan pemanggil. Bunyi "klik-emas".
export function klikEmas(benda, { t, durasi = EMAS.naik, jeda = 0, selesai, lonjak, ...opsi } = {}) {
  const b = bunyiDari(opsi, "klik-emas");
  const daftar = daftarDari(benda);
  ({ durasi, jeda } = aturUrutan(daftar.length, t, durasi, jeda, selesai));
  return daftar.map((obj, i) => {
    const mulai = t + i * jeda;
    const lj = lonjak ?? obj.userData?.lonjakEmas ?? 0.25;
    daftarkan(obj, "emas", {
      mulai,
      sebelum: (acc) => { acc.emas = 0; acc.nyala = 0; },
      hitung(tt, acc) {
        acc.emas = keluar3(rentang(tt, mulai, mulai + durasi));
        acc.nyala = kurvaNyala(tt - mulai, durasi);
      },
    });
    daftarkan(obj, "efek", {
      mulai,
      hitung(tt, acc) { const dt = tt - mulai; if (dt >= 0 && dt < 0.7) acc.skala.multiplyScalar(1 + lj * pegas(dt)); },
    });
    bunyikan(b, { t: mulai, posisi: obj, nada: i, sumber: namaBenda(obj) });
    return { mulai, selesai: mulai + durasi };
  });
}

// ---------------------------------------------------------------- denyutCermin
// Tepi zamrudPijar berdenyut 0 → 0.5 → 0 dengan periode 1.2 s, dari mulai sampai selesai.
// Tepi: userData.bagian.tepi (bawaan dibuat dari kotak tiap mesh); permukaan: userData.bagian.denyut (bawaan semua mesh).
// Bunyi "denyut" berdurasi.
export function denyutCermin(benda, { mulai, selesai, periode = 1.2, ...opsi } = {}) {
  const b = bunyiDari(opsi, "denyut");
  daftarDari(benda).forEach((obj) => {
    daftarkan(obj, "denyut", {
      mulai,
      hitung(tt, acc) { acc.denyut = Math.max(acc.denyut, nilaiDenyut(tt, mulai, selesai, periode)); },
    });
  });
  const pertama = daftarDari(benda)[0];
  // Gambar denyut paling redup di `mulai` dan memuncak di mulai + periode/2, sama dengan bunyi "denyut" modul Suara.
  bunyikan(b, { t: mulai, durasi: selesai - mulai, periode, posisi: pertama, sumber: namaBenda(pertama) });
  return { mulai, selesai };
}

// ---------------------------------------------------------------- jalur
// Bentuk jalur bersama jalan, lintas, dan panjangJalur: array Vector3 (ruas lurus; lengkung: true = kurva halus
// melalui titik-titiknya) atau THREE.Curve apa pun. Mengembalikan { L, pada(s, out), arah(s, out) } menurut jarak s.
// Titik array disalin, jadi jalur tidak ikut berubah bila Vector3 aslinya (mis. benda.position) bergerak.
function bentukJalur(jalur, lengkung) {
  if (!(jalur instanceof THREE.Curve)) jalur = jalur.map((p) => p.clone());
  const kurvaJalur = jalur instanceof THREE.Curve ? jalur : lengkung ? new THREE.CatmullRomCurve3(jalur, false, "centripetal") : null;
  let L, pada, arah;
  if (kurvaJalur) {
    L = kurvaJalur.getLength();
    pada = (s, out) => kurvaJalur.getPointAt(klem(s / L), out);
    arah = (s, out) => kurvaJalur.getTangentAt(klem(s / L), out);
  } else {
    const kum = [0];
    for (let i = 1; i < jalur.length; i++) kum.push(kum[i - 1] + jalur[i].distanceTo(jalur[i - 1]));
    L = kum[kum.length - 1];
    const ruas = (s) => { let i = 1; while (i < jalur.length - 1 && kum[i] < s) i++; return i; };
    pada = (s, out) => { const i = ruas(s); const u = klem((s - kum[i - 1]) / Math.max(1e-9, kum[i] - kum[i - 1])); return out.copy(jalur[i - 1]).lerp(jalur[i], u); };
    arah = (s, out) => { const i = ruas(s); return out.subVectors(jalur[i], jalur[i - 1]).normalize(); };
  }
  return { L, pada, arah };
}

// Panjang jalur dalam unit, diukur persis seperti jalan dan lintas mengukurnya. aliran dan aliranTersendat selalu
// melengkungkan array titik, jadi untuk keduanya pakai lengkung: true.
export function panjangJalur(jalur, { lengkung = false } = {}) {
  return bentukJalur(jalur, lengkung).L;
}

// ---------------------------------------------------------------- jalan
// Figur berjalan di sepanjang jalur (array Vector3, atau THREE.Curve) dengan kecepatan 1.2 unit/s,
// badan naik turun 0.04 unit pada 4 Hz. Sebelum t figur menunggu di titik awal; setelah sampai, diam di titik akhir.
// durasi: tiba tepat `durasi` detik sesudah t (menimpa laju = panjang / durasi); frek lalu mengikuti laju,
// 4 × √(laju / 1.2) dijepit 3–6 Hz, kecuali frek diisi sendiri. Tanpa durasi, frek bawaan 4.
// lengkung: true = kurva halus melalui titik-titik. hadap: true = sisi +z figur menghadap arah jalan.
// Bunyi "langkah" tiap kali kaki menapak (nada 0/1 bergantian).
// Mengembalikan { mulai, selesai (detik tiba, null bila berhenti di jalan karena beku), panjang, pada(t) }.
export function jalan(obj, { t, jalur, laju = 1.2, durasi = null, ayun = 0.04, frek = null, lengkung = false, hadap = false, ...opsi } = {}) {
  const v = videoAktif("jalan");
  const { L, pada, arah } = bentukJalur(jalur, lengkung);
  if (durasi > 0 && L > 1e-9) laju = L / durasi;
  if (frek === null || frek === undefined) frek = durasi > 0 ? klem(4 * Math.sqrt(laju / 1.2), 3, 6) : 4;
  const jam = jamUntuk(t, opsi);
  const _a = new THREE.Vector3();
  const isi = (tt, acc) => {
    const dt = Math.max(0, jam(tt) - t);
    const s = Math.min(L, laju * dt);
    acc.posisi = pada(s, acc._pos);
    acc.geser.y += ayun * Math.abs(Math.sin(Math.PI * frek * dt)) * jam.laju(tt) * halus((L - s) / 0.12);
    if (hadap) { arah(Math.min(s, L - 1e-4), _a); acc.hadap = Math.atan2(_a.x, _a.z); }
  };
  daftarkan(obj, "posisi", { mulai: t, sebelum: (acc) => isi(t, acc), hitung: isi });
  const b = bunyiDari(opsi, "langkah");
  if (b) {
    const n = Math.floor((L / laju) * frek - 1e-6);
    for (let k = 1; k <= n; k++) {
      const tk = waktuNyata(jam, t + k / frek, v.durasi);
      if (tk === null || tk > v.durasi) break;
      bunyikan(b, { t: tk, posisi: obj, nada: k % 2, sumber: namaBenda(obj) });
    }
  }
  const tiba = waktuNyata(jam, t + L / laju, v.durasi);
  // pada(t): posisi figur (tanpa ayunan) pada detik t, misalnya untuk menyambung jalan berikutnya dari titik berhenti.
  const posisiPada = (tt) => pada(Math.min(L, laju * Math.max(0, jam(tt) - t)), new THREE.Vector3());
  return { mulai: t, selesai: tiba, panjang: L, pada: posisiPada };
}

// ---------------------------------------------------------------- lintas
// Benda apa pun (amplop, berkas, bola, ikon) meluncur di sepanjang jalur dalam `durasi` detik (atau dengan `laju` unit/s,
// bawaan 2), dengan percepatan `kurva` (bawaan masukKeluar3); tanpa ayunan badan dan tanpa langkah. Jalur seperti jalan.
// Sebelum t benda diam di titik awal; sesudahnya diam di titik akhir. hadap: true = sisi +z benda menghadap arah gerak.
// Ikut beku format seperti jalan (beku: false, beku: { lanjut }, jam). Bunyi "whoosh" berdurasi, x titik awal → x1 titik akhir.
// Mengembalikan { mulai, selesai (null bila beku sebelum tiba), panjang, pada(t) }.
export function lintas(obj, { t, jalur, durasi = null, laju = 2, lengkung = false, hadap = false, kurva = masukKeluar3, ...opsi } = {}) {
  const v = videoAktif("lintas");
  const { L, pada, arah } = bentukJalur(jalur, lengkung);
  const lama = durasi > 0 ? durasi : L / laju;
  const jam = jamUntuk(t, opsi);
  const _a = new THREE.Vector3();
  const jarak = (tt) => L * kurva(rentang(jam(tt), t, t + lama));
  const isi = (tt, acc) => {
    const s = jarak(tt);
    acc.posisi = pada(s, acc._pos);
    if (hadap) { arah(Math.min(s, L - 1e-4), _a); acc.hadap = Math.atan2(_a.x, _a.z); }
  };
  daftarkan(obj, "posisi", { mulai: t, sebelum: (acc) => isi(t, acc), hitung: isi });
  const tiba = waktuNyata(jam, t + lama, v.durasi);
  // Bunyi selama benda bergerak: sampai tiba, atau sampai jam berhenti bila beku sebelum tiba (lagi sesudah lanjut).
  const b = bunyiDari(opsi, "whoosh");
  for (const [a, z] of rentangJalan(jam, t, Math.min(tiba ?? v.durasi, v.durasi))) {
    bunyikan(b, { t: a, durasi: z - a, posisi: obj, posisiAkhir: obj, sumber: namaBenda(obj) });
  }
  return { mulai: t, selesai: tiba, panjang: L, pada: (tt) => pada(jarak(tt), new THREE.Vector3()) };
}

// ---------------------------------------------------------------- gantiBenda
// Benda a berganti menjadi benda b di tempat yang sama: a memudar sambil mengecil ke `skala` selama 60% awal durasi,
// b muncul dari `skala` ke 1 selama 60% akhir (mis. lembar terlipat menjadi amplop). tempat: true (bawaan) memindah b ke
// posisi a saat dipanggil (sebelum frame pertama); false = b tetap di posisinya sendiri. Bunyi "kertas" di t.
export function gantiBenda(a, b, { t, durasi = 0.4, skala = 0.6, tempat = true, kurva = masukKeluar3, ...opsi } = {}) {
  if (tempat) {
    a.updateWorldMatrix(true, false);
    const p = a.getWorldPosition(new THREE.Vector3());
    if (b.parent) { b.parent.updateWorldMatrix(true, false); b.parent.worldToLocal(p); }
    b.position.copy(p);
  }
  const tb = t + 0.4 * durasi;
  daftarkan(a, "tampak", {
    mulai: t,
    sebelum: (acc) => { acc.opasitas = 1; },
    hitung(tt, acc) {
      const k = kurva(rentang(tt, t, t + 0.6 * durasi));
      acc.opasitas = 1 - k;
      acc.skala.multiplyScalar(campur(1, skala, k));
    },
  });
  daftarkan(b, "tampak", {
    mulai: tb,
    sebelum: (acc) => { acc.opasitas = 0; },
    hitung(tt, acc) {
      const k = kurva(rentang(tt, tb, t + durasi));
      acc.opasitas = k;
      acc.skala.multiplyScalar(campur(skala, 1, k));
    },
  });
  bunyikan(bunyiDari(opsi, "kertas"), { t, posisi: a, sumber: namaBenda(a) });
  return { mulai: t, selesai: t + durasi };
}

// ---------------------------------------------------------------- busur (lempar)
// Benda melayang di lintasan parabola dari `dari` ke `ke` (bawaan: dari posisi dasar benda). Bunyi "lempar" dan "mendarat".
export function busur(obj, { t, ke, dari = null, tinggi = 1.0, durasi = 0.8, putar = 0, ...opsi } = {}) {
  const _d = new THREE.Vector3();
  const awal = (acc) => (dari ? _d.copy(dari) : _d.copy(acc.dasar.posisi));
  daftarkan(obj, "posisi", {
    mulai: t,
    sebelum: (acc) => { acc.posisi = acc._pos.copy(awal(acc)); },
    hitung(tt, acc) {
      const u = rentang(tt, t, t + durasi);
      acc.posisi = acc._pos.copy(awal(acc)).lerp(ke, u);
      acc.posisi.y += 4 * tinggi * u * (1 - u);
      acc.putar.y += putar * masukKeluar3(u);
    },
  });
  // Posisi peristiwa: benda itu sendiri, yang pada detik lempar ada di titik awal dan pada detik mendarat di titik akhir.
  // lempar berdurasi selama terbang, panning dari titik lempar (x) ke titik mendarat (x1).
  bunyikan(bunyiDari(opsi, "lempar"), { t, durasi, posisi: obj, posisiAkhir: obj, sumber: namaBenda(obj) });
  if (opsi.bunyi !== false) catat({ t: t + durasi, jenis: "mendarat", kuat: opsi.bunyi?.kuat ?? 0.7, posisi: obj, sumber: namaBenda(obj) });
  return { mulai: t, selesai: t + durasi };
}

// ---------------------------------------------------------------- aliran
// Bola cahaya radius 0.07 mengalir di sepanjang jalur (2 unit/s, jarak antarbola 0.6 unit) dari mulai sampai selesai;
// bola yang sudah berangkat tetap sampai ujung. emas: true untuk Bagian 3 (berpendar). naik: bola diangkat sekian unit
// di atas jalur (untuk jalur di sumbu pipa atau tabung, supaya bola tidak tenggelam). Mengembalikan THREE.Group (sudah di scene).
// Bunyi "aliran" berdurasi selama bola bergerak: berhenti saat beku (lagi sesudah beku.lanjut) dan paling lambat di
// v.akhirAdegan (indikator: kartu akhir 18.2). bunyi: { durasi } = lama bunyi sendiri.
export function aliran({ jalur, mulai, selesai, laju = 2, jarak = 0.6, radius = 0.07, naik = 0, emas = false, warna, kuat, induk, ...opsi } = {}) {
  const v = videoAktif("aliran");
  const kurvaJalur = jalur instanceof THREE.Curve ? jalur : new THREE.CatmullRomCurve3(jalur, false, "centripetal");
  const L = kurvaJalur.getLength();
  const grup = new THREE.Group();
  grup.name = "aliran";
  grup.userData.nama = "aliran";
  const geo = new THREE.SphereGeometry(radius, 16, 12);
  const n = Math.ceil(L / jarak) + 2;
  const bola = Array.from({ length: n }, () => {
    const m = new THREE.Mesh(geo, bahanPijar(warna ?? (emas ? W.emasPijar : W.zamrudPijar), kuat ?? (emas ? 2.2 : 1)));
    m.visible = false;
    grup.add(m);
    return m;
  });
  (induk ?? v.scene).add(grup);
  const jam = jamUntuk(mulai, opsi);
  const jMaks = Math.floor(((selesai - mulai) * laju) / jarak);
  daftarkanMandiri({
    perbarui(t) {
      const tau = jam(t);
      bola.forEach((m) => { m.visible = false; });
      if (tau < mulai) return;
      const jA = Math.max(0, Math.ceil(((tau - mulai) * laju - L) / jarak));
      const jB = Math.min(jMaks, Math.floor(((tau - mulai) * laju) / jarak));
      let k = 0;
      for (let j = jA; j <= jB && k < n; j++, k++) {
        const s = (tau - mulai) * laju - j * jarak;
        const m = bola[k];
        kurvaJalur.getPointAt(klem(s / L), m.position);
        if (naik) m.position.y += naik;
        m.material.opacity = halus(s / 0.25) * halus((L - s) / 0.25);
        m.visible = m.material.opacity > 0.002;
      }
    },
  });
  // Berdurasi sampai bola terakhir tiba di ujung, hanya selama jam berjalan, dan tidak melewati akhir adegan;
  // panning dari awal jalur (x) ke ujung jalur (x1).
  const b = bunyiDari(opsi, "aliran");
  if (b) {
    let akhir = Math.min(v.durasi, waktuNyata(jam, selesai + L / laju, v.durasi) ?? v.durasi);
    if (mulai < v.akhirAdegan) akhir = Math.min(akhir, v.akhirAdegan);
    const bagian = b.durasi !== undefined ? [[mulai, mulai + b.durasi]] : rentangJalan(jam, mulai, akhir);
    for (const [a, z] of bagian) {
      catat({ t: a, jenis: b.jenis, kuat: b.kuat, durasi: z - a, posisi: kurvaJalur.getPointAt(0), posisiAkhir: kurvaJalur.getPointAt(1), sumber: "aliran" });
    }
  }
  return grup;
}

// ---------------------------------------------------------------- aliranTersendat
// Aliran yang tersendat: `jumlah` bola cahaya berangkat dari awal jalur tiap `selang` detik (2 unit/s) dan berhenti di
// `tahan` (jarak dari awal jalur dalam unit, atau Vector3: titik terdekat di jalur). Bola berikutnya antre di belakangnya
// dan menumpuk segitiga (3-2-1), lalu meredup menjadi abu selama `redup` detik (false = tetap berwarna). Mulai `lepas`
// (detik nyata; null = tertahan sampai akhir) tumpukan berjalan lagi sampai ujung jalur, bola terdepan dulu, dan berubah
// emas (lepasEmas: false = kembali ke warna semula). Jalur, warna, emas, naik, induk, beku, dan jam seperti aliran.
// Bunyi: "aliran" sampai bola terakhir berhenti, "kayu" tiap bola menumbuk tumpukan, "aliran" lagi saat lepas.
// Mengembalikan { grup, mulai, tiba: [detik nyata tiap bola berhenti, null bila beku], lepas, selesai (bola terakhir di
// ujung sesudah lepas), panjang, tahan (jarak berhenti bola terdepan) }.
export function aliranTersendat({ jalur, tahan, mulai, jumlah = 6, selang = 0.3, laju = 2, radius = 0.07, naik = 0, redup = 0.9,
  lepas = null, lepasEmas = true, emas = false, warna, kuat, benih = 1, induk, ...opsi } = {}) {
  const v = videoAktif("aliranTersendat");
  const kurvaJalur = jalur instanceof THREE.Curve ? jalur : new THREE.CatmullRomCurve3(jalur, false, "centripetal");
  const L = kurvaJalur.getLength();
  const sTahan = typeof tahan === "number" ? klem(tahan, 0, L) : jarakTerdekat(kurvaJalur, tahan) * L;
  const D = radius * 2;
  const r = acak(benih);
  const grup = new THREE.Group();
  grup.name = "aliran tersendat";
  grup.userData.nama = "aliran tersendat";
  const geo = new THREE.SphereGeometry(radius, 16, 12);
  const bola = polaTumpuk(jumlah).map(([mundur, atas], i) => {
    const m = new THREE.Mesh(geo, bahanPijar(warna ?? (emas ? W.emasPijar : W.zamrudPijar), kuat ?? (emas ? 2.2 : 1)));
    const berangkat = mulai + i * selang;
    const sBerhenti = Math.max(0, sTahan - mundur * D);
    // Sedikit acak menyamping supaya tumpukannya tidak rapi seperti manik-manik.
    m.userData = { berangkat, sBerhenti, atas: atas * D, samping: (r() - 0.5) * 0.04, tibaJam: berangkat + sBerhenti / laju };
    m.visible = false;
    grup.add(m);
    return m;
  });
  (induk ?? v.scene).add(grup);
  const warnaAwal = bola[0]?.material.color.clone() ?? new THREE.Color();
  const abu = W.abu.clone();
  const warnaLepas = lepasEmas ? W.emasPijar.clone().multiplyScalar(2.2) : warnaAwal;
  const jam = jamUntuk(mulai, opsi);
  const _arah = new THREE.Vector3(), _sisi = new THREE.Vector3();
  daftarkanMandiri({
    perbarui(t) {
      const tau = jam(t);
      for (const [i, m] of bola.entries()) {
        const u = m.userData;
        if (tau < u.berangkat) { m.visible = false; continue; }
        const sJalan = (tau - u.berangkat) * laju;
        let s = Math.min(u.sBerhenti, sJalan);
        // Bola baris atas memanjat tumpukan pada 0.12 unit terakhir lintasannya.
        let atas = u.atas * halus(1 - (u.sBerhenti - sJalan) / 0.12);
        // Benturan kecil saat berhenti: mundur sedikit lalu diam.
        const dt = tau - u.tibaJam;
        if (dt > 0) s -= 0.03 * Math.sin(Math.min(1, dt / 0.18) * Math.PI) * (1 - halus(dt / 0.18));
        // Lepas (detik nyata): berurutan dari bola terdepan, laju naik 0 → laju dalam 0.3 s; tumpukan turun ke jalur.
        let kLepas = 0, kWarna = 0;
        if (lepas !== null) {
          const dl = t - (lepas + i * 0.1);
          if (dl > 0) s += laju * (dl < 0.3 ? (dl * dl) / 0.6 : dl - 0.15);
          kLepas = halus(rentang(t, lepas, lepas + 0.3));
          kWarna = halus(rentang(t, lepas + i * 0.1, lepas + i * 0.1 + 0.35));
        }
        atas *= 1 - kLepas;
        const k = klem(s / L);
        kurvaJalur.getPointAt(k, m.position);
        kurvaJalur.getTangentAt(k, _arah);
        _sisi.set(-_arah.z, 0, _arah.x);
        if (_sisi.lengthSq() > 1e-12) m.position.addScaledVector(_sisi.normalize(), u.samping * (1 - kLepas));
        m.position.y += naik + atas;
        // Warna: semula → abu sesudah berhenti → emas (atau semula) saat lepas.
        const kAbu = redup > 0 ? halus(rentang(tau, u.tibaJam + 0.1, u.tibaJam + 0.1 + redup)) : 0;
        m.material.color.copy(warnaAwal).lerp(abu, kAbu).lerp(warnaLepas, kWarna);
        m.material.opacity = halus(s / 0.25) * halus((L - s) / 0.25) * (1 - 0.25 * kAbu * (1 - kWarna));
        m.visible = m.material.opacity > 0.002;
      }
    },
  });

  const tiba = bola.map((m) => waktuNyata(jam, m.userData.tibaJam, v.durasi));
  let selesai = null;
  if (lepas !== null) {
    const tauLepas = jam(lepas);
    selesai = Math.max(...bola.map((m, i) => {
      const u = m.userData;
      const s0 = tauLepas < u.berangkat ? 0 : Math.min(u.sBerhenti, (tauLepas - u.berangkat) * laju);
      return lepas + i * 0.1 + 0.15 + (L - s0) / laju;
    }));
  }
  const b = bunyiDari(opsi, "aliran");
  if (b) {
    const sumber = namaBenda(grup);
    const pAwal = kurvaJalur.getPointAt(0), pTahan = kurvaJalur.getPointAt(sTahan / L), pAkhir = kurvaJalur.getPointAt(1);
    const batas = (a, z) => Math.min(z, v.durasi, a < v.akhirAdegan ? v.akhirAdegan : Infinity);
    // Mengalir sampai bola terakhir berhenti (atau sampai jam beku berhenti), paling lambat saat lepas.
    let akhir = batas(mulai, tiba.every((x) => x !== null) ? Math.max(...tiba) : v.durasi);
    if (lepas !== null) akhir = Math.min(akhir, lepas);
    const bagian = b.durasi !== undefined ? [[mulai, mulai + b.durasi]] : rentangJalan(jam, mulai, akhir);
    for (const [a, z] of bagian) catat({ t: a, jenis: b.jenis, kuat: b.kuat, durasi: z - a, posisi: pAwal, posisiAkhir: pTahan, sumber });
    tiba.forEach((tk, i) => {
      if (tk === null || tk >= v.durasi || (lepas !== null && tk >= lepas)) return;
      catat({ t: tk, jenis: "kayu", kuat: i === 0 ? 0.45 : 0.3, nada: i, posisi: pTahan, sumber });
    });
    if (lepas !== null && lepas < v.durasi) {
      const z = batas(lepas, selesai);
      if (z > lepas) catat({ t: lepas, jenis: b.jenis, kuat: b.kuat, durasi: z - lepas, posisi: pTahan, posisiAkhir: pAkhir, sumber });
    }
  }
  return { grup, mulai, tiba, lepas, selesai, panjang: L, tahan: sTahan };
}
// Pola tumpukan segitiga [mundur, naik] dalam satuan diameter bola: kolom baru di belakang, lalu diagonal di atasnya
// (0,0) (1,0) (0.5,0.85) (2,0) (1.5,0.85) (1,1.7) ...
function polaTumpuk(n) {
  const p = [];
  for (let c = 0; p.length < n; c++) for (let h = 0; h <= c && p.length < n; h++) p.push([c - h * 0.5, h * 0.85]);
  return p;
}
// Parameter u (0..1, menurut panjang) titik jalur yang terdekat ke p.
function jarakTerdekat(kurva, p) {
  const q = new THREE.Vector3();
  let terbaik = 0, dMin = Infinity;
  for (let i = 0; i <= 1000; i++) {
    const d = kurva.getPointAt(i / 1000, q).distanceToSquared(p);
    if (d < dMin) { dMin = d; terbaik = i / 1000; }
  }
  return terbaik;
}

// ---------------------------------------------------------------- debu
// Butir debu radius 0.03 warna abu opacity 0.4, melayang naik 0.8 unit lalu hilang. Posisi dari acak(benih).
// Mengembalikan THREE.Group (sudah di scene). Bunyi "debu".
export function debu({ pusat, mulai, selesai = null, jumlah = 14, sebar = 0.6, naik = 0.8, umur = 1.4, benih = 1, induk, ...opsi } = {}) {
  const v = videoAktif("debu");
  const r = acak(benih);
  const akhirLahir = selesai ?? mulai + 0.5;
  const grup = new THREE.Group();
  grup.name = "debu";
  const geo = new THREE.SphereGeometry(0.03, 8, 6);
  const butir = Array.from({ length: jumlah }, () => {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * sebar;
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: W.abu.clone(), roughness: 0.8, metalness: 0, transparent: true, opacity: 0, depthWrite: false }));
    m.userData.awal = new THREE.Vector3(pusat.x + Math.cos(a) * d, pusat.y + r() * 0.2, pusat.z + Math.sin(a) * d);
    m.userData.lahir = campur(mulai, akhirLahir, r());
    m.userData.goyang = r() * Math.PI * 2;
    m.visible = false;
    grup.add(m);
    return m;
  });
  (induk ?? v.scene).add(grup);
  const jam = jamUntuk(mulai, opsi);
  daftarkanMandiri({
    perbarui(t) {
      const tau = jam(t);
      for (const m of butir) {
        const u = (tau - m.userData.lahir) / umur;
        if (u <= 0 || u >= 1) { m.visible = false; continue; }
        m.visible = true;
        m.position.copy(m.userData.awal);
        m.position.y += naik * keluar3(u);
        m.position.x += 0.06 * Math.sin(m.userData.goyang + u * 5);
        m.material.opacity = 0.4 * halus(u / 0.15) * (1 - halus((u - 0.6) / 0.4));
      }
    },
  });
  bunyikan(bunyiDari(opsi, "debu"), { t: mulai, posisi: pusat.clone(), sumber: "debu" });
  return grup;
}

// ---------------------------------------------------------------- tumbuh
// Skala di satu sumbu naik 0 → 1 (keluar3). Titik asal geometri harus di pangkal (mis. batang yang tumbuh ke kanan).
// Array: berurutan, jeda bawaan = durasi, atau selesai. Sebelum t benda tidak terlihat. Bunyi "tumbuh" (nada naik).
export function tumbuh(benda, { t, durasi = 0.3, jeda = durasi, selesai, sumbu = "y", kurva = keluar3, ...opsi } = {}) {
  const b = bunyiDari(opsi, "tumbuh");
  const daftar = daftarDari(benda);
  ({ durasi, jeda } = aturUrutan(daftar.length, t, durasi, jeda, selesai));
  return daftar.map((obj, i) => {
    const mulai = t + i * jeda;
    const isi = (k, acc) => { acc.tumbuh = k; acc.skala[sumbu] *= Math.max(1e-4, k); };
    daftarkan(obj, "tumbuh", {
      mulai,
      sebelum: (acc) => isi(0, acc),
      hitung: (tt, acc) => isi(kurva(rentang(tt, mulai, mulai + durasi)), acc),
    });
    bunyikan(b, { t: mulai, durasi, posisi: obj, nada: i, sumber: namaBenda(obj) });
    return { mulai, selesai: mulai + durasi };
  });
}

// ---------------------------------------------------------------- sambungGaris
// Garis dari garisJalur() tampak bertahap dari ujung awal ke ujung akhir. Bunyi "garis-sambung" berdurasi:
// luncuran selama garis ditarik, ping saat tersambung di t + durasi; panning dari ujung awal (x) ke ujung akhir (x1).
export function sambungGaris(garis, { t, durasi = 0.6, kurva = masukKeluar3, ...opsi } = {}) {
  daftarkan(garis, "sambung", {
    mulai: t,
    sebelum: (acc) => { acc.sambung = 0; },
    hitung: (tt, acc) => { acc.sambung = kurva(rentang(tt, t, t + durasi)); },
  });
  const ujung = (k) => () => {
    const lokal = garis.userData.ujung?.[k];
    if (lokal) return garis.localToWorld(lokal.clone());
    garis.geometry.computeBoundingBox();
    return garis.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(garis.matrixWorld);
  };
  bunyikan(bunyiDari(opsi, "garis-sambung"), { t, durasi, posisi: ujung(0), posisiAkhir: ujung(1), sumber: namaBenda(garis) });
  return { mulai: t, selesai: t + durasi };
}

// ---------------------------------------------------------------- gantiLabel
// Teks label3D berganti pada detik t, dengan celup pudar singkat. Bunyi "label-ganti".
export function gantiLabel(label, { t, teks, durasi = 0.3, ...opsi } = {}) {
  const g = { t, teks, durasi };
  let i = label.ganti.length;
  while (i > 0 && label.ganti[i - 1].t > t) i--;
  label.ganti.splice(i, 0, g);
  bunyikan(bunyiDari(opsi, "label-ganti"), { t, posisi: label, sumber: String(teks) });
  return g;
}

// ---------------------------------------------------------------- putar
// Benda berputar `sudut` radian (bawaan satu putaran) pada sumbu lokal, lalu tetap di sudut akhir. Bunyi "putar".
export function putar(obj, { t, durasi = 0.8, sudut = Math.PI * 2, sumbu = "y", kurva = masukKeluar3, ...opsi } = {}) {
  const jam = jamUntuk(t, opsi);
  daftarkan(obj, "efek", { mulai: t, hitung: (tt, acc) => { acc.putar[sumbu] += sudut * kurva(rentang(jam(tt), t, t + durasi)); } });
  bunyikan(bunyiDari(opsi, "putar"), { t, durasi, posisi: obj, sumber: namaBenda(obj) });
  return { mulai: t, selesai: t + durasi };
}

// ---------------------------------------------------------------- getar
// Benda bergetar mendatar (amplitudo meluruh), lalu diam di tempat semula. Bunyi "gemuruh" berdurasi.
export function getar(obj, { t, durasi = 0.5, amp = 0.06, frek = 16, ...opsi } = {}) {
  daftarkan(obj, "efek", {
    mulai: t,
    hitung(tt, acc) {
      const dt = tt - t;
      if (dt <= 0 || dt >= durasi) return;
      const a = amp * (1 - dt / durasi);
      acc.geser.x += a * Math.sin(2 * Math.PI * frek * dt);
      acc.geser.z += a * 0.6 * Math.sin(2 * Math.PI * frek * 1.37 * dt + 1.1);
    },
  });
  bunyikan(bunyiDari(opsi, "gemuruh"), { t, durasi, posisi: obj, sumber: namaBenda(obj) });
  return { mulai: t, selesai: t + durasi };
}
