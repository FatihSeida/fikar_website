import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SANS, SERIF, tekstur } from "@/components/bangun/dasar";
import type { PropsAdegan3D } from "../../kontrak";
import { AlasCahaya, Cahaya, Kotak, Label, Silinder, WARNA, geo, lambert, pegas, rata, ruas, tepi, useBahanSendiri, useHurufSiap, useKamera, useKendali, type V3 } from "./bersama3d";

/**
 * Bab 4 · Identitas dokumen.
 * SK, sertifikat, dan surat tetap tergeletak di meja seperti biasa. Sebuah cap
 * mendatangi ketiganya satu per satu dan meninggalkan tanda identitas emas,
 * lalu benang cahaya menyambungkan ketiga tanda itu.
 */

type Jenis = "sk" | "sertifikat" | "surat";
const DOKUMEN: { jenis: Jenis; nama: string; x: number; z: number; w: number; h: number; putar: number }[] = [
  { jenis: "sk", nama: "SK", x: -2.25, z: 0.05, w: 1.35, h: 1.8, putar: 0.09 },
  { jenis: "sertifikat", nama: "Sertifikat", x: 0, z: 0.15, w: 2.0, h: 1.42, putar: -0.03 },
  { jenis: "surat", nama: "Surat", x: 2.25, z: 0, w: 1.35, h: 1.8, putar: -0.08 },
];

/** Letak tanda identitas: sudut kanan bawah setiap dokumen (dekat pembaca). */
const TANDA: THREE.Vector3[] = DOKUMEN.map((d) => new THREE.Vector3(d.w / 2 - 0.3, 0.014, d.h / 2 - 0.3).applyAxisAngle(new THREE.Vector3(0, 1, 0), d.putar).add(new THREE.Vector3(d.x, 0, d.z)));

const JEDA_CAP = 0.16;
const awalCap = (i: number) => 0.16 + i * JEDA_CAP;

function teksturDokumen(jenis: Jenis, w: number, h: number) {
  const lebar = 512;
  const tinggi = Math.round((lebar * h) / w);
  return tekstur(`dok-evidence|${jenis}|${lebar}x${tinggi}`, lebar, tinggi, (ctx, W, H) => {
    ctx.fillStyle = "#F6F2E4";
    ctx.fillRect(0, 0, W, H);
    const garis = (x: number, y: number, panjang: number) => {
      ctx.fillStyle = "rgba(11,42,30,0.2)";
      ctx.fillRect(x, y, panjang, 9);
    };
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (jenis === "sertifikat") {
      ctx.strokeStyle = "#B08D4F";
      ctx.lineWidth = 10;
      ctx.strokeRect(22, 22, W - 44, H - 44);
      ctx.lineWidth = 3;
      ctx.strokeRect(42, 42, W - 84, H - 84);
      ctx.fillStyle = "#0B2A1E";
      ctx.font = `600 50px ${SERIF}`;
      ctx.fillText("SERTIFIKAT", W / 2, H * 0.3);
      ctx.font = `500 24px ${SANS}`;
      ctx.fillStyle = "#0E8A4F";
      ctx.fillText("LATIHAN KADER 1", W / 2, H * 0.43);
      garis(W * 0.25, H * 0.56, W * 0.5);
      garis(W * 0.14, H * 0.8, W * 0.22);
      garis(W * 0.64, H * 0.8, W * 0.22);
      return;
    }
    if (jenis === "sk") {
      ctx.fillStyle = "#0B2A1E";
      ctx.font = `600 34px ${SANS}`;
      ctx.fillText("SURAT KEPUTUSAN", W / 2, 70);
      ctx.fillStyle = "#0E8A4F";
      ctx.fillRect(W * 0.12, 100, W * 0.76, 4);
      for (let i = 0; i < 9; i++) garis(W * 0.12, 140 + i * 42, i % 3 === 2 ? W * 0.45 : W * 0.76);
      ctx.strokeStyle = "rgba(14,138,79,0.8)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(W * 0.28, H * 0.84, 46, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.textAlign = "left";
      ctx.fillStyle = "#0B2A1E";
      ctx.font = `600 34px ${SANS}`;
      ctx.fillText("SURAT", W * 0.12, 70);
      ctx.fillStyle = "#DCC38A";
      ctx.fillRect(W * 0.12, 100, W * 0.76, 4);
      for (let i = 0; i < 10; i++) garis(W * 0.12, 140 + i * 40, i === 4 || i === 9 ? W * 0.4 : W * 0.76);
    }
    ctx.strokeStyle = "rgba(11,42,30,0.7)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W * 0.58, H * 0.86);
    ctx.bezierCurveTo(W * 0.64, H * 0.8, W * 0.68, H * 0.92, W * 0.74, H * 0.85);
    ctx.bezierCurveTo(W * 0.78, H * 0.81, W * 0.8, H * 0.88, W * 0.86, H * 0.84);
    ctx.stroke();
  });
}

