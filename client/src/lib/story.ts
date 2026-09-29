/**
 * Menggambar kartu Instagram Story 1080×1920 di kanvas, lalu membagikannya
 * lewat lembar bagikan perangkat (di HP muncul pilihan Instagram → Story) atau
 * mengunduhnya bila perangkat tidak mendukung berbagi berkas.
 *
 * Isi penting diletakkan di antara y=260 dan y=1640 karena bagian atas dan
 * bawah Story tertutup tampilan Instagram.
 */
const L = 1080;
const T = 1920;
const EMAS = "#dcc38a";
const GADING = "#f6f4e9";
const SERIF = '"Noto Serif", Georgia, serif';
const SANS = '"DM Sans", system-ui, sans-serif';
const LATAR = "/scrollytelling/hmi-evidence-05-berbasis-bukti-v1.webp";
const LOGO = "/hmi-logo.png";

export interface IsiStory {
  label: string;
  judul: string;
  isi?: string;
  labelIsi?: string;
  catatan?: string;
  skor?: { nilai: number; maksimal: number; tingkat: string };
  tautan: string;
  gambarSiap?: string;
}

function muatGambar(src: string): Promise<HTMLImageElement | null> {
  return new Promise((selesai) => {
    const gambar = new Image();
    gambar.onload = () => selesai(gambar);
    gambar.onerror = () => selesai(null);
    gambar.src = src;
  });
}

function bungkus(ctx: CanvasRenderingContext2D, teks: string, lebarMaks: number): string[] {
  const baris: string[] = [];
  let sekarang = "";
  for (const kata of teks.split(/\s+/)) {
    const coba = sekarang ? `${sekarang} ${kata}` : kata;
    if (ctx.measureText(coba).width > lebarMaks && sekarang) {
      baris.push(sekarang);
      sekarang = kata;
    } else {
      sekarang = coba;
    }
  }
  if (sekarang) baris.push(sekarang);
  return baris;
}

function spasiHuruf(ctx: CanvasRenderingContext2D, nilai: string) {
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = nilai;
}

