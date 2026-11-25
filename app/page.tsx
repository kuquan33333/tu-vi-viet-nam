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
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import './home.css';

export const metadata=pageMetadata({title:'Tử Vi Việt Nam – Thư quán phương Đông',description:SITE_DESCRIPTION,path:'/'});
const primary:{href:string;title:string;desc:string;icon:IconName}[]=[
 {href:'/hop-ban',title:'Hợp bàn',desc:'Đối chiếu hai lá số và cấu trúc 12 cung.',icon:'compare'},
 {href:'/thien-ky',title:'Thiên Kỷ',desc:'Kinh Dịch 64 quẻ, địa bàn cửu cung.',icon:'yin-yang'},
 {href:'/dia-ky',title:'Địa Kỷ',desc:'La Kinh 24 sơn, Bát Trạch và la bàn số.',icon:'compass'},
 {href:'/nhan-ky',title:'Nhân Kỷ',desc:'Atlas huyệt đạo, kiến thức Đông y để học tập.',icon:'health'},
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
  <Container className="home-preview-grid">
   <section className="brand-frame home-chart" aria-labelledby="home-chart-title">
    <div className="home-panel-head"><h2 id="home-chart-title"><Icon name="chart" size={24}/> Lá số Tử Vi mẫu</h2><Link href="/chart" prefetch={false}>Xem chi tiết <Icon name="arrow" size={16}/></Link></div>
    <div className="home-chart-body"><ChartGrid showNames palaces={sample.palaces} center={<><span className="home2-sample-title">Lá số<br/> Tử Vi</span><Ornament/></>}/>
     <div className="home-chart-facts"><h3><Icon name="user" size={18}/> Thông tin lá số</h3><dl><dt>Họ tên</dt><dd>{person.name}</dd><dt>Giới tính</dt><dd>{person.gender==='male'?'Nam':'Nữ'}</dd><dt>Ngày sinh</dt><dd>{date}</dd><dt>Giờ sinh</dt><dd>Giờ {BRANCHES[person.hour]} (ước tính)</dd><dt>Mệnh</dt><dd>{BRANCHES[sample.mingGongBranch]}</dd><dt>Cục</dt><dd>{sample.wuxingJuName}</dd></dl></div>
    </div><p className="home-chart-note">Mẫu danh nhân dùng để nghiên cứu, giờ sinh ước tính. Ngày ngoài phạm vi lịch Việt Nam 1900–2050 sử dụng lịch tham chiếu cũ.</p>
   </section>
   <HomeCalendar initial={today} data={calendarData}/>
  </Container>
  <section className="home-explore" aria-labelledby="home-explore-title">
   <Container className="home-section-heading"><Eyebrow>Khám phá chuyên sâu</Eyebrow><h2 id="home-explore-title">Tinh hoa cổ học phương Đông</h2><Ornament/></Container>
   <Container className="home-primary-grid">
    {primary.map(p=><Link className="brand-frame home-primary-card" key={p.href} href={p.href} prefetch={false}><Icon name={p.icon} size={42}/><div><h3>{p.title}</h3><p>{p.desc}</p></div><span className="home-primary-arrow"><Icon name="arrow" size={16}/></span></Link>)}
   </Container>
   <Container className="home-explore-end"><Link prefetch={false} className="home2-all" href="/cong-cu">Xem tất cả công cụ <Icon name="arrow" size={18}/></Link></Container>
  </section>
  <section className="home-classics" aria-labelledby="home-classics-title">
   <Container className="home-section-heading"><Eyebrow>Thư viện cổ thư</Eyebrow><h2 id="home-classics-title">Kho tàng tri thức phương Đông</h2><Ornament/><p>{ALL_BOOKS.length} bộ cổ thư · {TOTAL_PARAGRAPHS} đoạn tư liệu và dịch giải trong thư viện.</p></Container>
   <Container className="home-classics-grid">
    {ALL_BOOKS.map(book=><Link key={book.slug} href={`/library/${book.slug}`} prefetch={false} className="brand-frame home-classic-card"><span className="home-classic-seal" aria-hidden="true"><Icon name="book" size={34}/></span><div className="home-classic-text"><h3>{book.title}</h3><p>{book.chapters.length} chương / quyển · {book.chapters.reduce((sum,ch)=>sum+ch.paragraphs.length,0)} đoạn</p><span className="home-classic-read">Đọc cổ thư <Icon name="arrow" size={16}/></span></div></Link>)}
   </Container>
  </section>
  <section className="section-dark home2-method" aria-labelledby="home2-method-title"><Container className="home2-method-inner"><div><h2 id="home2-method-title">Minh bạch phương pháp</h2><p>Các nội dung Tử Vi, Kinh Dịch và phong thủy phản ánh hệ thống quan niệm truyền thống, không phải dự báo được khoa học xác nhận. Phần Nhân Kỷ dành cho học tập, không cung cấp chẩn đoán hay hướng dẫn tự điều trị, không thay thế tư vấn y tế. Nội dung, dữ liệu và các công cụ chuyên sâu sẽ được mở rộng cùng tài liệu nguồn được xác minh.</p></div><ButtonLink href="/terms#nguon-va-giay-phep" variant="secondary" className="home2-source">Nguồn và giấy phép</ButtonLink></Container></section>
 </main>;
}