/** Tanda identitas: kotak emas berpola kode, cara dokumen memperkenalkan dirinya. */
function teksturTanda() {
  return tekstur("tanda-identitas", 256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#DCC38A";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0B2A1E";
    const pola = [
      "1110111", "1010101", "1110111", "0001000", "1011011", "0110110", "1101011",
    ];
    const sel = 18;
    const awal = (w - sel * 7) / 2;
    pola.forEach((baris, y) => baris.split("").forEach((c, x) => {
      if (c === "1") ctx.fillRect(awal + x * sel + 1, awal + y * sel + 1, sel - 2, sel - 2);
    }));
  });
}

function Dokumen({ d }: { d: (typeof DOKUMEN)[number] }) {
  const peta = teksturDokumen(d.jenis, d.w, d.h);
  const bahan = useBahanSendiri(() => new THREE.MeshLambertMaterial({ map: peta, toneMapped: false }), [peta]);
  return (
    <group position={[d.x, 0.006, d.z]} rotation={[0, d.putar, 0]}>
      <Kotak p={[0, -0.012, 0]} s={[d.w, 0.02, d.h]} bahan={lambert("#E8E1CC")} garis={tepi(WARNA.gelap, 0.35)} />
      <mesh geometry={geo.bidang} material={bahan} rotation={[-Math.PI / 2, 0, 0]} scale={[d.w, d.h, 1]} />
    </group>
  );
}

const geoCincin = new THREE.RingGeometry(0.42, 0.5, 40);

const BENANG = [
  { a: 0, b: 1, tinggi: 0.8, mulai: 0.66 },
  { a: 1, b: 2, tinggi: 0.8, mulai: 0.72 },
  { a: 0, b: 2, tinggi: 1.45, mulai: 0.78 },
].map((b) => {
  // Benang melengkung antar dua tanda, digambar bertahap lewat drawRange.
  const dari = TANDA[b.a].clone().setY(TANDA[b.a].y + 0.02);
  const ke = TANDA[b.b].clone().setY(TANDA[b.b].y + 0.02);
  const tengah = dari.clone().lerp(ke, 0.5);
  tengah.y += b.tinggi;
  const kurva = new THREE.QuadraticBezierCurve3(dari, tengah, ke);
  return { ...b, kurva, geometri: new THREE.TubeGeometry(kurva, 64, 0.02, 6, false) };
});

function Benang({ b, k }: { b: (typeof BENANG)[number]; k: ReturnType<typeof useKendali> }) {
  const { kurva, geometri } = b;
  const manik = useRef<THREE.Mesh>(null);
  const total = geometri.index ? geometri.index.count : 0;
  useFrame(() => {
    const { p, t, tenang } = k.current;
    const u = ruas(p, b.mulai, b.mulai + 0.1);
    geometri.setDrawRange(0, Math.floor((total * u) / 6) * 6);
    const m = manik.current;
    if (m) {
      const hidup = ruas(p, 0.88, 0.94);
      m.visible = hidup > 0;
      m.scale.setScalar(0.11 * hidup);
      const posisi = tenang ? 0.5 : (t * 0.35 + b.a * 0.3) % 1;
      kurva.getPoint(posisi, m.position);
    }
  });
  return (
    <>
      <mesh geometry={geometri} material={rata(WARNA.emas)} />
      <mesh ref={manik} geometry={geo.bola} material={rata(WARNA.gading)} />
    </>
  );
}

const ARAH_KAMERA: V3 = [0, 1.45, 1];
const DIAM = new THREE.Vector3(-3.7, 1.7, 0.9);
const PERGI = new THREE.Vector3(3.9, 2.6, -0.6);

