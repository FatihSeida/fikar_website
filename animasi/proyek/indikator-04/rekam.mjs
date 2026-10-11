// Perekam lokal: kontrak yang sama dengan ../../rekam.mjs, memakai headless baru
// agar Playwright 1.48 tetap dapat merekam browser Chromium yang terpasang.
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { once } from 'node:events';

const root = dirname(fileURLToPath(import.meta.url));
const name = basename(root);
const args = process.argv.slice(2);
const smoke = args.includes('--smoke');
const check = args.includes('--periksa');
const i = args.indexOf('--cuplik');
const times = i < 0 ? null : args[i + 1].split(',').map(Number);
const output = resolve(root, '../../hasil');
let browser;
let server;
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');

async function launch() {
  const errors = [];
  for (const channel of ['msedge', 'chrome']) {
    try {
      const result = await chromium.launch({
        channel,
        ignoreDefaultArgs: ['--headless=old'],
        args: ['--headless=new'],
      });
      console.log(`Browser ${channel}: ${result.version()}`);
      return result;
    } catch (error) {
      errors.push(`${channel}: ${error.message}`);
    }
  }
  throw new Error(errors.join('\n'));
}

try {
  browser = await launch();
  if (!smoke) {
    server = await createServer({root, cacheDir:resolve(root, `../../node_modules/.vite/${name}`), configFile:false, css:{postcss:{}}, server:{host:'127.0.0.1',port:5180},logLevel:'warn'});
    await server.listen();
    await mkdir(output, {recursive:true});
    const page = await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
    const errors = [];
    page.on('pageerror', error => {errors.push(error.message); console.error('PAGE ERROR: '+error.message);});
    page.on('console', message => {if (message.type()==='error' && !message.text().startsWith('Failed to load resource')) errors.push(message.text());});
    page.on('response', response => {if(response.status()>=400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(`${server.resolvedUrls.local[0]}?rekam=1`);
    await page.waitForFunction(() => window.siap !== undefined).catch(error=>{throw new Error(errors.join('\n')||error.message);});
    await page.evaluate(() => window.siap);
    const duration = await page.evaluate(() => window.DURASI);
    if (duration !== 21) throw new Error(`Durasi ${duration}, seharusnya 21`);
    if (errors.length) throw new Error(errors.join('\n'));
    if (check) {
      const evidence = {duration, viewport:await page.evaluate(() => [innerWidth,innerHeight]), fonts:await page.evaluate(() => ['700 50px "Noto Serif"','600 40px "DM Sans"','700 38px "JetBrains Mono"'].map(font=>({font,loaded:document.fonts.check(font)})))};
      evidence.frames = [];
      for (const t of [3,9,15,19.5]) {
        await page.evaluate(t => window.tampilkan(t),t);
        const a = await page.screenshot();
        await page.evaluate(() => window.tampilkan(20.8));
        await page.evaluate(t => window.tampilkan(t),t);
        const b = await page.screenshot();
        const stable = hash(a) === hash(b);
        const overlays = await page.evaluate(() => [...document.querySelectorAll('h1,#ajakan,.ket,.sumber,#sumber')].filter(el=>{
          let p=el; while(p){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.01)return false;p=p.parentElement;}return true;
        }).map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent.trim(),rect:[r.x,r.y,r.width,r.height]};}));
        evidence.frames.push({t,stable,overlays});
        if(!stable) throw new Error(`Frame t=${t} berbeda setelah lompatan waktu mundur`);
      }
      await page.evaluate(()=>window.tampilkan(20));
      const finalA=await page.screenshot();
      await page.evaluate(()=>window.tampilkan(20.8));
      evidence.finalFrozen=hash(finalA)===hash(await page.screenshot());
      console.log(JSON.stringify(evidence,null,2));
      if(!evidence.finalFrozen) throw new Error('Keadaan akhir belum membeku');
    } else if (times) {
      for (const t of times) {
        await page.evaluate(t=>window.tampilkan(t),t);
        const path=resolve(output,`${name}-t${t}.png`);
        await page.screenshot({path});
        console.log(path);
      }
    } else {
      const path=resolve(output,`${name}.mp4`);
      const ffmpeg=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',path],{stdio:['pipe','inherit','inherit']});
      const done=once(ffmpeg,'close');
      const count=Math.round(duration*30);
      for(let frame=0;frame<count;frame++){
        await page.evaluate(t=>window.tampilkan(t),frame/30);
        if(!ffmpeg.stdin.write(await page.screenshot({type:'png'})))await once(ffmpeg.stdin,'drain');
        if((frame+1)%30===0)console.log(`frame ${frame+1}/${count}`);
      }
      ffmpeg.stdin.end();
      const [code]=await done;
      if(code!==0)throw new Error(`ffmpeg keluar dengan kode ${code}`);
      console.log(path);
    }
    if(errors.length)throw new Error(errors.join('\n'));
  }
} finally {
  await browser?.close();
  await server?.close();
}
