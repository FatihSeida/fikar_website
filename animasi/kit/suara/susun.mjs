/**
 * Dari daftar peristiwa ke campuran stereo: isi nilai bawaan, saring, tipiskan peristiwa yang terlalu rapat,
 * batasi suara serentak, lalu render setiap bunyi ke penyangganya sendiri (kecerahan, gain, pan, pudar)
 * dan jumlahkan ke bus utama.
 */
import { SR, DUA_PI, BATAS_ATAS, klem, halus, sin2, acak, hash, penta, panGain, dariDb, kenyaringanMaks } from "./dsp.mjs";
import { PALET } from "./palet.mjs";

export const KUAT_BAWAAN = 0.7;
/** x = 0 dan x = 1 dipetakan ke pan ±0,75, supaya tidak ada bunyi yang menempel di satu telinga. */
export const LEBAR_STEREO = 0.75;
/** Batas suara serentak (selain bunyi latar). */
export const MAKS_SERENTAK = 12;
const BENIH = 0x5eed;
const BATAS_NADA_HZ = 2500; // nada pokok di atasnya diturunkan satu oktaf

const BAWAAN_META = {
  kelompok: "Lokal", keterangan: "", tingkat: -20, durasi: 0, berdurasi: false, lama: 1.0, dasar: 0,
  jarakMin: 0.03, ekor: 0.25, maksSerentak: 4, latar: false, wajib: false, impulsif: false, pita: "lebar",
  variasiNada: 0.004, variasiGainDb: 1.0,
};

export function lengkapiMeta(nama, m) {
  if (typeof m === "function") m = { buat: m };
  if (!m || typeof m.buat !== "function") throw new Error(`bunyi "${nama}" harus berupa fungsi buat(s) atau objek { buat(s) }`);
  return { ...BAWAAN_META, ...m, nama };
}

/** Palet kit, ditambah atau ditimpa bunyi lokal dari video. */
export function susunPalet(lokal = null) {
  const p = {};
  for (const [nama, m] of Object.entries(PALET)) p[nama] = lengkapiMeta(nama, m);
  if (lokal) for (const [nama, m] of Object.entries(lokal)) p[nama] = lengkapiMeta(nama, m);
  return p;
}

const angka = (v, bawaan) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? bawaan : Number(v));

/** Tahap 1: salin dan isi nilai bawaan. Jenis yang belum dikenal tetap dibiarkan (sesuaikan() boleh mengganti jenisnya). */
export function isiBawaan(mentah) {
  if (!Array.isArray(mentah)) return [];
  const hasil = [];
  for (const p of mentah) {
    if (!p || typeof p !== "object") continue;
    const e = {
      ...p,
      t: angka(p.t, NaN),
      jenis: String(p.jenis ?? ""),
      x: klem(angka(p.x, 0.5)),
      kuat: klem(angka(p.kuat, KUAT_BAWAAN)),
      durasi: Math.max(0, angka(p.durasi, 0)),
      nada: Math.round(angka(p.nada, 0)),
      sumber: p.sumber == null ? "" : String(p.sumber),
    };
    if (p.x1 != null && Number.isFinite(Number(p.x1))) e.x1 = klem(Number(p.x1)); else delete e.x1;
    hasil.push(e);
  }
  return hasil.sort((a, b) => a.t - b.t);
}

/** Tahap 2: buang yang tidak sah, dengan peringatan. Jenis tak dikenal diabaikan, tidak menggagalkan proses. */
export function saring(daftar, palet, durasi, peringatan) {
  const tetap = [], takDikenal = {};
  let luar = 0, bisu = 0, rusak = 0;
  for (const p of isiBawaan(daftar)) {
    if (!Number.isFinite(p.t)) { rusak++; continue; }
    if (p.t < -0.05 || p.t >= durasi) { luar++; continue; }
    if (!palet[p.jenis]) { takDikenal[p.jenis] = (takDikenal[p.jenis] || 0) + 1; continue; }
    if (p.kuat <= 0) { bisu++; continue; }
    p.t = Math.max(0, p.t);
    tetap.push(p);
  }
  for (const [j, n] of Object.entries(takDikenal)) peringatan.push(`jenis tidak dikenal "${j}" (${n}×), diabaikan`);
  if (rusak) peringatan.push(`${rusak} peristiwa tanpa t yang sah, diabaikan`);
  if (luar) peringatan.push(`${luar} peristiwa di luar 0–${durasi} s, diabaikan`);
  return { daftar: tetap, takDikenal, bisu };
}

