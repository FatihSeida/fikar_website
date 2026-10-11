// Kamera ortografis isometrik: azimut 45°, elevasi 35.26°, tidak pernah berputar.
// Yang berubah hanya tinggi frustum H (unit dunia yang tampak dari atas ke bawah layar) dan titik fokus.
// Titik fokus selalu jatuh di piksel `piksel` (bawaan format indikator: 540, 1010).
import * as THREE from "three";
import { DEG, ISO, titik, keLayar, kotakLayar } from "./ruang.js";
import { campur, rentang, masukKeluar3 } from "./waktu.js";
import { videoAktif } from "./aktif.js";

export function buatKamera({ ukuran, piksel, azimut = 45, elevasi = ISO, jarak = 150 } = {}) {
  const { lebar, tinggi } = ukuran;
  const px = piksel ?? { x: lebar / 2, y: tinggi / 2 };
  const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, jarak + 350);
  const arah = new THREE.Vector3(
    Math.cos(elevasi * DEG) * Math.sin(azimut * DEG), Math.sin(elevasi * DEG), Math.cos(elevasi * DEG) * Math.cos(azimut * DEG),
  );
  const keadaan = { H: 16, fokus: new THREE.Vector3(), piksel: { ...px } };

  // k: { H, fokus: Vector3, piksel? }
  function atur(k) {
    const p = k.piksel ?? px;
    keadaan.H = k.H; keadaan.fokus.copy(k.fokus); keadaan.piksel = p;
    kamera.position.copy(k.fokus).addScaledVector(arah, jarak);
    kamera.up.set(0, 1, 0);
    kamera.lookAt(k.fokus);
    const lebarDunia = k.H * lebar / tinggi;
    kamera.top = k.H * p.y / tinggi;
    kamera.bottom = -k.H * (1 - p.y / tinggi);
    kamera.left = -lebarDunia * p.x / lebar;
    kamera.right = lebarDunia * (1 - p.x / lebar);
    kamera.updateProjectionMatrix();
    kamera.updateMatrixWorld();
  }
  return { kamera, atur, keadaan, piksel: px, azimut, elevasi };
}

// Titik fokus yang menaruh kotak layar benda (gabungan, seperti periksaZona) tepat di tengah zona adegan pada tinggi
// frustum H. benda: Object3D, Vector3, atau array campuran; posisinya dibaca saat fungsi dipanggil (posisi dasar).
// Opsi: H (bawaan 16), zona (bawaan zona video), piksel (bawaan piksel fokus format), y (tinggi titik fokus, bawaan 0:
// titik tanah di piksel fokus, tempat pudar tanah dan kotak bayangan berpusat). Kamera ortografis, jadi semua titik di
// sepanjang arah pandang memberi gambar yang sama; y hanya memilih salah satunya.
// Contoh: jadwalIndikator({ fokus: fokusUntuk(d.urutan), cermin: { fokus: fokusUntuk(badko, { H: 12 }), H: 12 } }).
export function fokusUntuk(benda, { H = 16, zona, piksel, y = 0 } = {}) {
  const v = videoAktif("fokusUntuk");
  zona = zona ?? v.zona;
  piksel = piksel ?? v.rig.piksel;
  const daftar = (Array.isArray(benda) ? benda : [benda]).filter(Boolean);
  const dunia = new THREE.Box3();
  for (const b of daftar) {
    if (b.isVector3) dunia.expandByPoint(b);
    else { b.updateWorldMatrix(true, true); dunia.expandByObject(b); }
  }
  if (dunia.isEmpty()) throw new Error("[kit] fokusUntuk: tidak ada benda atau titik.");
  const f0 = dunia.getCenter(new THREE.Vector3());
  const rig = buatKamera({ ukuran: v.ukuran, piksel, azimut: v.rig.azimut, elevasi: v.rig.elevasi });
  rig.atur({ H, fokus: f0 });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const b of daftar) {
    let k;
    if (b.isVector3) { const p = keLayar(b, rig.kamera, v.ukuran); k = { x0: p.x, x1: p.x, y0: p.y, y1: p.y }; }
    else k = kotakLayar(b, rig.kamera, v.ukuran);
    if (!k) continue;
    x0 = Math.min(x0, k.x0); y0 = Math.min(y0, k.y0); x1 = Math.max(x1, k.x1); y1 = Math.max(y1, k.y1);
  }
  if (x0 === Infinity) throw new Error("[kit] fokusUntuk: benda tidak punya bagian yang tampak.");
  const s = v.ukuran.tinggi / H; // piksel per unit
  if (x1 - x0 > zona.x1 - zona.x0 || y1 - y0 > zona.y1 - zona.y0) {
    console.warn(`[kit] fokusUntuk: benda ${Math.round(x1 - x0)}×${Math.round(y1 - y0)} px tidak muat di zona ${zona.x1 - zona.x0}×${zona.y1 - zona.y0} px pada H ${H}.`);
  }
  // Menggeser fokus sejauh δ di sumbu kanan kamera menggeser gambar −δ·s piksel; di sumbu atas kamera, +δ·s piksel ke bawah.
  const e = rig.kamera.matrixWorld.elements;
  const kanan = new THREE.Vector3(e[0], e[1], e[2]), atas = new THREE.Vector3(e[4], e[5], e[6]), arah = new THREE.Vector3(e[8], e[9], e[10]);
  const f = f0.clone()
    .addScaledVector(kanan, -((zona.x0 + zona.x1) / 2 - (x0 + x1) / 2) / s)
    .addScaledVector(atas, ((zona.y0 + zona.y1) / 2 - (y0 + y1) / 2) / s);
  // Geser di sepanjang arah pandang (gambar tetap) sampai tinggi y.
  return f.addScaledVector(arah, (y - f.y) / arah.y);
}

