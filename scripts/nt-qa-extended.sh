#!/usr/bin/env bash
# Extended NT-00 QA. Must run in a disposable detached worktree; no push/deploy.
set -u
set -o pipefail
root=$(git rev-parse --show-toplevel) || exit 2
sha=$(git rev-parse "${1:-HEAD}^{commit}") || exit 2
report_dir="${2:-$HOME/nt-qa-reports}"
mkdir -p "$report_dir" || exit 2
report_dir=$(cd "$report_dir" && pwd -P) || exit 2
stamp=$(date -u +%Y%m%d-%H%M%S)
report=$(mktemp "$report_dir/NT-EXTENDED-${sha:0:12}-$stamp-XXXXXX.txt") || exit 2
work=$(mktemp -d "${TMPDIR:-/tmp}/nt-extended.XXXXXX") || exit 2
git -C "$root" worktree add --detach "$work" "$sha" || exit 2
server_pid=""
cleanup(){
  if [[ -n "$server_pid" ]]; then kill "$server_pid" >/dev/null 2>&1 || true; fi
  cd "$root"
  git -C "$root" worktree remove --force "$work" >/dev/null 2>&1 || printf 'QA worktree retained: %s\n' "$work" >&2
}
trap cleanup EXIT INT TERM
exec > >(tee "$report") 2>&1
cd "$work" || exit 2
export NEXT_TELEMETRY_DISABLED=1
export NEXT_PUBLIC_SITE_URL=https://tuvivietnam.pages.dev
failed=0
run(){
  local label="$1"; shift
  printf '\n=== %s ===\n' "$label"
  printf 'COMMAND:'; printf ' %q' "$@"; printf '\n'
  "$@"; local rc=$?
  printf 'EXIT [%s]=%s\n' "$label" "$rc"
  if ((rc!=0)); then failed=1; fi
  return 0
}
printf 'NT-00 extended QA\nUTC: %s\nSHA: %s\n' "$(date -u +%FT%TZ)" "$sha"
run git-head git rev-parse HEAD
run git-status git status --short
run os uname -srmo
run node node --version
run npm npm --version
node_major=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || printf '0')
if [[ "$node_major" != "22" ]]; then
  printf 'BLOCKED: repository CI pins Node 22; this extended checkpoint requires Node 22, current major=%s. Install/select Node 22 and rerun.\n' "$node_major"
  printf 'OVERALL_EXIT=1\nREPORT=%s\n' "$report"
  exit 1
fi
if ! npm ci --no-audit --no-fund; then
  printf 'BLOCKED: npm ci failed; remaining checks not run.\nOVERALL_EXIT=1\nREPORT=%s\n' "$report"
  exit 1
fi
run typecheck npm run typecheck
run regression npm test
run strict-audit npm run test:audit-strict
run triad npx --no-install tsx scripts/test-triad.ts
run revamp npx --no-install tsx scripts/test-revamp.ts
run native-build npm run build
# Independent calendar and astronomy audits. Dependencies and downloaded references stay in this worktree.
mkdir -p .nt-qa/astronomy .nt-qa/browser
if npm install --prefix "$work/.nt-qa/astronomy" --ignore-scripts --no-save --no-audit --no-fund astronomy-engine@2.1.19; then
  run independent-astronomy env ASTRONOMY_ENGINE_PATH="$work/.nt-qa/astronomy/node_modules/astronomy-engine/astronomy.js" npx --no-install tsx scripts/audit-vn-astronomy.ts
else
  printf 'BLOCKED: Astronomy Engine QA dependency install failed.\n'; failed=1
fi
reference="$work/.nt-qa/lichta-2.2.1.mjs"
if curl --fail --silent --show-error --location --retry 2 'https://raw.githubusercontent.com/zeforc/lichta/6f656383f9eb525373ea6a7ef327fdd3fdc3ac54/packages/core/dist/index.mjs' --output "$reference"; then
  if [[ "$(git hash-object "$reference")" == "baff4984d0603db3d2b7ce97eec8c38ad92907f3" ]]; then
    run calendar-reference env VN_CALENDAR_REFERENCE="$reference" npx --no-install tsx scripts/compare-vn-calendar.ts
  else
    printf 'BLOCKED: pinned LichTa reference SHA mismatch.\n'; failed=1
  fi
else
  printf 'BLOCKED: could not download pinned LichTa reference.\n'; failed=1
