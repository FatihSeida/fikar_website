// Katalog kit: semua benda (DAFTAR_BENDA) dan dunia (DAFTAR_DUNIA) dalam halaman berlabel, satu halaman per detik.
// Memenuhi kontrak halaman (KONTRAK §2), jadi bisa ditangkap alat: npm run buat -- kit/katalog --periksa.
// Parameter URL (rincian: kit/docs/katalog.md):
//   (tanpa)          semua benda per kategori (paling banyak 12 per halaman), lalu semua dunia (satu per halaman)
//   ?keadaan=<k>     emas | nyala | denyut | abu | pudar pada semua benda, nilai penuh (nyala = puncak klikEmas: emas 1, nyala 1.4)
//   ?benda=<nama>    satu benda, besar
//   ?dunia=<nama>    satu dunia; ?dunia=semua = semua dunia tanpa halaman benda. Halaman dunia memakai kamera bawaan dunia,
//                    piksel fokus dan zona format indikator (periksaZona melaporkan benda dunia yang keluar zona)
//   ?hanya=<nama>    halaman tetap sama, tetapi hanya benda itu yang dibuat (di selnya sendiri, ukuran sama); untuk uji per benda
//   ?bloom=0         tanpa bloom; untuk uji bahwa bloom tidak mengubah satu piksel pun pada keadaan selain emas dan nyala
import * as THREE from "three";
import { buatVideo, titik, label3D, setelKeadaan, kotakLayar, EMAS, ZONA_INDIKATOR, DAFTAR_BENDA, DAFTAR_DUNIA } from "../index.js";

const prm = new URLSearchParams(location.search);
const KEADAAN = {
  emas: [["emas", 1]], nyala: [["emas", 1], ["nyala", EMAS.puncak]], denyut: [["denyut", 1]], abu: [["abu", 1]], pudar: [["pudar", 1]],
};
const keadaan = prm.get("keadaan"), hanya = prm.get("hanya");
const PER_HALAMAN = 12, KOLOM = 3; // sel 360 × 405 px mulai y 250
const KAMERA_BENDA = { H: 16, fokus: titik(0, 0) };
const besar = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const galat = (pesan) => console.error(`[katalog] ${pesan}`);

// ---------------------------------------------------------------- daftar halaman (ditentukan sebelum buatVideo: durasi = jumlah halaman)
const halaman = []; // { judul, info, isi?: [entri], dunia?: entri, besar?, pesan?: [judul, rincian], kamera, zona, grup }
const nDunia = prm.get("dunia"), nBenda = prm.get("benda");
if (nBenda !== null) {
  const e = DAFTAR_BENDA.find((b) => b.nama === nBenda);
  if (!e) {
    galat(`tidak ada benda "${nBenda}"`);
    halaman.push({ judul: "Benda", pesan: [`Tidak ada benda "${nBenda}" di DAFTAR_BENDA`, "Buka katalog tanpa parameter untuk melihat semua nama."] });
  } else halaman.push({ judul: e.nama, isi: [e], besar: true, info: `${e.kategori}${e.sub ? " · " + e.sub : ""}` });
} else {
  if (nDunia === null) {
    const kategori = [...new Set(DAFTAR_BENDA.map((b) => b.kategori))];
    for (const k of kategori) {
      const isi = DAFTAR_BENDA.filter((b) => b.kategori === k);
      const n = Math.ceil(isi.length / PER_HALAMAN);
      for (let j = 0; j < n; j++) {
        const potong = isi.slice(Math.round((j * isi.length) / n), Math.round(((j + 1) * isi.length) / n));
        halaman.push({ judul: besar(k) + (n > 1 ? ` ${j + 1}/${n}` : ""), isi: potong, info: `${isi.length} benda kategori ${k}` });
      }
    }
  }
  const daftar = nDunia === null || nDunia === "semua" ? DAFTAR_DUNIA : DAFTAR_DUNIA.filter((d) => d.nama === nDunia);
  if (!daftar.length) {
    galat(`tidak ada dunia "${nDunia}"`);
    halaman.push({ judul: "Dunia", pesan: [`Tidak ada dunia "${nDunia}"`, `Pilihan: ${DAFTAR_DUNIA.map((d) => d.nama).join(", ")}, semua`] });
  }
  for (const d of daftar) halaman.push({ judul: `Dunia ${besar(d.nama)}`, dunia: d, info: "dunia" });
}
if (keadaan && !KEADAAN[keadaan]) galat(`keadaan "${keadaan}" tidak dikenal; pilihan: ${Object.keys(KEADAAN).join(", ")}`);
// Halaman benda: zona seluruh layar, fokus di tengah layar. Halaman dunia: zona dan piksel fokus format indikator.
const SELURUH = { x0: 0, y0: 0, x1: 1080, y1: 1920 };
for (const h of halaman) {
  h.kamera = { ...KAMERA_BENDA, fokus: KAMERA_BENDA.fokus.clone(), ...(h.dunia ? { piksel: { x: 540, y: 1010 } } : {}) };
  h.zona = h.dunia ? { ...ZONA_INDIKATOR } : SELURUH;
}

