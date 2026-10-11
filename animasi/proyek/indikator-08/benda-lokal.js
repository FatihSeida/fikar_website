// Benda dan gerak lokal indikator-08 (rapat pengurus). Hanya yang belum ada di kit; calon pindahan ke kit dicatat di laporan.
import * as THREE from "three";
import {
  DEG, kartuKecil, daftarkan, acak, campur, rentang, halus, keluar3, masukKeluar3,
} from "../../kit/index.js";

const HADAP = 45 * DEG; // rotasi y supaya bidang xy lokal menghadap kamera

// ---------------------------------------------------------------- kertasTugas
// kartuKecil (0.6 × 0.8) yang titik asalnya di TENGAH kartu, bukan di tepi bawah, supaya bisa miring, berguling, dan
// berputar di tempat. Pembungkus berotasi "YXZ" dalam bingkai menghadap kamera: x = condong (atas ke belakang), z = berguling,
// y = menoleh. Keadaan (abu, pudar) berlaku ke kartu di dalamnya lewat penanganan bawaan kit.
export function kertasTugas({ nama = "kertas tugas", skala = 0.75 } = {}) {
  const g = new THREE.Group();
  g.rotation.order = "YXZ";
  g.rotation.y = HADAP;
  const kartu = kartuKecil({ rebah: false, miring: 0, hadap: 0, simbol: "garis", penting: false, nama: `${nama} kartu` });
  kartu.position.y = -0.4;
  g.add(kartu);
  g.scale.setScalar(skala);
  g.userData = { nama, penting: true, bagian: { kartu } };
  return g;
}

