import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import './browser.mjs';

const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 5194 } });
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://127.0.0.1:5194/proyek/indikator-12/?rekam=1');
  await page.evaluate(() => window.siap);
  const sha = bytes => createHash('sha256').update(bytes).digest('hex');
  const snap = async t => {
    await page.evaluate(t => window.tampilkan(t), t);
    return sha(await page.screenshot());
  };
  const h9 = await snap(9);
  await snap(19.5);
  await snap(3);
  const h9b = await snap(9);
  const contract = await page.evaluate(async () => {
    const { videoAktif } = await import('/kit/index.js');
    const v = videoAktif();
    const objects = t => {
      window.tampilkan(t);
      const out = [];
      v.scene.traverse(o => {
        if (/^(panggung|pita|kue|stan |penonton |petak kosong )/.test(o.userData.nama ?? '')) {
          out.push({ nama: o.userData.nama, posisi: o.position.toArray(), skala: o.scale.toArray(), rotasi: o.rotation.toArray(), visible: o.visible });
        }
      });
      return JSON.stringify(out);
    };
    const freeze = objects(18) === objects(21);
    const title = document.querySelector('.kepala-utama .kit-judul');
    const style = getComputedStyle(title);
    let violations = 0;
    for (let t = 0; t <= 21; t += 0.25) violations += window.KIT.periksaZona(t).length;
    return { durasi: window.DURASI, fps: window.FPS, ukuran: window.UKURAN, versi: window.KIT.versi,
      judulPx: style.fontSize, barisJudul: Math.round(title.offsetHeight / parseFloat(style.lineHeight)),
      freeze18: freeze, zonaSampel025: violations, peristiwa: window.KIT.peristiwa().length };
  });
  const result = { ...contract, deterministik: h9 === h9b, hashT9: h9, errors };
  console.log(JSON.stringify(result, null, 2));
  await writeFile('hasil/indikator-12-qa-lokal.json', JSON.stringify(result, null, 2));
  if (!result.freeze18 || !result.deterministik || result.zonaSampel025 || errors.length) process.exitCode = 1;
} finally {
  await browser.close();
  await server.close();
}
