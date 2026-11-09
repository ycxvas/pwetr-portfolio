// Menerima pesanan dari form di index.html dan meneruskannya ke webhook Discord.
// Webhook disimpan sebagai secret DISCORD_WEBHOOK di Cloudflare, bukan di repo.

const clip = (v, n) => String(v ?? "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }) {
  if (!env.DISCORD_WEBHOOK) return json({ ok: false, error: "belum dikonfigurasi" }, 503);

  // Hanya terima dari situs sendiri.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: "origin ditolak" }, 403);
  }

  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: "data tidak valid" }, 400); }

  // Kolom jebakan untuk bot: manusia tidak mengisinya.
  if (d.website) return json({ ok: true });

  const o = {
    kode: clip(d.kode, 12),
    nama: clip(d.nama, 60),
    jenis: clip(d.jenis, 40),
    halaman: clip(d.halaman, 3),
    tenggat: clip(d.tenggat, 20),
    topik: clip(d.topik, 600),
    kontak: clip(d.kontak, 60),
    estimasi: clip(d.estimasi, 40),
  };
  if (!o.nama || !o.topik || !o.kontak || !o.kode) return json({ ok: false, error: "data kurang" }, 400);

  const res = await fetch(env.DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: "Pesanan Jasa",
      allowed_mentions: { parse: [] }, // cegah @everyone dari input klien
      embeds: [{
        title: `Pesanan baru ${o.kode}`,
        color: 0xff7a45,
        fields: [
          { name: "Nama", value: o.nama, inline: true },
          { name: "Kontak", value: o.kontak, inline: true },
          { name: "Jenis", value: o.jenis || "-", inline: true },
          { name: "Halaman", value: o.halaman || "-", inline: true },
          { name: "Tenggat", value: o.tenggat || "-", inline: true },
          { name: "Estimasi", value: o.estimasi || "-", inline: true },
          { name: "Topik & instruksi", value: o.topik },
        ],
        timestamp: new Date().toISOString(),
      }],
    }),
  });
  return res.ok ? json({ ok: true }) : json({ ok: false, error: "gagal kirim" }, 502);
}
