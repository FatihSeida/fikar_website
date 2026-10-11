// Gerak lokal indikator 05 (belum ada di kit): jam beku yang berjalan lagi, dan aliran yang tersendat di celah retak.
// Keduanya mengikuti aturan gerak kit (fungsi murni dari t, lewat daftarkanMandiri), jadi bisa dipindah ke kit/gerak.
import * as THREE from "three";
import { W, bahanPijar, daftarkanMandiri, klem, halus, rentang, acak, waktuBeku } from "../../kit/index.js";

// Jam yang membeku seperti format indikator (melambat `beku[0]` → berhenti `beku[1]`), lalu berjalan lagi mulai `lanjut`
// dengan laju naik 0 → 1 selama `naik` detik. Untuk gerak Bagian 1 yang diam selama Cermin lalu bergerak lagi di Langkah.
export function jamLanjut({ beku = [6.0, 6.6], lanjut, naik = 0.4 }) {
  const b = waktuBeku(beku[0], beku[1]);
  const tauBeku = b(beku[1]);
  const jam = (t) => {
    if (t < lanjut) return b(t);
    const d = t - lanjut;
    return tauBeku + (d < naik ? (d * d) / (2 * naik) : naik / 2 + (d - naik));
  };
  jam.laju = (t) => (t < lanjut ? b.laju(t) : klem((t - lanjut) / naik));
  return jam;
}

// Aliran yang tersendat: bola cahaya berangkat dari awal `jalur` tiap `selang` detik (2 unit/s) dan berhenti di depan
// celah (`sTahan` = jarak berhenti bola pertama dari awal jalur). Bola berikutnya menumpuk di belakangnya menurut
// `tumpuk` ([mundur, naik] per bola, satuan diameter), lalu meredup menjadi abu. Mulai `lanjut` (detik nyata) tumpukan
// berjalan lagi sampai ujung jalur sambil berubah ke `warnaLanjut`. Mengembalikan { grup, tiba: [detik bola ke-i berhenti] }.
const TUMPUK = [[0, 0], [1, 0], [0.5, 0.85], [2, 0], [1.5, 0.85], [1, 1.7]];
export function aliranTersendat(v, {
  jalur, sTahan, mulai, tumpuk = TUMPUK, selang = 0.3, laju = 2, radius = 0.07, redup = 0.9,
  lanjut, warnaLanjut = W.emasPijar, kuatLanjut = 2.2, benih = 5, jam = (t) => t,
}) {
  const L = jalur.getLength();
  const r = acak(benih);
  const grup = new THREE.Group();
  grup.name = "aliran tersendat";
  const geo = new THREE.SphereGeometry(radius, 16, 12);
  const hijau = W.zamrudPijar.clone(), abu = W.abu.clone(), emas = warnaLanjut.clone().multiplyScalar(kuatLanjut);
  const D = radius * 2;
  const bola = tumpuk.map(([mundur, naik], i) => {
    const m = new THREE.Mesh(geo, bahanPijar(hijau, 1));
    const berangkat = mulai + i * selang;
    const sBerhenti = sTahan - mundur * D;
    // Sedikit acak menyamping supaya tumpukannya tidak rapi seperti manik-manik.
    const samping = (r() - 0.5) * 0.04;
    m.userData = { berangkat, sBerhenti, naik: naik * D, samping, tiba: berangkat + sBerhenti / laju };
    m.visible = false;
    grup.add(m);
    return m;
  });
  v.tambah(grup);
  const p = new THREE.Vector3(), arah = new THREE.Vector3(), sisi = new THREE.Vector3();
  daftarkanMandiri({
    perbarui(t) {
      const tau = jam(t);
      for (const [i, m] of bola.entries()) {
        const u = m.userData;
        if (tau < u.berangkat) { m.visible = false; continue; }
        const sJalan = (tau - u.berangkat) * laju;
        let s = Math.min(u.sBerhenti, sJalan);
        // Bola baris atas memanjat tumpukan pada 0.12 unit terakhir lintasannya.
        let naik = u.naik * halus(1 - (u.sBerhenti - sJalan) / 0.12);
        // Benturan kecil saat berhenti: mundur sedikit lalu diam.
        const dt = tau - u.tiba;
        if (dt > 0) s -= 0.03 * Math.sin(Math.min(1, dt / 0.18) * Math.PI) * (1 - halus(dt / 0.18));
        // Berjalan lagi sesudah celah tertutup (detik nyata, berurutan dari bola terdepan); tumpukan turun ke jalur.
        const dl = t - (lanjut + i * 0.1);
        if (dl > 0) s += laju * (dl < 0.3 ? (dl * dl) / 0.6 : dl - 0.15);
        const lepas = halus(rentang(t, lanjut, lanjut + 0.3));
        naik *= 1 - lepas;
        const k = klem(s / L);
        jalur.getPointAt(k, p);
        jalur.getTangentAt(k, arah);
        sisi.set(-arah.z, 0, arah.x).normalize();
        m.position.copy(p).addScaledVector(sisi, u.samping * (1 - lepas));
        m.position.y += naik;
        // Warna: zamrudPijar → abu sesudah berhenti → emas saat berjalan lagi.
        const kAbu = halus(rentang(tau, u.tiba + 0.1, u.tiba + 0.1 + redup));
        const kEmas = halus(rentang(t, lanjut + i * 0.1, lanjut + i * 0.1 + 0.35));
        m.material.color.copy(hijau).lerp(abu, kAbu).lerp(emas, kEmas);
        m.material.opacity = halus(s / 0.25) * halus((L - s) / 0.25) * (1 - 0.25 * kAbu * (1 - kEmas));
        m.visible = m.material.opacity > 0.002;
      }
    },
  });
  return { grup, tiba: bola.map((m) => m.userData.tiba), L };
}

