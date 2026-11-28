# NT progress
- Production verified via Cloudflare: a9e449ebb224acfa108785bf77decdf74b14715f, deployment success.
- Branch: feature/nhan-tuong-ai. Base exactly production; homepage preview isolated.
- NT-00 checkpoint 00.1: repository inventory and QA handoff prepared. Source package uses Next ^16.4.3, React ^19.2.5, TS ^5, npm lockfile; node 22 in CI. No MediaPipe dependency yet.
- Existing security headers deny camera/microphone; CSP script-src self + unsafe-inline; no WASM permission yet. No security changes in this checkpoint.
- Static export preparation mutates next.config.js, metadata and removes unsupported API/dynamic routes. QA must run in disposable worktree, never on developer checkout. Local server does not emulate Cloudflare security headers.
- Existing CI workflows trigger main pushes or PRs, not this branch push; do not open PR/dispatch Actions while quota unavailable.
- Pending: Linux baseline (install, typecheck, all regression inventory, native build and static export + SEO; extended browser/astronomy/calendar checks subsequently as per existing workflows). Previous Lighthouse and focus reports are historical and must be reproduced rather than assumed.
- Next action: Muse run scripts/nt-qa-baseline.sh on this exact checkpoint, send full TXT with SHA and exit codes. ChatGPT review evidence, complete remaining NT-00 checks and proceed NT-01.
- NT-01 through NT-11: not started.
