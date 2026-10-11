// Fungsi waktu dan easing. Murni (tanpa three.js), jadi bisa dipakai di browser maupun Node.
// Semua gerak di kit dihitung dari t lewat fungsi-fungsi ini.

export const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const campur = (a, b, k) => a + (b - a) * k;
// Posisi t di dalam rentang [a, b], dijepit 0..1.
export const rentang = (t, a, b) => (b === a ? (t >= a ? 1 : 0) : klem((t - a) / (b - a)));
export const halus = (x) => { x = klem(x); return x * x * (3 - 2 * x); };
export const keluar3 = (x) => 1 - Math.pow(1 - klem(x), 3);
export const masukKeluar3 = (x) => { x = klem(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
// Melewati sasaran sedikit lalu kembali (s: besar lentingan).
export const lenting = (x, s = 1.7) => { x = klem(x); const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
// 0 di luar [a, b], 1 di dalamnya, dengan tepi halus selebar masuk/keluar detik.
export const jendela = (t, a, b, masuk = 0.3, keluar = 0.3) => Math.min(halus((t - a) / masuk), halus((b - t) / keluar));
// Getaran teredam: 1 pada dt = 0, meluruh ke 0. Contoh: skala = 1 + 0.25 * pegas(t - t0).
export const pegas = (dt, laju = 12, frek = 22) => (dt < 0 ? 0 : Math.exp(-dt * laju) * Math.cos(dt * frek));

// Acak berbenih (mulberry32). acak(7) mengembalikan fungsi; tiap panggilan memberi bilangan 0..1 yang selalu sama urutannya.
export function acak(benih) {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Jam yang melambat dari laju 1 di detik `mulai` sampai berhenti di detik `henti` (laju turun linear).
// Mengembalikan τ(t); τ.laju(t) adalah dτ/dt (1 → 0). Dipakai format indikator untuk "gerak melambat dan berhenti pada t 6.6".
// lanjut (opsional): jam berjalan lagi mulai detik itu (paling cepat `henti`), lajunya naik 0 → 1 selama `landai` detik,
// dan gerak meneruskan dari tempat ia berhenti. τ.henti dan τ.lanjut menyimpan kedua detik itu (lanjut null = beku selamanya).
export function waktuBeku(mulai, henti, { lanjut = null, landai = 0.4 } = {}) {
  const L = henti - mulai;
  const beku = (t) => {
    if (t <= mulai) return t;
    const u = Math.min(1, (t - mulai) / L);
    return mulai + L * (u - (u * u) / 2);
  };
  const lajuBeku = (t) => (t <= mulai ? 1 : Math.max(0, 1 - (t - mulai) / L));
  if (lanjut === null || lanjut === undefined) {
    beku.laju = lajuBeku;
    beku.henti = henti;
    beku.lanjut = null;
    return beku;
  }
  const a = Math.max(lanjut, henti);
  const tauHenti = beku(henti);
  const tau = (t) => {
    if (t < a) return beku(t);
    const d = t - a;
    return tauHenti + (d < landai ? (d * d) / (2 * landai) : landai / 2 + (d - landai));
  };
  tau.laju = (t) => (t < a ? lajuBeku(t) : landai > 0 ? klem((t - a) / landai) : 1);
  tau.henti = henti;
  tau.lanjut = a;
  return tau;
}
