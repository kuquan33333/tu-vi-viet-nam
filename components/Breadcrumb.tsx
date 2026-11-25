import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export type Crumb={label:string;href:string};
export default function Breadcrumb({items}:{items:readonly Crumb[]}){
 const crumbs=[{label:'Trang chủ',href:'/'},...items];
 const data={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.label,item:SITE_URL+c.href}))};
 return <>
  <nav className="site-wrap breadcrumb" aria-label="Đường dẫn trang">
   <ol>{crumbs.map((c,i)=><li key={c.href}>{i>0&&<span className="crumb-separator" aria-hidden="true">/</span>}{i===crumbs.length-1?<span aria-current="page">{c.label}</span>:<Link href={c.href}>{c.label}</Link>}</li>)}</ol>
  </nav>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}} />
 </>;
}
