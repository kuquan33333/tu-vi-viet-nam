import Link from 'next/link';
import { ButtonLink, Container, Eyebrow, Icon } from '@/components/ui';
import ChartGrid from '@/components/ui/ChartGrid';
import { generateChart } from '@/lib/ziwei/algorithm';
import { BRANCHES } from '@/lib/ziwei/constants';
import { FAMOUS_PERSONS } from '@/lib/ziwei/famous';
import { pageMetadata, SITE_DESCRIPTION, websiteSchema } from '@/lib/seo/metadata';
import './home.css';

export const metadata = pageMetadata({title:'Tử Vi Đẩu Số – Lá số, lịch pháp và cổ học phương Đông',description:SITE_DESCRIPTION,path:'/'});

const modules = [
 {href:'/chart',title:'Tử Vi Đẩu Số',desc:'12 cung, 14 chính tinh, đại hạn, lưu niên.',short:'12 cung · 14 chính tinh',action:'Lập lá số'},
 {href:'/thien-ky',title:'Thiên Kỷ',desc:'Chu Dịch 64 quẻ, bảng địa bàn cửu cung.',short:'Chu Dịch · 64 quẻ',action:'Gieo quẻ'},
 {href:'/dia-ky',title:'Địa Kỷ',desc:'La Kinh 24 sơn, Bát Trạch, la bàn số.',short:'La Kinh · Bát Trạch',action:'Mở la bàn'},
 {href:'/nhan-ky',title:'Nhân Kỷ',desc:'Atlas 361 huyệt, thuật ngữ Đông y (để học tập).',short:'Atlas 361 huyệt · học tập',action:'Tra cứu'},
];
const tools = [
 {href:'/lich-van-nien',title:'Lịch Vạn Niên',desc:'Âm dương lịch, Can Chi, tiết khí'},
 {href:'/hop-ban',title:'Hợp bàn',desc:'Đối chiếu hai lá số theo 12 cung'},
 {href:'/thien-ky',title:'Tra cứu Kinh Dịch',desc:'64 quẻ, hào động, quẻ biến'},
 {href:'/dia-ky',title:'La Kinh 24 sơn',desc:'La bàn số theo 360 độ'},
 {href:'/nhan-ky',title:'Atlas huyệt đạo',desc:'14 kinh mạch, tìm theo mã huyệt'},
 {href:'/library',title:'Thư viện cổ thư',desc:'Trích đoạn, kèm nguồn bản'},
];

export default function HomePage(){
 const person=FAMOUS_PERSONS.find(p=>p.id==='phan-boi-chau');
 if(!person)throw new Error('Missing existing historical sample');
 const sample=generateChart({year:person.year,month:person.month,day:person.day,hour:person.hour,gender:person.gender,name:person.name});
 const date=[person.day,person.month,person.year].map(n=>String(n).padStart(2,'0')).join('/');
 return <main className="home2">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema()).replace(/</g,'\\u003c')}} />
  <section className="home2-hero" aria-labelledby="home2-title">
   <Container className="home2-hero-grid">
    <div className="home2-intro">
     <Eyebrow>Tử Vi · Chu Dịch · Phong thủy · Đông y</Eyebrow>
     <h1 id="home2-title">Lá số rõ ràng,<br className="home2-desktop-break"/> phương pháp minh bạch.</h1>
     <p className="home2-lead">Lập lá số Tử Vi theo lịch Việt Nam, tra Lịch Vạn Niên, gieo quẻ Chu Dịch. Mọi phép tính chạy trên thiết bị của bạn, có ghi rõ nguồn và giới hạn.</p>
     <div className="home2-actions">
      <ButtonLink href="/chart" variant="primary">Lập lá số</ButtonLink>
      <ButtonLink href="/lich-van-nien" variant="secondary">Xem Lịch Vạn Niên</ButtonLink>
     </div>
     <p className="home2-trust">Tính trên thiết bị · Không cần đăng ký · Ghi rõ nguồn dữ liệu</p>
    </div>
    <figure className="ui-card home2-sample">
     <ChartGrid palaces={sample.palaces} center={<>
      <strong className="home2-sample-title">Lá số mẫu</strong>
      <span>{person.name}</span><span>{date} · giờ {BRANCHES[person.hour]}</span>
     </>}/>
     <figcaption>Minh họa bố cục 12 cung. Giờ sinh ước tính từ bộ mẫu danh nhân của dự án; ngày ngoài phạm vi lịch Việt Nam 1900–2050 dùng lịch tham chiếu cũ. Chỉ để nghiên cứu, không phải hồ sơ cá nhân của người dùng.</figcaption>
    </figure>
   </Container>
  </section>
  <section className="home2-modules" aria-labelledby="home2-modules-title">
   <Container>
    <Eyebrow>Bốn phân hệ</Eyebrow>
    <h2 id="home2-modules-title">Chọn lĩnh vực bạn quan tâm</h2>
    <div className="home2-module-grid">
     {modules.map((m,i)=><Link prefetch={false} key={m.href} href={m.href} className="ui-card home2-module">
      <span className="ui-eyebrow home2-number">{String(i+1).padStart(2,'0')}</span>
      <div className="home2-module-copy">
       <h3>{m.title}</h3>
       <p className="home2-desc-full">{m.desc}</p>
       <p className="home2-desc-short">{m.short}</p>
      </div>
      <span className="home2-module-action"><span>{m.action}</span><Icon name="arrow" size={18}/></span>
     </Link>)}
    </div>
   </Container>
  </section>
  <section className="home2-tools" aria-labelledby="home2-tools-title">
   <Container>
    <div className="home2-section-head"><div><Eyebrow>Công cụ</Eyebrow><h2 id="home2-tools-title">Thường dùng</h2></div><Link prefetch={false} className="home2-all" href="/cong-cu">Xem tất cả <Icon name="arrow" size={18}/></Link></div>
    <div className="home2-tool-grid">
     {tools.map(t=><Link prefetch={false} key={t.title} href={t.href} className="ui-card home2-tool">
      <strong>{t.title}</strong><span>{t.desc}</span>
     </Link>)}
    </div>
   </Container>
  </section>
  <section className="section-dark home2-method" aria-labelledby="home2-method-title">
   <Container className="home2-method-inner">
    <div><h2 id="home2-method-title">Minh bạch phương pháp</h2>
     <p>Các nội dung Tử Vi, Kinh Dịch và phong thủy phản ánh hệ thống quan niệm truyền thống, không phải dự báo được khoa học xác nhận. Phần Nhân Kỷ dành cho học tập, không cung cấp chẩn đoán hay hướng dẫn tự điều trị, không thay thế tư vấn y tế. Nội dung, dữ liệu và các công cụ chuyên sâu sẽ được mở rộng cùng tài liệu nguồn được xác minh.</p>
    </div>
    <ButtonLink href="/terms#nguon-va-giay-phep" variant="secondary" className="home2-source">Nguồn và giấy phép</ButtonLink>
   </Container>
  </section>
 </main>;
}