export default function AdeganIdentitas(props: PropsAdegan3D) {
  const k = useKendali(props);
  const siap = useHurufSiap();
  useKamera([0, 0.25, 0.3], ARAH_KAMERA, 6.6, 4.4);

  const cap = useRef<THREE.Group>(null);
  const tanda = useRef<(THREE.Mesh | null)[]>([]);
  const cincin = useRef<(THREE.Mesh | null)[]>([]);
  const petaTanda = teksturTanda();
  const bahanTanda = useBahanSendiri(() => new THREE.MeshBasicMaterial({ map: petaTanda, transparent: true, toneMapped: false }), [petaTanda]);
  const bahanCincin = useBahanSendiri(() => DOKUMEN.map(() => new THREE.MeshBasicMaterial({ color: WARNA.emas, transparent: true, depthWrite: false, toneMapped: false })));

  const posisiCap = useMemo(() => new THREE.Vector3(), []);
  const bantu = useMemo(() => [new THREE.Vector3(), new THREE.Vector3()], []);

  useFrame(() => {
    const { p } = k.current;
    // Lintasan cap: melayang ke atas tiap dokumen, menekan, lalu naik lagi.
    const c = cap.current;
    if (c) {
      const atas = (v: THREE.Vector3) => posisiCap.set(v.x, 1.25, v.z);
      let tekan = 0;
      if (p < awalCap(0)) posisiCap.copy(DIAM);
      else if (p >= awalCap(DOKUMEN.length)) {
        const u = ruas(p, awalCap(DOKUMEN.length), awalCap(DOKUMEN.length) + 0.12);
        atas(TANDA[DOKUMEN.length - 1]).lerp(PERGI, u);
      } else {
        const i = Math.min(DOKUMEN.length - 1, Math.floor((p - awalCap(0)) / JEDA_CAP));
        const u = (p - awalCap(i)) / JEDA_CAP;
        const [dari, ke] = bantu;
        if (i === 0) dari.copy(DIAM);
        else dari.set(TANDA[i - 1].x, 1.25, TANDA[i - 1].z);
        ke.set(TANDA[i].x, 1.25, TANDA[i].z);
        const pindah = THREE.MathUtils.smoothstep(u, 0, 0.4);
        posisiCap.copy(dari).lerp(ke, pindah);
        tekan = u < 0.4 ? 0 : u < 0.58 ? ruas(u, 0.4, 0.58) : u < 0.72 ? 1 : 1 - ruas(u, 0.72, 0.95);
        posisiCap.y = 1.25 - tekan * 1.1;
      }
      c.position.copy(posisiCap);
      c.visible = p < awalCap(DOKUMEN.length) + 0.115;
      c.scale.set(1, 1 - 0.08 * (tekan > 0.98 ? 1 : 0), 1);
    }
    DOKUMEN.forEach((_, i) => {
      const saat = awalCap(i) + JEDA_CAP * 0.56;
      const s = pegas(ruas(p, saat, saat + 0.05));
      const m = tanda.current[i];
      if (m) {
        m.visible = s > 0.001;
        m.scale.set(0.44 * s, 0.44 * s, 1);
      }
      const r = cincin.current[i];
      const gel = ruas(p, saat, saat + 0.07);
      if (r) {
        r.visible = gel > 0 && gel < 1;
        r.scale.setScalar(0.4 + gel * 1.3);
      }
      bahanCincin[i].opacity = 1 - gel;
    });
  });

  return (
    <>
      <Cahaya />
      <AlasCahaya p={[0, -0.12, 0.2]} ukuran={10} />
      <Kotak p={[0, -0.07, 0.1]} s={[6.4, 0.1, 3.3]} bahan={lambert(WARNA.hutan)} garis={tepi(WARNA.emas, 0.4)} />
      {DOKUMEN.map((d) => siap && <Dokumen key={d.jenis} d={d} />)}
      {TANDA.map((v, i) => (
        <group key={i} position={v}>
          <mesh ref={(el) => { tanda.current[i] = el; }} geometry={geo.bidang} material={bahanTanda} rotation={[-Math.PI / 2, 0, 0]} />
          <mesh ref={(el) => { cincin.current[i] = el; }} geometry={geoCincin} material={bahanCincin[i]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
        </group>
      ))}
      {BENANG.map((b) => <Benang key={`${b.a}-${b.b}`} b={b} k={k} />)}
      <group ref={cap}>
        <Silinder p={[0, 0.11, 0]} s={[0.62, 0.2, 0.62]} bahan={lambert(WARNA.hijau)} garis={tepi(WARNA.emas, 0.6)} />
        <Silinder p={[0, 0.005, 0]} s={[0.56, 0.02, 0.56]} bahan={rata(WARNA.emas)} garis={null} />
        <Silinder p={[0, 0.36, 0]} s={[0.16, 0.32, 0.16]} bahan={lambert(WARNA.gelap)} garis={null} />
        <mesh geometry={geo.bola} material={lambert(WARNA.emas)} position={[0, 0.6, 0]} scale={0.34} />
      </group>
      {siap && (
        <>
          {DOKUMEN.map((d) => (
            <Label key={d.jenis} teks={d.nama} p={[d.x, 0.3, d.z - d.h / 2 - 0.3]} tinggi={0.36} gaya={{ kapital: true }} />
          ))}
          <Label teks="dibuat seperti biasa" k={k} muncul={(s) => 1 - ruas(s.p, 0.1, 0.16)} p={[0, 0.1, 1.45]} tinggi={0.36} gaya={{ latar: null, warna: "rgba(246,244,233,0.8)", serif: true, tebal: 400 }} />
          <Label teks="bisa ditemukan · diperiksa · dihubungkan" k={k} muncul={(s) => ruas(s.p, 0.86, 0.95)} p={[0, 0.1, 1.45]} tinggi={0.36} gaya={{ warna: WARNA.emas }} />
          <Label teks="identitas: siapa · dari mana · kapan · nomor" k={k} muncul={(s) => s.l1 * ruas(s.p, awalCap(0) + 0.1, awalCap(0) + 0.14)} p={[0, -0.5, 1.65]} tinggi={0.32} gaya={{ ukuran: 40, warna: WARNA.gading }} />
          <Label teks="tetap dicetak, ditandatangani, dikirim" k={k} muncul={(s) => s.l2} p={[0, 0.45, -1.5]} tinggi={0.32} gaya={{ ukuran: 40 }} />
        </>
      )}
    </>
  );
}
