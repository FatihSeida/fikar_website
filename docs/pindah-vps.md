# Pindah ke VPS lain

Panduan memindahkan ahmadzulfikar.com ke VPS yang lebih besar dengan waktu
henti mendekati nol. Kodenya tidak perlu disalin: build dilakukan di GitHub
dan dikirim ke alamat yang tercatat di secret repositori. Yang dipindahkan
hanya tiga hal:

| Data | Letak di server | Cara memindahkan |
|---|---|---|
| Database | PostgreSQL `fikardb` | `salin-data.sh db` |
| Foto unggahan admin | `~/fikar_website/uploads/` | `salin-data.sh berkas` |
| Rahasia produksi | `~/fikar_website/.env` | `salin-data.sh berkas` |

Perkiraan waktu kerja: 1–2 jam setelah VPS baru siap.

## Sebelum hari pindah

- **Pakai Cloudflare bila memungkinkan.** Peralihan cukup dengan mengganti
  IP di Cloudflare dan berlaku dalam hitungan detik. Tanpa Cloudflare,
  perubahan DNS butuh waktu menyebar.
- **Tanpa Cloudflare:** turunkan TTL record A domain menjadi 300 detik
  sehari sebelumnya di pengelola DNS domain.
- Siapkan VPS baru (Ubuntu 22.04 atau 24.04) dengan satu pengguna ber-sudo,
  misalnya `deploy`, yang bisa kamu masuki lewat SSH.

## 1. Salin `.env` dan foto

Dari laptop, di folder proyek (Git Bash):

```bash
LAMA=reformsyndicate@103.179.57.165 KUNCI_LAMA=~/.ssh/orchestrator_deploy BARU=deploy@IP_BARU bash script/vps/salin-data.sh berkas
```

Perhatikan peringatan di akhir. Di server lama sebagian variabel bisa
tersimpan di pm2, bukan di `.env`. Di server baru `.env` harus berisi
`NODE_ENV=production`, `PORT=5003`, `DATABASE_URL`, `SESSION_SECRET`, dan
`ADMIN_PASSWORD`. Tambahkan yang kurang dengan `nano ~/fikar_website/.env`.

## 2. Siapkan VPS baru

Salin skripnya ke VPS baru, lalu jalankan di sana:

```bash
scp script/vps/siapkan-vps.sh deploy@IP_BARU:
```

```bash
ssh -t deploy@IP_BARU 'bash siapkan-vps.sh'
```

Skrip memasang Node 20, pm2, PostgreSQL, nginx, certbot, dan firewall;
membuat database sesuai `DATABASE_URL` di `.env`; dan menulis konfigurasi
nginx beserta header yang dibutuhkan aplikasi. Aman dijalankan ulang.

## 3. Salin database

```bash
LAMA=reformsyndicate@103.179.57.165 KUNCI_LAMA=~/.ssh/orchestrator_deploy BARU=deploy@IP_BARU bash script/vps/salin-data.sh db
```

Di akhir tampil jumlah baris beberapa tabel di VPS baru. Bandingkan dengan
panel admin di situs lama.

## 4. Arahkan deploy ke VPS baru

Buat kunci SSH khusus deploy, pasang di VPS baru, lalu ganti tiga secret
repositori:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_fikar_baru -N "" -C "github-deploy"
```

```bash
ssh-copy-id -i ~/.ssh/deploy_fikar_baru.pub deploy@IP_BARU
```

```bash
gh secret set VPS_HOST --repo FatihSeida/fikar_website --body IP_BARU
```

```bash
gh secret set VPS_USER --repo FatihSeida/fikar_website --body deploy
```

```bash
gh secret set VPS_SSH_KEY --repo FatihSeida/fikar_website < ~/.ssh/deploy_fikar_baru
```

Jalankan deploy tanpa perlu commit baru:

```bash
gh workflow run deploy.yml --repo FatihSeida/fikar_website --ref main
```

Deploy pertama menjalankan `pm2 start`. Setelah hijau, simpan daftar proses
supaya aplikasi menyala lagi bila VPS dinyalakan ulang:

```bash
ssh deploy@IP_BARU 'pm2 save'
```

## 5. Uji sebelum dialihkan

Situs lama masih melayani pengunjung. Uji VPS baru dengan memaksa domain
mengarah ke IP baru hanya untuk perintah ini:

```bash
curl -s -o /dev/null -w "%{http_code}\n" --resolve ahmadzulfikar.com:80:IP_BARU http://ahmadzulfikar.com/
```

Hasil `200` berarti aplikasi, nginx, dan database di VPS baru berjalan.

## 6. Alihkan

1. Salin ulang database supaya kunjungan dan kiriman terakhir ikut pindah
   (ulangi langkah 3).
2. Arahkan domain ke IP baru: ganti IP di Cloudflare, atau ganti record A
   untuk `ahmadzulfikar.com` dan `www` di pengelola DNS.
3. **Tanpa Cloudflare:** pasang sertifikat begitu domain sudah mengarah ke
   IP baru. Sampai langkah ini selesai, HTTPS di VPS baru belum berjalan.

   ```bash
   ssh -t deploy@IP_BARU 'sudo certbot --nginx -d ahmadzulfikar.com -d www.ahmadzulfikar.com --redirect'
   ```

4. Buka situs dan panel admin, lalu pastikan tab Pengunjung mencatat
   kunjungan baru.
5. Biarkan VPS lama menyala beberapa hari sebagai cadangan, lalu matikan
   proses `fikar-website` di sana: `pm2 delete fikar-website && pm2 save`.

## Bila terjadi masalah

Kembalikan domain ke IP lama, dan kembalikan ketiga secret ke nilai lama.
VPS lama belum diubah sama sekali, jadi situs langsung kembali seperti
sebelumnya. Kiriman yang masuk ke VPS baru selama percobaan bisa diambil
dengan `pg_dump` dari sana.

## Dengan Cloudflare di depan

Tambahkan pengaturan ini ke blok `server` di nginx. Tanpanya, semua
pengunjung terlihat berasal dari IP Cloudflare: pembatas per IP akan
menahan seluruh situs dan lokasi pengunjung tidak lagi terbaca.

```nginx
real_ip_header CF-Connecting-IP;
# Daftar lengkap dan terbaru: https://www.cloudflare.com/ips/
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
```

## Memakai lebih dari satu inti CPU

Aplikasi berjalan sebagai satu proses (pm2 mode `fork`) dan memakai satu
inti. Itu cukup untuk ratusan sampai ribuan permintaan per detik. Sebelum
beralih ke mode `cluster`, pindahkan dulu keadaan yang sekarang disimpan di
memori proses ke database atau Redis:

- garam harian penghitung pengunjung unik (`server/routes.ts`); tiap proses
  membuat garamnya sendiri sehingga satu pengunjung terhitung lebih dari sekali,
- hitungan percobaan login dan pembatas kiriman,
- penghitung di `server/perlindungan.ts` dan cache API 30 detik.
