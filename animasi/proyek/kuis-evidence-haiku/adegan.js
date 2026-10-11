import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

// ---------- Konstanta frame dan skala ----------
const LEBAR = 1080;
const TINGGI = 1920;
const S = 88; // piksel per satuan dunia
const PUSAT_Y = 1000; // posisi layar titik asal dunia (y)
const PUSAT_X = 540;

window.DURASI = 30;

// ---------- Helper deterministik ----------
const klem01 = (x) => Math.min(1, Math.max(0, x));
const seg = (t, a, b) => klem01((t - a) / (b - a));
const halus = (x) => x * x * (3 - 2 * x);
const keluar = (x) => 1 - Math.pow(1 - klem01(x), 3);
const lerp = (a, b, u) => a + (b - a) * u;

// ---------- Data kuis (angka contoh, sesuai spek) ----------
const KELOMPOK = [
  { judul: "Kaderisasi", skor: [2, 2, 2, 2, 1] },
  { judul: "Tata Kelola", skor: [2, 2, 2, 2] },
  { judul: "Pengetahuan", skor: [2, 1, 2] },
  { judul: "Target Program", skor: [3, 2, 2] },
  { judul: "Evaluasi dan Arsip", skor: [2, 2, 2] },
  { judul: "Data dan Jaringan", skor: [2, 1] },
];
const SOAL = []; // urutan pertanyaan: { skor, grup, posisi }
KELOMPOK.forEach((g, gi) => g.skor.forEach((s, pi) => SOAL.push({ skor: s, grup: gi, posisi: pi })));
const TOTAL_SKOR = SOAL.reduce((a, s) => a + s.skor, 0); // 38

// ---------- Warna ----------
const warna = (h, s, l) => new THREE.Color().setHSL(h / 360, s / 100, l / 100, THREE.SRGBColorSpace);
const WARNA = {
  latar: warna(153, 50, 7),
  gelap: warna(153, 34, 13),
  zamrud: warna(153, 62, 46),
  emas: warna(42, 52, 58),
  garis: warna(153, 30, 26),
};

// ---------- Renderer, kamera, pasca-proses ----------
const kanvas = document.getElementById("adegan");
const renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(LEBAR, TINGGI, false);

const adegan = new THREE.Scene();
adegan.background = WARNA.latar;

// Ortografis isometrik: satuan layar = S piksel.
const kamera = new THREE.OrthographicCamera(-LEBAR / 2 / S, LEBAR / 2 / S, TINGGI / 2 / S, -TINGGI / 2 / S, 0.1, 100);
const ARAH = new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(20);

adegan.add(new THREE.AmbientLight(0xffffff, 0.75));
const cahaya = new THREE.DirectionalLight(0xffffff, 1.4);
cahaya.position.set(3, 8, 5);
adegan.add(cahaya);

const komposer = new EffectComposer(renderer);
komposer.setSize(LEBAR, TINGGI);
komposer.addPass(new RenderPass(adegan, kamera));
const bloom = new UnrealBloomPass(new THREE.Vector2(LEBAR, TINGGI), 0.55, 0.55, 0.62);
komposer.addPass(bloom);
komposer.addPass(new OutputPass());

// ---------- Tata letak papan ----------
// Enam baris (satu per kelompok), tiap petak sejajar di tengah baris.
const JARAK_X = 1.1;
const JARAK_Z = 1.04;
const PETAK = []; // { pos, bahan, skorIdx, grup }
const pusatBaris = [];
KELOMPOK.forEach((g, gi) => {
  const z = (gi - 2.5) * JARAK_Z;
  const n = g.skor.length;
  pusatBaris.push({ x: 0, z, n, awal: (-(n - 1) / 2) * JARAK_X });
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * JARAK_X;
    PETAK.push({ pos: new THREE.Vector3(x, 0.09, z), grup: gi, posisi: i });
  }
});
// Indeks global setiap petak sama dengan indeks SOAL.
PETAK.forEach((p, k) => {
  p.skor = SOAL[k].skor;
  p.bahan = new THREE.MeshStandardMaterial({ color: WARNA.gelap, roughness: 0.75, metalness: 0.05, emissive: new THREE.Color(0, 0, 0) });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.18, 0.94), p.bahan);
  mesh.position.copy(p.pos);
  adegan.add(mesh);
});

