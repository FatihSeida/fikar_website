import fs from "fs";
import net from "net";
import path from "path";
import zlib from "zlib";

// Kota/provinsi dari IP pengunjung, hanya untuk Indonesia.
// Data: DB-IP "IP to City Lite" (CC BY 4.0), dibangun oleh script/build-geo.ts.
// Atribusi wajib ditampilkan di mana pun hasil geolokasi dipakai.
export const GEO_ATTRIBUTION = "IP Geolocation by DB-IP (https://db-ip.com)";

export const GEO_FILE = "geo-id.bin.gz";
export const GEO_MAGIC = "IDG1";

export type GeoResult = { city: string; region: string };

type GeoData = {
  locs: GeoResult[];
  v4Start: Uint32Array;
  v4End: Uint32Array;
  v4Loc: Uint16Array;
  // IPv6: 4 kata u32 per alamat (paling signifikan dulu).
  v6Start: Uint32Array;
  v6End: Uint32Array;
  v6Loc: Uint16Array;
};

// undefined = belum dimuat, null = gagal dimuat (tetap null selamanya).
let data: GeoData | null | undefined;

export function ipv4ToInt(ip: string): number {
  const p = ip.split(".");
  return ((+p[0] << 24) | (+p[1] << 16) | (+p[2] << 8) | +p[3]) >>> 0;
}

// Input harus sudah lolos net.isIPv6 (tanpa zone id).
export function ipv6ToWords(ip: string): number[] {
  let tail = -1;
  const lastColon = ip.lastIndexOf(":");
  if (ip.includes(".", lastColon)) {
    tail = ipv4ToInt(ip.slice(lastColon + 1));
    ip = ip.slice(0, lastColon + 1) + "0:0";
  }
  let parts: string[];
  const dbl = ip.indexOf("::");
  if (dbl === -1) {
    parts = ip.split(":");
  } else {
    const left = dbl > 0 ? ip.slice(0, dbl).split(":") : [];
    const right = dbl + 2 < ip.length ? ip.slice(dbl + 2).split(":") : [];
    parts = left.concat(Array(8 - left.length - right.length).fill("0"), right);
  }
  const w: number[] = [];
  for (let i = 0; i < 8; i += 2) {
    w.push(((parseInt(parts[i], 16) << 16) | parseInt(parts[i + 1], 16)) >>> 0);
  }
  if (tail !== -1) w[3] = tail;
  return w;
}

function candidatePaths(): string[] {
  const dirs = [
    typeof __dirname !== "undefined" ? __dirname : null, // bundle produksi: dist/
    path.join(process.cwd(), "server", "data"), // dev (tsx dari root repo)
    path.join(process.cwd(), "dist"),
  ];
  return dirs.filter((d): d is string => d !== null).map((d) => path.join(d, GEO_FILE));
}

function decode(buf: Buffer): GeoData {
  if (buf.length < 16 || buf.toString("latin1", 0, 4) !== GEO_MAGIC) {
    throw new Error("bad header");
  }
  const n4 = buf.readUInt32LE(4);
  const n6 = buf.readUInt32LE(8);
  const locBytes = buf.readUInt32LE(12);
  let off = 16;
  if (buf.length !== off + locBytes + n4 * 10 + n6 * 34) throw new Error("bad size");

  const locs = (JSON.parse(buf.toString("utf8", off, off + locBytes)) as [string, string][]).map(
    ([city, region]) => ({ city, region }),
  );
  off += locBytes;

  const u32 = (n: number) => {
    const a = new Uint32Array(n);
    for (let i = 0; i < n; i++, off += 4) a[i] = buf.readUInt32LE(off);
    return a;
  };
  const u16 = (n: number) => {
    const a = new Uint16Array(n);
    for (let i = 0; i < n; i++, off += 2) {
      a[i] = buf.readUInt16LE(off);
      if (a[i] >= locs.length) throw new Error("bad location index");
    }
    return a;
  };

  const v4Start = u32(n4);
  const v4End = u32(n4);
  const v4Loc = u16(n4);
  const v6Start = u32(n6 * 4);
  const v6End = u32(n6 * 4);
  const v6Loc = u16(n6);
  return { locs, v4Start, v4End, v4Loc, v6Start, v6End, v6Loc };
}

function load(): GeoData | null {
  if (data !== undefined) return data;
  data = null;
  const candidates = candidatePaths();
  try {
    const file = candidates.find((p) => fs.existsSync(p));
    if (!file) throw new Error(`${GEO_FILE} not found in ${candidates.join(", ")}`);
    data = decode(zlib.gunzipSync(fs.readFileSync(file)));
  } catch (err) {
    console.warn(`[geo] IP geolocation disabled: ${(err as Error).message}`);
  }
  return data;
}

function findV4(d: GeoData, ip: number): number {
  const s = d.v4Start;
  let lo = 0;
  let hi = s.length - 1;
  let idx = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (s[mid] <= ip) {
      idx = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return idx !== -1 && ip <= d.v4End[idx] ? d.v4Loc[idx] : -1;
}

// Bandingkan alamat 128-bit w dengan entri ke-i di arr: <0, 0, >0.
function cmp6(arr: Uint32Array, i: number, w: number[]): number {
  const o = i * 4;
  for (let k = 0; k < 4; k++) {
    if (arr[o + k] !== w[k]) return arr[o + k] < w[k] ? -1 : 1;
  }
  return 0;
}

function findV6(d: GeoData, w: number[]): number {
  let lo = 0;
  let hi = d.v6Loc.length - 1;
  let idx = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (cmp6(d.v6Start, mid, w) <= 0) {
      idx = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return idx !== -1 && cmp6(d.v6End, idx, w) >= 0 ? d.v6Loc[idx] : -1;
}

export function lookupGeo(ip: string): GeoResult | null {
  if (typeof ip !== "string") return null;
  let s = ip.trim();
  const zone = s.indexOf("%");
  if (zone !== -1) s = s.slice(0, zone);

  const v4 = net.isIPv4(s);
  if (!v4 && !net.isIPv6(s)) return null;
  const d = load();
  if (!d) return null;

  let loc: number;
  if (v4) {
    loc = findV4(d, ipv4ToInt(s));
  } else {
    const w = ipv6ToWords(s);
    // IPv4-mapped (::ffff:a.b.c.d), bentuk yang dikembalikan req.ip Express.
    loc = w[0] === 0 && w[1] === 0 && w[2] === 0xffff ? findV4(d, w[3]) : findV6(d, w);
  }
  if (loc === -1) return null;
  const { city, region } = d.locs[loc];
  return { city, region };
}
