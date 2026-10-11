/**
 * Cara mengisi kuis "Seberapa Evidence Komisariatmu?": adegan isometrik 30 detik.
 * Semua gerak dihitung dari t (detik) lewat fungsi murni, tanpa jam internal dan tanpa acak tak berbenih.
 * Kontrak halaman: window.DURASI, window.siap, window.tampilkan(t). Lihat ../../README.md.
 */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const W = 1080;
const H = 1920;
const DURASI = 30;
window.DURASI = DURASI;

const params = new URLSearchParams(location.search);
const MODE_REKAM = params.has("rekam");
const BEKU = params.get("t");

/* ------------------------------------------------------------------ util */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const lin = (a, b, x) => clamp((x - a) / (b - a));
const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const keluar = (k) => 1 - Math.pow(1 - clamp(k), 3);
const masukKeluar = (k) => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const keluarBalik = (k) => { k = clamp(k); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
/** Naik a→b, turun c→d. */
const jendela = (t, a, b, c, d) => sstep(a, b, t) * (1 - sstep(c, d, t));
const bayang = (t, a) => (t >= a ? Math.exp(-(t - a) * 4.5) : 0);

function acak(seed) { // mulberry32, berbenih
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

const hsl = (h, s, l) => new THREE.Color().setStyle(`hsl(${h}, ${s}%, ${l}%)`);
const C = {
  bg: hsl(153, 50, 7),
  papan: hsl(153, 40, 10.5),
  ubinGelap: hsl(153, 40, 21),
  zamrud: hsl(152, 68, 36),
  zamrudGlow: hsl(152, 80, 45),
  emas: hsl(42, 52, 58),
  emasTerang: hsl(42, 75, 72),
  emasGelap: hsl(42, 45, 30),
  teal: hsl(176, 62, 50),
  tealGelap: hsl(176, 40, 22),
  krem: hsl(42, 33, 96),
  garis: hsl(152, 60, 40),
};

/* ------------------------------------------------------------ data kuis */
const KELOMPOK = [
  { nama: "Kaderisasi", skor: [2, 2, 2, 2, 1], arah: "x", mulai: [0, 0] },
  { nama: "Tata Kelola", skor: [2, 2, 2, 2], arah: "z", mulai: [4, 2] },
  { nama: "Pengetahuan", skor: [2, 1, 2], arah: "x", mulai: [6, 5] },
  { nama: "Target Program", skor: [3, 2, 2], arah: "z", mulai: [8, 7] },
  { nama: "Evaluasi dan Arsip", skor: [2, 2, 2], arah: "x", mulai: [10, 9] },
  { nama: "Data dan Jaringan", skor: [2, 1], arah: "z", mulai: [12, 11] },
];
const TINGKAT = [
  { nama: "Titik Berangkat", dari: 0, sampai: 15 },
  { nama: "Mulai Mencatat", dari: 16, sampai: 30 },
  { nama: "Mulai Membaca Bukti", dari: 31, sampai: 45 },
  { nama: "Bukti Menjadi Kebiasaan", dari: 46, sampai: 60 },
];
const ANGKA = { lk1: 40, aktif: 26, rencana: 12, terlaksana: 9 }; // retensi 65%, keterlaksanaan 75%

const SOAL = [];
KELOMPOK.forEach((g, gi) => g.skor.forEach((s, i) => {
  const dx = g.arah === "x" ? 1 : 0;
  const dz = g.arah === "z" ? 1 : 0;
  SOAL.push({ k: SOAL.length, g: gi, i, x: g.mulai[0] + dx * i, z: g.mulai[1] + dz * i, skor: s });
}));
const SKOR_AKHIR = SOAL.reduce((j, q) => j + q.skor, 0); // 38

/* ----------------------------------------------------------- linimasa */
const T_GERBANG = 3.0;
const T_JATUH = 3.8;
const T_PAD = 4.5;
const T_KE_PAD = [5.5, 5.9];
const T_TEKAN = 5.9;
const T_LEWAT = [6.35, 7.1];
const T_JAWAB = 7.1; // kubus mendarat di soal pertama
const T_LANJUT = 17.0;
const T_PERON = [20.75, 21.7];
const T_ANGKA = 21.0;
const T_HASIL = 24.0;
const T_TUTUP = 28.0;

let _t = T_JAWAB;
SOAL.forEach((q, n) => {
  q.T = _t;
  const lanjut = SOAL[n + 1];
  if (lanjut) {
    q.celah = lanjut.g !== q.g;
    _t += q.celah ? 0.66 : 0.44;
  }
});

const GX = -2.5; // gerbang
const PADX = -4.5;
const SPAWNX = -6.3;
const PERON = { x: 16.5, z: 16.5 };
const CABANG_A = { x0: 12, z0: 12, dx: 1, dz: 0 }; // LK 2
const CABANG_B = { x0: 12, z0: 12, dx: 0, dz: 1 }; // LK 3
const LJ_MULAI = 17.75;
const LJ_JEDA = 0.34;

/* ------------------------------------------------------------- renderer */
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NoToneMapping;
document.body.prepend(renderer.domElement);

const adegan = new THREE.Scene();
adegan.background = C.bg.clone();
const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 220);

const target = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);
composer.setPixelRatio(1);
composer.setSize(W, H);
composer.addPass(new RenderPass(adegan, kamera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.62, 0.62, 0.42);
composer.addPass(bloom);
composer.addPass(new OutputPass());

adegan.add(new THREE.AmbientLight(hsl(160, 45, 78), 0.6));
const matahari = new THREE.DirectionalLight(hsl(48, 45, 96), 1.65);
matahari.position.set(-5, 10, 6);
adegan.add(matahari);
const isi = new THREE.DirectionalLight(hsl(170, 70, 62), 0.5);
isi.position.set(8, 4, -4);
adegan.add(isi);

/* --------------------------------------------------------------- tekstur */
function kanvasTekstur(w, h, gambar) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  gambar(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const texBulat = kanvasTekstur(128, 128, (g, w, h) => {
  const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.3, "rgba(255,255,255,0.45)");
  gr.addColorStop(0.65, "rgba(255,255,255,0.1)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
});
const texBerkas = kanvasTekstur(64, 256, (g, w, h) => {
  const gx = g.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, "rgba(255,255,255,0)"); gx.addColorStop(0.28, "rgba(255,255,255,0.18)"); gx.addColorStop(0.5, "rgba(255,255,255,1)");
  gx.addColorStop(0.72, "rgba(255,255,255,0.18)"); gx.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gx; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "destination-in";
  const gy = g.createLinearGradient(0, 0, 0, h);
  gy.addColorStop(0, "rgba(255,255,255,0)"); gy.addColorStop(0.7, "rgba(255,255,255,0.7)"); gy.addColorStop(1, "rgba(255,255,255,1)");
  g.fillStyle = gy; g.fillRect(0, 0, w, h);
});
const texGerbang = kanvasTekstur(64, 128, (g, w, h) => {
  const gx = g.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, "rgba(255,255,255,0.9)"); gx.addColorStop(0.18, "rgba(255,255,255,0.35)"); gx.addColorStop(0.5, "rgba(255,255,255,0.12)");
  gx.addColorStop(0.82, "rgba(255,255,255,0.35)"); gx.addColorStop(1, "rgba(255,255,255,0.9)");
  g.fillStyle = gx; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "destination-in";
  const gy = g.createLinearGradient(0, 0, 0, h);
  gy.addColorStop(0, "rgba(255,255,255,0.35)"); gy.addColorStop(0.6, "rgba(255,255,255,0.8)"); gy.addColorStop(1, "rgba(255,255,255,1)");
  g.fillStyle = gy; g.fillRect(0, 0, w, h);
});
const texJendela = (() => {
  const r = acak(11);
  const tex = kanvasTekstur(96, 128, (g, w, h) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
      const v = r();
      g.fillStyle = v < 0.55 ? "hsl(152,75%,56%)" : v < 0.8 ? "hsl(42,70%,64%)" : "hsl(152,40%,16%)";
      g.fillRect(col * 32 + 7, row * 32 + 8, 18, 16);
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
})();

/* ------------------------------------------------------------ geometri */
const gKotak = new RoundedBoxGeometry(1, 1, 1, 2, 0.05);
const gKotakTajam = new THREE.BoxGeometry(1, 1, 1);
const gBingkaiPetak = (() => {
  const o = 0.53, i = 0.45;
  const sh = new THREE.Shape();
  sh.moveTo(-o, -o); sh.lineTo(o, -o); sh.lineTo(o, o); sh.lineTo(-o, o); sh.closePath();
  const lubang = new THREE.Path();
  lubang.moveTo(-i, -i); lubang.lineTo(-i, i); lubang.lineTo(i, i); lubang.lineTo(i, -i); lubang.closePath();
  sh.holes.push(lubang);
  const g = new THREE.ShapeGeometry(sh);
  g.rotateX(-Math.PI / 2);
  return g;
})();
const gBingkaiPita = (() => {
  const o = 1.28, i = 1.2;
  const sh = new THREE.Shape();
  sh.moveTo(-o, -o); sh.lineTo(o, -o); sh.lineTo(o, o); sh.lineTo(-o, o); sh.closePath();
  const lubang = new THREE.Path();
  lubang.moveTo(-i, -i); lubang.lineTo(-i, i); lubang.lineTo(i, i); lubang.lineTo(i, -i); lubang.closePath();
  sh.holes.push(lubang);
  const g = new THREE.ShapeGeometry(sh);
  g.rotateX(-Math.PI / 2);
  return g;
})();
const gCincin = new THREE.RingGeometry(0.5, 0.56, 56).rotateX(-Math.PI / 2);
const gAlas = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);