export async function buatStory(isi: IsiStory): Promise<Blob> {
  if (isi.gambarSiap) {
    const respons = await fetch(isi.gambarSiap);
    if (!respons.ok) throw new Error("Gambar Story tidak dapat dimuat");
    return respons.blob();
  }

  await Promise.all([
    document.fonts.load(`600 100px ${SERIF}`),
    document.fonts.load(`400 44px ${SERIF}`),
    document.fonts.load(`400 44px ${SANS}`),
    document.fonts.load(`500 34px ${SANS}`),
  ]).catch(() => undefined);

  const kanvas = document.createElement("canvas");
  kanvas.width = L;
  kanvas.height = T;
  const ctx = kanvas.getContext("2d")!;

  // Latar: ilustrasi HMI Evidence yang digelapkan, dengan cahaya emas lembut.
  ctx.fillStyle = "#071610";
  ctx.fillRect(0, 0, L, T);
  const latar = await muatGambar(LATAR);
  if (latar) {
    const skala = Math.max(L / latar.width, T / latar.height);
    const w = latar.width * skala;
    const h = latar.height * skala;
    ctx.globalAlpha = 0.55;
    ctx.drawImage(latar, (L - w) * 0.62, (T - h) / 2, w, h);
    ctx.globalAlpha = 1;
  }
  const gelap = ctx.createLinearGradient(0, 0, 0, T);
  gelap.addColorStop(0, "rgba(3,13,10,0.72)");
  gelap.addColorStop(0.45, "rgba(7,22,16,0.9)");
  gelap.addColorStop(1, "rgba(3,13,10,0.97)");
  ctx.fillStyle = gelap;
  ctx.fillRect(0, 0, L, T);
  const cahaya = ctx.createRadialGradient(L * 0.85, T * 0.12, 0, L * 0.85, T * 0.12, 760);
  cahaya.addColorStop(0, "rgba(220,195,138,0.22)");
  cahaya.addColorStop(1, "rgba(220,195,138,0)");
  ctx.fillStyle = cahaya;
  ctx.fillRect(0, 0, L, T);

  // Bingkai emas tipis dengan belah ketupat di tengah atas dan bawah.
  ctx.strokeStyle = "rgba(220,195,138,0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, L - 112, T - 112);
  for (const y of [56, T - 56]) {
    ctx.save();
    ctx.translate(L / 2, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#071610";
    ctx.fillRect(-16, -16, 32, 32);
    ctx.strokeStyle = EMAS;
    ctx.strokeRect(-10, -10, 20, 20);
    ctx.restore();
  }

  const kiri = 120;
  const lebar = L - kiri * 2;

  // Merek: lambang HMI di samping tulisan HMI Evidence.
  ctx.textBaseline = "alphabetic";
  const logo = await muatGambar(LOGO);
  let kiriMerek = kiri;
  if (logo) {
    const tinggiLogo = 150;
    const lebarLogo = (logo.width / logo.height) * tinggiLogo;
    ctx.drawImage(logo, kiri, 230, lebarLogo, tinggiLogo);
    kiriMerek = kiri + lebarLogo + 30;
  }
  ctx.fillStyle = EMAS;
  ctx.font = `500 34px ${SANS}`;
  spasiHuruf(ctx, "10px");
  ctx.fillText("HMI EVIDENCE", kiriMerek, 318);
  ctx.fillRect(kiriMerek, 346, 180, 2);

  const atasLabel = 560;
  ctx.font = `500 30px ${SANS}`;
  spasiHuruf(ctx, "6px");
  ctx.fillStyle = EMAS;
  ctx.fillText(isi.label.toUpperCase(), kiri, atasLabel);
  spasiHuruf(ctx, "0px");

  // Cari skala huruf terbesar yang membuat judul, isi, dan catatan muat
  // dengan jarak lega sebelum baris penutup (isi berakhir paling bawah y=1400).
  const fontJudul = (u: number) => `600 ${u}px ${SERIF}`;
  const fontIsi = (u: number) => `400 ${u}px ${isi.labelIsi ? SERIF : SANS}`;
  const susun = (skala: number) => {
    const ukuranJudul = Math.round(108 * skala);
    const ukuranIsi = Math.round(46 * skala);
    ctx.font = fontJudul(ukuranJudul);
    const barisJudul = bungkus(ctx, isi.judul, lebar);
    ctx.font = fontIsi(ukuranIsi);
    const barisIsi = isi.isi ? bungkus(ctx, isi.isi, lebar) : [];
    let bawah = atasLabel + 60 + ukuranJudul * 0.2 + barisJudul.length * ukuranJudul * 1.14;
    const ukuranSkor = Math.round(190 * skala);
    if (isi.skor) bawah += 120 + 40 + ukuranSkor * 0.9 + 70;
    if (barisIsi.length) bawah += 90 + (isi.labelIsi ? 26 : 0) + barisIsi.length * ukuranIsi * 1.5;
    if (isi.catatan) bawah += 70;
    return { ukuranJudul, ukuranIsi, ukuranSkor, barisJudul, barisIsi, bawah };
  };
  let tata = susun(1);
  for (let skala = 0.95; tata.bawah > 1400 && skala >= 0.55; skala -= 0.05) tata = susun(skala);

  let y = atasLabel + 60 + tata.ukuranJudul * 0.2;
  ctx.font = fontJudul(tata.ukuranJudul);
  ctx.fillStyle = GADING;
  for (const baris of tata.barisJudul) {
    y += tata.ukuranJudul * 1.14;
    ctx.fillText(baris, kiri, y);
  }

  // Skor komisariat: angka besar emas, skor maksimal, dan tingkatnya.
  if (isi.skor) {
    y += 120;
    ctx.font = `500 28px ${SANS}`;
    spasiHuruf(ctx, "5px");
    ctx.fillStyle = EMAS;
    ctx.fillText("SKOR KOMISARIATKU", kiri, y);
    spasiHuruf(ctx, "0px");
    y += 40 + tata.ukuranSkor * 0.9;
    ctx.font = `600 ${tata.ukuranSkor}px ${SERIF}`;
    ctx.fillStyle = EMAS;
    ctx.fillText(String(isi.skor.nilai), kiri, y);
    const lebarAngka = ctx.measureText(String(isi.skor.nilai)).width;
    ctx.font = `400 ${Math.round(tata.ukuranSkor * 0.36)}px ${SERIF}`;
    ctx.fillStyle = "rgba(246,244,233,0.6)";
    ctx.fillText(`/ ${isi.skor.maksimal}`, kiri + lebarAngka + 24, y);
    y += 70;
    ctx.font = `400 ${Math.round(tata.ukuranSkor * 0.24)}px ${SERIF}`;
    ctx.fillStyle = GADING;
    ctx.fillText(isi.skor.tingkat, kiri, y);
  }

  if (tata.barisIsi.length) {
    y += 90;
    if (isi.labelIsi) {
      ctx.font = `500 28px ${SANS}`;
      spasiHuruf(ctx, "5px");
      ctx.fillStyle = EMAS;
      ctx.fillText(isi.labelIsi.toUpperCase(), kiri, y);
      spasiHuruf(ctx, "0px");
      y += 26;
    }
    ctx.font = fontIsi(tata.ukuranIsi);
    ctx.fillStyle = "rgba(246,244,233,0.82)";
    for (const baris of tata.barisIsi) {
      y += tata.ukuranIsi * 1.5;
      ctx.fillText(baris, kiri, y);
    }
  }

  if (isi.catatan) {
    ctx.font = `400 28px ${SANS}`;
    ctx.fillStyle = "rgba(246,244,233,0.55)";
    ctx.fillText(isi.catatan, kiri, y + 70);
  }
  // Ajakan dan alamat situs di dalam kapsul emas.
  ctx.font = `400 30px ${SERIF}`;
  ctx.fillStyle = "rgba(246,244,233,0.7)";
  ctx.fillText("Jangan bicara HMI tanpa bukti.", kiri, 1500);
  ctx.font = `500 40px ${SANS}`;
  const lebarTautan = ctx.measureText(isi.tautan).width;
  const tinggiKapsul = 96;
  const atasKapsul = 1540;
  ctx.strokeStyle = EMAS;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(kiri, atasKapsul, lebarTautan + 84, tinggiKapsul, tinggiKapsul / 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(220,195,138,0.1)";
  ctx.fill();
  ctx.fillStyle = EMAS;
  ctx.fillText(isi.tautan, kiri + 42, atasKapsul + 62);

  return await new Promise<Blob>((selesai, gagal) => kanvas.toBlob((blob) => (blob ? selesai(blob) : gagal(new Error("Gambar gagal dibuat"))), "image/png"));
}

export type HasilBagikan = "dibagikan" | "diunduh" | "batal";

export async function bagikanGambar(blob: Blob, namaFile: string, judul: string): Promise<HasilBagikan> {
  const berkas = new File([blob], namaFile, { type: "image/png" });
  if (navigator.canShare?.({ files: [berkas] })) {
    try {
      await navigator.share({ files: [berkas], title: judul });
      return "dibagikan";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "batal";
    }
  }
  const url = URL.createObjectURL(blob);
  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = namaFile;
  tautan.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "diunduh";
}
