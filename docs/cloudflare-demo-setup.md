# Cloudflare Pages Demo

This isolated `cloudflare-demo` branch exports a static preview to Cloudflare Pages.

- Static pages and client-side Vietnamese astrology chart calculations are supported.
- AI-powered API endpoints are intentionally excluded from the static demo.
- Production branch `main` remains unchanged.
- Build command: `node scripts/prepare-cloudflare-demo.mjs && NEXT_PUBLIC_SITE_URL=https://lichvannien-9sv.pages.dev npm run build`
- Output directory: `out`
