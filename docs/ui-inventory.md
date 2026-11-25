# UI-1 — kiểm kê giao diện trước khi thay đổi

Mốc so sánh: `565bda16c47f260c2b31f0005b02545ca1a5b3a9`, nhánh `revamp-v2`, Cloudflare Pages production. Đặc tả: UI-BRIEF.md (gói ZIP ngày 25/11/2026); bốn HTML tham chiếu. Không đổi thuật toán, dữ liệu, URL, metadata hoặc cách xử lý biểu mẫu.

## File style

| File ở baseline | Vai trò |
|---|---|
| app/globals.css (438 dòng) | Tailwind, token gốc, form, chart, print |
| app/revamp.css (415 dòng) | Ghi đè token và app chrome, responsive, QA đợt 4 |
| app/triad.css (87 dòng) | Phân hệ Thiên/Địa/Nhân Kỷ |
| tailwind.config.ts | Utility, bảng màu, radius, shadow, animation |
| postcss.config.js | Pipeline Tailwind; giữ nguyên |

Tất cả trang JSX còn có class utility và một số inline style; không có file font WOFF2/TTF ở baseline. `app/layout.tsx` import ba stylesheet, dùng system font thực tế từ revamp.css. UI-1 thêm `tokens.css` và `ui.css`; alias token giữ cho các trang chưa thiết kế lại.

## Component baseline (26)

- Khung: AppChrome, Breadcrumb, TriadNav, ThemeProvider, Icon.
- Nhập: BirthForm, BirthDateTimeFields, ProfilePicker, FamousPersonCard.
- Lá số: ChartBoard, ChartSummary, PalaceCell, PatternsCard, StarDetailPanel, InsightPanel, TimeNav, TermTooltip.
- Chia sẻ/hộp thoại: ShareCardCanvas, ShareModal, ChatPanel, AnnouncementModal.
- Phân hệ: HexagramFigure, TimeQimenTool, XuanKongGIS.
- Trang trí: ScrollIntro, StarField.

Các trang có style riêng: home, chart, hop-ban, ho-so, cong-cu, lich-van-nien (CalendarView), thien-ky và trang quẻ, dia-ky, nhan-ky, library và LibrarySearch / book / chapter / search, knowledge và topic, privacy, terms, preview.

## Icon, gradient và nguồn

Các vị trí được kiểm tra trực tiếp ở baseline:
| File | Vị trí / ký hiệu |
|---|---|
| components/ChartBoard.tsx | dòng 149: âm dương |
| components/ChartSummary.tsx | dòng 49: sao trang trí |
| components/ChatPanel.tsx | dòng 112: sao trang trí |
| components/InsightPanel.tsx | dòng 388, 431: sao trang trí |
| components/StarDetailPanel.tsx | dòng 298–305: biểu tượng theo lĩnh vực |
| components/ScrollIntro.tsx | dòng 210: tám quái dạng ký tự |
| components/ShareModal.tsx | dòng 85, 121, 132: ký hiệu chia sẻ/tải |
| components/FamousPersonCard.tsx | dòng 26, 59: sao/cảnh báo |
| components/BirthForm.tsx | dòng 432, 473: ký hiệu mở ngoài/cảnh báo |
| app/dia-ky/page.tsx | dòng 89, 201: icon la bàn |
| app/nhan-ky/page.tsx | dòng 150: ký hiệu mở trang ngoài |

Không xóa dữ liệu quẻ hoặc thông báo giới hạn. Ký tự chỉ dùng trang trí được thay bằng SVG hoặc chữ. Các trang Thiên/Địa/Nhân Kỷ đổi footer nội dung thành note, giữ nguyên văn bản; bỏ TriadNav lặp; breadcrumb dùng chung. Link Nguồn và giấy phép trỏ mục sẵn có tại /terms#nguon-va-giay-phep, ghi công upstream, không tạo URL route mới.

`scripts/capture-ui-1.mjs` xuất báo cáo kiểm kê tự động đầy đủ từng file và số dòng từ Git tree baseline và head (artifact `ui-1-before` và `ui-1-after`). Báo cáo tự động phân biệt ký hiệu, mã hex/RGB, gradient để phát hiện vị trí sót; không quét vào thư viện thuật toán hoặc JSON dữ liệu.