const bahanLam = (warna, emisi = 0x000000) => new THREE.MeshLambertMaterial({ color: warna, emissive: emisi });
const bahanTambah = (warna, op = 1) => new THREE.MeshBasicMaterial({ color: warna, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false });

function kotak(bahan, geom = gKotak) {
  const m = new THREE.Mesh(geom, bahan);
  adegan.add(m);
  return m;
}
function sprite(map, warna, skala) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color: warna, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.scale.set(skala, skala, 1);
  adegan.add(s);
  return s;
}

/* ---------------------------------------------------------------- papan */
const PAPAN = { x0: -8.5, x1: 21.5, z0: -5.5, z1: 21.5 };
const papan = new THREE.Mesh(new THREE.BoxGeometry(PAPAN.x1 - PAPAN.x0, 0.7, PAPAN.z1 - PAPAN.z0), bahanLam(C.papan, hsl(153, 50, 6)));
papan.position.set((PAPAN.x0 + PAPAN.x1) / 2, -0.35, (PAPAN.z0 + PAPAN.z1) / 2);
adegan.add(papan);

const grid = (() => {
  const pos = [];
  for (let x = Math.ceil(PAPAN.x0); x <= PAPAN.x1; x++) pos.push(x - 0.5, 0.004, PAPAN.z0, x - 0.5, 0.004, PAPAN.z1);
  for (let z = Math.ceil(PAPAN.z0); z <= PAPAN.z1; z++) pos.push(PAPAN.x0, 0.004, z - 0.5, PAPAN.x1, 0.004, z - 0.5);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: hsl(152, 60, 36), transparent: true, opacity: 0.2 }));
  adegan.add(m);
  return m;
})();
const tepi = (() => {
  const { x0, x1, z0, z1 } = PAPAN;
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([x0, 0.01, z0, x1, 0.01, z0, x1, 0.01, z0, x1, 0.01, z1, x1, 0.01, z1, x0, 0.01, z1, x0, 0.01, z1, x0, 0.01, z0], 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: hsl(152, 70, 45), transparent: true, opacity: 0.55 }));
  adegan.add(m);
  return m;
})();

/* --------------------------------------------------------------- jalur */
// Titik jalur untuk menghitung panjang busur: dari tempat kubus muncul sampai soal terakhir.
const jalur = [[SPAWNX, 0]];
SOAL.forEach((q) => jalur.push([q.x, q.z]));
const panjangKe = [0];
for (let i = 1; i < jalur.length; i++) panjangKe.push(panjangKe[i - 1] + Math.hypot(jalur[i][0] - jalur[i - 1][0], jalur[i][1] - jalur[i - 1][1]));
SOAL.forEach((q, n) => { q.s = panjangKe[n + 1]; });
const PANJANG_JALUR = panjangKe[panjangKe.length - 1];

/** Posisi kepala cahaya pada pembuka (0.4 detik sampai 2.5 detik). */
const kepalaCahaya = (t) => masukKeluar(lin(0.3, 2.2, t)) * (PANJANG_JALUR + 1.5) - 0.5;

// Rel tipis: dari tempat muncul ke soal pertama, dan penghubung di celah antar kelompok.
const rel = [];
function tambahRel(x0, z0, x1, z1) {
  const m = kotak(bahanLam(C.tealGelap, hsl(152, 70, 40)), gKotakTajam);
  const pj = Math.hypot(x1 - x0, z1 - z0);
  const horizontalX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
  m.scale.set(horizontalX ? pj : 0.15, 0.045, horizontalX ? 0.15 : pj);
  m.position.set((x0 + x1) / 2, 0.0225, (z0 + z1) / 2);
  const sMid = (() => {
    // panjang busur dari titik tengah ke awal jalur
    let best = 0;
    for (let i = 1; i < jalur.length; i++) {
      const [ax, az] = jalur[i - 1], [bx, bz] = jalur[i];
      const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
      const di = Math.hypot(bx - ax, bz - az);
      const cross = Math.abs((bx - ax) * (mz - az) - (bz - az) * (mx - ax)) / (di || 1);
      const proj = ((mx - ax) * (bx - ax) + (mz - az) * (bz - az)) / (di || 1);
      if (cross < 0.05 && proj >= -0.01 && proj <= di + 0.01) { best = panjangKe[i - 1] + proj; break; }
    }
    return best;
  })();
  rel.push({ m, s: sMid, akhirT: null });
  return rel[rel.length - 1];
}
tambahRel(SPAWNX, 0, -0.3, 0);
for (let n = 0; n < SOAL.length - 1; n++) {
  const a = SOAL[n], b = SOAL[n + 1];
  if (a.celah) {
    const dx = Math.sign(b.x - a.x), dz = Math.sign(b.z - a.z);
    const r = tambahRel(a.x + dx * 0.4, a.z + dz * 0.4, b.x - dx * 0.4, b.z - dz * 0.4);
    r.setelah = b.k; // menyala saat kubus tiba di soal ini
  }
}

/* ---------------------------------------------------------------- petak */
const ubin = SOAL.map((q) => {
  const bahan = bahanLam(C.ubinGelap, C.zamrudGlow);
  bahan.emissiveIntensity = 0;
  const m = kotak(bahan);
  m.position.set(q.x, 0.07, q.z);
  m.scale.set(0.84, 0.14, 0.84);
  return { m, bahan };
});
const munculUbin = (k, t) => keluarBalik(lin(SOAL[k].s - 1.6, SOAL[k].s - 0.3, kepalaCahaya(t)));
const tinggiUbin = (k, t) => 0.14 * munculUbin(k, t) + SOAL[k].skor * 0.15 * keluar((t - SOAL[k].T - 0.02) / 0.42);

const bingkai = new THREE.Mesh(gBingkaiPetak, bahanTambah(C.emas, 0.9));
adegan.add(bingkai);
const cincinPool = [0, 1, 2].map(() => {
  const m = new THREE.Mesh(gCincin, bahanTambah(C.zamrudGlow, 0));
  adegan.add(m);
  return m;
});
const cahayaAlas = new THREE.Mesh(gAlas, new THREE.MeshBasicMaterial({ map: texBulat, color: C.emas, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false }));
adegan.add(cahayaAlas);

