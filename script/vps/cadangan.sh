#!/usr/bin/env bash
# Cadangan harian database dan foto unggahan ahmadzulfikar.com.
#
# Jalankan di VPS. Pasang sekali di cron (crontab -e):
#   15 3 * * * bash ~/cadangan.sh >> ~/cadangan/cadangan.log 2>&1
#
# Hasilnya di ~/cadangan: db-TANGGAL.dump dan uploads-TANGGAL.tar.gz, disimpan
# SIMPAN_HARI hari (bawaan 14). Salin juga ke luar VPS secara berkala; lihat
# docs/keamanan-vps.md bagian Cadangan.
set -euo pipefail

DIR_APP="$HOME/fikar_website"
DIR_CADANGAN="$HOME/cadangan"
SIMPAN_HARI="${SIMPAN_HARI:-14}"
TANGGAL="$(date +%F)"

mkdir -p "$DIR_CADANGAN"
chmod 700 "$DIR_CADANGAN"
URL_DB="$(grep '^DATABASE_URL=' "$DIR_APP/.env" | tail -1 | cut -d= -f2-)"

# Ditulis ke berkas sementara dulu supaya cadangan yang gagal tidak menimpa yang baik.
pg_dump --format=custom --no-owner --no-privileges "$URL_DB" > "$DIR_CADANGAN/db-$TANGGAL.dump.tmp"
mv "$DIR_CADANGAN/db-$TANGGAL.dump.tmp" "$DIR_CADANGAN/db-$TANGGAL.dump"
tar czf "$DIR_CADANGAN/uploads-$TANGGAL.tar.gz.tmp" -C "$DIR_APP" uploads
mv "$DIR_CADANGAN/uploads-$TANGGAL.tar.gz.tmp" "$DIR_CADANGAN/uploads-$TANGGAL.tar.gz"
chmod 600 "$DIR_CADANGAN"/db-*.dump "$DIR_CADANGAN"/uploads-*.tar.gz

find "$DIR_CADANGAN" -maxdepth 1 \( -name 'db-*.dump' -o -name 'uploads-*.tar.gz' \) -mtime +"$SIMPAN_HARI" -delete

echo "$(date -Is) cadangan $TANGGAL selesai: database $(du -h "$DIR_CADANGAN/db-$TANGGAL.dump" | cut -f1), foto $(du -h "$DIR_CADANGAN/uploads-$TANGGAL.tar.gz" | cut -f1)"
