# Audit baseline – Đợt 1 (24/11/2026)

**Trạng thái: bản baseline chưa nghiệm thu.** Chỉ thay đổi test, CI và tài liệu. Không sửa logic sản phẩm, không merge/deploy. Các kết luận từ mã nguồn được phân biệt với kết quả chạy mới. Tài liệu audit A1–E10 chưa tìm thấy trong các tệp đính kèm/thư viện; đối chiếu đợt này với `plan-update.md` của repo.

## Mốc audit và cấu trúc

- Repo: https://github.com/kuquan33333/tu-vi-viet-nam
- Production: https://lichvannien-9sv.pages.dev – project nội bộ Cloudflare `lichvannien`.
- Base: `revamp-v2`, commit `a7a76eab37fc9c37e7d9f2cfcaca99e949fb5685` (HEAD nhánh tại lúc kiểm tra, đồng thời là commit production).
- `main` ở `2649e7aa346bf03845a0f8e98a0cfa57850b4a4d`, không phải bản đang deploy.
- Deployment ID `effed95b-0f3f-4046-9e36-c61b3111e4f4`, success lúc 03:56:18 UTC (10:56:18 VN) 24/11/2026. Nguồn: Cloudflare Pages deployment metadata và build log.
- `app/`: App Router; `components/`: UI, form, bàn lá số, xuất chia sẻ; `lib/ziwei/`: an sao, lịch, múi giờ, trường phái, lưu hồ sơ; `lib/classics/`: thư viện; `lib/triad/`: Thiên Kỷ/Địa Kỷ/Nhân Kỷ; `lib/nihai/`: dữ liệu nghiên cứu; `scripts/`: test và chuẩn bị export; `.github/workflows/`: CI.
- Next.js 16.4.3 trên log build; TypeScript, Tailwind, iztro, lunar-javascript. Không thay đổi các gói/lockfile.
- Build command production:
  ```sh
  npx tsx scripts/test-triad.ts && npx tsx scripts/test-revamp.ts && node scripts/prepare-cloudflare-demo.mjs && NEXT_PUBLIC_SITE_URL=https://lichvannien-9sv.pages.dev npm run build
  ```
- Output `out`. `next.config.js:2–4` chưa đặt output export trong git; `scripts/prepare-cloudflare-demo.mjs:11–14,16–32` ghi cấu hình `output: 'export'`, ép metadata tĩnh, xóa các route API và knowledge động trong bản sao build. Không adapter/Functions (log: No functions dir; No Wrangler configuration file). Không đổi cấu hình deploy, production/preview tự động đang tắt theo metadata.
- Trang production không tải được từ môi trường audit: terminal DNS `Could not resolve host: lichvannien-9sv.pages.dev`; web fetch cũng không truy cập được. Không suy diễn HTTP 200 hoặc 404 từ lỗi của công cụ.

## 8 lỗi từ plan-update.md

Bằng chứng là file:dòng trên **commit base**, không phải chứng nhận UI trên production. Các tiểu mục L2/L8 được tách rõ, không đánh dấu cả lỗi là đã vá nếu còn tồn tại.

