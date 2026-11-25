# UI-5 – Các trang còn lại
Baseline UI-4: c81b0b95a0662e44b541873fea4e83a1deec7568. Đọc UI-BRIEF.md trong ZIP mục UI-5; chủ dự án cho phép tự động chuyển giai đoạn. Giữ production cũ, không deploy.
- Hub: thẻ UI-1, lưới 3/2/1. Thiên Kỷ: SVG sáu hào đánh số và chữ Động; hai cột tìm kiếm/danh sách và chi tiết, ba bước giải thích (không thay thuật toán gieo), quẻ chủ/quẻ biến có nhãn.
- Địa Kỷ: giữ cảm biến và tính hướng/tọa, thêm tên 24 sơn và góc lớn.
- Nhân Kỷ và các phân hệ: tabs dùng component roving focus, aria-controls/tabpanel, phím mũi tên/Home/End; gộp cảnh báo tự điều trị ở đầu Nhân Kỷ; giữ chú thích giới hạn dữ liệu.
- Thư viện: tên sách serif, tác giả và thời kỳ xuống dòng, bố cục đọc 680px, chữ 18px/1.8, chữ Hán 20px khi có. Các đoạn hiện có chủ yếu phiên âm Hán-Việt; không tự tạo nguyên văn chữ Hán, hiển thị thông báo thiếu dữ liệu. Giữ bản dịch, chú giải, liên kết/chapter slug và anchor đoạn. Mục lục sticky bên trái desktop và phía trên mobile.
- Hợp bàn: giữ engine và chọn hồ sơ, hai khối desktop, switch mobile hiện có; báo cáo 12 cung dạng thẻ. Hồ sơ: dòng ngày giờ, nút mở/in/xóa riêng, JSON và PIN giữ nguyên, trạng thái rỗng CTA. In mở hồ sơ trước, chờ font rồi gọi print; không đưa dữ liệu sinh vào URL.
- Privacy/Terms: giữ nguyên văn, 720px và TOC; không làm mới nội dung pháp lý. Trang 404 và error có điều hướng. Breadcrumb hiện có giữ nguyên, 404 thêm breadcrumb; lỗi runtime không thêm breadcrumb động.
- Không chỉnh lib/, dữ liệu hay thuật toán. Trang đọc thiếu nguyên văn Hán là giới hạn nguồn. Cần kiểm thử UI-5 thực tế trước merge. QA trước/sau 360/768/1280, bàn phím các tab, SVG, góc đối hướng, danh mục, chương, hồ sơ, axe và overflow. Các gate CI/SEO cũ giữ nguyên.

## Hậu kiểm
- cd00b60: CI và SEO xanh, UI-5 before xanh; after lỗi axe `link-in-text-block` tại liên kết đọc hào động quẻ 63 ở 360px. Gạch chân liên kết nội dung, không đổi thẻ/nút. Giữ gate serious/critical; thêm xác minh gạch chân. QA thu thập lỗi độc lập theo route và kích thước, vẫn fail toàn workflow nếu bất kỳ mục nào lỗi. Chụp thêm tab thứ hai. Bổ sung kiểm thử nút In A4 trong Hồ sơ bằng hồ sơ mẫu thật, xác minh mở đúng lá số, gọi print và xuất PDF một trang. Mục Nguồn và giấy phép hiện nằm trong /terms#nguon-va-giay-phep, không có route độc lập; TOC giữ liên kết này. Chưa nghiệm thu.
