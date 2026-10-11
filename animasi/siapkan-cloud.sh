#!/usr/bin/env bash
# Menyiapkan alat render animasi di sesi cloud Claude Code (VM Ubuntu baru untuk tiap sesi): npm install, ffmpeg, dan
# Chromium Playwright. Dipanggil hook SessionStart di .claude/settings.json pada setiap sesi baru dan setiap resume.
#
# - Tidak melakukan apa pun di luar cloud (CLAUDE_CODE_REMOTE bukan "true"), jadi aman dijalankan di PC Windows.
# - Idempoten dan cepat saat resume: yang sudah terpasang dilewati.
# - Tidak pernah menggagalkan sesi: selalu exit 0. Hasilnya dicetak sebagai ringkasan pendek (stdout hook masuk ke
#   konteks Claude); log lengkap tiap langkah ada di ${TMPDIR:-/tmp}/siapkan-cloud/.
# - Seluruh skrip dibatasi 560 detik, di bawah batas 600 detik milik hook.
#
# Chromium Playwright diunduh dari CDN Playwright, yang diblokir oleh akses jaringan "Trusted". Bila unduhan gagal,
# ringkasan menyebut apa yang harus diubah pengguna (sekali saja).
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
trap 'exit 0' EXIT

ANIMASI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AKAR="$(dirname "$ANIMASI")"
LOG="${TMPDIR:-/tmp}/siapkan-cloud"
BATAS_TOTAL=560
rm -rf "$LOG"
mkdir -p "$LOG"

export DEBIAN_FRONTEND=noninteractive
export npm_config_audit=false npm_config_fund=false npm_config_update_notifier=false
SUDO=""
if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then SUDO="sudo -n"; fi

# jalan <nama-log> <batas-detik> <perintah...>: keluaran ke log, dengan batas waktu yang tidak melewati sisa jatah total.
jalan() {
  local nama=$1 batas=$2
  shift 2
  local sisa=$((BATAS_TOTAL - SECONDS))
  [ "$sisa" -lt "$batas" ] && batas=$sisa
  if [ "$batas" -lt 5 ]; then echo "waktu jatah habis, dilewati: $*" >> "$LOG/$nama.log"; return 124; fi
  timeout "$batas" "$@" >> "$LOG/$nama.log" 2>&1
}

status() { printf '%s\n' "$2" > "$LOG/$1.status"; }
baca() { cat "$LOG/$1.status" 2>/dev/null || echo "dilewati"; }
bermasalah() { case "$(baca "$1")" in GAGAL*|dilewati*) return 0 ;; esac; return 1; }
# ekor <berkas-log>: tiga baris terakhir, untuk ringkasan.
ekor() { tail -n 3 "$LOG/$1" 2>/dev/null | cut -c1-200 | sed 's/^/    /'; }

# ---------------------------------------------------------------- npm
modul_akar_ok() { (cd "$AKAR" && node --input-type=module -e "await import('vite'); await import('three'); await import('sharp')" >/dev/null 2>&1); }
modul_animasi_ok() { [ -f "$ANIMASI/node_modules/playwright-core/package.json" ]; }

langkah_npm_akar() {
  if modul_akar_ok; then status npm-akar "sudah ada"; return; fi
  (cd "$AKAR" && jalan npm-akar 420 npm install --include=dev --no-audit --no-fund --no-progress)
  if modul_akar_ok; then status npm-akar "terpasang"; else status npm-akar "GAGAL (three, vite, atau sharp belum bisa dimuat)"; fi
}

langkah_npm_animasi() {
  if modul_animasi_ok; then status npm-animasi "sudah ada"; return 0; fi
  (cd "$ANIMASI" && jalan npm-animasi 180 npm install --no-audit --no-fund --no-progress)
  if modul_animasi_ok; then status npm-animasi "terpasang"; return 0; fi
  status npm-animasi "GAGAL"
  return 1
}

# ---------------------------------------------------------------- ffmpeg
ada_ffmpeg() { command -v ffmpeg >/dev/null 2>&1 && command -v ffprobe >/dev/null 2>&1; }

