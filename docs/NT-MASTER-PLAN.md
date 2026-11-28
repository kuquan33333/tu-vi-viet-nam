# NT — Nhân Tướng Học AI

## Project contract
- Repository: `kuquan33333/tu-vi-viet-nam`.
- Production baseline: `a9e449ebb224acfa108785bf77decdf74b14715f`, production branch `ui/07-branding`, canonical Cloudflare domain `https://tuvivietnam.pages.dev`.
- Development branch: `feature/nhan-tuong-ai`.
- Preserve `ui/08-home-preview`, production, current Zi Wei/calendar engines and existing routes. No PR, merge, Actions dispatch or deployment until owner approval. GitHub Actions quota is unavailable; Muse supplies Linux QA evidence.
- ChatGPT writes product code, tests, docs, commits and pushes. Muse is read-only QA/coordinator and must never modify product source, commit, push, merge or deploy.

## Non-negotiable product boundaries
1. Build a Vietnamese cultural/historical atlas and a local geometry tool, not an oracle or a psychological/medical classifier.
2. Never infer or display personality, morality, intelligence, health, disease, wealth, poverty, fertility, longevity, professional ability, criminality, identity, protected traits or destiny from facial appearance.
3. Keep face geometry, historical physiognomy text, independently entered Zi Wei birth data and I Ching casting separate. The face-reading twelve palaces are not the twelve houses of Zi Wei astrology.
4. Camera and image processing must be explicit opt-in, on-device, no upload, no face persistence, no image logging, no third-party runtime requests and no automatic camera activation. Stop tracks on exit/background. Export excludes photographs by default.
5. Adult self-use only for face capture. Do not analyse third parties without informed permission. Do not use face data for consequential decisions.
6. Verify licenses for SDK, model, WASM and all content separately. No copying modern translations or copyrighted diagrams.
7. No deployment or production changes in any NT checkpoint.

## NT-00 — baseline, architecture and QA contract
### 00.1 — repository baseline
- Confirm production deployment SHA, production branch/domain, deployment state and development branch isolation.
- Inventory package/lockfile, Node/npm versions, routes, build modes, headers/CSP/Permissions-Policy, static export preparation, existing browser scripts and regression suites.
- Run npm ci, typecheck, npm test, individual regression inventory, strict audit, Triad, Revamp, native build, static export build and static SEO metadata checks.
- Record exact SHA, environment, command, exit code, known failures and route count. Never claim an unrun test passed.

### 00.2 — extended runtime and browser baseline
- Re-run under Node 22 to match CI.
- Run independent calendar/astronomy audits: pinned LichTa 2.2.1 hash check, Astronomy Engine 2.1.19, Moshier fixtures and isolated iztro 2.6.1 adapter audit. Preserve disagreements; do not assume one approximate model is authoritative.
- Build static export in a detached worktree; run local Pages-style server and encoded-asset checks.
- Run Playwright interaction journeys at 360px/1280px, v4 theme/axe checks, five-system journeys, UI-6 all-route Chromium shards, Firefox/WebKit compatibility and screenshots.
- Run Lighthouse using existing gates: SEO >=95, accessibility >=95, best practices >=95, performance >=85 where applicable; CLS <0.1. Do not lower thresholds to make QA green.
- Capture actual production HTTP headers from the verified domain. Local server is not evidence for Cloudflare edge headers.
- Physical iPhone/iPad camera tests are deferred to NT-03/NT-11, not falsely marked complete.

### 00.3 — baseline closeout
- Reconcile every result with prior audit history, distinguish current failure from old/deferred failure and environment blocker.
- Record all remaining risks and establish reproducible QA scripts.
- NT-00 closes only after Node 22 and extended required checks are reviewed. No product feature changes are required to close the baseline.

## NT-01 — source-grounded historical knowledge
### 01.1 — source register and edition audit
- Register primary historical sources and modern scholarly context with stable URLs, titles, attributions, edition/compilation notes and rights notes.
- Treat `神相全编` as a composite text: digital catalogues attribute it to Chen Tuan and Yuan Zhongche's correction, while its preface describes a compilation of several traditions. Do not state an uncontested author or date.
- Use `欽定古今圖書集成`, Art section vol. 632, to cross-check five officials, five mountains, four rivers, six palaces and three courts.
- Use scholarly work on AI facial inference to explain epistemic limits. Link-only use for copyrighted modern scholarship.
- Original Vietnamese summaries only. No bulk copying, scans, modern translations or unlicensed diagrams.

### 01.2 — terminology and map normalization
- Document Tam đình (upper/middle/lower face) and preserve alternate boundary definitions found in the texts.
- Document Ngũ quan (ear, eyebrow, eye, nose, mouth) and their five historical official names.
- Document 12 face palaces with their names and described regions. Preserve variants (e.g. 男女/子女, 妻妾/夫妻) and mark overlaps/ambiguities.
- Document Ngũ nhạc (forehead, chin, nose, left/right cheek), Tứ độc (ear, eyes, mouth, nose) and Lục phủ (three paired groups).
- Distinguish every face map from Zi Wei's astrological twelve houses. No mapping from one system to the other.

### 01.3 — glossary
- Deliver at least 50 Vietnamese/Hán-Việt glossary entries.
- Every entry must have a stable ID, definition in original wording, category, source IDs, historical variation/ambiguity note where relevant and a clear non-predictive scope.
- No unsupported anatomical precision; label symbolic regions as historical conventions.

