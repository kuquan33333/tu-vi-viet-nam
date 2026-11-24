# Audit độc lập bốn đợt – 24/11/2026

## Mốc chứng cứ

- Repo: \`kuquan33333/tu-vi-viet-nam\`; production https://lichvannien-9sv.pages.dev.
- Commit đã phát hành: \`cf2015934e95990fdfa32e3028dca1fe3dd4ee4c\`, nhánh \`revamp-v2\`, Cloudflare deployment \`705c88bf-55a1-4ed4-93a9-d4ea826bedb6\` **success**.
- Chứng cứ kiểm thử tích hợp: [CI 45403346629](https://github.com/kuquan33333/tu-vi-viet-nam/actions/runs/45403346629), [SEO/Browser 45403346623](https://github.com/kuquan33333/tu-vi-viet-nam/actions/runs/45403346623), đều **success** trên cây mã nguồn trùng bản phát hành. Bản QA mô phỏng CDN Brotli/gzip.
- Cloudflare được kiểm tra trên CDN thật: 14 route HTTP 200, /heming chuyển hướng; trang quẻ Thuần Càn khởi tạo JavaScript và không tràn 390px; HTML/JS nén br, cache HTML no-cache, JS immutable, CSP có unsafe-inline tương thích Next.js.
- Audit mã nguồn và tài liệu: \`docs/audit-baseline.md\`, \`docs/audit-seo.md\`, \`docs/audit-v4.md\`, \`docs/methodology.md\`, \`docs/triad-implementation.md\`. Các văn bản cũ ghi "chưa merge/deploy" tại thời điểm soạn; trạng thái hiện tại theo mốc commit ở trên, không xóa lịch sử.
- Không có kiểm thử bằng iPhone vật lý, dữ liệu y khoa được chuyên gia ký duyệt hoặc nghiệm thu công thức Kỳ Môn thời gia đầy đủ.

**Chú ý:** ĐẠT ở bảng dưới nghĩa là *có mã nguồn + bằng chứng QA tương ứng*, không khẳng định độ chính xác tuyệt đối của thuật số hay y học.

## Đợt 1 – baseline, L1–L8, hồi quy và nguồn

| Yêu cầu | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Baseline không sửa hành vi, typecheck/test/build | ĐẠT | PR #1 và CI tích hợp; \`.github/workflows/ci.yml\` |
| Ghi lại lỗi L1–L8; test đỏ→xanh, không xóa bằng chứng | ĐẠT | \`docs/audit-baseline.md\`, \`scripts/regression/audit-plan-update.test.ts\`, log 45370491897 (đỏ) và 45371695870 (xanh) |
| 5 tình huống golden và ngày 24/11/2026 | ĐẠT theo fixture | \`scripts/regression/golden-chart.test.ts\`; hai giờ sinh danh nhân là **giả định**, không phải tài liệu lịch sử chứng thực |
| Bao phủ toàn bộ file hồi quy, strict audit | ĐẠT | CI liệt kê/chạy từng \`scripts/regression/*.test.ts\` và strict audit |
| Đo Lighthouse/ảnh mọi kích thước mobile | MỘT PHẦN | Có 360/1280 và Lighthouse QA; bổ sung smoke 320/390/430 tại nhánh hậu kiểm, chỉ coi đạt sau run xanh |

## Đợt 2 – lỗi lõi, nơi sinh, múi giờ, lịch Việt Nam

| Yêu cầu | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| L2/L8, ID sao/cung ổn định, test hồi quy thuật toán | ĐẠT trong phạm vi fixture | \`lib/ziwei/identity.ts\`, \`patterns.ts\`, \`scripts/regression/\` |
| Nhập giờ/nơi sinh, tìm địa danh cũ, không mặc định kinh độ thiếu | ĐẠT | \`BirthForm.tsx\`, \`legacy-birthplaces.ts\`; 686/696 huyện có điểm *tham khảo*, 10 chưa xác minh |
| Chân Thái Dương Thời, giờ Tý muộn, giờ lịch sử hai vùng | ĐẠT có giới hạn | \`dst-vn.ts\`, \`true-solar-time.ts\`, \`solar-term-clock.test.ts\`; các ranh lịch sử/giờ sinh gốc cần đối chiếu giấy tờ |
| Lịch Việt Nam UTC+7 từ 1900–2050, âm lịch và an sao nhất quán | ĐẠT trong phạm vi 1900–2050 đã test | \`vn-calendar-candidate.ts\`, \`algorithm.ts\`, \`compare-vn-calendar.ts\`, \`docs/methodology.md\`; 3 biên gần nửa đêm đối chiếu JPL, chưa chứng minh mọi ngày đến giây |
| Hồ sơ cũ không đổi lịch âm sau cập nhật | ĐẠT | \`calendarVersion=legacy-cn\`, kiểm thử hồi quy; cần thông tin gốc nếu tái tính |

## Đợt 3 – SEO, URL, điều hướng

| Yêu cầu | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Canonical/OG/Twitter/JSON-LD/sitemap/robots | ĐẠT ở HTML xuất tĩnh | \`lib/seo/\`, \`check-seo-export.mjs\` |
| /heming → /hop-ban, 21 redirect chương cổ thư | ĐẠT ở QA; edge một phần | \`public/_redirects\`, \`lib/classics/chapter-slugs.ts\`. CDN chỉ kiểm tra được chuyển hướng; cần đối chiếu mã 301/Location và fragment bằng công cụ HTTP |
| Một header, breadcrumb, Công cụ, tooltip, menu mobile | ĐẠT theo Browser QA | \`AppChrome.tsx\`, \`Breadcrumb.tsx\`, \`TermTooltip.tsx\`, \`cong-cu/page.tsx\` |
| Lighthouse SEO ≥95 ở 6 route | ĐẠT tại CI | 100/100 cho 6 route trong lần chạy 45402291110, cần đo độc lập production |

## Đợt 4 – chức năng, giao diện, nguồn

| Yêu cầu | Trạng thái | Bằng chứng / giới hạn |
|---|---|---|
| Form nhập sinh chung, Hợp Bàn chọn hồ sơ hoặc nhập mới | ĐẠT | \`BirthDateTimeFields.tsx\`, \`ProfilePicker.tsx\`, \`hop-ban/page.tsx\` |
| Đối chiếu offline 12 cung, không chấm điểm tùy ý | ĐẠT về cấu trúc | \`client-reading.ts\` và \`hop-ban/page.tsx\`; không đưa ra kết luận quan hệ thực tế |
| Hồ sơ ≤30, JSON, xóa, PIN/Web Crypto | ĐẠT | \`profile-storage.ts\`, \`v4-profiles.test.ts\`, Browser QA 360/1280; PIN không khôi phục, JSON không mã hóa |
| In PDF/A4 và giao diện mobile lá số 12 cung | ĐẠT tại CI | \`revamp.css\`, Browser QA xuất PDF; chưa thử máy in và iPhone thật |
| Âm lịch/lễ/Tết/rằm/mùng 1/24 tiết khí, giờ giao tiết và in tháng | ĐẠT trong phạm vi thuật toán | \`CalendarView.tsx\`, \`calendar-display.ts\`; không áp dụng lịch nghỉ bù từng năm |
| Thiên Kỷ 64 URL quẻ, Hán văn 6 hào/nguồn | ĐẠT nguồn nhập liệu MIT, **một phần về biên khảo** | \`thien-ky/que/[so]\`, \`iching-text.generated.json\`; bản dịch và rà dị bản còn thiếu |
| Kỳ Môn | MỘT PHẦN | Chỉ địa bàn, thủ công chọn tiết khí/nguyên; chưa có Thiên bàn/Trực Phù/Bát thần thời gia; không tuyên bố hoàn chỉnh |
| Địa Kỷ | MỘT PHẦN | Có La Kinh, Bát Trạch, phiếu hình thế; thiếu GIS/Huyền Không thực địa |
| Nhân Kỷ | MỘT PHẦN | Danh mục 361 mã và 16 chuyên đề, iframe 3D tùy chọn; thiếu toàn văn có quyền dùng và tọa độ huyệt được y khoa xác nhận |
| Accessibility, hiệu năng, dark mode | ĐẠT theo gate CI | Performance mobile: home 91, chart 97, calendar 98; Accessibility 100 ba trang; SEO 100 sáu trang (trên QA nén), axe-core contrast sáng/tối đạt 360/1280 |
| Không gửi dữ liệu sinh ra mạng ngoài | ĐẠT trong kịch bản QA | \`check-browser-interaction.mjs\`: dữ liệu sinh tổng hợp, 0 request rò, 0 pageerror trong môi trường kiểm soát; không phải kiểm toán bảo mật toàn diện |

## Các khoảng trống không được giả định là đã hoàn thành

1. **Bản dịch Việt 384 hào và phê bình văn bản:** nguyên văn Hán có dữ liệu nhưng không được bịa bản dịch hoặc lời quẻ; bản quyền/dị bản phải kiểm duyệt.
2. **Kỳ Môn thời gia đầy đủ:** chưa có thuật toán có nguồn đủ tin cậy và fixture độc lập; không nhập kết quả từ iframe làm kết quả nội bộ.
3. **Địa Kỷ/GIS/Huyền Không:** không tự tạo dữ liệu địa chính, quy chuẩn xây dựng hoặc công thức khi chưa xác minh trường phái.
4. **Nhân Kỷ:** không tạo hình/vị trí huyệt để hướng dẫn châm cứu; cần chuyên gia và quyền sử dụng y thư.
5. **Giới hạn kỹ thuật:** Cloudflare Pages static loại các API server; khóa PIN chỉ bảo vệ kho cục bộ trong phạm vi thiết bị/trình duyệt; không có đồng bộ; chưa đo INP hiện trường, LCP/CLS trên iPhone thật.
6. **Giấy phép:** \`docs/tianji-ziwei\` dùng CC BY-NC-SA riêng và không tự động phù hợp triển khai thương mại; không áp dụng MIT của mã nguồn cho tất cả tài liệu.

## Thay đổi của lượt hậu kiểm và cổng phát hành

- Sửa giao diện nút nhập JSON để không hiển thị \`input[type=file]\` thô trên mobile; giữ keyboard focus và tên truy cập.
- Mở rộng Browser QA sang **320, 390, 430 px**, kiểm tra 10 route/viewport, không tràn ngang, hydration, H1, bottom nav, menu và lỗi JS; giữ nguyên bộ 360/1280 tương tác + contrast.
- Bổ sung E2E **xuất JSON → kiểm tra nội dung → nhập lại trùng mã không nhân đôi hồ sơ**, trước khi khóa PIN.
- Cập nhật README: ngừng mô tả 182 chuyên đề, AI API và sách/bản dịch chưa phát hành là tính năng hoàn chỉnh; tách giấy phép MIT/CC BY-NC-SA.
- Chỉ merge và deploy sau khi **CI + SEO/Browser QA cùng xanh** trên đúng commit; so sánh tree SHA; kiểm tra CDN. Cloudflare auto-deploy phải duy trì tắt để tiết kiệm quota.

Bản này là audit mã nguồn/tài liệu, không thay thế thẩm định văn bản truyền thống, hiệu năng hiện trường hay rà soát pháp lý chuyên môn.


## Hậu kiểm điều khoản, chính sách và địa chỉ

- **Phát hiện đã sửa:** \`app/terms/page.tsx\` của phiên bản trước cấm "đảo ngược mã nguồn" và giới hạn mục đích cá nhân chung cho toàn nền tảng, mâu thuẫn với phạm vi MIT đã công bố. Bản mới tách quyền mã nguồn MIT khỏi dữ liệu nguồn có giấy phép riêng, không cấm việc nghiên cứu code hợp pháp.
- **Phát hiện đã sửa:** \`app/privacy/page.tsx\` cũ chưa giải thích kết nối khi chủ động nhúng atlas 3D/Kỳ Môn bên ngoài. Bản mới nêu rõ dữ liệu sinh tại trình duyệt, PIN Web Crypto, tệp JSON bản rõ và thông tin kỹ thuật hạ tầng.
- **Phát hiện đã sửa:** \`README.en.md\` cũ có tuyên bố về toàn văn cổ thư, giờ sinh danh nhân "verified", AI trực tiếp và 100% Việt hóa mà không đủ cơ sở. Bản mới đồng bộ trạng thái đã triển khai với README tiếng Việt.
- **Chưa đúng mục tiêu tên miền ngắn:** production đang là \`lichvannien-9sv.pages.dev\`, chưa xác minh khả năng sử dụng \`lichvannien.pages.dev\`. Không tự đổi domain khi chưa kiểm chứng quyền sở hữu.
- **Ngoài bốn đợt web:** repo chưa có ứng dụng Android/iOS native; trình duyệt điện thoại dùng bản web responsive, không tương đương ứng dụng cài trên máy.
