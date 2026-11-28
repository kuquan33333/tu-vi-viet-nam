# NT audit
Current evidence: Cloudflare canonical deployment reports success at a9e449ebb224acfa108785bf77decdf74b14715f. Repo package.json, next.config.js, public/_headers, CI/SEO/UI-6 and static preparation script inspected. No local runtime results yet. No dependency additions, app code or deployment in 00.1.
Historical reports indicated Lighthouse home performance below gate and Firefox/WebKit keyboard focus test failures. Not accepted as current verified results. Capture actual Linux baseline and distinguish environment issues from code regressions.
QA server scripts/serve-export.mjs currently does not apply _headers; later real edge security test is mandatory.
