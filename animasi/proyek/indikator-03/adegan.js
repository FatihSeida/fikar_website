// Indikator 03: latihan yang tertahan, lalu materi diperbarui oleh peserta.
import * as THREE from "three";
import { W, $, bahan, balok, titik, campur, klem, rentang, halus, keluar3, masukKeluar3, pegas, composer, scene, matahari, ARAH_CAHAYA, keadaan, aturKamera, buatLabel, taruh } from "./alat.js";

const DURASI=21, DEG=Math.PI/180, SKALA_RUANG=.75;
const material=(c,opts={})=>bahan(c,{roughness:.8,metalness:0,...opts});
const box=(w,h,d,c,r=.06)=>balok(w,h,d,c?.isMaterial?c:material(c),r);
const setAlpha=(m,a)=>{m.transparent=a<.999;m.opacity=a;};
const addBox=(parent,w,h,d,c,pos,r=.06)=>{const o=box(w,h,d,c,r);o.position.set(...pos);parent.add(o);return o;};
const latarTanah=new THREE.ShaderMaterial({uniforms:{uLatar:{value:W.latar},uGaris:{value:W.grid},uMayor:{value:W.gridMayor},uFokus:{value:new THREE.Vector3()},uJari:{value:20}},vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`uniform vec3 uLatar,uGaris,uMayor;uniform vec3 uFokus;uniform float uJari;varying vec3 vW;float grid(vec2 p,float t){vec2 g=abs(fract(p-.5)-.5)/fwidth(p);return 1.0-min(min(g.x,g.y)/t,1.0);}void main(){vec2 p=vW.xz+vec2(.5);float a=grid(p,1.1),b=grid(p/5.0,1.5);float fade=1.0-smoothstep(uJari*.28,uJari+0.01,length(vW.xz-uFokus.xz));vec3 c=mix(uLatar,uGaris,a*fade);c=mix(c,uMayor,b*fade);gl_FragColor=vec4(c,1.0);}`});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(300,300),latarTanah);ground.rotation.x=-Math.PI/2;ground.position.y=-.06;scene.add(ground);
const receiver=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.ShadowMaterial({color:new THREE.Color("hsl(153,60%,2%)"),opacity:.4}));receiver.rotation.x=-Math.PI/2;receiver.position.y=-.04;receiver.receiveShadow=true;scene.add(receiver);

// Ruang kelas mini: panggung, dua dinding, bukaan jendela, papan dan jam.
const room=new THREE.Group();scene.add(room);
const floor=addBox(room,6,.12,5,W.pelat,[0,0,0]);
// Dinding belakang dibangun mengitari bukaan jendela agar kotak luar tetap tampak.
addBox(room,4.42,1.8,.14,W.zamrudRedup,[-.73,.96,-2.43]);
addBox(room,.72,1.8,.14,W.zamrudRedup,[2.64,.96,-2.43]);
addBox(room,1.62,.38,.14,W.zamrudRedup,[1.47,.25,-2.43]);
addBox(room,1.62,.42,.14,W.zamrudRedup,[1.47,1.69,-2.43]);
// Dinding sisi kiri membentuk ruang L.
addBox(room,.14,1.8,4.85,W.zamrudRedup,[-2.93,.96,.02]);
// bingkai jendela pada bukaan, empat bilah tipis.
const frameMat=material(W.zamrudRedup); const frameGlow=material(W.zamrudPijar,{emissive:W.zamrudPijar.clone(),emissiveIntensity:.12});
addBox(room,1.72,.07,.2,frameMat,[1.47,1.49,-2.4]);addBox(room,1.72,.07,.2,frameMat,[1.47,.46,-2.4]);addBox(room,.07,1.1,.2,frameMat,[.62,.98,-2.4]);addBox(room,.07,1.1,.2,frameMat,[2.32,.98,-2.4]);
const windowGlaze=new THREE.Mesh(new THREE.PlaneGeometry(1.58,1.0),new THREE.MeshStandardMaterial({color:W.zamrud,transparent:true,opacity:.16,roughness:.2,metalness:0,side:THREE.DoubleSide}));windowGlaze.position.set(1.47,.98,-2.36);room.add(windowGlaze);

