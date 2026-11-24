# Đợt 3 — SEO, metadata, URL và điều hướng (24/11/2026)

## Phạm vi
Nhánh `qa/seo-navigation-v3`, tách từ production `revamp-v2` commit `a7a76eab37fc9c37e7d9f2cfcaca99e949fb5685`.
Đã được người dùng xác nhận cho phép vượt 10 tệp. Không merge main/revamp-v2, không thay đổi Cloudflare, không sửa thuật toán an sao, lịch pháp, nội dung sách, bản quyền, dữ liệu sinh, analytics hay font. Đợt 1/2 chưa nghiệm thu và không trộn vào nhánh này. Mã A/D/E được dùng theo yêu cầu đợt 3; chưa có tài liệu audit gốc A1–E10.

## Kiểm chứng trước và sau
Tình trạng trước sửa dựa trên code ở base. Mọi kết quả sau đây là kiểm tra source trực tiếp bằng GitHub API, **không phải npm test/HTML/browser/Lighthouse**.

| Nhóm | Bằng chứng trước sửa | Thay đổi | Kiểm tra |
|---|---|---|---|
| A1 | app/layout.tsx:15 đã có metadataBase | Giữ metadataBase | Đã được vá từ trước |
| A2–A5, E3 | app/layout.tsx:14–26 có keywords/canonical /; chart và heming thiếu metadata; lich-van-nien/layout.tsx:2 thiếu canonical | lib/seo/metadata.ts, metadata của từng page/layout, generateMetadata trên route động; xóa canonical/keywords gốc; ảnh OG và Twitter | Đã tái hiện qua code; source check đạt |
| A6 | app/heming/page.tsx và AppChrome.tsx:10 | chuyển page sang /hop-ban, public/_redirects | Đã tái hiện; source check đạt |
| A7 | app/library/[book]/[chapter]/page.tsx:9–17, app/sitemap.ts:18–19 | lib/classics/chapter-slugs.ts, slug cố định cho 21 chương, redirect 301, link mục lục/trước sau/tìm kiếm | Đã tái hiện; 21 cặp index–slug khớp manifest |
| A robots/sitemap | app/robots.ts:12 chưa có /ho-so; sitemap.ts:9 có /heming | chặn /ho-so, /api, thay URL cũ; loại hồ sơ/preview/search khỏi sitemap | Đã tái hiện; source check đạt |
| D1 | components/TriadNav.tsx:13, app/privacy/page.tsx:9, app/terms/page.tsx:9 có header phụ | một global header; TriadNav trở thành điều hướng phân hệ; Breadcrumb dùng chung | Đã tái hiện; source check đạt |
| D2 | app/library/page.tsx:73 cắt author bằng split | giữ nguyên tên tác giả và wrap | Đã tái hiện; source check đạt |
| D3 | components/AppChrome.tsx:20,39–45 thiếu mục chính và Công cụ dẫn Thiên Kỷ | menu desktop/mobile và bottom nav, hub /cong-cu | Đã tái hiện; source check đạt (phát hiện và sửa thêm desktop map) |
| D4 | app/page.tsx:32,58,72,90,94; app/lich-van-nien/page.tsx:109–110 | thay ký hiệu link nội bộ; rel noopener noreferrer cho link ngoài mở tab mới | Đã tái hiện; source scan |
| D7 | components/BirthForm.tsx:296,329,347,482 không có giải thích | 4 TermTooltip, thao tác click/focus/hover | Đã tái hiện; source check đạt |
| D9 | app/library/page.tsx:28, app/preview/page.tsx:90, app/knowledge/[star]/[topic]/page.tsx:100; ShareCardCanvas.tsx:264 | thống nhất Lập lá số | Đã tái hiện; source scan |
| JSON-LD | thiếu WebSite và BreadcrumbList dùng chung; knowledge động có Article với tác giả/ngày không được xác minh | WebSite ở home, BreadcrumbList từ đúng dữ liệu breadcrumb, loại schema Article cũ không đủ căn cứ | Chưa xác minh HTML |

