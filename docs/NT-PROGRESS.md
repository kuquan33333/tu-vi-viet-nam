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
- Tested commit: `14910dd8e6d6eade8369728805286043ab896ccd`.
- Muse report: `NT-LINUX-REPORT-NT-00.1-14910dd8e6d6eade8369728805286043ab896ccd-20261128-111435.txt`.
- Report UTC: 2026-11-28 11:14:35; exact Git HEAD verified; clean working tree.
- Environment: Linux x86_64, Node v24.22.1, npm 10.9.4.
- Result: `OVERALL_EXIT=0`. npm ci, TypeScript, npm test, individual regression inventory, strict audit 12/12, Triad, Revamp, native Next build, Cloudflare static export build, and static SEO/metadata/redirect/sitemap/robots/OG checks for 103 routes all exited 0.
- npm ci emitted a deprecation warning for node-domexception; install succeeded. No new test failure reported.
- Important variance: repository CI workflows pin Node 22; this first Muse run used Node 24. The code baseline is green on Node 24 but exact Node 22 parity remains to be checked.
- Not included in NT-00.1: interactive Chromium journeys, full UI-6 keyboard/axe cross-browser checks, independent astronomy/calendar audits, Lighthouse thresholds, and actual Cloudflare edge response headers. Do not infer these passed from static build.

### NT-00.1 — repeat baseline on updated HEAD (PASS)
- Tested SHA: `6ae15f66aee6dff575c57732019e136c742425db` (exact detached HEAD matched; clean working tree).
- Muse report: `NT-LINUX-REPORT-NT-00.1-6ae15f66aee6dff575c57732019e136c742425db-20261128-115617.txt`.
- Report start: 2026-11-28 11:56:17 UTC (18:56:17 GMT+7). Linux 7.0.0-44-generic x86_64, Node v24.22.1, npm 10.9.4.
- Reviewed complete report: `OVERALL_EXIT=0`; all 49 recorded EXIT markers are zero. npm ci (184 packages; node-domexception@1.0.0 deprecation warning only), typecheck, npm test, all 34 individual regression files, strict audit 12/12, Triad and Revamp passed.
- Native build generated 109/109 pages; static build generated 107/107 pages; metadata/SEO/redirects/sitemap/robots/OG verification passed for 103 routes.
- GitHub comparison against `14910dd8e6d6eade8369728805286043ab896ccd`: 9 commits ahead, 0 behind; only `docs/NT-AUDIT.md`, `docs/NT-MASTER-PLAN.md`, `docs/NT-PROGRESS.md` and `scripts/nt-qa-extended.sh` changed. No product code changed. The mktemp suffix fix `241977d155329cc6f86f57b81be5e95bcadc72d9` affected the extended runner, not the baseline runner.
- NT-00.1 remains PASS on Node 24, with zero new failures. Node 22 parity and all NT-00.2 extended gates are NOT RUN in this report. No third baseline-only run is required; proceed directly to NT-00.2 on Node 22 after preflight.

### NT-00.1 — third baseline confirmation (PASS)
- Tested exact SHA: `b1d44db0b4188fda44f0040d4ffd87ef2efbacad`; matching HEAD and clean worktree.
- Muse report: `NT-LINUX-REPORT-NT-00.1-b1d44db0b4188fda44f0040d4ffd87ef2efbacad-20261128-120647.txt`; start 2026-11-28T12:06:47Z (19:06:47 GMT+7).
- Linux 7.0.0-44-generic x86_64, Node v24.22.1, npm 10.9.4. npm ci installed 184 packages, deprecation warning for node-domexception only.
- Complete report reviewed: 49/49 EXIT markers zero, 34/34 individual regression files, strict audit 12/12, npm test/typecheck/Triad/Revamp PASS; native build 109/109 pages, static build 107/107 pages, metadata/SEO/redirect/sitemap/robots/OG 103 routes PASS; OVERALL_EXIT=0, zero new failures.
- GitHub compare 6ae15f66...b1d44db0 confirms only NT-PROGRESS.md and NT-AUDIT.md changed. Product and QA runner unchanged.
- Extended browser/astronomy/calendar and physical camera explicitly NOT RUN. No Node 22 parity, Lighthouse or live edge evidence. NT-00.2 remains pending.

