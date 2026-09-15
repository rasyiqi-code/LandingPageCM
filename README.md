<div align="center">
  <img src="public/logo.webp" alt="Crediblemark Logo" width="120" />
  
  <h1>Crediblemark</h1>
  <h3>Website Company Profile Agency</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
</div>

---

## 📖 Apa itu Crediblemark?

**Crediblemark** adalah website company profile untuk agency — langsing, cepat, dan tanpa database. Semua konfigurasi brand & kontak tersimpan di environment variable, sedangkan konten portofolio diambil langsung dari GitHub API.

### 🎯 Fitur
- 🏠 **Landing Page** bilingual (Indonesia & Inggris) dengan i18n.
- 💼 **Portfolio Otomatis**: Repositori publik dari GitHub (`rasyiqi-code` & `crediblemark-official`).
- 👀 **Smart Portfolio Preview**: Deteksi blokir iframe dengan fallback proxy rendering (Cloudflare).
- 📮 **Form Kontak, Lead & Testimoni**: Dikirim via email (Resend) ke admin — tanpa database.
- 📰 **Newsletter**: Subscriber dinotifikasi lewat email.
- 📣 **WhatsApp CTA**: Semua interaksi transaksi mengarah ke WhatsApp.
- 🔍 **SEO**: sitemap.xml, RSS feed, dan llms.txt.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| **i18n** | next-intl (en / id) |
| **Email** | Resend |
| **Portfolio** | GitHub API + Cloudflare rendering |
| **Database** | Tidak ada — statis & env-only |

---

## 🚀 Panduan Cepat (Quick Start)

### 1. Persiapan Environment
```bash
cp .env.example .env.local
# Isi NEXT_PUBLIC_APP_URL, RESEND_API_KEY, dan ADMIN_EMAIL
```

### 2. Instalasi & Setup
```bash
bun install
bun dev
```

---

## ⚙️ Konfigurasi via Environment

| Variabel | Default | Keterangan |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | URL publik situs |
| `RESEND_API_KEY` | — | Key Resend untuk kirim email |
| `ADMIN_EMAIL` | `support@crediblemark.com` | Penerima email form/lead/testimoni |
| `GITHUB_PAT` | — | Opsional, token GitHub untuk rate limit |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` | — | Opsional, untuk render portfolio |

Nilai brand (nama agency, logo, telepon, kontak) memiliki default di `lib/server/settings.ts` dan dapat dioverride via env seperti `NEXT_PUBLIC_AGENCY_NAME`, `NEXT_PUBLIC_AGENCY_LOGO`, `CONTACT_PHONE`, dst.

---

## 🚢 Deployment

```bash
bun run build && bun run start
```

Atau via Docker (menggunakan `Dockerfile` dengan `output: standalone`):
```bash
docker build -t crediblemark .
docker run -p 3000:3000 --env-file .env.local crediblemark
```

---

## ⚖️ Lisensi
Proyek ini dilisensikan di bawah **Lisensi MIT**.

---

<div align="center">
  <a href="README.en.md">English Version</a> | <a href="DEPLOY.md">Deployment</a> | <a href="mailto:support@crediblemark.com">Support</a>
</div>