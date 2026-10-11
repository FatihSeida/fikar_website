// Dunia Jenjang: tiga komisariat kecil di kiri depan, gedung cabang di kiri belakang, menara badko di tengah,
// menara PB di kanan depan, dan jembatan tabung (y 0.3) dari setiap jenjang ke jenjang di atasnya. KONTRAK.md §7.
// Kunci benda, titik, opsi, dan penyimpangan dari prompt: docs/dunia-kader-jenjang-simpul.md.
//
//   const d = duniaJenjang(v, { opsi: { jembatanCabang: { retak: true } } });   // jembatan cabang → badko retak
//   d.benda.komisariat1..3, .cabang, .badko, .pb
//   d.benda.jembatanKomisariat1..3 (komisariat → cabang), .jembatanCabang (cabang → badko), .jembatanBadko (badko → pb)
//   aliran({ jalur: d.jalur("komisariat1", "cabang", "badko", "pb"), mulai, selesai })  // lewat beberapa jembatan
//   aliran({ jalur: d.jalur("cabang", "badko"), mulai, selesai })                         // satu jembatan
// d.jalur berada di atas tabung (bola aliran terlihat). d.titik.jalurJembatan, tengahJembatan, dan retak berada di sumbu
// tabung (y 0.3): untuk letak label, bunyi, dan benda, bukan untuk aliran.
//
// Menara PB setinggi 6 unit memakan hampir seluruh tinggi zona adegan (7 unit layar pada H 16), jadi alasnya harus
// di dekat tepi bawah zona: PB tidak bisa berada "jauh di kanan atas" seperti di prompt. Tata letak kit: komisariat di
// kiri depan, cabang di kiri belakang, badko di tengah, PB di kanan depan. Puncak keempat jenjang naik dari kiri ke
// kanan, dan jembatan cabang → badko (yang retak di indikator 05) tidak tertutup benda lain.
import * as THREE from "three";
import { titik } from "../inti/ruang.js";
import { rumahKecil, gedungCabang, menaraBadko, menaraPB } from "../benda/bangunan.js";
import { jembatanTabung } from "../benda/medan.js";
import { susunDunia, luaskan } from "./_susun.js";

const TATA = {
  komisariat1: titik(-2.6, 3.1),
  komisariat2: titik(-1.0, 3.4),
  komisariat3: titik(-3.55, 2.0),
  cabang: titik(-2.85, -1.0), // jauh di belakang badko: jembatan cabang → badko ±1.8 unit, retak dan tumpukan terbaca
  badko: titik(0.3, 0.85),
  pb: titik(3.0, 2.6),
  fokus: titik(0, 0, 1.2), // = prompt
};
const Y_JEMBATAN = 0.3;
// Letak lembar melayang tiap bangunan (d.titik.samping): [jenis, y, geser]. "atap": y di atas bubungan, digeser
// `geser` (titik tanah) bila ada; "kanan": di kanan bangunan (geser titik(1.1, 0)), komisariat2 tidak boleh menutupi
// jembatan cabang → badko di atasnya; "muka": `geser` (bawaan 0.5) di depan muka +x; "sudut": di depan sudut terdepan.
// Komisariat1: jembatan komisariat → cabang tampak di atas atapnya, jadi lembarnya melayang lebih tinggi di atas
// jembatan itu (0.9 ke belakang, 1.3 di atas bubungan), dan lembar cabang 0.8 di depan mukanya supaya keduanya tidak berimpit.
const SAMPING = {
  komisariat1: ["atap", 1.3, titik(0, -0.9)], komisariat2: ["kanan", 1.45], komisariat3: ["atap", 0.65],
  cabang: ["muka", 1.9, 0.8], badko: ["sudut", 2.0], pb: ["sudut", 2.6],
};
const BANGUNAN = ["komisariat1", "komisariat2", "komisariat3", "cabang", "badko", "pb"];
// Jembatan dinamai menurut jenjang bawahnya: jembatanX menghubungkan X ke jenjang di atasnya.
const JEMBATAN = [
  ["jembatanKomisariat1", "komisariat1", "cabang"],
  ["jembatanKomisariat2", "komisariat2", "cabang"],
  ["jembatanKomisariat3", "komisariat3", "cabang"],
  ["jembatanCabang", "cabang", "badko"],
  ["jembatanBadko", "badko", "pb"],
];

