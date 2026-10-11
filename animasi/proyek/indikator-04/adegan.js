// 21-second deterministic library narrative. Every transform/material is reset from t.
import * as THREE from 'three';
import { W,$,scene,kamera,composer,bahan,kotak,bola,titik,acakBenih,klem,campur,rentang,keluar3,masukKeluar3,halus,pegas,jendela,opacity,muncul,aturKamera,label,taruh } from './alat.js';
import { rakBuku,pionDuduk,mejaBundar,lentera,bukuTerbuka,paragraf,balonKutipan } from './benda.js';

const DURASI=21,S=.72,panggung=new THREE.Group();panggung.scale.setScalar(S);scene.add(panggung);
const tanah=new THREE.ShaderMaterial({uniforms:{uLatar:{value:W.latar},uGrid:{value:W.grid},uMayor:{value:W.gridMayor},uJari:{value:0}},vertexShader:`varying vec3 vDunia;void main(){vDunia=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vDunia,1.);}`,fragmentShader:`varying vec3 vDunia;uniform vec3 uLatar,uGrid,uMayor;uniform float uJari;float garis(vec2 p,float stepN){vec2 q=p/stepN;vec2 d=abs(fract(q-.5)-.5)/max(fwidth(q),vec2(.0001));return 1.-min(min(d.x,d.y),1.);}void main(){float f=1.-smoothstep(max(0.,uJari-8.),max(.001,uJari),length(vDunia.xz));vec3 c=mix(uLatar,uGrid,garis(vDunia.xz,1.)*f);c=mix(c,uMayor,garis(vDunia.xz,5.)*f);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}`});
const grid=new THREE.Mesh(new THREE.PlaneGeometry(300,300),tanah);grid.rotation.x=-Math.PI/2;grid.position.y=-.035;scene.add(grid);
const receiver=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.ShadowMaterial({opacity:.23}));receiver.rotation.x=-Math.PI/2;receiver.position.y=-.025;receiver.receiveShadow=true;scene.add(receiver);

const floor=kotak(8,.1,8,bahan(W.pelat));floor.rotation.y=0;const floorPos=titik(0,0,.025);panggung.add(floor);
const left=rakBuku(true),right=rakBuku(false);panggung.add(left.g,right.g);const leftPos=titik(-2.6,-2.8),rightPos=titik(2,-3);
left.g.rotation.y=right.g.rotation.y=0;
const meja=mejaBundar(),mejaPos=titik(0,1);panggung.add(meja);
const peserta=[],lampu=[],par=[];
for(let i=0;i<5;i++){
  const a=-Math.PI/2+i*2*Math.PI/5;
  const pos=titik(Math.cos(a)*1.8,1+Math.sin(a)*1.8,.1);
  const p=pionDuduk();p.pos=pos;p.g.rotation.y=Math.atan2(mejaPos.x-pos.x,mejaPos.z-pos.z);panggung.add(p.g);peserta.push(p);
  const l=lentera();l.pos=titik(Math.cos(a),1+Math.sin(a),3);panggung.add(l.g);lampu.push(l);
  const q=paragraf();q.pos=titik(Math.cos(a)*.98,1+Math.sin(a)*.98,.86);q.g.rotation.y=Math.PI/4-a;panggung.add(q.g);par.push(q);
}
const kutipan=[0,2,4].map((i)=>{const g=balonKutipan();panggung.add(g);return{g,i,pos:peserta[i].pos.clone().add(new THREE.Vector3(0,1.65,0))};});
const open=bukuTerbuka();const bookPos=titik(0,1,.9);open.g.rotation.y=Math.PI/4;panggung.add(open.g);
const flying=new THREE.Group(),flyMat=bahan(W.bukuBesar);flying.add(kotak(.25,.6,.5,flyMat));const flyPages=kotak(.2,.52,.42,bahan(W.kertas));flyPages.position.z=-.015;flying.add(flyPages);panggung.add(flying);

// Dust: particles have seeded origins and deterministic repeat cycles; stopped by 6.6 s.
const random=acakBenih(4404),dust=[];
for(let i=0;i<36;i++){
  const mat=bahan(W.abu,{transparent:true,opacity:.4});mat.userData.alpha=.4;const g=bola(.03,mat);
  const pos=titik(-2.6+(random()-.5)*2.6,-2.5+(random()-.5)*.45,.4+random()*1.7);
  panggung.add(g);dust.push({g,mat,pos,phase:random(),speed:.36+random()*.23});
}

