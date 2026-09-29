#!/usr/bin/env bash
# Menyalin data ahmadzulfikar.com dari VPS lama ke VPS baru.
#
# Jalankan DARI LAPTOP (Git Bash) yang bisa SSH ke kedua VPS:
#   LAMA=reformsyndicate@103.179.57.165 BARU=deploy@IP_BARU bash script/vps/salin-data.sh berkas
#   LAMA=reformsyndicate@103.179.57.165 BARU=deploy@IP_BARU bash script/vps/salin-data.sh db
#
#   berkas  menyalin .env dan folder uploads/ (foto dari panel admin)
#   db      menyalin seluruh database; isi database di VPS baru ditimpa
#
# Kunci SSH bisa dipilih lewat KUNCI_LAMA dan KUNCI_BARU, misalnya
#   KUNCI_LAMA=~/.ssh/orchestrator_deploy
# Data dialirkan langsung dari server ke server lewat laptop, tanpa berkas sementara.
set -euo pipefail

: "${LAMA:?Isi LAMA, misalnya LAMA=reformsyndicate@103.179.57.165}"
: "${BARU:?Isi BARU, misalnya BARU=deploy@IP_BARU}"
SSH_LAMA=(ssh -o BatchMode=yes ${KUNCI_LAMA:+-i "$KUNCI_LAMA"} "$LAMA")
SSH_BARU=(ssh -o BatchMode=yes ${KUNCI_BARU:+-i "$KUNCI_BARU"} "$BARU")
# Dievaluasi di server (bukan di laptop): membaca DATABASE_URL dari .env masing-masing.
DB_URL='"$(grep ^DATABASE_URL= .env | cut -d= -f2-)"'

salin_berkas() {
  echo "==> .env dan uploads/ dari $LAMA ke $BARU"
  "${SSH_LAMA[@]}" 'tar czf - -C ~/fikar_website .env uploads' \
    | "${SSH_BARU[@]}" 'mkdir -p ~/fikar_website && tar xzf - -C ~/fikar_website && chmod 600 ~/fikar_website/.env'

  # pm2 di server lama bisa saja menyimpan variabel yang tidak tertulis di .env.
  # Di server baru semuanya harus ada di .env.
  echo "==> Memeriksa .env di VPS baru"
  "${SSH_BARU[@]}" 'cd ~/fikar_website && for k in NODE_ENV=production PORT= DATABASE_URL= SESSION_SECRET= ADMIN_PASSWORD=; do grep -q "^$k" .env || echo "   PERINGATAN: .env belum berisi $k"; done; echo "   selesai diperiksa"'
}

salin_db() {
  echo "==> Database dari $LAMA ke $BARU"
  "${SSH_LAMA[@]}" "cd ~/fikar_website && pg_dump --no-owner --no-privileges --clean --if-exists $DB_URL" \
    | "${SSH_BARU[@]}" "cd ~/fikar_website && psql -q -v ON_ERROR_STOP=1 $DB_URL"
  echo "==> Jumlah baris di VPS baru"
  "${SSH_BARU[@]}" "cd ~/fikar_website && psql -tA $DB_URL -c \"SELECT 'kunjungan', count(*) FROM kunjungan UNION ALL SELECT 'gallery', count(*) FROM gallery UNION ALL SELECT 'notes', count(*) FROM notes\""
}

case "${1:-}" in
  berkas) salin_berkas ;;
  db) salin_db ;;
  *)
    echo "Pakai: bash script/vps/salin-data.sh berkas|db" >&2
    exit 1
    ;;
esac