/* --------------------------------------------------- gerbang dan tombol */
const gerbang = new THREE.Group();
gerbang.position.set(GX, 0, 0);
adegan.add(gerbang);
const bahanGerbang = bahanLam(hsl(42, 38, 36), C.emas);
bahanGerbang.emissiveIntensity = 0;
[-1, 1].forEach((s) => {
  const tiang = new THREE.Mesh(gKotak, bahanGerbang);
  tiang.scale.set(0.3, 1.9, 0.3);
  tiang.position.set(0, 0.95, s * 1.05);
  gerbang.add(tiang);
  const kaki = new THREE.Mesh(gKotak, bahanGerbang);
  kaki.scale.set(0.5, 0.16, 0.5);
  kaki.position.set(0, 0.08, s * 1.05);
  gerbang.add(kaki);
});
const palang = new THREE.Mesh(gKotak, bahanGerbang);
palang.scale.set(0.38, 0.3, 2.65);
palang.position.set(0, 2.05, 0);
gerbang.add(palang);
const portal = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.9), new THREE.MeshBasicMaterial({ map: texGerbang, color: C.emas, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
portal.rotation.y = Math.PI / 2;
portal.position.set(0, 0.95, 0);
gerbang.add(portal);

const bahanPad = bahanLam(hsl(153, 35, 15), C.emas);
bahanPad.emissiveIntensity = 0;
const padDasar = kotak(bahanPad);
padDasar.scale.set(1.45, 0.1, 1.45);
padDasar.position.set(PADX, 0.05, 0);
const padTombol = kotak(bahanLam(C.emasGelap, C.emas));
padTombol.scale.set(1.0, 0.1, 1.0);
const cincinPad = new THREE.Mesh(gCincin, bahanTambah(C.emas, 0));
adegan.add(cincinPad);
const tinggiTombol = (t) => 0.2 - 0.075 * jendela(t, T_TEKAN - 0.04, T_TEKAN + 0.06, T_TEKAN + 0.32, T_TEKAN + 0.6);

const berkasMuncul = sprite(texBerkas, C.emasTerang, 1);
berkasMuncul.scale.set(1.1, 12, 1);
berkasMuncul.center.set(0.5, 0);

/* --------------------------------------------------------------- kubus */
const bahanKubus = bahanLam(hsl(42, 62, 63), C.emas);
bahanKubus.emissiveIntensity = 0.3;
const kubus = kotak(bahanKubus);
const halo = sprite(texBulat, C.emas, 2.6);
const texBayang = kanvasTekstur(128, 128, (g, w, h) => {
  const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  gr.addColorStop(0, "rgba(0,0,0,0.85)"); gr.addColorStop(0.55, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
});
const bayangKubus = new THREE.Mesh(gAlas, new THREE.MeshBasicMaterial({ map: texBayang, transparent: true, opacity: 0.5, depthWrite: false }));
adegan.add(bayangKubus);
const BULAT = 0.62;
const sumbuQ = new THREE.Quaternion();
const sumbu = new THREE.Vector3();

/* --------------------------------------------- ujung jalur: titik loncat */
const titik = {
  spawn: { x: SPAWNX, z: 0, atas: () => 0 },
  pad: { x: PADX, z: 0, atas: (t) => tinggiTombol(t) },
  ubin: SOAL.map((q) => ({ x: q.x, z: q.z, atas: (t) => tinggiUbin(q.k, t) })),
  peron: { x: PERON.x, z: PERON.z, atas: (t) => menaraAtas(t) },
};
const LONCAT = [];
LONCAT.push({ a: titik.spawn, b: titik.pad, t0: T_KE_PAD[0], t1: T_KE_PAD[1], ap: 0.7, ragam: "gulung" });
LONCAT.push({ a: titik.pad, b: titik.ubin[0], t0: T_LEWAT[0], t1: T_LEWAT[1], ap: 0.85, ragam: "gulung" });
for (let n = 0; n < SOAL.length - 1; n++) {
  const celah = SOAL[n].celah;
  const dur = celah ? 0.44 : 0.29;
  LONCAT.push({ a: titik.ubin[n], b: titik.ubin[n + 1], t0: SOAL[n + 1].T - dur, t1: SOAL[n + 1].T, ap: celah ? 0.95 : 0.5, ragam: "gulung" });
}
LONCAT.push({ a: titik.ubin[SOAL.length - 1], b: titik.peron, t0: T_PERON[0], t1: T_PERON[1], ap: 2.6, ragam: "putar" });

/** Keadaan kubus pada waktu t: posisi pusat, skala, rotasi. */
function keadaanKubus(t) {
  const o = { x: SPAWNX, y: 0, z: 0, sy: 1, skala: 1, tampak: true, putaranY: 0, gulungSumbu: null, gulungSudut: 0, melayang: 0, alas: 0 };
  const setengah = BULAT / 2;
  if (t < T_JATUH) { o.tampak = false; return o; }
  const l0 = LONCAT[0];
  if (t < l0.t0) {
    // jatuh dari cahaya, memantul, lalu menunggu
    const u = (t - T_JATUH) / 0.55;
    o.skala = sstep(T_JATUH, T_JATUH + 0.18, t);
    if (u < 1) {
      o.y = 2.8 * (1 - u * u);
      o.putaranY = (1 - u) * Math.PI;
      o.melayang = 1;
    } else {
      const k = (t - (T_JATUH + 0.55)) / 0.36;
      o.y = k < 1 ? 0.55 * 4 * k * (1 - k) : 0.035 * Math.sin((t - 4.7) * 6.2);
      o.melayang = k < 1 ? 1 : 0;
    }
    const dl = t - (T_JATUH + 0.55);
    const dl2 = t - (T_JATUH + 0.91);
    let sy = 1;
    if (dl >= 0 && dl < 0.36) sy -= 0.3 * Math.exp(-dl / 0.06);
    if (dl2 >= 0 && dl2 < 0.4) sy -= 0.16 * Math.exp(-dl2 / 0.06);
    if (t > l0.t0 - 0.12) sy -= 0.14 * sstep(l0.t0 - 0.12, l0.t0, t);
    o.sy = sy;
    o.y += setengah * sy;
    return o;
  }
  let sebelum = null, sesudah = null;
  for (let i = 0; i < LONCAT.length; i++) {
    const l = LONCAT[i];
    if (t >= l.t0 && t <= l.t1) {
      const s = (t - l.t0) / (l.t1 - l.t0);
      const ya = l.a.atas(l.t0), yb = l.b.atas(l.t1);
      o.x = lerp(l.a.x, l.b.x, s);
      o.z = lerp(l.a.z, l.b.z, s);
      const loncat = 4 * s * (1 - s);
      o.alas = lerp(ya, yb, s);
      o.y = lerp(ya, yb, s) + l.ap * loncat + setengah * (1 + 0.1 * loncat);
      o.sy = 1 + 0.1 * loncat;
      o.melayang = 1;
      const dx = l.b.x - l.a.x, dz = l.b.z - l.a.z;
      if (l.ragam === "gulung") {
        const sumbuX = Math.abs(dx) >= Math.abs(dz);
        const jarak = Math.max(Math.abs(dx), Math.abs(dz));
        o.gulungSumbu = sumbuX ? [0, 0, -Math.sign(dx)] : [Math.sign(dz), 0, 0];
        o.gulungSudut = (Math.PI / 2) * Math.max(1, Math.round(jarak)) * masukKeluar(s);
      } else {
        o.putaranY = Math.PI * 2 * masukKeluar(s);
        o.gulungSumbu = [0, 0, -1];
        o.gulungSudut = Math.PI * 2 * masukKeluar(s);
      }
      return o;
    }
    if (t > l.t1) sebelum = l;
    if (t < l.t0 && !sesudah) sesudah = l;
  }
  // diam di ujung loncatan terakhir yang selesai
  const tujuan = sebelum.b;
  const mendarat = sebelum.t1;
  o.x = tujuan.x; o.z = tujuan.z;
  const dl = t - mendarat;
  let sy = 1 - (dl < 0.4 ? 0.26 * Math.exp(-dl / 0.07) : 0);
  if (sesudah) sy -= 0.14 * sstep(sesudah.t0 - 0.09, sesudah.t0, t);
  o.sy = sy;
  o.alas = tujuan.atas(t);
  o.y = tujuan.atas(t) + setengah * sy;
  if (sebelum === LONCAT[LONCAT.length - 1]) o.y += 0.025 * Math.sin((t - mendarat) * 5);
  return o;
}

/* --------------------------------------------------------------- cabang */
const PANJANG_CABANG = 6.2;
function buatCabang(c, label) {
  const garis = [];
  for (let d = 0.75; d < PANJANG_CABANG - 0.1; d += 0.42) {
    const m = kotak(bahanLam(C.tealGelap, C.teal), gKotakTajam);
    m.scale.set(c.dx ? 0.25 : 0.08, 0.05, c.dz ? 0.25 : 0.08);
    m.position.set(c.x0 + c.dx * d, 0.03, c.z0 + c.dz * d);
    garis.push({ m, d });
  }
  const simpul = [];
  for (let i = 0; i < 5; i++) {
    const d = 2 + i;
    const bahan = bahanLam(C.tealGelap, C.teal);
    bahan.emissiveIntensity = 0;
    const m = kotak(bahan);
    m.position.set(c.x0 + c.dx * d, 0.1, c.z0 + c.dz * d);
    simpul.push({ m, bahan, d });
  }
  const kepala = sprite(texBulat, C.teal, 1.4);
  return { c, garis, simpul, kepala, label };
}
const cabangA = buatCabang(CABANG_A, "LK 2");
const cabangB = buatCabang(CABANG_B, "LK 3");
const waktuSimpul = (cabang, i) => LJ_MULAI + LJ_JEDA * (i * 2 + (cabang === cabangA ? 0 : 1));

/* --------------------------------------------------- peron, pilar, menara */
const peron = kotak(bahanLam(hsl(153, 38, 13), hsl(153, 60, 20)));
peron.scale.set(6.6, 0.24, 4.2);
peron.position.set(PERON.x, 0, PERON.z - 0.5);
const tepiPeron = (() => {
  const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
  const m = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: C.emas, transparent: true, opacity: 0.7 }));
  m.scale.copy(peron.scale); m.position.copy(peron.position);
  adegan.add(m);
  return m;
})();