const board=new THREE.Group();board.position.set(-.35,1.45,-2.30);room.add(board);
const boardBack=addBox(board,4,2.6,.12,W.abuGelap,[0,0,0]);
const boardFace=addBox(board,3.72,2.32,.035,W.abu,[0,.01,.08],.025);
const boardEdges=[];for(const [w,h,x,y] of [[4,.1,0,1.3],[4,.1,0,-1.3],[.1,2.6,-1.95,0],[.1,2.6,1.95,0]]){const m=material(W.abuGelap,{emissive:W.zamrudPijar.clone(),emissiveIntensity:0});const o=addBox(board,w,h,.14,W.abuGelap,[x,y,0]);o.material=m;boardEdges.push(m);}
// Dust specks are fixed-seed points baked onto the board surface.
const dustGeo=new THREE.BufferGeometry(),dustPos=[];for(let i=0;i<74;i++){const x=((i*37)%101)/101*3.45-1.72,y=((i*61)%97)/97*2.0-.98;dustPos.push(x,y,.109);}
dustGeo.setAttribute("position",new THREE.Float32BufferAttribute(dustPos,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:W.kertas,size:.025,transparent:true,opacity:.38,sizeAttenuation:true}));board.add(dust);
// Chalk traces are geometry, not lettering; all readable writing remains HTML.
const chalkMat=material(W.abuGelap);const chalk=[];for(let i=0;i<9;i++){const y=.78-i*.19;chalk.push(addBox(board,1.45+(i%3)*.3,.025,.012,chalkMat,[-.48+(i%2)*.2,y,.115],.01));}
const module=new THREE.Group();module.position.set(0,0,.14);board.add(module);
const modPanel=addBox(module,3.72,2.32,.05,W.zamrud,[0,.01,0]);modPanel.material.emissive.copy(W.emasPijar);modPanel.material.emissiveIntensity=0;
const modLineMat=material(W.pelat);const modLines=[];for(let i=0;i<6;i++)modLines.push(addBox(module,2.65-(i%2)*.5,.045,.018,modLineMat,[-.15,.78-i*.25,.04],.02));
const modTag=addBox(module,.62,.22,.025,W.zamrudRedup,[1.25,.87,.045],.06);
module.visible=false;
// Cermin edge lights.
const edgeGroup=new THREE.Group();board.add(edgeGroup);for(const [x,y,w,h] of [[0,1.27,3.8,.025],[0,-1.27,3.8,.025],[-1.9,0,.025,2.54],[1.9,0,.025,2.54]]){const m=material(W.zamrudPijar,{emissive:W.zamrudPijar.clone(),emissiveIntensity:0});edgeGroup.add(addBox(edgeGroup,w,h,.03,W.zamrudPijar,[x,y,.13],.01)).material=m;}

// Jam analog tanpa angka. Jarumnya benar-benar berhenti selama gejala/cermin.
const clock=new THREE.Group();clock.position.set(-2.7,1.42,-1.05);clock.rotation.y=Math.PI/2;room.add(clock);
const clockFace=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.10,48),material(W.abu));clockFace.rotation.x=Math.PI/2;clock.add(clockFace);
const clockRim=new THREE.Mesh(new THREE.TorusGeometry(.36,.035,8,48),material(W.abuGelap));clockRim.position.z=.06;clock.add(clockRim);
const clockHands=new THREE.Group();clockHands.position.z=.12;clock.add(clockHands);
const handH=addBox(clockHands,.045,.23,.025,W.abuGelap,[0,.11,0],.015),handM=addBox(clockHands,.035,.28,.025,W.abuGelap,[.02,.10,.015],.01);
const hub=new THREE.Mesh(new THREE.SphereGeometry(.045,12,8),material(W.abuGelap));hub.position.z=.04;clockHands.add(hub);

// Six seated, faceless learners facing the board; chairs, torso, head and feet stay neutral.
const learners=[];const learnerMat=material(W.pion),seatMat=material(W.zamrudRedup);
for(let i=0;i<6;i++){const row=Math.floor(i/3),col=i%3,x=-1.35+col*1.35,z=.25+row*1.2;const g=new THREE.Group();g.position.set(x,0,z);room.add(g);
 const seat=addBox(g,.68,.12,.6,seatMat,[0,.47,.02]);addBox(g,.58,.08,.5,seatMat,[0,.17,.02]);
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.25,4,10),learnerMat);body.position.set(0,.91,0);body.scale.y=.82;g.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),learnerMat);head.position.set(0,1.26,0);g.add(head);
 // arms resting low, suggesting seated listening posture.
 const armL=new THREE.Mesh(new THREE.CapsuleGeometry(.05,.22,3,7),learnerMat);armL.position.set(-.22,.88,.16);armL.rotation.z=-.58;g.add(armL);
 const armR=new THREE.Mesh(new THREE.CapsuleGeometry(.05,.22,3,7),learnerMat);armR.position.set(.22,.88,.16);armR.rotation.z=.58;g.add(armR);
  const card=new THREE.Group();card.position.set(0,1.46,.08);g.add(card);const cardBase=addBox(card,.58,.78,.035,W.kertas,[0,0,0],.035);card.visible=false;
  const markEl=buatLabel("lbl-mark","≡");learners.push({g,body,head,arms:[armL,armR],card,cardBase,markEl,x,z,seat});
}