/**
 * Gabungkan peristiwa sejenis dari sumber yang sama yang lebih rapat dari `jarakMin` (yang pertama dipertahankan,
 * sedikit dikuatkan), lalu pangkas peristiwa bila suara serentak sejenis atau total sudah penuh.
 * Setiap peristiwa yang tersisa diberi faktor kerapatan supaya ledakan bunyi sejenis tidak menjadi keras.
 */
export function tipiskan(daftar, palet) {
  const terakhir = new Map(), gabung = [];
  let digabung = 0, dipangkas = 0;
  for (const e of daftar) {
    const m = palet[e.jenis];
    const kunci = `${e.jenis}\u0000${e.sumber}`;
    const lalu = terakhir.get(kunci);
    if (lalu && e.t - lalu.t < m.jarakMin) {
      lalu.kuat = Math.min(1, Math.max(lalu.kuat, e.kuat) + 0.03);
      digabung++;
      continue;
    }
    terakhir.set(kunci, e);
    gabung.push(e);
  }
  const aktif = [], tetap = [];
  for (const e of gabung) {
    const m = palet[e.jenis];
    for (let k = aktif.length - 1; k >= 0; k--) if (aktif[k].akhir <= e.t) aktif.splice(k, 1);
    if (!m.latar) {
      const sejenis = aktif.reduce((n, a) => n + (a.jenis === e.jenis), 0);
      if (!m.wajib && (sejenis >= m.maksSerentak || aktif.length >= MAKS_SERENTAK)) { dipangkas++; continue; }
      aktif.push({ akhir: e.t + m.ekor, jenis: e.jenis });
    }
    tetap.push(e);
  }
  // Kerapatan: n bunyi sejenis yang mulai hampir bersamaan dijumlahkan dengan energi kira-kira tetap.
  for (let i = 0; i < tetap.length; i++) {
    const e = tetap[i], w = Math.min(0.08, palet[e.jenis].ekor / 2);
    let n = 0;
    for (let k = i; k >= 0 && tetap[k].t > e.t - w; k--) n += tetap[k].jenis === e.jenis;
    for (let k = i + 1; k < tetap.length && tetap[k].t < e.t + w; k++) n += tetap[k].jenis === e.jenis;
    e._kerapatan = Math.pow(n, -0.4);
  }
  return { daftar: tetap, digabung, dipangkas };
}

// ---------------------------------------------------------------- render satu bunyi
/** Durasi efektif: durasi peristiwa, atau durasi bawaan jenisnya. */
export function durasiEfektif(e, m, sisa) {
  if (e.durasi > 0 && m.berdurasi) return e.durasi;
  return typeof m.durasi === "function" ? m.durasi(sisa) : m.durasi;
}

