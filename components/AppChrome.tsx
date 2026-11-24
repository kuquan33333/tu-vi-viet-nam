'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';
import {useTheme} from '@/components/ThemeProvider';

const sections = [
 {href:'/',label:'Trang chủ'},
 {href:'/chart',label:'Lập lá số'},
 {href:'/hop-ban',label:'Hợp bàn'},
 {href:'/lich-van-nien',label:'Lịch Vạn Niên'},
 {href:'/cong-cu',label:'Công cụ'},
 {href:'/library',label:'Thư viện'},
 {href:'/ho-so',label:'Hồ sơ'},
];
const mobileSections=[...sections,{href:'/thien-ky',label:'Thiên Kỷ'},{href:'/dia-ky',label:'Địa Kỷ'},{href:'/nhan-ky',label:'Nhân Kỷ'},{href:'/knowledge',label:'Kho kiến thức'}];
const quick = [
 {href:'/',label:'Trang chủ',symbol:'⌂'},
 {href:'/chart',label:'Lá số',symbol:'☷'},
 {href:'/cong-cu',label:'Công cụ',symbol:'✦'},
 {href:'/library',label:'Thư viện',symbol:'▤'},
 {href:'/ho-so',label:'Hồ sơ',symbol:'◇'},
];

export default function AppChrome({children}:{children:React.ReactNode}){
 const path=usePathname()||'/';
 const {theme,toggle}=useTheme();
 const [open,setOpen]=useState(false);
 useEffect(()=>{setOpen(false);},[path]);
 const active=(href:string)=>href==='/'?path==='/':href==='/cong-cu'?['/cong-cu','/thien-ky','/dia-ky','/nhan-ky','/knowledge'].includes(path)||path.startsWith('/knowledge/'):(path===href||path.startsWith(href+'/'));
 return <>
  <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
  <header className="global-header">
   <div className="site-wrap header-inner">
    <Link className="brand-wordmark" href="/" aria-label="Tử Vi Đẩu Số – về trang chủ">
     <span className="brand-symbol" aria-hidden="true">✳</span>
     <span>TỬ VI <em>ĐẨU SỐ</em><small>THƯ QUÁN PHƯƠNG ĐÔNG</small></span>
    </Link>
    <nav className="desktop-links" aria-label="Điều hướng chính">
     <Link href="/" className={active('/')?'is-active':''}>Trang chủ</Link>
     <Link href="/chart" className={active('/chart')?'is-active':''}>Lá số</Link>
     <Link href="/thien-ky" className={active('/thien-ky')?'is-active':''}>Thiên Kỷ</Link>
     <Link href="/dia-ky" className={active('/dia-ky')?'is-active':''}>Địa Kỷ</Link>
     <Link href="/nhan-ky" className={active('/nhan-ky')?'is-active':''}>Nhân Kỷ</Link>
     <Link href="/library" className={active('/library')?'is-active':''}>Thư viện</Link>
    </nav>
    <div className="header-utilities">
     <button type="button" className="theme-switch" aria-label={theme==='dark'?'Chuyển sang chế độ sáng':'Chuyển sang chế độ tối'} onClick={toggle} title="Đổi giao diện">{theme==='dark'?'☀':'☾'}</button>
     <Link href="/chart" className="header-cta">Lập lá số</Link>
     <button type="button" className="mobile-menu-button" onClick={()=>setOpen(o=>!o)} aria-expanded={open} aria-controls="mobile-site-menu" aria-label={open?'Đóng menu':'Mở menu'}>{open?'✕':'☰'}</button>
    </div>
   </div>
   {open&&<nav className="mobile-site-menu" id="mobile-site-menu" aria-label="Menu toàn website">
     <div className="site-wrap">
      <p className="eyebrow" style={{padding:'12px 2px'}}>KHÁM PHÁ THƯ QUÁN</p>
      {mobileSections.map(s=><Link key={s.href} href={s.href} aria-current={active(s.href)?'page':undefined} className={active(s.href)?'is-active':''}>{s.label}<span aria-hidden="true">→</span></Link>)}
      <div className="menu-caption">Tri thức truyền thống dành cho mục đích văn hóa và tham khảo.</div>
     </div>
    </nav>}
  </header>
  <div id="main-content" className="app-content" tabIndex={-1}>{children}</div>
  <footer className="global-footer">
   <div className="site-wrap footer-grid">
    <div><div className="footer-brand">✳ TỬ VI ĐẨU SỐ</div><p>Nền tảng nghiên cứu và trải nghiệm văn hóa phương Đông. Phép tính minh bạch, thông tin có nguồn gốc.</p></div>
    <div><strong>Khám phá</strong><Link href="/chart">Lá số Tử Vi</Link><Link href="/hop-ban">Hợp bàn</Link><Link href="/cong-cu">Công cụ</Link><Link href="/ho-so">Hồ sơ</Link><Link href="/thien-ky">Thiên Kỷ</Link><Link href="/dia-ky">Địa Kỷ</Link><Link href="/nhan-ky">Nhân Kỷ</Link></div>
    <div><strong>Tư liệu</strong><Link href="/library">Thư viện cổ thư</Link><Link href="/lich-van-nien">Lịch Vạn Niên</Link><Link href="/privacy">Quyền riêng tư</Link><Link href="/terms">Điều khoản</Link></div>
   </div>
   <div className="site-wrap footer-bottom"><span>© 2026 Tử Vi Đẩu Số · Định hướng nghiên cứu cổ học</span><span>Không thay thế tư vấn y tế, pháp lý hoặc tài chính</span></div>
  </footer>
  <nav className="bottom-nav" aria-label="Điều hướng nhanh trên điện thoại">
   {quick.map(q=><Link key={q.href} href={q.href} aria-current={active(q.href)?'page':undefined} className={active(q.href)?'active':''}>
     <span className="bottom-symbol" aria-hidden="true">{q.symbol}</span><span>{q.label}</span>
   </Link>)}
  </nav>
 </>;
}