// Gerbang "/kuis" di kiri atas papan.
const GERBANG = new THREE.Vector3(-4.2, 0, 2.0);
const bahanGerbang = new THREE.MeshStandardMaterial({ color: WARNA.gelap, emissive: WARNA.zamrud, emissiveIntensity: 0, roughness: 0.6 });
const gerbang = new THREE.Group();
[-0.45, 0.45].forEach((x) => {
  const tiang = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.6, 0.16), bahanGerbang);
  tiang.position.set(x, 0.8, 0);
  gerbang.add(tiang);
});
const palang = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.18), bahanGerbang);
palang.position.set(0, 1.65, 0);
gerbang.add(palang);
gerbang.position.copy(GERBANG);
adegan.add(gerbang);

// Cabang LK 2 dan LK 3 (garis putus-putus ke dua simpul).
const SIMPUL_LK2 = new THREE.Vector3(2.4, 0.09, -1.4);
const SIMPUL_LK3 = new THREE.Vector3(3.6, 0.09, -2.2);
const bahanCabang = new THREE.LineDashedMaterial({ color: WARNA.emas, dashSize: 0.14, gapSize: 0.1, transparent: true, opacity: 0 });
[SIMPUL_LK2, SIMPUL_LK3].forEach((simpul) => {
  const ujung = PETAK[19].pos;
  const garis = new THREE.BufferGeometry().setFromPoints([ujung.clone().setY(0.2), simpul.clone().setY(0.2)]);
  const l = new THREE.Line(garis, bahanCabang);
  l.computeLineDistances();
  adegan.add(l);
});
const bahanSimpul = [0, 1].map(() => new THREE.MeshStandardMaterial({ color: WARNA.gelap, emissive: WARNA.emas, emissiveIntensity: 0, roughness: 0.6 }));
[SIMPUL_LK2, SIMPUL_LK3].forEach((simpul, i) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.7), bahanSimpul[i]);
  m.position.copy(simpul);
  adegan.add(m);
});

// Empat pilar angka (tinggi sebanding nilai; LK 1 = 40 jadi tinggi penuh).
const NILAI_PILAR = [40, 26, 12, 9];
const POS_PILAR = [new THREE.Vector3(1.6, 0, 1.6), new THREE.Vector3(2.1, 0, 1.1), new THREE.Vector3(2.6, 0, 0.6), new THREE.Vector3(3.1, 0, 0.1)];
const TINGGI_PILAR = 2.2;
const pilar = POS_PILAR.map((p, i) => {
  const bahan = new THREE.MeshStandardMaterial({ color: WARNA.gelap, emissive: WARNA.zamrud, emissiveIntensity: 0.2, roughness: 0.5 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1, 0.46), bahan);
  m.position.set(p.x, 0, p.z);
  adegan.add(m);
  return { mesh: m, bahan, tinggi: (NILAI_PILAR[i] / 40) * TINGGI_PILAR };
});

// Menara hasil dan empat pita tingkat.
const POS_MENARA = new THREE.Vector3(-1.0, 0, -4.2);
const TINGGI_MENARA = 2.6;
const bahanMenara = new THREE.MeshStandardMaterial({ color: WARNA.zamrud, emissive: WARNA.zamrud, emissiveIntensity: 0.35, roughness: 0.45 });
const menara = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1, 0.62), bahanMenara);
menara.position.copy(POS_MENARA);
adegan.add(menara);
const BATAS_TINGKAT = [15, 30, 45, 60];
const bahanPita = new THREE.MeshStandardMaterial({ color: WARNA.gelap, emissive: WARNA.emas, emissiveIntensity: 0.1, transparent: true, opacity: 0 });
const pita = BATAS_TINGKAT.map((b) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.03, 1.5), bahanPita.clone());
  m.position.set(POS_MENARA.x, (b / 60) * TINGGI_MENARA, POS_MENARA.z);
  adegan.add(m);
  return m;
});