| Mã | Trạng thái | Bằng chứng |
|---|---|---|
| L1 | Đã được vá từ trước | lib/ziwei/algorithm.ts:375–396 xử lý tên độ sáng VI/CN; 612–619 gọi bảng và chuẩn hóa. Test mới kiểm tra dữ liệu sao từ generateChart; chưa có log chạy mới. |
| L2a | Đã được vá từ trước | lib/ziwei/patterns.ts:116–134 chuẩn hóa Tứ Hóa; 914–942 tìm Tài Bạch/Quan Lộc song ngữ; 1060–1065 có cả hai khóa tên cách cục. |
| L2b | Đã tái hiện (đọc code) | lib/ziwei/patterns.ts:95–103 thêm tên sao và dạng Việt, không thêm khóa Hán từ tên Việt; 323–326 lọc set bằng 七杀/破军/贪狼. lib/ziwei/algorithm.ts:735–749 trả tên sao Việt. Fixture tổng hợp trong test mới tái hiện có điều kiện cần nhưng không có detector; chưa chạy. 340 chỉ kiểm tra chính tinh đầu tiên, cần test riêng khi xử lý. |
| L2c | Đã tái hiện (đọc code) | lib/ziwei/patterns.ts:339,363 còn description tiếng Hán; 1145–1155 chỉ dịch name, palaces, conditions, không đổi description. Test mới dùng fixture tên Hán để tách lỗi dịch. Không thay lời bình/nguồn. |
| L3 | Đã được vá từ trước | components/BirthForm.tsx:67–68,84–85; lib/ziwei/cities.ts:31–35 tên mặc định khớp. Test nguồn, chưa E2E. |
| L4 | Đã được vá từ trước (lỗi dấu gốc) | components/BirthForm.tsx:124–130,572 cộng delta âm đúng; lib/ziwei/dst-vn.ts:40,55,70,85 giá trị âm. Chưa kiểm tra đổi ngày khi qua nửa đêm/nhấn lặp hoặc giờ lịch sử theo nguồn độc lập. |
| L5 | Đã được vá từ trước | components/ShareCardCanvas.tsx:15–32 và components/ChartBoard.tsx:18–23 cùng 12 tọa độ sau chuẩn hóa index. Chưa render PNG. |
| L6 | Đã được vá từ trước | app/api/interpret/route.ts:59,62,80,83,101,104,122–126 dùng BRANCHES/STEMS và tên trong mẫu. API bị loại khỏi export tĩnh; cần test server riêng. |
| L7 | Đã được vá từ trước | lib/classics/index.ts:63–96 dùng toLowerCase cả text/translation và snippet trường khớp; test mới dùng từ khóa trong dữ liệu hiện có, không sao chép/trích dẫn cổ thư. |
| L8a | Đã được vá từ trước | lib/ziwei/cities.ts:26–490 có đủ 6 TP + 28 tỉnh; 341–343 cờ Đông Hà/TX Quảng Trị/Vĩnh Linh; cây git không có hai tệp dst-cn.ts/dst-cn.test.ts. Chỉ xác nhận số lượng và cờ theo audit, chưa đối chiếu đầy đủ địa giới lịch sử. |
| L8b | Đã tái hiện (đọc code) | package.json:26 trên base gọi 6/17 test; còn 11 test bị bỏ sót. Test kiểm tra danh sách mới đánh dấu TODO có lý do, chế độ strict trả lỗi nếu thiếu. |

## Đối chiếu route

Nguồn: cây Git của commit base, script prepare và log build deployment nói trên. Cột “build” là route được xác nhận sinh ra trong log; **không phải** kiểm thử HTTP trực tiếp.

| Route | Source | Build production |
|---|---|---|
| / | Có | Static |
| /chart | Có | Static |
| /heming | Có | Static |
| /lich-van-nien | Có | Static |
| /thien-ky | Có | Static |
| /dia-ky | Có | Static |
| /nhan-ky | Có | Static |
| /library | Có | Static |
| /ho-so | Có | Static |
| /privacy | Có | Static |
| /terms | Có | Static |
| /knowledge | Có | Static |
| /knowledge/[star]/[topic] | Có | Bị loại bởi prepare:28 |
| /api/heming | Có | Bị loại bởi prepare:32 |
| /api/interpret | Có | Bị loại bởi prepare:32 |
| /library/[book] | Có | SSG: gusuifu, quanji, quanshu |
| /library/[book]/[chapter] | Có | SSG: 21 đường dẫn chương được log liệt kê/tóm tắt |
| /library/search | Có | Static |
| /preview | Có | Static |
| /robots.txt | app/robots.ts | Static |
| /sitemap.xml | app/sitemap.ts | Static |
| /_not-found | Next.js sinh tự động | Static |

42/42 static pages theo log. Chưa đối chiếu trực tiếp toàn bộ site, nên chưa xác nhận các URL bổ sung ngoài source hoặc HTTP 404. `docs/revamp-v2.md` ghi 11 route chính trả 200 ở QA trước, không tính là quan sát mới.

## Test inventory

**Trước thay đổi**, `npm test` gọi 6/17 tệp dưới `scripts/regression/`:
- dst-vn.test.ts
- famous-hour-consistency.test.ts
- clock-adjust.test.ts
- gender-validation.test.ts
- solar-date-exists.test.ts
- form-true-solar-day.test.ts

**Bỏ sót 11 tệp**:
- birthform-birthinfo-consistency.test.ts
- heming-refresh.test.ts
- heming-stream.test.ts
- hongluan-tianxi.test.ts
- iztro-time-index-boundary.test.ts
- leap-policy-validation.test.ts
- natal-dual-sihua-same-palace.test.ts
- neutral-naming.test.ts
- pan-integrity.test.ts
- patterns-sihua-bonus.test.ts
- sizhu-lichun-boundary.test.ts

Rủi ro test cũ: `pan-integrity.test.ts` so sánh tên cung Hán với kết quả đã Việt hóa; `patterns-sihua-bonus.test.ts` so sánh tên pattern, sao và Tứ Hóa Hán. Chưa chạy để biết chính xác lỗi/exit code. Không tự bỏ, xóa hay sửa test cũ để ép CI xanh.

**Test ngoài regression:** `scripts/test-triad.ts` và `scripts/test-revamp.ts` đã được log deployment xác nhận pass, trước đây không thuộc npm test. test-revamp:24 chỉ kiểm tra ngày 24/11/2026 khác null, chưa kiểm tra kết quả.