const indeks = (t) => Math.min(halaman.length - 1, Math.max(0, Math.floor(t)));
const v = buatVideo({
  durasi: halaman.length,
  kamera: (t) => halaman[indeks(t)].kamera,
  tanah: { jari: halaman.some((h) => h.isi) ? 40 : 20 },
  bloom: prm.get("bloom") === "0" ? false : undefined,
  titikPeriksa: halaman.map((_, i) => i + 0.5),
});

// ---------------------------------------------------------------- kepala dan pesan (HTML, diperbarui dari t)
const lapisan = v.halaman.lapisanHalaman;
const kepala = document.createElement("div");
kepala.id = "katalog-kepala";
kepala.innerHTML = '<div class="kk-merek"></div><div class="kk-judul"></div><div class="kk-info"></div>';
lapisan.appendChild(kepala);
const [elMerek, elJudul, elInfo] = kepala.children;
const elPesan = document.createElement("div");
elPesan.className = "kk-pesan";
lapisan.appendChild(elPesan);
const garisZona = [ZONA_INDIKATOR.y0, ZONA_INDIKATOR.y1].map((y) => {
  const z = document.createElement("div");
  z.className = "kk-zona";
  z.style.top = y - 1 + "px";
  z.innerHTML = `<span>zona indikator y ${y}</span>`;
  lapisan.appendChild(z);
  return z;
});
const lolos = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------------------------------------------------------------- tata letak benda
// Kamera halaman benda tetap (H 16, fokus titik(0, 0), piksel tengah layar). Titik layar ↔ tanah: r hanya menggeser x, d hanya y.
v.rig.atur(KAMERA_BENDA);
const p0 = v.keLayar(new THREE.Vector3());
const pr = v.keLayar(titik(1, 0)).x - p0.x, pd = v.keLayar(titik(0, 1)).y - p0.y;
const keTanah = (x, y) => titik((x - p0.x) / pr, (y - p0.y) / pd);