// Kubus emas yang berjalan.
const bahanKubus = new THREE.MeshStandardMaterial({ color: WARNA.emas, emissive: WARNA.emas, emissiveIntensity: 0.25, roughness: 0.4 });
const kubus = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), bahanKubus);
adegan.add(kubus);

// ---------- Lintasan kubus ----------
// Lompatan ke petak k: 7.0 + 0.5k sampai 7.5 + 0.5k; petak k dijawab pada 7.5 + 0.5k.
const JAWAB_MULAI = 7.0;
const LANGKAH_JAWAB = 0.5;
const tibaJawab = (k) => JAWAB_MULAI + LANGKAH_JAWAB * (k + 1);
const TINGGI_KUBUS = 0.43; // pusat kubus di atas permukaan petak

function titikLompat(a, b, u, puncak) {
  const p = a.clone().lerp(b, u);
  p.y = TINGGI_KUBUS + Math.sin(Math.PI * u) * puncak;
  return p;
}

function posisiKubus(t) {
  const gerbangTitik = new THREE.Vector3(GERBANG.x, TINGGI_KUBUS, GERBANG.z + 1.0);
  const atasPetak = (k) => new THREE.Vector3(PETAK[k].pos.x, TINGGI_KUBUS, PETAK[k].pos.z);
  if (t < 3.4) return null;
  // Muncul di gerbang lalu melompat ke petak 0..19.
  for (let k = 0; k < SOAL.length; k++) {
    const mulai = JAWAB_MULAI + LANGKAH_JAWAB * k;
    const akhir = mulai + LANGKAH_JAWAB;
    const asal = k === 0 ? gerbangTitik : atasPetak(k - 1);
    if (t < mulai) {
      return k === 0 ? gerbangTitik.clone() : atasPetak(k - 1);
    }
    if (t <= akhir) return titikLompat(asal, atasPetak(k), halus(seg(t, mulai, akhir)), 0.9);
  }
  // Cabang: ke LK 2 (17.2–18.2), lalu ke LK 3 (19.2–20.2).
  const akhirPapan = atasPetak(SOAL.length - 1);
  const titikLK2 = new THREE.Vector3(SIMPUL_LK2.x, TINGGI_KUBUS, SIMPUL_LK2.z);
  const titikLK3 = new THREE.Vector3(SIMPUL_LK3.x, TINGGI_KUBUS, SIMPUL_LK3.z);
  if (t < 17.2) return akhirPapan;
  if (t < 18.2) return titikLompat(akhirPapan, titikLK2, halus(seg(t, 17.2, 18.2)), 0.9);
  if (t < 19.2) return titikLK2;
  if (t < 20.2) return titikLompat(titikLK2, titikLK3, halus(seg(t, 19.2, 20.2)), 0.9);
  if (t < 24.0) return titikLK3;
  // Naik ke puncak menara pada 24.0–24.8, lalu ikut naiknya menara.
  const puncakMenara = (skor) => new THREE.Vector3(POS_MENARA.x, TINGGI_MENARA * (skor / 60) + TINGGI_KUBUS, POS_MENARA.z);
  const skorSaatIni = skorMenara(t);
  const tujuan = puncakMenara(skorSaatIni);
  if (t < 24.8) return titikLompat(titikLK3, tujuan, halus(seg(t, 24.0, 24.8)), 1.1);
  return tujuan;
}

// Skor yang tampil di menara: 0 -> 38 antara 24.0 dan 26.8.
function skorMenara(t) {
  return Math.round(TOTAL_SKOR * keluar(seg(t, 24.0, 26.8)));
}

