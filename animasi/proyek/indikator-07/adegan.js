// animasi/indikator-07: "Komisariat belum tumbuh di seluruh perguruan tinggi dalam satu kota."
// Video format indikator, 21 detik, 1080×1920. Tanpa dunia dasar: peta kota dari benda kit (gedungKelas, rumahKecil,
// pin, garisPutus, pion) ditambah benda lokal di benda-lokal.js. Penyimpangan dari brief ditandai "Brief:".
import * as THREE from "three";
import {
  buatVideo, formatIndikator, jadwalIndikator, fokusUntuk, titik, W, halus, rentang, masukKeluar3, acak,
  gedungKelas, pion, pin, garisPutus, setelKeadaan, catat,
  muncul, tumbuh, klikEmas, denyutCermin,
} from "../../kit/index.js";
import { komisariatHangat, garisAlas, ruasJalan, titikCahaya, jatuhMenancap, toleh } from "./benda-lokal.js";

// ---------------------------------------------------------------- teks (bagian E brief)
let jadwal = null;
const v = buatVideo({
  format: formatIndikator({
    nomor: "07", total: 44, kategori: "KADERISASI",
    judul: "Komisariat belum tumbuh di seluruh perguruan tinggi dalam satu kota.",
    cermin: "Kampus mana di kota kita yang belum punya komisariat?",
    langkah: "Petakan kampus di wilayah cabang, lalu sapa lewat kenalan kader.",
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- dunia (bagian F brief)
const XZ = (x, z, y = 0) => new THREE.Vector3(x, y, z);
const SKALA_KAMPUS = 0.6;
const ATAP = (2.2 + 0.1) * SKALA_KAMPUS; // tinggi atap gedungKelas skala 0.6

// Brief: kampus di titik(-3.5,-3.5), (0,-4.5), (3.5,-3.0), (-3.8,1.0), (0.5,0.5), (3.8,2.5). Pada H 16 lebar layar 9 unit,
// sedangkan gedung skala 0.6 selebar 2.1 unit di layar: kampus 4 dan 6 keluar tepi, kampus 2 masuk kabut atas.
// Susunan 3 + 2 baris dan urutannya dipertahankan, dirapatkan ke kolom r ±3.0 dan baris d −3.2…−4.0 / 1.2…2.3.
const POS_KAMPUS = [titik(-3.0, -3.2), titik(-0.2, -4.0), titik(2.9, -3.3), titik(-3.0, 1.9), titik(-0.3, 1.2), titik(3.0, 2.3)];
const kampus = POS_KAMPUS.map((p, i) => {
  const k = v.tambah(gedungKelas({ nama: `kampus ${i + 1}` }));
  k.position.copy(p);
  k.scale.setScalar(SKALA_KAMPUS);
  return k;
});
const [k1, k2, k3, k4, k5, k6] = kampus;
const TANPA = [k3, k4, k6]; // kampus tanpa komisariat

// Kampus tanpa komisariat: badan dan atap ke abuGelap (brief G), jendela ke abu; denyut Cermin di garis alasnya.
for (const k of TANPA) {
  k.userData.bagian.badan.material.userData.warnaAbu = W.abuGelap;
  const alas = garisAlas(3.0 + 0.4, 2.0 + 0.4);
  k.add(alas);
  // Denyut hanya di garis: garis alas dan rusuk gedung (brief B/G "denyut tepi", "garis alas"), tanpa emissive permukaan,
  // supaya gedung abu tidak tampak berubah hijau seperti sudah pulih.
  k.userData.bagian.tepi = [alas, ...k.userData.bagian.tepi];
  k.userData.bagian.denyut = [];
}

// Komisariat kecil di samping kampus 1, 2, 5: di sisi +x (kanan bawah layar), rata depan, celah 0.2.
const SAMPING = XZ(0.9 + 0.2 + 0.45, 0.19);
const komisariat = [k1, k2, k5].map((k, i) => {
  const m = v.tambah(komisariatHangat({ nama: `komisariat ${[1, 2, 5][i]}` }));
  m.position.copy(k.position).add(SAMPING);
  return m;
});
const kom5 = komisariat[2];
// Selama Cermin kamera mendekat ke kampus 3, 4, 6: kampus dan komisariat lain boleh terpotong tepi atas.
for (const b of [k1, k2, k5, ...komisariat]) b.userData.penting = (t) => !(t > 6.0 && t < 13.0);

// Jalan kota: grid jalan sejajar sumbu dunia (diagonal di layar, searah garis grid tanah), di celah antarbangunan.
const JALAN = [
  [XZ(-6.4, -1.6), XZ(4.3, -1.6)],  // A: di belakang baris bawah
  [XZ(-4.6, 2.25), XZ(3.6, 2.25)],  // B: di depan kampus 5
  [XZ(-0.6, -3.65), XZ(-0.6, 2.25)], // C: dari depan kampus 3 ke jalan B
  [XZ(-2.2, -1.6), XZ(-2.2, 4.4)],  // D: di antara komisariat 1 dan kampus 4
  [XZ(2.25, -4.3), XZ(2.25, 0.55)], // E: di antara kampus 3 dan kampus 6
];
const jalan = JALAN.map(([a, b], i) => v.tambah(ruasJalan(a, b, { nama: `jalan ${i + 1}` })));

// Pion kecil tanpa tujuan di sekitar kampus tanpa komisariat (2 di kampus 4, 1 di kampus 3, 1 di kampus 6).
const r = acak(7);
const POS_PION = [
  { di: k3, p: XZ(0.95, -3.45) },
  { di: k4, p: XZ(0.75, 3.05) },
  { di: k4, p: XZ(-0.55, 4.6) },
  { di: k6, p: XZ(4.95, 0.35) },
];
const figur = POS_PION.map(({ p }, i) => {
  const f = v.tambah(pion({ skala: 0.55, nama: `mahasiswa ${i + 1}` }));
  f.position.copy(p);
  f.rotation.y = r() * Math.PI * 2;
  return f;
});

// Pin di atap kampus 3, 4, 6 (titik asal di ujung bawah pin).
const pins = TANPA.map((k, i) => v.tambah(pin({ nama: `pin ${i + 1}` })));
const ATAS_KAMPUS = TANPA.map((k) => k.position.clone().setY(ATAP));
pins.forEach((p, i) => p.position.copy(ATAS_KAMPUS[i]));

// Titik cahaya kecil di samping ketiga kampus (tempat komisariat baru kelak), di sisi +x seperti komisariat lain.
const cahaya = TANPA.map((k, i) => {
  const c = v.tambah(titikCahaya({ nama: `titik cahaya ${i + 1}` }));
  c.position.copy(k.position).add(i === 2 ? XZ(0.2, 1.0) : SAMPING);
  return c;
});

// garisKenal: garis putus zamrudPijar dari puncak komisariat kampus 5 ke tiap pin, melengkung di atas atap.
const AWAL_KENAL = kom5.position.clone().setY(kom5.userData.atas + 0.05);
const garisKenal = ATAS_KAMPUS.map((a, i) => {
  const ujung = a.clone().setY(ATAP + 0.62);
  const tengah = AWAL_KENAL.clone().lerp(ujung, 0.5);
  tengah.y = Math.max(AWAL_KENAL.y, ujung.y) + 0.6 + 0.08 * AWAL_KENAL.distanceTo(ujung);
  const g = v.tambah(garisPutus({ titik: [AWAL_KENAL, tengah, ujung], lengkung: true, nama: `garis kenal ${i + 1}` }));
  g.userData.aturTampak(0);
  // kotakLayar memproyeksikan 8 sudut kotak AABB lengkungnya, sehingga garis diagonal tampak keluar zona padahal tidak.
  // Ujung garis (komisariat dan pin) sudah diperiksa sendiri.
  g.userData.abaikanZona = true;
  return g;
});

// ---------------------------------------------------------------- kamera (bagian C)
// Brief Cermin: fokus sekitar titik(1.2, 0.6), H 13. Kampus 3, 4, 6 tersebar dari tepi kiri ke tepi kanan peta, jadi pada
// H 13 kampus 4 keluar layar. Fokus dihitung supaya ketiganya (dengan pion) muat di tengah zona; H sekecil yang masih muat.
const H_CERMIN = 15.5;
const PETA = [...kampus, ...komisariat, ...ATAS_KAMPUS.map((a) => a.clone().setY(ATAP + 0.85))];
const FOKUS = fokusUntuk(PETA);
jadwal = jadwalIndikator({
  fokus: FOKUS,
  cermin: { fokus: fokusUntuk([...TANPA, ...figur], { H: H_CERMIN }), H: H_CERMIN },
  langkah: { fokus: FOKUS },
});

// ---------------------------------------------------------------- Bagian 1, Gejala (0.6–6.0)
// 0.6–2.4: jalan tergambar dari pangkalnya, lalu keenam kampus muncul berurutan.
tumbuh(jalan, { t: 0.6, durasi: 0.35, jeda: 0.12, sumbu: "x", bunyi: { kuat: 0.4 } });
muncul(kampus, { t: 0.9, selesai: 2.4 });

// 2.4–3.6: komisariat kecil muncul di samping kampus 1, 2, 5; jendelanya menyala hangat redup.
const T_KOM = muncul(komisariat, { t: 2.4, selesai: 3.6, durasi: 0.45 });
const T_LAMPU = T_KOM.map(({ mulai }) => mulai + 0.2);
T_LAMPU.forEach((t, i) => catat({ t, jenis: "menyala", kuat: 0.4, nada: i, posisi: komisariat[i], sumber: komisariat[i].userData.nama }));

// 3.6–6.0: kampus 3, 4, 6 berubah abuGelap; empat pion kecil berdiri diam di sekitarnya.
const T_ABU = [3.7, 3.95, 4.2];
T_ABU.forEach((t, i) => catat({ t, jenis: "padam", kuat: 0.55, nada: -i, posisi: TANPA[i], sumber: TANPA[i].userData.nama }));
muncul(figur, { t: 4.7, jeda: 0.14, durasi: 0.4, naik: 0.3, bunyi: { kuat: 0.35 } });

// ---------------------------------------------------------------- Bagian 2, Cermin (6.0–12.0)
denyutCermin(TANPA, { mulai: 7.0, selesai: 11.8, bunyi: false });
// Satu dengung denyut di tengah stereo (ketiga kampus tersebar kiri dan kanan), bukan di kampus 3 saja.
catat({ t: 7.0, jenis: "denyut", durasi: 4.8, periode: 1.2, x: 0.5, sumber: "kampus tanpa komisariat" });

// ---------------------------------------------------------------- Bagian 3, Langkah (12.0–18.0)
// 12.4–13.6: pin jatuh menancap di atap kampus 3, 4, 6 dengan pantulan kecil.
const T_PIN = [12.4, 12.75, 13.1];
pins.forEach((p, i) => {
  muncul(p, { t: T_PIN[i], durasi: 0.12, naik: 0, skala: 1, bunyi: false });
  const tiba = jatuhMenancap(p, { t: T_PIN[i], ke: ATAS_KAMPUS[i] });
  catat({ t: T_PIN[i], jenis: "whoosh", durasi: tiba - T_PIN[i], kuat: 0.3, posisi: p, sumber: p.userData.nama });
  p.userData.penting = (t) => t < T_PIN[i] || t >= tiba; // selama jatuh pin melintas di kabut atas
  catat({ t: tiba, jenis: "mendarat", kuat: 0.6, nada: i, posisi: ATAS_KAMPUS[i], sumber: p.userData.nama });
});

// 13.6–15.0: garisKenal tergambar dari komisariat kampus 5 ke tiap pin, masing-masing 0.4 s; pion di kampus itu menoleh ke pin.
const T_GARIS = [13.6, 14.1, 14.6];
garisKenal.forEach((g, i) => catat({ t: T_GARIS[i], jenis: "garis-sambung", durasi: 0.4, nada: i, posisi: AWAL_KENAL, posisiAkhir: pins[i], sumber: g.userData.nama }));
POS_PION.forEach(({ di }, j) => {
  const i = TANPA.indexOf(di);
  const t = T_GARIS[i] + 0.4 + 0.08 * POS_PION.filter((q, n) => n < j && q.di === di).length;
  toleh(figur[j], { t, ke: ATAS_KAMPUS[i] });
  catat({ t, jenis: "langkah", kuat: 0.3, posisi: figur[j], sumber: figur[j].userData.nama });
});

// 15.0–16.0: titik cahaya kecil menyala di samping ketiga kampus, lalu ketiga pin berubah emas (klik emas).
muncul(cahaya, { t: 15.0, jeda: 0.12, durasi: 0.3, naik: 0, skala: 0.3, bunyi: { jenis: "menyala", kuat: 0.45 } });
klikEmas(pins, { t: 15.45, jeda: 0.15 });

// ---------------------------------------------------------------- keadaan per frame (tanpa syarat)
v.setiapFrame((t) => {
  komisariat.forEach((m, i) => setelKeadaan(m, "lampu", halus(rentang(t, T_LAMPU[i], T_LAMPU[i] + 0.3))));
  TANPA.forEach((k, i) => setelKeadaan(k, "abu", halus(rentang(t, T_ABU[i], T_ABU[i] + 0.6))));
  // Garis kenal: tergambar 0.4 s; sesudah ketiganya tersambung, ruasnya berjalan pelan dari komisariat ke pin, berhenti 18.0.
  const geser = 0.35 * Math.max(0, Math.min(t, 18) - 15.0);
  garisKenal.forEach((g, i) => {
    g.userData.geser(geser);
    g.userData.aturTampak(masukKeluar3(rentang(t, T_GARIS[i], T_GARIS[i] + 0.4)));
  });
});