// Nama kelompok di `tanpa` dan `opsi` berlaku untuk semua anggotanya, dan opsi anggota menimpa opsi kelompok:
// "komisariat" → komisariat1..3 (luaskan bersama dari _susun.js), "jembatan" → kelima jembatan (namanya bukan
// jembatan1..5, jadi diluaskan di sini dengan aturan yang sama).
const NAMA_JEMBATAN = JEMBATAN.map((j) => j[0]);
function luaskanJembatan(opsiVideo) {
  const { tanpa = [], opsi = {} } = opsiVideo;
  const o = { ...opsi };
  if (opsi.jembatan) for (const a of NAMA_JEMBATAN) o[a] = { ...opsi.jembatan, ...opsi[a] };
  return { ...opsiVideo, tanpa: tanpa.flatMap((n) => (n === "jembatan" ? NAMA_JEMBATAN : [n])), opsi: o };
}

// Kotak tapak bangunan (dunia): badan/dinding bila ada, selain itu seluruh benda.
function tapak(b) {
  const bag = b.userData.bagian ?? {};
  const isi = [].concat(bag.badan ?? bag.dinding ?? b);
  const k = new THREE.Box3();
  for (const m of isi) k.expandByObject(m);
  return k;
}
// Titik keluar ruas a → b dari kotak tapak (bidang xz), digeser `masuk` ke dalam dinding.
function tepiTapak(kotak, a, b, masuk = 0.03) {
  const d = b.clone().sub(a).setY(0);
  const L = d.length();
  d.divideScalar(L || 1);
  let s = Infinity;
  for (const [ax, lo, hi] of [["x", kotak.min.x, kotak.max.x], ["z", kotak.min.z, kotak.max.z]]) {
    if (Math.abs(d[ax]) < 1e-6) continue;
    const batas = d[ax] > 0 ? hi : lo;
    s = Math.min(s, (batas - a[ax]) / d[ax]);
  }
  return a.clone().addScaledVector(d, Math.max(0, s - masuk));
}