// ---------- Pembaruan visual per frame (fungsi murni dari t) ----------
function petakKeadaan(t) {
  PETAK.forEach((p, k) => {
    const tiba = tibaJawab(k);
    const sudahDijawab = seg(t, tiba, tiba + 0.25);
    const sedangAktif = t >= tiba - 0.05 && t < tiba + 0.2;
    const c = WARNA.gelap.clone();
    if (sedangAktif) c.copy(WARNA.emas);
    else c.lerp(WARNA.zamrud, halus(sudahDijawab));
    p.bahan.color.copy(c);
    const sumber = sedangAktif ? WARNA.emas : WARNA.zamrud;
    p.bahan.emissive.copy(sumber).multiplyScalar(sedangAktif ? 0.4 : halus(sudahDijawab) * 0.3);
  });
}

function gerbangKeadaan(t) {
  const nyala = halus(seg(t, 3.2, 3.8));
  bahanGerbang.emissiveIntensity = nyala * 0.9;
}

function cabangKeadaan(t) {
  bahanCabang.opacity = halus(seg(t, 16.8, 17.4)) * (1 - halus(seg(t, 22.6, 23.0)));
  const nyalaLK2 = halus(seg(t, 17.8, 18.4));
  const nyalaLK3 = halus(seg(t, 19.6, 20.2));
  bahanSimpul[0].emissiveIntensity = nyalaLK2 * 0.7;
  bahanSimpul[1].emissiveIntensity = nyalaLK3 * 0.7;
}

const naikPilar = (t, i) => keluar(seg(t, 21.0 + i * 0.12, 22.6 + i * 0.12));

function pilarKeadaan(t) {
  pilar.forEach((p, i) => {
    p.mesh.visible = t >= 20.9 && t < 24.2;
    const tinggi = Math.max(0.05, p.tinggi * naikPilar(t, i));
    p.mesh.scale.y = tinggi;
    p.mesh.position.y = tinggi / 2;
  });
}

function menaraKeadaan(t) {
  menara.visible = t >= 23.8;
  pita.forEach((m) => (m.visible = t >= 23.8));
  const skor = skorMenara(t);
  const tinggi = Math.max(0.05, (skor / 60) * TINGGI_MENARA);
  menara.scale.y = tinggi;
  menara.position.y = tinggi / 2;
  pita.forEach((m, i) => {
    m.material.opacity = halus(seg(t, 23.8, 24.6)) * 0.85;
  });
}

function kubusKeadaan(t, posisi) {
  if (!posisi) {
    kubus.visible = false;
    return;
  }
  kubus.visible = true;
  const muncul = keluar(seg(t, 3.4, 3.9));
  kubus.position.copy(posisi);
  kubus.scale.setScalar(Math.max(0.001, muncul));
  kubus.rotation.set(0, Math.PI / 4 * Math.min(1, Math.max(0, (t - 3.4) / 3)), 0);
}

// ---------- Kamera: isometrik, bergeser pelan mengikuti kubus ----------
function kameraKeadaan(t, posisi) {
  const ikut = posisi ? posisi.clone().multiplyScalar(0.15) : new THREE.Vector3();
  // Pembuka: kamera turun dari sudut lebih tinggi; penutup: menjauh.
  const turun = 1 - halus(seg(t, 0, 3));
  const jauh = halus(seg(t, 28, 30));
  const skala = 1 + turun * 0.35 + jauh * 0.25;
  // Titik asal dunia jatuh pada y = PUSAT_Y piksel dari atas layar.
  kamera.left = -LEBAR / 2 / (S / skala);
  kamera.right = LEBAR / 2 / (S / skala);
  kamera.top = (PUSAT_Y / S) * skala;
  kamera.bottom = ((PUSAT_Y - TINGGI) / S) * skala;
  const titikTuju = new THREE.Vector3(ikut.x, 0, ikut.z);
  kamera.position.copy(titikTuju).add(ARAH);
  kamera.lookAt(titikTuju);
  kamera.updateProjectionMatrix();
}