// H terkecil (dibulatkan ke atas, kelipatan 0.01) di mana kotak layar benda (gabungan, seperti fokusUntuk) muat di zona
// adegan. Dihitung langsung: pada kamera ortografis ukuran kotak berbanding terbalik dengan H, jadi tidak perlu coba-coba.
// benda: Object3D, Vector3, atau array campuran, dibaca pada posisi dasarnya saat dipanggil (sama dengan fokusUntuk).
// Opsi:
//   fokus   Vector3 tetap. Tanpa fokus, kotak ditengahkan di zona (cocok dengan fokusUntuk(benda, { H })). Dengan fokus,
//           kamera tetap di titik itu (seperti kunci jadwalEvidence yang memberi fokus sendiri), jadi kotak juga menggeser
//           ke arah luar saat H mengecil; benda yang tidak bisa muat pada H berapa pun melempar galat.
//   margin  sisa ruang dalam piksel di tiap sisi zona (bawaan 0)
//   zona, piksel   seperti fokusUntuk
// Contoh: const H = hMuat([gerbang, komisariat]); fokusUntuk([gerbang, komisariat], { H }) tidak memberi peringatan.
export function hMuat(benda, { fokus, margin = 0, zona, piksel } = {}) {
  const v = videoAktif("hMuat");
  zona = zona ?? v.zona;
  piksel = piksel ?? v.rig.piksel;
  const daftar = (Array.isArray(benda) ? benda : [benda]).filter(Boolean);
  const dunia = new THREE.Box3();
  for (const b of daftar) {
    if (b.isVector3) dunia.expandByPoint(b);
    else { b.updateWorldMatrix(true, true); dunia.expandByObject(b); }
  }
  if (dunia.isEmpty()) throw new Error("[kit] hMuat: tidak ada benda atau titik.");
  // Kotak layar pada H0 yang bebas dipilih: semua panjang layar sebanding dengan 1/H, titik fokus tetap di piksel fokus.
  const H0 = 16;
  const rig = buatKamera({ ukuran: v.ukuran, piksel, azimut: v.rig.azimut, elevasi: v.rig.elevasi });
  rig.atur({ H: H0, fokus: fokus ?? dunia.getCenter(new THREE.Vector3()) });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const b of daftar) {
    let k;
    if (b.isVector3) { const p = keLayar(b, rig.kamera, v.ukuran); k = { x0: p.x, x1: p.x, y0: p.y, y1: p.y }; }
    else k = kotakLayar(b, rig.kamera, v.ukuran);
    if (!k) continue;
    x0 = Math.min(x0, k.x0); y0 = Math.min(y0, k.y0); x1 = Math.max(x1, k.x1); y1 = Math.max(y1, k.y1);
  }
  if (x0 === Infinity) throw new Error("[kit] hMuat: benda tidak punya bagian yang tampak.");
  const zx0 = zona.x0 + margin, zx1 = zona.x1 - margin, zy0 = zona.y0 + margin, zy1 = zona.y1 - margin;
  // r = pembesaran terbesar dari kotak pada H0 yang masih muat; H = H0 / r.
  let rMaks = Infinity, rMin = 0;
  if (fokus) {
    // Kamera tetap di fokus: tepi kotak berjarak a dari piksel fokus menjadi a·r. Tiap tepi memberi syarat c ≤ k·r.
    const syarat = (k, c) => {
      if (k > 0) rMin = Math.max(rMin, c / k);
      else if (k < 0) rMaks = Math.min(rMaks, c / k);
      else if (c > 0) rMaks = -1; // tepi tepat di piksel fokus, tetapi zona tidak memuat piksel itu
    };
    syarat(x0 - piksel.x, zx0 - piksel.x); syarat(piksel.x - x1, piksel.x - zx1); // kiri ≥ zx0, kanan ≤ zx1
    syarat(y0 - piksel.y, zy0 - piksel.y); syarat(piksel.y - y1, piksel.y - zy1); // atas ≥ zy0, bawah ≤ zy1
  } else {
    if (x1 > x0) rMaks = Math.min(rMaks, (zx1 - zx0) / (x1 - x0));
    if (y1 > y0) rMaks = Math.min(rMaks, (zy1 - zy0) / (y1 - y0));
  }
  if (rMaks === Infinity) return 0; // titik tunggal atau kotak yang muat pada H berapa pun
  if (!(rMaks > 0) || rMaks < rMin) throw new Error("[kit] hMuat: benda tidak bisa muat di zona pada H berapa pun dengan fokus itu.");
  return Math.ceil((H0 / rMaks) * (1 + 1e-9) * 100) / 100;
}