// opsi: tanpa, posisi, opsi, ganti (KONTRAK §7), dengan nama kelompok "jembatan" dan "komisariat".
//   Contoh: opsi: { jembatanCabang: { retak: true } } — jembatan cabang → badko dimulai dalam keadaan retak;
//   retak bisa diatur setiap frame lewat d.benda.jembatanCabang.userData.aturRetak(k).
export function duniaJenjang(v, opsi = {}) {
  const o = luaskanJembatan(luaskan(opsi, { komisariat: 3 }));
  const resep = [
    ...["komisariat1", "komisariat2", "komisariat3"].map((n) => ({
      nama: n, buat: (op) => rumahKecil({ nama: n, ...op }), posisi: TATA[n],
    })),
    { nama: "cabang", buat: (op) => gedungCabang({ nama: "cabang", ...op }), posisi: TATA.cabang },
    { nama: "badko", buat: (op) => menaraBadko({ nama: "badko", ...op }), posisi: TATA.badko },
    { nama: "pb", buat: (op) => menaraPB({ nama: "pb", ...op }), posisi: TATA.pb },
    // Ujung jembatan di dinding kedua bangunan (sesudah posisi/ganti diterapkan). Grup diletakkan di tengah jembatan
    // (titik lokal relatif terhadapnya), supaya skala muncul dan lonjakan klikEmas berporos di tengah jembatan,
    // bukan di titik asal dunia. Karena itu userData.jalur jembatan berupa titik lokal: pakai d.titik.jalurJembatan.
    ...JEMBATAN.map(([n, bawah, atas]) => ({
      nama: n,
      buat: (op, b) => {
        if (!b[bawah] || !b[atas]) return new THREE.Group(); // pasangan tidak lengkap: jembatan kosong
        const a = b[bawah].position.clone().setY(Y_JEMBATAN), c = b[atas].position.clone().setY(Y_JEMBATAN);
        const dari = tepiTapak(tapak(b[bawah]), a, c), ke = tepiTapak(tapak(b[atas]), c, a);
        const tengah = dari.clone().lerp(ke, 0.5);
        const j = jembatanTabung({ dari: dari.sub(tengah), ke: ke.sub(tengah), nama: n, ...op });
        j.position.copy(tengah);
        return j;
      },
    })),
  ];
  // Jembatan yang salah satu ujungnya ditiadakan juga ditiadakan.
  const tanpa = new Set(o.tanpa);
  for (const [n, bawah, atas] of JEMBATAN) if (tanpa.has(bawah) || tanpa.has(atas)) tanpa.add(n);
  const { benda } = susunDunia(v, resep, { ...o, tanpa: [...tanpa] });

  // ---------------------------------------------------------------- titik bernama (dunia)
  const T = { atas: {}, samping: {}, depanPintu: {}, tengahJembatan: {}, jalurJembatan: {} };
  for (const n of BANGUNAN) {
    const b = benda[n];
    if (!b) continue;
    const tinggi = new THREE.Box3().setFromObject(b).max.y;
    const p = b.position;
    T.atas[n] = new THREE.Vector3(p.x, tinggi, p.z);
    if (b.userData.depanPintu) T.depanPintu[n] = b.localToWorld(b.userData.depanPintu.clone());
    // Samping: pusat lembar melayang (0.8 × 1.0) milik bangunan ini, dipilih supaya keenam lembar tidak saling
    // menutupi dan tidak menutupi jembatan mana pun (lihat SAMPING).
    const t = tapak(b);
    const [jenis, y, geser] = SAMPING[n];
    T.samping[n] = jenis === "atap" ? p.clone().add(geser ?? new THREE.Vector3()).setY(tinggi + y)
      : jenis === "kanan" ? p.clone().add(titik(1.1, 0)).setY(y)
      : jenis === "muka" ? new THREE.Vector3(t.max.x + (geser ?? 0.5), y, p.z)
      : new THREE.Vector3(t.max.x, y, t.max.z).add(titik(0, 0.5));
  }
  for (const [n] of JEMBATAN) {
    const j = benda[n];
    if (!j?.userData.jalur) continue;
    T.jalurJembatan[n] = j.userData.jalur.map((q) => j.localToWorld(q.clone())); // [bawah, atas], dunia
    T.tengahJembatan[n] = T.jalurJembatan[n][0].clone().lerp(T.jalurJembatan[n][1], 0.5);
  }
  if (T.tengahJembatan.jembatanCabang) T.retak = T.tengahJembatan.jembatanCabang.clone();

  // Jalur aliran lewat jembatan antarbangunan yang berurutan, ke atas atau ke bawah jenjang:
  //   d.jalur("komisariat1", "cabang", "badko", "pb"), d.jalur("pb", "badko", "cabang", "komisariat2").
  // Setiap dua nama berurutan harus dihubungkan satu jembatan (cabang → pb langsung tidak sah).
  // Mengembalikan THREE.CurvePath dari ruas lurus; ruas di antara dua jembatan melintas di dalam bangunan (tak tampak).
  // Opsi di akhir: { angkat } = tinggi jalur di atas sumbu tabung. Bawaan jari-jari tabung + 0.06 (0.12 pada tabung
  // bawaan): bola aliran r 0.07 meluncur di atas tabung. angkat: 0 = sumbu tabung, sama dengan d.titik.jalurJembatan.
  function jalur(...nama) {
    const { angkat } = typeof nama.at(-1) === "object" ? nama.pop() ?? {} : {};
    const p = [];
    for (let i = 1; i < nama.length; i++) {
      const e = JEMBATAN.find(([, a, b]) => (a === nama[i - 1] && b === nama[i]) || (b === nama[i - 1] && a === nama[i]));
      const ruas = e && T.jalurJembatan[e[0]];
      if (!ruas) throw new Error(`[kit] duniaJenjang.jalur: tidak ada jembatan ${nama[i - 1]} → ${nama[i]}`);
      const dy = angkat ?? (benda[e[0]].userData.radius ?? 0.06) + 0.06;
      const [a, b] = ruas.map((q) => q.clone().setY(q.y + dy));
      p.push(...(e[1] === nama[i - 1] ? [a, b] : [b, a]));
    }
    const kurva = new THREE.CurvePath();
    for (let i = 1; i < p.length; i++) kurva.add(new THREE.LineCurve3(p[i - 1], p[i]));
    return kurva;
  }

  // Urutan muncul wajar: dari komisariat ke PB, setiap jembatan sesudah kedua ujungnya.
  const urutan = ["komisariat1", "komisariat2", "komisariat3", "cabang", "jembatanKomisariat1", "jembatanKomisariat2",
    "jembatanKomisariat3", "badko", "jembatanCabang", "pb", "jembatanBadko"].map((n) => benda[n]).filter(Boolean);

  return { benda, urutan, fokus: TATA.fokus.clone(), H: 16, titik: T, jalur };
}
