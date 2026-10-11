// Indikator 14. Kit 1.1.0; sembilan lentera dan satu lingkar baca.
import {
  buatVideo, formatIndikator, jadwalIndikator, titik, W, halus, rentang,
  duniaPustaka, pion, lentera, buku, lembarKertas, panelKertas,
  label3D, keterangan, setelKeadaan,
  muncul, jalan, lintas, gantiBenda, klikEmas, denyutCermin, gantiLabel, catat,
} from '../../kit/index.js';
let jadwal;
const v=buatVideo({format:formatIndikator({
  nomor:'14',kategori:'PENGETAHUAN',judul:'Tradisi intelektual HMI memudar.',
  cermin:'Berapa tulisan atau kajian yang lahir dari komisariat bulan ini?',
  langkah:'Mulai dari satu lingkar baca dua mingguan.',ajakan:'ahmadzulfikar.com/kuis',
}),kamera:t=>jadwal(t)});
keterangan({label:'ISI KUIS',warna:'emas',top:1450,masuk:[18.6,19.2],naik:0});
const d=duniaPustaka(v);
const peserta=Array.from({length:5},(_,i)=>d.benda[`kursi${i+1}`]);
const lampu=Array.from({length:5},(_,i)=>d.benda[`lentera${i+1}`]);
// Empat lentera di depan rak; posisi atas rak akan menembus kabut kepala.
for(let i=0;i<4;i++) {
  const l=v.tambah(lentera({tali:0.3,nama:`lentera ${i+6}`}));
  const rak=i<2?d.benda.rakKiri:d.benda.rakKanan;
  l.position.copy(rak.position).add(titik(i%2===0?-0.85:0.85,0.7)).setY(2.3);
  lampu.push(l);
}
const kanal=v.tambah(panelKertas({lebar:1.6,tinggi:1.4,miring:0,nama:'kanal komisariat',warna:W.abuGelap,warnaBingkai:W.abu}));
kanal.position.copy(titik(3,2.4,0.1));
label3D('KANAL KOMISARIAT',{pada:kanal,geser:[0,1.7,0],gaya:'kotak',kelas:'zamrud',skala:0.58,masuk:0.9});
for(const b of [...d.urutan,...lampu.slice(5),kanal]) b.userData.penting=t=>!(t>6&&t<13);
jadwal=jadwalIndikator({fokus:d.fokus,cermin:{fokus:d.titik.meja,H:12},langkah:{fokus:d.fokus}});
muncul([...d.urutan.filter(b=>!peserta.includes(b)),...lampu.slice(5),kanal],{t:0.6,selesai:1.6,durasi:0.4});
denyutCermin(d.benda.meja,{mulai:7,selesai:11.8});
// Dari tepi ruang ke masing-masing kursi; bentuk duduk mengganti figur berjalan.
for(let i=0;i<5;i++) {
  const p=v.tambah(pion({nama:`pembaca datang ${i+1}`}));
  const tujuan=d.titik.duduk[i];
  const dari=d.titik.kursi[i].clone().add(titik(i<3?-1.2:1.1,0.8));
  p.position.copy(dari);
  muncul(p,{t:12.4+i*0.03,durasi:0.18,naik:0});
  jalan(p,{t:12.4+i*0.03,durasi:0.7,jalur:[dari,tujuan.clone().setY(0.1)],hadap:true});
  gantiBenda(p,peserta[i],{t:13.05+i*0.03,durasi:0.23,tempat:false});
}
const bacaan=v.tambah(buku({terbuka:true,lebar:0.5,tinggi:0.65,nama:'buku lingkar baca'}));
bacaan.position.copy(d.titik.meja);
muncul(bacaan,{t:13.1,durasi:0.3,naik:0.25});
const minggu=label3D('MINGGU 1',{pada:d.benda.meja,geser:[0,1.5,0],gaya:'kotak',kelas:'zamrud',masuk:[13.4,13.6],keluar:[14.4,14.6],skala:0.78});
gantiLabel(minggu,{t:13.95,teks:'MINGGU 3',durasi:0.18});
const ringkasan=v.tambah(lembarKertas({lebar:0.7,panjang:0.9,garis:5,nama:'ringkasan terbang'}));
ringkasan.position.copy(d.titik.meja.clone().setY(d.titik.meja.y+0.1));
const hasil=lembarKertas({lebar:0.85,panjang:1.05,garis:5,rebah:false,miring:0,hadap:0,nama:'ringkasan di kanal'});
kanal.userData.bagian.muka.add(hasil);
hasil.position.set(0,-0.51,0.05);
kanal.updateMatrixWorld(true);
const tujuan=hasil.getWorldPosition(ringkasan.position.clone());
muncul(ringkasan,{t:14.6,durasi:0.18,naik:0.2});
lintas(ringkasan,{t:14.6,durasi:0.85,lengkung:true,jalur:[d.titik.meja.clone().setY(1.1),titik(1.5,1.7,2),tujuan]});
gantiBenda(ringkasan,hasil,{t:15.4,durasi:0.2,tempat:false});
klikEmas(hasil,{t:15.6,durasi:0.8,lonjak:0.1});
catat({t:15.6,jenis:'klik-emas',sumber:'lentera tengah',posisi:lampu[0]});
// Padam dari lampu pinggir rak menuju meja; lampu 1 padam terakhir.
const urutanPadam=[8,5,7,6,4,1,3,2,0];
for(let i=0;i<9;i++) catat({t:1.6+i*0.5,jenis:'padam',sumber:`lentera ${urutanPadam[i]+1}`,posisi:lampu[urutanPadam[i]],kuat:0.65});
v.setiapFrame(t=>{
  const s=Math.min(t,18);
  const pulih=halus(rentang(s,12.4,13.4));
  for(const b of [d.benda.rakKiri,d.benda.rakKanan,d.benda.meja]) setelKeadaan(b,'abu',1-pulih);
  lampu.forEach((l,i)=>{
    const index=urutanPadam.indexOf(i);
    const awal=0.4*(1-halus(rentang(s,1.6+index*0.5,1.95+index*0.5)));
    const akhir=i===0?0.9*halus(rentang(s,15.6,16.4)):0;
    setelKeadaan(l,'nyala',Math.max(awal,akhir));
  });
});