const paths=peserta.map((p)=>{
  const end=p.pos.clone();end.y=.6;
  const middle=bookPos.clone().lerp(end,.5);middle.y=1.05;
  const curve=new THREE.QuadraticBezierCurve3(bookPos,middle,end),len=curve.getLength();
  const mat=new THREE.MeshBasicMaterial({color:W.zamrudPijar,transparent:true,opacity:0});
  const line=new THREE.Mesh(new THREE.TubeGeometry(curve,50,.012,6,false),mat);line.material.userData.alpha=1;panggung.add(line);
  const dots=[];for(let i=0;i<Math.ceil(len/.6)+1;i++){const m=bola(.07,new THREE.MeshBasicMaterial({color:W.zamrudPijar,transparent:true,opacity:0}));panggung.add(m);dots.push(m);}
  return{curve,len,line,mat,dots};
});
const lblLeft=label('KARYA PENDAHULU');
const vector=new THREE.Vector3();

function cameraAt(t){
  let H=campur(19,16,masukKeluar3(rentang(t,0,1.2)));
  let f=titik(0,0,.8);
  // Frame the shelf's middle while retaining the whole library within the portrait safe area.
  const shelfFocus=titik(-.7,-1.8,.8);
  const enter=masukKeluar3(rentang(t,6,7));H=campur(H,12,enter);f.lerp(shelfFocus,enter);
  const leave=masukKeluar3(rentang(t,12,13));H=campur(H,16,leave);f.lerp(titik(0,1,.8),leave);
  const end=masukKeluar3(rentang(t,18,19.5));H=campur(H,21,end);f.y+=.8*end;
  aturKamera(H,f.multiplyScalar(S));
}
function texte(el,a,y=16,scale=1){el.style.opacity=String(a);el.style.transform=`translateY(${y*(1-a)}px) scale(${scale})`;}
function texteAt(t){
  texte($('kepala'),keluar3(rentang(t,.6,1.2))*(1-halus(rentang(t,17.6,18))),12);
  texte($('gejala'),jendela(t,1.2,5.8));texte($('cermin'),jendela(t,6.6,12,.5));texte($('langkah'),jendela(t,13.6,18,.5));
  const end=keluar3(rentang(t,18.2,18.8));texte($('akhir'),end,12);
  const ajak=keluar3(rentang(t,18.6,19.2));texte($('ajakan'),ajak,16,.92+.08*ajak);
  $('sumber').style.opacity=String(.45*keluar3(rentang(t,19,19.6)));
}

