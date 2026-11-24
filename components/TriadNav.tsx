import Link from 'next/link';

const LINKS = [
 {href:'/cong-cu',label:'Công cụ'},
 {href:'/chart',label:'Tử Vi'},
 {href:'/thien-ky',label:'Thiên Kỷ'},
 {href:'/dia-ky',label:'Địa Kỷ'},
 {href:'/nhan-ky',label:'Nhân Kỷ'},
];

export default function TriadNav({active}:{active:'thien-ky'|'dia-ky'|'nhan-ky'}) {
 return (
  <div className="study-section-nav">
   <div className="study-container study-nav">
    
    <nav className="study-links" aria-label="Các phân hệ học thuật">
     {LINKS.map(link=><Link key={link.href} href={link.href}
      className={link.href==='/'+active?'active':''}
      aria-current={link.href==='/'+active?'page':undefined}>{link.label}</Link>)}
    </nav>
   </div>
  </div>
 );
}