const PILAR = [
  { nilai: ANGKA.lk1, tinggi: 1.7, x: 14.3, z: 15.0, warna: C.zamrud, emisi: C.zamrudGlow, mulai: 21.4, nama: "peserta LK 1" },
  { nilai: ANGKA.aktif, tinggi: 1.7 * (ANGKA.aktif / ANGKA.lk1), x: 15.5, z: 15.0, warna: hsl(176, 55, 38), emisi: C.teal, mulai: 21.65, nama: "masih aktif" },
  { nilai: ANGKA.rencana, tinggi: 1.7, x: 17.7, z: 15.0, warna: C.emasGelap, emisi: C.emas, mulai: 22.4, nama: "direncanakan" },
  { nilai: ANGKA.terlaksana, tinggi: 1.7 * (ANGKA.terlaksana / ANGKA.rencana), x: 18.9, z: 15.0, warna: hsl(42, 50, 46), emisi: C.emasTerang, mulai: 22.65, nama: "terlaksana" },
].map((p) => {
  const bahan = bahanLam(p.warna, p.emisi);
  bahan.emissiveIntensity = 0.5;
  const m = kotak(bahan);
  return { ...p, m, bahan };
});

const SKALA_MENARA = 0.1;
const skorMenara = (t) => SKOR_AKHIR * masukKeluar(lin(24.55, 27.1, t));
const menaraAtas = (t) => 0.12 + SKALA_MENARA * skorMenara(t);
const bahanMenaraSisi = new THREE.MeshLambertMaterial({ color: hsl(153, 45, 14), emissive: 0xffffff, emissiveMap: texJendela, emissiveIntensity: 0.9 });
const bahanMenaraAtas = bahanLam(hsl(153, 45, 20), C.zamrudGlow);
bahanMenaraAtas.emissiveIntensity = 0.3;
const menara = new THREE.Mesh(gKotakTajam, [bahanMenaraSisi, bahanMenaraSisi, bahanMenaraAtas, bahanMenaraAtas, bahanMenaraSisi, bahanMenaraSisi]);
adegan.add(menara);
const berkasMenara = sprite(texBerkas, C.emasTerang, 1);
berkasMenara.scale.set(1.8, 14, 1);
berkasMenara.center.set(0.5, 0);

const BATAS_TINGKAT = [16, 31, 46, 60]; // tepi atas pita tingkat (skor)
const pita = BATAS_TINGKAT.map((b) => {
  const m = new THREE.Mesh(gBingkaiPita, bahanTambah(C.teal, 0));
  m.position.set(PERON.x, 0.12 + SKALA_MENARA * b, PERON.z);
  adegan.add(m);
  return { m, tinggi: 0.12 + SKALA_MENARA * b, skor: b };
});

/* ------------------------------------------------------------- partikel */
const JUMLAH_DEBU = 130;
const debu = (() => {
  const r = acak(7);
  const data = [];
  for (let i = 0; i < JUMLAH_DEBU; i++) data.push({ x: lerp(PAPAN.x0, PAPAN.x1, r()), z: lerp(PAPAN.z0, PAPAN.z1, r()), y: r() * 7, v: 0.12 + r() * 0.22, f: r() * 6.28 });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(JUMLAH_DEBU * 3), 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({ map: texBulat, color: hsl(152, 70, 60), size: 5, sizeAttenuation: false, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.frustumCulled = false;
  adegan.add(m);
  return { data, m };
})();

/* ---------------------------------------------------------- etiket HTML */
const lapisanEtiket = document.getElementById("lapisan-etiket");
const v3 = new THREE.Vector3();
function buatEtiket(kelas, html) {
  const d = document.createElement("div");
  d.className = `etiket ${kelas}`;
  d.innerHTML = html;
  d.style.display = "none";
  d._tampak = false;
  lapisanEtiket.appendChild(d);
  return d;
}
function taruh(el, x, y, z, op, ox = 0, oy = 0, ax = -50, ay = -50) {
  if (op < 0.01) {
    if (el._tampak) { el.style.display = "none"; el._tampak = false; }
    return;
  }
  v3.set(x, y, z).project(kamera);
  const px = ((v3.x + 1) / 2) * W + ox;
  const py = ((1 - v3.y) / 2) * H + oy;
  // Etiket adegan memudar sebelum menyentuh kepala (di atas) dan panel (di bawah).
  op *= sstep(655, 745, py) * (1 - sstep(1085, 1125, py));
  if (op < 0.01) {
    if (el._tampak) { el.style.display = "none"; el._tampak = false; }
    return;
  }
  if (!el._tampak) { el.style.display = "block"; el._tampak = true; }
  el.style.opacity = op.toFixed(3);
  el.style.transform = `translate(${px.toFixed(1)}px,${py.toFixed(1)}px) translate(${ax}%,${ay}%)`;
}

const eGerbang = buatEtiket("jalur", "/kuis");
const eMulai = buatEtiket("mulai", "Mulai kuis");
const eKubus = buatEtiket("lencana", "komisariat");
const eGrup = KELOMPOK.map((g) => buatEtiket("pil", `<b>${g.nama}</b><small>${g.skor.length} pertanyaan</small>`));
const eTambah = SOAL.map((q) => buatEtiket("tambah", `+${q.skor}`));
const eCabang = [cabangA, cabangB].map((cb) => buatEtiket("lk-label", `${cb.label}<small>5 soal</small>`));
const ePilar = PILAR.map((p) => buatEtiket("nilai", String(p.nilai)));
const ePersen = [buatEtiket("persen-tag", "retensi 65%"), buatEtiket("persen-tag", "program 75%")];
const eTingkat = TINGKAT.map((tk) => buatEtiket("tingkat", `<b>${tk.nama}</b><small>skor ${tk.dari}–${tk.sampai}</small>`));
const eSkorMenara = buatEtiket("nilai", "38/60");

// Anchor etiket kelompok: sisi luar jalur supaya tidak menimpa petak.
const jangkarGrup = KELOMPOK.map((g) => {
  const n = g.skor.length;
  const mx = g.mulai[0] + (g.arah === "x" ? (n - 1) / 2 : 0);
  const mz = g.mulai[1] + (g.arah === "z" ? (n - 1) / 2 : 0);
  return g.arah === "x" ? { x: mx + 0.3, z: mz - 3.2, ax: -50 } : { x: mx - 3.5, z: mz + 0.3, ax: -50 };
});

/* ---------------------------------------------------------------- panel */
const el = (id) => document.getElementById(id);
const panel = el("panel");
const barisInti = KELOMPOK.map((g) => {
  const d = document.createElement("div");
  d.className = "baris";
  d.innerHTML = `<span class="nama">${g.nama}</span><span class="lajur"><span class="isi"></span></span><span class="persen">0%</span>`;
  el("daftar-inti").appendChild(d);
  return { isi: d.querySelector(".isi"), persen: d.querySelector(".persen"), nama: d.querySelector(".nama") };
});
const barisLanjut = ["Pasca-LK 2", "Pasca-LK 3"].map((nama) => {
  const d = document.createElement("div");
  d.className = "lk";
  d.innerHTML = `<div class="judul-lk"><span>${nama}</span><b>0/5</b></div><div class="kotak"><i></i><i></i><i></i><i></i><i></i></div>`;
  el("daftar-lanjut").appendChild(d);
  return { hitung: d.querySelector("b"), kotak: [...d.querySelectorAll("i")] };
});
const barisAngka = [
  { nama: "Retensi kader", a: "peserta LK 1", b: "masih aktif", nilai: [ANGKA.lk1, ANGKA.aktif], persen: Math.round((ANGKA.aktif / ANGKA.lk1) * 100) },
  { nama: "Keterlaksanaan program", a: "direncanakan", b: "terlaksana", nilai: [ANGKA.rencana, ANGKA.terlaksana], persen: Math.round((ANGKA.terlaksana / ANGKA.rencana) * 100) },
].map((r) => {
  const d = document.createElement("div");
  d.className = "angka-baris";
  d.innerHTML = `<div><div class="nama">${r.nama}</div><div class="rinci"></div></div><div class="lajur"><div class="isi"></div></div><div class="besar">0%</div>`;
  el("daftar-angka").appendChild(d);
  return { ...r, rinci: d.querySelector(".rinci"), isi: d.querySelector(".isi"), besar: d.querySelector(".besar") };
});
const chips = [...document.querySelectorAll("#h-chip .chip")];
const modeEl = { inti: el("m-inti"), lanjut: el("m-lanjut"), angka: el("m-angka"), hasil: el("m-hasil") };

/* ------------------------------------------------------------ keterangan */
const ketEl = [...document.querySelectorAll("#ket > p")];
const WARNA_KET = ["hsl(42 33% 96%)", "hsl(42 70% 70%)", "hsl(152 60% 62%)", "hsl(42 70% 70%)", "hsl(176 58% 62%)", "hsl(42 70% 70%)", "hsl(42 33% 96%)"];
ketEl.forEach((p, i) => { p.style.color = WARNA_KET[i]; });
const WAKTU_KET = [[0.9, 3.0], [3.0, 7.0], [7.0, 17.0], [17.0, 21.0], [21.0, 24.0], [24.0, 28.0], [28.0, 30.5]];
document.querySelectorAll(".isi-krem").forEach((e) => { e.style.color = "hsl(42 33% 98%)"; });

const alurEl = [...document.querySelectorAll("#alur span")];
const WAKTU_ALUR = [[3.0, 7.0], [7.0, 17.0], [17.0, 21.0], [21.0, 24.0], [24.0, 28.0]];
const rgb = (h, s, l) => { const c = new THREE.Color().setStyle(`hsl(${h}, ${s}%, ${l}%)`).convertLinearToSRGB(); return [c.r * 255, c.g * 255, c.b * 255]; };
const A_REDUP = rgb(150, 14, 32), A_EMAS = rgb(42, 75, 72), A_ZAMRUD = rgb(152, 55, 52);
const campur = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);

/* ---------------------------------------------------------------- kamera */
const BIDIK = {
  atas: { x: 6.5, y: 0, z: 8 },
  gerbang: { x: -2.9, y: 0.3, z: 0 },
  cabang: { x: 14.6, y: 0.3, z: 14.6 },
  peron: { x: 16.45, y: 0.5, z: 15.9 },
  menara: { x: 16.5, y: 2.55, z: 16.5 },
  tutup: { x: 8.2, y: 1.0, z: 9.4 },
};
const campurBidik = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k) });
const EL_ISO = 35.264 * Math.PI / 180;

