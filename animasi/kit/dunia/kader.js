// Dunia Kader: gerbang kampus dan gedung kelas di kiri atas, jalan ubin menurun ke pintu komisariat di kanan bawah,
// tangga jenjang (LK 1–3) di tengah atas, lapangan kosong di kiri bawah. KONTRAK.md §7.
// Kunci benda, titik, opsi, dan penyimpangan dari prompt: docs/dunia-kader-jenjang-simpul.md.
//
//   const d = duniaKader(v);                        // atau duniaKader(v, { potong: true }) untuk komisariat terpotong
//   d.benda.gerbang, .kelas, .jalan, .komisariat, .tangga
//   d.titik.jalur          titik jalan figur: belakang gerbang → lewat gerbang → sepanjang jalan → depan pintu
//   d.titik.depanPintu     tujuan figur yang masuk komisariat (lalu hilang(), atau terus ke d.titik.dalam bila potong)
//
// Angka prompt (gerbang −3.4, −3.6; kelas −4.6, −5.4; tangga 4.2, −0.4) membuat dunia selebar 12 unit, padahal
// frustum 16 hanya selebar 9. Tata letak di bawah memadatkannya; komisariat tetap di dekat titik prompt (2.6, 2.2)
// karena benda tambahan banyak indikator diletakkan relatif terhadapnya.
import * as THREE from "three";
import { titik } from "../inti/ruang.js";
import { rumah } from "../benda/dasar.js";
import { gerbangKampus, gedungKelas, rumahPotong } from "../benda/bangunan.js";
import { jalanUbin, tanggaJenjang } from "../benda/medan.js";
import { susunDunia } from "./_susun.js";

const TATA = {
  gerbang: titik(-2.1, -0.7),
  kelas: titik(-2.85, -2.9),
  komisariat: titik(2.6, 2.2),       // = prompt
  komisariatPotong: titik(2.3, 1.9), // rumahPotong 1.4× lebih besar: digeser supaya tetap di zona
  tangga: titik(1.2, -1.5),
  lapangan: titik(-2.6, 1.6),
  fokus: titik(-0.28, 0, 1.7),
};

const dunia = (benda, lokal) => benda.localToWorld(lokal.clone());

// Depan pintu komisariat (dunia). Benda pengganti tanpa userData.depanPintu dianggap berpintu di muka +z.
function depanPintu(kom) {
  if (!kom) return TATA.komisariat.clone().add(titik(-1.17, 0.6));
  return dunia(kom, kom.userData.depanPintu ?? new THREE.Vector3(-0.4, 0, 1.25));
}

// Titik di ambang pintu (lokal): 0.43 dari depanPintu ke arah dinding, menurut sumbu muka pintunya.
function pintuLokal(kom) {
  const p = (kom.userData.depanPintu ?? new THREE.Vector3(-0.4, 0, 1.25)).clone();
  if (Math.abs(p.z) >= Math.abs(p.x)) p.z -= Math.sign(p.z) * 0.43;
  else p.x -= Math.sign(p.x) * 0.43;
  return p;
}

// Titik bawaan jalan: dari bawah gerbang, melengkung sedikit ke bawah layar, sampai depan pintu komisariat.
function titikJalan(b) {
  const awal = (b.gerbang?.position ?? TATA.gerbang).clone().setY(0);
  const akhir = depanPintu(b.komisariat).setY(0);
  const tengah = awal.clone().lerp(akhir, 0.5).add(titik(-0.15, 0.3));
  return [awal, tengah, akhir];
}

