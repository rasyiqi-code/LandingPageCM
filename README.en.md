<div align="center">
  <img src="public/logo.webp" alt="Crediblemark Logo" width="120" />
  
  <h1>Crediblemark</h1>
  <h3>Agency Company Profile Website</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
</div>

---

## 📖 What is Crediblemark?

**Crediblemark** is an agency company profile website — lean, fast, and database-free. All brand and contact configuration lives in environment variables, and portfolio content is fetched directly from the GitHub API.

### 🎯 Features
- 🏠 **Bilingual landing page** (Indonesian & English) with i18n.
- 💼 **Automatic Portfolio**: Public repositories from GitHub (`rasyiqi-code` & `crediblemark-official`).
- 👀 **Smart Portfolio Preview**: Iframe-block detection with Cloudflare proxy rendering fallback.
- 📮 **Contact, Lead & Testimonial Forms**: Delivered via email (Resend) to the admin — no database.
- 📰 **Newsletter**: Subscribers notified by email.
- 📣 **WhatsApp CTA**: All transactional interactions go through WhatsApp.
- 🔍 **SEO**: sitemap.xml, RSS feed, and llms.txt.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| **i18n** | next-intl (en / id) |
| **Email** | Resend |
| **Portfolio** | GitHub API + Cloudflare rendering |
| **Database** | None — static & env-only |

---

## 🚀 Quick Start

### 1. Environment Setup
```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_APP_URL, RESEND_API_KEY, and ADMIN_EMAIL
```

### 2. Install & Run
```bash
bun install
bun dev
```

---

## ⚙️ Environment Configuration

| Variable | Default | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public site URL |
| `RESEND_API_KEY` | — | Resend key to send emails |
| `ADMIN_EMAIL` | `support@crediblemark.com` | Recipient of form/lead/testimonial emails |
| `GITHUB_PAT` | — | Optional GitHub token for rate limits |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` | — | Optional, for portfolio rendering |

Brand values (agency name, logo, phone, contact) have defaults in `lib/server/settings.ts` and can be overridden via env such as `NEXT_PUBLIC_AGENCY_NAME`, `NEXT_PUBLIC_AGENCY_LOGO`, `CONTACT_PHONE`, etc.

---

## 🚢 Deployment

```bash
bun run build && bun run start
```

Or via Docker (using `Dockerfile` with `output: standalone`):
```bash
docker build -t crediblemark .
docker run -p 3000:3000 --env-file .env.local crediblemark
```

---

## ⚖️ License
This project is licensed under the **MIT License**.

---

<div align="center">
  <a href="README.md">Indonesian Version</a> | <a href="DEPLOY.md">Deployment</a> | <a href="mailto:support@crediblemark.com">Support</a>
</div>