**Test thêm vào nhánh audit:**
- `scripts/regression/audit-plan-update.test.ts`: L1–L8, probe dữ liệu/fixture và kiểm tra mã nguồn cho L3–L6.
- `scripts/regression/golden-chart.test.ts`: 3 mẫu tổng hợp + Quang Trung và Phan Bội Châu theo dữ liệu famous.ts (giờ sinh giả định, không xác thực lịch sử); process Node riêng gọi iztro với yearDivide normal và không import wrapper sản phẩm. So sánh Mệnh, Thân, Cục và vị trí 14 chính tinh. Log REFERENCE để chốt snapshot sau khi chạy độc lập; chưa có giá trị cố định được kiểm chứng. Test ngày 24/11/2026 kiểm tra âm lịch 16/10/2026, Bính Ngọ, Kỷ Hợi, Nhâm Dần theo yêu cầu người dùng, cả quy đổi ngược.
- `npm test` sau thay đổi gọi 8/19 file. 11 test cũ còn bỏ sót, không tuyên bố coverage 100%.
- `npm run test:audit-strict`: chuyển ba probe lỗi mở L2/L8 từ TODO có lý do sang assert bắt buộc. CI thường vẫn hiển thị TODO và không tuyên bố chúng pass. CI xanh không có nghĩa là các lỗi TODO đã được sửa.

## Lệnh và kết quả

### Bằng chứng lịch sử: log production 24/11/2026, không phải lần chạy mới
| Lệnh | Kết quả |
|---|---|
| npm clean-install --progress=false | Thành công, 184 gói, cảnh báo deprecated node-domexception@1.0.0; 34 gói tìm tài trợ |
| npx tsx scripts/test-triad.ts | Pass (64 quẻ, 24 tiết khí, 24 sơn, 8 cung phi, 14 kinh, 361 huyệt, 16 chuyên đề) |
| npx tsx scripts/test-revamp.ts | Pass |
| npm run build (sau prepare export) | Pass, compiled 18.7s; Next.js TypeScript 8.7s; 42/42 trang tĩnh |
| Cảnh báo build | No build cache, thông báo telemetry Next.js, Node 22.16.0 cảnh báo maintenance trong log |
| npm run typecheck riêng | Không có bằng chứng chạy trong log |
| npm test | Không có bằng chứng chạy trong log |

### Lần audit mới
- Node v22.16.0, npm 10.9.2 trong container.
- git ls-remote https://github.com/kuquan33333/tu-vi-viet-nam.git HEAD: fatal: Could not resolve host: github.com. GitHub API đọc được nhưng không thể clone/cài gói từ mạng bằng terminal.
- npm install, npm run typecheck, npm test, npm run build: chưa chạy mới tại container vì không có checkout và phụ thuộc. Không chạy npm tại thư mục không phải dự án.
- CI: workflow đã bổ sung typecheck/test/triad/V2/build raw và static. Chưa có kết quả của nhánh audit tại thời điểm ghi báo cáo. Không ghi “CI xanh” khi chưa nhận log.
- Không có thay đổi sản phẩm, nên không có ảnh “sau” khác ảnh “trước”.

## Lighthouse mobile và giao diện
| URL | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| / | Chưa đo | Chưa đo | Chưa đo | Chưa đo |
| /chart | Chưa đo | Chưa đo | Chưa đo | Chưa đo |
| /lich-van-nien | Chưa đo | Chưa đo | Chưa đo | Chưa đo |

360px/1280px: chưa thể chụp mới vì không truy cập được site, không có local build. Cần upload báo cáo Lighthouse JSON/HTML và ảnh thật hai viewport hoặc cung cấp môi trường truy cập. Không dùng số điểm ước lượng.

## Rủi ro và giới hạn

- Còn lỗi L2/L8; các test TODO và test cũ chưa phải là kiểm chứng đầy đủ. So sánh iztro chỉ kiểm tra tính nhất quán wrapper, không xác nhận trường phái/lịch pháp độc lập.
- `app/layout.tsx` đã có Analytics/SpeedInsights và Google Fonts từ trước; không bổ sung hay thay đổi chúng trong đợt 1. Cần audit lưu lượng mạng và quyền riêng tư ở đợt sau; chưa kết luận có gửi dữ liệu sinh hay không.
- Thiếu tài liệu audit A1–E10; CẦN BỔ SUNG NGUỒN. Không tự gán các mã A1–E10 cho L1–L8.
- Không thay giấy phép, ghi công, dữ liệu người dùng hay nội dung cổ thư; chưa merge/deploy.
- Tiêu chí hoàn thành đợt 1 chưa đạt: cần log CI chạy mới, golden snapshot được đối chiếu và Lighthouse/ảnh viewport.
