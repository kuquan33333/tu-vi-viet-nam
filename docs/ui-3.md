# UI-3 – Lập lá số
Baseline UI-2: 977ba99fda103d2c1dcfd555b0280197135af9cb. Đọc UI-BRIEF.md mục UI-3 và chart-form.html trong ZIP chủ dự án. Cloudflare không triển khai production trong đợt này.

## Phạm vi
- BirthForm và BirthDateTimeFields dùng lại toàn bộ hàm chuyển đổi/validation engine, thêm lựa chọn giới tính bắt buộc trên /chart; giữ cách nhập Hợp bàn cũ cho UI-5. Không thay kiểu BirthFormState của engine.
- Form hai cột 600px + thẻ xem trước, một cột dưới 1024. Giữ 3 trường ngày/tháng/năm thay ô text duy nhất trong mẫu để dùng lại kiểm thử và tránh nhập ngày mơ hồ. Dương lịch là chế độ nhập, không phải giá trị ngày mặc định. Múi giờ và kinh độ nước ngoài để trống. Giữ giây, địa danh cũ, kinh độ tham khảo, quy ước Tý muộn và giờ lịch sử.
- Khi không nhớ giờ sinh, giữ tính năng 12 phương án có điều kiện và cảnh báo, không tạo/lưu một lá số xác định. Khác với mẫu nói ẩn Mệnh/Thân: các giá trị có điều kiện trong 12 phương án vẫn được hiển thị như trước, không khẳng định kết quả thật.
- Bàn 4×4 hiện có được nâng cấp trình bày, giữ Tam phương Tứ chính và overlay đại hạn/lưu niên. Noto Serif 700 đã có từ UI-1 (brief muốn 600 cho chính tinh, chưa thêm font mới). Mobile danh sách mặc định, có nút đổi sang bàn cuộn riêng. Panel chi tiết mở bằng sao/cung, Esc và nút đóng. PNG dùng ShareCardCanvas + html2canvas hiện có, không tạo URL chứa thông tin sinh. Không sửa lib/ hoặc dữ liệu.
- Kiểm thử CI/SEO và browser cũ giữ nguyên; cập nhật test chọn giới tính. UI-3 workflow before/after ở 360/768/1280, lỗi nhập liệu, focus, nước ngoài, giờ chưa biết, bàn, panel, tải PNG, in PDF, axe form và ảnh chụp. Chưa nghiệm thu cho tới khi có kết quả thực tế và rà ảnh/PDF. Kiểm tra Safari/trình đọc màn hình thật chưa thực hiện.
