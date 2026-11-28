#!/usr/bin/env bash
# Linux QA only. Run in a clone of the repository, no push or workflow dispatch.
set -u
set -o pipefail
root=$(git rev-parse --show-toplevel) || exit 2
sha=$(git rev-parse "${1:-HEAD}^{commit}") || exit 2
report_dir="${2:-$HOME/nt-qa-reports}"
mkdir -p "$report_dir" || exit 2
report_dir=$(cd "$report_dir" && pwd -P) || exit 2
stamp=$(date -u +%Y%m%d-%H%M%S)
report=$(mktemp "$report_dir/NT-LINUX-${sha:0:12}-$stamp-XXXXXX.txt") || exit 2
work=$(mktemp -d "${TMPDIR:-/tmp}/nt-qa.XXXXXX") || exit 2
git -C "$root" worktree add --detach "$work" "$sha" || exit 2
# Preserve report outside temporary checkout. Remove only our own worktree.
cleanup(){ cd "$root"; git -C "$root" worktree remove --force "$work" >/dev/null 2>&1 || printf 'QA worktree retained: %s\n' "$work" >&2; }
trap cleanup EXIT
exec > >(tee "$report") 2>&1
cd "$work" || exit 2
export NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://tuvivietnam.pages.dev
failed=0
run(){ local label="$1"; shift; printf '\n=== %s ===\n' "$label"; printf 'COMMAND:'; printf ' %q' "$@"; printf '\n'; "$@"; local rc=$?; printf 'EXIT [%s]=%s\n' "$label" "$rc"; if ((rc!=0)); then failed=1; fi; return "$rc"; }
printf 'NT baseline QA\nUTC: %s\nSHA: %s\n' "$(date -u +%FT%TZ)" "$sha"
run git-head git rev-parse HEAD
run git-status git status --short
run os uname -srmo
run node node --version
run npm npm --version
if ! run install npm ci --no-audit --no-fund; then printf 'BLOCKED: dependency installation failed. Remaining checks NOT RUN.\nREPORT=%s\n' "$report"; exit 1; fi
run typecheck npm run typecheck
run regression npm test
for f in scripts/regression/*.test.ts; do run "individual:$f" npx --no-install tsx "$f"; done
run strict-audit npm run test:audit-strict
run triad npx --no-install tsx scripts/test-triad.ts
run revamp npx --no-install tsx scripts/test-revamp.ts
run native-build npm run build
if run prepare-static node scripts/prepare-cloudflare-demo.mjs; then
  if run static-build npm run build; then
    run export-metadata node scripts/check-seo-export.mjs
  else printf 'NOT RUN: export metadata (build failed)\n'; fi
else printf 'NOT RUN: static build and export metadata (preparation failed)\n'; fi
printf '\nExtended browser/astronomy/calendar, real MediaPipe, physical camera: NOT RUN in this baseline script. Follow next QA instructions.\n'
printf 'OVERALL_EXIT=%s\nREPORT=%s\n' "$failed" "$report"
exit "$failed"