function renderBunyi(e, m, { sisa, indeks = 0, indeksSumber = 0, netral = false }) {
  const d = durasiEfektif(e, m, sisa);
  const lama = Math.min(sisa, typeof m.lama === "function" ? m.lama(d) : m.lama);
  const n = Math.max(1, Math.ceil(lama * SR));
  const L = new Float64Array(n), R = new Float64Array(n);

  const rng = acak(netral ? 12345 : (hash(m.nama) ^ Math.imul(indeks + 1, 0x9e3779b1) ^ BENIH) >>> 0);
  const vr = acak(netral ? 54321 : (hash(`${m.nama}#v`) ^ Math.imul(indeks + 1, 0x85ebca6b) ^ BENIH) >>> 0);
  const varNada = netral ? 1 : 1 + (vr() * 2 - 1) * m.variasiNada;
  const varGainDb = netral ? 0 : (vr() * 2 - 1) * m.variasiGainDb;
  const varTerang = netral ? 1 : 1 + (vr() * 2 - 1) * 0.08;

  // Nada: langkah pentatonik dari derajat dasar; dilipat per oktaf supaya tetap di wilayah yang enak.
  let derajat = m.dasar + e.nada;
  for (let k = 0; k < 20 && (derajat > m.dasar + 9 || penta(derajat) > BATAS_NADA_HZ); k++) derajat -= 5;
  for (let k = 0; k < 20 && derajat < m.dasar - 5; k++) derajat += 5;
  const rasio = (penta(derajat) / penta(m.dasar)) * varNada;

  // Pan dari x (dan x1 bila bunyi bergerak), daya-sama.
  const p0 = (e.x - 0.5) * 2 * LEBAR_STEREO;
  const p1 = e.x1 != null ? (e.x1 - 0.5) * 2 * LEBAR_STEREO : p0;
  const lamaGerak = d > 0 ? d : 0.5;
  const panEv = p0 === p1 ? null : (τ) => p0 + (p1 - p0) * halus(τ / lamaGerak);
  const gainPan = (tAbs, off) => panGain((panEv ? panEv(tAbs) : p0) + off);

  const s = {
    ev: e, kuat: e.kuat, nada: e.nada, durasi: d, sisa, indeks, indeksSumber, rasio, acak: rng,
    /** Frekuensi derajat pentatonik k di atas nada dasar bunyi ini (sudah termasuk `nada` dan variasi). */
    f: (k = 0) => penta(derajat + k) * varNada,
    /** Nada aditif. parsial: [rasio, amplitudo, peluruhan detik]. f, pan, bentuk boleh fungsi waktu lokal. */
    ton(t0, { f, dur, serang = 0.004, lepas = 0.02, parsial = [[1, 1, 0.3]], gain = 0.1, pan = 0, bentuk = null, getar = null }) {
      const i0 = Math.round(t0 * SR), len = Math.round(dur * SR), lepasN = Math.max(1, lepas * SR);
      const fasa = new Float64Array(parsial.length), fFn = typeof f === "function", panFn = typeof pan === "function";
      const tetap = !panEv && !panFn;
      let [gl, gr] = tetap ? gainPan(0, pan) : [0, 0];
      for (let k = 0; k < len; k++) {
        const i = i0 + k;
        if (i >= n) break;
        const tau = k / SR, fd = fFn ? f(tau) : f;
        let v = 0;
        for (let p = 0; p < parsial.length; p++) {
          const pr = parsial[p], fr = fd * pr[0];
          fasa[p] += (DUA_PI * fr) / SR;
          if (fr > BATAS_ATAS) continue;
          v += Math.sin(fasa[p]) * pr[1] * Math.exp(-tau / pr[2]);
        }
        v *= gain * (serang > 0 ? sin2(tau / serang) : 1) * Math.min(1, (len - k) / lepasN);
        if (bentuk) v *= bentuk(tau);
        if (getar) v *= 1 - getar.dalam * (0.5 + 0.5 * Math.sin(DUA_PI * getar.laju * tau));
        if (!tetap && (k & 15) === 0) [gl, gr] = gainPan(t0 + tau, panFn ? pan(tau) : pan);
        L[i] += v * gl; R[i] += v * gr;
      }
    },
    /** Derau berbenih lewat filter state-variable (TPT); jenis "bp" (bawaan), "lp", atau "hp". fc boleh fungsi waktu. */
    derau(t0, { dur, fc, q = 0.7, jenis = "bp", bentuk = null, gain = 0.1, pan = 0 }) {
      const r = acak((rng() * 4294967296) >>> 0);
      const i0 = Math.round(t0 * SR), len = Math.round(dur * SR), ujung = 0.006 * SR;
      const fcFn = typeof fc === "function", panFn = typeof pan === "function", tetap = !panEv && !panFn;
      let [gl, gr] = tetap ? gainPan(0, pan) : [0, 0];
      const kk = 1 / q;
      let a1 = 0, a2 = 0, a3 = 0, ic1 = 0, ic2 = 0;
      const setel = (fz) => { const g = Math.tan((Math.PI * Math.min(fz, BATAS_ATAS)) / SR); a1 = 1 / (1 + g * (g + kk)); a2 = g * a1; a3 = g * a2; };
      if (!fcFn) setel(fc);
      for (let k = 0; k < len; k++) {
        const i = i0 + k;
        if (i >= n) break;
        const tau = k / SR;
        if (fcFn && (k & 7) === 0) setel(fc(tau));
        const x = r() * 2 - 1;
        const v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3;
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
        const y = jenis === "lp" ? v2 : jenis === "hp" ? x - kk * v1 - v2 : v1;
        let v = y * gain * Math.min(1, (len - k) / ujung);
        if (bentuk) v *= bentuk(tau);
        if (!tetap && (k & 15) === 0) [gl, gr] = gainPan(t0 + tau, panFn ? pan(tau) : pan);
        L[i] += v * gl; R[i] += v * gr;
      }
    },
    /** Hentakan rendah dengan nada turun dari f0 ke f1. */
    dentum(t0, { f0 = 110, f1 = 55, lama = 0.3, gain = 0.3, pan = 0 }) {
      s.ton(t0, { f: (τ) => f1 + (f0 - f1) * Math.exp(-τ / 0.05), dur: lama + 0.1, serang: 0.002, lepas: 0.06, parsial: [[1, 1, lama * 0.45], [2, 0.25, lama * 0.25]], gain, pan });
    },
  };
  m.buat(s);

  // Kecerahan mengikuti kuat: tapis-lolos-bawah satu kutub, 2 kHz (kuat 0) sampai ~10 kHz (kuat 1).
  const fcTerang = 2000 * Math.pow(2, 2.3 * e.kuat) * varTerang;
  if (fcTerang < 9000) {
    const a = 1 - Math.exp((-DUA_PI * fcTerang) / SR);
    let yl = 0, yr = 0;
    for (let i = 0; i < n; i++) { yl += a * (L[i] - yl); yr += a * (R[i] - yr); L[i] = yl; R[i] = yr; }
  }
  // Pudar di setiap bunyi: masuk 1 ms, keluar 20 ms di ujung penyangga (juga bila terpotong akhir video).
  const masuk = Math.min(n, Math.round(0.001 * SR)), keluar = Math.min(Math.floor(n / 4), Math.round(0.02 * SR));
  for (let i = 0; i < masuk; i++) { const g = sin2(i / masuk); L[i] *= g; R[i] *= g; }
  for (let i = 0; i < keluar; i++) { const g = sin2(i / keluar); L[n - 1 - i] *= g; R[n - 1 - i] *= g; }
  return { L, R, varGainDb, oktaf: (derajat - m.dasar) / 5 };
}

