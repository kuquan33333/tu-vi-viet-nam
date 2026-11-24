import Link from 'next/link';
import Icon,{type IconName} from '@/components/Icon';
import {generateChart} from '@/lib/ziwei/algorithm';
import {BRANCHES} from '@/lib/ziwei/constants';
import { pageMetadata, SITE_DESCRIPTION, websiteSchema } from '@/lib/seo/metadata';
export const metadata = pageMetadata({title:'Tử Vi Đẩu Số – Lá số, lịch pháp và cổ học phương Đông',description:SITE_DESCRIPTION,path:'/'});

const POS:Record<number,[number,number]>={5:[1,1],6:[1,2],7:[1,3],8:[1,4],4:[2,1],9:[2,4],3:[3,1],10:[3,4],2:[4,1],1:[4,2],0:[4,3],11:[4,4]};
const modules = [
 {href:'/chart',mark:'chart' as IconName,title:'Tử Vi Đẩu Số',sub:'12 cung · 14 chính tinh',desc:'Lập và khám phá lá số với lịch âm dương, an sao và chu kỳ đại hạn.',tag:'LẬP LÁ SỐ'},
 {href:'/thien-ky',mark:'tools' as IconName,title:'Thiên Kỷ',sub:'Chu Dịch · Kỳ Môn',desc:'Gieo quẻ 64 quẻ, nghiên cứu biến hào và bảng địa bàn cửu cung.',tag:'KHÁM PHÁ'},
 {href:'/dia-ky',mark:'compass' as IconName,title:'Địa Kỷ',sub:'La Kinh · Bát Trạch',desc:'La bàn 24 sơn, định hướng và khảo sát phong thủy truyền thống.',tag:'XEM CÔNG CỤ'},
 {href:'/nhan-ky',mark:'health' as IconName,title:'Nhân Kỷ',sub:'Y thư · Huyệt đạo',desc:'Tìm hiểu kinh điển Đông y và tra cứu danh mục 361 huyệt.',tag:'TRA CỨU'},
];
const tools = [
 {href:'/hop-ban',icon:'compare' as IconName,title:'Đối chiếu hai lá số',desc:'Hai mệnh bàn, báo cáo yếu tố chung và khác biệt'},
 {href:'/lich-van-nien',icon:'calendar' as IconName,title:'Lịch Vạn Niên',desc:'Âm dương lịch, Can Chi và các mốc tiết khí'},
 {href:'/thien-ky',icon:'book' as IconName,title:'Tra cứu Kinh Dịch',desc:'Danh mục 64 quẻ cùng sơ đồ hào động'},
 {href:'/dia-ky',icon:'compass' as IconName,title:'La Kinh 24 sơn',desc:'La bàn số theo 360° và tám hướng'},
 {href:'/nhan-ky',icon:'health' as IconName,title:'Atlas huyệt đạo',desc:'14 kinh mạch, tìm kiếm mã huyệt'},
 {href:'/library',icon:'book' as IconName,title:'Thư viện cổ thư',desc:'Tra cứu nội dung văn bản truyền thống'},
];

