# UI-6 — Nghiệm thu toàn bộ

Baseline UI-5 merged: da8b7ea6895a5fcb52753ec8dd20b31c91189b0c. Source UI-BRIEF.md §UI-6 (owner ZIP).
Previous UI-5 HEAD c339252: CI, SEO, UI-5 QA passed; 42 route/viewport checks, 30 axe reports empty, 51 after images, 39 before captures. Lighthouse mobile home 96/100/100, chart 94/100/100, calendar 92/100/100 (performance/accessibility/SEO), CLS below .1. Best Practices not measured in that run.

## Plan and gates
- All exported HTML routes, including knowledge pages, classics chapters, 64 hexagrams, 404 and preview: discover from build, Chromium mobile, four shards. Keep scope/results JSON and fail on serious/critical axe, JS error, external request, overflow, duplicate shell or missing H1. 11 main routes x 360/768/1280 with screenshot and axe, keyboard tests on home/chart/calendar. Firefox/WebKit 360/1280 smoke and keyboard on the three main routes.
- Extend Lighthouse gate: Performance >=85, Accessibility/SEO/Best Practices >=95, CLS <0.1. Preserve existing regression, browser, privacy and print tests.
- Token contrast audit, inventory residual literal colors/icons/gradients; classify findings (do not confuse content, URL hashes or chart semantics with decorative styling). Remove only proven unused rules/components after audit. Do not blanket delete legacy classes still used in preview or knowledge pages.
- Inspect all 33 screenshots and before/after comparisons, archive verified images in docs/screenshots/ before final acceptance. No screenshot stored until the browser actually produces it.
- Existing known deviations: chart font weight 700 vs 600, separate date fields, conditional unknown-time hypotheses, historical caveats; missing Han originals in library, source/license within Terms; date outside-month muted instead of dim to satisfy AA. A4 single-page fixtures are not proof for every possible chart. Real iPhone Safari and screen reader are still pending; Linux WebKit is only an approximation. No dark mode, complex animation or illustrative imagery in this release.
- No algorithm changes, no production deploy. Do not mark UI-6 complete until artifacts checked, outstanding failures fixed and cleanup verified.

## Result
Pending the first UI-6 run. Design-system documentation added. Source inventory and computed contrast JSON to be attached to the final report after execution.

## Hậu kiểm 2a1a7f4 (25/11/2026)
- CI và SEO/Lighthouse mở rộng PASS. UI-6: 4 shard Chromium all và Firefox compat PASS; WebKit compat FAIL ở /chart 360 (viewport client 355, scroll 420), các lượt còn lại đạt; screens Chromium dừng ở Inventory tokens ENOENT app/api/heming/route.ts vì prepare-cloudflare-demo.mjs xóa các route API/knowledge động trong working tree trước khi kiểm kê. Đã đọc lại mục UI-6 trong ZIP.
- Di chuyển inventory trước prepare/build để quét đủ source Git, không bỏ file. Giới hạn intrinsic size của form, native select và time input (giả thuyết nguyên nhân WebKit; chưa có log từng phần tử của lần đầu). Không dùng overflow-x:hidden toàn trang, giữ native control và gate overflow. Bổ sung log bounding box phần tử vượt viewport và kiểm tra lại sau thao tác bàn phím. Cần chạy lại đủ workflow trước nghiệm thu.
