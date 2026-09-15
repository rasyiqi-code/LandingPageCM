# Crediblemark Deployment Guide

Crediblemark is a lean Next.js (standalone) site without a database. It can be deployed to Vercel, Docker, or any Node/Bun runtime.

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Email (Resend) — required for contact form, leads & newsletters
RESEND_API_KEY="re_your_api_key"
ADMIN_EMAIL="support@crediblemark.com"

# Optional
NEXT_PUBLIC_AGENCY_NAME="Crediblemark"
NEXT_PUBLIC_AGENCY_LOGO="/logo.webp"
CONTACT_PHONE="+6285183131249"
GITHUB_PAT=""
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_API_TOKEN=""
```

## Docker (VPS / Dokploy)

The repository ships a `Dockerfile` using Next.js `output: standalone` (no database, no docker-compose needed).

```bash
docker build -t crediblemark .
docker run -d --name crediblemark \
  -p 3000:3000 \
  --env-file .env.local \
  crediblemark
```

The container serves the app at port 3000. Point your reverse proxy (Nginx/Caddy/Dokploy) to it.

## Verify

Access your configured domain. The application should be running with:
- Landing page at `/`
- Portfolio at `/portfolio` (fetched from GitHub API, cached 30 days)
- Contact/lead/testimonial emails delivered via Resend