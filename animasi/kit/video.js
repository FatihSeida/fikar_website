// buatVideo(): merangkai mesin, kamera, tanah, halaman, gerak, dan memasang kontrak halaman (KONTRAK bagian 2–4).
import * as THREE from "three";
import { aktif } from "./inti/aktif.js";
import { buatTema, pakaiTema, W } from "./inti/tema.js";
import { buatMesin } from "./inti/mesin.js";
import { buatKamera, jadwalKamera } from "./inti/kamera.js";
import { buatTanah } from "./inti/tanah.js";
import { titik, keLayar, kotakLayar } from "./inti/ruang.js";
import { klem } from "./inti/waktu.js";
import { pasangKerangka, tungguHalaman } from "./halaman/kerangka.js";
import { evaluasiGerak, posisiDunia, namaBenda } from "./gerak/catatan.js";

const VERSI_URL = new URL("./VERSI", import.meta.url).href;

// opsi:
//   durasi        detik (bawaan dari format)
//   fps           bawaan 30
//   ukuran        { lebar, tinggi }, bawaan 1080×1920
//   tema          dari buatTema({...}); bawaan palet B.5
//   format        mis. formatIndikator({...}); null = halaman kosong (tanpa teks, tanpa kabut, zona seluruh layar)
//   kamera        fungsi t → { H, fokus } (jadwalKamera / jadwalIndikator), atau { jadwal, piksel, azimut, elevasi }.
//                 Jadwal juga bisa diganti sesudah buatVideo lewat v.aturKamera(fn) (dipakai akhiriEvidence).
//   tanah         false, atau opsi buatTanah ({ jari, nyala, bayangan })
//   bloom, cahaya opsi buatMesin (false untuk mematikan)
//   zona, kabut, titikPeriksa, beku   menimpa nilai format
//   akhirAdegan   detik adegan selesai (bunyi aliran dipotong di sini); bawaan format.akhirAdegan, lalu awal kartu akhir
//                 format (format.waktu.kartu.kepala[0], indikator 18.2), lalu durasi
export function buatVideo(opsi = {}) {
  if (aktif.video) throw new Error("[kit] buatVideo() hanya boleh dipanggil sekali per halaman.");
  const format = opsi.format ?? null;
  const durasi = opsi.durasi ?? format?.durasi;
  if (!(durasi > 0)) throw new Error("[kit] buatVideo() butuh durasi (detik) atau format yang punya durasi.");
  const fps = opsi.fps ?? 30;
  const ukuran = { lebar: 1080, tinggi: 1920, ...opsi.ukuran };
  pakaiTema(opsi.tema ?? buatTema());

  const zona = { ...(opsi.zona ?? format?.zona ?? { x0: 0, y0: 0, x1: ukuran.lebar, y1: ukuran.tinggi }) };
  const halaman = pasangKerangka({ ukuran, kabut: opsi.kabut !== undefined ? opsi.kabut : format?.kabut ?? null });

  const kOpsi = typeof opsi.kamera === "function" ? { jadwal: opsi.kamera } : (opsi.kamera ?? {});
  const rig = buatKamera({ ukuran, piksel: kOpsi.piksel ?? format?.fokusPiksel, azimut: kOpsi.azimut, elevasi: kOpsi.elevasi });
  let jadwal = kOpsi.jadwal ?? format?.kamera?.() ?? jadwalKamera({ awal: { H: 16, fokus: titik(0, 0) } });
  const mesin = buatMesin({ kanvas: halaman.kanvas, ukuran, kamera: rig.kamera, bloom: opsi.bloom, cahaya: opsi.cahaya });
  const tanah = opsi.tanah === false ? null : buatTanah({ ...format?.tanah, ...opsi.tanah });
  if (tanah) mesin.scene.add(tanah.grup);

  const titikPeriksa = opsi.titikPeriksa ?? format?.titikPeriksa ?? [0.1, 0.3, 0.5, 0.7, 0.95].map((k) => +(k * durasi).toFixed(2));
  const tunggu = [];
  const setiapFrame = [];
  let tTerakhir = null;
  let cachePeristiwa = null;

  const v = {
    durasi, fps, ukuran, zona, format, W, halaman, mesin, tanah, rig,
    scene: mesin.scene, kamera: rig.kamera, renderer: mesin.renderer,
    beku: opsi.beku !== undefined ? opsi.beku : format?.beku ?? null,
    akhirAdegan: opsi.akhirAdegan ?? format?.akhirAdegan ?? format?.waktu?.kartu?.kepala?.[0] ?? durasi,
    batasLabel: { atas: zona.y0 - 80, bawah: zona.y1 + 10 },
    // diisi gerak dan halaman
    objekGerak: new Map(), mandiri: [], peristiwa: [], label: [], komponen: [],
    tambah(...benda) { mesin.scene.add(...benda); return benda[0]; },
    setiapFrame(fn) { setiapFrame.push(fn); },
    // Mengganti jadwal kamera (fungsi t → { H, fokus }) sesudah video dibuat, mis. oleh akhiriEvidence di akhir adegan.js.
    aturKamera(fn) {
      if (typeof fn !== "function") throw new Error("[kit] aturKamera: butuh fungsi t → { H, fokus }.");
      jadwal = fn;
    },
    tunggu(janji) { tunggu.push(janji); },
    keLayar: (pos, out) => keLayar(pos, rig.kamera, ukuran, out),
    hitung, tampilkan,
  };
  aktif.video = v;
  if (format?.pasang) format.pasang(v);

  // Keadaan 3D pada detik t tanpa menggambar: kamera, tanah, gerak, lalu fungsi setiapFrame video.
  function hitung(t, info = { hitungSaja: true }) {
    t = klem(t, 0, durasi);
    const k = jadwal(t);
    rig.atur(k);
    mesin.ikutiFokus(k.fokus, k.H);
    if (tanah) tanah.perbarui(t, k.fokus);
    evaluasiGerak(v, t);
    for (const fn of setiapFrame) fn(t, info);
    mesin.scene.updateMatrixWorld();
    return t;
  }
  // Kontrak halaman: menggambar keadaan tepat pada detik t, kanvas dan HTML, secara sinkron.
  function tampilkan(t) {
    t = hitung(t, { hitungSaja: false });
    for (const l of v.label) l.perbarui(t);
    mesin.render();
    for (const k of v.komponen) k.perbarui(t);
    tTerakhir = t;
  }
  const pulihkan = () => { if (tTerakhir !== null) tampilkan(tTerakhir); };

  // KONTRAK bagian 3: peristiwa bunyi urut menurut t. x dari proyeksi benda pada detik t,
  // x1 (opsional) dari proyeksi posisi akhir pada detik t + durasi.
  function peristiwa() {
    if (cachePeristiwa) return cachePeristiwa.map((e) => ({ ...e }));
    const gerak = v.peristiwa.filter((e) => e.t >= 0 && e.t < durasi);
    const struktur = (format?.peristiwa ?? [])
      .filter((s) => !gerak.some((e) => e.jenis === s.jenis && Math.abs(e.t - s.t) <= 0.5))
      .map((s) => ({ kuat: 0.7, durasi: 0, nada: 0, sumber: "format", x: 0.5, ...s }));
    const semua = [...struktur, ...gerak].map((e, i) => ({ e, i })).sort((a, b) => a.e.t - b.e.t || a.i - b.i).map((x) => x.e);
    const p = new THREE.Vector3();
    const bulat = (n) => Math.round(n * 1000) / 1000;
    const layarX = (spek, t) => { hitung(t); return posisiDunia(spek, t, p) ? klem(v.keLayar(p).x / ukuran.lebar) : null; };
    const hasil = semua.map((e) => {
      const x = (e.posisi ? layarX(e.posisi, e.t) : null) ?? e.x ?? 0.5;
      const x1 = e.posisiAkhir ? layarX(e.posisiAkhir, Math.min(durasi, e.t + (e.durasi ?? 0))) : e.x1;
      const o = { t: bulat(e.t), jenis: e.jenis, x: bulat(x), kuat: bulat(e.kuat ?? 0.7), durasi: bulat(e.durasi ?? 0), nada: e.nada ?? 0, sumber: String(e.sumber ?? e.jenis) };
      if (x1 !== undefined && x1 !== null) o.x1 = bulat(x1);
      if (e.periode !== undefined) o.periode = e.periode;
      return o;
    });
    pulihkan();
    cachePeristiwa = hasil;
    return hasil.map((e) => ({ ...e }));
  }

  // KONTRAK bagian 4: benda penting (userData.penting) yang keluar zona format pada detik t.
  // penting boleh berupa fungsi (t) => boolean. Benda yang dirinya atau salah satu induknya ber-userData.abaikanZona dilewati.
  function periksaZona(t) {
    t = hitung(t);
    const hasil = [];
    mesin.scene.traverse((o) => {
      const penting = o.userData.penting;
      if (!(typeof penting === "function" ? penting(t) : penting)) return;
      let a = 1;
      for (let p = o; p; p = p.parent) { if (!p.visible || p.userData.abaikanZona) return; a *= p.userData.opasitas ?? 1; }
      if (a < 0.5) return;
      const k = kotakLayar(o, rig.kamera, ukuran);
      if (!k) return;
      const keluar = [];
      if (k.x0 < zona.x0) keluar.push("kiri");
      if (k.x1 > zona.x1) keluar.push("kanan");
      if (k.y0 < zona.y0) keluar.push("atas");
      if (k.y1 > zona.y1) keluar.push("bawah");
      const r = (n) => Math.round(n);
      if (keluar.length) hasil.push({ sumber: namaBenda(o), kotak: { x0: r(k.x0), y0: r(k.y0), x1: r(k.x1), y1: r(k.y1) }, zona: { ...zona }, keluar });
    });
    pulihkan();
    return hasil;
  }

  // ---------------------------------------------------------------- globals halaman (KONTRAK bagian 2)
  window.DURASI = durasi;
  window.FPS = fps;
  window.UKURAN = { ...ukuran };
  window.tampilkan = tampilkan;
  window.KIT = { versi: null, peristiwa, periksaZona, titikPeriksa: [...titikPeriksa] };
  window.siap = (async () => {
    // Satu putaran tugas supaya adegan.js selesai membangun sebelum frame pertama.
    await new Promise((ok) => setTimeout(ok, 0));
    const teksLabel = v.label.flatMap((l) => l.semuaTeks()).join(" ");
    await tungguHalaman(teksLabel);
    await Promise.all(tunggu);
    // Vite menyajikan berkas tanpa ekstensi sebagai modul JS (ditambah komentar sourcemap): ambil baris pertama saja.
    try { window.KIT.versi = (await (await fetch(VERSI_URL)).text()).trim().split(/\r?\n/)[0].trim(); } catch { window.KIT.versi = "?"; }
    format?.periksaTeks?.();
    tampilkan(0);
  })();

  const prm = new URLSearchParams(location.search);
  if (!prm.has("rekam")) {
    window.siap.then(() => {
      if (prm.has("t")) { tampilkan(parseFloat(prm.get("t")) || 0); return; }
      const mulai = performance.now();
      const putar = () => { tampilkan(((performance.now() - mulai) / 1000) % durasi); requestAnimationFrame(putar); };
      putar();
    });
  }
  return v;
}
