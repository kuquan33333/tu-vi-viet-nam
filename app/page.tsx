import Link from 'next/link';
import Image from 'next/image';
import { ButtonLink, Container, Eyebrow, Icon } from '@/components/ui';
import type {IconName} from '@/components/Icon';
import BrandMark,{Ornament} from '@/components/ui/BrandMark';
import ChartGrid from '@/components/ui/ChartGrid';
import HomeCalendar from '@/components/ui/HomeCalendar';
import { generateChart } from '@/lib/ziwei/algorithm';
import { BRANCHES } from '@/lib/ziwei/constants';
import { FAMOUS_PERSONS } from '@/lib/ziwei/famous';
import { buildCalendarYear } from '@/lib/ziwei/calendar-display-server';
import { vietnamToday } from '@/lib/ziwei/calendar-display';
import { pageMetadata, SITE_DESCRIPTION, websiteSchema } from '@/lib/seo/metadata';
import './home.css';

export const metadata=pageMetadata({title:'Tử Vi Việt Nam – Thư quán phương Đông',description:SITE_DESCRIPTION,path:'/'});
const primary:{href:string;title:string;desc:string;icon:IconName}[]=[
 {href:'/chart',title:'Lập lá số',desc:'An sao, lập lá số Tử Vi Đẩu Số theo lịch Việt Nam.',icon:'yin-yang'},
 {href:'/lich-van-nien',title:'Lịch Vạn Niên',desc:'Tra cứu âm dương lịch, tiết khí, Can Chi và ngày lễ.',icon:'calendar'},
 {href:'/hop-ban',title:'Hợp bàn',desc:'Đối chiếu hai lá số và cấu trúc 12 cung.',icon:'compare'},
 {href:'/library',title:'Cổ thư',desc:'Tra cứu, đọc và nghiên cứu kinh điển Tử Vi, cổ học phương Đông.',icon:'book'},
];
const modules=[
 {href:'/chart',title:'Tử Vi Đẩu Số',desc:'12 cung, 14 chính tinh, đại hạn, lưu niên.'},
 {href:'/thien-ky',title:'Thiên Kỷ',desc:'Chu Dịch 64 quẻ, bảng địa bàn cửu cung.'},
 {href:'/dia-ky',title:'Địa Kỷ',desc:'La Kinh 24 sơn, Bát Trạch, la bàn số.'},
 {href:'/nhan-ky',title:'Nhân Kỷ',desc:'Atlas 361 huyệt, thuật ngữ Đông y (để học tập).'},
];
const tools=[
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
 const today=vietnamToday();
 const calendarData=Object.fromEntries([today.year-1,today.year,today.year+1].filter(y=>y>=1900&&y<=2050).map(y=>[y,buildCalendarYear(y)]));
 return <main className="home2 home-brand">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema()).replace(/</g,'\\u003c')}}/>
  <section className="home2-hero" aria-labelledby="home2-title">
   <picture className="hero-blossom-picture"><source srcSet="/brand/blossom-pc.svg" type="image/svg+xml"/><Image unoptimized src="/brand/blossom.webp" alt="" width={100} height={61} className="hero-blossom" loading="eager"/></picture>
   <Container className="home2-hero-grid">
    <div className="hero-logo"><BrandMark hero/></div>
    <div className="home2-intro">
     <h1 id="home2-title">Khám phá Tử Vi Đẩu Số <em>theo phong cách<br/> Thư quán phương Đông</em></h1>
     <Ornament/>
     <p className="home2-lead">Kết hợp tinh hoa cổ học phương Đông và công nghệ hiện đại, giúp bạn khám phá lá số, lịch pháp và những quan niệm truyền thống. Mọi phép tính thực hiện trên thiết bị, ghi rõ nguồn và giới hạn.</p>
     <div className="home2-actions"><ButtonLink href="/chart" variant="primary" className="brand-primary"><Icon name="yin-yang" size={21}/> Lập lá số ngay <Icon name="arrow" size={16}/></ButtonLink><ButtonLink href="/library" variant="secondary" className="brand-secondary"><Icon name="book" size={21}/> Khám phá Thư viện <Icon name="arrow" size={16}/></ButtonLink></div>
    </div>
    <div className="hero-art" aria-hidden="true"><picture><source srcSet="/brand/study-pc.webp" type="image/webp"/><Image unoptimized src="/brand/study.webp" alt="" width={256} height={228} loading="eager"/></picture></div>
   </Container>
  </section>
  <Container className="home-primary-grid" role="navigation" aria-label="Công cụ nổi bật">
   {primary.map(p=><Link className="brand-frame home-primary-card" key={p.href} href={p.href} prefetch={false}><Icon name={p.icon} size={42}/><div><h2>{p.title}</h2><p>{p.desc}</p></div><span className="home-primary-arrow"><Icon name="arrow" size={16}/></span></Link>)}
  </Container>
  <Container className="home-preview-grid">
   <section className="brand-frame home-chart" aria-labelledby="home-chart-title">
    <div className="home-panel-head"><h2 id="home-chart-title"><Icon name="chart" size={24}/> Lá số Tử Vi mẫu</h2><Link href="/chart" prefetch={false}>Xem chi tiết <Icon name="arrow" size={16}/></Link></div>
    <div className="home-chart-body"><ChartGrid showNames palaces={sample.palaces} center={<><span className="home2-sample-title">Lá số<br/> Tử Vi</span><Ornament/></>}/>
     <div className="home-chart-facts"><h3><Icon name="user" size={18}/> Thông tin lá số</h3><dl><dt>Họ tên</dt><dd>{person.name}</dd><dt>Giới tính</dt><dd>{person.gender==='male'?'Nam':'Nữ'}</dd><dt>Ngày sinh</dt><dd>{date}</dd><dt>Giờ sinh</dt><dd>Giờ {BRANCHES[person.hour]} (ước tính)</dd><dt>Mệnh</dt><dd>{BRANCHES[sample.mingGongBranch]}</dd><dt>Cục</dt><dd>{sample.wuxingJuName}</dd></dl></div>
    </div><p className="home-chart-note">Mẫu danh nhân dùng để nghiên cứu, giờ sinh ước tính. Ngày ngoài phạm vi lịch Việt Nam 1900–2050 sử dụng lịch tham chiếu cũ.</p>
   </section>
   <HomeCalendar initial={today} data={calendarData}/>
  </Container>
  <section className="home2-modules" aria-labelledby="home2-modules-title"><Container><Eyebrow>Bốn phân hệ</Eyebrow><h2 id="home2-modules-title">Chọn lĩnh vực bạn quan tâm</h2><div className="home2-module-grid">{modules.map((m,i)=><Link prefetch={false} key={m.href} href={m.href} className="brand-frame home2-module"><span className="ui-eyebrow">{String(i+1).padStart(2,'0')}</span><h3>{m.title}</h3><p>{m.desc}</p><Icon name="arrow" size={18}/></Link>)}</div></Container></section>
  <section className="home2-tools" aria-labelledby="home2-tools-title"><Container><div className="home2-section-head"><div><Eyebrow>Công cụ</Eyebrow><h2 id="home2-tools-title">Thường dùng</h2></div><Link prefetch={false} className="home2-all" href="/cong-cu">Xem tất cả <Icon name="arrow" size={18}/></Link></div><div className="home2-tool-grid">{tools.map(t=><Link prefetch={false} key={t.title} href={t.href} className="brand-frame home2-tool"><strong>{t.title}</strong><span>{t.desc}</span></Link>)}</div></Container></section>
  <section className="section-dark home2-method" aria-labelledby="home2-method-title"><Container className="home2-method-inner"><div><h2 id="home2-method-title">Minh bạch phương pháp</h2><p>Các nội dung Tử Vi, Kinh Dịch và phong thủy phản ánh hệ thống quan niệm truyền thống, không phải dự báo được khoa học xác nhận. Phần Nhân Kỷ dành cho học tập, không cung cấp chẩn đoán hay hướng dẫn tự điều trị, không thay thế tư vấn y tế. Nội dung, dữ liệu và các công cụ chuyên sâu sẽ được mở rộng cùng tài liệu nguồn được xác minh.</p></div><ButtonLink href="/terms#nguon-va-giay-phep" variant="secondary" className="home2-source">Nguồn và giấy phép</ButtonLink></Container></section>
 </main>;
}
