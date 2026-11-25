'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import Icon,{type IconName} from '../Icon';
import BrandMark from './BrandMark';
export const desktopLinks=[{href:'/',label:'Trang chủ'},{href:'/chart',label:'Lập lá số'},{href:'/lich-van-nien',label:'Lịch Vạn Niên'},{href:'/hop-ban',label:'Hợp bàn'},{href:'/library',label:'Thư viện'}];
const symbols:Record<string,IconName>={'/':'home','/chart':'chart','/lich-van-nien':'calendar','/hop-ban':'compare','/library':'book'};
const toolLinks=[{href:'/cong-cu',label:'Tất cả công cụ'},{href:'/thien-ky',label:'Thiên Kỷ'},{href:'/dia-ky',label:'Địa Kỷ'},{href:'/nhan-ky',label:'Nhân Kỷ'},{href:'/knowledge',label:'Kho kiến thức'},{href:'/ho-so',label:'Hồ sơ'}];
export function isActive(path:string,href:string){return href==='/'?path==='/':path===href||path.startsWith(href+'/')}
const allLinks=[...desktopLinks,...toolLinks];
export default function Header({path}:{path:string}){
 const [open,setOpen]=useState(false),[tools,setTools]=useState(false),menu=useRef<HTMLButtonElement>(null),toolButton=useRef<HTMLButtonElement>(null),toolRoot=useRef<HTMLDivElement>(null);
 useEffect(()=>{setOpen(false);setTools(false)},[path]);
 useEffect(()=>{if(!open&&!tools)return;
  const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(open){setOpen(false);menu.current?.focus()}else{setTools(false);toolButton.current?.focus()}}};
  const outside=(e:PointerEvent)=>{if(tools&&!toolRoot.current?.contains(e.target as Node))setTools(false)};
  window.addEventListener('keydown',close);window.addEventListener('pointerdown',outside);
  return()=>{window.removeEventListener('keydown',close);window.removeEventListener('pointerdown',outside)};
 },[open,tools]);
 return <header className="global-header ui-header brand-header">
  <div className="site-wrap header-inner">
   <Link href="/" prefetch={false} className="brand-wordmark" aria-label="Tử Vi Việt Nam – về trang chủ"><BrandMark/></Link>
   <nav className="desktop-links" aria-label="Điều hướng chính">{desktopLinks.map(s=><Link key={s.href} href={s.href} prefetch={false} aria-current={isActive(path,s.href)?'page':undefined} className={isActive(path,s.href)?'is-active':''}><Icon name={symbols[s.href]} size={19}/>{s.label}</Link>)}
    <div className="brand-tools-menu" ref={toolRoot}>
     <button type="button" ref={toolButton} className={'brand-tools-toggle'+(toolLinks.some(s=>isActive(path,s.href))?' is-active':'')} aria-expanded={tools} aria-controls="desktop-tools-menu" onClick={()=>setTools(v=>!v)}><Icon name="tools" size={19}/> Công cụ <span className="brand-chevron"><Icon name="arrow" size={12}/></span></button>
     <div id="desktop-tools-menu" className="brand-tools-dropdown" hidden={!tools}>{toolLinks.map(s=><Link key={s.href} href={s.href} prefetch={false} aria-current={isActive(path,s.href)?'page':undefined} onClick={()=>setTools(false)}>{s.label}</Link>)}</div>
    </div>
   </nav>
   <div className="header-utilities">
    <Link href="/chart" prefetch={false} className="header-cta brand-primary"><Icon name="yin-yang" size={20}/> Lập lá số ngay</Link>
    <button ref={menu} type="button" className="mobile-menu-button" aria-label={open?'Đóng menu':'Mở menu'} aria-expanded={open} aria-controls="mobile-site-menu" onClick={()=>setOpen(v=>!v)}><Icon name={open?'close':'menu'} size={28}/></button>
   </div>
  </div>
  <nav hidden={!open} className="mobile-site-menu" id="mobile-site-menu" aria-label="Menu toàn website"><div className="site-wrap">{allLinks.map(s=><Link key={s.href} href={s.href} prefetch={false} aria-current={isActive(path,s.href)?'page':undefined} className={isActive(path,s.href)?'is-active':''} onClick={()=>setOpen(false)}>{s.label}<Icon name="arrow" size={18}/></Link>)}<p className="menu-caption">Tri thức truyền thống dành cho mục đích văn hóa và tham khảo.</p></div></nav>
 </header>;
}
