'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import Icon from '../Icon';
export const desktopLinks=[{href:'/chart',label:'Lá số'},{href:'/lich-van-nien',label:'Lịch Vạn Niên'},{href:'/thien-ky',label:'Thiên Kỷ'},{href:'/dia-ky',label:'Địa Kỷ'},{href:'/nhan-ky',label:'Nhân Kỷ'},{href:'/library',label:'Thư viện'}];
export function isActive(path:string,href:string){return href==='/'?path==='/':path===href||path.startsWith(href+'/')}
const allLinks=[{href:'/',label:'Trang chủ'},...desktopLinks,{href:'/hop-ban',label:'Hợp bàn'},{href:'/cong-cu',label:'Công cụ'},{href:'/knowledge',label:'Kho kiến thức'},{href:'/ho-so',label:'Hồ sơ'}];
export default function Header({path}:{path:string}){
 const [open,setOpen]=useState(false),menu=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setOpen(false)},[path]);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);menu.current?.focus()}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[open]);
 return <header className="global-header ui-header">
  <div className="site-wrap header-inner">
   <Link href="/" prefetch={false} className="brand-wordmark" aria-label="Tử Vi Đẩu Số – về trang chủ"><span className="brand-symbol"><Icon name="logo" size={32}/></span><span>Tử Vi Đẩu Số</span></Link>
   <nav className="desktop-links" aria-label="Điều hướng chính">{desktopLinks.map(s=><Link key={s.href} href={s.href} prefetch={false} aria-current={isActive(path,s.href)?'page':undefined} className={isActive(path,s.href)?'is-active':''}>{s.label}</Link>)}</nav>
   <div className="header-utilities">
    <Link href="/ho-so" prefetch={false} className={'header-profile'+(isActive(path,'/ho-so')?' is-active':'')} aria-current={isActive(path,'/ho-so')?'page':undefined}>Hồ sơ</Link>
    <Link href="/chart" prefetch={false} className="header-cta">Lập lá số</Link>
    <button ref={menu} type="button" className="mobile-menu-button" aria-label={open?'Đóng menu':'Mở menu'} aria-expanded={open} aria-controls="mobile-site-menu" onClick={()=>setOpen(v=>!v)}><Icon name={open?'close':'menu'} size={24}/></button>
   </div>
  </div>
  <nav hidden={!open} className="mobile-site-menu" id="mobile-site-menu" aria-label="Menu toàn website"><div className="site-wrap">{allLinks.map(s=><Link key={s.href} href={s.href} prefetch={false} aria-current={isActive(path,s.href)?'page':undefined} className={isActive(path,s.href)?'is-active':''} onClick={()=>setOpen(false)}>{s.label}<Icon name="arrow" size={18}/></Link>)}<p className="menu-caption">Tri thức truyền thống dành cho mục đích văn hóa và tham khảo.</p></div></nav>
 </header>;
}
