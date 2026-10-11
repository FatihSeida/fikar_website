import * as THREE from 'three';
import { W,bahan,kotak,bola,silinder,titik,acakBenih } from './alat.js';

export function rakBuku(pendahulu=false) {
  const g=new THREE.Group(), struktur=bahan(W.abuGelap), punggung=bahan(W.pelat), besar=[], acak=acakBenih(pendahulu?404:405);
  const balok=(w,h,d,x,y,z,mat=struktur)=>{const m=kotak(w,h,d,mat);m.position.set(x,y,z);g.add(m);return m;};
  balok(3,2.6,.08,0,1.35,-.28,punggung);
  for(const x of [-1.47,1.47])balok(.12,2.7,.68,x,1.35,0);
  for(let j=0;j<5;j++)balok(3,.1,.7,0,.08+j*.65,0);
  balok(3.12,.14,.76,0,2.75,0);balok(3.12,.12,.76,0,.04,0);
  for(let row=0;row<4;row++){
    for(let n=0;n<10;n++){
      const h=.4+acak()*.13,w=.12+acak()*.08;
      // Prompt-specific bookshelf palette is restricted to its stated endpoints.
      const col=pendahulu?W.abuGelap.clone().lerp(W.abu,acak()*.38):new THREE.Color().setHSL((150+30*acak())/360,(10+20*acak())/100,(25+15*acak())/100);
      const mat=bahan(col);const b=balok(w,h,.45,-1.28+n*.275,.18+row*.65+h/2,.03,mat);
      b.rotation.z=(acak()-.5)*.08;
      for(const y of [-h*.27,h*.27]){const band=kotak(w*.77,.018,.012,bahan(pendahulu?W.abu:W.kertas));band.position.set(0,y,.231);b.add(band);}
      if(pendahulu&&row===1&&n>=2&&n<=7)b.visible=false;
    }
  }
  if(pendahulu)for(let i=0;i<6;i++){
    const bg=new THREE.Group(),mat=bahan(W.bukuBesar);const cover=kotak(.25,.6,.5,mat);bg.add(cover);
    const pages=kotak(.19,.52,.4,bahan(W.kertas));pages.position.z=-.03;bg.add(pages);
    const spine=kotak(.25,.6,.055,mat);spine.position.z=.25;bg.add(spine);
    for(const y of [-.19,.19]){const b=kotak(.18,.022,.01,bahan(W.abu));b.position.set(0,y,.282);bg.add(b);}
    bg.position.set(-.82+i*.33,1.12,.035);g.add(bg);
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.27,.62,.52)),new THREE.LineBasicMaterial({color:W.zamrudPijar,transparent:true,opacity:0}));bg.add(edge);besar.push({g:bg,mat,edge,pos:bg.position.clone()});
  }
  const debu=new THREE.Group();
  for(let i=0;i<115;i++){
    const b=bola(.012+acak()*.013,bahan(W.abu,{transparent:true,opacity:.45}));
    const row=Math.floor(acak()*4);b.position.set((acak()-.5)*2.85,.16+row*.65+acak()*.055,(acak()-.5)*.62);debu.add(b);
  }
  g.add(debu);debu.visible=pendahulu;
  return {g,besar,debu,struktur};
}

export function pionDuduk(){
  const g=new THREE.Group(),mat=bahan(W.pion);
  const badan=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.46,6,16),mat);badan.position.y=.56;badan.castShadow=true;g.add(badan);
  const kepala=bola(.16,mat);kepala.position.y=1.08;g.add(kepala);
  const figur=new THREE.Group();figur.add(badan,kepala);figur.position.y=-.25;g.add(figur);
  const kursi=new THREE.Group();const km=bahan(W.abuGelap);
  const duduk=kotak(.57,.1,.57,km);duduk.position.y=.36;kursi.add(duduk);
  const sandar=kotak(.57,.57,.09,km);sandar.position.set(0,.64,-.27);kursi.add(sandar);
  for(const x of [-.22,.22])for(const z of [-.22,.22]){const kaki=kotak(.065,.34,.065,km);kaki.position.set(x,.17,z);kursi.add(kaki);}
  g.add(kursi);
  return {g,figur,mat};
}