function ikuti(t) {
  let sx = 0, sz = 0;
  const N = 9;
  for (let i = 0; i < N; i++) {
    const k = keadaanKubus(t - 0.4 + (i / (N - 1)) * 0.6);
    sx += k.x; sz += k.z;
  }
  return { x: sx / N, y: 0.3, z: sz / N };
}

function bidikKamera(t) {
  let b;
  let ppu, el, xc = 540, yc = 915;
  // fase pembuka: turun dari pandangan atas ke gerbang
  const kTurun = masukKeluar(lin(1.0, 3.1, t));
  if (t < 3.1) {
    b = campurBidik(BIDIK.atas, BIDIK.gerbang, kTurun);
  } else if (t < 6.2) {
    b = BIDIK.gerbang;
  } else if (t < 20.5) {
    b = campurBidik(BIDIK.gerbang, ikuti(t), sstep(6.2, 7.5, t));
    b = campurBidik(b, BIDIK.cabang, sstep(16.4, 18.2, t));
  } else if (t < 22.0) {
    b = campurBidik(BIDIK.cabang, BIDIK.peron, masukKeluar(lin(20.4, 22.0, t)));
  } else if (t < 24.2) {
    b = campurBidik(BIDIK.cabang, BIDIK.peron, masukKeluar(lin(20.4, 22.0, t)));
  } else if (t < 27.6) {
    b = campurBidik(BIDIK.peron, BIDIK.menara, masukKeluar(lin(24.3, 26.6, t)));
  } else {
    b = campurBidik(BIDIK.menara, BIDIK.tutup, masukKeluar(lin(27.6, 29.8, t)));
  }
  // zoom dan sudut
  const zTurun = masukKeluar(lin(1.0, 3.1, t));
  if (t < 3.1) {
    ppu = lerp(22 + t * 1.1, 92, zTurun);
    el = lerp(62 * Math.PI / 180, EL_ISO, zTurun);
  } else if (t < 16.4) {
    ppu = lerp(92 + 4 * lin(3.1, 6.2, t), 80, sstep(6.2, 7.6, t)); el = EL_ISO;
  } else if (t < 20.5) {
    ppu = lerp(80, 66, masukKeluar(lin(16.4, 18.2, t))) + 3 * lin(18.2, 20.5, t);
    el = EL_ISO;
  } else if (t < 24.3) {
    ppu = lerp(69, 66, masukKeluar(lin(20.4, 22.0, t)));
    yc = lerp(915, 945, masukKeluar(lin(20.4, 22.0, t)));
    el = EL_ISO;
  } else if (t < 27.6) {
    ppu = lerp(66, 57, masukKeluar(lin(24.3, 26.6, t)));
    el = EL_ISO;
    xc = lerp(540, 390, masukKeluar(lin(24.3, 26.6, t)));
    yc = lerp(945, 925, masukKeluar(lin(24.3, 26.6, t)));
  } else {
    const k = masukKeluar(lin(27.6, 29.8, t));
    ppu = lerp(57, 26, k);
    el = lerp(EL_ISO, 48 * Math.PI / 180, k);
    xc = lerp(390, 540, k);
    yc = lerp(925, 872, k);
  }
  return { ...b, ppu, el, xc, yc };
}

function aturKamera(v) {
  const az = Math.PI / 4;
  const ce = Math.cos(v.el), se = Math.sin(v.el);
  const D = 90;
  kamera.position.set(v.x + D * ce * Math.cos(az), v.y + D * se, v.z + D * ce * Math.sin(az));
  kamera.lookAt(v.x, v.y, v.z);
  kamera.left = -v.xc / v.ppu;
  kamera.right = (W - v.xc) / v.ppu;
  kamera.top = v.yc / v.ppu;
  kamera.bottom = -(H - v.yc) / v.ppu;
  kamera.updateProjectionMatrix();
  kamera.updateMatrixWorld(true);
}

/* ----------------------------------------------------------- keadaan skor */
function keadaanSkor(t) {
  const per = KELOMPOK.map(() => 0);
  let total = 0, n = 0;
  for (const q of SOAL) {
    const a = sstep(q.T, q.T + 0.3, t);
    per[q.g] += q.skor * a;
    total += q.skor * a;
    if (t >= q.T) n++;
  }
  return { per, total, n };
}

/* ------------------------------------------------------------- gambar */
const gelap = el("gelap");
const kepalaEl = el("kepala");
const url = el("url");
const titikPanel = el("p-titik");

