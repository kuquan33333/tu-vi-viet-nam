import Breadcrumb from '@/components/Breadcrumb';
import {pageMetadata} from '@/lib/seo/metadata';
export const metadata=pageMetadata({title:'Điều khoản sử dụng – Tử Vi Đẩu Số',description:'Phạm vi sử dụng công cụ cổ học, trách nhiệm người dùng và giấy phép mã nguồn/dữ liệu.',path:'/terms'});

export default function TermsPage(){
 return <>
  <Breadcrumb items={[{label:'Điều khoản sử dụng',href:'/terms'}]}/>
  <main className="site-wrap ui5-page ui5-legal">
   <h1 style={{fontSize:28,fontWeight:750,marginBottom:8}}>Điều khoản sử dụng</h1>
   <p style={{fontSize:12,color:'var(--tx-3)',marginBottom:26}}>Cập nhật 24/11/2026 · Phạm vi bản website Cloudflare Pages</p>

   <nav className="ui-card ui5-legal-toc" aria-label="Mục lục"><p className="ui-eyebrow">Mục lục</p><ol><li><a href="#muc-1">1. Phạm vi và mục đích</a></li><li><a href="#muc-2">2. Sự không chắc chắn và an toàn</a></li><li><a href="#nguon-va-giay-phep">3. Mã nguồn, thư tịch và quyền sử dụng</a></li><li><a href="#muc-4">4. Quyền riêng tư và dịch vụ bên ngoài</a></li><li><a href="#muc-5">5. Trách nhiệm người dùng</a></li></ol></nav>
   <h2 id="muc-1">1. Phạm vi và mục đích</h2>
   <p>Website cung cấp công cụ tra cứu và tìm hiểu Tử Vi Đẩu Số, Kinh Dịch, La Kinh, Bát Trạch, lịch pháp và một số tư liệu y học cổ truyền. Đây là nội dung văn hóa, học thuật và giải trí có ghi phương pháp, không phải hệ thống dự báo được kiểm chứng khoa học.</p>
   <p>Không sử dụng kết quả của website thay cho quyết định dựa trên chứng cứ, hoặc tư vấn y tế, pháp lý, tài chính, xây dựng và những lĩnh vực cần chuyên gia có giấy phép.</p>

   <h2 id="muc-2">2. Sự không chắc chắn và an toàn</h2>
   <p>Kết quả lá số chịu ảnh hưởng của ngày âm, giờ sinh, kinh độ, quy tắc giờ Tý và phiên bản lịch. Những trường hợp giờ sinh chưa rõ, chuyển múi giờ lịch sử, tiết khí hoặc sóc gần nửa đêm có thể có nhiều cách xác định; phần mềm chỉ diễn giải theo phương pháp ghi trong tài liệu, không bảo đảm sự thật về cá nhân.</p>
   <p>Nhân Kỷ không chẩn đoán bệnh, hướng dẫn châm cứu, kê đơn hoặc tự điều trị. Địa Kỷ không thay thế khảo sát địa chất, hồ sơ địa chính hay quy chuẩn xây dựng.</p>

   <h2 id="nguon-va-giay-phep">3. Mã nguồn, thư tịch và quyền sử dụng</h2>
   <p>Dự án phát triển từ mã nguồn của <a href="https://github.com/naot7/tu-vi-viet-nam" target="_blank" rel="noopener noreferrer">naot7/tu-vi-viet-nam</a>. Mã nguồn thuộc phạm vi giấy phép <a href="https://github.com/kuquan33333/tu-vi-viet-nam/blob/revamp-v2/LICENSE" target="_blank" rel="noopener noreferrer">MIT của repository</a> có thể được sử dụng, sửa đổi, phân phối theo các điều khoản MIT. Website không đặt ra lệnh cấm chung với việc đọc, sửa đổi hoặc nghiên cứu mã nguồn hợp pháp.</p>
   <p>Các tư liệu, bản ghi cổ thư, hình ảnh, dữ liệu huyệt đạo và nội dung do bên thứ ba cung cấp có giấy phép riêng. Một số tệp nghiên cứu trong <code>docs/tianji-ziwei/</code> thuộc CC BY-NC-SA 4.0, không phải MIT và có giới hạn phi thương mại; việc tái sử dụng cần kiểm tra đúng quyền của từng nguồn. Không mặc định mọi nội dung trang đều thuộc sở hữu độc quyền của website.</p>

   <h2 id="muc-4">4. Quyền riêng tư và dịch vụ bên ngoài</h2>
   <p>Lá số và kho hồ sơ được xử lý cục bộ theo <a href="/privacy">Chính sách quyền riêng tư</a>. Việc chọn mở ứng dụng Kỳ Môn hoặc atlas 3D bên ngoài có thể tạo yêu cầu mạng tới nhà cung cấp đó; trang ngoài áp dụng chính sách riêng.</p>

   <h2 id="muc-5">5. Trách nhiệm người dùng</h2>
   <p>Không dùng website để vi phạm pháp luật, xâm phạm quyền tác giả, xâm nhập trái phép hoặc phát tán thông tin cá nhân của người khác. Khi sử dụng lại mã nguồn hoặc nội dung, người dùng cần tuân thủ giấy phép áp dụng cho phần được sử dụng và các quy định liên quan.</p>
   <p style={{fontSize:12,color:'var(--tx-3)',marginTop:32}}>Các điều khoản này mô tả phạm vi công cụ đang cung cấp; không phải ý kiến pháp lý cá biệt. Với tranh chấp quyền hoặc nội dung có nguồn không rõ, cần rà soát riêng trước khi khai thác thương mại.</p>
  </main>
 </>;
}