// Speed cues pass behind the window; seeded phase offsets avoid any clock state.
const speedCubes=[];for(let i=0;i<8;i++){const o=box(.3,.3,.3,i%2?W.zamrud:W.zamrudRedup,.025);room.add(o);speedCubes.push(o);}
const dustMotes=[];for(let i=0;i<18;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({color:W.abu,transparent:true,opacity:.4}));board.add(m);dustMotes.push(m);}

// Camera is fixed isometric; only its orthographic size and target change.
const F0=titik(0,0,.55).multiplyScalar(SKALA_RUANG),Fboard=new THREE.Vector3(-.14,.9,-.7),Fstep=titik(0,0,.6).multiplyScalar(SKALA_RUANG),Fend=titik(0,0,1.4).multiplyScalar(SKALA_RUANG),_focus=new THREE.Vector3();
function cameraAt(t){let f=F0.clone(),H=campur(19,16,masukKeluar3(rentang(t,0,1.2)));if(t>6){const k=masukKeluar3(rentang(t,6,7));f.lerpVectors(F0,Fboard,k);H=campur(16,12,k);}if(t>12){const k=masukKeluar3(rentang(t,12,13));f.lerpVectors(Fboard,Fstep,k);H=campur(12,16,k);}if(t>18){const k=masukKeluar3(rentang(t,18,19.5));f.lerpVectors(Fstep,Fend,k);H=campur(16,21,k);}return {f,H};}
function entrance(t,start,d=.5){return keluar3(rentang(t,start,start+d));}
function goldIntensity(t,start){const k=rentang(t,start,start+.8);return k===0?0:k<.5?1.4*keluar3(k*2):1.4-.5*halus((k-.5)*2);}
function setBoard(t){const gone=halus(rentang(t,14.8,15.8));boardFace.material.color.copy(W.abu).lerp(W.zamrud,gone);boardBack.material.color.copy(W.abuGelap).lerp(W.pelat,gone);dust.visible=t<14.95;chalk.forEach(m=>{m.visible=t<14.8;});
 const wipe=masukKeluar3(rentang(t,14.8,15.8));module.visible=t>=14.8;module.position.x=-1.9+1.9*wipe;module.scale.x=Math.max(.001,wipe);
 const active=t>=7&&t<=11.8,pulse=active?Math.pow(Math.sin(Math.PI*(t-7)/1.2),2):0;edgeGroup.visible=active;for(const m of boardEdges)m.emissiveIntensity=.5*pulse;for(const c of edgeGroup.children)c.material.emissiveIntensity=.5*pulse;
 const g=halus(rentang(t,14.8,15.6));modPanel.material.color.copy(W.zamrud).lerp(W.emas,g);modTag.material.color.copy(W.zamrudRedup).lerp(W.emas,g);modPanel.material.emissiveIntensity=goldIntensity(t,14.8);modTag.material.emissive.copy(W.emasPijar);modTag.material.emissiveIntensity=goldIntensity(t,14.8);modPanel.scale.setScalar(1+(t>=14.8?.25*pegas(t-14.8):0));
}
function animate(t){const roomIn=entrance(t,.6,.65);room.visible=t>=.6;board.visible=t>=.95;clock.visible=t>=1.3;room.position.y=-.6*(1-roomIn);room.scale.setScalar(SKALA_RUANG*(.85+.15*roomIn));room.traverse(o=>{if(o.isMesh&&o!==dust){o.material.transparent=roomIn<.999;o.material.opacity=roomIn;}});windowGlaze.material.transparent=true;windowGlaze.material.opacity=.16*roomIn;
 // Rubbed out board and stopped clock are the symptom. The outside remains in motion.
 const dustClock=t<6.6?t:(t<12?6.6:6.6+(t-12));
 speedCubes.forEach((o,i)=>{const distance=((t*3+i*.6)%3+3)%3;o.visible=t>=1.8&&roomIn>.1&&distance<1.55;o.position.set(.69+distance,.63+((i%3)-1)*.22,-2.65-(i%2)*.05);o.rotation.set(t*1.3+i,t*.8,0);});
 dustMotes.forEach((m,i)=>{const ph=((dustClock*1.05+i*.137)%1+1)%1;m.visible=t>=1.8&&t<14.8;m.position.set(-1.72+((i*29)%51)/50*3.4,-1.08+ph*.92,.15);m.material.opacity=.4*(1-ph);});
 learners.forEach((p,i)=>{p.g.visible=t>=1.4+i*.075;const raised=rentang(t,12.4+i*.2,12.75+i*.2);const flight=halus(rentang(t,14+i*.045,14.8+i*.045));p.card.visible=t>=12.4+i*.2;
  p.card.rotation.set(0,0,0);p.card.position.set(0,1.46+raised*.88,.08);
  if(t>=14){room.updateMatrixWorld(true);p.g.updateMatrixWorld(true);const start=p.g.localToWorld(new THREE.Vector3(0,2.34,.08));const col=i<3?-1.67:1.67,row=i%3;const target=room.localToWorld(new THREE.Vector3(-.35+col,1.45+(1-row)*.69,-2.08));const world=start.lerp(target,flight);p.card.position.copy(p.g.worldToLocal(world));p.card.rotation.z=(i%2?-.08:.08)*flight;}
  const opacity=t<15.8?.7:1;for(const m of [p.body.material,p.head.material,...p.arms.map(a=>a.material)]){m.transparent=opacity<1;m.opacity=opacity;}
 });
 let sec=rentang(t,15.8,19.8)*Math.PI*2;clockHands.rotation.z=t<15.8?0:sec;
 setBoard(t);
}

