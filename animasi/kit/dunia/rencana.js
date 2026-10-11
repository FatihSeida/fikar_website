// Dunia Rencana: papan tulis, meja kerja, lintasan tujuh ubin, dan bendera di ujungnya.
// KONTRAK.md §7. Kunci benda, titik, opsi, dan penyimpangan dari prompt: docs/dunia-pustaka-rencana-arsip.md.
//
//   const d = duniaRencana(v, { opsi: { papan: { kolom: ["TUGAS", "TENGGAT", "PJ"] } } });
//   const r = duniaRencana(v, { rapat: { pengurus: 6 } });   // "Dunia Rencana dengan meja rapat"
//
// Lintasan dibangun dari titik dunia (grup di titik asal). Untuk memindahkannya, beri opsi.lintasan { dari, ke };
// bendera ikut pindah ke ujung yang baru.
import * as THREE from "three";
import { titik, DEG } from "../inti/ruang.js";
import { pion } from "../benda/dasar.js";
import { lintasan } from "../benda/medan.js";
import { papanTulis, mejaKotak, mejaBundar, kursiKotak, bendera } from "../benda/perabot.js";
import { susunDunia, luaskan } from "./_susun.js";

const P = {
  papan: titik(-1.6, -2.6),         // prompt titik(-1.6, -3.2)
  meja: titik(-1.3, -0.5),          // prompt titik(-1.2, 0.4)
  dari: titik(-2.8, 2.6),           // prompt titik(-2.8, 2.6)
  ke: titik(3.0, -0.3),             // prompt titik(3.6, -0.6)
  mejaRapat: titik(0, 0.6),         // indikator 08, 27, 32 (41: titik(0.4, 0.8))
};
const GESER_BENDERA = titik(0.5, -0.4);   // bendera sedikit melewati ujung lintasan, seperti prompt (3.6, -0.6) → (4.1, -1.0)
const JARI_RAPAT = 1.75;

const sudut = (i, n) => 90 * DEG + (i * 2 * Math.PI) / n;
const diLingkar = (pusat, jari, a, y = 0) => pusat.clone().add(titik(jari * Math.cos(a), jari * Math.sin(a), 0)).setY(y);
const hadapKe = (dari, ke) => Math.atan2(ke.x - dari.x, ke.z - dari.z);

// opsi (selain tanpa, posisi, opsi, ganti):
//   rapat   false (bawaan) | true | { pengurus = 5, kursi = 0 }
//           Meja diganti mejaBundar di titik(0, 0.6) dengan pengurus1..N (pion berdiri menghadap meja) dan/atau
//           kursi1..M (kursiKotak). Bila keduanya ada, pengurus duduk di kursi. Lintasan dan bendera tidak dibuat,
//           karena meja rapat menempati jalurnya. Pindahkan meja rapat lewat posisi.meja; pengurus dan kursi ikut.
export function duniaRencana(v, opsi = {}) {
  const rapat = opsi.rapat ? { pengurus: 5, kursi: 0, ...(opsi.rapat === true ? {} : opsi.rapat) } : null;
  const nPengurus = rapat ? rapat.pengurus : 0, nKursi = rapat ? rapat.kursi : 0;
  const o = luaskan(opsi, { pengurus: nPengurus, kursi: nKursi });
  const dari = o.opsi.lintasan?.dari ?? P.dari, ke = o.opsi.lintasan?.ke ?? P.ke;

  const resep = [
    // Papan menghadap kamera (hadap bawaan papanTulis). Kaki 0.4 supaya puncaknya masuk zona (lihat docs).
    { nama: "papan", buat: (op) => papanTulis({ kaki: 0.4, nama: "papan", ...op }), posisi: P.papan },
  ];
  if (!rapat) {
    resep.push(
      { nama: "meja", buat: (op) => mejaKotak({ nama: "meja", ...op }), posisi: P.meja },
      { nama: "lintasan", buat: (op) => lintasan({ jumlah: 7, nama: "lintasan", ...op, dari, ke }) },
      { nama: "bendera", buat: (op) => bendera(op), posisi: ke.clone().add(GESER_BENDERA) },
    );
  }

  const pusat = (o.posisi?.meja ?? P.mejaRapat).clone();
  const titikKursi = [], titikPengurus = [], titikDuduk = [];
  if (rapat) {
    resep.push({ nama: "meja", buat: (op) => mejaBundar({ nama: "meja rapat", ...op }), posisi: pusat });
    for (let i = 0; i < nKursi; i++) {
      const p = diLingkar(pusat, JARI_RAPAT, sudut(i, nKursi));
      titikKursi.push(p);
      resep.push({ nama: `kursi${i + 1}`, buat: (op) => kursiKotak({ nama: `kursi ${i + 1}`, ...op }), posisi: p, rotasi: hadapKe(p, pusat) });
    }
    const dudukDiKursi = nKursi > 0;
    for (let i = 0; i < nPengurus; i++) {
      const p = diLingkar(pusat, JARI_RAPAT, sudut(i, nPengurus));
      titikPengurus.push(p);
      const y = dudukDiKursi && i < nKursi ? 0.42 : 0;   // tinggi dudukan kursiKotak
      resep.push({
        nama: `pengurus${i + 1}`, buat: (op) => pion({ duduk: y > 0, nama: `pengurus ${i + 1}`, ...op }),
        posisi: p.clone().setY(y), rotasi: hadapKe(p, pusat),
      });
    }
    for (const p of titikKursi) titikDuduk.push(p.clone().setY(0.42));
  }

  const { benda, urutan } = susunDunia(v, resep, o);

  const t = {};
  if (benda.papan) {
    const { tinggi = 2.6, kaki = 0.4 } = o.opsi.papan ?? {};
    t.papan = benda.papan.localToWorld(new THREE.Vector3(0, kaki + tinggi / 2, 0.08));  // pusat muka papan (fokus cermin)
    t.depanPapan = benda.papan.localToWorld(new THREE.Vector3(0, 0, 1.0)).setY(0);      // tanah 1 unit di depan papan
  }
  if (benda.meja) t.meja = benda.meja.position.clone().setY(benda.meja.userData.tinggiAtas ?? 0.8); // pusat permukaan meja
  if (benda.lintasan?.userData.titikUbin) {
    t.ubin = benda.lintasan.userData.titikUbin.map((p) => benda.lintasan.localToWorld(p.clone())); // pusat atas tiap ubin
    t.lintasanAwal = t.ubin[0];
    t.lintasanAkhir = t.ubin[t.ubin.length - 1];
  }
  if (benda.bendera?.userData.puncak) {
    t.bendera = benda.bendera.position.clone();
    t.puncakBendera = benda.bendera.localToWorld(benda.bendera.userData.puncak.clone());
  }
  if (rapat) {
    t.pengurus = titikPengurus;   // titik lantai tiap pengurus
    t.kursi = titikKursi;         // titik lantai tiap kursi rapat
    t.duduk = titikDuduk;         // titik asal figur duduk di kursi rapat
  }
  return { benda, urutan, fokus: titik(0, 0, 0.8), H: 16, titik: t };
}
