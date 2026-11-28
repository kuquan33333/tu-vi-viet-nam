# NT audit

## NT-00.1 baseline evidence
- Exact tested commit: `14910dd8e6d6eade8369728805286043ab896ccd` on `feature/nhan-tuong-ai`.
- Muse Linux report: `NT-LINUX-REPORT-NT-00.1-14910dd8e6d6eade8369728805286043ab896ccd-20261128-111435.txt`.
- Exact HEAD matched, worktree clean, Linux 7.0.0-44-generic x86_64, Node 24.22.1, npm 10.9.4.
- `npm ci` installed 184 packages; only a deprecation warning for `node-domexception@1.0.0`, exit 0.
- Typecheck, `npm test`, all individual `scripts/regression/*.test.ts`, strict audit (12/12), Triad, Revamp, native build, static Cloudflare build and `check-seo-export.mjs` (103 routes) all exit 0. Report final: `OVERALL_EXIT=0`.
- The first run was interrupted by Muse runtime restart during strict-audit; Muse resumed it in the same disposable worktree. The resumed strict-audit completed 12/12, and all remaining commands exited 0. This is a completed run, not a test failure.
- No browser interaction, Firefox/WebKit compatibility, keyboard/axe, independent astronomy/calendar, Lighthouse, physical camera or iPhone/iPad tests are present in this report.

## NT-00.1 repeat baseline evidence — 2026-11-28
- Exact SHA: `6ae15f66aee6dff575c57732019e136c742425db`, branch `feature/nhan-tuong-ai`; report confirms matching HEAD and clean worktree.
- Source: `NT-LINUX-REPORT-NT-00.1-6ae15f66aee6dff575c57732019e136c742425db-20261128-115617.txt`; report start 2026-11-28T11:56:17Z (18:56:17 GMT+7).
- Linux 7.0.0-44-generic x86_64 GNU/Linux; Node v24.22.1; npm 10.9.4. Install added 184 packages; only recorded deprecation warning is node-domexception@1.0.0. Isolated iztro UTC+7 provider generated with 9 imports; report states original dependencies unchanged.
- Reviewed all 49 EXIT markers (all zero), including 34/34 individual regression files, npm test, typecheck, strict audit 12/12, Triad, Revamp, native build, static preparation/build and export verification. Final `OVERALL_EXIT=0`; zero new failures reported. Native build 109/109 pages, static build 107/107 pages, SEO/metadata/redirects/sitemap/robots/OG 103 routes.
- GitHub compare `14910dd8...6ae15f66`: ahead by 9, behind by 0; changed files confined to three NT documents and the newly added `scripts/nt-qa-extended.sh`. No product source changes. Verified `241977d155329cc6f86f57b81be5e95bcadc72d9` modifies `scripts/nt-qa-extended.sh`, not `scripts/nt-qa-baseline.sh` (correction to the accompanying QA message, not a test failure).
- This is a baseline repeat, not extended QA. Report explicitly states extended browser/astronomy/calendar, real MediaPipe and physical camera tests NOT RUN. Lighthouse and live edge header evidence are also absent. Node 22 is still untested in this checkpoint. NT-00 remains OPEN; NT-00.2 is the next required gate.
- Before running NT-00.2: use Node 22, validate shell syntax, ensure localhost port 4173 is unused (avoid accidentally testing another server), and make sure Playwright system dependencies can be installed with authorized privileges. Do not weaken gates or bypass environment blockers; report them separately.

## Environment and build observations
- CI workflows pin Node 22; Muse NT-00.1 used Node 24.22.1. Node 22 parity is still an explicit gate.
- `scripts/prepare-cloudflare-demo.mjs` mutates `next.config.js`, metadata routes and removes `app/api` plus `app/knowledge/[star]` for static export. Never run it in the primary checkout; use a detached disposable worktree.
- Native build includes dynamic `/api/heming` and `/api/interpret`; static export omits those APIs. The static browser experience must not assume these endpoints exist.
- `scripts/serve-export.mjs` explicitly says it does not reproduce Cloudflare edge headers. Local tests cannot establish production CSP/Permissions-Policy.
- Current `public/_headers` denies camera and microphone globally; CSP includes `script-src 'self' 'unsafe-inline'`, `connect-src 'self'`, and no explicit WASM directive. This is a source inspection finding, not a live edge-header test. NT-10 must make any camera permission route-scoped and keep microphone disabled.
- The QA script sets `NEXT_PUBLIC_SITE_URL=https://tuvivietnam.pages.dev`, matching the verified Cloudflare Pages project domain. Older workflow files still contain `lichvannien-9sv.pages.dev`; treat that as stale QA configuration and do not use it as the current canonical host without owner approval.