langkah_ffmpeg() {
  if ada_ffmpeg; then status ffmpeg "sudah ada"; return; fi
  # shellcheck disable=SC2086  # $SUDO sengaja dipecah menjadi kata
  jalan ffmpeg 120 $SUDO apt-get update -qq
  # shellcheck disable=SC2086
  jalan ffmpeg 300 $SUDO apt-get install -y -qq -o DPkg::Lock::Timeout=120 ffmpeg
  if ada_ffmpeg; then status ffmpeg "terpasang (apt)"; else status ffmpeg "GAGAL (apt-get install -y ffmpeg)"; fi
}

# ---------------------------------------------------------------- peramban
# Benar-benar membuka peramban lewat pemilih yang sama dengan alat render (kit/alat/peramban.mjs), jadi "siap" berarti
# render akan berjalan: Chromium Playwright, Chromium sistem, atau KIT_PERAMBAN.
peramban_ok() {
  (cd "$ANIMASI" && timeout 60 node --input-type=module -e "const { bukaPeramban } = await import('./kit/alat/peramban.mjs'); await (await bukaPeramban()).close();" > "$LOG/peramban.out" 2>&1)
}
nama_peramban() { sed -n 's/^Peramban: //p' "$LOG/peramban.out" | head -n 1; }

CHROMIUM_LANJUT=0
UNDUHAN_GAGAL=0

# Unduhan tidak memakai apt, jadi berjalan bersamaan dengan langkah ffmpeg.
langkah_chromium_unduh() {
  if peramban_ok; then status peramban "sudah ada: $(nama_peramban)"; return; fi
  if (cd "$ANIMASI" && jalan chromium 400 npx --no-install playwright-core install chromium); then
    CHROMIUM_LANJUT=1
  else
    UNDUHAN_GAGAL=1
    status peramban "GAGAL mengunduh Chromium"
  fi
}

# Pustaka sistem (apt) dipasang sesudah ffmpeg supaya dua apt-get tidak berebut kunci dpkg.
langkah_chromium_pasang() {
  [ "$CHROMIUM_LANJUT" = 1 ] || return
  (cd "$ANIMASI" && jalan chromium 300 npx --no-install playwright-core install --with-deps chromium)
  if peramban_ok; then
    status peramban "terpasang: $(nama_peramban)"
  else
    status peramban "GAGAL: Chromium terpasang tetapi tidak bisa dijalankan"
  fi
}

# ---------------------------------------------------------------- jalankan
langkah_npm_akar & PID_AKAR=$!
langkah_ffmpeg & PID_FFMPEG=$!
if langkah_npm_animasi; then langkah_chromium_unduh; else status peramban "dilewati (npm install di animasi/ gagal)"; fi
wait "$PID_FFMPEG"
langkah_chromium_pasang
wait "$PID_AKAR"

# ---------------------------------------------------------------- ringkasan
SIAP=1
for k in npm-akar npm-animasi ffmpeg peramban; do
  if bermasalah "$k"; then SIAP=0; fi
done

echo "[siapkan-cloud] alat render animasi (${SECONDS} detik)"
echo "  npm akar repo : $(baca npm-akar)"
echo "  npm animasi/  : $(baca npm-animasi)"
echo "  ffmpeg        : $(baca ffmpeg)"
echo "  peramban      : $(baca peramban)"
for k in npm-akar npm-animasi ffmpeg; do bermasalah "$k" && ekor "$k.log"; done
if [ "$UNDUHAN_GAGAL" = 1 ]; then
  ekor chromium.log
  echo "  Unduhan Chromium diblokir atau gagal. Yang perlu dilakukan sekali: ubah akses jaringan environment ke Full di claude.ai/code → ikon awan → gerigi → Network access."
  echo "  Sesudah itu mulai sesi baru, atau jalankan: bash animasi/siapkan-cloud.sh"
elif bermasalah peramban; then
  ekor peramban.out
fi
if [ "$SIAP" = 1 ]; then
  echo "  siap: dari animasi/ jalankan  npm run buat -- <nama>"
else
  echo "  belum siap merender; log lengkap di $LOG/"
fi
exit 0
