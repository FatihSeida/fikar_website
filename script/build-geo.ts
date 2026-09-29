/**
 * Membangun server/data/geo-id.bin.gz dari DB-IP "IP to City Lite" (CC BY 4.0).
 * Hanya baris country == "ID" yang disimpan; rentang bersebelahan dengan
 * kota+provinsi sama digabung.
 *
 *   npx tsx script/build-geo.ts [YYYY-MM]
 *
 * CSV mentah (~85 MB) di-cache di luar repo: $GEO_CACHE_DIR, atau <tmp>/dbip.
 *
 * Format (little-endian), lalu di-gzip:
 *   "IDG1" | u32 n4 | u32 n6 | u32 locBytes | JSON [[city, region], ...]
 *   | u32 v4Start[n4] | u32 v4End[n4] | u16 v4Loc[n4]
 *   | u32 v6Start[n6*4] | u32 v6End[n6*4] | u16 v6Loc[n6]
 */
import fs from "fs";
import net from "net";
import os from "os";
import path from "path";
import readline from "readline";
import zlib from "zlib";
import { GEO_FILE, GEO_MAGIC, ipv4ToInt, ipv6ToWords } from "../server/geo";

const CACHE_DIR = process.env.GEO_CACHE_DIR || path.join(os.tmpdir(), "dbip");
const OUT = path.join("server", "data", GEO_FILE);

type Range = { start: bigint; end: bigint; loc: number };

function monthStr(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// File bulan ini, atau bulan sebelumnya bila belum terbit.
async function getCsv(): Promise<{ file: string; month: string }> {
  const now = new Date();
  const months = process.argv[2]
    ? [process.argv[2]]
    : [monthStr(now), monthStr(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)))];
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  for (const month of months) {
    const file = path.join(CACHE_DIR, `dbip-city-lite-${month}.csv.gz`);
    if (fs.existsSync(file)) {
      console.log(`using cached ${file}`);
      return { file, month };
    }
    const url = `https://download.db-ip.com/free/dbip-city-lite-${month}.csv.gz`;
    console.log(`downloading ${url}...`);
    const res = await fetch(url);
    if (res.status === 404) {
      console.log(`  not published yet`);
      continue;
    }
    if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
    fs.writeFileSync(`${file}.part`, Buffer.from(await res.arrayBuffer()));
    fs.renameSync(`${file}.part`, file);
    return { file, month };
  }
  throw new Error(`no DB-IP file found for ${months.join(", ")}`);
}

function parseCsvLine(line: string): string[] {
  if (!line.includes('"')) return line.split(",");
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function v6ToBig(ip: string): bigint {
  return ipv6ToWords(ip).reduce((acc, w) => (acc << 32n) | BigInt(w), 0n);
}

function merge(ranges: Range[]): Range[] {
  ranges.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  const out: Range[] = [];
  for (const r of ranges) {
    const prev = out[out.length - 1];
    if (prev && r.start <= prev.end) throw new Error(`overlapping ranges at ${r.start}`);
    if (prev && prev.loc === r.loc && prev.end + 1n === r.start) prev.end = r.end;
    else out.push({ ...r });
  }
  return out;
}

async function main() {
  const { file, month } = await getCsv();

  const locIndex = new Map<string, number>();
  const locs: [string, string][] = [];
  const v4: Range[] = [];
  const v6: Range[] = [];
  let rows = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(file).pipe(zlib.createGunzip()),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (!line.includes(",ID,")) continue;
    const [ipStart, ipEnd, , country, region, city] = parseCsvLine(line);
    if (country !== "ID") continue;
    rows++;

    const key = `${city}\u0000${region}`;
    let loc = locIndex.get(key);
    if (loc === undefined) {
      loc = locs.length;
      locIndex.set(key, loc);
      locs.push([city, region]);
    }

    if (net.isIPv4(ipStart) && net.isIPv4(ipEnd)) {
      v4.push({ start: BigInt(ipv4ToInt(ipStart)), end: BigInt(ipv4ToInt(ipEnd)), loc });
    } else if (net.isIPv6(ipStart) && net.isIPv6(ipEnd)) {
      v6.push({ start: v6ToBig(ipStart), end: v6ToBig(ipEnd), loc });
    } else {
      throw new Error(`unparseable row: ${line}`);
    }
  }
  if (locs.length > 0xffff) throw new Error(`too many locations for u16: ${locs.length}`);

  const m4 = merge(v4);
  const m6 = merge(v6);

  const locJson = Buffer.from(JSON.stringify(locs), "utf8");
  const buf = Buffer.alloc(16 + locJson.length + m4.length * 10 + m6.length * 34);
  buf.write(GEO_MAGIC, 0, "latin1");
  buf.writeUInt32LE(m4.length, 4);
  buf.writeUInt32LE(m6.length, 8);
  buf.writeUInt32LE(locJson.length, 12);
  let off = 16 + locJson.copy(buf, 16);

  const MASK = 0xffffffffn;
  for (const r of m4) off = buf.writeUInt32LE(Number(r.start), off);
  for (const r of m4) off = buf.writeUInt32LE(Number(r.end), off);
  for (const r of m4) off = buf.writeUInt16LE(r.loc, off);
  for (const key of ["start", "end"] as const) {
    for (const r of m6) {
      for (let shift = 96n; shift >= 0n; shift -= 32n) {
        off = buf.writeUInt32LE(Number((r[key] >> shift) & MASK), off);
      }
    }
  }
  for (const r of m6) off = buf.writeUInt16LE(r.loc, off);
  if (off !== buf.length) throw new Error("size mismatch");

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const gz = zlib.gzipSync(buf, { level: 9 });
  fs.writeFileSync(OUT, gz);

  console.log(`DB-IP month: ${month}`);
  console.log(`ID rows: ${rows}, locations: ${locs.length}`);
  console.log(`IPv4 ranges: ${v4.length} -> ${m4.length} merged`);
  console.log(`IPv6 ranges: ${v6.length} -> ${m6.length} merged`);
  console.log(`wrote ${OUT}: ${gz.length} bytes (raw ${buf.length})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