- Test-first: commit `38970c24914052e58a2920799145235b87f41a44` bổ sung source/HTML gates trước thay đổi. 10 kiểm tra ban đầu đều FAIL (E3, A2–A5, A6, A7, D1–D4, robots, sitemap). Sau commit metadata, route, navigation, breadcrumb: 12/12 source probes PASS. Kiểm tra sâu phát hiện menu desktop chưa render từ sections, đã sửa và thêm assertion trong `b2dceb7`; kiểm tra tiếp 12/12 PASS, gồm 21 redirect, menu thật, PNG blob. Kiểm tra tiếp phát hiện hai mũi tên ở Lịch Vạn Niên và nhãn ảnh chia sẻ; vá D4/D9 bổ sung. Không ghi nhận CI xanh khi chưa chạy.
- PNG OG thực tế: 1200×630, 4178 bytes; git blob `045816082636283f6d044c7ee42d88b7ed68b9bb`, khớp file kiểm tra cục bộ. Không tải font ngoài ở runtime hay sử dụng dữ liệu cá nhân.

## URL và cấu trúc
- Route cũ /heming → /hop-ban; app/api/heming vẫn là API nội bộ (không đổi hành vi; static prepare loại cả app/api).
- 21 slug cố định: 9 Cốt Tủy Phú, 5 Toàn Tập, 7 Toàn Thư. `public/_redirects` có 22 quy tắc 301. Không sinh lại trang cũ; query/fragment cần kiểm tra trên edge sau preview.
- `/cong-cu` liệt kê 9 nhóm công cụ/truy cập. Không giới thiệu tính năng chưa có.
- `/ho-so`, `/preview`, `/library/search` noindex, sitemap không liệt kê; robots chặn hồ sơ và API. Robots không bảo mật dữ liệu.
- `scripts/prepare-cloudflare-demo.mjs` vẫn bỏ knowledge động và API khi export như production trước đây. Không tự đưa route kiến thức thiếu dữ liệu vào sitemap. URL production dùng NEXT_PUBLIC_SITE_URL đã được cấu hình trong lệnh deploy.

## Kiểm thử và nghiệm thu
| Lệnh/hạng mục | Kết quả mới |
|---|---|
| git ls-remote | FAIL DNS: Could not resolve host: github.com |
| npm ping --fetch-retries=0 --fetch-timeout=4000 | FAIL EAI_AGAIN registry.npmjs.org |
| npm install/ci | Chưa chạy vì không checkout/cài phụ thuộc qua terminal được |
| npm run typecheck | Chưa chạy |
| npm test | Chưa chạy |
| npm run build | Chưa chạy |
| Source checks | Kết quả nêu ở trên |
| 301 HTTP trên edge | Chưa đo; public/_redirects đúng 22 dòng theo manifest |
| HTML canonical, OpenGraph, Twitter | Chưa có export mới |
| Lighthouse SEO /, /chart, /hop-ban, /lich-van-nien, /library, /cong-cu | Chưa đo, không ghi điểm ước lượng |
| Browser 360px và 1280px | Chưa có ảnh thật; trước sửa menu desktop thiếu mục, mobile dẫn Công cụ vào Thiên Kỷ; sau sửa code có menu và breakpoint mới nhưng cần xác minh trình duyệt |

Workflow `.github/workflows/seo.yml` chạy trên PR: npm ci, typecheck, npm test hiện có, seo.test.ts, triad/revamp, static export, kiểm tra HTML mọi route, kiểm tra 301 mô phỏng bằng server cục bộ, Lighthouse mobile 6 route với ngưỡng >= 95 và chụp 360/1280. Artifact `seo-qa-results`. Không cài thư viện QA vào phụ thuộc sản phẩm. Lệnh kiểm tra 301 ở server test không thay cho HTTP Cloudflare thật. CI build bản export; build server nguyên trạng chưa được xác nhận.

## Rủi ro còn lại
Cần Actions hoạt động và log mới trước nghiệm thu; DNS terminal hiện không truy cập GitHub/npm. Cần đo Lighthouse, kiểm tra Open Graph thực qua công cụ chia sẻ, đối chiếu HTML canonical và HTTP 301 trên preview/production được duyệt. Cần kiểm tra tooltip, menu không tràn và link động sau hydration ở 360/1280. Đợt 1/2 chưa nghiệm thu; không được suy ra tính chính xác thuật toán từ đợt SEO. Không tự merge hoặc triển khai production.
