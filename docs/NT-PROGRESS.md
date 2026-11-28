# NT progress

## Repository and deployment guard
- Repository: kuquan33333/tu-vi-viet-nam
- Development branch: `feature/nhan-tuong-ai`
- Production project: Cloudflare Pages `tuvivietnam`, canonical domain `https://tuvivietnam.pages.dev`.
- Production branch: `ui/07-branding`; Cloudflare canonical deployment commit: `a9e449ebb224acfa108785bf77decdf74b14715f`, stage success.
- Cloudflare Pages project currently reports `deployments_enabled=false` and `production_deployments_enabled=false`. No deployment or production mutation was performed.
- Preview homepage branch `ui/08-home-preview` remains out of scope and untouched.

## NT-00
### NT-00.1 — baseline build and regression
- Checkpoint commit: `14910dd8e6d6eade8369728805286043ab896ccd`.
- Muse report: `NT-LINUX-REPORT-NT-00.1-14910dd8e6d6eade8369728805286043ab896ccd-20261128-111435.txt`.
- Report UTC: 2026-11-28 11:14:35; exact Git HEAD verified; clean working tree.
- Environment: Linux x86_64, Node v24.22.1, npm 10.9.4.
- Result: `OVERALL_EXIT=0`. npm ci, TypeScript, npm test, individual regression inventory, strict audit 12/12, Triad, Revamp, native Next build, Cloudflare static export build, and static SEO/metadata/redirect/sitemap/robots/OG checks for 103 routes all exited 0.
- npm ci emitted a deprecation warning for node-domexception; install succeeded. No new test failure reported.
- Important variance: repository CI workflows pin Node 22; this first Muse run used Node 24. The code baseline is green on Node 24 but exact Node 22 parity remains to be checked.
- Not included in NT-00.1: interactive Chromium journeys, full UI-6 keyboard/axe cross-browser checks, independent astronomy/calendar audits, Lighthouse thresholds, and actual Cloudflare edge response headers. Do not infer these passed from static build.

### NT-00.2 — extended compatibility and production-edge audit
- Added `scripts/nt-qa-extended.sh`. It creates a disposable detached worktree, requires Node 22, reruns typecheck/regression, performs independent calendar/astronomy/iztro audits, builds static export, and runs Playwright journeys at 360/1280, UI-6 Chromium route shards, Firefox/WebKit compatibility, five-system browser checks, Lighthouse gates, encoded-asset checks, and a read-only production HTTP header capture.
- Pending Muse run against the exact commit containing this script. Do not mark NT-00 closed until the Node 22 run and extended checks have a report; record unsupported physical iPhone/iPad and real camera tests as deferred to NT-03/NT-11.
- Static preparation mutates Next config/metadata and removes unsupported dynamic/API routes. The extended script must run only in its disposable worktree.

## NT-01
- Not started. Research may be prepared, but no NT-01 acceptance is claimed until NT-00.2 closes.
- Deliverables: sourced historical source register; explicit edition/attribution/rights caveats; typed data for 50 glossary entries and 20 original Vietnamese articles; maps for Tam đình, Ngũ quan, 12 facial palaces, Ngũ nhạc, Tứ độc, and Lục phủ; tests for source IDs and data completeness.
- All summaries must be original wording, linked to historical sources, and limited to cultural/historical description. No physiognomic predictions or inference of personality, morality, health, wealth, fertility, longevity, intelligence, ability, identity, or destiny.
- The face-reading twelve-palace map must be explicitly distinguished from the twelve palaces of Zi Wei astrology. Do not combine the two systems.

## Current next action
Muse: run `bash scripts/nt-qa-extended.sh 14910dd8e6d6eade8369728805286043ab896ccd` on Linux after syncing the commit that adds the script. Send the complete TXT, screenshots and JSON artifacts to ChatGPT. ChatGPT will review, fix any new failures, close NT-00, then start NT-01.