### 01.4 — educational articles
- Deliver at least 20 original Vietnamese articles, each with stable ID, title, summary, body, source IDs and editorial boundary.
- Cover textual history, Tam đình, Ngũ quan, Ngũ nhạc, Tứ độc, Lục phủ, the twelve face palaces and each individual palace.
- Explain that terms such as Mệnh, Tài bạch, Tật ách, Quan lộc and Phúc đức are historical labels, not validated predictions.

### 01.5 — rights, editorial and test gate
- Maintain source register and license notes.
- Every article/glossary entry references known source IDs.
- No unreferenced historical claims, no direct reuse of modern copyrighted translation and no prediction.
- Add automated tests for >=50 glossary entries, >=20 articles, unique IDs, valid source references, all required concept groups, twelve distinct face-palace entries and separation from Zi Wei.
- NT-01 acceptance: all checks pass and owner can inspect the source register. User-facing atlas UI is implemented later in NT-06.

## NT-02 — local Face Landmarker runtime
- Evaluate exact `@mediapipe/tasks-vision` version, model card, Apache-2.0 notices, package/WASM/model hashes and static asset sizes.
- Official Face Landmarker docs describe 478 normalized 3D landmarks, 52 blendshape scores, optional transformation matrices and image/video/live input.
- CRITICAL PRIVACY GATE: Google's current Tasks privacy notice reports performance/utilization metrics to Google. Verify exact Web SDK network behaviour. Require zero outbound runtime requests (including metrics) under browser request capture and restrictive CSP while inference still works. If this cannot be demonstrated, choose another local runtime/model or obtain explicit owner approval to revise privacy requirements. Do not assume self-hosting automatically disables telemetry.
- Self-host model/WASM, lazy-load, worker, GPU/CPU fallback, lifecycle/dispose. No third-party CDN or model fetch at runtime.
- Real inference required; no mocked success. No asset >25 MiB per Pages file. Test malformed and unsupported inputs.

## NT-03 — consent, camera and image input
- Explicit camera consent, front/back camera and webcam, manual capture, opt-in auto capture, image upload JPEG/PNG/WebP, rotation/retake and HEIC compatibility investigation.
- Denial fallback and no-camera browsing. Stop media tracks on exit/background/navigation. No microphone.

## NT-04 — image quality
- Detect zero/multiple faces, size, illumination, blur, pose, occlusion and stability.
- Provide neutral quality feedback only; do not label personal attractiveness, health or identity.

## NT-05 — geometric feature extraction
- Document landmark indices, coordinate system, normalization, mirror correction, head pose and uncertainty.
- Calculate relative eye/nose/mouth/chin geometry and Tam đình ratios only when quality permits.
- Hairline must be manually confirmed; do not infer hairline, ears or marks when landmarks cannot observe them.
- No absolute physical dimensions without calibration. No personality/health/fate interpretation.

## NT-06 — interactive atlas
- SVG diagrams for all five groups, accessible selection, Vietnamese/Hán-Việt search, citations and overlay toggles.
- Usable without camera. Keep historical map overlays separate from measured geometry.

## NT-07 — report and export
- Descriptive geometric report, uncertainty, method explanations, overlays, PNG/print/PDF and reset.
- Local export; photograph excluded by default. Reuse existing print/html2canvas only after audit.

## NT-08 — independent Zi Wei and I Ching links
- Reuse existing 64 hexagrams, coin casting, moving lines and transformed hexagram without changing their algorithms.
- Zi Wei uses separately entered birth data only. Face geometry must never affect either result.

## NT-09 — responsive product UI
- PC/iPad/mobile; widths 320–1920; 44px touch targets; keyboard focus; parchment/gold visual language consistent with design system.
- No sticky overlay, accidental underlines or horizontal overflow. Keep homepage preview untouched.

## NT-10 — privacy, security, performance and SEO
- Narrow route-scoped camera permission, no microphone, CSP/WASM/worker directives, 10 MB upload limit and ~1280px processing size, cleanup and lazy cache.
- No image transmission, no face persistence, no logs/analytics, no external runtime requests.
- Update privacy/terms and route metadata/sitemap/tool menu only after actual behavior is verified. No broad unsafe-eval and no homepage AI payload.

## NT-11 — final QA and release gate
- Geometry invariants, real model, camera lifecycle, malformed images, privacy/network, Chromium/Firefox/WebKit, static export, full regression, Lighthouse, screenshots and physical iPhone/iPad.
- Existing gates retained (performance >=85 where applicable, accessibility >=95); physical device results reported separately.
- Preview only after owner approval. Production deployment requires separate explicit approval.

## Workflow and checkpoint protocol
- Every checkpoint: inspect branch HEAD and source scope, implement code, add tests, update `NT-PROGRESS.md` and `NT-AUDIT.md`, commit and push to `feature/nhan-tuong-ai` only.
- Muse tests the exact full SHA in a disposable detached worktree; report commands, exit codes, logs, screenshots and artifacts in TXT.
- Muse is read-only: no product edits, commits, pushes, PRs, merges, workflow dispatches or deployment.
- Never hide baseline failures, delete tests, lower thresholds or advance past a failed required gate without fixing it or obtaining explicit owner approval for a documented independent blocker.
