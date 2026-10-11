import './browser.mjs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';

const server = await createServer({ root: process.cwd(), server: { port: 5193, strictPort: false }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${server.resolvedUrls.local[0]}proyek/indikator-13/?rekam=1`);
  await page.evaluate(() => window.siap);
  const audit = await page.evaluate(async () => {
    const { videoAktif } = await import('/kit/index.js');
    const v = videoAktif('audit indikator 13');
    const benda = v.scene.children.filter(o => /^(ruang acara|kursi |hadir |absen |peserta baru |kartu umpan |balon alasan )/.test(o.userData.nama ?? ''));
    const state = (t) => {
      v.hitung(t);
      const data = [];
      benda.forEach(root => root.traverse(o => {
        const m = o.material;
        data.push([o.visible, ...o.position.toArray(), ...o.quaternion.toArray(), ...o.scale.toArray(),
          m?.opacity, m?.emissiveIntensity, ...(m?.color?.toArray() ?? []), ...(m?.emissive?.toArray() ?? [])]);
      }));
      return JSON.stringify(data);
    };
    const deterministic = [3, 9, 15, 16.6, 19.5].map(t => {
      const a = state(t); state(20.8); state(0.1); return { t, sama: a === state(t) };
    });
    const frozen = state(18) === state(20.9);
    const zona = [];
    for (let f = 0; f <= 630; f++) {
      const t = f / 30, z = window.KIT.periksaZona(t);
      if (z.length) zona.push({ t, z });
    }
    const I = window.INDIKATOR13;
    return {
      durasi: window.DURASI, fps: window.FPS, ukuran: window.UKURAN, kit: window.KIT.versi,
      jumlahKursi: I.jumlahKursi, hadirAwal: I.jumlahHadirAwal, absen: I.jumlahAbsen,
      hasil: I.jumlahHasil, pesertaBaru: I.jumlahPesertaBaru,
      terisi3: I.terisiPada(3), terisi17_6: I.terisiPada(17.6),
      deterministic, frozen, zona, peristiwa: window.KIT.peristiwa().length,
    };
  });
  audit.errors = errors;
  await writeFile('hasil/indikator-13-audit.json', JSON.stringify(audit, null, 2));
  console.log(JSON.stringify(audit, null, 2));
  if (errors.length || !audit.frozen || audit.zona.length || audit.deterministic.some(d => !d.sama) || audit.terisi17_6 !== 12) process.exitCode = 1;
} finally {
  await browser.close();
  await server.close();
}
