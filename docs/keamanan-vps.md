# Keamanan VPS

Pengamanan di dalam aplikasi (batas per IP, penolakan saat penuh, CSP, dan
lainnya) tercatat di README bagian "Pengamanan bawaan". Dokumen ini berisi
langkah yang hanya bisa dilakukan di VPS atau di dasbor layanan, diurutkan
dari yang paling berdampak.

VPS `103.179.57.165` dipakai bersama empat situs. Serangan yang menjatuhkan
satu situs akan menjatuhkan semuanya.

## 1. Tutup port 5000–5002

Pemeriksaan 30 September 2026 dari internet: port **5000, 5001, dan 5002
terbuka**. Ketiganya adalah Reform Syndicate, LTMI, dan Reform Intelligence,
dan bisa diakses langsung tanpa nginx dan tanpa HTTPS. Port 5003 (situs ini),
5432 (PostgreSQL), dan 6379 (Redis) sudah tertutup.

Pastikan dulu semua situs dijangkau nginx lewat localhost. Setiap
`proxy_pass` harus mengarah ke `127.0.0.1` atau `localhost`, bukan ke IP
publik:

```bash
grep -rn "proxy_pass" /etc/nginx/sites-enabled/
```

Lihat keadaan firewall:

```bash
sudo ufw status numbered
```

- **Bila aktif:** hapus aturan yang mengizinkan 5000, 5001, atau 5002 dengan
  `sudo ufw delete NOMOR`, mulai dari nomor terbesar karena nomor bergeser
  setiap kali satu aturan dihapus.
- **Bila tidak aktif:** izinkan SSH lebih dulu supaya koneksi tidak terputus,
  lalu nyalakan. Semua port lain otomatis tertutup.

  ```bash
  sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
  ```

Periksa dari laptop (Git Bash). Semua harus tertutup, kecuali 22, 80, dan 443:

```bash
for p in 22 80 443 5000 5001 5002 5003 5432 6379; do timeout 4 bash -c "</dev/tcp/103.179.57.165/$p" 2>/dev/null && echo "$p TERBUKA" || echo "$p tertutup"; done
```

Periksa juga panel IDCloudHost. Bila ada firewall di tingkat panel, samakan
aturannya.

## 2. Cloudflare di depan situs

Cloudflare (paket Free) menahan serangan DDoS dan bot sebelum sampai ke VPS.

1. Tambahkan situs `ahmadzulfikar.com`, pilih paket **Free**.
2. Periksa record DNS hasil pindaian Cloudflare:
   - `A` untuk `ahmadzulfikar.com` dan `www` ke `103.179.57.165`, status
     **Proxied** (awan oranye).
   - Record email (`MX`, `TXT`) bila ada: status **DNS only**.
   - Bandingkan dengan record di pengelola DNS lama. Record yang tertinggal
     akan berhenti bekerja setelah nameserver diganti.
3. **SSL/TLS → Overview:** pilih **Full (strict)**. Jangan pilih Flexible,
   karena situs akan berputar-putar dialihkan antara HTTP dan HTTPS.
4. **SSL/TLS → Edge Certificates:** nyalakan **Always Use HTTPS**.
5. **Sebelum mengganti nameserver**, pasang IP asli pengunjung di nginx
   (langkah di bawah). Tanpa ini, semua pengunjung terlihat berasal dari
   segelintir IP Cloudflare: pembatas per IP akan menahan seluruh situs, dan
   lokasi pengunjung di panel admin tidak lagi terbaca.
6. Ganti nameserver domain di IDCloudHost ke dua nameserver yang diberikan
   Cloudflare, lalu tunggu status **Active**.
7. Periksa: `curl -sI https://ahmadzulfikar.com | grep -i cf-ray` harus
   menampilkan baris `cf-ray`, dan tab Pengunjung di admin tetap
   menunjukkan kota yang beragam.

**IP asli pengunjung di nginx.** Perintah ini mengambil daftar IP Cloudflare
terbaru dan hanya memercayai header `CF-Connecting-IP` dari alamat-alamat
itu. Aman dipasang sebelum Cloudflare aktif:

```bash
{ for ip in $(curl -s https://www.cloudflare.com/ips-v4) $(curl -s https://www.cloudflare.com/ips-v6); do echo "set_real_ip_from $ip;"; done; echo "real_ip_header CF-Connecting-IP;"; } | sudo tee /etc/nginx/conf.d/cloudflare-real-ip.conf
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

**Pengaturan keamanan yang disarankan** (menu Security):
- **Bot Fight Mode:** nyala.
- **WAF → Rate limiting rules** (satu aturan gratis): bila URI path berisi
  `/api/`, lebih dari 100 permintaan per 10 detik dari satu IP, blokir
  selama 10 detik.
- **Saat diserang:** nyalakan **Under Attack Mode** di halaman Overview.
  Pengunjung melihat pemeriksaan singkat selama beberapa detik, sedangkan bot
  tertahan.

**Keterbatasan.** IP `103.179.57.165` tetap bisa diserang langsung lewat
tiga situs lain atau lewat IP itu sendiri. Mengunci port 80/443 hanya untuk
Cloudflare akan mematikan situs lain yang belum lewat Cloudflare. Ada dua
jalan menuju perlindungan penuh: keempat domain dipindah ke Cloudflare lalu
firewall hanya menerima IP Cloudflare, atau situs ini pindah ke VPS sendiri
dengan IP baru yang hanya diketahui Cloudflare ([pindah-vps.md](pindah-vps.md)).

## 3. Pengerasan nginx

Buat `/etc/nginx/conf.d/pengaman.conf`. Berlaku untuk semua situs di VPS:

```nginx
# Sembunyikan versi nginx dan putus koneksi yang sengaja dibuat lambat.
server_tokens off;
client_header_timeout 10s;
client_body_timeout 10s;
send_timeout 15s;

