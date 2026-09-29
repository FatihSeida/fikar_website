#!/usr/bin/env bash
# Menyiapkan VPS baru untuk ahmadzulfikar.com (Ubuntu 22.04 atau 24.04).
#
# Jalankan DI VPS BARU sebagai pengguna yang nanti dipakai deploy (punya sudo):
#   bash siapkan-vps.sh
#
# Yang dipasang: Node 20, pm2, PostgreSQL, nginx, certbot, dan firewall.
# Database dan penggunanya dibuat dari DATABASE_URL di ~/fikar_website/.env,
# jadi salin .env lebih dulu (salin-data.sh berkas). Aman dijalankan ulang.
set -euo pipefail

DOMAIN="ahmadzulfikar.com"
DIR_APP="$HOME/fikar_website"

echo "==> Paket sistem"
sudo apt-get update -y
sudo apt-get install -y curl ca-certificates gnupg nginx postgresql postgresql-contrib certbot python3-certbot-nginx ufw
if ! command -v node >/dev/null 2>&1 || ! node -v | grep -q '^v20'; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
command -v pm2 >/dev/null 2>&1 || sudo npm install -g pm2

echo "==> Firewall: hanya SSH, HTTP, dan HTTPS yang terbuka"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "==> Folder aplikasi"
mkdir -p "$DIR_APP/uploads"

echo "==> Database"
if [ -f "$DIR_APP/.env" ]; then
  # Pengguna, sandi, dan nama database diambil dari DATABASE_URL yang sama dengan server lama.
  mapfile -t DB < <(python3 - "$DIR_APP/.env" <<'PY'
import sys, urllib.parse
for baris in open(sys.argv[1], encoding="utf-8"):
    if baris.startswith("DATABASE_URL="):
        u = urllib.parse.urlparse(baris.split("=", 1)[1].strip().strip('"').strip("'"))
        print(urllib.parse.unquote(u.username or ""))
        print(urllib.parse.unquote(u.password or ""))
        print(u.path.lstrip("/"))
        break
PY
)
  DB_USER="${DB[0]:-}"; DB_PASS="${DB[1]:-}"; DB_NAME="${DB[2]:-}"
  if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
    echo "   DATABASE_URL di .env tidak terbaca. Periksa isinya lalu jalankan ulang." >&2
    exit 1
  fi
  SANDI_SQL="${DB_PASS//\'/\'\'}"
  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
    sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE ROLE \"$DB_USER\" LOGIN PASSWORD '$SANDI_SQL'"
  fi
  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
    sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
  fi
  echo "   Database $DB_NAME milik $DB_USER siap."
else
  echo "   .env belum ada. Jalankan dulu dari laptop: bash script/vps/salin-data.sh berkas" >&2
  echo "   lalu jalankan skrip ini lagi supaya database ikut dibuat." >&2
fi

echo "==> nginx untuk $DOMAIN"
PORT_APP="5003"
if [ -f "$DIR_APP/.env" ] && grep -q '^PORT=' "$DIR_APP/.env"; then
  PORT_APP="$(grep '^PORT=' "$DIR_APP/.env" | tail -1 | cut -d= -f2- | tr -d "\"' ")"
fi
sudo tee "/etc/nginx/sites-available/$DOMAIN" >/dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Unggahan foto admin maksimal 5 MB.
    client_max_body_size 6m;

    location / {
        proxy_pass http://127.0.0.1:$PORT_APP;
        proxy_http_version 1.1;
        # Aplikasi membutuhkan ketiga header ini: Host untuk pemeriksaan asal
        # permintaan, IP asli untuk pembatas dan lokasi pengunjung, dan
        # protokol supaya cookie login yang "secure" mau dikirim.
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
sudo ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "==> pm2 menyala otomatis saat VPS dinyalakan ulang"
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" >/dev/null

echo
echo "Selesai. Langkah berikutnya ada di docs/pindah-vps.md (salin database, lalu deploy)."
