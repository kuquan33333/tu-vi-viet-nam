import Breadcrumb from '@/components/Breadcrumb';
import {pageMetadata} from '@/lib/seo/metadata';
export const metadata=pageMetadata({title:'Chính sách quyền riêng tư – Tử Vi Đẩu Số',description:'Dữ liệu lá số được tính trên thiết bị, tùy chọn lưu hồ sơ cục bộ, PIN và quyền riêng tư của nguồn ngoài.',path:'/privacy'});

export default function PrivacyPage(){
 return <>
  <Breadcrumb items={[{label:'Quyền riêng tư',href:'/privacy'}]}/>
  <main className="site-wrap ui5-page ui5-legal">
   <h1 style={{fontSize:28,fontWeight:750,marginBottom:8}}>Chính sách quyền riêng tư</h1>
   <p style={{fontSize:12,color:'var(--tx-3)',marginBottom:26}}>Cập nhật 24/11/2026 · Phạm vi website đang triển khai</p>

   <nav className="ui-card ui5-legal-toc" aria-label="Mục lục"><p className="ui-eyebrow">Mục lục</p><ol><li><a href="#muc-1">1. Dữ liệu bạn nhập</a></li><li><a href="#muc-2">2. Lưu trên thiết bị</a></li><li><a href="#muc-3">3. Xuất, nhập và xóa</a></li><li><a href="#muc-4">4. Tài nguyên và trang bên ngoài</a></li><li><a href="#muc-5">5. Quyền kiểm soát</a></li></ol></nav>
   <h2 id="muc-1">1. Dữ liệu bạn nhập</h2>
   <p>Biểu mẫu có thể nhận tên (không bắt buộc), ngày và giờ sinh, quy ước nam/nữ của thuật số cổ truyền, nơi sinh, kinh độ và lựa chọn trường phái/giờ lịch sử. Việc lập lá số và đối chiếu hai lá số trong bản Pages tĩnh chạy trong trình duyệt, không gửi các giá trị sinh đó tới API AI.</p>

   <h2 id="muc-2">2. Lưu trên thiết bị</h2>
   <p>Hồ sơ chỉ được lưu khi bạn bấm lưu; tối đa 30 hồ sơ tại một trình duyệt. Các mục dùng <code>localStorage</code> gồm hồ sơ, chế độ sáng/tối và dữ liệu gieo quẻ nếu bạn dùng tính năng lưu lịch sử; <code>sessionStorage</code> hỗ trợ mở hồ sơ vừa chọn. Dữ liệu không tự đồng bộ sang thiết bị khác.</p>
   <p>Bạn có thể khóa kho hồ sơ bằng PIN 6–12 chữ số. Trình duyệt sử dụng Web Crypto với PBKDF2/SHA-256 và AES-256-GCM. Khóa giải mã chỉ được duy trì trong bộ nhớ phiên trang đã mở; tải lại sẽ khóa. PIN ngắn có thể bị dò khi người khác có bản mã; tính năng không bảo vệ máy bị chiếm quyền hoặc trang đã mở khóa.</p>
   <p>Nếu không bật PIN, hồ sơ cục bộ được lưu dưới dạng dữ liệu đọc được. Nếu quên PIN, website không có cơ chế khôi phục kho đã mã hóa.</p>

   <h2 id="muc-3">3. Xuất, nhập và xóa</h2>
   <p>Mục Hồ sơ hỗ trợ xuất/nhập JSON và xóa. <strong>Tệp JSON xuất ra là bản rõ, không được mã hóa</strong> ngay cả khi kho đang bật PIN: bạn cần tự bảo quản an toàn và không chia sẻ file có thông tin sinh nếu không cần thiết. Xóa dữ liệu của trình duyệt cũng có thể làm mất toàn bộ hồ sơ; không có bản sao máy chủ.</p>

   <h2 id="muc-4">4. Tài nguyên và trang bên ngoài</h2>
   <p>Ứng dụng chính không nhúng font hoặc thư viện theo dõi lượt xem bên ngoài. Khi bạn chủ động mở các công cụ tham khảo như Kỳ Môn hoặc atlas huyệt đạo 3D, trình duyệt có thể kết nối tới tên miền của tác giả; nhà cung cấp có thể nhận địa chỉ IP và dữ liệu kết nối theo chính sách của họ. Các liên kết nguồn GitHub cũng hoạt động theo chính sách website đích.</p>
   <p>Cloudflare Pages và hạ tầng mạng vẫn có thể xử lý thông tin kỹ thuật cần thiết để phục vụ request, độc lập với dữ liệu sinh chỉ lưu cục bộ. Website không khẳng định không có bất kỳ nhật ký truy cập nào ở tầng hạ tầng.</p>

   <h2 id="muc-5">5. Quyền kiểm soát</h2>
   <p>Bạn có thể xem, xóa, xuất hoặc khóa dữ liệu đã lưu tại <a href="/ho-so">Hồ sơ</a>. Để xóa cả thiết lập giao diện và lịch sử cục bộ, hãy xóa dữ liệu của website trong cài đặt trình duyệt.</p>
   <p style={{fontSize:12,color:'var(--tx-3)',marginTop:32}}>Tài liệu này mô tả hành vi mã nguồn bản phát hành hiện tại, không áp dụng cho website ngoài mà bạn tự truy cập.</p>
  </main>
 </>;
}
