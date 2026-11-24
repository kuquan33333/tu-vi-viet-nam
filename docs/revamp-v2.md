# V2 — Cổ học đương đại (nhánh revamp-v2)

## Các thay đổi đã triển khai

- Giao diện chung AppChrome, điều hướng PC/mobile, theme sáng/tối, menu dưới mobile.
- Trang chủ mới với bốn nhánh Tử Vi, Thiên Kỷ, Địa Kỷ, Nhân Kỷ và liên kết công cụ.
- Trang /chart: bàn 12 cung giữ nguyên thuật toán, TimeNav đồng bộ, chú giải sao/cung có dữ kiện, lưu cục bộ, in/PDF.
- Trang /heming: báo cáo so sánh 12 cung offline, không phụ thuộc API AI vắng mặt.
- Trang /ho-so: mở lại, xóa, xem danh sách hồ sơ trên máy.
- Trang /lich-van-nien: xem lịch âm dương, Can Chi và 24 tiết khí theo dữ liệu thuật toán hiện có.
- Trang /knowledge: 14 chính tinh có dữ liệu, không giả định 182 bài chưa có.
- Sitemap cập nhật trang thực; không liệt kê các route 404.
- Thiên Kỷ, Địa Kỷ, Nhân Kỷ giữ chức năng bản demo, dùng chung design tokens và điều hướng.

## Chưa ở mức hoàn thiện nghiên cứu chuyên sâu

- Kỳ Môn vẫn cần thời gia bàn đầy đủ và kiểm chứng đa trường phái.
- Kinh Dịch hiện có danh mục 64 quẻ và chủ đề, chưa có 384 hào từ/bản dịch được kiểm duyệt.
- Địa Kỷ còn thiếu bản đồ nhà ở/GIS/Huyền Không Phi Tinh.
- Nhân Kỷ chưa có toàn văn kinh điển có xác nhận bản quyền; atlas 3D từ nguồn ngoài.
- Không kích hoạt các API AI trả phí khi không có cấu hình/ủy quyền.
- Cần E2E test thiết bị Safari thật và kiểm tra vị trí huyệt y học.

## Phát hành
- Tất cả sửa đổi trên nhánh revamp-v2; main và cloudflare-demo giữ nguyên.
- Build command Cloudflare: kiểm thử triad, kiểm thử revamp, chuẩn bị export, Next.js build.
- Trạng thái chỉ được xác nhận sau khi deployment qua và kiểm tra trình duyệt.

## QA mobile V2 (24/11/2026)

- Cloudflare build/deploy success Next.js 16 trên nhánh revamp-v2.
- Trên viewport 390px: trang chủ không tràn ngang, CTA không bị cắt, bottom navigation hiển thị.
- /chart: chọn ngày sinh và submit tạo lá số, chỉ một TimeNav, panel chú giải hiển thị, không tràn ngang.
- /heming: chuyển A/B trên mobile đúng, không tràn ngang.
- /lich-van-nien: lịch 42 ô tháng hiện tại, Can Chi và dữ liệu âm lịch hiển thị; tên Can Chi và tiết khí được Việt hóa tại lớp hiển thị.
- 11 URL chính đều trả HTTP 200 qua browser render.
- Kiểm thử độc lập P3–P5 chuyên sâu và thử trên iPhone vật lý vẫn cần bổ sung.
