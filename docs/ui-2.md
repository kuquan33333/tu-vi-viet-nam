# UI-2 — Trang chủ

Baseline: 0e1aa69bc80e919e7857cf0d87ee05c48b14504c (UI-1 merged; CI, SEO, Visual QA all green). Cloudflare canonical production before UI-2: 565bda16; automatic production/preview deployments disabled. No production deploy in UI-2.

## Nguồn thiết kế
- UI-BRIEF.md SHA-256 e09315b9fcfe133d85cf6e1e8ea18a7f36178fc1fee057ed5ebdc501f49d303c
- home-desktop.html SHA-256 06a23ba462b6313e0be9be2c552f2e78c3beabcc693a2b12f7135edcdc93f0b0
- home-mobile.html SHA-256 23d29c0257945da549290c28859aafbd98950ee9abaf2140bd80e9cfce6340e3
Đã đọc cả chart-form.html và calendar.html, không triển khai UI-3/UI-4.

## Kiểm kê và kế hoạch
Next.js, TypeScript, Tailwind; style nền app/tokens.css, globals.css, triad.css, revamp.css, ui.css. Trang chủ cũ dùng home-hero, hero-visual, preview-board, module-grid, tools-grid, home-note và stat-box trong revamp.css. AppChrome + Header/BottomTabBar/Footer/Breadcrumb dùng chung từ UI-1; giữ nguyên. Thay app/page.tsx, CSS riêng app/home.css, thêm ChartGrid presentation component; không sửa lib, dữ liệu, metadata hoặc route. Hub /cong-cu đã có. Giữ CSS cũ còn dùng ở các trang khác tới UI-6.

## Thực hiện và khác biệt có chủ đích
- Hero, bốn phân hệ, công cụ và dải tối theo reference. CTA chính chỉ một trong hero, header vẫn có CTA theo UI-1.
- ChartGrid thật từ generateChart và bộ mẫu danh nhân FAMOUS_PERSONS: Phan Bội Châu; giờ sinh ước đoán, ngày trước 1900 dùng legacy calendar. Mệnh tô accent theo dữ liệu engine chứ không ép Ngọ theo mockup. Mobile ẩn bàn mẫu theo HTML, tablet có bàn mẫu; UI-BRIEF ưu tiên nội dung đủ (eyebrow, heading, trust, disclaimer) hơn nội dung rút gọn của mockup. Dải tối giữ nguyên cảnh báo cũ, thêm không thay thế tư vấn y tế.
- Link Atlas tới /nhan-ky hiện có; người dùng chọn tab Atlas 361 huyệt; không thay logic tab thuộc UI-5. Công cụ còn lại tới route hiện có. Nguồn giấy phép trỏ anchor đã có.
- Dùng Icon SVG cho mũi tên, không ký tự Unicode trang trí; không thêm màu/font/thư viện. ChartGrid preview hiện chỉ thể hiện bố cục và Mệnh, không phải kết quả chi tiết UI-3.
- Kiểm thử V4 giữ nguyên các hành vi; cập nhật selector để theo markup mới. UI-2 workflow chụp before/after 360/390/768/1280, kiểm tra link, vị trí 12 cung, overflow, vùng chạm, axe, font/script ngoài, header/footer duy nhất. SEO workflow giữ ngưỡng Accessibility 95, Performance 85 và metadata.
- Nghiệm thu sau khi cả CI/SEO/UI-2 visual QA đạt cùng head và xem ảnh thực tế; không tuyên bố PASS trước khi có kết quả. Chưa làm UI-3–UI-6.
