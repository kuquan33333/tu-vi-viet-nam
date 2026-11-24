# Đợt 4 – Chức năng và giao diện

Base c5dbcf4 / qa/integration-v3. Nhánh qa/features-ui-v4, PR #5, chưa merge hoặc deploy. Người dùng đã duyệt >10 tệp.

## Test-first và kết quả đã ghi nhận
- e9ff984 red: CI 45392599887 tái hiện C14 tự loại hồ sơ, không có mã hóa/JSON, C9 thiếu picker, và inventory test chưa thêm package.
- f4fc899 green: CI 45392797283 hoàn thành xanh, kể cả 29 file hồi quy và build. Kho dữ liệu mã hóa AES-GCM 256, PBKDF2 SHA256 600000 vòng, salt 16 byte, IV 12 byte ngẫu nhiên, khóa không exportable. Không lưu PIN, không giữ plaintext trong localStorage khi mã hóa. Chỉ giữ khóa/dữ liệu mở khóa ở RAM tab; reload khóa. JSON export bản rõ có xác nhận; nhập validate schema, không ghi đè mã trùng, không tự loại hồ sơ, lưu hai hồ sơ atomic trong một lần ghi. PIN 6–12 số, rủi ro dò ngoại tuyến, không có khôi phục. Không bảo vệ thiết bị đã bị chiếm quyền.
- ceaed42 green: CI 45393054227; 64 quẻ có 6 hào, 4096 tổ hợp hào được kiểm tra; nguồn MIT qingshano/yijing-data commit 85479622197efde01d98199ded59a91871e12660, docs/licenses/yijing-data.txt. Nguyên văn Hán có thể có dị bản/lỗi chép, chưa thẩm định đầy đủ. Không có bản dịch Việt có nguồn; hiển thị CẦN BỔ SUNG NGUỒN. Địa bàn Kỳ Môn không phải bộ tính thời gia đầy đủ.
- dec88fc: 24 tiết khí mỗi năm 1900–2050, cùng lịch UTC+7; hai fixture Moshier 2004/1990 trong 2 phút. CI 45393246180 typecheck/hồi quy/build thường/tĩnh đã pass. Chưa xác minh toàn bộ thời điểm đến giây. Ngày lễ theo Điều 112 Bộ luật Lao động 2019 https://vbpl.moj.gov.vn/bolaodong/pages/vbpqen-toanvan.aspx?ItemID=11135 ; đánh dấu ngày lễ/văn hóa, không tự suy đoán ngày nghỉ bù/đợt nghỉ hằng năm hoặc lịch nghỉ hành chính trong quá khứ.
- 19e6c5e: typecheck, 32 tệp hồi quy, strict, Triad/V2, static SEO build đã pass tại thời điểm kiểm tra. UI dùng system font, không tải Google Font/Analytics/SpeedInsights. SVG cho điều hướng và nút chính, component date/time dùng chung, mobile 12 cung không dùng bàn cuộn ngang, bản in A4 landscape. CSP tương thích Next static inline script/style, còn unsafe-inline do kiến trúc export; không quảng cáo CSP tuyệt đối. Cache immutable chỉ /_next/static, HTML no-cache. Chưa xác minh HTTP edge.
- Gate mới: Lighthouse SEO >=95 sáu trang, accessibility >=95 và mobile performance >=85 ba trang; browser 360/1280, kiểm tra contrast sáng/tối bằng axe-core QA, PDF A4 và hồ sơ PIN. Không tuyên bố đạt trước khi đọc log và artifact mới. Không giảm ngưỡng để ép xanh.

## Giới hạn
- Nguồn kinh văn cần thẩm định toàn bộ và bản dịch Việt có quyền sử dụng; không tự chế lời luận.
- Không có cơ chế bảo vệ PIN khỏi mã độc hoặc người đã mở khóa tab; file xuất không mã hóa. Mã hóa chỉ áp dụng kho hồ sơ lá số, không áp dụng lịch sử gieo quẻ.
- In PDF qua hộp thoại trình duyệt và CSS A4; kiểm thử tạo PDF bằng Playwright. Preview/production giữ nguyên đến khi nghiệm thu.

### Lighthouse đo lần đầu (19e6c5e)
- `/`: Accessibility 95, Performance 78; `/chart`: 94, 78; `/lich-van-nien`: 100, 86. Cả sáu route SEO 100. Run 45393587701, artifact 14920496565. Chưa đạt gate.
- Báo cáo cho thấy LCP chủ yếu là render delay; tải trước route khác, các chunk JS chưa dùng và contrast chữ ghi chú chưa đạt. Giảm prefetch ở chrome/home, bỏ animation JS của form (giữ trạng thái và hành vi), dùng trực tiếp hai hàm chuyển đổi UTC+7 đã có, tải TimeNav khi cần, sửa màu và accessible name. Không thay thuật toán an sao hoặc bảng lịch. Thêm ngày âm trong danh sách mobile và giữ test ngày Tết 1985 ở cả hai layout. Cần đo lại trước nghiệm thu.

### 6fcc430: kiểm tra Actions và tối ưu tiếp
CI 45394622356 xanh, SEO 100 cả 6 route, HTML 103 route, browser QA cơ bản 360/1280 không lỗi/không leak. Accessibility 100 cả 3, Performance home 86 / chart 82 / calendar 70. Artifact 14921110781: CLS lịch 0.304 do placeholder thay toàn lịch sau hydration; lunar-javascript chunk 290719 bytes, chart tải 140705-byte dữ liệu form. Theme test timeout sau lịch, contrast khi đang đổi theme; bỏ transition theme, đồng bộ hydrate và đợi DOM/state, thêm màu select tường minh. Lịch render SSR từ cache build-time giữ nguyên các giá trị lunar-javascript; regression mới so khớp tất cả năm và biên tháng, không thay thuật toán. QA server mô phỏng nén Brotli/gzip của CDN, ghi nhận rõ thay đổi điều kiện transfer; chưa kiểm chứng thực tế edge. Không giảm ngưỡng.
