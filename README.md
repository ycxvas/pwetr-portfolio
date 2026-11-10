# pwetr-portfolio

Portfolio bergaya "desktop" di browser: ikon, jendela yang bisa digeser, taskbar, dan terminal mini.

## Struktur

- `index.html`: seluruh tampilan dan logika sisi klien (satu file, tanpa build step)
- `functions/api/order.js`: Cloudflare Pages Function yang meneruskan pesanan dari form ke Discord
- `qris.png`: kode QRIS pembayaran (belum ada; tambahkan di root agar tampil di jendela `jasa.md`)

## Deploy (Cloudflare Pages)

1. Hubungkan repo ini ke Cloudflare Pages. Build command dikosongkan, output directory `/`.
2. Tambahkan secret `DISCORD_WEBHOOK` di Settings → Variables and Secrets.
3. Deploy ulang.

Webhook tidak boleh ditaruh di repo. Hanya disimpan sebagai secret di Cloudflare.

## Yang masih perlu diisi

- `qris.png` di root repo
- Tautan GitHub atau demo di tiap kartu proyek