// ---------- Teks, panel, dan label HTML ----------
const LANGKAH = [
  { mulai: 0, akhir: 3, nama: null, teks: "Cara mengisi kuis audit komisariat · 7–⁠10 menit, tanpa daftar" },
  { mulai: 3, akhir: 7, nama: "buka", teks: "Buka ahmadzulfikar.com/kuis, tekan Mulai kuis" },
  { mulai: 7, akhir: 17, nama: "jawab", teks: "Jawab 20 pertanyaan sesuai keadaan sekarang, bukan harapan" },
  { mulai: 17, akhir: 21, nama: "perdalam", teks: "Opsional: 10 soal lanjutan tentang kader pasca-LK 2 dan LK 3" },
  { mulai: 21, akhir: 24, nama: "angka", teks: "Opsional: 4 angka, retensi kader dan keterlaksanaan program" },
  { mulai: 24, akhir: 28, nama: "hasil", teks: "Dapat skor, tingkat, temuan, dan laporan PDF" },
  { mulai: 28, akhir: 30, nama: null, teks: "Jangan bicara HMI tanpa bukti. · ahmadzulfikar.com/kuis" },
];
const elKeterangan = document.getElementById("keterangan");
const elAlur = document.querySelectorAll("#alur [data-langkah]");
const elPanel = document.getElementById("panel");
const elBatang = document.getElementById("batang");
const elWadah = document.getElementById("etiket-wadah");
const el = (id) => document.getElementById(id);

function teksKeadaan(t) {
  const l = LANGKAH.find((x) => t >= x.mulai && t < x.akhir) ?? LANGKAH[LANGKAH.length - 1];
  if (elKeterangan.textContent !== l.teks) elKeterangan.textContent = l.teks;
  elKeterangan.style.opacity = halus(seg(t, l.mulai, l.mulai + 0.5));
  elAlur.forEach((s) => {
    const aktif = LANGKAH.some((x) => x.nama === s.dataset.langkah && t >= x.mulai && t < x.akhir);
    s.classList.toggle("aktif", aktif);
  });
}

// Satu baris per kelompok; lebar isi = skor berjalan / skor maksimal kelompok.
const BATANG = KELOMPOK.map((g) => {
  const baris = document.createElement("div");
  baris.className = "batang";
  baris.innerHTML = `<span class="nama">${g.judul}</span><span class="lintasan"><span class="isi"></span></span><span class="angka"></span>`;
  elBatang.appendChild(baris);
  return { nama: baris.querySelector(".nama"), isi: baris.querySelector(".isi"), angka: baris.querySelector(".angka"), maks: g.skor.length * 3, jumlah: g.skor.length };
});

// Kelompok yang sedang dijawab pada waktu t (0 sebelum mulai, lalu tetap di kelompok terakhir).
function grupSaatIni(t) {
  const k = Math.min(SOAL.length - 1, Math.max(0, Math.floor((t - JAWAB_MULAI) / LANGKAH_JAWAB)));
  return SOAL[k].grup;
}

function tingkatUntuk(skor) {
  if (skor <= 15) return "Titik Berangkat";
  if (skor <= 30) return "Mulai Mencatat";
  if (skor <= 45) return "Mulai Membaca Bukti";
  return "Bukti Menjadi Kebiasaan";
}

