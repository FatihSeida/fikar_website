// segmenKuis: adegan 3D Bagian 4 format evidence (Prompt 00 bagian E). Terowongan audit enam lengkung, komisariat meluncur
// di bawahnya, lalu satu lembar laporan emas mendarat di atap. Teks Bagian 4 dipasang format, bukan modul ini.
// Semua dijadwalkan lewat pencatat gerak kit (daftarkan, muncul, lintas, klikEmas, denyutCermin) atau fungsi murni dari t,
// jadi adegan pada detik mana pun sama, tidak bergantung pada frame sebelumnya. Rincian: kit/docs/gerak.md.
import * as THREE from "three";
import { videoAktif } from "../inti/aktif.js";
import { titik } from "../inti/ruang.js";
import { jadwalEvidence } from "../inti/kamera.js";
import { campur, rentang, halus, masukKeluar3 } from "../inti/waktu.js";
import { setelKeadaan } from "../inti/bahan.js";
import { lengkungAudit } from "../benda/bangunan.js";
import { lembarKertas } from "../benda/dokumen.js";
import { muncul, lintas, klikEmas, denyutCermin } from "./standar.js";
import { catat, daftarkan, daftarkanMandiri, namaBenda } from "./catatan.js";

// Urutan lengkung dari kiri atas ke kanan bawah layar: kelompok → label.
const KELOMPOK = [
  ["kaderisasi", "KADERISASI"], ["tata-kelola", "TATA KELOLA"], ["pengetahuan", "PENGETAHUAN"],
  ["target-program", "TARGET PROGRAM"], ["evaluasi-arsip", "EVALUASI DAN ARSIP"], ["data-jaringan", "DATA DAN JARINGAN"],
];
const LENGKUNG = { pertama: 0.84, jarak: 0.56, ujung: 4.6 }; // titik(s, s) dari P: lengkung ke-i di s = pertama + jarak × i; E di s = ujung
const LUNCUR = { mulai: 1.0, durasi: 1.6 }; // detik relatif terhadap `mulai`

