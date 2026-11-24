import Link from 'next/link';
import { pageMetadata } from '@/lib/seo/metadata';
export const metadata=pageMetadata({title:'Công cụ cổ học phương Đông – Tử Vi Đẩu Số',description:'Lập lá số, hợp bàn, lịch vạn niên, Kinh Dịch, Kỳ Môn, La Kinh, Bát Trạch và tra cứu cổ thư.',path:'/cong-cu'});
const tools=[
 {href:'/chart',icon:'☷',title:'Lập lá số',desc:'Khám phá 12 cung, 14 chính tinh và đại hạn.'},
 {href:'/hop-ban',icon:'∞',title:'Hợp bàn',desc:'Đối chiếu cấu trúc hai lá số.'},
 {href:'/lich-van-nien',icon:'◷',title:'Lịch Vạn Niên',desc:'Âm dương lịch, Can Chi và tiết khí.'},
 {href:'/thien-ky',icon:'☯',title:'Thiên Kỷ',desc:'Kinh Dịch 64 quẻ và địa bàn Kỳ Môn.'},
 {href:'/dia-ky',icon:'⊕',title:'Địa Kỷ',desc:'La Kinh 24 sơn, Bát Trạch và hình thế.'},
 {href:'/nhan-ky',icon:'✺',title:'Nhân Kỷ',desc:'Y thư và danh mục huyệt đạo để tham khảo.'},
 {href:'/library',icon:'▤',title:'Thư viện cổ thư',desc:'Đọc các sách và tra cứu bản dịch hiện có.'},
 {href:'/knowledge',icon:'✳',title:'Kho kiến thức',desc:'Tìm hiểu 14 chính tinh.'},
 {href:'/ho-so',icon:'◇',title:'Hồ sơ',desc:'Quản lý lá số đã lưu trên thiết bị.'},
];
export default function ToolsPage(){return <main className="site-wrap" style={{paddingTop:36,paddingBottom:64}}>
 <div className="eyebrow">THƯ QUÁN PHƯƠNG ĐÔNG</div><h1 className="study-title" style={{margin:'14px 0'}}>Công cụ cổ học phương Đông</h1>
 <p className="lead" style={{marginBottom:28}}>Tìm công cụ tính toán và tra cứu phù hợp. Nội dung phục vụ nghiên cứu văn hóa và tham khảo.</p>
 <div className="tool-hub-grid">{tools.map(t=><Link className="surface-card tool-hub-card" key={t.href} href={t.href}><span className="icon-round" aria-hidden="true">{t.icon}</span><h2>{t.title}</h2><p>{t.desc}</p><span className="section-link">Mở công cụ <span aria-hidden="true">→</span></span></Link>)}</div>
 </main>}