// Kunci kamera evidence boleh berbentuk { muat: [benda...], H?, margin?, fokus? }: H = max(H yang diberi atau bawaan kunci,
// hMuat(muat)), dan fokus = fokusUntuk(muat, { H }), kecuali `fokus` diberikan sendiri (kamera tetap di sana, H dihitung
// untuk fokus itu). Kunci tanpa `muat` dikembalikan apa adanya. H0 = H bila kunci tidak memberi H.
function kunciMuat(k, H0) {
  if (!k?.muat) return k;
  const { muat, margin, ...sisa } = k;
  const H = Math.max(k.H ?? H0, hMuat(muat, { fokus: k.fokus, margin }));
  if (!(H > 0)) throw new Error("[kit] jadwalEvidence: kunci dengan `muat` butuh H, atau benda yang punya ukuran (satu titik tidak menentukan H).");
  return { ...sisa, H, fokus: k.fokus ?? fokusUntuk(muat, { H }) };
}

// Jadwal kamera dari keyframe. Tiap kunci membaur dari keadaan sebelumnya ke sasarannya selama t[0]..t[1].
//   awal:  { H, fokus }
//   kunci: [{ t: [a, b], H?, fokus?, naik?, kurva? }]   naik = geser fokus ke atas (y) relatif terhadap fokus sebelumnya.
// Mengembalikan fungsi t → { H, fokus }.
export function jadwalKamera({ awal = {}, kunci = [], kurva = masukKeluar3 } = {}) {
  const H0 = awal.H ?? 16;
  const f0 = (awal.fokus ?? titik(0, 0)).clone();
  // Sasaran tiap kunci dihitung sekali dari kunci sebelumnya (naik bersifat relatif).
  let fPrev = f0, HPrev = H0;
  const daftar = kunci.map((k) => {
    const fokus = k.fokus ? k.fokus.clone() : fPrev.clone();
    if (k.naik) fokus.y += k.naik;
    const H = k.H ?? HPrev;
    fPrev = fokus; HPrev = H;
    return { a: k.t[0], b: k.t[1], H, fokus, kurva: k.kurva ?? kurva };
  });
  const f = new THREE.Vector3();
  return (t) => {
    let H = H0;
    f.copy(f0);
    for (const k of daftar) {
      const w = k.kurva(rentang(t, k.a, k.b));
      if (w <= 0) continue;
      H = campur(H, k.H, w);
      f.lerp(k.fokus, w);
    }
    return { H, fokus: f };
  };
}

// Preset jadwal bagian C.6 prompt indikator (semua masukKeluar3):
//   0.0–1.2  tinggi 19 → 16, fokus `fokus` (bawaan titik(0, 0))
//   6.0–7.0  tinggi 16 → 12, fokus pindah ke benda cermin
//   12.0–13.0 tinggi kembali 16, fokus kembali (atau ke fokus langkah)
//   18.0–19.5 tinggi 16 → 21, fokus naik 0.8 unit
// Setiap bagian bisa diganti: { cermin: { fokus, H, t }, langkah: { fokus, H, t }, akhir: { H, naik, t }, awal: { H } }.
export function jadwalIndikator({ fokus = titik(0, 0), awal = {}, buka = {}, cermin = {}, langkah = {}, akhir = {} } = {}) {
  return jadwalKamera({
    awal: { H: awal.H ?? 19, fokus },
    kunci: [
      { t: buka.t ?? [0, 1.2], H: buka.H ?? 16, fokus: buka.fokus ?? fokus },
      { t: cermin.t ?? [6, 7], H: cermin.H ?? 12, fokus: cermin.fokus ?? fokus },
      { t: langkah.t ?? [12, 13], H: langkah.H ?? 16, fokus: langkah.fokus ?? fokus },
      { t: akhir.t ?? [18, 19.5], H: akhir.H ?? 21, fokus: akhir.fokus, naik: akhir.naik ?? 0.8 },
    ],
  });
}