function tampilkan(t) {
  t = clamp(t, 0, DURASI);
  aturKamera(bidikKamera(t));

  /* ---- papan dan debu */
  grid.material.opacity = 0.16 + 0.07 * Math.sin(t * 0.9) + 0.08 * sstep(26, 29, t);
  tepi.material.opacity = 0.45 + 0.1 * Math.sin(t * 1.3);
  {
    const pos = debu.m.geometry.attributes.position;
    debu.data.forEach((d, i) => {
      pos.setXYZ(i, d.x + 0.6 * Math.sin(t * 0.35 + d.f), (d.y + d.v * t) % 7, d.z + 0.6 * Math.cos(t * 0.3 + d.f));
    });
    pos.needsUpdate = true;
  }

  /* ---- pembuka: kepala cahaya menyalakan jalur */
  const s = kepalaCahaya(t);
  const sisaJejak = 1 - sstep(2.9, 3.7, t);

  /* ---- petak soal */
  for (const q of SOAL) {
    const u = ubin[q.k];
    const ans = sstep(q.T, q.T + 0.35, t);
    const emas = jendela(t, q.T - 0.3, q.T - 0.12, q.T + 0.02, q.T + 0.3);
    const flash = bayang(t, q.T);
    const lewat = Math.exp(-Math.pow((s - q.s) / 0.8, 2));
    const sisa = sstep(q.s - 0.3, q.s + 0.2, s) * 0.16 * sisaJejak;
    const akhir = sstep(26.5, 28.6, t) * 0.18;
    u.bahan.color.copy(C.ubinGelap).lerp(C.zamrud, ans).lerp(C.emasGelap, emas * 0.85);
    u.bahan.emissive.copy(C.zamrudGlow).lerp(C.emas, emas);
    u.bahan.emissiveIntensity = ans * 0.3 + flash * 1.2 + emas * 0.5 + lewat * 0.9 * (t < 3.6 ? 1 : 0) + sisa + akhir * ans;
    const h = Math.max(0.001, tinggiUbin(q.k, t));
    u.m.scale.set(0.84, h, 0.84);
    u.m.position.y = h / 2;
  }
  for (const r of rel) {
    const lewat = Math.exp(-Math.pow((s - r.s) / 0.9, 2));
    let nyala = sstep(r.s - 0.3, r.s + 0.2, s) * 0.2 * sisaJejak;
    if (r.setelah !== undefined) nyala = Math.max(nyala, sstep(SOAL[r.setelah].T - 0.4, SOAL[r.setelah].T, t) * 0.6);
    else nyala = Math.max(nyala, sstep(T_KE_PAD[0], T_LEWAT[1], t) * 0.5);
    r.m.material.emissiveIntensity = nyala + lewat * (t < 3.6 ? 1.1 : 0);
    r.m.visible = s > r.s - 1.4;
  }

  /* ---- penanda petak berikutnya */
  {
    let nx = null;
    for (const q of SOAL) if (q.T > t) { nx = q; break; }
    const op = nx && t > 6.2 ? 0.55 + 0.35 * Math.sin(t * 14) : 0;
    bingkai.visible = op > 0.01;
    if (nx) {
      bingkai.position.set(nx.x, tinggiUbin(nx.k, t) + 0.015, nx.z);
      bingkai.material.opacity = clamp(op) * sstep(6.2, 6.8, t);
    }
  }
  // riak saat mendarat (tiga cincin bergantian)
  cincinPool.forEach((m, r) => {
    let k = -1;
    for (const q of SOAL) if (q.T <= t && q.k % 3 === r) k = q.k;
    if (k < 0) { m.visible = false; return; }
    const dt = t - SOAL[k].T;
    const p = lin(0, 0.55, dt);
    m.visible = p < 1;
    m.position.set(SOAL[k].x, tinggiUbin(k, SOAL[k].T) + 0.02, SOAL[k].z);
    m.scale.setScalar(lerp(0.9, 2.1, keluar(p)));
    m.material.opacity = (1 - p) * 0.85;
  });

  /* ---- gerbang dan tombol */
  {
    const naik = keluarBalik(lin(T_GERBANG, T_GERBANG + 0.7, t));
    gerbang.visible = t > T_GERBANG;
    gerbang.scale.set(1, Math.max(0.001, naik), 1);
    const nyala = sstep(T_GERBANG + 0.4, T_GERBANG + 1.3, t);
    bahanGerbang.emissiveIntensity = nyala * (0.26 + 0.05 * Math.sin(t * 5));
    const buka = sstep(T_TEKAN + 0.05, T_TEKAN + 0.5, t);
    const lewatGerbang = bayang(t, lerp(T_LEWAT[0], T_LEWAT[1], 0.4545));
    portal.material.opacity = (0.0 + 0.55 * nyala) * (0.45 + 0.55 * buka) * (0.9 + 0.1 * Math.sin(t * 9)) + 0.9 * lewatGerbang * (t > T_LEWAT[0] ? 1 : 0);
    portal.visible = t > T_GERBANG + 0.3;

    const padOp = sstep(T_PAD, T_PAD + 0.6, t);
    padDasar.visible = padTombol.visible = padOp > 0.001;
    padDasar.scale.y = 0.1 * padOp + 0.001;
    padDasar.position.y = 0.05 * padOp;
    bahanPad.emissiveIntensity = padOp * 0.12;
    padTombol.position.set(PADX, tinggiTombol(t) - 0.05 + 0.005, 0);
    padTombol.scale.set(1.0, 0.1, 1.0);
    const tombolNyala = padOp * (0.5 + 0.5 * Math.sin(t * 6)) * (1 - sstep(T_TEKAN - 0.1, T_TEKAN, t));
    padTombol.material.emissiveIntensity = 0.3 + 0.4 * tombolNyala + 1.0 * bayang(t, T_TEKAN) * (t >= T_TEKAN ? 1 : 0);
    const pp = lin(0, 0.7, t - T_TEKAN);
    cincinPad.visible = pp > 0 && pp < 1;
    cincinPad.position.set(PADX, 0.14, 0);
    cincinPad.scale.setScalar(lerp(1.0, 3.2, keluar(pp)));
    cincinPad.material.opacity = (1 - pp) * 0.9;
  }

  /* ---- kubus emas */
  {
    const k = keadaanKubus(t);
    kubus.visible = k.tampak;
    kubus.position.set(k.x, k.y, k.z);
    const sxz = 1 / Math.sqrt(k.sy);
    kubus.scale.set(BULAT * sxz * k.skala, BULAT * k.sy * k.skala, BULAT * sxz * k.skala);
    kubus.quaternion.identity();
    if (k.gulungSumbu) {
      sumbu.set(...k.gulungSumbu);
      kubus.quaternion.setFromAxisAngle(sumbu, k.gulungSudut);
    } else if (k.putaranY) {
      kubus.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), k.putaranY);
    }
    bahanKubus.emissiveIntensity = 0.28 + 0.06 * Math.sin(t * 4) + 0.6 * bayang(t, T_JATUH + 0.55) * (t >= T_JATUH ? 1 : 0);
    halo.visible = k.tampak;
    halo.position.set(k.x, k.y, k.z);
    halo.scale.setScalar(2.4 + 0.3 * Math.sin(t * 3) + 0.6 * bayang(t, T_JATUH + 0.55));
    halo.material.opacity = 0.34 * k.skala;
    // genangan cahaya di bawah kubus
    const lantai = k.melayang ? k.y - BULAT / 2 : k.y - (BULAT * k.sy) / 2;
    cahayaAlas.visible = k.tampak;
    cahayaAlas.position.set(k.x, 0.03, k.z);
    cahayaAlas.scale.setScalar(2.4);
    cahayaAlas.material.opacity = 0.5 * k.skala * clamp(1 - lantai * 0.35, 0.2, 1);
    const tinggiDiAtas = Math.max(0, k.y - BULAT / 2 - k.alas);
    bayangKubus.visible = k.tampak;
    bayangKubus.position.set(k.x, k.alas + 0.014, k.z);
    bayangKubus.scale.setScalar(1.25 + 0.25 * tinggiDiAtas);
    bayangKubus.material.opacity = 0.62 * k.skala / (1 + 1.3 * tinggiDiAtas);
    // berkas cahaya saat muncul
    const bk = jendela(t, T_JATUH - 0.15, T_JATUH + 0.1, T_JATUH + 0.45, T_JATUH + 1.2);
    berkasMuncul.visible = bk > 0.01;
    berkasMuncul.position.set(SPAWNX, 0, 0);
    berkasMuncul.material.opacity = bk * 0.8;
  }

  /* ---- cabang pasca-LK 2 dan LK 3 */
  for (const cb of [cabangA, cabangB]) {
    const tampilCb = jendela(t, T_LANJUT - 0.1, T_LANJUT + 0.9, 29.0, 29.8);
    const panjang = keluar(lin(T_LANJUT - 0.1, T_LANJUT + 0.9, t)) * PANJANG_CABANG;
    const lenyap = sstep(21.3, 23.0, t);
    const c = cb.c;
    cb.garis.forEach((g) => {
      const ada = g.d <= panjang;
      g.m.visible = ada && lenyap < 0.98;
      g.m.scale.set(c.dx ? 0.25 : 0.08, 0.05, c.dz ? 0.25 : 0.08).multiplyScalar(1 - lenyap);
      const lewat = (() => { let n = 0; cb.simpul.forEach((sp, i) => { if (t >= waktuSimpul(cb, i) - 0.3 && sp.d >= g.d) n = 1; }); return n; })();
      g.m.material.emissiveIntensity = 0.25 + 0.5 * lewat * sstep(T_LANJUT + 0.5, T_LANJUT + 1, t);
    });
    const redup = 1 - 0.8 * sstep(20.9, 21.6, t);
    cb.simpul.forEach((sp, i) => {
      const tw = waktuSimpul(cb, i);
      const ada = sstep(T_LANJUT + 0.5 + sp.d * 0.07, T_LANJUT + 0.9 + sp.d * 0.07, t);
      const nyala = sstep(tw, tw + 0.25, t);
      sp.m.visible = ada > 0.001;
      const tinggi = (0.1 + 0.34 * keluarBalik(lin(tw, tw + 0.35, t))) * ada * (1 - lenyap) + 0.001;
      sp.m.visible = ada > 0.001 && lenyap < 0.98;
      sp.m.scale.set(0.46 * (1 - lenyap) + 0.001, tinggi, 0.46 * (1 - lenyap) + 0.001);
      sp.m.position.y = tinggi / 2;
      sp.bahan.color.copy(C.tealGelap).lerp(hsl(176, 60, 38), nyala);
      sp.bahan.emissive.copy(C.teal);
      sp.bahan.emissiveIntensity = (nyala * 0.3 + bayang(t, tw) * (t >= tw ? 0.9 : 0)) * redup;
    });
    // kepala cahaya yang berjalan dari simpul ke simpul
    let d = 0, tampak = 0;
    for (let i = 0; i < 5; i++) {
      const tw = waktuSimpul(cb, i);
      const dari = i === 0 ? 0 : cb.simpul[i - 1].d;
      const lama = i === 0 ? 0.75 : 0.5;
      if (t >= tw - lama && t <= tw) { d = lerp(dari, cb.simpul[i].d, masukKeluar((t - (tw - lama)) / lama)); tampak = 1; }
    }
    cb.kepala.visible = tampak > 0;
    cb.kepala.position.set(cb.c.x0 + cb.c.dx * d, 0.35, cb.c.z0 + cb.c.dz * d);
    cb.kepala.material.opacity = tampak;
  }

  /* ---- peron, pilar angka, menara */
  {
    const naikPeron = keluar(lin(20.5, 21.3, t));
    peron.visible = tepiPeron.visible = naikPeron > 0.001;
    peron.scale.y = 0.24 * naikPeron + 0.001;
    tepiPeron.scale.y = peron.scale.y;
    PILAR.forEach((p) => {
      const naik = keluarBalik(lin(p.mulai, p.mulai + 0.7, t)) * (1 - sstep(T_HASIL - 0.1, T_HASIL + 0.5, t));
      const tg = Math.max(0.001, p.tinggi * naik);
      p.m.visible = tg > 0.002;
      p.m.scale.set(0.55, tg, 0.55);
      p.m.position.set(p.x, 0.12 + tg / 2, p.z);
      p.bahan.emissiveIntensity = 0.4 + 0.45 * bayang(t, p.mulai + 0.5) * (t >= p.mulai + 0.5 ? 1 : 0);
    });
    const tgM = SKALA_MENARA * skorMenara(t);
    const adaMenara = t > T_HASIL + 0.35;
    menara.visible = adaMenara && tgM > 0.01;
    menara.scale.set(0.95, Math.max(0.001, tgM), 0.95);
    menara.position.set(PERON.x, 0.12 + tgM / 2, PERON.z);
    texJendela.repeat.set(1, Math.max(0.01, tgM / 1.2));
    bahanMenaraSisi.emissiveIntensity = 0.55 + 0.45 * sstep(26.5, 27.4, t);
    const kunci = bayang(t, 27.1) * (t >= 27.1 ? 1 : 0);
    bahanMenaraAtas.emissiveIntensity = 0.3 + 1.2 * kunci;
    berkasMenara.visible = t > 27.0;
    berkasMenara.position.set(PERON.x, 0.12 + tgM, PERON.z);
    berkasMenara.material.opacity = 0.7 * sstep(27.0, 27.6, t) * (1 - 0.3 * sstep(28, 29, t));
    pita.forEach((p, i) => {
      const ada = sstep(T_HASIL + 0.1 + i * 0.12, T_HASIL + 0.7 + i * 0.12, t);
      const lewat = t > T_HASIL ? sstep(p.skor - 2, p.skor, skorMenara(t)) : 0;
      p.m.visible = ada > 0.001;
      p.m.material.color.copy(C.teal).lerp(C.emasTerang, lewat * 0.7);
      p.m.material.opacity = ada * (0.35 + 0.65 * lewat);
      p.m.scale.setScalar(lerp(1.5, 1, keluar(ada)));
    });
  }

  gambarHtml(t);
  composer.render();
}

