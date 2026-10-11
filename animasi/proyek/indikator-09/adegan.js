// Indikator 09. Kit 1.1.0; semua keadaan diturunkan dari t.
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, W, halus, rentang,
  duniaPustaka, pion, kotakCelah, kartuKecil, panelKertas, panahGaris,
  label3D, keterangan, setelKeadaan, aturOpasitas,
  muncul, hilang, lintas, busur, klikEmas, denyutCermin, gantiBenda, catat,
} from '../../kit/index.js';
let jadwal;
const v = buatVideo({ format: formatIndikator({
  nomor: '09', kategori: 'KADERISASI',
  judul: 'Pemahaman, penghayatan, dan pengamalan ajaran Islam masih kurang.',
  cermin: 'Kajian kita berangkat dari pertanyaan nyata kader sehari-hari?',
  langkah: 'Mulai dari pertanyaan mereka, jadikan tema kajian bulan ini.',
  ajakan: 'ahmadzulfikar.com/kuis',
}), kamera: t => jadwal(t) });
keterangan({ label: 'ISI KUIS', warna: 'emas', top: 1450, masuk: [18.6,19.2], naik: 0 });
const d = duniaPustaka(v);
const peserta = Array.from({length:5}, (_,i) => d.benda[`kursi${i+1}`]);
const lampu = Array.from({length:5}, (_,i) => d.benda[`lentera${i+1}`]);
const pemateri = v.tambah(pion({nama:'pemateri'}));
pemateri.position.copy(titik(0,-0.6,0.1));
const duduk = v.tambah(pion({duduk:true,nama:'pemateri bergabung'}));
duduk.position.copy(titik(0.55,-0.6,0.35));
const kotak = v.tambah(kotakCelah({nama:'kotak pertanyaan', label:null}));
kotak.position.copy(titik(2.2,2.6,0.1));
kotak.updateMatrixWorld(true);
const celah = kotak.localToWorld(kotak.userData.titikCelah.clone());
label3D('PERTANYAAN', {pada:kotak,geser:[0,0.95,0],gaya:'kotak',kelas:'zamrud',masuk:0.9,skala:0.8});
// Latar sengaja terpotong ketika kamera memusatkan kotak di Cermin.
for(const b of d.urutan) b.userData.penting = t => !(t>6 && t<13);
jadwal = jadwalIndikator({fokus:d.fokus, cermin:{fokus:celah,H:12}, langkah:{fokus:d.fokus}, akhir:{naik:0.8}});
muncul([...d.urutan,pemateri,kotak], {t:0.6,selesai:1.6,durasi:0.4});
denyutCermin(kotak,{mulai:7,selesai:11.8});
const arrows = [1,0,4].map((n,i) => {
  const a = v.tambah(panahGaris({nama:`panah satu arah ${i+1}`,warna:W.abu,penting:false,
    titik:[titik(0,-0.25,1.1),d.titik.duduk[n].clone().setY(0.95)],tebal:0.025,kepala:{radius:0.075,panjang:0.2}}));
  return a;
});
for(let t=1.6;t<6;t+=0.8) catat({t,jenis:'whoosh',durasi:0.5,kuat:0.28,sumber:'panah satu arah',x:0.5});
const kertas = [];
for(let i=0;i<10;i++) {
  const p = v.tambah(kartuKecil({skala:0.6,simbol:'garis',nama:`kertas tanya ${i+1}`}));
  const dari = d.titik.duduk[Math.floor(i/2)].clone().setY(1.0);
  p.position.copy(dari);
  const mulai = 12.4 + i*0.105;
  muncul(p,{t:mulai,durasi:0.12,naik:0});
  busur(p,{t:mulai, dari,ke:celah,tinggi:1.3,durasi:0.58,putar:0.25});
  hilang(p,{t:mulai+0.55,durasi:0.1,turun:0.18});
  kertas.push(p);
}
const tema = [];
for(let i=0;i<3;i++) {
  const r = (i-1)*1.6;
  const p = v.tambah(panelKertas({lebar:1.4,tinggi:0.5,kaki:false,dasar:0,miring:0,
    judul:`TEMA ${i+1}`,nama:`tema kajian ${i+1}`}));
  p.position.copy(titik(r,1.2,1.05));
  const kartu = v.tambah(kartuKecil({skala:0.6,simbol:'garis',nama:`tema dari pertanyaan ${i+1}`}));
  kartu.position.copy(celah);
  const mulai = 14+i*0.16;
  muncul(kartu,{t:mulai,durasi:0.15,naik:0});
  lintas(kartu,{t:mulai,durasi:0.45,lengkung:true,jalur:[celah,celah.clone().add(titik(-0.3,-0.5,1.2)),p.position.clone()]});
  gantiBenda(kartu,p,{t:mulai+0.4,durasi:0.28,tempat:false});
  klikEmas(p,{t:15+i*0.08,durasi:0.64,lonjak:0.12});
  tema.push(p);
}
gantiBenda(pemateri,duduk,{t:15.8,durasi:0.7,tempat:false});
catat({t:16.1,jenis:'menyala',sumber:'lentera 1',posisi:lampu[0]});
catat({t:16.7,jenis:'menyala',sumber:'lentera 2',posisi:lampu[1]});
v.setiapFrame(t => {
  const s=Math.min(t,18);
  const pulih=halus(rentang(s,15.8,17.6));
  for(const b of [d.benda.rakKiri,d.benda.rakKanan,d.benda.meja,...peserta,pemateri,duduk]) setelKeadaan(b,'abu',1-pulih);
  peserta.forEach((p,i)=>{
    const redup=halus(rentang(s,2.6+i*0.6,3.2+i*0.6));
    const masuk=halus(rentang(s,0.85+i*0.03,1.3+i*0.03));
    aturOpasitas(p,masuk*(1-0.7*redup*(1-pulih)));
  });
  arrows.forEach((a,i)=>{
    const fase=((Math.min(s,6.6)-1.6-i*0.08)%0.8+0.8)%0.8;
    const aktif=s>=1.6&&s<6.6;
    a.userData.aturTampak(aktif?halus(Math.min(fase/0.3,1)):0);
    aturOpasitas(a,aktif?0.85*(1-halus(rentang(fase,0.55,0.8))):0);
  });
  lampu.forEach((l,i)=>setelKeadaan(l,'nyala',i<2?0.9*halus(rentang(s,16.1+i*0.6,16.7+i*0.6)):0));
});