// Sel: kolom berpusat di x 190, 540, 890 (label nama terpanjang tetap 40 px dari tepi layar, batas pudar label3D).
function kotakSel(i, besar) {
  if (besar) return { sel: { x0: 60, y0: 250, x1: 1020, y1: 1700 }, benda: { x0: 90, y0: 300, x1: 990, y1: 1470 }, label: { x: 540, y: 1520 } };
  const x0 = 15 + (i % KOLOM) * 350, y0 = 250 + Math.floor(i / KOLOM) * 405;
  return {
    sel: { x0, y0, x1: x0 + 350, y1: y0 + 405 },
    benda: { x0: x0 + 25, y0: y0 + 16, x1: x0 + 325, y1: y0 + 300 },
    label: { x: x0 + 175, y: y0 + 314 },
  };
}
// Kotak layar benda. Benda yang semua bahannya sangat tembus (kotakLayar melewatinya, mis. kerucutSorot) memakai kotak dunianya.
function kotakBenda(obj) {
  const b = kotakLayar(obj, v.kamera, v.ukuran);
  if (b) return b;
  const k = new THREE.Box3().setFromObject(obj);
  if (k.isEmpty()) return null;
  const h = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (let i = 0; i < 8; i++) {
    const p = v.keLayar(new THREE.Vector3(i & 1 ? k.max.x : k.min.x, i & 2 ? k.max.y : k.min.y, i & 4 ? k.max.z : k.min.z));
    h.x0 = Math.min(h.x0, p.x); h.x1 = Math.max(h.x1, p.x); h.y0 = Math.min(h.y0, p.y); h.y1 = Math.max(h.y1, p.y);
  }
  return h;
}
// Skalakan benda terhadap titik asalnya supaya kotak layarnya muat di `k`, lalu geser di tanah ke pusat `k`. Mengembalikan skala.
function muatkan(obj, k) {
  obj.updateMatrixWorld(true);
  const b = kotakBenda(obj);
  if (!b) return 1;
  const s = Math.min((k.x1 - k.x0) / Math.max(1, b.x1 - b.x0), (k.y1 - k.y0) / Math.max(1, b.y1 - b.y0));
  const a = v.keLayar(obj.getWorldPosition(new THREE.Vector3()));
  const cx = a.x + s * ((b.x0 + b.x1) / 2 - a.x), cy = a.y + s * ((b.y0 + b.y1) / 2 - a.y);
  obj.scale.multiplyScalar(s);
  obj.position.add(titik(((k.x0 + k.x1) / 2 - cx) / pr, ((k.y0 + k.y1) / 2 - cy) / pd));
  obj.updateMatrixWorld(true);
  return s;
}
function jangkar(grup, pos) {
  const j = new THREE.Object3D();
  j.position.copy(pos);
  grup.add(j);
  return j;
}
const terapkanKeadaan = (obj) => { for (const [n, nilai] of KEADAAN[keadaan] ?? []) setelKeadaan(obj, n, nilai); };
const ringkasContoh = (c) => Object.entries(c ?? {}).map(([k, x]) => `${k}: ${Array.isArray(x) ? `[${x.length}]` : typeof x === "object" && x ? "{…}" : x}`).join(", ");

