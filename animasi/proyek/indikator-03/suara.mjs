/**
 * Efek suara mandiri untuk Indikator 03. Tanpa suara manusia dan tanpa musik latar.
 * Jalankan dari folder animasi/: node indikator-03/suara.mjs
 * Membuat hasil/indikator-03.wav dan hasil/indikator-03-suara.mp4.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here=dirname(fileURLToPath(import.meta.url)),out=resolve(here,"..","..","hasil"),video=resolve(out,"indikator-03.mp4");
const wav=resolve(out,"indikator-03.wav"),raw=resolve(out,"indikator-03-raw.wav"),mux=resolve(out,"indikator-03-suara.mp4");
const SR=48000,SEC=21,N=SR*SEC,TAU=2*Math.PI,L=new Float32Array(N),R=new Float32Array(N);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
let seed=0x03a11ce;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
const panG=p=>[Math.cos((clamp(p,-1,1)+1)*Math.PI/4),Math.sin((clamp(p,-1,1)+1)*Math.PI/4)];
function put(time,duration,fn,pan=0){const i0=Math.round(time*SR),n=Math.round(duration*SR);for(let k=0;k<n&&i0+k<N;k++){const q=k/SR,v=fn(q,k,n),[gl,gr]=panG(typeof pan==="function"?pan(q):pan);L[i0+k]+=v*gl;R[i0+k]+=v*gr;}}
function tone(t,{dur=.2,f=440,amp=.04,pan=0,decay=.12,attack=.006,partials=[[1,1]],bend=null}){put(t,dur,(q)=>{let s=0;const hz=typeof f==="function"?f(q):f;for(const [ratio,g] of partials)s+=Math.sin(TAU*(bend?bend(q,ratio):hz*ratio)*q)*g;const a=attack?Math.pow(Math.sin(Math.PI*.5*clamp(q/attack)),2):1;return amp*s*a*Math.exp(-q/decay)*Math.min(1,(dur-q)/.012);},pan);}
function noise(t,{dur=.18,amp=.025,pan=0,center=1100,band=700,env=null}){let low=0,hp=0,prevLow=0;const hi=Math.min(11000,Math.max(180,center+band*.5)),lo=Math.max(45,center-band*.5),lpA=1-Math.exp(-TAU*hi/SR),hpA=Math.exp(-TAU*lo/SR),rng=rand;put(t,dur,(q,k,n)=>{const x=rng()*2-1;low+=lpA*(x-low);hp=hpA*(hp+low-prevLow);prevLow=low;const shape=env?env(q,k/SR):Math.exp(-q/(dur*.48));return hp*amp*shape*Math.min(1,(n-k)/(SR*.012));},pan);}
function tap(t,p=0,weight=1){tone(t,{dur:.15,f:170,amp:.045*weight,pan:p,decay:.045,attack:.001,partials:[[1,1],[2.4,.2]]});noise(t,{dur:.055,amp:.018*weight,pan:p,center:950,env:q=>Math.exp(-q/.009)});}
function sweep(t,dur,panFrom,panTo,amp=.025){noise(t,{dur,amp,pan:q=>panFrom+(panTo-panFrom)*smooth(q/dur),env:q=>Math.sin(Math.PI*clamp(q/dur))**1.4});}

// Ruang muncul perlahan: dua ketukan kayu lembut, lalu jam.
tone(.62,{dur:.55,f:196,amp:.045,decay:.16,partials:[[1,1],[2.5,.16]]});
noise(.67,{dur:.42,amp:.018,center:420,env:q=>Math.sin(Math.PI*clamp(q/.42))});
tap(.98,-.16,.65);tone(1.32,{dur:.42,f:523.25,amp:.023,decay:.1,partials:[[1,1],[2,.13]]});
// Gerak cepat di balik jendela: desir singkat yang berulang, menyebar kiri ke kanan.
for(let t=1.8;t<18;t+=.72){const p=((Math.floor(t/.72)%2)?-.65:.65);sweep(t,.34,p,-p,.015);}
// Debu dan jarum jam diam memberi ruang hening; tidak ada ambience musik.
for(let i=0;i<18;i++){const t=1.85+i*.235;noise(t,{dur:.035,amp:.0035,pan:-.35+(i%4)*.23,center:1700,env:q=>Math.exp(-q/.009)});}
// Cermin: satu denyut resonan tiap 1.2 detik, tepat mengikuti garis bingkai.
for(let t=7.6;t<=11.2;t+=1.2){tone(t-.12,{dur:.38,f:196,amp:.021,decay:.18,attack:.05,partials:[[1,1],[2,.24],[3,.06]],pan:-.12});tone(t-.055,{dur:.34,f:293.66,amp:.012,decay:.15,attack:.035,partials:[[1,1],[2,.1]],pan:.12});}
// Kartu terangkat berurutan: kertas tipis plus bunyi nada kecil.
for(let i=0;i<6;i++){const t=12.4+i*.2;noise(t,{dur:.2,amp:.012,pan:(i-2.5)*.12,center:1350,env:q=>Math.sin(Math.PI*clamp(q/.2))});tone(t,{dur:.32,f:440+i*32,amp:.014,decay:.11,attack:.01,pan:(i-2.5)*.1,partials:[[1,1],[2,.12]]});}
// Enam kartu melayang ke papan dan berhenti dengan ketukan kertas.
for(let i=0;i<6;i++){const t=14+i*.045,p0=clamp((i-2.5)*.25,-.75,.75);sweep(t,.8,p0,-p0,.027);tap(14.8+i*.045,-p0,.5);}
// Usap papan ke kiri-kanan, lalu modul yang diperbarui berbunyi hangat.
sweep(14.8,1.0,-.7,.7,.035);
noise(14.92,{dur:.45,amp:.018,pan:q=>-.55+1.1*smooth(q/.45),center:2600,env:q=>Math.sin(Math.PI*clamp(q/.45))});
tone(15.02,{dur:1.05,f:392,amp:.045,decay:.34,attack:.004,partials:[[1,1],[2,.28],[3,.08]],pan:.12});
tone(15.08,{dur:.8,f:523.25,amp:.022,decay:.28,attack:.008,partials:[[1,1],[2,.12]],pan:-.12});
// Jam mulai kembali: tiga tick halus, berhenti tepat saat adegan membeku pada detik 18.
for(let t=15.8;t<18;t+=.72){tap(t,0,.34);tone(t+.025,{dur:.18,f:660,amp:.008,decay:.055,attack:.001,partials:[[1,1]]});}
// Kartu akhir: satu aksen naik singkat untuk CTA, tanpa alas musik.
tone(18.2,{dur:.65,f:587.33,amp:.018,decay:.18,attack:.015,partials:[[1,1],[2,.12]],pan:-.08});
tone(18.62,{dur:1.0,f:783.99,amp:.033,decay:.3,attack:.018,partials:[[1,1],[2,.18],[3,.04]],pan:.08});
noise(18.6,{dur:.22,amp:.009,center:1900,env:q=>Math.sin(Math.PI*clamp(q/.22))});

// WAV PCM 32-bit float temporary; ffmpeg applies integrated loudness and true-peak control.
const data=Buffer.alloc(N*8);for(let i=0;i<N;i++){data.writeFloatLE(L[i],i*8);data.writeFloatLE(R[i],i*8+4);}
const head=Buffer.alloc(44);head.write("RIFF",0);head.writeUInt32LE(36+data.length,4);head.write("WAVE",8);head.write("fmt ",12);head.writeUInt32LE(16,16);head.writeUInt16LE(3,20);head.writeUInt16LE(2,22);head.writeUInt32LE(SR,24);head.writeUInt32LE(SR*8,28);head.writeUInt16LE(8,32);head.writeUInt16LE(32,34);head.write("data",36);head.writeUInt32LE(data.length,40);writeFileSync(raw,Buffer.concat([head,data]));
const norm=spawnSync("ffmpeg",["-y","-hide_banner","-loglevel","error","-i",raw,"-af","afade=t=out:st=20.4:d=0.6,loudnorm=I=-18:TP=-1:LRA=7:linear=true","-ar","48000","-ac","2","-c:a","pcm_s16le",wav],{stdio:"inherit"});if(norm.status!==0)throw new Error(`ffmpeg loudness normalization failed (${norm.status})`);unlinkSync(raw);
if(!existsSync(video))throw new Error(`Video sumber belum ada: ${video}`);
const muxed=spawnSync("ffmpeg",["-y","-hide_banner","-loglevel","error","-i",video,"-i",wav,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","aac","-b:a","192k","-ar","48000","-ac","2","-t","21","-movflags","+faststart",mux],{stdio:"inherit"});if(muxed.status!==0)throw new Error(`ffmpeg mux failed (${muxed.status})`);
console.log(`Created ${wav} and ${mux}; video stream copied without re-encoding.`);