// Jadwal kamera format evidence (Prompt 00 bagian C), dibangun di atas jadwalKamera. Semua kunci masukKeluar3:
//   awal     H 13, fokus `fokus`
//   gejala   t 0–1.2,    H 11
//   sebab    t 6.0–7.0,  H 8
//   ikhtiar  t 13.0–14.0, H 11
//   kuis     t 23.0–24.0, H 14, fokus dari segmenKuis(...).fokus
//            (Prompt 00 menyebut H 12; H 14 adalah penyimpangan sengaja: pada H 12 atap komisariat di P berada ±50 px di atas
//            zona y 600 dan ujung kanannya di E hanya 5 px dari tepi frame, sedangkan H 14 lolos periksaZona. Lihat docs/inti.md.)
//   akhir    t 28.0–29.5, H 15, fokus naik 0.8 dari fokus sebelumnya
// Tiap kunci { t, H, fokus } boleh diganti sebagian. Fokus gejala, sebab, ikhtiar, dan kuis yang kosong = `fokus` (seperti
// jadwalIndikator); fokus akhir yang kosong = fokus sebelumnya, lalu naik `naik` (bawaan 0.8). `tambahan` adalah array kunci
// bebas { t, H?, fokus?, naik?, kurva? } untuk geseran kamera di tengah bagian; semua kunci diurutkan menurut awal t, dan
// fokus atau H yang kosong pada kunci tambahan = keadaan sebelumnya. Kamera tetap ortografis isometrik dan tidak berputar.
// Contoh: jadwalEvidence({ fokus: d.fokus, kuis: { fokus: seg.fokus }, tambahan: [{ t: [17.5, 18.5], H: 11, fokus: titik(2, 1) }] }).
// Tiap kunci (awal, gejala, sebab, ikhtiar, kuis, akhir, dan tiap kunci tambahan) juga boleh memakai `muat`: { muat: [benda...], H }.
// Fokus kunci itu = fokusUntuk(muat) dan H = max(H yang diberi atau bawaan kunci, hMuat(muat)), jadi benda selalu muat di zona
// tanpa coba-coba (aturan "naikkan H bila tidak muat" dikerjakan otomatis). Pada kunci tambahan tanpa H, H = hMuat(muat). Opsi
// kunci `margin` (piksel) dan `fokus` (kamera tetap di fokus itu, H dihitung untuk fokus itu) seperti pada hMuat; kunci tanpa
// `muat` tidak berubah. Benda dibaca pada posisi dasarnya saat jadwalEvidence dipanggil, jadi panggil sesudah semua benda dibuat.
// Contoh: jadwalEvidence({ fokus: d.fokus, gejala: { muat: [gerbang, komisariat], H: 11 }, sebab: { muat: [komisariat] } }).
export function jadwalEvidence({ fokus = titik(0, 0), awal = {}, gejala = {}, sebab = {}, ikhtiar = {}, kuis = {}, akhir = {}, tambahan = [] } = {}) {
  awal = kunciMuat(awal, 13); gejala = kunciMuat(gejala, 11); sebab = kunciMuat(sebab, 8);
  ikhtiar = kunciMuat(ikhtiar, 11); kuis = kunciMuat(kuis, 14); akhir = kunciMuat(akhir, 15);
  tambahan = tambahan.map((k) => kunciMuat(k, 0));
  const utama = [
    { t: gejala.t ?? [0, 1.2], H: gejala.H ?? 11, fokus: gejala.fokus ?? fokus, naik: gejala.naik },
    { t: sebab.t ?? [6, 7], H: sebab.H ?? 8, fokus: sebab.fokus ?? fokus, naik: sebab.naik },
    { t: ikhtiar.t ?? [13, 14], H: ikhtiar.H ?? 11, fokus: ikhtiar.fokus ?? fokus, naik: ikhtiar.naik },
    { t: kuis.t ?? [23, 24], H: kuis.H ?? 14, fokus: kuis.fokus ?? fokus, naik: kuis.naik },
    { t: akhir.t ?? [28, 29.5], H: akhir.H ?? 15, fokus: akhir.fokus, naik: akhir.naik ?? 0.8 },
  ];
  for (const k of tambahan) if (!Array.isArray(k?.t)) throw new Error("[kit] jadwalEvidence: tiap kunci tambahan butuh t: [a, b].");
  // Urut menurut awal t (stabil: kunci utama lebih dulu bila awalnya sama), karena tiap kunci membaur dari keadaan sebelumnya.
  const kunci = [...utama, ...tambahan].map((k, i) => ({ k, i })).sort((p, q) => p.k.t[0] - q.k.t[0] || p.i - q.i).map(({ k }) => k);
  return jadwalKamera({ awal: { H: awal.H ?? 13, fokus: awal.fokus ?? fokus }, kunci });
}