fi
run iztro-adapter npx --no-install tsx scripts/audit-vn-iztro.ts
# Static Pages build is isolated from the owner checkout.
run clean-static rm -rf .next out
run prepare-static node scripts/prepare-cloudflare-demo.mjs
run static-build npm run build
run export-metadata node scripts/check-seo-export.mjs
if [[ -d out ]]; then
  node scripts/serve-export.mjs > "$work/.nt-qa/static-server.log" 2>&1 &
  server_pid=$!
  ready=0
  for i in $(seq 1 40); do
    if curl --fail --silent http://127.0.0.1:4173/ >/dev/null; then ready=1; break; fi
    sleep 1
  done
  if ((ready==1)); then
    run encoded-assets node scripts/check-qa-encoded-assets.mjs
    if npm install --prefix "$work/.nt-qa/browser" --ignore-scripts --no-save --no-audit --no-fund playwright@1.51.1 axe-core@4.10.3 lighthouse@12.6.0; then
      browser_modules="$work/.nt-qa/browser/node_modules"
      export PLAYWRIGHT_MODULE="$browser_modules/playwright"
      export AXE_SCRIPT="$browser_modules/axe-core/axe.min.js"
      if "$browser_modules/.bin/playwright" install --with-deps chromium firefox webkit; then
        run browser-interaction node scripts/check-browser-interaction.mjs
        run browser-v4 node scripts/check-v4-browser.mjs
        run browser-five-systems node scripts/check-five-systems-browser.mjs
        run ui6-chromium-0 node scripts/capture-ui-6.mjs all chromium 0 4
        run ui6-chromium-1 node scripts/capture-ui-6.mjs all chromium 1 4
        run ui6-chromium-2 node scripts/capture-ui-6.mjs all chromium 2 4
        run ui6-chromium-3 node scripts/capture-ui-6.mjs all chromium 3 4
        run ui6-token-audit node scripts/audit-ui-6-tokens.mjs
        run ui6-firefox node scripts/capture-ui-6.mjs compat firefox 0 1
        run ui6-webkit node scripts/capture-ui-6.mjs compat webkit 0 1
        run ui6-screens node scripts/capture-ui-6.mjs screens chromium 0 1
      else
        printf 'BLOCKED: Playwright browser installation failed.\n'; failed=1
      fi
      chrome_path=$(PLAYWRIGHT_MODULE="$PLAYWRIGHT_MODULE" node -e "process.stdout.write(require(process.env.PLAYWRIGHT_MODULE).chromium.executablePath())" 2>/dev/null || true)
      if [[ -n "$chrome_path" && -x "$chrome_path" ]]; then
        export CHROME_PATH="$chrome_path"
        mkdir -p qa-artifacts/lighthouse
        for route in home chart hop-ban lich-van-nien library cong-cu; do
          url="http://127.0.0.1:4173/$route"
          if [[ "$route" == "home" ]]; then url="http://127.0.0.1:4173/"; fi
          categories=seo
          if [[ "$route" =~ ^(home|chart|lich-van-nien)$ ]]; then categories=seo,accessibility,performance,best-practices; fi
          run "lighthouse-$route" "$browser_modules/.bin/lighthouse" "$url" --only-categories="$categories" --output=json --output-path="qa-artifacts/lighthouse/$route.json" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --quiet
        done
        run lighthouse-gates node scripts/check-seo-lighthouse.mjs
      else
        printf 'BLOCKED: could not resolve Playwright Chromium executable for Lighthouse.\n'; failed=1
      fi
    else
      printf 'BLOCKED: browser QA dependency install failed.\n'; failed=1
    fi
  else
    printf 'BLOCKED: static QA server did not become ready.\n'; failed=1
  fi
else
  printf 'BLOCKED: static export directory missing; browser checks not run.\n'; failed=1
fi
# Read-only capture of real Cloudflare edge headers; local server cannot substitute.
run production-http-headers curl --fail --silent --show-error --location --dump-header "$work/.nt-qa/production-headers.txt" --output /dev/null https://tuvivietnam.pages.dev/
printf '\n=== production-edge-header-summary ===\n'
if [[ -f "$work/.nt-qa/production-headers.txt" ]]; then
  grep -iE '^(HTTP/|content-security-policy:|permissions-policy:|x-content-type-options:|x-frame-options:|referrer-policy:|cache-control:)' "$work/.nt-qa/production-headers.txt" || true
  cp "$work/.nt-qa/production-headers.txt" "$report_dir/NT-EDGE-HEADERS-${sha:0:12}-$stamp.txt"
fi
if [[ -f "$work/.nt-qa/static-server.log" ]]; then cp "$work/.nt-qa/static-server.log" "$report_dir/NT-STATIC-SERVER-${sha:0:12}-$stamp.log"; fi
artifact_paths=()
[[ -d qa-artifacts ]] && artifact_paths+=(qa-artifacts)
[[ -d qa-baseline ]] && artifact_paths+=(qa-baseline)
if ((${#artifact_paths[@]})); then
  artifact_bundle="$report_dir/NT-ARTIFACTS-${sha:0:12}-$stamp.tar.gz"
  if tar -czf "$artifact_bundle" "${artifact_paths[@]}"; then printf 'ARTIFACT_BUNDLE=%s\n' "$artifact_bundle"; else failed=1; fi
fi
printf '\nPhysical iPhone/iPad and real camera consent/lifecycle tests: deferred to NT-03/NT-11; not claimed here.\n'
printf 'OVERALL_EXIT=%s\nREPORT=%s\n' "$failed" "$report"
exit "$failed"