function panelKeadaan(t) {
  // Jumlah pertanyaan inti yang sudah dijawab pada waktu t.
  let n = 0;
  while (n < SOAL.length && t >= tibaJawab(n)) n++;
  const jumlahGrup = BATANG.map(() => 0);
  const terjawabGrup = BATANG.map(() => 0);
  let skor = 0;
  for (let k = 0; k < n; k++) {
    jumlahGrup[SOAL[k].grup] += SOAL[k].skor;
    terjawabGrup[SOAL[k].grup] += 1;
    skor += SOAL[k].skor;
  }
  el("pertanyaan-n").textContent = `Pertanyaan ${n}/20`;
  el("skor-n").textContent = `Skor ${skor}/60`;
  const aktif = t >= JAWAB_MULAI && t < 17.0 ? grupSaatIni(t) : -1;
  BATANG.forEach((b, gi) => {
    const isi = jumlahGrup[gi] / b.maks;
    b.isi.style.width = `${(isi * 100).toFixed(2)}%`;
    b.angka.textContent = terjawabGrup[gi] === b.jumlah ? `${Math.round(isi * 100)}%` : `${terjawabGrup[gi]}/${b.jumlah}`;
    b.nama.style.color = gi === aktif ? "hsl(42 52% 58%)" : "";
  });

  const lanjut = Math.min(10, Math.max(0, Math.floor((t - 17.5) / 0.3)));
  el("lanjut-n").textContent = `Lanjutan ${lanjut}/10`;
  el("retensi").textContent = `${Math.round(65 * keluar(seg(t, 20.9, 22.6)))}%`;
  el("keterlaksanaan").textContent = `${Math.round(75 * keluar(seg(t, 20.9, 22.6)))}%`;
  const skorAkhir = skorMenara(t);
  el("skor-hasil").textContent = `Skor ${skorAkhir}/60`;
  el("tingkat").textContent = tingkatUntuk(skorAkhir);

  // Kemunculan blok: pembuka (frame kosong), jawab, perdalam, angka, hasil.
  const pembuka = halus(seg(t, 1.5, 3.0)) * (1 - halus(seg(t, 3.0, 3.3)));
  const jawab = halus(seg(t, 6.9, 7.2)) * (1 - halus(seg(t, 16.9, 17.2)));
  const lanjutAlpha = halus(seg(t, 16.9, 17.2)) * (1 - halus(seg(t, 20.9, 21.2)));
  const angka = halus(seg(t, 20.9, 21.2)) * (1 - halus(seg(t, 23.9, 24.2)));
  const hasil = halus(seg(t, 23.9, 24.2)) * (1 - halus(seg(t, 27.9, 28.2)));
  elPanel.style.opacity = Math.max(pembuka, jawab, lanjutAlpha, angka, hasil);
  el("blok-jawab").style.opacity = Math.max(pembuka, jawab);
  el("blok-lanjut").style.opacity = lanjutAlpha;
  el("blok-angka").style.opacity = angka;
  el("blok-hasil").style.opacity = hasil;
}

// Label yang mengikuti posisi 3D di layar (dihitung ulang setiap frame).
const proyeksi = new THREE.Vector3();
function buatEtiket(teks, kanan = false) {
  const s = document.createElement("div");
  s.className = kanan ? "etiket kanan" : "etiket";
  s.textContent = teks;
  elWadah.appendChild(s);
  return s;
}
// dx: geser horizontal dalam piksel layar dari titik proyeksi.
function letakkan(s, pos, opasitas, dx = 0) {
  kamera.updateMatrixWorld();
  proyeksi.copy(pos).project(kamera);
  s.style.left = `${((proyeksi.x + 1) / 2) * LEBAR + dx}px`;
  s.style.top = `${((1 - proyeksi.y) / 2) * TINGGI}px`;
  s.style.opacity = opasitas;
}

const ETIKET_GERBANG = buatEtiket("/kuis");
// Satu label nama kelompok yang mengikuti kubus.
const ETIKET_GRUP = buatEtiket("");
ETIKET_GRUP.classList.add("grup");
const ETIKET_CABANG = [buatEtiket("LK 2"), buatEtiket("LK 3")];
const ETIKET_PILAR = ["40", "26", "12", "9"].map((t) => buatEtiket(t));
const ETIKET_TINGKAT = ["Titik Berangkat 0–15", "Mulai Mencatat 16–30", "Mulai Membaca Bukti 31–45", "Bukti Menjadi Kebiasaan 46–60"].map((t) => buatEtiket(t, true));