## Giới hạn của bước này

- Bố cục hero, biểu mẫu, kết quả lá số, lịch, trang đọc và toàn bộ chức năng giữ nguyên cho UI-2 đến UI-5. Kiểm tra typography chi tiết và dọn alias/class cũ tiếp tục UI-6.
- Font Be Vietnam Pro 400/500/600, Noto Serif 700 chuyển sang next/font/local với WOFF2 ghim trong git, kèm OFL; không yêu cầu tải font từ mạng khi build hoặc chạy web. Kiểm chứng thực tế bằng QA commit mới.
- Chế độ tối tạm ngừng theo brief; không xóa giá trị lưu trước đó. Màu ngữ nghĩa Tứ Hóa dùng token riêng và giữ nhãn chữ.
- Chưa tuyên bố hoàn thành trước khi ba workflow CI, SEO/Browser QA, UI-1 visual QA thành công. Không triển khai Cloudflare trong PR này.


## Bổ sung hậu kiểm UI-1 (25/11/2026)
- Lượt Visual QA ở commit 83336c5: build và 33 hành trình giao diện bản mới đã chạy, nhưng gate mã nguồn thất bại vì `app/revamp.css:58` còn biểu tượng trang trí ✦. Đã thay bằng SVG và xử lý thêm emoji / mũi tên điều hướng.
- Hai bộ ảnh trước/sau đã được tạo và Visual QA xanh ở commit bc5558c. Chỉ nghiệm thu bản mới nhất sau khi tất cả workflow trên cùng commit xanh.
- Browser QA đợt trước phát hiện bài test Hợp bàn dùng hard reload sau mở khóa PIN. Kho hồ sơ tự khóa lại là đúng cơ chế bảo mật. Chuyển sang điều hướng Next Link qua logo và công cụ Hợp bàn, không thay `lib/ziwei/profile-storage.ts`.
- Palette chính giữ chính xác 8 giá trị trong brief. Màu ngữ nghĩa Hóa Khoa đậm hơn để tăng contrast. Mâu thuẫn thiết kế: dim #6B717D trên paper #F6F2E9 chỉ đạt ~4.39:1 (<4.5:1 chữ nhỏ); trên card #FFFDF8 đạt ~4.82:1. Giữ nguyên dim theo nguồn sự thật, dùng muted trên paper cho chữ nhỏ; cần chủ dự án quyết định màu ngày ngoài tháng tại UI-4.
- Font trước đây tải lúc build bằng next/font/google; đã thay bằng next/font/local và ghim WOFF2 trong app/fonts. Không còn phụ thuộc tải font; npm ci vẫn có thể cần mạng để lấy dependencies.
- Giữ nguyên nhánh UI-1, PR #8; không merge hoặc deploy khi chưa có kiểm thử xác nhận đầy đủ. Bố cục riêng home/form/chart/calendar và trang nội dung vẫn theo UI-2–UI-5. UI-6 dành cho kiểm tra liên trình duyệt và hoàn thiện toàn hệ thống.

- Hậu kiểm commit 3fc2eaa: CI và Visual QA xanh; SEO/Browser QA đỏ ở /chart (360/1280): nút lịch chưa chọn có màu muted trên line, 4.16:1. Đã đổi sang ink trên line cho cả hai lựa chọn, thêm aria-pressed và vùng bấm 44px; bổ sung kiểm thử hai trạng thái. Chưa nghiệm thu khi chưa có kết quả trên commit cuối.

- Hậu kiểm 9a54cd8: CI và Visual QA xanh, Browser QA (bao gồm WCAG) xanh; Lighthouse mobile đỏ: home 71, chart 73, lịch 73, ngưỡng 85. Tối ưu WOFF2 nguồn chính thức, bỏ TTF khỏi tree, Noto Serif tách Latin/Vietnamese/Latin Extended và chỉ preload hai subset chính. Giữ nguyên gate 85 và bổ sung kiểm chứng glyph thực tế. Chưa khẳng định hiệu năng đạt cho đến khi Actions mới xanh.
