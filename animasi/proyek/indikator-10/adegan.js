import * as THREE from "three";
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, halus, rentang,
  duniaKader, gerbangKampus, ubinJalan, pion, label3D, keterangan,
  muncul, hilang, jalan, klikEmas, denyutCermin, setelKeadaan, catat,
} from "../../kit/index.js";
import { tepiJalanPatah } from "./benda-lokal.js";

let jadwal;
const v = buatVideo({
  akhirAdegan: 18,
  format: formatIndikator({
    nomor: "10", kategori: "KADERISASI",
    judul: "Pengetahuan mengenai ke-HMI-an dan organisasi belum optimal.",
    cermin: "Setelah LK 1, di mana kader belajar lebih lanjut?",
    langkah: "Sambung jalan setelah LK 1 dengan agenda belajar lanjutan.",
    ajakan: "ahmadzulfikar.com/kuis",
  }),
  kamera: t => jadwal(t),
});

const d = duniaKader(v);
const lama = d.benda.jalan.userData.bagian.ubin;
// Kit: enam ubin, tiga pertama menjadi jalan buntu, tiga berikutnya diganti hasil.
lama.slice(3).forEach(u => { u.visible=false; u.userData.abaikanZona=true; });
const ujung = d.titik.ubin[2].clone().setY(.065);
const arah = d.titik.ubin[3].clone().sub(ujung).setY(0).normalize();
const samping = new THREE.Vector3(arah.z,0,-arah.x);

const lk1 = v.tambah(gerbangKampus({ nama:"gerbang LK 1",label:"LK 1",opsiLabel:{skala:.85} }));
lk1.scale.setScalar(.58);
lk1.position.copy(ujung).addScaledVector(arah,-.55).setY(.065);
const patah = v.tambah(tepiJalanPatah({arah}));
patah.position.copy(ujung);
muncul([...d.urutan,lk1,patah],{t:.6,selesai:1.6,durasi:.4});

// Latar boleh terpotong saat Cermin memperbesar ujung patahan saja.
for (const b of [d.benda.gerbang,d.benda.kelas,d.benda.tangga,d.benda.komisariat])
  b.userData.penting = t => !(t>6 && t<13);
const fokusCermin = ujung.clone().setY(.9);
jadwal = jadwalIndikator({
  fokus:d.fokus,
  cermin:{fokus:fokusCermin,H:12},
  langkah:{fokus:d.fokus},
});

label3D("KAMPUS",{pada:d.benda.gerbang,geser:[0,2.65,0],masuk:[.8,1.3],keluar:[5.8,6.2],skala:.85});
label3D("KOMISARIAT",{pada:d.benda.komisariat,geser:[0,2.12,0],masuk:[1.1,1.6],skala:()=>.85*16/v.rig.keadaan.H});

const kader = [];
for(let i=0;i<4;i++) {
  const f=v.tambah(pion({nama:`kader terhenti ${i+1}`}));
  const mulai=1.6+i*.5, tiba=3+i*.5;
  // Berhenti menyebar di bibir jalan supaya keempat siluet tetap terpisah.
  const tujuan=ujung.clone().add(titik((i-1.5)*.55,.14)).setY(.065);
  const jalur=[d.titik.gerbang.clone().add(titik((i-1.5)*.12,0)).setY(.065),lk1.position.clone().add(titik((i-1.5)*.2,0)),tujuan];
  f.position.copy(jalur[0]);
  muncul(f,{t:mulai,durasi:.2,naik:0});
  jalan(f,{t:mulai,jalur,durasi:tiba-mulai,lengkung:true,hadap:true});
  catat({t:tiba+.1,jenis:"putar",durasi:.65,posisi:f,kuat:.25});
  catat({t:tiba+.65,jenis:"padam",posisi:f,kuat:.35});
  kader.push({f,tiba});
}

denyutCermin(patah,{mulai:7,selesai:11.8});

const namaUbin=["KONSTITUSI","SEJARAH","STRUKTUR"];
const ubin=[];
for(let i=0;i<3;i++) {
  const b=v.tambah(ubinJalan({nama:`ubin ${namaUbin[i]}`}));
  b.position.copy(d.titik.ubin[i+3]).setY(0);
  b.rotation.copy(lama[i+3].rotation);
  b.scale.copy(lama[i+3].scale);
  muncul(b,{t:12.4+i*.6,durasi:.6});
  klikEmas(b,{t:14.2,durasi:.8});
  label3D(namaUbin[i],{
    pada:b,geser:[0,.16,0],gaya:"mikro",kelas:"gelap",skala:()=>1.05*16/v.rig.keadaan.H,
    dx:0,dy:0,ax:.5,ay:.5,masuk:[12.7+i*.6,13.1+i*.6],
  });
  ubin.push(b);
}

// Dua kader menyelesaikan perjalanan sampai melewati ambang pintu sebelum 17.6.
for(let i=0;i<2;i++) {
  const f=v.tambah(pion({nama:`kader lanjutan ${i+1}`,aktif:true}));
  const awal=lk1.position.clone().addScaledVector(arah,-.55).setY(.065);
  f.position.copy(awal);
  const mulai=15+i*.45;
  muncul(f,{t:mulai,durasi:.2,naik:0});
  const perjalanan=jalan(f,{
    t:mulai,jalur:[awal,ujung,...d.titik.ubin.slice(3).map(p=>p.clone().setY(.065)),d.titik.pintu.clone().setY(.065)],
    durasi:1.85,lengkung:true,hadap:true,beku:false,
  });
  hilang(f,{t:perjalanan.selesai,durasi:.3,turun:0});
  catat({t:perjalanan.selesai-.12,jenis:"pintu",durasi:.25,posisi:d.benda.komisariat,kuat:.5});
}

keterangan({label:"ISI KUIS",warna:"emas",top:1450,masuk:[18.6,19.2]});
v.setiapFrame(t=>{
  const tau=Math.min(t,18);
  setelKeadaan(d.benda.komisariat,"abu",1-halus(rentang(tau,15,15.8)));
  setelKeadaan(d.benda.kelas,"abu",1);
  lama.slice(0,3).forEach(b=>setelKeadaan(b,"abu",1));
  lama.slice(3).forEach(b=>{b.visible=false;});
  for(const {f,tiba} of kader) {
    const dt=tau-tiba;
    const menoleh=dt>=0 && dt<.85 ? Math.sin(dt/.85*Math.PI*2)*Math.PI/6 : 0;
    // Kit mengembalikan rotasi dasar pada tiap evaluasi; tambahan ini tidak terakumulasi.
    f.rotation.y+=menoleh;
    setelKeadaan(f,"pudar",halus(rentang(tau,tiba+.55,tiba+1.0)));
  }
});

