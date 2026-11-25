# Design System — Thư quán phương Đông

Source: UI-BRIEF.md §2, implemented tokens in app/tokens.css and components/ui. Light theme only in this release.
- Colors: paper #F6F2E9, card #FFFDF8, ink #1C2230, muted #5B6270, dim #6B717D, line #DDD4C2, field #8C8472, accent #9E2F26. Use CSS variables, never literals in UI. Dim on paper is below AA for small text: use muted. Semantic Tứ Hóa tokens retain text labels.
- Typography: local Be Vietnam Pro 400/500/600; Noto Serif 700 (Latin, Vietnamese, extended) for headings; no external font requests. Sizes: home h1 56, subpage 40, mobile 32; h2 34/24; h3 22; body 16 with 1.6 line-height.
- Layout: gutters 64/32/20, 72 section gap, card 24/32 padding, card radius 10, control radius 6. Breakpoints 640, 1024. Controls 48px and touch targets 44px minimum. Focus 3px accent and 2px offset.
- Primitives: Container, Card, Eyebrow, Button/ButtonLink, Field, Segmented, Checkbox, Notice, Icon in components/ui/index.tsx; ChartGrid, CalendarGrid, DetailPanel and StudyTabs are separate components. AppChrome owns Header, Footer, mobile BottomTabBar and shared breadcrumbs. Use SVG icons, accessible labels for standalone icons, no decoration ring on info trigger.
- Naming: UI primitives use ui- prefix; page-scoped presentation uses home2, chart3, calendar4, ui5. New pages should reuse the existing shell; avoid duplicating header/footer and use CSS variables, keep behavior separate from display. Prefer named aria-labels, native buttons/inputs, described errors and visible focus.
- Print: chart and calendar have route-scoped A4 styles. Test the rendered output, not just print CSS. Keep data/algorithm logic unchanged, including disclaimers.
- Verification: UI-6 workflow scans static routes, screenshots main routes, checks browser keyboard and WCAG; SEO workflow enforces performance/accessibility/SEO/Best Practices/CLS. Read reports before approval.