// opsi (selain tanpa, posisi, opsi, ganti dari KONTRAK §7):
//   potong   false (bawaan) | true | angka. Komisariat diganti rumahPotong (potongan isometrik, pintu belakang),
//            diskalakan 1.4 (true) atau sebesar angka, di titik(2.3, 1.9) supaya tetap di zona, tanpa garis atap
//            (garis atap memotong setiap figur di dalam ruang; opsi: { komisariat: { garisAtap: true } } memulihkannya).
//            Mengisi d.titik.dalam, pintuBelakang, luarBelakang, dan sampingKomisariat.
export function duniaKader(v, opsi = {}) {
  const { potong = false } = opsi;
  const skala = potong === true ? 1.4 : Number(potong) || 1;

  const resep = [
    // Gerbang kit sudah menghadap kamera pada rotasi 0; rotasi −45° prompt tidak dipakai (docs/benda-figur-bangunan.md).
    { nama: "gerbang", buat: (o) => gerbangKampus({ nama: "gerbang", ...o }), posisi: TATA.gerbang },
    { nama: "kelas", buat: (o) => gedungKelas({ nama: "kelas", ...o }), posisi: TATA.kelas },
    {
      nama: "komisariat", posisi: potong ? TATA.komisariatPotong : TATA.komisariat,
      buat: (o) => {
        if (!potong) return rumah({ nama: "komisariat", ...o });
        const k = rumahPotong({ nama: "komisariat", garisAtap: false, ...o });
        k.scale.setScalar(skala);
        return k;
      },
    },
    // Dibuat sesudah gerbang dan komisariat supaya ujungnya mengikuti posisi (dan ukuran) keduanya. Grup diletakkan
    // di tengah jalan (titik lokal relatif terhadapnya), supaya skala muncul berporos di tengah jalan, bukan di titik
    // asal dunia. Karena itu userData jalan (kurva, titikUbin) berupa titik lokal: pakai d.titik.ubin dan d.titik.jalur.
    {
      nama: "jalan",
      buat: (o, b) => {
        const t = (o.titik ?? titikJalan(b)).map((p) => p.clone());
        const tengah = t[0].clone().lerp(t[t.length - 1], 0.5);
        const j = jalanUbin({ jarak: 1, nama: "jalan", ...o, titik: t.map((p) => p.sub(tengah)) });
        j.position.copy(tengah);
        return j;
      },
    },
    { nama: "tangga", buat: (o) => tanggaJenjang({ nama: "tangga", ...o }), posisi: TATA.tangga },
  ];
  const { benda } = susunDunia(v, resep, opsi);
  const { gerbang, kelas, jalan, komisariat: kom, tangga } = benda;

  // ---------------------------------------------------------------- titik bernama (dunia, y 0 kecuali disebut)
  const T = {};
  const pGerbang = (gerbang?.position ?? TATA.gerbang).clone();
  T.gerbang = pGerbang.clone();
  T.depanGerbang = gerbang ? dunia(gerbang, gerbang.userData.depan) : pGerbang.clone().add(titik(0, 1));
  T.belakangGerbang = gerbang ? dunia(gerbang, gerbang.userData.belakang) : pGerbang.clone().add(titik(0, -1));
  T.atasGerbang = pGerbang.clone().setY(gerbang ? new THREE.Box3().setFromObject(gerbang).max.y + 0.3 : 2.85);
  if (kelas) T.kelas = kelas.position.clone();

  const pKom = (kom?.position ?? TATA.komisariat).clone();
  T.komisariat = pKom.clone();
  T.depanPintu = depanPintu(kom);
  T.pintu = kom ? dunia(kom, pintuLokal(kom)) : T.depanPintu.clone();
  const kotak = kom ? new THREE.Box3().setFromObject(kom) : null;
  T.atap = pKom.clone().setY(kotak ? kotak.max.y : 1.9);
  // Alun-alun di kiri depan pintu, di bawah ujung jalan: tempat figur berkumpul "di depan komisariat".
  T.depanKomisariat = T.depanPintu.clone().add(titik(-1.5, -0.35));
  if (kom?.userData.dalam) T.dalam = dunia(kom, kom.userData.dalam);
  if (kom?.userData.luarBelakang) {
    T.luarBelakang = dunia(kom, kom.userData.luarBelakang);
    T.pintuBelakang = dunia(kom, kom.userData.luarBelakang.clone().add(new THREE.Vector3(0, 0, 0.45)));
  }

  if (jalan) {
    const k = jalan.userData.kurva;
    T.awalJalan = dunia(jalan, k.getPointAt(0));
    T.tengahJalan = dunia(jalan, k.getPointAt(0.5));
    T.ujungJalan = dunia(jalan, k.getPointAt(1));
    T.ubin = jalan.userData.titikUbin.map((p) => dunia(jalan, p));
  }
  // Jalur figur dari dalam kampus ke depan pintu. Pakai dengan jalan(figur, { jalur: d.titik.jalur, lengkung: true }).
  const sepanjang = jalan ? [0.25, 0.5, 0.75].map((u) => dunia(jalan, jalan.userData.kurva.getPointAt(u))) : [];
  T.jalur = [T.belakangGerbang, pGerbang.clone().setY(0), ...sepanjang, T.depanPintu].map((p) => p.clone().setY(0));
  // Jalur pendek "dari ujung jalan": 0.5 sebelum depan pintu (di jalan), ke depan pintu; dengan potong terus masuk,
  // lewat tengah ruang, dan keluar pintu belakang. d.titik.jalur ditambah bagian dalam ±9 unit (7.5 s pada 1.2 unit/s).
  const arahJalan = (jalan ? T.ubin[T.ubin.length - 1] : pGerbang).clone().sub(T.depanPintu).setY(0).normalize();
  T.jalurPendek = [T.depanPintu.clone().addScaledVector(arahJalan, 0.5), T.depanPintu];
  if (kom?.userData.dalam && kom.userData.luarBelakang) {
    const dp = kom.userData.depanPintu, lb = kom.userData.luarBelakang;
    T.jalurPendek.push(T.pintu, dunia(kom, new THREE.Vector3(dp.x, 0, 0.45)), T.dalam,
      dunia(kom, new THREE.Vector3(lb.x, 0, -0.45)), T.pintuBelakang, T.luarBelakang);
    // Ruang kosong di kanan komisariat untuk benda pendukung (kalender, daftar hadir; indikator 06), diuji dengan
    // fokus kamera d.titik.komisariat + titik(0.3, 0.3, 2.0). Pada fokus bawaan d.fokus titik ini di luar layar kanan.
    T.sampingKomisariat = pKom.clone().add(titik(3.1, 0.45));
  }
  T.jalurPendek = T.jalurPendek.map((p) => p.clone().setY(0));

  if (tangga) T.puncakTangga = tangga.userData.puncak.map((p) => dunia(tangga, p));
  // Lapangan kosong di kiri bawah (kerumunan, lingkaran figur): bebas sampai radius ±1.5 tanpa menyentuh jalan.
  T.lapangan = TATA.lapangan.clone();

  // Urutan muncul wajar mengikuti urutan prompt: gerbang, kelas, jalan, komisariat, tangga.
  const urutan = ["gerbang", "kelas", "jalan", "komisariat", "tangga"].map((n) => benda[n]).filter(Boolean);

  return { benda, urutan, fokus: TATA.fokus.clone(), H: 16, titik: T };
}