const gagal = [];
for (const h of halaman) {
  h.grup = v.tambah(new THREE.Group());
  h.grup.name = `halaman ${h.judul}`;
  if (h.isi) {
    h.isi.forEach((e, i) => {
      if (hanya !== null && e.nama !== hanya) return;
      const sel = kotakSel(i, h.besar);
      const j = jangkar(h.grup, keTanah(sel.label.x, sel.label.y));
      let obj = null, catatan;
      try {
        obj = e.buat({ ...e.contoh });
        h.grup.add(obj);
        const s = muatkan(obj, sel.benda);
        catatan = `×${s.toFixed(2)}`;
        if (h.besar) catatan = `${h.info} · skala katalog ×${s.toFixed(2)}` + (ringkasContoh(e.contoh) ? `\ncontoh { ${ringkasContoh(e.contoh)} }` : "");
      } catch (err) {
        if (obj) h.grup.remove(obj);
        obj = null;
        gagal.push({ nama: e.nama, pesan: err.message });
        galat(`${e.nama} gagal dibuat dari contoh: ${err.message}`);
        catatan = `GAGAL: ${err.message}`.slice(0, 60);
      }
      label3D(e.nama, { pada: j, gaya: "benda", kelas: "katalog-nama" + (obj ? "" : " gagal"), ax: 0.5, ay: 0 });
      label3D(catatan, { pada: j, gaya: "mikro", kelas: "katalog-catatan", ax: 0.5, ay: 0, dy: 38 });
      if (obj) terapkanKeadaan(obj);
    });
  }
  if (h.dunia) {
    // Dunia menambah bendanya langsung ke scene (v.tambah); semuanya dipindah ke grup halaman supaya bisa disembunyikan.
    const sebelum = new Set(v.scene.children);
    let d = null;
    try {
      d = h.dunia.buat(v, {});
    } catch (err) {
      // Dunia yang belum selesai berupa stub yang melempar "… belum dibuat": cukup diberi tahu. Galat lain berarti dunia rusak.
      const stub = /belum dibuat/.test(err.message);
      h.pesan = [`Dunia ${h.dunia.nama} ${stub ? "belum dibuat" : "gagal dibuat"}`, err.message];
      if (stub) console.warn(`[katalog] dunia ${h.dunia.nama}: ${err.message}`);
      else galat(`dunia ${h.dunia.nama} gagal dibuat: ${err.message}`);
    }
    for (const c of [...v.scene.children]) if (!sebelum.has(c)) h.grup.add(c);
    if (d) {
      h.kamera = { H: d.H ?? 16, fokus: (d.fokus ?? titik(0, 0)).clone(), piksel: h.kamera.piksel };
      const kunci = Object.entries(d.benda ?? {});
      h.info = `${kunci.length} benda · H ${+(d.H ?? 16).toFixed(2)} · titik: ${Object.keys(d.titik ?? {}).join(", ") || "-"}`;
      for (const [nama, obj] of kunci) {
        const kotak = new THREE.Box3().setFromObject(obj);
        const pusat = kotak.isEmpty() ? obj.getWorldPosition(new THREE.Vector3()) : kotak.getCenter(new THREE.Vector3()).setY(kotak.min.y);
        label3D(nama, { pada: jangkar(h.grup, pusat), gaya: "mikro", ax: 0.5, ay: 0, dy: 4 });
        terapkanKeadaan(obj);
      }
    }
  }
}
window.KATALOG = {
  // isi: nama benda dan kotak selnya dalam piksel layar (untuk memotong tangkapan per benda).
  halaman: halaman.map((h) => ({
    judul: h.judul, pesan: h.pesan ?? null, isi: (h.isi ?? []).map((e, i) => ({ nama: e.nama, sel: kotakSel(i, h.besar).sel })),
  })),
  gagal,
};

// ---------------------------------------------------------------- per frame: hanya halaman floor(t) yang tampak
v.setiapFrame((t) => {
  const i = indeks(t), h = halaman[i];
  halaman.forEach((x, j) => { x.grup.visible = j === i; });
  // Zona per halaman: dipakai periksaZona (dipanggil sesudah setiapFrame) dan batas pudar label3D.
  Object.assign(v.zona, h.zona);
  v.batasLabel.atas = h.zona.y0 - 80;
  v.batasLabel.bawah = h.zona.y1 + 10;
  for (const z of garisZona) z.style.display = h.dunia ? "block" : "none";
  const merek = `KATALOG KIT ${window.KIT?.versi ?? ""}`.trim();
  const info = `halaman ${i + 1} / ${halaman.length}${h.info ? " · " + lolos(h.info) : ""} · keadaan <b>${lolos(keadaan ?? "biasa")}</b>`;
  if (elMerek.textContent !== merek) elMerek.textContent = merek;
  if (elJudul.textContent !== h.judul) elJudul.textContent = h.judul;
  if (elInfo.innerHTML !== info) elInfo.innerHTML = info;
  const pesan = h.pesan ? `${lolos(h.pesan[0])}<small>${lolos(h.pesan[1] ?? "")}</small>` : "";
  if (elPesan.innerHTML !== pesan) elPesan.innerHTML = pesan;
  elPesan.style.display = pesan ? "block" : "none";
});
