/**
 * Modul Suara kit: daftar peristiwa → efek suara tersintesis, dimaster, dan digabung ke video.
 *
 *   import { buatSuara } from "../kit/suara/index.mjs";
 *   const laporan = await buatSuara({ peristiwa, durasi: 21, keluaranWav, video, keluaranVideo });
 *
 * Rincian: kit/docs/suara.md.
 */
import { SR, tulisWav } from "./dsp.mjs";
import { PALET } from "./palet.mjs";
import { susunPalet, isiBawaan, saring, tipiskan, campur } from "./susun.mjs";
import { master, TARGET_LUFS, PLAFON_DB } from "./master.mjs";
import { adaFfmpeg, ukurEbur128, durasiVideo, gabungVideo, gambarGelombang, dekodeMono, periksaSinkron } from "./periksa.mjs";

export { PALET, TARGET_LUFS, PLAFON_DB };
/** Semua jenis yang dikenal kit (KONTRAK §3). */
export const JENIS = Object.keys(PALET);

/**
 * @param {object} o
 * @param {Array}  o.peristiwa      daftar peristiwa (KONTRAK §3)
 * @param {number} o.durasi         panjang video, detik; WAV tepat durasi × 48000 sampel
 * @param {string} o.keluaranWav    berkas WAV yang ditulis
 * @param {string} [o.video]        video bisu; bila ada, digabung ke `keluaranVideo`
 * @param {string} [o.keluaranVideo]
 * @param {Function} [o.sesuaikan]  (peristiwa, { durasi, fps }) => peristiwa; boleh async
 * @param {object} [o.bunyi]        bunyi lokal { jenis: buat(s) | { buat, tingkat, ... } }, menambah atau menimpa palet
 * @param {string} [o.gelombang]    berkas PNG bentuk gelombang
 * @param {number} [o.fps=30]
 * @param {boolean} [o.periksaSinkron=true]
 * @returns {Promise<object>} laporan
 */
export async function buatSuara({
  peristiwa, durasi, keluaranWav, video = null, keluaranVideo = null, sesuaikan = null, bunyi = null,
  gelombang = null, fps = 30, periksaSinkron: periksa = true, target = TARGET_LUFS,
} = {}) {
  if (!(Number.isFinite(durasi) && durasi > 0)) throw new Error(`durasi harus angka > 0 (diberi ${durasi})`);
  if (!keluaranWav) throw new Error("keluaranWav wajib diisi");
  if (video && !keluaranVideo) throw new Error("keluaranVideo wajib diisi bila video diberikan");
  if (!Array.isArray(peristiwa)) throw new Error("peristiwa harus array");

  const peringatan = [];
  const palet = susunPalet(bunyi);
  let daftar = isiBawaan(peristiwa);
  if (sesuaikan) {
    const h = await sesuaikan(daftar, { durasi, fps });
    if (Array.isArray(h)) daftar = h;
    else if (h !== undefined) peringatan.push("sesuaikan() tidak mengembalikan array; hasilnya diabaikan");
  }
  const { daftar: sah, takDikenal, bisu } = saring(daftar, palet, durasi, peringatan);
  const { daftar: dipakai, digabung, dipangkas } = tipiskan(sah, palet);

  const bus = campur(dipakai, palet, durasi);
  const m = master(bus.L, bus.R, { target });
  if (m.senyap) peringatan.push("tidak ada bunyi yang terdengar; WAV berisi senyap");
  tulisWav(keluaranWav, m.L, m.R);

  const perJenis = {};
  for (const e of dipakai) perJenis[e.jenis] = (perJenis[e.jenis] || 0) + 1;
  const laporan = {
    wav: keluaranWav, video: null, gelombang: null, durasi, sampel: m.L.length, sampleRate: SR,
    jumlah: { masuk: peristiwa.length, dibunyikan: dipakai.length, digabung, dipangkas, dibisukan: bisu, takDikenal: Object.values(takDikenal).reduce((a, b) => a + b, 0) },
    perJenis, takDikenal,
    lufs: m.lufs, lufsAwal: m.lufsAwal, penguatanDb: m.penguatanDb,
    puncakSejatiDb: m.puncakSejatiDb, puncakSampelDb: m.puncakSampelDb, pembatas: m.pembatas,
    ffmpeg: null, ffmpegVideo: null, sinkron: [], sumberSinkron: null, peringatan,
  };

  if (!adaFfmpeg()) {
    if (video) throw new Error("ffmpeg tidak ditemukan di PATH; video tidak bisa digabung");
    peringatan.push("ffmpeg tidak ditemukan; pengukuran ebur128, gelombang, dan periksa sinkron dilewati");
    return laporan;
  }
  laporan.ffmpeg = ukurEbur128(keluaranWav);
  if (laporan.ffmpeg.puncakSejatiDb > -1) peringatan.push(`puncak sejati WAV ${laporan.ffmpeg.puncakSejatiDb} dBTP melebihi −1 dBTP`);
  if (Math.abs(laporan.ffmpeg.lufs - target) > 0.5 && !m.senyap && durasi >= 0.4) peringatan.push(`kenyaringan WAV ${laporan.ffmpeg.lufs} LUFS jauh dari target ${target}`);
  if (m.pembatas.tekananMaksDb > 4) {
    const w = m.pembatas.waktu, dekat = dipakai.filter((e) => e.t <= w + 0.002).at(-1);
    peringatan.push(`pembatas menekan ${m.pembatas.tekananMaksDb.toFixed(1)} dB di ${w.toFixed(2)} s${dekat ? ` (${dekat.jenis} di ${dekat.t.toFixed(2)} s)` : ""}: bunyi itu jauh lebih menonjol dari sisanya; turunkan kuat-nya bila terdengar tertekan`);
  }

  if (video) {
    const dv = durasiVideo(video);
    if (Number.isFinite(dv) && Math.abs(dv - durasi) > 1 / fps + 1e-3) peringatan.push(`durasi video ${dv.toFixed(3)} s berbeda dari durasi suara ${durasi} s`);
    gabungVideo(video, keluaranWav, keluaranVideo);
    laporan.video = keluaranVideo;
    laporan.ffmpegVideo = ukurEbur128(keluaranVideo);
  }
  if (gelombang) { gambarGelombang(keluaranWav, gelombang); laporan.gelombang = gelombang; }

  if (periksa && !m.senyap) {
    laporan.sumberSinkron = laporan.video || keluaranWav;
    const mono = dekodeMono(laporan.sumberSinkron);
    laporan.sinkron = periksaSinkron(mono, dipakai, palet, { fps });
    if (!laporan.sinkron.length) peringatan.push("tidak ada peristiwa impulsif yang terpisah untuk periksa sinkron");
    for (const s of laporan.sinkron) if (!s.lulus) peringatan.push(`sinkron ${s.jenis} di ${s.t.toFixed(3)} s: ${s.selisihMs === null ? "awal bunyi tidak ditemukan" : `selisih ${s.selisihMs.toFixed(0)} ms`}`);
  }
  return laporan;
}

