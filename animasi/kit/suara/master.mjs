/**
 * Mastering bus suara: tapis-lolos-atas 30 Hz, tapis-lolos-bawah Butterworth orde 4 di 7,8 kHz, pudar awal-akhir,
 * normalisasi ke kenyaringan terintegrasi target (BS.1770-4), dan pembatas puncak sejati dengan plafon −2 dBTP.
 */
import { SR, highpass, lowpass4, kenyaringan, puncakSejatiPerSampel, selubungPembatas, sin2, keDb, dariDb } from "./dsp.mjs";

export const TARGET_LUFS = -18;
export const PLAFON_DB = -2;

export function master(L, R, { target = TARGET_LUFS, plafonDb = PLAFON_DB, pudarAwal = 0.005, pudarAkhir = 0.3 } = {}) {
  const n = L.length;
  for (const x of [L, R]) { highpass(x, 30); lowpass4(x, 7800); }
  const a = Math.min(n, Math.round(pudarAwal * SR)), b = Math.min(n, Math.round(pudarAkhir * SR));
  for (let i = 0; i < a; i++) { const g = sin2(i / a); L[i] *= g; R[i] *= g; }
  for (let i = 0; i < b; i++) { const g = sin2(i / b); L[n - 1 - i] *= g; R[n - 1 - i] *= g; }

  const awal = kenyaringan(L, R);
  if (!Number.isFinite(awal)) {
    return { L, R, lufs: -Infinity, lufsAwal: awal, penguatanDb: 0, puncakSejatiDb: -Infinity, puncakSampelDb: -Infinity, pembatas: { tekananMaksDb: 0, persen: 0 }, senyap: true };
  }
  const tp = puncakSejatiPerSampel(L, R);
  const plafon = dariDb(plafonDb);
  const oL = new Float64Array(n), oR = new Float64Array(n);
  // Pembatas menurunkan kenyaringan sedikit, jadi penguatan dinaikkan berulang sampai tepat target.
  let gDb = target - awal, gPakai = gDb, hasil = awal, sel = null;
  for (let ulang = 0; ulang < 8; ulang++) {
    const g = dariDb(gDb);
    gPakai = gDb;
    sel = selubungPembatas(tp, g, plafon);
    for (let i = 0; i < n; i++) { const k = g * sel[i]; oL[i] = L[i] * k; oR[i] = R[i] * k; }
    hasil = kenyaringan(oL, oR);
    const selisih = target - hasil;
    if (Math.abs(selisih) < 0.02) break;
    gDb += selisih;
  }
  let minSel = 1, iMin = 0, ditekan = 0;
  for (let i = 0; i < n; i++) { if (sel[i] < minSel) { minSel = sel[i]; iMin = i; } if (sel[i] < 0.999) ditekan++; }
  const tpAkhir = puncakSejatiPerSampel(oL, oR);
  let maksTp = 0, maksSampel = 0;
  for (let i = 0; i < n; i++) { if (tpAkhir[i] > maksTp) maksTp = tpAkhir[i]; const s = Math.max(Math.abs(oL[i]), Math.abs(oR[i])); if (s > maksSampel) maksSampel = s; }
  return {
    L: oL, R: oR, lufs: hasil, lufsAwal: awal, penguatanDb: gPakai,
    puncakSejatiDb: keDb(maksTp), puncakSampelDb: keDb(maksSampel),
    pembatas: { tekananMaksDb: -keDb(minSel), waktu: iMin / SR, persen: (100 * ditekan) / n },
    senyap: false,
  };
}
