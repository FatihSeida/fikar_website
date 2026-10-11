// Pemeriksaan tambahan untuk seek deterministik dan kartu akhir seri 09–14.
// Dari animasi/: node indikator-09/periksa-seri.mjs indikator-09 [indikator-10 ...]
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const names = process.argv.slice(2);
if (!names.length || names.some(n => !/^indikator-(09|1[0-4])$/.test(n))) throw new Error('Isi nama indikator-09 sampai indikator-14.');
const server = await createServer({ root, configFile:false, css:{postcss:{}}, cacheDir:resolve(root,'node_modules/.vite/periksa-seri-09-14'), optimizeDeps:{entries:names.map(n=>`proyek/${n}/index.html`)}, server:{port:5197,hmr:false} });
const hash = x => createHash('sha256').update(x).digest('hex');
let browser;
try {
  await server.listen();
  browser = await chromium.launch({channel:'chrome',ignoreDefaultArgs:['--headless=old'],args:['--headless=new']});
  for (const name of names) {
    const errors=[];
    const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(`${r.status()} ${r.url()}`);});
    await page.goto(`${server.resolvedUrls.local[0]}proyek/${name}/?rekam=1`,{timeout:90000});
    await page.waitForFunction(()=>window.siap!==undefined,null,{timeout:90000});
    await page.evaluate(()=>window.siap);
    const info=await page.evaluate(()=>({duration:window.DURASI,fps:window.FPS,size:window.UKURAN,kit:window.KIT?.versi,fonts:document.fonts.status}));
    if(info.duration!==21||info.fps!==30||info.size?.lebar!==1080||info.size?.tinggi!==1920||info.fonts!=='loaded')throw new Error(`${name}: kontrak halaman tidak cocok`);
    const state=()=>({canvas:document.querySelector('canvas').toDataURL(),dom:[...document.querySelectorAll('[style]')].filter(el=>{for(let p=el;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.001)return false;}return true;}).map(el=>[el.tagName,el.className,el.textContent,el.style.cssText])});
    const seek=[];
    for(const t of [3,9,15,19.5]){
      await page.evaluate(t=>window.tampilkan(t),t);const a=await page.evaluate(state);
      await page.evaluate(()=>window.tampilkan(20.8));await page.evaluate(t=>window.tampilkan(t),t);const b=await page.evaluate(state);
      const stable=JSON.stringify(a)===JSON.stringify(b);seek.push({t,stable,canvasStable:hash(a.canvas)===hash(b.canvas)});
    }
    await page.evaluate(()=>window.tampilkan(20));const finalA=await page.evaluate(state);
    await page.evaluate(()=>window.tampilkan(20.8));const finalB=await page.evaluate(state);
    const frozen=JSON.stringify(finalA)===JSON.stringify(finalB);
    const cta=await page.evaluate(()=>[...document.querySelectorAll('.kit-ajakan')].map(el=>el.textContent.trim()));
    const visibleText=await page.evaluate(()=>[...document.querySelectorAll('.kit-ket-label,.kit-ajakan,.kit-judul,#isi-kuis,[data-ajakan-kuis]')].filter(el=>{for(let p=el;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.5)return false;}return true;}).map(el=>el.textContent.trim()));
    const cue=JSON.parse(await readFile(resolve(root,'hasil',`${name}-peristiwa.json`),'utf8'));
    const report={name,...info,seek,frozen,cta,visibleText,cues:cue.peristiwa.length,errors};
    await writeFile(resolve(root,'hasil',`${name}-determinisme.json`),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report));
    await page.close();
    if(errors.length||seek.some(s=>!s.stable)||!frozen||!cta.some(s=>s==='ahmadzulfikar.com/kuis')||!visibleText.some(s=>/isi kuis/i.test(s))||!cue.peristiwa.length)throw new Error(`${name}: pemeriksaan tambahan gagal; baca laporan determinisme.`);
  }
} finally {await browser?.close();await server.close();}