function etiketKeadaan(t) {
  letakkan(ETIKET_GERBANG, new THREE.Vector3(GERBANG.x, 2.2, GERBANG.z), halus(seg(t, 3.3, 3.8)));

  // Nama kelompok dari pertanyaan yang sedang dijawab, tepat di atas kubus.
  const grupAktif = grupSaatIni(t);
  ETIKET_GRUP.textContent = KELOMPOK[grupAktif].judul;
  const kubusTitik = posisiKubus(t);
  if (kubusTitik) letakkan(ETIKET_GRUP, kubusTitik.clone().setY(kubusTitik.y + 0.75), halus(seg(t, 6.9, 7.2)) * (1 - halus(seg(t, 16.9, 17.2))));
  else ETIKET_GRUP.style.opacity = 0;

  [SIMPUL_LK2, SIMPUL_LK3].forEach((simpul, i) => {
    const pudar = 1 - halus(seg(t, 22.6, 23.0));
    letakkan(ETIKET_CABANG[i], simpul.clone().setY(1.25), halus(seg(t, 17.2 + i * 2, 17.6 + i * 2)) * pudar);
  });

  pilar.forEach((p, i) => {
    const puncak = Math.max(0.05, p.tinggi * naikPilar(t, i)) + 0.35;
    letakkan(ETIKET_PILAR[i], new THREE.Vector3(POS_PILAR[i].x, puncak, POS_PILAR[i].z), halus(seg(t, 21.2, 21.6)) * (1 - halus(seg(t, 23.7, 24.0))));
  });

  ETIKET_TINGKAT.forEach((s, i) => {
    const bawah = i === 0 ? 0 : BATAS_TINGKAT[i - 1];
    const tengah = ((bawah + BATAS_TINGKAT[i]) / 2 / 60) * TINGGI_MENARA;
    letakkan(s, new THREE.Vector3(POS_MENARA.x, tengah, POS_MENARA.z), halus(seg(t, 24.0, 24.5)) * (1 - halus(seg(t, 27.9, 28.2))), -40);
  });
}

window.tampilkan = function tampilkan(t) {
  const posisi = posisiKubus(t);
  petakKeadaan(t);
  gerbangKeadaan(t);
  cabangKeadaan(t);
  pilarKeadaan(t);
  menaraKeadaan(t);
  kubusKeadaan(t, posisi);
  kameraKeadaan(t, posisi);
  teksKeadaan(t);
  panelKeadaan(t);
  etiketKeadaan(t);
  komposer.render();
};

// Pratinjau tanpa ?rekam=1 memutar animasi; ?t= membekukan detik tertentu.
const parameter = new URLSearchParams(location.search);
// Font dari Google Fonts baru terdaftar setelah stylesheet tiba; cek ulang sampai terdaftar, tanpa menunggu event load.
async function pastikanFont() {
  const muat = () => Promise.all([
    document.fonts.load('700 72px "Noto Serif"'),
    document.fonts.load('500 44px "DM Sans"'),
    document.fonts.load('600 30px "JetBrains Mono"'),
  ]);
  for (let i = 0; i < 100; i++) {
    const hasil = await muat();
    if (hasil.every((f) => f.length > 0)) return;
    await new Promise((ok) => setTimeout(ok, 100));
  }
  throw new Error("font belum terdaftar setelah 10 detik, halaman akan memakai font cadangan");
}
window.siap = pastikanFont().then(() => {
  if (!parameter.get("rekam") && parameter.get("t") === null) {
    const mulai = performance.now();
    const putar = () => {
      window.tampilkan(((performance.now() - mulai) / 1000) % window.DURASI);
      requestAnimationFrame(putar);
    };
    putar();
  } else {
    window.tampilkan(Number(parameter.get("t") ?? 0));
  }
});