/* ------------------------------------------------------------ teks HTML */
function gambarHtml(t) {
  gelap.style.opacity = (1 - sstep(0, 0.7, t)).toFixed(3);

  /* ---- kepala */
  const masukKepala = sstep(0.2, 0.9, t);
  kepalaEl.style.opacity = masukKepala.toFixed(3);
  kepalaEl.style.transform = `translateY(${((1 - masukKepala) * 18).toFixed(1)}px)`;

  alurEl.forEach((sp, i) => {
    const [a, b] = WAKTU_ALUR[i];
    const aktif = jendela(t, a - 0.05, a + 0.3, b - 0.1, b + 0.3);
    const selesai = sstep(b - 0.1, b + 0.3, t);
    let c = campur(A_REDUP, A_EMAS, aktif);
    c = campur(c, A_ZAMRUD, selesai);
    sp.style.color = `rgb(${c[0].toFixed(0)},${c[1].toFixed(0)},${c[2].toFixed(0)})`;
    sp.style.textShadow = aktif > 0.01 ? `0 0 ${(18 * aktif).toFixed(0)}px rgba(230, 190, 90, ${(0.75 * aktif).toFixed(2)})` : "none";
    sp.style.display = "inline-block";
  });

  ketEl.forEach((p, i) => {
    const [a, b] = WAKTU_KET[i];
    const masuk = sstep(a, a + 0.38, t);
    const keluarK = i === ketEl.length - 1 ? 0 : sstep(b - 0.3, b - 0.04, t);
    const op = masuk * (1 - keluarK);
    if (op < 0.005) { p.style.display = "none"; return; }
    p.style.display = "block";
    p.style.opacity = op.toFixed(3);
    p.style.transform = `translateY(${((1 - masuk) * 18 - keluarK * 12).toFixed(1)}px)`;
  });

  /* ---- panel */
  const panelMasuk = sstep(2.5, 3.4, t) * (1 - sstep(T_TUTUP - 0.1, T_TUTUP + 0.4, t));
  panel.style.opacity = panelMasuk.toFixed(3);
  panel.style.display = panelMasuk < 0.005 ? "none" : "block";
  panel.style.transform = `translateY(${((1 - sstep(2.5, 3.4, t)) * 36).toFixed(1)}px)`;
  titikPanel.style.opacity = (0.55 + 0.45 * Math.sin(t * 5.5)).toFixed(2);

  const mIn = 1 - sstep(T_LANJUT - 0.1, T_LANJUT + 0.2, t);
  const mLj = jendela(t, T_LANJUT + 0.1, T_LANJUT + 0.4, T_ANGKA - 0.2, T_ANGKA + 0.1);
  const mAn = jendela(t, T_ANGKA + 0.0, T_ANGKA + 0.3, T_HASIL - 0.2, T_HASIL + 0.1);
  const mHs = sstep(T_HASIL + 0.0, T_HASIL + 0.3, t);
  const setMode = (e, op) => { e.style.opacity = op.toFixed(3); e.style.display = op < 0.005 ? "none" : "block"; };
  setMode(modeEl.inti, mIn); setMode(modeEl.lanjut, mLj); setMode(modeEl.angka, mAn); setMode(modeEl.hasil, mHs);

  const tajuk = el("p-tajuk"), status = el("p-status");
  /* mode inti */
  const sk = keadaanSkor(t);
  if (t < T_LANJUT + 0.1) {
    tajuk.textContent = "SKOR LANGSUNG";
    status.textContent = `Pertanyaan ${sk.n}/20`;
    el("s-nilai").textContent = String(Math.round(sk.total));
    KELOMPOK.forEach((g, i) => {
      const maks = g.skor.length * 3;
      const f = sk.per[i] / maks;
      barisInti[i].isi.style.width = `${(f * 100).toFixed(2)}%`;
      barisInti[i].persen.textContent = `${Math.round(f * 100)}%`;
      const sedang = sk.n >= 1 && sk.n < 20 && SOAL[sk.n - 1].g === i;
      barisInti[i].nama.style.color = sedang ? "hsl(42 75% 72%)" : "";
    });
  }
  /* mode lanjutan */
  if (t >= T_LANJUT + 0.1 && t < T_ANGKA + 0.1) {
    tajuk.textContent = "SOAL LANJUTAN";
    let nl = 0; const per = [0, 0];
    [cabangA, cabangB].forEach((cb, b) => cb.simpul.forEach((sp, i) => { if (t >= waktuSimpul(cb, i)) { nl++; per[b]++; } }));
    status.textContent = `Lanjutan ${nl}/10`;
    el("l-nilai").textContent = String(nl);
    barisLanjut.forEach((r, b) => {
      r.hitung.textContent = `${per[b]}/5`;
      r.kotak.forEach((k, i) => {
        const tw = waktuSimpul(b === 0 ? cabangA : cabangB, i);
        const f = sstep(tw, tw + 0.2, t);
        k.style.background = `rgb(${lerp(23, 62, f).toFixed(0)},${lerp(38, 207, f).toFixed(0)},${lerp(31, 196, f).toFixed(0)})`;
        k.style.boxShadow = f > 0.01 ? `0 0 ${(14 * f).toFixed(0)}px rgba(60, 220, 200, ${(0.7 * f).toFixed(2)})` : "none";
      });
    });
  }
  /* mode angka */
  if (t >= T_ANGKA && t < T_HASIL + 0.1) {
    tajuk.textContent = "4 ANGKA";
    status.textContent = "retensi dan program";
    barisAngka.forEach((r, i) => {
      const a = keluar(lin(i === 0 ? 21.4 : 22.4, i === 0 ? 22.6 : 23.6, t));
      r.rinci.innerHTML = `<b>${Math.round(r.nilai[0] * a)}</b> ${r.a} → <b>${Math.round(r.nilai[1] * a)}</b> ${r.b}`;
      r.isi.style.width = `${(r.persen * a).toFixed(1)}%`;
      r.besar.textContent = `${Math.round(r.persen * a)}%`;
    });
  }
  /* mode hasil */
  if (t >= T_HASIL) {
    const sc = Math.round(skorMenara(t));
    const idx = TINGKAT.findIndex((tk) => sc >= tk.dari && sc <= tk.sampai);
    tajuk.textContent = "HASIL KUIS";
    status.textContent = `Skor ${sc}/60`;
    el("h-nilai").textContent = String(sc);
    el("h-tingkat").textContent = TINGKAT[idx].nama;
    el("h-rentang").textContent = `tingkat ${idx + 1} dari 4 · skor ${TINGKAT[idx].dari}–${TINGKAT[idx].sampai}`;
    chips.forEach((c, i) => {
      const op = sstep(25.5 + i * 0.55, 25.85 + i * 0.55, t);
      c.style.opacity = op.toFixed(3);
      c.style.transform = `translateY(${((1 - op) * 10).toFixed(1)}px)`;
    });
  }

  /* ---- penutup */
  const urlOp = sstep(T_TUTUP + 0.6, T_TUTUP + 1.2, t);
  url.style.opacity = urlOp.toFixed(3);
  url.style.display = urlOp < 0.005 ? "none" : "block";
  url.style.transform = `translateY(${((1 - urlOp) * 22).toFixed(1)}px)`;

  /* ---- etiket di adegan */
  const kb = keadaanKubus(t);
  const op = (a, b, c, d) => jendela(t, a, b, c, d);
  taruh(eGerbang, GX, 2.75, 0, op(T_GERBANG + 0.6, T_GERBANG + 1.1, 7.0, 7.6), 0, 0, -50, -100);
  taruh(eMulai, PADX + 0.4, 0.1, 2.0, op(T_PAD + 0.2, T_PAD + 0.7, T_LEWAT[0] + 0.3, T_LEWAT[0] + 0.7), 0, 0, -50, -50);
  taruh(eKubus, kb.x, kb.y + 0.45, kb.z, op(T_JATUH + 0.6, T_JATUH + 1.0, T_LEWAT[0] - 0.25, T_LEWAT[0] + 0.15) * (kb.tampak ? 1 : 0), 0, -6, -50, -100);

  KELOMPOK.forEach((g, i) => {
    const first = SOAL.find((q) => q.g === i);
    const last = [...SOAL].reverse().find((q) => q.g === i);
    const entra = first.T - 0.45;
    const sedang = jendela(t, entra, entra + 0.3, last.T + 0.05, last.T + 0.5);
    const opLab = sstep(entra, entra + 0.3, t) * (1 - sstep(T_LANJUT, T_LANJUT + 0.5, t)) * (0.5 + 0.5 * sedang);
    const pilEl = eGrup[i];
    pilEl.style.borderColor = sedang > 0.5 ? "hsl(42 52% 58% / 0.9)" : "hsl(152 55% 40% / 0.55)";
    taruh(pilEl, jangkarGrup[i].x, 0.3, jangkarGrup[i].z, opLab, 0, (1 - sstep(entra, entra + 0.3, t)) * 14, -50, -50);
  });
  SOAL.forEach((q) => {
    const dt = t - q.T;
    const o = dt < 0 ? 0 : dt < 0.12 ? dt / 0.12 : 1 - sstep(0.18, 0.62, dt);
    taruh(eTambah[q.k], q.x, 0.9, q.z, o, 0, -dt * 48 - 52, -50, -100);
  });

  [cabangA, cabangB].forEach((cb, i) => {
    const o = op(T_LANJUT + 0.6, T_LANJUT + 1.1, T_ANGKA - 0.4, T_ANGKA + 0.1);
    const d = PANJANG_CABANG + 0.9;
    taruh(eCabang[i], cb.c.x0 + cb.c.dx * d, 0.2, cb.c.z0 + cb.c.dz * d, o, 0, 34, -50, -50);
  });

  PILAR.forEach((p, i) => {
    const naik = keluarBalik(lin(p.mulai, p.mulai + 0.7, t)) * (1 - sstep(T_HASIL - 0.1, T_HASIL + 0.5, t));
    const a = i < 2 ? keluar(lin(21.4, 22.6, t)) : keluar(lin(22.4, 23.6, t));
    ePilar[i].textContent = String(Math.round(p.nilai * a));
    taruh(ePilar[i], p.x, 0.12 + p.tinggi * naik + 0.15, p.z, sstep(p.mulai + 0.3, p.mulai + 0.7, t) * (1 - sstep(T_HASIL - 0.1, T_HASIL + 0.3, t)), 0, 0, -50, -100);
  });
  [[0, 1, 22.5], [2, 3, 23.5]].forEach(([a, b, tm], i) => {
    const mx = (PILAR[a].x + PILAR[b].x) / 2;
    const tinggiMaks = Math.max(PILAR[a].tinggi, PILAR[b].tinggi);
    taruh(ePersen[i], mx, 0.12 + tinggiMaks + 0.15, PILAR[a].z, sstep(tm, tm + 0.35, t) * (1 - sstep(T_HASIL - 0.1, T_HASIL + 0.3, t)), 0, -52, -50, -100);
  });

  const sc = skorMenara(t);
  TINGKAT.forEach((tk, i) => {
    const tengah = SKALA_MENARA * ((tk.dari + (i === 3 ? 60 : BATAS_TINGKAT[i])) / 2);
    const aktif = sc >= tk.dari - 0.5 && sc < (i === 3 ? 61 : BATAS_TINGKAT[i]) ? 1 : 0;
    const lewat = sc >= BATAS_TINGKAT[i] ? 1 : 0;
    const e = eTingkat[i];
    const final = t > 27.1 && i === 2;
    e.style.borderColor = aktif ? "hsl(42 60% 62%)" : lewat ? "hsl(152 55% 40% / 0.8)" : "hsl(152 30% 28% / 0.7)";
    e.style.boxShadow = final ? "0 0 26px hsl(42 60% 58% / 0.55)" : "none";
    e.children[0].style.color = aktif ? "hsl(42 75% 72%)" : lewat ? "hsl(152 55% 70%)" : "hsl(150 12% 58%)";
    e.children[1].style.color = aktif ? "hsl(42 52% 58%)" : "hsl(150 14% 46%)";
    const o = sstep(T_HASIL + 0.3 + i * 0.12, T_HASIL + 0.8 + i * 0.12, t) * (1 - sstep(T_TUTUP - 0.2, T_TUTUP + 0.3, t));
    taruh(e, PERON.x + 1.7, 0.12 + tengah, PERON.z - 1.7, o, 0, 0, 0, -50);
  });
  taruh(eSkorMenara, PERON.x - 1.5, 0.12 + SKALA_MENARA * sc + 0.45, PERON.z + 1.5, sstep(T_HASIL + 0.8, T_HASIL + 1.2, t) * (1 - sstep(T_TUTUP - 0.2, T_TUTUP + 0.3, t)), 0, 0, -100, -50);
  eSkorMenara.textContent = `${Math.round(sc)}/60`;
}

/* ----------------------------------------------------------------- siap */
window.tampilkan = tampilkan;

const cssFont = document.getElementById("css-font");
const cssSiap = new Promise((ok) => {
  if (cssFont.sheet) ok();
  else { cssFont.addEventListener("load", ok); cssFont.addEventListener("error", ok); }
});
window.siap = (async () => {
  await cssSiap;
  await Promise.all([
    document.fonts.load('700 68px "Noto Serif"'),
    document.fonts.load('500 24px "DM Sans"'),
    document.fonts.load('700 24px "DM Sans"'),
    document.fonts.load('500 24px "JetBrains Mono"'),
    document.fonts.load('700 24px "JetBrains Mono"'),
    document.fonts.load('700 30px "Noto Serif"', "Jangan bicara HMI tanpa bukti."),
  ]);
  await document.fonts.ready;
  tampilkan(BEKU !== null && !MODE_REKAM ? Number(BEKU) : 0);
})();

if (!MODE_REKAM) {
  window.siap.then(() => {
    if (BEKU !== null) { tampilkan(Number(BEKU)); return; }
    const putar = () => { tampilkan((performance.now() / 1000) % DURASI); requestAnimationFrame(putar); };
    requestAnimationFrame(putar);
  });
}