/** Laporan singkat untuk terminal. */
export function cetakLaporan(l, tulis = console.log) {
  const f = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d) : String(v));
  const j = l.jumlah;
  tulis(`  peristiwa   ${j.masuk} masuk → ${j.dibunyikan} dibunyikan (${j.digabung} digabung, ${j.dipangkas} dipangkas, ${j.dibisukan} kuat 0, ${j.takDikenal} jenis tak dikenal)`);
  tulis(`  WAV         ${l.wav}  ${(l.sampel / l.sampleRate).toFixed(3)} s, 48 kHz stereo 16-bit`);
  tulis(`  kenyaringan ${f(l.lufs, 2)} LUFS, puncak sejati ${f(l.puncakSejatiDb, 2)} dBTP (internal); penguatan ${l.penguatanDb >= 0 ? "+" : ""}${f(l.penguatanDb)} dB, pembatas maks ${f(l.pembatas.tekananMaksDb)} dB${l.pembatas.tekananMaksDb > 0.05 ? ` (di ${f(l.pembatas.waktu, 2)} s)` : ""}, aktif pada ${f(l.pembatas.persen, 2)}% sampel`);
  if (l.ffmpeg) tulis(`  ebur128     WAV ${f(l.ffmpeg.lufs)} LUFS, ${f(l.ffmpeg.puncakSejatiDb)} dBTP${l.ffmpegVideo ? `; MP4 (AAC) ${f(l.ffmpegVideo.lufs)} LUFS, ${f(l.ffmpegVideo.puncakSejatiDb)} dBTP` : ""}`);
  if (l.video) tulis(`  video       ${l.video}`);
  if (l.gelombang) tulis(`  gelombang   ${l.gelombang}`);
  if (l.sinkron.length) {
    tulis(`  sinkron (${l.sumberSinkron === l.video ? "audio MP4 didekode" : "WAV didekode"}):`);
    tulis(`    ${"jenis".padEnd(13)} ${"sumber".padEnd(12)} ${"peristiwa".padStart(9)} ${"frame".padStart(7)}   ${"bunyi".padStart(8)}   selisih`);
    for (const s of l.sinkron) {
      tulis(`    ${s.jenis.padEnd(13)} ${String(s.sumber).slice(0, 12).padEnd(12)} ${s.t.toFixed(3).padStart(8)}s ${s.frame.toFixed(1).padStart(7)}   ${s.terukur === null ? "       -" : s.terukur.toFixed(3).padStart(7) + "s"}   ${s.selisihMs === null ? "tidak ketemu" : `${s.selisihMs >= 0 ? "+" : ""}${s.selisihMs.toFixed(1)} ms`} ${s.lulus ? "ok" : "GAGAL"}`);
    }
  }
  if (l.peringatan.length) { tulis("  peringatan:"); for (const p of l.peringatan) tulis(`    - ${p}`); }
}