// ---------------------------------------------------------------- nasibKertas
// Seluruh perjalanan satu kertas tugas, dihitung murni dari t (satu fungsi pose(t), tiga saluran kit membacanya):
//   1. muncul dari layar ponsel (asal) naik ke tempat melayangnya (rumah), 0.5 s;
//   2. melayang tidak beraturan: geser sampai `amp` unit (benih), condong dan berguling pelan. Jam `jam` (waktuBeku)
//      melambatkan dan menghentikannya di 6.6, jadi kertas tetap di udara;
//   3. jatuh (opsional): melewati tepi meja ke titik `lewat`, lalu tenggelam di bawah tanah dan memudar;
//   4. kembali (opsional): muncul lagi di atas rumahnya dengan gerak muncul standar (naik 0.6);
//   5. terbang ke sel papan `ke` (busur, masukKeluar3), meluruskan diri dan mengecil ke skalaPapan.
// Sesudah mendarat, kertas mengikuti denyut skala papan (klik emas): posisi dan skala dikalikan s(t) terhadap `pusatPapan`.
export function nasibKertas(k, o) {
  const {
    jam, asal, rumah, benih, tMuncul, dMuncul = 0.5, jatuh = null, kembali = null, terbang, ke,
    skalaApung, skalaPapan, pusatPapan, skalaPapanFn = () => 1, amp = 0.3, tinggiBusur = 0.7, nama = k.userData.nama,
  } = o;
  const r = acak(benih);
  const w = Array.from({ length: 6 }, () => 0.8 + 0.8 * r());          // laju tiap komponen (rad/s)
  const f = Array.from({ length: 6 }, () => r() * Math.PI * 2);          // fase
  const dasar = { x: -(0.2 + 0.45 * r()), y: (r() - 0.5) * 0.8, z: (r() - 0.5) * 0.8 }; // condong, menoleh, berguling dasar
  const selaras = (t) => halus(rentang(t, tMuncul + 0.15, tMuncul + 1.0)); // amplitudo gerak acak naik perlahan

  const sasaran = (t, out) => {
    const tau = jam(t), e = selaras(t);
    return out.set(
      amp * Math.sin(w[0] * tau + f[0]),
      amp * 0.6 * Math.sin(w[1] * tau + f[1]),
      amp * Math.sin(w[2] * tau + f[2]),
    ).multiplyScalar(e).add(rumah);
  };
  const sudut = (t, out) => {
    const tau = jam(t), e = selaras(t);
    out.x = dasar.x + 0.28 * e * Math.sin(w[3] * tau + f[3]);
    out.y = dasar.y + 0.35 * e * Math.sin(w[4] * tau + f[4]);
    out.z = dasar.z + 0.30 * e * Math.sin(w[5] * tau + f[5]);
    return out;
  };

  const P0 = new THREE.Vector3(), P1 = new THREE.Vector3(), S0 = { x: 0, y: 0, z: 0 };
  const ps = { pos: new THREE.Vector3(), x: 0, y: 0, z: 0, skala: 1, alpha: 0 };
  let tTerakhir = NaN;
  const set = (pos, x, y, z, skala, alpha) => { ps.pos.copy(pos); ps.x = x; ps.y = y; ps.z = z; ps.skala = skala; ps.alpha = alpha; };

  function pose(t) {
    if (t === tTerakhir) return ps;
    tTerakhir = t;
    const tJatuh = jatuh ? jatuh.t + jatuh.durasi : null;
    const tTerbang = terbang.t, dTerbang = terbang.durasi ?? 0.7;
    if (t >= tTerbang) {
      // 5. terbang ke papan
      const e = masukKeluar3(rentang(t, tTerbang, tTerbang + dTerbang));
      sasaran(tTerbang, P0);
      sudut(tTerbang, S0);
      P1.lerpVectors(P0, ke, e);
      P1.y += tinggiBusur * Math.sin(Math.PI * e);
      const s = t >= tTerbang + dTerbang ? skalaPapanFn(t) : 1; // denyut skala papan hanya sesudah mendarat
      if (s !== 1) P1.sub(pusatPapan).multiplyScalar(s).add(pusatPapan);
      set(P1, S0.x * (1 - e), S0.y * (1 - e), S0.z * (1 - e), campur(1, skalaPapan / skalaApung, e) * s, 1);
    } else if (kembali && t >= kembali.t) {
      // 4. kembali: muncul standar (naik 0.6, skala 0.85 → 1, opacity 0 → 1)
      const u = keluar3(rentang(t, kembali.t, kembali.t + 0.5));
      sasaran(t, P0); P0.y -= 0.6 * (1 - u);
      sudut(t, S0);
      set(P0, S0.x, S0.y, S0.z, campur(0.85, 1, u), u);
    } else if (jatuh && t >= jatuh.t) {
      // 3. jatuh melewati tepi meja, tenggelam di bawah tanah
      const u = rentang(t, jatuh.t, tJatuh);
      sasaran(jatuh.t, P0);
      sudut(jatuh.t, S0);
      const hx = halus(u / 0.7);
      P1.set(campur(P0.x, jatuh.lewat.x, hx), campur(P0.y, -0.7, u * u), campur(P0.z, jatuh.lewat.z, hx));
      const alpha = halus(rentang(P1.y, -0.1, 0.35));
      set(P1, campur(S0.x, -1.25, keluar3(u)), S0.y, S0.z + jatuh.putar * u, 1, alpha);
    } else if (t >= tMuncul) {
      // 1 + 2. muncul dari ponsel lalu melayang
      const u = keluar3(rentang(t, tMuncul, tMuncul + dMuncul));
      sasaran(t, P0);
      P1.lerpVectors(asal, P0, u);
      sudut(t, S0);
      set(P1, S0.x, S0.y, S0.z, campur(0.45, 1, u), halus(rentang(t, tMuncul, tMuncul + 0.3)));
    } else {
      set(asal, dasar.x, dasar.y, dasar.z, 0.45, 0);
    }
    return ps;
  }

  daftarkan(k, "posisi", {
    mulai: tMuncul,
    sebelum: (acc) => { acc.posisi = acc._pos.copy(asal); },
    hitung(t, acc) { acc.posisi = acc._pos.copy(pose(t).pos); },
  });
  daftarkan(k, "tampak", {
    mulai: tMuncul,
    sebelum: (acc) => { acc.opasitas = 0; },
    hitung(t, acc) { acc.opasitas = pose(t).alpha; },
  });
  daftarkan(k, "efek", {
    mulai: tMuncul,
    hitung(t, acc) {
      const p = pose(t);
      acc.putar.x += p.x; acc.putar.y += p.y; acc.putar.z += p.z;
      acc.skala.multiplyScalar(p.skala);
    },
  });
  return { pose, sasaran, tTiba: terbang.t + (terbang.durasi ?? 0.7) };
}
