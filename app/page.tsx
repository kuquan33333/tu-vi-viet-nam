import Link from 'next/link';
import { pageMetadata, SITE_DESCRIPTION, websiteSchema } from '@/lib/seo/metadata';
export const metadata = pageMetadata({title:'Tử Vi Đẩu Số – Lá số, lịch pháp và cổ học phương Đông',description:SITE_DESCRIPTION,path:'/'});

const palaces = [
 ['Mệnh',1,1],['Phụ Mẫu',1,2],['Phúc Đức',1,3],['Điền Trạch',1,4],
 ['Huynh Đệ',2,1],['Quan Lộc',2,4],['Phu Thê',3,1],['Nô Bộc',3,4],
 ['Tử Tức',4,1],['Tài Bạch',4,2],['Tật Ách',4,3],['Thiên Di',4,4],
] as const;
const modules = [
 {href:'/chart',mark:'☷',title:'Tử Vi Đẩu Số',sub:'12 cung · 14 chính tinh',desc:'Lập và khám phá lá số với lịch âm dương, an sao và chu kỳ đại hạn.',tag:'LẬP LÁ SỐ'},
 {href:'/thien-ky',mark:'☯',title:'Thiên Kỷ',sub:'Chu Dịch · Kỳ Môn',desc:'Gieo quẻ 64 quẻ, nghiên cứu biến hào và bảng địa bàn cửu cung.',tag:'KHÁM PHÁ'},
 {href:'/dia-ky',mark:'⊕',title:'Địa Kỷ',sub:'La Kinh · Bát Trạch',desc:'La bàn 24 sơn, định hướng và khảo sát phong thủy truyền thống.',tag:'XEM CÔNG CỤ'},
 {href:'/nhan-ky',mark:'✺',title:'Nhân Kỷ',sub:'Y thư · Huyệt đạo',desc:'Tìm hiểu kinh điển Đông y và tra cứu danh mục 361 huyệt.',tag:'TRA CỨU'},
];
const tools = [
 {href:'/hop-ban',icon:'∞',title:'Đối chiếu hai lá số',desc:'Hai mệnh bàn, báo cáo yếu tố chung và khác biệt'},
 {href:'/lich-van-nien',icon:'◷',title:'Lịch Vạn Niên',desc:'Âm dương lịch, Can Chi và các mốc tiết khí'},
 {href:'/thien-ky',icon:'☰',title:'Tra cứu Kinh Dịch',desc:'Danh mục 64 quẻ cùng sơ đồ hào động'},
 {href:'/dia-ky',icon:'⌖',title:'La Kinh 24 sơn',desc:'La bàn số theo 360° và tám hướng'},
 {href:'/nhan-ky',icon:'✳',title:'Atlas huyệt đạo',desc:'14 kinh mạch, tìm kiếm mã huyệt'},
 {href:'/library',icon:'▤',title:'Thư viện cổ thư',desc:'Tra cứu nội dung văn bản truyền thống'},
];

