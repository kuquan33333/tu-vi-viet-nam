# Zi Wei Dou Shu Vietnam — research tools and cultural library

English documentation for the Vietnamese [fork](https://github.com/kuquan33333/tu-vi-viet-nam), based on [naot7/tu-vi-viet-nam](https://github.com/naot7/tu-vi-viet-nam).

**Live web app:** https://lichvannien-9sv.pages.dev/  
**Deployed branch:** [revamp-v2](https://github.com/kuquan33333/tu-vi-viet-nam/tree/revamp-v2) (not \`main\`).  
**Four-phase technical audit (Vietnamese):** [docs/audit-four-phases-2026-11-24.md](docs/audit-four-phases-2026-11-24.md).  
**Vietnamese README:** [README.md](README.md).

The site is a **cultural and historical astrology research interface**, not a scientifically validated forecasting service. Its medical-history module is for education only, not diagnosis or treatment.

## What the static Cloudflare Pages build actually includes

| Module | Available | Important limitations |
|---|---|---|
| Chart (/chart) | 12-palace Zi Wei Dou Shu calculation, star explanations, multiple time views, optional 12 birth-hour possibilities, A4 printing | Results depend on the chosen traditional method, dates, longitude and clock conventions |
| Two-chart comparison (/hop-ban) | Offline 12-palace structural comparison using saved profiles or new birth data | Not a compatibility score or relationship prediction |
| Profiles (/ho-so) | Up to 30 browser-local records, JSON import/export, delete and optional PIN-based Web Crypto encryption | JSON exports are **unencrypted**; no cloud sync or PIN recovery |
| Vietnamese calendar (/lich-van-nien) | Vietnamese UTC+7 solar/lunar dates for 1900–2050, Can Chi, public/traditional dates, 24 solar terms, A4 print | Near-midnight historical boundaries remain uncertain; no inferred annual days off |
| Tian Ji (/thien-ky) | 64 I Ching hexagrams, Chinese line texts with source notes, casting tool and basic Qimen earth plate | Vietnamese source-cleared translation is incomplete; **not** a complete time-based Qimen engine |
| Di Ji (/dia-ky) | 24-direction compass, Eight Mansions and site checklist | No complete GIS or Flying Star geomancy engine |
| Ren Ji (/nhan-ky) | 16 introductory articles, 14 meridians, 361 point codes, limited illustration and optional third-party 3D link | Not a verified medical atlas or full licensed classical text |
| Library (/library) | 21 chapters across three collections and text search | Not a claim to every full edition |
| Knowledge (/knowledge) | Introductory reference for 14 major stars | The original 182 dynamic topic pages are **excluded** from the static Pages export |

**AI server routes are not deployed** on Cloudflare Pages static export. The chart and comparison do not require AI APIs. Some optional third-party embedded resources require an external connection.

### Vietnamese calendar and legacy charts

New charts use the documented fixed UTC+7 Vietnamese lunar-calendar provider within 1900–2050. Previously saved charts marked \`legacy-cn\` retain their original method unless the user intentionally makes a new chart. District longitude points are approximations, not precise birth coordinates. See [methodology](docs/methodology.md).

## Development

Use Node.js 22 and npm:

\`\`\`bash
git clone https://github.com/kuquan33333/tu-vi-viet-nam.git
cd tu-vi-viet-nam
git checkout revamp-v2
npm ci
npm run typecheck
npm test
npm run dev
\`\`\`

Visit http://localhost:3000 to use the development server.

Static Pages build (use a separate build checkout since the preparation script modifies Next.js configuration and removes server-only route directories):

\`\`\`bash
npx tsx scripts/test-triad.ts
npx tsx scripts/test-revamp.ts
node scripts/prepare-cloudflare-demo.mjs
NEXT_PUBLIC_SITE_URL=https://lichvannien-9sv.pages.dev npm run build
\`\`\`

Outputs static assets to \`out/\`. For automated validation see \`.github/workflows/ci.yml\`, \`.github/workflows/seo.yml\` and \`scripts/regression/\`. QA Lighthouse is not the same as in-the-field iOS/Android performance.

## Credits and licensing

The upstream code was authored and localized by [naot7](https://github.com/naot7), and uses projects including [iztro](https://github.com/SylarLong/iztro) and [lunar-javascript](https://github.com/6tail/lunar-javascript). Additional public sources and their licenses are documented in [docs/triad-implementation.md](docs/triad-implementation.md).

The repository's *own source code* is published under [MIT](LICENSE); imported datasets, books, artwork and remote applications have their **own licenses**. In particular, files under [docs/tianji-ziwei](docs/tianji-ziwei/LICENSE.md) state **CC BY-NC-SA 4.0**, not MIT. Their commercial re-use should not be assumed. The [I Ching source record](docs/licenses/yijing-data.txt) identifies the MIT dataset used for hexagram transcriptions, without claiming a validated complete Vietnamese translation.
