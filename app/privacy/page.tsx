import Breadcrumb from '@/components/Breadcrumb';
import { pageMetadata } from '@/lib/seo/metadata';
export const metadata = pageMetadata({title:"Chính sách quyền riêng tư – Tử Vi Đẩu Số",description:"Tìm hiểu cách nền tảng xử lý và lưu trữ thông tin người dùng.",path:"/privacy"});

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumb items={[{label:'Quyền riêng tư',href:'/privacy'}]} />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Chính Sách Quyền Riêng Tư</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 11 năm 2026</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Thu thập Thông tin</h2>
        <p>Để an lập lá số Tử Vi Đẩu Số chuẩn xác, hệ thống chỉ thu thập các thông số cần thiết phục vụ tính toán:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Họ và tên (không bắt buộc)</li>
          <li>Ngày, tháng, năm sinh (Dương lịch hoặc Âm lịch)</li>
          <li>Giờ, phút, giây sinh</li>
          <li>Giới tính sinh học</li>
          <li>Tỉnh/Thành phố nơi sinh (để lấy kinh độ tính Chân Thái Dương Thời)</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Lưu trữ và Bảo mật Cục bộ</h2>
        <p>Thuật toán an sao Tử Vi Đẩu Số chạy hoàn toàn phía client (trong trình duyệt của bạn). Dữ liệu hồ sơ chỉ được lưu khi bạn chọn lưu. Có thể bật khóa PIN mã hóa AES-GCM; khi mở khóa, dữ liệu nằm trong bộ nhớ phiên của tab hiện tại. Tải lại trang sẽ khóa tab đó. PIN ngắn có thể bị dò ngoại tuyến, và mã hóa không chống được thiết bị đã bị xâm nhập.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Cookies & Bộ nhớ Cục bộ</h2>
        <p>Nền tảng sử dụng localStorage để ghi nhớ chế độ giao diện sáng/tối và danh sách các lá số bạn chủ động lưu. Không tích hợp công cụ phân tích truy cập hoặc font từ máy chủ bên ngoài trong giao diện chính.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Quyền của Người dùng</h2>
        <p>Bạn có thể xuất/nhập bản sao JSON hoặc xóa hồ sơ tại mục Hồ sơ. Tệp JSON xuất ra không được mã hóa. Không thể khôi phục kho nếu quên PIN. Xóa dữ liệu trang web trong trình duyệt cũng làm mất hồ sơ; không có bản sao trên máy chủ.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Điều khoản Sử dụng</a> · <a href="/" style={{ color: 'var(--ac)' }}>Trang Chủ</a>
        </p>
      </main>
    </>
  );
}