// Kalibrasi: setiap jenis dirender sekali (kuat 0,7, nada 0, durasi bawaan), lalu penguatannya disetel
// supaya kenyaringan 100 ms terbesarnya sama dengan `tingkat`.
const cacheKal = new WeakMap();
export function kalibrasi(m) {
  if (cacheKal.has(m)) return cacheKal.get(m);
  const e = { t: 0, jenis: m.nama, x: 0.5, kuat: KUAT_BAWAAN, durasi: 0, nada: 0, sumber: "" };
  const { L, R } = renderBunyi(e, m, { sisa: 6, netral: true });
  const keras = kenyaringanMaks(L, R, 0.1);
  const kal = Number.isFinite(keras) ? dariDb(m.tingkat - keras) : 1;
  cacheKal.set(m, kal);
  return kal;
}

/** Gain akhir satu peristiwa. kuat 0,7 = tingkat jenisnya; kuat 1 ≈ +4,6 dB; kuat 0,35 ≈ −9 dB. */
function gainPeristiwa(e, m, varGainDb, oktaf) {
  return kalibrasi(m) * Math.pow(e.kuat / KUAT_BAWAAN, 1.5) * dariDb(varGainDb - 1.5 * oktaf) * (e._kerapatan ?? 1);
}

/** Render semua peristiwa ke bus stereo sepanjang `durasi` detik. */
export function campur(daftar, palet, durasi) {
  const N = Math.round(durasi * SR);
  const L = new Float64Array(N), R = new Float64Array(N);
  const nJenis = new Map(), nSumber = new Map();
  for (const e of daftar) {
    const m = palet[e.jenis];
    const indeks = nJenis.get(e.jenis) ?? 0;
    nJenis.set(e.jenis, indeks + 1);
    const ks = `${e.jenis}\u0000${e.sumber}`, indeksSumber = nSumber.get(ks) ?? 0;
    nSumber.set(ks, indeksSumber + 1);
    const i0 = Math.round(e.t * SR);
    if (i0 >= N) continue;
    const v = renderBunyi(e, m, { sisa: (N - i0) / SR, indeks, indeksSumber });
    const g = gainPeristiwa(e, m, v.varGainDb, v.oktaf);
    const n = Math.min(v.L.length, N - i0);
    for (let k = 0; k < n; k++) { L[i0 + k] += v.L[k] * g; R[i0 + k] += v.R[k] * g; }
  }
  return { L, R };
}
