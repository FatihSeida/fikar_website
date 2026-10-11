// Adapted locally from ekosistem-berbasis-bukti/alat.js. No cross-folder imports.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export const W = Object.fromEntries(Object.entries({ latar:'hsl(153,50%,7%)',grid:'hsl(153,36%,11.5%)',gridMayor:'hsl(153,40%,15%)',pelat:'hsl(153,36%,10%)',zamrud:'hsl(153,62%,36%)',zamrudPijar:'hsl(153,72%,42%)',zamrudRedup:'hsl(153,55%,24%)',emas:'hsl(42,52%,58%)',emasPijar:'hsl(42,80%,52%)',krem:'hsl(42,33%,96%)',kertas:'hsl(42,28%,86%)',abu:'hsl(150,5%,52%)',abuGelap:'hsl(150,6%,34%)',pion:'hsl(150,10%,80%)',bukuBesar:'hsl(42,20%,40%)' }).map(([k,v])=>[k,new THREE.Color(v)]));
export const klem=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const campur=(a,b,u)=>a+(b-a)*u;
export const rentang=(t,a,b)=>klem((t-a)/(b-a));
export const keluar3=x=>1-(1-klem(x))**3;
export const masukKeluar3=x=>{x=klem(x);return x<.5?4*x*x*x:1-(-2*x+2)**3/2;};
export const halus=x=>{x=klem(x);return x*x*(3-2*x);};
export const pegas=x=>1-Math.exp(-9*klem(x))*Math.cos(12*klem(x));
export const lenting=pegas;
export const jendela=(t,a,b,w=.4)=>keluar3(rentang(t,a,a+w))*(1-halus(rentang(t,b-w,b)));
export const titik=(r,d,y=0)=>new THREE.Vector3((r+d)/Math.SQRT2,y,(d-r)/Math.SQRT2);
export const $=id=>document.getElementById(id);
// Mulberry32: identical seed and geometry on every load.
export function acakBenih(seed=4044){return()=>{let z=seed+=0x6D2B79F5;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return((z^z>>>14)>>>0)/4294967296;};}
export function bahan(w,extra={}) { return new THREE.MeshStandardMaterial({color:w,roughness:.8,metalness:0,...extra}); }
export function kotak(w,h,d,mat,r=.06) { const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),mat);m.castShadow=true;m.receiveShadow=true;return m; }
export function bola(r,mat){const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),mat);m.castShadow=true;m.receiveShadow=true;return m;}
export function silinder(r,h,mat){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,40),mat);m.castShadow=true;m.receiveShadow=true;return m;}
export function opacity(g,a) {g.visible=a>.0001;g.traverse(o=>{if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m.transparent=true;m.opacity=(m.userData.alpha??1)*a;m.depthWrite=a>.98;}}});}
export function muncul(g,t,a,pos) {const u=keluar3(rentang(t,a,a+.5));g.position.copy(pos);g.position.y-=.6*(1-u);g.scale.setScalar(.85+.15*u);opacity(g,u);return u;}

export const scene=new THREE.Scene();scene.background=W.latar.clone();
export const kamera=new THREE.OrthographicCamera(-4.5,4.5,8,-8,.1,180);
export const renderer=new THREE.WebGLRenderer({canvas:$('kanvas'),antialias:true,alpha:false,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(1080,1920);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
scene.add(new THREE.HemisphereLight(W.krem,W.pelat,1.6));
export const matahari=new THREE.DirectionalLight(W.krem,2.4);matahari.position.set(-8,15,9);matahari.castShadow=true;matahari.shadow.mapSize.set(2048,2048);Object.assign(matahari.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.1,far:55});matahari.shadow.bias=-.0003;matahari.shadow.normalBias=.025;scene.add(matahari);scene.add(matahari.target);
const rim=new THREE.DirectionalLight(W.zamrudPijar,.28);rim.position.set(4,6,-8);scene.add(rim);
// Selective bloom: neutral paper and figurines never enter the glow pass.
// Keep the requested bloom settings fixed; only the final gold materials are eligible.
const bloomComposer=new EffectComposer(renderer);bloomComposer.renderToScreen=false;bloomComposer.addPass(new RenderPass(scene,kamera));
export const bloom=new UnrealBloomPass(new THREE.Vector2(1080,1920),.5,.5,.74);bloomComposer.addPass(bloom);
const finalComposer=new EffectComposer(renderer);finalComposer.addPass(new RenderPass(scene,kamera));
finalComposer.addPass(new ShaderPass({uniforms:{baseTexture:{value:null},bloomTexture:{value:bloom.renderTargetsHorizontal[0].texture}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform sampler2D baseTexture;uniform sampler2D bloomTexture;varying vec2 vUv;void main(){gl_FragColor=texture2D(baseTexture,vUv)+texture2D(bloomTexture,vUv);}'},'baseTexture'));
finalComposer.addPass(new OutputPass());
const blackMesh=new THREE.MeshBasicMaterial({color:0}),blackLine=new THREE.LineBasicMaterial({color:0}),blackBackground=new THREE.Color(0),savedMaterials=new Map(),savedEmission=new Map();
export const composer={render(){
  const background=scene.background;scene.background=blackBackground;
  scene.traverse(o=>{if(!o.material)return;const m=o.material;if(!Array.isArray(m)&&m.userData.goldBloom){
    // HDR exposure for the isolated extraction pass; base materials retain their exact .9 emission.
    if(!savedEmission.has(m)){savedEmission.set(m,m.emissiveIntensity);m.emissiveIntensity*=2.2;}return;
  }savedMaterials.set(o,m);o.material=o.isLine?blackLine:blackMesh;});
  try{bloomComposer.render();}finally{
    savedMaterials.forEach((m,o)=>{o.material=m;});savedMaterials.clear();
    savedEmission.forEach((v,m)=>{m.emissiveIntensity=v;});savedEmission.clear();scene.background=background;
  }
  finalComposer.render();
}};
const dir=new THREE.Vector3(1,1,1).normalize();
export function aturKamera(H,fokus){const lebar=H*1080/1920;Object.assign(kamera,{left:-lebar/2,right:lebar/2,top:H/2,bottom:-H/2});kamera.position.copy(fokus).addScaledVector(dir,35);kamera.lookAt(fokus);kamera.updateMatrixWorld();const up=new THREE.Vector3(0,1,0).applyQuaternion(kamera.quaternion);kamera.position.addScaledVector(up,H*(1010/1920-.5));kamera.updateMatrixWorld();kamera.updateProjectionMatrix();}
export function label(text){const el=document.createElement('div');el.className='lbl-benda';el.textContent=text;$('label3d').appendChild(el);return el;}
export function taruh(el,pos,a){const p=pos.clone().project(kamera);el.style.left=`${(p.x*.5+.5)*1080}px`;el.style.top=`${(-p.y*.5+.5)*1920}px`;el.style.opacity=String(a);}