export function segmenKuis(v, { komisariat, kelompok, mulai = 23.0, sembunyikan, skala = 0.8 } = {}) {
  v ??= videoAktif("segmenKuis");
  if (!komisariat?.isObject3D) throw new Error("[kit] segmenKuis: opsi `komisariat` (Object3D dari adegan) wajib.");
  const iKelompok = kelompok == null ? -1 : KELOMPOK.findIndex(([k]) => k === kelompok);
  if (kelompok != null && iKelompok < 0) throw new Error(`[kit] segmenKuis: kelompok "${kelompok}" tidak dikenal; pilihan: ${KELOMPOK.map(([k]) => k).join(", ")}.`);
  const m = mulai;

  // ---------------------------------------------------------------- tata letak dari P (titik tanah komisariat, tinggi alas ikut)
  komisariat.updateWorldMatrix(true, false);
  const P = komisariat.getWorldPosition(new THREE.Vector3());
  const E = P.clone().add(titik(LENGKUNG.ujung, LENGKUNG.ujung));
  const fokus = P.clone().add(E).multiplyScalar(0.5);
  // Tinggi puncak atap di atas P pada skala akhir: skala komisariat selama segmen adalah `skala` (mutlak, pada skala dasarnya).
  const tinggiAtap = new THREE.Box3().setFromObject(komisariat).max.y - P.y;
  const skalaDasar = komisariat.scale.y || 1;
  const puncakAtap = E.clone().setY(E.y + (tinggiAtap * skala) / skalaDasar);

  // ---------------------------------------------------------------- benda sembunyikan: dibungkus supaya pudar tanpa menyentuh opasitasnya sendiri
  // Pembungkus (Group identitas) memudar lewat aturOpasitas; opasitas yang tampak = benda × induknya (opasitasEfektif), jadi
  // gerak benda itu sendiri (muncul, hilang, aturOpasitas video) tidak tertimpa, dan label3D berjangkar Object3D di dalamnya
  // ikut pudar. Induk komisariat (mis. blok tanah) tidak dipudarkan: yang dibungkus anak-anaknya selain jalur ke komisariat.
  const jalur = new Set();
  for (let o = komisariat; o; o = o.parent) jalur.add(o);
  const kecuali = new Set([v.tanah?.grup, v.mesin?.hemi, v.mesin?.matahari, v.mesin?.matahari?.target].filter(Boolean));
  const pecah = (o) => {
    if (kecuali.has(o) || o.isLight || o.isCamera) return [];
    if (!jalur.has(o)) return [o];
    return o === komisariat ? [] : o.children.flatMap(pecah);
  };
  const calon = new Set((sembunyikan ?? [v.scene]).flatMap(pecah));
  const sasaran = [...calon].filter((o) => { for (let p = o.parent; p; p = p.parent) if (calon.has(p)) return false; return true; });
  const bungkus = new Map(); // induk → pembungkus
  for (const o of sasaran) {
    let w = bungkus.get(o.parent);
    if (!w) {
      w = new THREE.Group();
      w.name = "kuis sembunyi";
      w.userData.nama = "kuis sembunyi";
      o.parent.add(w);
      bungkus.set(o.parent, w);
    }
    w.add(o);
  }
  for (const w of bungkus.values()) {
    daftarkan(w, "tampak", {
      mulai: m,
      sebelum: (acc) => { acc.opasitas = 1; },
      hitung(t, acc) { acc.opasitas = 1 - halus(rentang(t, m, m + 0.6)); },
    });
  }

  // Label yang sudah ada: yang berjangkar benda di dalam pembungkus ikut pudar sendiri (label3D mengalikan opasitas bendanya).
  // Sisanya dipudarkan lewat label.pengali: jangkar bukan Object3D (titik, fungsi) dan induk komisariat (mis. blok tanah).
  // Label berjangkar komisariat tetap. Dengan `sembunyikan` eksplisit, hanya label berjangkar induk komisariat yang ikut disebut.
  const eksplisit = sembunyikan != null;
  const pudarLabel = (t) => 1 - halus(rentang(t, m, m + 0.6));
  for (const l of v.label) {
    const p = l.pada;
    const kena = p?.isObject3D ? p !== komisariat && jalur.has(p) && (!eksplisit || sembunyikan.includes(p)) : !eksplisit;
    if (kena) { const asli = l.pengali; l.pengali = asli ? (t) => asli(t) * pudarLabel(t) : pudarLabel; }
  }

  // m + 0.0–0.6: komisariat mengecil ke `skala` dan abunya dilepas penuh. Abu disetel video tiap frame (aturan inti: keadaan
  // disetel setiap frame tanpa syarat); modul ini hanya mengalikannya dengan (1 − k) sesudah fungsi setiapFrame video.
  daftarkan(komisariat, "efek", {
    mulai: m,
    hitung(t, acc) {
      const k = halus(rentang(t, m, m + 0.6)), d = acc.dasar.skala;
      acc.skala.set(acc.skala.x * campur(1, skala / d.x, k), acc.skala.y * campur(1, skala / d.y, k), acc.skala.z * campur(1, skala / d.z, k));
    },
  });
  v.setiapFrame((t) => {
    const k = halus(rentang(t, m, m + 0.6));
    if (k > 0) setelKeadaan(komisariat, "abu", (komisariat.userData.keadaan?.abu ?? 0) * (1 - k));
  });

  // ---------------------------------------------------------------- m + 0.2–0.9: enam lengkung muncul berurutan (jeda 0.08)
  const lengkung = KELOMPOK.map(([, teks], i) => {
    const l = v.tambah(lengkungAudit({ label: teks, nama: `lengkung ${i + 1}` }));
    l.position.copy(P).add(titik(LENGKUNG.pertama + LENGKUNG.jarak * i, LENGKUNG.pertama + LENGKUNG.jarak * i));
    return l;
  });
  muncul(lengkung, { t: m + 0.2, durasi: 0.3, jeda: 0.08, selesai: m + 0.9 });

  // m + 0.4–1.6: lengkung kelompok video berdenyut.
  if (iKelompok >= 0) denyutCermin(lengkung[iKelompok], { mulai: m + 0.4, selesai: m + 1.6, periode: 0.6 });

  // ---------------------------------------------------------------- m + 1.0–2.6: komisariat meluncur P → E tanpa ayunan
  const induk = komisariat.parent;
  const lokal = (p) => (induk ? induk.worldToLocal(p.clone()) : p.clone());
  lintas(komisariat, { t: m + LUNCUR.mulai, durasi: LUNCUR.durasi, jalur: [lokal(P), lokal(E)], beku: false });
  // Setiap lengkung menyala saat pusat komisariat melewati bidangnya: lintas memakai masukKeluar3, jadi dibalik dengan bagi dua.
  const saatLewat = lengkung.map((_, i) => {
    const f = (LENGKUNG.pertama + LENGKUNG.jarak * i) / LENGKUNG.ujung;
    let a = 0, b = 1;
    for (let n = 0; n < 40; n++) { const tengah = (a + b) / 2; if (masukKeluar3(tengah) < f) a = tengah; else b = tengah; }
    return m + LUNCUR.mulai + LUNCUR.durasi * b;
  });
  lengkung.forEach((l, i) => catat({ t: saatLewat[i], jenis: "menyala", nada: i, posisi: l, sumber: namaBenda(l) }));
  daftarkanMandiri({
    perbarui(t) { lengkung.forEach((l, i) => setelKeadaan(l, "nyala", halus(rentang(t, saatLewat[i], saatLewat[i] + 0.25)))); },
  });

  // ---------------------------------------------------------------- m + 2.6–3.2: lembar laporan dari ujung terowongan ke atap; m + 3.2: emas
  const laporan = v.tambah(lembarKertas({ rebah: false, lebar: 0.8, panjang: 1.0, garis: 4, nama: "laporan" }));
  const awalLaporan = E.clone().add(titik(-0.6, -0.6, 1.0));
  laporan.position.copy(awalLaporan);
  muncul(laporan, { t: m + 2.6, durasi: 0.3, naik: 0 });
  const akhirLaporan = puncakAtap.clone();
  akhirLaporan.y += 0.5; // puncak atap + y 0.5
  lintas(laporan, { t: m + 2.6, durasi: 0.6, jalur: [awalLaporan, akhirLaporan], beku: false });
  klikEmas(laporan, { t: m + 3.2 });

  return { fokus, lengkung, laporan, P, E };
}