export function mejaBundar(){const g=new THREE.Group(),mat=bahan(W.zamrudRedup);const kaki=silinder(.2,.65,mat);kaki.position.y=.405;g.add(kaki);const top=silinder(1.3,.1,mat);top.position.y=.78;g.add(top);const alas=silinder(.52,.08,bahan(W.pelat));alas.position.y=.08;g.add(alas);return g;}

export function lentera(){
  const g=new THREE.Group(),mat=bahan(W.abuGelap),body=bola(.25,mat);g.add(body);
  const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.27,0),new THREE.Vector3(0,1.47,0)]);
  const tali=new THREE.Line(geo,new THREE.LineBasicMaterial({color:W.abuGelap}));g.add(tali);
  const tutup=silinder(.12,.065,bahan(W.abuGelap));tutup.position.y=.25;g.add(tutup);
  for(const angle of [0,Math.PI/2]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.253,.012,6,40),bahan(W.abu));ring.rotation.y=angle;g.add(ring);}
  const light=new THREE.PointLight(W.emasPijar,0,4,2);g.add(light);return {g,mat,body,light};
}

export function bukuTerbuka(){
  const g=new THREE.Group(),hasil=[],pages=[];
  for(const sign of [-1,1]){
    const pivot=new THREE.Group();g.add(pivot);
    const cm=bahan(W.bukuBesar),pm=bahan(W.kertas);hasil.push(cm,pm);
    const cover=kotak(.62,.045,.83,cm);cover.position.x=sign*.31;pivot.add(cover);
    const lembar=kotak(.56,.065,.77,pm);lembar.position.set(sign*.31,.05,0);pivot.add(lembar);
    const garis=bahan(W.abuGelap);
    for(let j=0;j<7;j++){const line=kotak(j===6?.27:.43,.004,.012,garis);line.position.set(sign*.31,.085,-.27+j*.075);pivot.add(line);}
    pages.push({pivot,sign});
  }
  const spine=kotak(.06,.09,.84,bahan(W.bukuBesar));g.add(spine);hasil.push(spine.material);
  return {g,hasil,pages};
}

export function paragraf(){
  const g=new THREE.Group(),mat=bahan(W.kertas),paper=kotak(.6,.02,.8,mat);g.add(paper);
  const ink=bahan(W.abuGelap);for(let i=0;i<7;i++){const line=kotak(i===6?.26:.44,.005,.013,ink);line.position.set(i===6?-.09:0,.015,-.27+i*.072);g.add(line);}
  return {g,mat};
}

// Hollow dashed silhouettes only: these quote balloons deliberately have no text or fill.
export function balonKutipan(){
  const g=new THREE.Group(),pts=[];const w=.7,h=.4,r=.2;
  for(const [cx,cy,start] of [[w-r,h-r,0],[-w+r,h-r,Math.PI/2],[-w+r,-h+r,Math.PI],[w-r,-h+r,Math.PI*1.5]]){
    for(let i=0;i<=12;i++){const a=start+i/12*Math.PI/2;pts.push(new THREE.Vector3(cx+r*Math.cos(a),cy+r*Math.sin(a),0));}
  }
  pts.push(pts[0].clone());
  const mat=new THREE.LineDashedMaterial({color:W.kertas,dashSize:.085,gapSize:.065,transparent:true,opacity:.85});mat.userData.alpha=.85;
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat);line.computeLineDistances();g.add(line);
  const tail=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.25,-.4,0),new THREE.Vector3(-.34,-.66,0),new THREE.Vector3(.02,-.4,0)]),mat);tail.computeLineDistances();g.add(tail);return g;
}