export function tampilkan(rawT){
  const t=klem(Number.isFinite(rawT)?rawT:0,0,DURASI),s=Math.min(t,18);
  cameraAt(t);tanah.uniforms.uJari.value=20*keluar3(rentang(t,0,.6));
  muncul(floor,s,.6,floorPos);muncul(left.g,s,.72,leftPos);muncul(right.g,s,.84,rightPos);muncul(meja,s,.96,mejaPos);
  peserta.forEach((p,i)=>{muncul(p.g,s,1+i*.02,p.pos);p.mat.color.copy(W.pion);p.figur.position.y=-.25;});
  lampu.forEach((l,i)=>{muncul(l.g,s,1.05+i*.01,l.pos);const gold=i===0?keluar3(rentang(s,15.6,16.4)):0;l.mat.color.copy(W.abuGelap).lerp(W.emas,gold);l.mat.emissive.copy(W.emasPijar);l.mat.emissiveIntensity=.9*gold;l.mat.userData.goldBloom=gold>0;l.light.intensity=1.5*gold;});
  left.debu.visible=s<15.6;left.debu.scale.setScalar(1);opacity(left.debu,1-halus(rentang(s,12.4,13.4)));
  const pulse=s>=7&&s<=11.8?Math.sin(Math.PI*((s-7)%1.2)/1.2)**2:0;
  left.besar.forEach((b,i)=>{b.g.visible=!(i===2&&s>=12.4);b.edge.material.opacity=.15+.85*pulse;b.edge.visible=pulse>0;b.mat.emissive.copy(W.zamrudPijar);b.mat.emissiveIntensity=.5*pulse;b.g.scale.setScalar(1+.018*pulse);});
  const dustTime=s<6?s:s<6.6?6+(s-6)-((s-6)**2/1.2):6.3;
  dust.forEach(p=>{const phase=(Math.max(0,dustTime-3.6)*p.speed+p.phase)%1;const a=s>=3.6&&s<12.4?.4*Math.sin(Math.PI*phase)*keluar3(rentang(s,3.6,4)):0;p.g.visible=a>0;p.mat.opacity=a;p.g.position.copy(p.pos);p.g.position.y+=.8*phase;});
  kutipan.forEach((b,i)=>{const start=1.6+i*.25,end=4.7+i*.45;const a=jendela(s,start,end,.4);b.g.position.copy(b.pos);b.g.quaternion.copy(kamera.quaternion);b.g.scale.setScalar((.93+.07*Math.sin(s*4+i))*(.75+.25*a));opacity(b.g,a);});

  const fly=masukKeluar3(rentang(s,12.4,13.4));
  left.g.updateMatrixWorld(true);left.besar[2].g.updateMatrixWorld(true);
  const from=left.besar[2].g.getWorldPosition(new THREE.Vector3());panggung.worldToLocal(from);
  flying.visible=s>=12.4&&s<13.37;flying.position.copy(from).lerp(bookPos,fly);flying.position.y+=Math.sin(Math.PI*fly)*1.1;
  flying.rotation.set(-Math.PI*.5*fly,Math.PI/4,Math.sin(fly*Math.PI)*.22);flying.scale.setScalar(1);
  const opened=keluar3(rentang(s,13.15,13.4));open.g.visible=s>=13.15;open.g.position.copy(bookPos);open.pages.forEach(p=>p.pivot.rotation.z=-p.sign*(1-opened)*1.48);
  const gold=rentang(s,15.6,16.4),click=rentang(s,15.6,15.95),scale=s>=15.6&&s<15.95?1+.25*(1-pegas(click)):1;
  open.g.scale.setScalar(scale);open.hasil.forEach((m,i)=>{m.color.copy(i%2===0?W.bukuBesar:W.kertas).lerp(W.emas,halus(gold));m.emissive.copy(W.emasPijar);m.emissiveIntensity=.9*gold+(s>=15.6&&s<15.95?.5*Math.sin(Math.PI*click):0);m.userData.goldBloom=gold>0;});
  paths.forEach((p,i)=>{const a=keluar3(rentang(s,13.4,14.4));p.line.visible=a>0;p.mat.opacity=.7*a;p.line.scale.setScalar(1);p.dots.forEach((m,j)=>{const distance=(Math.max(0,s-13.4)*2-j*.6);const d=((distance%p.len)+p.len)%p.len;m.visible=a>0&&distance>=0;m.material.opacity=.9*a;m.position.copy(p.curve.getPointAt(d/p.len));});});
  par.forEach((p,i)=>{const a=muncul(p.g,s,14.4+i*.12,p.pos);p.g.scale.multiplyScalar(scale);p.mat.color.copy(W.kertas).lerp(W.emas,halus(gold));p.mat.emissive.copy(W.emasPijar);p.mat.emissiveIntensity=.9*gold+(s>=15.6&&s<15.95?.5*Math.sin(Math.PI*click):0);p.mat.opacity=a;p.mat.userData.goldBloom=gold>0;});
  // Preserve the final state: s is clamped at 18 even while the closing camera recedes.
  scene.updateMatrixWorld(true);composer.render();texteAt(t);
  vector.copy(titik(-2.6,-2.9,3.02));panggung.localToWorld(vector);taruh(lblLeft,vector,jendela(s,1.2,17.8,.4)*.82);
}

window.DURASI=DURASI;window.tampilkan=tampilkan;
window.siap=(async()=>{await Promise.all(['700 50px "Noto Serif"','italic 700 52px "Noto Serif"','600 40px "DM Sans"','700 38px "JetBrains Mono"','600 22px "JetBrains Mono"','500 19px "JetBrains Mono"'].map(f=>document.fonts.load(f)));await document.fonts.ready;tampilkan(0);})();
const prm=new URLSearchParams(location.search);
if(!prm.has('rekam'))window.siap.then(()=>{if(prm.has('t')){tampilkan(Number(prm.get('t'))||0);return;}const mulai=performance.now();const putar=()=>{tampilkan((performance.now()-mulai)/1000%DURASI);requestAnimationFrame(putar);};putar();});