### NT-00.2 — extended compatibility and production-edge audit
- QA runner: `scripts/nt-qa-extended.sh`.
- Latest runner commit: `241977d155329cc6f86f57b81be5e95bcadc72d9`.
- The runner creates a disposable detached worktree, requires Node 22, reruns typecheck/regression, performs independent calendar/astronomy/iztro audits, builds static export, runs Playwright journeys at 360/1280, UI-6 Chromium route shards, Firefox/WebKit compatibility, five-system browser checks, Lighthouse gates, encoded-asset checks and a read-only production HTTP header capture.
- It installs Playwright browsers before launching tests, runs the encoded-asset check after the static server is ready, and exports screenshots/JSON evidence as a separate TAR.GZ bundle. Static server and edge-header logs are also preserved outside the disposable worktree.
- Status: NOT RUN as of the 19:06:47 GMT+7 baseline repeat; pending Muse execution on Node 22. Do not mark NT-00 closed until Node 22 and extended checks have a reviewed evidence report. Physical iPhone/iPad and real camera tests remain deferred to NT-03/NT-11.
- Static preparation mutates Next config/metadata and removes unsupported dynamic/API routes. The extended script must run only in its disposable worktree.

## NT-01
- Not started. Research may be prepared, but no NT-01 acceptance is claimed until NT-00.2 closes.
- Deliverables: sourced historical source register; explicit edition/attribution/rights caveats; typed data for 50 glossary entries and 20 original Vietnamese articles; maps for Tam đình, Ngũ quan, 12 facial palaces, Ngũ nhạc, Tứ độc, and Lục phủ; tests for source IDs and data completeness.
- All summaries must be original wording, linked to historical sources, and limited to cultural/historical description. No physiognomic predictions or inference of personality, morality, health, wealth, fertility, longevity, intelligence, ability, identity, or destiny.
- The face-reading twelve-palace map must be explicitly distinguished from the twelve palaces of Zi Wei astrology. Do not combine the two systems.

## Current next action
- **Coordinator routing rule:** NT-00.1 is accepted on Node 24 and must not be run again solely because documentation/QA evidence commits advance HEAD. Dispatch the pending checkpoint named in Current next action, not the last completed checkpoint. For the next run use only `scripts/nt-qa-extended.sh` under Node 22. If Node 22 or required browser/system dependencies cannot be prepared, report BLOCKED with actual error; do not substitute Node 24 baseline. A docs-only evidence commit does not itself request another QA run. Preserve exact tested SHA in every report.

Muse: select Node 22 first (for example, `nvm use 22` if installed), check that port 4173 is free and Playwright system dependencies can be installed with authorized privileges, then fetch the latest branch head and run NT-00.2 against that exact SHA. Do not run another NT-00.1-only pass. This instruction remains active across documentation-only commits.

```bash
git fetch origin feature/nhan-tuong-ai
git checkout feature/nhan-tuong-ai
git pull --ff-only origin feature/nhan-tuong-ai
QA_SHA=$(git rev-parse HEAD)
echo "Testing SHA: $QA_SHA"
node --version  # must be v22.x
npm --version
bash -n scripts/nt-qa-extended.sh && bash scripts/nt-qa-extended.sh "$QA_SHA"
```

Send the complete TXT plus the emitted `NT-ARTIFACTS-*.tar.gz`, `NT-EDGE-HEADERS-*.txt` and `NT-STATIC-SERVER-*.log` to ChatGPT. ChatGPT will review the evidence, fix any failures, close NT-00, then begin NT-01. Do not run GitHub Actions, push, merge or deploy.