## Cloudflare production guard
- Cloudflare Pages project `tuvivietnam`; domain `tuvivietnam.pages.dev`.
- Production branch `ui/07-branding`; canonical deployment commit `a9e449ebb224acfa108785bf77decdf74b14715f`; latest stage `success`.
- Cloudflare reports both `deployments_enabled=false` and `production_deployments_enabled=false`. No deploy was requested or performed.
- The development branch remains separate from production and preview-home work.

## MediaPipe feasibility and privacy gate
- Official Web setup documentation (https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker) supports MediaPipe Tasks in JavaScript/TypeScript with WebAssembly and modern Chrome, Edge, Safari and Firefox browsers. The Face Landmarker documentation describes image, decoded video and live-feed input, 478 normalized 3D landmarks, 52 blendshape coefficients and optional transformation matrices.
- `@mediapipe/tasks-vision` npm currently lists version 1.2.3 and Apache-2.0. This is not sufficient by itself to close licensing for every model bundle or compiled WASM artifact; retain the exact package/model notices and hashes before redistribution.
- Critical privacy finding: Google's current MediaPipe Tasks Privacy Notice (https://developers.google.com/edge/mediapipe/solutions/privacy) says input images/video are processed on-device and not sent to Google, but also says the Tasks APIs send performance/utilization metrics to Google. This conflicts with the project requirement of no analytics or third-party runtime requests unless the current Web SDK can be shown to operate with all outbound telemetry blocked without breaking inference. No opt-out mechanism is assumed.
- NT-02 is blocked from dependency adoption until Muse verifies actual network requests for the exact pinned Web SDK, model and WASM using browser request capture plus restrictive CSP/network blocking. If telemetry cannot be blocked while retaining supported functionality, select another local model/runtime or request explicit owner approval to change the privacy requirement. Do not silently accept metrics or add a consent banner as a substitute.
- Face Landmarker provides geometry/expression outputs, not scientific evidence for personality, health, intelligence, morality, identity or destiny. A 2024 review (https://doi.org/10.1016/j.copsyc.2024.101815) highlights unresolved questions of epistemic validity, practical relevance and social welfare for AI facial inference. The product must not derive or display such inferences.

## NT-00.2 pending evidence
- Node 22 exact parity.
- Browser interactive regression at 360px and 1280px.
- UI-6 Chromium route, keyboard and axe checks; Firefox and WebKit compatibility.
- Five-system browser journeys and encoded asset checks.
- Independent LichTa, Astronomy Engine, Moshier fixture and iztro calendar comparisons.
- Lighthouse SEO >=95, accessibility >=95, best practices >=95, performance >=85 where the existing gate applies; preserve any failures as evidence rather than lowering thresholds.
- Read-only live HTTP headers from `https://tuvivietnam.pages.dev`.
- These checks are pending until Muse provides the NT-00.2 TXT and artifacts.

## NT-01 source and editorial guardrails
- `神相全编` is a composite historical compilation. Digital catalogues attribute it to Chen Tuan with Yuan Zhongche's corrections, while the preface describes collecting several traditions and warns against rigidly treating physiognomic claims as certain. Do not present it as a single uncontested author's work.
- The Qing compendium `欽定古今圖書集成`, Art section volume 632, contains the sections on five officials, five mountains, four rivers, six palaces and three courts. Use original Vietnamese summaries and link to the source; do not reproduce modern copyrighted translations or scans.
- The 12 face palaces are a face-region map, not Zi Wei's astrological twelve houses. Names and region boundaries vary between texts; retain variants and cite them.
- Glossary/article data must cite source IDs. No prediction or assessment of personal character, health, wealth, fertility, longevity, intelligence, competence, morality, identity or fate from facial appearance.
