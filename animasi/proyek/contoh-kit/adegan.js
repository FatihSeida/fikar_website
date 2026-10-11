// Video contoh kit (21 detik, format indikator). Membuktikan kit dari ujung ke ujung:
// pion dan rumah, figur berjalan, denyut cermin, benda yang menjadi emas lewat klikEmas, semua teks, dan kartu akhir.
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, DEG, halus, rentang,
  pion, rumah, label3D, setelKeadaan,
  muncul, hilang, jalan, klikEmas, denyutCermin, tumbuh, gantiLabel,
} from "../../kit/index.js";
import { gapura, papanHadir } from "./benda-lokal.js";

// ---------------------------------------------------------------- tata letak (titik(r, d): kanan layar, bawah layar)
const P_RUMAH = titik(1.6, 0);
const P_GAPURA = titik(-3.0, -2.4);
const P_PAPAN = titik(-0.9, 2.3);
const BERDIRI = titik(-0.25, 0.95);           // figur 2 menunggu di samping pintu
const ABSEN = [titik(-2.6, -0.9), titik(-1.9, -1.5)]; // dua figur pudar (absen), disapa di Bagian 3

// Jadwal kamera diisi setelah dunia dibangun (fokus Cermin = depan pintu komisariat); fungsi ini baru dipanggil saat tampilkan().
let jadwal = null;
const v = buatVideo({
  format: formatIndikator({
    nomor: "00", kategori: "CONTOH KIT",
    judul: "Kader baru datang, lalu jarang kembali ke komisariat.",
    cermin: "Siapa saja yang **tidak kembali** sesudah LK 1?",
    langkah: "Catat kehadiran tiap pekan, lalu **sapa** yang absen.",
    ajakan: "ahmadzulfikar.com/indikator/00",
  }),
  kamera: (t) => jadwal(t),
});

// ---------------------------------------------------------------- dunia
const komisariat = v.tambah(rumah());
komisariat.position.copy(P_RUMAH);
komisariat.updateMatrixWorld();
const PINTU = komisariat.localToWorld(komisariat.userData.depanPintu.clone());
jadwal = jadwalIndikator({
  fokus: titik(-0.6, -0.8),
  cermin: { fokus: PINTU.clone().setY(0.6), H: 12 },
  langkah: { fokus: titik(-0.4, 0.9) },
});

const gerbang = v.tambah(gapura());
gerbang.position.copy(P_GAPURA);
gerbang.rotation.y = 45 * DEG;

const papan = v.tambah(papanHadir());
papan.position.copy(P_PAPAN);

const pejalan = [0, 1, 2].map(() => v.tambah(pion()));
const absen = ABSEN.map((p) => { const f = v.tambah(pion({ pudar: true })); f.position.copy(p); return f; });

// ---------------------------------------------------------------- Bagian 1, Gejala (0.6–6.0)
muncul(komisariat, { t: 0.4 });
muncul(gerbang, { t: 0.5 });
muncul(absen, { t: 0.9 });
const lewat = [titik(-3.0, -2.4), titik(-1.7, -0.4)];
const j1 = jalan(pejalan[0], { t: 0.8, jalur: [...lewat, PINTU], lengkung: true });
const j2 = jalan(pejalan[1], { t: 1.7, jalur: [...lewat, BERDIRI], lengkung: true });
const j3 = jalan(pejalan[2], { t: 2.6, jalur: [...lewat, PINTU], lengkung: true }); // dibekukan format pada t 6.6
pejalan.forEach((p, i) => muncul(p, { t: [0.8, 1.7, 2.6][i], durasi: 0.4, naik: 0 }));
hilang(pejalan[0], { t: j1.selesai });       // masuk ke komisariat

const lblPekan = label3D("PEKAN 1", { pada: gerbang, geser: [0, 2.95, 0], gaya: "kotak", masuk: 0.9, keluar: [5.8, 6.2] });
gantiLabel(lblPekan, { t: 2.4, teks: "PEKAN 2" });
gantiLabel(lblPekan, { t: 4.2, teks: "PEKAN 3" });
label3D("KOMISARIAT", { pada: komisariat, geser: [0, 2.15, 0], masuk: 0.8, keluar: [6.0, 6.3] });

// ---------------------------------------------------------------- Bagian 2, Cermin (6.0–12.0)
denyutCermin(komisariat, { mulai: 7.0, selesai: 11.8 });

// ---------------------------------------------------------------- Bagian 3, Langkah (12.0–18.0)
const j2b = jalan(pejalan[1], { t: 12.3, jalur: [BERDIRI, PINTU] });
hilang(pejalan[1], { t: j2b.selesai });
const j3b = jalan(pejalan[2], { t: 12.9, jalur: [j3.pada(12.9), PINTU] });
hilang(pejalan[2], { t: j3b.selesai });

muncul(papan, { t: 12.4 });
tumbuh(papan.userData.bagian.batang, { t: 12.9, durasi: 0.3, sumbu: "x" });
klikEmas(papan, { t: 15.6 });
["P1", "P2", "P3"].forEach((n, i) => label3D(n, {
  pada: () => papan.userData.titikBaris(i), gaya: "baris", ax: 0.5, ay: 0.5,
  opasitas: (t) => halus(rentang(t, 12.9 + 0.3 * i, 13.2 + 0.3 * i)) * (papan.userData.opasitas ?? 1),
  skala: () => 16 / v.rig.keadaan.H,
}));

// Keadaan yang berubah halus sepanjang video (disetel setiap frame tanpa syarat).
v.setiapFrame((t) => {
  setelKeadaan(komisariat, "abu", 1 - halus(rentang(t, 15.6, 16.4)));   // abu selama gejala, kembali zamrudRedup
  absen.forEach((f, i) => {
    setelKeadaan(f, "pudar", 1 - halus(rentang(t, 13.8 + 0.2 * i, 14.4 + 0.2 * i)));
    setelKeadaan(f, "aktif", halus(rentang(t, 15.4 + 0.15 * i, 15.9 + 0.15 * i)));
  });
});