// akhiriEvidence: Bagian 4 dan 5 format evidence dalam satu panggilan di akhir adegan.js. Video tidak menulis apa pun lagi untuk
// kedua bagian itu. Urutannya persis pola tangan: segmenKuis (mulai dari v.format.waktu.kuis[0]), lalu jadwalEvidence dengan fokus
// kuis dari segmenKuis, lalu jadwal itu dipasang sebagai kamera video (v.aturKamera), jadi tidak perlu `let jadwal` dan opsi
// `kamera` di buatVideo. Panggil PALING AKHIR: sesudah semua benda, label, gerak, dan setiapFrame video dibuat.
// Opsi:
//   komisariat  Object3D komisariat (wajib), seperti segmenKuis
//   kelompok    lengkung kuis yang berdenyut: "kaderisasi" | "tata-kelola" | "pengetahuan" | "target-program" | "evaluasi-arsip" |
//               "data-jaringan"; null = tidak ada. Bawaan (tidak diisi): diturunkan dari `kategori` formatEvidence
//               (KADERISASI, TATA KELOLA, PENGETAHUAN, TARGET PROGRAM, EVALUASI DAN ARSIP, DATA DAN JARINGAN); kategori lain melempar galat.
//   kamera      opsi jadwalEvidence (fokus, awal, gejala, sebab, ikhtiar, tambahan, kuis, akhir). Kunci boleh memakai
//               { muat: [benda...], H } (lihat hMuat). Fokus kunci kuis sudah dari segmenKuis; kunci kuis dan akhir mengikuti
//               waktu format (kuis mulai..mulai+1, akhir mulai kartu akhir..+1.5), sama dengan bawaan jadwalEvidence pada waktu bawaan.
//   mulai, sembunyikan, skala   diteruskan ke segmenKuis (mulai bawaan v.format.waktu.kuis[0])
// Mengembalikan hasil segmenKuis ({ fokus, lengkung, laporan, P, E }) ditambah `jadwal`.
// Contoh: akhiriEvidence(v, { komisariat, kamera: { fokus: d.fokus, gejala: { muat: [gerbang, komisariat], H: 11 }, sebab: { muat: [komisariat] } } }).
export function akhiriEvidence(v, { komisariat, kelompok, kamera = {}, mulai, ...lain } = {}) {
  v ??= videoAktif("akhiriEvidence");
  const w = v.format?.waktu;
  if (!w?.kuis || !w?.akhir) throw new Error("[kit] akhiriEvidence: video harus memakai formatEvidence.");
  let slug = kelompok;
  if (slug === undefined) {
    const kategori = String(v.format.kategori ?? "").trim().replace(/\s+/g, " ").toUpperCase();
    slug = KELOMPOK.find(([, teks]) => teks === kategori)?.[0];
    if (!slug) {
      throw new Error(`[kit] akhiriEvidence: kategori ${JSON.stringify(v.format.kategori ?? "")} bukan salah satu kelompok kuis; isi opsi \`kelompok\` (${KELOMPOK.map(([k]) => k).join(", ")}, atau null).`);
    }
  }
  const m = mulai ?? w.kuis[0];
  const seg = segmenKuis(v, { komisariat, kelompok: slug, mulai: m, ...lain });
  const jadwal = jadwalEvidence({
    ...kamera,
    kuis: { t: [m, m + 1], fokus: seg.fokus, ...kamera.kuis },
    akhir: { t: [w.akhir[0], w.akhir[0] + 1.5], ...kamera.akhir },
  });
  v.aturKamera(jadwal);
  return { ...seg, jadwal };
}