# Zona batas per IP, dipakai di blok server situs mana pun.
limit_req_zone $binary_remote_addr zone=per_ip:10m rate=50r/s;
limit_conn_zone $binary_remote_addr zone=koneksi_ip:10m;
limit_req_status 429;
limit_conn_status 429;
```

Tambahkan dua baris ini di dalam `location /` pada
`/etc/nginx/sites-available/ahmadzulfikar.com`:

```nginx
limit_req zone=per_ip burst=150 nodelay;
limit_conn koneksi_ip 40;
```

Batasnya sengaja sejalan dengan batas di aplikasi (3000 permintaan per menit
per IP), supaya satu WiFi kampus atau lokasi Kongres tidak ikut tertahan.
Bedanya, permintaan berlebih ditolak nginx sebelum sampai ke Node.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Bila `nginx -t` melaporkan `duplicate`, baris itu sudah ada di
`/etc/nginx/nginx.conf`. Hapus baris yang sama dari `pengaman.conf`.

## 4. SSH

Periksa apakah login dengan password masih diizinkan:

```bash
sudo sshd -T | grep -Ei "^(passwordauthentication|permitrootlogin)"
```

Bila `passwordauthentication yes`, matikan. **Biarkan sesi SSH yang sekarang
tetap terbuka**, lalu coba masuk dari terminal lain sebelum menutupnya:

```bash
printf 'PasswordAuthentication no\nPermitRootLogin prohibit-password\n' | sudo tee /etc/ssh/sshd_config.d/99-pengaman.conf && sudo sshd -t && sudo systemctl reload ssh
```

Pasang fail2ban untuk memblokir IP yang terus menebak login SSH:

```bash
sudo apt-get install -y fail2ban
```

## 5. Cadangan

Salin skrip dari laptop ke VPS, jalankan sekali untuk mencoba, lalu pasang
di cron (setiap hari pukul 03.15):

```bash
scp -i ~/.ssh/orchestrator_deploy script/vps/cadangan.sh reformsyndicate@103.179.57.165:
```

```bash
ssh -i ~/.ssh/orchestrator_deploy reformsyndicate@103.179.57.165 'mkdir -p ~/cadangan && bash ~/cadangan.sh'
```

```bash
ssh -i ~/.ssh/orchestrator_deploy reformsyndicate@103.179.57.165 '(crontab -l 2>/dev/null | grep -v cadangan.sh; echo "15 3 * * * bash \$HOME/cadangan.sh >> \$HOME/cadangan/cadangan.log 2>&1") | crontab -'
```

Cadangan yang hanya ada di VPS ikut hilang bila VPS rusak atau dibobol.
Tarik ke laptop setidaknya seminggu sekali:

```bash
mkdir -p cadangan && scp -i ~/.ssh/orchestrator_deploy "reformsyndicate@103.179.57.165:cadangan/*-$(date +%F)*" cadangan/
```

Memulihkan database dari cadangan (di VPS):

```bash
cd ~/fikar_website && pg_restore --clean --if-exists --no-owner -d "$(grep ^DATABASE_URL= .env | cut -d= -f2-)" ~/cadangan/db-TANGGAL.dump
```

## 6. Akun dan pemantauan

- **Nyalakan 2FA** di GitHub, IDCloudHost, dan Cloudflare. Setiap push ke
  `main` langsung ter-deploy ke VPS, jadi akun GitHub setara kunci server.
- **Pemantau uptime:** daftarkan `https://ahmadzulfikar.com` di layanan
  gratis seperti UptimeRobot (cek tiap 5 menit, peringatan lewat email atau
  Telegram), supaya gangguan langsung ketahuan.
- **Ganti rahasia yang pernah terlihat orang lain:** `ADMIN_PASSWORD` dan
  `SESSION_SECRET` di `~/fikar_website/.env`, lalu
  `pm2 restart fikar-website --update-env`.

## 7. Jangka menengah

- **Panel admin:** tambahkan Cloudflare Access (gratis sampai 50 pengguna)
  untuk jalur `/admin`, jadi masuk admin butuh email dan kode OTP selain
  password.
- **Pisahkan situs:** keempat situs berjalan sebagai satu pengguna Linux,
  sehingga situs yang dibobol bisa membaca `.env` situs lain. Pisahkan
  pengguna per situs, atau pindahkan situs ini ke VPS sendiri.