export default function HomePage(){
 const sample=generateChart({year:1990,month:5,day:6,hour:4,gender:'male',name:'Dữ liệu mẫu'});
 return <main>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema()).replace(/</g,'\\u003c')}} />
  <section className="home-hero">
   <div className="site-wrap home-hero-grid">
    <div>
     <div className="hero-overline">TRI THỨC PHƯƠNG ĐÔNG · TRẢI NGHIỆM HIỆN ĐẠI</div>
     <h1 className="hero-display" style={{marginTop:20}}>Thấu hiểu cổ học.<span style={{display:'block',color:'var(--ac-dim)'}}>Khám phá cùng bạn.</span></h1>
     <p className="lead">Tử Vi Đẩu Số, Thiên Kỷ, Địa Kỷ và Nhân Kỷ — một không gian nghiên cứu thống nhất, nơi mỗi công cụ có phương pháp tính và tư liệu tham khảo rõ ràng.</p>
     <div className="hero-actions">
      <Link prefetch={false} href="/chart" className="action-primary">Lập lá số miễn phí <span aria-hidden="true">→</span></Link>

     </div>
     <div className="hero-trust"><span>Không cần đăng ký</span><span>Tính toán trên thiết bị</span><span>Giao diện Việt hóa</span></div>
    </div>
    <div className="hero-visual" aria-label="Lá số mẫu được tính từ dữ liệu giả định">
     <div className="preview-board">
      {sample.palaces.map(p=><div className={'preview-palace'+(p.isMingGong?' main':'')} key={p.branch} style={{gridRow:POS[p.branch][0],gridColumn:POS[p.branch][1]}}><strong>{p.name}</strong><small>{BRANCHES[p.branch]}</small><small>{p.stars.filter(s=>s.type==='major').map(s=>s.name).join(' · ')||'Vô chính diệu'}</small></div>)}
      <div className="preview-palace mid"><Icon name="chart" size={28}/><small>DỮ LIỆU MẪU</small><small>06/05/1990 · giờ Thìn</small><small>{sample.wuxingJuName}</small></div>
     </div>
     <p className="sample-caption">Lá số tính thật từ dữ liệu giả định, không phải hồ sơ cá nhân.</p>
    </div>
   </div>
  </section>

  <section className="home-section" style={{background:'var(--bg-1)',borderBlock:'1px solid var(--bdr)'}}>
   <div className="site-wrap">
    <div className="section-head">
     <div><div className="eyebrow">BỐN NHÁNH TRI THỨC</div><h2 className="display-small">Một hệ thống, bốn cánh cửa.</h2><p>Chọn lĩnh vực bạn quan tâm. Mỗi phân hệ có công cụ tương tác và tư liệu đi kèm.</p></div>
    </div>
    <div className="module-grid">
     {modules.map(m=><Link prefetch={false} key={m.href} href={m.href} className="surface-card module-card">
       <div className="module-symbol"><Icon name={m.mark} size={26}/></div>
       <h3>{m.title}</h3>
       <div style={{fontSize:11,fontWeight:800,color:'var(--ac-dim)',marginBottom:10}}>{m.sub}</div>
       <p>{m.desc}</p>
       <div className="arrow"><span>{m.tag}</span><span>→</span></div>
      </Link>)}
    </div>
   </div>
  </section>

  <section className="home-section">
   <div className="site-wrap">
    <div className="section-head">
     <div><div className="eyebrow">CÔNG CỤ NỔI BẬT</div><h2 className="display-small">Tìm hiểu theo cách của bạn.</h2><p>Các công cụ được tổ chức theo nhu cầu sử dụng, không yêu cầu học hết lý thuyết trước khi bắt đầu.</p></div>
     <Link prefetch={false} className="section-link" href="/library">Mở thư viện →</Link>
    </div>
    <div className="tools-grid">
     {tools.map(t=><Link prefetch={false} key={t.href+t.title} href={t.href} className="surface-card tools-card">
       <div className="icon-round"><Icon name={t.icon} size={22}/></div><div><strong>{t.title}</strong><span>{t.desc}</span></div><span style={{marginLeft:'auto',color:'var(--ac-dim)'}}>→</span>
     </Link>)}
    </div>
   </div>
  </section>

  <section className="home-section">
   <div className="site-wrap">
    <div className="small-stats">
     <div className="surface-card stat-box"><div className="stat-number">64</div><div className="stat-caption">Quẻ Chu Dịch trong bộ tra cứu</div></div>
     <div className="surface-card stat-box"><div className="stat-number">24</div><div className="stat-caption">Sơn hướng La Kinh</div></div>
     <div className="surface-card stat-box"><div className="stat-number">361</div><div className="stat-caption">Mã huyệt trong danh mục học thuật</div></div>
    </div>
    <div className="home-note"><strong style={{color:'var(--tx-0)'}}>Minh bạch phương pháp:</strong> Các nội dung Tử Vi, Kinh Dịch và phong thủy phản ánh hệ thống quan niệm truyền thống, không phải dự báo được khoa học xác nhận. Phần Nhân Kỷ dành cho học tập, không cung cấp chẩn đoán hay hướng dẫn tự điều trị. Nội dung, dữ liệu và các công cụ chuyên sâu sẽ được mở rộng cùng tài liệu nguồn được xác minh.</div>
   </div>
  </section>
 </main>;
}
