/**
 * SFX perpustakaan Indikator 04. Sintesis lokal, berbenih, tanpa sampel/voiceover/musik.
 * Pola nada aditif dan derau tersaring diadaptasi dari indikator-02/suara.mjs.
 * Semua cue mengikuti adegan.js; tidak mengimpor berkas animasi lain.
 * Jalankan dari animasi/: node indikator-04/suara.mjs
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FOLDER=dirname(fileURLToPath(import.meta.url));
const HASIL=resolve(FOLDER,'..','..','hasil'),NAMA='indikator-04';
const DURASI=21,SR=48000,N=DURASI*SR,PI2=2*Math.PI;
const TARGET=-18,TP=-2; // AAC has 1 dB of additional true-peak headroom.
const L=new Float64Array(N),R=new Float64Array(N);
const klem=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const halus=x=>{x=klem(x);return x*x*(3-2*x);};
const sinus=x=>Math.sin(Math.PI/2*klem(x))**2;
const fade=(x,a,b)=>1-halus((x-a)/(b-a));
function acak(seed){return()=>{let z=seed+=0x6D2B79F5;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return((z^z>>>14)>>>0)/4294967296;};}
function campurSample(i,v,p){if(i<0||i>=N)return;const a=(klem(p,-.85,.85)+1)*Math.PI/4;L[i]+=v*Math.cos(a);R[i]+=v*Math.sin(a);}

function nada(t,{f=220,dur=.3,gain=.05,pan=0,attack=.004,release=.04,partials=[[1,1,.12]],env=()=>1}){
  const start=Math.round(t*SR),len=Math.round(dur*SR),phase=new Float64Array(partials.length);
  for(let k=0;k<len;k++){
    const tau=k/SR,fd=typeof f==='function'?f(tau):f;
    let v=0;for(let j=0;j<partials.length;j++){const [ratio,amp,decay]=partials[j];phase[j]+=PI2*fd*ratio/SR;if(fd*ratio<6500)v+=amp*Math.sin(phase[j])*Math.exp(-tau/decay);}
    v*=gain*sinus(tau/attack)*klem((len-k)/(release*SR))*env(tau);
    campurSample(start+k,v,typeof pan==='function'?pan(tau):pan);
  }
}
let noiseSeed=404000;
function derau(t,{dur=.2,fc=1200,q=.8,gain=.06,pan=0,lp=false,env=x=>sinus(x/.008)*Math.exp(-x/.045)}){
  const rng=acak(noiseSeed++),start=Math.round(t*SR),len=Math.round(dur*SR);let ic1=0,ic2=0;
  for(let k=0;k<len;k++){
    const tau=k/SR,x=rng()*2-1,f=klem(typeof fc==='function'?fc(tau):fc,50,6500);
    const g=Math.tan(Math.PI*f/SR),a1=1/(1+g*(g+1/q)),a2=g*a1,a3=g*a2;
    const v3=x-ic2,v1=a1*ic1+a2*v3,v2=ic2+a2*ic1+a3*v3;ic1=2*v1-ic1;ic2=2*v2-ic2;
    const v=(lp?v2:v1)*gain*env(tau)*klem((len-k)/(.01*SR));
    campurSample(start+k,v,typeof pan==='function'?pan(tau):pan);
  }
}
function ketuk(t,pan=0,gain=.07,f=230){
  nada(t,{f,dur:.26,gain,pan,attack:.003,partials:[[1,1,.055],[2.68,.24,.022],[4.31,.07,.013]]});
  derau(t,{dur:.065,fc:750,gain:gain*.7,pan,lp:true});
}
function kertas(t,pan=0,gain=.085,dur=.17){
  derau(t,{dur,fc:x=>1700+700*Math.sin(Math.PI*x/dur),q:1.1,gain,pan,env:x=>sinus(x/.012)*fade(x,dur*.35,dur)*(.75+.25*Math.sin(PI2*39*x))});
  derau(t+.013,{dur:.085,fc:850,q:.8,gain:gain*.65,pan,lp:true});
}
function chime(t,{f=660,dur=1.4,gain=.06,pan=0}={}){
  nada(t,{f,dur,gain,pan,attack:.008,release:.25,partials:[[1,1,.58],[2.01,.19,.3],[2.76,.11,.24],[4.07,.035,.13]]});
}

// Explicit cue sheet mirrors the event starts in the visual source.
const cues=[
  {t:0,jenis:'udara-grid',dur:.6,pan:0},
  {t:.6,jenis:'lantai-ketuk',dur:.3,pan:0},
  {t:.72,jenis:'rak-kayu',dur:.3,pan:-.47},
  {t:.84,jenis:'rak-kayu',dur:.3,pan:.39},
  {t:.96,jenis:'meja-ketuk',dur:.25,pan:0},
  ...Array.from({length:5},(_,i)=>({t:1+i*.02,jenis:'kursi-ketuk',dur:.16,i,pan:Math.cos(-Math.PI/2+i*PI2/5)*.32})),
  ...Array.from({length:3},(_,i)=>({t:1.6+i*.25,jenis:'kutipan-kosong',dur:.29,i,pan:[0,-.27,.3][i]})),
  {t:3.6,jenis:'debu-rak',dur:2.3,pan:-.4},
  ...Array.from({length:3},(_,i)=>({t:4.3+i*.45,jenis:'kutipan-pudar',dur:.4,i,pan:[0,-.27,.3][i]})),
  ...Array.from({length:4},(_,i)=>({t:7+i*1.2,jenis:'denyut-cermin',dur:1.2,i,pan:-.35})),
  {t:12.4,jenis:'buku-melayang',dur:1,pan:-.4},
  {t:13.15,jenis:'buku-terbuka',dur:.25,pan:0},
  {t:13.4,jenis:'aliran-zamrud',dur:1,pan:0},
  ...Array.from({length:5},(_,i)=>({t:14.4+i*.12,jenis:'paragraf-kertas',dur:.2,i,pan:Math.cos(-Math.PI/2+i*PI2/5)*.32})),
  {t:15.6,jenis:'hasil-emas',dur:1.8,pan:0},
  {t:15.6,jenis:'lentera-menyala',dur:.8,pan:0},
  {t:18,jenis:'adegan-menetap',dur:.2,pan:0},
  {t:18.2,jenis:'kartu-akhir',dur:1.3,pan:0},
  {t:18.6,jenis:'ajakan-klik',dur:1.45,pan:.12},
].sort((a,b)=>a.t-b.t);

for(const c of cues){
  switch(c.jenis){
    case 'udara-grid':derau(c.t,{dur:c.dur,fc:x=>220+500*x/c.dur,gain:.035,lp:true,env:x=>Math.sin(Math.PI*klem(x/c.dur))**2});break;
    case 'lantai-ketuk':ketuk(c.t,0,.09,138);break;
    case 'rak-kayu':ketuk(c.t,c.pan,.068,180);break;
    case 'meja-ketuk':ketuk(c.t,0,.055,215);break;
    case 'kursi-ketuk':ketuk(c.t,c.pan,.012,280+c.i*11);break;
    case 'kutipan-kosong':
      derau(c.t,{dur:c.dur,fc:650,gain:.035,lp:true,pan:c.pan,env:x=>Math.sin(Math.PI*klem(x/c.dur))**1.5});
      nada(c.t,{f:x=>350-110*x/c.dur,dur:c.dur,gain:.022,pan:c.pan,attack:.018,release:.08,partials:[[1,1,.1]]});break;
    case 'debu-rak':
      derau(c.t,{dur:c.dur,fc:x=>1500-500*x/c.dur,gain:.022,pan:c.pan,env:x=>sinus(x/.2)*fade(x,1.5,c.dur)*(.6+.4*Math.sin(PI2*4.7*x)**2)});break;
    case 'kutipan-pudar':
      derau(c.t,{dur:c.dur,fc:700,gain:.012,pan:c.pan,lp:true,env:x=>Math.sin(Math.PI*klem(x/c.dur))**2});break;
    case 'denyut-cermin':{
      const e=x=>Math.sin(Math.PI*klem(x/c.dur))**2;
      nada(c.t,{f:196,dur:c.dur,gain:.033,pan:c.pan,attack:.02,release:.02,partials:[[1,1,99],[2,.14,99]],env:e});
      derau(c.t,{dur:c.dur,fc:520,gain:.011,pan:c.pan,lp:true,env:e});break;
    }
    case 'buku-melayang':
      ketuk(c.t,-.4,.045,170);kertas(c.t,-.4,.06,.22);
      derau(c.t,{dur:c.dur,fc:x=>600+1400*Math.sin(Math.PI*x/c.dur),gain:.12,pan:x=>-.4+.4*halus(x/c.dur),env:x=>Math.sin(Math.PI*klem(x/c.dur))**1.4*(.8+.2*Math.sin(PI2*24*x))});break;
    case 'buku-terbuka':
      kertas(c.t,-.06,.085,.2);kertas(c.t+.045,.06,.052,.18);ketuk(c.t+.16,0,.045,210);break;
    case 'aliran-zamrud':
      derau(c.t,{dur:c.dur,fc:x=>750+900*x/c.dur,gain:.033,pan:x=>.35*Math.sin(PI2*x),env:x=>sinus(x/.15)*fade(x,.5,c.dur)});
      nada(c.t,{f:x=>300+90*halus(x/c.dur),dur:c.dur,gain:.018,attack:.035,release:.2,partials:[[1,1,1],[2,.12,.4]],env:x=>sinus(x/.2)*fade(x,.4,c.dur)});break;
    case 'paragraf-kertas':kertas(c.t,c.pan,.07,.17);ketuk(c.t+.055,c.pan,.024,270+c.i*12);break;
    case 'hasil-emas':
      chime(c.t,{f:659.25,dur:1.8,gain:.065,pan:-.1});chime(c.t+.025,{f:987.77,dur:1.4,gain:.027,pan:.1});
      derau(c.t,{dur:.6,fc:2300,gain:.018,env:x=>sinus(x/.04)*fade(x,.1,.6)});break;
    case 'lentera-menyala':
      ketuk(c.t,0,.026,450);nada(c.t,{f:330,dur:.8,gain:.02,attack:.12,release:.25,partials:[[1,1,.6]],env:x=>fade(x,.25,.8)});break;
    case 'adegan-menetap':ketuk(c.t,0,.021,180);break;
    case 'kartu-akhir':chime(c.t,{f:523.25,dur:1.3,gain:.037});break;
    case 'ajakan-klik':ketuk(c.t,.12,.035,400);chime(c.t,{f:783.99,dur:1.45,gain:.03,pan:.12});break;
    default:throw new Error(`Cue belum ditangani: ${c.jenis}`);
  }
}

// Tiny, quiet early reflections give paper and wood room, without a continuous bed.
for(const [delay,gain] of [[.023,.085],[.041,.05]]){
  const n=Math.round(delay*SR);
  for(let i=N-1;i>=n;i--){L[i]+=R[i-n]*gain;R[i]+=L[i-n]*gain;}
}
// End fade starts after all discrete cues; 30 ms safety fade also protects the boundaries.
for(let i=0;i<N;i++){const e=sinus(i/(.004*SR))*fade(i/SR,20.05,20.9)*klem((N-1-i)/(.03*SR));L[i]*=e;R[i]*=e;}

mkdirSync(HASIL,{recursive:true});
const video=resolve(HASIL,`${NAMA}.mp4`),wav=resolve(HASIL,`${NAMA}.wav`),out=resolve(HASIL,`${NAMA}-suara.mp4`);
if(!existsSync(video))throw new Error(`Video asli belum tersedia: ${video}`);
const raw=resolve(HASIL,`${NAMA}-sintesis.wav`);
const pcm=Buffer.alloc(N*8);let samplePeak=0;
for(let i=0;i<N;i++){pcm.writeFloatLE(L[i],i*8);pcm.writeFloatLE(R[i],i*8+4);samplePeak=Math.max(samplePeak,Math.abs(L[i]),Math.abs(R[i]));}
const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVE',8);header.write('fmt ',12);header.writeUInt32LE(16,16);header.writeUInt16LE(3,20);header.writeUInt16LE(2,22);header.writeUInt32LE(SR,24);header.writeUInt32LE(SR*8,28);header.writeUInt16LE(8,32);header.writeUInt16LE(32,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);writeFileSync(raw,Buffer.concat([header,pcm]));

function run(bin,args){const r=spawnSync(bin,args,{encoding:'utf8',maxBuffer:64*1024*1024});if(r.status!==0)throw new Error(`${bin} gagal (${r.status}): ${r.stderr}`);return r;}
function loudness(path){const r=run('ffmpeg',['-hide_banner','-nostats','-i',path,'-map','0:a:0','-af',`loudnorm=I=${TARGET}:TP=${TP}:LRA=11:print_format=json`,'-f','null','-']);const matches=[...r.stderr.matchAll(/\{\s*"input_i"[\s\S]*?\}/g)];if(!matches.length)throw new Error('Pengukuran loudness tidak ditemukan');return JSON.parse(matches.at(-1)[0]);}
const measured=loudness(raw);
const normal=`highpass=f=45,lowpass=f=6500,loudnorm=I=${TARGET}:TP=${TP}:LRA=11:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true:print_format=json`;
run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',raw,'-af',normal,'-ar',String(SR),'-ac','2','-t',String(DURASI),'-c:a','pcm_s16le',wav]);
run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',video,'-i',wav,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar',String(SR),'-ac','2','-t',String(DURASI),'-movflags','+faststart',out]);
run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',wav,'-filter_complex','showwavespic=s=2100x500:split_channels=1:colors=0xC9A85C|0x2FB37A:scale=sqrt','-frames:v','1',resolve(HASIL,`${NAMA}-gelombang.png`)]);
const wavMeter=loudness(wav),aacMeter=loudness(out);
const metadata=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',out]).stdout);
const videoHash=path=>run('ffmpeg',['-hide_banner','-loglevel','error','-i',path,'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-']).stdout.trim();
const originalHash=videoHash(video),outputHash=videoHash(out);
const report={name:NAMA,duration:DURASI,sampleRate:SR,channels:2,targetLUFS:TARGET,maxTruePeakDBTP:-1,cues,wavLoudness:wavMeter,aacLoudness:aacMeter,videoStreamIdentical:originalHash===outputHash,videoHash:originalHash,metadata};
writeFileSync(resolve(HASIL,`${NAMA}-suara-cue.json`),JSON.stringify(report,null,2)+'\n');
unlinkSync(raw);
if(originalHash!==outputHash)throw new Error('Stream video berubah saat mux');
if(Number(aacMeter.input_tp)>-1)throw new Error(`True peak AAC terlalu tinggi: ${aacMeter.input_tp} dBTP`);
if(Math.abs(Number(aacMeter.input_i)-TARGET)>1)throw new Error(`Loudness AAC di luar toleransi: ${aacMeter.input_i} LUFS`);
console.log(`${cues.length} cue deterministik; raw peak ${(20*Math.log10(samplePeak)).toFixed(2)} dBFS`);
console.log(`WAV ${wavMeter.input_i} LUFS / ${wavMeter.input_tp} dBTP`);
console.log(`AAC ${aacMeter.input_i} LUFS / ${aacMeter.input_tp} dBTP; stream video identik: true`);
console.log(wav);console.log(out);