export default function HomePage(){
 return <main>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema()).replace(/</g,'\\u003c')}} />
  <section className="home-hero">
   <div className="site-wrap home-hero-grid">
    <div>
     <div className="hero-overline">TRI THỨC PHƯƠNG ĐÔNG · TRẢI NGHIỆM HIỆN ĐẠI</div>
     <h1 className="hero-display" style={{marginTop:20}}>Thấu hiểu cổ học.<span style={{display:'block',color:'var(--ac-dim)'}}>Khám phá cùng bạn.</span></h1>
     <p className="lead">Tử Vi Đẩu Số, Thiên Kỷ, Địa Kỷ và Nhân Kỷ — một không gian nghiên cứu thống nhất, nơi mỗi công cụ có phương pháp tính và tư liệu tham khảo rõ ràng.</p>
     <div className="hero-actions">
      <Link href="/chart" className="action-primary">Lập lá số miễn phí <span aria-hidden="true">→</span></Link>
      <Link href="/cong-cu" className="action-outline">Khám phá công cụ</Link>
     </div>
     <div className="hero-trust"><span>Không cần đăng ký</span><span>Tính toán trên thiết bị</span><span>Giao diện Việt hóa</span></div>
    </div>
    <div className="hero-visual" aria-label="Minh họa lá số Tử Vi 12 cung">
     <div className="preview-board">
      {palaces.map(([name,row,col])=><div className={'preview-palace'+(name==='Mệnh'?' main':'')} key={name} style={{gridRow:row,gridColumn:col}}>{name}</div>)}
      <div className="preview-palace mid">☯<small>THIÊN · ĐỊA · NHÂN</small></div>
     </div>
     <div className="hero-float">✦ Tinh bàn · Can Chi · Tứ Hóa</div>
    </div>
   </div>
  </section>

  <section className="home-section" style={{background:'var(--bg-1)',borderBlock:'1px solid var(--bdr)'}}>
   <div className="site-wrap">
    <div className="section-head">
     <div><div className="eyebrow">BỐN NHÁNH TRI THỨC</div><h2 className="display-small">Một hệ thống, bốn cánh cửa.</h2><p>Chọn lĩnh vực bạn quan tâm. Mỗi phân hệ có công cụ tương tác và tư liệu đi kèm.</p></div>
    </div>
    <div className="module-grid">
     {modules.map(m=><Link key={m.href} href={m.href} className="surface-card module-card">
       <div className="module-symbol" aria-hidden="true">{m.mark}</div>
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
    <div className="feature-split">
     <div className="surface-card feature-copy">
      <div className="eyebrow">LÁ SỐ TỬ VI</div>
      <h2 className="display-small" style={{margin:'15px 0'}}>Không chỉ lập lá số, mà còn giúp bạn hiểu cấu trúc.</h2>
      <p className="lead">Tính lá số từ ngày giờ sinh và địa phương tại Việt Nam, xem 12 cung, các chính tinh, đại hạn và lưu niên. Chạm vào từng sao để tìm hiểu ý nghĩa truyền thống.</p>
      <div className="feature-list"><span>Âm lịch và Chân Thái Dương Thời</span><span>12 cung · 14 chính tinh · Tứ Hóa</span><span>Lưu hồ sơ và xuất bản in</span></div>
      <div><Link href="/chart" className="action-primary">Mở bàn lá số →</Link></div>
     </div>
     <div className="surface-card feature-board">
      <div className="eyebrow" style={{marginBottom:18}}>CHẾ ĐỘ NGHIÊN CỨU LÁ SỐ</div>
      <div className="preview-board" style={{width:'min(100%,350px)',transform:'none',margin:'auto'}}>
       {palaces.map(([name,row,col])=><div className={'preview-palace'+(name==='Mệnh'?' main':'')} key={name} style={{gridRow:row,gridColumn:col}}>{name}</div>)}
       <div className="preview-palace mid">☯<small>12 CUNG · TỬ VI</small></div>
      </div>
      <p style={{fontSize:11,lineHeight:1.8,color:'var(--tx-3)',textAlign:'center',marginTop:19}}>Minh họa bố cục 12 cung. Lá số thực được tính theo thông tin bạn nhập.</p>
     </div>
    </div>
   </div>
  </section>

  <section className="home-section">
   <div className="site-wrap">
    <div className="section-head">
     <div><div className="eyebrow">CÔNG CỤ NỔI BẬT</div><h2 className="display-small">Tìm hiểu theo cách của bạn.</h2><p>Các công cụ được tổ chức theo nhu cầu sử dụng, không yêu cầu học hết lý thuyết trước khi bắt đầu.</p></div>
     <Link className="section-link" href="/library">Mở thư viện →</Link>
    </div>
    <div className="tools-grid">
     {tools.map(t=><Link key={t.href+t.title} href={t.href} className="surface-card tools-card">
       <div className="icon-round">{t.icon}</div><div><strong>{t.title}</strong><span>{t.desc}</span></div><span style={{marginLeft:'auto',color:'var(--ac-dim)'}}>→</span>
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