const title=$("kepala"),endTitle=$("kepala-akhir"),cta=$("ajakan"),source=$("sumber"),captions=[...document.querySelectorAll(".ket")];
function textAt(t){const h=keluar3(rentang(t,.6,1.2))*(1-halus(rentang(t,17.6,18)));title.style.opacity=String(h);title.style.transform=`translateY(${(12*(1-h)).toFixed(1)}px)`;const eh=keluar3(rentang(t,18.2,18.8));endTitle.style.opacity=String(eh);endTitle.style.transform=`translateY(${(12*(1-eh)).toFixed(1)}px)`;
 const phases=[[1.2,5.8,5.8],[6.6,11.6,12],[13.6,17.6,18]];phases.forEach(([a,b,c],i)=>{let k=keluar3(rentang(t,a,a+.5))*(1-halus(rentang(t,b,c)));captions[i].style.opacity=String(k);captions[i].style.transform=`translateY(${(16*(1-k)).toFixed(1)}px)`;});const ca=keluar3(rentang(t,18.6,19.2));cta.style.opacity=String(ca);cta.style.transform=`scale(${(.92+.08*ca).toFixed(4)})`;const so=keluar3(rentang(t,19,19.6));source.style.opacity=String(.45*so);source.style.transform="";
}
function tampilkan(t){t=klem(t,0,DURASI);const cam=cameraAt(t);_focus.copy(cam.f);aturKamera(keadaan(cam.f,cam.H));matahari.target.position.set(cam.f.x,0,cam.f.z);matahari.position.copy(matahari.target.position).addScaledVector(ARAH_CAHAYA,50);matahari.target.updateMatrixWorld();latarTanah.uniforms.uFokus.value.set(cam.f.x,0,cam.f.z);latarTanah.uniforms.uJari.value=20*keluar3(rentang(t,0,.6));animate(Math.min(t,18));composer.render();textAt(t);room.updateMatrixWorld(true);learners.forEach(p=>{p.card.updateMatrixWorld(true);const pos=p.card.getWorldPosition(new THREE.Vector3());taruh(p.markEl,pos,p.card.visible?1:0,{dy:-3});});}
window.DURASI=DURASI;window.tampilkan=tampilkan;window.siap=(async()=>{await Promise.all(['700 50px "Noto Serif"','italic 700 52px "Noto Serif"','600 40px "DM Sans"','500 19px "JetBrains Mono"','600 22px "JetBrains Mono"','700 22px "JetBrains Mono"'].map(f=>document.fonts.load(f)));await document.fonts.ready;tampilkan(0);})();
const query=new URLSearchParams(location.search);if(!query.has("rekam"))window.siap.then(()=>{if(query.has("t")){tampilkan(parseFloat(query.get("t"))||0);return;}const start=performance.now();const loop=()=>{tampilkan(((performance.now()-start)/1000)%DURASI);requestAnimationFrame(loop);};loop();});
