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
- Status: FIRST RUN FAIL at 2026-11-28 12:08:07 UTC (19:08:07 GMT+7); four gates failed. Report: `NT-LINUX-REPORT-NT-00.2-b1d44db0b4188fda44f0040d4ffd87ef2efbacad-20261128-120807.txt`. Node v22.23.5 / npm 10.9.9. Do not mark NT-00 closed until the complete extended suite passes on a remediation SHA. Physical iPhone/iPad and real camera tests remain deferred to NT-03/NT-11.
- Root causes and remediation are recorded in `NT-AUDIT.md`: token audit reads the tracked Git object after static export; Firefox/WebKit tests use real keyboard Tab focus; mobile header LCP background is CSS-only; Footer and chart result-only modules are moved out of the initial client bundle. No test threshold was lowered.
- Static preparation mutates Next config/metadata and removes unsupported dynamic/API routes. The extended script must run only in its disposable worktree.


### NT-00.2 — second extended Linux QA (FAIL) — 2026-11-28
- Tested exact SHA: `c80bf9f15bf5f4b42fa96441d8866bdef6811dfe`; Node v22.23.5 / npm 10.9.9; report `NT-LINUX-REPORT-NT-00.2-c80bf9f15bf5f4b42fa96441d8866bdef6811dfe-20261128-131800.txt`; `OVERALL_EXIT=1`.
- Three previous failures are resolved: token audit PASS; Firefox and WebKit each 19/19; chart Lighthouse performance 0.87. Remaining failures: `npm test` / `seo.test.ts` D3/D4 checks for `<Header path=` in `AppChrome.tsx` after the header moved to `RouteChrome`; Lighthouse homepage performance 0.73 and calendar 0.81 (threshold remains >=0.85). SEO, accessibility and best-practices scores were 100. Other listed gates passed, including Node 22, strict audit 12/12, Triad, Revamp, native/static build, independent astronomy/calendar checks, Chromium journeys and live read-only edge headers.
- Lighthouse evidence: homepage LCP 4.01s with ~3.21s render delay; long tasks include 575ms in shared chunk `3794-c6c45223bf40da11.js` and document tasks 445ms/277ms. Calendar LCP 3.67s with ~3.22s render delay; document task 482ms and shared chunk task 359ms. Calendar DOM contained 584 elements, including 151 options in the year selector. The 151-year calendar cache was serialized into the client component on first load, while the homepage calendar preview was also a client component despite having no user interaction.
- Remediation pushed after this report: update the SEO regression to assert that Header is rendered by `RouteChrome` and Footer is passed through `AppChrome`; convert the static homepage calendar preview to a server component; limit the calendar route's initial serialized cache to the adjacent three years and fetch the full generated static `public/calendar-data.json` only when navigating outside that range; generate that file in both `predev` and `prebuild`, and ignore the generated artifact. Add regression coverage for the lazy-data/server-preview contract. Lighthouse gates are unchanged.
- Remediation commit chain: `98cdb064d20ff5d2c33507eced81c3e0eec12061`, `9962f47ec56d6fd0de6414f66bb26bf8f6d3bf71`, `a4730efb05fa8d75e8c7a42a02cbce44b88348f4`, `75ade7f81370904032b7d92b412ec73a704f403b`, `2070c1a186a71ecd7e2b991577723c5294ce0e06`, `39283ffe343ad377a735e5dfec7b7f8d04fcda9f`, `1cec2813dc49dbb08d7b0241a87fea77816f2101`, `4fea524dcb428d9b80593f5ae3c2f15e6004891e`, `fb2eefd4669c4093760abbd945b822d619387d58`, `3691caa2950439b0650d0686707293cb8543c2aa`, `fcc60b034ac6d64b87ef951096239884727f40bf`.
- Status: remediation committed to `feature/nhan-tuong-ai`; full Node 22 extended QA has NOT YET been rerun; the runner now enforces three passing chart measurements. NT-00.2 remains OPEN. No production deployment or mutation was performed.


