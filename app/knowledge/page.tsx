import Icon from '@/components/Icon';
import { pageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import {STAR_DESCRIPTIONS} from '@/lib/ziwei/constants';
export const metadata = pageMetadata({title:"Kho kiến thức 14 chính tinh – Tử Vi Đẩu Số",description:"Tra cứu 14 chính tinh, ngũ hành và đặc tính theo hệ thống Tử Vi truyền thống.",path:"/knowledge"});
const names=Object.keys(STAR_DESCRIPTIONS);
export default function KnowledgePage(){
 return <main className="site-wrap page-content">
  <div className="tool-hero">
   <div className="eyebrow">THƯ VIỆN TRI THỨC · 14 CHÍNH TINH</div>
   <h1 className="display-small">Kho kiến thức Tử Vi</h1>
   <p className="lead" style={{maxWidth:760}}>Tìm hiểu ngôn ngữ cổ học của 14 chính tinh: tên sao, từ khóa, ngũ hành và đặc tính thường được mô tả trong tư liệu Tử Vi. Nội dung biên soạn ngắn, không giả danh bộ dữ liệu 182 chuyên đề chưa được phát hành.</p>
  </div>
  <div className="module-grid" style={{marginBottom:30}}>
   {names.map((name,i)=>{
    const star=STAR_DESCRIPTIONS[name];
    return <article key={name} className="surface-card module-card" id={'sao-'+i} style={{minHeight:200}}>
     <div className="module-symbol" style={{fontFamily:'var(--font-serif)'}}>✶</div>
     <h2 style={{fontFamily:'var(--font-serif)',fontSize:20,color:'var(--tx-0)',fontWeight:700,margin:'19px 0 5px'}}>{name}</h2>
     <p style={{fontSize:12,color:'var(--ac-dim)',fontWeight:750}}>{star.element} · {star.nature}</p>
     <p style={{fontSize:12,marginTop:11,lineHeight:1.8,color:'var(--tx-2)'}}>{star.keywords}</p>
    </article>;
   })}
  </div>
  <section className="surface-card" style={{padding:25,margin:'18px 0'}}>
   <div className="eyebrow">HƯỚNG DẪN TRA CỨU</div>
   <h2 className="display-small" style={{fontSize:25,margin:'9px 0'}}>Từ sao đến lá số thực tế</h2>
   <p className="lead" style={{fontSize:13}}>Mỗi chính tinh có thể mang ý nghĩa khác nhau trong các cung và trường phái. Để hiểu cấu trúc của một lá số, cần xem chính tinh, các sao cùng cung, đối cung, tam hợp, Tứ Hóa và dữ liệu năm sinh thay vì tách một từ khóa thành kết luận chắc chắn.</p>
   <Link href="/chart" className="action-primary" style={{marginTop:17}}>Lập lá số và chọn sao <Icon name="arrow" size={16}/></Link>
  </section>
  <div className="home-note">Giải thích mang tính giáo dục theo hệ thống thuật số truyền thống. Những lời trích được gán cho nhân vật lịch sử cần được xác minh nguồn và quyền sử dụng trước khi xuất bản; chưa bao gồm cơ sở dữ liệu luận giải chuyên sâu của tác giả gốc.</div>
 </main>;
}
