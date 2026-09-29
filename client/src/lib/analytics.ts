/**
 * Pencatat kunjungan ringan. Tanpa cookie dan tanpa pustaka pihak ketiga:
 * setiap perpindahan halaman mengirim satu beacon ke server sendiri, yang
 * menurunkan kota dari IP lalu membuang IP-nya.
 *
 * Tautan bertanda seperti `/?ref=cabang-makassar` dicatat sebagai sumber
 * kunjungan, sehingga tim bisa membagikan tautan berbeda ke tiap grup WA.
 */
const KUNCI_SUMBER = "hmi-evidence-sumber";

function sumberKunjungan(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const dariTautan = (params.get("ref") || params.get("utm_source") || "").trim().slice(0, 60);
    if (/^[a-zA-Z0-9._-]+$/.test(dariTautan)) {
      sessionStorage.setItem(KUNCI_SUMBER, dariTautan);
      return dariTautan;
    }
    return sessionStorage.getItem(KUNCI_SUMBER);
  } catch {
    return null;
  }
}

let terakhir = "";

export function catatKunjungan(path: string) {
  if (path.startsWith("/admin") || path === terakhir) return;
  if (navigator.doNotTrack === "1") return;
  terakhir = path;
  const body = JSON.stringify({ path, referrer: document.referrer || null, sumber: sumberKunjungan() });
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/kunjungan", blob)) return;
  } catch {
    // Beberapa peramban membatasi sendBeacon; jatuh ke fetch di bawah.
  }
  fetch("/api/kunjungan", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => undefined);
}