### NT-00.2 — third extended Linux QA (FAIL; chart performance only) — 2026-11-28
- Tested exact SHA: `e2913f95e601ef4664ab776f74f942abab5b053d`; report `NT-LINUX-REPORT-NT-00.2-e2913f95e601ef4664ab776f74f942abab5b053d-20261128-142657.txt`; Linux x86_64, Node v22.23.5 / npm 10.9.9; exact HEAD and clean worktree; `OVERALL_EXIT=1`.
- Regression, typecheck, strict audit 12/12, Triad, Revamp, build, independent astronomy/calendar, Chromium journeys, UI-6 token audit, Firefox 19/19, WebKit 19/19, and live read-only production edge headers all PASS. Lighthouse SEO/accessibility/best-practices are 100; home performance 0.85 and calendar 0.88 pass; chart performance 0.75 fails the unchanged 0.85 gate. Chart CLS is 0.000056.
- Chart Lighthouse evidence from `qa-artifacts/lighthouse/chart.json`: LCP 3.56s; LCP render delay 3.103s (87%), TTFB 455ms, no LCP resource load delay/time; TBT 610ms; main-thread work 2.6s (script evaluation 1.110s, style/layout 662ms, script parse/compile 230ms); 9 long tasks, including 468ms in shared chunk `3794-c6c45223bf40da11.js`, 316ms on `/chart`, and 143ms parsing chunk `8500-63a4afbeacab3b52.js`. The shared chunk is 60.7KB with 21.3KB unused on this route. Chart DOM has 463 elements, so excessive DOM is not the primary issue.
- Source tracing: `components/BirthForm.tsx` eagerly imported runtime functions from `lib/ziwei/legacy-birthplaces.ts`. That module eagerly imports `legacy-birthplaces.generated.ts` (20.9KB) and `district-reference.generated.ts` (34.1KB). Those two datasets total ~55KB and support historical district lookup/search and reference coordinates, which are not required for the initial empty birth form. This is consistent with the Lighthouse long task and shared initial chunk. The LCP element is the static chart intro paragraph; its 3.1s render delay, rather than image discovery or server response, confirms main-thread/hydration work is the priority.
- Remediation pushed after this report: change the large birthplace module dependency to a type-only import; dynamically import the module only after the user selects a Vietnamese province or enters a place-search query; use the existing current-province city list while the deferred module loads, then restore legacy districts/reference metadata; preserve the special Quảng Trị historical north/south resolution and do not load the dataset for foreign birth entry. Add regression tests that forbid runtime static imports, require deferred search/city lookup, and verify that the QA runner collects three independent chart Lighthouse measurements and requires all three to remain >=0.85. No calculations, province/district data, location matching, or acceptance thresholds are changed.
- Remediation commits: `001994268c6dbf4d5545d6d03c2c3018aa0bec17`, `42a64a4527a9b52f9a68b27c87fc0cd6334a5c31`, `aa1ba0aac553892c99bdbabf0bd8d8a26f814649`, `27e52d9e72f7679ac528331e9dfcf4042529be79`, `867c9352803c3cd9e0729b5a4d4d9cc6c24a7291`, `16946c03ba8a32e81f8c417d6e3e13792545b6e1`, `384a799737b4023ff006a5e00d2eb864479999f3`, `03c78f479a3201de89fabe22027c83d39f29f0d4`, `f40eab8c16cca4e7a4901099ad31032226dc9171`.
- Status: code and regression guard committed to `feature/nhan-tuong-ai`; full Node 22 extended QA has NOT YET been rerun. NT-00.2 remains OPEN. No production deployment or mutation was performed.

## NT-01
- Not started. Research may be prepared, but no NT-01 acceptance is claimed until NT-00.2 closes.
- Deliverables: sourced historical source register; explicit edition/attribution/rights caveats; typed data for 50 glossary entries and 20 original Vietnamese articles; maps for Tam đình, Ngũ quan, 12 facial palaces, Ngũ nhạc, Tứ độc, and Lục phủ; tests for source IDs and data completeness.
- All summaries must be original wording, linked to historical sources, and limited to cultural/historical description. No physiognomic predictions or inference of personality, morality, health, wealth, fertility, longevity, intelligence, ability, identity, or destiny.
- The face-reading twelve-palace map must be explicitly distinguished from the twelve palaces of Zi Wei astrology. Do not combine the two systems.

## Current next action
- **NT-00.2 remains the only active checkpoint.** Muse must fetch the latest remediation HEAD, verify exact HEAD and clean worktree, use Node 22, then rerun the complete extended QA. Do not run NT-00.1 again and do not begin NT-00.3/NT-01.
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
