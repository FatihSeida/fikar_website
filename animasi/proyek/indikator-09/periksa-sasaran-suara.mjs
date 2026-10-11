import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { dekodeMono, periksaSinkron } from '../../kit/suara/periksa.mjs';
import { susunPalet } from '../../kit/suara/susun.mjs';
import { sesuaikan } from './suara.js';
const {peristiwa}=JSON.parse(await readFile(new URL('../../hasil/indikator-09-peristiwa.json',import.meta.url),'utf8'));
const sasaran=sesuaikan(peristiwa).filter(p=>(p.jenis==='klik-emas'&&p.sumber==='tema kajian 1')||(p.jenis==='kertas'&&p.sumber==='pemateri'));
const laporan=periksaSinkron(dekodeMono(fileURLToPath(new URL('../../hasil/indikator-09-suara.mp4',import.meta.url))),sasaran,susunPalet(),{jumlah:2});
await writeFile(new URL('./laporan-sasaran-suara.json',import.meta.url),JSON.stringify(laporan,null,2));
console.log(JSON.stringify(laporan,null,2));

